/**
 * Pattern: Backtracking.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# Backtracking: enumerate all subsets (choose / explore / un-choose).
def subsets(nums):
    res = []
    def bt(start, path):
        res.append(path[:])            # record the current partial choice
        for i in range(start, len(nums)):
            path.append(nums[i])       # CHOOSE nums[i]
            bt(i + 1, path)            # EXPLORE further choices
            path.pop()                 # UN-CHOOSE (backtrack)
    bt(0, [])
    return res

print(subsets([1, 2, 3]))`;

export const backtrackingPattern: PatternDefinition = {
  id: "backtracking",
  title: "Backtracking",
  category: "Recursion & search",
  summary:
    "Build candidates incrementally with choose/explore/un-choose, pruning branches that can't lead to a valid solution.",

  clues: [
    "You must ENUMERATE all valid configurations, or find one satisfying constraints.",
    "The answer is built from a sequence of choices (place/pick/assign), each constrained by earlier ones.",
    "Phrases like 'all subsets/permutations/combinations', 'generate all…', 'N-Queens', 'Sudoku', 'word search', 'partition'.",
    "You can check partial validity early to avoid exploring doomed branches (pruning).",
  ],

  naiveApproach: `Generate every possible full candidate and then filter the valid ones. For subsets that means all 2ⁿ; for arrangements, all nⁿ placements before checking legality. This wastes enormous effort building candidates that a single early check would have rejected.`,

  whyItHelps: `Backtracking is a **depth-first search over a tree of choices** with three beats: **choose** an option, **explore** by recursing, then **un-choose** to restore state and try the next option. Because you extend a *partial* candidate step by step, you can **prune** the moment a partial can't possibly succeed (an illegal placement, an exceeded budget), cutting away whole subtrees. Extra space is just the **recursion depth plus the current partial candidate — O(depth)**, not the total number of solutions. Pruning quality, not the template, determines real-world speed.`,

  conditions: [
    "Solutions decompose into a sequence of choices with checkable constraints.",
    "State changes are UNDOABLE (append/pop, add/remove from a set) so siblings start clean — always pair a 'choose' with its 'un-choose'.",
    "Record a COPY of the partial (path[:]) when saving a solution, since the working list is mutated in place.",
    "Use a start index (subsets/combinations) or a used-set (permutations) to avoid duplicates.",
  ],

  alternatives: [
    "Dynamic programming — when you only need a COUNT or an OPTIMUM over the choices (overlapping subproblems), not every explicit configuration.",
    "BFS/DFS on an explicit graph — when the 'choices' are graph edges rather than constructed candidates.",
    "Iterative bitmask enumeration — a compact alternative for subsets when n is small.",
  ],

  counterexamples: [
    "'How many ways…' or 'the maximum value…' usually wants DP, not an explicit enumeration of all candidates.",
    "Forgetting to un-choose (pop) leaks state between branches and corrupts results — a bug, not a different pattern.",
    "Appending the live list instead of a copy makes every recorded solution alias the same (eventually empty) list.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]\n",
  complexityNote:
    "Subsets: O(n·2ⁿ) time (2ⁿ subsets, each up to O(n) to copy) and O(n) auxiliary space (recursion depth + current path), separate from the output.",

  complexityExplanation: {
    variables: [{ symbol: "n", meaning: "the number of elements in nums" }],
    costModel: "Each of the 2ⁿ subsets is generated once; recording it copies up to n elements. Recursion depth is at most n.",
    time: {
      bound: "O(n·2ⁿ)",
      case: "worst",
      explanation: "There are 2ⁿ subsets. The recursion visits each once (lines 6-9), and recording a subset copies up to n elements (line 5, path[:]). So total work is O(n·2ⁿ). This is output-bound: producing 2ⁿ subsets of size up to n cannot be cheaper.",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "Auxiliary space is the recursion stack (depth <= n) plus the current `path` (length <= n). This EXCLUDES the result list.",
      inputOutputNote: "The output `res` holds 2ⁿ subsets totalling O(n·2ⁿ) — that is output storage, separate from the O(n) auxiliary space.",
    },
    derivation: [
      { lines: [5], description: "Copy the current path into the result — O(n) per subset.", cost: "O(n)", dimension: "time" },
      { lines: [6, 7, 8, 9], description: "Choose/explore/un-choose over the 2ⁿ subset tree.", cost: "O(2ⁿ)", dimension: "time" },
      { lines: [4, 7], description: "Recursion depth + current path, both <= n.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Appending/popping a list end is amortised O(1).", "Copying path[:] is O(len(path)) <= O(n)."],
    tradeoffs: "Iterative bitmask enumeration also lists subsets in O(n·2ⁿ) but with O(1) recursion depth; backtracking generalises cleanly to permutations/combinations with pruning.",
    counters: [{ label: "subsets recorded", definition: "executions of res.append (line 5)", countLines: [5] }],
    fixedDataNote: "For [1,2,3] there are 2³ = 8 subsets; the recorded count is 8. The O(n·2ⁿ) bound generalises.",
  },

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: enumerate subsets via choose/explore/un-choose." },
    { line: 2, executable: true, explanation: "Define subsets(nums)." },
    { line: 3, executable: true, explanation: "Collect all subsets." },
    { line: 4, executable: true, explanation: "Inner backtracker: start index and current path." },
    { line: 5, executable: true, explanation: "Record a COPY of the current path — it is itself a valid subset." },
    { line: 6, executable: true, explanation: "Consider each remaining element from start onward." },
    { line: 7, executable: true, explanation: "Choose element i by appending it." },
    { line: 8, executable: true, explanation: "Explore deeper starting at i+1 (no reuse, no duplicate subsets)." },
    { line: 9, executable: true, explanation: "Un-choose (pop) so the next iteration starts from a clean state." },
    { line: 10, executable: true, explanation: "Start from index 0 with an empty path." },
    { line: 11, executable: true, explanation: "Return every subset." },
    { line: 12, executable: false, explanation: "Blank line." },
    { line: 13, executable: true, explanation: "The power set of [1,2,3] — 8 subsets." },
  ],

  bindings: [{ variable: "path", model: "recursion" }],

  linkedLessons: ["dp-backtracking", "dp-subsets", "dp-permutations", "dp-combinations", "dp-n-queens"],

  exercises: [
    {
      id: "pat-bt-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Generate all permutations of a list of distinct numbers.' Which pattern, and what bookkeeping avoids reusing an element?",
      expected:
        "Backtracking. Fill positions one at a time, trying each UNUSED element (a used-array marks placed elements), with choose/explore/un-choose. Produces all n! orderings; O(n) auxiliary space.",
      correctPatternId: "backtracking",
      hints: [
        "Build the arrangement one position at a time.",
        "Track which elements are already placed.",
        "choose (mark used + append) → explore → un-choose.",
      ],
    },
    {
      id: "pat-bt-choose-1",
      kind: "choose-approach",
      prompt:
        "Two problems: (a) 'list every subset that sums to a target'; (b) 'how MANY subsets sum to a target'. Same pattern?",
      expected:
        "(a) Backtracking — you must produce each explicit subset. (b) Usually dynamic programming (subset-sum count) — you only need a count, which has overlapping subproblems and doesn't require enumerating all subsets.",
      correctPatternId: "backtracking",
      hints: [
        "Enumerate explicitly → backtracking.",
        "Just a count/optimum → DP.",
        "Overlapping subproblems favor DP.",
      ],
    },
    {
      id: "pat-bt-fix-1",
      kind: "fix-mistake",
      prompt:
        "Every recorded subset comes out as [] because of an aliasing bug. Fix it.",
      starterCode:
        "def bt(start, path):\n    res.append(path)\n    for i in range(start, len(nums)):\n        path.append(nums[i])\n        bt(i + 1, path)\n        path.pop()",
      expected:
        "def bt(start, path):\n    res.append(path[:])\n    for i in range(start, len(nums)):\n        path.append(nums[i])\n        bt(i + 1, path)\n        path.pop()",
      hints: [
        "path is one mutable list reused across the search.",
        "Storing it directly makes all results alias the same list.",
        "Record a snapshot: res.append(path[:]).",
      ],
    },
  ],

  references: [
    {
      url: "https://en.wikipedia.org/wiki/Backtracking",
      title: "Backtracking — Wikipedia",
      section: "General method; pruning partial candidates",
      topic: "patterns/backtracking",
      purpose: "Confirm the incremental build-and-abandon method and depth-first structure with pruning.",
      verifiedClaims: [
        "Backtracking builds candidates incrementally and abandons a partial as soon as it cannot be completed to a valid solution.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://leetcode.com/problems/subsets/editorial/",
      title: "Subsets — LeetCode editorial",
      section: "Backtracking template with a start index",
      topic: "patterns/backtracking",
      purpose: "Cross-check the choose/explore/un-choose template and the start-index duplicate avoidance.",
      verifiedClaims: [
        "Backtracking with a start index enumerates each of the 2ⁿ subsets once; the current path is recorded as a copy.",
      ],
      accessDate: "2026-09-20",
    },
  ],
};
