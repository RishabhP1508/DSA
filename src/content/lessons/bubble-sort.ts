/**
 * Lesson: Bubble sort (Sorting). Verified on CPython 3.14.
 * Output: "[1, 2, 4, 5, 8]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Bubble sort: repeatedly swap adjacent out-of-order pairs.
def bubble_sort(a):
    a = a[:]                       # work on a copy
    n = len(a)
    for i in range(n):
        for j in range(n - 1 - i):     # last i are already in place
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a

print(bubble_sort([5, 1, 4, 2, 8]))`;

export const bubbleSort: LessonDefinition = {
  id: "bubble-sort",
  title: "Bubble Sort",
  area: "Sorting",
  prerequisites: ["loops", "complexity"],

  explanation: "**Bubble sort** is the simplest sorting algorithm to understand (though not to use in practice). It repeatedly walks the list comparing **adjacent** pairs and swapping any that are out of order. After each full pass, the largest remaining element has \"bubbled\" to its correct place at the end — so each pass can stop one element earlier.\n\nIt is a great teaching example precisely because its cost is easy to see: two nested loops, each roughly proportional to n, give **O(n²)** comparisons. For an already-sorted list it still does O(n²) comparisons in this basic form (an optimized version adds an early-exit flag to make the best case O(n)). It uses **O(1)** extra space and is **stable** (equal elements keep their order).\n\nIn real code you would call Python's built-in `sorted` (O(n log n)). Bubble sort earns its place as the clearest illustration of the nested-loop → quadratic relationship, which the complexity panel's comparison counter makes concrete.\n\nThe shown function returns a shallow copy. Its sorting phase needs O(1) auxiliary storage beyond that O(n) result; total new memory including the returned copy is O(n). The in-place exercise instead modifies its supplied list.",

  vocabulary: [
    { term: "Bubble sort", definition: "Repeatedly swapping adjacent out-of-order elements until sorted." },
    { term: "Pass", definition: "One sweep through the list; after pass i, the largest i elements are in place." },
    { term: "Adjacent swap", definition: "Exchanging two neighbouring elements." },
    { term: "Stable sort", definition: "Equal elements keep their original relative order." },
    { term: "In place", definition: "Sorts using O(1) extra space (here, ignoring the defensive copy)." },
  ],

  concepts: {
    purpose: "Teach the mechanics of sorting and the nested-loop → O(n²) relationship.",
    operations: "Compare adjacent pairs; swap if out of order; shrink the range each pass.",
    uses: "Educational; tiny inputs; not for production (use sorted / Timsort).",
    tradeoffs: "O(n²) time, O(1) space, stable — simple but slow; beaten by O(n log n) sorts.",
    commonMistakes: "Looping the inner range to n (not n-1-i) causing index errors; claiming O(n) without the early-exit optimization; forgetting stability.",
    edgeCases: "Empty/one-element list is already sorted. Already-sorted input still O(n²) in the basic form.",
  },

  complexity: [
  {
    "operation": "Bubble sort",
    "best": "O(n^2)",
    "average": "O(n^2)",
    "worst": "O(n^2)",
    "space": "O(1)",
    "note": "Basic form; early-exit variant is O(n) best case. O(1) auxiliary space excludes the copied list that becomes the returned result; including that result requires O(n) memory."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in the list"
    }
  ],
  "costModel": "Each adjacent comparison and swap is O(1). The nested loops determine the comparison count.",
  "time": {
    "bound": "O(n^2)",
    "case": "worst",
    "explanation": "The outer loop runs n times; the inner loop runs about n-1, n-2, … comparisons across passes. Summed, that is (n-1)+(n-2)+…+1 = n(n-1)/2 comparisons — O(n²). Because the loops are NESTED, the counts multiply into a quadratic. The basic form does this many comparisons even on sorted input.",
    "otherCases": [
      {
        "case": "best",
        "bound": "O(n^2)",
        "note": "The shown basic form checks every adjacent pair in each scheduled pass, even on sorted input. A separate early-exit variant can have O(n) best time."
      }
    ]
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "The sorting phase uses a constant number of scalar indices/values and edits its returned copy. Auxiliary O(1) excludes the required O(n) returned list; total function allocation is O(n).",
    "inputOutputNote": "The function allocates a returned O(n) shallow-copy list at line 3. Treating that required result as output, the remaining working state is O(1); total new storage including the result is O(n)."
  },
  "derivation": [
    {
      "lines": [
        5
      ],
      "description": "The outer loop runs n times.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        6,
        7,
        8
      ],
      "description": "The inner loop does up to n-1-i comparisons per pass; nested → about n²/2 total.",
      "cost": "O(n^2)",
      "dimension": "time"
    },
    {
      "lines": [
        4
      ],
      "description": "Only the copy grows with n; the sort itself uses O(1) working space.",
      "cost": "O(1)",
      "dimension": "space"
    },
    {
      "lines": [
        3
      ],
      "description": "The copy visits n element references; it is the returned result.",
      "cost": "O(n)",
      "dimension": "time"
    }
  ],
  "assumptions": [
    "Comparisons and swaps are O(1).",
    "This is the basic form without the early-exit optimization."
  ],
  "tradeoffs": "O(n log n) sorts (merge/quick/Timsort) are dramatically faster for large n; bubble sort is only competitive on tiny or nearly-sorted inputs (with early exit).",
  "counters": [
    {
      "label": "comparisons",
      "definition": "executions of the adjacent compare (line 7)",
      "countLines": [
        7
      ]
    },
    {
      "label": "swaps",
      "definition": "executions of the swap (line 8)",
      "countLines": [
        8
      ]
    }
  ],
  "fixedDataNote": "This run sorts 5 elements, doing 4+3+2+1 = 10 comparisons. The O(n²) bound generalises that triangular count to n. Function/query analysis excludes demonstration input literal creation and printing."
},

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: swap adjacent out-of-order pairs." },
    { line: 2, executable: true, explanation: "Define bubble_sort(a)." },
    { line: 3, executable: true, explanation: "Copy the input so the caller's list is not mutated." },
    { line: 4, executable: true, explanation: "n is the length." },
    { line: 5, executable: true, explanation: "Outer loop: one pass per element (n passes)." },
    { line: 6, executable: true, explanation: "Inner loop: compare up to n-1-i pairs (the last i are already sorted)." },
    { line: 7, executable: true, explanation: "If a pair is out of order..." },
    { line: 8, executable: true, explanation: "...swap them. Large values bubble toward the end." },
    { line: 9, executable: true, explanation: "Return the sorted copy." },
    { line: 10, executable: false, explanation: "Blank line." },
    { line: 11, executable: true, explanation: "Sort [5,1,4,2,8] → [1, 2, 4, 5, 8]." },
  ],

  bindings: [
    {
      variable: "a",
      model: "array",
      overlays: [{ role: "pointer", label: "j", source: "j" }],
    },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "How many comparisons does basic bubble sort do on 5 elements, and what is the general formula?", answer: "10 comparisons; in general n(n-1)/2 = O(n²).", explanation: "The passes do 4+3+2+1 = 10 comparisons for n=5. In general the sum is n(n-1)/2, which is quadratic." },
  ],

  experiments: [
    "Add an early-exit flag that breaks when a pass makes no swaps; test on a sorted list to see O(n) best case.",
    "Count comparisons for a reverse-sorted input (the worst case).",
    "Compare the comparison count to n(n-1)/2 for different sizes.",
  ],

  exercises: [
  {
    "id": "bub-fix-1",
    "kind": "fix-mistake",
    "prompt": "`bubble_sort(a)` should sort the list in place and return it, but the inner range reads past the end and raises an index error. Fix the inner range.",
    "starterCode": "def bubble_sort(a):\n    n = len(a)\n    for i in range(n):\n        for j in range(n):\n            if a[j] > a[j + 1]:\n                a[j], a[j + 1] = a[j + 1], a[j]\n    return a",
    "expected": "def bubble_sort(a):\n    n = len(a)\n    for i in range(n):\n        for j in range(n - 1 - i):\n            if a[j] > a[j + 1]:\n                a[j], a[j + 1] = a[j + 1], a[j]\n    return a",
    "hints": [
      "Goal: fix the inner loop range so bubble sort does not index out of bounds.",
      "The comparison reads a[j+1], which runs past the end when j reaches the last index.",
      "Key insight: after i passes, the last i elements are already in place and need no comparison.",
      "Approach: shrink the inner range each pass to stop before the sorted tail.",
      "Pseudocode: for i in range(n): for j in range(n - 1 - i): if a[j] > a[j+1]: swap.",
      "Use `range(n - 1 - i)` for the inner loop so a[j+1] stays in bounds."
    ],
    "tests": "assert bubble_sort([5, 1, 4, 2, 8]) == [1, 2, 4, 5, 8], 'sorts a mixed list'\nassert bubble_sort([]) == [], 'empty list'\nassert bubble_sort([1]) == [1], 'single element'\nassert bubble_sort([3, 2, 1]) == [1, 2, 3], 'reversed input'\nassert bubble_sort([2, 2, 1]) == [1, 2, 2], 'duplicates'\nprint('OK')"
  },
  {
    "id": "bub-choose-1",
    "kind": "choose-approach",
    "prompt": "For n = 1,000,000 elements, is bubble sort acceptable? What should you use and why?",
    "expected": "Use a worst-case O(n log n) sort such as Python sorted. Basic bubble makes n(n-1)/2 comparisons: 499,999,500,000 at n=1,000,000. n log2(n) is about 20,000,000 as a growth-scale comparison, not an exact count or measured run time.",
    "hints": [
      "Goal: decide whether bubble sort is acceptable for n = 1,000,000 elements, and if not, what to use.",
      "Basic bubble makes n(n-1)/2 comparisons, around 5×10^11 for a million elements.",
      "The operation-count growth gap is large; Big-O alone does not predict seconds or hours.",
      "Approach: use an O(n log n) comparison sort such as Python's built-in sorted (Timsort).",
      "A worst-case n log n comparison bound scales much better; n log2(n) ≈ 2×10^7 is a growth scale, not a promised exact count.",
      "Use a worst-case O(n log n) sort such as Python sorted. Basic bubble makes n(n-1)/2 comparisons: 499,999,500,000 at n=1,000,000. n log2(n) is about 20,000,000 as a growth-scale comparison, not an exact count or measured run time."
    ],
    "recognition": {
      "scenario": "You must sort n = 1,000,000 elements. You must decide whether bubble sort is acceptable, and if not, what to use.",
      "approaches": [
        {
          "id": "nlogn-sort",
          "label": "Use an O(n log n) sort (Python's sorted/Timsort)",
          "requiredReasonIds": [
            "quadratic-too-slow"
          ]
        },
        {
          "id": "bubble",
          "label": "Use bubble sort",
          "requiredReasonIds": [],
          "rejectionFeedback": "The shown basic bubble sort makes 499,999,500,000 adjacent comparisons at n=1,000,000. A worst-case O(n log n) comparison sort has a much smaller growth scale; this count does not predict elapsed seconds."
        }
      ],
      "reasons": [
        {
          "id": "quadratic-too-slow",
          "text": "Bubble makes about 5×10^11 comparisons; n log2(n) is about 2×10^7 as a theoretical scale for a logarithmic-depth sort, not a measured operation count."
        },
        {
          "id": "bubble-is-nlogn",
          "text": "Bubble sort runs in O(n log n), so it scales fine to a million elements.",
          "contradictory": true
        },
        {
          "id": "quadratic-fine",
          "text": "10^12 operations completes essentially instantly, so quadratic is acceptable.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "nlogn-sort"
      ],
      "modelExplanation": "Use a worst-case O(n log n) sort such as Python sorted. Basic bubble makes n(n-1)/2 comparisons: 499,999,500,000 at n=1,000,000. n log2(n) is about 20,000,000 as a growth-scale comparison, not an exact count or measured run time."
    }
  }
],

  review: "**Bubble sort** repeatedly swaps adjacent out-of-order pairs, bubbling the largest to the end each pass. Its **nested loops** make it **O(n²)** time (best O(n) only with an early-exit flag), **O(1)** space, and **stable**. It is a teaching tool for the nested-loop → quadratic relationship; use `sorted` (O(n log n)) in practice. The walkthrough also allocates its O(n) returned copy.",

  expectedOutput: "[1, 2, 4, 5, 8]\n",

  references: [
  {
    "url": "https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheBubbleSort.html",
    "title": "TheBubbleSort",
    "section": "Algorithm, analysis and visual example",
    "topic": "sorting/bubble-sort",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "The basic sort has a triangular comparison count; early exit is a separate variant."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  },
  {
    "url": "https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c",
    "title": "CPython 3.14.2 list implementation",
    "section": "list slicing; list_resize; binarysort",
    "topic": "sorting/bubble-sort",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "List copies allocate references; binary insertion sorting moves entries to make room."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "This app returns a defensive copy and uses ascending minimum-selection rather than descending maximum-selection."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "4cf9f584f08ce225",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
