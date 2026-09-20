/**
 * Lesson: DP worked example — longest increasing subsequence (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "4\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Longest strictly increasing subsequence (elements need not be contiguous).
def lis(nums):
    if not nums:
        return 0
    dp = [1] * len(nums)          # dp[i] = length of the longest LIS ENDING at i
    for i in range(len(nums)):
        for j in range(i):
            if nums[j] < nums[i] and dp[j] + 1 > dp[i]:
                dp[i] = dp[j] + 1  # extend the best subsequence ending at j
    return max(dp)                # longest over all endpoints

print(lis([10, 9, 2, 5, 3, 7, 101, 18]))   # 2,3,7,101 (or 2,5,7,18) -> 4`;

export const dpLis: LessonDefinition = {
  id: "dp-lis",
  title: "DP Example: Longest Increasing Subsequence",
  area: "DP and recursion",
  prerequisites: ["dp-subsequences", "dp-1d-2d"],

  explanation: `The **longest increasing subsequence (LIS)** is the length of the longest subsequence whose values **strictly increase** — remembering from the subsequences lesson that a subsequence keeps order but may **skip** elements (it need not be contiguous). For \`[10,9,2,5,3,7,101,18]\`, one longest increasing subsequence is \`2,3,7,101\` (length **4**); \`2,5,7,18\` also works.

The DP defines a **1D** table with a carefully chosen state: \`dp[i]\` = the length of the longest increasing subsequence that **ends exactly at index i**. Anchoring at "ends at i" is what makes the subproblems combine. To fill \`dp[i]\`, look at every earlier index \`j < i\`; if \`nums[j] < nums[i]\`, then any increasing subsequence ending at \`j\` can be **extended** by \`nums[i]\`, giving a candidate length \`dp[j] + 1\`. Take the best such candidate (or 1 if none, since \`nums[i]\` alone is a length-1 subsequence). The final answer is the **maximum over all endpoints**, \`max(dp)\` — not \`dp[-1]\`, because the longest subsequence can end anywhere.

This is **O(n²)** time (each \`i\` scans all earlier \`j\`) and **O(n)** space. Two teaching points stand out. First, the **state choice** ("ends at i") is the crux — a vaguer "longest so far" state doesn't compose, which is why beginners get stuck here. Second, LIS has a faster **O(n log n)** solution using binary search / patience sorting (worth knowing exists), but the O(n²) DP is the clearest way to *understand* why the recurrence is correct. The "extend the best compatible earlier answer" idea reappears in longest chains, box stacking, and similar ordering DPs.`,

  vocabulary: [
    { term: "Increasing subsequence", definition: "A subsequence whose values strictly increase (order kept, gaps allowed)." },
    { term: "dp[i] (ends at i)", definition: "The length of the longest increasing subsequence that ends exactly at index i." },
    { term: "Extend", definition: "Appending nums[i] to a shorter increasing subsequence ending at an earlier smaller value." },
    { term: "Answer over endpoints", definition: "max(dp) — the longest subsequence can end at any index, not the last." },
    { term: "Patience sorting", definition: "An O(n log n) LIS method using binary search (mentioned, not required here)." },
  ],

  concepts: {
    purpose:
      "Find the longest strictly increasing subsequence and practice choosing an anchored state that composes.",
    operations:
      "For each i, take dp[i] = 1 + max(dp[j]) over j < i with nums[j] < nums[i]; answer is max(dp).",
    uses:
      "Longest chains/box-stacking, activity ordering, versioning, and any 'longest ordered pick' problem.",
    tradeoffs:
      "O(n²) DP is clear and easy to justify; an O(n log n) binary-search method is faster but less transparent.",
    commonMistakes:
      "Returning dp[-1] instead of max(dp); using <= (allows equal, not strictly increasing); a vague state that doesn't anchor at an endpoint.",
    edgeCases:
      "Empty input → 0. Strictly decreasing → 1 (each element alone). All equal → 1 (strict increase forbids equals).",
  },

  complexity: [
    { operation: "LIS (O(n²) DP)", best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(n)", note: "Each i scans all earlier j; an O(n log n) method also exists." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in nums" }],
    costModel: "Each (i, j) pair does O(1) work (a comparison and a possible update).",
    time: {
      bound: "O(n²)",
      case: "worst",
      explanation:
        "For each index i (n of them), the inner loop scans all earlier indices j (up to i), so the total number of pairs is about n²/2 = O(n²). Each pair is constant work. A binary-search / patience-sorting method improves this to O(n log n), but the pairwise DP is the clearest correctness argument.",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation:
        "The dp array stores one length per index: O(n). No other structure grows with the input.",
      inputOutputNote: "The single integer length is O(1); the O(n) space is the dp table.",
    },
    derivation: [
      { lines: [5], description: "Allocate dp (each element alone is length 1).", cost: "O(n)", dimension: "space" },
      { lines: [6, 7, 8, 9], description: "Nested loops over all pairs i, j < i with O(1) work.", cost: "O(n²)", dimension: "time" },
      { lines: [10], description: "Take the maximum over all endpoints — O(n).", cost: "O(n)", dimension: "time" },
    ],
    assumptions: [
      "Strictly increasing (uses <, not <=).",
      "dp[i] correctly anchors the subsequence's endpoint at i so subproblems compose.",
      "Comparisons are O(1).",
    ],
    tradeoffs:
      "The O(n²) DP is the transparent version; the O(n log n) patience-sorting method is faster for large n but harder to justify. If you only need the length for moderate n, the DP is fine and easy to reason about.",
    counters: [
      { label: "pair comparisons", definition: "executions of the inner-loop check (line 8)", countLines: [8] },
      { label: "dp improvements", definition: "executions of the update line (line 9)", countLines: [9] },
    ],
    fixedDataNote:
      "For the 8-element sample the LIS length is 4. The O(n²) bound describes how the pairwise work scales with n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: strictly increasing, non-contiguous allowed." },
    { line: 2, executable: true, explanation: "Define lis(nums)." },
    { line: 3, executable: true, explanation: "Guard the empty input." },
    { line: 4, executable: true, explanation: "An empty list has LIS length 0." },
    { line: 5, executable: true, explanation: "dp[i] starts at 1: each element alone is a length-1 subsequence." },
    { line: 6, executable: true, explanation: "Consider each endpoint i." },
    { line: 7, executable: true, explanation: "Look at every earlier index j." },
    { line: 8, executable: true, explanation: "If nums[j] < nums[i], the subsequence ending at j can extend to i and would be longer..." },
    { line: 9, executable: true, explanation: "...so update dp[i] to dp[j] + 1." },
    { line: 10, executable: true, explanation: "The LIS length can end anywhere: take the maximum over all dp[i]." },
    { line: 11, executable: false, explanation: "Blank line." },
    { line: 12, executable: true, explanation: "For the sample the answer is 4." },
  ],

  bindings: [
    {
      variable: "dp",
      model: "dp-table",
      // Outer loop index `i` is the cell being filled (LIS ending at i).
      overlays: [{ role: "pointer", label: "i", source: "i" }],
    },
  ],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "Why is the answer max(dp) rather than dp[-1] (the value for the last element)?",
      answer: "Because dp[i] is the longest increasing subsequence ENDING at i, and the overall longest can end at any index — not necessarily the last one. So we take the maximum over all endpoints.",
      explanation: "The anchored state means each dp[i] is a per-endpoint answer; the global LIS is the best across all endpoints, hence max(dp).",
    },
  ],

  experiments: [
    "Print dp to see the longest-ending-here length at each index.",
    "Change < to <= and observe the (incorrect) effect on non-strict sequences.",
    "Look up the O(n log n) patience-sorting method and compare its output on the same input.",
  ],

  exercises: [
    {
      id: "dplis-complete-1",
      kind: "complete-code",
      prompt: "Complete the inner loop that extends earlier subsequences.",
      starterCode:
        "for i in range(len(nums)):\n    for j in range(i):\n        # TODO: if nums[j] < nums[i], try to extend\n        pass\nreturn max(dp)",
      expected:
        "for i in range(len(nums)):\n    for j in range(i):\n        if nums[j] < nums[i] and dp[j] + 1 > dp[i]:\n            dp[i] = dp[j] + 1\nreturn max(dp)",
      hints: [
        "Only extend when nums[j] < nums[i].",
        "Extending gives length dp[j] + 1.",
        "Keep it only if it's longer than dp[i].",
      ],
    },
    {
      id: "dplis-fix-1",
      kind: "fix-mistake",
      prompt: "This returns the length ending at the last index instead of the true LIS. Fix the return.",
      starterCode:
        "for i in range(len(nums)):\n    for j in range(i):\n        if nums[j] < nums[i] and dp[j] + 1 > dp[i]:\n            dp[i] = dp[j] + 1\nreturn dp[-1]",
      expected:
        "for i in range(len(nums)):\n    for j in range(i):\n        if nums[j] < nums[i] and dp[j] + 1 > dp[i]:\n            dp[i] = dp[j] + 1\nreturn max(dp)",
      hints: [
        "dp[i] is the LIS ending at i.",
        "The best can end anywhere.",
        "return max(dp)",
      ],
    },
    {
      id: "dplis-predict-1",
      kind: "predict-state",
      prompt: "For [10,9,2,5,3,7,101,18], give one longest increasing subsequence and its length.",
      expected: "2,3,7,101 (or 2,5,7,18) — length 4.",
      hints: [
        "Skip the early 10, 9.",
        "Build up from 2.",
        "Four elements increase.",
      ],
    },
  ],

  review: `**LIS** is the length of the longest **strictly increasing** subsequence (order kept, gaps allowed). The key is the **anchored state** \`dp[i]\` = longest increasing subsequence **ending at i**; fill it by extending the best compatible earlier index (\`dp[j] + 1\` where \`nums[j] < nums[i]\`), and return **max(dp)** since the best can end anywhere. It's **O(n²)** time, **O(n)** space (an O(n log n) method also exists). For the sample the answer is **4**.`,

  expectedOutput: "4\n",

  references: [
    {
      url: "https://leetcode.com/problems/longest-increasing-subsequence/editorial/",
      title: "Longest Increasing Subsequence — LeetCode editorial",
      section: "O(n²) DP (dp[i] ends at i) and O(n log n) binary search",
      topic: "dp/lis",
      purpose: "Confirm the dp[i]-ends-at-i recurrence, the max(dp) answer, O(n²) time, and the existence of an O(n log n) method.",
      verifiedClaims: [
        "dp[i] = 1 + max(dp[j]) for j < i with nums[j] < nums[i]; the answer is max(dp).",
        "The DP is O(n²); an O(n log n) approach also exists.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://en.wikipedia.org/wiki/Longest_increasing_subsequence",
      title: "Longest increasing subsequence — Wikipedia",
      section: "Definition and dynamic-programming solution",
      topic: "dp/lis",
      purpose: "Cross-check the definition and the standard DP formulation.",
      verifiedClaims: [
        "The LIS is the longest subsequence with strictly increasing values, computable by an O(n²) DP.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "52776e6f9b309965",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
