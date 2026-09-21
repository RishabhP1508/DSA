/**
 * Lesson: Expression evaluation (Stacks and queues). Verified on CPython 3.14.
 * Output: "9\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Evaluate a Reverse Polish Notation expression with a stack.
def eval_rpn(tokens):
    stack = []
    for t in tokens:
        if t in ("+", "-", "*", "/"):
            b = stack.pop()          # second operand (popped first)
            a = stack.pop()          # first operand
            if t == "+": stack.append(a + b)
            elif t == "-": stack.append(a - b)
            elif t == "*": stack.append(a * b)
            else: stack.append(int(a / b))
        else:
            stack.append(int(t))     # a number: push it
    return stack[0]

# "2 1 + 3 *" means (2 + 1) * 3.
print(eval_rpn(["2", "1", "+", "3", "*"]))`;

export const expressionEvaluation: LessonDefinition = {
  id: "expression-evaluation",
  title: "Expression Evaluation",
  area: "Stacks and queues",
  prerequisites: ["stack-queue-operations"],

  explanation: `Stacks evaluate arithmetic expressions cleanly. This lesson uses **Reverse Polish Notation (RPN)**, also called postfix, where operators come *after* their operands: \`2 1 + 3 *\` means \`(2 + 1) * 3 = 9\`. RPN needs **no parentheses and no precedence rules** — the order of tokens fully determines the computation — which is exactly why calculators and compilers use stack-based evaluation internally.

The algorithm scans tokens left to right. A **number** is pushed. An **operator** pops the top two values (the second operand is popped first, which matters for \`-\` and \`/\`), applies the operation, and pushes the result. After processing all tokens, the single value left on the stack is the answer.

It runs in **O(n)** time and **O(n)** space. Converting normal **infix** expressions (with precedence and parentheses) to RPN is done by the related **shunting-yard** algorithm, which also uses a stack. The recognition cue: "evaluate/parse an expression respecting order" → stack.`,

  vocabulary: [
    { term: "Reverse Polish Notation (RPN)", definition: "Postfix notation: operators follow their operands, needing no parentheses." },
    { term: "Operand", definition: "A value an operator acts on." },
    { term: "Infix", definition: "Ordinary notation like (2 + 1) * 3, with precedence and parentheses." },
    { term: "Operator order", definition: "For - and /, the first popped value is the right-hand operand." },
    { term: "Shunting-yard", definition: "A stack algorithm converting infix to postfix (RPN)." },
  ],

  concepts: {
    purpose: "Evaluate expressions using a stack, without precedence bookkeeping (RPN).",
    operations: "Push numbers; on an operator pop two operands, compute, push the result.",
    uses: "Calculators, compilers/interpreters, spreadsheet formula engines.",
    tradeoffs: "O(n) and simple for RPN; infix needs a conversion step (shunting-yard) first.",
    commonMistakes: "Swapping operand order for - and / (b is popped first = right operand); integer-division rounding (int(a/b) truncates toward zero); not converting numeric tokens from strings.",
    edgeCases: "Single number token → that number. Division truncation toward zero for negatives. Malformed RPN leaves the stack wrong-sized.",
  },

  complexity: [
    { operation: "Evaluate RPN", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)", note: "One pass; stack holds pending operands." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of tokens in the expression" }],
    costModel: "Each token is one O(1) push, or one operator step (two pops, one arithmetic op, one push) — all O(1).",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "Each of the n tokens is processed exactly once. A number is a single push; an operator is two pops, one arithmetic operation, and one push — all constant work. So the total is linear in the number of tokens.",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "The stack holds pending operands. In the worst case (all numbers pushed before any operator) it grows to O(n).",
      inputOutputNote: "The token list of length n is the input; the operand stack (up to O(n)) is auxiliary.",
    },
    derivation: [
      { lines: [4], description: "Process each of the n tokens once.", cost: "O(n)", dimension: "time" },
      { lines: [6, 7, 8, 9, 10, 11, 13], description: "Each token: O(1) push, or O(1) two-pop-compute-push.", cost: "O(n)", dimension: "time" },
      { lines: [3], description: "The operand stack can hold up to O(n) values.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Arithmetic on the values is O(1).", "Tokens form a valid RPN expression."],
    tradeoffs: "Evaluating infix directly requires precedence handling; converting to RPN first (shunting-yard, also O(n)) keeps evaluation this simple.",
    counters: [{ label: "tokens processed", definition: "iterations of the token loop (line 4)", countLines: [4] }],
    fixedDataNote: "This run evaluates 5 tokens to 9. The O(n) bound generalises to any expression length.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: evaluate RPN with a stack." },
    { line: 2, executable: true, explanation: "Define eval_rpn(tokens)." },
    { line: 3, executable: true, explanation: "The operand stack." },
    { line: 4, executable: true, explanation: "Process each token in order." },
    { line: 5, executable: true, explanation: "If the token is an operator..." },
    { line: 6, executable: true, explanation: "Pop the top value as b — the RIGHT operand (popped first)." },
    { line: 7, executable: true, explanation: "Pop the next value as a — the LEFT operand." },
    { line: 8, executable: true, explanation: "Addition." },
    { line: 9, executable: true, explanation: "Subtraction: a - b (order matters)." },
    { line: 10, executable: true, explanation: "Multiplication." },
    { line: 11, executable: true, explanation: "Division: int(a / b) truncates toward zero." },
    { line: 12, executable: false, explanation: "Otherwise the token is a number." },
    { line: 13, executable: true, explanation: "Convert it to int and push it." },
    { line: 14, executable: true, explanation: "The single remaining value is the result." },
    { line: 15, executable: false, explanation: "Blank line." },
    { line: 16, executable: false, explanation: "Comment: the meaning of the sample." },
    { line: 17, executable: true, explanation: "Evaluate (2+1)*3 → 9." },
  ],

  bindings: [{ variable: "stack", model: "stack" }],

  prediction: [
    { atEventIndex: 0, prompt: "For '-' and '/', why does operand order matter, and which popped value is the right-hand side?", answer: "Because subtraction/division aren't commutative; the FIRST value popped (b) is the right-hand operand, and the second (a) is the left, so you compute a - b and a / b.", explanation: "The most recently pushed operand sits on top, so it's popped first — that's the right operand. Reversing them would compute b - a, giving wrong results for non-commutative operators." },
  ],

  experiments: [
    "Evaluate ['4','13','5','/','+'] and confirm 4 + (13/5 truncated) = 6.",
    "Swap a and b for subtraction and see the wrong result.",
    "Add a token for a single number and confirm it returns that number.",
  ],

  exercises: [
    {
      id: "expr-fix-1",
      kind: "fix-mistake",
      prompt: "Subtraction gives the wrong sign. Fix the operand order.",
      starterCode: "a = stack.pop()\nb = stack.pop()\nif t == '-':\n    stack.append(a - b)",
      expected: "b = stack.pop()\na = stack.pop()\nif t == '-':\n    stack.append(a - b)",
      hints: ["Which operand is on top of the stack?", "The right operand is popped first.", "Pop b (right) first, then a (left); compute a - b."],
    },
    {
      id: "expr-choose-1",
      kind: "choose-approach",
      prompt: "Why is RPN evaluation simpler than evaluating an infix expression like (2+1)*3 directly?",
      expected: "RPN encodes order explicitly, so no precedence or parentheses handling is needed — just push numbers and apply operators. Infix requires a precedence-aware parser (e.g. shunting-yard) first.",
      hints: ["What does RPN remove the need for?", "Parentheses and precedence rules.", "Infix needs a conversion/parse step; RPN doesn't."],
    },
  ],

  review: `**Expression evaluation** with a stack: for **RPN (postfix)**, push numbers and, on an operator, pop two operands (the first popped is the right-hand side), compute, and push the result — the final stack value is the answer. It's **O(n)** time / **O(n)** space and needs no precedence rules. Converting infix to RPN uses the related stack-based shunting-yard algorithm.`,

  expectedOutput: "9\n",

  references: [
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/BasicDS/InfixPrefixandPostfixExpressions.html",
      title: "Infix, Prefix and Postfix Expressions — Problem Solving with Algorithms and DS using Python (Runestone)",
      section: "Postfix evaluation with a stack",
      topic: "stacks/expression-eval",
      purpose: "Confirm stack-based postfix (RPN) evaluation and operand-order handling.",
      verifiedClaims: ["RPN is evaluated with a stack: push operands, apply operators to the top two", "The first popped operand is the right-hand side"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://en.wikipedia.org/wiki/Shunting_yard_algorithm",
      title: "Shunting yard algorithm — Wikipedia",
      section: "Infix to postfix conversion",
      topic: "stacks/expression-eval",
      purpose: "Cross-check that converting infix to RPN uses a stack-based algorithm.",
      verifiedClaims: ["The shunting-yard algorithm converts infix to postfix using a stack"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "562a44ce56ec57fd",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
