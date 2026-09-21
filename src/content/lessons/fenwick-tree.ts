/**
 * Lesson: Range queries — Fenwick tree (Binary Indexed Tree).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "10\n12\n16\n". Uses the array visualizer to show
 * the BIT storage and the low-bit jumps.
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Fenwick tree (Binary Indexed Tree): prefix sums with O(log n) point updates.
class Fenwick:
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (n + 1)      # 1-indexed; tree[0] unused
    def update(self, i, delta):        # add delta at position i
        while i <= self.n:
            self.tree[i] += delta
            i += i & (-i)              # jump to the next index that covers i
    def prefix(self, i):               # sum of positions 1..i
        s = 0
        while i > 0:
            s += self.tree[i]
            i -= i & (-i)              # strip the lowest set bit
        return s
    def range_sum(self, lo, hi):
        return self.prefix(hi) - self.prefix(lo - 1)

vals = [3, 2, -1, 6, 5, 4]
bit = Fenwick(len(vals))
for idx, v in enumerate(vals, start=1):
    bit.update(idx, v)
print(bit.prefix(4))         # 3+2-1+6 = 10
print(bit.range_sum(2, 5))   # 2-1+6+5 = 12
bit.update(3, 4)             # position 3 goes from -1 to 3
print(bit.range_sum(2, 5))   # 2+3+6+5 = 16`;

export const fenwickTree: LessonDefinition = {
  id: "fenwick-tree",
  title: "Range Queries: Fenwick Tree (BIT)",
  area: "Range queries",
  prerequisites: ["prefix-sums", "bit-shifts"],

  explanation: `A **Fenwick tree**, or **Binary Indexed Tree (BIT)**, answers **prefix-sum queries** while also supporting **point updates**, both in **O(log n)**. It fills the gap between two extremes: a plain **prefix-sum array** answers range sums in O(1) but needs O(n) to rebuild after any update, while a raw array updates in O(1) but sums a range in O(n). When values **change** *and* you keep asking for sums, the BIT's O(log n) for both is the sweet spot.

The trick is how each cell stores a **partial sum**. Using **1-based** indexing, cell \`i\` holds the sum of a block of elements ending at \`i\` whose **length is the lowest set bit of \`i\`** — written \`i & (-i)\` (a standard two's-complement idiom that isolates that bit). To get a prefix sum \`1..i\`, you repeatedly add \`tree[i]\` and **strip the lowest set bit** (\`i -= i & (-i)\`), hopping across O(log n) blocks that exactly tile \`[1..i]\`. To update position \`i\`, you add the delta and move **up** to the next cell that covers \`i\` (\`i += i & (-i)\`), again O(log n) steps. A **range sum** \`[lo..hi]\` is just \`prefix(hi) − prefix(lo−1)\`.

In the example, the initial prefix sum of the first 4 values is **10**, the range \`[2..5]\` is **12**, and after adding 4 to position 3 the same range becomes **16** — the update touched only a few cells, not the whole array. The BIT uses **O(n)** space (one array) and is dramatically simpler to code than a segment tree while being just as fast for this classic "prefix/point" workload. Its limitation: it's tailored to **invertible** aggregates (sums, XOR — anything with an inverse so \`prefix(hi) − prefix(lo−1)\` works); for non-invertible aggregates like range-minimum you reach for a segment tree (next lesson).`,

  vocabulary: [
    { term: "Fenwick tree / BIT", definition: "An array structure giving O(log n) prefix-sum queries and point updates." },
    { term: "Lowest set bit", definition: "The least-significant 1 bit of an index, isolated by i & (-i)." },
    { term: "Point update", definition: "Changing the value at a single position and propagating it in O(log n)." },
    { term: "Prefix sum", definition: "The total of positions 1..i, assembled from O(log n) BIT cells." },
    { term: "Invertible aggregate", definition: "An operation with an inverse (like +) so a range is prefix(hi) - prefix(lo-1)." },
    { term: "1-based indexing", definition: "Indexing from 1 so the bit tricks on i work; tree[0] is unused." },
  ],

  concepts: {
    purpose:
      "Support fast prefix/range sums on an array whose values change, in O(log n) per operation and O(n) space.",
    operations:
      "update(i, delta): add delta, walk up via i += i&(-i). prefix(i): sum down via i -= i&(-i). range_sum = prefix(hi) - prefix(lo-1).",
    uses:
      "Dynamic prefix sums, counting inversions, order-statistics, frequency/rank queries, 2D extensions for grids.",
    tradeoffs:
      "O(log n) update and query with a tiny constant and simple code; but limited to invertible aggregates — range-min/max needs a segment tree.",
    commonMistakes:
      "Using 0-based indices (the bit tricks assume 1-based); adding instead of assigning in update (BIT stores deltas — set requires delta = new - old); forgetting range = prefix(hi) - prefix(lo-1).",
    edgeCases:
      "prefix(0) is 0 (loop doesn't run). Updating position n still terminates (i exceeds n). A single element behaves like a length-1 prefix.",
  },

  complexity: [
    { operation: "update (point)", best: "O(log n)", average: "O(log n)", worst: "O(log n)", space: "O(n)", note: "Walk up O(log n) covering cells." },
    { operation: "prefix / range sum", best: "O(log n)", average: "O(log n)", worst: "O(log n)", note: "Sum across O(log n) blocks." },
    { operation: "build (n updates)", best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", note: "Or O(n) with a specialized build." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements the tree indexes" }],
    costModel:
      "Each update or query step changes the index by its lowest set bit, so the number of steps equals the number of bit positions touched — at most log₂ n.",
    time: {
      bound: "O(log n)",
      case: "worst",
      explanation:
        "Both update and prefix change the index by i & (-i) each iteration, either adding the lowest set bit (update, moving up) or removing it (prefix, moving down). Either way the index gains or loses one bit position per step, so at most ⌊log₂ n⌋ + 1 steps run. A range sum is two prefix calls, still O(log n).",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation:
        "The tree is a single array of n+1 longs. No recursion or auxiliary structure grows beyond that, so auxiliary space is O(n).",
      inputOutputNote: "The BIT array (O(n)) IS the structure; individual query results are O(1) integers.",
    },
    derivation: [
      { lines: [6, 7, 8, 9], description: "update walks up via i += i&(-i): one step per set-bit position → O(log n).", cost: "O(log n)", dimension: "time" },
      { lines: [10, 11, 12, 13, 14, 15], description: "prefix walks down via i -= i&(-i): O(log n) blocks summed.", cost: "O(log n)", dimension: "time" },
      { lines: [5], description: "One array of n+1 entries.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: [
      "Indexing is 1-based so i & (-i) isolates the correct block length.",
      "The aggregate is invertible (addition), so range = prefix(hi) - prefix(lo-1).",
      "Integer add and bitwise-and are O(1) at this scale.",
    ],
    tradeoffs:
      "Versus a static prefix-sum array (O(1) query but O(n) rebuild on update) the BIT trades a log factor on queries for O(log n) updates. Versus a segment tree it is simpler and faster by a constant but only handles invertible aggregates.",
    counters: [
      { label: "update steps", definition: "executions of the update loop body (line 8)", countLines: [8] },
      { label: "prefix steps", definition: "executions of the prefix loop body (line 13)", countLines: [13] },
    ],
    fixedDataNote:
      "Here n = 6, so each update/query touches at most 3 cells. The O(log n) bound describes how that step count grows with n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: BIT gives O(log n) prefix sums and point updates." },
    { line: 2, executable: true, explanation: "Define the Fenwick class." },
    { line: 3, executable: true, explanation: "Constructor takes the number of positions n." },
    { line: 4, executable: true, explanation: "Store n." },
    { line: 5, executable: true, explanation: "Allocate the 1-indexed tree array (index 0 unused)." },
    { line: 6, executable: true, explanation: "update(i, delta): add delta at position i." },
    { line: 7, executable: true, explanation: "Walk up while i is within bounds." },
    { line: 8, executable: true, explanation: "Add delta to this covering cell." },
    { line: 9, executable: true, explanation: "Jump to the next index that covers i by adding the lowest set bit." },
    { line: 10, executable: true, explanation: "prefix(i): sum of positions 1..i." },
    { line: 11, executable: true, explanation: "Accumulator." },
    { line: 12, executable: true, explanation: "Walk down while i is positive." },
    { line: 13, executable: true, explanation: "Add this block's partial sum." },
    { line: 14, executable: true, explanation: "Strip the lowest set bit to move to the previous block." },
    { line: 15, executable: true, explanation: "Return the prefix sum." },
    { line: 16, executable: true, explanation: "range_sum(lo, hi)." },
    { line: 17, executable: true, explanation: "A range is the difference of two prefix sums (addition is invertible)." },
    { line: 18, executable: false, explanation: "Blank line." },
    { line: 19, executable: true, explanation: "The values to index (1-based positions 1..6)." },
    { line: 20, executable: true, explanation: "Build a Fenwick tree of that size." },
    { line: 21, executable: true, explanation: "Insert each value with a point update (1-based)." },
    { line: 22, executable: true, explanation: "Perform the initial updates." },
    { line: 23, executable: true, explanation: "prefix(4) = 3+2-1+6 = 10." },
    { line: 24, executable: true, explanation: "range_sum(2,5) = 2-1+6+5 = 12." },
    { line: 25, executable: true, explanation: "Add 4 at position 3 (its value becomes 3)." },
    { line: 26, executable: true, explanation: "Now range_sum(2,5) = 2+3+6+5 = 16." },
  ],

  bindings: [{ variable: "bit", model: "object" }],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "Why does `i += i & (-i)` (update) walk UP the tree while `i -= i & (-i)` (prefix) walks DOWN, and why are both O(log n)?",
      answer: "i & (-i) isolates the lowest set bit. Adding it jumps to the next larger cell that covers position i (update path); subtracting it moves to the block just before the current one (prefix path). Each step changes one bit position, so both take at most log₂ n steps.",
      explanation: "The BIT encodes ranges by lowest-set-bit block lengths. Moving by that bit steps across those blocks, and there are only O(log n) bit positions.",
    },
  ],

  experiments: [
    "Print bit.tree after building to see which cells hold which block sums.",
    "Count update/prefix loop iterations and relate them to the binary form of the index.",
    "Add a `set(i, value)` method that computes delta = value - current and calls update.",
  ],

  exercises: [
    {
      id: "fen-complete-1",
      kind: "complete-code",
      prompt: "Complete the prefix-sum walk using the lowest-set-bit trick.",
      starterCode:
        "def prefix(self, i):\n    s = 0\n    while i > 0:\n        s += self.tree[i]\n        # TODO: move to the previous block\n    return s",
      expected:
        "def prefix(self, i):\n    s = 0\n    while i > 0:\n        s += self.tree[i]\n        i -= i & (-i)\n    return s",
      hints: [
        "Each cell covers a block ending at i.",
        "Strip the lowest set bit to reach the previous block.",
        "i -= i & (-i)",
      ],
    },
    {
      id: "fen-choose-1",
      kind: "choose-approach",
      prompt: "You need many range-SUM queries on an array whose entries are frequently updated. Static prefix-sum array or Fenwick tree — and why?",
      expected: "Fenwick tree: O(log n) for both update and query. A static prefix-sum array answers queries in O(1) but needs O(n) to rebuild after every update, which is too slow when updates are frequent.",
      hints: [
        "Static prefix sums are O(n) to update.",
        "Frequent updates make that costly.",
        "BIT is O(log n) for both.",
      ],
    },
    {
      id: "fen-predict-1",
      kind: "predict-state",
      prompt: "After building from [3,2,-1,6,5,4], what is range_sum(2,5), and how does update(3, 4) change it?",
      expected: "range_sum(2,5) = 12 (2-1+6+5). After update(3,4), position 3 becomes 3, so range_sum(2,5) = 2+3+6+5 = 16.",
      hints: [
        "Sum positions 2..5.",
        "The update adds 4 to position 3.",
        "12 + 4 = 16.",
      ],
    },
  ],

  review: `A **Fenwick tree (BIT)** gives **O(log n)** prefix-sum queries *and* point updates using **O(n)** space, ideal when values change and you keep querying sums. Each cell (1-based) stores a block whose length is the **lowest set bit** \`i & (-i)\`; queries **strip** that bit (walk down), updates **add** it (walk up), and a range is \`prefix(hi) − prefix(lo−1)\`. It's simpler than a segment tree but only handles **invertible** aggregates like sums. The example gives 10, 12, then 16 after a point update.`,

  expectedOutput: "10\n12\n16\n",

  references: [
    {
      url: "https://cp-algorithms.com/data_structures/fenwick.html",
      title: "Fenwick Tree — CP-Algorithms",
      section: "Definition, i & (-i) operations, complexity",
      topic: "range/fenwick",
      purpose: "Confirm the BIT structure, the lowest-set-bit update/query walks, O(log n) operations, and O(n) space.",
      verifiedClaims: [
        "A Fenwick tree supports prefix-sum queries and point updates in O(log n).",
        "The operations move by the lowest set bit i & (-i); range sums use prefix(hi) - prefix(lo-1).",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://en.wikipedia.org/wiki/Fenwick_tree",
      title: "Fenwick tree — Wikipedia",
      section: "Structure and operations",
      topic: "range/fenwick",
      purpose: "Cross-check the 1-based indexing, low-bit block interpretation, and that it handles invertible aggregates.",
      verifiedClaims: [
        "Each index stores the sum of a range determined by its lowest set bit.",
        "The Fenwick tree is suited to invertible operations such as addition.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "8cd9c596dba9c38c",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
