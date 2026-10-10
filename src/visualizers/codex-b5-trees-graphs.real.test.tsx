// @vitest-environment node
import {expect,it} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {lessons,patterns} from '../content/registry';
import {Visualizer} from './index';
import {resolveBindingObject} from './helpers';
import type {TraceEvent,VisualBinding} from '../core/types';
// @ts-expect-error Shared executable runtime harness is JavaScript.
import {runProgram} from '../../scripts/lib/pyodide-harness.mjs';
const items=[...lessons.filter(x=>['Trees and tries','Graphs','Range queries'].includes(x.area)),...patterns.filter(x=>x.category==='Graphs & trees')];
const runs=new Map<string,TraceEvent[]>();
async function events(item:typeof items[number]){
 const key=('code'in item?'lesson:':'pattern:')+item.id;
 if(!runs.has(key)){const r=await runProgram('code'in item?item.code:item.walkthroughCode);expect(r.status,key).toBe('completed');runs.set(key,r.events);}
 return runs.get(key)!;
}
function draw(event:TraceEvent,binding:VisualBinding){return renderToStaticMarkup(<Visualizer event={event} binding={binding}/>);}
it('all 36 owned items render every binding from a real recorded value',async()=>{
 expect(items).toHaveLength(36);
 for(const item of items){
  const trace=await events(item);
  for(const binding of item.bindings){
   const event=trace.find(e=>binding.model==='recursion'?e.frames.length>1:binding.model==='object'?!!resolveBindingObject(e,binding).value:!!resolveBindingObject(e,binding).object);
   expect(event,`${item.id}:${binding.variable}.${binding.path??''}`).toBeDefined();
   expect(draw(event!,binding),`${item.id}:${binding.model}`).toContain('<svg');
  }
 }
},120_000);
it('trie bindings show shared character paths and terminal nodes, not just the container root',async()=>{
 for(const item of items.filter(x=>['trie-insertion','prefix-search','trie-prefix'].includes(x.id))){
  const binding=item.bindings.find(b=>b.model==='trie')!;
  expect(binding.path).toBe('root');
  const trace=await events(item);
  const rendered=trace.map(e=>draw(e,binding));
  expect(rendered.some(html=>/with [2-9][0-9]* nodes/.test(html)),item.id).toBe(true);
  expect(rendered.some(html=>html.includes('cell cell-active node-circle')),item.id).toBe(true);
 }
},120_000);
it('range structures expose their actual array storage and query overlays',async()=>{
 for(const [id,length]of [['fenwick-tree',7],['segment-tree',12]]as const){
  const item=lessons.find(x=>x.id===id)!;
  const binding=item.bindings[0];
  expect(binding).toMatchObject({model:'array',path:'tree'});
  const trace=await events(item);
  const event=[...trace].reverse().find(e=>resolveBindingObject(e,binding).object?.entries?.length===length)!;
  expect(event,id).toBeDefined();
  expect(draw(event,binding)).toContain(`with ${length} elements`);
  expect(trace.some(e=>draw(e,binding).includes('query left')||draw(e,binding).includes('one-based index')),id).toBe(true);
 }
},120_000);
it('weighted adjacency uses directed arrows in the real graph snapshot',async()=>{
 const item=lessons.find(x=>x.id==='adjacency-lists')!;
 const binding=item.bindings.find(b=>b.model==='graph')!;
 expect(binding.directed).toBe(true);
 expect(binding.adjacencyFormat).toBe('weighted-pairs');
 const trace=await events(item);
 expect(trace.some(e=>draw(e,binding).includes('marker-end')),item.id).toBe(true);
 expect(trace.some(e=>draw(e,binding).includes('with 4 nodes and 5 edges')),item.id).toBe(true);
 expect(trace.some(e=>draw(e,binding).includes('class="edge-label"')),item.id).toBe(true);
},120_000);
