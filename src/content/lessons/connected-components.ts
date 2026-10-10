/**
 * Lesson: Connected components (Graphs). Verified on CPython 3.14. Output: "2\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `from collections import defaultdict

# Count connected components: run a traversal from each unvisited vertex.
def count_components(n, edges):
    adj = defaultdict(list)
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    seen = set()
    count = 0
    for start in range(n):
        if start not in seen:      # a new, unreached vertex = a new component
            count += 1
            stack = [start]        # flood-fill this component with DFS
            seen.add(start)
            while stack:
                node = stack.pop()
                for nb in adj[node]:
                    if nb not in seen:
                        seen.add(nb)
                        stack.append(nb)
    return count

# 5 vertices; {0,1,2} connected and {3,4} connected -> 2 components.
print(count_components(5, [(0, 1), (1, 2), (3, 4)]))`;

export const connectedComponents: LessonDefinition = {
  id: "connected-components",
  title: "Connected Components",
  area: "Graphs",
  prerequisites: ["graph-dfs", "graph-bfs"],

  explanation: `A **connected component** is a maximal group of vertices that are all reachable from each other. Counting components answers "how many separate pieces is this graph in?" — used for grouping (friend circles, islands in a grid, network partitions).

The idea is simple and powerful: **loop over every vertex; each time you find one that hasn't been visited yet, it starts a new component** — increment the count and run a full traversal (BFS or DFS) that marks everything reachable from it. Every vertex you reach belongs to that component, so it won't start another. Repeat until all vertices are visited. Here vertices {0,1,2} form one component and {3,4} another, so the answer is **2**.

The whole thing is **O(V + E)** time even though it launches multiple traversals — because the shared visited set ensures **each vertex and edge is processed once across all of them combined**. That's the key insight: the outer loop is O(V), and the traversals collectively cost O(V + E), not O(V) times O(V + E). Space is O(V). This "traverse from each unvisited vertex" template also computes component *sizes*, labels each vertex's component, and is the grid-traversal skeleton behind "number of islands." (Union-find, a later lesson, is an alternative especially good when edges arrive incrementally.)`,

  vocabulary: [
    { term: "Connected component", definition: "A maximal set of mutually reachable vertices." },
    { term: "Flood fill", definition: "Traversing (BFS/DFS) to mark every vertex reachable from a start." },
    { term: "Component count", definition: "How many separate connected pieces a graph has." },
    { term: "Shared visited set", definition: "One `seen` set across all traversals, keeping total work at O(V + E)." },
    { term: "Islands problem", definition: "Grid version: count connected groups of filled cells." },
  ],

  concepts: {
  "purpose": "Partition a graph into its connected pieces and count/label them.",
  "operations": "Loop over vertices; from each unvisited one, run a traversal marking its whole component.",
  "uses": "Counting groups/clusters, number of islands, network partition detection, component labelling.",
  "tradeoffs": "O(V + E) total with one traversal pass; union-find is an alternative for dynamic/incremental edges.",
  "commonMistakes": "Using a fresh visited set per traversal (breaks the O(V+E) bound and correctness); counting a component once per vertex; forgetting to cover isolated vertices.",
  "edgeCases": "This counts undirected connected components. Vertex labels are 0..n−1 and edge endpoints must be in that range. n=0 gives zero components; n isolated vertices give n. Directed strong/weak components need separate definitions."
},

  complexity: [
  {
    "operation": "Count components",
    "best": "O(V + E)",
    "average": "O(V + E)",
    "worst": "O(V + E)",
    "space": "O(V+E)",
    "note": "Includes adjacency constructed from the input edge list, plus seen state and an explicit stack."
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
  "costModel": "The outer loop touches each vertex once; the traversals, sharing one visited set, process each vertex and edge once in total.",
  "time": {
    "bound": "O(V + E)",
    "case": "worst",
    "explanation": "It looks like it could be expensive — a traversal launched from many vertices — but the SHARED visited set means no vertex is ever processed twice. The outer loop is O(V), and across ALL the traversals combined every vertex is popped once (O(V)) and every edge scanned once (O(E)). So the total is O(V + E), not O(V) × O(V + E). This is the crucial 'amortized over one shared visited set' argument."
  },
  "space": {
    "bound": "O(V+E)",
    "case": "worst",
    "explanation": "The function builds adjacency lists from the input edge list, using O(V+E), then uses O(V) seen flags and stack/frames. The constructed adjacency is auxiliary storage, not supplied input.",
    "inputOutputNote": "Input is n and an O(E) edge list. Internally constructed adjacency, seen state and stack count as auxiliary; the returned count is scalar."
  },
  "derivation": [
    {
      "lines": [
        11,
        12
      ],
      "description": "The outer loop visits each vertex once to find new components.",
      "cost": "O(V)",
      "dimension": "time"
    },
    {
      "lines": [
        16,
        17,
        18,
        19,
        20,
        21
      ],
      "description": "All traversals combined pop each vertex once and scan each edge once (shared visited set).",
      "cost": "O(V + E)",
      "dimension": "time"
    },
    {
      "lines": [
        9,
        14
      ],
      "description": "Visited set and stack hold up to V vertices.",
      "cost": "O(V)",
      "dimension": "space"
    },
    {
      "lines": [
        5,
        6,
        7
      ],
      "description": "Build the undirected adjacency representation inside the function.",
      "cost": "O(V+E)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "One shared visited set across all traversals.",
    "Set/stack ops are O(1).",
    "Undirected graph (components are symmetric).",
    "Undirected input; n is nonnegative and endpoints are valid vertex labels."
  ],
  "tradeoffs": "Union-find also counts components in near-O(V + E·α) and handles edges added incrementally without re-traversing; the traversal approach is simplest for a static graph.",
  "counters": [
    {
      "label": "new components",
      "definition": "increments of the component count (line 13)",
      "countLines": [
        13
      ]
    }
  ],
  "fixedDataNote": "This run on 5 vertices with edges {0-1,1-2,3-4} finds 2 components. The O(V+E) bound holds because the traversals share one visited set.",
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

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import defaultdict." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: traverse from each unvisited vertex." },
    { line: 4, executable: true, explanation: "Define count_components(n, edges)." },
    { line: 5, executable: true, explanation: "Build the adjacency list." },
    { line: 6, executable: true, explanation: "For each edge..." },
    { line: 7, executable: true, explanation: "...add both directions (undirected)." },
    { line: 8, executable: true, explanation: "Second direction." },
    { line: 9, executable: true, explanation: "One shared visited set across all traversals." },
    { line: 10, executable: true, explanation: "Component counter." },
    { line: 11, executable: true, explanation: "Loop over every vertex 0..n-1." },
    { line: 12, executable: true, explanation: "If a vertex hasn't been reached, it begins a NEW component." },
    { line: 13, executable: true, explanation: "Count the new component." },
    { line: 14, executable: true, explanation: "Start a DFS flood-fill from it." },
    { line: 15, executable: true, explanation: "Mark the start seen." },
    { line: 16, executable: true, explanation: "Traverse the whole component." },
    { line: 17, executable: true, explanation: "Pop a vertex." },
    { line: 18, executable: true, explanation: "For each neighbour..." },
    { line: 19, executable: true, explanation: "...if unseen..." },
    { line: 20, executable: true, explanation: "...mark it..." },
    { line: 21, executable: true, explanation: "...and push it (stays within this component)." },
    { line: 22, executable: true, explanation: "Return the component count." },
    { line: 23, executable: false, explanation: "Blank line." },
    { line: 24, executable: false, explanation: "Comment: 5 vertices; {0,1,2} and {3,4} connected → 2 components." },
    { line: 25, executable: true, explanation: "count_components(5, [(0,1),(1,2),(3,4)]) → 2." },
  ],

  bindings: [
    { variable: "adj", model: "graph", directed: false, overlays: [{ role: "visited", label: "seen", source: "seen" }] },
  ],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "Why is counting components O(V + E) total even though a traversal is launched from many vertices?",
    "answer": "All component traversals share one seen set, so each vertex is removed once and each adjacency entry scanned once. An undirected edge has two entries, still O(E) total.",
    "explanation": "Marking on push prevents duplicate pending vertices. The launches partition one traversal sweep; adjacency construction and the outer vertex loop add O(E) and O(V)."
  }
],

  experiments: [
    "Track and print each component's size as you flood-fill.",
    "Add an isolated vertex and confirm it counts as its own component.",
    "Label each vertex with its component id instead of just counting.",
  ],

  exercises: [
    {
      id: "cc-complete-1",
      kind: "complete-code",
      prompt: "Return the SIZE of the largest connected component.",
      starterCode: "from collections import defaultdict\ndef largest(n, edges):\n    adj = defaultdict(list)\n    for u, v in edges:\n        adj[u].append(v); adj[v].append(u)\n    seen = set()\n    best = 0\n    for s in range(n):\n        if s not in seen:\n            size = 0\n            stack = [s]; seen.add(s)\n            while stack:\n                node = stack.pop()\n                size += 1\n                for nb in adj[node]:\n                    if nb not in seen:\n                        seen.add(nb); stack.append(nb)\n            # TODO: update best\n    return best",
      expected: "from collections import defaultdict\ndef largest(n, edges):\n    adj = defaultdict(list)\n    for u, v in edges:\n        adj[u].append(v); adj[v].append(u)\n    seen = set()\n    best = 0\n    for s in range(n):\n        if s not in seen:\n            size = 0\n            stack = [s]; seen.add(s)\n            while stack:\n                node = stack.pop()\n                size += 1\n                for nb in adj[node]:\n                    if nb not in seen:\n                        seen.add(nb); stack.append(nb)\n            best = max(best, size)\n    return best",
      hints: ["Count vertices as you flood-fill this component.", "After the traversal, compare to the best so far.", "best = max(best, size)"],
    },
    {
      id: "cc-choose-1",
      kind: "choose-approach",
      prompt: "Edges of a graph arrive one at a time and you must report the component count after each addition. Repeated traversal or union-find?",
      expected: "Union-find: each edge union is near O(α) (almost constant), so it handles incremental edges without re-traversing the whole graph. Repeated full traversals would be O(V + E) per query — far slower for a stream of edges.",
      hints: ["Edges arrive incrementally.", "Re-traversing per edge is expensive.", "Union-find merges components in near-constant time."],
    },
  ],

  review: "For an undirected graph, flood-fill each unvisited vertex and count one new component. One shared seen set keeps total traversal time O(V+E). This function builds adjacency from an edge list, so auxiliary storage is O(V+E), including its O(V) seen set and stack. Isolated vertices are components; directed strong components require another algorithm.",

  expectedOutput: "2\n",

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
    contentHash: "c85962fa5228cb99",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
