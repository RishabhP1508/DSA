/**
 * Pattern: Union-Find (Disjoint Set Union).
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "True\nFalse\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# Union-Find (DSU): near-constant merge and "same group?" queries.
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))     # each element starts as its own root
        self.rank = [0] * n              # tree-height hint for balanced unions
    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]   # path compression
            x = self.parent[x]
        return x
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False                 # already in the same set
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra              # attach the shorter tree under the taller
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        return True

dsu = DSU(5)
dsu.union(0, 1)
dsu.union(1, 2)
dsu.union(3, 4)
print(dsu.find(0) == dsu.find(2))   # same set {0,1,2} -> True
print(dsu.find(0) == dsu.find(3))   # different sets -> False`;

export const unionFindPattern: PatternDefinition = {
  id: "union-find",
  title: "Union-Find (Disjoint Set Union)",
  category: "Graphs & trees",
  summary:
    "Maintain disjoint sets with near-constant union and 'same set?' queries using path compression and union by rank.",

  clues: [
    "You repeatedly MERGE groups and ask whether two elements are in the same group.",
    "Edges/connections arrive INCREMENTALLY (dynamic connectivity), or you detect cycles while adding edges.",
    "Phrases like 'number of connected components (with unions)', 'redundant connection', 'accounts merge', 'Kruskal's MST', 'friend circles'.",
  ],

  naiveApproach: `Re-running BFS/DFS for every 'are these connected?' query is **O(V+E) per query** — crippling when there are many queries or the graph keeps changing. Storing an explicit group id and relabeling on every merge is **O(n) per union**.`,

  whyItHelps: "A parent forest remembers previous unions. Rank balancing limits height; path halving shortens visited paths. After O(n) initialization, each operation costs O(α(n)) amortized across a sequence, though one call may take O(log(n+1)). This supports incremental undirected connectivity and redundant-edge detection.",

  conditions: [
  "The relation is an equivalence (reflexive, symmetric, transitive) — sets only ever MERGE, never split.",
  "Use BOTH path compression and union by rank/size for near-constant amortized cost.",
  "Elements map to integer indices (or use a dict-based parent map).",
  "Undirected connectivity/equivalence sets; DSU does not track directed reachability or reconstruct paths. Rank is a height upper bound after compression."
],

  alternatives: [
    "DFS/BFS connected components — simpler when the graph is STATIC and you compute components once.",
    "Interval/graph-specific structures — when you also need path details, distances, or ordering (DSU only answers 'same set?').",
    "DSU can't efficiently SPLIT sets — if you must remove edges, consider offline processing in reverse or link-cut trees.",
  ],

  counterexamples: [
    "If you must DELETE connections and re-query, plain DSU can't undo unions — it only merges.",
    "'Shortest path' or 'distance between nodes' isn't a DSU query — it only tells membership, not paths.",
    "Skipping path compression / union by rank degrades operations toward O(n) per call.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "True\nFalse\n",
  complexityNote:
    "After O(n) initialization/storage, rank plus path halving gives O(α(n)) amortized per find/union; one operation can take O(log(n+1)). Iterative working space is O(1).",

  complexityExplanation: {
  "scope": "operation",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements"
    },
    {
      "symbol": "α(n)",
      "meaning": "the inverse Ackermann function (≤ 4 for any practical n)"
    }
  ],
  "costModel": "Disjoint-set with path compression (find) and union by rank. The two optimisations together give near-constant amortised cost per operation.",
  "time": {
    "bound": "O(α(n))",
    "case": "amortized",
    "explanation": "Both rank and halving justify the sequence bound after initialization. A single find/union can still take logarithmic time.",
    "otherCases": [
      {
        "case": "worst",
        "bound": "O(log(n+1))",
        "note": "An individual operation with rank balancing."
      }
    ]
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "A single iterative operation stores a constant number of indices; the retained parent/rank arrays belong to the DSU state.",
    "inputOutputNote": "DSU initialization uses O(n) time and retained entries. A sequence of m operations including initialization costs O(n+m*α(n))."
  },
  "derivation": [
    {
      "lines": [
        7,
        8,
        9
      ],
      "description": "find walks to the root with path compression.",
      "cost": "O(α(n)) amortized",
      "dimension": "time"
    },
    {
      "lines": [
        12,
        15,
        16,
        17
      ],
      "description": "union by rank keeps trees shallow.",
      "cost": "O(α(n)) amortized",
      "dimension": "time"
    },
    {
      "lines": [
        4,
        5
      ],
      "description": "Per-operation indices are constant working storage; DSU arrays are stored state.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Both rank balancing and path halving are used; rank alone guarantees O(log n) individual operations.",
    "Valid element indices and constant-cost list indexing.",
    "Operation scope excludes O(n) initialization and retained arrays."
  ],
  "tradeoffs": "Without the optimisations, find/union degrade to O(n) (a linked chain). Union by rank alone gives O(log n); adding path compression gives the near-constant α(n).",
  "counters": [
    {
      "label": "unions attempted",
      "definition": "executions of the find pair in union (line 12)",
      "countLines": [
        12
      ]
    }
  ],
  "fixedDataNote": "Merging {0,1,2} and {3,4} then querying takes a handful of near-constant ops. The α(n) amortised bound generalises.",
  "references": [
    {
      "url": "https://cp-algorithms.com/data_structures/disjoint_set_union.html",
      "title": "CP Algorithms: disjoint-set union",
      "section": "Path compression; union by rank; time complexity",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "Rank plus compression gives amortized inverse-Ackermann cost.",
        "Rank alone bounds an individual operation logarithmically."
      ],
      "conventions": [
        "App uses iterative path halving, a compression variant."
      ],
      "accessDate": "2026-10-10"
    },
    {
      "url": "https://raw.githubusercontent.com/kevin-wayne/algs4/master/src/main/java/edu/princeton/cs/algs4/UF.java",
      "title": "Princeton algs4: rank and path-halving union-find",
      "section": "Class documentation lines 57–68; find lines 109–115; union lines 149–159",
      "topic": "trees-graphs-range",
      "purpose": "Cross-check the exact implementation variant and boundary contract.",
      "verifiedClaims": [
        "Rank plus path halving gives an inverse-Ackermann amortized operation bound.",
        "Initialization is linear; an individual worst-case operation may be logarithmic.",
        "Only equal-rank unions increase the surviving rank."
      ],
      "conventions": [
        "Source Java implementation; app uses the same rank and halving strategy in Python.",
        "App reports retained parent/rank arrays separately from constant working space per operation."
      ],
      "accessDate": "2026-10-10"
    }
  ]
},

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: DSU for merge + same-group queries." },
    { line: 2, executable: true, explanation: "Define the DSU class." },
    { line: 3, executable: true, explanation: "Constructor for n elements." },
    { line: 4, executable: true, explanation: "Each element starts as its own root (singleton set)." },
    { line: 5, executable: true, explanation: "Rank hints keep union trees shallow." },
    { line: 6, executable: true, explanation: "find(x): locate x's set representative (root)." },
    { line: 7, executable: true, explanation: "Walk up until a node is its own parent." },
    { line: 8, executable: true, explanation: "Path compression: point x at its grandparent to flatten the tree." },
    { line: 9, executable: true, explanation: "Advance toward the root." },
    { line: 10, executable: true, explanation: "Return the root." },
    { line: 11, executable: true, explanation: "union(a, b): merge the sets containing a and b." },
    { line: 12, executable: true, explanation: "Find both roots." },
    { line: 13, executable: true, explanation: "If already the same set..." },
    { line: 14, executable: true, explanation: "...nothing to merge (also flags a cycle in Kruskal)." },
    { line: 15, executable: true, explanation: "Union by rank: ensure ra is the taller root..." },
    { line: 16, executable: true, explanation: "...by swapping if needed." },
    { line: 17, executable: true, explanation: "Attach the shorter tree under the taller root." },
    { line: 18, executable: true, explanation: "If ranks tied..." },
    { line: 19, executable: true, explanation: "...the merged tree grew by one level." },
    { line: 20, executable: true, explanation: "Report that a merge happened." },
    { line: 21, executable: false, explanation: "Blank line." },
    { line: 22, executable: true, explanation: "Build a DSU over 5 elements." },
    { line: 23, executable: true, explanation: "Merge 0 and 1." },
    { line: 24, executable: true, explanation: "Merge 1 and 2 (now {0,1,2})." },
    { line: 25, executable: true, explanation: "Merge 3 and 4 (now {3,4})." },
    { line: 26, executable: true, explanation: "0 and 2 share a root -> True." },
    { line: 27, executable: true, explanation: "0 and 3 are in different sets -> False." },
  ],

  bindings: [
  {
    "variable": "dsu",
    "model": "object"
  },
  {
    "variable": "dsu",
    "model": "array",
    "path": "parent"
  }
],

  linkedLessons: ["union-find", "kruskal", "connected-components"],

  exercises: [
  {
    "id": "pat-uf-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'Edges are added one by one; report when an edge first connects two already-connected nodes (a redundant edge).' Which pattern?",
    "expected": "Union-Find: union each edge's endpoints; if find(a) == find(b) before the union, this edge is redundant (creates a cycle). Near-O(1) per operation with path compression + union by rank.",
    "correctPatternId": "union-find",
    "hints": [
      "Goal: as edges arrive, report when one first connects two already-connected nodes (a redundant edge).",
      "Re-checking connectivity from scratch per edge is slow; a structure that remembers merges is far cheaper.",
      "Key insight: an edge is redundant exactly when its endpoints already share a root before union.",
      "Approach: use Union-Find with path compression and union by rank.",
      "Pseudocode: for each edge: if find(a)==find(b) it's redundant; otherwise union(a,b).",
      "Use Union-Find: if find(a)==find(b) before the union the edge is redundant (creates a cycle) — near-O(1) per op."
    ],
    "recognition": {
      "scenario": "Edges are added one by one; report when an edge first connects two already-connected nodes (a redundant edge).",
      "approaches": [
        {
          "id": "union-find",
          "label": "Union-Find with path compression + union by rank",
          "requiredReasonIds": [
            "find-before-union"
          ]
        },
        {
          "id": "dfs-per-edge",
          "label": "Re-run DFS/BFS after each edge",
          "requiredReasonIds": [],
          "rejectionFeedback": "Re-traversing per edge is O(V+E) each time — far too slow for a stream of edges."
        }
      ],
      "reasons": [
        {
          "id": "find-before-union",
          "text": "For each edge, if find(a) == find(b) before uniting, the endpoints were already connected and this edge is redundant — near-O(1) per operation."
        },
        {
          "id": "static-graph",
          "text": "The graph is fixed, so a single traversal answers everything.",
          "contradictory": true
        },
        {
          "id": "weighted-mst",
          "text": "You must minimize total edge weight, so this needs an MST algorithm.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "union-find"
      ],
      "modelExplanation": "Union-Find: union each edge's endpoints, and a same-root find before uniting marks the redundant edge — near-O(1) per op with path compression and union by rank."
    }
  },
  {
    "id": "pat-uf-choose-1",
    "kind": "choose-approach",
    "prompt": "The graph is fixed and you need to count its connected components exactly once. Union-Find or DFS?",
    "expected": "A single DFS/BFS sweep is direct for static components. Union-Find also works: initialize V sets, union each edge and count surviving groups. Prefer DSU when connectivity updates or queries repeat.",
    "correctPatternId": "graph-dfs-components",
    "hints": [
      "Goal: count the connected components of a fixed graph exactly once.",
      "Union-Find's strength is dynamic edges and repeated queries, which a one-shot static count doesn't need.",
      "Key insight: for a single static pass, a plain traversal is simpler and equally efficient.",
      "Approach: use DFS/BFS, counting one component per new unvisited start.",
      "Pseudocode: for each unvisited node: launch DFS/BFS over its component and add one to the count.",
      "Either works, but DFS/BFS is simpler for a one-time static count (O(V+E)); Union-Find shines for dynamic edges or many queries."
    ],
    "recognition": {
      "scenario": "The graph is FIXED and you need to count its connected components exactly once.",
      "approaches": [
        {
          "id": "dfs-count",
          "label": "One-pass DFS/BFS component count",
          "requiredReasonIds": [
            "static-single-pass"
          ]
        },
        {
          "id": "union-find",
          "label": "Union-Find",
          "requiredReasonIds": [
            "union-static-edges"
          ]
        }
      ],
      "reasons": [
        {
          "id": "static-single-pass",
          "text": "The graph does not change and you count once, so a single traversal launching a search per unvisited node is simplest — O(V+E)."
        },
        {
          "id": "uf-dynamic",
          "text": "When edges arrive incrementally or many connectivity queries are made, Union-Find's near-constant operations avoid re-traversing the whole graph."
        },
        {
          "id": "shortest-path",
          "text": "You need shortest weighted paths, so a heap is required.",
          "contradictory": true
        },
        {
          "id": "union-static-edges",
          "text": "Start with V components, union every undirected edge and decrement the count on each successful merge. This is also valid for a one-time static count."
        }
      ],
      "acceptableApproachIds": [
        "dfs-count",
        "union-find"
      ],
      "alternatives": [],
      "modelExplanation": "A single DFS/BFS sweep is direct for static components. Union-Find also works: initialize V sets, union each edge and count surviving groups. Prefer DSU when connectivity updates or queries repeat."
    }
  },
  {
    "id": "pat-uf-fix-1",
    "kind": "fix-mistake",
    "prompt": "This find fragment has no compression and may walk an O(n) chain when the host’s unions did not balance it. Add iterative path halving. Rank-balanced hosts already guarantee O(log n) individual finds.",
    "starterCode": "def find(self, x):\n    while self.parent[x] != x:\n        x = self.parent[x]\n    return x",
    "expected": "def find(self, x):\n    while self.parent[x] != x:\n        self.parent[x] = self.parent[self.parent[x]]\n        x = self.parent[x]\n    return x",
    "hints": [
      "The host exposes a parent array whose entries form a forest.",
      "Without balancing a chain may have n nodes; rank balancing alone would bound height logarithmically.",
      "Shorten the chain during find by linking a visited node to its grandparent.",
      "Use iterative path halving before advancing x.",
      "while parent[x]!=x: parent[x]=parent[parent[x]]; x=parent[x].",
      "The grandparent assignment performs path halving. The inverse-Ackermann amortized theorem additionally needs union by rank/size."
    ],
    "tests": "# find(self, x) is a method fragment; call it on a host exposing `parent`.\nclass _UF:\n    def __init__(self, parent):\n        self.parent = parent\n# Chain 0<-1<-2<-3. find must return root 0 for every node.\nu = _UF([0, 0, 1, 2])\nassert find(u, 3) == 0, f'root of the chain is 0, got {find(u, 3)}'\nassert find(u, 0) == 0, 'root points to itself'\n# Path compression: after find(3) the deep node hops nearer the root.\nu2 = _UF([0, 0, 1, 2])\nfind(u2, 3)\nassert u2.parent[3] != 2, f'compression must shorten parent[3] (no-compression leaves it 2), got {u2.parent[3]}'\nprint('OK')"
  }
],

  references: [
  {
    "url": "https://cp-algorithms.com/data_structures/disjoint_set_union.html",
    "title": "CP Algorithms: disjoint-set union",
    "section": "Path compression; union by rank; time complexity",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "Rank plus compression gives amortized inverse-Ackermann cost.",
      "Rank alone bounds an individual operation logarithmically."
    ],
    "conventions": [
      "App uses iterative path halving, a compression variant."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://raw.githubusercontent.com/kevin-wayne/algs4/master/src/main/java/edu/princeton/cs/algs4/UF.java",
    "title": "Princeton algs4: rank and path-halving union-find",
    "section": "Class documentation lines 57–68; find lines 109–115; union lines 149–159",
    "topic": "trees-graphs-range",
    "purpose": "Cross-check the exact implementation variant and boundary contract.",
    "verifiedClaims": [
      "Rank plus path halving gives an inverse-Ackermann amortized operation bound.",
      "Initialization is linear; an individual worst-case operation may be logarithmic.",
      "Only equal-rank unions increase the surviving rank."
    ],
    "conventions": [
      "Source Java implementation; app uses the same rank and halving strategy in Python.",
      "App reports retained parent/rank arrays separately from constant working space per operation."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "d29f1056463de97b",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
