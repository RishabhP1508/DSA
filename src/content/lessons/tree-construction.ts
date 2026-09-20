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

  explanation: `Sometimes you build a tree *to guarantee a good shape*. **Constructing a balanced BST from a sorted array** is the classic example, and it's a neat divide-and-conquer: pick the **middle** element as the **root** (so equal numbers of smaller and larger values fall on each side), then recursively build the **left subtree from the left half** and the **right subtree from the right half**. Because the middle splits the array evenly at every level, the resulting tree has height ≈ log n — **balanced by construction**, which keeps later search/insert at O(log n).

For \`[1..7]\` the middle \`4\` becomes the root, \`[1,2,3]\` builds the left subtree (rooted at \`2\`), and \`[5,6,7]\` the right (rooted at \`6\`) — hence \`4 2 6\`. This is why you'd deliberately build rather than insert: inserting a *sorted* sequence one-by-one produces a degenerate O(n)-height tree, but this construction produces a balanced one directly.

The same "middle as root, recurse on halves" idea appears when **rebuilding a tree from traversals** (e.g. from preorder + inorder, where preorder gives the root and inorder splits left/right). This build is **O(n)** time when done carefully (though the slicing version here copies subarrays, adding overhead — noted in the complexity panel) and **O(h) = O(log n)** recursion space for the balanced result.`,

  vocabulary: [
    { term: "Balanced construction", definition: "Building a tree whose height is ~log n by design." },
    { term: "Middle-as-root", definition: "Choosing the median element as the subtree root to split evenly." },
    { term: "Divide and conquer", definition: "Recursively building left/right subtrees from the array halves." },
    { term: "Rebuild from traversals", definition: "Reconstructing a tree from preorder+inorder (or postorder+inorder)." },
    { term: "Slicing overhead", definition: "arr[:mid] / arr[mid+1:] copy subarrays, adding cost over index-based recursion." },
  ],

  concepts: {
    purpose: "Build trees with a desired (usually balanced) shape, or reconstruct them from traversals.",
    operations: "Pick the middle as root; recurse on the left and right halves.",
    uses: "Balanced BST from sorted data, rebuilding from preorder+inorder, constructing complete trees.",
    tradeoffs: "Guarantees balance (O(log n) height) vs inserting sorted data (O(n) height); slicing copies add overhead.",
    commonMistakes: "Off-by-one around mid (excluding/duplicating the root); slicing when index bounds would be cheaper; forgetting the empty base case.",
    edgeCases: "Empty array → None. One element → a single leaf. Even lengths pick one of the two middles.",
  },

  complexity: [
    { operation: "build balanced BST", best: "O(n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)", note: "Index-based build is O(n); this slicing version copies subarrays (O(n log n) total copies)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of elements / nodes" },
      { symbol: "h", meaning: "the resulting height (~log n, balanced by construction)" },
    ],
    costModel: "Creating each node is O(1). This version also slices arr[:mid] and arr[mid+1:], each copying its length.",
    time: {
      bound: "O(n log n)",
      case: "worst",
      explanation: "There are n nodes to create, which alone is O(n). However, this implementation SLICES the array at each call (arr[:mid], arr[mid+1:]), and slicing copies elements. Across the ~log n levels of recursion, the total copying is O(n) per level × log n levels = O(n log n). An index-based version (passing lo/hi bounds instead of slices) avoids the copies and builds the tree in O(n) — a good optimization to note.",
      otherCases: [
        { case: "best", bound: "O(n)", note: "Index-based construction (no slicing) creates n nodes in O(n)." },
      ],
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "The output tree has n nodes (O(n)). The recursion stack is O(h) = O(log n) for the balanced result, and the slices create O(n log n) transient copies in total (though not all alive at once). The dominant persistent structure is the O(n) tree.",
      inputOutputNote: "The n-node tree is the required output; the recursion stack is O(log n); slice copies are transient overhead.",
    },
    derivation: [
      { lines: [11], description: "Choosing the middle splits the array evenly, giving a balanced tree (height ~log n).", cost: "O(1)", dimension: "time" },
      { lines: [12, 13, 14], description: "Create each of the n nodes and recurse on halves.", cost: "O(n log n)", dimension: "time" },
      { lines: [12], description: "The tree holds n nodes; recursion stack is O(log n).", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["The input array is sorted.", "Node creation is O(1).", "Slicing copies subarrays (the source of the extra log n factor here)."],
    tradeoffs: "Pass lo/hi indices instead of slices to build in O(n) time and O(log n) space. Building balanced beats inserting sorted values one-by-one (which yields an O(n)-height degenerate tree).",
    counters: [{ label: "nodes built", definition: "TreeNode constructions (line 12)", countLines: [12] }],
    fixedDataNote: "This run builds a balanced BST from [1..7]: root 4, left-root 2, right-root 6 → '4 2 6'. The O(n)/O(n log n) bounds depend on index-based vs slicing construction.",
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

  review: `**Tree construction** builds a tree with a chosen shape. From a **sorted array**, picking the **middle as the root** and recursing on the halves yields a **balanced BST** (height ~log n) — far better than the degenerate tree that sequential sorted insertion produces. Node creation is **O(n)**; this slicing version adds an O(log n) factor (index-based avoids it), with **O(log n)** recursion space. The same idea rebuilds trees from traversals.`,

  expectedOutput: "4 2 6\n",

  references: [
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Trees — Convert Sorted Array to BST / rebuild from traversals",
      topic: "trees/construction",
      purpose: "Confirm the middle-as-root balanced construction and reconstruction from traversals.",
      verifiedClaims: ["Choosing the middle of a sorted array as the root builds a height-balanced BST"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/Trees/index.html",
      title: "Trees and Tree Algorithms — Runestone",
      section: "Building trees / divide and conquer",
      topic: "trees/construction",
      purpose: "Cross-check the divide-and-conquer construction and its recursion structure.",
      verifiedClaims: ["Divide-and-conquer construction builds subtrees from array halves"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 15,
    contentHash: "cb3324a091fe081b",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
