import { describe, expect, it, afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import type { TraceEvent, VisualBinding } from '../core/types';
import { Visualizations } from './index';

afterEach(cleanup);
const event: TraceEvent = { index: 3, kind: 'line', line: 4, frames: [{name:'<module>',line:4,locals:[
  {name:'scores',value:{kind:'ref',id:'shared'}}, {name:'best',value:{kind:'ref',id:'shared'}},
  {name:'copy',value:{kind:'ref',id:'copy'}},
]}],objects:{shared:{id:'shared',type:'list',entries:[{key:'0',value:{kind:'int',value:10}}]},copy:{id:'copy',type:'list',entries:[{key:'0',value:{kind:'int',value:10}}]}}};
const binding = (variable:string):VisualBinding => ({variable,model:'array'});
describe('rendered shared-reference diagrams',()=>{
 it('draws two aliases once and an equal copy separately',()=>{
  const {container}=render(<Visualizations event={event} bindings={['scores','best','copy'].map(binding)}/>);
  expect(container.querySelectorAll('.array-viz')).toHaveLength(2);
  const shared=container.querySelector('.visualization-card[data-object-id="shared"]')!;
  expect(shared.querySelector('.visualization-aliases')).toHaveTextContent('scores');
  expect(shared.querySelector('.visualization-aliases')).toHaveTextContent('best');
  expect(shared).toHaveTextContent(/shared object/i);
  expect(container.querySelector('.visualization-card[data-object-id="copy"]')).not.toHaveTextContent('best');
 });
 it('keeps distinct overlay views of the same object',()=>{
  const {container}=render(<Visualizations event={event} bindings={[binding('scores'),{...binding('best'),overlays:[{role:'pointer',source:'i',label:'i'}]}]}/>);
  expect(container.querySelectorAll('.array-viz')).toHaveLength(2);
 });
 it('does not combine equal primitive values or missing variables',()=>{
  const {container}=render(<Visualizations event={event} bindings={[{variable:'a',model:'string'},{variable:'b',model:'string'}]}/>);
  expect(container.querySelectorAll('.visualization-card')).toHaveLength(2);
 });
 it('groups resolved custom fields by identity, not their parent object',()=>{
  const nested:TraceEvent={...event,frames:[{name:'<module>',line:4,locals:[{name:'holder',value:{kind:'ref',id:'holder'}},...event.frames[0].locals]}],objects:{...event.objects,holder:{id:'holder',type:'Node',entries:[{key:'items',value:{kind:'ref',id:'shared'}}]}}};
  const {container}=render(<Visualizations event={nested} bindings={[{variable:'holder',path:'items',model:'array'},binding('scores')]}/>);
  expect(container.querySelectorAll('.array-viz')).toHaveLength(1);
  expect(container.querySelector('.visualization-aliases')).toHaveTextContent('holder.items');
 });
 it('does not report a shadowed outer alias as an inner binding',()=>{
  const shadow:TraceEvent={...event,frames:[event.frames[0],{name:'f',line:4,locals:[{name:'best',value:{kind:'ref',id:'copy'}}]}]};
  const {container}=render(<Visualizations event={shadow} bindings={[binding('scores')]}/>);
  expect(container.querySelector('.visualization-aliases')).not.toHaveTextContent('best');
 });
});
