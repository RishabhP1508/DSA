/**
 * Pattern: Union-Find (Disjoint Set Union).
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "True\nFalse\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# Union-Find (DSU): near-constant merge and "same group?" queries.
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))     # each element starts as its own root
        self.rank = [0] * n              # tree-height hint for balanced unions
    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]   # path compression
            x = self.parent[x]
        return x
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False                 # already in the same set
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra              # attach the shorter tree under the taller
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        return True

dsu = DSU(5)
dsu.union(0, 1)
dsu.union(1, 2)
dsu.union(3, 4)
print(dsu.find(0) == dsu.find(2))   # same set {0,1,2} -> True
print(dsu.find(0) == dsu.find(3))   # different sets -> False`;

export const unionFindPattern: PatternDefinition = {
  id: "union-find",
  title: "Union-Find (Disjoint Set Union)",
  category: "Graphs & trees",
  summary:
    "Maintain disjoint sets with near-constant union and 'same set?' queries using path compression and union by rank.",

  clues: [
    "You repeatedly MERGE groups and ask whether two elements are in the same group.",
    "Edges/connections arrive INCREMENTALLY (dynamic connectivity), or you detect cycles while adding edges.",
    "Phrases like 'number of connected components (with unions)', 'redundant connection', 'accounts merge', 'Kruskal's MST', 'friend circles'.",
  ],

  naiveApproach: `Re-running BFS/DFS for every 'are these connected?' query is **O(V+E) per query** — crippling when there are many queries or the graph keeps changing. Storing an explicit group id and relabeling on every merge is **O(n) per union**.`,

  whyItHelps: `A **Disjoint Set Union** stores each element's **parent**, forming trees where each tree is one set and its root is the set's representative. **find(x)** follows parents to the root; **union(a,b)** links one root under the other. Two optimizations make operations nearly O(1): **path compression** (flatten the path to the root during find) and **union by rank/size** (attach the smaller tree under the larger). Together they give an **inverse-Ackermann α(n)** amortized cost — effectively constant. This is the engine behind Kruskal's MST and dynamic-connectivity problems.`,

  conditions: [
    "The relation is an equivalence (reflexive, symmetric, transitive) — sets only ever MERGE, never split.",
    "Use BOTH path compression and union by rank/size for near-constant amortized cost.",
    "Elements map to integer indices (or use a dict-based parent map).",
  ],

  alternatives: [
    "DFS/BFS connected components — simpler when the graph is STATIC and you compute components once.",
    "Interval/graph-specific structures — when you also need path details, distances, or ordering (DSU only answers 'same set?').",
    "DSU can't efficiently SPLIT sets — if you must remove edges, consider offline processing in reverse or link-cut trees.",
  ],

  counterexamples: [
    "If you must DELETE connections and re-query, plain DSU can't undo unions — it only merges.",
    "'Shortest path' or 'distance between nodes' isn't a DSU query — it only tells membership, not paths.",
    "Skipping path compression / union by rank degrades operations toward O(n) per call.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "True\nFalse\n",
  complexityNote:
    "Nearly O(1) amortized per find/union — O(α(n)), inverse Ackermann — with path compression + union by rank. O(n) space for the parent and rank arrays.",

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of elements" },
      { symbol: "α(n)", meaning: "the inverse Ackermann function (≤ 4 for any practical n)" },
    ],
    costModel: "Disjoint-set with path compression (find) and union by rank. The two optimisations together give near-constant amortised cost per operation.",
    time: {
      bound: "O(α(n))",
      case: "amortized",
      explanation: "find (lines 6-10) walks to the root while halving the path (path compression); union (lines 11-20) attaches the shorter tree under the taller (union by rank). With both, any sequence of m operations runs in O(m·α(n)), so each find/union is O(α(n)) amortised — effectively constant.",
      otherCases: [
        { case: "worst", bound: "O(log n)", note: "A single operation without prior compression can be O(log n); the α(n) bound is amortised over a sequence." },
      ],
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "Two arrays of size n: `parent` and `rank`.",
      inputOutputNote: "The n elements' parent/rank arrays are the structure; queries return a boolean.",
    },
    derivation: [
      { lines: [7, 8, 9], description: "find walks to the root with path compression.", cost: "O(α(n)) amortized", dimension: "time" },
      { lines: [12, 15, 16, 17], description: "union by rank keeps trees shallow.", cost: "O(α(n)) amortized", dimension: "time" },
      { lines: [4, 5], description: "parent and rank arrays.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Both path compression AND union by rank are used — either alone gives a weaker bound (O(log n)).", "Array indexing is O(1)."],
    tradeoffs: "Without the optimisations, find/union degrade to O(n) (a linked chain). Union by rank alone gives O(log n); adding path compression gives the near-constant α(n).",
    counters: [{ label: "unions attempted", definition: "executions of the find pair in union (line 12)", countLines: [12] }],
    fixedDataNote: "Merging {0,1,2} and {3,4} then querying takes a handful of near-constant ops. The α(n) amortised bound generalises.",
  },

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: DSU for merge + same-group queries." },
    { line: 2, executable: true, explanation: "Define the DSU class." },
    { line: 3, executable: true, explanation: "Constructor for n elements." },
    { line: 4, executable: true, explanation: "Each element starts as its own root (singleton set)." },
    { line: 5, executable: true, explanation: "Rank hints keep union trees shallow." },
    { line: 6, executable: true, explanation: "find(x): locate x's set representative (root)." },
    { line: 7, executable: true, explanation: "Walk up until a node is its own parent." },
    { line: 8, executable: true, explanation: "Path compression: point x at its grandparent to flatten the tree." },
    { line: 9, executable: true, explanation: "Advance toward the root." },
    { line: 10, executable: true, explanation: "Return the root." },
    { line: 11, executable: true, explanation: "union(a, b): merge the sets containing a and b." },
    { line: 12, executable: true, explanation: "Find both roots." },
    { line: 13, executable: true, explanation: "If already the same set..." },
    { line: 14, executable: true, explanation: "...nothing to merge (also flags a cycle in Kruskal)." },
    { line: 15, executable: true, explanation: "Union by rank: ensure ra is the taller root..." },
    { line: 16, executable: true, explanation: "...by swapping if needed." },
    { line: 17, executable: true, explanation: "Attach the shorter tree under the taller root." },
    { line: 18, executable: true, explanation: "If ranks tied..." },
    { line: 19, executable: true, explanation: "...the merged tree grew by one level." },
    { line: 20, executable: true, explanation: "Report that a merge happened." },
    { line: 21, executable: false, explanation: "Blank line." },
    { line: 22, executable: true, explanation: "Build a DSU over 5 elements." },
    { line: 23, executable: true, explanation: "Merge 0 and 1." },
    { line: 24, executable: true, explanation: "Merge 1 and 2 (now {0,1,2})." },
    { line: 25, executable: true, explanation: "Merge 3 and 4 (now {3,4})." },
    { line: 26, executable: true, explanation: "0 and 2 share a root -> True." },
    { line: 27, executable: true, explanation: "0 and 3 are in different sets -> False." },
  ],

  bindings: [{ variable: "dsu", model: "object" }],

  linkedLessons: ["union-find", "kruskal", "connected-components"],

  exercises: [
    {
      id: "pat-uf-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Edges are added one by one; report when an edge first connects two already-connected nodes (a redundant edge).' Which pattern?",
      expected:
        "Union-Find: union each edge's endpoints; if find(a) == find(b) before the union, this edge is redundant (creates a cycle). Near-O(1) per operation with path compression + union by rank.",
      correctPatternId: "union-find",
      hints: [
        "Edges arrive incrementally.",
        "You test 'already connected?' repeatedly.",
        "union returns False when they're already merged.",
      ],
    },
    {
      id: "pat-uf-choose-1",
      kind: "choose-approach",
      prompt:
        "The graph is fixed and you need to count its connected components exactly once. Union-Find or DFS?",
      expected:
        "Either works, but DFS/BFS is simpler for a one-time static count (O(V+E)). Union-Find shines when edges are dynamic or you make many connectivity queries.",
      correctPatternId: "union-find",
      hints: [
        "Static + one-shot favors plain DFS.",
        "DSU's edge is dynamic/repeated queries.",
        "Both are O(V+E)-ish here.",
      ],
    },
    {
      id: "pat-uf-fix-1",
      kind: "fix-mistake",
      prompt:
        "This find has no path compression, so it degrades to O(n). Add compression.",
      starterCode:
        "def find(self, x):\n    while self.parent[x] != x:\n        x = self.parent[x]\n    return x",
      expected:
        "def find(self, x):\n    while self.parent[x] != x:\n        self.parent[x] = self.parent[self.parent[x]]\n        x = self.parent[x]\n    return x",
      hints: [
        "Long chains make find slow.",
        "Flatten the path as you walk up.",
        "Point each node at its grandparent.",
      ],
    },
  ],

  references: [
    {
      url: "https://cp-algorithms.com/data_structures/disjoint_set_union.html",
      title: "Disjoint Set Union — CP-Algorithms",
      section: "Path compression + union by rank; inverse-Ackermann complexity",
      topic: "patterns/union-find",
      purpose: "Confirm the DSU operations and the near-constant α(n) amortized cost with both optimizations.",
      verifiedClaims: [
        "With path compression and union by rank, DSU operations run in nearly O(1) amortized (inverse Ackermann).",
        "find returns a set representative; union merges two sets.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://algs4.cs.princeton.edu/15uf/",
      title: "Union–Find — Algorithms, 4th Edition (Princeton)",
      section: "Weighted quick-union with path compression",
      topic: "patterns/union-find",
      purpose: "Cross-check dynamic connectivity as the canonical DSU application and the balancing optimizations.",
      verifiedClaims: ["Weighted quick-union with path compression solves dynamic connectivity in near-constant time."],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "8885f8baffe3ce64",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
