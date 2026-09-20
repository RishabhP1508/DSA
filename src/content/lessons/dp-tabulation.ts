/**
 * Lesson: DP — tabulation (bottom-up) (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "55\n". Uses the dp-table visualizer to show the
 * table filling from the base cases upward.
 */

import type { LessonDefinition } from "../../core/types";

const code = `# TABULATION = bottom-up DP. Fill a table from the base cases upward,
# so every value we need is already computed before we use it.
def fib(n):
    if n < 2:
        return n
    dp = [0] * (n + 1)     # dp[i] will hold the i-th Fibonacci number
    dp[1] = 1              # base cases: dp[0] = 0, dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]  # transition uses smaller, ready values
    return dp[n]

print(fib(10))   # 55`;

export const dpTabulation: LessonDefinition = {
  id: "dp-tabulation",
  title: "DP: Tabulation (Bottom-Up)",
  area: "DP and recursion",
  prerequisites: ["dp-memoization"],

  explanation: `**Tabulation** is **dynamic programming written bottom-up**. Instead of recursing from the goal down to the base cases (memoization), you **start from the base cases and fill a table forward**, computing small subproblems first so that every value a transition needs is **already in the table** when you reach it. There is no recursion and no cache lookup — just a loop over states in an order that respects their dependencies.

For Fibonacci: create \`dp\` where \`dp[i]\` will hold the i-th Fibonacci number, seed the base cases \`dp[0] = 0\` and \`dp[1] = 1\`, then sweep \`i\` from 2 upward with the **transition** \`dp[i] = dp[i-1] + dp[i-2]\`. Because \`i-1\` and \`i-2\` are smaller and were filled on earlier iterations, each step is a direct lookup — no recomputation. The answer is \`dp[n]\`. This is **O(n)** time and **O(n)** space, the same asymptotics as memoization but with **no recursion stack** (so no depth limit) and typically a smaller constant factor.

Tabulation vs memoization is a real design choice. **Memoization** is easy to write (decorate the recurrence) and only computes states you actually reach, but pays recursion overhead and stack depth. **Tabulation** avoids recursion and makes the fill order explicit, which is what enables **space optimization**: since Fibonacci's transition only looks back two cells, you can drop the whole array and keep just **two rolling variables**, reducing space to **O(1)**. The essential requirement for tabulation is a **valid ordering** of states — you must fill dependencies before dependents; getting that order wrong reads uninitialized cells. \`fib(10)\` tabulates to 55.`,

  vocabulary: [
    { term: "Tabulation", definition: "Bottom-up DP: fill a table from base cases forward, no recursion." },
    { term: "DP table", definition: "An array/grid where each cell stores one subproblem's answer (here dp[i])." },
    { term: "Transition", definition: "The formula computing a state from already-filled smaller states." },
    { term: "Fill order", definition: "The sequence of states chosen so every dependency is ready before it's used." },
    { term: "Rolling variables", definition: "Keeping only the few recent cells a transition needs, reducing space." },
  ],

  concepts: {
    purpose:
      "Compute DP answers iteratively from base cases upward, avoiding recursion overhead and enabling explicit space optimization.",
    operations:
      "Initialize base cases in the table; loop states in dependency order applying the transition; read the answer from the goal cell.",
    uses:
      "Fibonacci, climbing stairs, coin change, knapsack, edit distance, LCS — any recurrence with a clear fill order.",
    tradeoffs:
      "No recursion stack (no depth limit) and often faster constants; but it always fills every state in range, even ones a top-down search might skip.",
    commonMistakes:
      "Wrong fill order (reading not-yet-computed cells); off-by-one in table size or base-case indices; returning dp[n-1] instead of dp[n].",
    edgeCases:
      "n < 2 handled before allocating the table. dp must be large enough (n+1 cells). For n = 1 the base seed dp[1] = 1 must not index out of range.",
  },

  complexity: [
    { operation: "tabulated Fibonacci", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)", note: "One pass filling n cells; O(1) with rolling variables." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the Fibonacci index requested (number of table cells)" }],
    costModel:
      "Filling one table cell is O(1) (an addition and two lookups). The loop fills each cell once.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation:
        "The loop runs from 2 to n, filling one cell per iteration with a constant-time transition. So the total time is proportional to n — the same as memoization but without recursion or cache-lookup overhead.",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation:
        "The dp array holds n+1 cells. Because the transition only reads the two previous cells, this can be reduced to O(1) by keeping two rolling variables instead of the full array.",
      inputOutputNote: "The single integer answer is O(1); the O(n) space is the table, reducible to O(1). No recursion stack is used.",
    },
    derivation: [
      { lines: [6, 7], description: "Allocate the table and seed base cases — O(n) allocation, O(1) seeds.", cost: "O(n)", dimension: "space" },
      { lines: [8, 9], description: "Loop fills cells 2..n, one O(1) transition each.", cost: "O(n)", dimension: "time" },
      { lines: [10], description: "Read the goal cell dp[n] — O(1).", cost: "O(1)", dimension: "time" },
    ],
    assumptions: [
      "The fill order (increasing i) computes every dependency before it's used.",
      "One addition is O(1) (ignoring big-integer growth).",
      "The table is sized n+1 to index dp[n].",
    ],
    tradeoffs:
      "Versus memoization: tabulation avoids the recursion stack and cache overhead and exposes the fill order for O(1) space optimization; but it fills all states in range, even ones a top-down search would skip. For dense DPs like Fibonacci, tabulation is usually the leaner choice.",
    counters: [
      { label: "cells filled", definition: "executions of the transition line (line 9)", countLines: [9] },
      { label: "loop iterations", definition: "executions of the loop header body (line 8)", countLines: [8] },
    ],
    fixedDataNote:
      "fib(10) fills cells dp[2..10] (9 transitions) to reach 55. The O(n) bound describes how the fill scales with n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: tabulation fills a table from base cases upward." },
    { line: 2, executable: false, explanation: "Comment continued: dependencies are ready before use." },
    { line: 3, executable: true, explanation: "Define fib(n)." },
    { line: 4, executable: true, explanation: "Handle the tiny base range n < 2 directly." },
    { line: 5, executable: true, explanation: "Return n for n = 0 or 1." },
    { line: 6, executable: true, explanation: "Allocate the DP table with n+1 cells." },
    { line: 7, executable: true, explanation: "Seed base cases: dp[0] stays 0, dp[1] = 1." },
    { line: 8, executable: true, explanation: "Fill states from 2 up to n in dependency order." },
    { line: 9, executable: true, explanation: "Transition: each cell is the sum of the two previous (already-filled) cells." },
    { line: 10, executable: true, explanation: "The answer is the goal cell dp[n]." },
    { line: 11, executable: false, explanation: "Blank line." },
    { line: 12, executable: true, explanation: "Print fib(10) = 55." },
  ],

  bindings: [
    {
      variable: "dp",
      model: "dp-table",
      // Current-cell overlay driven by the ACTUAL loop index `i` in the trace.
      overlays: [{ role: "pointer", label: "i", source: "i" }],
    },
  ],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "Why can each transition `dp[i] = dp[i-1] + dp[i-2]` be a simple lookup with no recomputation?",
      answer: "Because we fill i in increasing order, dp[i-1] and dp[i-2] were computed on earlier iterations and are already stored. The fill order guarantees every dependency is ready before it's used.",
      explanation: "Bottom-up fill in dependency order means dependents are only computed after their dependencies, so transitions are direct reads.",
    },
  ],

  experiments: [
    "Rewrite fib with two rolling variables to make it O(1) space and confirm it still prints 55.",
    "Reverse the loop direction and watch it read uninitialized cells (wrong answer).",
    "Print dp after the loop to see the whole Fibonacci prefix stored in the table.",
  ],

  exercises: [
    {
      id: "dptab-complete-1",
      kind: "complete-code",
      prompt: "Complete the bottom-up transition to fill the Fibonacci table.",
      starterCode:
        "dp = [0] * (n + 1)\ndp[1] = 1\nfor i in range(2, n + 1):\n    # TODO: fill dp[i] from smaller cells\n    pass\nreturn dp[n]",
      expected:
        "dp = [0] * (n + 1)\ndp[1] = 1\nfor i in range(2, n + 1):\n    dp[i] = dp[i - 1] + dp[i - 2]\nreturn dp[n]",
      hints: [
        "Fibonacci sums the two previous numbers.",
        "Those are dp[i-1] and dp[i-2].",
        "dp[i] = dp[i - 1] + dp[i - 2]",
      ],
    },
    {
      id: "dptab-choose-1",
      kind: "choose-approach",
      prompt: "You have a DP whose recursion depth would exceed Python's recursion limit for large inputs. Memoization or tabulation, and why?",
      expected: "Tabulation: it's iterative, so there's no recursion stack and no depth-limit risk. Memoized recursion could hit RecursionError for very large inputs.",
      hints: [
        "Deep recursion can overflow the stack.",
        "One approach uses no recursion.",
        "Bottom-up tabulation is iterative.",
      ],
    },
    {
      id: "dptab-predict-1",
      kind: "predict-state",
      prompt: "For fib(10), how many transition assignments (line 9) execute, and what is dp[10]?",
      expected: "9 transitions (i from 2 to 10 inclusive); dp[10] = 55.",
      hints: [
        "The loop runs i = 2..10.",
        "That's 9 values.",
        "dp[10] holds the answer 55.",
      ],
    },
  ],

  review: `**Tabulation** is **bottom-up DP**: seed the base cases in a table and fill states forward in **dependency order**, so each **transition** reads already-computed cells. It matches memoization's **O(n)** time/space but uses **no recursion stack** and exposes the fill order — enabling **O(1) space** here via two rolling variables. The must-get-right part is a **valid fill order**. Choose tabulation to avoid recursion limits and shave constants; choose memoization to stay close to the recurrence. \`fib(10)\` tabulates to 55.`,

  expectedOutput: "55\n",

  references: [
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/Recursion/DynamicProgramming.html",
      title: "Dynamic Programming — Problem Solving with Algorithms and Data Structures (Runestone)",
      section: "Bottom-up table filling",
      topic: "dp/tabulation",
      purpose: "Confirm the bottom-up tabulation approach: build a table of subproblem answers from the smallest cases upward.",
      verifiedClaims: [
        "Bottom-up dynamic programming builds a table of solutions to smaller subproblems and combines them.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://en.wikipedia.org/wiki/Dynamic_programming",
      title: "Dynamic programming — Wikipedia",
      section: "Bottom-up (tabulation) vs top-down (memoization)",
      topic: "dp/tabulation",
      purpose: "Cross-check the distinction between bottom-up tabulation and top-down memoization and that tabulation avoids recursion.",
      verifiedClaims: [
        "Bottom-up DP fills a table iteratively from base cases; top-down uses memoized recursion.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "94a2fe8f5c7ec0f8",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
