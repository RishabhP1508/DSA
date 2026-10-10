/**
 * Lesson: Prim's algorithm (Graphs). Verified on CPython 3.14. Output: "4\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `import heapq

# Prim: build a Minimum Spanning Tree by growing one connected blob.
def prim(adj, n):
    if n == 0:
        return 0
    visited = [False] * n
    pq = [(0, 0)]          # (edge weight, node); start at node 0 with cost 0
    total = 0
    count = 0
    while pq and count < n:
        w, node = heapq.heappop(pq)   # cheapest edge crossing out of the blob
        if visited[node]:
            continue                  # already in the tree -> skip
        visited[node] = True
        total += w                    # add this edge's weight to the MST
        count += 1
        for nb, w2 in adj[node]:
            if not visited[nb]:
                heapq.heappush(pq, (w2, nb))
    if count != n:
        raise ValueError("graph is disconnected")
    return total

adj = {0: [(1, 4), (2, 1)], 1: [(0, 4), (2, 2), (3, 1)],
       2: [(0, 1), (1, 2), (3, 5)], 3: [(1, 1), (2, 5)]}
print(prim(adj, 4))   # MST weight: edges 0-2(1), 2-1(2), 1-3(1) = 4`;

export const prim: LessonDefinition = {
  id: "prim",
  title: "Prim's Algorithm (MST)",
  area: "Graphs",
  prerequisites: ["dijkstra", "min-max-heaps"],

  explanation: "An **MST** connects every vertex of a weighted undirected connected graph with minimum total edge weight and no cycles. Prim grows one tree: among edges crossing from visited vertices to unvisited vertices, take a minimum-weight one. By the cut property that edge belongs to some MST consistent with the choices already made; ties can yield different equally good trees.\n\nThis lazy heap can retain edges that later point to already visited vertices. Discard those candidates when popped. A candidate stores the edge weight, whereas Dijkstra stores source-path distance. Negative edge weights are valid for MSTs. Here the chosen edges total 4. An empty graph returns 0; a disconnected nonempty graph raises ValueError instead of silently returning one component's cost.\n\nThe heap may hold O(E) candidates, giving O(V+E log(E+1)) time and O(V+E) auxiliary storage including visited flags. For simple connected graphs this gives the usual O(E log V) bound. Both heap Prim and Kruskal work well for sparse graphs; a separate matrix/array Prim variant costs O(V²) and is useful for dense graphs. Representation and workload guide the choice.",

  vocabulary: [
    { term: "Minimum Spanning Tree (MST)", definition: "A cycle-free edge set connecting all vertices with minimum total weight." },
    { term: "Prim's algorithm", definition: "Grows the MST from one vertex by repeatedly adding the cheapest crossing edge." },
    { term: "Crossing edge", definition: "An edge from a vertex inside the growing tree to one outside it." },
    { term: "Cut property", definition: "The cheapest edge crossing any cut is safe to include in an MST." },
    { term: "Frontier heap", definition: "A min-heap of candidate edges leaving the current tree." },
  ],

  concepts: {
  "purpose": "Connect all vertices at minimum total edge weight by growing a single tree greedily.",
  "operations": "From the blob, pop the cheapest crossing edge via a min-heap; add the new vertex; push its edges.",
  "uses": "Network/cable/road design, clustering, approximation algorithms, minimum-cost connection.",
  "tradeoffs": "Heap Prim uses adjacency lists; Kruskal uses a sorted edge list. Dense matrix Prim has O(V²) time, but this lazy-heap implementation is a different variant.",
  "commonMistakes": "Adding an edge to an already-included vertex (creates a cycle — skip via visited); forgetting to skip stale heap entries; confusing Prim (edge weight to join) with Dijkstra (distance from source).",
  "edgeCases": "Weighted undirected graph with symmetric adjacency and valid endpoints. Negative and zero weights are supported. n=0 returns 0. Disconnected nonempty input raises ValueError."
},

  complexity: [
  {
    "operation": "Prim (binary heap)",
    "best": "O(V)",
    "worst": "O(V+E log(E+1))",
    "space": "O(V + E)",
    "note": "Lazy heap may retain O(E) edge candidates; matrix Prim is a different dense-graph variant."
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
  "costModel": "Each heap push/pop is O(log V) (heap holds O(E) edge candidates). Each vertex is settled once; each edge is pushed at most once.",
  "time": {
    "bound": "O(V+E log(E+1))",
    "case": "worst",
    "explanation": "Initialize V visited flags. Insert/pop at most O(E+1) lazy edge candidates, with logarithmic cost in heap size O(E+1)."
  },
  "space": {
    "bound": "O(V + E)",
    "case": "worst",
    "explanation": "The supplied adjacency graph is input. V visited flags and up to O(E) lazy heap candidates give O(V+E) auxiliary storage.",
    "inputOutputNote": "The graph (V + E) is the input; the visited array and heap are the auxiliary space."
  },
  "derivation": [
    {
      "lines": [
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "description": "O(E+1) lazy heap insertions/removals, including discarded edges.",
      "cost": "O(E log(E+1))",
      "dimension": "time"
    },
    {
      "lines": [
        18,
        19,
        20
      ],
      "description": "O(E+1) lazy heap insertions/removals, including discarded edges.",
      "cost": "O(E log(E+1))",
      "dimension": "time"
    },
    {
      "lines": [
        7,
        8
      ],
      "description": "Visited array O(V) plus heap up to O(E).",
      "cost": "O(V + E)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Undirected symmetric adjacency, n>=0, valid labels 0..n−1. Finite weights may be negative.",
    "Heap candidates may duplicate vertices; the heap can have O(E) entries.",
    "A disconnected nonempty graph has no MST and is rejected."
  ],
  "tradeoffs": "Heap Prim and Kruskal suit sparse representations; matrix Prim is a separate O(V²) dense-graph implementation.",
  "counters": [
    {
      "label": "edge candidates removed",
      "definition": "executions of w, node = heapq.heappop(pq) at line 12",
      "countLines": [
        12
      ]
    },
    {
      "label": "vertices accepted",
      "definition": "executions of visited[node] = True at line 15",
      "countLines": [
        15
      ]
    }
  ],
  "fixedDataNote": "The example spans four vertices with cost 4. Lazy-heap time is O(V+E log(E+1)); empty input costs constant time and disconnected nonempty input is rejected.",
  "references": [
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
    "executable": true,
    "explanation": "Import heapq for the frontier min-heap."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 3,
    "executable": false,
    "explanation": "Comment: grow one connected blob."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Define prim(adj, n)."
  },
  {
    "line": 5,
    "explanation": "An empty graph has an empty spanning tree with cost zero.",
    "executable": true
  },
  {
    "line": 6,
    "explanation": "Handle zero vertices before seeding vertex 0.",
    "executable": true
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Track which vertices are already in the tree."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Heap seeded with (0, start): join node 0 at cost 0."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Running total MST weight."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "How many vertices have joined."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Until the heap empties or all vertices are in."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Pop the cheapest candidate; it may already end at a visited vertex and be discarded."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "If its endpoint is already in the tree..."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "...skip (adding it would form a cycle)."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Otherwise mark the vertex included."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "Add this edge's weight to the MST."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "One more vertex joined."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "Push the new vertex's edges as future candidates..."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "...only to vertices not yet included."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Push (weight, neighbour)."
  },
  {
    "line": 21,
    "explanation": "The start component failed to reach every declared vertex.",
    "executable": true
  },
  {
    "line": 22,
    "explanation": "Reject a component tree because no spanning tree exists for the disconnected graph.",
    "executable": true
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "Return the total MST weight."
  },
  {
    "line": 24,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 25,
    "executable": true,
    "explanation": "A weighted undirected graph."
  },
  {
    "line": 26,
    "executable": true,
    "explanation": "(continued adjacency list)."
  },
  {
    "line": 27,
    "executable": true,
    "explanation": "prim(adj, 4) → 4 (edges 0-2, 2-1, 1-3)."
  }
],

  bindings: [
    { variable: "pq", model: "heap" },
    { variable: "visited", model: "array" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Both Prim and Dijkstra pop from a min-heap. What DIFFERENT quantity does each minimize?", answer: "Dijkstra minimizes the total DISTANCE FROM THE SOURCE to a vertex; Prim minimizes the WEIGHT OF THE SINGLE EDGE needed to attach a vertex to the growing tree.", explanation: "Both greedily expand a frontier via a heap, but the key differs: Dijkstra's key is cumulative path cost from the start, while Prim's key is just the crossing edge's weight — hence they build shortest-path trees vs minimum spanning trees." },
  ],

  experiments: [
    "Record which edges are chosen, not just the total weight.",
    "Start Prim from a different vertex and confirm the MST weight is the same.",
    "Make the graph disconnected and note Prim only spans the start's component.",
  ],

  exercises: [
  {
    "id": "prim-choose-1",
    "kind": "choose-approach",
    "prompt": "How does Prim differ from Dijkstra given both use a min-heap, and what does Prim produce?",
    "expected": "Prim keys the heap by the crossing-edge weight (to join the tree) and produces a Minimum Spanning Tree; Dijkstra keys by cumulative distance from the source and produces shortest paths. Same structure, different objective.",
    "hints": [
      "Goal: explain how Prim differs from Dijkstra (both use a min-heap) and what Prim produces.",
      "The confusion to avoid is assuming identical heap structure means identical output — the heap KEY differs.",
      "Key property: the objective differs — Prim grows a tree by cheapest connecting edge, Dijkstra grows shortest paths by cumulative distance.",
      "Approach: key Prim's heap by the weight of the edge crossing into the tree, not by distance from a source.",
      "Reasoning: because Prim keys on crossing-edge weight it builds a Minimum Spanning Tree, whereas Dijkstra keys on accumulated distance to build shortest paths — same machinery, different goal.",
      "Answer: Prim keys the heap by crossing-edge weight and produces a Minimum Spanning Tree; Dijkstra keys by cumulative distance and produces shortest paths — same structure, different objective."
    ],
    "recognition": {
      "scenario": "Both Prim and Dijkstra use a min-heap. You must say how Prim differs and what it produces.",
      "approaches": [
        {
          "id": "prim-mst",
          "label": "Prim keys by crossing-edge weight and builds a Minimum Spanning Tree",
          "requiredReasonIds": [
            "prim-keys-crossing-edge"
          ]
        },
        {
          "id": "prim-shortest-paths",
          "label": "Prim keys by cumulative distance and builds shortest paths",
          "requiredReasonIds": [],
          "rejectionFeedback": "Keying by cumulative distance from a source and producing shortest paths describes Dijkstra, not Prim — that confuses the two objectives."
        }
      ],
      "reasons": [
        {
          "id": "prim-keys-crossing-edge",
          "text": "Prim keys the heap by the weight of the cheapest edge crossing out of the tree, so it greedily grows a Minimum Spanning Tree; Dijkstra instead keys by distance from the source."
        },
        {
          "id": "prim-same-as-dijkstra",
          "text": "Prim and Dijkstra optimize the same objective and produce the same tree.",
          "contradictory": true
        },
        {
          "id": "prim-makes-shortest-paths",
          "text": "Prim produces a shortest-path tree from the source.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "prim-mst"
      ],
      "modelExplanation": "Prim keys the heap by the crossing-edge weight (to join the tree) and produces a Minimum Spanning Tree; Dijkstra keys by cumulative distance from the source and produces shortest paths — same structure, different objective."
    }
  },
  {
    "id": "prim-fix-1",
    "kind": "fix-mistake",
    "prompt": "`prim(adj, n)` returns the total weight of a Minimum Spanning Tree (adj maps each vertex to a list of (neighbour, weight) pairs). This Prim adds edges to already-included vertices, forming cycles and overcounting. Add the visited skip.",
    "starterCode": "import heapq\ndef prim(adj, n):\n    visited = [False] * n\n    total = 0\n    pq = [(0, 0)]\n    while pq:\n        w, node = heapq.heappop(pq)\n        visited[node] = True\n        total += w\n        for nb, w2 in adj[node]:\n            heapq.heappush(pq, (w2, nb))\n    return total",
    "expected": "import heapq\ndef prim(adj, n):\n    if n == 0:\n        return 0\n    visited = [False] * n\n    total = 0\n    pq = [(0, 0)]\n    while pq:\n        w, node = heapq.heappop(pq)\n        if visited[node]:\n            continue\n        visited[node] = True\n        total += w\n        for nb, w2 in adj[node]:\n            if not visited[nb]:\n                heapq.heappush(pq, (w2, nb))\n    if not all(visited):\n        raise ValueError(\"graph is disconnected\")\n    return total",
    "hints": [
      "Goal: fix Prim's MST so it doesn't add edges to vertices already in the tree.",
      "A vertex can appear in the heap several times, so it can be added twice, forming cycles and overcounting.",
      "Key insight: once a vertex is in the tree, any later heap entry for it is stale and must be skipped.",
      "Approach: mark vertices visited on inclusion and skip already-visited pops.",
      "Pseudocode: pop (w, node); if visited[node]: continue; else mark, add w, push unvisited neighbours.",
      "Add `if visited[node]: continue` right after popping."
    ],
    "tests": "adj = {0: [(1, 1), (2, 4)], 1: [(0, 1), (2, 2), (3, 6)], 2: [(0, 4), (1, 2), (3, 3)], 3: [(1, 6), (2, 3)]}\nassert prim(adj, 4) == 6, f'MST weight is 1+2+3 = 6 (buggy revisits and overcounts), got {prim(adj, 4)}'\n# A different graph so a hard-coded total cannot pass.\nadj2 = {0: [(1, 10), (2, 1)], 1: [(0, 10), (2, 2)], 2: [(0, 1), (1, 2)]}\nassert prim(adj2, 3) == 3, f'MST weight is 1+2 = 3, got {prim(adj2, 3)}'\n# Single vertex: no edges, zero weight.\nassert prim({0: []}, 1) == 0, 'single vertex MST weight is 0'\nprint('OK')\nassert prim({},0)==0\ntry:\n prim({0:[],1:[]},2)\nexcept ValueError:\n pass\nelse:\n raise AssertionError('no disconnected MST')\nassert prim({0:[(1,-3)],1:[(0,-3)]},2)==-3"
  }
],

  review: "Prim grows a minimum spanning tree by minimum crossing-edge choices in a weighted undirected connected graph. Negative weights are valid. Lazy candidates ending at visited vertices are skipped. Empty input returns zero; disconnected nonempty input raises ValueError. Heap size can be O(E).",

  expectedOutput: "4\n",

  references: [
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
    contentHash: "55a5e218c8627f60",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
