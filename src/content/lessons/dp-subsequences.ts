/**
 * Lesson: DP — subsequences (is-subsequence check) (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "True\nFalse\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# A subsequence preserves order while allowing skipped characters.
def is_subsequence(s, t):
    if not s:
        return True
    i = 0
    for j, ch in enumerate(t):
        if s[i] == ch:
            i += 1
            if i == len(s):
                return True
    return False

print(is_subsequence("ace", "abcde"))
print(is_subsequence("aec", "abcde"))`;

export const dpSubsequences: LessonDefinition = {
  id: "dp-subsequences",
  title: "DP: Subsequences",
  area: "DP and recursion",
  prerequisites: ["string-two-pointers"],

  explanation: `A **subsequence** is what you get by deleting **zero or more** elements from a sequence **without reordering** the rest. \`"ace"\` is a subsequence of \`"abcde"\` (keep a, c, e; drop b, d), but \`"aec"\` is **not**, because in \`"abcde"\` the \`c\` appears **before** the \`e\` — the required order can't be honored. The crucial contrast: a **subsequence** may be **non-contiguous** (gaps allowed), whereas a **substring** must be a **contiguous** block. That single distinction changes which technique applies.

Checking whether \`s\` is a subsequence of \`t\` is a clean **greedy two-pointer** scan. Keep a pointer \`i\` into \`s\`; walk through \`t\` once; whenever the current character of \`t\` matches \`s[i]\`, advance \`i\`. If you consume all of \`s\` this way, it's a subsequence. Greedy works here because matching the **earliest** possible character in \`t\` never hurts — it leaves the most of \`t\` available for the rest of \`s\`. This is **O(|t|)** time and **O(1)** space.

Why is this in a DP unit? Because subsequence *structure* is the backbone of major DP problems: the **longest common subsequence** and **longest increasing subsequence** (upcoming lessons) both optimize over subsequences with 2D/1D tables, and edit distance is a close cousin. The simple check here builds the right intuition — "keep order, allow skips" — and shows that not every subsequence question needs a table: a plain scan settles membership, while *optimizing* over subsequences (longest, count, best) is where DP earns its keep. The example returns \`True\` then \`False\`.`,

  vocabulary: [
    { term: "Subsequence", definition: "A sequence formed by deleting some elements without changing the order of the rest." },
    { term: "Substring", definition: "A contiguous block of a string — no gaps allowed (contrast with subsequence)." },
    { term: "Two-pointer scan", definition: "Advancing one pointer through t and another through s to test membership." },
    { term: "Greedy match", definition: "Matching the earliest possible character, which is safe for subsequence checks." },
    { term: "Order-preserving", definition: "Elements keep their relative order; only deletions are allowed." },
  ],

  concepts: {
  "purpose": "Define subsequences (vs substrings) and test membership in linear time — the foundation for LCS/LIS DP.",
  "operations": "Scan t once with a pointer into s; advance on each match; success if the whole of s is consumed in order.",
  "uses": "Subsequence membership, streaming/matching filters, and as the structural basis for LCS, LIS, and edit-distance DP.",
  "tradeoffs": "Earliest-match membership uses linear scanning and constant scalar storage. Optimizing or counting subsequences needs a separate algorithm; DP tables are one option, not universally necessary.",
  "commonMistakes": "Confusing subsequence with substring; failing to stop after matching all of s and then indexing past its end; resetting the candidate index on a mismatch.",
  "edgeCases": "Empty s returns True without scanning t. Nonempty s with empty t returns False. Repeated characters need separate ordered matches. Inputs are strings."
},

  complexity: [
    { operation: "is-subsequence (two-pointer)", best: "O(1)", average: "O(|t|)", worst: "O(|t|)", space: "O(1)", note: "Best: s empty. One scan of t; two indices only." },
  ],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the length of t (the text being scanned)"
    },
    {
      "symbol": "m",
      "meaning": "the length of s (the candidate subsequence)"
    }
  ],
  "costModel": "Each character of t is examined once with O(1) work (a comparison and maybe a pointer bump).",
  "time": {
    "bound": "O(n+1)",
    "case": "worst",
    "explanation": "Each examined t character takes constant work, and no character is revisited. At most n are examined: O(n+1), or O(n) for growing positive lengths. Empty s returns immediately in O(1); a candidate completed early stops the scan.",
    "otherCases": [
      {
        "case": "best",
        "bound": "O(1)",
        "note": "Empty s: i already equals len(s), so it's a subsequence trivially."
      }
    ]
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Only candidate index i, text index j, and the current character are retained. enumerate does not copy the text.",
    "inputOutputNote": "The strings s and t are inputs; the boolean result is O(1)."
  },
  "derivation": [
    {
      "lines": [
        3,
        4,
        5
      ],
      "description": "Handle empty candidate and initialize i.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        6,
        7,
        8,
        9,
        10,
        11
      ],
      "description": "Examine at most n text characters, stopping once all are matched.",
      "cost": "O(n+1)",
      "dimension": "time"
    },
    {
      "lines": [
        5,
        6
      ],
      "description": "Constant number of scalar positions and current character.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Greedy earliest-match is safe: matching s[i] as early as possible in t never blocks a later match.",
    "Character comparison is O(1).",
    "We scan t left to right exactly once.",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "Subsequence membership has a greedy earliest-match proof and needs no table. Optimization/counting variants need their own state and correctness proof; quadratic LIS DP is one option, and faster LIS algorithms also exist.",
  "counters": [
    {
      "label": "characters examined",
      "definition": "Entries to the match test, before it executes. Recorded line entries at 7 occur before the operation completes.",
      "countLines": [
        7
      ]
    },
    {
      "label": "matches advanced",
      "definition": "Entries to the candidate-index increment. Recorded line entries at 8 occur before the operation completes.",
      "countLines": [
        8
      ]
    }
  ],
  "fixedDataNote": "The two calls scan 'abcde' (length 5) each and return True then False. The O(n) bound describes how the scan scales with |t|. Function analysis excludes demonstration input literals, imports, printing and tracer storage. A line event shows the next operation before it completes."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: a subsequence preserves the original order."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define the membership test for two strings."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Check the empty candidate before scanning t."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Every string contains the empty subsequence."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "i is the next unmatched index in s."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Visit each character of t with its actual text index j."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Test whether this character matches the next needed s character."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Advance the candidate index after a match."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Test whether the match completed the candidate."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Return immediately once all candidate characters are matched."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "The scan ended before all matches: return False."
  },
  {
    "line": 12,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Print True for ace in abcde."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Print False for aec in abcde."
  }
],

  bindings: [
  {
    "variable": "s",
    "model": "string",
    "overlays": [
      {
        "role": "pointer",
        "label": "i (next candidate)",
        "source": "i"
      }
    ]
  },
  {
    "variable": "t",
    "model": "string",
    "overlays": [
      {
        "role": "pointer",
        "label": "j (text index)",
        "source": "j"
      }
    ]
  }
],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "Is 'aec' a subsequence of 'abcde'? Explain using the order rule.",
      answer: "No. A subsequence must preserve order. In 'abcde', 'e' appears after 'c', so to keep 'a','e','c' you'd need 'c' after 'e' — impossible without reordering.",
      explanation: "Subsequences allow skips but not reordering. The scan matches a, then e, then can't find a c after e's position, so i never reaches len(s).",
    },
  ],

  experiments: [
    "Print i as t is scanned to watch it advance only on matches.",
    "Test is_subsequence('', 'abc') and confirm it returns True immediately.",
    "Change the check to require contiguity and see how it becomes a substring test instead.",
  ],

  exercises: [
    {
      id: "dpsub-complete-1",
      kind: "complete-code",
      prompt: "Complete the greedy two-pointer subsequence check.",
      starterCode:
        "def is_subsequence(s, t):\n    i = 0\n    for ch in t:\n        # TODO: advance i when s[i] matches ch\n        pass\n    return i == len(s)",
      expected:
        "def is_subsequence(s, t):\n    i = 0\n    for ch in t:\n        if i < len(s) and s[i] == ch:\n            i += 1\n    return i == len(s)",
      hints: [
        "Only advance i on a match.",
        "Guard with i < len(s) to avoid an index error.",
        "if i < len(s) and s[i] == ch: i += 1",
      ],
    },
    {
      id: "dpsub-choose-1",
      kind: "choose-approach",
      prompt: "Distinguish: (a) 'does s appear in t keeping order but allowing gaps?' vs (b) 'does s appear in t as a contiguous block?'. Which is a subsequence check and which is a substring search?",
      expected: "(a) subsequence — greedy two-pointer scan, O(|t|). (b) substring — contiguous match (e.g. `s in t` or KMP), a different problem.",
      hints: [
        "Gaps allowed → subsequence.",
        "Contiguous → substring.",
        "Different techniques for each.",
      ],
    },
    {
      id: "dpsub-predict-1",
      kind: "predict-state",
      prompt: "When scanning 'abcde' for 'ace', what is the final value of i and why does it mean True?",
      expected: "i ends at 3 = len('ace'); all three characters matched in order, so it's a subsequence.",
      hints: [
        "i advances on a, c, e.",
        "len('ace') is 3.",
        "i == len(s) means success.",
      ],
    },
  ],

  review: "Subsequence deletion preserves order and permits gaps; a substring is contiguous. The greedy scan matches each needed character as early as possible, leaving the largest remaining text suffix for later matches. Empty s returns immediately; completion returns early. The candidate diagram uses i into s and the text diagram uses j into t. At most |t| characters are examined, with constant scalar storage.",

  expectedOutput: "True\nFalse\n",

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
    "url": "https://leetcode.com/problems/is-subsequence/description/",
    "title": "LeetCode: Is Subsequence",
    "section": "Problem definition, examples and constraints",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "A subsequence permits deletion without changing remaining order; empty strings are permitted."
    ],
    "conventions": [],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/28461a74f81101874a13d9679a40584d_MIT6_006S20_lec16.pdf",
    "title": "MIT 6.006 lecture 16",
    "section": "LIS and LCS state definitions",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Subsequence optimization differs from checking one prescribed candidate."
    ],
    "conventions": [
      "Membership uses greedy earliest matches; LIS/LCS need separate recurrences."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "a9d93f887df378a0",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
