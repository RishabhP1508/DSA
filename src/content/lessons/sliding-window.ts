/**
 * Lesson: Sliding window (Arrays). Verified on CPython 3.14. Output: "9\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Largest sum of exactly k consecutive elements.
nums = [2, 1, 5, 1, 3, 2]
k = 3
# First window: the sum of the first k elements.
window = sum(nums[:k])
best = window
# Slide: add the new right element, drop the old left one.
for i in range(k, len(nums)):
    window = window + nums[i] - nums[i - k]
    if window > best:
        best = window
print(best)`;

export const slidingWindow: LessonDefinition = {
  id: "sliding-window",
  title: "Sliding Window (Fixed Size)",
  area: "Arrays",
  prerequisites: ["array-traversal", "prefix-sums"],

  explanation: `A **sliding window** keeps a running summary of a contiguous block of the array and updates it as the block moves, instead of recomputing from scratch. This lesson finds the **largest sum of exactly k consecutive elements**.

The naive way recomputes each window's sum with its own loop: for every starting position you add up k elements, giving **O(n·k)** work. The insight: consecutive windows overlap in k-1 elements. When the window slides one step right, only two things change — one element **enters** on the right and one **leaves** on the left. So \`window = window + nums[i] - nums[i-k]\` updates the sum in **O(1)**, making the whole scan **O(n)**.

This is the **fixed-size** window (the width k never changes). A later variant is the **variable-size** window, where the two ends move independently to satisfy a condition. Recognising "contiguous block + a quantity you can update incrementally" is the cue for this pattern.`,

  vocabulary: [
    { term: "Window", definition: "A contiguous block of the array currently under consideration." },
    { term: "Fixed-size window", definition: "A window whose width k stays constant as it slides." },
    { term: "Incremental update", definition: "Adjusting a running value by the element entering and the one leaving, in O(1)." },
    { term: "Contiguous", definition: "Elements next to each other, with no gaps." },
  ],

  concepts: {
    purpose: "Sliding windows compute a property of every length-k block in one linear pass.",
    operations: "Compute the first window; then slide, adding the entering element and subtracting the leaving one.",
    uses: "Max/min/average of k consecutive items, fixed-length substring problems, moving sums.",
    tradeoffs: "O(n) time vs the naive O(n·k), at O(1) extra space — but only works when the quantity can be updated incrementally.",
    commonMistakes: "Recomputing the whole window each step (defeats the point); off-by-one in the entering/leaving indices (nums[i] enters, nums[i-k] leaves); using it when the block is not contiguous.",
    edgeCases: "k equal to the array length: only one window. k larger than n: no valid window (guard it). Negative numbers are fine for sums.",
  },

  complexity: [
    { operation: "Fixed-size window scan", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "One O(1) update per slide; naive is O(n·k)." },
  ],

  complexityExplanation: {
    variables: [
      { symbol: "n", meaning: "the number of elements in nums" },
      { symbol: "k", meaning: "the fixed window width" },
    ],
    costModel: "Each slide does a constant number of additions/subtractions and one comparison. The initial window sum touches k elements once.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "Building the first window costs O(k). Then the loop slides n-k times, each an O(1) update. Total is O(k) + O(n-k) = O(n). The naive approach recomputes each of ~n windows in O(k), giving O(n·k) — the window's incremental update is what removes the factor of k.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Only the running `window`, `best`, and loop index are kept. Nothing grows with n.",
      inputOutputNote: "nums[:k] creates a temporary length-k slice for the initial sum; it is O(k) transient, not part of the steady-state auxiliary space.",
    },
    derivation: [
      { lines: [5], description: "Initial window sum touches k elements once.", cost: "O(1)", dimension: "time" },
      { lines: [8, 9], description: "The slide loop runs n-k times, each an O(1) incremental update.", cost: "O(n)", dimension: "time" },
      { lines: [6], description: "A fixed set of running scalars.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Addition/subtraction are constant time.", "k <= n (otherwise there is no valid window and the code should guard it)."],
    tradeoffs: "The naive per-window recomputation is O(n·k) time but also O(1) space; the sliding window keeps O(1) space and cuts time to O(n).",
    counters: [{ label: "slides", definition: "executions of the slide update (line 9)", countLines: [9] }],
    fixedDataNote: "This run has n=6, k=3, so 3 slides after the first window; the answer 9 is the window [5,1,3]. The O(n) bound generalises the slide count.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: goal is the max sum of k consecutive elements." },
    { line: 2, executable: true, explanation: "Create nums = [2, 1, 5, 1, 3, 2]." },
    { line: 3, executable: true, explanation: "The window width k = 3." },
    { line: 4, executable: false, explanation: "Comment: compute the first window." },
    { line: 5, executable: true, explanation: "window = sum of nums[0:3] = 2+1+5 = 8. This one-time step is O(k)." },
    { line: 6, executable: true, explanation: "Track the best sum seen so far, starting at the first window (8)." },
    { line: 7, executable: false, explanation: "Comment: sliding adds the entering and removes the leaving element." },
    { line: 8, executable: true, explanation: "Slide the window: i is the index of the element entering on the right (from k to n-1)." },
    { line: 9, executable: true, explanation: "Update the sum in O(1): add nums[i] (enters) and subtract nums[i-k] (leaves)." },
    { line: 10, executable: true, explanation: "If this window's sum beats best, record it." },
    { line: 11, executable: true, explanation: "Update best." },
    { line: 12, executable: true, explanation: "Print the largest window sum → 9 (from [5, 1, 3])." },
  ],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [{ role: "pointer", label: "enters i", source: "i" }],
    },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "When the window slides from [2,1,5] to [1,5,1], which element enters and which leaves, and what is the new sum?", answer: "1 enters (nums[3]), 2 leaves (nums[0]); new sum 8 - 2 + 1 = 7.", explanation: "Sliding one step drops the leftmost old element (2) and adds the new right element (1): 8 - 2 + 1 = 7." },
  ],

  experiments: [
    "Change k to 2 and predict the new best.",
    "Add a large value near the end and see best update as the window reaches it.",
    "Replace the incremental update with sum(nums[i-k+1:i+1]) and note it still works but is O(n·k).",
  ],

  exercises: [
    {
      id: "sw-complete-1",
      kind: "complete-code",
      prompt: "Complete the O(1) slide update for a fixed window of width k.",
      starterCode: "for i in range(k, len(nums)):\n    # TODO: add entering nums[i], subtract leaving nums[i-k]\n    pass",
      expected: "for i in range(k, len(nums)):\n    window = window + nums[i] - nums[i - k]",
      hints: ["One element enters on the right, one leaves on the left.", "Entering is nums[i]; leaving is nums[i-k].", "window = window + nums[i] - nums[i-k]"],
    },
    {
      id: "sw-choose-1",
      kind: "choose-approach",
      prompt: "Problem: 'largest sum of exactly k consecutive elements.' Which pattern applies, and why not prefix sums or Kadane?",
      expected: "Fixed-size sliding window: the block is contiguous and of fixed width k, and the sum updates incrementally. Kadane is for any-length max subarray; prefix sums answer arbitrary ranges but are overkill for a single fixed width.",
      hints: ["Is the block length fixed or variable?", "Fixed width k → fixed-size window.", "Kadane = any length; prefix sums = arbitrary ranges — neither matches 'exactly k'."],
    },
  ],

  review: `A **fixed-size sliding window** computes a property of every length-k contiguous block by updating a running value in **O(1)** per slide (add the entering element, subtract the leaving one), turning a naive **O(n·k)** scan into **O(n)** time with **O(1)** space. The cue is "contiguous block + incrementally updatable quantity."`,

  expectedOutput: "9\n",

  references: [
    {
      url: "https://www.geeksforgeeks.org/window-sliding-technique/",
      title: "Window Sliding Technique — GeeksforGeeks",
      section: "Fixed-size window sum",
      topic: "arrays/sliding-window",
      purpose: "Confirm the incremental update (add entering, subtract leaving) and O(n) vs naive O(n·k).",
      verifiedClaims: ["Sliding a fixed window updates the sum in O(1) by adding one element and removing one"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Sliding Window",
      topic: "arrays/sliding-window",
      purpose: "Cross-check the pattern's placement and its distinction from prefix sums / Kadane.",
      verifiedClaims: ["Sliding window is a distinct fixed/variable-size pattern for contiguous blocks"],
      accessDate: "2026-09-20",
    },
  ],
};
