/**
 * Lesson: Lower and upper bounds (Searching). Verified on CPython 3.14.
 * Output: "1\n4\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Boundary searches use a half-open candidate range [lo, hi).
import bisect

def lower_bound(nums, target):
    lo, hi = 0, len(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo

def upper_bound(nums, target):
    lo, hi = 0, len(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] <= target:
            lo = mid + 1
        else:
            hi = mid
    return lo

nums = [1, 2, 2, 2, 3, 5]
print(lower_bound(nums, 2))
print(upper_bound(nums, 2))`;

export const bounds: LessonDefinition = {
  id: "bounds",
  title: "Lower and Upper Bounds",
  area: "Searching",
  prerequisites: ["binary-search"],

  explanation: "Plain binary search answers \"is the target present, and where?\" But with **duplicates**, you often want a **boundary**: the first position where the target could go (**lower bound**) or just past the last occurrence (**upper bound**). These are binary searches that don't stop at the first match — they keep narrowing to find an edge.\n\nPython's `bisect` module gives them directly. On `[1,2,2,2,3,5]`: `bisect_left(nums, 2)` returns `1` — the index of the **first** element `>= 2`. `bisect_right(nums, 2)` returns `4` — the index just **after** the last `2`. The gap between them, `4 - 1 = 3`, is exactly the **count of 2's**. That is a powerful trick: two O(log n) bound queries give you the frequency of a value, or the size of any range, in a sorted array.\n\nBoth are **O(log n)** (they are binary searches) and operate on a sorted array. Lower/upper bounds are the building blocks for \"count in range\", \"first/last occurrence\", and inserting into a sorted list while keeping it sorted.\n\nThe code exposes both loops with a half-open range `[lo, hi)` and `hi = len(nums)`. The lower loop moves right only for `< target`; the upper loop moves right for `<= target`. `lo` is an insertion point, not proof of presence: check `i < len(nums) and nums[i] == target` before treating the lower bound as a match. `bisect.insort` first searches in O(log n), then inserts/shifts in O(n).",

  vocabulary: [
  {
    "term": "Lower bound",
    "definition": "First index with value >= target, or len(nums) if no value qualifies."
  },
  {
    "term": "Upper bound",
    "definition": "First index with value > target, or len(nums) if no value qualifies."
  },
  {
    "term": "Insertion point",
    "definition": "Where a value could be inserted to keep the array sorted."
  },
  {
    "term": "bisect module",
    "definition": "Python's standard binary-search helpers: bisect_left, bisect_right, insort."
  },
  {
    "term": "Range count",
    "definition": "upper_bound - lower_bound = how many equal the target."
  }
],

  concepts: {
  "purpose": "Find boundaries (first/last occurrence, insertion point) in a sorted array with duplicates.",
  "operations": "bisect_left for the first >= target; bisect_right for the first > target; their difference is the count.",
  "uses": "Counting occurrences, first/last occurrence, range counts, keeping a list sorted with insort.",
  "tradeoffs": "O(log n) queries, but require sorted data; you must pick left vs right correctly for the boundary you want. insort is O(n) because inserting into a list may shift the tail; it is not an O(log n) update.",
  "commonMistakes": "Confusing bisect_left vs bisect_right; expecting an 'index of target' when the value is absent (you get the insertion point); forgetting the array must be sorted.",
  "edgeCases": "Target absent: both bounds equal the insertion point (count 0). Target smaller/larger than all elements returns 0 or len(nums)."
},

  complexity: [
  {
    "operation": "bisect_left / bisect_right",
    "best": "O(log n)",
    "average": "O(log n)",
    "worst": "O(log n)",
    "space": "O(1)",
    "note": "Binary search for a boundary."
  },
  {
    "operation": "Count occurrences",
    "best": "O(log n)",
    "average": "O(log n)",
    "worst": "O(log n)",
    "note": "upper - lower, two bound queries."
  },
  {
    "operation": "bisect.insort",
    "worst": "O(n)",
    "note": "The maintained list grows by one value; a capacity resize can allocate/copy O(n) references. Search is O(log n); shifting/insertion takes O(n) worst-case time."
  }
],

  complexityExplanation: {
  "scope": "operation",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in the sorted array"
    }
  ],
  "costModel": "Each bisect call is a binary search: O(log n) comparisons, each O(1).",
  "time": {
    "bound": "O(log n)",
    "case": "worst",
    "explanation": "bisect_left and bisect_right are binary searches that halve the range each step, so each is O(log n). Counting occurrences calls both, which is 2·O(log n) = O(log n). The number of duplicates does not change the cost — that is the advantage over scanning them one by one."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "bisect works on the existing array with a few index variables; nothing grows with n.",
    "inputOutputNote": "The sorted array of n elements is the input, not auxiliary space."
  },
  "derivation": [
    {
      "lines": [
        6,
        7,
        8,
        9,
        11
      ],
      "description": "Lower-bound iterations halve the candidate index range.",
      "cost": "O(log n)",
      "dimension": "time"
    },
    {
      "lines": [
        16,
        17,
        18,
        19,
        21
      ],
      "description": "Upper-bound iterations halve the range; equality moves right.",
      "cost": "O(log n)",
      "dimension": "time"
    },
    {
      "lines": [
        5,
        15
      ],
      "description": "Each query uses only scalar indices.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "The array is SORTED.",
    "Comparisons are O(1)."
  ],
  "tradeoffs": "Scanning to count duplicates is O(n); two bound queries do it in O(log n). The bisect module is also a correct, tested alternative to hand-written boundary binary search.",
  "fixedDataNote": "This run returns lower=1 and upper=4 for value 2, so there are 4-1=3 twos. The O(log n) bounds generalise to n. Function/query analysis excludes demonstration input literal creation and printing.",
  "counters": [
    {
      "label": "boundary midpoint tests",
      "definition": "executions of a lower or upper midpoint comparison",
      "countLines": [
        8,
        18
      ]
    }
  ]
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: hi is an exclusive boundary; len(nums) is a valid insertion point."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Import bisect for the library equivalent and experiments."
  },
  {
    "line": 3,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Define the first index whose value is at least target, or len(nums) if none."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Start with every index a candidate and hi one past the list."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Continue while the half-open candidate range is nonempty."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Choose a midpoint strictly below hi."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Test whether the midpoint value is below target."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Exclude that midpoint and everything before it."
  },
  {
    "line": 10,
    "executable": false,
    "explanation": "Otherwise this value is at least target."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Keep mid as a possible first qualifying index."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Return the boundary, including len(nums) when all values are smaller."
  },
  {
    "line": 13,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Define the first index whose value is greater than target, or len(nums)."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Initialize the exclusive bounds."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "Continue while candidate indices remain."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Choose the midpoint."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "Test whether this value is at most target; equal values belong before the upper bound."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "Move past the midpoint when it is at most target."
  },
  {
    "line": 20,
    "executable": false,
    "explanation": "Otherwise this value is greater than target."
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "Keep mid as a possible first greater index."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "Return the upper insertion boundary."
  },
  {
    "line": 23,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 24,
    "executable": true,
    "explanation": "Create the example sorted list with three twos."
  },
  {
    "line": 25,
    "executable": true,
    "explanation": "Print the lower bound of 2: index 1."
  },
  {
    "line": 26,
    "executable": true,
    "explanation": "Print the upper bound of 2: index 4."
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
        "label": "hi (exclusive)",
        "source": "hi"
      }
    ],
    "range": {
      "label": "candidate indices",
      "startSource": "lo",
      "endSource": "hi",
      "endInclusive": false
    }
  }
],

  prediction: [
    { atEventIndex: 0, prompt: "On [1,2,2,2,3,5], what does bisect_right(nums, 2) - bisect_left(nums, 2) compute?", answer: "3 — the number of 2's in the array.", explanation: "Upper bound (4) minus lower bound (1) is exactly the count of elements equal to the target: 4 - 1 = 3 twos." },
  ],

  experiments: [
  "Query bounds for a value not present (e.g. 4) and see both equal the insertion point (count 0).",
  "Query bounds for 1 (at the start) and 5 (at the end).",
  "Use bisect.insort to insert a value and keep the list sorted; distinguish its O(n) shifting cost from the O(log n) insertion-point search."
],

  exercises: [
  {
    "id": "bnd-complete-1",
    "kind": "complete-code",
    "prompt": "Complete a function that counts occurrences of target in a sorted array using bisect.",
    "starterCode": "import bisect\ndef count(nums, target):\n    # TODO: return the number of elements equal to target\n    pass",
    "expected": "import bisect\ndef count(nums, target):\n    return bisect.bisect_right(nums, target) - bisect.bisect_left(nums, target)",
    "hints": [
      "Goal: count occurrences of target in a sorted array using bisect.",
      "Scanning for all matches is O(n); the sorted order lets you find the block ends in O(log n).",
      "Key insight: the count equals the gap between the first index and just-after-last index of target.",
      "Approach: use bisect_left and bisect_right to locate those boundaries.",
      "Pseudocode: return bisect_right(nums, target) minus bisect_left(nums, target).",
      "Write `return bisect.bisect_right(nums, target) - bisect.bisect_left(nums, target)`."
    ],
    "tests": "assert count([1, 2, 2, 2, 3], 2) == 3, 'three 2s'\nassert count([1, 2, 2, 2, 3], 5) == 0, 'absent target has 0 occurrences'\nassert count([], 1) == 0, 'empty array'\nassert count([2, 2, 2], 2) == 3, 'all equal'\nassert count([1, 2, 3], 3) == 1, 'single occurrence at the end'\nprint('OK')"
  },
  {
    "id": "bnd-choose-1",
    "kind": "choose-approach",
    "prompt": "You need the index of the FIRST occurrence of a value in a sorted array with duplicates. bisect_left or bisect_right? The target might be absent: explain how to check presence after locating the boundary.",
    "expected": "Use bisect_left to get i, then check i < len(nums) and nums[i] == target. If that fails, the target is absent; otherwise i is its first occurrence. bisect_right points past the equal run.",
    "hints": [
      "Goal: find the index of the FIRST occurrence of a value in a sorted array with duplicates — bisect_left or bisect_right.",
      "The error is bisect_right, which lands past the last duplicate rather than at the first.",
      "Key property: the first occurrence is the leftmost position where the target could sit among equal values.",
      "Approach: use bisect_left to get that leftmost boundary.",
      "bisect_left finds the first index with value >= target, or len(nums). Check i < len(nums) and nums[i] == target before reporting an occurrence.",
      "Use bisect_left to get i, then check i < len(nums) and nums[i] == target. If that fails, the target is absent; otherwise i is its first occurrence. bisect_right points past the equal run."
    ],
    "recognition": {
      "scenario": "You need the index of the FIRST occurrence of a value in a sorted array with duplicates. bisect_left or bisect_right? The target might be absent: explain how to check presence after locating the boundary.",
      "approaches": [
        {
          "id": "bisect-left",
          "label": "Use bisect_left",
          "requiredReasonIds": [
            "leftmost-insertion"
          ]
        },
        {
          "id": "bisect-right",
          "label": "Use bisect_right",
          "requiredReasonIds": [],
          "rejectionFeedback": "bisect_right returns the index just past the LAST occurrence, so it points to the wrong end of a run of duplicates."
        }
      ],
      "reasons": [
        {
          "id": "leftmost-insertion",
          "text": "bisect_left gives the leftmost insertion point; checking i < len(nums) and nums[i] == target verifies it is an actual first occurrence."
        },
        {
          "id": "right-gives-first",
          "text": "bisect_right returns the index of the first occurrence of the target.",
          "contradictory": true
        },
        {
          "id": "duplicates-break-bisect",
          "text": "Neither bisect function works when the array contains duplicates.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "bisect-left"
      ],
      "modelExplanation": "Use bisect_left to get i, then check i < len(nums) and nums[i] == target. If that fails, the target is absent; otherwise i is its first occurrence. bisect_right points past the equal run."
    }
  }
],

  review: "Lower bound finds the first value >= target; upper bound finds the first value > target. Both return len(nums) if no value qualifies and use O(log n) time/O(1) auxiliary space on a supplied sorted list. Their difference counts duplicates. A lower-bound index needs a bounds-and-equality check before reporting a match. insort maintains sorted order with an O(n) insertion.",

  expectedOutput: "1\n4\n",

  references: [
  {
    "url": "https://docs.python.org/3.14/library/bisect.html",
    "title": "bisect reference",
    "section": "bisect_left, bisect_right; performance notes; Searching Sorted Lists",
    "topic": "searching/bounds",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Left/right insertion points differ on equality; membership requires an equality check; insort is O(n)."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "The hand-written loops use half-open [lo,hi), matching the library insertion-point result."
    ]
  },
  {
    "url": "https://cp-algorithms.com/num_methods/binary_search.html",
    "title": "binary reference",
    "section": "Lower bound and upper bound; implementation",
    "topic": "searching/bounds",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "The two bounds delimit the equal-value range."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "d20d99c2f1843e9d",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
