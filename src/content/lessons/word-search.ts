/**
 * Lesson: Word search (Trees and tries). Verified on CPython 3.14.
 * Output: "True\nFalse\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Word search: can 'word' be traced through adjacent grid cells?
def exist(board, word):
    if not word:
        return True
    if not board:
        return False
    rows, cols = len(board), len(board[0])
    if any(len(row) != cols for row in board):
        raise ValueError("board must be rectangular")
    if cols == 0:
        return False
    marker = object()
    def dfs(r, c, i):
        if i == len(word):
            return True                      # matched every character -> found
        if (r < 0 or r >= rows or c < 0 or c >= cols
                or board[r][c] != word[i]):
            return False                     # off-grid or wrong letter
        tmp = board[r][c]
        board[r][c] = marker                 # mark visited (avoid reuse)
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

  explanation: "**Word search** asks whether a word can follow side-adjacent grid cells without using one cell twice in the same path. Try each starting cell with DFS. After matching a character, temporarily mark its cell, explore four directions and restore the character before returning, including when a branch succeeds.\n\nThe marker is a unique object rather than a character such as #, so arbitrary word characters cannot collide with it. The empty word matches a zero-cell path. A nonempty word on an empty or zero-width board fails; a nonempty ragged board raises ValueError. After the full word is matched, success is checked before the next coordinate's bounds: no additional cell is needed.\n\nFor a rectangular m by n grid and word length L, worst-case search is O(m*n*3^L), plus O(m) shape validation. There are four choices for the first extension but at most three after that, because the immediately previous cell is marked. Active frames use O(L) auxiliary storage, bounded also by the number of cells. The board is input and is restored; the Boolean result is constant size. A trie can share prefix comparisons among many words for each explored grid path, but the same prefix may still occur on many different grid paths.",

  vocabulary: [
    { term: "Backtracking", definition: "Try a choice, recurse, then undo it to explore alternatives." },
    { term: "Grid DFS", definition: "Depth-first search over cells, moving to adjacent neighbours." },
    { term: "Visited marking", definition: "Temporarily marking a cell so a single path can't reuse it." },
    { term: "Restore / unwind", definition: "Putting a cell's value back after exploring — the 'back' in backtracking." },
    { term: "Branching factor", definition: "Up to 3 onward directions per step (can't revisit the previous cell)." },
  ],

  concepts: {
  "purpose": "Search a grid for a path spelling a word, using DFS with backtracking to reuse cells across attempts.",
  "operations": "From each cell, DFS the four neighbours matching characters; mark before recursing, restore after.",
  "uses": "Word search, path-in-grid problems, maze solving, and the template for subsets/permutations/N-Queens.",
  "tradeoffs": "Simple and general, but worst-case exponential O(m·n·3^L); a trie can speed up searching many words at once.",
  "commonMistakes": "Forgetting restoration on success or failure; using a marker that can equal a real character; indexing an empty board; reusing cells within one path. Check complete-word success before requesting another cell.",
  "edgeCases": "Empty word is True, including an empty board. Empty/zero-width board with a nonempty word is False. Ragged nonempty boards raise ValueError. Literal # and repeated characters are supported."
},

  complexity: [
  {
    "operation": "word search",
    "best": "O(m+L)",
    "worst": "O(m+m*n*3^L)",
    "space": "O(L)",
    "note": "L = word length; up to 3 branches per step from each of m*n starts."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "m",
      "meaning": "the number of grid rows"
    },
    {
      "symbol": "n",
      "meaning": "the number of grid columns"
    },
    {
      "symbol": "L",
      "meaning": "the length of the word being searched"
    }
  ],
  "costModel": "Each DFS step does O(1) work (bounds/letter check, mark/restore) and branches into up to 3 onward neighbours.",
  "time": {
    "bound": "O(m+m*n*3^L)",
    "case": "worst",
    "explanation": "We may start a DFS from each of the m·n cells. From a cell, the search can go in 3 new directions each step (it never returns to the cell it came from), for up to L steps — so each start explores up to 3^L paths. Multiplying gives the worst case O(m·n·3^L). In practice the letter check prunes most branches immediately, so it's far faster than the bound, but backtracking's worst case is genuinely exponential in L.",
    "otherCases": [
      {
        "case": "best",
        "bound": "O(1)",
        "note": "An empty word or an empty board returns before shape validation; a first-start successful nonempty search costs O(m+L)."
      }
    ]
  },
  "space": {
    "bound": "O(L)",
    "case": "worst",
    "explanation": "The recursion depth is at most L (one frame per matched character). The visited marking is done in place on the board, so it adds O(1) — not counting the recorded trace/visualization.",
    "inputOutputNote": "The board (m·n cells) is the input, modified in place and restored; the recursion stack is O(L)."
  },
  "derivation": [
    {
      "lines": [
        25,
        26,
        27
      ],
      "description": "Try a DFS from each of the m*n starting cells.",
      "cost": "O(m*n)",
      "dimension": "time"
    },
    {
      "lines": [
        21,
        22
      ],
      "description": "Each DFS branches into up to 3 directions per character for L steps: 3^L paths.",
      "cost": "O(m*n*3^L)",
      "dimension": "time"
    },
    {
      "lines": [
        13
      ],
      "description": "Recursion depth is at most L (one frame per matched character).",
      "cost": "O(L)",
      "dimension": "space"
    },
    {
      "lines": [
        8,
        9
      ],
      "description": "Validate row widths before searching a nonempty board.",
      "cost": "O(m)",
      "dimension": "time"
    }
  ],
  "assumptions": [
    "A nonempty board must be rectangular; entries and word elements are single-character strings.",
    "Character comparison and board indexing are constant cost. The unique object marker cannot equal a character.",
    "Recursion must fit Python’s depth limit. Restoration occurs before every normal DFS return."
  ],
  "tradeoffs": "Trie-guided DFS shares comparisons among dictionary words along an explored grid path; different grid paths can still repeat prefixes.",
  "counters": [
    {
      "label": "cells marked",
      "definition": "executions of board[r][c] = marker at line 20",
      "countLines": [
        20
      ]
    }
  ],
  "fixedDataNote": "The example finds ABF and rejects ABX. Rectangular-shape validation costs O(m), and backtracking has an O(m+m*n*3^L) upper bound for a nonempty L-character word.",
  "references": [
    {
      "url": "https://leetcode.com/problems/word-search/",
      "title": "LeetCode: Word Search",
      "section": "Description, examples, constraints",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "Neighbors share a side.",
        "One path cannot reuse a cell."
      ],
      "conventions": [
        "App extends the source domain to empty inputs and arbitrary character values."
      ],
      "accessDate": "2026-10-10"
    },
    {
      "url": "https://cp-algorithms.com/string/aho_corasick.html",
      "title": "CP Algorithms: trie construction",
      "section": "Construction of the trie",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "Paths share prefixes.",
        "Terminal flags distinguish complete words."
      ],
      "conventions": [
        "App uses dictionaries for arbitrary characters rather than a fixed 26-child array."
      ],
      "accessDate": "2026-10-10"
    }
  ]
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: trace the word through adjacent cells."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define exist(board, word)."
  },
  {
    "line": 3,
    "explanation": "An empty word is matched by taking no cells.",
    "executable": true
  },
  {
    "line": 4,
    "explanation": "Return success without indexing the board.",
    "executable": true
  },
  {
    "line": 5,
    "explanation": "A nonempty word cannot use an empty board.",
    "executable": true
  },
  {
    "line": 6,
    "explanation": "Return failure for no rows.",
    "executable": true
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Read the row count and first-row width after checking that rows exist."
  },
  {
    "line": 8,
    "explanation": "Validate rectangular input rather than indexing ragged rows during DFS.",
    "executable": true
  },
  {
    "line": 9,
    "explanation": "Reject a violated grid-shape precondition.",
    "executable": true
  },
  {
    "line": 10,
    "explanation": "A nonempty word cannot use a board with zero columns.",
    "executable": true
  },
  {
    "line": 11,
    "explanation": "Return failure for zero cells.",
    "executable": true
  },
  {
    "line": 12,
    "explanation": "Use a unique non-character marker so literal # characters remain safe.",
    "executable": true
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Define the DFS: r, c is the current cell, i the character index to match."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Base case: matched all characters."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Return True — the word is found."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "Dead-end check: off the grid..."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "...or the cell's letter doesn't match the needed character."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "Return False for a dead end."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "Save the cell's letter before marking."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Replace this character with a unique object, which cannot equal a word character."
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "Recurse into the four neighbours for the next character..."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "...succeeding if ANY direction completes the word."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "BACKTRACK: restore the cell for other paths."
  },
  {
    "line": 24,
    "executable": true,
    "explanation": "Return whether this cell led to a match."
  },
  {
    "line": 25,
    "executable": true,
    "explanation": "Try starting the search from every cell."
  },
  {
    "line": 26,
    "executable": true,
    "explanation": "Inner loop over columns."
  },
  {
    "line": 27,
    "executable": true,
    "explanation": "If a DFS from (r, c) matches the whole word..."
  },
  {
    "line": 28,
    "executable": true,
    "explanation": "...return True."
  },
  {
    "line": 29,
    "executable": true,
    "explanation": "No start cell worked → False."
  },
  {
    "line": 30,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 31,
    "executable": true,
    "explanation": "A 3x3 letter grid."
  },
  {
    "line": 32,
    "executable": true,
    "explanation": "'ABF' exists: A(0,0)->B(0,1)->F(1,1) → True."
  },
  {
    "line": 33,
    "executable": true,
    "explanation": "'ABX' has no valid path → False."
  }
],

  bindings: [
    { variable: "board", model: "matrix" },
  ],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "What breaks if you forget to restore the cell (board[r][c] = tmp) after exploring its neighbours?",
    "answer": "Cells consumed by a failed path remain marked with the unique marker object. Later alternatives cannot use them, so valid words can be missed.",
    "explanation": "Backtracking must unwind state so alternatives see the grid intact. Without the restore, a dead-end attempt permanently blocks cells, breaking subsequent searches."
  }
],

  experiments: [
    "Search 'ABFED' and trace how the path snakes through the grid.",
    "Remove the restore line and watch a valid word be missed.",
    "Add a used-set instead of in-place marking and compare.",
  ],

  exercises: [
  {
    "id": "ws-fix-1",
    "kind": "fix-mistake",
    "prompt": "`exist(board, word)` returns whether `word` can be formed along 4-directionally adjacent cells (no cell reused). This DFS never restores a cell, so paths block each other. Add the backtracking restore.",
    "starterCode": "def exist(board, word):\n    if not word:\n        return True\n    if not board:\n        return False\n    rows, cols = len(board), len(board[0])\n    if any(len(row) != cols for row in board):\n        raise ValueError('board must be rectangular')\n    if cols == 0:\n        return False\n    marker = object()\n    def dfs(r, c, i):\n        if i == len(word):\n            return True\n        if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[i]:\n            return False\n        tmp = board[r][c]\n        board[r][c] = marker\n        found = dfs(r+1, c, i+1) or dfs(r-1, c, i+1) or dfs(r, c+1, i+1) or dfs(r, c-1, i+1)\n        # TODO: restore board[r][c] before returning\n        return found\n    return any(dfs(r, c, 0) for r in range(rows) for c in range(cols))",
    "expected": "def exist(board, word):\n    if not word:\n        return True\n    if not board:\n        return False\n    rows, cols = len(board), len(board[0])\n    if any(len(row) != cols for row in board):\n        raise ValueError('board must be rectangular')\n    if cols == 0:\n        return False\n    marker = object()\n    def dfs(r, c, i):\n        if i == len(word):\n            return True\n        if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[i]:\n            return False\n        tmp = board[r][c]\n        board[r][c] = marker\n        found = dfs(r+1, c, i+1) or dfs(r-1, c, i+1) or dfs(r, c+1, i+1) or dfs(r, c-1, i+1)\n        board[r][c] = tmp\n        return found\n    return any(dfs(r, c, 0) for r in range(rows) for c in range(cols))",
    "hints": [
      "The word is matched along one path and each cell may occur once in that path.",
      "A failed start must leave the board unchanged for another start.",
      "Save the original character before replacing it with the unique marker.",
      "Compute the branch result, restore the saved character, then return the result.",
      "tmp = board[r][c]; board[r][c] = marker; found = explore(); board[r][c] = tmp; return found.",
      "Restoring before returning preserves the board on both successful and failed searches."
    ],
    "tests": "assert exist([list('ABCE'), list('SFCS'), list('ADEE')], 'ABCCED') is True\nassert exist([list('ABCE'), list('SFCS'), list('ADEE')], 'SEE') is True\nassert exist([list('ABCE'), list('SFCS'), list('ADEE')], 'ABCB') is False, 'cannot reuse a cell'\n# Missing-restore bug: a dead-end path marks cells '#'; without restoring them a\n# later correct path cannot reuse those cells. On this board 'AAB' is reachable\n# ONLY if cells are restored after each failed branch (no-restore returns False).\nassert exist([['C','A','A'],['A','A','A'],['B','C','D']], 'AAB') is True, 'needs cells restored after a dead-end path'\nassert exist([['A','A'],['A','A']], 'AAAAA') is False, 'only 4 cells, no reuse'\nassert exist([['A']], 'A') is True\nassert exist([['A']], 'B') is False\nprint('OK')\nassert exist([], '') is True\nassert exist([], 'A') is False\nassert exist([[]], 'A') is False\nb=[['#','A']]\nassert exist(b,'#A#') is False\nassert b==[['#','A']]\nassert exist(b,'#A') is True\nassert b==[['#','A']]\ntry:\n exist([['A'],[]],'A')\nexcept ValueError:\n pass\nelse:\n raise AssertionError('reject ragged rows')"
  },
  {
    "id": "ws-choose-1",
    "kind": "choose-approach",
    "prompt": "You must search a grid for MANY words at once. Repeated single-word DFS or a trie-guided DFS? Why?",
    "expected": "Build a trie and use trie-guided grid DFS so words share prefix comparisons along each explored path. Prefixes can still be explored on different grid paths; no global one-visit guarantee exists.",
    "hints": [
      "Goal: search a grid for MANY words at once, deciding between repeated single-word DFS and a trie-guided DFS.",
      "The costly repetition is a separate DFS per word, re-exploring shared prefixes over and over at O(m·n·3^L) each.",
      "Key property: many search words share common prefixes, so their grid exploration can be done once.",
      "Approach: build a trie of all words and run one DFS over the grid guided by the trie.",
      "Reasoning: the trie prunes to only paths that extend some word's prefix, exploring each shared prefix once (Word Search II), rather than paying the per-word cost repeatedly.",
      "Answer: a trie of all words with one trie-guided DFS (Word Search II) — shared prefixes are explored once instead of O(m·n·3^L) per word."
    ],
    "recognition": {
      "scenario": "You must search a character grid for MANY words at once, deciding whether to search each word separately or share work across them.",
      "approaches": [
        {
          "id": "trie-guided-dfs",
          "label": "Build a trie of all words and run one trie-guided DFS",
          "requiredReasonIds": [
            "shared-prefix-once"
          ]
        },
        {
          "id": "repeated-single-dfs",
          "label": "Run a separate single-word DFS for each word",
          "requiredReasonIds": [],
          "rejectionFeedback": "Searching each word independently re-explores the same grid paths once per word (O(m·n·3^L) each), wasting the work shared by common prefixes."
        }
      ],
      "reasons": [
        {
          "id": "shared-prefix-once",
          "text": "A trie shares comparisons among words along each grid path, pruning a path when no dictionary prefix can continue; different grid paths can still repeat a prefix."
        },
        {
          "id": "words-no-shared-prefixes",
          "text": "The words share no prefixes, so a trie saves nothing over separate searches.",
          "contradictory": true
        },
        {
          "id": "trie-slower-per-word",
          "text": "A trie-guided DFS is slower than repeating single-word DFS because the trie adds overhead.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "trie-guided-dfs"
      ],
      "modelExplanation": "Build a trie of all the words and run one DFS (Word Search II): walk the grid guided by the trie so shared prefixes are explored once, instead of paying O(m·n·3^L) separately per word."
    }
  }
],

  review: "Grid word search explores four adjacent cells, marks each selected cell with a unique object, and restores it before every normal success or failure return. A cell cannot be reused on one candidate path. The empty word is found; a nonempty word on an empty board is not. With rectangular validation the worst upper bound is O(m+m*n*3^L), with O(L) recursive working frames. A marker character such as # would collide with valid board characters.",

  expectedOutput: "True\nFalse\n",

  references: [
  {
    "url": "https://leetcode.com/problems/word-search/",
    "title": "LeetCode: Word Search",
    "section": "Description, examples, constraints",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "Neighbors share a side.",
      "One path cannot reuse a cell."
    ],
    "conventions": [
      "App extends the source domain to empty inputs and arbitrary character values."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://cp-algorithms.com/string/aho_corasick.html",
    "title": "CP Algorithms: trie construction",
    "section": "Construction of the trie",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "Paths share prefixes.",
      "Terminal flags distinguish complete words."
    ],
    "conventions": [
      "App uses dictionaries for arbitrary characters rather than a fixed 26-child array."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "745fc48ded2a7c80",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
