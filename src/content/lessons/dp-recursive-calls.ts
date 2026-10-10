/**
 * Lesson: Recursion — recursive calls & the call tree (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "8\n25\n". Shows the exponential call tree of naive
 * Fibonacci and motivates memoization.
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Naive Fibonacci: each NON-BASE call spawns TWO more calls (a branching call tree).
calls = 0
def fib(n):
    global calls
    if n < 0:
        raise ValueError("n must be non-negative")
    calls += 1            # count every call to expose the repeated work
    if n < 2:             # base cases: fib(0)=0, fib(1)=1
        return n
    return fib(n - 1) + fib(n - 2)  # TWO recursive calls

print(fib(6))    # the 6th Fibonacci number
print(calls)     # how many calls it took (lots of repeats!)`;

export const dpRecursiveCalls: LessonDefinition = {
  id: "dp-recursive-calls",
  title: "Recursion: Recursive Calls & the Call Tree",
  area: "DP and recursion",
  prerequisites: ["dp-base-cases"],

  explanation: "When a recursive case makes several child calls, its executions form a call tree. The tree shape depends on how each child state changes: two children do not automatically mean a 2^n bound. In naive Fibonacci, a non-base index n requests n−1 and n−2, with F(0)=0 and F(1)=1.\n\nThe exact call recurrence is T(0)=T(1)=1 and T(n)=1+T(n−1)+T(n−2). Thus T(n)=2F(n+1)−1 and grows Θ(φ^n), φ≈1.618. O(2^n) is a looser upper bound. Counts for n=6,7,8 are 25,41,67, approaching ratio φ rather than doubling. Reset the global counter before each independent measurement.\n\nThe trace actually shows repeated states: fib(6) requests fib(4) twice, fib(3) three times and fib(2) five times. Its result 8 takes 25 calls. These repeated equal arguments establish overlapping subproblems; a gap between an answer and a call count alone would not prove overlap. Memoization stores answers for the n+1 possible index states, reducing scalar work to O(n).\n\nTime counts all executed calls. Stack space counts only simultaneous frames: depth-first evaluation keeps one root-to-leaf path active, with maximum Fibonacci depth max(1,n). This code rejects negative indices. Growing Python integers and interpreter/tracer limits are separate from the unit-cost recurrence.",

  vocabulary: [
    { term: "Recursive call", definition: "A function invoking itself; multiple such calls per step create branching." },
    { term: "Call tree", definition: "The tree of all recursive calls made, with the initial call at the root." },
    { term: "Overlapping subproblems", definition: "The same smaller problem is solved many times across the tree — DP's opportunity." },
    { term: "Exponential time", definition: "Work that roughly multiplies with each added input unit, e.g. O(2ⁿ)." },
    { term: "Total calls (time)", definition: "How many calls happen overall — the time cost." },
    { term: "Active calls (stack depth)", definition: "How many calls are paused simultaneously — the space cost." },
  ],

  concepts: {
    purpose:
      "Understand how branching recursion produces a call tree, why it can be exponential, and how to distinguish total work from stack depth.",
    operations:
      "Each call checks the base case, then makes zero, one, or several recursive calls; the pattern of calls defines the tree.",
    uses:
      "Analyzing recursive algorithms, spotting overlapping subproblems that justify memoization/DP, reasoning about tree/graph recursion.",
    tradeoffs:
      "Branching recursion is simple to write but can be exponentially slow; the fix (memoization/tabulation) trades memory for time.",
    commonMistakes:
      "Equating total calls with stack depth; assuming two recursive calls always means O(2ⁿ) (it depends on how inputs shrink); forgetting the base case in a branching recursion.",
    edgeCases:
      "fib(0) and fib(1) are base cases returning immediately (1 call each). Small n already shows heavy repetition.",
  },

  complexity: [
  {
    "operation": "naive Fibonacci",
    "best": "O(φ^n)",
    "average": "O(φ^n)",
    "worst": "O(φ^n)",
    "space": "O(n)",
    "note": "Exact total calls: 2F(n+1)−1; scalar arithmetic model; depth max(1,n)."
  },
  {
    "operation": "memoized Fibonacci",
    "best": "O(n)",
    "average": "O(n)",
    "worst": "O(n)",
    "space": "O(n)",
    "note": "Cold unbounded memoization: n+1 states, O(n) scalar work and stored cells under ordinary expected hashing."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the Fibonacci index requested"
    }
  ],
  "costModel": "Count one call, scalar comparison, addition and counter update as constant work. A non-base call has children n−1 and n−2. The global call counter is instrumentation; integer bit costs are excluded.",
  "time": {
    "bound": "O(φ^n)",
    "case": "worst",
    "explanation": "Total calls equal 2F(n+1)−1, by T(0)=T(1)=1 and T(n)=1+T(n−1)+T(n−2). This is Θ(φ^n), with φ=(1+√5)/2; O(2^n) is a looser upper bound. Successive counts approach ratio φ, not 2. fib(6) makes 25 calls."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "Depth-first evaluation retains one path at a time. For n≥1 its longest path has n Fibonacci frames; n=0 has one. The total call tree has many more nodes than the live stack.",
    "inputOutputNote": "Only a single integer result is produced; the O(n) is the recursion stack, not tracer storage."
  },
  "derivation": [
    {
      "lines": [
        8,
        9
      ],
      "description": "Base-case checks/returns — reached at the leaves of the call tree.",
      "cost": "O(1) each",
      "dimension": "time"
    },
    {
      "lines": [
        10
      ],
      "description": "Two differently sized children give the Fibonacci call-count recurrence, not exact binary doubling.",
      "cost": "O(φ^n)",
      "dimension": "time"
    },
    {
      "lines": [
        3,
        10
      ],
      "description": "Depth-first exploration keeps at most n frames active.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Addition of the two results is O(1) (ignoring big-integer growth).",
    "n is a small non-negative integer so the trace stays under the event limit.",
    "No caching is used — this is deliberately the naive version.",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "Memoization or tabulation reduces time from O(2ⁿ) to O(n) by storing each subproblem's answer, at O(n) extra memory. This lesson shows the problem; the memoization lesson shows the fix.",
  "counters": [
    {
      "label": "total calls",
      "definition": "executions of the counter increment Recorded line entries at 7 occur before the operation completes.",
      "countLines": [
        7
      ]
    },
    {
      "label": "branching calls",
      "definition": "executions of the two-call recursive line Recorded line entries at 10 occur before the operation completes.",
      "countLines": [
        10
      ]
    }
  ],
  "fixedDataNote": "fib(6) returns 8 and increments calls 25 times: 2F(7)−1=25. Maximum Fibonacci depth is 6. Function analysis excludes the two print calls."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: non-base calls have two child calls; base cases have none."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "A global counter to expose the total number of calls."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Define fib(n)."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Declare calls as global so we can increment it."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Check the non-negative Fibonacci-index contract."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Reject negative indices; this lesson uses F(0)=0 and F(1)=1."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Count this call."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Base cases: fib(0)=0 and fib(1)=1."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Return n directly for the base cases."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Recursive case: sum of the two previous Fibonacci numbers (two calls)."
  },
  {
    "line": 11,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Print fib(6) = 8."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Print the call count = 25, revealing the repeated work."
  }
],

  bindings: [{ variable: "n", model: "recursion" }],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "The trace shows repeated fib(k) arguments while computing fib(6). What property is present, and how does memoization help?",
    "answer": "The repeated equal arguments are overlapping subproblems. With a correct state and recurrence, cache each Fibonacci result, giving O(n) scalar work for n+1 index states.",
    "explanation": "Repeated states, rather than the numeric size of the final answer, are the evidence that answers can be reused."
  }
],

  experiments: [
  "Reset calls to 0 before requesting fib(6), fib(7), fib(8); observe 25, 41, 67 and ratios approaching φ.",
  "Add a dictionary cache and re-count the calls to see the drop.",
  "Print n at the start of each call to see the same values recomputed."
],

  exercises: [
  {
    "id": "dprc-predict-1",
    "kind": "predict-state",
    "prompt": "The maximum call-stack depth for fib(6) — is it 25, 8, or 6? Explain.",
    "expected": "6 (about n). Depth-first exploration keeps only one root-to-leaf path active; total calls (25) is the time cost, not the stack depth.",
    "hints": [
      "Total calls ≠ stack depth.",
      "Only one branch is open at a time.",
      "The deepest path is fib(6)→fib(5)→…→fib(1)."
    ]
  },
  {
    "id": "dprc-choose-1",
    "kind": "choose-approach",
    "prompt": "You notice a recursive solution recomputes identical subproblems many times. Which technique should you reach for, and why?",
    "expected": "Memoization or bottom-up tabulation reuses answers to fully specified overlapping states. The cost is distinct states plus their transition work; for Fibonacci there are n+1 states and O(1) scalar work per state, giving O(n). Caching is not automatically linear for every recurrence.",
    "hints": [
      "Draw the calls for a small Fibonacci input. Which index is solved more than once?",
      "Repeated calls redo work even though the fully specified subproblem has the same answer.",
      "A reusable state must contain every input that affects its answer. Count distinct states and their transition work.",
      "Consider memoization or bottom-up tabulation to reuse overlapping answers; caching alone does not promise linear time.",
      "Memoization pseudocode: return a cached answer if present; otherwise solve dependencies, store the result, and return it. Fibonacci has n+1 states and constant scalar transition work per state."
    ],
    "recognition": {
      "scenario": "A recursive solution recomputes the same subproblems over and over, and you must speed it up.",
      "approaches": [
        {
          "id": "memoize",
          "label": "Memoize (cache) each subproblem's result",
          "requiredReasonIds": [
            "cache-overlapping"
          ]
        },
        {
          "id": "add-base-case",
          "label": "Just add another base case",
          "requiredReasonIds": [],
          "rejectionFeedback": "A base case establishes direct answers; merely adding one does not generally eliminate repeated work. A mathematically justified alternative recurrence could change the analysis."
        }
      ],
      "reasons": [
        {
          "id": "cache-overlapping",
          "text": "Fully specified overlapping states can be reused; total cost includes the nonrecursive work of each state. Fibonacci has O(n) states with O(1) scalar transitions."
        },
        {
          "id": "no-overlap-to-cache",
          "text": "The subproblems never repeat, so caching would never produce a hit.",
          "contradictory": true
        },
        {
          "id": "memo-slower",
          "text": "Memoization makes the recursion asymptotically slower.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "memoize"
      ],
      "modelExplanation": "Memoization or bottom-up tabulation reuses answers to fully specified overlapping states. The cost is distinct states plus their transition work; for Fibonacci there are n+1 states and O(1) scalar work per state, giving O(n). Caching is not automatically linear for every recurrence."
    }
  },
  {
    "id": "dprc-complete-1",
    "kind": "complete-code",
    "prompt": "Complete the branching recursive case for Fibonacci.",
    "starterCode": "def fib(n):\n    if n < 2:\n        return n\n    # TODO: two recursive calls summed\n    return 0",
    "expected": "def fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)",
    "hints": [
      "Goal: complete the recursive case for Fibonacci, which sums the two preceding values.",
      "This naive branching recomputes overlapping subproblems, but the task here is just the two-call recurrence.",
      "Key insight: fib(n) is defined as fib(n-1) + fib(n-2) once past the base case.",
      "Approach: make two recursive calls on n-1 and n-2 and add their results.",
      "Pseudocode: if n < 2 return n; otherwise return fib(n-1) + fib(n-2).",
      "Write `return fib(n - 1) + fib(n - 2)` as the recursive case."
    ],
    "tests": "assert fib(0) == 0\nassert fib(1) == 1\nassert fib(2) == 1, 'fib(2) == fib(1)+fib(0)'\nassert fib(10) == 55, 'fib(10) == 55'\nassert fib(7) == 13\nprint('OK')"
  }
],

  review: "Naive Fibonacci makes exactly 2F(n+1)−1 calls; fib(6) returns 8 with 25 calls and depth 6. Time grows Θ(φ^n), while the active stack grows O(n). Repeated equal arguments establish overlap, and caching them gives O(n) scalar work. Branch count alone does not establish an algorithm's growth rate.",

  expectedOutput: "8\n25\n",

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
    "url": "https://runestone.academy/ns/books/published/pythonds3/Recursion/StackFramesImplementingRecursion.html",
    "title": "Runestone: stack frames",
    "section": "Stack Frames: Implementing Recursion, Figure 4.6",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Each active recursive call retains its own parameters and local values until return."
    ],
    "conventions": [
      "The app shows actual traced frames; the source figure is a to_str example, not factorial. A source figure label differs from its n=5 card and is not copied."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "942ecb1a5bdd1406",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
