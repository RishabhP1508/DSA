/**
 * Lesson: Min/max heaps (Heaps). Verified on the bundled CPython 3.14.2.
 * Output: "1\n0\n1\n9\n9\n8\n".
 *
 * R5.2: corrected the previously WRONG claim that "Python only has a min-heap".
 * Python 3.14 added a native max-heap API (heapify_max / heappush_max /
 * heappop_max / heapreplace_max / heappushpop_max — all "Added in version 3.14"
 * per the official docs, and proven present on the bundled 3.14.2 runtime).
 * Negation is now taught as the PORTABLE alternative, not a necessity.
 */

import type { LessonDefinition } from "../../core/types";

const code = `import heapq

# A min-heap keeps the SMALLEST item instantly reachable at index 0.
h = [5, 3, 8, 1, 9, 2]
heapq.heapify(h)             # O(n): rearrange the list into a valid min-heap
print(h[0])                  # peek the minimum in O(1)
heapq.heappush(h, 0)         # insert in O(log n)
print(heapq.heappop(h))      # remove & return the minimum in O(log n)
print(h[0])                  # new minimum after the pop

# Python 3.14 added a native MAX-heap API (the *_max functions).
mx = [5, 3, 8, 1, 9, 2]
heapq.heapify_max(mx)        # O(n): build a max-heap in place
print(mx[0])                 # the LARGEST is now at index 0
print(heapq.heappop_max(mx)) # remove & return the maximum in O(log n)

# Portable alternative (works before 3.14 too): negate the values.
neg = [-x for x in [5, 3, 8, 1]]
heapq.heapify(neg)
print(-heapq.heappop(neg))   # pop the largest ORIGINAL value`;

