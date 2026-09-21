/**
 * Pattern: Tree DFS.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "[[1, 2, 4]]\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `class TNode:
    def __init__(self, v, l=None, r=None):
        self.val = v
        self.left = l
        self.right = r

# Tree DFS: carry state down each root-to-leaf path; record complete paths.
def path_sum(root, target):
    res = []
    def dfs(node, path, total):
        if not node:
            return
        path.append(node.val)                 # extend the current path
        total += node.val
        if not node.left and not node.right and total == target:
            res.append(path[:])               # leaf reached with the target sum
        else:
            dfs(node.left, path, total)        # recurse into children
            dfs(node.right, path, total)
        path.pop()                             # backtrack before returning
    dfs(root, [], 0)
    return res

root = TNode(1, TNode(2, TNode(4)), TNode(3))
print(path_sum(root, 7))  # 1->2->4 sums to 7`;

export const treeDfsPattern: PatternDefinition = {
  id: "tree-dfs",
  title: "Tree DFS",
  category: "Graphs & trees",
  summary:
    "Recurse depth-first through a tree, carrying path/subtree state down and combining results on the way back up.",

  clues: [
    "The problem is about ROOT-TO-LEAF paths, subtree aggregates, or comparing/among subtrees.",
    "You need to carry information DOWN a path (a running sum, depth, ancestors) and/or combine child results UP.",
    "Phrases like 'path sum', 'all paths', 'diameter', 'lowest common ancestor', 'height/depth', 'max path sum'.",
  ],

  naiveApproach: `Level-order (BFS) doesn't carry path context, so path/subtree problems solved with BFS need bulky bookkeeping to reconstruct ancestry or subtree boundaries. Re-deriving each node's path from the root repeatedly is redundant work.`,

  whyItHelps: `Depth-first recursion mirrors a tree's structure: descending a call **carries state down** the current path (a running total, the path list, the depth), and returning **combines child answers up** (e.g. height = 1 + max(left, right)). Because the recursion follows one root-to-leaf path at a time, the current path is exactly the call stack, and **backtracking** (undo the append before returning) keeps siblings independent. It visits each node once — **O(n)** time — using **O(h)** stack space for the tree height.`,

  conditions: [
    "You need path/ancestor context or to aggregate results from children (otherwise BFS may be simpler).",
    "When mutating a shared path list, backtrack (pop) after recursing so siblings aren't polluted; record a COPY when saving a path.",
    "Handle the empty/None node base case first.",
  ],

  alternatives: [
    "Tree BFS (queue) — for level-by-level output, shortest depth, or width-based questions.",
    "Iterative DFS with an explicit stack — same order without recursion depth limits, useful for very tall trees.",
    "Morris traversal — O(1) space in-order traversal by threading, when stack space is forbidden.",
  ],

  counterexamples: [
    "'Values grouped by level' / 'right side view' are BFS problems — DFS doesn't group by level naturally.",
    "Forgetting to pop on backtrack leaks path state across sibling subtrees.",
    "Storing the live path list instead of a copy makes all recorded paths alias one (eventually empty) list.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "[[1, 2, 4]]\n",
  complexityNote:
    "O(n) time (each node visited once). O(h) auxiliary space for the recursion stack (h = tree height), plus the current path; the collected paths are output.",

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of nodes in the tree" },
      { symbol: "h", meaning: "the height of the tree" },
    ],
    costModel: "DFS carries a running path and sum down each root-to-leaf route; each node is entered once with O(1) work (plus an O(path) copy only at qualifying leaves).",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "Each node is visited exactly once (lines 11-20), doing O(1) work to extend/backtrack the path. Copying path[:] happens only at leaves that hit the target (line 16). In the worst case the recorded-paths copying adds up to O(n·h), but the traversal itself is O(n).",
    },
    space: {
      bound: "O(h)",
      case: "worst",
      explanation: "The recursion stack is at most h deep, and the current `path` holds at most h values. This EXCLUDES the collected result paths.",
      inputOutputNote: "The `res` list of matching paths is output storage, separate from the O(h) auxiliary space.",
    },
    derivation: [
      { lines: [13, 14], description: "Extend the path and running sum entering each node.", cost: "O(1) per node", dimension: "time" },
      { lines: [18, 19], description: "Recurse into both children — each node entered once.", cost: "O(n)", dimension: "time" },
      { lines: [10, 13], description: "Recursion depth + path length, both <= h.", cost: "O(h)", dimension: "space" },
    ],
    assumptions: ["append/pop at a list end are amortised O(1).", "path.pop() (line 20) restores state so the shared path is correct on every branch (backtracking)."],
    tradeoffs: "An iterative stack-based DFS avoids Python's recursion-limit risk on deep trees but needs explicit path bookkeeping; recursion is clearer at O(h) stack.",
    counters: [{ label: "nodes visited", definition: "executions of path.append (line 13)", countLines: [13] }],
    fixedDataNote: "For this 4-node tree the path 1->2->4 sums to 7. The O(n) traversal bound generalises.",
  },

  codeExplanations: [
    { line: 1, executable: true, explanation: "Define the tree node class." },
    { line: 2, executable: true, explanation: "Constructor with value and optional children." },
    { line: 3, executable: true, explanation: "Store the value." },
    { line: 4, executable: true, explanation: "Store the left child." },
    { line: 5, executable: true, explanation: "Store the right child." },
    { line: 6, executable: false, explanation: "Blank line." },
    { line: 7, executable: false, explanation: "Comment: carry state down each path." },
    { line: 8, executable: true, explanation: "Define path_sum(root, target)." },
    { line: 9, executable: true, explanation: "Collect matching root-to-leaf paths." },
    { line: 10, executable: true, explanation: "Inner DFS carrying the current path and running total." },
    { line: 11, executable: true, explanation: "Base case: a missing node." },
    { line: 12, executable: true, explanation: "Return (nothing to do)." },
    { line: 13, executable: true, explanation: "Extend the path with this node." },
    { line: 14, executable: true, explanation: "Add its value to the running total." },
    { line: 15, executable: true, explanation: "At a leaf, check whether the path hits the target." },
    { line: 16, executable: true, explanation: "Record a COPY of the successful path." },
    { line: 17, executable: false, explanation: "Otherwise keep descending." },
    { line: 18, executable: true, explanation: "Recurse into the left child." },
    { line: 19, executable: true, explanation: "Recurse into the right child." },
    { line: 20, executable: true, explanation: "Backtrack: remove this node before returning to the parent." },
    { line: 21, executable: true, explanation: "Start the DFS from the root with an empty path." },
    { line: 22, executable: true, explanation: "Return all matching paths." },
    { line: 23, executable: false, explanation: "Blank line." },
    { line: 24, executable: true, explanation: "Build a small tree." },
    { line: 25, executable: true, explanation: "Only 1->2->4 sums to 7, so [[1, 2, 4]]." },
  ],

  bindings: [{ variable: "path", model: "recursion" }],

  linkedLessons: ["tree-dfs", "tree-traversals", "tree-height-depth", "lowest-common-ancestor"],

  exercises: [
    {
      id: "pat-tdfs-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Find all root-to-leaf paths whose values sum to a target.' Which pattern?",
      expected:
        "Tree DFS: recurse carrying the path and running sum; at a leaf, if the sum matches, record a copy of the path; backtrack on the way up. O(n) time, O(h) space.",
      correctPatternId: "tree-dfs",
      hints: [
        "You carry a running sum down each path.",
        "Check the condition at leaves.",
        "Backtrack (pop) after recursing.",
      ],
    },
    {
      id: "pat-tdfs-choose-1",
      kind: "choose-approach",
      prompt:
        "'Return the values of the tree grouped by level.' Tree DFS or Tree BFS?",
      expected:
        "Tree BFS: level grouping is breadth-first work using a queue. DFS descends paths and doesn't group by level without extra depth bookkeeping.",
      correctPatternId: "tree-dfs",
      hints: [
        "The output is per-level.",
        "That's breadth-first.",
        "Use a queue (BFS), not DFS.",
      ],
    },
    {
      id: "pat-tdfs-fix-1",
      kind: "fix-mistake",
      prompt:
        "This leaks path state across subtrees. Add the missing backtracking step.",
      starterCode:
        "def dfs(node, path):\n    if not node:\n        return\n    path.append(node.val)\n    if not node.left and not node.right:\n        res.append(path[:])\n    dfs(node.left, path)\n    dfs(node.right, path)\n    # bug: path not restored",
      expected:
        "def dfs(node, path):\n    if not node:\n        return\n    path.append(node.val)\n    if not node.left and not node.right:\n        res.append(path[:])\n    dfs(node.left, path)\n    dfs(node.right, path)\n    path.pop()",
      hints: [
        "After exploring a node's subtrees, undo its append.",
        "Otherwise the sibling path keeps this node.",
        "Add path.pop() at the end.",
      ],
    },
  ],

  references: [
    {
      url: "https://leetcode.com/problems/path-sum-ii/editorial/",
      title: "Path Sum II — LeetCode editorial",
      section: "DFS carrying path + backtracking",
      topic: "patterns/tree-dfs",
      purpose: "Confirm DFS with a carried path and backtracking for root-to-leaf path problems; O(n)/O(h).",
      verifiedClaims: [
        "DFS carries the running path/sum down and backtracks after visiting a node's children.",
        "Tree DFS is O(n) time and O(h) space for the recursion stack.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/Trees/TreeTraversals.html",
      title: "Tree Traversals — Problem Solving with Algorithms and Data Structures (Runestone)",
      section: "Depth-first traversals (pre/in/post-order)",
      topic: "patterns/tree-dfs",
      purpose: "Cross-check that DFS follows one path to depth before backtracking, using O(h) stack space.",
      verifiedClaims: ["Depth-first traversal explores a path fully before backtracking, using stack space proportional to height."],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "d7df312529da2294",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
