/**
 * Lesson: Representations (DSA foundations).
 * Verified on CPython 3.14. Output: "True\n[(0, 1), (0, 2), (1, 2)]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# One small graph, two EQUIVALENT shapes for the SAME connections.
# Edge list: each undirected edge as a pair.
edges = [(0, 1), (0, 2), (1, 2)]
# Adjacency map: each node -> the set of its neighbours.
adj = {0: {1, 2}, 1: {0, 2}, 2: {0, 1}}

# Rebuild the connection set from EACH representation and compare them.
from_edges = {(min(u, v), max(u, v)) for (u, v) in edges}
from_adj = {(min(u, v), max(u, v)) for u in adj for v in adj[u]}
# Same connections, so the two encodings are equivalent.
print(from_edges == from_adj)
print(sorted(from_edges))`;

export const representations: LessonDefinition = {
  id: "representations",
  title: "Representations of Data",
  area: "DSA foundations",
  prerequisites: ["variables-and-types"],

  explanation: `A **data structure** is a way of *representing* information so that the operations you care about are efficient. The same facts can be stored in different shapes, and the shape you pick determines which operations are fast.

Take a tiny graph of three nodes where 0–1, 0–2, and 1–2 are connected. Two standard shapes store **exactly the same connections**:

- an **edge list** — a flat list of pairs, \`[(0, 1), (0, 2), (1, 2)]\`; and
- an **adjacency map** — each node mapped to the set of its neighbours, \`{0: {1, 2}, 1: {0, 2}, 2: {0, 1}}\`.

These are *equivalent*: from either one you can rebuild the same set of connections. The program proves it by normalising each edge as \`(min, max)\` and checking the two reconstructed sets are equal (it prints \`True\`). Neither shape is "more correct" — they trade off differently. The adjacency map answers "who are node X's neighbours?" in expected **O(1)**; the edge list is compact and iterates every edge directly but needs a scan to list one node's neighbours.

The takeaway: **choose the representation to match your operations.** Later graph lessons extend this exact idea to adjacency lists vs adjacency matrices.`,

  vocabulary: [
    { term: "Data structure", definition: "A way of organising data to make certain operations efficient." },
    { term: "Representation", definition: "The concrete shape chosen to store information (edge list, adjacency map, …)." },
    { term: "Edge list", definition: "A flat list of pairs, each pair being one connection (edge) between two nodes." },
    { term: "Adjacency map", definition: "A map from each node to the collection of its neighbours." },
    { term: "Equivalent encodings", definition: "Different shapes that store exactly the same information, each convertible to the other." },
    { term: "Trade-off", definition: "A representation that speeds up one operation often costs more time or space elsewhere." },
  ],

  concepts: {
    purpose: "Choosing the right representation is what makes an algorithm fast; the same connections can be stored as an edge list or an adjacency map.",
    operations: "Convert between encodings; compare how each supports edge iteration, neighbour lookup, and membership.",
    uses: "Edge list vs adjacency map (and later adjacency list vs matrix) for graphs; array vs linked list for sequences.",
    tradeoffs: "The adjacency map gives expected O(1) neighbour lookup; the edge list is compact and iterates edges directly but scans to find one node's neighbours.",
    commonMistakes: "Assuming two shapes are equivalent without checking; picking a structure by habit rather than by the operations needed; double-counting an undirected edge stored in both directions.",
    edgeCases: "Empty graph (no edges); self-loops (u == v); an undirected edge appears once in an edge list but in BOTH nodes' neighbour sets.",
  },

  complexity: [
    { operation: "Edge list: iterate all edges", best: "O(E)", average: "O(E)", worst: "O(E)", space: "O(E)", note: "Directly lists every edge; neighbour lookup needs an O(E) scan." },
    { operation: "Adjacency map: neighbours of a node", best: "O(1)", average: "O(1)", worst: "O(degree)", space: "O(V + E)", note: "Expected O(1) to reach a node's neighbour set via hashing." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "V", meaning: "the number of nodes (vertices) in the graph" },
      { symbol: "E", meaning: "the number of edges (connections) in the graph" },
    ],
    costModel: "Building each set comprehension touches every edge once. Dict lookup by key and set insertion are expected O(1) under Python's hashing.",
    time: {
      bound: "O(V + E)",
      case: "worst",
      explanation: "`from_edges` scans the E edges once. `from_adj` visits every node and each of its neighbours — that is each edge from both ends — so it is O(V + E). Comparing the two resulting sets is O(E). The whole program is therefore linear in the size of the graph.",
    },
    space: {
      bound: "O(V + E)",
      case: "worst",
      explanation: "The edge list stores E pairs; the adjacency map stores V keys plus 2E neighbour entries (each undirected edge appears in two sets). The two reconstructed connection sets each hold E pairs. All are linear in the graph size.",
      inputOutputNote: "The two representations ARE the data; their O(V + E) size is inherent, not auxiliary overhead.",
    },
    derivation: [
      { lines: [8], description: "Rebuild the connection set from the edge list — one pass over E edges.", cost: "O(E)", dimension: "time" },
      { lines: [9], description: "Rebuild from the adjacency map — visit each node and its neighbours (each edge twice).", cost: "O(V + E)", dimension: "time" },
      { lines: [11], description: "Compare the two sets for equality.", cost: "O(E)", dimension: "time" },
      { lines: [3, 5], description: "Store E edges and V nodes with 2E neighbour entries.", cost: "O(V + E)", dimension: "space" },
    ],
    assumptions: ["Dict/set lookups are expected O(1) under Python's hashing.", "The example is a fixed tiny graph (V = 3, E = 3), so this run is constant work."],
    tradeoffs: "The adjacency map answers 'neighbours of X?' in expected O(1); the edge list would scan all E edges for the same question. The edge list uses less overhead per edge. Pick per your operation mix.",
    fixedDataNote: "The literals are fixed (3 nodes, 3 edges), so building them is constant work here. The O(V + E) costs describe how each representation behaves as the graph grows.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: the same connections stored two equivalent ways." },
    { line: 2, executable: false, explanation: "Comment: the edge list representation." },
    { line: 3, executable: true, explanation: "Build the edge list: three undirected edges as pairs (0,1), (0,2), (1,2)." },
    { line: 4, executable: false, explanation: "Comment: the adjacency map representation." },
    { line: 5, executable: true, explanation: "Build the adjacency map: each node mapped to the set of its neighbours." },
    { line: 6, executable: false, explanation: "Blank line." },
    { line: 7, executable: false, explanation: "Comment: rebuild the connection set from each shape and compare." },
    { line: 8, executable: true, explanation: "From the edge list: normalise each pair as (min, max) into a set of connections." },
    { line: 9, executable: true, explanation: "From the adjacency map: for every node and each neighbour, add the normalised (min, max) pair." },
    { line: 10, executable: false, explanation: "Comment: equal sets mean the two encodings describe the same graph." },
    { line: 11, executable: true, explanation: "Print whether the two reconstructed connection sets are equal — True proves equivalence." },
    { line: 12, executable: true, explanation: "Print the shared connections in sorted order: [(0, 1), (0, 2), (1, 2)]." },
  ],

  bindings: [
    { variable: "edges", model: "array" },
    { variable: "adj", model: "dict" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Which representation answers 'who are the neighbours of node 0?' faster: the edge list or the adjacency map?", answer: "The adjacency map, in expected O(1) (look up key 0).", explanation: "The adjacency map indexes node 0 directly to its neighbour set in expected O(1); the edge list must scan all edges to collect node 0's neighbours." },
  ],

  experiments: [
    "Add an edge (1, 3) to BOTH representations (and node 3 to the map) and confirm the equality check still prints True.",
    "Break the equivalence on purpose: add (0, 2) to the edge list only, and watch the equality check become False.",
    "Count how many steps it takes to list node 0's neighbours from the edge list versus the adjacency map.",
  ],

  exercises: [
    {
      id: "repr-choose-1",
      kind: "choose-approach",
      prompt: "You frequently ask 'who are the neighbours of node X?' on a changing graph. Which representation fits best: an edge list, or an adjacency map?",
      expected: "An adjacency map — neighbour lookup is expected O(1) via the key, versus scanning all E edges in an edge list.",
      hints: ["What operation is frequent?", "Neighbour lookup by node.", "An adjacency map indexes a node directly to its neighbours in expected O(1)."],
    },
    {
      id: "repr-predict-1",
      kind: "predict-state",
      prompt: "The edge list and the adjacency map here describe the same graph. From the edge list alone, what are node 0's neighbours, and which representation gives them faster?",
      expected: "Node 0's neighbours are 1 and 2. The adjacency map gives them in expected O(1) (look up key 0); the edge list must scan all edges to collect them.",
      hints: ["Scan the edge list for pairs containing 0.", "(0,1) and (0,2) contain 0 → neighbours 1 and 2.", "The adjacency map indexes key 0 directly; the edge list needs a full scan."],
    },
  ],

  review: `A **representation** is the concrete shape of your data, and the same connections fit many shapes. An **edge list** and an **adjacency map** are *equivalent* encodings of one graph — you can rebuild the same connection set from either (the program checks this and prints \`True\`). Match the representation to the **operations** you need most: the adjacency map gives expected **O(1)** neighbour lookup; the edge list iterates edges directly in **O(E)**. Both store the graph in **O(V + E)** space.`,

  expectedOutput: "True\n[(0, 1), (0, 2), (1, 2)]\n",

  references: [
    {
      url: "https://opendatastructures.org/",
      title: "Open Data Structures",
      section: "Interfaces vs implementations; graph representations",
      topic: "dsa/representations",
      purpose: "Confirm that one abstract structure (a graph / interface) has multiple equivalent implementations with different operation costs.",
      verifiedClaims: ["The same abstract data can be implemented by different structures with different runtimes", "Edge list and adjacency representations encode the same graph"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/Graphs/VocabularyandDefinitions.html",
      title: "Graphs: Vocabulary and Definitions — Problem Solving with Algorithms and DS using Python (Runestone)",
      section: "Representing a graph (edge list / adjacency)",
      topic: "dsa/representations",
      purpose: "Cross-check edge-list and adjacency representations of the same graph and their costs.",
      verifiedClaims: ["A graph can be represented by its edges or by an adjacency structure", "Adjacency lookup is faster than scanning an edge list for neighbours"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 19,
    contentHash: "6f9911863af4840e",
    verifiedAt: "2026-09-21",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
    reviewBatch: 1,
  },
};
