/**
 * Pattern: Divide and conquer.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "[1, 2, 3, 5, 8, 9]\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# Divide and conquer: split, solve each half recursively, then combine.
def merge_sort(a):
    if len(a) <= 1:               # base case: already sorted
        return a
    mid = len(a) // 2
    left = merge_sort(a[:mid])    # conquer the left half
    right = merge_sort(a[mid:])   # conquer the right half
    out = []                      # combine two sorted halves
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    out.extend(left[i:])
    out.extend(right[j:])
    return out

print(merge_sort([5, 2, 8, 1, 9, 3]))`;

export const divideAndConquerPattern: PatternDefinition = {
  id: "divide-and-conquer",
  title: "Divide and Conquer",
  category: "Sorting & divide-and-conquer",
  summary:
    "Split a problem into independent subproblems, solve each recursively, and combine — often turning O(n²) into O(n log n).",

  clues: [
    "The problem splits cleanly into INDEPENDENT subproblems whose answers combine into the whole.",
    "You want O(n log n) sorting, an order statistic, counting inversions, or a geometric split.",
    "Phrases like 'merge sort', 'quickselect / kth element', 'count inversions', 'closest pair of points', 'maximum subarray (D&C)'.",
  ],

  naiveApproach: `Solve the whole problem directly — e.g. compare-and-swap sorting is **O(n²)**, and checking all pairs (closest pair, inversions) is **O(n²)**. This ignores that the problem decomposes into smaller instances that are much cheaper to solve and merge.`,

  whyItHelps: `**Divide** the input into (usually two) roughly equal parts, **conquer** each part by recursion, then **combine** the sub-answers with a merge/cross step. Because the parts are **independent** (unlike DP's overlapping subproblems), no caching is needed. The cost follows a recurrence like **T(n) = 2·T(n/2) + O(n)**, which by the master theorem is **O(n log n)** — the classic speedup behind merge sort. The combine step is where the real work (and correctness) lives.`,

  conditions: [
    "Subproblems must be INDEPENDENT (no shared overlapping state — otherwise it's dynamic programming).",
    "There must be an efficient COMBINE step; its cost per level drives the recurrence.",
    "Recursion depth is O(log n) for balanced splits (mind the stack for huge inputs).",
  ],

  alternatives: [
    "Dynamic programming — when subproblems OVERLAP and must be reused (memoize/tabulate).",
    "Iterative single-pass — when the answer needs no split (e.g. Kadane for max subarray is O(n) vs the O(n log n) D&C version).",
    "Heap/quickselect — quickselect is D&C specialized to one side for the k-th element in O(n) average.",
  ],

  counterexamples: [
    "If subproblems overlap (Fibonacci, edit distance), plain D&C recomputes them exponentially — use DP.",
    "Maximum subarray has an O(n) Kadane solution; the O(n log n) divide-and-conquer version is instructive but not optimal.",
    "A weak/incorrect combine step gives wrong results even when the recursion is right.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "[1, 2, 3, 5, 8, 9]\n",
  complexityNote:
    "Merge sort: T(n) = 2T(n/2) + O(n) = O(n log n) time. O(n) auxiliary space for the merge buffers, O(log n) recursion depth.",

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements to sort" }],
    costModel: "Divide into two halves, recurse, then merge in linear time: T(n) = 2T(n/2) + O(n). By the master theorem this is O(n log n).",
    time: {
      bound: "O(n log n)",
      case: "worst",
      explanation: "Each recursion level splits the array (lines 5-7) and merges the halves in O(n) total (lines 8-16). There are O(log n) levels (halving each time), so O(n) per level × O(log n) levels = O(n log n). Unlike quicksort there is no O(n²) degenerate case.",
      otherCases: [
        { case: "best", bound: "O(n log n)", note: "Merge sort does the same work regardless of input order." },
      ],
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "Each merge builds a new `out` list; the slices a[:mid]/a[mid:] and buffers total O(n) auxiliary. Recursion depth is O(log n).",
      inputOutputNote: "The returned sorted list is O(n) output; the merge buffers are O(n) auxiliary.",
    },
    derivation: [
      { lines: [6, 7], description: "Two recursive calls on halves — T(2·n/2).", cost: "O(log n) levels", dimension: "time" },
      { lines: [10, 11, 12, 13, 14, 15, 16], description: "Merge the two sorted halves in linear time per level.", cost: "O(n) per level", dimension: "time" },
      { lines: [6, 7, 8], description: "Slice copies + merge buffer = O(n) auxiliary.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Comparisons are O(1).", "List slicing a[:mid] copies O(mid) elements.", "append/extend are amortised O(1) per element."],
    tradeoffs: "Merge sort is stable and guaranteed O(n log n) but uses O(n) extra space; quicksort is in-place (O(log n)) but O(n²) worst case; heapsort is in-place O(n log n) but not stable.",
    counters: [{ label: "merge comparisons", definition: "executions of the merge compare (line 11)", countLines: [11] }],
    fixedDataNote: "Sorting 6 elements recurses ~log2(6) ≈ 3 levels. The O(n log n) recurrence generalises.",
  },

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: split, conquer halves, combine." },
    { line: 2, executable: true, explanation: "Define merge_sort(a)." },
    { line: 3, executable: true, explanation: "Base case: a list of 0 or 1 elements is already sorted." },
    { line: 4, executable: true, explanation: "Return it unchanged." },
    { line: 5, executable: true, explanation: "Split point." },
    { line: 6, executable: true, explanation: "Recursively sort the left half." },
    { line: 7, executable: true, explanation: "Recursively sort the right half." },
    { line: 8, executable: true, explanation: "Combine step: merge two sorted halves." },
    { line: 9, executable: true, explanation: "Two merge cursors." },
    { line: 10, executable: true, explanation: "While both halves have elements..." },
    { line: 11, executable: true, explanation: "...take the smaller front..." },
    { line: 12, executable: true, explanation: "...from the left if it's <=..." },
    { line: 13, executable: false, explanation: "...otherwise..." },
    { line: 14, executable: true, explanation: "...from the right." },
    { line: 15, executable: true, explanation: "Append any leftover left elements." },
    { line: 16, executable: true, explanation: "Append any leftover right elements." },
    { line: 17, executable: true, explanation: "Return the merged, sorted list." },
    { line: 18, executable: false, explanation: "Blank line." },
    { line: 19, executable: true, explanation: "Sorts to [1, 2, 3, 5, 8, 9]." },
  ],

  bindings: [{ variable: "a", model: "array" }],

  linkedLessons: ["merge-sort", "dp-divide-and-conquer", "quick-sort"],

  exercises: [
    {
      id: "pat-dac-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Sort an array in guaranteed O(n log n) time (stable).' Which divide-and-conquer algorithm and how does it split/combine?",
      expected:
        "Merge sort: split in half, recursively sort each half, then MERGE the two sorted halves in linear time. T(n)=2T(n/2)+O(n)=O(n log n), stable.",
      correctPatternId: "divide-and-conquer",
      hints: [
        "Split into independent halves.",
        "The work is in the merge/combine.",
        "T(n)=2T(n/2)+O(n).",
      ],
    },
    {
      id: "pat-dac-choose-1",
      kind: "choose-approach",
      prompt:
        "Computing Fibonacci by splitting into fib(n-1) and fib(n-2): is that a good divide-and-conquer use?",
      expected:
        "No — those subproblems OVERLAP, so plain divide and conquer recomputes them exponentially. This calls for dynamic programming (memoization/tabulation) to reuse subproblems.",
      correctPatternId: "divide-and-conquer",
      hints: [
        "Do the subproblems overlap?",
        "fib(n-1) and fib(n-2) share work.",
        "Overlap -> DP, not plain D&C.",
      ],
    },
    {
      id: "pat-dac-fix-1",
      kind: "fix-mistake",
      prompt:
        "This merge sort drops leftover elements after one half empties. Fix the combine step.",
      starterCode:
        "out = []\ni = j = 0\nwhile i < len(left) and j < len(right):\n    if left[i] <= right[j]:\n        out.append(left[i]); i += 1\n    else:\n        out.append(right[j]); j += 1\nreturn out",
      expected:
        "out = []\ni = j = 0\nwhile i < len(left) and j < len(right):\n    if left[i] <= right[j]:\n        out.append(left[i]); i += 1\n    else:\n        out.append(right[j]); j += 1\nout.extend(left[i:])\nout.extend(right[j:])\nreturn out",
      hints: [
        "When the loop ends, one half may still have elements.",
        "Those remaining elements are already sorted.",
        "Extend out with left[i:] and right[j:].",
      ],
    },
  ],

  references: [
    {
      url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/lecture-notes/",
      title: "Introduction to Algorithms 6.006 — Divide and Conquer (MIT OCW)",
      section: "Recurrences, master theorem, merge sort",
      topic: "patterns/divide-and-conquer",
      purpose: "Confirm the divide/conquer/combine structure and that T(n)=2T(n/2)+O(n) resolves to O(n log n).",
      verifiedClaims: [
        "Divide and conquer splits into independent subproblems, solves them recursively, and combines.",
        "The recurrence T(n) = 2T(n/2) + O(n) has solution O(n log n).",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://algs4.cs.princeton.edu/22mergesort/",
      title: "Mergesort — Algorithms, 4th Edition (Princeton)",
      section: "Top-down mergesort and the merge operation",
      topic: "patterns/divide-and-conquer",
      purpose: "Cross-check merge sort as the canonical divide-and-conquer sort with an O(n) merge.",
      verifiedClaims: ["Merge sort recursively sorts halves and merges them in linear time for O(n log n) overall."],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "671ecf973c39e918",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
