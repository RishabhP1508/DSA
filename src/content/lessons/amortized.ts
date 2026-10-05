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

A Python list is the classic example. \`append\` normally just drops the item into a spare slot — **O(1)**. But when the underlying array is full, Python grows it: the allocator **may be able to extend the storage in place**, or it may allocate a bigger block and **relocate the existing element references into it** — and that relocation is the **O(n)** worst case for a single append. (When references are relocated, it is the *references* — the slots that point at the objects — that move, not the objects themselves, which are not duplicated.) Crucially, Python grows capacity by a *multiplicative factor*, so these resizes happen rarely and get geometrically less frequent. Their total cost across all n appends is only a **constant multiple of n**, so spreading it over the appends gives **amortized O(1)** per append.

So appending n items is **O(n) total**, or **O(1) amortized each** — even though a single append can occasionally cost O(n). Amortized O(1) is a promise about the *average over the sequence*, not about every individual call.`,

  vocabulary: [
    { term: "Amortized cost", definition: "The average cost per operation across a long sequence, even if individual ops vary." },
    { term: "Resize / reallocation", definition: "Growing the backing array when it is full: the allocator may extend the storage in place, or allocate a new larger block and move the existing element references into it (the references, not the objects they point at)." },
    { term: "Geometric growth", definition: "Growing capacity by a multiplicative factor, making expensive resizes rare." },
    { term: "Worst-case single op", definition: "The most one individual operation can cost (here, O(n) on a resize)." },
  ],

  concepts: {
    purpose: "Amortized analysis explains why 'append is O(1)' is true on average despite occasional costly resizes.",
    operations: "Repeated appends; the rare resize may move the element references into a larger array; the cost is averaged over the sequence.",
    uses: "Dynamic arrays, hash-table resizing, and any structure that occasionally reorganises.",
    tradeoffs: "Amortized O(1) is great for throughput but a single op can spike to O(n) — relevant for real-time deadlines.",
    commonMistakes: "Claiming every append is O(1) worst case (a resize is O(n)); confusing amortized with average-case over random inputs (amortized is over an operation sequence, no randomness needed).",
    edgeCases: "The very first append allocates; appends right after a resize are cheap again until the next capacity boundary.",
  },

  complexity: [
    { operation: "append (single)", best: "O(1)", average: "O(1)", worst: "O(n)", note: "Worst = a resize that moves the n current element references into a larger array." },
    { operation: "n appends (total)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)", note: "Amortized O(1) each; O(n) total; list holds n items." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of appends performed (5 in this run)" }],
    costModel: "A non-resizing append is O(1). A resizing append may move the current k element references into a larger array: O(k) in the worst case. Capacity grows by a proportional factor, so resizes are rare.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "This program's scope is the whole construction: building the list with n appends is O(n) TOTAL time. Most of the n appends drop into a spare slot in O(1). The occasional resize grows the backing array — it may extend the storage in place, or (worst case) allocate a larger block and move all current element references into it — but because capacity grows by a proportional factor each time, those resizes form a geometric series whose total across all n appends is only a CONSTANT MULTIPLE of n (the exact constant depends on the growth factor; CPython over-allocates by roughly an eighth each time, NOT doubling). Measured on the bundled runtime with struct.calcsize('P') == 4 (a 4-byte-pointer build), getsizeof shows the capacity growing through 4, 8, 16, 24, 32, 40 — a proportional, non-doubling pattern. Constant-multiple-of-n total work plus the n cheap appends is O(n) total — which is O(1) AMORTIZED per append.",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "The list ends up holding n elements, so it uses O(n) space (this is the data you built). Auxiliary space beyond the list is O(1): a loop counter. During a resize, a temporarily larger array exists but capacity stays O(n).",
      inputOutputNote: "The n-element list is the output you are constructing; its O(n) size is expected, not wasteful overhead.",
    },
    derivation: [
      { lines: [3], description: "The loop runs n times (n appends).", cost: "O(n)", dimension: "time" },
      { lines: [4], description: "Each append is amortized O(1); the rare resize moves element references into a larger array, but the geometric growth spreads that cost so the total is a constant multiple of n.", cost: "O(1)", dimension: "time" },
      { lines: [2, 4], description: "The list grows to hold n elements.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["CPython over-allocates list capacity geometrically, giving amortized O(1) append.", "range(n) yields values in O(1) each."],
    tradeoffs: "If you know the final size, preallocating (e.g. [None] * n) avoids resizes entirely, trading a one-time O(n) allocation for zero mid-loop reallocations.",
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
    { line: 4, executable: true, explanation: "Append i. Usually O(1); occasionally triggers a resize that moves the k current element references into a larger array (O(k))." },
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
      hints: ["What happens when the backing array is full?", "It reallocates to a larger array, possibly moving the existing element references.", "So one append can be O(n); the O(1) is amortized."],
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
      url: "https://opendatastructures.org/ods-python/2_Array_Based_Lists.html",
      title: "Open Data Structures (Python) — 2. Array-Based Lists",
      section: "Chapter 2 intro: amortized cost of growing/shrinking the backing array",
      topic: "dsa/amortized",
      purpose: "Cross-check the amortized O(1) analysis of array-backed lists: the chapter states that over a sequence of n operations the TOTAL cost of growing/shrinking the backing array is O(n), so the amortized cost is O(1) per operation — matching the lesson's O(n)-total / amortized-O(1) framing for append.",
      verifiedClaims: [
        "Over a sequence of n operations the total cost of growing and shrinking the backing array is O(n)",
        "Some individual operations are more expensive, but the amortized cost over all n operations is O(1) per operation",
      ],
      accessDate: "2026-10-04",
    },
  ],
  evidence: {
    inventoryVersion: 19,
    contentHash: "eb623945ef0610d5",
    verifiedAt: "2026-10-04",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
    reviewBatch: 1,
  },
};
