/**
 * Lesson: String parsing (Strings). Verified on CPython 3.14.
 * Output: "['12', '7', '5', '20']\n44\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Parse a comma-separated line into numbers.
line = "12,7,5,20"
# split breaks the string on the delimiter into a list of pieces.
parts = line.split(",")
# Convert each piece to an int with a comprehension.
nums = [int(p) for p in parts]
print(parts)
print(sum(nums))`;

export const stringParsing: LessonDefinition = {
  id: "string-parsing",
  title: "String Parsing",
  area: "Strings",
  prerequisites: ["io", "loops"],

  explanation: `**Parsing** turns raw text into structured data you can compute with. The everyday tools are \`split\` (break a string on a delimiter into a list of pieces), \`strip\` (trim whitespace), and conversions like \`int\`/\`float\`.

Here we take \`"12,7,5,20"\`, \`split\` it on the comma to get the string pieces \`['12','7','5','20']\`, then convert each to an integer with a list comprehension and sum them. This "split then convert" pattern is how you read CSV-like input, tokenize commands, and prepare data for an algorithm.

The cost is linear in the total number of characters: \`split\` scans the whole string once (**O(L)** for length L), and converting/summing touches each token. Remember the lesson from Input/Output — text is not numbers until you convert it, and malformed tokens (e.g. \`int("x")\`) raise \`ValueError\`.`,

  vocabulary: [
    { term: "Parsing", definition: "Converting raw text into structured values." },
    { term: "split(delimiter)", definition: "Breaks a string into a list of substrings around each delimiter." },
    { term: "Delimiter", definition: "The separator character(s), e.g. a comma." },
    { term: "Tokens", definition: "The pieces produced by splitting." },
    { term: "List comprehension", definition: "Concise syntax to build a list, e.g. [int(p) for p in parts]." },
  ],

  concepts: {
    purpose: "Parsing prepares real input (CSV, commands, logs) for computation.",
    operations: "split on a delimiter, strip whitespace, convert tokens with int/float.",
    uses: "Reading structured input, tokenizing expressions, cleaning data before an algorithm.",
    tradeoffs: "split is simple but naive for quoted/escaped fields; conversions can raise on bad data.",
    commonMistakes: "Forgetting to convert tokens (summing strings); not stripping whitespace; assuming a fixed number of fields; unhandled ValueError on malformed input.",
    edgeCases: "Empty string splits to ['']; trailing delimiter yields an empty token; extra spaces need strip.",
  },

  complexity: [
    { operation: "split + convert + sum", best: "O(L)", average: "O(L)", worst: "O(L)", space: "O(L)", note: "L = total characters; output list is O(t) tokens." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "L", meaning: "the total number of characters in the input line" },
      { symbol: "t", meaning: "the number of tokens produced by split" },
    ],
    costModel: "split scans each character once (O(L)); int(token) is linear in the token's digits; sum adds t numbers.",
    time: {
      bound: "O(L)",
      case: "worst",
      explanation: "split reads every character of the line once to find delimiters — O(L). Converting all tokens with int touches each character of each token, which together is also O(L). Summing t numbers is O(t) <= O(L). So the whole pipeline is linear in the input length L.",
    },
    space: {
      bound: "O(L)",
      case: "worst",
      explanation: "split produces a list of substrings whose characters total about L, and nums holds t integers. Both are proportional to the input size.",
      inputOutputNote: "The parts and nums lists are derived data sized by the input; they are the natural output of parsing.",
    },
    derivation: [
      { lines: [4], description: "split scans all L characters to find delimiters.", cost: "O(L)", dimension: "time" },
      { lines: [6], description: "Converting every token touches each character once (total O(L)).", cost: "O(L)", dimension: "time" },
      { lines: [8], description: "Summing t numbers.", cost: "O(L)", dimension: "time" },
      { lines: [4, 6], description: "The token list and integer list total O(L) storage.", cost: "O(L)", dimension: "space" },
    ],
    assumptions: ["Integers fit in a machine word so each int() is effectively linear in its digits; tokens are well-formed."],
    tradeoffs: "For complex formats (quotes, escapes) a real CSV parser is safer than split, at more overhead; split is fine for simple delimited data.",
    fixedDataNote: "This run parses a short fixed line into 4 tokens summing to 44. The O(L) bounds generalise to longer input.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: parse a CSV line into numbers." },
    { line: 2, executable: true, explanation: "The raw input line." },
    { line: 3, executable: false, explanation: "Comment: split breaks on the delimiter." },
    { line: 4, executable: true, explanation: "split(',') → ['12', '7', '5', '20'] (still strings)." },
    { line: 5, executable: false, explanation: "Comment: convert each piece to int." },
    { line: 6, executable: true, explanation: "List comprehension builds [12, 7, 5, 20] as integers." },
    { line: 7, executable: true, explanation: "Print the string pieces → ['12', '7', '5', '20']." },
    { line: 8, executable: true, explanation: "Print the sum of the integers → 44." },
  ],

  bindings: [
    { variable: "parts", model: "array" },
    { variable: "nums", model: "array" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "After split, what type are the elements of parts, and why does sum(parts) fail?", answer: "They are strings; sum expects numbers, and adding strings to the integer start value raises a TypeError.", explanation: "split returns substrings (strings). You must convert with int() before numeric operations like sum, which starts from 0 (an int) and cannot add strings." },
  ],

  experiments: [
    "Change the delimiter to a space and split on ' '.",
    "Add a stray space in a token and use int(p.strip()) to handle it.",
    "Feed a malformed token like '5x' and observe the ValueError.",
  ],

  exercises: [
    {
      id: "sp-complete-1",
      kind: "complete-code",
      prompt: "Parse a space-separated line of integers into a list and print their maximum.",
      starterCode: "line = '3 9 2 7'\n# TODO: split, convert to ints, print the max\n",
      expected: "line = '3 9 2 7'\nnums = [int(p) for p in line.split()]\nprint(max(nums))",
      hints: ["split() with no argument splits on whitespace.", "Convert each token with int in a comprehension.", "print(max(nums))"],
    },
    {
      id: "sp-choose-1",
      kind: "choose-approach",
      prompt: "You must read '10,20,30' and add them. What two steps are required and in what order?",
      expected: "First split on ',' to get string tokens, then convert each with int before summing (text must become numbers first).",
      hints: ["What separates the numbers?", "Break the string into pieces, then...", "convert each piece to int, then sum."],
    },
  ],

  review: `**Parsing** turns text into data: \`split\` breaks a string into tokens, then \`int\`/\`float\` convert them. The "split then convert" pipeline is **O(L)** in the input length. Remember tokens are strings until converted, and malformed tokens raise \`ValueError\`.`,

  expectedOutput: "['12', '7', '5', '20']\n44\n",

  references: [
    {
      url: "https://docs.python.org/3/library/stdtypes.html#str.split",
      title: "Built-in Types — str.split — Python documentation",
      section: "str.split(sep)",
      topic: "strings/parsing",
      purpose: "Confirm split returns a list of substrings around the delimiter.",
      verifiedClaims: ["str.split(sep) returns a list of the substrings between separators"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://docs.python.org/3.14/tutorial/datastructures.html",
      title: "Data Structures — Python 3.14 documentation",
      section: "List Comprehensions",
      topic: "strings/parsing",
      purpose: "Confirm list-comprehension syntax used to convert tokens.",
      verifiedClaims: ["[expr for item in iterable] builds a list"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "3cb54e5b8f07fb79",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
