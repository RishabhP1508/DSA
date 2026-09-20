/**
 * Lesson: Floyd-Warshall (Graphs). Verified on CPython 3.14. Output: "[0, 3, 1, 4]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Floyd-Warshall: shortest paths between ALL pairs of vertices.
def floyd_warshall(n, edges):
    INF = float("inf")
    d = [[INF] * n for _ in range(n)]
    for i in range(n):
        d[i][i] = 0                    # distance to self is 0
    for u, v, w in edges:
        d[u][v] = min(d[u][v], w)      # direct edges
    # Try every vertex k as an intermediate point between i and j.
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if d[i][k] + d[k][j] < d[i][j]:
                    d[i][j] = d[i][k] + d[k][j]
    return d

edges = [(0, 1, 4), (0, 2, 1), (2, 1, 2), (1, 3, 1), (2, 3, 5)]
d = floyd_warshall(4, edges)
print(d[0])   # shortest distances FROM vertex 0 to all others`;

export const floydWarshall: LessonDefinition = {
  id: "floyd-warshall",
  title: "Floyd-Warshall (All-Pairs Shortest Paths)",
  area: "Graphs",
  prerequisites: ["bellman-ford"],

  explanation: `**Floyd–Warshall** computes the shortest path between **every pair** of vertices at once — "all-pairs shortest paths" — rather than from a single source. It's a compact dynamic-programming algorithm over a **distance matrix** \`d\`, where \`d[i][j]\` is the best known distance from i to j.

The core idea is elegant: consider each vertex **k** in turn as a possible **intermediate** point on a path. For every pair (i, j), ask "is going i → k → j cheaper than what I have?" — if so, update \`d[i][j] = d[i][k] + d[k][j]\`. After you've allowed every vertex to serve as an intermediate (the outer \`k\` loop over all n vertices), \`d[i][j]\` holds the true shortest distance using any intermediates. Order matters: **k must be the outermost loop**. Here \`d[0]\` ends as \`[0, 3, 1, 4]\`, matching the single-source results.

The cost is three nested loops over all vertices: **O(V³)** time and **O(V²)** space. That sounds expensive, but for **all pairs** it's often better than running Dijkstra from every vertex on dense graphs, and the code is tiny. It also handles **negative edges** (like Bellman–Ford) and can detect negative cycles (a negative \`d[i][i]\`). The recognition rule: **single source → BFS/Dijkstra/Bellman–Ford; all pairs, small/dense graph → Floyd–Warshall.**`,

  vocabulary: [
    { term: "All-pairs shortest paths", definition: "The shortest distance between every ordered pair of vertices." },
    { term: "Distance matrix", definition: "d[i][j] = best known distance from i to j; the algorithm's state." },
    { term: "Intermediate vertex k", definition: "A vertex allowed to sit on the path between i and j." },
    { term: "k-outermost rule", definition: "The intermediate loop k must enclose the i and j loops for correctness." },
    { term: "Negative-cycle check", definition: "A negative d[i][i] after running indicates a negative cycle." },
  ],

  concepts: {
    purpose: "Compute shortest paths between all pairs of vertices with a simple DP over a distance matrix.",
    operations: "Initialize d with self=0 and direct edges; for each intermediate k, relax every (i, j).",
    uses: "All-pairs distances, transitive closure, small dense graphs, routing tables, graph diameter.",
    tradeoffs: "O(V³) time, O(V²) space; simple and handles negatives, but too slow for large sparse graphs (use Dijkstra per source).",
    commonMistakes: "Putting k as an inner loop (breaks correctness — k must be outermost); forgetting to initialize d[i][i]=0; using it on huge graphs where O(V³) is infeasible.",
    edgeCases: "Unreachable pairs stay infinity. Negative edges are allowed. A negative d[i][i] flags a negative cycle. Multiple edges between a pair keep the minimum.",
  },

  complexity: [
    { operation: "Floyd-Warshall", best: "O(V^3)", average: "O(V^3)", worst: "O(V^3)", space: "O(V^2)", note: "Three nested loops over vertices; matrix of all pairs." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "V", meaning: "the number of vertices" }],
    costModel: "Each relaxation d[i][j] = min(...) is O(1). The algorithm does three nested loops over all vertices.",
    time: {
      bound: "O(V^3)",
      case: "worst",
      explanation: "The intermediate loop k, the row loop i, and the column loop j each run V times and are NESTED, so the body executes V × V × V = V³ times, each an O(1) relaxation. Hence O(V³). There is no data-dependent variation — it always does exactly V³ relaxations. For all-pairs on a DENSE graph this beats running Dijkstra from each vertex (V · O((V+E) log V) ≈ V³ log V when E ≈ V²); for sparse graphs, per-source Dijkstra can be better.",
    },
    space: {
      bound: "O(V^2)",
      case: "worst",
      explanation: "The distance matrix stores all V² pairs — O(V²). The algorithm updates it in place, adding only O(1).",
      inputOutputNote: "The V×V distance matrix is both the working state and the all-pairs result.",
    },
    derivation: [
      { lines: [10], description: "The intermediate loop k runs V times (must be outermost).", cost: "O(V)", dimension: "time" },
      { lines: [11, 12, 13, 14], description: "The nested i and j loops run V×V, each an O(1) relaxation.", cost: "O(V^3)", dimension: "time" },
      { lines: [4], description: "The distance matrix holds all V² pairs.", cost: "O(V^2)", dimension: "space" },
    ],
    assumptions: ["Relaxations are O(1).", "k is the OUTERMOST loop (required for correctness).", "Edge weights may be negative but no negative cycles for finite results."],
    tradeoffs: "For all-pairs on dense graphs Floyd–Warshall's O(V³) and tiny code win; on sparse graphs, running Dijkstra from each source (O(V·(V+E) log V)) can be faster. Bellman–Ford handles negatives for a single source in O(V·E).",
    counters: [],
    fixedDataNote: "This run on 4 vertices does 4³ = 64 relaxations; d[0] = [0, 3, 1, 4]. The O(V³) bound generalises to any vertex count.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: all-pairs shortest paths." },
    { line: 2, executable: true, explanation: "Define floyd_warshall(n, edges)." },
    { line: 3, executable: true, explanation: "INF marks 'no known path yet'." },
    { line: 4, executable: true, explanation: "The V×V distance matrix, all infinity to start (O(V²) space)." },
    { line: 5, executable: true, explanation: "For each vertex..." },
    { line: 6, executable: true, explanation: "...distance to itself is 0." },
    { line: 7, executable: true, explanation: "For each direct edge..." },
    { line: 8, executable: true, explanation: "...set d[u][v] to its (minimum) weight." },
    { line: 9, executable: false, explanation: "Comment: try each vertex as an intermediate." },
    { line: 10, executable: true, explanation: "k = the intermediate vertex — MUST be the outermost loop." },
    { line: 11, executable: true, explanation: "For each source i..." },
    { line: 12, executable: true, explanation: "...for each destination j..." },
    { line: 13, executable: true, explanation: "...if routing i → k → j is cheaper..." },
    { line: 14, executable: true, explanation: "...update d[i][j]." },
    { line: 15, executable: true, explanation: "Return the all-pairs distance matrix." },
    { line: 16, executable: false, explanation: "Blank line." },
    { line: 17, executable: true, explanation: "An edge list." },
    { line: 18, executable: true, explanation: "Run Floyd–Warshall on 4 vertices." },
    { line: 19, executable: true, explanation: "d[0] = shortest distances from 0 → [0, 3, 1, 4]." },
  ],

  bindings: [
    { variable: "d", model: "matrix" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why must the intermediate vertex loop k be the OUTERMOST of the three loops?", answer: "Because d[i][j] must consider paths using intermediates {0..k} before {0..k+1}; making k outermost ensures d[i][k] and d[k][j] are already finalized for intermediates < k when used. Nesting k inside i/j would use inconsistent, partial values and give wrong results.", explanation: "Floyd–Warshall is DP over 'shortest path using intermediates up to k.' Processing all (i,j) for each k in turn guarantees the subproblems it relies on are complete; reordering the loops violates that dependency." },
  ],

  experiments: [
    "Print the full matrix d to see all-pairs distances.",
    "Swap the loop order to put k innermost and observe wrong results.",
    "Add a negative edge and confirm distances still compute correctly.",
  ],

  exercises: [
    {
      id: "fw-choose-1",
      kind: "choose-approach",
      prompt: "You need shortest distances between ALL pairs in a small dense graph (V ≈ 200, edges ≈ V²). Floyd–Warshall or Dijkstra-from-every-source? Why?",
      expected: "Floyd–Warshall: O(V³) with tiny code, and on a dense graph running Dijkstra from every source is ~O(V·(V+E) log V) ≈ O(V³ log V) — Floyd–Warshall avoids the log factor and is simpler for all-pairs on dense/small graphs.",
      hints: ["All pairs, dense, small V.", "Per-source Dijkstra adds a log factor when dense.", "Floyd–Warshall is O(V³) and simplest here."],
    },
    {
      id: "fw-fix-1",
      kind: "fix-mistake",
      prompt: "This has the intermediate loop k innermost, giving wrong distances. Fix the loop order so k is outermost.",
      starterCode: "for i in range(n):\n    for j in range(n):\n        for k in range(n):\n            if d[i][k] + d[k][j] < d[i][j]:\n                d[i][j] = d[i][k] + d[k][j]",
      expected: "for k in range(n):\n    for i in range(n):\n        for j in range(n):\n            if d[i][k] + d[k][j] < d[i][j]:\n                d[i][j] = d[i][k] + d[k][j]",
      hints: ["k is the intermediate vertex.", "It must enclose i and j.", "Move the k loop to be the outermost."],
    },
  ],

  review: `**Floyd–Warshall** finds **all-pairs** shortest paths via DP on a distance matrix: for each **intermediate vertex k (outermost loop)**, relax every pair through k. It's **O(V³)** time / **O(V²)** space, handles **negative edges** (and detects negative cycles via a negative diagonal), and its tiny code beats per-source Dijkstra on **dense** graphs. Rule: single source → BFS/Dijkstra/Bellman–Ford; **all pairs, small/dense → Floyd–Warshall**.`,

  expectedOutput: "[0, 3, 1, 4]\n",

  references: [
    {
      url: "https://cp-algorithms.com/graph/all-pair-shortest-path-floyd-warshall.html",
      title: "Floyd-Warshall — CP-Algorithms",
      section: "Algorithm, loop order, complexity",
      topic: "graphs/floyd-warshall",
      purpose: "Confirm the DP formulation, the k-outermost loop requirement, and O(V³) time / O(V²) space.",
      verifiedClaims: ["Floyd-Warshall is O(V³) time and O(V²) space; the intermediate loop k must be outermost"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://algs4.cs.princeton.edu/44sp/",
      title: "Shortest Paths — Algorithms, 4th Edition (Princeton)",
      section: "All-pairs shortest paths",
      topic: "graphs/floyd-warshall",
      purpose: "Cross-check the all-pairs problem and when a matrix-based cubic method is appropriate.",
      verifiedClaims: ["All-pairs shortest paths can be computed with a dynamic-programming matrix method"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "485ad074b62f766d",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