export const minMaxHeaps: LessonDefinition = {
  id: "min-max-heaps",
  title: "Min and Max Heaps",
  area: "Heaps",
  prerequisites: [
  "array-traversal",
  "binary-search"
],

  explanation: "A **heap** is a tree-shaped structure (stored compactly in an array) that always keeps the **most extreme element instantly reachable at the top**. A **min-heap** keeps the smallest at the root; a **max-heap** keeps the largest. You don't get full sorted order — only the guarantee that the root is the min (or max) — and that limited promise is exactly what makes insert and remove cheap: **O(log n)**, with an **O(1)** peek.\n\nPython's `heapq` module works on a plain list. By convention the **unqualified functions build a min-heap** (`heap[0]` is the smallest, `heappop` returns the smallest). **Since Python 3.14 there is also a native max-heap API**: `heapify_max`, `heappush_max`, `heappop_max` (plus `heapreplace_max`/`heappushpop_max`) keep the **largest** at `maxheap[0]`. Both families use **zero-based indexing** (children of index `i` at `2i+1` and `2i+2`, parent at `(i-1)//2`), which differs from many textbooks (e.g. Princeton) that use **1-based** indexing and default to a max-heap — a convention clash worth knowing when you read other sources.\n\nBefore 3.14 (and still, if you want code that runs on 3.11–3.13) the classic way to get a max-heap is to **negate the values**: push `-x` and negate again on pop. That trick still works and is worth understanding. The core costs are the same either way: `heapify`/`heapify_max` **builds** a heap in **O(n)** (cheaper than n separate inserts), `heappush`/`heappop` are **O(log n)**, and reading the root is **O(1)**. Heaps are the engine of priority queues, top-K, and the greedy graph algorithms (Dijkstra, Prim) coming later.\n\nThe parent formula applies only for i>0; the root has no parent. O(log(n+1)) describes sifting; backing-list resizes can make an individual update O(n), while the sequence cost remains logarithmic amortized. Heapify is O(n), whereas n repeated pushes take O(n log(n+1)) in the worst case. Equal-priority tuples can try to compare their payloads: use (priority, unique_counter, payload) when payloads have no order. Ordinary heaps are not stable.",

  vocabulary: [
  {
    "term": "Heap",
    "definition": "A complete binary tree (stored as an array) keeping the extreme element at the root."
  },
  {
    "term": "Min-heap",
    "definition": "A heap whose smallest element is always at the root (heap[0]); heapq's default."
  },
  {
    "term": "Max-heap",
    "definition": "A heap whose largest element is at the root; use heapq's *_max functions (Python 3.14+) or negate values on older versions."
  },
  {
    "term": "Heap invariant",
    "definition": "Each parent is <= its children (min-heap) or >= its children (max-heap), maintained by push/pop."
  },
  {
    "term": "heapify / heapify_max",
    "definition": "Rearrange a list into a valid min-heap / max-heap in O(n)."
  },
  {
    "term": "Zero-based indexing",
    "definition": "heapq convention: root at index 0; children of i at 2i+1 and 2i+2."
  }
],

  concepts: {
  "purpose": "Provide O(log n) insert/remove of the smallest (or largest) element and O(1) peek — the core of priority queues.",
  "operations": "heapify / heapify_max (O(n) build), heappush(_max) / heappop(_max) (O(log n)), heap[0] peek (O(1)).",
  "uses": "Priority queues, top-K, Dijkstra/Prim, scheduling, streaming extremes.",
  "tradeoffs": "Only the root is instantly available (not full order); push/pop are O(log n), not O(1). A max-heap via the native *_max API is clearer than negation, but negation is portable to pre-3.14 runtimes.",
  "commonMistakes": "Expecting the whole heap to be sorted (only heap[0] is guaranteed); mixing min and max functions on the same list; using 1-based child formulas from textbooks with heapq's 0-based layout.",
  "edgeCases": "heappop / heappop_max on an empty heap raises IndexError. Duplicates are fine. A single element is a valid heap."
},

  complexity: [
  {
    "operation": "heapify / heapify_max (build)",
    "best": "O(n)",
    "average": "O(n)",
    "worst": "O(n)",
    "space": "O(1)",
    "note": "In-place build is O(n), cheaper than n inserts."
  },
  {
    "operation": "heap push / pop (both families)",
    "best": "O(1) push without resize",
    "average": "O(log(n+1)) amortized",
    "worst": "O(n) if resized",
    "space": "O(1) sift bookkeeping",
    "note": "Sifting is O(log(n+1)); CPython pop need not stop early like the educational sift_down. Heap list storage is O(n)."
  },
  {
    "operation": "peek heap[0]",
    "best": "O(1)",
    "average": "O(1)",
    "worst": "O(1)",
    "note": "The root is the extreme element."
  }
],

  complexityExplanation: {
  "scope": "program",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in the heap"
    }
  ],
  "costModel": "The heap is a complete binary tree of height ~log2(n). push/pop sift an element along one root-to-leaf path (O(log n)). heapify/heapify_max sift down all nodes but the total is O(n) by the standard bottom-up analysis. Comparisons and bounded-size numeric operations cost O(1). Heap sifting costs O(log(size+1)); Python list resizing is amortized across operations, so an individual resizing operation can cost O(size).",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "This program builds a min heap, a max heap, and a negated heap. Bottom-up heap construction is O(n); the fixed number of pushes/pops adds O(log(n+1)). The complete demonstration is O(n), while individual heap updates have logarithmic sifting cost (amortized including list resizing)."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The program constructs three lists whose storage grows with n. An in-place heapify itself uses O(1) auxiliary bookkeeping, but that is distinct from the complete demonstration.",
    "inputOutputNote": "The heap list of n elements is the data; its O(n) size is inherent, not auxiliary. The negation example (line 18) builds a NEW list of n negated values, which is O(n) auxiliary — one reason the native *_max API can be preferable."
  },
  "derivation": [
    {
      "lines": [
        5
      ],
      "description": "heapify BUILDS the min-heap bottom-up in O(n) — this is heap CONSTRUCTION, not a single push/pop.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        6
      ],
      "description": "peek h[0] reads the root — O(1).",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        7,
        8
      ],
      "description": "one push and one pop each sift along one height ~log2(n) — O(log n) each.",
      "cost": "O(log n)",
      "dimension": "time"
    },
    {
      "lines": [
        13
      ],
      "description": "heapify_max BUILDS a max-heap in O(n) (construction).",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        15
      ],
      "description": "heappop_max removes the maximum, sifting down one height — O(log n).",
      "cost": "O(log n)",
      "dimension": "time"
    },
    {
      "lines": [
        4,
        12,
        18
      ],
      "description": "The program constructs min, max and negated lists whose total storage grows with n.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Comparisons are O(1).",
    "The heap is a complete binary tree so height is ~log2(n).",
    "0-based indexing: children of i at 2i+1, 2i+2 (heapq convention, both min and max families).",
    "The native *_max functions require Python 3.14+ (present on the bundled 3.14.2 runtime).",
    "Comparisons and bounded-size numeric operations cost O(1). Heap sifting costs O(log(size+1)); Python list resizing is amortized across operations, so an individual resizing operation can cost O(size)."
  ],
  "tradeoffs": "A sorted list has O(n) insertion from shifting. Heap updates sift in O(log(n+1)), amortized including resizing. Negation can happen on insertion or in place; this particular demo chooses an O(n) new negated list.",
  "counters": [],
  "fixedDataNote": "This run heapifies 6 elements twice (once min, once max), pushes/pops a few, and pops from a negated max-heap. The O(log n) push/pop and O(n) build bounds generalise to n."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": true,
    "explanation": "Import heapq (bundled standard library)."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 3,
    "executable": false,
    "explanation": "Comment: a min-heap keeps the smallest at index 0."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Create an unordered list."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "heapify rearranges it into a valid MIN-heap in O(n) (heap construction)."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "h[0] is the minimum → 1 (O(1) peek)."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "heappush inserts 0 and sifts it up (O(log n))."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "heappop removes and returns the minimum, which is now 0."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "After popping 0, the new minimum is 1."
  },
  {
    "line": 10,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 11,
    "executable": false,
    "explanation": "Comment: Python 3.14 added a native max-heap API."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Fresh unordered list for the max-heap demo."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "heapify_max builds a MAX-heap in place in O(n) (3.14+)."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "mx[0] is now the largest → 9 (O(1) peek)."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "heappop_max removes and returns the maximum → 9 (O(log n))."
  },
  {
    "line": 16,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 17,
    "executable": false,
    "explanation": "Comment: negation is the portable alternative (pre-3.14)."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "Negate values so the largest original becomes the smallest negated (allocates a new O(n) list)."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "heapify the negated list into a min-heap."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Pop the min of the negated heap and negate back → 8 (the largest original)."
  }
],

  bindings: [
  {
    "variable": "h",
    "model": "heap"
  },
  {
    "variable": "mx",
    "model": "heap"
  },
  {
    "variable": "neg",
    "model": "heap"
  }
],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "How can you get a MAX-heap in Python 3.14, and what are the child-index formulas for heapq's 0-based layout?",
    "answer": "Use the native max-heap API — heapify_max / heappush_max / heappop_max — which keeps the largest at maxheap[0]. (Portable alternative: negate values with the min-heap functions.) With 0-based indexing, the children of index i are at 2i+1 and 2i+2 (parent at (i-1)//2).",
    "explanation": "Python 3.14 added the *_max functions so you no longer NEED negation for a max-heap, though negation still works and is portable to older versions. heapq's documented 0-based layout places node i's children at 2i+1 and 2i+2."
  }
],

  experiments: [
  "Push several values and pop repeatedly with heappop; note they come out in ascending order. Do the same with heappop_max and note descending order.",
  "Print the heap list after heapify — confirm only heap[0] is guaranteed smallest, not the whole list.",
  "Build a max-heap two ways — heapify_max vs negating — and confirm the roots agree."
],

  exercises: [
  {
    "id": "heap-complete-1",
    "kind": "complete-code",
    "prompt": "Complete a function that returns the k smallest numbers using a heap.",
    "starterCode": "import heapq\ndef k_smallest(nums, k):\n    # TODO: use heapq to return the k smallest\n    pass",
    "expected": "import heapq\ndef k_smallest(nums, k):\n    return heapq.nsmallest(k, nums)",
    "hints": [
      "Goal: return the k smallest numbers using a heap.",
      "Fully sorting is O(n log n); a heap helper targets just the k smallest.",
      "Key insight: heapq exposes ready-made selection helpers for smallest/largest.",
      "Approach: call heapq.nsmallest with k and the list.",
      "Pseudocode: return heapq.nsmallest(k, nums).",
      "Write `return heapq.nsmallest(k, nums)`."
    ],
    "tests": "assert sorted(k_smallest([5, 1, 4, 2, 3], 3)) == [1, 2, 3], 'three smallest'\nassert k_smallest([5, 1, 4, 2, 3], 1) == [1], 'the single smallest'\nassert sorted(k_smallest([3, 3, 3], 2)) == [3, 3], 'duplicates allowed'\nassert k_smallest([2, 1], 5) == sorted([2, 1]), 'k larger than list returns all sorted'\nassert k_smallest([], 3) == [], 'empty input'\nprint('OK')"
  },
  {
    "id": "heap-choose-1",
    "kind": "choose-approach",
    "prompt": "You repeatedly insert numbers and must always fetch the current minimum. A sorted list or a heap? Give the per-operation complexities.",
    "expected": "A heap: insert O(log n) and extract-min O(log n), peek O(1). A sorted list gives O(1) min but O(n) insertion. The heap wins when you interleave many inserts and extractions.",
    "hints": [
      "Goal: repeatedly insert numbers and always fetch the current minimum, choosing a sorted list or a heap, with per-op costs.",
      "The costly part of a sorted list is insertion: keeping it sorted shifts elements in O(n) each time.",
      "Key property: inserts and extract-mins interleave heavily, so BOTH operations must stay cheap.",
      "Approach: use a binary heap (e.g. heapq).",
      "Reasoning: a heap gives O(log n) insert and extract-min with O(1) peek, balancing both operations; a sorted list offers O(1) min but O(n) insert, which loses when inserts are frequent.",
      "Answer: a heap — insert and extract-min O(log n), peek O(1); the sorted list's O(n) insert loses when inserts and extractions interleave."
    ],
    "recognition": {
      "scenario": "You repeatedly insert numbers and must always be able to fetch the current minimum, interleaving many inserts and extractions.",
      "approaches": [
        {
          "id": "heap",
          "label": "A min-heap",
          "requiredReasonIds": [
            "heap-log-ops"
          ]
        },
        {
          "id": "sorted-list",
          "label": "A list kept sorted on every insert",
          "requiredReasonIds": [],
          "rejectionFeedback": "A sorted list gives O(1) min but every insertion is O(n) to keep order, so a stream of inserts makes it too slow."
        }
      ],
      "reasons": [
        {
          "id": "heap-log-ops",
          "text": "A heap does insert and extract-min in O(log n) and peek-min in O(1), which balances the interleaved inserts and extractions far better than O(n) insertion."
        },
        {
          "id": "heap-sorted-fully",
          "text": "A heap keeps all elements fully sorted, so you can read any rank in O(1).",
          "contradictory": true
        },
        {
          "id": "sorted-list-fast-insert",
          "text": "A sorted list inserts in O(1), so it beats the heap for frequent inserts.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "heap"
      ],
      "modelExplanation": "A heap: insert O(log n) and extract-min O(log n), peek O(1). A sorted list gives O(1) min but O(n) insertion, so the heap wins when inserts and extractions interleave."
    }
  }
],

  review: "A **heap** keeps the extreme element at the root. In Python's `heapq`, the unqualified functions build a **min-heap** (smallest at `heap[0]`); **Python 3.14 also provides a native max-heap API** (`heapify_max`/`heappush_max`/`heappop_max`, largest at `maxheap[0]`). `heapify`/`heapify_max` **build** in **O(n)**, `heappush`/`heappop` are **O(log n)** (tree height ~log₂n), peek is **O(1)**. heapq uses **0-based indexing** (children of i at 2i+1, 2i+2) — unlike 1-based textbooks. The classic **negation** trick still gives a max-heap on older versions. Heaps power priority queues, top-K, and greedy graph algorithms.",

  expectedOutput: "1\n0\n1\n9\n9\n8\n",

  references: [
  {
    "url": "https://docs.python.org/3.14/library/heapq.html",
    "title": "Python 3.14: heapq",
    "section": "Heap invariant; max-heap APIs; merge; nlargest; priority queue notes; other applications",
    "topic": "min-max-heaps",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Native max APIs exist in 3.14; heapify is linear; tied tuple payloads need a tiebreaker."
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
    "topic": "min-max-heaps",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Zero-based children; logarithmic sift height; resizing amortizes."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Both source and app use zero-based array indices, children 2i+1 and 2i+2, and parent (i-1)//2 for i>0. Resizing is accounted for amortized."
    ]
  },
  {
    "url": "https://visualgo.net/en/heap",
    "title": "VisuAlgo: Binary heap",
    "section": "Complete tree, insertion, extraction, and build visualization",
    "topic": "min-max-heaps",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Complete-tree layout and sift operations; adapt visual indexing to zero."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source text discusses a default max-heap and tree/array views. App heapq uses zero-based indices; actual indexing diagram inspected in ODS Figure 10.1."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "6c21b6995b657143",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
