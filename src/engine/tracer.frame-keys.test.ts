// @vitest-environment node
import { expect, it } from 'vitest';
// @ts-expect-error the shared runtime harness is JavaScript
import { runProgram } from '../../scripts/lib/pyodide-harness.mjs';

it('supports Python 3.14 optimized function frame-locals proxies', async () => {
  const result = await runProgram('def add(a, b):\n    return a + b\nprint(add(2, 3))');
  expect(result.status).toBe('completed');
  expect(result.stdout).toBe('5\n');
  expect(result.events.some((event: { frames: { name: string }[] }) => event.frames.some(frame => frame.name === 'add'))).toBe(true);
}, 120_000);

it('frame inspection never calls string-subclass name filters', async () => {
  const result = await runProgram([
    'class Name(str):',
    '    def startswith(self, *args):',
    '        raise RuntimeError("inspector invoked learner name filter")',
    '    def endswith(self, *args):',
    '        raise RuntimeError("inspector invoked learner name filter")',
    'globals()[Name("custom")] = 42',
    'print("done")',
  ].join('\n'));
  expect(result.status).toBe('completed');
  expect(result.stdout).toBe('done\n');
  expect(result.events.at(-1).frames[0].locals).toContainEqual({ name: 'custom', value: { kind: 'int', value: 42 } });
}, 120_000);

it('non-string globals stay inspectable without invoking their string hooks', async () => {
  const result = await runProgram([
    'class Key:',
    '    def __str__(self):',
    '        raise RuntimeError("inspector invoked learner name string")',
    'globals()[Key()] = 42',
    'print("done")',
  ].join('\n'));
  expect(result.status).toBe('completed');
  expect(result.stdout).toBe('done\n');
  expect(result.events.at(-1).frames[0].locals.some((local: { name: string }) => local.name.includes('Key'))).toBe(true);
}, 120_000);
