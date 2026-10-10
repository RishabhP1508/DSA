/**
 * Pattern: Merge intervals.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "[[1, 6], [8, 10], [15, 18]]\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# Merge closed intervals; touching endpoints merge.
def merge_intervals(intervals):
    ordered = sorted(intervals, key=lambda x: x[0])
    merged = []
    for start, end in ordered:
        if merged and start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged

print(merge_intervals([[1, 3], [2, 6], [8, 10], [15, 18]]))`;

export const mergeIntervalsPattern: PatternDefinition = {
  id: "merge-intervals",
  title: "Merge Intervals",
  category: "Intervals",
  summary:
    "Sort intervals by start, then sweep once merging any interval that overlaps the last kept one.",

  clues: [
  "The input is a list of intervals/ranges (start, end): meetings, bookings, ranges on a number line.",
  "You must form the union of ranges, consolidate overlaps, or insert a range into a union.",
  "Phrases such as merge overlapping ranges or consolidate booking blocks; counting concurrent meetings needs a different sweep.",
  "A brute-force pairwise overlap check would be O(n²)."
],

  naiveApproach: `Compare every pair of intervals to see if they overlap and keep merging until nothing changes — **O(n²)** or worse, with repeated passes. Overlap is only obvious once intervals are in order, so the unsorted brute force keeps re-discovering the same relationships.`,

  whyItHelps: `**Sort by start time** once (**O(n log n)**). After sorting, any interval that overlaps a previously kept interval must overlap the **most recent** one — so a single left-to-right sweep suffices: if the current interval starts at or before the last merged interval's end, **extend** that end; otherwise there's a gap, so **append** a new interval. One sort plus one linear pass gives **O(n log n)** total, and the sorted order guarantees you never miss an overlap.`,

  conditions: [
  "For this forward extend-end sweep, process valid finite [start,end] intervals in nondecreasing start order with start <= end.",
  "Use closed ranges; touching endpoints merge because start <= last end.",
  "The function allocates new result pairs and does not mutate or alias input pairs. Empty input returns []."
],

  alternatives: [
    "Sort by END time — the right choice for greedy interval SCHEDULING (max non-overlapping), a different goal than merging.",
    "Sweep line / event counting — for 'maximum concurrent intervals' (e.g. minimum meeting rooms) rather than producing merged ranges.",
    "Interval tree — when intervals are dynamic and you need repeated overlap queries.",
  ],

  counterexamples: [
  "Changing only the sort key to END while retaining this forward extend-end sweep can lose earlier starts. An adapted end-sorted reverse sweep is a valid alternative.",
  "'Maximum number of non-overlapping intervals you can keep' is greedy scheduling (sort by end), not merging.",
  "'How many rooms are needed at once' is a sweep-line/two-heap counting problem, not a merge."
],

  walkthroughCode,
  walkthroughExpectedOutput: "[[1, 6], [8, 10], [15, 18]]\n",
  complexityNote:
    "O(n log n) worst time; O(n) auxiliary for ordered/sort buffers, plus O(n) required output. A linear sweep alone needs O(1) working state beyond its output.",

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of intervals"
    }
  ],
  "costModel": "Sort by start (O(n log n)), then a single sweep merging each interval into the last kept one or starting a new one.",
  "time": {
    "bound": "O(n log n)",
    "case": "worst",
    "explanation": "Sorting by start time (line 3) is O(n log n) and dominates. The merge sweep (lines 5-9) is a single O(n) pass. Total O(n log n)."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "ordered is a separate O(n) list of references, and Python sort uses O(n) key/merge buffers in the worst case. The final merged list is O(n) required output and is excluded from this auxiliary bound.",
    "inputOutputNote": "intervals is supplied input and is unchanged; ordered is a separate reference list; merged is the required O(n) output of fresh pairs."
  },
  "derivation": [
    {
      "lines": [
        3
      ],
      "description": "Sort intervals by start time.",
      "cost": "O(n log n)",
      "dimension": "time"
    },
    {
      "lines": [
        5,
        6,
        7,
        8,
        9
      ],
      "description": "One sweep merging or appending each interval.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        3
      ],
      "description": "The separate sorted reference list and sort working buffers use O(n) auxiliary memory.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Sorting by START is what lets a single left-to-right sweep detect all overlaps.",
    "Comparison sort is O(n log n).",
    "Each interval is a two-value pair of finite, comparable numeric endpoints with start <= end; closed endpoints that touch overlap."
  ],
  "tradeoffs": "Without sorting you'd compare all pairs at O(n²). Sorting first makes overlaps adjacent, so one linear sweep suffices; the sort is the bottleneck.",
  "counters": [
    {
      "label": "new blocks",
      "definition": "executions of the new result-block append, including the first block",
      "countLines": [
        9
      ]
    }
  ],
  "fixedDataNote": "Merging [[1,3],[2,6],[8,10],[15,18]] yields [[1,6],[8,10],[15,18]]. The O(n log n) bound generalises via the sort. Function/query analysis excludes demonstration input literal creation and printing."
},

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: ranges are closed, so equal endpoints are included and merged."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define a nonmutating merge function for valid [start,end] pairs."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Create a separate start-sorted reference list; this does not reorder the supplied list."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Start with an empty result, handling empty input without indexing it."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Visit each interval in nondecreasing start order."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Test whether a last block exists and the current interval overlaps or touches it."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Extend only the result block end, preserving its smallest start."
  },
  {
    "line": 8,
    "executable": false,
    "explanation": "Otherwise the result is empty or there is a gap."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Create a new result pair, avoiding aliasing an input pair."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Return the union as separated closed blocks."
  },
  {
    "line": 11,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Print the merged example blocks."
  }
],

  bindings: [
  {
    "variable": "ordered",
    "model": "matrix"
  },
  {
    "variable": "merged",
    "model": "matrix"
  }
],

  linkedLessons: ["intervals", "interval-sorting"],

  exercises: [
  {
    "id": "pat-mi-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'Given a list of meeting time ranges, combine any that overlap into consolidated blocks.' Which pattern?",
    "expected": "Merge intervals: sort by start, sweep once, and extend the last block whenever the next range overlaps it. O(n log n).",
    "correctPatternId": "merge-intervals",
    "hints": [
      "Goal: combine any overlapping meeting-time ranges into consolidated blocks.",
      "Comparing every pair of intervals is O(n^2); sorting first lets a single sweep handle overlaps.",
      "Key insight: after sorting by start, an interval overlaps the last block exactly when its start ≤ that block's end.",
      "Approach: use the merge-intervals pattern — sort by start, then sweep once extending the last block.",
      "Pseudocode: sort by start; for each interval, if it overlaps the last block extend the block's end, else start a new block.",
      "Use merge intervals: sort by start and extend the last block whenever next.start ≤ last.end — O(n log n)."
    ],
    "recognition": {
      "scenario": "Given a list of meeting time ranges, combine any that overlap into consolidated blocks.",
      "approaches": [
        {
          "id": "merge-intervals",
          "label": "Merge intervals (sort by start, sweep)",
          "requiredReasonIds": [
            "sort-start-sweep"
          ]
        },
        {
          "id": "pairwise",
          "label": "Compare every pair of intervals",
          "requiredReasonIds": [],
          "rejectionFeedback": "Pairwise overlap checks are O(n^2); sorting by start then sweeping is O(n log n)."
        },
        {
          "id": "greedy-schedule",
          "label": "Greedy interval scheduling (sort by end)",
          "requiredReasonIds": [],
          "rejectionFeedback": "Scheduling maximizes a non-overlapping selection; here we must COMBINE overlaps, not select."
        }
      ],
      "reasons": [
        {
          "id": "sort-start-sweep",
          "text": "Sort by start, then sweep once extending the last kept block whenever the next range overlaps it — O(n log n)."
        },
        {
          "id": "sort-by-end",
          "text": "Sort by end time to greedily pick the most non-overlapping meetings.",
          "contradictory": true
        },
        {
          "id": "already-sorted",
          "text": "The intervals are already sorted, so no sort is needed and a single sweep is O(n).",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "merge-intervals"
      ],
      "modelExplanation": "Merge intervals: sort by start and sweep once, extending the current block on overlap — O(n log n) dominated by the sort."
    }
  },
  {
    "id": "pat-mi-choose-1",
    "kind": "choose-approach",
    "prompt": "'Find the maximum number of non-overlapping meetings you can attend.' Is that merge intervals? If not, what? Treat meetings as half-open [start,end) with start < end, so touching endpoints are compatible.",
    "expected": "No — that's greedy interval scheduling: sort by END time and greedily pick each meeting that starts at or after the last chosen one ends. Merging combines overlaps; scheduling maximizes a non-overlapping selection.",
    "correctPatternId": "greedy-interval-scheduling",
    "hints": [
      "Goal: find the maximum number of non-overlapping meetings you can attend.",
      "This looks like merging, but you're selecting a maximum-size set, not combining overlaps.",
      "Key insight: choosing the earliest-finishing compatible meeting leaves the most room for the rest.",
      "Approach: use greedy interval scheduling, sorting by END time.",
      "Pseudocode: sort by end; track last end; count each meeting whose start ≥ last end and update last end.",
      "No — that's greedy interval scheduling: sort by end and greedily pick each meeting starting at or after the last chosen ends."
    ],
    "recognition": {
      "scenario": "'Find the maximum number of non-overlapping meetings you can attend.' Is that merge intervals? If not, what? Treat meetings as half-open [start,end) with start < end, so touching endpoints are compatible.",
      "approaches": [
        {
          "id": "greedy-schedule",
          "label": "Greedy interval scheduling (sort by end)",
          "requiredReasonIds": [
            "earliest-finish"
          ]
        },
        {
          "id": "merge-intervals",
          "label": "Merge intervals (sort by start)",
          "requiredReasonIds": [],
          "rejectionFeedback": "Merging combines overlaps into blocks; here we must SELECT the most non-overlapping meetings, which is a different objective."
        }
      ],
      "reasons": [
        {
          "id": "earliest-finish",
          "text": "Sort by END time and greedily take each meeting starting at/after the last chosen one's end; earliest-finish is provably optimal for maximizing the count."
        },
        {
          "id": "combine-overlaps",
          "text": "The goal is to fuse overlapping ranges into consolidated blocks.",
          "contradictory": true
        },
        {
          "id": "sort-by-start",
          "text": "Sorting by start time is what makes this greedy choice optimal.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "greedy-schedule"
      ],
      "modelExplanation": "No — maximizing non-overlapping meetings is greedy interval scheduling: sort by end time and pick each compatible meeting. Merging is a different task."
    }
  },
  {
    "id": "pat-mi-fix-1",
    "kind": "fix-mistake",
    "prompt": "`merge_intervals(intervals)` returns the merged list of overlapping/touching intervals (each `[start, end]`). This misses overlaps because it sorts by the wrong key. Fix it.",
    "starterCode": "def merge_intervals(intervals):\n    if not intervals:\n        return []\n    intervals = sorted(intervals, key=lambda x: x[1])\n    merged = [list(intervals[0])]\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged",
    "expected": "def merge_intervals(intervals):\n    if not intervals:\n        return []\n    intervals = sorted(intervals, key=lambda x: x[0])\n    merged = [list(intervals[0])]\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged",
    "hints": [
      "Goal: fix the merge so it stops missing overlaps caused by sorting on the wrong key.",
      "The bug sorts by the wrong field, so an overlapping interval can land out of the sweep's reach.",
      "Key insight: merging requires intervals in START order so overlaps are always adjacent in the sweep.",
      "Approach: sort by the start coordinate before sweeping and extending blocks.",
      "Pseudocode: sort by x[0]; merged=[first]; for each interval: if start ≤ merged[-1] end extend it, else append.",
      "Sort with `key=lambda x: x[0]` (by start) so overlapping intervals are adjacent and get merged."
    ],
    "tests": "assert merge_intervals([[1,4],[2,3],[4,5]]) == [[1,5]], 'overlap + touch'\nassert merge_intervals([[1,3],[2,6],[8,10],[15,18]]) == [[1,6],[8,10],[15,18]]\nassert merge_intervals([[1,2],[5,6]]) == [[1,2],[5,6]], 'disjoint'\nassert merge_intervals([]) == []\nassert merge_intervals([[1,10],[2,3]]) == [[1,10]], 'contained'\nprint('OK')"
  }
],

  references: [
  {
    "url": "https://leetcode.com/problems/merge-intervals/description/",
    "title": "intervals reference",
    "section": "Examples 1–3; valid endpoint pairs",
    "topic": "patterns/merge-intervals",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "The output is a union of overlaps; touching endpoints merge."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Closed ranges with start <= end; fresh output pairs; nonmutating input."
    ]
  },
  {
    "url": "https://docs.python.org/3.14/howto/sorting.html",
    "title": "sort reference",
    "section": "Key functions; stability",
    "topic": "patterns/merge-intervals",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Sort-by-start prepares ordered processing; sort consumes working storage."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  },
  {
    "url": "https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c",
    "title": "CPython 3.14.2 list implementation",
    "section": "sort key allocation and merge routines",
    "topic": "patterns/merge-intervals",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "In-place list.sort can still allocate linear working memory."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "17fae99a8a79efa4",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
