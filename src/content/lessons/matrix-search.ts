/**
 * Lesson: Matrix search (Searching). Verified on CPython 3.14.
 * Output: "True\nFalse\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Search a row-and-column-sorted matrix as if it were one sorted array.
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
        val = matrix[mid // cols][mid % cols]
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

  explanation: `When a matrix is sorted so that each row is increasing **and** the first element of each row is greater than the last of the previous row, the whole grid is really one long sorted sequence laid out row by row. That means you can run **binary search over the m·n cells** as if they were a flat sorted array — in **O(log(m·n))**.

The trick is index mapping. Treat the cell positions as a 1D range \`[0, rows*cols - 1]\`. For a flat index \`mid\`, its 2D coordinates are \`row = mid // cols\` and \`col = mid % cols\` (integer division and remainder). You never actually build the flat array — you just translate the midpoint back to \`matrix[row][col]\` on each step.

Because \`log(m·n) = log m + log n\`, this is far faster than searching each row separately (\`m\` binary searches = O(m·log n)) or scanning every cell (O(m·n)). A related variant handles matrices sorted only within rows and columns (not globally) using a staircase walk from a corner in O(m + n).`,

  vocabulary: [
    { term: "Row-major flat index", definition: "Numbering cells 0..m·n-1 across rows; cell (r,c) is r*cols + c." },
    { term: "Index mapping", definition: "row = idx // cols, col = idx % cols to convert 1D↔2D." },
    { term: "Globally sorted matrix", definition: "Rows increasing and each row starts above the previous row's end." },
    { term: "Staircase search", definition: "An O(m+n) walk from a corner for row/column-sorted (but not globally sorted) matrices." },
  ],

  concepts: {
    purpose: "Search a sorted matrix in logarithmic time by treating it as a flat sorted array.",
    operations: "Binary-search a 1D index; map mid to (row, col); compare and halve.",
    uses: "Membership in sorted grids; a stepping stone to 2D range queries.",
    tradeoffs: "O(log(m·n)) if globally sorted; only O(m+n) staircase if merely row/column-sorted.",
    commonMistakes: "Swapping // and % in the mapping; using it on a matrix that is not globally sorted; empty-matrix guards missing.",
    edgeCases: "Empty matrix or empty first row returns False. Single cell. Target smaller/larger than all cells.",
  },

  complexity: [
    { operation: "Search sorted matrix", best: "O(1)", average: "O(log(m*n))", worst: "O(log(m*n))", space: "O(1)", note: "Binary search over m*n cells." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "m", meaning: "the number of rows" },
      { symbol: "n", meaning: "the number of columns" },
    ],
    costModel: "Each step does one index-mapping (a divide and a modulo) and one comparison — O(1) — and halves the range of the m·n cells.",
    time: {
      bound: "O(log(m*n))",
      case: "worst",
      explanation: "We binary-search a virtual sorted array of m·n cells, so the range halves each step: about log₂(m·n) iterations, each O(1). Since log(m·n) = log m + log n, this beats searching each row separately (O(m·log n)) and scanning all cells (O(m·n)).",
      otherCases: [
        { case: "best", bound: "O(1)", note: "The first midpoint cell equals the target." },
      ],
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "We never materialize the flat array; only lo, hi, mid and derived coordinates are kept. Constant space.",
      inputOutputNote: "The m×n matrix is the input, not auxiliary space.",
    },
    derivation: [
      { lines: [9], description: "The loop halves the m*n-cell range each step: about log(m*n) iterations.", cost: "O(log(m*n))", dimension: "time" },
      { lines: [10, 12], description: "Each step: midpoint, index mapping (// and %), and one comparison — O(1).", cost: "O(1)", dimension: "time" },
      { lines: [7, 8], description: "A constant number of index variables; no flat array built.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["The matrix is GLOBALLY sorted (rows increasing and row starts above previous row's end).", "Cell access is O(1)."],
    tradeoffs: "For matrices sorted only within rows and columns (not globally), use the O(m+n) staircase walk from a corner instead — binary search over cells would be incorrect there.",
    counters: [{ label: "iterations", definition: "executions of the loop midpoint (line 10)", countLines: [10] }],
    fixedDataNote: "This run searches a 3×3 matrix (9 cells) in ~3 iterations. The O(log(m·n)) bound generalises to any m and n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: treat the sorted matrix as one flat array." },
    { line: 2, executable: true, explanation: "Define search_matrix(matrix, target)." },
    { line: 3, executable: true, explanation: "Guard against an empty matrix or empty first row." },
    { line: 4, executable: true, explanation: "Return False if there is nothing to search." },
    { line: 5, executable: true, explanation: "Number of rows." },
    { line: 6, executable: true, explanation: "Number of columns (assumes rectangular)." },
    { line: 7, executable: true, explanation: "lo = 0 (first flat index)." },
    { line: 8, executable: true, explanation: "hi = rows*cols - 1 (last flat index)." },
    { line: 9, executable: true, explanation: "Binary-search the flat index range." },
    { line: 10, executable: true, explanation: "Flat midpoint index." },
    { line: 11, executable: false, explanation: "Comment: map the flat index to (row, col)." },
    { line: 12, executable: true, explanation: "val = matrix[mid // cols][mid % cols] — the cell at the midpoint." },
    { line: 13, executable: true, explanation: "Found the target." },
    { line: 14, executable: true, explanation: "Return True." },
    { line: 15, executable: false, explanation: "Comment/branch: too small." },
    { line: 16, executable: true, explanation: "val < target: search the right half." },
    { line: 17, executable: false, explanation: "Otherwise too big." },
    { line: 18, executable: true, explanation: "val > target: search the left half." },
    { line: 19, executable: true, explanation: "Not found after the range empties: return False." },
    { line: 20, executable: false, explanation: "Blank line." },
    { line: 21, executable: true, explanation: "Search 9 (present) → True." },
    { line: 22, executable: true, explanation: "Search 8 (absent) → False." },
  ],

  bindings: [{ variable: "matrix", model: "matrix" }],

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
      id: "ms-complete-1",
      kind: "complete-code",
      prompt: "Complete the 1D-to-2D index mapping for a flat index `mid`.",
      starterCode: "def cell(matrix, cols, mid):\n    # TODO: return matrix[row][col] for flat index mid\n    pass",
      expected: "def cell(matrix, cols, mid):\n    return matrix[mid // cols][mid % cols]",
      hints: ["Row-major: cells numbered across rows.", "Divide by cols for the row, mod for the column.", "matrix[mid // cols][mid % cols]"],
    },
    {
      id: "ms-choose-1",
      kind: "choose-approach",
      prompt: "A matrix is sorted within each row and each column but NOT globally (row starts don't exceed previous row ends). Can you binary-search the flattened cells? What is the right approach?",
      expected: "No — flattening isn't globally sorted, so binary search over cells is invalid. Use the staircase walk from the top-right (or bottom-left) corner: move left on too-big, down on too-small — O(m+n).",
      hints: ["Is the flattened order sorted here?", "No, so cell-index binary search fails.", "Use the O(m+n) staircase from a corner."],
    },
  ],

  review: `A **globally sorted matrix** can be searched as one flat sorted array via binary search over its m·n cells, mapping \`mid\` to \`(mid // cols, mid % cols)\` — **O(log(m·n))** time, **O(1)** space, no flat array built. If the matrix is only row/column-sorted (not global), use the **O(m+n) staircase** walk from a corner instead.`,

  expectedOutput: "True\nFalse\n",

  references: [
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Binary Search — Search a 2D Matrix",
      topic: "searching/matrix",
      purpose: "Confirm treating a globally sorted matrix as a flat array for O(log(m*n)) binary search.",
      verifiedClaims: ["A row-major globally sorted matrix supports O(log(m*n)) binary search via index mapping"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://www.geeksforgeeks.org/search-in-row-wise-and-column-wise-sorted-matrix/",
      title: "Search in a row-wise and column-wise sorted matrix — GeeksforGeeks",
      section: "Staircase search",
      topic: "searching/matrix",
      purpose: "Cross-check the O(m+n) staircase approach for matrices sorted only per row/column.",
      verifiedClaims: ["Row/column-sorted (not global) matrices are searched in O(m+n) from a corner"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "1344987a074e5df0",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
