/**
 * Pattern: Sliding window.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2). Output "9\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# Largest sum of exactly k consecutive elements, negatives allowed.
def max_sum_k(nums, k):
    if not 1 <= k <= len(nums):
        raise ValueError("k must select a nonempty window")
    window = 0
    for j in range(k):
        window += nums[j]
    best = window
    left, right = 0, k - 1
    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]
        left, right = i - k + 1, i
        best = max(best, window)
    return best

print(max_sum_k([2, 1, 5, 1, 3, 2], 3))`;

export const slidingWindowPattern: PatternDefinition = {
  id: "sliding-window",
  title: "Sliding Window",
  category: "Arrays & strings",
  summary:
    "Maintain a contiguous window with incrementally updated state; sums have constant-cost updates, while window max/min needs a suitable data structure.",

  clues: [
    "The input is a contiguous run of an array or string (a subarray/substring), not an arbitrary subset.",
    "You want the best/longest/shortest window, or a count of windows, satisfying a condition.",
    "The condition is about a window aggregate: a sum, a count, a set of distinct characters, a max/min.",
    "Phrases like 'exactly k consecutive', 'at most k distinct', 'longest substring without…'.",
    "A brute-force over all windows would recompute overlapping work.",
  ],

  naiveApproach: `Enumerate every window explicitly. For a fixed size k, that is \`for start in range(n-k+1): sum(nums[start:start+k])\` — each sum re-adds k elements, so recomputing all windows is **O(n·k)**. For variable-size windows, checking every (start, end) pair and re-scanning each is **O(n²)** or worse. The wasted work is that adjacent windows overlap almost entirely, yet the naive code re-reads that overlap every time.`,

  whyItHelps: `A window shares all but its two ends with the previous window. So instead of recomputing the aggregate, **update it incrementally**: when the window slides right, **add the entering element and subtract the leaving one** (for a fixed size), or **grow the right edge and shrink the left edge** while a condition holds (for a variable size). Each element enters and leaves the window at most once, so the whole scan is **O(n)** with **O(1)** (fixed) or O(window) auxiliary state — a large improvement over the naive recomputation.`,

  conditions: [
  "The answer is over CONTIGUOUS windows (subarrays/substrings), not arbitrary subsets or subsequences.",
  "The window aggregate can be updated incrementally as elements enter/leave (sum, count, a frequency map).",
  "For the variable-size version, the condition must be MONOTONE: once a window is invalid, shrinking from the left is the right fix (e.g. 'at most k distinct', 'sum ≤ target' with non-negative values).",
  "Maximum/minimum window aggregates need an appropriate structure such as a monotonic deque; an ordinary running sum does not maintain them."
],

  alternatives: [
  "Prefix sums — valid for fixed-width sums too (including negatives) with O(n) storage. Prefix sums plus a frequency map are useful for arbitrary-length exact-target counts; distinguish the objective from variable-window monotonicity.",
  "Two pointers — a close cousin; sliding window is the special case where both pointers move over one sequence maintaining a window aggregate.",
  "Kadane's algorithm — for 'largest sum of ANY contiguous subarray' (no fixed size and negatives allowed), a window won't work; Kadane does."
],

  counterexamples: [
    "'Count subarrays summing to k' with NEGATIVE numbers: growing/shrinking a window is not monotone (adding an element can decrease the sum), so a window gives wrong answers — use prefix sums + a hashmap.",
    "'Largest sum of any contiguous subarray' (size not fixed, negatives allowed): there is no window size to slide — use Kadane's algorithm.",
    "Problems about subsequences (non-contiguous) — a window only sees contiguous ranges.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "9\n",
  complexityNote:
    "O(n) time: the first window costs O(k) once, then each of the remaining n−k slides is O(1). O(1) auxiliary space for the running sum. The naive per-window recompute is O(n·k).",

  complexityExplanation: {
  "scope": "operation",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in nums"
    },
    {
      "symbol": "k",
      "meaning": "the fixed window width"
    }
  ],
  "costModel": "Each slide does a constant number of additions and one comparison. The first window is summed once over k elements.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The explicit first-window loop runs k times; the slide loop runs n-k times with bounded-value updates. O(k)+O(n-k)=O(n)."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Only the running `window` and `best` scalars are kept; nothing grows with n.",
    "inputOutputNote": "The input is supplied to max_sum_k. No slice is allocated; scalar working state is O(1) in a bounded-value unit-cost model."
  },
  "derivation": [
    {
      "lines": [
        6,
        7
      ],
      "description": "Explicit first-window accumulation.",
      "cost": "O(k)",
      "dimension": "time"
    },
    {
      "lines": [
        10,
        11,
        12,
        13
      ],
      "description": "n-k constant-cost slides.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        5,
        8,
        9
      ],
      "description": "Constant-size scalar working state; no input copy.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Addition and comparison are O(1).",
    "0 < k <= len(nums) (a valid window exists)."
  ],
  "tradeoffs": "The naive per-window recompute is O(n·k) time. Prefix sums are a valid alternative (O(n) time, O(n) space); the window is preferred for its O(1) auxiliary space.",
  "counters": [
    {
      "label": "slides",
      "definition": "completed slide updates",
      "countLines": [
        11
      ]
    }
  ],
  "fixedDataNote": "This run has n=6, k=3, so 3 slides after the first window; the answer 9 is [5,1,3]. The O(n) bound generalises the slide count."
},

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: fixed-width maximum sum, including negative values."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define max_sum_k."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Validate that a nonempty width fits the input."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Report invalid width."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Begin explicit accumulation without a copied slice."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Visit each of the first k indices."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Add this first-window value."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Seed the best with the first window."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Record inclusive first-window boundaries."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Advance the entering index through the remaining elements."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Add the entering value and subtract the leaving value."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Record the newly completed window’s inclusive bounds."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Retain the largest completed-window sum."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Return the best sum."
  },
  {
    "line": 15,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "The best width-three window sums to 9."
  }
],

  bindings: [
  {
    "variable": "nums",
    "model": "array",
    "overlays": [
      {
        "role": "boundary",
        "label": "window start",
        "source": "left"
      },
      {
        "role": "boundary",
        "label": "window end",
        "source": "right"
      },
      {
        "role": "total",
        "label": "sum",
        "source": "window"
      },
      {
        "role": "total",
        "label": "best",
        "source": "best"
      }
    ],
    "range": {
      "label": "current boundaries",
      "startSource": "left",
      "endSource": "right",
      "endInclusive": true
    }
  }
],

  linkedLessons: ["sliding-window", "string-sliding-window"],

  exercises: [
  {
    "id": "pat-sw-recognize-1",
    "kind": "choose-approach",
    "prompt": "Which technique fits: 'Given an array of integers and a number k, find the largest sum of exactly k consecutive elements'?",
    "expected": "Fixed-size sliding window. The window size is fixed at k and the target is over contiguous elements, so slide the window updating the sum in O(1) (add entering, drop leaving) for an O(n) solution.",
    "correctPatternId": "sliding-window",
    "hints": [
      "Goal: find the largest sum of exactly k consecutive elements in an array.",
      "Recomputing each window's sum from scratch is O(n·k) — the overlapping elements are recomputed every slide.",
      "Key insight: adjacent windows share k-1 elements, so a new sum differs by only the entering and leaving values.",
      "Approach: use a fixed-size sliding window, updating the running sum in O(1) per slide.",
      "Pseudocode: sum the first k; then slide: add the entering element, subtract the leaving one, track the max.",
      "This is a fixed-size sliding window: add the entering element and subtract the leaving one each step for O(n). Prefix sums are a valid O(n)-storage alternative."
    ],
    "recognition": {
      "scenario": "Given an array of integers and a number k, you must find the largest sum of exactly k consecutive elements.",
      "approaches": [
        {
          "id": "fixed-window",
          "label": "Fixed-size sliding window",
          "requiredReasonIds": [
            "contiguous-fixed-k"
          ]
        },
        {
          "id": "kadane",
          "label": "Kadane's algorithm",
          "requiredReasonIds": [],
          "rejectionFeedback": "Kadane finds the best subarray of ANY length; here the width is pinned at exactly k, so Kadane solves a different problem."
        },
        {
          "id": "prefix-map",
          "label": "Prefix sums + hash map",
          "requiredReasonIds": [],
          "rejectionFeedback": "A prefix-sum map is for counting arbitrary-range target sums; for a single fixed width it is overkill."
        },
        {
          "id": "prefix-array",
          "label": "Build prefix sums, then compare length-k range sums",
          "requiredReasonIds": [
            "prefix-difference"
          ]
        }
      ],
      "reasons": [
        {
          "id": "contiguous-fixed-k",
          "text": "The block is contiguous and of fixed width k, so the sum updates in O(1) as the window slides (add the entering element, drop the leaving one)."
        },
        {
          "id": "any-length-best",
          "text": "We want the best subarray of any length, so we must decide extend-or-restart at each index.",
          "contradictory": true
        },
        {
          "id": "count-targets",
          "text": "We must count how many subarrays hit a target sum.",
          "contradictory": true
        },
        {
          "id": "prefix-difference",
          "text": "Adjacent prefix totals recover each length-k sum; this also works with negative values."
        }
      ],
      "acceptableApproachIds": [
        "fixed-window"
      ],
      "modelExplanation": "Fixed-size sliding window: the width is fixed at k, so slide the window and update the running sum incrementally for an O(n) solution. A prefix array is also correct with O(n) storage; this question does not forbid that alternative.",
      "alternatives": [
        {
          "approachId": "prefix-array",
          "conditions": "Valid under this problem’s stated contract.",
          "tradeoff": "O(n) time and O(n) auxiliary storage rather than the window’s O(1) slots.",
          "requiredReasonIds": [
            "prefix-difference"
          ]
        }
      ]
    }
  },
  {
    "id": "pat-sw-recognize-2",
    "kind": "choose-approach",
    "prompt": "Recognize (no label given): 'Find the length of the longest substring with at most 2 distinct characters.' What pattern, and why?",
    "expected": "Variable-size sliding window with a frequency map. Grow the right edge; when distinct-count exceeds 2, shrink the left edge until valid again. The 'at most k distinct' condition is monotone, so shrinking from the left restores validity. O(n).",
    "correctPatternId": "sliding-window",
    "hints": [
      "Goal: find the longest substring containing at most 2 distinct characters.",
      "Rechecking every substring is O(n^2); the window's overlap makes most of that recomputation avoidable.",
      "Key insight: 'at most k distinct' is monotone — once valid, shrinking from the left restores validity.",
      "Approach: use a variable-size sliding window with a frequency map of characters in the window.",
      "Pseudocode: grow the right edge adding to the map; while distinct>2 shrink the left edge; track the max length.",
      "Use a variable-size window with a frequency map: grow right, shrink left when distinct exceeds 2, for O(n)."
    ],
    "recognition": {
      "scenario": "Find the length of the longest substring that contains at most 2 distinct characters. No pattern name is given.",
      "approaches": [
        {
          "id": "var-window",
          "label": "Variable-size sliding window with a frequency map",
          "requiredReasonIds": [
            "monotone-shrink"
          ]
        },
        {
          "id": "fixed-window",
          "label": "Fixed-size sliding window",
          "requiredReasonIds": [],
          "rejectionFeedback": "The answer's length is unknown, so there is no fixed window width to slide."
        },
        {
          "id": "enumerate",
          "label": "Enumerate all substrings",
          "requiredReasonIds": [],
          "rejectionFeedback": "Enumerating every substring is O(n^2)+; the constraint is monotone so a window does it in O(n)."
        }
      ],
      "reasons": [
        {
          "id": "monotone-shrink",
          "text": "The 'at most 2 distinct' condition is monotone: grow the right edge, and when it breaks, shrink from the left until valid again — O(n)."
        },
        {
          "id": "fixed-width",
          "text": "The substring has a known fixed width, so slide a constant window.",
          "contradictory": true
        },
        {
          "id": "needs-sorting",
          "text": "The input must be sorted before scanning.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "var-window"
      ],
      "modelExplanation": "Variable-size sliding window: expand the right edge and contract the left whenever the distinct-count exceeds 2, tracking the longest valid width in O(n)."
    }
  },
  {
    "id": "pat-sw-fix-1",
    "kind": "fix-mistake",
    "prompt": "This fixed-window sum recomputes each window from scratch (O(n·k)). Make it O(n).",
    "starterCode": "def max_sum_k(nums, k):\n    best = sum(nums[:k])\n    for start in range(1, len(nums) - k + 1):\n        best = max(best, sum(nums[start:start + k]))\n    return best",
    "expected": "def max_sum_k(nums, k):\n    window = sum(nums[:k])\n    best = window\n    for i in range(k, len(nums)):\n        window += nums[i] - nums[i - k]\n        best = max(best, window)\n    return best",
    "hints": [
      "Goal: max_sum_k(nums, k) = largest sum of any k consecutive elements.",
      "The repeated work is sum(nums[start:start+k]) — it re-adds k elements every step (O(n·k)).",
      "Key property: adjacent windows differ by exactly two elements (one enters, one leaves).",
      "Approach: keep a running window sum and slide it in O(1) per step.",
      "Pseudocode: window=sum(first k); for i in k..n-1: window += nums[i]-nums[i-k]; best=max(best,window).",
      "Fix: replace the re-sum with window += nums[i] - nums[i - k]."
    ],
    "tests": "# correctness first\nassert max_sum_k([1,2,3,4,5], 2) == 9, '4+5'\nassert max_sum_k([2,1,5,1,3,2], 3) == 9, '5+1+3'\nassert max_sum_k([5], 1) == 5\n# operation-cost check: slicing-sum each window reads ~ n*k elements; the O(1)\n# slide reads O(n). Count element reads via an instrumented list and require\n# the solution to stay linear (not n*k). For n=40, k=10: n*k=400, linear ~<=160.\n_CountList.reads = 0\nnums = _CountList(range(40))\nmax_sum_k(nums, 10)\nassert _CountList.reads <= 3 * len(nums), f'must be O(n), not O(n*k): {_CountList.reads} reads for n={len(nums)}, k=10'\nprint('OK')",
    "preludeCode": "class _CountList(list):\n    reads = 0\n    def __getitem__(self, i):\n        if isinstance(i, slice):\n            r = list.__getitem__(self, i)\n            _CountList.reads += len(r)  # a slice reads every element it copies\n            return r\n        _CountList.reads += 1\n        return list.__getitem__(self, i)"
  }
],

  references: [
  {
    "url": "https://usaco.guide/silver/two-pointers",
    "title": "USACO Guide: two pointers",
    "section": "Sum of Two Values; Sliding Window",
    "topic": "codex/b2-b",
    "purpose": "Verify the specific semantics and conditions used in this lesson.",
    "verifiedClaims": [
      "Sorted opposite-end pointers move according to the current sum; suitable monotone windows advance each boundary at most n times."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://usaco.guide/silver/prefix-sums",
    "title": "USACO Guide: prefix sums",
    "section": "Exclusive prefix sums, adapted to 0-based endpoints",
    "topic": "codex/b2-b",
    "purpose": "Verify the specific semantics and conditions used in this lesson.",
    "verifiedClaims": [
      "Range sums can be recovered from two prefix totals."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 19,
    contentHash: "dc095fe23ec0561f",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
