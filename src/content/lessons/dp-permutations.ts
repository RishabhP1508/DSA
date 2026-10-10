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
  prerequisites: [
  "dp-backtracking",
  "references-mutation",
  "loops"
],

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
  "purpose": "Enumerate every ordering of a collection — needed when arrangement matters (schedules, sequences, orderings).",
  "operations": "Fill positions left to right; at each, try each unused element, mark/append, recurse, then unmark/pop.",
  "uses": "Generating orderings, brute-force TSP on tiny inputs, anagrams, sequencing/scheduling enumeration, testing all arrangements.",
  "tradeoffs": "n! growth limits this to small n; a used array is O(n) space and O(1) checks. For counting-only questions, avoid materializing permutations.",
  "commonMistakes": "Forgetting to clear used[i] on backtrack (later full orderings are omitted); storing path instead of path[:]; using a start index (that yields combinations, not permutations).",
  "edgeCases": "Empty input yields [[]] (one empty ordering). Duplicate elements need extra skipping to avoid repeated permutations — inputs here are distinct."
},

  complexity: [
    { operation: "permutations (backtracking)", best: "O(n·n!)", average: "O(n·n!)", worst: "O(n·n!)", space: "O(n)", note: "n! orderings, each O(n) to copy; recursion depth O(n)." },
  ],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in nums"
    }
  ],
  "costModel": "At each internal node this code scans all n indices, including used entries. Leaf recording copies n references. List append is amortized O(1); pop and used-array access are O(1).",
  "time": {
    "bound": "O(n·n!)",
    "case": "worst",
    "explanation": "There are n! complete orderings. The internal prefix nodes number Σ_{r=0}^{n−1} n!/(n−r)!, which is O(n!). Scanning n indices at each gives O(n*n!) work; n! leaf copies of length n give the same bound. It is not O(n!) branch work for this full-index-scan implementation. Empty input returns one empty ordering in O(1)."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "Auxiliary space is the recursion depth (n), the path (≤ n), and the used array (n) — all O(n). This excludes the results, which are output.",
    "inputOutputNote": "The results list holds n! permutations of total size O(n·n!) — required output, separate from the O(n) working space."
  },
  "derivation": [
    {
      "lines": [
        5,
        6,
        7
      ],
      "description": "Record each completed permutation (n! times, O(n) copy each).",
      "cost": "O(n·n!)",
      "dimension": "time"
    },
    {
      "lines": [
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15
      ],
      "description": "Every internal prefix scans n indices; O(n!) prefix nodes give O(n*n!) index checks.",
      "cost": "O(n*n!)",
      "dimension": "time"
    },
    {
      "lines": [
        4,
        16
      ],
      "description": "Recursion depth n, path ≤ n, used array n.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Elements are distinct (no duplicate-permutation skipping needed).",
    "The used array correctly enforces each element once.",
    "n is small so n! and the trace stay manageable.",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "Collection contents and scalar sizes meet the stated contract; duplicate-aware variants need additional rules.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "Compared to subsets/combinations (which use a start index to forbid reordering), permutations use a used array to allow all orderings — trading O(n) space for the freedom to revisit earlier elements in later positions.",
  "counters": [
    {
      "label": "permutations recorded",
      "definition": "executions of the record line Recorded line entries at 6 occur before the operation completes.",
      "countLines": [
        6
      ]
    },
    {
      "label": "choices made",
      "definition": "executions of the choose line Recorded line entries at 12 occur before the operation completes.",
      "countLines": [
        12
      ]
    }
  ],
  "fixedDataNote": "permutations([1,2,3]) records 3! = 6 orderings. The O(n·n!) bound describes how that count and copy cost scale with n. Function analysis excludes demonstration input literals, imports, printing and tracer storage. A line event shows the next operation before it completes."
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
  "Delete used[i] = False as a failure experiment: flags remain set after return, so many full orderings are lost. The full-length base case still prevents short results from being recorded.",
  "Compare the count of results with math.factorial(len(nums))."
],

  exercises: [
  {
    "id": "dpperm-complete-1",
    "kind": "complete-code",
    "prompt": "Complete `permutations(nums)` so it returns every ordering of nums (as a list of lists). Fill in the choose/explore/un-choose block using the `used` array.",
    "starterCode": "def permutations(nums):\n    res = []\n    path = []\n    used = [False] * len(nums)\n    def bt():\n        if len(path) == len(nums):\n            res.append(path[:])\n            return\n        for i in range(len(nums)):\n            if used[i]:\n                continue\n            # TODO: choose, explore, un-choose\n            pass\n    bt()\n    return res",
    "expected": "def permutations(nums):\n    res = []\n    path = []\n    used = [False] * len(nums)\n    def bt():\n        if len(path) == len(nums):\n            res.append(path[:])\n            return\n        for i in range(len(nums)):\n            if used[i]:\n                continue\n            used[i] = True\n            path.append(nums[i])\n            bt()\n            path.pop()\n            used[i] = False\n    bt()\n    return res",
    "hints": [
      "Goal: complete the choose/explore/un-choose block using a used[] array to build permutations.",
      "Rescanning for unused elements is fine, but forgetting to undo the marks corrupts later branches.",
      "Key insight: each element must be marked used before recursing and unmarked after, so it's available again.",
      "Approach: skip used elements, then mark+append, recurse, and undo both on return.",
      "Pseudocode: for each i: if used[i] skip; set used[i]=True; append nums[i]; recurse; pop; set used[i]=False.",
      "Write `used[i]=True; path.append(nums[i]); bt(...); path.pop(); used[i]=False` around the recursion."
    ],
    "tests": "got = sorted(tuple(p) for p in permutations([1, 2, 3]))\nexpected = sorted([(1, 2, 3), (1, 3, 2), (2, 1, 3), (2, 3, 1), (3, 1, 2), (3, 2, 1)])\nassert got == expected, f'all 6 permutations, got {got}'\nassert all(len(p) == 3 for p in permutations([1, 2, 3])), 'each permutation uses all elements'\n# A different-size input so a hard-coded result cannot pass.\nassert sorted(tuple(p) for p in permutations([1, 2])) == [(1, 2), (2, 1)], 'two-element permutations'\nassert permutations([7]) == [[7]], 'singleton'\nassert permutations([]) == [[]], 'empty input -> the empty permutation'\nprint('OK')"
  },
  {
    "id": "dpperm-fix-1",
    "kind": "fix-mistake",
    "prompt": "For a list of distinct values, permutations(nums) should return every full ordering. The used flag is never cleared on backtrack, so later orderings are missing. Restore the flag after exploring each choice.",
    "starterCode": "def permutations(nums):\n    res = []\n    path = []\n    used = [False] * len(nums)\n    def bt():\n        if len(path) == len(nums):\n            res.append(path[:])\n            return\n        for i in range(len(nums)):\n            if used[i]:\n                continue\n            used[i] = True\n            path.append(nums[i])\n            bt()\n            path.pop()\n            # bug: used[i] stays True\n    bt()\n    return res",
    "expected": "def permutations(nums):\n    res = []\n    path = []\n    used = [False] * len(nums)\n    def bt():\n        if len(path) == len(nums):\n            res.append(path[:])\n            return\n        for i in range(len(nums)):\n            if used[i]:\n                continue\n            used[i] = True\n            path.append(nums[i])\n            bt()\n            path.pop()\n            used[i] = False\n    bt()\n    return res",
    "hints": [
      "Goal: fix the permutation search so it stops producing missing full orderings.",
      "The bug leaves used[i] set after backtracking, so element i stays unavailable and branches come up short.",
      "Key insight: on backtrack, element i must be freed so sibling permutations can use it again.",
      "Approach: mirror every used[i]=True with a used[i]=False after the recursive call.",
      "Pseudocode: mark used[i]; append; recurse; pop; then clear used[i].",
      "Add `used[i] = False` after popping so the element becomes available again."
    ],
    "tests": "# The buggy version never clears used[i] on backtrack, so after taking the\n# first element every deeper slot stays blocked and most orderings are lost.\ngot = sorted(tuple(p) for p in permutations([1, 2, 3]))\nexpected = sorted([(1, 2, 3), (1, 3, 2), (2, 1, 3), (2, 3, 1), (3, 1, 2), (3, 2, 1)])\nassert got == expected, f'all 6 permutations (buggy omits orderings), got {got}'\nassert sorted(tuple(p) for p in permutations([1, 2])) == [(1, 2), (2, 1)], 'two-element permutations'\nassert permutations([7]) == [[7]], 'singleton'\nassert permutations([]) == [[]], 'empty input -> the empty permutation'\nprint('OK')"
  },
  {
    "id": "dpperm-predict-1",
    "kind": "predict-state",
    "prompt": "How many permutations of [1,2,3] are produced, and what is the first one?",
    "expected": "6 (=3!). The first is [1, 2, 3], built by choosing 1, then 2, then 3.",
    "hints": [
      "3! = 6.",
      "The first element tried is index 0 (value 1).",
      "Depth-first fills 1,2,3 first."
    ]
  }
],

  review: `A **permutation** is an ordering using **every** element once; there are **n!** of them. The backtracking template fills positions left to right, trying each **unused** element with **choose (mark used + append) → explore → un-choose (pop + clear used)**, and records a **copy** at full length. The \`used\` array (not a \`start\` index) is what allows all orderings. It is **O(n·n!)** time and **O(n)** auxiliary space. For \`[1,2,3]\` it yields all 6 orderings.`,

  expectedOutput: "[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]\n",

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
    "section": "Classic exhaustive permutation pattern",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Trying every remaining unused element enumerates n! orderings."
    ],
    "conventions": [
      "Source copies strings of remaining choices; app scans a fixed n-index used array and counts that work."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://leetcode.com/problems/permutations/description/",
    "title": "LeetCode: Permutations",
    "section": "Problem definition, examples and constraints",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Inputs are distinct; output consists of every full ordering."
    ],
    "conventions": [
      "Empty-input extension is one empty ordering."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "ecc9a873462f66b2",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
