/**
 * Lesson: DP worked example — climbing stairs (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "8\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Climbing stairs: each move is 1 or 2 steps. How many ways to reach step n?
# ways(n) = ways(n-1) + ways(n-2)  -- it's Fibonacci in disguise.
def climb(n):
    a, b = 1, 1        # ways(0) = 1 (do nothing), ways(1) = 1
    for _ in range(n):
        a, b = b, a + b  # roll forward: keep only the last two counts
    return a

print(climb(5))   # 8 ways to climb 5 stairs`;

export const dpClimbingStairs: LessonDefinition = {
  id: "dp-climbing-stairs",
  title: "DP Example: Climbing Stairs",
  area: "DP and recursion",
  prerequisites: ["dp-tabulation", "dp-state-transitions"],

  explanation: `**Climbing stairs** is the friendliest first DP: you climb a staircase of \`n\` steps, moving **1 or 2 steps** at a time, and count the **distinct ways** to reach the top. The insight that turns it into DP: to land on step \`n\`, your **last move** was either a **1-step** from step \`n−1\` or a **2-step** from step \`n−2\`. Those are the only two possibilities and they don't overlap, so \`ways(n) = ways(n−1) + ways(n−2)\` — the **Fibonacci recurrence**.

The **base cases** are \`ways(0) = 1\` (one way to "climb" zero steps: do nothing) and \`ways(1) = 1\` (a single 1-step). From there the counts are 1, 1, 2, 3, 5, 8, … — Fibonacci. A naive recursion would recompute subproblems exponentially (the recursive-calls lesson showed why), so we go **bottom-up**. And because each value depends only on the **previous two**, we don't even need a table: two rolling variables \`a, b\` suffice, updated with the simultaneous assignment \`a, b = b, a + b\`. That gives **O(n)** time and **O(1)** space. For \`n = 5\` there are **8** ways.

The point of this worked example is to see the full DP pipeline on something intuitive: **recognize the recurrence** (last move splits into two cases), **identify base cases**, **choose bottom-up with rolling state** for efficiency, and **verify** against small hand-counts (n=2 → 2 ways: 1+1 or 2; n=3 → 3 ways). This exact "count the ways, split by the last choice" pattern reappears in coin change, tiling problems, and decode-ways — recognizing it saves you from reinventing the recurrence each time.`,

  vocabulary: [
    { term: "Ways count", definition: "The number of distinct sequences of moves that reach the target." },
    { term: "Last-move split", definition: "Deriving the recurrence by casing on the final step (here, 1 or 2)." },
    { term: "Fibonacci recurrence", definition: "f(n) = f(n-1) + f(n-2); climbing stairs matches it." },
    { term: "Rolling variables", definition: "Two values a, b replacing the full DP table since only the last two counts matter." },
    { term: "Simultaneous assignment", definition: "a, b = b, a + b updates both from their old values at once." },
  ],

  concepts: {
    purpose:
      "Introduce the complete DP workflow on an intuitive counting problem and reveal the reusable 'last-move split' recurrence.",
    operations:
      "Seed base cases; iterate n times updating two rolling counts; return the count for step n.",
    uses:
      "Counting move sequences, tiling a 2×n board, decode-ways, and any 'reach n by steps of size s' counting problem.",
    tradeoffs:
      "Bottom-up rolling state is O(n)/O(1); naive recursion is exponential; a full table is O(n) space but unnecessary here.",
    commonMistakes:
      "Wrong base cases (ways(0) must be 1); computing values top-down without memoization (exponential); off-by-one in the loop count.",
    edgeCases:
      "n = 0 → 1 way (do nothing). n = 1 → 1 way. n = 2 → 2 ways. The rolling init a=b=1 handles all of these.",
  },

  complexity: [
    { operation: "climbing stairs (rolling DP)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "One pass; two rolling variables." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of stairs to climb" }],
    costModel: "Each loop iteration does O(1) work (one addition and a paired assignment).",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation:
        "The loop runs exactly n times, each doing constant work, so total time is proportional to n. This replaces the exponential naive recursion with a single linear pass.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation:
        "Only two variables a and b are kept, no matter how large n is, because each count depends only on the previous two.",
      inputOutputNote: "The single integer count is O(1); no table is allocated.",
    },
    derivation: [
      { lines: [4], description: "Seed the two base-case counts — O(1).", cost: "O(1)", dimension: "time" },
      { lines: [5, 6], description: "Loop runs n times, one O(1) rolling update each.", cost: "O(n)", dimension: "time" },
      { lines: [4], description: "Two rolling variables, independent of n.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: [
      "Allowed moves are exactly 1 or 2 steps.",
      "ways(0) = 1 (the empty climb counts as one way).",
      "One addition is O(1) (ignoring big-integer growth).",
    ],
    tradeoffs:
      "Rolling state is optimal here; a full dp array would cost O(n) space for no benefit, and naive recursion is exponential. If you also needed all intermediate counts, a table would be justified.",
    counters: [
      { label: "rolling updates", definition: "executions of the update line (line 6)", countLines: [6] },
      { label: "loop iterations", definition: "executions of the loop body (line 5)", countLines: [5] },
    ],
    fixedDataNote:
      "climb(5) runs 5 iterations producing 8. The O(n) bound describes how the work scales with the number of stairs.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: moves of 1 or 2, count the ways." },
    { line: 2, executable: false, explanation: "Comment: the recurrence is Fibonacci." },
    { line: 3, executable: true, explanation: "Define climb(n)." },
    { line: 4, executable: true, explanation: "Base cases as rolling state: ways(0)=1 and ways(1)=1." },
    { line: 5, executable: true, explanation: "Advance n times toward the top step." },
    { line: 6, executable: true, explanation: "Roll forward: new pair is (old b, old a + old b) — the next two counts." },
    { line: 7, executable: true, explanation: "After n rolls, a holds ways(n)." },
    { line: 8, executable: false, explanation: "Blank line." },
    { line: 9, executable: true, explanation: "climb(5) = 8." },
  ],

  bindings: [
    {
      variable: "a",
      model: "object",
      overlays: [{ role: "total", label: "b", source: "b" }],
    },
  ],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "How do you derive ways(n) = ways(n-1) + ways(n-2) from the rules of the problem?",
      answer: "Your last move onto step n was either a 1-step (from step n-1) or a 2-step (from step n-2). These cases are exhaustive and disjoint, so the total ways is the sum of ways to reach n-1 and n-2.",
      explanation: "Casing on the final move — the 'last-move split' — is the standard way to derive counting recurrences, and here it yields Fibonacci.",
    },
  ],

  experiments: [
    "Print a, b each iteration to watch the Fibonacci sequence roll forward.",
    "Allow moves of 1, 2, or 3 steps and extend the recurrence to sum three previous counts.",
    "Compare climb(n) to a memoized recursive version and confirm they agree.",
  ],

  exercises: [
    {
      id: "dpcs-complete-1",
      kind: "complete-code",
      prompt: "Complete the rolling update so climb counts the ways.",
      starterCode:
        "def climb(n):\n    a, b = 1, 1\n    for _ in range(n):\n        # TODO: roll the two counts forward\n        pass\n    return a",
      expected:
        "def climb(n):\n    a, b = 1, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a",
      tests:
        "assert climb(0) == 1, 'n=0 -> 1'\nassert climb(1) == 1, 'n=1 -> 1'\nassert climb(2) == 2, 'n=2 -> 2'\nassert climb(3) == 3, 'n=3 -> 3'\nassert climb(5) == 8, 'n=5 -> 8'\nprint('OK')",
      hints: [
        "Each count is the sum of the previous two.",
        "Update both at once with a tuple assignment.",
        "a, b = b, a + b",
      ],
    },
    {
      id: "dpcs-predict-1",
      kind: "predict-state",
      prompt: "By hand, how many ways to climb 3 stairs, and does climb(3) agree?",
      expected: "3 ways: (1,1,1), (1,2), (2,1). climb(3) returns 3.",
      hints: [
        "List the move sequences.",
        "There are three.",
        "ways(3) = ways(2) + ways(1) = 2 + 1 = 3.",
      ],
    },
    {
      id: "dpcs-choose-1",
      kind: "choose-approach",
      prompt: "You must count ways to reach step n for very large n. Naive recursion, memoized recursion, or rolling-variable bottom-up — and why?",
      expected: "Rolling-variable bottom-up: O(n) time, O(1) space, no recursion limit. Naive recursion is exponential; memoized recursion is O(n) time but uses O(n) cache and stack.",
      hints: [
        "Naive is exponential.",
        "You only need the last two counts.",
        "Rolling variables give O(1) space with no recursion.",
      ],
    },
  ],

  review: `**Climbing stairs** counts ways to reach step n with 1- or 2-step moves. The **last-move split** gives \`ways(n) = ways(n-1) + ways(n-2)\` — **Fibonacci** — with base cases \`ways(0)=ways(1)=1\`. Going **bottom-up with two rolling variables** (\`a, b = b, a + b\`) makes it **O(n)** time, **O(1)** space. The workflow — spot the recurrence, set base cases, roll forward, sanity-check small n — transfers to coin change, tiling, and decode-ways. \`climb(5) = 8\`.`,

  expectedOutput: "8\n",

  references: [
    {
      url: "https://leetcode.com/problems/climbing-stairs/editorial/",
      title: "Climbing Stairs — LeetCode editorial",
      section: "Fibonacci recurrence; O(n)/O(1) bottom-up",
      topic: "dp/climbing-stairs",
      purpose: "Confirm the ways(n)=ways(n-1)+ways(n-2) recurrence, base cases, and the O(n) time / O(1) space rolling solution.",
      verifiedClaims: [
        "The number of ways to climb n stairs with 1- or 2-steps follows the Fibonacci recurrence.",
        "It can be computed in O(n) time and O(1) space with two rolling variables.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/Recursion/DynamicProgramming.html",
      title: "Dynamic Programming — Problem Solving with Algorithms and Data Structures (Runestone)",
      section: "Counting with recurrences",
      topic: "dp/climbing-stairs",
      purpose: "Cross-check deriving counting recurrences by casing on the last choice.",
      verifiedClaims: [
        "Counting problems can be solved by a recurrence that sums the counts of the disjoint last-choice cases.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 15,
    contentHash: "668382c2d1667956",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
