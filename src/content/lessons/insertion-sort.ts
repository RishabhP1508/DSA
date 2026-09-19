/**
 * Lesson: Insertion sort (Sorting). Verified on CPython 3.14.
 * Output: "[1, 2, 4, 5, 8]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Insertion sort: grow a sorted prefix by inserting each next element.
def insertion_sort(a):
    a = a[:]
    for i in range(1, len(a)):
        key = a[i]                 # the element to insert
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]        # shift bigger elements right
            j -= 1
        a[j + 1] = key            # drop key into its slot
    return a

print(insertion_sort([5, 1, 4, 2, 8]))`;

export const insertionSort: LessonDefinition = {
  id: "insertion-sort",
  title: "Insertion Sort",
  area: "Sorting",
  prerequisites: ["bubble-sort", "cases"],

  explanation: `**Insertion sort** builds a sorted prefix one element at a time, the way you sort a hand of cards: take the next card (\`key\`) and slide it left past any larger cards until it sits in the right place. Elements before \`i\` are always kept sorted; each step inserts \`a[i]\` into that sorted region.

Its complexity is **adaptive**, which is what makes it special. In the **worst case** (reverse-sorted) each element shifts past all the ones before it — **O(n²)**. But in the **best case** (already sorted) each element only compares once and never shifts — **O(n)**. On **nearly-sorted** data it is close to linear, which is why real-world hybrid sorts (like Python's Timsort) use insertion sort for small or almost-ordered runs.

It is **stable** and uses **O(1)** extra space. Among the three quadratic sorts, insertion sort is the one you actually see inside production sorting code — precisely because of that O(n) best case on ordered data.`,

  vocabulary: [
    { term: "Insertion sort", definition: "Inserting each element into its correct place within a growing sorted prefix." },
    { term: "Sorted prefix", definition: "The already-ordered region a[0..i-1] that grows each step." },
    { term: "Shift", definition: "Moving larger elements one slot right to make room for the key." },
    { term: "Adaptive", definition: "Runs faster on nearly-sorted input (best case O(n))." },
    { term: "Stable", definition: "Equal elements keep their original order." },
  ],

  concepts: {
    purpose: "Sort by incremental insertion; excellent on small or nearly-sorted data.",
    operations: "Take the next key; shift larger sorted-prefix elements right; drop the key in.",
    uses: "Small arrays, nearly-sorted data, and as the base case inside hybrid sorts (Timsort).",
    tradeoffs: "O(n²) worst but O(n) best (adaptive); O(1) space; stable — the most practical quadratic sort.",
    commonMistakes: "Off-by-one when shifting (a[j+1] = a[j]); using > vs >= and losing stability; starting i at 0 instead of 1.",
    edgeCases: "Empty/one element already sorted. Already-sorted input hits the O(n) best case. Reverse-sorted is the O(n²) worst case.",
  },

  complexity: [
    { operation: "Insertion sort", best: "O(n)", average: "O(n^2)", worst: "O(n^2)", space: "O(1)", note: "Adaptive: O(n) on sorted input, O(n²) reverse-sorted." },
  ],

  complexityExplanation: {
    variables: [{ symbol: "n", meaning: "the number of elements" }],
    costModel: "Each comparison and shift is O(1). The number of shifts depends on how out-of-order the input is.",
    time: {
      bound: "O(n^2)",
      case: "worst",
      explanation: "In the worst case (reverse-sorted) inserting a[i] shifts it past all i earlier elements, so total shifts are 1+2+…+(n-1) = n(n-1)/2 — O(n²). But insertion sort is ADAPTIVE: on already-sorted input the inner while never shifts (each key compares once and stops), giving O(n). Average case is O(n²).",
      otherCases: [
        { case: "best", bound: "O(n)", note: "Already sorted: one comparison per element, no shifts." },
        { case: "average", bound: "O(n^2)", note: "Random order: each element shifts about halfway back on average." },
      ],
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Shifting happens within the list; only key and indices are extra. (The a[:] copy is defensive.)",
      inputOutputNote: "The a[:] copy of n elements protects the caller's list; the sort works in O(1) space.",
    },
    derivation: [
      { lines: [4], description: "The outer loop runs n-1 times (one per element to insert).", cost: "O(n)", dimension: "time" },
      { lines: [7, 8, 9], description: "The inner while shifts up to i elements; worst-case total is n²/2.", cost: "O(n^2)", dimension: "time" },
      { lines: [5, 6], description: "One key and a couple of indices.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Comparisons and shifts are O(1).", "Best case requires (nearly) sorted input; the inner while exits immediately."],
    tradeoffs: "For large random data O(n log n) sorts win; insertion sort's O(n) best case and stability make it the go-to for small/nearly-sorted runs, which is why Timsort uses it internally.",
    counters: [
      { label: "comparisons", definition: "executions of the while-condition compare (line 7)", countLines: [7] },
      { label: "shifts", definition: "executions of the shift (line 8)", countLines: [8] },
    ],
    fixedDataNote: "This run sorts 5 elements. Try a sorted input to see comparisons drop to ~n (the O(n) best case). The O(n²) bound is the worst case.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: grow a sorted prefix by insertion." },
    { line: 2, executable: true, explanation: "Define insertion_sort(a)." },
    { line: 3, executable: true, explanation: "Work on a copy." },
    { line: 4, executable: true, explanation: "Insert each element from index 1 onward (a[0] is a trivial sorted prefix)." },
    { line: 5, executable: true, explanation: "key is the element being inserted into the sorted prefix." },
    { line: 6, executable: true, explanation: "Start comparing from the end of the sorted prefix." },
    { line: 7, executable: true, explanation: "While there is a larger element to the left..." },
    { line: 8, executable: true, explanation: "...shift it one slot right to make room." },
    { line: 9, executable: true, explanation: "Move left." },
    { line: 10, executable: true, explanation: "Drop key into the gap — its correct sorted position." },
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
        { role: "pointer", label: "j", source: "j" },
      ],
    },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why is insertion sort O(n) on already-sorted input but O(n²) on reverse-sorted input?", answer: "On sorted input the inner while stops immediately (no shifts) → one comparison per element → O(n); reverse-sorted forces each element to shift past all before it → O(n²).", explanation: "The inner loop's work depends on how far back the key must move. Sorted data means zero shifts; reverse-sorted means maximum shifts, giving the two extremes." },
  ],

  experiments: [
    "Run on an already-sorted list and watch shifts stay at 0 (O(n) best case).",
    "Run on a reverse-sorted list and count shifts (the O(n²) worst case).",
    "Explain why Timsort uses insertion sort on small runs.",
  ],

  exercises: [
    {
      id: "ins-fix-1",
      kind: "fix-mistake",
      prompt: "This insertion sort overwrites elements incorrectly. Fix the shift/insert.",
      starterCode: "for i in range(1, len(a)):\n    key = a[i]\n    j = i - 1\n    while j >= 0 and a[j] > key:\n        a[j] = a[j + 1]\n        j -= 1\n    a[j + 1] = key",
      expected: "for i in range(1, len(a)):\n    key = a[i]\n    j = i - 1\n    while j >= 0 and a[j] > key:\n        a[j + 1] = a[j]\n        j -= 1\n    a[j + 1] = key",
      hints: ["You shift larger elements to the RIGHT.", "The destination is a[j+1], the source is a[j].", "Use a[j + 1] = a[j]."],
    },
    {
      id: "ins-choose-1",
      kind: "choose-approach",
      prompt: "You must sort many small chunks that are already nearly sorted. Which quadratic sort is best and why?",
      expected: "Insertion sort — it is adaptive (near O(n) on nearly-sorted input) and stable, which is exactly why hybrid sorts use it for small runs.",
      hints: ["Which sort speeds up on nearly-sorted data?", "Insertion sort's best case is O(n).", "That adaptivity + stability make it ideal here."],
    },
  ],

  review: `**Insertion sort** inserts each element into a growing sorted prefix, shifting larger elements right. It is **adaptive**: **O(n)** on (nearly) sorted input, **O(n²)** worst case, with **O(1)** space and **stability**. That O(n) best case is why it powers the small-run base case of production sorts like Timsort.`,

  expectedOutput: "[1, 2, 4, 5, 8]\n",

  references: [
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheInsertionSort.html",
      title: "The Insertion Sort — Problem Solving with Algorithms and DS using Python (Runestone)",
      section: "Insertion sort analysis",
      topic: "sorting/insertion",
      purpose: "Confirm insertion sort's adaptive O(n) best / O(n²) worst analysis and shifting mechanics.",
      verifiedClaims: ["Insertion sort is O(n) on sorted input and O(n²) worst case", "It is stable and in place"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://en.wikipedia.org/wiki/Timsort",
      title: "Timsort — Wikipedia",
      section: "Use of insertion sort on small runs",
      topic: "sorting/insertion",
      purpose: "Cross-check that Python's Timsort uses insertion sort for small runs.",
      verifiedClaims: ["Timsort uses insertion sort for small runs due to its efficiency on short/nearly-sorted sequences"],
      accessDate: "2026-09-20",
    },
  ],
};
