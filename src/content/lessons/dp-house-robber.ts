/**
 * Lesson: DP worked example — house robber (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "12\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# House robber: max money without robbing two ADJACENT houses.
# For each house, choose the better of: skip it, or rob it + best up to two back.
def rob(nums):
    prev, curr = 0, 0     # best up to house i-2 (prev) and i-1 (curr)
    for x in nums:
        prev, curr = curr, max(curr, prev + x)  # skip vs rob
    return curr

print(rob([2, 7, 9, 3, 1]))   # rob houses 2,9,1 -> 12`;

export const dpHouseRobber: LessonDefinition = {
  id: "dp-house-robber",
  title: "DP Example: House Robber",
  area: "DP and recursion",
  prerequisites: ["dp-state-transitions", "dp-climbing-stairs"],

  explanation: `**House robber** is the canonical "**take-or-skip with a constraint**" DP. Houses along a street hold amounts of money; you want the **maximum total** you can rob, but you **cannot rob two adjacent houses** (an alarm links neighbors). Greedy — "always grab the biggest" — fails, because grabbing a large house can force you to skip two others that together are worth more.

The DP comes from a **take-or-skip** decision at each house \`i\`. Let \`best(i)\` be the most you can rob considering houses \`0..i\`. Either you **skip** house \`i\`, keeping \`best(i−1)\`, or you **rob** it, earning \`nums[i]\` **plus** \`best(i−2)\` (you must skip the adjacent \`i−1\`). So \`best(i) = max(best(i−1), nums[i] + best(i−2))\`. Because each answer depends only on the previous **two**, we compress the table to two rolling variables \`prev\` (= best two houses back) and \`curr\` (= best one house back), updated together with \`prev, curr = curr, max(curr, prev + x)\`. That is **O(n)** time and **O(1)** space. For \`[2,7,9,3,1]\` the best is **12** (rob houses worth 2, 9, and 1).

This example sharpens two DP habits. First, **derive the transition from the constraint**: "adjacent forbidden" is exactly what makes the "rob" branch reach **two** back instead of one. Second, notice the family resemblance to climbing stairs — same two-term rolling recurrence, different combiner (\`max\` for optimization vs \`+\` for counting). Recognizing that "take this and jump the neighbor, or skip it" shape lets you solve many variants: house robber on a **circle** (run the linear DP twice, once excluding the first house and once the last), and "delete-and-earn" style problems that reduce to this recurrence.`,

  vocabulary: [
    { term: "Take-or-skip", definition: "At each item, choose to include it (with a constraint) or exclude it." },
    { term: "Adjacency constraint", definition: "Robbing house i forbids robbing i-1 and i+1, so 'rob' reaches two back." },
    { term: "best(i)", definition: "The maximum money robbable considering houses 0..i." },
    { term: "Rolling variables", definition: "prev and curr replace the full table since best(i) needs only best(i-1) and best(i-2)." },
    { term: "Optimization combiner", definition: "max(...) chooses the better option (vs + for counting problems)." },
  ],

  concepts: {
    purpose:
      "Model a constrained selection (no two adjacent) as a take-or-skip DP and reduce it to O(1) rolling state.",
    operations:
      "At each house apply best(i) = max(best(i-1), nums[i] + best(i-2)); carry two rolling values.",
    uses:
      "Non-adjacent selection, delete-and-earn, house robber on a circle, max-weight independent set on a path.",
    tradeoffs:
      "O(n)/O(1) and exact; greedy is faster but wrong; a full table is O(n) space and unnecessary.",
    commonMistakes:
      "Using greedy (grab the largest) — incorrect; reaching only one house back in the 'rob' branch (violates adjacency); wrong initial rolling values.",
    edgeCases:
      "Empty list → 0. Single house → that value. Two houses → the larger. The prev=curr=0 init covers all.",
  },

  complexity: [
    { operation: "house robber (rolling DP)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "One pass; two rolling variables." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of houses" }],
    costModel: "Each house does O(1) work: one addition, one max, and a paired assignment.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation:
        "The loop visits each of the n houses once, doing constant work per house, so the total time is proportional to n.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation:
        "Only prev and curr are stored, regardless of how many houses there are, because best(i) depends only on the previous two answers.",
      inputOutputNote: "The house list is the input; the single best-total integer is O(1). No table is allocated.",
    },
    derivation: [
      { lines: [4], description: "Initialise the two rolling bests — O(1).", cost: "O(1)", dimension: "time" },
      { lines: [5, 6], description: "One pass; per house a max/add and paired update.", cost: "O(n)", dimension: "time" },
      { lines: [4], description: "Two rolling variables, independent of n.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: [
      "Amounts are non-negative (skipping is never forced to a negative).",
      "Adjacency is the only constraint.",
      "max and addition are O(1).",
    ],
    tradeoffs:
      "Rolling state is optimal; a dp array is O(n) space for no gain. Greedy is O(n) but incorrect. For the circular variant, run this linear DP twice (exclude first, exclude last) and take the max.",
    counters: [
      { label: "houses processed", definition: "executions of the transition line (line 6)", countLines: [6] },
      { label: "loop iterations", definition: "executions of the loop body (line 5)", countLines: [5] },
    ],
    fixedDataNote:
      "rob([2,7,9,3,1]) processes 5 houses and returns 12. The O(n) bound describes growth with the number of houses.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: maximize money, no two adjacent houses." },
    { line: 2, executable: false, explanation: "Comment: the take-or-skip choice per house." },
    { line: 3, executable: true, explanation: "Define rob(nums)." },
    { line: 4, executable: true, explanation: "Rolling state: prev = best two houses back, curr = best one house back (both 0 initially)." },
    { line: 5, executable: true, explanation: "Process each house's amount x." },
    { line: 6, executable: true, explanation: "Transition: new best = max(skip = curr, rob = prev + x); prev becomes the old curr." },
    { line: 7, executable: true, explanation: "curr holds the best over all houses; return it." },
    { line: 8, executable: false, explanation: "Blank line." },
    { line: 9, executable: true, explanation: "Best for [2,7,9,3,1] is 12 (rob 2, 9, 1)." },
  ],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [{ role: "total", label: "curr", source: "curr" }],
    },
  ],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "Why does the 'rob it' branch add best from TWO houses back (prev), not one?",
      answer: "Because robbing house i forbids robbing the adjacent house i-1. So the best compatible total is nums[i] plus best(i-2), skipping the neighbor. Reaching only one back would allow an illegal adjacent pair.",
      explanation: "The adjacency constraint is exactly what pushes the 'rob' branch to i-2. That's how the constraint shapes the recurrence.",
    },
  ],

  experiments: [
    "Print prev and curr each step to watch the running best evolve.",
    "Try a greedy 'take the largest first' and find an input where it loses to the DP.",
    "Adapt to the circular street: run the DP on nums[1:] and nums[:-1] and take the max.",
  ],

  exercises: [
    {
      id: "dphr-complete-1",
      kind: "complete-code",
      prompt: "Complete the take-or-skip rolling transition.",
      starterCode:
        "prev, curr = 0, 0\nfor x in nums:\n    # TODO: roll forward with max(skip, rob)\n    pass\nreturn curr",
      expected:
        "prev, curr = 0, 0\nfor x in nums:\n    prev, curr = curr, max(curr, prev + x)\nreturn curr",
      hints: [
        "Skip keeps curr; rob is prev + x.",
        "Take the max of the two; prev becomes the old curr.",
        "prev, curr = curr, max(curr, prev + x)",
      ],
    },
    {
      id: "dphr-choose-1",
      kind: "choose-approach",
      prompt: "Greedy (always rob the richest available non-adjacent house) vs DP for [2,7,9,3,1] — which is correct, and what does each give?",
      expected: "DP is correct: 12 (rob 2,9,1). A naive greedy grabbing 9 first can end at 9+2 or 9+1 = 11, worse than 12. Greedy is not reliable here; use DP.",
      hints: [
        "Greedy can grab a big value and lose two others.",
        "DP considers every take/skip tradeoff.",
        "The DP total is 12.",
      ],
    },
    {
      id: "dphr-predict-1",
      kind: "predict-state",
      prompt: "Trace curr after each house for [2,7,9,3,1].",
      expected: "After 2:2, after 7:7, after 9:11, after 3:11, after 1:12. Answer 12.",
      hints: [
        "curr = max(prev skip, rob).",
        "9 combines with 2 to give 11.",
        "1 combines with 11 to give 12.",
      ],
    },
  ],

  review: `**House robber** maximizes money with **no two adjacent** houses. The **take-or-skip** transition \`best(i) = max(best(i-1), nums[i] + best(i-2))\` reaches **two** back precisely because of the adjacency constraint, and compresses to two rolling variables (\`prev, curr = curr, max(curr, prev + x)\`) for **O(n)** time, **O(1)** space. Greedy is wrong; DP is exact. The recurrence mirrors climbing stairs but combines with **max** instead of **+**. For \`[2,7,9,3,1]\` the best is **12**.`,

  expectedOutput: "12\n",

  references: [
    {
      url: "https://leetcode.com/problems/house-robber/editorial/",
      title: "House Robber — LeetCode editorial",
      section: "Take-or-skip recurrence; O(n)/O(1) rolling DP",
      topic: "dp/house-robber",
      purpose: "Confirm best(i) = max(best(i-1), nums[i] + best(i-2)), the adjacency reasoning, and the rolling O(n)/O(1) solution.",
      verifiedClaims: [
        "The maximum is max(rob i and best up to i-2, skip i and best up to i-1).",
        "It runs in O(n) time and O(1) space with two rolling variables.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://en.wikipedia.org/wiki/Maximum_weight_independent_set",
      title: "Independent set (maximum weight) — Wikipedia",
      section: "Maximum weight independent set on a path",
      topic: "dp/house-robber",
      purpose: "Cross-check that house robber is the maximum-weight independent set on a path graph, solvable by this DP.",
      verifiedClaims: [
        "Maximum-weight independent set on a path is solved by a take-or-skip DP reaching two vertices back.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "302b974dd62bea02",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
