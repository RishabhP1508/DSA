/**
 * Lesson: Matrix traversal (Arrays). Verified on CPython 3.14.
 * Output: "1 2 3 4 5 6 \n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# A matrix is a list of rows; each row is a list of values.
grid = [[1, 2, 3], [4, 5, 6]]
# Visit row by row (outer = rows), column by column (inner = columns).
for r in range(len(grid)):
    for c in range(len(grid[r])):
        print(grid[r][c], end=" ")
print()`;

export const matrixTraversal: LessonDefinition = {
  id: "matrix-traversal",
  title: "Matrix Traversal",
  area: "Arrays",
  prerequisites: ["array-traversal"],

  explanation: `A **matrix** (2D grid) is stored as a **list of rows**, where each row is itself a list. You reach a cell with two indices: \`grid[r][c]\` is row \`r\`, column \`c\`. Traversing it means two **nested loops** — the outer over rows, the inner over columns — visiting every cell exactly once, in **row-major** order.

If the grid has \`R\` rows and \`C\` columns, there are \`R·C\` cells, so a full traversal is **O(R·C)**. This is the honest way to state it: the two loops are nested, so their counts *multiply*. (Contrast with two *sequential* loops, which add.) When the grid is square (\`R = C = n\`) this is \`O(n²)\`, but for a general grid, name both dimensions.

Row/column pointers in the visualization highlight the current cell so you can see the row-major sweep. This nested-loop shape underlies grid BFS/DFS, dynamic-programming tables, and image processing.`,

  vocabulary: [
    { term: "Matrix / grid", definition: "A 2D array stored as a list of row-lists." },
    { term: "Row-major order", definition: "Visiting all of row 0, then row 1, and so on." },
    { term: "grid[r][c]", definition: "The cell at row r, column c." },
    { term: "Nested loops", definition: "A loop inside a loop; their iteration counts multiply." },
    { term: "Dimensions R × C", definition: "R rows by C columns; R·C total cells." },
  ],

  concepts: {
    purpose: "Matrix traversal visits every cell of a 2D grid, the basis for grid algorithms and DP tables.",
    operations: "Nested loops over rows and columns; access grid[r][c] in O(1).",
    uses: "Grid search (BFS/DFS), 2D dynamic programming, spiral/diagonal traversals, image filters.",
    tradeoffs: "Full traversal is unavoidably O(R·C); the cost is intrinsic to touching every cell.",
    commonMistakes: "Swapping row/column indices; assuming all rows have equal length (use len(grid[r])); calling a rectangular grid O(n²) when R != C.",
    edgeCases: "Empty grid (no rows) or empty rows: the inner/outer loop does nothing. Non-rectangular (jagged) grids need per-row length.",
  },

  complexity: [
    { operation: "Full traversal", best: "O(R*C)", average: "O(R*C)", worst: "O(R*C)", space: "O(1)", note: "Every one of R*C cells visited once; nested loops multiply." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "R", meaning: "the number of rows" },
      { symbol: "C", meaning: "the number of columns per row" },
    ],
    costModel: "Accessing grid[r][c] is O(1). Each cell visit is constant work.",
    time: {
      bound: "O(R*C)",
      case: "worst",
      explanation: "The outer loop runs R times; for each row the inner loop runs C times. Because the loops are NESTED, the total number of cell visits is R multiplied by C. Every cell is visited exactly once, so there is no way to do better for a full traversal. For a square grid (R = C = n) this is O(n²).",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Only the loop indices r and c are kept; no storage grows with the grid size.",
      inputOutputNote: "The grid of R·C cells is the input, not auxiliary space.",
    },
    derivation: [
      { lines: [4], description: "The outer loop runs R times (once per row).", cost: "O(R)", dimension: "time" },
      { lines: [5, 6], description: "For each row, the inner loop runs C times; nested → R·C visits total.", cost: "O(R*C)", dimension: "time" },
      { lines: [4, 5], description: "Two loop indices, independent of grid size.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["grid[r][c] access is O(1).", "Each row has C columns (rectangular); jagged grids use per-row lengths."],
    tradeoffs: "There is no cheaper way to read every cell; algorithms reduce work only by NOT visiting every cell (e.g. early exits, pruning).",
    counters: [{ label: "cells visited", definition: "executions of the inner-loop print (line 6)", countLines: [6] }],
    fixedDataNote: "This run visits a 2×3 grid = 6 cells. The O(R·C) bound generalises to any R and C.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: a matrix is a list of rows." },
    { line: 2, executable: true, explanation: "Create a 2×3 grid: two rows of three numbers." },
    { line: 3, executable: false, explanation: "Comment: outer over rows, inner over columns." },
    { line: 4, executable: true, explanation: "Outer loop: r goes 0, 1 (len(grid) = 2 rows)." },
    { line: 5, executable: true, explanation: "Inner loop: c goes over the columns of row r." },
    { line: 6, executable: true, explanation: "Print the cell grid[r][c]; end=' ' keeps them on one line. Runs R*C = 6 times." },
    { line: 7, executable: true, explanation: "print() ends the line after all cells." },
  ],

  bindings: [
    {
      variable: "grid",
      model: "matrix",
      overlays: [
        { role: "pointer", label: "row r", source: "r" },
        { role: "pointer", label: "col c", source: "c" },
      ],
    },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "A grid has 4 rows and 5 columns. How many cell visits does a full traversal make, and is that O(n^2)?", answer: "20 visits (4*5). It is O(R*C); calling it O(n^2) is only right if R = C.", explanation: "Nested loops multiply: 4 rows × 5 columns = 20. Use O(R·C) for a rectangular grid; O(n²) only applies when both dimensions equal n." },
  ],

  experiments: [
    "Add a third row and predict the new number of cell visits.",
    "Swap the loop order (columns outer) and observe column-major output.",
    "Make a jagged grid (rows of different lengths) and see why len(grid[r]) is needed.",
  ],

  exercises: [
    {
      id: "mat-complete-1",
      kind: "complete-code",
      prompt: "Complete the nested loops to sum every value in the grid.",
      starterCode: "grid = [[1, 2, 3], [4, 5, 6]]\ntotal = 0\nfor r in range(len(grid)):\n    for c in range(len(grid[r])):\n        # TODO: add grid[r][c] to total\n        pass\nprint(total)",
      expected: "grid = [[1, 2, 3], [4, 5, 6]]\ntotal = 0\nfor r in range(len(grid)):\n    for c in range(len(grid[r])):\n        total = total + grid[r][c]\nprint(total)",
      hints: ["Access the cell with grid[r][c].", "Add it to the accumulator.", "total = total + grid[r][c]"],
    },
    {
      id: "mat-predict-1",
      kind: "choose-approach",
      prompt: "State the time complexity of visiting every cell of an R×C grid, and explain why it is not O(R+C).",
      expected: "O(R*C): the loops are nested so counts multiply. O(R+C) would only count each row and column once, but there are R*C cells to visit.",
      hints: ["Are the loops nested or sequential?", "Nested loops multiply their counts.", "R rows times C columns = R*C cells."],
    },
  ],

  review: `A **matrix** is a list of rows; \`grid[r][c]\` reaches a cell in **O(1)**. A full traversal uses **nested loops** (rows × columns), so it is **O(R·C)** time and **O(1)** extra space — nested loops *multiply* (contrast sequential loops, which add). Name both dimensions; O(n²) only fits a square grid.`,

  expectedOutput: "1 2 3 4 5 6 \n",

  references: [
    {
      url: "https://www.geeksforgeeks.org/traverse-a-given-matrix-using-recursion/",
      title: "Traversing a matrix — GeeksforGeeks",
      section: "Row-major traversal",
      topic: "arrays/matrix-traversal",
      purpose: "Confirm row-major nested-loop traversal and O(R*C) cost.",
      verifiedClaims: ["Visiting all cells of an R×C matrix is O(R*C)"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://docs.python.org/3.14/tutorial/datastructures.html",
      title: "Data Structures — Python 3.14 documentation",
      section: "Nested list comprehensions / lists of lists",
      topic: "arrays/matrix-traversal",
      purpose: "Confirm Python represents matrices as lists of lists indexed grid[r][c].",
      verifiedClaims: ["A 2D grid is a list of row lists indexed [r][c]"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 15,
    contentHash: "7794b678a266a90c",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
