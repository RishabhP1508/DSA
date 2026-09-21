/**
 * Lesson: Bubble sort (Sorting). Verified on CPython 3.14.
 * Output: "[1, 2, 4, 5, 8]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Bubble sort: repeatedly swap adjacent out-of-order pairs.
def bubble_sort(a):
    a = a[:]                       # work on a copy
    n = len(a)
    for i in range(n):
        for j in range(n - 1 - i):     # last i are already in place
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a

print(bubble_sort([5, 1, 4, 2, 8]))`;

export const bubbleSort: LessonDefinition = {
  id: "bubble-sort",
  title: "Bubble Sort",
  area: "Sorting",
  prerequisites: ["loops", "complexity"],

  explanation: `**Bubble sort** is the simplest sorting algorithm to understand (though not to use in practice). It repeatedly walks the list comparing **adjacent** pairs and swapping any that are out of order. After each full pass, the largest remaining element has "bubbled" to its correct place at the end — so each pass can stop one element earlier.

It is a great teaching example precisely because its cost is easy to see: two nested loops, each roughly proportional to n, give **O(n²)** comparisons. For an already-sorted list it still does O(n²) comparisons in this basic form (an optimized version adds an early-exit flag to make the best case O(n)). It uses **O(1)** extra space and is **stable** (equal elements keep their order).

In real code you would call Python's built-in \`sorted\` (O(n log n)). Bubble sort earns its place as the clearest illustration of the nested-loop → quadratic relationship, which the complexity panel's comparison counter makes concrete.`,

  vocabulary: [
    { term: "Bubble sort", definition: "Repeatedly swapping adjacent out-of-order elements until sorted." },
    { term: "Pass", definition: "One sweep through the list; after pass i, the largest i elements are in place." },
    { term: "Adjacent swap", definition: "Exchanging two neighbouring elements." },
    { term: "Stable sort", definition: "Equal elements keep their original relative order." },
    { term: "In place", definition: "Sorts using O(1) extra space (here, ignoring the defensive copy)." },
  ],

  concepts: {
    purpose: "Teach the mechanics of sorting and the nested-loop → O(n²) relationship.",
    operations: "Compare adjacent pairs; swap if out of order; shrink the range each pass.",
    uses: "Educational; tiny inputs; not for production (use sorted / Timsort).",
    tradeoffs: "O(n²) time, O(1) space, stable — simple but slow; beaten by O(n log n) sorts.",
    commonMistakes: "Looping the inner range to n (not n-1-i) causing index errors; claiming O(n) without the early-exit optimization; forgetting stability.",
    edgeCases: "Empty/one-element list is already sorted. Already-sorted input still O(n²) in the basic form.",
  },

  complexity: [
    { operation: "Bubble sort", best: "O(n^2)", average: "O(n^2)", worst: "O(n^2)", space: "O(1)", note: "Basic form; early-exit variant is O(n) best case." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in the list" }],
    costModel: "Each adjacent comparison and swap is O(1). The nested loops determine the comparison count.",
    time: {
      bound: "O(n^2)",
      case: "worst",
      explanation: "The outer loop runs n times; the inner loop runs about n-1, n-2, … comparisons across passes. Summed, that is (n-1)+(n-2)+…+1 = n(n-1)/2 comparisons — O(n²). Because the loops are NESTED, the counts multiply into a quadratic. The basic form does this many comparisons even on sorted input.",
      otherCases: [
        { case: "best", bound: "O(n)", note: "With an early-exit flag that stops when a pass makes no swaps (e.g. already sorted)." },
      ],
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Sorting happens by swapping within the list; only loop indices are extra. (The defensive a[:] copy is O(n) but is for safety, not the algorithm's working space.)",
      inputOutputNote: "The a[:] copy of n elements is made so the input isn't mutated; the sort itself is in place.",
    },
    derivation: [
      { lines: [5], description: "The outer loop runs n times.", cost: "O(n)", dimension: "time" },
      { lines: [6, 7, 8], description: "The inner loop does up to n-1-i comparisons per pass; nested → about n²/2 total.", cost: "O(n^2)", dimension: "time" },
      { lines: [3], description: "Only the copy grows with n; the sort itself uses O(1) working space.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Comparisons and swaps are O(1).", "This is the basic form without the early-exit optimization."],
    tradeoffs: "O(n log n) sorts (merge/quick/Timsort) are dramatically faster for large n; bubble sort is only competitive on tiny or nearly-sorted inputs (with early exit).",
    counters: [
      { label: "comparisons", definition: "executions of the adjacent compare (line 7)", countLines: [7] },
      { label: "swaps", definition: "executions of the swap (line 8)", countLines: [8] },
    ],
    fixedDataNote: "This run sorts 5 elements, doing 4+3+2+1 = 10 comparisons. The O(n²) bound generalises that triangular count to n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: swap adjacent out-of-order pairs." },
    { line: 2, executable: true, explanation: "Define bubble_sort(a)." },
    { line: 3, executable: true, explanation: "Copy the input so the caller's list is not mutated." },
    { line: 4, executable: true, explanation: "n is the length." },
    { line: 5, executable: true, explanation: "Outer loop: one pass per element (n passes)." },
    { line: 6, executable: true, explanation: "Inner loop: compare up to n-1-i pairs (the last i are already sorted)." },
    { line: 7, executable: true, explanation: "If a pair is out of order..." },
    { line: 8, executable: true, explanation: "...swap them. Large values bubble toward the end." },
    { line: 9, executable: true, explanation: "Return the sorted copy." },
    { line: 10, executable: false, explanation: "Blank line." },
    { line: 11, executable: true, explanation: "Sort [5,1,4,2,8] → [1, 2, 4, 5, 8]." },
  ],

  bindings: [
    {
      variable: "a",
      model: "array",
      overlays: [{ role: "pointer", label: "j", source: "j" }],
    },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "How many comparisons does basic bubble sort do on 5 elements, and what is the general formula?", answer: "10 comparisons; in general n(n-1)/2 = O(n²).", explanation: "The passes do 4+3+2+1 = 10 comparisons for n=5. In general the sum is n(n-1)/2, which is quadratic." },
  ],

  experiments: [
    "Add an early-exit flag that breaks when a pass makes no swaps; test on a sorted list to see O(n) best case.",
    "Count comparisons for a reverse-sorted input (the worst case).",
    "Compare the comparison count to n(n-1)/2 for different sizes.",
  ],

  exercises: [
    {
      id: "bub-fix-1",
      kind: "fix-mistake",
      prompt: "This inner range causes an index error. Fix it.",
      starterCode: "for i in range(n):\n    for j in range(n):\n        if a[j] > a[j + 1]:\n            a[j], a[j + 1] = a[j + 1], a[j]",
      expected: "for i in range(n):\n    for j in range(n - 1 - i):\n        if a[j] > a[j + 1]:\n            a[j], a[j + 1] = a[j + 1], a[j]",
      hints: ["a[j+1] goes out of bounds when j reaches n-1.", "The last i elements are already sorted.", "Use range(n - 1 - i)."],
    },
    {
      id: "bub-choose-1",
      kind: "choose-approach",
      prompt: "For n = 1,000,000 elements, is bubble sort acceptable? What should you use and why?",
      expected: "No — O(n²) would be ~10^12 operations. Use an O(n log n) sort (Python's sorted/Timsort), which is ~2×10^7 operations.",
      hints: ["What is n² for a million?", "About 10^12 — far too slow.", "Use O(n log n): sorted() / merge / quick."],
    },
  ],

  review: `**Bubble sort** repeatedly swaps adjacent out-of-order pairs, bubbling the largest to the end each pass. Its **nested loops** make it **O(n²)** time (best O(n) only with an early-exit flag), **O(1)** space, and **stable**. It is a teaching tool for the nested-loop → quadratic relationship; use \`sorted\` (O(n log n)) in practice.`,

  expectedOutput: "[1, 2, 4, 5, 8]\n",

  references: [
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheBubbleSort.html",
      title: "The Bubble Sort — Problem Solving with Algorithms and DS using Python (Runestone)",
      section: "Bubble sort analysis",
      topic: "sorting/bubble",
      purpose: "Confirm the bubble-sort algorithm, its O(n²) comparison count, and the short-bubble early-exit optimization.",
      verifiedClaims: ["Bubble sort makes n(n-1)/2 comparisons (O(n²))", "An early-exit variant gives O(n) on sorted input"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "15117d367ff3ea1f",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
