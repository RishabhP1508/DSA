/**
 * Lesson: In-place modification (Arrays). Verified on CPython 3.14.
 * Output: "[1, 3, 12, 0, 0]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Move all zeros to the end, keeping the order of the others.
# In place: no second array (O(1) extra space).
nums = [0, 1, 0, 3, 12]
insert = 0
# Pass 1: copy each non-zero forward to the 'insert' position.
for i in range(len(nums)):
    if nums[i] != 0:
        nums[insert] = nums[i]
        insert = insert + 1
# Pass 2: fill the remainder with zeros.
while insert < len(nums):
    nums[insert] = 0
    insert = insert + 1
print(nums)`;

export const inPlaceModification: LessonDefinition = {
  id: "in-place-modification",
  title: "In-Place Modification",
  area: "Arrays",
  prerequisites: ["array-traversal", "two-pointers"],

  explanation: `**In-place** means rearranging the array using only **O(1) extra space** — no second array. This matters when memory is tight or when an interviewer forbids a copy. The tool is usually a **write pointer** (\`insert\`) that trails a **read pointer** (\`i\`): you scan with \`i\`, and whenever you find an element to keep, you write it at \`insert\` and advance \`insert\`.

Here we push all zeros to the end while keeping the other numbers in their original order. Pass 1 copies every non-zero value forward into the next \`insert\` slot. After that, \`insert\` marks where the non-zeros end, so Pass 2 simply fills the rest with zeros. Everything happens inside the one array.

The subtlety is correctness: because \`insert <= i\` always, we never overwrite an element we haven't read yet. This "read/write two-pointer" idea also powers in-place duplicate removal and partitioning.`,

  vocabulary: [
    { term: "In place", definition: "Modifying the input with O(1) extra space, no new array." },
    { term: "Write pointer", definition: "The index where the next kept element should go (insert here)." },
    { term: "Read pointer", definition: "The index currently being examined during the scan." },
    { term: "Stable order", definition: "Kept elements retain their original relative order." },
  ],

  concepts: {
    purpose: "In-place edits rearrange data without allocating a second array, saving O(n) space.",
    operations: "Scan with a read pointer; copy kept elements to a trailing write pointer; fill or swap the remainder.",
    uses: "Move/remove elements, remove duplicates from sorted arrays, Dutch-flag partitioning, compaction.",
    tradeoffs: "Saves O(n) space but mutates the input (destructive); the logic is trickier than building a fresh list.",
    commonMistakes: "Advancing the write pointer on skipped elements; overwriting unread data (write pointer must not pass read pointer); assuming order is preserved by a swap-based method (it may not be).",
    edgeCases: "All zeros (nothing to keep; whole array becomes zeros). No zeros (array unchanged). Empty array (both loops do nothing).",
  },

  complexity: [
    { operation: "Move zeros in place", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "Two linear passes; only an index variable extra." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in nums" }],
    costModel: "Each element read, comparison, and write is O(1).",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "Pass 1 scans all n elements once (O(n)); Pass 2 fills at most n trailing slots (O(n)). Together that is O(n) + O(n) = O(n) — two sequential linear passes ADD, they do not multiply.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Only the `insert` write pointer (and the loop index) is used. The rearrangement happens inside the original array, so no storage grows with n.",
      inputOutputNote: "The array is mutated in place; it is the input, not extra space.",
    },
    derivation: [
      { lines: [6, 7, 8, 9], description: "Pass 1 scans all n elements, copying kept ones forward.", cost: "O(n)", dimension: "time" },
      { lines: [11, 12, 13], description: "Pass 2 fills the trailing slots — at most n writes.", cost: "O(n)", dimension: "time" },
      { lines: [4], description: "One write-pointer variable; edits are in place.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["List read/write by index is O(1).", "The two passes are sequential (added), not nested (multiplied)."],
    tradeoffs: "Building a new list of non-zeros then padding is also O(n) time but O(n) space; the in-place version keeps space at O(1).",
    counters: [
      { label: "elements scanned", definition: "executions of the pass-1 body (line 7)", countLines: [7] },
      { label: "zeros written", definition: "executions of the pass-2 write (line 12)", countLines: [12] },
    ],
    fixedDataNote: "This run scans 5 elements and writes 2 trailing zeros. The O(n) bound describes both passes scaling with n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: move zeros to the end, keep other order." },
    { line: 2, executable: false, explanation: "Comment: in place, O(1) extra space." },
    { line: 3, executable: true, explanation: "Create nums = [0, 1, 0, 3, 12]." },
    { line: 4, executable: true, explanation: "insert (the write pointer) starts at 0 — where the next kept value goes." },
    { line: 5, executable: false, explanation: "Comment: pass 1 copies non-zeros forward." },
    { line: 6, executable: true, explanation: "Scan every index i (the read pointer)." },
    { line: 7, executable: true, explanation: "If the current element is not zero, we keep it." },
    { line: 8, executable: true, explanation: "Write it at the insert position (never past i, so it's safe)." },
    { line: 9, executable: true, explanation: "Advance insert only when we kept something." },
    { line: 10, executable: false, explanation: "Comment: pass 2 fills the remainder with zeros." },
    { line: 11, executable: true, explanation: "From insert to the end, fill zeros." },
    { line: 12, executable: true, explanation: "Write a zero at the current insert position." },
    { line: 13, executable: true, explanation: "Advance insert." },
    { line: 14, executable: true, explanation: "Print the result → [1, 3, 12, 0, 0]." },
  ],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [
        { role: "pointer", label: "read i", source: "i" },
        { role: "pointer", label: "write", source: "insert" },
      ],
    },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why is it safe that the write pointer `insert` writes into positions we may not have read yet?", answer: "Because insert is always <= i, so we only overwrite positions at or before the one we've already read.", explanation: "The write pointer trails the read pointer (insert <= i), so any slot being written has already been read into nums[i], and its value is preserved by the forward copy." },
  ],

  experiments: [
    "Run it on an array with no zeros and confirm it is unchanged.",
    "Run it on all zeros and confirm the array becomes all zeros.",
    "Track the gap between the read pointer i and the write pointer insert as zeros are skipped.",
  ],

  exercises: [
    {
      id: "ip-complete-1",
      kind: "complete-code",
      prompt: "Complete the in-place removal of a target value, returning the new length.",
      starterCode: "def remove_val(nums, target):\n    insert = 0\n    for i in range(len(nums)):\n        if nums[i] != target:\n            # TODO: keep nums[i]\n            pass\n    return insert",
      expected: "def remove_val(nums, target):\n    insert = 0\n    for i in range(len(nums)):\n        if nums[i] != target:\n            nums[insert] = nums[i]\n            insert = insert + 1\n    return insert",
      hints: ["Keep an element by writing it at insert.", "Then advance insert.", "nums[insert] = nums[i]; insert += 1"],
    },
    {
      id: "ip-predict-1",
      kind: "predict-state",
      prompt: "Two sequential (not nested) linear passes over n elements: is the total O(n) or O(n^2)?",
      expected: "O(n) — sequential passes add: n + n = 2n = O(n). Only nested passes multiply.",
      hints: ["Are the passes nested or one after another?", "Sequential costs add.", "n + n = O(n)."],
    },
  ],

  review: `**In-place** modification rearranges the array with **O(1)** extra space using a **write pointer** trailing a **read pointer**. Moving zeros to the end is two sequential **O(n)** passes (which add, not multiply, so still O(n)). The write pointer never passes the read pointer, so no unread data is lost.`,

  expectedOutput: "[1, 3, 12, 0, 0]\n",

  references: [
    {
      url: "https://www.geeksforgeeks.org/move-zeroes-end-array/",
      title: "Move all zeroes to end of array — GeeksforGeeks",
      section: "Efficient in-place approach",
      topic: "arrays/in-place",
      purpose: "Confirm the write/read pointer method and its O(n) time / O(1) space.",
      verifiedClaims: ["A write pointer copying non-zeros forward moves zeros to the end in O(n) time and O(1) space"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Arrays & Hashing / in-place techniques",
      topic: "arrays/in-place",
      purpose: "Cross-check that in-place compaction is a recognized array technique.",
      verifiedClaims: ["In-place two-pointer compaction removes/moves elements without extra arrays"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 15,
    contentHash: "6912d1eb8a5270e9",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
