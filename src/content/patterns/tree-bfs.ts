/**
 * Pattern: Tree BFS (level-order).
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "[[1], [2, 3], [4, 5]]\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `from collections import deque

class TNode:
    def __init__(self, v, l=None, r=None):
        self.val = v
        self.left = l
        self.right = r

# Level-order traversal: process the tree one full level at a time with a queue.
def level_order(root):
    res = []
    if not root:
        return res
    q = deque([root])
    while q:
        level = []
        for _ in range(len(q)):        # snapshot: exactly this level's nodes
            node = q.popleft()
            level.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
        res.append(level)
    return res

root = TNode(1, TNode(2, TNode(4), TNode(5)), TNode(3))
print(level_order(root))  # [[1], [2, 3], [4, 5]]`;

export const treeBfsPattern: PatternDefinition = {
  id: "tree-bfs",
  title: "Tree BFS (Level Order)",
  category: "Graphs & trees",
  summary:
    "Traverse a tree level by level using a queue, processing one whole level per outer iteration.",

  clues: [
    "You must process a tree LEVEL BY LEVEL, or by breadth (nearest nodes first).",
    "You need per-level output, the level count/averages, the right/left view, or the minimum depth.",
    "Phrases like 'level order', 'each level', 'zigzag', 'right side view', 'minimum depth', 'connect siblings'.",
  ],

  naiveApproach: `A depth-first traversal visits nodes in a depth order that doesn't group them by level, so producing level-based output requires tracking each node's depth and bucketing afterward — awkward and easy to get wrong. Recursion also can't naturally answer 'stop at the first/shallowest level that satisfies X'.`,

  whyItHelps: `A **FIFO queue** naturally yields breadth-first order: enqueue the root, then repeatedly dequeue a node and enqueue its children. To get **per-level** groups, capture \`len(queue)\` at the start of each outer iteration — that count is exactly the number of nodes on the current level — and process precisely that many before moving on. This visits every node once (**O(n)**) using **O(w)** space, where w is the maximum level width. It also gives early answers for depth-limited questions (e.g. minimum depth) since levels are processed nearest-first.`,

  conditions: [
    "Use a FIFO queue (deque.popleft), not a stack — a stack gives DFS.",
    "Snapshot the level size (len(queue)) BEFORE the inner loop so newly enqueued children don't bleed into the current level.",
    "Enqueue children when you dequeue their parent.",
  ],

  alternatives: [
    "Tree DFS (recursion/stack) — for path problems, subtree aggregates, or when depth order doesn't matter; O(h) space.",
    "Graph BFS — the same technique on a general graph, but you must track visited nodes (a tree has no cycles, so no visited set is needed).",
    "DFS with a depth argument — can also produce level buckets, but BFS is the direct fit for level-by-level work.",
  ],

  counterexamples: [
    "'Root-to-leaf path sums' or 'maximum path sum' are DFS problems — BFS doesn't carry a natural path context.",
    "Using a stack instead of a queue turns this into DFS and loses level grouping.",
    "Forgetting to snapshot the level size merges levels together in the output.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "[[1], [2, 3], [4, 5]]\n",
  complexityNote:
    "O(n) time — every node is enqueued and dequeued once. O(w) space where w is the widest level (up to ~n/2 for a full tree).",

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of nodes in the tree" },
      { symbol: "w", meaning: "the width of the widest level" },
    ],
    costModel: "A queue processes one level at a time; each node is enqueued once and dequeued once, doing O(1) work.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "Each node is enqueued once (lines 21, 23) and dequeued once (line 18), each O(1). The per-level snapshot (line 17) just counts the current queue size. So total O(n).",
    },
    space: {
      bound: "O(w)",
      case: "worst",
      explanation: "The queue holds at most one full level at a time — O(w), where w can be up to ~n/2 for a complete tree's bottom level.",
      inputOutputNote: "The tree (n nodes) is the input; the level lists total O(n) output.",
    },
    derivation: [
      { lines: [17, 18], description: "Dequeue each node once, one level per outer iteration.", cost: "O(n)", dimension: "time" },
      { lines: [20, 21, 22, 23], description: "Enqueue each child once.", cost: "O(n)", dimension: "time" },
      { lines: [14], description: "Queue holds at most one level (width w).", cost: "O(w)", dimension: "space" },
    ],
    assumptions: ["deque.popleft/append are O(1).", "len(q) is captured before the inner loop so exactly one level is processed per outer pass."],
    tradeoffs: "A recursive level-order using DFS with a depth index is also O(n) but uses O(h) stack; the queue makes the level boundaries explicit at O(w) space.",
    counters: [{ label: "nodes visited", definition: "executions of level.append (line 19)", countLines: [19] }],
    fixedDataNote: "This 5-node tree yields [[1],[2,3],[4,5]]. The O(n) bound generalises.",
  },

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import deque for an O(1) FIFO queue." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: true, explanation: "Define the tree node class." },
    { line: 4, executable: true, explanation: "Constructor with value and optional children." },
    { line: 5, executable: true, explanation: "Store the value." },
    { line: 6, executable: true, explanation: "Store the left child." },
    { line: 7, executable: true, explanation: "Store the right child." },
    { line: 8, executable: false, explanation: "Blank line." },
    { line: 9, executable: false, explanation: "Comment: process one level at a time." },
    { line: 10, executable: true, explanation: "Define level_order(root)." },
    { line: 11, executable: true, explanation: "Result: a list of levels." },
    { line: 12, executable: true, explanation: "Handle an empty tree." },
    { line: 13, executable: true, explanation: "Return the empty result." },
    { line: 14, executable: true, explanation: "Seed the queue with the root." },
    { line: 15, executable: true, explanation: "Process until the queue empties." },
    { line: 16, executable: true, explanation: "Collect this level's values." },
    { line: 17, executable: true, explanation: "Snapshot the current level size before enqueuing children." },
    { line: 18, executable: true, explanation: "Dequeue a node from the front." },
    { line: 19, executable: true, explanation: "Record its value." },
    { line: 20, executable: true, explanation: "Enqueue the left child if present." },
    { line: 21, executable: true, explanation: "(enqueue left)." },
    { line: 22, executable: true, explanation: "Enqueue the right child if present." },
    { line: 23, executable: true, explanation: "(enqueue right)." },
    { line: 24, executable: true, explanation: "Append the completed level." },
    { line: 25, executable: true, explanation: "Return all levels." },
    { line: 26, executable: false, explanation: "Blank line." },
    { line: 27, executable: true, explanation: "Build a small tree." },
    { line: 28, executable: true, explanation: "Level order is [[1], [2, 3], [4, 5]]." },
  ],

  bindings: [{ variable: "q", model: "queue" }],

  linkedLessons: ["tree-bfs", "graph-bfs"],

  exercises: [
    {
      id: "pat-tbfs-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Return the average value of the nodes on each level of a binary tree.' Which pattern?",
      expected:
        "Tree BFS (level order): use a queue and snapshot len(queue) each iteration to process one level, averaging that level's values. O(n).",
      correctPatternId: "tree-bfs",
      hints: [
        "You need per-level results.",
        "A queue gives breadth-first order.",
        "Snapshot the level size before enqueuing children.",
      ],
    },
    {
      id: "pat-tbfs-choose-1",
      kind: "choose-approach",
      prompt:
        "'Find the maximum root-to-leaf path sum.' Tree BFS or Tree DFS?",
      expected:
        "Tree DFS: path problems need to carry a running sum down each root-to-leaf path, which recursion (or a stack) does naturally. BFS processes by level and doesn't carry path context.",
      correctPatternId: "tree-bfs",
      hints: [
        "It's about paths, not levels.",
        "You carry state down a path.",
        "DFS fits path/subtree problems.",
      ],
    },
    {
      id: "pat-tbfs-fix-1",
      kind: "fix-mistake",
      prompt:
        "This merges all nodes into one level because it doesn't snapshot the level size. Fix it.",
      starterCode:
        "q = deque([root])\nwhile q:\n    level = []\n    node = q.popleft()\n    level.append(node.val)\n    if node.left: q.append(node.left)\n    if node.right: q.append(node.right)\n    res.append(level)",
      expected:
        "q = deque([root])\nwhile q:\n    level = []\n    for _ in range(len(q)):\n        node = q.popleft()\n        level.append(node.val)\n        if node.left: q.append(node.left)\n        if node.right: q.append(node.right)\n    res.append(level)",
      hints: [
        "You must process exactly one level per outer iteration.",
        "Capture the level's node count first.",
        "Wrap the body in `for _ in range(len(q))`.",
      ],
    },
  ],

  references: [
    {
      url: "https://leetcode.com/problems/binary-tree-level-order-traversal/editorial/",
      title: "Binary Tree Level Order Traversal — LeetCode editorial",
      section: "BFS with a queue, one level per iteration",
      topic: "patterns/tree-bfs",
      purpose: "Confirm the level-size snapshot technique and O(n) time / O(w) space.",
      verifiedClaims: [
        "Capturing the queue length per iteration processes one tree level at a time.",
        "Level-order traversal is O(n) time and O(w) space for the widest level.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/Trees/BinaryTreeApplications.html",
      title: "Trees — Problem Solving with Algorithms and Data Structures (Runestone)",
      section: "Breadth-first tree traversal",
      topic: "patterns/tree-bfs",
      purpose: "Cross-check that a queue yields breadth-first (level) order on trees.",
      verifiedClaims: ["A queue processes tree nodes in breadth-first, level-by-level order."],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "93333da7d410c7ab",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
