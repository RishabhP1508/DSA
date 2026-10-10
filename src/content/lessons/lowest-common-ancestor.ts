/**
 * Lesson: Lowest common ancestor (Trees and tries). Verified on CPython 3.14.
 * Output: "3\n5\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

root = TreeNode(5, TreeNode(3, TreeNode(2), TreeNode(4)),
                   TreeNode(8, TreeNode(7), TreeNode(9)))

# LCA in a BST: the first node where p and q split to different sides.
def lca_bst(root, p, q):
    while root:
        if p < root.val and q < root.val:
            root = root.left       # both smaller -> go left
        elif p > root.val and q > root.val:
            root = root.right      # both larger -> go right
        else:
            return root.val        # they diverge here -> this is the LCA
    return None

print(lca_bst(root, 2, 4))
print(lca_bst(root, 2, 9))`;

export const lowestCommonAncestor: LessonDefinition = {
  id: "lowest-common-ancestor",
  title: "Lowest Common Ancestor",
  area: "Trees and tries",
  prerequisites: ["bst-operations"],

  explanation: "The **lowest common ancestor (LCA)** is the deepest node that is an ancestor of both targets, allowing a node to be its own ancestor. This example assumes a BST with unique keys and that both target values are present.\n\nIf both values are smaller than the current key, their LCA is in the left subtree; if both are larger, go right. Otherwise they split across the current node, or one target equals it, so this node is the LCA. A missing target violates the precondition: a split point can still be returned and is not proof that both values occur.\n\nThe iterative walk takes O(h) worst-case time and O(1) working space. Balanced height gives O(log n); a chain can require O(n). In a plain binary tree, comparisons cannot select a subtree: a DFS can search both sides and combine where the targets appear, taking O(n) time and O(h) frames when both targets are known to exist.",

  vocabulary: [
    { term: "Lowest common ancestor (LCA)", definition: "The deepest node that is an ancestor of both target nodes." },
    { term: "Split point", definition: "The node where the two targets go to different subtrees — the LCA in a BST." },
    { term: "Ancestor", definition: "A node on the path from the root down to a given node." },
    { term: "BST shortcut", definition: "Use value comparisons to descend directly to the split point in O(h)." },
    { term: "General-tree LCA", definition: "Recurse; a node is the LCA if the targets appear in different subtrees — O(n)." },
  ],

  concepts: {
  "purpose": "Find where two nodes' root paths meet — the basis of distance and ancestry queries.",
  "operations": "BST: descend by comparison until p and q split. General tree: recurse and combine subtree results.",
  "uses": "Distance between nodes, common-ancestor queries, tree-based range problems.",
  "tradeoffs": "BST LCA is O(h) using the ordering; general-tree LCA is O(n); preprocessing (binary lifting) gives O(log n) per query after O(n log n) setup.",
  "commonMistakes": "Using the BST shortcut on a non-BST (invalid); wrong comparison direction; not handling the case where one node equals the current node.",
  "edgeCases": "Both target values must exist in a BST with unique keys. A node is its own ancestor, so if p == q the LCA is that node. The split-point algorithm does not validate target membership."
},

  complexity: [
  {
    "operation": "LCA in a BST",
    "best": "O(1)",
    "worst": "O(n)",
    "space": "O(1)",
    "note": "O(h) single-path descent; logarithmic when balanced, linear on a chain. No balance or random-input guarantee is supplied."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of nodes"
    },
    {
      "symbol": "h",
      "meaning": "the tree height"
    }
  ],
  "costModel": "Each step is one O(1) pair of comparisons that moves down one level.",
  "time": {
    "bound": "O(h)",
    "case": "worst",
    "explanation": "In a BST, LCA descends a single path: at each node two comparisons decide to go left, go right, or stop at the split — so the number of steps is the path length, bounded by the height h. Balanced → O(log n); degenerate → O(n). (For a general binary tree without ordering, you cannot prune, so LCA is O(n): you may examine every node.)",
    "otherCases": [
      {
        "case": "best",
        "bound": "O(1)",
        "note": "The targets split at the root."
      },
      {
        "case": "worst",
        "bound": "O(n)",
        "note": "A degenerate BST (height n), or a general-tree LCA."
      }
    ]
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "The iterative BST version keeps only the current node pointer — O(1). (A recursive general-tree LCA uses O(h) stack.)",
    "inputOutputNote": "The tree of n nodes is the input; the iterative walk uses O(1) extra space."
  },
  "derivation": [
    {
      "lines": [
        12
      ],
      "description": "Descend the tree one level per loop iteration.",
      "cost": "O(h)",
      "dimension": "time"
    },
    {
      "lines": [
        13,
        14,
        15,
        16,
        17,
        18
      ],
      "description": "Two O(1) comparisons decide direction or detect the split.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        12
      ],
      "description": "Only a single pointer is stored.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Unique comparable BST keys; both target values exist.",
    "A node is its own ancestor. The app permits equal target values.",
    "The panel analyzes lca_bst, excluding sample-tree construction."
  ],
  "tradeoffs": "General-tree LCA is O(n)/O(h). For many repeated queries, binary lifting preprocesses in O(n log n) to answer each LCA in O(log n).",
  "counters": [
    {
      "label": "nodes compared",
      "definition": "executions of the first target comparison at line 13",
      "countLines": [
        13
      ]
    }
  ],
  "fixedDataNote": "This run finds LCA(2,4)=3 and LCA(2,9)=5. The O(h) bound generalises: balanced trees give O(log n), degenerate O(n).",
  "references": [
    {
      "url": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
      "title": "LeetCode: BST lowest common ancestor",
      "section": "Definition, examples 1–2, constraints",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "A node is its own ancestor.",
        "Targets exist and keys are unique."
      ],
      "conventions": [
        "App additionally permits p == q."
      ],
      "accessDate": "2026-10-10"
    },
    {
      "url": "https://opendatastructures.org/ods-python/6_2_BinarySearchTree_Unbala.html",
      "title": "Open Data Structures: unbalanced BST",
      "section": "6.2.1 searching; 6.2.2 addition; 6.2.4 summary; Figures 6.5–6.7",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "A search follows one root-to-leaf path.",
        "Unbalanced height can be linear."
      ],
      "conventions": [
        "Source rejects duplicate keys; this insertion example sends equal keys right."
      ],
      "accessDate": "2026-10-10"
    }
  ]
},

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Define TreeNode." },
    { line: 2, executable: true, explanation: "Constructor." },
    { line: 3, executable: true, explanation: "Value." },
    { line: 4, executable: true, explanation: "Left child." },
    { line: 5, executable: true, explanation: "Right child." },
    { line: 6, executable: false, explanation: "Blank line." },
    { line: 7, executable: true, explanation: "Build a BST." },
    { line: 8, executable: true, explanation: "Right subtree." },
    { line: 9, executable: false, explanation: "Blank line." },
    { line: 10, executable: false, explanation: "Comment: the LCA is the first split point." },
    { line: 11, executable: true, explanation: "Define lca_bst(root, p, q)." },
    { line: 12, executable: true, explanation: "Descend while there is a node." },
    { line: 13, executable: true, explanation: "If both targets are smaller than the current value..." },
    { line: 14, executable: true, explanation: "...the LCA is in the left subtree." },
    { line: 15, executable: true, explanation: "If both are larger..." },
    { line: 16, executable: true, explanation: "...go right." },
    { line: 17, executable: false, explanation: "Otherwise they diverge here." },
    { line: 18, executable: true, explanation: "This node is the lowest common ancestor." },
    { line: 19, executable: true, explanation: "Return None if not found (shouldn't happen for valid inputs)." },
    { line: 20, executable: false, explanation: "Blank line." },
    { line: 21, executable: true, explanation: "LCA(2, 4): they split at node 3." },
    { line: 22, executable: true, explanation: "LCA(2, 9): they split at the root, 5." },
  ],

  bindings: [
    { variable: "root", model: "tree", overlays: [{ role: "pointer", label: "node", source: "root" }] },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why does the BST LCA run in O(h), but LCA in a GENERAL binary tree is O(n)?", answer: "In a BST, value comparisons let you descend one path (pruning the other subtree) — O(h). A general tree has no ordering, so you can't prune; you may have to search the whole tree — O(n).", explanation: "The ordering is what enables the single-path descent. Without it, both subtrees might contain a target, forcing a full traversal, hence O(n)." },
  ],

  experiments: [
    "Find LCA(7, 9) and confirm it's 8.",
    "Find LCA where one node is an ancestor of the other and see the ancestor returned.",
    "Sketch the general-tree recursive LCA and note why it's O(n).",
  ],

  exercises: [
  {
    "id": "lca-complete-1",
    "kind": "complete-code",
    "prompt": "Complete the BST LCA descent. Assume unique BST keys and that both targets exist; returning a split point does not validate membership.",
    "starterCode": "def lca_bst(root, p, q):\n    while root:\n        if p < root.val and q < root.val:\n            root = root.left\n        elif p > root.val and q > root.val:\n            root = root.right\n        else:\n            # TODO: return the split node's value\n            pass",
    "expected": "def lca_bst(root, p, q):\n    while root:\n        if p < root.val and q < root.val:\n            root = root.left\n        elif p > root.val and q > root.val:\n            root = root.right\n        else:\n            return root.val",
    "hints": [
      "Goal: find the lowest common ancestor of p and q in a BST by descending.",
      "You avoid storing paths by using the BST ordering to descend directly.",
      "Key insight: the LCA is the first node where p and q fall on different sides (or one equals the node).",
      "Approach: go left when both are smaller, right when both are larger, else you're at the split.",
      "Pseudocode: while root: if both < root go left; elif both > root go right; else return root.",
      "In the else branch (the divergence point) `return root.val`."
    ],
    "tests": "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n# BST: 6 -> (2 -> 0,4) , (8 -> 7,9)\nroot = TreeNode(6, TreeNode(2, TreeNode(0), TreeNode(4)), TreeNode(8, TreeNode(7), TreeNode(9)))\nassert lca_bst(root, 0, 4) == 2, 'split at 2'\nassert lca_bst(root, 7, 9) == 8, 'split at 8'\nassert lca_bst(root, 0, 9) == 6, 'split at the root'\nassert lca_bst(root, 2, 4) == 2, 'ancestor is one of the nodes'\nassert lca_bst(root, 7, 8) == 8, 'q equals a node on the path'\nprint('OK')"
  },
  {
    "id": "lca-choose-1",
    "kind": "choose-approach",
    "prompt": "You must find the LCA in a plain binary tree (no BST ordering). What approach do you use, and what is its complexity?",
    "expected": "A recursive DFS: return a node if it equals p or q, or if p and q are found in different subtrees (that node is the LCA). It is O(n) time and O(h) stack space, since without ordering you can't prune.",
    "hints": [
      "Goal: find the LCA of two nodes in a plain binary tree with NO BST ordering, and give the complexity.",
      "The missing shortcut is BST ordering: without it you cannot use value comparisons to prune a branch.",
      "Key property: the LCA is the node where the two targets first lie in different subtrees (or that equals one target).",
      "Approach: use a recursive DFS that returns a target when found and combines results from both subtrees.",
      "Reasoning: a node is the LCA if p and q are found in its different subtrees, or if it is one of them; because nothing can be pruned, it costs O(n) time and O(h) recursion-stack space.",
      "Answer: a recursive DFS returning a node when it equals p or q, or when p and q appear in different subtrees — O(n) time, O(h) stack, since no ordering allows pruning."
    ],
    "recognition": {
      "scenario": "You must find the lowest common ancestor of two nodes in a plain binary tree that has NO BST ordering.",
      "approaches": [
        {
          "id": "recursive-dfs",
          "label": "Recursive DFS returning where p and q are found",
          "requiredReasonIds": [
            "no-order-cant-prune"
          ]
        },
        {
          "id": "bst-value-walk",
          "label": "Walk down comparing node values to decide direction (BST LCA)",
          "requiredReasonIds": [],
          "rejectionFeedback": "Comparing values to pick a direction only works when the tree is a BST; a plain tree has no ordering to steer the walk, so this gives wrong answers."
        }
      ],
      "reasons": [
        {
          "id": "no-order-cant-prune",
          "text": "Without ordering you cannot prune a side, so a DFS searches both subtrees and returns the node where p and q surface from different sides — O(n) time, O(h) stack."
        },
        {
          "id": "order-lets-prune",
          "text": "The tree's ordering lets you discard one subtree at each node, giving O(log n).",
          "contradictory": true
        },
        {
          "id": "lca-needs-parent-pointers",
          "text": "Finding the LCA is impossible without parent pointers on every node.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "recursive-dfs"
      ],
      "modelExplanation": "Use a recursive DFS: return a node if it equals p or q, or if p and q are found in different subtrees. It is O(n) time and O(h) stack space, since without ordering you cannot prune."
    }
  }
],

  review: "With unique BST keys and both targets present, compare both with the current key: follow their common side or return their first split/equality node. This O(h) walk does not validate target membership. A node is its own ancestor. Without BST ordering use a tree DFS.",

  expectedOutput: "3\n5\n",

  references: [
  {
    "url": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    "title": "LeetCode: BST lowest common ancestor",
    "section": "Definition, examples 1–2, constraints",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "A node is its own ancestor.",
      "Targets exist and keys are unique."
    ],
    "conventions": [
      "App additionally permits p == q."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://opendatastructures.org/ods-python/6_2_BinarySearchTree_Unbala.html",
    "title": "Open Data Structures: unbalanced BST",
    "section": "6.2.1 searching; 6.2.2 addition; 6.2.4 summary; Figures 6.5–6.7",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "A search follows one root-to-leaf path.",
      "Unbalanced height can be linear."
    ],
    "conventions": [
      "Source rejects duplicate keys; this insertion example sends equal keys right."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "335ee763bc93066d",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
