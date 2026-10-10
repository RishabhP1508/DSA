/**
 * Lesson: Kruskal's algorithm (Graphs). Verified on CPython 3.14. Output: "4\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Kruskal: build a minimum spanning forest using the cheapest safe edges.
def kruskal(n, edges):
    edges = sorted(edges, key=lambda e: e[2])   # sort by weight ascending
    parent = list(range(n))
    rank = [0] * n
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]        # path halving
            x = parent[x]
        return x
    total = 0
    for u, v, w in edges:
        ru, rv = find(u), find(v)
        if ru != rv:                # endpoints in different sets -> no cycle
            if rank[ru] < rank[rv]:
                ru, rv = rv, ru
            parent[rv] = ru         # union by rank
            if rank[ru] == rank[rv]:
                rank[ru] += 1
            total += w              # take this edge into the forest
    return total

edges = [(0, 1, 4), (0, 2, 1), (1, 2, 2), (1, 3, 1), (2, 3, 5)]
print(kruskal(4, edges))   # picks 0-2(1), 1-3(1), 1-2(2) = 4`;

export const kruskal: LessonDefinition = {
  id: "kruskal",
  title: "Kruskal's Algorithm (MST)",
  area: "Graphs",
  prerequisites: ["prim", "union-find", "interval-sorting"],

  explanation: "**Kruskal** sorts weighted undirected edges by increasing weight and accepts an edge only when its endpoints belong to different DSU components. Accepting it merges those components; otherwise it would close a cycle. The cut property justifies the cheapest safe choice, including negative weights and ties.\n\nThe DSU here uses both union by rank and iterative path halving. Those optimizations justify O(α(V)) amortized find/union work. Sorting dominates in a usual nontrivial simple connected graph, but vertex initialization must also be counted: total O(V+E log(E+1)), with O(V+E) auxiliary storage for DSU arrays and a sorted copy of the input edges.\n\nOn connected input the result is an MST cost. On disconnected input the same sweep returns the cost of a minimum spanning forest, one tree per component; isolated vertices need no edges. Empty input returns zero. This forest contract differs from the Prim example, which rejects disconnected nonempty input. Kruskal naturally accepts an edge list; heap Prim naturally accepts adjacency lists. Dense matrix Prim is a separate O(V²) variant.",

  vocabulary: [
    { term: "Kruskal's algorithm", definition: "Builds an MST by adding globally cheapest edges that don't create a cycle." },
    { term: "Edge sorting", definition: "Ordering all edges by weight ascending — the dominant step." },
    { term: "Cycle check via Union-Find", definition: "Endpoints with the same root are already connected; adding the edge would cycle." },
    { term: "Union", definition: "Merging the two endpoints' components when an edge is accepted." },
    { term: "Greedy + cut property", definition: "Taking the cheapest safe edge each time yields an optimal MST." },
  ],

  concepts: {
  "purpose": "Build a minimum spanning tree by greedily choosing cheapest cycle-free edges globally.",
  "operations": "Sort edges by weight; for each, if endpoints are in different sets, union them and take the edge.",
  "uses": "Network/road/cable design, clustering (stop early for k clusters), minimum-cost connection.",
  "tradeoffs": "An edge-list input suits sorting plus DSU. Sparse graphs can use either Kruskal or heap Prim; dense matrix Prim is a separate O(V²) implementation.",
  "commonMistakes": "Forgetting to sort edges first; not using union-find for the cycle check (O(V+E) per check otherwise); adding an edge whose endpoints share a root.",
  "edgeCases": "Undirected finite-weight edges with valid endpoints. Negative edges, ties, parallel edges and isolated vertices are valid; self-loops are skipped. Disconnected input returns minimum spanning forest cost, not a spanning tree."
},

  complexity: [
  {
    "operation": "Kruskal",
    "best": "O(V+E)",
    "worst": "O(V+E log(E+1))",
    "space": "O(V + E)",
    "note": "Includes V initialization, adaptive sorted-copy construction, and rank+halving DSU. Disconnected input yields a forest."
  }
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
  "costModel": "Sorting E edges is O(E log E). Each edge triggers two finds and possibly a union, each amortized O(α(V)) ≈ O(1).",
  "time": {
    "bound": "O(V+E log(E+1))",
    "case": "worst",
    "explanation": "Initialize V parent/rank entries, sort E edges, and perform O(E) rank+halving DSU operations. The safe general upper bound includes V even for an edgeless graph."
  },
  "space": {
    "bound": "O(V + E)",
    "case": "worst",
    "explanation": "Parent and rank arrays use O(V). The newly sorted edge list and sorting workspace use O(E), for O(V+E) auxiliary storage.",
    "inputOutputNote": "Exclude the supplied edge list. Both DSU arrays and the sorted copy are auxiliary; the returned cost is scalar."
  },
  "derivation": [
    {
      "lines": [
        3
      ],
      "description": "Sorting all E edges by weight — the dominant O(E log E).",
      "cost": "O(E log E)",
      "dimension": "time"
    },
    {
      "lines": [
        12,
        13,
        14,
        17,
        20
      ],
      "description": "Sweep edges; each does union-find ops at amortized O(α(V)).",
      "cost": "O(E)",
      "dimension": "time"
    },
    {
      "lines": [
        4
      ],
      "description": "The union-find parent array is O(V); sorted edges O(E).",
      "cost": "O(V + E)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Undirected edges and valid labels 0..n−1; n>=0. Finite weights can be negative.",
    "Both union by rank and path halving are present.",
    "The sorted copy is auxiliary storage. E=O(V²) only for simple graphs; do not assume it with arbitrary parallel edges."
  ],
  "tradeoffs": "Kruskal suits an edge list; heap Prim suits adjacency lists. Both suit sparse graphs. Dense array/matrix Prim is a distinct O(V²) variant. On disconnected input this implementation returns a minimum spanning forest.",
  "counters": [
    {
      "label": "edges considered",
      "definition": "executions of the endpoint find pair at line 13",
      "countLines": [
        13
      ]
    },
    {
      "label": "edges accepted",
      "definition": "executions of total += w at line 20",
      "countLines": [
        20
      ]
    }
  ],
  "fixedDataNote": "Five edges are sorted; 0-2(1), 1-3(1) and 1-2(2) give cost 4. The general bound includes V initialization: O(V+E log(E+1)).",
  "references": [
    {
      "url": "https://cp-algorithms.com/graph/mst_kruskal_with_dsu.html",
      "title": "CP Algorithms: Kruskal with DSU",
      "section": "Rank-aware DSU implementation and sorted edge sweep",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "Process edges by increasing weight.",
        "Use rank and compression for DSU."
      ],
      "conventions": [],
      "accessDate": "2026-10-10"
    },
    {
      "url": "https://cp-algorithms.com/graph/mst_prim.html",
      "title": "CP Algorithms: Prim",
      "section": "Cut argument; dense and sparse implementations; no-MST check",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "An MST spans a connected undirected graph.",
        "Dense matrix Prim costs O(V²)."
      ],
      "conventions": [
        "App uses a lazy edge heap, not the source ordered-set decrease-key version."
      ],
      "accessDate": "2026-10-10"
    },
    {
      "url": "https://raw.githubusercontent.com/kevin-wayne/algs4/master/src/main/java/edu/princeton/cs/algs4/PrimMST.java",
      "title": "Princeton algs4: Prim minimum spanning forest",
      "section": "Class documentation lines 39–55; component loop lines 82–90; cut checks lines 175–190",
      "topic": "trees-graphs-range",
      "purpose": "Cross-check the exact implementation variant and boundary contract.",
      "verifiedClaims": [
        "Negative weights and ties are valid for spanning trees.",
        "Disconnected graphs require a forest contract or an explicit no-MST result.",
        "Cut optimality compares crossing-edge weights."
      ],
      "conventions": [
        "Princeton repeats indexed-heap Prim for every component; app lazy-heap Prim rejects disconnected nonempty input.",
        "Indexed heap O(E log V) and O(V) extra storage are not the bounds of the app lazy heap."
      ],
      "accessDate": "2026-10-10"
    }
  ]
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Sort undirected edges and join different components; the result is an MST on connected input and a forest otherwise."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define kruskal(n, edges)."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Sort all edges by weight ascending (the dominant step)."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Union-find parent array: each vertex is its own set."
  },
  {
    "line": 5,
    "explanation": "Initialize ranks so union balancing joins path halving.",
    "executable": true
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "find(x): the root of x's component."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Climb to the root..."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Path halving rewires the current node to its grandparent."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "...moving up each step."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Return the root."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Running MST total."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Sweep edges cheapest-first."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Find both endpoints' roots."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "If the roots differ, the endpoints are in different sets (no cycle)."
  },
  {
    "line": 15,
    "explanation": "Make ru the root with at least as large a rank.",
    "executable": true
  },
  {
    "line": 16,
    "explanation": "Swap representatives before linking the smaller-rank tree.",
    "executable": true
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Attach the lower-rank root to the higher-rank root."
  },
  {
    "line": 18,
    "explanation": "Equal ranks imply the new upper bound grows by one.",
    "executable": true
  },
  {
    "line": 19,
    "explanation": "Increase the surviving root’s rank.",
    "executable": true
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Add the accepted edge weight to the tree or forest total."
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "Return the total MST weight."
  },
  {
    "line": 22,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "An edge list (undirected, weighted)."
  },
  {
    "line": 24,
    "executable": true,
    "explanation": "kruskal(4, edges) → 4 (edges 0-2, 1-3, 1-2)."
  }
],

  bindings: [
    { variable: "parent", model: "array" },
  ],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "In Kruskal, how does Union-Find decide whether to keep an edge, and what would happen without it?",
    "answer": "It checks whether the edge's endpoints already share a root (same component); if so the edge would form a cycle and is skipped, otherwise it's kept and the sets are unioned. Without union-find, each cycle check would need an O(V+E) traversal, making Kruskal much slower.",
    "explanation": "Rank plus path halving gives amortized O(α(V)) per DSU operation. This very slow-growing factor makes connectivity checks inexpensive; it is not an exact O(1) asymptotic bound."
  }
],

  experiments: [
    "Record which edges are accepted and confirm there are V-1 of them for a connected graph.",
    "Make the graph disconnected and observe a spanning forest (fewer than V-1 edges).",
    "Compare Kruskal's MST weight with Prim's on the same graph (they match).",
  ],

  exercises: [
  {
    "id": "kru-choose-1",
    "kind": "choose-approach",
    "prompt": "For a SPARSE graph given as an edge list, Prim or Kruskal? What dominates Kruskal's cost?",
    "expected": "Kruskal — it sorts the edge list (O(E log E)) and uses union-find for near-linear cycle checks, ideal for sparse graphs / edge-list input. Sorting the edges dominates its cost.",
    "hints": [
      "Goal: build an MST of a SPARSE graph given as an edge list — Prim or Kruskal — and name what dominates Kruskal's cost.",
      "The friction with Prim here is that it prefers adjacency structure, while the input is a raw edge list.",
      "Key property: the graph is sparse and already presented as edges, which suits an edge-sorting greedy.",
      "Approach: use Kruskal — sort all edges by weight and add each if its endpoints are in different components (union-find).",
      "Reasoning: sorting the edges is O(E log E) and union-find makes cycle checks near-linear, ideal for sparse/edge-list input; the sort is the dominant term.",
      "Answer: Kruskal — it sorts the edge list (O(E log E)) and uses union-find for near-linear cycle checks, with the sort dominating its cost."
    ],
    "recognition": {
      "scenario": "You must build a minimum spanning tree of a SPARSE graph that is given to you as an edge list.",
      "approaches": [
        {
          "id": "kruskal",
          "label": "Kruskal's algorithm",
          "requiredReasonIds": [
            "kruskal-sort-edges"
          ]
        },
        {
          "id": "prim-matrix",
          "label": "Prim's algorithm over an adjacency matrix",
          "requiredReasonIds": [],
          "rejectionFeedback": "A matrix-based Prim is O(V²), which wastes work on a sparse graph and ignores that the input is already an edge list suited to Kruskal."
        }
      ],
      "reasons": [
        {
          "id": "kruskal-sort-edges",
          "text": "Kruskal sorts the edge list (O(E log E)) and adds each edge unless union-find reports it would form a cycle — a perfect fit for sparse graphs given as edges, with the sort dominating."
        },
        {
          "id": "kruskal-no-sort",
          "text": "Kruskal does not need to sort the edges.",
          "contradictory": true
        },
        {
          "id": "kruskal-needs-dense",
          "text": "Kruskal is only efficient on dense graphs.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "kruskal"
      ],
      "modelExplanation": "Kruskal — it sorts the edge list (O(E log E)) and uses union-find for near-linear cycle checks, ideal for sparse graphs / edge-list input. Sorting the edges dominates its cost."
    }
  },
  {
    "id": "kru-fix-1",
    "kind": "fix-mistake",
    "prompt": "`kruskal(n, edges)` returns the total weight of a Minimum Spanning Tree (edges are (u, v, w)). This forgets to sort the edges cheapest-first. Add the sort.",
    "starterCode": "def kruskal(n, edges):\n    parent = list(range(n))\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    total = 0\n    for u, v, w in edges:\n        ru, rv = find(u), find(v)\n        if ru != rv:\n            parent[ru] = rv\n            total += w\n    return total",
    "expected": "def kruskal(n, edges):\n    edges = sorted(edges, key=lambda e: e[2])\n    parent = list(range(n))\n    rank = [0] * n\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    total = 0\n    for u, v, w in edges:\n        ru, rv = find(u), find(v)\n        if ru != rv:\n            if rank[ru] < rank[rv]:\n                ru, rv = rv, ru\n            parent[rv] = ru\n            if rank[ru] == rank[rv]:\n                rank[ru] += 1\n            total += w\n    return total",
    "hints": [
      "Goal: kruskal(n, edges) returns the total weight of a Minimum Spanning Tree.",
      "The cost is choosing edges in the wrong order; the greedy needs them cheapest-first.",
      "Key property: Kruskal adds the smallest edge that doesn't form a cycle (union-find detects cycles).",
      "Approach: sort edges by weight, then union endpoints when they're in different components.",
      "Pseudocode: edges=sorted(edges,key=w); for u,v,w: if find(u)!=find(v): union; total+=w.",
      "Fix: add `edges = sorted(edges, key=lambda e: e[2])` at the top."
    ],
    "tests": "# MST total weight; unsorted edges must still yield the minimum.\nassert kruskal(4, [(0,1,10),(0,2,6),(0,3,5),(1,3,15),(2,3,4)]) == 19, 'MST edges 2-3(4),0-3(5),0-1(10)'\nassert kruskal(2, [(0,1,7)]) == 7\nassert kruskal(3, [(0,1,1),(1,2,2),(0,2,3)]) == 3, 'take 1 and 2, skip the cycle edge 3'\nassert kruskal(1, []) == 0\nprint('OK')\nassert kruskal(0,[])==0\nassert kruskal(4,[(0,1,-3),(2,3,2)])==-1\nassert kruskal(2,[(0,0,-9),(0,1,7),(0,1,-2)])==-2"
  }
],

  review: "Sort undirected edges and accept only edges joining different DSU components. Rank plus path halving supports inverse-Ackermann amortized DSU work. Initialization and sorting cost O(V+E log(E+1)). Connected input yields an MST; disconnected input yields a minimum spanning forest. Negative weights and parallel edges are supported.",

  expectedOutput: "4\n",

  references: [
  {
    "url": "https://cp-algorithms.com/graph/mst_kruskal_with_dsu.html",
    "title": "CP Algorithms: Kruskal with DSU",
    "section": "Rank-aware DSU implementation and sorted edge sweep",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "Process edges by increasing weight.",
      "Use rank and compression for DSU."
    ],
    "conventions": [],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://cp-algorithms.com/graph/mst_prim.html",
    "title": "CP Algorithms: Prim",
    "section": "Cut argument; dense and sparse implementations; no-MST check",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "An MST spans a connected undirected graph.",
      "Dense matrix Prim costs O(V²)."
    ],
    "conventions": [
      "App uses a lazy edge heap, not the source ordered-set decrease-key version."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://raw.githubusercontent.com/kevin-wayne/algs4/master/src/main/java/edu/princeton/cs/algs4/PrimMST.java",
    "title": "Princeton algs4: Prim minimum spanning forest",
    "section": "Class documentation lines 39–55; component loop lines 82–90; cut checks lines 175–190",
    "topic": "trees-graphs-range",
    "purpose": "Cross-check the exact implementation variant and boundary contract.",
    "verifiedClaims": [
      "Negative weights and ties are valid for spanning trees.",
      "Disconnected graphs require a forest contract or an explicit no-MST result.",
      "Cut optimality compares crossing-edge weights."
    ],
    "conventions": [
      "Princeton repeats indexed-heap Prim for every component; app lazy-heap Prim rejects disconnected nonempty input.",
      "Indexed heap O(E log V) and O(V) extra storage are not the bounds of the app lazy heap."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "757c20a4dd94f9f2",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
