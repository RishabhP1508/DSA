/**
 * Lesson: Topological sort (Graphs). Verified on CPython 3.14.
 * Output: "[4, 5, 2, 0, 3, 1]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `from collections import defaultdict, deque

# Topological sort (Kahn's algorithm): order tasks respecting dependencies.
def topo_sort(n, edges):
    adj = defaultdict(list)
    indeg = [0] * n
    for u, v in edges:            # edge u -> v means u must come before v
        adj[u].append(v)
        indeg[v] += 1             # count incoming edges
    q = deque(i for i in range(n) if indeg[i] == 0)   # start: no prerequisites
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nb in adj[node]:
            indeg[nb] -= 1        # 'complete' node; remove its outgoing edges
            if indeg[nb] == 0:    # neighbour now has all prereqs done
                q.append(nb)
    if len(order) != n:
        raise ValueError("graph contains a directed cycle")
    return order

print(topo_sort(6, [(5, 2), (5, 0), (4, 0), (4, 1), (2, 3), (3, 1)]))`;

export const topologicalSort: LessonDefinition = {
  id: "topological-sort",
  title: "Topological Sort",
  area: "Graphs",
  prerequisites: ["graph-bfs", "graph-cycle-detection"],

  explanation: `A **topological sort** orders the vertices of a **directed acyclic graph (DAG)** so that every edge \`u → v\` points **forward** — u comes before v. It answers "in what order can I do these tasks given their dependencies?": course prerequisites, build systems, task schedulers. It only exists if the graph has **no cycle** (a cycle is an impossible circular dependency).

**Kahn's algorithm** (shown here) uses **in-degrees** — the number of incoming edges (prerequisites) each vertex has. Start by queueing every vertex with **in-degree 0** (no prerequisites). Repeatedly take one, add it to the order, and "complete" it by decrementing its neighbours' in-degrees; whenever a neighbour's in-degree hits 0, all its prerequisites are done, so queue it. The result is a valid ordering. (An equivalent method uses DFS and reverses the postorder.)

It runs in **O(V + E)** — each vertex is queued once and each edge relaxes one in-degree once — with **O(V)** space. A valuable bonus: **Kahn's algorithm detects cycles for free**. If the final order contains fewer than V vertices, some vertices never reached in-degree 0, which means they're stuck in a cycle — no valid ordering exists. The cue: "order respecting dependencies / prerequisites" → topological sort on a DAG.`,

  vocabulary: [
    { term: "Topological sort", definition: "A linear ordering of a DAG's vertices where every edge points forward." },
    { term: "DAG", definition: "Directed acyclic graph — the only kind with a topological order." },
    { term: "In-degree", definition: "The number of incoming edges (prerequisites) of a vertex." },
    { term: "Kahn's algorithm", definition: "Repeatedly remove in-degree-0 vertices, decrementing neighbours' in-degrees." },
    { term: "Cycle detection bonus", definition: "If fewer than V vertices are output, a cycle exists (no valid order)." },
  ],

  concepts: {
  "purpose": "Order tasks/vertices so all dependencies come first; the basis of scheduling and build ordering.",
  "operations": "Compute in-degrees; queue in-degree-0 vertices; pop, output, decrement neighbours, queue new zeros.",
  "uses": "Course scheduling, build systems, task ordering, dependency resolution, DAG longest path setup.",
  "tradeoffs": "O(V + E) and detects cycles for free; only valid on a DAG (a cycle has no ordering).",
  "commonMistakes": "Running it on a graph with a cycle and not checking the output length; miscounting in-degrees; queueing a vertex before its in-degree reaches 0.",
  "edgeCases": "Directed graph only. Empty input returns []. Multiple valid orders may exist. A cycle causes ValueError; vertices downstream of a cycle can remain unprocessed even if they do not themselves lie on it."
},

  complexity: [
  {
    "operation": "Topological sort (Kahn)",
    "best": "O(V + E)",
    "average": "O(V + E)",
    "worst": "O(V + E)",
    "space": "O(V+E)",
    "note": "Includes internally built adjacency, indegrees and queue; a cyclic graph is rejected."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "V",
      "meaning": "the number of vertices (tasks)"
    },
    {
      "symbol": "E",
      "meaning": "the number of edges (dependencies)"
    }
  ],
  "costModel": "Computing in-degrees scans each edge once; each vertex is enqueued/dequeued once; each edge triggers one decrement.",
  "time": {
    "bound": "O(V + E)",
    "case": "worst",
    "explanation": "Building in-degrees scans all E edges — O(E). The main loop dequeues each vertex exactly once (it's queued only when its in-degree hits 0) — O(V) — and each edge is 'relaxed' (one decrement) exactly once when its source is processed — O(E). Summing gives O(V + E). The cycle check is free: comparing len(order) to V is O(1)."
  },
  "space": {
    "bound": "O(V+E)",
    "case": "worst",
    "explanation": "Adjacency is built inside the function (O(V+E)); in-degrees and the queue add O(V). The returned order is output storage.",
    "inputOutputNote": "The O(E) edge list is input. Adjacency, indegrees and queue are auxiliary; the returned order is output."
  },
  "derivation": [
    {
      "lines": [
        7,
        8,
        9
      ],
      "description": "Building in-degrees scans each edge once.",
      "cost": "O(V + E)",
      "dimension": "time"
    },
    {
      "lines": [
        12,
        13,
        14
      ],
      "description": "Each vertex is dequeued exactly once (when its in-degree hits 0).",
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
      "description": "Each edge triggers one in-degree decrement.",
      "cost": "O(E)",
      "dimension": "time"
    },
    {
      "lines": [
        6,
        10
      ],
      "description": "Indegree array and queue are O(V); returned order is output. Internal adjacency additionally uses O(V+E).",
      "cost": "O(V)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Adjacency-list DAG; queue/list ops O(1).",
    "A vertex is queued only when its in-degree reaches 0.",
    "The graph should be acyclic for a full ordering.",
    "Directed edges; n>=0 and valid endpoints.",
    "The function rejects any cycle by comparing the processed count with n."
  ],
  "tradeoffs": "A DFS topological order is also O(V+E) when it rejects back edges before reversing postorder. Kahn is iterative; a processed count below V signals a directed cycle.",
  "counters": [
    {
      "label": "vertices output",
      "definition": "appends to the order (line 14)",
      "countLines": [
        14
      ]
    }
  ],
  "fixedDataNote": "This run orders 6 tasks respecting the given dependencies → [4,5,2,0,3,1] (one valid order). The O(V+E) bound generalises.",
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

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": true,
    "explanation": "Import defaultdict and deque."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 3,
    "executable": false,
    "explanation": "Comment: Kahn's algorithm respects dependencies."
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
    "explanation": "In-degree count per vertex, starting at 0."
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
    "explanation": "Queue all vertices with no prerequisites (in-degree 0)."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "The output order."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Process the queue."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Take a ready vertex."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Add it to the order."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "For each dependent neighbour..."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "...decrement its in-degree (a prerequisite is done)."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "If it now has no remaining prerequisites..."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "...queue it as ready."
  },
  {
    "line": 19,
    "explanation": "Unprocessed vertices signal a directed cycle (possibly with blocked descendants).",
    "executable": true
  },
  {
    "line": 20,
    "explanation": "Reject the partial list instead of labeling it a topological order.",
    "executable": true
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "Return the topological order."
  },
  {
    "line": 22,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "Sort 6 tasks with the given dependencies → [4, 5, 2, 0, 3, 1]."
  }
],

  bindings: [
    { variable: "indeg", model: "array" },
    { variable: "order", model: "array" },
  ],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "How does Kahn's algorithm detect that no topological order exists (a cycle)?",
    "answer": "Fewer than n vertices are processed; a directed cycle exists.",
    "explanation": "A cycle prevents its vertices from reaching zero in-degree. Descendants of that cycle can also stay blocked; an acyclic vertex is not guaranteed to be queued."
  }
],

  experiments: [
    "Add an edge that creates a cycle and check that len(order) < n.",
    "Note that different queue orders give different (all valid) topological orders.",
    "Add an isolated vertex and see it appear early (in-degree 0).",
  ],

  exercises: [
  {
    "id": "topo-complete-1",
    "kind": "complete-code",
    "prompt": "Complete `kahn(adj, indeg)`: return a topological order via Kahn's algorithm. Fill in the in-degree update inside the main loop. This helper returns the processed prefix; callers detect a cycle when its length is smaller than the vertex count.",
    "starterCode": "from collections import deque\ndef kahn(adj, indeg):\n    q = deque([v for v in indeg if indeg[v] == 0])\n    order = []\n    while q:\n        node = q.popleft()\n        order.append(node)\n        # TODO: one prerequisite of each neighbour is done; queue it if ready\n        pass\n    return order",
    "expected": "from collections import deque\ndef kahn(adj, indeg):\n    q = deque([v for v in indeg if indeg[v] == 0])\n    order = []\n    while q:\n        node = q.popleft()\n        order.append(node)\n        for nb in adj[node]:\n            indeg[nb] -= 1\n            if indeg[nb] == 0:\n                q.append(nb)\n    return order",
    "hints": [
      "Goal: complete the in-degree update inside Kahn's algorithm main loop.",
      "Rescanning for zero-in-degree nodes is wasteful; you decrement as you remove edges.",
      "Key insight: removing a node lowers each neighbour's in-degree, and a zero means all prerequisites are done.",
      "Approach: for each neighbour, decrement in-degree and enqueue when it hits zero.",
      "Pseudocode: for nb in adj[node]: indeg[nb] -= 1; if indeg[nb] == 0: enqueue nb.",
      "Write `indeg[nb] -= 1` then `if indeg[nb] == 0: q.append(nb)`."
    ],
    "tests": "order = kahn({0: [1, 2], 1: [3], 2: [3], 3: []}, {0: 0, 1: 1, 2: 1, 3: 2})\nassert order == [0, 1, 2, 3], f'Kahn order (buggy forgets to queue newly-zeroed nodes), got {order}'\nassert kahn({0: [1], 1: [2], 2: []}, {0: 0, 1: 1, 2: 1}) == [0, 1, 2], 'simple chain'\nassert len(kahn({0: [1], 1: [0]}, {0: 1, 1: 1})) == 0, 'a cycle emits no node'\nassert kahn({0: []}, {0: 0}) == [0], 'single node'\no4 = kahn({0: [2], 1: [2], 2: []}, {0: 0, 1: 0, 2: 2})\nassert sorted(o4) == [0, 1, 2] and o4[-1] == 2, f'two roots feed node 2 last, got {o4}'\nprint('OK')"
  },
  {
    "id": "topo-choose-1",
    "kind": "choose-approach",
    "prompt": "You must schedule courses given prerequisite pairs and also report if scheduling is impossible. Which algorithm, and how do you detect impossibility?",
    "expected": "Topological sort (Kahn's) — it produces a valid course order in O(V + E). If the order contains fewer than V courses, a prerequisite cycle exists and scheduling is impossible.",
    "hints": [
      "Goal: schedule courses from prerequisite pairs and detect when it is impossible.",
      "Ad-hoc dependency resolution is error-prone; a standard ordering algorithm handles it in linear time.",
      "Key insight: a valid order exists iff the prerequisite graph is acyclic.",
      "Approach: run topological sort (Kahn's) and check the output length.",
      "Pseudocode: run Kahn's in O(V+E); if fewer than V nodes come out, a cycle exists.",
      "Use topological sort (Kahn's); an output shorter than V means a cycle, so scheduling is impossible."
    ],
    "recognition": {
      "scenario": "You must schedule courses given prerequisite pairs and also report if scheduling is impossible. Which algorithm, and how do you detect impossibility?",
      "approaches": [
        {
          "id": "topo-kahn",
          "label": "Topological sort (Kahn's algorithm)",
          "requiredReasonIds": [
            "peel-and-detect-cycle"
          ]
        },
        {
          "id": "bfs-distance",
          "label": "Shortest-path BFS",
          "requiredReasonIds": [],
          "rejectionFeedback": "Shortest-path BFS computes distances; it does not produce a dependency-respecting order or detect a prerequisite cycle."
        }
      ],
      "reasons": [
        {
          "id": "peel-and-detect-cycle",
          "text": "Kahn's algorithm peels prerequisite-free courses via in-degrees to produce a valid order in O(V+E); if fewer than V courses come out, a cycle makes scheduling impossible."
        },
        {
          "id": "fewest-edges",
          "text": "The task asks for the fewest edges between two courses.",
          "contradictory": true
        },
        {
          "id": "weighted-cost",
          "text": "Prerequisites carry weights, so a priority queue by cost is needed.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "topo-kahn"
      ],
      "modelExplanation": "Topological sort (Kahn's): peel prerequisite-free courses via in-degrees for a valid order in O(V+E); if fewer than V emerge, a prerequisite cycle makes it impossible."
    }
  }
],

  review: "Topological sorting orders directed dependencies so every edge points forward. Kahn queues zero-indegree vertices, emits each and removes its outgoing dependencies. This function builds adjacency internally and takes O(V+E) time and auxiliary storage, excluding its returned order. If the processed count is below V, it raises ValueError; blocked vertices can include descendants of a cycle.",

  expectedOutput: "[4, 5, 2, 0, 3, 1]\n",

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
    contentHash: "8d35e103b81676bb",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
