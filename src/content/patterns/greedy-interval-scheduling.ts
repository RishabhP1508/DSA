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
    "You must MAXIMIZE the count of non-overlapping intervals, or minimize removals/resources.",
    "A sort by a single key (finish time, start, size, ratio) exposes an obviously-best next choice.",
    "Phrases like 'maximum meetings you can attend', 'non-overlapping intervals', 'minimum arrows to burst balloons', 'activity selection'.",
  ],

  naiveApproach: `Try all subsets of intervals and keep the largest conflict-free one — **O(2ⁿ)**. Even a DP over intervals is more than needed here: the structure admits a provably correct one-pass greedy, so the exponential search is wasted effort.`,

  whyItHelps: `Sort intervals by **finish time** and repeatedly take the interval that **ends earliest** among those compatible with what you've chosen. Choosing the earliest finish leaves the **most remaining room** for future intervals — an **exchange argument** proves this greedy is optimal (any optimal solution can be rewritten to start with the earliest-finishing interval without losing count). One sort plus one pass gives **O(n log n)**. The key is that the greedy choice here is *safe*: it never rules out an optimal completion.`,

  conditions: [
    "The greedy choice must be provably optimal (activity selection: sort by END time — sorting by start or by length is NOT optimal).",
    "Intervals are comparable and the 'compatible' test is simple (next.start >= last.end).",
    "State the boundary convention (touching endpoints compatible or not).",
  ],

  alternatives: [
    "Merge intervals — sort by START to COMBINE overlaps (a different goal than selecting a max set).",
    "Dynamic programming — for weighted interval scheduling (maximize total value, not count), where greedy fails.",
    "Sweep line / two heaps — for 'how many resources at once' (minimum meeting rooms), a counting problem.",
  ],

  counterexamples: [
    "Sorting by START time (or by shortest duration) can select fewer intervals — the correct key is EARLIEST FINISH.",
    "If intervals have WEIGHTS and you maximize total value, greedy is wrong — use weighted-interval DP.",
    "'Merge all overlapping intervals' is the merge-intervals pattern (sort by start), not selection.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "3\n",
  complexityNote:
    "O(n log n) time, dominated by sorting; the selection pass is O(n). O(1) extra space beyond the sort.",

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of intervals" }],
    costModel: "Sort by end time (O(n log n)), then a single greedy pass picking each interval that starts at or after the last chosen end.",
    time: {
      bound: "O(n log n)",
      case: "worst",
      explanation: "Sorting by end time (line 4) is O(n log n) and dominates. The selection loop (lines 7-10) is a single O(n) pass. Total O(n log n).",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Beyond the sort, only `count` and `last_end` scalars are kept. (Python's list.sort is in place; its own working space is O(n) but not part of the algorithm's auxiliary state here.)",
      inputOutputNote: "intervals (n) is the input, sorted in place; the answer is a single count.",
    },
    derivation: [
      { lines: [4], description: "Sort the intervals by end time.", cost: "O(n log n)", dimension: "time" },
      { lines: [7, 8, 9, 10], description: "One greedy pass selecting compatible intervals.", cost: "O(n)", dimension: "time" },
      { lines: [5, 6], description: "Two scalar accumulators.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Choosing the earliest-ending compatible interval is optimal (the classic exchange-argument proof).", "Comparison sort is O(n log n)."],
    tradeoffs: "Sorting by start time instead requires extra bookkeeping; the earliest-end greedy is provably optimal and simplest. There is no faster comparison-based approach since sorting is the bottleneck.",
    counters: [{ label: "intervals selected", definition: "executions of count += 1 (line 9)", countLines: [9] }],
    fixedDataNote: "For these 5 intervals the greedy picks 3 non-overlapping meetings. The O(n log n) bound generalises via the sort.",
  },

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: greedily pick earliest-finishing compatible intervals." },
    { line: 2, executable: false, explanation: "Comment continued." },
    { line: 3, executable: true, explanation: "Define max_meetings(intervals)." },
    { line: 4, executable: true, explanation: "Sort by END time — the crux of the greedy." },
    { line: 5, executable: true, explanation: "Count of chosen intervals." },
    { line: 6, executable: true, explanation: "End time of the last chosen interval (initially -infinity)." },
    { line: 7, executable: true, explanation: "Scan intervals in finish-time order." },
    { line: 8, executable: true, explanation: "If this interval starts after the last one ended, it fits." },
    { line: 9, executable: true, explanation: "Select it." },
    { line: 10, executable: true, explanation: "Update the last finish time." },
    { line: 11, executable: true, explanation: "Return the maximum count of non-overlapping intervals." },
    { line: 12, executable: false, explanation: "Blank line." },
    { line: 13, executable: true, explanation: "The best is 3 non-overlapping meetings (e.g. [1,3],[3,5],[5,7])." },
  ],

  bindings: [
    { variable: "intervals", model: "object" },
    { variable: "count", model: "object" },
  ],

  linkedLessons: ["intervals", "interval-sorting"],

  exercises: [
    {
      id: "pat-gis-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Given meeting time ranges, attend the MAXIMUM number without overlaps.' Which pattern and sort key?",
      expected:
        "Greedy interval scheduling: sort by END time and greedily pick each meeting starting at/after the last chosen one's end. O(n log n). Earliest-finish is the provably optimal choice.",
      correctPatternId: "greedy-interval-scheduling",
      hints: [
        "You maximize a COUNT of non-overlapping intervals.",
        "Sort by finish time.",
        "Take earliest-finishing compatible interval.",
      ],
    },
    {
      id: "pat-gis-choose-1",
      kind: "choose-approach",
      prompt:
        "Each meeting has a VALUE and you want the maximum total value of non-overlapping meetings. Greedy or DP?",
      expected:
        "Dynamic programming (weighted interval scheduling): sort by end, and for each interval choose max(skip, value + best compatible earlier). Greedy-by-finish maximizes COUNT, not weighted value.",
      correctPatternId: "greedy-interval-scheduling",
      hints: [
        "Weights change the objective.",
        "Greedy count-maximization ignores value.",
        "Use weighted-interval DP.",
      ],
    },
    {
      id: "pat-gis-fix-1",
      kind: "fix-mistake",
      prompt:
        "This selects too few intervals because it sorts by the wrong key. Fix it.",
      starterCode:
        "intervals.sort(key=lambda x: x[0])\ncount = 0\nlast_end = float('-inf')\nfor start, end in intervals:\n    if start >= last_end:\n        count += 1\n        last_end = end\nreturn count",
      expected:
        "intervals.sort(key=lambda x: x[1])\ncount = 0\nlast_end = float('-inf')\nfor start, end in intervals:\n    if start >= last_end:\n        count += 1\n        last_end = end\nreturn count",
      hints: [
        "Sorting by start can grab a long interval that blocks many.",
        "The optimal greedy key is earliest FINISH.",
        "key=lambda x: x[1]",
      ],
    },
  ],

  references: [
    {
      url: "https://en.wikipedia.org/wiki/Activity_selection_problem",
      title: "Activity selection problem — Wikipedia",
      section: "Greedy by earliest finish time; optimality",
      topic: "patterns/greedy-interval-scheduling",
      purpose: "Confirm that selecting the earliest-finishing compatible interval is optimal and runs in O(n log n).",
      verifiedClaims: [
        "Choosing the activity that finishes earliest among compatible ones yields a maximum-size non-overlapping set.",
        "The greedy runs in O(n log n) after sorting by finish time.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://leetcode.com/problems/non-overlapping-intervals/editorial/",
      title: "Non-overlapping Intervals — LeetCode editorial",
      section: "Greedy by end time to keep the most intervals",
      topic: "patterns/greedy-interval-scheduling",
      purpose: "Cross-check that sorting by end time and greedily keeping compatible intervals maximizes the retained count.",
      verifiedClaims: ["Sorting by end time and greedily keeping non-overlapping intervals maximizes how many are kept."],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "84ee5949f5560d73",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
