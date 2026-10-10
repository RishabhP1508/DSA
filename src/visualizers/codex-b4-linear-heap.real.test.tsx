// @vitest-environment node
import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { lessons } from '../content/registry';
import { LinkedListVisualizer } from './LinkedListVisualizer';
import { HeapVisualizer } from './HeapVisualizer';
import { resolveBindingObject } from './helpers';
import type { TraceEvent, VisualBinding } from '../core/types';
// @ts-expect-error The shared runtime harness is JavaScript.
import { runProgram } from '../../scripts/lib/pyodide-harness.mjs';

async function trace(id: string): Promise<TraceEvent[]> {
  const lesson = lessons.find(x => x.id === id)!;
  const result = await runProgram(lesson.code);
  expect(result.status, id).toBe('completed');
  expect(result.stdout, id).toBe(lesson.expectedOutput);
  return result.events;
}
function local(event: TraceEvent, name: string) {
  return event.frames.at(-1)?.locals.find(x => x.name === name)?.value;
}
function chainLength(event: TraceEvent, name: string) {
  let node = local(event, name);
  const seen = new Set<string>();
  while (node?.kind === 'ref' && !seen.has(node.id)) {
    seen.add(node.id);
    node = event.objects[node.id]?.entries?.find(x => x.key === 'next')?.value;
  }
  return seen.size;
}
function linked(event: TraceEvent, binding: VisualBinding) {
  return renderToStaticMarkup(<LinkedListVisualizer event={event} binding={binding}/>);
}

it('reversal diagrams show the detached reversed prefix and remaining suffix', async () => {
  const item = lessons.find(x => x.id === 'linked-list-reversal')!;
  const events = await trace(item.id);
  const event = events.find(e => e.frames.at(-1)?.name === 'reverse' && chainLength(e,'prev') === 2 && chainLength(e,'curr') === 3)!;
  expect(event).toBeDefined();
  for (const [name, count] of [['prev',2],['curr',3],['head',1]] as const) {
    const binding = item.bindings.find(b => b.variable === name)!;
    expect(binding, name).toBeDefined();
    expect(linked(event,binding)).toContain(`linked list ${name} with ${count} nodes`);
  }
}, 120_000);

it('doubly diagrams draw only recorded backward links during the two-step append', async () => {
  const item = lessons.find(x => x.id === 'linked-list-variants')!;
  const events = await trace('linked-list-variants');
  const event = events.find(e => {
    if (e.frames.at(-1)?.name !== 'build_doubly' || chainLength(e,'head') !== 2) return false;
    const node = local(e,'node');
    return node?.kind === 'ref' && e.objects[node.id]?.entries?.find(x => x.key === 'prev')?.value.kind === 'none';
  })!;
  expect(event).toBeDefined();
  const binding = item.bindings.find(b => b.variable === 'head')!;
  expect(binding).toBeDefined();
  const svg = linked(event,binding);
  expect(svg).toContain('Doubly linked list head with 2 nodes');
  // tail.next has executed, but node.prev has not. A backward arrow here
  // would invent state that the Python program has not reached.
  expect(svg.match(/class="ll-edge-back"/g) ?? []).toHaveLength(0);
}, 120_000);

it('circular diagrams terminate at the recorded cycle instead of inventing None', async () => {
  const item = lessons.find(x => x.id === 'linked-list-variants')!;
  const events = await trace(item.id);
  const binding = item.bindings.find(b => b.variable === 'ring')!;
  const event = events.findLast(e => !!resolveBindingObject(e,binding).object)!;
  expect(event).toBeDefined();
  const svg = linked(event,binding);
  expect(svg).toContain('with 3 nodes, contains a cycle');
  expect(svg).toContain('cycle-edge');
  expect(svg).not.toContain('>None<');
}, 120_000);

it('median field bindings render both actual heap arrays and zero-based trees', async () => {
  const item = lessons.find(x => x.id === 'running-median')!;
  const events = await trace(item.id);
  const event = events.findLast(e => item.bindings.every(b => resolveBindingObject(e,b).object?.entries?.length === 2))!;
  expect(event).toBeDefined();
  for (const binding of item.bindings) {
    expect(binding.variable).toBe('mf');
    expect(['small','large']).toContain(binding.path);
    const svg = renderToStaticMarkup(<HeapVisualizer event={event} binding={binding}/>);
    expect(svg).toContain('with 2 elements, zero-based array and tree views');
    expect(svg.match(/class="tree-edge"/g)).toHaveLength(1);
    expect(svg.match(/class="cell-index"/g)).toHaveLength(4);
  }
}, 120_000);
