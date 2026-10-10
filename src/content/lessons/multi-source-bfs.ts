/**
 * Lesson: Multi-source BFS (Graphs). Verified on CPython 3.14.
 * Output: "[0, 1, 2, 1, 0]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `from collections import deque

# Multi-source BFS: start from MANY sources at once to get nearest distances.
def nearest_distances(sources, adj, n):
    dist = [-1] * n
    q = deque()
    for s in sources:          # seed ALL sources at distance 0
        if dist[s] == -1:
            dist[s] = 0
            q.append(s)
    while q:
        node = q.popleft()
        for nb in adj[node]:
            if dist[nb] == -1: # first time reached = nearest source distance
                dist[nb] = dist[node] + 1
                q.append(nb)
    return dist

adj = {0: [1], 1: [0, 2], 2: [1, 3], 3: [2, 4], 4: [3]}
# Sources 0 and 4; each vertex's distance to its NEAREST source.
print(nearest_distances([0, 4], adj, 5))`;

export const multiSourceBfs: LessonDefinition = {
  id: "multi-source-bfs",
  title: "Multi-Source BFS",
  area: "Graphs",
  prerequisites: ["graph-bfs"],

  explanation: "Seed every distinct source with distance zero, then perform one unit-edge BFS. First discovery gives minimum distance FROM any source. Repeated source entries are ignored after their first seed; reading k supplied entries still costs O(k). Initializing V distances and scanning reachable adjacency gives O(k+V+E) time. With distinct sources k<=V, this simplifies to O(V+E). In an undirected grid these are also distances TO a nearest source; in a directed graph reverse the edges when the question asks distance to a target. Empty sources leave -1 distances, and an empty graph with no sources returns [].",

  vocabulary: [
    { term: "Multi-source BFS", definition: "BFS seeded with several sources simultaneously to find nearest-source distances." },
    { term: "Source", definition: "A starting vertex; all sources begin at distance 0." },
    { term: "Nearest-source distance", definition: "For each vertex, the minimum edges to any source." },
    { term: "Expansion front", definition: "The simultaneously-growing rings from all sources that meet in the middle." },
    { term: "First-reach claim", definition: "A vertex's distance is fixed the first (hence nearest) time BFS reaches it." },
  ],

  concepts: {
  "purpose": "Compute nearest-source distances for all vertices in one BFS instead of k separate ones.",
  "operations": "Seed the queue with all sources at distance 0; run standard BFS, fixing each vertex on first reach.",
  "uses": "Rotting oranges, nearest 0 / walls and gates, nearest exit, fire/flood spread, nearest facility.",
  "tradeoffs": "O(V + E) total vs O(k·(V + E)) for k separate BFS runs; needs all sources known up front.",
  "commonMistakes": "Seeding only one source then looping (that's k separate BFS); updating a distance after the first reach (BFS already gives the minimum); forgetting to mark sources as distance 0.",
  "edgeCases": "Empty sources leave all distances -1. Duplicate sources are deduplicated. Valid labels are 0..n−1 and adjacency includes every reached vertex. Directed distances are from a nearest source; reverse edges to find distance to a nearest target."
},

  complexity: [
  {
    "operation": "Multi-source BFS",
    "best": "O(k+V)",
    "worst": "O(k+V+E)",
    "space": "O(V)",
    "note": "k counts supplied entries, including duplicates; if distinct k<=V."
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
    },
    {
      "symbol": "k",
      "meaning": "number of supplied source entries, including duplicates"
    }
  ],
  "costModel": "deque and array operations are O(1). Each vertex is enqueued once (on its first, nearest reach); each edge is scanned once.",
  "time": {
    "bound": "O(k+V+E)",
    "case": "worst",
    "explanation": "Read k source entries, initialize V distances and enqueue each reachable vertex once. Scan its outgoing adjacency entries once."
  },
  "space": {
    "bound": "O(V)",
    "case": "worst",
    "explanation": "The queue contains at most V distinct reached vertices after deduplicated seeding. The V-entry distance list is returned output.",
    "inputOutputNote": "The returned V distances and input graph are excluded; the queue has O(V) auxiliary entries."
  },
  "derivation": [
    {
      "lines": [
        7,
        8,
        10
      ],
      "description": "Read k entries and enqueue each distinct source once.",
      "cost": "O(k)",
      "dimension": "time"
    },
    {
      "lines": [
        11,
        12
      ],
      "description": "Each vertex is dequeued once (first reach).",
      "cost": "O(V)",
      "dimension": "time"
    },
    {
      "lines": [
        13,
        14,
        15,
        16
      ],
      "description": "Each edge is scanned once, fixing the nearest distance.",
      "cost": "O(V + E)",
      "dimension": "time"
    },
    {
      "lines": [
        5,
        6
      ],
      "description": "Distance array and queue are each O(V).",
      "cost": "O(V)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Unweighted graph (BFS gives shortest distances).",
    "All sources known before starting.",
    "First reach = nearest source (BFS distance order).",
    "Valid source labels, closed adjacency, unit-weight edges.",
    "Arbitrary duplicate source entries contribute O(k); k<=V only when sources are distinct."
  ],
  "tradeoffs": "Compared with k separate traversals, one multi-source traversal shares frontier work. Reading arbitrary supplied sources costs O(k); directed distance-to-target queries reverse edges.",
  "counters": [
    {
      "label": "vertices removed",
      "definition": "executions of node = q.popleft() at line 12",
      "countLines": [
        12
      ]
    }
  ],
  "fixedDataNote": "Distinct sources 0 and 4 yield [0,1,2,1,0] on the undirected line. For distinct sources the generalized bound is O(V+E).",
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
  {
    "line": 1,
    "executable": true,
    "explanation": "Import deque."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 3,
    "executable": false,
    "explanation": "Comment: seed many sources at once."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Define nearest_distances(sources, adj, n)."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "dist[v] = -1 means unreached."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "The BFS queue."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Seed EVERY source..."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Seed each source once, even if its label is repeated."
  },
  {
    "line": 9,
    "explanation": "Every distinct source has distance zero.",
    "executable": true
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Enqueue this source exactly once."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Standard BFS loop."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Dequeue a vertex."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "For each neighbour..."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "...if unreached (first time = nearest)..."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "...set its distance to parent + 1..."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "...and enqueue it."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Return all nearest-source distances."
  },
  {
    "line": 18,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "A 5-vertex line graph 0-1-2-3-4."
  },
  {
    "line": 20,
    "executable": false,
    "explanation": "Comment: sources 0 and 4."
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "Distances to nearest source → [0, 1, 2, 1, 0]."
  }
],

  bindings: [
    { variable: "dist", model: "array" },
  ],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "Why does multi-source BFS share one traversal instead of repeating BFS from every source?",
    "answer": "All sources are seeded at distance zero in one queue, and each distinct vertex is discovered once. Reading k source entries, including duplicates, costs O(k); the complete bound is O(k+V+E).",
    "explanation": "With distinct valid sources k<=V, giving O(V+E). Repeated source entries must still be read, so arbitrary k cannot be dropped."
  }
],

  experiments: [
    "Use a single source and confirm it reduces to ordinary BFS distances.",
    "Add an unreachable vertex and see it keep distance -1.",
    "Map this to 'rotting oranges': all rotten cells are sources; the max distance is the time to rot all.",
  ],

  exercises: [
  {
    "id": "msbfs-choose-1",
    "kind": "choose-approach",
    "prompt": "In a grid, every empty cell needs its distance to the NEAREST gate (several gates). Separate BFS per gate or multi-source BFS? Complexity of each?",
    "expected": "Multi-source BFS: seed all gates at distance 0 and run one BFS — O(V + E) (cells + edges). Separate BFS per gate is O(k·(V + E)) for k gates, far slower.",
    "hints": [
      "Goal: give every empty grid cell its distance to the NEAREST of several gates — separate BFS per gate or multi-source BFS, with costs.",
      "The costly approach is a separate BFS from each gate, repeating the whole sweep k times.",
      "Key property: all gates are sources at distance 0, and a single frontier can expand from all of them simultaneously.",
      "Approach: seed every gate into the queue at distance 0 and run one BFS.",
      "Reasoning: one combined wavefront assigns each cell its nearest-gate distance in O(V+E); running BFS per gate costs O(k·(V+E)), far slower for many gates.",
      "Answer: multi-source BFS — seed all gates at distance 0 and run one BFS, O(V+E), versus O(k·(V+E)) for per-gate BFS."
    ],
    "recognition": {
      "scenario": "In a grid every empty cell must learn its distance to the NEAREST of several gates.",
      "approaches": [
        {
          "id": "multi-source-bfs",
          "label": "Multi-source BFS seeding all gates at distance 0",
          "requiredReasonIds": [
            "seed-all-sources"
          ]
        },
        {
          "id": "bfs-per-gate",
          "label": "Run a separate BFS from each gate",
          "requiredReasonIds": [],
          "rejectionFeedback": "One BFS per gate is O(k·(V + E)) for k gates and recomputes overlapping frontiers, far slower than seeding them all at once."
        }
      ],
      "reasons": [
        {
          "id": "seed-all-sources",
          "text": "Putting every gate in the queue at distance 0 lets a single BFS expand all frontiers together, so each cell is first reached by its nearest gate — O(V + E)."
        },
        {
          "id": "per-gate-same-cost",
          "text": "Running a separate BFS from each gate costs the same as one multi-source BFS.",
          "contradictory": true
        },
        {
          "id": "cant-seed-multiple",
          "text": "BFS can only start from one source, so multiple gates must be handled one at a time.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "multi-source-bfs"
      ],
      "modelExplanation": "Multi-source BFS: seed all gates at distance 0 and run one BFS — O(V + E). Separate BFS per gate is O(k·(V + E)) for k gates, far slower."
    }
  },
  {
    "id": "msbfs-fix-1",
    "kind": "fix-mistake",
    "prompt": "Complete `seed_sources(n, sources)`: return the initial `(dist, queue)` for multi-source BFS over n vertices. This seeds only the first source — fix it to seed all sources.",
    "starterCode": "from collections import deque\ndef seed_sources(n, sources):\n    dist = [-1] * n\n    q = deque()\n    dist[sources[0]] = 0\n    q.append(sources[0])\n    return dist, list(q)",
    "expected": "from collections import deque\ndef seed_sources(n, sources):\n    dist = [-1] * n\n    q = deque()\n    for s in sources:\n        if dist[s] == -1:\n            dist[s] = 0\n            q.append(s)\n    return dist, list(q)",
    "hints": [
      "Goal: fix multi-source BFS so distances are measured from all sources at once.",
      "Seeding only the first source makes every distance wrong.",
      "Key insight: in multi-source BFS every source starts at distance 0 in the same queue.",
      "Approach: loop over all sources, setting distance 0 and enqueuing each.",
      "Pseudocode: dist = [-1]*n; q = deque(); for s in sources: dist[s] = 0; q.append(s).",
      "Replace the single seed with `for s in sources: dist[s] = 0; q.append(s)`."
    ],
    "tests": "dist, q = seed_sources(5, [0, 4])\nassert dist == [0, -1, -1, -1, 0], f'all sources start at distance 0 (buggy seeds only the first), got {dist}'\nassert sorted(q) == [0, 4], f'all sources enqueued, got {sorted(q)}'\ndist, q = seed_sources(3, [1])\nassert dist == [-1, 0, -1] and q == [1], 'single source'\ndist, q = seed_sources(4, [0, 1, 2, 3])\nassert dist == [0, 0, 0, 0] and sorted(q) == [0, 1, 2, 3], 'every vertex a source'\ndist, q = seed_sources(2, [])\nassert dist == [-1, -1] and q == [], 'no sources leaves all unreached'\nprint('OK')"
  }
],

  review: "Multi-source BFS computes distances from a set of sources in one queue traversal. Deduplicate seeding, count input source entries k, and use the directed edge orientation the question requires: O(k+V+E), or O(V+E) for distinct sources.",

  expectedOutput: "[0, 1, 2, 1, 0]\n",

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
    contentHash: "14146ab50bd23b4d",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
