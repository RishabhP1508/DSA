/**
 * Lesson: Kadane's algorithm (Arrays). Verified on CPython 3.14. Output: "6\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Largest sum of any nonempty contiguous subarray (Kadane's algorithm).
nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
best = nums[0]
current = nums[0]
for i in range(1, len(nums)):
    # Either start fresh at nums[i], or extend the current run.
    current = max(nums[i], current + nums[i])
    if current > best:
        best = current
print(best)`;

export const kadane: LessonDefinition = {
  id: "kadane",
  title: "Kadane's Algorithm (Maximum Subarray)",
  area: "Arrays",
  prerequisites: ["array-traversal"],

  explanation: `**Kadane's algorithm** finds the largest sum of any **nonempty contiguous subarray** in a single pass. The brute force checks every start/end pair and sums each — **O(n²)** (or O(n³) if you re-sum naively). Kadane brings it down to **O(n)** with **O(1)** space.

The key idea is a running value \`current\` = "the best subarray sum that **ends exactly at the current position**." At each element you face one decision: either **extend** the previous run (\`current + nums[i]\`) or **start fresh** at \`nums[i]\`. You take whichever is larger: \`current = max(nums[i], current + nums[i])\`. You start fresh whenever the previous run has gone negative — because a negative prefix can only drag down what follows. Alongside, \`best\` remembers the largest \`current\` ever seen.

This is different from the fixed-size window (which fixes a width k) and from target-sum counting (which uses prefix sums + a map). Kadane answers "**any length**, maximum sum." For the example the answer is 6, from the subarray \`[4, -1, 2, 1]\`.`,

  vocabulary: [
    { term: "Subarray", definition: "A contiguous slice of the array (elements next to each other)." },
    { term: "current (best ending here)", definition: "The maximum subarray sum that ends at the current index." },
    { term: "best (global)", definition: "The maximum subarray sum seen anywhere so far." },
    { term: "Extend vs restart", definition: "The choice each step: continue the run or begin a new one at nums[i]." },
  ],

  concepts: {
    purpose: "Kadane computes the maximum-sum contiguous subarray in one linear pass.",
    operations: "Track best-ending-here (current) with a max of {extend, restart}; track the global best.",
    uses: "Maximum profit/segment problems, and as a template for other 'best ending here' DP scans.",
    tradeoffs: "O(n) time and O(1) space, but it answers only the max SUM (a small tweak also recovers the indices).",
    commonMistakes: "Initialising best to 0 (wrong when all numbers are negative — the answer should be the least-negative element); forgetting the array is nonempty; confusing it with fixed-size windows.",
    edgeCases: "All negatives: the answer is the single largest (least negative) element, which is why we seed best = current = nums[0]. Single element: that element.",
  },

  complexity: [
    { operation: "Kadane scan", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "One pass, two scalars; brute force is O(n^2)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in nums" }],
    costModel: "Each step does one max, one addition, and one comparison — all O(1).",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "The loop makes a single pass over the n-1 remaining elements, doing constant work each step (a max and a comparison). So the total is linear in n. The brute-force alternative examines all O(n²) subarrays, so Kadane's single pass is a clear improvement.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Only two scalars, `best` and `current`, are kept regardless of n. No array grows with the input.",
      inputOutputNote: "The list of n numbers is the input, not auxiliary space.",
    },
    derivation: [
      { lines: [5], description: "One pass over the remaining n-1 elements.", cost: "O(n)", dimension: "time" },
      { lines: [7, 8, 9], description: "Each step: one max, one add, one compare — all O(1).", cost: "O(1)", dimension: "time" },
      { lines: [3, 4], description: "Two running scalars.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Addition/comparison are constant time.", "The array is nonempty (we seed from nums[0])."],
    tradeoffs: "Brute force is O(n²) time / O(1) space; a divide-and-conquer max-subarray is O(n log n). Kadane's O(n)/O(1) is optimal for this problem.",
    counters: [
      { label: "steps", definition: "executions of the update (line 7)", countLines: [7] },
      { label: "best updates", definition: "executions of the global-best update (line 9)", countLines: [9] },
    ],
    fixedDataNote: "This run scans 9 elements and returns 6 (subarray [4,-1,2,1]). The O(n) bound generalises the pass to n elements.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: goal is the max-sum contiguous subarray." },
    { line: 2, executable: true, explanation: "Create the sample array." },
    { line: 3, executable: true, explanation: "Seed best with the first element (handles all-negative inputs correctly)." },
    { line: 4, executable: true, explanation: "Seed current (best subarray ending at index 0) with the first element." },
    { line: 5, executable: true, explanation: "Scan the rest of the array, one element per pass." },
    { line: 6, executable: false, explanation: "Comment: extend the run or restart at nums[i]." },
    { line: 7, executable: true, explanation: "current = max(start fresh at nums[i], extend with current + nums[i]). Restarts when the previous run was negative." },
    { line: 8, executable: true, explanation: "If this best-ending-here beats the global best..." },
    { line: 9, executable: true, explanation: "...update best." },
    { line: 10, executable: true, explanation: "Print the maximum subarray sum → 6." },
  ],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [{ role: "pointer", label: "i", source: "i" }],
    },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "If every number in nums were negative, why would seeding best = nums[0] (instead of 0) matter?", answer: "Because the best nonempty subarray is the single least-negative element; seeding best = 0 would wrongly return 0.", explanation: "A nonempty subarray must contain at least one element. With all negatives, the answer is the largest single element, which seeding from nums[0] captures but best = 0 would not." },
  ],

  experiments: [
    "Change all numbers to negatives and confirm the answer is the least-negative element.",
    "Add a large positive value and watch best jump when current reaches it.",
    "Track which index current restarts at to identify the winning subarray's start.",
  ],

  exercises: [
    {
      id: "kad-fix-1",
      kind: "fix-mistake",
      prompt: "This Kadane returns 0 for an all-negative array, which is wrong. Fix the initialization.",
      starterCode: "def max_sub(nums):\n    best = 0\n    current = 0\n    for x in nums:\n        current = max(x, current + x)\n        best = max(best, current)\n    return best",
      expected: "def max_sub(nums):\n    best = nums[0]\n    current = nums[0]\n    for x in nums[1:]:\n        current = max(x, current + x)\n        best = max(best, current)\n    return best",
      hints: ["What should the answer be if all numbers are negative?", "The least-negative single element — not 0.", "Seed best and current from nums[0], then scan nums[1:]."],
    },
    {
      id: "kad-choose-1",
      kind: "choose-approach",
      prompt: "Three problems: (a) max sum of exactly k consecutive, (b) count subarrays summing to a target with negatives, (c) max sum of any-length contiguous subarray. Which is Kadane, and why not the other tools?",
      expected: "(c) is Kadane. (a) is a fixed-size sliding window (fixed width k). (b) is prefix sums + hash map (counts ranges, handles negatives). Same 'subarray' wording, different patterns.",
      hints: ["Is the length fixed, or any length, or are you counting matches?", "Kadane = maximum sum, ANY length.", "Fixed width → window; counting target sums → prefix sums + map."],
    },
  ],

  review: `**Kadane's algorithm** finds the maximum-sum contiguous subarray in **O(n)** time and **O(1)** space by tracking \`current\` = best sum ending here (\`max(nums[i], current+nums[i])\`) and the global \`best\`. Seed both from \`nums[0]\` so all-negative arrays work. It solves "any length, max sum" — distinct from fixed-size windows and target-sum counting.`,

  expectedOutput: "6\n",

  references: [
    {
      url: "https://en.wikipedia.org/wiki/Maximum_subarray_problem",
      title: "Maximum subarray problem — Wikipedia",
      section: "Kadane's algorithm",
      topic: "arrays/kadane",
      purpose: "Confirm Kadane's recurrence and the all-negative initialization subtlety.",
      verifiedClaims: ["current = max(nums[i], current + nums[i]) with a tracked global maximum yields the max subarray sum in O(n)", "Initialization must handle all-negative arrays"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Maximum Subarray / Kadane",
      topic: "arrays/kadane",
      purpose: "Cross-check where the maximum-subarray problem sits and its canonical solution.",
      verifiedClaims: ["Maximum subarray is solved by Kadane's linear scan"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "4d62e40c44c33ae4",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
