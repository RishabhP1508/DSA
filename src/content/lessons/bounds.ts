/**
 * Lesson: Lower and upper bounds (Searching). Verified on CPython 3.14.
 * Output: "1\n4\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Lower/upper bounds on a sorted array with duplicates.
import bisect
nums = [1, 2, 2, 2, 3, 5]
# bisect_left: index of the FIRST element >= 2 (leftmost insertion point).
print(bisect.bisect_left(nums, 2))
# bisect_right: index just AFTER the last 2 (rightmost insertion point).
print(bisect.bisect_right(nums, 2))`;

export const bounds: LessonDefinition = {
  id: "bounds",
  title: "Lower and Upper Bounds",
  area: "Searching",
  prerequisites: ["binary-search"],

  explanation: `Plain binary search answers "is the target present, and where?" But with **duplicates**, you often want a **boundary**: the first position where the target could go (**lower bound**) or just past the last occurrence (**upper bound**). These are binary searches that don't stop at the first match — they keep narrowing to find an edge.

Python's \`bisect\` module gives them directly. On \`[1,2,2,2,3,5]\`: \`bisect_left(nums, 2)\` returns \`1\` — the index of the **first** element \`>= 2\`. \`bisect_right(nums, 2)\` returns \`4\` — the index just **after** the last \`2\`. The gap between them, \`4 - 1 = 3\`, is exactly the **count of 2's**. That is a powerful trick: two O(log n) bound queries give you the frequency of a value, or the size of any range, in a sorted array.

Both are **O(log n)** (they are binary searches) and operate on a sorted array. Lower/upper bounds are the building blocks for "count in range", "first/last occurrence", and inserting into a sorted list while keeping it sorted.`,

  vocabulary: [
    { term: "Lower bound", definition: "The first index whose element is >= the target (bisect_left)." },
    { term: "Upper bound", definition: "The first index whose element is > the target (bisect_right)." },
    { term: "Insertion point", definition: "Where a value could be inserted to keep the array sorted." },
    { term: "bisect module", definition: "Python's standard binary-search helpers: bisect_left, bisect_right, insort." },
    { term: "Range count", definition: "upper_bound - lower_bound = how many equal the target." },
  ],

  concepts: {
    purpose: "Find boundaries (first/last occurrence, insertion point) in a sorted array with duplicates.",
    operations: "bisect_left for the first >= target; bisect_right for the first > target; their difference is the count.",
    uses: "Counting occurrences, first/last occurrence, range counts, keeping a list sorted with insort.",
    tradeoffs: "O(log n) queries, but require sorted data; you must pick left vs right correctly for the boundary you want.",
    commonMistakes: "Confusing bisect_left vs bisect_right; expecting an 'index of target' when the value is absent (you get the insertion point); forgetting the array must be sorted.",
    edgeCases: "Target absent: both bounds equal the insertion point (count 0). Target smaller/larger than all elements returns 0 or len(nums).",
  },

  complexity: [
    { operation: "bisect_left / bisect_right", best: "O(log n)", average: "O(log n)", worst: "O(log n)", space: "O(1)", note: "Binary search for a boundary." },
    { operation: "Count occurrences", best: "O(log n)", average: "O(log n)", worst: "O(log n)", note: "upper - lower, two bound queries." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in the sorted array" }],
    costModel: "Each bisect call is a binary search: O(log n) comparisons, each O(1).",
    time: {
      bound: "O(log n)",
      case: "worst",
      explanation: "bisect_left and bisect_right are binary searches that halve the range each step, so each is O(log n). Counting occurrences calls both, which is 2·O(log n) = O(log n). The number of duplicates does not change the cost — that is the advantage over scanning them one by one.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "bisect works on the existing array with a few index variables; nothing grows with n.",
      inputOutputNote: "The sorted array of n elements is the input, not auxiliary space.",
    },
    derivation: [
      { lines: [5], description: "bisect_left is a binary search: O(log n).", cost: "O(log n)", dimension: "time" },
      { lines: [7], description: "bisect_right is a binary search: O(log n).", cost: "O(log n)", dimension: "time" },
      { lines: [5, 7], description: "Both operate in place with constant extra variables.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["The array is SORTED.", "Comparisons are O(1)."],
    tradeoffs: "Scanning to count duplicates is O(n); two bound queries do it in O(log n). The bisect module is also a correct, tested alternative to hand-written boundary binary search.",
    fixedDataNote: "This run returns lower=1 and upper=4 for value 2, so there are 4-1=3 twos. The O(log n) bounds generalise to n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: bounds on a sorted array with duplicates." },
    { line: 2, executable: true, explanation: "Import the bisect module (standard library, available in the bundled runtime)." },
    { line: 3, executable: true, explanation: "A sorted array containing three 2's." },
    { line: 4, executable: false, explanation: "Comment: bisect_left finds the first index >= target." },
    { line: 5, executable: true, explanation: "bisect_left(nums, 2) = 1: the leftmost position of 2." },
    { line: 6, executable: false, explanation: "Comment: bisect_right finds the index just after the last target." },
    { line: 7, executable: true, explanation: "bisect_right(nums, 2) = 4: just past the last 2. Count of 2's = 4 - 1 = 3." },
  ],

  bindings: [{ variable: "nums", model: "array" }],

  prediction: [
    { atEventIndex: 0, prompt: "On [1,2,2,2,3,5], what does bisect_right(nums, 2) - bisect_left(nums, 2) compute?", answer: "3 — the number of 2's in the array.", explanation: "Upper bound (4) minus lower bound (1) is exactly the count of elements equal to the target: 4 - 1 = 3 twos." },
  ],

  experiments: [
    "Query bounds for a value not present (e.g. 4) and see both equal the insertion point (count 0).",
    "Query bounds for 1 (at the start) and 5 (at the end).",
    "Use bisect.insort to insert a value and keep the list sorted.",
  ],

  exercises: [
    {
      id: "bnd-complete-1",
      kind: "complete-code",
      prompt: "Complete a function that counts occurrences of target in a sorted array using bisect.",
      starterCode: "import bisect\ndef count(nums, target):\n    # TODO: return the number of elements equal to target\n    pass",
      expected: "import bisect\ndef count(nums, target):\n    return bisect.bisect_right(nums, target) - bisect.bisect_left(nums, target)",
      hints: ["Find the first and just-after-last positions.", "bisect_left gives the first, bisect_right the just-after.", "Return bisect_right(...) - bisect_left(...)."],
    },
    {
      id: "bnd-choose-1",
      kind: "choose-approach",
      prompt: "You need the index of the FIRST occurrence of a value in a sorted array with duplicates. bisect_left or bisect_right?",
      expected: "bisect_left — it returns the leftmost index where the target appears (or would be inserted); bisect_right would point past the last occurrence.",
      hints: ["Which boundary is the first occurrence?", "The leftmost one.", "bisect_left gives the first position >= target."],
    },
  ],

  review: `**Lower bound** (\`bisect_left\`, first index \`>= target\`) and **upper bound** (\`bisect_right\`, first index \`> target\`) are boundary binary searches on sorted data, each **O(log n)**. Their difference is the **count** of the target — counting duplicates in O(log n) instead of O(n). Use \`bisect\` for correct, tested boundaries and \`insort\` to keep a list sorted.`,

  expectedOutput: "1\n4\n",

  references: [
    {
      url: "https://docs.python.org/3/library/bisect.html",
      title: "bisect — Array bisection algorithm — Python documentation",
      section: "bisect_left / bisect_right",
      topic: "searching/bounds",
      purpose: "Confirm bisect_left returns the leftmost insertion point (first >= x) and bisect_right the rightmost (first > x), on the bundled runtime.",
      verifiedClaims: ["bisect_left returns the first index where x could be inserted keeping sorted order (leftmost)", "bisect_right returns the index after any existing equal entries"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://cp-algorithms.com/num_methods/binary_search.html",
      title: "Binary search — CP-Algorithms",
      section: "Lower/upper bound",
      topic: "searching/bounds",
      purpose: "Cross-check the lower/upper-bound definitions and the count-by-difference trick.",
      verifiedClaims: ["upper_bound - lower_bound equals the number of elements equal to the target"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "1716bd90dcb9bf8d",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
