/**
 * Lesson: Bit shifts (Bit manipulation). Verified on CPython 3.14.
 * Output: "12\n5\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Shifting moves bits left or right.
x = 3
print(x << 2)   # left shift by 2 = multiply by 2**2 = 3 * 4 = 12
print(20 >> 2)  # right shift by 2 = floor-divide by 2**2 = 20 // 4 = 5`;

export const bitShifts: LessonDefinition = {
  id: "bit-shifts",
  title: "Bit Shifts",
  area: "Bit manipulation",
  prerequisites: ["bit-logical-ops"],

  explanation: `**Shifting** slides a number's bits left or right by a given number of positions. A **left shift** \`x << k\` appends \`k\` zero bits on the right, which multiplies by \`2ᵏ\`: \`3 << 2\` turns \`0b11\` into \`0b1100 = 12\` (3 × 4). A **right shift** \`x >> k\` drops the \`k\` lowest bits, which is floor-division by \`2ᵏ\`: \`20 >> 2\` turns \`0b10100\` into \`0b101 = 5\` (20 ÷ 4).

Shifts are the workhorse for building **bit masks**: \`1 << k\` produces a number with only bit \`k\` set, which you then combine with AND/OR to test, set, or clear that specific bit (the next lesson). They also give fast power-of-two multiply/divide, though modern compilers/interpreters optimize plain \`*\`/\`//\` too, so use shifts mainly for clarity of *bit intent*, not micro-optimization.

Each shift is **O(1)** on machine words (**O(w)** for w-bit big integers, since bits are physically moved). Right-shift on negative numbers is an *arithmetic* shift in Python (it preserves the sign via two's complement). Mental model: left = grow toward higher place values (×2 each), right = shrink toward lower ones (÷2 each).`,

  vocabulary: [
    { term: "Left shift (<<)", definition: "Move bits left by k, appending zeros; equals multiplying by 2**k." },
    { term: "Right shift (>>)", definition: "Move bits right by k, dropping low bits; equals floor-dividing by 2**k." },
    { term: "Bit mask", definition: "A number with specific bits set, often built as 1 << k." },
    { term: "Power-of-two scaling", definition: "Shifts multiply/divide by powers of two." },
    { term: "Arithmetic shift", definition: "Right shift that preserves sign for negative numbers." },
  ],

  concepts: {
    purpose: "Move bits to build masks and to multiply/divide by powers of two.",
    operations: "x << k (×2^k), x >> k (//2^k), 1 << k to make a single-bit mask.",
    uses: "Constructing masks, indexing bits, fast power-of-two scaling, packing fields.",
    tradeoffs: "O(1) on machine words; clear for bit intent, but plain */// are just as fast for arithmetic.",
    commonMistakes: "Shifting by a negative amount (ValueError); assuming >> rounds toward zero (it floors, differing for negatives); confusing multiply/divide direction.",
    edgeCases: "Shifting by 0 is identity. Large left shifts grow big integers arbitrarily. Right shift of negatives floors (e.g. -1 >> 1 == -1).",
  },

  complexity: [
    { operation: "Shift", best: "O(1)", average: "O(1)", worst: "O(w)", space: "O(1)", note: "O(1) on machine words; O(w) for w-bit big integers." },
  ],

  complexityExplanation: {
    variables: [{ symbol: "w", meaning: "the number of bits in the integer" }],
    costModel: "A shift on a machine word is one hardware instruction (O(1)); on a w-bit big integer it moves w bits (O(w)).",
    time: {
      bound: "O(1)",
      case: "worst",
      explanation: "For machine-word-sized values, each shift is a single constant-time CPU operation. The program does two shifts on small numbers, so it is constant work. Shifting a w-bit arbitrary-precision integer is O(w) because every bit is repositioned — not relevant here.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "It holds one small integer and prints two results; nothing scales with input. (A very large left shift would allocate a bigger integer, O(w) space.)",
    },
    derivation: [
      { lines: [3, 4], description: "Two shift operations on machine-word integers, each O(1).", cost: "O(1)", dimension: "time" },
      { lines: [2], description: "One small integer variable.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Values fit in a machine word so shifts are O(1); big integers of w bits are O(w) per shift."],
    fixedDataNote: "Operands are small fixed literals, so this run is constant work; the O(w) note covers scaling to large integers.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: shifting slides bits left/right." },
    { line: 2, executable: true, explanation: "x = 3 (binary 0b11)." },
    { line: 3, executable: true, explanation: "x << 2 appends two zeros → 0b1100 = 12 (multiply by 4)." },
    { line: 4, executable: true, explanation: "20 >> 2 drops two low bits → 0b101 = 5 (floor-divide by 4)." },
  ],

  bindings: [{ variable: "x", model: "bits" }],

  prediction: [
    { atEventIndex: 0, prompt: "What does 1 << 5 produce, and why is it useful?", answer: "32 (0b100000) — a mask with only bit 5 set, used to test/set/clear that specific bit.", explanation: "Left-shifting 1 by k places the single 1-bit at position k, giving 2^k. Such single-bit masks are combined with &/|/^ to manipulate an individual bit." },
  ],

  experiments: [
    "Print bin(3 << 2) and bin(20 >> 2) to see the bit movement.",
    "Compute 1 << k for k = 0..4 to build single-bit masks.",
    "Try -1 >> 1 and observe Python's sign-preserving (arithmetic) right shift.",
  ],

  exercises: [
    {
      id: "shift-complete-1",
      kind: "complete-code",
      prompt: "Return a mask with only bit k set.",
      starterCode: "def bit_mask(k):\n    # TODO: single 1 at position k\n    pass",
      expected: "def bit_mask(k):\n    return 1 << k",
      hints: ["Start from 1 (bit 0 set).", "Slide it up to position k.", "return 1 << k"],
    },
    {
      id: "shift-predict-1",
      kind: "predict-state",
      prompt: "What is 5 << 3, and what is 40 >> 3? Explain in terms of powers of two.",
      expected: "5 << 3 = 40 (5 * 2^3); 40 >> 3 = 5 (40 // 2^3). Left shift multiplies, right shift floor-divides by 2^k.",
      hints: ["Left shift by k multiplies by 2^k.", "Right shift by k floor-divides by 2^k.", "5*8=40; 40//8=5."],
    },
  ],

  review: `**Shifts** move bits: \`x << k\` multiplies by \`2ᵏ\` (append zeros), \`x >> k\` floor-divides by \`2ᵏ\` (drop low bits). \`1 << k\` builds a single-bit **mask** — the key to testing/setting/clearing individual bits. Shifts are **O(1)** on machine words (O(w) for big integers); right shift on negatives floors (arithmetic shift).`,

  expectedOutput: "12\n5\n",

  references: [
    {
      url: "https://docs.python.org/3/reference/expressions.html#shifting-operations",
      title: "Expressions — Shifting operations — Python Language Reference",
      section: "<< and >>",
      topic: "bits/shifts",
      purpose: "Confirm << multiplies by 2**k and >> floor-divides by 2**k on Python integers.",
      verifiedClaims: ["x << n equals x * 2**n; x >> n equals x // 2**n"],
      accessDate: "2026-09-20",
    },
  ],
};
