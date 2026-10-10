/**
 * Lesson: Rotated array search (Searching). Verified on CPython 3.14.
 * Output: "4\n-1\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Search a sorted array that has been rotated at an unknown pivot.
def search_rotated(nums, target):
    lo = 0
    hi = len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        # One side of mid is always sorted. Find which, then decide.
        if nums[lo] <= nums[mid]:            # left half is sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1                 # target in the sorted left
            else:
                lo = mid + 1
        else:                                # right half is sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1                 # target in the sorted right
            else:
                hi = mid - 1
    return -1

print(search_rotated([4, 5, 6, 7, 0, 1, 2], 0))
print(search_rotated([4, 5, 6, 7, 0, 1, 2], 3))`;

export const rotatedArraySearch: LessonDefinition = {
  id: "rotated-array-search",
  title: "Search in a Rotated Sorted Array",
  area: "Searching",
  prerequisites: ["binary-search"],

  explanation: "A **rotated sorted array** is a sorted array that has been \"cut\" at some pivot and the two pieces swapped, e.g. `[4,5,6,7,0,1,2]` (originally `[0,1,2,4,5,6,7]` rotated). It is no longer fully sorted, so plain binary search breaks — yet we can still find a target in **O(log n)** with a clever twist.\n\nThe key observation: **at least one side of `mid` is always properly sorted.** Compare `nums[lo]` with `nums[mid]`. If `nums[lo] <= nums[mid]`, the **left half is sorted**; otherwise the **right half is sorted.** Once you know which side is sorted, you can test in O(1) whether the target lies within that sorted side's range — if so, search there; if not, search the other side. Either way you still discard half the array each step, preserving the logarithmic cost.\n\nThis is binary search adapted to a broken-but-structured order. The same \"which side is sorted?\" reasoning also finds the minimum/pivot of a rotated array.\n\nThis walkthrough requires DISTINCT values in a rotation of an ascending sorted list. Duplicates can make this exact implementation return an incorrect answer: searching 0 in [1,0,1,1,1] returns -1. A duplicate-aware variant must shrink ambiguous equal endpoints (after checking mid); its worst case can be O(n).",

  vocabulary: [
  {
    "term": "Rotated sorted array",
    "definition": "A sorted array split at a pivot with the parts swapped."
  },
  {
    "term": "Pivot",
    "definition": "The rotation point where order 'wraps around'."
  },
  {
    "term": "Sorted half",
    "definition": "For distinct values, at least one side of mid is in increasing order."
  },
  {
    "term": "Range test",
    "definition": "Checking in O(1) whether the target falls within a sorted half's bounds."
  }
],

  concepts: {
  "purpose": "Find a value in a rotated sorted array in O(log n) despite the broken order.",
  "operations": "Identify which half of mid is sorted; test if the target is in it; discard the other half.",
  "uses": "Rotated-array search/minimum, circular sorted data, resuming search after a wrap.",
  "tradeoffs": "Still O(log n) like binary search but with more branch logic; assumes distinct elements for the clean version.",
  "commonMistakes": "Wrong inequality when detecting the sorted side (use nums[lo] <= nums[mid]); off-by-one in the range test; duplicates breaking the sorted-side detection (needs a special case).",
  "edgeCases": "Empty input returns -1; no rotation, singleton and targets at either end are supported. This walkthrough requires DISTINCT values in a rotation of an ascending sorted list. Duplicates can make this exact implementation return an incorrect answer: searching 0 in [1,0,1,1,1] returns -1. A duplicate-aware variant must shrink ambiguous equal endpoints (after checking mid); its worst case can be O(n)."
},

  complexity: [
  {
    "operation": "Rotated search",
    "best": "O(1)",
    "average": "O(log n)",
    "worst": "O(log n)",
    "space": "O(1)",
    "note": "Only for distinct values; duplicates violate this implementation's correctness precondition."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in the array"
    }
  ],
  "costModel": "Each iteration does a constant number of comparisons and discards half the range.",
  "time": {
    "bound": "O(log n)",
    "case": "worst",
    "explanation": "With distinct values, the comparison of nums[lo] and nums[mid] identifies an ordered half. Its endpoint range decides which half may contain the target; each update excludes mid and halves the candidates. Worst case O(log n); a first midpoint hit is O(1). Duplicate values are outside this implementation's correctness contract.",
    "otherCases": [
      {
        "case": "best",
        "bound": "O(1)",
        "note": "The first midpoint is the target."
      }
    ]
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Only lo, hi, mid are kept — constant space, iterative.",
    "inputOutputNote": "The array of n elements is the input, not auxiliary space."
  },
  "derivation": [
    {
      "lines": [
        5
      ],
      "description": "The loop runs about log2(n) times as the range halves.",
      "cost": "O(log n)",
      "dimension": "time"
    },
    {
      "lines": [
        10,
        11,
        16
      ],
      "description": "Each step: detect the sorted side and one range test — O(1).",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        3,
        4
      ],
      "description": "Three index variables, independent of n.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Elements are distinct (the clean O(log n) case).",
    "Index access/comparisons are O(1).",
    "An empty list returns -1 in O(1); the logarithmic bound is for n >= 2. Duplicates violate this implementation's correctness precondition."
  ],
  "tradeoffs": "You could find the pivot first (O(log n)) then do two ordinary binary searches; the one-pass version here folds that into a single O(log n) loop.",
  "counters": [
    {
      "label": "iterations",
      "definition": "executions of the loop midpoint (line 6)",
      "countLines": [
        6
      ]
    }
  ],
  "fixedDataNote": "Searching a 7-element rotated array takes at most ~3 iterations. The O(log n) bound generalises to n. Function/query analysis excludes demonstration input literal creation and printing."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: rotated sorted array search."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define search_rotated(nums, target)."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "lo at the first index."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "hi at the last index."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Standard binary-search loop condition."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Midpoint index."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Test whether the midpoint equals the target; the return is on the next line only on a match."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Found the target at mid: return the index."
  },
  {
    "line": 9,
    "executable": false,
    "explanation": "Comment: with distinct values, at least one half is sorted."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "If nums[lo] <= nums[mid], the LEFT half is sorted."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Is the target within the sorted left range [nums[lo], nums[mid])?"
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Yes: search the left half (hi = mid - 1)."
  },
  {
    "line": 13,
    "executable": false,
    "explanation": "Otherwise..."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Search the right half; if the target exists it cannot be in the excluded sorted-left range."
  },
  {
    "line": 15,
    "executable": false,
    "explanation": "Else the RIGHT half is sorted."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "Is the target within the sorted right range (nums[mid], nums[hi]]?"
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Yes: search the right half (lo = mid + 1)."
  },
  {
    "line": 18,
    "executable": false,
    "explanation": "Otherwise..."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "Search the left half; if the target exists it cannot be in the excluded sorted-right range."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Loop ended without a match: return -1."
  },
  {
    "line": 21,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "Search 0 in the rotated array → index 4."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "Search 3 (absent) → -1."
  }
],

  bindings: [
  {
    "variable": "nums",
    "model": "array",
    "overlays": [
      {
        "role": "boundary",
        "label": "lo",
        "source": "lo"
      },
      {
        "role": "pointer",
        "label": "mid",
        "source": "mid"
      },
      {
        "role": "boundary",
        "label": "hi",
        "source": "hi"
      }
    ],
    "range": {
      "label": "candidate indices",
      "startSource": "lo",
      "endSource": "hi",
      "endInclusive": true
    }
  }
],

  prediction: [
    { atEventIndex: 0, prompt: "In [4,5,6,7,0,1,2] with mid at index 3 (value 7), which half is sorted and how do you know?", answer: "The left half is sorted, because nums[lo]=4 <= nums[mid]=7.", explanation: "When nums[lo] <= nums[mid], the left side has no wrap and is in order. Here 4 <= 7, so the left half [4,5,6,7] is the sorted side." },
  ],

  experiments: [
    "Search for 5 and trace which half is deemed sorted at each step.",
    "Use a non-rotated sorted array and confirm it still works.",
    "Search for the pivot value 0 and the wrap value 4 to test the boundaries.",
  ],

  exercises: [
  {
    "id": "rot-choose-1",
    "kind": "choose-approach",
    "prompt": "Why can't plain binary search be used directly on [4,5,6,7,0,1,2], and what single extra step fixes it?",
    "expected": "Because the array isn't fully sorted, so nums[mid] vs target alone can't tell which half to discard. The fix: first determine which half of mid IS sorted (nums[lo] <= nums[mid]), then decide using that half's range.",
    "hints": [
      "Goal: explain why plain binary search fails on a rotated array like [4,5,6,7,0,1,2] and the one fix.",
      "The cost of a linear scan is O(n); you still want O(log n), but the usual comparison is ambiguous here.",
      "Key insight: the whole array is not sorted, so nums[mid] vs target alone cannot say which half to drop.",
      "Approach: at each step first detect which side of mid is sorted, then decide using that side's range.",
      "Pseudocode: find mid; if the left half is sorted, check if target lies in it to pick a side, else use the right half.",
      "The fix: determine which half is sorted (e.g. nums[lo] <= nums[mid]) and range-test the target against that half."
    ],
    "recognition": {
      "scenario": "Why can't plain binary search be used directly on [4,5,6,7,0,1,2], and what single extra step fixes it?",
      "approaches": [
        {
          "id": "which-half-sorted",
          "label": "Detect which half of mid is sorted, then decide",
          "requiredReasonIds": [
            "identify-sorted-half"
          ]
        },
        {
          "id": "plain-bs",
          "label": "Plain binary search comparing nums[mid] to target",
          "requiredReasonIds": [],
          "rejectionFeedback": "The array is not fully sorted, so nums[mid] vs target alone cannot tell which half to discard."
        },
        {
          "id": "linear",
          "label": "Linear scan",
          "requiredReasonIds": [],
          "rejectionFeedback": "A linear scan correctly finds the target but costs O(n). This drill asks for the change that keeps binary search logarithmic on distinct values; the sorted-half range test supplies that change."
        }
      ],
      "reasons": [
        {
          "id": "identify-sorted-half",
          "text": "First determine which half of mid is sorted (e.g. nums[lo] ≤ nums[mid]); then check whether the target lies in that half's range to decide which side to keep — still O(log n)."
        },
        {
          "id": "fully-sorted",
          "text": "The array is fully sorted, so plain binary search works unchanged.",
          "contradictory": true
        },
        {
          "id": "no-order",
          "text": "The array has no usable order, so only a linear scan can work.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "which-half-sorted"
      ],
      "modelExplanation": "Because the array isn't fully sorted, nums[mid] vs target alone can't pick a half. Identify which half of mid IS sorted, then decide using that half's range — O(log n)."
    }
  },
  {
    "id": "rot-predict-1",
    "kind": "predict-state",
    "prompt": "What is the time complexity of rotated-array search with distinct elements, and what breaks it?",
    "expected": "O(log n) for this distinct-values implementation. Duplicates may make it return the wrong result, not merely run slower. A duplicate-aware variant can shrink ambiguous equal endpoints and has O(n) worst-case time.",
    "hints": [
      "Distinct values let each iteration safely discard half.",
      "Repeated values can make the sorted-half test ambiguous and the shown branch discard a target.",
      "The shown code needs distinct input; a separate duplicate-aware version may need linear time."
    ]
  }
],

  review: "For a rotation of a sorted list of DISTINCT values, identify the sorted half, range-test the target, and discard the impossible half. This iterative function uses O(log n) time and O(1) space. Duplicates can make this exact code wrong; a duplicate-aware variant needs extra ambiguous-endpoint handling and may take O(n).",

  expectedOutput: "4\n-1\n",

  references: [
  {
    "url": "https://leetcode.com/problems/search-in-rotated-sorted-array/description/",
    "title": "rotated reference",
    "section": "Problem statement and distinct-value constraints",
    "topic": "searching/rotated",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "The original rotated-array logarithmic search problem guarantees unique values."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "The app also supports the empty input as -1."
    ]
  },
  {
    "url": "https://cp-algorithms.com/num_methods/binary_search.html",
    "title": "binary reference",
    "section": "Search in sorted arrays; implementation",
    "topic": "searching/rotated",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Each range update needs a valid invariant and progress."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "4ae88a595d050c38",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
