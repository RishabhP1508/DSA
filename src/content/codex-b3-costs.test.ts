import { expect, it } from 'vitest';
import { lessons, patterns } from './registry';
it('merge space notes agree with the nonmutating sorted-reference implementation',()=>{
  const item=patterns.find(x=>x.id==='merge-intervals')!;
  expect(item.complexityExplanation.space.inputOutputNote).not.toMatch(/input.*sorted in place/);
});
it('insort does not make an unqualified constant peak-space claim for a resizing list',()=>{
  const item=lessons.find(x=>x.id==='bounds')!;
  expect(item.complexity.find(x=>x.operation==='bisect.insort')!.space).not.toBe('O(1)');
});
