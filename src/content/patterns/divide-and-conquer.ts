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
  "For this efficient plain-recursion template, subproblems should shrink and their results combine correctly; repeated overlapping states suggest adding memoization. Overlap does not change whether a recursion can be written, but can waste work.",
  "There must be an efficient COMBINE step; its cost per level drives the recurrence.",
  "A base case must terminate recursion, and each recursive child must be strictly smaller. Balanced splits give O(log n) depth; unbalanced recursion need not."
],

  alternatives: [
  "Dynamic programming — when subproblems OVERLAP and must be reused (memoize/tabulate).",
  "Iterative single-pass — when the answer needs no split (e.g. Kadane for max subarray is O(n) vs the O(n log n) D&C version).",
  "Heap/quickselect — quickselect is divide and conquer specialized to the one side containing the k-th element; random pivots give O(n) expected time and O(n²) worst time."
],

  counterexamples: [
  "Plain recursive Fibonacci or edit distance repeatedly solves overlapping states and can take exponential time; memoization or tabulation avoids this repetition.",
  "Maximum subarray has an O(n) Kadane solution; the O(n log n) divide-and-conquer version is instructive but not optimal.",
  "A weak/incorrect combine step gives wrong results even when the recursion is right."
],

  walkthroughCode,
  walkthroughExpectedOutput: "[1, 2, 3, 5, 8, 9]\n",
  complexityNote:
    "Merge sort: T(n) = 2T(n/2) + O(n) = O(n log n) time. O(n) auxiliary space for the merge buffers, O(log n) recursion depth.",

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements to sort"
    }
  ],
  "costModel": "Divide into two halves, recurse, then merge in linear time: T(n) = 2T(n/2) + O(n). By the master theorem this is O(n log n).",
  "time": {
    "bound": "O(n log n)",
    "case": "worst",
    "explanation": "Each recursion level splits the array (lines 5-7) and merges the halves in O(n) total (lines 8-16). There are O(log n) levels (halving each time), so O(n) per level × O(log n) levels = O(n log n). Unlike quicksort there is no O(n²) degenerate case.",
    "otherCases": [
      {
        "case": "best",
        "bound": "O(n log n)",
        "note": "Merge sort does the same work regardless of input order."
      }
    ]
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "Each merge builds a new `out` list; the slices a[:mid]/a[mid:] and buffers total O(n) auxiliary. Recursion depth is O(log n).",
    "inputOutputNote": "The returned sorted list is O(n) output; the merge buffers are O(n) auxiliary."
  },
  "derivation": [
    {
      "lines": [
        6,
        7
      ],
      "description": "Two recursive calls on half-sized inputs: 2T(n/2), with floor/ceiling sizes when n is odd.",
      "cost": "O(log n) levels",
      "dimension": "time"
    },
    {
      "lines": [
        10,
        11,
        12,
        13,
        14,
        15,
        16
      ],
      "description": "Merge the two sorted halves in linear time per level.",
      "cost": "O(n) per level",
      "dimension": "time"
    },
    {
      "lines": [
        6,
        7,
        8
      ],
      "description": "Slice copies + merge buffer = O(n) auxiliary.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Comparisons are O(1).",
    "List slicing a[:mid] copies O(mid) elements.",
    "append/extend are amortised O(1) per element."
  ],
  "tradeoffs": "Shown mergesort is stable with O(n) peak auxiliary space. Classic in-place quicksort has O(log n) stack for balanced paths and O(n) worst stack; the list-building quicksort lesson has O(n²) worst retained-list space.",
  "counters": [
    {
      "label": "merge comparisons",
      "definition": "executions of the merge compare (line 11)",
      "countLines": [
        11
      ]
    }
  ],
  "fixedDataNote": "Sorting 6 elements recurses ~log2(6) ≈ 3 levels. The O(n log n) recurrence generalises. Function/query analysis excludes demonstration input literal creation and printing."
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

  bindings: [
  {
    "variable": "a",
    "model": "array"
  },
  {
    "variable": "a",
    "model": "recursion"
  },
  {
    "variable": "left",
    "model": "array"
  },
  {
    "variable": "right",
    "model": "array"
  },
  {
    "variable": "out",
    "model": "array"
  }
],

  linkedLessons: ["merge-sort", "dp-divide-and-conquer", "quick-sort"],

  exercises: [
  {
    "id": "pat-dac-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'Sort an array in guaranteed O(n log n) time (stable).' Which divide-and-conquer algorithm and how does it split/combine?",
    "expected": "Merge sort: split in half, recursively sort each half, then MERGE the two sorted halves in linear time. T(n)=2T(n/2)+O(n)=O(n log n), stable.",
    "correctPatternId": "divide-and-conquer",
    "hints": [
      "Goal: sort an array in guaranteed O(n log n) time while staying stable.",
      "Quadratic sorts are too slow; splitting the problem lets independent halves be sorted separately.",
      "Key insight: two already-sorted halves can be combined in linear time, giving T(n)=2T(n/2)+O(n).",
      "Approach: use merge sort, a divide-and-conquer algorithm.",
      "Pseudocode: split the array in half; recursively sort each half; merge the two sorted halves linearly.",
      "Use merge sort: split in half, recursively sort, then MERGE in linear time — O(n log n) and stable."
    ],
    "recognition": {
      "scenario": "Sort an array in guaranteed O(n log n) time, stably.",
      "approaches": [
        {
          "id": "merge-sort",
          "label": "Merge sort",
          "requiredReasonIds": [
            "split-merge"
          ]
        },
        {
          "id": "quick-sort",
          "label": "Quicksort",
          "requiredReasonIds": [],
          "rejectionFeedback": "Quicksort risks O(n^2) on adversarial input and its in-place form is not stable, so it fails the guarantee and stability requirements."
        }
      ],
      "reasons": [
        {
          "id": "split-merge",
          "text": "Split in half, recursively sort each half, then MERGE the sorted halves in linear time: T(n)=2T(n/2)+O(n)=O(n log n), and the merge is stable."
        },
        {
          "id": "overlapping-sub",
          "text": "The subproblems overlap, so memoization is what makes it efficient.",
          "contradictory": true
        },
        {
          "id": "counting-range",
          "text": "Values lie in a small integer range, so counting sort is the natural fit.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "merge-sort"
      ],
      "modelExplanation": "Merge sort: split, recursively sort, and merge sorted halves linearly — a guaranteed O(n log n), stable divide-and-conquer sort."
    }
  },
  {
    "id": "pat-dac-choose-1",
    "kind": "choose-approach",
    "prompt": "Computing Fibonacci by splitting into fib(n-1) and fib(n-2): is that a good divide-and-conquer use?",
    "expected": "No — those subproblems OVERLAP, so plain divide and conquer recomputes them exponentially. This calls for dynamic programming (memoization/tabulation) to reuse subproblems.",
    "correctPatternId": "dynamic-programming",
    "hints": [
      "Goal: decide whether splitting Fibonacci into fib(n-1) and fib(n-2) is good divide-and-conquer.",
      "Plain divide-and-conquer assumes independent subproblems, but these two calls share enormous work.",
      "Key insight: fib(n-1) and fib(n-2) overlap heavily, so recomputing them is exponential.",
      "Approach: use dynamic programming (memoization or tabulation) to reuse subproblems.",
      "Pseudocode: cache fib(k) by argument, or fill a table upward so each value is computed once.",
      "No — the subproblems OVERLAP, so this calls for DP (memoization/tabulation), not plain divide-and-conquer."
    ],
    "recognition": {
      "scenario": "Computing Fibonacci by splitting into fib(n−1) and fib(n−2): is that a good divide-and-conquer use?",
      "approaches": [
        {
          "id": "dp",
          "label": "Dynamic programming (memoize/tabulate)",
          "requiredReasonIds": [
            "overlap-reuse"
          ]
        },
        {
          "id": "plain-dac",
          "label": "Plain divide and conquer",
          "requiredReasonIds": [],
          "rejectionFeedback": "The two subproblems OVERLAP heavily, so plain divide and conquer recomputes them exponentially — the hallmark of a DP problem."
        }
      ],
      "reasons": [
        {
          "id": "overlap-reuse",
          "text": "fib(n−1) and fib(n−2) share overlapping subproblems, so caching each value once turns exponential recomputation into O(n) — this is DP, not divide and conquer."
        },
        {
          "id": "independent-halves",
          "text": "The subproblems are independent and non-overlapping, so divide and conquer is ideal.",
          "contradictory": true
        },
        {
          "id": "needs-sorting",
          "text": "The values must be sorted before combining.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "dp"
      ],
      "modelExplanation": "No — fib's subproblems overlap, so plain divide and conquer recomputes exponentially. Memoization/tabulation (DP) reuses each subproblem for O(n)."
    }
  },
  {
    "id": "pat-dac-fix-1",
    "kind": "fix-mistake",
    "prompt": "`merge(left, right)` merges two sorted lists into one sorted list. This drops leftovers after one side empties. Fix the combine step.",
    "starterCode": "def merge(left, right):\n    out = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            out.append(left[i]); i += 1\n        else:\n            out.append(right[j]); j += 1\n    # TODO: append whatever remains\n    return out",
    "expected": "def merge(left, right):\n    out = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            out.append(left[i]); i += 1\n        else:\n            out.append(right[j]); j += 1\n    out.extend(left[i:])\n    out.extend(right[j:])\n    return out",
    "hints": [
      "Goal: merge(left, right) = one sorted list from two sorted lists (the merge-sort combine).",
      "The main loop stops when EITHER side is exhausted, leaving the other's tail behind.",
      "Key property: the remaining elements of the non-empty side are already sorted.",
      "Approach: after the loop, append both remainders (one is empty).",
      "Pseudocode: out.extend(left[i:]); out.extend(right[j:]).",
      "Fix: add out.extend(left[i:]) and out.extend(right[j:]) after the while loop."
    ],
    "tests": "assert merge([1,3,5], [2,4,6]) == [1,2,3,4,5,6]\nassert merge([1,2], []) == [1,2], 'leftover left must be appended'\nassert merge([], [3,4]) == [3,4], 'leftover right must be appended'\nassert merge([1,1,1],[1]) == [1,1,1,1]\nassert merge([], []) == []\n# Stability (distinguishes <= from <): equal keys keep the LEFT element first.\nclass _E:\n    def __init__(self, k, src): self.k = k; self.src = src\n    def __le__(self, o): return self.k <= o.k\n    def __lt__(self, o): return self.k < o.k\nout = merge([_E(1,'L')], [_E(1,'R')])\nassert out[0].src == 'L', 'stable merge takes the left element on a tie (needs <=)'\nprint('OK')"
  }
],

  references: [
  {
    "url": "https://opendatastructures.org/ods-python/11_1_Comparison_Based_Sorti.html",
    "title": "Open Data Structures: comparison-based sorting",
    "section": "11.1.1 merge-sort; recurrence tree and Figure 11.2",
    "topic": "patterns/divide-and-conquer",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Two half-sized calls plus linear copy/merge work give logarithmic levels and O(n log n) time."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  },
  {
    "url": "https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheMergeSort.html",
    "title": "TheMergeSort",
    "section": "Algorithm, analysis and visual example",
    "topic": "patterns/divide-and-conquer",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "The <= choice keeps equal items stable; base case stops at <=1."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "042da46976f0fc39",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
