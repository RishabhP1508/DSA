/**
 * Pattern: Cyclic sort.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2). Output "2\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# Cyclic sort: when values are in a known range 0..n, put each value at its index.
def find_missing(nums):
    i = 0
    n = len(nums)
    while i < n:
        j = nums[i]                          # where nums[i] belongs
        if 0 <= j < n and nums[i] != nums[j]:
            nums[i], nums[j] = nums[j], nums[i]   # swap it into place
        else:
            i += 1                           # already correct (or out of range)
    for idx in range(n):
        if nums[idx] != idx:                 # first index missing its value
            return idx
    return n

print(find_missing([3, 0, 1]))  # 2 is missing`;

export const cyclicSortPattern: PatternDefinition = {
  id: "cyclic-sort",
  title: "Cyclic Sort",
  category: "Arrays & strings",
  summary:
    "When values are a permutation of a known range, place each at its index in O(n)/O(1) so missing or duplicate values fall out.",

  clues: [
    "The array holds numbers from a KNOWN contiguous range (0..n or 1..n), possibly with a missing/duplicate/extra value.",
    "You must find the missing number(s), the duplicate(s), or the smallest missing positive.",
    "A constraint pushes you to O(1) extra space (so no separate boolean/set array).",
    "Phrases like 'numbers 1 to n', 'find the missing number', 'find the duplicate', 'first missing positive'.",
  ],

  naiveApproach: `Sort the array (**O(n log n)**), or use a hash set / boolean array of size n (**O(n) extra space**) to mark which values are present, then scan for the anomaly. Both work but either cost a log factor or violate an O(1)-space constraint.`,

  whyItHelps: "Because the values are (almost) a permutation of `0..n`, each value has a **known home index** — value `v` belongs at index `v`. Walk the array and, whenever `nums[i]` is not already sitting at its home, **swap it there**; otherwise advance. Each successful swap permanently fixes at least one target slot; a displaced value may move more than once, so the placement is **O(n)** with **O(1)** extra space. After sorting-by-placement, the **first index whose value ≠ index** reveals the missing number (or a duplicate/mismatch reveals the repeated one). It's the array itself acting as the marker, with no extra structure.",

  conditions: [
  "The single-missing example requires n distinct integer values from 0..n. Other range problems need their own mapping, bounds, and duplicate rules.",
  "Require 0 <= j < n before indexing, and skip equal values to avoid useless duplicate swaps. Negative Python indices are valid indices but are not home slots for this algorithm.",
  "In-place mutation of the input must be acceptable."
],

  alternatives: [
  "XOR is valid for n distinct values from 0..n with exactly one missing. A duplicate-only XOR variant requires a complete known range plus exactly one extra repeated value; it does not solve arbitrary duplicate patterns.",
  "Hash set / boolean array — simplest when O(n) extra space is allowed and the range isn't index-aligned.",
  "Sum formula (n(n+1)/2 − sum) — for exactly one missing number, though it risks overflow in fixed-width languages."
],

  counterexamples: [
    "If values are arbitrary (not a bounded 0..n range), there's no home index — use a hash set instead.",
    "'Find a cycle's start' in a value-as-pointer array is fast/slow pointers (Floyd), not cyclic sort.",
    "Omitting the `nums[i] != nums[j]` guard causes an infinite swap loop when duplicates exist.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "2\n",
  complexityNote:
    "O(n) time: each successful swap fixes at least one target slot permanently, and there are n slots. An individual displaced value can move more than once. O(1) auxiliary bounded-size slots, excluding input storage.",

  complexityExplanation: {
  "scope": "operation",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in nums"
    }
  ],
  "costModel": "The while loop either swaps a value into its home index or advances i. Each successful swap places one value permanently, so swaps are bounded by n; i advances at most n times.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The placement loop (lines 5-10) does at most n swaps total (each swap fixes one value's final position) plus at most n index advances, so O(n) — even though it is a while loop, not a simple for. The final scan (lines 11-13) is another O(n). Total O(n)."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Sorting is done in place with a constant number of index variables; no auxiliary array.",
    "inputOutputNote": "nums is rearranged in place; the answer is a single index."
  },
  "derivation": [
    {
      "lines": [
        5,
        6,
        7,
        8
      ],
      "description": "Each swap places one value at its home index; total swaps <= n.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        9,
        10
      ],
      "description": "Each non-swap advances i; at most n advances.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        11,
        12
      ],
      "description": "Final linear scan for the first misplaced index.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        3
      ],
      "description": "A constant number of index variables (in-place).",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Values lie in the known range 0..n (cyclic sort's precondition).",
    "List indexing and swap are O(1)."
  ],
  "tradeoffs": "Sorting then scanning is O(n log n); a boolean/seen array is O(n) time but O(n) space. Cyclic sort is O(n) time AND O(1) space by exploiting the value-equals-index range.",
  "counters": [
    {
      "label": "placements",
      "definition": "loop iterations placing/advancing (line 5)",
      "countLines": [
        5
      ]
    }
  ],
  "fixedDataNote": "For [3,0,1] the loop places 0 and 1 and detects index 2 missing. The O(n) bound generalises via the swap-count argument."
},

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: place each value at its own index." },
    { line: 2, executable: true, explanation: "Define find_missing(nums)." },
    { line: 3, executable: true, explanation: "Cursor into the array." },
    { line: 4, executable: true, explanation: "n is the array length and the range bound." },
    { line: 5, executable: true, explanation: "Walk until every position is examined." },
    { line: 6, executable: true, explanation: "j is where nums[i] belongs (its value = its home index)." },
    { line: 7, executable: true, explanation: "If it's in range and not already home (and not a duplicate)..." },
    { line: 8, executable: true, explanation: "...swap it into its correct slot." },
    { line: 9, executable: false, explanation: "Otherwise it's placed (or out of range)." },
    { line: 10, executable: true, explanation: "Advance the cursor." },
    { line: 11, executable: true, explanation: "Scan for the first index whose value doesn't match." },
    { line: 12, executable: true, explanation: "A mismatch means that index's value is missing." },
    { line: 13, executable: true, explanation: "Return the missing index." },
    { line: 14, executable: true, explanation: "If all match, n itself is missing." },
    { line: 15, executable: false, explanation: "Blank line." },
    { line: 16, executable: true, explanation: "[3,0,1] is missing 2." },
  ],

  bindings: [
    { variable: "nums", model: "array", overlays: [{ role: "pointer", label: "i", source: "i" }] },
  ],

  linkedLessons: ["in-place-modification", "duplicate-detection"],

  exercises: [
    {
      id: "pat-cs-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'An array contains n distinct numbers taken from 0..n (one is missing). Find the missing number using O(1) extra space.' Which pattern?",
      expected:
        "Cyclic sort: place each value at its index by swapping, then the first index whose value ≠ index is the missing number. O(n) time, O(1) space. (Bitwise XOR is an equally valid O(1)-space alternative.)",
      correctPatternId: "cyclic-sort",
      hints: [
        "Values map directly to indices.",
        "O(1) space rules out a separate marker array.",
        "Swap each value home, then find the gap.",
      ],
    },
    {
      id: "pat-cs-fix-1",
      kind: "fix-mistake",
      prompt:
        "`cyclic_sort(nums)` places each value `v` (with `0 <= v < len(nums)`) at index `v` and returns the array. This loops forever when the array has duplicates. Add the guard that prevents it.",
      starterCode:
        "def cyclic_sort(nums):\n    i = 0\n    while i < len(nums):\n        j = nums[i]\n        if j < len(nums):\n            nums[i], nums[j] = nums[j], nums[i]\n        else:\n            i += 1\n    return nums",
      expected:
        "def cyclic_sort(nums):\n    i = 0\n    while i < len(nums):\n        j = nums[i]\n        if j < len(nums) and nums[i] != nums[j]:\n            nums[i], nums[j] = nums[j], nums[i]\n        else:\n            i += 1\n    return nums",
      hints: [
        "If nums[i] already equals nums[j], swapping does nothing but repeats forever.",
        "Only swap when the target slot holds a different value.",
        "Add `and nums[i] != nums[j]`.",
      ],
    },
    {
      id: "pat-cs-choose-1",
      kind: "choose-approach",
      prompt:
        "The array holds arbitrary large integers (not a 0..n range) and you must find the one that appears once. Cyclic sort or something else?",
      expected:
        "Not cyclic sort — there's no home index for arbitrary values. Use bitwise XOR (if every other value pairs up) or a hash map of counts.",
      correctPatternId: "cyclic-sort",
      hints: [
        "Cyclic sort needs values that map to indices.",
        "Arbitrary values break that assumption.",
        "XOR or a frequency map fits instead.",
      ],
    },
  ],

  references: [
  {
    "url": "https://leetcode.com/problems/missing-number/",
    "title": "Missing Number: original contract",
    "section": "Problem and constraints",
    "topic": "patterns/cyclic-sort",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "n distinct values come from 0..n with exactly one missing."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 19,
    contentHash: "76a032cae0856e32",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
