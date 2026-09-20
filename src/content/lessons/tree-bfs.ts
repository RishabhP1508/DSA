/**
 * Lesson: Tree BFS / level order (Trees and tries). Verified on CPython 3.14.
 * Output: "[5, 3, 8, 2, 4, 7, 9]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `from collections import deque

class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

root = TreeNode(5, TreeNode(3, TreeNode(2), TreeNode(4)),
                   TreeNode(8, TreeNode(7), TreeNode(9)))

# Level-order traversal: visit the tree level by level using a queue.
def level_order(root):
    if not root:
        return []
    out = []
    q = deque([root])
    while q:
        node = q.popleft()          # FIFO -> nodes come out top-to-bottom
        out.append(node.val)
        if node.left:  q.append(node.left)
        if node.right: q.append(node.right)
    return out

print(level_order(root))`;

export const treeBfs: LessonDefinition = {
  id: "tree-bfs",
  title: "Tree BFS / Level Order",
  area: "Trees and tries",
  prerequisites: ["tree-dfs", "bfs-queues"],

  explanation: `**Breadth-first search (BFS)** on a tree visits nodes **level by level** — the root, then everything at depth 1, then depth 2, and so on. Where DFS uses recursion (a stack), BFS uses a **FIFO queue**: you dequeue a node, record it, and enqueue its children. Because the queue preserves discovery order, siblings are processed before their children, producing the left-to-right, top-to-bottom order \`5, 3, 8, 2, 4, 7, 9\`.

This is the tree specialization of the graph BFS you met with queues. The same three ingredients appear — a queue, the main loop, and enqueuing neighbours (here, children) — but trees need **no visited set** because a tree has no cycles and each node has exactly one parent.

BFS visits every node once, so it is **O(n)** time. Its space is the **maximum width** of the tree (the most nodes on any one level), because that's the largest the queue gets — **O(w)**, which can be up to n/2 for the bottom level of a balanced tree. A tiny tweak (processing the queue one level-size at a time) yields **level-by-level grouping**, which is how you solve "level averages", "right side view", and "zigzag" problems. Use BFS when *distance from the root / level* matters; use DFS when you need to go deep (paths, subtrees).`,

  vocabulary: [
    { term: "BFS / level order", definition: "Visiting tree nodes level by level from the root outward." },
    { term: "FIFO queue", definition: "The structure (deque) that yields nodes in discovery order for BFS." },
    { term: "Level", definition: "All nodes at the same depth from the root." },
    { term: "Width (w)", definition: "The maximum number of nodes on any single level; bounds the queue size." },
    { term: "No visited set", definition: "Trees are acyclic with single parents, so BFS needs no visited tracking." },
  ],

  concepts: {
    purpose: "Traverse a tree by depth/level using a queue — the basis of level-based tree problems.",
    operations: "Dequeue a node, record it, enqueue its children; repeat until the queue empties.",
    uses: "Level order, level averages, right-side view, zigzag, minimum depth, connect-level-siblings.",
    tradeoffs: "O(n) time and O(w) space (queue width); BFS finds shallowest nodes first, unlike DFS.",
    commonMistakes: "Enqueuing None children (guard with if); using list.pop(0) instead of deque.popleft (O(n)); adding an unnecessary visited set (trees don't need it).",
    edgeCases: "Empty tree returns []. A single node returns just it. A degenerate chain makes width 1 (queue holds one node).",
  },

  complexity: [
    { operation: "BFS traversal", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(w)", note: "Every node visited once; queue holds at most one level (width w, up to ~n/2)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of nodes in the tree" },
      { symbol: "w", meaning: "the maximum width (most nodes on any single level)" },
    ],
    costModel: "deque.popleft/append are O(1); each node is enqueued and dequeued exactly once.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "Each node is enqueued once (when discovered as a child) and dequeued once (when processed), doing O(1) work each time — so BFS touches every node exactly once, giving O(n). No node is revisited because a tree has no cycles.",
    },
    space: {
      bound: "O(w)",
      case: "worst",
      explanation: "The queue holds the frontier — at most the nodes of one level. The largest a level gets is the tree's maximum width w. For a balanced binary tree the bottom level has about n/2 nodes, so the queue (and thus BFS space) can be O(n); for a degenerate chain the width is 1, so O(1). Hence the honest bound is O(w).",
      inputOutputNote: "The tree of n nodes is the input; the output list (n) and the O(w) queue are the extra space.",
    },
    derivation: [
      { lines: [19], description: "Each node is dequeued exactly once — O(n) total.", cost: "O(n)", dimension: "time" },
      { lines: [21, 22, 23], description: "Enqueuing each child is O(1); each node enqueued once.", cost: "O(n)", dimension: "time" },
      { lines: [18, 22, 23], description: "The queue holds at most one level — up to the width w.", cost: "O(w)", dimension: "space" },
    ],
    assumptions: ["deque operations are O(1).", "No visited set needed (a tree is acyclic).", "Width w bounds the queue size."],
    tradeoffs: "DFS uses O(h) stack space (height) and goes deep; BFS uses O(w) queue space (width) and goes by level. Pick based on whether depth or level matters — and note w can be O(n) for wide balanced trees.",
    counters: [{ label: "nodes dequeued", definition: "executions of the dequeue (line 19)", countLines: [19] }],
    fixedDataNote: "This run visits 7 nodes in level order → [5,3,8,2,4,7,9]; the max width here is 4 (bottom level). The O(n)/O(w) bounds generalise.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import deque for an O(1) queue." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: true, explanation: "Define TreeNode." },
    { line: 4, executable: true, explanation: "Constructor." },
    { line: 5, executable: true, explanation: "Value." },
    { line: 6, executable: true, explanation: "Left child." },
    { line: 7, executable: true, explanation: "Right child." },
    { line: 8, executable: false, explanation: "Blank line." },
    { line: 9, executable: true, explanation: "Build the tree." },
    { line: 10, executable: true, explanation: "Right subtree of the root." },
    { line: 11, executable: false, explanation: "Blank line." },
    { line: 12, executable: false, explanation: "Comment: level order uses a queue." },
    { line: 13, executable: true, explanation: "Define level_order(root)." },
    { line: 14, executable: true, explanation: "Guard the empty tree." },
    { line: 15, executable: true, explanation: "Return [] if empty." },
    { line: 16, executable: true, explanation: "Output list of values in level order." },
    { line: 17, executable: true, explanation: "Initialise the queue with the root." },
    { line: 18, executable: true, explanation: "Process until the queue empties." },
    { line: 19, executable: true, explanation: "Dequeue the front node (FIFO gives top-to-bottom order)." },
    { line: 20, executable: true, explanation: "Record its value." },
    { line: 21, executable: true, explanation: "Enqueue the left child if present." },
    { line: 22, executable: true, explanation: "Enqueue the right child if present." },
    { line: 23, executable: true, explanation: "Return the level-order values." },
    { line: 24, executable: false, explanation: "Blank line." },
    { line: 25, executable: true, explanation: "level_order(root) → [5, 3, 8, 2, 4, 7, 9]." },
  ],

  bindings: [
    { variable: "root", model: "tree" },
    { variable: "out", model: "array" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "DFS space is O(h) (height). Why is BFS space O(w) (width), and when is that worse?", answer: "BFS's queue holds a whole level at once, so its size is the tree's maximum width w. For a wide balanced tree the bottom level is ~n/2 nodes, making BFS O(n) space — worse than DFS's O(log n) for the same tree.", explanation: "BFS keeps the current frontier (one level) in the queue, so space scales with width; DFS keeps one root-to-leaf path, scaling with height. For balanced trees width dominates height." },
  ],

  experiments: [
    "Process the queue one level-size at a time to group nodes by level.",
    "Track the max queue length to observe the tree's width.",
    "Build a degenerate chain and confirm the queue never holds more than one node.",
  ],

  exercises: [
    {
      id: "bfs-complete-1",
      kind: "complete-code",
      prompt: "Modify BFS to return a list of levels (list of lists).",
      starterCode: "from collections import deque\ndef levels(root):\n    if not root:\n        return []\n    out = []\n    q = deque([root])\n    while q:\n        size = len(q)\n        level = []\n        # TODO: process exactly `size` nodes for this level\n        out.append(level)\n    return out",
      expected: "from collections import deque\ndef levels(root):\n    if not root:\n        return []\n    out = []\n    q = deque([root])\n    while q:\n        size = len(q)\n        level = []\n        for _ in range(size):\n            node = q.popleft()\n            level.append(node.val)\n            if node.left: q.append(node.left)\n            if node.right: q.append(node.right)\n        out.append(level)\n    return out",
      hints: ["Snapshot the current queue length as the level size.", "Loop exactly that many times, dequeuing each.", "Enqueue children as you go, then append the level list."],
    },
    {
      id: "bfs-choose-1",
      kind: "choose-approach",
      prompt: "You need the value of every node's rightmost node at each depth ('right side view'). BFS or DFS, and why?",
      expected: "BFS by levels: process each level and take its last node — level order makes 'per depth' natural. (A DFS tracking depth also works, visiting right child first.) BFS is the intuitive fit because the problem is defined per level.",
      hints: ["The problem is defined per depth/level.", "Which traversal is organized by level?", "BFS: take the last node of each level."],
    },
  ],

  review: `**Tree BFS / level order** uses a **FIFO queue** to visit nodes level by level: dequeue, record, enqueue children (no visited set needed for trees). It is **O(n)** time and **O(w)** space, where w is the maximum **width** — which can be O(n) for wide balanced trees, unlike DFS's O(h). Processing the queue one level-size at a time gives level grouping for problems like right-side view and level averages.`,

  expectedOutput: "[5, 3, 8, 2, 4, 7, 9]\n",

  references: [
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Trees — Level Order Traversal (BFS)",
      topic: "trees/bfs-level-order",
      purpose: "Confirm queue-based level-order traversal and the level-size loop for grouping.",
      verifiedClaims: ["Level-order traversal uses a FIFO queue and is O(n); processing per level-size groups nodes by depth"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://docs.python.org/3/library/collections.html#collections.deque",
      title: "collections — deque — Python documentation",
      section: "popleft / append",
      topic: "trees/bfs-level-order",
      purpose: "Confirm deque gives O(1) popleft, the correct BFS queue.",
      verifiedClaims: ["deque supports O(1) append and popleft"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "d50340da7f691458",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
