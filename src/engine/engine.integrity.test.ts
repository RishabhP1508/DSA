// @vitest-environment node
import {it,expect,vi} from 'vitest';
import {ExecutionEngine} from './engine';
import type {InboundMessage} from './protocol';
import type {TraceEvent} from '../core/types';
class Fake {
  onmessage:((ev:{data:unknown})=>void)|null=null;onerror:(()=>void)|null=null;
  posted:InboundMessage[]=[];terminated=false;seq=0;
  postMessage(m:InboundMessage){this.posted.push(m);}terminate(){this.terminated=true;}
  emit(kind:string,payload:unknown={},over:Record<string,unknown>={}){const m=this.posted[0];this.onmessage?.({data:{v:1,runId:m.runId,owner:m.owner,sourceRev:m.sourceRev,inputRev:m.inputRev,seq:this.seq++,kind,payload,...over}});}
}
const step=(index:number):TraceEvent=>({index,kind:'line',line:1,frames:[],objects:{}});
const setup=()=>{const w=new Fake();const engine=new ExecutionEngine({workerFactory:()=>w as unknown as Worker});return {w,engine};};
it('rejects mismatched owner and source correlation',async()=>{const {w,engine}=setup();const p=engine.run('x=1',{owner:'a'});w.emit('exec-start',{}, {owner:'b'});expect(engine.state).toBe('initializing');w.emit('exec-start',{}, {sourceRev:0});expect(engine.state).toBe('initializing');engine.stop();await p;});
it('rejects replayed sequence numbers and duplicate event indices',async()=>{const {w,engine}=setup();const p=engine.run('x=1');w.emit('exec-start');w.emit('trace-batch',{events:[step(0)]});w.emit('trace-batch',{events:[step(1)]},{seq:1});w.emit('trace-batch',{events:[step(0)]});engine.stop();expect((await p).events.map(x=>x.index)).toEqual([0]);});
it('honors a smaller requested wall clock budget',async()=>{vi.useFakeTimers();const {w,engine}=setup();const p=engine.run('while True: pass',{limits:{timeMs:25}});w.emit('exec-start');vi.advanceTimersByTime(26);expect(engine.state).toBe('timeout');engine.stop();await p;vi.useRealTimers();});
it('stops untrusted cumulative traces at the requested event budget',async()=>{const {w,engine}=setup();const p=engine.run('pass',{limits:{maxEvents:2}});w.emit('exec-start');w.emit('trace-batch',{events:[step(0),step(1),step(2)]});expect(engine.state).toBe('event-limit');engine.stop();const r=await p;expect(r.events).toHaveLength(2);expect(r.incomplete).toBe(true);});
it('keeps stop partial states and identifies user stop',async()=>{const {w,engine}=setup();const p=engine.run('pass');w.emit('exec-start');w.emit('trace-batch',{events:[step(0)]});engine.stop();const r=await p;expect(r.events).toHaveLength(1);expect(r.incomplete).toBe(true);expect(r.stopReason).toBe('user');});
it('reports live progress before a terminal result',async()=>{const {w,engine}=setup();const received:number[]=[];engine.subscribeProgress(x=>received.push(x.eventCount));const p=engine.run('pass');w.emit('exec-start');w.emit('trace-batch',{events:[step(0)]});expect(received).toContain(1);engine.stop();await p;});
it('resolves worker construction failures without throwing',async()=>{const engine=new ExecutionEngine({workerFactory:()=>{throw Error('blocked')}});const result=await engine.run('pass');expect(result.status).toBe('error');});
