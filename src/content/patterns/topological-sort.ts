/**
 * Pattern: Topological sort.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "[4, 5, 2, 0, 3, 1]\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `from collections import deque, defaultdict

# Topological sort (Kahn's algorithm): order nodes so every edge points forward.
def topo_sort(n, edges):
    adj = defaultdict(list)
    indeg = [0] * n
    for u, v in edges:                    # edge u -> v means u must come before v
        adj[u].append(v)
        indeg[v] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)   # start with no-prerequisite nodes
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nb in adj[node]:
            indeg[nb] -= 1                # remove this dependency
            if indeg[nb] == 0:            # all prerequisites satisfied
                q.append(nb)
    if len(order) != n:
        raise ValueError("graph contains a directed cycle")
    return order

print(topo_sort(6, [(5, 2), (5, 0), (4, 0), (4, 1), (2, 3), (3, 1)]))`;

export const topologicalSortPattern: PatternDefinition = {
  id: "topological-sort",
  title: "Topological Sort",
  category: "Graphs & trees",
  summary:
    "Order the nodes of a DAG so every dependency comes before what depends on it, by repeatedly taking nodes with no remaining prerequisites.",

  clues: [
    "Tasks/items have DEPENDENCIES or a required ORDER (prerequisites, build steps, course schedules).",
    "The relationships form a directed graph and you need a valid linear ordering (or to detect impossibility/cycles).",
    "Phrases like 'course schedule', 'build order', 'task ordering', 'alien dictionary', 'compile dependencies'.",
  ],

  naiveApproach: `Guess an order and check every edge, backtracking on violations — potentially exponential. Repeatedly scanning for a node whose prerequisites are all met, without tracking in-degrees, is **O(V²)** or worse. Neither reuses the dependency counts that make this linear.`,

  whyItHelps: `Compute each node's **in-degree** (number of unmet prerequisites). Nodes with **in-degree 0** can go first; enqueue them, and as you output each node, **decrement its neighbors' in-degrees**, enqueuing any that reach 0. Every node and edge is processed once — **O(V + E)** — producing a valid order. If fewer than V nodes come out, the remaining ones are stuck in a **cycle**, so no ordering exists (a DAG is required). This is Kahn's BFS-based algorithm; a DFS post-order (reversed) also works.`,

  conditions: [
  "The graph must be a DAG — a cycle makes a topological order impossible (the algorithm detects this via output length < V).",
  "Edge direction encodes 'must come before'; be consistent about which endpoint is the prerequisite.",
  "Multiple valid orders may exist; any that respects all edges is correct.",
  "Directed valid endpoints; the supplied function raises ValueError for a cycle. Blocked vertices can include downstream vertices outside the cycle."
],

  alternatives: [
  "DFS post-order (reverse) — an alternative topo sort; natural when you're already doing DFS and want cycle detection via recursion colors.",
  "Plain BFS/DFS — for reachability/traversal without an ordering requirement.",
  "After obtaining a DAG order, relax weighted edges in that order for shortest or longest paths. Dijkstra separately solves nonnegative shortest paths; it is not a general longest-path algorithm."
],

  counterexamples: [
    "Undirected graphs or graphs with cycles can't be fully topologically ordered — detect the cycle instead.",
    "'Shortest path in an unweighted graph' is BFS, not topological sort.",
    "Reversing the intended edge direction yields an order that violates the real prerequisites.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "[4, 5, 2, 0, 3, 1]\n",
  complexityNote:
    "O(V + E) time — each node is enqueued once and each edge relaxes one in-degree. O(V + E) space for the adjacency list, in-degrees, and queue.",

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "V",
      "meaning": "the number of nodes (n)"
    },
    {
      "symbol": "E",
      "meaning": "the number of edges"
    }
  ],
  "costModel": "Kahn's algorithm: build in-degrees (O(V + E)), seed the queue with zero-in-degree nodes, then repeatedly dequeue a node and decrement its neighbours' in-degrees.",
  "time": {
    "bound": "O(V + E)",
    "case": "worst",
    "explanation": "Building adj and in-degrees (lines 7-9) is O(E). Each node is enqueued and dequeued once (lines 12-14): O(V). Each edge relaxes exactly one in-degree (lines 15-16) across the whole run: O(E). Total O(V + E)."
  },
  "space": {
    "bound": "O(V+E)",
    "case": "worst",
    "explanation": "The function constructs adjacency internally (O(V+E)), with O(V) in-degrees and queue; returned order is output.",
    "inputOutputNote": "edges (O(E)) is the input; the order list is O(V) output."
  },
  "derivation": [
    {
      "lines": [
        7,
        8,
        9
      ],
      "description": "Build adjacency + in-degree counts.",
      "cost": "O(E)",
      "dimension": "time"
    },
    {
      "lines": [
        12,
        13,
        14
      ],
      "description": "Enqueue/dequeue each node once.",
      "cost": "O(V)",
      "dimension": "time"
    },
    {
      "lines": [
        15,
        16,
        17,
        18
      ],
      "description": "Relax each edge's in-degree once.",
      "cost": "O(E)",
      "dimension": "time"
    },
    {
      "lines": [
        5,
        6
      ],
      "description": "adjacency O(V+E) + in-degrees O(V).",
      "cost": "O(V + E)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Directed edges, n>=0 and valid endpoints. A complete order requires a DAG.",
    "The main function raises ValueError if fewer than n vertices are processed; the practice function returns [] on any cycle.",
    "deque end operations and list indexing are constant time."
  ],
  "tradeoffs": "DFS topological sorting also takes O(V+E) when it detects a back edge before returning reversed postorder. Kahn iteratively checks the processed count and rejects a cycle.",
  "counters": [
    {
      "label": "nodes ordered",
      "definition": "executions of order.append (line 14)",
      "countLines": [
        14
      ]
    }
  ],
  "fixedDataNote": "This 6-node DAG produces a valid ordering visiting all nodes. The O(V + E) bound generalises.",
  "references": [
    {
      "url": "https://visualgo.net/en/dfsbfs",
      "title": "VisuAlgo: graph traversal",
      "section": "Directed graph settings; cycle states; 7-6 topological sorting (DFS and Kahn BFS)",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "Topological order requires a DAG.",
        "Kahn starts with zero in-degree."
      ],
      "conventions": [],
      "accessDate": "2026-10-10"
    },
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
      "url": "https://raw.githubusercontent.com/kevin-wayne/algs4/master/src/main/java/edu/princeton/cs/algs4/TopologicalX.java",
      "title": "Princeton algs4: queue-based topological sorting",
      "section": "Class documentation lines 11–24; indegree queue and count check lines 46–75",
      "topic": "trees-graphs-range",
      "purpose": "Cross-check the exact implementation variant and boundary contract.",
      "verifiedClaims": [
        "A complete topological order exists exactly for directed acyclic graphs.",
        "Vertices enter the queue when remaining indegree becomes zero.",
        "A processed count below V rejects a complete order."
      ],
      "conventions": [
        "Source consumes an existing graph; app builds adjacency internally and includes O(V+E) in auxiliary storage.",
        "Main app examples raise on cycles; the lesson prefix-count exercise intentionally returns the processed prefix."
      ],
      "accessDate": "2026-10-10"
    }
  ]
},

  codeExplanations: [
  {
    "line": 1,
    "executable": true,
    "explanation": "Import deque (queue) and defaultdict (adjacency)."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 3,
    "executable": false,
    "explanation": "Comment: Kahn's algorithm."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Define topo_sort(n, edges)."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Adjacency list."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "In-degree per node (unmet prerequisites)."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "For each directed edge u -> v (u before v)..."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "...record the edge..."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "...and increment v's in-degree."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Seed the queue with all nodes that have no prerequisites."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "The resulting order."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Process until the queue empties."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Take a ready node."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Append it to the order."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "For each dependent neighbour..."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "...remove this satisfied dependency."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "If it now has no prerequisites..."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "...it's ready; enqueue it."
  },
  {
    "line": 19,
    "explanation": "Compare processed vertices with the declared vertex count.",
    "executable": true
  },
  {
    "line": 20,
    "explanation": "Reject a partial list whenever a prerequisite cycle blocks processing.",
    "executable": true
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "Return a complete valid dependency order only after the cycle check."
  },
  {
    "line": 22,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "A valid ordering of the 6-node DAG is [4, 5, 2, 0, 3, 1]."
  }
],

  bindings: [
    { variable: "q", model: "queue" },
    { variable: "indeg", model: "array" },
  ],

  linkedLessons: ["topological-sort", "graph-bfs", "graph-cycle-detection"],

  exercises: [
  {
    "id": "pat-topo-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'Given courses with prerequisites, return an order to take them all (or report it's impossible).' Which pattern?",
    "expected": "Topological sort (Kahn's): build in-degrees, start with prerequisite-free courses, and peel nodes as their prerequisites clear. If fewer than all courses come out, a cycle makes it impossible. O(V+E).",
    "correctPatternId": "topological-sort",
    "hints": [
      "Goal: return an order to take all courses given prerequisites, or report it's impossible.",
      "Guessing orders is exponential; tracking in-degrees lets you peel ready courses one at a time.",
      "Key insight: prerequisites define a directed order, and a course is ready only when its in-degree reaches 0.",
      "Approach: use Kahn's topological sort with in-degree counts and a queue of ready nodes.",
      "Pseudocode: compute in-degrees; queue all zero-in-degree nodes; pop, output, decrement neighbors, queue newly-zero; check the count.",
      "Use topological sort (Kahn's): start from in-degree-0 nodes and peel; if output length < V a cycle makes it impossible — O(V+E)."
    ],
    "recognition": {
      "scenario": "Given courses with prerequisites, return an order to take them all (or report that it is impossible).",
      "approaches": [
        {
          "id": "topo-kahn",
          "label": "Topological sort (Kahn's algorithm)",
          "requiredReasonIds": [
            "indegree-peel",
            "cycle-detect"
          ]
        },
        {
          "id": "plain-bfs",
          "label": "Plain shortest-path BFS",
          "requiredReasonIds": [],
          "rejectionFeedback": "Shortest-path BFS computes distances; it does not order nodes by dependency or detect prerequisite cycles."
        }
      ],
      "reasons": [
        {
          "id": "indegree-peel",
          "text": "Build in-degrees, start with prerequisite-free courses, and peel each node as its prerequisites clear — a valid dependency order in O(V+E)."
        },
        {
          "id": "cycle-detect",
          "text": "If fewer than all courses come out, a prerequisite cycle exists and scheduling is impossible."
        },
        {
          "id": "distance-order",
          "text": "The task asks for the fewest edges between two courses.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "topo-kahn"
      ],
      "modelExplanation": "Topological sort (Kahn's): peel prerequisite-free courses via in-degrees; if fewer than V emerge, a cycle makes it impossible — O(V+E)."
    }
  },
  {
    "id": "pat-topo-choose-1",
    "kind": "choose-approach",
    "prompt": "'Find the fewest edges between two nodes in an unweighted graph.' Topological sort or BFS?",
    "expected": "BFS — that's a shortest-path (fewest edges) problem on a general graph. Topological sort orders a DAG by dependencies and doesn't compute distances.",
    "correctPatternId": "bfs-shortest-path",
    "hints": [
      "Goal: find the fewest edges between two nodes in an unweighted graph.",
      "Topological sort orders a DAG by dependencies but never computes distances.",
      "Key insight: fewest edges is a shortest-path measure, which requires level-by-level exploration.",
      "Approach: use BFS from the source.",
      "Pseudocode: BFS from source tracking distance; the first time you reach the target, that distance is the answer.",
      "Use BFS — it's a fewest-edges shortest-path problem; topological sort is about ordering, not distance."
    ],
    "recognition": {
      "scenario": "Find the fewest edges between two nodes in an unweighted graph. Topological sort or BFS?",
      "approaches": [
        {
          "id": "bfs",
          "label": "BFS",
          "requiredReasonIds": [
            "fewest-edges-levels"
          ]
        },
        {
          "id": "topo",
          "label": "Topological sort",
          "requiredReasonIds": [],
          "rejectionFeedback": "Topological sort orders a DAG by dependencies; it does not compute distances and does not apply to a general (possibly cyclic) graph."
        }
      ],
      "reasons": [
        {
          "id": "fewest-edges-levels",
          "text": "Fewest edges on an unweighted graph is a shortest-path question; BFS visits in increasing distance so the first arrival is shortest — O(V+E)."
        },
        {
          "id": "dependency-order",
          "text": "The task is to order nodes by their dependencies.",
          "contradictory": true
        },
        {
          "id": "weighted-cost",
          "text": "Edges have differing weights, so a priority queue is needed.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "bfs"
      ],
      "modelExplanation": "BFS: fewest edges on an unweighted graph is shortest-path work. Topological sort orders a DAG's dependencies and computes no distances."
    }
  },
  {
    "id": "pat-topo-fix-1",
    "kind": "fix-mistake",
    "prompt": "`topo_order(adj, indeg)` returns a topological order of a DAG via Kahn's algorithm (empty list if the graph has a cycle). This enqueues neighbors too early (before their prerequisites clear). Fix the enqueue condition. Return [] whenever any cycle prevents a complete order, including a separate acyclic component.",
    "starterCode": "from collections import deque\ndef topo_order(adj, indeg):\n    q = deque([v for v in indeg if indeg[v] == 0])\n    order = []\n    while q:\n        node = q.popleft()\n        order.append(node)\n        for nb in adj[node]:\n            indeg[nb] -= 1\n            q.append(nb)\n    return order",
    "expected": "from collections import deque\ndef topo_order(adj, indeg):\n    q = deque([v for v in indeg if indeg[v] == 0])\n    order = []\n    while q:\n        node = q.popleft()\n        order.append(node)\n        for nb in adj[node]:\n            indeg[nb] -= 1\n            if indeg[nb] == 0:\n                q.append(nb)\n    return order if len(order) == len(indeg) else []",
    "hints": [
      "A node is ready only when all its incoming dependencies are removed.",
      "Processing one predecessor must not queue a node with other prerequisites left.",
      "Queue a neighbor only when its remaining in-degree becomes zero.",
      "After processing, compare the order length with the number of declared nodes.",
      "Decrease indeg; enqueue on zero; return order if all nodes were processed, otherwise [].",
      "The zero test enforces prerequisites; the final length test rejects cycles even when an acyclic component was processed."
    ],
    "tests": "o = topo_order({0: [2], 1: [2], 2: [3], 3: []}, {0: 0, 1: 0, 2: 2, 3: 1})\npos = {v: k for k, v in enumerate(o)}\nassert set(o) == {0, 1, 2, 3}, f'every node once, got {o}'\nassert pos[2] > pos[0] and pos[2] > pos[1], f'2 after its prerequisites, got {o}'\nassert pos[3] == 3, f'3 last, got {o}'\nassert topo_order({0: [1], 1: [2], 2: []}, {0: 0, 1: 1, 2: 1}) == [0, 1, 2], 'chain'\nassert topo_order({0: [1], 1: [0]}, {0: 1, 1: 1}) == [], 'a cycle emits no node'\nassert topo_order({0: []}, {0: 0}) == [0], 'single node'\nprint('OK')\nassert topo_order({0:[1],1:[],2:[3],3:[2]},{0:0,1:1,2:1,3:1})==[]\nassert topo_order({0:[1],1:[0,2],2:[]},{0:1,1:1,2:1})==[]\nassert topo_order({}, {})==[]"
  }
],

  references: [
  {
    "url": "https://visualgo.net/en/dfsbfs",
    "title": "VisuAlgo: graph traversal",
    "section": "Directed graph settings; cycle states; 7-6 topological sorting (DFS and Kahn BFS)",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "Topological order requires a DAG.",
      "Kahn starts with zero in-degree."
    ],
    "conventions": [],
    "accessDate": "2026-10-10"
  },
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
    "url": "https://raw.githubusercontent.com/kevin-wayne/algs4/master/src/main/java/edu/princeton/cs/algs4/TopologicalX.java",
    "title": "Princeton algs4: queue-based topological sorting",
    "section": "Class documentation lines 11–24; indegree queue and count check lines 46–75",
    "topic": "trees-graphs-range",
    "purpose": "Cross-check the exact implementation variant and boundary contract.",
    "verifiedClaims": [
      "A complete topological order exists exactly for directed acyclic graphs.",
      "Vertices enter the queue when remaining indegree becomes zero.",
      "A processed count below V rejects a complete order."
    ],
    "conventions": [
      "Source consumes an existing graph; app builds adjacency internally and includes O(V+E) in auxiliary storage.",
      "Main app examples raise on cycles; the lesson prefix-count exercise intentionally returns the processed prefix."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "54704d9a363f66f7",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
