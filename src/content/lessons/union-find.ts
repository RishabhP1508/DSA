/**
 * Lesson: Union-Find (Graphs). Verified on CPython 3.14.
 * Output: "2\nTrue\nFalse\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))   # each node starts as its own root
        self.rank = [0] * n            # tree height hint for balancing
        self.count = n                 # number of disjoint sets
    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]  # path compression
            x = self.parent[x]
        return x
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False               # already connected
        if self.rank[ra] < self.rank[rb]:   # union by rank: attach smaller tree
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        self.count -= 1
        return True

uf = UnionFind(5)
uf.union(0, 1)
uf.union(1, 2)
uf.union(3, 4)
print(uf.count)                        # {0,1,2} and {3,4} -> 2 sets
print(uf.find(0) == uf.find(2))        # connected -> True
print(uf.find(0) == uf.find(3))        # different sets -> False`;

export const unionFind: LessonDefinition = {
  id: "union-find",
  title: "Union-Find (Disjoint Set Union)",
  area: "Graphs",
  prerequisites: ["connected-components"],

  explanation: "**Union-Find (DSU)** maintains disjoint groups. find(x) returns a representative; union(a,b) merges groups when their representatives differ. It supports incremental undirected connectivity and cycle checks, but it does not provide paths, shortest distances, or efficient arbitrary edge deletion.\n\nTwo optimizations work together. Union by rank attaches a smaller-rank root to a larger-rank root, increasing rank only when equal ranks merge. Rank is an upper bound on height after compression, not the current measured height. The displayed find uses **path halving**: point a visited node at its grandparent and advance there.\n\nInitializing n elements costs O(n) time and stored space. After initialization, m finds/unions cost O(m*α(n)) amortized with both optimizations, while an individual operation can take O(log(n+1)) worst-case. Its iterative working space is O(1). Rank alone guarantees logarithmic height; omitting both balancing and compression can create a linear chain.",

  vocabulary: [
    { term: "Disjoint sets", definition: "A partition of elements into non-overlapping groups." },
    { term: "find(x)", definition: "Returns the representative root of x's set; equal roots ⇒ same set." },
    { term: "union(a, b)", definition: "Merges the sets containing a and b." },
    { term: "Path compression", definition: "Flattening the tree during find so future finds are faster." },
    { term: "Union by rank/size", definition: "Attaching the smaller/shorter tree under the larger to stay shallow." },
    { term: "Inverse Ackermann α(n)", definition: "A function ≤ ~4 for all practical n; the amortized cost per op." },
  ],

  concepts: {
  "purpose": "Maintain disjoint sets with near-constant-time merge and connectivity queries as edges arrive.",
  "operations": "find (with path compression), union (by rank/size); track set count.",
  "uses": "Dynamic connectivity, Kruskal's MST cycle check, grouping/equivalence, percolation, account merging.",
  "tradeoffs": "Excellent for incremental undirected connectivity; it cannot reconstruct paths or efficiently undo arbitrary deletions. Rank alone is logarithmic, while rank plus compression is inverse-Ackermann amortized.",
  "commonMistakes": "Omitting path compression / union by rank (degrades toward O(n) per op); comparing elements instead of roots; forgetting union returns whether a merge happened (cycle check).",
  "edgeCases": "union of already-connected elements is a no-op (returns False, useful for cycle detection). Each element starts in its own set. No efficient split/delete."
},

  complexity: [
  {
    "operation": "find / union",
    "best": "O(1)",
    "worst": "O(log(n+1))",
    "space": "O(1) working; O(n) retained DSU",
    "note": "O(α(n)) amortized over a sequence with both rank and path halving; initialization O(n)."
  }
],

  complexityExplanation: {
  "scope": "operation",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements"
    }
  ],
  "costModel": "find climbs parent pointers (shortened by path compression); union does two finds plus O(1) pointer updates.",
  "time": {
    "bound": "O(α(n))",
    "case": "amortized",
    "explanation": "Rank and path halving jointly give inverse-Ackermann amortized cost after initialization. A single call may traverse a logarithmic path.",
    "otherCases": [
      {
        "case": "worst",
        "bound": "O(log(n+1))",
        "note": "Individual operation with union by rank."
      }
    ]
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Iterative find and union use a constant number of indices; parent/rank arrays are the stored data structure.",
    "inputOutputNote": "The DSU stores O(n) parent/rank entries. Initializing them costs O(n), so initialization plus m operations costs O(n+m*α(n))."
  },
  "derivation": [
    {
      "lines": [
        6,
        7,
        8,
        9,
        10
      ],
      "description": "find climbs to the root, flattening the path (compression) — amortized O(α(n)).",
      "cost": "O(α(n))",
      "dimension": "time"
    },
    {
      "lines": [
        11,
        12,
        15,
        16,
        17,
        18
      ],
      "description": "union does two finds and O(1) rank-based linking.",
      "cost": "O(α(n))",
      "dimension": "time"
    },
    {
      "lines": [
        3,
        4
      ],
      "description": "Per-operation indices and representatives use constant working space; parent/rank storage is reported separately.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Valid element indices 0..n−1; n>=0.",
    "The amortized theorem requires both rank balancing and path halving/compression.",
    "Bounds describe one operation after initialization; the DSU’s retained arrays are stored state."
  ],
  "tradeoffs": "Vs BFS/DFS component counting (O(V+E) per query), Union-Find handles incremental edges in amortized O(α) per union — far better for a stream of connections — but can't reconstruct paths or efficiently delete edges.",
  "counters": [],
  "fixedDataNote": "This run does 3 unions on 5 elements, leaving 2 sets; connectivity queries confirm {0,1,2} vs {3,4}. Each op is amortized O(α(n)) ≈ O(1).",
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

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": true,
    "explanation": "Define the UnionFind class."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Constructor for n elements."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "parent[i] = i: each element is initially its own root."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Initialize rank zero; rank is a height upper bound after compression, not an exact current height."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "count = number of disjoint sets."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "find(x): climb to the root of x's set."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "While x is not its own parent..."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Path halving rewires the current node to its grandparent, shortening later finds."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "...and move up."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Return the root."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "union(a, b): merge their sets."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Find both roots."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "If already the same root, they're connected..."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "...so no merge happens (returns False — useful for cycle detection)."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Union by rank: ensure ra is the taller tree..."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "...swapping if needed."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Attach the shorter tree's root under the taller."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "If ranks were equal, the merged tree grew by one."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "Bump the rank."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "One fewer disjoint set."
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "Return True (a merge occurred)."
  },
  {
    "line": 22,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "Create a Union-Find over 5 elements."
  },
  {
    "line": 24,
    "executable": true,
    "explanation": "Merge 0 and 1."
  },
  {
    "line": 25,
    "executable": true,
    "explanation": "Merge 1 and 2 (now {0,1,2})."
  },
  {
    "line": 26,
    "executable": true,
    "explanation": "Merge 3 and 4 (now {3,4})."
  },
  {
    "line": 27,
    "executable": true,
    "explanation": "count → 2 disjoint sets."
  },
  {
    "line": 28,
    "executable": true,
    "explanation": "0 and 2 share a root → True."
  },
  {
    "line": 29,
    "executable": true,
    "explanation": "0 and 3 are in different sets → False."
  }
],

  bindings: [
  {
    "variable": "uf",
    "model": "object"
  },
  {
    "variable": "uf",
    "model": "array",
    "path": "parent"
  }
],

  prediction: [
    { atEventIndex: 0, prompt: "What do path compression and union by rank together achieve, and why not omit them?", answer: "Together they keep the trees nearly flat, giving amortized O(α(n)) ≈ O(1) per operation. Omitting them lets trees grow to O(n) height, degrading find/union toward O(n).", explanation: "Path compression shortens paths during find; union by rank avoids tall trees on merge. Without them, chains of unions can build linear-height trees, so each find becomes slow — the optimizations are what make DSU near-constant." },
  ],

  experiments: [
  "Compare rank-only, halving-only and neither optimization. Rank-only keeps logarithmic height; removing both can form a linear chain.",
  "Use union's return value to detect a cycle while adding edges.",
  "Track count after each union to watch components merge."
],

  exercises: [
    {
      id: "uf-choose-1",
      kind: "choose-approach",
      prompt: "Edges are added one at a time and after each you must answer 'are u and v connected?'. Union-Find or repeated BFS/DFS? Complexity?",
      expected: "Union-Find: each union and connectivity query is amortized O(α(n)) ≈ O(1), so a stream of edges/queries is near-linear. Repeated BFS/DFS is O(V + E) per query — far slower for many incremental operations.",
      hints: ["Edges arrive incrementally.", "Re-traversing per query is expensive.", "Union-Find answers connectivity in ~O(1) amortized."],
    },
    {
      id: "uf-complete-1",
      kind: "complete-code",
      prompt: "Complete find with path compression (point each node to its grandparent).",
      starterCode: "def find(self, x):\n    while self.parent[x] != x:\n        # TODO: path compression, then move up\n        pass\n    return x",
      expected: "def find(self, x):\n    while self.parent[x] != x:\n        self.parent[x] = self.parent[self.parent[x]]\n        x = self.parent[x]\n    return x",
      hints: ["Point x to its grandparent to flatten.", "Then advance x upward.", "self.parent[x] = self.parent[self.parent[x]]; x = self.parent[x]"],
    },
  ],

  review: `**Union-Find (DSU)** maintains disjoint sets with **find** (representative root) and **union** (merge). With **path compression** + **union by rank**, each operation is amortized **O(α(n))** — effectively constant — using **O(n)** space. It excels at **dynamic connectivity** (incremental edges) where traversal would re-scan the whole graph, and it's the cycle-check backbone of **Kruskal's MST**. Cue: dynamic "connect / are-connected" → Union-Find.`,

  expectedOutput: "2\nTrue\nFalse\n",

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
    contentHash: "f685346da91b8a96",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
