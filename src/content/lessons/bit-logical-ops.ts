/**
 * Lesson: Bitwise logical operators (Bit manipulation). Verified on CPython 3.14.
 * Output: "8\n14\n6\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Bitwise operators combine numbers bit by bit.
a = 0b1100   # 12
b = 0b1010   # 10
print(a & b) # AND: 1 only where BOTH are 1 -> 0b1000 = 8
print(a | b) # OR:  1 where EITHER is 1     -> 0b1110 = 14
print(a ^ b) # XOR: 1 where they DIFFER     -> 0b0110 = 6`;

export const bitLogicalOps: LessonDefinition = {
  id: "bit-logical-ops",
  title: "Bitwise Logical Operators",
  area: "Bit manipulation",
  prerequisites: ["expressions"],

  explanation: `Numbers are stored in **binary**, and **bitwise operators** act on those bits in parallel. The three core ones combine two numbers bit position by bit position: **AND (\`&\`)** gives 1 only where *both* bits are 1; **OR (\`|\`)** gives 1 where *either* is 1; **XOR (\`^\`)** gives 1 only where the bits *differ*. There's also **NOT (\`~\`)**, which flips every bit.

You can read the example directly in binary: \`1100 & 1010 = 1000\` (only the 8-bit is set in both), \`1100 | 1010 = 1110\`, and \`1100 ^ 1010 = 0110\`. Python's \`0b\` prefix writes binary literals, and \`bin(x)\` shows a number's bits.

Each operation is **O(1)** on machine-word integers (a fixed number of hardware operations). Python integers are *arbitrary precision*, so for numbers with \`w\` bits these are technically **O(w)**, but for normal values treat them as constant time. Bitwise ops are the foundation for masks, flags, sets-as-bits, and the XOR tricks in later lessons. The mental model to build: think of a number as a **row of independent bits** you can test and combine.`,

  vocabulary: [
    { term: "Bit", definition: "A single binary digit, 0 or 1." },
    { term: "AND (&)", definition: "1 only where both operands have 1." },
    { term: "OR (|)", definition: "1 where at least one operand has 1." },
    { term: "XOR (^)", definition: "1 only where the operands differ." },
    { term: "NOT (~)", definition: "Flips every bit (in Python, ~x == -(x+1) due to two's complement)." },
    { term: "Binary literal (0b)", definition: "Writing a number in binary, e.g. 0b1100 = 12." },
  ],

  concepts: {
    purpose: "Combine and test individual bits in parallel — the basis of masks, flags, and bit tricks.",
    operations: "& (and), | (or), ^ (xor), ~ (not); bin() to view bits, 0b to write them.",
    uses: "Bit flags/permissions, sets represented as bitmasks, XOR problems, low-level packing.",
    tradeoffs: "O(1) on machine words (O(w) for w-bit big integers); very fast but less readable than named booleans.",
    commonMistakes: "Confusing & with `and` (bitwise vs boolean); expecting ~x to be a small positive (Python uses two's complement, ~x = -(x+1)); operator precedence (& binds looser than ==, so parenthesize).",
    edgeCases: "Negative numbers use two's complement semantics. ~0 is -1. XOR of a value with itself is 0.",
  },

  complexity: [
    { operation: "Bitwise op", best: "O(1)", average: "O(1)", worst: "O(w)", space: "O(1)", note: "O(1) for machine words; O(w) for w-bit big integers." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "w", meaning: "the number of bits in the integers involved" }],
    costModel: "A bitwise operation on machine-word integers is one hardware instruction (O(1)); on arbitrary-precision integers it processes w bits (O(w)).",
    time: {
      bound: "O(1)",
      case: "worst",
      explanation: "For values that fit in a machine word, each of &, |, ^ is a single constant-time CPU operation. The program does three such operations on small numbers, so it is constant work. For very large integers with w bits, a bitwise op is O(w) since every bit is processed — not relevant to these small values.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "It holds two small integers and prints three results; nothing grows with input.",
    },
    derivation: [
      { lines: [4, 5, 6], description: "Three bitwise operations on machine-word-sized integers, each O(1).", cost: "O(1)", dimension: "time" },
      { lines: [2, 3], description: "Two small integer variables.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Operands fit in a machine word so each op is O(1); w-bit big integers would be O(w) per op."],
    fixedDataNote: "Operands are fixed 4-bit literals, so this run is constant work; the O(w) note covers scaling to very large integers.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: bitwise operators act bit by bit." },
    { line: 2, executable: true, explanation: "a = 0b1100 = 12." },
    { line: 3, executable: true, explanation: "b = 0b1010 = 10." },
    { line: 4, executable: true, explanation: "AND: bits set in BOTH → 0b1000 = 8." },
    { line: 5, executable: true, explanation: "OR: bits set in EITHER → 0b1110 = 14." },
    { line: 6, executable: true, explanation: "XOR: bits that DIFFER → 0b0110 = 6." },
  ],

  bindings: [
    { variable: "a", model: "bits" },
    { variable: "b", model: "bits" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "What is the difference between `&` and `and` in Python?", answer: "`&` is bitwise AND (combines bits of two integers); `and` is boolean/logical AND (evaluates truthiness and short-circuits).", explanation: "`5 & 3` operates on bits giving 1, while `5 and 3` evaluates truthy operands and returns 3. They are different operators for different purposes." },
  ],

  experiments: [
    "Print bin(a & b), bin(a | b), bin(a ^ b) to see the bit patterns.",
    "Compute ~a and note Python's two's-complement result -(a+1).",
    "Try a ^ a and a ^ 0 to preview XOR identities.",
  ],

  exercises: [
    {
      id: "bit-log-predict-1",
      kind: "predict-state",
      prompt: "Compute 0b0110 & 0b0011, 0b0110 | 0b0011, and 0b0110 ^ 0b0011 in binary.",
      expected: "& = 0b0010 (2); | = 0b0111 (7); ^ = 0b0101 (5).",
      hints: ["AND: 1 where both are 1.", "OR: 1 where either is 1.", "XOR: 1 where they differ."],
    },
    {
      id: "bit-log-choose-1",
      kind: "choose-approach",
      prompt: "You want to combine several on/off feature flags into one integer and test them. Which operators do you use to SET a flag and to TEST it?",
      expected: "Use OR (|) with the flag's bit to set it, and AND (&) with the flag's bit to test it (non-zero means set).",
      hints: ["Setting a bit adds it in.", "OR adds bits; AND masks/tests them.", "flags |= FLAG to set; (flags & FLAG) to test."],
    },
  ],

  review: `**Bitwise operators** act on binary digits in parallel: **& (AND)** = both, **| (OR)** = either, **^ (XOR)** = differ, **~ (NOT)** = flip. They are **O(1)** on machine words (O(w) for w-bit big integers) and underpin masks, flags, and XOR tricks. Don't confuse \`&\` (bitwise) with \`and\` (boolean), and parenthesize because \`&\` has low precedence.`,

  expectedOutput: "8\n14\n6\n",

  references: [
    {
      url: "https://docs.python.org/3/reference/expressions.html#binary-bitwise-operations",
      title: "Expressions — Binary bitwise operations — Python Language Reference",
      section: "&, |, ^ and shifting operations",
      topic: "bits/logical-ops",
      purpose: "Confirm the semantics of &, |, ^ (and ~) on Python integers.",
      verifiedClaims: ["& is bitwise AND, | is OR, ^ is XOR; they operate on the two's-complement bit representation"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://wiki.python.org/moin/BitwiseOperators",
      title: "BitwiseOperators — Python Wiki",
      section: "Operator overview",
      topic: "bits/logical-ops",
      purpose: "Cross-check operator meanings and the ~x = -(x+1) two's-complement behavior.",
      verifiedClaims: ["~x equals -(x+1) in Python due to two's complement"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "17416ddf6adb13d3",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
