import { afterEach, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { GraphVisualizer } from './GraphVisualizer';
import type { TraceEvent } from '../core/types';
// @ts-expect-error the shared runtime harness is JavaScript
import { runProgram } from '../../scripts/lib/pyodide-harness.mjs';
afterEach(cleanup);

it('equal Python numeric nodes are one node; a string remains distinct', async () => {
  const result = await runProgram('g = {1.0: [1, True, "1"]}\nprint("done")');
  expect(result.status).toBe('completed');
  const { container } = render(<GraphVisualizer event={result.events.at(-1) as TraceEvent} binding={{ variable: 'g', model: 'graph', directed: true }} />);
  expect(container.querySelectorAll('circle')).toHaveLength(2);
  expect(container.textContent).toContain('"1"');
}, 120_000);

it('a shared neighbor list cannot amplify into an unbounded graph diagram', async () => {
  const result = await runProgram('neighbors = list(range(100))\ng = {i: neighbors for i in range(100)}\nprint("done")');
  expect(result.status).toBe('completed');
  const { container } = render(<GraphVisualizer event={result.events.at(-1) as TraceEvent} binding={{ variable: 'g', model: 'graph', directed: true }} />);
  expect(container.querySelectorAll('circle').length).toBeLessThanOrEqual(128);
  expect(container.querySelectorAll('.graph-edge').length).toBeLessThanOrEqual(256);
  expect(container.textContent).toMatch(/showing|omitt|display limit/i);
}, 120_000);
