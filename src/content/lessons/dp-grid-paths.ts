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
    if not grid:
        return 0
    if any(len(row) != len(grid[0]) for row in grid):
        raise ValueError("grid must be rectangular")
    if not grid[0]:
        return 0
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
  prerequisites: [
  "dp-1d-2d",
  "matrix-traversal"
],

  explanation: "**Minimum path sum** upgrades the \"unique paths\" counting DP into an **optimization** DP. You walk an m×n grid of numbers from the **top-left to the bottom-right**, moving only **right or down**, and you want the path whose **sum of visited cells is smallest**. Same movement rules as counting paths, but now each cell adds a cost and we **minimize** instead of counting.\n\nThe state is again the cell `(i, j)`, and `dp[i][j]` = the **minimum sum** of any valid path from the start to `(i, j)`. Since you can only enter a cell from **above** or from the **left**, the transition takes the cheaper of those two predecessors and adds the current cell's cost: `dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])`. The **base cases** are the edges: the top row can only be reached by moving right, so it's a running left-to-right sum; the left column only by moving down, a running top-to-bottom sum; and `dp[0][0]` is just the start cell. The answer is the bottom-right cell. For the sample grid the cheapest route is 1→3→1→1→1 summing to **7**.\n\nThe instructive contrast with unique paths is the **combiner**: counting uses `+` (add the ways from both predecessors), optimization uses `min` (pick the better predecessor, then add the local cost). The coordinate state and row-by-row evaluation shape are similar, but the edge values also change: path counts use ones, while path costs use cumulative cell sums. The full positive grid still uses O(mn) scalar work/storage. Recognizing this \"grid DP\" template lets you handle min/max path sum, paths with obstacles, and \"collect maximum\" grid problems by swapping the combiner and the base cases.\n\nRight/down movement forms an acyclic dependency graph, so finite negative costs are safe. If arbitrary directions are allowed, this table recurrence no longer describes the graph: BFS gives shortest path only for unweighted/unit-edge cost, Dijkstra needs non-negative edge costs, and negative edges need a suitable method and care about negative cycles. With all empty rows this app returns 0; a nonempty rectangular grid is the intended path domain.",

  vocabulary: [
    { term: "Min path sum", definition: "The smallest total of cell values along a right/down path across the grid." },
    { term: "dp[i][j]", definition: "The minimum path sum from the start to cell (i, j)." },
    { term: "Predecessor cells", definition: "The only cells you can enter (i, j) from: above (i-1, j) and left (i, j-1)." },
    { term: "Edge base cases", definition: "Top row (only-left) and left column (only-above) as running sums." },
    { term: "Combiner", definition: "min for optimization here, vs + for counting in unique paths." },
  ],

  concepts: {
  "purpose": "Solve an optimization over grid paths and see how it mirrors the counting DP with a different combiner.",
  "operations": "Seed dp[0][0] and the edges; fill interior cells as local cost + min(above, left); read the bottom-right cell.",
  "uses": "Min/max path sum, grid cost routing, paths with obstacles, 'collect maximum coins' grid problems, edit-distance-style grids.",
  "tradeoffs": "O(m·n) time and space; row-compressible to O(n); exact and simple, but only for monotone right/down movement (general movement needs Dijkstra/BFS).",
  "commonMistakes": "Forgetting the edge base cases (interior reads uninitialized cells); using + instead of min; allowing moves other than right/down without changing the method; returning the wrong corner.",
  "edgeCases": "Empty grid [] or rectangular empty rows return 0 by convention. Ragged grids raise ValueError, including an empty first row followed by nonempty rows. One row/column accumulates all costs. Finite negative cell costs are valid because right/down movement has no cycles."
},

  complexity: [
  {
    "operation": "min path sum (2D DP)",
    "best": "O(m*n+m+1)",
    "average": "O(m*n+m+1)",
    "worst": "O(m*n+m+1)",
    "space": "O(m*n+1)",
    "note": "Includes rectangular validation and allocation; empty rows have zero cells."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "m",
      "meaning": "the number of rows"
    },
    {
      "symbol": "n",
      "meaning": "the number of columns"
    }
  ],
  "costModel": "Filling one cell is O(1) (a min of two cells plus an addition). Every cell is filled once. Rectangular validation uses O(m) length checks. The table initialization also costs O(m*n) time.",
  "time": {
    "bound": "O(m*n+m+1)",
    "case": "worst",
    "explanation": "For a positive rectangular m×n grid, allocation initializes m*n cells; initialization and transitions write each cost once. Rectangular validation scans m row lengths. Empty grids return in O(1); all-input bound O(m*n+m+1)."
  },
  "space": {
    "bound": "O(m*n+1)",
    "case": "worst",
    "explanation": "The dp grid stores m·n values. Because each row depends only on the previous row (and the cell to its left), it compresses to a single length-n row for O(n) space.",
    "inputOutputNote": "The single minimum-sum integer is O(1); the O(m·n) space is the table, reducible to O(n)."
  },
  "derivation": [
    {
      "lines": [
        11,
        12
      ],
      "description": "Allocate the table and seed the start cell.",
      "cost": "O(m·n)",
      "dimension": "space"
    },
    {
      "lines": [
        13,
        14,
        15,
        16
      ],
      "description": "Fill the two edges as running sums (base cases).",
      "cost": "O(m + n)",
      "dimension": "time"
    },
    {
      "lines": [
        17,
        18,
        19
      ],
      "description": "Fill each interior cell once as cost + min(above, left).",
      "cost": "O(m·n)",
      "dimension": "time"
    }
  ],
  "assumptions": [
    "Movement is right or down only.",
    "min and addition are O(1).",
    "Row-major fill computes both predecessors before each cell.",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "Grid DP is O(m·n) and simple for monotone movement; if arbitrary movement (up/left too) were allowed, this DP would be invalid and you'd need Dijkstra/BFS on a weighted grid. Row compression saves memory but loses the full table for path reconstruction.",
  "counters": [
    {
      "label": "interior cells filled",
      "definition": "executions of the interior transition Recorded line entries at 17 occur before the operation completes.",
      "countLines": [
        19
      ]
    }
  ],
  "fixedDataNote": "For the 3×3 sample, 4 interior cells are filled and the minimum sum is 7. The O(m·n) bound describes how the fill scales with grid size. Function analysis excludes demonstration input literals, imports, printing and tracer storage. A line event shows the next operation before it completes."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: right/down movement, minimize the total."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Comment continued."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Define min_path_sum(grid)."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Test whether the supplied grid has no cells."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "By the app's empty-grid convention, return zero."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Check that all nonempty-grid rows have the same width."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Reject a ragged grid."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "All rows have equal width; check whether that width is zero."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Return zero when the rectangular grid has no cells."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "m rows, n columns."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Allocate the dp grid."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Base: the start cell's cost is itself."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Fill the top row..."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "...each top cell is reachable only from its left neighbour."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Fill the left column..."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "...each left cell is reachable only from above."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Loop interior rows."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "Loop interior columns."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "Transition: local cost plus the cheaper of the cell above or to the left."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "The answer is the bottom-right cell."
  },
  {
    "line": 21,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "Minimum path sum of the sample grid is 7."
  }
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
    "atEventIndex": 0,
    "prompt": "How does this DP differ from the unique-paths counting DP, structurally?",
    "answer": "The coordinate state and row-major fill pattern remain, but path counting uses above+left with boundary ones, while minimum path sum uses cellCost+min(above,left) with cumulative-cost boundaries.",
    "explanation": "Changing a counting DP into optimization requires a correct new recurrence and base values, not only swapping an operator."
  }
],

  experiments: [
    "Print dp row by row to watch the minimum sums accumulate toward the corner.",
    "Change min to max to find the most expensive path instead.",
    "Compress dp to a single 1D row and confirm the answer stays 7.",
  ],

  exercises: [
  {
    "id": "dpgp-complete-1",
    "kind": "complete-code",
    "prompt": "Complete `min_path_sum(grid)`: minimum sum path from top-left to bottom-right moving right/down. Assume a nonempty rectangular grid of finite integer costs.",
    "starterCode": "def min_path_sum(grid):\n    m, n = len(grid), len(grid[0])\n    dp = [[0] * n for _ in range(m)]\n    dp[0][0] = grid[0][0]\n    for j in range(1, n):\n        dp[0][j] = dp[0][j - 1] + grid[0][j]\n    for i in range(1, m):\n        dp[i][0] = dp[i - 1][0] + grid[i][0]\n    for i in range(1, m):\n        for j in range(1, n):\n            # TODO: local cost + cheaper predecessor\n            pass\n    return dp[m - 1][n - 1]",
    "expected": "def min_path_sum(grid):\n    m, n = len(grid), len(grid[0])\n    dp = [[0] * n for _ in range(m)]\n    dp[0][0] = grid[0][0]\n    for j in range(1, n):\n        dp[0][j] = dp[0][j - 1] + grid[0][j]\n    for i in range(1, m):\n        dp[i][0] = dp[i - 1][0] + grid[i][0]\n    for i in range(1, m):\n        for j in range(1, n):\n            dp[i][j] = grid[i][j] + min(dp[i - 1][j], dp[i][j - 1])\n    return dp[m - 1][n - 1]",
    "hints": [
      "Goal: min_path_sum(grid) = cheapest right/down path cost.",
      "Repeated subproblems are cheapest-cost-to-each-cell; store in a table.",
      "Key property: you arrive from above or from the left, so take the cheaper predecessor.",
      "Approach: seed first row/col cumulatively, then fill interior cells.",
      "Pseudocode: dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).",
      "Fix: dp[i][j] = grid[i][j] + min(dp[i - 1][j], dp[i][j - 1])."
    ],
    "tests": "assert min_path_sum([[1,3,1],[1,5,1],[4,2,1]]) == 7, 'path 1->3->1->1->1'\nassert min_path_sum([[1,2,3],[4,5,6]]) == 12\nassert min_path_sum([[5]]) == 5\nassert min_path_sum([[1,2,5],[3,2,1]]) == 6\nprint('OK')"
  },
  {
    "id": "dpgp-fix-1",
    "kind": "fix-mistake",
    "prompt": "`min_path_sum(grid)` returns the minimum sum path from top-left to bottom-right (moving right/down). This forgets the edge base cases, so interior cells read zeros. Add the top-row and left-column fills. Assume a nonempty rectangular grid of finite integer costs.",
    "starterCode": "def min_path_sum(grid):\n    m, n = len(grid), len(grid[0])\n    dp = [[0] * n for _ in range(m)]\n    dp[0][0] = grid[0][0]\n    # bug: top row and left column not initialized\n    for i in range(1, m):\n        for j in range(1, n):\n            dp[i][j] = grid[i][j] + min(dp[i - 1][j], dp[i][j - 1])\n    return dp[m - 1][n - 1]",
    "expected": "def min_path_sum(grid):\n    m, n = len(grid), len(grid[0])\n    dp = [[0] * n for _ in range(m)]\n    dp[0][0] = grid[0][0]\n    for j in range(1, n):\n        dp[0][j] = dp[0][j - 1] + grid[0][j]\n    for i in range(1, m):\n        dp[i][0] = dp[i - 1][0] + grid[i][0]\n    for i in range(1, m):\n        for j in range(1, n):\n            dp[i][j] = grid[i][j] + min(dp[i - 1][j], dp[i][j - 1])\n    return dp[m - 1][n - 1]",
    "hints": [
      "Goal: fix the grid-path DP by filling the top-row and left-column base cases before the interior.",
      "The bug leaves the edges as zeros, so interior cells read wrong predecessor values.",
      "Key insight: edge cells have only one predecessor — the top row sums leftward, the left column sums downward.",
      "Approach: initialize dp[0][0], then fill the whole first row and first column before the double loop.",
      "Pseudocode: dp[0][0]=grid[0][0]; fill row 0 from the left; fill column 0 from the top; then fill interior with grid+min(up,left).",
      "Add the top-row fill `dp[0][j]=dp[0][j-1]+grid[0][j]` and the left-column fill `dp[i][0]=dp[i-1][0]+grid[i][0]` before the interior loops."
    ],
    "tests": "assert min_path_sum([[1,3,1],[1,5,1],[4,2,1]]) == 7, 'path 1->3->1->1->1'\nassert min_path_sum([[1,2,3],[4,5,6]]) == 12\nassert min_path_sum([[5]]) == 5\nassert min_path_sum([[1,2,5],[3,2,1]]) == 6\nassert min_path_sum([[1,2],[1,1]]) == 3\nprint('OK')"
  },
  {
    "id": "dpgp-predict-1",
    "kind": "predict-state",
    "prompt": "For [[1,3,1],[1,5,1],[4,2,1]], what path achieves the minimum and what is dp[2][2]?",
    "expected": "Path 1→3→1→1→1 (right, right, down, down) sums to 7; dp[2][2] = 7.",
    "hints": [
      "Start at 1, move to keep costs low.",
      "The top row then down the right side.",
      "Total is 7."
    ]
  }
],

  review: "Minimum path sum uses dp[i][j]=grid[i][j]+min(above,left), with cumulative edge costs. The state/fill shape resembles path counting, but both recurrence and boundary values differ. Right/down dependencies are acyclic, so finite negative costs are valid. Empty grids return zero; ragged grids are rejected. Positive m×n grids use O(mn) scalar work/cells; the sample optimum is seven.",

  expectedOutput: "7\n",

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
    "url": "https://leetcode.com/problems/minimum-path-sum/description/",
    "title": "LeetCode: Minimum Path Sum",
    "section": "Problem definition, examples and constraints",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "The path moves right or down and sums visited cell costs; sample optimum is 7."
    ],
    "conventions": [
      "Original inputs are nonempty and non-negative. App permits negative finite integer costs in this acyclic grid and extends empty input to zero."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://faculty.cc.gatech.edu/~ladha/algo/L9.pdf",
    "title": "Georgia Tech CS3510 lecture 9",
    "section": "House robber, grid paths and DP evaluation",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "House-robber take/skip prefix recurrence yields 12 on [2,7,9,3,1]; right/down path counts combine above and left.",
      "Obstacle boundaries need propagation, not an interior-only skip rule."
    ],
    "conventions": [
      "App stairs allow 1 or 2 steps; source includes a 1/2/3 variant. Source grid prose uses start count 1; its conflicting dp[0][0]=0 pseudocode is not adopted."
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
    contentHash: "4cd4e3652f3802d6",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
