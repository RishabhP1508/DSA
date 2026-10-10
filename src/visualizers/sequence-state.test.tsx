// @vitest-environment node
import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import type { TraceEvent, VisualBinding } from '../core/types';
import { ArrayVisualizer } from './ArrayVisualizer';
import { StringVisualizer } from './StringVisualizer';
import { patterns, lessons } from '../content/registry';
// @ts-expect-error JavaScript verification harness.
import { runProgram } from '../../scripts/lib/pyodide-harness.mjs';

function state(start=1, end=2): TraceEvent {
  return {index:0,kind:'line',line:1,frames:[{name:'<module>',line:1,locals:[
    {name:'nums',value:{kind:'ref',id:'a'}},{name:'s',value:{kind:'str',value:'abcd'}},
    {name:'left',value:{kind:'int',value:start}},{name:'right',value:{kind:'int',value:end}},
    {name:'sum',value:{kind:'int',value:99}},
  ]}],objects:{a:{id:'a',type:'list',entries:[2,3,5,7].map((value,i)=>({key:String(i),value:{kind:'int',value}}))}}};
}
const binding: VisualBinding = {variable:'nums',model:'array',
  range:{label:'window',startSource:'left',endSource:'right',endInclusive:true},
  overlays:[{role:'total',label:'running sum',source:'sum'}]};
it('renders the observed total as a labelled value, never as an array index',()=>{
  const html=renderToStaticMarkup(<ArrayVisualizer event={state()} binding={binding}/>);
  expect(html).toContain('running sum: 99');
  expect(html).not.toContain('cell-active');
});
it('marks exactly the authored inclusive range and explains the endpoint convention',()=>{
  const html=renderToStaticMarkup(<ArrayVisualizer event={state()} binding={binding}/>);
  expect((html.match(/cell-in-range/g)||[]).length).toBe(2);
  expect(html).toContain('window: [1, 2] (inclusive)');
});
it('handles exclusive endpoints and empty ranges without invented cells',()=>{
  const exclusive={...binding,range:{...binding.range!,endInclusive:false}};
  expect((renderToStaticMarkup(<ArrayVisualizer event={state()} binding={exclusive}/>).match(/cell-in-range/g)||[]).length).toBe(1);
  expect(renderToStaticMarkup(<ArrayVisualizer event={state(2,2)} binding={exclusive}/>)).toContain('empty range');
});
it('does not infer a window from arbitrary boundary overlays',()=>{
  const {range: _range,...plain}=binding;
  const html=renderToStaticMarkup(<ArrayVisualizer event={state()} binding={{...plain,overlays:[{role:'boundary',label:'lo',source:'left'},{role:'boundary',label:'hi',source:'right'}]}}/>);
  expect(html).not.toContain('cell-in-range');
});
it('shows the same range convention and totals for a string',()=>{
  const html=renderToStaticMarkup(<StringVisualizer event={state()} binding={{...binding,variable:'s',model:'string'}}/>);
  expect((html.match(/cell-in-range/g)||[]).length).toBe(2);
  expect(html).toContain('running sum: 99');
});
it('restores the exact totals and window cells at two real recorded fixed-window steps',async()=>{
  const p=patterns.find(p=>p.id==='sliding-window')!;
  const run=await runProgram(p.walkthroughCode);
  const events=(run.events as TraceEvent[]).filter(e=>e.kind==='line' && e.line===12);
  expect(events.length).toBeGreaterThan(1);
  const htmls=events.slice(0,2).map(event=>renderToStaticMarkup(<ArrayVisualizer event={event} binding={p.bindings[0]}/>));
  expect(htmls[0]).toContain('sum: 7');
  expect(htmls[1]).toContain('sum: 9');
  for(const html of htmls)expect((html.match(/cell-in-range/g)||[]).length).toBe(3);
  expect(renderToStaticMarkup(<ArrayVisualizer event={events[0]} binding={p.bindings[0]}/>)).toBe(htmls[0]);
},120_000);
it('renders authored current string boundaries from real trace snapshots',async()=>{
  const l=lessons.find(l=>l.id==='string-sliding-window')!;
  const run=await runProgram(l.code);
  const event=(run.events as TraceEvent[]).find(e=>e.kind==='line' && e.line===12)!;
  expect(renderToStaticMarkup(<StringVisualizer event={event} binding={l.bindings[0]}/>)).toContain('current boundaries: [0, 0] (inclusive)');
},120_000);
