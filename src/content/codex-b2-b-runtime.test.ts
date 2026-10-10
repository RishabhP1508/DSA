// @vitest-environment node
import { expect, it } from 'vitest';
import { lessons, patterns } from './registry';
// @ts-expect-error Shared JavaScript harness executes the bundled interpreter.
import { runProgram } from '../../scripts/lib/pyodide-harness.mjs';
const code = (id: string) => lessons.find(x => x.id === id)!.code;
const patternCode = (id: string) => patterns.find(x => x.id === id)!.walkthroughCode;
async function check(source: string) {
  const result = await runProgram(source, '', { maxEvents: 100_000, maxTraceBytes: 64*1024*1024 });
  expect(result.error).toBeFalsy();
  expect(result.status).toBe('completed');
  expect(result.stdout.trim().endsWith('OK')).toBe(true);
}
it('KMP matches an exhaustive substring oracle, including empty patterns and overlaps', async () => {
  await check(code('kmp') + `
texts = ["".join("ab"[(v >> i) & 1] for i in range(n)) for n in range(5) for v in range(2**n)]
for text in texts:
    for pattern in texts[:15]:
        oracle = [i for i in range(len(text)+1) if text[i:i+len(pattern)] == pattern]
        assert kmp_search(text, pattern) == oracle, (text,pattern)
print("OK")`);
}, 120_000);
it('spiral visits every cell exactly once on empty, thin, and rectangular grids', async () => {
  await check(patternCode('matrix-traversal') + `
assert spiral([]) == []
assert spiral([[]]) == []
for rows in range(1,6):
    for cols in range(1,6):
        grid = [[r*cols+c for c in range(cols)] for r in range(rows)]
        remaining = [row[:] for row in grid]
        oracle = []
        while remaining:
            oracle += remaining.pop(0)
            if not remaining or not remaining[0]:
                break
            remaining = [list(row) for row in zip(*remaining)][::-1]
        assert spiral(grid) == oracle, (rows,cols)
print("OK")`);
}, 120_000);
it('set-bit contracts, negative sign extension, and bounded signed addition agree with Python', async () => {
  await check(code('count-set-bits') + `
for n in list(range(64)) + [1<<32, (1<<80)-1, (1<<255)+1]:
    assert count_bits(n) == n.bit_count(), n
try:
    count_bits(-1)
except ValueError:
    pass
else:
    raise AssertionError("negative Kernighan input must be rejected")
def add32(a,b):
    mask=0xffffffff
    while b:
        a,b=(a^b)&mask,((a&b)<<1)&mask
    return a if a<=0x7fffffff else a-(1<<32)
for a in [-2147483648,-8,-1,0,1,9,2147483647]:
    for b in [-2147483648,-1,0,1,2147483647]:
        expected=((a+b+(1<<31))%(1<<32))-(1<<31)
        assert add32(a,b)==expected, (a,b)
a,b=-1,1
for _ in range(20):
    a,b=a^b,(a&b)<<1
assert b != 0
assert (-3)+(-4) == -7
assert (1^2^3)==0
assert (-11).bit_count()==11 .bit_count()
print("OK")`);
}, 120_000);
it('cyclic placement finds the missing number on every permutation up to size five', async () => {
  await check(patternCode('cyclic-sort') + `
from itertools import permutations
for n in range(6):
    for missing in range(n+1):
        for order in permutations([v for v in range(n+1) if v != missing]):
            assert find_missing(list(order)) == missing, order
print("OK")`);
}, 120_000);
it('grouping handles empty words and preserves multiplicity and original references', async () => {
  await check(code('grouping') + `
words=["","a","","ab","ba","a"]
result=group_anagrams(words)
assert result==[["",""],["a","a"],["ab","ba"]]
assert result[2][0] is words[3]
assert group_anagrams([])==[]
print("OK")`);
}, 120_000);
