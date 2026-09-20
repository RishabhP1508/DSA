/**
 * Lesson: Word search (Trees and tries). Verified on CPython 3.14.
 * Output: "True\nFalse\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Word search: can 'word' be traced through adjacent grid cells?
def exist(board, word):
    rows, cols = len(board), len(board[0])
    def dfs(r, c, i):
        if i == len(word):
            return True                      # matched every character -> found
        if (r < 0 or r >= rows or c < 0 or c >= cols
                or board[r][c] != word[i]):
            return False                     # off-grid or wrong letter
        tmp = board[r][c]
        board[r][c] = "#"                    # mark visited (avoid reuse)
        found = (dfs(r + 1, c, i + 1) or dfs(r - 1, c, i + 1)
                 or dfs(r, c + 1, i + 1) or dfs(r, c - 1, i + 1))
        board[r][c] = tmp                    # BACKTRACK: restore the cell
        return found
    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0):
                return True
    return False

board = [["A", "B", "C"], ["S", "F", "E"], ["A", "D", "E"]]
print(exist(board, "ABF"))
print(exist(board, "ABX"))`;

export const wordSearch: LessonDefinition = {
  id: "word-search",
  title: "Word Search (Grid DFS + Backtracking)",
  area: "Trees and tries",
  prerequisites: ["tree-dfs", "matrix-traversal"],

  explanation: `**Word search** asks whether a word can be spelled by moving through **adjacent** (up/down/left/right) grid cells, never reusing a cell. It's solved with **DFS plus backtracking**: from each starting cell, try to match the word character by character, exploring the four neighbours, and **undo** each choice when it fails so other paths can reuse those cells.

The backtracking discipline is the crucial part. Before recursing into a cell's neighbours, we **mark the cell as visited** (here by overwriting it with \`"#"\`); after exploring all four directions, we **restore its original value** (\`board[r][c] = tmp\`). That restore is what "backtracking" means — the state is unwound so a different path (or a different start cell) sees the grid intact. Without it, cells consumed by a failed attempt would stay blocked. The base cases are: matched all characters (success), or off-grid / wrong letter (dead end).

Complexity is the honest scary part of backtracking. From each of the \`m·n\` starting cells, the search branches up to 3 ways per step (can't go back where it came) for up to L steps, giving a worst case of **O(m·n·3ᴸ)** time. Space is **O(L)** for the recursion depth (plus O(1) for the in-place marking). This "explore, mark, recurse, unmark" template is the foundation for the backtracking topic (subsets, permutations, N-Queens) coming next.`,

  vocabulary: [
    { term: "Backtracking", definition: "Try a choice, recurse, then undo it to explore alternatives." },
    { term: "Grid DFS", definition: "Depth-first search over cells, moving to adjacent neighbours." },
    { term: "Visited marking", definition: "Temporarily marking a cell so a single path can't reuse it." },
    { term: "Restore / unwind", definition: "Putting a cell's value back after exploring — the 'back' in backtracking." },
    { term: "Branching factor", definition: "Up to 3 onward directions per step (can't revisit the previous cell)." },
  ],

  concepts: {
    purpose: "Search a grid for a path spelling a word, using DFS with backtracking to reuse cells across attempts.",
    operations: "From each cell, DFS the four neighbours matching characters; mark before recursing, restore after.",
    uses: "Word search, path-in-grid problems, maze solving, and the template for subsets/permutations/N-Queens.",
    tradeoffs: "Simple and general, but worst-case exponential O(m·n·3^L); a trie can speed up searching many words at once.",
    commonMistakes: "Forgetting to restore the cell (blocks future paths); allowing reuse within one path; wrong base-case order (check bounds/letter before recursing).",
    edgeCases: "Word longer than the grid can't be found. Single-cell word matches one cell. Repeated letters need the visited marking to avoid reuse.",
  },

  complexity: [
    { operation: "word search", best: "O(m*n)", average: "O(m*n*3^L)", worst: "O(m*n*3^L)", space: "O(L)", note: "L = word length; up to 3 branches per step from each of m*n starts." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "m", meaning: "the number of grid rows" },
      { symbol: "n", meaning: "the number of grid columns" },
      { symbol: "L", meaning: "the length of the word being searched" },
    ],
    costModel: "Each DFS step does O(1) work (bounds/letter check, mark/restore) and branches into up to 3 onward neighbours.",
    time: {
      bound: "O(m*n*3^L)",
      case: "worst",
      explanation: "We may start a DFS from each of the m·n cells. From a cell, the search can go in 3 new directions each step (it never returns to the cell it came from), for up to L steps — so each start explores up to 3^L paths. Multiplying gives the worst case O(m·n·3^L). In practice the letter check prunes most branches immediately, so it's far faster than the bound, but backtracking's worst case is genuinely exponential in L.",
      otherCases: [
        { case: "best", bound: "O(m*n)", note: "The first letter matches nowhere (or matches and immediately fails), so each start dies quickly." },
      ],
    },
    space: {
      bound: "O(L)",
      case: "worst",
      explanation: "The recursion depth is at most L (one frame per matched character). The visited marking is done in place on the board, so it adds O(1) — not counting the recorded trace/visualization.",
      inputOutputNote: "The board (m·n cells) is the input, modified in place and restored; the recursion stack is O(L).",
    },
    derivation: [
      { lines: [16, 17, 18], description: "Try a DFS from each of the m*n starting cells.", cost: "O(m*n)", dimension: "time" },
      { lines: [12, 13], description: "Each DFS branches into up to 3 directions per character for L steps: 3^L paths.", cost: "O(m*n*3^L)", dimension: "time" },
      { lines: [4], description: "Recursion depth is at most L (one frame per matched character).", cost: "O(L)", dimension: "space" },
    ],
    assumptions: ["Bounds/letter checks and mark/restore are O(1).", "Branching is 3 (not 4) since the search never returns to the immediately previous cell.", "The board is modified in place and restored via backtracking."],
    tradeoffs: "For searching MANY words in one grid, build a trie of the words and DFS once against it (Word Search II), avoiding a separate O(m·n·3^L) search per word.",
    counters: [],
    fixedDataNote: "This run finds 'ABF' (True) via A(0,0)->B(0,1)->F(1,1), and rejects 'ABX' (False). The O(m·n·3^L) bound is the exponential worst case backtracking can hit.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: trace the word through adjacent cells." },
    { line: 2, executable: true, explanation: "Define exist(board, word)." },
    { line: 3, executable: true, explanation: "Grid dimensions." },
    { line: 4, executable: true, explanation: "Define the DFS: r, c is the current cell, i the character index to match." },
    { line: 5, executable: true, explanation: "Base case: matched all characters." },
    { line: 6, executable: true, explanation: "Return True — the word is found." },
    { line: 7, executable: true, explanation: "Dead-end check: off the grid..." },
    { line: 8, executable: true, explanation: "...or the cell's letter doesn't match the needed character." },
    { line: 9, executable: true, explanation: "Return False for a dead end." },
    { line: 10, executable: true, explanation: "Save the cell's letter before marking." },
    { line: 11, executable: true, explanation: "Mark visited so this path can't reuse the cell." },
    { line: 12, executable: true, explanation: "Recurse into the four neighbours for the next character..." },
    { line: 13, executable: true, explanation: "...succeeding if ANY direction completes the word." },
    { line: 14, executable: true, explanation: "BACKTRACK: restore the cell for other paths." },
    { line: 15, executable: true, explanation: "Return whether this cell led to a match." },
    { line: 16, executable: true, explanation: "Try starting the search from every cell." },
    { line: 17, executable: true, explanation: "Inner loop over columns." },
    { line: 18, executable: true, explanation: "If a DFS from (r, c) matches the whole word..." },
    { line: 19, executable: true, explanation: "...return True." },
    { line: 20, executable: true, explanation: "No start cell worked → False." },
    { line: 21, executable: false, explanation: "Blank line." },
    { line: 22, executable: true, explanation: "A 3x3 letter grid." },
    { line: 23, executable: true, explanation: "'ABF' exists: A(0,0)->B(0,1)->F(1,1) → True." },
    { line: 24, executable: true, explanation: "'ABX' has no valid path → False." },
  ],

  bindings: [
    { variable: "board", model: "matrix" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "What breaks if you forget to restore the cell (board[r][c] = tmp) after exploring its neighbours?", answer: "Cells consumed by a failed path stay marked '#', so other paths and other starting cells can't use them — causing valid words to be missed.", explanation: "Backtracking must unwind state so alternatives see the grid intact. Without the restore, a dead-end attempt permanently blocks cells, breaking subsequent searches." },
  ],

  experiments: [
    "Search 'ABFED' and trace how the path snakes through the grid.",
    "Remove the restore line and watch a valid word be missed.",
    "Add a used-set instead of in-place marking and compare.",
  ],

  exercises: [
    {
      id: "ws-fix-1",
      kind: "fix-mistake",
      prompt: "This DFS never restores the cell, so paths block each other. Add the backtracking restore.",
      starterCode: "tmp = board[r][c]\nboard[r][c] = '#'\nfound = (dfs(r+1,c,i+1) or dfs(r-1,c,i+1) or dfs(r,c+1,i+1) or dfs(r,c-1,i+1))\nreturn found",
      expected: "tmp = board[r][c]\nboard[r][c] = '#'\nfound = (dfs(r+1,c,i+1) or dfs(r-1,c,i+1) or dfs(r,c+1,i+1) or dfs(r,c-1,i+1))\nboard[r][c] = tmp\nreturn found",
      hints: ["After exploring neighbours, other paths must see the cell again.", "Put the saved value back.", "board[r][c] = tmp before returning."],
    },
    {
      id: "ws-choose-1",
      kind: "choose-approach",
      prompt: "You must search a grid for MANY words at once. Repeated single-word DFS or a trie-guided DFS? Why?",
      expected: "A trie of all the words with one DFS (Word Search II): walk the grid guided by the trie so shared prefixes are explored once, instead of paying O(m·n·3^L) separately per word.",
      hints: ["Words often share prefixes.", "A trie explores shared prefixes once.", "Trie-guided DFS beats per-word searches."],
    },
  ],

  review: `**Word search** uses **grid DFS + backtracking**: from each cell, match the word through adjacent neighbours, **marking a cell before recursing and restoring it after** so failed paths free their cells. Base cases are full match (success) and off-grid/wrong-letter (dead end). Worst case is exponential **O(m·n·3ᴸ)** time with **O(L)** recursion depth. This explore-mark-recurse-unmark template drives the whole backtracking family (subsets, permutations, N-Queens).`,

  expectedOutput: "True\nFalse\n",

  references: [
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Backtracking / Tries — Word Search (I and II)",
      topic: "trees/word-search",
      purpose: "Confirm the grid DFS + backtracking approach, its O(m·n·3^L) worst case, and the trie speedup for many words.",
      verifiedClaims: ["Word search is grid DFS with backtracking (mark/restore); worst case O(m·n·3^L); a trie accelerates multi-word search"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://cp-algorithms.com/graph/depth-first-search.html",
      title: "Depth First Search — CP-Algorithms",
      section: "DFS with state restoration (backtracking)",
      topic: "trees/word-search",
      purpose: "Cross-check the backtracking pattern of marking and restoring state during DFS.",
      verifiedClaims: ["Backtracking DFS marks state before recursing and restores it afterward"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "015e93d19bb7d2c2",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
