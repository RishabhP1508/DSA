/**
 * Lesson: Kth largest / smallest (Heaps). Verified on CPython 3.14.
 * Output: "5\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `import heapq

# The kth LARGEST element via a size-k min-heap.
def kth_largest(nums, k):
    if k <= 0:
        raise ValueError("k must be positive")
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)   # keep only the k largest
    if len(h) < k:
        raise ValueError("k exceeds the input length")
    return h[0]                # smallest of the k largest = kth largest

print(kth_largest([3, 2, 1, 5, 6, 4], 2))`;

export const kthLargest: LessonDefinition = {
  id: "kth-largest",
  title: "Kth Largest / Smallest",
  area: "Heaps",
  prerequisites: [
  "top-k"
],

  explanation: "Finding the **kth largest** element is a focused version of top-K: you don't need all k, just the single boundary element. The same **size-k min-heap** trick delivers it directly — once the heap holds the k largest elements, the **smallest of those** (at `heap[0]`) *is* the kth largest. So after scanning, you just return `heap[0]`.\n\nThis is **O(n log(k+1))** time and **O(k)** space — the reason to prefer it over sorting the whole array (**O(n log n)**) when k is small, and it handles streams. For the **kth smallest**, mirror it: keep a size-k max-heap (negate values) whose root becomes the kth smallest.\n\nThere's an important alternative worth knowing: **Quickselect** (a partial quicksort using the partition step) finds the kth element in **expected O(n)** time and O(1) extra space — a potentially better expected bound when k grows with n, but with an **O(n²)** worst case and no streaming ability. So the trade is: **heap** = O(n log(k+1)), streaming-friendly, predictable; **quickselect** = expected O(n) but worst-case O(n²) and needs the whole array in memory. The cue \"the kth largest/smallest\" should make you weigh these two.\n\nRanks are one-based and duplicates count as separate positions. This implementation raises ValueError for k<=0 or k>n. Python 3.14 can use native max-heap functions for the mirrored kth-smallest method; negation remains portable. Randomized quickselect has expected linear time but quadratic worst case; O(1) extra storage refers to an iterative in-place partition implementation. Median-of-three is not a worst-case guarantee; median-of-medians is a separate deterministic linear-time selection method. When k=1, both a heap scan and selection are linear, so expected bounds alone do not promise a speed win.",

  vocabulary: [
  {
    "term": "Kth largest",
    "definition": "The element that would be at position k from the top if sorted descending."
  },
  {
    "term": "Size-k min-heap",
    "definition": "Holds the k largest; its root (heap[0]) is the kth largest."
  },
  {
    "term": "Quickselect",
    "definition": "A partition-based selection giving the kth element in expected O(n)."
  },
  {
    "term": "Boundary element",
    "definition": "The single element separating the top k from the rest."
  }
],

  concepts: {
  "purpose": "Retrieve just the kth largest/smallest element efficiently.",
  "operations": "Maintain a size-k min-heap (kth largest = heap[0]); or use quickselect for expected O(n).",
  "uses": "Kth largest in an array/stream, order statistics, percentile-style queries.",
  "tradeoffs": "Heap: O(n log(k+1)), streaming, predictable. Quickselect: expected O(n) but worst O(n²), needs full array.",
  "commonMistakes": "Returning the wrong heap end (kth largest is heap[0], the smallest of the top-k); using a max-heap for kth largest; assuming quickselect is always faster (bad pivots → O(n²)).",
  "edgeCases": "k = 1 gives the maximum. k = n gives the minimum. Duplicates count toward positions."
},

  complexity: [
  {
    "operation": "Kth largest (size-k heap)",
    "best": "O(n log(k+1))",
    "average": "O(n log(k+1))",
    "worst": "O(n log(k+1))",
    "space": "O(k)",
    "note": "Alternative: quickselect expected O(n), worst O(n²)."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements"
    },
    {
      "symbol": "k",
      "meaning": "the rank to find (kth largest)"
    }
  ],
  "costModel": "Comparisons and bounded-size numeric operations cost O(1). Heap sifting costs O(log(size+1)); Python list resizing is amortized across operations, so an individual resizing operation can cost O(size).",
  "time": {
    "bound": "O(n log(k+1))",
    "case": "worst",
    "explanation": "For a valid rank, scan n values; each pushes and may pop against a heap with at most k+1 transient entries. Root return is O(1). k=1 is linear. Invalid ranks are rejected explicitly."
  },
  "space": {
    "bound": "O(k)",
    "case": "worst",
    "explanation": "Only the size-k heap is kept — O(k) auxiliary space, independent of n.",
    "inputOutputNote": "The input of n elements is separate from the O(k) heap. The bound covers the named algorithm; demonstration construction and collected print output are separate allocations."
  },
  "derivation": [
    {
      "lines": [
        8
      ],
      "description": "Scan each of the n elements once.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        9,
        10,
        11
      ],
      "description": "Push and perhaps pop on at most k+1 transient entries; O(log(k+1)) sifting per update, amortized storage resizing.",
      "cost": "O(n log(k+1))",
      "dimension": "time"
    },
    {
      "lines": [
        14
      ],
      "description": "Return heap[0] — O(1) peek.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        7
      ],
      "description": "Retain k values plus at most one transient overflow entry.",
      "cost": "O(k)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Comparisons are O(1).",
    "Heap capped at k by popping on overflow.",
    "Comparisons and bounded-size numeric operations cost O(1). Heap sifting costs O(log(size+1)); Python list resizing is amortized across operations, so an individual resizing operation can cost O(size).",
    "k is an integer and 1<=k<=n for a successful result.",
    "The heap transiently has k+1 entries before overflow removal."
  ],
  "tradeoffs": "Quickselect: expected O(n) time, O(1) extra space, but O(n²) worst case and requires the full array. The heap trades a log k factor for predictability and streaming support.",
  "counters": [
    {
      "label": "elements processed",
      "definition": "Executions of the input scan body push on line 9.",
      "countLines": [
        9
      ]
    }
  ],
  "fixedDataNote": "This run finds the 2nd largest of 6 elements → 5. The O(n log(k+1)) bound generalises to n elements and rank k."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": true,
    "explanation": "Import heapq."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 3,
    "executable": false,
    "explanation": "Comment: kth largest via a size-k min-heap."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Define kth_largest(nums, k)."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Ranks are one-based and must be positive."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Reject a nonpositive rank before scanning."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Start with an empty heap."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Process each element."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Push it (O(log k))."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "If the heap exceeds k..."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "...pop the smallest, keeping only the k largest."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "After scanning, check that k values actually exist."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Reject a rank larger than the number of inputs, including empty input."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "The root is the smallest of the k largest = the kth largest."
  },
  {
    "line": 15,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "2nd largest of [3, 2, 1, 5, 6, 4] is 5."
  }
],

  bindings: [
  {
    "variable": "nums",
    "model": "array"
  },
  {
    "variable": "h",
    "model": "heap"
  }
],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "After the size-k min-heap holds the k largest elements, which element is the kth largest, and where is it?",
    "answer": "The smallest of those k, which is at heap[0] (the root of the min-heap).",
    "explanation": "The heap contains exactly the k largest values; the min-heap keeps their minimum at the root, and that minimum is precisely the kth largest overall."
  }
],

  experiments: [
  "Set k = 1 and confirm it returns the maximum.",
  "Adapt it to kth SMALLEST by negating values (size-k max-heap).",
  "Discuss when quickselect's expected O(n) would beat the heap."
],

  exercises: [
  {
    "id": "kth-choose-1",
    "kind": "choose-approach",
    "prompt": "Kth largest in a fixed in-memory array with no streaming. Heap (O(n log(k+1))) or quickselect (expected O(n))? What's the risk with quickselect?",
    "expected": "Randomized quickselect offers expected O(n) with an iterative in-place O(1)-space implementation, but can take O(n²). A size-k heap costs O(n log(k+1)) and handles streams. For k=1 both are linear; speed also depends on constants. Median-of-three does not ensure linear worst case; median-of-medians is a separate deterministic linear method.",
    "hints": [
      "Understand: only one rank is requested, and the entire array is available.",
      "Sorting determines every rank even though only one is needed.",
      "Partitioning can discard the side containing no requested rank.",
      "Randomized quickselect offers expected O(n); a heap offers predictable scan work and streaming.",
      "Pseudocode: partition; keep only the side containing rank k; repeat iteratively in place.",
      "Solution: randomized quickselect is expected O(n), worst O(n²); a size-k heap is O(n log(k+1)). O(1) selection space needs iterative in-place partitioning. Neither bound promises that quickselect is faster for every k or input."
    ],
    "recognition": {
      "scenario": "Kth largest in a fixed in-memory array with no streaming. Heap (O(n log(k+1))) or quickselect (expected O(n))? What's the risk with quickselect?",
      "approaches": [
        {
          "id": "quickselect",
          "label": "Quickselect",
          "requiredReasonIds": [
            "partition-expected-linear"
          ]
        },
        {
          "id": "size-k-heap",
          "label": "Size-k heap",
          "requiredReasonIds": [],
          "rejectionFeedback": "A heap remains valid here; choose it when predictable scan work is the desired tradeoff, or k is small."
        }
      ],
      "reasons": [
        {
          "id": "partition-expected-linear",
          "text": "Randomized partitioning gives expected O(n), worst O(n²); iterative in-place partitioning uses O(1) extra storage. It need not beat a heap for every k (both are linear for k=1)."
        },
        {
          "id": "heap-predictable",
          "text": "The heap gives O(n log(k+1)) scan time and O(k) storage for valid ranks, with no selection pivot risk."
        },
        {
          "id": "need-all-k",
          "text": "You need all top-k elements, not just the k-th.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "quickselect"
      ],
      "alternatives": [
        {
          "approachId": "size-k-heap",
          "conditions": "Predictable work or small k is preferred, even when the input is in memory; a stream also makes the heap suitable.",
          "tradeoff": "O(n log(k+1)) versus randomized selection expected O(n) and quadratic worst case.",
          "requiredReasonIds": [
            "heap-predictable"
          ]
        }
      ],
      "modelExplanation": "Randomized quickselect offers expected O(n) with an iterative in-place O(1)-space implementation, but can take O(n²). A size-k heap costs O(n log(k+1)) and handles streams. For k=1 both are linear; speed also depends on constants. Median-of-three does not ensure linear worst case; median-of-medians is a separate deterministic linear method."
    }
  },
  {
    "id": "kth-complete-1",
    "kind": "complete-code",
    "prompt": "Complete kth_smallest using a size-k MAX-heap (via negation). Assume integer rank 1<=k<=len(nums).",
    "starterCode": "import heapq\ndef kth_smallest(nums, k):\n    h = []\n    for x in nums:\n        # TODO: keep the k smallest using a max-heap of negatives\n        pass\n    return -h[0]",
    "expected": "import heapq\ndef kth_smallest(nums, k):\n    h = []\n    for x in nums:\n        heapq.heappush(h, -x)\n        if len(h) > k:\n            heapq.heappop(h)\n    return -h[0]",
    "hints": [
      "Goal: return the kth smallest value using a size-k max-heap simulated by negation.",
      "Sorting is O(n log n); a size-k heap keeps only k elements.",
      "Key insight: negating values makes heappop remove the current largest, so the heap retains the k smallest.",
      "Approach: push -x, pop when size exceeds k, and negate the root at the end.",
      "Pseudocode: for x: push -x; if len > k: pop; return -h[0].",
      "Do `heapq.heappush(h, -x)`, pop when `len(h) > k`, and `return -h[0]`."
    ],
    "tests": "assert kth_smallest([7, 10, 4, 3, 20, 15], 3) == 7, '3rd smallest is 7'\nassert kth_smallest([7, 10, 4, 3, 20, 15], 1) == 3, '1st smallest is the min'\nassert kth_smallest([7, 10, 4, 3, 20, 15], 6) == 20, 'kth == n gives the max'\nassert kth_smallest([2, 2, 2], 2) == 2, 'duplicates: 2nd smallest is 2'\nassert kth_smallest([-5, -1, -3], 2) == -3, 'handles negatives'\nprint('OK')"
  }
],

  review: "The **kth largest** is the smallest of the top-k, so a **size-k min-heap** gives it as `heap[0]` in **O(n log(k+1))** time / **O(k)** space — streaming-friendly and predictable. Mirror with a size-k max-heap for kth smallest. The alternative, **randomized quickselect**, is expected **O(n)** with O(1) space for an iterative in-place implementation but risks O(n²) and needs the full array. Choose based on streaming and worst-case needs.",

  expectedOutput: "5\n",

  references: [
  {
    "url": "https://docs.python.org/3.14/library/heapq.html",
    "title": "Python 3.14: heapq",
    "section": "Heap invariant; max-heap APIs; merge; nlargest; priority queue notes; other applications",
    "topic": "kth-largest",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "A retained min-heap exposes its smallest boundary at index zero."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Use Python 3.14.2 zero-based heapq lists. Unqualified functions are min-oriented; native *_max APIs exist. Median examples deliberately use portable negation."
    ]
  },
  {
    "url": "https://tildesites.bowdoin.edu/~ltoma/teaching/cs231/2017spring/Lectures/selection.pdf",
    "title": "Bowdoin: Linear-time selection",
    "section": "Randomized select; expected linear time; deterministic median of medians",
    "topic": "kth-largest",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Randomized selection is expected linear; deterministic median-of-medians supplies a different worst-case guarantee."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source uses one-based rank and assumes distinct keys. App allows duplicates as separate ranked positions; zero-based arrays, one-based k. Iterative quickselect avoids recursive stack space."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "7b64f0c65e9f9cca",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
