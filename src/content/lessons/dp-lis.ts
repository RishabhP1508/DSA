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
  "purpose": "Find the longest strictly increasing subsequence and practice choosing an anchored state that composes.",
  "operations": "For each i, take dp[i] = 1 + max(dp[j]) over j < i with nums[j] < nums[i]; answer is max(dp).",
  "uses": "Longest chains/box-stacking, activity ordering, versioning, and any 'longest ordered pick' problem.",
  "tradeoffs": "O(n²) DP is clear and easy to justify; an O(n log n) binary-search method is faster but less transparent.",
  "commonMistakes": "Returning dp[-1] instead of max(dp); using <= (allows equal, not strictly increasing); a vague state that doesn't anchor at an endpoint.",
  "edgeCases": "Empty input → 0. Strictly decreasing → 1 (each element alone). All equal → 1 (strict increase forbids equals). Values must support a consistent finite total order; this integer example excludes NaN. Equal values are not a strictly increasing step."
},

  complexity: [
    { operation: "LIS (O(n²) DP)", best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(n)", note: "Each i scans all earlier j; an O(n log n) method also exists." },
  ],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in nums"
    }
  ],
  "costModel": "Each (i, j) pair does O(1) work (a comparison and a possible update). The double loop performs n(n−1)/2 predecessor comparisons regardless of input order; list allocation is O(n).",
  "time": {
    "bound": "O(n²)",
    "case": "worst",
    "explanation": "For each index i (n of them), the inner loop scans all earlier indices j (up to i), so the total number of pairs is about n²/2 = O(n²). Each pair is constant work. A binary-search / patience-sorting method improves this to O(n log n), but the pairwise DP is the clearest correctness argument."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The dp array stores one length per index: O(n). No other structure grows with the input.",
    "inputOutputNote": "The single integer length is O(1); the O(n) space is the dp table."
  },
  "derivation": [
    {
      "lines": [
        5
      ],
      "description": "Allocate dp (each element alone is length 1).",
      "cost": "O(n)",
      "dimension": "space"
    },
    {
      "lines": [
        6,
        7,
        8,
        9
      ],
      "description": "Nested loops over all pairs i, j < i with O(1) work.",
      "cost": "O(n²)",
      "dimension": "time"
    },
    {
      "lines": [
        10
      ],
      "description": "Take the maximum over all endpoints — O(n).",
      "cost": "O(n)",
      "dimension": "time"
    }
  ],
  "assumptions": [
    "Strictly increasing (uses <, not <=).",
    "dp[i] correctly anchors the subsequence's endpoint at i so subproblems compose.",
    "Comparisons are O(1).",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "The O(n²) DP is the transparent version; the O(n log n) patience-sorting method is faster for large n but harder to justify. If you only need the length for moderate n, the DP is fine and easy to reason about.",
  "counters": [
    {
      "label": "pair comparisons",
      "definition": "executions of the inner-loop check Recorded line entries at 8 occur before the operation completes.",
      "countLines": [
        8
      ]
    },
    {
      "label": "dp improvements",
      "definition": "executions of the update line Recorded line entries at 9 occur before the operation completes.",
      "countLines": [
        9
      ]
    }
  ],
  "fixedDataNote": "For the 8-element sample the LIS length is 4. The O(n²) bound describes how the pairwise work scales with n. Function analysis excludes demonstration input literals, imports, printing and tracer storage. A line event shows the next operation before it completes."
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
      prompt: "Complete `lis(nums)`: length of the longest strictly increasing subsequence.",
      starterCode:
        "def lis(nums):\n    if not nums:\n        return 0\n    dp = [1] * len(nums)\n    for i in range(len(nums)):\n        for j in range(i):\n            # TODO: if nums[j] < nums[i], try to extend\n            pass\n    return max(dp)",
      expected:
        "def lis(nums):\n    if not nums:\n        return 0\n    dp = [1] * len(nums)\n    for i in range(len(nums)):\n        for j in range(i):\n            if nums[j] < nums[i] and dp[j] + 1 > dp[i]:\n                dp[i] = dp[j] + 1\n    return max(dp)",
      hints: [
        "Only extend when nums[j] < nums[i].",
        "Extending gives length dp[j] + 1.",
        "Keep it only if it's longer than dp[i].",
      ],
    },
    {
      id: "dplis-fix-1",
      kind: "fix-mistake",
      prompt: "`lis(nums)` returns the LIS length. This returns the length ending at the LAST index instead of the overall best. Fix the return.",
      starterCode:
        "def lis(nums):\n    if not nums:\n        return 0\n    dp = [1] * len(nums)\n    for i in range(len(nums)):\n        for j in range(i):\n            if nums[j] < nums[i] and dp[j] + 1 > dp[i]:\n                dp[i] = dp[j] + 1\n    return dp[-1]",
      expected:
        "def lis(nums):\n    if not nums:\n        return 0\n    dp = [1] * len(nums)\n    for i in range(len(nums)):\n        for j in range(i):\n            if nums[j] < nums[i] and dp[j] + 1 > dp[i]:\n                dp[i] = dp[j] + 1\n    return max(dp)",
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
    "url": "https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex",
    "title": "Python 3.14 numeric types",
    "section": "Numeric Types — int, float, complex",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage."
    ],
    "conventions": [
      "Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/28461a74f81101874a13d9679a40584d_MIT6_006S20_lec16.pdf",
    "title": "MIT 6.006 lecture 16",
    "section": "Longest increasing subsequence state and recurrence",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "LIS fixes an endpoint/anchor so recurrence choices compose; taking the best over all anchors yields O(n²) DP."
    ],
    "conventions": [
      "Source anchors the start in a suffix, app anchors the end of a prefix. Both require strict increase."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://leetcode.com/problems/longest-increasing-subsequence/description/",
    "title": "LeetCode: Longest Increasing Subsequence",
    "section": "Problem definition, examples and constraints",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "The sequence is strictly increasing; equal values cannot extend it; O(n log n) alternatives exist."
    ],
    "conventions": [],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "44cd16b63e5d0caa",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
