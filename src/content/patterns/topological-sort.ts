/**
 * Pattern: Topological sort.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "[4, 5, 2, 0, 3, 1]\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `from collections import deque, defaultdict

# Topological sort (Kahn's algorithm): order nodes so every edge points forward.
def topo_sort(n, edges):
    adj = defaultdict(list)
    indeg = [0] * n
    for u, v in edges:                    # edge u -> v means u must come before v
        adj[u].append(v)
        indeg[v] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)   # start with no-prerequisite nodes
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nb in adj[node]:
            indeg[nb] -= 1                # remove this dependency
            if indeg[nb] == 0:            # all prerequisites satisfied
                q.append(nb)
    return order                          # length < n would mean a cycle

print(topo_sort(6, [(5, 2), (5, 0), (4, 0), (4, 1), (2, 3), (3, 1)]))`;

export const topologicalSortPattern: PatternDefinition = {
  id: "topological-sort",
  title: "Topological Sort",
  category: "Graphs & trees",
  summary:
    "Order the nodes of a DAG so every dependency comes before what depends on it, by repeatedly taking nodes with no remaining prerequisites.",

  clues: [
    "Tasks/items have DEPENDENCIES or a required ORDER (prerequisites, build steps, course schedules).",
    "The relationships form a directed graph and you need a valid linear ordering (or to detect impossibility/cycles).",
    "Phrases like 'course schedule', 'build order', 'task ordering', 'alien dictionary', 'compile dependencies'.",
  ],

  naiveApproach: `Guess an order and check every edge, backtracking on violations — potentially exponential. Repeatedly scanning for a node whose prerequisites are all met, without tracking in-degrees, is **O(V²)** or worse. Neither reuses the dependency counts that make this linear.`,

  whyItHelps: `Compute each node's **in-degree** (number of unmet prerequisites). Nodes with **in-degree 0** can go first; enqueue them, and as you output each node, **decrement its neighbors' in-degrees**, enqueuing any that reach 0. Every node and edge is processed once — **O(V + E)** — producing a valid order. If fewer than V nodes come out, the remaining ones are stuck in a **cycle**, so no ordering exists (a DAG is required). This is Kahn's BFS-based algorithm; a DFS post-order (reversed) also works.`,

  conditions: [
    "The graph must be a DAG — a cycle makes a topological order impossible (the algorithm detects this via output length < V).",
    "Edge direction encodes 'must come before'; be consistent about which endpoint is the prerequisite.",
    "Multiple valid orders may exist; any that respects all edges is correct.",
  ],

  alternatives: [
    "DFS post-order (reverse) — an alternative topo sort; natural when you're already doing DFS and want cycle detection via recursion colors.",
    "Plain BFS/DFS — for reachability/traversal without an ordering requirement.",
    "Dijkstra / DAG shortest path — when edges are weighted and you want longest/shortest paths in dependency order.",
  ],

  counterexamples: [
    "Undirected graphs or graphs with cycles can't be fully topologically ordered — detect the cycle instead.",
    "'Shortest path in an unweighted graph' is BFS, not topological sort.",
    "Reversing the intended edge direction yields an order that violates the real prerequisites.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "[4, 5, 2, 0, 3, 1]\n",
  complexityNote:
    "O(V + E) time — each node is enqueued once and each edge relaxes one in-degree. O(V + E) space for the adjacency list, in-degrees, and queue.",

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "V", meaning: "the number of nodes (n)" },
      { symbol: "E", meaning: "the number of edges" },
    ],
    costModel: "Kahn's algorithm: build in-degrees (O(V + E)), seed the queue with zero-in-degree nodes, then repeatedly dequeue a node and decrement its neighbours' in-degrees.",
    time: {
      bound: "O(V + E)",
      case: "worst",
      explanation: "Building adj and in-degrees (lines 7-9) is O(E). Each node is enqueued and dequeued once (lines 12-14): O(V). Each edge relaxes exactly one in-degree (lines 15-16) across the whole run: O(E). Total O(V + E).",
    },
    space: {
      bound: "O(V + E)",
      case: "worst",
      explanation: "The adjacency list is O(V + E), the in-degree array O(V), and the queue O(V).",
      inputOutputNote: "edges (O(E)) is the input; the order list is O(V) output.",
    },
    derivation: [
      { lines: [7, 8, 9], description: "Build adjacency + in-degree counts.", cost: "O(E)", dimension: "time" },
      { lines: [12, 13, 14], description: "Enqueue/dequeue each node once.", cost: "O(V)", dimension: "time" },
      { lines: [15, 16, 17, 18], description: "Relax each edge's in-degree once.", cost: "O(E)", dimension: "time" },
      { lines: [5, 6], description: "adjacency O(V+E) + in-degrees O(V).", cost: "O(V + E)", dimension: "space" },
    ],
    assumptions: ["The graph is a DAG for a full ordering; a returned order shorter than n signals a cycle.", "deque ops and list indexing are O(1)."],
    tradeoffs: "A DFS-based topological sort is also O(V + E) but uses recursion (stack depth) and post-order reversal; Kahn's is iterative and detects cycles by a short output.",
    counters: [{ label: "nodes ordered", definition: "executions of order.append (line 14)", countLines: [14] }],
    fixedDataNote: "This 6-node DAG produces a valid ordering visiting all nodes. The O(V + E) bound generalises.",
  },

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import deque (queue) and defaultdict (adjacency)." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: Kahn's algorithm." },
    { line: 4, executable: true, explanation: "Define topo_sort(n, edges)." },
    { line: 5, executable: true, explanation: "Adjacency list." },
    { line: 6, executable: true, explanation: "In-degree per node (unmet prerequisites)." },
    { line: 7, executable: true, explanation: "For each directed edge u -> v (u before v)..." },
    { line: 8, executable: true, explanation: "...record the edge..." },
    { line: 9, executable: true, explanation: "...and increment v's in-degree." },
    { line: 10, executable: true, explanation: "Seed the queue with all nodes that have no prerequisites." },
    { line: 11, executable: true, explanation: "The resulting order." },
    { line: 12, executable: true, explanation: "Process until the queue empties." },
    { line: 13, executable: true, explanation: "Take a ready node." },
    { line: 14, executable: true, explanation: "Append it to the order." },
    { line: 15, executable: true, explanation: "For each dependent neighbour..." },
    { line: 16, executable: true, explanation: "...remove this satisfied dependency." },
    { line: 17, executable: true, explanation: "If it now has no prerequisites..." },
    { line: 18, executable: true, explanation: "...it's ready; enqueue it." },
    { line: 19, executable: true, explanation: "Return the order (length < n signals a cycle)." },
    { line: 20, executable: false, explanation: "Blank line." },
    { line: 21, executable: true, explanation: "A valid ordering of the 6-node DAG is [4, 5, 2, 0, 3, 1]." },
  ],

  bindings: [
    { variable: "q", model: "queue" },
    { variable: "indeg", model: "array" },
  ],

  linkedLessons: ["topological-sort", "graph-bfs", "graph-cycle-detection"],

  exercises: [
    {
      id: "pat-topo-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Given courses with prerequisites, return an order to take them all (or report it's impossible).' Which pattern?",
      expected:
        "Topological sort (Kahn's): build in-degrees, start with prerequisite-free courses, and peel nodes as their prerequisites clear. If fewer than all courses come out, a cycle makes it impossible. O(V+E).",
      correctPatternId: "topological-sort",
      hints: [
        "Prerequisites define a directed order.",
        "Start from in-degree-0 nodes.",
        "Output length < V means a cycle.",
      ],
    },
    {
      id: "pat-topo-choose-1",
      kind: "choose-approach",
      prompt:
        "'Find the fewest edges between two nodes in an unweighted graph.' Topological sort or BFS?",
      expected:
        "BFS — that's a shortest-path (fewest edges) problem on a general graph. Topological sort orders a DAG by dependencies and doesn't compute distances.",
      correctPatternId: "topological-sort",
      hints: [
        "Fewest edges = shortest path.",
        "That's BFS.",
        "Topo sort is about ordering, not distance.",
      ],
    },
    {
      id: "pat-topo-fix-1",
      kind: "fix-mistake",
      prompt:
        "This enqueues neighbors too early (before their prerequisites clear). Fix the enqueue condition.",
      starterCode:
        "while q:\n    node = q.popleft()\n    order.append(node)\n    for nb in adj[node]:\n        indeg[nb] -= 1\n        q.append(nb)",
      expected:
        "while q:\n    node = q.popleft()\n    order.append(node)\n    for nb in adj[node]:\n        indeg[nb] -= 1\n        if indeg[nb] == 0:\n            q.append(nb)",
      hints: [
        "A node is ready only when ALL its prerequisites are done.",
        "That means its in-degree hits 0.",
        "Guard the enqueue with `if indeg[nb] == 0`.",
      ],
    },
  ],

  references: [
    {
      url: "https://cp-algorithms.com/graph/topological-sort.html",
      title: "Topological Sorting — CP-Algorithms",
      section: "Kahn's algorithm and DFS-based ordering; DAG requirement",
      topic: "patterns/topological-sort",
      purpose: "Confirm the in-degree peeling method, O(V+E) cost, and that a valid order requires a DAG.",
      verifiedClaims: [
        "Topological sort orders a DAG so every edge goes forward, computable in O(V+E).",
        "A cycle makes a topological ordering impossible.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://leetcode.com/problems/course-schedule-ii/editorial/",
      title: "Course Schedule II — LeetCode editorial",
      section: "Kahn's BFS topological sort with cycle detection",
      topic: "patterns/topological-sort",
      purpose: "Cross-check the in-degree BFS ordering and detecting impossibility when output length < V.",
      verifiedClaims: [
        "Peeling in-degree-0 nodes yields a valid course order; fewer than V outputs indicates a cycle.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "294aa2301a17661b",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
