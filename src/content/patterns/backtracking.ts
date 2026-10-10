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

  naiveApproach: "For constrained arrangements, one baseline generates all n^n row/column choices before filtering for validity. Early constraint tests can avoid building doomed completions. For the power set of distinct items, every subset is valid and all 2^n outputs are required; there is no invalid-subset pruning saving to claim.",

  whyItHelps: "Explore a tree of partial choices depth first. Choose a value, recurse, and restore any shared mutation before the next sibling. If a proven constraint shows that a prefix cannot succeed, prune its whole subtree; without such a constraint, enumeration still visits all required outputs. A shared path with constant-sized frame locals uses O(depth) working slots. Copied immutable prefixes can retain additional memory in ancestor frames. The shown subsets implementation uses one shared path and copies it only when recording each result, so its auxiliary storage is O(n) while its exponential output is separate.",

  conditions: [
  "Solutions decompose into a sequence of choices with checkable constraints.",
  "State changes are UNDOABLE (append/pop, add/remove from a set) so siblings start clean — always pair a 'choose' with its 'un-choose'.",
  "Record a COPY of the partial (path[:]) when saving a solution, since the working list is mutated in place.",
  "An increasing start index prevents duplicate index orderings for subsets; a used array prevents index reuse in permutations. Unique value outputs additionally require distinct input values or skip-equal-siblings rules."
],

  alternatives: [
  "DP can aggregate counts/optima when a useful bounded state exists. A feasibility/count table can also guide enumeration, but cannot replace the work of emitting every requested configuration.",
  "BFS/DFS on an explicit graph — when the 'choices' are graph edges rather than constructed candidates.",
  "Iterative bitmask enumeration — a compact alternative for subsets when n is small."
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
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in nums"
    }
  ],
  "costModel": "Each of the 2ⁿ subsets is generated once; recording it copies up to n elements. Recursion depth is at most n.",
  "time": {
    "bound": "O(n·2ⁿ)",
    "case": "worst",
    "explanation": "There are 2ⁿ subsets. The recursion visits each once (lines 6-9), and recording a subset copies up to n elements (line 5, path[:]). So total work is O(n·2ⁿ). This is output-bound: producing 2ⁿ subsets of size up to n cannot be cheaper."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "Auxiliary space is the recursion stack (depth <= n) plus the current `path` (length <= n). This EXCLUDES the result list.",
    "inputOutputNote": "The output `res` holds 2ⁿ subsets totalling O(n·2ⁿ) — that is output storage, separate from the O(n) auxiliary space."
  },
  "derivation": [
    {
      "lines": [
        5
      ],
      "description": "Copy the current path into the result — O(n) per subset.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        6,
        7,
        8,
        9
      ],
      "description": "Choose/explore/un-choose over the 2ⁿ subset tree.",
      "cost": "O(2ⁿ)",
      "dimension": "time"
    },
    {
      "lines": [
        4,
        7
      ],
      "description": "Recursion depth + current path, both <= n.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Appending/popping a list end is amortised O(1).",
    "Copying path[:] is O(len(path)) <= O(n).",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "Input elements are distinct for unique value subsets. n=0 returns one empty subset.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "Iterative bitmask enumeration also lists subsets in O(n·2ⁿ) but with O(1) recursion depth; backtracking generalises cleanly to permutations/combinations with pruning.",
  "counters": [
    {
      "label": "subsets recorded",
      "definition": "executions of res.append Recorded line entries at 5 occur before the operation completes.",
      "countLines": [
        5
      ]
    }
  ],
  "fixedDataNote": "For [1,2,3] there are 2³ = 8 subsets; the recorded count is 8. The O(n·2ⁿ) bound generalises. Function analysis excludes demonstration input literals, imports, printing and tracer storage. A line event shows the next operation before it completes."
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
    "id": "pat-bt-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'Generate all permutations of a list of distinct numbers.' Which pattern, and what bookkeeping avoids reusing an element?",
    "expected": "Backtracking. Fill positions one at a time, trying each UNUSED element (a used-array marks placed elements), with choose/explore/un-choose. Produces all n! orderings; O(n) auxiliary space.",
    "correctPatternId": "backtracking",
    "hints": [
      "Goal: generate all permutations of a list of distinct numbers.",
      "The cost is producing every one of the n! orderings without accidentally reusing an element.",
      "Key insight: track which elements are already placed so each position uses an unused element.",
      "Approach: backtrack, filling one position at a time with choose/explore/un-choose and a used-array.",
      "Pseudocode: if path full record it; for each unused i: mark used, append; recurse; pop, unmark.",
      "Use backtracking with a used-array: choose (mark used + append), explore, then un-choose to produce all n! orderings."
    ],
    "recognition": {
      "scenario": "Generate ALL permutations of a list of distinct numbers.",
      "approaches": [
        {
          "id": "backtracking",
          "label": "Backtracking (choose / explore / un-choose)",
          "requiredReasonIds": [
            "enumerate-with-used"
          ]
        },
        {
          "id": "dp",
          "label": "A DP count without enumeration",
          "requiredReasonIds": [],
          "rejectionFeedback": "A count alone does not return the requested arrangements. DP can guide a later traversal, but the traversal must still emit every permutation."
        }
      ],
      "reasons": [
        {
          "id": "enumerate-with-used",
          "text": "You must produce every arrangement, filling positions one at a time and marking placed elements with a used-array to avoid reuse — all n! orderings."
        },
        {
          "id": "count-only",
          "text": "Only the number of permutations is needed, so a closed-form count suffices.",
          "contradictory": true
        },
        {
          "id": "overlapping-sub",
          "text": "A cached scalar count alone returns all explicit permutations without generating them.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "backtracking"
      ],
      "modelExplanation": "Backtracking: build each permutation by choosing an unused element per position, recursing, then un-choosing — enumerating all n! orderings with O(n) auxiliary space."
    }
  },
  {
    "id": "pat-bt-choose-1",
    "kind": "choose-approach",
    "prompt": "Two problems: (a) 'list every subset that sums to a target'; (b) 'how MANY subsets sum to a target'. Same pattern? Assume distinct non-negative integer values and a bounded non-negative target.",
    "expected": "(a) Backtracking emits the explicit subsets; a DP feasibility table may guide that traversal. (b) Subset-sum count DP over item index and sum can avoid enumerating each subset, with pseudo-polynomial cost in the numeric target. Neither a scalar count nor feasibility alone returns every configuration.",
    "correctPatternId": "backtracking",
    "hints": [
      "Compare the requested outputs: explicit subsets in (a), but a single count in (b).",
      "Listing must emit every qualifying configuration. A scalar count cannot supply the list.",
      "Finite include/exclude choices over the item positions can enumerate the subsets.",
      "Use backtracking for explicit output; bounded non-negative counting can use DP over item index and sum. A feasibility table may guide enumeration.",
      "Enumeration pseudocode: decide include or exclude for the next position, explore both, and copy the chosen positions at a qualifying leaf. Counting DP instead combines counts from the two choices and is pseudo-polynomial in the numeric target."
    ],
    "recognition": {
      "scenario": "Two problems: (a) 'list every subset that sums to a target'; (b) 'how MANY subsets sum to a target'. Same pattern? Assume distinct non-negative integer values and a bounded non-negative target.",
      "approaches": [
        {
          "id": "backtracking",
          "label": "Backtracking",
          "requiredReasonIds": [
            "must-enumerate"
          ]
        },
        {
          "id": "dp",
          "label": "Subset-sum counts alone",
          "requiredReasonIds": [],
          "rejectionFeedback": "Counts alone answer (b), not the requested list in (a). DP can be combined with a reconstruction/enumeration traversal."
        }
      ],
      "reasons": [
        {
          "id": "must-enumerate",
          "text": "Problem (a) demands each explicit subset, so you must enumerate configurations via choose/explore/un-choose."
        },
        {
          "id": "count-suffices",
          "text": "Only a count is required, so overlapping subproblems make DP ideal.",
          "contradictory": true
        },
        {
          "id": "greedy-works",
          "text": "A greedy pass produces every qualifying subset directly.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "backtracking"
      ],
      "modelExplanation": "(a) Backtracking emits the explicit subsets; a DP feasibility table may guide that traversal. (b) Subset-sum count DP over item index and sum can avoid enumerating each subset, with pseudo-polynomial cost in the numeric target. Neither a scalar count nor feasibility alone returns every configuration."
    }
  },
  {
    "id": "pat-bt-fix-1",
    "kind": "fix-mistake",
    "prompt": "`subsets(nums)` returns every subset of `nums` (as lists). Every recorded subset comes out as [] because of an aliasing bug. Fix it.",
    "starterCode": "def subsets(nums):\n    res = []\n    def bt(start, path):\n        res.append(path)\n        for i in range(start, len(nums)):\n            path.append(nums[i])\n            bt(i + 1, path)\n            path.pop()\n    bt(0, [])\n    return res",
    "expected": "def subsets(nums):\n    res = []\n    def bt(start, path):\n        res.append(path[:])\n        for i in range(start, len(nums)):\n            path.append(nums[i])\n            bt(i + 1, path)\n            path.pop()\n    bt(0, [])\n    return res",
    "hints": [
      "Goal: fix the subset search so results aren't all empty from an aliasing bug.",
      "The bug records the same mutable list each time, so every result aliases one list that ends empty.",
      "Key insight: path is one shared list mutated across the search, so it must be snapshotted when recorded.",
      "Approach: store a copy of path instead of the live list, keeping the choose/recurse/pop loop.",
      "Pseudocode: record path[:]; for i from start: append nums[i]; recurse(i+1); pop.",
      "Record a snapshot with `res.append(path[:])` so results don't alias the shared list."
    ],
    "tests": "assert sorted(subsets([1, 2]), key=lambda s: (len(s), s)) == [[], [1], [2], [1, 2]]\nassert subsets([]) == [[]], 'only the empty subset'\nassert sorted(subsets([5]), key=len) == [[], [5]]\ng = sorted(subsets([1, 2, 3]), key=lambda s: (len(s), s))\nassert g == [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]], f'all 8 subsets, got {g}'\nprint('OK')"
  }
],

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
    "url": "https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1258/lectures/11-backtracking1/",
    "title": "Stanford CS106B: recursive backtracking",
    "section": "Choose/explore/unchoose, subsets and string-by-value notes",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Mutable shared paths must be restored for siblings; by-value strings need no explicit undo; output copies contribute to subset enumeration cost."
    ],
    "conventions": [
      "Python shared-list append/pop is paired; immutable prefix strings remain in separate live frames."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://see.stanford.edu/materials/icspacs106b/H19-RecBacktrackExamples.pdf",
    "title": "Stanford CS106B handout 19",
    "section": "Exhaustive permutation/subset patterns and first-solution backtracking",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Shared choice state must be restored; exhaustive generation and first-solution search have different stopping rules."
    ],
    "conventions": [],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "f83b6405b48aff4a",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
