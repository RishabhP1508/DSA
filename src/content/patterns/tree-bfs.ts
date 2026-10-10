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

  naiveApproach: "Repeatedly scan the whole tree to collect one depth at a time: O(n*h). A single DFS carrying depth into buckets is a valid O(n) alternative; BFS makes the level boundary explicit through a saved queue size.",

  whyItHelps: "A FIFO queue processes depth in order. At the start of each round, save len(q) and remove exactly that many nodes; their children belong to the next round. During the round the queue can mix two adjacent levels, with at most 2w nodes for maximum width w. Each node is handled once: O(n) time and O(w) queue space, plus the returned O(n) output.",

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
  "Path sums naturally fit DFS with a carried running total. BFS can also carry (node,total), but may require more frontier storage.",
  "Using a stack instead of a queue turns this into DFS and loses level grouping.",
  "Forgetting to snapshot the level size merges levels together in the output."
],

  walkthroughCode,
  walkthroughExpectedOutput: "[[1], [2, 3], [4, 5]]\n",
  complexityNote:
    "O(n) time — every node is enqueued and dequeued once. O(w) space where w is the widest level (up to ~n/2 for a full tree).",

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of nodes in the tree"
    },
    {
      "symbol": "w",
      "meaning": "the width of the widest level"
    }
  ],
  "costModel": "A queue processes one level at a time; each node is enqueued once and dequeued once, doing O(1) work.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "Each node is enqueued once (lines 21, 23) and dequeued once (line 18), each O(1). The per-level snapshot (line 17) just counts the current queue size. So total O(n)."
  },
  "space": {
    "bound": "O(w)",
    "case": "worst",
    "explanation": "The queue may mix the remainder of one level with children in the next. Their total is at most 2w, so working space is O(w), excluding returned groups.",
    "inputOutputNote": "The tree (n nodes) is the input; the level lists total O(n) output."
  },
  "derivation": [
    {
      "lines": [
        17,
        18
      ],
      "description": "Dequeue each node once, one level per outer iteration.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        20,
        21,
        22,
        23
      ],
      "description": "Enqueue each child once.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        14
      ],
      "description": "Queue frontier can mix two adjacent levels, still O(w).",
      "cost": "O(w)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "deque.popleft/append are O(1).",
    "len(q) is captured before the inner loop so exactly one level is processed per outer pass.",
    "Proper acyclic tree with unique parents. Returned level groups are output storage."
  ],
  "tradeoffs": "A recursive level-order using DFS with a depth index is also O(n) but uses O(h) stack; the queue makes the level boundaries explicit at O(w) space.",
  "counters": [
    {
      "label": "nodes visited",
      "definition": "executions of level.append (line 19)",
      "countLines": [
        19
      ]
    }
  ],
  "fixedDataNote": "This 5-node tree yields [[1],[2,3],[4,5]]. The O(n) bound generalises.",
  "references": [
    {
      "url": "https://opendatastructures.org/ods-python/12_3_Graph_Traversal.html",
      "title": "Open Data Structures: graph traversal",
      "section": "12.3.1 BFS; 12.3.2 DFS; Figures 12.4–12.5",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "BFS discovers reachable vertices in distance order.",
        "DFS records visited vertices before recursion."
      ],
      "conventions": [],
      "accessDate": "2026-10-10"
    },
    {
      "url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/196a95604877d326c6586e60477b59d4_MIT6_006S20_lec9.pdf",
      "title": "MIT 6.006 Lecture 9: BFS",
      "section": "Pages 1–4: representations, shortest paths, BFS",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "Undirected adjacency stores both directions.",
        "A path length counts edges."
      ],
      "conventions": [
        "App may use -1 for unreachable distances instead of infinity."
      ],
      "accessDate": "2026-10-10"
    }
  ]
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
    "id": "pat-tbfs-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'Return the average value of the nodes on each level of a binary tree.' Which pattern?",
    "expected": "BFS with a queue-size snapshot is direct; DFS carrying depth into sum/count buckets is also a valid O(n) solution.",
    "correctPatternId": "tree-bfs",
    "hints": [
      "Goal: return the average value of the nodes on each level of a binary tree.",
      "You must group nodes by depth, so a plain recursive descent doesn't naturally separate levels.",
      "Key insight: snapshotting the queue size at the start of each iteration bounds exactly one level.",
      "Approach: use tree BFS (level order) with a queue.",
      "Pseudocode: queue root; while queue: take size=len(queue); pop that many, summing values and enqueuing children; record the average.",
      "Use tree BFS: snapshot len(queue) each iteration to process one level, averaging that level's values — O(n)."
    ],
    "recognition": {
      "scenario": "Return the average value of the nodes on each level of a binary tree.",
      "approaches": [
        {
          "id": "tree-bfs",
          "label": "Tree BFS (level order with a queue)",
          "requiredReasonIds": [
            "per-level-snapshot"
          ]
        },
        {
          "id": "tree-dfs",
          "label": "Tree DFS",
          "requiredReasonIds": [
            "depth-buckets"
          ]
        }
      ],
      "reasons": [
        {
          "id": "per-level-snapshot",
          "text": "Process the tree level by level: snapshot the queue length each iteration to isolate one level and average its values — O(n)."
        },
        {
          "id": "path-sum-needed",
          "text": "The task needs a running path sum down each root-to-leaf route.",
          "contradictory": true
        },
        {
          "id": "must-sort-values",
          "text": "Node values must be sorted before averaging.",
          "contradictory": true
        },
        {
          "id": "depth-buckets",
          "text": "Carry each node’s depth in DFS and update a sum/count bucket for that depth. This also computes level averages in O(n)."
        }
      ],
      "acceptableApproachIds": [
        "tree-bfs",
        "tree-dfs"
      ],
      "modelExplanation": "BFS with a queue-size snapshot is direct; DFS carrying depth into sum/count buckets is also a valid O(n) solution.",
      "alternatives": []
    }
  },
  {
    "id": "pat-tbfs-choose-1",
    "kind": "choose-approach",
    "prompt": "'Find the maximum root-to-leaf path sum.' Tree BFS or Tree DFS?",
    "expected": "DFS carries path totals with O(h) frames; BFS carrying (node,total) is also correct, using O(w) frontier storage. Both take O(n) time.",
    "correctPatternId": "tree-dfs",
    "hints": [
      "The task compares totals at leaves, not level totals.",
      "A traversal must preserve the sum along each node’s root path.",
      "DFS can pass the running sum as an argument; BFS can queue it alongside the node.",
      "Use DFS for a natural O(h)-frame implementation or BFS with (node,total) pairs.",
      "At each node add its value; at leaves compare with the best; otherwise propagate the total to children.",
      "Both traversals take O(n); their frontier storage differs: O(h) for DFS and O(w) for BFS."
    ],
    "recognition": {
      "scenario": "Find the maximum root-to-leaf path sum. Tree BFS or Tree DFS?",
      "approaches": [
        {
          "id": "tree-dfs",
          "label": "Tree DFS",
          "requiredReasonIds": [
            "carry-path-sum"
          ]
        },
        {
          "id": "tree-bfs",
          "label": "Tree BFS",
          "requiredReasonIds": [
            "queue-running-total"
          ]
        }
      ],
      "reasons": [
        {
          "id": "carry-path-sum",
          "text": "A path problem needs to carry a running sum down each root-to-leaf route, which recursion (DFS) does naturally — O(n)."
        },
        {
          "id": "per-level-work",
          "text": "The work is defined per level, so a breadth-first queue is the fit.",
          "contradictory": true
        },
        {
          "id": "need-heap",
          "text": "You must keep a heap of partial sums to solve it.",
          "contradictory": true
        },
        {
          "id": "queue-running-total",
          "text": "Queue pairs (node, running total), update the maximum at leaves, and pass the extended total to children. This also visits each node once."
        }
      ],
      "acceptableApproachIds": [
        "tree-dfs",
        "tree-bfs"
      ],
      "modelExplanation": "DFS carries path totals with O(h) frames; BFS carrying (node,total) is also correct, using O(w) frontier storage. Both take O(n) time.",
      "alternatives": []
    }
  },
  {
    "id": "pat-tbfs-fix-1",
    "kind": "fix-mistake",
    "prompt": "level_order(root) should group values by depth. The starter emits one group for each node, splitting siblings into separate groups. Save the current level size and process that many nodes together.",
    "starterCode": "from collections import deque\ndef level_order(root):\n    if not root:\n        return []\n    res = []\n    q = deque([root])\n    while q:\n        level = []\n        node = q.popleft()\n        level.append(node.val)\n        if node.left: q.append(node.left)\n        if node.right: q.append(node.right)\n        res.append(level)\n    return res",
    "expected": "from collections import deque\ndef level_order(root):\n    if not root:\n        return []\n    res = []\n    q = deque([root])\n    while q:\n        level = []\n        for _ in range(len(q)):\n            node = q.popleft()\n            level.append(node.val)\n            if node.left: q.append(node.left)\n            if node.right: q.append(node.right)\n        res.append(level)\n    return res",
    "hints": [
      "Siblings should appear in the same output group.",
      "The starter removes one node per outer round and therefore creates one group per node.",
      "At a round’s beginning the queue contains exactly the next whole level.",
      "Save its size before adding children, then remove that many nodes.",
      "while q: level=[]; for _ in range(len(q)): remove node, record value, append children; append level.",
      "range(len(q)) evaluates its length once, isolating the current level even while children are appended."
    ],
    "tests": "class _T:\n    def __init__(self, val, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\nroot = _T(1, _T(2, _T(4), None), _T(3, None, _T(5)))\nassert level_order(root) == [[1], [2, 3], [4, 5]], 'grouped by depth, not flattened'\nassert level_order(None) == []\nassert level_order(_T(7)) == [[7]]\nassert level_order(_T(1, _T(2, _T(3)))) == [[1], [2], [3]], 'left-skewed, one node per level'\nprint('OK')"
  }
],

  references: [
  {
    "url": "https://opendatastructures.org/ods-python/12_3_Graph_Traversal.html",
    "title": "Open Data Structures: graph traversal",
    "section": "12.3.1 BFS; 12.3.2 DFS; Figures 12.4–12.5",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "BFS discovers reachable vertices in distance order.",
      "DFS records visited vertices before recursion."
    ],
    "conventions": [],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/196a95604877d326c6586e60477b59d4_MIT6_006S20_lec9.pdf",
    "title": "MIT 6.006 Lecture 9: BFS",
    "section": "Pages 1–4: representations, shortest paths, BFS",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "Undirected adjacency stores both directions.",
      "A path length counts edges."
    ],
    "conventions": [
      "App may use -1 for unreachable distances instead of infinity."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "a46d8158f33e2625",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
