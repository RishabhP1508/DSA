/**
 * Lesson: Quick sort (Sorting). Verified on CPython 3.14.
 * Output: "[1, 2, 3, 4, 5, 8]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Quick sort: partition around a pivot, then sort each side.
def quick_sort(a):
    if len(a) <= 1:                       # base case
        return a
    pivot = a[len(a) // 2]                 # choose a pivot
    less = [x for x in a if x < pivot]     # elements smaller than pivot
    equal = [x for x in a if x == pivot]   # equal to pivot
    greater = [x for x in a if x > pivot]  # larger than pivot
    return quick_sort(less) + equal + quick_sort(greater)

print(quick_sort([5, 1, 4, 2, 8, 3]))`;

export const quickSort: LessonDefinition = {
  id: "quick-sort",
  title: "Quick Sort",
  area: "Sorting",
  prerequisites: ["merge-sort", "cases"],

  explanation: "**Quicksort** chooses a pivot value, groups smaller, equal and greater values, and recursively sorts the smaller and greater groups. The shown implementation scans into new lists and concatenates results; it preserves input order within equal-value groups.\n\nWith distinct values in a uniformly random permutation, its middle-position pivot has average O(n log n) time. A middle position does not guarantee a median value: crafted inputs can repeatedly put an extreme there, giving O(n²) time. All equal values are a special best case: one partition pass handles the whole list in O(n). Sorted distinct input is balanced for this middle-position choice; choosing a[0] instead makes sorted input a bad case.\n\nMemory also depends on this code. Balanced recursive calls retain O(n) live list entries across a geometric-size path. A degenerate path can retain lists of sizes n−1, n−2, … in suspended parent calls, totaling O(n²) auxiliary space. Classic in-place partition variants avoid these lists but can still use O(n) recursion stack in a bad case. Random pivots give expected behavior; median-of-three is a heuristic without a worst-case guarantee. Large degenerate examples can exceed Python's recursion limit.",

  vocabulary: [
    { term: "Pivot", definition: "The chosen element that partitions the array." },
    { term: "Partition", definition: "Rearranging so smaller elements precede the pivot and larger follow." },
    { term: "Balanced split", definition: "Partitions of roughly equal size, giving log n depth (good)." },
    { term: "Degenerate split", definition: "Highly unequal partitions, giving ~n depth and O(n²)." },
    { term: "Randomized pivot", definition: "Choosing the pivot randomly to avoid worst-case inputs." },
  ],

  concepts: {
  "purpose": "Sort quickly on average via pivot-based partitioning; the workhorse of many libraries.",
  "operations": "Pick a pivot; partition into less/equal/greater; recurse on the two sides.",
  "uses": "General-purpose in-memory sorting, quickselect (kth element), library sort routines.",
  "tradeoffs": "This version: average O(n log n) with a random-permutation model, worst O(n²) time and space; its equal-value groups preserve order. Classic in-place variants usually lose stability.",
  "commonMistakes": "Naive first/last pivot on sorted data (worst case); missing base case; assuming it is always O(n log n); expecting stability from the in-place version.",
  "edgeCases": "Empty/singleton input returns immediately. All equal values take O(n). Sorted distinct input is balanced for this middle-position pivot; crafted middle extremes can cause O(n²) time/space and a recursion-limit error."
},

  complexity: [
  {
    "operation": "Shown three-list quicksort",
    "best": "O(n)",
    "average": "O(n log n)",
    "worst": "O(n^2)",
    "space": "O(n^2)",
    "note": "All equal is linear; average assumes distinct random-permutation input. Balanced live memory O(n), worst suspended partition lists O(n²)."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements to sort"
    }
  ],
  "costModel": "Each call makes three O(m) comprehension scans and O(m) result concatenations for a subproblem of size m. Comparisons are constant-time under a consistent total order.",
  "time": {
    "bound": "O(n log n)",
    "case": "average",
    "explanation": "For distinct values in a uniformly random input permutation, a middle-position pivot has a random rank, giving average O(n log n) total partition/concatenation work. Crafted orders can put an extreme at each chosen middle position and give O(n²). Three-way grouping makes an all-equal list finish in O(n).",
    "otherCases": [
      {
        "case": "best",
        "bound": "O(n)",
        "note": "All equal values form only the equal group in one call; no nontrivial recursion."
      },
      {
        "case": "worst",
        "bound": "O(n^2)",
        "note": "Repeated extreme-ranked middle-position pivots create a chain of sizes n,n−1,…."
      }
    ]
  },
  "space": {
    "bound": "O(n^2)",
    "case": "worst",
    "explanation": "Suspended parent frames retain their less/equal/greater lists. A degenerate chain keeps n−1 + n−2 + … live entries, O(n²), in addition to O(n) frames. Balanced paths retain a geometric sum of list sizes, O(n). Concatenation creates additional temporary result lists but does not raise these bounds.",
    "inputOutputNote": "The supplied input and final O(n) returned result are separate; the retained partition lists are auxiliary."
  },
  "derivation": [
    {
      "lines": [
        6,
        7,
        8
      ],
      "description": "Partitioning scans all elements of the current piece — O(m) per call.",
      "cost": "O(n log n)",
      "dimension": "time"
    },
    {
      "lines": [
        9
      ],
      "description": "Recursion on the two sides; balanced → log n depth, lopsided → n depth (worst case O(n²)).",
      "cost": "O(n log n)",
      "dimension": "time"
    },
    {
      "lines": [
        6,
        7,
        8
      ],
      "description": "Partition lists from all suspended parents coexist; a degenerate chain retains a quadratic sum of sizes.",
      "cost": "O(n^2)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Input values have consistent <, == and > comparisons forming a total order; NaN-like unordered values are outside this version's contract.",
    "Average O(n log n) assumes a uniformly random permutation of distinct values, not a guarantee from choosing the middle position.",
    "Worst-case recursion can reach O(n) depth and hit Python's recursion limit before completing on large inputs."
  ],
  "tradeoffs": "The clear list-building version allocates substantially more than an in-place partition. Merge sort guarantees O(n log n) time with O(n) auxiliary space; a naive quicksort retains a quadratic worst case even with median-of-three.",
  "counters": [
    {
      "label": "partition/combine invocations",
      "definition": "executions of line 9, one per non-base invocation; this line calls quick_sort twice",
      "countLines": [
        9
      ]
    }
  ],
  "fixedDataNote": "This run sorts 6 elements with a middle-element pivot. The O(n log n) average / O(n²) worst bounds describe how depth depends on pivot balance for size n. Function/query analysis excludes demonstration input literal creation and printing."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: partition around a pivot, recurse."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define quick_sort(a)."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Base case: 0 or 1 element is already sorted."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Return it."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Choose the middle-position value; its rank need not be near the median."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Elements smaller than the pivot."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Elements equal to the pivot (handles duplicates cleanly)."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Elements larger than the pivot."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Recursively sort less and greater, then concatenate with the pivot(s) in the middle."
  },
  {
    "line": 10,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Sort [5,1,4,2,8,3] → [1, 2, 3, 4, 5, 8]."
  }
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
    "variable": "less",
    "model": "array"
  },
  {
    "variable": "equal",
    "model": "array"
  },
  {
    "variable": "greater",
    "model": "array"
  }
],

  prediction: [
    { atEventIndex: 0, prompt: "What makes quicksort O(n log n) on average but O(n^2) in the worst case?", answer: "Pivot balance: roughly-even partitions give ~log n depth (O(n log n)); consistently lopsided partitions give ~n depth (O(n²)).", explanation: "The recursion depth depends on how evenly the pivot splits the data. Balanced splits → log n levels; degenerate splits (one side nearly empty) → n levels, and the per-level O(n) work sums to O(n²)." },
  ],

  experiments: [
    "Sort an already-sorted list and reason about pivot choice and worst-case risk.",
    "Change the pivot to a[0] and discuss when that becomes the O(n²) worst case.",
    "Add a random pivot and explain why it makes the bad case unlikely.",
  ],

  exercises: [
    {
      id: "qk-choose-1",
      kind: "choose-approach",
      prompt: "You need a guaranteed worst-case O(n log n) sort for adversarial input, and stability matters. Quicksort or merge sort?",
      expected: "Merge sort — it guarantees O(n log n) worst case and is stable. Quicksort risks O(n²) on crafted input and its in-place form is not stable.",
      hints: ["Which has a bad worst case an adversary could trigger?", "Quicksort can be forced to O(n²).", "Merge sort guarantees O(n log n) and is stable."],
    },
    {
      id: "qk-predict-1",
      kind: "predict-state",
      prompt: "With a naive pivot = a[0], what input triggers quicksort's O(n²) worst case?",
      expected: "An already-sorted (or reverse-sorted) array: each pivot is the min (or max), so one partition is empty and the other has n-1 elements, giving depth ~n.",
      hints: ["When is one partition nearly empty every time?", "When the pivot is always the smallest/largest.", "Sorted input with pivot = a[0] does exactly that."],
    },
  ],

  review: "This three-list quicksort groups around a middle-position pivot and recursively sorts both unequal groups. Random distinct input averages O(n log n), all equal values take O(n), and crafted unbalanced splits can take O(n²) time and auxiliary space. A middle position or median-of-three offers no worst-case guarantee. Classic in-place implementations have different memory and stability behavior.",

  expectedOutput: "[1, 2, 3, 4, 5, 8]\n",

  references: [
  {
    "url": "https://opendatastructures.org/ods-python/11_1_Comparison_Based_Sorti.html",
    "title": "Open Data Structures: comparison-based sorting",
    "section": "11.1.2 quicksort; randomized pivot and three-way partition",
    "topic": "sorting/quick",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Randomized pivots yield expected logarithmic-depth sorting; equal groups avoid further recursion."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "The app chooses a deterministic middle-position pivot and allocates three lists. Its retained-list memory bound is derived from this code, not from the in-place source."
    ]
  },
  {
    "url": "https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheQuickSort.html",
    "title": "TheQuickSort",
    "section": "Algorithm, analysis and visual example",
    "topic": "sorting/quick",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Unbalanced partitions can produce a quadratic sum of subproblem sizes; median-of-three is a heuristic."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  },
  {
    "url": "https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c",
    "title": "CPython 3.14.2 list implementation",
    "section": "list slicing and allocation",
    "topic": "sorting/quick",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Lists own allocated arrays of element references."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "1932b5f5c14baedf",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
