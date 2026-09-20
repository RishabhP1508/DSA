/**
 * Pattern: Dijkstra (weighted shortest path).
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "[0, 3, 1, 4]\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `import heapq

# Dijkstra: shortest paths from a source in a NON-NEGATIVE weighted graph.
def dijkstra(adj, start, n):
    dist = [float("inf")] * n
    dist[start] = 0
    pq = [(0, start)]                    # min-heap of (distance, node)
    while pq:
        d, node = heapq.heappop(pq)      # closest unsettled node
        if d > dist[node]:
            continue                     # stale heap entry -> skip
        for nb, w in adj[node]:
            nd = d + w
            if nd < dist[nb]:            # relax: found a shorter route to nb
                dist[nb] = nd
                heapq.heappush(pq, (nd, nb))
    return dist

adj = {0: [(1, 4), (2, 1)], 1: [(3, 1)], 2: [(1, 2), (3, 5)], 3: []}
print(dijkstra(adj, 0, 4))  # 0->2->1->3 beats the direct 0->1`;

export const dijkstraPattern: PatternDefinition = {
  id: "dijkstra",
  title: "Dijkstra (Weighted Shortest Path)",
  category: "Graphs & trees",
  summary:
    "Find shortest paths in a non-negative weighted graph by always settling the closest unsettled node via a min-heap.",

  clues: [
    "A WEIGHTED graph with NON-NEGATIVE edge costs, and you need the cheapest path / minimum total cost.",
    "'Shortest' means lowest total weight, not fewest edges.",
    "Phrases like 'minimum cost to reach', 'cheapest route', 'network delay time', 'shortest path with weights'.",
  ],

  naiveApproach: `BFS finds fewest EDGES, which is wrong when edges have different weights (a longer hop count can be cheaper). Trying all paths is exponential. Repeatedly scanning every node for the current minimum distance (array-based Dijkstra) is **O(V²)** — fine for dense graphs but slow for sparse ones.`,

  whyItHelps: `Dijkstra keeps tentative distances and always **settles the closest unsettled node next** using a **min-heap** keyed by distance. When a node is popped with its recorded distance, that distance is **final** (correct precisely because weights are non-negative — nothing cheaper can arrive later). For each neighbor it **relaxes** the edge: if going through the current node is cheaper, update and push the new distance. Stale heap entries (a worse distance for an already-improved node) are skipped. With a binary heap this is **O((V + E) log V)** — the standard weighted shortest-path algorithm.`,

  conditions: [
    "All edge weights must be NON-NEGATIVE (a negative edge can invalidate an already-settled node).",
    "Skip stale heap entries (d > dist[node]) so each node is settled once.",
    "Relax edges: only update when a strictly shorter distance is found.",
  ],

  alternatives: [
    "BFS — for UNWEIGHTED graphs (all weights equal); simpler and O(V+E).",
    "0-1 BFS (deque) — when weights are only 0 or 1.",
    "Bellman–Ford — when NEGATIVE edges exist (O(V·E), also detects negative cycles).",
    "A* — Dijkstra plus a heuristic when you have a single target and a good distance estimate.",
  ],

  counterexamples: [
    "Using Dijkstra with negative edges can produce wrong distances — use Bellman–Ford.",
    "Using BFS on a weighted graph gives fewest edges, not cheapest cost.",
    "Forgetting the stale-entry skip doesn't break correctness here but wastes work re-processing nodes.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "[0, 3, 1, 4]\n",
  complexityNote:
    "O((V + E) log V) with a binary heap — each edge may push once, each node is popped once. O(V + E) space for distances, the graph, and the heap.",

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "V", meaning: "the number of vertices" },
      { symbol: "E", meaning: "the number of edges" },
    ],
    costModel: "Lazy-deletion Dijkstra: each relaxation may push a (dist, node) pair; the heap can hold up to O(E) entries, each push/pop O(log E) = O(log V) for simple graphs. Stale entries are skipped on pop.",
    time: {
      bound: "O((V + E) log V)",
      case: "worst",
      explanation: "Each edge can trigger at most one heap push (line 16), so up to O(E) pushes, each O(log V). Each vertex is settled once (its first pop); stale pops (line 10) are skipped. Summed, the heap work is O((V + E) log V).",
    },
    space: {
      bound: "O(V + E)",
      case: "worst",
      explanation: "The dist array is O(V); the heap can hold up to O(E) pending (dist, node) pairs.",
      inputOutputNote: "The adjacency structure (O(V + E)) is the input; dist (O(V)) is the result.",
    },
    derivation: [
      { lines: [9], description: "Each vertex is popped/settled once; stale pops skipped (line 10-11).", cost: "O(V log V)", dimension: "time" },
      { lines: [12, 13, 14, 16], description: "Each edge relaxation may push once — O(E) pushes, each O(log V).", cost: "O(E log V)", dimension: "time" },
      { lines: [5, 7], description: "dist array O(V) + heap up to O(E).", cost: "O(V + E)", dimension: "space" },
    ],
    assumptions: ["All edge weights are NON-NEGATIVE (Dijkstra's precondition; negatives need Bellman-Ford).", "Heap push/pop are O(log(size))."],
    tradeoffs: "A Fibonacci heap gives O(E + V log V); an array-scan Dijkstra is O(V²), better only for dense graphs. Bellman-Ford (O(V·E)) handles negative weights this heap version cannot.",
    counters: [{ label: "heap pops", definition: "executions of heappop (line 9)", countLines: [9] }],
    fixedDataNote: "This 4-vertex graph pops each settled node once plus any stale entries. The O((V+E) log V) bound generalises.",
  },

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import heapq for the priority queue." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: shortest paths, non-negative weights." },
    { line: 4, executable: true, explanation: "Define dijkstra(adj, start, n)." },
    { line: 5, executable: true, explanation: "All distances start at infinity." },
    { line: 6, executable: true, explanation: "The source's distance is 0." },
    { line: 7, executable: true, explanation: "Min-heap seeded with (0, start)." },
    { line: 8, executable: true, explanation: "Process until the heap empties." },
    { line: 9, executable: true, explanation: "Pop the closest unsettled node." },
    { line: 10, executable: true, explanation: "If this entry is stale (worse than known)..." },
    { line: 11, executable: true, explanation: "...skip it." },
    { line: 12, executable: true, explanation: "For each weighted neighbour..." },
    { line: 13, executable: true, explanation: "...compute the distance through the current node." },
    { line: 14, executable: true, explanation: "Relaxation: if it's shorter than the best known..." },
    { line: 15, executable: true, explanation: "...update the neighbour's distance..." },
    { line: 16, executable: true, explanation: "...and push the improved (distance, node)." },
    { line: 17, executable: true, explanation: "Return all shortest distances from the source." },
    { line: 18, executable: false, explanation: "Blank line." },
    { line: 19, executable: true, explanation: "A weighted adjacency list of (neighbour, weight)." },
    { line: 20, executable: true, explanation: "Distances from 0 are [0, 3, 1, 4] (0->2->1->3 beats direct 0->1)." },
  ],

  bindings: [
    { variable: "dist", model: "array" },
    { variable: "pq", model: "heap" },
  ],

  linkedLessons: ["dijkstra", "shortest-paths-unweighted", "bellman-ford", "min-max-heaps"],

  exercises: [
    {
      id: "pat-dij-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Find the minimum total travel time from a source to every city, given roads with positive times.' Which pattern?",
      expected:
        "Dijkstra: min-heap by distance, settle the closest city, relax its roads. Non-negative weights guarantee correctness. O((V+E) log V).",
      correctPatternId: "dijkstra",
      hints: [
        "Weighted edges, non-negative.",
        "Cheapest total, not fewest roads.",
        "Settle the closest node first via a heap.",
      ],
    },
    {
      id: "pat-dij-choose-1",
      kind: "choose-approach",
      prompt:
        "Some edges have NEGATIVE weights (e.g. currency arbitrage). Dijkstra or Bellman–Ford?",
      expected:
        "Bellman–Ford: it handles negative edges and detects negative cycles (O(V·E)). Dijkstra's 'closest is final' guarantee breaks with negative weights.",
      correctPatternId: "dijkstra",
      hints: [
        "Negative edges break Dijkstra.",
        "You may also need cycle detection.",
        "Bellman–Ford handles both.",
      ],
    },
    {
      id: "pat-dij-fix-1",
      kind: "fix-mistake",
      prompt:
        "This Dijkstra reprocesses stale heap entries. Add the skip that keeps each node settled once.",
      starterCode:
        "while pq:\n    d, node = heapq.heappop(pq)\n    for nb, w in adj[node]:\n        nd = d + w\n        if nd < dist[nb]:\n            dist[nb] = nd\n            heapq.heappush(pq, (nd, nb))",
      expected:
        "while pq:\n    d, node = heapq.heappop(pq)\n    if d > dist[node]:\n        continue\n    for nb, w in adj[node]:\n        nd = d + w\n        if nd < dist[nb]:\n            dist[nb] = nd\n            heapq.heappush(pq, (nd, nb))",
      hints: [
        "A node can sit in the heap with an outdated distance.",
        "Skip an entry whose distance is worse than the recorded one.",
        "if d > dist[node]: continue",
      ],
    },
  ],

  references: [
    {
      url: "https://cp-algorithms.com/graph/dijkstra.html",
      title: "Dijkstra's algorithm — CP-Algorithms",
      section: "Priority-queue implementation, relaxation, complexity",
      topic: "patterns/dijkstra",
      purpose: "Confirm the heap-based Dijkstra, O((V+E) log V), and the non-negative-weight requirement.",
      verifiedClaims: [
        "Dijkstra with a binary heap is O((V+E) log V) and requires non-negative edge weights.",
        "A node's distance is final when it is popped from the priority queue.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://algs4.cs.princeton.edu/44sp/",
      title: "Shortest Paths — Algorithms, 4th Edition (Princeton)",
      section: "Dijkstra's algorithm and edge relaxation",
      topic: "patterns/dijkstra",
      purpose: "Cross-check relaxation and the settled-when-popped property.",
      verifiedClaims: ["Dijkstra settles the nearest vertex first and relaxes its edges; correctness needs non-negative weights."],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "db513ddc58461a3a",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
