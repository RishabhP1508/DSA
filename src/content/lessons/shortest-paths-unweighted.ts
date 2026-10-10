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
  "purpose": "Find fewest-edge (shortest) paths in unweighted graphs using BFS.",
  "operations": "BFS from the start recording distances; stop at the target; use parent pointers to rebuild the path.",
  "uses": "Shortest hops in networks, maze/grid shortest path, degrees of separation, word ladders.",
  "tradeoffs": "O(V + E) and simple, but only correct for unweighted (equal-weight) edges; weighted graphs need Dijkstra.",
  "commonMistakes": "Using BFS on a weighted graph (wrong result); updating a distance after first reach (already minimal); forgetting the unreachable case (return -1).",
  "edgeCases": "A valid start equal to target has distance 0. Unreachable targets return -1. Adjacency includes every reached vertex. Unit edges make hop count the distance; unequal nonnegative weights need Dijkstra, and negative weights require another algorithm such as Bellman–Ford."
},

  complexity: [
    { operation: "Unweighted shortest path (BFS)", best: "O(1)", average: "O(V + E)", worst: "O(V + E)", space: "O(V)", note: "BFS; correct only for equal-weight edges." },
  ],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "V",
      "meaning": "the number of vertices"
    },
    {
      "symbol": "E",
      "meaning": "the number of edges"
    }
  ],
  "costModel": "deque and dict operations are O(1). Each vertex is enqueued once; each edge scanned once (standard BFS).",
  "time": {
    "bound": "O(V + E)",
    "case": "worst",
    "explanation": "This is just BFS with a distance map: each of the V vertices is enqueued once (on its first, nearest reach) and each edge scanned once, so O(V + E). Early termination when the target is popped can make it finish sooner in practice, but the worst case (target far or unreachable) explores the whole reachable graph — O(V + E).",
    "otherCases": [
      {
        "case": "best",
        "bound": "O(1)",
        "note": "start == target: answer 0 immediately."
      }
    ]
  },
  "space": {
    "bound": "O(V)",
    "case": "worst",
    "explanation": "The distance map holds up to V entries and the queue up to O(V). A parent map for path reconstruction is also O(V).",
    "inputOutputNote": "The graph (V + E) is the input; the distance/parent maps and queue are the O(V) auxiliary space."
  },
  "derivation": [
    {
      "lines": [
        8,
        9,
        10
      ],
      "description": "Each vertex is dequeued once; the target check is O(1).",
      "cost": "O(V)",
      "dimension": "time"
    },
    {
      "lines": [
        11,
        12,
        13,
        14
      ],
      "description": "Each edge is scanned once, fixing the shortest distance.",
      "cost": "O(V + E)",
      "dimension": "time"
    },
    {
      "lines": [
        5,
        6
      ],
      "description": "Distance map and queue are each O(V).",
      "cost": "O(V)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Edges are unweighted (equal cost) — the correctness precondition.",
    "First reach = shortest (BFS distance order).",
    "deque/dict ops O(1).",
    "Unit-weight edges and a closed adjacency mapping with a valid start. Expected dictionary/set lookup cost.",
    "The result counts edges, not vertices; directed traversal follows outgoing edges."
  ],
  "tradeoffs": "For unequal finite nonnegative weights use heap Dijkstra; for negative edges use Bellman–Ford with negative-cycle handling. BFS is the cheaper minimum-hop method.",
  "counters": [
    {
      "label": "vertices settled",
      "definition": "dequeues (line 8)",
      "countLines": [
        8
      ]
    }
  ],
  "fixedDataNote": "This run finds distance 3 from 0 to 4, and 0 from 0 to itself. The O(V+E) bound generalises; correctness relies on equal-weight edges.",
  "references": [
    {
      "url": "https://opendatastructures.org/ods-python/12_3_Graph_Traversal.html",
      "title": "Open Data Structures: graph traversal",
      "section": "12.3.1 BFS; 12.3.2 DFS; Figures 12.4–12.5",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "BFS discovers reachable vertices in distance order.",
        "DFS records visited vertices before recursion."
      ],
      "conventions": [],
      "accessDate": "2026-10-10"
    },
    {
      "url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/196a95604877d326c6586e60477b59d4_MIT6_006S20_lec9.pdf",
      "title": "MIT 6.006 Lecture 9: BFS",
      "section": "Pages 1–4: representations, shortest paths, BFS",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "Undirected adjacency stores both directions.",
        "A path length counts edges."
      ],
      "conventions": [
        "App may use -1 for unreachable distances instead of infinity."
      ],
      "accessDate": "2026-10-10"
    }
  ]
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
  {
    "atEventIndex": 0,
    "prompt": "Why does BFS minimize hop count, and when does that also minimize total edge weight?",
    "answer": "BFS reaches vertices by increasing edge count. Equal positive weights make minimum hops minimum cost. Unequal weights can make a route with more edges cheaper; use Dijkstra for finite nonnegative weights and Bellman–Ford when negative edges are allowed.",
    "explanation": "The supplied function returns the number of edges, zero for start==goal and −1 if unreachable. Zero-weight edges make all reachable costs tie; negative edges need separate shortest-path reasoning."
  }
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

  review: "BFS finds the minimum number of edges in an unweighted graph by recording distance on discovery. It takes O(V+E) time and O(V) working storage, returning zero for equal endpoints and −1 when unreachable. Parent pointers are an optional extension for returning a route. Unequal nonnegative weights call for Dijkstra; negative weights need another algorithm such as Bellman–Ford.",

  expectedOutput: "3\n0\n",

  references: [
  {
    "url": "https://opendatastructures.org/ods-python/12_3_Graph_Traversal.html",
    "title": "Open Data Structures: graph traversal",
    "section": "12.3.1 BFS; 12.3.2 DFS; Figures 12.4–12.5",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "BFS discovers reachable vertices in distance order.",
      "DFS records visited vertices before recursion."
    ],
    "conventions": [],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/196a95604877d326c6586e60477b59d4_MIT6_006S20_lec9.pdf",
    "title": "MIT 6.006 Lecture 9: BFS",
    "section": "Pages 1–4: representations, shortest paths, BFS",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "Undirected adjacency stores both directions.",
      "A path length counts edges."
    ],
    "conventions": [
      "App may use -1 for unreachable distances instead of infinity."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "24c5cc38b62191b2",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
