/**
 * Lesson: Input and output (Programming foundations). Verified on CPython 3.14
 * with stdin "Ada\n5\n". Output: "Name: Number: Hello Ada\n10\n".
 *
 * Note: input() echoes its prompt to stdout in this workspace, so the two
 * prompts appear before the first printed line.
 */

import type { LessonDefinition } from "../../core/types";

const code = `# input() reads a line of text that you supply.
name = input("Name: ")
# Input always arrives as a string; convert to int for arithmetic.
n = int(input("Number: "))
# print() sends values to the output.
print("Hello", name)
print(n * 2)`;

export const io: LessonDefinition = {
  id: "io",
  title: "Input and Output",
  area: "Programming foundations",
  prerequisites: ["expressions"],

  explanation: `Programs talk to the outside world through **input** and **output**. \`input()\` reads one line of text; \`print()\` writes values out.

The single most common beginner trap: **\`input()\` always returns a string**, even if the user types digits. \`"5"\` is text, not the number 5 — and \`"5" * 2\` is \`"55"\`, not \`10\`. To do arithmetic you must convert with \`int(...)\` (or \`float(...)\`).

In this workspace you supply the input ahead of time (a "supplied input" box), and \`print\` output is captured and shown in the Output panel. \`print\` separates multiple values with a space and adds a newline at the end.`,

  vocabulary: [
    { term: "input()", definition: "Reads one line of text from the supplied input and returns it as a string." },
    { term: "print()", definition: "Writes values to the output, space-separated, followed by a newline." },
    { term: "int() / float()", definition: "Convert a string (or number) to an integer / floating-point value." },
    { term: "Type conversion (casting)", definition: "Turning a value of one type into another, e.g. int('5') → 5." },
  ],

  concepts: {
    purpose: "I/O lets a program receive data and report results.",
    operations: "Read with input(), convert with int()/float(), write with print().",
    uses: "Reading parameters for an algorithm, printing traced results, interactive exercises.",
    tradeoffs: "Converting input is required for arithmetic but can fail on bad data (raises ValueError).",
    commonMistakes: "Doing math on the string from input() without converting; assuming input() strips more than the trailing newline.",
    edgeCases: "int('abc') raises ValueError. If no input is supplied, input() gets an empty line (handle exhausted input).",
  },

  complexity: [
    { operation: "Read + convert + print", best: "O(1)", average: "O(1)", worst: "O(L)", note: "Linear in the length L of the text read/printed." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "L", meaning: "the number of characters in the text being read or printed" }],
    costModel: "Reading or printing a line costs time proportional to its length L; converting a numeric string of length L to int is O(L).",
    time: {
      bound: "O(L)",
      case: "worst",
      explanation: "There is no loop in the program, but reading a line, converting it, and printing it each touch every character, so the cost is proportional to the text length L. For short inputs this is effectively constant.",
    },
    space: {
      bound: "O(L)",
      case: "worst",
      explanation: "The strings read from input are held in memory, so storage is proportional to their length L. Beyond that, only a couple of variables are kept.",
      inputOutputNote: "The supplied input text and the printed output are I/O, sized by L; they are the data, distinct from algorithmic auxiliary space.",
    },
    derivation: [
      { lines: [2, 4], description: "Reading each input line touches its L characters.", cost: "O(L)", dimension: "time" },
      { lines: [4], description: "int(...) parses a numeric string of length L.", cost: "O(L)", dimension: "time" },
      { lines: [6, 7], description: "Printing writes each character of the output.", cost: "O(L)", dimension: "time" },
      { lines: [2, 4], description: "Holding the input strings uses O(L) space.", cost: "O(L)", dimension: "space" },
    ],
    assumptions: ["The converted number fits in a machine word so int arithmetic is O(1); otherwise arbitrary-precision costs apply.", "Input is well-formed (a valid integer); malformed input raises ValueError."],
    fixedDataNote: "This run reads short fixed inputs ('Ada', '5'), so the work is tiny; the O(L) bound describes growth with longer text.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: input() reads supplied text." },
    { line: 2, executable: true, explanation: "Read a line into name. The prompt 'Name: ' is shown; name becomes the string 'Ada'." },
    { line: 3, executable: false, explanation: "Comment: input is a string; convert for math." },
    { line: 4, executable: true, explanation: "Read '5' and convert it with int(), so n is the integer 5 (not the string '5')." },
    { line: 5, executable: false, explanation: "Comment: print() writes output." },
    { line: 6, executable: true, explanation: "Print 'Hello' and name, space-separated → 'Hello Ada'." },
    { line: 7, executable: true, explanation: "Print n * 2. Because n is an int, this is 10 (not '55')." },
  ],

  stdin: "Ada\n5\n",

  bindings: [{ variable: "name", model: "object" }],

  prediction: [
    { atEventIndex: 0, prompt: "If line 4 were `n = input('Number: ')` (no int()), what would `n * 2` print for input 5?", answer: "'55' — because n would be the string '5', and '5' * 2 repeats the string.", explanation: "input() returns a string; multiplying a string by 2 repeats it. Converting with int() is what makes n * 2 equal 10." },
  ],

  experiments: [
    "Change the supplied input to a different name and number and re-run.",
    "Remove int() on line 4 and observe the string-repetition behaviour of n * 2.",
    "Supply a non-numeric second line and see the ValueError explanation.",
  ],

  exercises: [
    {
      id: "io-fix-1",
      kind: "fix-mistake",
      prompt: "This program should print double the entered number but prints it twice in a row instead. Fix it.",
      starterCode: "n = input('n: ')\nprint(n * 2)",
      expected: "n = int(input('n: '))\nprint(n * 2)",
      hints: ["What type does input() return?", "Multiplying a string repeats it.", "Convert with int() before doing arithmetic."],
    },
    {
      id: "io-predict-1",
      kind: "predict-state",
      prompt: "What type is the value returned by input()?",
      expected: "A string (str), always — even if the user types digits.",
      hints: ["Think about what the user types.", "It is always text.", "input() returns a str; convert for numbers."],
    },
  ],

  review: `\`input()\` reads a line as a **string** (convert with \`int()\`/\`float()\` for math), and \`print()\` writes space-separated values plus a newline. Reading/printing text of length L is **O(L)** time and space; the classic bug is doing arithmetic on un-converted input.`,

  expectedOutput: "Name: Number: Hello Ada\n10\n",

  references: [
    {
      url: "https://docs.python.org/3/library/functions.html#input",
      title: "Built-in Functions — input() — Python documentation",
      section: "input()",
      topic: "foundations/io",
      purpose: "Confirm input() reads a line and returns it as a string (trailing newline stripped).",
      verifiedClaims: ["input() returns a string with the trailing newline removed"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://docs.python.org/3/library/functions.html#int",
      title: "Built-in Functions — int() — Python documentation",
      section: "int()",
      topic: "foundations/io",
      purpose: "Confirm int() converts a numeric string to an integer and raises ValueError otherwise.",
      verifiedClaims: ["int('5') == 5", "int() of a non-numeric string raises ValueError"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "0c34394abcb68771",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 1,
  },
};
