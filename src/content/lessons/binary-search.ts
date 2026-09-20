/**
 * Lesson: Binary search (Searching). Verified on CPython 3.14.
 * Output: "3\n-1\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Binary search on a SORTED array: halve the range each step.
def binary_search(nums, target):
    lo = 0
    hi = len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1   # target is in the right half
        else:
            hi = mid - 1   # target is in the left half
    return -1

print(binary_search([1, 3, 5, 7, 9, 11], 7))
print(binary_search([1, 3, 5, 7, 9, 11], 4))`;

export const binarySearch: LessonDefinition = {
  id: "binary-search",
  title: "Binary Search (Sorted Arrays)",
  area: "Searching",
  prerequisites: ["linear-search", "complexity"],

  explanation: `**Binary search** finds a value in a **sorted** array by repeatedly halving the search range. You look at the middle element: if it equals the target, done; if it is too small, the target must be in the **right half**, so discard the left; if it is too big, discard the right. Each comparison throws away half of what remains.

That halving is why it is **O(log n)**: starting from n candidates, you go n → n/2 → n/4 → … → 1, which takes about log₂(n) steps. For a million elements that is only ~20 comparisons, versus up to a million for linear search. The price of admission is that the array **must be sorted** — binary search is meaningless on unsorted data.

Two details make or break correctness: the loop condition \`lo <= hi\` (so a one-element range is still checked), and computing \`mid = (lo + hi) // 2\`. The pointers \`lo\`, \`hi\`, \`mid\` in the visualization show the range shrinking by half each step. This "halve the range" idea generalizes to bounds, rotated arrays, and even "binary search on the answer."`,

  vocabulary: [
    { term: "Binary search", definition: "Halving a sorted range each step to locate a target in O(log n)." },
    { term: "Search range [lo, hi]", definition: "The still-possible indices; it shrinks by half each comparison." },
    { term: "Midpoint", definition: "mid = (lo + hi) // 2, the element compared each step." },
    { term: "Invariant", definition: "If the target exists, it is always within [lo, hi]." },
    { term: "Logarithmic O(log n)", definition: "Cost grows with the number of halvings, ~log2(n)." },
  ],

  concepts: {
    purpose: "Find a value in a sorted array far faster than scanning — O(log n) instead of O(n).",
    operations: "Compare the middle; discard the half that cannot contain the target; repeat.",
    uses: "Membership in sorted data, finding boundaries, and as a template for bounds/rotated/answer searches.",
    tradeoffs: "Dramatically faster than linear search but requires sorted input (sorting first is O(n log n)).",
    commonMistakes: "Using it on unsorted data; wrong loop condition (lo < hi misses one-element ranges); updating lo/hi to mid instead of mid±1 (infinite loop); integer-overflow-style mid in other languages (not an issue in Python's big ints).",
    edgeCases: "Empty array (loop never runs, returns -1). Target at the ends. Duplicates: returns some matching index, not necessarily the first (use bounds for that).",
  },

  complexity: [
    { operation: "Binary search", best: "O(1)", average: "O(log n)", worst: "O(log n)", space: "O(1)", note: "Halves the range each step; iterative uses O(1) space." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in the sorted array" }],
    costModel: "Each iteration does one midpoint computation and one comparison — O(1) — and halves the remaining range.",
    time: {
      bound: "O(log n)",
      case: "worst",
      explanation: "Each comparison discards half of the remaining candidates, so the range shrinks n → n/2 → n/4 → … → 1. The number of halvings needed to reach 1 is about log₂(n), and each does constant work. So the worst and average case are O(log n); the best case is O(1) if the middle element is the target on the first try.",
      otherCases: [
        { case: "best", bound: "O(1)", note: "The very first midpoint equals the target." },
      ],
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "The iterative version keeps just lo, hi, and mid — three variables regardless of n. (A recursive version would use O(log n) stack depth instead.)",
      inputOutputNote: "The sorted array of n elements is the input, not auxiliary space.",
    },
    derivation: [
      { lines: [5], description: "The loop runs about log2(n) times because each step halves the range.", cost: "O(log n)", dimension: "time" },
      { lines: [6, 7, 9, 11], description: "Each step: one midpoint, one comparison, one range update — all O(1).", cost: "O(1)", dimension: "time" },
      { lines: [3, 4], description: "Three index variables, independent of n (iterative).", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["The array is SORTED (the correctness precondition).", "Index access and comparisons are O(1).", "This is the iterative form; recursion would add O(log n) stack space."],
    tradeoffs: "Linear search is O(n) but needs no sorting; binary search is O(log n) but requires sorted data. If you sort just to binary-search once, the O(n log n) sort dominates — only worth it for many searches.",
    counters: [{ label: "iterations", definition: "executions of the loop body midpoint (line 6)", countLines: [6] }],
    fixedDataNote: "Searching 6 elements takes at most ~3 iterations (log2(6) ≈ 2.6). The O(log n) bound generalises the halving to n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: binary search needs a sorted array." },
    { line: 2, executable: true, explanation: "Define binary_search(nums, target)." },
    { line: 3, executable: true, explanation: "lo starts at the first index." },
    { line: 4, executable: true, explanation: "hi starts at the last index." },
    { line: 5, executable: true, explanation: "Loop while the range is non-empty (lo <= hi covers one-element ranges)." },
    { line: 6, executable: true, explanation: "Compute the midpoint index." },
    { line: 7, executable: true, explanation: "If the middle element is the target, return its index." },
    { line: 8, executable: true, explanation: "Found it: return mid." },
    { line: 9, executable: true, explanation: "Else if the middle is too small (nums[mid] < target)..." },
    { line: 10, executable: true, explanation: "...discard the left half by moving lo to mid+1 (target is in the right half)." },
    { line: 11, executable: true, explanation: "Otherwise the middle is too big." },
    { line: 12, executable: true, explanation: "Discard the right half by moving hi to mid-1 (target is in the left half)." },
    { line: 13, executable: true, explanation: "If the range empties with no match, return -1." },
    { line: 14, executable: false, explanation: "Blank line." },
    { line: 15, executable: true, explanation: "Search for 7 in the sorted array → index 3." },
    { line: 16, executable: true, explanation: "Search for 4 (absent) → -1." },
  ],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [
        { role: "boundary", label: "lo", source: "lo" },
        { role: "pointer", label: "mid", source: "mid" },
        { role: "boundary", label: "hi", source: "hi" },
      ],
    },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "About how many comparisons does binary search need for 1,000,000 sorted elements, and why so few?", answer: "About 20 (log2(1,000,000) ≈ 20), because each comparison halves the remaining range.", explanation: "Halving a million down to one takes ~log₂(10^6) ≈ 20 steps, each O(1) — the essence of O(log n)." },
  ],

  experiments: [
    "Search for the first and last elements and watch the range shrink from each side.",
    "Change the array to be unsorted and observe wrong results — binary search needs sorted data.",
    "Add a print of mid each iteration and count how few steps it takes.",
  ],

  exercises: [
    {
      id: "bs-fix-1",
      kind: "fix-mistake",
      prompt: "This binary search can loop forever on some inputs. Fix the range updates.",
      starterCode: "def bsearch(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            lo = mid\n        else:\n            hi = mid\n    return -1",
      expected: "def bsearch(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1",
      hints: ["If lo/hi are set to mid (not mid±1), the range may not shrink.", "Exclude mid since it was already checked.", "Use lo = mid + 1 and hi = mid - 1."],
    },
    {
      id: "bs-choose-1",
      kind: "choose-approach",
      prompt: "You need to search a collection 100,000 times. It is currently unsorted. Compare (a) linear each time, (b) sort once then binary-search, (c) build a set. Give complexities.",
      expected: "(a) O(n) per query = O(n·q). (b) O(n log n) sort + O(q log n) queries. (c) O(n) build + O(q) expected queries. For pure membership, the set (c) is usually best; binary search (b) also gives ordered queries like bounds.",
      hints: ["How many queries vs the cost to preprocess?", "Sorting enables O(log n) queries; a set enables expected O(1).", "Set for membership; sorted+binary for order-based queries (bounds, ranges)."],
    },
  ],

  review: `**Binary search** locates a target in a **sorted** array in **O(log n)** by halving the range each comparison (discard the half that cannot contain the target). Keep \`lo <= hi\` and move to \`mid ± 1\` to guarantee progress. It is far faster than linear search but requires sorted input, and its "halve the range" idea powers bounds, rotated-array, and answer searches.`,

  expectedOutput: "3\n-1\n",

  references: [
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheBinarySearch.html",
      title: "The Binary Search — Problem Solving with Algorithms and DS using Python (Runestone)",
      section: "Binary search analysis",
      topic: "searching/binary",
      purpose: "Confirm the binary-search algorithm on sorted data and its O(log n) analysis.",
      verifiedClaims: ["Binary search halves the range each step, giving O(log n)", "It requires the list to be sorted"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://cp-algorithms.com/num_methods/binary_search.html",
      title: "Binary search — CP-Algorithms",
      section: "Classic binary search and correctness",
      topic: "searching/binary",
      purpose: "Cross-check loop-condition/midpoint conventions and correctness reasoning.",
      verifiedClaims: ["Correct binary search maintains an invariant and shrinks the range with mid ± 1"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "fee64ecee9cdbecd",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
