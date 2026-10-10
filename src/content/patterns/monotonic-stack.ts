/**
 * Pattern: Monotonic stack.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "[4, 2, 4, -1, -1]\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# Monotonic stack: next greater element for each position, in O(n).
def next_greater(nums):
    res = [-1] * len(nums)
    stack = []                        # holds indices with DECREASING values
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            res[stack.pop()] = x      # x is the next greater for that popped index
        stack.append(i)
    return res

print(next_greater([2, 1, 2, 4, 3]))  # [4, 2, 4, -1, -1]`;

export const monotonicStackPattern: PatternDefinition = {
  id: "monotonic-stack",
  title: "Monotonic Stack",
  category: "Stacks & queues",
  summary:
    "Keep a stack whose values stay sorted so each element is pushed once and popped at most once, answering next-greater/smaller queries in O(n).",

  clues: [
  "For each element you need the NEXT (or previous) greater/smaller element, or a span/range bounded by such.",
  "The naive answer scans forward/backward from each element (O(n²)).",
  "Problems about bars/heights, temperatures, spans, or histogram areas.",
  "Phrases like 'next greater element', 'daily temperatures', 'largest rectangle in histogram', 'stock span'."
],

  naiveApproach: "For each element, scan the rest of the array to find the next greater one — **O(n²)**. This repeatedly re-scans regions that a stack could remember, and it discards comparisons that could have resolved several elements at once.",

  whyItHelps: "Maintain a stack of indices whose values are kept **monotonic** (e.g. non-increasing for 'next greater'). When a new element arrives, it **resolves and pops** every stacked element it exceeds — each pop finalizes that element's answer. Because every index is **pushed once and popped at most once**, the total work is **O(n)** despite the inner while-loop. The stack effectively remembers the \"unresolved\" candidates in order, so one new element can settle many at once — turning the O(n²) rescan into a single linear pass with O(n) space.\n\nFor strict next-greater queries the loop uses <, so equal values remain unresolved together. Stack values are non-increasing from bottom to top, and each index is pushed once and popped at most once. An individual iteration can pop many indices; the linear bound is amortized across the scan.",

  conditions: [
  "The query is a directional next/previous greater-or-smaller relationship (monotone comparison).",
  "Strict next-greater uses non-increasing stack values; strict next-smaller uses non-decreasing values. The inequality determines whether ties stay.",
  "Store INDICES (not just values) when you need positions, spans, or distances."
],

  alternatives: [
  "Monotonic DEQUE — for sliding-window maximum/minimum, where elements also expire from the front as the window moves.",
  "Sorting + processing in value order — an alternative for some next-greater variants, but usually O(n log n).",
  "Segment tree / sparse table — for arbitrary range max/min queries, not the specific next-greater relationship."
],

  counterexamples: [
  "Arbitrary range-maximum queries (any [l, r]) aren't a next-greater relationship — use a segment tree or sparse table.",
  "Sliding-window max/min needs front eviction as the window slides — use a monotonic deque, not a plain stack.",
  "Choosing the wrong monotonic direction (increasing when you want next-greater) yields incorrect answers — a setup error, not a different pattern."
],

  walkthroughCode,
  walkthroughExpectedOutput: "[4, 2, 4, -1, -1]\n",
  complexityNote:
    "O(n) time — each index is pushed and popped at most once, so the inner while-loop is amortized O(1). O(n) space for the stack and result.",

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in nums"
    }
  ],
  "costModel": "A stack holds indices with decreasing values. Each index is pushed exactly once and popped at most once, so the inner while-loop's total pops over the whole run are bounded by n (amortised analysis).",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "Although lines 6-7 are a nested while inside the for, each index is pushed once (line 8) and popped at most once (line 7). Across the ENTIRE run there are at most n pops, so the total inner-loop work is O(n), not O(n²). The for loop itself is O(n). Total O(n) amortised."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The stack can hold up to n indices (a non-increasing array), and the result array is size n.",
    "inputOutputNote": "nums (n) is the input; the O(n) result is the output; the stack is O(n) auxiliary. The bound covers the named algorithm; demonstration construction and collected print output are separate allocations."
  },
  "derivation": [
    {
      "lines": [
        5
      ],
      "description": "Outer loop over n elements.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        6,
        7
      ],
      "description": "Each index popped at most once across the whole run (amortised).",
      "cost": "O(n) total",
      "dimension": "time"
    },
    {
      "lines": [
        3,
        4
      ],
      "description": "Result array + stack, each up to n.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Push/pop on a Python list end are amortised O(1).",
    "The 'amortised O(1) per step' argument relies on each index being popped at most once."
  ],
  "tradeoffs": "A brute-force next-greater scan is O(n²); the monotonic stack achieves O(n) by never re-examining a resolved index.",
  "counters": [
    {
      "label": "pops",
      "definition": "executions of the stack pop / assignment (line 7)",
      "countLines": [
        7
      ]
    }
  ],
  "fixedDataNote": "For [2,1,2,4,3] the result is [4,2,4,-1,-1] with total pops <= n. The O(n) amortised bound generalises."
},

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: compute the next greater element per index in O(n)."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define next_greater(nums)."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Default answer -1 (no greater element to the right)."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Stack of indices whose values are kept decreasing."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Scan each element with its index."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "While the top of the stack has a smaller value than x..."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "...x is that index's next greater element; pop and record it."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Push the current index as a new unresolved candidate."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Return the next-greater answers."
  },
  {
    "line": 10,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "For [2,1,2,4,3] the next-greater array is [4, 2, 4, -1, -1]."
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
      }
    ]
  },
  {
    "variable": "stack",
    "model": "stack"
  }
],

  linkedLessons: ["monotonic-stack", "stack-queue-operations", "min-max-tracking"],

  exercises: [
  {
    "id": "pat-ms-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'For each day, how many days until a warmer temperature?' Which pattern, and what does the stack hold?",
    "expected": "Monotonic stack (decreasing temperatures), storing INDICES. When a warmer day arrives it pops cooler days and records the index gap as the wait. O(n) total.",
    "correctPatternId": "monotonic-stack",
    "hints": [
      "Goal: for each day, find how many days until a warmer temperature.",
      "Scanning forward from every day is O(n^2); a stack reuses unresolved days instead of rescanning.",
      "Key insight: it's a 'next greater' problem, and you need distances, so the stack should hold indices.",
      "Approach: use a monotonic non-increasing stack of indices, resolving days when a warmer one arrives.",
      "Pseudocode: for each i: while stack top is cooler than today, pop and record i minus its index; push i.",
      "Use a non-increasing monotonic stack storing indices; a warmer day pops cooler ones and records the index gap — O(n)."
    ],
    "recognition": {
      "scenario": "For each day, how many days until a warmer temperature? Which pattern applies and what does the stack hold?",
      "approaches": [
        {
          "id": "mono-stack",
          "label": "Monotonic (non-increasing) stack of indices",
          "requiredReasonIds": [
            "pop-on-warmer"
          ]
        },
        {
          "id": "brute",
          "label": "For each day scan forward for a warmer day",
          "requiredReasonIds": [],
          "rejectionFeedback": "The nested forward scan is O(n^2); a monotonic stack answers all days in O(n) total."
        }
      ],
      "reasons": [
        {
          "id": "pop-on-warmer",
          "text": "Keep a non-increasing stack of day INDICES awaiting a warmer day; when a warmer day arrives, pop the cooler days and record the index gap — O(n) total."
        },
        {
          "id": "window-expires",
          "text": "Elements expire from the front as a fixed window slides, so a deque is required.",
          "contradictory": true
        },
        {
          "id": "needs-sorting",
          "text": "The temperatures must be sorted first.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "mono-stack"
      ],
      "modelExplanation": "A monotonic non-increasing stack of indices: each warmer day pops the cooler days waiting below it and records the wait, giving O(n) total work."
    }
  },
  {
    "id": "pat-ms-choose-1",
    "kind": "choose-approach",
    "prompt": "You need the MAXIMUM of every sliding window of size k as the window moves. Monotonic stack or something else?",
    "expected": "Not a plain monotonic stack — elements expire from the front as the window slides, which a stack can't do. Use a monotonic DEQUE (decreasing), popping the front when it leaves the window. O(n).",
    "hints": [
      "Goal: find the maximum of every sliding window of size k as it moves.",
      "A monotonic stack can't handle elements expiring from the front as the window advances.",
      "Key insight: the window drops old elements from the front, which a stack's single working end can't do.",
      "Approach: use a monotonic non-increasing deque, evicting the front when it leaves the window.",
      "Pseudocode: for each i: pop smaller values from the back; append i; pop the front if it's out of the window; record the front's value.",
      "Use a monotonic (non-increasing) deque, popping the front when it leaves the window — O(n), not a plain stack."
    ],
    "recognition": {
      "scenario": "You need the MAXIMUM of every sliding window of size k as the window moves.",
      "approaches": [
        {
          "id": "mono-deque",
          "label": "Monotonic (non-increasing) deque",
          "requiredReasonIds": [
            "expire-front"
          ]
        },
        {
          "id": "mono-stack",
          "label": "Plain monotonic stack",
          "requiredReasonIds": [],
          "rejectionFeedback": "Elements expire from the FRONT as the window slides, which a stack (LIFO, one end) cannot remove — you need a deque."
        }
      ],
      "reasons": [
        {
          "id": "expire-front",
          "text": "As the window slides, the oldest element leaves from the front and dominated elements leave from the back, so a double-ended queue maintains the max in O(n)."
        },
        {
          "id": "no-expiry",
          "text": "Nothing ever leaves from the front, so a one-ended stack is enough.",
          "contradictory": true
        },
        {
          "id": "needs-heap",
          "text": "Only a heap can report the window maximum.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "mono-deque"
      ],
      "modelExplanation": "Not a plain stack — window elements expire from the front, so use a monotonic non-increasing DEQUE, popping the front when it leaves the window: O(n)."
    }
  },
  {
    "id": "pat-ms-fix-1",
    "kind": "fix-mistake",
    "prompt": "`next_greater(nums)` returns a list where each position holds the next strictly greater element to its right, or -1 if none. This uses the wrong comparison and leaves answers unresolved. Fix the while condition.",
    "starterCode": "def next_greater(nums):\n    res = [-1] * len(nums)\n    stack = []\n    for i, x in enumerate(nums):\n        while stack and nums[stack[-1]] > x:\n            res[stack.pop()] = x\n        stack.append(i)\n    return res",
    "expected": "def next_greater(nums):\n    res = [-1] * len(nums)\n    stack = []\n    for i, x in enumerate(nums):\n        while stack and nums[stack[-1]] < x:\n            res[stack.pop()] = x\n        stack.append(i)\n    return res",
    "hints": [
      "Goal: fix 'next greater' so answers aren't left unresolved by the wrong comparison.",
      "The bug uses the wrong inequality, so smaller stacked elements never get resolved by a larger arrival.",
      "Key insight: an arriving x should resolve stacked elements that are SMALLER than it, keeping the stack non-increasing.",
      "Approach: pop while the stacked value is less than x, assigning x as their next greater.",
      "Pseudocode: for i,x: while stack and nums[stack[-1]] < x: res[stack.pop()] = x; push i.",
      "Use `while stack and nums[stack[-1]] < x` (compare with < , not >) so smaller elements resolve to x."
    ],
    "tests": "assert next_greater([2, 1, 2, 4, 3]) == [4, 2, 4, -1, -1]\nassert next_greater([1, 2, 3]) == [2, 3, -1]\nassert next_greater([3, 2, 1]) == [-1, -1, -1]\nassert next_greater([5]) == [-1]\nassert next_greater([2, 7, 3, 5, 1]) == [7, -1, 5, -1, -1]\nprint('OK')"
  }
],

  references: [
  {
    "url": "https://courses.cis.cornell.edu/courses/cs2110/2026fa/lectures/lec15/",
    "title": "Cornell CS2110: Stacks and queues",
    "section": "LinkedStack; exercises 15.6, 15.7, 15.10; deque interface",
    "topic": "monotonic-stack",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Next-greater monotonic stack keeps candidates ordered."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source next-greater exercise scans right to left and omits the final output slot. App scans left to right, returns n slots, and uses -1 for no strict greater successor."
    ]
  },
  {
    "url": "https://cp-algorithms.com/data_structures/stack_queue_modification.html",
    "title": "Minimum stack and queue",
    "section": "Stack modification; queue methods 1–3; fixed-length subarray minimum",
    "topic": "monotonic-stack",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Sliding-window extrema need front expiry as well as back domination removal."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source minimum structures transfer once between two FIFO stacks; reverse comparisons for app maximum variants. Monotonic deque expires by window index."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "9fc6b611bc9d8161",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
