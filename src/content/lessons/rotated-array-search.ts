/**
 * Lesson: Rotated array search (Searching). Verified on CPython 3.14.
 * Output: "4\n-1\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Search a sorted array that has been rotated at an unknown pivot.
def search_rotated(nums, target):
    lo = 0
    hi = len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        # One side of mid is always sorted. Find which, then decide.
        if nums[lo] <= nums[mid]:            # left half is sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1                 # target in the sorted left
            else:
                lo = mid + 1
        else:                                # right half is sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1                 # target in the sorted right
            else:
                hi = mid - 1
    return -1

print(search_rotated([4, 5, 6, 7, 0, 1, 2], 0))
print(search_rotated([4, 5, 6, 7, 0, 1, 2], 3))`;

export const rotatedArraySearch: LessonDefinition = {
  id: "rotated-array-search",
  title: "Search in a Rotated Sorted Array",
  area: "Searching",
  prerequisites: ["binary-search"],

  explanation: `A **rotated sorted array** is a sorted array that has been "cut" at some pivot and the two pieces swapped, e.g. \`[4,5,6,7,0,1,2]\` (originally \`[0,1,2,4,5,6,7]\` rotated). It is no longer fully sorted, so plain binary search breaks — yet we can still find a target in **O(log n)** with a clever twist.

The key observation: **at least one side of \`mid\` is always properly sorted.** Compare \`nums[lo]\` with \`nums[mid]\`. If \`nums[lo] <= nums[mid]\`, the **left half is sorted**; otherwise the **right half is sorted.** Once you know which side is sorted, you can test in O(1) whether the target lies within that sorted side's range — if so, search there; if not, search the other side. Either way you still discard half the array each step, preserving the logarithmic cost.

This is binary search adapted to a broken-but-structured order. The same "which side is sorted?" reasoning also finds the minimum/pivot of a rotated array.`,

  vocabulary: [
    { term: "Rotated sorted array", definition: "A sorted array split at a pivot with the parts swapped." },
    { term: "Pivot", definition: "The rotation point where order 'wraps around'." },
    { term: "Sorted half", definition: "The side of mid that is still in increasing order (always at least one)." },
    { term: "Range test", definition: "Checking in O(1) whether the target falls within a sorted half's bounds." },
  ],

  concepts: {
    purpose: "Find a value in a rotated sorted array in O(log n) despite the broken order.",
    operations: "Identify which half of mid is sorted; test if the target is in it; discard the other half.",
    uses: "Rotated-array search/minimum, circular sorted data, resuming search after a wrap.",
    tradeoffs: "Still O(log n) like binary search but with more branch logic; assumes distinct elements for the clean version.",
    commonMistakes: "Wrong inequality when detecting the sorted side (use nums[lo] <= nums[mid]); off-by-one in the range test; duplicates breaking the sorted-side detection (needs a special case).",
    edgeCases: "No rotation (fully sorted) still works. Target at the pivot boundaries. Duplicates can make it degrade toward O(n).",
  },

  complexity: [
    { operation: "Rotated search", best: "O(1)", average: "O(log n)", worst: "O(log n)", space: "O(1)", note: "Distinct elements; duplicates can degrade to O(n)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in the array" }],
    costModel: "Each iteration does a constant number of comparisons and discards half the range.",
    time: {
      bound: "O(log n)",
      case: "worst",
      explanation: "Despite the rotation, each iteration still halves the search range: we detect the sorted side (O(1)) and eliminate one half. So the range shrinks n → n/2 → … → 1, about log₂(n) iterations, each constant work — O(log n). (With duplicate values, the sorted-side test can become ambiguous and force a linear scan, degrading to O(n).)",
      otherCases: [
        { case: "best", bound: "O(1)", note: "The first midpoint is the target." },
      ],
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Only lo, hi, mid are kept — constant space, iterative.",
      inputOutputNote: "The array of n elements is the input, not auxiliary space.",
    },
    derivation: [
      { lines: [5], description: "The loop runs about log2(n) times as the range halves.", cost: "O(log n)", dimension: "time" },
      { lines: [10, 11, 16], description: "Each step: detect the sorted side and one range test — O(1).", cost: "O(1)", dimension: "time" },
      { lines: [3, 4], description: "Three index variables, independent of n.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Elements are distinct (the clean O(log n) case).", "Index access/comparisons are O(1)."],
    tradeoffs: "You could find the pivot first (O(log n)) then do two ordinary binary searches; the one-pass version here folds that into a single O(log n) loop.",
    counters: [{ label: "iterations", definition: "executions of the loop midpoint (line 6)", countLines: [6] }],
    fixedDataNote: "Searching a 7-element rotated array takes at most ~3 iterations. The O(log n) bound generalises to n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: rotated sorted array search." },
    { line: 2, executable: true, explanation: "Define search_rotated(nums, target)." },
    { line: 3, executable: true, explanation: "lo at the first index." },
    { line: 4, executable: true, explanation: "hi at the last index." },
    { line: 5, executable: true, explanation: "Standard binary-search loop condition." },
    { line: 6, executable: true, explanation: "Midpoint index." },
    { line: 7, executable: true, explanation: "Found the target: return mid." },
    { line: 8, executable: true, explanation: "Found the target at mid: return the index." },
    { line: 9, executable: false, explanation: "Comment: one side of mid is always sorted — find which, then decide." },
    { line: 10, executable: true, explanation: "If nums[lo] <= nums[mid], the LEFT half is sorted." },
    { line: 11, executable: true, explanation: "Is the target within the sorted left range [nums[lo], nums[mid])?" },
    { line: 12, executable: true, explanation: "Yes: search the left half (hi = mid - 1)." },
    { line: 13, executable: true, explanation: "Otherwise..." },
    { line: 14, executable: true, explanation: "...it must be in the right half (lo = mid + 1)." },
    { line: 15, executable: true, explanation: "Else the RIGHT half is sorted." },
    { line: 16, executable: true, explanation: "Is the target within the sorted right range (nums[mid], nums[hi]]?" },
    { line: 17, executable: true, explanation: "Yes: search the right half (lo = mid + 1)." },
    { line: 18, executable: true, explanation: "Otherwise..." },
    { line: 19, executable: true, explanation: "...the target is in the left half: hi = mid - 1." },
    { line: 20, executable: true, explanation: "Loop ended without a match: return -1." },
    { line: 21, executable: false, explanation: "Blank line." },
    { line: 22, executable: true, explanation: "Search 0 in the rotated array → index 4." },
    { line: 23, executable: true, explanation: "Search 3 (absent) → -1." },
  ],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [
        { role: "boundary", label: "lo", source: "lo" },
        { role: "pointer", label: "mid", source: "mid" },
        { role: "boundary", label: "hi", source: "hi" },
      ],
    },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "In [4,5,6,7,0,1,2] with mid at index 3 (value 7), which half is sorted and how do you know?", answer: "The left half is sorted, because nums[lo]=4 <= nums[mid]=7.", explanation: "When nums[lo] <= nums[mid], the left side has no wrap and is in order. Here 4 <= 7, so the left half [4,5,6,7] is the sorted side." },
  ],

  experiments: [
    "Search for 5 and trace which half is deemed sorted at each step.",
    "Use a non-rotated sorted array and confirm it still works.",
    "Search for the pivot value 0 and the wrap value 4 to test the boundaries.",
  ],

  exercises: [
    {
      id: "rot-choose-1",
      kind: "choose-approach",
      prompt: "Why can't plain binary search be used directly on [4,5,6,7,0,1,2], and what single extra step fixes it?",
      expected: "Because the array isn't fully sorted, so nums[mid] vs target alone can't tell which half to discard. The fix: first determine which half of mid IS sorted (nums[lo] <= nums[mid]), then decide using that half's range.",
      hints: ["Is the whole array sorted?", "No — plain comparison can't pick the right half.", "Detect the sorted half first, then range-test the target."],
    },
    {
      id: "rot-predict-1",
      kind: "predict-state",
      prompt: "What is the time complexity of rotated-array search with distinct elements, and what breaks it?",
      expected: "O(log n) with distinct elements; duplicate values can make the sorted-side test ambiguous and degrade it toward O(n).",
      hints: ["Each step still halves the range.", "That gives O(log n).", "Duplicates break the sorted-side detection."],
    },
  ],

  review: `Searching a **rotated sorted array** keeps binary search's **O(log n)** by noticing that **one half of \`mid\` is always sorted**. Detect the sorted half (\`nums[lo] <= nums[mid]\`), test whether the target lies in its range, and discard the other half. Distinct elements give clean O(log n); duplicates can degrade to O(n).`,

  expectedOutput: "4\n-1\n",

  references: [
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Binary Search — Search in Rotated Sorted Array",
      topic: "searching/rotated",
      purpose: "Confirm the 'one half is always sorted' approach and its O(log n) cost.",
      verifiedClaims: ["In a rotated sorted array, one side of mid is sorted, enabling O(log n) search"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://www.geeksforgeeks.org/search-an-element-in-a-sorted-and-pivoted-array/",
      title: "Search in a rotated sorted array — GeeksforGeeks",
      section: "Modified binary search",
      topic: "searching/rotated",
      purpose: "Cross-check the branch logic and the duplicate-elements caveat.",
      verifiedClaims: ["Detecting the sorted half and range-testing the target yields O(log n) for distinct elements"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "12bfcc593bb15c8a",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
