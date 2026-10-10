/**
 * Pattern: K-way merge.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "[1, 2, 3, 4, 5, 6, 7, 8, 9]\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `import heapq

# K-way merge: combine k sorted lists using a min-heap of the current fronts.
def merge_k(lists):
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))   # (value, list index, position)
    out = []
    while heap:
        val, i, j = heapq.heappop(heap)            # smallest current front
        out.append(val)
        if j + 1 < len(lists[i]):
            heapq.heappush(heap, (lists[i][j + 1], i, j + 1))  # advance that list
    return out

print(merge_k([[1, 4, 7], [2, 5, 8], [3, 6, 9]]))`;

export const kWayMergePattern: PatternDefinition = {
  id: "k-way-merge",
  title: "K-way Merge",
  category: "Heaps & priority",
  summary:
    "Merge k sorted sequences by always taking the smallest current front from a min-heap of size k.",

  clues: [
  "You have MULTIPLE already-sorted lists/arrays/streams to combine into one sorted output.",
  "Or you need the k-th smallest across sorted rows/lists, or the smallest range covering all lists.",
  "Phrases like 'merge k sorted lists', 'kth smallest in m sorted arrays', 'smallest range covering k lists'."
],

  naiveApproach: "Scan all k current fronts for each output: O(N*k). Concatenate and sort has a generic O(N log N) bound, but adaptive Python sorting can exploit the sorted runs; it does not necessarily discard their order. A frontier heap supports bounded working storage in an iterator adaptation.",

  whyItHelps: "Keep a **min-heap of the current front element of each list** (size ≤ k). Repeatedly pop the global minimum, append it to the output, and push the **next** element from the same list. Since each of the N elements is pushed and popped once and the heap holds at most k items, the total cost is **O(k + N log(k+1))** — better than O(N log N) when k ≪ N, and can be adapted to iterators that yield output without retaining it; the displayed indexed-list version retains its inputs and result. The heap efficiently answers 'which of the k fronts is smallest?' in O(log k).",

  conditions: [
  "Each input sequence must already be sorted (the merge relies on it).",
  "Heap entries carry enough info to advance the right list (value, list index, position).",
  "Break ties deterministically (include the list index in the tuple to avoid comparing incomparable payloads).",
  "This indexed-list walkthrough retains input lists and materializes output. File/iterator inputs require an iterator-front adaptation that yields each result.",
  "All values are mutually ordered; source indices break equal-value frontier ties."
],

  alternatives: [
  "Pairwise merge (divide and conquer) — merge lists two at a time; also O(k + N log(k+1)), sometimes simpler without a heap.",
  "Concatenate + sort — fine when k is close to N or the inputs aren't reliably sorted.",
  "Top-K heap — for the k largest/smallest of ONE collection, not merging many sorted ones."
],

  counterexamples: [
  "If the inputs aren't sorted, a k-way merge produces wrong output — sort them first or just sort the concatenation.",
  "'k largest elements of a single array' is the top-K pattern, not a merge.",
  "Pushing only values (not the source list/position) leaves you unable to advance the correct list."
],

  walkthroughCode,
  walkthroughExpectedOutput: "[1, 2, 3, 4, 5, 6, 7, 8, 9]\n",
  complexityNote:
    "O(k + N log(k+1)) time; O(k) frontier plus O(N) returned output. A lazy yielding adaptation uses O(k) auxiliary storage.",

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "N",
      "meaning": "total number of values across all inputs"
    },
    {
      "symbol": "k",
      "meaning": "number of input lists, including empty ones"
    }
  ],
  "costModel": "Comparisons and bounded-size numeric operations cost O(1). Heap sifting costs O(log(size+1)); Python list resizing is amortized across operations, so an individual resizing operation can cost O(size).",
  "time": {
    "bound": "O(k + N log(k+1))",
    "case": "worst",
    "explanation": "Inspect k inputs. Each nonempty input seeds one frontier entry; each of the N values is popped and its next same-list value may be pushed. The heap has at most one frontier per input. This includes all-empty inputs and k=1."
  },
  "space": {
    "bound": "O(k + N)",
    "case": "worst",
    "explanation": "The frontier uses O(k) auxiliary storage and the returned list stores all N values. A yielding iterator adaptation would avoid the O(N) output list.",
    "inputOutputNote": "Input lists are retained outside the algorithm. This implementation materializes its output; heapq.merge is a lazy alternative."
  },
  "derivation": [
    {
      "lines": [
        6
      ],
      "description": "Inspect all k inputs and seed nonempty fronts.",
      "cost": "O(k + N log(k+1))",
      "dimension": "time"
    },
    {
      "lines": [
        11
      ],
      "description": "Extract each value once and add its same-source successor if present.",
      "cost": "O(N log(k+1))",
      "dimension": "time"
    },
    {
      "lines": [
        12
      ],
      "description": "Materialize N output values; frontier contains at most k entries.",
      "cost": "O(k + N)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Every input list is individually sorted ascending.",
    "Values have a consistent total ordering; list index breaks equal-value frontier ties.",
    "Comparisons and bounded-size numeric operations cost O(1). Heap sifting costs O(log(size+1)); Python list resizing is amortized across operations, so an individual resizing operation can cost O(size)."
  ],
  "tradeoffs": "The frontier uses existing sorted order and supports an iterator adaptation. Concatenate-and-sort has a general O(N log N) bound, but Python adaptive sorting can exploit sorted runs; a heap is not always faster.",
  "counters": [
    {
      "label": "values emitted",
      "definition": "Executions of output append.",
      "countLines": [
        12
      ]
    }
  ],
  "fixedDataNote": "Three sorted sources contain nine values. Empty sources do not seed a frontier; [] and all-empty sources return []."
},

  codeExplanations: [
  {
    "line": 1,
    "executable": true,
    "explanation": "Import heapq for the min-heap."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 3,
    "executable": false,
    "explanation": "Comment: merge k sorted lists via a heap of fronts."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Define merge_k(lists)."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "The heap of current fronts."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Seed it with each non-empty list's first element."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Skip empty lists."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Push (value, list index, position 0)."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Output accumulator."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Repeatedly extract the global minimum."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Pop the smallest current front."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Append it to the merged output."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "If that list has more elements..."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "...push its next element to replace the consumed front."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Return the fully merged list."
  },
  {
    "line": 16,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Three sorted lists merge to 1..9."
  }
],

  bindings: [
  {
    "variable": "heap",
    "model": "heap"
  }
],

  linkedLessons: ["merge-sorted-data", "merge-sort", "linked-list-merging"],

  exercises: [
  {
    "id": "pat-kwm-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'Merge k sorted linked lists into one sorted list efficiently.' Which pattern, and the complexity?",
    "expected": "K-way merge: retain one current head per sorted, acyclic, node-disjoint input. Heapify the fronts, pop the smallest and advance its list. O(k + N log(k+1)) time and O(k) heap storage, reusing nodes instead of materializing extra result nodes.",
    "correctPatternId": "k-way-merge",
    "hints": [
      "Goal: merge k sorted linked lists into one sorted list efficiently.",
      "Concatenating then sorting ignores that the inputs are already sorted, costing O(N log N).",
      "Key insight: the next output node is always the smallest among the k current list heads.",
      "Approach: use a k-way merge with a min-heap holding the current head of each list.",
      "Pseudocode: push all heads; pop the smallest, append it, and push that list's next; repeat until empty.",
      "Use a k-way merge with a size-k min-heap: pop the smallest head and advance that list — O(k + N log(k+1)), O(k) space."
    ],
    "recognition": {
      "scenario": "Merge k sorted linked lists into one sorted list efficiently.",
      "approaches": [
        {
          "id": "kway-heap",
          "label": "K-way merge with a min-heap of the k heads",
          "requiredReasonIds": [
            "heap-of-fronts"
          ]
        },
        {
          "id": "concat-sort",
          "label": "Concatenate all, then sort",
          "requiredReasonIds": [],
          "rejectionFeedback": "A heap of fronts directly reuses each sorted chain and supports bounded frontier storage. Concatenate-and-sort is a valid alternative when storing all nodes is allowed; its generic comparison bound is O(N log N), with adaptive sort able to exploit runs."
        }
      ],
      "reasons": [
        {
          "id": "heap-of-fronts",
          "text": "Keep the k current heads in a min-heap: pop the smallest, advance that list — O(k + N log(k+1)) time, O(k) space, using the per-list sortedness."
        },
        {
          "id": "unsorted-lists",
          "text": "The lists are unsorted, so their order gives no advantage.",
          "contradictory": true
        },
        {
          "id": "need-two-heaps",
          "text": "This needs two opposing heaps to track a median boundary.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "kway-heap"
      ],
      "modelExplanation": "K-way merge: retain one current head per sorted, acyclic, node-disjoint input. Heapify the fronts, pop the smallest and advance its list. O(k + N log(k+1)) time and O(k) heap storage, reusing nodes instead of materializing extra result nodes."
    }
  },
  {
    "id": "pat-kwm-choose-1",
    "kind": "choose-approach",
    "prompt": "You must find the k-th smallest element across m sorted rows of a matrix. K-way merge or something else? Rows contain finite integers, and 1<=k<=the total number of cells.",
    "expected": "Heapify up to m row fronts in O(m), then pop k times and insert successors: O(m + k log(m+1)). Value-range binary search is another option for finite integer values, using the monotone count of cells <=x; per-row binary searches count these cells. Compare setup, k, row widths, and value-range size.",
    "correctPatternId": "k-way-merge",
    "hints": [
      "Goal: find the k-th smallest element across m sorted rows of a matrix.",
      "Flattening and sorting discards the row ordering and is more work than needed.",
      "Key insight: the k-th smallest is reached by popping the smallest current front exactly k times.",
      "Approach: use a k-way merge with a heap of the row fronts.",
      "Pseudocode: collect each nonempty row's first element and heapify the fronts; pop the smallest k times, pushing the next element from that row each pop.",
      "K-way merge fits: heap the row fronts and pop k times — O(m + k log(m+1)); binary-search-on-value is an alternative for large matrices."
    ],
    "recognition": {
      "scenario": "You must find the k-th smallest element across m sorted rows of a matrix. K-way merge or something else? Rows contain finite integers, and 1<=k<=the total number of cells.",
      "approaches": [
        {
          "id": "kway-heap",
          "label": "K-way merge (heap of row fronts)",
          "requiredReasonIds": [
            "pop-k-times"
          ]
        },
        {
          "id": "bs-value",
          "label": "Binary search on the value range",
          "requiredReasonIds": [
            "value-monotone"
          ]
        },
        {
          "id": "full-flatten-sort",
          "label": "Flatten and sort all cells",
          "requiredReasonIds": [],
          "rejectionFeedback": "Sorting all cells wastes the per-row order; heap the fronts and pop k times instead."
        }
      ],
      "reasons": [
        {
          "id": "pop-k-times",
          "text": "Heap the m row fronts and pop k times: the k-th pop is the k-th smallest — O(m + k log(m+1)), leveraging each row's sorted order."
        },
        {
          "id": "value-monotone",
          "text": "The count of cells ≤ a candidate value is monotone, so binary-searching the value range converges on the k-th smallest without popping k times."
        },
        {
          "id": "median-boundary",
          "text": "We must maintain a balanced two-heap median boundary.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "kway-heap"
      ],
      "alternatives": [
        {
          "approachId": "bs-value",
          "conditions": "Rows contain finite integers, so a finite value range can be bisected. Count entries <=x by row binary search; compare its count cost and log(value-range size) rounds with m + k log(m+1).",
          "tradeoff": "More complex to implement than the heap-of-fronts merge.",
          "requiredReasonIds": [
            "value-monotone"
          ]
        }
      ],
      "modelExplanation": "Heapify up to m row fronts in O(m), then pop k times and insert successors: O(m + k log(m+1)). Value-range binary search is another option for finite integer values, using the monotone count of cells <=x; per-row binary searches count these cells. Compare setup, k, row widths, and value-range size."
    }
  },
  {
    "id": "pat-kwm-fix-1",
    "kind": "fix-mistake",
    "prompt": "The starter uses (value, list) entries. For these numeric lists, tied values can legally compare the lists lexicographically, so a TypeError is not guaranteed. Replace the entry shape with (value, list_index, element_index) so source progress is explicit and ties never compare whole lists.",
    "starterCode": "import heapq\ndef seed_heap(lists):\n    heap = []\n    for i, lst in enumerate(lists):\n        if lst:\n            heapq.heappush(heap, (lst[0], lst))\n    return heap",
    "expected": "import heapq\ndef seed_heap(lists):\n    heap = []\n    for i, lst in enumerate(lists):\n        if lst:\n            heapq.heappush(heap, (lst[0], i, 0))\n    return heap",
    "hints": [
      "Understand: each front needs its source index and element position.",
      "Tied (value, numeric_list) entries compare lists lexicographically and may inspect many elements.",
      "A unique source index breaks equal-value ties cheaply; element position locates the successor.",
      "Store (value, source_index, position) for each front.",
      "Pseudocode: heappush(heap,(row[0],i,0)); pop into value,i,j; push row[j+1] if it exists.",
      "Solution: tuple metadata identifies the source and successor. Equal numeric lists can compare without TypeError; tied unordered payloads in a different heap can raise TypeError, so do not assume every tuple tie crashes."
    ],
    "tests": "heap = seed_heap([[1, 4], [1, 5]])\nassert len(heap) == 2, f'both non-empty lists seeded, got {len(heap)}'\nassert all(len(e) == 3 and isinstance(e[1], int) and isinstance(e[2], int) for e in heap), f'entries must be (val, i, j) triples with int tiebreakers, got {heap}'\nimport heapq\nassert heapq.heappop(heap) == (1, 0, 0)\nassert heapq.heappop(heap) == (1, 1, 0), 'tie resolves on list index'\nheap2 = seed_heap([[], [3], [2]])\nassert sorted(heap2) == [(2, 2, 0), (3, 1, 0)], f'empty list skipped, got {heap2}'\nprint('OK')"
  }
],

  references: [
  {
    "url": "https://docs.python.org/3.14/library/heapq.html",
    "title": "Python 3.14: heapq",
    "section": "Heap invariant; max-heap APIs; merge; nlargest; priority queue notes; other applications",
    "topic": "k-way-merge",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Sorted-input merge is lazy; one front per source suffices."
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
    "topic": "k-way-merge",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Frontier metadata tracks each iterator and handles equal values."
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
    "topic": "k-way-merge",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Heap root exposes the next smallest candidate."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Both source and app use zero-based array indices, children 2i+1 and 2i+2, and parent (i-1)//2 for i>0. Resizing is accounted for amortized."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "4ddcbd3fa5647945",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
