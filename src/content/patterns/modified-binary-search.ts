/**
 * Pattern: Modified binary search.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2). Output "4\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# Modified binary search: search a ROTATED sorted array in O(log n).
def search_rotated(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:            # the left half is sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1                 # target is in the sorted left half
            else:
                lo = mid + 1
        else:                                 # the right half is sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1                 # target is in the sorted right half
            else:
                hi = mid - 1
    return -1

print(search_rotated([4, 5, 6, 7, 0, 1, 2], 0))  # index 4`;

export const modifiedBinarySearchPattern: PatternDefinition = {
  id: "modified-binary-search",
  title: "Modified Binary Search",
  category: "Searching",
  summary:
    "Adapt binary search to almost-sorted inputs — rotated arrays, bitonic peaks, first/last position — by deciding each step which half to keep.",

  clues: [
    "The array is sorted but TRANSFORMED: rotated, has duplicates, is bitonic (up then down), or you want a boundary (first/last index).",
    "You need O(log n) search where plain binary search doesn't directly apply.",
    "Phrases like 'rotated sorted array', 'find peak element', 'first and last position', 'search in infinite array', 'ceiling of a number'.",
  ],

  naiveApproach: `Scan linearly for the target or boundary — **O(n)**. This throws away the (partial) ordering that still lets you eliminate half the array per comparison, which is exactly what makes O(log n) possible.`,

  whyItHelps: `Even when the array is rotated or shaped, at each midpoint **one side is still sorted** (or the shape tells you which way to go). Compare the target against that sorted side's endpoints to decide whether it lies there; if so, keep that half, otherwise discard it. Each step still halves the search space, preserving **O(log n)** time and **O(1)** space. The 'modification' is just a smarter rule for choosing which half to keep, adapted to the input's structure.`,

  conditions: [
    "There must be enough structure to decide, in O(1), which half can contain the answer (a sorted side, a monotone trend, a boundary predicate).",
    "Handle equal elements carefully (duplicates in a rotated array can force an O(n) worst case).",
    "For boundary searches (first/last), don't stop at the first match — keep shrinking toward the edge.",
  ],

  alternatives: [
    "Plain binary search — when the array is fully sorted and you want an exact value/index.",
    "Binary search on the ANSWER — when you're searching a range of candidate answers via a feasibility test, not array positions.",
    "Linear scan — acceptable only for tiny inputs or when structure is truly absent.",
  ],

  counterexamples: [
    "A completely unsorted array has no half to eliminate — binary search doesn't apply; sort first or scan.",
    "Minimizing a feasible capacity/threshold is 'binary search on the answer', a different (predicate-based) variant.",
    "Stopping at the first match when asked for the FIRST/LAST occurrence gives a wrong boundary.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "4\n",
  complexityNote:
    "O(log n) time — each step discards half the array. O(1) space. (Duplicates in a rotated array can degrade the worst case toward O(n).)",

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in nums" }],
    costModel: "Each iteration identifies which half is sorted and discards half the remaining range, so the search space halves every step.",
    time: {
      bound: "O(log n)",
      case: "worst",
      explanation: "The loop (lines 4-17) halves [lo, hi] each iteration by deciding which side is sorted (line 8) and whether the target lies in it. So O(log n) comparisons for DISTINCT values.",
      otherCases: [
        { case: "worst", bound: "O(n)", note: "With DUPLICATES the sorted-half test can become ambiguous (nums[lo]==nums[mid]), degrading toward O(n)." },
      ],
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Only lo, hi, mid indices are kept; nothing grows with n.",
      inputOutputNote: "nums (n) is the input; the answer is a single index or -1.",
    },
    derivation: [
      { lines: [4, 5], description: "Each iteration computes a midpoint and halves the range.", cost: "O(log n) iterations", dimension: "time" },
      { lines: [8, 9, 14], description: "O(1) work per iteration to pick the sorted half and decide.", cost: "O(1) per step", dimension: "time" },
      { lines: [3], description: "A constant number of index variables.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["The array is a rotation of a sorted array with DISTINCT values (for the O(log n) bound).", "Indexing and comparison are O(1)."],
    tradeoffs: "A linear scan is O(n) but always works (even with duplicates); the modified binary search is O(log n) for distinct values by exploiting the always-one-side-sorted property.",
    counters: [{ label: "halving steps", definition: "iterations of the search loop (line 4)", countLines: [4] }],
    fixedDataNote: "Searching 0 in [4,5,6,7,0,1,2] finds index 4 in ~log2(7) steps. The O(log n) bound generalises for distinct values.",
  },

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: search a rotated sorted array." },
    { line: 2, executable: true, explanation: "Define search_rotated(nums, target)." },
    { line: 3, executable: true, explanation: "Standard binary-search bounds." },
    { line: 4, executable: true, explanation: "Loop while the range is non-empty." },
    { line: 5, executable: true, explanation: "Midpoint." },
    { line: 6, executable: true, explanation: "Found the target." },
    { line: 7, executable: true, explanation: "Return its index." },
    { line: 8, executable: true, explanation: "If the left half [lo..mid] is sorted..." },
    { line: 9, executable: true, explanation: "...and the target lies within it..." },
    { line: 10, executable: true, explanation: "...search the left half." },
    { line: 11, executable: false, explanation: "Otherwise..." },
    { line: 12, executable: true, explanation: "...search the right half." },
    { line: 13, executable: false, explanation: "Else the right half [mid..hi] is sorted." },
    { line: 14, executable: true, explanation: "If the target lies within the sorted right half..." },
    { line: 15, executable: true, explanation: "...search the right half." },
    { line: 16, executable: false, explanation: "Otherwise..." },
    { line: 17, executable: true, explanation: "...search the left half." },
    { line: 18, executable: true, explanation: "Not found." },
    { line: 19, executable: false, explanation: "Blank line." },
    { line: 20, executable: true, explanation: "0 sits at index 4 in the rotated array." },
  ],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [
        { role: "boundary", label: "lo", source: "lo" },
        { role: "boundary", label: "hi", source: "hi" },
        { role: "pointer", label: "mid", source: "mid" },
      ],
    },
  ],

  linkedLessons: ["binary-search", "rotated-array-search", "bounds"],

  exercises: [
    {
      id: "pat-mbs-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'A sorted array was rotated at an unknown pivot; find the index of a target in O(log n).' Which pattern?",
      expected:
        "Modified binary search: at each midpoint one half is still sorted; test whether the target lies in that sorted half and keep it, else keep the other. O(log n), O(1) space.",
      correctPatternId: "modified-binary-search",
      hints: [
        "The array is sorted-then-rotated.",
        "One side of mid is always sorted.",
        "Decide which half can contain the target.",
      ],
    },
    {
      id: "pat-mbs-choose-1",
      kind: "choose-approach",
      prompt:
        "'Find the minimum ship capacity so all packages ship within D days.' Is that modified binary search on a rotated array?",
      expected:
        "No — that's binary search on the ANSWER: search the range of candidate capacities using a feasibility test. Modified binary search here refers to searching within a transformed sorted ARRAY, not a candidate-answer range.",
      correctPatternId: "modified-binary-search",
      hints: [
        "Are you searching array positions or candidate answers?",
        "This one tests feasibility of a value.",
        "That's binary-search-on-answer.",
      ],
    },
    {
      id: "pat-mbs-fix-1",
      kind: "fix-mistake",
      prompt:
        "This 'first occurrence' search returns any match instead of the first. Fix it to keep searching left.",
      starterCode:
        "lo, hi = 0, len(nums) - 1\nres = -1\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    if nums[mid] == target:\n        return mid\n    elif nums[mid] < target:\n        lo = mid + 1\n    else:\n        hi = mid - 1\nreturn res",
      expected:
        "lo, hi = 0, len(nums) - 1\nres = -1\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    if nums[mid] == target:\n        res = mid\n        hi = mid - 1\n    elif nums[mid] < target:\n        lo = mid + 1\n    else:\n        hi = mid - 1\nreturn res",
      hints: [
        "Returning on the first match may skip earlier occurrences.",
        "Record the match, then keep searching to the left.",
        "res = mid; hi = mid - 1",
      ],
    },
  ],

  references: [
    {
      url: "https://leetcode.com/problems/search-in-rotated-sorted-array/editorial/",
      title: "Search in Rotated Sorted Array — LeetCode editorial",
      section: "Binary search using the sorted half",
      topic: "patterns/modified-binary-search",
      purpose: "Confirm that at each step one half is sorted and can be tested to decide which half to keep, in O(log n).",
      verifiedClaims: [
        "In a rotated sorted array, at each midpoint one half is sorted, enabling an O(log n) binary search.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://cp-algorithms.com/num_methods/binary_search.html",
      title: "Binary search — CP-Algorithms",
      section: "Searching over structured/monotone inputs",
      topic: "patterns/modified-binary-search",
      purpose: "Cross-check that binary search generalizes to any input where each step can eliminate half.",
      verifiedClaims: ["Binary search applies whenever a comparison can discard half the remaining candidates."],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "199e2189f6d57d0b",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
