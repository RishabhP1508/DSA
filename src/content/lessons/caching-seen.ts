/**
 * Lesson: Caching previously seen values / memoization (Hashing).
 * Verified on CPython 3.14. Output: "55\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Memoization: cache computed results so each subproblem runs once.
def fib(n, memo=None):
    if memo is None:
        memo = {}
    if n < 2:
        return n              # base cases: fib(0)=0, fib(1)=1
    if n in memo:
        return memo[n]        # cache hit: reuse the stored result
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]

print(fib(10))`;

export const cachingSeen: LessonDefinition = {
  id: "caching-seen",
  title: "Caching Seen Values (Memoization)",
  area: "Hashing",
  prerequisites: ["maps-sets", "functions"],

  explanation: `**Memoization** is caching the result of a computation the first time you do it, keyed in a hash map, so repeated calls with the same input are answered instantly. It's the hashing pattern that turns exponential recomputation into linear work — and it's the doorway to dynamic programming.

Naive recursive Fibonacci recomputes the same subproblems over and over: \`fib(n)\` calls \`fib(n-1)\` and \`fib(n-2)\`, which re-call overlapping values, giving an **exponential O(2ⁿ)** blow-up. With a \`memo\` dict, each \`fib(k)\` is computed **once** and thereafter is an expected-O(1) cache hit. That collapses the work to **O(n)** — one entry per distinct argument.

The mechanics are exactly "cache what you've seen": before computing, check the map; after computing, store the result. (Note the \`memo=None\` default guard — using a mutable \`{}\` default would share state across calls, a classic Python gotcha; Python's \`functools.lru_cache\` provides this caching as a decorator.) The recognition cue: **overlapping subproblems** — the same inputs recur — signals memoization, and it's the top-down form of dynamic programming you'll formalize later.`,

  vocabulary: [
    { term: "Memoization", definition: "Caching a function's result per input so it's computed only once." },
    { term: "Cache hit / miss", definition: "The input is already stored (hit) or must be computed (miss)." },
    { term: "Overlapping subproblems", definition: "The same sub-inputs recur, making caching pay off." },
    { term: "Top-down DP", definition: "Recursion + memoization (as opposed to bottom-up tabulation)." },
    { term: "lru_cache", definition: "Python's built-in decorator that memoizes a function automatically." },
  ],

  concepts: {
    purpose: "Avoid recomputation by caching results in a map — the bridge from recursion to dynamic programming.",
    operations: "Check the memo before computing; store the result after; reuse on future calls.",
    uses: "Fibonacci, recursive DP (grid paths, coin change), expensive pure-function results, deduping work.",
    tradeoffs: "Turns exponential/repeated work into O(number of distinct inputs) time, at the cost of O(that many) cache space.",
    commonMistakes: "Using a mutable default arg ({}) that persists across calls; memoizing impure/side-effecting functions; unhashable arguments as keys; forgetting the base cases.",
    edgeCases: "Base cases must be handled before the cache lookup. Repeated top-level calls share nothing unless the cache is external. Very large n grows the cache to O(n).",
  },

  complexity: [
    { operation: "fib with memo", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)", note: "Each of n distinct args computed once; without memo it's O(2^n)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the Fibonacci index requested" }],
    costModel: "Each memo lookup/store is expected O(1). Each distinct argument's body runs at most once.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "There are n distinct arguments (fib(0)..fib(n)). Memoization guarantees each is computed exactly once — the first call fills the cache, and every later reference is an expected-O(1) cache hit. So total work is O(n). Without the cache, the recursion tree branches into overlapping subproblems and does O(2ⁿ) work — the cache is what removes the exponential blow-up.",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "The memo stores one entry per distinct argument — O(n) — and the recursion stack reaches depth O(n) for fib(n). Both are linear.",
      inputOutputNote: "The memo dict (O(n)) and the O(n) recursion stack are auxiliary; the single result is O(1).",
    },
    derivation: [
      { lines: [7, 8], description: "A cache hit returns a stored result in expected O(1) — no recomputation.", cost: "O(1)", dimension: "time" },
      { lines: [9], description: "Each distinct argument computes its body once; n distinct args → O(n) total.", cost: "O(n)", dimension: "time" },
      { lines: [4, 9], description: "The memo holds n entries; recursion depth is O(n).", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Arguments are hashable and map ops are expected O(1).", "The function is pure (same input → same output)."],
    tradeoffs: "Bottom-up tabulation computes the same values iteratively in O(n) time and can use O(1) space (keeping only the last two); memoization is more natural to write but keeps the full cache and recursion stack.",
    counters: [
      { label: "computed entries", definition: "executions of the compute-and-store (line 9)", countLines: [9] },
      { label: "recursive calls", definition: "calls to fib (line 9)", countLines: [9] },
    ],
    fixedDataNote: "This run computes fib(10) = 55; with memoization each of fib(0..10) is computed once. Without the cache the same call would branch exponentially.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: cache results so each subproblem runs once." },
    { line: 2, executable: true, explanation: "Define fib(n) with an optional memo cache." },
    { line: 3, executable: true, explanation: "Guard: create a fresh dict if none was passed (avoids the mutable-default gotcha)." },
    { line: 4, executable: true, explanation: "Initialise the memo on the first call." },
    { line: 5, executable: true, explanation: "Base cases: fib(0)=0, fib(1)=1." },
    { line: 6, executable: true, explanation: "Return the base value directly." },
    { line: 7, executable: true, explanation: "Cache check: has fib(n) been computed already?" },
    { line: 8, executable: true, explanation: "Cache hit: reuse the stored result in expected O(1)." },
    { line: 9, executable: true, explanation: "Cache miss: compute fib(n-1)+fib(n-2) once and store it." },
    { line: 10, executable: true, explanation: "Return the freshly computed, now-cached result." },
    { line: 11, executable: false, explanation: "Blank line." },
    { line: 12, executable: true, explanation: "fib(10) → 55, computed in O(n) thanks to the cache." },
  ],

  bindings: [{ variable: "memo", model: "dict" }],

  prediction: [
    { atEventIndex: 0, prompt: "Naive fib is O(2^n). Why does adding a memo dict make it O(n)?", answer: "Because there are only n distinct arguments; the memo ensures each is computed once and every repeat is an O(1) cache hit, eliminating the overlapping recomputation that caused the exponential blow-up.", explanation: "The exponential cost came from recomputing the same subproblems many times. Caching each distinct result collapses the work to one computation per distinct input — n of them — giving O(n)." },
  ],

  experiments: [
    "Count how many times line 9 runs for fib(10) — it's about n, not 2^n.",
    "Remove the memo and try fib(35) to feel the exponential slowdown.",
    "Replace the manual memo with @functools.lru_cache and compare.",
  ],

  exercises: [
    {
      id: "cache-fix-1",
      kind: "fix-mistake",
      prompt: "Using a mutable default {} shares the cache across separate calls. Fix it with the None-guard idiom.",
      starterCode: "def fib(n, memo={}):\n    if n < 2:\n        return n\n    if n not in memo:\n        memo[n] = fib(n-1, memo) + fib(n-2, memo)\n    return memo[n]",
      expected: "def fib(n, memo=None):\n    if memo is None:\n        memo = {}\n    if n < 2:\n        return n\n    if n not in memo:\n        memo[n] = fib(n-1, memo) + fib(n-2, memo)\n    return memo[n]",
      hints: ["A default {} is created once and shared across calls.", "Use None as the default and create the dict inside.", "if memo is None: memo = {}"],
    },
    {
      id: "cache-choose-1",
      kind: "choose-approach",
      prompt: "What property of a problem tells you memoization will help, and what's the resulting complexity relationship?",
      expected: "Overlapping subproblems — the same inputs recur. Memoization then makes total time proportional to the number of DISTINCT subproblems (each solved once) plus O(1) per reuse, replacing exponential recomputation.",
      hints: ["When do the same inputs get computed repeatedly?", "That's 'overlapping subproblems'.", "Caching → one computation per distinct input."],
    },
  ],

  review: `**Memoization** caches results in a hash map keyed by input, so each distinct subproblem is computed **once** and reused in expected **O(1)** — turning naive Fibonacci's **O(2ⁿ)** into **O(n)** time and **O(n)** space. Check the cache before computing and store after. Avoid the mutable-default gotcha (use \`memo=None\`), and recognize **overlapping subproblems** as the trigger — this is top-down dynamic programming.`,

  expectedOutput: "55\n",

  references: [
    {
      url: "https://docs.python.org/3/library/functools.html#functools.lru_cache",
      title: "functools — lru_cache — Python documentation",
      section: "lru_cache (memoization decorator)",
      topic: "hashing/caching",
      purpose: "Confirm Python provides memoization via a hash-backed cache decorator, matching the manual memo pattern.",
      verifiedClaims: ["lru_cache memoizes a function's results keyed by its arguments"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/lecture-notes/",
      title: "MIT 6.006 Introduction to Algorithms — Lecture notes",
      section: "Dynamic programming / memoization",
      topic: "hashing/caching",
      purpose: "Cross-check that memoization makes time proportional to the number of distinct subproblems (top-down DP).",
      verifiedClaims: ["Memoization reduces overlapping-subproblem recursion to time proportional to distinct subproblems"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "7b9396e6dadbd2e8",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
