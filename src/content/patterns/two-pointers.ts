/**
 * Pattern: Two pointers.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2). Output "(2, 4)\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# Two pointers on a SORTED array: find a pair summing to target.
def two_sum_sorted(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        s = nums[lo] + nums[hi]
        if s == target:
            return (lo, hi)
        if s < target:
            lo += 1        # too small -> need a bigger value -> move left pointer up
        else:
            hi -= 1        # too big -> need a smaller value -> move right pointer down
    return None

print(two_sum_sorted([1, 2, 4, 7, 11, 15], 15))  # 4 + 11 -> indices (2, 4)`;

export const twoPointersPattern: PatternDefinition = {
  id: "two-pointers",
  title: "Two Pointers",
  category: "Arrays & strings",
  summary:
    "Move two indices toward each other (or in tandem) to replace a nested loop, exploiting order or a structural invariant.",

  clues: [
    "The input is SORTED, or becomes useful when sorted, or is a palindrome-like / from-both-ends problem.",
    "You are looking for a pair/triple with a target relationship (sum, difference), or partitioning in place.",
    "A brute-force pair search would be O(n²) nested loops.",
    "Phrases like 'pair that sums to', 'is a palindrome', 'remove duplicates in place', 'container with most water'.",
  ],

  naiveApproach: `Check every pair with two nested loops — **O(n²)**. For a sorted array that is wasteful: the ordering already tells you which direction to move to increase or decrease a sum, information the brute force ignores.`,

  whyItHelps: `Place one pointer at the **start** and one at the **end**. Their combined value (e.g. sum) tells you which way to move: if the sum is **too small**, advance the **left** pointer to a larger value; if **too big**, retreat the **right** pointer to a smaller value. Each step eliminates one element from consideration, so the pointers meet after at most **n** steps — **O(n)** time and **O(1)** space, replacing the O(n²) nested loop. The correctness rests on the array being **sorted** (or another monotone structure) so a move never skips a valid answer.`,

  conditions: [
    "For the opposite-ends version, the array must be SORTED (or the relationship monotone) so moving a pointer provably can't skip the answer.",
    "For same-direction two pointers (fast/slow over one array, or read/write for in-place filtering), the invariant is that the trailing pointer marks a processed boundary.",
    "You want a pair/partition/boundary, not an arbitrary subset.",
  ],

  alternatives: [
    "Hashmap (one-pass 'two sum') — when the array is UNSORTED and you don't want the O(n log n) sort; O(n) time, O(n) space.",
    "Sliding window — a same-direction two-pointer specialization that maintains a window aggregate over contiguous elements.",
    "Binary search — when only one pointer moves and you search for a complement in the sorted remainder.",
  ],

  counterexamples: [
    "Opposite-ends two pointers on an UNSORTED array gives wrong answers — sort first (O(n log n)) or use a hashmap instead.",
    "Needing ALL pairs/triples (not just one, or a count with duplicates) may require sorting plus careful duplicate-skipping, or a different structure.",
    "Problems over contiguous windows with an aggregate are better framed as sliding window even though it uses two indices.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "(2, 4)\n",
  complexityNote:
    "O(n) time and O(1) space on a sorted array — the two pointers together traverse it once. Sorting first (if needed) adds O(n log n).",

  complexityExplanation: {
  "scope": "operation",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in nums"
    }
  ],
  "costModel": "Two pointers start at the ends and move inward; each iteration moves exactly one pointer, so together they cover the array once.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The loop (lines 4-11) moves `lo` up or `hi` down by one each iteration, so it runs at most n times before they cross. Each step is O(1). So O(n) on an ALREADY sorted array. Sorting first (if needed) would add O(n log n)."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Two index variables and a sum scalar; nothing grows with n.",
    "inputOutputNote": "nums (n) is the input; the answer is a pair of indices or None."
  },
  "derivation": [
    {
      "lines": [
        4,
        5
      ],
      "description": "Each iteration reads the two ends in O(1).",
      "cost": "O(1) per step",
      "dimension": "time"
    },
    {
      "lines": [
        8,
        9,
        10,
        11
      ],
      "description": "Exactly one pointer moves per step; total moves <= n.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        3
      ],
      "description": "Two index variables.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "The array is SORTED (the correctness precondition — the monotone sum lets us discard one end each step).",
    "Indexing and addition are O(1).",
    "Arithmetic uses bounded-size integers in this two-sum model."
  ],
  "tradeoffs": "A hash-set two-sum is O(n) time and O(n) space and works UNSORTED; two pointers use O(1) space but require sorted input. Brute-force pairs are O(n²).",
  "counters": [
    {
      "label": "pointer steps",
      "definition": "iterations of the two-pointer loop (line 4)",
      "countLines": [
        4
      ]
    }
  ],
  "fixedDataNote": "For the 6-element sorted sample the pointers meet the target 15 at indices (2,4). The O(n) bound generalises."
},

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: two pointers on a sorted array for a target pair." },
    { line: 2, executable: true, explanation: "Define two_sum_sorted(nums, target)." },
    { line: 3, executable: true, explanation: "Start one pointer at the left end and one at the right end." },
    { line: 4, executable: true, explanation: "Continue while the pointers haven't crossed." },
    { line: 5, executable: true, explanation: "Compute the current pair sum." },
    { line: 6, executable: true, explanation: "If it matches the target..." },
    { line: 7, executable: true, explanation: "...return the pair of indices." },
    { line: 8, executable: true, explanation: "If the sum is too small, the smallest value must grow..." },
    { line: 9, executable: true, explanation: "...so move the left pointer up to a larger value." },
    { line: 10, executable: false, explanation: "Otherwise the sum is too big." },
    { line: 11, executable: true, explanation: "Move the right pointer down to a smaller value." },
    { line: 12, executable: true, explanation: "No pair found." },
    { line: 13, executable: false, explanation: "Blank line." },
    { line: 14, executable: true, explanation: "In [1,2,4,7,11,15], 4 + 11 = 15 at indices (2, 4)." },
  ],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [
        { role: "pointer", label: "lo", source: "lo" },
        { role: "pointer", label: "hi", source: "hi" },
      ],
    },
  ],

  linkedLessons: ["two-pointers", "string-two-pointers", "palindromes"],

  exercises: [
  {
    "id": "pat-tp-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'Given a SORTED array, find two numbers that add up to a target.' Two pointers or a hashmap — and why either could work?",
    "expected": "Two pointers is ideal here: the array is already sorted, so opposite-ends pointers give O(n) time and O(1) space. A hashmap also works in O(n) time but O(n) space; two pointers wins on space when the array is sorted.",
    "correctPatternId": "two-pointers",
    "hints": [
      "Goal: find two numbers in a SORTED array that add up to a target.",
      "A brute-force pair scan is O(n^2), and even a hashmap costs O(n) extra space you don't need here.",
      "Key insight: because the array is sorted, the ends tell you which way to move — the sum only grows rightward.",
      "Approach: use two pointers from opposite ends, adjusting based on the current sum.",
      "Pseudocode: lo=0, hi=n-1; while lo<hi: if sum<target lo+=1; elif sum>target hi-=1; else return the pair.",
      "Use two pointers: move left up when the sum is too small and right down when too big — O(n) time, O(1) space vs the hashmap's O(n)."
    ],
    "recognition": {
      "scenario": "Given a SORTED array, find two numbers that add up to a target. Both two pointers and a hash map are on the table.",
      "approaches": [
        {
          "id": "two-pointers",
          "label": "Two pointers from both ends",
          "requiredReasonIds": [
            "sorted-converge"
          ]
        },
        {
          "id": "hashmap",
          "label": "Hash map of complements",
          "requiredReasonIds": [
            "hash-complement"
          ]
        },
        {
          "id": "brute",
          "label": "Check every pair (nested loops)",
          "requiredReasonIds": [],
          "rejectionFeedback": "O(n^2) ignores the sortedness that lets converging pointers solve it in O(n)."
        }
      ],
      "reasons": [
        {
          "id": "sorted-converge",
          "text": "The array is already sorted, so a too-small sum means move the left pointer right and a too-big sum means move the right pointer left — O(n) time, O(1) space."
        },
        {
          "id": "hash-complement",
          "text": "A hash map storing each value's complement finds the pair in O(n) time regardless of order, at the cost of O(n) space."
        },
        {
          "id": "need-all-pairs",
          "text": "We must examine every pair to be sure, so nested loops are required.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "two-pointers"
      ],
      "alternatives": [
        {
          "approachId": "hashmap",
          "conditions": "Always works, sorted or not.",
          "tradeoff": "Uses O(n) extra space, whereas two pointers on a sorted array is O(1) space.",
          "requiredReasonIds": [
            "hash-complement"
          ]
        }
      ],
      "modelExplanation": "Two pointers from both ends exploit the existing sort for an O(n) time, O(1) space solution. A hash map also runs in O(n) time but costs O(n) space."
    }
  },
  {
    "id": "pat-tp-fix-1",
    "kind": "fix-mistake",
    "prompt": "`two_sum_sorted(nums, target)` returns a pair of indices (lo, hi) summing to target in a SORTED array, or None. This moves the pointers the wrong way and can miss a valid pair (it still terminates). Fix the moves.",
    "starterCode": "def two_sum_sorted(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo < hi:\n        s = nums[lo] + nums[hi]\n        if s == target:\n            return (lo, hi)\n        if s < target:\n            hi -= 1\n        else:\n            lo += 1\n    return None",
    "expected": "def two_sum_sorted(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo < hi:\n        s = nums[lo] + nums[hi]\n        if s == target:\n            return (lo, hi)\n        if s < target:\n            lo += 1\n        else:\n            hi -= 1\n    return None",
    "hints": [
      "Goal: two_sum_sorted(nums, target) = indices of a pair summing to target in a SORTED array.",
      "The two pointers start at both ends; moving the wrong one can discard a valid pair, although both pointers still move inward and the loop terminates.",
      "Key property: if the sum is too small you need a LARGER value (raise lo); too big → lower hi.",
      "Approach: compare the sum to target and move the correct pointer inward.",
      "Pseudocode: if s<target: lo+=1 elif s>target: hi-=1 else return (lo,hi).",
      "Fix: on s < target do lo += 1; else hi -= 1 (swap the two moves)."
    ],
    "tests": "assert two_sum_sorted([1,2,3,4,6], 6) == (1,3), '2+4'\nassert two_sum_sorted([2,3,4], 6) == (0,2)\nassert two_sum_sorted([1,2,3], 7) is None\n# a too-small sum must move lo UP (would miss the valid pair with the wrong move):\nassert two_sum_sorted([1,2,3,9], 11) == (1,3), '2+9'\nassert two_sum_sorted([5], 5) is None\nprint('OK')"
  },
  {
    "id": "pat-tp-recognize-2",
    "kind": "choose-approach",
    "prompt": "Check whether an ASCII string is a palindrome, ignoring letter case. Which approaches fit? Extra storage is allowed.",
    "expected": "Two pointers from both ends: compare s[lo] and s[hi] moving inward until they cross. O(n) time, O(1) space — a from-both-ends two-pointer scan.",
    "correctPatternId": "two-pointers",
    "hints": [
      "Goal: check an ASCII string for a case-insensitive palindrome; extra storage is allowed.",
      "Building and comparing a reversed copy costs O(n) extra space; comparing in place avoids that.",
      "Key insight: a palindrome's outermost characters must match, then the next inner pair, and so on.",
      "Approach: use two pointers starting at both ends and move them inward.",
      "Pseudocode: compare the lowercase ASCII characters at both ends, then move inward.",
      "Use a from-both-ends two-pointer scan comparing s[lo] and s[hi] until they meet — O(n) time, O(1) space."
    ],
    "recognition": {
      "scenario": "Check whether an ASCII string is a palindrome, ignoring letter case. Which approaches fit? Extra storage is allowed.",
      "approaches": [
        {
          "id": "two-pointers",
          "label": "Two pointers from both ends",
          "requiredReasonIds": [
            "compare-inward"
          ]
        },
        {
          "id": "reverse-copy",
          "label": "Build a reversed copy and compare",
          "requiredReasonIds": [
            "reverse-preserves-order"
          ]
        },
        {
          "id": "sort",
          "label": "Sort the characters",
          "requiredReasonIds": [],
          "rejectionFeedback": "Sorting destroys order, which is the very thing a palindrome check depends on."
        }
      ],
      "reasons": [
        {
          "id": "compare-inward",
          "text": "Compare characters at the two ends and move inward until the pointers cross; a mismatch means not a palindrome — O(n) time, O(1) space."
        },
        {
          "id": "order-irrelevant",
          "text": "Character order does not matter, so a frequency comparison suffices.",
          "contradictory": true
        },
        {
          "id": "needs-hashmap",
          "text": "A hash map of counts is required to decide this.",
          "contradictory": true
        },
        {
          "id": "reverse-preserves-order",
          "text": "A reversed copy preserves the order information needed to compare both directions. ASCII lowercasing preserves the number of characters."
        }
      ],
      "acceptableApproachIds": [
        "two-pointers"
      ],
      "modelExplanation": "Two pointers from both ends: compare s[lo] and s[hi] moving inward, exiting early on the first mismatch — O(n) time, O(1) space. A reversed lowercase copy is also valid when extra space is allowed. Full Unicode case folding may expand characters, so per-character inward comparison is not a general normalized-Unicode solution.",
      "alternatives": [
        {
          "approachId": "reverse-copy",
          "conditions": "Valid under this problem’s stated contract.",
          "tradeoff": "O(n) extra storage; inward pointers can use O(1) slots on ASCII characters.",
          "requiredReasonIds": [
            "reverse-preserves-order"
          ]
        }
      ]
    }
  }
],

  references: [
  {
    "url": "https://usaco.guide/silver/two-pointers",
    "title": "USACO Guide: two pointers",
    "section": "Sum of Two Values; Sliding Window",
    "topic": "codex/b2-b",
    "purpose": "Verify the specific semantics and conditions used in this lesson.",
    "verifiedClaims": [
      "Sorted opposite-end pointers move according to the current sum; suitable monotone windows advance each boundary at most n times."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "85dd9c69c2621a85",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
