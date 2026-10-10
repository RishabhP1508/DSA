/**
 * Lesson: Range queries — Fenwick tree (Binary Indexed Tree).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "10\n12\n16\n". Uses the array visualizer to show
 * the BIT storage and the low-bit jumps.
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Fenwick tree (Binary Indexed Tree): prefix sums with O(log n) point updates.
class Fenwick:
    def __init__(self, n):
        if n < 0:
            raise ValueError("negative size")
        self.n = n
        self.tree = [0] * (n + 1)      # 1-indexed; tree[0] unused
    def update(self, i, delta):        # add delta at position i
        if not 1 <= i <= self.n:
            raise IndexError("update index out of range")
        while i <= self.n:
            self.tree[i] += delta
            i += i & (-i)              # jump to the next index that covers i
    def prefix(self, i):               # sum of positions 1..i
        if not 0 <= i <= self.n:
            raise IndexError("prefix boundary out of range")
        s = 0
        while i > 0:
            s += self.tree[i]
            i -= i & (-i)              # strip the lowest set bit
        return s
    def range_sum(self, lo, hi):
        if not (1 <= lo <= self.n + 1 and 0 <= hi <= self.n):
            raise IndexError("range boundary out of range")
        if lo == hi + 1:
            return 0
        if lo > hi:
            raise ValueError("reversed range")
        return self.prefix(hi) - self.prefix(lo - 1)

vals = [3, 2, -1, 6, 5, 4]
bit = Fenwick(len(vals))
for idx, v in enumerate(vals, start=1):
    bit.update(idx, v)
print(bit.prefix(4))         # 3+2-1+6 = 10
print(bit.range_sum(2, 5))   # 2-1+6+5 = 12
bit.update(3, 4)             # position 3 goes from -1 to 3
print(bit.range_sum(2, 5))   # 2+3+6+5 = 16`;

export const fenwickTree: LessonDefinition = {
  id: "fenwick-tree",
  title: "Range Queries: Fenwick Tree (BIT)",
  area: "Range queries",
  prerequisites: ["prefix-sums", "bit-shifts"],

  explanation: "A **Fenwick tree**, or **Binary Indexed Tree (BIT)**, answers **prefix-sum queries** while also supporting **point updates**, both in **O(log n)**. It fills the gap between two extremes: a plain **prefix-sum array** answers range sums in O(1) but needs O(n) to rebuild after any update, while a raw array updates in O(1) but sums a range in O(n). When values **change** *and* you keep asking for sums, the BIT's O(log n) for both is the sweet spot.\n\nThe trick is how each cell stores a **partial sum**. Using **1-based** indexing, cell `i` holds the sum of a block of elements ending at `i` whose **length is the lowest set bit of `i`** — written `i & (-i)` (a standard two's-complement idiom that isolates that bit). To get a prefix sum `1..i`, you repeatedly add `tree[i]` and **strip the lowest set bit** (`i -= i & (-i)`), hopping across O(log n) blocks that exactly tile `[1..i]`. To update position `i`, you add the delta and move **up** to the next cell that covers `i` (`i += i & (-i)`), again O(log n) steps. A **range sum** `[lo..hi]` is just `prefix(hi) − prefix(lo−1)`.\n\nIn the example, the initial prefix sum of the first 4 values is **10**, the range `[2..5]` is **12**, and after adding 4 to position 3 the same range becomes **16** — the update touched only a few cells, not the whole array. The BIT uses **O(n)** space (one array) and is dramatically simpler to code than a segment tree while being just as fast for this classic \"prefix/point\" workload. Its limitation: it's tailored to **invertible** aggregates (sums, XOR — anything with an inverse so `prefix(hi) − prefix(lo−1)` works); for non-invertible aggregates like range-minimum you reach for a segment tree (next lesson).\n\nThe public indices are one-based. Invalid update index zero is rejected because its low bit is zero and it would otherwise loop forever. Prefix boundary zero is valid. Inclusive empty range [lo, hi] means lo=hi+1 and has sum zero; wider reversed bounds are invalid. The sample builds the BIT using n updates, so the complete displayed program costs O(n log(n+1)); one query/update uses O(log(n+1)) worst-case and O(1) working storage beyond the retained BIT. Specialized Fenwick minimum variants exist with restricted updates: the limitation above applies to ordinary sum-style prefix subtraction, not every possible BIT variant.",

  vocabulary: [
    { term: "Fenwick tree / BIT", definition: "An array structure giving O(log n) prefix-sum queries and point updates." },
    { term: "Lowest set bit", definition: "The least-significant 1 bit of an index, isolated by i & (-i)." },
    { term: "Point update", definition: "Changing the value at a single position and propagating it in O(log n)." },
    { term: "Prefix sum", definition: "The total of positions 1..i, assembled from O(log n) BIT cells." },
    { term: "Invertible aggregate", definition: "An operation with an inverse (like +) so a range is prefix(hi) - prefix(lo-1)." },
    { term: "1-based indexing", definition: "Indexing from 1 so the bit tricks on i work; tree[0] is unused." },
  ],

  concepts: {
  "purpose": "Support fast prefix/range sums on an array whose values change, in O(log n) per operation and O(n) space.",
  "operations": "update(i, delta): add delta, walk up via i += i&(-i). prefix(i): sum down via i -= i&(-i). range_sum = prefix(hi) - prefix(lo-1).",
  "uses": "Dynamic prefix sums, counting inversions, order-statistics, frequency/rank queries, 2D extensions for grids.",
  "tradeoffs": "This sum BIT supports invertible prefix subtraction and point deltas. Specialized Fenwick minimum variants exist with restricted updates; a segment tree is simpler for general min/max assignment queries.",
  "commonMistakes": "Using 0-based indices (the bit tricks assume 1-based); adding instead of assigning in update (BIT stores deltas — set requires delta = new - old); forgetting range = prefix(hi) - prefix(lo-1).",
  "edgeCases": "Size zero permits prefix(0) and range_sum(1,0), both zero. update requires 1<=i<=n; prefix requires 0<=i<=n. Inclusive empty ranges have lo=hi+1; other reversed ranges and out-of-range bounds raise errors."
},

  complexity: [
  {
    "operation": "update (point)",
    "best": "O(1)",
    "worst": "O(log(n+1))",
    "space": "O(1) auxiliary; O(n) retained BIT",
    "note": "Walk up O(log n) covering cells."
  },
  {
    "operation": "prefix / range sum",
    "best": "O(1)",
    "worst": "O(log(n+1))",
    "note": "Sum across O(log n) blocks.",
    "space": "O(1) auxiliary; O(n) retained BIT"
  },
  {
    "operation": "build with n updates",
    "best": "O(n log(n+1))",
    "worst": "O(n log(n+1))",
    "space": "O(n)",
    "note": "A separate specialized linear builder is not displayed."
  }
],

  complexityExplanation: {
  "scope": "program",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements the tree indexes"
    }
  ],
  "costModel": "Each update or query step changes the index by its lowest set bit, so the number of steps equals the number of bit positions touched — at most log₂ n.",
  "time": {
    "bound": "O(n log(n+1))",
    "case": "worst",
    "explanation": "The program initializes an n+1 cell BIT and builds it by n logarithmic point updates. Its fixed number of queries/updates adds O(log(n+1)). This is a program bound; individual operations are logarithmic worst-case and some terminate in one step."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The complete program constructs an n+1 cell BIT as working storage; each method uses only constant additional local state.",
    "inputOutputNote": "The BIT array (O(n)) IS the structure; individual query results are O(1) integers."
  },
  "derivation": [
    {
      "lines": [
        8,
        11,
        12,
        13
      ],
      "description": "update walks up via i += i&(-i): one step per set-bit position → O(log n).",
      "cost": "O(log n)",
      "dimension": "time"
    },
    {
      "lines": [
        14,
        17,
        18,
        19,
        20,
        21
      ],
      "description": "prefix walks down via i -= i&(-i): O(log n) blocks summed.",
      "cost": "O(log n)",
      "dimension": "time"
    },
    {
      "lines": [
        7
      ],
      "description": "One array of n+1 entries.",
      "cost": "O(n)",
      "dimension": "space"
    },
    {
      "lines": [
        33
      ],
      "description": "Build by n point updates, each using logarithmic low-bit jumps.",
      "cost": "O(n log(n+1))",
      "dimension": "time"
    }
  ],
  "assumptions": [
    "One-based public updates and inclusive ranges; prefix boundary zero is valid.",
    "Size and indices are integers. Low-bit operations and numeric sums are treated as unit cost (bounded-width arithmetic model).",
    "The example builds with n separate updates, not a separate linear-time BIT construction variant."
  ],
  "tradeoffs": "Sum BIT makes dynamic prefix sums simple. General min/max point assignments fit a segment tree; specialized minimum BIT variants exist with restricted updates.",
  "counters": [
    {
      "label": "update cells changed",
      "definition": "executions of self.tree[i] += delta at line 12",
      "countLines": [
        12
      ]
    },
    {
      "label": "prefix blocks read",
      "definition": "executions of s += self.tree[i] at line 19",
      "countLines": [
        19
      ]
    }
  ],
  "fixedDataNote": "Here n = 6, so each update/query touches at most 3 cells. The O(log n) bound describes how that step count grows with n.",
  "references": [
    {
      "url": "https://cp-algorithms.com/data_structures/fenwick.html",
      "title": "CP Algorithms: Fenwick tree",
      "section": "One-based indexing approach; finding minimum",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "Low-bit jumps implement sum update/query.",
        "Minimum variants have restrictions."
      ],
      "conventions": [
        "App exposes one-based indices; inclusive range endpoints."
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
    },
    {
      "url": "https://web.stanford.edu/class/archive/cs/cs166/cs166.1166/handouts/070%20Problem%20Set%203.pdf",
      "title": "Stanford CS166: Fenwick trees",
      "section": "Problem Three, printed page 3 (PDF page 3), parts i–iii",
      "topic": "trees-graphs-range",
      "purpose": "Cross-check the exact implementation variant and boundary contract.",
      "verifiedClaims": [
        "One-based incremental updates and inclusive prefix sums.",
        "Fenwick storage can be an implicit array with logarithmic operations."
      ],
      "conventions": [
        "The app demonstrates repeated add construction in O(n log(n+1)); a linear initializer is a separate algorithm.",
        "App prefix(0) is zero and an empty inclusive range has lo=hi+1."
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
    "explanation": "Comment: BIT gives O(log n) prefix sums and point updates."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define the Fenwick class."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Constructor takes the number of positions n."
  },
  {
    "line": 4,
    "explanation": "The number of positions must be nonnegative.",
    "executable": true
  },
  {
    "line": 5,
    "explanation": "Reject a negative-size structure.",
    "executable": true
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Store n."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Allocate the 1-indexed tree array (index 0 unused)."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "update(i, delta): add delta at position i."
  },
  {
    "line": 9,
    "explanation": "Updates require a valid one-based position; zero would never advance.",
    "executable": true
  },
  {
    "line": 10,
    "explanation": "Reject zero, negative, and past-end update indices.",
    "executable": true
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Walk up while i is within bounds."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Add delta to this covering cell."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Jump to the next index that covers i by adding the lowest set bit."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "prefix(i): sum of positions 1..i."
  },
  {
    "line": 15,
    "explanation": "A prefix boundary may be zero but cannot be outside the stored positions.",
    "executable": true
  },
  {
    "line": 16,
    "explanation": "Reject invalid prefix boundaries before indexing.",
    "executable": true
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Accumulator."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "Walk down while i is positive."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "Add this block's partial sum."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Strip the lowest set bit to move to the previous block."
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "Return the prefix sum."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "range_sum(lo, hi)."
  },
  {
    "line": 23,
    "explanation": "Range endpoints must lie within the one-based inclusive boundary domain.",
    "executable": true
  },
  {
    "line": 24,
    "explanation": "Reject endpoints outside the stored array.",
    "executable": true
  },
  {
    "line": 25,
    "explanation": "An adjacent reversed pair represents an empty inclusive interval.",
    "executable": true
  },
  {
    "line": 26,
    "explanation": "An empty range has sum zero, including range_sum(1,0) for size zero.",
    "executable": true
  },
  {
    "line": 27,
    "explanation": "Other reversed bounds do not describe a supported interval.",
    "executable": true
  },
  {
    "line": 28,
    "explanation": "Reject a reversed interval beyond the defined empty case.",
    "executable": true
  },
  {
    "line": 29,
    "executable": true,
    "explanation": "A range is the difference of two prefix sums (addition is invertible)."
  },
  {
    "line": 30,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 31,
    "executable": true,
    "explanation": "The values to index (1-based positions 1..6)."
  },
  {
    "line": 32,
    "executable": true,
    "explanation": "Build a Fenwick tree of that size."
  },
  {
    "line": 33,
    "executable": true,
    "explanation": "Insert each value with a point update (1-based)."
  },
  {
    "line": 34,
    "executable": true,
    "explanation": "Perform the initial updates."
  },
  {
    "line": 35,
    "executable": true,
    "explanation": "prefix(4) = 3+2-1+6 = 10."
  },
  {
    "line": 36,
    "executable": true,
    "explanation": "range_sum(2,5) = 2-1+6+5 = 12."
  },
  {
    "line": 37,
    "executable": true,
    "explanation": "Add 4 at position 3 (its value becomes 3)."
  },
  {
    "line": 38,
    "executable": true,
    "explanation": "Now range_sum(2,5) = 2+3+6+5 = 16."
  }
],

  bindings: [
  {
    "variable": "bit",
    "model": "array",
    "path": "tree",
    "overlays": [
      {
        "role": "pointer",
        "source": "i",
        "label": "one-based index"
      }
    ]
  }
],

  bindingsRationale: "Resolve the actual bit.tree array. Slot 0 is unused; the active i overlay shows each low-bit jump in update/prefix.",
  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "Why does `i += i & (-i)` (update) walk UP the tree while `i -= i & (-i)` (prefix) walks DOWN, and why are both O(log n)?",
    "answer": "i & -i extracts the least significant set bit. Updating adds that block size to reach a later covering cell; querying subtracts it to reach the preceding disjoint prefix block. Each move raises the update low-bit position or clears a query bit, so at most floor(log₂ n)+1 cells are touched for a positive valid index.",
    "explanation": "These are index jumps among implicitly stored blocks. prefix(0) reads no cells; update(0) is invalid because its low bit is zero and would make no progress."
  }
],

  experiments: [
    "Print bit.tree after building to see which cells hold which block sums.",
    "Count update/prefix loop iterations and relate them to the binary form of the index.",
    "Add a `set(i, value)` method that computes delta = value - current and calls update.",
  ],

  exercises: [
    {
      id: "fen-complete-1",
      kind: "complete-code",
      prompt: "Complete the prefix-sum walk using the lowest-set-bit trick.",
      starterCode:
        "def prefix(self, i):\n    s = 0\n    while i > 0:\n        s += self.tree[i]\n        # TODO: move to the previous block\n    return s",
      expected:
        "def prefix(self, i):\n    s = 0\n    while i > 0:\n        s += self.tree[i]\n        i -= i & (-i)\n    return s",
      hints: [
        "Each cell covers a block ending at i.",
        "Strip the lowest set bit to reach the previous block.",
        "i -= i & (-i)",
      ],
    },
    {
      id: "fen-choose-1",
      kind: "choose-approach",
      prompt: "You need many range-SUM queries on an array whose entries are frequently updated. Static prefix-sum array or Fenwick tree — and why?",
      expected: "Fenwick tree: O(log n) for both update and query. A static prefix-sum array answers queries in O(1) but needs O(n) to rebuild after every update, which is too slow when updates are frequent.",
      hints: [
        "Static prefix sums are O(n) to update.",
        "Frequent updates make that costly.",
        "BIT is O(log n) for both.",
      ],
    },
    {
      id: "fen-predict-1",
      kind: "predict-state",
      prompt: "After building from [3,2,-1,6,5,4], what is range_sum(2,5), and how does update(3, 4) change it?",
      expected: "range_sum(2,5) = 12 (2-1+6+5). After update(3,4), position 3 becomes 3, so range_sum(2,5) = 2+3+6+5 = 16.",
      hints: [
        "Sum positions 2..5.",
        "The update adds 4 to position 3.",
        "12 + 4 = 16.",
      ],
    },
  ],

  review: "This one-based sum BIT uses low-bit jumps for logarithmic point deltas and prefix queries. Inclusive range_sum(lo,hi) subtracts prefix(lo−1); an adjacent reversed interval is empty. Bounds guards prevent index-zero update loops and negative-index corruption. The sample builds with n updates. Specialized minimum BIT variants have additional constraints.",

  expectedOutput: "10\n12\n16\n",

  references: [
  {
    "url": "https://cp-algorithms.com/data_structures/fenwick.html",
    "title": "CP Algorithms: Fenwick tree",
    "section": "One-based indexing approach; finding minimum",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "Low-bit jumps implement sum update/query.",
      "Minimum variants have restrictions."
    ],
    "conventions": [
      "App exposes one-based indices; inclusive range endpoints."
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
  },
  {
    "url": "https://web.stanford.edu/class/archive/cs/cs166/cs166.1166/handouts/070%20Problem%20Set%203.pdf",
    "title": "Stanford CS166: Fenwick trees",
    "section": "Problem Three, printed page 3 (PDF page 3), parts i–iii",
    "topic": "trees-graphs-range",
    "purpose": "Cross-check the exact implementation variant and boundary contract.",
    "verifiedClaims": [
      "One-based incremental updates and inclusive prefix sums.",
      "Fenwick storage can be an implicit array with logarithmic operations."
    ],
    "conventions": [
      "The app demonstrates repeated add construction in O(n log(n+1)); a linear initializer is a separate algorithm.",
      "App prefix(0) is zero and an empty inclusive range has lo=hi+1."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "cd3e4ca8333bc7a5",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
