/**
 * Lesson: Two-heap pattern (Heaps). Verified on CPython 3.14.
 * Output: "2 2\n20 30\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `import heapq

# The two-heap pattern: split data into a lower half and an upper half,
# each boundary exposed at a heap root, kept balanced by size.
small = []   # max-heap (negated): the lower half
large = []   # min-heap: the upper half

for x in [10, 20, 30, 40]:
    heapq.heappush(small, -x)                      # add to lower half
    heapq.heappush(large, -heapq.heappop(small))   # shift its max to upper half
    if len(large) > len(small):                    # rebalance sizes
        heapq.heappush(small, -heapq.heappop(large))

print(len(small), len(large))     # balanced: 2 and 2
print(-small[0], large[0])        # the two boundary values: 20 and 30`;

export const twoHeapPattern: LessonDefinition = {
  id: "two-heap-pattern",
  title: "The Two-Heap Pattern",
  area: "Heaps",
  prerequisites: ["running-median"],

  explanation: `The **two-heap pattern** is the general recognition skill behind the running-median lesson: whenever a problem needs **fast access to the boundary between a "smaller half" and a "larger half"** of a changing dataset, keep **two heaps facing each other** — a **max-heap for the lower half** and a **min-heap for the upper half** — balanced by size. The two roots are exactly the boundary elements, available in **O(1)**, and inserts stay **O(log n)**.

The mechanics are always the same three moves per insert: (1) push into one heap, (2) move that heap's boundary element to the other so the value lands on the correct side, (3) rebalance the sizes if they drift apart. The invariant "sizes differ by at most one" guarantees the boundary is always at the roots.

This pattern powers more than medians: **IPO / maximize capital** (a max-heap of affordable projects fed by a min-heap ordered by cost), **sliding-window median**, and any "keep the middle / partition point cheap" problem. Recognizing it means spotting that you care about a *dividing value* in a mutable multiset, not full order. Because \`heapq\`'s unqualified functions are a **min-heap**, the lower half stores **negated** values to behave as a max-heap — a portable technique (Python 3.14 also provides native \`heapq.*_max\` functions). Here, after inserting \`[10,20,30,40]\`, the halves are balanced at sizes 2 and 2 with boundary values \`20\` (lower max) and \`30\` (upper min).`,

  vocabulary: [
    { term: "Two-heap pattern", definition: "Two opposing heaps (max-heap lower half, min-heap upper half) tracking a partition point." },
    { term: "Boundary elements", definition: "The two heap roots straddling the split between lower and upper halves." },
    { term: "Balance invariant", definition: "The heaps' sizes differ by at most one, keeping the boundary at the roots." },
    { term: "Rebalance", definition: "Moving one element between heaps to restore the size invariant." },
    { term: "Opposing heaps", definition: "One max-heap and one min-heap arranged to meet at the median/partition." },
  ],

  concepts: {
    purpose: "Keep the partition point of a changing dataset instantly available via two balanced heaps.",
    operations: "Insert: push, shift boundary to the other heap, rebalance. Read: the two roots.",
    uses: "Running/sliding-window median, IPO/maximize-capital, scheduling with two priorities, partition tracking.",
    tradeoffs: "O(log n) insert and O(1) boundary read; needs careful balancing and (in Python) negation for the max-heap.",
    commonMistakes: "Letting sizes drift (boundary no longer at the roots); pushing to the wrong heap without the shift step; forgetting negation on the lower half.",
    edgeCases: "First insert leaves one heap with one element. Even vs odd counts change which root(s) form the answer. Duplicates are fine.",
  },

  complexity: [
    { operation: "insert", best: "O(log n)", average: "O(log n)", worst: "O(log n)", space: "O(n)", note: "Constant number of O(log n) heap ops per insert." },
    { operation: "read boundary", best: "O(1)", average: "O(1)", worst: "O(1)", note: "Peek one or both roots." },
  ],

  complexityExplanation: {
    variables: [{ symbol: "n", meaning: "the number of elements inserted so far" }],
    costModel: "Each heappush/heappop is O(log n); reading a root is O(1). Each insert does a constant number of heap operations.",
    time: {
      bound: "O(log n)",
      case: "worst",
      explanation: "Every insert performs a fixed number of pushes/pops (push, shift, at most one rebalance), each O(log n) on heaps of size up to n — so an insert is O(log n). Reading the boundary is just peeking one or two roots, O(1). This is the pattern's payoff: the partition point stays cheap to query while the multiset changes.",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "The two heaps together store all n elements — O(n).",
      inputOutputNote: "The stored elements are the data structure; O(n) is inherent.",
    },
    derivation: [
      { lines: [9, 10], description: "Push and shift the boundary to the correct side — O(log n).", cost: "O(log n)", dimension: "time" },
      { lines: [11, 12], description: "At most one rebalancing move.", cost: "O(log n)", dimension: "time" },
      { lines: [14, 15], description: "Reading the roots (sizes / boundary values) — O(1).", cost: "O(1)", dimension: "time" },
      { lines: [4, 5], description: "Two heaps hold all n elements.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Comparisons are O(1).", "Lower half is a max-heap via negation.", "The size invariant is preserved every insert."],
    tradeoffs: "A balanced BST / order-statistic tree also tracks partition points in O(log n) and additionally supports deletions cleanly; the two-heap approach is simpler and gives O(1) boundary reads but plain heaps don't support arbitrary deletion (needed for sliding-window median, which uses lazy deletion).",
    counters: [],
    fixedDataNote: "This run inserts 4 values; the halves end balanced (2 and 2) with boundary values 20 and 30. The O(log n) insert / O(1) read bounds generalise to n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import heapq." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: split into lower/upper halves with two heaps." },
    { line: 4, executable: false, explanation: "Comment continues." },
    { line: 5, executable: true, explanation: "small: max-heap (negated) for the lower half." },
    { line: 6, executable: true, explanation: "large: min-heap for the upper half." },
    { line: 7, executable: false, explanation: "Blank line." },
    { line: 8, executable: true, explanation: "Insert each value with the three-step balancing." },
    { line: 9, executable: true, explanation: "Step 1: push into the lower half (as -x)." },
    { line: 10, executable: true, explanation: "Step 2: move small's max into large so the value lands correctly." },
    { line: 11, executable: true, explanation: "Step 3: if large outgrew small..." },
    { line: 12, executable: true, explanation: "...move large's min back to small to rebalance." },
    { line: 13, executable: false, explanation: "Blank line." },
    { line: 14, executable: true, explanation: "Sizes are balanced → 2 2." },
    { line: 15, executable: true, explanation: "The boundary values are small's max (20) and large's min (30)." },
  ],

  bindings: [
    { variable: "small", model: "heap" },
    { variable: "large", model: "heap" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "What signals that a problem is a good fit for the two-heap pattern?", answer: "When you need fast, repeated access to the boundary/partition between a smaller half and a larger half of a CHANGING dataset (e.g. the median), rather than full sorted order.", explanation: "The pattern shines when only the dividing value matters and the data mutates: two opposing balanced heaps expose that boundary at their roots in O(1) with O(log n) inserts, avoiding full re-sorting." },
  ],

  experiments: [
    "Print the sizes and roots after each insert to watch the balance invariant hold.",
    "Compute the median from the roots (this pattern IS the running-median engine).",
    "Sketch how IPO/maximize-capital feeds affordable items from a min-heap (by cost) into a max-heap (by profit).",
  ],

  exercises: [
    {
      id: "twoheap-choose-1",
      kind: "choose-approach",
      prompt: "Which of these fit the two-heap pattern: (a) find the kth largest, (b) running median of a stream, (c) merge k sorted lists?",
      expected: "(b) running median — it needs the boundary between the lower and upper halves. (a) is a single size-k heap; (c) is a k-way merge (heap of fronts). Only (b) uses two opposing balanced heaps.",
      hints: ["Which needs the MIDDLE/partition of a changing set?", "That's the running median.", "kth largest = one bounded heap; merge = heap of fronts."],
    },
    {
      id: "twoheap-fix-1",
      kind: "fix-mistake",
      prompt: "This insert skips the rebalance, so the boundary can drift off the roots. Add the missing step.",
      starterCode: "heapq.heappush(small, -x)\nheapq.heappush(large, -heapq.heappop(small))",
      expected: "heapq.heappush(small, -x)\nheapq.heappush(large, -heapq.heappop(small))\nif len(large) > len(small):\n    heapq.heappush(small, -heapq.heappop(large))",
      hints: ["After the shift, large may be larger than small.", "Restore the size invariant.", "If len(large) > len(small): move large's min back to small."],
    },
  ],

  review: `The **two-heap pattern** keeps a **max-heap of the lower half** and a **min-heap of the upper half**, balanced by size, so the **partition/boundary sits at the two roots** — O(1) to read, O(log n) to insert. It generalizes the running median and powers problems like sliding-window median and maximize-capital. The recognition cue: you need the *dividing value* of a **changing** multiset, not full order. (\`heapq\` defaults to a min-heap → negate the lower half, or use the native \`*_max\` functions on Python 3.14+.)`,

  expectedOutput: "2 2\n20 30\n",

  references: [
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Heap / Priority Queue — two-heap problems",
      topic: "heaps/two-heap",
      purpose: "Confirm the two-heap pattern (balanced max-heap/min-heap) and its application to median and related problems.",
      verifiedClaims: ["Two balanced opposing heaps expose the partition point at their roots; insert O(log n), boundary read O(1)"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://docs.python.org/3/library/heapq.html",
      title: "heapq — Heap queue algorithm — Python 3.14 documentation",
      section: "heappush / heappop; min-heap with negation",
      topic: "heaps/two-heap",
      purpose: "Confirm heapq's default min-heap and the negation trick used for the lower-half max-heap (native *_max functions available on 3.14+), with O(log n) operations.",
      verifiedClaims: ["heapq is a min-heap; negation yields a max-heap; push/pop are O(log n)"],
      accessDate: "2026-09-20",
    },
  ],
};
