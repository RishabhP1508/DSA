/**
 * Lesson: Dijkstra's algorithm (Graphs). Verified on CPython 3.14.
 * Output: "[0, 3, 1, 4]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `import heapq

# Dijkstra: shortest paths from a source in a WEIGHTED graph (non-negative).
def dijkstra(adj, start, n):
    if not 0 <= start < n:
        raise ValueError("invalid source")
    if any(w < 0 for neighbors in adj.values() for _, w in neighbors):
        raise ValueError("Dijkstra requires nonnegative weights")
    dist = [float("inf")] * n
    dist[start] = 0
    pq = [(0, start)]              # min-heap of (distance, node)
    while pq:
        d, node = heapq.heappop(pq)  # minimum candidate, possibly stale
        if d > dist[node]:
            continue                 # stale entry -> skip
        for nb, w in adj[node]:
            nd = d + w
            if nd < dist[nb]:        # found a shorter path to nb
                dist[nb] = nd
                heapq.heappush(pq, (nd, nb))
    return dist

adj = {0: [(1, 4), (2, 1)], 1: [(3, 1)], 2: [(1, 2), (3, 5)], 3: []}
print(dijkstra(adj, 0, 4))   # cheapest 0->2->1->3 beats 0->1 directly`;

export const dijkstra: LessonDefinition = {
  id: "dijkstra",
  title: "Dijkstra's Algorithm",
  area: "Graphs",
  prerequisites: ["shortest-paths-unweighted", "min-max-heaps"],

  explanation: "**Dijkstra** finds distances from a source along directed or undirected edges with finite nonnegative weights. A minimum heap chooses the smallest tentative distance. For each outgoing edge, relax its neighbor if going through this vertex is cheaper.\n\nThe heap stores candidates, so one vertex can appear repeatedly. After removing a candidate, skip it if its distance is larger than the recorded best distance. Only a non-stale removal finalizes a vertex; nonnegative weights guarantee no later path can improve it. Negative edges break this proof and the supplied function rejects them. Bellman–Ford supports negative edges and can detect source-reachable negative cycles.\n\nThe example gives [0, 3, 1, 4]. Lazy heap storage can be O(E), and there can be O(E) pushes and pops, including obsolete entries. With V distance initialization and E weight validation, the bound is O(V+E log(E+1)). On simple graphs this has the familiar O((V+E)log(V+1)) upper bound. Distances are output storage; the heap is auxiliary. Missing reachable adjacency entries or invalid endpoints violate the graph precondition.",

  vocabulary: [
    { term: "Dijkstra's algorithm", definition: "Single-source shortest paths for non-negative weighted graphs via a min-heap." },
    { term: "Relaxation", definition: "Updating dist[v] if reaching v through u is cheaper." },
    { term: "Priority queue (min-heap)", definition: "Yields the closest unsettled vertex next in O(log V)." },
    { term: "Settled vertex", definition: "A vertex whose shortest distance is finalized when popped." },
    { term: "Stale entry", definition: "An outdated (distance, node) in the heap, skipped by the d > dist[node] check." },
    { term: "Non-negative requirement", definition: "Negative edges break Dijkstra's 'closest-is-final' guarantee." },
  ],

  concepts: {
  "purpose": "Compute single-source shortest paths on non-negative weighted graphs.",
  "operations": "Pop the closest vertex; relax its edges; push improved distances; skip stale heap entries.",
  "uses": "Road/network routing, weighted shortest paths, cheapest-cost problems, network latency.",
  "tradeoffs": "O((V+E) log V) with a heap; requires non-negative weights (else Bellman–Ford).",
  "commonMistakes": "Using it with negative edges (wrong result); not skipping stale heap entries; forgetting to relax (just pushing without comparing); using BFS on a weighted graph.",
  "edgeCases": "Zero weights and disconnected vertices are supported (unreachable distances stay infinity). A valid source and closed adjacency are required; negative edges raise ValueError. Parallel edges can create many lazy candidates."
},

  complexity: [
  {
    "operation": "Dijkstra (binary heap)",
    "best": "O(V+E)",
    "worst": "O(V+E log(E+1))",
    "space": "O(V + E)",
    "note": "Lazy heap can retain O(E) duplicate candidates; simple graphs allow the familiar log V upper bound."
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
    "inputOutputNote": "The graph (V + E) and distance array are the structures; the heap's O(E) entries are the working space."
  },
  "derivation": [
    {
      "lines": [
        13,
        14,
        15
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
        19,
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
  "tradeoffs": "BFS gives minimum hops in O(V+E). Bellman–Ford takes O(V+V*E) and permits negative weights. Indexed decrease-key heaps are separate Dijkstra variants; this implementation retains lazy duplicate candidates.",
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
  "fixedDataNote": "From source 0 the example returns [0,3,1,4]; the route 0→2→1 improves on the direct edge to 1. General lazy-heap time is O(V+E log(E+1)), with the usual log V simplification for simple graphs.",
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

  code,

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
    "explanation": "If this entry is stale (larger than the known distance)..."
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
    "explanation": "...compute the distance through the current vertex."
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
    "explanation": "...and push the improved (distance, neighbour)."
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
    "explanation": "A weighted graph as an adjacency list of (neighbour, weight)."
  },
  {
    "line": 24,
    "executable": true,
    "explanation": "Distances from 0 → [0, 3, 1, 4]."
  }
],

  bindings: [
    { variable: "dist", model: "array" },
    { variable: "pq", model: "heap" },
  ],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "Why does Dijkstra require non-negative edge weights, and what do you use if some edges are negative?",
    "answer": "Dijkstra finalizes a vertex's distance when it's popped (closest first); a negative edge encountered later could make an already-settled vertex reachable more cheaply, breaking that guarantee. For negative edges use Bellman–Ford.",
    "explanation": "The standard greedy guarantee requires nonnegative weights. This function rejects negative edges; Bellman–Ford handles them in O(V+V*E), detecting source-reachable negative cycles."
  }
],

  experiments: [
  "Add a parent map to reconstruct the actual shortest path, not just distances.",
  "Try a negative edge and observe the explicit rejection. Compare with Bellman–Ford; Dijkstra’s finalization proof requires nonnegative weights.",
  "Count heap pushes/pops and relate them to V and E."
],

  exercises: [
  {
    "id": "dij-choose-1",
    "kind": "choose-approach",
    "prompt": "Pick the shortest-path algorithm: (a) unweighted social graph, (b) road network with positive distances, (c) currency graph with possible negative-weight arbitrage edges.",
    "expected": "(a) BFS — O(V+E). (b) Dijkstra — non-negative weights, O((V+E) log V). (c) Bellman–Ford — handles negative edges (and detects negative cycles), O(V·E).",
    "hints": [
      "Goal: pick the shortest-path algorithm for unweighted, non-negative-weighted, and negative-edge graphs.",
      "Using the wrong algorithm either wastes time or gives wrong answers on negative edges.",
      "Key insight: edge-weight nature dictates the algorithm — none, non-negative, or possibly negative.",
      "Approach: match each graph to BFS, Dijkstra, or Bellman–Ford.",
      "Pseudocode: unweighted → BFS; non-negative weights → Dijkstra; negative edges → Bellman–Ford.",
      "Answer: (a) BFS O(V+E); (b) Dijkstra O((V+E) log V); (c) Bellman–Ford O(V·E), which also detects negative cycles."
    ],
    "recognition": {
      "scenario": "Pick the shortest-path algorithm: (a) unweighted social graph, (b) road network with positive distances, (c) currency graph with possible negative-weight edges. This drill is about (b).",
      "approaches": [
        {
          "id": "dijkstra",
          "label": "Dijkstra's algorithm",
          "requiredReasonIds": [
            "nonneg-weighted"
          ]
        },
        {
          "id": "bfs",
          "label": "Plain BFS",
          "requiredReasonIds": [],
          "rejectionFeedback": "That is the tool for (a): an unweighted graph. With differing positive weights, fewest edges is not lowest cost."
        },
        {
          "id": "bellman",
          "label": "Bellman–Ford",
          "requiredReasonIds": [],
          "rejectionFeedback": "That is the tool for (c): negative weights. With all-positive weights it is unnecessarily slow."
        }
      ],
      "reasons": [
        {
          "id": "nonneg-weighted",
          "text": "The road network (b) has non-negative weights, so a min-heap that settles the closest node and relaxes its edges is correct — O((V+E) log V)."
        },
        {
          "id": "unweighted-bfs",
          "text": "All edges cost the same, so counting edges equals cost.",
          "contradictory": true
        },
        {
          "id": "negative-edges",
          "text": "Some edges are negative, so the closest-is-final rule fails.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "dijkstra"
      ],
      "modelExplanation": "(b) uses Dijkstra — non-negative weights, O((V+E) log V). (a) is BFS on an unweighted graph; (c) needs Bellman–Ford for negative edges."
    }
  },
  {
    "id": "dij-fix-1",
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
    "tests": "assert dist == [0, 1, 2, 3], f'shortest distances from 0, got {dist}'\n# With the stale-skip each of the 4 nodes expands its neighbor list exactly once.\n# The buggy version also expands stale duplicate pops -> more than 4 expansions.\nassert _expand['n'] == 4, f'stale entries must be skipped (buggy over-expands), got {_expand[\"n\"]}'\nprint('OK')",
    "preludeCode": "import heapq\n_expand = {'n': 0}\nclass _CountAdj(dict):\n    def __getitem__(self, k):\n        _expand['n'] += 1\n        return super().__getitem__(k)\nadj = _CountAdj({0: [(1, 1), (2, 4)], 1: [(2, 1), (3, 5)], 2: [(3, 1)], 3: []})\nn = 4\ndist = [float('inf')] * n\ndist[0] = 0\npq = [(0, 0)]"
  }
],

  review: "Dijkstra requires finite nonnegative edges and chooses minimum tentative distance. Skip stale candidates before expanding a vertex. The lazy heap may retain O(E) entries, so include obsolete pops in O(V+E log(E+1)); simple graphs permit the usual log V upper bound.",

  expectedOutput: "[0, 3, 1, 4]\n",

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
    contentHash: "ed13ace6af5f5374",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
