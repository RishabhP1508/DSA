/**
 * Lesson: Expressions and operators (Programming foundations).
 * Verified on CPython 3.14. Output: "14 20 2\n3 32 2.5\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# An expression combines values and operators to produce one value.
# Multiplication binds tighter than addition (precedence).
x = 2 + 3 * 4
# Parentheses force a different order.
y = (2 + 3) * 4
# % is the remainder (modulo) operator.
z = 17 % 5
print(x, y, z)
# // is integer (floor) division; ** is power; / is true division (float).
print(7 // 2, 2 ** 5, 10 / 4)`;

export const expressions: LessonDefinition = {
  id: "expressions",
  title: "Expressions and Operators",
  area: "Programming foundations",
  prerequisites: ["variables-and-types"],

  explanation: `An **expression** is any piece of code that produces a value: \`2 + 3\`, \`x * 2\`, \`17 % 5\`. Python evaluates the operators in a fixed order called **precedence** — for example \`*\` and \`/\` happen before \`+\` and \`-\`, just like in maths. So \`2 + 3 * 4\` is \`2 + 12 = 14\`, not \`20\`.

You can override precedence with **parentheses**: \`(2 + 3) * 4\` forces the addition first, giving \`20\`.

Python has three "division-like" operators that beginners often confuse: \`/\` is **true division** and always gives a float (\`10 / 4 == 2.5\`), \`//\` is **floor division** (\`7 // 2 == 3\`), and \`%\` is the **remainder** (\`17 % 5 == 2\`). \`**\` is exponentiation (\`2 ** 5 == 32\`).`,

  vocabulary: [
    { term: "Expression", definition: "Code that evaluates to a single value, e.g. 2 + 3 * 4." },
    { term: "Operator", definition: "A symbol that combines values, e.g. +, -, *, /, %, //, **." },
    { term: "Precedence", definition: "The order operators are applied; * and / bind tighter than + and -." },
    { term: "True division (/)", definition: "Division that always yields a float, e.g. 10 / 4 == 2.5." },
    { term: "Floor division (//)", definition: "Division rounded down to a whole number, e.g. 7 // 2 == 3." },
    { term: "Modulo (%)", definition: "The remainder after division, e.g. 17 % 5 == 2." },
  ],

  concepts: {
    purpose: "Expressions compute the values your program works with — sums, indices, conditions, and more.",
    operations: "Arithmetic (+, -, *, /, //, %, **), grouping with parentheses, and mixing with variables.",
    uses: "Index math, running totals, converting between units, checking divisibility with %.",
    tradeoffs: "Relying on precedence keeps code short but can mislead readers; parentheses make intent explicit.",
    commonMistakes: "Assuming left-to-right evaluation (ignoring precedence); expecting / to give an int (it gives a float); confusing % (remainder) with / (division).",
    edgeCases: "Division by zero raises ZeroDivisionError. % with negatives follows the sign of the divisor in Python (e.g. -1 % 5 == 4).",
  },

  complexity: [
    { operation: "Arithmetic on small ints", best: "O(1)", average: "O(1)", worst: "O(1)", note: "Fixed-size integer arithmetic is constant time." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "—", meaning: "no input size; this example does a fixed amount of arithmetic" }],
    costModel: "Each arithmetic operation on machine-sized integers/floats is treated as one constant-time step. (Python integers are arbitrary precision, so arithmetic on very large integers with d digits costs more — noted below.)",
    time: {
      bound: "O(1)",
      case: "worst",
      explanation: "There are no loops. The program evaluates a fixed number of arithmetic expressions and two print calls, so its running time does not depend on any input size.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "It stores three small variables (x, y, z). No storage grows with any input.",
    },
    derivation: [
      { lines: [3, 5, 7], description: "Three constant-time arithmetic expressions assigned to names.", cost: "O(1)", dimension: "time" },
      { lines: [8, 10], description: "Two print calls of a fixed number of values.", cost: "O(1)", dimension: "time" },
      { lines: [3, 5, 7], description: "A fixed set of small variables.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: [
      "Operands fit in machine-word integers/floats, so each operation is constant time.",
      "For arbitrary-precision integers with d digits, +/- cost O(d) and * costs more — not relevant to these small values.",
    ],
    fixedDataNote: "All operands are fixed literals, so this run does a constant amount of work; there is no input size to grow.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: what an expression is." },
    { line: 2, executable: false, explanation: "Comment about precedence." },
    { line: 3, executable: true, explanation: "3 * 4 is evaluated first (12), then 2 + 12 gives 14. x becomes 14." },
    { line: 4, executable: false, explanation: "Comment about parentheses." },
    { line: 5, executable: true, explanation: "(2 + 3) is forced first (5), then 5 * 4 gives 20. y becomes 20." },
    { line: 6, executable: false, explanation: "Comment about modulo." },
    { line: 7, executable: true, explanation: "17 % 5 is the remainder of 17 ÷ 5, which is 2. z becomes 2." },
    { line: 8, executable: true, explanation: "Print x, y, z → 14 20 2." },
    { line: 9, executable: false, explanation: "Comment about //, ** and /." },
    { line: 10, executable: true, explanation: "7 // 2 is 3 (floor), 2 ** 5 is 32 (power), 10 / 4 is 2.5 (float). Prints 3 32 2.5." },
  ],

  bindings: [{ variable: "x", model: "object" }],

  prediction: [
    { atEventIndex: 0, prompt: "What is `2 + 3 * 4` in Python, and why?", answer: "14, because * has higher precedence than + so 3*4 happens first.", explanation: "Multiplication binds tighter than addition, so it is 2 + (3*4) = 14, not (2+3)*4 = 20." },
  ],

  experiments: [
    "Change line 3 to add parentheses and predict the new value of x.",
    "Print `-1 % 5` and `-7 // 2` and see how Python handles negatives.",
    "Replace 10 / 4 with 10 // 4 and note the type change from float to int.",
  ],

  exercises: [
    {
      id: "expr-predict-1",
      kind: "predict-state",
      prompt: "What does `10 / 2` evaluate to, and what type is it?",
      expected: "5.0, a float (true division always returns a float).",
      hints: ["/ is true division.", "True division always returns a float.", "10 / 2 == 5.0 (not 5)."],
    },
    {
      id: "expr-choose-1",
      kind: "choose-approach",
      prompt: "You need the remainder when dividing a by b (e.g. to test if a is even). Which operator do you use?",
      expected: "The modulo operator %. a % 2 == 0 means a is even.",
      hints: ["You want the leftover after division.", "That is the modulo operator.", "Use a % b; a % 2 == 0 tests evenness."],
    },
  ],

  review: `Expressions produce values by applying **operators** in **precedence** order (\`*\`,\`/\` before \`+\`,\`-\`), which **parentheses** can override. Remember the three divisions: \`/\` (float), \`//\` (floor), \`%\` (remainder), plus \`**\` (power). Evaluating a fixed set of expressions is **O(1)** time and space.`,

  expectedOutput: "14 20 2\n3 32 2.5\n",

  references: [
    {
      url: "https://docs.python.org/3.14/tutorial/introduction.html",
      title: "An Informal Introduction to Python — Python 3.14 documentation",
      section: "Numbers (operators and division)",
      topic: "foundations/expressions",
      purpose: "Confirm operator behaviour: / returns float, // floors, ** powers, and operator precedence.",
      verifiedClaims: ["/ always returns a float", "// performs floor division", "** is exponentiation"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://docs.python.org/3/reference/expressions.html",
      title: "Expressions — Python Language Reference",
      section: "Operator precedence",
      topic: "foundations/expressions",
      purpose: "Cross-check the precedence ordering used in the lesson.",
      verifiedClaims: ["* and / have higher precedence than + and -"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "0031a9400b72ef46",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 1,
  },
};
