/**
 * R7.6 — authored baseline-vs-improved comparison experiments.
 *
 * Each defines a shared `problem`, an `inputGenerator` (`gen(size) -> args`),
 * two implementations that both define `solve(*args)` and call `__op()` at the
 * counted operation, and the input `sizes`. The harness
 * (scripts/verify_comparisons.mjs) runs both on the SAME generated inputs,
 * asserts equal outputs, and reports the operation counts per size. The
 * `theoretical` strings are labelled growth curves, shown separately from the
 * observed counts (never a fitted claim, never a timing benchmark).
 */

import type { ComparisonExperiment } from "../core/types";

export const COMPARISONS: ComparisonExperiment[] = [
  {
    id: "two-sum",
    title: "Two Sum — brute force vs hash map",
    problem: "Return indices of the two numbers summing to target (assume one solution).",
    inputGenerator:
      "def gen(size):\n    nums = list(range(size))\n    target = (size - 1) + (size - 2)  # last two elements\n    return (nums, target)",
    baseline: {
      label: "Brute force (check every pair)",
      theoretical: "O(n^2) time, O(1) aux",
      code:
        "def solve(nums, target):\n    n = len(nums)\n    for i in range(n):\n        for j in range(i + 1, n):\n            __op()\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []",
    },
    improved: {
      label: "Hash map (value -> index)",
      theoretical: "O(n) expected time, O(n) aux",
      code:
        "def solve(nums, target):\n    seen = {}\n    for i, x in enumerate(nums):\n        __op()\n        need = target - x\n        if need in seen:\n            return [seen[need], i]\n        seen[x] = i\n    return []",
    },
    sizes: [8, 16, 32, 64],
    operation: "inner comparison / element visit",
  },
  {
    id: "membership",
    title: "Repeated membership — list scan vs set",
    problem: "Count how many queries are present in the collection.",
    inputGenerator:
      "def gen(size):\n    data = list(range(size))\n    queries = list(range(0, 2 * size, 2))  # half present\n    return (data, queries)",
    baseline: {
      label: "List scan (x in list)",
      theoretical: "O(q·n) time",
      code:
        "def solve(data, queries):\n    count = 0\n    for q in queries:\n        for d in data:\n            __op()\n            if d == q:\n                count += 1\n                break\n    return count",
    },
    improved: {
      label: "Set membership (x in set)",
      theoretical: "O(q) expected time after O(n) build",
      code:
        "def solve(data, queries):\n    s = set(data)\n    count = 0\n    for q in queries:\n        __op()\n        if q in s:\n            count += 1\n    return count",
    },
    sizes: [8, 16, 32, 64],
    operation: "membership probe",
  },
];
