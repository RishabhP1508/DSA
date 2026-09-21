/**
 * Lesson: AVL rotations (Trees and tries). Verified on CPython 3.14.
 * Output: "2 1 3\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `class AVLNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
        self.height = 1

def h(n):
    return n.height if n else 0

# Right rotation fixes a left-heavy (Left-Left) imbalance.
def rotate_right(y):
    x = y.left        # x becomes the new subtree root
    t = x.right       # t is the subtree that changes parents
    x.right = y       # y moves down to x's right
    y.left = t        # t reattaches under y
    y.height = 1 + max(h(y.left), h(y.right))   # update heights bottom-up
    x.height = 1 + max(h(x.left), h(x.right))
    return x          # new root of this subtree

# A left-leaning chain 3 <- 2 <- 1 is unbalanced at 3.
z = AVLNode(3); z.left = AVLNode(2); z.left.left = AVLNode(1)
z.height = 3; z.left.height = 2
new_root = rotate_right(z)
print(new_root.val, new_root.left.val, new_root.right.val)`;

export const avlRotations: LessonDefinition = {
  id: "avl-rotations",
  title: "AVL Trees and Rotations",
  area: "Trees and tries",
  prerequisites: ["bst-operations", "tree-height-depth"],

  explanation: `A **BST degrades to O(n)** when it becomes lopsided (recall: sorted inserts build a list-like tree). An **AVL tree** is a self-balancing BST that prevents this by enforcing a **balance factor** — at every node, the heights of the left and right subtrees differ by at most 1. Whenever an insertion or deletion violates this, the tree performs **rotations** to restore balance, keeping the height at **O(log n)** and thus all operations at O(log n).

A **rotation** is a local, O(1) rearrangement of a few pointers that changes the tree's shape **without breaking the BST ordering**. This lesson shows a **right rotation**, which fixes a **left-heavy (Left-Left)** case: the left child \`x\` becomes the new subtree root, the old root \`y\` becomes \`x\`'s right child, and \`x\`'s former right subtree \`t\` reattaches under \`y\`. Ordering is preserved because \`t\`'s values sit between \`x\` and \`y\`, exactly where they belong. Applied to the chain \`3←2←1\`, right-rotating at \`3\` yields the balanced tree rooted at \`2\` with children \`1\` and \`3\` — hence \`2 1 3\`.

There are four imbalance cases — **LL, RR, LR, RL** — fixed by a single or double rotation (LR = left-then-right, RL = right-then-left). After the pointer surgery you **update heights bottom-up**. The payoff: AVL guarantees **O(log n)** search/insert/delete in the worst case, unlike a plain BST. (Red-black trees are a looser-balanced alternative used in many libraries.)`,

  vocabulary: [
    { term: "AVL tree", definition: "A self-balancing BST where left/right subtree heights differ by at most 1." },
    { term: "Balance factor", definition: "height(left) - height(right); must stay in {-1, 0, 1}." },
    { term: "Rotation", definition: "An O(1) pointer rearrangement that rebalances while preserving BST order." },
    { term: "LL / RR / LR / RL", definition: "The four imbalance cases, fixed by single or double rotations." },
    { term: "Self-balancing", definition: "Automatically restoring balance after insert/delete to keep height O(log n)." },
  ],

  concepts: {
    purpose: "Keep a BST balanced (height O(log n)) so search/insert/delete stay O(log n) in the worst case.",
    operations: "Detect imbalance via heights; apply LL/RR/LR/RL rotations; update heights bottom-up.",
    uses: "Ordered maps/sets with worst-case guarantees, databases/indexes, any dynamic sorted data.",
    tradeoffs: "Guaranteed O(log n) vs a plain BST's O(n) worst case, at the cost of rotation logic and height bookkeeping; red-black trees rebalance less strictly.",
    commonMistakes: "Breaking BST order during rotation (mis-reattaching the middle subtree); forgetting to update heights; misclassifying the LL/RR/LR/RL case.",
    edgeCases: "A single rotation fixes LL/RR; LR/RL need two. Rotations are O(1); the tree may rebalance along the insertion path. Empty/one-node trees need no rotation.",
  },

  complexity: [
    { operation: "rotation", best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(1)", note: "Rearranges a fixed number of pointers." },
    { operation: "AVL search/insert/delete", best: "O(1)", average: "O(log n)", worst: "O(log n)", space: "O(log n)", note: "Height kept O(log n) by rebalancing; recursion O(log n)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of nodes in the AVL tree" }],
    costModel: "A rotation reassigns a constant number of pointers and updates two heights — O(1). Insert/delete walk one root-to-leaf path and rebalance along it.",
    time: {
      bound: "O(1)",
      case: "worst",
      explanation: "A single rotation only reassigns a fixed set of child pointers and recomputes two heights, so it is O(1) — independent of tree size. The bigger picture: because the AVL invariant keeps the height at O(log n), a full insert or delete does an O(log n) descent and at most O(log n) rotations along the way, so those operations are O(log n) in the WORST case — the guarantee a plain BST lacks.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "A rotation uses a few local variables — O(1). A recursive AVL insert/delete uses O(log n) stack depth (the tree height).",
      inputOutputNote: "The tree of n nodes is the data; a rotation adds O(1); recursive insert/delete adds O(log n) stack.",
    },
    derivation: [
      { lines: [13, 14, 15, 16], description: "Reassign a fixed number of pointers to rotate — O(1).", cost: "O(1)", dimension: "time" },
      { lines: [17, 18], description: "Recompute two node heights bottom-up — O(1).", cost: "O(1)", dimension: "time" },
      { lines: [13, 14], description: "A constant number of local variables.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Heights are stored on nodes and updated after structural changes.", "The rotation preserves the BST ordering by reattaching the middle subtree correctly."],
    tradeoffs: "AVL is more strictly balanced (faster lookups) but rotates more on updates; red-black trees rebalance less strictly (faster updates, slightly taller). Both guarantee O(log n) vs a plain BST's O(n) worst case.",
    counters: [],
    fixedDataNote: "This run right-rotates the chain 3←2←1 into a balanced tree rooted at 2 (children 1 and 3) → '2 1 3'. Each rotation is O(1); balance keeps whole-tree ops O(log n).",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Define an AVL node (value, children, and a cached height)." },
    { line: 2, executable: true, explanation: "Constructor." },
    { line: 3, executable: true, explanation: "Value." },
    { line: 4, executable: true, explanation: "Left child." },
    { line: 5, executable: true, explanation: "Right child." },
    { line: 6, executable: true, explanation: "Height, starting at 1 for a leaf." },
    { line: 7, executable: false, explanation: "Blank line." },
    { line: 8, executable: true, explanation: "Helper: height of a node, treating None as 0." },
    { line: 9, executable: true, explanation: "Return the stored height or 0." },
    { line: 10, executable: false, explanation: "Blank line." },
    { line: 11, executable: false, explanation: "Comment: right rotation fixes a Left-Left imbalance." },
    { line: 12, executable: true, explanation: "Define rotate_right(y) where y is the unbalanced root." },
    { line: 13, executable: true, explanation: "x = y's left child becomes the new root." },
    { line: 14, executable: true, explanation: "t = x's right subtree, which must change parents." },
    { line: 15, executable: true, explanation: "y becomes x's right child." },
    { line: 16, executable: true, explanation: "t reattaches as y's left (its values fall between x and y — order preserved)." },
    { line: 17, executable: true, explanation: "Update y's height first (it is now lower)." },
    { line: 18, executable: true, explanation: "Then update x's height (the new root)." },
    { line: 19, executable: true, explanation: "Return x as the new subtree root." },
    { line: 20, executable: false, explanation: "Blank line." },
    { line: 21, executable: false, explanation: "Comment: build a left-leaning unbalanced chain." },
    { line: 22, executable: true, explanation: "Chain 3 <- 2 <- 1 (each node's left child is smaller)." },
    { line: 23, executable: true, explanation: "Set heights so 3 is height 3 (unbalanced)." },
    { line: 24, executable: true, explanation: "Right-rotate at 3." },
    { line: 25, executable: true, explanation: "New root 2 with children 1 and 3 → '2 1 3'." },
  ],

  bindings: [
    { variable: "z", model: "tree" },
    { variable: "new_root", model: "tree" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why does a plain BST need AVL-style rotations, and what do rotations guarantee about height?", answer: "A plain BST can become a lopsided O(n)-height chain (e.g. from sorted inserts), making operations O(n). Rotations rebalance after each update to keep the height O(log n), so search/insert/delete stay O(log n) in the worst case.", explanation: "Unbalanced BSTs lose their O(log n) advantage. AVL rotations restore the height-balance invariant, bounding height at O(log n) and thus keeping all operations logarithmic." },
  ],

  experiments: [
    "Right-rotate and verify an inorder traversal is unchanged (order preserved).",
    "Sketch the RR case and write rotate_left as the mirror image.",
    "Compose a left-then-right rotation to handle the LR case.",
  ],

  exercises: [
    {
      id: "avl-choose-1",
      kind: "choose-approach",
      prompt: "You insert 1,2,3,...,n into a plain BST vs an AVL tree. What heights result and what are the search complexities?",
      expected: "Plain BST: a degenerate chain of height n → O(n) search. AVL: rotations keep height O(log n) → O(log n) search. AVL's self-balancing is exactly what prevents the sorted-insert worst case.",
      hints: ["Sorted inserts make a plain BST a chain.", "That's height n → O(n).", "AVL rotations keep height O(log n) → O(log n)."],
    },
    {
      id: "avl-complete-1",
      kind: "complete-code",
      prompt: "Complete the pointer surgery of a right rotation (x is y.left).",
      starterCode: "def rotate_right(y):\n    x = y.left\n    t = x.right\n    # TODO: make x the new root, y its right child, reattach t\n    return x",
      expected: "def rotate_right(y):\n    x = y.left\n    t = x.right\n    x.right = y\n    y.left = t\n    return x",
      hints: ["y moves down to x's right.", "x's old right subtree t goes under y's left.", "x.right = y; y.left = t"],
    },
  ],

  review: `An **AVL tree** is a self-balancing BST that keeps every node's subtree heights within 1, using **rotations** — O(1) pointer rearrangements that rebalance while preserving BST order. The four cases (**LL, RR, LR, RL**) use single or double rotations, and heights are updated bottom-up. This guarantees **O(log n)** search/insert/delete in the worst case, unlike a plain BST that can degrade to O(n).`,

  expectedOutput: "2 1 3\n",

  references: [
    {
      url: "https://opendatastructures.org/",
      title: "Open Data Structures",
      section: "Balanced trees / rotations",
      topic: "trees/avl",
      purpose: "Confirm that rotations are O(1) order-preserving operations and that balancing keeps height O(log n).",
      verifiedClaims: ["Rotations are O(1) and preserve the BST order; balanced trees keep height O(log n)"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://www.geeksforgeeks.org/introduction-to-avl-tree/",
      title: "AVL Tree — GeeksforGeeks",
      section: "Balance factor and LL/RR/LR/RL rotations",
      topic: "trees/avl",
      purpose: "Cross-check the balance-factor invariant and the four rotation cases with height updates.",
      verifiedClaims: ["AVL keeps balance factor in {-1,0,1}; LL/RR use single rotations, LR/RL use double rotations; operations are O(log n)"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "bbcd62975022d36d",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
