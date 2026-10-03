/**
 * Lesson: Representations (DSA foundations).
 * Verified on CPython 3.14. Output: "True\n3\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# One small graph, two shapes for the SAME connections.
# Edge list: each undirected edge as a pair.
edges = [(0, 1), (0, 2), (1, 2)]
# Adjacency map: each node -> the set of its neighbours.
adj = {0: {1, 2}, 1: {0, 2}, 2: {0, 1}}

# Rebuild the connection set from EACH representation. We store each undirected
# edge as (smaller, larger) so the same edge looks identical from both shapes.
from_edges = set()
for u, v in edges:
    from_edges.add((min(u, v), max(u, v)))

from_adj = set()
for node in adj:
    for neighbour in adj[node]:
        from_adj.add((min(node, neighbour), max(node, neighbour)))

# Equal sets mean the two encodings describe the SAME graph.
print(from_edges == from_adj)
print(len(from_edges))`;

export const representations: LessonDefinition = {
  id: "representations",
  title: "Representations of Data",
  area: "DSA foundations",
  // Uses lists, tuples, sets, dicts (variables-and-types) and both a simple and
  // a nested for-loop (loops) — so loops is a prerequisite, not just variables.
  prerequisites: ["variables-and-types", "loops"],

  explanation: `A **data structure** is a way of *representing* information so that the operations you care about are efficient. The same facts can be stored in different shapes, and the shape you pick determines which operations are fast.

Take a tiny graph of three nodes where 0–1, 0–2, and 1–2 are connected. Two standard shapes store **the same connections**:

- an **edge list** — a flat list of pairs, \`[(0, 1), (0, 2), (1, 2)]\`; and
- an **adjacency map** — each node mapped to the **set** of its neighbours, \`{0: {1, 2}, 1: {0, 2}, 2: {0, 1}}\`. (A \`set\` is an unordered collection of distinct values, written with \`{ }\`.)

To check they really match, the program rebuilds the collection of connections from each shape and compares them. It uses a **set of pairs**: each undirected edge is stored as \`(min, max)\` so that the edge between 0 and 1 looks identical whether we read it as \`(0, 1)\` from the list or as the neighbour \`1\` of node \`0\` in the map. A first \`for\` loop walks the edge list; a **nested** \`for\` loop walks the map (for each node, for each of its neighbours). If the two sets are equal, the encodings describe the same graph — the program prints \`True\`.

**When are the two equal?** They describe the same graph **as long as**: the graph is **undirected** (an edge \`u–v\` is the same as \`v–u\`), there are **no self-loops** (\`u == v\`), there are **no duplicate/parallel edges**, and both shapes cover the **same set of nodes**. The \`(min, max)\` normalisation and the use of a **set** are what let us ignore direction and ignore the fact that the map lists each undirected edge from *both* ends.

Neither shape is "more correct" — they trade off differently. The adjacency map answers "who are node X's neighbours?" by a direct key lookup (expected **O(1)** to reach the set, then O(degree) to read it); the edge list has no key, so the same question means scanning all edges — **O(E)**. The takeaway: **choose the representation to match your operations.** Later graph lessons extend this to adjacency lists vs adjacency matrices.`,

  vocabulary: [
    { term: "Data structure", definition: "A way of organising data to make certain operations efficient." },
    { term: "Representation", definition: "The concrete shape chosen to store information (edge list, adjacency map, …)." },
    { term: "Edge list", definition: "A flat list of pairs, each pair being one connection (edge) between two nodes." },
    { term: "Adjacency map", definition: "A map (dict) from each node to the collection of its neighbours." },
    { term: "Set", definition: "An unordered collection of distinct values, written with { }; adding a duplicate has no effect." },
    { term: "Nested loop", definition: "A loop inside another loop; here, for each node we loop over that node's neighbours." },
    { term: "Equivalent encodings", definition: "Different shapes that store the same information under stated assumptions, each rebuildable from the other." },
  ],

  concepts: {
    purpose: "Choosing the right representation is what makes an algorithm fast; the same connections can be stored as an edge list or an adjacency map.",
    operations: "Convert between encodings with loops; compare how each supports edge iteration, neighbour lookup, and membership.",
    uses: "Edge list vs adjacency map (and later adjacency list vs matrix) for graphs; array vs linked list for sequences.",
    tradeoffs: "The adjacency map reaches a node's neighbours by key in expected O(1) (then O(degree) to read them); the edge list has no key, so finding one node's neighbours scans all E edges.",
    commonMistakes: "Assuming two shapes are equivalent without checking; forgetting the assumptions (undirected, no self-loops, no duplicate edges); double-counting an undirected edge the map stores from both ends.",
    edgeCases: "Empty graph (no edges). The equality holds only under the stated assumptions: a directed graph, a self-loop (u == v), a parallel edge, or a node missing from one shape would break it.",
  },

  complexity: [
    { operation: "Edge list: find a node's neighbours", best: "O(E)", average: "O(E)", worst: "O(E)", space: "O(E)", note: "No key: must scan every edge. Storing all edges is O(E)." },
    { operation: "Adjacency map: reach a node's neighbour set", best: "O(1)", average: "O(1)", worst: "O(degree)", space: "O(V + E)", note: "Expected O(1) hashed key lookup to REACH the set; reading/enumerating the neighbours is O(degree)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "V", meaning: "the number of nodes (vertices) in the graph" },
      { symbol: "E", meaning: "the number of edges (connections) in the graph" },
    ],
    costModel: "Each set insertion and dict key lookup is expected O(1) under Python's hashing. The two rebuild loops each touch every edge; set equality compares the two sets of E pairs.",
    time: {
      bound: "O(V + E)",
      case: "worst",
      explanation: "The first loop runs once per edge (E iterations). The nested loop visits each node and each of its neighbours — every undirected edge is seen from both ends — which is O(V + E). Comparing the two sets of E pairs is O(E). There is NO sort in the program (we print a count, not a sorted list), so no O(E log E) term. The whole program is linear in the graph size.",
    },
    space: {
      bound: "O(V + E)",
      case: "worst",
      explanation: "The edge list stores E pairs; the adjacency map stores V keys plus 2E neighbour entries (each undirected edge appears in two sets). The two rebuilt connection sets each hold E pairs. All are linear in the graph size.",
      inputOutputNote: "The two representations ARE the data; their O(V + E) size is inherent, not auxiliary overhead.",
    },
    derivation: [
      { lines: [10, 11], description: "Rebuild from the edge list — one pass over E edges, each an expected O(1) set insert.", cost: "O(E)", dimension: "time" },
      { lines: [14, 15, 16], description: "Rebuild from the adjacency map — visit each node and each neighbour (each edge twice).", cost: "O(V + E)", dimension: "time" },
      { lines: [19], description: "Set equality compares the two sets of E pairs.", cost: "O(E)", dimension: "time" },
      { lines: [3, 5], description: "Store E edges and V nodes with 2E neighbour entries.", cost: "O(V + E)", dimension: "space" },
    ],
    assumptions: [
      "The graph is undirected, with no self-loops and no duplicate/parallel edges, and both shapes cover the same nodes — the conditions under which the two encodings are equal.",
      "Dict/set lookups are expected O(1) under Python's hashing.",
      "The example is a fixed tiny graph (V = 3, E = 3), so this run is constant work.",
    ],
    tradeoffs: "The adjacency map REACHES a node's neighbour set by key in expected O(1) (then O(degree) to enumerate them); the edge list has no key, so the same question scans all E edges. The edge list uses less overhead per edge. Pick per your operation mix.",
    fixedDataNote: "The literals are fixed (3 nodes, 3 edges), so building them is constant work here. The O(V + E) costs describe how each representation behaves as the graph grows.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: the same connections stored two ways." },
    { line: 2, executable: false, explanation: "Comment: the edge list representation." },
    { line: 3, executable: true, explanation: "Build the edge list: three undirected edges as pairs (0,1), (0,2), (1,2)." },
    { line: 4, executable: false, explanation: "Comment: the adjacency map representation." },
    { line: 5, executable: true, explanation: "Build the adjacency map: each node mapped to the SET of its neighbours." },
    { line: 6, executable: false, explanation: "Blank line." },
    { line: 7, executable: false, explanation: "Comment: rebuild and compare the connections from each shape." },
    { line: 8, executable: false, explanation: "Comment: store each edge as (smaller, larger) so both shapes look the same." },
    { line: 9, executable: true, explanation: "Start an empty set to collect connections rebuilt from the edge list." },
    { line: 10, executable: true, explanation: "Loop over each pair (u, v) in the edge list." },
    { line: 11, executable: true, explanation: "Add the normalised edge (min, max) to the set. A set ignores duplicates." },
    { line: 12, executable: false, explanation: "Blank line." },
    { line: 13, executable: true, explanation: "Start an empty set to collect connections rebuilt from the adjacency map." },
    { line: 14, executable: true, explanation: "Loop over each node (key) in the adjacency map." },
    { line: 15, executable: true, explanation: "Nested loop: for that node, loop over each of its neighbours." },
    { line: 16, executable: true, explanation: "Add the normalised (min, max) edge. The map lists each edge from both ends; the set collapses the duplicate." },
    { line: 17, executable: false, explanation: "Blank line." },
    { line: 18, executable: false, explanation: "Comment: equal sets mean the two encodings describe the same graph." },
    { line: 19, executable: true, explanation: "Print whether the two rebuilt connection sets are equal — True proves equivalence." },
    { line: 20, executable: true, explanation: "Print how many distinct connections there are — 3 for this graph." },
  ],

  bindings: [
    { variable: "edges", model: "array" },
    { variable: "adj", model: "dict" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Which representation answers 'who are the neighbours of node 0?' faster: the edge list or the adjacency map?", answer: "The adjacency map, in expected O(1) to reach node 0's set (then O(degree) to read it).", explanation: "The adjacency map indexes node 0 directly to its neighbour set via a hashed key lookup (expected O(1)); the edge list has no key, so it must scan all E edges to collect node 0's neighbours." },
  ],

  experiments: [
    "Add a GENUINELY NEW edge to the edge list only — change line 3 to `edges = [(0, 1), (0, 2), (1, 2), (0, 3)]`. The adjacency map still has no node 3, so the sets differ and the equality check now prints False (and the count becomes 4).",
    "Keep them in sync instead: add (0, 3) to the edge list AND put 3 in the map (`adj[0]` gains 3 and `adj[3] = {0}`); the check returns to True.",
    "Count how many steps it takes to list node 0's neighbours from the edge list (scan all edges) versus the adjacency map (one key lookup).",
  ],

  exercises: [
    {
      id: "repr-choose-1",
      kind: "choose-approach",
      prompt: "You frequently ask 'who are the neighbours of node X?' on a changing graph. Which representation fits best: an edge list, or an adjacency map?",
      expected: "An adjacency map — reaching a node's neighbours is an expected O(1) key lookup, versus scanning all E edges in an edge list.",
      hints: ["What operation is frequent?", "Neighbour lookup by node.", "An adjacency map reaches a node's neighbour set by key in expected O(1)."],
    },
    {
      id: "repr-predict-1",
      kind: "predict-state",
      prompt: "You add the new edge (0, 3) to the edge list but NOT to the adjacency map. Will `from_edges == from_adj` print True or False, and why?",
      expected: "False — the edge list now has a connection (0, 3) that the adjacency map does not, so the two rebuilt sets differ (and the printed count rises to 4).",
      hints: ["Does the adjacency map know about node 3?", "No — only the edge list changed.", "So from_edges has (0,3) but from_adj does not → the sets are unequal → False."],
    },
  ],

  review: `A **representation** is the concrete shape of your data, and the same connections fit many shapes. An **edge list** and an **adjacency map** encode one graph; the program rebuilds the connection set from each (normalising edges as \`(min, max)\` in a **set**) and prints \`True\` when they match. They match **only under stated assumptions**: undirected, no self-loops, no duplicate edges, same node set — edit one shape alone and the check prints \`False\`. Match the representation to the **operations** you need: the adjacency map reaches neighbours by key in expected **O(1)**; the edge list scans all edges in **O(E)**. Both store the graph in **O(V + E)** space.`,

  expectedOutput: "True\n3\n",

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
    contentHash: "11eb89feeb97c533",
    verifiedAt: "2026-09-21",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
    reviewBatch: 1,
  },
};
