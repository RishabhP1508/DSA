/**
 * Lesson: DP — 1D vs 2D tables (unique paths) (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "6\n". Uses the dp-table visualizer to show a 2D
 * grid filling.
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Unique paths in an m x n grid, moving only RIGHT or DOWN.
# dp[i][j] = number of ways to reach cell (i, j) from the top-left.
def unique_paths(m, n):
    dp = [[1] * n for _ in range(m)]   # top row and left column are all 1
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1]  # from above + from left
    return dp[m - 1][n - 1]

print(unique_paths(3, 3))   # 6 ways across a 3x3 grid`;

export const dp1d2d: LessonDefinition = {
  id: "dp-1d-2d",
  title: "DP: 1D vs 2D Tables",
  area: "DP and recursion",
  prerequisites: ["dp-tabulation"],

  explanation: `A DP's **table shape** follows the number of independent quantities in its **state**. Fibonacci's state is a single index, so it uses a **1D** table. When a subproblem is identified by **two** coordinates — a row and a column, or an item index and a remaining capacity — you need a **2D** table \`dp[i][j]\`. "Unique paths" is the archetype: count the ways to walk an m×n grid from the top-left to the bottom-right moving only **right or down**.

The state is the cell \`(i, j)\`, and \`dp[i][j]\` = the number of distinct paths that reach it. There are only two ways into any interior cell: from **above** \`(i-1, j)\` or from the **left** \`(i, j-1)\`. So the transition is \`dp[i][j] = dp[i-1][j] + dp[i][j-1]\`. The **base cases** are the entire top row and left column, each all \`1\` (only one straight path along an edge). Filling row by row respects dependencies — both cells a transition needs are already computed — and the answer is the bottom-right cell. For a 3×3 grid there are **6** paths.

This is **O(m·n)** time (fill every cell once) and **O(m·n)** space for the grid. A common optimization uses the same insight as Fibonacci's rolling variables: since each row depends only on the **previous row**, you can compress the 2D table to a **single 1D row** updated in place, cutting space to **O(n)**. Recognizing when a problem needs a second dimension — "does my subproblem depend on two changing quantities?" — is the core modeling skill; get the **state definition** right and the transition usually follows.`,

  vocabulary: [
    { term: "State", definition: "The set of quantities that identify a subproblem; its size sets the table's dimensionality." },
    { term: "1D DP", definition: "A table indexed by one quantity (e.g. dp[i])." },
    { term: "2D DP", definition: "A table indexed by two quantities (e.g. dp[i][j]) for two-coordinate subproblems." },
    { term: "Transition", definition: "How a cell is computed from previously filled cells." },
    { term: "Row compression", definition: "Reducing a 2D table to 1D when each row depends only on the previous one." },
  ],

  concepts: {
    purpose:
      "Model subproblems whose identity needs two coordinates, and understand when a 1D table suffices vs when a 2D table is required.",
    operations:
      "Define dp[i][j] for the (i, j) subproblem; seed base cases (edges); fill in dependency order; read the goal cell.",
    uses:
      "Grid path counting/min-cost, edit distance, LCS, 0/1 knapsack (item × capacity), interval DP, matrix-chain problems.",
    tradeoffs:
      "2D tables cost O(m·n) space but capture two-coordinate dependencies; row compression trades that down to O(min(m,n)) when only the previous row is needed.",
    commonMistakes:
      "Modeling a two-coordinate problem with a 1D table (loses information); wrong base-case edges; filling in an order that reads uninitialized cells; returning the wrong corner.",
    edgeCases:
      "A 1×n or m×1 grid has exactly 1 path (all edge cells). The top-left cell is the start (1 way). Empty dimensions are degenerate and should be guarded in real code.",
  },

  complexity: [
    { operation: "unique paths (2D DP)", best: "O(m·n)", average: "O(m·n)", worst: "O(m·n)", space: "O(m·n)", note: "Fill every cell once; O(n) with row compression." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "m", meaning: "the number of rows in the grid" },
      { symbol: "n", meaning: "the number of columns in the grid" },
    ],
    costModel:
      "Filling one cell is O(1) (two lookups and an addition). The nested loops fill each interior cell once.",
    time: {
      bound: "O(m·n)",
      case: "worst",
      explanation:
        "There are m·n cells; the base edges are set in O(m + n) and each of the remaining interior cells is computed once with a constant-time transition. The total is dominated by the m·n cell fills, so time is O(m·n).",
    },
    space: {
      bound: "O(m·n)",
      case: "worst",
      explanation:
        "The 2D table stores m·n values. Because each row depends only on the previous row, the table can be compressed to a single length-n row, reducing space to O(n).",
      inputOutputNote: "The single integer answer is O(1); the O(m·n) space is the table, reducible to O(n).",
    },
    derivation: [
      { lines: [4], description: "Allocate and seed the m×n table (edges are 1).", cost: "O(m·n)", dimension: "space" },
      { lines: [5, 6, 7], description: "Nested loops fill each interior cell once with an O(1) transition.", cost: "O(m·n)", dimension: "time" },
      { lines: [8], description: "Read the goal corner — O(1).", cost: "O(1)", dimension: "time" },
    ],
    assumptions: [
      "Movement is restricted to right and down only.",
      "One addition is O(1) (ignoring big-integer growth).",
      "Row-major fill order computes both dependencies (above and left) before each cell.",
    ],
    tradeoffs:
      "Modeling this as 2D captures the two-coordinate state exactly. Row compression to 1D saves memory (O(n)) at no time cost, at the price of losing the full path-count grid if you need it for reconstruction.",
    counters: [
      { label: "cells filled", definition: "executions of the transition line (line 7)", countLines: [7] },
      { label: "inner-loop iterations", definition: "executions of the inner loop body (line 6)", countLines: [6] },
    ],
    fixedDataNote:
      "For a 3×3 grid, 4 interior cells are filled and the answer is 6. The O(m·n) bound describes how the fill scales with grid size.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: count grid paths moving right/down." },
    { line: 2, executable: false, explanation: "Comment defining dp[i][j]." },
    { line: 3, executable: true, explanation: "Define unique_paths(m, n)." },
    { line: 4, executable: true, explanation: "Allocate an m×n table; top row and left column are all 1 (one straight path)." },
    { line: 5, executable: true, explanation: "Loop over interior rows." },
    { line: 6, executable: true, explanation: "Loop over interior columns." },
    { line: 7, executable: true, explanation: "Transition: paths into (i,j) = paths from above + paths from the left." },
    { line: 8, executable: true, explanation: "The answer is the bottom-right cell." },
    { line: 9, executable: false, explanation: "Blank line." },
    { line: 10, executable: true, explanation: "Print the 6 unique paths across a 3×3 grid." },
  ],

  bindings: [
    {
      variable: "dp",
      model: "dp-table",
      // 2D current cell (i, j) from the interior double loop.
      overlays: [
        { role: "pointer", label: "i", source: "i" },
        { role: "pointer", label: "j", source: "j" },
      ],
    },
  ],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "Why does this problem need a 2D table, and when could a 1D table have sufficed?",
      answer: "A subproblem here is identified by TWO coordinates (row i and column j), so the table needs two dimensions. A 1D table suffices when the state is a single quantity (like Fibonacci's index). Here you could compress to 1D only because each row depends solely on the previous row.",
      explanation: "Dimensionality follows the number of independent quantities in the state. Two coordinates → 2D; the row-only dependency then permits 1D compression.",
    },
  ],

  experiments: [
    "Compress dp to a single 1D row updated in place and confirm the answer stays 6.",
    "Add an obstacle cell (set it to 0 and skip its transition) and see the count change.",
    "Print dp row by row to watch the counts accumulate toward the corner.",
  ],

  exercises: [
    {
      id: "dp12-complete-1",
      kind: "complete-code",
      prompt: "Complete the 2D transition for counting grid paths.",
      starterCode:
        "for i in range(1, m):\n    for j in range(1, n):\n        # TODO: paths from above plus paths from the left\n        pass\nreturn dp[m - 1][n - 1]",
      expected:
        "for i in range(1, m):\n    for j in range(1, n):\n        dp[i][j] = dp[i - 1][j] + dp[i][j - 1]\nreturn dp[m - 1][n - 1]",
      hints: [
        "You can only arrive from above or from the left.",
        "Add those two cell counts.",
        "dp[i][j] = dp[i - 1][j] + dp[i][j - 1]",
      ],
    },
    {
      id: "dp12-choose-1",
      kind: "choose-approach",
      prompt: "A subproblem is 'best result using the first i items with j units of capacity left'. Is this 1D or 2D DP, and why?",
      expected: "2D: the state has two independent quantities (item index i and remaining capacity j), so the table is dp[i][j]. That's exactly the 0/1 knapsack shape.",
      hints: [
        "Count the changing quantities in the state.",
        "There are two: items used and capacity left.",
        "Two quantities → 2D table.",
      ],
    },
    {
      id: "dp12-predict-1",
      kind: "predict-state",
      prompt: "For a 3×3 grid, what are dp[1][1] and dp[2][2] (the answer)?",
      expected: "dp[1][1] = 2 (from above 1 + from left 1); dp[2][2] = 6.",
      hints: [
        "Edges are all 1.",
        "dp[1][1] = dp[0][1] + dp[1][0].",
        "The corner accumulates to 6.",
      ],
    },
  ],

  review: `A DP's **table dimensionality** matches its **state**: one quantity → **1D**, two coordinates → **2D** \`dp[i][j]\`. Unique paths counts grid routes with \`dp[i][j] = dp[i-1][j] + dp[i][j-1]\`, base cases along the top row and left column, giving **6** for a 3×3 grid. It's **O(m·n)** time and space, **compressible to O(n)** because each row depends only on the previous one. The key skill is defining the **state**; the transition follows from "how can I reach this subproblem?"`,

  expectedOutput: "6\n",

  references: [
    {
      url: "https://leetcode.com/problems/unique-paths/editorial/",
      title: "Unique Paths — LeetCode editorial",
      section: "2D dynamic programming; row compression",
      topic: "dp/1d-2d",
      purpose: "Confirm the unique-paths 2D recurrence, the edge base cases, O(m·n) cost, and the 1D row-compression optimization.",
      verifiedClaims: [
        "dp[i][j] = dp[i-1][j] + dp[i][j-1] counts right/down grid paths.",
        "The DP is O(m·n) time and can be compressed to O(n) space.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://en.wikipedia.org/wiki/Dynamic_programming",
      title: "Dynamic programming — Wikipedia",
      section: "State and dimensionality of DP tables",
      topic: "dp/1d-2d",
      purpose: "Cross-check that the DP table's dimensionality reflects the number of state parameters.",
      verifiedClaims: [
        "The DP table is indexed by the parameters that define a subproblem's state.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "e810efcfd028df72",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
