/**
 * Lesson: Selection sort (Sorting). Verified on CPython 3.14.
 * Output: "[1, 2, 4, 5, 8]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Selection sort: repeatedly pick the smallest remaining element.
def selection_sort(a):
    a = a[:]
    n = len(a)
    for i in range(n):
        m = i                       # index of the smallest in a[i:]
        for j in range(i + 1, n):
            if a[j] < a[m]:
                m = j
        a[i], a[m] = a[m], a[i]     # place the smallest at position i
    return a

print(selection_sort([5, 1, 4, 2, 8]))`;

export const selectionSort: LessonDefinition = {
  id: "selection-sort",
  title: "Selection Sort",
  area: "Sorting",
  prerequisites: ["bubble-sort"],

  explanation: `**Selection sort** builds the sorted list one position at a time. For each position \`i\`, it **scans the rest of the array to find the minimum**, then swaps that minimum into position \`i\`. After step \`i\`, the first \`i+1\` elements are the smallest, in order.

Like bubble sort it is **O(n²)** — for each of n positions it scans the remaining elements to find the minimum, giving n(n-1)/2 comparisons. But it makes at most **n swaps** total (one per position), far fewer than bubble sort's many adjacent swaps. That matters when writes are expensive (e.g. flash memory).

A subtle contrast: selection sort's comparison count is **the same regardless of input order** — even a sorted array takes O(n²) comparisons, because it always scans to confirm the minimum. It is also **not stable** in its basic swap form. It uses **O(1)** extra space.`,

  vocabulary: [
    { term: "Selection sort", definition: "Repeatedly selecting the minimum of the unsorted part and placing it next." },
    { term: "Minimum scan", definition: "The inner loop that finds the smallest remaining element's index." },
    { term: "Swap count", definition: "Selection sort does at most n swaps — one per position." },
    { term: "Unstable", definition: "May reorder equal elements (the basic swap version)." },
  ],

  concepts: {
    purpose: "Sort by repeatedly selecting the minimum; notable for its low number of swaps.",
    operations: "For each position, scan for the minimum of the rest, then swap it into place.",
    uses: "Educational; situations where writes/swaps are costly and reads are cheap.",
    tradeoffs: "O(n²) comparisons always, but only O(n) swaps; O(1) space; not stable.",
    commonMistakes: "Starting the inner scan at i instead of i+1 (redundant); expecting fewer comparisons on sorted input (it doesn't); assuming stability.",
    edgeCases: "Empty/one element already sorted. Sorted input still O(n²) comparisons but 0 useful swaps.",
  },

  complexity: [
    { operation: "Selection sort", best: "O(n^2)", average: "O(n^2)", worst: "O(n^2)", space: "O(1)", note: "Always ~n²/2 comparisons; at most n swaps." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements" }],
    costModel: "Each comparison is O(1); each swap is O(1). The nested loops set the comparison count.",
    time: {
      bound: "O(n^2)",
      case: "worst",
      explanation: "For position i the inner loop scans n-1-i remaining elements to find the minimum. Summed over all positions that is (n-1)+(n-2)+…+1 = n(n-1)/2 comparisons — O(n²). Crucially this count is the SAME for any input order, so best = average = worst = O(n²). There are at most n swaps (one per position).",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Only indices i, j, m are extra; sorting is in place. (The a[:] copy is defensive, not the algorithm's working space.)",
      inputOutputNote: "The a[:] copy of n elements protects the caller's list; the sort itself is O(1) working space.",
    },
    derivation: [
      { lines: [5], description: "The outer loop runs n times (one per position).", cost: "O(n)", dimension: "time" },
      { lines: [7, 8, 9], description: "The inner minimum-scan does about n²/2 comparisons total (nested).", cost: "O(n^2)", dimension: "time" },
      { lines: [10], description: "At most n swaps — one per position.", cost: "O(n)", dimension: "time" },
      { lines: [6], description: "A constant number of index variables.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Comparisons and swaps are O(1)."],
    tradeoffs: "Selection sort minimizes swaps (good when writes are expensive) but never beats O(n²) comparisons; O(n log n) sorts win for speed, and insertion sort adapts to nearly-sorted data.",
    counters: [
      { label: "comparisons", definition: "executions of the minimum-scan compare (line 8)", countLines: [8] },
      { label: "swaps", definition: "executions of the placement swap (line 10)", countLines: [10] },
    ],
    fixedDataNote: "This run sorts 5 elements with 10 comparisons and up to 5 swaps. The O(n²) comparison bound generalises to n regardless of input order.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: repeatedly pick the smallest remaining." },
    { line: 2, executable: true, explanation: "Define selection_sort(a)." },
    { line: 3, executable: true, explanation: "Work on a copy." },
    { line: 4, executable: true, explanation: "n is the length." },
    { line: 5, executable: true, explanation: "For each target position i (0..n-1)." },
    { line: 6, executable: true, explanation: "Assume the minimum of a[i:] is at i." },
    { line: 7, executable: true, explanation: "Scan the rest to find a smaller element." },
    { line: 8, executable: true, explanation: "Compare; update m if a[j] is smaller." },
    { line: 9, executable: true, explanation: "Record the new minimum index." },
    { line: 10, executable: true, explanation: "Swap the found minimum into position i (at most n swaps total)." },
    { line: 11, executable: true, explanation: "Return the sorted copy." },
    { line: 12, executable: false, explanation: "Blank line." },
    { line: 13, executable: true, explanation: "Sort [5,1,4,2,8] → [1, 2, 4, 5, 8]." },
  ],

  bindings: [
    {
      variable: "a",
      model: "array",
      overlays: [
        { role: "pointer", label: "i", source: "i" },
        { role: "pointer", label: "min m", source: "m" },
      ],
    },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Compared to bubble sort, what does selection sort minimize, and does its comparison count depend on input order?", answer: "It minimizes swaps (at most n); its comparison count is always ~n²/2 regardless of input order.", explanation: "Selection sort performs one swap per position (≤ n total), far fewer than bubble sort's swaps, but it always scans to find each minimum, so comparisons stay O(n²) for any input." },
  ],

  experiments: [
    "Count swaps for a sorted vs reverse-sorted input (comparisons stay the same).",
    "Add a guard to skip the swap when m == i and count the savings.",
    "Compare its comparison count to bubble sort's on the same input.",
  ],

  exercises: [
    {
      id: "sel-complete-1",
      kind: "complete-code",
      prompt: "Complete the minimum-finding inner loop.",
      starterCode: "for i in range(n):\n    m = i\n    for j in range(i + 1, n):\n        # TODO: update m if a[j] is smaller\n        pass\n    a[i], a[m] = a[m], a[i]",
      expected: "for i in range(n):\n    m = i\n    for j in range(i + 1, n):\n        if a[j] < a[m]:\n            m = j\n    a[i], a[m] = a[m], a[i]",
      hints: ["Track the index of the smallest seen.", "Compare a[j] to a[m].", "if a[j] < a[m]: m = j"],
    },
    {
      id: "sel-choose-1",
      kind: "choose-approach",
      prompt: "Writes to your storage medium are very expensive but reads are cheap. Among the O(n²) sorts, which minimizes writes and why?",
      expected: "Selection sort — it performs at most n swaps (writes), one per position, whereas bubble/insertion may perform O(n²) writes.",
      hints: ["Which sort swaps the least?", "Selection makes one swap per position.", "That is at most n writes total."],
    },
  ],

  review: `**Selection sort** repeatedly finds the minimum of the unsorted part and swaps it into place. It is **O(n²)** comparisons for **any** input order but only **O(n)** swaps, with **O(1)** space and no stability. Its niche is minimizing writes; for speed prefer O(n log n) sorts.`,

  expectedOutput: "[1, 2, 4, 5, 8]\n",

  references: [
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheSelectionSort.html",
      title: "The Selection Sort — Problem Solving with Algorithms and DS using Python (Runestone)",
      section: "Selection sort analysis",
      topic: "sorting/selection",
      purpose: "Confirm selection sort's O(n²) comparisons and its reduced swap count.",
      verifiedClaims: ["Selection sort is O(n²) comparisons and makes at most n swaps"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 15,
    contentHash: "faedab22e3e92765",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
