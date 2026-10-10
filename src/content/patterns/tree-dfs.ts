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

  naiveApproach: "Reconstructing every node’s ancestors from scratch repeats path work. BFS can carry a running total and a path representation, but copying full pending paths can add storage and time; it is a valid alternative when that cost is understood.",

  whyItHelps: "DFS maintains one mutable root-to-current-node path. Append on descent, copy it for a matching leaf, and pop on return so siblings remain independent. Visiting nodes costs O(n), but copying qualifying paths costs O(K), where K is the total number of values copied into returned paths. Total time is O(n+K), potentially O(n*h); working path/frames use O(h), excluding the output.",

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
    "For this path-list output: O(n+K) time, O(h) auxiliary frames/path, and O(K) returned values. K can be O(n*h).",

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of nodes in the tree"
    },
    {
      "symbol": "h",
      "meaning": "the height of the tree"
    },
    {
      "symbol": "K",
      "meaning": "total number of values copied into the returned matching paths"
    }
  ],
  "costModel": "DFS carries a running path and sum down each root-to-leaf route; each node is entered once with O(1) work (plus an O(path) copy only at qualifying leaves).",
  "time": {
    "bound": "O(n+K)",
    "case": "worst",
    "explanation": "Each node is visited once, but path[:] copies every saved value. Sum those copies over matching leaves to obtain K; it can be O(n*h)."
  },
  "space": {
    "bound": "O(h)",
    "case": "worst",
    "explanation": "The recursion stack is at most h deep, and the current `path` holds at most h values. This EXCLUDES the collected result paths.",
    "inputOutputNote": "O(h) mutable path and frames are auxiliary. The input tree and O(K) returned path entries are excluded."
  },
  "derivation": [
    {
      "lines": [
        13,
        14
      ],
      "description": "Extend the path and running sum entering each node.",
      "cost": "O(1) per node",
      "dimension": "time"
    },
    {
      "lines": [
        18,
        19
      ],
      "description": "Recurse into both children — each node entered once.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        10,
        13
      ],
      "description": "Recursion depth + path length, both <= h.",
      "cost": "O(h)",
      "dimension": "space"
    },
    {
      "lines": [
        16
      ],
      "description": "Copy complete matching paths into the returned result.",
      "cost": "O(K)",
      "dimension": "time"
    }
  ],
  "assumptions": [
    "append/pop at a list end are amortised O(1).",
    "path.pop() (line 20) restores state so the shared path is correct on every branch (backtracking).",
    "Proper finite tree; recursion fits the runtime limit. h counts path nodes.",
    "Integer additions/comparisons are constant cost; copying saved path lists costs their lengths."
  ],
  "tradeoffs": "An iterative stack-based DFS avoids Python's recursion-limit risk on deep trees but needs explicit path bookkeeping; recursion is clearer at O(h) stack.",
  "counters": [
    {
      "label": "nodes visited",
      "definition": "executions of path.append (line 13)",
      "countLines": [
        13
      ]
    }
  ],
  "fixedDataNote": "The path 1→2→4 sums to 7. Visiting n nodes costs O(n), but copying the K returned path entries adds O(K); total O(n+K).",
  "references": [
    {
      "url": "https://runestone.academy/ns/books/published/pythonds3/Trees/TreeTraversals.html",
      "title": "Runestone: tree traversals",
      "section": "6.8: preorder, inorder, postorder; recursive code listings",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "Traversal visit order.",
        "None is the recursion base case."
      ],
      "conventions": [],
      "accessDate": "2026-10-10"
    },
    {
      "url": "https://opendatastructures.org/ods-python/6_Binary_Trees.html",
      "title": "Open Data Structures: binary trees",
      "section": "Chapter 6 definitions and Figures 6.1–6.2",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "Unique parents in a rooted tree.",
        "Depth and height count edges."
      ],
      "conventions": [
        "This app states when its height function counts nodes instead."
      ],
      "accessDate": "2026-10-10"
    }
  ]
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
    "id": "pat-tdfs-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'Find all root-to-leaf paths whose values sum to a target.' Which pattern?",
    "expected": "Tree DFS carrying a shared path and running total, copying matching leaf paths and backtracking: O(n+K) time, O(h) auxiliary space, plus O(K) output values.",
    "correctPatternId": "tree-dfs",
    "hints": [
      "Record complete root-to-leaf paths whose totals match.",
      "Rebuilding ancestors repeatedly repeats work; copying saved paths still costs output size.",
      "Maintain one current path and running total during DFS.",
      "At a matching leaf save a copy, then undo the path append before returning.",
      "append; add value; if matching leaf: record path[:]; recurse as needed; pop.",
      "Traversal costs O(n) and copied output K costs O(K): O(n+K) time with O(h) working path/frames."
    ],
    "recognition": {
      "scenario": "Find all root-to-leaf paths whose values sum to a target.",
      "approaches": [
        {
          "id": "tree-dfs",
          "label": "Tree DFS with backtracking",
          "requiredReasonIds": [
            "recurse-path-backtrack"
          ]
        },
        {
          "id": "tree-bfs",
          "label": "Tree BFS",
          "requiredReasonIds": [],
          "rejectionFeedback": "Level-order processing does not carry the current path and running sum needed to record qualifying routes."
        }
      ],
      "reasons": [
        {
          "id": "recurse-path-backtrack",
          "text": "Tree DFS carrying a shared path and running total, copying matching leaf paths and backtracking: O(n+K) time, O(h) auxiliary space, plus O(K) output values."
        },
        {
          "id": "level-grouping",
          "text": "The task groups nodes by depth, so a queue-based level sweep fits.",
          "contradictory": true
        },
        {
          "id": "sorted-required",
          "text": "The tree must be a BST and sorted for this to work.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "tree-dfs"
      ],
      "modelExplanation": "Tree DFS carrying a shared path and running total, copying matching leaf paths and backtracking: O(n+K) time, O(h) auxiliary space, plus O(K) output values."
    }
  },
  {
    "id": "pat-tdfs-choose-1",
    "kind": "choose-approach",
    "prompt": "'Return the values of the tree grouped by level.' Tree DFS or Tree BFS?",
    "expected": "BFS queue-size rounds group levels directly. DFS with depth buckets also works in O(n), visiting left before right for the usual level order.",
    "correctPatternId": "tree-bfs",
    "hints": [
      "Goal: return the values of the tree grouped by level.",
      "DFS descends paths and would need extra depth bookkeeping to reconstruct levels.",
      "Key insight: grouping by level is breadth-first work, naturally handled by a queue.",
      "Approach: use tree BFS instead of DFS.",
      "Pseudocode: queue root; per iteration process one level's worth of nodes, collecting their values and enqueuing children.",
      "Use Tree BFS with a queue: level grouping is breadth-first, which DFS doesn't do without extra bookkeeping."
    ],
    "recognition": {
      "scenario": "Return the values of the tree grouped by level. Tree DFS or Tree BFS?",
      "approaches": [
        {
          "id": "tree-bfs",
          "label": "Tree BFS",
          "requiredReasonIds": [
            "breadth-first-levels"
          ]
        },
        {
          "id": "tree-dfs",
          "label": "Tree DFS",
          "requiredReasonIds": [
            "dfs-depth-groups"
          ]
        }
      ],
      "reasons": [
        {
          "id": "breadth-first-levels",
          "text": "Grouping by level is breadth-first work: a queue processes one full level at a time — O(n)."
        },
        {
          "id": "path-context-needed",
          "text": "The task needs a running path sum, so recursion is natural.",
          "contradictory": true
        },
        {
          "id": "needs-two-heaps",
          "text": "Two heaps are needed to balance the levels.",
          "contradictory": true
        },
        {
          "id": "dfs-depth-groups",
          "text": "Carry the depth in DFS and append each node to the bucket for that depth, visiting left before right to preserve per-level left-to-right order."
        }
      ],
      "acceptableApproachIds": [
        "tree-bfs",
        "tree-dfs"
      ],
      "modelExplanation": "BFS queue-size rounds group levels directly. DFS with depth buckets also works in O(n), visiting left before right for the usual level order.",
      "alternatives": []
    }
  },
  {
    "id": "pat-tdfs-fix-1",
    "kind": "fix-mistake",
    "prompt": "`root_to_leaf(root)` returns every root-to-leaf path (each a list of values). This leaks path state across subtrees. Add the missing backtracking step.",
    "starterCode": "def root_to_leaf(root):\n    res = []\n    def dfs(node, path):\n        if not node:\n            return\n        path.append(node.val)\n        if not node.left and not node.right:\n            res.append(path[:])\n        dfs(node.left, path)\n        dfs(node.right, path)\n        # bug: path not restored\n    dfs(root, [])\n    return res",
    "expected": "def root_to_leaf(root):\n    res = []\n    def dfs(node, path):\n        if not node:\n            return\n        path.append(node.val)\n        if not node.left and not node.right:\n            res.append(path[:])\n        dfs(node.left, path)\n        dfs(node.right, path)\n        path.pop()\n    dfs(root, [])\n    return res",
    "hints": [
      "Goal: fix the DFS so path state doesn't leak across sibling subtrees.",
      "The bug appends a node to the path but never removes it, so siblings inherit stale nodes.",
      "Key insight: after exploring a node's subtrees you must undo its append so the path reflects only the current branch.",
      "Approach: add a backtracking pop at the end of the recursive call.",
      "Pseudocode: append node.val; if leaf record path[:]; recurse left and right; then pop.",
      "Add `path.pop()` at the end so the node is removed on backtrack and doesn't leak to siblings."
    ],
    "tests": "class _T:\n    def __init__(self, val, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\nroot = _T(1, _T(2, _T(4), _T(5)), _T(3))\nassert sorted(root_to_leaf(root)) == [[1, 2, 4], [1, 2, 5], [1, 3]], 'path.pop() must unwind between subtrees'\nassert root_to_leaf(None) == []\nassert root_to_leaf(_T(9)) == [[9]], 'single leaf'\nassert sorted(root_to_leaf(_T(1, _T(2), _T(3)))) == [[1, 2], [1, 3]]\nprint('OK')"
  }
],

  references: [
  {
    "url": "https://runestone.academy/ns/books/published/pythonds3/Trees/TreeTraversals.html",
    "title": "Runestone: tree traversals",
    "section": "6.8: preorder, inorder, postorder; recursive code listings",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "Traversal visit order.",
      "None is the recursion base case."
    ],
    "conventions": [],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://opendatastructures.org/ods-python/6_Binary_Trees.html",
    "title": "Open Data Structures: binary trees",
    "section": "Chapter 6 definitions and Figures 6.1–6.2",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "Unique parents in a rooted tree.",
      "Depth and height count edges."
    ],
    "conventions": [
      "This app states when its height function counts nodes instead."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "b98d79459499ed4a",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
