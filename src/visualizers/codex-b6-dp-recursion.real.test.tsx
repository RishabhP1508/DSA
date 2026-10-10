// @vitest-environment node
import {beforeAll,expect,it} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {lessons,patterns} from '../content/registry';
import {Visualizer} from './index';
import {resolveBindingObject,resolveVariable,asNumber} from './helpers';
import type {TraceEvent,VisualBinding} from '../core/types';
// @ts-expect-error Bundled runtime JavaScript harness.
import {runProgram} from '../../scripts/lib/pyodide-harness.mjs';

const items=[...lessons.filter(x=>x.area==='DP and recursion'),...patterns.filter(x=>['backtracking','dynamic-programming','knapsack'].includes(x.id))];
const traces=new Map<string,TraceEvent[]>();
const item=(id:string)=>items.find(x=>x.id===id)!;
const source=(id:string)=>{const x=item(id);return 'code' in x?x.code:x.walkthroughCode;};
const draw=(event:TraceEvent,binding:VisualBinding)=>renderToStaticMarkup(<Visualizer event={event} binding={binding}/>);
const num=(e:TraceEvent,name:string)=>asNumber(resolveVariable(e,name));
beforeAll(async()=>{for(const x of items){const r=await runProgram('code' in x?x.code:x.walkthroughCode);expect(r.status,x.id).toBe('completed');traces.set(x.id,r.events);}},120_000);

it('all 23 items render every authored binding from actual recorded state',()=>{
  expect(items).toHaveLength(23);
  for(const x of items)for(const binding of x.bindings){
    const event=traces.get(x.id)!.find(e=>binding.model==='recursion'?e.frames.some(f=>f.name!=='<module>'):!!resolveBindingObject(e,binding).value);
    expect(event,`${x.id}:${binding.variable}`).toBeDefined();
    expect(draw(event!,binding),`${x.id}:${binding.variable}`).toContain('<svg');
  }
});
it('factorial counts the initial call once, and Fibonacci distinguishes count from depth',()=>{
  for(const [id,name,calls,depth] of [['dp-base-cases','fact',5,5],['dp-recursive-calls','fib',25,6]] as const){
    const events=traces.get(id)!;
    expect(events.filter(e=>e.kind==='call'&&e.frames.at(-1)?.name===name)).toHaveLength(calls);
    expect(Math.max(...events.map(e=>e.frames.filter(f=>f.name===name).length))).toBe(depth);
  }
});
it('immutable parentheses prefixes are all retained on a deep stack',()=>{
  const e=traces.get('dp-backtracking')!.find(e=>e.kind==='line'&&e.frames.filter(f=>f.name==='bt').length===5)!;
  const prefixes=e.frames.filter(f=>f.name==='bt').map(f=>f.locals.find(v=>v.name==='cur')!.value);
  expect(prefixes.every(v=>v.kind==='str')).toBe(true);
  const lengths=prefixes.map(v=>v.kind==='str'?String(v.value).length:NaN);
  expect(lengths).toEqual([0,1,2,3,4]);
  expect(lengths.reduce((a,b)=>a+b,0)).toBe(10);
});
it('capped combinations avoid dead prefixes even when k equals n',async()=>{
  const r=await runProgram(source('dp-combinations')+'\nassert combine(6,6)==[[1,2,3,4,5,6]]');
  expect(r.status).toBe('completed');
  const calls=(r.events as TraceEvent[]).filter(e=>e.kind==='call'&&e.frames.at(-1)?.name==='bt');
  // Filter the closure belonging to the second call, identified by its enclosing n.
  expect(calls.filter(e=>num(e,'n')===6)).toHaveLength(7);
});
it('subsequence pointers mark their own strings and stock price is displayed as a value',()=>{
  const e=traces.get('dp-subsequences')!.find(e=>num(e,'i')===2&&num(e,'j')===3)!;
  expect(e).toBeDefined();
  expect(draw(e,item('dp-subsequences').bindings[0])).toContain('i (next candidate)');
  expect(draw(e,item('dp-subsequences').bindings[1])).toContain('j (text index)');
  const stock=traces.get('dp-state-transitions')!.find(e=>num(e,'i')===4&&num(e,'best')===5)!;
  expect(stock).toBeDefined();
  expect(num(stock,'min_price')).toBe(1);
  expect(draw(stock,item('dp-state-transitions').bindings[0])).toContain('best profit: 5');
  expect(draw(stock,item('dp-state-transitions').bindings[1])).toContain('min_price value');
  expect(item('dp-state-transitions').bindings[0].overlays!.every(o=>o.source!=='min_price')).toBe(true);
});
it('all DP tables highlight actual interior coordinates without inventing computed shading',()=>{
  for(const x of items){const binding=x.bindings.find(b=>b.model==='dp-table');if(!binding)continue;
    const events=traces.get(x.id)!,sources=binding.overlays!.map(o=>o.source);
    const e=events.find(e=>sources.every(s=>num(e,s)!==undefined)&&!!resolveBindingObject(e,binding).object?.entries?.length)!;
    expect(e,x.id).toBeDefined();
    const html=draw(e,binding);
    expect(html,x.id).toContain('cell-active');
    expect(html,x.id).not.toContain('cell-filled');
  }
});
it('maximum subarray uses inclusive ranges and counts both crossing scans',()=>{
  const id='dp-divide-and-conquer',events=traces.get(id)!;
  const e=events.find(e=>e.frames.at(-1)?.name==='helper'&&num(e,'lo')===0&&num(e,'hi')===8&&num(e,'mid')===4)!;
  expect(draw(e,item(id).bindings[0])).toContain('[0, 8] (inclusive)');
  const code=source(id).split('\n');
  const counter=item(id).complexityExplanation!.counters!.find(c=>c.label==='crossing elements examined')!;
  expect(counter.countLines.map(n=>code[n-1].trim())).toEqual(['s += nums[i]','s += nums[i]']);
  expect(events.filter(e=>e.kind==='call'&&e.frames.at(-1)?.name==='helper')).toHaveLength(17);
});
it('N Queens counts failed candidate scans and memoized DP keeps uncached base returns',()=>{
  const queen=traces.get('dp-n-queens')!;
  expect(queen.filter(e=>e.kind==='call'&&e.frames.at(-1)?.name==='bt')).toHaveLength(17);
  const checkLine=source('dp-n-queens').split('\n').findIndex(s=>s.includes('if col in cols'))+1;
  expect(queen.filter(e=>e.kind==='line'&&e.line===checkLine)).toHaveLength(60);
  const memo=traces.get('dynamic-programming')!;
  expect(memo.filter(e=>e.kind==='call'&&e.frames.at(-1)?.name==='go')).toHaveLength(19);
  expect(memo.filter(e=>e.kind==='return'&&e.frames.at(-1)?.name==='go'&&(num(e,'k')===0||num(e,'k')===1))).toHaveLength(3);
});
