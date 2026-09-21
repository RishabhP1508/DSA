/**
 * Lesson: Palindromes (Strings). Verified on CPython 3.14. Output: "False\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# A palindrome reads the same forwards and backwards.
s = "hello"
# s[::-1] is the reversed string. Compare it to the original.
print(s == s[::-1])`;

export const palindromes: LessonDefinition = {
  id: "palindromes",
  title: "Palindromes",
  area: "Strings",
  prerequisites: ["string-two-pointers"],

  explanation: `A **palindrome** reads identically forwards and backwards (\`"racecar"\`, \`"level"\`). There are two idiomatic ways to test one in Python, and comparing them teaches a real time/space trade-off.

The **slice** method, \`s == s[::-1]\`, builds a **reversed copy** of the string and compares it to the original. It is beautifully short and O(n) time — but it allocates a whole new string, so it uses **O(n) extra space**.

The **two-pointer** method (previous lesson) compares characters from both ends inward, using **O(1) extra space** and stopping early on the first mismatch. For \`"hello"\`, the reversed string \`"olleh"\` differs from \`"hello"\`, so the answer is \`False\`.

Which to use? The slice is perfect for clarity and small strings; the two-pointer scan wins when memory matters or you want early exit. Recognising that both are O(n) time but differ in **space** is exactly the kind of comparison the complexity panel is meant to surface.

**Finding the longest palindromic SUBSTRING — "expand around center".** Testing one string is the building block; the classic follow-up is to find the longest palindromic substring inside a string. The key idea reuses the two-pointer check *in reverse*: instead of starting at the ends and moving in, start at a **center** and expand **outward** while \`s[lo] == s[hi]\`, recording the widest match. A palindrome has a center, but there are **two kinds** of center — a single character (odd length, e.g. \`"aba"\`) and the gap between two characters (even length, e.g. \`"abba"\`). So you try expanding from **all \`2n−1\` centers** (each index, and each between-index gap) and keep the longest. **Correctness condition:** you must check both the odd center (\`expand(i, i)\`) and the even center (\`expand(i, i+1)\`) at every position, or you miss all even-length palindromes. Each expansion is O(n) and there are O(n) centers, so this is O(n²) time and O(1) extra space.`,

  vocabulary: [
    { term: "Palindrome", definition: "A string equal to its own reverse." },
    { term: "Slice s[::-1]", definition: "A reversed copy of the string." },
    { term: "Reversed copy", definition: "A new string with characters in reverse order (uses O(n) space)." },
    { term: "Normalization", definition: "Lowercasing / removing non-letters before checking, when required." },
  ],

  concepts: {
    purpose: "Palindrome checks illustrate symmetry testing and a clear time-vs-space comparison.",
    operations: "Compare to the reversed slice (O(n) space) or scan with two pointers (O(1) space).",
    uses: "Palindrome validation, longest-palindromic-substring building blocks, string symmetry.",
    tradeoffs: "Slice: shortest, O(n) space. Two pointers: O(1) space, early exit. Both O(n) time.",
    commonMistakes: "Ignoring case/punctuation when the problem needs normalization; assuming the slice is free (it copies).",
    edgeCases: "Empty string and single character are palindromes. Mixed case ('Aba') is not a palindrome unless normalized.",
  },

  complexity: [
    { operation: "Slice compare", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)", note: "Builds a reversed copy of length n." },
    { operation: "Two-pointer check", best: "O(1)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "Early exit; no copy." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the length of the string" }],
    costModel: "Building s[::-1] copies n characters (O(n) time and space). Comparing two strings is O(n).",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "Creating the reversed slice touches all n characters, and comparing it to the original is another O(n) scan. So the slice method is O(n) time — the same asymptotic time as the two-pointer method, which also scans up to n/2 pairs.",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "s[::-1] allocates a brand-new string of length n, so the slice method uses O(n) auxiliary space. (The two-pointer method avoids this, using O(1).)",
      inputOutputNote: "The original string is the input; the reversed slice is extra allocated space, which is the cost being highlighted.",
    },
    derivation: [
      { lines: [4], description: "s[::-1] builds a reversed copy of all n characters.", cost: "O(n)", dimension: "time" },
      { lines: [4], description: "Comparing the two length-n strings scans up to n characters.", cost: "O(n)", dimension: "time" },
      { lines: [4], description: "The reversed copy occupies O(n) extra memory.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["String indexing/slicing costs are proportional to length.", "No normalization is applied in this simple version."],
    tradeoffs: "The two-pointer method (previous lesson) is O(1) space and can exit early on the first mismatch; the slice is shorter but copies the string.",
    fixedDataNote: "This run checks 'hello' (n=5, not a palindrome → False). The O(n) time / O(n) space bounds describe the slice method for any n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: definition of a palindrome." },
    { line: 2, executable: true, explanation: "The string to test." },
    { line: 3, executable: false, explanation: "Comment: s[::-1] reverses the string." },
    { line: 4, executable: true, explanation: "Compare s to its reverse. 'hello' != 'olleh', so this prints False." },
  ],

  bindings: [{ variable: "s", model: "string" }],

  prediction: [
    { atEventIndex: 0, prompt: "Both s == s[::-1] and the two-pointer method are O(n) time. How do they differ in space?", answer: "The slice uses O(n) extra space (a reversed copy); the two-pointer method uses O(1).", explanation: "s[::-1] allocates a new length-n string, so O(n) space. The two-pointer scan compares in place with just two indices — O(1) space." },
  ],

  experiments: [
    "Test 'racecar' and 'level' and confirm True.",
    "Test 'Aba' and then 'Aba'.lower() to see why normalization matters.",
    "Compare timing/space intuition against the two-pointer version for a long string.",
    "Longest palindromic substring: write expand(lo, hi) that grows outward while s[lo]==s[hi], and call it from every center as BOTH expand(i,i) (odd) and expand(i,i+1) (even). On 'babad' confirm you find 'bab' (or 'aba'); on 'cbbd' confirm the even center finds 'bb'. Drop the even-center call and watch 'bb' be missed.",
  ],

  exercises: [
    {
      id: "pal-complete-1",
      kind: "complete-code",
      prompt: "Write is_palindrome(s) using the slice method.",
      starterCode: "def is_palindrome(s):\n    # TODO: compare s to its reverse\n    pass",
      expected: "def is_palindrome(s):\n    return s == s[::-1]",
      hints: ["s[::-1] is the reversed string.", "Compare it to s.", "return s == s[::-1]"],
    },
    {
      id: "pal-choose-1",
      kind: "choose-approach",
      prompt: "For a very long string in a memory-tight environment, which palindrome method do you choose and why?",
      expected: "The two-pointer method: O(1) extra space and early exit on mismatch, versus the slice's O(n) reversed copy.",
      hints: ["What does the slice allocate?", "A full reversed copy (O(n) space).", "Two pointers avoid the copy — O(1) space."],
    },
    {
      id: "pal-longest-substring-1",
      kind: "choose-approach",
      prompt: "To find the LONGEST palindromic substring of 'cbbd' by expanding around centers, which centers do you try, and why does an odd-center-only version get the wrong answer here?",
      expected: "Try all 2n-1 centers: each single index i (odd-length, expand(i,i)) AND each gap between i and i+1 (even-length, expand(i,i+1)), expanding while s[lo]==s[hi]. For 'cbbd' the answer 'bb' is an EVEN-length palindrome centered in the gap between the two 'b's, so an odd-center-only version never checks that center and would return a length-1 answer. Overall O(n^2) time, O(1) extra space.",
      hints: ["A palindrome center is either a character or the gap between two characters.", "Odd centers alone miss every even-length palindrome like 'bb'.", "Expand from expand(i,i) and expand(i,i+1) for every i and keep the widest."],
    },
  ],

  review: `A **palindrome** equals its reverse. \`s == s[::-1]\` is the shortest check — **O(n)** time but **O(n)** space (it copies). The two-pointer scan is **O(n)** time and **O(1)** space with early exit. Same time class, different space: choose by clarity vs memory, and normalize (case/punctuation) when the problem requires.`,

  expectedOutput: "False\n",

  references: [
    {
      url: "https://docs.python.org/3.14/tutorial/introduction.html",
      title: "An Informal Introduction to Python — Python 3.14 documentation",
      section: "Strings (slicing)",
      topic: "strings/palindromes",
      purpose: "Confirm slice syntax s[::-1] produces a reversed copy.",
      verifiedClaims: ["Slicing returns a new string; s[::-1] reverses it"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://www.geeksforgeeks.org/check-if-a-string-is-palindrome/",
      title: "Check whether a string is palindrome — GeeksforGeeks",
      section: "Reverse-and-compare vs two-pointer",
      topic: "strings/palindromes",
      purpose: "Cross-check both approaches and their space difference.",
      verifiedClaims: ["Reverse-and-compare uses O(n) extra space; two pointers use O(1)"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "95071746a9dc61f6",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
