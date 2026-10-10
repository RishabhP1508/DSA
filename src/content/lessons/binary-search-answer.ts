/**
 * Lesson: Binary search on the answer (Searching). Verified on CPython 3.14.
 * Output: "15\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Find the smallest capacity while preserving package order.
def min_capacity(weights, days):
    if not weights or days < 1 or any(w <= 0 for w in weights):
        raise ValueError("Use nonempty positive weights and days >= 1")
    def can_ship(cap):
        used, cur = 1, 0
        for w in weights:
            if cur + w > cap:
                used += 1
                cur = 0
            cur += w
        return used <= days
    lo, hi = max(weights), sum(weights)
    while lo < hi:
        mid = (lo + hi) // 2
        if can_ship(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo

print(min_capacity([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5))`;

export const binarySearchAnswer: LessonDefinition = {
  id: "binary-search-answer",
  title: "Binary Search on the Answer",
  area: "Searching",
  prerequisites: ["binary-search"],

  explanation: "Binary search is not only for arrays — you can binary-search a **range of possible answers** whenever the answers have a **monotonic** yes/no property. This is called **binary search on the answer** (or \"parametric search\").\n\nThe setup: you can't easily compute the optimal value directly, but for any candidate value you can cheaply **check** \"is this feasible?\" And feasibility is monotonic: if capacity C works, every capacity larger than C also works; if C fails, everything smaller fails too. That monotonic boundary is exactly what binary search locates — the smallest feasible value.\n\nHere we find the minimum ship capacity to deliver all packages within `days`. `can_ship(cap)` greedily simulates the days needed for a given capacity (the **feasibility check**). We binary-search capacities in `[max(weights), sum(weights)]`: if `mid` works we try smaller (`hi = mid`), else we go bigger (`lo = mid + 1`). The total cost is **O(n · log(R + 2))**, with R = sum(weights) − max(weights) — log of the value range, each step running the O(n) check, plus O(n) validation and initialization. The cue for this pattern is \"minimize/maximize X subject to a feasibility test that is monotonic in X.\"\n\nThis implementation requires nonempty positive integer weights and an integer days >= 1. The upper bound sum(weights) is feasible in one day. Each greedy day takes the longest possible next prefix, so it cannot use more days than another packing at the same capacity. Negative weights break this greedy argument. Invalid empty/nonpositive input is rejected.",

  vocabulary: [
    { term: "Answer space", definition: "The range of candidate values (e.g. capacities) rather than array indices." },
    { term: "Feasibility check", definition: "A function that decides whether a candidate value works, ideally cheap." },
    { term: "Monotonic predicate", definition: "Once feasible, all larger (or all smaller) values stay feasible — a single boundary." },
    { term: "Parametric search", definition: "Binary-searching a parameter's value using a monotonic feasibility test." },
  ],

  concepts: {
  "purpose": "Find an optimal value by binary-searching feasibility, when direct computation is hard but checking is easy.",
  "operations": "Bound the answer range; binary-search it; move toward the feasible boundary using a monotonic check.",
  "uses": "Minimum capacity/speed, split-array largest-sum, minimize maximum distance, allocation problems.",
  "tradeoffs": "Turns a hard optimization into log(range) feasibility checks; needs a correct monotonic predicate and tight bounds.",
  "commonMistakes": "Predicate not actually monotonic (pattern doesn't apply); wrong bounds (missing the answer); updating hi = mid but lo = mid (must be mid+1) causing infinite loops; off-by-one in which side keeps mid.",
  "edgeCases": "One package gives lo == hi: no binary-search iteration is needed. days = 1 requires sum(weights); days >= len(weights) requires max(weights). Empty weights, nonpositive weights and days < 1 raise ValueError."
},

  complexity: [
  {
    "operation": "Minimum ship capacity",
    "best": "O(n)",
    "worst": "O(n log(R + 2))",
    "space": "O(1)",
    "note": "R = sum(weights) − max(weights); includes O(n) validation/max/sum initialization."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of weights (items)"
    },
    {
      "symbol": "R",
      "meaning": "R = sum(weights) - max(weights), the nonnegative width between the initial capacity bounds"
    }
  ],
  "costModel": "Input validation and max/sum initialization cost O(n); each candidate feasibility scan costs O(n); there are O(log(R + 2)) checks as an upper bound, including a zero-width range.",
  "time": {
    "bound": "O(n log(R + 2))",
    "case": "worst",
    "explanation": "Initialization scans n weights even when R = 0. For R > 0, each iteration halves the remaining integer candidates and scans the weights. O(n) + O(n log(R + 1)) is bounded uniformly by O(n log(R + 2)). R = 0 (one positive package) uses no feasibility checks and still costs O(n)."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "The feasibility check keeps used and cur, and the search keeps lo, hi and mid; no retained container grows with n or R.",
    "inputOutputNote": "The weights list of n items is the input, not auxiliary space."
  },
  "derivation": [
    {
      "lines": [
        13
      ],
      "description": "max and sum each scan the supplied weights.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        14
      ],
      "description": "Each capacity update shrinks the integer range; zero width executes no body.",
      "cost": "O(log(R + 2))",
      "dimension": "time"
    },
    {
      "lines": [
        7
      ],
      "description": "Each feasibility scan visits all weights in the worst case.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        13
      ],
      "description": "Only scalar search and packing state is retained.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "weights is a nonempty list of positive integers; days is an integer at least one.",
    "Package order is preserved; each package is indivisible.",
    "hi = sum(weights) is feasible within one day, so at least one answer exists.",
    "The greedy pass packs the longest possible prefix each day; a larger capacity cannot require more days.",
    "Arithmetic on these bounded-size integers and comparisons are modeled as O(1)."
  ],
  "tradeoffs": "Trying every capacity costs O(n(R + 1)); monotonicity reduces the number of tests. Positive weights let a packing with at most m parts be split into exactly m nonempty parts when 1 <= m <= n.",
  "counters": [
    {
      "label": "feasibility checks",
      "definition": "executions of the midpoint feasibility test, excluding the terminating loop condition",
      "countLines": [
        16
      ]
    }
  ],
  "fixedDataNote": "This example uses initial capacities [10,55], so R=45, and prints 15. A singleton has R=0 and needs only validation and bound initialization. Function costs exclude demo literal construction and printing."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: optimize capacity with order preserved."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define min_capacity for a list of positive integer weights and a positive integer days."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Test the stated input preconditions; any checks for a nonpositive weight."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Reject empty weights, nonpositive weights or days below one."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Define the candidate feasibility scan; searched capacities always fit the heaviest package."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Start with one day and zero current load."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Visit packages in their original order."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Test whether adding this package would exceed the candidate capacity."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Start another day after the overflow test succeeds."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Reset the new day to zero load."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Place the current package on the current day."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Return whether the used day count stays within the limit."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Compute bounds in O(n): a package must fit; the total always fits within one day."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Continue while at least two candidate capacities remain."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Choose the lower midpoint capacity."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "Test feasibility at mid."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Keep the feasible midpoint while trying smaller candidates."
  },
  {
    "line": 18,
    "executable": false,
    "explanation": "Otherwise the midpoint is infeasible."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "Exclude the infeasible midpoint and search above it."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Return the smallest feasible capacity when both bounds meet."
  },
  {
    "line": 21,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "Print the least capacity for this example: 15."
  }
],

  bindings: [
  {
    "variable": "weights",
    "model": "array"
  },
  {
    "variable": "lo",
    "model": "object"
  },
  {
    "variable": "hi",
    "model": "object"
  },
  {
    "variable": "mid",
    "model": "object"
  },
  {
    "variable": "cap",
    "model": "object"
  },
  {
    "variable": "used",
    "model": "object"
  },
  {
    "variable": "cur",
    "model": "object"
  }
],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "Why can we binary-search capacities instead of trying each one?",
    "answer": "Because feasibility is monotonic: if capacity C works, every larger capacity works too, so there is a single boundary to locate.",
    "explanation": "Monotonicity means the feasible capacities form a contiguous upper range. Binary search finds the boundary (smallest feasible) in log(R) checks instead of scanning all R values. A single candidate needs zero checks, while computing the bounds still scans the input."
  }
],

  experiments: [
    "Change days to 1 and confirm the answer becomes sum(weights) = 55.",
    "Change days to 10 and confirm the answer drops to max(weights) = 10.",
    "Add a print inside the loop to count how few feasibility checks run.",
  ],

  exercises: [
  {
    "id": "bsa-choose-1",
    "kind": "choose-approach",
    "prompt": "Which scenario admits a monotone capacity search? (a) the maximum sum of a contiguous window of exactly k elements, (b) split a nonempty array of positive integers into exactly m contiguous nonempty parts, 1 <= m <= n, minimizing the largest part sum, (c) locate a target in a sorted array.",
    "expected": "(b): greedily test whether a candidate cap permits at most m parts. With positive values and m <= n, further splits can produce exactly m parts without increasing the largest sum. Feasibility stays true when the cap increases. (a) admits a fixed-width sliding window; (c) uses ordinary array binary search.",
    "hints": [
      "Goal: identify which problem fits 'binary search on the answer.'",
      "The naive cost is testing every candidate value; a monotone feasibility test lets you halve the search space.",
      "Positive values let a greedy capacity test count the fewest required parts. If at most m parts fit, they can be split to exactly m when m <= n.",
      "Approach: binary-search the answer value, using the feasibility test to move the bounds.",
      "Pseudocode: search over possible max-sums; if a candidate is feasible, try smaller, else larger.",
      "(b): greedily test whether a candidate cap permits at most m parts. With positive values and m <= n, further splits can produce exactly m parts without increasing the largest sum. Feasibility stays true when the cap increases. (a) admits a fixed-width sliding window; (c) uses ordinary array binary search."
    ],
    "recognition": {
      "scenario": "Which scenario admits a monotone capacity search? (a) the maximum sum of a contiguous window of exactly k elements, (b) split a nonempty array of positive integers into exactly m contiguous nonempty parts, 1 <= m <= n, minimizing the largest part sum, (c) locate a target in a sorted array.",
      "approaches": [
        {
          "id": "bs-answer",
          "label": "Binary search on the answer",
          "requiredReasonIds": [
            "monotone-feasibility"
          ]
        },
        {
          "id": "fixed-window",
          "label": "Fixed-size sliding window",
          "requiredReasonIds": [],
          "rejectionFeedback": "That is the tool for (a): a fixed width k, not a search over candidate answers."
        },
        {
          "id": "array-bs",
          "label": "Ordinary array binary search",
          "requiredReasonIds": [],
          "rejectionFeedback": "That is the tool for (c): locating an element in a sorted array by position."
        }
      ],
      "reasons": [
        {
          "id": "monotone-feasibility",
          "text": "For positive integers and 1 <= m <= n, greedy packing tests at-most-m feasibility; extra splits reach exactly m without raising a part sum, and increasing the cap preserves feasibility."
        },
        {
          "id": "fixed-k-window",
          "text": "The problem pins a fixed count k of elements to sum.",
          "contradictory": true
        },
        {
          "id": "locate-in-sorted",
          "text": "We are locating a known element in an already-sorted array.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "bs-answer"
      ],
      "modelExplanation": "(b): greedily test whether a candidate cap permits at most m parts. With positive values and m <= n, further splits can produce exactly m parts without increasing the largest sum. Feasibility stays true when the cap increases. (a) admits a fixed-width sliding window; (c) uses ordinary array binary search."
    }
  },
  {
    "id": "bsa-fix-1",
    "kind": "fix-mistake",
    "prompt": "`search_answer(can_ship, lo, hi)` binary-searches for the smallest feasible value in [lo, hi] (can_ship is monotonic: once True it stays True). This version loops forever because the infeasible branch doesn't advance. Fix the boundary update so it converges and returns that smallest feasible value. Assume integer lo <= hi and can_ship(hi) is True; without a feasible upper bound this template does not establish that any solution exists.",
    "starterCode": "def search_answer(can_ship, lo, hi):\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if can_ship(mid):\n            hi = mid\n        else:\n            lo = mid\n    return lo",
    "expected": "def search_answer(can_ship, lo, hi):\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if can_ship(mid):\n            hi = mid\n        else:\n            lo = mid + 1\n    return lo",
    "hints": [
      "Goal: binary-search the smallest feasible capacity and converge instead of looping forever. hi is assumed feasible.",
      "The infinite loop comes from an update that fails to advance when lo and mid coincide.",
      "Key insight: when mid is infeasible it cannot be the answer, so the lower bound must move strictly past it.",
      "Approach: shrink toward the smallest feasible value with lo/hi that always make progress.",
      "Pseudocode: while lo<hi: mid=(lo+hi)//2; if feasible hi=mid; else lo=mid+1.",
      "Use `lo = mid + 1` in the infeasible branch so the interval always shrinks."
    ],
    "tests": "assert search_answer(lambda c: c >= 5, 1, 10) == 5, 'smallest feasible is 5'\nassert search_answer(lambda c: c >= 1, 1, 10) == 1, 'everything feasible -> lo'\nassert search_answer(lambda c: c >= 10, 1, 10) == 10, 'only the top is feasible'\nassert search_answer(lambda c: c >= 7, 0, 100) == 7\nprint('OK')"
  }
],

  review: "Search the smallest feasible capacity by maintaining a feasible upper bound and a monotone packing test. Keep hi = mid when feasible and lo = mid + 1 otherwise. Positive weights preserve the greedy packing argument; this function takes O(n log(R + 2)) time and O(1) auxiliary space, including initialization when R = 0.",

  expectedOutput: "15\n",

  references: [
  {
    "url": "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/description/",
    "title": "shipping reference",
    "section": "Problem statement, examples, constraints",
    "topic": "lesson/shipping",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Shipping keeps package order and positive weights; at least one day is permitted."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "This app permits days > n as harmless spare days."
    ]
  },
  {
    "url": "https://cp-algorithms.com/num_methods/binary_search.html",
    "title": "binary reference",
    "section": "Search on arbitrary predicate; binary search on the answer",
    "topic": "lesson/shipping",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "A monotone predicate identifies a transition within correctly bracketed bounds."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "f6a9654b672ca67a",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
