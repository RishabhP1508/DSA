/**
 * Lesson: Tree construction (Trees and tries). Verified on CPython 3.14.
 * Output: "4 2 6\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Build a BALANCED BST from a sorted array: middle becomes the root.
def build_bst(arr):
    if not arr:
        return None
    mid = len(arr) // 2
    return TreeNode(arr[mid],
                    build_bst(arr[:mid]),      # left half -> left subtree
                    build_bst(arr[mid+1:]))    # right half -> right subtree

root = build_bst([1, 2, 3, 4, 5, 6, 7])
print(root.val, root.left.val, root.right.val)`;

export const treeConstruction: LessonDefinition = {
  id: "tree-construction",
  title: "Tree Construction",
  area: "Trees and tries",
  prerequisites: ["bst-operations", "merge-sort"],

  explanation: "To build a height-balanced BST from **strictly increasing keys**, choose the middle key as root, recursively build the keys before it as the left subtree and the keys after it as the right. The two parts differ in size by at most one, producing logarithmic height. This constructs a balanced shape once; it does not add an AVL balancing rule for later updates.\n\nThis Python version slices its list at every level. It creates n nodes, but copies O(n) key references across each of O(log n) levels: O(n log(n+1)) time. Live slices along a recursive path have geometrically decreasing total length, so their peak auxiliary storage is O(n); the recursion itself adds O(log(n+1)). The n output tree nodes are excluded from auxiliary storage. An index-bound variant avoids slicing and runs in O(n) time, but is a different implementation, not this algorithm's best case.\n\nReconstruction from inorder plus preorder/postorder is another construction task. Preorder's first key (or postorder's last key) determines the root; its position in inorder partitions the subtrees. It does not necessarily choose a middle key or produce a balanced tree, and distinct-key or duplicate-disambiguation rules are needed.",

  vocabulary: [
    { term: "Balanced construction", definition: "Building a tree whose height is ~log n by design." },
    { term: "Middle-as-root", definition: "Choosing the median element as the subtree root to split evenly." },
    { term: "Divide and conquer", definition: "Recursively building left/right subtrees from the array halves." },
    { term: "Rebuild from traversals", definition: "Reconstructing a tree from preorder+inorder (or postorder+inorder)." },
    { term: "Slicing overhead", definition: "arr[:mid] / arr[mid+1:] copy subarrays, adding cost over index-based recursion." },
  ],

  concepts: {
  "purpose": "Build trees with a desired (usually balanced) shape, or reconstruct them from traversals.",
  "operations": "Pick the middle as root; recurse on the left and right halves.",
  "uses": "Balanced BST from sorted data, rebuilding from preorder+inorder, constructing complete trees.",
  "tradeoffs": "Guarantees balance (O(log n) height) vs inserting sorted data (O(n) height); slicing copies add overhead.",
  "commonMistakes": "Off-by-one around mid (excluding/duplicating the root); slicing when index bounds would be cheaper; forgetting the empty base case.",
  "edgeCases": "Empty input returns None. Require strictly increasing keys; midpoint splitting duplicates could put an equal key on the left and conflict with the duplicate-right convention."
},

  complexity: [
  {
    "operation": "build balanced BST",
    "best": "O(n log(n+1))",
    "worst": "O(n log(n+1))",
    "space": "O(n)",
    "note": "Displayed slicing implementation; an index-bound O(n) builder is a separate variant."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements / nodes"
    },
    {
      "symbol": "h",
      "meaning": "the resulting height (~log n, balanced by construction)"
    }
  ],
  "costModel": "Creating each node is O(1). This version also slices arr[:mid] and arr[mid+1:], each copying its length.",
  "time": {
    "bound": "O(n log(n+1))",
    "case": "worst",
    "explanation": "There are n nodes to create, which alone is O(n). However, this implementation SLICES the array at each call (arr[:mid], arr[mid+1:]), and slicing copies elements. Across the ~log n levels of recursion, the total copying is O(n) per level × log n levels = O(n log n). An index-based version (passing lo/hi bounds instead of slices) avoids the copies and builds the tree in O(n) — a good optimization to note.",
    "otherCases": []
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "Recursion has O(log(n+1)) depth, but ancestor frames retain copied list slices. The simultaneously live slice references total O(n) along a shrinking path. The n-node result is output storage and is excluded.",
    "inputOutputNote": "Exclude the supplied sorted array and the returned n-node tree. Live copied slices use O(n) auxiliary storage; total copied references over the run are O(n log(n+1))."
  },
  "derivation": [
    {
      "lines": [
        11
      ],
      "description": "Choosing the middle splits the array evenly, giving a balanced tree (height ~log n).",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        12,
        13,
        14
      ],
      "description": "Create each of the n nodes and recurse on halves.",
      "cost": "O(n log n)",
      "dimension": "time"
    },
    {
      "lines": [
        12
      ],
      "description": "The tree holds n nodes; recursion stack is O(log n).",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Input keys are strictly increasing and comparisons/indexing use constant-cost operations.",
    "Python list slicing copies key references.",
    "The panel describes the displayed slicing builder; the output tree is excluded from working storage."
  ],
  "tradeoffs": "Pass lo/hi indices instead of slices to build in O(n) time and O(log n) space. Building balanced beats inserting sorted values one-by-one (which yields an O(n)-height degenerate tree).",
  "counters": [
    {
      "label": "nodes built",
      "definition": "TreeNode constructions (line 12)",
      "countLines": [
        12
      ]
    }
  ],
  "fixedDataNote": "This run builds a balanced BST from [1..7]: root 4, left-root 2, right-root 6 → '4 2 6'. The O(n)/O(n log n) bounds depend on index-based vs slicing construction.",
  "references": [
    {
      "url": "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/",
      "title": "LeetCode: sorted array to BST",
      "section": "Description, examples, constraints",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "Input keys are strictly increasing.",
        "Output should be height balanced."
      ],
      "conventions": [
        "App accepts an empty array and uses the upper middle on even lengths."
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
    { line: 7, executable: false, explanation: "Comment: middle element becomes the root for balance." },
    { line: 8, executable: true, explanation: "Define build_bst(arr)." },
    { line: 9, executable: true, explanation: "Base case: an empty slice yields no node." },
    { line: 10, executable: true, explanation: "Return None." },
    { line: 11, executable: true, explanation: "Pick the middle index (median splits evenly → balance)." },
    { line: 12, executable: true, explanation: "Create the root from the middle value..." },
    { line: 13, executable: true, explanation: "...building the left subtree from the left half..." },
    { line: 14, executable: true, explanation: "...and the right subtree from the right half." },
    { line: 15, executable: false, explanation: "Blank line." },
    { line: 16, executable: true, explanation: "Build from the sorted array [1..7]." },
    { line: 17, executable: true, explanation: "Print root and its children → '4 2 6' (balanced)." },
  ],

  bindings: [
    { variable: "root", model: "tree" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why does picking the MIDDLE element as the root produce a balanced tree, and why not just insert the sorted values one-by-one?", answer: "The middle splits the array into equal halves at every level, so both subtrees have ~n/2 nodes and the height is ~log n. Inserting sorted values one-by-one makes each new value a right child, producing a degenerate O(n)-height chain.", explanation: "Even splits at each level keep the height logarithmic. Sequential sorted insertion never branches left, so it builds a list-like tree — the exact problem balanced construction avoids." },
  ],

  experiments: [
    "Rewrite build_bst to pass lo/hi indices instead of slicing and note it becomes O(n).",
    "Compare the height of this balanced build against inserting [1..7] one-by-one.",
    "Print an inorder traversal to confirm it reproduces the sorted array.",
  ],

  exercises: [
    {
      id: "build-choose-1",
      kind: "choose-approach",
      prompt: "You have sorted data and want a BST with O(log n) search. Should you insert values one-by-one or build from the middle? Why?",
      expected: "Build from the middle (divide and conquer): it produces a balanced O(log n)-height tree directly. Inserting sorted values one-by-one yields a degenerate O(n)-height tree, defeating the purpose.",
      hints: ["What shape does sequential sorted insertion create?", "A degenerate chain (O(n) height).", "Middle-as-root construction stays balanced."],
    },
    {
      id: "build-complete-1",
      kind: "complete-code",
      prompt: "Complete the balanced-BST builder from a sorted array.",
      starterCode: "def build_bst(arr):\n    if not arr:\n        return None\n    mid = len(arr) // 2\n    # TODO: root = middle; recurse on halves\n    pass",
      expected: "def build_bst(arr):\n    if not arr:\n        return None\n    mid = len(arr) // 2\n    return TreeNode(arr[mid], build_bst(arr[:mid]), build_bst(arr[mid+1:]))",
      hints: ["The root is arr[mid].", "Left subtree from arr[:mid], right from arr[mid+1:].", "return TreeNode(arr[mid], build_bst(arr[:mid]), build_bst(arr[mid+1:]))"],
    },
  ],

  review: "Strictly increasing keys can be made into a balanced BST by choosing the middle key and recursively splitting the two sides. This displayed Python builder uses slices: O(n log(n+1)) time and O(n) peak auxiliary slice storage, excluding the output tree. Passing index bounds is a separate O(n)-time builder with O(log(n+1)) frames. Reconstruction from preorder/inorder instead follows the supplied traversal roots and need not produce a balanced tree.",

  expectedOutput: "4 2 6\n",

  references: [
  {
    "url": "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/",
    "title": "LeetCode: sorted array to BST",
    "section": "Description, examples, constraints",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "Input keys are strictly increasing.",
      "Output should be height balanced."
    ],
    "conventions": [
      "App accepts an empty array and uses the upper middle on even lengths."
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
    contentHash: "a54955dd8b1c3402",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
