/**
 * Lesson: Prim's algorithm (Graphs). Verified on CPython 3.14. Output: "4\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `import heapq

# Prim: build a Minimum Spanning Tree by growing one connected blob.
def prim(adj, n):
    visited = [False] * n
    pq = [(0, 0)]          # (edge weight, node); start at node 0 with cost 0
    total = 0
    count = 0
    while pq and count < n:
        w, node = heapq.heappop(pq)   # cheapest edge crossing out of the blob
        if visited[node]:
            continue                  # already in the tree -> skip
        visited[node] = True
        total += w                    # add this edge's weight to the MST
        count += 1
        for nb, w2 in adj[node]:
            if not visited[nb]:
                heapq.heappush(pq, (w2, nb))
    return total

adj = {0: [(1, 4), (2, 1)], 1: [(0, 4), (2, 2), (3, 1)],
       2: [(0, 1), (1, 2), (3, 5)], 3: [(1, 1), (2, 5)]}
print(prim(adj, 4))   # MST weight: edges 0-2(1), 2-1(2), 1-3(1) = 4`;

export const prim: LessonDefinition = {
  id: "prim",
  title: "Prim's Algorithm (MST)",
  area: "Graphs",
  prerequisites: ["dijkstra", "min-max-heaps"],

  explanation: `A **Minimum Spanning Tree (MST)** is the cheapest set of edges that connects **all** vertices of a weighted graph without cycles — think laying the least cable to link every building. **Prim's algorithm** builds it by **growing one connected blob**: start from any vertex and repeatedly add the **cheapest edge that crosses from the blob to a vertex not yet in it**.

A **min-heap** makes "cheapest crossing edge" efficient. Push the frontier edges; pop the smallest; if it leads to an already-included vertex, skip it (stale/cycle-forming); otherwise add the vertex and its edges. This greedy choice is provably optimal — the cheapest edge leaving the current tree is always safe to include (the "cut property"). Here Prim picks edges 0–2 (1), 2–1 (2), 1–3 (1) for total weight **4**.

Prim resembles Dijkstra structurally (heap of frontier candidates) but optimizes a different quantity: Dijkstra minimizes **distance from a source**, Prim minimizes the **edge weight to join the tree**. With a binary heap it's **O(E log V)** time and **O(V + E)** space. Prim is a natural fit for **dense** graphs and adjacency-list input; **Kruskal** (next) is the edge-sorting alternative that suits sparse graphs. The cue: "connect everything at minimum total cost" → MST (Prim or Kruskal).`,

  vocabulary: [
    { term: "Minimum Spanning Tree (MST)", definition: "A cycle-free edge set connecting all vertices with minimum total weight." },
    { term: "Prim's algorithm", definition: "Grows the MST from one vertex by repeatedly adding the cheapest crossing edge." },
    { term: "Crossing edge", definition: "An edge from a vertex inside the growing tree to one outside it." },
    { term: "Cut property", definition: "The cheapest edge crossing any cut is safe to include in an MST." },
    { term: "Frontier heap", definition: "A min-heap of candidate edges leaving the current tree." },
  ],

  concepts: {
    purpose: "Connect all vertices at minimum total edge weight by growing a single tree greedily.",
    operations: "From the blob, pop the cheapest crossing edge via a min-heap; add the new vertex; push its edges.",
    uses: "Network/cable/road design, clustering, approximation algorithms, minimum-cost connection.",
    tradeoffs: "O(E log V) with a heap; grows one component (good for dense graphs) vs Kruskal's edge-sort approach for sparse graphs.",
    commonMistakes: "Adding an edge to an already-included vertex (creates a cycle — skip via visited); forgetting to skip stale heap entries; confusing Prim (edge weight to join) with Dijkstra (distance from source).",
    edgeCases: "Disconnected graph has no spanning tree (Prim only spans the start's component). Duplicate/parallel edges keep the cheapest. A single vertex has MST weight 0.",
  },

  complexity: [
    { operation: "Prim (binary heap)", best: "O(E log V)", average: "O(E log V)", worst: "O(E log V)", space: "O(V + E)", note: "Each edge may push once; each vertex settled once." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "V", meaning: "the number of vertices" },
      { symbol: "E", meaning: "the number of edges" },
    ],
    costModel: "Each heap push/pop is O(log V) (heap holds O(E) edge candidates). Each vertex is settled once; each edge is pushed at most once.",
    time: {
      bound: "O(E log V)",
      case: "worst",
      explanation: "Every edge can be pushed onto the heap once when its endpoint is added to the tree — E pushes at O(log V) each → E log V. Each vertex is popped and settled once (V pops), and popping stale entries is bounded by the total pushes. The dominant term is O(E log V). (A Fibonacci heap or an adjacency-matrix version can change constants, but O(E log V) is the standard binary-heap result.)",
    },
    space: {
      bound: "O(V + E)",
      case: "worst",
      explanation: "The visited array is O(V), the adjacency list O(V + E), and the heap can hold up to O(E) candidate edges.",
      inputOutputNote: "The graph (V + E) is the input; the visited array and heap are the auxiliary space.",
    },
    derivation: [
      { lines: [10, 11, 12, 13, 14, 15], description: "Each vertex is popped/settled once; heap pops are O(log V).", cost: "O((V) log V)", dimension: "time" },
      { lines: [16, 17, 18], description: "Each edge is pushed at most once — E pushes at O(log V).", cost: "O(E log V)", dimension: "time" },
      { lines: [5, 6], description: "Visited array O(V) plus heap up to O(E).", cost: "O(V + E)", dimension: "space" },
    ],
    assumptions: ["Non-negative or arbitrary weights (MST doesn't require non-negativity).", "Binary heap: push/pop O(log V).", "Stale/visited entries are skipped so each vertex is settled once."],
    tradeoffs: "Kruskal is O(E log E) (sort edges + union-find) and suits sparse graphs; Prim's O(E log V) grows one component and suits dense graphs with adjacency lists. Both produce a minimum spanning tree.",
    counters: [{ label: "vertices added", definition: "increments of count when a vertex joins the tree (line 15)", countLines: [15] }],
    fixedDataNote: "This run builds an MST of weight 4 over 4 vertices (edges 0-2, 2-1, 1-3). The O(E log V) bound generalises to any graph.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import heapq for the frontier min-heap." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: grow one connected blob." },
    { line: 4, executable: true, explanation: "Define prim(adj, n)." },
    { line: 5, executable: true, explanation: "Track which vertices are already in the tree." },
    { line: 6, executable: true, explanation: "Heap seeded with (0, start): join node 0 at cost 0." },
    { line: 7, executable: true, explanation: "Running total MST weight." },
    { line: 8, executable: true, explanation: "How many vertices have joined." },
    { line: 9, executable: true, explanation: "Until the heap empties or all vertices are in." },
    { line: 10, executable: true, explanation: "Pop the cheapest crossing edge." },
    { line: 11, executable: true, explanation: "If its endpoint is already in the tree..." },
    { line: 12, executable: true, explanation: "...skip (adding it would form a cycle)." },
    { line: 13, executable: true, explanation: "Otherwise mark the vertex included." },
    { line: 14, executable: true, explanation: "Add this edge's weight to the MST." },
    { line: 15, executable: true, explanation: "One more vertex joined." },
    { line: 16, executable: true, explanation: "Push the new vertex's edges as future candidates..." },
    { line: 17, executable: true, explanation: "...only to vertices not yet included." },
    { line: 18, executable: true, explanation: "Push (weight, neighbour)." },
    { line: 19, executable: true, explanation: "Return the total MST weight." },
    { line: 20, executable: false, explanation: "Blank line." },
    { line: 21, executable: true, explanation: "A weighted undirected graph." },
    { line: 22, executable: true, explanation: "(continued adjacency list)." },
    { line: 23, executable: true, explanation: "prim(adj, 4) → 4 (edges 0-2, 2-1, 1-3)." },
  ],

  bindings: [
    { variable: "pq", model: "heap" },
    { variable: "visited", model: "array" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Both Prim and Dijkstra pop from a min-heap. What DIFFERENT quantity does each minimize?", answer: "Dijkstra minimizes the total DISTANCE FROM THE SOURCE to a vertex; Prim minimizes the WEIGHT OF THE SINGLE EDGE needed to attach a vertex to the growing tree.", explanation: "Both greedily expand a frontier via a heap, but the key differs: Dijkstra's key is cumulative path cost from the start, while Prim's key is just the crossing edge's weight — hence they build shortest-path trees vs minimum spanning trees." },
  ],

  experiments: [
    "Record which edges are chosen, not just the total weight.",
    "Start Prim from a different vertex and confirm the MST weight is the same.",
    "Make the graph disconnected and note Prim only spans the start's component.",
  ],

  exercises: [
    {
      id: "prim-choose-1",
      kind: "choose-approach",
      prompt: "How does Prim differ from Dijkstra given both use a min-heap, and what does Prim produce?",
      expected: "Prim keys the heap by the crossing-edge weight (to join the tree) and produces a Minimum Spanning Tree; Dijkstra keys by cumulative distance from the source and produces shortest paths. Same structure, different objective.",
      hints: ["What is each heap key?", "Prim: single edge weight; Dijkstra: distance from source.", "Prim → MST; Dijkstra → shortest paths."],
    },
    {
      id: "prim-fix-1",
      kind: "fix-mistake",
      prompt: "This Prim adds edges to already-included vertices, forming cycles and overcounting. Add the visited skip.",
      starterCode: "while pq:\n    w, node = heapq.heappop(pq)\n    visited[node] = True\n    total += w\n    for nb, w2 in adj[node]:\n        heapq.heappush(pq, (w2, nb))",
      expected: "while pq:\n    w, node = heapq.heappop(pq)\n    if visited[node]:\n        continue\n    visited[node] = True\n    total += w\n    for nb, w2 in adj[node]:\n        if not visited[nb]:\n            heapq.heappush(pq, (w2, nb))",
      hints: ["A vertex may appear in the heap multiple times.", "Skip it if already in the tree.", "if visited[node]: continue"],
    },
  ],

  review: `**Prim's algorithm** builds a **Minimum Spanning Tree** by growing one blob: repeatedly add the **cheapest edge crossing** out of the tree (via a min-heap), skipping edges to already-included vertices. It's **O(E log V)** time / **O(V + E)** space and is justified by the **cut property**. Structurally like Dijkstra but it minimizes the **joining edge weight**, not distance from a source. Prim suits dense graphs; **Kruskal** is the sparse-graph alternative.`,

  expectedOutput: "4\n",

  references: [
    {
      url: "https://cp-algorithms.com/graph/mst_prim.html",
      title: "Minimum spanning tree - Prim's algorithm — CP-Algorithms",
      section: "Heap implementation and complexity",
      topic: "graphs/prim",
      purpose: "Confirm Prim's greedy cut-property approach and its O(E log V) heap complexity.",
      verifiedClaims: ["Prim grows the MST by adding the minimum crossing edge; heap version is O(E log V)"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://algs4.cs.princeton.edu/43mst/",
      title: "Minimum Spanning Trees — Algorithms, 4th Edition (Princeton)",
      section: "Prim's algorithm and the cut property",
      topic: "graphs/prim",
      purpose: "Cross-check the cut property justifying Prim's greedy choice.",
      verifiedClaims: ["The cut property guarantees the minimum crossing edge belongs to some MST"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "7b95bb3d8a19af4c",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
