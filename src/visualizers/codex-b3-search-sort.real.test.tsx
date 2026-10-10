// @vitest-environment node
import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { lessons, patterns } from '../content/registry';
import { ArrayVisualizer } from './ArrayVisualizer';
import { MatrixVisualizer } from './MatrixVisualizer';
import { HeapVisualizer } from './HeapVisualizer';
import { ObjectVisualizer } from './ObjectVisualizer';
import { RecursionVisualizer } from './RecursionVisualizer';
import { resolveBindingObject } from './helpers';
import type { TraceEvent, VisualBinding } from '../core/types';
// @ts-expect-error Shared JavaScript runtime harness.
import { runProgram } from '../../scripts/lib/pyodide-harness.mjs';

const ids = ['linear-search','binary-search','binary-search-answer','rotated-array-search','bounds','matrix-search','bubble-sort','selection-sort','insertion-sort','merge-sort','quick-sort','counting-sort','bucket-sort','heap-sort','radix-sort','comparators','interval-sorting','binary-search-on-answer','merge-intervals','greedy-interval-scheduling','modified-binary-search','divide-and-conquer'];
const items = [...lessons, ...patterns].filter(x => ids.includes(x.id));
function draw(event: TraceEvent, binding: VisualBinding) {
  switch (binding.model) {
    case 'array': return renderToStaticMarkup(<ArrayVisualizer event={event} binding={binding}/>);
    case 'matrix': return renderToStaticMarkup(<MatrixVisualizer event={event} binding={binding}/>);
    case 'heap': return renderToStaticMarkup(<HeapVisualizer event={event} binding={binding}/>);
    case 'recursion': return renderToStaticMarkup(<RecursionVisualizer event={event}/>);
    case 'object': return renderToStaticMarkup(<ObjectVisualizer event={event} binding={binding}/>);
    default: throw new Error(`Unexpected model ${binding.model}`);
  }
}
it('every authored search/sort binding renders a real recorded value', async () => {
  for (const item of items) {
    const result = await runProgram('code' in item ? item.code : item.walkthroughCode);
    expect(result.status, item.id).toBe('completed');
    const bindings = item.bindings;
    for (const binding of bindings) {
      const event = (result.events as TraceEvent[]).find(e => binding.model === 'recursion' ? e.frames.some(f => f.name !== '<module>') : !!resolveBindingObject(e,binding).value);
      expect(event, `${item.id}:${binding.variable}`).toBeDefined();
      expect(draw(event!,binding), `${item.id}:${binding.variable}`).toContain('<svg');
    }
  }
}, 120_000);
it('bounds displays its exclusive endpoint even at len(nums)', async () => {
  const item = lessons.find(x => x.id === 'bounds')!;
  const result = await runProgram(item.code);
  const event = (result.events as TraceEvent[]).find(e => e.frames.at(-1)?.name === 'lower_bound' && e.frames.at(-1)?.locals.some(v => v.name === 'hi' && v.value.kind === 'int' && v.value.value === 6))!;
  expect(event).toBeDefined();
  expect(draw(event,item.bindings[0])).toContain('[0, 6) (end excluded)');
}, 120_000);
it('matrix search highlights the actually tested row and column', async () => {
  const item = lessons.find(x => x.id === 'matrix-search')!;
  const result = await runProgram(item.code);
  const event = (result.events as TraceEvent[]).find(e => e.frames.at(-1)?.name === 'search_matrix' && e.frames.at(-1)?.locals.some(v => v.name === 'val'))!;
  expect(draw(event,item.bindings[0])).toContain('cell cell-active');
}, 120_000);
it('counting and radix show the rebuilt result and digit distribution', () => {
  expect(lessons.find(x => x.id === 'counting-sort')!.bindings).toContainEqual({variable:'out',model:'array'});
  expect(lessons.find(x => x.id === 'radix-sort')!.bindings).toContainEqual({variable:'buckets',model:'matrix'});
});
it('quicksort actually retains a quadratic chain of partition lists', async () => {
  const item = lessons.find(x => x.id === 'quick-sort')!;
  // Insert each next minimum at the middle of the remaining sequence.
  const result = await runProgram(item.code + `\ndef adversary(n):\n    if n <= 1: return list(range(n))\n    rest = [x + 1 for x in adversary(n-1)]\n    rest.insert(n//2, 0)\n    return rest\nassert quick_sort(adversary(12)) == list(range(12))\n`);
  expect(result.status).toBe('completed');
  const event = (result.events as TraceEvent[]).find(e => {
    const frames=e.frames.filter(f => f.name === 'quick_sort');
    return frames.length===12 && frames.every(f=>f.locals.some(v=>v.name==='a' && v.value.kind==='ref' && e.objects[v.value.id].entries!.length>0));
  })!;
  expect(event).toBeDefined();
  const refs = new Set(event.frames.filter(f => f.name === 'quick_sort').flatMap(f => f.locals.filter(v => v.name === 'a' && v.value.kind === 'ref').map(v => v.value.kind === 'ref' ? v.value.id : '')));
  const lengths = [...refs].map(id => event.objects[id].entries!.length).sort((a,b)=>a-b);
  expect(lengths).toEqual(Array.from({length:12},(_,i)=>i+1));
  expect(lengths.reduce((a,b)=>a+b,0)).toBe(12*13/2);
}, 120_000);
