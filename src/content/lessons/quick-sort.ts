/**
 * Lesson: Quick sort (Sorting). Verified on CPython 3.14.
 * Output: "[1, 2, 3, 4, 5, 8]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Quick sort: partition around a pivot, then sort each side.
def quick_sort(a):
    if len(a) <= 1:                       # base case
        return a
    pivot = a[len(a) // 2]                 # choose a pivot
    less = [x for x in a if x < pivot]     # elements smaller than pivot
    equal = [x for x in a if x == pivot]   # equal to pivot
    greater = [x for x in a if x > pivot]  # larger than pivot
    return quick_sort(less) + equal + quick_sort(greater)

print(quick_sort([5, 1, 4, 2, 8, 3]))`;

export const quickSort: LessonDefinition = {
  id: "quick-sort",
  title: "Quick Sort",
  area: "Sorting",
  prerequisites: ["merge-sort", "cases"],

  explanation: `**Quick sort** is the other great **divide and conquer** sort. It picks a **pivot**, **partitions** the array into elements less than, equal to, and greater than the pivot, then recursively sorts the "less" and "greater" parts. Once partitioned, the pivot is in its final position and the two sides are independent subproblems.

Its behavior depends on **pivot choice**, which is the heart of the lesson. With balanced partitions (pivot near the median), the recursion is ~log n deep and each level does O(n) partitioning → **O(n log n)** average. But with consistently bad pivots (e.g. always the smallest on already-sorted data with a naive pivot), partitions are lopsided, the depth becomes ~n, and it degrades to **O(n²)** worst case. Randomized or median-of-three pivots make the bad case astronomically unlikely.

The version shown is a clear, teaching-friendly form using list comprehensions (which costs O(n) extra space); in-place partitioning variants use only **O(log n)** space. Quick sort is typically **faster in practice** than merge sort due to good cache behavior and no merge buffers, which is why many standard libraries use a quicksort variant (often introsort) for arrays.`,

  vocabulary: [
    { term: "Pivot", definition: "The chosen element that partitions the array." },
    { term: "Partition", definition: "Rearranging so smaller elements precede the pivot and larger follow." },
    { term: "Balanced split", definition: "Partitions of roughly equal size, giving log n depth (good)." },
    { term: "Degenerate split", definition: "Highly unequal partitions, giving ~n depth and O(n²)." },
    { term: "Randomized pivot", definition: "Choosing the pivot randomly to avoid worst-case inputs." },
  ],

  concepts: {
    purpose: "Sort quickly on average via pivot-based partitioning; the workhorse of many libraries.",
    operations: "Pick a pivot; partition into less/equal/greater; recurse on the two sides.",
    uses: "General-purpose in-memory sorting, quickselect (kth element), library sort routines.",
    tradeoffs: "O(n log n) average and cache-friendly, but O(n²) worst case; not stable in the in-place form.",
    commonMistakes: "Naive first/last pivot on sorted data (worst case); missing base case; assuming it is always O(n log n); expecting stability from the in-place version.",
    edgeCases: "Empty/one element base case. All-equal elements (the 'equal' bucket keeps it linear here). Already-sorted with a bad pivot triggers the worst case.",
  },

  complexity: [
    { operation: "Quick sort", best: "O(n log n)", average: "O(n log n)", worst: "O(n^2)", space: "O(n)", note: "Average balanced; worst-case lopsided pivots. This form uses O(n) space; in-place is O(log n)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements to sort" }],
    costModel: "Partitioning an array of size m scans its m elements — O(m). The total cost is the sum of partition sizes across all recursion levels.",
    time: {
      bound: "O(n log n)",
      case: "average",
      explanation: "Each partitioning pass over a piece of size m is O(m). If pivots split roughly in half, there are ~log n levels and each level's partitions total O(n), giving O(n log n) on average. If pivots are consistently bad (one side almost empty), the depth becomes ~n and the work sums to n + (n-1) + … = O(n²) — the worst case. Randomized/median pivots make the average the norm.",
      otherCases: [
        { case: "best", bound: "O(n log n)", note: "Perfectly balanced partitions every time." },
        { case: "worst", bound: "O(n^2)", note: "Consistently lopsided partitions (e.g. sorted input with a naive pivot)." },
      ],
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "This teaching version builds new less/equal/greater lists at each call — O(n) extra memory. An in-place partition variant uses only O(log n) recursion-stack space (O(n) stack in the degenerate case).",
      inputOutputNote: "The less/equal/greater lists are auxiliary; the input list of n elements is separate.",
    },
    derivation: [
      { lines: [6, 7, 8], description: "Partitioning scans all elements of the current piece — O(m) per call.", cost: "O(n log n)", dimension: "time" },
      { lines: [9], description: "Recursion on the two sides; balanced → log n depth, lopsided → n depth (worst case O(n²)).", cost: "O(n log n)", dimension: "time" },
      { lines: [6, 7, 8], description: "New partition lists allocate O(n) total per level (this form).", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Comparisons are O(1).", "Average case assumes pivots split reasonably (true for random/median pivots).", "Worst case arises from consistently unbalanced pivots."],
    tradeoffs: "Merge sort guarantees O(n log n) and stability but needs O(n) space; quicksort is usually faster in practice (cache-friendly, in-place) but risks O(n²) without good pivot selection.",
    counters: [
      { label: "recursive calls", definition: "calls to quick_sort (line 9)", countLines: [9] },
    ],
    fixedDataNote: "This run sorts 6 elements with a middle-element pivot. The O(n log n) average / O(n²) worst bounds describe how depth depends on pivot balance for size n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: partition around a pivot, recurse." },
    { line: 2, executable: true, explanation: "Define quick_sort(a)." },
    { line: 3, executable: true, explanation: "Base case: 0 or 1 element is already sorted." },
    { line: 4, executable: true, explanation: "Return it." },
    { line: 5, executable: true, explanation: "Choose the middle element as the pivot (a reasonable default)." },
    { line: 6, executable: true, explanation: "Elements smaller than the pivot." },
    { line: 7, executable: true, explanation: "Elements equal to the pivot (handles duplicates cleanly)." },
    { line: 8, executable: true, explanation: "Elements larger than the pivot." },
    { line: 9, executable: true, explanation: "Recursively sort less and greater, then concatenate with the pivot(s) in the middle." },
    { line: 10, executable: false, explanation: "Blank line." },
    { line: 11, executable: true, explanation: "Sort [5,1,4,2,8,3] → [1, 2, 3, 4, 5, 8]." },
  ],

  bindings: [{ variable: "a", model: "recursion" }],

  prediction: [
    { atEventIndex: 0, prompt: "What makes quicksort O(n log n) on average but O(n^2) in the worst case?", answer: "Pivot balance: roughly-even partitions give ~log n depth (O(n log n)); consistently lopsided partitions give ~n depth (O(n²)).", explanation: "The recursion depth depends on how evenly the pivot splits the data. Balanced splits → log n levels; degenerate splits (one side nearly empty) → n levels, and the per-level O(n) work sums to O(n²)." },
  ],

  experiments: [
    "Sort an already-sorted list and reason about pivot choice and worst-case risk.",
    "Change the pivot to a[0] and discuss when that becomes the O(n²) worst case.",
    "Add a random pivot and explain why it makes the bad case unlikely.",
  ],

  exercises: [
    {
      id: "qk-choose-1",
      kind: "choose-approach",
      prompt: "You need a guaranteed worst-case O(n log n) sort for adversarial input, and stability matters. Quicksort or merge sort?",
      expected: "Merge sort — it guarantees O(n log n) worst case and is stable. Quicksort risks O(n²) on crafted input and its in-place form is not stable.",
      hints: ["Which has a bad worst case an adversary could trigger?", "Quicksort can be forced to O(n²).", "Merge sort guarantees O(n log n) and is stable."],
    },
    {
      id: "qk-predict-1",
      kind: "predict-state",
      prompt: "With a naive pivot = a[0], what input triggers quicksort's O(n²) worst case?",
      expected: "An already-sorted (or reverse-sorted) array: each pivot is the min (or max), so one partition is empty and the other has n-1 elements, giving depth ~n.",
      hints: ["When is one partition nearly empty every time?", "When the pivot is always the smallest/largest.", "Sorted input with pivot = a[0] does exactly that."],
    },
  ],

  review: `**Quick sort** partitions around a **pivot** into less/equal/greater and recurses on the sides. It is **O(n log n)** on average (balanced splits, ~log n depth) but **O(n²)** worst case (lopsided pivots) — so pivot choice (random/median) matters. It is usually fast in practice; the in-place form is O(log n) space but unstable. Choose merge sort when you need a guaranteed worst case or stability.`,

  expectedOutput: "[1, 2, 3, 4, 5, 8]\n",

  references: [
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheQuickSort.html",
      title: "The Quick Sort — Problem Solving with Algorithms and DS using Python (Runestone)",
      section: "Quick sort analysis",
      topic: "sorting/quick",
      purpose: "Confirm quicksort's partition mechanics and O(n log n) average / O(n²) worst analysis.",
      verifiedClaims: ["Quicksort is O(n log n) average and O(n²) worst case depending on pivot balance"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://algs4.cs.princeton.edu/23quicksort/",
      title: "Quicksort — Algorithms, 4th Edition (Princeton)",
      section: "Performance and pivot selection",
      topic: "sorting/quick",
      purpose: "Cross-check worst-case triggers and the role of randomization/pivot selection.",
      verifiedClaims: ["Randomized pivots make quicksort's worst case extremely unlikely; in-place quicksort uses O(log n) stack space"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "e1e141fb37c3b72c",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
