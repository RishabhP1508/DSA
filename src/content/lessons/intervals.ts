/**
 * Lesson: Intervals (Arrays). Verified on CPython 3.14.
 * Output: "[[1, 6], [8, 10], [15, 18]]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Merge overlapping intervals.
intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]
# Step 1: sort by start so overlaps are adjacent.
intervals.sort()
# Step 2: sweep, merging into the last kept interval when they overlap.
merged = [intervals[0]]
for start, end in intervals[1:]:
    if start <= merged[-1][1]:
        merged[-1][1] = max(merged[-1][1], end)
    else:
        merged.append([start, end])
print(merged)`;

export const intervals: LessonDefinition = {
  id: "intervals",
  title: "Intervals (Merge)",
  area: "Arrays",
  prerequisites: ["array-traversal"],

  explanation: `An **interval** is a pair \`[start, end]\` representing a range (a meeting, a booking, a segment). A very common task is to **merge overlapping intervals** into the fewest non-overlapping ranges.

The key insight is that overlaps are only easy to see once the intervals are **sorted by start**. After sorting, you sweep left to right keeping a list of merged results. For each interval, compare its \`start\` to the \`end\` of the **last merged** interval: if \`start <= last_end\`, they overlap (or touch), so you **extend** the last interval's end to \`max(last_end, end)\`; otherwise there is a gap, so you **append** a new interval.

This is a **greedy sweep**: sorting guarantees that once you move past an interval, nothing later can overlap what you already closed. The cost is dominated by the sort — **O(n log n)** — with a single linear merge pass afterward. Interval problems (merge, insert, meeting rooms, overlap counting) almost all start with "sort by start (or end), then sweep."`,

  vocabulary: [
    { term: "Interval", definition: "A [start, end] pair representing a range." },
    { term: "Overlap", definition: "Two intervals overlap when one starts at or before the other ends." },
    { term: "Merge", definition: "Combine overlapping intervals into one covering range." },
    { term: "Sweep", definition: "Process intervals in sorted order, maintaining running state." },
    { term: "Greedy", definition: "Make the locally obvious choice (extend or append) that provably leads to the optimum here." },
  ],

  concepts: {
    purpose: "Interval merging reduces overlapping ranges to a minimal set, the basis of scheduling problems.",
    operations: "Sort by start; sweep, extending the last interval on overlap or appending on a gap.",
    uses: "Calendar merging, meeting rooms, free/busy times, range consolidation, insert-interval.",
    tradeoffs: "Sorting costs O(n log n); if intervals arrive pre-sorted, the merge alone is O(n).",
    commonMistakes: "Forgetting to sort first; using < instead of <= (touching intervals like [1,2],[2,3] should merge); shrinking the end instead of taking the max; comparing to the wrong (not the last) merged interval.",
    edgeCases: "Single interval (returned as-is). Fully nested intervals ([1,10],[2,3]) — the max keeps the larger end. Touching endpoints depend on whether <= or < is intended.",
  },

  complexity: [
    { operation: "Merge intervals", best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)", note: "Dominated by the sort; linear merge pass; output up to n intervals." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of intervals" }],
    costModel: "Sorting n items is O(n log n) (Python's Timsort). Each merge step is O(1); comparing/list ops are O(1) amortized.",
    time: {
      bound: "O(n log n)",
      case: "worst",
      explanation: "Sorting the n intervals by start costs O(n log n) and dominates. The sweep then visits each interval once, doing O(1) work (a comparison and either an extend or an append), which is O(n). Total: O(n log n) + O(n) = O(n log n).",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "The `merged` result can hold up to n intervals when nothing overlaps. Python's sort also uses O(n) auxiliary space in the worst case.",
      inputOutputNote: "The output list is up to n intervals; that is required output size, and the sort's temporary space is O(n).",
    },
    derivation: [
      { lines: [4], description: "Sort the n intervals by start — the dominant cost.", cost: "O(n log n)", dimension: "time" },
      { lines: [7, 8, 9, 10, 11], description: "One linear sweep, O(1) per interval (extend or append).", cost: "O(n)", dimension: "time" },
      { lines: [6, 11], description: "The merged output holds up to n intervals.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Comparisons for sorting are O(1).", "Touching intervals (start == last end) should merge, so we use <=.", "append is amortized O(1)."],
    tradeoffs: "If the input is already sorted by start, skip the sort and the whole thing is O(n); otherwise the sort's O(n log n) is unavoidable.",
    counters: [
      { label: "intervals swept", definition: "iterations of the sweep loop body (line 8)", countLines: [8] },
      { label: "new intervals appended", definition: "executions of the append (line 11)", countLines: [11] },
    ],
    fixedDataNote: "This run merges 4 intervals into 3 ([1,3]+[2,6]→[1,6]). The O(n log n) bound generalises to n intervals.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: merge overlapping intervals." },
    { line: 2, executable: true, explanation: "Create the intervals list." },
    { line: 3, executable: false, explanation: "Comment: sort so overlaps become adjacent." },
    { line: 4, executable: true, explanation: "Sort by start (lists sort lexicographically, so by first element then second)." },
    { line: 5, executable: false, explanation: "Comment: sweep and merge into the last kept interval." },
    { line: 6, executable: true, explanation: "Seed merged with the first interval." },
    { line: 7, executable: true, explanation: "Iterate the remaining intervals, unpacking each into start, end." },
    { line: 8, executable: true, explanation: "Overlap test: does this interval start at or before the last merged interval's end?" },
    { line: 9, executable: true, explanation: "Overlap → extend the last interval's end to the max of the two ends." },
    { line: 10, executable: false, explanation: "Otherwise (a gap)..." },
    { line: 11, executable: true, explanation: "...append this interval as a new separate range." },
    { line: 12, executable: true, explanation: "Print the merged result → [[1, 6], [8, 10], [15, 18]]." },
  ],

  bindings: [
    { variable: "intervals", model: "matrix" },
    { variable: "merged", model: "matrix" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why must the intervals be sorted by start before the sweep works?", answer: "So overlapping intervals are adjacent; then comparing each interval only to the LAST merged one is sufficient.", explanation: "Sorting by start guarantees that once you close a merged interval, no later interval can overlap it earlier, so a single left-to-right pass comparing to the last merged interval is correct." },
  ],

  experiments: [
    "Add a fully nested interval like [4, 5] and confirm the max keeps the larger end.",
    "Change <= to < and test touching intervals like [1,2],[2,3] to see the difference.",
    "Pre-sort the input and reason about why the sort could then be skipped (O(n)).",
  ],

  exercises: [
    {
      id: "int-fix-1",
      kind: "fix-mistake",
      prompt: "This merge forgets a crucial first step and gives wrong results on unsorted input. Fix it.",
      starterCode: "def merge(intervals):\n    merged = [intervals[0]]\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged",
      expected: "def merge(intervals):\n    intervals.sort()\n    merged = [intervals[0]]\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged",
      hints: ["What makes overlaps adjacent?", "The sweep only works on sorted input.", "Add intervals.sort() before building merged."],
    },
    {
      id: "int-choose-1",
      kind: "choose-approach",
      prompt: "What is the overall time complexity of interval merging, and which step dominates?",
      expected: "O(n log n), dominated by the sort. The merge sweep itself is only O(n).",
      hints: ["Two steps: sort, then sweep.", "Which is more expensive?", "Sorting is O(n log n) and dominates the O(n) sweep."],
    },
  ],

  review: `An **interval** is \`[start, end]\`. To **merge** overlaps: **sort by start**, then **sweep**, extending the last merged interval when \`start <= last_end\` (use \`<=\` so touching intervals merge) or appending on a gap. It is a **greedy sweep** costing **O(n log n)** (the sort dominates) with **O(n)** output space. "Sort then sweep" is the template for most interval problems.`,

  expectedOutput: "[[1, 6], [8, 10], [15, 18]]\n",

  references: [
    {
      url: "https://www.geeksforgeeks.org/merging-intervals/",
      title: "Merge Overlapping Intervals — GeeksforGeeks",
      section: "Sort then merge",
      topic: "arrays/intervals",
      purpose: "Confirm the sort-then-sweep merge algorithm and its O(n log n) cost.",
      verifiedClaims: ["Sort by start, then merge adjacent overlapping intervals in one pass", "Overall O(n log n) dominated by sorting"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Intervals",
      topic: "arrays/intervals",
      purpose: "Cross-check the intervals problem family and the canonical sort-then-sweep approach.",
      verifiedClaims: ["Interval problems generally start by sorting on start or end, then sweeping"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "dd19cbd5f67b20d0",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
