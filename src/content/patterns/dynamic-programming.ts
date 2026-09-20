/**
 * Pattern: Dynamic programming (memoization / tabulation).
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2). Output "55\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# Dynamic programming: solve overlapping subproblems ONCE and reuse the result.
# Here, top-down memoization of Fibonacci (fib(n) = fib(n-1) + fib(n-2)).
def fib(n):
    memo = {}
    def go(k):
        if k < 2:
            return k                 # base cases fib(0)=0, fib(1)=1
        if k in memo:
            return memo[k]           # reuse an already-computed subproblem
        memo[k] = go(k - 1) + go(k - 2)
        return memo[k]
    return go(n)

print(fib(10))  # 55, computed in O(n) instead of O(2**n)`;

export const dynamicProgrammingPattern: PatternDefinition = {
  id: "dynamic-programming",
  title: "Dynamic Programming",
  category: "Dynamic programming",
  summary:
    "When subproblems overlap and combine into an optimal whole, solve each once and reuse it — top-down (memoize) or bottom-up (tabulate).",

  clues: [
    "The problem asks for a COUNT, an OPTIMUM (min/max), or feasibility over sequences/grids/choices.",
    "A recursive formulation revisits the SAME subproblems many times (overlapping subproblems).",
    "The optimal answer is built from optimal answers to smaller subproblems (optimal substructure).",
    "Phrases like 'number of ways', 'minimum/maximum cost', 'longest/shortest ...', 'can you reach/partition ...'.",
  ],

  naiveApproach: `Plain recursion re-derives identical subproblems exponentially often — e.g. naive Fibonacci is **O(2ⁿ)** because \`fib(k)\` is recomputed across many branches. Brute-forcing all choices (all subsets/paths) is similarly exponential.`,

  whyItHelps: `If subproblems **overlap** and exhibit **optimal substructure**, compute each subproblem **once** and reuse it. **Top-down memoization** keeps the natural recursion but caches results by state; **bottom-up tabulation** fills a table from base cases in dependency order. Either way the cost drops to roughly **(number of distinct states) × (work per state)** — turning exponential recursion into polynomial time. Fibonacci goes from O(2ⁿ) to **O(n)**. The craft is picking the right **state** and **transition**; memoization is often easiest to write, tabulation avoids recursion limits and enables space compression.`,

  conditions: [
    "Overlapping subproblems (caching pays off) AND optimal substructure (subproblem optima compose).",
    "State must fully capture what the answer depends on; memo keys must be hashable/immutable.",
    "A valid evaluation order exists (dependencies computed before dependents), for tabulation.",
  ],

  alternatives: [
    "Greedy — when a locally optimal choice is provably globally optimal (no need to explore all subproblems).",
    "Backtracking — when you must ENUMERATE all configurations, not just count or optimize.",
    "Divide and conquer — when subproblems are INDEPENDENT (don't overlap), like merge sort.",
  ],

  counterexamples: [
    "If subproblems don't overlap (independent halves), plain divide and conquer is enough — memoization buys nothing.",
    "If a greedy choice is provably optimal (e.g. activity selection), DP is unnecessary overhead.",
    "Impure/side-effecting functions can't be safely memoized — cached values would skip the effects.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "55\n",
  complexityNote:
    "O(number of distinct states × work per state). Here O(n) time (each fib(k) computed once) and O(n) space for the memo plus recursion stack; naive recursion is O(2ⁿ).",

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: solve overlapping subproblems once." },
    { line: 2, executable: false, explanation: "Comment: memoized Fibonacci." },
    { line: 3, executable: true, explanation: "Define fib(n)." },
    { line: 4, executable: true, explanation: "The cache mapping a subproblem k to its answer." },
    { line: 5, executable: true, explanation: "Inner recursive solver for subproblem k." },
    { line: 6, executable: true, explanation: "Base cases: fib(0)=0, fib(1)=1." },
    { line: 7, executable: true, explanation: "Return k directly for the base cases." },
    { line: 8, executable: true, explanation: "If this subproblem is cached..." },
    { line: 9, executable: true, explanation: "...reuse it instead of recomputing." },
    { line: 10, executable: true, explanation: "Otherwise compute from the two smaller subproblems and store it." },
    { line: 11, executable: true, explanation: "Return the freshly computed value." },
    { line: 12, executable: true, explanation: "Kick off the recursion at n." },
    { line: 13, executable: false, explanation: "Blank line." },
    { line: 14, executable: true, explanation: "fib(10) = 55 in O(n) thanks to memoization." },
  ],

  bindings: [{ variable: "memo", model: "dict" }],

  linkedLessons: ["dp-memoization", "dp-tabulation", "dp-state-transitions", "dp-1d-2d"],

  exercises: [
    {
      id: "pat-dp-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Count the number of distinct ways to climb n stairs taking 1 or 2 steps.' Which pattern, and what's the state?",
      expected:
        "Dynamic programming: state = ways to reach step k; transition ways(k) = ways(k-1) + ways(k-2) (overlapping subproblems). Memoize or tabulate for O(n) instead of exponential recursion.",
      correctPatternId: "dynamic-programming",
      hints: [
        "'Number of ways' + overlapping subproblems.",
        "Define the state and the transition.",
        "Reuse subproblem answers.",
      ],
    },
    {
      id: "pat-dp-choose-1",
      kind: "choose-approach",
      prompt:
        "You must LIST every subset that sums to a target (not just count them). DP or backtracking?",
      expected:
        "Backtracking: you need each explicit configuration, which requires enumerating them. DP is for counting/optimizing over overlapping subproblems, not producing every combination.",
      correctPatternId: "dynamic-programming",
      hints: [
        "Enumerate explicitly -> backtracking.",
        "Count/optimize -> DP.",
        "Listing all subsets is enumeration.",
      ],
    },
    {
      id: "pat-dp-fix-1",
      kind: "fix-mistake",
      prompt:
        "This recursion is exponential because it never caches. Add memoization.",
      starterCode:
        "def fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)",
      expected:
        "from functools import lru_cache\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)",
      hints: [
        "The same subproblems are recomputed across branches.",
        "Cache results by argument.",
        "@lru_cache turns O(2^n) into O(n).",
      ],
    },
  ],

  references: [
    {
      url: "https://en.wikipedia.org/wiki/Dynamic_programming",
      title: "Dynamic programming — Wikipedia",
      section: "Overlapping subproblems, optimal substructure, memoization vs tabulation",
      topic: "patterns/dynamic-programming",
      purpose: "Confirm the two prerequisites (overlapping subproblems + optimal substructure) and the top-down/bottom-up forms.",
      verifiedClaims: [
        "DP applies when a problem has overlapping subproblems and optimal substructure.",
        "Memoization (top-down) and tabulation (bottom-up) both compute each subproblem once.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/lecture-notes/",
      title: "Introduction to Algorithms 6.006 — Dynamic Programming (MIT OCW)",
      section: "States, transitions, and memoization",
      topic: "patterns/dynamic-programming",
      purpose: "Cross-check that DP time is (number of subproblems) × (work per subproblem).",
      verifiedClaims: ["Memoization gives time proportional to the number of distinct subproblems times per-subproblem work."],
      accessDate: "2026-09-20",
    },
  ],
};
