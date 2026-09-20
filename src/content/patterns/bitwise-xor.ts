/**
 * Pattern: Bitwise XOR.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2). Output "4\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# Bitwise XOR: equal values cancel (a ^ a == 0) and a ^ 0 == a,
# so XOR-ing everything leaves the one unpaired value.
def single_number(nums):
    x = 0
    for v in nums:
        x ^= v            # pairs cancel out; the lone element survives
    return x

print(single_number([4, 1, 2, 1, 2]))  # 4 appears once`;

export const bitwiseXorPattern: PatternDefinition = {
  id: "bitwise-xor",
  title: "Bitwise XOR",
  category: "Bit manipulation",
  summary:
    "Use XOR's cancellation (a^a=0, a^0=a) to isolate an unpaired value, find a missing number, or swap without temporaries in O(1) space.",

  clues: [
    "Elements come in pairs except one (or two), and you must find the lone/odd one out.",
    "You need a missing or duplicate number in a range with O(1) extra space.",
    "The problem hints at parity, toggling bits, or 'without extra memory'.",
    "Phrases like 'single number', 'every element appears twice except one', 'find the missing number', 'two single numbers'.",
  ],

  naiveApproach: `Count occurrences with a hash map or sort and scan — correct but **O(n) extra space** (map) or an **O(n log n)** sort. Both ignore an algebraic shortcut that XOR provides for free in O(1) space.`,

  whyItHelps: `XOR has two properties that make pairs vanish: \`a ^ a = 0\` and \`a ^ 0 = a\`, and it's **commutative/associative** so order doesn't matter. XOR-ing every element together cancels all the paired values to 0, leaving exactly the **unpaired** one. The same idea finds a missing number in \`0..n\` (XOR all indices and values; survivors are the gap) and swaps two variables without a temporary. It's a single **O(n)** pass with **O(1)** space and no auxiliary structure.`,

  conditions: [
    "The structure must let cancellation isolate the answer: e.g. every value appears an even number of times except the target(s).",
    "For 'two single numbers', split by a differing bit first, then XOR each group separately.",
    "Values must support XOR (integers); this doesn't apply to arbitrary objects.",
  ],

  alternatives: [
    "Hash map of counts — general (any multiplicities, any values) but O(n) space.",
    "Cyclic sort — for missing/duplicate numbers in a 0..n range, also O(1) space, when index placement fits.",
    "Sum formula — for a single missing number, though it can overflow fixed-width integers (not an issue for Python's big ints).",
  ],

  counterexamples: [
    "If the lone element appears among values that DON'T all pair up (e.g. each appears 3× except one), plain XOR fails — use bit-count mod 3 or a map.",
    "Finding the median or k-th element isn't an XOR problem.",
    "XOR gives the value, not its index; if you need the position, track it separately.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "4\n",
  complexityNote:
    "O(n) time (one pass XOR-ing each element) and O(1) space (a single accumulator). No hash map or sort needed.",

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in nums" }],
    costModel: "A single accumulator is XOR-ed with each element once. XOR on machine-word-sized ints is O(1).",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "One pass over the n elements (lines 5-6), each doing a constant-time XOR into the accumulator. No sorting or hashing, so exactly O(n).",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "A single integer accumulator `x`; nothing grows with n.",
      inputOutputNote: "nums (n elements) is the input; the answer is one integer.",
    },
    derivation: [
      { lines: [4], description: "Initialise the accumulator.", cost: "O(1)", dimension: "time" },
      { lines: [5, 6], description: "XOR each of the n elements into the accumulator once.", cost: "O(n)", dimension: "time" },
      { lines: [4], description: "A single accumulator variable.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Values fit in a machine word so XOR is O(1) (Python ints are arbitrary-size, but these are small).", "Every value except one appears an even number of times (so pairs cancel)."],
    tradeoffs: "A hash-set/count approach also finds the unique element in O(n) time but needs O(n) space; XOR uses O(1) space by exploiting a ^ a == 0.",
    counters: [{ label: "XOR operations", definition: "executions of x ^= v (line 6)", countLines: [6] }],
    fixedDataNote: "For [4,1,2,1,2] the loop runs 5 XORs and the 1s and 2s cancel, leaving 4. The O(n) bound generalises.",
  },

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: XOR cancels equal values." },
    { line: 2, executable: false, explanation: "Comment continued." },
    { line: 3, executable: true, explanation: "Define single_number(nums)." },
    { line: 4, executable: true, explanation: "Accumulator starts at 0 (the XOR identity)." },
    { line: 5, executable: true, explanation: "Fold every element into the accumulator." },
    { line: 6, executable: true, explanation: "XOR: matching pairs cancel to 0; the unique value remains." },
    { line: 7, executable: true, explanation: "Return the surviving lone value." },
    { line: 8, executable: false, explanation: "Blank line." },
    { line: 9, executable: true, explanation: "1 and 2 each appear twice and cancel; 4 remains." },
  ],

  bindings: [{ variable: "x", model: "bits" }],

  linkedLessons: ["xor-cancellation", "bit-logical-ops", "count-set-bits"],

  exercises: [
    {
      id: "pat-xor-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Every number appears exactly twice except one; find that one, using O(1) extra space.' Which pattern?",
      expected:
        "Bitwise XOR: XOR all numbers together; the paired values cancel and the unique one remains. O(n) time, O(1) space.",
      correctPatternId: "bitwise-xor",
      hints: [
        "Pairs and a lone value, O(1) space.",
        "a ^ a = 0.",
        "Fold everything with ^.",
      ],
    },
    {
      id: "pat-xor-choose-1",
      kind: "choose-approach",
      prompt:
        "'Every number appears three times except one; find the unique number.' Does plain XOR work?",
      expected:
        "No — XOR cancels PAIRS, not triples. Count bits modulo 3 across all numbers (or use a hash map). Plain single-XOR only isolates a value when the rest pair up.",
      correctPatternId: "bitwise-xor",
      hints: [
        "XOR removes even multiplicities.",
        "Triples don't cancel with a single XOR.",
        "Use per-bit counts mod 3.",
      ],
    },
    {
      id: "pat-xor-predict-1",
      kind: "predict-state",
      prompt: "What is 4 ^ 1 ^ 2 ^ 1 ^ 2, and why?",
      expected: "4. The two 1s cancel (1^1=0) and the two 2s cancel (2^2=0), leaving 4 ^ 0 ^ 0 = 4.",
      hints: [
        "Reorder freely (XOR is commutative).",
        "Equal values cancel.",
        "Only 4 is unpaired.",
      ],
    },
  ],

  references: [
    {
      url: "https://leetcode.com/problems/single-number/editorial/",
      title: "Single Number — LeetCode editorial",
      section: "XOR cancellation, O(n)/O(1)",
      topic: "patterns/bitwise-xor",
      purpose: "Confirm that XOR-ing all elements isolates the unique value in O(n) time and O(1) space.",
      verifiedClaims: [
        "a ^ a = 0 and a ^ 0 = a, so XOR-ing all elements leaves the single unpaired value.",
        "The approach is O(n) time and O(1) space.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://en.wikipedia.org/wiki/Exclusive_or",
      title: "Exclusive or — Wikipedia",
      section: "Properties (identity, self-inverse, associativity)",
      topic: "patterns/bitwise-xor",
      purpose: "Cross-check XOR's identity, self-inverse, and associativity/commutativity that enable cancellation.",
      verifiedClaims: ["XOR is associative and commutative, with 0 as identity and every value its own inverse."],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "b99acc227c28d772",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
