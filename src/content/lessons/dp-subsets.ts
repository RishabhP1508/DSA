/**
 * Lesson: Backtracking — subsets / power set (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly
 * "[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# All subsets (the power set) of a list of distinct numbers.
def subsets(nums):
    res = []
    def bt(start, path):
        res.append(path[:])          # every node is itself a valid subset
        for i in range(start, len(nums)):
            path.append(nums[i])     # CHOOSE nums[i]
            bt(i + 1, path)          # EXPLORE with i+1 (no reuse, no duplicates)
            path.pop()               # UN-CHOOSE (backtrack)
    bt(0, [])
    return res

print(subsets([1, 2, 3]))`;

export const dpSubsets: LessonDefinition = {
  id: "dp-subsets",
  title: "Backtracking: Subsets (Power Set)",
  area: "DP and recursion",
  prerequisites: [
  "dp-backtracking",
  "references-mutation",
  "loops"
],

  explanation: `The **power set** is the collection of **all subsets** of a set, including the empty set and the set itself. For n distinct elements there are exactly **2ⁿ** subsets, because each element is independently either **in** or **out**. Generating them is the canonical **subset backtracking** pattern.

This solution builds subsets by scanning forward with a \`start\` index. At each recursive node, the current \`path\` **is already a valid subset**, so we record a **copy** of it immediately. Then, for each later element (from \`start\` onward), we **choose** it (append), **explore** deeper starting from \`i + 1\` (so each element is used at most once and we never produce the same subset in two orders), and **un-choose** it (pop) before trying the next element. The \`i + 1\` start is what prevents duplicates like \`[1,2]\` and \`[2,1]\` — subsets are unordered, so we fix a single increasing order.

Recording \`path[:]\` (a **copy**) rather than \`path\` itself is essential: \`path\` is a single mutable list reused across the whole search, so storing it directly would leave every result pointing at the same list that ends up empty. The output order here is depth-first: \`[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]\`. Cost is **O(n·2ⁿ)** time (2ⁿ subsets, each up to length n to copy) and **O(n)** auxiliary space for the recursion depth and current path — the 2ⁿ output is separate.`,

  vocabulary: [
    { term: "Subset", definition: "Any selection of elements from a set, including none or all of them." },
    { term: "Power set", definition: "The set of all 2ⁿ subsets of an n-element set." },
    { term: "start index", definition: "The position to consider next, preventing element reuse and duplicate subsets." },
    { term: "path copy", definition: "path[:] stores a snapshot; storing path itself would alias the mutable list." },
    { term: "choose / un-choose", definition: "Append an element then pop it after recursing, the backtracking rhythm." },
  ],

  concepts: {
    purpose:
      "Enumerate every subset of a collection — a building block for problems that must consider all combinations of include/exclude.",
    operations:
      "Record the current path as a subset; for each remaining index, choose it, recurse from the next index, then un-choose.",
    uses:
      "Power set generation, subset-sum enumeration, feature/team selection, combinations (a size-restricted variant), bitmask DP setup.",
    tradeoffs:
      "Exhaustive: 2ⁿ subsets are unavoidable if you truly need all of them; use pruning or DP if you only need an aggregate (e.g. a count or a best).",
    commonMistakes:
      "Appending path instead of path[:] (all results alias one list); starting the inner loop at 0 instead of start (duplicates); forgetting path.pop() (state leaks).",
    edgeCases:
      "Empty input yields [[]] (just the empty subset). Duplicate elements would need extra handling to avoid repeated subsets — here inputs are distinct.",
  },

  complexity: [
    { operation: "power set (backtracking)", best: "O(n·2ⁿ)", average: "O(n·2ⁿ)", worst: "O(n·2ⁿ)", space: "O(n)", note: "2ⁿ subsets, each up to length n to copy; recursion depth O(n)." },
  ],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in nums"
    }
  ],
  "costModel": "There are exactly 2^n recursive nodes and 2^n−1 child choices. Each node copies its path, whose total element count is n·2^(n−1) for n≥1. List-end append is amortized O(1); pop and reference indexing are O(1).",
  "time": {
    "bound": "O(n·2ⁿ)",
    "case": "worst",
    "explanation": "Every subset occurs once with increasing indices. Across all subsets, each of n elements appears in exactly 2^(n−1) copies, so output element copies are n·2^(n−1). Including 2^n list headers gives O((n+1)2^n), conventionally O(n2^n) for n≥1; empty input takes O(1)."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "Auxiliary space is the recursion depth (at most n) plus the single reused path (at most n). This excludes the results list, which is output.",
    "inputOutputNote": "The results list holds 2ⁿ subsets of total size O(n·2ⁿ) — required output, separate from the O(n) working space."
  },
  "derivation": [
    {
      "lines": [
        5
      ],
      "description": "Record a copy of the current subset at every node (2ⁿ times, O(n) each).",
      "cost": "O(n·2ⁿ)",
      "dimension": "time"
    },
    {
      "lines": [
        6,
        7,
        8,
        9
      ],
      "description": "Choose/explore/un-choose loop drives the 2ⁿ branching.",
      "cost": "O(2ⁿ)",
      "dimension": "time"
    },
    {
      "lines": [
        4
      ],
      "description": "Recursion depth ≤ n plus a single path of length ≤ n.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Elements are distinct, so no duplicate subsets arise.",
    "start = i + 1 prevents reuse and duplicate orderings.",
    "path[:] copies the current subset before storing it.",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "Collection contents and scalar sizes meet the stated contract; duplicate-aware variants need additional rules.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "A count or optimum can sometimes be computed by DP without storing every subset, if a useful bounded state exists. Aggregation alone does not guarantee polynomial time. Explicitly returning all subsets still requires their output storage.",
  "counters": [
    {
      "label": "subsets recorded",
      "definition": "executions of the record line Recorded line entries at 5 occur before the operation completes.",
      "countLines": [
        5
      ]
    },
    {
      "label": "choices made",
      "definition": "executions of the append/choose line Recorded line entries at 7 occur before the operation completes.",
      "countLines": [
        7
      ]
    }
  ],
  "fixedDataNote": "subsets([1,2,3]) records 2³ = 8 subsets. The O(n·2ⁿ) bound describes how that count and copy cost scale with n. Function analysis excludes demonstration input literals, imports, printing and tracer storage. A line event shows the next operation before it completes."
},

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: generate the power set." },
    { line: 2, executable: true, explanation: "Define subsets(nums)." },
    { line: 3, executable: true, explanation: "Collect all subsets here." },
    { line: 4, executable: true, explanation: "Inner backtracker: start index and current path." },
    { line: 5, executable: true, explanation: "Record a COPY of the current path — it is already a valid subset." },
    { line: 6, executable: true, explanation: "Consider each element from start onward." },
    { line: 7, executable: true, explanation: "Choose element i by appending it to the path." },
    { line: 8, executable: true, explanation: "Explore deeper starting at i+1 so each element is used at most once." },
    { line: 9, executable: true, explanation: "Un-choose (backtrack) so the next iteration starts clean." },
    { line: 10, executable: true, explanation: "Begin from index 0 with an empty path." },
    { line: 11, executable: true, explanation: "Return every subset." },
    { line: 12, executable: false, explanation: "Blank line." },
    { line: 13, executable: true, explanation: "Print the power set of [1,2,3] (8 subsets)." },
  ],

  bindings: [{ variable: "path", model: "recursion" }],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "Why must we store path[:] instead of path, and why does the inner loop start at `start` (not 0)?",
      answer: "path[:] stores a snapshot; storing path aliases the one mutable list that is later emptied, so all results would look identical. Starting at `start` (using i+1 when recursing) stops elements from being reused and prevents duplicate subsets like [1,2] and [2,1].",
      explanation: "The copy protects against aliasing; the increasing start index fixes a single ordering per subset so each appears once.",
    },
  ],

  experiments: [
  "Print path at each node to watch subsets grow and shrink as it backtracks.",
  "Replace bt(i + 1, path) with bt(i, path) only as a failure experiment: the same index remains eligible forever, so there is no progress and Python raises RecursionError or the app stops at a trace limit. It is not a valid reusable-choice generator without a remaining target or depth bound.",
  "Count the results and confirm it equals 2**len(nums)."
],

  exercises: [
    {
      id: "dpss-complete-1",
      kind: "complete-code",
      prompt: "Complete the choose/explore/un-choose loop for subsets.",
      starterCode:
        "def bt(start, path):\n    res.append(path[:])\n    for i in range(start, len(nums)):\n        # TODO: choose, explore from i+1, un-choose\n        pass",
      expected:
        "def bt(start, path):\n    res.append(path[:])\n    for i in range(start, len(nums)):\n        path.append(nums[i])\n        bt(i + 1, path)\n        path.pop()",
      hints: [
        "Append the element, recurse, then pop.",
        "Recurse from i+1 to avoid reuse.",
        "path.append(...); bt(i + 1, path); path.pop()",
      ],
    },
    {
      id: "dpss-fix-1",
      kind: "fix-mistake",
      prompt: "This stores the same list repeatedly so every subset prints as []. Fix it.",
      starterCode:
        "def bt(start, path):\n    res.append(path)\n    for i in range(start, len(nums)):\n        path.append(nums[i])\n        bt(i + 1, path)\n        path.pop()",
      expected:
        "def bt(start, path):\n    res.append(path[:])\n    for i in range(start, len(nums)):\n        path.append(nums[i])\n        bt(i + 1, path)\n        path.pop()",
      hints: [
        "path is one mutable list shared across the search.",
        "Store a snapshot, not the live list.",
        "res.append(path[:])",
      ],
    },
    {
      id: "dpss-predict-1",
      kind: "predict-state",
      prompt: "How many subsets does subsets([1,2,3]) produce, and what is the first and last one?",
      expected: "8 subsets. First is [] (recorded before any choice); last is [3].",
      hints: [
        "2**3 = 8.",
        "The empty path is recorded first.",
        "Depth-first order ends at [3].",
      ],
    },
  ],

  review: `The **power set** has **2ⁿ** subsets (each element in or out). The subset-backtracking pattern records the current \`path\` as a subset at every node, then loops over remaining elements with **choose → explore (from i+1) → un-choose**. Two rules are essential: store \`path[:]\` (a **copy**, not the aliased list) and recurse from \`i + 1\` (no reuse, no duplicates). It is **O(n·2ⁿ)** time and **O(n)** auxiliary space. For \`[1,2,3]\` it yields all 8 subsets.`,

  expectedOutput: "[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]\n",

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
    "section": "Classic exhaustive subset pattern",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Include/exclude decisions enumerate all 2^n subsets."
    ],
    "conventions": [
      "The app uses increasing-index DFS and shared append/pop rather than copied C++ strings."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://leetcode.com/problems/subsets/description/",
    "title": "LeetCode: Subsets",
    "section": "Problem definition, examples and constraints",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Distinct input values are required for unique value subsets; every subset is returned."
    ],
    "conventions": [
      "App additionally allows empty input and chooses DFS output order."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "c0d4723aa0315815",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
