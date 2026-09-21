/**
 * Lesson: Substrings (Strings). Verified on CPython 3.14.
 * Output: "['a', 'ab', 'abc', 'b', 'bc', 'c']\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Generate every contiguous substring of s.
s = "abc"
subs = []
for i in range(len(s)):
    for j in range(i + 1, len(s) + 1):
        # s[i:j] is the substring from index i up to (not including) j.
        subs.append(s[i:j])
print(subs)`;

export const substrings: LessonDefinition = {
  id: "substrings",
  title: "Substrings",
  area: "Strings",
  prerequisites: ["array-traversal", "string-two-pointers"],

  explanation: `A **substring** is a **contiguous** slice of a string — characters next to each other, unlike a subsequence which may skip. \`s[i:j]\` is the substring starting at index \`i\` up to (but not including) \`j\`.

To generate **all** substrings, pick every start \`i\` and every end \`j > i\`: that is two nested loops. For a string of length n there are about **n(n+1)/2 = O(n²)** substrings, and each slice \`s[i:j]\` also copies up to n characters, so materializing them all is **O(n²) count and O(n³) total character work** in the worst case. That quadratic-or-worse explosion is exactly why efficient string algorithms **avoid enumerating all substrings** and instead use sliding windows, prefix structures, or specialized methods like KMP.

The lesson's takeaway is a warning as much as a technique: generating all substrings is easy but expensive. When a problem says "find the longest/shortest substring with some property," reach for a sliding window (**O(n)**), not brute-force enumeration.`,

  vocabulary: [
    { term: "Substring", definition: "A contiguous slice of a string, s[i:j]." },
    { term: "Subsequence", definition: "Characters in order but not necessarily contiguous (contrast with substring)." },
    { term: "Slice s[i:j]", definition: "Characters from index i up to but not including j." },
    { term: "Quadratic blow-up", definition: "There are O(n^2) substrings, so enumerating them is expensive." },
  ],

  concepts: {
    purpose: "Understand substrings vs subsequences and why enumerating all substrings is costly.",
    operations: "Nested loops over start i and end j; slice s[i:j].",
    uses: "Baseline for substring problems; motivates windows/prefix/KMP that avoid full enumeration.",
    tradeoffs: "Enumeration is simple but O(n^2) substrings (O(n^3) to build them all); efficient methods avoid it.",
    commonMistakes: "Confusing substrings with subsequences; off-by-one in the j range (need len(s)+1); brute-forcing when a window would be O(n).",
    edgeCases: "Empty string has no nonempty substrings. Single character has exactly one. All-equal characters still produce O(n^2) substrings.",
  },

  complexity: [
    { operation: "Generate all substrings", best: "O(n^2)", average: "O(n^2)", worst: "O(n^3)", space: "O(n^3)", note: "O(n^2) substrings; each slice copies up to n chars." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the length of the string" }],
    costModel: "There are n(n+1)/2 = O(n²) substrings. Building each slice s[i:j] copies its length, up to n characters.",
    time: {
      bound: "O(n^2)",
      case: "worst",
      explanation: "The nested loops produce one substring per (i, j) pair with j > i, which is about n²/2 = O(n²) substrings just to enumerate their bounds. If we also BUILD each substring, slicing copies up to n characters each, giving O(n³) total character work in the worst case. This quadratic-to-cubic cost is why enumerating all substrings is avoided.",
    },
    space: {
      bound: "O(n^3)",
      case: "worst",
      explanation: "Storing all substrings holds O(n²) strings whose total length is O(n³) characters in the worst case. If you only need to PROCESS each substring without storing them, space drops to O(n) for one slice at a time.",
      inputOutputNote: "The subs list is the (large) output; its size is inherent to enumerating all substrings.",
    },
    derivation: [
      { lines: [4, 5], description: "Nested loops over start i and end j yield O(n²) (i, j) pairs.", cost: "O(n^2)", dimension: "time" },
      { lines: [7], description: "Each slice s[i:j] copies up to n characters, adding a factor of n to build them all.", cost: "O(n^3)", dimension: "time" },
      { lines: [3, 7], description: "Storing all substrings holds O(n²) strings totalling O(n³) characters.", cost: "O(n^3)", dimension: "space" },
    ],
    assumptions: ["Slicing s[i:j] copies its characters (Python strings are immutable, so a new string is created).", "We store every substring."],
    tradeoffs: "If a problem only needs the best substring by some property, a sliding window processes it in O(n) without enumerating all O(n²) substrings — a massive saving.",
    counters: [{ label: "substrings generated", definition: "executions of the append (line 7)", countLines: [7] }],
    fixedDataNote: "This run enumerates all 6 substrings of 'abc' (n=3 → n(n+1)/2 = 6). The O(n²)/O(n³) bounds describe how it explodes for larger n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: generate every contiguous substring." },
    { line: 2, executable: true, explanation: "The source string 'abc'." },
    { line: 3, executable: true, explanation: "Collect substrings here." },
    { line: 4, executable: true, explanation: "Outer loop: choose the start index i (0..n-1)." },
    { line: 5, executable: true, explanation: "Inner loop: choose the end j from i+1 to n (exclusive slice end)." },
    { line: 6, executable: false, explanation: "Comment: s[i:j] is the substring [i, j)." },
    { line: 7, executable: true, explanation: "Append the slice. Runs O(n^2) times, each copying up to n characters." },
    { line: 8, executable: true, explanation: "Print all substrings → ['a','ab','abc','b','bc','c']." },
  ],

  bindings: [
    {
      variable: "s",
      model: "string",
      overlays: [
        { role: "pointer", label: "i", source: "i" },
        { role: "pointer", label: "j", source: "j" },
      ],
    },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "How many substrings does a string of length n have, and what does that imply for brute force?", answer: "n(n+1)/2 = O(n^2) substrings, so enumerating them all is at least O(n^2) — avoid it when a window would do.", explanation: "Each (start, end) pair with end > start is a substring: n(n+1)/2 of them. Any algorithm that lists them all is Ω(n²), which is why sliding windows (O(n)) are preferred for 'best substring' problems." },
  ],

  experiments: [
    "Count the substrings of 'abcd' and confirm it is 4*5/2 = 10.",
    "Process substrings one at a time (print instead of store) and note the space drops to O(n).",
    "Contrast with a subsequence example to see the 'contiguous' distinction.",
  ],

  exercises: [
    {
      id: "sub-choose-1",
      kind: "choose-approach",
      prompt: "A problem asks for the longest substring without repeating characters. Should you enumerate all substrings? What is the better approach and its complexity?",
      expected: "No — enumeration is O(n^2)+ substrings. Use a variable-size sliding window: O(n) time, O(k) space.",
      hints: ["How many substrings are there?", "O(n^2) — too many to check each.", "A sliding window solves it in O(n)."],
    },
    {
      id: "sub-predict-1",
      kind: "predict-state",
      prompt: "What is the difference between a substring and a subsequence of 'abc'? Give one example of each.",
      expected: "A substring is contiguous (e.g. 'bc'); a subsequence keeps order but may skip (e.g. 'ac'). 'ac' is a subsequence but not a substring.",
      hints: ["One must be contiguous.", "The other can skip characters.", "'bc' substring; 'ac' subsequence."],
    },
  ],

  review: `A **substring** is a contiguous slice \`s[i:j]\` (unlike a **subsequence**, which may skip). A string of length n has **O(n²)** substrings, so enumerating them all is **O(n²)** count (**O(n³)** to build/store them) — expensive. When a problem targets the best substring by some property, prefer a **sliding window (O(n))** over brute-force enumeration.`,

  expectedOutput: "['a', 'ab', 'abc', 'b', 'bc', 'c']\n",

  references: [
    {
      url: "https://docs.python.org/3.14/tutorial/introduction.html",
      title: "An Informal Introduction to Python — Python 3.14 documentation",
      section: "Strings (slicing)",
      topic: "strings/substrings",
      purpose: "Confirm slice semantics s[i:j] (start inclusive, end exclusive) producing a new string.",
      verifiedClaims: ["s[i:j] returns the substring from i up to but not including j"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://www.geeksforgeeks.org/number-substrings-string/",
      title: "Number of substrings of a string — GeeksforGeeks",
      section: "Count of substrings",
      topic: "strings/substrings",
      purpose: "Confirm that a length-n string has n(n+1)/2 substrings (O(n^2)).",
      verifiedClaims: ["A string of length n has n(n+1)/2 non-empty substrings"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "7ef2dc4db9e7a9fb",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
