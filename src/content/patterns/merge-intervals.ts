/**
 * Pattern: Merge intervals.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "[[1, 6], [8, 10], [15, 18]]\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# Merge intervals: combine overlapping ranges after sorting by start.
def merge_intervals(intervals):
    intervals.sort(key=lambda x: x[0])          # sort by start time
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:              # overlaps the last kept interval
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])         # gap -> start a new interval
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
    "You must merge overlaps, insert an interval, count overlaps, or find free/conflicting time.",
    "Phrases like 'merge overlapping intervals', 'insert interval', 'meeting rooms', 'free time'.",
    "A brute-force pairwise overlap check would be O(n²).",
  ],

  naiveApproach: `Compare every pair of intervals to see if they overlap and keep merging until nothing changes — **O(n²)** or worse, with repeated passes. Overlap is only obvious once intervals are in order, so the unsorted brute force keeps re-discovering the same relationships.`,

  whyItHelps: `**Sort by start time** once (**O(n log n)**). After sorting, any interval that overlaps a previously kept interval must overlap the **most recent** one — so a single left-to-right sweep suffices: if the current interval starts at or before the last merged interval's end, **extend** that end; otherwise there's a gap, so **append** a new interval. One sort plus one linear pass gives **O(n log n)** total, and the sorted order guarantees you never miss an overlap.`,

  conditions: [
    "Sort by START (not end) so 'overlaps something earlier' reduces to 'overlaps the last kept interval'.",
    "Treat touching endpoints (start == last end) as overlapping or not — state the convention; here <= merges them.",
    "Intervals are comparable and finite.",
  ],

  alternatives: [
    "Sort by END time — the right choice for greedy interval SCHEDULING (max non-overlapping), a different goal than merging.",
    "Sweep line / event counting — for 'maximum concurrent intervals' (e.g. minimum meeting rooms) rather than producing merged ranges.",
    "Interval tree — when intervals are dynamic and you need repeated overlap queries.",
  ],

  counterexamples: [
    "Sorting by END and merging can miss overlaps — merging needs start-sorted order.",
    "'Maximum number of non-overlapping intervals you can keep' is greedy scheduling (sort by end), not merging.",
    "'How many rooms are needed at once' is a sweep-line/two-heap counting problem, not a merge.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "[[1, 6], [8, 10], [15, 18]]\n",
  complexityNote:
    "O(n log n) time, dominated by the sort; the merge sweep is O(n). O(n) space for the output (O(1) extra beyond it).",

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of intervals" }],
    costModel: "Sort by start (O(n log n)), then a single sweep merging each interval into the last kept one or starting a new one.",
    time: {
      bound: "O(n log n)",
      case: "worst",
      explanation: "Sorting by start time (line 3) is O(n log n) and dominates. The merge sweep (lines 5-9) is a single O(n) pass. Total O(n log n).",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "The `merged` output can hold up to n intervals (when none overlap). Beyond the output, only O(1) extra state is used.",
      inputOutputNote: "intervals (n) is the input, sorted in place; the merged list is the O(n) output.",
    },
    derivation: [
      { lines: [3], description: "Sort intervals by start time.", cost: "O(n log n)", dimension: "time" },
      { lines: [5, 6, 7, 8, 9], description: "One sweep merging or appending each interval.", cost: "O(n)", dimension: "time" },
      { lines: [4], description: "Output list up to n intervals.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Sorting by START is what lets a single left-to-right sweep detect all overlaps.", "Comparison sort is O(n log n)."],
    tradeoffs: "Without sorting you'd compare all pairs at O(n²). Sorting first makes overlaps adjacent, so one linear sweep suffices; the sort is the bottleneck.",
    counters: [{ label: "intervals kept", definition: "executions of the append branch (line 9)", countLines: [9] }],
    fixedDataNote: "Merging [[1,3],[2,6],[8,10],[15,18]] yields [[1,6],[8,10],[15,18]]. The O(n log n) bound generalises via the sort.",
  },

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: merge overlapping ranges after sorting." },
    { line: 2, executable: true, explanation: "Define merge_intervals(intervals)." },
    { line: 3, executable: true, explanation: "Sort by start time so overlaps are adjacent." },
    { line: 4, executable: true, explanation: "Seed the result with the first (earliest-start) interval." },
    { line: 5, executable: true, explanation: "Sweep the remaining intervals in start order." },
    { line: 6, executable: true, explanation: "If this interval starts within the last kept one, they overlap..." },
    { line: 7, executable: true, explanation: "...extend the last interval's end to cover both." },
    { line: 8, executable: false, explanation: "Otherwise there is a gap." },
    { line: 9, executable: true, explanation: "Start a new, separate interval." },
    { line: 10, executable: true, explanation: "Return the merged, non-overlapping intervals." },
    { line: 11, executable: false, explanation: "Blank line." },
    { line: 12, executable: true, explanation: "[1,3] and [2,6] merge to [1,6]; [8,10] and [15,18] stay separate." },
  ],

  bindings: [{ variable: "merged", model: "object" }],

  linkedLessons: ["intervals", "interval-sorting"],

  exercises: [
    {
      id: "pat-mi-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Given a list of meeting time ranges, combine any that overlap into consolidated blocks.' Which pattern?",
      expected:
        "Merge intervals: sort by start, sweep once, and extend the last block whenever the next range overlaps it. O(n log n).",
      correctPatternId: "merge-intervals",
      hints: [
        "The inputs are ranges you must combine.",
        "Sort by start first.",
        "Overlap = next.start <= last.end.",
      ],
    },
    {
      id: "pat-mi-choose-1",
      kind: "choose-approach",
      prompt:
        "'Find the maximum number of non-overlapping meetings you can attend.' Is that merge intervals? If not, what?",
      expected:
        "No — that's greedy interval scheduling: sort by END time and greedily pick each meeting that starts after the last chosen one ends. Merging combines overlaps; scheduling maximizes a non-overlapping selection.",
      correctPatternId: "merge-intervals",
      hints: [
        "You're selecting, not combining.",
        "Sort by end time for scheduling.",
        "Different goal, different sort key.",
      ],
    },
    {
      id: "pat-mi-fix-1",
      kind: "fix-mistake",
      prompt: "This misses overlaps because it sorts by the wrong key. Fix it.",
      starterCode:
        "intervals.sort(key=lambda x: x[1])\nmerged = [intervals[0]]\nfor start, end in intervals[1:]:\n    if start <= merged[-1][1]:\n        merged[-1][1] = max(merged[-1][1], end)\n    else:\n        merged.append([start, end])",
      expected:
        "intervals.sort(key=lambda x: x[0])\nmerged = [intervals[0]]\nfor start, end in intervals[1:]:\n    if start <= merged[-1][1]:\n        merged[-1][1] = max(merged[-1][1], end)\n    else:\n        merged.append([start, end])",
      hints: [
        "Merging needs intervals in START order.",
        "Sorting by end can place an overlapping interval out of reach.",
        "key=lambda x: x[0]",
      ],
    },
  ],

  references: [
    {
      url: "https://leetcode.com/problems/merge-intervals/editorial/",
      title: "Merge Intervals — LeetCode editorial",
      section: "Sort by start, then merge in one pass",
      topic: "patterns/merge-intervals",
      purpose: "Confirm sorting by start reduces merging to a single sweep and the O(n log n) cost.",
      verifiedClaims: [
        "Sorting intervals by start time lets overlapping intervals be merged in a single linear sweep.",
        "The algorithm is O(n log n) dominated by the sort.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://github.com/ashishps1/awesome-leetcode-resources",
      title: "Awesome LeetCode Resources — patterns (merge intervals)",
      section: "Merge intervals pattern",
      topic: "patterns/merge-intervals",
      purpose: "Cross-check recognition clues and the contrast with interval scheduling.",
      verifiedClaims: ["Merge-intervals problems are recognized by overlapping-range inputs and solved by sort-then-sweep."],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "b338311febd76e5d",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
