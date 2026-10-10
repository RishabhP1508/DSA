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
  prerequisites: [
  "stack-queue-operations"
],

  explanation: "Checking that brackets are **balanced** — every `(`, `[`, `{` closed by the correct `)`, `]`, `}` in the right order — is the textbook use of a **stack**. The reason a stack fits perfectly: the closer you see must match the **most recently opened** bracket that is still open, which is exactly the **LIFO** property.\n\nThe algorithm: scan left to right. On an **opener**, push it. On a **closer**, the top of the stack must be its matching opener — pop and compare; if the stack is empty or the top doesn't match, it's invalid. At the end the string is valid **only if the stack is empty** (no opener left dangling).\n\nThis runs in **O(n)** time with **O(n)** worst-case stack space (a string of all openers). The same stack idea extends to validating and parsing nested structures (HTML/JSON-like), and it's a stepping stone to full expression evaluation. The cue: \"nested / matching / most-recent-first\" → stack.\n\nThis implementation accepts only the six bracket characters ()[]{}. For general text, explicitly skip other characters before consulting pairs; this version does not do that. Empty input is valid.",

  vocabulary: [
  {
    "term": "Balanced brackets",
    "definition": "Every opener has a correct, correctly-ordered closer."
  },
  {
    "term": "Opener / closer",
    "definition": "( [ { open; ) ] } close."
  },
  {
    "term": "Matching pair",
    "definition": "A closer whose partner is the most recent unmatched opener."
  },
  {
    "term": "Dangling opener",
    "definition": "An opener with no closer — left on the stack at the end."
  }
],

  concepts: {
  "purpose": "Validate nested brackets using LIFO order, the canonical stack application.",
  "operations": "Push openers; on a closer, pop and compare to the expected opener; end valid iff the stack is empty.",
  "uses": "Bracket validation, syntax checking, parsing nested structures, editor bracket matching.",
  "tradeoffs": "O(n) time, O(n) space; simple and exact for nesting rules.",
  "commonMistakes": "Forgetting the final empty-stack check (accepts unclosed openers); popping an empty stack (a stray closer); only counting brackets without checking type/order.",
  "edgeCases": "Empty string is valid. A lone closer is invalid (empty stack). Mismatched type like '(]' is invalid."
},

  complexity: [
  {
    "operation": "Validate brackets",
    "best": "O(1)",
    "average": "O(n)",
    "worst": "O(n)",
    "space": "O(n)",
    "note": "One pass; stack up to O(n) for all-openers. An invalid first closer returns immediately."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of characters in the string"
    }
  ],
  "costModel": "Each character triggers one O(1) push or one O(1) pop-and-compare (dict lookup is expected O(1)).",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "We look at each of the n characters exactly once, doing constant work (a push, or a pop plus a dictionary lookup). So the total is linear in the string length. There is no nested loop."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "In the worst case (e.g. '(((((') every character is an opener and gets pushed, so the stack grows to size n.",
    "inputOutputNote": "The string of n characters is the input; the stack of up to n openers is auxiliary. The bound covers the named algorithm; demonstration construction and collected print output are separate allocations."
  },
  "derivation": [
    {
      "lines": [
        5
      ],
      "description": "Scan each of the n characters once.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        6,
        7,
        10
      ],
      "description": "Each character does one O(1) push or pop-and-compare.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        4
      ],
      "description": "The stack can hold up to n openers.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Dict lookup for the matching opener is expected O(1).",
    "Stack ops are O(1).",
    "Input consists only of ()[]{}; pairs has three fixed entries."
  ],
  "tradeoffs": "There is no faster approach for general nesting — you must read every character; a simple counter works only for a single bracket type, not mixed types/order.",
  "counters": [
    {
      "label": "characters scanned",
      "definition": "iterations of the loop (line 5)",
      "countLines": [
        5
      ]
    }
  ],
  "fixedDataNote": "The first call validates a 6-char balanced string (True); the second rejects a mismatch (False). The O(n) bound generalises to any length."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: each closer matches the most recent opener."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define valid(s)."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Map each closer to its required opener."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "The stack of currently-open brackets."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Scan each character."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "If it's an opener..."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "...push it onto the stack."
  },
  {
    "line": 8,
    "executable": false,
    "explanation": "Otherwise it's a closer."
  },
  {
    "line": 9,
    "executable": false,
    "explanation": "Comment: it must match the top opener."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Invalid if the stack is empty or the top opener doesn't match this closer."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Return False on a mismatch."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Valid only if no openers are left unclosed (stack empty)."
  },
  {
    "line": 13,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "'([]{})' is balanced → True."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "'(]' mismatches → False."
  }
],

  bindings: [
  {
    "variable": "s",
    "model": "string"
  },
  {
    "variable": "stack",
    "model": "stack"
  }
],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "Why must we check that the stack is EMPTY at the end, not just that no mismatch occurred?",
    "answer": "Because unclosed openers (e.g. '(((') never cause a mismatch but leave items on the stack; a non-empty stack means dangling openers, so it's invalid.",
    "explanation": "Mismatches catch wrong/early closers, but a string of only openers passes the loop with a non-empty stack. The final `not stack` check rejects those dangling openers."
  }
],

  experiments: [
  "Test '(((' and confirm the final empty-stack check makes it False.",
  "Test a lone ')' and see the empty-stack pop guard return False.",
  "Add other characters (letters) and adjust the code to ignore non-brackets."
],

  exercises: [
  {
    "id": "paren-fix-1",
    "kind": "fix-mistake",
    "prompt": "This accepts '(((' as valid. Fix the final return. Inputs contain only ()[]{}.",
    "starterCode": "def valid(s):\n    pairs = {')':'(', ']':'[', '}':'{'}\n    stack = []\n    for ch in s:\n        if ch in '([{':\n            stack.append(ch)\n        elif not stack or stack.pop() != pairs[ch]:\n            return False\n    return True",
    "expected": "def valid(s):\n    pairs = {')':'(', ']':'[', '}':'{'}\n    stack = []\n    for ch in s:\n        if ch in '([{':\n            stack.append(ch)\n        elif not stack or stack.pop() != pairs[ch]:\n            return False\n    return not stack",
    "hints": [
      "Goal: fix the validator so all-openers like '(((' are rejected.",
      "The final return ignores leftover openers still sitting on the stack.",
      "Key insight: unmatched openers leave the stack non-empty at the end, which means invalid.",
      "Approach: require the stack to be empty for a valid string.",
      "Pseudocode: push openers; on a closer, fail if the stack is empty or the top does not match; at the end succeed only if the stack is empty.",
      "Change the final line to `return not stack` so leftover openers fail."
    ],
    "tests": "assert valid('()[]{}') is True, 'all matched'\nassert valid('([{}])') is True, 'nested matched'\nassert valid('(((') is False, 'unclosed opens must be rejected (stack not empty at end)'\nassert valid('') is True, 'empty string is valid'\nassert valid('(]') is False, 'mismatched pair'\nassert valid(')') is False, 'closing with empty stack'\nprint('OK')"
  },
  {
    "id": "paren-choose-1",
    "kind": "choose-approach",
    "prompt": "Why does a single integer counter (increment on '(' , decrement on ')') fail for '([)]' but a stack succeeds?",
    "expected": "A counter ignores bracket TYPE and order, so '([)]' balances numerically but is actually mis-nested. A stack enforces that each closer matches the most recent opener of the correct type.",
    "hints": [
      "Goal: explain why a single integer counter fails to validate '([)]' while a stack succeeds.",
      "The counter's flaw is that it only tallies open-minus-close, so it can balance numerically yet be mis-nested.",
      "Key property: validity depends on bracket TYPE and nesting order, not just the count — each closer must match the most recent opener of its kind.",
      "Approach: use a stack that pushes each opener and, on a closer, checks the top is the matching opener.",
      "Reasoning: the stack enforces last-opened-first-closed with type matching, catching '([)]' where ')' meets an unmatched '[', while a counter is blind to both type and order.",
      "Answer: a counter ignores bracket type and order (so '([)]' balances numerically but is mis-nested); a stack enforces that each closer matches the most recent opener of the correct type."
    ],
    "recognition": {
      "scenario": "You must validate bracket strings like '([)]'. A single integer counter increments on '(' and decrements on ')'; a stack pushes openers and matches closers. You must explain why the counter fails but the stack succeeds.",
      "approaches": [
        {
          "id": "stack",
          "label": "Use a stack of open brackets",
          "requiredReasonIds": [
            "stack-enforces-type-order"
          ]
        },
        {
          "id": "counter",
          "label": "Use a single integer counter",
          "requiredReasonIds": [],
          "rejectionFeedback": "A counter ignores bracket TYPE and nesting order, so '([)]' balances numerically yet is actually mis-nested — the counter accepts an invalid string."
        }
      ],
      "reasons": [
        {
          "id": "stack-enforces-type-order",
          "text": "A stack makes each closer match the most recent opener of the correct type, so it catches the mis-nesting in '([)]' that a numeric count cannot see."
        },
        {
          "id": "counter-tracks-type",
          "text": "An integer counter tracks each bracket's type and nesting order.",
          "contradictory": true
        },
        {
          "id": "paren-is-numeric",
          "text": "Validity depends only on the total counts of openers and closers, so a counter suffices.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "stack"
      ],
      "modelExplanation": "A counter ignores bracket type and order, so '([)]' balances numerically but is mis-nested. A stack enforces that each closer matches the most recent opener of the correct type."
    }
  }
],

  review: "**Parentheses matching** uses a **stack** because a closer must match the **most recent** opener (LIFO). Push openers; on a closer, pop and compare; at the end the string is valid only if the stack is **empty**. It's **O(n)** time / **O(n)** space. A plain counter fails for mixed bracket types — you need the stack for type and order.",

  expectedOutput: "True\nFalse\n",

  references: [
  {
    "url": "https://runestone.academy/ns/books/published/pythonds3/BasicDS/BalancedSymbolsAGeneralCase.html",
    "title": "Runestone: Balanced symbols",
    "section": "3.8 mixed bracket types and matching-stack algorithm",
    "topic": "parentheses-matching",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "A closer must match the most recent unresolved opener."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Match three bracket types by LIFO order. App valid-input domain contains only the six bracket characters; empty input is valid."
    ]
  },
  {
    "url": "https://courses.cis.cornell.edu/courses/cs2110/2026fa/lectures/lec15/",
    "title": "Cornell CS2110: Stacks and queues",
    "section": "LinkedStack; exercises 15.6, 15.7, 15.10; deque interface",
    "topic": "parentheses-matching",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Mixed bracket types must be properly nested."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source Java LinkedStack removes at the head. App Python nodes retain next links; removing a singly tail still requires finding its predecessor."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "2f08634792aab3fb",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
