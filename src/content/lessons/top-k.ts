/**
 * Lesson: Top-K elements (Heaps). Verified on CPython 3.14.
 * Output: "[12, 11, 5]\n[12, 11, 5]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `import heapq

# Quick way: heapq.nlargest returns the k largest, already sorted desc.
def top_k(nums, k):
    return heapq.nlargest(k, nums)
print(top_k([3, 1, 5, 12, 2, 11], 3))

# Streaming way: keep a MIN-heap of size k (the k largest seen so far).
def top_k_heap(nums, k):
    if k <= 0:
        return []
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)      # drop the smallest -> keeps k largest
    return sorted(h, reverse=True)
print(top_k_heap([3, 1, 5, 12, 2, 11], 3))`;

export const topK: LessonDefinition = {
  id: "top-k",
  title: "Top-K Elements",
  area: "Heaps",
  prerequisites: [
  "min-max-heaps"
],

  explanation: "Finding the **k largest** (or smallest) elements is a classic heap problem, and the elegant solution is counterintuitive: to keep the **k largest**, maintain a **min-heap of size k**. As you scan, push each element; whenever the heap exceeds size k, pop the **smallest** — which discards whatever is currently least among your candidates. Whatever remains is the min(k, values_seen) largest seen so far, and the very smallest of those (the kth largest) sits conveniently at `heap[0]`.\n\nWhy a heap of size **k** rather than sorting everything? Sorting the whole array is **O(n log n)**. The size-k heap approach is **O(n log(k+1))** — each of the n elements does an O(log k) push/pop against a heap that temporarily reaches k+1 before trimming. When **k is much smaller than n** (the common case: \"top 10 of a million\"), `log k` is tiny, so this is a real win, and it uses only **O(k)** space. It also works on a **stream** where you can't hold all n elements at once.\n\nPython's `heapq.nlargest(k, nums)` returns the same selected values, with implementation shortcuts and returns the results sorted. The recognition cue: \"the k biggest/smallest / most frequent\" → a bounded heap of size k. (For the single **kth** element specifically, the next lesson refines this.)\n\nThe root represents the kth largest only after at least k values have arrived. Before then it is the minimum of the values seen so far. nlargest uses max for k=1, a full sort when k is at least a known input length, and a bounded heap otherwise. Manual top_k_heap returns [] for k<=0 and all values sorted when k>=n.",

  vocabulary: [
  {
    "term": "Top-K",
    "definition": "The k largest (or smallest) elements of a collection."
  },
  {
    "term": "Size-k min-heap",
    "definition": "A heap capped at k elements holding the k largest seen so far."
  },
  {
    "term": "nlargest / nsmallest",
    "definition": "heapq helpers returning the k largest/smallest, sorted."
  },
  {
    "term": "Streaming",
    "definition": "Processing elements one at a time without storing them all."
  },
  {
    "term": "Bounded heap",
    "definition": "A heap kept at a fixed maximum size by popping when it overflows."
  }
],

  concepts: {
  "purpose": "Select the k most extreme elements efficiently, especially when k << n or data streams in.",
  "operations": "Keep a size-k min-heap: push each element, pop the smallest when size exceeds k.",
  "uses": "Top-K frequent, k closest points, k largest numbers, leaderboards, streaming analytics.",
  "tradeoffs": "O(n log(k+1)) time and O(k) space — better than full sort's O(n log n) when k is small.",
  "commonMistakes": "Using a max-heap of size k (wrong — you need a MIN-heap to cheaply drop the smallest); sorting everything when k is tiny; forgetting the heap holds the k LARGEST while its root is the smallest of them.",
  "edgeCases": "k >= n returns everything (sorted). k = 0 returns nothing. Duplicates are kept."
},

  complexity: [
  {
    "operation": "Top-K (size-k heap)",
    "best": "O(n) for k=1",
    "average": "O(n log(k+1)) upper bound",
    "worst": "O(n log(k+1))",
    "space": "O(k)",
    "note": "Manual positive-k scan, followed by sorting min(k,n) retained values; helpers can use shortcuts."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "input values consumed"
    },
    {
      "symbol": "k",
      "meaning": "requested count"
    },
    {
      "symbol": "m",
      "meaning": "min(k,n), for positive k"
    }
  ],
  "costModel": "Comparisons and bounded-size numeric operations cost O(1). Heap sifting costs O(log(size+1)); Python list resizing is amortized across operations, so an individual resizing operation can cost O(size).",
  "time": {
    "bound": "O(n log(k+1))",
    "case": "worst",
    "explanation": "For k>0 each input causes a push and possibly a pop on at most k+1 entries. Sorting the m retained results costs O(m log(m+1)), within this upper bound. k=1 takes O(n); k<=0 returns immediately."
  },
  "space": {
    "bound": "O(min(k,n))",
    "case": "worst",
    "explanation": "For positive k the retained heap has at most m entries after each iteration, with one transient overflow entry. The result sorting also uses O(m) storage.",
    "inputOutputNote": "Input storage is separate. Returned list uses O(m) space; no input values are changed."
  },
  "derivation": [
    {
      "lines": [
        13
      ],
      "description": "Scan all values for positive k.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        14
      ],
      "description": "Heap push and overflow removal; transient capacity k+1.",
      "cost": "O(n log(k+1))",
      "dimension": "time"
    },
    {
      "lines": [
        17
      ],
      "description": "Sort the m retained values for output.",
      "cost": "O(m log(m+1))",
      "dimension": "time"
    },
    {
      "lines": [
        12
      ],
      "description": "Retain at most m values plus one transient entry.",
      "cost": "O(m)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "k is an integer; k<=0 requests no results.",
    "Comparisons and bounded-size numeric operations cost O(1). Heap sifting costs O(log(size+1)); Python list resizing is amortized across operations, so an individual resizing operation can cost O(size)."
  ],
  "tradeoffs": "A full sort retains all inputs and has a general O(n log n) comparison bound; adaptive sorting may exploit existing order. A size-k heap is useful when k is small or the entire input cannot be stored.",
  "counters": [
    {
      "label": "values processed",
      "definition": "Executions of the heap push body.",
      "countLines": [
        14
      ]
    }
  ],
  "fixedDataNote": "The sample requests three results. The bounds describe positive k; log(k+1) includes the linear k=1 case."
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
    "explanation": "Comment: nlargest is the quick helper."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Define top_k using the built-in helper."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "nlargest(k, nums) returns the k largest, sorted descending."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Top 3 of the sample → [12, 11, 5]."
  },
  {
    "line": 7,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 8,
    "executable": false,
    "explanation": "Comment: the streaming size-k min-heap approach."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Define top_k_heap."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "A nonpositive count requests no values."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Return immediately without consuming the input."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Start with an empty heap."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Process each element."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Push the new value; the heap can temporarily hold k+1 candidates."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "If the heap grew past k..."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "...pop the smallest — discarding the least of the current candidates."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Return the k largest, sorted descending."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "Same result → [12, 11, 5]."
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
    "prompt": "To keep the k LARGEST elements, why do we use a MIN-heap of size k rather than a max-heap?",
    "answer": "Because a min-heap's root is the smallest of the k candidates, so when the heap overflows we can pop that smallest in O(log k) — cheaply discarding the weakest candidate. A max-heap would keep the largest at the root, which we don't want to remove.",
    "explanation": "We want to repeatedly evict the smallest among our current top-k. A min-heap exposes exactly that element at the root for O(log k) removal, keeping the k largest."
  }
],

  experiments: [
  "Set k >= len(nums) and confirm it returns everything.",
  "Track heap[0] as you process — it's always the kth largest so far.",
  "Compare operation counts of the size-k heap vs sorting the whole array for small k."
],

  exercises: [
  {
    "id": "topk-choose-1",
    "kind": "choose-approach",
    "prompt": "You need the 10 largest of 10 million numbers arriving as a stream. Full sort or a size-k heap? Give complexities. You cannot store all stream values.",
    "expected": "A size-k (min-)heap: O(n log(k+1)) ≈ O(n·log 10) and O(k) = O(10) space, and it works on a stream. Full sort is O(n log n) and needs all n in memory — much worse.",
    "hints": [
      "Goal: choose between a full sort and a size-k heap for the 10 largest of a 10-million-number stream.",
      "A full sort needs all n in memory and O(n log n) time, which a stream may not allow.",
      "Key insight: keeping only k elements bounds both memory and per-element cost when k is tiny.",
      "Approach: maintain a size-k min-heap, evicting the smallest when it overflows.",
      "Pseudocode: for each x: push x; if heap size > k: pop the smallest; the heap holds the k largest.",
      "Use a size-k min-heap: O(n log(k+1)) time and O(k) space, and it works on a stream."
    ],
    "recognition": {
      "scenario": "You need the 10 largest of 10 million numbers under a memory limit that prevents storing all of them arriving as a stream. Full sort or a size-k heap?",
      "approaches": [
        {
          "id": "size-k-heap",
          "label": "Size-k (min-)heap",
          "requiredReasonIds": [
            "bounded-stream-heap"
          ]
        },
        {
          "id": "full-sort",
          "label": "Sort everything, take the top 10",
          "requiredReasonIds": [],
          "rejectionFeedback": "The specified memory limit prevents storing all n stream values. A size-k heap retains only the needed candidates."
        }
      ],
      "reasons": [
        {
          "id": "bounded-stream-heap",
          "text": "A size-k min-heap holds only the k best seen: push each number, pop the smallest on overflow — O(n log(k+1)) time, O(k) space, stream-friendly."
        },
        {
          "id": "all-in-memory",
          "text": "The whole input fits in memory, so a full sort is fine.",
          "contradictory": true
        },
        {
          "id": "need-median-boundary",
          "text": "You need the boundary between the lower and upper halves, so two heaps are required.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "size-k-heap"
      ],
      "modelExplanation": "A size-k min-heap: O(n log(k+1)) time, O(k) space, and it works on a stream. A full sort is O(n log n) and needs all n in memory — far worse."
    }
  },
  {
    "id": "topk-fix-1",
    "kind": "fix-mistake",
    "prompt": "Complete `top_k(nums, k)`: return the k largest values (sorted). This version negates values and keeps the k SMALLEST — fix the overflow handling so a size-k min-heap retains the largest. Return the selected largest values in ascending order for this exercise; the starter also incorrectly returns negated values.",
    "starterCode": "import heapq\ndef top_k(nums, k):\n    h = []\n    for x in nums:\n        heapq.heappush(h, -x)\n        if len(h) > k:\n            heapq.heappop(h)\n    return sorted(h)",
    "expected": "import heapq\ndef top_k(nums, k):\n    h = []\n    for x in nums:\n        heapq.heappush(h, x)\n        if len(h) > k:\n            heapq.heappop(h)\n    return sorted(h)",
    "hints": [
      "Goal: fix the heap so it keeps the k largest values, not the k smallest.",
      "Negating values turns heappop into removing the largest, which discards the wrong element.",
      "Key insight: a plain min-heap lets heappop drop the smallest, so the k largest survive.",
      "Approach: push the raw value and pop when the size exceeds k.",
      "Pseudocode: for x: heappush(h, x); if len(h) > k: heappop(h).",
      "Push `x` (not `-x`) so `heappop` removes the smallest and the k largest remain."
    ],
    "tests": "assert top_k([4, 1, 7, 3, 8, 2], 3) == [4, 7, 8], 'the three largest (buggy keeps the smallest)'\nassert top_k([5, 1, 4, 2, 3], 1) == [5], 'the single largest'\nassert top_k([3, 3, 3], 2) == [3, 3], 'duplicates allowed'\nassert top_k([2, 1], 5) == [1, 2], 'k larger than list returns all sorted'\nassert top_k([], 3) == [], 'empty input'\nprint('OK')"
  }
],

  review: "**Top-K**: keep a **min-heap of size k** to hold the k largest — push each element, and pop the smallest whenever the heap exceeds k (its root is the kth largest). This is **O(n log(k+1))** time and **O(k)** space, beating a full **O(n log n)** sort when k << n, and it works on streams. `heapq.nlargest(k, nums)` does this for you.",

  expectedOutput: "[12, 11, 5]\n[12, 11, 5]\n",

  references: [
  {
    "url": "https://docs.python.org/3.14/library/heapq.html",
    "title": "Python 3.14: heapq",
    "section": "Heap invariant; max-heap APIs; merge; nlargest; priority queue notes; other applications",
    "topic": "top-k",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "nlargest returns ordered results and suggests max for k=1."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Use Python 3.14.2 zero-based heapq lists. Unqualified functions are min-oriented; native *_max APIs exist. Median examples deliberately use portable negation."
    ]
  },
  {
    "url": "https://raw.githubusercontent.com/python/cpython/v3.14.2/Lib/heapq.py",
    "title": "CPython 3.14.2 heapq source",
    "section": "nlargest / nsmallest shortcuts; merge frontier; siftdown and siftup",
    "topic": "top-k",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "nlargest has k=1 and known-length sorting shortcuts."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Use Python 3.14.2 zero-based heapq lists. Unqualified functions are min-oriented; native *_max APIs exist. Median examples deliberately use portable negation."
    ]
  },
  {
    "url": "https://opendatastructures.org/ods-python/10_1_BinaryHeap_Implicit_Bi.html",
    "title": "Open Data Structures: BinaryHeap",
    "section": "10.1 indexing; add/remove; resizing amortization; Figures 10.1–10.3",
    "topic": "top-k",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Heap updates sift along logarithmic-height paths."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Both source and app use zero-based array indices, children 2i+1 and 2i+2, and parent (i-1)//2 for i>0. Resizing is accounted for amortized."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "dbe40ceb7b86cc0f",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
