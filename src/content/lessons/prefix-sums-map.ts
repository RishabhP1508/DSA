/**
 * Lesson: Prefix sums with a map (Hashing). Verified on CPython 3.14.
 * Output: "2\n3\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Count contiguous subarrays whose sum equals k (works with negatives).
def subarray_sum(nums, k):
    count = 0
    prefix = 0
    seen = {0: 1}                 # prefix sum 0 has occurred once (empty prefix)
    for x in nums:
        prefix += x               # running prefix sum
        count += seen.get(prefix - k, 0)   # earlier prefixes that make a k-sum
        seen[prefix] = seen.get(prefix, 0) + 1
    return count

print(subarray_sum([1, 1, 1], 2))
print(subarray_sum([1, -1, 0], 0))`;

export const prefixSumsMap: LessonDefinition = {
  id: "prefix-sums-map",
  title: "Prefix Sums with a Map",
  area: "Hashing",
  prerequisites: ["prefix-sums", "maps-sets"],

  explanation: `The **prefix sums** lesson answered range sums on a fixed array. Combined with a **hash map**, prefix sums solve a harder problem: **count contiguous subarrays whose sum equals k — even with negative numbers**, which is exactly where the fixed-size sliding window fails.

The idea: let \`prefix\` be the running sum up to the current position. A subarray ending here sums to \`k\` precisely when some **earlier** prefix equalled \`prefix - k\` (because \`prefix - earlier = k\`). So we keep a map \`seen\` counting **how many times each prefix sum has occurred**, and at each step we add \`seen[prefix - k]\` to the answer. We seed \`seen\` with \`{0: 1}\` to count subarrays that start at index 0. It's a single **O(n)** pass with **O(n)** space.

This is a crucial pattern-recognition contrast from the Arrays topic: **fixed-size window** = "exactly k consecutive elements"; **Kadane** = "max-sum any-length subarray"; **prefix sums + map** = "count subarrays with a target sum, negatives allowed." Same word "subarray", three different tools — and the map is what makes negatives tractable, since a sliding window's monotonic assumption breaks with negative numbers.`,

  vocabulary: [
    { term: "Prefix sum", definition: "The running total of elements up to the current index." },
    { term: "Complement prefix", definition: "prefix - k: an earlier prefix that would make the in-between sum equal k." },
    { term: "Prefix-count map", definition: "A dict counting how many times each prefix sum has occurred." },
    { term: "Seed {0:1}", definition: "Counts subarrays starting at index 0 (empty prefix has sum 0)." },
  ],

  concepts: {
    purpose: "Count (or find) subarrays with a target sum in O(n), including with negative numbers.",
    operations: "Maintain a running prefix; add seen[prefix - k] to the count; record the current prefix's count.",
    uses: "Subarray sum equals k, subarrays divisible by k, count/exists target-sum ranges with negatives.",
    tradeoffs: "O(n) time and O(n) space; handles negatives (unlike sliding windows) at the cost of the map.",
    commonMistakes: "Forgetting to seed {0:1} (misses subarrays from index 0); updating the map before counting (counts the empty subarray incorrectly); confusing this with fixed-size windows or Kadane.",
    edgeCases: "Negative numbers and zeros are handled. Multiple subarrays with sum k are all counted. Empty array yields 0.",
  },

  complexity: [
    { operation: "subarray_sum", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)", note: "One pass; map holds distinct prefix sums." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in nums" }],
    costModel: "Each running-sum update, map get, and map set is expected O(1).",
    time: {
      bound: "O(n)",
      case: "expected",
      explanation: "We scan each of the n elements once. Per element we update the prefix (O(1)), do one expected-O(1) map lookup for the complement, and one expected-O(1) map update. So the whole thing is expected O(n) — a single pass, no nested loop, and it works even with negative numbers.",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "The map can hold up to n distinct prefix sums (all prefixes different), giving O(n) auxiliary space.",
      inputOutputNote: "The array of n elements is the input; the prefix-count map (up to n) is auxiliary.",
    },
    derivation: [
      { lines: [6], description: "Scan each of the n elements once.", cost: "O(n)", dimension: "time" },
      { lines: [7, 8, 9], description: "Per element: O(1) prefix update, expected-O(1) map lookup and update.", cost: "O(n)", dimension: "time" },
      { lines: [5, 9], description: "The map holds up to n distinct prefix sums.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Map operations are expected O(1).", "Seeding {0: 1} counts subarrays beginning at index 0."],
    tradeoffs: "A fixed-size window is O(n)/O(1) but only handles a fixed length and non-negative incremental sums; the prefix-map handles arbitrary lengths and negatives at O(n) space.",
    counters: [{ label: "elements scanned", definition: "iterations of the loop (line 6)", countLines: [6] }],
    fixedDataNote: "First call: [1,1,1], k=2 → 2 subarrays ([1,1] twice). Second: [1,-1,0], k=0 → 3 (negatives handled). The O(n) bound generalises.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: count subarrays with sum k, negatives allowed." },
    { line: 2, executable: true, explanation: "Define subarray_sum(nums, k)." },
    { line: 3, executable: true, explanation: "count accumulates the number of qualifying subarrays." },
    { line: 4, executable: true, explanation: "prefix is the running sum." },
    { line: 5, executable: true, explanation: "Seed the prefix-count map: sum 0 has occurred once (the empty prefix)." },
    { line: 6, executable: true, explanation: "Scan each element." },
    { line: 7, executable: true, explanation: "Extend the running prefix sum by x." },
    { line: 8, executable: true, explanation: "Add how many earlier prefixes equalled prefix - k (each yields a subarray summing to k)." },
    { line: 9, executable: true, explanation: "Record that this prefix sum has now occurred (one more time)." },
    { line: 10, executable: true, explanation: "Return the total count." },
    { line: 11, executable: false, explanation: "Blank line." },
    { line: 12, executable: true, explanation: "[1,1,1], k=2 → 2." },
    { line: 13, executable: true, explanation: "[1,-1,0], k=0 → 3 (shows negatives/zeros are handled)." },
  ],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [{ role: "total", label: "prefix", source: "prefix" }],
    },
    { variable: "seen", model: "dict" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why does this work with negative numbers when a fixed-size sliding window does not?", answer: "Because it relies only on the algebraic identity prefix - earlier = k, not on sums being monotonic. A sliding window assumes extending/shrinking changes the sum predictably, which negatives break.", explanation: "Prefix-sum counting never assumes the running sum increases; it just looks up earlier prefixes. Sliding windows implicitly assume adding elements grows the sum, so negative numbers invalidate their shrink/grow logic." },
  ],

  experiments: [
    "Trace [1,1,1] with k=2 and watch count increase when prefix-k is found.",
    "Add negatives and confirm the count is still correct.",
    "Remove the {0:1} seed and see subarrays starting at index 0 get missed.",
  ],

  exercises: [
    {
      id: "psm-fix-1",
      kind: "fix-mistake",
      prompt: "This misses subarrays that start at index 0. Fix the seed.",
      starterCode: "count = 0\nprefix = 0\nseen = {}\nfor x in nums:\n    prefix += x\n    count += seen.get(prefix - k, 0)\n    seen[prefix] = seen.get(prefix, 0) + 1",
      expected: "count = 0\nprefix = 0\nseen = {0: 1}\nfor x in nums:\n    prefix += x\n    count += seen.get(prefix - k, 0)\n    seen[prefix] = seen.get(prefix, 0) + 1",
      hints: ["What prefix corresponds to a subarray starting at index 0?", "The empty prefix has sum 0.", "Seed seen = {0: 1}."],
    },
    {
      id: "psm-choose-1",
      kind: "choose-approach",
      prompt: "Three problems: (a) max sum of exactly k consecutive, (b) count subarrays summing to k with negatives, (c) max-sum any-length subarray. Which needs prefix sums + a map, and why not a window/Kadane?",
      expected: "(b) needs prefix sums + a map: it counts arbitrary-length target-sum subarrays and handles negatives. (a) is a fixed-size window; (c) is Kadane. Windows/Kadane don't count target sums with negatives.",
      hints: ["Which one counts target-sum subarrays with negatives?", "That's the prefix-sum + map pattern.", "Fixed length → window; max any-length → Kadane."],
    },
  ],

  review: `**Prefix sums + a hash map** count subarrays summing to **k**, negatives included, in one **O(n)** pass: track a running \`prefix\`, add \`seen[prefix - k]\` to the count, and record each prefix's occurrence (seed \`{0:1}\`). It relies on \`prefix - earlier = k\`, not on monotonic sums — which is why it succeeds where fixed-size windows fail. Distinct from window (fixed length) and Kadane (max any-length).`,

  expectedOutput: "2\n3\n",

  references: [
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Prefix Sums / Hashing — Subarray Sum Equals K",
      topic: "hashing/prefix-sums-maps",
      purpose: "Confirm the prefix-sum + hash-map counting technique for target-sum subarrays with negatives.",
      verifiedClaims: ["Counting subarrays with sum k uses a prefix-sum count map in O(n), handling negatives"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://cp-algorithms.com/data_structures/prefix_sum.html",
      title: "Prefix sum array — CP-Algorithms",
      section: "Applications with hashing",
      topic: "hashing/prefix-sums-maps",
      purpose: "Cross-check the identity prefix[j] - prefix[i] = k underlying target-sum counting.",
      verifiedClaims: ["A subarray sums to k iff two prefix sums differ by k"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "4eb7ab2d4b9c4ce8",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
