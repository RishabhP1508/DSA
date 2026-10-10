/**
 * Lesson: Tree height and depth (Trees and tries). Verified on CPython 3.14.
 * Output: "3\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

root = TreeNode(5, TreeNode(3, TreeNode(2), TreeNode(4)),
                   TreeNode(8, TreeNode(7), TreeNode(9)))

# Height = longest path from a node down to a leaf (in node counts here).
def height(node):
    if node is None:          # an empty tree has height 0
        return 0
    return 1 + max(height(node.left), height(node.right))

print(height(root))`;

export const treeHeightDepth: LessonDefinition = {
  id: "tree-height-depth",
  title: "Tree Height and Depth",
  area: "Trees and tries",
  prerequisites: ["tree-dfs"],

  explanation: "**Depth** counts edges from the root: the root has depth 0 and each child has one more. **Height** has two common conventions. This function counts nodes on the longest downward path, so an empty tree has height 0 and a leaf has height 1. An edge-count height would give a nonempty tree one less; do not mix them.\n\nCompute node-count height by postorder recursion: ask both children for their heights, take the larger and add one for the current node. Every node is examined, so time is O(n). At most h active calls lie on one root-to-leaf path, so auxiliary space is O(h), excluding the input tree. A balanced tree has h = O(log n); a chain has h = n. The empty base case also makes missing children work naturally.",

  vocabulary: [
  {
    "term": "Depth (of a node)",
    "definition": "Distance from the root; the root has depth 0."
  },
  {
    "term": "Height (of a node)",
    "definition": "Here: number of nodes on the longest downward path; a leaf has height 1 and an empty tree height 0."
  },
  {
    "term": "Height (of a tree)",
    "definition": "Here: number of nodes on the longest downward path; a leaf has height 1 and an empty tree height 0."
  },
  {
    "term": "Balanced",
    "definition": "Height stays near log n (subtree heights differ little)."
  },
  {
    "term": "Skewed / degenerate",
    "definition": "Height grows toward n (list-like)."
  }
],

  concepts: {
  "purpose": "Measure tree height/depth — the quantity that governs DFS and BST operation costs.",
  "operations": "Recursively: height(node) = 1 + max(height(left), height(right)); empty = 0.",
  "uses": "Analysing DFS/BST cost, checking balance, minimum depth, diameter, level counts.",
  "tradeoffs": "O(n) to compute; height is a property you often need before choosing algorithms.",
  "commonMistakes": "Confusing height (from a node down) with depth (from the root down); off-by-one between counting nodes vs edges; forgetting the empty-tree base case.",
  "edgeCases": "Empty tree height 0; leaf height 1; root depth 0. A chain of n nodes has height n and deepest depth n−1."
},

  complexity: [
    { operation: "height(root)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(h)", note: "Visits every node once; recursion stack = height h." },
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
      "meaning": "the tree height (recursion depth)"
    }
  ],
  "costModel": "Each node's height is computed once from its children's heights with O(1) work (a max and an add).",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The recursion visits every node exactly once, combining its two children's heights in O(1) — so computing the tree's height is O(n). There is no way to do better: you must inspect every node to know the longest path could not go through an unvisited one."
  },
  "space": {
    "bound": "O(h)",
    "case": "worst",
    "explanation": "The only extra memory is the recursion stack, whose depth equals the current path length — bounded by the height h (O(log n) balanced, O(n) skewed).",
    "inputOutputNote": "The tree of n nodes is the input; the O(h) recursion stack is the working space."
  },
  "derivation": [
    {
      "lines": [
        12,
        13
      ],
      "description": "Base case at empty subtrees — O(1) each.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        14
      ],
      "description": "Each node combines child heights in O(1); n nodes → O(n).",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        14
      ],
      "description": "Recursion depth reaches the height h.",
      "cost": "O(h)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "max and addition are O(1).",
    "Recursion reaches depth h.",
    "Height h uses the node-count convention; depth uses edges. A proper tree is assumed and recursion must fit the runtime limit."
  ],
  "tradeoffs": "An iterative BFS level-count also computes height in O(n) but uses O(w) queue space instead of O(h) stack space; for minimum depth, BFS can stop early at the first leaf.",
  "counters": [
    {
      "label": "height computations",
      "definition": "executions of the combine step (line 14)",
      "countLines": [
        14
      ]
    }
  ],
  "fixedDataNote": "This run returns height 3 for a 7-node balanced tree. The O(n) time / O(h) space bounds generalise to any tree.",
  "references": [
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
    },
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
    { line: 7, executable: true, explanation: "Build a 3-level tree." },
    { line: 8, executable: true, explanation: "Right subtree." },
    { line: 9, executable: false, explanation: "Blank line." },
    { line: 10, executable: false, explanation: "Comment: height is the longest downward path." },
    { line: 11, executable: true, explanation: "Define recursive height(node)." },
    { line: 12, executable: true, explanation: "Base case: an empty subtree has height 0." },
    { line: 13, executable: true, explanation: "Return 0 for None." },
    { line: 14, executable: true, explanation: "Otherwise 1 plus the taller of the two children (postorder combine)." },
    { line: 15, executable: false, explanation: "Blank line." },
    { line: 16, executable: true, explanation: "height(root) → 3." },
  ],

  bindings: [
    { variable: "root", model: "tree", overlays: [{ role: "pointer", label: "node", source: "node" }] },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Earlier lessons said DFS/BST are 'O(h)'. What is h, and what makes it O(log n) vs O(n)?", answer: "h is the tree's height (longest root-to-leaf path). It's ~log n when the tree is balanced and grows to n when the tree is skewed/degenerate.", explanation: "Height directly sets the recursion/path length that DFS and BST search traverse. Balance keeps height logarithmic; a list-like tree makes it linear, which is why balancing matters." },
  ],

  experiments: [
    "Build a skewed chain and confirm height grows to the number of nodes.",
    "Compute minimum depth (nearest leaf) and compare with height.",
    "Add a node and see whether the tree's height changes.",
  ],

  exercises: [
    {
      id: "height-complete-1",
      kind: "complete-code",
      prompt: "Complete the recursive tree-height function.",
      starterCode: "def height(node):\n    if node is None:\n        return 0\n    # TODO: 1 + the taller child's height\n    pass",
      expected: "def height(node):\n    if node is None:\n        return 0\n    return 1 + max(height(node.left), height(node.right))",
      hints: ["Combine the children's heights.", "Take the larger one and add 1 for this node.", "return 1 + max(height(node.left), height(node.right))"],
    },
    {
      id: "height-predict-1",
      kind: "predict-state",
      prompt: "What is the height of a completely balanced binary tree with n nodes, and why does it matter?",
      expected: "About log2(n). It matters because DFS stack space and BST operation time are O(h), so a balanced (log n) height keeps them efficient.",
      hints: ["A balanced tree roughly doubles nodes per level.", "So height ≈ log2(n).", "O(h) operations become O(log n)."],
    },
  ],

  review: "Depth counts edges from the root, so root depth is zero. This height function counts nodes on the longest downward path: an empty tree has height zero and a leaf has height one. Its postorder formula is 1 + max(left, right), taking O(n) time and O(h) recursive frames. An edge-count height convention would assign a leaf zero; state the convention before comparing values.",

  expectedOutput: "3\n",

  references: [
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
  },
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
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "de8d80b85bdfbdb2",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
