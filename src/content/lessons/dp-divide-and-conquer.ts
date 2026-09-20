/**
 * Lesson: Recursion — divide and conquer (max subarray) (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "6\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Divide and conquer: max subarray sum. Split in half; the best subarray is
# entirely LEFT, entirely RIGHT, or CROSSES the midpoint.
def max_subarray(nums):
    def helper(lo, hi):
        if lo == hi:                 # base case: one element
            return nums[lo]
        mid = (lo + hi) // 2
        left = helper(lo, mid)       # best fully in the left half
        right = helper(mid + 1, hi)  # best fully in the right half
        s = 0                        # best sum ending at mid, extending left
        left_best = nums[mid]
        for i in range(mid, lo - 1, -1):
            s += nums[i]
            left_best = max(left_best, s)
        s = 0                        # best sum starting at mid+1, extending right
        right_best = nums[mid + 1]
        for i in range(mid + 1, hi + 1):
            s += nums[i]
            right_best = max(right_best, s)
        cross = left_best + right_best  # best subarray crossing the midpoint
        return max(left, right, cross)
    return helper(0, len(nums) - 1)

print(max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))   # subarray [4,-1,2,1] -> 6`;

export const dpDivideAndConquer: LessonDefinition = {
  id: "dp-divide-and-conquer",
  title: "Recursion: Divide and Conquer",
  area: "DP and recursion",
  prerequisites: ["dp-recursive-calls", "merge-sort"],

  explanation: `**Divide and conquer** solves a problem by three steps: **divide** it into smaller independent subproblems, **conquer** each by recursion, and **combine** their answers into the whole answer. Merge sort is the archetype (split, sort halves, merge). Here we apply the paradigm to the **maximum subarray sum**: find the contiguous slice with the largest total.

Split the array at its midpoint. The maximum subarray is then in exactly one of **three** cases: it lies **entirely in the left half**, **entirely in the right half**, or it **crosses the midpoint**. The first two are solved by **recursion** on each half. The crossing case is handled directly: from the midpoint, scan **leftward** to find the best sum ending at \`mid\`, scan **rightward** for the best sum starting at \`mid+1\`, and add them — a crossing subarray must include both \`nums[mid]\` and \`nums[mid+1]\`. The answer at each level is the **max of the three**. The base case is a single element. For \`[-2,1,-3,4,-1,2,1,-5,4]\` the best subarray is \`[4,-1,2,1]\` summing to **6**.

The cost follows the classic recurrence **T(n) = 2·T(n/2) + O(n)**: two half-size recursive calls plus an O(n) crossing scan per level. By the master theorem this is **O(n log n)** time, with **O(log n)** recursion-stack space. That's the teaching point about divide-and-conquer analysis: **count the work per level and the number of levels**. (Note: this same problem has an **O(n)** solution — Kadane's algorithm — so divide-and-conquer isn't always optimal; it's chosen here to make the paradigm and its recurrence concrete.) The "combine step does real work" structure — as opposed to backtracking, where the work is in exploring choices — is what distinguishes divide-and-conquer, and it recurs in merge sort, quickselect, closest-pair, and fast multiplication.`,

  vocabulary: [
    { term: "Divide and conquer", definition: "Split into independent subproblems, solve recursively, then combine the results." },
    { term: "Combine step", definition: "The work that merges subproblem answers (here, the crossing-subarray computation)." },
    { term: "Crossing case", definition: "A solution spanning the split point, needing both halves' contributions." },
    { term: "Recurrence T(n)=2T(n/2)+O(n)", definition: "Two half-size calls plus linear combine work per level → O(n log n)." },
    { term: "Master theorem", definition: "A rule for solving common divide-and-conquer recurrences." },
  ],

  concepts: {
    purpose:
      "Teach the divide/conquer/combine paradigm and how to analyze its recurrence, via maximum subarray.",
    operations:
      "Split at the midpoint; recurse on both halves; compute the best crossing subarray; return the max of the three.",
    uses:
      "Merge sort, quickselect, binary search, closest pair of points, Karatsuba multiplication, many geometry algorithms.",
    tradeoffs:
      "Clean recurrence and parallelizable, but the combine step and recursion have overhead; some problems have a faster non-recursive solution (here Kadane's O(n)).",
    commonMistakes:
      "Forgetting the crossing case (missing the true maximum); wrong midpoint split of the crossing scans; base case that doesn't handle a single element; comparing only left and right.",
    edgeCases:
      "Single element returns itself. All-negative arrays return the least-negative element (crossing/halves still handle it). Two elements split into two base cases plus a crossing.",
  },

  complexity: [
    { operation: "max subarray (divide & conquer)", best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(log n)", note: "T(n)=2T(n/2)+O(n); Kadane solves the same in O(n)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in nums" }],
    costModel:
      "Splitting is O(1); each level's crossing scans do O(n) total work; there are O(log n) levels of recursion.",
    time: {
      bound: "O(n log n)",
      case: "worst",
      explanation:
        "Each call splits into two half-size calls and does an O(size) crossing scan, giving T(n) = 2·T(n/2) + O(n). Across the recursion there are O(log n) levels and each level does O(n) crossing work in total, so the time is O(n log n). By the master theorem this recurrence resolves to O(n log n).",
    },
    space: {
      bound: "O(log n)",
      case: "worst",
      explanation:
        "The recursion goes at most O(log n) deep (halving each time), and each frame uses O(1) locals. No structure proportional to n is allocated; the crossing scans reuse a few variables.",
      inputOutputNote: "The single best-sum integer is O(1); the O(log n) is the recursion stack.",
    },
    derivation: [
      { lines: [5, 6], description: "Base case: a single element is returned directly.", cost: "O(1)", dimension: "time" },
      { lines: [8, 9], description: "Two recursive calls on halves — the 2·T(n/2) term.", cost: "2·T(n/2)", dimension: "time" },
      { lines: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], description: "Crossing scans are O(size) per level — the +O(n) term.", cost: "O(n) per level", dimension: "time" },
      { lines: [4], description: "Recursion depth O(log n) with O(1) frames.", cost: "O(log n)", dimension: "space" },
    ],
    assumptions: [
      "The array is non-empty (the outer call passes a valid range).",
      "The maximum subarray is left-only, right-only, or crossing — an exhaustive split.",
      "Additions/max are O(1).",
    ],
    tradeoffs:
      "Divide and conquer here is O(n log n); Kadane's algorithm solves the same problem in O(n) time and O(1) space. The D&C version is used to teach the paradigm and its recurrence, not because it is optimal.",
    counters: [
      { label: "recursive calls", definition: "executions of the left-half call (line 8)", countLines: [8] },
      { label: "crossing scan steps", definition: "executions of the left crossing-scan body (line 13)", countLines: [13] },
    ],
    fixedDataNote:
      "For the 9-element sample the best subarray is [4,-1,2,1] = 6. The O(n log n) bound describes how the split-and-combine work scales with n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: split in half; three cases for the best subarray." },
    { line: 2, executable: false, explanation: "Comment continued." },
    { line: 3, executable: true, explanation: "Define max_subarray(nums)." },
    { line: 4, executable: true, explanation: "Inner recursive helper over the index range [lo, hi]." },
    { line: 5, executable: true, explanation: "Base case: a single element." },
    { line: 6, executable: true, explanation: "Return that element's value." },
    { line: 7, executable: true, explanation: "Split point." },
    { line: 8, executable: true, explanation: "Recurse: best subarray entirely in the left half." },
    { line: 9, executable: true, explanation: "Recurse: best subarray entirely in the right half." },
    { line: 10, executable: true, explanation: "Prepare to scan left from the midpoint." },
    { line: 11, executable: true, explanation: "Seed the left crossing best with nums[mid]." },
    { line: 12, executable: true, explanation: "Scan leftward from mid down to lo." },
    { line: 13, executable: true, explanation: "Accumulate the running sum..." },
    { line: 14, executable: true, explanation: "...tracking the best sum ending at mid." },
    { line: 15, executable: true, explanation: "Prepare to scan right from mid+1." },
    { line: 16, executable: true, explanation: "Seed the right crossing best with nums[mid+1]." },
    { line: 17, executable: true, explanation: "Scan rightward from mid+1 to hi." },
    { line: 18, executable: true, explanation: "Accumulate the running sum..." },
    { line: 19, executable: true, explanation: "...tracking the best sum starting at mid+1." },
    { line: 20, executable: true, explanation: "The crossing subarray's best is the two halves' bests added." },
    { line: 21, executable: true, explanation: "Return the maximum of left-only, right-only, and crossing." },
    { line: 22, executable: true, explanation: "Kick off the recursion over the whole array." },
    { line: 23, executable: false, explanation: "Blank line." },
    { line: 24, executable: true, explanation: "Best subarray of the sample is [4,-1,2,1] summing to 6." },
  ],

  bindings: [{ variable: "nums", model: "array" }],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "Why must we handle a 'crossing' case separately instead of just taking max(left, right)?",
      answer: "The optimal subarray might straddle the midpoint — using elements from both halves — which neither the left-only nor right-only recursion considers. The crossing scan computes that spanning case so no candidate is missed.",
      explanation: "Splitting the array leaves a third possibility the halves can't see: a subarray crossing the split. Ignoring it can miss the true maximum.",
    },
  ],

  experiments: [
    "Print lo, hi, and the three candidate values at each level to watch the combine step.",
    "Solve the same problem with Kadane's algorithm in O(n) and compare results.",
    "Draw the recursion tree and confirm O(log n) depth and O(n) work per level.",
  ],

  exercises: [
    {
      id: "dpdc-complete-1",
      kind: "complete-code",
      prompt: "Complete the return so it considers all three cases.",
      starterCode:
        "left = helper(lo, mid)\nright = helper(mid + 1, hi)\ncross = left_best + right_best\n# TODO: return the best of the three cases\n",
      expected:
        "left = helper(lo, mid)\nright = helper(mid + 1, hi)\ncross = left_best + right_best\nreturn max(left, right, cross)",
      hints: [
        "Three candidates: left-only, right-only, crossing.",
        "Return the largest.",
        "return max(left, right, cross)",
      ],
    },
    {
      id: "dpdc-choose-1",
      kind: "choose-approach",
      prompt: "You need maximum subarray sum on a huge array with tight time limits. Divide-and-conquer O(n log n) or Kadane's O(n)?",
      expected: "Kadane's O(n): it's asymptotically faster and O(1) space. Divide-and-conquer (O(n log n)) is great for teaching the paradigm but not the fastest here.",
      hints: [
        "Compare O(n log n) vs O(n).",
        "One is linear.",
        "Kadane wins on speed and space.",
      ],
    },
    {
      id: "dpdc-predict-1",
      kind: "predict-state",
      prompt: "For [-2,1,-3,4,-1,2,1,-5,4], which contiguous subarray is optimal and what is its sum?",
      expected: "[4, -1, 2, 1] with sum 6.",
      hints: [
        "Look near the 4 in the middle.",
        "Include the small negatives that pay off.",
        "4 - 1 + 2 + 1 = 6.",
      ],
    },
  ],

  review: `**Divide and conquer** = **divide** into subproblems, **conquer** by recursion, **combine** the results. Maximum subarray splits at the midpoint into three cases — **left-only, right-only, crossing** — recursing on the halves and computing the crossing directly, returning their max. Its recurrence **T(n)=2T(n/2)+O(n)** gives **O(n log n)** time, **O(log n)** stack. The combine step doing real work is the paradigm's signature (contrast backtracking). Note Kadane solves the same in **O(n)**. The sample's best is **6**.`,

  expectedOutput: "6\n",

  references: [
    {
      url: "https://en.wikipedia.org/wiki/Maximum_subarray_problem#Computing_the_best_subarray's_position",
      title: "Maximum subarray problem — Wikipedia",
      section: "Divide-and-conquer solution (three cases)",
      topic: "dp/divide-and-conquer",
      purpose: "Confirm the three-case divide-and-conquer maximum-subarray method and its O(n log n) time; note Kadane's O(n) alternative.",
      verifiedClaims: [
        "The maximum subarray is entirely in the left half, entirely in the right half, or crosses the midpoint.",
        "The divide-and-conquer solution runs in O(n log n); Kadane's algorithm runs in O(n).",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/lecture-notes/",
      title: "Introduction to Algorithms 6.006 — Divide and Conquer (MIT OCW)",
      section: "Recurrences and the master theorem",
      topic: "dp/divide-and-conquer",
      purpose: "Cross-check that T(n) = 2T(n/2) + O(n) resolves to O(n log n) by the master theorem.",
      verifiedClaims: [
        "The recurrence T(n) = 2T(n/2) + O(n) has solution O(n log n).",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "e8b2d9cafcb7dca8",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
