/**
 * Lesson: Merge sort (Sorting). Verified on CPython 3.14.
 * Output: "[1, 2, 3, 4, 5, 8]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Merge sort: divide in half, sort each half, then merge.
def merge_sort(a):
    if len(a) <= 1:                 # base case: 0 or 1 element is sorted
        return a
    mid = len(a) // 2
    left = merge_sort(a[:mid])      # sort the left half
    right = merge_sort(a[mid:])     # sort the right half
    merged = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:     # <= keeps it stable
            merged.append(left[i]); i += 1
        else:
            merged.append(right[j]); j += 1
    merged.extend(left[i:])         # copy any leftovers
    merged.extend(right[j:])
    return merged

print(merge_sort([5, 1, 4, 2, 8, 3]))`;

export const mergeSort: LessonDefinition = {
  id: "merge-sort",
  title: "Merge Sort",
  area: "Sorting",
  prerequisites: ["functions", "complexity"],

  explanation: `**Merge sort** is the classic **divide and conquer** sort. It splits the array in half, **recursively sorts each half**, then **merges** the two sorted halves into one sorted array. The merge is the clever part: because both halves are already sorted, you can produce the combined sorted order by repeatedly taking the smaller of the two front elements — a single linear pass.

Its running time is **O(n log n)** in *all* cases, which is the headline guarantee. There are about **log n** levels of splitting (halving down to size 1), and merging all the pieces at each level touches every element once — **O(n) per level** × **log n levels** = O(n log n). Unlike quicksort, it has no bad O(n²) case.

The trade-off is **space**: the merges build new lists, so it uses **O(n)** auxiliary memory (this implementation also slices, which copies). Merge sort is **stable** (using \`<=\` in the merge), which is why stable sorts and external/merge-based sorting of huge datasets rely on it.`,

  vocabulary: [
    { term: "Divide and conquer", definition: "Split a problem into subproblems, solve them, and combine the results." },
    { term: "Merge", definition: "Combining two sorted lists into one sorted list in linear time." },
    { term: "Recursion levels", definition: "About log n levels of halving from n down to size 1." },
    { term: "Stable", definition: "Equal elements keep their order (ensured by <= in the merge)." },
    { term: "Auxiliary space", definition: "Extra memory the merges allocate — O(n) here." },
  ],

  concepts: {
    purpose: "Sort in guaranteed O(n log n) time via divide and conquer; the basis of stable and external sorts.",
    operations: "Split in half; recursively sort; merge two sorted halves linearly.",
    uses: "Stable sorting, sorting linked lists, external/merge sorts of data too big for memory.",
    tradeoffs: "Guaranteed O(n log n) and stable, but uses O(n) extra space (unlike in-place quicksort).",
    commonMistakes: "Missing/incorrect base case (infinite recursion); using < instead of <= (loses stability); forgetting to copy leftover elements after the merge loop.",
    edgeCases: "Empty or single-element arrays are the base case. Duplicates preserved in order (stable).",
  },

  complexity: [
    { operation: "Merge sort", best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)", note: "log n levels × O(n) merging; O(n) extra memory." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements to sort" }],
    costModel: "Splitting is O(1) index math (slicing copies, noted in space); each merge does one linear pass over the elements it combines.",
    time: {
      bound: "O(n log n)",
      case: "worst",
      explanation: "The recursion halves the array until pieces of size 1, which is about log₂(n) levels deep. At every level, the total merging work across all the pieces touches each of the n elements once — O(n) per level. Multiplying levels by per-level work gives O(n log n), and this holds for best, average, AND worst inputs (no bad case).",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "Each merge allocates a new list holding up to n elements, and the recursion stack is O(log n) deep. The dominant term is the O(n) merge buffers. (This implementation also slices a[:mid]/a[mid:], which copies — also O(n).)",
      inputOutputNote: "The merged lists and slices are auxiliary; the input list of n elements is separate.",
    },
    derivation: [
      { lines: [6, 7], description: "Recursion halves the input: about log n levels deep.", cost: "O(log n)", dimension: "time" },
      { lines: [10, 11, 12, 14, 15, 16], description: "Merging at each level touches all n elements once: O(n) per level.", cost: "O(n log n)", dimension: "time" },
      { lines: [8, 6, 7], description: "Merge buffers hold O(n) and slices copy O(n); recursion stack is O(log n).", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Comparisons are O(1).", "Slicing/appending are proportional to the number of elements moved."],
    tradeoffs: "Quicksort sorts in place (O(log n) space) and is often faster in practice, but has an O(n²) worst case; merge sort guarantees O(n log n) and stability at the cost of O(n) space.",
    counters: [
      { label: "merge comparisons", definition: "executions of the merge compare (line 11)", countLines: [11] },
      { label: "recursive calls", definition: "calls to merge_sort (lines 6-7)", countLines: [6, 7] },
    ],
    fixedDataNote: "This run sorts 6 elements through ~log2(6) levels. The O(n log n) time and O(n) space bounds generalise to n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: divide, sort halves, merge." },
    { line: 2, executable: true, explanation: "Define merge_sort(a)." },
    { line: 3, executable: true, explanation: "Base case: a list of 0 or 1 element is already sorted." },
    { line: 4, executable: true, explanation: "Return it unchanged." },
    { line: 5, executable: true, explanation: "Find the midpoint." },
    { line: 6, executable: true, explanation: "Recursively sort the left half (drives the log n depth)." },
    { line: 7, executable: true, explanation: "Recursively sort the right half." },
    { line: 8, executable: true, explanation: "Prepare the merged output list." },
    { line: 9, executable: true, explanation: "Two pointers into left and right." },
    { line: 10, executable: true, explanation: "Merge while both halves have elements left." },
    { line: 11, executable: true, explanation: "Take the smaller front element; <= keeps equal elements stable." },
    { line: 12, executable: true, explanation: "Append from left and advance i." },
    { line: 13, executable: false, explanation: "Otherwise take from the right." },
    { line: 14, executable: true, explanation: "Append from right and advance j." },
    { line: 15, executable: true, explanation: "Copy any leftover left elements (already sorted)." },
    { line: 16, executable: true, explanation: "Copy any leftover right elements." },
    { line: 17, executable: true, explanation: "Return the merged, sorted list." },
    { line: 18, executable: false, explanation: "Blank line." },
    { line: 19, executable: true, explanation: "Sort [5,1,4,2,8,3] → [1, 2, 3, 4, 5, 8]." },
  ],

  bindings: [{ variable: "a", model: "recursion" }],

  prediction: [
    { atEventIndex: 0, prompt: "Why is merge sort O(n log n) in the WORST case, unlike quicksort?", answer: "The split is always into equal halves, giving log n levels, and merging is O(n) per level regardless of input — so it is always O(n log n) with no O(n²) case.", explanation: "Merge sort's halving does not depend on the data (always the midpoint), so the recursion depth is always ~log n and total work always O(n log n). Quicksort's split depends on pivot choice, which can degrade to O(n²)." },
  ],

  experiments: [
    "Watch the call stack grow to depth ~log n then unwind as merges happen.",
    "Change <= to < in the merge and reason about how stability could be affected with equal keys.",
    "Sort a reverse-sorted list and confirm it is still O(n log n) (no worst-case blowup).",
  ],

  exercises: [
    {
      id: "mrg-complete-1",
      kind: "complete-code",
      prompt: "Complete the merge of two already-sorted lists.",
      starterCode: "def merge(left, right):\n    out = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        # TODO: append the smaller front element and advance\n        pass\n    out.extend(left[i:])\n    out.extend(right[j:])\n    return out",
      expected: "def merge(left, right):\n    out = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            out.append(left[i]); i += 1\n        else:\n            out.append(right[j]); j += 1\n    out.extend(left[i:])\n    out.extend(right[j:])\n    return out",
      hints: ["Compare the two front elements.", "Append the smaller and advance its pointer.", "if left[i] <= right[j]: take left, else take right."],
    },
    {
      id: "mrg-choose-1",
      kind: "choose-approach",
      prompt: "You must sort 100 GB of data that does not fit in memory. Why is merge sort the natural choice?",
      expected: "Merge sort merges sorted runs sequentially, so it works as an external sort: sort chunks that fit in memory, then merge them from disk with linear passes. Its O(n log n) is guaranteed and it accesses data sequentially.",
      hints: ["Can the data fit in RAM?", "No — you sort chunks and merge them.", "Merge sort's sequential merges make external sorting practical."],
    },
  ],

  review: `**Merge sort** is divide and conquer: split in half, sort each half, and **merge** two sorted halves in linear time. It guarantees **O(n log n)** in all cases (about log n levels × O(n) merging) and is **stable**, at the cost of **O(n)** auxiliary space. It underlies stable and external (on-disk) sorting.`,

  expectedOutput: "[1, 2, 3, 4, 5, 8]\n",

  references: [
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheMergeSort.html",
      title: "The Merge Sort — Problem Solving with Algorithms and DS using Python (Runestone)",
      section: "Merge sort analysis",
      topic: "sorting/merge",
      purpose: "Confirm merge sort's divide-and-conquer structure, O(n log n) time, and O(n) space.",
      verifiedClaims: ["Merge sort is O(n log n) in all cases", "It uses O(n) extra space for merging and is stable"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://algs4.cs.princeton.edu/22mergesort/",
      title: "Mergesort — Algorithms, 4th Edition (Princeton)",
      section: "Analysis and stability",
      topic: "sorting/merge",
      purpose: "Cross-check the level-based O(n log n) analysis and stability.",
      verifiedClaims: ["Mergesort uses ~n lg n compares and is stable"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "aad2f840e0568a79",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
