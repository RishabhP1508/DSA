/**
 * Lesson: Graph representations (Graphs). Verified on CPython 3.14.
 * Output: "{0: [1, 2], 1: [0, 2], 2: [0, 1]}\n[[0, 1, 1], [1, 0, 1], [1, 1, 0]]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `from collections import defaultdict

# A graph is a set of vertices connected by edges.
edges = [(0, 1), (0, 2), (1, 2)]

# Adjacency LIST: each vertex maps to its neighbours.
adj = defaultdict(list)
for u, v in edges:
    adj[u].append(v)
    adj[v].append(u)      # undirected: add both directions
print(dict(adj))

# Adjacency MATRIX: mat[u][v] = 1 if edge u-v exists.
n = 3
mat = [[0] * n for _ in range(n)]
for u, v in edges:
    mat[u][v] = 1
    mat[v][u] = 1
print(mat)`;

export const graphRepresentations: LessonDefinition = {
  id: "graph-representations",
  title: "Graph Representations",
  area: "Graphs",
  prerequisites: ["maps-sets", "matrix-traversal"],

  explanation: `A **graph** is a set of **vertices** (nodes) joined by **edges** (connections). Graphs model roads, social networks, dependencies, and more. Before any algorithm, you must choose how to *store* the graph — and the two standard choices trade space against the speed of different queries.

An **adjacency list** maps each vertex to a list of its neighbours (\`{0: [1, 2], ...}\`). It uses **O(V + E)** space — proportional to the vertices plus edges — which is ideal for **sparse** graphs (few edges). Listing a vertex's neighbours is fast, but checking "is there an edge u–v?" means scanning u's list.

An **adjacency matrix** is a V×V grid where \`mat[u][v] = 1\` marks an edge. It answers "is u–v connected?" in **O(1)**, but always uses **O(V²)** space regardless of how few edges exist — wasteful for sparse graphs, reasonable for **dense** ones. Graphs also come in flavours: **directed** (edges one-way, add only \`adj[u].append(v)\`) vs **undirected** (add both directions), and **weighted** (store weights instead of just 1/0). The recognition skill: pick the **adjacency list** by default (most real graphs are sparse), and reach for the matrix only when the graph is dense or you need O(1) edge lookups.`,

  vocabulary: [
    { term: "Vertex (node)", definition: "A point in the graph; graphs have V of them." },
    { term: "Edge", definition: "A connection between two vertices; graphs have E of them." },
    { term: "Adjacency list", definition: "Each vertex maps to its neighbour list; O(V + E) space." },
    { term: "Adjacency matrix", definition: "A V×V grid marking edges; O(1) edge lookup, O(V²) space." },
    { term: "Directed vs undirected", definition: "Edges one-way (add one direction) vs two-way (add both)." },
    { term: "Sparse vs dense", definition: "Few edges (E ≈ V) vs many (E ≈ V²)." },
  ],

  concepts: {
    purpose: "Store a graph so the algorithm you run on it is efficient; the representation shapes every later cost.",
    operations: "Build a list (neighbours per vertex) or a matrix (edge existence); handle directed/undirected/weighted.",
    uses: "Every graph algorithm (BFS/DFS, shortest paths, MST) reads one of these; adjacency lists dominate in practice.",
    tradeoffs: "List: O(V+E) space, fast neighbour iteration, O(degree) edge check. Matrix: O(V²) space, O(1) edge check.",
    commonMistakes: "Forgetting to add both directions for undirected graphs; using a matrix for a huge sparse graph (O(V²) blowup); confusing V (vertices) with E (edges) in complexity.",
    edgeCases: "Self-loops (u == v). Parallel/duplicate edges. Isolated vertices (empty neighbour list). Directed graphs add only one direction.",
  },

  complexity: [
    { operation: "Adjacency list build/store", best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)", space: "O(V + E)", note: "Ideal for sparse graphs; neighbour iteration is O(degree)." },
    { operation: "Adjacency matrix build/store", best: "O(V^2)", average: "O(V^2)", worst: "O(V^2)", space: "O(V^2)", note: "O(1) edge lookup; wasteful for sparse graphs." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "V", meaning: "the number of vertices" },
      { symbol: "E", meaning: "the number of edges" },
    ],
    costModel: "Appending to a list and setting a matrix cell are O(1). Building the list touches each edge; building the matrix touches all V² cells (or at least allocates them).",
    time: {
      bound: "O(V + E)",
      case: "worst",
      explanation: "Building the adjacency LIST processes each of the E edges once (two appends for undirected) and covers V vertices, so it is O(V + E) — the natural size of a sparse graph. Building the adjacency MATRIX allocates a V×V grid, which is O(V²) regardless of edge count. Naming both V and E matters: for a sparse graph E ≈ V so the list is ≈ O(V), while the matrix is stuck at O(V²).",
    },
    space: {
      bound: "O(V + E)",
      case: "worst",
      explanation: "The adjacency list stores one entry per vertex plus one per edge (both directions if undirected) — O(V + E). The matrix always uses V² cells — O(V²) — even if the graph has almost no edges, which is why lists are preferred for sparse graphs.",
      inputOutputNote: "The chosen representation IS the graph structure; its size is inherent to how the graph is stored.",
    },
    derivation: [
      { lines: [8, 9, 10], description: "The list build processes each edge once (two appends, undirected).", cost: "O(V + E)", dimension: "time" },
      { lines: [15, 16, 17, 18], description: "The matrix allocates V² cells and sets edge entries.", cost: "O(V^2)", dimension: "time" },
      { lines: [7, 15], description: "List uses O(V + E); matrix uses O(V²).", cost: "O(V + E)", dimension: "space" },
    ],
    assumptions: ["Appends and cell writes are O(1).", "Undirected edges are stored in both directions.", "V vertices are labelled 0..V-1 for the matrix."],
    tradeoffs: "Adjacency list: O(V+E) space, O(degree) edge check, fast neighbour iteration — best for sparse graphs. Adjacency matrix: O(V²) space but O(1) edge check — best for dense graphs or frequent edge queries.",
    counters: [],
    fixedDataNote: "This run builds a 3-vertex, 3-edge triangle both ways. The O(V+E) vs O(V²) bounds show why the list wins as the graph grows sparse.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import defaultdict to auto-create empty neighbour lists." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: a graph is vertices + edges." },
    { line: 4, executable: true, explanation: "The edge list defining a triangle 0-1-2." },
    { line: 5, executable: false, explanation: "Blank line." },
    { line: 6, executable: false, explanation: "Comment: adjacency list." },
    { line: 7, executable: true, explanation: "A dict mapping each vertex to its neighbour list." },
    { line: 8, executable: true, explanation: "For each edge (u, v)..." },
    { line: 9, executable: true, explanation: "...add v to u's neighbours..." },
    { line: 10, executable: true, explanation: "...and u to v's (undirected → both directions)." },
    { line: 11, executable: true, explanation: "Print the adjacency list → {0: [1, 2], 1: [0, 2], 2: [0, 1]}." },
    { line: 12, executable: false, explanation: "Blank line." },
    { line: 13, executable: false, explanation: "Comment: adjacency matrix." },
    { line: 14, executable: true, explanation: "n vertices." },
    { line: 15, executable: true, explanation: "Allocate a V×V grid of zeros (O(V²) space)." },
    { line: 16, executable: true, explanation: "For each edge..." },
    { line: 17, executable: true, explanation: "...mark mat[u][v] = 1..." },
    { line: 18, executable: true, explanation: "...and mat[v][u] = 1 (undirected)." },
    { line: 19, executable: true, explanation: "Print the matrix → symmetric with 1s off the diagonal." },
  ],

  bindings: [
    { variable: "adj", model: "graph", directed: false },
    { variable: "mat", model: "matrix" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "A social network has 1,000,000 users but each has only ~100 friends. Adjacency list or matrix, and why?", answer: "Adjacency list: O(V + E) ≈ 100 million entries. A matrix would be V² = 10^12 cells — a trillion — almost all zeros, which is infeasible.", explanation: "The graph is sparse (E ≈ 100·V, far less than V²), so the list's O(V+E) is manageable while the matrix's O(V²) is astronomically wasteful." },
  ],

  experiments: [
    "Make the graph directed by removing the reverse-direction append; compare the list.",
    "Add a weighted edge by storing (neighbour, weight) tuples in the list.",
    "Count non-zero cells in the matrix and compare to 2·E.",
  ],

  exercises: [
    {
      id: "grep-complete-1",
      kind: "complete-code",
      prompt: "Build an adjacency list for a DIRECTED graph from an edge list.",
      starterCode: "from collections import defaultdict\ndef build(edges):\n    adj = defaultdict(list)\n    for u, v in edges:\n        # TODO: directed edge u -> v only\n        pass\n    return adj",
      expected: "from collections import defaultdict\ndef build(edges):\n    adj = defaultdict(list)\n    for u, v in edges:\n        adj[u].append(v)\n    return adj",
      hints: ["Directed means one-way.", "Only add v to u's neighbours.", "adj[u].append(v) (no reverse)"],
    },
    {
      id: "grep-choose-1",
      kind: "choose-approach",
      prompt: "You frequently ask 'is there an edge between u and v?' on a small dense graph. List or matrix? Give the edge-check complexity of each.",
      expected: "Matrix: O(1) edge lookup (mat[u][v]), affordable because the graph is small/dense. An adjacency list needs O(degree) to scan u's neighbours for v.",
      hints: ["Which gives instant edge lookup?", "The matrix: mat[u][v].", "The list is O(degree) per check."],
    },
  ],

  review: `A **graph** is **vertices + edges**, stored as an **adjacency list** (\`{vertex: [neighbours]}\`, **O(V+E)** space, fast neighbour iteration — best for sparse graphs) or an **adjacency matrix** (V×V grid, **O(1)** edge lookup but **O(V²)** space — best for dense graphs). Handle **directed** (one direction) vs **undirected** (both) and weighted variants. Default to the adjacency list; every later algorithm reads one of these.`,

  expectedOutput: "{0: [1, 2], 1: [0, 2], 2: [0, 1]}\n[[0, 1, 1], [1, 0, 1], [1, 1, 0]]\n",

  references: [
    {
      url: "https://cp-algorithms.com/graph/breadth-first-search.html",
      title: "Graph representations & BFS — CP-Algorithms",
      section: "Adjacency list / matrix",
      topic: "graphs/representations",
      purpose: "Confirm adjacency-list O(V+E) vs adjacency-matrix O(V²) space and their query trade-offs.",
      verifiedClaims: ["Adjacency lists use O(V+E) space; adjacency matrices use O(V²) with O(1) edge lookup"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://algs4.cs.princeton.edu/40graphs/",
      title: "Undirected Graphs — Algorithms, 4th Edition (Princeton)",
      section: "Graph representations",
      topic: "graphs/representations",
      purpose: "Cross-check representation choices and the sparse-vs-dense guidance.",
      verifiedClaims: ["Adjacency lists are preferred for sparse graphs; matrices suit dense graphs"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "dc6f99b15c3af8a1",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
