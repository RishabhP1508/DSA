/**
 * Lesson: DP — 0/1 knapsack (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "35\n". Uses the dp-table visualizer (item ×
 * capacity grid).
 */

import type { LessonDefinition } from "../../core/types";

const code = `# 0/1 knapsack: each item is taken WHOLE or not at all; maximize value
# without exceeding the capacity.
def knapsack(weights, values, cap):
    if cap < 0 or len(weights) != len(values) or any(w <= 0 for w in weights):
        raise ValueError("use positive weights, matched values, and non-negative capacity")
    n = len(weights)
    dp = [[0] * (cap + 1) for _ in range(n + 1)]  # dp[i][w] = best value with first i items, capacity w
    for i in range(1, n + 1):
        for w in range(cap + 1):
            dp[i][w] = dp[i - 1][w]               # option A: skip item i
            if weights[i - 1] <= w:               # option B: take it (if it fits)
                take = dp[i - 1][w - weights[i - 1]] + values[i - 1]
                if take > dp[i][w]:
                    dp[i][w] = take               # keep the better option
    return dp[n][cap]

print(knapsack([1, 3, 4], [15, 20, 30], 4))   # best value within capacity 4`;

export const dpKnapsack: LessonDefinition = {
  id: "dp-knapsack",
  title: "DP: 0/1 Knapsack",
  area: "DP and recursion",
  prerequisites: [
  "dp-1d-2d",
  "matrix-traversal"
],

  explanation: "The **0/1 knapsack** problem: given items each with a **weight** and a **value**, and a bag with a fixed **capacity**, choose a subset that **maximizes total value** without exceeding the capacity. \"0/1\" means each item is either taken **whole** or **left out** — no fractions, no partial items. A greedy \"best value-per-weight first\" rule can fail here (ratio-greedy has a guarantee for positive-weight divisible items), so this lesson uses an exact take/skip DP.\n\nThe natural full table has **two** state coordinates: `dp[i][w]` = the best value achievable using the **first i items** with total selected weight **at most w**. For each item i and capacity w there are two options: **skip** item i (value `dp[i-1][w]`), or, if it fits (`weights[i-1] <= w`), **take** it (value `dp[i-1][w - weights[i-1]] + values[i-1]` — its value plus the best for the remaining capacity using earlier items). The transition takes the **maximum** of these two. Row 0 (no items) is all zeros — the base case. The answer is `dp[n][cap]`. For weights `[1,3,4]`, values `[15,20,30]`, capacity 4, the best is taking items 1 and 2 (weight 1+3=4, value 15+20=**35**), which beats taking the single weight-4 item (value 30).\n\nThis is **O(n·cap)** time and space — it fills an (n+1)×(cap+1) table once. That is **pseudo-polynomial**: it's polynomial in the *numeric value* of the capacity, not in the number of bits used to write it, so a huge capacity is expensive even with few items. Because each row depends only on the **previous row**, space compresses to **O(cap)** (iterating w **downward** to avoid reusing an item). Knapsack is the template for many \"choose a subset under a budget\" problems.\n\n`dp[i][w]` is the best total value from the first i items using total weight **at most w**, not a requirement to fill exactly w. This lesson requires matched arrays, strictly positive integer weights, non-negative values and capacity. The guards reject zero/negative weights and negative capacity; positive weights ensure capacity zero has optimum zero. A tie stores the same optimum value; this function records no chosen-item list.",

  vocabulary: [
    { term: "0/1 knapsack", definition: "Maximize value choosing whole items subject to a weight capacity." },
    { term: "Capacity", definition: "The maximum total weight the bag can hold." },
    { term: "Take/skip transition", definition: "For each item, choose the better of leaving it out or including it." },
    { term: "Pseudo-polynomial", definition: "Runtime polynomial in the numeric value of the capacity, not its bit-length." },
    { term: "Optimal substructure", definition: "The best solution is built from best solutions to smaller (fewer items / less capacity) subproblems." },
  ],

  concepts: {
  "purpose": "Select a subset of items maximizing value under a capacity constraint — the model for budgeted-selection problems.",
  "operations": "For each item and capacity, take max(skip, take-if-fits); read dp[n][cap] for the answer.",
  "uses": "Budget allocation, subset-sum/partition, resource selection, cargo loading, project selection under a constraint.",
  "tradeoffs": "Exact take/skip DP is pseudo-polynomial in numeric capacity; a descending row can reduce stored cells. Fractional greedy solves a different divisible-item problem.",
  "commonMistakes": "Applying value-per-weight greedy to the 0/1 version (wrong); indexing values/weights with i instead of i-1; iterating capacity upward in the 1D compression (accidentally reuses an item).",
  "edgeCases": "Empty item arrays return 0 for every non-negative capacity. Capacity 0 returns 0 with strictly positive weights. Items heavier than a state capacity can only be skipped. Negative capacity, mismatched arrays and non-positive weights raise ValueError."
},

  complexity: [
  {
    "operation": "0/1 knapsack (2D DP)",
    "best": "O((n+1)*(W+1))",
    "average": "O((n+1)*(W+1))",
    "worst": "O((n+1)*(W+1))",
    "space": "O((n+1)*(W+1))",
    "note": "Includes table allocation when n=0 or W=0; pseudo-polynomial in numeric W, not input bit length."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of items"
    },
    {
      "symbol": "W",
      "meaning": "the knapsack capacity (denoted cap in code)"
    }
  ],
  "costModel": "Filling one table cell is O(1) (a comparison, an addition, a max). The nested loops fill every cell once.",
  "time": {
    "bound": "O((n+1)*(W+1))",
    "case": "worst",
    "explanation": "Allocation initializes (n+1)(W+1) cells; n(W+1) states consider skip and, when feasible, take. Validation scans at most n weights. Total O((n+1)(W+1)), including n=0 or W=0. For positive n,W it is customarily O(nW), pseudo-polynomial in numeric W."
  },
  "space": {
    "bound": "O((n+1)*(W+1))",
    "case": "worst",
    "explanation": "The full table has (n+1)(W+1) scalar cells. Descending-capacity compression preserves previous-item values in O(W+1) cells; retaining all rows is a convenient way to reconstruct choices but not the only reconstruction method.",
    "inputOutputNote": "Return value is the optimum total, not an item selection. Cell bounds exclude growing integer bit storage. Required input arrays and tracer data are separate."
  },
  "derivation": [
    {
      "lines": [
        7
      ],
      "description": "Allocate the (n+1)×(W+1) table (base row zeros).",
      "cost": "O((n+1)*(W+1))",
      "dimension": "space"
    },
    {
      "lines": [
        8,
        9,
        10,
        11,
        12,
        13,
        14
      ],
      "description": "Nested loops fill each cell once with an O(1) take/skip max.",
      "cost": "O((n+1)*(W+1))",
      "dimension": "time"
    },
    {
      "lines": [
        15
      ],
      "description": "Read dp[n][cap] — O(1).",
      "cost": "O(1)",
      "dimension": "time"
    }
  ],
  "assumptions": [
    "For general indivisible 0/1 items, ratio-greedy has no optimality guarantee.",
    "Weights are strictly positive integers; capacity is a non-negative integer; values are non-negative integers of matching length.",
    "One arithmetic comparison/addition is O(1).",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "Exact take/skip DP costs O((n+1)(W+1)) cells/work under the scalar model. Fractional ratio-greedy is valid when positive-weight items may be split; it solves a different problem. A descending-capacity row reduces stored cells to W+1.",
  "counters": [
    {
      "label": "cells filled",
      "definition": "executions of the skip-option line Recorded line entries at 10 occur before the operation completes.",
      "countLines": [
        10
      ]
    },
    {
      "label": "take-option checks",
      "definition": "executions of the fits check Recorded line entries at 11 occur before the operation completes.",
      "countLines": [
        11
      ]
    }
  ],
  "fixedDataNote": "For [1,3,4]/[15,20,30], cap 4, the table has 4×5 cells and the answer is 35 (items 1 and 2). The O(n·W) bound describes how the fill scales with items and capacity. Function analysis excludes demonstration input literals, imports, printing and tracer storage. A line event shows the next operation before it completes."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: whole-item selection under capacity."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Comment continued: maximize value."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Define knapsack(weights, values, cap)."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Validate non-negative integer capacity, matching item arrays, and strictly positive integer weights."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Reject a mismatched length, negative capacity or zero/negative weight."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "n = number of items."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Allocate dp[i][w]; row 0 (no items) is all zeros — the base case."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Consider items 1..n."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Consider each capacity 0..cap."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Option A: skip item i — inherit the best without it."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Option B is possible only if item i fits in capacity w."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Value if we take it: its value plus the best for the leftover capacity using earlier items."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "If taking it beats skipping..."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "...record the better value."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "The answer uses all items with full capacity: dp[n][cap]."
  },
  {
    "line": 16,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Best value for the sample is 35 (items 1 and 2)."
  }
],

  bindings: [
    {
      variable: "dp",
      model: "dp-table",
      // 2D current cell: row = item index `i`, column = capacity `w`.
      overlays: [
        { role: "pointer", label: "i", source: "i" },
        { role: "pointer", label: "j", source: "w" },
      ],
    },
  ],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "Why can't you just greedily take items with the best value-per-weight ratio in the 0/1 knapsack?",
    "answer": "A high-ratio indivisible item can block a more valuable combination. With weights [4,3,3], values [5,3,3], cap6, greedy gets 5 but taking both weight3 items gets 6. Ratio-greedy has a general guarantee for positive-weight divisible items, not general 0/1 selection.",
    "explanation": "0/1 selection interacts across items — the best subset isn't always led by the best single ratio. DP considers the take/skip tradeoff for every capacity, which greedy skips."
  }
],

  experiments: [
  "Print the dp table and trace back which items were chosen for the optimum.",
  "Compress dp to 1D and iterate w downward; confirm the answer stays 35.",
  "Try weights=[4,3,3], values=[5,3,3], cap=6: ratio-greedy first picks weight4/value5, but DP chooses the two weight3 items for value6."
],

  exercises: [
  {
    "id": "dpks-complete-1",
    "kind": "complete-code",
    "prompt": "Complete `knapsack(weights, values, capacity)` for the 0/1 knapsack: return the maximum total value of a subset of items whose weights fit in `capacity`. Fill in the take/skip transition.",
    "starterCode": "def knapsack(weights, values, capacity):\n    n = len(weights)\n    dp = [[0] * (capacity + 1) for _ in range(n + 1)]\n    for i in range(1, n + 1):\n        for w in range(capacity + 1):\n            dp[i][w] = dp[i - 1][w]\n            if weights[i - 1] <= w:\n                # TODO: compute the 'take' value and keep the better option\n                pass\n    return dp[n][capacity]",
    "expected": "def knapsack(weights, values, capacity):\n    n = len(weights)\n    dp = [[0] * (capacity + 1) for _ in range(n + 1)]\n    for i in range(1, n + 1):\n        for w in range(capacity + 1):\n            dp[i][w] = dp[i - 1][w]\n            if weights[i - 1] <= w:\n                take = dp[i - 1][w - weights[i - 1]] + values[i - 1]\n                if take > dp[i][w]:\n                    dp[i][w] = take\n    return dp[n][capacity]",
    "hints": [
      "Goal: complete the take/skip transition for 0/1 knapsack at cell dp[i][w].",
      "Recomputing subproblems is avoided by the table; the transition just reuses the row above.",
      "Key insight: taking item i frees value only if it fits, using dp[i-1][w - weights[i-1]] capacity for earlier items.",
      "Approach: start from the skip value dp[i-1][w], then if the item fits compare against taking it.",
      "Pseudocode: dp[i][w]=dp[i-1][w]; if weights[i-1]<=w compute take=dp[i-1][w-weights[i-1]]+values[i-1]; keep the max.",
      "Write `take = dp[i-1][w - weights[i-1]] + values[i-1]` and set dp[i][w] to the larger of skip and take."
    ],
    "tests": "# weights [2,3], values [3,4], capacity 3: take item 2 (w3,v4) -> 4 beats item 1 (w2,v3).\nassert knapsack([2, 3], [3, 4], 3) == 4, f'best value at capacity 3 is 4, got {knapsack([2, 3], [3, 4], 3)}'\n# Larger capacity fits both items -> 3 + 4 = 7.\nassert knapsack([2, 3], [3, 4], 5) == 7, f'both items fit -> 7, got {knapsack([2, 3], [3, 4], 5)}'\n# Classic instance.\nassert knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7) == 9, f'best is items w3+w4 -> 9, got {knapsack([1,3,4,5],[1,4,5,7],7)}'\n# Nothing fits.\nassert knapsack([5], [10], 3) == 0, 'item too heavy -> 0'\nassert knapsack([], [], 5) == 0, 'no items -> 0'\nprint('OK')"
  },
  {
    "id": "dpks-choose-1",
    "kind": "choose-approach",
    "prompt": "Items can be split into any fraction, and you want max value under a weight limit. DP knapsack or greedy — and why? Assume positive weights and non-negative values; fractional choices may split an item.",
    "expected": "Greedy by value-per-weight: for the fractional knapsack, take items in ratio order (splitting the last), giving the optimum in O(n log n). DP is unnecessary because fractions remove the 0/1 interaction.",
    "hints": [
      "Goal: maximize value under a weight limit when items can be split into ANY fraction — DP knapsack or greedy.",
      "The costly over-engineering is a DP knapsack table, which exists to handle the all-or-nothing item interaction.",
      "Key property: fractional splitting removes the 0/1 coupling, so each item can be taken partially by its value density.",
      "Approach: greedily take items in decreasing value-per-weight order, splitting the last one to fill the limit.",
      "Reasoning: with fractions the exchange argument proves greedy optimal in O(n log n); DP is only needed for the 0/1 variant where items can't be split.",
      "Answer: greedy by value-per-weight (fractional knapsack) — optimal in O(n log n); DP is unnecessary because fractions remove the 0/1 interaction."
    ],
    "recognition": {
      "scenario": "Items may be split into any fraction and you want maximum value under a weight limit.",
      "approaches": [
        {
          "id": "greedy-ratio",
          "label": "Greedy by value-per-weight ratio",
          "requiredReasonIds": [
            "fractions-remove-01"
          ]
        },
        {
          "id": "dp-knapsack",
          "label": "0/1 knapsack dynamic programming",
          "requiredReasonIds": [],
          "rejectionFeedback": "0/1 DP is for the all-or-nothing case; when items can be split, the fraction removes that interaction and a simple ratio-greedy is optimal, so DP is unnecessary overhead."
        }
      ],
      "reasons": [
        {
          "id": "fractions-remove-01",
          "text": "Because items can be split, taking them in descending value/weight order (splitting the last to fill the limit) is provably optimal in O(n log n) — no DP interaction remains."
        },
        {
          "id": "greedy-wrong-fractional",
          "text": "Greedy by ratio gives a suboptimal answer for the fractional knapsack.",
          "contradictory": true
        },
        {
          "id": "fractional-needs-dp",
          "text": "The fractional knapsack still needs the 0/1 DP table to be solved optimally.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "greedy-ratio"
      ],
      "modelExplanation": "Greedy by value-per-weight: for the fractional knapsack, take items in ratio order (splitting the last), giving the optimum in O(n log n). DP is unnecessary because fractions remove the 0/1 interaction."
    }
  },
  {
    "id": "dpks-predict-1",
    "kind": "predict-state",
    "prompt": "For weights [1,3,4], values [15,20,30], cap 4, what is the optimal value and which items are chosen?",
    "expected": "35 — take items 1 (w1,v15) and 2 (w3,v20): weight 4, value 35, beating the single weight-4 item worth 30.",
    "hints": [
      "Two options fill capacity 4 exactly.",
      "15+20 vs 30.",
      "The pair wins with 35."
    ]
  }
],

  review: "0/1 knapsack chooses each item at most once and maximizes value at total weight at most cap. The full state dp[i][w] takes max(skip,take from the previous item row). Positive weights make zero capacity worth zero; invalid lengths/weights/capacity are rejected. Allocation and transitions use O((n+1)(W+1)) scalar cells/work. Descending capacities compress to W+1 cells. Ratio-greedy lacks a general 0/1 guarantee; sample optimum is 35.",

  expectedOutput: "35\n",

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
    "url": "https://webpages.charlotte.edu/rbunescu/courses/ou/cs4040/lecture16.pdf",
    "title": "University lecture: 0/1 knapsack",
    "section": "Take/skip recurrence, table base cases and row storage",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "An item may be taken once using previous-item states; capacity DP is pseudo-polynomial; positive weights make zero capacity worth zero."
    ],
    "conventions": [
      "Source uses one-based item numbering; app accesses item i−1."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://cs.nyu.edu/~gottlieb/courses/2000s/2002-03-fall/alg/lectures/lecture-24.html",
    "title": "NYU: fractional and 0/1 knapsack",
    "section": "Greedy fraction exchange and indivisible counterexample",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Positive-weight divisible items admit ratio-greedy; general 0/1 items do not."
    ],
    "conventions": [
      "The counterexample has W=6, weights4,3,3 and values5,3,3; remaining capacity after weight4 is 2 (source subtraction typo is not copied)."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/mit6_006s20_lec18.pdf",
    "title": "MIT 6.006 lecture 18",
    "section": "Subset sum and pseudo-polynomial time",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Numeric-capacity state counts differ from input bit-length complexity."
    ],
    "conventions": [],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "92f80a92b6ddc9fe",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
