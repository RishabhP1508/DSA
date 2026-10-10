/**
 * Lesson: Interval sorting (Sorting). Verified on CPython 3.14.
 * Output: "[[1, 2], [2, 5], [3, 4]]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Sort intervals by start before a merge sweep.
intervals = [[3, 4], [1, 2], [2, 5]]
by_start = sorted(intervals, key=lambda iv: iv[0])
print(by_start)`;

export const intervalSorting: LessonDefinition = {
  id: "interval-sorting",
  title: "Interval Sorting",
  area: "Sorting",
  prerequisites: ["comparators", "intervals"],

  explanation: "Many static interval algorithms begin with the same move: **sort the intervals** — usually by **start**, sometimes by **end**. Sorting turns \"compare every pair\" (O(n²)) into \"sweep once in order\" (O(n) after the sort), because once intervals are ordered, overlaps and gaps become adjacent and locally decidable.\n\nWhich key you sort by encodes the strategy. **Sort by start** for merging overlaps and for \"insert interval\" problems: you sweep left to right and combine with the last kept interval. **Sort by end** for greedy **activity selection / non-overlapping intervals**: always keep the interval that finishes earliest, leaving the most room for the rest. Choosing the right key is the crux of these problems.\n\nThe cost is dominated by the sort, **O(n log n)**, using `sorted(..., key=lambda iv: iv[0])`. This lesson is the bridge between the Sorting topic and the interval problems in Arrays/greedy: recognizing \"intervals\" almost always means \"sort first, then sweep.\"\n\nAlready start-sorted disjoint intervals can support insertion with a linear scan and no new sort. Start order is the convention for a forward merge that only extends the end of the last result. An end-sorted reverse sweep can also merge correctly, provided it extends starts; changing the key alone does not make the shown forward algorithm correct. Selection uses half-open meeting intervals with start < end: touching endpoints are compatible.",

  vocabulary: [
    { term: "Interval", definition: "A [start, end] pair representing a range." },
    { term: "Sort by start", definition: "Ordering intervals by their start; the setup for merging/insertion." },
    { term: "Sort by end", definition: "Ordering by finish time; the setup for greedy non-overlap selection." },
    { term: "Sweep", definition: "A single ordered pass that decides overlaps/gaps locally after sorting." },
  ],

  concepts: {
    purpose: "Prepare intervals for linear sweeps by sorting on the right key (start or end).",
    operations: "sorted(intervals, key=lambda iv: iv[0]) for start; key=iv[1] for end.",
    uses: "Merge intervals, insert interval, meeting rooms, non-overlapping/activity selection.",
    tradeoffs: "Sorting costs O(n log n) but enables O(n) sweeps; the key choice determines correctness of the downstream greedy/merge.",
    commonMistakes: "Sorting by the wrong field for the problem (start vs end); forgetting to sort at all; assuming a sweep works on unsorted intervals.",
    edgeCases: "Empty list sorts to empty. Ties on the key keep input order (stable). Single interval trivially sorted.",
  },

  complexity: [
    { operation: "Sort intervals", best: "O(n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)", note: "Timsort by key; enables an O(n) downstream sweep." },
  ],

  complexityExplanation: {
  "scope": "program",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of intervals"
    }
  ],
  "costModel": "Sorting n items by a key is O(n log n) (Timsort); the key lambda is O(1) per interval.",
  "time": {
    "bound": "O(n log n)",
    "case": "worst",
    "explanation": "sorted uses Timsort: O(n log n) comparisons in the worst/average case (adaptive O(n) if already ordered). The key lambda is evaluated once per interval — O(n) — which does not change the O(n log n) class. This sort is the dominant cost of interval algorithms, whose subsequent sweep is only O(n).",
    "otherCases": [
      {
        "case": "best",
        "bound": "O(n)",
        "note": "Already sorted by the key: Timsort runs in O(n)."
      }
    ]
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "sorted returns a new list of n intervals and Timsort uses up to O(n) temporary space.",
    "inputOutputNote": "The returned sorted list holds the n intervals; the input list is separate."
  },
  "derivation": [
    {
      "lines": [
        3
      ],
      "description": "Timsort sorts the n intervals by key — O(n log n), the dominant cost.",
      "cost": "O(n log n)",
      "dimension": "time"
    },
    {
      "lines": [
        3
      ],
      "description": "The key lambda is evaluated once per interval (n times).",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        3
      ],
      "description": "A new sorted list of n intervals plus sort buffers.",
      "cost": "O(n)",
      "dimension": "space"
    },
    {
      "lines": [
        2,
        4
      ],
      "description": "Creating/printing n two-coordinate intervals adds O(n) with bounded-size coordinates.",
      "cost": "O(n)",
      "dimension": "time"
    }
  ],
  "assumptions": [
    "Comparisons and the key lambda are O(1).",
    "The chosen key matches the downstream algorithm's needs.",
    "Intervals have two finite constant-size comparable coordinates and start <= end. Whole-program scope includes setup and printing; the plotted sorting key costs O(1)."
  ],
  "tradeoffs": "Without sorting, comparing all interval pairs is O(n²); sorting once (O(n log n)) turns the core work into an O(n) sweep — the standard trade behind interval algorithms.",
  "counters": [],
  "fixedDataNote": "This run sorts 3 intervals by start. The O(n log n) bound describes Timsort on n intervals."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: start order prepares the merge sweep used in this lesson."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Create three valid input intervals."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Compute the first coordinate as a key and store the new start-sorted list."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Print [[1,2],[2,5],[3,4]]; the original intervals list keeps its order."
  }
],

  bindings: [
  {
    "variable": "intervals",
    "model": "matrix"
  },
  {
    "variable": "by_start",
    "model": "matrix"
  }
],

  prediction: [
    { atEventIndex: 0, prompt: "For 'select the maximum number of non-overlapping intervals', do you sort by start or by end, and why?", answer: "By END — greedily keeping the interval that finishes earliest leaves the most room for the rest, which is optimal.", explanation: "Activity selection is optimal when you always pick the earliest-finishing compatible interval; that requires sorting by end time, not start." },
  ],

  experiments: [
    "Sort the same intervals by end (key=lambda iv: iv[1]) and compare the order.",
    "Add a tie on start and confirm the stable order of equal-start intervals.",
    "Follow the start-sorted list with a merge sweep to combine overlaps.",
  ],

  exercises: [
  {
    "id": "isort-choose-1",
    "kind": "choose-approach",
    "prompt": "You need to MERGE overlapping intervals. Sort by start or by end? What does sorting buy you? Use the taught forward sweep, which only extends the END of the last output block.",
    "expected": "Sort by START. Then a single left-to-right sweep can merge each interval into the last kept one when they overlap — turning an O(n²) pairwise check into O(n log n) sort + O(n) sweep.",
    "hints": [
      "Goal: to MERGE overlapping intervals, decide whether to sort by start or by end, and what sorting enables.",
      "The costly baseline is comparing every pair of intervals, which is O(n²).",
      "In start order, each interval either overlaps the last merged block or starts after it; earlier separated blocks cannot be affected.",
      "Approach: sort by start, then sweep once, merging each interval into the last kept one when they overlap.",
      "The forward sweep only extends an end, so it requires start order. Sorting by end alone can lose earlier starts; an adapted reverse sweep is a separate valid algorithm.",
      "Answer: sort by START, then a single sweep merges overlaps — turning an O(n²) pairwise check into O(n log n) sort + O(n) sweep."
    ],
    "recognition": {
      "scenario": "You need to MERGE overlapping intervals. Sort by start or by end? What does sorting buy you? Use the taught forward sweep, which only extends the END of the last output block.",
      "approaches": [
        {
          "id": "sort-by-start",
          "label": "Sort by start, then sweep left to right",
          "requiredReasonIds": [
            "start-order-enables-sweep"
          ]
        },
        {
          "id": "sort-by-end",
          "label": "Sort by end",
          "requiredReasonIds": [],
          "rejectionFeedback": "End order alone is wrong for this forward sweep that only extends ends. An adapted reverse sweep that extends starts would be a valid different merge algorithm."
        },
        {
          "id": "no-sort",
          "label": "Compare every pair of intervals",
          "requiredReasonIds": [],
          "rejectionFeedback": "Pairwise comparison is O(n²); sorting first turns the merge into a single O(n) sweep."
        }
      ],
      "reasons": [
        {
          "id": "start-order-enables-sweep",
          "text": "After sorting by start, any interval that overlaps the last kept one starts before that one ends, so a single left-to-right sweep merges them — O(n log n) sort + O(n) sweep."
        },
        {
          "id": "end-order-for-merging",
          "text": "Sorting by end time is what makes interval merging work.",
          "contradictory": true
        },
        {
          "id": "merging-needs-no-sort",
          "text": "Merging overlapping intervals requires no sorting at all.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "sort-by-start"
      ],
      "modelExplanation": "Sort by START, then a single left-to-right sweep merges each interval into the last kept one when they overlap — turning an O(n²) pairwise check into O(n log n) sort + O(n) sweep."
    }
  },
  {
    "id": "isort-complete-1",
    "kind": "complete-code",
    "prompt": "Complete `sort_by_end(intervals)` so it returns the intervals sorted by their END time (index 1).",
    "starterCode": "def sort_by_end(intervals):\n    # TODO: sort by end time\n    return sorted(intervals, key=None)",
    "expected": "def sort_by_end(intervals):\n    return sorted(intervals, key=lambda iv: iv[1])",
    "hints": [
      "Goal: sort intervals by their end time.",
      "No custom comparator function is needed; a key on one field suffices.",
      "Key insight: the end value is index 1 of each interval.",
      "Approach: pass a key lambda selecting iv[1] to sorted.",
      "Pseudocode: sorted(intervals, key = each iv -> iv's end).",
      "Write `sorted(intervals, key=lambda iv: iv[1])`."
    ],
    "tests": "assert sort_by_end([[1, 5], [2, 3], [4, 6]]) == [[2, 3], [1, 5], [4, 6]], 'sort by end'\nassert sort_by_end([]) == [], 'empty'\nassert sort_by_end([[0, 9]]) == [[0, 9]], 'single'\nassert sort_by_end([[5, 8], [1, 2], [3, 4]]) == [[1, 2], [3, 4], [5, 8]], 'already end-ordered after sort'\nprint('OK')"
  }
],

  review: "**Interval sorting** is the setup step for interval algorithms: sort by **start** (merging, inserting) or by **end** (greedy non-overlap selection). It costs **O(n log n)** (Timsort) and converts an O(n²) pairwise comparison into an **O(n)** sweep. Picking the correct key is what makes the downstream greedy/merge correct — \"intervals\" almost always means \"sort first, then sweep.\" Already ordered input may need no new sort. Other merge conventions can use an end-sorted reverse sweep, but the shown forward extend-end rule relies on start order.",

  expectedOutput: "[[1, 2], [2, 5], [3, 4]]\n",

  references: [
  {
    "url": "https://docs.python.org/3.14/howto/sorting.html",
    "title": "sort reference",
    "section": "Key Functions; Sort Stability",
    "topic": "sorting/intervals",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Key functions order records and preserve ties."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  },
  {
    "url": "https://leetcode.com/problems/merge-intervals/description/",
    "title": "intervals reference",
    "section": "Examples and endpoint constraints",
    "topic": "sorting/intervals",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Closed ranges that touch can be merged."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  },
  {
    "url": "https://www.cs.cornell.edu/courses/cs482/2006su/handouts/ahead.pdf",
    "title": "Cornell: Greedy Stays Ahead",
    "section": "Interval scheduling example and proof",
    "topic": "sorting/intervals",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Earliest finish leaves a maximum-cardinality compatible set."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "This app distinguishes closed merging intervals from half-open start<end meeting intervals."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "ae105415d3888208",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
