/**
 * Lesson: BST operations (Trees and tries). Verified on CPython 3.14.
 * Output: "True\nFalse\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# BST invariant: left subtree < node < right subtree.
def insert(root, val):
    if root is None:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)   # go left for smaller
    else:
        root.right = insert(root.right, val) # go right for larger/equal
    return root

def search(root, val):
    while root:
        if val == root.val:
            return True
        root = root.left if val < root.val else root.right  # prune one side
    return False

bst = None
for v in [5, 3, 8, 1, 4]:
    bst = insert(bst, v)
print(search(bst, 4))
print(search(bst, 6))`;

export const bstOperations: LessonDefinition = {
  id: "bst-operations",
  title: "Binary Search Tree Operations",
  area: "Trees and tries",
  prerequisites: ["tree-dfs", "binary-search"],

  explanation: `A **binary search tree (BST)** enforces one ordering rule at every node: everything in the **left** subtree is **smaller**, everything in the **right** is **larger** (or equal, by convention). This invariant makes a BST a *searchable* tree — at each node you can discard an entire subtree, just like binary search discards half an array.

**Search** walks down from the root: if the target equals the node, done; if it's smaller, go left; if larger, go right — pruning one whole side each step. **Insert** does the same walk to find the empty slot where the value belongs, then attaches a new leaf, preserving the invariant. Both follow a single root-to-leaf path, so they cost **O(h)** where h is the height.

Here's the crucial nuance the complexity panel makes explicit: **h depends on shape**. A *balanced* BST has h ≈ log n, giving **O(log n)** search/insert — the whole point of a BST. But inserting **sorted** data builds a degenerate, list-like tree with h = n, degrading operations to **O(n)** (no better than a linked list). This is exactly why self-balancing trees (AVL, red-black) exist — a later lesson covers the rotations that keep h logarithmic. The cue: BSTs give ordered, dynamic O(log n) lookup *only when balanced*.`,

  vocabulary: [
    { term: "Binary search tree (BST)", definition: "A tree where left subtree < node < right subtree at every node." },
    { term: "BST invariant", definition: "The ordering property that lets you prune one subtree per comparison." },
    { term: "Search", definition: "Follow left/right by comparison to find (or not) a value in O(h)." },
    { term: "Insert", definition: "Walk to the correct empty slot and attach a new leaf, preserving the invariant." },
    { term: "Balanced vs degenerate", definition: "Balanced h ≈ log n (O(log n) ops); degenerate h = n (O(n) ops)." },
  ],

  concepts: {
    purpose: "Support ordered, dynamic search/insert/delete in O(h) — O(log n) when balanced.",
    operations: "Compare at each node; go left (smaller) or right (larger); insert attaches a leaf at the empty slot.",
    uses: "Ordered maps/sets, range queries, floor/ceil, dynamic sorted data (balanced variants).",
    tradeoffs: "O(log n) when balanced but O(n) when degenerate; self-balancing trees fix the worst case at extra complexity.",
    commonMistakes: "Assuming O(log n) unconditionally (sorted inserts make it O(n)); breaking the invariant when inserting; forgetting the None base case.",
    edgeCases: "Empty tree search returns False. Inserting duplicates goes one side by convention. Sorted input builds a degenerate tree.",
  },

  complexity: [
    { operation: "Search / insert", best: "O(1)", average: "O(log n)", worst: "O(n)", space: "O(h)", note: "O(log n) balanced; O(n) degenerate (sorted inserts). Recursive insert uses O(h) stack." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of nodes in the BST" },
      { symbol: "h", meaning: "the height of the tree" },
    ],
    costModel: "Each step is one O(1) comparison that moves down one level; the number of steps is the path length, bounded by h.",
    time: {
      bound: "O(h)",
      case: "average",
      explanation: "Search and insert follow a single path from the root to a leaf, doing one comparison per level, so both are O(h). The catch is what h is: a BALANCED tree has h ≈ log₂(n), giving O(log n); but a DEGENERATE tree (e.g. built by inserting already-sorted values, each becoming a right child) has h = n, giving O(n) — no better than scanning a linked list. So the honest bound is O(h), which ranges from O(log n) to O(n).",
      otherCases: [
        { case: "best", bound: "O(1)", note: "The target is the root, or the tree is empty." },
        { case: "worst", bound: "O(n)", note: "A degenerate tree (sorted insertion order) has height n." },
      ],
    },
    space: {
      bound: "O(h)",
      case: "worst",
      explanation: "Iterative search uses O(1) space; the recursive insert uses stack depth equal to the path length, O(h). No structure grows beyond the tree itself.",
      inputOutputNote: "The tree of n nodes is the data; the recursion stack (insert) is O(h) working space.",
    },
    derivation: [
      { lines: [18, 19, 20, 21], description: "Search follows one root-to-leaf path, one comparison per level.", cost: "O(h)", dimension: "time" },
      { lines: [9, 10, 11, 12, 13, 14], description: "Insert walks to the empty slot along one path.", cost: "O(h)", dimension: "time" },
      { lines: [12, 14], description: "Recursive insert's stack depth is the path length h.", cost: "O(h)", dimension: "space" },
    ],
    assumptions: ["Comparisons are O(1).", "h = log n only when the tree is balanced; sorted inserts make h = n."],
    tradeoffs: "A hash map gives expected O(1) lookup but no order; a balanced BST (AVL/red-black) guarantees O(log n) AND ordered operations (range, floor/ceil) at the cost of rebalancing logic.",
    counters: [{ label: "search steps", definition: "iterations of the search descent (line 19)", countLines: [19] }],
    fixedDataNote: "This run inserts 5 values then searches: 4 is present (True), 6 is absent (False). With balanced shape ops are O(log n); sorted inserts would make them O(n).",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Define TreeNode." },
    { line: 2, executable: true, explanation: "Constructor." },
    { line: 3, executable: true, explanation: "Value." },
    { line: 4, executable: true, explanation: "Left child." },
    { line: 5, executable: true, explanation: "Right child." },
    { line: 6, executable: false, explanation: "Blank line." },
    { line: 7, executable: false, explanation: "Comment: the BST invariant." },
    { line: 8, executable: true, explanation: "Define recursive insert(root, val)." },
    { line: 9, executable: true, explanation: "Base case: an empty slot becomes a new leaf." },
    { line: 10, executable: true, explanation: "Return the new node." },
    { line: 11, executable: true, explanation: "If val is smaller, it belongs on the left." },
    { line: 12, executable: true, explanation: "Recurse left and reattach the (possibly new) subtree." },
    { line: 13, executable: false, explanation: "Otherwise it belongs on the right." },
    { line: 14, executable: true, explanation: "Recurse right and reattach." },
    { line: 15, executable: true, explanation: "Return this (unchanged) root up the chain." },
    { line: 16, executable: false, explanation: "Blank line." },
    { line: 17, executable: true, explanation: "Define iterative search(root, val)." },
    { line: 18, executable: true, explanation: "Descend while there is a node." },
    { line: 19, executable: true, explanation: "Found the target." },
    { line: 20, executable: true, explanation: "Return True on a match." },
    { line: 21, executable: true, explanation: "Otherwise go left if smaller, right if larger — pruning one side." },
    { line: 22, executable: true, explanation: "Fell off the tree: not found." },
    { line: 23, executable: false, explanation: "Blank line." },
    { line: 24, executable: true, explanation: "Start with an empty tree." },
    { line: 25, executable: true, explanation: "Insert 5, 3, 8, 1, 4 (this order stays reasonably balanced)." },
    { line: 26, executable: true, explanation: "Insert each value." },
    { line: 27, executable: true, explanation: "search(bst, 4) → True." },
    { line: 28, executable: true, explanation: "search(bst, 6) → False." },
  ],

  bindings: [
    { variable: "bst", model: "tree", overlays: [{ role: "pointer", label: "node", source: "root" }] },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "If you insert values 1, 2, 3, 4, 5 in that order, what shape is the BST and what does that do to search time?", answer: "A degenerate right-leaning chain (like a linked list) with height n, so search/insert become O(n) instead of O(log n).", explanation: "Each new value is larger than all before it, so it becomes the right child of the previous — no branching. Height equals n, so operations degrade to O(n); this is why balancing matters." },
  ],

  experiments: [
    "Insert sorted values 1..7 and observe the degenerate O(n)-height tree.",
    "Insert the same values in a balanced order and compare heights.",
    "Add an inorder traversal to confirm it prints the values sorted.",
  ],

  exercises: [
    {
      id: "bst-complete-1",
      kind: "complete-code",
      prompt: "Complete iterative BST search returning True/False.",
      starterCode: "def search(root, val):\n    while root:\n        if val == root.val:\n            return True\n        # TODO: move left or right by comparison\n    return False",
      expected: "def search(root, val):\n    while root:\n        if val == root.val:\n            return True\n        root = root.left if val < root.val else root.right\n    return False",
      hints: ["Smaller values are on the left.", "Larger (or equal) on the right.", "root = root.left if val < root.val else root.right"],
    },
    {
      id: "bst-choose-1",
      kind: "choose-approach",
      prompt: "You need ordered operations (range queries, floor/ceil) AND guaranteed fast lookup on changing data. Plain BST, balanced BST, or hash map?",
      expected: "A balanced BST (AVL/red-black): guaranteed O(log n) search/insert/delete AND ordered queries. A plain BST risks O(n) if unbalanced; a hash map is expected O(1) but supports no order/range queries.",
      hints: ["Do you need ordering (range/floor/ceil)?", "Hash maps have no order.", "Balanced BST guarantees O(log n) and supports order."],
    },
  ],

  review: `A **BST** keeps left < node < right, so **search** and **insert** follow one root-to-leaf path in **O(h)**. That's **O(log n)** when the tree is **balanced** but degrades to **O(n)** for a **degenerate** tree (e.g. sorted inserts) — which is why self-balancing trees exist. BSTs give ordered, dynamic lookup that hash maps (unordered) can't, when balance is maintained.`,

  expectedOutput: "True\nFalse\n",

  references: [
    {
      url: "https://algs4.cs.princeton.edu/32bst/",
      title: "Binary Search Trees — Algorithms, 4th Edition (Princeton)",
      section: "BST search/insert and analysis",
      topic: "trees/bst",
      purpose: "Confirm BST search/insert follow one path in O(h) and degrade to O(n) for unbalanced trees.",
      verifiedClaims: ["BST search/insert are O(h); balanced trees give O(log n), degenerate trees O(n)"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://opendatastructures.org/",
      title: "Open Data Structures",
      section: "Binary search trees",
      topic: "trees/bst",
      purpose: "Cross-check the BST invariant and the height-dependence of operation costs.",
      verifiedClaims: ["BST operation cost is proportional to height, which balancing keeps at O(log n)"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "4d3da813c2e5a8e4",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
