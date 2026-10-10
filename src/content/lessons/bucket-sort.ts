/**
 * Lesson: Bucket sort (Sorting). Verified on CPython 3.14.
 * Output: "[3, 9, 21, 25, 29, 37, 43, 49]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Bucket sort: scatter into ranges, sort each bucket, concatenate.
def bucket_sort(a, k=5):
    if not a:
        return []
    buckets = [[] for _ in range(k)]
    hi = max(a) + 1
    for x in a:
        idx = x * k // hi              # which bucket does x fall in?
        buckets[idx].append(x)
    out = []
    for b in buckets:
        out.extend(sorted(b))          # sort each small bucket
    return out

print(bucket_sort([29, 25, 3, 49, 9, 37, 21, 43]))`;

export const bucketSort: LessonDefinition = {
  id: "bucket-sort",
  title: "Bucket Sort",
  area: "Sorting",
  prerequisites: ["counting-sort"],

  explanation: "**Bucket sort** scatters values into ordered range buckets, sorts each bucket and concatenates them. This implementation accepts nonnegative integers and a positive integer bucket count k. It maps x to `x*k//(max(a)+1)`, so bucket order follows value order and indices stay in 0..k−1. Floating-point inputs need a different mapping returning an integer index.\n\nLet b_i be the size of bucket i. Python `sorted` sorts each bucket in worst-case O(b_i log(b_i + 1)) time. Including distribution, max, bucket creation and gathering, this code costs O(n + k + sum(b_i log(b_i + 1))), bounded by O(n log n + k). A quadratic inner sort is a separate variant; this code uses Python's sort.\n\nExpected linear time requires both independent roughly uniform bucket occupancy and k = Θ(n), so expected bucket sizes stay constant. The default k=5 is fixed: even uniform inputs leave growing buckets as n grows, so uniformity alone does not justify O(n). Creating excessive buckets can itself dominate. Clustered data may concentrate into one bucket, whose Python sort still has an O(n log n) worst-case bound.",

  vocabulary: [
    { term: "Bucket sort", definition: "Scattering elements into range-buckets, sorting each, and concatenating." },
    { term: "Bucket", definition: "A sublist holding elements from one sub-range of values." },
    { term: "Uniform distribution", definition: "Values spread evenly, so buckets stay small (the good case)." },
    { term: "Distribution sort", definition: "A sort whose speed depends on how the data is distributed." },
  ],

  concepts: {
  "purpose": "Scatter by value range, then sort smaller buckets; expected linear variants need k proportional to n and a suitable distribution.",
  "operations": "Map each value to a bucket; sort buckets; concatenate in order.",
  "uses": "Uniformly-distributed floats/integers, sorting values in a known bounded range.",
  "tradeoffs": "Python sorted gives O(n log n + k) worst time; a k=Θ(n) layout with independent near-uniform occupancy can be expected O(n).",
  "commonMistakes": "Assuming linear worst case (it isn't); bad bucket count/mapping causing skew; forgetting to sort within buckets.",
  "edgeCases": "Empty input returns []; nonempty input requires nonnegative integers and positive integer k. All-zero input maps to bucket 0. Floats need an integer-index mapping; negative input is outside this implementation's contract."
},

  complexity: [
  {
    "operation": "Shown bucket sort with Python sorted",
    "best": "O(n + k)",
    "worst": "O(n log n + k)",
    "space": "O(n + k)",
    "note": "Expected O(n + k) requires independent near-uniform occupancy and k = Θ(n); k=5 alone does not establish it."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements"
    },
    {
      "symbol": "k",
      "meaning": "the number of buckets"
    }
  ],
  "costModel": "Constant-time bounded-integer arithmetic for indexing; O(n) max/scatter/gather, O(k) bucket creation/visiting, and worst-case O(b_i log(b_i + 1)) for Python sorted on each bucket.",
  "time": {
    "bound": "O(n log n + k)",
    "case": "worst",
    "explanation": "Create/visit k buckets, find max and scatter n values, and sort each bucket with Python sorted. Summing bucket sort work is O(n + k + Σ b_i log(b_i + 1)), at most O(n log n + k). A fixed k does not guarantee expected linear work even for uniform input.",
    "otherCases": [
      {
        "case": "best",
        "bound": "O(n + k)",
        "note": "Each bucket is already ordered or bounded in size; creation and distribution remain linear."
      },
      {
        "case": "expected",
        "bound": "O(n + k)",
        "note": "Requires k = Θ(n) and independent roughly uniform bucket occupancy."
      }
    ]
  },
  "space": {
    "bound": "O(n + k)",
    "case": "worst",
    "explanation": "The k buckets together hold all n elements, so storage is O(n + k).",
    "inputOutputNote": "The buckets and output hold the n elements; the input is separate."
  },
  "derivation": [
    {
      "lines": [
        7,
        8,
        9
      ],
      "description": "Scatter all n elements into buckets — O(n).",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        11,
        12
      ],
      "description": "Sum Python sorted costs across bucket sizes; worst-case one unsorted bucket dominates at O(n log n).",
      "cost": "O(n log n + k)",
      "dimension": "time"
    },
    {
      "lines": [
        5
      ],
      "description": "k buckets holding n elements total.",
      "cost": "O(n + k)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "a contains nonnegative integers; k is a positive integer. Empty input returns [].",
    "The index x*k//(max(a)+1) is an integer in [0,k) and preserves value-range order.",
    "Expected linear time additionally requires k = Θ(n) and independent near-uniform bucket occupancy; the fixed default k=5 does not satisfy this as n grows.",
    "Python sorted uses O(b log b) worst-case time and O(b) working memory on b items; compare constant-size keys."
  ],
  "tradeoffs": "This code has a comparison-sort bound even on skewed data. A k≈n bucket layout can exploit suitable input distribution for expected linear work; a fixed small k usually cannot. Counting sort exploits a small integer domain rather than a distribution assumption.",
  "counters": [
    {
      "label": "elements scattered",
      "definition": "executions of the scatter append (line 9)",
      "countLines": [
        9
      ]
    }
  ],
  "fixedDataNote": "The 8 sample integers use k=5 and print in ascending order. This tiny sample does not prove expected linear growth; that expectation needs bucket count scaling with n and a specified random input model. Function/query analysis excludes demonstration input literal creation and printing."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: scatter, sort buckets, concatenate."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define bucket_sort with k buckets."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Handle empty input."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Return []."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Create k empty buckets."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "hi bounds the value range for the mapping."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Scatter each element..."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "...computing its bucket index by scaling into [0, k)."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Append x to its bucket."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Prepare the output."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "For each bucket in value order..."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Sort this bucket with Python sorted, then append its values. The cost depends on its size and existing order."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Return the concatenated sorted result."
  },
  {
    "line": 14,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Sort the sample → [3, 9, 21, 25, 29, 37, 43, 49]."
  }
],

  bindings: [
  {
    "variable": "a",
    "model": "array"
  },
  {
    "variable": "buckets",
    "model": "matrix"
  },
  {
    "variable": "out",
    "model": "array"
  }
],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "Does a uniform input alone make this default k=5 implementation expected O(n)? What is its worst bound?",
    "answer": "No. For expected linear work, k must grow like n and occupancy must be suitably uniform/independent. This version uses Python sorted, so its worst bound is O(n log n + k).",
    "explanation": "With fixed k, bucket sizes grow with n. A single bucket is sorted by Python sorted, which has a logarithmic comparison-sort bound rather than a quadratic inner sort."
  }
],

  experiments: [
    "Feed clustered values (all near one number) and reason about the skewed worst case.",
    "Change k and observe how bucket sizes change.",
    "Adapt it to sort floats in [0, 1) by scaling the index differently.",
  ],

  exercises: [
  {
    "id": "buck-choose-1",
    "kind": "choose-approach",
    "prompt": "You have a million floats uniformly distributed in [0, 1). Why might bucket sort beat an O(n log n) comparison sort here? Use k proportional to n and an integer index floor(x*k) for this float variant; assume independent uniform samples.",
    "expected": "With k=Θ(n) and independent uniform samples, expected bucket occupancy is constant and the total sort can be expected O(n). For floats use an integer index floor(x*k); the shown integer mapping must be adapted. Fixed k=5 does not justify this bound.",
    "hints": [
      "Goal: judge why bucket sort might beat an O(n log n) comparison sort for a million floats uniformly distributed in [0, 1).",
      "A general comparison sort has O(n log n) worst-case work; this explicit independent uniform input model and k proportional to n support a lower expected bucket-sort bound.",
      "Uniform independent samples and k proportional to n give constant expected occupancy per bucket.",
      "Use k=Θ(n) equal-width float buckets and an integer floor(x*k) index, then sort and concatenate.",
      "With k=Θ(n) and independent uniform samples, expected bucket occupancy is constant and the total sort can be expected O(n). For floats use an integer index floor(x*k); the shown integer mapping must be adapted. Fixed k=5 does not justify this bound.",
      "With k=Θ(n) and independent uniform samples, expected bucket occupancy is constant and the total sort can be expected O(n). For floats use an integer index floor(x*k); the shown integer mapping must be adapted. Fixed k=5 does not justify this bound."
    ],
    "recognition": {
      "scenario": "You have a million floats uniformly distributed in [0, 1). Why might bucket sort beat an O(n log n) comparison sort here? Use k proportional to n and an integer index floor(x*k) for this float variant; assume independent uniform samples.",
      "approaches": [
        {
          "id": "bucket-sort",
          "label": "Bucket sort",
          "requiredReasonIds": [
            "uniform-small-buckets"
          ]
        },
        {
          "id": "comparison-sort",
          "label": "An O(n log n) comparison sort",
          "requiredReasonIds": [],
          "rejectionFeedback": "A comparison sort is correct and robust; this drill highlights the better expected bound available under the explicit random-input and bucket-count assumptions."
        }
      ],
      "reasons": [
        {
          "id": "uniform-small-buckets",
          "text": "With k=Θ(n) and independent uniform samples, expected bucket occupancy is constant and the total sort can be expected O(n). For floats use an integer index floor(x*k); the shown integer mapping must be adapted. Fixed k=5 does not justify this bound."
        },
        {
          "id": "distribution-irrelevant",
          "text": "Bucket sort's speed does not depend on how the data is distributed.",
          "contradictory": true
        },
        {
          "id": "comparison-beats-linear",
          "text": "Uniform data guarantees an O(n) worst-case comparison sort on arbitrary inputs.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "bucket-sort"
      ],
      "modelExplanation": "With k=Θ(n) and independent uniform samples, expected bucket occupancy is constant and the total sort can be expected O(n). For floats use an integer index floor(x*k); the shown integer mapping must be adapted. Fixed k=5 does not justify this bound."
    }
  },
  {
    "id": "buck-predict-1",
    "kind": "predict-state",
    "prompt": "What is the worst-case time of the SHOWN implementation, with Python sorted in each bucket? Contrast a quadratic-inner-sort variant.",
    "expected": "O(n log n + k) for this implementation: bucket creation costs O(k) and an arbitrary unsorted cluster in one bucket can require O(n log n). A separate version using insertion sort inside one bucket can take O(n² + k).",
    "hints": [
      "Identify the actual inner sort: this code uses Python sorted.",
      "Python sorted has O(b log b) worst-case work on b bucket values; creating k buckets adds O(k).",
      "O(n log n + k) for this implementation: bucket creation costs O(k) and an arbitrary unsorted cluster in one bucket can require O(n log n). A separate version using insertion sort inside one bucket can take O(n² + k)."
    ]
  }
],

  review: "Bucket sort partitions ordered value ranges and sorts each bucket. The shown nonnegative-integer implementation uses Python sorted, giving O(n log n + k) worst time and O(n + k) auxiliary space. Expected O(n) requires k=Θ(n) and independent near-uniform bucket occupancy; the fixed k=5 default alone cannot claim it.",

  expectedOutput: "[3, 9, 21, 25, 29, 37, 43, 49]\n",

  references: [
  {
    "url": "https://www-cgrl.cs.mcgill.ca/~godfried/teaching/dm-reading-assignments/Bucket-Sorting-Expected-Complexity.pdf",
    "title": "McGill: Bucket Sorting in Expected Linear Time",
    "section": "Algorithm steps 2–5; uniform-input occupancy analysis",
    "topic": "sorting/bucket",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "The expected-linear theorem uses a number of buckets proportional to n and independent uniform samples."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "The app maps nonnegative integers with max+1 and defaults to fixed k=5, so it does not inherit that expectation."
    ]
  },
  {
    "url": "https://docs.python.org/3.14/howto/sorting.html",
    "title": "sort reference",
    "section": "Sorting basics; Timsort",
    "topic": "sorting/bucket",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Python sort is adaptive and sorts each supplied bucket."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  },
  {
    "url": "https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c",
    "title": "CPython 3.14.2 list implementation",
    "section": "sort implementation, binarysort and merge routines",
    "topic": "sorting/bucket",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Python list sort combines ordered runs with temporary storage."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "6b22322e02d943f8",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
