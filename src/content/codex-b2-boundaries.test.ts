// @vitest-environment node
import { expect, it } from "vitest";
import { lessons } from "./registry";
// @ts-expect-error JavaScript verification harness.
import { runProgram } from "../../scripts/lib/pyodide-harness.mjs";

const exercise = (lessonId: string, exerciseId: string) => lessons.find((x) => x.id === lessonId)!.exercises.find((x) => x.id === exerciseId)!;

it("Kadane agrees with exhaustive range sums across all small signed arrays", async () => {
  const model = exercise("kadane", "kad-fix-1").expected;
  const result = await runProgram(model + `
for size in range(1, 6):
    for encoded in range(3 ** size):
        values = []
        remaining = encoded
        for _ in range(size):
            values.append(remaining % 3 - 1)
            remaining //= 3
        oracle = max(sum(values[a:b]) for a in range(size) for b in range(a+1, size+1))
        assert max_sub(values) == oracle, values
print("OK")`, "", { maxEvents: 100_000, maxTraceBytes: 64 * 1024 * 1024 });
  expect(result.status).toBe("completed");
  expect(result.stdout.trim()).toBe("OK");
}, 120_000);

it("unique-substring windows agree with a brute-force oracle, including stale-index repeats", async () => {
  const model = exercise("string-sliding-window", "ssw-fix-1").expected;
  const result = await runProgram(model + `
for size in range(6):
    for encoded in range(2 ** size):
        text = "".join("ab"[(encoded >> bit) & 1] for bit in range(size))
        oracle = max([0] + [b-a for a in range(size) for b in range(a+1,size+1) if len(set(text[a:b])) == b-a])
        assert length_of_longest_unique(text) == oracle, text
print("OK")`, "", { maxEvents: 100_000, maxTraceBytes: 64 * 1024 * 1024 });
  expect(result.status).toBe("completed");
  expect(result.stdout.trim()).toBe("OK");
}, 120_000);

it("merge contracts cover empty, nested, touching, disjoint, and zero-width closed intervals", async () => {
  const model = exercise("intervals", "int-fix-1").expected;
  const result = await runProgram(model + `
for source, expected in [([],[]), ([[2,2]],[[2,2]]), ([[4,5],[1,3]],[[1,3],[4,5]]), ([[3,5],[1,3]],[[1,5]]), ([[0,8],[2,4],[0,8]],[[0,8]]), ([[3,3],[1,3]],[[1,3]])]:
    assert merge([row[:] for row in source]) == expected, source
print("OK")`, "");
  expect(result.status).toBe("completed");
  expect(result.stdout.trim()).toBe("OK");
}, 120_000);

it("Python hashability and parsing counterexamples match the explanations", async () => {
  const result = await runProgram(`
assert int("  -12  ") == -12
try:
    hash(([1],))
except TypeError:
    pass
else:
    raise AssertionError("a tuple containing a list is not hashable")
class Mutable:
    pass
value = Mutable()
value.count = 1
old_hash = hash(value)
value.count = 2
assert hash(value) == old_hash
print("OK")`, "");
  expect(result.status).toBe("completed");
  expect(result.stdout.trim()).toBe("OK");
}, 120_000);
