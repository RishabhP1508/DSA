/**
 * Lesson: Best / average / worst cases (DSA foundations).
 * Verified on CPython 3.14. Output: "True\nFalse\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Linear search: stop as soon as we find the target.
def contains(nums, target):
    for x in nums:
        if x == target:
            return True
    return False

# Target is first -> stops immediately (best case).
print(contains([5, 1, 4], 5))
# Target absent -> scans everything (worst case).
print(contains([5, 1, 4], 9))`;

export const cases: LessonDefinition = {
  id: "cases",
  title: "Best, Average, and Worst Cases",
  area: "DSA foundations",
  prerequisites: ["complexity"],

  explanation: `The same algorithm can do very different amounts of work depending on the **specific input**. We describe this with three cases:

- **Best case:** the luckiest input. Linear search finds the target at the very first position → **O(1)**.
- **Worst case:** the unluckiest input. The target is absent (or last), so we scan all n elements → **O(n)**.
- **Average case:** the expected work over typical inputs. For a present target at a uniformly random position, linear search checks about n/2 elements → still **O(n)**.

Reporting a bound **without saying which case** is ambiguous, so always state it. By default we usually quote the **worst case**, because it is the guarantee you can rely on. In this lesson, \`contains([5,1,4], 5)\` hits the best case (one comparison), while \`contains([5,1,4], 9)\` hits the worst case (three comparisons, then False).`,

  vocabulary: [
    { term: "Best case", definition: "The least work over all inputs of size n." },
    { term: "Worst case", definition: "The most work over all inputs of size n; the guarantee." },
    { term: "Average case", definition: "The expected work over a stated distribution of inputs." },
    { term: "Early exit", definition: "Returning as soon as the answer is known, which enables a good best case." },
  ],

  concepts: {
    purpose: "Cases explain why one input is fast and another slow for the same algorithm, and which bound to trust.",
    operations: "Identify inputs that trigger least/most work; state the case with every bound.",
    uses: "Setting expectations, choosing algorithms with acceptable worst cases, understanding early exits.",
    tradeoffs: "An algorithm with a great average but terrible worst case (e.g. naive quicksort) may be risky for adversarial input.",
    commonMistakes: "Quoting a bound without its case; assuming best case is typical; confusing average case with best case.",
    edgeCases: "Empty list: contains returns False after zero comparisons. Duplicate targets: returns at the first match.",
  },

  complexity: [
    { operation: "linear search", best: "O(1)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "Best: match at index 0. Worst: absent → scan all n." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in nums" }],
    costModel: "Each equality comparison is one constant-time step. The loop may exit early on a match.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "In the worst case (target absent or last), the loop compares against all n elements before returning — O(n). The early `return True` is what makes better cases possible.",
      otherCases: [
        { case: "best", bound: "O(1)", note: "Target is at index 0: one comparison, then return." },
        { case: "average", bound: "O(n)", note: "Target at a uniformly random present position: ~n/2 comparisons, still linear in n." },
      ],
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Only the loop variable is used; no storage grows with n regardless of case.",
      inputOutputNote: "The list of n elements is the input, not auxiliary space.",
    },
    derivation: [
      { lines: [3, 4], description: "Each element triggers one comparison; up to n of them in the worst case.", cost: "O(n)", dimension: "time" },
      { lines: [5], description: "Early return on a match — the source of the O(1) best case.", cost: "O(1)", dimension: "time" },
      { lines: [3], description: "One loop variable; no growth with n.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Comparisons are constant time.", "Average case assumes the target is present at a uniformly random position."],
    tradeoffs: "If you search the same list many times, building a set once (O(n)) then querying in O(1) beats repeated O(n) linear searches — trading space for time.",
    counters: [
      { label: "comparisons", definition: "executions of the equality test (line 4)", countLines: [4] },
    ],
    fixedDataNote: "The first call hits the best case (1 comparison); the second hits the worst case (3 comparisons on this 3-element list). The bounds generalise these counts to n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: linear search with early exit." },
    { line: 2, executable: true, explanation: "Define contains(nums, target)." },
    { line: 3, executable: true, explanation: "Loop over each element (up to n comparisons in the worst case)." },
    { line: 4, executable: true, explanation: "Compare the current element to target." },
    { line: 5, executable: true, explanation: "Return True immediately on a match — this enables the O(1) best case." },
    { line: 6, executable: true, explanation: "If the loop finishes with no match, return False (worst case scanned all n)." },
    { line: 7, executable: false, explanation: "Blank line." },
    { line: 8, executable: false, explanation: "Comment: best case (target first)." },
    { line: 9, executable: true, explanation: "contains([5,1,4], 5): matches at index 0 → True after one comparison." },
    { line: 10, executable: false, explanation: "Comment: worst case (target absent)." },
    { line: 11, executable: true, explanation: "contains([5,1,4], 9): no match → False after scanning all 3 elements." },
  ],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [{ role: "pointer", label: "x", source: "x" }],
    },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "For a 100-element list, how many comparisons does the best case take, and the worst case?", answer: "Best: 1 (match at index 0). Worst: 100 (absent → scan all).", explanation: "The early return gives O(1) best case; an absent target forces scanning all n = 100 elements in the worst case." },
  ],

  experiments: [
    "Search for the last element and count comparisons — it equals n (a worst-case-like scan).",
    "Search an empty list and confirm zero comparisons and a False result.",
    "Change the target to one that appears twice and see it returns at the first occurrence.",
  ],

  exercises: [
    {
      id: "cases-predict-1",
      kind: "predict-state",
      prompt: "State the case: linear search where the target is the LAST element. Best, average, or worst-like?",
      expected: "Worst-like: it scans all n elements before finding it, which is the maximum work O(n).",
      hints: ["How many elements are checked before the match?", "All of them.", "That is the maximum → worst-case O(n)."],
    },
    {
      id: "cases-choose-1",
      kind: "choose-approach",
      prompt: "Two algorithms both sort n items: one is O(n log n) worst case, the other averages O(n log n) but is O(n²) worst case. Which is safer for untrusted input, and why?",
      expected: "The guaranteed O(n log n) worst case, because untrusted/adversarial input could deliberately trigger the other's O(n²) worst case.",
      hints: ["Which bound can an adversary exploit?", "A bad worst case can be forced by crafted input.", "Prefer the guaranteed worst-case bound for untrusted input."],
    },
  ],

  review: `The same algorithm's cost varies with the input: **best** (luckiest, e.g. O(1) early match), **worst** (unluckiest, e.g. O(n) absent target — the guarantee), and **average** (expected, ~n/2 → O(n)). Always **state the case** with a bound. Early exits improve the best case but not the worst.`,

  expectedOutput: "True\nFalse\n",

  references: [
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/AlgorithmAnalysis/BigONotation.html",
      title: "Analysis / Big-O — Problem Solving with Algorithms and DS using Python (Runestone)",
      section: "Best/worst/average case discussion",
      topic: "dsa/cases",
      purpose: "Confirm best/worst/average framing for search and the meaning of the worst-case guarantee.",
      verifiedClaims: ["Linear search is O(1) best case and O(n) worst case", "Average case depends on the input distribution"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 15,
    contentHash: "ebef74822fbaf2cc",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
