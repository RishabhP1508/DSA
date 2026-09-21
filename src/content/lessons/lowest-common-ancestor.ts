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

  explanation: `The **lowest common ancestor (LCA)** of two nodes p and q is the **deepest** node that has both of them as descendants — the point where their paths from the root diverge. It answers "where do these two nodes meet?" and underlies distance-between-nodes and many tree queries.

In a **binary search tree**, the BST ordering makes this beautifully simple. Walk down from the root: if **both** p and q are smaller than the current node, the LCA must be to the **left**; if both are larger, go **right**; the moment they fall on **different sides** (or one equals the current node), that node is the split point — the LCA. For \`p=2, q=4\` the split is at \`3\`; for \`p=2, q=9\` they diverge right at the root \`5\`.

Because it follows one root-to-leaf path, LCA-in-a-BST is **O(h)** time (O(log n) balanced, O(n) degenerate) and **O(1)** space iteratively. For a **general binary tree** (no ordering), you instead recurse and return a node if it is p/q or if p and q are found in different subtrees — that's **O(n)** because you may search the whole tree. Recognizing whether you have a BST (use the ordering shortcut) or a plain tree (recurse) is the key decision.`,

  vocabulary: [
    { term: "Lowest common ancestor (LCA)", definition: "The deepest node that is an ancestor of both target nodes." },
    { term: "Split point", definition: "The node where the two targets go to different subtrees — the LCA in a BST." },
    { term: "Ancestor", definition: "A node on the path from the root down to a given node." },
    { term: "BST shortcut", definition: "Use value comparisons to descend directly to the split point in O(h)." },
    { term: "General-tree LCA", definition: "Recurse; a node is the LCA if the targets appear in different subtrees — O(n)." },
  ],

  concepts: {
    purpose: "Find where two nodes' root paths meet — the basis of distance and ancestry queries.",
    operations: "BST: descend by comparison until p and q split. General tree: recurse and combine subtree results.",
    uses: "Distance between nodes, common-ancestor queries, tree-based range problems.",
    tradeoffs: "BST LCA is O(h) using the ordering; general-tree LCA is O(n); preprocessing (binary lifting) gives O(log n) per query after O(n log n) setup.",
    commonMistakes: "Using the BST shortcut on a non-BST (invalid); wrong comparison direction; not handling the case where one node equals the current node.",
    edgeCases: "One target is an ancestor of the other (LCA is the ancestor). Targets equal. Missing targets (return None / undefined).",
  },

  complexity: [
    { operation: "LCA in a BST", best: "O(1)", average: "O(log n)", worst: "O(n)", space: "O(1)", note: "O(h): follows one path. General tree LCA is O(n)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of nodes" },
      { symbol: "h", meaning: "the tree height" },
    ],
    costModel: "Each step is one O(1) pair of comparisons that moves down one level.",
    time: {
      bound: "O(h)",
      case: "average",
      explanation: "In a BST, LCA descends a single path: at each node two comparisons decide to go left, go right, or stop at the split — so the number of steps is the path length, bounded by the height h. Balanced → O(log n); degenerate → O(n). (For a general binary tree without ordering, you cannot prune, so LCA is O(n): you may examine every node.)",
      otherCases: [
        { case: "best", bound: "O(1)", note: "The targets split at the root." },
        { case: "worst", bound: "O(n)", note: "A degenerate BST (height n), or a general-tree LCA." },
      ],
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "The iterative BST version keeps only the current node pointer — O(1). (A recursive general-tree LCA uses O(h) stack.)",
      inputOutputNote: "The tree of n nodes is the input; the iterative walk uses O(1) extra space.",
    },
    derivation: [
      { lines: [12], description: "Descend the tree one level per loop iteration.", cost: "O(h)", dimension: "time" },
      { lines: [13, 14, 15, 16, 17, 18], description: "Two O(1) comparisons decide direction or detect the split.", cost: "O(1)", dimension: "time" },
      { lines: [12], description: "Only a single pointer is stored.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["The tree is a valid BST (required for the comparison shortcut).", "Comparisons are O(1).", "Both targets exist in the tree."],
    tradeoffs: "General-tree LCA is O(n)/O(h). For many repeated queries, binary lifting preprocesses in O(n log n) to answer each LCA in O(log n).",
    counters: [{ label: "descent steps", definition: "iterations of the descent loop (line 12)", countLines: [12] }],
    fixedDataNote: "This run finds LCA(2,4)=3 and LCA(2,9)=5. The O(h) bound generalises: balanced trees give O(log n), degenerate O(n).",
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
      id: "lca-complete-1",
      kind: "complete-code",
      prompt: "Complete the BST LCA descent.",
      starterCode: "def lca_bst(root, p, q):\n    while root:\n        if p < root.val and q < root.val:\n            root = root.left\n        elif p > root.val and q > root.val:\n            root = root.right\n        else:\n            # TODO: return the split node's value\n            pass",
      expected: "def lca_bst(root, p, q):\n    while root:\n        if p < root.val and q < root.val:\n            root = root.left\n        elif p > root.val and q > root.val:\n            root = root.right\n        else:\n            return root.val",
      hints: ["The else branch is the divergence point.", "That node is the LCA.", "return root.val"],
    },
    {
      id: "lca-choose-1",
      kind: "choose-approach",
      prompt: "You must find the LCA in a plain binary tree (no BST ordering). What approach do you use, and what is its complexity?",
      expected: "A recursive DFS: return a node if it equals p or q, or if p and q are found in different subtrees (that node is the LCA). It is O(n) time and O(h) stack space, since without ordering you can't prune.",
      hints: ["No ordering means no pruning.", "Recurse and combine subtree results.", "O(n) time, O(h) space."],
    },
  ],

  review: `The **lowest common ancestor** is the deepest node ancestor to both targets — their **split point**. In a **BST**, descend by comparison (both smaller → left, both larger → right, else split) in **O(h)** time and **O(1)** space. In a **general tree** (no ordering) you recurse and combine subtree results in **O(n)**. Knowing which structure you have picks the method.`,

  expectedOutput: "3\n5\n",

  references: [
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Trees — Lowest Common Ancestor of a BST",
      topic: "trees/lca",
      purpose: "Confirm the BST LCA descent (split point) is O(h) and contrasts with the O(n) general-tree LCA.",
      verifiedClaims: ["BST LCA descends to the split point in O(h); general-tree LCA is O(n)"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://cp-algorithms.com/graph/lca.html",
      title: "Lowest Common Ancestor — CP-Algorithms",
      section: "LCA definitions and approaches",
      topic: "trees/lca",
      purpose: "Cross-check the LCA definition and that preprocessing (binary lifting) yields O(log n) per query.",
      verifiedClaims: ["LCA is the deepest common ancestor; binary lifting answers queries in O(log n) after O(n log n) preprocessing"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "8fa7d7ce6ae0a3ca",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
