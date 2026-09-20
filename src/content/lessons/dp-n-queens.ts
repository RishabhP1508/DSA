/**
 * Lesson: Backtracking — N-Queens (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "2\n". Uses the recursion visualizer to show the
 * row-by-row placement and backtracking.
 */

import type { LessonDefinition } from "../../core/types";

const code = `# N-Queens: place N queens on an N x N board so none attack another.
# Count the distinct solutions for N = 4.
def n_queens(n):
    count = 0
    cols = set()      # columns already occupied
    diag1 = set()     # occupied "/" diagonals, keyed by (row - col)
    diag2 = set()     # occupied "\\\\" diagonals, keyed by (row + col)
    def bt(row):
        nonlocal count
        if row == n:               # placed a queen in every row -> a solution
            count += 1
            return
        for col in range(n):
            if col in cols or (row - col) in diag1 or (row + col) in diag2:
                continue           # pruned: this square is attacked
            cols.add(col); diag1.add(row - col); diag2.add(row + col)   # CHOOSE
            bt(row + 1)            # EXPLORE the next row
            cols.remove(col); diag1.remove(row - col); diag2.remove(row + col)  # UN-CHOOSE
    bt(0)
    return count

print(n_queens(4))   # 2 distinct solutions on a 4x4 board`;

export const dpNQueens: LessonDefinition = {
  id: "dp-n-queens",
  title: "Backtracking: N-Queens",
  area: "DP and recursion",
  prerequisites: ["dp-backtracking"],

  explanation: `**N-Queens** is the showcase constraint-satisfaction backtracking problem: place \`N\` queens on an \`N×N\` chessboard so that **no two attack each other**. A queen attacks along its **row, column, and both diagonals**, so a valid placement has exactly **one queen per row**, one per column, and no two sharing a diagonal. We count the distinct solutions; for \`N = 4\` there are **2**.

The search places queens **row by row** — this automatically satisfies the one-per-row rule and shrinks the tree. For each row we try every column, but we **prune** any square that is already attacked using three sets for **O(1)** conflict checks: \`cols\` (occupied columns), and two diagonal sets keyed by the invariants that identify diagonals — cells on the same **"/"** diagonal share \`row − col\`, and cells on the same **"\\\\"** diagonal share \`row + col\`. If a square is safe, we **choose** it (add to all three sets), **explore** the next row, then **un-choose** (remove from the sets) — the textbook choose/explore/un-choose rhythm from the backtracking lesson. Reaching \`row == n\` means every row has a safe queen: a complete solution.

Those diagonal keys are the clever bit worth remembering: encoding a constraint as a **hashable invariant** turns an "is this attacked?" test into a constant-time set lookup, which is what makes the pruning cheap. N-Queens is **exponential in the worst case** — roughly O(N!) placements are explored, far fewer than the Nᴺ of blind placement thanks to the pruning — with **O(N)** auxiliary space (recursion depth N plus the three sets holding at most N entries). The same "place along one axis, prune conflicts with invariant sets, backtrack" template solves Sudoku, graph coloring, and other constraint puzzles.`,

  vocabulary: [
    { term: "N-Queens", definition: "Place N non-attacking queens on an N×N board (one per row and column, none sharing a diagonal)." },
    { term: "Constraint satisfaction", definition: "Finding configurations that obey a set of constraints, a natural fit for backtracking." },
    { term: "Diagonal invariant", definition: "Cells share a '/' diagonal iff row−col is equal; a '\\\\' diagonal iff row+col is equal." },
    { term: "Conflict set", definition: "A set of occupied columns/diagonals giving O(1) 'is this attacked?' checks." },
    { term: "Row-by-row placement", definition: "Placing one queen per row so that rule is satisfied automatically." },
  ],

  concepts: {
    purpose:
      "Solve a constraint-satisfaction problem with backtracking and efficient invariant-based pruning.",
    operations:
      "For each row, try safe columns (checked via sets), place a queen, recurse to the next row, then remove it (backtrack); count full placements.",
    uses:
      "N-Queens, Sudoku, graph/map coloring, scheduling with conflicts, other constraint puzzles.",
    tradeoffs:
      "Backtracking with pruning explores far fewer states than brute force, but worst-case cost is still exponential; the invariant sets make each check O(1).",
    commonMistakes:
      "Wrong diagonal keys (mixing up row±col); forgetting to remove entries on backtrack (stale conflicts); iterating over all cells instead of one queen per row; not using nonlocal for the counter.",
    edgeCases:
      "N = 1 → 1 solution. N = 2 and N = 3 → 0 solutions (impossible). N = 4 → 2 solutions.",
  },

  complexity: [
    { operation: "N-Queens (backtracking)", best: "O(N!)", average: "O(N!)", worst: "O(N!)", space: "O(N)", note: "Pruned search ~N! placements; O(1) conflict checks; O(N) recursion + sets." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "N", meaning: "the board size and number of queens" }],
    costModel:
      "Each conflict check is an O(1) set lookup. Each node tries up to N columns; the pruned tree explores on the order of N! leaves in the worst case.",
    time: {
      bound: "O(N!)",
      case: "worst",
      explanation:
        "Placing one queen per row, the first row has N safe choices, the next has at most N−1 (a column is used and diagonals are blocked), and so on — an N! -like shrinking product, heavily reduced further by diagonal pruning. This is vastly smaller than the Nᴺ of trying every column in every row without pruning, but still super-polynomial.",
    },
    space: {
      bound: "O(N)",
      case: "worst",
      explanation:
        "The recursion is at most N deep (one frame per row), and the three conflict sets hold at most N entries each. So auxiliary space is O(N). The counter is O(1).",
      inputOutputNote: "We count solutions, so the output is a single integer (O(1)); the O(N) is the recursion stack plus the conflict sets.",
    },
    derivation: [
      { lines: [10, 11, 12], description: "Completion check increments the solution count at a full placement.", cost: "O(1) per solution", dimension: "time" },
      { lines: [13, 14, 15], description: "O(1) conflict checks prune attacked squares, shrinking the tree.", cost: "O(1) per check", dimension: "time" },
      { lines: [16, 17, 18], description: "Choose/explore/un-choose drive the ~N! branching.", cost: "O(N!)", dimension: "time" },
      { lines: [5, 6, 7], description: "Three conflict sets (≤ N entries) plus O(N) recursion depth.", cost: "O(N)", dimension: "space" },
    ],
    assumptions: [
      "Diagonals are correctly identified by row−col and row+col.",
      "One queen is placed per row, so rows never conflict.",
      "Set membership/add/remove are O(1) on average.",
    ],
    tradeoffs:
      "Pruning with invariant sets makes each check O(1) and cuts the explored tree from Nᴺ toward N!; the price is maintaining and backtracking the sets. For just counting, symmetry tricks can roughly halve the work, at the cost of extra bookkeeping.",
    counters: [
      { label: "solutions found", definition: "executions of the count increment (line 11)", countLines: [11] },
      { label: "columns tried", definition: "executions of the column loop body (line 14)", countLines: [14] },
    ],
    fixedDataNote:
      "n_queens(4) finds 2 solutions. The O(N!) bound describes how the pruned search grows with the board size N.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: place N non-attacking queens." },
    { line: 2, executable: false, explanation: "Comment: count solutions for N = 4." },
    { line: 3, executable: true, explanation: "Define n_queens(n)." },
    { line: 4, executable: true, explanation: "Solution counter." },
    { line: 5, executable: true, explanation: "Set of occupied columns." },
    { line: 6, executable: true, explanation: "Set of occupied '/' diagonals, keyed by row - col." },
    { line: 7, executable: true, explanation: "Set of occupied '\\\\' diagonals, keyed by row + col." },
    { line: 8, executable: true, explanation: "Backtracking function placing a queen in the given row." },
    { line: 9, executable: true, explanation: "Allow updating the enclosing count." },
    { line: 10, executable: true, explanation: "If we've filled every row, we have a valid placement." },
    { line: 11, executable: true, explanation: "Count this solution." },
    { line: 12, executable: true, explanation: "Return to explore other placements." },
    { line: 13, executable: true, explanation: "Try each column in this row." },
    { line: 14, executable: true, explanation: "Prune: skip a square attacked via column or either diagonal." },
    { line: 15, executable: true, explanation: "Skip to the next column." },
    { line: 16, executable: true, explanation: "Choose: mark this column and both diagonals occupied." },
    { line: 17, executable: true, explanation: "Explore: place a queen in the next row." },
    { line: 18, executable: true, explanation: "Un-choose: free the column and diagonals (backtrack)." },
    { line: 19, executable: true, explanation: "Start the search from row 0." },
    { line: 20, executable: true, explanation: "Return the number of solutions." },
    { line: 21, executable: false, explanation: "Blank line." },
    { line: 22, executable: true, explanation: "n_queens(4) = 2." },
  ],

  bindings: [{ variable: "row", model: "recursion" }],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "How do the sets diag1 and diag2 make diagonal-conflict checks O(1)?",
      answer: "All cells on one '/' diagonal share the same value of row - col, and all cells on one '\\\\' diagonal share row + col. Storing those keys in sets means checking whether a square's diagonals are occupied is a constant-time set lookup.",
      explanation: "Encoding each diagonal as a single integer invariant turns 'is this diagonal attacked?' into an O(1) membership test instead of scanning cells.",
    },
  ],

  experiments: [
    "Change n to 5, 6, 7, 8 and observe the solution counts (10, 4, 40, 92).",
    "Collect the actual board layouts instead of just counting.",
    "Remove the diagonal checks and watch invalid 'solutions' appear.",
  ],

  exercises: [
    {
      id: "dpnq-complete-1",
      kind: "complete-code",
      prompt: "Complete the choose/explore/un-choose block for placing a queen.",
      starterCode:
        "if col in cols or (row - col) in diag1 or (row + col) in diag2:\n    continue\n# TODO: choose, explore next row, un-choose\n",
      expected:
        "if col in cols or (row - col) in diag1 or (row + col) in diag2:\n    continue\ncols.add(col); diag1.add(row - col); diag2.add(row + col)\nbt(row + 1)\ncols.remove(col); diag1.remove(row - col); diag2.remove(row + col)",
      hints: [
        "Add the column and both diagonal keys.",
        "Recurse to the next row.",
        "Then remove exactly what you added.",
      ],
    },
    {
      id: "dpnq-fix-1",
      kind: "fix-mistake",
      prompt: "This never frees the diagonals on backtrack, so conflicts leak. Fix it.",
      starterCode:
        "cols.add(col); diag1.add(row - col); diag2.add(row + col)\nbt(row + 1)\ncols.remove(col)\n# bug: diagonals not removed",
      expected:
        "cols.add(col); diag1.add(row - col); diag2.add(row + col)\nbt(row + 1)\ncols.remove(col); diag1.remove(row - col); diag2.remove(row + col)",
      hints: [
        "Every add needs a matching remove on backtrack.",
        "The diagonals were added too.",
        "Remove row-col from diag1 and row+col from diag2.",
      ],
    },
    {
      id: "dpnq-predict-1",
      kind: "predict-state",
      prompt: "How many solutions does n_queens(4) return, and why is n_queens(2) or n_queens(3) zero?",
      expected: "n_queens(4) = 2. For n = 2 and n = 3 no placement avoids all attacks, so the count is 0.",
      hints: [
        "Small boards are too cramped.",
        "2 and 3 have no valid arrangement.",
        "4 has exactly two.",
      ],
    },
  ],

  review: `**N-Queens** places N non-attacking queens using **row-by-row backtracking** with **choose/explore/un-choose**. Conflicts are pruned in **O(1)** using sets keyed by **invariants**: columns, \`row − col\` for "/" diagonals, and \`row + col\` for "\\\\" diagonals. Reaching \`row == n\` is a solution. It's **exponential (~O(N!))** time but **O(N)** space, far better than blind Nᴺ placement. The invariant-set pruning template extends to Sudoku and graph coloring. \`n_queens(4)\` = **2**.`,

  expectedOutput: "2\n",

  references: [
    {
      url: "https://en.wikipedia.org/wiki/Eight_queens_puzzle",
      title: "Eight queens puzzle — Wikipedia",
      section: "Backtracking solution; diagonals and solution counts",
      topic: "dp/n-queens",
      purpose: "Confirm the backtracking formulation, the diagonal-conflict reasoning, and the small-N solution counts (4→2, 8→92).",
      verifiedClaims: [
        "N-Queens is solved by backtracking placing one queen per row and pruning column/diagonal conflicts.",
        "There are 2 solutions for N=4 and 92 for N=8.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://leetcode.com/problems/n-queens-ii/editorial/",
      title: "N-Queens II — LeetCode editorial",
      section: "O(1) conflict checks via column/diagonal sets",
      topic: "dp/n-queens",
      purpose: "Cross-check encoding the two diagonals as row−col and row+col for constant-time conflict checks.",
      verifiedClaims: [
        "The two diagonals are identified by row-col and row+col, enabling O(1) conflict checks with sets.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "99977c48dac52925",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
