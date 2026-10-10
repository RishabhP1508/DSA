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
  "Every reached vertex, including a sink, has an adjacency entry; the source is valid. Directed searches follow outgoing edges."
],

  alternatives: [
    "Dijkstra's algorithm — when edges have NON-NEGATIVE weights; a priority queue replaces the plain FIFO queue.",
    "0-1 BFS (deque) — when weights are only 0 or 1.",
    "Bellman–Ford — when some edge weights are negative.",
    "Multi-source BFS — seed the queue with several starts at distance 0 (e.g. 'nearest of any exit').",
  ],

  counterexamples: [
  "Unequal weighted edges: counting hops need not minimize cost. Use Dijkstra for nonnegative weights; Bellman–Ford can support negative weights.",
  "Using a stack (or recursion) instead of a queue makes it DFS, which does not give shortest distances.",
  "Marking discovered on dequeue rather than enqueue can add a node to the queue multiple times and inflate work."
],

  walkthroughCode,
  walkthroughExpectedOutput: "{0: 0, 1: 1, 2: 1, 3: 2, 4: 3}\n",
  complexityNote:
    "O(V+E) time over the reachable adjacency, with each reached vertex enqueued once and each adjacency entry scanned once. O(V) queue working space; the returned distances are output.",

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
  "costModel": "BFS enqueues each reachable vertex once; each vertex's adjacency list is scanned once when it is dequeued. deque.popleft/append are O(1).",
  "time": {
    "bound": "O(V + E)",
    "case": "expected",
    "explanation": "Each vertex is added to `dist` and the queue at most once (the `nb not in dist` guard, line 10). Dequeuing a vertex (line 8) scans its adjacency list (line 9); summed over all vertices that is O(E). So total O(V + E)."
  },
  "space": {
    "bound": "O(V)",
    "case": "worst",
    "explanation": "The queue holds at most V reached vertices. The returned V-entry distance dictionary is output storage and also serves as the discovery record.",
    "inputOutputNote": "The input adjacency mapping and returned distance dictionary are excluded; the queue uses O(V) working storage."
  },
  "derivation": [
    {
      "lines": [
        8
      ],
      "description": "Each vertex is dequeued once — O(V) total.",
      "cost": "O(V)",
      "dimension": "time"
    },
    {
      "lines": [
        9,
        10,
        11,
        12
      ],
      "description": "Each edge is examined once across all scans — O(E) total.",
      "cost": "O(E)",
      "dimension": "time"
    },
    {
      "lines": [
        5,
        6
      ],
      "description": "dist map and queue hold at most V entries.",
      "cost": "O(V)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Adjacency lookup adj[node] is O(1) plus O(degree) to iterate.",
    "The graph is unweighted so BFS layer order = shortest edge count.",
    "dict membership/insert is amortised O(1).",
    "Expected O(1) dictionary/set operations and deque end operations. Only the reachable subgraph is traversed."
  ],
  "tradeoffs": "BFS minimizes hop count. Unequal finite nonnegative weights call for Dijkstra; negative weights need Bellman–Ford or another algorithm with cycle handling.",
  "counters": [
    {
      "label": "vertices dequeued",
      "definition": "executions of q.popleft (line 8)",
      "countLines": [
        8
      ]
    }
  ],
  "fixedDataNote": "This 5-vertex graph dequeues each reachable vertex once. The O(V + E) bound generalises.",
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
    "id": "pat-bfs-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'In a maze grid (open/wall cells), find the minimum number of steps from start to exit.' Which pattern?",
    "expected": "BFS for shortest paths. The grid is an unweighted graph (each move costs one step), so BFS from the start reaches the exit via the fewest moves. O(V+E) over the cells.",
    "correctPatternId": "bfs-shortest-path",
    "hints": [
      "Goal: find the minimum number of steps from start to exit in a maze grid.",
      "Exploring paths depth-first can revisit cells and won't give shortest distances directly.",
      "Key insight: every move costs one step, so fewest steps equals fewest edges in an unweighted graph.",
      "Approach: use BFS from the start, treating each open cell as a node.",
      "Pseudocode: queue the start with distance 0; pop a cell, and for each unvisited open neighbor set dist+1 and enqueue.",
      "Use BFS for shortest paths: explore level by level with a queue, reaching the exit in the fewest moves (O(V+E))."
    ],
    "recognition": {
      "scenario": "In a maze grid of open and wall cells, find the minimum number of steps from the start to the exit.",
      "approaches": [
        {
          "id": "bfs",
          "label": "BFS for shortest paths",
          "requiredReasonIds": [
            "unweighted-levels"
          ]
        },
        {
          "id": "dfs",
          "label": "DFS",
          "requiredReasonIds": [],
          "rejectionFeedback": "DFS does not visit cells in increasing distance, so the first arrival is not guaranteed shortest."
        },
        {
          "id": "dijkstra",
          "label": "Dijkstra's algorithm",
          "requiredReasonIds": [],
          "rejectionFeedback": "Every move costs one step (unweighted), so Dijkstra's priority queue is unnecessary overhead — BFS suffices."
        }
      ],
      "reasons": [
        {
          "id": "unweighted-levels",
          "text": "Each move costs one step, so BFS visits cells in increasing distance and reaches the exit via the fewest moves — O(V+E)."
        },
        {
          "id": "weighted-edges",
          "text": "The moves have differing costs, so a priority queue is required.",
          "contradictory": true
        },
        {
          "id": "path-context",
          "text": "We must carry a running path sum down each route, so recursion is the natural fit.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "bfs"
      ],
      "modelExplanation": "BFS: the grid is an unweighted graph, so a breadth-first sweep reaches the exit by the fewest moves in O(V+E) over the cells."
    }
  },
  {
    "id": "pat-bfs-choose-1",
    "kind": "choose-approach",
    "prompt": "You need the lowest-COST route where roads have different positive travel times. Is BFS the right pattern? If not, what is?",
    "expected": "No — BFS finds fewest edges, not lowest cost, and weights differ. Use Dijkstra's algorithm (a priority queue by distance) for non-negative weighted shortest paths.",
    "correctPatternId": "dijkstra",
    "hints": [
      "Goal: find the lowest-COST route where roads have different positive travel times.",
      "BFS counts edges cheaply, but here edges have unequal weights so fewest hops isn't the cheapest route.",
      "Key insight: BFS assumes uniform edge cost, which breaks the moment weights differ.",
      "Approach: use Dijkstra's algorithm with a priority queue ordered by distance.",
      "Pseudocode: push (0, source); pop the closest node; relax its edges, pushing updated distances.",
      "BFS is wrong here; use Dijkstra — swap the FIFO queue for a min-heap to handle non-negative weighted shortest paths."
    ],
    "recognition": {
      "scenario": "You need the lowest-COST route in a network where roads have different positive travel times. Is BFS the right pattern?",
      "approaches": [
        {
          "id": "dijkstra",
          "label": "Dijkstra's algorithm",
          "requiredReasonIds": [
            "weighted-nonneg"
          ]
        },
        {
          "id": "bfs",
          "label": "Plain BFS",
          "requiredReasonIds": [],
          "rejectionFeedback": "BFS finds the fewest EDGES, not the lowest cost; with unequal weights fewest-edges is not cheapest."
        }
      ],
      "reasons": [
        {
          "id": "weighted-nonneg",
          "text": "Edge weights differ but are non-negative, so a priority queue that always settles the closest node gives correct shortest costs in O((V+E) log V)."
        },
        {
          "id": "equal-weights",
          "text": "All roads cost the same, so counting edges equals counting cost.",
          "contradictory": true
        },
        {
          "id": "negative-weights",
          "text": "Some roads have negative cost, so only Bellman–Ford is safe here.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "dijkstra"
      ],
      "modelExplanation": "No — BFS minimizes edge count, not weighted cost. With differing non-negative weights, Dijkstra's priority-queue search is the right pattern."
    }
  },
  {
    "id": "pat-bfs-fix-1",
    "kind": "fix-mistake",
    "prompt": "`bfs_dist(adj, start)` returns a dict of shortest-hop distances from `start`. This uses a stack, so it explores depth-first and reports wrong distances. Make it BFS.",
    "starterCode": "def bfs_dist(adj, start):\n    stack = [start]\n    dist = {start: 0}\n    while stack:\n        node = stack.pop()\n        for nb in adj[node]:\n            if nb not in dist:\n                dist[nb] = dist[node] + 1\n                stack.append(nb)\n    return dist",
    "expected": "from collections import deque\ndef bfs_dist(adj, start):\n    q = deque([start])\n    dist = {start: 0}\n    while q:\n        node = q.popleft()\n        for nb in adj[node]:\n            if nb not in dist:\n                dist[nb] = dist[node] + 1\n                q.append(nb)\n    return dist",
    "hints": [
      "Goal: fix the traversal so it reports correct shortest distances instead of DFS-order ones.",
      "The bug uses a stack (LIFO), so it explores depth-first and records wrong distances.",
      "Key insight: shortest paths in an unweighted graph require FIFO order so nodes are reached by fewest edges first.",
      "Approach: replace the stack with a queue and pop from the front.",
      "Pseudocode: deque([start]); dist[start]=0; while q: node=popleft(); for unvisited nb: dist[nb]=dist[node]+1; append nb.",
      "Use a `deque` and `popleft()` for FIFO order so distances come out correct (BFS, not DFS)."
    ],
    "tests": "assert bfs_dist({0: [1, 2], 1: [4], 2: [3], 3: [4], 4: []}, 0) == {0: 0, 1: 1, 2: 1, 3: 2, 4: 2}, 'BFS gives shortest hops; a stack/DFS reports dist[4]=3'\nassert bfs_dist({0: [1], 1: [2], 2: []}, 0) == {0: 0, 1: 1, 2: 2}, 'chain'\nassert bfs_dist({0: []}, 0) == {0: 0}, 'single node'\nassert bfs_dist({0: [1, 2], 1: [], 2: []}, 0) == {0: 0, 1: 1, 2: 1}, 'star'\nprint('OK')"
  }
],

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
    contentHash: "cc87b16548600da8",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
