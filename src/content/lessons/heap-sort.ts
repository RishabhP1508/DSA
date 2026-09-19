/**
 * Lesson: Heap sort (Sorting). Verified on CPython 3.14.
 * Output: "[1, 2, 3, 4, 5, 8]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Heap sort: build a min-heap, then pop the smallest repeatedly.
import heapq

def heap_sort(a):
    h = a[:]                        # copy so we don't mutate the input
    heapq.heapify(h)                # O(n) build a min-heap in place
    return [heapq.heappop(h) for _ in range(len(h))]  # pop n times

print(heap_sort([5, 1, 4, 2, 8, 3]))`;

export const heapSort: LessonDefinition = {
  id: "heap-sort",
  title: "Heap Sort",
  area: "Sorting",
  prerequisites: ["merge-sort"],

  explanation: `**Heap sort** uses a **heap** — a structure that always gives you the smallest (or largest) element quickly — to sort. The plan: put all elements into a **min-heap**, then repeatedly **pop the minimum**; the values come out in sorted order. Python's \`heapq\` provides \`heapify\` (turn a list into a heap) and \`heappop\` (remove the smallest).

The complexity is **O(n log n)** in all cases, like merge sort, but the breakdown is different: \`heapify\` builds the heap in **O(n)**, and then each of the n \`heappop\`s costs **O(log n)** (the heap re-settles after removing the root), so the pops dominate at O(n log n). There is no bad O(n²) case.

Heap sort's classic advantage is space: an in-place array heap sorts with **O(1)** auxiliary memory (the \`heapq\`-with-a-copy version here uses O(n) for the copy/output). It is **not stable**. You will meet the heap itself in depth in the Heaps topic; here the point is that "repeatedly extract the extreme" is a sorting strategy, and it is the natural tool when you also need *partial* sorting like top-K.`,

  vocabulary: [
    { term: "Heap", definition: "A tree-shaped structure giving O(1) access to the min (or max) and O(log n) insert/remove." },
    { term: "heapify", definition: "Turn an arbitrary list into a valid heap in O(n)." },
    { term: "heappop", definition: "Remove and return the smallest element in O(log n), re-settling the heap." },
    { term: "In-place heap sort", definition: "The array-based variant using O(1) extra space." },
  ],

  concepts: {
    purpose: "Sort in guaranteed O(n log n) by repeatedly extracting the heap's minimum.",
    operations: "heapify the list (O(n)); heappop n times (O(log n) each) to get sorted order.",
    uses: "Sorting with O(1) extra space (in-place variant); top-K and priority scheduling reuse the heap.",
    tradeoffs: "Guaranteed O(n log n) and (in-place) O(1) space, but not stable and typically slower in practice than quicksort due to cache behavior.",
    commonMistakes: "Assuming heapify is O(n log n) (it is O(n)); expecting stability; mutating the input when you meant to copy.",
    edgeCases: "Empty/one element trivially sorted. Duplicates come out in some order (not stable).",
  },

  complexity: [
    { operation: "Heap sort", best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(1)", note: "heapify O(n) + n pops × O(log n). In-place variant is O(1) space." },
  ],

  complexityExplanation: {
    variables: [{ symbol: "n", meaning: "the number of elements to sort" }],
    costModel: "heapify is O(n). Each heappop restores the heap in O(log n). Reading n results.",
    time: {
      bound: "O(n log n)",
      case: "worst",
      explanation: "Building the heap with heapify is O(n) (a well-known result — cheaper than n separate inserts). Then we heappop n times, and each pop must sift the new root down through the tree in O(log n). The pops dominate: n × O(log n) = O(n log n). This bound holds for all inputs — there is no degenerate case like quicksort's.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "The classic in-place array heap sort sorts within the original array using only a few variables — O(1) auxiliary. (This heapq-based version copies the list and builds an output list, which is O(n); the O(1) claim refers to the in-place algorithm.)",
      inputOutputNote: "This implementation's copy h and the output list are O(n); the in-place variant avoids them.",
    },
    derivation: [
      { lines: [6], description: "heapify builds the heap in O(n).", cost: "O(n)", dimension: "time" },
      { lines: [7], description: "n heappops, each O(log n) to re-settle the heap — the dominant cost.", cost: "O(n log n)", dimension: "time" },
      { lines: [5], description: "In-place heap sort uses O(1); this copy-based form uses O(n).", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Comparisons are O(1).", "heapify is O(n) and heappop is O(log n) (Python heapq).", "The O(1) space claim is for the in-place array algorithm."],
    tradeoffs: "Merge sort is also O(n log n) and stable but uses O(n) space; quicksort is often faster but risks O(n²). Heap sort guarantees O(n log n) with O(1) space (in place) but is unstable and cache-unfriendly.",
    counters: [
      { label: "pops", definition: "iterations of the pop comprehension (line 7)", countLines: [7] },
    ],
    fixedDataNote: "This run heapifies 6 elements then pops 6 times. The O(n log n) bound generalises the pop cost to n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: build a heap, pop smallest repeatedly." },
    { line: 2, executable: true, explanation: "Import heapq (standard library, in the bundled runtime)." },
    { line: 3, executable: false, explanation: "Blank line." },
    { line: 4, executable: true, explanation: "Define heap_sort(a)." },
    { line: 5, executable: true, explanation: "Copy so the caller's list is not mutated." },
    { line: 6, executable: true, explanation: "heapify turns the list into a min-heap in O(n)." },
    { line: 7, executable: true, explanation: "Pop the minimum n times; the results come out sorted. Each pop is O(log n)." },
    { line: 8, executable: false, explanation: "Blank line." },
    { line: 9, executable: true, explanation: "Sort [5,1,4,2,8,3] → [1, 2, 3, 4, 5, 8]." },
  ],

  bindings: [{ variable: "h", model: "heap" }],

  prediction: [
    { atEventIndex: 0, prompt: "Heap sort is O(n log n). Which step is O(n) and which is O(n log n)?", answer: "heapify is O(n); the n heappops (O(log n) each) total O(n log n) and dominate.", explanation: "Building the heap is a linear-time operation, but extracting all n elements costs O(log n) per pop, so the extraction phase sets the overall O(n log n)." },
  ],

  experiments: [
    "Watch the heap array in the visualization re-settle after each pop.",
    "Sort a reverse-sorted list and confirm it is still O(n log n) (no worst-case blowup).",
    "Change to a max-heap approach (negate values) to sort descending.",
  ],

  exercises: [
    {
      id: "hs-choose-1",
      kind: "choose-approach",
      prompt: "You need a guaranteed O(n log n) sort with O(1) extra space, and stability is NOT required. Heap sort or merge sort?",
      expected: "Heap sort (in-place): O(n log n) guaranteed and O(1) auxiliary space. Merge sort is also O(n log n) but needs O(n) space.",
      hints: ["Which uses less extra memory?", "In-place heap sort is O(1) space.", "Merge sort needs O(n); pick heap sort here."],
    },
    {
      id: "hs-predict-1",
      kind: "predict-state",
      prompt: "Is heapify O(n) or O(n log n)? Why does the overall sort still end up O(n log n)?",
      expected: "heapify is O(n). The overall sort is O(n log n) because the n heappops each cost O(log n), and that phase dominates the O(n) build.",
      hints: ["Building a heap all at once is cheaper than n inserts.", "That build is O(n).", "But n pops at O(log n) each dominate."],
    },
  ],

  review: `**Heap sort** builds a heap (\`heapify\`, **O(n)**) then extracts the extreme n times (\`heappop\`, **O(log n)** each), giving guaranteed **O(n log n)** in all cases. The in-place array variant uses **O(1)** space but is **not stable**. Choose it when you need a worst-case guarantee with minimal memory; the heap itself reappears for top-K and priority queues.`,

  expectedOutput: "[1, 2, 3, 4, 5, 8]\n",

  references: [
    {
      url: "https://docs.python.org/3/library/heapq.html",
      title: "heapq — Heap queue algorithm — Python documentation",
      section: "heapify / heappop",
      topic: "sorting/heap",
      purpose: "Confirm heapify is O(n) and heappop is O(log n) on the bundled runtime, and the heap is a min-heap.",
      verifiedClaims: ["heapq.heapify transforms a list into a heap in linear time", "heappop removes the smallest item in O(log n)"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://algs4.cs.princeton.edu/24pq/",
      title: "Priority Queues — Algorithms, 4th Edition (Princeton)",
      section: "Heapsort",
      topic: "sorting/heap",
      purpose: "Cross-check heap sort's O(n log n) guarantee and in-place O(1) space (unstable).",
      verifiedClaims: ["Heapsort sorts in O(n log n) with O(1) extra space and is not stable"],
      accessDate: "2026-09-20",
    },
  ],
};
