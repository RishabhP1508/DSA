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
    diag1 = set()     # occupied descending diagonals, keyed by (row - col)
    diag2 = set()     # occupied ascending diagonals, keyed by (row + col)
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
  prerequisites: [
  "dp-backtracking",
  "maps-sets",
  "scope"
],

  explanation: "N-Queens places n queens on an n×n board so no pair shares a row, column or diagonal. This implementation counts every valid placement; n=4 has two. It places one queen per row, so row conflicts are impossible by construction.\n\nFor each row, scan the n columns and reject a candidate whose column or diagonal is occupied. With rows increasing downward and columns rightward, **row − col** is constant on a **\\** diagonal and **row + col** on a **/** diagonal. Each conflict set stores those integer keys. Set lookup is expected constant work under ordinary hashing. A safe choice adds its three keys, explores the next row, then removes them so the next sibling sees the prior state. Reaching row==n increments the count and returns, continuing to other placements.\n\nAt most O(n!) distinct-column prefixes exist, and this code still scans n candidates at each nonterminal prefix. Therefore O(n*n!) is a conservative expected-hashing scalar upper bound; it is not a tight statement that n! solutions are visited. Stack frames and three sets retain O(n) scalar entries. Counting returns one integer instead of board layouts; its bit size can grow.\n\nThe app extends n=0 to one empty placement. n=1 gives one, n=2/3 give zero, and n=4 gives two. n must be a non-negative integer; negative n is outside the contract. Larger searches may be stopped by app event/time limits or interpreter depth limits. Maintaining conflict keys correctly and undoing each chosen key are the important invariants.",

  vocabulary: [
  {
    "term": "N-Queens",
    "definition": "Place N non-attacking queens on an N×N board (one per row and column, none sharing a diagonal)."
  },
  {
    "term": "Constraint satisfaction",
    "definition": "Finding configurations that obey a set of constraints, a natural fit for backtracking."
  },
  {
    "term": "Diagonal invariant",
    "definition": "With rows down and columns right, equal row−col identifies a \\ diagonal; equal row+col identifies a / diagonal."
  },
  {
    "term": "Conflict set",
    "definition": "Occupied column/diagonal keys supporting expected O(1) checks with ordinary hashes."
  },
  {
    "term": "Row-by-row placement",
    "definition": "Placing one queen per row so that rule is satisfied automatically."
  }
],

  concepts: {
  "purpose": "Solve a constraint-satisfaction problem with backtracking and efficient invariant-based pruning.",
  "operations": "For each row, try safe columns (checked via sets), place a queen, recurse to the next row, then remove it (backtrack); count full placements.",
  "uses": "N-Queens, Sudoku, graph/map coloring, scheduling with conflicts, other constraint puzzles.",
  "tradeoffs": "Diagonal pruning rejects attacked squares early. Maintaining three sets gives expected O(1) conflict checks, while each nonterminal row still scans N columns.",
  "commonMistakes": "Wrong diagonal keys (mixing up row±col); forgetting to remove entries on backtrack (stale conflicts); iterating over all cells instead of one queen per row; not using nonlocal for the counter.",
  "edgeCases": "N = 1 → 1 solution. N = 2 and N = 3 → 0 solutions (impossible). N = 4 → 2 solutions. n=0 gives one empty placement; n must be a non-negative integer. Larger valid searches can exceed trace/time or interpreter recursion limits."
},

  complexity: [
  {
    "operation": "N-Queens (backtracking)",
    "best": "O(N*N!)",
    "average": "O(N*N!)",
    "worst": "O(N*N!)",
    "space": "O(N)",
    "note": "Conservative upper bound includes N checks per internal node; set costs are expected; n=0 uses O(1)."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "N",
      "meaning": "the board size and number of queens"
    }
  ],
  "costModel": "Every nonterminal prefix scans all N columns, including attacked choices. Ignoring diagonals, distinct-column prefixes number Σ_{r=0}^N P(N,r)=O(N!). Set lookup uses expected O(1) ordinary hashing; mutation uses amortized expected O(1). Count increments are scalar operations in this model.",
  "time": {
    "bound": "O(N*N!)",
    "case": "worst",
    "explanation": "Distinct-column prefixes give an O(N!) upper bound on visited nodes; diagonal pruning removes more. This code still tests all N columns at each nonterminal node, so O(N*N!) is a conservative upper bound under expected hashing, not a tight claim that there are N! solutions. n=0 is constant."
  },
  "space": {
    "bound": "O(N)",
    "case": "worst",
    "explanation": "The recursion is at most N deep (one frame per row), and the three conflict sets hold at most N entries each. So auxiliary space is O(N). The counter is O(1).",
    "inputOutputNote": "O(N) counts scalar set entries and frames, excluding input/trace. Counts are integers up to N!, requiring at most O(N log(N+1)) bits; index keys also need growing bits."
  },
  "derivation": [
    {
      "lines": [
        10,
        11,
        12
      ],
      "description": "Completion check increments the solution count at a full placement.",
      "cost": "O(1) per solution",
      "dimension": "time"
    },
    {
      "lines": [
        13,
        14,
        15
      ],
      "description": "O(1) conflict checks prune attacked squares, shrinking the tree.",
      "cost": "O(1) per check",
      "dimension": "time"
    },
    {
      "lines": [
        16,
        17,
        18
      ],
      "description": "At most O(N!) column-distinct prefixes, with N candidate checks per nonterminal prefix.",
      "cost": "O(N*N!)",
      "dimension": "time"
    },
    {
      "lines": [
        5,
        6,
        7
      ],
      "description": "Three conflict sets (≤ N entries) plus O(N) recursion depth.",
      "cost": "O(N)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Diagonals are correctly identified by row−col and row+col.",
    "One queen is placed per row, so rows never conflict.",
    "Set membership/add/remove are O(1) on average.",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "Conflict sets turn board scans into expected constant-time checks. Diagonal pruning shrinks the search, but output-sensitive counting is not inferred from the conservative bound. Symmetry can reduce exploration with additional bookkeeping.",
  "counters": [
    {
      "label": "solutions found",
      "definition": "executions of the count increment Recorded line entries at 11 occur before the operation completes.",
      "countLines": [
        11
      ]
    },
    {
      "label": "columns tried",
      "definition": "executions of the column loop body Recorded line entries at 14 occur before the operation completes.",
      "countLines": [
        14
      ]
    }
  ],
  "fixedDataNote": "n_queens(4) returns 2; it visits 17 backtracker calls and tests 60 column candidates. The O(N*N!) upper bound includes scanning attacked columns and excludes tracing/printing."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: place N non-attacking queens."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Comment: count solutions for N = 4."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Define n_queens(n)."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Solution counter."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Set of occupied columns."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Create the row−col conflict set: with rows increasing down and columns right, these are \\ diagonals."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Create the row+col conflict set: these are / diagonals in the displayed row/column convention."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Backtracking function placing a queen in the given row."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Allow updating the enclosing count."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "If we've filled every row, we have a valid placement."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Count this solution."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Return to explore other placements."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Try each column in this row."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Prune: skip a square attacked via column or either diagonal."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Skip to the next column."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "Choose: mark this column and both diagonals occupied."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Explore: place a queen in the next row."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "Un-choose: free the column and diagonals (backtrack)."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "Start the search from row 0."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Return the number of solutions."
  },
  {
    "line": 21,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "n_queens(4) = 2."
  }
],

  bindings: [
  {
    "variable": "row",
    "model": "recursion"
  },
  {
    "variable": "cols",
    "model": "set"
  },
  {
    "variable": "diag1",
    "model": "set"
  },
  {
    "variable": "diag2",
    "model": "set"
  },
  {
    "variable": "count",
    "model": "object"
  }
],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "How do the sets diag1 and diag2 make diagonal-conflict checks O(1)?",
    "answer": "For rows increasing down and columns right, row−col labels \\ diagonals and row+col labels / diagonals. The sets store occupied keys, so membership is expected O(1) with ordinary hashes.",
    "explanation": "Diagonal direction depends on coordinate convention; either invariant identifies one family. Set costs are expected, not an unconditional worst-case guarantee."
  }
],

  experiments: [
  "Try n=5 and compare its 10 solutions with n=4's 2. Larger boards may exceed the app's event/time limits; a stopped trace is not a completed count.",
  "Collect the actual board layouts instead of just counting.",
  "Remove the diagonal checks and watch invalid 'solutions' appear."
],

  exercises: [
    {
      id: "dpnq-complete-1",
      kind: "complete-code",
      prompt: "Complete `count_n_queens(n)`: number of ways to place n non-attacking queens. Fill the choose / explore / un-choose block.",
      starterCode:
        "def count_n_queens(n):\n    cols = set(); diag1 = set(); diag2 = set()\n    count = 0\n    def bt(row):\n        nonlocal count\n        if row == n:\n            count += 1\n            return\n        for col in range(n):\n            if col in cols or (row - col) in diag1 or (row + col) in diag2:\n                continue\n            # TODO: choose, explore next row, un-choose\n            pass\n    bt(0)\n    return count",
      expected:
        "def count_n_queens(n):\n    cols = set(); diag1 = set(); diag2 = set()\n    count = 0\n    def bt(row):\n        nonlocal count\n        if row == n:\n            count += 1\n            return\n        for col in range(n):\n            if col in cols or (row - col) in diag1 or (row + col) in diag2:\n                continue\n            cols.add(col); diag1.add(row - col); diag2.add(row + col)\n            bt(row + 1)\n            cols.remove(col); diag1.remove(row - col); diag2.remove(row + col)\n    bt(0)\n    return count",
      hints: [
        "Add the column and both diagonal keys.",
        "Recurse to the next row.",
        "Then remove exactly what you added.",
      ],
    },
    {
      id: "dpnq-fix-1",
      kind: "fix-mistake",
      prompt: "`count_n_queens(n)` counts non-attacking placements. This never frees the diagonals on backtrack, so conflicts leak. Fix it.",
      starterCode:
        "def count_n_queens(n):\n    cols = set(); diag1 = set(); diag2 = set()\n    count = 0\n    def bt(row):\n        nonlocal count\n        if row == n:\n            count += 1\n            return\n        for col in range(n):\n            if col in cols or (row - col) in diag1 or (row + col) in diag2:\n                continue\n            cols.add(col); diag1.add(row - col); diag2.add(row + col)\n            bt(row + 1)\n            cols.remove(col)\n            # bug: diagonals not removed\n    bt(0)\n    return count",
      expected:
        "def count_n_queens(n):\n    cols = set(); diag1 = set(); diag2 = set()\n    count = 0\n    def bt(row):\n        nonlocal count\n        if row == n:\n            count += 1\n            return\n        for col in range(n):\n            if col in cols or (row - col) in diag1 or (row + col) in diag2:\n                continue\n            cols.add(col); diag1.add(row - col); diag2.add(row + col)\n            bt(row + 1)\n            cols.remove(col); diag1.remove(row - col); diag2.remove(row + col)\n    bt(0)\n    return count",
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

  review: "Place one queen per row; try every column, skip conflicts, add keys, recurse, and remove keys. For row numbers increasing down, row−col identifies \\ diagonals and row+col identifies / diagonals. The code counts all solutions, including two for n=4 and the empty placement for n=0. It uses O(n) scalar entries/frames and a conservative O(n*n!) time bound under expected hashing, including candidate scans.",

  expectedOutput: "2\n",

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
    "url": "https://see.stanford.edu/materials/icspacs106b/H19-RecBacktrackExamples.pdf",
    "title": "Stanford CS106B handout 19",
    "section": "The venerable 8-Queens, solve/place/remove and safety checks",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Backtracking chooses a safe square, explores the next row/column, and restores the board after return."
    ],
    "conventions": [
      "Source chooses one queen per column and stops at the first solution; app transposes to one per row, counts every solution, and stores diagonal integer keys rather than scanning a board."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://leetcode.com/problems/n-queens-ii/description/",
    "title": "LeetCode: N-Queens II",
    "section": "Problem definition, examples and constraints",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Count nonattacking full queen placements; n=4 gives 2 and n=1 gives 1."
    ],
    "conventions": [
      "Original n≥1; app extends n=0 to one empty placement."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1258/lectures/11-backtracking1/",
    "title": "Stanford CS106B: recursive backtracking",
    "section": "Choose/explore/unchoose, subsets and string-by-value notes",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Mutable shared paths must be restored for siblings; by-value strings need no explicit undo; output copies contribute to subset enumeration cost."
    ],
    "conventions": [
      "Python shared-list append/pop is paired; immutable prefix strings remain in separate live frames."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "c043d5ebfcb009f3",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
