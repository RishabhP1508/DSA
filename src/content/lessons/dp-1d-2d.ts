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
    if m < 0 or n < 0:
        raise ValueError("dimensions must be non-negative")
    if m == 0 or n == 0:
        return 0
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
  prerequisites: [
  "dp-tabulation",
  "matrix-traversal"
],

  explanation: "A DP state identifies a subproblem. Fibonacci uses one index; a grid cell uses two coordinates (row,column). A natural full table stores every coordinate pair as dp[i][j], but state dimensions and storage dimensions are different: control flow can keep a coordinate implicit while reusing a row.\n\nUnique paths counts routes from top-left to bottom-right moving only right or down. An interior cell can be entered only from above or left, so dp[i][j]=dp[i−1][j]+dp[i][j−1]. These last moves are disjoint. In a positive obstacle-free grid, each top-row and left-column count is one. The allocation puts ones everywhere; interior ones are placeholders, and transitions overwrite them. Row-major fill makes both dependencies ready. A 3×3 grid has six paths.\n\nFor positive m,n the full table takes O(mn) scalar work and cells. Row compression uses n cells: before updating j, its value represents the previous row, while j−1 already represents the current row. The outer loop supplies the row coordinate. This preserves the same two-coordinate state with one-row storage. With obstacles, initialize blocked boundaries carefully and propagate zeros beyond them. Zero dimensions return zero paths; negative dimensions raise ValueError. Path counts are growing Python integers, so cell counts differ from bit storage.",

  vocabulary: [
  {
    "term": "State",
    "definition": "The quantities needed to identify a subproblem; storage can reuse cells while preserving this information in control flow."
  },
  {
    "term": "1D DP",
    "definition": "A table indexed by one quantity (e.g. dp[i])."
  },
  {
    "term": "2D DP",
    "definition": "A table indexed by two quantities (e.g. dp[i][j]) for two-coordinate subproblems."
  },
  {
    "term": "Transition",
    "definition": "How a cell is computed from previously filled cells."
  },
  {
    "term": "Row compression",
    "definition": "Reuse one row when the transition retains the required previous-row and current-row dependencies."
  }
],

  concepts: {
  "purpose": "Identify two-coordinate DP states and distinguish a full table from valid compressed storage.",
  "operations": "Define dp[i][j] for the (i, j) subproblem; seed base cases (edges); fill in dependency order; read the goal cell.",
  "uses": "Grid path counting/min-cost, edit distance, LCS, 0/1 knapsack (item × capacity), interval DP, matrix-chain problems.",
  "tradeoffs": "2D tables cost O(m·n) space but capture two-coordinate dependencies; row compression trades that down to O(min(m,n)) when only the previous row is needed.",
  "commonMistakes": "Discarding a state coordinate without preserving its layer in control flow; wrong boundary values or fill order; treating initialized placeholders as completed states.",
  "edgeCases": "One row or one column has one path when nonempty. Zero rows/columns return 0; negative dimensions raise ValueError. Obstacles require different initialization, including blocked boundaries."
},

  complexity: [
  {
    "operation": "unique paths (2D DP)",
    "best": "O(m*n+1)",
    "average": "O(m*n+1)",
    "worst": "O(m*n+1)",
    "space": "O(m*n+1)",
    "note": "Positive dimensions allocate m*n cells and fill (m−1)(n−1) interior states; row compression uses O(n) scalar cells."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "m",
      "meaning": "the number of rows in the grid"
    },
    {
      "symbol": "n",
      "meaning": "the number of columns in the grid"
    }
  ],
  "costModel": "Filling one cell is O(1) (two lookups and an addition). The nested loops fill each interior cell once.",
  "time": {
    "bound": "O(m*n+1)",
    "case": "worst",
    "explanation": "For positive dimensions, allocation initializes all m*n cells; the nested loops compute (m−1)(n−1) interior states. Both are O(m*n). Zero dimensions return in O(1), so an all-input bound is O(m*n+1)."
  },
  "space": {
    "bound": "O(m*n+1)",
    "case": "worst",
    "explanation": "The 2D table stores m·n values. Because each row depends only on the previous row, the table can be compressed to a single length-n row, reducing space to O(n).",
    "inputOutputNote": "The full table uses m*n scalar cells for positive dimensions; empty grids use O(1). Counts are growing Python integers, whose bits are not cell counts."
  },
  "derivation": [
    {
      "lines": [
        8
      ],
      "description": "Allocate and initialize every table cell; only the top row and left column are final base values at this point.",
      "cost": "O(m·n)",
      "dimension": "space"
    },
    {
      "lines": [
        9,
        10,
        11
      ],
      "description": "Nested loops fill each interior cell once with an O(1) transition.",
      "cost": "O(m·n)",
      "dimension": "time"
    },
    {
      "lines": [
        12
      ],
      "description": "Read the goal corner — O(1).",
      "cost": "O(1)",
      "dimension": "time"
    }
  ],
  "assumptions": [
    "Movement is restricted to right and down only.",
    "One addition is O(1) (ignoring big-integer growth).",
    "Row-major fill order computes both dependencies (above and left) before each cell.",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "Row compression reuses storage while preserving the row coordinate in control flow. The full table remains useful for inspecting all intermediate counts, but is not required for the count or for finding an arbitrary obstacle-free path.",
  "counters": [
    {
      "label": "cells filled",
      "definition": "executions of the transition line Recorded line entries at 11 occur before the operation completes.",
      "countLines": [
        11
      ]
    }
  ],
  "fixedDataNote": "For a 3×3 grid, 4 interior cells are filled and the answer is 6. The O(m·n) bound describes how the fill scales with grid size. Function analysis excludes demonstration input literals, imports, printing and tracer storage. A line event shows the next operation before it completes."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: count grid paths moving right/down."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Comment defining dp[i][j]."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Define unique_paths(m, n)."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Check that neither grid dimension is negative."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Reject negative integer dimensions."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Check whether there is no start/destination cell."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "By this app's empty-grid convention, return zero paths."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Allocate m separate rows. Boundary ones are correct; the ones in interior cells are placeholders overwritten by transitions."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Loop over interior rows."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Loop over interior columns."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Transition: paths into (i,j) = paths from above + paths from the left."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "The answer is the bottom-right cell."
  },
  {
    "line": 13,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Print the 6 unique paths across a 3×3 grid."
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
    "prompt": "Why is the natural state two dimensional, and how can the code still use one row of storage?",
    "answer": "A subproblem is identified by (row,column). A full table stores both axes. During row compression, the outer-loop row is implicit and a length-n array keeps the previous-row value and current-row left value needed for each update.",
    "explanation": "State information and table dimensions differ: storage can be reused once old states are no longer needed."
  }
],

  experiments: [
  "Compress dp to a single 1D row updated in place and confirm the answer stays 6.",
  "Add an interior obstacle by writing its count as 0 and skipping its transition. For an obstacle on the top row or left column, initialize and propagate boundary counts carefully: cells beyond a blocked boundary are unreachable.",
  "Print dp row by row to watch the counts accumulate toward the corner."
],

  exercises: [
  {
    "id": "dp12-complete-1",
    "kind": "complete-code",
    "prompt": "Complete `count_paths(m, n)`: number of unique paths in an m×n grid moving only right or down. Practice input contract: positive integer dimensions.",
    "starterCode": "def count_paths(m, n):\n    dp = [[1] * n for _ in range(m)]\n    for i in range(1, m):\n        for j in range(1, n):\n            # TODO: paths from above plus paths from the left\n            pass\n    return dp[m - 1][n - 1]",
    "expected": "def count_paths(m, n):\n    dp = [[1] * n for _ in range(m)]\n    for i in range(1, m):\n        for j in range(1, n):\n            dp[i][j] = dp[i - 1][j] + dp[i][j - 1]\n    return dp[m - 1][n - 1]",
    "hints": [
      "Goal: count_paths(m,n) = unique right/down paths in an m×n grid.",
      "Repeated subproblems are paths-to-each-cell; store them in a 2D table.",
      "Key property: you reach a cell only from above or from the left.",
      "Approach: first row/col are 1; each interior cell sums its top and left neighbours.",
      "Pseudocode: for i in 1..m-1: for j in 1..n-1: dp[i][j]=dp[i-1][j]+dp[i][j-1].",
      "Fix: dp[i][j] = dp[i - 1][j] + dp[i][j - 1]."
    ],
    "tests": "assert count_paths(1, 1) == 1\nassert count_paths(2, 2) == 2\nassert count_paths(3, 3) == 6\nassert count_paths(3, 7) == 28\nassert count_paths(1, 5) == 1, 'single row -> one path'\nprint('OK')"
  },
  {
    "id": "dp12-choose-1",
    "kind": "choose-approach",
    "prompt": "For the state 'best result using the first i items with capacity at most j', describe the natural uncompressed table and explain whether one-row storage is also possible.",
    "expected": "The natural state is (i,j), so a full table is dp[i][j]. One-row storage is also possible: the outer item loop supplies i implicitly, while descending j preserves previous-item states. A one-index table without that layer discipline would lose necessary state.",
    "hints": [
      "Compare two subproblems with equal capacity but different available item prefixes. Could their answers differ?",
      "The full state needs both item-prefix i and capacity j; state coordinates and stored rows are different ideas.",
      "A compressed row must read answers from the previous item layer rather than reuse the current item twice.",
      "Start with dp[i][j]. One-row storage can also work when the outer item loop and update direction preserve those dependencies.",
      "For positive item weights, one-row pseudocode is: for each item, visit capacities from largest down to its weight; update from the smaller-capacity previous-layer entry. This retains the 0/1 choice rule."
    ],
    "recognition": {
      "scenario": "For the state 'best result using the first i items with capacity at most j', describe the natural uncompressed table and explain whether one-row storage is also possible.",
      "approaches": [
        {
          "id": "two-d",
          "label": "Natural full table dp[i][j], with valid row compression",
          "requiredReasonIds": [
            "two-independent-dims"
          ]
        },
        {
          "id": "one-d",
          "label": "Discard item layer with no update-order rule",
          "requiredReasonIds": [],
          "rejectionFeedback": "A one-row array can work when the outer loop and descending update preserve the item layer. Discarding that information without such a rule changes the recurrence."
        }
      ],
      "reasons": [
        {
          "id": "two-independent-dims",
          "text": "The natural state has both item-prefix i and capacity j. Storage may be compressed if control flow preserves item layers and dependencies."
        },
        {
          "id": "state-is-one-var",
          "text": "The subproblem depends on only one varying quantity, so one dimension suffices.",
          "contradictory": true
        },
        {
          "id": "capacity-not-state",
          "text": "Remaining capacity is not part of the state, so it need not index the table.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "two-d"
      ],
      "modelExplanation": "The natural state is (i,j), so a full table is dp[i][j]. One-row storage is also possible: the outer item loop supplies i implicitly, while descending j preserves previous-item states. A one-index table without that layer discipline would lose necessary state."
    }
  },
  {
    "id": "dp12-predict-1",
    "kind": "predict-state",
    "prompt": "For a 3×3 grid, what are dp[1][1] and dp[2][2] (the answer)?",
    "expected": "dp[1][1] = 2 (from above 1 + from left 1); dp[2][2] = 6.",
    "hints": [
      "Edges are all 1.",
      "dp[1][1] = dp[0][1] + dp[1][0].",
      "The corner accumulates to 6."
    ]
  }
],

  review: "Unique paths has the state (row,column), transition above+left, and boundary counts one for a positive obstacle-free grid. A 3×3 grid returns six. The full table uses O(mn) scalar cells/work; row compression uses O(n) cells while the outer loop supplies the row. Zero dimensions return zero, and negative dimensions are rejected. State dimensionality does not force storage dimensionality.",

  expectedOutput: "6\n",

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
    contentHash: "55c2b049bdd0409a",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
