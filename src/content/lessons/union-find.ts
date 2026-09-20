/**
 * Lesson: Union-Find (Graphs). Verified on CPython 3.14.
 * Output: "2\nTrue\nFalse\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))   # each node starts as its own root
        self.rank = [0] * n            # tree height hint for balancing
        self.count = n                 # number of disjoint sets
    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]  # path compression
            x = self.parent[x]
        return x
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False               # already connected
        if self.rank[ra] < self.rank[rb]:   # union by rank: attach smaller tree
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        self.count -= 1
        return True

uf = UnionFind(5)
uf.union(0, 1)
uf.union(1, 2)
uf.union(3, 4)
print(uf.count)                        # {0,1,2} and {3,4} -> 2 sets
print(uf.find(0) == uf.find(2))        # connected -> True
print(uf.find(0) == uf.find(3))        # different sets -> False`;

export const unionFind: LessonDefinition = {
  id: "union-find",
  title: "Union-Find (Disjoint Set Union)",
  area: "Graphs",
  prerequisites: ["connected-components"],

  explanation: `**Union-Find** (a.k.a. Disjoint Set Union, DSU) tracks a collection of **disjoint sets** and supports two operations blazingly fast: **find(x)** returns a representative "root" for x's set, and **union(a, b)** merges the two sets containing a and b. Two elements are in the same set exactly when they share a root. It's the go-to structure for **dynamic connectivity** — answering "are these connected?" as edges are added incrementally.

Each set is a tree of parent pointers; the root points to itself. Two optimizations make it nearly constant time. **Path compression** (in \`find\`) flattens the tree by pointing nodes closer to the root as you climb. **Union by rank** attaches the shorter tree under the taller one, keeping trees shallow. Together they give an amortized cost of **O(α(n))** per operation — where α is the inverse Ackermann function, effectively ≤ 4 for any realistic n, so **practically constant**.

Here, unioning {0,1,2} and {3,4} leaves \`count = 2\` sets; \`find(0) == find(2)\` is True (connected), \`find(0) == find(3)\` is False (separate). Union-Find shines where traversal-based component counting struggles: **incrementally arriving edges** (add an edge → one union, no re-traversal), and it's the backbone of **Kruskal's MST** (a later lesson) for detecting cycles. The cue: dynamic "connect / are-connected" queries → Union-Find.`,

  vocabulary: [
    { term: "Disjoint sets", definition: "A partition of elements into non-overlapping groups." },
    { term: "find(x)", definition: "Returns the representative root of x's set; equal roots ⇒ same set." },
    { term: "union(a, b)", definition: "Merges the sets containing a and b." },
    { term: "Path compression", definition: "Flattening the tree during find so future finds are faster." },
    { term: "Union by rank/size", definition: "Attaching the smaller/shorter tree under the larger to stay shallow." },
    { term: "Inverse Ackermann α(n)", definition: "A function ≤ ~4 for all practical n; the amortized cost per op." },
  ],

  concepts: {
    purpose: "Maintain disjoint sets with near-constant-time merge and connectivity queries as edges arrive.",
    operations: "find (with path compression), union (by rank/size); track set count.",
    uses: "Dynamic connectivity, Kruskal's MST cycle check, grouping/equivalence, percolation, account merging.",
    tradeoffs: "Amortized O(α(n)) ≈ O(1) per op; excellent for incremental edges but doesn't give paths or handle deletions.",
    commonMistakes: "Omitting path compression / union by rank (degrades toward O(n) per op); comparing elements instead of roots; forgetting union returns whether a merge happened (cycle check).",
    edgeCases: "union of already-connected elements is a no-op (returns False, useful for cycle detection). Each element starts in its own set. No efficient split/delete.",
  },

  complexity: [
    { operation: "find / union", best: "O(1)", average: "O(α(n))", worst: "O(α(n))", space: "O(n)", note: "Amortized inverse-Ackermann with both optimizations — effectively constant." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements" }],
    costModel: "find climbs parent pointers (shortened by path compression); union does two finds plus O(1) pointer updates.",
    time: {
      bound: "O(α(n))",
      case: "amortized",
      explanation: "With BOTH path compression (in find) and union by rank, each find/union is amortized O(α(n)), where α is the inverse Ackermann function — a quantity that is ≤ 4 for any n you could ever store, so it's effectively constant. Without these optimizations, trees can grow to height O(n) and operations degrade to O(n); the two tricks are what keep it near-constant. A sequence of m operations on n elements is O(m·α(n)).",
      otherCases: [
        { case: "worst", bound: "O(log n)", note: "With only one of the two optimizations, a single operation can be up to O(log n)." },
      ],
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "Two arrays of size n (parent and rank), plus the count — O(n) total.",
      inputOutputNote: "The parent/rank arrays are the data structure; O(n) is inherent to tracking n elements.",
    },
    derivation: [
      { lines: [6, 7, 8, 9, 10], description: "find climbs to the root, flattening the path (compression) — amortized O(α(n)).", cost: "O(α(n))", dimension: "time" },
      { lines: [11, 12, 15, 16, 17, 18], description: "union does two finds and O(1) rank-based linking.", cost: "O(α(n))", dimension: "time" },
      { lines: [3, 4], description: "parent and rank arrays of size n.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Both path compression and union by rank are applied.", "Array indexing is O(1)."],
    tradeoffs: "Vs BFS/DFS component counting (O(V+E) per query), Union-Find handles incremental edges in amortized O(α) per union — far better for a stream of connections — but can't reconstruct paths or efficiently delete edges.",
    counters: [],
    fixedDataNote: "This run does 3 unions on 5 elements, leaving 2 sets; connectivity queries confirm {0,1,2} vs {3,4}. Each op is amortized O(α(n)) ≈ O(1).",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Define the UnionFind class." },
    { line: 2, executable: true, explanation: "Constructor for n elements." },
    { line: 3, executable: true, explanation: "parent[i] = i: each element is initially its own root." },
    { line: 4, executable: true, explanation: "rank hints at tree height for balancing." },
    { line: 5, executable: true, explanation: "count = number of disjoint sets." },
    { line: 6, executable: true, explanation: "find(x): climb to the root of x's set." },
    { line: 7, executable: true, explanation: "While x is not its own parent..." },
    { line: 8, executable: true, explanation: "...point x to its grandparent (path compression flattens the tree)..." },
    { line: 9, executable: true, explanation: "...and move up." },
    { line: 10, executable: true, explanation: "Return the root." },
    { line: 11, executable: true, explanation: "union(a, b): merge their sets." },
    { line: 12, executable: true, explanation: "Find both roots." },
    { line: 13, executable: true, explanation: "If already the same root, they're connected..." },
    { line: 14, executable: true, explanation: "...so no merge happens (returns False — useful for cycle detection)." },
    { line: 15, executable: true, explanation: "Union by rank: ensure ra is the taller tree..." },
    { line: 16, executable: true, explanation: "...swapping if needed." },
    { line: 17, executable: true, explanation: "Attach the shorter tree's root under the taller." },
    { line: 18, executable: true, explanation: "If ranks were equal, the merged tree grew by one." },
    { line: 19, executable: true, explanation: "Bump the rank." },
    { line: 20, executable: true, explanation: "One fewer disjoint set." },
    { line: 21, executable: true, explanation: "Return True (a merge occurred)." },
    { line: 22, executable: false, explanation: "Blank line." },
    { line: 23, executable: true, explanation: "Create a Union-Find over 5 elements." },
    { line: 24, executable: true, explanation: "Merge 0 and 1." },
    { line: 25, executable: true, explanation: "Merge 1 and 2 (now {0,1,2})." },
    { line: 26, executable: true, explanation: "Merge 3 and 4 (now {3,4})." },
    { line: 27, executable: true, explanation: "count → 2 disjoint sets." },
    { line: 28, executable: true, explanation: "0 and 2 share a root → True." },
    { line: 29, executable: true, explanation: "0 and 3 are in different sets → False." },
  ],

  bindings: [
    { variable: "uf", model: "object" },
    { variable: "parent", model: "array" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "What do path compression and union by rank together achieve, and why not omit them?", answer: "Together they keep the trees nearly flat, giving amortized O(α(n)) ≈ O(1) per operation. Omitting them lets trees grow to O(n) height, degrading find/union toward O(n).", explanation: "Path compression shortens paths during find; union by rank avoids tall trees on merge. Without them, chains of unions can build linear-height trees, so each find becomes slow — the optimizations are what make DSU near-constant." },
  ],

  experiments: [
    "Remove path compression and reason about how tall the trees could get.",
    "Use union's return value to detect a cycle while adding edges.",
    "Track count after each union to watch components merge.",
  ],

  exercises: [
    {
      id: "uf-choose-1",
      kind: "choose-approach",
      prompt: "Edges are added one at a time and after each you must answer 'are u and v connected?'. Union-Find or repeated BFS/DFS? Complexity?",
      expected: "Union-Find: each union and connectivity query is amortized O(α(n)) ≈ O(1), so a stream of edges/queries is near-linear. Repeated BFS/DFS is O(V + E) per query — far slower for many incremental operations.",
      hints: ["Edges arrive incrementally.", "Re-traversing per query is expensive.", "Union-Find answers connectivity in ~O(1) amortized."],
    },
    {
      id: "uf-complete-1",
      kind: "complete-code",
      prompt: "Complete find with path compression (point each node to its grandparent).",
      starterCode: "def find(self, x):\n    while self.parent[x] != x:\n        # TODO: path compression, then move up\n        pass\n    return x",
      expected: "def find(self, x):\n    while self.parent[x] != x:\n        self.parent[x] = self.parent[self.parent[x]]\n        x = self.parent[x]\n    return x",
      hints: ["Point x to its grandparent to flatten.", "Then advance x upward.", "self.parent[x] = self.parent[self.parent[x]]; x = self.parent[x]"],
    },
  ],

  review: `**Union-Find (DSU)** maintains disjoint sets with **find** (representative root) and **union** (merge). With **path compression** + **union by rank**, each operation is amortized **O(α(n))** — effectively constant — using **O(n)** space. It excels at **dynamic connectivity** (incremental edges) where traversal would re-scan the whole graph, and it's the cycle-check backbone of **Kruskal's MST**. Cue: dynamic "connect / are-connected" → Union-Find.`,

  expectedOutput: "2\nTrue\nFalse\n",

  references: [
    {
      url: "https://cp-algorithms.com/data_structures/disjoint_set_union.html",
      title: "Disjoint Set Union — CP-Algorithms",
      section: "Path compression and union by rank/size",
      topic: "graphs/union-find",
      purpose: "Confirm the DSU operations and the amortized O(α(n)) complexity with both optimizations.",
      verifiedClaims: ["With path compression and union by rank, DSU operations are amortized O(α(n))"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://algs4.cs.princeton.edu/15uf/",
      title: "Union-Find — Algorithms, 4th Edition (Princeton)",
      section: "Weighted quick-union with path compression",
      topic: "graphs/union-find",
      purpose: "Cross-check dynamic connectivity semantics and near-constant amortized cost.",
      verifiedClaims: ["Weighted quick-union with path compression makes operations nearly constant amortized"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "868e77cf56d4aab3",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
