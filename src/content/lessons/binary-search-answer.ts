/**
 * Lesson: Binary search on the answer (Searching). Verified on CPython 3.14.
 * Output: "15\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# "Binary search on the answer": search the SOLUTION space, not an array.
# Find the smallest ship capacity to deliver all weights within 'days'.
def min_capacity(weights, days):
    def can_ship(cap):
        d = 1          # days used
        cur = 0        # load on the current day
        for w in weights:
            if cur + w > cap:   # would overflow -> start a new day
                d += 1
                cur = 0
            cur += w
        return d <= days
    lo = max(weights)      # capacity must fit the biggest item
    hi = sum(weights)      # one day could carry everything
    while lo < hi:
        mid = (lo + hi) // 2
        if can_ship(mid):
            hi = mid       # mid works -> try smaller
        else:
            lo = mid + 1   # mid too small -> go bigger
    return lo

print(min_capacity([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5))`;

export const binarySearchAnswer: LessonDefinition = {
  id: "binary-search-answer",
  title: "Binary Search on the Answer",
  area: "Searching",
  prerequisites: ["binary-search"],

  explanation: `Binary search is not only for arrays — you can binary-search a **range of possible answers** whenever the answers have a **monotonic** yes/no property. This is called **binary search on the answer** (or "parametric search").

The setup: you can't easily compute the optimal value directly, but for any candidate value you can cheaply **check** "is this feasible?" And feasibility is monotonic: if capacity C works, every capacity larger than C also works; if C fails, everything smaller fails too. That monotonic boundary is exactly what binary search locates — the smallest feasible value.

Here we find the minimum ship capacity to deliver all packages within \`days\`. \`can_ship(cap)\` greedily simulates the days needed for a given capacity (the **feasibility check**). We binary-search capacities in \`[max(weights), sum(weights)]\`: if \`mid\` works we try smaller (\`hi = mid\`), else we go bigger (\`lo = mid + 1\`). The total cost is **O(n · log(range))** — log of the value range, each step running the O(n) check. The cue for this pattern is "minimize/maximize X subject to a feasibility test that is monotonic in X."`,

  vocabulary: [
    { term: "Answer space", definition: "The range of candidate values (e.g. capacities) rather than array indices." },
    { term: "Feasibility check", definition: "A function that decides whether a candidate value works, ideally cheap." },
    { term: "Monotonic predicate", definition: "Once feasible, all larger (or all smaller) values stay feasible — a single boundary." },
    { term: "Parametric search", definition: "Binary-searching a parameter's value using a monotonic feasibility test." },
  ],

  concepts: {
    purpose: "Find an optimal value by binary-searching feasibility, when direct computation is hard but checking is easy.",
    operations: "Bound the answer range; binary-search it; move toward the feasible boundary using a monotonic check.",
    uses: "Minimum capacity/speed, split-array largest-sum, minimize maximum distance, allocation problems.",
    tradeoffs: "Turns a hard optimization into log(range) feasibility checks; needs a correct monotonic predicate and tight bounds.",
    commonMistakes: "Predicate not actually monotonic (pattern doesn't apply); wrong bounds (missing the answer); updating hi = mid but lo = mid (must be mid+1) causing infinite loops; off-by-one in which side keeps mid.",
    edgeCases: "Answer equals a bound (lo initialized to max element). Single feasible value. days=1 forces capacity = sum(weights).",
  },

  complexity: [
    { operation: "Binary search on answer", best: "O(n)", average: "O(n log R)", worst: "O(n log R)", space: "O(1)", note: "R = value range; each check is O(n)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of weights (items)" },
      { symbol: "R", meaning: "the size of the answer range, sum(weights) - max(weights)" },
    ],
    costModel: "Each feasibility check can_ship scans all n weights (O(n)). Binary search over the value range does O(log R) checks.",
    time: {
      bound: "O(n log R)",
      case: "worst",
      explanation: "Binary search halves the capacity range each step, so it runs about log₂(R) iterations. Every iteration calls can_ship, which scans all n weights in O(n). Multiplying: O(n · log R). This is the cost of searching a numeric range rather than an array — the log is over the RANGE of values, not the count of items.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "The check uses a few scalars (d, cur), and the search uses lo, hi, mid. Nothing grows with n or R.",
      inputOutputNote: "The weights list of n items is the input, not auxiliary space.",
    },
    derivation: [
      { lines: [15, 16, 17, 18, 19, 20], description: "Binary search over the value range runs about log(R) iterations.", cost: "O(log R)", dimension: "time" },
      { lines: [4, 5, 6, 7, 8, 9, 10, 11], description: "Each iteration's feasibility check scans all n weights.", cost: "O(n)", dimension: "time" },
      { lines: [5, 6, 13, 14], description: "A constant number of scalar variables.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Feasibility is MONOTONIC in capacity (larger capacity never becomes infeasible).", "Bounds [max(weights), sum(weights)] bracket the true answer.", "Arithmetic is O(1)."],
    tradeoffs: "Trying every capacity from max to sum would be O(n · R) — linear in the value range; binary search cuts the R factor to log R because feasibility is monotonic.",
    counters: [
      { label: "feasibility checks", definition: "calls to can_ship (line 17)", countLines: [17] },
    ],
    fixedDataNote: "This run finds capacity 15 for weights 1..10 in 5 days. The O(n log R) bound generalises to n items and value range R.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: search the solution space, not an array." },
    { line: 2, executable: false, explanation: "Comment describing the problem." },
    { line: 3, executable: true, explanation: "Define min_capacity(weights, days)." },
    { line: 4, executable: true, explanation: "The feasibility check: can we ship with capacity cap within days?" },
    { line: 5, executable: true, explanation: "Start counting from day 1." },
    { line: 6, executable: true, explanation: "cur is the load placed on the current day." },
    { line: 7, executable: true, explanation: "Greedily place each weight." },
    { line: 8, executable: true, explanation: "If adding w exceeds cap, this item starts a new day." },
    { line: 9, executable: true, explanation: "Increment the day count." },
    { line: 10, executable: true, explanation: "Reset the current day's load." },
    { line: 11, executable: true, explanation: "Add w to the current day." },
    { line: 12, executable: true, explanation: "Feasible if we used at most 'days' days." },
    { line: 13, executable: true, explanation: "Lower bound: capacity must fit the largest single item." },
    { line: 14, executable: true, explanation: "Upper bound: one day could carry the entire sum." },
    { line: 15, executable: true, explanation: "Binary-search the capacity range." },
    { line: 16, executable: true, explanation: "Midpoint capacity to test." },
    { line: 17, executable: true, explanation: "If mid is feasible..." },
    { line: 18, executable: true, explanation: "...try to do better (smaller capacity): keep mid as a candidate." },
    { line: 19, executable: false, explanation: "Otherwise mid is too small." },
    { line: 20, executable: true, explanation: "Go bigger: lo = mid + 1." },
    { line: 21, executable: true, explanation: "lo == hi is the smallest feasible capacity." },
    { line: 22, executable: false, explanation: "Blank line." },
    { line: 23, executable: true, explanation: "Answer for weights 1..10 within 5 days → 15." },
  ],

  bindings: [{ variable: "weights", model: "array" }],

  prediction: [
    { atEventIndex: 0, prompt: "Why can we binary-search capacities instead of trying each one?", answer: "Because feasibility is monotonic: if capacity C works, every larger capacity works too, so there is a single boundary to locate.", explanation: "Monotonicity means the feasible capacities form a contiguous upper range. Binary search finds the boundary (smallest feasible) in log(R) checks instead of scanning all R values." },
  ],

  experiments: [
    "Change days to 1 and confirm the answer becomes sum(weights) = 55.",
    "Change days to 10 and confirm the answer drops to max(weights) = 10.",
    "Add a print inside the loop to count how few feasibility checks run.",
  ],

  exercises: [
    {
      id: "bsa-choose-1",
      kind: "choose-approach",
      prompt: "Which problems fit 'binary search on the answer'? (a) sum of exactly k elements, (b) minimum largest-sum when splitting an array into m parts, (c) find an element in a sorted array.",
      expected: "(b): minimize the maximum part-sum has a monotonic feasibility check (a larger allowed max is always feasible). (a) is a sliding window; (c) is ordinary array binary search.",
      hints: ["Which asks to minimize/maximize a value with a monotonic feasibility test?", "Splitting to minimize the largest sum fits.", "The others are a window and a plain array search."],
    },
    {
      id: "bsa-fix-1",
      kind: "fix-mistake",
      prompt: "This answer-search loops forever. Fix the boundary update so it converges.",
      starterCode: "while lo < hi:\n    mid = (lo + hi) // 2\n    if can_ship(mid):\n        hi = mid\n    else:\n        lo = mid",
      expected: "while lo < hi:\n    mid = (lo + hi) // 2\n    if can_ship(mid):\n        hi = mid\n    else:\n        lo = mid + 1",
      hints: ["When mid is infeasible, mid itself can't be the answer.", "lo = mid does not make progress when lo and mid are equal.", "Use lo = mid + 1 in the infeasible branch."],
    },
  ],

  review: `**Binary search on the answer** searches a range of candidate values using a **monotonic feasibility check**: locate the boundary between "works" and "doesn't." Cost is **O(n · log R)** — log over the value range R, each step an O(n) check. The cue is "minimize/maximize X subject to a monotonic feasibility test," distinct from array search or sliding windows.`,

  expectedOutput: "15\n",

  references: [
    {
      url: "https://cp-algorithms.com/num_methods/binary_search.html",
      title: "Binary search — CP-Algorithms",
      section: "Binary search on the answer / predicate",
      topic: "searching/binary-on-answer",
      purpose: "Confirm the parametric-search technique: binary-searching a monotonic predicate over a value range.",
      verifiedClaims: ["A monotonic predicate lets you binary-search the answer space in O(log range) predicate evaluations"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Binary Search — search on answer problems",
      topic: "searching/binary-on-answer",
      purpose: "Cross-check example problems (min capacity/speed, split array) that use answer search.",
      verifiedClaims: ["Problems like minimum capacity/eating speed use binary search on the answer"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "12891e8de1aaae8b",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
