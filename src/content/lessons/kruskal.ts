/**
 * Lesson: Kruskal's algorithm (Graphs). Verified on CPython 3.14. Output: "4\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Kruskal: build an MST by adding the cheapest edges that don't form a cycle.
def kruskal(n, edges):
    edges = sorted(edges, key=lambda e: e[2])   # sort by weight ascending
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]        # path compression
            x = parent[x]
        return x
    total = 0
    for u, v, w in edges:
        ru, rv = find(u), find(v)
        if ru != rv:                # endpoints in different sets -> no cycle
            parent[ru] = rv         # union them
            total += w              # take this edge into the MST
    return total

edges = [(0, 1, 4), (0, 2, 1), (1, 2, 2), (1, 3, 1), (2, 3, 5)]
print(kruskal(4, edges))   # picks 0-2(1), 1-3(1), 1-2(2) = 4`;

export const kruskal: LessonDefinition = {
  id: "kruskal",
  title: "Kruskal's Algorithm (MST)",
  area: "Graphs",
  prerequisites: ["prim", "union-find", "interval-sorting"],

  explanation: `**Kruskal's algorithm** builds a **Minimum Spanning Tree** from the opposite direction to Prim: instead of growing one blob, it **considers edges globally, cheapest first, and adds each one unless it would form a cycle**. Sort all edges by weight ascending, then sweep: take an edge if its two endpoints are currently in **different components**, and skip it if they're already connected (adding it would create a cycle).

The engine for "are these two endpoints already connected?" is **Union-Find**: \`find\` gives each endpoint's set root, and if the roots differ you \`union\` them and keep the edge. This is why Kruskal pairs so naturally with the DSU lesson — it's the classic application. On the example, sorting gives edges of weight 1, 1, 2, 4, 5; Kruskal takes 0–2 (1), 1–3 (1), 1–2 (2) — total **4** — and rejects the rest as cycle-forming or redundant.

The cost is dominated by **sorting the edges: O(E log E)** (equivalently O(E log V), since E ≤ V²). The union-find operations add only near-linear O(E·α(V)). Space is **O(V + E)**. Kruskal shines on **sparse** graphs (few edges to sort) and when edges are given as a list; **Prim** suits dense graphs with adjacency lists. Both are greedy and both are provably optimal by the cut property. Cue: "connect everything at minimum cost, edges as a list, sparse graph" → Kruskal.`,

  vocabulary: [
    { term: "Kruskal's algorithm", definition: "Builds an MST by adding globally cheapest edges that don't create a cycle." },
    { term: "Edge sorting", definition: "Ordering all edges by weight ascending — the dominant step." },
    { term: "Cycle check via Union-Find", definition: "Endpoints with the same root are already connected; adding the edge would cycle." },
    { term: "Union", definition: "Merging the two endpoints' components when an edge is accepted." },
    { term: "Greedy + cut property", definition: "Taking the cheapest safe edge each time yields an optimal MST." },
  ],

  concepts: {
    purpose: "Build a minimum spanning tree by greedily choosing cheapest cycle-free edges globally.",
    operations: "Sort edges by weight; for each, if endpoints are in different sets, union them and take the edge.",
    uses: "Network/road/cable design, clustering (stop early for k clusters), minimum-cost connection.",
    tradeoffs: "O(E log E) dominated by sorting; ideal for sparse graphs and edge-list input, vs Prim for dense graphs.",
    commonMistakes: "Forgetting to sort edges first; not using union-find for the cycle check (O(V+E) per check otherwise); adding an edge whose endpoints share a root.",
    edgeCases: "A disconnected graph yields a minimum spanning FOREST (fewer than V-1 edges). Equal-weight edges: any order among them is fine. Parallel edges: the cheaper wins.",
  },

  complexity: [
    { operation: "Kruskal", best: "O(E log E)", average: "O(E log E)", worst: "O(E log E)", space: "O(V + E)", note: "Sorting dominates; union-find adds O(E·α(V)) ≈ linear." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "V", meaning: "the number of vertices" },
      { symbol: "E", meaning: "the number of edges" },
    ],
    costModel: "Sorting E edges is O(E log E). Each edge triggers two finds and possibly a union, each amortized O(α(V)) ≈ O(1).",
    time: {
      bound: "O(E log E)",
      case: "worst",
      explanation: "Sorting all E edges by weight is O(E log E), and this dominates. The sweep then does O(E) iterations, each with a constant number of union-find operations at amortized O(α(V)) — effectively O(1) — so the union-find work is O(E·α(V)), near-linear. Total: O(E log E), which equals O(E log V) since E ≤ V² makes log E = O(log V). Compared to Prim's O(E log V), Kruskal is typically preferred when the graph is sparse or edges come as a list to sort.",
    },
    space: {
      bound: "O(V + E)",
      case: "worst",
      explanation: "The union-find parent array is O(V), and the sorted edge list is O(E). Sorting may use O(E) auxiliary space.",
      inputOutputNote: "The edge list (E) is the input; the parent array (V) and sorted edges are the auxiliary structures.",
    },
    derivation: [
      { lines: [3], description: "Sorting all E edges by weight — the dominant O(E log E).", cost: "O(E log E)", dimension: "time" },
      { lines: [11, 12, 13, 14, 15], description: "Sweep edges; each does union-find ops at amortized O(α(V)).", cost: "O(E)", dimension: "time" },
      { lines: [4], description: "The union-find parent array is O(V); sorted edges O(E).", cost: "O(V + E)", dimension: "space" },
    ],
    assumptions: ["Comparisons for sorting are O(1).", "Union-find uses path compression (amortized O(α(V)) per op).", "Endpoints in the same set ⇒ the edge would form a cycle."],
    tradeoffs: "Prim is O(E log V) growing one component from an adjacency list (better for dense graphs); Kruskal is O(E log E) sorting a global edge list (better for sparse graphs). Both yield an optimal MST.",
    counters: [{ label: "edges accepted", definition: "unions performed / edges taken (line 14)", countLines: [14] }],
    fixedDataNote: "This run sorts 5 edges and accepts 0-2(1), 1-3(1), 1-2(2) for MST weight 4. The O(E log E) bound generalises to any graph.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: add cheapest cycle-free edges." },
    { line: 2, executable: true, explanation: "Define kruskal(n, edges)." },
    { line: 3, executable: true, explanation: "Sort all edges by weight ascending (the dominant step)." },
    { line: 4, executable: true, explanation: "Union-find parent array: each vertex is its own set." },
    { line: 5, executable: true, explanation: "find(x): the root of x's component." },
    { line: 6, executable: true, explanation: "Climb to the root..." },
    { line: 7, executable: true, explanation: "...with path compression for speed..." },
    { line: 8, executable: true, explanation: "...moving up each step." },
    { line: 9, executable: true, explanation: "Return the root." },
    { line: 10, executable: true, explanation: "Running MST total." },
    { line: 11, executable: true, explanation: "Sweep edges cheapest-first." },
    { line: 12, executable: true, explanation: "Find both endpoints' roots." },
    { line: 13, executable: true, explanation: "If the roots differ, the endpoints are in different sets (no cycle)." },
    { line: 14, executable: true, explanation: "Union the sets (accept the edge)." },
    { line: 15, executable: true, explanation: "Add the edge's weight to the MST." },
    { line: 16, executable: true, explanation: "Return the total MST weight." },
    { line: 17, executable: false, explanation: "Blank line." },
    { line: 18, executable: true, explanation: "An edge list (undirected, weighted)." },
    { line: 19, executable: true, explanation: "kruskal(4, edges) → 4 (edges 0-2, 1-3, 1-2)." },
  ],

  bindings: [
    { variable: "parent", model: "array" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "In Kruskal, how does Union-Find decide whether to keep an edge, and what would happen without it?", answer: "It checks whether the edge's endpoints already share a root (same component); if so the edge would form a cycle and is skipped, otherwise it's kept and the sets are unioned. Without union-find, each cycle check would need an O(V+E) traversal, making Kruskal much slower.", explanation: "Union-Find answers 'are these connected?' in amortized O(α(V)). That constant-time cycle test is exactly what lets Kruskal sweep sorted edges efficiently; a traversal-based check per edge would dominate the cost." },
  ],

  experiments: [
    "Record which edges are accepted and confirm there are V-1 of them for a connected graph.",
    "Make the graph disconnected and observe a spanning forest (fewer than V-1 edges).",
    "Compare Kruskal's MST weight with Prim's on the same graph (they match).",
  ],

  exercises: [
    {
      id: "kru-choose-1",
      kind: "choose-approach",
      prompt: "For a SPARSE graph given as an edge list, Prim or Kruskal? What dominates Kruskal's cost?",
      expected: "Kruskal — it sorts the edge list (O(E log E)) and uses union-find for near-linear cycle checks, ideal for sparse graphs / edge-list input. Sorting the edges dominates its cost.",
      hints: ["Sparse + edge list favours which?", "Kruskal sorts edges globally.", "Sorting E edges (O(E log E)) dominates."],
    },
    {
      id: "kru-fix-1",
      kind: "fix-mistake",
      prompt: "This Kruskal forgets to sort the edges, so it doesn't build a minimum tree. Add the sort.",
      starterCode: "def kruskal(n, edges):\n    parent = list(range(n))\n    # ... find/union ...\n    total = 0\n    for u, v, w in edges:\n        # take cheapest cycle-free edges\n        pass\n    return total",
      expected: "def kruskal(n, edges):\n    edges = sorted(edges, key=lambda e: e[2])\n    parent = list(range(n))\n    # ... find/union ...\n    total = 0\n    for u, v, w in edges:\n        # take cheapest cycle-free edges\n        pass\n    return total",
      hints: ["Kruskal must consider edges cheapest-first.", "Sort by the weight (third element).", "edges = sorted(edges, key=lambda e: e[2])"],
    },
  ],

  review: `**Kruskal's algorithm** builds an MST by sorting edges **cheapest-first** and adding each edge whose endpoints are in **different components** (a **Union-Find** cycle check), unioning them. Cost is **O(E log E)** — dominated by the sort — with union-find adding near-linear O(E·α(V)); space is **O(V + E)**. It's the sparse-graph / edge-list counterpart to Prim, both optimal by the cut property. Cue: "min-cost connect all, edges as a list, sparse" → Kruskal.`,

  expectedOutput: "4\n",

  references: [
    {
      url: "https://cp-algorithms.com/graph/mst_kruskal.html",
      title: "Minimum spanning tree - Kruskal's algorithm — CP-Algorithms",
      section: "Sorting + DSU, complexity",
      topic: "graphs/kruskal",
      purpose: "Confirm Kruskal sorts edges and uses DSU for cycle checks in O(E log E).",
      verifiedClaims: ["Kruskal sorts edges (O(E log E)) and uses union-find for near-linear cycle detection"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://algs4.cs.princeton.edu/43mst/",
      title: "Minimum Spanning Trees — Algorithms, 4th Edition (Princeton)",
      section: "Kruskal's algorithm",
      topic: "graphs/kruskal",
      purpose: "Cross-check the greedy edge-sorting approach and its optimality via the cut property.",
      verifiedClaims: ["Kruskal adds cheapest non-cycle edges and is optimal by the cut property"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 15,
    contentHash: "c1d789035ba87ef0",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
