/**
 * Lesson: Recursion — recursive calls & the call tree (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "8\n25\n". Shows the exponential call tree of naive
 * Fibonacci and motivates memoization.
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Naive Fibonacci: each call spawns TWO more calls (a branching call tree).
calls = 0
def fib(n):
    global calls
    calls += 1            # count every call to expose the repeated work
    if n < 2:             # base cases: fib(0)=0, fib(1)=1
        return n
    return fib(n - 1) + fib(n - 2)  # TWO recursive calls

print(fib(6))    # the 6th Fibonacci number
print(calls)     # how many calls it took (lots of repeats!)`;

export const dpRecursiveCalls: LessonDefinition = {
  id: "dp-recursive-calls",
  title: "Recursion: Recursive Calls & the Call Tree",
  area: "DP and recursion",
  prerequisites: ["dp-base-cases"],

  explanation: `When a recursive case makes **more than one** recursive call, the calls form a **call tree** that can grow **explosively**. Naive Fibonacci is the classic example: \`fib(n) = fib(n-1) + fib(n-2)\`, so each call branches into **two**, those branch into two more, and so on. The tree's size roughly **doubles** with each extra level, giving about **O(2ⁿ)** calls — exponential time.

The waste is **repeated work**. Computing \`fib(6)\` needs \`fib(4)\` twice, \`fib(3)\` three times, \`fib(2)\` five times — the same subproblems solved again and again in different branches. The counter in the code makes this visible: \`fib(6)\` is only **8**, but it takes **25** calls to get there. That gap between "answer" and "work" is exactly the signal that a problem has **overlapping subproblems**, the property that **dynamic programming** exploits. Memoization (next lessons) caches each subproblem's answer so it is computed **once**, collapsing the 25 calls to about a dozen and the time to **O(n)**.

Two costs matter and they are **different**. **Time** is the **total number of calls** — how much work happens overall (here 25). **Stack space** is the **maximum number of calls active at the same time** — the deepest path from root to a leaf, which for Fibonacci is **O(n)**, because the tree is explored depth-first and only one root-to-leaf path is "open" at once. Confusing total calls with stack depth is a common analysis error; this lesson keeps them separate.`,

  vocabulary: [
    { term: "Recursive call", definition: "A function invoking itself; multiple such calls per step create branching." },
    { term: "Call tree", definition: "The tree of all recursive calls made, with the initial call at the root." },
    { term: "Overlapping subproblems", definition: "The same smaller problem is solved many times across the tree — DP's opportunity." },
    { term: "Exponential time", definition: "Work that roughly multiplies with each added input unit, e.g. O(2ⁿ)." },
    { term: "Total calls (time)", definition: "How many calls happen overall — the time cost." },
    { term: "Active calls (stack depth)", definition: "How many calls are paused simultaneously — the space cost." },
  ],

  concepts: {
    purpose:
      "Understand how branching recursion produces a call tree, why it can be exponential, and how to distinguish total work from stack depth.",
    operations:
      "Each call checks the base case, then makes zero, one, or several recursive calls; the pattern of calls defines the tree.",
    uses:
      "Analyzing recursive algorithms, spotting overlapping subproblems that justify memoization/DP, reasoning about tree/graph recursion.",
    tradeoffs:
      "Branching recursion is simple to write but can be exponentially slow; the fix (memoization/tabulation) trades memory for time.",
    commonMistakes:
      "Equating total calls with stack depth; assuming two recursive calls always means O(2ⁿ) (it depends on how inputs shrink); forgetting the base case in a branching recursion.",
    edgeCases:
      "fib(0) and fib(1) are base cases returning immediately (1 call each). Small n already shows heavy repetition.",
  },

  complexity: [
    { operation: "naive Fibonacci", best: "O(2ⁿ)", average: "O(2ⁿ)", worst: "O(2ⁿ)", space: "O(n)", note: "Exponential total calls; stack depth only n." },
    { operation: "memoized Fibonacci", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)", note: "Each subproblem solved once (see memoization lesson)." },
  ],

  complexityExplanation: {
    variables: [{ symbol: "n", meaning: "the Fibonacci index requested" }],
    costModel:
      "Each call does O(1) work besides its recursive calls. Time counts the number of calls; stack space counts the maximum simultaneously active calls.",
    time: {
      bound: "O(2ⁿ)",
      case: "worst",
      explanation:
        "Because each non-base call makes two more calls, the number of calls grows like the Fibonacci numbers themselves — roughly φⁿ, which is O(2ⁿ). The counter shows fib(6) takes 25 calls; the count nearly doubles for each extra n. This blow-up comes entirely from re-solving the same subproblems.",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation:
        "The tree is explored depth-first, so only one root-to-leaf path is active at any moment. The deepest such path is length n (fib(n) → fib(n-1) → … → fib(1)), so at most n frames are on the stack at once — far smaller than the total number of calls.",
      inputOutputNote: "Only a single integer result is produced; the O(n) is the recursion stack, not tracer storage.",
    },
    derivation: [
      { lines: [6, 7], description: "Base-case checks/returns — reached at the leaves of the call tree.", cost: "O(1) each", dimension: "time" },
      { lines: [8], description: "Two recursive calls per non-base node cause the O(2ⁿ) branching total.", cost: "O(2ⁿ)", dimension: "time" },
      { lines: [3, 8], description: "Depth-first exploration keeps at most n frames active.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: [
      "Addition of the two results is O(1) (ignoring big-integer growth).",
      "n is a small non-negative integer so the trace stays under the event limit.",
      "No caching is used — this is deliberately the naive version.",
    ],
    tradeoffs:
      "Memoization or tabulation reduces time from O(2ⁿ) to O(n) by storing each subproblem's answer, at O(n) extra memory. This lesson shows the problem; the memoization lesson shows the fix.",
    counters: [
      { label: "total calls", definition: "executions of the counter increment (line 5)", countLines: [5] },
      { label: "branching calls", definition: "executions of the two-call recursive line (line 8)", countLines: [8] },
    ],
    fixedDataNote:
      "fib(6) returns 8 but takes 25 calls — the gap is the repeated work. The O(2ⁿ) bound describes how that call count explodes as n grows.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: each call spawns two more (branching)." },
    { line: 2, executable: true, explanation: "A global counter to expose the total number of calls." },
    { line: 3, executable: true, explanation: "Define fib(n)." },
    { line: 4, executable: true, explanation: "Declare calls as global so we can increment it." },
    { line: 5, executable: true, explanation: "Count this call." },
    { line: 6, executable: true, explanation: "Base cases: fib(0)=0 and fib(1)=1." },
    { line: 7, executable: true, explanation: "Return n directly for the base cases." },
    { line: 8, executable: true, explanation: "Recursive case: sum of the two previous Fibonacci numbers (two calls)." },
    { line: 9, executable: false, explanation: "Blank line." },
    { line: 10, executable: true, explanation: "Print fib(6) = 8." },
    { line: 11, executable: true, explanation: "Print the call count = 25, revealing the repeated work." },
  ],

  bindings: [{ variable: "n", model: "recursion" }],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "fib(6) is only 8, yet it takes 25 calls. What property of the problem does that gap reveal, and what technique fixes it?",
      answer: "It reveals overlapping subproblems — the same fib(k) values are recomputed many times. Memoization (caching each result) fixes it, cutting the time to O(n).",
      explanation: "The huge gap between the small answer and the large number of calls is the signature of overlapping subproblems, which dynamic programming removes by solving each subproblem once.",
    },
  ],

  experiments: [
    "Increase n by 1 or 2 and watch the call count roughly double each time.",
    "Add a dictionary cache and re-count the calls to see the drop.",
    "Print n at the start of each call to see the same values recomputed.",
  ],

  exercises: [
    {
      id: "dprc-predict-1",
      kind: "predict-state",
      prompt: "The maximum call-stack depth for fib(6) — is it 25, 8, or 6? Explain.",
      expected: "6 (about n). Depth-first exploration keeps only one root-to-leaf path active; total calls (25) is the time cost, not the stack depth.",
      hints: [
        "Total calls ≠ stack depth.",
        "Only one branch is open at a time.",
        "The deepest path is fib(6)→fib(5)→…→fib(1).",
      ],
    },
    {
      id: "dprc-choose-1",
      kind: "choose-approach",
      prompt: "You notice a recursive solution recomputes identical subproblems many times. Which technique should you reach for, and why?",
      expected: "Memoization (or bottom-up tabulation): cache each subproblem's answer so it's computed once, turning exponential repeated work into linear work.",
      hints: [
        "The issue is repeated identical subproblems.",
        "Store answers so they're reused.",
        "That is memoization / dynamic programming.",
      ],
    },
    {
      id: "dprc-complete-1",
      kind: "complete-code",
      prompt: "Complete the branching recursive case for Fibonacci.",
      starterCode:
        "def fib(n):\n    if n < 2:\n        return n\n    # TODO: two recursive calls summed\n    return 0",
      expected:
        "def fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)",
      hints: [
        "Fibonacci sums the two previous numbers.",
        "Recurse on n-1 and n-2.",
        "return fib(n - 1) + fib(n - 2)",
      ],
    },
  ],

  review: `Branching recursion builds a **call tree**. Naive Fibonacci makes **two** calls per step, so the tree — and the total number of calls — grows about **O(2ⁿ)**: \`fib(6)\` is 8 but costs **25 calls**. That gap is the fingerprint of **overlapping subproblems**, which **memoization/DP** removes to reach O(n). Keep two costs separate: **time = total calls**; **stack space = maximum simultaneously active calls = O(n)** here. The next lessons turn this repeated work into efficient DP.`,

  expectedOutput: "8\n25\n",

  references: [
    {
      url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/lecture-notes/",
      title: "Introduction to Algorithms 6.006 — Dynamic Programming lecture notes (MIT OCW)",
      section: "Overlapping subproblems; naive Fibonacci vs memoized",
      topic: "dp/recursive-calls",
      purpose: "Confirm that naive Fibonacci is exponential due to recomputed overlapping subproblems and that memoization reduces it to linear.",
      verifiedClaims: [
        "Naive recursive Fibonacci runs in exponential time from repeated subproblem computation.",
        "Memoizing subproblems yields linear time.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/Recursion/CalculatingtheSumofaListofNumbers.html",
      title: "Recursion — Problem Solving with Algorithms and Data Structures (Runestone)",
      section: "Recursive calls and the call stack",
      topic: "dp/recursive-calls",
      purpose: "Cross-check that recursive calls accumulate on the call stack and that stack depth reflects active calls, distinct from total calls.",
      verifiedClaims: [
        "Each recursive call adds a frame to the call stack until a base case returns.",
      ],
      accessDate: "2026-09-20",
    },
  ],
};
