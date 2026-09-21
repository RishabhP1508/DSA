/**
 * Pattern: Prefix sums + hashmap.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2). Output "6\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `from collections import defaultdict

# Count contiguous subarrays whose sum is k — works even with NEGATIVE numbers.
def subarrays_sum_k(nums, k):
    count = 0
    prefix = 0
    seen = defaultdict(int)
    seen[0] = 1                    # the empty prefix has sum 0
    for x in nums:
        prefix += x                # running prefix sum
        count += seen[prefix - k]  # how many earlier prefixes complete a sum-k range
        seen[prefix] += 1          # record this prefix for future ends
    return count

print(subarrays_sum_k([1, -1, 1, -1, 1], 0))  # 6 subarrays sum to 0`;

export const prefixSumsHashmapPattern: PatternDefinition = {
  id: "prefix-sums-hashmap",
  title: "Prefix Sums + Hashmap",
  category: "Arrays & strings",
  summary:
    "Turn a range-sum question into a lookup: a subarray sums to k exactly when two prefix sums differ by k, counted with a hashmap.",

  clues: [
    "You need sums of many contiguous ranges, or to COUNT subarrays with a target sum.",
    "The array can contain NEGATIVE numbers (so a sliding window is not monotone).",
    "The target is an exact sum (or a remainder/divisibility condition on sums).",
    "Phrases like 'number of subarrays summing to k', 'subarray with sum divisible by k'.",
  ],

  naiveApproach: `Try every subarray and add up its elements: two nested loops over (start, end) plus an inner sum is **O(n³)**, or **O(n²)** if you keep a running sum for each start. For large arrays this is far too slow, and the wasted work is recomputing overlapping range sums again and again.`,

  whyItHelps: `Define \`prefix[i]\` = sum of the first i elements. Then the sum of the range (i, j] is \`prefix[j] − prefix[i]\`. A range sums to **k** exactly when \`prefix[j] − prefix[i] = k\`, i.e. \`prefix[i] = prefix[j] − k\`. So as you scan left to right maintaining the running prefix, you ask *"how many earlier prefixes equal (current prefix − k)?"* — an **O(1) hashmap lookup**. Recording each prefix's count as you go turns the whole count into a single **O(n)** pass with **O(n)** space. Crucially this works with **negative numbers**, where a sliding window fails.`,

  conditions: [
    "The aggregate is a running SUM (or something additive/invertible like XOR), so range = prefix difference.",
    "You maintain counts of prefixes seen so far, and seed the empty prefix (seen[0] = 1) so ranges starting at index 0 are counted.",
    "For 'divisible by k', key the map by prefix % k instead of the raw prefix.",
  ],

  alternatives: [
    "Sliding window — simpler and O(1) space, but ONLY when values are non-negative so the window sum is monotone. With negatives, use prefix sums + hashmap.",
    "Plain prefix-sum array (no map) — enough when you only need a few range sums by index, not a count over all ranges.",
    "Kadane's algorithm — for the MAXIMUM subarray sum, not for counting or exact-target sums.",
  ],

  counterexamples: [
    "'Largest sum of exactly k consecutive elements' — the size is fixed and you want a max, not a count: a fixed sliding window is simpler.",
    "'Longest substring without repeats' — that's a distinctness condition, not a sum: a variable sliding window fits, not prefix sums.",
    "Forgetting seen[0] = 1 undercounts subarrays that start at index 0 — a classic bug, not a different pattern.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "6\n",
  complexityNote:
    "O(n) time: one pass, each step an O(1) map lookup and update. O(n) space for the prefix-count map. Naive per-range summing is O(n²).",

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in nums" }],
    costModel: "One pass maintains a running prefix sum and a map from prefix value to how many times it has occurred; each step is an O(1) hashed lookup and update.",
    time: {
      bound: "O(n)",
      case: "expected",
      explanation: "A single loop over n elements (lines 9-12), each doing an O(1) map read (line 11) and O(1) map update (line 12). So O(n) expected, relying on average-case O(1) hashing. The naive 'sum every subarray' approach is O(n²).",
      otherCases: [
        { case: "worst", bound: "O(n²)", note: "Only under pathological hash collisions; Python dict is expected O(1) per op." },
      ],
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "The `seen` map can hold up to n+1 distinct prefix sums.",
      inputOutputNote: "nums (n) is the input; the answer is a single count.",
    },
    derivation: [
      { lines: [10], description: "Maintain the running prefix sum.", cost: "O(1) per step", dimension: "time" },
      { lines: [11, 12], description: "One map lookup + one update per element.", cost: "O(n)", dimension: "time" },
      { lines: [7], description: "The prefix-count map holds up to n+1 entries.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["dict lookup/insert are expected O(1).", "Works with NEGATIVE numbers (unlike a sliding window), because it counts prefix equalities rather than growing/shrinking a window."],
    tradeoffs: "A sliding window is O(1) space but only valid for non-negative values; prefix-sums + hashmap handles negatives at O(n) space. Naive per-range summation is O(n²).",
    counters: [{ label: "prefixes recorded", definition: "executions of seen[prefix] += 1 (line 12)", countLines: [12] }],
    fixedDataNote: "For [1,-1,1,-1,1] with k=0 there are 6 zero-sum subarrays. The O(n) bound generalises.",
  },

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import defaultdict for a counting map with a 0 default." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: count subarrays summing to k, negatives allowed." },
    { line: 4, executable: true, explanation: "Define subarrays_sum_k(nums, k)." },
    { line: 5, executable: true, explanation: "Running count of qualifying subarrays." },
    { line: 6, executable: true, explanation: "Running prefix sum." },
    { line: 7, executable: true, explanation: "Map from a prefix value to how many times it has occurred." },
    { line: 8, executable: true, explanation: "Seed the empty prefix (sum 0) so ranges starting at index 0 are counted." },
    { line: 9, executable: true, explanation: "Scan each element." },
    { line: 10, executable: true, explanation: "Extend the running prefix sum by x." },
    { line: 11, executable: true, explanation: "Add the number of earlier prefixes equal to prefix − k; each such prefix marks the start of a sum-k range ending here." },
    { line: 12, executable: true, explanation: "Record the current prefix for future range-ends." },
    { line: 13, executable: true, explanation: "Return the total count." },
    { line: 14, executable: false, explanation: "Blank line." },
    { line: 15, executable: true, explanation: "[1,-1,1,-1,1] has 6 contiguous subarrays that sum to 0." },
  ],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [{ role: "total", label: "prefix", source: "prefix" }],
    },
    { variable: "seen", model: "dict" },
  ],

  linkedLessons: ["prefix-sums", "prefix-sums-map", "hashing-frequency"],

  exercises: [
    {
      id: "pat-ps-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Count the number of contiguous subarrays with sum exactly k, where the array MAY contain negative numbers.' Which pattern, and why not a sliding window?",
      expected:
        "Prefix sums + hashmap. With negatives the window sum isn't monotone, so growing/shrinking a window can't decide membership. Track prefix sums in a map and count earlier prefixes equal to (current prefix − k). O(n).",
      correctPatternId: "prefix-sums-hashmap",
      hints: [
        "Negatives break window monotonicity.",
        "A range sum is a difference of two prefix sums.",
        "Count how many earlier prefixes equal prefix − k.",
      ],
    },
    {
      id: "pat-ps-fix-1",
      kind: "fix-mistake",
      prompt:
        "This undercounts subarrays that start at index 0. Fix the initialization.",
      starterCode:
        "seen = defaultdict(int)\ncount = 0\nprefix = 0\nfor x in nums:\n    prefix += x\n    count += seen[prefix - k]\n    seen[prefix] += 1\nreturn count",
      expected:
        "seen = defaultdict(int)\nseen[0] = 1\ncount = 0\nprefix = 0\nfor x in nums:\n    prefix += x\n    count += seen[prefix - k]\n    seen[prefix] += 1\nreturn count",
      hints: [
        "What about a range that begins at the very start?",
        "Its start prefix is the empty prefix, sum 0.",
        "Seed seen[0] = 1 before the loop.",
      ],
    },
    {
      id: "pat-ps-contrast-1",
      kind: "choose-approach",
      prompt:
        "Three problems on the SAME array of integers (with negatives): (a) largest sum of exactly k consecutive; (b) count contiguous subarrays summing to a target; (c) largest sum of any contiguous subarray. Name the pattern for each.",
      expected:
        "(a) Fixed-size sliding window. (b) Prefix sums + hashmap (negatives rule out a window). (c) Kadane's algorithm. Same array, three different patterns — the wording (fixed k / count with target / max any) is the tell.",
      correctPatternId: "prefix-sums-hashmap",
      hints: [
        "Fixed size and a max → sliding window.",
        "Count with an exact target and negatives → prefix sums + map.",
        "Max over any contiguous range → Kadane.",
      ],
    },
  ],

  references: [
    {
      url: "https://leetcode.com/problems/subarray-sum-equals-k/editorial/",
      title: "Subarray Sum Equals K — LeetCode editorial",
      section: "Prefix sum + hashmap O(n) solution",
      topic: "patterns/prefix-sums-hashmap",
      purpose:
        "Confirm the prefix-difference identity, the seen[0]=1 seed, and the O(n) count with negatives.",
      verifiedClaims: [
        "A subarray sums to k iff two prefix sums differ by k; counting earlier prefixes equal to prefix−k gives an O(n) count.",
        "Seeding the empty prefix (count 1) is required to count subarrays starting at index 0.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://cp-algorithms.com/data_structures/prefix-sum.html",
      title: "Prefix sums — CP-Algorithms",
      section: "Range sums from prefix sums",
      topic: "patterns/prefix-sums-hashmap",
      purpose: "Cross-check that a contiguous range sum equals the difference of two prefix sums.",
      verifiedClaims: ["The sum of a range is the difference of two prefix sums."],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "cc9c58251e7081ba",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
