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
      id: "pat-tp-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Given a SORTED array, find two numbers that add up to a target.' Two pointers or a hashmap — and why either could work?",
      expected:
        "Two pointers is ideal here: the array is already sorted, so opposite-ends pointers give O(n) time and O(1) space. A hashmap also works in O(n) time but O(n) space; two pointers wins on space when the array is sorted.",
      correctPatternId: "two-pointers",
      hints: [
        "The array is sorted — exploit the order.",
        "Move left up when the sum is too small, right down when too big.",
        "O(1) space vs the hashmap's O(n).",
      ],
    },
    {
      id: "pat-tp-fix-1",
      kind: "fix-mistake",
      prompt:
        "This two-pointer sum search loops forever on some inputs. Fix the pointer movement.",
      starterCode:
        "lo, hi = 0, len(nums) - 1\nwhile lo < hi:\n    s = nums[lo] + nums[hi]\n    if s == target:\n        return (lo, hi)\n    if s < target:\n        hi -= 1\n    else:\n        lo += 1\nreturn None",
      expected:
        "lo, hi = 0, len(nums) - 1\nwhile lo < hi:\n    s = nums[lo] + nums[hi]\n    if s == target:\n        return (lo, hi)\n    if s < target:\n        lo += 1\n    else:\n        hi -= 1\nreturn None",
      hints: [
        "If the sum is too small you need a LARGER value.",
        "The larger values are to the right, reached by moving lo up.",
        "Swap the two moves: s < target → lo += 1; else hi -= 1.",
      ],
    },
    {
      id: "pat-tp-recognize-2",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Check whether a string reads the same forwards and backwards, ignoring case.' Which pattern?",
      expected:
        "Two pointers from both ends: compare s[lo] and s[hi] moving inward until they cross. O(n) time, O(1) space — a from-both-ends two-pointer scan.",
      correctPatternId: "two-pointers",
      hints: [
        "Compare characters from the outside in.",
        "Two pointers moving toward each other.",
        "Stop when they meet.",
      ],
    },
  ],

  references: [
    {
      url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/editorial/",
      title: "Two Sum II (sorted input) — LeetCode editorial",
      section: "Two-pointer O(n) solution",
      topic: "patterns/two-pointers",
      purpose:
        "Confirm the opposite-ends two-pointer method on a sorted array and its O(n) time / O(1) space.",
      verifiedClaims: [
        "On a sorted array, opposite-ends two pointers find a target pair in O(n) time and O(1) space.",
        "Move the left pointer up when the sum is too small and the right pointer down when it is too big.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://github.com/ashishps1/awesome-leetcode-resources",
      title: "Awesome LeetCode Resources — patterns (two pointers)",
      section: "Two pointers pattern",
      topic: "patterns/two-pointers",
      purpose: "Cross-check recognition clues (sorted input, pair/partition, palindrome) and same- vs opposite-direction variants.",
      verifiedClaims: ["Two pointers replaces O(n²) pair scans with O(n) when order or an invariant guides pointer movement."],
      accessDate: "2026-09-20",
    },
  ],
};
