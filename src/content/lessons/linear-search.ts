/**
 * Lesson: Linear search (Searching). Verified on CPython 3.14.
 * Output: "2\n-1\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Linear search: scan every element until the target is found.
def linear_search(nums, target):
    for i in range(len(nums)):
        if nums[i] == target:
            return i
    return -1

# Present -> returns its index.
print(linear_search([5, 3, 8, 1], 8))
# Absent -> returns -1 after scanning everything.
print(linear_search([5, 3, 8, 1], 9))`;

export const linearSearch: LessonDefinition = {
  id: "linear-search",
  title: "Linear Search",
  area: "Searching",
  prerequisites: ["array-traversal", "cases"],

  explanation: `**Linear search** is the simplest way to find a value: walk through the array from the start and compare each element to the target. Return its index the moment you find it; if you reach the end without a match, the value is not there (return -1).

Its great advantage is that it makes **no assumptions** — the array does not need to be sorted, and it works on any sequence you can iterate. Its cost is the trade: in the **worst case** (target absent, or last) you inspect all n elements, so it is **O(n)**. The **best case** is O(1) (match at the front). On average, for a present target at a random position, it checks about n/2 — still O(n).

When the data is **sorted**, binary search does far better (O(log n)); when you search the same collection many times, a hash set gives expected O(1) lookups. Linear search is the right tool when the data is small, unsorted, or searched only once.`,

  vocabulary: [
    { term: "Linear search", definition: "Checking each element in order until the target is found or the array ends." },
    { term: "Target", definition: "The value you are looking for." },
    { term: "Sentinel return (-1)", definition: "A conventional 'not found' result." },
    { term: "Unsorted-friendly", definition: "Works without any ordering assumption on the data." },
  ],

  concepts: {
    purpose: "Find a value in any sequence without needing it sorted.",
    operations: "Scan left to right; compare; return the index on match, or -1 at the end.",
    uses: "Small or unsorted data, one-off searches, searching linked structures.",
    tradeoffs: "O(n) but assumption-free; beaten by binary search (sorted) and hash sets (many lookups).",
    commonMistakes: "Using it repeatedly when a set/dict would give O(1); assuming it needs sorted data (it does not); returning True/False when the index is needed.",
    edgeCases: "Empty array returns -1. Duplicate targets: returns the first match. Target at the end is the worst case.",
  },

  complexity: [
    { operation: "Linear search", best: "O(1)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "Best: match at front. Worst: absent → scan all n." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in nums" }],
    costModel: "Each comparison and index read is O(1). The loop may exit early on a match.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "In the worst case the target is absent or last, so all n elements are compared before returning — O(n). The early return gives an O(1) best case, and an average of about n/2 comparisons for a present target, which is still O(n).",
      otherCases: [
        { case: "best", bound: "O(1)", note: "Target is the first element: one comparison." },
        { case: "average", bound: "O(n)", note: "Present target at a random position: ~n/2 comparisons." },
      ],
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Only the loop index is used; no storage grows with n.",
      inputOutputNote: "The array of n elements is the input, not auxiliary space.",
    },
    derivation: [
      { lines: [3, 4], description: "Each element triggers one comparison; up to n in the worst case.", cost: "O(n)", dimension: "time" },
      { lines: [5], description: "Early return on match — the O(1) best case.", cost: "O(1)", dimension: "time" },
      { lines: [3], description: "One loop index; no growth with n.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Comparisons and index reads are constant time.", "Average case assumes the target is present at a uniformly random position."],
    tradeoffs: "Binary search is O(log n) but requires sorted data; a hash set gives expected O(1) lookups but needs O(n) space to build. Linear search needs neither.",
    counters: [{ label: "comparisons", definition: "executions of the equality test (line 4)", countLines: [4] }],
    fixedDataNote: "The first call matches at index 2 (3 comparisons); the second scans all 4 then returns -1. The bounds generalise these counts to n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: scan until found." },
    { line: 2, executable: true, explanation: "Define linear_search(nums, target)." },
    { line: 3, executable: true, explanation: "Loop over every index (up to n comparisons)." },
    { line: 4, executable: true, explanation: "Compare the current element to the target." },
    { line: 5, executable: true, explanation: "Return the index immediately on a match (best case is here)." },
    { line: 6, executable: true, explanation: "If the loop ends with no match, return -1." },
    { line: 7, executable: false, explanation: "Blank line." },
    { line: 8, executable: false, explanation: "Comment: present case." },
    { line: 9, executable: true, explanation: "8 is at index 2 → prints 2." },
    { line: 10, executable: false, explanation: "Comment: absent case." },
    { line: 11, executable: true, explanation: "9 is absent → scans all 4, prints -1." },
  ],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [{ role: "pointer", label: "i", source: "i" }],
    },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "For an unsorted 1000-element array, what is linear search's worst-case comparison count, and can binary search help?", answer: "1000 comparisons worst case (O(n)); binary search cannot be used because it requires sorted data.", explanation: "Linear search must potentially check all n elements. Binary search is O(log n) but only works on sorted arrays, so it is not applicable to unsorted data." },
  ],

  experiments: [
    "Search for the last element and count comparisons (equals n).",
    "Search an empty list and confirm it returns -1.",
    "Search a list with duplicates and confirm the first index is returned.",
  ],

  exercises: [
    {
      id: "ls-complete-1",
      kind: "complete-code",
      prompt: "Complete a linear search that returns True/False for whether target is present.",
      starterCode: "def contains(nums, target):\n    for x in nums:\n        # TODO: return True if x equals target\n        pass\n    return False",
      expected: "def contains(nums, target):\n    for x in nums:\n        if x == target:\n            return True\n    return False",
      hints: ["Compare each element to target.", "Return True on a match.", "if x == target: return True"],
    },
    {
      id: "ls-choose-1",
      kind: "choose-approach",
      prompt: "You will search the same array thousands of times for different values. Is repeated linear search a good choice? What is better?",
      expected: "No — repeated linear search is O(n) per query = O(n·q). Build a set once (O(n)) then query in expected O(1), giving O(n + q).",
      hints: ["How many queries, and does the array change?", "Repeated O(n) scans add up.", "A set gives expected O(1) lookups after an O(n) build."],
    },
  ],

  review: `**Linear search** scans every element until it finds the target, returning its index or -1. It needs **no sorting** and works on any sequence, at **O(n)** time (best O(1), average ~n/2) and **O(1)** space. Prefer binary search for sorted data (O(log n)) or a hash set for many lookups (expected O(1)).`,

  expectedOutput: "2\n-1\n",

  references: [
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheSequentialSearch.html",
      title: "The Sequential Search — Problem Solving with Algorithms and DS using Python (Runestone)",
      section: "Sequential search analysis",
      topic: "searching/linear",
      purpose: "Confirm the linear (sequential) search algorithm and its O(n) worst / O(1) best analysis.",
      verifiedClaims: ["Sequential search is O(n) worst case and O(1) best case", "It requires no ordering of the data"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://www.w3schools.com/dsa/dsa_algo_linearsearch.php",
      title: "Linear Search — W3Schools DSA",
      section: "Linear search",
      topic: "searching/linear",
      purpose: "Beginner cross-check of the linear-search procedure and not-found convention.",
      verifiedClaims: ["Linear search checks each element and returns its position or a not-found signal"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "c99b9daa622305fd",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
