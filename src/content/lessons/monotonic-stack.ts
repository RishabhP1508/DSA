/**
 * Lesson: Monotonic stack (Stacks and queues). Verified on CPython 3.14.
 * Output: "[4, 2, 4, -1, -1]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Next Greater Element using a monotonic (decreasing) stack.
def next_greater(nums):
    res = [-1] * len(nums)
    stack = []  # holds indices whose answer is still unknown
    for i in range(len(nums)):
        # While the current value beats the value at the stack's top index,
        # we've found that index's next greater element.
        while stack and nums[stack[-1]] < nums[i]:
            j = stack.pop()
            res[j] = nums[i]
        stack.append(i)
    return res

print(next_greater([2, 1, 2, 4, 3]))`;

export const monotonicStack: LessonDefinition = {
  id: "monotonic-stack",
  title: "Monotonic Stack",
  area: "Stacks and queues",
  prerequisites: ["stack-queue-operations"],

  explanation: `A **monotonic stack** is a stack you deliberately keep **sorted** (either always increasing or always decreasing) by popping elements that would break the order before you push. It is the go-to tool for **"next greater / next smaller element"** and span problems, turning an obvious **O(n²)** double loop into a single **O(n)** pass.

Here we solve **Next Greater Element**: for each value, find the first larger value to its right. We keep a stack of **indices whose answer we haven't found yet**, with their values **decreasing** from bottom to top. When a new value \`nums[i]\` arrives, it is the "next greater" for every stacked index whose value is smaller — so we pop those and record \`nums[i]\` as their answer. Then we push \`i\`.

The magic of the O(n) bound: although there is a \`while\` inside the \`for\`, **each index is pushed once and popped at most once** across the entire run. Total pushes + pops ≤ 2n, so the whole thing is linear despite the nested loop. Recognising "for each element, find the nearest bigger/smaller one" is the cue to reach for a monotonic stack.

**A harder application — "Largest Rectangle in Histogram".** Here bars have heights and you want the largest axis-aligned rectangle. Use a stack of bar **indices kept INCREASING by height** (the opposite direction from next-greater). When a bar \`heights[i]\` is **shorter** than the bar on top, that top bar can extend no further right, so you **pop it and compute its rectangle**: its height is \`heights[popped]\`, and its **width** spans from just after the new stack top up to \`i−1\`. Concretely the width is \`i − stack[-1] − 1\` after popping (or \`i\` if the stack is now empty, meaning the popped bar was the shortest so far and stretches all the way left). Keep the largest area seen. **Correctness condition:** you must **flush the stack at the end** as if a sentinel bar of height 0 arrived at index \`n\`, so every bar still on the stack gets its rectangle measured; without that flush, bars that are never "closed" by a shorter bar are missed. Each index is pushed and popped once, so it is still **O(n)** time and **O(n)** space.`,

  vocabulary: [
    { term: "Monotonic stack", definition: "A stack kept entirely increasing or decreasing by popping order-breaking elements." },
    { term: "Next greater element", definition: "The first element to the right that is larger than the current one." },
    { term: "Pending indices", definition: "Indices on the stack still waiting for their answer." },
    { term: "Amortized linear", definition: "Each element is pushed and popped at most once, so total work is O(n)." },
  ],

  concepts: {
    purpose: "Find nearest greater/smaller elements (or spans) for every position in one linear pass.",
    operations: "Maintain a monotonic stack of indices; pop while the order would break, resolving answers; push the current index.",
    uses: "Next/previous greater or smaller element, stock span, daily temperatures, largest rectangle in histogram.",
    tradeoffs: "O(n) time and O(n) stack space; replaces the naive O(n²) pairwise scan.",
    commonMistakes: "Storing values instead of indices when you need positions; wrong comparison direction (< vs >) for greater vs smaller; assuming it's O(n²) because of the nested while.",
    edgeCases: "Elements with no greater element keep -1. Duplicates: use < (not <=) to define 'strictly greater'. Empty input returns [].",
  },

  complexity: [
    { operation: "Next greater (monotonic stack)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)", note: "Each index pushed/popped once; stack up to O(n)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in nums" }],
    costModel: "Each push and each pop is O(1). The total number of stack operations bounds the work.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "There is a while loop inside the for loop, which looks quadratic — but it is NOT. Each index is pushed exactly once (line 11) and popped at most once (line 9) over the whole run, so the total number of push/pop operations is at most 2n. The outer loop runs n times. Summed, all the work is O(n) — this is amortized analysis: the inner while can only undo pushes that already happened.",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "The stack can hold up to n indices at once (e.g. a strictly decreasing input where nothing gets popped until the end), and the result array is size n.",
      inputOutputNote: "The res array of n answers is required output; the stack of up to n indices is the auxiliary structure.",
    },
    derivation: [
      { lines: [5], description: "The outer loop runs n times.", cost: "O(n)", dimension: "time" },
      { lines: [8, 9, 10, 11], description: "Each index is pushed once and popped at most once — total stack ops <= 2n (amortized O(1) per element).", cost: "O(n)", dimension: "time" },
      { lines: [3, 4], description: "The result array (n) and the stack (up to n indices).", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Comparisons and stack ops are O(1).", "The amortized argument: an index popped once is never re-pushed."],
    tradeoffs: "The naive approach scans right for each element (O(n²) time, O(1) space); the monotonic stack trades O(n) space for O(n) time.",
    counters: [
      { label: "pushes", definition: "executions of the push (line 11)", countLines: [11] },
      { label: "pops (answers found)", definition: "executions of the pop that resolves an answer (line 9)", countLines: [9] },
    ],
    fixedDataNote: "This run processes 5 elements → [4,2,4,-1,-1]. Note pushes + pops stay ≤ 2n even though a while is nested in the for.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: Next Greater Element via a decreasing stack." },
    { line: 2, executable: true, explanation: "Define next_greater(nums)." },
    { line: 3, executable: true, explanation: "Default every answer to -1 (no greater element)." },
    { line: 4, executable: true, explanation: "The stack holds indices still awaiting their next-greater answer." },
    { line: 5, executable: true, explanation: "Scan left to right." },
    { line: 6, executable: false, explanation: "Comment describing the pop condition." },
    { line: 7, executable: false, explanation: "Comment continues." },
    { line: 8, executable: true, explanation: "While the top index's value is smaller than the current value..." },
    { line: 9, executable: true, explanation: "...pop that index (its answer is found)." },
    { line: 10, executable: true, explanation: "Record nums[i] as its next greater element." },
    { line: 11, executable: true, explanation: "Push the current index; its answer is still unknown." },
    { line: 12, executable: true, explanation: "Return the answers." },
    { line: 13, executable: false, explanation: "Blank line." },
    { line: 14, executable: true, explanation: "next_greater([2,1,2,4,3]) → [4, 2, 4, -1, -1]." },
  ],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [{ role: "pointer", label: "i", source: "i" }],
    },
    { variable: "stack", model: "stack" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "There's a while loop inside a for loop — why is this O(n) and not O(n^2)?", answer: "Because each index is pushed once and popped at most once over the entire run, so total stack operations are at most 2n → O(n).", explanation: "The inner while only pops indices that were previously pushed. Across all iterations the number of pops can't exceed the number of pushes (n), so the combined work is linear, not quadratic." },
  ],

  experiments: [
    "Trace the stack for [2,1,2,4,3] and watch 4 resolve three pending indices at once.",
    "Change < to > to compute the Next Smaller Element instead.",
    "Feed a strictly decreasing array and see the stack grow to size n (all -1 answers).",
    "Largest rectangle in histogram: keep an INCREASING-height index stack; when heights[i] is shorter than the top, pop and compute area = heights[popped] * (i - stack[-1] - 1) (or i if the stack is empty). Append a sentinel height 0 at the end to flush. On heights = [2,1,5,6,2,3] confirm the max area is 10 (the 5,6 pair: height 5 x width 2). Remove the sentinel flush and watch the tall trailing bars get missed.",
  ],

  exercises: [
    {
      id: "mono-choose-1",
      kind: "choose-approach",
      prompt: "Problem: for each day, how many days until a warmer temperature? Which structure gives O(n), and what does the stack hold?",
      expected: "A monotonic (decreasing) stack holding indices of days awaiting a warmer day; when a warmer day arrives, pop and record the day gap. O(n) time.",
      hints: ["It's a 'next greater' variant (next warmer).", "Keep pending indices on a decreasing stack.", "Resolve them when a bigger value appears — O(n)."],
    },
    {
      id: "mono-fix-1",
      kind: "fix-mistake",
      prompt: "This stores values, but the problem needs the day-gap (indices). Fix it to store indices.",
      starterCode: "stack = []\nfor i in range(len(nums)):\n    while stack and stack[-1] < nums[i]:\n        stack.pop()\n    stack.append(nums[i])",
      expected: "stack = []\nfor i in range(len(nums)):\n    while stack and nums[stack[-1]] < nums[i]:\n        stack.pop()\n    stack.append(i)",
      hints: ["To compute gaps you need positions, not values.", "Push i and compare via nums[stack[-1]].", "Store indices; index the array when comparing."],
    },
    {
      id: "mono-histogram-1",
      kind: "predict-state",
      prompt: "Largest Rectangle in Histogram on heights = [2,1,5,6,2,3] using an increasing-height index stack (with a height-0 sentinel appended). When bar i=4 (height 2) arrives, the stack holds indices [.. ,2,3] (heights 5,6). Which bars are popped, what widths/areas are computed, and what is the final maximum area? Why is the end sentinel required?",
      expected: "At i=4 (height 2): pop index 3 (height 6) -> width = 4 - stack[-1] - 1 = 4 - 2 - 1 = 1, area 6; then pop index 2 (height 5) -> width = 4 - 1 - 1 = 2, area 10. The maximum area is 10 (bars 5,6 give height 5 x width 2). The appended height-0 sentinel at index n forces every remaining bar to be popped and measured at the end; without it the tall trailing bars (e.g. index 5, height 3) would never be closed and their rectangles would be missed.",
      hints: ["Pop while the top bar is taller than the incoming height.", "Width after a pop = i - stack[-1] - 1 (or i if the stack is empty).", "The height-0 sentinel at the end flushes every unclosed bar."],
    },
  ],

  review: `A **monotonic stack** stays sorted by popping order-breaking elements, solving **next greater/smaller** problems in **O(n)** time / **O(n)** space instead of O(n²). The key insight is amortized: each index is pushed once and popped at most once, so the nested \`while\` inside the \`for\` is still linear overall. Store **indices** when you need positions.`,

  expectedOutput: "[4, 2, 4, -1, -1]\n",

  references: [
    {
      url: "https://cp-algorithms.com/data_structures/stack_queue_modification.html",
      title: "Minimum stack / monotonic stack techniques — CP-Algorithms",
      section: "Monotonic stack applications",
      topic: "stacks/monotonic",
      purpose: "Confirm the monotonic-stack technique and its amortized O(n) analysis for next-greater problems.",
      verifiedClaims: ["A monotonic stack solves next-greater/smaller in O(n) because each element is pushed and popped once"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Stack — monotonic stack problems",
      topic: "stacks/monotonic",
      purpose: "Cross-check example problems (daily temperatures, next greater element, largest rectangle) using monotonic stacks.",
      verifiedClaims: ["Monotonic stacks apply to daily temperatures, next greater element, and histogram problems"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "5ca8e54606f871f9",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
