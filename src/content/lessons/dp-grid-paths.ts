/**
 * Lesson: DP worked example — grid paths (minimum path sum) (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "7\n". Uses the dp-table visualizer.
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Minimum path sum: move only RIGHT or DOWN from top-left to bottom-right,
# minimizing the total of the numbers on the path.
def min_path_sum(grid):
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = grid[0][0]
    for j in range(1, n):                     # first row: only from the left
        dp[0][j] = dp[0][j - 1] + grid[0][j]
    for i in range(1, m):                     # first column: only from above
        dp[i][0] = dp[i - 1][0] + grid[i][0]
    for i in range(1, m):
        for j in range(1, n):                 # interior: cheaper of above/left
            dp[i][j] = grid[i][j] + min(dp[i - 1][j], dp[i][j - 1])
    return dp[m - 1][n - 1]

print(min_path_sum([[1, 3, 1], [1, 5, 1], [4, 2, 1]]))   # 1->3->1->1->1 = 7`;

export const dpGridPaths: LessonDefinition = {
  id: "dp-grid-paths",
  title: "DP Example: Grid Paths (Min Path Sum)",
  area: "DP and recursion",
  prerequisites: ["dp-1d-2d"],

  explanation: `**Minimum path sum** upgrades the "unique paths" counting DP into an **optimization** DP. You walk an m×n grid of numbers from the **top-left to the bottom-right**, moving only **right or down**, and you want the path whose **sum of visited cells is smallest**. Same movement rules as counting paths, but now each cell adds a cost and we **minimize** instead of counting.

The state is again the cell \`(i, j)\`, and \`dp[i][j]\` = the **minimum sum** of any valid path from the start to \`(i, j)\`. Since you can only enter a cell from **above** or from the **left**, the transition takes the cheaper of those two predecessors and adds the current cell's cost: \`dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])\`. The **base cases** are the edges: the top row can only be reached by moving right, so it's a running left-to-right sum; the left column only by moving down, a running top-to-bottom sum; and \`dp[0][0]\` is just the start cell. The answer is the bottom-right cell. For the sample grid the cheapest route is 1→3→1→1→1 summing to **7**.

The instructive contrast with unique paths is the **combiner**: counting uses \`+\` (add the ways from both predecessors), optimization uses \`min\` (pick the better predecessor, then add the local cost). Everything else — 2D state, edge base cases, row-by-row fill order, and the O(m·n) time / O(m·n) space (compressible to O(n) since each row needs only the previous) — is identical. Recognizing this "grid DP" template lets you handle min/max path sum, paths with obstacles, and "collect maximum" grid problems by swapping the combiner and the base cases.`,

  vocabulary: [
    { term: "Min path sum", definition: "The smallest total of cell values along a right/down path across the grid." },
    { term: "dp[i][j]", definition: "The minimum path sum from the start to cell (i, j)." },
    { term: "Predecessor cells", definition: "The only cells you can enter (i, j) from: above (i-1, j) and left (i, j-1)." },
    { term: "Edge base cases", definition: "Top row (only-left) and left column (only-above) as running sums." },
    { term: "Combiner", definition: "min for optimization here, vs + for counting in unique paths." },
  ],

  concepts: {
    purpose:
      "Solve an optimization over grid paths and see how it mirrors the counting DP with a different combiner.",
    operations:
      "Seed dp[0][0] and the edges; fill interior cells as local cost + min(above, left); read the bottom-right cell.",
    uses:
      "Min/max path sum, grid cost routing, paths with obstacles, 'collect maximum coins' grid problems, edit-distance-style grids.",
    tradeoffs:
      "O(m·n) time and space; row-compressible to O(n); exact and simple, but only for monotone right/down movement (general movement needs Dijkstra/BFS).",
    commonMistakes:
      "Forgetting the edge base cases (interior reads uninitialized cells); using + instead of min; allowing moves other than right/down without changing the method; returning the wrong corner.",
    edgeCases:
      "1×n or m×1 grid: the single row/column running sum is the answer. Single cell: its own value. Negative values still work with min, but movement must stay right/down.",
  },

  complexity: [
    { operation: "min path sum (2D DP)", best: "O(m·n)", average: "O(m·n)", worst: "O(m·n)", space: "O(m·n)", note: "Fill every cell once; O(n) with row compression." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "m", meaning: "the number of rows" },
      { symbol: "n", meaning: "the number of columns" },
    ],
    costModel: "Filling one cell is O(1) (a min of two cells plus an addition). Every cell is filled once.",
    time: {
      bound: "O(m·n)",
      case: "worst",
      explanation:
        "There are m·n cells; the edges are filled in O(m + n) and each interior cell in O(1). The total is dominated by the m·n cell fills, so time is O(m·n).",
    },
    space: {
      bound: "O(m·n)",
      case: "worst",
      explanation:
        "The dp grid stores m·n values. Because each row depends only on the previous row (and the cell to its left), it compresses to a single length-n row for O(n) space.",
      inputOutputNote: "The single minimum-sum integer is O(1); the O(m·n) space is the table, reducible to O(n).",
    },
    derivation: [
      { lines: [5, 6], description: "Allocate the table and seed the start cell.", cost: "O(m·n)", dimension: "space" },
      { lines: [7, 8, 9, 10], description: "Fill the two edges as running sums (base cases).", cost: "O(m + n)", dimension: "time" },
      { lines: [11, 12, 13], description: "Fill each interior cell once as cost + min(above, left).", cost: "O(m·n)", dimension: "time" },
    ],
    assumptions: [
      "Movement is right or down only.",
      "min and addition are O(1).",
      "Row-major fill computes both predecessors before each cell.",
    ],
    tradeoffs:
      "Grid DP is O(m·n) and simple for monotone movement; if arbitrary movement (up/left too) were allowed, this DP would be invalid and you'd need Dijkstra/BFS on a weighted grid. Row compression saves memory but loses the full table for path reconstruction.",
    counters: [
      { label: "interior cells filled", definition: "executions of the interior transition (line 13)", countLines: [13] },
      { label: "inner-loop iterations", definition: "executions of the inner loop body (line 12)", countLines: [12] },
    ],
    fixedDataNote:
      "For the 3×3 sample, 4 interior cells are filled and the minimum sum is 7. The O(m·n) bound describes how the fill scales with grid size.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: right/down movement, minimize the total." },
    { line: 2, executable: false, explanation: "Comment continued." },
    { line: 3, executable: true, explanation: "Define min_path_sum(grid)." },
    { line: 4, executable: true, explanation: "m rows, n columns." },
    { line: 5, executable: true, explanation: "Allocate the dp grid." },
    { line: 6, executable: true, explanation: "Base: the start cell's cost is itself." },
    { line: 7, executable: true, explanation: "Fill the top row..." },
    { line: 8, executable: true, explanation: "...each top cell is reachable only from its left neighbour." },
    { line: 9, executable: true, explanation: "Fill the left column..." },
    { line: 10, executable: true, explanation: "...each left cell is reachable only from above." },
    { line: 11, executable: true, explanation: "Loop interior rows." },
    { line: 12, executable: true, explanation: "Loop interior columns." },
    { line: 13, executable: true, explanation: "Transition: local cost plus the cheaper of the cell above or to the left." },
    { line: 14, executable: true, explanation: "The answer is the bottom-right cell." },
    { line: 15, executable: false, explanation: "Blank line." },
    { line: 16, executable: true, explanation: "Minimum path sum of the sample grid is 7." },
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
      prompt: "How does this DP differ from the unique-paths counting DP, structurally?",
      answer: "Only the combiner changes: counting adds the ways from both predecessors (dp[i-1][j] + dp[i][j-1]); minimizing takes the cheaper predecessor and adds the local cost (grid[i][j] + min(dp[i-1][j], dp[i][j-1])). State, base edges, and fill order are the same.",
      explanation: "The grid-DP template is shared; swapping + for min turns a counting problem into an optimization problem.",
    },
  ],

  experiments: [
    "Print dp row by row to watch the minimum sums accumulate toward the corner.",
    "Change min to max to find the most expensive path instead.",
    "Compress dp to a single 1D row and confirm the answer stays 7.",
  ],

  exercises: [
    {
      id: "dpgp-complete-1",
      kind: "complete-code",
      prompt: "Complete the interior transition for minimum path sum.",
      starterCode:
        "for i in range(1, m):\n    for j in range(1, n):\n        # TODO: local cost + cheaper predecessor\n        pass\nreturn dp[m - 1][n - 1]",
      expected:
        "for i in range(1, m):\n    for j in range(1, n):\n        dp[i][j] = grid[i][j] + min(dp[i - 1][j], dp[i][j - 1])\nreturn dp[m - 1][n - 1]",
      hints: [
        "You enter from above or from the left.",
        "Pick the cheaper and add this cell's value.",
        "dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])",
      ],
    },
    {
      id: "dpgp-fix-1",
      kind: "fix-mistake",
      prompt: "This forgets the edge base cases, so interior cells read zeros. Add the top-row and left-column fills.",
      starterCode:
        "dp[0][0] = grid[0][0]\n# bug: top row and left column not initialized\nfor i in range(1, m):\n    for j in range(1, n):\n        dp[i][j] = grid[i][j] + min(dp[i - 1][j], dp[i][j - 1])",
      expected:
        "dp[0][0] = grid[0][0]\nfor j in range(1, n):\n    dp[0][j] = dp[0][j - 1] + grid[0][j]\nfor i in range(1, m):\n    dp[i][0] = dp[i - 1][0] + grid[i][0]\nfor i in range(1, m):\n    for j in range(1, n):\n        dp[i][j] = grid[i][j] + min(dp[i - 1][j], dp[i][j - 1])",
      hints: [
        "Edge cells have only one predecessor.",
        "Top row sums leftward; left column sums downward.",
        "Initialize both edges before the interior loops.",
      ],
    },
    {
      id: "dpgp-predict-1",
      kind: "predict-state",
      prompt: "For [[1,3,1],[1,5,1],[4,2,1]], what path achieves the minimum and what is dp[2][2]?",
      expected: "Path 1→3→1→1→1 (right, right, down, down) sums to 7; dp[2][2] = 7.",
      hints: [
        "Start at 1, move to keep costs low.",
        "The top row then down the right side.",
        "Total is 7.",
      ],
    },
  ],

  review: `**Minimum path sum** is grid DP for **optimization**: \`dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])\`, with the top row and left column as running-sum **base cases**, moving only **right/down**. It differs from unique-paths counting only in the **combiner** (\`min\` vs \`+\`). It is **O(m·n)** time and space, **compressible to O(n)**. This shared template covers min/max path sum, obstacle grids, and collect-maximum problems. The sample's minimum is **7**.`,

  expectedOutput: "7\n",

  references: [
    {
      url: "https://leetcode.com/problems/minimum-path-sum/editorial/",
      title: "Minimum Path Sum — LeetCode editorial",
      section: "2D DP with min combiner; edge base cases",
      topic: "dp/grid-paths",
      purpose: "Confirm the min-path-sum recurrence, the edge base cases, and O(m·n) time/space with O(n) compression.",
      verifiedClaims: [
        "dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]) for right/down movement.",
        "The DP is O(m·n) time and can be compressed to O(n) space.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://algs4.cs.princeton.edu/home/",
      title: "Algorithms, 4th Edition (Princeton) — dynamic programming on grids/DAGs",
      section: "Shortest paths in DAGs (monotone grid)",
      topic: "dp/grid-paths",
      purpose: "Cross-check that monotone right/down grid optimization is a DAG shortest-path solvable by DP in cell order.",
      verifiedClaims: [
        "A grid with monotone (right/down) moves forms a DAG whose optimal path is found by DP in topological (row/column) order.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "4f7e05cac4c48fd1",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
