/**
 * Pattern: Sliding window.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2). Output "9\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# Fixed-size sliding window: largest sum of k CONSECUTIVE elements.
def max_sum_k(nums, k):
    window = sum(nums[:k])       # sum the first window once
    best = window
    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]  # add entering, drop leaving — O(1)
        best = max(best, window)
    return best

print(max_sum_k([2, 1, 5, 1, 3, 2], 3))  # window [5,1,3] = 9`;

export const slidingWindowPattern: PatternDefinition = {
  id: "sliding-window",
  title: "Sliding Window",
  category: "Arrays & strings",
  summary:
    "Maintain a moving window over a sequence and update its aggregate in O(1) per step instead of recomputing it.",

  clues: [
    "The input is a contiguous run of an array or string (a subarray/substring), not an arbitrary subset.",
    "You want the best/longest/shortest window, or a count of windows, satisfying a condition.",
    "The condition is about a window aggregate: a sum, a count, a set of distinct characters, a max/min.",
    "Phrases like 'exactly k consecutive', 'at most k distinct', 'longest substring without…'.",
    "A brute-force over all windows would recompute overlapping work.",
  ],

  naiveApproach: `Enumerate every window explicitly. For a fixed size k, that is \`for start in range(n-k+1): sum(nums[start:start+k])\` — each sum re-adds k elements, so recomputing all windows is **O(n·k)**. For variable-size windows, checking every (start, end) pair and re-scanning each is **O(n²)** or worse. The wasted work is that adjacent windows overlap almost entirely, yet the naive code re-reads that overlap every time.`,

  whyItHelps: `A window shares all but its two ends with the previous window. So instead of recomputing the aggregate, **update it incrementally**: when the window slides right, **add the entering element and subtract the leaving one** (for a fixed size), or **grow the right edge and shrink the left edge** while a condition holds (for a variable size). Each element enters and leaves the window at most once, so the whole scan is **O(n)** with **O(1)** (fixed) or O(window) auxiliary state — a large improvement over the naive recomputation.`,

  conditions: [
    "The answer is over CONTIGUOUS windows (subarrays/substrings), not arbitrary subsets or subsequences.",
    "The window aggregate can be updated incrementally as elements enter/leave (sum, count, a frequency map).",
    "For the variable-size version, the condition must be MONOTONE: once a window is invalid, shrinking from the left is the right fix (e.g. 'at most k distinct', 'sum ≤ target' with non-negative values).",
  ],

  alternatives: [
    "Prefix sums + hashmap — when the array has NEGATIVE numbers and you need range sums; a pure window's monotonicity breaks (see the prefix-sums pattern).",
    "Two pointers — a close cousin; sliding window is the special case where both pointers move over one sequence maintaining a window aggregate.",
    "Kadane's algorithm — for 'largest sum of ANY contiguous subarray' (no fixed size and negatives allowed), a window won't work; Kadane does.",
  ],

  counterexamples: [
    "'Count subarrays summing to k' with NEGATIVE numbers: growing/shrinking a window is not monotone (adding an element can decrease the sum), so a window gives wrong answers — use prefix sums + a hashmap.",
    "'Largest sum of any contiguous subarray' (size not fixed, negatives allowed): there is no window size to slide — use Kadane's algorithm.",
    "Problems about subsequences (non-contiguous) — a window only sees contiguous ranges.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "9\n",
  complexityNote:
    "O(n) time: the first window costs O(k) once, then each of the remaining n−k slides is O(1). O(1) auxiliary space for the running sum. The naive per-window recompute is O(n·k).",

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of elements in nums" },
      { symbol: "k", meaning: "the fixed window width" },
    ],
    costModel: "Each slide does a constant number of additions and one comparison. The first window is summed once over k elements.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "Summing the first window (line 3) is O(k). The slide loop (lines 5-7) runs n-k times, each an O(1) update. Total O(k) + O(n-k) = O(n). The naive per-window recompute would be O(n·k).",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Only the running `window` and `best` scalars are kept; nothing grows with n.",
      inputOutputNote: "nums (n elements) is the input; there is no auxiliary array. Note the sum(nums[:k]) here allocates a transient O(k) slice — the fixed-window LESSON avoids it with explicit accumulation for a strict O(1)-aux claim.",
    },
    derivation: [
      { lines: [3], description: "Sum the first window over k elements once.", cost: "O(k)", dimension: "time" },
      { lines: [5, 6, 7], description: "Slide n-k times, each an O(1) add-entering/subtract-leaving update.", cost: "O(n)", dimension: "time" },
      { lines: [3, 4], description: "A fixed set of running scalars.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Addition and comparison are O(1).", "0 < k <= len(nums) (a valid window exists)."],
    tradeoffs: "The naive per-window recompute is O(n·k) time. Prefix sums are a valid alternative (O(n) time, O(n) space); the window is preferred for its O(1) auxiliary space.",
    counters: [{ label: "slides", definition: "executions of the slide update (line 6)", countLines: [6] }],
    fixedDataNote: "This run has n=6, k=3, so 3 slides after the first window; the answer 9 is [5,1,3]. The O(n) bound generalises the slide count.",
  },

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: fixed-size window over k consecutive elements." },
    { line: 2, executable: true, explanation: "Define max_sum_k(nums, k)." },
    { line: 3, executable: true, explanation: "Sum the first window of size k once (the only O(k) step)." },
    { line: 4, executable: true, explanation: "Track the best window sum seen." },
    { line: 5, executable: true, explanation: "Slide the window one step at a time from index k to the end." },
    { line: 6, executable: true, explanation: "Update in O(1): add the entering element nums[i], subtract the leaving element nums[i-k]." },
    { line: 7, executable: true, explanation: "Record the best window sum." },
    { line: 8, executable: true, explanation: "Return the maximum window sum." },
    { line: 9, executable: false, explanation: "Blank line." },
    { line: 10, executable: true, explanation: "The best 3-length window of [2,1,5,1,3,2] is [5,1,3] = 9." },
  ],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [
        { role: "window", label: "window", source: "i" },
        { role: "total", label: "best", source: "best" },
      ],
    },
  ],

  linkedLessons: ["sliding-window", "string-sliding-window"],

  exercises: [
    {
      id: "pat-sw-recognize-1",
      kind: "choose-approach",
      prompt:
        "Which technique fits: 'Given an array of integers and a number k, find the largest sum of exactly k consecutive elements'?",
      expected:
        "Fixed-size sliding window. The window size is fixed at k and the target is over contiguous elements, so slide the window updating the sum in O(1) (add entering, drop leaving) for an O(n) solution.",
      correctPatternId: "sliding-window",
      hints: [
        "The elements must be consecutive and the count is fixed.",
        "Adjacent windows overlap in k-1 elements.",
        "Add the entering element and subtract the leaving one each step.",
      ],
    },
    {
      id: "pat-sw-recognize-2",
      kind: "choose-approach",
      prompt:
        "Recognize (no label given): 'Find the length of the longest substring with at most 2 distinct characters.' What pattern, and why?",
      expected:
        "Variable-size sliding window with a frequency map. Grow the right edge; when distinct-count exceeds 2, shrink the left edge until valid again. The 'at most k distinct' condition is monotone, so shrinking from the left restores validity. O(n).",
      correctPatternId: "sliding-window",
      hints: [
        "The window size is not fixed here.",
        "'At most k distinct' is a monotone condition.",
        "Grow right; shrink left when the condition breaks.",
      ],
    },
    {
      id: "pat-sw-fix-1",
      kind: "fix-mistake",
      prompt:
        "This fixed-window sum recomputes each window from scratch (O(n·k)). Make it O(n).",
      starterCode:
        "def max_sum_k(nums, k):\n    best = sum(nums[:k])\n    for start in range(1, len(nums) - k + 1):\n        best = max(best, sum(nums[start:start + k]))\n    return best",
      expected:
        "def max_sum_k(nums, k):\n    window = sum(nums[:k])\n    best = window\n    for i in range(k, len(nums)):\n        window += nums[i] - nums[i - k]\n        best = max(best, window)\n    return best",
      hints: [
        "sum(nums[start:start+k]) re-adds k elements every step.",
        "Adjacent windows differ by only two elements.",
        "Keep a running sum: window += nums[i] - nums[i-k].",
      ],
    },
  ],

  references: [
    {
      url: "https://github.com/ashishps1/awesome-leetcode-resources",
      title: "Awesome LeetCode Resources — patterns (sliding window)",
      section: "Sliding window pattern",
      topic: "patterns/sliding-window",
      purpose:
        "Cross-check the recognition clues (contiguous windows, fixed vs variable size) and the incremental-update idea.",
      verifiedClaims: [
        "Sliding window applies to contiguous subarray/substring problems and updates the window aggregate incrementally for O(n).",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://en.wikipedia.org/wiki/Sliding_window_protocol",
      title: "Sliding window (technique) — background",
      section: "Windowing concept",
      topic: "patterns/sliding-window",
      purpose: "General background on the moving-window concept adapted to array/string scanning.",
      verifiedClaims: ["A window advances over a sequence, admitting and evicting elements at its edges."],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "d7f53d112061c1d0",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
