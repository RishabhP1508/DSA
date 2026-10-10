/**
 * Large personal-program values must remain a bounded, honest view of recorded
 * state. These render actual bundled-Pyodide states, including aliases and the
 * inspector's 1000-entry prefix. The 100x100 probe intentionally stays far below
 * 100,000 cells; no million-cell rendering is attempted.
 * @vitest-environment jsdom
 */
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import type { ComponentType } from 'react';
import type { TraceEvent, VisualBinding } from '../core/types';
import { ArrayVisualizer } from './ArrayVisualizer';
import { StringVisualizer } from './StringVisualizer';
import { DPTableVisualizer } from './DPTableVisualizer';
import { MatrixVisualizer } from './MatrixVisualizer';
import { HeapVisualizer } from './HeapVisualizer';
import { StackVisualizer, QueueVisualizer, DequeVisualizer } from './StackQueueVisualizer';
// @ts-expect-error mjs harness has no types
import { runProgram } from '../../scripts/lib/pyodide-harness.mjs';

afterEach(cleanup);
let large: TraceEvent;
let ragged: TraceEvent;

function lastState(events: TraceEvent[], names: string[]) {
  const state = [...events].reverse().find(e => names.every(name =>
    e.frames.some(f => f.locals.some(local => local.name === name))));
  expect(state).toBeDefined();
  return state!;
}

beforeAll(async () => {
  const result = await runProgram([
    'from collections import deque',
    'row = [0] * 100',
    'grid = [row] * 100',
    'a = list(range(1005))',
    'q = deque(a)',
    'text = "😀" * 5000',
    'start = 1000',
    'end = 1005',
    'long_values = [text, 10**5000]',
    'long_grid = [long_values] * 20',
    'print("done")',
  ].join('\n'));
  expect(result.status).toBe('completed');
  expect(result.stdout).toBe('done\n');
  large = lastState(result.events, ['grid', 'a', 'q', 'text', 'start', 'end', 'long_values', 'long_grid']);
  const grid = large.frames.flatMap(f => f.locals).find(v => v.name === 'grid')!.value;
  expect(grid.kind).toBe('ref');
  if (grid.kind === 'ref') {
    const rows = large.objects[grid.id].entries!;
    expect(rows).toHaveLength(100);
    const references = rows.map(row => row.value.kind === 'ref' ? row.value.id : 'unexpected');
    expect(new Set(references).size).toBe(1);
    expect(large.objects[references[0]].entries).toHaveLength(100);
  }
  console.info(`[large-value trace] ${result.events.length} events, ${new TextEncoder().encode(JSON.stringify(result.events)).length} JSON bytes`);
  const a = large.frames.flatMap(f => f.locals).find(v => v.name === 'a')!.value;
  expect(a.kind).toBe('ref');
  if (a.kind === 'ref') {
    expect(large.objects[a.id].truncated).toBe(true);
    expect(large.objects[a.id].entries).toHaveLength(1000);
  }
  const small = await runProgram('ragged = [[7, 8], [9]]\nr = 1\nc = 1\nprint("done")');
  expect(small.status).toBe('completed');
  ragged = lastState(small.events, ['ragged', 'r', 'c']);
}, 120_000);

type Viz = ComponentType<{ event: TraceEvent; binding: VisualBinding }>;
const omitted = /showing|omitt|truncat|display limit|not inspected/i;

function renderMeasured(Component: Viz, binding: VisualBinding, event = large) {
  const began = performance.now();
  const view = render(<Component event={event} binding={binding} />);
  const elapsed = performance.now() - began;
  // Diagnostic measurement only: timing is deliberately not a flaky test oracle.
  console.info(`[large-value render] ${binding.model}: ${elapsed.toFixed(1)}ms, ${view.container.querySelectorAll('*').length} DOM nodes`);
  return view;
}

