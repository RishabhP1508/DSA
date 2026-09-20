/**
 * Lesson: Backtracking — combinations (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly
 * "[[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Choose k numbers from 1..n, where ORDER DOES NOT MATTER.
def combine(n, k):
    res = []
    def bt(start, path):
        if len(path) == k:            # picked exactly k -> record it
            res.append(path[:])
            return
        for i in range(start, n + 1):
            path.append(i)            # CHOOSE i
            bt(i + 1, path)           # EXPLORE with i+1 (increasing, no reuse)
            path.pop()                # UN-CHOOSE
    bt(1, [])
    return res

print(combine(4, 2))`;

export const dpCombinations: LessonDefinition = {
  id: "dp-combinations",
  title: "Backtracking: Combinations",
  area: "DP and recursion",
  prerequisites: ["dp-subsets"],

  explanation: `A **combination** is a selection of \`k\` items where **order does not matter** — \`{1,2}\` and \`{2,1}\` are the same combination. The number of ways to choose k from n is the binomial coefficient **C(n, k) = n! / (k!·(n−k)!)**. Combinations are subsets **restricted to a fixed size k**, so the backtracking template is almost identical to the subset one — the difference is a **size check** instead of recording at every node.

The key to avoiding duplicates (like \`[1,2]\` and \`[2,1]\`) is the same **increasing \`start\` index** used for subsets: each recursion considers only elements **after** the one just chosen (\`i + 1\`), so every combination is generated in a single increasing order exactly once. We record a **copy** of \`path\` only when its length reaches \`k\`. The backtracking rhythm is unchanged: **choose \`i\`, explore from \`i + 1\`, un-choose**.

A practical **pruning** exists (not shown, to keep the example minimal): if there aren't enough remaining numbers to reach size k, stop early — you can cap the loop at \`n - (k - len(path)) + 1\`. For \`combine(4, 2)\` the six combinations are \`[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]\`. Cost is **O(k·C(n,k))** time (C(n,k) combinations, each O(k) to copy) and **O(k)** auxiliary space for the recursion depth and path. Recognizing "choose k, order irrelevant" → combinations, versus "arrange all, order matters" → permutations, is the reusable takeaway.`,

  vocabulary: [
    { term: "Combination", definition: "A selection where order does not matter (unlike a permutation)." },
    { term: "C(n, k)", definition: "The binomial coefficient: the number of k-element subsets of an n-set." },
    { term: "start index", definition: "Forces increasing order so each combination is generated once (no duplicates)." },
    { term: "Size check", definition: "Record only when the path length reaches k, unlike subsets which record at every node." },
    { term: "Pruning (optional)", definition: "Stop early when too few numbers remain to reach size k." },
  ],

  concepts: {
    purpose:
      "Enumerate all ways to pick k items where arrangement is irrelevant — the order-insensitive counterpart of permutations.",
    operations:
      "For each candidate from start to n: choose it, recurse from the next index, un-choose; record when the path reaches size k.",
    uses:
      "Team/committee selection, lottery-style choices, k-subset enumeration, generating test combinations, combination-sum variants.",
    tradeoffs:
      "C(n,k) can be large but is far smaller than n! permutations for the same items; the start index keeps each combination unique cheaply.",
    commonMistakes:
      "Recording at every node like subsets (produces wrong-size selections); starting the loop at 1 instead of start (duplicates/permutations); storing path not path[:].",
    edgeCases:
      "k = 0 yields [[]] (one empty combination). k = n yields the single full selection. k > n yields [] (impossible).",
  },

  complexity: [
    { operation: "combinations (backtracking)", best: "O(k·C(n,k))", average: "O(k·C(n,k))", worst: "O(k·C(n,k))", space: "O(k)", note: "C(n,k) combinations, each O(k) to copy; recursion depth O(k)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the size of the pool (numbers 1..n)" },
      { symbol: "k", meaning: "the number of items to choose" },
    ],
    costModel:
      "Each complete combination costs O(k) to copy; there are C(n,k) of them. Per-node work is O(1) besides recursion.",
    time: {
      bound: "O(k·C(n,k))",
      case: "worst",
      explanation:
        "The search produces exactly C(n,k) valid combinations because the increasing start index makes each appear once. Copying each into the results costs O(k). Multiplying gives O(k·C(n,k)), matching the output size (so it is essentially optimal for enumerating all combinations).",
    },
    space: {
      bound: "O(k)",
      case: "worst",
      explanation:
        "Auxiliary space is the recursion depth (at most k) plus the single path (length ≤ k). This excludes the results list, which is output.",
      inputOutputNote: "The results list holds C(n,k) combinations of total size O(k·C(n,k)) — required output, separate from the O(k) working space.",
    },
    derivation: [
      { lines: [5, 6, 7], description: "Record each size-k combination (C(n,k) times, O(k) copy each).", cost: "O(k·C(n,k))", dimension: "time" },
      { lines: [8, 9, 10, 11], description: "Choose/explore-from-i+1/un-choose loop drives the C(n,k) branching.", cost: "O(C(n,k))", dimension: "time" },
      { lines: [4], description: "Recursion depth ≤ k plus a path of length ≤ k.", cost: "O(k)", dimension: "space" },
    ],
    assumptions: [
      "The increasing start index (i + 1) makes each combination unique.",
      "path[:] copies each combination before storing it.",
      "n and k are small so C(n,k) stays manageable.",
    ],
    tradeoffs:
      "Combinations are subsets restricted to size k: the only change from the subset template is the size check before recording. Compared to permutations (n! and a used array), combinations are cheaper and use a start index.",
    counters: [
      { label: "combinations recorded", definition: "executions of the record line (line 6)", countLines: [6] },
      { label: "choices made", definition: "executions of the choose line (line 9)", countLines: [9] },
    ],
    fixedDataNote:
      "combine(4, 2) records C(4,2) = 6 combinations. The O(k·C(n,k)) bound describes how that count and copy cost scale with n and k.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: choose k from 1..n, order irrelevant." },
    { line: 2, executable: true, explanation: "Define combine(n, k)." },
    { line: 3, executable: true, explanation: "Collect size-k combinations." },
    { line: 4, executable: true, explanation: "Inner backtracker: start index and current path." },
    { line: 5, executable: true, explanation: "If we've picked exactly k numbers, it's a complete combination." },
    { line: 6, executable: true, explanation: "Record a copy of it." },
    { line: 7, executable: true, explanation: "Return to stop this branch." },
    { line: 8, executable: true, explanation: "Consider each candidate from start to n." },
    { line: 9, executable: true, explanation: "Choose i by appending it." },
    { line: 10, executable: true, explanation: "Explore from i+1 so numbers only increase (no duplicates)." },
    { line: 11, executable: true, explanation: "Un-choose before the next candidate." },
    { line: 12, executable: true, explanation: "Start from 1 with an empty path." },
    { line: 13, executable: true, explanation: "Return all combinations." },
    { line: 14, executable: false, explanation: "Blank line." },
    { line: 15, executable: true, explanation: "Print the 6 combinations of choosing 2 from 1..4." },
  ],

  bindings: [{ variable: "path", model: "recursion" }],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "Why does recursing from `i + 1` (not from `start` or `1`) prevent duplicate combinations?",
      answer: "It forces the chosen numbers to strictly increase, so a set like {1,3} is only ever generated as [1,3], never as [3,1]. Since order doesn't matter, fixing one increasing order gives each combination exactly once.",
      explanation: "Combinations are order-insensitive; the increasing start index picks a single canonical ordering per combination, eliminating duplicates.",
    },
  ],

  experiments: [
    "Change bt(i + 1, path) to bt(i, path) to allow repeats (combinations with repetition).",
    "Add the pruning cap `range(start, n - (k - len(path)) + 2)` and confirm the same output with less work.",
    "Compare the count of results with math.comb(n, k).",
  ],

  exercises: [
    {
      id: "dpcomb-complete-1",
      kind: "complete-code",
      prompt: "Complete the combination backtracker (size check + choose/explore/un-choose).",
      starterCode:
        "def bt(start, path):\n    if len(path) == k:\n        res.append(path[:])\n        return\n    for i in range(start, n + 1):\n        # TODO: choose i, explore from i+1, un-choose\n        pass",
      expected:
        "def bt(start, path):\n    if len(path) == k:\n        res.append(path[:])\n        return\n    for i in range(start, n + 1):\n        path.append(i)\n        bt(i + 1, path)\n        path.pop()",
      hints: [
        "Append i, recurse from i+1, then pop.",
        "i+1 keeps numbers increasing.",
        "path.append(i); bt(i + 1, path); path.pop()",
      ],
    },
    {
      id: "dpcomb-choose-1",
      kind: "choose-approach",
      prompt: "You must list every way to seat 3 people in a row (order matters) vs every way to pick a 3-person team (order irrelevant). Which is permutations, which is combinations?",
      expected: "Seating in a row = permutations (order matters, n!/(n-k)! arrangements). Picking a team = combinations (order irrelevant, C(n,k)).",
      hints: [
        "Does swapping two selected items make a different answer?",
        "If yes -> permutations; if no -> combinations.",
        "Seating is ordered; a team is unordered.",
      ],
    },
    {
      id: "dpcomb-predict-1",
      kind: "predict-state",
      prompt: "How many results does combine(4, 2) produce, and what is the first and last?",
      expected: "6 (=C(4,2)). First is [1, 2]; last is [3, 4].",
      hints: [
        "C(4,2) = 6.",
        "Smallest increasing pair first.",
        "Largest increasing pair last.",
      ],
    },
  ],

  review: `A **combination** selects k items where **order doesn't matter**; there are **C(n,k)** of them. It's the subset template plus a **size check**: record a copy only when \`len(path) == k\`. The **increasing \`start\` index** (recurse from \`i + 1\`) generates each combination once with no duplicates. It is **O(k·C(n,k))** time and **O(k)** auxiliary space. Recognize the fork: order matters → permutations (n!, used array); order doesn't → combinations (C(n,k), start index). \`combine(4,2)\` gives all 6 pairs.`,

  expectedOutput: "[[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]\n",

  references: [
    {
      url: "https://leetcode.com/problems/combinations/editorial/",
      title: "Combinations — LeetCode editorial",
      section: "Backtracking with a start index",
      topic: "dp/combinations",
      purpose: "Confirm the combination-backtracking template, the increasing start index that avoids duplicates, and the C(n,k) output size.",
      verifiedClaims: [
        "Recursing from i+1 generates each k-combination exactly once.",
        "A size check records only complete size-k selections.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://en.wikipedia.org/wiki/Combination",
      title: "Combination — Wikipedia",
      section: "Number of k-combinations C(n,k)",
      topic: "dp/combinations",
      purpose: "Cross-check the count of k-combinations of an n-set as the binomial coefficient.",
      verifiedClaims: [
        "The number of k-element subsets of an n-element set is the binomial coefficient C(n, k).",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "edda1f8ff0e62cd8",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
