/**
 * Pattern: Prefix sums + hashmap.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2). Output "6\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `from collections import defaultdict

# Count contiguous subarrays whose sum is k — works even with NEGATIVE numbers.
def subarrays_sum_k(nums, k):
    count = 0
    prefix = 0
    seen = defaultdict(int)
    seen[0] = 1                    # the empty prefix has sum 0
    for x in nums:
        prefix += x                # running prefix sum
        count += seen.get(prefix - k, 0)  # how many earlier prefixes complete a sum-k range
        seen[prefix] += 1          # record this prefix for future ends
    return count

print(subarrays_sum_k([1, -1, 1, -1, 1], 0))  # 6 subarrays sum to 0`;

export const prefixSumsHashmapPattern: PatternDefinition = {
  id: "prefix-sums-hashmap",
  title: "Prefix Sums + Hashmap",
  category: "Arrays & strings",
  summary:
    "Turn a range-sum question into a lookup: a subarray sums to k exactly when two prefix sums differ by k, counted with a hashmap.",

  clues: [
    "You need sums of many contiguous ranges, or to COUNT subarrays with a target sum.",
    "The array can contain NEGATIVE numbers (so a sliding window is not monotone).",
    "The target is an exact sum (or a remainder/divisibility condition on sums).",
    "Phrases like 'number of subarrays summing to k', 'subarray with sum divisible by k'.",
  ],

  naiveApproach: `Try every subarray and add up its elements: two nested loops over (start, end) plus an inner sum is **O(n³)**, or **O(n²)** if you keep a running sum for each start. For large arrays this is far too slow, and the wasted work is recomputing overlapping range sums again and again.`,

  whyItHelps: "Define `prefix[i]` = sum of the first i elements. Then the sum of the range [i, j) is `prefix[j] − prefix[i]`. A range sums to **k** exactly when `prefix[j] − prefix[i] = k`, i.e. `prefix[i] = prefix[j] − k`. So as you scan left to right maintaining the running prefix, you ask *\"how many earlier prefixes equal (current prefix − k)?\"* — an **expected O(1) hashmap lookup**. Recording each prefix's count as you go turns the whole count into a single **O(n)** pass with **O(n)** space. Crucially this works with **negative numbers**, where a sliding window fails.",

  conditions: [
    "The aggregate is a running SUM (or something additive/invertible like XOR), so range = prefix difference.",
    "You maintain counts of prefixes seen so far, and seed the empty prefix (seen[0] = 1) so ranges starting at index 0 are counted.",
    "For 'divisible by k', key the map by prefix % k instead of the raw prefix.",
  ],

  alternatives: [
  "Fixed-size windows work with negatives for a fixed-width objective. Sum-threshold VARIABLE-size windows need monotonicity; for arbitrary-length target-sum counting, prefix counts remain correct with negatives and zeros.",
  "Plain prefix-sum array (no map) — enough when you only need a few range sums by index, not a count over all ranges.",
  "Kadane's algorithm — for the MAXIMUM subarray sum, not for counting or exact-target sums."
],

  counterexamples: [
    "'Largest sum of exactly k consecutive elements' — the size is fixed and you want a max, not a count: a fixed sliding window is simpler.",
    "'Longest substring without repeats' — that's a distinctness condition, not a sum: a variable sliding window fits, not prefix sums.",
    "Forgetting seen[0] = 1 undercounts subarrays that start at index 0 — a classic bug, not a different pattern.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "6\n",
  complexityNote:
    "O(n) time: one pass, each step an O(1) map lookup and update. O(n) space for the prefix-count map. Naive per-range summing is O(n²).",

  complexityExplanation: {
  "scope": "program",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in nums"
    }
  ],
  "costModel": "One pass maintains a running prefix sum and a map from prefix value to how many times it has occurred; each step is an O(1) hashed lookup and update.",
  "time": {
    "bound": "O(n)",
    "case": "expected",
    "explanation": "A single loop over n elements (lines 9-12), each doing an O(1) map read (line 11) and O(1) map update (line 12). So O(n) expected, relying on average-case O(1) hashing. The naive 'sum every subarray' approach is O(n²).",
    "otherCases": [
      {
        "case": "worst",
        "bound": "O(n²)",
        "note": "Only under pathological hash collisions; Python dict is expected O(1) per op."
      }
    ]
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The `seen` map can hold up to n+1 distinct prefix sums.",
    "inputOutputNote": "nums (n) is the input; the answer is a single count."
  },
  "derivation": [
    {
      "lines": [
        10
      ],
      "description": "Maintain the running prefix sum.",
      "cost": "O(1) per step",
      "dimension": "time"
    },
    {
      "lines": [
        11,
        12
      ],
      "description": "One map lookup + one update per element.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        7
      ],
      "description": "The prefix-count map holds up to n+1 entries.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "dict lookup/insert are expected O(1).",
    "A sum-threshold variable window may fail with negatives; a fixed-width window still works for its different objective."
  ],
  "tradeoffs": "Prefix-counting supports arbitrary-length target sums and negative values, using O(n) storage. Fixed windows solve specified-width questions, including negative values; variable-size sum windows require a suitable monotone condition.",
  "counters": [
    {
      "label": "prefixes recorded",
      "definition": "executions of seen[prefix] += 1 (line 12)",
      "countLines": [
        12
      ]
    }
  ],
  "fixedDataNote": "For [1,-1,1,-1,1] with k=0 there are 6 zero-sum subarrays. The O(n) bound generalises."
},

  codeExplanations: [
  {
    "line": 1,
    "executable": true,
    "explanation": "Import defaultdict for a counting map with a 0 default."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 3,
    "executable": false,
    "explanation": "Comment: count subarrays summing to k, negatives allowed."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Define subarrays_sum_k(nums, k)."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Running count of qualifying subarrays."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Running prefix sum."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Map from a prefix value to how many times it has occurred."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Seed the empty prefix (sum 0) so ranges starting at index 0 are counted."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Scan each element."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Extend the running prefix sum by x."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Look up the number of earlier complement prefixes, using zero without inserting a missing key."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Record the current prefix for future range-ends."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Return the total count."
  },
  {
    "line": 14,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "[1,-1,1,-1,1] has 6 contiguous subarrays that sum to 0."
  }
],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [{ role: "total", label: "prefix", source: "prefix" }],
    },
    { variable: "seen", model: "dict" },
  ],

  linkedLessons: ["prefix-sums", "prefix-sums-map", "hashing-frequency"],

  exercises: [
  {
    "id": "pat-ps-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'Count the number of contiguous subarrays with sum exactly k, where the array MAY contain negative numbers.' Which pattern, and why not a sliding window?",
    "expected": "Prefix sums + hashmap. With negatives the window sum isn't monotone, so growing/shrinking a window can't decide membership. Track prefix sums in a map and count earlier prefixes equal to (current prefix − k). O(n).",
    "correctPatternId": "prefix-sums-hashmap",
    "hints": [
      "Goal: count contiguous subarrays summing to exactly k when the array may contain negatives.",
      "Checking every subarray is O(n^2), and a sliding window can't decide membership because negatives break monotonicity.",
      "Key insight: a range sum equals a difference of two prefix sums, so a subarray sums to k when an earlier prefix equals current−k.",
      "Approach: use prefix sums with a hashmap counting how many times each prefix value has occurred.",
      "Pseudocode: running prefix; for each element add count[prefix−k] to the answer; then increment count[prefix].",
      "Use prefix sums + hashmap and count earlier prefixes equal to (current prefix − k), in O(n)."
    ],
    "recognition": {
      "scenario": "Count the number of contiguous subarrays whose sum is exactly k, where the array MAY contain negative numbers.",
      "approaches": [
        {
          "id": "prefix-map",
          "label": "Prefix sums + hash map",
          "requiredReasonIds": [
            "negatives-nonmonotone",
            "count-earlier-prefixes"
          ]
        },
        {
          "id": "sliding-window",
          "label": "Sliding window",
          "requiredReasonIds": [],
          "rejectionFeedback": "With negatives the window sum is not monotone, so growing/shrinking a window cannot decide membership."
        },
        {
          "id": "kadane",
          "label": "Kadane's algorithm",
          "requiredReasonIds": [],
          "rejectionFeedback": "Kadane maximizes a subarray sum; it does not count how many subarrays hit a target."
        }
      ],
      "reasons": [
        {
          "id": "negatives-nonmonotone",
          "text": "Negatives make the running sum non-monotone, so a sliding window cannot decide when to shrink."
        },
        {
          "id": "count-earlier-prefixes",
          "text": "For each prefix sum, the number of earlier prefixes equal to (current − k) counts the qualifying subarrays in O(n)."
        },
        {
          "id": "all-positive",
          "text": "All values are positive, so the window sum only grows and a two-pointer window suffices.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "prefix-map"
      ],
      "modelExplanation": "Prefix sums + hash map: store counts of each prefix sum and add the count of prefixes equal to (current − k) at every step — O(n), and correct with negatives."
    }
  },
  {
    "id": "pat-ps-fix-1",
    "kind": "fix-mistake",
    "prompt": "`count_subarrays(nums, k)` counts contiguous subarrays summing to k. This undercounts subarrays that start at index 0. Fix the initialization.",
    "starterCode": "from collections import defaultdict\ndef count_subarrays(nums, k):\n    seen = defaultdict(int)\n    count = 0\n    prefix = 0\n    for x in nums:\n        prefix += x\n        count += seen[prefix - k]\n        seen[prefix] += 1\n    return count",
    "expected": "from collections import defaultdict\ndef count_subarrays(nums, k):\n    seen = defaultdict(int)\n    seen[0] = 1\n    count = 0\n    prefix = 0\n    for x in nums:\n        prefix += x\n        count += seen[prefix - k]\n        seen[prefix] += 1\n    return count",
    "hints": [
      "Goal: count_subarrays(nums, k) = number of contiguous subarrays summing to k.",
      "The repeated work is range sums; a running prefix + a count map answers each in O(1).",
      "Key property: a subarray that STARTS at index 0 has 'previous prefix' 0, which must already be counted.",
      "Approach: seed the empty-prefix count before scanning.",
      "Pseudocode: seen={0:1}; for x: prefix+=x; count+=seen[prefix-k]; seen[prefix]+=1.",
      "Fix: set seen[0] = 1 before the loop."
    ],
    "tests": "assert count_subarrays([1,1,1], 2) == 2\nassert count_subarrays([1,2,3], 3) == 2, '[1,2] and [3]'\n# subarray starting at index 0 must count (needs seen[0]=1):\nassert count_subarrays([3,1,2], 3) == 2, '[3] and [1,2]'\nassert count_subarrays([1,-1,0], 0) == 3\nassert count_subarrays([], 0) == 0\nprint('OK')"
  },
  {
    "id": "pat-ps-contrast-1",
    "kind": "choose-approach",
    "prompt": "Three problems on the SAME array of integers (with negatives): (a) largest sum of exactly k consecutive; (b) count contiguous subarrays summing to a target; (c) largest sum of any contiguous subarray. Name the pattern for each.",
    "expected": "(a) Fixed-size sliding window. (b) Prefix sums + hashmap (negatives invalidate the usual sum-threshold grow/shrink rule; fixed-size windows still work). (c) Kadane's algorithm. Same array, three different patterns — the wording (fixed k / count with target / max any) is the tell.",
    "correctPatternId": "prefix-sums-hashmap",
    "hints": [
      "Goal: name the right pattern for three problems on the same integer array with negatives.",
      "It's tempting to reuse one technique, but the differing wording signals different repeated-work structures.",
      "Key insight: fixed-size-and-max, count-with-exact-target-and-negatives, and max-over-any-range each demand a different tool.",
      "Approach: match each phrasing to fixed-size window, prefix sums + map, or Kadane respectively.",
      "Pseudocode: (a) slide a k-window tracking max; (b) prefix sums + hashmap counting prefix−target; (c) Kadane's extend-or-restart.",
      "(a) is a fixed-size sliding window, (b) is prefix sums + hashmap (negatives rule out a window), and (c) is Kadane's algorithm."
    ],
    "recognition": {
      "scenario": "Three problems on the SAME integer array (with negatives): (a) largest sum of exactly k consecutive; (b) COUNT contiguous subarrays summing to a target; (c) largest sum of any contiguous subarray. This drill is about problem (b).",
      "approaches": [
        {
          "id": "prefix-map",
          "label": "Prefix sums + hash map",
          "requiredReasonIds": [
            "count-with-negatives"
          ]
        },
        {
          "id": "fixed-window",
          "label": "Fixed-size sliding window",
          "requiredReasonIds": [],
          "rejectionFeedback": "That is the tool for (a): a fixed width k. Problem (b) has no fixed width and needs a count."
        },
        {
          "id": "kadane",
          "label": "Kadane's algorithm",
          "requiredReasonIds": [],
          "rejectionFeedback": "That is the tool for (c): the max any-length sum. It does not count target-sum subarrays."
        }
      ],
      "reasons": [
        {
          "id": "count-with-negatives",
          "text": "Problem (b) counts arbitrary-length subarrays hitting a target sum and tolerates negatives — prefix sums in a map handle exactly this."
        },
        {
          "id": "fixed-k-tell",
          "text": "The wording pins a fixed width k, so slide a constant window.",
          "contradictory": true
        },
        {
          "id": "max-any-tell",
          "text": "The wording asks for the maximum any-length sum, so track extend-vs-restart.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "prefix-map"
      ],
      "modelExplanation": "Problem (b) — counting target-sum subarrays with negatives — is prefix sums + a hash map. The fixed-k wording signals a window (a); the 'max any-length' wording signals Kadane (c)."
    }
  }
],

  references: [
  {
    "url": "https://usaco.guide/silver/prefix-sums",
    "title": "USACO Guide: prefix sums",
    "section": "Exclusive prefix sums, adapted to 0-based endpoints",
    "topic": "codex/b2-b",
    "purpose": "Verify the specific semantics and conditions used in this lesson.",
    "verifiedClaims": [
      "Range sums can be recovered from two prefix totals."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://docs.python.org/3.14/library/stdtypes.html#dict.get",
    "title": "Python dict.get",
    "section": "Dictionary methods",
    "topic": "codex/b2-b",
    "purpose": "Verify the specific semantics and conditions used in this lesson.",
    "verifiedClaims": [
      "get returns its default without inserting a missing key."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 19,
    contentHash: "aec635695aa06bcf",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
