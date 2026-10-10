/**
 * Pattern: Matrix traversal.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "[1, 2, 3, 6, 9, 8, 7, 4, 5]\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# Matrix traversal: walk a 2D grid in a controlled order using shrinking bounds.
# Here: spiral order (right, down, left, up), tightening the boundary each lap.
def spiral(matrix):
    if not matrix:
        return []
    res = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for c in range(left, right + 1):        # top row, left -> right
            res.append(matrix[top][c])
        top += 1
        for r in range(top, bottom + 1):        # right column, top -> bottom
            res.append(matrix[r][right])
        right -= 1
        if top <= bottom:
            for c in range(right, left - 1, -1): # bottom row, right -> left
                res.append(matrix[bottom][c])
            bottom -= 1
        if left <= right:
            for r in range(bottom, top - 1, -1): # left column, bottom -> top
                res.append(matrix[r][left])
            left += 1
    return res

print(spiral([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))`;

export const matrixTraversalPattern: PatternDefinition = {
  id: "matrix-traversal",
  title: "Matrix Traversal",
  category: "Arrays & strings",
  summary:
    "Walk a 2D grid in a deliberate order (spiral, diagonal, in-place rotate/transpose) using boundary or index arithmetic.",

  clues: [
    "The input is a 2D matrix/grid and the OUTPUT ORDER or an in-place transform matters (spiral, diagonal, rotate, transpose, set-zeroes).",
    "You must respect row/column boundaries and often work in place with O(1) extra space.",
    "Phrases like 'spiral order', 'rotate image 90°', 'transpose', 'diagonal traversal', 'set matrix zeroes'.",
  ],

  naiveApproach: `Copying into a new matrix for a rotation/transpose is **O(m·n) extra space**. Ad-hoc index juggling without maintained boundaries is bug-prone — off-by-one errors and re-visiting cells are common when you don't track the shrinking region explicitly.`,

  whyItHelps: `Maintain explicit **boundaries** (top, bottom, left, right) or a clear index mapping, and move in fixed **directions**, tightening the region after each pass. For a spiral: traverse the top row, then the right column, then the bottom row, then the left column, shrinking inward — the boundary checks (\`if top <= bottom\`, \`if left <= right\`) prevent re-walking a row/column in non-square or thin matrices. Every cell is visited exactly once — **O(m·n)** time — and boundary-driven traversal (or index math for rotate/transpose) needs only **O(1)** extra space.`,

  conditions: [
  "Track boundaries or a precise index formula so each cell is visited exactly once.",
  "Add the mid-loop boundary guards for non-square/thin matrices (single row or column).",
  "For in-place rotate/transpose, swap symmetric cells (e.g. transpose then reverse rows) to keep O(1) space.",
  "The spiral input is rectangular; in-place transpose-plus-reverse 90-degree rotation requires a square matrix. Rectangular rotations change shape."
],

  alternatives: [
    "Graph BFS/DFS on the grid — when moves depend on cell CONTENT (islands, shortest path in a maze), not a fixed geometric order.",
    "Dynamic programming on a grid — for path counts / min-cost paths, where you fill cells by dependency, not a spiral.",
    "Prefix sums on a matrix — for repeated submatrix-sum queries.",
  ],

  counterexamples: [
    "'Shortest path through a maze' depends on walls/values — that's grid BFS, not a fixed spiral/diagonal walk.",
    "'Min path sum in a grid' is grid DP, filling cells by dependency order.",
    "Omitting the mid-loop boundary guards double-visits cells in single-row or single-column matrices.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "[1, 2, 3, 6, 9, 8, 7, 4, 5]\n",
  complexityNote:
    "O(m·n) time — each of the m·n cells is visited exactly once. O(1) auxiliary space (just the four boundaries), excluding the output list.",

  complexityExplanation: {
  "scope": "operation",
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
  "costModel": "Four shrinking boundaries (top/bottom/left/right) walk the perimeter each lap; every cell is appended to the result exactly once.",
  "time": {
    "bound": "O(m·n)",
    "case": "worst",
    "explanation": "For a rectangular nonempty m-by-n matrix, each cell is appended once across the four side loops: O(m*n). Empty outer lists and zero-width rectangular matrices return empty output in O(1). Ragged rows are outside this contract."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Only the four integer boundaries and loop indices are kept — O(1) auxiliary, independent of the grid size.",
    "inputOutputNote": "The m×n matrix is the input; the O(m·n) result list is the output (not counted as auxiliary)."
  },
  "derivation": [
    {
      "lines": [
        10,
        11
      ],
      "description": "Walk the top row left→right.",
      "cost": "O(n) per lap",
      "dimension": "time"
    },
    {
      "lines": [
        13,
        14,
        17,
        18,
        21,
        22
      ],
      "description": "Walk the right column, bottom row, left column; every cell appended once.",
      "cost": "O(m·n) total",
      "dimension": "time"
    },
    {
      "lines": [
        7,
        8
      ],
      "description": "Four boundary scalars.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "The matrix is rectangular (all rows length n).",
    "Appending to a list is amortised O(1)."
  ],
  "tradeoffs": "Spiral order needs the boundary bookkeeping but visits each cell once at O(1) extra space; a visited-matrix approach would add O(m·n) space.",
  "counters": [
    {
      "label": "cells visited",
      "definition": "appends across all four sides",
      "countLines": [
        11,
        14,
        18,
        22
      ]
    }
  ],
  "fixedDataNote": "For the 3×3 grid all 9 cells are emitted in spiral order. The O(m·n) bound generalises."
},

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: traverse a grid in a controlled order."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Comment: spiral order with shrinking bounds."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Define spiral(matrix)."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Handle the empty outer list before reading its first row."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Return empty output for the empty matrix."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Output order accumulator."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Top and bottom row boundaries."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Left and right column boundaries."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Continue while the region is non-empty."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Walk the top row left to right."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Collect each cell."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "That row is done; move the top boundary down."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Walk the right column top to bottom."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Collect each cell."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Move the right boundary in."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "Guard: only walk the bottom row if rows remain."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Walk the bottom row right to left."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "Collect each cell."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "Move the bottom boundary up."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Guard: only walk the left column if columns remain."
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "Walk the left column bottom to top."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "Collect each cell."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "Move the left boundary in."
  },
  {
    "line": 24,
    "executable": true,
    "explanation": "Return the spiral order."
  },
  {
    "line": 25,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 26,
    "executable": true,
    "explanation": "Spiral of the 3x3 grid is [1,2,3,6,9,8,7,4,5]."
  }
],

  bindings: [{ variable: "matrix", model: "matrix" }],

  linkedLessons: ["matrix-traversal", "matrix-search"],

  exercises: [
    {
      id: "pat-mt-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Return all elements of an m×n matrix in spiral order.' Which pattern?",
      expected:
        "Matrix traversal with boundary tracking: walk top row, right column, bottom row, left column, shrinking the boundaries each lap (with guards for thin matrices). O(m·n) time, O(1) extra space.",
      correctPatternId: "matrix-traversal",
      hints: [
        "Fixed geometric order over a grid.",
        "Track top/bottom/left/right.",
        "Shrink the region after each side.",
      ],
    },
    {
      id: "pat-mt-choose-1",
      kind: "choose-approach",
      prompt:
        "'Find the shortest path from top-left to bottom-right avoiding blocked cells.' Matrix traversal or grid BFS?",
      expected:
        "Grid BFS: movement depends on cell content (walls) and you need fewest steps, so treat cells as graph nodes and BFS. A fixed spiral/diagonal traversal doesn't account for obstacles or shortest paths.",
      correctPatternId: "matrix-traversal",
      hints: [
        "Moves depend on cell content.",
        "You need shortest path.",
        "That's BFS on the grid.",
      ],
    },
    {
      id: "pat-mt-fix-1",
      kind: "fix-mistake",
      prompt:
        "`spiral(matrix)` returns the cells of `matrix` in clockwise spiral order. This spiral double-visits cells in single-row/column matrices. Add the missing boundary guards.",
      starterCode:
        "def spiral(matrix):\n    if not matrix:\n        return []\n    res = []\n    top, bottom = 0, len(matrix) - 1\n    left, right = 0, len(matrix[0]) - 1\n    while top <= bottom and left <= right:\n        for c in range(left, right + 1):\n            res.append(matrix[top][c])\n        top += 1\n        for r in range(top, bottom + 1):\n            res.append(matrix[r][right])\n        right -= 1\n        for c in range(right, left - 1, -1):\n            res.append(matrix[bottom][c])\n        bottom -= 1\n        for r in range(bottom, top - 1, -1):\n            res.append(matrix[r][left])\n        left += 1\n    return res",
      expected:
        "def spiral(matrix):\n    if not matrix:\n        return []\n    res = []\n    top, bottom = 0, len(matrix) - 1\n    left, right = 0, len(matrix[0]) - 1\n    while top <= bottom and left <= right:\n        for c in range(left, right + 1):\n            res.append(matrix[top][c])\n        top += 1\n        for r in range(top, bottom + 1):\n            res.append(matrix[r][right])\n        right -= 1\n        if top <= bottom:\n            for c in range(right, left - 1, -1):\n                res.append(matrix[bottom][c])\n            bottom -= 1\n        if left <= right:\n            for r in range(bottom, top - 1, -1):\n                res.append(matrix[r][left])\n            left += 1\n    return res",
      hints: [
        "After moving top/right in, the region may be empty in one dimension.",
        "Guard the bottom row and left column passes.",
        "Wrap them in `if top <= bottom` and `if left <= right`.",
      ],
    },
  ],

  references: [
  {
    "url": "https://leetcode.com/problems/spiral-matrix/",
    "title": "Spiral Matrix: original contract",
    "section": "Problem and examples",
    "topic": "patterns/matrix-traversal",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "The input is a rectangular matrix; required traversal follows the perimeter inward. Empty-input handling here is an authored extension."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "a3c74ba54ea38f82",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
