/**
 * Lesson: Time and space complexity (DSA foundations).
 * Verified on CPython 3.14. Output: "9\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Find the largest number by scanning the list once.
def find_max(nums):
    best = nums[0]
    for x in nums:
        if x > best:
            best = x
    return best

print(find_max([3, 9, 2, 7]))`;

export const complexity: LessonDefinition = {
  id: "complexity",
  title: "Time and Space Complexity",
  area: "DSA foundations",
  prerequisites: ["loops", "functions"],

  explanation: `**Complexity** describes how an algorithm's cost grows as its input grows — without tying us to a specific computer or clock. We measure **time complexity** (how many basic steps) and **space complexity** (how much extra memory), both as functions of the **input size**, usually called \`n\`.

We summarise growth with **Big-O**: \`O(n)\` ("linear") means the work grows in direct proportion to n; \`O(1)\` ("constant") means it does not depend on n; \`O(n²)\` ("quadratic") grows with the square of n. Big-O ignores constant factors and small terms, because we care about the *shape* of the growth for large inputs.

\`find_max\` scans the list once, comparing each of the n elements to the best-so-far. That is **n comparisons → O(n) time**. It keeps just one extra variable (\`best\`), so it uses **O(1) auxiliary space**. The visualization's counter lets you confirm the comparison count matches n as you change the input.`,

  vocabulary: [
    { term: "Input size (n)", definition: "The quantity that the cost is measured against, e.g. the number of elements." },
    { term: "Time complexity", definition: "How the number of basic steps grows with input size." },
    { term: "Space complexity", definition: "How much extra (auxiliary) memory grows with input size." },
    { term: "Big-O", definition: "Notation for an upper bound on growth, ignoring constants and lower-order terms." },
    { term: "Constant time O(1)", definition: "Cost independent of input size." },
    { term: "Linear time O(n)", definition: "Cost grows in proportion to n." },
    { term: "Auxiliary space", definition: "Extra memory beyond the input itself." },
  ],

  concepts: {
    purpose: "Complexity lets us compare algorithms and predict how they scale before running them.",
    operations: "Count how basic steps and extra memory grow with n; summarise with Big-O.",
    uses: "Choosing between approaches, spotting bottlenecks, justifying a data structure.",
    tradeoffs: "Faster time often costs more space (e.g. hashing) and vice versa; Big-O hides constants that matter for small n.",
    commonMistakes: "Assuming two loops always means O(n²) (they may be sequential → O(n)); counting the input as auxiliary space; treating measured time as proof of Big-O.",
    edgeCases: "Empty input (n = 0): the loop body never runs. A single element: one comparison.",
  },

  complexity: [
    { operation: "find_max scan", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "Every element is compared once; one extra variable." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in nums" }],
    costModel: "Each comparison (x > best) and each assignment is one constant-time step. Reading a list element by iteration is O(1).",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "The loop visits every element exactly once and does one comparison each time, so it performs about n comparisons. Doubling the list size doubles the work — the hallmark of linear O(n). Best, average, and worst are all O(n) here because we must look at every element to be sure we found the maximum.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Only `best` and the loop variable `x` are kept, no matter how big the list is. No new list grows with n, so auxiliary space is constant.",
      inputOutputNote: "The list of n numbers is the input; it is not counted as auxiliary space.",
    },
    derivation: [
      { lines: [3], description: "Initialise best from the first element — one constant-time step.", cost: "O(1)", dimension: "time" },
      { lines: [4, 5, 6], description: "The loop body runs once per element: n comparisons, each O(1).", cost: "O(n)", dimension: "time" },
      { lines: [3], description: "One extra variable regardless of n.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Comparisons between elements are constant time.", "We must inspect every element, so the whole list is scanned."],
    tradeoffs: "If the list were already sorted you could read the max in O(1) (the last element) — but sorting first costs O(n log n), which is worse than a single O(n) scan when you only need the max once.",
    counters: [
      { label: "elements scanned", definition: "executions of the loop comparison (line 5)", countLines: [5] },
      { label: "best updated", definition: "executions of the update (line 6)", countLines: [6] },
    ],
    fixedDataNote: "This run uses a fixed 4-element list, so you observe 4 comparisons. The O(n) claim says that count would grow to n for an n-element list.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: scan the list once to find the largest." },
    { line: 2, executable: true, explanation: "Define find_max(nums)." },
    { line: 3, executable: true, explanation: "Assume the first element is the best so far." },
    { line: 4, executable: true, explanation: "Loop over every element x (this is the source of the O(n) work)." },
    { line: 5, executable: true, explanation: "Compare x to best — one constant-time comparison per element." },
    { line: 6, executable: true, explanation: "If x is larger, update best." },
    { line: 7, executable: true, explanation: "Return the largest value found." },
    { line: 8, executable: false, explanation: "Blank line." },
    { line: 9, executable: true, explanation: "Call find_max on [3, 9, 2, 7]; the result 9 is printed." },
  ],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [{ role: "highlight", label: "best?", source: "best" }],
    },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "If nums had 1000 elements instead of 4, roughly how many comparisons would find_max do?", answer: "About 1000 — one per element (O(n)).", explanation: "The loop does one comparison per element, so the count scales linearly with n: ~1000 comparisons for 1000 elements." },
  ],

  experiments: [
    "Add elements to nums and watch the 'elements scanned' counter grow one-for-one.",
    "Put the largest number first and note the 'best updated' counter stays low while 'elements scanned' still equals n.",
    "Reason about why sorting to find the max (O(n log n)) is worse than this single O(n) scan.",
  ],

  exercises: [
    {
      id: "cx-predict-1",
      kind: "predict-state",
      prompt: "An algorithm does two SEPARATE loops over the same n-element list (one after the other). Is it O(n) or O(n²)?",
      expected: "O(n) — sequential loops add: n + n = 2n, which is O(n). Only NESTED loops multiply to O(n²).",
      hints: ["Are the loops nested or one-after-another?", "Sequential costs add; nested costs multiply.", "n + n = 2n = O(n)."],
    },
    {
      id: "cx-choose-1",
      kind: "choose-approach",
      prompt: "You need the maximum of an unsorted list exactly once. What is the best time complexity achievable, and why?",
      expected: "O(n): you must look at every element at least once (any unexamined element could be the max), so you cannot do better than linear.",
      hints: ["Could you skip any element and still be certain?", "An unseen element might be the maximum.", "So you must scan all n — O(n) is optimal."],
    },
  ],

  review: `Complexity measures how cost grows with input size **n**, summarised with **Big-O** (O(1) constant, O(n) linear, O(n²) quadratic). A single scan like \`find_max\` is **O(n) time** and **O(1) auxiliary space**. Watch out: sequential loops add (O(n)), only nested loops multiply (O(n²)), and measured time is evidence, not proof, of Big-O.`,

  expectedOutput: "9\n",

  references: [
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/AlgorithmAnalysis/BigONotation.html",
      title: "Big-O Notation — Problem Solving with Algorithms and DS using Python (Runestone)",
      section: "Big-O Notation",
      topic: "dsa/complexity",
      purpose: "Confirm the definition of Big-O and the linear-scan analysis for beginners.",
      verifiedClaims: ["Big-O describes growth ignoring constants and lower-order terms", "A single pass over n items is O(n)"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/lecture-notes/",
      title: "MIT 6.006 Introduction to Algorithms — Lecture notes",
      section: "Asymptotic notation / models of computation",
      topic: "dsa/complexity",
      purpose: "Cross-check the asymptotic framing and worst/average/best case distinction.",
      verifiedClaims: ["Asymptotic notation abstracts machine-specific constants"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "82f8046bf5a953e3",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 1,
  },
};
