/**
 * Lesson: XOR cancellation (Bit manipulation). Verified on CPython 3.14.
 * Output: "4\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Single Number: every value appears twice except one. Find it with XOR.
def single_number(nums):
    result = 0
    for x in nums:
        result ^= x     # pairs cancel to 0; the unique value survives
    return result

print(single_number([4, 1, 2, 1, 2]))`;

export const xorCancellation: LessonDefinition = {
  id: "xor-cancellation",
  title: "XOR Cancellation",
  area: "Bit manipulation",
  prerequisites: ["bit-logical-ops"],

  explanation: `**XOR** has three magical algebraic properties that make it a problem-solving superpower: \`x ^ x = 0\` (a value cancels itself), \`x ^ 0 = x\` (0 is the identity), and it is **commutative and associative** (order doesn't matter). Together these mean: if you XOR a whole list together, every value that appears an **even** number of times cancels to 0, and only values appearing an **odd** number of times survive.

The classic use is **Single Number**: in a list where every element appears exactly twice except one, XOR-ing everything cancels all the pairs and leaves the unique element. For \`[4,1,2,1,2]\`, the two 1s cancel, the two 2s cancel, and 4 remains. This runs in **O(n)** time and — remarkably — **O(1)** space, beating a hash-set count (O(n) space) with no extra memory at all.

XOR cancellation also solves "find the missing number" (XOR the indices with the values), "find two unique numbers", and swap-without-a-temp. The recognition cue: **pairing / parity / self-cancellation** — when duplicates should annihilate and you want O(1) space, reach for XOR.`,

  vocabulary: [
    { term: "XOR (^)", definition: "1 where bits differ; combined over a list, pairs cancel." },
    { term: "Self-cancellation", definition: "x ^ x = 0 — a value XORed with itself vanishes." },
    { term: "Identity", definition: "x ^ 0 = x — XOR with 0 leaves a value unchanged." },
    { term: "Commutative & associative", definition: "XOR order/grouping doesn't matter, so a whole list folds cleanly." },
    { term: "Parity", definition: "Whether a value's count is odd or even; only odd-count values survive an XOR fold." },
  ],

  concepts: {
    purpose: "Exploit XOR's cancellation to isolate odd-count values in O(1) space.",
    operations: "Fold the list with ^; pairs cancel to 0, leaving odd-count elements.",
    uses: "Single number, missing number, two unique numbers, swap without temp, checksums/parity.",
    tradeoffs: "O(n) time and O(1) space (beats hash-set counting on space); works only for the parity structure it assumes.",
    commonMistakes: "Applying it when values don't appear in cancelling pairs; expecting it to identify WHICH value repeats (it finds the odd one out, not counts); confusing ^ with **.",
    edgeCases: "Single element returns itself. All values paired returns 0. Works regardless of element order.",
  },

  complexity: [
    { operation: "single_number (XOR fold)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "One pass; a single accumulator — no hash set needed." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in nums" }],
    costModel: "Each XOR into the accumulator is O(1).",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "We scan the list once, XOR-ing each of the n elements into a running accumulator — one O(1) operation each. So the total is linear in n. There is no nested loop and no early exit needed.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Only a single integer accumulator `result` is kept, regardless of n. This is the standout advantage over the hash-set approach, which would use O(n) space to remember seen values.",
      inputOutputNote: "The list of n elements is the input; only one accumulator is auxiliary.",
    },
    derivation: [
      { lines: [4], description: "Scan each of the n elements once.", cost: "O(n)", dimension: "time" },
      { lines: [5], description: "One O(1) XOR into the accumulator per element.", cost: "O(n)", dimension: "time" },
      { lines: [3], description: "A single accumulator variable — no set or map.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["The problem's parity structure holds (e.g. all but one value appear an even number of times).", "XOR is O(1) on machine-word integers."],
    tradeoffs: "A hash-map/set count also finds the unique value in O(n) time but uses O(n) space; XOR achieves O(1) space by exploiting cancellation.",
    counters: [{ label: "xor operations", definition: "executions of the fold (line 5)", countLines: [5] }],
    fixedDataNote: "This run folds 5 elements; the two 1s and two 2s cancel, leaving 4. The O(n)/O(1) bounds generalise to n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: find the single value using XOR." },
    { line: 2, executable: true, explanation: "Define single_number(nums)." },
    { line: 3, executable: true, explanation: "Start the accumulator at 0 (the XOR identity)." },
    { line: 4, executable: true, explanation: "Scan each element." },
    { line: 5, executable: true, explanation: "XOR it in. Equal pairs cancel to 0; the odd-one-out accumulates." },
    { line: 6, executable: true, explanation: "Return the surviving unique value." },
    { line: 7, executable: false, explanation: "Blank line." },
    { line: 8, executable: true, explanation: "[4,1,2,1,2]: 1s and 2s cancel → 4." },
  ],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [{ role: "total", label: "result", source: "result" }],
    },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Which three XOR properties make this work, and why do the pairs vanish?", answer: "x ^ x = 0 (self-cancel), x ^ 0 = x (identity), and commutativity/associativity (order-free). Each duplicated value XORs with its twin to 0, leaving only the unique value.", explanation: "Because XOR is order-independent, you can conceptually pair each value with its duplicate; each pair becomes 0, and 0 XOR the unique value is the unique value." },
  ],

  experiments: [
    "Reorder the list and confirm the result is unchanged (XOR is order-free).",
    "Make every value paired and see the result become 0.",
    "Solve 'missing number in 0..n' by XOR-ing indices and values together.",
  ],

  exercises: [
    {
      id: "xor-choose-1",
      kind: "choose-approach",
      prompt: "Every number appears twice except one. Compare the XOR fold with a hash-set count: same time, but what's the space difference?",
      expected: "Both are O(n) time, but XOR is O(1) space (a single accumulator) while the hash-set count is O(n) space (it stores seen values). XOR wins on memory.",
      hints: ["Both scan once.", "Does XOR need to remember all seen values?", "No — just one accumulator, so O(1) space."],
    },
    {
      id: "xor-complete-1",
      kind: "complete-code",
      prompt: "Find the missing number in a list containing 0..n with one value missing, using XOR.",
      starterCode: "def missing(nums):\n    x = 0\n    for i in range(len(nums) + 1):\n        x ^= i\n    for v in nums:\n        # TODO: cancel the present values\n        pass\n    return x",
      expected: "def missing(nums):\n    x = 0\n    for i in range(len(nums) + 1):\n        x ^= i\n    for v in nums:\n        x ^= v\n    return x",
      hints: ["XOR all indices 0..n, then XOR all present values.", "Present values cancel their index; the missing one survives.", "x ^= v in the second loop."],
    },
  ],

  review: `**XOR cancellation** exploits \`x ^ x = 0\`, \`x ^ 0 = x\`, and XOR's order-independence: folding a list with \`^\` annihilates even-count values and leaves odd-count ones. **Single Number** uses it to find the unique element in **O(n)** time and **O(1)** space — beating hash-set counting on memory. The cue is **pairing/parity/self-cancellation**.`,

  expectedOutput: "4\n",

  references: [
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Bit Manipulation — Single Number",
      topic: "bits/xor-cancellation",
      purpose: "Confirm the XOR-fold solution to Single Number and its O(n) time / O(1) space.",
      verifiedClaims: ["XOR-ing all elements isolates the unique value in O(n) time and O(1) space"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://cp-algorithms.com/algebra/bit-manipulation.html",
      title: "Bit manipulation — CP-Algorithms",
      section: "XOR properties",
      topic: "bits/xor-cancellation",
      purpose: "Cross-check the XOR identities (self-inverse, identity, associativity/commutativity).",
      verifiedClaims: ["XOR is associative, commutative, self-inverse (x^x=0), with identity 0"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "f304c8a310a0312e",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
