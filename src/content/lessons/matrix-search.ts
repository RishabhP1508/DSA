/**
 * Lesson: Matrix search (Searching). Verified on CPython 3.14.
 * Output: "True\nFalse\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Search a rectangular matrix whose row-major order is globally sorted.
def search_matrix(matrix, target):
    if not matrix or not matrix[0]:
        return False
    rows = len(matrix)
    cols = len(matrix[0])
    lo = 0
    hi = rows * cols - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        # Map the 1D index back to 2D coordinates.
        row, col = mid // cols, mid % cols
        val = matrix[row][col]
        if val == target:
            return True
        elif val < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return False

print(search_matrix([[1, 3, 5], [7, 9, 11], [13, 15, 17]], 9))
print(search_matrix([[1, 3, 5], [7, 9, 11], [13, 15, 17]], 8))`;

export const matrixSearch: LessonDefinition = {
  id: "matrix-search",
  title: "Matrix Search",
  area: "Searching",
  prerequisites: ["binary-search", "matrix-traversal"],

  explanation: "When a matrix is sorted so that each row is increasing **and** the first element of each row is greater than the last of the previous row, the whole grid is really one long sorted sequence laid out row by row. That means you can run **binary search over the m·n cells** as if they were a flat sorted array — in **O(log(m·n))**.\n\nThe trick is index mapping. Treat the cell positions as a 1D range `[0, rows*cols - 1]`. For a flat index `mid`, its 2D coordinates are `row = mid // cols` and `col = mid % cols` (integer division and remainder). You never actually build the flat array — you just translate the midpoint back to `matrix[row][col]` on each step.\n\nBecause `log(m·n) = log m + log n`, one flat query avoids searching every row (`m` binary searches = O(m·log n)) or scanning every cell (O(m·n)); the comparison depends on the dimensions. A related variant handles matrices sorted only within rows and columns (not globally) using a staircase walk from a corner in O(m + n).\n\nThis function assumes a rectangular grid (all rows the same length). Global nondecreasing row-major order is enough: equal values can also cross a row boundary. It does not validate sortedness/rectangularity, since that would cost O(m*n) before each logarithmic query.",

  vocabulary: [
  {
    "term": "Row-major flat index",
    "definition": "Numbering cells 0..m·n-1 across rows; cell (r,c) is r*cols + c."
  },
  {
    "term": "Index mapping",
    "definition": "row = idx // cols, col = idx % cols to convert 1D↔2D."
  },
  {
    "term": "Globally sorted matrix",
    "definition": "Reading across each row and then down to the next gives one nondecreasing sequence; equality is allowed."
  },
  {
    "term": "Staircase search",
    "definition": "An O(m+n) walk from a corner for row/column-sorted (but not globally sorted) matrices."
  }
],

  concepts: {
  "purpose": "Search a sorted matrix in logarithmic time by treating it as a flat sorted array.",
  "operations": "Binary-search a 1D index; map mid to (row, col); compare and halve.",
  "uses": "Membership in sorted grids; a stepping stone to 2D range queries.",
  "tradeoffs": "O(log(m·n)) if globally sorted; O(m+n) staircase if merely row/column-sorted.",
  "commonMistakes": "Swapping // and % in the mapping; using it on a matrix that is not globally sorted; empty-matrix guards missing.",
  "edgeCases": "Empty matrix or empty first row returns False. Single cell. Target smaller/larger than all cells. Ragged rows violate the rectangular-input precondition."
},

  complexity: [
    { operation: "Search sorted matrix", best: "O(1)", average: "O(log(m*n))", worst: "O(log(m*n))", space: "O(1)", note: "Binary search over m*n cells." },
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
  "costModel": "Each step computes a midpoint, maps it to row/column, and performs at most two value comparisons, all O(1), then halves the m*n-cell range.",
  "time": {
    "bound": "O(log(m*n))",
    "case": "worst",
    "explanation": "Binary-search the virtual row-major sequence of m*n cells. Each O(1) iteration halves the candidate range, giving O(log(m*n)) for at least two cells; an empty or singleton query costs O(1). This avoids a separate search of every row or a full scan.",
    "otherCases": [
      {
        "case": "best",
        "bound": "O(1)",
        "note": "The first midpoint cell equals the target."
      }
    ]
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "We never materialize the flat array; only lo, hi, mid and derived coordinates are kept. Constant space.",
    "inputOutputNote": "The m×n matrix is the input, not auxiliary space."
  },
  "derivation": [
    {
      "lines": [
        9
      ],
      "description": "The loop halves the m*n-cell range each step: about log(m*n) iterations.",
      "cost": "O(log(m*n))",
      "dimension": "time"
    },
    {
      "lines": [
        10,
        12,
        13,
        14,
        16
      ],
      "description": "Midpoint, coordinate mapping, cell access and at most two comparisons cost constant time.",
      "cost": "O(1) per iteration",
      "dimension": "time"
    },
    {
      "lines": [
        7,
        8
      ],
      "description": "A constant number of index variables; no flat array built.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "The matrix is rectangular and globally nondecreasing in row-major order.",
    "Cell access is O(1).",
    "All rows have the same width; [] and an empty first row are treated as no cells. Nonempty input is globally nondecreasing in row-major order. Ragged matrices are outside the contract."
  ],
  "tradeoffs": "For matrices sorted only within rows and columns (not globally), use the O(m+n) staircase walk from a corner instead — binary search over cells would be incorrect there.",
  "counters": [
    {
      "label": "iterations",
      "definition": "executions of the loop midpoint (line 10)",
      "countLines": [
        10
      ]
    }
  ],
  "fixedDataNote": "The 3x3 sample finds 9 at the first midpoint; the absent target 8 needs four midpoint checks. The O(log(m*n)) bound describes growth, not an exact sample count. Function analysis excludes demo literal construction and printing."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: this requires global row-major order, which is stronger than row/column sorting."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define search_matrix(matrix, target)."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Guard against an empty matrix or empty first row."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Return False if there is nothing to search."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Number of rows."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Number of columns (assumes rectangular)."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "lo = 0 (first flat index)."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "hi = rows*cols - 1 (last flat index)."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Binary-search the flat index range."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Flat midpoint index."
  },
  {
    "line": 11,
    "executable": false,
    "explanation": "Comment: map the flat index to (row, col)."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Store the midpoint coordinates: quotient gives row, remainder gives column."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Read the cell at those recorded coordinates."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Test whether the midpoint cell equals the target."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Return True."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "Test whether the midpoint value is smaller than the target."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "val < target: search the right half."
  },
  {
    "line": 18,
    "executable": false,
    "explanation": "Otherwise too big."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "val > target: search the left half."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Not found after the range empties: return False."
  },
  {
    "line": 21,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "Search 9 (present) → True."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "Search 8 (absent) → False."
  }
],

  bindings: [
  {
    "variable": "matrix",
    "model": "matrix",
    "overlays": [
      {
        "role": "pointer",
        "label": "row",
        "source": "row"
      },
      {
        "role": "pointer",
        "label": "col",
        "source": "col"
      }
    ]
  }
],

  prediction: [
    { atEventIndex: 0, prompt: "For a flat index mid on a matrix with `cols` columns, how do you get its (row, col)?", answer: "row = mid // cols, col = mid % cols.", explanation: "Row-major layout numbers cells left-to-right, top-to-bottom. Integer division by cols gives the row; the remainder gives the column." },
  ],

  experiments: [
    "Search for a value in the first and last cells to test the boundaries.",
    "Change cols in the mapping to the wrong value and see the search break.",
    "Discuss how a row/column-sorted (but not globally sorted) matrix would need the O(m+n) staircase instead.",
  ],

  exercises: [
  {
    "id": "ms-complete-1",
    "kind": "complete-code",
    "prompt": "Complete the 1D-to-2D index mapping for a flat index `mid`. Assume a nonempty rectangular matrix, cols = len(matrix[0]) > 0 and 0 <= mid < len(matrix)*cols.",
    "starterCode": "def cell(matrix, cols, mid):\n    # TODO: return matrix[row][col] for flat index mid\n    pass",
    "expected": "def cell(matrix, cols, mid):\n    return matrix[mid // cols][mid % cols]",
    "hints": [
      "Goal: map a flat index mid into a 2D cell so a matrix can be searched like a 1D array.",
      "Storing a separate coordinate list is wasteful; the mapping is pure arithmetic.",
      "Key insight: with row-major numbering, dividing by the column count gives the row and the remainder gives the column.",
      "Approach: use integer division and modulo by the number of columns.",
      "Pseudocode: row = mid // cols; col = mid % cols; return matrix[row][col].",
      "Write `return matrix[mid // cols][mid % cols]`."
    ],
    "tests": "m = [[1, 2, 3], [4, 5, 6]]\nassert cell(m, 3, 0) == 1, 'flat 0 -> [0][0]'\nassert cell(m, 3, 4) == 5, 'flat 4 -> [1][1]'\nassert cell(m, 3, 2) == 3, 'flat 2 -> [0][2]'\nassert cell(m, 3, 5) == 6, 'flat 5 -> [1][2] (last cell)'\nprint('OK')"
  },
  {
    "id": "ms-choose-1",
    "kind": "choose-approach",
    "prompt": "A matrix is sorted within each row and each column but NOT globally (row starts don't exceed previous row ends). Can you binary-search the flattened cells? What is the right approach?",
    "expected": "No — flattening isn't globally sorted, so binary search over cells is invalid. Use the staircase walk from the top-right (or bottom-left) corner: move left on too-big, down on too-small — O(m+n).",
    "hints": [
      "Goal: search a matrix sorted within each row and column but NOT globally, deciding if you can binary-search the flattened cells.",
      "The costly misstep is flattening and binary-searching: row-major order isn't globally sorted here, so binary search is simply invalid.",
      "At the top-right of the remaining submatrix, values to the left are no larger and values below are no smaller. A too-big value removes its remaining column; a too-small value removes its remaining row.",
      "Approach: walk a staircase from the top-right (or bottom-left) corner.",
      "Reasoning: moving left on too-big and down on too-small eliminates a row or column each step for O(m+n); flattened binary search would compare against unsorted order and miss the target.",
      "Answer: no — flattening isn't globally sorted, so use the O(m+n) staircase from a corner: left on too-big, down on too-small."
    ],
    "recognition": {
      "scenario": "A matrix is sorted within each row and each column, but NOT globally (a row's first value may be smaller than the previous row's last value). You must search it for a target.",
      "approaches": [
        {
          "id": "staircase",
          "label": "Staircase walk from the top-right (or bottom-left) corner",
          "requiredReasonIds": [
            "corner-prunes-rowcol"
          ]
        },
        {
          "id": "flatten-binary",
          "label": "Flatten the cells and binary-search",
          "requiredReasonIds": [],
          "rejectionFeedback": "Flattening is NOT globally sorted (row starts can be below previous row ends), so binary search over cells can skip the target — it's invalid here."
        }
      ],
      "reasons": [
        {
          "id": "corner-prunes-rowcol",
          "text": "From the top-right, a too-big value rules out that whole column (move left) and a too-small value rules out that whole row (move down), eliminating one row or column each step for O(m+n)."
        },
        {
          "id": "globally-sorted",
          "text": "Reading the cells row by row yields a globally sorted sequence, so binary search applies.",
          "contradictory": true
        },
        {
          "id": "no-structure",
          "text": "The matrix has no useful ordering, so only a full O(m·n) scan works.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "staircase"
      ],
      "modelExplanation": "Flattening isn't globally sorted, so cell binary search is invalid. Use the staircase walk from the top-right (or bottom-left): move left on too-big, down on too-small — O(m+n)."
    }
  }
],

  review: `A **globally sorted matrix** can be searched as one flat sorted array via binary search over its m·n cells, mapping \`mid\` to \`(mid // cols, mid % cols)\` — **O(log(m·n))** time, **O(1)** space, no flat array built. If the matrix is only row/column-sorted (not global), use the **O(m+n) staircase** walk from a corner instead.`,

  expectedOutput: "True\nFalse\n",

  references: [
  {
    "url": "https://leetcode.com/problems/search-a-2d-matrix/description/",
    "title": "matrix reference",
    "section": "Problem statement; row-major ordering requirements",
    "topic": "searching/matrix",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "The flattening problem requires ordered rows with ordered row boundaries."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "The app permits equal row-boundary values: nondecreasing global order still suffices."
    ]
  },
  {
    "url": "https://leetcode.com/problems/search-a-2d-matrix-ii/description/",
    "title": "staircase reference",
    "section": "Problem statement; sorted row and column constraints",
    "topic": "searching/matrix",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Row/column sorting is a weaker input guarantee than global row-major order."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  },
  {
    "url": "https://cp-algorithms.com/num_methods/binary_search.html",
    "title": "binary reference",
    "section": "Search in sorted arrays",
    "topic": "searching/matrix",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Halving requires a sorted search sequence."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "a49e1e80cc8b2c37",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
