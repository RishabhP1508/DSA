/**
 * Lesson: Two pointers (Arrays). Verified on CPython 3.14.
 * Output: "[5, 4, 3, 2, 1]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Two pointers: one from each end, moving toward the middle.
arr = [1, 2, 3, 4, 5]
lo = 0
hi = len(arr) - 1
while lo < hi:
    # Swap the two ends, then step both inward.
    arr[lo], arr[hi] = arr[hi], arr[lo]
    lo = lo + 1
    hi = hi - 1
print(arr)`;

export const twoPointers: LessonDefinition = {
  id: "two-pointers",
  title: "Two Pointers",
  area: "Arrays",
  prerequisites: ["array-traversal"],

  explanation: `The **two-pointer** technique keeps two indices into an array and moves them under a rule, instead of using nested loops. A classic form starts one pointer at each **end** and moves them **toward the middle** — used for reversing in place, checking palindromes, and (on a sorted array) finding a pair with a target sum.

Here we reverse the array: swap the elements at \`lo\` and \`hi\`, then move \`lo\` right and \`hi\` left. When they meet, every element has been swapped into place. Because each element is touched once, the whole reversal is **O(n)** with **O(1)** extra space — no second array needed.

The other common form is the **fast/slow** or **same-direction** two pointers (e.g. removing duplicates, or a "write" pointer trailing a "read" pointer). The shared idea: replace an O(n²) brute force with a single coordinated pass.`,

  vocabulary: [
    { term: "Two pointers", definition: "Two indices moved under a rule to solve a problem in one pass." },
    { term: "Converging pointers", definition: "Pointers starting at both ends and moving toward each other." },
    { term: "Same-direction pointers", definition: "A read pointer and a write pointer moving the same way (e.g. compaction)." },
    { term: "In place", definition: "Modifying the input using O(1) extra space, no new array." },
    { term: "Swap", definition: "Exchange two elements; in Python, a, b = b, a." },
  ],

  concepts: {
    purpose: "Two pointers turn many O(n^2) scans into a single O(n) pass with O(1) space.",
    operations: "Initialise two indices; move them under a condition until they meet or cross.",
    uses: "Reversing, palindrome checks, pair-sum on sorted arrays, merging, in-place compaction.",
    tradeoffs: "Very cheap in time and space, but the converging form usually needs sorted or symmetric structure to be correct.",
    commonMistakes: "Wrong loop condition (lo <= hi swaps the middle element back); forgetting to move a pointer (infinite loop); assuming it works on unsorted data for pair-sum.",
    edgeCases: "Empty or single-element array: the loop does not run, which is correct (already reversed).",
  },

  complexity: [
    { operation: "Reverse in place", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "About n/2 swaps; no extra array." },
  ],

  complexityExplanation: {
    variables: [{ symbol: "n", meaning: "the number of elements in arr" }],
    costModel: "Each swap and each pointer move is O(1). One list index write is O(1).",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "The two pointers start n-1 apart and move one step closer each pass, so the loop runs about n/2 times. Each pass does one O(1) swap. n/2 constant-time steps is O(n) — dropping the constant 1/2.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Only two index variables (lo, hi) are used; the swap reuses the array itself. No storage grows with n — the reversal is in place.",
      inputOutputNote: "The array is modified in place; it is the input, not extra space.",
    },
    derivation: [
      { lines: [5], description: "The loop runs about n/2 times as the pointers converge.", cost: "O(n)", dimension: "time" },
      { lines: [7, 8, 9], description: "Each pass does one O(1) swap and two O(1) pointer moves.", cost: "O(1)", dimension: "time" },
      { lines: [3, 4], description: "Two index variables; the swap needs no extra array.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["List index read/write is O(1).", "Tuple swap a, b = b, a is constant time for references."],
    tradeoffs: "Building a reversed copy (arr[::-1]) is also O(n) time but uses O(n) extra space; the two-pointer swap is O(1) space.",
    counters: [{ label: "swaps", definition: "executions of the swap line (line 7)", countLines: [7] }],
    fixedDataNote: "This run reverses a 5-element array in 2 swaps (n/2 rounded down). The O(n) bound describes scaling with n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: one pointer from each end." },
    { line: 2, executable: true, explanation: "Create arr = [1, 2, 3, 4, 5]." },
    { line: 3, executable: true, explanation: "lo starts at the first index, 0." },
    { line: 4, executable: true, explanation: "hi starts at the last index, len(arr)-1 = 4." },
    { line: 5, executable: true, explanation: "Loop while lo is strictly left of hi. Using < (not <=) avoids re-swapping the middle." },
    { line: 6, executable: false, explanation: "Comment describing the swap-and-step." },
    { line: 7, executable: true, explanation: "Swap the elements at lo and hi in one statement." },
    { line: 8, executable: true, explanation: "Move lo one step right." },
    { line: 9, executable: true, explanation: "Move hi one step left. When lo meets/passes hi, the loop ends." },
    { line: 10, executable: true, explanation: "Print the reversed array → [5, 4, 3, 2, 1]." },
  ],

  bindings: [
    {
      variable: "arr",
      model: "array",
      overlays: [
        { role: "pointer", label: "lo", source: "lo" },
        { role: "pointer", label: "hi", source: "hi" },
      ],
    },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "How many swaps does reversing a 5-element array take, and why not 5?", answer: "2 swaps — pointers meet in the middle, so about n/2 swaps.", explanation: "Each swap fixes two elements at once, and the middle element (odd length) needs no swap, so it takes floor(n/2) = 2 swaps." },
  ],

  experiments: [
    "Change the condition to `lo <= hi` and watch the middle element get swapped with itself (harmless here, but note the extra step).",
    "Reverse a 4-element array and count swaps (should be 2 = n/2).",
    "Adapt it to check a palindrome: compare arr[lo] and arr[hi] instead of swapping.",
  ],

  exercises: [
    {
      id: "tp-fix-1",
      kind: "fix-mistake",
      prompt: "This reversal loops forever. Fix it.",
      starterCode: "arr = [1, 2, 3]\nlo = 0\nhi = len(arr) - 1\nwhile lo < hi:\n    arr[lo], arr[hi] = arr[hi], arr[lo]",
      expected: "arr = [1, 2, 3]\nlo = 0\nhi = len(arr) - 1\nwhile lo < hi:\n    arr[lo], arr[hi] = arr[hi], arr[lo]\n    lo = lo + 1\n    hi = hi - 1",
      hints: ["What must change each pass for lo < hi to become False?", "Both pointers must move toward the middle.", "Add lo = lo + 1 and hi = hi - 1."],
    },
    {
      id: "tp-choose-1",
      kind: "choose-approach",
      prompt: "You must decide if a string reads the same forwards and backwards. Which two-pointer form fits: converging from both ends, or two same-direction pointers?",
      expected: "Converging pointers: compare the characters at lo and hi as they move inward; mismatch means not a palindrome.",
      hints: ["A palindrome is symmetric around its center.", "Compare the ends and move inward.", "Converging (both-ends) pointers."],
    },
  ],

  review: `**Two pointers** coordinate two indices in a single pass instead of nested loops. The converging form (one from each end) reverses or checks palindromes in **O(n)** time and **O(1)** space. Use \`<\` so the middle isn't re-swapped, and always move the pointers to guarantee termination.`,

  expectedOutput: "[5, 4, 3, 2, 1]\n",

  references: [
    {
      url: "https://www.geeksforgeeks.org/dsa/two-pointers-technique/",
      title: "Two Pointers Technique — GeeksforGeeks",
      section: "Overview and reverse/pair-sum examples",
      topic: "arrays/two-pointers",
      purpose: "Confirm the two-pointer patterns (converging and same-direction) and their O(n)/O(1) profile.",
      verifiedClaims: ["Two pointers can reverse or find pairs in one O(n) pass with O(1) space"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Two Pointers",
      topic: "arrays/two-pointers",
      purpose: "Cross-check where two pointers sit in the learning progression and which problems use it.",
      verifiedClaims: ["Two pointers is a distinct pattern applied to sorted arrays / palindromes / pair sums"],
      accessDate: "2026-09-20",
    },
  ],
};
