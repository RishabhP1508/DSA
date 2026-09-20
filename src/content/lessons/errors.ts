/**
 * Lesson: Errors and exceptions (Programming foundations).
 * Verified on CPython 3.14. Output: "caught: index out of range\nafter\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Some operations fail at runtime by raising an exception.
nums = [1, 2, 3]
try:
    # Index 5 does not exist -> raises IndexError.
    print(nums[5])
except IndexError:
    # We handle the specific error instead of crashing.
    print("caught: index out of range")
# Execution continues normally after a handled exception.
print("after")`;

export const errors: LessonDefinition = {
  id: "errors",
  title: "Errors and Exceptions",
  area: "Programming foundations",
  prerequisites: ["conditions"],

  explanation: `When something goes wrong at runtime — indexing past the end of a list, dividing by zero, converting bad text to a number — Python **raises an exception**. If nothing handles it, the program stops and prints a traceback.

You can handle expected failures with **try / except**: put the risky code in the \`try\` block and the recovery in an \`except\` block for the specific exception type. Here, \`nums[5]\` raises \`IndexError\`; the \`except IndexError\` catches it, prints a friendly message, and the program **continues** to the \`print("after")\`.

Catch **specific** exception types (\`IndexError\`, \`ValueError\`, \`KeyError\`, \`ZeroDivisionError\`) rather than everything, so you don't accidentally hide bugs. Handling errors deliberately is how robust programs deal with bad input and edge cases.`,

  vocabulary: [
    { term: "Exception", definition: "An error raised at runtime that interrupts normal flow, e.g. IndexError." },
    { term: "raise", definition: "The act of signalling an exception (by Python or your own code)." },
    { term: "try / except", definition: "Run risky code in try; handle a named exception in except." },
    { term: "Traceback", definition: "The report Python prints when an exception is unhandled." },
    { term: "IndexError / ValueError / KeyError", definition: "Common exceptions for bad index, bad value/conversion, missing key." },
  ],

  concepts: {
    purpose: "Exceptions let programs detect and recover from runtime problems instead of crashing.",
    operations: "Wrap risky code in try; catch specific types with except; optionally use else/finally.",
    uses: "Validating input, handling missing keys, guarding division, cleaning up resources.",
    tradeoffs: "try/except adds structure and safety; catching too broadly (bare except) hides real bugs.",
    commonMistakes: "Catching Exception/everything and silently passing; putting too much code in one try so you can't tell what failed; using exceptions for ordinary control flow.",
    edgeCases: "An exception raised inside except propagates. finally always runs, even on return or another exception.",
  },

  complexity: [
    { operation: "try/except around O(1) code", best: "O(1)", average: "O(1)", worst: "O(1)", note: "Exception setup is effectively constant here." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "—", meaning: "no input size; a fixed amount of work" }],
    costModel: "Entering a try block and raising/catching an exception are treated as constant-time control-flow operations here.",
    time: {
      bound: "O(1)",
      case: "worst",
      explanation: "The program indexes a list (O(1)), raises and catches one exception, and prints twice. There is no loop, so the total is constant time.",
    },
    space: { bound: "O(1)", case: "worst", explanation: "A fixed list and a couple of constant-size operations; nothing grows with input." },
    derivation: [
      { lines: [5], description: "Indexing raises IndexError — constant-time detection.", cost: "O(1)", dimension: "time" },
      { lines: [6, 8], description: "The matching except runs one print.", cost: "O(1)", dimension: "time" },
      { lines: [10], description: "Execution resumes and prints once more.", cost: "O(1)", dimension: "time" },
      { lines: [2], description: "One small fixed list.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["List indexing and exception handling are constant-time for this small example."],
    tradeoffs: "Checking a condition first (if index < len(nums)) also works and avoids raising; try/except is preferred when the failure is exceptional rather than expected.",
    fixedDataNote: "Fixed list and a single caught error, so the run is constant work; there is no input size to scale.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: some operations raise exceptions." },
    { line: 2, executable: true, explanation: "Create the list [1, 2, 3]. Valid indices are 0, 1, 2." },
    { line: 3, executable: true, explanation: "Begin a try block — risky code goes here." },
    { line: 4, executable: false, explanation: "Comment: index 5 is out of range." },
    { line: 5, executable: true, explanation: "nums[5] does not exist, so this raises IndexError; the print never runs." },
    { line: 6, executable: true, explanation: "Control jumps here because the raised error is an IndexError." },
    { line: 7, executable: false, explanation: "Comment: we handle the error." },
    { line: 8, executable: true, explanation: "Print the friendly message instead of crashing." },
    { line: 9, executable: false, explanation: "Comment: execution continues after handling." },
    { line: 10, executable: true, explanation: "Print 'after' — the program did not crash, so this runs normally." },
  ],

  bindings: [{ variable: "nums", model: "array" }],

  prediction: [
    { atEventIndex: 0, prompt: "Does line 5's print ('print(nums[5])') produce any output? Why?", answer: "No — nums[5] raises IndexError before print runs, so control jumps straight to the except block.", explanation: "The exception is raised while evaluating nums[5], so print never receives a value; execution moves to the matching except." },
  ],

  experiments: [
    "Change the index to 2 and see the try block succeed with no exception.",
    "Catch a ValueError instead and observe that IndexError is no longer handled (it would propagate).",
    "Add a `finally:` block and confirm it runs whether or not an error occurs.",
  ],

  exercises: [
    {
      id: "err-complete-1",
      kind: "complete-code",
      prompt: "Wrap this division so a divisor of 0 prints 'undefined' instead of crashing.",
      starterCode: "a, b = 10, 0\n# TODO: try/except so b == 0 prints 'undefined'\nprint(a / b)",
      expected: "a, b = 10, 0\ntry:\n    print(a / b)\nexcept ZeroDivisionError:\n    print('undefined')",
      hints: ["Dividing by zero raises a specific exception.", "It is ZeroDivisionError.", "Put a / b in try and handle ZeroDivisionError in except."],
    },
    {
      id: "err-choose-1",
      kind: "choose-approach",
      prompt: "You expect a key might be missing from a dict. Is it better to catch KeyError, or to check with `in` first? When?",
      expected: "Both are valid. Use `if key in d` when a miss is common/expected (cheap check); use try/except KeyError when a miss is rare/exceptional. Avoid catching broad Exception.",
      hints: ["Consider how often the key is missing.", "Frequent misses → check first; rare misses → exceptions.", "Either way, be specific (KeyError), not broad."],
    },
  ],

  review: `Runtime failures **raise exceptions**; unhandled ones crash the program. Use **try/except** with a **specific** exception type to recover and continue. Catch narrowly (IndexError, ValueError, …), not everything. Handling one error around constant-time code is **O(1)**.`,

  expectedOutput: "caught: index out of range\nafter\n",

  references: [
    {
      url: "https://docs.python.org/3.14/tutorial/errors.html",
      title: "Errors and Exceptions — Python 3.14 documentation",
      section: "Handling Exceptions",
      topic: "foundations/errors",
      purpose: "Confirm try/except semantics and that execution continues after a handled exception.",
      verifiedClaims: ["A try selects a handler by exception type", "After a handled exception, execution continues after the try statement"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://docs.python.org/3/library/exceptions.html",
      title: "Built-in Exceptions — Python documentation",
      section: "IndexError / ValueError / KeyError / ZeroDivisionError",
      topic: "foundations/errors",
      purpose: "Cross-check which built-in exceptions correspond to which failures.",
      verifiedClaims: ["Indexing out of range raises IndexError", "Dividing by zero raises ZeroDivisionError"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "ee2139d54ac176eb",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 1,
  },
};
