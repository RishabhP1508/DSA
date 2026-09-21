/**
 * Lesson: Merging sorted data (Heaps). Verified on CPython 3.14.
 * Output: "[0, 1, 2, 3, 4, 5, 7, 8, 9]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `import heapq

# Merge several already-sorted sequences into one sorted stream.
a = [1, 4, 7]
b = [2, 3, 8]
c = [0, 5, 9]
# heapq.merge lazily yields items in sorted order using a heap of the fronts.
print(list(heapq.merge(a, b, c)))`;

export const mergeSortedData: LessonDefinition = {
  id: "merge-sorted-data",
  title: "Merging Sorted Data (K-Way Merge)",
  area: "Heaps",
  prerequisites: ["min-max-heaps", "merge-sort"],

  explanation: `Merging **k already-sorted** sequences into one sorted output is the **k-way merge**, and a heap makes it efficient. The naive idea of concatenating everything and sorting is **O(N log N)** (N = total items) and ignores the fact that the inputs are already ordered. The heap approach exploits that structure: keep a **min-heap of the current front element from each list**; repeatedly pop the smallest (that's the next output item) and push the next element from the list it came from.

Because the heap never holds more than **k** items (one per list), each pop/push is **O(log k)**, and there are **N** total items, so the merge is **O(N log k)** with only **O(k)** extra space. That is strictly better than O(N log N) when k is small — and it works as a **lazy stream**, so you never need all N items in memory at once. This is exactly how external merge sort combines sorted runs from disk.

Python's \`heapq.merge(*iterables)\` implements this and returns a **lazy iterator** (hence \`list(...)\` to materialize it). It's the k-way generalization of the 2-way merge step you saw in merge sort. The cue: "combine multiple sorted sources in order" → k-way merge with a heap.`,

  vocabulary: [
    { term: "K-way merge", definition: "Merging k sorted sequences into one sorted output." },
    { term: "Front element", definition: "The smallest unused element of each input list." },
    { term: "heapq.merge", definition: "Lazily merges sorted iterables into a single sorted iterator." },
    { term: "Lazy iterator", definition: "Produces items on demand without materializing them all." },
    { term: "External merge", definition: "Merging sorted runs too large to fit in memory (from disk)." },
  ],

  concepts: {
    purpose: "Combine multiple sorted inputs into one sorted output efficiently, exploiting their existing order.",
    operations: "Heap of current fronts; pop the smallest, push the next from its list; repeat.",
    uses: "K-way merge, external/merge sort of huge data, merging sorted logs/streams.",
    tradeoffs: "O(N log k) time / O(k) space vs concatenate-and-sort's O(N log N); lazy and memory-light.",
    commonMistakes: "Concatenating then sorting (ignores existing order); heap holding all N items instead of k fronts; forgetting heapq.merge is lazy (needs list() to see it).",
    edgeCases: "Empty inputs are skipped. One input returns it unchanged. Duplicates across lists are preserved.",
  },

  complexity: [
    { operation: "k-way merge", best: "O(N log k)", average: "O(N log k)", worst: "O(N log k)", space: "O(k)", note: "N total items; heap of k fronts. Beats O(N log N) concat+sort when k << N." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "N", meaning: "the total number of items across all sequences" },
      { symbol: "k", meaning: "the number of sorted sequences being merged" },
    ],
    costModel: "The heap holds one front per list (<= k items); each pop and push is O(log k). Every one of the N items is popped once.",
    time: {
      bound: "O(N log k)",
      case: "worst",
      explanation: "Each of the N items is popped from the heap exactly once (emitting it) and triggers at most one push (its list's next element). The heap never exceeds k elements, so each pop/push is O(log k). Total: O(N log k). Concatenating all N items and sorting would be O(N log N) — worse when k is small — and it throws away the inputs' existing order.",
    },
    space: {
      bound: "O(k)",
      case: "worst",
      explanation: "The heap stores at most one front element per list — O(k) — regardless of N. This is what lets it merge streams/files far larger than memory.",
      inputOutputNote: "The merged output is O(N) if materialized, but heapq.merge yields lazily; the heap itself is O(k).",
    },
    derivation: [
      { lines: [8], description: "Each of the N items is popped once (O(log k)) and pushes at most one successor (O(log k)).", cost: "O(N log k)", dimension: "time" },
      { lines: [8], description: "The heap holds at most k front elements.", cost: "O(k)", dimension: "space" },
    ],
    assumptions: ["Each input is already sorted.", "Comparisons are O(1).", "heapq.merge maintains a heap of the k fronts."],
    tradeoffs: "Concatenate-and-sort is O(N log N) time and O(N) space, discarding the sorted structure; the heap-based k-way merge is O(N log k) / O(k) and streams lazily.",
    counters: [],
    fixedDataNote: "This run merges 3 sorted lists (9 items total) into one sorted list. The O(N log k) bound generalises to N items across k lists.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import heapq." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: merge several sorted sequences." },
    { line: 4, executable: true, explanation: "First sorted list." },
    { line: 5, executable: true, explanation: "Second sorted list." },
    { line: 6, executable: true, explanation: "Third sorted list." },
    { line: 7, executable: false, explanation: "Comment: heapq.merge uses a heap of the front elements." },
    { line: 8, executable: true, explanation: "merge yields a lazy sorted iterator; list() materializes → [0,1,2,3,4,5,7,8,9]." },
  ],

  bindings: [
    { variable: "a", model: "array" },
    { variable: "b", model: "array" },
    { variable: "c", model: "array" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why is k-way merge with a heap O(N log k) instead of O(N log N) like concatenate-and-sort?", answer: "The heap only ever holds k front elements (one per list), so each of the N pops/pushes costs O(log k), not O(log N). It also reuses the inputs' existing sorted order, which concatenate-and-sort throws away.", explanation: "Sorting from scratch ignores that the inputs are already ordered and pays O(log N) per comparison against all N items; the heap of k fronts pays only O(log k) per item because it merges rather than re-sorts." },
  ],

  experiments: [
    "Merge two lists to see it reduce to the ordinary 2-way merge from merge sort.",
    "Include an empty list and confirm it's simply skipped.",
    "Merge lists with duplicates across them and confirm all are preserved in order.",
  ],

  exercises: [
    {
      id: "merge-choose-1",
      kind: "choose-approach",
      prompt: "You have 1000 sorted files too large to fit in memory and must produce one sorted stream. Concatenate-and-sort or heap-based k-way merge? Why?",
      expected: "Heap-based k-way merge: it keeps only k=1000 front elements in memory (O(k) space) and streams output lazily in O(N log k). Concatenate-and-sort needs all N items in memory (O(N)) and is O(N log N).",
      hints: ["Can all the data fit in memory?", "No — you need O(k) memory, not O(N).", "The heap of fronts streams in O(N log k)."],
    },
    {
      id: "merge-complete-1",
      kind: "complete-code",
      prompt: "Merge two sorted lists into one sorted list using heapq.merge.",
      starterCode: "import heapq\ndef merge_two(a, b):\n    # TODO: return a single sorted list\n    pass",
      expected: "import heapq\ndef merge_two(a, b):\n    return list(heapq.merge(a, b))",
      hints: ["heapq.merge accepts multiple sorted iterables.", "It returns a lazy iterator.", "return list(heapq.merge(a, b))"],
    },
  ],

  review: `**K-way merge** combines k sorted sequences into one sorted output using a **min-heap of the k front elements**: pop the smallest, push the next from its list. It's **O(N log k)** time and **O(k)** space — beating concatenate-and-sort's **O(N log N)/O(N)** when k is small — and it streams lazily, which is how external merge sort handles data bigger than memory. \`heapq.merge(*iterables)\` provides it.`,

  expectedOutput: "[0, 1, 2, 3, 4, 5, 7, 8, 9]\n",

  references: [
    {
      url: "https://docs.python.org/3/library/heapq.html",
      title: "heapq — Heap queue algorithm — Python 3.14 documentation",
      section: "heapq.merge",
      topic: "heaps/merge-sorted",
      purpose: "Confirm heapq.merge lazily merges sorted inputs into one sorted iterator using a heap of fronts.",
      verifiedClaims: ["heapq.merge merges multiple sorted inputs into a single sorted output and returns an iterator"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://cp-algorithms.com/",
      title: "CP-Algorithms",
      section: "K-way merge / external sorting",
      topic: "heaps/merge-sorted",
      purpose: "Cross-check the O(N log k) complexity of heap-based k-way merge and its use in external sorting.",
      verifiedClaims: ["Heap-based k-way merge is O(N log k) with O(k) auxiliary space"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "7c6cb70710713bc5",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
