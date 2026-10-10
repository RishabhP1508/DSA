/**
 * Lesson: Graph DFS (Graphs). Verified on CPython 3.14. Output: "[0, 1, 3, 2]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# DFS explores a graph as deep as possible before backtracking.
def dfs(adj, node, seen, order):
    seen.add(node)                 # mark BEFORE recursing (cycles!)
    order.append(node)
    for nb in adj[node]:
        if nb not in seen:
            dfs(adj, nb, seen, order)

g = {0: [1, 2], 1: [0, 3], 2: [0, 3], 3: [1, 2]}
order = []
dfs(g, 0, set(), order)
print(order)`;

export const graphDfs: LessonDefinition = {
  id: "graph-dfs",
  title: "Graph DFS",
  area: "Graphs",
  prerequisites: ["tree-dfs", "adjacency-lists"],

  explanation: "**Graph DFS** explores an unseen neighbor completely before trying the next. Mark a vertex before recursing, so cycles cannot repeat it. This is a graph traversal with a visited set; it follows outgoing edges in directed graphs and both stored directions in an undirected graph.\n\nThe example starts at 0 and follows neighbor order: 0, 1, 3, 2. It returns only vertices reachable from that start. Every reached vertex needs an adjacency entry, including sinks. With expected constant-cost hash-set operations, DFS visits reachable vertices and scans their adjacency entries in O(Vr+Er), bounded by O(V+E). Recursive frames and visited membership use O(V) auxiliary space; output order is separate.\n\nAn iterative stack can replace recursion. If visited is checked only when popping, multiple pending entries can exist for the same vertex, so that variant may use O(E) pending-stack space. Marking upon push prevents duplicate entries, or stack frames with neighbor iterators can reproduce recursive discovery order. Python recursion depth limits can matter on a long chain.",

  vocabulary: [
    { term: "Graph DFS", definition: "Depth-first exploration of a graph: go deep, backtrack, using a visited set." },
    { term: "Visited set", definition: "Prevents revisiting vertices; essential because graphs have cycles." },
    { term: "Backtracking", definition: "Returning to a previous vertex when the current path is exhausted." },
    { term: "Recursion stack", definition: "The implicit stack of active DFS calls; up to O(V) deep." },
    { term: "Mark-before-recurse", definition: "Marking a vertex visited before exploring its neighbours, to avoid cycles." },
  ],

  concepts: {
    purpose: "Explore a graph depth-first; the foundation of connectivity, cycles, topological sort, and pathfinding.",
    operations: "Mark the vertex visited, then recurse into each unseen neighbour (or use an explicit stack).",
    uses: "Connected components, cycle detection, topological sort, path existence, flood fill.",
    tradeoffs: "O(V + E) time, O(V) space; recursion risks stack overflow on very large/deep graphs (use an explicit stack).",
    commonMistakes: "Marking visited after recursing (cycles cause infinite recursion); forgetting the visited set entirely; assuming DFS gives shortest paths (it does not).",
    edgeCases: "Disconnected graph: one DFS reaches only the start's component (loop over all vertices to cover all). Self-loops skipped by seen. Deep chains risk recursion limits.",
  },

  complexity: [
  {
    "operation": "Graph DFS",
    "best": "O(1)",
    "average": "O(V + E)",
    "worst": "O(V + E)",
    "space": "O(V)",
    "note": "Each reached vertex is visited once; each adjacency entry is scanned once. An undirected edge appears twice."
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
  "costModel": "Set add/lookup are O(1). Each vertex is visited once; each edge is examined once from its endpoint.",
  "time": {
    "bound": "O(V + E)",
    "case": "expected",
    "explanation": "The visited set ensures each of the V vertices is entered once — O(V). At each vertex we scan its adjacency list, and across all vertices those scans total the edges — O(E). So DFS is O(V + E), identical to BFS in cost; only the traversal ORDER differs (deep vs level)."
  },
  "space": {
    "bound": "O(V)",
    "case": "worst",
    "explanation": "The visited set holds up to V vertices, and the recursion stack can reach depth O(V) for a long path (e.g. a line graph). So auxiliary space is O(V).",
    "inputOutputNote": "Exclude the input adjacency mapping and returned order list. Seen state and recursive frames use O(V) auxiliary storage."
  },
  "derivation": [
    {
      "lines": [
        3,
        4
      ],
      "description": "Each vertex is entered once (marked, recorded) — O(V) total.",
      "cost": "O(V)",
      "dimension": "time"
    },
    {
      "lines": [
        5,
        6,
        7
      ],
      "description": "Scanning all adjacency lists examines each edge once — O(E) total.",
      "cost": "O(V + E)",
      "dimension": "time"
    },
    {
      "lines": [
        3,
        7
      ],
      "description": "Visited set O(V) plus recursion stack up to O(V).",
      "cost": "O(V)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Adjacency-list graph; set ops O(1).",
    "Marking before recursing prevents infinite recursion on cycles.",
    "Valid start, closed adjacency mapping, expected constant-time visited-set operations.",
    "The main example marks before recursive descent. The pop-guard iterative exercise can keep O(E) duplicate pending entries."
  ],
  "tradeoffs": "BFS gives distance order; DFS follows deep paths. Iterative DFS avoids Python recursion limits. Marking when pushing keeps at most O(V) pending vertices; the exercise’s mark-on-pop version may hold O(E) duplicate pending entries.",
  "counters": [
    {
      "label": "vertices visited",
      "definition": "executions of the visit (line 4)",
      "countLines": [
        4
      ]
    }
  ],
  "fixedDataNote": "This run visits 4 vertices depth-first from 0 → [0,1,3,2]. The O(V+E) bound generalises to any graph.",
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
    { line: 1, executable: false, explanation: "Comment: DFS goes deep before backtracking." },
    { line: 2, executable: true, explanation: "Define recursive dfs(adj, node, seen, order)." },
    { line: 3, executable: true, explanation: "Mark this vertex visited BEFORE recursing (prevents cycle re-entry)." },
    { line: 4, executable: true, explanation: "Record it in the visit order." },
    { line: 5, executable: true, explanation: "For each neighbour..." },
    { line: 6, executable: true, explanation: "...if not yet visited..." },
    { line: 7, executable: true, explanation: "...recurse into it (dive deeper)." },
    { line: 8, executable: false, explanation: "Blank line." },
    { line: 9, executable: true, explanation: "A 4-vertex graph." },
    { line: 10, executable: true, explanation: "Prepare the order list." },
    { line: 11, executable: true, explanation: "Run DFS from 0 with a fresh visited set." },
    { line: 12, executable: true, explanation: "Print the DFS order → [0, 1, 3, 2]." },
  ],

  bindings: [
    { variable: "g", model: "graph", directed: false, overlays: [{ role: "visited", label: "seen", source: "seen" }] },
    { variable: "order", model: "array" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why must you mark a vertex visited BEFORE recursing into its neighbours?", answer: "Because graphs have cycles; if you marked after, a cycle could recurse back into a vertex already on the current path, causing infinite recursion.", explanation: "Marking before recursing guarantees that when a neighbour points back along the path, it's already in `seen` and is skipped — breaking cycles. Marking after would let the recursion re-enter the same vertex." },
  ],

  experiments: [
    "Loop DFS over all vertices to cover a disconnected graph.",
    "Rewrite DFS iteratively with an explicit stack and compare the order.",
    "Remove the visited check and observe infinite recursion on the cycle.",
  ],

  exercises: [
    {
      id: "gdfs-complete-1",
      kind: "complete-code",
      prompt: "Complete iterative DFS using an explicit stack.",
      starterCode: "def dfs_iter(adj, start):\n    seen = set()\n    stack = [start]\n    order = []\n    while stack:\n        node = stack.pop()\n        if node in seen:\n            continue\n        # TODO: mark, record, push unseen neighbours\n        pass\n    return order",
      expected: "def dfs_iter(adj, start):\n    seen = set()\n    stack = [start]\n    order = []\n    while stack:\n        node = stack.pop()\n        if node in seen:\n            continue\n        seen.add(node)\n        order.append(node)\n        for nb in adj[node]:\n            if nb not in seen:\n                stack.append(nb)\n    return order",
      hints: ["Skip already-seen nodes when popped.", "Mark and record on first visit.", "Push unseen neighbours onto the stack."],
    },
    {
      id: "gdfs-choose-1",
      kind: "choose-approach",
      prompt: "You must detect whether a graph has a cycle. BFS or DFS, and why is DFS natural here?",
      expected: "DFS — it naturally follows paths, so encountering an already-visited vertex that is not the immediate parent (undirected) or a vertex on the current recursion stack (directed) reveals a cycle. It's O(V + E).",
      hints: ["Cycle detection follows paths.", "DFS tracks the current path.", "A back-edge to the path = a cycle."],
    },
  ],

  review: `**Graph DFS** explores deep-first with a **visited set** (required for cycles), marking **before recursing**. It is **O(V + E)** time and **O(V)** space (visited set + recursion stack). It's the foundation for **components, cycle detection, topological sort, and pathfinding** (the next lessons). Same cost as BFS, but DFS goes deep (stack) rather than by level (queue) and gives no distance guarantee.`,

  expectedOutput: "[0, 1, 3, 2]\n",

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
    contentHash: "7e65de190951f31f",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
