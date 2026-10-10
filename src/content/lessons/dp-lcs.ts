/**
 * Lesson: DP worked example — longest common subsequence (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "3\n". Uses the dp-table visualizer (2D grid).
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Longest common subsequence: longest sequence appearing (in order) in BOTH.
def lcs(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]  # dp[i][j]: LCS of a[:i], b[:j]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:            # characters match -> extend diagonal
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:                               # mismatch -> best of dropping one char
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]

print(lcs("abcde", "ace"))   # common subsequence "ace" -> length 3`;

export const dpLcs: LessonDefinition = {
  id: "dp-lcs",
  title: "DP Example: Longest Common Subsequence",
  area: "DP and recursion",
  prerequisites: [
  "dp-subsequences",
  "dp-1d-2d",
  "matrix-traversal"
],

  explanation: "The **longest common subsequence (LCS)** of two strings is the longest sequence of characters that appears in **both**, in the same relative **order** but not necessarily contiguous. For `\"abcde\"` and `\"ace\"`, the LCS is `\"ace\"`, length **3**. LCS is the workhorse behind `diff` tools, version-control merges, and DNA-similarity scoring, and it's the model for edit distance.\n\nBecause the state depends on **two** positions (how much of each string we've consumed), it's a **2D** DP: `dp[i][j]` = the LCS length of the prefixes `a[:i]` and `b[:j]`. The recurrence compares the two current characters. If `a[i-1] == b[j-1]`, that shared character **extends the LCS**, so `dp[i][j] = dp[i-1][j-1] + 1` (a step along the diagonal). If they differ, the shared subsequence must **drop the last character of one string or the other**, so `dp[i][j] = max(dp[i-1][j], dp[i][j-1])` — the better of the two smaller subproblems. The **base cases** are the zero row and zero column: an empty prefix shares nothing, so those are all 0. The answer is `dp[m][n]`.\n\nAllocation and transitions use **O((m+1)(n+1))** time and scalar cells, conventionally O(mn) for positive lengths. Two takeaways: the **match/mismatch fork** (extend diagonally on a match, else take the max of the two neighbors) is the reusable pattern shared by edit distance and sequence-alignment DPs; and the table can be **row-compressed to O(min(m,n))** if you only need the length, since each row depends on the previous row and the cell to the left. One straightforward reconstruction method keeps the full table and walks backward from `dp[m][n]`, following diagonals on matches; Hirschberg's divide-and-conquer method can reconstruct an LCS with linear storage instead. Contrast LCS with the earlier **is-subsequence** check: that tested whether one specific string is a subsequence of another; LCS **optimizes** over all common subsequences of two strings, so the shown algorithm evaluates prefix-pair states.",

  vocabulary: [
  {
    "term": "Common subsequence",
    "definition": "A sequence that is a subsequence of both strings (order preserved, gaps allowed)."
  },
  {
    "term": "dp[i][j]",
    "definition": "The LCS length of the prefixes a[:i] and b[:j]."
  },
  {
    "term": "Match (diagonal)",
    "definition": "Equal current characters extend the LCS: dp[i-1][j-1] + 1."
  },
  {
    "term": "Mismatch (max of neighbors)",
    "definition": "Drop one character: max(dp[i-1][j], dp[i][j-1])."
  },
  {
    "term": "Reconstruction",
    "definition": "Recovering an explicit optimum sequence from stored or recomputed decisions, rather than returning only its length."
  }
],

  concepts: {
  "purpose": "Compute the longest sequence common to two strings — the basis of diff, merges, and alignment.",
  "operations": "Fill dp[i][j] by matching (diagonal + 1) or mismatching (max of top/left); read dp[m][n].",
  "uses": "File diffs, version control merges, DNA/protein alignment, plagiarism/similarity scoring, edit distance.",
  "tradeoffs": "The full table uses (m+1)(n+1) scalar cells. Row compression keeps min(m,n)+1 cells for lengths; the full table is a convenient aid for reconstructing one LCS, not a universal requirement.",
  "commonMistakes": "Off-by-one between string index (i-1) and table index (i); forgetting the zero base row/column; using the diagonal on a mismatch; confusing LCS with the contiguous longest common substring.",
  "edgeCases": "Either string empty → LCS 0. No shared characters → 0. Identical strings → the full length."
},

  complexity: [
  {
    "operation": "LCS (2D DP)",
    "best": "O((m+1)*(n+1))",
    "average": "O((m+1)*(n+1))",
    "worst": "O((m+1)*(n+1))",
    "space": "O((m+1)*(n+1))",
    "note": "Includes boundary-cell allocation for empty strings; loops fill exactly m*n interior cells."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "m",
      "meaning": "the length of string a"
    },
    {
      "symbol": "n",
      "meaning": "the length of string b"
    }
  ],
  "costModel": "Filling one cell is O(1) (a comparison and either an add or a max). Every cell is filled once.",
  "time": {
    "bound": "O((m+1)*(n+1))",
    "case": "worst",
    "explanation": "Allocation initializes (m+1)(n+1) cells, including empty-prefix boundaries. The loops compute exactly m*n interior states, each with constant scalar work. Thus O((m+1)(n+1)), conventionally O(mn) for positive lengths. Empty strings still allocate their boundary row/column."
  },
  "space": {
    "bound": "O((m+1)*(n+1))",
    "case": "worst",
    "explanation": "The full prefix table holds (m+1)(n+1) scalar cells. Length-only computation can retain a previous row, current-left entry and saved diagonal in O(min(m,n)+1) cells. A full table is a straightforward reconstruction aid; it is not required by every reconstruction algorithm.",
    "inputOutputNote": "Return one length, not the common subsequence. Input strings and tracer snapshots are outside auxiliary space."
  },
  "derivation": [
    {
      "lines": [
        4
      ],
      "description": "Allocate the (m+1)×(n+1) table with a zero base row/column.",
      "cost": "O((m+1)*(n+1))",
      "dimension": "space"
    },
    {
      "lines": [
        5,
        6,
        7,
        8,
        9,
        10
      ],
      "description": "Compute m*n interior states using equal-character diagonal or unequal-character maximum.",
      "cost": "O(m·n)",
      "dimension": "time"
    },
    {
      "lines": [
        11
      ],
      "description": "Read dp[m][n] — O(1).",
      "cost": "O(1)",
      "dimension": "time"
    }
  ],
  "assumptions": [
    "String index i-1 maps to table index i (prefix a[:i]).",
    "The zero row/column base cases represent empty prefixes.",
    "Comparisons and arithmetic are O(1).",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "Row compression preserves the natural two-index state in control flow with fewer stored cells. The full table makes inspecting and reconstructing an LCS straightforward; the length recurrence alone does not choose one uniquely.",
  "counters": [
    {
      "label": "cells filled",
      "definition": "executions of the match check Recorded line entries at 7 occur before the operation completes.",
      "countLines": [
        7
      ]
    },
    {
      "label": "mismatch maxes",
      "definition": "executions of the mismatch line Recorded line entries at 10 occur before the operation completes.",
      "countLines": [
        10
      ]
    }
  ],
  "fixedDataNote": "For 'abcde' and 'ace' the 6×4 table yields LCS length 3. The O(m·n) bound describes how the fill scales with the two lengths. Function analysis excludes demonstration input literals, imports, printing and tracer storage. A line event shows the next operation before it completes."
},

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: longest sequence common to both, in order." },
    { line: 2, executable: true, explanation: "Define lcs(a, b)." },
    { line: 3, executable: true, explanation: "m and n are the string lengths." },
    { line: 4, executable: true, explanation: "dp[i][j] holds the LCS of prefixes a[:i], b[:j]; row/column 0 are the empty-prefix base cases (all 0)." },
    { line: 5, executable: true, explanation: "Loop over prefix lengths of a." },
    { line: 6, executable: true, explanation: "Loop over prefix lengths of b." },
    { line: 7, executable: true, explanation: "If the current characters match..." },
    { line: 8, executable: true, explanation: "...extend the diagonal subproblem by one." },
    { line: 9, executable: false, explanation: "Otherwise the characters differ." },
    { line: 10, executable: true, explanation: "Drop one character from a or from b — take the better subproblem." },
    { line: 11, executable: true, explanation: "The full-strings LCS length is dp[m][n]." },
    { line: 12, executable: false, explanation: "Blank line." },
    { line: 13, executable: true, explanation: "LCS of 'abcde' and 'ace' is 'ace', length 3." },
  ],

  bindings: [
    {
      variable: "dp",
      model: "dp-table",
      // 2D current cell (i, j) over the prefixes a[:i], b[:j].
      overlays: [
        { role: "pointer", label: "i", source: "i" },
        { role: "pointer", label: "j", source: "j" },
      ],
    },
  ],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "On a character mismatch, why is dp[i][j] = max(dp[i-1][j], dp[i][j-1])?",
      answer: "If the last characters differ, they can't both be in the LCS's end, so the LCS of these prefixes is the better of: the LCS ignoring a's last character (dp[i-1][j]) or ignoring b's last character (dp[i][j-1]).",
      explanation: "A mismatch forces dropping one string's final character; the max picks whichever drop preserves the longer common subsequence.",
    },
  ],

  experiments: [
  "Print the dp grid to see where matches (+1 diagonals) occur.",
  "Reconstruct the actual LCS by walking back from dp[m][n].",
  "For longest common substring, set mismatches to 0 and track the maximum over every table cell (not just dp[m][n]); contiguity changes both the recurrence and the final aggregation."
],

  exercises: [
    {
      id: "dplcs-complete-1",
      kind: "complete-code",
      prompt: "Complete `lcs(a, b)`: the length of the longest common subsequence. Fill the match/mismatch transition inside the loop.",
      starterCode:
        "def lcs(a, b):\n    m, n = len(a), len(b)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if a[i - 1] == b[j - 1]:\n                # TODO: extend the diagonal\n                pass\n            else:\n                # TODO: take the better neighbor\n                pass\n    return dp[m][n]",
      expected:
        "def lcs(a, b):\n    m, n = len(a), len(b)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if a[i - 1] == b[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1] + 1\n            else:\n                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])\n    return dp[m][n]",
      hints: [
        "Match extends the diagonal cell by 1.",
        "Mismatch takes the max of top and left.",
        "dp[i-1][j-1]+1  vs  max(dp[i-1][j], dp[i][j-1])",
      ],
    },
    {
      id: "dplcs-choose-1",
      kind: "choose-approach",
      prompt: "You must find the longest run of characters common to two strings that is CONTIGUOUS in both. Is that LCS, or something else?",
      expected: "Not LCS — that's the longest common SUBSTRING (contiguous), a different DP where a mismatch resets the cell to 0. LCS allows gaps; substring does not.",
      hints: [
        "Contiguous vs order-only.",
        "LCS allows gaps.",
        "Longest common substring resets on mismatch.",
      ],
    },
    {
      id: "dplcs-predict-1",
      kind: "predict-state",
      prompt: "What is the LCS of 'abcde' and 'ace', and what is dp[5][3]?",
      expected: "'ace', length 3; dp[5][3] = 3.",
      hints: [
        "a, c, e appear in order in both.",
        "That's three characters.",
        "The bottom-right cell holds the length.",
      ],
    },
  ],

  review: "LCS preserves order and permits gaps. Prefix state dp[i][j] uses diagonal+1 on a character match and max(top,left) on a mismatch; empty prefixes have length zero. Allocation uses (m+1)(n+1) cells, while loops compute m*n interior states. A rolling row needs prior-row, current-left and saved-diagonal information. Full-table reconstruction is convenient, not required by every algorithm. The sample returns length3.",

  expectedOutput: "3\n",

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
    "url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/28461a74f81101874a13d9679a40584d_MIT6_006S20_lec16.pdf",
    "title": "MIT 6.006 lecture 16",
    "section": "Longest common subsequence recurrence, bases and table",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Match uses diagonal+1; mismatch takes the maximum after dropping either final/prefix character; empty prefixes have length zero."
    ],
    "conventions": [
      "MIT formulates suffix states and reversed fill order; app uses prefixes dp[i][j] for a[:i],b[:j], with increasing indices."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://leetcode.com/problems/longest-common-subsequence/description/",
    "title": "LeetCode: Longest Common Subsequence",
    "section": "Problem definition, examples and constraints",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Return the longest common subsequence length, not a contiguous substring; disjoint strings give zero."
    ],
    "conventions": [],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://ics.uci.edu/~dhirschb/pubs/p341-hirschberg.pdf",
    "title": "Hirschberg (1975): A Linear Space Algorithm for Computing Maximal Common Subsequences",
    "section": "Algorithms A/B/C, correctness and time/space analyses, pp.341–343",
    "topic": "dp-recursion",
    "purpose": "Check that reconstructing an LCS does not universally require the full quadratic table.",
    "verifiedClaims": [
      "The full-table prefix recurrence computes LCS lengths; a two-row version computes the final row.",
      "The divide-and-conquer algorithm C produces an actual longest common subsequence with quadratic time and linear space."
    ],
    "conventions": [
      "Source uses one-based string positions and shared-storage substring index ranges. This lesson shows a zero-based Python full-table length algorithm, not a Python implementation of algorithm C."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "5fd89eac17d69daf",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
