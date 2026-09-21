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

  explanation: `**Height** and **depth** are the two ways we measure "how tall" a tree is. The **depth** of a node is its distance from the **root** (the root has depth 0). The **height** of a node is the distance to its **deepest descendant leaf**; the height of the *tree* is the height of its root. These aren't just trivia — a tree's height is precisely what determines the cost of DFS (O(h) stack) and of BST operations (O(h) per search).

Computing height is a clean **postorder** recursion: a node's height is \`1 + max(height of left, height of right)\`, with an empty subtree contributing 0. You must know both children's heights *before* you can compute the parent's — children-before-parent, the postorder pattern. This example returns \`3\` (three levels: 5 → 3/8 → leaves).

The computation is **O(n)** time (each node contributes to exactly one height calculation) and **O(h)** space (the recursion stack). This lesson also grounds the recurring phrase from earlier topics: "**O(h)**, which is O(log n) when balanced and O(n) when degenerate." Height is the number that phrase is about — a **balanced** tree keeps height near log n, a **skewed** tree lets it grow to n. A closely related quantity, **minimum depth** (nearest leaf), uses BFS for early termination.`,

  vocabulary: [
    { term: "Depth (of a node)", definition: "Distance from the root; the root has depth 0." },
    { term: "Height (of a node)", definition: "Distance to the deepest descendant leaf." },
    { term: "Height (of a tree)", definition: "The height of the root — the longest root-to-leaf path." },
    { term: "Balanced", definition: "Height stays near log n (subtree heights differ little)." },
    { term: "Skewed / degenerate", definition: "Height grows toward n (list-like)." },
  ],

  concepts: {
    purpose: "Measure tree height/depth — the quantity that governs DFS and BST operation costs.",
    operations: "Recursively: height(node) = 1 + max(height(left), height(right)); empty = 0.",
    uses: "Analysing DFS/BST cost, checking balance, minimum depth, diameter, level counts.",
    tradeoffs: "O(n) to compute; height is a property you often need before choosing algorithms.",
    commonMistakes: "Confusing height (from a node down) with depth (from the root down); off-by-one between counting nodes vs edges; forgetting the empty-tree base case.",
    edgeCases: "Empty tree has height 0 (this convention). A single node has height 1 (node count) or 0 (edge count). Skewed trees have height n.",
  },

  complexity: [
    { operation: "height(root)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(h)", note: "Visits every node once; recursion stack = height h." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of nodes" },
      { symbol: "h", meaning: "the tree height (recursion depth)" },
    ],
    costModel: "Each node's height is computed once from its children's heights with O(1) work (a max and an add).",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "The recursion visits every node exactly once, combining its two children's heights in O(1) — so computing the tree's height is O(n). There is no way to do better: you must inspect every node to know the longest path could not go through an unvisited one.",
    },
    space: {
      bound: "O(h)",
      case: "worst",
      explanation: "The only extra memory is the recursion stack, whose depth equals the current path length — bounded by the height h (O(log n) balanced, O(n) skewed).",
      inputOutputNote: "The tree of n nodes is the input; the O(h) recursion stack is the working space.",
    },
    derivation: [
      { lines: [12, 13], description: "Base case at empty subtrees — O(1) each.", cost: "O(n)", dimension: "time" },
      { lines: [14], description: "Each node combines child heights in O(1); n nodes → O(n).", cost: "O(n)", dimension: "time" },
      { lines: [14], description: "Recursion depth reaches the height h.", cost: "O(h)", dimension: "space" },
    ],
    assumptions: ["max and addition are O(1).", "Recursion reaches depth h."],
    tradeoffs: "An iterative BFS level-count also computes height in O(n) but uses O(w) queue space instead of O(h) stack space; for minimum depth, BFS can stop early at the first leaf.",
    counters: [{ label: "height computations", definition: "executions of the combine step (line 14)", countLines: [14] }],
    fixedDataNote: "This run returns height 3 for a 7-node balanced tree. The O(n) time / O(h) space bounds generalise to any tree.",
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

  review: `**Depth** measures distance from the root (root = 0); **height** measures distance down to the deepest leaf; a tree's height is its root's height. Compute it with a **postorder** recursion \`1 + max(left, right)\` — **O(n)** time, **O(h)** space. Height is the **h** in the "O(h) = O(log n) balanced / O(n) degenerate" bounds that govern DFS and BST cost.`,

  expectedOutput: "3\n",

  references: [
    {
      url: "https://opendatastructures.org/",
      title: "Open Data Structures",
      section: "Binary trees — height and depth",
      topic: "trees/height-depth",
      purpose: "Confirm definitions of height/depth and that they govern tree operation costs.",
      verifiedClaims: ["Node depth is distance from root; height is distance to deepest leaf; height drives O(h) costs"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/Trees/index.html",
      title: "Trees and Tree Algorithms — Runestone",
      section: "Tree height",
      topic: "trees/height-depth",
      purpose: "Cross-check the recursive height computation and its O(n) cost.",
      verifiedClaims: ["Height = 1 + max(child heights); computed in O(n)"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "7a42a58ae3c9f40f",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
