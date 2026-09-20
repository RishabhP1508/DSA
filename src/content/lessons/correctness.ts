/**
 * Lesson: Correctness (DSA foundations).
 * Verified on CPython 3.14. Output: "15\n0\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Sum 1 + 2 + ... + n. We argue WHY this is correct.
def sum_to(n):
    total = 0
    i = 1
    # Loop invariant: total == sum of 1..(i-1) at the top of each pass.
    while i <= n:
        total = total + i
        i = i + 1
    return total

print(sum_to(5))
# Edge case: n = 0 means "sum of nothing" = 0.
print(sum_to(0))`;

export const correctness: LessonDefinition = {
  id: "correctness",
  title: "Correctness and Invariants",
  area: "DSA foundations",
  prerequisites: ["loops"],

  explanation: `Fast is useless if the answer is wrong. **Correctness** means an algorithm returns the right result for **every** valid input — not just the one you happened to test. We reason about it with a few tools:

- A **loop invariant**: a statement that is true before the loop and stays true after each pass. Here the invariant is "\`total\` equals the sum of \`1..(i-1)\`." It holds at the start (total = 0 = empty sum), each pass preserves it (we add \`i\`, then advance \`i\`), and when the loop ends \`i = n+1\`, so total = sum of \`1..n\` — exactly what we want.
- **Base/edge cases**: the smallest or unusual inputs. For \`n = 0\` the loop never runs and we correctly return 0 ("sum of nothing").
- **Termination**: \`i\` increases every pass, so \`i <= n\` eventually fails — the loop always ends.

You will use this style of reasoning throughout: state what stays true, check the edge cases (empty, single, duplicate, negative), and confirm the algorithm stops.`,

  vocabulary: [
    { term: "Correctness", definition: "Producing the right output for every valid input." },
    { term: "Loop invariant", definition: "A property true before the loop and preserved by every iteration." },
    { term: "Base / edge case", definition: "The smallest or unusual inputs (empty, single, zero, negative)." },
    { term: "Termination", definition: "A guarantee that the algorithm eventually stops (loops make progress toward ending)." },
    { term: "Precondition", definition: "What must be true about the input for the algorithm to be valid." },
  ],

  concepts: {
    purpose: "Correctness reasoning gives confidence an algorithm works for all inputs, not just tested ones.",
    operations: "State an invariant, verify it holds initially and after each step, check edge cases and termination.",
    uses: "Justifying loops, binary search boundaries, recursion base cases, and tricky pointer logic.",
    tradeoffs: "Rigorous proofs take effort; for teaching we use clear invariants and edge-case checks rather than formal proofs.",
    commonMistakes: "Testing one input and assuming general correctness; ignoring empty/zero/negative inputs; off-by-one errors that break the invariant at the boundary.",
    edgeCases: "n = 0 (empty sum → 0), n = 1 (single term), and — if allowed — negative n (loop never runs, returns 0).",
  },

  complexity: [
    { operation: "sum_to(n) loop", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "n additions; two variables. (A closed form n(n+1)/2 would be O(1).)" },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the upper bound of the sum (we add 1..n)" }],
    costModel: "Each loop pass does one addition and one increment — constant time.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "The loop runs from i = 1 to n, so it performs n additions — linear in n. (There is a closed-form shortcut, n(n+1)/2, that computes the same answer in O(1); the loop is shown so the invariant is visible.)",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Only `total` and `i` are stored, regardless of n. No storage grows with the input.",
    },
    derivation: [
      { lines: [6, 7, 8], description: "The loop body runs n times: one addition + one increment each.", cost: "O(n)", dimension: "time" },
      { lines: [3, 4], description: "Two variables held throughout.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Additions are constant time for these magnitudes.", "n is a non-negative integer (precondition); negative n yields 0 as the loop never runs."],
    tradeoffs: "The closed form total = n * (n + 1) // 2 gives the same result in O(1) time — faster, but the loop makes the invariant and step-by-step reasoning visible for learning.",
    counters: [
      { label: "loop passes", definition: "executions of the accumulate line (line 7)", countLines: [7] },
    ],
    fixedDataNote: "This run computes sum_to(5) = 15 (5 passes) and sum_to(0) = 0 (0 passes). The O(n) bound generalises the pass count to n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: we will argue why this is correct." },
    { line: 2, executable: true, explanation: "Define sum_to(n)." },
    { line: 3, executable: true, explanation: "Start total at 0 — the sum of no terms." },
    { line: 4, executable: true, explanation: "Start i at 1 — the first term to add." },
    { line: 5, executable: false, explanation: "Comment states the loop invariant." },
    { line: 6, executable: true, explanation: "Loop while i <= n. i increases each pass, guaranteeing termination." },
    { line: 7, executable: true, explanation: "Add i to total. This preserves the invariant (total now includes up to i)." },
    { line: 8, executable: true, explanation: "Advance i. The invariant is restored for the next pass." },
    { line: 9, executable: true, explanation: "Return total. At exit i = n+1, so total = sum of 1..n." },
    { line: 10, executable: false, explanation: "Blank line." },
    { line: 11, executable: true, explanation: "sum_to(5) = 1+2+3+4+5 = 15." },
    { line: 12, executable: false, explanation: "Comment: the n = 0 edge case." },
    { line: 13, executable: true, explanation: "sum_to(0): loop never runs, returns 0 — correct 'sum of nothing'." },
  ],

  bindings: [{ variable: "total", model: "object" }],

  prediction: [
    { atEventIndex: 0, prompt: "At the moment the loop exits for n = 5, what is i, and what does that tell you about total?", answer: "i = 6 (= n+1); the invariant then says total = sum of 1..5 = 15.", explanation: "The loop stops when i > n, i.e. i = n+1 = 6. The invariant 'total = sum of 1..(i-1)' becomes total = sum of 1..5, which is 15." },
  ],

  experiments: [
    "Trace the invariant at each step: check total equals the sum of 1..(i-1) every pass.",
    "Run sum_to(1) and sum_to(0) to confirm the single-term and empty edge cases.",
    "Replace the loop with the closed form n*(n+1)//2 and confirm identical results in O(1).",
  ],

  exercises: [
    {
      id: "correct-fix-1",
      kind: "fix-mistake",
      prompt: "This version has an off-by-one bug: it omits n. Fix the loop condition.",
      starterCode: "def sum_to(n):\n    total = 0\n    i = 1\n    while i < n:\n        total = total + i\n        i = i + 1\n    return total",
      expected: "def sum_to(n):\n    total = 0\n    i = 1\n    while i <= n:\n        total = total + i\n        i = i + 1\n    return total",
      hints: ["Should the final term n be included?", "The condition i < n stops before adding n.", "Use i <= n so the last term n is added."],
    },
    {
      id: "correct-predict-1",
      kind: "predict-state",
      prompt: "Why does sum_to(0) correctly return 0 without any special-case code?",
      expected: "Because the loop condition 1 <= 0 is False immediately, the body never runs, and total stays at its initial 0 — the sum of no terms.",
      hints: ["Does the loop body run when n = 0?", "The condition is False from the start.", "So total keeps its initial value, 0."],
    },
  ],

  review: `**Correctness** is being right for every valid input. Reason with a **loop invariant** (true before the loop and preserved each pass), check **edge cases** (empty/zero/single), and confirm **termination** (the loop makes progress). Here the invariant proves \`sum_to\` returns 1+…+n, and n = 0 works with no special case. The loop is **O(n)**; a closed form would be **O(1)**.`,

  expectedOutput: "15\n0\n",

  references: [
    {
      url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/lecture-notes/",
      title: "MIT 6.006 Introduction to Algorithms — Lecture notes",
      section: "Correctness / loop invariants",
      topic: "dsa/correctness",
      purpose: "Confirm the loop-invariant method (initialization, maintenance, termination) for arguing correctness.",
      verifiedClaims: ["A loop invariant is established initially, maintained each iteration, and used at termination to prove correctness"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "43c750a57f75a56c",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 1,
  },
};
