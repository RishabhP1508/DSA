/** @vitest-environment jsdom */
import { afterEach, beforeAll, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import type { TraceEvent } from '../core/types';
import { TreeVisualizer } from './TreeVisualizer';
import { TrieVisualizer } from './TrieVisualizer';
import { DictVisualizer, SetVisualizer } from './DictSetVisualizer';
// @ts-expect-error Bundled runtime harness is JavaScript.
import { runProgram } from '../../scripts/lib/pyodide-harness.mjs';

afterEach(cleanup);
let state: TraceEvent;
beforeAll(async () => {
  // Construction runs through the supported exec builtin in one outer source
  // line. This avoids filling the trace with intermediate factory states. The
  // final objects/aliases are captured by the real inspector, not fixtures.
  const construction = [
    'class N:',
    '    def __init__(self, x):',
    '        self.payload=x; self.a=None; self.b=None; self.edges={}; self.wordEnd=False',
    'nodes=[N(i) for i in range(511)]',
    'for i in range(255):',
    '    nodes[i].a=nodes[2*i+1]; nodes[i].b=nodes[2*i+2]',
    'root=nodes[0]',
    'trie=N(0)',
    'trie.edges={chr(0x400+i): N(i) for i in range(1005)}',
    'dictionary=dict.fromkeys(range(1005), 7)',
    'members=set(range(1005))',
  ].join('\n');
  const result = await runProgram(`exec(${JSON.stringify(construction)})\nprint('done')`);
  expect(result.status).toBe('completed');
  expect(result.stdout).toBe('done\n');
  state = result.events.at(-1)!;
  const variable = (name: string) => state.frames.flatMap(f => f.locals).find(v => v.name === name)!.value;
  const trie = variable('trie');
  expect(trie.kind).toBe('ref');
  if (trie.kind === 'ref') {
    const map = state.objects[trie.id].entries!.find(e => e.key === 'edges')!.value;
    expect(map.kind).toBe('ref');
    if (map.kind === 'ref') expect(state.objects[map.id].truncated).toBe(true);
  }
}, 120_000);

it('bounds a large shallow custom-field binary tree and marks omitted branches', () => {
  const { container } = render(<TreeVisualizer event={state} binding={{ variable: 'root', model: 'tree', fields: { value: 'payload', left: 'a', right: 'b' } }} />);
  expect(container.querySelectorAll('circle').length).toBeLessThanOrEqual(128);
  expect(container.textContent).toMatch(/display limit|omitt|partial|not inspected/i);
  expect([...container.querySelectorAll('.cell-value-sm')].some(node => node.textContent === '0')).toBe(true);
});

it('bounds a wide custom-field trie independently of its visited guard', () => {
  const { container } = render(<TrieVisualizer event={state} binding={{ variable: 'trie', model: 'trie', fields: { children: 'edges', terminal: 'wordEnd' } }} />);
  expect(container.querySelectorAll('circle').length).toBeLessThanOrEqual(256);
  expect(container.querySelectorAll('.tree-edge').length).toBeLessThanOrEqual(256);
  expect(container.textContent).toMatch(/display limit|omitt|partial/i);
});

it('does not present a truncated trie children dictionary as complete', () => {
  const { container } = render(<TrieVisualizer event={state} binding={{ variable: 'trie', model: 'trie', fields: { children: 'edges', terminal: 'wordEnd' } }} />);
  expect(container.textContent).toMatch(/not inspected|truncat/i);
});

it('bounds dictionary rows and labels inspection truncation', () => {
  const { container } = render(<DictVisualizer event={state} binding={{ variable: 'dictionary', model: 'dict' }} />);
  expect(container.querySelectorAll('svg > g').length).toBeLessThanOrEqual(256);
  expect(container.textContent).toMatch(/not inspected|truncat/i);
});

it('bounds unordered set chips and labels inspection truncation', () => {
  const { container } = render(<SetVisualizer event={state} binding={{ variable: 'members', model: 'set' }} />);
  expect(container.querySelectorAll('rect').length).toBeLessThanOrEqual(256);
  expect(container.textContent).toMatch(/not inspected|truncat/i);
});
