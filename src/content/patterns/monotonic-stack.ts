/**
 * Pattern: Monotonic stack.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "[4, 2, 4, -1, -1]\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# Monotonic stack: next greater element for each position, in O(n).
def next_greater(nums):
    res = [-1] * len(nums)
    stack = []                        # holds indices with DECREASING values
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            res[stack.pop()] = x      # x is the next greater for that popped index
        stack.append(i)
    return res

print(next_greater([2, 1, 2, 4, 3]))  # [4, 2, 4, -1, -1]`;

export const monotonicStackPattern: PatternDefinition = {
  id: "monotonic-stack",
  title: "Monotonic Stack",
  category: "Stacks & queues",
  summary:
    "Keep a stack whose values stay sorted so each element is pushed and popped once, answering next-greater/smaller queries in O(n).",

  clues: [
    "For each element you need the NEXT (or previous) greater/smaller element, or a span/range bounded by such.",
    "The naive answer scans forward/backward from each element (O(n²)).",
    "Problems about bars/heights, temperatures, spans, or histogram areas.",
    "Phrases like 'next greater element', 'daily temperatures', 'largest rectangle in histogram', 'stock span'.",
  ],

  naiveApproach: `For each element, scan the rest of the array to find the next greater one — **O(n²)**. This repeatedly re-scans regions that a stack could remember, and it discards comparisons that could have resolved several elements at once.`,

  whyItHelps: `Maintain a stack of indices whose values are kept **monotonic** (e.g. strictly decreasing for 'next greater'). When a new element arrives, it **resolves and pops** every stacked element it exceeds — each pop finalizes that element's answer. Because every index is **pushed once and popped once**, the total work is **O(n)** despite the inner while-loop. The stack effectively remembers the "unresolved" candidates in order, so one new element can settle many at once — turning the O(n²) rescan into a single linear pass with O(n) space.`,

  conditions: [
    "The query is a directional next/previous greater-or-smaller relationship (monotone comparison).",
    "Choose the stack's monotonic direction to match: decreasing values for 'next greater', increasing for 'next smaller'.",
    "Store INDICES (not just values) when you need positions, spans, or distances.",
  ],

  alternatives: [
    "Monotonic DEQUE — for sliding-window maximum/minimum, where elements also expire from the front as the window moves.",
    "Sorting + processing in value order — an alternative for some next-greater variants, but usually O(n log n).",
    "Segment tree / sparse table — for arbitrary range max/min queries, not the specific next-greater relationship.",
  ],

  counterexamples: [
    "Arbitrary range-maximum queries (any [l, r]) aren't a next-greater relationship — use a segment tree or sparse table.",
    "Sliding-window max/min needs front eviction as the window slides — use a monotonic deque, not a plain stack.",
    "Choosing the wrong monotonic direction (increasing when you want next-greater) yields incorrect answers — a setup error, not a different pattern.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "[4, 2, 4, -1, -1]\n",
  complexityNote:
    "O(n) time — each index is pushed and popped at most once, so the inner while-loop is amortized O(1). O(n) space for the stack and result.",

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in nums" }],
    costModel: "A stack holds indices with decreasing values. Each index is pushed exactly once and popped at most once, so the inner while-loop's total pops over the whole run are bounded by n (amortised analysis).",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "Although lines 6-7 are a nested while inside the for, each index is pushed once (line 8) and popped at most once (line 7). Across the ENTIRE run there are at most n pops, so the total inner-loop work is O(n), not O(n²). The for loop itself is O(n). Total O(n) amortised.",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "The stack can hold up to n indices (a strictly decreasing array), and the result array is size n.",
      inputOutputNote: "nums (n) is the input; the O(n) result is the output; the stack is O(n) auxiliary.",
    },
    derivation: [
      { lines: [5], description: "Outer loop over n elements.", cost: "O(n)", dimension: "time" },
      { lines: [6, 7], description: "Each index popped at most once across the whole run (amortised).", cost: "O(n) total", dimension: "time" },
      { lines: [3, 4], description: "Result array + stack, each up to n.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Push/pop on a Python list end are amortised O(1).", "The 'amortised O(1) per step' argument relies on each index being popped at most once."],
    tradeoffs: "A brute-force next-greater scan is O(n²); the monotonic stack achieves O(n) by never re-examining a resolved index.",
    counters: [{ label: "pops", definition: "executions of the stack pop / assignment (line 7)", countLines: [7] }],
    fixedDataNote: "For [2,1,2,4,3] the result is [4,2,4,-1,-1] with total pops <= n. The O(n) amortised bound generalises.",
  },

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: compute the next greater element per index in O(n)." },
    { line: 2, executable: true, explanation: "Define next_greater(nums)." },
    { line: 3, executable: true, explanation: "Default answer -1 (no greater element to the right)." },
    { line: 4, executable: true, explanation: "Stack of indices whose values are kept decreasing." },
    { line: 5, executable: true, explanation: "Scan each element with its index." },
    { line: 6, executable: true, explanation: "While the top of the stack has a smaller value than x..." },
    { line: 7, executable: true, explanation: "...x is that index's next greater element; pop and record it." },
    { line: 8, executable: true, explanation: "Push the current index as a new unresolved candidate." },
    { line: 9, executable: true, explanation: "Return the next-greater answers." },
    { line: 10, executable: false, explanation: "Blank line." },
    { line: 11, executable: true, explanation: "For [2,1,2,4,3] the next-greater array is [4, 2, 4, -1, -1]." },
  ],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [{ role: "pointer", label: "i", source: "i" }],
    },
    { variable: "stack", model: "stack" },
  ],

  linkedLessons: ["monotonic-stack", "stack-queue-operations", "min-max-tracking"],

  exercises: [
    {
      id: "pat-ms-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'For each day, how many days until a warmer temperature?' Which pattern, and what does the stack hold?",
      expected:
        "Monotonic stack (decreasing temperatures), storing INDICES. When a warmer day arrives it pops cooler days and records the index gap as the wait. O(n) total.",
      correctPatternId: "monotonic-stack",
      hints: [
        "It's a 'next greater' relationship.",
        "You need distances, so store indices.",
        "Keep the stack decreasing.",
      ],
    },
    {
      id: "pat-ms-choose-1",
      kind: "choose-approach",
      prompt:
        "You need the MAXIMUM of every sliding window of size k as the window moves. Monotonic stack or something else?",
      expected:
        "Not a plain monotonic stack — elements expire from the front as the window slides, which a stack can't do. Use a monotonic DEQUE (decreasing), popping the front when it leaves the window. O(n).",
      correctPatternId: "monotonic-stack",
      hints: [
        "The window slides, so old elements must leave.",
        "A stack only pops from one end conceptually.",
        "Front eviction → monotonic deque.",
      ],
    },
    {
      id: "pat-ms-fix-1",
      kind: "fix-mistake",
      prompt:
        "This 'next greater' uses the wrong comparison and leaves answers unresolved. Fix the while condition.",
      starterCode:
        "for i, x in enumerate(nums):\n    while stack and nums[stack[-1]] > x:\n        res[stack.pop()] = x\n    stack.append(i)",
      expected:
        "for i, x in enumerate(nums):\n    while stack and nums[stack[-1]] < x:\n        res[stack.pop()] = x\n    stack.append(i)",
      hints: [
        "x resolves stacked elements that are SMALLER than it.",
        "The stack should stay decreasing for 'next greater'.",
        "Compare with < , not >.",
      ],
    },
  ],

  references: [
    {
      url: "https://leetcode.com/problems/next-greater-element-i/editorial/",
      title: "Next Greater Element — LeetCode editorial",
      section: "Monotonic stack O(n) solution",
      topic: "patterns/monotonic-stack",
      purpose: "Confirm the decreasing-stack technique for next-greater and its amortized O(n) cost.",
      verifiedClaims: [
        "A monotonic (decreasing) stack computes next-greater elements in O(n); each index is pushed and popped once.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://cp-algorithms.com/data_structures/stack_queue_modification.html",
      title: "Minimum stack / monotonic structures — CP-Algorithms",
      section: "Monotonic stack and deque",
      topic: "patterns/monotonic-stack",
      purpose: "Cross-check the monotonic-stack invariant and the deque variant for sliding-window extrema.",
      verifiedClaims: [
        "A monotonic stack maintains sorted order so each element is processed once; sliding-window extrema use a monotonic deque.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "e5a36f13b9b59bc6",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
