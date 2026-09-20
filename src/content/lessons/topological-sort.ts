/**
 * Lesson: Topological sort (Graphs). Verified on CPython 3.14.
 * Output: "[4, 5, 2, 0, 3, 1]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `from collections import defaultdict, deque

# Topological sort (Kahn's algorithm): order tasks respecting dependencies.
def topo_sort(n, edges):
    adj = defaultdict(list)
    indeg = [0] * n
    for u, v in edges:            # edge u -> v means u must come before v
        adj[u].append(v)
        indeg[v] += 1             # count incoming edges
    q = deque(i for i in range(n) if indeg[i] == 0)   # start: no prerequisites
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nb in adj[node]:
            indeg[nb] -= 1        # 'complete' node; remove its outgoing edges
            if indeg[nb] == 0:    # neighbour now has all prereqs done
                q.append(nb)
    return order

print(topo_sort(6, [(5, 2), (5, 0), (4, 0), (4, 1), (2, 3), (3, 1)]))`;

export const topologicalSort: LessonDefinition = {
  id: "topological-sort",
  title: "Topological Sort",
  area: "Graphs",
  prerequisites: ["graph-bfs", "graph-cycle-detection"],

  explanation: `A **topological sort** orders the vertices of a **directed acyclic graph (DAG)** so that every edge \`u → v\` points **forward** — u comes before v. It answers "in what order can I do these tasks given their dependencies?": course prerequisites, build systems, task schedulers. It only exists if the graph has **no cycle** (a cycle is an impossible circular dependency).

**Kahn's algorithm** (shown here) uses **in-degrees** — the number of incoming edges (prerequisites) each vertex has. Start by queueing every vertex with **in-degree 0** (no prerequisites). Repeatedly take one, add it to the order, and "complete" it by decrementing its neighbours' in-degrees; whenever a neighbour's in-degree hits 0, all its prerequisites are done, so queue it. The result is a valid ordering. (An equivalent method uses DFS and reverses the postorder.)

It runs in **O(V + E)** — each vertex is queued once and each edge relaxes one in-degree once — with **O(V)** space. A valuable bonus: **Kahn's algorithm detects cycles for free**. If the final order contains fewer than V vertices, some vertices never reached in-degree 0, which means they're stuck in a cycle — no valid ordering exists. The cue: "order respecting dependencies / prerequisites" → topological sort on a DAG.`,

  vocabulary: [
    { term: "Topological sort", definition: "A linear ordering of a DAG's vertices where every edge points forward." },
    { term: "DAG", definition: "Directed acyclic graph — the only kind with a topological order." },
    { term: "In-degree", definition: "The number of incoming edges (prerequisites) of a vertex." },
    { term: "Kahn's algorithm", definition: "Repeatedly remove in-degree-0 vertices, decrementing neighbours' in-degrees." },
    { term: "Cycle detection bonus", definition: "If fewer than V vertices are output, a cycle exists (no valid order)." },
  ],

  concepts: {
    purpose: "Order tasks/vertices so all dependencies come first; the basis of scheduling and build ordering.",
    operations: "Compute in-degrees; queue in-degree-0 vertices; pop, output, decrement neighbours, queue new zeros.",
    uses: "Course scheduling, build systems, task ordering, dependency resolution, DAG longest path setup.",
    tradeoffs: "O(V + E) and detects cycles for free; only valid on a DAG (a cycle has no ordering).",
    commonMistakes: "Running it on a graph with a cycle and not checking the output length; miscounting in-degrees; queueing a vertex before its in-degree reaches 0.",
    edgeCases: "Multiple valid orderings exist (any is correct). A cycle yields an output shorter than V. Isolated vertices (in-degree 0) come out early.",
  },

  complexity: [
    { operation: "Topological sort (Kahn)", best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)", space: "O(V)", note: "Each vertex queued once; each edge decrements one in-degree once." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "V", meaning: "the number of vertices (tasks)" },
      { symbol: "E", meaning: "the number of edges (dependencies)" },
    ],
    costModel: "Computing in-degrees scans each edge once; each vertex is enqueued/dequeued once; each edge triggers one decrement.",
    time: {
      bound: "O(V + E)",
      case: "worst",
      explanation: "Building in-degrees scans all E edges — O(E). The main loop dequeues each vertex exactly once (it's queued only when its in-degree hits 0) — O(V) — and each edge is 'relaxed' (one decrement) exactly once when its source is processed — O(E). Summing gives O(V + E). The cycle check is free: comparing len(order) to V is O(1).",
    },
    space: {
      bound: "O(V)",
      case: "worst",
      explanation: "The in-degree array is O(V), the queue holds up to O(V), and the order list is O(V). The adjacency list is the input.",
      inputOutputNote: "The graph (V + E) is the input; the in-degree array, queue, and order list are the O(V) auxiliary space.",
    },
    derivation: [
      { lines: [7, 8, 9], description: "Building in-degrees scans each edge once.", cost: "O(V + E)", dimension: "time" },
      { lines: [12, 13, 14], description: "Each vertex is dequeued exactly once (when its in-degree hits 0).", cost: "O(V)", dimension: "time" },
      { lines: [15, 16, 17, 18], description: "Each edge triggers one in-degree decrement.", cost: "O(E)", dimension: "time" },
      { lines: [6, 10], description: "In-degree array, queue, and order list are each O(V).", cost: "O(V)", dimension: "space" },
    ],
    assumptions: ["Adjacency-list DAG; queue/list ops O(1).", "A vertex is queued only when its in-degree reaches 0.", "The graph should be acyclic for a full ordering."],
    tradeoffs: "DFS-based topo sort (reverse postorder) is also O(V + E); Kahn's iterative form additionally detects cycles by a short output and is easy to reason about.",
    counters: [{ label: "vertices output", definition: "appends to the order (line 14)", countLines: [14] }],
    fixedDataNote: "This run orders 6 tasks respecting the given dependencies → [4,5,2,0,3,1] (one valid order). The O(V+E) bound generalises.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import defaultdict and deque." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: Kahn's algorithm respects dependencies." },
    { line: 4, executable: true, explanation: "Define topo_sort(n, edges)." },
    { line: 5, executable: true, explanation: "Adjacency list." },
    { line: 6, executable: true, explanation: "In-degree count per vertex, starting at 0." },
    { line: 7, executable: true, explanation: "For each directed edge u -> v (u before v)..." },
    { line: 8, executable: true, explanation: "...record the edge..." },
    { line: 9, executable: true, explanation: "...and increment v's in-degree." },
    { line: 10, executable: true, explanation: "Queue all vertices with no prerequisites (in-degree 0)." },
    { line: 11, executable: true, explanation: "The output order." },
    { line: 12, executable: true, explanation: "Process the queue." },
    { line: 13, executable: true, explanation: "Take a ready vertex." },
    { line: 14, executable: true, explanation: "Add it to the order." },
    { line: 15, executable: true, explanation: "For each dependent neighbour..." },
    { line: 16, executable: true, explanation: "...decrement its in-degree (a prerequisite is done)." },
    { line: 17, executable: true, explanation: "If it now has no remaining prerequisites..." },
    { line: 18, executable: true, explanation: "...queue it as ready." },
    { line: 19, executable: true, explanation: "Return the topological order." },
    { line: 20, executable: false, explanation: "Blank line." },
    { line: 21, executable: true, explanation: "Sort 6 tasks with the given dependencies → [4, 5, 2, 0, 3, 1]." },
  ],

  bindings: [
    { variable: "indeg", model: "array" },
    { variable: "order", model: "array" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "How does Kahn's algorithm detect that no topological order exists (a cycle)?", answer: "If the produced order has fewer than V vertices, some vertices never reached in-degree 0 — they're locked in a cycle, so no valid ordering exists.", explanation: "Every vertex not in a cycle eventually loses all its prerequisites and gets queued. Vertices in a cycle perpetually block each other's in-degrees, so they're never output — a short order signals the cycle." },
  ],

  experiments: [
    "Add an edge that creates a cycle and check that len(order) < n.",
    "Note that different queue orders give different (all valid) topological orders.",
    "Add an isolated vertex and see it appear early (in-degree 0).",
  ],

  exercises: [
    {
      id: "topo-complete-1",
      kind: "complete-code",
      prompt: "Complete the in-degree update inside Kahn's main loop.",
      starterCode: "for nb in adj[node]:\n    # TODO: one prerequisite of nb is done; queue nb if ready\n    pass",
      expected: "for nb in adj[node]:\n    indeg[nb] -= 1\n    if indeg[nb] == 0:\n        q.append(nb)",
      hints: ["Decrement the neighbour's in-degree.", "If it reaches 0, all prerequisites are met.", "indeg[nb] -= 1; if indeg[nb] == 0: q.append(nb)"],
    },
    {
      id: "topo-choose-1",
      kind: "choose-approach",
      prompt: "You must schedule courses given prerequisite pairs and also report if scheduling is impossible. Which algorithm, and how do you detect impossibility?",
      expected: "Topological sort (Kahn's) — it produces a valid course order in O(V + E). If the order contains fewer than V courses, a prerequisite cycle exists and scheduling is impossible.",
      hints: ["Ordering with dependencies → topological sort.", "It runs in O(V+E).", "A short output (< V) means a cycle → impossible."],
    },
  ],

  review: `A **topological sort** linearly orders a **DAG** so every edge points forward — the answer to "do tasks respecting dependencies." **Kahn's algorithm** queues in-degree-0 vertices, then repeatedly outputs one and decrements its neighbours' in-degrees, queueing new zeros. It's **O(V + E)** time / **O(V)** space and **detects cycles for free** (output shorter than V ⇒ cycle ⇒ no valid order).`,

  expectedOutput: "[4, 5, 2, 0, 3, 1]\n",

  references: [
    {
      url: "https://cp-algorithms.com/graph/topological-sort.html",
      title: "Topological Sorting — CP-Algorithms",
      section: "Kahn's algorithm / DFS approach",
      topic: "graphs/topo-sort",
      purpose: "Confirm Kahn's in-degree algorithm, its O(V+E) cost, and that it only applies to DAGs.",
      verifiedClaims: ["Topological sort exists only for DAGs; Kahn's algorithm is O(V+E) and detects cycles via a short output"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Graphs — Course Schedule / Topological Sort",
      topic: "graphs/topo-sort",
      purpose: "Cross-check the course-scheduling application and cycle detection via topological sort.",
      verifiedClaims: ["Course scheduling uses topological sort; an incomplete order signals a prerequisite cycle"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 15,
    contentHash: "153b5c1ed4d17631",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
