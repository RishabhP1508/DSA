/**
 * Lesson: Strings — KMP string matching.
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "[0, 0, 1, 2, 3, 0, 1]\n[10]\n[0, 1, 2, 3]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# KMP: find all occurrences of pattern in text in O(n + m), never re-scanning text.
# Step 1: the LPS array — lps[i] = length of the longest proper prefix of
# pattern[:i+1] that is also a suffix. It tells us how far to fall back on a mismatch.
def build_lps(pattern):
    lps = [0] * len(pattern)
    length = 0                       # length of the current matching prefix
    i = 1
    while i < len(pattern):
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length > 0:
            length = lps[length - 1]  # fall back within the pattern (no restart)
        else:
            lps[i] = 0
            i += 1
    return lps

def kmp_search(text, pattern):
    if not pattern:
        return []
    lps = build_lps(pattern)
    res = []
    i = j = 0                         # i scans text, j scans pattern
    while i < len(text):
        if text[i] == pattern[j]:
            i += 1
            j += 1
            if j == len(pattern):     # full match ending at i-1
                res.append(i - j)
                j = lps[j - 1]        # continue searching for overlaps
        elif j > 0:
            j = lps[j - 1]            # reuse the matched prefix; i does NOT move back
        else:
            i += 1
    return res

print(build_lps("ababaca"))
print(kmp_search("ababcabcabababd", "ababd"))
print(kmp_search("aaaaa", "aa"))`;

export const kmp: LessonDefinition = {
  id: "kmp",
  title: "Strings: KMP String Matching",
  area: "Strings",
  prerequisites: ["substrings", "string-two-pointers"],

  explanation: `**KMP** (Knuth–Morris–Pratt) finds every occurrence of a pattern of length \`m\` in a text of length \`n\` in **O(n + m)** time — without ever moving the text pointer **backward**. The naive approach, on a mismatch, slides the pattern one step and rescans from where it started; on adversarial inputs like text \`"aaa…a"\` with pattern \`"aa…ab"\` that costs **O(n·m)**. KMP removes the wasted rescans by **precomputing how the pattern matches itself**.

That precomputation is the **LPS array** ("longest proper prefix which is also a suffix"): \`lps[i]\` is the length of the longest **proper** prefix of \`pattern[:i+1]\` that is also a **suffix** of it. Intuitively, when a mismatch happens after matching \`j\` characters, we already know those \`j\` matched characters *are* the pattern's own prefix — so the longest prefix-that-is-also-a-suffix tells us the **most we can keep** without rechecking. We set \`j = lps[j-1]\` and try again, never touching \`i\`. Building the LPS is itself a clever self-match in **O(m)**; for \`"ababaca"\` it is \`[0, 0, 1, 2, 3, 0, 1]\` (e.g. at index 4 the prefix \`"aba"\` of length 3 is also a suffix of \`"ababa"\`).

The search then walks the text once with two pointers \`i\` (text) and \`j\` (pattern): advance both on a match, and on a full match (\`j == m\`) record the start \`i − j\` and fall back via \`lps\`; on a mismatch fall back \`j\` (or advance \`i\` if \`j\` is already 0). Because \`i\` only ever moves **forward**, the total work is **O(n + m)** with **O(m)** extra space for the LPS. In the examples, \`"ababd"\` occurs once starting at index **10**, and \`"aa"\` occurs at **[0, 1, 2, 3]** in \`"aaaaa"\` — note the **overlapping** matches, which KMP finds naturally because it resumes from \`lps\` rather than skipping past a whole match. KMP is the classic linear-time exact matcher and the gateway to more advanced string algorithms.`,

  vocabulary: [
    { term: "KMP", definition: "Knuth–Morris–Pratt: exact substring search in O(n + m) with no text backtracking." },
    { term: "LPS array", definition: "lps[i] = length of the longest proper prefix of pattern[:i+1] that is also its suffix." },
    { term: "Proper prefix", definition: "A prefix that is not the whole string (so it excludes the full string itself)." },
    { term: "Fallback", definition: "On a mismatch, setting j = lps[j-1] to reuse the already-matched prefix instead of restarting." },
    { term: "No text backtracking", definition: "The text index i never decreases, which is what guarantees linear time." },
    { term: "Overlapping matches", definition: "Occurrences that share characters; KMP finds them by resuming from lps after a match." },
  ],

  concepts: {
    purpose:
      "Search for all occurrences of a pattern in linear time by precomputing the pattern's self-overlap (LPS).",
    operations:
      "build_lps precomputes fallbacks in O(m); kmp_search scans the text once, advancing on matches and falling back via lps on mismatches.",
    uses:
      "Substring search, finding all (including overlapping) occurrences, plagiarism/log scanning, streaming matching, building blocks for other string algorithms.",
    tradeoffs:
      "Guaranteed O(n + m) vs naive O(n·m); costs O(m) preprocessing and space, and is more subtle to implement than a naive scan.",
    commonMistakes:
      "Moving the text pointer backward (defeats the purpose); off-by-one in lps (it is longest PROPER prefix-suffix); restarting j at 0 on mismatch instead of lps[j-1]; not handling the empty pattern.",
    edgeCases:
      "Empty pattern → no occurrences (returns []). Pattern longer than text → no matches. Overlapping occurrences are reported (e.g. 'aa' in 'aaaaa').",
  },

  complexity: [
    { operation: "build LPS", best: "O(m)", average: "O(m)", worst: "O(m)", space: "O(m)", note: "Amortized single pass over the pattern." },
    { operation: "KMP search", best: "O(n + m)", average: "O(n + m)", worst: "O(n + m)", space: "O(m)", note: "Text pointer never moves backward." },
    { operation: "naive search (contrast)", best: "O(n)", average: "O(n·m)", worst: "O(n·m)", note: "Rescans the text on each mismatch." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the length of the text" },
      { symbol: "m", meaning: "the length of the pattern" },
    ],
    costModel:
      "Character comparisons are O(1). Each fallback strictly decreases j, and each match increases j by 1, so total fallbacks are bounded by total matches — an amortization argument.",
    time: {
      bound: "O(n + m)",
      case: "worst",
      explanation:
        "Building the LPS is O(m): although the fall-back line can run multiple times, each fallback lowers `length`, and `length` only rises one step per matched character, so the total work is linear in m (amortized). The search is O(n): the text index i never moves backward and increases at least once per outer step that isn't a pure fallback; j's fallbacks are likewise amortized against the increments. Summing gives O(n + m), versus the naive O(n·m).",
    },
    space: {
      bound: "O(m)",
      case: "worst",
      explanation:
        "The only extra structure is the LPS array of length m. The pointers and the result list (occurrences) are the output, not counted as working space.",
      inputOutputNote: "The text and pattern are inputs; the list of match positions is the output. Auxiliary space is the O(m) LPS array.",
    },
    derivation: [
      { lines: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17], description: "build_lps: amortized single pass over the pattern.", cost: "O(m)", dimension: "time" },
      { lines: [26, 27, 28, 29, 33, 34], description: "Search scans the text with i never decreasing; fallbacks amortized.", cost: "O(n)", dimension: "time" },
      { lines: [5], description: "The LPS array of length m.", cost: "O(m)", dimension: "space" },
    ],
    assumptions: [
      "The text pointer i never moves backward (the core KMP invariant).",
      "lps holds longest PROPER prefix-suffix lengths so fallbacks are correct.",
      "Character comparison is O(1).",
    ],
    tradeoffs:
      "KMP guarantees O(n + m) even on adversarial inputs where naive search degrades to O(n·m); the price is O(m) preprocessing/space and trickier code. For a one-off search on small inputs, Python's built-in `in` is simpler; KMP shines when worst-case guarantees or all/overlapping matches matter.",
    counters: [
      { label: "lps build steps", definition: "executions of the match branch in build_lps (line 10)", countLines: [10] },
      { label: "text comparisons", definition: "executions of the search match check (line 27)", countLines: [27] },
    ],
    fixedDataNote:
      "The examples build lps for 'ababaca' and search short texts, giving [0,0,1,2,3,0,1], [10], and [0,1,2,3]. The O(n + m) bound describes how the work scales with text and pattern length.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: KMP finds all occurrences in O(n+m)." },
    { line: 2, executable: false, explanation: "Comment: the LPS array definition." },
    { line: 3, executable: false, explanation: "Comment continued: LPS guides the fallback." },
    { line: 4, executable: true, explanation: "Define build_lps(pattern)." },
    { line: 5, executable: true, explanation: "Allocate the LPS array (all zeros)." },
    { line: 6, executable: true, explanation: "length tracks the current matched prefix length." },
    { line: 7, executable: true, explanation: "Start comparing from index 1 (lps[0] is always 0)." },
    { line: 8, executable: true, explanation: "Scan the whole pattern." },
    { line: 9, executable: true, explanation: "If the character extends the current prefix..." },
    { line: 10, executable: true, explanation: "...grow the matched length..." },
    { line: 11, executable: true, explanation: "...record it in lps..." },
    { line: 12, executable: true, explanation: "...and advance i." },
    { line: 13, executable: true, explanation: "On a mismatch with a non-zero prefix..." },
    { line: 14, executable: true, explanation: "...fall back within the pattern using the previous lps (no restart)." },
    { line: 15, executable: false, explanation: "Otherwise there is no prefix to fall back to." },
    { line: 16, executable: true, explanation: "lps here is 0." },
    { line: 17, executable: true, explanation: "Advance i." },
    { line: 18, executable: true, explanation: "Return the completed LPS array." },
    { line: 19, executable: false, explanation: "Blank line." },
    { line: 20, executable: true, explanation: "Define kmp_search(text, pattern)." },
    { line: 21, executable: true, explanation: "An empty pattern has no occurrences." },
    { line: 22, executable: true, explanation: "Return an empty list for the empty pattern." },
    { line: 23, executable: true, explanation: "Precompute the pattern's LPS array." },
    { line: 24, executable: true, explanation: "Collect match start positions." },
    { line: 25, executable: true, explanation: "i scans the text; j scans the pattern." },
    { line: 26, executable: true, explanation: "Walk the text once." },
    { line: 27, executable: true, explanation: "If the current characters match..." },
    { line: 28, executable: true, explanation: "...advance the text pointer..." },
    { line: 29, executable: true, explanation: "...and the pattern pointer." },
    { line: 30, executable: true, explanation: "If the whole pattern matched..." },
    { line: 31, executable: true, explanation: "...record the start index (i - j)..." },
    { line: 32, executable: true, explanation: "...and fall back to keep finding (possibly overlapping) matches." },
    { line: 33, executable: true, explanation: "On a mismatch after some matches, fall back j using lps (i stays put)." },
    { line: 34, executable: true, explanation: "Apply the fallback." },
    { line: 35, executable: false, explanation: "Otherwise j is already 0." },
    { line: 36, executable: true, explanation: "Advance i to keep scanning." },
    { line: 37, executable: true, explanation: "Return all match positions." },
    { line: 38, executable: false, explanation: "Blank line." },
    { line: 39, executable: true, explanation: "LPS of 'ababaca' is [0, 0, 1, 2, 3, 0, 1]." },
    { line: 40, executable: true, explanation: "'ababd' occurs once, starting at index 10." },
    { line: 41, executable: true, explanation: "'aa' occurs at [0, 1, 2, 3] in 'aaaaa' (overlapping)." },
  ],

  bindings: [
    {
      variable: "text",
      model: "string",
      overlays: [
        { role: "pointer", label: "i (text)", source: "i" },
        { role: "pointer", label: "j (pattern)", source: "j" },
      ],
    },
  ],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "On a mismatch after matching j characters, why does KMP set j = lps[j-1] instead of restarting j at 0 and rescanning the text?",
      answer: "The j characters already matched are exactly the pattern's own prefix, so the longest prefix-that-is-also-a-suffix (lps[j-1]) is the most of that we can keep aligned without rechecking. Restarting at 0 (and moving the text pointer back) would redo work KMP has proven unnecessary, which is what makes naive search O(n·m).",
      explanation: "lps encodes the pattern's self-overlap. Falling back to lps[j-1] preserves the guaranteed-matching prefix and keeps the text pointer moving forward, giving linear time.",
    },
  ],

  experiments: [
    "Print the LPS array for different patterns and check each value against the prefix/suffix definition.",
    "Search a pattern with overlaps (like 'aba' in 'ababa') and confirm overlapping matches are found.",
    "Instrument i to confirm it never decreases during the search.",
  ],

  exercises: [
    {
      id: "kmp-complete-1",
      kind: "complete-code",
      prompt: "Complete the mismatch handling in the search loop (fall back or advance).",
      starterCode:
        "if text[i] == pattern[j]:\n    i += 1\n    j += 1\n    if j == len(pattern):\n        res.append(i - j)\n        j = lps[j - 1]\nelif j > 0:\n    # TODO: reuse the matched prefix\n    pass\nelse:\n    i += 1",
      expected:
        "if text[i] == pattern[j]:\n    i += 1\n    j += 1\n    if j == len(pattern):\n        res.append(i - j)\n        j = lps[j - 1]\nelif j > 0:\n    j = lps[j - 1]\nelse:\n    i += 1",
      hints: [
        "On a mismatch with j > 0, don't restart or move i back.",
        "Fall back using the LPS of the last matched character.",
        "j = lps[j - 1]",
      ],
    },
    {
      id: "kmp-choose-1",
      kind: "choose-approach",
      prompt: "You must find all occurrences of a pattern in a huge text with a worst-case time guarantee (adversarial inputs possible). Naive scanning or KMP — and why?",
      expected: "KMP: guaranteed O(n + m) even on adversarial inputs like 'aaaa...a' with pattern 'aa...ab', where naive scanning degrades to O(n·m). KMP never rescans the text.",
      hints: [
        "Naive can be O(n·m) on repetitive text.",
        "You need a worst-case guarantee.",
        "KMP is linear regardless of input.",
      ],
    },
    {
      id: "kmp-predict-1",
      kind: "predict-state",
      prompt: "What is build_lps('ababaca'), and why is lps[4] = 3?",
      expected: "[0, 0, 1, 2, 3, 0, 1]. lps[4] = 3 because 'ababa' has the length-3 prefix 'aba' that is also its suffix.",
      hints: [
        "Check the prefix that is also a suffix at each index.",
        "For 'ababa', 'aba' works.",
        "That length is 3.",
      ],
    },
  ],

  review: `**KMP** matches a pattern in a text in **O(n + m)** by precomputing the **LPS array** — \`lps[i]\` = longest proper prefix of \`pattern[:i+1]\` that is also a suffix — in **O(m)**. On a mismatch after \`j\` matches it sets \`j = lps[j-1]\` to reuse the matched prefix, so the **text pointer never moves backward** (defeating the naive O(n·m) worst case). It uses **O(m)** extra space and naturally reports **overlapping** matches. The examples give LPS \`[0,0,1,2,3,0,1]\`, match \`[10]\`, and overlapping \`[0,1,2,3]\`.`,

  expectedOutput: "[0, 0, 1, 2, 3, 0, 1]\n[10]\n[0, 1, 2, 3]\n",

  references: [
    {
      url: "https://cp-algorithms.com/string/prefix-function.html",
      title: "Prefix function — Knuth–Morris–Pratt (CP-Algorithms)",
      section: "Prefix function (LPS) and KMP search; linear complexity",
      topic: "strings/kmp",
      purpose: "Confirm the LPS/prefix-function definition, the fallback rule j = lps[j-1], and the O(n + m) linear-time guarantee.",
      verifiedClaims: [
        "The prefix function (LPS) gives the longest proper prefix that is also a suffix and is computed in O(m).",
        "KMP search runs in O(n + m) without moving the text pointer backward.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://en.wikipedia.org/wiki/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm",
      title: "Knuth–Morris–Pratt algorithm — Wikipedia",
      section: "Algorithm, partial match (failure) table, complexity",
      topic: "strings/kmp",
      purpose: "Cross-check the failure-table construction, the no-backtracking property, and the O(n + m) time / O(m) space bounds.",
      verifiedClaims: [
        "KMP avoids re-examining text characters using a partial-match (failure) table.",
        "Its time complexity is O(n + m) with O(m) space for the table.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "eac8660e504ddee6",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
