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

**What the check actually compares.** Be precise about what \`from_edges == from_adj\` proves: it compares two **sets of normalised \`(min, max)\` edges**. It does **not** check that the two shapes list the same **vertices**, that the adjacency map stores each edge from **both** ends (reciprocity), or **how many times** an edge appears (multiplicity). So this is an **example under stated assumptions, not a general graph-equivalence validator**. We rely on the graph being **undirected** (an edge \`u–v\` is the same as \`v–u\`), with **no self-loops** (\`u == v\`), **no duplicate/parallel edges**, and **the same set of nodes** in both shapes. The \`(min, max)\` normalisation and the **set** are what let us ignore direction and the map's both-ends listing.

Because a set ignores order and duplicates, several assumption violations can **still print \`True\`** — the check will not catch them: a **parallel/duplicate** edge in the list collapses to one element (multiplicity is lost); a **non-reciprocal** map (node 0 lists 1 but node 1 omits 0) normalises to the same edge; and an **isolated node** present in only one shape contributes no edge, so the edge sets can match even though the vertex sets differ. A real graph-equivalence check would also compare vertex sets and (for directed graphs) edge direction — this lesson deliberately does not, to keep the example small.

Neither shape is "more correct" — they trade off differently. The adjacency map answers "who are node X's neighbours?" by a direct key lookup (expected **O(1)** to reach the set, then O(degree) to read it); the edge list has no key, so the same question means scanning all edges — **O(E)**. The takeaway: **choose the representation to match your operations.** Later graph lessons extend this to adjacency lists vs adjacency matrices.`,

  vocabulary: [
    { term: "Data structure", definition: "A way of organising data to make certain operations efficient." },
    { term: "Representation", definition: "The concrete shape chosen to store information (edge list, adjacency map, …)." },
    { term: "Edge list", definition: "A flat list of pairs, each pair being one connection (edge) between two nodes." },
    { term: "Adjacency map", definition: "A map (dict) from each node to the collection of its neighbours." },
    { term: "Set", definition: "An unordered collection of distinct values, written with { }; adding a duplicate has no effect." },
    { term: "Nested loop", definition: "A loop inside another loop; here, for each node we loop over that node's neighbours." },
    { term: "Equivalent encodings", definition: "Different shapes that store the same information under stated assumptions, each rebuildable from the other." },
    { term: "Normalised edge set", definition: "The set of edges each stored as (min, max); comparing two such sets ignores order, direction, and duplicates." },
    { term: "Not a general validator", definition: "This check compares edge sets only; it does not verify vertex sets, reciprocity, or edge multiplicity, so some assumption violations still compare equal." },
  ],

  concepts: {
    purpose: "Choosing the right representation is what makes an algorithm fast; the same connections can be stored as an edge list or an adjacency map.",
    operations: "Convert between encodings with loops; compare how each supports edge iteration, neighbour lookup, and membership.",
    uses: "Edge list vs adjacency map (and later adjacency list vs matrix) for graphs; array vs linked list for sequences.",
    tradeoffs: "The adjacency map reaches a node's neighbours by key in expected O(1) (then O(degree) to read them); the edge list has no key, so finding one node's neighbours scans all E edges.",
    commonMistakes: "Treating this edge-set check as a general graph-equivalence validator — it is not: a parallel/duplicate edge, a non-reciprocal entry, or an isolated extra node can still compare equal; forgetting the assumptions (undirected, no self-loops, no duplicate edges, same node set); double-counting an undirected edge the map stores from both ends.",
    edgeCases: "Empty graph (no edges). The check only compares normalised edge SETS, so it is reliable just under the stated assumptions. Some violations still print True (it cannot catch them): a parallel/duplicate edge collapses in the set (multiplicity lost), a non-reciprocal adjacency entry normalises to the same edge, and an isolated node present in only one shape adds no edge. It is NOT a general graph-equivalence validator (which would also compare vertex sets and, for directed graphs, edge direction).",
  },

  complexity: [
    { operation: "Edge list: find a node's neighbours", best: "O(E)", average: "O(E)", worst: "O(E)", space: "O(E)", note: "No key: must scan every edge. Plain list scan (no hashing), so O(E) in all cases. Storing all edges is O(E)." },
    { operation: "Adjacency map: reach a node's neighbour set", best: "O(1)", average: "O(1)", worst: "O(V)", space: "O(V + E)", note: "A single hashed dict key lookup: expected O(1) (Python dict Get Item, average O(1)); the hashing worst case is O(V) if keys collide. This is only REACHING the set — not reading its members." },
    { operation: "Adjacency map: enumerate a node's neighbours", best: "O(degree)", average: "O(degree)", worst: "O(degree)", space: "O(1)", note: "Iterating the reached set visits each neighbour once — linear in that node's degree, in all cases (set iteration is O(size))." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "V", meaning: "the number of nodes (vertices) in the graph" },
      { symbol: "E", meaning: "the number of edges (connections) in the graph" },
    ],
    costModel: "Each set insertion and dict key lookup is EXPECTED (average-case) O(1) under Python's hashing — not a guaranteed worst case: the Python TimeComplexity reference lists dict/set lookup and insert as average O(1) but worst case O(n) when keys collide. The two rebuild loops each touch every edge; set equality compares the two sets of E pairs.",
    time: {
      bound: "O(V + E)",
      case: "expected",
      explanation: "The first loop runs once per edge (E iterations). The nested loop visits each node and each of its neighbours — every undirected edge is seen from both ends — which is O(V + E). Comparing the two sets of E pairs is O(E). There is NO sort in the program (we print a count, not a sorted list), so no O(E log E) term. This O(V + E) is the EXPECTED (average) case: it assumes the set inserts and set-equality hashing are O(1) each. Under adversarial hash collisions the dict/set operations degrade to O(n), making the worst case superlinear — but that does not happen for ordinary integer keys like these.",
      otherCases: [
        {
          case: "worst",
          bound: "superlinear (hashing collisions)",
          note: "If every key hashed to one bucket, each set insert / membership step would be O(n) instead of O(1), so the rebuild + comparison would be well above O(V + E). This is the documented dict/set worst case, not reachable with these integer node labels.",
        },
      ],
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
    tradeoffs: "Two distinct steps: the adjacency map REACHES a node's neighbour set by key in expected O(1) (a dict lookup), then ENUMERATES those neighbours in O(degree) (iterating the set). The edge list has no key, so answering the same question scans all E edges — O(E). The edge list uses less overhead per edge. Pick per your operation mix.",
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

  review: `A **representation** is the concrete shape of your data, and the same connections fit many shapes. An **edge list** and an **adjacency map** encode one graph; the program rebuilds a **set of normalised \`(min, max)\` edges** from each and prints \`True\` when those edge sets match. This is an **example under stated assumptions** (undirected, no self-loops, no duplicate edges, same node set) — **not a general graph-equivalence validator**: because it compares only edge sets, some violations (a parallel/duplicate edge, a non-reciprocal entry, an isolated node) can still print \`True\`. Match the representation to the **operations** you need: the adjacency map **reaches** a node's neighbour set by key in expected **O(1)** then **enumerates** it in **O(degree)**; the edge list scans all edges in **O(E)**. Both store the graph in **O(V + E)** space.`,

  expectedOutput: "True\n3\n",

  references: [
    {
      url: "https://opendatastructures.org/ods-python/12_Graphs.html",
      title: "Open Data Structures (Python) — 12. Graphs",
      section: "Chapter 12 intro: a graph G = (V, E) and its two representations",
      topic: "dsa/representations",
      purpose: "Confirm a graph is an abstract structure (G = (V, E), edges are pairs of vertices) with more than one standard representation, so the same graph can be stored different ways.",
      verifiedClaims: [
        "A (directed) graph is a pair G = (V, E) where E is a set of pairs of vertices (edges)",
        "There are two broad standard representations of a graph (adjacency matrix and adjacency list)",
      ],
      accessDate: "2026-10-02",
    },
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/Graphs/VocabularyandDefinitions.html",
      title: "7.2 Graphs: Vocabulary and Definitions — Problem Solving with Algorithms and DS using Python (Runestone)",
      section: "Vertex / Edge definitions",
      topic: "dsa/representations",
      purpose: "Beginner cross-check of the graph vocabulary used in the lesson (vertices and edges).",
      verifiedClaims: [
        "A graph is made of vertices and edges; an edge connects two vertices (a tuple (v, w))",
      ],
      accessDate: "2026-10-02",
    },
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/Graphs/TheGraphAbstractDataType.html",
      title: "7.3 The Graph Abstract Data Type — Problem Solving with Algorithms and DS using Python (Runestone)",
      section: "Representations trade-off (adjacency matrix vs adjacency list)",
      topic: "dsa/representations",
      purpose: "Confirm the graph ADT can be implemented by different representations with trade-offs — the lesson's edge list vs adjacency map choice.",
      verifiedClaims: [
        "The graph ADT (vertices + edges) has more than one implementation, with trade-offs between representations (adjacency matrix and adjacency list)",
      ],
      accessDate: "2026-10-02",
    },
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/Graphs/AnAdjacencyList.html",
      title: "7.5 An Adjacency List — Problem Solving with Algorithms and DS using Python (Runestone)",
      section: "Adjacency list as a per-vertex dictionary of neighbours",
      topic: "dsa/representations",
      purpose: "Support the adjacency-map claim: each vertex maps to its neighbours, which makes finding one vertex's neighbours easy (vs scanning an edge list).",
      verifiedClaims: [
        "An adjacency list keeps, per vertex, a collection (dictionary) of the vertices it connects to",
        "The adjacency list makes it easy to find the vertices directly connected to a particular vertex, and is space-efficient for sparse graphs",
      ],
      accessDate: "2026-10-02",
    },
    {
      url: "https://wiki.python.org/moin/TimeComplexity",
      title: "TimeComplexity — Python Wiki",
      section: "dict (Get Item, k in d) and set (x in s)",
      topic: "dsa/representations",
      purpose: "Ground the complexity case labels: a dict/set lookup is EXPECTED (average) O(1), with an amortized worst case of O(n) under hash collisions — so reaching a neighbour set is expected O(1)/worst O(V), distinct from the O(degree) enumeration cost.",
      verifiedClaims: [
        "dict Get Item and 'k in d' are Average Case O(1), Amortized Worst Case O(n)",
        "set 'x in s' is Average O(1), Worst Case O(n)",
      ],
      accessDate: "2026-10-02",
    },
  ],
  evidence: {
    inventoryVersion: 19,
    contentHash: "d145cc3190c48bc8",
    verifiedAt: "2026-10-02",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
    reviewBatch: 1,
  },
};
