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

  explanation: "Numbers are stored in **binary**, and **bitwise operators** act on those bits in parallel. The three core ones combine two numbers bit position by bit position: **AND (`&`)** gives 1 only where *both* bits are 1; **OR (`|`)** gives 1 where *either* is 1; **XOR (`^`)** gives 1 only where the bits *differ*. There's also **NOT (`~`)**, which flips every bit.\n\nYou can read the example directly in binary: `1100 & 1010 = 1000` (only the 8-bit is set in both), `1100 | 1010 = 1110`, and `1100 ^ 1010 = 0110`. Python's `0b` prefix writes binary literals, and `bin(x)` shows a number's bits.\n\n**Adding without `+` — \"Sum of Two Integers\".** XOR and AND together *are* binary addition. Look at one bit column: `a ^ b` is the sum **ignoring carry** (`1^1=0`, `1^0=1`), and `a & b` marks exactly the columns that **produce a carry** (both bits 1); that carry lands one column to the **left**, so it is `(a & b) << 1`. Repeat — `a, b = a ^ b, (a & b) << 1` — until the carry is `0`, and `a` holds the sum. **Python caveat (correctness condition):** Python ints are **arbitrary-precision**, so some signed inputs can carry forever: -1 + 1 is a counterexample, even though its sum is zero; negative sums do not universally fail. Emulate 32-bit two's-complement: set `mask = 0xFFFFFFFF` and update both values simultaneously with `a, b = (a ^ b) & mask, ((a & b) << 1) & mask`, and at the end if `a` has the sign bit set (`a > 0x7FFFFFFF`) reinterpret it as negative with `a - 0x100000000` (i.e. `~(a ^ mask)`). On a fixed-width machine word this masking is automatic; in Python you add it by hand.\n\nEach operation is **O(1)** on machine-word integers (a fixed number of hardware operations). Python integers are *arbitrary precision*, so for numbers with `w` bits these are technically **O(w)**, but for normal values treat them as constant time. Bitwise ops are the foundation for masks, flags, sets-as-bits, and the XOR tricks in later lessons. The mental model to build: think of a number as a **row of independent bits** you can test and combine.\n\nThis returns a 32-bit signed result: it agrees with mathematical addition when the result fits that range, and wraps modulo 2**32 outside it. Both right-hand expressions must use the old a and b. A w-bit Python result also needs O(w) storage; constant time/space here means bounded-size operands.",

  vocabulary: [
    { term: "Bit", definition: "A single binary digit, 0 or 1." },
    { term: "AND (&)", definition: "1 only where both operands have 1." },
    { term: "OR (|)", definition: "1 where at least one operand has 1." },
    { term: "XOR (^)", definition: "1 only where the operands differ." },
    { term: "NOT (~)", definition: "Flips every bit (in Python, ~x == -(x+1) due to two's complement)." },
    { term: "Binary literal (0b)", definition: "Writing a number in binary, e.g. 0b1100 = 12." },
  ],

  concepts: {
  "purpose": "Combine and test individual bits in parallel — the basis of masks, flags, and bit tricks.",
  "operations": "& (and), | (or), ^ (xor), ~ (not); bin() to view bits, 0b to write them.",
  "uses": "Bit flags/permissions, sets represented as bitmasks, XOR problems, low-level packing.",
  "tradeoffs": "O(1) on machine words (O(w) for w-bit big integers); very fast but less readable than named booleans.",
  "commonMistakes": "Confusing & with `and` (bitwise vs boolean); expecting ~x to be a small positive (Python uses two's complement, ~x = -(x+1)); operator precedence (& binds tighter than ==; parenthesize the masked value for readability).",
  "edgeCases": "Negative numbers use two's complement semantics. ~0 is -1. XOR of a value with itself is 0."
},

  complexity: [
  {
    "operation": "Bitwise op on w-bit Python integers",
    "best": "O(w)",
    "average": "O(w)",
    "worst": "O(w)",
    "space": "O(w)",
    "note": "Linear upper bounds in operand/result width. Bounded-size operands give O(1) time/space."
  }
],

  complexityExplanation: {
  "scope": "program",
  "variables": [
    {
      "symbol": "w",
      "meaning": "the number of bits in the integers involved"
    }
  ],
  "costModel": "A bounded-size Python bitwise operation is constant work; the interpreter may execute multiple instructions. Scaling arbitrary-precision operands to w bits gives linear work/storage upper bounds.",
  "time": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "For values that fit in a machine word, each of &, |, ^ takes bounded work in this Python example. The program does three such operations on small numbers, so it is constant work. For very large integers with w bits, a bitwise op is O(w) since every bit is processed — not relevant to these small values."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "It holds two small integers and prints three results; nothing grows with input."
  },
  "derivation": [
    {
      "lines": [
        4,
        5,
        6
      ],
      "description": "Three bitwise operations on machine-word-sized integers, each O(1).",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        2,
        3
      ],
      "description": "Two small integer variables.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Operands fit in a machine word so each op is O(1); w-bit big integers would be O(w) per op."
  ],
  "fixedDataNote": "Operands are fixed 4-bit literals, so this run is constant work; the O(w) note covers scaling to very large integers."
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
    "Add without '+': loop a, b = (a ^ b) & 0xFFFFFFFF, ((a & b) << 1) & 0xFFFFFFFF until b == 0, then map a back to signed (a - 0x100000000 if a > 0x7FFFFFFF). Confirm add(2, 3) == 5 and add(-2, 3) == 1, and note it hangs without the 32-bit mask.",
  ],

  exercises: [
  {
    "id": "bit-log-predict-1",
    "kind": "predict-state",
    "prompt": "Compute 0b0110 & 0b0011, 0b0110 | 0b0011, and 0b0110 ^ 0b0011 in binary.",
    "expected": "& = 0b0010 (2); | = 0b0111 (7); ^ = 0b0101 (5).",
    "hints": [
      "AND: 1 where both are 1.",
      "OR: 1 where either is 1.",
      "XOR: 1 where they differ."
    ]
  },
  {
    "id": "bit-log-choose-1",
    "kind": "choose-approach",
    "prompt": "You want to combine several on/off feature flags into one integer and test them. Which operators do you use to SET a flag and to TEST it?",
    "expected": "Use OR (|) with the flag's bit to set it, and AND (&) with the flag's bit to test it (non-zero means set).",
    "hints": [
      "Goal: packing on/off feature flags into one integer, choose the bitwise operators to SET a flag and to TEST a flag.",
      "The error is reaching for arithmetic (+/-) which can carry across bits and corrupt neighboring flags.",
      "Key property: each flag is one bit, so you need operations that touch exactly that bit without disturbing others.",
      "Approach: OR the flag's bit in to set it; AND with the flag's bit to test it.",
      "Reasoning: OR (|) turns a bit on idempotently, and AND (&) with a single-bit mask isolates that bit (non-zero means set); addition/subtraction would misbehave if the flag were already set/clear.",
      "Answer: use OR (|) with the flag's bit to set it, and AND (&) with the flag's bit to test it (non-zero means set)."
    ],
    "recognition": {
      "scenario": "You pack several on/off feature flags into one integer. You must choose which bitwise operators SET a flag and TEST a flag.",
      "approaches": [
        {
          "id": "or-set-and-test",
          "label": "OR (|) with the flag's bit to set it; AND (&) with the flag's bit to test it",
          "requiredReasonIds": [
            "or-sets-and-tests"
          ]
        },
        {
          "id": "xor-set-and-test",
          "label": "XOR (^) to set and XOR (^) to test",
          "requiredReasonIds": [],
          "rejectionFeedback": "XOR TOGGLES a bit rather than setting it, so applying it twice clears the flag — it doesn't reliably set, and it doesn't isolate a bit for testing."
        }
      ],
      "reasons": [
        {
          "id": "or-sets-and-tests",
          "text": "ORing with the flag's bit forces that bit to 1 (set) while leaving others untouched, and ANDing with the flag's bit isolates it — a non-zero result means the flag is set."
        },
        {
          "id": "and-sets-or-tests",
          "text": "AND sets a flag and OR tests it.",
          "contradictory": true
        },
        {
          "id": "xor-sets",
          "text": "XOR with the bit reliably sets the flag no matter its current value.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "or-set-and-test"
      ],
      "modelExplanation": "Use OR (|) with the flag's bit to set it, and AND (&) with the flag's bit to test it (non-zero means set)."
    }
  },
  {
    "id": "bit-log-sum-1",
    "kind": "predict-state",
    "prompt": "'Sum of Two Integers' without '+': computing both a ^ b (sum without carry) and (a & b) << 1 from the OLD operands, trace add(2, 3) column by column. Why must a Python implementation mask to 32 bits, and what mapping turns the masked result back into a signed int?",
    "expected": "2=0b010, 3=0b011. Step 1: sum-without-carry a^b = 0b001 (1), carry (a&b)<<1 = (0b010)<<1 = 0b100 (4). Step 2: 1 ^ 4 = 0b101 (5), carry (1&4)<<1 = 0. Carry is 0, result 5. Python needs a 32-bit mask (& 0xFFFFFFFF) each step because its ints are arbitrary-precision: some signed inputs, such as -1 + 1, have a carry that propagates forever without masking (not every negative sum fails). Map back to signed at the end with: if a > 0x7FFFFFFF: a -= 0x100000000 (the sign bit set means negative in 32-bit two's complement).",
    "hints": [
      "XOR is the sum ignoring carry; AND<<1 is the carry into the next column.",
      "Loop until the carry is 0.",
      "Mask with 0xFFFFFFFF; if the top (sign) bit is set, subtract 2**32 to get the negative value."
    ]
  }
],

  review: "**Bitwise operators** act on binary digits in parallel: **& (AND)** = both, **| (OR)** = either, **^ (XOR)** = differ, **~ (NOT)** = flip. They are **O(1)** on machine words (O(w) for w-bit big integers) and underpin masks, flags, and XOR tricks. Don't confuse `&` (bitwise) with `and` (boolean), and parenthesize masked values for readability; bitwise operators bind more tightly than comparisons.",

  expectedOutput: "8\n14\n6\n",

  references: [
  {
    "url": "https://docs.python.org/3/reference/expressions.html#binary-bitwise-operations",
    "title": "Expressions — Binary bitwise operations — Python Language Reference",
    "section": "&, |, ^ and shifting operations",
    "topic": "bits/logical-ops",
    "purpose": "Confirm the semantics of &, |, ^ (and ~) on Python integers.",
    "verifiedClaims": [
      "& is bitwise AND, | is OR, ^ is XOR; they operate on the two's-complement bit representation"
    ],
    "accessDate": "2026-09-20"
  },
  {
    "url": "https://wiki.python.org/moin/BitwiseOperators",
    "title": "BitwiseOperators — Python Wiki",
    "section": "Operator overview",
    "topic": "bits/logical-ops",
    "purpose": "Cross-check operator meanings and the ~x = -(x+1) two's-complement behavior.",
    "verifiedClaims": [
      "~x equals -(x+1) in Python due to two's complement"
    ],
    "accessDate": "2026-09-20"
  },
  {
    "url": "https://docs.python.org/3.14/library/stdtypes.html#bitwise-operations-on-integer-types",
    "title": "Python integer bit operations",
    "section": "Bit operations; int.bit_count",
    "topic": "codex/b2-b",
    "purpose": "Verify the specific semantics and conditions used in this lesson.",
    "verifiedClaims": [
      "Python integer bit operations use infinite-sign-extension semantics; bit_count counts ones in the absolute value."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://docs.python.org/3.14/reference/expressions.html#operator-precedence",
    "title": "Python expression precedence",
    "section": "6.10 and 6.17",
    "topic": "codex/b2-b",
    "purpose": "Verify the specific semantics and conditions used in this lesson.",
    "verifiedClaims": [
      "Bitwise operations bind more tightly than comparisons."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 19,
    contentHash: "f0a77f6b1719bed3",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
