/**
 * Pattern: Binary search on the answer.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2). Output "15\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# Find the smallest capacity while preserving package order.
def can_ship(weights, cap, days):
    used, cur = 1, 0
    for w in weights:
        if w > cap:
            return False
        if cur + w > cap:
            used += 1
            cur = 0
        cur += w
    return used <= days

def least_capacity(weights, days):
    if not weights or days < 1 or any(w <= 0 for w in weights):
        raise ValueError("Use nonempty positive weights and days >= 1")
    lo, hi = max(weights), sum(weights)
    while lo < hi:
        mid = (lo + hi) // 2
        if can_ship(weights, mid, days):
            hi = mid
        else:
            lo = mid + 1
    return lo

print(least_capacity([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5))`;

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

  whyItHelps: "The candidate answers form a **monotone yes/no line**: below some threshold every value is infeasible, at and above it every value is feasible (or vice versa). That monotonicity is exactly what **binary search** needs — but over the *answer space*, not an array. Each step tests the midpoint's feasibility with a cheap check and halves the search range, giving **O(log(range) · checkCost)**. You never need a closed-form for the optimum; you only need a **feasibility test** and a guarantee of monotonicity. The upper bound must actually be feasible; a monotone predicate that is false everywhere has no boundary answer inside the range.",

  conditions: [
  "Feasibility must be MONOTONE in the candidate: feasible(x) ⇒ feasible(x+1) (for a minimization) so the boundary is well-defined.",
  "You can compute feasible(x) efficiently (often a linear greedy pass).",
  "You set the search bounds correctly: lo/hi must bracket the true answer (e.g. lo = max single item, hi = total).",
  "For this shipping walkthrough: nonempty positive integer weights, integer days >= 1, original order preserved, and hi=sum(weights) guaranteed feasible."
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
    "This minimum-capacity function costs O(n log(R + 2)) time with R=sum(weights)−max(weights), including O(n) validation and initialization; O(1) auxiliary space.",

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of weights"
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
    "explanation": "Only a few scalars (lo, hi, mid, used, cur) are kept; nothing grows with n.",
    "inputOutputNote": "weights (n values) is the input; the answer is a single integer."
  },
  "derivation": [
    {
      "lines": [
        16
      ],
      "description": "max and sum each scan the supplied weights.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        17
      ],
      "description": "Each capacity update shrinks the integer range; zero width executes no body.",
      "cost": "O(log(R + 2))",
      "dimension": "time"
    },
    {
      "lines": [
        4
      ],
      "description": "Each feasibility scan visits all weights in the worst case.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        16
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
        19
      ]
    }
  ],
  "fixedDataNote": "This example uses initial capacities [10,55], so R=45, and prints 15. A singleton has R=0 and needs only validation and bound initialization. Function costs exclude demo literal construction and printing."
},

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: optimize capacity with order preserved."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define can_ship for positive integer weights, a candidate capacity and positive days."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Start with one day and zero current load."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Visit packages in their original order."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Check whether a single package is too heavy for this capacity."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Return False if even this single package cannot fit."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Test whether adding the package exceeds the current day capacity."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Start another day when the overflow test succeeds."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Reset the new day to zero load."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Place the package on the current day."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Return whether the used day count is within the limit."
  },
  {
    "line": 12,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Define the minimum-capacity search."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Test for empty input, nonpositive weights or days below one."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Reject invalid shipping input."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "Compute the heaviest package and the total in O(n), bracketing a feasible answer."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Continue while at least two candidate capacities remain."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "Choose the lower midpoint capacity."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "Test whether this capacity can ship all packages in time."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Keep mid as a feasible candidate and seek a smaller one."
  },
  {
    "line": 21,
    "executable": false,
    "explanation": "Otherwise mid is infeasible."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "Exclude mid and all smaller candidates."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "Return the smallest feasible capacity when the bounds meet."
  },
  {
    "line": 24,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 25,
    "executable": true,
    "explanation": "Print the example result: 15."
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

  linkedLessons: ["binary-search-answer", "binary-search", "bounds"],

  exercises: [
  {
    "id": "pat-bsa-recognize-1",
    "kind": "choose-approach",
    "prompt": "Split a nonempty array of positive integers into exactly m contiguous nonempty parts (1 <= m <= n) to minimize the largest part sum. Choose an approach and explain its test.",
    "expected": "Binary search candidate part-sum caps. A greedy pass tests whether at most m parts suffice; positive values let us split further to exactly m without increasing any sum. This test is monotone. O(n log(R + 2)) including max/sum setup, R=sum−max.",
    "correctPatternId": "binary-search-on-answer",
    "hints": [
      "Split a nonempty array of positive integers into exactly m contiguous nonempty parts (1 <= m <= n) to minimize the largest part sum. Choose an approach and explain its test.",
      "Trying every split is exponential; the answer's monotonicity lets you search the value directly.",
      "For positive values, greedy packing finds the minimum required number of parts. At most m can be split to exactly m because m <= n.",
      "Approach: binary search on the answer, testing each candidate largest-sum with a greedy pass.",
      "Pseudocode: lo=max element, hi=total; while lo<hi: mid=(lo+hi)//2; if feasible(mid) hi=mid else lo=mid+1; return lo.",
      "Binary search candidate part-sum caps. A greedy pass tests whether at most m parts suffice; positive values let us split further to exactly m without increasing any sum. This test is monotone. O(n log(R + 2)) including max/sum setup, R=sum−max."
    ],
    "recognition": {
      "scenario": "Split a nonempty array of positive integers into exactly m contiguous nonempty parts (1 <= m <= n) to minimize the largest part sum. Choose an approach and explain its test.",
      "approaches": [
        {
          "id": "bs-answer",
          "label": "Binary search on the answer",
          "requiredReasonIds": [
            "monotone-feasible"
          ]
        },
        {
          "id": "array-bs",
          "label": "Ordinary binary search on the array",
          "requiredReasonIds": [],
          "rejectionFeedback": "There is no target element to locate in the array; we search a range of candidate answers, not positions."
        },
        {
          "id": "dp",
          "label": "Full DP over splits",
          "requiredReasonIds": [
            "split-recurrence"
          ],
          "rejectionFeedback": "A DP can solve this problem too; the reason choices here compare the efficient monotone capacity approach to positional array search. DP trades more state/work for a general split recurrence."
        }
      ],
      "reasons": [
        {
          "id": "monotone-feasible",
          "text": "Binary search candidate part-sum caps. A greedy pass tests whether at most m parts suffice; positive values let us split further to exactly m without increasing any sum. This test is monotone. O(n log(R + 2)) including max/sum setup, R=sum−max."
        },
        {
          "id": "sorted-array",
          "text": "The array is sorted, so we can locate the answer by comparing to the midpoint element.",
          "contradictory": true
        },
        {
          "id": "no-monotonicity",
          "text": "There is no monotone property to exploit, so we must try every split.",
          "contradictory": true
        },
        {
          "id": "split-recurrence",
          "text": "A split DP tries each possible previous cut and minimizes max(previous best, final segment sum); it uses more work but is a correct alternative."
        }
      ],
      "acceptableApproachIds": [
        "bs-answer"
      ],
      "modelExplanation": "Binary search candidate part-sum caps. A greedy pass tests whether at most m parts suffice; positive values let us split further to exactly m without increasing any sum. This test is monotone. O(n log(R + 2)) including max/sum setup, R=sum−max.",
      "alternatives": [
        {
          "approachId": "dp",
          "conditions": "Use a correct recurrence over all previous split points; accept the higher work and memory cost.",
          "tradeoff": "Usually O(m n²) time and O(m n) space instead of a greedy predicate search.",
          "requiredReasonIds": [
            "split-recurrence"
          ]
        }
      ]
    }
  },
  {
    "id": "pat-bsa-choose-1",
    "kind": "choose-approach",
    "prompt": "You must find the index of a specific value in a sorted array. Is this 'binary search on the answer'? If not, what is it?",
    "expected": "No — that's ordinary binary search on a sorted array (locating an element/index). 'Binary search on the answer' searches an abstract range of candidate answers using a feasibility test, not array positions.",
    "correctPatternId": "modified-binary-search",
    "hints": [
      "Goal: decide whether locating a value's index in a sorted array is 'binary search on the answer'.",
      "Both use halving, but one searches array positions while the other searches candidate answers.",
      "Key insight: no feasibility function is involved when you're simply locating an element by comparison.",
      "Approach: recognize this as ordinary binary search on the array, not on an abstract answer range.",
      "Pseudocode: lo=0, hi=n-1; while lo<=hi: compare target to a[mid]; move lo or hi accordingly.",
      "No — this is plain binary search on a sorted array; 'binary search on the answer' searches candidate answers via a feasibility test."
    ],
    "recognition": {
      "scenario": "You must find the index of a specific value in a sorted array. Is this 'binary search on the answer'?",
      "approaches": [
        {
          "id": "array-bs",
          "label": "Ordinary binary search on the sorted array",
          "requiredReasonIds": [
            "locate-element"
          ]
        },
        {
          "id": "bs-answer",
          "label": "Binary search on the answer",
          "requiredReasonIds": [],
          "rejectionFeedback": "There is no abstract candidate-answer range with a feasibility test here — you are locating a concrete element by position."
        }
      ],
      "reasons": [
        {
          "id": "locate-element",
          "text": "The array is sorted and you compare the target to the midpoint element to discard half — a direct positional search."
        },
        {
          "id": "feasibility-range",
          "text": "You search an abstract range of candidate answers using a monotone feasibility predicate.",
          "contradictory": true
        },
        {
          "id": "unsorted-scan",
          "text": "The array is unsorted, so a linear scan is unavoidable.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "array-bs"
      ],
      "modelExplanation": "No — locating a value in a sorted array is ordinary binary search over positions. 'Binary search on the answer' searches candidate answers via a feasibility test, not array indices."
    }
  },
  {
    "id": "pat-bsa-fix-1",
    "kind": "fix-mistake",
    "prompt": "`least_capacity(weights, days)` finds the smallest ship capacity to ship all weights within `days` (order preserved). This can skip the boundary or loop. Fix the feasible-case update. Assume nonempty positive integer weights and integer days >= 1.",
    "starterCode": "def least_capacity(weights, days):\n    def can_ship(cap):\n        d, cur = 1, 0\n        for w in weights:\n            if w > cap:\n                return False\n            if cur + w > cap:\n                d += 1; cur = 0\n            cur += w\n        return d <= days\n    lo, hi = max(weights), sum(weights)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if can_ship(mid):\n            hi = mid - 1\n        else:\n            lo = mid + 1\n    return lo",
    "expected": "def least_capacity(weights, days):\n    def can_ship(cap):\n        d, cur = 1, 0\n        for w in weights:\n            if w > cap:\n                return False\n            if cur + w > cap:\n                d += 1; cur = 0\n            cur += w\n        return d <= days\n    lo, hi = max(weights), sum(weights)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if can_ship(mid):\n            hi = mid\n        else:\n            lo = mid + 1\n    return lo",
    "hints": [
      "Goal: least_capacity(weights, days) = smallest capacity to ship all weights within days. Input weights are positive and days >= 1.",
      "Binary-search the ANSWER; a feasibility test can_ship(cap) checks a candidate.",
      "Key property: mid itself may be the smallest feasible capacity, so it must stay in range.",
      "Approach: on feasible, shrink the UPPER bound to mid (not mid-1); on infeasible, lo=mid+1.",
      "Pseudocode: if can_ship(mid): hi=mid else lo=mid+1; return lo.",
      "Fix: set hi = mid (not hi = mid - 1) in the feasible branch."
    ],
    "tests": "assert least_capacity([1,2,3,4,5,6,7,8,9,10], 5) == 15\nassert least_capacity([3,2,2,4,1,4], 3) == 6\nassert least_capacity([1,2,3,1,1], 4) == 3\n# the boundary (mid feasible) must be kept, not skipped:\nassert least_capacity([5,5,5], 3) == 5, 'each day one 5'\nprint('OK')"
  }
],

  references: [
  {
    "url": "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/description/",
    "title": "shipping reference",
    "section": "Problem statement, examples, constraints",
    "topic": "pattern/shipping",
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
    "topic": "pattern/shipping",
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
    contentHash: "bed466186b7cb844",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
