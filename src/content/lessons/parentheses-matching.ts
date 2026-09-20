/**
 * Lesson: Parentheses matching (Stacks and queues). Verified on CPython 3.14.
 * Output: "True\nFalse\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Valid parentheses: every closer must match the most recent opener.
def valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)              # remember this opener
        else:
            # A closer must match the top opener; else invalid.
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack                       # valid only if nothing is left open

print(valid("([]{})"))
print(valid("(]"))`;

export const parenthesesMatching: LessonDefinition = {
  id: "parentheses-matching",
  title: "Parentheses Matching",
  area: "Stacks and queues",
  prerequisites: ["stack-queue-operations"],

  explanation: `Checking that brackets are **balanced** — every \`(\`, \`[\`, \`{\` closed by the correct \`)\`, \`]\`, \`}\` in the right order — is the textbook use of a **stack**. The reason a stack fits perfectly: the closer you see must match the **most recently opened** bracket that is still open, which is exactly the **LIFO** property.

The algorithm: scan left to right. On an **opener**, push it. On a **closer**, the top of the stack must be its matching opener — pop and compare; if the stack is empty or the top doesn't match, it's invalid. At the end the string is valid **only if the stack is empty** (no opener left dangling).

This runs in **O(n)** time with **O(n)** worst-case stack space (a string of all openers). The same stack idea extends to validating and parsing nested structures (HTML/JSON-like), and it's a stepping stone to full expression evaluation. The cue: "nested / matching / most-recent-first" → stack.`,

  vocabulary: [
    { term: "Balanced brackets", definition: "Every opener has a correct, correctly-ordered closer." },
    { term: "Opener / closer", definition: "( [ { open; ) ] } close." },
    { term: "Matching pair", definition: "A closer whose partner is the most recent unmatched opener." },
    { term: "Dangling opener", definition: "An opener with no closer — left on the stack at the end." },
  ],

  concepts: {
    purpose: "Validate nested brackets using LIFO order, the canonical stack application.",
    operations: "Push openers; on a closer, pop and compare to the expected opener; end valid iff the stack is empty.",
    uses: "Bracket validation, syntax checking, parsing nested structures, editor bracket matching.",
    tradeoffs: "O(n) time, O(n) space; simple and exact for nesting rules.",
    commonMistakes: "Forgetting the final empty-stack check (accepts unclosed openers); popping an empty stack (a stray closer); only counting brackets without checking type/order.",
    edgeCases: "Empty string is valid. A lone closer is invalid (empty stack). Mismatched type like '(]' is invalid.",
  },

  complexity: [
    { operation: "Validate brackets", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)", note: "One pass; stack up to O(n) for all-openers." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of characters in the string" }],
    costModel: "Each character triggers one O(1) push or one O(1) pop-and-compare (dict lookup is expected O(1)).",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "We look at each of the n characters exactly once, doing constant work (a push, or a pop plus a dictionary lookup). So the total is linear in the string length. There is no nested loop.",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "In the worst case (e.g. '(((((') every character is an opener and gets pushed, so the stack grows to size n.",
      inputOutputNote: "The string of n characters is the input; the stack of up to n openers is auxiliary.",
    },
    derivation: [
      { lines: [5], description: "Scan each of the n characters once.", cost: "O(n)", dimension: "time" },
      { lines: [6, 7, 10], description: "Each character does one O(1) push or pop-and-compare.", cost: "O(n)", dimension: "time" },
      { lines: [4], description: "The stack can hold up to n openers.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Dict lookup for the matching opener is expected O(1).", "Stack ops are O(1)."],
    tradeoffs: "There is no faster approach for general nesting — you must read every character; a simple counter works only for a single bracket type, not mixed types/order.",
    counters: [{ label: "characters scanned", definition: "iterations of the loop (line 5)", countLines: [5] }],
    fixedDataNote: "The first call validates a 6-char balanced string (True); the second rejects a mismatch (False). The O(n) bound generalises to any length.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: each closer matches the most recent opener." },
    { line: 2, executable: true, explanation: "Define valid(s)." },
    { line: 3, executable: true, explanation: "Map each closer to its required opener." },
    { line: 4, executable: true, explanation: "The stack of currently-open brackets." },
    { line: 5, executable: true, explanation: "Scan each character." },
    { line: 6, executable: true, explanation: "If it's an opener..." },
    { line: 7, executable: true, explanation: "...push it onto the stack." },
    { line: 8, executable: false, explanation: "Otherwise it's a closer." },
    { line: 9, executable: false, explanation: "Comment: it must match the top opener." },
    { line: 10, executable: true, explanation: "Invalid if the stack is empty or the top opener doesn't match this closer." },
    { line: 11, executable: true, explanation: "Return False on a mismatch." },
    { line: 12, executable: true, explanation: "Valid only if no openers are left unclosed (stack empty)." },
    { line: 13, executable: false, explanation: "Blank line." },
    { line: 14, executable: true, explanation: "'([]{})' is balanced → True." },
    { line: 15, executable: true, explanation: "'(]' mismatches → False." },
  ],

  bindings: [
    { variable: "s", model: "string" },
    { variable: "stack", model: "stack" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why must we check that the stack is EMPTY at the end, not just that no mismatch occurred?", answer: "Because unclosed openers (e.g. '(((') never cause a mismatch but leave items on the stack; a non-empty stack means dangling openers, so it's invalid.", explanation: "Mismatches catch wrong/early closers, but a string of only openers passes the loop with a non-empty stack. The final `not stack` check rejects those dangling openers." },
  ],

  experiments: [
    "Test '(((' and confirm the final empty-stack check makes it False.",
    "Test a lone ')' and see the empty-stack pop guard return False.",
    "Add other characters (letters) and adjust the code to ignore non-brackets.",
  ],

  exercises: [
    {
      id: "paren-fix-1",
      kind: "fix-mistake",
      prompt: "This accepts '(((' as valid. Fix the final return.",
      starterCode: "def valid(s):\n    pairs = {')':'(', ']':'[', '}':'{'}\n    stack = []\n    for ch in s:\n        if ch in '([{':\n            stack.append(ch)\n        elif not stack or stack.pop() != pairs[ch]:\n            return False\n    return True",
      expected: "def valid(s):\n    pairs = {')':'(', ']':'[', '}':'{'}\n    stack = []\n    for ch in s:\n        if ch in '([{':\n            stack.append(ch)\n        elif not stack or stack.pop() != pairs[ch]:\n            return False\n    return not stack",
      hints: ["What happens if the string is all openers?", "The stack is non-empty at the end.", "Return `not stack` so leftover openers fail."],
    },
    {
      id: "paren-choose-1",
      kind: "choose-approach",
      prompt: "Why does a single integer counter (increment on '(' , decrement on ')') fail for '([)]' but a stack succeeds?",
      expected: "A counter ignores bracket TYPE and order, so '([)]' balances numerically but is actually mis-nested. A stack enforces that each closer matches the most recent opener of the correct type.",
      hints: ["Does a counter know '(' vs '['?", "It only counts, not types/order.", "A stack checks the correct opener is on top."],
    },
  ],

  review: `**Parentheses matching** uses a **stack** because a closer must match the **most recent** opener (LIFO). Push openers; on a closer, pop and compare; at the end the string is valid only if the stack is **empty**. It's **O(n)** time / **O(n)** space. A plain counter fails for mixed bracket types — you need the stack for type and order.`,

  expectedOutput: "True\nFalse\n",

  references: [
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/BasicDS/SimpleBalancedParentheses.html",
      title: "Balanced Symbols — Problem Solving with Algorithms and DS using Python (Runestone)",
      section: "Balanced parentheses with a stack",
      topic: "stacks/parentheses",
      purpose: "Confirm the stack-based bracket-matching algorithm and the final empty-stack requirement.",
      verifiedClaims: ["A stack validates balanced brackets in O(n); the stack must be empty at the end"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Stack — Valid Parentheses",
      topic: "stacks/parentheses",
      purpose: "Cross-check the canonical valid-parentheses approach and its complexity.",
      verifiedClaims: ["Valid parentheses is solved with a stack in O(n) time and O(n) space"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 15,
    contentHash: "029b8453395baef9",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
