/**
 * Lesson: DP — memoization (top-down) (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "55\n". Contrasts with the exponential naive
 * recursion from the recursive-calls lesson.
 */

import type { LessonDefinition } from "../../core/types";

const code = `from functools import lru_cache

# MEMOIZATION = recursion + a cache. Each subproblem is solved once, then reused.
@lru_cache(maxsize=None)
def fib(n):
    if n < 2:                 # base cases fib(0)=0, fib(1)=1
        return n
    return fib(n - 1) + fib(n - 2)  # results are cached by argument n

print(fib(10))   # 55, computed with O(n) calls instead of O(2**n)`;

export const dpMemoization: LessonDefinition = {
  id: "dp-memoization",
  title: "DP: Memoization (Top-Down)",
  area: "DP and recursion",
  prerequisites: ["dp-recursive-calls"],

  explanation: `**Memoization** is **dynamic programming written top-down**: keep the natural recursive definition, but **cache** each subproblem's result the first time it is computed, and **return the cached value** on later calls. It directly cures the exponential repeated work you saw in naive Fibonacci — where \`fib(6)\` cost 25 calls — by ensuring each distinct subproblem \`fib(k)\` runs its body **exactly once**.

Python makes this a one-line change with \`functools.lru_cache\` (or \`functools.cache\`), a decorator that wraps the function in a dictionary keyed by its arguments. The first call with a given \`n\` runs the body and stores the answer; every later call with that same \`n\` is an **O(1) dictionary lookup**. So the whole computation of \`fib(n)\` makes only about **n** distinct subproblem evaluations, turning **O(2ⁿ)** time into **O(n)**. The trade is **O(n)** memory for the cache (plus the O(n) recursion stack).

Two conditions must hold for memoization to be correct and useful: **overlapping subproblems** (the same inputs recur — otherwise caching buys nothing) and **optimal substructure / a pure function** (the answer depends only on the arguments, so a cached value is always valid). Arguments must also be **hashable** (immutable) to be dictionary keys — which is why \`lru_cache\` works on the integer \`n\` here but not directly on a list argument. Memoization keeps code close to the recurrence, so it's often the fastest way to make a correct recursive solution efficient; the next lesson shows the bottom-up (tabulation) alternative.`,

  vocabulary: [
    { term: "Memoization", definition: "Top-down DP: cache each subproblem's result and reuse it instead of recomputing." },
    { term: "Cache", definition: "A store (dictionary) mapping arguments to already-computed results." },
    { term: "lru_cache / cache", definition: "functools decorators that add an automatic argument-keyed cache to a function." },
    { term: "Overlapping subproblems", definition: "The same inputs recur, so caching saves repeated work." },
    { term: "Pure function", definition: "Output depends only on inputs (no side effects), making a cached value always valid." },
    { term: "Hashable argument", definition: "An immutable value usable as a cache key; lists are not hashable, tuples are." },
  ],

  concepts: {
    purpose:
      "Make a correct recursive solution efficient by solving each subproblem once and reusing the result, without rewriting the algorithm.",
    operations:
      "Look up the arguments in the cache; on a miss, compute via recursion, store, and return; on a hit, return the stored value.",
    uses:
      "Fibonacci, grid paths, coin change, edit distance, LCS/LIS variants — any recurrence with overlapping subproblems.",
    tradeoffs:
      "Trades O(number of distinct states) memory for a large time reduction; keeps code close to the recurrence; still uses O(depth) recursion stack.",
    commonMistakes:
      "Memoizing an impure/side-effecting function (stale results); using unhashable (mutable) arguments as keys; caching when subproblems don't actually overlap (no benefit).",
    edgeCases:
      "Base cases must still be present and correct. Unbounded caches grow with distinct inputs; use maxsize or clear the cache if memory matters.",
  },

  complexity: [
    { operation: "memoized Fibonacci", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)", note: "Each of n subproblems computed once; cache + stack are O(n)." },
    { operation: "naive Fibonacci (contrast)", best: "O(2ⁿ)", average: "O(2ⁿ)", worst: "O(2ⁿ)", space: "O(n)", note: "No cache: exponential repeated work." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the Fibonacci index requested (number of distinct subproblems)" }],
    costModel:
      "A cache hit is an O(1) dictionary lookup. Each distinct subproblem runs its O(1) body once; a cache miss also pays that O(1) body.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation:
        "There are only n+1 distinct arguments (fib(0)…fib(n)). Each is computed once (its body is O(1)); all other calls are O(1) cache hits. So total time is proportional to the number of distinct subproblems, O(n) — versus O(2ⁿ) for the uncached version.",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation:
        "The cache stores one entry per distinct argument: O(n) entries. The recursion stack is also at most O(n) deep on the first descent. Both are O(n).",
      inputOutputNote: "The single integer result is O(1); the O(n) space is the cache plus recursion stack, not tracer overhead.",
    },
    derivation: [
      { lines: [6, 7], description: "Base cases evaluated a constant number of times.", cost: "O(1)", dimension: "time" },
      { lines: [8], description: "The recursive body runs once per distinct n (n times); repeats are O(1) cache hits.", cost: "O(n)", dimension: "time" },
      { lines: [4], description: "The cache holds one result per distinct subproblem.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: [
      "fib is a pure function of n, so cached results stay valid.",
      "n is hashable (an int), usable as a cache key.",
      "The cache is unbounded (maxsize=None), so no entries are evicted mid-computation.",
    ],
    tradeoffs:
      "Memoization keeps the top-down recurrence but adds O(n) cache memory and an O(n) recursion stack. Tabulation (next lesson) computes bottom-up, avoiding recursion depth and sometimes reducing memory further.",
    counters: [
      { label: "distinct-subproblem bodies", definition: "executions of the recursive body line (line 8)", countLines: [8] },
      { label: "base-case evaluations", definition: "executions of the base-case return (line 7)", countLines: [7] },
    ],
    fixedDataNote:
      "fib(10) returns 55 using ~n distinct evaluations rather than the 2ⁿ calls of the naive version. The O(n) bound describes growth with n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import lru_cache, which adds an automatic argument-keyed cache." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: memoization = recursion + cache." },
    { line: 4, executable: true, explanation: "Decorate fib so its results are cached by n (unbounded cache)." },
    { line: 5, executable: true, explanation: "Define fib(n)." },
    { line: 6, executable: true, explanation: "Base cases: fib(0)=0, fib(1)=1." },
    { line: 7, executable: true, explanation: "Return n directly for the base cases." },
    { line: 8, executable: true, explanation: "Recursive case; each distinct n runs this once, then it's cached." },
    { line: 9, executable: false, explanation: "Blank line." },
    { line: 10, executable: true, explanation: "Print fib(10) = 55, computed in O(n)." },
  ],

  bindings: [{ variable: "n", model: "recursion" }],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "Adding @lru_cache turns naive Fibonacci from O(2ⁿ) into O(n). What exactly does the cache change about the work done?",
      answer: "It makes each distinct subproblem fib(k) compute its body only once; every later call with the same k is an O(1) lookup. The exponential re-computation of the same values is eliminated.",
      explanation: "The exponential blow-up came from re-solving identical subproblems. Caching each result once collapses the work to the number of distinct subproblems, O(n).",
    },
  ],

  experiments: [
    "Remove @lru_cache and add a call counter to see the count jump from ~n to 2ⁿ-scale.",
    "Print fib.cache_info() after the call to see hits, misses, and cache size.",
    "Try memoizing a function that takes a list argument and observe the unhashable-type error.",
  ],

  exercises: [
    {
      id: "dpmemo-complete-1",
      kind: "complete-code",
      prompt: "Add memoization to this recurrence using a dictionary (no decorator).",
      starterCode:
        "memo = {}\ndef fib(n):\n    if n < 2:\n        return n\n    # TODO: use memo to avoid recomputation\n    return fib(n - 1) + fib(n - 2)",
      expected:
        "memo = {}\ndef fib(n):\n    if n < 2:\n        return n\n    if n in memo:\n        return memo[n]\n    memo[n] = fib(n - 1) + fib(n - 2)\n    return memo[n]",
      hints: [
        "Check the cache before computing.",
        "Store the result before returning it.",
        "if n in memo: return memo[n]; memo[n] = ...",
      ],
    },
    {
      id: "dpmemo-choose-1",
      kind: "choose-approach",
      prompt: "A recursive function recomputes the same subproblems but keeps side effects (it prints as it goes). Is naive memoization safe? What's the fix?",
      expected: "Not safe as-is: caching would skip the side effects on repeat calls. Separate the pure computation (memoize that) from the side effects, or remove the side effects before caching.",
      hints: [
        "Memoization assumes the function is pure.",
        "Side effects won't run on cache hits.",
        "Isolate the pure part and cache only that.",
      ],
    },
    {
      id: "dpmemo-predict-1",
      kind: "predict-state",
      prompt: "With @lru_cache, roughly how many times does the body of fib actually run for fib(10), and why?",
      expected: "About 11 times (once per distinct n from 0 to 10); all other calls are O(1) cache hits.",
      hints: [
        "There are only n+1 distinct arguments.",
        "Each runs its body once.",
        "Repeats are cache lookups.",
      ],
    },
  ],

  review: `**Memoization** is **top-down DP**: keep the recurrence, but **cache each subproblem's result** and reuse it. \`functools.lru_cache\` does this in one line, turning naive Fibonacci from **O(2ⁿ)** into **O(n)** time at **O(n)** cache memory (plus an O(n) recursion stack). It requires **overlapping subproblems**, a **pure** function, and **hashable** arguments. \`fib(10)\` returns 55 with about n distinct evaluations. The next lesson computes the same answers bottom-up with **tabulation**.`,

  expectedOutput: "55\n",

  references: [
    {
      url: "https://docs.python.org/3/library/functools.html#functools.lru_cache",
      title: "functools.lru_cache — Python Standard Library",
      section: "lru_cache decorator; caching by (hashable) arguments",
      topic: "dp/memoization",
      purpose: "Confirm lru_cache caches results keyed by arguments (which must be hashable) and returns cached results on repeat calls, on the bundled Python version.",
      verifiedClaims: [
        "lru_cache memoizes a function's return values keyed by its arguments.",
        "Arguments must be hashable to be used as cache keys.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/lecture-notes/",
      title: "Introduction to Algorithms 6.006 — Dynamic Programming (MIT OCW)",
      section: "Memoization; overlapping subproblems and optimal substructure",
      topic: "dp/memoization",
      purpose: "Cross-check that memoization reduces overlapping-subproblem recursions to time proportional to the number of distinct subproblems.",
      verifiedClaims: [
        "Memoization computes each distinct subproblem once, giving time proportional to the number of subproblems times per-subproblem work.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "a640c8c937757c42",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
