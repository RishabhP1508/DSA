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
    if n < 0:
        raise ValueError("n must be non-negative")
    if n < 2:                 # base cases fib(0)=0, fib(1)=1
        return n
    return fib(n - 1) + fib(n - 2)  # results are cached by argument n

print(fib(10))   # 55, computed with O(n) calls instead of O(2**n)`;

export const dpMemoization: LessonDefinition = {
  id: "dp-memoization",
  title: "DP: Memoization (Top-Down)",
  area: "DP and recursion",
  prerequisites: [
  "dp-recursive-calls",
  "maps-sets"
],

  explanation: "**Memoization** is **dynamic programming written top-down**: keep the natural recursive definition, but **cache** each subproblem's result the first time it is computed, and **return the cached value** on later calls. It directly cures the exponential repeated work you saw in naive Fibonacci — where `fib(6)` cost 25 calls — by ensuring each distinct subproblem `fib(k)` runs its body **exactly once**.\n\nPython makes this a one-line change with `functools.lru_cache` (or `functools.cache`), a decorator that wraps the function in a dictionary keyed by its arguments. The first call with a given `n` runs the body and stores the answer; every later successful call with that same `n` is an **expected O(1) cache lookup**. So the whole computation of `fib(n)` makes only about **n** distinct subproblem evaluations, turning **O(2ⁿ)** time into **O(n)**. The trade is **O(n)** memory for the cache (plus the O(n) recursion stack).\n\nTwo conditions must hold for memoization to be correct and useful: **overlapping subproblems** (the same inputs recur — otherwise caching buys nothing) and **a valid recurrence and stable computation** (the cached result remains valid for the complete state). Arguments must also be **hashable** to be dictionary keys — which is why `lru_cache` works on the integer `n` here but not directly on a list argument. Memoization keeps code close to the recurrence, so it's often the fastest way to make a correct recursive solution efficient; the next lesson shows the bottom-up (tabulation) alternative.\n\nHashable means an object has a stable hash and compatible equality, not simply that it is immutable. A tuple is hashable only if its elements are hashable. Cached mutable results are shared references, so mutating a returned list would affect future cache hits. The Fibonacci results here are immutable integers. This top-down memoization is dynamic programming in the terminology used by MIT and Python's documentation.",

  vocabulary: [
  {
    "term": "Memoization",
    "definition": "Top-down DP: cache each subproblem's result and reuse it instead of recomputing."
  },
  {
    "term": "Cache",
    "definition": "A store (dictionary) mapping arguments to already-computed results."
  },
  {
    "term": "lru_cache / cache",
    "definition": "functools decorators that add an automatic argument-keyed cache to a function."
  },
  {
    "term": "Overlapping subproblems",
    "definition": "The same inputs recur, so caching saves repeated work."
  },
  {
    "term": "Pure function",
    "definition": "Output depends only on inputs (no side effects), making a cached value always valid."
  },
  {
    "term": "Hashable argument",
    "definition": "An argument with a stable hash and compatible equality. Lists are unhashable; a tuple is hashable only when all its elements are hashable."
  }
],

  concepts: {
  "purpose": "Make a correct recursive solution efficient by solving each subproblem once and reusing the result, without rewriting the algorithm.",
  "operations": "Look up the arguments in the cache; on a miss, compute via recursion, store, and return; on a hit, return the stored value.",
  "uses": "Fibonacci, grid paths, coin change, edit distance, LCS/LIS variants — any recurrence with overlapping subproblems.",
  "tradeoffs": "Trades O(number of distinct states) memory for a large time reduction; keeps code close to the recurrence; still uses O(depth) recursion stack.",
  "commonMistakes": "Caching a function whose effects must repeat or whose inputs/state change; using unhashable arguments such as lists; expecting bounded-cache eviction to preserve the unbounded-cache cost.",
  "edgeCases": "Base cases must still be present and correct. Unbounded caches grow with distinct inputs; use maxsize or clear the cache if memory matters. Integer n must be non-negative. @lru_cache normally defaults to 128 entries, but maxsize=None here disables eviction. cache_clear() resets both stored results and hit/miss statistics."
},

  complexity: [
  {
    "operation": "memoized Fibonacci",
    "best": "O(1)",
    "average": "O(n)",
    "worst": "O(n)",
    "space": "O(n)",
    "note": "Cold request: O(n) scalar work under expected hashing. Warm hit/base case: expected O(1). Cache and stack use O(n) scalar slots."
  },
  {
    "operation": "naive Fibonacci (contrast)",
    "best": "O(2ⁿ)",
    "average": "O(2ⁿ)",
    "worst": "O(2ⁿ)",
    "space": "O(n)",
    "note": "No cache: exponential repeated work."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the Fibonacci index requested (number of distinct subproblems)"
    }
  ],
  "costModel": "Starting from an empty unbounded cache, each index 0..n has one cache miss. Dict lookup is expected O(1) with ordinary hashes; insertion is amortized expected O(1). Count scalar additions as constant; cache-wrapper calls and stack storage are included.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "A cold fib(n) for n≥2 has n+1 distinct misses, n−1 scalar additions and O(n) wrapper requests. It is O(n) under ordinary expected hashing. A warm repeated fib(n) is an expected O(1) hit. Request order and eviction policy matter; this code uses maxsize=None.",
    "otherCases": [
      {
        "case": "best",
        "bound": "O(1)",
        "note": "Already cached argument (expected lookup cost), or a base case."
      }
    ]
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The cache stores one entry per distinct argument: O(n) entries. The recursion stack is also at most O(n) deep on the first descent. Both are O(n).",
    "inputOutputNote": "The O(n) bound counts cached cells and stack frames. F(0)..F(n) occupy Θ(n²) integer bits; arithmetic on those growing integers is outside the unit-cost model."
  },
  "derivation": [
    {
      "lines": [
        8,
        9
      ],
      "description": "Base cases evaluated a constant number of times.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        10
      ],
      "description": "The recursive body runs once per distinct n (n times); repeats are O(1) cache hits.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        4
      ],
      "description": "The cache holds one result per distinct subproblem.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "fib is a pure function of n, so cached results stay valid.",
    "n is hashable (an int), usable as a cache key.",
    "The cache is unbounded (maxsize=None), so no entries are evicted mid-computation.",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "Memoization keeps the top-down recurrence but adds O(n) cache memory and an O(n) recursion stack. Tabulation (next lesson) computes bottom-up, avoiding recursion depth and sometimes reducing memory further.",
  "counters": [
    {
      "label": "non-base bodies",
      "definition": "Entries at the two-child return: one per non-base index on a cold run. Recorded line entries at 10 occur before the operation completes.",
      "countLines": [
        10
      ]
    },
    {
      "label": "base-case evaluations",
      "definition": "executions of the base-case return Recorded line entries at 9 occur before the operation completes.",
      "countLines": [
        9
      ]
    }
  ],
  "fixedDataNote": "A fresh cache for fib(10) has exactly 11 misses (indices 0..10), 8 hits, 9 additions and 11 cached entries. Repeating fib(10) adds one hit. Named-function costs exclude import and printing."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": true,
    "explanation": "Import lru_cache, which adds an automatic argument-keyed cache."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 3,
    "executable": false,
    "explanation": "Comment: memoization = recursion + cache."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Decorate fib so its results are cached by n (unbounded cache)."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Define fib(n)."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Validate the Fibonacci index on a cache miss."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Reject negative indices."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Base cases: fib(0)=0, fib(1)=1."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Return n directly for the base cases."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Recursive case; each distinct n runs this once, then it's cached."
  },
  {
    "line": 11,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Print fib(10) = 55, computed in O(n)."
  }
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
    "id": "dpmemo-complete-1",
    "kind": "complete-code",
    "prompt": "Add memoization to this recurrence using a dictionary (no decorator). Use a non-negative integer n.",
    "starterCode": "memo = {}\ndef fib(n):\n    if n < 2:\n        return n\n    # TODO: use memo to avoid recomputation\n    return fib(n - 1) + fib(n - 2)",
    "expected": "memo = {}\ndef fib(n):\n    if n < 2:\n        return n\n    if n in memo:\n        return memo[n]\n    memo[n] = fib(n - 1) + fib(n - 2)\n    return memo[n]",
    "hints": [
      "Goal: add dictionary memoization to the Fibonacci recurrence (no decorator).",
      "The plain recurrence recomputes the same fib(k) exponentially; caching each result removes that repetition.",
      "Key insight: each subproblem needs computing only once, so check the cache before recomputing.",
      "Approach: keep a memo dict, return the cached value on a hit, and store before returning on a miss.",
      "Pseudocode: if n<2 return n; if n in memo return memo[n]; memo[n]=fib(n-1)+fib(n-2); return memo[n].",
      "Add `if n in memo: return memo[n]` and store `memo[n] = fib(n-1) + fib(n-2)` before returning it."
    ],
    "tests": "assert fib(0) == 0\nassert fib(1) == 1\nassert fib(10) == 55, 'fib(10) == 55'\nassert fib(20) == 6765, 'fib(20) via memo'\n# The memo dict must have been populated (proves caching happened, not raw recursion).\nassert isinstance(memo, dict) and memo.get(10) == 55, f'memo should cache fib(10)=55, got {memo.get(10)}'\nprint('OK')"
  },
  {
    "id": "dpmemo-choose-1",
    "kind": "choose-approach",
    "prompt": "A recursive function recomputes the same subproblems but keeps side effects (it prints as it goes). Is naive memoization safe? What's the fix?",
    "expected": "Not safe as-is: caching would skip the side effects on repeat calls. Separate the pure computation (memoize that) from the side effects, or remove the side effects before caching.",
    "hints": [
      "Goal: decide whether naive memoization is safe for a function that prints as it runs.",
      "The repeated subproblems tempt you to cache, but the per-call prints are work that caching would skip.",
      "Key insight: memoization assumes purity, so on a cache hit the side effects (prints) never execute.",
      "Approach: separate the pure computation from the side effects and memoize only the pure part.",
      "Pseudocode: extract a pure helper that computes the value; cache that; keep the printing outside the cache.",
      "So it is not safe as-is: isolate the pure computation and cache only that, or drop the side effects before caching."
    ],
    "recognition": {
      "scenario": "A recursive function recomputes the same subproblems but keeps side effects (it prints as it goes). Is naive memoization safe? What's the fix?",
      "approaches": [
        {
          "id": "separate-pure",
          "label": "Separate the pure computation from the side effects, then memoize the pure part",
          "requiredReasonIds": [
            "cache-skips-effects"
          ]
        },
        {
          "id": "memoize-asis",
          "label": "Memoize the function as-is",
          "requiredReasonIds": [],
          "rejectionFeedback": "Caching returns the stored value on repeat calls and skips the side effects (the prints), changing observable behavior."
        }
      ],
      "reasons": [
        {
          "id": "cache-skips-effects",
          "text": "A cache short-circuits repeat calls, so the side effects fire only the first time; isolate the pure computation and memoize that, or remove the effects before caching."
        },
        {
          "id": "no-overlap",
          "text": "There are no overlapping subproblems, so memoization does nothing at all.",
          "contradictory": true
        },
        {
          "id": "effects-are-pure",
          "text": "Printing is a pure operation, so caching cannot change behavior.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "separate-pure"
      ],
      "modelExplanation": "Not safe as-is: caching skips the side effects on repeat calls. Separate the pure computation (memoize that) from the side effects, or remove the effects before caching."
    }
  },
  {
    "id": "dpmemo-predict-1",
    "kind": "predict-state",
    "prompt": "Starting with an empty @lru_cache(maxsize=None), how often does the body run for fib(10), and what happens on a second request?",
    "expected": "Exactly 11 body evaluations/cache misses, one per index 0..10; there are 8 cache hits during the first request. The second fib(10) is a cache hit with no body execution.",
    "hints": [
      "Count distinct integer arguments: 0 through 10.",
      "The decorator caches base cases as well as recursive cases.",
      "Eleven misses and eight hits on the first cold request; the repeated goal request adds a hit."
    ]
  }
],

  review: "Memoization caches results for fully specified states with stable answers. With an empty unbounded @lru_cache, fib(10) has eleven misses, eight hits and nine additions. Cached hits skip the body, so required side effects must be handled separately. Hashability differs from immutability. Fibonacci uses O(n) scalar cells/frames and expected O(n) scalar work; integer bits grow separately.",

  expectedOutput: "55\n",

  references: [
  {
    "url": "https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex",
    "title": "Python 3.14 numeric types",
    "section": "Numeric Types — int, float, complex",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage."
    ],
    "conventions": [
      "Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/9eb3e9a51a7b5b60b0f67c2277f8b0ee_MIT6_006S20_lec15.pdf",
    "title": "MIT 6.006 lecture 15: dynamic programming",
    "section": "SRTBOT; Fibonacci; memoization and bottom-up evaluation",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "A complete state, acyclic dependency order, base cases and correct recurrence justify DP; runtime counts states and nonrecursive transition work.",
      "Both memoization and tabulation are dynamic programming; Fibonacci is linear in scalar additions but big-integer additions grow with the index."
    ],
    "conventions": [
      "F(0)=0, F(1)=1. Displayed functions exclude demo literal construction and printing."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://docs.python.org/3.14/library/functools.html#functools.lru_cache",
    "title": "Python 3.14 functools",
    "section": "lru_cache and cache: maxsize, hashable arguments, cache_info, cache_clear, retained references",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "maxsize=None disables eviction; cached arguments must be hashable; caching skips repeat body execution and retains arguments/results."
    ],
    "conventions": [],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://docs.python.org/3.14/glossary.html#term-hashable",
    "title": "Python 3.14 glossary",
    "section": "hashable",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Hashability requires a stable hash and matching equality; tuples require hashable contents."
    ],
    "conventions": [],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "b1957733e9da47dd",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
