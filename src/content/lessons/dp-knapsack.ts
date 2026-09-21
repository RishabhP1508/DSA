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
  prerequisites: ["dp-1d-2d"],

  explanation: `The **0/1 knapsack** problem: given items each with a **weight** and a **value**, and a bag with a fixed **capacity**, choose a subset that **maximizes total value** without exceeding the capacity. "0/1" means each item is either taken **whole** or **left out** — no fractions, no partial items. A greedy "best value-per-weight first" rule can fail here (that greedy works only for the *fractional* knapsack), which is exactly why this needs DP.

The state has **two** coordinates, so it's a **2D** table: \`dp[i][w]\` = the best value achievable using the **first i items** with capacity exactly **w** available. For each item i and capacity w there are two options: **skip** item i (value \`dp[i-1][w]\`), or, if it fits (\`weights[i-1] <= w\`), **take** it (value \`dp[i-1][w - weights[i-1]] + values[i-1]\` — its value plus the best for the remaining capacity using earlier items). The transition takes the **maximum** of these two. Row 0 (no items) is all zeros — the base case. The answer is \`dp[n][cap]\`. For weights \`[1,3,4]\`, values \`[15,20,30]\`, capacity 4, the best is taking items 1 and 2 (weight 1+3=4, value 15+20=**35**), which beats taking the single weight-4 item (value 30).

This is **O(n·cap)** time and space — it fills an (n+1)×(cap+1) table once. That is **pseudo-polynomial**: it's polynomial in the *numeric value* of the capacity, not in the number of bits used to write it, so a huge capacity is expensive even with few items. Because each row depends only on the **previous row**, space compresses to **O(cap)** (iterating w **downward** to avoid reusing an item). Knapsack is the template for many "choose a subset under a budget" problems.`,

  vocabulary: [
    { term: "0/1 knapsack", definition: "Maximize value choosing whole items subject to a weight capacity." },
    { term: "Capacity", definition: "The maximum total weight the bag can hold." },
    { term: "Take/skip transition", definition: "For each item, choose the better of leaving it out or including it." },
    { term: "Pseudo-polynomial", definition: "Runtime polynomial in the numeric value of the capacity, not its bit-length." },
    { term: "Optimal substructure", definition: "The best solution is built from best solutions to smaller (fewer items / less capacity) subproblems." },
  ],

  concepts: {
    purpose:
      "Select a subset of items maximizing value under a capacity constraint — the model for budgeted-selection problems.",
    operations:
      "For each item and capacity, take max(skip, take-if-fits); read dp[n][cap] for the answer.",
    uses:
      "Budget allocation, subset-sum/partition, resource selection, cargo loading, project selection under a constraint.",
    tradeoffs:
      "Exact and simple, but O(n·cap) — pseudo-polynomial, so large capacities are costly; greedy is faster but only correct for the fractional variant.",
    commonMistakes:
      "Applying value-per-weight greedy to the 0/1 version (wrong); indexing values/weights with i instead of i-1; iterating capacity upward in the 1D compression (accidentally reuses an item).",
    edgeCases:
      "Capacity 0 or no items → value 0. An item heavier than the capacity is never taken. Ties keep the first-found equal option.",
  },

  complexity: [
    { operation: "0/1 knapsack (2D DP)", best: "O(n·W)", average: "O(n·W)", worst: "O(n·W)", space: "O(n·W)", note: "W = capacity; fill (n+1)×(W+1) table; O(W) with row compression." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of items" },
      { symbol: "W", meaning: "the knapsack capacity (denoted cap in code)" },
    ],
    costModel:
      "Filling one table cell is O(1) (a comparison, an addition, a max). The nested loops fill every cell once.",
    time: {
      bound: "O(n·W)",
      case: "worst",
      explanation:
        "The outer loop runs n times (items) and the inner loop W+1 times (capacities), and each cell does constant work. So the table has (n+1)(W+1) cells and total time is O(n·W). This is pseudo-polynomial: it depends on the numeric value of W, so a very large capacity is expensive even with few items.",
    },
    space: {
      bound: "O(n·W)",
      case: "worst",
      explanation:
        "The 2D table stores (n+1)(W+1) values. Since each row depends only on the previous one, it compresses to a single length-(W+1) array — O(W) — if the capacity loop runs downward (to avoid reusing an item within the same row).",
      inputOutputNote: "The single best-value integer is O(1); the O(n·W) space is the table, reducible to O(W).",
    },
    derivation: [
      { lines: [5], description: "Allocate the (n+1)×(W+1) table (base row zeros).", cost: "O(n·W)", dimension: "space" },
      { lines: [6, 7, 8, 9, 10, 11, 12], description: "Nested loops fill each cell once with an O(1) take/skip max.", cost: "O(n·W)", dimension: "time" },
      { lines: [13], description: "Read dp[n][cap] — O(1).", cost: "O(1)", dimension: "time" },
    ],
    assumptions: [
      "Items are indivisible (0/1), so greedy by ratio is not valid.",
      "Weights and capacity are non-negative integers.",
      "One arithmetic comparison/addition is O(1).",
    ],
    tradeoffs:
      "DP is exact but O(n·W); the fractional knapsack admits an O(n log n) greedy but allows partial items. Row compression reduces space to O(W) at no time cost, losing the full table needed to reconstruct the chosen items.",
    counters: [
      { label: "cells filled", definition: "executions of the skip-option line (line 8)", countLines: [8] },
      { label: "take-option checks", definition: "executions of the fits check (line 9)", countLines: [9] },
    ],
    fixedDataNote:
      "For [1,3,4]/[15,20,30], cap 4, the table has 4×5 cells and the answer is 35 (items 1 and 2). The O(n·W) bound describes how the fill scales with items and capacity.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: whole-item selection under capacity." },
    { line: 2, executable: false, explanation: "Comment continued: maximize value." },
    { line: 3, executable: true, explanation: "Define knapsack(weights, values, cap)." },
    { line: 4, executable: true, explanation: "n = number of items." },
    { line: 5, executable: true, explanation: "Allocate dp[i][w]; row 0 (no items) is all zeros — the base case." },
    { line: 6, executable: true, explanation: "Consider items 1..n." },
    { line: 7, executable: true, explanation: "Consider each capacity 0..cap." },
    { line: 8, executable: true, explanation: "Option A: skip item i — inherit the best without it." },
    { line: 9, executable: true, explanation: "Option B is possible only if item i fits in capacity w." },
    { line: 10, executable: true, explanation: "Value if we take it: its value plus the best for the leftover capacity using earlier items." },
    { line: 11, executable: true, explanation: "If taking it beats skipping..." },
    { line: 12, executable: true, explanation: "...record the better value." },
    { line: 13, executable: true, explanation: "The answer uses all items with full capacity: dp[n][cap]." },
    { line: 14, executable: false, explanation: "Blank line." },
    { line: 15, executable: true, explanation: "Best value for the sample is 35 (items 1 and 2)." },
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
      atEventIndex: 0,
      prompt: "Why can't you just greedily take items with the best value-per-weight ratio in the 0/1 knapsack?",
      answer: "Because items are indivisible: a high-ratio item might waste capacity that two other items would fill more valuably. Ratio-greedy is optimal only for the fractional knapsack, where partial items are allowed.",
      explanation: "0/1 selection interacts across items — the best subset isn't always led by the best single ratio. DP considers the take/skip tradeoff for every capacity, which greedy skips.",
    },
  ],

  experiments: [
    "Print the dp table and trace back which items were chosen for the optimum.",
    "Compress dp to 1D and iterate w downward; confirm the answer stays 35.",
    "Increase cap to 5 and see whether taking the weight-4 item alone ever wins.",
  ],

  exercises: [
    {
      id: "dpks-complete-1",
      kind: "complete-code",
      prompt: "Complete the take/skip transition for 0/1 knapsack.",
      starterCode:
        "dp[i][w] = dp[i - 1][w]\nif weights[i - 1] <= w:\n    # TODO: compute the 'take' value and keep the better option\n    pass",
      expected:
        "dp[i][w] = dp[i - 1][w]\nif weights[i - 1] <= w:\n    take = dp[i - 1][w - weights[i - 1]] + values[i - 1]\n    if take > dp[i][w]:\n        dp[i][w] = take",
      hints: [
        "Taking item i uses w - weights[i-1] capacity for earlier items.",
        "Add its value to that best.",
        "take = dp[i-1][w - weights[i-1]] + values[i-1]; keep max.",
      ],
    },
    {
      id: "dpks-choose-1",
      kind: "choose-approach",
      prompt: "Items can be split into any fraction, and you want max value under a weight limit. DP knapsack or greedy — and why?",
      expected: "Greedy by value-per-weight: for the fractional knapsack, take items in ratio order (splitting the last), giving the optimum in O(n log n). DP is unnecessary because fractions remove the 0/1 interaction.",
      hints: [
        "Fractions are allowed here.",
        "That's the fractional knapsack.",
        "Ratio-greedy is optimal for fractional.",
      ],
    },
    {
      id: "dpks-predict-1",
      kind: "predict-state",
      prompt: "For weights [1,3,4], values [15,20,30], cap 4, what is the optimal value and which items are chosen?",
      expected: "35 — take items 1 (w1,v15) and 2 (w3,v20): weight 4, value 35, beating the single weight-4 item worth 30.",
      hints: [
        "Two options fill capacity 4 exactly.",
        "15+20 vs 30.",
        "The pair wins with 35.",
      ],
    },
  ],

  review: `**0/1 knapsack** maximizes value choosing **whole** items under a capacity. Its two-coordinate state → a **2D** table \`dp[i][w]\` with the transition \`max(skip = dp[i-1][w], take = dp[i-1][w-wᵢ] + vᵢ if it fits)\`, base row all zeros, answer \`dp[n][cap]\`. Ratio-greedy is **wrong** for 0/1 (only right for fractional). It's **O(n·W)** — **pseudo-polynomial** — and space compresses to **O(W)** (iterate capacity downward). The sample optimum is **35**.`,

  expectedOutput: "35\n",

  references: [
    {
      url: "https://en.wikipedia.org/wiki/Knapsack_problem#0-1_knapsack_problem",
      title: "Knapsack problem — 0/1 knapsack (Wikipedia)",
      section: "0/1 knapsack DP recurrence and pseudo-polynomial complexity",
      topic: "dp/knapsack",
      purpose: "Confirm the take/skip DP recurrence, the O(nW) pseudo-polynomial runtime, and that greedy is not optimal for 0/1.",
      verifiedClaims: [
        "The 0/1 knapsack DP runs in O(nW), which is pseudo-polynomial in the capacity.",
        "Each item is taken wholly or not at all; the transition takes the max of skipping or including the item.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://algs4.cs.princeton.edu/home/",
      title: "Algorithms, 4th Edition (Princeton) — dynamic programming and knapsack",
      section: "Optimal substructure and subset selection",
      topic: "dp/knapsack",
      purpose: "Cross-check the optimal-substructure justification for the knapsack DP.",
      verifiedClaims: [
        "Knapsack exhibits optimal substructure: optima are built from optima of smaller subproblems.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "c77a488534b0dbdf",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
