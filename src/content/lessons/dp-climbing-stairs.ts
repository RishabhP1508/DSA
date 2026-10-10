/**
 * Lesson: DP worked example — climbing stairs (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "8\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Climbing stairs: each move is 1 or 2 steps. How many ways to reach step n?
# ways(n) = ways(n-1) + ways(n-2)  -- it's Fibonacci in disguise.
def climb(n):
    if n < 0:
        raise ValueError("n must be non-negative")
    a, b = 1, 1        # ways(0) = 1 (do nothing), ways(1) = 1
    for _ in range(n):
        a, b = b, a + b  # roll forward: keep only the last two counts
    return a

print(climb(5))   # 8 ways to climb 5 stairs`;

export const dpClimbingStairs: LessonDefinition = {
  id: "dp-climbing-stairs",
  title: "DP Example: Climbing Stairs",
  area: "DP and recursion",
  prerequisites: ["dp-tabulation", "dp-state-transitions"],

  explanation: `**Climbing stairs** is the friendliest first DP: you climb a staircase of \`n\` steps, moving **1 or 2 steps** at a time, and count the **distinct ways** to reach the top. The insight that turns it into DP: to land on step \`n\`, your **last move** was either a **1-step** from step \`n−1\` or a **2-step** from step \`n−2\`. Those are the only two possibilities and they don't overlap, so \`ways(n) = ways(n−1) + ways(n−2)\` — the **Fibonacci recurrence**.

The **base cases** are \`ways(0) = 1\` (one way to "climb" zero steps: do nothing) and \`ways(1) = 1\` (a single 1-step). From there the counts are 1, 1, 2, 3, 5, 8, … — Fibonacci. A naive recursion would recompute subproblems exponentially (the recursive-calls lesson showed why), so we go **bottom-up**. And because each value depends only on the **previous two**, we don't even need a table: two rolling variables \`a, b\` suffice, updated with the simultaneous assignment \`a, b = b, a + b\`. That gives **O(n)** time and **O(1)** space. For \`n = 5\` there are **8** ways.

The point of this worked example is to see the full DP pipeline on something intuitive: **recognize the recurrence** (last move splits into two cases), **identify base cases**, **choose bottom-up with rolling state** for efficiency, and **verify** against small hand-counts (n=2 → 2 ways: 1+1 or 2; n=3 → 3 ways). This exact "count the ways, split by the last choice" pattern reappears in coin change, tiling problems, and decode-ways — recognizing it saves you from reinventing the recurrence each time.`,

  vocabulary: [
    { term: "Ways count", definition: "The number of distinct sequences of moves that reach the target." },
    { term: "Last-move split", definition: "Deriving the recurrence by casing on the final step (here, 1 or 2)." },
    { term: "Fibonacci recurrence", definition: "f(n) = f(n-1) + f(n-2); climbing stairs matches it." },
    { term: "Rolling variables", definition: "Two values a, b replacing the full DP table since only the last two counts matter." },
    { term: "Simultaneous assignment", definition: "a, b = b, a + b updates both from their old values at once." },
  ],

  concepts: {
  "purpose": "Introduce the complete DP workflow on an intuitive counting problem and reveal the reusable 'last-move split' recurrence.",
  "operations": "Seed base cases; iterate n times updating two rolling counts; return the count for step n.",
  "uses": "Counting move sequences, tiling a 2×n board, decode-ways, and any 'reach n by steps of size s' counting problem.",
  "tradeoffs": "A linear loop keeps two scalar cells; a full table retains every intermediate count. Python integer bit storage still grows.",
  "commonMistakes": "Wrong base cases (ways(0) must be 1); computing values top-down without memoization (exponential); off-by-one in the loop count.",
  "edgeCases": "n=0 returns 1 for the one empty sequence of moves; n=1 returns 1. Negative n raises ValueError. This example allows exactly 1-step and 2-step moves."
},

  complexity: [
    { operation: "climbing stairs (rolling DP)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "One pass; two rolling variables." },
  ],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of stairs to climb"
    }
  ],
  "costModel": "Each loop iteration does O(1) work (one addition and a paired assignment).",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The loop runs exactly n times, each doing constant work, so total time is proportional to n. This replaces the exponential naive recursion with a single linear pass."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Only two variables a and b are kept, no matter how large n is, because each count depends only on the previous two.",
    "inputOutputNote": "Two count variables give O(1) scalar slots, but their Fibonacci-sized values occupy Θ(n) bits. Python's additions have growing bit work; the scalar O(n) loop bound is not a byte/bit-cost bound."
  },
  "derivation": [
    {
      "lines": [
        6
      ],
      "description": "Seed the two base-case counts — O(1).",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        7,
        8
      ],
      "description": "Loop runs n times, one O(1) rolling update each.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        6
      ],
      "description": "Two rolling variables, independent of n.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Allowed moves are exactly 1 or 2 steps.",
    "ways(0) = 1 (the empty climb counts as one way).",
    "One addition is O(1) (ignoring big-integer growth).",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "Two rolling counts suffice for this recurrence; a full table is useful if every intermediate count is required. This O(n) iteration is an elementary solution, not a claim that no other algorithm exists.",
  "counters": [
    {
      "label": "rolling updates",
      "definition": "executions of the update line Recorded line entries at 8 occur before the operation completes.",
      "countLines": [
        8
      ]
    }
  ],
  "fixedDataNote": "climb(5) runs 5 iterations producing 8. The O(n) bound describes how the work scales with the number of stairs. Function analysis excludes demonstration input literals, imports, printing and tracer storage. A line event shows the next operation before it completes."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: moves of 1 or 2, count the ways."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Comment: the recurrence is Fibonacci."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Define climb(n)."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Check the non-negative number of stairs."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Reject a negative stair count."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Base cases as rolling state: ways(0)=1 and ways(1)=1."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Advance n times toward the top step."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Roll forward: new pair is (old b, old a + old b) — the next two counts."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "After n rolls, a holds ways(n)."
  },
  {
    "line": 10,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "climb(5) = 8."
  }
],

  bindings: [
  {
    "variable": "a",
    "model": "object"
  },
  {
    "variable": "b",
    "model": "object"
  }
],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "How do you derive ways(n) = ways(n-1) + ways(n-2) from the rules of the problem?",
      answer: "Your last move onto step n was either a 1-step (from step n-1) or a 2-step (from step n-2). These cases are exhaustive and disjoint, so the total ways is the sum of ways to reach n-1 and n-2.",
      explanation: "Casing on the final move — the 'last-move split' — is the standard way to derive counting recurrences, and here it yields Fibonacci.",
    },
  ],

  experiments: [
    "Print a, b each iteration to watch the Fibonacci sequence roll forward.",
    "Allow moves of 1, 2, or 3 steps and extend the recurrence to sum three previous counts.",
    "Compare climb(n) to a memoized recursive version and confirm they agree.",
  ],

  exercises: [
  {
    "id": "dpcs-complete-1",
    "kind": "complete-code",
    "prompt": "Complete the rolling update so climb counts the ways. Practice input contract: a non-negative integer stair count.",
    "starterCode": "def climb(n):\n    a, b = 1, 1\n    for _ in range(n):\n        # TODO: roll the two counts forward\n        pass\n    return a",
    "expected": "def climb(n):\n    a, b = 1, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a",
    "tests": "assert climb(0) == 1, 'n=0 -> 1'\nassert climb(1) == 1, 'n=1 -> 1'\nassert climb(2) == 2, 'n=2 -> 2'\nassert climb(3) == 3, 'n=3 -> 3'\nassert climb(5) == 8, 'n=5 -> 8'\nprint('OK')",
    "hints": [
      "Goal: count the ways to climb n stairs using a rolling two-variable update.",
      "Storing the full DP array is unnecessary; each step only needs the previous two counts.",
      "Key insight: ways(k) = ways(k-1) + ways(k-2), so two rolling variables suffice.",
      "Approach: keep a and b, and update them together each iteration with a tuple assignment.",
      "Pseudocode: a,b=1,1; repeat n times: a,b = b, a+b; return a.",
      "Write `a, b = b, a + b` to roll the pair forward each step."
    ]
  },
  {
    "id": "dpcs-predict-1",
    "kind": "predict-state",
    "prompt": "By hand, how many ways to climb 3 stairs, and does climb(3) agree?",
    "expected": "3 ways: (1,1,1), (1,2), (2,1). climb(3) returns 3.",
    "hints": [
      "List the move sequences.",
      "There are three.",
      "ways(3) = ways(2) + ways(1) = 2 + 1 = 3."
    ]
  },
  {
    "id": "dpcs-choose-1",
    "kind": "choose-approach",
    "prompt": "You must count ways to reach step n for very large n. Naive recursion, memoized recursion, or rolling-variable bottom-up — and why?",
    "expected": "Rolling-variable bottom-up: O(n) time, O(1) space, no recursion limit. Naive recursion is exponential; memoized recursion is O(n) time but uses O(n) cache and stack.",
    "hints": [
      "Goal: count ways to reach step n for very large n — naive recursion, memoized recursion, or rolling-variable bottom-up.",
      "The costly options are naive recursion (exponential) and even memoized recursion (O(n) cache and recursion-depth risk) for very large n.",
      "Key property: each answer depends only on the previous two, so you never need the full table or the call stack.",
      "Approach: iterate bottom-up keeping just two rolling variables.",
      "Reasoning: rolling variables give O(n) time and O(1) space with no recursion-limit risk; memoization is O(n) time but spends O(n) cache/stack, and naive recursion is exponential.",
      "Answer: rolling-variable bottom-up — O(n) time, O(1) space, no recursion limit; naive recursion is exponential and memoized recursion costs O(n) cache and stack."
    ],
    "recognition": {
      "scenario": "You must count the ways to reach step n for very large n and choose between naive recursion, memoized recursion, and a rolling bottom-up loop.",
      "approaches": [
        {
          "id": "rolling-bottom-up",
          "label": "Rolling-variable bottom-up iteration",
          "requiredReasonIds": [
            "rolling-o1-no-recursion"
          ]
        },
        {
          "id": "naive-recursion",
          "label": "Plain recursion with no caching",
          "requiredReasonIds": [],
          "rejectionFeedback": "Naive recursion recomputes overlapping subproblems and is exponential, so it is hopeless for very large n."
        },
        {
          "id": "memoized-recursion",
          "label": "Memoized recursion",
          "requiredReasonIds": [],
          "rejectionFeedback": "Memoized recursion is O(n) time but keeps an O(n) cache and O(n) call stack, risking a recursion-depth error for very large n."
        }
      ],
      "reasons": [
        {
          "id": "rolling-o1-no-recursion",
          "text": "Keeping only the last two counts gives O(n) time and O(1) space with no recursion, so very large n is safe from stack limits."
        },
        {
          "id": "naive-is-linear",
          "text": "Naive recursion already runs in O(n) time without caching.",
          "contradictory": true
        },
        {
          "id": "rolling-needs-on-space",
          "text": "The rolling bottom-up loop still needs an O(n) table and deep recursion.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "rolling-bottom-up"
      ],
      "modelExplanation": "Rolling-variable bottom-up: O(n) time, O(1) space, no recursion limit. Naive recursion is exponential; memoized recursion is O(n) time but uses O(n) cache and stack."
    }
  }
],

  review: "A final move of one or two steps gives the disjoint count recurrence ways(n)=ways(n−1)+ways(n−2). Base ways(0)=ways(1)=1; zero stairs has one empty climb. The shown n rolling updates return ways(n), with two scalar count variables and growing integer bits. Negative n is rejected; climb(5)=8.",

  expectedOutput: "8\n",

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
    "url": "https://leetcode.com/problems/climbing-stairs/description/",
    "title": "LeetCode: Climbing Stairs",
    "section": "Problem definition, examples and constraints",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Moves of size 1 or 2 give distinct ordered climbs."
    ],
    "conventions": [
      "Original n≥1; app extends zero stairs to one empty climb."
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
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "3bbd3beb135c5b15",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
