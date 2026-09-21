/**
 * Lesson: Kth largest / smallest (Heaps). Verified on CPython 3.14.
 * Output: "5\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `import heapq

# The kth LARGEST element via a size-k min-heap.
def kth_largest(nums, k):
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)   # keep only the k largest
    return h[0]                # smallest of the k largest = kth largest

print(kth_largest([3, 2, 1, 5, 6, 4], 2))`;

export const kthLargest: LessonDefinition = {
  id: "kth-largest",
  title: "Kth Largest / Smallest",
  area: "Heaps",
  prerequisites: ["top-k"],

  explanation: `Finding the **kth largest** element is a focused version of top-K: you don't need all k, just the single boundary element. The same **size-k min-heap** trick delivers it directly — once the heap holds the k largest elements, the **smallest of those** (at \`heap[0]\`) *is* the kth largest. So after scanning, you just return \`heap[0]\`.

This is **O(n log k)** time and **O(k)** space — the reason to prefer it over sorting the whole array (**O(n log n)**) when k is small, and it handles streams. For the **kth smallest**, mirror it: keep a size-k max-heap (negate values) whose root becomes the kth smallest.

There's an important alternative worth knowing: **Quickselect** (a partial quicksort using the partition step) finds the kth element in **expected O(n)** time and O(1) extra space — asymptotically faster than the heap on average, but with an **O(n²)** worst case and no streaming ability. So the trade is: **heap** = O(n log k), streaming-friendly, predictable; **quickselect** = expected O(n) but worst-case O(n²) and needs the whole array in memory. The cue "the kth largest/smallest" should make you weigh these two.`,

  vocabulary: [
    { term: "Kth largest", definition: "The element that would be at position k from the top if sorted descending." },
    { term: "Size-k min-heap", definition: "Holds the k largest; its root (heap[0]) is the kth largest." },
    { term: "Quickselect", definition: "A partition-based selection giving the kth element in expected O(n)." },
    { term: "Boundary element", definition: "The single element separating the top k from the rest." },
  ],

  concepts: {
    purpose: "Retrieve just the kth largest/smallest element efficiently.",
    operations: "Maintain a size-k min-heap (kth largest = heap[0]); or use quickselect for expected O(n).",
    uses: "Kth largest in an array/stream, order statistics, percentile-style queries.",
    tradeoffs: "Heap: O(n log k), streaming, predictable. Quickselect: expected O(n) but worst O(n²), needs full array.",
    commonMistakes: "Returning the wrong heap end (kth largest is heap[0], the smallest of the top-k); using a max-heap for kth largest; assuming quickselect is always faster (bad pivots → O(n²)).",
    edgeCases: "k = 1 gives the maximum. k = n gives the minimum. Duplicates count toward positions.",
  },

  complexity: [
    { operation: "Kth largest (size-k heap)", best: "O(n log k)", average: "O(n log k)", worst: "O(n log k)", space: "O(k)", note: "Alternative: quickselect expected O(n), worst O(n²)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of elements" },
      { symbol: "k", meaning: "the rank to find (kth largest)" },
    ],
    costModel: "Each push/pop on a heap of size <= k is O(log k); one per element. Peeking heap[0] is O(1).",
    time: {
      bound: "O(n log k)",
      case: "worst",
      explanation: "We process all n elements, each an O(log k) push/pop against a heap capped at k, giving O(n log k). Returning heap[0] is O(1). This beats sorting (O(n log n)) when k << n. Quickselect is an alternative at expected O(n), but its worst case is O(n²) and it needs the entire array in memory (no streaming).",
    },
    space: {
      bound: "O(k)",
      case: "worst",
      explanation: "Only the size-k heap is kept — O(k) auxiliary space, independent of n.",
      inputOutputNote: "The input of n elements is separate from the O(k) heap.",
    },
    derivation: [
      { lines: [6], description: "Scan each of the n elements once.", cost: "O(n)", dimension: "time" },
      { lines: [7, 8, 9], description: "Each element: push and maybe pop on a heap of size <= k — O(log k).", cost: "O(n log k)", dimension: "time" },
      { lines: [10], description: "Return heap[0] — O(1) peek.", cost: "O(1)", dimension: "time" },
      { lines: [5], description: "The heap holds at most k elements.", cost: "O(k)", dimension: "space" },
    ],
    assumptions: ["Comparisons are O(1).", "Heap capped at k by popping on overflow."],
    tradeoffs: "Quickselect: expected O(n) time, O(1) extra space, but O(n²) worst case and requires the full array. The heap trades a log k factor for predictability and streaming support.",
    counters: [{ label: "elements processed", definition: "iterations of the scan (line 6)", countLines: [6] }],
    fixedDataNote: "This run finds the 2nd largest of 6 elements → 5. The O(n log k) bound generalises to n elements and rank k.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import heapq." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: kth largest via a size-k min-heap." },
    { line: 4, executable: true, explanation: "Define kth_largest(nums, k)." },
    { line: 5, executable: true, explanation: "Start with an empty heap." },
    { line: 6, executable: true, explanation: "Process each element." },
    { line: 7, executable: true, explanation: "Push it (O(log k))." },
    { line: 8, executable: true, explanation: "If the heap exceeds k..." },
    { line: 9, executable: true, explanation: "...pop the smallest, keeping only the k largest." },
    { line: 10, executable: true, explanation: "The root is the smallest of the k largest = the kth largest." },
    { line: 11, executable: false, explanation: "Blank line." },
    { line: 12, executable: true, explanation: "2nd largest of [3, 2, 1, 5, 6, 4] is 5." },
  ],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [{ role: "pointer", label: "x", source: "x" }],
    },
    { variable: "h", model: "heap" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "After the size-k min-heap holds the k largest elements, which element is the kth largest, and where is it?", answer: "The smallest of those k, which is at heap[0] (the root of the min-heap).", explanation: "The heap contains exactly the k largest values; the min-heap keeps their minimum at the root, and that minimum is precisely the kth largest overall." },
  ],

  experiments: [
    "Set k = 1 and confirm it returns the maximum.",
    "Adapt it to kth SMALLEST by negating values (size-k max-heap).",
    "Discuss when quickselect's expected O(n) would beat the heap.",
  ],

  exercises: [
    {
      id: "kth-choose-1",
      kind: "choose-approach",
      prompt: "Kth largest in a fixed in-memory array with no streaming. Heap (O(n log k)) or quickselect (expected O(n))? What's the risk with quickselect?",
      expected: "Quickselect is faster on average (expected O(n)) and O(1) extra space, but risks O(n²) with bad pivots (mitigated by random/median pivots). The heap is O(n log k) but predictable and streaming-capable.",
      hints: ["Which is faster on average?", "Quickselect, expected O(n).", "But its worst case is O(n²) without good pivot choice."],
    },
    {
      id: "kth-complete-1",
      kind: "complete-code",
      prompt: "Complete kth_smallest using a size-k MAX-heap (via negation).",
      starterCode: "import heapq\ndef kth_smallest(nums, k):\n    h = []\n    for x in nums:\n        # TODO: keep the k smallest using a max-heap of negatives\n        pass\n    return -h[0]",
      expected: "import heapq\ndef kth_smallest(nums, k):\n    h = []\n    for x in nums:\n        heapq.heappush(h, -x)\n        if len(h) > k:\n            heapq.heappop(h)\n    return -h[0]",
      hints: ["Negate values to simulate a max-heap.", "Pop when size exceeds k to keep the k smallest.", "push -x; if len>k: heappop; return -h[0]"],
    },
  ],

  review: `The **kth largest** is the smallest of the top-k, so a **size-k min-heap** gives it as \`heap[0]\` in **O(n log k)** time / **O(k)** space — streaming-friendly and predictable. Mirror with a size-k max-heap for kth smallest. The alternative, **quickselect**, is expected **O(n)** with O(1) space but risks O(n²) and needs the full array. Choose based on streaming and worst-case needs.`,

  expectedOutput: "5\n",

  references: [
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Heap / Priority Queue — Kth Largest Element",
      topic: "heaps/kth",
      purpose: "Confirm the size-k heap solution for kth largest and its comparison with quickselect.",
      verifiedClaims: ["kth largest via a size-k min-heap is O(n log k); quickselect is expected O(n)"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://docs.python.org/3/library/heapq.html",
      title: "heapq — Heap queue algorithm — Python 3.14 documentation",
      section: "heappush / heappop / nlargest",
      topic: "heaps/kth",
      purpose: "Confirm the heap operations used and that heap[0] is the current minimum.",
      verifiedClaims: ["heap[0] is the smallest element; push/pop are O(log n)"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "26a1e3942362c56d",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
