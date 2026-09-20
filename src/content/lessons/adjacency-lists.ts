/**
 * Lesson: Adjacency lists (Graphs). Verified on CPython 3.14.
 * Output: "{0: [(1, 4), (2, 1)], 2: [(1, 2), (3, 5)], 1: [(3, 1)]}\n1 4\n2 1\n2\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `from collections import defaultdict

# A WEIGHTED, DIRECTED graph as an adjacency list of (neighbour, weight).
adj = defaultdict(list)
for u, v, w in [(0, 1, 4), (0, 2, 1), (2, 1, 2), (1, 3, 1), (2, 3, 5)]:
    adj[u].append((v, w))          # directed edge u -> v with weight w
print(dict(adj))

# Iterate the neighbours (and weights) of a vertex.
for nb, w in adj[0]:
    print(nb, w)

# The out-degree of a vertex is how many neighbours it has.
print(len(adj[2]))`;

export const adjacencyLists: LessonDefinition = {
  id: "adjacency-lists",
  title: "Working with Adjacency Lists",
  area: "Graphs",
  prerequisites: ["graph-representations"],

  explanation: `The **adjacency list** is the representation you'll actually use for almost every graph algorithm, so it's worth getting fluent with the practical idioms. The core is a dict from each vertex to a list of its neighbours; using \`collections.defaultdict(list)\` lets you \`append\` without first checking whether the key exists.

For **weighted** graphs, store \`(neighbour, weight)\` tuples instead of bare neighbours — this one change is what BFS-style code needs to become Dijkstra later. For **directed** graphs you add only \`adj[u].append(v)\` (one direction); undirected graphs add both. Iterating a vertex's neighbours (\`for nb, w in adj[u]\`) is the inner loop of every traversal, and its length is the vertex's **out-degree**.

The efficiency point that every graph algorithm's complexity rests on: iterating **all** adjacency lists across the whole graph touches each edge exactly once (or twice, undirected), so a full sweep is **O(V + E)** — not O(V²). That's precisely why BFS, DFS, topological sort, and Dijkstra are stated as O(V + E) or O(E log V): they're bounded by the total size of the adjacency lists. Getting comfortable reading and iterating this structure is the foundation for the whole Graphs topic.`,

  vocabulary: [
    { term: "Adjacency list", definition: "A dict mapping each vertex to a list of its neighbours." },
    { term: "defaultdict(list)", definition: "Auto-creates an empty list for a new key, so you can append freely." },
    { term: "Weighted edge", definition: "Stored as a (neighbour, weight) tuple in the list." },
    { term: "Out-degree", definition: "The number of outgoing edges from a vertex (length of its list)." },
    { term: "Neighbour iteration", definition: "Looping over adj[u] — the inner loop of graph traversals." },
  ],

  concepts: {
    purpose: "Fluently build and traverse adjacency lists — the structure underlying all graph algorithms.",
    operations: "Build with defaultdict(list); store (neighbour, weight) for weighted graphs; iterate adj[u] for neighbours.",
    uses: "Input to BFS/DFS, topological sort, Dijkstra, MST; degree counting; neighbour queries.",
    tradeoffs: "O(V+E) space and O(degree) neighbour iteration; O(degree) to check a specific edge (matrix does that in O(1)).",
    commonMistakes: "KeyError from a plain dict (use defaultdict or setdefault); forgetting weights when the algorithm needs them; adding both directions for a directed graph.",
    edgeCases: "Isolated vertex has an empty list. Directed edges appear once. Duplicate/parallel edges appear multiple times.",
  },

  complexity: [
    { operation: "Build adjacency list", best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)", space: "O(V + E)", note: "One append per edge." },
    { operation: "Iterate all neighbours", best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)", note: "Sum of all degrees = 2E (undirected) or E (directed)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "V", meaning: "the number of vertices" },
      { symbol: "E", meaning: "the number of edges" },
    ],
    costModel: "Each append and each neighbour visit is O(1). The sum of all vertices' degrees equals 2E (undirected) or E (directed).",
    time: {
      bound: "O(V + E)",
      case: "worst",
      explanation: "Building the list does one O(1) append per edge — O(E) — over V vertices, so O(V + E). Iterating EVERY vertex's neighbours across the whole graph visits each edge once (directed) or twice (undirected), because the total length of all adjacency lists is the sum of degrees = O(E). Adding the O(V) to visit each vertex gives O(V + E). This is exactly why graph traversals are O(V + E), not O(V²).",
    },
    space: {
      bound: "O(V + E)",
      case: "worst",
      explanation: "The list stores one entry per vertex plus one per edge — O(V + E), the natural size of the graph.",
      inputOutputNote: "The adjacency list IS the graph; its O(V+E) size is inherent.",
    },
    derivation: [
      { lines: [5, 6], description: "One O(1) append per edge builds the list — O(E) over V vertices.", cost: "O(V + E)", dimension: "time" },
      { lines: [10], description: "Iterating a vertex's neighbours is O(its degree); across the graph, O(E).", cost: "O(V + E)", dimension: "time" },
      { lines: [4, 6], description: "The list holds V vertices and E edge entries.", cost: "O(V + E)", dimension: "space" },
    ],
    assumptions: ["Appends and neighbour visits are O(1).", "Directed edges are stored once; the total list length is O(E)."],
    tradeoffs: "Iterating neighbours is O(degree) per vertex (O(E) total) — great for traversal. Checking one specific edge is O(degree); a matrix does that in O(1) but costs O(V²) space.",
    counters: [],
    fixedDataNote: "This run builds a 5-edge weighted directed graph, iterates vertex 0's two neighbours, and reports vertex 2's out-degree (2). The O(V+E) bounds generalise.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import defaultdict for auto-created neighbour lists." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: weighted directed graph as (neighbour, weight)." },
    { line: 4, executable: true, explanation: "The adjacency list." },
    { line: 5, executable: true, explanation: "For each (u, v, w) edge..." },
    { line: 6, executable: true, explanation: "...append (v, w) to u's list (directed, weighted)." },
    { line: 7, executable: true, explanation: "Print the adjacency list of tuples." },
    { line: 8, executable: false, explanation: "Blank line." },
    { line: 9, executable: false, explanation: "Comment: iterate a vertex's neighbours." },
    { line: 10, executable: true, explanation: "Unpack each (neighbour, weight) of vertex 0." },
    { line: 11, executable: true, explanation: "Print '1 4' then '2 1' — vertex 0's edges." },
    { line: 12, executable: false, explanation: "Blank line." },
    { line: 13, executable: false, explanation: "Comment: out-degree." },
    { line: 14, executable: true, explanation: "len(adj[2]) is vertex 2's out-degree → 2." },
  ],

  bindings: [
    { variable: "adj", model: "graph", directed: false },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why is iterating ALL adjacency lists O(V + E) and not O(V^2)?", answer: "Because the total length of all the lists is the sum of degrees, which equals 2E (undirected) or E (directed) — so visiting every neighbour is O(E), plus O(V) to touch each vertex.", explanation: "Each edge contributes to exactly one (directed) or two (undirected) adjacency-list entries, so summing all list lengths gives O(E). A matrix scan would be O(V²), but list iteration is bounded by actual edges — the basis of O(V+E) traversal costs." },
  ],

  experiments: [
    "Make the graph undirected by appending both (v, w) and (u, w); compare degrees.",
    "Compute the total out-degree and confirm it equals the number of directed edges.",
    "Store just neighbours (no weights) and see how the iteration simplifies.",
  ],

  exercises: [
    {
      id: "adj-complete-1",
      kind: "complete-code",
      prompt: "Build a weighted UNDIRECTED adjacency list from (u, v, w) edges.",
      starterCode: "from collections import defaultdict\ndef build(edges):\n    adj = defaultdict(list)\n    for u, v, w in edges:\n        # TODO: add both directions with weight w\n        pass\n    return adj",
      expected: "from collections import defaultdict\ndef build(edges):\n    adj = defaultdict(list)\n    for u, v, w in edges:\n        adj[u].append((v, w))\n        adj[v].append((u, w))\n    return adj",
      hints: ["Undirected means both directions.", "Store (neighbour, weight) tuples.", "adj[u].append((v, w)); adj[v].append((u, w))"],
    },
    {
      id: "adj-choose-1",
      kind: "choose-approach",
      prompt: "A traversal visits every neighbour of every vertex. Why is its total cost O(V + E) rather than O(V) times the average degree written as O(V·d)?",
      expected: "Because the sum of all degrees equals 2E (or E directed), the neighbour visits total O(E), and adding O(V) to touch each vertex gives O(V + E). V·(avg degree) is the same quantity — it equals O(E) — but O(V + E) is the standard, exact form.",
      hints: ["Sum of degrees = 2E.", "So neighbour visits total O(E).", "Plus O(V) for the vertices → O(V + E)."],
    },
  ],

  review: `The **adjacency list** (\`defaultdict(list)\`, storing \`(neighbour, weight)\` for weighted graphs) is the practical graph representation. Building it is **O(V + E)** and iterating **all** neighbours is **O(V + E)** because the total list length is the sum of degrees (= O(E)). That fact is exactly why BFS, DFS, topological sort, and Dijkstra are stated as O(V + E) or O(E log V).`,

  expectedOutput: "{0: [(1, 4), (2, 1)], 2: [(1, 2), (3, 5)], 1: [(3, 1)]}\n1 4\n2 1\n2\n",

  references: [
    {
      url: "https://docs.python.org/3/library/collections.html#collections.defaultdict",
      title: "collections — defaultdict — Python documentation",
      section: "defaultdict(list)",
      topic: "graphs/adjacency-lists",
      purpose: "Confirm defaultdict(list) auto-creates empty lists so appends need no key check.",
      verifiedClaims: ["defaultdict(list) provides an empty list for missing keys on first access"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://algs4.cs.princeton.edu/40graphs/",
      title: "Undirected Graphs — Algorithms, 4th Edition (Princeton)",
      section: "Adjacency-lists representation",
      topic: "graphs/adjacency-lists",
      purpose: "Cross-check that the sum of adjacency-list lengths is O(E), giving O(V+E) traversal.",
      verifiedClaims: ["The adjacency-lists representation has total length proportional to V + E"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "0f1306c786054256",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
