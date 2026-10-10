/**
 * Pattern: Dijkstra (weighted shortest path).
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "[0, 3, 1, 4]\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `import heapq

# Dijkstra: shortest paths from a source in a NON-NEGATIVE weighted graph.
def dijkstra(adj, start, n):
    if not 0 <= start < n:
        raise ValueError("invalid source")
    if any(w < 0 for neighbors in adj.values() for _, w in neighbors):
        raise ValueError("Dijkstra requires nonnegative weights")
    dist = [float("inf")] * n
    dist[start] = 0
    pq = [(0, start)]                    # min-heap of (distance, node)
    while pq:
        d, node = heapq.heappop(pq)      # minimum candidate, possibly stale
        if d > dist[node]:
            continue                     # stale heap entry -> skip
        for nb, w in adj[node]:
            nd = d + w
            if nd < dist[nb]:            # relax: found a shorter route to nb
                dist[nb] = nd
                heapq.heappush(pq, (nd, nb))
    return dist

adj = {0: [(1, 4), (2, 1)], 1: [(3, 1)], 2: [(1, 2), (3, 5)], 3: []}
print(dijkstra(adj, 0, 4))  # 0->2->1->3 beats the direct 0->1`;

export const dijkstraPattern: PatternDefinition = {
  id: "dijkstra",
  title: "Dijkstra (Weighted Shortest Path)",
  category: "Graphs & trees",
  summary:
    "Find shortest paths in a non-negative weighted graph by always settling the closest unsettled node via a min-heap.",

  clues: [
    "A WEIGHTED graph with NON-NEGATIVE edge costs, and you need the cheapest path / minimum total cost.",
    "'Shortest' means lowest total weight, not fewest edges.",
    "Phrases like 'minimum cost to reach', 'cheapest route', 'network delay time', 'shortest path with weights'.",
  ],

  naiveApproach: `BFS finds fewest EDGES, which is wrong when edges have different weights (a longer hop count can be cheaper). Trying all paths is exponential. Repeatedly scanning every node for the current minimum distance (array-based Dijkstra) is **O(V²)** — fine for dense graphs but slow for sparse ones.`,

  whyItHelps: `Dijkstra keeps tentative distances and always **settles the closest unsettled node next** using a **min-heap** keyed by distance. When a node is popped with its recorded distance, that distance is **final** (correct precisely because weights are non-negative — nothing cheaper can arrive later). For each neighbor it **relaxes** the edge: if going through the current node is cheaper, update and push the new distance. Stale heap entries (a worse distance for an already-improved node) are skipped. With a binary heap this is **O((V + E) log V)** — the standard weighted shortest-path algorithm.`,

  conditions: [
  "All edge weights must be NON-NEGATIVE (a negative edge can invalidate an already-settled node).",
  "Skip stale heap entries (d > dist[node]) so each node is settled once.",
  "Relax edges: only update when a strictly shorter distance is found.",
  "Finite nonnegative weights, valid source and closed adjacency mapping. The supplied function checks source/negative weights."
],

  alternatives: [
    "BFS — for UNWEIGHTED graphs (all weights equal); simpler and O(V+E).",
    "0-1 BFS (deque) — when weights are only 0 or 1.",
    "Bellman–Ford — when NEGATIVE edges exist (O(V·E), also detects negative cycles).",
    "A* — Dijkstra plus a heuristic when you have a single target and a good distance estimate.",
  ],

  counterexamples: [
    "Using Dijkstra with negative edges can produce wrong distances — use Bellman–Ford.",
    "Using BFS on a weighted graph gives fewest edges, not cheapest cost.",
    "Forgetting the stale-entry skip doesn't break correctness here but wastes work re-processing nodes.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "[0, 3, 1, 4]\n",
  complexityNote:
    "Lazy heap: O(V+E log(E+1)) time and O(V+E) working storage; a simple graph gives the usual O((V+E)log(V+1)) upper bound. Reject negative edges.",

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
  "costModel": "Distance initialization and nonnegative validation are linear in V and E. Each lazy candidate heap operation is O(log(E+1)); arithmetic is unit cost.",
  "time": {
    "bound": "O(V+E log(E+1))",
    "case": "worst",
    "explanation": "Initialize V distances and validate E weights. Each successful relaxation pushes a candidate; there can be O(E) candidates and obsolete pops. Heap size is O(E), giving O(V+E log(E+1)). For simple graphs log(E+1)=O(log(V+1)), yielding the usual O((V+E)log(V+1)) upper bound.",
    "otherCases": [
      {
        "case": "best",
        "bound": "O(V+E)",
        "note": "Distance initialization and weight validation still run when the source reaches no edges."
      }
    ]
  },
  "space": {
    "bound": "O(V+E)",
    "case": "worst",
    "explanation": "The lazy heap can contain O(E) duplicate vertex entries. Working references plus heap storage fit O(V+E); the returned V distances are output storage.",
    "inputOutputNote": "The adjacency structure (O(V + E)) is the input; dist (O(V)) is the result."
  },
  "derivation": [
    {
      "lines": [
        13
      ],
      "description": "At most O(E+1) lazy candidate pushes/pops, each logarithmic in heap size O(E+1).",
      "cost": "O(E log(E+1))",
      "dimension": "time"
    },
    {
      "lines": [
        16,
        17,
        18,
        20
      ],
      "description": "At most O(E+1) lazy candidate pushes/pops, each logarithmic in heap size O(E+1).",
      "cost": "O(E log(E+1))",
      "dimension": "time"
    },
    {
      "lines": [
        9,
        11
      ],
      "description": "The lazy heap may retain O(E) candidates, not only one per vertex.",
      "cost": "O(V+E)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Finite nonnegative weights; valid integer vertices 0..n−1 and a closed adjacency mapping.",
    "The source and nonnegative weights are checked. Unit-cost numeric arithmetic and expected constant-cost adjacency lookup.",
    "A lazy heap has duplicate entries. Only non-stale vertices expand once; obsolete entries are still popped."
  ],
  "tradeoffs": "An indexed decrease-key heap and array-scan Dijkstra are separate variants. The lazy heap can retain O(E) entries; dense all-source array Dijkstra can be cubic. Bellman–Ford permits negative edges in O(V+V*E).",
  "counters": [
    {
      "label": "heap candidates removed",
      "definition": "executions of d, node = heapq.heappop(pq) at line 13",
      "countLines": [
        13
      ]
    },
    {
      "label": "improved candidates inserted",
      "definition": "executions of heapq.heappush(pq, (nd, nb)) at line 20",
      "countLines": [
        20
      ]
    }
  ],
  "fixedDataNote": "The four-vertex example pops current and stale heap candidates; skip stale entries before scanning neighbors. Its general time is O(V+E log(E+1)), simplifying to a usual log V bound for simple graphs.",
  "references": [
    {
      "url": "https://cp-algorithms.com/graph/dijkstra_sparse.html",
      "title": "CP Algorithms: sparse Dijkstra",
      "section": "priority_queue implementation and stale-entry discussion",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "Lazy heaps retain duplicate vertex entries.",
        "Discard obsolete distances before scanning edges."
      ],
      "conventions": [
        "App uses heapq rather than decrease-key."
      ],
      "accessDate": "2026-10-10"
    },
    {
      "url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/d819e7f4568aced8d5b59e03db6c7b67_MIT6_006S20_lec13.pdf",
      "title": "MIT 6.006 Lecture 13: Dijkstra",
      "section": "Pages 1–3: nonnegative weights, priority queue, correctness",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "Nonnegative edges support distance finalization."
      ],
      "conventions": [
        "MIT uses decrease-key; app uses lazy duplicate entries and a stale guard."
      ],
      "accessDate": "2026-10-10"
    }
  ]
},

  codeExplanations: [
  {
    "line": 1,
    "executable": true,
    "explanation": "Import heapq for the priority queue."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 3,
    "executable": false,
    "explanation": "Comment: shortest paths, non-negative weights."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Define dijkstra(adj, start, n)."
  },
  {
    "line": 5,
    "explanation": "Require a source index in the n-vertex graph.",
    "executable": true
  },
  {
    "line": 6,
    "explanation": "Reject an empty graph or invalid source for a single-source query.",
    "executable": true
  },
  {
    "line": 7,
    "explanation": "Scan edge weights to enforce Dijkstra’s nonnegative precondition.",
    "executable": true
  },
  {
    "line": 8,
    "explanation": "Reject negative edges before the heap loop.",
    "executable": true
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "All distances start at infinity."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "The source's distance is 0."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Min-heap seeded with (0, start)."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Process until the heap empties."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Remove the minimum candidate; the following test determines whether it is obsolete."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "If this entry is stale (worse than known)..."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "...skip it."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "For each weighted neighbour..."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "...compute the distance through the current node."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "Relaxation: if it's shorter than the best known..."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "...update the neighbour's distance..."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "...and push the improved (distance, node)."
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "Return all shortest distances from the source."
  },
  {
    "line": 22,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "A weighted adjacency list of (neighbour, weight)."
  },
  {
    "line": 24,
    "executable": true,
    "explanation": "Distances from 0 are [0, 3, 1, 4] (0->2->1->3 beats direct 0->1)."
  }
],

  bindings: [
    { variable: "dist", model: "array" },
    { variable: "pq", model: "heap" },
  ],

  linkedLessons: ["dijkstra", "shortest-paths-unweighted", "bellman-ford", "min-max-heaps"],

  exercises: [
  {
    "id": "pat-dij-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'Find the minimum total travel time from a source to every city, given roads with positive times.' Which pattern? Choose the efficient standard default for unequal nonnegative edge weights.",
    "expected": "Dijkstra: min-heap by distance, settle the closest city, relax its roads. Non-negative weights guarantee correctness. O((V+E) log V).",
    "correctPatternId": "dijkstra",
    "hints": [
      "Goal: find the minimum total travel time from a source to every city over roads with positive times.",
      "BFS counts hops, not weighted cost, so it can't answer cheapest-total on weighted edges.",
      "Key insight: with non-negative weights, once you settle the closest unsettled node its distance is final.",
      "Approach: use Dijkstra with a min-heap keyed by distance.",
      "Pseudocode: push (0, source); pop the closest node; relax each outgoing road, pushing improved distances.",
      "Use Dijkstra: settle the closest city first via a min-heap and relax its roads — O((V+E) log V)."
    ],
    "recognition": {
      "scenario": "Recognize: 'Find the minimum total travel time from a source to every city, given roads with positive times.' Which pattern? Choose the efficient standard default for unequal nonnegative edge weights.",
      "approaches": [
        {
          "id": "dijkstra",
          "label": "Dijkstra's algorithm",
          "requiredReasonIds": [
            "settle-closest"
          ]
        },
        {
          "id": "bfs",
          "label": "Plain BFS",
          "requiredReasonIds": [],
          "rejectionFeedback": "BFS counts edges, not weighted cost; with unequal positive weights fewest-edges is not cheapest."
        },
        {
          "id": "bellman",
          "label": "Bellman–Ford",
          "requiredReasonIds": [],
          "rejectionFeedback": "Bellman–Ford is also correct for nonnegative weights, but its O(V+V*E) bound is slower than the heap default requested here."
        }
      ],
      "reasons": [
        {
          "id": "settle-closest",
          "text": "Weights are non-negative, so repeatedly settling the closest unvisited city and relaxing its roads via a min-heap is correct — O((V+E) log V)."
        },
        {
          "id": "unweighted",
          "text": "All roads take the same time, so counting edges equals counting cost.",
          "contradictory": true
        },
        {
          "id": "has-negative",
          "text": "Some roads have negative time, so the closest-is-final rule breaks.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "dijkstra"
      ],
      "modelExplanation": "Dijkstra's algorithm: a min-heap by distance settles the closest city and relaxes its edges; non-negative weights guarantee correctness — O((V+E) log V)."
    }
  },
  {
    "id": "pat-dij-choose-1",
    "kind": "choose-approach",
    "prompt": "Some edges have NEGATIVE weights (e.g. currency arbitrage). Dijkstra or Bellman–Ford?",
    "expected": "Bellman–Ford: it handles negative edges and detects negative cycles (O(V·E)). Dijkstra's 'closest is final' guarantee breaks with negative weights.",
    "hints": [
      "Goal: find shortest paths when some edges have NEGATIVE weights (e.g. currency arbitrage).",
      "Dijkstra's 'closest is final' assumption breaks the moment an edge weight is negative.",
      "Key insight: negative edges can improve a path later, and you may also need to detect negative cycles.",
      "Approach: use Bellman–Ford, which relaxes all edges repeatedly.",
      "Pseudocode: relax every edge V−1 times; one more pass that still improves signals a negative cycle.",
      "Use Bellman–Ford: it handles negative edges and detects negative cycles (O(V·E)); Dijkstra can't."
    ],
    "recognition": {
      "scenario": "Some edges have NEGATIVE weights (e.g. currency arbitrage). Dijkstra or Bellman–Ford?",
      "approaches": [
        {
          "id": "bellman",
          "label": "Bellman–Ford",
          "requiredReasonIds": [
            "handles-negative"
          ]
        },
        {
          "id": "dijkstra",
          "label": "Dijkstra's algorithm",
          "requiredReasonIds": [],
          "rejectionFeedback": "Dijkstra's 'closest is final' guarantee breaks with negative edges, so it can return wrong distances."
        }
      ],
      "reasons": [
        {
          "id": "handles-negative",
          "text": "Bellman–Ford relaxes all edges V−1 times, correctly handling negative weights and detecting negative cycles — O(V·E)."
        },
        {
          "id": "all-nonneg",
          "text": "All weights are non-negative, so the closest-is-final rule holds.",
          "contradictory": true
        },
        {
          "id": "unweighted-bfs",
          "text": "The graph is unweighted, so BFS suffices.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "bellman"
      ],
      "modelExplanation": "Bellman–Ford: it correctly handles negative edges and detects negative cycles (O(V·E)); Dijkstra's closest-is-final guarantee fails with negative weights."
    }
  },
  {
    "id": "pat-dij-fix-1",
    "kind": "fix-mistake",
    "prompt": "The lazy-heap loop omits its stale-entry guard. Add the guard to avoid repeatedly scanning outgoing edges from obsolete candidates; the omission wastes work even when nonnegative distances remain correct.",
    "starterCode": "while pq:\n    d, node = heapq.heappop(pq)\n    for nb, w in adj[node]:\n        nd = d + w\n        if nd < dist[nb]:\n            dist[nb] = nd\n            heapq.heappush(pq, (nd, nb))",
    "expected": "while pq:\n    d, node = heapq.heappop(pq)\n    if d > dist[node]:\n        continue\n    for nb, w in adj[node]:\n        nd = d + w\n        if nd < dist[nb]:\n            dist[nb] = nd\n            heapq.heappush(pq, (nd, nb))",
    "hints": [
      "A shorter route can push a second candidate for a vertex.",
      "The old larger candidate remains in heapq because there is no decrease-key removal.",
      "Compare the popped distance with the recorded best distance.",
      "Skip a candidate whose popped distance is larger before scanning its outgoing edges.",
      "if d > dist[node]: continue; otherwise relax outgoing edges.",
      "The guard prevents repeated obsolete expansions. With nonnegative edges the unguarded relaxation loop can still compute correct distances, but loses the intended work bound."
    ],
    "tests": "# Shortest paths from 0 on a small weighted graph.\nassert dist == [0, 1, 2, 3], f'shortest distances from 0, got {dist}'\n# With the stale-skip each node expands its neighbours at most once; the buggy\n# version reprocesses stale pops and over-expands.\nassert _expand['n'] == 4, f'stale entries skipped (buggy over-expands), got {_expand[\"n\"]}'\nprint('OK')",
    "preludeCode": "import heapq\n_expand = {'n': 0}\nclass _CountAdj(dict):\n    def __getitem__(self, k):\n        _expand['n'] += 1\n        return super().__getitem__(k)\nadj = _CountAdj({0: [(1, 1), (2, 4)], 1: [(2, 1), (3, 5)], 2: [(3, 1)], 3: []})\nn = 4\ndist = [float('inf')] * n\ndist[0] = 0\npq = [(0, 0)]"
  }
],

  references: [
  {
    "url": "https://cp-algorithms.com/graph/dijkstra_sparse.html",
    "title": "CP Algorithms: sparse Dijkstra",
    "section": "priority_queue implementation and stale-entry discussion",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "Lazy heaps retain duplicate vertex entries.",
      "Discard obsolete distances before scanning edges."
    ],
    "conventions": [
      "App uses heapq rather than decrease-key."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/d819e7f4568aced8d5b59e03db6c7b67_MIT6_006S20_lec13.pdf",
    "title": "MIT 6.006 Lecture 13: Dijkstra",
    "section": "Pages 1–3: nonnegative weights, priority queue, correctness",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "Nonnegative edges support distance finalization."
    ],
    "conventions": [
      "MIT uses decrease-key; app uses lazy duplicate entries and a stale guard."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "216dd9045bd7bbb6",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
