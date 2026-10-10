/**
 * Lesson: Merging sorted data (Heaps). Verified on CPython 3.14.
 * Output: "[0, 1, 2, 3, 4, 5, 7, 8, 9]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `import heapq

# Store one current front for each nonempty sorted list.
def merge_k(lists):
    heap = []
    for i, row in enumerate(lists):
        if row:
            heapq.heappush(heap, (row[0], i, 0))
    out = []
    while heap:
        value, source, position = heapq.heappop(heap)
        out.append(value)
        next_position = position + 1
        if next_position < len(lists[source]):
            heapq.heappush(heap, (lists[source][next_position], source, next_position))
    return out

a = [1, 4, 7]
b = [2, 5, 8]
c = [0, 3, 9]
print(merge_k([a, b, c]))`;

export const mergeSortedData: LessonDefinition = {
  id: "merge-sorted-data",
  title: "Merging Sorted Data (K-Way Merge)",
  area: "Heaps",
  prerequisites: [
  "min-max-heaps",
  "merge-sort"
],

  explanation: "K-way merge combines k already-sorted inputs by keeping one current front from each nonempty source in a min-heap. The smallest front is the smallest remaining value overall: everything later in that source is at least as large, and the heap compares every available source front. Pop that value, append it to the output, and push its same-source successor if one exists.\n\nThe displayed indexed-list implementation uses tuples (value, source index, position), so each pop identifies which list to advance. Inputs must be sorted ascending and values mutually ordered. A unique source index breaks equal-value frontier ties without comparing whole lists. Duplicates are retained. Empty sources are skipped; one source produces a new result list containing the same sequence of values.\n\nInspecting k sources and emitting N values costs O(k + N log(k+1)). This includes k=1 and all-empty sources. The frontier occupies O(k) auxiliary storage; this function also retains O(N) returned output and already receives materialized input lists.\n\nPython heapq.merge(*iterables) is a lazy iterator alternative. Consuming its results one at a time can keep O(k) frontier storage without retaining all output; external merge sort uses an iterator adaptation of this idea for disk runs. Concatenate-and-sort has a generic O(N log N) comparison bound, but Python adaptive sorting can exploit sorted runs. A heap is useful when k is small or incremental output is needed; it is not automatically faster for every input.",

  vocabulary: [
  {
    "term": "K-way merge",
    "definition": "Merging k sorted sequences into one sorted output."
  },
  {
    "term": "Front element",
    "definition": "The smallest unused element of each input list."
  },
  {
    "term": "heapq.merge",
    "definition": "Lazily merges sorted iterables into a single sorted iterator."
  },
  {
    "term": "Lazy iterator",
    "definition": "Produces items on demand without materializing them all."
  },
  {
    "term": "External merge",
    "definition": "Merging sorted runs too large to fit in memory (from disk)."
  }
],

  concepts: {
  "purpose": "Combine multiple sorted inputs into one sorted output efficiently, exploiting their existing order.",
  "operations": "Heap of current fronts; pop the smallest, push the next from its list; repeat.",
  "uses": "K-way merge, external/merge sort of huge data, merging sorted logs/streams.",
  "tradeoffs": "O(k + N log(k+1)) time, O(k) frontier and O(N) returned output. A lazy iterator adaptation can avoid retaining output; Python sorting can exploit existing runs.",
  "commonMistakes": "Holding all N values in the heap instead of one front per source; losing source/position metadata; feeding unsorted inputs; assuming this returned-list implementation is lazy.",
  "edgeCases": "Empty inputs are skipped but still inspected. One source returns a new list with the same values. Duplicates across sources are preserved; mutually unordered values violate the comparison precondition."
},

  complexity: [
  {
    "operation": "Materialized k-way merge",
    "best": "O(k+N)",
    "average": "O(k + N log(k+1)) upper bound",
    "worst": "O(k + N log(k+1))",
    "space": "O(k+N)",
    "note": "Frontier O(k), returned values O(N). Empty sources still cost O(k) to inspect."
  },
  {
    "operation": "Lazy iterator adaptation",
    "worst": "O(k + N log(k+1))",
    "space": "O(k)",
    "note": "Yield results rather than retain them; sorted-input precondition remains."
  }
],

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

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": true,
    "explanation": "Import the heap functions."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 3,
    "executable": false,
    "explanation": "Comment: each source contributes only its current front."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Define merge_k for a sequence of sorted lists."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Start an empty frontier heap."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Inspect every source and retain its integer index."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Skip empty sources."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Seed the first value with its source and position; integer indices resolve equal-value ties."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Start the returned output list."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Continue until every source is exhausted."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Remove the smallest available front and remember where it came from."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Emit the selected value."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Advance only that source's position."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Check whether that source has another value."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Push its successor; the other source fronts remain available."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "Return the materialized sorted result."
  },
  {
    "line": 17,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "First source in ascending order."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "Second source in ascending order."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Third source in ascending order."
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "Print the nine values in ascending order."
  }
],

  bindings: [
  {
    "variable": "a",
    "model": "array"
  },
  {
    "variable": "b",
    "model": "array"
  },
  {
    "variable": "c",
    "model": "array"
  },
  {
    "variable": "heap",
    "model": "heap"
  },
  {
    "variable": "out",
    "model": "array"
  }
],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "Why does the frontier algorithm have O(k + N log(k+1)) time, and which storage belongs to the displayed result?",
    "answer": "Inspect k input sources, then pop each of the N values and push its successor into a heap of at most k fronts. The heap work is bounded by log(k+1), including k=1. Frontier storage is O(k); the displayed returned list additionally stores N output values.",
    "explanation": "The next global minimum must be among current fronts because each source is already sorted. Advancing only the popped source preserves that invariant. heapq.merge is a lazy alternative; the displayed function materializes its result."
  }
],

  experiments: [
  "Merge two lists to see it reduce to the ordinary 2-way merge from merge sort.",
  "Include an empty list and confirm it's simply skipped.",
  "Merge lists with duplicates across them and confirm all are preserved in order."
],

  exercises: [
  {
    "id": "merge-choose-1",
    "kind": "choose-approach",
    "prompt": "You have 1000 sorted files too large to fit in memory and must produce one sorted stream. Concatenate-and-sort or heap-based k-way merge? Why?",
    "expected": "Heap-based k-way merge: it keeps only k=1000 front elements in memory (O(k) space) and streams output lazily in O(N log k). Concatenate-and-sort needs all N items in memory (O(N)) and is O(N log N).",
    "hints": [
      "Goal: merge 1000 sorted files too large to fit in memory into one sorted stream — concatenate-and-sort or heap-based k-way merge.",
      "The costly route is concatenate-and-sort: it needs all N items in memory and re-sorts data that is already sorted.",
      "Key property: each file is already sorted, so the global next element is always one of the k current front elements.",
      "Approach: run a heap-based k-way merge, keeping one front element per file in a min-heap.",
      "Reasoning: the heap holds only k=1000 items (O(k) space) and emits output lazily in O(k + N log(k+1)), while concatenate-and-sort needs O(N) memory and O(N log N) time.",
      "Answer: heap-based k-way merge — O(k) space and O(k + N log(k+1)) streaming, versus concatenate-and-sort's O(N) memory and O(N log N)."
    ],
    "recognition": {
      "scenario": "You have 1000 already-sorted files, too large to all fit in memory, and must produce one sorted output stream.",
      "approaches": [
        {
          "id": "kway-heap",
          "label": "Heap-based k-way merge of the file fronts",
          "requiredReasonIds": [
            "heap-front-elements"
          ]
        },
        {
          "id": "concat-sort",
          "label": "Concatenate every file and sort the whole thing",
          "requiredReasonIds": [],
          "rejectionFeedback": "Concatenate-and-sort must hold all N items in memory (O(N) space) and is O(N log N) — but the data does not fit in memory, so it is infeasible here."
        }
      ],
      "reasons": [
        {
          "id": "heap-front-elements",
          "text": "A min-heap holding only the k=1000 current front elements picks the global next value in O(log k) and streams output lazily, needing just O(k) memory."
        },
        {
          "id": "concat-is-cheaper",
          "text": "Concatenating and sorting uses less memory than a k-way merge because it reads each file only once.",
          "contradictory": true
        },
        {
          "id": "merge-needs-all-memory",
          "text": "The k-way merge must load all N items into memory before it can emit anything.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "kway-heap"
      ],
      "modelExplanation": "Heap-based k-way merge keeps only k front elements in memory (O(k) space) and streams output in O(N log k). Concatenate-and-sort needs all N items in memory and is O(N log N)."
    }
  },
  {
    "id": "merge-complete-1",
    "kind": "complete-code",
    "prompt": "Merge two sorted lists into one sorted list using heapq.merge.",
    "starterCode": "import heapq\ndef merge_two(a, b):\n    # TODO: return a single sorted list\n    pass",
    "expected": "import heapq\ndef merge_two(a, b):\n    return list(heapq.merge(a, b))",
    "hints": [
      "Goal: merge two sorted lists into one sorted list using heapq.merge.",
      "Concatenating then sorting is the generic O(n log n) comparison upper bound (adaptive sorting can exploit existing runs); merging pre-sorted inputs is linear.",
      "Key insight: heapq.merge lazily interleaves already-sorted iterables in order.",
      "Approach: call heapq.merge on both lists and materialise it.",
      "Pseudocode: return list(heapq.merge(a, b)).",
      "Write `return list(heapq.merge(a, b))`."
    ],
    "tests": "assert merge_two([1, 3, 5], [2, 4, 6]) == [1, 2, 3, 4, 5, 6], 'interleaved'\nassert merge_two([], [1, 2]) == [1, 2], 'empty left'\nassert merge_two([1, 2], []) == [1, 2], 'empty right'\nassert merge_two([], []) == [], 'both empty'\nassert merge_two([1, 1], [1]) == [1, 1, 1], 'duplicates kept, still sorted'\nout = merge_two([1, 5], [2, 3, 4])\nassert out == sorted(out), 'result is sorted'\nprint('OK')"
  }
],

  review: "K-way merge keeps one front per sorted input. Pop the smallest, then advance only its source. Source/position tuple metadata handles progress and equal-value ties. Inspecting sources plus emitting values takes O(k + N log(k+1)); the displayed function has O(k) frontier and O(N) result storage. heapq.merge provides a lazy iterator alternative, and adaptive Python sorting remains a valid comparison option.",

  expectedOutput: "[0, 1, 2, 3, 4, 5, 7, 8, 9]\n",

  references: [
  {
    "url": "https://docs.python.org/3.14/library/heapq.html",
    "title": "Python 3.14: heapq",
    "section": "Heap invariant; max-heap APIs; merge; nlargest; priority queue notes; other applications",
    "topic": "merge-sorted-data",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "heapq.merge expects sorted inputs and is lazy."
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
    "topic": "merge-sorted-data",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Frontier entries retain source progress and compare ordered keys."
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
    "topic": "merge-sorted-data",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "A heap selects the smallest available frontier by its root."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Both source and app use zero-based array indices, children 2i+1 and 2i+2, and parent (i-1)//2 for i>0. Resizing is accounted for amortized."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "f601c829a21cc276",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
