/**
 * Lesson: Dijkstra's algorithm (Graphs). Verified on CPython 3.14.
 * Output: "[0, 3, 1, 4]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `import heapq

# Dijkstra: shortest paths from a source in a WEIGHTED graph (non-negative).
def dijkstra(adj, start, n):
    dist = [float("inf")] * n
    dist[start] = 0
    pq = [(0, start)]              # min-heap of (distance, node)
    while pq:
        d, node = heapq.heappop(pq)  # always expand the closest unsettled node
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

  explanation: `**Dijkstra's algorithm** finds shortest paths from a source in a graph with **non-negative weighted** edges — the weighted generalization of BFS. BFS fails on weighted graphs because "fewest edges" ≠ "lowest cost"; Dijkstra fixes this by always expanding the **closest unsettled vertex next**, which it finds efficiently using a **min-heap (priority queue)** keyed by distance.

The loop: pop the vertex with the smallest tentative distance, and for each neighbour try to **relax** the edge — if going through the current vertex gives a shorter distance, update it and push the new (distance, neighbour) onto the heap. Because we always settle the globally closest vertex first, its distance is final when popped (this is why non-negative weights are required — a negative edge could later undercut a "settled" vertex, breaking the guarantee; use Bellman–Ford then). The \`if d > dist[node]\` check skips **stale** heap entries left over from earlier, larger tentative distances.

In the example, the direct edge 0→1 costs 4, but 0→2→1 costs 1+2=3, so \`dist[1] = 3\`; the full result is \`[0, 3, 1, 4]\`. Complexity with a binary heap is **O((V + E) log V)** — each edge may push once (E log V) and each vertex is popped once (V log V). Space is **O(V + E)**. The recognition rule from the previous lesson completes here: **unweighted → BFS; non-negative weighted → Dijkstra; negative edges → Bellman–Ford.**`,

  vocabulary: [
    { term: "Dijkstra's algorithm", definition: "Single-source shortest paths for non-negative weighted graphs via a min-heap." },
    { term: "Relaxation", definition: "Updating dist[v] if reaching v through u is cheaper." },
    { term: "Priority queue (min-heap)", definition: "Yields the closest unsettled vertex next in O(log V)." },
    { term: "Settled vertex", definition: "A vertex whose shortest distance is finalized when popped." },
    { term: "Stale entry", definition: "An outdated (distance, node) in the heap, skipped by the d > dist[node] check." },
    { term: "Non-negative requirement", definition: "Negative edges break Dijkstra's 'closest-is-final' guarantee." },
  ],

  concepts: {
    purpose: "Compute single-source shortest paths on non-negative weighted graphs.",
    operations: "Pop the closest vertex; relax its edges; push improved distances; skip stale heap entries.",
    uses: "Road/network routing, weighted shortest paths, cheapest-cost problems, network latency.",
    tradeoffs: "O((V+E) log V) with a heap; requires non-negative weights (else Bellman–Ford).",
    commonMistakes: "Using it with negative edges (wrong result); not skipping stale heap entries; forgetting to relax (just pushing without comparing); using BFS on a weighted graph.",
    edgeCases: "Unreachable vertices keep distance infinity. Zero-weight edges are fine. A single vertex has distance 0.",
  },

  complexity: [
    { operation: "Dijkstra (binary heap)", best: "O((V + E) log V)", average: "O((V + E) log V)", worst: "O((V + E) log V)", space: "O(V + E)", note: "Each edge may push (E log V); each vertex popped once (V log V). Non-negative weights." },
  ],

  complexityExplanation: {
    variables: [
      { symbol: "V", meaning: "the number of vertices" },
      { symbol: "E", meaning: "the number of edges" },
    ],
    costModel: "Each heap push/pop is O(log V) (heap size is O(E)). Each vertex is settled once; each edge is relaxed once.",
    time: {
      bound: "O((V + E) log V)",
      case: "worst",
      explanation: "Each of the V vertices is popped and settled once (V pops, each O(log V) → V log V). Each of the E edges, when relaxed, may push a new (distance, node) onto the heap (E pushes, each O(log V) → E log V). The heap can hold O(E) entries, but log(E) is O(log V) since E ≤ V². Summing gives O((V + E) log V). (A Fibonacci heap improves this to O(E + V log V), but the binary-heap version is standard in practice.)",
    },
    space: {
      bound: "O(V + E)",
      case: "worst",
      explanation: "The distance array is O(V), the adjacency list O(V + E), and the heap can hold up to O(E) entries (stale ones included).",
      inputOutputNote: "The graph (V + E) and distance array are the structures; the heap's O(E) entries are the working space.",
    },
    derivation: [
      { lines: [9, 10, 11], description: "Each vertex is popped and settled once — V pops at O(log V).", cost: "O((V) log V)", dimension: "time" },
      { lines: [12, 13, 14, 15, 16], description: "Each edge relaxation may push once — E pushes at O(log V).", cost: "O((V + E) log V)", dimension: "time" },
      { lines: [5, 7], description: "Distance array O(V) and heap up to O(E).", cost: "O(V + E)", dimension: "space" },
    ],
    assumptions: ["All edge weights are NON-NEGATIVE (required for correctness).", "Binary heap: push/pop are O(log V).", "Stale entries are skipped, so each vertex is truly settled once."],
    tradeoffs: "BFS is O(V+E) but only for unweighted graphs; Bellman–Ford is O(V·E) but handles negative edges; a Fibonacci heap makes Dijkstra O(E + V log V) theoretically. The binary-heap Dijkstra is the practical default for non-negative weights.",
    counters: [{ label: "heap pops", definition: "executions of the pop (line 9)", countLines: [9] }],
    fixedDataNote: "This run computes distances [0, 3, 1, 4] from source 0; note dist[1]=3 via 0→2→1 beats the direct edge of weight 4. The O((V+E) log V) bound generalises.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import heapq for the priority queue." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: shortest paths, non-negative weights." },
    { line: 4, executable: true, explanation: "Define dijkstra(adj, start, n)." },
    { line: 5, executable: true, explanation: "All distances start at infinity." },
    { line: 6, executable: true, explanation: "The source's distance is 0." },
    { line: 7, executable: true, explanation: "Min-heap seeded with (0, start)." },
    { line: 8, executable: true, explanation: "Process until the heap empties." },
    { line: 9, executable: true, explanation: "Pop the closest unsettled vertex (smallest tentative distance)." },
    { line: 10, executable: true, explanation: "If this entry is stale (larger than the known distance)..." },
    { line: 11, executable: true, explanation: "...skip it." },
    { line: 12, executable: true, explanation: "For each weighted neighbour..." },
    { line: 13, executable: true, explanation: "...compute the distance through the current vertex." },
    { line: 14, executable: true, explanation: "Relaxation: if it's shorter than the best known..." },
    { line: 15, executable: true, explanation: "...update the neighbour's distance..." },
    { line: 16, executable: true, explanation: "...and push the improved (distance, neighbour)." },
    { line: 17, executable: true, explanation: "Return all shortest distances from the source." },
    { line: 18, executable: false, explanation: "Blank line." },
    { line: 19, executable: true, explanation: "A weighted graph as an adjacency list of (neighbour, weight)." },
    { line: 20, executable: true, explanation: "Distances from 0 → [0, 3, 1, 4]." },
  ],

  bindings: [
    { variable: "dist", model: "array" },
    { variable: "pq", model: "heap" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why does Dijkstra require non-negative edge weights, and what do you use if some edges are negative?", answer: "Dijkstra finalizes a vertex's distance when it's popped (closest first); a negative edge encountered later could make an already-settled vertex reachable more cheaply, breaking that guarantee. For negative edges use Bellman–Ford.", explanation: "The correctness rests on 'the closest unsettled vertex is done.' Negative weights can lower a settled vertex's true distance after the fact, so the greedy choice is no longer safe — Bellman–Ford handles that at O(V·E)." },
  ],

  experiments: [
    "Add a parent map to reconstruct the actual shortest path, not just distances.",
    "Add a negative edge and observe Dijkstra produce a wrong result (motivating Bellman–Ford).",
    "Count heap pushes/pops and relate them to V and E.",
  ],

  exercises: [
    {
      id: "dij-choose-1",
      kind: "choose-approach",
      prompt: "Pick the shortest-path algorithm: (a) unweighted social graph, (b) road network with positive distances, (c) currency graph with possible negative-weight arbitrage edges.",
      expected: "(a) BFS — O(V+E). (b) Dijkstra — non-negative weights, O((V+E) log V). (c) Bellman–Ford — handles negative edges (and detects negative cycles), O(V·E).",
      hints: ["Unweighted → BFS.", "Non-negative weights → Dijkstra.", "Negative edges → Bellman–Ford."],
    },
    {
      id: "dij-fix-1",
      kind: "fix-mistake",
      prompt: "This Dijkstra processes stale heap entries, doing redundant work (and can be wrong if it overwrites). Add the stale-skip check.",
      starterCode: "while pq:\n    d, node = heapq.heappop(pq)\n    for nb, w in adj[node]:\n        nd = d + w\n        if nd < dist[nb]:\n            dist[nb] = nd\n            heapq.heappush(pq, (nd, nb))",
      expected: "while pq:\n    d, node = heapq.heappop(pq)\n    if d > dist[node]:\n        continue\n    for nb, w in adj[node]:\n        nd = d + w\n        if nd < dist[nb]:\n            dist[nb] = nd\n            heapq.heappush(pq, (nd, nb))",
      hints: ["A vertex may appear in the heap multiple times with different distances.", "Skip an entry whose distance is worse than the recorded one.", "if d > dist[node]: continue"],
    },
  ],

  review: `**Dijkstra's algorithm** computes single-source shortest paths on **non-negative weighted** graphs by repeatedly settling the **closest unsettled vertex** (via a min-heap) and **relaxing** its edges, skipping **stale** heap entries. It's **O((V + E) log V)** time / **O(V + E)** space. Non-negative weights are required (negative edges break the greedy guarantee → use Bellman–Ford). Completing the rule: unweighted → BFS, non-negative weighted → Dijkstra.`,

  expectedOutput: "[0, 3, 1, 4]\n",

  references: [
    {
      url: "https://cp-algorithms.com/graph/dijkstra.html",
      title: "Dijkstra's algorithm — CP-Algorithms",
      section: "Priority-queue implementation and complexity",
      topic: "graphs/dijkstra",
      purpose: "Confirm the heap-based Dijkstra, its O((V+E) log V) complexity, and the non-negative-weight requirement.",
      verifiedClaims: ["Dijkstra with a binary heap is O((V+E) log V) and requires non-negative edge weights"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://algs4.cs.princeton.edu/44sp/",
      title: "Shortest Paths — Algorithms, 4th Edition (Princeton)",
      section: "Dijkstra's algorithm",
      topic: "graphs/dijkstra",
      purpose: "Cross-check relaxation, the settled-when-popped property, and the non-negative-weight condition.",
      verifiedClaims: ["Dijkstra relaxes edges and settles the nearest vertex first; correctness needs non-negative weights"],
      accessDate: "2026-09-20",
    },
  ],
};
