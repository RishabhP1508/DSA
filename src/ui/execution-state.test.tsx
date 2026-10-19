import { describe, expect, it, afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import type { TraceEvent } from '../core/types';
import { AuthoredStep, ExecutionPhase } from './ExecutionState';
import { recordedChanges } from './observed-line';
afterEach(cleanup);
const event:TraceEvent={index:1,kind:'line',line:17,frames:[{name:'<module>',line:17,locals:[]}],objects:{}};
describe('execution-state presentation',()=>{
 it('explicitly scopes authored effects to the next statement and formats inline code',()=>{
  const {container}=render(<AuthoredStep event={event} source={'\n'.repeat(16)+'best.append(40)'} explanations={[{line:17,executable:true,explanation:'`scores` now includes **40**.'}]}/>);
  expect(container.querySelector('.execution-phase')).toHaveTextContent('Before line 17 executes');
  expect(container).toHaveTextContent('Not applied to this snapshot yet');
  expect(container.querySelector('code')).toHaveTextContent('scores');
  expect(container.querySelector('.statement-explanation strong')).toHaveTextContent('40');
 });
 it.each(['call','return','exception','output'] as const)('labels %s events without calling them a next line',kind=>{
  const {container}=render(<ExecutionPhase event={{...event,kind}}/>);
  expect(container.querySelector('.execution-phase')).not.toHaveTextContent('Before line');
  expect(container).toHaveTextContent(new RegExp(kind==='call'?'entered':kind==='return'?'returning':kind,'i'));
 });
 it('does not claim all output or a completed run is already visible',()=>{
  const {container}=render(<ExecutionPhase event={event}/>);
  expect(container).toHaveTextContent('saved state');
  expect(container).not.toHaveTextContent('Program completed');
 });
 it('detects a nested mutation when the outer reference and entries stay unchanged',()=>{
  const before:TraceEvent={...event,frames:[{name:'<module>',line:17,locals:[{name:'root',value:{kind:'ref',id:'outer'}}]}],objects:{outer:{id:'outer',type:'list',entries:[{key:'0',value:{kind:'ref',id:'child'}}]},child:{id:'child',type:'list',entries:[]}}};
  const after:TraceEvent={...before,objects:{...before.objects,child:{id:'child',type:'list',entries:[{key:'0',value:{kind:'int',value:7}}]}}};
  expect(recordedChanges(after,before)).toContain('The object referenced by root changed.');
 });
});
