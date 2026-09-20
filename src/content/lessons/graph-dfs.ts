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

  explanation: `**Graph DFS** extends tree DFS to graphs: dive **deep** along one path, backtrack when stuck, and continue — but with a **visited set** to prevent revisiting vertices in the presence of **cycles**. You can write it recursively (using the call stack) or iteratively with an explicit stack; the recursive form is shown here.

The rule that makes it correct is **mark visited *before* recursing into neighbours**. If you marked after, a cycle could send you back into a vertex already on the current path. From vertex 0 this DFS goes 0 → 1 → 3 (deep), backtracks (3's other neighbour 2 is unvisited from 1? no — it reaches 3, whose neighbours 1 and 2; 1 is seen, so it visits... actually the order is \`0, 1, 3, 2\`): down the first branch to 1 then 3, then 2 via 3.

DFS visits every reachable vertex once and scans every edge once, so it is **O(V + E)** time and **O(V)** space (the visited set plus the recursion stack, which can be O(V) deep). DFS is the workhorse for **connectivity, cycle detection, topological sort, and path finding** — the next several lessons all build directly on this template. The difference from BFS: DFS goes deep (uses a stack), BFS goes by level (uses a queue); both are O(V + E), but only BFS gives distance order.`,

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
    { operation: "Graph DFS", best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)", space: "O(V)", note: "Each vertex visited once; each edge scanned once; stack up to O(V)." },
  ],

  complexityExplanation: {
    variables: [
      { symbol: "V", meaning: "the number of vertices" },
      { symbol: "E", meaning: "the number of edges" },
    ],
    costModel: "Set add/lookup are O(1). Each vertex is visited once; each edge is examined once from its endpoint.",
    time: {
      bound: "O(V + E)",
      case: "worst",
      explanation: "The visited set ensures each of the V vertices is entered once — O(V). At each vertex we scan its adjacency list, and across all vertices those scans total the edges — O(E). So DFS is O(V + E), identical to BFS in cost; only the traversal ORDER differs (deep vs level).",
    },
    space: {
      bound: "O(V)",
      case: "worst",
      explanation: "The visited set holds up to V vertices, and the recursion stack can reach depth O(V) for a long path (e.g. a line graph). So auxiliary space is O(V).",
      inputOutputNote: "The graph (V + E) is the input; the visited set and recursion stack are the O(V) auxiliary space.",
    },
    derivation: [
      { lines: [3, 4], description: "Each vertex is entered once (marked, recorded) — O(V) total.", cost: "O(V)", dimension: "time" },
      { lines: [5, 6, 7], description: "Scanning all adjacency lists examines each edge once — O(E) total.", cost: "O(V + E)", dimension: "time" },
      { lines: [3, 7], description: "Visited set O(V) plus recursion stack up to O(V).", cost: "O(V)", dimension: "space" },
    ],
    assumptions: ["Adjacency-list graph; set ops O(1).", "Marking before recursing prevents infinite recursion on cycles."],
    tradeoffs: "BFS uses a queue (O(V) too) and gives distance order; DFS uses a stack and goes deep. Iterative DFS avoids Python's recursion limit at the same O(V) space.",
    counters: [{ label: "vertices visited", definition: "executions of the visit (line 4)", countLines: [4] }],
    fixedDataNote: "This run visits 4 vertices depth-first from 0 → [0,1,3,2]. The O(V+E) bound generalises to any graph.",
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
      url: "https://cp-algorithms.com/graph/depth-first-search.html",
      title: "Depth First Search — CP-Algorithms",
      section: "Algorithm and complexity",
      topic: "graphs/dfs",
      purpose: "Confirm graph DFS is O(V+E), needs a visited set, and underlies components/cycles/topo sort.",
      verifiedClaims: ["Graph DFS is O(V + E); it requires a visited set; it is the basis of components, cycle detection, and topological sort"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://algs4.cs.princeton.edu/41graph/",
      title: "Undirected Graphs — Algorithms, 4th Edition (Princeton)",
      section: "Depth-first search",
      topic: "graphs/dfs",
      purpose: "Cross-check the DFS template and its O(V+E) analysis.",
      verifiedClaims: ["DFS marks vertices as visited and recurses into unmarked neighbours in O(V+E)"],
      accessDate: "2026-09-20",
    },
  ],
};
