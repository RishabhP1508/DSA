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

  whyItHelps: "Even when the array is rotated or shaped, at each midpoint **one side is still sorted** (or the shape tells you which way to go). Compare the target against that sorted side's endpoints to decide whether it lies there; if so, keep that half, otherwise discard it. Each step still halves the search space, preserving **O(log n)** time and **O(1)** space. The 'modification' is just a smarter rule for choosing which half to keep, adapted to the input's structure. The rotated-array branch rule shown requires distinct values; bounds on a fully sorted list can still handle duplicates.",

  conditions: [
  "There must be enough structure to decide, in O(1), which half can contain the answer (a sorted side, a monotone trend, a boundary predicate).",
  "Handle equal elements carefully (duplicates in a rotated array can force an O(n) worst case).",
  "For boundary searches (first/last), don't stop at the first match — keep shrinking toward the edge.",
  "This walkthrough requires DISTINCT values in a rotation of an ascending sorted list. Duplicates can make this exact implementation return an incorrect answer: searching 0 in [1,0,1,1,1] returns -1. A duplicate-aware variant must shrink ambiguous equal endpoints (after checking mid); its worst case can be O(n)."
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
    "For this distinct-values rotated search: O(log n) time and O(1) auxiliary space. Duplicates can make this exact code wrong; a separately adapted duplicate-aware search may take O(n).",

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in nums"
    }
  ],
  "costModel": "Each iteration identifies which half is sorted and discards half the remaining range, so the search space halves every step.",
  "time": {
    "bound": "O(log n)",
    "case": "worst",
    "explanation": "The loop (lines 4-17) halves [lo, hi] each iteration by deciding which side is sorted (line 8) and whether the target lies in it. So O(log n) comparisons for DISTINCT values."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Only lo, hi, mid indices are kept; nothing grows with n.",
    "inputOutputNote": "nums (n) is the input; the answer is a single index or -1."
  },
  "derivation": [
    {
      "lines": [
        4,
        5
      ],
      "description": "Each iteration computes a midpoint and halves the range.",
      "cost": "O(log n) iterations",
      "dimension": "time"
    },
    {
      "lines": [
        8,
        9,
        14
      ],
      "description": "O(1) work per iteration to pick the sorted half and decide.",
      "cost": "O(1) per step",
      "dimension": "time"
    },
    {
      "lines": [
        3
      ],
      "description": "A constant number of index variables.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "The array is a rotation of a sorted array with DISTINCT values (for the O(log n) bound).",
    "Indexing and comparison are O(1).",
    "An empty list returns -1 in O(1); the logarithmic bound is for n >= 2. Duplicates violate this implementation's correctness precondition."
  ],
  "tradeoffs": "A linear scan is O(n) but always works (even with duplicates); the modified binary search is O(log n) for distinct values by exploiting the always-one-side-sorted property.",
  "counters": [
    {
      "label": "halving steps",
      "definition": "executions of the midpoint line, excluding the final failed loop test",
      "countLines": [
        5
      ]
    }
  ],
  "fixedDataNote": "Searching 0 in [4,5,6,7,0,1,2] finds index 4 in ~log2(7) steps. The O(log n) bound generalises for distinct values. Function/query analysis excludes demonstration input literal creation and printing."
},

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: search a rotated sorted array."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define search_rotated(nums, target)."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Standard binary-search bounds."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Loop while the range is non-empty."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Midpoint."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Test whether the midpoint equals the target; the next line returns on a match."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Return its index."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "If the left half [lo..mid] is sorted..."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "...and the target lies within it..."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "...search the left half."
  },
  {
    "line": 11,
    "executable": false,
    "explanation": "Otherwise..."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "...search the right half."
  },
  {
    "line": 13,
    "executable": false,
    "explanation": "Else the right half [mid..hi] is sorted."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "If the target lies within the sorted right half..."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "...search the right half."
  },
  {
    "line": 16,
    "executable": false,
    "explanation": "Otherwise..."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "...search the left half."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "Not found."
  },
  {
    "line": 19,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "0 sits at index 4 in the rotated array."
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
        "role": "boundary",
        "label": "hi",
        "source": "hi"
      },
      {
        "role": "pointer",
        "label": "mid",
        "source": "mid"
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

  linkedLessons: ["binary-search", "rotated-array-search", "bounds"],

  exercises: [
  {
    "id": "pat-mbs-recognize-1",
    "kind": "choose-approach",
    "prompt": "A sorted array of DISTINCT values was rotated at an unknown pivot; find a target index in O(log n). Choose an approach.",
    "expected": "Modified binary search: at each midpoint one half is still sorted; test whether the target lies in that sorted half and keep it, else keep the other. O(log n), O(1) space.",
    "correctPatternId": "modified-binary-search",
    "hints": [
      "Find the target in a rotated array of distinct values using O(log n) time.",
      "A linear scan is O(n); the array's structure still allows halving despite the rotation.",
      "Key insight: at any midpoint one half is still fully sorted, so you can test which half could hold the target.",
      "Approach: use a modified binary search that identifies the sorted half each step.",
      "Pseudocode: while lo<=hi: mid; if the target lies within the sorted half keep it, else search the other half.",
      "Use modified binary search: at each mid, keep the sorted half if the target lies in it, else the other — O(log n), O(1) space."
    ],
    "recognition": {
      "scenario": "A sorted array of DISTINCT values was rotated at an unknown pivot; find a target index in O(log n). Choose an approach.",
      "approaches": [
        {
          "id": "mod-bs",
          "label": "Modified binary search",
          "requiredReasonIds": [
            "one-half-sorted"
          ]
        },
        {
          "id": "linear",
          "label": "Linear scan",
          "requiredReasonIds": [],
          "rejectionFeedback": "A scan is O(n); the array is still 'sorted in halves', which a modified binary search exploits for O(log n)."
        },
        {
          "id": "bs-answer",
          "label": "Binary search on the answer",
          "requiredReasonIds": [],
          "rejectionFeedback": "There is no candidate-answer range with a feasibility test; you are searching within a transformed sorted array."
        }
      ],
      "reasons": [
        {
          "id": "one-half-sorted",
          "text": "At each midpoint one half is still sorted; test whether the target lies within that sorted half and keep it, else keep the other — O(log n), O(1) space."
        },
        {
          "id": "fully-sorted",
          "text": "The array is fully sorted, so plain binary search applies directly.",
          "contradictory": true
        },
        {
          "id": "candidate-range",
          "text": "You search an abstract range of candidate answers with a feasibility test.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "mod-bs"
      ],
      "modelExplanation": "Modified binary search: at each midpoint one half is sorted; decide whether the target lies there to discard the other half — O(log n)."
    }
  },
  {
    "id": "pat-mbs-choose-1",
    "kind": "choose-approach",
    "prompt": "'Find the minimum ship capacity so all packages ship within D days.' Is that modified binary search on a rotated array? Assume positive integer package weights, preserved order and D >= 1.",
    "expected": "No — that's binary search on the ANSWER: search the range of candidate capacities using a feasibility test. Modified binary search here refers to searching within a transformed sorted ARRAY, not a candidate-answer range.",
    "correctPatternId": "binary-search-on-answer",
    "hints": [
      "Goal: find the minimum ship capacity so all packages ship within D days. The package weights are positive and D >= 1.",
      "This isn't searching a rotated array; you're searching a range of candidate capacities.",
      "Key insight: feasibility ('does this capacity finish within D days?') is monotone in the capacity value.",
      "Approach: use binary search on the answer with a feasibility test, not a positional array search.",
      "Pseudocode: lo=max weight, hi=sum; while lo<hi: mid; if feasible(mid) hi=mid else lo=mid+1; return lo.",
      "No — that's binary search on the ANSWER (search candidate capacities via feasibility); modified binary search targets a transformed sorted array."
    ],
    "recognition": {
      "scenario": "'Find the minimum ship capacity so all packages ship within D days.' Is that modified binary search on a rotated array? Assume positive integer package weights, preserved order and D >= 1.",
      "approaches": [
        {
          "id": "bs-answer",
          "label": "Binary search on the answer",
          "requiredReasonIds": [
            "candidate-capacity"
          ]
        },
        {
          "id": "mod-bs",
          "label": "Modified binary search on a transformed array",
          "requiredReasonIds": [],
          "rejectionFeedback": "There is no rotated/transformed array to search; you search a range of candidate capacities via a feasibility test."
        }
      ],
      "reasons": [
        {
          "id": "candidate-capacity",
          "text": "Binary-search the candidate capacity: feasibility ('can we ship within D days at this capacity?') is monotone, so search the answer range."
        },
        {
          "id": "rotated-array",
          "text": "You are searching within a rotated sorted array by index.",
          "contradictory": true
        },
        {
          "id": "no-monotone",
          "text": "Feasibility is not monotone in capacity, so binary search cannot apply.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "bs-answer"
      ],
      "modelExplanation": "No — this is binary search on the ANSWER: search candidate capacities using a monotone feasibility test. Modified binary search refers to searching a transformed sorted array."
    }
  },
  {
    "id": "pat-mbs-fix-1",
    "kind": "fix-mistake",
    "prompt": "`first_occurrence(nums, target)` returns the index of the FIRST occurrence of target in a sorted array, or -1. This returns any match. Fix it to keep searching left.",
    "starterCode": "def first_occurrence(nums, target):\n    lo, hi = 0, len(nums) - 1\n    res = -1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return res",
    "expected": "def first_occurrence(nums, target):\n    lo, hi = 0, len(nums) - 1\n    res = -1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            res = mid\n            hi = mid - 1\n        elif nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return res",
    "hints": [
      "Goal: first_occurrence(nums, target) = index of the FIRST target in a sorted array, or -1.",
      "Returning on the first match can land on a later duplicate, not the earliest.",
      "Key property: after a match, earlier equal values can only be to the LEFT.",
      "Approach: record the match, then keep searching the left half.",
      "Pseudocode: if nums[mid]==target: res=mid; hi=mid-1 (don't return yet).",
      "Fix: on a match set res = mid and hi = mid - 1; return res at the end."
    ],
    "tests": "assert first_occurrence([1,2,2,2,3], 2) == 1, 'FIRST 2, not any'\nassert first_occurrence([1,2,3], 3) == 2\nassert first_occurrence([2,2,2], 2) == 0\nassert first_occurrence([1,2,3], 5) == -1\nassert first_occurrence([], 1) == -1\nprint('OK')"
  }
],

  references: [
  {
    "url": "https://leetcode.com/problems/search-in-rotated-sorted-array/description/",
    "title": "rotated reference",
    "section": "Problem statement and distinct-value constraints",
    "topic": "searching/rotated",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "The original rotated-array logarithmic search problem guarantees unique values."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "The app also supports the empty input as -1."
    ]
  },
  {
    "url": "https://cp-algorithms.com/num_methods/binary_search.html",
    "title": "binary reference",
    "section": "Search in sorted arrays; implementation",
    "topic": "searching/rotated",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Each range update needs a valid invariant and progress."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "22b5905b5840403c",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
