/**
 * Lesson: Tree traversals (Trees and tries). Verified on CPython 3.14.
 * Output: "[5, 3, 2, 4, 8, 7, 9]\n[2, 3, 4, 5, 7, 8, 9]\n[2, 4, 3, 7, 9, 8, 5]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

root = TreeNode(5, TreeNode(3, TreeNode(2), TreeNode(4)),
                   TreeNode(8, TreeNode(7), TreeNode(9)))

# The three DFS orders differ only in WHERE we visit the node.
def preorder(n, out):
    if n:
        out.append(n.val); preorder(n.left, out); preorder(n.right, out)   # node first
def inorder(n, out):
    if n:
        inorder(n.left, out); out.append(n.val); inorder(n.right, out)     # node in the middle
def postorder(n, out):
    if n:
        postorder(n.left, out); postorder(n.right, out); out.append(n.val) # node last

pre, ino, post = [], [], []
preorder(root, pre); inorder(root, ino); postorder(root, post)
print(pre)
print(ino)
print(post)`;

export const treeTraversals: LessonDefinition = {
  id: "tree-traversals",
  title: "Tree Traversals (Pre / In / Post-order)",
  area: "Trees and tries",
  prerequisites: ["tree-dfs"],

  explanation: `The three classic **depth-first traversals** differ by only one thing: **when you visit the node** relative to recursing into its children. **Preorder** visits the node *before* its subtrees (node, left, right). **Inorder** visits it *between* them (left, node, right). **Postorder** visits it *after* both (left, right, node). Same recursion skeleton — just move the "visit" line.

Each order has a signature use. **Inorder on a binary search tree yields the values in sorted order** — here it prints \`2 3 4 5 7 8 9\`, ascending, which is a powerful BST property. **Preorder** captures a node before its descendants, making it natural for **copying/serializing** a tree (you record a parent before its children). **Postorder** processes children before the parent, which is exactly what you need to **compute a value from subtrees first** — deleting a tree, evaluating an expression tree, or summing subtree sizes.

All three are **O(n)** time (every node visited once) and **O(h)** space (recursion stack = height). Recognizing which order a problem wants — "sorted output? inorder. parent-before-children? preorder. children-before-parent? postorder." — is the practical skill this lesson builds.`,

  vocabulary: [
    { term: "Preorder", definition: "Visit node, then left subtree, then right (node first)." },
    { term: "Inorder", definition: "Visit left subtree, then node, then right; yields sorted order on a BST." },
    { term: "Postorder", definition: "Visit left, then right, then node (node last); processes children before parent." },
    { term: "Visit position", definition: "Where the node is recorded relative to its recursive calls — the only difference between the three." },
    { term: "BST sorted property", definition: "Inorder traversal of a binary search tree produces ascending values." },
  ],

  concepts: {
    purpose: "Produce different node orderings from the same DFS by moving the visit step.",
    operations: "Recurse with the visit before (pre), between (in), or after (post) the child calls.",
    uses: "Inorder for sorted BST output; preorder for copy/serialize; postorder for subtree-first computation.",
    tradeoffs: "All O(n)/O(h); the order you pick must match what the problem needs.",
    commonMistakes: "Using the wrong order for the task; expecting inorder to be sorted on a non-BST; missing the None base case.",
    edgeCases: "Empty tree yields []. A single node gives the same one-element list in all three orders. Inorder is sorted only when the tree is a valid BST.",
  },

  complexity: [
    { operation: "Any DFS traversal", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(h)", note: "Each node visited once; recursion stack = height h." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of nodes" },
      { symbol: "h", meaning: "the tree height (recursion depth)" },
    ],
    costModel: "Each traversal visits every node exactly once with O(1) work; the recursion stack holds one frame per level of the current path.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "Each of preorder/inorder/postorder recurses once per node and does constant work at the visit, so each traversal is O(n). Moving the visit line changes the ORDER of output, not the amount of work — all three touch every node once.",
    },
    space: {
      bound: "O(h)",
      case: "worst",
      explanation: "The recursion stack depth equals the current path length, bounded by the height h (O(log n) balanced, O(n) degenerate). Output lists are O(n) but are the required results, not auxiliary working space.",
      inputOutputNote: "The three output lists are O(n) results; the O(h) recursion stack is the working space.",
    },
    derivation: [
      { lines: [12, 13, 14], description: "Preorder visits each node once and recurses into both children.", cost: "O(n)", dimension: "time" },
      { lines: [15, 16, 17, 18, 19, 20], description: "Inorder and postorder do the same visits in a different position.", cost: "O(n)", dimension: "time" },
      { lines: [13, 16, 19], description: "Recursion depth reaches the height h.", cost: "O(h)", dimension: "space" },
    ],
    assumptions: ["Visiting (append) is O(1).", "Recursion reaches depth h."],
    tradeoffs: "Iterative versions with an explicit stack avoid recursion limits but keep O(h) space; Morris traversal achieves O(1) space at the cost of temporarily mutating the tree.",
    counters: [{ label: "preorder visits", definition: "executions of the preorder visit (line 13)", countLines: [13] }],
    fixedDataNote: "This run traverses 7 nodes three ways. Inorder yields sorted [2,3,4,5,7,8,9] because the tree is a BST. The O(n)/O(h) bounds generalise.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Define TreeNode." },
    { line: 2, executable: true, explanation: "Constructor." },
    { line: 3, executable: true, explanation: "Value." },
    { line: 4, executable: true, explanation: "Left child." },
    { line: 5, executable: true, explanation: "Right child." },
    { line: 6, executable: false, explanation: "Blank line." },
    { line: 7, executable: true, explanation: "Build a BST-shaped tree." },
    { line: 8, executable: true, explanation: "Right subtree." },
    { line: 9, executable: false, explanation: "Blank line." },
    { line: 10, executable: false, explanation: "Comment: the orders differ only by visit position." },
    { line: 11, executable: true, explanation: "Define preorder." },
    { line: 12, executable: true, explanation: "If the node exists (base case is the implicit else)..." },
    { line: 13, executable: true, explanation: "Preorder: visit node FIRST, then left, then right." },
    { line: 14, executable: true, explanation: "Define inorder." },
    { line: 15, executable: true, explanation: "Guard non-None." },
    { line: 16, executable: true, explanation: "Inorder: left, then visit node, then right → sorted on a BST." },
    { line: 17, executable: true, explanation: "Define postorder." },
    { line: 18, executable: true, explanation: "Guard non-None." },
    { line: 19, executable: true, explanation: "Postorder: left, right, then visit node LAST." },
    { line: 20, executable: false, explanation: "Blank line." },
    { line: 21, executable: true, explanation: "Prepare three output lists." },
    { line: 22, executable: true, explanation: "Run all three traversals." },
    { line: 23, executable: true, explanation: "Preorder → [5, 3, 2, 4, 8, 7, 9]." },
    { line: 24, executable: true, explanation: "Inorder → [2, 3, 4, 5, 7, 8, 9] (sorted!)." },
    { line: 25, executable: true, explanation: "Postorder → [2, 4, 3, 7, 9, 8, 5]." },
  ],

  bindings: [
    { variable: "root", model: "tree" },
    { variable: "ino", model: "array" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Which traversal yields a binary search tree's values in sorted order, and why?", answer: "Inorder (left, node, right). In a BST every left descendant is smaller and every right descendant is larger, so visiting left before the node before right produces ascending order.", explanation: "The BST invariant (left < node < right) combined with inorder's left-node-right visiting exactly lays the values out from smallest to largest." },
  ],

  experiments: [
    "Move the visit line in each function and confirm the order changes accordingly.",
    "Build a non-BST tree and verify inorder is no longer sorted.",
    "Use postorder to compute each subtree's node count (children before parent).",
  ],

  exercises: [
    {
      id: "trav-choose-1",
      kind: "choose-approach",
      prompt: "Which traversal order fits each task: (a) print a BST's values sorted, (b) serialize a tree so a parent is recorded before its children, (c) delete/free every node safely?",
      expected: "(a) inorder — sorted BST output; (b) preorder — node before children; (c) postorder — free children before the parent so no reference is lost.",
      hints: ["Sorted output ↔ inorder.", "Parent before children ↔ preorder.", "Children before parent ↔ postorder."],
    },
    {
      id: "trav-complete-1",
      kind: "complete-code",
      prompt: "Complete an inorder traversal that appends values left, node, right.",
      starterCode: "def inorder(n, out):\n    if n:\n        # TODO: left, node, right\n        pass",
      expected: "def inorder(n, out):\n    if n:\n        inorder(n.left, out)\n        out.append(n.val)\n        inorder(n.right, out)",
      hints: ["Recurse left first.", "Visit the node in the middle.", "Then recurse right: left, append, right."],
    },
  ],

  review: `The three DFS traversals differ only by **visit position**: **preorder** (node, left, right), **inorder** (left, node, right), **postorder** (left, right, node). All are **O(n)** time and **O(h)** space. Key uses: **inorder → sorted BST output**, **preorder → copy/serialize**, **postorder → compute from subtrees first**. Matching the order to the task is the practical skill.`,

  expectedOutput: "[5, 3, 2, 4, 8, 7, 9]\n[2, 3, 4, 5, 7, 8, 9]\n[2, 4, 3, 7, 9, 8, 5]\n",

  references: [
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/Trees/TreeTraversals.html",
      title: "Tree Traversals — Problem Solving with Algorithms and DS using Python (Runestone)",
      section: "Preorder, inorder, postorder",
      topic: "trees/traversals",
      purpose: "Confirm the three traversal definitions and the inorder-yields-sorted-BST property.",
      verifiedClaims: ["Pre/in/post-order differ by visit position; inorder of a BST is sorted; all are O(n)"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 15,
    contentHash: "ab7f9858c2717e18",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
