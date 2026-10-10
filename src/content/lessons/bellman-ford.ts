/**
 * Lesson: Bellman-Ford (Graphs). Verified on CPython 3.14. Output: "[0, 3, 1, 4]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Bellman-Ford: shortest paths that TOLERATE negative edge weights.
def bellman_ford(edges, n, start):
    dist = [float("inf")] * n
    dist[start] = 0
    # V-1 passes suffice for a simple optimum if no reachable negative cycle.
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] != float("inf") and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    for u, v, w in edges:
        if dist[u] != float("inf") and dist[u] + w < dist[v]:
            return None
    return dist

edges = [(0, 1, 4), (0, 2, 1), (2, 1, 2), (1, 3, 1), (2, 3, 5)]
print(bellman_ford(edges, 4, 0))`;

export const bellmanFord: LessonDefinition = {
  id: "bellman-ford",
  title: "Bellman-Ford Algorithm",
  area: "Graphs",
  prerequisites: ["dijkstra"],

  explanation: "**Bellman–Ford** allows negative edge weights by repeatedly relaxing every directed edge. If no negative cycle is reachable from the source, a finite shortest distance has a simple path representative with at most V−1 edges. V−1 full passes therefore suffice; an in-place pass may propagate improvements across several edges, but never requires more passes than this bound.\n\nThe function then checks for another source-reachable improvement. If one exists, it returns None to report a reachable negative cycle; it does not return a finite distance list in that case. A disconnected negative cycle is ignored because it cannot affect this source. Without a reachable negative cycle, unreachable vertices remain infinity. Zero cycles may produce longer walks with the same minimum cost, so not every optimal walk is simple.\n\nInitialization costs O(V), the fixed passes O(V*E), and the cycle check O(E), for O(V+V*E) on a valid nonempty source graph. The result list uses O(V) output storage and the loops use O(1) auxiliary space. This version has no early-stop optimization. DAG relaxation can be faster on a directed acyclic graph; Dijkstra is an efficient option when all weights are nonnegative.",

  vocabulary: [
  {
    "term": "Bellman-Ford",
    "definition": "Single-source shortest paths allowing negative edges, via V-1 rounds of relaxation."
  },
  {
    "term": "Relaxation",
    "definition": "dist[v] = min(dist[v], dist[u] + w) for edge u→v."
  },
  {
    "term": "V-1 passes",
    "definition": "Without a source-reachable negative cycle, some shortest path is simple and uses at most V−1 edges."
  },
  {
    "term": "Negative cycle",
    "definition": "A cycle whose total weight is negative; makes shortest paths undefined."
  },
  {
    "term": "Cycle detection pass",
    "definition": "A V-th pass that can still relax an edge signals a negative cycle."
  }
],

  concepts: {
  "purpose": "Find shortest paths with negative edges and detect negative cycles, where Dijkstra can't.",
  "operations": "Relax all edges V-1 times; an extra relaxable pass reveals a negative cycle.",
  "uses": "Currency arbitrage, graphs with penalties/negative costs, negative-cycle detection, routing protocols (distance-vector).",
  "tradeoffs": "Handles negatives and detects negative cycles, but O(V·E) — slower than Dijkstra's O((V+E) log V).",
  "commonMistakes": "Relaxing from an unreached vertex (guard dist[u] != inf); doing fewer than V-1 passes; forgetting negative-cycle detection; using it when Dijkstra (faster) suffices.",
  "edgeCases": "Valid source and endpoints are required. Unreachable vertices stay infinity. A reachable negative cycle returns None; a disconnected negative cycle does not affect the source distances."
},

  complexity: [
  {
    "operation": "Bellman-Ford",
    "best": "O(V+V*E)",
    "worst": "O(V+V*E)",
    "space": "O(1) auxiliary + O(V) output",
    "note": "V-1 passes over all E edges; handles negative weights."
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
      "meaning": "the number of edges"
    }
  ],
  "costModel": "Each relaxation is O(1). The algorithm does V-1 passes, each relaxing all E edges.",
  "time": {
    "bound": "O(V+V*E)",
    "case": "worst",
    "explanation": "Allocate V distances, perform V−1 full E-edge passes, then one E-edge detection scan. Even E=0 still costs O(V).",
    "otherCases": []
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Loop variables use constant working storage; the distance list is required output storage.",
    "inputOutputNote": "The edge list is input and the V distance values are output. Returning None denotes a source-reachable negative cycle."
  },
  "derivation": [
    {
      "lines": [
        6
      ],
      "description": "V-1 relaxation passes.",
      "cost": "O(V)",
      "dimension": "time"
    },
    {
      "lines": [
        7,
        8,
        9
      ],
      "description": "Each pass relaxes all E edges — O(E) per pass, O(V·E) total.",
      "cost": "O(V*E)",
      "dimension": "time"
    },
    {
      "lines": [
        3
      ],
      "description": "Working indices/weights occupy constant space; dist is output.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "n>=1, valid source and directed edge endpoints in 0..n−1.",
    "Finite weights and constant-cost arithmetic.",
    "Only source-reachable negative cycles are rejected. Fixed passes are not an early-stop variant."
  ],
  "tradeoffs": "Bellman–Ford accepts negative edges and returns None for a source-reachable negative cycle. Its fixed-pass implementation takes O(V+V*E), while heap Dijkstra is faster for nonnegative weights.",
  "counters": [
    {
      "label": "relaxation checks",
      "definition": "executions of if dist[u] != float(\"inf\") and dist[u] + w < dist[v]: at line 8",
      "countLines": [
        8
      ]
    }
  ],
  "fixedDataNote": "The example returns [0,3,1,4]. V initialization, V−1 complete edge scans and one detection scan give O(V+V*E), including the edgeless case.",
  "references": [
    {
      "url": "https://cp-algorithms.com/graph/bellman_ford.html",
      "title": "CP Algorithms: Bellman–Ford",
      "section": "Negative-cycle detection",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "An extra relaxation detects a source-reachable negative cycle."
      ],
      "conventions": [],
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
    }
  ]
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: tolerates negative edge weights."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define bellman_ford(edges, n, start)."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "All distances start at infinity."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "The source's distance is 0."
  },
  {
    "line": 5,
    "executable": false,
    "explanation": "A finite shortest path has a simple representative using at most V−1 edges."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Repeat V-1 times."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "For every directed edge (u, v, w)..."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "...if u is reachable and going through it is cheaper..."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "...relax: update dist[v]."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Check once more whether a source-reachable edge can improve."
  },
  {
    "line": 11,
    "explanation": "Only a source-reachable improvement after V−1 passes indicates a relevant negative cycle.",
    "executable": true
  },
  {
    "line": 12,
    "explanation": "Return the explicit reachable-negative-cycle sentinel; finite distances are not valid.",
    "executable": true
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Return the shortest distances."
  },
  {
    "line": 14,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "An edge list (directed, weighted)."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "Distances from 0 → [0, 3, 1, 4]."
  }
],

  bindings: [
    { variable: "dist", model: "array" },
  ],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "Why exactly V-1 relaxation passes, and how does a V-th pass detect a negative cycle?",
    "answer": "Without a source-reachable negative cycle, each reachable vertex has a shortest representative that is simple and uses at most V−1 edges. V−1 full passes therefore suffice; an additional reachable improvement exposes a negative cycle.",
    "explanation": "Longer walks can exist, including repeated zero-weight cycles. The bound is on a simple shortest representative, not on every path or walk. The final check ignores unreachable tails."
  }
],

  experiments: [
    "Add a negative edge and confirm Bellman–Ford still gives correct shortest paths.",
    "Create a negative cycle and add the V-th detection pass to flag it.",
    "Add early termination when a pass makes no changes.",
  ],

  exercises: [
    {
      id: "bf-choose-1",
      kind: "choose-approach",
      prompt: "A graph has some negative edge weights (but no negative cycle). Dijkstra or Bellman–Ford? What's the complexity trade-off?",
      expected: "Bellman–Ford — Dijkstra is incorrect with negative edges. Bellman–Ford is O(V·E) (slower than Dijkstra's O((V+E) log V)) but correct, and it can also detect negative cycles.",
      hints: ["Does Dijkstra tolerate negative edges?", "No — it can be wrong.", "Bellman–Ford handles negatives at O(V·E)."],
    },
    {
      id: "bf-complete-1",
      kind: "complete-code",
      prompt: "Add negative-cycle detection: return None if a V-th pass can still relax an edge.",
      starterCode: "def bellman_ford(edges, n, start):\n    dist = [float('inf')] * n\n    dist[start] = 0\n    for _ in range(n - 1):\n        for u, v, w in edges:\n            if dist[u] != float('inf') and dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n    # TODO: one more pass; if any edge still relaxes, return None\n    return dist",
      expected: "def bellman_ford(edges, n, start):\n    dist = [float('inf')] * n\n    dist[start] = 0\n    for _ in range(n - 1):\n        for u, v, w in edges:\n            if dist[u] != float('inf') and dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n    for u, v, w in edges:\n        if dist[u] != float('inf') and dist[u] + w < dist[v]:\n            return None\n    return dist",
      hints: ["Do one extra relaxation pass.", "If any edge can still improve, a negative cycle exists.", "return None on a successful relaxation in the extra pass."],
    },
  ],

  review: "Bellman–Ford performs V−1 relaxation passes, then rejects a source-reachable negative cycle by returning None if an additional improvement exists. Disconnected negative cycles are irrelevant to this source. Fixed passes plus initialization cost O(V+V*E); output distances are separate from O(1) working indices.",

  expectedOutput: "[0, 3, 1, 4]\n",

  references: [
  {
    "url": "https://cp-algorithms.com/graph/bellman_ford.html",
    "title": "CP Algorithms: Bellman–Ford",
    "section": "Negative-cycle detection",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "An extra relaxation detects a source-reachable negative cycle."
    ],
    "conventions": [],
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
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "107ddf63e222902a",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
