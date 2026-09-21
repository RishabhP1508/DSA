/**
 * Lesson: Multi-source BFS (Graphs). Verified on CPython 3.14.
 * Output: "[0, 1, 2, 1, 0]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `from collections import deque

# Multi-source BFS: start from MANY sources at once to get nearest distances.
def nearest_distances(sources, adj, n):
    dist = [-1] * n
    q = deque()
    for s in sources:          # seed ALL sources at distance 0
        dist[s] = 0
        q.append(s)
    while q:
        node = q.popleft()
        for nb in adj[node]:
            if dist[nb] == -1: # first time reached = nearest source distance
                dist[nb] = dist[node] + 1
                q.append(nb)
    return dist

adj = {0: [1], 1: [0, 2], 2: [1, 3], 3: [2, 4], 4: [3]}
# Sources 0 and 4; each vertex's distance to its NEAREST source.
print(nearest_distances([0, 4], adj, 5))`;

export const multiSourceBfs: LessonDefinition = {
  id: "multi-source-bfs",
  title: "Multi-Source BFS",
  area: "Graphs",
  prerequisites: ["graph-bfs"],

  explanation: `**Multi-source BFS** finds, for every vertex, its distance to the **nearest** of several sources — all in a single **O(V + E)** pass. The trick is beautifully simple: instead of seeding the BFS queue with one start, seed it with **all sources at distance 0** at once. Then run ordinary BFS. Because BFS expands in distance order and each vertex is claimed the **first** time it's reached, that first reach is necessarily from its closest source.

Contrast this with the naive approach: running a separate BFS from each of k sources and taking the minimum, which costs **O(k·(V + E))**. Multi-source BFS collapses that to **O(V + E)** by letting the sources' expansion fronts grow simultaneously and meet — no vertex is processed more than once. It's the same queue, same visited logic; only the *initialization* changes.

This pattern is everywhere in grid problems: "rotting oranges" (all rotten cells are sources, find time to rot everything), "walls and gates" / "nearest 0", "shortest distance to any exit." The recognition cue: **"distance to the nearest of several targets" in an unweighted graph/grid** → seed BFS with all targets at once. Here vertices at positions 0..4 with sources {0, 4} get distances \`[0, 1, 2, 1, 0]\` — a "V" shape, each vertex measured to whichever source is closer.`,

  vocabulary: [
    { term: "Multi-source BFS", definition: "BFS seeded with several sources simultaneously to find nearest-source distances." },
    { term: "Source", definition: "A starting vertex; all sources begin at distance 0." },
    { term: "Nearest-source distance", definition: "For each vertex, the minimum edges to any source." },
    { term: "Expansion front", definition: "The simultaneously-growing rings from all sources that meet in the middle." },
    { term: "First-reach claim", definition: "A vertex's distance is fixed the first (hence nearest) time BFS reaches it." },
  ],

  concepts: {
    purpose: "Compute nearest-source distances for all vertices in one BFS instead of k separate ones.",
    operations: "Seed the queue with all sources at distance 0; run standard BFS, fixing each vertex on first reach.",
    uses: "Rotting oranges, nearest 0 / walls and gates, nearest exit, fire/flood spread, nearest facility.",
    tradeoffs: "O(V + E) total vs O(k·(V + E)) for k separate BFS runs; needs all sources known up front.",
    commonMistakes: "Seeding only one source then looping (that's k separate BFS); updating a distance after the first reach (BFS already gives the minimum); forgetting to mark sources as distance 0.",
    edgeCases: "A vertex that is itself a source has distance 0. Unreachable vertices keep -1. All vertices as sources → all distances 0.",
  },

  complexity: [
    { operation: "Multi-source BFS", best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)", space: "O(V)", note: "One pass regardless of source count; vs O(k·(V+E)) for k separate BFS." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "V", meaning: "the number of vertices" },
      { symbol: "E", meaning: "the number of edges" },
      { symbol: "k", meaning: "the number of sources (for the comparison)" },
    ],
    costModel: "deque and array operations are O(1). Each vertex is enqueued once (on its first, nearest reach); each edge is scanned once.",
    time: {
      bound: "O(V + E)",
      case: "worst",
      explanation: "Seeding all k sources is O(k) ≤ O(V). Then it's an ordinary BFS: each vertex is enqueued exactly once (the first time it's reached, which is from its nearest source) and each edge is scanned once — O(V + E). The number of sources does NOT multiply the cost, because the fronts share one queue and one distance array. Running BFS separately from each source would be O(k·(V+E)); multi-source folds it into a single O(V+E) sweep.",
    },
    space: {
      bound: "O(V)",
      case: "worst",
      explanation: "The distance array is O(V) and the queue holds up to O(V) vertices (the combined front). ",
      inputOutputNote: "The graph (V + E) is the input; the distance array and queue are the O(V) auxiliary space (and result).",
    },
    derivation: [
      { lines: [7, 8, 9], description: "Seed all sources at distance 0 — O(k), at most O(V).", cost: "O(V)", dimension: "time" },
      { lines: [10, 11], description: "Each vertex is dequeued once (first reach).", cost: "O(V)", dimension: "time" },
      { lines: [12, 13, 14, 15], description: "Each edge is scanned once, fixing the nearest distance.", cost: "O(V + E)", dimension: "time" },
      { lines: [5, 6], description: "Distance array and queue are each O(V).", cost: "O(V)", dimension: "space" },
    ],
    assumptions: ["Unweighted graph (BFS gives shortest distances).", "All sources known before starting.", "First reach = nearest source (BFS distance order)."],
    tradeoffs: "Separate BFS per source is O(k·(V+E)) and O(V) space; multi-source is O(V+E) — a k-fold speedup — at the cost of needing all sources up front.",
    counters: [{ label: "vertices settled", definition: "dequeues (line 11)", countLines: [11] }],
    fixedDataNote: "This run with sources {0,4} on a 5-vertex line gives [0,1,2,1,0] — each vertex's distance to its nearer source. The O(V+E) bound is independent of the source count.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import deque." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: seed many sources at once." },
    { line: 4, executable: true, explanation: "Define nearest_distances(sources, adj, n)." },
    { line: 5, executable: true, explanation: "dist[v] = -1 means unreached." },
    { line: 6, executable: true, explanation: "The BFS queue." },
    { line: 7, executable: true, explanation: "Seed EVERY source..." },
    { line: 8, executable: true, explanation: "...at distance 0..." },
    { line: 9, executable: true, explanation: "...and enqueue it." },
    { line: 10, executable: true, explanation: "Standard BFS loop." },
    { line: 11, executable: true, explanation: "Dequeue a vertex." },
    { line: 12, executable: true, explanation: "For each neighbour..." },
    { line: 13, executable: true, explanation: "...if unreached (first time = nearest)..." },
    { line: 14, executable: true, explanation: "...set its distance to parent + 1..." },
    { line: 15, executable: true, explanation: "...and enqueue it." },
    { line: 16, executable: true, explanation: "Return all nearest-source distances." },
    { line: 17, executable: false, explanation: "Blank line." },
    { line: 18, executable: true, explanation: "A 5-vertex line graph 0-1-2-3-4." },
    { line: 19, executable: false, explanation: "Comment: sources 0 and 4." },
    { line: 20, executable: true, explanation: "Distances to nearest source → [0, 1, 2, 1, 0]." },
  ],

  bindings: [
    { variable: "dist", model: "array" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why is multi-source BFS O(V + E) rather than O(k·(V + E)) for k sources?", answer: "Because all sources share ONE queue and one distance array; each vertex is settled once (on its first, nearest reach) regardless of how many sources there are — so it's a single BFS sweep, not k of them.", explanation: "Seeding all sources at distance 0 lets their fronts expand together and claim each vertex once. The source count only affects the O(k) seeding, which is ≤ O(V); the sweep itself stays O(V + E)." },
  ],

  experiments: [
    "Use a single source and confirm it reduces to ordinary BFS distances.",
    "Add an unreachable vertex and see it keep distance -1.",
    "Map this to 'rotting oranges': all rotten cells are sources; the max distance is the time to rot all.",
  ],

  exercises: [
    {
      id: "msbfs-choose-1",
      kind: "choose-approach",
      prompt: "In a grid, every empty cell needs its distance to the NEAREST gate (several gates). Separate BFS per gate or multi-source BFS? Complexity of each?",
      expected: "Multi-source BFS: seed all gates at distance 0 and run one BFS — O(V + E) (cells + edges). Separate BFS per gate is O(k·(V + E)) for k gates, far slower.",
      hints: ["How many gates, and do you know them up front?", "Seed them all at once.", "One BFS: O(V+E), not O(k·(V+E))."],
    },
    {
      id: "msbfs-fix-1",
      kind: "fix-mistake",
      prompt: "This seeds only the first source, so distances are wrong. Fix it to seed all sources.",
      starterCode: "dist = [-1] * n\nq = deque()\ndist[sources[0]] = 0\nq.append(sources[0])",
      expected: "dist = [-1] * n\nq = deque()\nfor s in sources:\n    dist[s] = 0\n    q.append(s)",
      hints: ["Multi-source means ALL sources start at distance 0.", "Loop over every source.", "for s in sources: dist[s] = 0; q.append(s)"],
    },
  ],

  review: `**Multi-source BFS** seeds the queue with **all sources at distance 0** and runs one ordinary BFS, so each vertex is settled on its **first (nearest) reach** — giving every vertex's distance to its closest source in **O(V + E)**, independent of the source count. It replaces k separate BFS runs (O(k·(V+E))) and powers grid problems like rotting oranges and nearest-gate. Cue: "distance to the nearest of several targets" (unweighted) → seed all targets at once.`,

  expectedOutput: "[0, 1, 2, 1, 0]\n",

  references: [
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Graphs — Rotting Oranges / multi-source BFS",
      topic: "graphs/multi-source-bfs",
      purpose: "Confirm the multi-source BFS technique (seed all sources) and its O(V+E) cost vs per-source BFS.",
      verifiedClaims: ["Seeding BFS with all sources at distance 0 computes nearest-source distances in O(V+E)"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://cp-algorithms.com/graph/breadth-first-search.html",
      title: "Breadth-first search — CP-Algorithms",
      section: "Multiple sources",
      topic: "graphs/multi-source-bfs",
      purpose: "Cross-check that BFS from multiple sources computes minimum distances in a single O(V+E) pass.",
      verifiedClaims: ["BFS initialized from multiple sources yields distance to the nearest source in O(V+E)"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "c96edf1aa43e6cc3",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
