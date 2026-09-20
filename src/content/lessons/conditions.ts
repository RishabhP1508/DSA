/**
 * Lesson: Conditions (Programming foundations). Verified on CPython 3.14.
 * Output: "hot\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# A condition chooses which block of code runs.
temp = 30
# Python checks each test top to bottom and runs the FIRST that is True.
if temp >= 30:
    label = "hot"
elif temp >= 20:
    label = "warm"
else:
    label = "cold"
print(label)`;

export const conditions: LessonDefinition = {
  id: "conditions",
  title: "Conditions (if / elif / else)",
  area: "Programming foundations",
  prerequisites: ["expressions"],

  explanation: `A **condition** lets a program make a decision. An \`if\` statement runs a block of code only when its test is **True**. You can add \`elif\` ("else if") branches for more cases, and a final \`else\` for "none of the above".

Python checks the tests **top to bottom** and runs the **first** one that is True — then it skips the rest. Order matters: because \`temp = 30\` satisfies \`temp >= 30\`, the label becomes \`"hot"\` and the \`elif\`/\`else\` are never tried.

Tests use **comparison operators** (\`==\`, \`!=\`, \`<\`, \`<=\`, \`>\`, \`>=\`) and can be combined with \`and\`, \`or\`, and \`not\`.`,

  vocabulary: [
    { term: "Condition", definition: "A test that is either True or False, controlling which code runs." },
    { term: "Boolean", definition: "A value that is True or False." },
    { term: "if / elif / else", definition: "Branches: run the first block whose test is True; else runs if none match." },
    { term: "Comparison operator", definition: "==, !=, <, <=, >, >= — produce a Boolean." },
    { term: "Block", definition: "The indented lines that belong to a branch." },
  ],

  concepts: {
    purpose: "Conditions let a program behave differently depending on its data.",
    operations: "Compare values, combine tests with and/or/not, branch with if/elif/else.",
    uses: "Validating input, choosing an algorithm branch, handling edge cases, base cases in recursion.",
    tradeoffs: "Many elif branches can be clearer as a lookup table/dict; deeply nested ifs hurt readability.",
    commonMistakes: "Using = (assignment) instead of == (comparison); wrong branch order so a broad test shadows a specific one; forgetting indentation defines the block.",
    edgeCases: "If no branch matches and there is no else, nothing runs. Only the first true branch executes.",
  },

  complexity: [
    { operation: "Evaluate an if/elif chain", best: "O(1)", average: "O(1)", worst: "O(1)", note: "A fixed number of constant-time comparisons." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "—", meaning: "no input size; a fixed chain of comparisons" }],
    costModel: "Each comparison of two numbers is one constant-time step.",
    time: {
      bound: "O(1)",
      case: "worst",
      explanation: "At most a fixed number of comparisons run (here, at most two before a branch is chosen), each constant time. There is no loop, so the cost does not depend on input size.",
    },
    space: { bound: "O(1)", case: "worst", explanation: "Stores two small variables (temp, label). Nothing grows with input." },
    derivation: [
      { lines: [4, 6], description: "At most two constant-time comparisons before a branch is picked.", cost: "O(1)", dimension: "time" },
      { lines: [5, 7, 9], description: "One assignment inside the chosen branch.", cost: "O(1)", dimension: "time" },
      { lines: [2, 5], description: "A fixed set of variables.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Comparisons are between small numbers, so each is constant time."],
    fixedDataNote: "temp is a fixed literal (30), so the 'hot' branch always runs on this run; the O(1) claim is about the fixed branch count, not any input size.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: conditions choose which code runs." },
    { line: 2, executable: true, explanation: "Set temp to 30." },
    { line: 3, executable: false, explanation: "Comment: Python runs the first True test." },
    { line: 4, executable: true, explanation: "Test temp >= 30. It is True (30 >= 30), so this branch is chosen." },
    { line: 5, executable: true, explanation: "Because the test was True, set label to 'hot'." },
    { line: 6, executable: false, explanation: "This elif is skipped entirely — an earlier branch already matched." },
    { line: 7, executable: false, explanation: "Not run: its branch was not selected." },
    { line: 8, executable: false, explanation: "The else is skipped too." },
    { line: 9, executable: false, explanation: "Not run." },
    { line: 10, executable: true, explanation: "Print label → 'hot'." },
  ],

  bindings: [{ variable: "label", model: "object" }],

  prediction: [
    { atEventIndex: 0, prompt: "If temp were 20, what would label be?", answer: "warm", explanation: "temp >= 30 is False, but temp >= 20 is True, so the elif branch sets label to 'warm'." },
  ],

  experiments: [
    "Change temp to 10 and predict which branch runs.",
    "Swap the order of the >= 30 and >= 20 tests and see how the result changes for temp = 30.",
    "Replace the chain with a single test using `and` to require two conditions.",
  ],

  exercises: [
    {
      id: "cond-fix-1",
      kind: "fix-mistake",
      prompt: "This code always prints 'warm' even when temp is 35. Why, and how do you fix it?",
      starterCode: "temp = 35\nif temp >= 20:\n    print('warm')\nelif temp >= 30:\n    print('hot')",
      expected: "temp = 35\nif temp >= 30:\n    print('hot')\nelif temp >= 20:\n    print('warm')",
      hints: ["Which test is checked first?", "The broad test (>= 20) matches before the specific one (>= 30).", "Order branches from most specific/highest to least: check >= 30 first."],
    },
    {
      id: "cond-predict-1",
      kind: "predict-state",
      prompt: "With the lesson code unchanged, how many comparisons run before a branch is chosen?",
      expected: "One — temp >= 30 is True immediately, so no further tests run.",
      hints: ["Python stops at the first True test.", "temp >= 30 is the first test.", "It is True, so exactly one comparison runs."],
    },
  ],

  review: `Conditions branch with \`if\`/\`elif\`/\`else\`, running the **first** True test and skipping the rest, so **branch order matters**. Use \`==\` for comparison (not \`=\`). A fixed if-chain is **O(1)** time and space.`,

  expectedOutput: "hot\n",

  references: [
    {
      url: "https://docs.python.org/3.14/tutorial/controlflow.html",
      title: "More Control Flow Tools — Python 3.14 documentation",
      section: "if Statements",
      topic: "foundations/conditions",
      purpose: "Confirm if/elif/else semantics: the first true branch runs and the rest are skipped.",
      verifiedClaims: ["There can be zero or more elif parts", "The first true branch executes; others are skipped"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://www.w3schools.com/python/python_conditions.asp",
      title: "Python Conditions — W3Schools",
      section: "if / elif / else",
      topic: "foundations/conditions",
      purpose: "Beginner cross-check of comparison operators and branch structure.",
      verifiedClaims: ["elif means 'else if'; else covers the remaining case"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "5f9953611ad82a02",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
