/**
 * Lesson: Running median (Heaps). Verified on CPython 3.14.
 * Output: "4.0\n4\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `import heapq

# Maintain the median of a growing stream using two balanced heaps.
class MedianFinder:
    def __init__(self):
        self.small = []   # max-heap (store negatives) for the lower half
        self.large = []   # min-heap for the upper half
    def add(self, x):
        # 1) push to small, 2) move small's max over to large, 3) rebalance
        heapq.heappush(self.small, -x)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))
    def median(self):
        if len(self.small) > len(self.large):
            return -self.small[0]                    # odd count: middle element
        return (-self.small[0] + self.large[0]) / 2  # even count: average of middles

mf = MedianFinder()
for v in [5, 15, 1, 3]:
    mf.add(v)
print(mf.median())     # of {1,3,5,15} -> (3+5)/2 = 4.0
mf.add(4)
print(mf.median())     # of {1,3,4,5,15} -> middle = 4`;

export const runningMedian: LessonDefinition = {
  id: "running-median",
  title: "Running Median (Two Heaps)",
  area: "Heaps",
  prerequisites: ["min-max-heaps"],

  explanation: `The **median** of a stream is hard because it's a *middle* value — sorting after every insertion would be **O(n log n) per query**. The trick is to split the numbers into two balanced halves and keep each half's boundary instantly reachable with a heap: a **max-heap for the lower half** (\`small\`) and a **min-heap for the upper half** (\`large\`). Then the median is right at the two roots.

The invariant to maintain on every insert: \`small\` holds the smaller half (its **max** at the root), \`large\` holds the larger half (its **min** at the root), and their sizes differ by at most one with \`small\` allowed to be the bigger by one. The clean insertion recipe is: push the new value into \`small\`, immediately move \`small\`'s max into \`large\` (this places the value on the correct side), then rebalance if \`large\` got bigger. Each insert is **O(log n)**.

Reading the median is **O(1)**: if the counts are equal it's the average of the two roots; if \`small\` has one extra it's \`small\`'s max. For \`{1,3,5,15}\` that's \`(3+5)/2 = 4.0\`; after adding 4, \`{1,3,4,5,15}\` has middle \`4\`. This **two-heap balancing** is the specific application; the next lesson generalizes the pattern. \`heapq\`'s unqualified functions are a **min-heap**, so this lesson stores the lower half as **negated** values to act as a max-heap — a portable technique that runs on any version. (Python 3.14 also offers native \`heapq.*_max\` functions, so a max-heap can be built directly without negation.)`,

  vocabulary: [
    { term: "Running median", definition: "The median maintained as new values stream in." },
    { term: "Lower/upper half", definition: "The smaller and larger halves of the values seen so far." },
    { term: "small (max-heap)", definition: "Holds the lower half with its maximum at the root (negated in Python)." },
    { term: "large (min-heap)", definition: "Holds the upper half with its minimum at the root." },
    { term: "Balance invariant", definition: "The two heaps' sizes differ by at most one, small >= large in size." },
  ],

  concepts: {
    purpose: "Answer median queries on a growing stream in O(1), with O(log n) inserts.",
    operations: "add: push to small, shift small's max to large, rebalance sizes. median: read the roots.",
    uses: "Streaming statistics, moving/median-of-stream problems, sliding-window median (with removals).",
    tradeoffs: "O(log n) insert and O(1) query vs re-sorting's O(n log n) per query; needs two heaps and careful balancing.",
    commonMistakes: "Letting the heaps become unbalanced (median reads the wrong root); forgetting to negate for the max-heap; mixing up which heap can be larger; wrong even/odd median formula.",
    edgeCases: "First element: small has one item, median is it. Even count: average the two roots. Duplicates are fine.",
  },

  complexity: [
    { operation: "add", best: "O(log n)", average: "O(log n)", worst: "O(log n)", space: "O(n)", note: "A few heap pushes/pops per insert." },
    { operation: "median query", best: "O(1)", average: "O(1)", worst: "O(1)", note: "Read one or both heap roots." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of values inserted so far" }],
    costModel: "Each heappush/heappop is O(log n); reading a root is O(1). add does a constant number of heap operations.",
    time: {
      bound: "O(log n)",
      case: "worst",
      explanation: "Each add performs a fixed number of heap pushes/pops (at most three), and each is O(log n) on heaps holding up to n elements — so add is O(log n). A median query just reads one or both roots, which is O(1). Compare this to the naive approach of re-sorting all n values per query (O(n log n)): the two-heap structure makes queries constant and inserts logarithmic.",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "The two heaps together store all n values seen so far — O(n).",
      inputOutputNote: "The stored values ARE the data structure; O(n) is inherent to remembering the stream.",
    },
    derivation: [
      { lines: [10, 11], description: "Two heap pushes and one pop to place the value on the correct side.", cost: "O(log n)", dimension: "time" },
      { lines: [12, 13], description: "At most one rebalancing push/pop.", cost: "O(log n)", dimension: "time" },
      { lines: [15, 16, 17], description: "median reads one or both roots — O(1).", cost: "O(1)", dimension: "time" },
      { lines: [6, 7], description: "Two heaps hold all n values.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Comparisons are O(1).", "The lower half is a max-heap via negation.", "The balance invariant (sizes differ by <= 1) is preserved each add."],
    tradeoffs: "Re-sorting per query is O(n log n); an ordered structure (balanced BST / order-statistic tree) also gives O(log n) inserts and O(log n) median. The two-heap approach is simple and O(1) for the median read.",
    counters: [],
    fixedDataNote: "This run adds 5 values; median of {1,3,5,15} is 4.0, then of {1,3,4,5,15} is 4. The O(log n) add / O(1) query bounds generalise to n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import heapq." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: two balanced heaps track the median." },
    { line: 4, executable: true, explanation: "Define the MedianFinder class." },
    { line: 5, executable: true, explanation: "Constructor." },
    { line: 6, executable: true, explanation: "small: a max-heap (negated) for the lower half." },
    { line: 7, executable: true, explanation: "large: a min-heap for the upper half." },
    { line: 8, executable: true, explanation: "add(x): insert while keeping the halves balanced." },
    { line: 9, executable: false, explanation: "Comment describing the three-step insert." },
    { line: 10, executable: true, explanation: "Push x into small (as -x)." },
    { line: 11, executable: true, explanation: "Move small's current max into large — this routes x to the right side." },
    { line: 12, executable: true, explanation: "If large now has more elements than small..." },
    { line: 13, executable: true, explanation: "...move large's min back to small to restore balance." },
    { line: 14, executable: true, explanation: "median(): read the roots." },
    { line: 15, executable: true, explanation: "If small has one extra element (odd count)..." },
    { line: 16, executable: true, explanation: "...the median is small's max (-small[0])." },
    { line: 17, executable: true, explanation: "Otherwise (even count), average the two middle roots." },
    { line: 18, executable: false, explanation: "Blank line." },
    { line: 19, executable: true, explanation: "Create the finder." },
    { line: 20, executable: true, explanation: "Add 5, 15, 1, 3." },
    { line: 21, executable: true, explanation: "Add each value." },
    { line: 22, executable: true, explanation: "Median of {1,3,5,15} = (3+5)/2 = 4.0." },
    { line: 23, executable: true, explanation: "Add a 5th value, 4." },
    { line: 24, executable: true, explanation: "Median of {1,3,4,5,15} = 4 (the middle)." },
  ],

  bindings: [
    { variable: "small", model: "heap" },
    { variable: "large", model: "heap" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why does maintaining two heaps give O(1) median queries, and O(log n) inserts?", answer: "The two roots (max of the lower half, min of the upper half) are exactly the middle element(s), read in O(1); each insert only does a constant number of O(log n) heap operations to keep the halves balanced.", explanation: "Splitting the data at the median and exposing each half's boundary at a heap root means the median is always at the roots (O(1) read). Inserts just push/pop a few times to preserve the balance invariant, costing O(log n)." },
  ],

  experiments: [
    "Print the sizes of small and large after each add to watch the balance invariant hold.",
    "Feed a sorted stream and confirm the median updates correctly.",
    "Add an even vs odd number of elements and see the two median formulas fire.",
  ],

  exercises: [
    {
      id: "med-choose-1",
      kind: "choose-approach",
      prompt: "You must report the median after every insertion in a stream of a million numbers. Two heaps or re-sort each time? Give complexities.",
      expected: "Two heaps: O(log n) per insert, O(1) per median → O(n log n) total. Re-sorting each query is O(n log n) PER query → O(n² log n) total. The two-heap approach is vastly better.",
      hints: ["How expensive is sorting per query?", "O(n log n) each time — n times.", "Two heaps give O(log n) insert, O(1) query."],
    },
    {
      id: "med-fix-1",
      kind: "fix-mistake",
      prompt: "This add() forgets to rebalance, so the heaps can become lopsided and the median is wrong. Add the rebalance step.",
      starterCode: "def add(self, x):\n    heapq.heappush(self.small, -x)\n    heapq.heappush(self.large, -heapq.heappop(self.small))",
      expected: "def add(self, x):\n    heapq.heappush(self.small, -x)\n    heapq.heappush(self.large, -heapq.heappop(self.small))\n    if len(self.large) > len(self.small):\n        heapq.heappush(self.small, -heapq.heappop(self.large))",
      hints: ["After moving to large, large may be bigger than small.", "Restore the size invariant.", "If len(large) > len(small): move large's min back to small."],
    },
  ],

  review: `**Running median** keeps two balanced heaps — a **max-heap of the lower half** and a **min-heap of the upper half** — so the median sits at the roots. Each **add** is **O(log n)** (a few heap ops to rebalance) and each **median** query is **O(1)**, vastly beating re-sorting per query. This lesson negates the lower half to turn \`heapq\`'s default **min-heap** into a max-heap — a portable trick (Python 3.14 also has native \`heapq.*_max\` functions). This is the two-heap balancing pattern applied to streaming medians.`,

  expectedOutput: "4.0\n4\n",

  references: [
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Heap / Priority Queue — Find Median from Data Stream",
      topic: "heaps/running-median",
      purpose: "Confirm the two-heap approach: max-heap lower half + min-heap upper half, O(log n) add, O(1) median.",
      verifiedClaims: ["Running median uses two balanced heaps; add is O(log n) and median query is O(1)"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://docs.python.org/3/library/heapq.html",
      title: "heapq — Heap queue algorithm — Python 3.14 documentation",
      section: "heappush / heappop; min-heap and negation for max-heap",
      topic: "heaps/running-median",
      purpose: "Confirm heapq's unqualified functions are a min-heap (negation gives a portable max-heap; 3.14 also adds native *_max functions) and push/pop are O(log n).",
      verifiedClaims: ["heapq implements a min-heap; a max-heap is obtained by negating values"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "c8fedb5d21b3ffce",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
