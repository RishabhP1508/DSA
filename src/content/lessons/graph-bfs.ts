/**
 * Lesson: Graph BFS (Graphs). Verified on CPython 3.14. Output: "[0, 1, 2, 3]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `from collections import deque

# BFS explores a graph level by level from a start vertex.
def bfs(adj, start):
    seen = {start}                 # mark visited on ENQUEUE
    q = deque([start])
    order = []
    while q:
        node = q.popleft()         # FIFO
        order.append(node)
        for nb in adj[node]:       # visit each neighbour once
            if nb not in seen:
                seen.add(nb)
                q.append(nb)
    return order

g = {0: [1, 2], 1: [0, 3], 2: [0, 3], 3: [1, 2]}
print(bfs(g, 0))`;

export const graphBfs: LessonDefinition = {
  id: "graph-bfs",
  title: "Graph BFS",
  area: "Graphs",
  prerequisites: ["bfs-queues", "adjacency-lists"],

  explanation: `**Graph BFS** generalizes the tree BFS you already know: explore outward in **rings of increasing distance** from a start vertex, using a **FIFO queue**. The one new ingredient a *graph* requires that a tree didn't is a **visited set** — because graphs have **cycles** and multiple paths to the same vertex, without \`seen\` you would revisit vertices forever.

The template is fixed: initialize the queue and \`seen\` with the start, then loop — dequeue a vertex, record it, and enqueue each **unseen** neighbour (marking it seen **on enqueue** so it's queued exactly once). On this graph, BFS from 0 visits \`0, 1, 2, 3\` — vertex 0 first, its neighbours 1 and 2 next, then 3.

BFS visits every reachable vertex once and scans every incident edge once, so it is **O(V + E)** time and **O(V)** space (the queue and visited set). Its defining guarantee — visiting vertices in order of distance — makes it the tool for **shortest paths in unweighted graphs** (a later lesson) and for level-based problems. The recognition cue: unweighted graph + "shortest / fewest steps / nearest" → BFS.`,

  vocabulary: [
    { term: "Graph BFS", definition: "Level-by-level exploration of a graph from a start vertex using a queue." },
    { term: "Visited set", definition: "Tracks discovered vertices so each is enqueued exactly once (needed because graphs have cycles)." },
    { term: "Frontier", definition: "The queued vertices forming the current boundary of exploration." },
    { term: "Reachable", definition: "Vertices connected to the start by some path; BFS visits exactly these." },
    { term: "Distance order", definition: "BFS visits vertices by increasing number of edges from the start." },
  ],

  concepts: {
    purpose: "Traverse a graph in distance order; the basis of unweighted shortest paths and level problems.",
    operations: "Dequeue, record, enqueue unseen neighbours; mark visited on enqueue.",
    uses: "Unweighted shortest paths, reachability, connected components, multi-source BFS, bipartite checks.",
    tradeoffs: "O(V + E) time, O(V) space; needs the visited set (unlike trees) to handle cycles.",
    commonMistakes: "Omitting the visited set (infinite loops on cycles); marking visited on dequeue (a vertex gets queued via multiple edges); using list.pop(0) (O(n)) instead of deque.popleft.",
    edgeCases: "Disconnected graph: BFS reaches only the start's component. Self-loops/back-edges skipped by seen. Single vertex returns just it.",
  },

  complexity: [
    { operation: "Graph BFS", best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)", space: "O(V)", note: "Each vertex enqueued once; each edge scanned once." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "V", meaning: "the number of vertices" },
      { symbol: "E", meaning: "the number of edges" },
    ],
    costModel: "deque.popleft/append and set add/lookup are O(1). Each vertex is enqueued once; each edge is examined once from its endpoint.",
    time: {
      bound: "O(V + E)",
      case: "worst",
      explanation: "The visited set ensures each of the V vertices is enqueued and dequeued exactly once — O(V). While processing a vertex we scan its adjacency list, and across all vertices those scans total the number of edges — O(E). Summing gives O(V + E). Naming both matters: sparse graphs (E ≈ V) run in ≈ O(V); dense graphs (E ≈ V²) run in ≈ O(V²).",
    },
    space: {
      bound: "O(V)",
      case: "worst",
      explanation: "The visited set holds up to V vertices, and the queue holds at most O(V) at once (a full frontier). The order list is also O(V).",
      inputOutputNote: "The graph (V + E) is the input; the queue, visited set, and order list are the O(V) auxiliary structures.",
    },
    derivation: [
      { lines: [9, 10], description: "Each vertex is dequeued exactly once — O(V) total.", cost: "O(V)", dimension: "time" },
      { lines: [11, 12, 13, 14], description: "Scanning all adjacency lists examines each edge once — O(E) total.", cost: "O(V + E)", dimension: "time" },
      { lines: [5, 6], description: "Visited set and queue each hold up to V vertices.", cost: "O(V)", dimension: "space" },
    ],
    assumptions: ["Adjacency-list graph; set/deque ops are O(1).", "Marking visited on enqueue guarantees one queue entry per vertex."],
    tradeoffs: "DFS has the same O(V+E) cost but explores depth-first (uses O(V) stack); BFS's queue gives distance order, which DFS does not.",
    counters: [{ label: "vertices dequeued", definition: "executions of the dequeue (line 9)", countLines: [9] }],
    fixedDataNote: "This run visits 4 vertices in BFS order from 0 → [0,1,2,3]. The O(V+E) bound generalises to any graph.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import deque for an O(1) queue." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: BFS explores level by level." },
    { line: 4, executable: true, explanation: "Define bfs(adj, start)." },
    { line: 5, executable: true, explanation: "Mark the start visited immediately (on enqueue)." },
    { line: 6, executable: true, explanation: "Initialise the queue with the start." },
    { line: 7, executable: true, explanation: "Record visit order." },
    { line: 8, executable: true, explanation: "Process until the queue empties." },
    { line: 9, executable: true, explanation: "Dequeue the front vertex (FIFO gives distance order)." },
    { line: 10, executable: true, explanation: "Record it." },
    { line: 11, executable: true, explanation: "Scan each neighbour (examines each edge once)." },
    { line: 12, executable: true, explanation: "If unseen..." },
    { line: 13, executable: true, explanation: "...mark it (on enqueue, so it's queued once)..." },
    { line: 14, executable: true, explanation: "...and enqueue it." },
    { line: 15, executable: true, explanation: "Return the BFS order." },
    { line: 16, executable: false, explanation: "Blank line." },
    { line: 17, executable: true, explanation: "A 4-vertex graph as an adjacency list." },
    { line: 18, executable: true, explanation: "bfs(g, 0) → [0, 1, 2, 3]." },
  ],

  bindings: [
    { variable: "g", model: "graph", directed: false, overlays: [{ role: "visited", label: "seen", source: "seen" }] },
    { variable: "order", model: "array" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Tree BFS needed no visited set, but graph BFS does. Why?", answer: "Because graphs contain cycles and multiple paths to the same vertex; without a visited set BFS would revisit vertices endlessly. Trees are acyclic with single parents, so no tracking is needed.", explanation: "In a graph a vertex can be reached from several neighbours; the visited set stops it from being enqueued/processed more than once, preventing infinite loops on cycles." },
  ],

  experiments: [
    "Add an edge to create a longer cycle and confirm the visited set prevents re-visits.",
    "Make the graph disconnected and see BFS reach only the start's component.",
    "Modify BFS to also record each vertex's distance from the start.",
  ],

  exercises: [
    {
      id: "gbfs-complete-1",
      kind: "complete-code",
      prompt: "Complete graph BFS to return the set of vertices reachable from start.",
      starterCode: "from collections import deque\ndef reachable(adj, start):\n    seen = {start}\n    q = deque([start])\n    while q:\n        node = q.popleft()\n        for nb in adj[node]:\n            # TODO: enqueue unseen neighbours\n            pass\n    return seen",
      expected: "from collections import deque\ndef reachable(adj, start):\n    seen = {start}\n    q = deque([start])\n    while q:\n        node = q.popleft()\n        for nb in adj[node]:\n            if nb not in seen:\n                seen.add(nb)\n                q.append(nb)\n    return seen",
      hints: ["Check whether the neighbour is already seen.", "Mark it and enqueue if new.", "if nb not in seen: seen.add(nb); q.append(nb)"],
    },
    {
      id: "gbfs-choose-1",
      kind: "choose-approach",
      prompt: "You need the fewest number of edges from A to B in an unweighted graph. BFS or DFS? Complexity?",
      expected: "BFS — it visits vertices in increasing distance, so the first time it reaches B is via a shortest (fewest-edge) path. O(V + E). DFS does not visit in distance order.",
      hints: ["Which visits by distance from the start?", "BFS fans out level by level.", "First arrival = shortest path; O(V+E)."],
    },
  ],

  review: `**Graph BFS** explores level by level with a **FIFO queue** and a **visited set** (required for graphs because of cycles), giving **O(V + E)** time and **O(V)** space. Mark visited **on enqueue** so each vertex is queued once. Its distance-order guarantee makes it the tool for **unweighted shortest paths** and reachability. Cue: unweighted + "fewest steps / nearest" → BFS.`,

  expectedOutput: "[0, 1, 2, 3]\n",

  references: [
    {
      url: "https://cp-algorithms.com/graph/breadth-first-search.html",
      title: "Breadth-first search — CP-Algorithms",
      section: "Algorithm and complexity",
      topic: "graphs/bfs",
      purpose: "Confirm graph BFS is O(V+E) with a queue and visited set and finds unweighted shortest paths.",
      verifiedClaims: ["Graph BFS is O(V + E); it requires a visited set to handle cycles; it finds unweighted shortest paths"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Graphs — BFS",
      topic: "graphs/bfs",
      purpose: "Cross-check the BFS template and its distance-order property.",
      verifiedClaims: ["BFS visits vertices in order of distance from the source"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "0e23a9d921d37b35",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
