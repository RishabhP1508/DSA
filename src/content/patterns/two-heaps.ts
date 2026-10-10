/**
 * Pattern: Two heaps.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "[5.0, 10.0, 5.0, 4.0]\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `import heapq

# Two heaps: keep the smaller half in a max-heap and the larger half in a
# min-heap, balanced, so the median is always at the heaps' tops.
class MedianFinder:
    def __init__(self):
        self.small = []   # max-heap (store negatives)
        self.large = []   # min-heap
    def add(self, num):
        heapq.heappush(self.small, -num)                  # tentatively add to lower half
        heapq.heappush(self.large, -heapq.heappop(self.small))  # move its max to the upper half
        if len(self.large) > len(self.small):             # rebalance so small >= large
            heapq.heappush(self.small, -heapq.heappop(self.large))
    def median(self):
        if len(self.small) > len(self.large):
            return float(-self.small[0])                  # odd count -> lower half's top
        return (-self.small[0] + self.large[0]) / 2       # even -> average of the two tops

mf = MedianFinder()
out = []
for x in [5, 15, 1, 3]:
    mf.add(x)
    out.append(mf.median())
print(out)`;

export const twoHeapsPattern: PatternDefinition = {
  id: "two-heaps",
  title: "Two Heaps",
  category: "Heaps & priority",
  summary:
    "Split data into a lower half (max-heap) and an upper half (min-heap), kept balanced, so the median or split point is always at the tops.",

  clues: [
  "You need the MEDIAN of a stream, or repeatedly the boundary between the smaller and larger halves.",
  "Data arrives incrementally and re-sorting each time would be too slow.",
  "Phrases like 'median from a data stream', 'sliding window median', 'balance two halves', 'IPO/maximize capital (a distinct eligibility-heap adaptation, without balancing halves)'."
],

  naiveApproach: "Insert into a sorted Python list: O(n) shifting per insertion and O(n²) total. Re-sorting a fresh unsorted prefix has a general O(n log n) bound per query (O(n² log n) overall); Python adaptive sorting can exploit prior runs. Two heaps preserve enough order for the median without rescanning every prefix.",

  whyItHelps: "Maintain a max-heap for the lower half and a min-heap for the upper half. Every lower value is <= every upper value; small has equal size or one extra. For an odd total, read the lower maximum; for an even total, average the two roots. This is O(1) under bounded numeric costs. Each insertion uses at most five heap calls to route and rebalance values, giving O(log(n+1)) amortized insertion and O(n log(n+1)) total for n values. A sorted Python list instead shifts O(n) elements per insertion in the worst case.",

  conditions: [
  "Every lower-half value <= every upper-half value. small and large have equal sizes, or small has one extra (the odd median rule used here).",
  "The unqualified heapq functions are min-oriented. This version stores negative lower-half values for portability; native *_max functions are also available in Python 3.14.",
  "Preserve the ordering invariant: every value in the lower heap ≤ every value in the upper heap (the cross-move enforces it).",
  "Nonempty median query; finite ordered numeric values with no NaN. The root sum and float conversion must not overflow; this example does not prevent floating-point overflow."
],

  alternatives: [
  "Single heap / top-K — when you only need the k largest or the k-th element, not a split into balanced halves.",
  "Balanced BST / order-statistics tree — supports medians plus arbitrary rank queries and deletions (useful for sliding-window median).",
  "Sorted container (e.g. bisect into a list) — fine for small inputs; O(n) inserts don't scale."
],

  counterexamples: [
  "'k largest elements' needs only one size-k heap (top-K pattern), not two balanced heaps.",
  "Sliding-window median also needs efficient REMOVAL of the outgoing element — a plain two-heap needs lazy deletion or a different structure.",
  "Forgetting to negate for the max-heap makes the lower half behave as a min-heap and breaks the median."
],

  walkthroughCode,
  walkthroughExpectedOutput: "[5.0, 10.0, 5.0, 4.0]\n",
  complexityNote:
    "O(log(n+1)) amortized per insertion, O(1) median query, O(n) stored values. List resizing can make one update linear; complete insertion sequences retain the stated total bound.",

  complexityExplanation: {
  "scope": "operation",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements inserted so far"
    }
  ],
  "costModel": "Two balanced heaps (a max-heap for the lower half, a min-heap for the upper half). Each add does a constant number of heap pushes/pops; each median reads the roots. Comparisons and bounded-size numeric operations cost O(1). Heap sifting costs O(log(size+1)); Python list resizing is amortized across operations, so an individual resizing operation can cost O(size).",
  "time": {
    "bound": "O(log(n+1))",
    "case": "amortized",
    "explanation": "An add performs at most five heap calls: one push, a pop/push crossing the boundary, and optionally another pop/push for size balance. Each sift is logarithmic and storage resizing is amortized. A median query reads at most two roots in O(1), under bounded numeric costs. Inserting n values takes O(n log(n+1)) total."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The two heaps together store all n elements.",
    "inputOutputNote": "The n inserted values are held across the heaps; each median query returns one number. The bound covers the named algorithm; demonstration construction and collected print output are separate allocations."
  },
  "derivation": [
    {
      "lines": [
        10,
        11
      ],
      "description": "Push into small then move its max to large — O(log n).",
      "cost": "O(log n)",
      "dimension": "time"
    },
    {
      "lines": [
        12,
        13
      ],
      "description": "Rebalance if large grew bigger — one more O(log n) move.",
      "cost": "O(log n)",
      "dimension": "time"
    },
    {
      "lines": [
        16,
        17
      ],
      "description": "Read the median from the roots.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        7,
        8
      ],
      "description": "Two heaps hold all n elements.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "heapq's default functions are a min-heap, so the lower half stores NEGATED values to act as a max-heap (portable; Python 3.14 also has native *_max functions).",
    "Heap push/pop are O(log(size)).",
    "Comparisons and bounded-size numeric operations cost O(1). Heap sifting costs O(log(size+1)); Python list resizing is amortized across operations, so an individual resizing operation can cost O(size).",
    "All values are finite and mutually ordered; no NaN. Numeric values, the even-case root sum, and the returned average must remain finite and representable during float conversion. This example does not prevent floating-point overflow.",
    "median requires at least one value; an empty query raises IndexError in this implementation.",
    "Every lower-half value <= every upper-half value; small has the same size as large or one extra."
  ],
  "tradeoffs": "Re-sorting per query is O(n log n) per median; a balanced BST also gives O(log n) inserts. Two heaps give O(log n) add and O(1) median with simple code.",
  "counters": [
    {
      "label": "adds",
      "definition": "executions of the small push (line 10)",
      "countLines": [
        10
      ]
    }
  ],
  "fixedDataNote": "Adding [5,15,1,3] yields running medians [5.0,10.0,5.0,4.0]. The O(log n)-per-add bound generalises."
},

  codeExplanations: [
  {
    "line": 1,
    "executable": true,
    "explanation": "Import heapq (a min-heap)."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 3,
    "executable": false,
    "explanation": "Comment: lower half in a max-heap, upper half in a min-heap."
  },
  {
    "line": 4,
    "executable": false,
    "explanation": "Comment continued."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Define the MedianFinder class."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Constructor."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "small = lower half as a max-heap (negated values)."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "large = upper half as a min-heap."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "add(num): insert while keeping the invariant."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Push into the lower half (negated for max-heap behavior)."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Move the lower half's max into the upper half to keep them ordered."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "If the upper half grew larger, rebalance..."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "...by moving its min back to the lower half."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "median(): read the middle in O(1)."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Odd total: the lower half has the extra element."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "Return its top (un-negated)."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Even total: average the two heap tops."
  },
  {
    "line": 18,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "Create the finder."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Collect running medians."
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "Feed the stream one value at a time."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "Add each value."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "Record the current median."
  },
  {
    "line": 24,
    "executable": true,
    "explanation": "After 5,15,1,3 the running medians are [5.0, 10.0, 5.0, 4.0]."
  }
],

  bindings: [
  {
    "variable": "mf",
    "path": "small",
    "model": "heap"
  },
  {
    "variable": "mf",
    "path": "large",
    "model": "heap"
  },
  {
    "variable": "out",
    "model": "array"
  }
],

  linkedLessons: ["two-heap-pattern", "running-median", "min-max-heaps"],

  exercises: [
  {
    "id": "pat-th-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'Numbers arrive one at a time; after each, report the median of all numbers so far.' Which pattern?",
    "expected": "Two heaps: a max-heap for the lower half and a min-heap for the upper half, kept balanced. The median is the top of the larger heap or the average of the two tops. O(log n) per add, O(1) per query.",
    "correctPatternId": "two-heaps",
    "hints": [
      "Goal: report the running median after each number arrives in a stream.",
      "Re-sorting after every insertion is O(n log n) each time; the median can be maintained far more cheaply.",
      "Key insight: if you keep the lower half and upper half separately and balanced, the median sits at their tops.",
      "Approach: use two heaps — a max-heap for the lower half and a min-heap for the upper half.",
      "Pseudocode: push into the correct half; rebalance so sizes differ by at most one; median is a top or the average of tops.",
      "Use two heaps kept balanced: the median is the top of the larger heap or the average of the two tops — O(log n) per add."
    ],
    "recognition": {
      "scenario": "Numbers arrive one at a time; after each arrival you must report the median of all numbers so far.",
      "approaches": [
        {
          "id": "two-heaps",
          "label": "Two heaps (max-heap low half, min-heap high half)",
          "requiredReasonIds": [
            "balance-halves"
          ]
        },
        {
          "id": "resort",
          "label": "Re-sort after every insertion",
          "requiredReasonIds": [],
          "rejectionFeedback": "Re-sorting is O(n log n) per query → O(n^2 log n) overall; two heaps give O(log n) per insert."
        },
        {
          "id": "single-heap",
          "label": "Single size-k heap",
          "requiredReasonIds": [],
          "rejectionFeedback": "A single heap tracks one extreme, not the boundary between the lower and upper halves that the median needs."
        }
      ],
      "reasons": [
        {
          "id": "balance-halves",
          "text": "A max-heap for the lower half and a min-heap for the upper half, kept balanced, expose the median at the heap tops — O(log n) per add, O(1) per query."
        },
        {
          "id": "one-extreme",
          "text": "We only ever need one extreme value, so a single heap suffices.",
          "contradictory": true
        },
        {
          "id": "must-fully-sort",
          "text": "The full data must be sorted after each insertion to read the median.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "two-heaps"
      ],
      "modelExplanation": "Two heaps: balance a low-half max-heap against a high-half min-heap so the median is read from the top(s) in O(1), with O(log n) inserts."
    }
  },
  {
    "id": "pat-th-choose-1",
    "kind": "choose-approach",
    "prompt": "You only need the 10 largest numbers seen so far (not the median). Two heaps or top-K?",
    "expected": "Top-K with a single size-10 min-heap — no need to split into balanced halves. Two heaps is for medians / half-boundary problems.",
    "correctPatternId": "top-k-heap",
    "hints": [
      "Goal: keep only the 10 largest numbers seen so far, not the median.",
      "Two balanced heaps maintain a middle boundary you don't need for an extreme set.",
      "Key insight: an extreme-set query needs only one boundary, not a split into balanced halves.",
      "Approach: use a single Top-K min-heap of size 10.",
      "Pseudocode: push each number; if the heap exceeds 10 pop the smallest; the heap holds the 10 largest.",
      "Use Top-K with one size-10 min-heap; two balanced heaps are for medians and would be overkill here."
    ],
    "recognition": {
      "scenario": "You only need the 10 largest numbers seen so far (not the median).",
      "approaches": [
        {
          "id": "single-heap",
          "label": "Top-K with a single size-10 min-heap",
          "requiredReasonIds": [
            "one-side-only"
          ]
        },
        {
          "id": "two-heaps",
          "label": "Two balanced heaps",
          "requiredReasonIds": [],
          "rejectionFeedback": "Two heaps track the half-boundary needed for a median; for the top-10 you only need one extreme, so a single heap is simpler."
        }
      ],
      "reasons": [
        {
          "id": "one-side-only",
          "text": "You need one extreme (the 10 largest), not the boundary between halves, so a single size-10 min-heap suffices."
        },
        {
          "id": "need-boundary",
          "text": "You need the boundary between the lower and upper halves, which requires two opposing heaps.",
          "contradictory": true
        },
        {
          "id": "resort-fine",
          "text": "Re-sorting the whole stream on each query is efficient enough.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "single-heap"
      ],
      "modelExplanation": "Top-K with a single size-10 min-heap: only one extreme is required, so the two-heap median machinery is unnecessary."
    }
  },
  {
    "id": "pat-th-fix-1",
    "kind": "fix-mistake",
    "prompt": "add_lower(small, large, num) uses portable negation for the lower max-heap, routes its maximum to the upper min-heap, and returns both heaps. The starter stores the wrong sign. Repair sign handling; this fragment does not rebalance sizes. Native max functions exist in Python 3.14, but keep the negation representation here.",
    "starterCode": "import heapq\ndef add_lower(small, large, num):\n    heapq.heappush(small, num)\n    heapq.heappush(large, heapq.heappop(small))\n    return small, large",
    "expected": "import heapq\ndef add_lower(small, large, num):\n    heapq.heappush(small, -num)\n    heapq.heappush(large, -heapq.heappop(small))\n    return small, large",
    "hints": [
      "Understand: small stores negative lower-half values; large stores actual upper-half values.",
      "Popping small obtains the negative of its current maximum.",
      "Undo that sign before inserting into large.",
      "Route the lower boundary value to the upper heap; this fragment does not promise size rebalancing.",
      "Pseudocode: heappush(small,-num); heappush(large,-heappop(small)).",
      "Solution: use heapq.heappush(large, -heapq.heappop(small)). These parameters are small and large, not self fields. Python 3.14 native max heaps are available, but this exercise specifically uses portable negation."
    ],
    "tests": "s, l = add_lower([-10], [], 5)\nassert l == [10], f'largest of lower half (10) moves up, got {l}'\nassert s == [-5], f'lower half keeps 5 as negated max-heap, got {s}'\ns, l = add_lower([], [], 3)\nassert l == [3] and s == [], f'first element flows up, got s={s} l={l}'\ns, l = add_lower([-7, -2], [], 9)\nassert l == [9], f'new max 9 moves up, got {l}'\nassert sorted(-v for v in s) == [2, 7], f'lower half keeps 2 and 7, got {s}'\nprint('OK')"
  }
],

  references: [
  {
    "url": "https://docs.python.org/3.14/library/heapq.html",
    "title": "Python 3.14: heapq",
    "section": "Heap invariant; max-heap APIs; merge; nlargest; priority queue notes; other applications",
    "topic": "two-heaps",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Median partition uses opposite heap orientations; native max APIs exist."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Use Python 3.14.2 zero-based heapq lists. Unqualified functions are min-oriented; native *_max APIs exist. Median examples deliberately use portable negation."
    ]
  },
  {
    "url": "https://opendatastructures.org/ods-python/10_1_BinaryHeap_Implicit_Bi.html",
    "title": "Open Data Structures: BinaryHeap",
    "section": "10.1 indexing; add/remove; resizing amortization; Figures 10.1–10.3",
    "topic": "two-heaps",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Constant-count heap updates have logarithmic amortized cost."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Both source and app use zero-based array indices, children 2i+1 and 2i+2, and parent (i-1)//2 for i>0. Resizing is accounted for amortized."
    ]
  },
  {
    "url": "https://leetcode.com/problems/ipo/description/",
    "title": "LeetCode: IPO problem",
    "section": "Project eligibility, nonnegative pure profits, at most k projects",
    "topic": "two-heaps",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "IPO is an eligibility/profit application, not a balanced partition."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Nonnegative pure profits, nonnegative capital thresholds, distinct projects selected once, at most k choices. Required capital gates eligibility and is not deducted."
    ]
  },
  {
    "url": "https://docs.python.org/3.14/builtins/stdtypes.html",
    "title": "Python 3.14 numeric types",
    "section": "Numeric types: arbitrary-size integers and finite-precision floating-point numbers",
    "topic": "two-heaps",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Floating-point results have limited range/precision; the app average precondition must also cover the intermediate sum."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "This median example assumes its root sum and float conversion do not overflow. Two finite 1e308 floats produce an infinite sum, so a representable mathematical average alone is insufficient."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "fa39fab4979b6ed0",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
