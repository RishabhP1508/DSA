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
  ],

  alternatives: [
    "Unbounded knapsack / coin change — when items can be reused unlimited times; iterate capacity UPWARD.",
    "Greedy — only valid for the FRACTIONAL knapsack (items divisible), never for 0/1.",
    "Meet-in-the-middle — for subset-sum when n is moderate but the target is huge (splits into two halves, ~O(2^(n/2))).",
  ],

  counterexamples: [
    "Applying value/weight greedy to 0/1 knapsack gives wrong answers — that's only correct for the fractional version.",
    "Iterating capacity UPWARD in the 1D DP accidentally reuses an item (that solves unbounded knapsack, a different problem).",
    "If items may repeat unlimited times, this exact recurrence undercounts — switch to the unbounded form.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "True\n",
  complexityNote:
    "O(n·C) time where C is the target/capacity (pseudo-polynomial). O(C) space with the 1D rolling array (O(n·C) for the full 2D table).",

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
      id: "pat-ks-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Can an array be split into two subsets with equal sum?' Which pattern?",
      expected:
        "0/1 knapsack (subset-sum): target = total/2; dp[s] tracks reachable subset sums, each item used once (sweep capacity downward). O(n·target). Feasible iff dp[target] is True.",
      correctPatternId: "knapsack",
      hints: [
        "Each number is used at most once.",
        "It's subset-sum to total/2.",
        "1D DP, iterate capacity downward.",
      ],
    },
    {
      id: "pat-ks-choose-1",
      kind: "choose-approach",
      prompt:
        "'Fewest coins to make an amount, coins reusable unlimited times.' Is this the same 0/1 knapsack recurrence?",
      expected:
        "No — that's UNBOUNDED knapsack (coin change): items repeat, so iterate capacity UPWARD (dp[a] from dp[a-coin]). The 0/1 form (downward sweep) forbids reuse and would undercount.",
      correctPatternId: "knapsack",
      hints: [
        "Reusable items = unbounded knapsack.",
        "Sweep direction differs.",
        "Upward for unbounded, downward for 0/1.",
      ],
    },
    {
      id: "pat-ks-fix-1",
      kind: "fix-mistake",
      prompt:
        "This subset-sum accidentally allows reusing an item. Fix the capacity loop direction.",
      starterCode:
        "for num in nums:\n    for s in range(num, target + 1):\n        dp[s] = dp[s] or dp[s - num]",
      expected:
        "for num in nums:\n    for s in range(target, num - 1, -1):\n        dp[s] = dp[s] or dp[s - num]",
      hints: [
        "Going upward lets the same item be counted again this pass.",
        "For 0/1, iterate capacity from high to low.",
        "range(target, num - 1, -1)",
      ],
    },
  ],

  references: [
    {
      url: "https://en.wikipedia.org/wiki/Knapsack_problem#0-1_knapsack_problem",
      title: "Knapsack problem — 0/1 knapsack (Wikipedia)",
      section: "DP recurrence; pseudo-polynomial time; 0/1 vs unbounded",
      topic: "patterns/knapsack",
      purpose: "Confirm the take/skip recurrence, O(nC) pseudo-polynomial cost, and the 0/1-vs-unbounded distinction.",
      verifiedClaims: [
        "0/1 knapsack takes each item at most once and runs in O(nC), pseudo-polynomial in the capacity.",
        "The 1D optimization must iterate capacity downward to preserve the 0/1 property.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://leetcode.com/problems/partition-equal-subset-sum/editorial/",
      title: "Partition Equal Subset Sum — LeetCode editorial",
      section: "Subset-sum DP to total/2",
      topic: "patterns/knapsack",
      purpose: "Cross-check the equal-partition reduction to subset-sum and the boolean DP.",
      verifiedClaims: [
        "Equal partition reduces to subset-sum with target = total/2, solved by a boolean 0/1-knapsack DP.",
      ],
      accessDate: "2026-09-20",
    },
  ],
};
