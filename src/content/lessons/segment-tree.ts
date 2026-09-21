/**
 * Lesson: Range queries — segment tree (iterative, range sum + point update).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "10\n12\n16\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Segment tree: range queries with point updates in O(log n).
# Iterative array layout: leaves in [n, 2n), each parent = combine of its children.
class SegTree:
    def __init__(self, data):
        self.n = len(data)
        self.tree = [0] * (2 * self.n)
        for i in range(self.n):                 # store leaves in the second half
            self.tree[self.n + i] = data[i]
        for i in range(self.n - 1, 0, -1):      # build parents bottom-up
            self.tree[i] = self.tree[2 * i] + self.tree[2 * i + 1]
    def update(self, i, value):                 # set position i to value
        i += self.n
        self.tree[i] = value
        i //= 2
        while i >= 1:                           # refresh ancestors
            self.tree[i] = self.tree[2 * i] + self.tree[2 * i + 1]
            i //= 2
    def query(self, lo, hi):                    # sum of [lo, hi)  (half-open)
        res = 0
        lo += self.n
        hi += self.n
        while lo < hi:
            if lo & 1:                          # lo is a right child -> include it
                res += self.tree[lo]
                lo += 1
            if hi & 1:                          # hi is a right child -> include hi-1
                hi -= 1
                res += self.tree[hi]
            lo //= 2
            hi //= 2
        return res

st = SegTree([3, 2, -1, 6, 5, 4])
print(st.query(0, 4))   # 3+2-1+6 = 10
print(st.query(1, 5))   # 2-1+6+5 = 12
st.update(2, 3)         # index 2 becomes 3
print(st.query(1, 5))   # 2+3+6+5 = 16`;

export const segmentTree: LessonDefinition = {
  id: "segment-tree",
  title: "Range Queries: Segment Tree",
  area: "Range queries",
  prerequisites: ["fenwick-tree", "tree-dfs"],

  explanation: `A **segment tree** answers **range queries** (sum, min, max, gcd, …) with **point updates**, both in **O(log n)**, over an array whose values change. It is more general than a Fenwick tree: because each node stores the **combined value of a contiguous segment** rather than a prefix, it works for **non-invertible** aggregates like range-minimum or range-maximum, where the \`prefix(hi) − prefix(lo−1)\` trick would fail.

This lesson uses the compact **iterative** layout. Allocate an array \`tree\` of size \`2n\`; the original elements become the **leaves** in the second half \`[n, 2n)\`, and each internal node \`i\` stores the combine of its two children \`tree[2i]\` and \`tree[2i+1]\`. Building bottom-up (fill leaves, then compute parents from \`n−1\` down to \`1\`) is **O(n)**. A **point update** sets a leaf and walks up refreshing each ancestor — **O(log n)** because the tree has that height. The **range query** is the elegant part: with a **half-open** interval \`[lo, hi)\`, push both indices to the leaf layer and climb; whenever \`lo\` is a **right child** (\`lo & 1\`) it isn't fully inside its parent's segment, so add \`tree[lo]\` and step past it, and symmetrically when \`hi\` is odd, include \`tree[hi−1]\`; then halve both. This visits only **O(log n)** nodes that exactly tile the range.

In the example the range \`[0,4)\` sums to **10**, \`[1,5)\` to **12**, and after setting index 2 to 3 the range \`[1,5)\` becomes **16**. Segment trees use **O(n)** space. Compared to the Fenwick tree: the BIT is smaller and simpler and is the go-to for plain prefix/point **sums**; the segment tree is the tool when you need **min/max/gcd** or richer operations (and, with **lazy propagation** — beyond this lesson — even efficient *range* updates). Remember the interval convention here is **half-open**: \`query(lo, hi)\` covers indices \`lo\` through \`hi−1\`.`,

  vocabulary: [
    { term: "Segment tree", definition: "A tree where each node stores an aggregate over a contiguous segment, giving O(log n) range queries and updates." },
    { term: "Leaf layer", definition: "The bottom level [n, 2n) holding the original array elements." },
    { term: "Combine function", definition: "How two children merge into a parent (sum here; could be min, max, gcd)." },
    { term: "Point update", definition: "Setting one leaf and refreshing its ancestors up to the root." },
    { term: "Half-open interval", definition: "query(lo, hi) covers indices lo..hi-1; hi is exclusive." },
    { term: "Lazy propagation", definition: "An extension (not shown) enabling efficient range updates." },
  ],

  concepts: {
    purpose:
      "Answer range aggregate queries (including non-invertible ones like min/max) with point updates in O(log n).",
    operations:
      "Build bottom-up in O(n); update a leaf and refresh ancestors; query by climbing and adding boundary nodes that fall outside their parent segment.",
    uses:
      "Range sum/min/max/gcd with updates, competitive programming range problems, interval statistics; with lazy propagation, range updates.",
    tradeoffs:
      "More general than a Fenwick tree (handles non-invertible aggregates) but larger constant and more code; O(n) space either way.",
    commonMistakes:
      "Treating the interval as inclusive (it's half-open); wrong parent/child index math (2i, 2i+1, i//2); forgetting to refresh all ancestors on update; using a BIT when you actually need min/max.",
    edgeCases:
      "Empty range lo == hi returns 0. A single element is one leaf. query over the whole array climbs to the root's children.",
  },

  complexity: [
    { operation: "build", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)", note: "Fill n leaves, compute n-1 parents." },
    { operation: "point update", best: "O(log n)", average: "O(log n)", worst: "O(log n)", note: "Refresh ancestors along one root path." },
    { operation: "range query", best: "O(log n)", average: "O(log n)", worst: "O(log n)", note: "Visit O(log n) boundary nodes." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements (leaves) in the tree" }],
    costModel:
      "Each combine is O(1). Update and query move up the tree, halving the index each step, so they take a number of steps equal to the tree height.",
    time: {
      bound: "O(log n)",
      case: "worst",
      explanation:
        "The tree has height ⌈log₂ n⌉. Update walks from a leaf to the root refreshing one node per level → O(log n). Query climbs both boundaries, doing O(1) work per level and adding at most two boundary nodes each level → O(log n). Building is O(n): n leaf writes plus n−1 parent combines.",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation:
        "The tree array holds 2n entries (n leaves + n internal in this layout), so auxiliary space is O(n). The iterative query/update use O(1) extra variables (no recursion stack).",
      inputOutputNote: "The 2n-entry tree array IS the structure; each query returns an O(1) integer.",
    },
    derivation: [
      { lines: [7, 8, 9, 10], description: "Build: n leaf writes plus n-1 parent combines → O(n).", cost: "O(n)", dimension: "time" },
      { lines: [11, 12, 13, 14, 15, 16, 17], description: "Update refreshes one node per level up to the root.", cost: "O(log n)", dimension: "time" },
      { lines: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], description: "Query climbs both boundaries, O(1) per level.", cost: "O(log n)", dimension: "time" },
      { lines: [6], description: "A tree array of size 2n.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: [
      "The combine function is associative (sum here).",
      "Intervals are half-open: query(lo, hi) covers lo..hi-1.",
      "Index arithmetic uses the 2i / 2i+1 / i//2 layout.",
    ],
    tradeoffs:
      "A Fenwick tree is smaller/faster for invertible aggregates like sums; the segment tree generalizes to min/max/gcd and (with lazy propagation) range updates, at a larger constant and more code. Both are O(log n) per op and O(n) space.",
    counters: [
      { label: "build combines", definition: "executions of the parent-build line (line 10)", countLines: [10] },
      { label: "query climb steps", definition: "executions of the query loop body (line 22)", countLines: [22] },
    ],
    fixedDataNote:
      "Here n = 6, so the tree has height 3 and each query/update touches at most ~3 levels. The O(log n) bound describes how that grows with n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: range queries + point updates in O(log n)." },
    { line: 2, executable: false, explanation: "Comment: iterative array layout." },
    { line: 3, executable: true, explanation: "Define the SegTree class." },
    { line: 4, executable: true, explanation: "Constructor takes the initial data." },
    { line: 5, executable: true, explanation: "n = number of elements." },
    { line: 6, executable: true, explanation: "Allocate a tree array of size 2n." },
    { line: 7, executable: true, explanation: "Place each element as a leaf..." },
    { line: 8, executable: true, explanation: "...in the second half [n, 2n)." },
    { line: 9, executable: true, explanation: "Build internal nodes from n-1 down to 1..." },
    { line: 10, executable: true, explanation: "...each parent is the combine (sum) of its two children." },
    { line: 11, executable: true, explanation: "update(i, value): set position i." },
    { line: 12, executable: true, explanation: "Map index i to its leaf position i + n." },
    { line: 13, executable: true, explanation: "Store the new value at the leaf." },
    { line: 14, executable: true, explanation: "Move to the parent." },
    { line: 15, executable: true, explanation: "Walk up to the root refreshing ancestors." },
    { line: 16, executable: true, explanation: "Recompute this node from its children." },
    { line: 17, executable: true, explanation: "Continue to the parent." },
    { line: 18, executable: true, explanation: "query(lo, hi): sum of the half-open range [lo, hi)." },
    { line: 19, executable: true, explanation: "Result accumulator." },
    { line: 20, executable: true, explanation: "Map lo to the leaf layer." },
    { line: 21, executable: true, explanation: "Map hi to the leaf layer." },
    { line: 22, executable: true, explanation: "Climb while the range is non-empty." },
    { line: 23, executable: true, explanation: "If lo is a right child, it isn't fully covered by its parent..." },
    { line: 24, executable: true, explanation: "...so add it to the result..." },
    { line: 25, executable: true, explanation: "...and move lo past it." },
    { line: 26, executable: true, explanation: "If hi is a right child, the node hi-1 is inside the range..." },
    { line: 27, executable: true, explanation: "...step hi down..." },
    { line: 28, executable: true, explanation: "...and add that node." },
    { line: 29, executable: true, explanation: "Halve lo to move up a level." },
    { line: 30, executable: true, explanation: "Halve hi to move up a level." },
    { line: 31, executable: true, explanation: "Return the range sum." },
    { line: 32, executable: false, explanation: "Blank line." },
    { line: 33, executable: true, explanation: "Build a segment tree from the sample data." },
    { line: 34, executable: true, explanation: "query(0,4) = 3+2-1+6 = 10." },
    { line: 35, executable: true, explanation: "query(1,5) = 2-1+6+5 = 12." },
    { line: 36, executable: true, explanation: "Set index 2 to 3." },
    { line: 37, executable: true, explanation: "Now query(1,5) = 2+3+6+5 = 16." },
  ],

  bindings: [{ variable: "st", model: "object" }],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "Why choose a segment tree over a Fenwick tree, given the BIT is simpler?",
      answer: "Because the segment tree handles NON-invertible aggregates like range minimum/maximum/gcd, where the BIT's prefix(hi) - prefix(lo-1) trick doesn't work. It also extends (with lazy propagation) to efficient range updates. Use the BIT for plain prefix/point sums; use the segment tree for min/max/gcd or range updates.",
      explanation: "The BIT relies on invertibility for range = difference of prefixes. Min/max have no inverse, so you need per-segment aggregates — exactly what a segment tree stores.",
    },
  ],

  experiments: [
    "Change the combine from + to min (and initialize appropriately) to get range-minimum queries.",
    "Print st.tree after building to see leaves and internal sums.",
    "Count query climb steps for different ranges and relate them to log2(n).",
  ],

  exercises: [
    {
      id: "seg-complete-1",
      kind: "complete-code",
      prompt: "Complete the point update so all ancestors are refreshed.",
      starterCode:
        "def update(self, i, value):\n    i += self.n\n    self.tree[i] = value\n    i //= 2\n    while i >= 1:\n        # TODO: recompute this node, then move up\n        pass",
      expected:
        "def update(self, i, value):\n    i += self.n\n    self.tree[i] = value\n    i //= 2\n    while i >= 1:\n        self.tree[i] = self.tree[2 * i] + self.tree[2 * i + 1]\n        i //= 2",
      hints: [
        "Each ancestor is the combine of its two children.",
        "Recompute, then go to the parent with i //= 2.",
        "self.tree[i] = self.tree[2*i] + self.tree[2*i+1]; i //= 2",
      ],
    },
    {
      id: "seg-choose-1",
      kind: "choose-approach",
      prompt: "You need range-MINIMUM queries with point updates. Fenwick tree or segment tree — and why?",
      expected: "Segment tree: minimum is non-invertible, so a Fenwick tree can't answer arbitrary range minima via prefix differences. The segment tree stores per-segment minima and answers range-min in O(log n).",
      hints: [
        "Is minimum invertible?",
        "No — you can't subtract a min.",
        "Segment tree stores segment aggregates directly.",
      ],
    },
    {
      id: "seg-predict-1",
      kind: "predict-state",
      prompt: "For data [3,2,-1,6,5,4], what is query(1,5), and after update(2,3) what does query(1,5) return?",
      expected: "query(1,5) covers indices 1..4 = 2-1+6+5 = 12. After setting index 2 to 3, it is 2+3+6+5 = 16.",
      hints: [
        "The interval is half-open: 1..4.",
        "The update changes index 2 from -1 to 3.",
        "12 + 4 = 16.",
      ],
    },
  ],

  review: `A **segment tree** answers **range queries** (sum/min/max/gcd) with **point updates** in **O(log n)** and **O(n)** space, storing each node's aggregate over a contiguous **segment**. The iterative layout puts leaves in \`[n, 2n)\`, builds parents bottom-up in **O(n)**, updates by refreshing ancestors, and queries by climbing while adding boundary nodes that fall outside their parent's segment. Unlike a Fenwick tree it handles **non-invertible** aggregates. Intervals here are **half-open**. The example gives 10, 12, then 16.`,

  expectedOutput: "10\n12\n16\n",

  references: [
    {
      url: "https://cp-algorithms.com/data_structures/segment_tree.html",
      title: "Segment Tree — CP-Algorithms",
      section: "Iterative implementation; build, update, query complexity",
      topic: "range/segment",
      purpose: "Confirm the iterative 2n array layout, O(n) build, O(log n) update/query, and the boundary-node query logic.",
      verifiedClaims: [
        "A segment tree supports range queries and point updates in O(log n) with O(n) space.",
        "The iterative layout stores leaves in [n, 2n) and each internal node as the combine of its children.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://en.wikipedia.org/wiki/Segment_tree",
      title: "Segment tree — Wikipedia",
      section: "Definition; comparison with Fenwick tree",
      topic: "range/segment",
      purpose: "Cross-check that segment trees handle general (including non-invertible) aggregates, unlike the sum-oriented Fenwick tree.",
      verifiedClaims: [
        "Segment trees answer range queries for aggregates such as sum, minimum, and maximum.",
        "They are more general than Fenwick trees, which target invertible operations.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "37ccd62898f3b611",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
