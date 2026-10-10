/**
 * Lesson: Monotonic stack (Stacks and queues). Verified on CPython 3.14.
 * Output: "[4, 2, 4, -1, -1]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Next Greater Element using a monotonic (decreasing) stack.
def next_greater(nums):
    res = [-1] * len(nums)
    stack = []  # holds indices whose answer is still unknown
    for i in range(len(nums)):
        # While the current value beats the value at the stack's top index,
        # we've found that index's next greater element.
        while stack and nums[stack[-1]] < nums[i]:
            j = stack.pop()
            res[j] = nums[i]
        stack.append(i)
    return res

print(next_greater([2, 1, 2, 4, 3]))


# Histogram: each popped bar is closed by a shorter right boundary.
def largest_rectangle(heights):
    heights = list(heights) + [0]
    stack = []
    best = 0
    for i, height in enumerate(heights):
        while stack and heights[stack[-1]] > height:
            bar = stack.pop()
            left = stack[-1] if stack else -1
            width = i - left - 1
            best = max(best, heights[bar] * width)
        stack.append(i)
    return best

histogram = [2, 1, 5, 6, 2, 3]
print(largest_rectangle(histogram))`;

export const monotonicStack: LessonDefinition = {
  id: "monotonic-stack",
  title: "Monotonic Stack",
  area: "Stacks and queues",
  prerequisites: [
  "stack-queue-operations"
],

  explanation: "A **monotonic stack** is a stack you deliberately keep **sorted** (either always increasing or always decreasing) by popping elements that would break the order before you push. It is the go-to tool for **\"next greater / next smaller element\"** and span problems, turning an obvious **O(n²)** double loop into a single **O(n)** pass.\n\nHere we solve **Next Greater Element**: for each value, find the first larger value to its right. We keep a stack of **indices whose answer we haven't found yet**, with their values **non-increasing** from bottom to top. When a new value `nums[i]` arrives, it is the \"next greater\" for every stacked index whose value is smaller — so we pop those and record `nums[i]` as their answer. Then we push `i`.\n\nThe magic of the O(n) bound: although there is a `while` inside the `for`, **each index is pushed once and popped at most once** across the entire run. Total pushes + pops ≤ 2n, so the whole thing is linear despite the nested loop. Recognising \"for each element, find the nearest bigger/smaller one\" is the cue to reach for a monotonic stack.\n\n**A harder application — \"Largest Rectangle in Histogram\".** Here bars have heights and you want the largest axis-aligned rectangle. Use a stack of bar **indices kept NON-DECREASING by height** (the opposite direction from next-greater). When a bar `heights[i]` is **shorter** than the bar on top, that top bar can extend no further right, so you **pop it and compute its rectangle**: its height is `heights[popped]`, and its **width** spans from just after the new stack top up to `i−1`. Concretely the width is `i − stack[-1] − 1` after popping (or `i` if the stack is now empty, meaning the popped bar was the shortest so far and stretches all the way left). Keep the largest area seen. **Correctness condition:** you must **flush the stack at the end** as if a sentinel bar of height 0 arrived at index `n`, so every positive bar still on the stack gets its rectangle measured; without that flush, bars that are never \"closed\" by a shorter bar are missed. Each index is pushed once and popped at most once, so it is still **O(n)** time and **O(n)** space.\n\nFor strict next-greater queries the loop uses <, so equal values remain unresolved together. Stack values are non-increasing from bottom to top, and each index is pushed once and popped at most once. An individual iteration can pop many indices; the linear bound is amortized across the scan.\n\nThe second runnable example performs this histogram scan. At index 4, height 2 closes heights 6 and 5; their widths are 1 and 2, giving areas 6 and 10. Equal heights may remain stacked: the earlier equal bar eventually gets the widest usable rectangle. Every positive-height candidate is closed by a smaller right boundary or the sentinel. Zero-height candidates may remain; their area is zero. The function copies its input, returns 0 for no bars, and assumes nonnegative unit-width heights.",

  vocabulary: [
  {
    "term": "Monotonic stack",
    "definition": "A stack kept entirely increasing or decreasing by popping order-breaking elements."
  },
  {
    "term": "Next greater element",
    "definition": "The first element to the right that is larger than the current one."
  },
  {
    "term": "Pending indices",
    "definition": "Indices on the stack still waiting for their answer."
  },
  {
    "term": "Amortized linear",
    "definition": "Each element is pushed and popped at most once, so total work is O(n)."
  }
],

  concepts: {
  "purpose": "Find nearest greater/smaller elements (or spans) for every position in one linear pass.",
  "operations": "Maintain a monotonic stack of indices; pop while the order would break, resolving answers; push the current index.",
  "uses": "Next/previous greater or smaller element, stock span, daily temperatures, largest rectangle in histogram.",
  "tradeoffs": "O(n) time and O(n) stack space; replaces the naive O(n²) pairwise scan.",
  "commonMistakes": "Storing values instead of indices when you need positions; wrong comparison direction (< vs >) for greater vs smaller; assuming it's O(n²) because of the nested while.",
  "edgeCases": "Elements with no greater element keep -1. Duplicates: use < (not <=) to define 'strictly greater'. Empty input returns []."
},

  complexity: [
  {
    "operation": "Next greater (monotonic stack)",
    "best": "O(n)",
    "average": "O(n)",
    "worst": "O(n)",
    "space": "O(n)",
    "note": "Each index pushed/popped once; stack up to O(n)."
  },
  {
    "operation": "Largest rectangle (copied sentinel)",
    "best": "O(n)",
    "average": "O(n)",
    "worst": "O(n)",
    "space": "O(n)",
    "note": "One copied array and index stack; each bar is popped at most once."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "number of input values for next_greater, or number of bars for largest_rectangle"
    }
  ],
  "costModel": "Each push and each pop is O(1). The total number of stack operations bounds the work.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "There is a while loop inside the for loop, which looks quadratic — but it is NOT. Each index is pushed exactly once (line 11) and popped at most once (line 9) over the whole run, so the total number of push/pop operations is at most 2n. The outer loop runs n times. Summed, all the work is O(n) — this is amortized analysis: the inner while can only undo pushes that already happened."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The stack can hold up to n indices at once (e.g. a non-increasing input where nothing gets popped until the end), and the result array is size n.",
    "inputOutputNote": "The res array of n answers is required output; the stack of up to n indices is the auxiliary structure. The bound covers the named algorithm; demonstration construction and collected print output are separate allocations."
  },
  "derivation": [
    {
      "lines": [
        5
      ],
      "description": "The outer loop runs n times.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        8,
        9,
        10,
        11
      ],
      "description": "Each index is pushed once and popped at most once — total stack ops <= 2n (amortized O(1) per element).",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        3,
        4
      ],
      "description": "The result array (n) and the stack (up to n indices).",
      "cost": "O(n)",
      "dimension": "space"
    },
    {
      "lines": [
        19
      ],
      "description": "Copy n heights and append a sentinel without mutating the caller.",
      "cost": "O(n)",
      "dimension": "space"
    },
    {
      "lines": [
        22,
        23,
        24,
        28
      ],
      "description": "Each bar index is pushed once and popped at most once across the histogram scan.",
      "cost": "O(n)",
      "dimension": "time"
    }
  ],
  "assumptions": [
    "Comparisons and stack ops are O(1).",
    "The amortized argument: an index popped once is never re-pushed.",
    "Histogram heights are nonnegative integers, bars have width one; bounded-size arithmetic costs O(1)."
  ],
  "tradeoffs": "The naive approach scans right for each element (O(n²) time, O(1) space); the monotonic stack trades O(n) space for O(n) time.",
  "counters": [
    {
      "label": "pushes",
      "definition": "executions of the push (line 11)",
      "countLines": [
        11
      ]
    },
    {
      "label": "pops (answers found)",
      "definition": "executions of the pop that resolves an answer (line 9)",
      "countLines": [
        9
      ]
    }
  ],
  "fixedDataNote": "Next-greater output is unchanged; the histogram walkthrough prints 10. Each function has O(n) scan time and O(n) storage; diagnostic tracing cost is separate."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: Next Greater Element via a decreasing stack."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define next_greater(nums)."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Default every answer to -1 (no greater element)."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "The stack holds indices still awaiting their next-greater answer."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Scan left to right."
  },
  {
    "line": 6,
    "executable": false,
    "explanation": "Comment describing the pop condition."
  },
  {
    "line": 7,
    "executable": false,
    "explanation": "Comment continues."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "While the top index's value is smaller than the current value..."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "...pop that index (its answer is found)."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Record nums[i] as its next greater element."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Push the current index; its answer is still unknown."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Return the answers."
  },
  {
    "line": 13,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "next_greater([2,1,2,4,3]) → [4, 2, 4, -1, -1]."
  },
  {
    "line": 15,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 16,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 17,
    "executable": false,
    "explanation": "Comment: a shorter arrival closes the right side of a candidate rectangle."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "Define the area function for nonnegative unit-width bar heights."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "Copy the input and append a zero sentinel, leaving the original unchanged."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Keep bar indices in non-decreasing height order."
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "Start with area zero, including the empty-input case."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "Scan actual bars plus the sentinel."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "A shorter height closes taller candidates; ties can stay on the stack."
  },
  {
    "line": 24,
    "executable": true,
    "explanation": "Remove the candidate bar whose right boundary has now been found."
  },
  {
    "line": 25,
    "executable": true,
    "explanation": "Use the remaining top as the left boundary; -1 means before the first bar."
  },
  {
    "line": 26,
    "executable": true,
    "explanation": "Exclude both boundary positions to get the number of covered bars."
  },
  {
    "line": 27,
    "executable": true,
    "explanation": "Measure the popped height times its width and keep the largest area."
  },
  {
    "line": 28,
    "executable": true,
    "explanation": "Store this index as a future candidate."
  },
  {
    "line": 29,
    "executable": true,
    "explanation": "Return the maximum area; remaining zero-height candidates contribute no area."
  },
  {
    "line": 30,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 31,
    "executable": true,
    "explanation": "Six bars from the worked histogram example."
  },
  {
    "line": 32,
    "executable": true,
    "explanation": "Print area 10, from height 5 across the bars of heights 5 and 6."
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
  },
  {
    "variable": "histogram",
    "model": "array"
  },
  {
    "variable": "heights",
    "model": "array",
    "overlays": [
      {
        "role": "pointer",
        "label": "i",
        "source": "i"
      }
    ]
  }
],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "There's a while loop inside a for loop — why is this O(n) and not O(n^2)?",
    "answer": "Because each index is pushed once and popped at most once over the entire run, so total stack operations are at most 2n → O(n).",
    "explanation": "The inner while only pops indices that were previously pushed. Across all iterations the number of pops can't exceed the number of pushes (n), so the combined work is linear, not quadratic."
  }
],

  experiments: [
  "Trace the stack for [2,1,2,4,3] and watch 4 resolve three pending indices at once.",
  "Change < to > to compute the Next Smaller Element instead.",
  "Feed a non-increasing array and see the stack grow to size n (all -1 answers).",
  "Try histogram heights [1,2,3]: without a final height-0 sentinel, the increasing run never pops and its best area is missed. Heights must be nonnegative; the sentinel flushes positive bars, while retained zero bars have area zero.",
  "Run largest_rectangle on [], [0,0], [2,2], [1,2,3], and [3,2,1]. Predict areas 0, 0, 4, 4, 4; remove the sentinel to see why an increasing suffix is missed."
],

  exercises: [
  {
    "id": "mono-choose-1",
    "kind": "choose-approach",
    "prompt": "Problem: for each day, how many days until a warmer temperature? Which structure gives O(n), and what does the stack hold?",
    "expected": "A monotonic (decreasing) stack holding indices of days awaiting a warmer day; when a warmer day arrives, pop and record the day gap. O(n) time.",
    "hints": [
      "Goal: choose the O(n) structure for 'how many days until a warmer temperature' per day.",
      "Comparing every later day is O(n^2); you want each day resolved once.",
      "Key insight: this is a next-greater-element variant, where earlier unresolved days wait for a warmer day.",
      "Approach: keep a non-increasing monotonic stack of indices awaiting resolution.",
      "Pseudocode: for each day, pop stacked days colder than today and record the index gap, then push today.",
      "Use a non-increasing monotonic stack of indices; when a warmer day arrives, pop and record the day gap for O(n) total."
    ],
    "recognition": {
      "scenario": "For each day, how many days until a warmer temperature? Which structure gives O(n), and what does it hold?",
      "approaches": [
        {
          "id": "mono-stack",
          "label": "Monotonic (non-increasing) stack of indices",
          "requiredReasonIds": [
            "pop-on-warmer-day"
          ]
        },
        {
          "id": "brute",
          "label": "For each day scan forward for a warmer day",
          "requiredReasonIds": [],
          "rejectionFeedback": "The nested forward scan is O(n^2); a monotonic stack answers all days in O(n)."
        }
      ],
      "reasons": [
        {
          "id": "pop-on-warmer-day",
          "text": "Keep a non-increasing stack of day indices awaiting a warmer day; when a warmer day arrives, pop the waiting days and record the index gap — O(n) total."
        },
        {
          "id": "window-expiry",
          "text": "Elements expire from the front of a fixed-size window, so a deque is required.",
          "contradictory": true
        },
        {
          "id": "sort-temps",
          "text": "The temperatures must be sorted before processing.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "mono-stack"
      ],
      "modelExplanation": "A monotonic non-increasing stack of indices: each warmer day pops the cooler days waiting below and records the wait, giving O(n) total."
    }
  },
  {
    "id": "mono-fix-1",
    "kind": "fix-mistake",
    "prompt": "`mono_stack(nums)` should return the monotonic stack of INDICES left after one pass (pop while the top's value is smaller than the current value, then push the current index). This version pushes the VALUES instead, so you cannot recover positions. Fix it to store and compare by indices.",
    "starterCode": "def mono_stack(nums):\n    stack = []\n    for i in range(len(nums)):\n        while stack and stack[-1] < nums[i]:\n            stack.pop()\n        stack.append(nums[i])\n    return stack",
    "expected": "def mono_stack(nums):\n    stack = []\n    for i in range(len(nums)):\n        while stack and nums[stack[-1]] < nums[i]:\n            stack.pop()\n        stack.append(i)\n    return stack",
    "hints": [
      "Goal: fix the monotonic stack so it stores indices, enabling day-gap computation.",
      "Storing values loses positional information, so gaps between days can't be computed.",
      "Key insight: you need positions on the stack and must dereference the array when comparing.",
      "Approach: push indices and compare using nums[stack[-1]] against nums[i].",
      "Pseudocode: for i: while stack and nums[stack[-1]] < nums[i]: pop; push i.",
      "Push `i` and compare with `nums[stack[-1]] < nums[i]`, so `stack.append(i)` stores indices."
    ],
    "tests": "assert mono_stack([2, 1, 5, 3]) == [2, 3], f'indices of the decreasing run ending at end, got {mono_stack([2,1,5,3])}'\nassert mono_stack([]) == [], 'empty'\nassert mono_stack([1, 2, 3]) == [2], 'strictly increasing: only the last index survives'\nassert mono_stack([3, 2, 1]) == [0, 1, 2], 'strictly decreasing: all indices kept'\n# entries must be indices, not values (the value-storing bug gives [5, 3] here):\nassert all(0 <= s < 4 for s in mono_stack([2, 1, 5, 3]))\nprint('OK')"
  },
  {
    "id": "mono-histogram-1",
    "kind": "predict-state",
    "prompt": "Largest Rectangle in Histogram on heights = [2,1,5,6,2,3] using an increasing-height index stack (with a height-0 sentinel appended). When bar i=4 (height 2) arrives, the stack holds indices [.. ,2,3] (heights 5,6). Which bars are popped, what widths/areas are computed, and what is the final maximum area? Why is the end sentinel required?",
    "expected": "At i=4 (height 2): pop index 3 (height 6) -> width = 4 - stack[-1] - 1 = 4 - 2 - 1 = 1, area 6; then pop index 2 (height 5) -> width = 4 - 1 - 1 = 2, area 10. The maximum area is 10 (bars 5,6 give height 5 x width 2). The appended height-0 sentinel at index n forces every positive remaining bar to be popped and measured at the end; without it the tall trailing bars (e.g. index 5, height 3) would never be closed and their rectangles would be missed.",
    "hints": [
      "Understand: a bar extends until a smaller bar closes its right boundary.",
      "An increasing suffix can remain on the stack after the scan.",
      "A trailing zero is below every positive height.",
      "Use nonnegative heights and a final height-0 sentinel.",
      "Pseudocode: append sentinel; pop while stacked height > current height; calculate height*width.",
      "Solution: flush all positive bars with the zero sentinel. Zero-height bars may remain with the strict comparison, but their area is zero. [1,2,3] is a useful missing-flush witness."
    ]
  }
],

  review: "A **monotonic stack** stays sorted by popping order-breaking elements, solving **next greater/smaller** problems in **O(n)** time / **O(n)** space instead of O(n²). The key insight is amortized: each index is pushed once and popped at most once, so the nested `while` inside the `for` is still linear overall. Store **indices** when you need positions.",

  expectedOutput: "[4, 2, 4, -1, -1]\n10\n",

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
  },
  {
    "url": "https://assets.hkoi.org/training2019/ds-i.pdf",
    "title": "HKOI: Data Structures I",
    "section": "Slides 31–36: histogram observations, monotonic stack, right boundary and end flush",
    "topic": "monotonic-stack",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "A shorter bar closes taller rectangles; a final flush measures candidates left at the end."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source stores height and left boundary; app stores indices and computes width i-left-1. Equal heights remain; zero sentinel flushes positive heights."
    ]
  },
  {
    "url": "https://leetcode.com/problems/largest-rectangle-in-histogram/description/",
    "title": "Largest Rectangle in Histogram",
    "section": "Problem definition; examples 1 and 2; nonnegative-height constraints",
    "topic": "monotonic-stack",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Unit-width bars [2,1,5,6,2,3] have maximum area 10."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Nonnegative heights and unit-width bars. App additionally handles empty input as area 0, copies heights, and appends a zero sentinel."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "342be63760409f8d",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
