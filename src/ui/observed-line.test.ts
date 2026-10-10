import {describe,it,expect} from 'vitest';
import {syntaxExplanation,recordedChanges} from './observed-line';
import type {TraceEvent} from '../core/types';
const event=(value:number):TraceEvent=>({index:0,line:1,kind:'line',frames:[{name:'<module>',line:1,locals:[{name:'x',value:{kind:'int',value}}]}],objects:{}});
describe('observed personal-code explanation',()=>{
 it('describes Python syntax rather than guesses algorithm intent',()=>{expect(syntaxExplanation('answer = "for while return"',1)).toMatch(/right side/);expect(syntaxExplanation('for x in values:\n    print(x)',1)).toMatch(/iterable/);expect(syntaxExplanation('for x in values:\n    print(x)',2)).toMatch(/expression/);});
 it('explains comments and blanks without inventing runtime steps',()=>{expect(syntaxExplanation('# compare values\n\nx=1',1)).toMatch(/does not execute/);expect(syntaxExplanation('# compare values\n\nx=1',2)).toMatch(/blank line/);});
 it('reports only differences in recorded states',()=>{expect(recordedChanges(event(2),event(1))).toEqual(['x has a different recorded value or reference.']);expect(recordedChanges(event(1),event(1))).toEqual(['No local value or referenced object changed between these two recorded states.']);});
});
