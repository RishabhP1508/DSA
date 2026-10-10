/**
 * Lesson: Two-heap pattern (Heaps). Verified on CPython 3.14.
 * Output: "2 2\n20 30\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `import heapq

# The two-heap pattern: split data into a lower half and an upper half,
# each boundary exposed at a heap root, kept balanced by size.
small = []   # max-heap (negated): the lower half
large = []   # min-heap: the upper half

for x in [10, 20, 30, 40]:
    heapq.heappush(small, -x)                      # add to lower half
    heapq.heappush(large, -heapq.heappop(small))   # shift its max to upper half
    if len(large) > len(small):                    # rebalance sizes
        heapq.heappush(small, -heapq.heappop(large))

print(len(small), len(large))     # balanced: 2 and 2
print(-small[0], large[0])        # the two boundary values: 20 and 30


# IPO: transfer eligible projects by capital, then choose maximum profit.
def maximize_capital(capital, profits, k, wealth):
    projects = [(required, i) for i, required in enumerate(capital)]
    heapq.heapify(projects)
    available = []
    for _ in range(k):
        while projects and projects[0][0] <= wealth:
            required, i = heapq.heappop(projects)
            heapq.heappush_max(available, profits[i])
        if not available:
            break
        wealth += heapq.heappop_max(available)
    return wealth

print(maximize_capital([0, 1, 1], [1, 2, 3], 2, 0))`;

export const twoHeapPattern: LessonDefinition = {
  id: "two-heap-pattern",
  title: "The Two-Heap Pattern",
  area: "Heaps",
  prerequisites: [
  "running-median"
],

  explanation: "A pair of heaps can expose two useful priorities. For a running median, keep a max-heap of the lower half and a min-heap of the upper half. Every lower value must be <= every upper value, and the lower heap has the same size as the upper heap or one extra. The roots locate the middle in O(1); insertions cost O(log(n+1)) amortized.\n\nThe first runnable example uses portable negation for the lower max-heap. Each insertion pushes into the lower heap, moves its maximum into the upper heap, then moves the upper minimum back if necessary. After [10,20,30,40], sizes are 2 and 2 and the boundary values are 20 and 30. Python 3.14 also provides native heapq.*_max functions. A sliding-window median additionally needs removal of outgoing values, often via lazy deletion.\n\nThe second example solves IPO / maximize capital using heaps ordered by different keys. Keep unchosen projects by required capital in a min-heap, move every affordable project into a native profit max-heap, choose the largest available profit, and add it to wealth. Required capital is an eligibility threshold; it is not deducted. These heaps do not need balanced sizes.\n\nThe capital and profit arrays must have equal lengths. k is a nonnegative integer; wealth, requirements and profits are nonnegative integers. Each project may be selected once. A greater affordable profit leaves at least as much wealth, so it cannot prevent later eligibility; choosing it first can replace a smaller affordable first choice. Stop after at most k projects or when none is eligible. The example first chooses profit 1, then profit 3, returning wealth 4.",

  vocabulary: [
  {
    "term": "Two-heap pattern",
    "definition": "Two heaps exposing different priorities: balanced lower/upper boundaries for medians, or capital eligibility and maximum profit for IPO."
  },
  {
    "term": "Boundary elements",
    "definition": "The two heap roots straddling the split between lower and upper halves."
  },
  {
    "term": "Balance invariant",
    "definition": "The heaps' sizes differ by at most one, keeping the boundary at the roots."
  },
  {
    "term": "Rebalance",
    "definition": "Moving one element between heaps to restore the size invariant."
  },
  {
    "term": "Opposing heaps",
    "definition": "One max-heap and one min-heap arranged to meet at the median/partition."
  }
],

  concepts: {
  "purpose": "Expose two priorities cheaply: the median partition boundaries, or the next eligible and most profitable projects.",
  "operations": "Insert: push, shift boundary to the other heap, rebalance. Read: the two roots. IPO is an eligibility transfer, not a balanced median partition.",
  "uses": "Running/sliding-window median, IPO/maximize-capital, scheduling with two priorities, partition tracking.",
  "tradeoffs": "Median insertions have O(log(n+1)) amortized cost, root queries O(1); both ordering and size balance matter. Portable negation is chosen here, while native max APIs exist in Python 3.14.",
  "commonMistakes": "Balancing sizes without ordering values; misreading a negated lower root; confusing the median invariant with IPO eligibility transfer.",
  "edgeCases": "Median reads require a nonempty set; duplicates are allowed. IPO returns initial wealth for k=0 or no eligible projects; zero profits and repeated capital requirements are valid."
},

  complexity: [
  {
    "operation": "insert",
    "best": "O(log n)",
    "average": "O(log(n+1)) amortized",
    "worst": "O(n) if resized",
    "space": "O(n)",
    "note": "Constant number of O(log n) heap ops per insert."
  },
  {
    "operation": "read boundary",
    "best": "O(1)",
    "average": "O(1)",
    "worst": "O(1)",
    "note": "Peek one or both roots."
  },
  {
    "operation": "IPO / maximize capital",
    "best": "O(p)",
    "average": "O(p log(p+1) + k) upper bound",
    "worst": "O(p log(p+1) + k)",
    "space": "O(p)",
    "note": "Heapify requirements; transfer each project once; at most k choices; no size balancing."
  }
],

  complexityExplanation: {
  "scope": "program",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements inserted so far"
    },
    {
      "symbol": "p",
      "meaning": "number of available input projects"
    },
    {
      "symbol": "k",
      "meaning": "maximum number of projects to finish"
    }
  ],
  "costModel": "Each heappush/heappop is O(log n); reading a root is O(1). Each insert does a constant number of heap operations. Comparisons and bounded-size numeric operations cost O(1). Heap sifting costs O(log(size+1)); Python list resizing is amortized across operations, so an individual resizing operation can cost O(size).",
  "time": {
    "bound": "O(n log(n+1) + p log(p+1) + k)",
    "case": "worst",
    "explanation": "This whole program inserts n values, each through at most five heap calls. Logarithmic sifting and amortized list resizing give O(n log(n+1)) total; the final size/root reads are O(1). The IPO example heapifies p projects in O(p), transfers each at most once, and selects at most min(k,p) profits. Its loop has O(k) checks as an upper bound and heap work O(p log(p+1)); it stops early when no project is available. This is separate from median balancing."
  },
  "space": {
    "bound": "O(n+p)",
    "case": "worst",
    "explanation": "The median heaps store n inserted values. The IPO eligibility/profit heaps hold at most p projects in total, so program storage is O(n+p).",
    "inputOutputNote": "The stored elements are the data structure; O(n) is inherent."
  },
  "derivation": [
    {
      "lines": [
        9,
        10
      ],
      "description": "Push and shift the boundary to the correct side — O(log n).",
      "cost": "O(log n)",
      "dimension": "time"
    },
    {
      "lines": [
        11,
        12
      ],
      "description": "At most one rebalancing move.",
      "cost": "O(log n)",
      "dimension": "time"
    },
    {
      "lines": [
        14,
        15
      ],
      "description": "Reading the roots (sizes / boundary values) — O(1).",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        4,
        5
      ],
      "description": "Two heaps hold all n elements.",
      "cost": "O(n)",
      "dimension": "space"
    },
    {
      "lines": [
        20,
        21
      ],
      "description": "Build project entries and heapify requirements.",
      "cost": "O(p)",
      "dimension": "time"
    },
    {
      "lines": [
        24,
        25,
        26,
        29
      ],
      "description": "Transfer each project at most once and select at most min(k,p) profits; loop checks add O(k) upper bound.",
      "cost": "O(p log(p+1) + k)",
      "dimension": "time"
    },
    {
      "lines": [
        20,
        22
      ],
      "description": "Unchosen projects occupy eligibility or available heaps, O(p) total.",
      "cost": "O(p)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Comparisons are O(1).",
    "Lower half is a max-heap via negation.",
    "The size invariant is preserved every insert.",
    "Comparisons and bounded-size numeric operations cost O(1). Heap sifting costs O(log(size+1)); Python list resizing is amortized across operations, so an individual resizing operation can cost O(size).",
    "IPO capital/profits arrays have equal lengths; k is an integer >=0; wealth, requirements and profits are nonnegative bounded integers. Projects are distinct and selectable once."
  ],
  "tradeoffs": "A balanced BST / order-statistic tree also tracks partition points in O(log n) and additionally supports deletions cleanly; the two-heap approach is simpler and gives O(1) boundary reads but plain heaps don't support arbitrary deletion (needed for sliding-window median, which uses lazy deletion).",
  "counters": [],
  "fixedDataNote": "This run inserts 4 values; the halves end balanced (2 and 2) with boundary values 20 and 30. The O(log n) insert / O(1) read bounds generalise to n."
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
    "explanation": "Comment: split into lower/upper halves with two heaps."
  },
  {
    "line": 4,
    "executable": false,
    "explanation": "Comment continues."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "small: max-heap (negated) for the lower half."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "large: min-heap for the upper half."
  },
  {
    "line": 7,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Insert each value with the three-step balancing."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Step 1: push into the lower half (as -x)."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Step 2: move small's max into large so the value lands correctly."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Step 3: if large outgrew small..."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "...move large's min back to small to rebalance."
  },
  {
    "line": 13,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Sizes are balanced → 2 2."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "The boundary values are small's max (20) and large's min (30)."
  },
  {
    "line": 16,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 17,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 18,
    "executable": false,
    "explanation": "Comment: these heaps track eligibility and profit, rather than median halves."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "Define selection for nonnegative project profits and required starting capital."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Pair each minimum-capital requirement with its project index."
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "Build the eligibility min-heap in linear time."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "The eligible-profit max-heap starts empty."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "Choose at most k distinct projects."
  },
  {
    "line": 24,
    "executable": true,
    "explanation": "Move every remaining project currently affordable, including equal requirements."
  },
  {
    "line": 25,
    "executable": true,
    "explanation": "Remove an eligible project and retain its index for profit lookup."
  },
  {
    "line": 26,
    "executable": true,
    "explanation": "Use the native Python 3.14 max-heap to retain that project's pure profit."
  },
  {
    "line": 27,
    "executable": true,
    "explanation": "If no project is affordable, no further capital increase is possible."
  },
  {
    "line": 28,
    "executable": true,
    "explanation": "Stop before selecting more projects."
  },
  {
    "line": 29,
    "executable": true,
    "explanation": "Choose the greatest affordable profit and add it; required capital is a threshold, not a payment."
  },
  {
    "line": 30,
    "executable": true,
    "explanation": "Return final wealth, also handling no projects or k=0."
  },
  {
    "line": 31,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 32,
    "executable": true,
    "explanation": "Project 0 unlocks the other two; choose profit 3 next, printing final wealth 4."
  }
],

  bindings: [
  {
    "variable": "small",
    "model": "heap"
  },
  {
    "variable": "large",
    "model": "heap"
  },
  {
    "variable": "projects",
    "model": "heap"
  },
  {
    "variable": "available",
    "model": "heap"
  },
  {
    "variable": "capital",
    "model": "array"
  },
  {
    "variable": "profits",
    "model": "array"
  }
],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "What signals that a problem fits the balanced median form of two heaps?",
    "answer": "When you need fast, repeated access to the boundary/partition between a smaller half and a larger half of a CHANGING dataset (e.g. the median), rather than full sorted order.",
    "explanation": "The pattern shines when only the dividing value matters and the data mutates: two opposing balanced heaps expose that boundary at their roots in O(1) with O(log n) inserts, avoiding full re-sorting."
  }
],

  experiments: [
  "Print the sizes and roots after each insert to watch the balance invariant hold.",
  "Compute the median from the roots (this pattern IS the running-median engine).",
  "Step through maximize_capital and watch the requirement min-heap feed the native profit max-heap. The two heap sizes do not need to match.",
  "In the IPO code, try no affordable project, k=0, duplicate capital requirements, and zero profits. Print wealth after each choice; contrast transferring all affordable candidates with moving just one."
],

  exercises: [
  {
    "id": "twoheap-choose-1",
    "kind": "choose-approach",
    "prompt": "Which of these fit the two-heap pattern: (a) find the kth largest, (b) running median of a stream, (c) merge k sorted lists?",
    "expected": "(b) running median — it needs the boundary between the lower and upper halves. (a) is a single size-k heap; (c) is a k-way merge (heap of fronts). Only (b) uses two opposing balanced heaps.",
    "hints": [
      "Goal: identify which problem fits the two-heap pattern.",
      "The trap is that all involve heaps; only one needs a moving partition between halves.",
      "Key insight: the running median needs the boundary between the lower and upper halves of a changing set.",
      "Approach: use two opposing balanced heaps for the median; other problems use a single heap.",
      "Pseudocode: low max-heap + high min-heap kept balanced expose the middle at their roots.",
      "Answer: (b) running median uses two heaps; (a) kth largest is one bounded heap and (c) merge k lists is a heap of fronts."
    ],
    "recognition": {
      "scenario": "Which fit the two-heap pattern: (a) find the kth largest, (b) running median of a stream, (c) merge k sorted lists? This drill is about identifying (b).",
      "approaches": [
        {
          "id": "two-heaps",
          "label": "Two opposing balanced heaps",
          "requiredReasonIds": [
            "half-boundary"
          ]
        },
        {
          "id": "single-heap",
          "label": "Single size-k heap",
          "requiredReasonIds": [],
          "rejectionFeedback": "That is the tool for (a): one extreme via a single heap, not the half-boundary a median needs."
        },
        {
          "id": "kway-merge",
          "label": "K-way merge (heap of fronts)",
          "requiredReasonIds": [],
          "rejectionFeedback": "That is the tool for (c): merging k sorted sequences, not tracking a running median."
        }
      ],
      "reasons": [
        {
          "id": "half-boundary",
          "text": "Problem (b), the running median, needs the boundary between the lower and upper halves — exactly what two opposing balanced heaps maintain."
        },
        {
          "id": "one-extreme",
          "text": "You only need one extreme value, so a single heap is enough.",
          "contradictory": true
        },
        {
          "id": "merge-sequences",
          "text": "You are merging several sorted sequences into one.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "two-heaps"
      ],
      "modelExplanation": "(b) running median uses two heaps to hold the half-boundary. (a) is a single size-k heap; (c) is a k-way merge — only (b) balances two opposing heaps."
    }
  },
  {
    "id": "twoheap-fix-1",
    "kind": "fix-mistake",
    "prompt": "Complete `insert(small, large, x)`: push x into the two-heap structure (small is a max-heap via negation, large a min-heap). This skips the rebalance, so the boundary drifts off the roots. Add the missing step.",
    "starterCode": "import heapq\ndef insert(small, large, x):\n    heapq.heappush(small, -x)\n    heapq.heappush(large, -heapq.heappop(small))",
    "expected": "import heapq\ndef insert(small, large, x):\n    heapq.heappush(small, -x)\n    heapq.heappush(large, -heapq.heappop(small))\n    if len(large) > len(small):\n        heapq.heappush(small, -heapq.heappop(large))",
    "hints": [
      "Goal: fix the two-heap insert so the median stays on the heap roots.",
      "The missing rebalance lets large outgrow small, so the boundary drifts off the roots.",
      "Key insight: after pushing to small and shifting its max to large, large can exceed small and must be trimmed.",
      "Approach: move large's minimum back to small whenever large is bigger.",
      "Pseudocode: push -x to small; push -pop(small) to large; if len(large) > len(small): push -pop(large) to small.",
      "Add `if len(large) > len(small): heapq.heappush(small, -heapq.heappop(large))`."
    ],
    "tests": "import heapq\ndef _median(small, large):\n    if len(small) == len(large):\n        return (-small[0] + large[0]) / 2\n    return float(-small[0])\n# A single insert must land in small with large empty.\nsm, lg = [], []\ninsert(sm, lg, 7)\nassert len(sm) == 1 and len(lg) == 0, f'one insert seeds small, got small={sm} large={lg}'\n# After each insert the heaps stay balanced (small never smaller than large).\nsm, lg = [], []\nfor v in [5, 15, 1, 3]:\n    insert(sm, lg, v)\n    assert len(sm) >= len(lg), f'small must not be smaller than large (buggy skips rebalance), got small={sm} large={lg}'\n    assert len(sm) - len(lg) <= 1, 'heaps differ by at most one'\nassert _median(sm, lg) == 4.0, f'median of [1,3,5,15] is 4.0, got {_median(sm, lg)}'\nsm2, lg2 = [], []\nfor v in [2, 1, 3]:\n    insert(sm2, lg2, v)\nassert _median(sm2, lg2) == 2.0, 'median of [1,2,3] is 2'\nprint('OK')"
  },
  {
    "id": "twoheap-ipo-predict-1",
    "kind": "predict-state",
    "prompt": "For capital requirements [0,1,1], pure profits [1,2,3], initial wealth 0 and at most two projects, which projects are chosen and what wealth is returned? Does the required capital get subtracted?",
    "expected": "Choose project 0 first, adding profit 1 to reach wealth 1. Both remaining projects are now eligible; choose project 2 with profit 3. Final wealth is 4. Required capital is a starting threshold, not a cost deducted from wealth.",
    "hints": [
      "At wealth 0, only requirement 0 is affordable.",
      "Finishing that project adds its pure profit 1.",
      "At wealth 1 both remaining projects qualify.",
      "The available max-heap chooses the greatest profit, 3.",
      "Pseudocode: transfer all requirements <=wealth; add maximum eligible profit; repeat at most twice.",
      "Return 4: 0+1+3. Requirements gate eligibility and are not subtracted. These heaps do not need balanced sizes."
    ]
  }
],

  review: "For medians, maintain both ordering and size invariants: the lower max-heap and upper min-heap expose the middle in O(1), with O(log(n+1)) amortized insertion. Portable negation and Python 3.14 native max APIs are both supported. IPO uses a different invariant: all affordable unchosen projects move into a profit max-heap, then the greatest nonnegative gain is chosen. Its requirement threshold is not a payment, and its heap sizes are not balanced.",

  expectedOutput: "2 2\n20 30\n4\n",

  references: [
  {
    "url": "https://docs.python.org/3.14/library/heapq.html",
    "title": "Python 3.14: heapq",
    "section": "Heap invariant; max-heap APIs; merge; nlargest; priority queue notes; other applications",
    "topic": "two-heap-pattern",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Median partition roots use a max lower half and min upper half."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Use Python 3.14.2 zero-based heapq lists. Unqualified functions are min-oriented; native *_max APIs exist. Median examples deliberately use portable negation."
    ]
  },
  {
    "url": "https://leetcode.com/problems/ipo/description/",
    "title": "LeetCode: IPO problem",
    "section": "Project eligibility, nonnegative pure profits, at most k projects",
    "topic": "two-heap-pattern",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "IPO adds nonnegative pure profits and permits at most k distinct affordable projects."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Nonnegative pure profits, nonnegative capital thresholds, distinct projects selected once, at most k choices. Required capital gates eligibility and is not deducted."
    ]
  },
  {
    "url": "https://opendatastructures.org/ods-python/10_1_BinaryHeap_Implicit_Bi.html",
    "title": "Open Data Structures: BinaryHeap",
    "section": "10.1 indexing; add/remove; resizing amortization; Figures 10.1–10.3",
    "topic": "two-heap-pattern",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Heap sifting and resizing qualify update costs."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Both source and app use zero-based array indices, children 2i+1 and 2i+2, and parent (i-1)//2 for i>0. Resizing is accounted for amortized."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "b085653b41869d2c",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
