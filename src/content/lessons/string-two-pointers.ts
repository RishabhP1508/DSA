/**
 * Lesson: String two pointers / palindrome (Strings). Verified on CPython 3.14.
 * Output: "True\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Check a palindrome with two converging pointers.
s = "racecar"
lo = 0
hi = len(s) - 1
is_pal = True
while lo < hi:
    if s[lo] != s[hi]:
        is_pal = False
        break
    lo = lo + 1
    hi = hi - 1
print(is_pal)`;

export const stringTwoPointers: LessonDefinition = {
  id: "string-two-pointers",
  title: "String Two Pointers (Palindrome)",
  area: "Strings",
  prerequisites: ["two-pointers"],

  explanation: `Strings are sequences of characters, so the **two-pointer** technique from arrays applies directly. A **palindrome** reads the same forwards and backwards, which is exactly a symmetry check: the first character must equal the last, the second must equal the second-last, and so on.

We put one pointer at each end and move them inward, comparing \`s[lo]\` with \`s[hi]\`. The moment they differ, it is not a palindrome and we can **stop early** with \`break\`. If the pointers meet in the middle with no mismatch, it is a palindrome. This is **O(n)** time and **O(1)** space — no reversed copy needed.

The early \`break\` gives a good best case (a mismatch at the very first pair is O(1)), while the worst case (an actual palindrome, or a mismatch only at the center) scans about n/2 pairs. Comparing this to \`s == s[::-1]\` (which builds a reversed copy in O(n) space) shows the two-pointer version's space advantage.`,

  vocabulary: [
    { term: "Palindrome", definition: "A sequence that reads the same forwards and backwards." },
    { term: "Converging pointers", definition: "One index from each end, moving toward the middle." },
    { term: "Early exit (break)", definition: "Stopping as soon as the answer is known (a mismatch)." },
    { term: "s[i]", definition: "The character at index i; strings support O(1) indexing." },
  ],

  concepts: {
    purpose: "Two pointers check symmetry (palindromes) or scan from both ends in O(n) time, O(1) space.",
    operations: "Compare s[lo] and s[hi]; step inward; break on mismatch.",
    uses: "Palindrome checks, reversing, valid-palindrome-with-skips, pair scanning.",
    tradeoffs: "O(1) space (no reversed copy), and early exit helps the best case; requires index access (fine for strings).",
    commonMistakes: "Using lo <= hi (harmless for compare but unnecessary); forgetting to move a pointer; not handling case/nonalphanumeric when the problem requires normalization.",
    edgeCases: "Empty string and single character are palindromes (loop does not run). Even vs odd length both handled by lo < hi.",
  },

  complexity: [
    { operation: "Palindrome check", best: "O(1)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "Best: mismatch at first pair. Worst: full palindrome ~n/2 comparisons." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the length of the string" }],
    costModel: "Each character comparison and pointer move is O(1). String indexing s[i] is O(1).",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "In the worst case (an actual palindrome, or a mismatch only near the center) the pointers converge over about n/2 pairs, each an O(1) comparison — O(n). The early break gives an O(1) best case when the very first pair mismatches.",
      otherCases: [
        { case: "best", bound: "O(1)", note: "First and last characters differ: one comparison, then break." },
      ],
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Only two indices and a boolean are kept; no reversed copy is built, unlike s == s[::-1] which uses O(n) space.",
      inputOutputNote: "The string of n characters is the input, not auxiliary space.",
    },
    derivation: [
      { lines: [6], description: "The loop runs about n/2 times as pointers converge.", cost: "O(n)", dimension: "time" },
      { lines: [7, 8, 9], description: "Each pass: one O(1) comparison; break on mismatch.", cost: "O(1)", dimension: "time" },
      { lines: [3, 4, 5], description: "Two indices and a boolean flag.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["String indexing is O(1).", "Comparisons are O(1)."],
    tradeoffs: "s == s[::-1] is shorter but builds a reversed copy (O(n) space); the two-pointer scan is O(1) space and can exit early.",
    counters: [{ label: "comparisons", definition: "executions of the compare (line 7)", countLines: [7] }],
    fixedDataNote: "This run checks 'racecar' (a palindrome, ~3 comparisons). The O(n) bound generalises the pair count to n/2.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: palindrome via two pointers." },
    { line: 2, executable: true, explanation: "The string to check." },
    { line: 3, executable: true, explanation: "lo starts at the first character." },
    { line: 4, executable: true, explanation: "hi starts at the last character." },
    { line: 5, executable: true, explanation: "Assume palindrome until proven otherwise." },
    { line: 6, executable: true, explanation: "Loop while the pointers have not met." },
    { line: 7, executable: true, explanation: "Compare the mirrored characters." },
    { line: 8, executable: true, explanation: "On mismatch, mark not-a-palindrome..." },
    { line: 9, executable: true, explanation: "...and break early — no need to check further." },
    { line: 10, executable: true, explanation: "Move lo inward." },
    { line: 11, executable: true, explanation: "Move hi inward. When lo >= hi, the loop ends." },
    { line: 12, executable: true, explanation: "Print the result → True for 'racecar'." },
  ],

  bindings: [
    {
      variable: "s",
      model: "string",
      overlays: [
        { role: "pointer", label: "lo", source: "lo" },
        { role: "pointer", label: "hi", source: "hi" },
      ],
    },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "For 'racecar' (length 7), how many comparisons run, and why not 7?", answer: "3 comparisons — pointers converge over about n/2 pairs, and the middle character needs no comparison.", explanation: "Each comparison checks a mirrored pair; the odd-length middle character has no partner, so it takes floor(7/2) = 3 comparisons." },
  ],

  experiments: [
    "Check a non-palindrome like 'hello' and see the early break fire.",
    "Check an even-length palindrome like 'abba' and count comparisons.",
    "Compare with s == s[::-1] and discuss the O(n) space of the reversed copy.",
  ],

  exercises: [
    {
      id: "stp-complete-1",
      kind: "complete-code",
      prompt: "Complete the two-pointer palindrome check.",
      starterCode: "def is_palindrome(s):\n    lo, hi = 0, len(s) - 1\n    while lo < hi:\n        if s[lo] != s[hi]:\n            return False\n        # TODO: move the pointers inward\n    return True",
      expected: "def is_palindrome(s):\n    lo, hi = 0, len(s) - 1\n    while lo < hi:\n        if s[lo] != s[hi]:\n            return False\n        lo += 1\n        hi -= 1\n    return True",
      hints: ["Both pointers move toward the center.", "Increase lo, decrease hi.", "lo += 1; hi -= 1"],
    },
    {
      id: "stp-choose-1",
      kind: "choose-approach",
      prompt: "Why prefer the two-pointer palindrome check over s == s[::-1] in a memory-constrained setting?",
      expected: "Two pointers use O(1) extra space and can exit early on the first mismatch; s[::-1] builds a full reversed copy using O(n) space.",
      hints: ["What does s[::-1] create?", "A reversed copy of size n.", "Two pointers avoid that copy — O(1) space."],
    },
  ],

  review: `Strings support the same **converging two-pointer** technique as arrays. A **palindrome** check compares \`s[lo]\` and \`s[hi]\` moving inward, with an early **break** on mismatch — **O(n)** time (best O(1)) and **O(1)** space, avoiding the reversed-copy overhead of \`s[::-1]\`.`,

  expectedOutput: "True\n",

  references: [
    {
      url: "https://www.geeksforgeeks.org/check-if-a-string-is-palindrome/",
      title: "Check whether a string is palindrome — GeeksforGeeks",
      section: "Two pointer approach",
      topic: "strings/two-pointers",
      purpose: "Confirm the two-pointer palindrome method and its O(n)/O(1) profile.",
      verifiedClaims: ["Comparing characters from both ends inward detects palindromes in O(n) time and O(1) space"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 15,
    contentHash: "b9a06147caff3f92",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