describe('large recorded personal values: bounded SVG and visible omissions', () => {
  it.each([
    ['dp-table', DPTableVisualizer],
    ['matrix', MatrixVisualizer],
  ] as const)('%s does not amplify one aliased row into an unbounded grid', (model, Component) => {
    const { container } = renderMeasured(Component, { variable: 'grid', model });
    expect(container.querySelectorAll('rect.cell').length).toBeLessThanOrEqual(1024);
    expect(container.textContent).toMatch(omitted);
    expect(container.querySelectorAll('.cell-filled').length).toBe(0);
  });

  it.each([
    ['array', ArrayVisualizer],
    ['dp-table', DPTableVisualizer],
    ['stack', StackVisualizer],
    ['queue', QueueVisualizer],
    ['deque', DequeVisualizer],
  ] as const)('%s bounds the recorded prefix and identifies omitted entries', (model, Component) => {
    const variable = model === 'queue' || model === 'deque' ? 'q' : 'a';
    const { container } = renderMeasured(Component, { variable, model });
    expect(container.querySelectorAll('rect.cell').length).toBeLessThanOrEqual(256);
    expect(container.textContent).toMatch(omitted);
    const labels = [...container.querySelectorAll('.pointer-label')].map(e => e.textContent);
    if (model === 'stack') expect(labels).not.toContain('top→');
    if (model === 'queue') {
      expect(labels).toContain('front↓');
      expect(labels).not.toContain('↑rear');
    }
    if (model === 'deque') {
      expect(labels).toContain('left↓');
      expect(labels).not.toContain('↑right');
    }
  });

  it('heap bounds both array and tree, retaining zero-based index labels', () => {
    const { container } = renderMeasured(HeapVisualizer, { variable: 'a', model: 'heap' });
    expect(container.querySelectorAll('rect.cell').length).toBeLessThanOrEqual(256);
    expect(container.querySelectorAll('circle').length).toBeLessThanOrEqual(128);
    expect(container.textContent).toMatch(omitted);
    expect(container.querySelector('.cell-index')?.textContent).toBe('0');
  });

  it('string bounds code-point cells without splitting non-BMP characters', () => {
    const { container } = renderMeasured(StringVisualizer, { variable: 'text', model: 'string' });
    expect(container.querySelectorAll('rect.cell').length).toBeLessThanOrEqual(256);
    expect(container.textContent).toMatch(omitted);
    const characters = [...container.querySelectorAll('.cell-value')].map(e => e.textContent);
    expect(characters.length).toBeGreaterThan(0);
    expect(characters.every(ch => ch === '😀')).toBe(true);
    expect(container.querySelector('.cell-index')?.textContent).toBe('0');
    expect(container.querySelector('svg')?.getAttribute('aria-label')).toContain('5000');
  });

  it('a valid uninspected range is not falsely called outside the sequence', () => {
    const binding: VisualBinding = {
      variable: 'a', model: 'array',
      range: { label: 'window', startSource: 'start', endSource: 'end', endInclusive: false },
    };
    const { container } = renderMeasured(ArrayVisualizer, binding);
    const state = container.querySelector('.sequence-state');
    expect(state?.textContent).toContain('[1000, 1005)');
    expect(state?.textContent).not.toContain('outside sequence');
    expect(state?.textContent).toMatch(/not inspected|inspection|unknown|truncat|omitt/i);
    expect(container.querySelector('svg')?.getAttribute('aria-label')).not.toContain('with 1000 elements');
  });
});

describe('ragged recorded data: no invented current cell', () => {
  it.each([
    ['dp-table', DPTableVisualizer],
    ['matrix', MatrixVisualizer],
  ] as const)('%s does not highlight a missing cell as observed state', (model, Component) => {
    const binding: VisualBinding = {
      variable: 'ragged', model,
      overlays: [
        { role: 'pointer', label: 'row', source: 'r' },
        { role: 'pointer', label: 'col', source: 'c' },
      ],
    };
    const { container } = renderMeasured(Component, binding, ragged);
    expect(container.querySelectorAll('rect.cell-active').length).toBe(0);
  });
});

describe('an inspected prefix does not establish the true final endpoint', () => {
  it.each([
    ['stack', StackVisualizer, 'top→'],
    ['queue', QueueVisualizer, '↑rear'],
    ['deque', DequeVisualizer, '↑right'],
  ] as const)('%s does not assign its unknown final endpoint to index 999', (model, Component, falseLabel) => {
    const variable = model === 'stack' ? 'a' : 'q';
    const { container } = renderMeasured(Component, { variable, model });
    const labels = [...container.querySelectorAll('.pointer-label')].map(e => e.textContent);
    expect(labels).not.toContain(falseLabel);
    expect(container.textContent).toMatch(/not inspected|unknown|truncat|omitt/i);
  });
});

describe('large scalar values inside bounded diagrams', () => {
  it.each([
    ['array', 'long_values', ArrayVisualizer],
    ['dp-table', 'long_values', DPTableVisualizer],
    ['stack', 'long_values', StackVisualizer],
    ['queue', 'long_values', QueueVisualizer],
    ['deque', 'long_values', DequeVisualizer],
    ['heap', 'long_values', HeapVisualizer],
    ['dp-table', 'long_grid', DPTableVisualizer],
    ['matrix', 'long_grid', MatrixVisualizer],
  ] as const)('%s shortens huge strings/integers visibly in %s', (model, variable, Component) => {
    const { container } = renderMeasured(Component, { variable, model });
    const values = [...container.querySelectorAll('.cell-value, .cell-value-sm')];
    expect(values.length).toBeGreaterThan(0);
    expect(values.every(value => [...(value.textContent ?? '')].length <= 200)).toBe(true);
    expect(container.textContent).toMatch(/shortened/i);
  });
});
