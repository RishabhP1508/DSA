/**
 * Lesson: Functions (Programming foundations). Verified on CPython 3.14.
 * Output: "7\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# A function packages reusable steps behind a name.
def add(a, b):
    # a and b are parameters; result is a local variable.
    result = a + b
    return result

# Call the function with arguments 2 and 5.
answer = add(2, 5)
print(answer)`;

export const functions: LessonDefinition = {
  id: "functions",
  title: "Functions",
  area: "Programming foundations",
  prerequisites: ["loops"],

  explanation: `A **function** gives a name to a reusable piece of work. You **define** it once with \`def\`, listing **parameters** (inputs), and later **call** it with **arguments** (actual values). The \`return\` statement hands a value back to whoever called the function.

Functions are the backbone of every larger program: they let you name an idea ("add these two numbers"), test it in isolation, and reuse it. When you call \`add(2, 5)\`, Python creates a fresh **frame** for that call, binds \`a = 2\` and \`b = 5\`, runs the body, and the \`return\` sends \`7\` back — then the frame disappears.

Watching the call stack in the visualization makes this concrete: a frame appears on the call, its locals live only inside it, and it is removed on return.`,

  vocabulary: [
    { term: "Function", definition: "A named, reusable block of code that may take inputs and return a value." },
    { term: "def", definition: "The keyword that defines a function." },
    { term: "Parameter", definition: "A name in the function definition that receives an argument." },
    { term: "Argument", definition: "An actual value passed to a function when you call it." },
    { term: "return", definition: "Hands a value back to the caller and ends the function call." },
    { term: "Frame", definition: "The temporary workspace for one function call, holding its local variables." },
  ],

  concepts: {
    purpose: "Functions name and reuse logic, reduce repetition, and make code testable and readable.",
    operations: "Define with def, call with arguments, return a result, use local variables.",
    uses: "Every algorithm is packaged as a function; later lessons build on calls and the call stack shown here.",
    tradeoffs: "Function calls add a small overhead and a stack frame, but the clarity and reuse are almost always worth it.",
    commonMistakes: "Forgetting to return (the function then returns None); confusing parameters with arguments; expecting a function's local variables to exist outside it.",
    edgeCases: "A function with no return statement returns None. Default parameter values are evaluated once, at definition time.",
  },

  complexity: [
    { operation: "Call add(a, b)", best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(1)", note: "One addition and one frame." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "—", meaning: "no input size; the function does constant work per call" }],
    costModel: "One arithmetic operation and the setup/teardown of one call frame are each constant time.",
    time: {
      bound: "O(1)",
      case: "worst",
      explanation: "add does a single addition and returns, with no loop or recursion, so one call is constant time for the small fixed-size integers used here (2 and 5). This O(1) assumes the operands fit in a machine word; Python ints are arbitrary precision, so for very large operands the addition cost grows with the number of digits — that is outside this example's small-value assumption.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "One call frame is active at a time, holding a fixed set of locals (a, b, result). The maximum call-stack depth is 1 (main → add), which does not grow with input.",
    },
    derivation: [
      { lines: [8], description: "One call creates one frame — constant setup.", cost: "O(1)", dimension: "time" },
      { lines: [4, 5], description: "One addition and one return inside the body.", cost: "O(1)", dimension: "time" },
      { lines: [4], description: "A fixed number of locals in a single frame; stack depth stays at 1.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["The operands are small, fixed-size integers, so one addition is O(1) (Python ints are arbitrary precision; addition of d-digit integers is O(d)).", "No recursion, so call depth is bounded by a constant."],
    tradeoffs: "Inlining the addition (writing 2 + 5 directly) avoids the call overhead but loses reuse and readability; the O-class is the same.",
    counters: [{ label: "function calls", definition: "call events for add (line 8)", countLines: [8] }],
    fixedDataNote: "The arguments are fixed, small ints (2 and 5), so this run does constant work. add is O(1) per call for small, machine-word-sized operands; it is NOT unconditionally O(1) for arbitrarily large integers, whose addition cost grows with their digit count.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: a function packages reusable steps." },
    { line: 2, executable: true, explanation: "Define the function add with parameters a and b. The def line runs to create the function object." },
    { line: 3, executable: false, explanation: "Comment describing parameters and the local variable." },
    { line: 4, executable: true, explanation: "Inside a call, compute a + b and store it in the local variable result." },
    { line: 5, executable: true, explanation: "Return result to the caller, ending this call." },
    { line: 6, executable: false, explanation: "Blank line." },
    { line: 7, executable: false, explanation: "Comment: we are about to call add." },
    { line: 8, executable: true, explanation: "Call add(2, 5). A new frame binds a=2, b=5; the returned value 7 is stored in answer." },
    { line: 9, executable: true, explanation: "Print answer → 7." },
  ],

  // `model: "recursion"` is the CALL-STACK visualizer: it reads the recorded
  // frames (not a bound variable) and shows each call's frame appearing on call
  // and disappearing on return. The binding names the function whose calls are
  // being traced (`add`), NOT a result value — this example is a plain function
  // call, not recursion. The label makes that explicit for the learner.
  bindings: [{ variable: "add", model: "recursion" }],

  prediction: [
    { atEventIndex: 0, prompt: "What does add return if you call add(10, -3)?", answer: "7", explanation: "It returns a + b = 10 + (-3) = 7." },
  ],

  experiments: [
    "Add a third parameter c and return a + b + c; update the call.",
    "Remove the return statement and print the result of the call — it will be None.",
    "Call add twice and watch two separate frames appear and disappear.",
  ],

  exercises: [
    {
      id: "func-complete-1",
      kind: "complete-code",
      prompt: "Write a function `square(n)` that returns n times itself, then print square(6).",
      starterCode: "def square(n):\n    # TODO: return n squared\n    pass\nprint(square(6))",
      expected: "def square(n):\n    return n * n\nprint(square(6))",
      hints: ["Squaring means multiplying a number by itself.", "return n * n.", "Then print(square(6)) shows 36."],
    },
    {
      id: "func-predict-1",
      kind: "predict-state",
      prompt: "A function has no return statement. What value does calling it produce?",
      expected: "None — a function without an explicit return returns None.",
      hints: ["Every function call produces some value.", "Without return, Python supplies a default.", "That default is None."],
    },
  ],

  review: `A **function** (defined with \`def\`) names reusable work, takes **arguments** into **parameters**, and hands back a value with \`return\` (or \`None\` if you omit it). Each call gets its own **frame** with its own locals. A non-recursive function that does fixed work is **O(1)** time and space per call.`,

  expectedOutput: "7\n",

  references: [
    {
      url: "https://docs.python.org/3.14/tutorial/controlflow.html",
      title: "More Control Flow Tools — Python 3.14 documentation",
      section: "Defining Functions",
      topic: "foundations/functions",
      purpose: "Confirm def/return semantics and that a function without return yields None.",
      verifiedClaims: ["def introduces a function definition", "A function without a return statement returns None"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex",
      title: "Built-in Types — Numeric Types (int, float, complex) — Python 3.14 documentation",
      section: "Numeric Types",
      topic: "foundations/functions",
      purpose: "Ground the O(1)-cost caveat: Python's int is arbitrary precision, so addition cost grows with operand size — the per-call O(1) holds only for small, fixed-size operands.",
      verifiedClaims: ["Python integers (int) have unlimited precision, so arithmetic cost can grow with the operands' size"],
      accessDate: "2026-10-03",
    },
  ],
  evidence: {
    inventoryVersion: 19,
    contentHash: "8e233bf96888307b",
    verifiedAt: "2026-10-03",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
    reviewBatch: 1,
  },
};
