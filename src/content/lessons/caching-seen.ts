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

  explanation: "**Memoization** is caching the result of a computation the first time you do it, keyed in a hash map, so repeated calls with the same input are answered instantly. It's the hashing pattern that turns exponential recomputation into linear work — and it's the doorway to dynamic programming.\n\nNaive recursive Fibonacci recomputes the same subproblems over and over: `fib(n)` calls `fib(n-1)` and `fib(n-2)`, which re-call overlapping values, giving an **exponential O(2ⁿ)** blow-up. With a `memo` dict, each non-base `fib(k)` is computed and cached **once** and thereafter is an expected-O(1) cache hit. That collapses the work to **O(n)** — one entry per non-base argument.\n\nThe mechanics are exactly \"cache what you've seen\": before computing, check the map; after computing, store the result. (Note the `memo=None` default guard — using a mutable `{}` default would share state across calls, a classic Python gotcha; Python's `functools.lru_cache` provides this caching as a decorator.) The recognition cue: **overlapping subproblems** — the same inputs recur — signals memoization, and it's the top-down form of dynamic programming you'll formalize later.\n\nThe base cases are not cached in this program: fib(0) and fib(1) may be called repeatedly, but each takes constant work. For a general memoized recurrence, count states AND work per subproblem (including transitions), not just states. Linear Fibonacci time/space here is a bounded-value unit-cost model with expected hashing; growing Fibonacci integers use more bits and can give O(n²) bit work/storage. Large n also reaches Python’s recursion limit; iteration avoids that stack. A recursive call is a function calling itself, and a base case stops that chain.",

  vocabulary: [
  {
    "term": "Memoization",
    "definition": "Caching a function's result per input so it's computed only once."
  },
  {
    "term": "Cache hit / miss",
    "definition": "The input is already stored (hit) or must be computed (miss)."
  },
  {
    "term": "Overlapping subproblems",
    "definition": "The same sub-inputs recur, making caching pay off."
  },
  {
    "term": "Top-down DP",
    "definition": "Recursion + memoization (as opposed to bottom-up tabulation)."
  },
  {
    "term": "lru_cache",
    "definition": "A decorator in Python’s functools standard-library module that caches results; its size policy controls evictions."
  }
],

  concepts: {
  "purpose": "Avoid recomputation by caching results in a map — the bridge from recursion to dynamic programming.",
  "operations": "Check the memo before computing; store the result after; reuse on future calls.",
  "uses": "Fibonacci, recursive DP (grid paths, coin change), expensive pure-function results, deduping work.",
  "tradeoffs": "Turns exponential/repeated work into O(number of distinct inputs) time, at the cost of O(that many) cache space.",
  "commonMistakes": "Using a mutable default arg ({}) that persists across calls; memoizing impure/side-effecting functions; unhashable arguments as keys; forgetting the base cases.",
  "edgeCases": "The base cases in this version are checked before cache lookup and are not stored. Cache lookup before an explicit base case can also be correct. Separate top-level calls share no cache unless it is passed or external; large n can reach the recursion limit."
},

  complexity: [
  {
    "operation": "fib with memo",
    "best": "O(n)",
    "average": "O(n)",
    "worst": "O(n²)",
    "space": "O(n)",
    "note": "Expected O(n) in a bounded-value unit-cost model; hash-collision or growing-integer costs need separate bounds."
  }
],

  complexityExplanation: {
  "scope": "program",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the Fibonacci index requested"
    }
  ],
  "costModel": "Bounded-value unit-cost model with expected O(1) memo operations. Arbitrary-precision Fibonacci arithmetic and total stored bits grow with n.",
  "time": {
    "bound": "O(n)",
    "case": "expected",
    "explanation": "There are n+1 possible indices 0..n. The n-1 non-base states are computed and cached once; base calls are not cached but remain constant work. With bounded-value arithmetic and expected constant-cost hashing, total work is O(n). General memoization sums each state’s transition/computation cost plus reuse costs; it is not automatically linear in the number of states."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The memo stores one entry per distinct argument — O(n) — and the recursion stack reaches depth O(n) for fib(n). Both are linear.",
    "inputOutputNote": "O(n) cached bounded-size values and O(n) frames. In a bit-cost model, cached Fibonacci values can occupy O(n²) total bits."
  },
  "derivation": [
    {
      "lines": [
        7,
        8
      ],
      "description": "A cache hit returns a stored result in expected O(1) — no recomputation.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        9
      ],
      "description": "Each distinct argument computes its body once; n distinct args → O(n) total.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        4,
        9
      ],
      "description": "The memo holds n entries; recursion depth is O(n).",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Arguments are hashable and map ops are expected O(1).",
    "The function is pure (same input → same output)."
  ],
  "tradeoffs": "Bottom-up tabulation computes the same values iteratively in O(n) time and can use O(1) space (keeping only the last two); memoization is more natural to write but keeps the full cache and recursion stack.",
  "counters": [
    {
      "label": "computed entries",
      "definition": "executions of the compute-and-store (line 9)",
      "countLines": [
        9
      ]
    },
    {
      "label": "recursive calls",
      "definition": "calls to fib (line 9)",
      "countLines": [
        9
      ]
    }
  ],
  "fixedDataNote": "For fib(10), states 2..10 are computed and cached once; base states 0 and 1 are returned without caching. The output is 55."
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
    "id": "cache-fix-1",
    "kind": "fix-mistake",
    "prompt": "Using a mutable default {} shares the cache across separate calls. Fix it with the None-guard idiom.",
    "starterCode": "def fib(n, memo={}):\n    if n < 2:\n        return n\n    if n not in memo:\n        memo[n] = fib(n-1, memo) + fib(n-2, memo)\n    return memo[n]",
    "expected": "def fib(n, memo=None):\n    if memo is None:\n        memo = {}\n    if n < 2:\n        return n\n    if n not in memo:\n        memo[n] = fib(n-1, memo) + fib(n-2, memo)\n    return memo[n]",
    "hints": [
      "Goal: fix memoised fib so separate calls don't share one accidental cache.",
      "The cost is a mutable default {} created once at definition time and shared across all calls.",
      "Key insight: default arguments are evaluated once, so a shared dict leaks state between calls.",
      "Approach: use the None-guard idiom, creating a fresh dict inside the function.",
      "Pseudocode: def fib(n, memo=None): if memo is None: memo = {}; then memoise as usual.",
      "Default `memo=None` and add `if memo is None: memo = {}` at the top."
    ],
    "tests": "assert fib(0) == 0\nassert fib(1) == 1\nassert fib(10) == 55, 'fib(10) == 55'\n# The bug is a shared mutable default {}: a fresh call with no memo must NOT be\n# polluted by previous calls. Prove memo does not persist across calls by\n# checking the default is not a dict carrying state.\nimport inspect\ndefaults = fib.__defaults__\nassert defaults == (None,), f'memo default must be None (None-guard idiom), got {defaults}'\nassert fib(7) == 13, 'independent call still correct'\nprint('OK')"
  },
  {
    "id": "cache-choose-1",
    "kind": "choose-approach",
    "prompt": "What property of a problem tells you memoization will help, and what's the resulting complexity relationship?",
    "expected": "Overlapping subproblems motivate memoization. Total work sums the work per subproblem (including its transitions) once, plus the cost of cache reuses. Fibonacci has constant work per state in a bounded-value model, so expected O(n); other recurrences can have more transitions.",
    "hints": [
      "Goal: decide when memoization will speed up a recursive algorithm and describe the resulting complexity relationship.",
      "The costly symptom without memoization is exponential recomputation of the same subproblems.",
      "Key property: the signal is overlapping subproblems — the same inputs recur across the recursion tree.",
      "Approach: cache each subproblem's result (memoize) so each is computed only once.",
      "Reasoning: with caching, total time becomes proportional to the number of DISTINCT subproblems plus O(1) per reuse; without overlap (all subproblems distinct) memoization adds overhead without saving work.",
      "Answer: overlapping subproblems are the signal — memoization makes total time proportional to the distinct subproblems (each solved once) plus O(1) per reuse, replacing exponential recomputation."
    ],
    "recognition": {
      "scenario": "You must decide when memoization will help a recursive algorithm, and describe the resulting complexity relationship.",
      "approaches": [
        {
          "id": "overlapping-subproblems",
          "label": "Apply memoization when subproblems OVERLAP (recur with the same inputs)",
          "requiredReasonIds": [
            "distinct-subproblems-once"
          ]
        },
        {
          "id": "memoize-always",
          "label": "Memoize every recursion regardless of structure",
          "requiredReasonIds": [],
          "rejectionFeedback": "If subproblems never repeat (e.g. plain divide-and-conquer on disjoint halves), a cache only adds overhead and memory — memoization helps only when the same inputs recur."
        }
      ],
      "reasons": [
        {
          "id": "distinct-subproblems-once",
          "text": "Overlapping subproblems mean the same inputs recur; caching each one makes total time proportional to the number of DISTINCT subproblems (each solved once) plus O(1) reuse, replacing exponential recomputation."
        },
        {
          "id": "always-helps",
          "text": "Memoization speeds up every recursive algorithm, even when subproblems never repeat.",
          "contradictory": true
        },
        {
          "id": "no-repeats-needed",
          "text": "Memoization helps precisely when subproblems are all distinct and never recur.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "overlapping-subproblems"
      ],
      "modelExplanation": "Overlapping subproblems are the signal: the same inputs recur. Memoization then makes total time proportional to the number of DISTINCT subproblems (each solved once) plus O(1) per reuse, replacing exponential recomputation."
    }
  }
],

  review: "Memoization reuses stored results when recursive subproblems overlap. Here each non-base Fibonacci state is computed once, while the cheap uncached base cases may repeat. In general, sum the work within each distinct state plus its transitions and reuse costs. Expected O(n) time/O(n) slots for this example assumes bounded-size arithmetic and expected dictionary behavior; growing Fibonacci integers change the bit-cost analysis.",

  expectedOutput: "55\n",

  references: [
  {
    "url": "https://docs.python.org/3/library/functools.html#functools.lru_cache",
    "title": "functools — lru_cache — Python documentation",
    "section": "lru_cache (memoization decorator)",
    "topic": "hashing/caching",
    "purpose": "Confirm Python provides memoization via a hash-backed cache decorator, matching the manual memo pattern.",
    "verifiedClaims": [
      "lru_cache memoizes a function's results keyed by its arguments"
    ],
    "accessDate": "2026-09-20"
  },
  {
    "url": "https://runestone.academy/ns/books/published/pythonds3/Recursion/DynamicProgramming.html",
    "title": "Runestone: dynamic programming",
    "section": "Repeated coin-change calls and result caching",
    "topic": "codex/b2-b",
    "purpose": "Verify the specific semantics and conditions used in this lesson.",
    "verifiedClaims": [
      "Caching prior subproblem results avoids repeating their computation."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://docs.python.org/3.14/library/functools.html#functools.lru_cache",
    "title": "Python functools caching",
    "section": "lru_cache; hashable arguments and eviction",
    "topic": "codex/b2-b",
    "purpose": "Verify the specific semantics and conditions used in this lesson.",
    "verifiedClaims": [
      "lru_cache caches results keyed by hashable arguments, with a configurable size limit."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 19,
    contentHash: "e204707d577bcd02",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
