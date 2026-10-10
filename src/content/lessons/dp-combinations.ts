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
        for i in range(start, n - (k - len(path)) + 2):
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
  prerequisites: [
  "dp-subsets",
  "references-mutation",
  "loops"
],

  explanation: "A **combination** is a selection of `k` items where **order does not matter** — `{1,2}` and `{2,1}` are the same combination. The number of ways to choose k from n is the binomial coefficient **C(n, k) = n! / (k!·(n−k)!)**. Combinations are subsets **restricted to a fixed size k**, so the backtracking template is almost identical to the subset one — the difference is a **size check** instead of recording at every node.\n\nThe key to avoiding duplicates (like `[1,2]` and `[2,1]`) is the same **increasing `start` index** used for subsets: each recursion considers only elements **after** the one just chosen (`i + 1`), so every combination is generated in a single increasing order exactly once. We record a **copy** of `path` only when its length reaches `k`. The backtracking rhythm is unchanged: **choose `i`, explore from `i + 1`, un-choose**.\n\n**Adapting to \"Combination Sum\" (reuse + a target).** A common variant asks for all combinations of candidates that **sum to a target**, where each candidate may be **reused any number of times**. Two small changes to this template do it. (1) **Allow reuse:** recurse with the **same index** `bt(i, ...)` instead of `bt(i + 1, ...)`, so `i` can be chosen again; the non-decreasing start index still prevents permutation-duplicates like `[2,3]` vs `[3,2]`. (2) **Drive by a remaining target instead of a size `k`:** subtract the chosen value from `remaining`, record `path` when `remaining == 0`, and **prune** the branch when `remaining < 0` (the running sum overshot). **Correctness condition:** recursing from `i` (not `i+1`) is what permits reuse, and keeping the start index non-decreasing is what stops the same multiset being emitted in different orders — drop either and you get wrong results (no reuse, or duplicate orderings). **Two preconditions this argument relies on.** (a) The candidates must be **strictly positive**: the `remaining < 0` prune — and the termination of the whole search — only work because every choice *decreases* `remaining`. A **zero** candidate never decreases `remaining`, so reusing it (recurse from `i`) loops forever without ever crossing below 0; a **negative** candidate *increases* `remaining`, so it can never overshoot and the recursion likewise never terminates. (b) The candidates must be **distinct values**: the \"each combination once\" argument assumes each candidate is a distinct value, so a single non-decreasing order maps to one multiset. If the input had **duplicate values**, that alone would emit the same multiset more than once, and you would need an extra guard (skip equal siblings at the same depth) to keep results unique — the plain template does not. (LeetCode's Combination Sum guarantees distinct positive candidates, which is exactly why the plain adaptation is correct there.)\n\nThe displayed function includes **pruning**: if there aren't enough remaining numbers to reach size k, stop early — you can cap the loop at `n - (k - len(path)) + 1`. For `combine(4, 2)` the six combinations are `[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]`. For 0≤k≤n, the pruned code uses O((k+1)C(n,k)) time and O(k+1) auxiliary storage, including the k=0 case. Impossible k>n returns immediately. Recognizing \"choose k, order irrelevant\" → combinations, versus \"arrange all, order matters\" → permutations, is the reusable takeaway.\n\nThe displayed loop also requires enough remaining numbers to finish. If r=k−len(path) slots remain, a first choice above n−r+1 cannot work and is skipped. This cap matters for cost: without it, k=n would still visit all 2^n subset prefixes before returning the one full combination. The practice exercise shows the simpler unpruned template, whose answers are correct but whose search cost can be larger.",

  vocabulary: [
  {
    "term": "Combination",
    "definition": "A selection where order does not matter (unlike a permutation)."
  },
  {
    "term": "C(n, k)",
    "definition": "The binomial coefficient: the number of k-element subsets of an n-set."
  },
  {
    "term": "start index",
    "definition": "Forces increasing order so each combination is generated once (no duplicates)."
  },
  {
    "term": "Size check",
    "definition": "Record only when the path length reaches k, unlike subsets which record at every node."
  },
  {
    "term": "Remaining-slot pruning",
    "definition": "Stop early when too few numbers remain to reach size k."
  }
],

  concepts: {
  "purpose": "Enumerate all ways to pick k items where arrangement is irrelevant — the order-insensitive counterpart of permutations.",
  "operations": "Record when k items are chosen; otherwise try increasing candidates only while enough larger candidates remain to fill the missing slots.",
  "uses": "Team/committee selection, lottery-style choices, k-subset enumeration, generating test combinations, combination-sum variants.",
  "tradeoffs": "C(n,k) can be large but is far smaller than n! permutations for the same items; the start index keeps each combination unique cheaply.",
  "commonMistakes": "Recording at every node like subsets (produces wrong-size selections); starting the loop at 1 instead of start (duplicates/permutations); storing path not path[:].",
  "edgeCases": "k = 0 yields [[]] (one empty combination). k = n yields the single full selection. k > n yields [] (impossible)."
},

  complexity: [
  {
    "operation": "combinations (backtracking)",
    "best": "O((k+1)*C(n,k)+1)",
    "average": "O((k+1)*C(n,k)+1)",
    "worst": "O((k+1)*C(n,k)+1)",
    "space": "O(k+1)",
    "note": "Pruned displayed function: O((k+1)C(n,k)+1) time; practice unpruned template may explore Σ C(n,j) prefixes."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the size of the pool (numbers 1..n)"
    },
    {
      "symbol": "k",
      "meaning": "the number of items to choose"
    }
  ],
  "costModel": "Each complete combination costs O(k) to copy; there are C(n,k) of them. Per-node work is O(1) besides recursion.",
  "time": {
    "bound": "O((k+1)*C(n,k)+1)",
    "case": "worst",
    "explanation": "The capped loop visits only prefixes that extend to a size-k combination. Charge each prefix to one completion: at most (k+1)C(n,k) nodes. Each loop choice has constant amortized overhead, and each of C(n,k) output copies has length k. Thus O((k+1)C(n,k)+1). The +1 covers impossible k>n, which returns [] immediately. k=0 returns [[]]."
  },
  "space": {
    "bound": "O(k+1)",
    "case": "worst",
    "explanation": "One shared path and at most k+1 backtracker frames use O(k+1) auxiliary storage for 0≤k≤n; impossible k>n uses O(1).",
    "inputOutputNote": "Output contains C(n,k) list headers and k*C(n,k) element references: O((k+1)C(n,k))."
  },
  "derivation": [
    {
      "lines": [
        5,
        6,
        7
      ],
      "description": "Record each size-k combination (C(n,k) times, O(k) copy each).",
      "cost": "O(k·C(n,k))",
      "dimension": "time"
    },
    {
      "lines": [
        8,
        9,
        10,
        11
      ],
      "description": "Capped increasing-index loop keeps every visited prefix extendable; at most (k+1)C(n,k) nodes.",
      "cost": "O((k+1)*C(n,k)+1)",
      "dimension": "time"
    },
    {
      "lines": [
        4
      ],
      "description": "Recursion depth ≤ k plus a path of length ≤ k.",
      "cost": "O(k+1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "The increasing start index (i + 1) makes each combination unique.",
    "path[:] copies each combination before storing it.",
    "n and k are small so C(n,k) stays manageable.",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "n and k are non-negative integers. The new remaining-slot cap is essential to this output-related time bound.",
    "Collection contents and scalar sizes meet the stated contract; duplicate-aware variants need additional rules.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "A size check restricts subset enumeration to k items; this displayed version also prunes prefixes that lack enough remaining candidates. The minimal practice template without that cap is correct but can explore Σ_{j=0}^k C(n,j) prefixes, including all 2^n when k=n.",
  "counters": [
    {
      "label": "combinations recorded",
      "definition": "executions of the record line Recorded line entries at 6 occur before the operation completes.",
      "countLines": [
        6
      ]
    },
    {
      "label": "choices made",
      "definition": "executions of the choose line Recorded line entries at 9 occur before the operation completes.",
      "countLines": [
        9
      ]
    }
  ],
  "fixedDataNote": "combine(4, 2) records C(4,2) = 6 combinations. The O(k·C(n,k)) bound describes how that count and copy cost scale with n and k. Function analysis excludes demonstration input literals, imports, printing and tracer storage. A line event shows the next operation before it completes."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: choose k from 1..n, order irrelevant."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define combine(n, k)."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Collect size-k combinations."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Inner backtracker: start index and current path."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "If we've picked exactly k numbers, it's a complete combination."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Record a copy of it."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Return to stop this branch."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Try only choices that leave enough larger numbers to complete the k-item selection. range stops before n-(k-len(path))+2, so its last value is n-(k-len(path))+1."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Choose i by appending it."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Explore from i+1 so numbers only increase (no duplicates)."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Un-choose before the next candidate."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Start from 1 with an empty path."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Return all combinations."
  },
  {
    "line": 14,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Print the 6 combinations of choosing 2 from 1..4."
  }
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
  "To allow repetitions with a fixed length k, use bt(i,path) and remove the distinct-choice remaining-slot cap (use range(start,n+1)). The size-k base case ensures termination. Verify that combinations with repetitions now include [4,4] for n=4,k=2.",
  "Remove the remaining-slot cap by restoring range(start, n + 1); compare calls for combine(6,6): one answer in both versions, but many unnecessary prefixes in the uncapped version.",
  "Compare the count of results with math.comb(n, k)."
],

  exercises: [
  {
    "id": "dpcomb-complete-1",
    "kind": "complete-code",
    "prompt": "Complete the combination backtracker (size check + choose/explore/un-choose). This exercise uses the minimal unpruned loop; it returns correct combinations but does not inherit the displayed pruned function's time bound.",
    "starterCode": "def bt(start, path):\n    if len(path) == k:\n        res.append(path[:])\n        return\n    for i in range(start, n + 1):\n        # TODO: choose i, explore from i+1, un-choose\n        pass",
    "expected": "def bt(start, path):\n    if len(path) == k:\n        res.append(path[:])\n        return\n    for i in range(start, n + 1):\n        path.append(i)\n        bt(i + 1, path)\n        path.pop()",
    "hints": [
      "Goal: generate all k-sized combinations from 1..n with a size check plus choose/explore/un-choose.",
      "Enumerating all permutations and deduping wastes work; forcing increasing picks avoids duplicate combinations.",
      "Key insight: recursing from i+1 keeps numbers strictly increasing, so each combination appears once.",
      "Approach: when path reaches size k record it; otherwise loop i from start, append, recurse from i+1, pop.",
      "Pseudocode: if len(path)==k record and return; for i in start..n: append i; recurse(i+1); pop.",
      "Write `path.append(i); bt(i + 1, path); path.pop()` so numbers only increase."
    ],
    "tests": "# bt(start, path) uses globals n and k to build k-combinations of 1..n.\nn = 4\nk = 2\nres = []\nbt(1, [])\ngot = sorted(tuple(x) for x in res)\nexpected = [(1, 2), (1, 3), (1, 4), (2, 3), (2, 4), (3, 4)]\nassert got == expected, f'C(4,2) == 6 combinations, got {got}'\nassert all(len(c) == 2 for c in res), 'each combination has size k'\nn = 3\nk = 3\nres = []\nbt(1, [])\nassert [tuple(x) for x in res] == [(1, 2, 3)], f'C(3,3) is one combination, got {res}'\nprint('OK')"
  },
  {
    "id": "dpcomb-choose-1",
    "kind": "choose-approach",
    "prompt": "You must list every way to seat 3 people in a row (order matters) vs every way to pick a 3-person team (order irrelevant). Which is permutations, which is combinations?",
    "expected": "Seating in a row = permutations (order matters, n!/(n-k)! arrangements). Picking a team = combinations (order irrelevant, C(n,k)).",
    "hints": [
      "Goal: classify seating 3 people in a row (order matters) versus picking a 3-person team (order irrelevant) as permutations or combinations.",
      "The error is treating both as the same count; whether order matters changes the formula entirely.",
      "Key property: arrangements where position matters are permutations; selections where only membership matters are combinations.",
      "Approach: label the ordered task permutations and the unordered task combinations.",
      "Reasoning: seating fixes positions, so swapping two people gives a new arrangement (n!/(n-k)!); a team is a set, so reorderings are the same team (C(n,k)).",
      "Answer: seating in a row = permutations (order matters, n!/(n-k)!); picking a team = combinations (order irrelevant, C(n,k))."
    ],
    "recognition": {
      "scenario": "Distinguish seating 3 people in a row (order matters) from picking a 3-person team (order irrelevant): which is permutations and which is combinations.",
      "approaches": [
        {
          "id": "perm-row-comb-team",
          "label": "Seating in a row = permutations; picking a team = combinations",
          "requiredReasonIds": [
            "order-matters-split"
          ]
        },
        {
          "id": "swap-them",
          "label": "Seating = combinations; picking a team = permutations",
          "requiredReasonIds": [],
          "rejectionFeedback": "This reverses the definitions: order matters for a seating arrangement (permutations) and is irrelevant for a chosen team (combinations)."
        }
      ],
      "reasons": [
        {
          "id": "order-matters-split",
          "text": "When order distinguishes outcomes (a row of seats) it's permutations, n!/(n-k)!; when order is irrelevant (a team) it's combinations, C(n,k)."
        },
        {
          "id": "order-never-matters",
          "text": "Order never affects the count, so both tasks are combinations.",
          "contradictory": true
        },
        {
          "id": "team-is-ordered",
          "text": "Choosing a team is order-sensitive, so it is a permutation problem.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "perm-row-comb-team"
      ],
      "modelExplanation": "Seating in a row = permutations (order matters, n!/(n-k)! arrangements). Picking a team = combinations (order irrelevant, C(n,k))."
    }
  },
  {
    "id": "dpcomb-predict-1",
    "kind": "predict-state",
    "prompt": "How many results does combine(4, 2) produce, and what is the first and last?",
    "expected": "6 (=C(4,2)). First is [1, 2]; last is [3, 4].",
    "hints": [
      "C(4,2) = 6.",
      "Smallest increasing pair first.",
      "Largest increasing pair last."
    ]
  },
  {
    "id": "dpcomb-combination-sum-1",
    "kind": "choose-approach",
    "prompt": "Adapt this template to 'Combination Sum': all combinations of candidates=[2,3,6,7] that sum to target=7, where each candidate may be REUSED. What two changes to the choose/explore/un-choose template are needed, what prunes a branch, and what are the results?",
    "expected": "Two changes: (1) recurse with the SAME index bt(i, ...) instead of bt(i+1, ...) so a candidate can be reused; (2) drive by a remaining target instead of a size k — subtract the chosen value, record path when remaining == 0, and PRUNE when remaining < 0 (overshoot). Keeping the start index non-decreasing prevents duplicate orderings like [2,2,3] vs [3,2,2]. Results: [[2,2,3],[7]]. TWO PRECONDITIONS this relies on: (a) candidates must be strictly POSITIVE — the remaining<0 prune and termination only hold because every pick decreases remaining; a zero candidate never decreases it (reusing it recurses forever), and a negative candidate increases it (never overshoots, so it never terminates); (b) candidates must be DISTINCT values — the 'each combination once' argument assumes distinct values, so duplicate input values would emit the same multiset twice unless you add a skip-equal-siblings guard. If you recursed from i+1 you'd forbid reuse and miss [2,2,3].",
    "hints": [
      "Goal: adapt the choose/explore/un-choose template to Combination Sum — all combos of candidates=[2,3,6,7] summing to target=7 with reuse allowed.",
      "The costly bug is recursing from i+1 (which forbids reuse and misses [2,2,3]) or driving by a fixed size k instead of a remaining target.",
      "Key property: reuse requires recursing from the SAME index, and the goal is a sum target, so you prune as soon as the remaining target goes negative.",
      "Approach: recurse with bt(i, ...) to allow reuse, subtract the chosen value from a remaining target, record a path when remaining == 0, and prune when remaining < 0.",
      "Reasoning: keeping the start index non-decreasing avoids duplicate orderings like [2,2,3] vs [3,2,2]; this relies on candidates being strictly POSITIVE (so each pick decreases remaining, guaranteeing termination and valid overshoot pruning) and DISTINCT (so each multiset is emitted once).",
      "Answer: recurse with the SAME index (reuse) and drive by a remaining target (record at 0, prune below 0), giving [[2,2,3],[7]] — valid only because candidates are strictly positive and distinct."
    ],
    "recognition": {
      "scenario": "Adapt the choose/explore/un-choose backtracking template to Combination Sum: all combinations of candidates=[2,3,6,7] (reuse allowed) summing to target=7.",
      "approaches": [
        {
          "id": "same-index-remaining",
          "label": "Recurse with the SAME index and drive by a remaining target, pruning when remaining < 0",
          "requiredReasonIds": [
            "reuse-same-index",
            "positive-distinct-preconditions"
          ]
        },
        {
          "id": "next-index-size-k",
          "label": "Recurse with i+1 and stop at a fixed size k",
          "requiredReasonIds": [],
          "rejectionFeedback": "Recursing with i+1 forbids reusing a candidate, so it misses [2,2,3]; and a fixed size k is the wrong driver — Combination Sum is bounded by the remaining target, not a count."
        }
      ],
      "reasons": [
        {
          "id": "reuse-same-index",
          "text": "Recursing bt(i, ...) with the same index lets a candidate be reused, while a non-decreasing start index avoids duplicate orderings; subtract the pick and record when remaining == 0, prune when remaining < 0."
        },
        {
          "id": "positive-distinct-preconditions",
          "text": "Candidates must be strictly positive (so each pick decreases remaining and the <0 prune terminates) and distinct (so each multiset is emitted once without a skip-equal-siblings guard)."
        },
        {
          "id": "i-plus-one-allows-reuse",
          "text": "Recursing with i+1 still allows a candidate to be reused, so [2,2,3] is found.",
          "contradictory": true
        },
        {
          "id": "zero-candidate-fine",
          "text": "A zero or negative candidate is harmless because the remaining<0 prune still guarantees termination.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "same-index-remaining"
      ],
      "modelExplanation": "Two changes: recurse with the SAME index so candidates reuse, and drive by a remaining target (record at remaining==0, prune at remaining<0). It relies on candidates being strictly positive (termination/overshoot) and distinct (each multiset once). Results: [[2,2,3],[7]]."
    }
  }
],

  review: "Combinations choose k distinct items with order irrelevant. Increasing indices give each selection one ordering; record a path copy only at size k. The displayed loop also avoids choices with too few remaining candidates to finish. Its bound is O((k+1)C(n,k)+1) time, O(k+1) auxiliary storage; the uncapped exercise template may visit many dead prefixes. k=0 has one empty selection; k>n has none.",

  expectedOutput: "[[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]\n",

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
    "url": "https://leetcode.com/problems/combinations/description/",
    "title": "LeetCode: Combinations",
    "section": "Problem definition, examples and constraints",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Select k distinct integers from 1..n without considering ordering."
    ],
    "conventions": [
      "App extends k=0 to [[]] and k>n to []; displayed loop additionally prunes unfillable prefixes."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://leetcode.com/problems/combination-sum/description/",
    "title": "LeetCode: Combination Sum",
    "section": "Problem definition, examples and constraints",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Distinct positive candidates may be reused; choices are limited by a remaining sum."
    ],
    "conventions": [
      "Changing only the recursion index without a target/depth bound does not establish termination."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "f00d2ca1a2ef2bc9",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
