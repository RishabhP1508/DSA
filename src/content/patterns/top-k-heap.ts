/**
 * Pattern: Top-K with a heap.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "[12, 11, 5]\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `import heapq

# Top-K with a heap: keep the k LARGEST using a MIN-heap of size k.
def k_largest(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)      # drop the smallest -> the k largest remain
    return sorted(heap, reverse=True)

print(k_largest([3, 1, 5, 12, 2, 11], 3))  # [12, 11, 5]`;

export const topKHeapPattern: PatternDefinition = {
  id: "top-k-heap",
  title: "Top-K with a Heap",
  category: "Heaps & priority",
  summary:
    "Keep only the k best elements in a size-k heap so you spend O(n log k) instead of sorting everything in O(n log n).",

  clues: [
    "You need the K LARGEST/SMALLEST, the K-th element, the K most frequent, or K closest points.",
    "You do NOT need the whole thing sorted — just the top k.",
    "The data may be large or STREAMING (you can't hold or re-sort it all).",
    "Phrases like 'top k', 'k-th largest', 'k closest', 'k most frequent'.",
  ],

  naiveApproach: `Sort everything and take the first k — **O(n log n)** time and O(n) space. That fully orders n elements when you only care about k of them, and it doesn't work for an unbounded stream you can't store or re-sort.`,

  whyItHelps: `Maintain a heap of **at most k** elements. To keep the **k largest**, use a **min-heap**: push each element, and whenever the heap exceeds size k, **pop the smallest** — so the heap always holds the k biggest seen so far and its root is the k-th largest. Each push/pop is **O(log k)**, so processing n elements is **O(n log k)** time and **O(k)** space — better than O(n log n) when k ≪ n, and it works on a **stream** because you only ever hold k items. (For the k smallest, use a max-heap by negating values.)`,

  conditions: [
    "You want k ≪ n; if k ≈ n, sorting is just as good.",
    "For k LARGEST use a MIN-heap (pop the smallest); for k SMALLEST use a MAX-heap (Python: push negatives).",
    "Elements are comparable (or you supply a key, e.g. (frequency, item) tuples for 'k most frequent').",
  ],

  alternatives: [
    "Full sort — simplest when you also need everything ordered or when k is close to n.",
    "Quickselect — O(n) average to find the k-th element / unordered top-k when all data is in memory (not for streams).",
    "heapq.nlargest / nsmallest — the same idea packaged; use directly in practice.",
    "Bucket sort by count — for 'k most frequent' when values are bounded, O(n).",
  ],

  counterexamples: [
    "Using a MAX-heap for the k largest and popping is wrong — you'd discard the biggest; the size-k heap for k largest must be a MIN-heap.",
    "When you need the FULL sorted order, top-k heap doesn't save you — just sort.",
    "For a single k-th element with all data in memory, quickselect's O(n) average beats O(n log k).",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "[12, 11, 5]\n",
  complexityNote:
    "O(n log k) time — n pushes/pops each O(log k). O(k) space for the heap. Sorting everything is O(n log n) time and O(n) space.",

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import heapq (a binary MIN-heap)." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: keep k largest using a size-k min-heap." },
    { line: 4, executable: true, explanation: "Define k_largest(nums, k)." },
    { line: 5, executable: true, explanation: "Start with an empty heap." },
    { line: 6, executable: true, explanation: "Process each element (works for a stream too)." },
    { line: 7, executable: true, explanation: "Push the element (O(log k))." },
    { line: 8, executable: true, explanation: "If the heap now exceeds k elements..." },
    { line: 9, executable: true, explanation: "...pop the smallest, so only the k largest remain; the root is the k-th largest." },
    { line: 10, executable: true, explanation: "Return the k largest, biggest first." },
    { line: 11, executable: false, explanation: "Blank line." },
    { line: 12, executable: true, explanation: "The 3 largest of [3,1,5,12,2,11] are [12, 11, 5]." },
  ],

  bindings: [{ variable: "heap", model: "heap" }],

  linkedLessons: ["top-k", "kth-largest", "min-max-heaps", "running-median"],

  exercises: [
    {
      id: "pat-tk-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'From a huge stream of numbers you can't store fully, report the 100 largest.' Which pattern, and what heap type?",
      expected:
        "Top-K with a heap: a size-100 MIN-heap. Push each number; if size exceeds 100, pop the smallest. O(n log 100) time, O(100) space, and it works on a stream since only 100 items are held.",
      correctPatternId: "top-k-heap",
      hints: [
        "You can't sort a stream you can't store.",
        "Hold only the k best.",
        "k largest → min-heap of size k.",
      ],
    },
    {
      id: "pat-tk-fix-1",
      kind: "fix-mistake",
      prompt:
        "This is supposed to keep the k LARGEST but throws away the wrong ones. Fix it (Python heapq is a min-heap).",
      starterCode:
        "heap = []\nfor x in nums:\n    heapq.heappush(heap, -x)\n    if len(heap) > k:\n        heapq.heappop(heap)\nreturn sorted([-v for v in heap], reverse=True)",
      expected:
        "heap = []\nfor x in nums:\n    heapq.heappush(heap, x)\n    if len(heap) > k:\n        heapq.heappop(heap)\nreturn sorted(heap, reverse=True)",
      hints: [
        "Negating makes the smallest values look largest.",
        "For k LARGEST, keep a plain MIN-heap and pop the smallest.",
        "Push x (not -x); pop removes the current smallest.",
      ],
    },
    {
      id: "pat-tk-choose-1",
      kind: "choose-approach",
      prompt:
        "You have all n numbers in memory and want just the single k-th largest. Top-k heap or quickselect?",
      expected:
        "Quickselect: O(n) average to find the k-th largest when everything is in memory. The heap approach is O(n log k) and is preferred for streams or when you need all top-k, not a single order statistic.",
      correctPatternId: "top-k-heap",
      hints: [
        "In-memory single order statistic favors quickselect.",
        "Heaps shine for streams or all-of-top-k.",
        "Compare O(n) vs O(n log k).",
      ],
    },
  ],

  references: [
    {
      url: "https://docs.python.org/3/library/heapq.html",
      title: "heapq — Heap queue algorithm (Python)",
      section: "nlargest/nsmallest; maintaining a size-k heap",
      topic: "patterns/top-k-heap",
      purpose: "Confirm heapq is a min-heap and that a size-k heap yields top-k in O(n log k) on the bundled Python.",
      verifiedClaims: [
        "heapq implements a binary min-heap with O(log n) push/pop.",
        "Maintaining a heap of size k gives the k largest/smallest efficiently.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://algs4.cs.princeton.edu/24pq/",
      title: "Priority Queues — Algorithms, 4th Edition (Princeton)",
      section: "Keeping the k largest with a min-heap",
      topic: "patterns/top-k-heap",
      purpose: "Cross-check the size-k min-heap technique and its O(n log k) cost.",
      verifiedClaims: ["A size-k min-heap keeps the k largest items in O(n log k)."],
      accessDate: "2026-09-20",
    },
  ],
};
