/**
 * Lesson: Variable-size sliding window (Strings). Verified on CPython 3.14.
 * Output: "3\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Longest substring with no repeating characters (variable window).
s = "abcabcbb"
seen = {}      # char -> last index we saw it
start = 0      # left edge of the current window
best = 0
for i in range(len(s)):
    ch = s[i]
    # If ch repeats inside the window, jump start past its last position.
    if ch in seen and seen[ch] >= start:
        start = seen[ch] + 1
    seen[ch] = i
    length = i - start + 1
    if length > best:
        best = length
print(best)`;

export const stringSlidingWindow: LessonDefinition = {
  id: "string-sliding-window",
  title: "Variable-Size Sliding Window",
  area: "Strings",
  prerequisites: ["sliding-window", "string-frequency"],

  explanation: `The **variable-size sliding window** grows and shrinks its width to maintain a condition — unlike the fixed-size window (constant k). Classic problem: the **longest substring with no repeating characters**.

The window is \`s[start..i]\`. We move the right edge \`i\` forward one character at a time. We keep a map \`seen\` of each character's last index. When the new character \`ch\` already appears **inside the current window** (\`seen[ch] >= start\`), the window would contain a duplicate, so we **jump \`start\`** to just past that previous occurrence — shrinking the window from the left just enough to stay valid. At every step the current window length is \`i - start + 1\`, and we track the best.

Crucially, \`start\` only ever moves **forward**, and \`i\` moves forward once per character, so the total work is **O(n)** — each end advances at most n times. This "expand right, contract left on violation" shape solves many longest/shortest-substring-with-a-constraint problems.`,

  vocabulary: [
    { term: "Variable-size window", definition: "A window whose width changes to keep a condition satisfied." },
    { term: "Window bounds", definition: "start (left edge) and i (right edge); the window is s[start..i]." },
    { term: "Contract", definition: "Move start rightward to restore validity (drop characters from the left)." },
    { term: "Last-seen map", definition: "A dict recording the most recent index of each character." },
  ],

  concepts: {
    purpose: "Variable windows find the longest/shortest substring meeting a constraint in one pass.",
    operations: "Expand the right edge; when the constraint breaks, contract the left edge (jump start).",
    uses: "Longest substring without repeats, longest with at most k distinct, minimum window substring.",
    tradeoffs: "O(n) time and O(k) space; the logic to contract correctly is more subtle than a fixed window.",
    commonMistakes: "Letting start move backward (must only advance); checking seen[ch] without the seen[ch] >= start guard (stale positions outside the window); off-by-one in the length formula.",
    edgeCases: "Empty string (best stays 0). All identical characters (window never exceeds 1). All distinct (window equals the whole string).",
  },

  complexity: [
    { operation: "Longest unique substring", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(k)", note: "Each edge advances at most n times; map holds k distinct chars." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the length of the string" },
      { symbol: "k", meaning: "the number of distinct characters (map size)" },
    ],
    costModel: "Each dict lookup/update is expected O(1). Each character is entered once by the right edge; start only advances.",
    time: {
      bound: "O(n)",
      case: "expected",
      explanation: "The right edge i advances exactly n times. The left edge start only ever moves forward, so across the whole run it also advances at most n times total — not per step. Each step does expected-O(1) dict work. So although the window resizes, the combined pointer movement is O(n), not O(n²).",
    },
    space: {
      bound: "O(k)",
      case: "worst",
      explanation: "The `seen` map holds at most one entry per distinct character — O(k), bounded by the alphabet. A couple of scalars otherwise.",
      inputOutputNote: "The string of n characters is the input; the seen map (size k) is auxiliary.",
    },
    derivation: [
      { lines: [6], description: "The right edge advances n times (one per character).", cost: "O(n)", dimension: "time" },
      { lines: [9, 10], description: "start only moves forward, at most n times total across the whole run.", cost: "O(n)", dimension: "time" },
      { lines: [3, 11], description: "The seen map holds up to k distinct characters.", cost: "O(k)", dimension: "space" },
    ],
    assumptions: ["Dict operations are expected O(1).", "start is monotonic (never decreases)."],
    tradeoffs: "A brute force checks every substring for uniqueness in O(n²) or O(n³); the window's monotonic pointers cut it to O(n).",
    counters: [
      { label: "right-edge steps", definition: "iterations of the main loop (line 6)", countLines: [6] },
      { label: "left-edge jumps", definition: "executions of the contract step (line 10)", countLines: [10] },
    ],
    fixedDataNote: "This run on 'abcabcbb' returns 3 ('abc'). The O(n) bound generalises the combined pointer movement to n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: longest substring with no repeats." },
    { line: 2, executable: true, explanation: "The input string." },
    { line: 3, executable: true, explanation: "Map of each character to the last index it was seen." },
    { line: 4, executable: true, explanation: "start is the left edge of the current window." },
    { line: 5, executable: true, explanation: "best tracks the longest valid window length." },
    { line: 6, executable: true, explanation: "Move the right edge i across the string (n steps)." },
    { line: 7, executable: true, explanation: "The character entering the window." },
    { line: 8, executable: false, explanation: "Comment: if ch repeats inside the window, contract." },
    { line: 9, executable: true, explanation: "Is ch already seen AND inside the current window (index >= start)?" },
    { line: 10, executable: true, explanation: "Jump start to just past the previous ch — the only contraction needed." },
    { line: 11, executable: true, explanation: "Record ch's latest index." },
    { line: 12, executable: true, explanation: "Current window length = i - start + 1." },
    { line: 13, executable: true, explanation: "If it beats best..." },
    { line: 14, executable: true, explanation: "...update best." },
    { line: 15, executable: true, explanation: "Print the longest length → 3." },
  ],

  bindings: [
    {
      variable: "s",
      model: "string",
      overlays: [
        { role: "pointer", label: "start", source: "start" },
        { role: "pointer", label: "i", source: "i" },
      ],
    },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why is this O(n) and not O(n^2), even though the window resizes?", answer: "Because both edges only move forward: i advances n times and start advances at most n times total, so combined movement is O(n).", explanation: "Neither pointer ever moves backward. The right edge steps n times; the left edge's total forward movement across the whole run is also bounded by n. Total O(n), not O(n²)." },
  ],

  experiments: [
    "Run on 'bbbb' and confirm the answer is 1 (window never grows past one char).",
    "Run on 'abcd' (all distinct) and confirm the answer is 4.",
    "Watch start jump when the second 'a' enters in 'abca'.",
  ],

  exercises: [
    {
      id: "ssw-choose-1",
      kind: "choose-approach",
      prompt: "Fixed-size vs variable-size window: which fits 'longest substring with at most 2 distinct characters', and why?",
      expected: "Variable-size: the window grows while the constraint (<= 2 distinct) holds and contracts when it breaks; the width is not fixed.",
      hints: ["Is the target length fixed or discovered?", "The window must grow/shrink to keep <= 2 distinct.", "That is a variable-size window."],
    },
    {
      id: "ssw-fix-1",
      kind: "fix-mistake",
      prompt: "This version wrongly lets start move backward for characters seen outside the window. Add the missing guard.",
      starterCode: "if ch in seen:\n    start = seen[ch] + 1",
      expected: "if ch in seen and seen[ch] >= start:\n    start = seen[ch] + 1",
      hints: ["A character seen long ago may be outside the current window.", "Only contract if its last index is within [start, i].", "Add: and seen[ch] >= start"],
    },
  ],

  review: `A **variable-size sliding window** expands its right edge and contracts its left edge (\`start\`) only when a constraint breaks. For "longest substring without repeats," a last-seen map lets \`start\` jump past duplicates. Because both edges move only forward, it is **O(n)** time with **O(k)** space — far better than the O(n²) brute force.`,

  expectedOutput: "3\n",

  references: [
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Sliding Window — Longest Substring Without Repeating Characters",
      topic: "strings/sliding-window",
      purpose: "Confirm the variable-window approach and its linear complexity for this canonical problem.",
      verifiedClaims: ["The longest-unique-substring window runs in O(n) because both pointers move monotonically forward"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://www.geeksforgeeks.org/window-sliding-technique/",
      title: "Window Sliding Technique — GeeksforGeeks",
      section: "Variable-size window",
      topic: "strings/sliding-window",
      purpose: "Cross-check the expand/contract mechanics of variable-size windows.",
      verifiedClaims: ["Variable windows expand on the right and contract on the left to maintain a constraint"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "305dfbb81644ed5c",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
