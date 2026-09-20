/**
 * Lesson: Check / set / clear / toggle bits (Bit manipulation).
 * Verified on CPython 3.14. Output: "1\n11\n2\n8\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Manipulate individual bits using masks (1 << i).
n = 0b1010   # 10, bits: bit3=1 bit2=0 bit1=1 bit0=0
# CHECK bit 1 (is it set?): shift it down and mask with 1.
print((n >> 1) & 1)         # -> 1
# SET bit 0 (force it to 1): OR with the mask.
print(n | (1 << 0))         # 0b1011 = 11
# CLEAR bit 3 (force it to 0): AND with the inverted mask.
print(n & ~(1 << 3))        # 0b0010 = 2
# TOGGLE bit 1 (flip it): XOR with the mask.
print(n ^ (1 << 1))         # 0b1000 = 8`;

export const bitCheckSetClear: LessonDefinition = {
  id: "bit-check-set-clear",
  title: "Check, Set, Clear, and Toggle Bits",
  area: "Bit manipulation",
  prerequisites: ["bit-shifts"],

  explanation: `Once you can build a single-bit **mask** with \`1 << i\`, you can manipulate any individual bit of a number using the logical operators. These four idioms are worth memorizing because they appear constantly in bitmask problems:

- **Check** bit i: \`(n >> i) & 1\` — shift the bit down to position 0 and mask it. Result is 1 if set, 0 if not.
- **Set** bit i (force to 1): \`n | (1 << i)\` — OR turns the target bit on and leaves others unchanged.
- **Clear** bit i (force to 0): \`n & ~(1 << i)\` — AND with the *inverted* mask turns the target bit off, keeping others.
- **Toggle** bit i (flip): \`n ^ (1 << i)\` — XOR flips just that bit.

The trick each time is that the mask \`1 << i\` isolates exactly bit \`i\`, and the operator's identity does the rest: OR-with-0 keeps a bit, OR-with-1 sets it; AND-with-1 keeps, AND-with-0 clears; XOR-with-0 keeps, XOR-with-1 flips. Every operation is **O(1)** and modifies only the targeted bit. This is how bitmasks represent **sets** (each bit = "is element i present?"), enabling subset enumeration and DP-over-subsets later.`,

  vocabulary: [
    { term: "Mask", definition: "1 << i: a value with only bit i set, isolating that position." },
    { term: "Check", definition: "(n >> i) & 1 — read whether bit i is set." },
    { term: "Set", definition: "n | (1 << i) — force bit i to 1." },
    { term: "Clear", definition: "n & ~(1 << i) — force bit i to 0." },
    { term: "Toggle", definition: "n ^ (1 << i) — flip bit i." },
    { term: "Bitmask as a set", definition: "Using bit i to mean 'element i is present'." },
  ],

  concepts: {
    purpose: "Read and change one bit at a time using masks — the toolkit for bitmask problems.",
    operations: "check (>> then & 1), set (| mask), clear (& ~mask), toggle (^ mask).",
    uses: "Feature flags, representing sets as integers, subset enumeration, bit DP, permissions.",
    tradeoffs: "O(1) and compact (a whole set in one integer), but harder to read than named fields.",
    commonMistakes: "Forgetting to invert the mask when clearing (use ~ (1<<i)); off-by-one in bit position; using boolean and/or instead of &/|; precedence errors (parenthesize masks).",
    edgeCases: "Setting an already-set bit is a no-op; clearing an already-clear bit too. Toggling twice returns the original. High bit positions grow big integers in Python.",
  },

  complexity: [
    { operation: "check/set/clear/toggle", best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(1)", note: "One mask + one bitwise op each (machine word)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "—", meaning: "no input size; fixed bit operations on one integer" }],
    costModel: "Building a mask (a shift) and applying one bitwise operator are each O(1) on machine words.",
    time: {
      bound: "O(1)",
      case: "worst",
      explanation: "Each of check/set/clear/toggle is a constant number of O(1) operations (one shift to build the mask, one bitwise op). There is no loop, so the whole program is constant time regardless of the bit's position (for machine-word values).",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Only the single integer n and transient masks are used; nothing grows.",
    },
    derivation: [
      { lines: [4], description: "Check: one shift and one AND — O(1).", cost: "O(1)", dimension: "time" },
      { lines: [6], description: "Set: one shift and one OR — O(1).", cost: "O(1)", dimension: "time" },
      { lines: [8], description: "Clear: one shift, one NOT, one AND — O(1).", cost: "O(1)", dimension: "time" },
      { lines: [10], description: "Toggle: one shift and one XOR — O(1).", cost: "O(1)", dimension: "time" },
    ],
    assumptions: ["The integer fits in a machine word so bitwise ops are O(1)."],
    fixedDataNote: "n is a fixed literal and each operation targets one bit, so this run is constant work.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: manipulate individual bits with masks." },
    { line: 2, executable: true, explanation: "n = 0b1010 = 10 (bit3 and bit1 are set)." },
    { line: 3, executable: false, explanation: "Comment: check bit 1." },
    { line: 4, executable: true, explanation: "(n >> 1) & 1 brings bit 1 to position 0 and masks it → 1 (set)." },
    { line: 5, executable: false, explanation: "Comment: set bit 0." },
    { line: 6, executable: true, explanation: "n | (1 << 0) turns bit 0 on → 0b1011 = 11." },
    { line: 7, executable: false, explanation: "Comment: clear bit 3." },
    { line: 8, executable: true, explanation: "n & ~(1 << 3) turns bit 3 off (AND with inverted mask) → 0b0010 = 2." },
    { line: 9, executable: false, explanation: "Comment: toggle bit 1." },
    { line: 10, executable: true, explanation: "n ^ (1 << 1) flips bit 1 → 0b1000 = 8." },
  ],

  bindings: [{ variable: "n", model: "bits" }],

  prediction: [
    { atEventIndex: 0, prompt: "Why does CLEARING a bit use `n & ~(1 << i)` rather than `n & (1 << i)`?", answer: "Because ~(1 << i) is all 1s except a 0 at position i; ANDing keeps every other bit and forces bit i to 0. `n & (1 << i)` would instead keep only bit i and zero everything else.", explanation: "AND keeps a bit only where the mask is 1. To clear one bit while preserving the rest, the mask must be 1 everywhere except position i — that's the inverted single-bit mask ~(1 << i)." },
  ],

  experiments: [
    "Print bin() of each result to watch exactly one bit change.",
    "Set an already-set bit and confirm the value is unchanged (no-op).",
    "Toggle the same bit twice and confirm you return to the original value.",
  ],

  exercises: [
    {
      id: "csc-complete-1",
      kind: "complete-code",
      prompt: "Write is_set(n, i) returning True if bit i of n is set.",
      starterCode: "def is_set(n, i):\n    # TODO: return whether bit i is 1\n    pass",
      expected: "def is_set(n, i):\n    return (n >> i) & 1 == 1",
      hints: ["Bring bit i down to position 0.", "Mask with 1.", "return (n >> i) & 1 == 1"],
    },
    {
      id: "csc-fix-1",
      kind: "fix-mistake",
      prompt: "This is meant to CLEAR bit i but instead keeps only bit i. Fix the mask.",
      starterCode: "def clear_bit(n, i):\n    return n & (1 << i)",
      expected: "def clear_bit(n, i):\n    return n & ~(1 << i)",
      hints: ["To clear one bit you must keep all the others.", "Invert the single-bit mask.", "Use ~(1 << i)."],
    },
  ],

  review: `Using the mask \`1 << i\`: **check** with \`(n >> i) & 1\`, **set** with \`n | (1 << i)\`, **clear** with \`n & ~(1 << i)\`, and **toggle** with \`n ^ (1 << i)\` — each **O(1)** and touching only bit i. The operator identities (OR sets, AND-with-inverse clears, XOR flips) are the key. These idioms turn an integer into a compact **set**, enabling subset enumeration and bit DP.`,

  expectedOutput: "1\n11\n2\n8\n",

  references: [
    {
      url: "https://wiki.python.org/moin/BitManipulation",
      title: "BitManipulation — Python Wiki",
      section: "Testing, setting and clearing bits",
      topic: "bits/check-set-clear",
      purpose: "Confirm the standard check/set/clear/toggle idioms with 1 << i masks in Python.",
      verifiedClaims: ["Set: n | (1<<i); Clear: n & ~(1<<i); Toggle: n ^ (1<<i); Check: (n>>i) & 1"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://cp-algorithms.com/algebra/bit-manipulation.html",
      title: "Bit manipulation — CP-Algorithms",
      section: "Basic bit operations",
      topic: "bits/check-set-clear",
      purpose: "Cross-check the mask-based bit operations and their O(1) cost.",
      verifiedClaims: ["Single-bit check/set/clear/toggle use 1<<i masks and are O(1)"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "f9ac57a64c5dc0c7",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
