/**
 * Lesson: Min/max heaps (Heaps). Verified on CPython 3.14.
 * Output: "1\n0\n1\n8\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `import heapq

# A min-heap keeps the SMALLEST item instantly reachable at index 0.
h = [5, 3, 8, 1, 9, 2]
heapq.heapify(h)          # O(n): rearrange the list into a valid heap
print(h[0])               # peek the minimum in O(1)
heapq.heappush(h, 0)      # insert in O(log n)
print(heapq.heappop(h))   # remove & return the minimum in O(log n)
print(h[0])               # new minimum after the pop

# Python only has a MIN-heap; get a max-heap by negating values.
maxh = [-x for x in [5, 3, 8, 1]]
heapq.heapify(maxh)
print(-heapq.heappop(maxh))  # pop the largest ORIGINAL value`;

export const minMaxHeaps: LessonDefinition = {
  id: "min-max-heaps",
  title: "Min and Max Heaps",
  area: "Heaps",
  prerequisites: ["array-traversal", "binary-search"],

  explanation: `A **heap** is a tree-shaped structure (stored compactly in an array) that always keeps the **most extreme element instantly reachable at the top**. A **min-heap** keeps the smallest at the root; a **max-heap** keeps the largest. You don't get full sorted order — only the guarantee that the root is the min (or max) — and that limited promise is exactly what makes insert and remove cheap: **O(log n)**, with an **O(1)** peek.

Python's \`heapq\` module implements a **min-heap on a plain list**, with two deliberate conventions (per the official docs): it uses **zero-based indexing** (so \`heap[0]\` is the smallest, and the children of index \`i\` are at \`2i+1\` and \`2i+2\`), and \`heappop\` returns the **smallest** item. This differs from many textbooks (e.g. Princeton) that use 1-based indexing and default to a max-heap — a convention clash worth knowing when you read other sources.

The core operations: \`heapify(list)\` builds a heap in **O(n)** (cheaper than n inserts), \`heappush\` adds in **O(log n)**, \`heappop\` removes the min in **O(log n)**, and \`heap[0]\` peeks in **O(1)**. Python's heap is min-only, so for a **max-heap** you negate the values (push \`-x\`, negate again on pop). Heaps are the engine of priority queues, top-K, and the greedy graph algorithms (Dijkstra, Prim) coming later.`,

  vocabulary: [
    { term: "Heap", definition: "A complete binary tree (stored as an array) keeping the extreme element at the root." },
    { term: "Min-heap", definition: "A heap whose smallest element is always at the root (heap[0])." },
    { term: "Max-heap", definition: "A heap whose largest element is at the root; in Python, simulated by negating values." },
    { term: "Heap invariant", definition: "Each parent is <= its children (min-heap), maintained by push/pop." },
    { term: "heapify", definition: "Rearrange a list into a valid heap in O(n)." },
    { term: "Zero-based indexing", definition: "heapq convention: root at 0; children of i at 2i+1 and 2i+2." },
  ],

  concepts: {
    purpose: "Provide O(log n) insert/remove of the smallest (or largest) element and O(1) peek — the core of priority queues.",
    operations: "heapify (O(n) build), heappush / heappop (O(log n)), heap[0] peek (O(1)); negate for a max-heap.",
    uses: "Priority queues, top-K, Dijkstra/Prim, scheduling, streaming extremes.",
    tradeoffs: "Only the root is instantly available (not full order); push/pop are O(log n), not O(1).",
    commonMistakes: "Expecting the whole heap to be sorted (only heap[0] is guaranteed); forgetting Python is min-only (negate for max); using 1-based child formulas from textbooks.",
    edgeCases: "heappop on an empty heap raises IndexError. Duplicates are fine. A single element is a valid heap.",
  },

  complexity: [
    { operation: "heapify (build)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "In-place build is O(n), cheaper than n inserts." },
    { operation: "heappush / heappop", best: "O(1)", average: "O(log n)", worst: "O(log n)", note: "Sift up/down along the tree height." },
    { operation: "peek heap[0]", best: "O(1)", average: "O(1)", worst: "O(1)", note: "The root is the extreme element." },
  ],

  complexityExplanation: {
    variables: [{ symbol: "n", meaning: "the number of elements in the heap" }],
    costModel: "The heap is a complete binary tree of height ~log2(n). push/pop sift an element along one root-to-leaf path (O(log n)). heapify sifts down all nodes but the total is O(n).",
    time: {
      bound: "O(log n)",
      case: "worst",
      explanation: "The heap's height is about log2(n) because it is a complete binary tree. heappush places the new item at the end and sifts it UP toward the root, and heappop moves the last item to the root and sifts it DOWN — each traverses at most one full height, so both are O(log n). Peeking heap[0] is O(1). heapify looks O(n log n) but a careful bottom-up analysis shows it is O(n).",
      otherCases: [
        { case: "best", bound: "O(1)", note: "A push/pop that needs no sifting (already in place)." },
      ],
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Operations sift within the existing array using a few variables; no extra structure grows with n. (heapify is in place.)",
      inputOutputNote: "The heap list of n elements is the data; its O(n) size is inherent, not auxiliary.",
    },
    derivation: [
      { lines: [6], description: "heapify builds the heap bottom-up in O(n).", cost: "O(n)", dimension: "time" },
      { lines: [7], description: "peek heap[0] reads the root — O(1).", cost: "O(1)", dimension: "time" },
      { lines: [8, 9], description: "push and pop sift along one height ~log2(n) — O(log n) each.", cost: "O(log n)", dimension: "time" },
    ],
    assumptions: ["Comparisons are O(1).", "The heap is a complete binary tree so height is ~log2(n).", "0-based indexing: children of i at 2i+1, 2i+2 (heapq convention)."],
    tradeoffs: "A sorted list gives O(1) min but O(n) insert; a heap gives O(log n) insert AND O(log n) removal of the min — better when you repeatedly add and extract the extreme.",
    counters: [],
    fixedDataNote: "This run heapifies 6 elements, pushes/pops a few, and pops from a max-heap. The O(log n) push/pop bound generalises to n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import heapq (bundled standard library)." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: a min-heap keeps the smallest at index 0." },
    { line: 4, executable: true, explanation: "Create an unordered list." },
    { line: 5, executable: true, explanation: "heapify rearranges it into a valid min-heap in O(n)." },
    { line: 6, executable: true, explanation: "heap[0] is the minimum → 1 (O(1) peek)." },
    { line: 7, executable: true, explanation: "heappush inserts 0 and sifts it up (O(log n))." },
    { line: 8, executable: true, explanation: "heappop removes and returns the minimum, which is now 0." },
    { line: 9, executable: true, explanation: "After popping 0, the new minimum is 1." },
    { line: 10, executable: false, explanation: "Blank line." },
    { line: 11, executable: false, explanation: "Comment: Python heaps are min-only; negate for a max-heap." },
    { line: 12, executable: true, explanation: "Negate values so the largest original becomes the smallest negated." },
    { line: 13, executable: true, explanation: "heapify the negated list." },
    { line: 14, executable: true, explanation: "Pop the min of the negated heap and negate back → 8 (the largest original)." },
  ],

  bindings: [
    { variable: "h", model: "heap" },
    { variable: "maxh", model: "heap" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Python's heapq is a MIN-heap. How do you use it as a max-heap, and what are the child-index formulas for the 0-based convention?", answer: "Negate values (push -x, negate on pop) to simulate a max-heap. With 0-based indexing, the children of index i are at 2i+1 and 2i+2.", explanation: "heapq only keeps the smallest at the root, so negating flips the order to get the largest. Its documented 0-based layout places node i's children at 2i+1 and 2i+2 (parent at (i-1)//2)." },
  ],

  experiments: [
    "Push several values and pop repeatedly; note they come out in sorted (ascending) order.",
    "Print the heap list after heapify — confirm only heap[0] is guaranteed smallest, not the whole list.",
    "Build a max-heap of strings by negating a numeric key.",
  ],

  exercises: [
    {
      id: "heap-complete-1",
      kind: "complete-code",
      prompt: "Complete a function that returns the k smallest numbers using a heap.",
      starterCode: "import heapq\ndef k_smallest(nums, k):\n    # TODO: use heapq to return the k smallest\n    pass",
      expected: "import heapq\ndef k_smallest(nums, k):\n    return heapq.nsmallest(k, nums)",
      hints: ["heapq has helpers for smallest/largest.", "nsmallest returns the k smallest.", "return heapq.nsmallest(k, nums)"],
    },
    {
      id: "heap-choose-1",
      kind: "choose-approach",
      prompt: "You repeatedly insert numbers and must always fetch the current minimum. A sorted list or a heap? Give the per-operation complexities.",
      expected: "A heap: insert O(log n) and extract-min O(log n), peek O(1). A sorted list gives O(1) min but O(n) insertion. The heap wins when you interleave many inserts and extractions.",
      hints: ["How costly is inserting into a sorted list?", "O(n) to keep it sorted.", "A heap inserts in O(log n) and extracts min in O(log n)."],
    },
  ],

  review: `A **heap** keeps the extreme element at the root: **min-heap** (Python \`heapq\`, min-only) has the smallest at \`heap[0]\`. \`heapify\` builds in **O(n)**, \`heappush\`/\`heappop\` are **O(log n)** (tree height ~log₂n), peek is **O(1)**. heapq uses **0-based indexing** (children of i at 2i+1, 2i+2) — unlike 1-based textbooks — and needs value **negation** for a max-heap. Heaps power priority queues, top-K, and greedy graph algorithms.`,

  expectedOutput: "1\n0\n1\n8\n",

  references: [
    {
      url: "https://docs.python.org/3/library/heapq.html",
      title: "heapq — Heap queue algorithm — Python 3.14 documentation",
      section: "Zero-based indexing; heappush/heappop/heapify",
      topic: "heaps/min-max",
      purpose: "Confirm heapq is a min-heap with 0-based indexing, heap[0] is smallest, and push/pop are O(log n) while heapify is O(n).",
      verifiedClaims: ["heapq uses zero-based indexing (children of i at 2i+1, 2i+2)", "heappop returns the smallest item", "push/pop are O(log n); heapify is O(n)"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://algs4.cs.princeton.edu/24pq/",
      title: "Priority Queues — Algorithms, 4th Edition (Princeton)",
      section: "Binary heap representation and complexity",
      topic: "heaps/min-max",
      purpose: "Cross-check heap properties/complexity and note the 1-based indexing convention Princeton uses (reconciled to heapq's 0-based).",
      verifiedClaims: ["Binary-heap insert and delete-max/min are O(log n); Princeton uses 1-based indexing"],
      accessDate: "2026-09-20",
    },
  ],
};
