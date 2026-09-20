/**
 * Lesson: Min/max heaps (Heaps). Verified on the bundled CPython 3.14.2.
 * Output: "1\n0\n1\n9\n9\n8\n".
 *
 * R5.2: corrected the previously WRONG claim that "Python only has a min-heap".
 * Python 3.14 added a native max-heap API (heapify_max / heappush_max /
 * heappop_max / heapreplace_max / heappushpop_max — all "Added in version 3.14"
 * per the official docs, and proven present on the bundled 3.14.2 runtime).
 * Negation is now taught as the PORTABLE alternative, not a necessity.
 */

import type { LessonDefinition } from "../../core/types";

const code = `import heapq

# A min-heap keeps the SMALLEST item instantly reachable at index 0.
h = [5, 3, 8, 1, 9, 2]
heapq.heapify(h)             # O(n): rearrange the list into a valid min-heap
print(h[0])                  # peek the minimum in O(1)
heapq.heappush(h, 0)         # insert in O(log n)
print(heapq.heappop(h))      # remove & return the minimum in O(log n)
print(h[0])                  # new minimum after the pop

# Python 3.14 added a native MAX-heap API (the *_max functions).
mx = [5, 3, 8, 1, 9, 2]
heapq.heapify_max(mx)        # O(n): build a max-heap in place
print(mx[0])                 # the LARGEST is now at index 0
print(heapq.heappop_max(mx)) # remove & return the maximum in O(log n)

# Portable alternative (works before 3.14 too): negate the values.
neg = [-x for x in [5, 3, 8, 1]]
heapq.heapify(neg)
print(-heapq.heappop(neg))   # pop the largest ORIGINAL value`;

