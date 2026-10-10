// @vitest-environment node
import { expect, it } from 'vitest';
import { patterns } from './registry';
import { gradeRecognition } from '../core/recognition-grading';
const exercise=(p:string,id:string)=>patterns.find(x=>x.id===p)!.exercises.find(x=>x.id===id)!;
it('accepts prefix arrays for fixed-length maximum sums when extra storage is not prohibited',()=>{
  const g=exercise('sliding-window','pat-sw-recognize-1').recognition!;
  expect(gradeRecognition(g,'prefix-array','prefix-difference').outcome).toBe('accepted-alternative');
});
it('accepts a reversed copy for an ASCII palindrome when extra storage is not prohibited',()=>{
  const e=exercise('two-pointers','pat-tp-recognize-2');
  expect(e.prompt).toContain('ASCII');
  expect(gradeRecognition(e.recognition!,'reverse-copy','reverse-preserves-order').outcome).toBe('accepted-alternative');
});
it('does not reject a sorted-run solution to the triples problem as contradictory',()=>{
  const g=exercise('bitwise-xor','pat-xor-choose-1').recognition!;
  expect(gradeRecognition(g,'sorted-runs','triples-runs').outcome).toBe('accepted-alternative');
});
