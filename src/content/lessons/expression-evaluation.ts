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
            else: stack.append((abs(a) // abs(b)) * (-1 if (a < 0) != (b < 0) else 1))
        else:
            stack.append(int(t))     # a number: push it
    return stack[0]

# "2 1 + 3 *" means (2 + 1) * 3.
print(eval_rpn(["2", "1", "+", "3", "*"]))`;

export const expressionEvaluation: LessonDefinition = {
  id: "expression-evaluation",
  title: "Expression Evaluation",
  area: "Stacks and queues",
  prerequisites: [
  "stack-queue-operations"
],

  explanation: "Stacks evaluate arithmetic expressions cleanly. This lesson uses **Reverse Polish Notation (RPN)**, also called postfix, where operators come *after* their operands: `2 1 + 3 *` means `(2 + 1) * 3 = 9`. RPN needs **no parentheses and no precedence rules** — the order of tokens fully determines the computation — which is exactly why calculators and compilers use stack-based evaluation internally.\n\nThe algorithm scans tokens left to right. A **number** is pushed. An **operator** pops the top two values (the second operand is popped first, which matters for `-` and `/`), applies the operation, and pushes the result. After processing all tokens, the single value left on the stack is the answer.\n\nIt runs in **O(n)** time and **O(n)** space. Converting normal **infix** expressions (with precedence and parentheses) to RPN is done by the related **shunting-yard** algorithm, which also uses a stack. The recognition cue: \"evaluate/parse an expression respecting order\" → stack.\n\nDivision truncates toward zero using exact integer magnitudes, then restores the sign. Converting a/b to int first creates a float and can round large integers or overflow. This evaluator assumes a valid nonempty postfix expression with +, -, *, /, sufficient operands, one final value, and no zero divisor; it does not validate malformed expressions.",

  vocabulary: [
  {
    "term": "Reverse Polish Notation (RPN)",
    "definition": "Postfix notation: operators follow their operands, needing no parentheses."
  },
  {
    "term": "Operand",
    "definition": "A value an operator acts on."
  },
  {
    "term": "Infix",
    "definition": "Ordinary notation like (2 + 1) * 3, with precedence and parentheses."
  },
  {
    "term": "Operator order",
    "definition": "For - and /, the first popped value is the right-hand operand."
  },
  {
    "term": "Shunting-yard",
    "definition": "A stack algorithm converting infix to postfix (RPN)."
  }
],

  concepts: {
  "purpose": "Evaluate expressions using a stack, without precedence bookkeeping (RPN).",
  "operations": "Push numbers; on an operator pop two operands, compute, push the result.",
  "uses": "Calculators, compilers/interpreters, spreadsheet formula engines.",
  "tradeoffs": "O(n) and simple for RPN; infix needs a conversion step (shunting-yard) first.",
  "commonMistakes": "Pop the right operand b before the left operand a. // on signed numbers floors; float division followed by int can lose precision. Use absolute integer quotient and restore the sign.",
  "edgeCases": "Single number token → that number. Division truncation toward zero for negatives. Malformed RPN leaves the stack wrong-sized."
},

  complexity: [
  {
    "operation": "Evaluate RPN",
    "best": "O(n)",
    "average": "O(n)",
    "worst": "O(n)",
    "space": "O(n)",
    "note": "One pass; stack holds pending operands."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of tokens in the expression"
    }
  ],
  "costModel": "Each token is one O(1) push, or one operator step (two pops, one arithmetic op, one push) — all O(1).",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "Each of the n tokens is processed exactly once. A number is a single push; an operator is two pops, one arithmetic operation, and one push — all constant work. So the total is linear in the number of tokens."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The stack holds pending operands. In the worst case (all numbers pushed before any operator) it grows to O(n).",
    "inputOutputNote": "The token list of length n is the input; the operand stack (up to O(n)) is auxiliary. The bound covers the named algorithm; demonstration construction and collected print output are separate allocations."
  },
  "derivation": [
    {
      "lines": [
        4
      ],
      "description": "Process each of the n tokens once.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        6,
        7,
        8,
        9,
        10,
        11,
        13
      ],
      "description": "Each token: O(1) push, or O(1) two-pop-compute-push.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        3
      ],
      "description": "The operand stack can hold up to O(n) values.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Arithmetic on the values is O(1).",
    "Tokens form a valid RPN expression.",
    "Arithmetic and token parsing are treated as O(1) only for bounded-size tokens/numbers; arbitrary-precision integer arithmetic adds bit-length costs.",
    "The postfix expression is valid and nonempty, and every division has a nonzero divisor."
  ],
  "tradeoffs": "Evaluating infix directly requires precedence handling; converting to RPN first (shunting-yard, also O(n)) keeps evaluation this simple.",
  "counters": [
    {
      "label": "tokens processed",
      "definition": "iterations of the token loop (line 4)",
      "countLines": [
        4
      ]
    }
  ],
  "fixedDataNote": "This run evaluates 5 tokens to 9. The O(n) bound generalises to any expression length."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: evaluate RPN with a stack."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define eval_rpn(tokens)."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "The operand stack."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Process each token in order."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "If the token is an operator..."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Pop the top value as b — the RIGHT operand (popped first)."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Pop the next value as a — the LEFT operand."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Addition."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Subtraction: a - b (order matters)."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Multiplication."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Divide integer magnitudes with //, then negate if signs differ: exact truncation toward zero without a float. A zero divisor raises ZeroDivisionError."
  },
  {
    "line": 12,
    "executable": false,
    "explanation": "Otherwise the token is a number."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Convert it to int and push it."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "The single remaining value is the result."
  },
  {
    "line": 15,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 16,
    "executable": false,
    "explanation": "Comment: the meaning of the sample."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Evaluate (2+1)*3 → 9."
  }
],

  bindings: [
  {
    "variable": "stack",
    "model": "stack"
  }
],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "For '-' and '/', why does operand order matter, and which popped value is the right-hand side?",
    "answer": "Because subtraction/division aren't commutative; the FIRST value popped (b) is the right-hand operand, and the second (a) is the left, so you compute a - b and a / b.",
    "explanation": "The most recently pushed operand sits on top, so it's popped first — that's the right operand. Reversing them would compute b - a, giving wrong results for non-commutative operators."
  }
],

  experiments: [
  "Evaluate ['4','13','5','/','+'] and confirm 4 + (13/5 truncated) = 6.",
  "Swap a and b for subtraction and see the wrong result.",
  "Add a token for a single number and confirm it returns that number."
],

  exercises: [
  {
    "id": "expr-fix-1",
    "kind": "fix-mistake",
    "prompt": "`apply_sub(stack)` evaluates a `-` operator in RPN: it should pop the two operands, subtract them in the right order (left minus right), push the result, and return the stack. This version swaps the operands and gets the wrong sign. Fix the operand order. Assume a valid nonempty integer postfix expression and nonzero divisors.",
    "starterCode": "def apply_sub(stack):\n    a = stack.pop()\n    b = stack.pop()\n    stack.append(a - b)\n    return stack",
    "expected": "def apply_sub(stack):\n    b = stack.pop()\n    a = stack.pop()\n    stack.append(a - b)\n    return stack",
    "hints": [
      "Goal: fix subtraction so it computes left minus right with the correct sign.",
      "The bug is operand order: the two popped values are being combined the wrong way.",
      "Key insight: the stack pops the right operand first because it was pushed last.",
      "Approach: pop b (right) then a (left) and compute a - b.",
      "Pseudocode: b = pop; a = pop; if operator is '-': push a - b.",
      "Pop `b = stack.pop()` then `a = stack.pop()` and push `a - b`."
    ],
    "tests": "assert apply_sub([5, 3]) == [2], f'5 - 3 == 2, got {apply_sub([5, 3])}'\nassert apply_sub([3, 5]) == [-2], 'order matters: 3 - 5 == -2'\nassert apply_sub([10, 4, 1]) == [10, 3], 'operates on the TOP two, leaving the rest'\nassert apply_sub([7, 7]) == [0]\nprint('OK')"
  },
  {
    "id": "expr-choose-1",
    "kind": "choose-approach",
    "prompt": "Why is RPN evaluation simpler than evaluating an infix expression like (2+1)*3 directly?",
    "expected": "RPN encodes order explicitly, so no precedence or parentheses handling is needed — just push numbers and apply operators. Infix requires a precedence-aware parser (e.g. shunting-yard) first.",
    "hints": [
      "Goal: explain why evaluating RPN (postfix) is simpler than evaluating infix like (2+1)*3 directly.",
      "The cost infix imposes is handling operator precedence and parentheses before you can compute anything.",
      "Key property: RPN already encodes evaluation order in the token sequence, so no precedence or grouping remains to resolve.",
      "Approach: evaluate RPN with a single stack — push numbers, pop operands when an operator appears, push the result.",
      "Reasoning: RPN needs no parser because order is explicit; infix first requires a precedence-aware pass (e.g. shunting-yard) to even reach that stack evaluation.",
      "Answer: RPN encodes order explicitly, so just push numbers and apply operators — infix needs a precedence-aware parser first."
    ],
    "recognition": {
      "scenario": "You must evaluate arithmetic expressions. You compare evaluating RPN (postfix) against evaluating infix like (2+1)*3 directly, and explain why RPN is simpler.",
      "approaches": [
        {
          "id": "rpn-stack",
          "label": "Evaluate RPN with a single value stack",
          "requiredReasonIds": [
            "order-is-explicit"
          ]
        },
        {
          "id": "infix-direct",
          "label": "Evaluate the infix expression directly with one left-to-right pass",
          "requiredReasonIds": [],
          "rejectionFeedback": "Infix needs precedence and parentheses handling (e.g. a shunting-yard parser) before you can evaluate it; a naive single pass gets operator precedence wrong."
        }
      ],
      "reasons": [
        {
          "id": "order-is-explicit",
          "text": "RPN encodes evaluation order explicitly, so you just push numbers and apply each operator to the top values — no precedence or parentheses logic needed."
        },
        {
          "id": "infix-has-no-precedence",
          "text": "Infix expressions require no precedence handling, so they are as simple as RPN.",
          "contradictory": true
        },
        {
          "id": "rpn-needs-parens",
          "text": "RPN still needs parentheses to disambiguate operations.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "rpn-stack"
      ],
      "modelExplanation": "RPN encodes order explicitly, so no precedence or parentheses handling is needed — just push numbers and apply operators. Infix requires a precedence-aware parser (e.g. shunting-yard) first."
    }
  }
],

  review: "**Expression evaluation** with a stack: for **RPN (postfix)**, push numbers and, on an operator, pop two operands (the first popped is the right-hand side), compute, and push the result — the final stack value is the answer. It's **O(n)** time / **O(n)** space and needs no precedence rules. Converting infix to RPN uses the related stack-based shunting-yard algorithm.",

  expectedOutput: "9\n",

  references: [
  {
    "url": "https://runestone.academy/ns/books/published/pythonds3/BasicDS/InfixPrefixandPostfixExpressions.html",
    "title": "Runestone: Postfix expressions",
    "section": "3.9.2 shunting yard; 3.9.3 operand order and valid-expression precondition",
    "topic": "expression-evaluation",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Postfix evaluation pops right operand before left and assumes a valid expression."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source postfix example uses division with /; app requires exact integer truncation toward zero and valid nonempty RPN with no zero divisor. Pop right operand before left."
    ]
  },
  {
    "url": "https://docs.python.org/3.14/builtins/stdtypes.html",
    "title": "Python 3.14: Built-in types",
    "section": "Identity, equality, numeric types; floor division and float conversion",
    "topic": "expression-evaluation",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Integers have arbitrary precision; float conversion can round; // floors."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Python 3.14 has arbitrary-size integers and floor division. The RPN contract truncates toward zero via integer absolute-value quotient and sign, avoiding float conversion."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "3135c836a61afdcd",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
