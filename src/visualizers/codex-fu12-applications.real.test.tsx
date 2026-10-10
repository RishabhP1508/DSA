// @vitest-environment node
import {expect,it} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {taskScheduler} from '../content/lessons/task-scheduler';
import {meetingRoomsII} from '../content/lessons/meeting-rooms-ii';
import {Visualizer} from './index';
import {resolveBindingObject,resolveVariable} from './helpers';
import type {TraceEvent,TraceValue,VisualBinding} from '../core/types';
// @ts-expect-error Shared bundled-runtime harness is JavaScript.
import {runProgram} from '../../scripts/lib/pyodide-harness.mjs';

const items=[taskScheduler,meetingRoomsII];
const traces=new Map<string,TraceEvent[]>();
async function events(item:typeof items[number]){
 if(!traces.has(item.id)){
  const r=await runProgram(item.code);
  expect(r.status,item.id).toBe('completed');
  expect(r.stdout,item.id).toBe(item.expectedOutput);
  traces.set(item.id,r.events);
 }
 return traces.get(item.id)!;
}
function decode(e:TraceEvent,v:TraceValue|undefined):unknown{
 if(!v)return undefined;
 if(v.kind==='none')return null;
 if(v.kind==='ref')return e.objects[v.id]?.entries?.map(entry=>decode(e,entry.value))??e.objects[v.id]?.repr;
 if(v.kind==='unknown')return v.repr;
 return v.value;
}
const read=(e:TraceEvent,name:string)=>decode(e,resolveVariable(e,name));
const draw=(e:TraceEvent,b:VisualBinding)=>renderToStaticMarkup(<Visualizer event={e} binding={b}/>);

it('both new applications render every binding from actual recorded locals',async()=>{
 for(const item of items){
  const trace=await events(item);
  for(const binding of item.bindings){
   const event=trace.find(e=>binding.model==='object'?!!resolveBindingObject(e,binding).value:!!resolveBindingObject(e,binding).object);
   expect(event,`${item.id}:${binding.variable}`).toBeDefined();
   expect(draw(event!,binding),`${item.id}:${binding.variable}`).toContain('<svg');
  }
 }
},120_000);

it('scheduler checkpoint shows a real cooling label and only completed timeline slots',async()=>{
 const trace=await events(taskScheduler);
 const before=trace[taskScheduler.prediction[0].atEventIndex];
 expect(before).toMatchObject({kind:'line',line:27});
 expect(read(before,'time')).toBe(5);
 expect(read(before,'ready')).toEqual([]);
 expect(read(before,'waiting')).toEqual([[6,-1,'A']]);
 expect(read(before,'timeline')).toEqual(['A','B','C','A','B']);
 const queue=taskScheduler.bindings.find(b=>b.variable==='waiting')!;
 const heap=taskScheduler.bindings.find(b=>b.variable==='ready')!;
 const timeline=taskScheduler.bindings.find(b=>b.variable==='timeline')!;
 const queueHtml=draw(before,queue);
 expect(queueHtml).toContain('6, -1, &quot;A&quot;');
 const initial=trace.find(e=>read(e,'ready') instanceof Array&&(read(e,'ready') as unknown[]).length===3&&read(e,'timeline') instanceof Array)!;
 expect(draw(initial,heap)).toContain('-3, &quot;A&quot;');
 expect(draw(before,timeline)).toContain('with 5 elements');
 expect(draw(before,timeline)).not.toContain('>None<');
 const after=trace.find(e=>e.index>before.index&&Array.isArray(read(e,'timeline'))&&(read(e,'timeline') as unknown[]).length===6)!;
 expect((read(after,'timeline') as unknown[])[5]).toBeNull();
 expect(draw(after,timeline)).toContain('>None<');
 expect(draw(after,timeline)).toContain('current slot t');
 const finished=[...trace].reverse().find(e=>e.frames.at(-1)?.name==='schedule')!;
 expect(read(finished,'timeline')).toEqual(['A','B','C','A','B',null,'A']);
 expect(read(finished,'ready')).toEqual([]);
 expect(read(finished,'waiting')).toEqual([]);
},120_000);

it('meeting heap frees an equal-time end and preserves the historical peak',async()=>{
 const trace=await events(meetingRoomsII);
 const before=trace[meetingRoomsII.prediction[0].atEventIndex];
 expect(before).toMatchObject({kind:'line',line:13});
 expect(read(before,'start')).toBe(10);
 expect(read(before,'end_heap')).toEqual([10,15]);
 const heap=meetingRoomsII.bindings.find(b=>b.variable==='end_heap')!;
 const sorted=meetingRoomsII.bindings.find(b=>b.variable==='by_start')!;
 expect(read(before,'by_start')).toEqual([[0,10],[5,15],[10,20],[20,25]]);
 expect(draw(before,sorted)).toContain('<svg');
 const after=trace.find(e=>e.index>before.index&&e.kind==='line'&&e.line===15&&read(e,'start')===10)!;
 expect(read(after,'end_heap')).toEqual([15,20]);
 expect(draw(after,heap)).toContain('with 2 elements');
 const finished=[...trace].reverse().find(e=>e.frames.at(-1)?.name==='min_rooms')!;
 expect(read(finished,'active_counts')).toEqual([1,2,2,1]);
 expect(read(finished,'end_heap')).toEqual([25]);
 expect(read(finished,'peak')).toBe(2);
 expect(draw(finished,meetingRoomsII.bindings.find(b=>b.variable==='active_counts')!)).toContain('with 4 elements');
 expect(draw(finished,meetingRoomsII.bindings.find(b=>b.variable==='peak')!)).toContain('>2<');
},120_000);
