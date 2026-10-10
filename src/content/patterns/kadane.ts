/**
 * Pattern: Kadane's algorithm (maximum subarray).
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2). Output "6\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# Kadane: largest sum of ANY non-empty contiguous subarray (negatives allowed).
def kadane(nums):
    best = nums[0]     # best sum found anywhere
    cur = nums[0]      # best sum of a subarray ENDING at the current index
    for i in range(1, len(nums)):
        x = nums[i]
        cur = max(x, cur + x)   # extend the running subarray, or restart at x
        best = max(best, cur)   # remember the best ending-here seen so far
    return best

print(kadane([-2, 1, -3, 4, -1, 2, 1, -5, 4]))  # [4,-1,2,1] -> 6`;

export const kadanePattern: PatternDefinition = {
  id: "kadane",
  title: "Kadane's Algorithm (Maximum Subarray)",
  category: "Arrays & strings",
  summary:
    "Scan once, tracking the best subarray ending at each index by choosing to extend or restart — the maximum-subarray classic.",

  clues: [
    "You want the MAXIMUM (or minimum) sum of a contiguous subarray, with no fixed size.",
    "The array contains a mix of positive and NEGATIVE numbers (otherwise the whole array wins).",
    "Phrases like 'maximum subarray sum', 'best contiguous run', 'largest sum of any window'.",
    "You need a value (the best sum), sometimes with the indices, but not a count.",
  ],

  naiveApproach: `Consider every subarray: for each start, extend to each end and track the running sum, keeping the max — **O(n²)**. Trying all (start, end) pairs and summing each independently is **O(n³)**. The waste is recomputing sums of overlapping ranges that a single pass could reuse.`,

  whyItHelps: `The key insight is a **local subproblem**: the best subarray *ending at index i* is either just \`nums[i]\` alone, or \`nums[i]\` appended to the best subarray ending at i−1 — whichever is larger. So \`cur = max(x, cur + x)\`: if the running sum has gone negative it can only hurt, so **restart** at \`x\`; otherwise **extend**. Track the best \`cur\` ever seen in \`best\`. Each element is visited once, giving **O(n)** time and **O(1)** space — it's dynamic programming compressed to two rolling variables.`,

  conditions: [
    "The subarray must be CONTIGUOUS and NON-EMPTY (initialize best/cur to nums[0], not 0, so an all-negative array returns its largest element).",
    "You want an extremum (max or min) of the sum, not a count and not an exact target.",
    "For the minimum-subarray variant, flip the max operations to min.",
  ],

  alternatives: [
    "Fixed-size sliding window — when the subarray length is FIXED at k; Kadane is for variable length.",
    "Prefix sums + hashmap — when you must COUNT subarrays with a target sum, or handle divisibility.",
    "Divide and conquer — also solves maximum subarray in O(n log n); Kadane's O(n) is strictly better but D&C teaches the three-case split.",
  ],

  counterexamples: [
    "Initializing best = 0 breaks all-negative inputs (it would wrongly return 0 for a required non-empty subarray). Start from nums[0].",
    "'Largest sum of exactly k consecutive elements' — fixed size → sliding window, not Kadane.",
    "'How many subarrays sum to k' — a count with an exact target → prefix sums + hashmap, not Kadane.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "6\n",
  complexityNote:
    "O(n) time (single pass) and O(1) space (two rolling variables). The naive all-subarrays approaches are O(n²)–O(n³); divide-and-conquer is O(n log n).",

  complexityExplanation: {
  "scope": "operation",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in nums"
    }
  ],
  "costModel": "Two rolling scalars: `cur` (best subarray ending here) and `best` (best anywhere). Each element does a constant amount of work.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The n-1 remaining indices each perform bounded-value addition/comparisons, so worst-case O(n) in this unit-cost model."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Only `cur` and `best` are kept; nothing grows with n.",
    "inputOutputNote": "The existing input list is not copied. The two rolling totals and index use constant auxiliary slots under bounded-value arithmetic."
  },
  "derivation": [
    {
      "lines": [
        3,
        4
      ],
      "description": "Initialise the two rolling variables.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        5,
        7,
        8
      ],
      "description": "One pass, constant work per element.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        3,
        4
      ],
      "description": "Two scalar variables.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "The array is non-empty (nums[0] seeds best/cur).",
    "Addition and comparison are O(1).",
    "Handles negatives — the max(x, cur+x) restart is what makes negatives work."
  ],
  "tradeoffs": "Naive all-subarrays is O(n²)–O(n³); a divide-and-conquer max-subarray is O(n log n). Kadane is optimal at O(n) time and O(1) space.",
  "counters": [
    {
      "label": "elements scanned",
      "definition": "current value reads",
      "countLines": [
        6
      ]
    }
  ],
  "fixedDataNote": "For the 9-element sample the max subarray [4,-1,2,1] sums to 6. The O(n) bound generalises."
},

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: max sum of any contiguous subarray, negatives allowed."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define kadane(nums)."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "best = the largest subarray sum found anywhere (seed with the first element)."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "cur = the best subarray sum ending at the current index (also seeded with the first element)."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Visit indices 1..n-1 without copying a list slice."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Read the current value in constant time."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Extend the current run (cur + x) or restart at x — whichever is larger. Restarting happens when the run had gone negative."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Update the global best with the best ending here."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Return the maximum subarray sum."
  },
  {
    "line": 10,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "The best subarray of the sample is [4,-1,2,1] summing to 6."
  }
],

  bindings: [
  {
    "variable": "nums",
    "model": "array",
    "overlays": [
      {
        "role": "pointer",
        "label": "i",
        "source": "i"
      },
      {
        "role": "total",
        "label": "cur",
        "source": "cur"
      },
      {
        "role": "total",
        "label": "best",
        "source": "best"
      }
    ]
  }
],

  linkedLessons: ["kadane", "dp-state-transitions", "dp-divide-and-conquer"],

  exercises: [
  {
    "id": "pat-kadane-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'Given an array with positives and negatives, find the largest sum of any non-empty contiguous subarray.' Which pattern?",
    "expected": "Kadane's algorithm. No fixed size and negatives are present, so track the best subarray ending at each index (extend vs restart) in one O(n) pass with O(1) space.",
    "correctPatternId": "kadane",
    "hints": [
      "Goal: find the largest sum of any non-empty contiguous subarray with mixed signs.",
      "Trying every subarray is O(n^2); the 'ending here' subproblem lets you reuse the previous step's best.",
      "Key insight: the best subarray ending at i either extends the previous one or restarts at i.",
      "Approach: use Kadane's algorithm in one O(n) pass with O(1) space.",
      "Pseudocode: cur = max(x, cur + x); best = max(best, cur) for each element; return best.",
      "This is Kadane's algorithm: `cur = max(x, cur + x)` decides extend-vs-restart at each index."
    ],
    "recognition": {
      "scenario": "Given an array with positives and negatives, find the largest sum of any non-empty contiguous subarray.",
      "approaches": [
        {
          "id": "kadane",
          "label": "Kadane's algorithm",
          "requiredReasonIds": [
            "extend-or-restart"
          ]
        },
        {
          "id": "fixed-window",
          "label": "Fixed-size sliding window",
          "requiredReasonIds": [],
          "rejectionFeedback": "No fixed width is given — the winning subarray can be any length — so a constant window does not apply."
        },
        {
          "id": "prefix-map",
          "label": "Prefix sums + hash map",
          "requiredReasonIds": [],
          "rejectionFeedback": "That counts target-sum subarrays; here we want the single maximum sum."
        }
      ],
      "reasons": [
        {
          "id": "extend-or-restart",
          "text": "At each index decide whether to extend the best subarray ending here or restart from this element — one O(n) pass, O(1) space."
        },
        {
          "id": "fixed-window-len",
          "text": "The subarray length is fixed in advance, so slide a constant window.",
          "contradictory": true
        },
        {
          "id": "need-count",
          "text": "We only need to count qualifying subarrays, not find a maximum.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "kadane"
      ],
      "modelExplanation": "Kadane's algorithm: track the best subarray sum ending at each index (extend vs restart) and the running maximum, in O(n) time and O(1) space."
    }
  },
  {
    "id": "pat-kadane-fix-1",
    "kind": "fix-mistake",
    "prompt": "This returns 0 for all-negative arrays but the subarray must be non-empty. Fix the initialization.",
    "starterCode": "def kadane(nums):\n    best = 0\n    cur = 0\n    for x in nums:\n        cur = max(x, cur + x)\n        best = max(best, cur)\n    return best",
    "expected": "def kadane(nums):\n    best = nums[0]\n    cur = nums[0]\n    for i in range(1, len(nums)):\n        x = nums[i]\n        cur = max(x, cur + x)\n        best = max(best, cur)\n    return best",
    "hints": [
      "Goal: make Kadane return the true maximum for all-negative arrays where the subarray must be non-empty.",
      "The bug initializes best to 0, so an all-negative array wrongly reports 0 (an empty selection).",
      "Key insight: a non-empty subarray must include at least one element, so the seed must be an actual value.",
      "Approach: seed both best and cur from nums[0] and start the scan at index 1.",
      "Pseudocode: best=cur=nums[0]; for x in nums[1:]: cur=max(x,cur+x); best=max(best,cur); return best.",
      "Initialize `best = cur = nums[0]` and loop from index 1 so all-negative inputs return their largest element."
    ],
    "tests": "assert kadane([-2, -3, -1, -4]) == -1, 'all-negative: best is the single largest element (-1), not 0'\nassert kadane([1, 2, 3]) == 6, 'all-positive: whole array'\nassert kadane([-2, 1, -3, 4, -1, 2, 1, -5, 4]) == 6, 'classic mixed case'\nassert kadane([5]) == 5, 'single element'\nassert kadane([-7]) == -7, 'single negative element'\nprint('OK')"
  },
  {
    "id": "pat-kadane-predict-1",
    "kind": "predict-state",
    "prompt": "Trace cur across [-2, 1, -3, 4, -1, 2, 1, -5, 4]. Where does cur restart, and what is best?",
    "expected": "cur restarts at 1 (after -2), at 4 (after the run went to -2), then extends 4→3→5→6, dips, and best = 6 for subarray [4,-1,2,1].",
    "hints": [
      "Restart happens when cur + x < x, i.e. cur was negative.",
      "The 4 begins the winning run.",
      "best peaks at 6."
    ]
  }
],

  references: [
  {
    "url": "https://cp-algorithms.com/others/maximum_average_segment.html",
    "title": "CP-Algorithms: maximum subarray",
    "section": "Algorithm 2: Kadane",
    "topic": "codex/b2-b",
    "purpose": "Verify the specific semantics and conditions used in this lesson.",
    "verifiedClaims": [
      "The best running sum can restart after a negative prefix; a one-pass algorithm uses constant working state."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 19,
    contentHash: "00f44dbdc6a1c10a",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
