/**
 * Lesson: Radix sort (Sorting). Verified on CPython 3.14.
 * Output: "[2, 24, 45, 66, 75, 90, 170, 802]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Radix sort: sort by each digit, least-significant first (LSD).
def radix_sort(a):
    if not a:
        return []
    out = a[:]
    exp = 1                         # current digit place: 1, 10, 100, ...
    hi = max(out)
    while hi // exp > 0:            # until we pass the most significant digit
        buckets = [[] for _ in range(10)]   # one bucket per digit 0-9
        for x in out:
            buckets[(x // exp) % 10].append(x)  # stable distribute by digit
        out = []
        for b in buckets:
            out.extend(b)           # gather buckets in order
        exp *= 10                   # move to the next digit
    return out

print(radix_sort([170, 45, 75, 90, 2, 802, 24, 66]))`;

export const radixSort: LessonDefinition = {
  id: "radix-sort",
  title: "Radix Sort",
  area: "Sorting",
  prerequisites: ["counting-sort"],

  explanation: "**Radix sort** sorts integers **one digit at a time** without ever comparing two numbers as wholes. This LSD (least-significant-digit) version passes over the data once per digit place — ones, tens, hundreds — each time distributing numbers into 10 buckets by that digit and then gathering the buckets in order. The magic is that each pass must be **stable** (buckets preserve insertion order), so numbers already ordered by lower digits stay ordered when a higher digit ties. After the most significant digit, the list is fully sorted.\n\nIts cost is **O(d · (n + b))** where `d` is the number of digits and `b` the base (10 here): `d` passes, each a stable counting/bucket distribution of the n numbers over b buckets. When `d` is small (fixed-width integers), this is effectively **O(n)** — beating the O(n log n) comparison-sort bound.\n\nThe trade: it only works on data with a **digit/place structure** (integers, fixed-length strings) and uses **O(n + b)** extra space per pass. The recognition cue is the same as counting sort — \"integer keys\" — but radix handles large value ranges by processing digits, avoiding counting sort's O(hi) blowup.\n\nThis version accepts nonnegative integers only. Zero has one decimal digit by convention, but an all-zero list needs zero distribution passes: the O(n) copy/max initialization already produces the answer. Model digit arithmetic as constant time for bounded-size values; Python integers can be arbitrarily large, so digit division is not constant-time under an unbounded bit-cost model.",

  vocabulary: [
  {
    "term": "Radix sort",
    "definition": "Sorting by processing digits from least to most significant (LSD)."
  },
  {
    "term": "Digit place (exp)",
    "definition": "The place value being examined: 1, 10, 100, …"
  },
  {
    "term": "Stable pass",
    "definition": "A distribution that preserves the order of equal-digit items — essential for correctness."
  },
  {
    "term": "d (digits)",
    "definition": "Maximum decimal digit length, at least 1 for zero; positive max M has floor(log10 M)+1 digits."
  },
  {
    "term": "Base (b)",
    "definition": "How many buckets per pass (10 for decimal digits)."
  }
],

  concepts: {
    purpose: "Sort integers in near-linear time by digit passes, avoiding whole-number comparisons.",
    operations: "Repeat: distribute into base-b buckets by the current digit (stably), gather, move to next digit.",
    uses: "Sorting fixed-width integers, fixed-length strings, keys with large value range but few digits.",
    tradeoffs: "O(d·(n+b)) — near-linear when d is small; needs digit structure and O(n+b) space; each pass must be stable.",
    commonMistakes: "Non-stable digit pass (breaks correctness); MSD/LSD confusion; forgetting negative-number handling; assuming it beats comparison sorts when d is large.",
    edgeCases: "Empty input returns []. Values with different digit counts handled by the exp loop. Zero sorts correctly.",
  },

  complexity: [
    { operation: "Radix sort (LSD)", best: "O(d*(n+b))", average: "O(d*(n+b))", worst: "O(d*(n+b))", space: "O(n+b)", note: "d digits, base b; near-linear when d is small." },
  ],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of integers to sort"
    },
    {
      "symbol": "d",
      "meaning": "Maximum decimal digit length, at least 1; all-zero input runs zero bucket passes but still scans/copies n values."
    },
    {
      "symbol": "b",
      "meaning": "the base / number of buckets (10 here)"
    }
  ],
  "costModel": "Each digit pass distributes n numbers into b buckets (O(n + b)) and gathers them (O(n + b)).",
  "time": {
    "bound": "O(d*(n+b))",
    "case": "worst",
    "explanation": "The copy and max cost O(n). For a positive maximum, d digit passes each distribute/gather n values among b=10 buckets, giving O(d(n+b)). All-zero input performs no passes and costs O(n), within the same upper bound when d is at least 1. For fixed n and positive maximum digit length, input order does not alter the number of passes."
  },
  "space": {
    "bound": "O(n+b)",
    "case": "worst",
    "explanation": "Each pass allocates b buckets holding all n numbers between them — O(n + b) auxiliary space.",
    "inputOutputNote": "The buckets and rebuilt output hold the n numbers; the input is separate."
  },
  "derivation": [
    {
      "lines": [
        8
      ],
      "description": "For a positive maximum the body runs once per digit place; all-zero input runs zero passes.",
      "cost": "O(d)",
      "dimension": "time"
    },
    {
      "lines": [
        9,
        10,
        11,
        13,
        14
      ],
      "description": "Each pass distributes and gathers all n numbers over b buckets: O(n + b).",
      "cost": "O(d*(n+b))",
      "dimension": "time"
    },
    {
      "lines": [
        9
      ],
      "description": "b buckets holding n numbers per pass.",
      "cost": "O(n+b)",
      "dimension": "space"
    },
    {
      "lines": [
        5,
        7
      ],
      "description": "Copying and finding max always scan a nonempty input, including all-zero values.",
      "cost": "O(n)",
      "dimension": "time"
    }
  ],
  "assumptions": [
    "Keys are non-negative integers with a digit structure.",
    "Each digit pass is STABLE (buckets preserve order).",
    "d = number of digits of the max value.",
    "Digit division/modulo/comparison are modeled as O(1) for bounded-size integer keys; arbitrary-precision bit complexity is not included."
  ],
  "tradeoffs": "Counting sort is O(n + hi) but blows up when the value range hi is huge; radix avoids that by processing digits (O(d·(n+b))). Comparison sorts are O(n log n) but need no digit structure.",
  "counters": [
    {
      "label": "distributions",
      "definition": "executions of the bucket append (line 11)",
      "countLines": [
        11
      ]
    }
  ],
  "fixedDataNote": "This run sorts 8 numbers with max 802 (3 digits), so d=3 passes over base 10. The O(d·(n+b)) bound generalises to n numbers of d digits. Function/query analysis excludes demonstration input literal creation and printing."
},

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: sort by each digit, least-significant first." },
    { line: 2, executable: true, explanation: "Define radix_sort(a)." },
    { line: 3, executable: true, explanation: "Handle empty input." },
    { line: 4, executable: true, explanation: "Return []." },
    { line: 5, executable: true, explanation: "Work on a copy." },
    { line: 6, executable: true, explanation: "exp is the current digit place, starting at the ones (1)." },
    { line: 7, executable: true, explanation: "hi is the max value; it decides how many digit passes we need." },
    { line: 8, executable: true, explanation: "Continue while there are still higher digits to process." },
    { line: 9, executable: true, explanation: "Ten buckets, one per digit 0-9." },
    { line: 10, executable: true, explanation: "Distribute each number..." },
    { line: 11, executable: true, explanation: "...by its current digit (x // exp) % 10. Appending keeps the pass stable." },
    { line: 12, executable: true, explanation: "Rebuild the list from the buckets." },
    { line: 13, executable: true, explanation: "Gather buckets in digit order (0..9)." },
    { line: 14, executable: true, explanation: "Concatenate this bucket's contents." },
    { line: 15, executable: true, explanation: "Advance to the next digit place (×10)." },
    { line: 16, executable: true, explanation: "Return the fully sorted list." },
    { line: 17, executable: false, explanation: "Blank line." },
    { line: 18, executable: true, explanation: "Sort the sample → [2, 24, 45, 66, 75, 90, 170, 802]." },
  ],

  bindings: [
  {
    "variable": "out",
    "model": "array"
  },
  {
    "variable": "buckets",
    "model": "matrix"
  }
],

  prediction: [
    { atEventIndex: 0, prompt: "Why must each digit pass in radix sort be STABLE?", answer: "Because when two numbers have the same current digit, they must keep the order established by the lower digits already processed; a non-stable pass would scramble that and break correctness.", explanation: "LSD radix relies on earlier (lower-digit) orderings being preserved through later passes. Stability is what guarantees ties on the current digit retain their prior relative order." },
  ],

  experiments: [
    "Add a print of the list after each digit pass to watch it order by ones, then tens, then hundreds.",
    "Try numbers of very different lengths and confirm the exp loop handles them.",
    "Reason about how many passes d you'd need for 9-digit numbers.",
  ],

  exercises: [
  {
    "id": "rad-choose-1",
    "kind": "choose-approach",
    "prompt": "You must sort a million nonnegative integers ranging up to 1,000,000,000. Counting sort or radix sort, and why?",
    "expected": "Radix sort — counting sort would need an O(hi)=O(10^9) counts array (wasteful). Radix processes ~10 digits: O(d·(n+b)) ≈ O(n), avoiding the huge-range blowup.",
    "hints": [
      "Goal: choose between counting sort and radix sort for a million integers ranging up to 1,000,000,000.",
      "The costly misfit is plain counting sort: it would allocate a counts array of size ~10^9, far larger than n.",
      "Key property: the value range is enormous but each number has only about 10 digits, so the data has few digits even though it has a huge range.",
      "Approach: use radix sort, processing the numbers digit by digit with a small base.",
      "Reasoning: radix runs in O(d·(n+b)) ≈ O(n) with d≈10 digits and small base b, avoiding the O(hi) blowup; counting sort would win only when hi is comparable to n.",
      "Answer: radix sort — counting sort's O(hi)=O(10^9) array is wasteful, while radix's O(d·(n+b)) ≈ O(n) avoids the huge-range blowup."
    ],
    "recognition": {
      "scenario": "You must sort a million nonnegative integers ranging up to 1,000,000,000. Counting sort or radix sort, and why?",
      "approaches": [
        {
          "id": "radix-sort",
          "label": "Radix sort",
          "requiredReasonIds": [
            "digit-passes-avoid-range"
          ]
        },
        {
          "id": "counting-sort",
          "label": "Plain counting sort over the value range",
          "requiredReasonIds": [],
          "rejectionFeedback": "A single counting sort would need an O(hi)=O(10^9) counts array for the billion-wide range — wasteful in time and memory."
        }
      ],
      "reasons": [
        {
          "id": "digit-passes-avoid-range",
          "text": "Radix sort processes ~10 digits with a small base, so it is O(d·(n+b)) ≈ O(n), avoiding the huge O(10^9) counts array that the raw range would require."
        },
        {
          "id": "range-is-small",
          "text": "The value range is small, so a single counting-sort pass is cheap.",
          "contradictory": true
        },
        {
          "id": "radix-needs-comparisons",
          "text": "Radix sort relies on O(n log n) comparisons like a comparison sort.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "radix-sort"
      ],
      "modelExplanation": "Radix sort — counting sort would need an O(hi)=O(10^9) counts array (wasteful). Radix processes ~10 digits: O(d·(n+b)) ≈ O(n), avoiding the huge-range blowup."
    }
  },
  {
    "id": "rad-complete-1",
    "kind": "complete-code",
    "prompt": "Complete `bucketize(nums, exp)` so it returns 10 buckets (lists), placing each x into the bucket for its digit at place `exp`, preserving input order within a bucket. Assume nonnegative integer nums and exp = 10**p for integer p >= 0.",
    "starterCode": "def bucketize(nums, exp):\n    buckets = [[] for _ in range(10)]\n    for x in nums:\n        # TODO: append x to the bucket for its current digit\n        pass\n    return buckets",
    "expected": "def bucketize(nums, exp):\n    buckets = [[] for _ in range(10)]\n    for x in nums:\n        buckets[(x // exp) % 10].append(x)\n    return buckets",
    "hints": [
      "Goal: place each number into the bucket for its digit at the current place `exp`.",
      "You avoid comparing full numbers by bucketing on one digit at a time.",
      "Key insight: (x // exp) drops the lower digits and % 10 isolates the digit at that place.",
      "Approach: compute the current digit and append x to that bucket.",
      "Pseudocode: for x in out: digit = (x // exp) % 10; buckets[digit].append(x).",
      "Write `buckets[(x // exp) % 10].append(x)`."
    ],
    "tests": "b = bucketize([23, 45, 12, 5, 40], 1)\nassert b[0] == [40] and b[3] == [23] and b[5] == [45, 5] and b[2] == [12], f'ones-digit buckets wrong, got {b}'\nassert sum(len(x) for x in b) == 5, 'every element placed once'\n# tens place: 23->2, 45->4, 12->1, 5->0, 40->4\nb2 = bucketize([23, 45, 12, 5, 40], 10)\nassert b2[2] == [23] and b2[4] == [45, 40] and b2[1] == [12] and b2[0] == [5], f'tens-digit buckets wrong, got {b2}'\nassert len(bucketize([], 1)) == 10, 'always 10 buckets'\nprint('OK')"
  }
],

  review: `**Radix sort** (LSD) sorts integers by processing digits from least to most significant, using a **stable** base-b distribution each pass. It runs in **O(d·(n+b))** — near-linear when the digit count \`d\` is small — beating comparison sorts and avoiding counting sort's O(hi) blowup on large ranges. It requires digit-structured keys and **O(n+b)** space, and each pass must be stable.`,

  expectedOutput: "[2, 24, 45, 66, 75, 90, 170, 802]\n",

  references: [
  {
    "url": "https://opendatastructures.org/ods-python/11_2_Counting_Sort_Radix_So.html",
    "title": "Open Data Structures: counting and radix sorting",
    "section": "Counting sort and radix sort",
    "topic": "sorting/radix",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Stable lower-digit-first passes preserve prior order and avoid an array indexed by the whole key range."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "This app uses base10 list buckets and nonnegative Python integers."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "39fd7540066fcc7e",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
