/**
 * Lesson: DP — subsequences (is-subsequence check) (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "True\nFalse\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# A SUBSEQUENCE keeps the original order but may skip elements
# (it need NOT be contiguous, unlike a substring).
def is_subsequence(s, t):
    i = 0                       # pointer into s (the candidate subsequence)
    for ch in t:                # scan t left to right
        if i < len(s) and s[i] == ch:
            i += 1              # matched s[i]; advance to the next needed char
    return i == len(s)          # matched all of s in order?

print(is_subsequence("ace", "abcde"))   # a..c..e appears in order -> True
print(is_subsequence("aec", "abcde"))   # 'c' comes before 'e' in t -> False`;

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
    purpose:
      "Define subsequences (vs substrings) and test membership in linear time — the foundation for LCS/LIS DP.",
    operations:
      "Scan t once with a pointer into s; advance on each match; success if the whole of s is consumed in order.",
    uses:
      "Subsequence membership, streaming/matching filters, and as the structural basis for LCS, LIS, and edit-distance DP.",
    tradeoffs:
      "Membership is a trivial O(|t|) greedy scan; only optimization over subsequences (longest/count/best) needs DP.",
    commonMistakes:
      "Confusing subsequence with substring (requiring contiguity); forgetting the i < len(s) guard (index error); resetting i on a mismatch (only advance on a match).",
    edgeCases:
      "Empty s is a subsequence of anything (returns True immediately). s longer than t can never match. Repeated characters are handled by the single forward pointer.",
  },

  complexity: [
    { operation: "is-subsequence (two-pointer)", best: "O(1)", average: "O(|t|)", worst: "O(|t|)", space: "O(1)", note: "Best: s empty. One scan of t; two indices only." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the length of t (the text being scanned)" },
      { symbol: "m", meaning: "the length of s (the candidate subsequence)" },
    ],
    costModel:
      "Each character of t is examined once with O(1) work (a comparison and maybe a pointer bump).",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation:
        "The loop runs once per character of t, doing constant work each time. It never revisits characters, so the total time is proportional to |t| = n. (Best case O(1) when s is empty and we return immediately.)",
      otherCases: [
        { case: "best", bound: "O(1)", note: "Empty s: i already equals len(s), so it's a subsequence trivially." },
      ],
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation:
        "Only the pointer i and the loop variable are kept, regardless of string lengths. No table or extra structure is allocated.",
      inputOutputNote: "The strings s and t are inputs; the boolean result is O(1).",
    },
    derivation: [
      { lines: [4], description: "Initialise the pointer into s — O(1).", cost: "O(1)", dimension: "time" },
      { lines: [5, 6, 7], description: "Scan every character of t once, advancing i on matches.", cost: "O(n)", dimension: "time" },
      { lines: [4], description: "A single index variable — no growth with input size.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: [
      "Greedy earliest-match is safe: matching s[i] as early as possible in t never blocks a later match.",
      "Character comparison is O(1).",
      "We scan t left to right exactly once.",
    ],
    tradeoffs:
      "Membership needs no DP — the O(|t|) scan settles it in constant space. Optimizing over subsequences (longest common/increasing, counting distinct) is where DP tables (O(n·m) or O(n²)) become necessary.",
    counters: [
      { label: "characters scanned", definition: "executions of the loop body (line 6)", countLines: [6] },
      { label: "matches advanced", definition: "executions of the pointer-advance line (line 7)", countLines: [7] },
    ],
    fixedDataNote:
      "The two calls scan 'abcde' (length 5) each and return True then False. The O(n) bound describes how the scan scales with |t|.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: subsequence keeps order, allows skips." },
    { line: 2, executable: false, explanation: "Comment: contrast with contiguous substring." },
    { line: 3, executable: true, explanation: "Define is_subsequence(s, t)." },
    { line: 4, executable: true, explanation: "Pointer i marks the next character of s we still need." },
    { line: 5, executable: true, explanation: "Scan t from left to right." },
    { line: 6, executable: true, explanation: "If we still need characters and the current one matches s[i]..." },
    { line: 7, executable: true, explanation: "...advance i to require the next character of s." },
    { line: 8, executable: true, explanation: "s is a subsequence exactly when all of it was matched in order." },
    { line: 9, executable: false, explanation: "Blank line." },
    { line: 10, executable: true, explanation: "'ace' occurs in order within 'abcde' -> True." },
    { line: 11, executable: true, explanation: "'aec' fails because 'c' precedes 'e' in 'abcde' -> False." },
  ],

  bindings: [
    {
      variable: "t",
      model: "string",
      overlays: [{ role: "pointer", label: "i (into s)", source: "i" }],
    },
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

  review: `A **subsequence** deletes elements **without reordering** and may be **non-contiguous** — unlike a **substring**, which is contiguous. Membership is a greedy **two-pointer** scan of t (advance into s on each match): **O(|t|)** time, **O(1)** space, safe because earliest matches never hurt. Subsequence structure underpins the DP lessons that follow (**LCS**, **LIS**, edit distance), where *optimizing* over subsequences needs tables. The example returns **True** for 'ace' and **False** for 'aec'.`,

  expectedOutput: "True\nFalse\n",

  references: [
    {
      url: "https://leetcode.com/problems/is-subsequence/editorial/",
      title: "Is Subsequence — LeetCode editorial",
      section: "Two-pointer greedy scan",
      topic: "dp/subsequences",
      purpose: "Confirm the greedy two-pointer subsequence check runs in O(|t|) time and O(1) space, and its correctness.",
      verifiedClaims: [
        "Advancing a pointer into s on each match while scanning t decides subsequence membership in O(|t|).",
        "Greedy earliest matching is correct for subsequence membership.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://en.wikipedia.org/wiki/Subsequence",
      title: "Subsequence — Wikipedia",
      section: "Definition; contrast with substring",
      topic: "dp/subsequences",
      purpose: "Cross-check the definition of a subsequence (order-preserving, not necessarily contiguous) versus a substring.",
      verifiedClaims: [
        "A subsequence preserves order and may omit elements; it need not be contiguous, unlike a substring.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "39d7a6bda0e1dcce",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
