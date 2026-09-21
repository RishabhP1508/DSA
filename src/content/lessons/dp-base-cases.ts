/**
 * Lesson: Recursion — base cases (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "120\n". Uses the recursion visualizer to show the
 * call stack growing to the base case and unwinding.
 */

import type { LessonDefinition } from "../../core/types";

const code = `# factorial(n) = n * (n-1) * ... * 1, with factorial(0) = factorial(1) = 1.
def fact(n):
    if n <= 1:            # BASE CASE: smallest input we answer directly
        return 1
    return n * fact(n - 1)  # RECURSIVE CASE: shrink toward the base case

print(fact(5))`;

export const dpBaseCases: LessonDefinition = {
  id: "dp-base-cases",
  title: "Recursion: Base Cases",
  area: "DP and recursion",
  prerequisites: ["functions"],

  explanation: `A **recursive** function is one that calls **itself** on a smaller version of the same problem. Every recursion needs two parts: a **base case** — the smallest input it can answer **directly, without recursing** — and a **recursive case** that does a little work and then calls itself on a **smaller** input, moving **toward** the base case.

The base case is the **stop sign**. Without it (or if the recursive calls never actually get smaller), the function calls itself forever until Python raises \`RecursionError\` from stack overflow. Think of nested Russian dolls: you keep opening a doll to find a smaller one (recursive case) until you reach the tiniest solid doll that does not open (base case). The base case is what makes the process **finite**.

Here \`fact(n)\` computes n·(n−1)·…·1. The base case is \`n <= 1 → return 1\`; the recursive case is \`return n * fact(n - 1)\`, which reduces n by one each call. Calling \`fact(5)\` stacks up \`fact(5) → fact(4) → fact(3) → fact(2) → fact(1)\`; \`fact(1)\` hits the base case and returns 1, then the stack **unwinds**, multiplying on the way back up: 1, 2, 6, 24, **120**. The number of calls is n+1, and because each waits for the one below it, the **maximum call-stack depth is O(n)** — a recursion cost that iteration does not pay. Choosing a **correct, reachable** base case is the first thing to get right in any recursive or dynamic-programming solution.`,

  vocabulary: [
    { term: "Recursion", definition: "A function that solves a problem by calling itself on a smaller input." },
    { term: "Base case", definition: "The smallest input answered directly, with no further recursion; it stops the process." },
    { term: "Recursive case", definition: "The step that does some work and calls the function on a smaller input." },
    { term: "Call stack", definition: "The stack of in-progress function calls; each recursive call adds a frame." },
    { term: "Unwinding", definition: "Returning back up the chain of calls once the base case is reached." },
    { term: "RecursionError", definition: "Raised when recursion never reaches a base case and the stack overflows." },
  ],

  concepts: {
    purpose:
      "Establish the stopping condition that makes recursion finite and correct — the foundation for every recursive and dynamic-programming algorithm.",
    operations:
      "Check the base case first and return directly; otherwise do O(1) work and recurse on a strictly smaller input.",
    uses:
      "Factorials, sums, tree/graph traversal, divide-and-conquer, backtracking, and the recursive definitions DP later memoizes.",
    tradeoffs:
      "Recursion is often clearer than a loop but uses O(depth) stack space and has call overhead; deep recursion can overflow the stack.",
    commonMistakes:
      "Missing or unreachable base case (infinite recursion); recursing on an input that doesn't shrink; putting the recursive call before the base-case check.",
    edgeCases:
      "n = 0 or 1 hits the base case immediately (returns 1). Negative n would never reach the base case here — a precondition to guard in real code.",
  },

  complexity: [
    { operation: "factorial (recursive)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)", note: "n+1 calls; call-stack depth n." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the input to factorial" }],
    costModel:
      "Each call does O(1) work (a comparison and a multiplication) plus one recursive call. Treat one multiplication as constant (ignoring big-integer growth).",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation:
        "The chain fact(n) → fact(n-1) → … → fact(1) makes n+1 calls, each doing constant work. So total time grows linearly with n.",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation:
        "All n+1 frames are on the call stack at once at the deepest point, because each call is paused waiting for the call below it to return. That stack depth is the auxiliary space.",
      inputOutputNote:
        "The single integer result is O(1) to return (ignoring big-integer size); the O(n) space is the recursion stack, not tracer overhead.",
    },
    derivation: [
      { lines: [3, 4], description: "Base-case check and direct return — reached once, O(1).", cost: "O(1)", dimension: "time" },
      { lines: [5], description: "Recursive case runs for n, n-1, …, 2 — that is n-1 recursive calls, each O(1).", cost: "O(n)", dimension: "time" },
      { lines: [2, 3, 4, 5], description: "Up to n+1 stack frames alive simultaneously at the deepest call.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: [
      "A single multiplication is treated as O(1) (ignoring arbitrary-precision integer growth).",
      "n is a non-negative integer, so the base case is reachable.",
      "Python's default recursion limit is not exceeded for this small n.",
    ],
    tradeoffs:
      "An iterative loop computes the same factorial in O(1) space (no call stack). Recursion is used here for clarity and to make the base-case idea concrete; the O(n) stack is the price.",
    counters: [
      { label: "recursive calls", definition: "executions of the recursive-case line (line 5)", countLines: [5] },
      { label: "base-case hits", definition: "executions of the base-case return (line 4)", countLines: [4] },
    ],
    fixedDataNote:
      "fact(5) makes 6 calls with a maximum stack depth of 5. The O(n) time/space describes how those grow with n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment defining factorial and its base value." },
    { line: 2, executable: true, explanation: "Define fact(n)." },
    { line: 3, executable: true, explanation: "Base case: if n is 0 or 1, we can answer directly." },
    { line: 4, executable: true, explanation: "Return 1 without recursing — this stops the recursion." },
    { line: 5, executable: true, explanation: "Recursive case: multiply n by factorial of the smaller input n-1." },
    { line: 6, executable: false, explanation: "Blank line." },
    { line: 7, executable: true, explanation: "Compute fact(5) = 120 and print it." },
  ],

  bindings: [{ variable: "n", model: "recursion" }],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "What happens if you delete the base-case check (lines 3-4) and always run `return n * fact(n - 1)`?",
      answer: "The recursion never stops: n keeps decreasing past 1 into negatives, so it recurses forever until Python raises RecursionError from stack overflow.",
      explanation: "The base case is the stop sign. Without a reachable base case, the call stack grows without bound and overflows.",
    },
  ],

  experiments: [
    "Add a print at the start of fact to see the calls descend, then watch the returns ascend.",
    "Change the base case to `n <= 0` and observe how the call chain changes.",
    "Write factorial as a loop and compare its (constant) stack use to the recursive version.",
  ],

  exercises: [
    {
      id: "dpbc-complete-1",
      kind: "complete-code",
      prompt: "Complete the recursive sum of 1..n with a correct base case.",
      starterCode:
        "def total(n):\n    # TODO: base case for n == 0\n    return n + total(n - 1)",
      expected:
        "def total(n):\n    if n == 0:\n        return 0\n    return n + total(n - 1)",
      hints: [
        "The smallest input is n == 0.",
        "The sum of nothing is 0.",
        "if n == 0: return 0",
      ],
    },
    {
      id: "dpbc-fix-1",
      kind: "fix-mistake",
      prompt: "This recursion never terminates. Fix it so it computes factorial.",
      starterCode:
        "def fact(n):\n    return n * fact(n - 1)",
      expected:
        "def fact(n):\n    if n <= 1:\n        return 1\n    return n * fact(n - 1)",
      hints: [
        "There is no stopping condition.",
        "Add a base case for the smallest input.",
        "if n <= 1: return 1",
      ],
    },
    {
      id: "dpbc-predict-1",
      kind: "predict-state",
      prompt: "For fact(5), how many total calls happen and what is the maximum call-stack depth?",
      expected: "6 calls (fact(5) through fact(1) plus the initial), max depth 5 before unwinding.",
      hints: [
        "Calls go 5,4,3,2,1.",
        "The base case is at n = 1.",
        "All frames stack until fact(1) returns.",
      ],
    },
  ],

  review: `A **recursive** function calls itself on a **smaller** input. It needs a **base case** (answered directly, no recursion) to stop, and a **recursive case** that shrinks toward that base. Missing or unreachable base cases cause infinite recursion and \`RecursionError\`. Factorial is O(n) time with an **O(n) call-stack depth**, since every paused call waits for the one below. Getting a **correct, reachable base case** right is the foundation of all recursion and dynamic programming.`,

  expectedOutput: "120\n",

  references: [
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/Recursion/TheThreeLawsofRecursion.html",
      title: "The Three Laws of Recursion — Problem Solving with Algorithms and Data Structures (Runestone)",
      section: "Base case and moving toward the base case",
      topic: "dp/base-cases",
      purpose: "Confirm that recursion must have a base case and each recursive call must move toward it.",
      verifiedClaims: [
        "A recursive algorithm must have a base case.",
        "A recursive algorithm must change its state and move toward the base case.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://docs.python.org/3/library/sys.html#sys.setrecursionlimit",
      title: "sys.setrecursionlimit — Python Standard Library",
      section: "Recursion limit and RecursionError",
      topic: "dp/base-cases",
      purpose: "Cross-check that Python enforces a recursion limit and raises RecursionError when it is exceeded (as with a missing base case).",
      verifiedClaims: [
        "Python limits recursion depth and raises RecursionError when the limit is exceeded.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "e97f44ebd92612d7",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
