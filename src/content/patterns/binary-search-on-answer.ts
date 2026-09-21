/**
 * Pattern: Binary search on the answer.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2). Output "15\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# Binary search on the ANSWER: smallest ship capacity to deliver within 'days'.
def can_ship(weights, cap, days):
    used, cur = 1, 0                 # feasibility test for a candidate capacity
    for w in weights:
        if cur + w > cap:
            used += 1                # start a new day
            cur = 0
        cur += w
    return used <= days

def least_capacity(weights, days):
    lo, hi = max(weights), sum(weights)   # search range of possible capacities
    while lo < hi:
        mid = (lo + hi) // 2
        if can_ship(weights, mid, days):
            hi = mid                 # feasible -> try smaller
        else:
            lo = mid + 1             # infeasible -> need bigger
    return lo

print(least_capacity([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5))  # 15`;

export const binarySearchOnAnswerPattern: PatternDefinition = {
  id: "binary-search-on-answer",
  title: "Binary Search on the Answer",
  category: "Searching",
  summary:
    "When feasibility is monotone in a numeric answer, binary-search the answer value and test each candidate with a feasibility check.",

  clues: [
    "You want the MIN or MAX value that satisfies a condition (smallest capacity, largest minimum, minimum time).",
    "For a fixed candidate value you can efficiently TEST feasibility (yes/no), even if computing the optimum directly is hard.",
    "Feasibility is MONOTONE: if a value works, all larger (or all smaller) values also work.",
    "Phrases like 'minimum largest…', 'smallest capacity such that…', 'maximize the minimum…', 'least time to…'.",
  ],

  naiveApproach: `Try every candidate value in the range and test each — **O(range · checkCost)**. When the range of possible answers is large (sums, times, sizes), scanning it linearly is far too slow, and it ignores that once a value is feasible, larger values trivially are too.`,

  whyItHelps: `The candidate answers form a **monotone yes/no line**: below some threshold every value is infeasible, at and above it every value is feasible (or vice versa). That monotonicity is exactly what **binary search** needs — but over the *answer space*, not an array. Each step tests the midpoint's feasibility with a cheap check and halves the search range, giving **O(log(range) · checkCost)**. You never need a closed-form for the optimum; you only need a **feasibility test** and a guarantee of monotonicity.`,

  conditions: [
    "Feasibility must be MONOTONE in the candidate: feasible(x) ⇒ feasible(x+1) (for a minimization) so the boundary is well-defined.",
    "You can compute feasible(x) efficiently (often a linear greedy pass).",
    "You set the search bounds correctly: lo/hi must bracket the true answer (e.g. lo = max single item, hi = total).",
  ],

  alternatives: [
    "Plain binary search on a sorted ARRAY — when you're locating a value/index, not searching an abstract answer range.",
    "Greedy / direct formula — when the optimum has a closed form or a single greedy pass yields it directly.",
    "DP — when feasibility isn't monotone or the optimum needs combining subproblems rather than a threshold test.",
  ],

  counterexamples: [
    "If feasibility is NOT monotone (feasible, then infeasible, then feasible again), binary search can land on the wrong side — this pattern doesn't apply.",
    "Locating an exact element in a sorted list is ordinary binary search, not 'on the answer'.",
    "Wrong bounds (hi too small) can exclude the true answer — a setup bug, not a reason to abandon the pattern.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "15\n",
  complexityNote:
    "O(n · log(sum − max)) time: each feasibility check is an O(n) pass, run O(log(range)) times. O(1) extra space.",

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of weights" },
      { symbol: "R", meaning: "the size of the capacity search range (sum(weights) − max(weights))" },
    ],
    costModel: "The answer space [max, sum] is searched by binary search; each candidate capacity is tested by one O(n) feasibility scan.",
    time: {
      bound: "O(n · log R)",
      case: "worst",
      explanation: "The binary search over capacities (lines 13-18) runs O(log R) iterations, halving the range each time. Each iteration calls can_ship (line 15), an O(n) pass over the weights. So total O(n · log R).",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Only a few scalars (lo, hi, mid, used, cur) are kept; nothing grows with n.",
      inputOutputNote: "weights (n values) is the input; the answer is a single integer.",
    },
    derivation: [
      { lines: [13, 14], description: "Binary search halves the range each step — O(log R) iterations.", cost: "O(log R)", dimension: "time" },
      { lines: [4, 5, 8], description: "Each feasibility check scans all n weights.", cost: "O(n)", dimension: "time" },
      { lines: [3, 12], description: "A constant number of scalar variables.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["The feasibility predicate is MONOTONE in capacity (once feasible, larger is feasible) — required for binary search on the answer.", "Arithmetic and comparison are O(1)."],
    tradeoffs: "A linear scan over every candidate capacity would be O(n·R); binary search cuts the R factor to log R by exploiting monotonicity.",
    counters: [{ label: "feasibility checks", definition: "iterations of the binary-search loop (line 13)", countLines: [13] }],
    fixedDataNote: "For these 10 weights the range is [10, 55], so ~log2(45) ≈ 6 checks. The O(n · log R) bound generalises.",
  },

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: binary search over candidate capacities." },
    { line: 2, executable: true, explanation: "Define the feasibility test can_ship(weights, cap, days)." },
    { line: 3, executable: true, explanation: "Start on day 1 with an empty load." },
    { line: 4, executable: true, explanation: "Greedily pack weights in order." },
    { line: 5, executable: true, explanation: "If the next item overflows the capacity..." },
    { line: 6, executable: true, explanation: "...move to a new day..." },
    { line: 7, executable: true, explanation: "...resetting the current load." },
    { line: 8, executable: true, explanation: "Add the item to the current day." },
    { line: 9, executable: true, explanation: "Feasible if we used at most the allowed number of days." },
    { line: 10, executable: false, explanation: "Blank line." },
    { line: 11, executable: true, explanation: "Define least_capacity(weights, days)." },
    { line: 12, executable: true, explanation: "Bounds: at least the heaviest item, at most the total (one day)." },
    { line: 13, executable: true, explanation: "Binary search until the range collapses." },
    { line: 14, executable: true, explanation: "Midpoint candidate capacity." },
    { line: 15, executable: true, explanation: "If this capacity is feasible..." },
    { line: 16, executable: true, explanation: "...it might be reducible, so try the lower half (keep mid as a candidate)." },
    { line: 17, executable: false, explanation: "Otherwise it's too small." },
    { line: 18, executable: true, explanation: "Need a larger capacity: search the upper half." },
    { line: 19, executable: true, explanation: "lo == hi is the smallest feasible capacity." },
    { line: 20, executable: false, explanation: "Blank line." },
    { line: 21, executable: true, explanation: "The least capacity to ship these weights in 5 days is 15." },
  ],

  bindings: [
    {
      variable: "weights",
      model: "array",
      overlays: [
        { role: "boundary", label: "lo", source: "lo" },
        { role: "boundary", label: "hi", source: "hi" },
      ],
    },
  ],

  linkedLessons: ["binary-search-answer", "binary-search", "bounds"],

  exercises: [
    {
      id: "pat-bsa-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Split an array into m contiguous parts to MINIMIZE the largest part sum.' Which pattern, and what's the feasibility test?",
      expected:
        "Binary search on the answer. Binary-search the candidate 'largest allowed sum'; feasibility = 'can we split into ≤ m parts each ≤ candidate?' via a greedy pass. Monotone (a bigger cap only helps), so O(n log(sum)).",
      correctPatternId: "binary-search-on-answer",
      hints: [
        "You minimize a maximum — search that maximum.",
        "Fix a candidate cap and greedily test feasibility.",
        "Feasibility is monotone in the cap.",
      ],
    },
    {
      id: "pat-bsa-choose-1",
      kind: "choose-approach",
      prompt:
        "You must find the index of a specific value in a sorted array. Is this 'binary search on the answer'? If not, what is it?",
      expected:
        "No — that's ordinary binary search on a sorted array (locating an element/index). 'Binary search on the answer' searches an abstract range of candidate answers using a feasibility test, not array positions.",
      correctPatternId: "binary-search-on-answer",
      hints: [
        "Are you searching positions or candidate answers?",
        "Locating an element = plain binary search.",
        "No feasibility function is involved.",
      ],
    },
    {
      id: "pat-bsa-fix-1",
      kind: "fix-mistake",
      prompt:
        "This binary-search-on-answer can loop forever or skip the boundary. Fix the update when the candidate is feasible.",
      starterCode:
        "while lo < hi:\n    mid = (lo + hi) // 2\n    if can_ship(weights, mid, days):\n        hi = mid - 1\n    else:\n        lo = mid + 1\nreturn lo",
      expected:
        "while lo < hi:\n    mid = (lo + hi) // 2\n    if can_ship(weights, mid, days):\n        hi = mid\n    else:\n        lo = mid + 1\nreturn lo",
      hints: [
        "mid itself may be the smallest feasible answer.",
        "Setting hi = mid - 1 can skip past it.",
        "On feasible, keep mid in range: hi = mid.",
      ],
    },
  ],

  references: [
    {
      url: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/editorial/",
      title: "Capacity To Ship Packages Within D Days — LeetCode editorial",
      section: "Binary search on capacity with a feasibility check",
      topic: "patterns/binary-search-on-answer",
      purpose: "Confirm the search-the-answer framing, the monotone feasibility test, and the O(n log(range)) cost.",
      verifiedClaims: [
        "The minimum feasible capacity is found by binary searching the capacity and testing feasibility greedily.",
        "Feasibility is monotone in the capacity, so binary search applies.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://cp-algorithms.com/num_methods/binary_search.html",
      title: "Binary search — CP-Algorithms",
      section: "Binary search over a monotone predicate",
      topic: "patterns/binary-search-on-answer",
      purpose: "Cross-check binary searching a monotone yes/no predicate over an answer range.",
      verifiedClaims: ["Binary search applies to any monotone predicate over an ordered range, not only array lookups."],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "47cff2f026433ea9",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
