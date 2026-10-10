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
  "purpose": "Compute shortest paths between all pairs of vertices with a simple DP over a distance matrix.",
  "operations": "Initialize d with self=0 and direct edges; for each intermediate k, relax every (i, j).",
  "uses": "All-pairs distances, transitive closure, small dense graphs, routing tables, graph diameter.",
  "tradeoffs": "O(V³) time, O(V²) space; simple and handles negatives, but too slow for large sparse graphs (use Dijkstra per source).",
  "commonMistakes": "Putting k as an inner loop (breaks correctness — k must be outermost); forgetting to initialize d[i][i]=0; using it on huge graphs where O(V³) is infeasible.",
  "edgeCases": "Empty graph returns an empty matrix. Keep the minimum parallel-edge weight. Finite negative edges are allowed, but a negative diagonal indicates a negative cycle: pairs that can reach it and then reach their destination have no finite optimum."
},

  complexity: [
  {
    "operation": "Floyd-Warshall",
    "best": "O(V³+E)",
    "average": "O(V³+E)",
    "worst": "O(V³+E)",
    "space": "O(1) working; O(V²) output",
    "note": "Scan supplied edges and execute V³ relaxations. Output matrix is quadratic; simple graphs simplify time to cubic."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "V",
      "meaning": "the number of vertices"
    },
    {
      "symbol": "E",
      "meaning": "number of supplied edges, including parallel entries"
    }
  ],
  "costModel": "Each relaxation d[i][j] = min(...) is O(1). The algorithm does three nested loops over all vertices.",
  "time": {
    "bound": "O(V³+E)",
    "case": "worst",
    "explanation": "Initialize a V² output matrix, scan E edges, then evaluate V³ (k,i,j) phase candidates: O(V³+E) for V>=1. E=0,V=0 returns an empty matrix in constant time."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Only loop indices and temporary arithmetic are auxiliary. The V by V matrix is the required all-pairs output and is updated in place.",
    "inputOutputNote": "The returned distance matrix uses O(V²); input edges and output matrix are excluded from auxiliary storage."
  },
  "derivation": [
    {
      "lines": [
        10
      ],
      "description": "The intermediate loop k runs V times (must be outermost).",
      "cost": "O(V)",
      "dimension": "time"
    },
    {
      "lines": [
        11,
        12,
        13,
        14
      ],
      "description": "The nested i and j loops run V×V, each an O(1) relaxation.",
      "cost": "O(V^3)",
      "dimension": "time"
    },
    {
      "lines": [
        4
      ],
      "description": "Constant loop state beyond the required V² output matrix.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Relaxations are O(1).",
    "k is the OUTERMOST loop (required for correctness).",
    "Edge weights may be negative but no negative cycles for finite results.",
    "Finite weights; valid endpoints. Python infinity plus a finite negative weight stays infinity.",
    "No affected pair has a finite shortest distance when a reachable negative cycle lies on a route. Inspect the negative diagonal before interpreting those results.",
    "For simple graphs E=O(V²), so the bound simplifies to O(V³). Parallel edges need the extra E input scan."
  ],
  "tradeoffs": "Floyd–Warshall is a direct O(V³+E) all-pairs method. Repeated binary-heap Dijkstra can be useful for sparse nonnegative graphs; dense array-scan Dijkstra is another cubic all-pairs variant. Bellman–Ford handles one source with negative edges in O(V+V*E).",
  "counters": [],
  "fixedDataNote": "With V=4 the example makes 64 phase relaxations after scanning edges. Its first output row is [0,3,1,4]. Parallel-edge input requires the additional E scan.",
  "references": [
    {
      "url": "https://cp-algorithms.com/graph/all-pair-shortest-path-floyd-warshall.html",
      "title": "CP Algorithms: Floyd–Warshall",
      "section": "Phase invariant; implementation; negative cycles",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "k is the outer phase loop.",
        "Negative cycles invalidate affected pairs."
      ],
      "conventions": [
        "App numbers vertices from zero and uses Python infinity."
      ],
      "accessDate": "2026-10-10"
    },
    {
      "url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/2430d7903a5529451d80c17f89a41fe8_MIT6_006S20_lec12.pdf",
      "title": "MIT 6.006 Lecture 12: Bellman–Ford",
      "section": "Pages 1–3: simple shortest paths and negative-cycle witnesses",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "A finite optimum has a simple representative with at most V−1 edges."
      ],
      "conventions": [],
      "accessDate": "2026-10-10"
    },
    {
      "url": "https://raw.githubusercontent.com/kevin-wayne/algs4/master/src/main/java/edu/princeton/cs/algs4/FloydWarshall.java",
      "title": "Princeton algs4: Floyd–Warshall",
      "section": "Class documentation lines 18–38; initialization/phase/negative diagonal lines 57–95",
      "topic": "trees-graphs-range",
      "purpose": "Cross-check the exact implementation variant and boundary contract.",
      "verifiedClaims": [
        "Floyd–Warshall permits negative edges when shortest distances are well defined.",
        "The outer loop controls allowed intermediate vertices.",
        "A negative diagonal detects a negative cycle.",
        "Distance matrix storage is quadratic."
      ],
      "conventions": [
        "Source additionally stores a predecessor matrix and rejects negative-cycle distance queries.",
        "App returns the distance matrix; its returned matrix is output storage, and affected pairs must not be interpreted as finite shortest distances."
      ],
      "accessDate": "2026-10-10"
    }
  ]
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
    "id": "fw-choose-1",
    "kind": "choose-approach",
    "prompt": "You need shortest distances between ALL pairs in a small dense graph (V ≈ 200, edges ≈ V²). Floyd–Warshall or Dijkstra-from-every-source? Why?",
    "expected": "Floyd–Warshall: O(V³) with tiny code, and on a dense graph running Dijkstra from every source is ~O(V·(V+E) log V) ≈ O(V³ log V) — Floyd–Warshall avoids the log factor and is simpler for all-pairs on dense/small graphs.",
    "hints": [
      "Goal: get shortest distances between ALL pairs in a small dense graph (V ≈ 200, E ≈ V²) — Floyd–Warshall or Dijkstra-from-every-source.",
      "The costlier option on a dense graph is running Dijkstra from every source, which carries a log factor across all V runs.",
      "Key property: you need all-pairs distances on a small, dense graph where a simple O(V³) triple loop is entirely affordable.",
      "Approach: use Floyd–Warshall's three nested loops over intermediate vertices.",
      "Reasoning: Floyd–Warshall is O(V³) with tiny code, while Dijkstra from every source is ~O(V³ log V) on dense graphs; the all-source Dijkstra approach wins mainly on sparse graphs.",
      "Answer: Floyd–Warshall — O(V³) and simple, avoiding the log factor of ~O(V³ log V) all-source Dijkstra on a small dense graph."
    ],
    "recognition": {
      "scenario": "You need shortest distances between ALL pairs of vertices in a small, dense graph (V ≈ 200, edges ≈ V²).",
      "approaches": [
        {
          "id": "floyd-warshall",
          "label": "Floyd–Warshall",
          "requiredReasonIds": [
            "fw-dense-allpairs"
          ]
        },
        {
          "id": "dijkstra-each-source",
          "label": "Binary-heap Dijkstra from every vertex",
          "requiredReasonIds": [],
          "rejectionFeedback": "For dense input the binary-heap upper bound adds a logarithmic factor; Floyd–Warshall is a simple cubic all-pairs choice. Array-based dense Dijkstra is also cubic, so this comparison is specific to the heap variant."
        }
      ],
      "reasons": [
        {
          "id": "fw-dense-allpairs",
          "text": "Floyd–Warshall is O(V³) with tiny triple-loop code, and on a dense graph that beats the O(V³ log V) of Dijkstra-from-every-source while being far simpler."
        },
        {
          "id": "fw-slower-dense",
          "text": "Floyd–Warshall is asymptotically slower than Dijkstra-from-every-source on dense graphs.",
          "contradictory": true
        },
        {
          "id": "fw-single-source",
          "text": "Floyd–Warshall only computes paths from a single source.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "floyd-warshall"
      ],
      "modelExplanation": "Floyd–Warshall: O(V³) with tiny code; on a dense graph, Dijkstra from every source is ~O(V³ log V). Floyd–Warshall avoids the log factor and is simpler for all-pairs on dense/small graphs."
    }
  },
  {
    "id": "fw-fix-1",
    "kind": "fix-mistake",
    "prompt": "`floyd_warshall(d, n)` returns the all-pairs shortest-distance matrix (d is the initial distance matrix, n the vertex count). This has the intermediate loop k innermost, giving wrong distances. Fix the loop order so k is outermost.",
    "starterCode": "def floyd_warshall(d, n):\n    for i in range(n):\n        for j in range(n):\n            for k in range(n):\n                if d[i][k] + d[k][j] < d[i][j]:\n                    d[i][j] = d[i][k] + d[k][j]\n    return d",
    "expected": "def floyd_warshall(d, n):\n    for k in range(n):\n        for i in range(n):\n            for j in range(n):\n                if d[i][k] + d[k][j] < d[i][j]:\n                    d[i][j] = d[i][k] + d[k][j]\n    return d",
    "hints": [
      "Goal: fix Floyd–Warshall's loop order so all-pairs distances come out correct.",
      "With k innermost, intermediate vertices aren't fully considered before being used, giving wrong results.",
      "Key insight: k is the intermediate vertex and must be the outermost loop so each k is finished before the next.",
      "Approach: order the loops k, then i, then j.",
      "Pseudocode: for k: for i: for j: if d[i][k] + d[k][j] < d[i][j]: update d[i][j].",
      "Move the `k` loop to be outermost, enclosing the `i` and `j` loops."
    ],
    "tests": "INF = float('inf')\nd = floyd_warshall([[0, 3, INF, 7], [8, 0, 2, INF], [5, INF, 0, 1], [2, INF, INF, 0]], 4)\nassert d[0] == [0, 3, 5, 6], f'row 0 all-pairs shortest, got {d[0]}'\nassert d[1] == [5, 0, 2, 3], f'row 1, got {d[1]}'\nassert d[2] == [3, 6, 0, 1], f'row 2, got {d[2]}'\nassert d[3] == [2, 5, 7, 0], f'row 3, got {d[3]}'\n# A different graph so a hard-coded matrix cannot pass.\nd2 = floyd_warshall([[0, 1, INF], [INF, 0, 1], [1, INF, 0]], 3)\nassert d2[0] == [0, 1, 2], f'triangle row 0, got {d2[0]}'\nassert d2[1] == [2, 0, 1], f'triangle row 1, got {d2[1]}'\nassert d2[2] == [1, 2, 0], f'triangle row 2, got {d2[2]}'\n# Single vertex.\nassert floyd_warshall([[0]], 1) == [[0]], 'single vertex matrix unchanged'\nprint('OK')"
  }
],

  review: "Floyd–Warshall updates all-pairs output using k as the outer intermediate-vertex phase. Cost is O(V³+E), or O(V³) on simple graphs; the V² matrix is output and loop working storage O(1). A negative diagonal identifies a negative cycle, invalidating any pair whose route can pass through it.",

  expectedOutput: "[0, 3, 1, 4]\n",

  references: [
  {
    "url": "https://cp-algorithms.com/graph/all-pair-shortest-path-floyd-warshall.html",
    "title": "CP Algorithms: Floyd–Warshall",
    "section": "Phase invariant; implementation; negative cycles",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "k is the outer phase loop.",
      "Negative cycles invalidate affected pairs."
    ],
    "conventions": [
      "App numbers vertices from zero and uses Python infinity."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/2430d7903a5529451d80c17f89a41fe8_MIT6_006S20_lec12.pdf",
    "title": "MIT 6.006 Lecture 12: Bellman–Ford",
    "section": "Pages 1–3: simple shortest paths and negative-cycle witnesses",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "A finite optimum has a simple representative with at most V−1 edges."
    ],
    "conventions": [],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://raw.githubusercontent.com/kevin-wayne/algs4/master/src/main/java/edu/princeton/cs/algs4/FloydWarshall.java",
    "title": "Princeton algs4: Floyd–Warshall",
    "section": "Class documentation lines 18–38; initialization/phase/negative diagonal lines 57–95",
    "topic": "trees-graphs-range",
    "purpose": "Cross-check the exact implementation variant and boundary contract.",
    "verifiedClaims": [
      "Floyd–Warshall permits negative edges when shortest distances are well defined.",
      "The outer loop controls allowed intermediate vertices.",
      "A negative diagonal detects a negative cycle.",
      "Distance matrix storage is quadratic."
    ],
    "conventions": [
      "Source additionally stores a predecessor matrix and rejects negative-cycle distance queries.",
      "App returns the distance matrix; its returned matrix is output storage, and affected pairs must not be interpreted as finite shortest distances."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "3e88a4a42cf0178c",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
