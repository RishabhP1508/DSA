/**
 * Lesson: Amortized cost (DSA foundations).
 * Verified on CPython 3.14. Output: "[0, 1, 2, 3, 4]\n5\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Build a list by appending one item at a time.
data = []
for i in range(5):
    data.append(i)
print(data)
print(len(data))`;

export const amortized: LessonDefinition = {
  id: "amortized",
  title: "Amortized Cost",
  area: "DSA foundations",
  prerequisites: ["complexity", "cases"],

  explanation: `Some operations are *usually* cheap but *occasionally* expensive. **Amortized analysis** asks: averaged over a long sequence of operations, what is the cost **per operation**?

A Python list is the classic example. \`append\` normally just drops the item into a spare slot — **O(1)**. But when the underlying array is full, Python allocates a bigger array and **copies all existing elements** — an **O(n)** event. Crucially, Python grows the array by a *multiplicative factor*, so those expensive copies happen rarely and get geometrically less frequent. Spreading their total cost across all the cheap appends gives **amortized O(1)** per append.

So appending n items is **O(n) total**, or **O(1) amortized each** — even though a single append can occasionally cost O(n). Amortized O(1) is a promise about the *average over the sequence*, not about every individual call.`,

  vocabulary: [
    { term: "Amortized cost", definition: "The average cost per operation across a long sequence, even if individual ops vary." },
    { term: "Resize / reallocation", definition: "Allocating a larger backing array and copying elements when the current one is full." },
    { term: "Geometric growth", definition: "Growing capacity by a multiplicative factor, making expensive resizes rare." },
    { term: "Worst-case single op", definition: "The most one individual operation can cost (here, O(n) on a resize)." },
  ],

  concepts: {
    purpose: "Amortized analysis explains why 'append is O(1)' is true on average despite occasional costly resizes.",
    operations: "Repeated appends; the rare resize copies elements; the cost is averaged over the sequence.",
    uses: "Dynamic arrays, hash-table resizing, and any structure that occasionally reorganises.",
    tradeoffs: "Amortized O(1) is great for throughput but a single op can spike to O(n) — relevant for real-time deadlines.",
    commonMistakes: "Claiming every append is O(1) worst case (a resize is O(n)); confusing amortized with average-case over random inputs (amortized is over an operation sequence, no randomness needed).",
    edgeCases: "The very first append allocates; appends right after a resize are cheap again until the next capacity boundary.",
  },

  complexity: [
    { operation: "append (single)", best: "O(1)", average: "O(1)", worst: "O(n)", note: "Worst = a resize copying n elements." },
    { operation: "n appends (total)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)", note: "Amortized O(1) each; O(n) total; list holds n items." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of appends performed (5 in this run)" }],
    costModel: "A non-resizing append is O(1). A resizing append copies the current k elements: O(k). Capacity grows geometrically, so resizes are rare.",
    time: {
      bound: "O(1)",
      case: "amortized",
      explanation: "Most of the n appends drop into a spare slot in O(1). The occasional resize copies all current elements, but because capacity grows by a factor each time, the total copying across all n appends is bounded by about 2n. Adding that to the n cheap appends is still O(n) total — i.e. O(1) amortized per append.",
      otherCases: [
        { case: "worst", bound: "O(n)", note: "A single append that triggers a resize copies all n current elements once." },
      ],
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "The list ends up holding n elements, so it uses O(n) space (this is the data you built). Auxiliary space beyond the list is O(1): a loop counter. During a resize, a temporarily larger array exists but capacity stays O(n).",
      inputOutputNote: "The n-element list is the output you are constructing; its O(n) size is expected, not wasteful overhead.",
    },
    derivation: [
      { lines: [3], description: "The loop runs n times (n appends).", cost: "O(n)", dimension: "time" },
      { lines: [4], description: "Each append is amortized O(1); the rare resize copies elements but is spread out.", cost: "O(1)", dimension: "time" },
      { lines: [2, 4], description: "The list grows to hold n elements.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["CPython over-allocates list capacity geometrically, giving amortized O(1) append.", "range(n) yields values in O(1) each."],
    tradeoffs: "If you know the final size, preallocating (e.g. [None] * n) avoids resizes entirely, trading a one-time O(n) allocation for zero mid-loop copies.",
    counters: [
      { label: "appends", definition: "executions of the append line (line 4)", countLines: [4] },
    ],
    fixedDataNote: "This run does exactly 5 appends, building [0,1,2,3,4]. The amortized O(1) / O(n)-total claims describe how the cost scales as the number of appends grows to n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: build a list by appending." },
    { line: 2, executable: true, explanation: "Start with an empty list." },
    { line: 3, executable: true, explanation: "Loop i = 0..4 (n = 5 iterations)." },
    { line: 4, executable: true, explanation: "Append i. Usually O(1); occasionally triggers a resize that copies elements (O(k))." },
    { line: 5, executable: true, explanation: "Print the built list → [0, 1, 2, 3, 4]." },
    { line: 6, executable: true, explanation: "Print its length → 5." },
  ],

  bindings: [
    {
      variable: "data",
      model: "array",
      overlays: [{ role: "pointer", label: "i", source: "i" }],
    },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Appending n items to a list: what is the TOTAL time, and the per-append AMORTIZED time?", answer: "O(n) total; O(1) amortized per append.", explanation: "Cheap appends plus rare geometric resizes sum to O(n) total, which is O(1) averaged over the n appends." },
  ],

  experiments: [
    "Increase the range and watch the 'appends' counter equal n while the list grows to n.",
    "Preallocate with data = [None] * 5 and assign by index instead of appending; compare the approach.",
    "Reason about why growing capacity by +1 each time (instead of ×2) would make appends O(n) amortized.",
  ],

  exercises: [
    {
      id: "amort-predict-1",
      kind: "predict-state",
      prompt: "True or false: every individual list.append is O(1) in the worst case.",
      expected: "False — a single append that triggers a resize is O(n). Appends are O(1) AMORTIZED, not O(1) worst case.",
      hints: ["What happens when the backing array is full?", "It reallocates and copies all elements.", "So one append can be O(n); the O(1) is amortized."],
    },
    {
      id: "amort-choose-1",
      kind: "choose-approach",
      prompt: "You will append exactly n items and n is known in advance. How can you avoid all resizes, and what does it cost?",
      expected: "Preallocate a list of size n (e.g. [None] * n) and assign by index; this does one O(n) allocation and no mid-loop copies.",
      hints: ["Resizes happen because capacity grows on demand.", "What if you reserve capacity up front?", "Preallocate [None]*n and set items by index."],
    },
  ],

  review: `**Amortized cost** is the average per-operation cost over a sequence. \`list.append\` is **amortized O(1)** — cheap most of the time, with rare O(n) resizes that geometric growth makes infrequent — so n appends are **O(n) total**. Amortized O(1) does not mean every single call is O(1); one resize is O(n).`,

  expectedOutput: "[0, 1, 2, 3, 4]\n5\n",

  references: [
    {
      url: "https://docs.python.org/3/faq/design.html#how-are-lists-implemented-in-cpython",
      title: "Design and History FAQ — How are lists implemented in CPython?",
      section: "List implementation / over-allocation",
      topic: "dsa/amortized",
      purpose: "Confirm CPython lists over-allocate so that append is amortized O(1).",
      verifiedClaims: ["CPython lists are dynamic arrays that over-allocate, giving amortized O(1) append"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://opendatastructures.org/",
      title: "Open Data Structures",
      section: "ArrayStack / amortized analysis of dynamic arrays",
      topic: "dsa/amortized",
      purpose: "Cross-check the amortized O(1) analysis of geometric-growth dynamic arrays.",
      verifiedClaims: ["Doubling-capacity dynamic arrays achieve amortized O(1) append"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "460244b9571dbf68",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
