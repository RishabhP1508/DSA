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
    "Phrases like 'median from a data stream', 'sliding window median', 'balance two halves', 'IPO/maximize capital'.",
  ],

  naiveApproach: `Keep a sorted list and insert each new value in order (**O(n)** per insert) or re-sort after each addition (**O(n log n)** per query). Over a stream of n values this is **O(n²)**–**O(n² log n)** — too slow, and it recomputes order the heaps could maintain incrementally.`,

  whyItHelps: `Maintain **two heaps**: a **max-heap** holding the smaller half and a **min-heap** holding the larger half, with their sizes kept within one of each other. The median is then either the top of the larger heap (odd total) or the **average of the two tops** (even total) — read in **O(1)**. Each insertion pushes, moves one element across to keep the halves ordered, and rebalances, all in **O(log n)**. So a stream of n values costs **O(n log n)** total with O(1) median queries, versus the O(n²) sorted-list approach.`,

  conditions: [
    "Keep the heaps balanced (|size difference| ≤ 1) after every insert.",
    "Python's heapq is a MIN-heap, so simulate the max-heap by storing negated values.",
    "Preserve the ordering invariant: every value in the lower heap ≤ every value in the upper heap (the cross-move enforces it).",
  ],

  alternatives: [
    "Single heap / top-K — when you only need the k largest or the k-th element, not a split into balanced halves.",
    "Balanced BST / order-statistics tree — supports medians plus arbitrary rank queries and deletions (useful for sliding-window median).",
    "Sorted container (e.g. bisect into a list) — fine for small inputs; O(n) inserts don't scale.",
  ],

  counterexamples: [
    "'k largest elements' needs only one size-k heap (top-K pattern), not two balanced heaps.",
    "Sliding-window median also needs efficient REMOVAL of the outgoing element — a plain two-heap needs lazy deletion or a different structure.",
    "Forgetting to negate for the max-heap makes the lower half behave as a min-heap and breaks the median.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "[5.0, 10.0, 5.0, 4.0]\n",
  complexityNote:
    "O(log n) per insertion (a few heap pushes/pops), O(1) per median query. Space O(n) to hold all elements across the two heaps.",

  complexityExplanation: {
    variables: [{ symbol: "n", meaning: "the number of elements inserted so far" }],
    costModel: "Two balanced heaps (a max-heap for the lower half, a min-heap for the upper half). Each add does a constant number of heap pushes/pops; each median reads the roots.",
    time: {
      bound: "O(log n)",
      case: "worst",
      explanation: "Each add (lines 9-13) does a constant number of heappush/heappop operations, each O(log n) on heaps of size ~n/2. So add is O(log n). median (lines 14-17) reads the heap roots in O(1). Inserting all n elements is O(n log n).",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "The two heaps together store all n elements.",
      inputOutputNote: "The n inserted values are held across the heaps; each median query returns one number.",
    },
    derivation: [
      { lines: [10, 11], description: "Push into small then move its max to large — O(log n).", cost: "O(log n)", dimension: "time" },
      { lines: [12, 13], description: "Rebalance if large grew bigger — one more O(log n) move.", cost: "O(log n)", dimension: "time" },
      { lines: [16, 17], description: "Read the median from the roots.", cost: "O(1)", dimension: "time" },
      { lines: [7, 8], description: "Two heaps hold all n elements.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["heapq's default functions are a min-heap, so the lower half stores NEGATED values to act as a max-heap (portable; Python 3.14 also has native *_max functions).", "Heap push/pop are O(log(size))."],
    tradeoffs: "Re-sorting per query is O(n log n) per median; a balanced BST also gives O(log n) inserts. Two heaps give O(log n) add and O(1) median with simple code.",
    counters: [{ label: "adds", definition: "executions of the small push (line 10)", countLines: [10] }],
    fixedDataNote: "Adding [5,15,1,3] yields running medians [5.0,10.0,5.0,4.0]. The O(log n)-per-add bound generalises.",
  },

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import heapq (a min-heap)." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: lower half in a max-heap, upper half in a min-heap." },
    { line: 4, executable: false, explanation: "Comment continued." },
    { line: 5, executable: true, explanation: "Define the MedianFinder class." },
    { line: 6, executable: true, explanation: "Constructor." },
    { line: 7, executable: true, explanation: "small = lower half as a max-heap (negated values)." },
    { line: 8, executable: true, explanation: "large = upper half as a min-heap." },
    { line: 9, executable: true, explanation: "add(num): insert while keeping the invariant." },
    { line: 10, executable: true, explanation: "Push into the lower half (negated for max-heap behavior)." },
    { line: 11, executable: true, explanation: "Move the lower half's max into the upper half to keep them ordered." },
    { line: 12, executable: true, explanation: "If the upper half grew larger, rebalance..." },
    { line: 13, executable: true, explanation: "...by moving its min back to the lower half." },
    { line: 14, executable: true, explanation: "median(): read the middle in O(1)." },
    { line: 15, executable: true, explanation: "Odd total: the lower half has the extra element." },
    { line: 16, executable: true, explanation: "Return its top (un-negated)." },
    { line: 17, executable: true, explanation: "Even total: average the two heap tops." },
    { line: 18, executable: false, explanation: "Blank line." },
    { line: 19, executable: true, explanation: "Create the finder." },
    { line: 20, executable: true, explanation: "Collect running medians." },
    { line: 21, executable: true, explanation: "Feed the stream one value at a time." },
    { line: 22, executable: true, explanation: "Add each value." },
    { line: 23, executable: true, explanation: "Record the current median." },
    { line: 24, executable: true, explanation: "After 5,15,1,3 the running medians are [5.0, 10.0, 5.0, 4.0]." },
  ],

  bindings: [
    { variable: "small", model: "heap" },
    { variable: "large", model: "heap" },
  ],

  linkedLessons: ["two-heap-pattern", "running-median", "min-max-heaps"],

  exercises: [
    {
      id: "pat-th-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Numbers arrive one at a time; after each, report the median of all numbers so far.' Which pattern?",
      expected:
        "Two heaps: a max-heap for the lower half and a min-heap for the upper half, kept balanced. The median is the top of the larger heap or the average of the two tops. O(log n) per add, O(1) per query.",
      correctPatternId: "two-heaps",
      hints: [
        "You need the middle value repeatedly on a stream.",
        "Split the data into two ordered halves.",
        "Balance the halves so the median sits at the tops.",
      ],
    },
    {
      id: "pat-th-choose-1",
      kind: "choose-approach",
      prompt:
        "You only need the 10 largest numbers seen so far (not the median). Two heaps or top-K?",
      expected:
        "Top-K with a single size-10 min-heap — no need to split into balanced halves. Two heaps is for medians / half-boundary problems.",
      correctPatternId: "two-heaps",
      hints: [
        "You want an extreme set, not the middle.",
        "One size-k heap suffices.",
        "Two balanced heaps would be overkill.",
      ],
    },
    {
      id: "pat-th-fix-1",
      kind: "fix-mistake",
      prompt:
        "This max-heap isn't actually a max-heap (heapq is a min-heap). Fix the lower half.",
      starterCode:
        "heapq.heappush(self.small, num)\nheapq.heappush(self.large, heapq.heappop(self.small))",
      expected:
        "heapq.heappush(self.small, -num)\nheapq.heappush(self.large, -heapq.heappop(self.small))",
      hints: [
        "heapq only gives a min-heap.",
        "Negate values to simulate a max-heap.",
        "Push -num; move -(popped) across.",
      ],
    },
  ],

  references: [
    {
      url: "https://leetcode.com/problems/find-median-from-data-stream/editorial/",
      title: "Find Median from Data Stream — LeetCode editorial",
      section: "Two heaps (max-heap + min-heap), balancing",
      topic: "patterns/two-heaps",
      purpose: "Confirm the two-heap median technique, the balancing invariant, and O(log n) add / O(1) median.",
      verifiedClaims: [
        "A max-heap for the lower half and a min-heap for the upper half give the median in O(1) with O(log n) insertion.",
        "The heaps are kept balanced within one element of each other.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://docs.python.org/3/library/heapq.html",
      title: "heapq — Heap queue algorithm (Python)",
      section: "Min-heap; negating for max-heap behavior",
      topic: "patterns/two-heaps",
      purpose: "Cross-check that heapq is a min-heap and negation yields max-heap behavior on the bundled Python.",
      verifiedClaims: ["heapq is a binary min-heap; storing negated values simulates a max-heap."],
      accessDate: "2026-09-20",
    },
  ],
};
