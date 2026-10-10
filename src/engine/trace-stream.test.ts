// @vitest-environment node
import {expect,it} from 'vitest';
import {TraceStream} from './trace-stream';
import {Replay} from './replay';
import type {TraceEvent} from '../core/types';
const state=(index:number,text?:string):TraceEvent=>({index,kind:'line',line:1,frames:[],objects:{},...(text?{output:{stream:'stdout' as const,text}}:{})});
it('streams first state immediately and sends each later state once across batch plus tail',()=>{const sent:TraceEvent[][]=[];let time=0;const stream=new TraceStream(x=>sent.push(x),()=>time);stream.push(state(0));expect(sent.flat()).toHaveLength(1);for(let i=1;i<150;i++){time+=1;stream.push(state(i));}const events=sent.flat().concat(stream.finish());expect(events.map(x=>x.index)).toEqual(Array.from({length:150},(_,i)=>i));expect(sent.every(x=>x.length<=64)).toBe(true);expect(stream.finish()).toEqual([]);});
it('flushes on UTF-8 bytes rather than JavaScript characters',()=>{const sent:TraceEvent[][]=[];const stream=new TraceStream(x=>sent.push(x),()=>0);stream.push(state(0));stream.push(state(1,'🚀'.repeat(10000)));stream.push(state(2,'🚀'.repeat(10000)));expect(sent.map(x=>x.length)).toEqual([1,1]);expect(stream.finish()).toHaveLength(1);});
it('never reveals uncaptured later output at the end of a partial trace',()=>{const replay=new Replay({runId:1,status:'stopped',incomplete:true,events:[state(0)],stdout:'later',stderr:''});expect(replay.outputSoFar()).toBe('');});
it('backward replay restores the output prefix',()=>{const replay=new Replay({runId:1,status:'completed',events:[state(0),state(1,'first\n'),state(2,'last\n')],stdout:'first\nlast\n',stderr:''});replay.seek(2);expect(replay.outputSoFar()).toBe('first\nlast\n');replay.prev();expect(replay.outputSoFar()).toBe('first\n');replay.prev();expect(replay.outputSoFar()).toBe('');});
