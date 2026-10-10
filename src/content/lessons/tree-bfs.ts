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

  explanation: "**Tree BFS** visits nodes in increasing depth using a FIFO queue. Remove one node, record it, then append its left and right children. On the example the order is 5, 3, 8, 2, 4, 7, 9. A proper tree needs no visited set because every non-root node has exactly one parent.\n\nTo group levels, save the queue's size at the start of each outer iteration and remove exactly that many nodes. Their children belong to the next level. During that iteration the queue can contain the remaining current level and some of the next level together; it does not always hold exactly one level. If w is the largest level size, its length is at most 2w, so auxiliary queue space is O(w). Every node is enqueued and removed once, giving O(n) time. The returned values need O(n) output storage.\n\nUse BFS for level output, per-depth aggregates and the first leaf at minimum depth. DFS with depth buckets is also valid for many level tasks. Python deque.popleft avoids the O(n) shifting cost of list.pop(0).",

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
  {
    "operation": "BFS traversal",
    "best": "O(n)",
    "average": "O(n)",
    "worst": "O(n)",
    "space": "O(w)",
    "note": "Each node is handled once. A queue may mix two adjacent levels; its size is O(w)."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of nodes in the tree"
    },
    {
      "symbol": "w",
      "meaning": "the maximum width (most nodes on any single level)"
    }
  ],
  "costModel": "deque.popleft/append are O(1); each node is enqueued and dequeued exactly once.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "Each node is enqueued once (when discovered as a child) and dequeued once (when processed), doing O(1) work each time — so BFS touches every node exactly once, giving O(n). No node is revisited because a tree has no cycles."
  },
  "space": {
    "bound": "O(w)",
    "case": "worst",
    "explanation": "The queue can mix two adjacent levels. Their combined size is at most 2w, so it occupies O(w), excluding the O(n) output list.",
    "inputOutputNote": "The input tree and n returned values are excluded; the queue is O(w) auxiliary storage."
  },
  "derivation": [
    {
      "lines": [
        19
      ],
      "description": "Each node is dequeued exactly once — O(n) total.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        21,
        22,
        23
      ],
      "description": "Enqueuing each child is O(1); each node enqueued once.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        18,
        22,
        23
      ],
      "description": "The queue holds parts of at most two adjacent levels, using O(w).",
      "cost": "O(w)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "A proper finite binary tree with no shared children or cycles.",
    "deque append/popleft are O(1); w is the maximum number of nodes at one depth."
  ],
  "tradeoffs": "DFS uses O(h) stack space (height) and goes deep; BFS uses O(w) queue space (width) and goes by level. Pick based on whether depth or level matters — and note w can be O(n) for wide balanced trees.",
  "counters": [
    {
      "label": "nodes dequeued",
      "definition": "executions of the dequeue (line 19)",
      "countLines": [
        19
      ]
    }
  ],
  "fixedDataNote": "This run visits 7 nodes in level order → [5,3,8,2,4,7,9]; the max width here is 4 (bottom level). The O(n)/O(w) bounds generalise.",
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
  {
    "variable": "root",
    "model": "tree"
  },
  {
    "variable": "out",
    "model": "array"
  },
  {
    "variable": "q",
    "model": "queue"
  }
],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "DFS space is O(h) (height). Why is BFS space O(w) (width), and when is that worse?",
    "answer": "O(w)",
    "explanation": "It can contain parts of two adjacent levels at once, at most 2w nodes. The asymptotic bound is O(w)."
  }
],

  experiments: [
  "Process the queue one level-size at a time to group nodes by level.",
  "Record the largest queue length on an uneven tree. Compare it with each level width; the queue can temporarily mix adjacent levels.",
  "Build a degenerate chain and confirm the queue never holds more than one node."
],

  exercises: [
  {
    "id": "bfs-complete-1",
    "kind": "complete-code",
    "prompt": "Modify BFS to return a list of levels (list of lists).",
    "starterCode": "from collections import deque\ndef levels(root):\n    if not root:\n        return []\n    out = []\n    q = deque([root])\n    while q:\n        size = len(q)\n        level = []\n        # TODO: process exactly `size` nodes for this level\n        out.append(level)\n    return out",
    "expected": "from collections import deque\ndef levels(root):\n    if not root:\n        return []\n    out = []\n    q = deque([root])\n    while q:\n        size = len(q)\n        level = []\n        for _ in range(size):\n            node = q.popleft()\n            level.append(node.val)\n            if node.left: q.append(node.left)\n            if node.right: q.append(node.right)\n        out.append(level)\n    return out",
    "hints": [
      "Goal: return the tree's values grouped level by level as a list of lists.",
      "Mixing levels is the pitfall; you must know each level's boundary before dequeuing.",
      "Key insight: the queue length at the start of a round equals the number of nodes on that level.",
      "Approach: BFS by rounds, snapshotting the queue size and processing exactly that many nodes.",
      "Pseudocode: while queue: size = len(queue); collect that many nodes into a level list, enqueueing children; append the level.",
      "Snapshot `size = len(q)`, loop that many times appending `node.val` and enqueuing children, then append the level list."
    ],
    "tests": "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\nassert levels(None) == [], 'empty tree -> no levels'\nassert levels(TreeNode(1)) == [[1]], 'single node -> one level'\nroot = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))\nassert levels(root) == [[1], [2, 3], [4, 5]], f'level order wrong, got {levels(root)}'\nprint('OK')"
  },
  {
    "id": "bfs-choose-1",
    "kind": "choose-approach",
    "prompt": "You need the value of the rightmost node at each depth ('right side view'). BFS or DFS, and why?",
    "expected": "BFS by levels: process each level and take its last node — level order makes 'per depth' natural. (A DFS tracking depth also works, visiting right child first.) BFS is the intuitive fit because the problem is defined per level.",
    "hints": [
      "Goal: report the rightmost node value at each depth of a binary tree (the 'right side view'), choosing BFS or DFS.",
      "The clumsy framing is a plain DFS with no notion of levels, which doesn't naturally group nodes by depth.",
      "Key property: the problem is defined PER LEVEL, and level-order processing exposes each depth's nodes together.",
      "Approach: run BFS level by level and take the last node of each level.",
      "Reasoning: BFS processes one depth at a time, so the final node per level is the right-side view; a depth-tracking DFS that visits the right child first also works but BFS matches the per-level definition most directly.",
      "Answer: BFS by levels — process each level and take its last node (a right-first depth-tracking DFS also works)."
    ],
    "recognition": {
      "scenario": "You must report, for each depth of a binary tree, the value of its rightmost node (the 'right side view').",
      "approaches": [
        {
          "id": "level-bfs",
          "label": "Level-order BFS, taking the last node of each level",
          "requiredReasonIds": [
            "per-level-natural"
          ]
        },
        {
          "id": "depth-dfs",
          "label": "Depth-tracking DFS visiting the right child first",
          "requiredReasonIds": [
            "dfs-depth-right-first"
          ]
        },
        {
          "id": "inorder-dfs",
          "label": "Plain inorder DFS collecting values in order",
          "requiredReasonIds": [],
          "rejectionFeedback": "Inorder traversal visits nodes left-to-right across the whole tree without tracking depth, so it cannot pick out the rightmost node at each level."
        }
      ],
      "reasons": [
        {
          "id": "per-level-natural",
          "text": "The answer is defined per depth, and BFS processes the tree one full level at a time, so the last node dequeued on each level is exactly the rightmost at that depth."
        },
        {
          "id": "dfs-depth-right-first",
          "text": "A DFS that records a node the first time it reaches a new depth, visiting the right child before the left, captures each level's rightmost node in O(n)."
        },
        {
          "id": "sides-irrelevant-depth",
          "text": "The problem does not depend on depth, so any traversal order gives the same answer.",
          "contradictory": true
        },
        {
          "id": "bfs-no-levels",
          "text": "BFS cannot tell which level a node is on, so it is unsuitable here.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "level-bfs"
      ],
      "alternatives": [
        {
          "approachId": "depth-dfs",
          "conditions": "A DFS that tracks the current depth and visits the right child first.",
          "tradeoff": "Equally O(n) but the per-level framing is less direct than BFS's natural level order.",
          "requiredReasonIds": [
            "dfs-depth-right-first"
          ]
        }
      ],
      "modelExplanation": "BFS by levels is the intuitive fit: process each level and take its last node. A depth-tracking DFS that visits the right child first also works."
    }
  }
],

  review: `**Tree BFS / level order** uses a **FIFO queue** to visit nodes level by level: dequeue, record, enqueue children (no visited set needed for trees). It is **O(n)** time and **O(w)** space, where w is the maximum **width** — which can be O(n) for wide balanced trees, unlike DFS's O(h). Processing the queue one level-size at a time gives level grouping for problems like right-side view and level averages.`,

  expectedOutput: "[5, 3, 8, 2, 4, 7, 9]\n",

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
    contentHash: "e719eba1228698e7",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
