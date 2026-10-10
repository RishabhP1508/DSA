/**
 * Lesson: Running median (Heaps). Verified on CPython 3.14.
 * Output: "4.0\n4\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `import heapq

# Maintain the median of a growing stream using two balanced heaps.
class MedianFinder:
    def __init__(self):
        self.small = []   # max-heap (store negatives) for the lower half
        self.large = []   # min-heap for the upper half
    def add(self, x):
        # 1) push to small, 2) move small's max over to large, 3) rebalance
        heapq.heappush(self.small, -x)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))
    def median(self):
        if len(self.small) > len(self.large):
            return -self.small[0]                    # odd count: middle element
        return (-self.small[0] + self.large[0]) / 2  # even count: average of middles

mf = MedianFinder()
for v in [5, 15, 1, 3]:
    mf.add(v)
print(mf.median())     # of {1,3,5,15} -> (3+5)/2 = 4.0
mf.add(4)
print(mf.median())     # of {1,3,4,5,15} -> middle = 4`;

export const runningMedian: LessonDefinition = {
  id: "running-median",
  title: "Running Median (Two Heaps)",
  area: "Heaps",
  prerequisites: [
  "min-max-heaps",
  "classes"
],

  explanation: "The **median** of a stream is hard because it's a *middle* value — sorting after every insertion would be **O(n log n) per query**. The trick is to split the numbers into two balanced halves and keep each half's boundary instantly reachable with a heap: a **max-heap for the lower half** (`small`) and a **min-heap for the upper half** (`large`). Then the median is right at the two roots.\n\nThe invariant to maintain on every insert: `small` holds the smaller half (its **max** at the root), `large` holds the larger half (its **min** at the root), and their sizes differ by at most one with `small` allowed to be the bigger by one. The clean insertion recipe is: push the new value into `small`, immediately move `small`'s max into `large` (this places the value on the correct side), then rebalance if `large` got bigger. Each insert is **O(log n)**.\n\nReading the median is **O(1)**: if the counts are equal it's the average of the two roots; if `small` has one extra it's `small`'s max. For `{1,3,5,15}` that's `(3+5)/2 = 4.0`; after adding 4, `{1,3,4,5,15}` has middle `4`. This **two-heap balancing** is the specific application; the next lesson generalizes the pattern. `heapq`'s unqualified functions are a **min-heap**, so this lesson stores the lower half as **negated** values to act as a max-heap — a portable technique that runs on any version. (Python 3.14 also offers native `heapq.*_max` functions, so a max-heap can be built directly without negation.)\n\nTwo invariants are needed: all lower-half values are <= all upper-half values, and small has the same size as large or one extra. Balancing sizes alone does not ensure a correct median. An add makes at most five heap calls. An empty median query raises IndexError; values must be finite and ordered (no NaN), and the root sum plus float conversion must not overflow. This example does not prevent overflow: two finite 1e308 values already produce an infinite intermediate sum.",

  vocabulary: [
  {
    "term": "Running median",
    "definition": "The median maintained as new values stream in."
  },
  {
    "term": "Lower/upper half",
    "definition": "The smaller and larger halves of the values seen so far."
  },
  {
    "term": "small (max-heap)",
    "definition": "Holds the lower half with its maximum at the root (negated in Python)."
  },
  {
    "term": "large (min-heap)",
    "definition": "Holds the upper half with its minimum at the root."
  },
  {
    "term": "Balance invariant",
    "definition": "The two heaps' sizes differ by at most one, small >= large in size."
  }
],

  concepts: {
  "purpose": "Answer median queries on a growing stream in O(1), with O(log n) inserts.",
  "operations": "add: push to small, shift small's max to large, rebalance sizes. median: read the roots.",
  "uses": "Streaming statistics, moving/median-of-stream problems, sliding-window median (with removals).",
  "tradeoffs": "O(log(n+1)) amortized insertion and O(1) query under bounded numeric costs. Maintain both cross-heap value order and the size invariant. Sorting prefixes has a general O(n log n) bound per query, though adaptive sorting can exploit prior runs.",
  "commonMistakes": "Letting the heaps become unbalanced (median reads the wrong root); forgetting to negate for the max-heap; mixing up which heap can be larger; wrong even/odd median formula.",
  "edgeCases": "An empty median query raises IndexError. Duplicate finite values are valid when root sums and float conversion stay representable. No NaN; this code does not prevent floating-point overflow."
},

  complexity: [
  {
    "operation": "add",
    "best": "O(log n)",
    "average": "O(log(n+1)) amortized",
    "worst": "O(n) if storage resized",
    "space": "O(n)",
    "note": "At most five heap calls; sifting O(log(n+1)), backing-list resizing amortized."
  },
  {
    "operation": "median query",
    "best": "O(1)",
    "average": "O(1)",
    "worst": "O(1)",
    "note": "Read one or both heap roots."
  }
],

  complexityExplanation: {
  "scope": "operation",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of values inserted so far"
    }
  ],
  "costModel": "Each heappush/heappop is O(log n); reading a root is O(1). add does a constant number of heap operations. Comparisons and bounded-size numeric operations cost O(1). Heap sifting costs O(log(size+1)); Python list resizing is amortized across operations, so an individual resizing operation can cost O(size).",
  "time": {
    "bound": "O(log(n+1))",
    "case": "amortized",
    "explanation": "An add performs at most five heap calls: one push, a pop/push crossing the boundary, and optionally another pop/push for size balance. Each sift is logarithmic and storage resizing is amortized. A median query reads at most two roots in O(1), under bounded numeric costs. Inserting n values takes O(n log(n+1)) total."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The two heaps together store all n values seen so far — O(n).",
    "inputOutputNote": "The stored values ARE the data structure; O(n) is inherent to remembering the stream. The bound covers the named algorithm; demonstration construction and collected print output are separate allocations."
  },
  "derivation": [
    {
      "lines": [
        10,
        11
      ],
      "description": "Two heap pushes and one pop to place the value on the correct side.",
      "cost": "O(log n)",
      "dimension": "time"
    },
    {
      "lines": [
        12,
        13
      ],
      "description": "At most one rebalancing push/pop.",
      "cost": "O(log n)",
      "dimension": "time"
    },
    {
      "lines": [
        15,
        16,
        17
      ],
      "description": "median reads one or both roots — O(1).",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        6,
        7
      ],
      "description": "Two heaps hold all n values.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Comparisons are O(1).",
    "The lower half is a max-heap via negation.",
    "The balance invariant (sizes differ by <= 1) is preserved each add.",
    "Comparisons and bounded-size numeric operations cost O(1). Heap sifting costs O(log(size+1)); Python list resizing is amortized across operations, so an individual resizing operation can cost O(size).",
    "All values are finite and mutually ordered; no NaN. Numeric values, the even-case root sum, and the returned average must remain finite and representable during float conversion. This example does not prevent floating-point overflow.",
    "median requires at least one value; an empty query raises IndexError in this implementation.",
    "Every lower-half value <= every upper-half value; small has the same size as large or one extra."
  ],
  "tradeoffs": "Re-sorting per query is O(n log n); an ordered structure (balanced BST / order-statistic tree) also gives O(log n) inserts and O(log n) median. The two-heap approach is simple and O(1) for the median read.",
  "counters": [],
  "fixedDataNote": "This run adds 5 values; median of {1,3,5,15} is 4.0, then of {1,3,4,5,15} is 4. The O(log n) add / O(1) query bounds generalise to n."
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
    "explanation": "Comment: two balanced heaps track the median."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Define the MedianFinder class."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Constructor."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "small: a max-heap (negated) for the lower half."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "large: a min-heap for the upper half."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "add(x): insert while keeping the halves balanced."
  },
  {
    "line": 9,
    "executable": false,
    "explanation": "Comment describing the three-step insert."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Push x into small (as -x)."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Move small's current max into large — this routes x to the right side."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "If large now has more elements than small..."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "...move large's min back to small to restore balance."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "median(): read the roots."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "If small has one extra element (odd count)..."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "...the median is small's max (-small[0])."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Otherwise (even count), average the two middle roots."
  },
  {
    "line": 18,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "Create the finder."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Add 5, 15, 1, 3."
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "Add each value."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "Median of {1,3,5,15} = (3+5)/2 = 4.0."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "Add a 5th value, 4."
  },
  {
    "line": 24,
    "executable": true,
    "explanation": "Median of {1,3,4,5,15} = 4 (the middle)."
  }
],

  bindings: [
  {
    "variable": "mf",
    "path": "small",
    "model": "heap"
  },
  {
    "variable": "mf",
    "path": "large",
    "model": "heap"
  }
],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "Why does maintaining two heaps give O(1) median queries, and O(log n) inserts?",
    "answer": "The two roots (max of the lower half, min of the upper half) are exactly the middle element(s), read in O(1); each insert only does a constant number of O(log n) heap operations to keep the halves balanced.",
    "explanation": "Splitting the data at the median and exposing each half's boundary at a heap root means the median is always at the roots (O(1) read). Inserts just push/pop a few times to preserve the balance invariant, costing O(log n)."
  }
],

  experiments: [
  "Print the sizes of small and large after each add to watch the balance invariant hold.",
  "Feed a sorted stream and confirm the median updates correctly.",
  "Add an even vs odd number of elements and see the two median formulas fire."
],

  exercises: [
  {
    "id": "med-choose-1",
    "kind": "choose-approach",
    "prompt": "You must report the median after every insertion in a stream of a million numbers. Two heaps or re-sort each time? Give complexities.",
    "expected": "Two heaps preserve order and size invariants: O(log(n+1)) amortized per insert and O(1) per median, O(n log(n+1)) total. Rebuilding order after every insertion is unnecessary; generic re-sort analysis gives O(n² log n) total, while adaptive Python sorting can exploit prior order and still scan each growing prefix.",
    "hints": [
      "Goal: choose between two heaps and re-sorting for the median after every insertion in a million-number stream.",
      "Repeated sorting recomputes order; general bounds total O(n² log n), while Python can exploit the previously sorted prefix and still needs growing-prefix work.",
      "Key insight: keeping the two halves as heaps exposes the median at the roots in O(1).",
      "Approach: maintain a low-half max-heap and high-half min-heap, balanced by size.",
      "Pseudocode: insert into the correct heap, rebalance sizes, read the median from the roots.",
      "Two heaps give O(log n) insert and O(1) median → O(n log n) total, far better than re-sorting's O(n^2 log n)."
    ],
    "recognition": {
      "scenario": "You must report the median after every insertion in a stream of a million numbers. Two heaps or re-sort each time?",
      "approaches": [
        {
          "id": "two-heaps",
          "label": "Two heaps (balanced halves)",
          "requiredReasonIds": [
            "log-insert-const-query"
          ]
        },
        {
          "id": "resort",
          "label": "Re-sort on every query",
          "requiredReasonIds": [],
          "rejectionFeedback": "Re-sorting is O(n log n) per query → general upper bound O(n² log n) overall — hopeless for a million insertions."
        }
      ],
      "reasons": [
        {
          "id": "log-insert-const-query",
          "text": "A low-half max-heap and high-half min-heap kept balanced give O(log n) per insert and O(1) per median → O(n log n) total."
        },
        {
          "id": "single-report",
          "text": "The median is reported only once at the end, so a single sort suffices.",
          "contradictory": true
        },
        {
          "id": "one-extreme-only",
          "text": "Only one extreme value is ever needed, so a single heap works.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "two-heaps"
      ],
      "modelExplanation": "Two heaps preserve order and size invariants: O(log(n+1)) amortized per insert and O(1) per median, O(n log(n+1)) total. Rebuilding order after every insertion is unnecessary; generic re-sort analysis gives O(n² log n) total, while adaptive Python sorting can exploit prior order and still scan each growing prefix."
    }
  },
  {
    "id": "med-fix-1",
    "kind": "fix-mistake",
    "prompt": "This add() forgets to rebalance, so the heaps can become lopsided and the median is wrong. Add the rebalance step.",
    "starterCode": "def add(self, x):\n    heapq.heappush(self.small, -x)\n    heapq.heappush(self.large, -heapq.heappop(self.small))",
    "expected": "def add(self, x):\n    heapq.heappush(self.small, -x)\n    heapq.heappush(self.large, -heapq.heappop(self.small))\n    if len(self.large) > len(self.small):\n        heapq.heappush(self.small, -heapq.heappop(self.large))",
    "hints": [
      "Understand: small must have the same size as large or one extra.",
      "After routing through large, large can be one entry bigger than small.",
      "That already violates the chosen lower-extra invariant.",
      "If len(large)>len(small), move large's minimum back to small.",
      "Pseudocode: if len(self.large)>len(self.small): heappush(self.small, -heappop(self.large)).",
      "Solution: restore the lower-extra size rule after the ordered cross-move. Also retain every lower value <= every upper value."
    ],
    "tests": "import heapq\n# add() is a method fragment referencing self.small/self.large; call it on a host.\nclass _MF:\n    def __init__(self):\n        self.small = []  # max-heap via negation (larger half's floor)\n        self.large = []  # min-heap (upper half)\n    def median(self):\n        if len(self.small) == len(self.large):\n            return (-self.small[0] + self.large[0]) / 2\n        return float(-self.small[0])\nm = _MF()\nfor v in [5, 15, 1, 3]:\n    add(m, v)\n# After rebalancing the two heaps must stay balanced (small has the extra when odd).\nassert len(m.small) >= len(m.large), f'small must not be smaller than large, got {len(m.small)},{len(m.large)}'\nassert len(m.small) - len(m.large) <= 1, 'heaps differ by at most one'\nassert m.median() == 4.0, f'median of [1,3,5,15] is 4.0, got {m.median()}'\nm2 = _MF()\nfor v in [2, 1, 3]:\n    add(m2, v)\nassert m2.median() == 2.0, f'median of [1,2,3] is 2, got {m2.median()}'\nprint('OK')"
  }
],

  review: "Running median maintains a lower max-heap and an upper min-heap. Every lower value is <= every upper value; small has equal size or one extra. Read its root for an odd count, or average both roots for an even count. Add uses at most five heap calls, with O(log(n+1)) amortized cost; query costs O(1) under bounded numeric operations. This example uses portable negation, while Python 3.14 also provides native max APIs.",

  expectedOutput: "4.0\n4\n",

  references: [
  {
    "url": "https://docs.python.org/3.14/library/heapq.html",
    "title": "Python 3.14: heapq",
    "section": "Heap invariant; max-heap APIs; merge; nlargest; priority queue notes; other applications",
    "topic": "running-median",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Two heaps expose the median roots and can use native max functions."
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
    "topic": "running-median",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Heap storage resizing amortizes across additions."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Both source and app use zero-based array indices, children 2i+1 and 2i+2, and parent (i-1)//2 for i>0. Resizing is accounted for amortized."
    ]
  },
  {
    "url": "https://docs.python.org/3.14/builtins/stdtypes.html",
    "title": "Python 3.14 numeric types",
    "section": "Numeric types: arbitrary-size integers and finite-precision floating-point numbers",
    "topic": "running-median",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Floating-point results have limited range/precision; the app average precondition must also cover the intermediate sum."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "This median example assumes its root sum and float conversion do not overflow. Two finite 1e308 floats produce an infinite sum, so a representable mathematical average alone is insufficient."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "59f4c4b71c7e01eb",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
