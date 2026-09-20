/**
 * Lesson: Tree DFS (Trees and tries). Verified on CPython 3.14.
 * Output: "[5, 3, 2, 4, 8, 7, 9]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Depth-first search on a binary tree: go deep before wide.
class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

root = TreeNode(5, TreeNode(3, TreeNode(2), TreeNode(4)),
                   TreeNode(8, TreeNode(7), TreeNode(9)))

def dfs(node, out):
    if node is None:      # base case: nothing to visit
        return
    out.append(node.val)  # visit, then recurse into children
    dfs(node.left, out)
    dfs(node.right, out)

order = []
dfs(root, order)
print(order)`;

export const treeDfs: LessonDefinition = {
  id: "tree-dfs",
  title: "Tree DFS (Depth-First Search)",
  area: "Trees and tries",
  prerequisites: ["classes", "correctness"],

  explanation: `A **binary tree** is nodes linked by \`left\` and \`right\` child references, starting from a **root**. **Depth-first search (DFS)** explores as deep as possible along one branch before backtracking to try another — naturally expressed with **recursion**, because each subtree is itself a smaller tree.

The recursive shape is always the same and worth memorizing: a **base case** (\`if node is None: return\`) stops at empty spots, then you **visit** the node and **recurse into its children**. Where you place the "visit" step relative to the recursive calls determines the traversal *order* (preorder here — visit before children; the next lesson covers all three). This example visits \`5, 3, 2, 4, 8, 7, 9\` — down the left branch first, then the right.

DFS visits every node exactly once, so it is **O(n)** time. Its space is the **recursion stack depth**, which equals the tree's **height h** — **O(h)**, ranging from O(log n) for a balanced tree to O(n) for a degenerate (list-like) tree. DFS is the backbone of tree problems: path sums, subtree checks, tree validation, and it generalizes directly to graph DFS.`,

  vocabulary: [
    { term: "Binary tree", definition: "Nodes each with up to two children (left, right), rooted at one node." },
    { term: "DFS", definition: "Depth-first search: explore one branch fully before backtracking." },
    { term: "Base case", definition: "The stopping condition for recursion — here, an empty (None) node." },
    { term: "Height (h)", definition: "The longest root-to-leaf path length; sets DFS's stack depth." },
    { term: "Recursion stack", definition: "The frames of active recursive calls; its max depth is O(h)." },
  ],

  concepts: {
    purpose: "Visit every node of a tree by going deep first — the foundation of most tree algorithms.",
    operations: "Recurse: base case on None, visit the node, recurse left then right.",
    uses: "Path sums, subtree checks, tree validation, serialization, and (generalized) graph DFS.",
    tradeoffs: "O(n) time and O(h) space; recursion is clean but risks stack overflow on very deep/degenerate trees.",
    commonMistakes: "Missing the None base case (crash on leaf children); confusing DFS with BFS ordering; assuming O(log n) space (it's O(h), which can be O(n)).",
    edgeCases: "Empty tree (root None) visits nothing. A single node visits just it. A degenerate tree makes the stack O(n) deep.",
  },

  complexity: [
    { operation: "DFS traversal", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(h)", note: "Every node visited once; stack depth = height h (O(log n) balanced .. O(n) degenerate)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of nodes in the tree" },
      { symbol: "h", meaning: "the height of the tree (longest root-to-leaf path)" },
    ],
    costModel: "Each node is visited once with O(1) work; the recursion stack holds one frame per level of the current path.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "DFS calls itself once per node (plus O(n) None-base-case calls at the empty child slots), doing constant work at each — so it touches every node exactly once, giving O(n). This holds for any tree shape: you must visit all n nodes.",
    },
    space: {
      bound: "O(h)",
      case: "worst",
      explanation: "The only extra memory is the recursion stack, which is as deep as the current path — at most the tree's height h. For a balanced tree h ≈ log n (O(log n) space); for a degenerate, list-like tree h = n (O(n) space). This is why we express DFS space as O(h), not O(log n).",
      inputOutputNote: "The tree of n nodes is the input; the output list of n values and the O(h) stack are the extra space.",
    },
    derivation: [
      { lines: [12, 13], description: "Base case returns at empty slots — O(1) each.", cost: "O(n)", dimension: "time" },
      { lines: [14, 15, 16], description: "Visit each node once and recurse into both children.", cost: "O(n)", dimension: "time" },
      { lines: [15, 16], description: "The recursion stack is as deep as the height h.", cost: "O(h)", dimension: "space" },
    ],
    assumptions: ["Visiting a node (append) is O(1).", "Recursion depth reaches the tree height h."],
    tradeoffs: "An explicit stack (iterative DFS) avoids Python's recursion limit but uses the same O(h) space; BFS uses O(width) space instead of O(h) and visits level by level.",
    counters: [{ label: "nodes visited", definition: "executions of the visit line (line 14)", countLines: [14] }],
    fixedDataNote: "This run visits 7 nodes with height 3 → [5,3,2,4,8,7,9]. The O(n) time / O(h) space bounds generalise to any tree.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: DFS goes deep before wide." },
    { line: 2, executable: true, explanation: "Define the TreeNode class." },
    { line: 3, executable: true, explanation: "Constructor with a value and optional children." },
    { line: 4, executable: true, explanation: "Store the node's value." },
    { line: 5, executable: true, explanation: "Store the left child." },
    { line: 6, executable: true, explanation: "Store the right child." },
    { line: 7, executable: false, explanation: "Blank line." },
    { line: 8, executable: true, explanation: "Build the tree (root 5 with two subtrees)." },
    { line: 9, executable: true, explanation: "The right subtree of the root." },
    { line: 10, executable: false, explanation: "Blank line." },
    { line: 11, executable: true, explanation: "Define the recursive dfs(node, out)." },
    { line: 12, executable: true, explanation: "Base case: stop at an empty (None) slot." },
    { line: 13, executable: true, explanation: "Return without visiting." },
    { line: 14, executable: true, explanation: "Visit: record this node's value (preorder: before children)." },
    { line: 15, executable: true, explanation: "Recurse into the left subtree." },
    { line: 16, executable: true, explanation: "Recurse into the right subtree." },
    { line: 17, executable: false, explanation: "Blank line." },
    { line: 18, executable: true, explanation: "Prepare the output list." },
    { line: 19, executable: true, explanation: "Run DFS from the root." },
    { line: 20, executable: true, explanation: "Print the visit order → [5, 3, 2, 4, 8, 7, 9]." },
  ],

  bindings: [
    { variable: "root", model: "tree", overlays: [{ role: "pointer", label: "node", source: "node" }] },
    { variable: "order", model: "array" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why is DFS's space O(h) rather than O(log n)?", answer: "Because the recursion stack is as deep as the tree's height h; only for a balanced tree is h ≈ log n. A degenerate (list-like) tree has h = n, making the stack O(n).", explanation: "Stack depth follows the current path length, which is bounded by the height. Height is O(log n) only when balanced; in the worst case it is O(n), so the honest bound is O(h)." },
  ],

  experiments: [
    "Move the visit (append) after the recursive calls to produce postorder.",
    "Build a degenerate right-only chain and reason about the O(n) stack depth.",
    "Add a depth parameter and print each node's depth.",
  ],

  exercises: [
    {
      id: "dfs-complete-1",
      kind: "complete-code",
      prompt: "Complete a DFS that counts the number of nodes in a tree.",
      starterCode: "def count(node):\n    if node is None:\n        return 0\n    # TODO: 1 for this node plus counts of both subtrees\n    pass",
      expected: "def count(node):\n    if node is None:\n        return 0\n    return 1 + count(node.left) + count(node.right)",
      hints: ["Each node contributes 1.", "Add the counts of the left and right subtrees.", "return 1 + count(node.left) + count(node.right)"],
    },
    {
      id: "dfs-predict-1",
      kind: "predict-state",
      prompt: "What is the time and space complexity of DFS on a balanced binary tree of n nodes?",
      expected: "O(n) time (each node visited once) and O(log n) space (stack depth = height ≈ log n for a balanced tree).",
      hints: ["How many nodes are visited?", "All n → O(n) time.", "Balanced height is log n → O(log n) stack space."],
    },
  ],

  review: `**DFS** on a tree recurses: base case at \`None\`, **visit** the node, then recurse into children. It visits every node once — **O(n)** time — using stack space equal to the tree's **height h**, so **O(h)** (O(log n) balanced, O(n) degenerate). Where you place the visit sets the order (preorder here). DFS underlies path/subtree problems and generalizes to graph DFS.`,

  expectedOutput: "[5, 3, 2, 4, 8, 7, 9]\n",

  references: [
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/Trees/index.html",
      title: "Trees and Tree Algorithms — Problem Solving with Algorithms and DS using Python (Runestone)",
      section: "Tree traversals / DFS",
      topic: "trees/dfs",
      purpose: "Confirm the recursive DFS structure (base case, visit, recurse) and its O(n) time.",
      verifiedClaims: ["DFS visits each node once (O(n)) via recursion with a None base case"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://cp-algorithms.com/graph/depth-first-search.html",
      title: "Depth First Search — CP-Algorithms",
      section: "DFS complexity",
      topic: "trees/dfs",
      purpose: "Cross-check that DFS is O(n) time with O(h) recursion-stack space (O(V) in graph terms).",
      verifiedClaims: ["DFS runs in O(n) time; recursion stack depth is bounded by the height/path length"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "3a77e1136cd5ab2f",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
