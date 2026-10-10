/**
 * Pattern: 0/1 Knapsack (subset-sum DP).
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2). Output "True\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# 0/1 Knapsack family: each item is taken or not. Here: can we split into two
# equal-sum halves? (subset-sum with target = total / 2).
def can_partition(nums):
    total = sum(nums)
    if total % 2:
        return False                      # odd total can't split evenly
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True                          # sum 0 is always reachable (empty subset)
    for num in nums:
        for s in range(target, num - 1, -1):   # iterate DOWN so each item is used once
            dp[s] = dp[s] or dp[s - num]
    return dp[target]

print(can_partition([1, 5, 11, 5]))  # 11 == 1 + 5 + 5 -> True`;

export const knapsackPattern: PatternDefinition = {
  id: "knapsack",
  title: "0/1 Knapsack (Subset Sum)",
  category: "Dynamic programming",
  summary:
    "Decide take-or-skip for each item to hit a capacity/target, filling a DP table over (items, capacity) — the 0/1 knapsack family.",

  clues: [
    "Each item is used AT MOST ONCE (a binary take/skip choice), and you optimize or test feasibility under a capacity/target.",
    "You want max value under a weight limit, whether a subset hits a target sum, an equal-sum partition, or a count of such subsets.",
    "Phrases like '0/1 knapsack', 'subset sum', 'partition equal subset sum', 'target sum', 'can you make amount using each item once'.",
  ],

  naiveApproach: `Try every subset — **O(2ⁿ)** — checking which satisfies the target. This recomputes the same (remaining items, remaining capacity) subproblems exponentially often; the choices overlap heavily.`,

  whyItHelps: `The state is **(items considered, capacity used)** and it has **overlapping subproblems + optimal substructure**, so DP applies. For each item, combine two choices: **skip it** (inherit the previous row) or **take it** (add its value / mark its weight reachable using the remainder). A 2D table \`dp[i][c]\` is **O(n·C)**; because each row depends only on the previous, it compresses to a **1D array iterated from high capacity down to low** — the downward sweep is what enforces the **0/1** rule (each item used once). That turns O(2ⁿ) into **O(n·C)** pseudo-polynomial time.`,

  conditions: [
  "Each item is used at most once — iterate capacity DOWNWARD in the 1D form (upward would allow reuse = unbounded knapsack).",
  "Capacity/target is a bounded non-negative integer (the cost is pseudo-polynomial in its value).",
  "Seed the base case dp[0] = True / 0 (empty subset reaches sum 0 / value 0).",
  "Input values are non-negative integers; zeros are allowed and repeated values are distinct input positions. Negative values need a different state range/representation."
],

  alternatives: [
  "Unbounded knapsack / coin change — when items can be reused unlimited times; iterate capacity UPWARD.",
  "Fractional ratio-greedy has a guarantee when items with positive weights may be split. It has no general optimality guarantee for indivisible 0/1 items.",
  "Meet-in-the-middle can help when item count is moderate and target huge: enumerate sums for two halves and search compatible pairs. Account for sum generation and sorting/search work as well as exponential half-size storage."
],

  counterexamples: [
  "Applying value/weight greedy to 0/1 knapsack gives wrong answers — that's only correct for the fractional version.",
  "Iterating capacity UPWARD in the 1D DP accidentally reuses an item (that solves unbounded knapsack, a different problem).",
  "Unlimited reuse changes the state transition. A 0/1 restriction may wrongly report impossible or give too many coins for a minimum-count objective; use an unbounded recurrence when reuse is allowed."
],

  walkthroughCode,
  walkthroughExpectedOutput: "True\n",
  complexityNote:
    "O((n+1)(C+1)) scalar work, O(C+1) boolean cells; target C=total/2. Odd totals stop after O(n). Exact reachable sums use a descending 0/1 update.",

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of items (values in nums)"
    },
    {
      "symbol": "C",
      "meaning": "the target sum (total / 2)"
    }
  ],
  "costModel": "0/1 subset-sum DP: for each item, sweep the capacity array from high to low so each item is used at most once. This is PSEUDO-polynomial — linear in the numeric value C, not in its bit-length.",
  "time": {
    "bound": "O((n+1)*(C+1))",
    "case": "worst",
    "explanation": "Summing input costs O(n). An odd total returns after that scan. For an even total, allocation initializes C+1 cells and each item makes at most C+1 descending checks. Including zero items/target gives O((n+1)(C+1)); for positive dimensions, commonly O(nC). C is a numeric sum, so this is pseudo-polynomial."
  },
  "space": {
    "bound": "O(C+1)",
    "case": "worst",
    "explanation": "A C+1 boolean array retains exact reachable sums for the processed item prefix. The current item layer is implicit in the outer loop.",
    "inputOutputNote": "nums (n) is the input; the answer is a boolean; dp (C+1) is auxiliary."
  },
  "derivation": [
    {
      "lines": [
        4
      ],
      "description": "Compute the total to derive the target.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        10,
        11,
        12
      ],
      "description": "For each item, sweep the capacity array once (downward).",
      "cost": "O((n+1)*(C+1))",
      "dimension": "time"
    },
    {
      "lines": [
        8
      ],
      "description": "The 1D dp array of C+1 booleans.",
      "cost": "O(C+1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Values are non-negative integers (so C is a well-defined array index).",
    "The DOWNWARD inner sweep (line 11) is what enforces 0/1 (each item used once) rather than unbounded.",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "The 2D table is O(n·C) space but easier to reason about; the 1D rolling array cuts space to O(C). Pseudo-polynomial: not efficient when C is huge relative to n.",
  "counters": [
    {
      "label": "dp updates",
      "definition": "executions of the dp update Recorded line entries at 12 occur before the operation completes.",
      "countLines": [
        12
      ]
    }
  ],
  "fixedDataNote": "For [1,5,11,5], total22 and target11: the descending loop executes 11+7+1+7=26 updates, not exactly n*C=44. It finds 11 and 1+5+5. Function analysis excludes demo construction/printing."
},

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: 0/1 take-or-skip; here an equal-sum partition." },
    { line: 2, executable: false, explanation: "Comment continued." },
    { line: 3, executable: true, explanation: "Define can_partition(nums)." },
    { line: 4, executable: true, explanation: "Total of all numbers." },
    { line: 5, executable: true, explanation: "An odd total can't split into two equal halves." },
    { line: 6, executable: true, explanation: "Reject the odd-total case." },
    { line: 7, executable: true, explanation: "Target for one half." },
    { line: 8, executable: true, explanation: "dp[s] = can we reach subset sum s? (booleans up to target)." },
    { line: 9, executable: true, explanation: "Base case: sum 0 is reachable with the empty subset." },
    { line: 10, executable: true, explanation: "Consider each item once (0/1)." },
    { line: 11, executable: true, explanation: "Sweep capacity DOWNWARD so this item isn't reused within the same pass." },
    { line: 12, executable: true, explanation: "s is reachable if it already was, or if s-num was (take this item)." },
    { line: 13, executable: true, explanation: "Feasible iff the target half is reachable." },
    { line: 14, executable: false, explanation: "Blank line." },
    { line: 15, executable: true, explanation: "[1,5,11,5] splits as 11 vs 1+5+5 -> True." },
  ],

  bindings: [
    {
      variable: "dp",
      model: "dp-table",
      // 1D reachability table; the current cell is the capacity `s` being set.
      overlays: [{ role: "pointer", label: "i", source: "s" }],
    },
  ],

  linkedLessons: ["dp-knapsack", "dp-subsequences", "dp-1d-2d"],

  exercises: [
  {
    "id": "pat-ks-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'Can an array be split into two subsets with equal sum?' Which pattern? Assume non-negative integer values; equal values are separate item positions.",
    "expected": "0/1 knapsack (subset-sum): target = total/2; dp[s] tracks reachable subset sums, each item used once (sweep capacity downward). O((n+1)(target+1)). Feasible iff dp[target] is True.",
    "correctPatternId": "knapsack",
    "hints": [
      "Goal: decide whether an array can be split into two subsets with equal sum.",
      "Trying every partition is exponential; overlapping reachable-sum subproblems can be reused.",
      "Key insight: it's subset-sum to total/2, with each number used at most once.",
      "Approach: use a 1D 0/1-knapsack DP tracking which subset sums are reachable.",
      "Pseudocode: if total is odd return False; target=total/2; dp[0]=True; for each num sweep capacity downward marking dp[s]|=dp[s-num].",
      "Use 0/1 knapsack (subset-sum): target=total/2, iterate capacity downward, feasible iff dp[target] is True — O((n+1)(target+1))."
    ],
    "recognition": {
      "scenario": "Recognize: 'Can an array be split into two subsets with equal sum?' Which pattern? Assume non-negative integer values; equal values are separate item positions.",
      "approaches": [
        {
          "id": "knapsack-01",
          "label": "0/1 knapsack (subset-sum DP)",
          "requiredReasonIds": [
            "reachable-half"
          ]
        },
        {
          "id": "greedy",
          "label": "Greedy partition (sort and assign)",
          "requiredReasonIds": [],
          "rejectionFeedback": "Greedily balancing sums does not reliably decide exact equal partition; subset-sum needs DP over reachable sums."
        }
      ],
      "reasons": [
        {
          "id": "reachable-half",
          "text": "Set target = total/2 and let dp[s] track reachable subset sums with each item used once (sweep capacity downward); feasible iff dp[target] is true — O((n+1)(target+1))."
        },
        {
          "id": "fractional-ok",
          "text": "Items can be split into fractions, so a greedy ratio choice is optimal.",
          "contradictory": true
        },
        {
          "id": "unlimited-reuse",
          "text": "Each item may be reused unlimited times, so sweep capacity upward.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "knapsack-01"
      ],
      "modelExplanation": "0/1 knapsack (subset-sum): target = total/2; dp[s] tracks reachable sums with each item used once (downward capacity sweep). Feasible iff dp[target] is true."
    }
  },
  {
    "id": "pat-ks-choose-1",
    "kind": "choose-approach",
    "prompt": "'Fewest coins to make an amount, coins reusable unlimited times.' Is this the same 0/1 knapsack recurrence?",
    "expected": "No — that's UNBOUNDED knapsack (coin change): items repeat, so iterate capacity UPWARD (dp[a] from dp[a-coin]). The 0/1 form (downward sweep) forbids reuse and may report impossible or overestimate the minimum.",
    "correctPatternId": "knapsack",
    "hints": [
      "Goal: find the fewest coins to make an amount where coins are reusable unlimited times.",
      "The 0/1 downward sweep forbids reuse, so applying it here may report impossible or use too many coins.",
      "Key insight: reusable items mean an item can contribute multiple times, changing the sweep direction.",
      "Approach: use unbounded knapsack (coin change), iterating capacity upward.",
      "Pseudocode: dp[0]=0; for each amount a upward: dp[a]=min(dp[a], dp[a-coin]+1) over coins.",
      "No — that's UNBOUNDED knapsack: iterate capacity UPWARD (dp[a] from dp[a-coin]) since items repeat; the 0/1 downward form forbids reuse."
    ],
    "recognition": {
      "scenario": "Fewest coins to make an amount, with coins reusable unlimited times. Same 0/1 knapsack recurrence?",
      "approaches": [
        {
          "id": "unbounded",
          "label": "Unbounded knapsack (coin change)",
          "requiredReasonIds": [
            "reuse-sweep-up"
          ]
        },
        {
          "id": "knapsack-01",
          "label": "0/1 knapsack (downward sweep)",
          "requiredReasonIds": [],
          "rejectionFeedback": "The 0/1 downward sweep forbids reuse and may report impossible or overestimate the minimum when coins repeat unlimited times."
        }
      ],
      "reasons": [
        {
          "id": "reuse-sweep-up",
          "text": "Coins repeat, so iterate capacity UPWARD (dp[a] from dp[a−coin]) to allow reusing a coin within the same amount."
        },
        {
          "id": "each-once",
          "text": "Each coin may be used at most once, so sweep capacity downward.",
          "contradictory": true
        },
        {
          "id": "fractional-coins",
          "text": "Coins can be split into fractions, so greedy ratio selection is optimal.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "unbounded"
      ],
      "modelExplanation": "No — reusable coins make it UNBOUNDED knapsack (coin change): iterate capacity upward so a coin can be reused. The 0/1 downward sweep forbids reuse and can give impossible or a nonminimal count."
    }
  },
  {
    "id": "pat-ks-fix-1",
    "kind": "fix-mistake",
    "prompt": "`subset_sum(nums, target)` returns whether some subset of `nums` sums to `target`, using each item at most once. This accidentally allows reusing an item. Fix the capacity loop direction.",
    "starterCode": "def subset_sum(nums, target):\n    dp = [False] * (target + 1)\n    dp[0] = True\n    for num in nums:\n        for s in range(num, target + 1):\n            dp[s] = dp[s] or dp[s - num]\n    return dp[target]",
    "expected": "def subset_sum(nums, target):\n    dp = [False] * (target + 1)\n    dp[0] = True\n    for num in nums:\n        for s in range(target, num - 1, -1):\n            dp[s] = dp[s] or dp[s - num]\n    return dp[target]",
    "hints": [
      "Goal: fix the subset-sum so it stops accidentally reusing an item.",
      "The bug sweeps capacity upward, letting the same item be counted again within one pass.",
      "Key insight: for 0/1 (each item once) the capacity loop must go from high to low so an update can't chain within the pass.",
      "Approach: reverse the inner capacity loop to iterate downward.",
      "Pseudocode: for each num: for s from target down to num: dp[s] = dp[s] or dp[s-num].",
      "Iterate the capacity loop downward with `range(target, num - 1, -1)` so each item is used at most once."
    ],
    "tests": "assert subset_sum([3], 6) is False, 'each item used at most once'\nassert subset_sum([3], 3) is True\nassert subset_sum([1,2,3], 0) is True, 'empty subset'\nassert subset_sum([2,3,7,8,10], 11) is True, '3+8'\nassert subset_sum([1,2,5], 4) is False\nprint('OK')"
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
    "url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/mit6_006s20_lec18.pdf",
    "title": "MIT 6.006 lecture 18",
    "section": "Subset sum; take/skip states; numeric pseudo-polynomial range",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Subset-sum can use an item/target recurrence; numeric target complexity is pseudo-polynomial."
    ],
    "conventions": [
      "App compresses previous-item states using a descending sum loop; zeros and empty input are supported extensions."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://leetcode.com/problems/partition-equal-subset-sum/description/",
    "title": "LeetCode: Partition Equal Subset Sum",
    "section": "Problem definition, examples and constraints",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Equal partition is subset-sum to half the total; each position is used at most once."
    ],
    "conventions": [
      "Original values are positive; app also supports zeros and empty input."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://webpages.charlotte.edu/rbunescu/courses/ou/cs4040/lecture16.pdf",
    "title": "University lecture: 0/1 knapsack",
    "section": "Take/skip recurrence and capacity layers",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Previous-item states enforce at-most-once use."
    ],
    "conventions": [],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "7104d0599a0d5e38",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
