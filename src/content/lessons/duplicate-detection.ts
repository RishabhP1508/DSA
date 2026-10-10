/**
 * Lesson: Duplicate detection (Hashing). Verified on CPython 3.14.
 * Output: "True\nFalse\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Detect a duplicate in one pass using a "seen" set.
def has_dup(nums):
    seen = set()
    for x in nums:
        if x in seen:        # already encountered -> duplicate
            return True
        seen.add(x)          # remember this value
    return False

print(has_dup([1, 2, 3, 2]))
print(has_dup([1, 2, 3]))`;

export const duplicateDetection: LessonDefinition = {
  id: "duplicate-detection",
  title: "Duplicate Detection",
  area: "Hashing",
  prerequisites: ["maps-sets"],

  explanation: `"Are there any duplicates?" is one of the most common sub-questions in interviews and real code, and hashing answers it in a single **O(n)** pass. The idea: keep a **\`seen\` set** of values encountered so far; for each new value, if it's already in \`seen\` you've found a duplicate, otherwise add it and continue.

Compare the alternatives. Brute force checks every pair — **O(n²)**. Sorting first makes duplicates adjacent so you can scan neighbours — **O(n log n)** time and O(1) auxiliary space with iterative heapsort if you may reorder. Python list.sort may use O(n) temporary space, so sorting in place does not promise constant auxiliary space. The **set** approach is **O(n)** time but **O(n)** space: it trades memory for speed, and it works even when you can't sort or reorder the data.

This is the archetype of the broader **"caching seen values"** pattern (next lessons): a set/dict remembering what you've processed converts "have I encountered X?" into an expected-O(1) check. Recognising that a problem needs fast "seen before?" tests is the trigger for a set.`,

  vocabulary: [
    { term: "Duplicate", definition: "A value that appears more than once." },
    { term: "seen set", definition: "A set of values already encountered during the scan." },
    { term: "Early exit", definition: "Returning as soon as the first duplicate is found." },
    { term: "Space–time trade-off", definition: "Using O(n) memory to reduce time from O(n²)/O(n log n) to O(n)." },
  ],

  concepts: {
    purpose: "Decide whether any value repeats, in one linear pass.",
    operations: "Scan; if x in seen return True; else add x; end False.",
    uses: "Uniqueness checks, detecting revisits, deduping streams, prerequisite for many hashing problems.",
    tradeoffs: "O(n) time vs O(n) space; iterative heapsort is O(n log n) time with O(1) auxiliary space; Python list.sort may use O(n) temporary space; brute force is O(n²).",
    commonMistakes: "Adding to the set before checking (reports a false duplicate even for the first item); using a list for `seen` (membership becomes O(n)); mutating the input when sorting isn't allowed.",
    edgeCases: "Empty or single-element input has no duplicates. All-identical values return True on the second element. Unhashable elements can't go in a set.",
  },

  complexity: [
    { operation: "has_dup (set)", best: "O(1)", average: "O(n)", worst: "O(n^2)", space: "O(n)", note: "Expected O(n) for bounded-size keys; collision-heavy set work can reach O(n^2). Best: early duplicate." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in nums" }],
    costModel: "Each set membership test and add is expected O(1).",
    time: {
      bound: "O(n)",
      case: "expected",
      explanation: "We scan the elements once, doing an expected-O(1) membership check and possibly an add per element. In the worst case (all distinct, or the duplicate is last) we process all n elements — O(n). The early return gives an O(1) best case when a duplicate appears near the front.",
      otherCases: [
        { case: "best", bound: "O(1)", note: "The first two elements are equal: detected immediately." },
      ],
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "If all elements are distinct, the `seen` set grows to hold all n of them — O(n) auxiliary space. This memory is the price for O(n) time instead of O(n log n) sorting.",
      inputOutputNote: "The list of n elements is the input; the seen set (up to n) is auxiliary.",
    },
    derivation: [
      { lines: [4], description: "Scan each of the n elements once.", cost: "O(n)", dimension: "time" },
      { lines: [5, 7], description: "Each element does an expected-O(1) membership check and add.", cost: "O(n)", dimension: "time" },
      { lines: [3, 7], description: "The seen set can hold up to n distinct values.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Elements are hashable and set ops are expected O(1)."],
    tradeoffs: "Iterative heapsort followed by a neighbour scan is O(n log n) time and O(1) auxiliary space; Python list.sort may need O(n) temporary space; the set is O(n) time but O(n) space and preserves order.",
    counters: [{ label: "elements checked", definition: "iterations of the scan (line 4)", countLines: [4] }],
    fixedDataNote: "The first call finds a duplicate at the 4th element; the second scans all 3 and returns False. The bounds generalise to n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: detect a duplicate with a seen set." },
    { line: 2, executable: true, explanation: "Define has_dup(nums)." },
    { line: 3, executable: true, explanation: "Start with an empty seen set." },
    { line: 4, executable: true, explanation: "Scan each element." },
    { line: 5, executable: true, explanation: "If x was already seen, it's a duplicate." },
    { line: 6, executable: true, explanation: "Return True immediately (early exit)." },
    { line: 7, executable: true, explanation: "Otherwise record x as seen (expected O(1))." },
    { line: 8, executable: true, explanation: "No duplicate found after the whole scan → False." },
    { line: 9, executable: false, explanation: "Blank line." },
    { line: 10, executable: true, explanation: "[1,2,3,2] has a repeated 2 → True." },
    { line: 11, executable: true, explanation: "[1,2,3] is all distinct → False." },
  ],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [],
    },
    { variable: "seen", model: "set" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why must we check `x in seen` BEFORE adding x, not after?", answer: "Because adding first would put x in the set immediately, so the very same element would appear 'seen' and falsely report a duplicate.", explanation: "The check must reflect prior elements only. Adding before checking makes each element see itself, breaking correctness — check membership first, then add." },
  ],

  experiments: [
    "Put the duplicate at the front and observe the O(1) early exit.",
    "Use all distinct values and watch the seen set grow to size n.",
    "Rewrite it by sorting first and scanning neighbours; compare time/space.",
  ],

  exercises: [
    {
      id: "dup-fix-1",
      kind: "fix-mistake",
      prompt: "This reports True for every nonempty input, even when all values differ. Fix the order of operations.",
      starterCode: "def has_dup(nums):\n    seen = set()\n    for x in nums:\n        seen.add(x)\n        if x in seen:\n            return True\n    return False",
      expected: "def has_dup(nums):\n    seen = set()\n    for x in nums:\n        if x in seen:\n            return True\n        seen.add(x)\n    return False",
      hints: ["What happens right after you add x?", "x is now in seen, so the check always passes.", "Check membership BEFORE adding."],
    },
    {
      id: "dup-choose-1",
      kind: "choose-approach",
      prompt: "You must detect duplicates but cannot use extra memory and may reorder the data. What's the approach and its complexity?",
      expected: "Use an iterative heapsort (O(n log n), O(1) auxiliary space) and scan for equal adjacent elements. This trades the set's O(n) space for O(n log n) time.",
      hints: ["No extra memory rules out the set.", "Sorting groups equal values together.", "O(n log n) time, O(1) extra space."],
    },
  ],

  review: `**Duplicate detection** uses a **\`seen\` set**: check \`x in seen\` (expected O(1)) then add x, returning True on the first repeat. It's **O(n)** time / **O(n)** space — trading memory to beat brute force's O(n²) and sorting's O(n log n). Always check membership *before* adding. This is the base case of the "cache what you've seen" hashing pattern.`,

  expectedOutput: "True\nFalse\n",

  references: [
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Arrays & Hashing — Contains Duplicate",
      topic: "hashing/duplicates",
      purpose: "Confirm the set-based O(n) duplicate-detection approach and its trade-offs vs sorting/brute force.",
      verifiedClaims: ["A hash set detects duplicates in O(n) time and O(n) space"],
      accessDate: "2026-09-20",
    },
    {"url":"https://opendatastructures.org/ods-python/11_1_Comparison_Based_Sorti.html","title":"Open Data Structures sorting","section":"11.1.3 Heap-sort","topic":"duplicate-detection","purpose":"Verify claims during the delegated Codex review.","verifiedClaims":["Heap-sort reuses the input array and runs in O(n log n) time."],"accessDate":"2026-10-10"},
    {"url":"https://docs.python.org/3.14/howto/sorting.html","title":"Python Sorting Techniques","section":"Sorting basics; Timsort","topic":"duplicate-detection","purpose":"Verify claims during the delegated Codex review.","verifiedClaims":["list.sort mutates its input; mutation alone does not specify auxiliary memory."],"accessDate":"2026-10-10"},
    {"url":"https://runestone.academy/ns/books/published/pythonds3/SortSearch/Hashing.html","title":"Runestone hashing","section":"Collision resolution","topic":"duplicate-detection","purpose":"Verify claims during the delegated Codex review.","verifiedClaims":["Collision resolution can require multiple candidate checks."],"accessDate":"2026-10-10"},
  ],
  evidence: {
    inventoryVersion: 19,
    contentHash: "d7b5e75d70d57aed",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
