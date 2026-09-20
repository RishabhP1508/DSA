/**
 * Lesson: Shortest paths (unweighted, Graphs). Verified on CPython 3.14.
 * Output: "3\n0\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `from collections import deque

# Shortest path in an UNWEIGHTED graph = fewest edges = BFS distance.
def shortest_path(adj, start, target):
    dist = {start: 0}
    q = deque([start])
    while q:
        node = q.popleft()
        if node == target:        # first time we pop target = shortest
            return dist[node]
        for nb in adj[node]:
            if nb not in dist:    # record distance on first (nearest) reach
                dist[nb] = dist[node] + 1
                q.append(nb)
    return -1                     # target unreachable

g = {0: [1, 2], 1: [0, 3], 2: [0, 3], 3: [1, 2, 4], 4: [3]}
print(shortest_path(g, 0, 4))     # 0 -> 1 -> 3 -> 4 = 3 edges
print(shortest_path(g, 0, 0))     # start == target = 0`;

export const shortestPathsUnweighted: LessonDefinition = {
  id: "shortest-paths-unweighted",
  title: "Shortest Paths (Unweighted)",
  area: "Graphs",
  prerequisites: ["graph-bfs"],

  explanation: `In an **unweighted** graph, the shortest path between two vertices is simply the one with the **fewest edges** — and **BFS computes exactly that**. Because BFS explores vertices in order of increasing distance from the start, the **first time** it reaches a vertex is necessarily via a shortest path. So you record each vertex's distance the moment you discover it, and the first time you pop the target, its recorded distance is the answer.

This is BFS's defining superpower: no extra machinery beyond a distance map (or array) alongside the visited logic. Here the shortest path from 0 to 4 is \`0 → 1 → 3 → 4\` = **3 edges**; from 0 to itself is **0**. To recover the actual *path* (not just its length), store a **parent** pointer for each vertex as you discover it, then walk parents backward from the target.

It runs in **O(V + E)** time and **O(V)** space — the same as plain BFS. The critical caveat, and a common trap: **this only works when all edges cost the same.** The moment edges have **different weights**, "fewest edges" ≠ "lowest total cost," and BFS gives the wrong answer — you need **Dijkstra** (a later lesson) for non-negative weights. The recognition rule: **unweighted (or all-equal weights) → BFS; weighted → Dijkstra/Bellman–Ford.**`,

  vocabulary: [
    { term: "Unweighted shortest path", definition: "The path with the fewest edges between two vertices." },
    { term: "BFS distance", definition: "The number of edges from the start, computed by the order BFS reaches a vertex." },
    { term: "First-reach = shortest", definition: "BFS's distance-order guarantee: the first time it reaches a vertex is via a shortest path." },
    { term: "Parent pointer", definition: "A record of where each vertex was discovered from, used to reconstruct the path." },
    { term: "Weighted caveat", definition: "BFS is wrong when edges have different costs — use Dijkstra then." },
  ],

  concepts: {
    purpose: "Find fewest-edge (shortest) paths in unweighted graphs using BFS.",
    operations: "BFS from the start recording distances; stop at the target; use parent pointers to rebuild the path.",
    uses: "Shortest hops in networks, maze/grid shortest path, degrees of separation, word ladders.",
    tradeoffs: "O(V + E) and simple, but only correct for unweighted (equal-weight) edges; weighted graphs need Dijkstra.",
    commonMistakes: "Using BFS on a weighted graph (wrong result); updating a distance after first reach (already minimal); forgetting the unreachable case (return -1).",
    edgeCases: "Start == target → 0. Unreachable target → -1. Multiple shortest paths of equal length (BFS finds one).",
  },

  complexity: [
    { operation: "Unweighted shortest path (BFS)", best: "O(1)", average: "O(V + E)", worst: "O(V + E)", space: "O(V)", note: "BFS; correct only for equal-weight edges." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "V", meaning: "the number of vertices" },
      { symbol: "E", meaning: "the number of edges" },
    ],
    costModel: "deque and dict operations are O(1). Each vertex is enqueued once; each edge scanned once (standard BFS).",
    time: {
      bound: "O(V + E)",
      case: "worst",
      explanation: "This is just BFS with a distance map: each of the V vertices is enqueued once (on its first, nearest reach) and each edge scanned once, so O(V + E). Early termination when the target is popped can make it finish sooner in practice, but the worst case (target far or unreachable) explores the whole reachable graph — O(V + E).",
      otherCases: [
        { case: "best", bound: "O(1)", note: "start == target: answer 0 immediately." },
      ],
    },
    space: {
      bound: "O(V)",
      case: "worst",
      explanation: "The distance map holds up to V entries and the queue up to O(V). A parent map for path reconstruction is also O(V).",
      inputOutputNote: "The graph (V + E) is the input; the distance/parent maps and queue are the O(V) auxiliary space.",
    },
    derivation: [
      { lines: [8, 9, 10], description: "Each vertex is dequeued once; the target check is O(1).", cost: "O(V)", dimension: "time" },
      { lines: [11, 12, 13, 14], description: "Each edge is scanned once, fixing the shortest distance.", cost: "O(V + E)", dimension: "time" },
      { lines: [5, 6], description: "Distance map and queue are each O(V).", cost: "O(V)", dimension: "space" },
    ],
    assumptions: ["Edges are unweighted (equal cost) — the correctness precondition.", "First reach = shortest (BFS distance order).", "deque/dict ops O(1)."],
    tradeoffs: "For weighted graphs, BFS is incorrect; Dijkstra (non-negative weights) runs in O((V+E) log V) with a heap. BFS is the right, cheaper tool only when all edges cost the same.",
    counters: [{ label: "vertices settled", definition: "dequeues (line 8)", countLines: [8] }],
    fixedDataNote: "This run finds distance 3 from 0 to 4, and 0 from 0 to itself. The O(V+E) bound generalises; correctness relies on equal-weight edges.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import deque." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: fewest edges = BFS distance." },
    { line: 4, executable: true, explanation: "Define shortest_path(adj, start, target)." },
    { line: 5, executable: true, explanation: "dist maps a vertex to its distance from start; start is 0." },
    { line: 6, executable: true, explanation: "BFS queue seeded with the start." },
    { line: 7, executable: true, explanation: "Standard BFS loop." },
    { line: 8, executable: true, explanation: "Dequeue the nearest unsettled vertex." },
    { line: 9, executable: true, explanation: "If it's the target, its distance is the shortest (first pop)." },
    { line: 10, executable: true, explanation: "Return the shortest distance." },
    { line: 11, executable: true, explanation: "For each neighbour..." },
    { line: 12, executable: true, explanation: "...if not yet reached (first time = nearest)..." },
    { line: 13, executable: true, explanation: "...record distance = parent + 1..." },
    { line: 14, executable: true, explanation: "...and enqueue it." },
    { line: 15, executable: true, explanation: "If BFS finishes without reaching target, it's unreachable → -1." },
    { line: 16, executable: false, explanation: "Blank line." },
    { line: 17, executable: true, explanation: "A 5-vertex graph." },
    { line: 18, executable: true, explanation: "Shortest 0→4 is 0-1-3-4 = 3 edges → 3." },
    { line: 19, executable: true, explanation: "0→0 is 0 edges → 0." },
  ],

  bindings: [
    { variable: "g", model: "graph", directed: false },
    { variable: "dist", model: "dict" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why does BFS give the shortest path in an unweighted graph, and why does it FAIL when edges have weights?", answer: "BFS visits vertices in order of edge-count, so the first reach is the fewest-edge path — correct when all edges cost the same. With weights, fewest edges ≠ lowest total cost, so BFS's first reach may not be cheapest; you need Dijkstra.", explanation: "BFS's distance-order guarantee counts edges, not weights. Equal weights make edge-count equal cost; unequal weights break that equivalence, so a longer-in-edges path can be cheaper — beyond BFS's ability." },
  ],

  experiments: [
    "Add a parent map and reconstruct the actual shortest path, not just its length.",
    "Query an unreachable target and confirm it returns -1.",
    "Add edge weights and observe that BFS no longer gives the cheapest path (motivating Dijkstra).",
  ],

  exercises: [
    {
      id: "spu-complete-1",
      kind: "complete-code",
      prompt: "Complete BFS shortest-path to also build a parent map for path reconstruction.",
      starterCode: "from collections import deque\ndef bfs_parents(adj, start):\n    dist = {start: 0}\n    parent = {start: None}\n    q = deque([start])\n    while q:\n        node = q.popleft()\n        for nb in adj[node]:\n            if nb not in dist:\n                dist[nb] = dist[node] + 1\n                # TODO: record where nb was discovered from\n                q.append(nb)\n    return dist, parent",
      expected: "from collections import deque\ndef bfs_parents(adj, start):\n    dist = {start: 0}\n    parent = {start: None}\n    q = deque([start])\n    while q:\n        node = q.popleft()\n        for nb in adj[node]:\n            if nb not in dist:\n                dist[nb] = dist[node] + 1\n                parent[nb] = node\n                q.append(nb)\n    return dist, parent",
      hints: ["Record the vertex you reached nb from.", "That's the current node.", "parent[nb] = node"],
    },
    {
      id: "spu-choose-1",
      kind: "choose-approach",
      prompt: "You need the cheapest route in a road network where roads have different lengths. BFS or Dijkstra? Why?",
      expected: "Dijkstra — edges have different weights, so 'fewest edges' isn't 'lowest cost.' BFS only works for equal-weight (unweighted) graphs. Dijkstra (non-negative weights) uses a heap for O((V+E) log V).",
      hints: ["Are the edge costs equal?", "No — different road lengths.", "Weighted → Dijkstra, not BFS."],
    },
  ],

  review: `In an **unweighted** graph, the shortest path is the **fewest-edge** path, and **BFS** finds it: the first time BFS reaches a vertex is via a shortest path, so record distances on discovery. It's **O(V + E)** time / **O(V)** space, with **parent pointers** to rebuild the actual path. Crucial caveat: this holds **only for equal-weight edges** — weighted graphs need **Dijkstra**.`,

  expectedOutput: "3\n0\n",

  references: [
    {
      url: "https://cp-algorithms.com/graph/breadth-first-search.html",
      title: "Breadth-first search — CP-Algorithms",
      section: "Shortest paths in unweighted graphs",
      topic: "graphs/shortest-paths",
      purpose: "Confirm BFS computes unweighted shortest paths in O(V+E) and that weighted graphs require Dijkstra.",
      verifiedClaims: ["BFS finds shortest paths in unweighted graphs in O(V+E); weighted graphs need Dijkstra"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Graphs — shortest path (BFS) vs weighted (Dijkstra)",
      topic: "graphs/shortest-paths",
      purpose: "Cross-check the unweighted-BFS vs weighted-Dijkstra decision and path reconstruction with parents.",
      verifiedClaims: ["Unweighted shortest paths use BFS; parent pointers reconstruct the path"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 15,
    contentHash: "64565f14ba20f580",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
