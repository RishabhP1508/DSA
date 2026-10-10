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
    "Cancel equal integer pairs with XOR to isolate exactly one odd-count value. Other multiplicity contracts need additional reasoning.",

  clues: [
  "Elements come in pairs except one (or two), and you must find the lone/odd one out.",
  "Exactly one member is missing from a known range, with distinct input values; XOR the range and input. A duplicate requires its own full multiplicity contract.",
  "The problem hints at parity, toggling bits, or 'without extra memory'.",
  "Phrases like 'single number', 'every element appears twice except one', 'find the missing number', 'two single numbers'."
],

  naiveApproach: `Count occurrences with a hash map or sort and scan — correct but **O(n) extra space** (map) or an **O(n log n)** sort. Both ignore an algebraic shortcut that XOR provides for free in O(1) space.`,

  whyItHelps: "XOR has two properties that make pairs vanish: `a ^ a = 0` and `a ^ 0 = a`, and it's **commutative/associative** so order doesn't matter. XOR-ing every element together cancels all the paired values to 0, leaving exactly the **unpaired** one. The same idea finds a missing number in `0..n` (XOR all indices and values; survivors are the gap) and swaps two variables without a temporary. It's a single **O(n)** pass with **O(1)** space and no auxiliary structure. With several odd-count values, the result is their combined XOR rather than their identities; 1 ^ 2 ^ 3 = 0. The plain single-number fold therefore needs exactly one odd-count value.",

  conditions: [
  "A single fold isolates exactly one odd-count value only when every other value has even multiplicity. Several odd-count values combine: 1 ^ 2 ^ 3 = 0, not a list of three answers.",
  "For 'two single numbers', split by a differing bit first, then XOR each group separately.",
  "Values must support XOR (integers); this doesn't apply to arbitrary objects."
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
    "O(n) time and O(1) extra bounded-size integer slots. If width w scales, CPython XOR work/storage has O(n*w)/O(w) upper bounds.",

  complexityExplanation: {
  "scope": "operation",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in nums"
    }
  ],
  "costModel": "A single accumulator is XOR-ed with each element once. XOR on machine-word-sized ints is O(1).",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "One pass over the n elements (lines 5-6), each doing a constant-time XOR into the accumulator. No sorting or hashing, so exactly O(n)."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "One accumulator has bounded storage in the bounded-size integer model; width w needs O(w) bits if it scales.",
    "inputOutputNote": "nums (n elements) is the input; the answer is one integer."
  },
  "derivation": [
    {
      "lines": [
        4
      ],
      "description": "Initialise the accumulator.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        5,
        6
      ],
      "description": "XOR each of the n elements into the accumulator once.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        4
      ],
      "description": "A single accumulator variable.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Values fit in a machine word so XOR is O(1) (Python ints are arbitrary-size, but these are small).",
    "Every value except one appears an even number of times (so pairs cancel)."
  ],
  "tradeoffs": "A hash-set/count approach also finds the unique element in O(n) time but needs O(n) space; XOR uses O(1) space by exploiting a ^ a == 0.",
  "counters": [
    {
      "label": "XOR operations",
      "definition": "executions of x ^= v (line 6)",
      "countLines": [
        6
      ]
    }
  ],
  "fixedDataNote": "For [4,1,2,1,2] the loop runs 5 XORs and the 1s and 2s cancel, leaving 4. The O(n) bound generalises."
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
    "id": "pat-xor-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'Every number appears exactly twice except one; find that one, using O(1) extra space.' Which pattern?",
    "expected": "Bitwise XOR: XOR all numbers together; the paired values cancel and the unique one remains. O(n) time, O(1) space.",
    "correctPatternId": "bitwise-xor",
    "hints": [
      "Goal: find the single number that appears once while every other appears twice, in O(1) space.",
      "A hashmap of counts costs O(n) space, which the O(1) constraint forbids.",
      "Key insight: a ^ a = 0, so XORing all values cancels every pair and leaves the unique one.",
      "Approach: use bitwise XOR, folding the whole array together.",
      "Pseudocode: result=0; for each x: result ^= x; return result.",
      "Use bitwise XOR of all numbers: paired values cancel and the unique one remains — O(n) time, O(1) space."
    ],
    "recognition": {
      "scenario": "Every number appears exactly twice except one; find that one using O(1) extra space.",
      "approaches": [
        {
          "id": "xor-fold",
          "label": "Bitwise XOR fold",
          "requiredReasonIds": [
            "pairs-cancel"
          ]
        },
        {
          "id": "hash-count",
          "label": "Hash map of counts",
          "requiredReasonIds": [],
          "rejectionFeedback": "Counting works but stores up to n entries — O(n) space, which the O(1) constraint forbids."
        }
      ],
      "reasons": [
        {
          "id": "pairs-cancel",
          "text": "XOR is its own inverse, so XOR-ing all numbers cancels the paired values and leaves the unique one — O(n) time, O(1) space."
        },
        {
          "id": "appears-thrice",
          "text": "Duplicates appear three times, so pairwise cancellation does not isolate the answer.",
          "contradictory": true
        },
        {
          "id": "needs-sorting",
          "text": "The array must be sorted before the singleton can be found.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "xor-fold"
      ],
      "modelExplanation": "Bitwise XOR: fold all numbers together; paired values cancel and the unique one remains — O(n) time, O(1) space."
    }
  },
  {
    "id": "pat-xor-choose-1",
    "kind": "choose-approach",
    "prompt": "'Every number appears three times except one; find the unique number.' Does plain XOR work?",
    "expected": "No — XOR cancels PAIRS, not triples. Count bits modulo 3 across all numbers (or use a hash map). Plain single-XOR only isolates a value when the rest pair up.",
    "correctPatternId": "bitwise-xor",
    "hints": [
      "Goal: find the unique number when every other appears three times.",
      "A single XOR cancels pairs, but triples don't vanish under XOR, so it won't isolate the answer.",
      "Key insight: XOR removes even multiplicities only; triples leave a residue.",
      "Approach: count each bit's set occurrences modulo 3 across all numbers (or use a hashmap).",
      "Pseudocode: for each bit position, sum that bit over all numbers mod 3; the bits with remainder 1 form the answer. For signed inputs, choose a finite width, count those masked bits, then convert the sign bit back; alternatively sort and examine runs.",
      "No — plain XOR cancels PAIRS, not triples; use per-bit counts modulo 3 (or a hash map) instead."
    ],
    "recognition": {
      "scenario": "Every number appears three times except one; find the unique number. Does plain XOR work?",
      "approaches": [
        {
          "id": "bit-count-mod3",
          "label": "Count bits modulo 3 (or a hash map)",
          "requiredReasonIds": [
            "triples-need-mod3"
          ]
        },
        {
          "id": "xor-fold",
          "label": "Plain single XOR fold",
          "requiredReasonIds": [],
          "rejectionFeedback": "Single XOR cancels PAIRS, not triples, so with triple duplicates it does not isolate the unique value."
        },
        {
          "id": "sorted-runs",
          "label": "Sort and inspect consecutive equal-value runs",
          "requiredReasonIds": [
            "triples-runs"
          ]
        }
      ],
      "reasons": [
        {
          "id": "triples-need-mod3",
          "text": "For triples, sum each bit position across all numbers modulo 3; bits from the triple-appearing values vanish, leaving the unique number's bits."
        },
        {
          "id": "pairs-only",
          "text": "Every other value appears exactly twice, so pairwise XOR cancels them.",
          "contradictory": true
        },
        {
          "id": "triples-runs",
          "text": "After sorting, equal values are consecutive; the one-element run identifies the singleton, whereas other runs have length three."
        }
      ],
      "acceptableApproachIds": [
        "bit-count-mod3"
      ],
      "modelExplanation": "No — plain XOR cancels pairs, not triples. Count set bits modulo 3 across all numbers (or use a hash map) to isolate the unique value. Sorting and scanning equal-value runs is also valid, at O(n log n) time.",
      "alternatives": [
        {
          "approachId": "sorted-runs",
          "conditions": "Valid under this problem’s stated contract.",
          "tradeoff": "O(n log n) sorting plus O(n) scanning; Python sorted() uses O(n) storage. Per-bit mod-3 also needs a finite-width signed convention for negative integers.",
          "requiredReasonIds": [
            "triples-runs"
          ]
        }
      ]
    }
  },
  {
    "id": "pat-xor-predict-1",
    "kind": "predict-state",
    "prompt": "What is 4 ^ 1 ^ 2 ^ 1 ^ 2, and why?",
    "expected": "4. The two 1s cancel (1^1=0) and the two 2s cancel (2^2=0), leaving 4 ^ 0 ^ 0 = 4.",
    "hints": [
      "Reorder freely (XOR is commutative).",
      "Equal values cancel.",
      "Only 4 is unpaired."
    ]
  }
],

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
    contentHash: "4251c634f6142710",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
