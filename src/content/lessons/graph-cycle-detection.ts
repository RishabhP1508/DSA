/**
 * Lesson: Graph cycle detection (Graphs). Verified on CPython 3.14.
 * Output: "True\nFalse\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `from collections import defaultdict

# Detect a cycle in an UNDIRECTED graph with DFS.
def has_cycle(n, edges):
    adj = defaultdict(list)
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    seen = set()
    def dfs(node, parent):
        seen.add(node)
        for nb in adj[node]:
            if nb not in seen:
                if dfs(nb, node):
                    return True
            elif nb != parent:      # visited AND not where we came from = cycle
                return True
        return False
    for s in range(n):
        if s not in seen:
            if dfs(s, -1):
                return True
    return False

print(has_cycle(3, [(0, 1), (1, 2), (2, 0)]))   # triangle -> cycle
print(has_cycle(3, [(0, 1), (1, 2)]))            # a path -> no cycle`;

export const graphCycleDetection: LessonDefinition = {
  id: "graph-cycle-detection",
  title: "Graph Cycle Detection",
  area: "Graphs",
  prerequisites: ["graph-dfs"],

  explanation: `A **cycle** is a path that returns to a vertex it already visited. Detecting cycles matters for validating dependency graphs, spanning trees, and deadlock detection. DFS is the natural tool — it follows paths, so a cycle shows up as an edge leading back into the current path.

For an **undirected** graph, the check is: during DFS, if you reach a neighbour that is **already visited AND is not the vertex you came from (the parent)**, you've found a cycle. Excluding the parent is essential — the edge back to your parent isn't a cycle, it's just the same undirected edge you arrived on. The triangle 0–1–2–0 has a cycle (True); the path 0–1–2 does not (False).

**Directed** graphs need a different, subtler rule: a cycle exists if DFS reaches a vertex currently **on the recursion stack** (a "back edge"), which requires tracking an *in-progress* set separate from *finished* vertices — the same machinery that powers topological sort's cycle check. Both approaches are **O(V + E)** time and **O(V)** space. Recognizing which graph type you have — undirected (parent check) vs directed (recursion-stack check) — is the key decision.`,

  vocabulary: [
    { term: "Cycle", definition: "A path that revisits a vertex, closing a loop." },
    { term: "Parent (undirected)", definition: "The vertex you arrived from; the edge back to it isn't a cycle." },
    { term: "Back edge", definition: "An edge to a vertex currently on the DFS recursion stack — signals a cycle." },
    { term: "In-progress set (directed)", definition: "Vertices on the current recursion path; distinct from finished vertices." },
    { term: "Acyclic", definition: "Having no cycles (e.g. a DAG or a tree)." },
  ],

  concepts: {
  "purpose": "Determine whether a graph contains a cycle — for validation, spanning trees, and scheduling.",
  "operations": "Undirected: DFS, cycle if a visited neighbour isn't the parent. Directed: cycle if a neighbour is on the recursion stack.",
  "uses": "Detecting dependency cycles, validating DAGs, deadlock detection, spanning-tree checks.",
  "tradeoffs": "O(V + E) either way; the correct rule depends on directed vs undirected.",
  "commonMistakes": "Forgetting the parent exclusion (undirected), which falsely reports the arrival edge as a cycle; using the undirected rule on a directed graph; not covering all components.",
  "edgeCases": "Disconnected graph: check every component. Self-loop is a cycle. A tree (n-1 edges, connected) is acyclic. Treat the input as undirected for this parent-edge test. In a directed graph use the current recursion stack (gray vertices) or Kahn’s processed count; a visited neighbor alone is insufficient."
},

  complexity: [
  {
    "operation": "Cycle detection (DFS)",
    "best": "O(V + E)",
    "average": "O(V + E)",
    "worst": "O(V + E)",
    "space": "O(V+E)",
    "note": "Internally built adjacency is O(V+E); seen state and recursive frames add O(V)."
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
  "costModel": "Each vertex is visited once and each edge examined once (as in DFS); set/lookup are O(1).",
  "time": {
    "bound": "O(V + E)",
    "case": "worst",
    "explanation": "Cycle detection is a single DFS sweep: each of the V vertices is entered once and each edge is scanned once to check the cycle condition — so O(V + E). The extra parent (undirected) or recursion-stack (directed) test at each edge is O(1) and doesn't change the bound. Covering all components (the outer loop) is included in the O(V) term."
  },
  "space": {
    "bound": "O(V+E)",
    "case": "worst",
    "explanation": "The function creates adjacency lists from its edge input, then visited/parent state and recursive frames; total O(V+E) working storage.",
    "inputOutputNote": "The O(E) edge list is input. Constructed adjacency, seen state and recursion are auxiliary storage; the result is a Boolean."
  },
  "derivation": [
    {
      "lines": [
        11,
        12
      ],
      "description": "Each vertex is entered once during DFS.",
      "cost": "O(V)",
      "dimension": "time"
    },
    {
      "lines": [
        13,
        14,
        15,
        16,
        17
      ],
      "description": "Each edge is examined once with an O(1) cycle test.",
      "cost": "O(V + E)",
      "dimension": "time"
    },
    {
      "lines": [
        9,
        10
      ],
      "description": "Visited set O(V) plus recursion stack up to O(V).",
      "cost": "O(V)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Adjacency-list graph; set ops O(1).",
    "Undirected: exclude the parent edge.",
    "The outer loop covers all components.",
    "Undirected graph; n is nonnegative and edge endpoints lie in 0..n−1.",
    "Adjacency lists are constructed inside the function and count toward auxiliary storage."
  ],
  "tradeoffs": "For undirected cycle detection, union-find is an alternative: an edge whose endpoints are already in the same set closes a cycle — near-O(E·α). DFS is simplest and also works for directed graphs (with the recursion-stack rule).",
  "counters": [],
  "fixedDataNote": "This run finds a cycle in the triangle (True) and none in the path (False). The O(V+E) bound generalises to any graph.",
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
    }
  ]
},

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import defaultdict." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: undirected cycle detection via DFS." },
    { line: 4, executable: true, explanation: "Define has_cycle(n, edges)." },
    { line: 5, executable: true, explanation: "Build the adjacency list." },
    { line: 6, executable: true, explanation: "For each edge..." },
    { line: 7, executable: true, explanation: "...add both directions..." },
    { line: 8, executable: true, explanation: "...(undirected)." },
    { line: 9, executable: true, explanation: "Visited set." },
    { line: 10, executable: true, explanation: "Inner DFS carrying the parent it came from." },
    { line: 11, executable: true, explanation: "Mark this vertex visited." },
    { line: 12, executable: true, explanation: "For each neighbour..." },
    { line: 13, executable: true, explanation: "...if unvisited..." },
    { line: 14, executable: true, explanation: "...recurse; a True bubbles up a found cycle." },
    { line: 15, executable: true, explanation: "Propagate the cycle result." },
    { line: 16, executable: true, explanation: "Else it's visited: a cycle UNLESS it's the parent we came from." },
    { line: 17, executable: true, explanation: "A visited non-parent neighbour closes a cycle → True." },
    { line: 18, executable: true, explanation: "No cycle found from this vertex." },
    { line: 19, executable: true, explanation: "Cover every component (disconnected graphs)." },
    { line: 20, executable: true, explanation: "If a vertex is unvisited..." },
    { line: 21, executable: true, explanation: "...DFS from it (parent = -1, no real parent)." },
    { line: 22, executable: true, explanation: "Return True if any component has a cycle." },
    { line: 23, executable: true, explanation: "No cycle anywhere → False." },
    { line: 24, executable: false, explanation: "Blank line." },
    { line: 25, executable: true, explanation: "Triangle 0-1-2-0 has a cycle → True." },
    { line: 26, executable: true, explanation: "Path 0-1-2 has no cycle → False." },
  ],

  bindings: [
    { variable: "adj", model: "graph", directed: false, overlays: [{ role: "visited", label: "seen", source: "seen" }] },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "In undirected cycle detection, why must we exclude the PARENT when we see a visited neighbour?", answer: "Because the edge back to the parent is the same undirected edge we just arrived on — not a cycle. Only a visited neighbour that ISN'T the parent means a genuine second path back, i.e. a cycle.", explanation: "Every undirected edge appears in both vertices' lists, so a child always sees its parent as a visited neighbour. Excluding the parent avoids mistaking that arrival edge for a cycle." },
  ],

  experiments: [
    "Add an edge to the path 0-1-2 to close a cycle and see the result flip to True.",
    "Test a disconnected graph where only one component has a cycle.",
    "Sketch the directed version using a recursion-stack (in-progress) set.",
  ],

  exercises: [
    {
      id: "cyc-choose-1",
      kind: "choose-approach",
      prompt: "For a DIRECTED graph, why doesn't the undirected 'visited-and-not-parent' rule work, and what replaces it?",
      expected: "In a directed graph, a visited vertex might be finished (not on the current path) — reaching it isn't a cycle. The correct rule detects a BACK EDGE: a neighbour currently on the recursion stack (in-progress set). That's a cycle.",
      hints: ["Directed edges have direction; 'parent' isn't meaningful the same way.", "A finished vertex isn't a cycle.", "Track vertices on the current recursion path (in-progress)."],
    },
    {
      id: "cyc-fix-1",
      kind: "fix-mistake",
      prompt: "This undirected cycle check wrongly reports the arrival edge as a cycle. Add the parent exclusion.",
      starterCode: "def dfs(node, parent):\n    seen.add(node)\n    for nb in adj[node]:\n        if nb not in seen:\n            if dfs(nb, node):\n                return True\n        else:\n            return True\n    return False",
      expected: "def dfs(node, parent):\n    seen.add(node)\n    for nb in adj[node]:\n        if nb not in seen:\n            if dfs(nb, node):\n                return True\n        elif nb != parent:\n            return True\n    return False",
      hints: ["A visited neighbour that is the parent is not a cycle.", "Only report if the visited neighbour isn't the parent.", "elif nb != parent: return True"],
    },
  ],

  review: "The displayed undirected DFS excludes the arrival parent when a visited neighbor is encountered. Directed cycle detection instead needs an in-progress recursion set; a visited vertex alone is insufficient. The function covers every component and builds adjacency internally, using O(V+E) time and auxiliary storage. A traversal over an already supplied adjacency list needs O(V) additional seen/stack storage.",

  expectedOutput: "True\nFalse\n",

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
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "f7ac50e7cb143b8f",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
