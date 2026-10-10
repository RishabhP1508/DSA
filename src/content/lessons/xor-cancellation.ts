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

  explanation: "XOR has three useful properties: x ^ x = 0, x ^ 0 = x, and order and grouping do not change the result. Equal pairs cancel. If several values occur an odd number of times, the fold returns their combined XOR; it does not list those values. For example, 1 ^ 2 ^ 3 = 0 even though all three values occur once.\n\nSingle Number supplies the crucial condition: exactly one value occurs an odd number of times and all others occur an even number of times. Then the fold isolates that value. In [4,1,2,1,2], the pairs of 1 and 2 cancel and leave 4. One accumulator replaces the O(n)-entry counting map.\n\nFor bounded-size integers this takes O(n) time and O(1) auxiliary space. If integers have up to w bits, Python's digit work gives O(n*w) time and O(w) accumulator storage upper bounds. O(1) here counts bounded-size slots, not zero memory.\n\nA missing number can be isolated by XORing both the known range and the input when exactly one range member is missing and all input values are distinct. To find two odd-count values, first split into two groups using a bit on which they differ, then fold each group. A plain fold cannot recover both values.",

  vocabulary: [
  {
    "term": "XOR (^)",
    "definition": "1 where bits differ; combined over a list, pairs cancel."
  },
  {
    "term": "Self-cancellation",
    "definition": "x ^ x = 0 — a value XORed with itself vanishes."
  },
  {
    "term": "Identity",
    "definition": "x ^ 0 = x — XOR with 0 leaves a value unchanged."
  },
  {
    "term": "Commutative & associative",
    "definition": "XOR order/grouping doesn't matter, so a whole list folds cleanly."
  },
  {
    "term": "Parity",
    "definition": "Whether a count is odd or even. Odd-count values contribute to the combined XOR; the result does not identify them separately."
  }
],

  concepts: {
  "purpose": "Use cancellation to isolate exactly one odd-count integer under the stated contract.",
  "operations": "Fold with ^; return the combined XOR, which is the unique value only under the parity condition.",
  "uses": "Single number, missing number, two unique numbers, swap without temp, checksums/parity.",
  "tradeoffs": "O(n) time/O(1) extra bounded-size slots; O(n*w)/O(w) upper bounds when integer bit width w scales.",
  "commonMistakes": "Expecting a single fold to list multiple odd-count values; omitting the multiplicity contract; confusing XOR (^) with exponentiation (**).",
  "edgeCases": "Single element returns itself. All values paired returns 0. Works regardless of element order."
},

  complexity: [
  {
    "operation": "single_number (XOR fold)",
    "best": "O(n)",
    "average": "O(n)",
    "worst": "O(n)",
    "space": "O(1)",
    "note": "Bounded-size integer model: one accumulator. Scaling bit width w gives O(n*w) time/O(w) auxiliary storage upper bounds."
  }
],

  complexityExplanation: {
  "scope": "operation",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in nums"
    }
  ],
  "costModel": "Each XOR takes bounded work only when integer widths stay bounded. CPython digit loops imply O(w) upper bounds for width w.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "We scan the list once, XOR-ing each of the n elements into a running accumulator — one O(1) operation each. So the total is linear in n. There is no nested loop and no early exit needed."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "One bounded-size accumulator slot gives O(1) extra space; if its width scales to w bits, the integer itself needs O(w) bit storage.",
    "inputOutputNote": "The list of n elements is the input; only one accumulator is auxiliary."
  },
  "derivation": [
    {
      "lines": [
        4
      ],
      "description": "Scan each of the n elements once.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        5
      ],
      "description": "One O(1) XOR into the accumulator per element.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        3
      ],
      "description": "A single accumulator variable — no set or map.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Exactly one value has odd multiplicity; all others have even multiplicity.",
    "Integer widths are bounded for the stated O(n)/O(1) slot model."
  ],
  "tradeoffs": "A hash-map/set count also finds the unique value in O(n) time but uses O(n) space; XOR achieves O(1) space by exploiting cancellation.",
  "counters": [
    {
      "label": "xor operations",
      "definition": "executions of the fold (line 5)",
      "countLines": [
        5
      ]
    }
  ],
  "fixedDataNote": "This run folds 5 elements; the two 1s and two 2s cancel, leaving 4. The O(n)/O(1) bounds generalise to n."
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
    "id": "xor-choose-1",
    "kind": "choose-approach",
    "prompt": "Every number appears twice except one. Compare the XOR fold with a hash-set count: same time, but what's the space difference?",
    "expected": "Both are O(n) time, but XOR is O(1) space (a single accumulator) while the hash-set count is O(n) space (it stores seen values). XOR wins on memory.",
    "hints": [
      "Goal: find the single number that appears once while all others appear twice, caring about memory, comparing XOR-fold vs a hash-set count.",
      "The hash-set approach stores every value seen, costing O(n) memory you may not have.",
      "Key property: XOR is self-inverse (x ^ x = 0) and commutative, so paired values cancel and only the unique one survives.",
      "Approach: XOR all elements together into a single accumulator.",
      "Reasoning: both methods are O(n) time, but the XOR fold uses O(1) space (one accumulator) while the hash set uses O(n); the set only wins if the 'twice' invariant doesn't hold.",
      "Answer: both are O(n) time, but XOR-folding is O(1) space versus the hash set's O(n) — XOR wins on memory."
    ],
    "recognition": {
      "scenario": "Every number in an array appears exactly twice except one, which appears once. You must find that single number and care about memory.",
      "approaches": [
        {
          "id": "xor-fold",
          "label": "XOR-fold every element into one accumulator",
          "requiredReasonIds": [
            "xor-pairs-cancel"
          ]
        },
        {
          "id": "hash-set",
          "label": "Count with a hash set / frequency map",
          "requiredReasonIds": [],
          "rejectionFeedback": "This works in O(n) time but stores the seen values, so it uses O(n) extra space — worse on memory than XOR's single accumulator."
        }
      ],
      "reasons": [
        {
          "id": "xor-pairs-cancel",
          "text": "a ^ a == 0 and x ^ 0 == x, so XORing everything cancels the paired values and leaves only the unique one — O(n) time, O(1) space."
        },
        {
          "id": "xor-needs-on-space",
          "text": "XOR-folding must store every value it has seen, so it uses O(n) space just like the hash set.",
          "contradictory": true
        },
        {
          "id": "needs-sorting-first",
          "text": "The array must be sorted before XOR can cancel the pairs.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "xor-fold"
      ],
      "modelExplanation": "Both are O(n) time, but XOR-folding is O(1) space (a single accumulator) while the hash-set count is O(n) space. XOR wins on memory."
    }
  },
  {
    "id": "xor-complete-1",
    "kind": "complete-code",
    "prompt": "Find the missing number using XOR: nums contains n distinct integers from 0..n with exactly one missing.",
    "starterCode": "def missing(nums):\n    x = 0\n    for i in range(len(nums) + 1):\n        x ^= i\n    for v in nums:\n        # TODO: cancel the present values\n        pass\n    return x",
    "expected": "def missing(nums):\n    x = 0\n    for i in range(len(nums) + 1):\n        x ^= i\n    for v in nums:\n        x ^= v\n    return x",
    "hints": [
      "Goal: find the one missing value from a list containing 0..n with one gap, using XOR.",
      "Summing or sorting is fine but XOR gives an O(n), O(1)-space, overflow-free solution.",
      "Key insight: XORing every index 0..n with every present value cancels matched pairs, leaving the missing number.",
      "Approach: XOR all indices, then XOR all present values into the same accumulator.",
      "Pseudocode: x = 0; for i in range(len+1): x ^= i; for v in nums: x ^= v; return x.",
      "In the second loop do `x ^= v`, and return the surviving `x`."
    ],
    "tests": "assert missing([0, 1, 3]) == 2, 'missing 2 from 0..3'\nassert missing([1, 2, 3]) == 0, 'missing 0'\nassert missing([0, 1, 2]) == 3, 'missing the top value'\nassert missing([]) == 0, 'empty list is missing 0 from range 0..0'\nassert missing([0, 2, 3, 4]) == 1, 'missing an interior value'\nprint('OK')"
  }
],

  review: "Equal pairs cancel in XOR. A fold isolates the answer only when exactly one value has odd count; otherwise it combines all odd-count values (for example 1 ^ 2 ^ 3 = 0). One bounded-size accumulator gives O(n) time/O(1) extra slots; variable width w changes the upper bounds to O(n*w)/O(w).",

  expectedOutput: "4\n",

  references: [
  {
    "url": "https://cp-algorithms.com/algebra/bit-manipulation.html",
    "title": "CP-Algorithms: bit manipulation",
    "section": "Bit operators and XOR",
    "topic": "bits/xor",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "XOR combines differing bits; pairing equal values cancels their contribution. The examples use fixed-width C++ integers."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://docs.python.org/3.14/library/stdtypes.html#bitwise-operations-on-integer-types",
    "title": "Python integer operations",
    "section": "Bitwise operations on integer types",
    "topic": "bits/xor",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Python integers have arbitrary precision and bitwise operations use infinite sign extension."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/longobject.c",
    "title": "CPython 3.14.2 integer implementation",
    "section": "long_lshift1; long_bitwise; int_bit_count_impl",
    "topic": "bits/cost-model",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "These implementations allocate and iterate over integer digits; bit-operation costs depend on operand and result width."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://leetcode.com/problems/single-number/",
    "title": "Single Number: original problem",
    "section": "Problem and constraints",
    "topic": "bits/xor",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Exactly one integer appears once and every other integer appears twice."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "41a8061f4973f924",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
