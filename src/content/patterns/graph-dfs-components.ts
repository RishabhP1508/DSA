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
    "O(V + E) time — each node and edge is visited once. O(V) space for the visited set plus O(V) recursion stack in the worst case.",

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "V", meaning: "the number of vertices (n)" },
      { symbol: "E", meaning: "the number of edges" },
    ],
    costModel: "Build the adjacency list in O(V + E), then DFS-visit each vertex once, scanning each edge (both directions) once.",
    time: {
      bound: "O(V + E)",
      case: "worst",
      explanation: "Building adj (lines 5-8) is O(E). The outer loop (lines 16-19) starts a DFS from each unvisited vertex; dfs (lines 11-15) marks each vertex once and scans its adjacency list. Summed over all vertices the edge scans are O(E), so total O(V + E).",
    },
    space: {
      bound: "O(V)",
      case: "worst",
      explanation: "The `seen` set holds <= V vertices; the recursion stack is up to V deep for a path-shaped component. The adjacency list is O(V + E) but derived from the input edges.",
      inputOutputNote: "edges (O(E)) is the input; the answer is a single count.",
    },
    derivation: [
      { lines: [5, 6, 7, 8], description: "Build the undirected adjacency list — O(E).", cost: "O(E)", dimension: "time" },
      { lines: [12, 13, 14], description: "Each vertex visited once; each edge scanned once.", cost: "O(V + E)", dimension: "time" },
      { lines: [9], description: "Visited set + recursion depth up to V.", cost: "O(V)", dimension: "space" },
    ],
    assumptions: ["The graph is undirected (edges added both ways).", "set membership/add is amortised O(1)."],
    tradeoffs: "An iterative stack-based DFS or a union-find both count components in near-linear time; recursion risks a deep stack on long paths (Python's default recursion limit).",
    counters: [{ label: "vertices visited", definition: "executions of seen.add in dfs (line 12)", countLines: [12] }],
    fixedDataNote: "This 5-vertex graph visits all vertices across 2 components. The O(V + E) bound generalises.",
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
      id: "pat-gdc-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Count the number of islands in a grid of land/water cells.' Which pattern?",
      expected:
        "Graph DFS / connected components: treat land cells as nodes connected to adjacent land; DFS (flood fill) from each unvisited land cell, counting one component per launch. O(V+E) over the cells.",
      correctPatternId: "graph-dfs-components",
      hints: [
        "Cells connect to neighbors — it's a graph.",
        "Flood-fill each unvisited region.",
        "Count one component per new DFS.",
      ],
    },
    {
      id: "pat-gdc-choose-1",
      kind: "choose-approach",
      prompt:
        "Edges are added one at a time and after each you must answer 'are X and Y connected?'. DFS per query or Union-Find?",
      expected:
        "Union-Find (DSU): near-constant union and connectivity queries with incremental edges. Re-running DFS per query would be O(V+E) each time — far too slow for many dynamic queries.",
      correctPatternId: "graph-dfs-components",
      hints: [
        "Connectivity changes over time.",
        "Many repeated 'same set?' queries.",
        "DSU is built for that.",
      ],
    },
    {
      id: "pat-gdc-fix-1",
      kind: "fix-mistake",
      prompt:
        "This DFS loops forever on a cyclic graph. Add the missing guard.",
      starterCode:
        "def dfs(node):\n    for nb in adj[node]:\n        dfs(nb)",
      expected:
        "def dfs(node):\n    seen.add(node)\n    for nb in adj[node]:\n        if nb not in seen:\n            dfs(nb)",
      hints: [
        "Cycles cause infinite recursion.",
        "Mark nodes visited on entry.",
        "Only recurse into unvisited neighbors.",
      ],
    },
  ],

  references: [
    {
      url: "https://cp-algorithms.com/graph/depth-first-search.html",
      title: "Depth First Search — CP-Algorithms",
      section: "DFS traversal, connected components, complexity",
      topic: "patterns/graph-dfs-components",
      purpose: "Confirm DFS flood-fills a component, needs a visited set, and runs in O(V+E).",
      verifiedClaims: [
        "DFS visits every vertex reachable from the start; launching it from each unvisited vertex counts connected components in O(V+E).",
        "A visited set prevents infinite loops on cyclic graphs.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://leetcode.com/problems/number-of-islands/editorial/",
      title: "Number of Islands — LeetCode editorial",
      section: "Flood fill via DFS/BFS",
      topic: "patterns/graph-dfs-components",
      purpose: "Cross-check the grid-as-graph flood-fill counting of components.",
      verifiedClaims: ["Counting islands is a connected-components flood fill over grid cells."],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "ffcc920d66558bc2",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
