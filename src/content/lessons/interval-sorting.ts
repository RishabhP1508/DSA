/**
 * Lesson: Interval sorting (Sorting). Verified on CPython 3.14.
 * Output: "[[1, 2], [2, 5], [3, 4]]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Sorting intervals is the setup step for most interval algorithms.
intervals = [[3, 4], [1, 2], [2, 5]]
# Sort by start time using a key on the first element.
print(sorted(intervals, key=lambda iv: iv[0]))`;

export const intervalSorting: LessonDefinition = {
  id: "interval-sorting",
  title: "Interval Sorting",
  area: "Sorting",
  prerequisites: ["comparators", "intervals"],

  explanation: `Almost every interval algorithm begins with the same move: **sort the intervals** — usually by **start**, sometimes by **end**. Sorting turns "compare every pair" (O(n²)) into "sweep once in order" (O(n) after the sort), because once intervals are ordered, overlaps and gaps become adjacent and locally decidable.

Which key you sort by encodes the strategy. **Sort by start** for merging overlaps and for "insert interval" problems: you sweep left to right and combine with the last kept interval. **Sort by end** for greedy **activity selection / non-overlapping intervals**: always keep the interval that finishes earliest, leaving the most room for the rest. Choosing the right key is the crux of these problems.

The cost is dominated by the sort, **O(n log n)**, using \`sorted(..., key=lambda iv: iv[0])\`. This lesson is the bridge between the Sorting topic and the interval problems in Arrays/greedy: recognizing "intervals" almost always means "sort first, then sweep."`,

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
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of intervals" }],
    costModel: "Sorting n items by a key is O(n log n) (Timsort); the key lambda is O(1) per interval.",
    time: {
      bound: "O(n log n)",
      case: "worst",
      explanation: "sorted uses Timsort: O(n log n) comparisons in the worst/average case (adaptive O(n) if already ordered). The key lambda is evaluated once per interval — O(n) — which does not change the O(n log n) class. This sort is the dominant cost of interval algorithms, whose subsequent sweep is only O(n).",
      otherCases: [
        { case: "best", bound: "O(n)", note: "Already sorted by the key: Timsort runs in O(n)." },
      ],
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "sorted returns a new list of n intervals and Timsort uses up to O(n) temporary space.",
      inputOutputNote: "The returned sorted list holds the n intervals; the input list is separate.",
    },
    derivation: [
      { lines: [4], description: "Timsort sorts the n intervals by key — O(n log n), the dominant cost.", cost: "O(n log n)", dimension: "time" },
      { lines: [4], description: "The key lambda is evaluated once per interval (n times).", cost: "O(n)", dimension: "time" },
      { lines: [4], description: "A new sorted list of n intervals plus sort buffers.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Comparisons and the key lambda are O(1).", "The chosen key matches the downstream algorithm's needs."],
    tradeoffs: "Without sorting, comparing all interval pairs is O(n²); sorting once (O(n log n)) turns the core work into an O(n) sweep — the standard trade behind interval algorithms.",
    counters: [],
    fixedDataNote: "This run sorts 3 intervals by start. The O(n log n) bound describes Timsort on n intervals.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: sorting is the setup for interval algorithms." },
    { line: 2, executable: true, explanation: "Three unsorted intervals." },
    { line: 3, executable: false, explanation: "Comment: sort by start with a key on iv[0]." },
    { line: 4, executable: true, explanation: "sorted by start → [[1,2],[2,5],[3,4]]; now overlaps/gaps are adjacent for a sweep." },
  ],

  bindings: [{ variable: "intervals", model: "matrix" }],

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
      id: "isort-choose-1",
      kind: "choose-approach",
      prompt: "You need to MERGE overlapping intervals. Sort by start or by end? What does sorting buy you?",
      expected: "Sort by START. Then a single left-to-right sweep can merge each interval into the last kept one when they overlap — turning an O(n²) pairwise check into O(n log n) sort + O(n) sweep.",
      hints: ["Merging combines adjacent overlaps.", "Which key makes overlaps adjacent from the left?", "Sort by start, then sweep."],
    },
    {
      id: "isort-complete-1",
      kind: "complete-code",
      prompt: "Sort intervals by their END time.",
      starterCode: "intervals = [[1, 5], [2, 3], [4, 6]]\n# TODO: sort by end time\nprint(sorted(intervals, key=None))",
      expected: "intervals = [[1, 5], [2, 3], [4, 6]]\nprint(sorted(intervals, key=lambda iv: iv[1]))",
      hints: ["The end is index 1 of each interval.", "Use a key lambda on iv[1].", "key=lambda iv: iv[1]"],
    },
  ],

  review: `**Interval sorting** is the setup step for interval algorithms: sort by **start** (merging, inserting) or by **end** (greedy non-overlap selection). It costs **O(n log n)** (Timsort) and converts an O(n²) pairwise comparison into an **O(n)** sweep. Picking the correct key is what makes the downstream greedy/merge correct — "intervals" almost always means "sort first, then sweep."`,

  expectedOutput: "[[1, 2], [2, 5], [3, 4]]\n",

  references: [
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Intervals — sort by start/end",
      topic: "sorting/intervals",
      purpose: "Confirm that interval problems begin by sorting on start or end depending on the goal.",
      verifiedClaims: ["Merging sorts by start; non-overlapping/activity selection sorts by end"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://algs4.cs.princeton.edu/93intersection/",
      title: "Geometric applications / interval scheduling — Princeton Algorithms",
      section: "Sorting-based interval processing",
      topic: "sorting/intervals",
      purpose: "Cross-check the sort-then-sweep paradigm for interval processing.",
      verifiedClaims: ["Sorting intervals enables linear-time sweep processing"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "49724a8fb9f03e24",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