export const minMaxHeaps: LessonDefinition = {
  id: "min-max-heaps",
  title: "Min and Max Heaps",
  area: "Heaps",
  prerequisites: ["array-traversal", "binary-search"],

  explanation: `A **heap** is a tree-shaped structure (stored compactly in an array) that always keeps the **most extreme element instantly reachable at the top**. A **min-heap** keeps the smallest at the root; a **max-heap** keeps the largest. You don't get full sorted order — only the guarantee that the root is the min (or max) — and that limited promise is exactly what makes insert and remove cheap: **O(log n)**, with an **O(1)** peek.

Python's \`heapq\` module works on a plain list. By convention the **unqualified functions build a min-heap** (\`heap[0]\` is the smallest, \`heappop\` returns the smallest). **Since Python 3.14 there is also a native max-heap API**: \`heapify_max\`, \`heappush_max\`, \`heappop_max\` (plus \`heapreplace_max\`/\`heappushpop_max\`) keep the **largest** at \`maxheap[0]\`. Both families use **zero-based indexing** (children of index \`i\` at \`2i+1\` and \`2i+2\`, parent at \`(i-1)//2\`), which differs from many textbooks (e.g. Princeton) that use **1-based** indexing and default to a max-heap — a convention clash worth knowing when you read other sources.

Before 3.14 (and still, if you want code that runs on 3.11–3.13) the classic way to get a max-heap is to **negate the values**: push \`-x\` and negate again on pop. That trick still works and is worth understanding. The core costs are the same either way: \`heapify\`/\`heapify_max\` **builds** a heap in **O(n)** (cheaper than n separate inserts), \`heappush\`/\`heappop\` are **O(log n)**, and reading the root is **O(1)**. Heaps are the engine of priority queues, top-K, and the greedy graph algorithms (Dijkstra, Prim) coming later.`,

  vocabulary: [
    { term: "Heap", definition: "A complete binary tree (stored as an array) keeping the extreme element at the root." },
    { term: "Min-heap", definition: "A heap whose smallest element is always at the root (heap[0]); heapq's default." },
    { term: "Max-heap", definition: "A heap whose largest element is at the root; use heapq's *_max functions (Python 3.14+) or negate values on older versions." },
    { term: "Heap invariant", definition: "Each parent is <= its children (min-heap) or >= its children (max-heap), maintained by push/pop." },
    { term: "heapify / heapify_max", definition: "Rearrange a list into a valid min-heap / max-heap in O(n)." },
    { term: "Zero-based indexing", definition: "heapq convention: root at index 0; children of i at 2i+1 and 2i+2." },
  ],

  concepts: {
    purpose: "Provide O(log n) insert/remove of the smallest (or largest) element and O(1) peek — the core of priority queues.",
    operations: "heapify / heapify_max (O(n) build), heappush(_max) / heappop(_max) (O(log n)), heap[0] peek (O(1)).",
    uses: "Priority queues, top-K, Dijkstra/Prim, scheduling, streaming extremes.",
    tradeoffs: "Only the root is instantly available (not full order); push/pop are O(log n), not O(1). A max-heap via the native *_max API is clearer than negation, but negation is portable to pre-3.14 runtimes.",
    commonMistakes: "Expecting the whole heap to be sorted (only heap[0] is guaranteed); mixing min and max functions on the same list; using 1-based child formulas from textbooks with heapq's 0-based layout.",
    edgeCases: "heappop / heappop_max on an empty heap raises IndexError. Duplicates are fine. A single element is a valid heap.",
  },

  complexity: [
    { operation: "heapify / heapify_max (build)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "In-place build is O(n), cheaper than n inserts." },
    { operation: "heappush / heappop (and *_max)", best: "O(1)", average: "O(log n)", worst: "O(log n)", note: "Sift up/down along the tree height." },
    { operation: "peek heap[0]", best: "O(1)", average: "O(1)", worst: "O(1)", note: "The root is the extreme element." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in the heap" }],
    costModel: "The heap is a complete binary tree of height ~log2(n). push/pop sift an element along one root-to-leaf path (O(log n)). heapify/heapify_max sift down all nodes but the total is O(n) by the standard bottom-up analysis.",
    time: {
      bound: "O(log n)",
      case: "worst",
      explanation: "The heap's height is about log2(n) because it is a complete binary tree. heappush places the new item at the end and sifts it UP toward the root, and heappop moves the last item to the root and sifts it DOWN — each traverses at most one full height, so both are O(log n). The *_max functions have identical costs. Peeking heap[0] is O(1). Building a heap with heapify/heapify_max looks like O(n log n) but a careful bottom-up analysis shows it is O(n).",
      otherCases: [
        { case: "best", bound: "O(1)", note: "A push/pop that needs no sifting (already in place)." },
      ],
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Operations sift within the existing array using a few variables; no extra structure grows with n. (heapify/heapify_max are in place.)",
      inputOutputNote: "The heap list of n elements is the data; its O(n) size is inherent, not auxiliary. The negation example (line 18) builds a NEW list of n negated values, which is O(n) auxiliary — one reason the native *_max API can be preferable.",
    },
    derivation: [
      { lines: [5], description: "heapify BUILDS the min-heap bottom-up in O(n) — this is heap CONSTRUCTION, not a single push/pop.", cost: "O(n)", dimension: "time" },
      { lines: [6], description: "peek h[0] reads the root — O(1).", cost: "O(1)", dimension: "time" },
      { lines: [7, 8], description: "one push and one pop each sift along one height ~log2(n) — O(log n) each.", cost: "O(log n)", dimension: "time" },
      { lines: [13], description: "heapify_max BUILDS a max-heap in O(n) (construction).", cost: "O(n)", dimension: "time" },
      { lines: [15], description: "heappop_max removes the maximum, sifting down one height — O(log n).", cost: "O(log n)", dimension: "time" },
    ],
    assumptions: ["Comparisons are O(1).", "The heap is a complete binary tree so height is ~log2(n).", "0-based indexing: children of i at 2i+1, 2i+2 (heapq convention, both min and max families).", "The native *_max functions require Python 3.14+ (present on the bundled 3.14.2 runtime)."],
    tradeoffs: "A sorted list gives O(1) min but O(n) insert; a heap gives O(log n) insert AND O(log n) removal of the extreme — better when you repeatedly add and extract. For a max-heap, the native *_max API avoids the O(n) negated copy the negation trick needs.",
    counters: [],
    fixedDataNote: "This run heapifies 6 elements twice (once min, once max), pushes/pops a few, and pops from a negated max-heap. The O(log n) push/pop and O(n) build bounds generalise to n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import heapq (bundled standard library)." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: a min-heap keeps the smallest at index 0." },
    { line: 4, executable: true, explanation: "Create an unordered list." },
    { line: 5, executable: true, explanation: "heapify rearranges it into a valid MIN-heap in O(n) (heap construction)." },
    { line: 6, executable: true, explanation: "h[0] is the minimum → 1 (O(1) peek)." },
    { line: 7, executable: true, explanation: "heappush inserts 0 and sifts it up (O(log n))." },
    { line: 8, executable: true, explanation: "heappop removes and returns the minimum, which is now 0." },
    { line: 9, executable: true, explanation: "After popping 0, the new minimum is 1." },
    { line: 10, executable: false, explanation: "Blank line." },
    { line: 11, executable: false, explanation: "Comment: Python 3.14 added a native max-heap API." },
    { line: 12, executable: true, explanation: "Fresh unordered list for the max-heap demo." },
    { line: 13, executable: true, explanation: "heapify_max builds a MAX-heap in place in O(n) (3.14+)." },
    { line: 14, executable: true, explanation: "mx[0] is now the largest → 9 (O(1) peek)." },
    { line: 15, executable: true, explanation: "heappop_max removes and returns the maximum → 9 (O(log n))." },
    { line: 16, executable: false, explanation: "Blank line." },
    { line: 17, executable: false, explanation: "Comment: negation is the portable alternative (pre-3.14)." },
    { line: 18, executable: true, explanation: "Negate values so the largest original becomes the smallest negated (allocates a new O(n) list)." },
    { line: 19, executable: true, explanation: "heapify the negated list into a min-heap." },
    { line: 20, executable: true, explanation: "Pop the min of the negated heap and negate back → 8 (the largest original)." },
  ],

  bindings: [
    { variable: "h", model: "heap" },
    { variable: "mx", model: "heap" },
    { variable: "neg", model: "heap" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "How can you get a MAX-heap in Python 3.14, and what are the child-index formulas for heapq's 0-based layout?", answer: "Use the native max-heap API — heapify_max / heappush_max / heappop_max — which keeps the largest at maxheap[0]. (Portable alternative: negate values with the min-heap functions.) With 0-based indexing, the children of index i are at 2i+1 and 2i+2 (parent at (i-1)//2).", explanation: "Python 3.14 added the *_max functions so you no longer NEED negation for a max-heap, though negation still works and is portable to older versions. heapq's documented 0-based layout places node i's children at 2i+1 and 2i+2." },
  ],

  experiments: [
    "Push several values and pop repeatedly with heappop; note they come out in ascending order. Do the same with heappop_max and note descending order.",
    "Print the heap list after heapify — confirm only heap[0] is guaranteed smallest, not the whole list.",
    "Build a max-heap two ways — heapify_max vs negating — and confirm the roots agree.",
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

  review: `A **heap** keeps the extreme element at the root. In Python's \`heapq\`, the unqualified functions build a **min-heap** (smallest at \`heap[0]\`); **Python 3.14 also provides a native max-heap API** (\`heapify_max\`/\`heappush_max\`/\`heappop_max\`, largest at \`maxheap[0]\`). \`heapify\`/\`heapify_max\` **build** in **O(n)**, \`heappush\`/\`heappop\` are **O(log n)** (tree height ~log₂n), peek is **O(1)**. heapq uses **0-based indexing** (children of i at 2i+1, 2i+2) — unlike 1-based textbooks. The classic **negation** trick still gives a max-heap on older versions. Heaps power priority queues, top-K, and greedy graph algorithms.`,

  expectedOutput: "1\n0\n1\n9\n9\n8\n",

  references: [
    {
      url: "https://docs.python.org/3.14/library/heapq.html",
      title: "heapq — Heap queue algorithm — Python 3.14 documentation",
      section: "Min-heap functions; Max-heap functions (heapify_max/heappush_max/heappop_max, 'Added in version 3.14'); zero-based indexing note",
      topic: "heaps/min-max",
      purpose: "Confirm heapq's unqualified functions are a min-heap, the *_max family (3.14+) is a native max-heap, heap[0]/maxheap[0] holds the extreme, push/pop are O(log n), and heapify/heapify_max build in linear time. Reconcile heapq's 0-based indexing against textbook 1-based/max-heap conventions.",
      verifiedClaims: [
        "Python 3.14 adds heapify_max, heappush_max, heappop_max, heapreplace_max, heappushpop_max (all 'Added in version 3.14')",
        "Unqualified heapq functions build a min-heap; heap[0] is the smallest, maxheap[0] the largest",
        "heapify/heapify_max transform a list into a heap in linear time (O(n))",
        "heapq uses zero-based indexing (children of i at 2i+1, 2i+2); textbooks often use 1-based and favour max-heaps",
      ],
      conventions: ["0-based heap indexing (heapq)", "unqualified 'heap' means min-heap"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://algs4.cs.princeton.edu/24pq/",
      title: "Priority Queues — Algorithms, 4th Edition (Princeton)",
      section: "Binary heap representation and complexity",
      topic: "heaps/min-max",
      purpose: "Cross-check heap properties/complexity and note the 1-based indexing / max-heap convention Princeton uses (reconciled to heapq's 0-based min-heap default).",
      verifiedClaims: ["Binary-heap insert and delete-max/min are O(log n); Princeton uses 1-based indexing and a max-oriented default"],
      conventions: ["1-based heap indexing (textbook)"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "61cd5c3b9fa56435",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
