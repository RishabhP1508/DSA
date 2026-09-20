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
  prerequisites: ["dp-subsequences", "dp-1d-2d"],

  explanation: `The **longest common subsequence (LCS)** of two strings is the longest sequence of characters that appears in **both**, in the same relative **order** but not necessarily contiguous. For \`"abcde"\` and \`"ace"\`, the LCS is \`"ace"\`, length **3**. LCS is the workhorse behind \`diff\` tools, version-control merges, and DNA-similarity scoring, and it's the model for edit distance.

Because the state depends on **two** positions (how much of each string we've consumed), it's a **2D** DP: \`dp[i][j]\` = the LCS length of the prefixes \`a[:i]\` and \`b[:j]\`. The recurrence compares the two current characters. If \`a[i-1] == b[j-1]\`, that shared character **extends the LCS**, so \`dp[i][j] = dp[i-1][j-1] + 1\` (a step along the diagonal). If they differ, the shared subsequence must **drop the last character of one string or the other**, so \`dp[i][j] = max(dp[i-1][j], dp[i][j-1])\` — the better of the two smaller subproblems. The **base cases** are the zero row and zero column: an empty prefix shares nothing, so those are all 0. The answer is \`dp[m][n]\`.

This is **O(m·n)** time and space — one fill of an (m+1)×(n+1) grid. Two takeaways: the **match/mismatch fork** (extend diagonally on a match, else take the max of the two neighbors) is the reusable pattern shared by edit distance and sequence-alignment DPs; and the table can be **row-compressed to O(min(m,n))** if you only need the length, since each row depends on the previous row and the cell to the left. To *reconstruct* the actual subsequence (not just its length) you keep the full table and walk backward from \`dp[m][n]\`, following diagonals on matches. Contrast LCS with the earlier **is-subsequence** check: that tested whether one specific string is a subsequence of another; LCS **optimizes** over all common subsequences of two strings, which is why it needs a table.`,

  vocabulary: [
    { term: "Common subsequence", definition: "A sequence that is a subsequence of both strings (order preserved, gaps allowed)." },
    { term: "dp[i][j]", definition: "The LCS length of the prefixes a[:i] and b[:j]." },
    { term: "Match (diagonal)", definition: "Equal current characters extend the LCS: dp[i-1][j-1] + 1." },
    { term: "Mismatch (max of neighbors)", definition: "Drop one character: max(dp[i-1][j], dp[i][j-1])." },
    { term: "Reconstruction", definition: "Walking back through the full table to recover the actual LCS string." },
  ],

  concepts: {
    purpose:
      "Compute the longest sequence common to two strings — the basis of diff, merges, and alignment.",
    operations:
      "Fill dp[i][j] by matching (diagonal + 1) or mismatching (max of top/left); read dp[m][n].",
    uses:
      "File diffs, version control merges, DNA/protein alignment, plagiarism/similarity scoring, edit distance.",
    tradeoffs:
      "O(m·n) time/space; row-compressible to O(min(m,n)) for length only; keep the full table to reconstruct the string.",
    commonMistakes:
      "Off-by-one between string index (i-1) and table index (i); forgetting the zero base row/column; using the diagonal on a mismatch; confusing LCS with the contiguous longest common substring.",
    edgeCases:
      "Either string empty → LCS 0. No shared characters → 0. Identical strings → the full length.",
  },

  complexity: [
    { operation: "LCS (2D DP)", best: "O(m·n)", average: "O(m·n)", worst: "O(m·n)", space: "O(m·n)", note: "Fill (m+1)×(n+1) table; O(min(m,n)) with row compression (length only)." },
  ],

  complexityExplanation: {
    variables: [
      { symbol: "m", meaning: "the length of string a" },
      { symbol: "n", meaning: "the length of string b" },
    ],
    costModel: "Filling one cell is O(1) (a comparison and either an add or a max). Every cell is filled once.",
    time: {
      bound: "O(m·n)",
      case: "worst",
      explanation:
        "The nested loops fill each of the (m+1)(n+1) cells exactly once with constant work, so total time is O(m·n). There is no shortcut in the general case — every prefix pair may need to be considered.",
    },
    space: {
      bound: "O(m·n)",
      case: "worst",
      explanation:
        "The 2D table stores (m+1)(n+1) values. If only the length is needed, each row depends only on the previous row, so it compresses to O(min(m,n)); reconstructing the actual subsequence requires the full table.",
      inputOutputNote: "The single integer length is O(1); the O(m·n) space is the table.",
    },
    derivation: [
      { lines: [4], description: "Allocate the (m+1)×(n+1) table with a zero base row/column.", cost: "O(m·n)", dimension: "space" },
      { lines: [5, 6, 7, 8, 9, 10], description: "Nested loops fill each cell once via the match/mismatch fork.", cost: "O(m·n)", dimension: "time" },
      { lines: [11], description: "Read dp[m][n] — O(1).", cost: "O(1)", dimension: "time" },
    ],
    assumptions: [
      "String index i-1 maps to table index i (prefix a[:i]).",
      "The zero row/column base cases represent empty prefixes.",
      "Comparisons and arithmetic are O(1).",
    ],
    tradeoffs:
      "Row compression gives O(min(m,n)) space for the length alone; keeping the table costs O(m·n) but enables reconstruction. Unlike the O(|t|) is-subsequence check, LCS optimizes over all common subsequences, hence the table.",
    counters: [
      { label: "cells filled", definition: "executions of the match check (line 7)", countLines: [7] },
      { label: "mismatch maxes", definition: "executions of the mismatch line (line 10)", countLines: [10] },
    ],
    fixedDataNote:
      "For 'abcde' and 'ace' the 6×4 table yields LCS length 3. The O(m·n) bound describes how the fill scales with the two lengths.",
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

  bindings: [{ variable: "dp", model: "dp-table" }],

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
    "Change the mismatch rule to require contiguity and see it become longest common SUBSTRING.",
  ],

  exercises: [
    {
      id: "dplcs-complete-1",
      kind: "complete-code",
      prompt: "Complete the match/mismatch transition for LCS.",
      starterCode:
        "if a[i - 1] == b[j - 1]:\n    # TODO: extend the diagonal\n    pass\nelse:\n    # TODO: take the better neighbor\n    pass",
      expected:
        "if a[i - 1] == b[j - 1]:\n    dp[i][j] = dp[i - 1][j - 1] + 1\nelse:\n    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])",
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

  review: `**LCS** finds the longest subsequence common to two strings (order kept, gaps allowed). Its two-position state → a **2D** table \`dp[i][j]\` with the **match/mismatch fork**: on a match extend the **diagonal** (\`dp[i-1][j-1]+1\`), on a mismatch take **max(top, left)**; base row/column are 0; answer \`dp[m][n]\`. It's **O(m·n)** time and space, **compressible to O(min(m,n))** for the length, with the full table needed to reconstruct the string. For 'abcde'/'ace' the LCS is 'ace' → **3**.`,

  expectedOutput: "3\n",

  references: [
    {
      url: "https://en.wikipedia.org/wiki/Longest_common_subsequence",
      title: "Longest common subsequence — Wikipedia",
      section: "Dynamic programming recurrence and complexity",
      topic: "dp/lcs",
      purpose: "Confirm the match/mismatch recurrence, the empty-prefix base cases, and the O(m·n) time/space.",
      verifiedClaims: [
        "On a match dp[i][j] = dp[i-1][j-1] + 1; on a mismatch dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
        "The DP runs in O(m·n) time and space.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://leetcode.com/problems/longest-common-subsequence/editorial/",
      title: "Longest Common Subsequence — LeetCode editorial",
      section: "2D DP; row compression",
      topic: "dp/lcs",
      purpose: "Cross-check the table formulation and that space compresses to O(min(m,n)) for the length only.",
      verifiedClaims: [
        "The LCS length DP can be computed with a 2D table and compressed to O(min(m,n)) space.",
      ],
      accessDate: "2026-09-20",
    },
  ],
};
