/**
 * Lesson: Recursion — base cases (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "120\n". Uses the recursion visualizer to show the
 * call stack growing to the base case and unwinding.
 */

import type { LessonDefinition } from "../../core/types";

const code = `# factorial(n) = n * (n-1) * ... * 1, with factorial(0) = factorial(1) = 1.
def fact(n):
    if n < 0:
        raise ValueError("n must be non-negative")
    if n <= 1:            # BASE CASE: smallest input we answer directly
        return 1
    return n * fact(n - 1)  # RECURSIVE CASE: shrink toward the base case

print(fact(5))`;

export const dpBaseCases: LessonDefinition = {
  id: "dp-base-cases",
  title: "Recursion: Base Cases",
  area: "DP and recursion",
  prerequisites: [
  "functions",
  "conditions",
  "errors"
],

  explanation: "A recursive function calls itself while making progress toward a base case it can answer directly. Progress must be well-founded: it may shrink an integer, shorten a remaining suffix, or finish another position. A base case alone is insufficient if the recursive step never reaches it. Python limits call depth; a nonterminating recurrence usually raises `RecursionError`, and even a valid but deep recurrence can exceed that limit.\n\nFor non-negative integer n, factorial is n·(n−1)·…·1, with 0! = 1. This code rejects negative n. `fact(5)` calls `fact(4)`, then 3, 2 and 1. There are **5 calls total**, including the initial call, and **4 recursive child calls**. Five factorial frames are active at maximum depth. The returns are 1, 2, 6, 24 and 120. For n≥1 there are n total calls; n=0 makes one call. An iterative factorial avoids the linear call stack.",

  vocabulary: [
  {
    "term": "Recursion",
    "definition": "Calling the same function again with a state that progresses toward a terminating case."
  },
  {
    "term": "Base case",
    "definition": "The smallest input answered directly, with no further recursion; it stops the process."
  },
  {
    "term": "Recursive case",
    "definition": "A step that solves the problem using recursive calls whose states make well-founded progress."
  },
  {
    "term": "Call stack",
    "definition": "The stack of in-progress function calls; each recursive call adds a frame."
  },
  {
    "term": "Unwinding",
    "definition": "Returning back up the chain of calls once the base case is reached."
  },
  {
    "term": "RecursionError",
    "definition": "An error raised when interpreter recursion depth exceeds its limit; this can happen with missing progress or a valid very deep recursion."
  }
],

  concepts: {
  "purpose": "Establish the stopping condition that makes recursion finite and correct — the foundation for every recursive and dynamic-programming algorithm.",
  "operations": "Check the input domain, answer a base case directly, otherwise multiply n by the factorial of n−1.",
  "uses": "Factorials, sums, tree/graph traversal, divide-and-conquer, backtracking, and the recursive definitions DP later memoizes.",
  "tradeoffs": "Recursion exposes the recurrence but keeps O(n) active frames and can exceed Python's recursion limit.",
  "commonMistakes": "Missing or unreachable base case (infinite recursion); recursing on an input that doesn't shrink; putting the recursive call before the base-case check.",
  "edgeCases": "n=0 and n=1 return 1 immediately; negative n raises ValueError. Without the new guard, the old n<=1 test would have returned 1 for negatives, not recursed forever."
},

  complexity: [
  {
    "operation": "factorial (recursive)",
    "best": "O(n)",
    "average": "O(n)",
    "worst": "O(n)",
    "space": "O(n)",
    "note": "For n≥1 there are n calls and n−1 scalar multiplications; n=0 costs O(1). Integer bit costs are excluded."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the input to factorial"
    }
  ],
  "costModel": "Each call does O(1) work (a comparison and a multiplication) plus one recursive call. Treat one multiplication as constant (ignoring big-integer growth).",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "For n≥1 the chain ends at fact(1): n calls, with n−1 multiplications. For n=0 there is one direct call. Counting scalar multiplication as one operation gives O(n) growth."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "For n≥1, n factorial frames are live on the deepest descent; n=0 uses one frame. Each frame retains O(1) scalar values under this model.",
    "inputOutputNote": "O(n) counts active frames, not bytes. n! needs Θ(n log n) output bits for growing n; arithmetic and retained integer bit lengths require a separate analysis."
  },
  "derivation": [
    {
      "lines": [
        5,
        6
      ],
      "description": "The base-case test runs on every call; the direct base return is reached once.",
      "cost": "O(n) checks, O(1) return",
      "dimension": "time"
    },
    {
      "lines": [
        7
      ],
      "description": "Recursive case runs for n, n-1, …, 2 — that is n-1 recursive calls, each O(1).",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        2,
        5,
        6,
        7
      ],
      "description": "At most max(1,n) factorial frames are active; the initial call is counted once.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "A single multiplication is treated as O(1) (ignoring arbitrary-precision integer growth).",
    "n is a non-negative integer, so the base case is reachable.",
    "Python's default recursion limit is not exceeded for this small n.",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "Iteration avoids recursive frames, keeping a constant number of integer variables. The growing factorial result still occupies Θ(n log n) bits.",
  "counters": [
    {
      "label": "recursive calls",
      "definition": "executions of the recursive-case line Recorded line entries at 7 occur before the operation completes.",
      "countLines": [
        7
      ]
    },
    {
      "label": "base-case hits",
      "definition": "executions of the base-case return Recorded line entries at 6 occur before the operation completes.",
      "countLines": [
        6
      ]
    }
  ],
  "fixedDataNote": "fact(5) makes 5 calls total, 4 child calls and reaches depth 5; it returns 120. The named function excludes printing and tracer state."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment defining factorial and its base value."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define fact(n)."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Reject a negative factorial argument before applying the recurrence."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Raise ValueError: factorial is defined here only for non-negative integers."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Base case: if n is 0 or 1, we can answer directly."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Return 1 without recursing — this stops the recursion."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Recursive case: multiply n by factorial of the smaller input n-1."
  },
  {
    "line": 8,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Compute fact(5) = 120 and print it."
  }
],

  bindings: [{ variable: "n", model: "recursion" }],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "If the `n<=1` base-case return is removed but the negative-input guard remains, how does fact(5) stop?",
    "answer": "With the base-case return removed, valid n keeps decreasing until the negative-input guard raises ValueError. If both the guard and base case are removed, calls continue until RecursionError.",
    "explanation": "Termination depends on all exits in the actual program. Python's recursion limit is a protection, not a mathematical base case."
  }
],

  experiments: [
    "Add a print at the start of fact to see the calls descend, then watch the returns ascend.",
    "Change the base case to `n <= 0` and observe how the call chain changes.",
    "Write factorial as a loop and compare its (constant) stack use to the recursive version.",
  ],

  exercises: [
  {
    "id": "dpbc-complete-1",
    "kind": "complete-code",
    "prompt": "Complete the recursive sum of 1..n with a correct base case. Assume n is a non-negative integer.",
    "starterCode": "def total(n):\n    # TODO: base case for n == 0\n    return n + total(n - 1)",
    "expected": "def total(n):\n    if n == 0:\n        return 0\n    return n + total(n - 1)",
    "hints": [
      "Goal: recursively sum 1..n, and here the base case is what stops the recursion at n == 0.",
      "Without a base case the calls recurse below zero forever; the base case is the fixed anchor of the recurrence.",
      "Key insight: the sum of no numbers is 0, so n == 0 should return 0.",
      "Approach: add a base case for the smallest input before the recursive n + total(n-1).",
      "Pseudocode: if n == 0 return 0; otherwise return n + total(n-1).",
      "Add `if n == 0: return 0` as the base case so the recursion terminates."
    ],
    "tests": "# 1+2+...+n with a base case at n == 0.\nassert total(0) == 0, 'base case: sum of nothing is 0'\nassert total(1) == 1\nassert total(5) == 15, '1+2+3+4+5 == 15'\nassert total(10) == 55\nprint('OK')"
  },
  {
    "id": "dpbc-fix-1",
    "kind": "fix-mistake",
    "prompt": "This recursion never terminates. Fix it so it computes factorial. Assume n is a non-negative integer.",
    "starterCode": "def fact(n):\n    return n * fact(n - 1)",
    "expected": "def fact(n):\n    if n <= 1:\n        return 1\n    return n * fact(n - 1)",
    "hints": [
      "Goal: make factorial terminate by giving the recursion a stopping condition.",
      "The bug is a missing base case, so fact(n) recurses forever and never returns.",
      "Key insight: factorial of 0 or 1 is 1, which is the smallest input where recursion must stop.",
      "Approach: add a base case guarding the smallest input before the recursive multiply.",
      "Pseudocode: if n <= 1 return 1; otherwise return n * fact(n-1).",
      "Add `if n <= 1: return 1` so the recursion bottoms out and computes factorial."
    ],
    "tests": "assert fact(0) == 1, '0! == 1 (base case)'\nassert fact(1) == 1, '1! == 1'\nassert fact(5) == 120, '5! == 120'\nassert fact(6) == 720\n_orig = fact\n_calls = [0]\ndef fact(n):\n    _calls[0] += 1\n    return _orig(n)\nassert fact(3) == 6, '3! == 6'\n# fact(3) -> fact(2) -> fact(1) stops: exactly 3 calls. A base case of n<1 would\n# recurse once more (down to fact(0)) giving 4 calls.\nassert _calls[0] == 3, f'base case must stop at n<=1 (3 calls for fact(3)), got {_calls[0]}'\nprint('OK')"
  },
  {
    "id": "dpbc-predict-1",
    "kind": "predict-state",
    "prompt": "For fact(5), how many total calls happen and what is the maximum call-stack depth?",
    "expected": "5 calls (fact(5), fact(4), fact(3), fact(2), fact(1)), including the initial call once; maximum factorial-frame depth 5. There are 4 child calls.",
    "hints": [
      "List the arguments of the active calls: 5, 4, 3, 2, 1.",
      "The initial fact(5) is already in that list.",
      "Five calls total and depth five; four child calls."
    ]
  }
],

  review: "Recursion needs direct base answers and progress toward them. This factorial rejects negative indices and returns 1 for n=0 or 1. fact(5) has five total calls, four child calls and five simultaneous factorial frames. Time and frames grow O(n) under a scalar-multiplication model; integer bit costs are separate. Both infinite recursion and a valid very deep chain can exceed Python's recursion limit.",

  expectedOutput: "120\n",

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
    "url": "https://runestone.academy/ns/books/published/pythonds3/Recursion/TheThreeLawsofRecursion.html",
    "title": "Runestone: three laws of recursion",
    "section": "Base case, changing state, recursion",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "A terminating recursive solution needs a base case and progress toward it."
    ],
    "conventions": [],
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
  },
  {
    "url": "https://docs.python.org/3.14/library/sys.html#sys.getrecursionlimit",
    "title": "Python 3.14 recursion limit",
    "section": "sys.getrecursionlimit",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "The interpreter limits recursion depth to protect the C stack."
    ],
    "conventions": [],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "fd283b474bd68708",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
