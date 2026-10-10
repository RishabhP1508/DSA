/**
 * Lesson: Range queries — segment tree (iterative, range sum + point update).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "10\n12\n16\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Segment tree: range queries with point updates in O(log n).
# Iterative array layout: leaves in [n, 2n), each parent = combine of its children.
class SegTree:
    def __init__(self, data):
        self.n = len(data)
        self.tree = [0] * (2 * self.n)
        for i in range(self.n):                 # store leaves in the second half
            self.tree[self.n + i] = data[i]
        for i in range(self.n - 1, 0, -1):      # build parents bottom-up
            self.tree[i] = self.tree[2 * i] + self.tree[2 * i + 1]
    def update(self, i, value):                 # set position i to value
        if not 0 <= i < self.n:
            raise IndexError("update index out of range")
        i += self.n
        self.tree[i] = value
        i //= 2
        while i >= 1:                           # refresh ancestors
            self.tree[i] = self.tree[2 * i] + self.tree[2 * i + 1]
            i //= 2
    def query(self, lo, hi):                    # sum of [lo, hi)  (half-open)
        if not 0 <= lo <= hi <= self.n:
            raise IndexError("query boundaries out of range")
        res = 0
        lo += self.n
        hi += self.n
        while lo < hi:
            if lo & 1:                          # lo is a right child -> include it
                res += self.tree[lo]
                lo += 1
            if hi & 1:                          # hi is a right child -> include hi-1
                hi -= 1
                res += self.tree[hi]
            lo //= 2
            hi //= 2
        return res

st = SegTree([3, 2, -1, 6, 5, 4])
print(st.query(0, 4))   # 3+2-1+6 = 10
print(st.query(1, 5))   # 2-1+6+5 = 12
st.update(2, 3)         # index 2 becomes 3
print(st.query(1, 5))   # 2+3+6+5 = 16`;

export const segmentTree: LessonDefinition = {
  id: "segment-tree",
  title: "Range Queries: Segment Tree",
  area: "Range queries",
  prerequisites: ["fenwick-tree", "tree-dfs"],

  explanation: "A **segment tree** combines selected array blocks to answer dynamic range queries. This example uses addition and point assignment. Build n leaves at positions [n,2n), then compute parents bottom-up in O(n). Updating one leaf refreshes O(log(n+1)) ancestors. A half-open query [lo,hi) selects at most two blocks per level and climbs by halving both boundaries.\n\nThe compact 2n layout works for any n, including sizes that are not powers of two. For those sizes not every internal node corresponds to a contiguous interval in the original linear order: some nodes wrap around the leaf arrangement and are not used as whole query blocks. It is misleading to label every parent as an ordinary interval. Addition is commutative, so the example can use one accumulator even though selected right-side blocks are encountered in reverse order. A noncommutative associative operation needs ordered left/right accumulators (and careful layout interpretation); padding to a power of two provides a simpler interval picture.\n\nEmpty arrays allow query(0,0)=0 and no updates. Valid updates use 0<=i<n; queries require 0<=lo<=hi<=n. Invalid bounds raise IndexError. Negative values and repeated values are supported. The sample outputs 10, 12, then 16 after an assignment. Its complete build plus fixed operations is O(n); a method uses O(1) working storage beyond the retained O(n) tree. General minimum/maximum assignments work with a segment tree; specialized Fenwick minimum variants have additional restrictions.",

  vocabulary: [
  {
    "term": "Segment tree",
    "definition": "A structure combining array blocks for logarithmic dynamic range queries; a padded tree gives each node a contiguous interval."
  },
  {
    "term": "Leaf layer",
    "definition": "The bottom level [n, 2n) holding the original array elements."
  },
  {
    "term": "Combine function",
    "definition": "How two children merge into a parent (sum here; could be min, max, gcd)."
  },
  {
    "term": "Point update",
    "definition": "Setting one leaf and refreshing its ancestors up to the root."
  },
  {
    "term": "Half-open interval",
    "definition": "query(lo, hi) covers indices lo..hi-1; hi is exclusive."
  },
  {
    "term": "Lazy propagation",
    "definition": "An extension (not shown) enabling efficient range updates."
  }
],

  concepts: {
  "purpose": "Answer range aggregate queries (including non-invertible ones like min/max) with point updates in O(log n).",
  "operations": "Build bottom-up in O(n); update a leaf and refresh ancestors; query by climbing and adding boundary nodes that fall outside their parent segment.",
  "uses": "Range sum/min/max/gcd with updates, competitive programming range problems, interval statistics; with lazy propagation, range updates.",
  "tradeoffs": "More general than a Fenwick tree (handles non-invertible aggregates) but larger constant and more code; O(n) space either way.",
  "commonMistakes": "Mixing inclusive and half-open bounds; accepting negative Python indices; confusing assignment with a delta; assuming every compact-layout node is a contiguous input interval; reusing one accumulator for a noncommutative combine.",
  "edgeCases": "query(lo,lo) returns zero, including query(0,0) on an empty tree. Updating an empty tree or using negative/out-of-range indices raises IndexError. Non-power-of-two sizes work for sum."
},

  complexity: [
  {
    "operation": "build",
    "best": "O(n)",
    "worst": "O(n)",
    "space": "O(n)",
    "note": "One method beyond the retained tree uses O(1) working space; storage is 2n cells."
  },
  {
    "operation": "point update",
    "best": "O(1)",
    "worst": "O(log(n+1))",
    "note": "One method beyond the retained tree uses O(1) working space; storage is 2n cells."
  },
  {
    "operation": "range query",
    "best": "O(1)",
    "worst": "O(log(n+1))",
    "note": "One method beyond the retained tree uses O(1) working space; storage is 2n cells."
  }
],

  complexityExplanation: {
  "scope": "program",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements (leaves) in the tree"
    }
  ],
  "costModel": "Each combine is O(1). Update and query move up the tree, halving the index each step, so they take a number of steps equal to the tree height.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "Build n leaves and n−1 parent nodes, then perform a fixed number of logarithmic operations. For n>=1 the complete program is O(n); n=0 is constant."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The complete program constructs the 2n-cell tree as working storage. It has n leaves, n−1 used parent cells and unused index zero when n>=1. Each method adds O(1) local storage.",
    "inputOutputNote": "The 2n-entry tree array IS the structure; each query returns an O(1) integer."
  },
  "derivation": [
    {
      "lines": [
        7,
        8,
        9,
        10
      ],
      "description": "Build: n leaf writes plus n-1 parent combines → O(n).",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        11,
        14,
        15,
        16,
        17,
        18,
        19
      ],
      "description": "Update refreshes one node per level up to the root.",
      "cost": "O(log n)",
      "dimension": "time"
    },
    {
      "lines": [
        20,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34
      ],
      "description": "Query climbs both boundaries, O(1) per level.",
      "cost": "O(log n)",
      "dimension": "time"
    },
    {
      "lines": [
        6
      ],
      "description": "Allocate 2n cells: n leaves, n−1 parents and unused index zero for n>=1.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Zero-based element indices and half-open query ranges.",
    "The displayed single-accumulator combine is addition (associative and commutative), with identity zero.",
    "Integer sums/index operations are treated as constant-cost bounded-width arithmetic.",
    "For arbitrary n the compact parent layout can wrap; only selected query blocks must represent the requested interval."
  ],
  "tradeoffs": "A sum BIT uses a smaller retained array. Segment trees support general associative aggregates; this one-accumulator example uses commutative addition. Constant factors depend on implementation and workload. Lazy range updates are a separate extension.",
  "counters": [
    {
      "label": "query rounds",
      "definition": "executions of the left-boundary test at line 27",
      "countLines": [
        27
      ]
    },
    {
      "label": "parents refreshed",
      "definition": "executions of the parent recomputation at line 18",
      "countLines": [
        18
      ]
    }
  ],
  "fixedDataNote": "Here n = 6, so the tree has height 3 and each query/update touches at most ~3 levels. The O(log n) bound describes how that grows with n.",
  "references": [
    {
      "url": "https://codeforces.com/blog/entry/18051",
      "title": "Al.Cash: Efficient and easy segment trees",
      "section": "Single-element modifications; arbitrary sized array; non-commutative combiners",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "Compact 2n layout supports arbitrary n.",
        "Ordered operations require two query accumulators."
      ],
      "conventions": [
        "App uses addition, one accumulator and half-open zero-based ranges."
      ],
      "accessDate": "2026-10-10"
    },
    {
      "url": "https://cp-algorithms.com/data_structures/segment_tree.html",
      "title": "CP Algorithms: segment trees",
      "section": "Simplest sum tree; construction; update and query",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "Build is linear; point update and query logarithmic."
      ],
      "conventions": [
        "Source commonly uses recursive 4n storage; app uses iterative 2n."
      ],
      "accessDate": "2026-10-10"
    }
  ]
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: range queries + point updates in O(log n)."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Comment: iterative array layout."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Define the SegTree class."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Constructor takes the initial data."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "n = number of elements."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Allocate a tree array of size 2n."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Place each element as a leaf..."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "...in the second half [n, 2n)."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Build internal nodes from n-1 down to 1..."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "...each parent is the combine (sum) of its two children."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "update(i, value): set position i."
  },
  {
    "line": 12,
    "explanation": "Point assignments require a valid zero-based element index.",
    "executable": true
  },
  {
    "line": 13,
    "explanation": "Reject negative and past-end indices before they can corrupt internal nodes.",
    "executable": true
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Map index i to its leaf position i + n."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Store the new value at the leaf."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "Move to the parent."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Walk up to the root refreshing ancestors."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "Recompute this node from its children."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "Continue to the parent."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "query(lo, hi): sum of the half-open range [lo, hi)."
  },
  {
    "line": 21,
    "explanation": "Validate zero-based half-open query boundaries; equality gives an empty range.",
    "executable": true
  },
  {
    "line": 22,
    "explanation": "Reject negative, reversed, and past-end boundaries.",
    "executable": true
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "Result accumulator."
  },
  {
    "line": 24,
    "executable": true,
    "explanation": "Map lo to the leaf layer."
  },
  {
    "line": 25,
    "executable": true,
    "explanation": "Map hi to the leaf layer."
  },
  {
    "line": 26,
    "executable": true,
    "explanation": "Climb while the range is non-empty."
  },
  {
    "line": 27,
    "executable": true,
    "explanation": "If lo is a right child, it isn't fully covered by its parent..."
  },
  {
    "line": 28,
    "executable": true,
    "explanation": "...so add it to the result..."
  },
  {
    "line": 29,
    "executable": true,
    "explanation": "...and move lo past it."
  },
  {
    "line": 30,
    "executable": true,
    "explanation": "If hi is a right child, the node hi-1 is inside the range..."
  },
  {
    "line": 31,
    "executable": true,
    "explanation": "...step hi down..."
  },
  {
    "line": 32,
    "executable": true,
    "explanation": "...and add that node."
  },
  {
    "line": 33,
    "executable": true,
    "explanation": "Halve lo to move up a level."
  },
  {
    "line": 34,
    "executable": true,
    "explanation": "Halve hi to move up a level."
  },
  {
    "line": 35,
    "executable": true,
    "explanation": "Return the range sum."
  },
  {
    "line": 36,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 37,
    "executable": true,
    "explanation": "Build a segment tree from the sample data."
  },
  {
    "line": 38,
    "executable": true,
    "explanation": "query(0,4) = 3+2-1+6 = 10."
  },
  {
    "line": 39,
    "executable": true,
    "explanation": "query(1,5) = 2-1+6+5 = 12."
  },
  {
    "line": 40,
    "executable": true,
    "explanation": "Set index 2 to 3."
  },
  {
    "line": 41,
    "executable": true,
    "explanation": "Now query(1,5) = 2+3+6+5 = 16."
  }
],

  bindings: [
  {
    "variable": "st",
    "model": "array",
    "path": "tree",
    "overlays": [
      {
        "role": "boundary",
        "source": "lo",
        "label": "query left"
      },
      {
        "role": "boundary",
        "source": "hi",
        "label": "query right"
      }
    ]
  }
],

  bindingsRationale: "Display st.tree as the actual compact 2n storage, avoiding false contiguous-interval labels on wrapped internal nodes. Query overlays track the current half-open boundaries.",
  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "Why choose a segment tree over a Fenwick tree, given the BIT is simpler?",
    "answer": "A segment tree stores aggregates that can be combined over selected ranges, including min/max/gcd without subtraction. The displayed sum BIT derives a range from two prefix sums; that subtraction needs an inverse. Specialized minimum BIT variants have extra restrictions, while range updates with lazy propagation are a separate segment-tree extension.",
    "explanation": "This compact example implements point assignments and half-open sum queries. Supporting ordered noncommutative aggregates needs separate left/right accumulators; general lazy range updates require additional state and code."
  }
],

  experiments: [
    "Change the combine from + to min (and initialize appropriately) to get range-minimum queries.",
    "Print st.tree after building to see leaves and internal sums.",
    "Count query climb steps for different ranges and relate them to log2(n).",
  ],

  exercises: [
    {
      id: "seg-complete-1",
      kind: "complete-code",
      prompt: "Complete the point update so all ancestors are refreshed.",
      starterCode:
        "def update(self, i, value):\n    i += self.n\n    self.tree[i] = value\n    i //= 2\n    while i >= 1:\n        # TODO: recompute this node, then move up\n        pass",
      expected:
        "def update(self, i, value):\n    i += self.n\n    self.tree[i] = value\n    i //= 2\n    while i >= 1:\n        self.tree[i] = self.tree[2 * i] + self.tree[2 * i + 1]\n        i //= 2",
      hints: [
        "Each ancestor is the combine of its two children.",
        "Recompute, then go to the parent with i //= 2.",
        "self.tree[i] = self.tree[2*i] + self.tree[2*i+1]; i //= 2",
      ],
    },
    {
      id: "seg-choose-1",
      kind: "choose-approach",
      prompt: "You need range-MINIMUM queries with point updates. Fenwick tree or segment tree — and why?",
      expected: "Segment tree: minimum is non-invertible, so a Fenwick tree can't answer arbitrary range minima via prefix differences. The segment tree stores per-segment minima and answers range-min in O(log n).",
      hints: [
        "Is minimum invertible?",
        "No — you can't subtract a min.",
        "Segment tree stores segment aggregates directly.",
      ],
    },
    {
      id: "seg-predict-1",
      kind: "predict-state",
      prompt: "For data [3,2,-1,6,5,4], what is query(1,5), and after update(2,3) what does query(1,5) return?",
      expected: "query(1,5) covers indices 1..4 = 2-1+6+5 = 12. After setting index 2 to 3, it is 2+3+6+5 = 16.",
      hints: [
        "The interval is half-open: 1..4.",
        "The update changes index 2 from -1 to 3.",
        "12 + 4 = 16.",
      ],
    },
  ],

  review: "This compact sum segment tree stores leaves in [n,2n), builds parent sums in O(n), and supports point assignments and half-open queries in O(log(n+1)). Retained storage is 2n cells, with O(1) additional state per method. For non-power-of-two n some internal nodes wrap across the leaf order; selected query blocks still produce the requested sum. Noncommutative combines need two ordered accumulators. Empty query intervals return zero; invalid indices are rejected.",

  expectedOutput: "10\n12\n16\n",

  references: [
  {
    "url": "https://codeforces.com/blog/entry/18051",
    "title": "Al.Cash: Efficient and easy segment trees",
    "section": "Single-element modifications; arbitrary sized array; non-commutative combiners",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "Compact 2n layout supports arbitrary n.",
      "Ordered operations require two query accumulators."
    ],
    "conventions": [
      "App uses addition, one accumulator and half-open zero-based ranges."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://cp-algorithms.com/data_structures/segment_tree.html",
    "title": "CP Algorithms: segment trees",
    "section": "Simplest sum tree; construction; update and query",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "Build is linear; point update and query logarithmic."
    ],
    "conventions": [
      "Source commonly uses recursive 4n storage; app uses iterative 2n."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "fa3d8511fc0b1ca8",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
