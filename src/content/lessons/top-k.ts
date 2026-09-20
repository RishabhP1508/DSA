/**
 * Lesson: Top-K elements (Heaps). Verified on CPython 3.14.
 * Output: "[12, 11, 5]\n[12, 11, 5]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `import heapq

# Quick way: heapq.nlargest returns the k largest, already sorted desc.
def top_k(nums, k):
    return heapq.nlargest(k, nums)
print(top_k([3, 1, 5, 12, 2, 11], 3))

# Streaming way: keep a MIN-heap of size k (the k largest seen so far).
def top_k_heap(nums, k):
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)      # drop the smallest -> keeps k largest
    return sorted(h, reverse=True)
print(top_k_heap([3, 1, 5, 12, 2, 11], 3))`;

export const topK: LessonDefinition = {
  id: "top-k",
  title: "Top-K Elements",
  area: "Heaps",
  prerequisites: ["min-max-heaps"],

  explanation: `Finding the **k largest** (or smallest) elements is a classic heap problem, and the elegant solution is counterintuitive: to keep the **k largest**, maintain a **min-heap of size k**. As you scan, push each element; whenever the heap exceeds size k, pop the **smallest** — which discards whatever is currently least among your candidates. Whatever remains is always the k largest seen so far, and the very smallest of those (the kth largest) sits conveniently at \`heap[0]\`.

Why a heap of size **k** rather than sorting everything? Sorting the whole array is **O(n log n)**. The size-k heap approach is **O(n log k)** — each of the n elements does an O(log k) push/pop against a heap that never grows past k. When **k is much smaller than n** (the common case: "top 10 of a million"), \`log k\` is tiny, so this is a real win, and it uses only **O(k)** space. It also works on a **stream** where you can't hold all n elements at once.

Python's \`heapq.nlargest(k, nums)\` does exactly this internally and returns the results sorted. The recognition cue: "the k biggest/smallest / most frequent" → a bounded heap of size k. (For the single **kth** element specifically, the next lesson refines this.)`,

  vocabulary: [
    { term: "Top-K", definition: "The k largest (or smallest) elements of a collection." },
    { term: "Size-k min-heap", definition: "A heap capped at k elements holding the k largest seen so far." },
    { term: "nlargest / nsmallest", definition: "heapq helpers returning the k largest/smallest, sorted." },
    { term: "Streaming", definition: "Processing elements one at a time without storing them all." },
    { term: "Bounded heap", definition: "A heap kept at a fixed maximum size by popping when it overflows." },
  ],

  concepts: {
    purpose: "Select the k most extreme elements efficiently, especially when k << n or data streams in.",
    operations: "Keep a size-k min-heap: push each element, pop the smallest when size exceeds k.",
    uses: "Top-K frequent, k closest points, k largest numbers, leaderboards, streaming analytics.",
    tradeoffs: "O(n log k) time and O(k) space — better than full sort's O(n log n) when k is small.",
    commonMistakes: "Using a max-heap of size k (wrong — you need a MIN-heap to cheaply drop the smallest); sorting everything when k is tiny; forgetting the heap holds the k LARGEST while its root is the smallest of them.",
    edgeCases: "k >= n returns everything (sorted). k = 0 returns nothing. Duplicates are kept.",
  },

  complexity: [
    { operation: "Top-K (size-k heap)", best: "O(n log k)", average: "O(n log k)", worst: "O(n log k)", space: "O(k)", note: "n pushes/pops against a heap capped at k; beats O(n log n) sort when k << n." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of elements" },
      { symbol: "k", meaning: "how many top elements to return" },
    ],
    costModel: "Each heappush/heappop on a heap of size <= k is O(log k). We do one per element.",
    time: {
      bound: "O(n log k)",
      case: "worst",
      explanation: "We scan all n elements; for each we do a push and possibly a pop against a heap that never exceeds size k, so each operation is O(log k). That gives O(n log k). Sorting the whole array to take the top k would be O(n log n) — worse whenever k is much smaller than n (e.g. top 10 of a million: log k ≈ 3 vs log n ≈ 20).",
    },
    space: {
      bound: "O(k)",
      case: "worst",
      explanation: "The heap holds at most k elements at any time, so auxiliary space is O(k) — independent of n, which is what makes it work on large or streaming inputs.",
      inputOutputNote: "The input of n elements is separate; the size-k heap (and the returned k results) is O(k).",
    },
    derivation: [
      { lines: [11], description: "Scan each of the n elements once.", cost: "O(n)", dimension: "time" },
      { lines: [12, 13, 14], description: "Each element does a push and maybe a pop on a heap of size <= k: O(log k).", cost: "O(n log k)", dimension: "time" },
      { lines: [10], description: "The heap holds at most k elements.", cost: "O(k)", dimension: "space" },
    ],
    assumptions: ["Comparisons are O(1).", "The heap is capped at k by popping on overflow."],
    tradeoffs: "Full sort is O(n log n) time / O(n) space; the size-k heap is O(n log k) / O(k) — strictly better when k << n and it also handles streams. Quickselect finds the kth element in expected O(n) but doesn't keep the heap.",
    counters: [{ label: "elements processed", definition: "iterations of the scan (line 11)", countLines: [11] }],
    fixedDataNote: "This run finds the top 3 of 6 elements → [12, 11, 5]. The O(n log k) bound generalises to n elements and k targets.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import heapq." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: nlargest is the quick helper." },
    { line: 4, executable: true, explanation: "Define top_k using the built-in helper." },
    { line: 5, executable: true, explanation: "nlargest(k, nums) returns the k largest, sorted descending." },
    { line: 6, executable: true, explanation: "Top 3 of the sample → [12, 11, 5]." },
    { line: 7, executable: false, explanation: "Blank line." },
    { line: 8, executable: false, explanation: "Comment: the streaming size-k min-heap approach." },
    { line: 9, executable: true, explanation: "Define top_k_heap." },
    { line: 10, executable: true, explanation: "Start with an empty heap." },
    { line: 11, executable: true, explanation: "Process each element." },
    { line: 12, executable: true, explanation: "Push it (O(log k) since the heap stays near size k)." },
    { line: 13, executable: true, explanation: "If the heap grew past k..." },
    { line: 14, executable: true, explanation: "...pop the smallest — discarding the least of the current candidates." },
    { line: 15, executable: true, explanation: "Return the k largest, sorted descending." },
    { line: 16, executable: true, explanation: "Same result → [12, 11, 5]." },
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
    { atEventIndex: 0, prompt: "To keep the k LARGEST elements, why do we use a MIN-heap of size k rather than a max-heap?", answer: "Because a min-heap's root is the smallest of the k candidates, so when the heap overflows we can pop that smallest in O(log k) — cheaply discarding the weakest candidate. A max-heap would keep the largest at the root, which we don't want to remove.", explanation: "We want to repeatedly evict the smallest among our current top-k. A min-heap exposes exactly that element at the root for O(log k) removal, keeping the k largest." },
  ],

  experiments: [
    "Set k >= len(nums) and confirm it returns everything.",
    "Track heap[0] as you process — it's always the kth largest so far.",
    "Compare operation counts of the size-k heap vs sorting the whole array for small k.",
  ],

  exercises: [
    {
      id: "topk-choose-1",
      kind: "choose-approach",
      prompt: "You need the 10 largest of 10 million numbers arriving as a stream. Full sort or a size-k heap? Give complexities.",
      expected: "A size-k (min-)heap: O(n log k) ≈ O(n·log 10) and O(k) = O(10) space, and it works on a stream. Full sort is O(n log n) and needs all n in memory — much worse.",
      hints: ["Can you hold 10 million in memory / is it streamed?", "k is tiny (10).", "Size-k heap: O(n log k), O(k) space."],
    },
    {
      id: "topk-fix-1",
      kind: "fix-mistake",
      prompt: "This is meant to keep the k largest but keeps the k smallest. Fix the overflow handling (it should keep a min-heap and pop the smallest).",
      starterCode: "h = []\nfor x in nums:\n    heapq.heappush(h, -x)\n    if len(h) > k:\n        heapq.heappop(h)",
      expected: "h = []\nfor x in nums:\n    heapq.heappush(h, x)\n    if len(h) > k:\n        heapq.heappop(h)",
      hints: ["Negating makes it behave like a max-heap, so popping removes the largest.", "For the k LARGEST you want a plain min-heap.", "Push x (not -x) so heappop drops the smallest."],
    },
  ],

  review: `**Top-K**: keep a **min-heap of size k** to hold the k largest — push each element, and pop the smallest whenever the heap exceeds k (its root is the kth largest). This is **O(n log k)** time and **O(k)** space, beating a full **O(n log n)** sort when k << n, and it works on streams. \`heapq.nlargest(k, nums)\` does this for you.`,

  expectedOutput: "[12, 11, 5]\n[12, 11, 5]\n",

  references: [
    {
      url: "https://docs.python.org/3/library/heapq.html",
      title: "heapq — Heap queue algorithm — Python 3.14 documentation",
      section: "nlargest / nsmallest",
      topic: "heaps/top-k",
      purpose: "Confirm nlargest returns the k largest and that a bounded heap yields top-k efficiently.",
      verifiedClaims: ["heapq.nlargest(k, iterable) returns the k largest elements"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Heap / Priority Queue — Kth Largest / Top K",
      topic: "heaps/top-k",
      purpose: "Cross-check the size-k min-heap approach and its O(n log k) complexity for top-K problems.",
      verifiedClaims: ["A size-k min-heap solves top-K in O(n log k) time and O(k) space"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "d6c5c509562d860a",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
