/**
 * Lesson: Prefix sums (Arrays). Verified on CPython 3.14.
 * Output: "[0, 3, 4, 8, 9, 14]\n6\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Precompute cumulative sums so any range sum is O(1).
nums = [3, 1, 4, 1, 5]
# prefix[i] = sum of the first i elements. prefix[0] = 0.
prefix = [0]
for x in nums:
    prefix.append(prefix[-1] + x)
print(prefix)
# Sum of nums[1:4] (indices 1,2,3) = prefix[4] - prefix[1].
print(prefix[4] - prefix[1])`;

export const prefixSums: LessonDefinition = {
  id: "prefix-sums",
  title: "Prefix Sums",
  area: "Arrays",
  prerequisites: ["array-traversal"],

  explanation: `A **prefix sum** array stores cumulative totals: \`prefix[i]\` is the sum of the first \`i\` elements. With it, the sum of any range \`nums[a:b]\` is just \`prefix[b] - prefix[a]\` — computed in **O(1)**, no matter how large the range.

The trick is a one-time **O(n)** preprocessing pass to build \`prefix\`. After that, each range-sum query is a single subtraction. If you answer q queries, the naive approach costs **O(n·q)** (re-summing each range), while prefix sums cost **O(n + q)** — a huge win when q is large.

We use a leading \`0\` (\`prefix[0] = 0\`) so the formula \`prefix[b] - prefix[a]\` works cleanly for any range, including ranges starting at index 0. Prefix sums also power more advanced tricks: combined with a hash map, they count subarrays with a target sum (including with negative numbers) — a different problem from the fixed-size window.`,

  vocabulary: [
    { term: "Prefix sum", definition: "prefix[i] = sum of the first i elements of the array." },
    { term: "Range sum", definition: "The sum of a contiguous slice nums[a:b]." },
    { term: "Preprocessing", definition: "A one-time pass that builds a structure to speed up later queries." },
    { term: "Sentinel zero", definition: "The leading prefix[0] = 0 that makes the range formula uniform." },
  ],

  concepts: {
    purpose: "Prefix sums answer arbitrary range-sum queries in O(1) after O(n) setup.",
    operations: "Build cumulative totals once; answer each range sum as prefix[b] - prefix[a].",
    uses: "Many range-sum queries, subarray-sum counting (with a hash map), 2D region sums, difference arrays.",
    tradeoffs: "Spends O(n) extra space and O(n) preprocessing to make queries O(1); not worth it for a single query.",
    commonMistakes: "Off-by-one in the range formula (mind the leading 0 and inclusive/exclusive ends); rebuilding prefix per query; confusing with the fixed-size sliding window (that is one width, this is arbitrary ranges).",
    edgeCases: "Empty range (a == b) gives 0. Whole-array sum is prefix[n] - prefix[0] = prefix[n].",
  },

  complexity: [
    { operation: "Build prefix", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)", note: "One pass; stores n+1 cumulative totals." },
    { operation: "Range sum query", best: "O(1)", average: "O(1)", worst: "O(1)", note: "A single subtraction after preprocessing." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of elements in nums" },
      { symbol: "q", meaning: "the number of range-sum queries answered later" },
    ],
    costModel: "Each append and addition is amortized O(1); each query is one subtraction, O(1).",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "Building prefix visits each of the n elements once with an O(1) append/addition — O(n). After that, each range-sum query (line 9) is a single O(1) subtraction. Answering q queries is therefore O(n + q), versus O(n·q) for re-summing each range naively.",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "The prefix array stores n+1 cumulative totals — extra storage proportional to n. This is the space-for-time trade that makes queries O(1).",
      inputOutputNote: "nums (n elements) is the input; the prefix array (n+1) is the auxiliary structure we build.",
    },
    derivation: [
      { lines: [5, 6], description: "One pass over n elements builds the prefix array (amortized O(1) each).", cost: "O(n)", dimension: "time" },
      { lines: [9], description: "A range-sum query is one subtraction.", cost: "O(1)", dimension: "time" },
      { lines: [4, 6], description: "The prefix array holds n+1 totals.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Additions are constant time.", "append is amortized O(1).", "Indices in queries are valid."],
    tradeoffs: "If you only need one range sum, a direct O(range) sum is simpler and uses O(1) space; prefix sums pay off when there are many queries.",
    counters: [{ label: "prefix builds", definition: "appends while building prefix (line 6)", countLines: [6] }],
    fixedDataNote: "This run builds prefix for 5 elements and answers one query (nums[1:4] = 6). The O(n) build / O(1) query bounds generalise to n and q.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: precompute cumulative sums." },
    { line: 2, executable: true, explanation: "Create nums = [3, 1, 4, 1, 5]." },
    { line: 3, executable: false, explanation: "Comment: prefix[i] is the sum of the first i elements; prefix[0] = 0." },
    { line: 4, executable: true, explanation: "Start prefix with the sentinel 0." },
    { line: 5, executable: true, explanation: "Loop over each value x in nums (the O(n) build)." },
    { line: 6, executable: true, explanation: "Append running total = last prefix + x. After the loop, prefix = [0, 3, 4, 8, 9, 14]." },
    { line: 7, executable: true, explanation: "Print the prefix array." },
    { line: 8, executable: false, explanation: "Comment: range sum formula." },
    { line: 9, executable: true, explanation: "Sum of nums[1:4] = prefix[4] - prefix[1] = 9 - 3 = 6, in O(1)." },
  ],

  bindings: [
    { variable: "nums", model: "array" },
    { variable: "prefix", model: "array" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Using prefix = [0, 3, 4, 8, 9, 14], what is the sum of nums[0:3]?", answer: "8 — prefix[3] - prefix[0] = 8 - 0.", explanation: "The range [0:3] covers indices 0,1,2 (3+1+4=8), computed as prefix[3] - prefix[0] = 8 - 0 = 8." },
  ],

  experiments: [
    "Compute the whole-array sum as prefix[len(nums)] - prefix[0].",
    "Answer three different range sums using only subtractions.",
    "Remove the leading 0 and see how the range formula breaks for ranges starting at index 0.",
  ],

  exercises: [
    {
      id: "ps-complete-1",
      kind: "complete-code",
      prompt: "Given the prefix array, complete the range-sum query for nums[a:b].",
      starterCode: "def range_sum(prefix, a, b):\n    # TODO: return the sum of nums[a:b] in O(1)\n    pass",
      expected: "def range_sum(prefix, a, b):\n    return prefix[b] - prefix[a]",
      hints: ["prefix[i] is the sum of the first i elements.", "Subtract the part before a from the part before b.", "return prefix[b] - prefix[a]"],
    },
    {
      id: "ps-choose-1",
      kind: "choose-approach",
      prompt: "You must answer 10,000 different range-sum queries on a fixed array of 100,000 numbers. Prefix sums or re-summing each range? Give the complexities.",
      expected: "Prefix sums: O(n) build + O(1) per query = O(n + q). Re-summing is O(n) per query = O(n·q), far worse here.",
      hints: ["How many queries, and is the array fixed?", "Preprocess once, then answer each query in O(1).", "O(n+q) beats O(n·q) massively for large q."],
    },
  ],

  review: `A **prefix sum** array (\`prefix[i]\` = sum of the first i elements, with a leading 0) answers any range sum as \`prefix[b] - prefix[a]\` in **O(1)** after an **O(n)** build and **O(n)** space. It wins big for many queries (O(n+q) vs O(n·q)) and — with a hash map — also counts target-sum subarrays, which is a distinct problem from the fixed-size window.`,

  expectedOutput: "[0, 3, 4, 8, 9, 14]\n6\n",

  references: [
    {
      url: "https://cp-algorithms.com/data_structures/prefix_sum.html",
      title: "Prefix sum array — CP-Algorithms",
      section: "Prefix sums and range queries",
      topic: "arrays/prefix-sums",
      purpose: "Confirm the range-sum formula, the leading-zero convention, and O(n) build / O(1) query costs.",
      verifiedClaims: ["Range sum equals prefix[b] - prefix[a]", "Build is O(n); each query is O(1)"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://www.geeksforgeeks.org/prefix-sum-array-implementation-applications-competitive-programming/",
      title: "Prefix Sum Array — GeeksforGeeks",
      section: "Applications",
      topic: "arrays/prefix-sums",
      purpose: "Cross-check applications including subarray-sum counting.",
      verifiedClaims: ["Prefix sums support O(1) range-sum queries after preprocessing"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 15,
    contentHash: "5b61cc7ef25b6acb",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
