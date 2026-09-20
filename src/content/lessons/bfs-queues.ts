/**
 * Lesson: BFS queues (Stacks and queues). Verified on CPython 3.14.
 * Output: "[0, 1, 2, 3]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Breadth-first traversal uses a FIFO queue to visit level by level.
from collections import deque

def bfs_levels(graph, start):
    visited = {start}
    q = deque([start])
    order = []
    while q:
        node = q.popleft()          # FIFO: take the earliest-added node
        order.append(node)
        for nb in graph[node]:
            if nb not in visited:   # enqueue each unseen neighbour once
                visited.add(nb)
                q.append(nb)
    return order

g = {0: [1, 2], 1: [3], 2: [3], 3: []}
print(bfs_levels(g, 0))`;

export const bfsQueues: LessonDefinition = {
  id: "bfs-queues",
  title: "BFS Queues",
  area: "Stacks and queues",
  prerequisites: ["stack-queue-operations", "string-frequency"],

  explanation: `**Breadth-First Search (BFS)** explores a graph **level by level** — first all neighbours of the start, then their neighbours, and so on. The engine that makes this happen is a **FIFO queue**: because the earliest-discovered nodes are processed first, exploration naturally fans out in rings of increasing distance from the start.

The recipe is always the same three pieces: a **queue** of nodes to process, a **visited set** so each node is enqueued only once, and the main loop that dequeues a node, records it, and enqueues its unseen neighbours. Using \`collections.deque\` keeps \`popleft\` (dequeue) at **O(1)**; a plain list would be O(n) per dequeue.

BFS visits every node once and looks at every edge once, so on a graph with **V** vertices and **E** edges it is **O(V + E)** time and **O(V)** space. Its defining property — visiting nodes in order of distance — is why BFS finds **shortest paths in unweighted graphs**. This lesson is the queue-centric foundation for the Graphs topic. (Swap the queue for a stack and you get DFS.)`,

  vocabulary: [
    { term: "BFS", definition: "Breadth-first search: explore neighbours level by level from the start." },
    { term: "FIFO queue", definition: "The structure that yields nodes in discovery order, producing the level-by-level sweep." },
    { term: "Visited set", definition: "Records which nodes are already discovered so each is enqueued once." },
    { term: "Frontier", definition: "The nodes currently in the queue, forming the boundary of exploration." },
    { term: "V and E", definition: "The number of vertices and edges in the graph." },
  ],

  concepts: {
    purpose: "Traverse a graph in distance order using a FIFO queue; the basis of shortest paths in unweighted graphs.",
    operations: "Dequeue a node, record it, enqueue unseen neighbours; mark visited on enqueue.",
    uses: "Shortest paths (unweighted), level-order tree traversal, connected components, flood fill.",
    tradeoffs: "O(V + E) time and O(V) space; requires the visited set to avoid revisiting/cycles.",
    commonMistakes: "Using list.pop(0) (O(n)) instead of deque.popleft; marking visited on dequeue instead of enqueue (nodes get queued multiple times); forgetting the visited set (infinite loop on cycles).",
    edgeCases: "Disconnected graph: BFS only reaches the start's component. Self-loops/back-edges are skipped by the visited check. Single node returns just [start].",
  },

  complexity: [
    { operation: "BFS traversal", best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)", space: "O(V)", note: "Each vertex enqueued once; each edge examined once." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "V", meaning: "the number of vertices (nodes)" },
      { symbol: "E", meaning: "the number of edges" },
    ],
    costModel: "deque.popleft/append and set add/lookup are O(1). Each vertex is enqueued once; each edge is examined once (from its endpoint).",
    time: {
      bound: "O(V + E)",
      case: "worst",
      explanation: "Every vertex is enqueued and dequeued exactly once thanks to the visited set — that's O(V). While processing each vertex we scan its adjacency list, and across all vertices those scans total the number of edges — O(E). Summed, BFS is O(V + E). Naming BOTH V and E matters: for a sparse graph E ≈ V (near O(V)), for a dense graph E ≈ V² (near O(V²)).",
    },
    space: {
      bound: "O(V)",
      case: "worst",
      explanation: "The visited set holds up to V vertices, and the queue holds at most O(V) vertices at once (a full frontier). The order list is also O(V).",
      inputOutputNote: "The graph (V + E) is the input; visited, the queue, and the order list are the O(V) auxiliary structures.",
    },
    derivation: [
      { lines: [8, 9, 10], description: "Each vertex is dequeued once — O(V) total.", cost: "O(V)", dimension: "time" },
      { lines: [11, 12, 13, 14], description: "Scanning all adjacency lists examines each edge once — O(E) total.", cost: "O(V + E)", dimension: "time" },
      { lines: [5, 6], description: "Visited set and queue each hold up to V vertices.", cost: "O(V)", dimension: "space" },
    ],
    assumptions: ["Adjacency-list representation.", "Set/deque operations are O(1).", "Marking visited on ENQUEUE ensures each vertex is queued once."],
    tradeoffs: "A list-based queue would make each dequeue O(n), degrading BFS; deque keeps it O(V + E). DFS (stack/recursion) has the same O(V+E) cost but visits depth-first, not by distance.",
    counters: [
      { label: "vertices dequeued", definition: "executions of the dequeue (line 9)", countLines: [9] },
    ],
    fixedDataNote: "This run on a 4-node graph yields [0, 1, 2, 3] — level order from 0. The O(V + E) bound generalises to any graph.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: BFS uses a FIFO queue for level order." },
    { line: 2, executable: true, explanation: "Import deque for an O(1) queue." },
    { line: 3, executable: false, explanation: "Blank line." },
    { line: 4, executable: true, explanation: "Define bfs_levels(graph, start)." },
    { line: 5, executable: true, explanation: "Mark the start visited immediately (on enqueue)." },
    { line: 6, executable: true, explanation: "Initialise the queue with the start node." },
    { line: 7, executable: true, explanation: "Record the visit order." },
    { line: 8, executable: true, explanation: "Process until the queue empties." },
    { line: 9, executable: true, explanation: "Dequeue the earliest-added node (FIFO) — the heart of BFS." },
    { line: 10, executable: true, explanation: "Record it as visited in order." },
    { line: 11, executable: true, explanation: "Look at each neighbour (examines each edge once)." },
    { line: 12, executable: true, explanation: "If unseen..." },
    { line: 13, executable: true, explanation: "...mark it visited (on enqueue, so it's queued once)." },
    { line: 14, executable: true, explanation: "...and enqueue it." },
    { line: 15, executable: true, explanation: "Return the BFS order." },
    { line: 16, executable: false, explanation: "Blank line." },
    { line: 17, executable: true, explanation: "A small graph as an adjacency list." },
    { line: 18, executable: true, explanation: "BFS from 0 → [0, 1, 2, 3]." },
  ],

  bindings: [
    { variable: "g", model: "graph", directed: false, overlays: [{ role: "visited", label: "visited", source: "visited" }] },
    { variable: "order", model: "array" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why mark a node visited when ENQUEUEING it rather than when dequeuing it?", answer: "To ensure each node is added to the queue only once; marking on dequeue lets a node be enqueued multiple times (once per edge into it) before it's processed.", explanation: "If you mark visited only on dequeue, several neighbours could enqueue the same node before it's processed, wasting work and space. Marking on enqueue guarantees exactly one queue entry per node." },
  ],

  experiments: [
    "Add an edge to create a cycle and confirm the visited set prevents infinite looping.",
    "Make the graph disconnected and see BFS reach only the start's component.",
    "Swap deque for a stack (append/pop) and observe DFS order instead of BFS.",
  ],

  exercises: [
    {
      id: "bfs-fix-1",
      kind: "fix-mistake",
      prompt: "This BFS can enqueue the same node many times. Move the visited-marking to fix it.",
      starterCode: "q = deque([start]); order = []; visited = set()\nwhile q:\n    node = q.popleft()\n    if node in visited:\n        continue\n    visited.add(node)\n    order.append(node)\n    for nb in graph[node]:\n        q.append(nb)",
      expected: "q = deque([start]); order = []; visited = {start}\nwhile q:\n    node = q.popleft()\n    order.append(node)\n    for nb in graph[node]:\n        if nb not in visited:\n            visited.add(nb)\n            q.append(nb)",
      hints: ["When are nodes added to the queue multiple times?", "Mark visited BEFORE enqueuing, not after dequeuing.", "Check `if nb not in visited` and add on enqueue."],
    },
    {
      id: "bfs-choose-1",
      kind: "choose-approach",
      prompt: "You need the shortest path length in an UNWEIGHTED graph. BFS or DFS, and why? What is the time complexity?",
      expected: "BFS — it visits nodes in increasing distance order, so the first time it reaches the target is the shortest path. O(V + E). DFS does not visit in distance order.",
      hints: ["Which explores by distance from the start?", "BFS fans out level by level.", "First arrival = shortest path; O(V+E)."],
    },
  ],

  review: `**BFS** explores a graph level by level using a **FIFO queue** (\`deque.popleft\` for O(1)), a **visited set** (mark on enqueue), and a main loop. It is **O(V + E)** time and **O(V)** space, and — because it visits in distance order — it finds **shortest paths in unweighted graphs**. Swapping the queue for a stack yields DFS.`,

  expectedOutput: "[0, 1, 2, 3]\n",

  references: [
    {
      url: "https://cp-algorithms.com/graph/breadth-first-search.html",
      title: "Breadth-first search — CP-Algorithms",
      section: "Algorithm and complexity",
      topic: "stacks/bfs-queues",
      purpose: "Confirm BFS uses a FIFO queue, is O(V + E), and finds shortest paths in unweighted graphs.",
      verifiedClaims: ["BFS is O(V + E) with a queue and visited set", "BFS finds shortest paths in unweighted graphs"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://docs.python.org/3/library/collections.html#collections.deque",
      title: "collections — deque — Python documentation",
      section: "deque append / popleft",
      topic: "stacks/bfs-queues",
      purpose: "Confirm deque provides O(1) popleft, making it the correct BFS queue.",
      verifiedClaims: ["deque supports O(1) appends and pops from both ends"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 15,
    contentHash: "7fd361c9b18c7b55",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
