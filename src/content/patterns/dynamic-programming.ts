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
    "Define reusable subproblem states and a correct recurrence; evaluate each needed state by memoization or tabulation.",

  clues: [
    "The problem asks for a COUNT, an OPTIMUM (min/max), or feasibility over sequences/grids/choices.",
    "A recursive formulation revisits the SAME subproblems many times (overlapping subproblems).",
    "The optimal answer is built from optimal answers to smaller subproblems (optimal substructure).",
    "Phrases like 'number of ways', 'minimum/maximum cost', 'longest/shortest ...', 'can you reach/partition ...'.",
  ],

  naiveApproach: `Plain recursion re-derives identical subproblems exponentially often — e.g. naive Fibonacci is **O(2ⁿ)** because \`fib(k)\` is recomputed across many branches. Brute-forcing all choices (all subsets/paths) is similarly exponential.`,

  whyItHelps: "When a correct recurrence revisits the same fully specified states, reuse their answers. Top-down memoization computes states on demand; bottom-up tabulation follows a dependency order. The cost is the number of evaluated states plus all their transition work, often written states × work per state. Fibonacci has O(n) states and O(1) scalar work per state, so it becomes O(n). Other DPs may have exponential state sets or pseudo-polynomial numeric ranges: caching alone does not promise polynomial time. Optimal substructure is the optimization-specific form of a valid recurrence; counting and feasibility use their own sum/OR recurrences.",

  conditions: [
  "A state contains every fact needed to determine its answer; repeating the same state must have the same result.",
  "Use a correct recurrence and terminating/acyclic dependency order. For optimization, subproblem optima must compose correctly; counting/feasibility combine their appropriate answers.",
  "Memo keys are hashable and stable for the computation. Hashable and immutable are different properties; mutable dependencies can invalidate a cache."
],

  alternatives: [
    "Greedy — when a locally optimal choice is provably globally optimal (no need to explore all subproblems).",
    "Backtracking — when you must ENUMERATE all configurations, not just count or optimize.",
    "Divide and conquer — when subproblems are INDEPENDENT (don't overlap), like merge sort.",
  ],

  counterexamples: [
  "If subproblems don't overlap (independent halves), plain divide and conquer is enough — memoization buys nothing.",
  "If a greedy choice is provably optimal (e.g. activity selection), DP is unnecessary overhead.",
  "Caching skips repeat body execution, so side effects or fresh mutable return-object requirements can change behavior. Isolate pure computation and preserve any required effects separately."
],

  walkthroughCode,
  walkthroughExpectedOutput: "55\n",
  complexityNote:
    "Fibonacci walkthrough: O(n) scalar time under expected hashing and O(n) cached cells/frames; n−1 non-base states cached, bases return directly. Generic DP cost depends on states and transition work.",

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the Fibonacci index requested"
    }
  ],
  "costModel": "For n≥2, non-base indices 2..n are written to memo once each. Base cases 0 and 1 return directly without being cached, so they can be called more than once, a constant total here. Dict costs are expected with ordinary hashes; additions are scalar operations.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "Non-base states 2..n are solved once; repeated requests reuse memo. This code leaves bases uncached: at n≥2, fib(1) returns twice and fib(0) once. Total helper calls are 2n−1, so expected-hashing scalar time is O(n), including the constant repeated base work."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The memo holds up to n entries, and the recursion stack is up to n deep on the first descent.",
    "inputOutputNote": "The memo and stack use O(n) scalar entries/frames. Fibonacci result integers stored over the index range occupy Θ(n²) bits; scalar-cell counts exclude these bit costs."
  },
  "derivation": [
    {
      "lines": [
        8,
        9
      ],
      "description": "Cache hit returns a solved subproblem in O(1).",
      "cost": "O(1) per hit",
      "dimension": "time"
    },
    {
      "lines": [
        10
      ],
      "description": "Solve and store each of the n−1 non-base states once; base cases remain uncached.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        4,
        5
      ],
      "description": "Memo dict (<= n entries) + recursion depth (<= n).",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "dict lookup/insert are amortised O(1).",
    "Combining subproblems (an addition) is O(1) here (Fibonacci grows, but treated as O(1) machine arithmetic for the model).",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "Bottom-up tabulation computes the same O(n) with an explicit array and O(1) recursion depth; a rolling two-variable version is O(1) space. Naive recursion without a memo is O(2ⁿ).",
  "counters": [
    {
      "label": "states computed",
      "definition": "executions of the memo write Recorded line entries at 10 occur before the operation completes.",
      "countLines": [
        10
      ]
    }
  ],
  "fixedDataNote": "fib(10) makes 19 helper calls and writes nine non-base memo entries. Its bases return three times in total. Naive fib(10) would make exactly 177 calls (=2F(11)−1). Function analysis excludes printing."
},

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: reuse overlapping non-base subproblem results; this specific code leaves the direct base returns uncached."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Comment: memoized Fibonacci."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Define fib(n)."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "The cache mapping a subproblem k to its answer."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Inner recursive solver for subproblem k."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Base cases: fib(0)=0, fib(1)=1."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Return k directly for the base cases."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "If this subproblem is cached..."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "...reuse it instead of recomputing."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Otherwise compute from the two smaller subproblems and store it."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Return the freshly computed value."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Kick off the recursion at n."
  },
  {
    "line": 13,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "fib(10) = 55 in O(n) thanks to memoization."
  }
],

  bindings: [{ variable: "memo", model: "dict" }],

  linkedLessons: ["dp-memoization", "dp-tabulation", "dp-state-transitions", "dp-1d-2d"],

  exercises: [
  {
    "id": "pat-dp-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'Count the number of distinct ways to climb n stairs taking 1 or 2 steps.' Which pattern, and what's the state?",
    "expected": "Dynamic programming: state = ways to reach step k; transition ways(k) = ways(k-1) + ways(k-2) (overlapping subproblems). Memoize or tabulate for O(n) instead of exponential recursion.",
    "correctPatternId": "dynamic-programming",
    "hints": [
      "Goal: count distinct ways to climb n stairs taking 1 or 2 steps at a time.",
      "Naive recursion recomputes the same step counts exponentially across branches.",
      "Key insight: ways(k) = ways(k-1) + ways(k-2), so subproblems overlap and can be reused.",
      "Approach: use dynamic programming — define the state and memoize or tabulate.",
      "Pseudocode: ways(0)=ways(1)=1; for k up to n: ways(k)=ways(k-1)+ways(k-2); return ways(n).",
      "Use DP: state = ways to reach step k, transition ways(k)=ways(k-1)+ways(k-2), memoized or tabulated for O(n)."
    ],
    "recognition": {
      "scenario": "Count the number of distinct ways to climb n stairs taking 1 or 2 steps.",
      "approaches": [
        {
          "id": "dp",
          "label": "Dynamic programming",
          "requiredReasonIds": [
            "overlapping-subproblems"
          ]
        },
        {
          "id": "backtracking",
          "label": "Backtracking (enumerate every path)",
          "requiredReasonIds": [],
          "rejectionFeedback": "Enumerating every climb path is exponential; only a count is asked, and the subproblems overlap, so DP collapses it to O(n)."
        }
      ],
      "reasons": [
        {
          "id": "overlapping-subproblems",
          "text": "ways(k) = ways(k−1) + ways(k−2): the same subproblems recur, so memoize or tabulate for O(n) instead of exponential recursion."
        },
        {
          "id": "must-list-paths",
          "text": "You must produce every explicit sequence of steps, so enumeration is required.",
          "contradictory": true
        },
        {
          "id": "greedy-optimal",
          "text": "A greedy choice at each stair gives the count directly.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "dp"
      ],
      "modelExplanation": "Dynamic programming: ways(k) = ways(k−1) + ways(k−2) has overlapping subproblems, so memoization/tabulation gives O(n) instead of exponential recursion."
    }
  },
  {
    "id": "pat-dp-choose-1",
    "kind": "choose-approach",
    "prompt": "You must LIST every subset that sums to a target (not just count them). DP or backtracking? Each array position may be used once; duplicate values refer to distinct positions.",
    "expected": "Backtracking directly lists the configurations. DP feasibility/count results alone do not emit them, but an augmented DP table can guide reconstruction/enumeration. Listing every answer still pays for the output. To support zero or negative values without losing subsets, finish the finite include/exclude decisions and record at a leaf whose sum equals the target.",
    "correctPatternId": "backtracking",
    "hints": [
      "The requested output is every subset, not only the number of subsets.",
      "Duplicate values represent different positions; each position has a finite include/exclude decision.",
      "A DP count alone does not emit configurations. A DP table can guide reconstruction, but cannot remove output work.",
      "Use backtracking to traverse the configurations; finish all position decisions before testing a leaf when zero or negative values are allowed.",
      "Pseudocode: at position i, explore excluding it and including it; restore the path afterward. At i == len(values), emit a copy only if the sum equals the target. Do not return early merely because a partial sum equals the target."
    ],
    "recognition": {
      "scenario": "You must LIST every subset that sums to a target (not just count them).",
      "approaches": [
        {
          "id": "backtracking",
          "label": "Backtracking",
          "requiredReasonIds": [
            "enumerate-explicit"
          ]
        },
        {
          "id": "dp",
          "label": "DP counts alone",
          "requiredReasonIds": [],
          "rejectionFeedback": "A scalar count alone does not return the subsets. DP augmented with a traversal can guide enumeration, but emitting the configurations remains necessary."
        }
      ],
      "reasons": [
        {
          "id": "enumerate-explicit",
          "text": "Listing every subset means producing each explicit configuration, so you must enumerate via choose/explore/un-choose."
        },
        {
          "id": "count-suffices",
          "text": "Only the number of subsets is needed, so overlapping subproblems make DP ideal.",
          "contradictory": true
        },
        {
          "id": "greedy-lists",
          "text": "A greedy scan can list all qualifying subsets directly.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "backtracking"
      ],
      "modelExplanation": "Backtracking directly lists the configurations. DP feasibility/count results alone do not emit them, but an augmented DP table can guide reconstruction/enumeration. Listing every answer still pays for the output. To support zero or negative values without losing subsets, finish the finite include/exclude decisions and record at a leaf whose sum equals the target."
    }
  },
  {
    "id": "pat-dp-fix-1",
    "kind": "fix-mistake",
    "prompt": "This recursion is exponential because it never caches. Add memoization.",
    "starterCode": "def fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)",
    "expected": "from functools import lru_cache\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)",
    "hints": [
      "Goal: make the exponential Fibonacci recursion efficient by caching results.",
      "The bug recomputes the same subproblems across branches, giving O(2^n) work.",
      "Key insight: each argument's result needs computing only once, so cache it by argument.",
      "Approach: add memoization, e.g. an lru_cache decorator, so repeat calls return instantly.",
      "Pseudocode: decorate fib with a cache; on a repeat argument return the stored result instead of recursing.",
      "Add `@lru_cache(maxsize=None)` above fib to cache by argument, turning O(2^n) into O(n)."
    ],
    "tests": "assert fib(0) == 0 and fib(1) == 1, 'base cases'\nassert fib(10) == 55, 'fib(10) == 55'\nassert fib(20) == 6765, 'fib(20) == 6765'\n# Memoization must make a large index return quickly (no exponential blow-up).\nassert fib(60) == 1548008755920, 'memoized fib(60) is exact and fast'\nprint('OK')"
  }
],

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
    "url": "https://docs.python.org/3.14/glossary.html#term-hashable",
    "title": "Python 3.14 glossary",
    "section": "hashable",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Hashability means stable hash and compatible equality, not merely immutability."
    ],
    "conventions": [],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://runestone.academy/ns/books/published/pythonds3/Recursion/DynamicProgramming.html",
    "title": "Runestone: dynamic programming",
    "section": "Memoization, tabulation and reconstruction",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Reuse stored answers and compute dependencies before dependents."
    ],
    "conventions": [
      "The app adopts the broader MIT/Python convention including top-down memoization as DP."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "ae97e8b93df9e0a3",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
