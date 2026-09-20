/**
 * Pattern: BFS for shortest paths (unweighted).
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "{0: 0, 1: 1, 2: 1, 3: 2, 4: 3}\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `from collections import deque

# BFS: shortest-path distances (fewest edges) from a source in an UNWEIGHTED graph.
def bfs_dist(adj, start):
    dist = {start: 0}
    q = deque([start])
    while q:
        node = q.popleft()                # FIFO: nearest nodes come out first
        for nb in adj[node]:
            if nb not in dist:            # first time we reach nb = shortest distance
                dist[nb] = dist[node] + 1
                q.append(nb)
    return dist

graph = {0: [1, 2], 1: [0, 3], 2: [0, 3], 3: [1, 2, 4], 4: [3]}
print(bfs_dist(graph, 0))`;

export const bfsShortestPathPattern: PatternDefinition = {
  id: "bfs-shortest-path",
  title: "BFS for Shortest Paths (Unweighted)",
  category: "Graphs & trees",
  summary:
    "Explore a graph level by level with a FIFO queue so the first time you reach a node is via a fewest-edges path.",

  clues: [
    "A graph, grid, or tree where you need the FEWEST steps/edges between nodes (or all distances from a source).",
    "Edges are UNWEIGHTED (or all weight 1), so 'shortest' means 'fewest hops'.",
    "You explore outward level by level; you may need the distance, the path, or 'minimum moves'.",
    "Phrases like 'minimum number of steps', 'shortest path in a maze', 'nearest exit', 'levels of a tree'.",
  ],

  naiveApproach: `Enumerate paths with DFS or try all routes and keep the shortest — this can explore exponentially many paths and does not naturally yield the minimum first. DFS finds *a* path quickly but not necessarily the **shortest**, and fixing that requires extra bookkeeping and revisits.`,

  whyItHelps: `BFS uses a **FIFO queue**, so it visits nodes in **increasing distance from the source**: all nodes at distance 1, then all at distance 2, and so on. The **first** time BFS reaches a node is therefore along a path with the **fewest edges** — record that distance and never overwrite it. Marking nodes as discovered when enqueued prevents revisits, so each node and edge is processed once: **O(V + E)** time and **O(V)** space. This is the canonical shortest-path method for unweighted graphs.`,

  conditions: [
    "Edges are unweighted (or uniform weight); otherwise fewest-edges ≠ lowest-cost.",
    "Mark a node discovered when you ENQUEUE it (not when you dequeue), so it isn't added twice.",
    "Use a FIFO queue (collections.deque.popleft), not a stack — a stack turns this into DFS.",
  ],

  alternatives: [
    "Dijkstra's algorithm — when edges have NON-NEGATIVE weights; a priority queue replaces the plain FIFO queue.",
    "0-1 BFS (deque) — when weights are only 0 or 1.",
    "Bellman–Ford — when some edge weights are negative.",
    "Multi-source BFS — seed the queue with several starts at distance 0 (e.g. 'nearest of any exit').",
  ],

  counterexamples: [
    "Using BFS on a WEIGHTED graph to get lowest cost is wrong — fewest edges may cost more than a longer cheap path; use Dijkstra.",
    "Using a stack (or recursion) instead of a queue makes it DFS, which does not give shortest distances.",
    "Marking discovered on dequeue rather than enqueue can add a node to the queue multiple times and inflate work.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "{0: 0, 1: 1, 2: 1, 3: 2, 4: 3}\n",
  complexityNote:
    "O(V + E) time — each vertex is enqueued once and each edge examined once. O(V) space for the queue and the distance map.",

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "V", meaning: "the number of vertices" },
      { symbol: "E", meaning: "the number of edges" },
    ],
    costModel: "BFS enqueues each reachable vertex once; each vertex's adjacency list is scanned once when it is dequeued. deque.popleft/append are O(1).",
    time: {
      bound: "O(V + E)",
      case: "worst",
      explanation: "Each vertex is added to `dist` and the queue at most once (the `nb not in dist` guard, line 10). Dequeuing a vertex (line 8) scans its adjacency list (line 9); summed over all vertices that is O(E). So total O(V + E).",
    },
    space: {
      bound: "O(V)",
      case: "worst",
      explanation: "The `dist` map and the queue each hold at most V entries. This is auxiliary to the input graph.",
      inputOutputNote: "The adjacency structure (O(V + E)) is the input; `dist` (O(V)) is the returned result.",
    },
    derivation: [
      { lines: [8], description: "Each vertex is dequeued once — O(V) total.", cost: "O(V)", dimension: "time" },
      { lines: [9, 10, 11, 12], description: "Each edge is examined once across all scans — O(E) total.", cost: "O(E)", dimension: "time" },
      { lines: [5, 6], description: "dist map and queue hold at most V entries.", cost: "O(V)", dimension: "space" },
    ],
    assumptions: ["Adjacency lookup adj[node] is O(1) plus O(degree) to iterate.", "The graph is unweighted so BFS layer order = shortest edge count.", "dict membership/insert is amortised O(1)."],
    tradeoffs: "BFS gives fewest-EDGES shortest paths only for unweighted graphs; weighted graphs need Dijkstra (O((V+E) log V)).",
    counters: [{ label: "vertices dequeued", definition: "executions of q.popleft (line 8)", countLines: [8] }],
    fixedDataNote: "This 5-vertex graph dequeues each reachable vertex once. The O(V + E) bound generalises.",
  },

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import deque for an O(1) FIFO queue." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: BFS distances in an unweighted graph." },
    { line: 4, executable: true, explanation: "Define bfs_dist(adj, start)." },
    { line: 5, executable: true, explanation: "Distance map; the source is at distance 0." },
    { line: 6, executable: true, explanation: "Queue seeded with the source." },
    { line: 7, executable: true, explanation: "Process until the queue empties." },
    { line: 8, executable: true, explanation: "Dequeue the front (FIFO), so nearer nodes are handled first." },
    { line: 9, executable: true, explanation: "Look at each neighbour." },
    { line: 10, executable: true, explanation: "If unseen, the FIRST time we reach it is its shortest distance." },
    { line: 11, executable: true, explanation: "Record neighbour distance as one more than the current node." },
    { line: 12, executable: true, explanation: "Enqueue it (marking it discovered)." },
    { line: 13, executable: true, explanation: "Return all shortest distances from the source." },
    { line: 14, executable: false, explanation: "Blank line." },
    { line: 15, executable: true, explanation: "An undirected graph as an adjacency list." },
    { line: 16, executable: true, explanation: "Distances from 0: {0:0, 1:1, 2:1, 3:2, 4:3}." },
  ],

  bindings: [
    { variable: "q", model: "queue" },
    { variable: "dist", model: "dict" },
  ],

  linkedLessons: ["graph-bfs", "shortest-paths-unweighted", "multi-source-bfs", "dijkstra"],

  exercises: [
    {
      id: "pat-bfs-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'In a maze grid (open/wall cells), find the minimum number of steps from start to exit.' Which pattern?",
      expected:
        "BFS for shortest paths. The grid is an unweighted graph (each move costs one step), so BFS from the start reaches the exit via the fewest moves. O(V+E) over the cells.",
      correctPatternId: "bfs-shortest-path",
      hints: [
        "Each move costs the same (one step).",
        "Fewest steps = fewest edges.",
        "Explore level by level with a queue.",
      ],
    },
    {
      id: "pat-bfs-choose-1",
      kind: "choose-approach",
      prompt:
        "You need the lowest-COST route where roads have different positive travel times. Is BFS the right pattern? If not, what is?",
      expected:
        "No — BFS finds fewest edges, not lowest cost, and weights differ. Use Dijkstra's algorithm (a priority queue by distance) for non-negative weighted shortest paths.",
      correctPatternId: "bfs-shortest-path",
      hints: [
        "Weights differ, so fewest hops ≠ cheapest.",
        "BFS assumes uniform edge cost.",
        "Swap the FIFO queue for a min-heap → Dijkstra.",
      ],
    },
    {
      id: "pat-bfs-fix-1",
      kind: "fix-mistake",
      prompt:
        "This uses a stack, so it explores depth-first and reports wrong distances. Make it BFS.",
      starterCode:
        "stack = [start]\ndist = {start: 0}\nwhile stack:\n    node = stack.pop()\n    for nb in adj[node]:\n        if nb not in dist:\n            dist[nb] = dist[node] + 1\n            stack.append(nb)",
      expected:
        "from collections import deque\nq = deque([start])\ndist = {start: 0}\nwhile q:\n    node = q.popleft()\n    for nb in adj[node]:\n        if nb not in dist:\n            dist[nb] = dist[node] + 1\n            q.append(nb)",
      hints: [
        "pop() from a list is LIFO — that's DFS.",
        "Shortest paths need FIFO order.",
        "Use a deque and popleft().",
      ],
    },
  ],

  references: [
    {
      url: "https://cp-algorithms.com/graph/breadth-first-search.html",
      title: "Breadth-First Search — CP-Algorithms",
      section: "BFS shortest paths in unweighted graphs; complexity",
      topic: "patterns/bfs-shortest-path",
      purpose: "Confirm BFS gives fewest-edge shortest paths in O(V+E) and that the first visit is optimal.",
      verifiedClaims: [
        "BFS computes shortest paths (fewest edges) from a source in an unweighted graph in O(V+E).",
        "The first time BFS reaches a vertex is along a shortest path.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/lecture-notes/",
      title: "Introduction to Algorithms 6.006 — BFS (MIT OCW)",
      section: "BFS and shortest paths",
      topic: "patterns/bfs-shortest-path",
      purpose: "Cross-check the level-by-level exploration and the enqueue-time discovery invariant.",
      verifiedClaims: ["BFS explores vertices in nondecreasing distance order from the source."],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 15,
    contentHash: "f79d0531bb1f4b01",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
