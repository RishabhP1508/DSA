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
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in the sorted array"
    }
  ],
  "costModel": "Each iteration makes one midpoint computation and at most two value comparisons, with O(1) indexed access and scalar arithmetic; it excludes the checked midpoint and halves the candidates.",
  "time": {
    "bound": "O(log n)",
    "case": "worst",
    "explanation": "Each comparison discards half of the remaining candidates, so the range shrinks n → n/2 → n/4 → … → 1. The number of halvings needed to reach 1 is about log₂(n), and each does constant work. So the worst and average case are O(log n); the best case is O(1) if the middle element is the target on the first try.",
    "otherCases": [
      {
        "case": "best",
        "bound": "O(1)",
        "note": "The very first midpoint equals the target."
      }
    ]
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "The iterative version keeps just lo, hi, and mid — three variables regardless of n. (A recursive version would use O(log n) stack depth instead.)",
    "inputOutputNote": "The sorted array of n elements is the input, not auxiliary space."
  },
  "derivation": [
    {
      "lines": [
        5
      ],
      "description": "The loop runs about log2(n) times because each step halves the range.",
      "cost": "O(log n)",
      "dimension": "time"
    },
    {
      "lines": [
        6,
        7,
        9,
        11
      ],
      "description": "Each step: one midpoint, one comparison, one range update — all O(1).",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        3,
        4
      ],
      "description": "Three index variables, independent of n (iterative).",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "The array is SORTED (the correctness precondition).",
    "Index access and comparisons are O(1).",
    "This is the iterative form; recursion would add O(log n) stack space.",
    "The average-case label assumes a uniformly selected present target in distinct sorted values; duplicates may permit earlier hits. Empty input returns in O(1)."
  ],
  "tradeoffs": "Linear search is O(n) but needs no sorting; binary search is O(log n) but requires sorted data. If you sort just to binary-search once, the O(n log n) sort dominates — only worth it for many searches.",
  "counters": [
    {
      "label": "iterations",
      "definition": "executions of the loop body midpoint (line 6)",
      "countLines": [
        6
      ]
    }
  ],
  "fixedDataNote": "Searching 6 elements takes at most ~3 iterations (log2(6) ≈ 2.6). The O(log n) bound generalises the halving to n. Function/query analysis excludes demonstration input literal creation and printing."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: binary search needs a sorted array."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define binary_search(nums, target)."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "lo starts at the first index."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "hi starts at the last index."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Loop while the range is non-empty (lo <= hi covers one-element ranges)."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Compute the midpoint index."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Test whether the middle element equals the target; the return occurs on the following line only when this test is true."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Found it: return mid."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Else if the middle is too small (nums[mid] < target)..."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Move lo past the checked midpoint; if the target exists, its remaining candidates are to the right."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Otherwise the middle is too big."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Move hi before the checked midpoint; if the target exists, its remaining candidates are to the left."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "If the range empties with no match, return -1."
  },
  {
    "line": 14,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Search for 7 in the sorted array → index 3."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "Search for 4 (absent) → -1."
  }
],

  bindings: [
  {
    "variable": "nums",
    "model": "array",
    "overlays": [
      {
        "role": "boundary",
        "label": "lo",
        "source": "lo"
      },
      {
        "role": "pointer",
        "label": "mid",
        "source": "mid"
      },
      {
        "role": "boundary",
        "label": "hi",
        "source": "hi"
      }
    ],
    "range": {
      "label": "candidate indices",
      "startSource": "lo",
      "endSource": "hi",
      "endInclusive": true
    }
  }
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
    "id": "bs-fix-1",
    "kind": "fix-mistake",
    "prompt": "This binary search can loop forever on some inputs. Fix the range updates. nums is sorted ascending; return any matching index or -1 if absent.",
    "starterCode": "def bsearch(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            lo = mid\n        else:\n            hi = mid\n    return -1",
    "expected": "def bsearch(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1",
    "hints": [
      "Goal: search a sorted array for target and stop cleanly instead of looping forever.",
      "The bug is a range that fails to shrink when a bound is set to mid rather than past it.",
      "Key insight: mid was already checked, so the next range must exclude it to guarantee progress.",
      "Approach: move the surviving bound one step past mid on each branch.",
      "Pseudocode: while lo<=hi: mid=(lo+hi)//2; if hit return mid; if too small lo=mid+1 else hi=mid-1; return -1.",
      "Use `lo = mid + 1` and `hi = mid - 1` so the search interval always shrinks."
    ],
    "tests": "assert bsearch([1, 3, 5, 7, 9], 7) == 3, 'finds index of 7'\nassert bsearch([1, 3, 5, 7, 9], 1) == 0, 'finds first element'\nassert bsearch([1, 3, 5, 7, 9], 9) == 4, 'finds last element'\nassert bsearch([1, 3, 5, 7, 9], 4) == -1, 'absent value returns -1 (must terminate, not loop forever)'\nassert bsearch([], 1) == -1, 'empty array returns -1'\nprint('OK')"
  },
  {
    "id": "bs-choose-1",
    "kind": "choose-approach",
    "prompt": "You need to search a collection 100,000 times. It is currently unsorted. Compare (a) linear each time, (b) sort once then binary-search, (c) build a set. Give complexities. Assume hashable comparable values and ordinary hashes; distinguish expected hash costs from worst-case search costs.",
    "expected": "(a) O(n) per query = O(n·q). (b) O(n log n) sort + O(q log n) queries. (c) expected O(n) build + expected O(q) queries. For pure membership, the set (c) is usually best; binary search (b) also gives ordered queries like bounds.",
    "hints": [
      "Goal: pick the best structure for 100,000 membership searches over a currently unsorted collection.",
      "Linear search repeats an O(n) scan per query; the cost adds up to O(n·q).",
      "Key insight: preprocessing once — sorting or hashing — makes each later query cheap.",
      "Approach: weigh a set (expected O(1) membership) against sort-then-binary-search (ordered queries).",
      "Pseudocode: build set once → expected O(n + q); or sort once → O(n log n) + O(q log n) queries.",
      "For plain membership choose the set (expected O(n) build + expected O(1) per query); use sorted + binary search when you also need order-based queries like bounds."
    ],
    "recognition": {
      "scenario": "You will search a currently-unsorted collection 100,000 times for different values. Compare linear each time, sort-then-binary-search, or build a set. For pure membership, which is usually best? Assume hashable comparable values and ordinary hashing.",
      "approaches": [
        {
          "id": "build-set",
          "label": "Build a hash set once, then query",
          "requiredReasonIds": [
            "set-expected-o1"
          ]
        },
        {
          "id": "sort-then-bs",
          "label": "Sort once, then binary-search each query",
          "requiredReasonIds": [
            "sorted-ordered-queries"
          ]
        },
        {
          "id": "linear-each",
          "label": "Linear search each time",
          "requiredReasonIds": [],
          "rejectionFeedback": "Repeated scans have O(n*q) worst-case work; a set gives expected O(n+q) under the stated hashing model."
        }
      ],
      "reasons": [
        {
          "id": "set-expected-o1",
          "text": "For pure membership over many queries, an expected O(n) set build then expected-O(1) lookups gives O(n + q) — the best of the three."
        },
        {
          "id": "sorted-ordered-queries",
          "text": "Sorting once (O(n log n)) then binary-searching (O(q log n)) also answers ORDERED queries like floor/ceil and ranges that a set cannot."
        },
        {
          "id": "need-linear-scan",
          "text": "You must scan linearly because the values cannot be hashed.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "build-set"
      ],
      "alternatives": [
        {
          "approachId": "sort-then-bs",
          "conditions": "When you also need ORDERED queries such as floor/ceil or ranges, not just membership.",
          "tradeoff": "O(n log n) worst-case sorting plus O(q log n) queries, a higher general bound than expected hash membership, with support for ordered queries.",
          "requiredReasonIds": [
            "sorted-ordered-queries"
          ]
        }
      ],
      "modelExplanation": "For pure membership across many queries, build a set once (expected O(n)) then query in expected O(1) → O(n + q). Sort-then-binary-search also works and additionally supports ordered queries like bounds."
    }
  }
],

  review: `**Binary search** locates a target in a **sorted** array in **O(log n)** by halving the range each comparison (discard the half that cannot contain the target). Keep \`lo <= hi\` and move to \`mid ± 1\` to guarantee progress. It is far faster than linear search but requires sorted input, and its "halve the range" idea powers bounds, rotated-array, and answer searches.`,

  expectedOutput: "3\n-1\n",

  references: [
  {
    "url": "https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheBinarySearch.html",
    "title": "TheBinarySearch",
    "section": "Algorithm, analysis and visual example",
    "topic": "searching/binary",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Sorted order permits halving; slicing is not constant-time."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  },
  {
    "url": "https://cp-algorithms.com/num_methods/binary_search.html",
    "title": "binary reference",
    "section": "Search in sorted arrays; lower and upper bound",
    "topic": "searching/binary",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Monotone order supports logarithmic search."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "This app uses inclusive [lo, hi] and excludes mid with mid ± 1."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "1d031e5c33e0ad94",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
