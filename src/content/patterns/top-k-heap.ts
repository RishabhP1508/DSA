/**
 * Pattern: Top-K with a heap.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "[12, 11, 5]\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `import heapq

# Top-K with a heap: keep the k LARGEST using a MIN-heap of size k.
def k_largest(nums, k):
    if k <= 0:
        return []
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)      # drop the smallest -> the k largest remain
    return sorted(heap, reverse=True)

print(k_largest([3, 1, 5, 12, 2, 11], 3))  # [12, 11, 5]`;

export const topKHeapPattern: PatternDefinition = {
  id: "top-k-heap",
  title: "Top-K with a Heap",
  category: "Heaps & priority",
  summary:
    "Keep only the k best elements in a size-k heap so you spend O(n log(k+1)) instead of sorting everything in O(n log n).",

  clues: [
  "You need the K LARGEST/SMALLEST, the K-th element, the K most frequent, or K closest points.",
  "You do NOT need the whole thing sorted — just the top k.",
  "The data may be large or STREAMING (you can't hold or re-sort it all).",
  "Phrases like 'top k', 'k-th largest', 'k closest', 'k most frequent'."
],

  naiveApproach: "Sort everything and take the first k — **O(n log n)** time and O(n) space. That fully orders n elements when you only care about k of them, and it doesn't work for an unbounded stream you can't store or re-sort.",

  whyItHelps: "Keep the best min(k, values_seen) values between updates. For the k largest, use a min-heap: push the arriving value, temporarily reaching at most k+1 entries, then pop the smallest if size exceeds k. Before k arrivals the root is the minimum seen; after k arrivals it is the kth largest. n updates cost O(n log(k+1)), and sorting the retained m=min(k,n) values costs O(m log(m+1)). Storage is O(min(k,n)), with one temporary extra entry. The approach can consume a stream. For k smallest, Python 3.14 native max APIs or portable negation mirror the logic. nlargest has max/sorting shortcuts, so it is not always this exact manual loop.",

  conditions: [
  "Most useful when k is much smaller than n; if k is close to n, sorting is often simpler. The walkthrough returns [] for k<=0 and all values for k>=n.",
  "For k largest retain a min-heap; for k smallest retain a max-heap (native *_max in Python 3.14, or portable negation).",
  "Values or priority keys must be mutually ordered. Equal-priority unordered payloads need a unique tiebreaker before the payload.",
  "The root is kth largest only after at least k values have arrived. Before then it is the minimum seen so far.",
  "Tuple priorities must be comparable; equal priorities require comparable tie fields or a unique counter before an unordered payload."
],

  alternatives: [
  "Full sort — simplest when you also need everything ordered or when k is close to n.",
  "Quickselect — expected O(n) for randomized selection to find the k-th element / unordered top-k when all data is in memory (not for streams).",
  "heapq.nlargest / nsmallest — a selection helper with k=1 and known-length sorting shortcuts; use directly in practice.",
  "For frequencies of n input items, count buckets are indexed by frequency (0..n), regardless of how large the item values are. Hashable keys and ordinary expected O(1) counting give an O(n+d) bucket alternative for d distinct keys."
],

  counterexamples: [
  "Using a MAX-heap for the k largest and popping is wrong — you'd discard the biggest; the size-k heap for k largest must be a MIN-heap.",
  "When you need the FULL sorted order, top-k heap doesn't save you — just sort.",
  "For a single in-memory rank, randomized quickselect offers expected O(n), worst O(n²), while the heap gives O(n log(k+1)). For k=1 both are linear; prefer based on storage, predictability, and constants."
],

  walkthroughCode,
  walkthroughExpectedOutput: "[12, 11, 5]\n",
  complexityNote:
    "O(n log(k+1)) scan time plus O(m log(m+1)) final ordering for m=min(k,n) retained values. O(min(k,n)) storage, with one temporary extra entry. Randomized selection is an in-memory alternative for an unordered result or a single rank.",

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
        8
      ],
      "description": "Scan all values for positive k.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        9
      ],
      "description": "Heap push and overflow removal; transient capacity k+1.",
      "cost": "O(n log(k+1))",
      "dimension": "time"
    },
    {
      "lines": [
        12
      ],
      "description": "Sort the m retained values for output.",
      "cost": "O(m log(m+1))",
      "dimension": "time"
    },
    {
      "lines": [
        7
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
        9
      ]
    }
  ],
  "fixedDataNote": "The sample requests three results. The bounds describe positive k; log(k+1) includes the linear k=1 case."
},

  codeExplanations: [
  {
    "line": 1,
    "executable": true,
    "explanation": "Import heapq (a binary MIN-heap)."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 3,
    "executable": false,
    "explanation": "Comment: keep k largest using a size-k min-heap."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Define k_largest(nums, k)."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "A nonpositive requested count has no results."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Return without consuming the input."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Start with an empty heap."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Process each element (works for a stream too)."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Push the element (O(log k))."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "If the heap now exceeds k elements..."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "...pop the smallest, so only the k largest remain; the root is the k-th largest."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Return the k largest, biggest first."
  },
  {
    "line": 13,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "The 3 largest of [3,1,5,12,2,11] are [12, 11, 5]."
  }
],

  bindings: [
  {
    "variable": "heap",
    "model": "heap"
  }
],

  linkedLessons: ["top-k", "kth-largest", "min-max-heaps", "running-median"],

  exercises: [
  {
    "id": "pat-tk-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'From a huge stream of numbers you can't store fully, report the 100 largest.' Which pattern, and what heap type?",
    "expected": "Use a size-100 min-heap: push each arrival and pop the minimum when size exceeds 100. Retain at most 100 values between updates, with a temporary 101st entry. The scan is O(n) for fixed 100, bounded storage O(100); after 100 arrivals its root is the 100th largest. Sorting the final 100 values is a bounded additional step.",
    "correctPatternId": "top-k-heap",
    "hints": [
      "Goal: report the 100 largest numbers from a stream you can't fully store.",
      "Sorting needs the whole dataset, which is impossible for an unbounded stream.",
      "Key insight: you only ever need to keep the k best seen so far, discarding smaller ones.",
      "Approach: maintain a size-100 min-heap so the smallest kept item is easy to evict.",
      "Pseudocode: for each number push it; if heap size exceeds 100 pop the smallest; the heap holds the top 100.",
      "Use a Top-K min-heap of size 100: push each number and pop the smallest when it exceeds 100 — O(n log 100), O(100) space."
    ],
    "recognition": {
      "scenario": "From a huge stream of numbers you cannot store fully, report the 100 largest.",
      "approaches": [
        {
          "id": "min-heap-k",
          "label": "Top-K with a size-100 min-heap",
          "requiredReasonIds": [
            "stream-bounded"
          ]
        },
        {
          "id": "full-sort",
          "label": "Sort everything, take the top 100",
          "requiredReasonIds": [],
          "rejectionFeedback": "A full sort needs all n items in memory and is O(n log n); the stream cannot be stored fully."
        }
      ],
      "reasons": [
        {
          "id": "stream-bounded",
          "text": "A size-100 MIN-heap keeps only the 100 best seen: push each number, pop the smallest when size exceeds 100 — O(n log 100) time, O(100) space, stream-friendly."
        },
        {
          "id": "need-all-in-memory",
          "text": "All n numbers fit in memory, so a full sort is fine.",
          "contradictory": true
        },
        {
          "id": "max-heap-k",
          "text": "Use a size-100 MAX-heap so the largest stays on top.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "min-heap-k"
      ],
      "modelExplanation": "Use a size-100 min-heap: push each arrival and pop the minimum when size exceeds 100. Retain at most 100 values between updates, with a temporary 101st entry. The scan is O(n) for fixed 100, bounded storage O(100); after 100 arrivals its root is the 100th largest. Sorting the final 100 values is a bounded additional step."
    }
  },
  {
    "id": "pat-tk-fix-1",
    "kind": "fix-mistake",
    "prompt": "`k_largest(nums, k)` returns the k largest values in descending order. The unqualified heapq functions operate on a min-heap; this negates and keeps the wrong ones. Fix it to keep a size-k min-heap.",
    "starterCode": "import heapq\ndef k_largest(nums, k):\n    heap = []\n    for x in nums:\n        heapq.heappush(heap, -x)\n        if len(heap) > k:\n            heapq.heappop(heap)\n    return sorted([-v for v in heap], reverse=True)",
    "expected": "import heapq\ndef k_largest(nums, k):\n    heap = []\n    for x in nums:\n        heapq.heappush(heap, x)\n        if len(heap) > k:\n            heapq.heappop(heap)\n    return sorted(heap, reverse=True)",
    "hints": [
      "Goal: k_largest(nums, k) = the k largest values, descending.",
      "Python's heapq is a MIN-heap; the smallest sits at the root (index 0).",
      "Key property: to keep the k LARGEST, hold a size-k min-heap and evict its smallest.",
      "Approach: push each value; if the heap exceeds k, pop (removes the current smallest).",
      "Pseudocode: for x: heappush(heap,x); if len>k: heappop(heap); return sorted(heap, reverse=True).",
      "Fix: push x (not -x) and return sorted(heap, reverse=True)."
    ],
    "tests": "assert k_largest([3,1,5,2,4], 2) == [5,4]\nassert k_largest([1,2,3], 3) == [3,2,1]\nassert k_largest([7], 1) == [7]\nassert k_largest([4,4,4], 2) == [4,4], 'duplicates'\nassert k_largest([-1,-2,-3], 2) == [-1,-2], 'handles negatives (negation bug would fail)'\nprint('OK')"
  },
  {
    "id": "pat-tk-choose-1",
    "kind": "choose-approach",
    "prompt": "You have all n numbers in memory and want just the single k-th largest. Top-k heap or quickselect?",
    "expected": "Randomized quickselect is a useful expected O(n) alternative for a single in-memory rank, with O(n²) worst case. Iterative in-place partitioning uses O(1) extra space. The heap remains valid and predictable, costs O(n log(k+1)), and also supports streaming. For k=1 both are linear.",
    "hints": [
      "Goal: find just the single k-th largest element when all n numbers are in memory.",
      "A heap gives all top-k in O(n log(k+1)), but you only need one order statistic, not the whole set.",
      "Key insight: partitioning around a pivot can locate the k-th largest in O(n) average without a heap.",
      "Approach: use quickselect since everything is in memory and you need one value.",
      "Pseudocode: partition around a pivot; recurse only into the side containing the k-th position.",
      "Randomized quickselect is a useful expected O(n) alternative for a single in-memory rank, with O(n²) worst case. Iterative in-place partitioning uses O(1) extra space. The heap remains valid and predictable, costs O(n log(k+1)), and also supports streaming. For k=1 both are linear."
    ],
    "recognition": {
      "scenario": "You have all n numbers in memory and want just the single k-th largest.",
      "approaches": [
        {
          "id": "quickselect",
          "label": "Quickselect",
          "requiredReasonIds": [
            "single-order-stat"
          ]
        },
        {
          "id": "min-heap-k",
          "label": "Size-k min-heap",
          "requiredReasonIds": [],
          "rejectionFeedback": "The heap is O(n log(k+1)) and best when streaming or when you need ALL top-k; for a single in-memory order statistic quickselect is an expected linear alternative with randomized pivots; k=1 heap scans are also linear."
        }
      ],
      "reasons": [
        {
          "id": "single-order-stat",
          "text": "All data is in memory and only one order statistic is needed, so partitioning around a pivot finds it in expected O(n), O(1) extra space."
        },
        {
          "id": "heap-streamable",
          "text": "A size-k heap holds only k items, so it works on a stream and yields all top-k, at O(n log(k+1)) rather than expected O(n)."
        },
        {
          "id": "need-all-topk",
          "text": "We need every one of the top-k elements, not just the k-th.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "quickselect"
      ],
      "alternatives": [
        {
          "approachId": "min-heap-k",
          "conditions": "Small k, streaming, or predictable scan work is preferred. A heap is also valid for a single rank in memory.",
          "tradeoff": "O(n log(k+1)) versus quickselect's expected O(n), but predictable and streaming-capable.",
          "requiredReasonIds": [
            "heap-streamable"
          ]
        }
      ],
      "modelExplanation": "Randomized quickselect is a useful expected O(n) alternative for a single in-memory rank, with O(n²) worst case. Iterative in-place partitioning uses O(1) extra space. The heap remains valid and predictable, costs O(n log(k+1)), and also supports streaming. For k=1 both are linear."
    }
  }
],

  references: [
  {
    "url": "https://docs.python.org/3.14/library/heapq.html",
    "title": "Python 3.14: heapq",
    "section": "Heap invariant; max-heap APIs; merge; nlargest; priority queue notes; other applications",
    "topic": "top-k-heap",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Sorted helper output; comparable tuple keys and counter tiebreakers."
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
    "topic": "top-k-heap",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Helper shortcuts do not always run the manual bounded-heap loop."
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
    "topic": "top-k-heap",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Selection expected bounds need randomization and in-place storage qualifications."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source uses one-based rank and assumes distinct keys. App allows duplicates as separate ranked positions; zero-based arrays, one-based k. Iterative quickselect avoids recursive stack space."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "6e915ecffb790b5f",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
