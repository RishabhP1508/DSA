/**
 * Lesson: Counting set bits (Bit manipulation). Verified on CPython 3.14.
 * Output: "3\n3\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Count the 1-bits (population count) of a number.
def count_bits(n):
    count = 0
    while n:
        n &= n - 1   # Brian Kernighan: clears the LOWEST set bit
        count += 1
    return count

print(count_bits(0b1011))     # 11 has three 1-bits -> 3
# Python has a built-in shortcut for the same count:
print(bin(13).count("1"))     # 13 = 0b1101 -> 3`;

export const countSetBits: LessonDefinition = {
  id: "count-set-bits",
  title: "Counting Set Bits",
  area: "Bit manipulation",
  prerequisites: ["bit-logical-ops", "bit-shifts"],

  explanation: `Counting the number of **1-bits** in an integer (its "population count" or *popcount*) shows up in Hamming distance, parity checks, subset-size problems, and bit-DP. The elegant way is **Brian Kernighan's algorithm**, built on one clever identity: \`n & (n - 1)\` clears the **lowest set bit** of \`n\`.

Why does it work? Subtracting 1 flips the lowest set bit to 0 and turns all the zeros below it into 1s; ANDing with the original then wipes out that lowest 1-bit and everything below stays cleared. So each iteration removes exactly one set bit, and the loop runs **once per set bit** — not once per total bit. That makes it **O(s)** where \`s\` is the number of set bits, which is faster than the naive "check all w bits" O(w) approach when the number is sparse.

Python also gives you the answer for free: \`bin(x).count("1")\` (and \`int.bit_count()\` in 3.10+). The lesson value is understanding the \`n & (n-1)\` trick, which reappears in many bit problems (e.g. testing if a number is a power of two: \`n & (n-1) == 0\`). The cue: **counting or clearing lowest bits** → \`n & (n-1)\`.`,

  vocabulary: [
    { term: "Set bit", definition: "A bit position holding 1." },
    { term: "Population count (popcount)", definition: "The number of 1-bits in an integer." },
    { term: "n & (n - 1)", definition: "Clears the lowest set bit of n — the heart of Kernighan's method." },
    { term: "Brian Kernighan's algorithm", definition: "Repeatedly clear the lowest set bit, counting iterations: O(number of set bits)." },
    { term: "bit_count / bin().count", definition: "Built-in ways to popcount in Python." },
  ],

  concepts: {
    purpose: "Count 1-bits efficiently, and learn the n & (n-1) lowest-bit-clearing trick.",
    operations: "Loop clearing the lowest set bit (n &= n-1), counting iterations; or bin(x).count('1').",
    uses: "Hamming distance/weight, parity, subset sizes in bit DP, power-of-two test.",
    tradeoffs: "Kernighan is O(set bits) vs naive O(total bits); built-ins are simplest and fastest.",
    commonMistakes: "Looping over all w bits when the number is sparse (slower than needed); confusing n & (n-1) with n & (n+1); forgetting the loop ends when n reaches 0.",
    edgeCases: "count_bits(0) is 0 (loop doesn't run). A power of two has exactly one set bit. All-ones values run w times.",
  },

  complexity: [
    { operation: "count_bits (Kernighan)", best: "O(1)", average: "O(s)", worst: "O(w)", space: "O(1)", note: "s = number of set bits; w = total bits. One iteration per set bit." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "s", meaning: "the number of set (1) bits in n" },
      { symbol: "w", meaning: "the total number of bits in n" },
    ],
    costModel: "Each iteration does one subtraction, one AND, and one increment — all O(1).",
    time: {
      bound: "O(s)",
      case: "average",
      explanation: "Because \`n &= n - 1\` clears exactly one set bit per iteration, the loop runs exactly s times — once per set bit — regardless of how many total bits w there are. So it is O(s), which is faster than the naive approach of testing all w bit positions (O(w)) when the number has few set bits. The worst case (all bits set) is s = w, giving O(w).",
      otherCases: [
        { case: "best", bound: "O(1)", note: "n = 0 (no set bits) — the loop body never runs." },
        { case: "worst", bound: "O(w)", note: "All w bits set: s = w iterations." },
      ],
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Only the counter and the shrinking value are kept; nothing grows.",
    },
    derivation: [
      { lines: [4], description: "The loop runs once per set bit (s iterations), because each pass clears one.", cost: "O(s)", dimension: "time" },
      { lines: [5, 6], description: "Each iteration: one subtract, one AND, one increment — O(1).", cost: "O(1)", dimension: "time" },
      { lines: [3], description: "A single counter variable.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Bitwise ops are O(1) on machine words.", "n & (n-1) clears exactly the lowest set bit."],
    tradeoffs: "Naive bit-by-bit checking is O(w) always; Kernighan is O(s), better for sparse numbers; the built-in int.bit_count() / bin().count('1') is simplest and typically fastest.",
    counters: [{ label: "set bits cleared", definition: "iterations of the clear loop (line 5)", countLines: [5] }],
    fixedDataNote: "count_bits(0b1011) runs 3 times (three set bits) and returns 3; bin(13).count('1') is also 3. The O(s) bound generalises to s set bits.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: count the 1-bits." },
    { line: 2, executable: true, explanation: "Define count_bits(n)." },
    { line: 3, executable: true, explanation: "Counter for set bits." },
    { line: 4, executable: true, explanation: "Loop while n still has any set bits (n != 0)." },
    { line: 5, executable: true, explanation: "n &= n - 1 clears the lowest set bit — one 1-bit removed per pass." },
    { line: 6, executable: true, explanation: "Count that cleared bit." },
    { line: 7, executable: true, explanation: "Return the total number of set bits." },
    { line: 8, executable: false, explanation: "Blank line." },
    { line: 9, executable: true, explanation: "0b1011 (decimal 11) has three 1-bits → 3." },
    { line: 10, executable: false, explanation: "Comment: Python built-in shortcut." },
    { line: 11, executable: true, explanation: "bin(13) is '0b1101'; counting the '1' characters gives 3." },
  ],

  bindings: [{ variable: "n", model: "bits" }],

  prediction: [
    { atEventIndex: 0, prompt: "Why does the loop run only s times (number of set bits) instead of w times (total bits)?", answer: "Because n & (n - 1) clears exactly ONE set bit each iteration, so the loop ends after removing all s of them — independent of the total bit width w.", explanation: "Each pass removes the lowest 1-bit, so the number of iterations equals the number of set bits. Sparse numbers finish quickly, which is the advantage over scanning all w positions." },
  ],

  experiments: [
    "Count bits of a power of two and confirm it's 1.",
    "Use int(0b1011).bit_count() (Python 3.10+) and compare.",
    "Test n & (n-1) == 0 as a power-of-two check.",
  ],

  exercises: [
    {
      id: "csb-choose-1",
      kind: "choose-approach",
      prompt: "For a 64-bit number with only 2 bits set, how many iterations does Kernighan's method do versus checking every bit? What's the complexity of each?",
      expected: "Kernighan does 2 iterations (O(s) = O(2)); checking every bit does 64 (O(w) = O(64)). Kernighan is far better for sparse numbers.",
      hints: ["Kernighan runs once per set bit.", "Bit-by-bit checks all w positions.", "2 vs 64 — O(s) beats O(w) when sparse."],
    },
    {
      id: "csb-complete-1",
      kind: "complete-code",
      prompt: "Write is_power_of_two(n) using the lowest-set-bit trick (n must be positive).",
      starterCode: "def is_power_of_two(n):\n    # TODO: true iff exactly one bit is set\n    pass",
      expected: "def is_power_of_two(n):\n    return n > 0 and (n & (n - 1)) == 0",
      hints: ["A power of two has exactly one set bit.", "Clearing its lowest set bit gives 0.", "return n > 0 and (n & (n - 1)) == 0"],
    },
  ],

  review: `**Counting set bits** (popcount): **Brian Kernighan's** loop uses \`n &= n - 1\` to clear the lowest set bit each pass, so it runs **once per set bit** — **O(s)**, beating the naive O(w) scan for sparse numbers. Python offers \`int.bit_count()\` / \`bin(x).count("1")\`. The \`n & (n-1)\` identity also gives a one-line power-of-two test.`,

  expectedOutput: "3\n3\n",

  references: [
    {
      url: "https://cp-algorithms.com/algebra/bit-manipulation.html",
      title: "Bit manipulation — CP-Algorithms",
      section: "Brian Kernighan's algorithm / counting set bits",
      topic: "bits/count-set-bits",
      purpose: "Confirm that n & (n-1) clears the lowest set bit and the loop counts set bits in O(number of set bits).",
      verifiedClaims: ["n & (n-1) clears the lowest set bit", "Counting set bits this way is O(popcount)"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://docs.python.org/3/library/stdtypes.html#int.bit_count",
      title: "Built-in Types — int.bit_count — Python documentation",
      section: "int.bit_count()",
      topic: "bits/count-set-bits",
      purpose: "Confirm Python provides a built-in population count (3.10+), matching bin(x).count('1').",
      verifiedClaims: ["int.bit_count() returns the number of set bits"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "8fa5a5886bff758a",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
