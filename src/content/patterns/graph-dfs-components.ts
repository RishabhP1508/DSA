/**
 * Pattern: Graph DFS / connected components.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2). Output "2\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `from collections import defaultdict

# Graph DFS: count connected components by flood-filling each unvisited node.
def count_components(n, edges):
    adj = defaultdict(list)
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    seen = set()
    count = 0
    def dfs(node):
        seen.add(node)
        for nb in adj[node]:
            if nb not in seen:
                dfs(nb)                  # explore the whole component
    for s in range(n):
        if s not in seen:                # a new, untouched component
            count += 1
            dfs(s)
    return count

print(count_components(5, [(0, 1), (1, 2), (3, 4)]))  # {0,1,2} and {3,4} -> 2`;

export const graphDfsComponentsPattern: PatternDefinition = {
  id: "graph-dfs-components",
  title: "Graph DFS / Connected Components",
  category: "Graphs & trees",
  summary:
    "Flood-fill from each unvisited node to explore or count connected regions, marking nodes visited to avoid cycles.",

  clues: [
    "You must count/label connected regions, flood-fill an area, or explore everything reachable from a node.",
    "The data is a graph or a grid treated as a graph (cells connected to neighbors = 'islands').",
    "Phrases like 'number of connected components', 'count islands', 'flood fill', 'reachable nodes', 'friend circles'.",
  ],

  naiveApproach: `Checking connectivity by re-scanning or re-running searches for every pair of nodes is **O(V²)** or worse and revisits the same regions repeatedly. Without a visited set, a graph with cycles causes infinite loops.`,

  whyItHelps: `Depth-first search **explores everything reachable** from a start node in one sweep. Mark nodes **visited** as you enter them (so cycles don't loop forever), and each DFS from an unvisited node covers exactly **one connected component**. Iterating over all nodes and launching a fresh DFS whenever you hit an unvisited one both **counts** and **labels** components. Every node and edge is touched once — **O(V + E)** — with visited-set space **O(V)**.`,

  conditions: [
  "Mark nodes visited on entry to prevent infinite loops on cyclic graphs and redundant work.",
  "For grids, treat each cell as a node with edges to its valid neighbors (4- or 8-directional as specified).",
  "Deep graphs can overflow the recursion stack — use an explicit stack (iterative DFS) or BFS if needed.",
  "Components here are undirected; directed strong components require another algorithm. All declared vertex labels and endpoints are valid."
],

  alternatives: [
    "BFS — same connectivity result with a queue; preferred when recursion depth is a concern or you also want distances.",
    "Union-Find (DSU) — better when edges arrive incrementally or you need many dynamic 'same component?' queries.",
    "Topological sort — for ordering a DAG, not for undirected connectivity.",
  ],

  counterexamples: [
    "'Fewest edges between two nodes' is BFS shortest-path, not a component count.",
    "Forgetting the visited set makes DFS loop forever on any cycle.",
    "If connections change dynamically and you keep asking 'are these connected?', repeated DFS is wasteful — use Union-Find.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "2\n",
  complexityNote:
    "O(V+E) time and auxiliary storage, including adjacency built from edges. Seen state and recursive frames add O(V); use an iterative traversal when recursion is too deep.",

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "V",
      "meaning": "the number of vertices (n)"
    },
    {
      "symbol": "E",
      "meaning": "the number of edges"
    }
  ],
  "costModel": "Build the adjacency list in O(V + E), then DFS-visit each vertex once, scanning each edge (both directions) once.",
  "time": {
    "bound": "O(V + E)",
    "case": "worst",
    "explanation": "Building adj (lines 5-8) is O(E). The outer loop (lines 16-19) starts a DFS from each unvisited vertex; dfs (lines 11-15) marks each vertex once and scans its adjacency list. Summed over all vertices the edge scans are O(E), so total O(V + E)."
  },
  "space": {
    "bound": "O(V+E)",
    "case": "worst",
    "explanation": "The function builds adjacency from its edge input, requiring O(V+E) auxiliary storage; seen state and recursive frames add O(V).",
    "inputOutputNote": "edges (O(E)) is the input; the answer is a single count."
  },
  "derivation": [
    {
      "lines": [
        5,
        6,
        7,
        8
      ],
      "description": "Build the undirected adjacency list — O(E).",
      "cost": "O(E)",
      "dimension": "time"
    },
    {
      "lines": [
        12,
        13,
        14
      ],
      "description": "Each vertex visited once; each edge scanned once.",
      "cost": "O(V + E)",
      "dimension": "time"
    },
    {
      "lines": [
        9
      ],
      "description": "Visited set + recursion depth up to V.",
      "cost": "O(V)",
      "dimension": "space"
    },
    {
      "lines": [
        4,
        5,
        6
      ],
      "description": "Build an adjacency representation inside the function.",
      "cost": "O(V+E)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Undirected graph, n>=0 and endpoints 0..n−1.",
    "Expected constant-time set/dictionary operations; list append is amortized constant time.",
    "Recursive depth must fit Python’s runtime limit."
  ],
  "tradeoffs": "An iterative stack-based DFS or a union-find both count components in near-linear time; recursion risks a deep stack on long paths (Python's default recursion limit).",
  "counters": [
    {
      "label": "vertices visited",
      "definition": "executions of seen.add in dfs (line 12)",
      "countLines": [
        12
      ]
    }
  ],
  "fixedDataNote": "This 5-vertex graph visits all vertices across 2 components. The O(V + E) bound generalises.",
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
      "url": "https://opendatastructures.org/ods-python/12_2_AdjacencyLists_Graph_a.html",
      "title": "Open Data Structures: adjacency lists",
      "section": "12.2; Figure 12.3; Theorem 12.2",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "Adjacency storage is O(V+E).",
        "Scanning one neighbor list costs its degree."
      ],
      "conventions": [],
      "accessDate": "2026-10-10"
    }
  ]
},

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import defaultdict for the adjacency list." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: count components via flood fill." },
    { line: 4, executable: true, explanation: "Define count_components(n, edges)." },
    { line: 5, executable: true, explanation: "Adjacency list." },
    { line: 6, executable: true, explanation: "Build an undirected graph from edges." },
    { line: 7, executable: true, explanation: "Add u -> v." },
    { line: 8, executable: true, explanation: "Add v -> u." },
    { line: 9, executable: true, explanation: "Visited set to avoid revisiting/looping." },
    { line: 10, executable: true, explanation: "Component counter." },
    { line: 11, executable: true, explanation: "DFS that floods one component." },
    { line: 12, executable: true, explanation: "Mark the node visited on entry." },
    { line: 13, executable: true, explanation: "Visit each neighbour." },
    { line: 14, executable: true, explanation: "If unseen..." },
    { line: 15, executable: true, explanation: "...recurse to cover the rest of the component." },
    { line: 16, executable: true, explanation: "Scan every node as a potential new start." },
    { line: 17, executable: true, explanation: "If it hasn't been reached yet, it's a new component." },
    { line: 18, executable: true, explanation: "Count it." },
    { line: 19, executable: true, explanation: "Flood-fill it so its whole component is marked." },
    { line: 20, executable: true, explanation: "Return the component count." },
    { line: 21, executable: false, explanation: "Blank line." },
    { line: 22, executable: true, explanation: "{0,1,2} and {3,4} are two components." },
  ],

  bindings: [
    { variable: "seen", model: "set" },
    { variable: "count", model: "object" },
  ],

  linkedLessons: ["graph-dfs", "connected-components", "graph-bfs"],

  exercises: [
  {
    "id": "pat-gdc-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'Count the number of islands in a grid of land/water cells.' Which pattern?",
    "expected": "Flood-fill DFS/BFS is a direct O(V+E) static solution. Union-Find over land cells is also correct, with O(V+E*α(V)) amortized processing and extra DSU state.",
    "correctPatternId": "graph-dfs-components",
    "hints": [
      "Goal: count the number of islands in a grid of land and water cells.",
      "Rescanning connected land repeatedly would recount; marking visited cells avoids that.",
      "Key insight: adjacent land cells form connected components, so each unvisited land cell starts a new island.",
      "Approach: use graph DFS (flood fill) from each unvisited land cell, counting one component per launch.",
      "Pseudocode: for each cell: if it's unvisited land, DFS/flood-fill its whole region and add one to the count.",
      "Use graph DFS / connected components: flood-fill each unvisited land region and count one component per new DFS — O(V+E)."
    ],
    "recognition": {
      "scenario": "Count the number of islands in a grid of land and water cells.",
      "approaches": [
        {
          "id": "flood-fill",
          "label": "Graph DFS / connected components (flood fill)",
          "requiredReasonIds": [
            "one-dfs-per-component"
          ]
        },
        {
          "id": "union-find-static",
          "label": "Union-Find",
          "requiredReasonIds": [
            "union-land-neighbors"
          ]
        }
      ],
      "reasons": [
        {
          "id": "one-dfs-per-component",
          "text": "Treat land cells as nodes connected to adjacent land; launch a DFS from each unvisited land cell and count one component per launch — O(V+E)."
        },
        {
          "id": "dynamic-edges",
          "text": "Edges arrive incrementally, so a near-constant incremental union is required.",
          "contradictory": true
        },
        {
          "id": "weighted-shortest",
          "text": "You need the shortest weighted path, so Dijkstra applies.",
          "contradictory": true
        },
        {
          "id": "union-land-neighbors",
          "text": "Create a set for each land cell, union side-adjacent land cells, then count distinct land roots. This also counts static islands."
        }
      ],
      "acceptableApproachIds": [
        "flood-fill",
        "union-find-static"
      ],
      "modelExplanation": "Flood-fill DFS/BFS is a direct O(V+E) static solution. Union-Find over land cells is also correct, with O(V+E*α(V)) amortized processing and extra DSU state.",
      "alternatives": []
    }
  },
  {
    "id": "pat-gdc-choose-1",
    "kind": "choose-approach",
    "prompt": "Edges are added one at a time and after each you must answer 'are X and Y connected?'. DFS per query or Union-Find?",
    "expected": "Union-Find (DSU): near-constant union and connectivity queries with incremental edges. Re-running DFS per query would be O(V+E) each time — far too slow for many dynamic queries.",
    "correctPatternId": "union-find",
    "hints": [
      "Goal: after each added edge, answer whether X and Y are connected.",
      "Re-running DFS per query is O(V+E) each time — far too slow for many dynamic queries.",
      "Key insight: connectivity changes incrementally and you make many 'same set?' queries, which favors a dedicated structure.",
      "Approach: use Union-Find (DSU) with union and find operations.",
      "Pseudocode: union each new edge's endpoints; answer a query by comparing find(X) and find(Y).",
      "Use Union-Find (DSU): near-constant union and connectivity queries suit incremental edges far better than repeated DFS."
    ],
    "recognition": {
      "scenario": "Edges are added one at a time and after each you must answer 'are X and Y connected?'.",
      "approaches": [
        {
          "id": "union-find",
          "label": "Union-Find (DSU)",
          "requiredReasonIds": [
            "incremental-near-constant"
          ]
        },
        {
          "id": "dfs-per-query",
          "label": "Re-run DFS per query",
          "requiredReasonIds": [],
          "rejectionFeedback": "Each DFS is O(V+E); repeated per query on a stream of edges is far too slow."
        }
      ],
      "reasons": [
        {
          "id": "incremental-near-constant",
          "text": "Union each new edge and answer connectivity in amortized near-constant time, ideal for a stream of edges and queries."
        },
        {
          "id": "static-one-count",
          "text": "The graph is fixed and you count components exactly once, so a single traversal is simplest.",
          "contradictory": true
        },
        {
          "id": "weighted-paths",
          "text": "You need weighted shortest paths, so a priority queue is required.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "union-find"
      ],
      "modelExplanation": "Union-Find (DSU): near-constant union and connectivity queries handle incremental edges; repeated DFS would be O(V+E) per query."
    }
  },
  {
    "id": "pat-gdc-fix-1",
    "kind": "fix-mistake",
    "prompt": "`count_components(n, edges)` returns the number of connected components of an undirected graph on nodes `0..n-1`. Its inner DFS loops forever on a cyclic graph. Add the missing guard.",
    "starterCode": "def count_components(n, edges):\n    adj = {i: [] for i in range(n)}\n    for u, v in edges:\n        adj[u].append(v)\n        adj[v].append(u)\n    seen = set()\n    def dfs(node):\n        for nb in adj[node]:\n            dfs(nb)\n    count = 0\n    for i in range(n):\n        if i not in seen:\n            count += 1\n            dfs(i)\n    return count",
    "expected": "def count_components(n, edges):\n    adj = {i: [] for i in range(n)}\n    for u, v in edges:\n        adj[u].append(v)\n        adj[v].append(u)\n    seen = set()\n    def dfs(node):\n        seen.add(node)\n        for nb in adj[node]:\n            if nb not in seen:\n                dfs(nb)\n    count = 0\n    for i in range(n):\n        if i not in seen:\n            count += 1\n            dfs(i)\n    return count",
    "hints": [
      "Goal: fix the DFS so it doesn't loop forever on a cyclic graph.",
      "The bug never marks nodes visited, so a cycle sends the recursion around endlessly.",
      "Key insight: marking a node seen on entry and only recursing into unvisited neighbors breaks cycles.",
      "Approach: track a seen set, adding each node before exploring its neighbors.",
      "Pseudocode: dfs(node): add node to seen; for each neighbor not in seen: dfs(neighbor).",
      "Add `seen.add(node)` on entry and recurse only when `nb not in seen` to stop infinite recursion."
    ],
    "tests": "assert count_components(3, [[0, 1], [1, 2], [2, 0]]) == 1, 'cyclic triangle: one component, must not loop forever'\nassert count_components(5, [[0, 1], [2, 3]]) == 3, 'two edges + isolated 4'\nassert count_components(4, []) == 4, 'no edges: all isolated'\nassert count_components(1, []) == 1\nassert count_components(6, [[0, 1], [1, 2], [3, 4]]) == 3\nprint('OK')"
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
    "url": "https://opendatastructures.org/ods-python/12_2_AdjacencyLists_Graph_a.html",
    "title": "Open Data Structures: adjacency lists",
    "section": "12.2; Figure 12.3; Theorem 12.2",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "Adjacency storage is O(V+E).",
      "Scanning one neighbor list costs its degree."
    ],
    "conventions": [],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "1edb49a48caf29b5",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
