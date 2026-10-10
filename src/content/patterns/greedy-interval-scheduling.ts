/**
 * Pattern: Greedy interval scheduling.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2). Output "3\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# Greedy interval scheduling: pick the most non-overlapping intervals by
# always taking the one that ENDS earliest among those that still fit.
def max_meetings(intervals):
    intervals.sort(key=lambda x: x[1])      # sort by END time
    count = 0
    last_end = float("-inf")
    for start, end in intervals:
        if start >= last_end:               # doesn't conflict with the last chosen
            count += 1
            last_end = end                  # commit to this meeting
    return count

print(max_meetings([[1, 3], [2, 4], [3, 5], [0, 6], [5, 7]]))  # 3`;

export const greedyIntervalSchedulingPattern: PatternDefinition = {
  id: "greedy-interval-scheduling",
  title: "Greedy Interval Scheduling",
  category: "Greedy",
  summary:
    "Maximize non-conflicting choices by making a locally optimal pick (earliest finish) that is provably globally optimal.",

  clues: [
  "Maximize the COUNT of compatible intervals, or minimize how many must be removed.",
  "For this objective, earliest finish is proved safe by an exchange or stays-ahead argument; other sort keys need their own proof.",
  "Phrases such as maximum meetings you can attend, non-overlapping intervals and activity selection."
],

  naiveApproach: "Try all 2ⁿ subsets, test each for compatibility, and keep the largest. Compatibility checking adds a polynomial factor, such as O(n log n) sorting per subset. Earliest-finish greedy avoids this subset search.",

  whyItHelps: `Sort intervals by **finish time** and repeatedly take the interval that **ends earliest** among those compatible with what you've chosen. Choosing the earliest finish leaves the **most remaining room** for future intervals — an **exchange argument** proves this greedy is optimal (any optimal solution can be rewritten to start with the earliest-finishing interval without losing count). One sort plus one pass gives **O(n log n)**. The key is that the greedy choice here is *safe*: it never rules out an optimal completion.`,

  conditions: [
  "The greedy choice must be provably optimal (activity selection: sort by END time — sorting by start or by length is NOT optimal).",
  "Intervals are comparable and the 'compatible' test is simple (next.start >= last.end).",
  "State the boundary convention (touching endpoints compatible or not).",
  "Unweighted meetings are finite half-open [start,end) ranges with start < end. Touching end/start coordinates are compatible. The function sorts the supplied list in place."
],

  alternatives: [
  "Merge intervals — sort by START to COMBINE overlaps (a different goal than selecting a max set).",
  "Dynamic programming — for weighted interval scheduling (maximize total value, not count), where greedy fails.",
  "Sweep-line endpoint counting or a min-heap of active end times handles maximum concurrent meetings/minimum rooms; that is a different objective."
],

  counterexamples: [
    "Sorting by START time (or by shortest duration) can select fewer intervals — the correct key is EARLIEST FINISH.",
    "If intervals have WEIGHTS and you maximize total value, greedy is wrong — use weighted-interval DP.",
    "'Merge all overlapping intervals' is the merge-intervals pattern (sort by start), not selection.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "3\n",
  complexityNote:
    "O(n log n) worst time including sorting and an O(n) selection pass. O(n) auxiliary space for Python sort key/merge storage; the selection scan alone is O(1).",

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of intervals"
    }
  ],
  "costModel": "Sort by end time (O(n log n)), then a single greedy pass picking each interval that starts at or after the last chosen end.",
  "time": {
    "bound": "O(n log n)",
    "case": "worst",
    "explanation": "Sorting by end time (line 4) is O(n log n) and dominates. The selection loop (lines 7-10) is a single O(n) pass. Total O(n log n)."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "Python list.sort mutates the list but can allocate O(n) key and merge buffers. Include that sorting memory in the function's auxiliary bound; count and last_end themselves use O(1).",
    "inputOutputNote": "intervals is input and is reordered in place; the scalar count is output."
  },
  "derivation": [
    {
      "lines": [
        4
      ],
      "description": "Sort the intervals by end time.",
      "cost": "O(n log n)",
      "dimension": "time"
    },
    {
      "lines": [
        7,
        8,
        9,
        10
      ],
      "description": "One greedy pass selecting compatible intervals.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        5,
        6
      ],
      "description": "Two scalar accumulators.",
      "cost": "O(1)",
      "dimension": "space"
    },
    {
      "lines": [
        4
      ],
      "description": "Python key-sort temporary keys and merging memory.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Choosing the earliest-ending compatible interval is optimal (the classic exchange-argument proof).",
    "Comparison sort is O(n log n).",
    "Meetings have start < end, finite comparable numeric endpoints; the goal counts equally weighted meetings. Touching endpoints are compatible."
  ],
  "tradeoffs": "When already end-sorted, the scan is O(n) time and O(1) working space; otherwise this implementation includes sorting. Weighted value needs a DP, and bounded-domain inputs may permit sorting alternatives.",
  "counters": [
    {
      "label": "intervals selected",
      "definition": "executions of count += 1 (line 9)",
      "countLines": [
        9
      ]
    }
  ],
  "fixedDataNote": "For these 5 intervals the greedy picks 3 non-overlapping meetings. The O(n log n) bound generalises via the sort. Function/query analysis excludes demonstration input literal creation and printing."
},

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: greedily pick earliest-finishing compatible intervals."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Comment continued."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Define max_meetings(intervals)."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Sort by END time — the crux of the greedy."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Count of chosen intervals."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "End time of the last chosen interval (initially -infinity)."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Scan intervals in finish-time order."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Test whether start is at or after last_end; the next lines select it only on a true test."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Select it."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Update the last finish time."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Return the maximum count of non-overlapping intervals."
  },
  {
    "line": 12,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "The best is 3 non-overlapping meetings (e.g. [1,3],[3,5],[5,7])."
  }
],

  bindings: [
  {
    "variable": "intervals",
    "model": "matrix"
  },
  {
    "variable": "count",
    "model": "object"
  }
],

  linkedLessons: ["intervals", "interval-sorting"],

  exercises: [
  {
    "id": "pat-gis-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'Given meeting time ranges, attend the MAXIMUM number without overlaps.' Which pattern and sort key? Meetings are half-open [start,end) with start < end; touching endpoints are compatible.",
    "expected": "Greedy interval scheduling: sort by END time and greedily pick each meeting starting at/after the last chosen one's end. O(n log n). Earliest-finish is the provably optimal choice.",
    "correctPatternId": "greedy-interval-scheduling",
    "hints": [
      "Goal: attend the maximum number of non-overlapping meetings.",
      "Trying all subsets is exponential; a greedy choice by finish time avoids that search.",
      "Key insight: earliest-finish-first is provably optimal because it frees the most remaining time.",
      "Approach: use greedy interval scheduling, sorting by end time.",
      "Pseudocode: sort by end; last_end=-inf; for each interval: if start ≥ last_end take it and set last_end=end.",
      "Use greedy interval scheduling: sort by finish time and take each earliest-finishing compatible interval — O(n log n)."
    ],
    "recognition": {
      "scenario": "Recognize: 'Given meeting time ranges, attend the MAXIMUM number without overlaps.' Which pattern and sort key? Meetings are half-open [start,end) with start < end; touching endpoints are compatible.",
      "approaches": [
        {
          "id": "greedy-end",
          "label": "Greedy interval scheduling, sort by END",
          "requiredReasonIds": [
            "earliest-finish-optimal"
          ]
        },
        {
          "id": "greedy-start",
          "label": "Greedy, sort by start",
          "requiredReasonIds": [],
          "rejectionFeedback": "Sorting by start can pick a long early meeting that blocks many later ones; earliest-finish is the provably optimal key."
        },
        {
          "id": "merge-intervals",
          "label": "Merge intervals",
          "requiredReasonIds": [],
          "rejectionFeedback": "Merging fuses overlaps; it does not select a maximum non-overlapping set."
        }
      ],
      "reasons": [
        {
          "id": "earliest-finish-optimal",
          "text": "Sort by finish time and greedily take each meeting that starts at/after the last chosen end; finishing earliest leaves the most room, which is provably optimal — O(n log n)."
        },
        {
          "id": "sort-by-duration",
          "text": "Sorting by shortest duration first is what guarantees optimality.",
          "contradictory": true
        },
        {
          "id": "need-dp",
          "text": "Only DP can solve this; no greedy rule is optimal.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "greedy-end"
      ],
      "modelExplanation": "Greedy interval scheduling: sort by end time and pick each meeting compatible with the last chosen one — earliest-finish is optimal, O(n log n)."
    }
  },
  {
    "id": "pat-gis-choose-1",
    "kind": "choose-approach",
    "prompt": "Each meeting has a VALUE and you want the maximum total value of non-overlapping meetings. Greedy or DP?",
    "expected": "Dynamic programming (weighted interval scheduling): sort by end, and for each interval choose max(skip, value + best compatible earlier). Greedy-by-finish maximizes COUNT, not weighted value.",
    "correctPatternId": "dynamic-programming",
    "hints": [
      "Goal: maximize the total VALUE of non-overlapping meetings, where each has a weight.",
      "Greedy-by-finish maximizes count, but a high-value meeting can outweigh several small ones it blocks.",
      "Key insight: with weights the objective changes, so earliest-finish is no longer optimal.",
      "Approach: use weighted interval scheduling with dynamic programming.",
      "Pseudocode: sort by end; for each interval choose max(skip it, value + best compatible earlier interval).",
      "Use weighted-interval DP: max(skip, value + best compatible earlier) — greedy-by-finish only maximizes count, not value."
    ],
    "recognition": {
      "scenario": "Each meeting has a VALUE and you want the maximum total value of non-overlapping meetings.",
      "approaches": [
        {
          "id": "weighted-dp",
          "label": "Dynamic programming (weighted interval scheduling)",
          "requiredReasonIds": [
            "value-changes-optimum"
          ]
        },
        {
          "id": "greedy-end",
          "label": "Greedy by earliest finish",
          "requiredReasonIds": [],
          "rejectionFeedback": "Earliest-finish greedy maximizes COUNT, but a high-value long meeting can beat several cheap short ones, so greedy is not optimal for value."
        }
      ],
      "reasons": [
        {
          "id": "value-changes-optimum",
          "text": "With weights, sort by end and for each interval choose max(skip, value + best compatible earlier) — the value can make a single interval beat many, so DP is needed."
        },
        {
          "id": "count-is-goal",
          "text": "We only maximize the count of meetings, so earliest-finish greedy is optimal.",
          "contradictory": true
        },
        {
          "id": "merge-overlaps",
          "text": "We must merge overlapping meetings into blocks.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "weighted-dp"
      ],
      "modelExplanation": "Weighted interval scheduling is DP: sort by end and take max(skip, value + best earlier compatible). Greedy-by-finish maximizes count, not weighted value."
    }
  },
  {
    "id": "pat-gis-fix-1",
    "kind": "fix-mistake",
    "prompt": "`max_non_overlapping(intervals)` returns the maximum COUNT of mutually compatible intervals (each is [start, end]). This sorts by the wrong key and selects too few. Fix the sort key. Meetings are half-open [start,end) with start < end; touching endpoints are compatible.",
    "starterCode": "def max_non_overlapping(intervals):\n    intervals = sorted(intervals, key=lambda x: x[0])\n    count = 0\n    last_end = float('-inf')\n    for start, end in intervals:\n        if start >= last_end:\n            count += 1\n            last_end = end\n    return count",
    "expected": "def max_non_overlapping(intervals):\n    intervals = sorted(intervals, key=lambda x: x[1])\n    count = 0\n    last_end = float('-inf')\n    for start, end in intervals:\n        if start >= last_end:\n            count += 1\n            last_end = end\n    return count",
    "hints": [
      "Return the maximum count, not the intervals themselves; meetings have start < end and touching endpoints are compatible.",
      "Sorting by start can pick a long interval that blocks several shorter ones.",
      "Key property: the optimal greedy always takes the interval that FINISHES earliest.",
      "Approach: sort by end time, then greedily take an interval whose start >= last end.",
      "Pseudocode: sort by x[1]; for start,end: if start>=last_end: count+=1; last_end=end.",
      "Fix: sort with key=lambda x: x[1] (end time)."
    ],
    "tests": "assert max_non_overlapping([[1,3],[2,4],[3,5]]) == 2, '[1,3] then [3,5]'\n# sort-by-start would pick the long [1,10] and block the rest:\nassert max_non_overlapping([[1,10],[2,3],[4,5],[6,7]]) == 3\nassert max_non_overlapping([[1,2]]) == 1\nassert max_non_overlapping([]) == 0\nprint('OK')"
  }
],

  references: [
  {
    "url": "https://www.cs.cornell.edu/courses/cs482/2006su/handouts/ahead.pdf",
    "title": "Cornell: Greedy Stays Ahead",
    "section": "Interval scheduling example; induction and optimality contradiction",
    "topic": "patterns/greedy-interval-scheduling",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Earliest finish stays ahead and maximizes the compatible interval count."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "The app treats touching positive-duration meetings as compatible."
    ]
  },
  {
    "url": "https://docs.python.org/3.14/howto/sorting.html",
    "title": "sort reference",
    "section": "Key Functions",
    "topic": "patterns/greedy-interval-scheduling",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Sort by end with one key computation per interval."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  },
  {
    "url": "https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c",
    "title": "CPython 3.14.2 list implementation",
    "section": "key-sort allocation; merge working storage",
    "topic": "patterns/greedy-interval-scheduling",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Mutating a list through sort does not imply constant working space."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "e5cfd10d2b22c242",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
