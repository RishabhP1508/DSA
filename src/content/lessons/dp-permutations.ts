/**
 * Lesson: Backtracking — permutations (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly
 * "[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# All orderings (permutations) of distinct numbers.
def permutations(nums):
    res = []
    def bt(path, used):
        if len(path) == len(nums):     # a full-length ordering is complete
            res.append(path[:])
            return
        for i in range(len(nums)):
            if used[i]:                # skip elements already placed
                continue
            used[i] = True             # CHOOSE nums[i]
            path.append(nums[i])
            bt(path, used)             # EXPLORE the rest
            path.pop()                 # UN-CHOOSE
            used[i] = False
    bt([], [False] * len(nums))
    return res

print(permutations([1, 2, 3]))`;

export const dpPermutations: LessonDefinition = {
  id: "dp-permutations",
  title: "Backtracking: Permutations",
  area: "DP and recursion",
  prerequisites: ["dp-backtracking"],

  explanation: `A **permutation** is an **ordering** of all the elements — order matters, and every element is used exactly once. For n distinct elements there are **n!** permutations (n choices for the first position, n−1 for the second, and so on). Unlike subsets, where each element is in or out, here **every** element appears in **every** permutation; only the arrangement differs.

The backtracking template adapts with a **\`used\`** marker instead of a start index. At each position we try every element that has **not yet been placed**: mark it used, append it to \`path\`, recurse to fill the next position, then **undo** both the append and the used-flag before trying the next candidate. When \`path\` reaches the full length, it is a complete permutation and we record a **copy**. The \`used\` array is what enforces "each element once" while still allowing all orderings — that's the difference from subsets/combinations, which use \`start\` to forbid reordering.

The output for \`[1,2,3]\` is all 6 orderings in depth-first order: \`[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]\`. Time is **O(n·n!)** — there are n! permutations and copying each costs O(n) — and auxiliary space is **O(n)** for the recursion depth, the \`path\`, and the \`used\` array (the n! output is separate). Because n! grows so fast, permutation enumeration is only practical for small n; if you need just one property over permutations rather than all of them, look for a smarter formulation.`,

  vocabulary: [
    { term: "Permutation", definition: "An ordering of all elements; order matters and each element is used once." },
    { term: "n! (factorial)", definition: "The number of permutations of n distinct elements." },
    { term: "used array", definition: "Booleans marking which elements are already placed in the current path." },
    { term: "Position filling", definition: "Choosing which unused element goes in the next slot of the ordering." },
    { term: "choose / un-choose", definition: "Set used[i] and append, then pop and clear used[i] after recursing." },
  ],

  concepts: {
    purpose:
      "Enumerate every ordering of a collection — needed when arrangement matters (schedules, sequences, orderings).",
    operations:
      "Fill positions left to right; at each, try each unused element, mark/append, recurse, then unmark/pop.",
    uses:
      "Generating orderings, brute-force TSP on tiny inputs, anagrams, sequencing/scheduling enumeration, testing all arrangements.",
    tradeoffs:
      "n! growth limits this to small n; a used array is O(n) space and O(1) checks. For counting-only questions, avoid materializing permutations.",
    commonMistakes:
      "Forgetting to clear used[i] on backtrack (permutations get truncated); storing path instead of path[:]; using a start index (that yields combinations, not permutations).",
    edgeCases:
      "Empty input yields [[]] (one empty ordering). Duplicate elements need extra skipping to avoid repeated permutations — inputs here are distinct.",
  },

  complexity: [
    { operation: "permutations (backtracking)", best: "O(n·n!)", average: "O(n·n!)", worst: "O(n·n!)", space: "O(n)", note: "n! orderings, each O(n) to copy; recursion depth O(n)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in nums" }],
    costModel:
      "Each complete permutation costs O(n) to copy into the results; there are n! of them. Per-node work is O(1) besides recursion.",
    time: {
      bound: "O(n·n!)",
      case: "worst",
      explanation:
        "There are n! complete orderings. The search tree has n choices at the top, n−1 next, and so on, and reaching each leaf builds a permutation copied in O(n). Multiplying, total work is O(n·n!). This matches the output size, so it is essentially optimal for producing all permutations.",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation:
        "Auxiliary space is the recursion depth (n), the path (≤ n), and the used array (n) — all O(n). This excludes the results, which are output.",
      inputOutputNote: "The results list holds n! permutations of total size O(n·n!) — required output, separate from the O(n) working space.",
    },
    derivation: [
      { lines: [5, 6, 7], description: "Record each completed permutation (n! times, O(n) copy each).", cost: "O(n·n!)", dimension: "time" },
      { lines: [8, 9, 10, 11, 12, 13, 14, 15], description: "Try-each-unused loop with choose/explore/un-choose drives the n! branching.", cost: "O(n!)", dimension: "time" },
      { lines: [4, 16], description: "Recursion depth n, path ≤ n, used array n.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: [
      "Elements are distinct (no duplicate-permutation skipping needed).",
      "The used array correctly enforces each element once.",
      "n is small so n! and the trace stay manageable.",
    ],
    tradeoffs:
      "Compared to subsets/combinations (which use a start index to forbid reordering), permutations use a used array to allow all orderings — trading O(n) space for the freedom to revisit earlier elements in later positions.",
    counters: [
      { label: "permutations recorded", definition: "executions of the record line (line 6)", countLines: [6] },
      { label: "choices made", definition: "executions of the choose line (line 12)", countLines: [12] },
    ],
    fixedDataNote:
      "permutations([1,2,3]) records 3! = 6 orderings. The O(n·n!) bound describes how that count and copy cost scale with n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: generate all orderings." },
    { line: 2, executable: true, explanation: "Define permutations(nums)." },
    { line: 3, executable: true, explanation: "Collect completed permutations." },
    { line: 4, executable: true, explanation: "Inner backtracker: current ordering path and used flags." },
    { line: 5, executable: true, explanation: "If path uses every element, it's a full permutation." },
    { line: 6, executable: true, explanation: "Record a copy of the completed ordering." },
    { line: 7, executable: true, explanation: "Return to stop this branch." },
    { line: 8, executable: true, explanation: "Try each element as the next position." },
    { line: 9, executable: true, explanation: "Skip elements already placed in this ordering." },
    { line: 10, executable: true, explanation: "Continue to the next candidate." },
    { line: 11, executable: true, explanation: "Choose element i: mark it used." },
    { line: 12, executable: true, explanation: "Append it to the current ordering." },
    { line: 13, executable: true, explanation: "Explore: fill the remaining positions." },
    { line: 14, executable: true, explanation: "Un-choose: remove it from the ordering." },
    { line: 15, executable: true, explanation: "Clear the used flag so it can appear in other positions." },
    { line: 16, executable: true, explanation: "Start with an empty path and all elements unused." },
    { line: 17, executable: true, explanation: "Return all permutations." },
    { line: 18, executable: false, explanation: "Blank line." },
    { line: 19, executable: true, explanation: "Print all 6 permutations of [1,2,3]." },
  ],

  bindings: [{ variable: "path", model: "recursion" }],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "What distinguishes the permutation template from the subset template — why a `used` array instead of a `start` index?",
      answer: "Permutations use every element and care about order, so we need to revisit earlier elements in later positions — a used array tracks what's placed. Subsets/combinations use a start index to forbid reordering, which is exactly what permutations must allow.",
      explanation: "start prevents going back to earlier indices (no reordering) — right for subsets/combinations. Permutations need all orderings, so used, not start, is the correct bookkeeping.",
    },
  ],

  experiments: [
    "Print path at each completion to watch orderings emerge depth-first.",
    "Remove `used[i] = False` on backtrack and see permutations come out too short.",
    "Compare the count of results with math.factorial(len(nums)).",
  ],

  exercises: [
    {
      id: "dpperm-complete-1",
      kind: "complete-code",
      prompt: "Complete the choose/explore/un-choose block using the used array.",
      starterCode:
        "for i in range(len(nums)):\n    if used[i]:\n        continue\n    # TODO: choose, explore, un-choose\n",
      expected:
        "for i in range(len(nums)):\n    if used[i]:\n        continue\n    used[i] = True\n    path.append(nums[i])\n    bt(path, used)\n    path.pop()\n    used[i] = False",
      hints: [
        "Mark used and append before recursing.",
        "After recursing, undo both.",
        "used[i]=True; path.append(...); bt(...); path.pop(); used[i]=False",
      ],
    },
    {
      id: "dpperm-fix-1",
      kind: "fix-mistake",
      prompt: "This forgets to clear the used flag, producing truncated results. Fix it.",
      starterCode:
        "used[i] = True\npath.append(nums[i])\nbt(path, used)\npath.pop()\n# bug: used[i] stays True",
      expected:
        "used[i] = True\npath.append(nums[i])\nbt(path, used)\npath.pop()\nused[i] = False",
      hints: [
        "After backtracking, element i must be available again.",
        "Undo the used flag too.",
        "used[i] = False",
      ],
    },
    {
      id: "dpperm-predict-1",
      kind: "predict-state",
      prompt: "How many permutations of [1,2,3] are produced, and what is the first one?",
      expected: "6 (=3!). The first is [1, 2, 3], built by choosing 1, then 2, then 3.",
      hints: [
        "3! = 6.",
        "The first element tried is index 0 (value 1).",
        "Depth-first fills 1,2,3 first.",
      ],
    },
  ],

  review: `A **permutation** is an ordering using **every** element once; there are **n!** of them. The backtracking template fills positions left to right, trying each **unused** element with **choose (mark used + append) → explore → un-choose (pop + clear used)**, and records a **copy** at full length. The \`used\` array (not a \`start\` index) is what allows all orderings. It is **O(n·n!)** time and **O(n)** auxiliary space. For \`[1,2,3]\` it yields all 6 orderings.`,

  expectedOutput: "[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]\n",

  references: [
    {
      url: "https://leetcode.com/problems/permutations/editorial/",
      title: "Permutations — LeetCode editorial",
      section: "Backtracking with a used/visited marker",
      topic: "dp/permutations",
      purpose: "Confirm the permutation-backtracking template using a used marker and the n! output size.",
      verifiedClaims: [
        "Backtracking with a used array generates all n! permutations of distinct elements.",
        "Each completed permutation is recorded as a copy.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://en.wikipedia.org/wiki/Permutation",
      title: "Permutation — Wikipedia",
      section: "Number of permutations (n!)",
      topic: "dp/permutations",
      purpose: "Cross-check that n distinct elements have n! orderings.",
      verifiedClaims: [
        "The number of permutations of n distinct objects is n factorial.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "73505332604728e4",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
