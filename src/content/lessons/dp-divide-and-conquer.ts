/**
 * Lesson: Recursion — divide and conquer (max subarray) (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "6\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Divide and conquer: max subarray sum. Split in half; the best subarray is
# entirely LEFT, entirely RIGHT, or CROSSES the midpoint.
def max_subarray(nums):
    if not nums:
        raise ValueError("a nonempty subarray requires a nonempty input")
    def helper(lo, hi):
        if lo == hi:                 # base case: one element
            return nums[lo]
        mid = (lo + hi) // 2
        left = helper(lo, mid)       # best fully in the left half
        right = helper(mid + 1, hi)  # best fully in the right half
        s = 0                        # best sum ending at mid, extending left
        left_best = nums[mid]
        for i in range(mid, lo - 1, -1):
            s += nums[i]
            left_best = max(left_best, s)
        s = 0                        # best sum starting at mid+1, extending right
        right_best = nums[mid + 1]
        for i in range(mid + 1, hi + 1):
            s += nums[i]
            right_best = max(right_best, s)
        cross = left_best + right_best  # best subarray crossing the midpoint
        return max(left, right, cross)
    return helper(0, len(nums) - 1)

print(max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))   # subarray [4,-1,2,1] -> 6`;

export const dpDivideAndConquer: LessonDefinition = {
  id: "dp-divide-and-conquer",
  title: "Recursion: Divide and Conquer",
  area: "DP and recursion",
  prerequisites: ["dp-recursive-calls", "merge-sort"],

  explanation: `**Divide and conquer** solves a problem by three steps: **divide** it into smaller independent subproblems, **conquer** each by recursion, and **combine** their answers into the whole answer. Merge sort is the archetype (split, sort halves, merge). Here we apply the paradigm to the **maximum subarray sum**: find the contiguous slice with the largest total.

Split the array at its midpoint. The maximum subarray is then in exactly one of **three** cases: it lies **entirely in the left half**, **entirely in the right half**, or it **crosses the midpoint**. The first two are solved by **recursion** on each half. The crossing case is handled directly: from the midpoint, scan **leftward** to find the best sum ending at \`mid\`, scan **rightward** for the best sum starting at \`mid+1\`, and add them — a crossing subarray must include both \`nums[mid]\` and \`nums[mid+1]\`. The answer at each level is the **max of the three**. The base case is a single element. For \`[-2,1,-3,4,-1,2,1,-5,4]\` the best subarray is \`[4,-1,2,1]\` summing to **6**.

The cost follows the classic recurrence **T(n) = 2·T(n/2) + O(n)**: two half-size recursive calls plus an O(n) crossing scan per level. By the master theorem this is **O(n log n)** time, with **O(log n)** recursion-stack space. That's the teaching point about divide-and-conquer analysis: **count the work per level and the number of levels**. (Note: this same problem has an **O(n)** solution — Kadane's algorithm — so divide-and-conquer isn't always optimal; it's chosen here to make the paradigm and its recurrence concrete.) The "combine step does real work" structure — as opposed to backtracking, where the work is in exploring choices — is what distinguishes divide-and-conquer, and it recurs in merge sort, quickselect, closest-pair, and fast multiplication.`,

  vocabulary: [
    { term: "Divide and conquer", definition: "Split into independent subproblems, solve recursively, then combine the results." },
    { term: "Combine step", definition: "The work that merges subproblem answers (here, the crossing-subarray computation)." },
    { term: "Crossing case", definition: "A solution spanning the split point, needing both halves' contributions." },
    { term: "Recurrence T(n)=2T(n/2)+O(n)", definition: "Two half-size calls plus linear combine work per level → O(n log n)." },
    { term: "Master theorem", definition: "A rule for solving common divide-and-conquer recurrences." },
  ],

  concepts: {
  "purpose": "Teach the divide/conquer/combine paradigm and how to analyze its recurrence, via maximum subarray.",
  "operations": "Split at the midpoint; recurse on both halves; compute the best crossing subarray; return the max of the three.",
  "uses": "Merge sort, quickselect, binary search, closest pair of points, Karatsuba multiplication, many geometry algorithms.",
  "tradeoffs": "Clean recurrence and parallelizable, but the combine step and recursion have overhead; some problems have a faster non-recursive solution (here Kadane's O(n)).",
  "commonMistakes": "Forgetting the crossing case (missing the true maximum); wrong midpoint split of the crossing scans; base case that doesn't handle a single element; comparing only left and right.",
  "edgeCases": "Empty input raises ValueError because a nonempty subarray is required. A singleton returns its value. For all-negative input, the answer is the largest element, not an empty sum of zero."
},

  complexity: [
  {
    "operation": "max subarray (divide & conquer)",
    "best": "O(n*log(n+1))",
    "average": "O(n*log(n+1))",
    "worst": "O(n*log(n+1))",
    "space": "O(log(n+1))",
    "note": "Inclusive lo..hi ranges; no slices; constant singleton case included."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in nums"
    }
  ],
  "costModel": "Splitting is O(1); each level's crossing scans do O(n) total work; there are O(log n) levels of recursion.",
  "time": {
    "bound": "O(n*log(n+1))",
    "case": "worst",
    "explanation": "Each non-base range splits into two disjoint halves and scans its own size to combine: T(n)=T(ceil(n/2))+T(floor(n/2))+O(n). Balanced levels contribute O(n) each, giving O(n log(n+1)); n=1 takes O(1)."
  },
  "space": {
    "bound": "O(log(n+1))",
    "case": "worst",
    "explanation": "Inclusive index ranges halve without slicing. At most O(log(n+1)) frames are active, each retaining a constant number of scalar locals.",
    "inputOutputNote": "The single best-sum integer is O(1); the O(log n) is the recursion stack."
  },
  "derivation": [
    {
      "lines": [
        7,
        8
      ],
      "description": "Base case: a single element is returned directly.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        10,
        11
      ],
      "description": "Two recursive calls on halves — the 2·T(n/2) term.",
      "cost": "2·T(n/2)",
      "dimension": "time"
    },
    {
      "lines": [
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21
      ],
      "description": "Crossing scans are O(size) per level — the +O(n) term.",
      "cost": "O(n) per level",
      "dimension": "time"
    },
    {
      "lines": [
        6
      ],
      "description": "Recursion depth O(log n) with O(1) frames.",
      "cost": "O(log n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "The array is non-empty (the outer call passes a valid range).",
    "The maximum subarray is left-only, right-only, or crossing — an exhaustive split.",
    "Additions/max are O(1).",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "Divide and conquer here is O(n log n); Kadane's algorithm solves the same problem in O(n) time and O(1) space. The D&C version is used to teach the paradigm and its recurrence, not because it is optimal.",
  "counters": [
    {
      "label": "child calls",
      "definition": "Entries to both left and right child-call assignments; excludes the outer initial helper call. Recorded line entries at 10, 11 occur before the operation completes.",
      "countLines": [
        10,
        11
      ]
    },
    {
      "label": "crossing elements examined",
      "definition": "Entries to sum updates in both left and right crossing scans. Recorded line entries at 15, 20 occur before the operation completes.",
      "countLines": [
        15,
        20
      ]
    }
  ],
  "fixedDataNote": "For the 9-element sample the best subarray is [4,-1,2,1] = 6. The O(n log n) bound describes how the split-and-combine work scales with n. Function analysis excludes demonstration input literals, imports, printing and tracer storage. A line event shows the next operation before it completes."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: split in half; three cases for the best subarray."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Comment continued."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Define max_subarray(nums)."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Check the domain for a nonempty maximum-subarray problem."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Reject empty input instead of recursing on an invalid range."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Inner recursive helper over the index range [lo, hi]."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Base case: a single element."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Return that element's value."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Split point."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Recurse: best subarray entirely in the left half."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Recurse: best subarray entirely in the right half."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Prepare to scan left from the midpoint."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Seed the left crossing best with nums[mid]."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Scan leftward from mid down to lo."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Accumulate the running sum..."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "...tracking the best sum ending at mid."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Prepare to scan right from mid+1."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "Seed the right crossing best with nums[mid+1]."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "Scan rightward from mid+1 to hi."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Accumulate the running sum..."
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "...tracking the best sum starting at mid+1."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "The crossing subarray's best is the two halves' bests added."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "Return the maximum of left-only, right-only, and crossing."
  },
  {
    "line": 24,
    "executable": true,
    "explanation": "Kick off the recursion over the whole array."
  },
  {
    "line": 25,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 26,
    "executable": true,
    "explanation": "Best subarray of the sample is [4,-1,2,1] summing to 6."
  }
],

  bindings: [
  {
    "variable": "nums",
    "model": "array",
    "range": {
      "label": "current inclusive subproblem",
      "startSource": "lo",
      "endSource": "hi",
      "endInclusive": true
    },
    "overlays": [
      {
        "role": "pointer",
        "label": "mid",
        "source": "mid"
      }
    ]
  },
  {
    "variable": "lo",
    "model": "recursion"
  }
],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "Why must we handle a 'crossing' case separately instead of just taking max(left, right)?",
      answer: "The optimal subarray might straddle the midpoint — using elements from both halves — which neither the left-only nor right-only recursion considers. The crossing scan computes that spanning case so no candidate is missed.",
      explanation: "Splitting the array leaves a third possibility the halves can't see: a subarray crossing the split. Ignoring it can miss the true maximum.",
    },
  ],

  experiments: [
    "Print lo, hi, and the three candidate values at each level to watch the combine step.",
    "Solve the same problem with Kadane's algorithm in O(n) and compare results.",
    "Draw the recursion tree and confirm O(log n) depth and O(n) work per level.",
  ],

  exercises: [
    {
      id: "dpdc-complete-1",
      kind: "complete-code",
      prompt: "Complete `max_subarray(nums)` (divide & conquer): return the maximum subarray sum. Fill the combine step that returns the best of left-only, right-only, and crossing.",
      starterCode:
        "def max_subarray(nums):\n    def helper(lo, hi):\n        if lo == hi:\n            return nums[lo]\n        mid = (lo + hi) // 2\n        left = helper(lo, mid)\n        right = helper(mid + 1, hi)\n        # crossing sum through the middle\n        s = 0; left_best = nums[mid]\n        for k in range(mid, lo - 1, -1):\n            s += nums[k]; left_best = max(left_best, s)\n        s = 0; right_best = nums[mid + 1]\n        for k in range(mid + 1, hi + 1):\n            s += nums[k]; right_best = max(right_best, s)\n        cross = left_best + right_best\n        # TODO: return the best of the three cases\n        pass\n    return helper(0, len(nums) - 1)",
      expected:
        "def max_subarray(nums):\n    def helper(lo, hi):\n        if lo == hi:\n            return nums[lo]\n        mid = (lo + hi) // 2\n        left = helper(lo, mid)\n        right = helper(mid + 1, hi)\n        # crossing sum through the middle\n        s = 0; left_best = nums[mid]\n        for k in range(mid, lo - 1, -1):\n            s += nums[k]; left_best = max(left_best, s)\n        s = 0; right_best = nums[mid + 1]\n        for k in range(mid + 1, hi + 1):\n            s += nums[k]; right_best = max(right_best, s)\n        cross = left_best + right_best\n        return max(left, right, cross)\n    return helper(0, len(nums) - 1)",
      hints: [
        "Three candidates: left-only, right-only, crossing.",
        "Return the largest.",
        "return max(left, right, cross)",
      ],
    },
    {
      id: "dpdc-choose-1",
      kind: "choose-approach",
      prompt: "You need maximum subarray sum on a huge array with tight time limits. Divide-and-conquer O(n log n) or Kadane's O(n)?",
      expected: "Kadane's O(n): it's asymptotically faster and O(1) space. Divide-and-conquer (O(n log n)) is great for teaching the paradigm but not the fastest here.",
      hints: [
        "Compare O(n log n) vs O(n).",
        "One is linear.",
        "Kadane wins on speed and space.",
      ],
    },
    {
      id: "dpdc-predict-1",
      kind: "predict-state",
      prompt: "For [-2,1,-3,4,-1,2,1,-5,4], which contiguous subarray is optimal and what is its sum?",
      expected: "[4, -1, 2, 1] with sum 6.",
      hints: [
        "Look near the 4 in the middle.",
        "Include the small negatives that pay off.",
        "4 - 1 + 2 + 1 = 6.",
      ],
    },
  ],

  review: `**Divide and conquer** = **divide** into subproblems, **conquer** by recursion, **combine** the results. Maximum subarray splits at the midpoint into three cases — **left-only, right-only, crossing** — recursing on the halves and computing the crossing directly, returning their max. Its recurrence **T(n)=2T(n/2)+O(n)** gives **O(n log n)** time, **O(log n)** stack. The combine step doing real work is the paradigm's signature (contrast backtracking). Note Kadane solves the same in **O(n)**. The sample's best is **6**.`,

  expectedOutput: "6\n",

  references: [
  {
    "url": "https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex",
    "title": "Python 3.14 numeric types",
    "section": "Numeric Types — int, float, complex",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage."
    ],
    "conventions": [
      "Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://courses.ics.hawaii.edu/ics311_f26/Notes/Topic-07.html",
    "title": "University of Hawaii ICS311: divide and conquer",
    "section": "Maximum subarray; FIND-MAX-CROSSING-SUBARRAY; recursion-tree analysis",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "A maximum nonempty subarray lies left, right, or across the split; crossing is suffix-left plus prefix-right; recurrence gives O(n log n)."
    ],
    "conventions": [
      "App uses inclusive 0-based lo..hi; right half starts at mid+1. It returns a sum and rejects empty inputs. The source also notes a linear alternative."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "5805ae7a93140f75",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
