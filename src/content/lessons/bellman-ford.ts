/**
 * Lesson: Bellman-Ford (Graphs). Verified on CPython 3.14. Output: "[0, 3, 1, 4]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Bellman-Ford: shortest paths that TOLERATE negative edge weights.
def bellman_ford(edges, n, start):
    dist = [float("inf")] * n
    dist[start] = 0
    # Relax ALL edges V-1 times; that's enough for any shortest path.
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] != float("inf") and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    # (A further pass that still relaxes an edge would signal a negative cycle.)
    return dist

edges = [(0, 1, 4), (0, 2, 1), (2, 1, 2), (1, 3, 1), (2, 3, 5)]
print(bellman_ford(edges, 4, 0))`;

export const bellmanFord: LessonDefinition = {
  id: "bellman-ford",
  title: "Bellman-Ford Algorithm",
  area: "Graphs",
  prerequisites: ["dijkstra"],

  explanation: `**Bellman–Ford** computes single-source shortest paths like Dijkstra, but it works with **negative edge weights** — the case Dijkstra can't handle — and it can **detect negative cycles**. The price is speed: it's **O(V·E)**, slower than Dijkstra's O((V+E) log V).

The idea is repeated **relaxation**. A shortest path in a graph with V vertices uses at most **V−1 edges** (any more would repeat a vertex, i.e. a cycle). So if you relax **every edge** V−1 times, each pass guarantees that shortest paths using one more edge become correct; after V−1 passes, all shortest distances are final. Here the direct 0→1 edge (weight 4) loses to 0→2→1 (1+2=3), giving \`[0, 3, 1, 4]\` — the same answer Dijkstra found on this non-negative example, but Bellman–Ford would also be correct if some edge were negative.

**Negative-cycle detection** is a bonus: after V−1 passes distances should be stable, so if a **V-th pass can still relax an edge**, a negative-weight cycle is reachable (its total cost has no lower bound). The recognition rule completes: **non-negative weights → Dijkstra (faster); negative edges or need to detect negative cycles → Bellman–Ford.**`,

  vocabulary: [
    { term: "Bellman-Ford", definition: "Single-source shortest paths allowing negative edges, via V-1 rounds of relaxation." },
    { term: "Relaxation", definition: "dist[v] = min(dist[v], dist[u] + w) for edge u→v." },
    { term: "V-1 passes", definition: "A shortest path uses at most V-1 edges, so V-1 full relaxation rounds suffice." },
    { term: "Negative cycle", definition: "A cycle whose total weight is negative; makes shortest paths undefined." },
    { term: "Cycle detection pass", definition: "A V-th pass that can still relax an edge signals a negative cycle." },
  ],

  concepts: {
    purpose: "Find shortest paths with negative edges and detect negative cycles, where Dijkstra can't.",
    operations: "Relax all edges V-1 times; an extra relaxable pass reveals a negative cycle.",
    uses: "Currency arbitrage, graphs with penalties/negative costs, negative-cycle detection, routing protocols (distance-vector).",
    tradeoffs: "Handles negatives and detects negative cycles, but O(V·E) — slower than Dijkstra's O((V+E) log V).",
    commonMistakes: "Relaxing from an unreached vertex (guard dist[u] != inf); doing fewer than V-1 passes; forgetting negative-cycle detection; using it when Dijkstra (faster) suffices.",
    edgeCases: "Unreachable vertices stay infinity. A negative cycle makes some distances undefined (detected on the V-th pass). Early termination possible if a pass changes nothing.",
  },

  complexity: [
    { operation: "Bellman-Ford", best: "O(V*E)", average: "O(V*E)", worst: "O(V*E)", space: "O(V)", note: "V-1 passes over all E edges; handles negative weights." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "V", meaning: "the number of vertices" },
      { symbol: "E", meaning: "the number of edges" },
    ],
    costModel: "Each relaxation is O(1). The algorithm does V-1 passes, each relaxing all E edges.",
    time: {
      bound: "O(V*E)",
      case: "worst",
      explanation: "The outer loop runs V-1 times (one pass per possible path length), and each pass relaxes all E edges — O(V·E). The V-1 bound comes from the fact that a shortest path visits at most V vertices, hence at most V-1 edges, so V-1 rounds propagate distances fully. This is slower than Dijkstra's O((V+E) log V), the cost of tolerating negative weights. (An extra pass for negative-cycle detection is one more O(E), not changing the class.)",
    },
    space: {
      bound: "O(V)",
      case: "worst",
      explanation: "Only the distance array of size V is kept; the edge list is the input. No priority queue or extra structures.",
      inputOutputNote: "The edge list (E) is the input; the distance array (V) is the auxiliary result.",
    },
    derivation: [
      { lines: [6], description: "V-1 relaxation passes.", cost: "O(V)", dimension: "time" },
      { lines: [7, 8, 9], description: "Each pass relaxes all E edges — O(E) per pass, O(V·E) total.", cost: "O(V*E)", dimension: "time" },
      { lines: [3], description: "One distance array of size V.", cost: "O(V)", dimension: "space" },
    ],
    assumptions: ["Relaxations are O(1).", "V-1 passes suffice because a shortest path has at most V-1 edges.", "Guard against relaxing from unreached (infinity) vertices."],
    tradeoffs: "Dijkstra is faster (O((V+E) log V)) but fails on negative edges; Bellman–Ford is O(V·E) but handles negatives and detects negative cycles. Use Dijkstra unless negatives are present.",
    counters: [],
    fixedDataNote: "This run computes [0, 3, 1, 4] from source 0 (no negatives here, matching Dijkstra). The O(V·E) bound is the cost of the general negative-tolerant method.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: tolerates negative edge weights." },
    { line: 2, executable: true, explanation: "Define bellman_ford(edges, n, start)." },
    { line: 3, executable: true, explanation: "All distances start at infinity." },
    { line: 4, executable: true, explanation: "The source's distance is 0." },
    { line: 5, executable: false, explanation: "Comment: V-1 relaxation passes suffice." },
    { line: 6, executable: true, explanation: "Repeat V-1 times." },
    { line: 7, executable: true, explanation: "For every directed edge (u, v, w)..." },
    { line: 8, executable: true, explanation: "...if u is reachable and going through it is cheaper..." },
    { line: 9, executable: true, explanation: "...relax: update dist[v]." },
    { line: 10, executable: false, explanation: "Comment: a further relaxable pass would mean a negative cycle." },
    { line: 11, executable: true, explanation: "Return the shortest distances." },
    { line: 12, executable: false, explanation: "Blank line." },
    { line: 13, executable: true, explanation: "An edge list (directed, weighted)." },
    { line: 14, executable: true, explanation: "Distances from 0 → [0, 3, 1, 4]." },
  ],

  bindings: [
    { variable: "dist", model: "array" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why exactly V-1 relaxation passes, and how does a V-th pass detect a negative cycle?", answer: "A shortest path uses at most V-1 edges, so V-1 passes propagate all shortest distances. If a V-th pass can still relax some edge, distances aren't stable — only a reachable negative-weight cycle allows that, so it's detected.", explanation: "With no negative cycle, distances are final after V-1 passes (paths can't exceed V-1 edges). Any further improvement implies a cycle whose total weight is negative, which the extra pass reveals." },
  ],

  experiments: [
    "Add a negative edge and confirm Bellman–Ford still gives correct shortest paths.",
    "Create a negative cycle and add the V-th detection pass to flag it.",
    "Add early termination when a pass makes no changes.",
  ],

  exercises: [
    {
      id: "bf-choose-1",
      kind: "choose-approach",
      prompt: "A graph has some negative edge weights (but no negative cycle). Dijkstra or Bellman–Ford? What's the complexity trade-off?",
      expected: "Bellman–Ford — Dijkstra is incorrect with negative edges. Bellman–Ford is O(V·E) (slower than Dijkstra's O((V+E) log V)) but correct, and it can also detect negative cycles.",
      hints: ["Does Dijkstra tolerate negative edges?", "No — it can be wrong.", "Bellman–Ford handles negatives at O(V·E)."],
    },
    {
      id: "bf-complete-1",
      kind: "complete-code",
      prompt: "Add negative-cycle detection: return None if a V-th pass can still relax an edge.",
      starterCode: "def bellman_ford(edges, n, start):\n    dist = [float('inf')] * n\n    dist[start] = 0\n    for _ in range(n - 1):\n        for u, v, w in edges:\n            if dist[u] != float('inf') and dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n    # TODO: one more pass; if any edge still relaxes, return None\n    return dist",
      expected: "def bellman_ford(edges, n, start):\n    dist = [float('inf')] * n\n    dist[start] = 0\n    for _ in range(n - 1):\n        for u, v, w in edges:\n            if dist[u] != float('inf') and dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n    for u, v, w in edges:\n        if dist[u] != float('inf') and dist[u] + w < dist[v]:\n            return None\n    return dist",
      hints: ["Do one extra relaxation pass.", "If any edge can still improve, a negative cycle exists.", "return None on a successful relaxation in the extra pass."],
    },
  ],

  review: `**Bellman–Ford** finds single-source shortest paths tolerating **negative edges** by relaxing **all edges V−1 times** (a shortest path has ≤ V−1 edges). A further relaxable pass **detects a negative cycle**. It's **O(V·E)** time / **O(V)** space — slower than Dijkstra but more general. Rule: **non-negative → Dijkstra (faster); negative edges / detect negative cycle → Bellman–Ford.**`,

  expectedOutput: "[0, 3, 1, 4]\n",

  references: [
    {
      url: "https://cp-algorithms.com/graph/bellman_ford.html",
      title: "Bellman-Ford algorithm — CP-Algorithms",
      section: "Relaxation, V-1 passes, negative cycle detection",
      topic: "graphs/bellman-ford",
      purpose: "Confirm the V-1 relaxation rounds, O(V·E) complexity, negative-weight support, and negative-cycle detection.",
      verifiedClaims: ["Bellman-Ford is O(V·E), handles negative edges, and detects negative cycles via an extra pass"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://algs4.cs.princeton.edu/44sp/",
      title: "Shortest Paths — Algorithms, 4th Edition (Princeton)",
      section: "Bellman-Ford",
      topic: "graphs/bellman-ford",
      purpose: "Cross-check the shortest-path-has-at-most-V-1-edges argument and negative-cycle handling.",
      verifiedClaims: ["V-1 passes suffice because shortest paths use at most V-1 edges"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "f332f8640ae28309",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
