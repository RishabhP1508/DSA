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
    if n < 0:
        raise ValueError("n must be non-negative")
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

  explanation: "**Tabulation** is **dynamic programming written bottom-up**. Instead of recursing from the goal down to the base cases (memoization), you **start from the base cases and fill a table forward**, computing small subproblems first so that every value a transition needs is **already in the table** when you reach it. There is no recursion and no cache lookup — just a loop over states in an order that respects their dependencies.\n\nFor Fibonacci: create `dp` where `dp[i]` will hold the i-th Fibonacci number, seed the base cases `dp[0] = 0` and `dp[1] = 1`, then sweep `i` from 2 upward with the **transition** `dp[i] = dp[i-1] + dp[i-2]`. Because `i-1` and `i-2` are smaller and were filled on earlier iterations, each step is a direct lookup — no recomputation. The answer is `dp[n]`. This is **O(n)** time and **O(n)** space, the same asymptotics as memoization but with **no recursion stack** (so no depth limit) and typically a smaller constant factor.\n\nTabulation vs memoization is a real design choice. **Memoization** is easy to write (decorate the recurrence) and only computes states you actually reach, but pays recursion overhead and stack depth. **Tabulation** avoids recursion and makes the fill order explicit, which is what enables **space optimization**: since Fibonacci's transition only looks back two cells, you can drop the whole array and keep just **two rolling variables**, reducing space to **O(1)**. The essential requirement for tabulation is a **valid ordering** of states — you must fill dependencies before dependents; getting that order wrong reads uninitialized cells. `fib(10)` tabulates to 55.\n\nModern usage calls both top-down memoization and bottom-up tabulation dynamic programming. The O(n) analysis counts scalar additions and stored cells. Python integers grow: the table's total integer-bit storage is Θ(n²), and its additions take O(n²) bit work in the usual linear-cost addition model. A rolling pair reduces cell count to O(1), but the pair still holds Θ(n) bits.",

  vocabulary: [
    { term: "Tabulation", definition: "Bottom-up DP: fill a table from base cases forward, no recursion." },
    { term: "DP table", definition: "An array/grid where each cell stores one subproblem's answer (here dp[i])." },
    { term: "Transition", definition: "The formula computing a state from already-filled smaller states." },
    { term: "Fill order", definition: "The sequence of states chosen so every dependency is ready before it's used." },
    { term: "Rolling variables", definition: "Keeping only the few recent cells a transition needs, reducing space." },
  ],

  concepts: {
  "purpose": "Compute DP answers iteratively from base cases upward, avoiding recursion overhead and enabling explicit space optimization.",
  "operations": "Initialize base cases in the table; loop states in dependency order applying the transition; read the answer from the goal cell.",
  "uses": "Fibonacci, climbing stairs, coin change, knapsack, edit distance, LCS — any recurrence with a clear fill order.",
  "tradeoffs": "No recursion stack (no depth limit) and often faster constants; but it always fills every state in range, even ones a top-down search might skip.",
  "commonMistakes": "Wrong fill order (reading not-yet-computed cells); off-by-one in table size or base-case indices; returning dp[n-1] instead of dp[n].",
  "edgeCases": "n=0 and n=1 return before table allocation; negative n raises ValueError. For n≥2, allocate n+1 cells and seed dp[1]."
},

  complexity: [
    { operation: "tabulated Fibonacci", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)", note: "One pass filling n cells; O(1) with rolling variables." },
  ],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the Fibonacci index requested (number of table cells)"
    }
  ],
  "costModel": "Filling one table cell is O(1) (an addition and two lookups). The loop fills each cell once.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The loop runs from 2 to n, filling one cell per iteration with a constant-time transition. So the total time is proportional to n — the same as memoization but without recursion or cache-lookup overhead."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The dp array holds n+1 cells. Because the transition only reads the two previous cells, this can be reduced to O(1) by keeping two rolling variables instead of the full array.",
    "inputOutputNote": "O(n) counts scalar cells, not bytes. Fibonacci entries have growing bit lengths: storing F(0)..F(n) uses Θ(n²) integer bits; a rolling pair has Θ(n) bits."
  },
  "derivation": [
    {
      "lines": [
        8,
        9
      ],
      "description": "Allocate the table and seed base cases — O(n) allocation, O(1) seeds.",
      "cost": "O(n)",
      "dimension": "space"
    },
    {
      "lines": [
        10,
        11
      ],
      "description": "Loop fills cells 2..n, one O(1) transition each.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        12
      ],
      "description": "Read the goal cell dp[n] — O(1).",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        8
      ],
      "description": "Allocating and zero-initializing n+1 list cells also costs O(n) time.",
      "cost": "O(n)",
      "dimension": "time"
    }
  ],
  "assumptions": [
    "The fill order (increasing i) computes every dependency before it's used.",
    "One addition is O(1) (ignoring big-integer growth).",
    "The table is sized n+1 to index dp[n].",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "Versus memoization: tabulation avoids the recursion stack and cache overhead and exposes the fill order for O(1) space optimization; but it fills all states in range, even ones a top-down search would skip. For dense DPs like Fibonacci, tabulation is usually the leaner choice.",
  "counters": [
    {
      "label": "cells filled",
      "definition": "executions of the transition line Recorded line entries at 11 occur before the operation completes.",
      "countLines": [
        11
      ]
    }
  ],
  "fixedDataNote": "fib(10) fills cells dp[2..10] (9 transitions) to reach 55. The O(n) bound describes how the fill scales with n. Function analysis excludes demonstration input literals, imports, printing and tracer storage. A line event shows the next operation before it completes."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: tabulation fills a table from base cases upward."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Comment continued: dependencies are ready before use."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Define fib(n)."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Validate the requested Fibonacci index."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Reject negative indices before allocation."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Handle the tiny base range n < 2 directly."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Return n for n = 0 or 1."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Allocate the DP table with n+1 cells."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Seed base cases: dp[0] stays 0, dp[1] = 1."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Fill states from 2 up to n in dependency order."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Transition: each cell is the sum of the two previous (already-filled) cells."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "The answer is the goal cell dp[n]."
  },
  {
    "line": 13,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Print fib(10) = 55."
  }
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
      prompt: "Complete `fib(n)` (bottom-up table): fib(0)=0, fib(1)=1, else sum of the two previous.",
      starterCode:
        "def fib(n):\n    if n == 0:\n        return 0\n    dp = [0] * (n + 1)\n    dp[1] = 1\n    for i in range(2, n + 1):\n        # TODO: fill dp[i] from smaller cells\n        pass\n    return dp[n]",
      expected:
        "def fib(n):\n    if n == 0:\n        return 0\n    dp = [0] * (n + 1)\n    dp[1] = 1\n    for i in range(2, n + 1):\n        dp[i] = dp[i - 1] + dp[i - 2]\n    return dp[n]",
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

  review: "Tabulation initializes bases and evaluates states in dependency order. Fibonacci writes dp[2] through dp[n], after allocation and seeding; fib(10) makes nine transitions and returns 55. It uses O(n) scalar work/cells without recursive frames. A rolling pair uses two scalar cells, whose Python integers still occupy Θ(n) bits.",

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
    "url": "https://runestone.academy/ns/books/published/pythonds3/Recursion/DynamicProgramming.html",
    "title": "Runestone: dynamic programming",
    "section": "Memoization and bottom-up discussion",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Stored results avoid repeated computation; tabulation evaluates dependencies before use."
    ],
    "conventions": [
      "Runestone uses a narrower terminology that excludes memoization; this app adopts MIT/Python terminology including both."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "be88413378e189b9",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
