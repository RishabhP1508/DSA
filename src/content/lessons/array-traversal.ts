/**
 * Lesson: Array traversal (Arrays). Verified on CPython 3.14.
 * Output: "0 5\n1 2\n2 9\n3 1\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Visit every element of a list once, by index.
nums = [5, 2, 9, 1]
for i in range(len(nums)):
    print(i, nums[i])`;

export const arrayTraversal: LessonDefinition = {
  id: "array-traversal",
  title: "Array Traversal",
  area: "Arrays",
  prerequisites: ["loops"],

  explanation: `An **array** (in Python, a **list**) stores elements in a row, each reachable by an **index** starting at 0. **Traversal** means visiting each element in order — the single most common thing you do with an array.

There are two styles. \`for x in nums\` gives you each *value*; \`for i in range(len(nums))\` gives you each *index*, and you read \`nums[i]\`. Use the index form when you need the position too (for pointers, neighbours, or writing back into the array).

Because a Python list is backed by a contiguous array, reading \`nums[i]\` is **O(1)** — direct random access, unlike a linked list. Visiting all n elements is therefore **O(n)** total. The index \`i\` in the visualization shows exactly which cell you are on at each step.`,

  vocabulary: [
    { term: "Array / list", definition: "An ordered collection of elements, each accessible by index." },
    { term: "Index", definition: "The position of an element, starting at 0 for the first." },
    { term: "Traversal", definition: "Visiting each element in order." },
    { term: "Random access", definition: "Reading any index directly in O(1), which arrays support." },
    { term: "len()", definition: "Built-in that returns the number of elements." },
  ],

  concepts: {
    purpose: "Traversal is the foundation of searching, summing, transforming, and every array pattern.",
    operations: "Read nums[i] in O(1); iterate by value (for x in nums) or by index (range(len(nums))).",
    uses: "Summing, searching, building results, and driving two-pointer/window techniques that need indices.",
    tradeoffs: "Index access is O(1) for arrays but O(n) for linked lists; iterating by value is cleaner when the position is not needed.",
    commonMistakes: "Off-by-one with range (use range(len(nums)), not range(len(nums)+1)); modifying the list length while iterating it.",
    edgeCases: "Empty list: the loop body never runs. Negative indices count from the end (nums[-1] is the last).",
  },

  complexity: [
    { operation: "Traverse whole array", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "Each of n elements visited once via O(1) index access." },
    { operation: "Access nums[i]", best: "O(1)", average: "O(1)", worst: "O(1)", note: "Direct random access." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in nums" }],
    costModel: "Reading nums[i] by index is O(1) (contiguous storage). Each loop pass does O(1) work.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "The loop runs once per index from 0 to n-1, doing a constant amount of work each pass (one index read and one print). So the total grows in direct proportion to n — linear.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Only the loop index i is kept; no new storage grows with n.",
      inputOutputNote: "The list of n elements is the input, not auxiliary space.",
    },
    derivation: [
      { lines: [3, 4], description: "The loop body runs n times; each index read nums[i] is O(1).", cost: "O(n)", dimension: "time" },
      { lines: [3], description: "One loop variable regardless of n.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Index access nums[i] is O(1) (true for Python lists).", "print of one pair is constant work."],
    tradeoffs: "A linked list traverses in O(n) too, but cannot do O(1) index access; arrays win when you need positions.",
    counters: [{ label: "elements visited", definition: "executions of the loop body (line 4)", countLines: [4] }],
    fixedDataNote: "This run uses a fixed 4-element list, so you observe 4 visits. The O(n) bound generalises to n elements.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: visit every element once by index." },
    { line: 2, executable: true, explanation: "Create the list [5, 2, 9, 1]. Indices are 0..3." },
    { line: 3, executable: true, explanation: "Loop i over 0, 1, 2, 3 (range(len(nums)) = range(4))." },
    { line: 4, executable: true, explanation: "Print the index and the element at that index. This runs once per element." },
  ],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [{ role: "pointer", label: "i", source: "i" }],
    },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "How many times does line 4 run for this 4-element list, and for an n-element list?", answer: "4 times here; n times in general.", explanation: "range(len(nums)) yields one index per element, so the body runs once per element — 4 now, n for an n-element list (O(n))." },
  ],

  experiments: [
    "Switch to `for x in nums:` and print just x — note you lose the index.",
    "Print nums[-1] to see negative indexing from the end.",
    "Traverse an empty list and confirm the loop body never runs.",
  ],

  exercises: [
    {
      id: "arr-trav-complete-1",
      kind: "complete-code",
      prompt: "Complete the loop to sum all elements of nums.",
      starterCode: "nums = [5, 2, 9, 1]\ntotal = 0\nfor i in range(len(nums)):\n    # TODO: add nums[i] to total\n    pass\nprint(total)",
      expected: "nums = [5, 2, 9, 1]\ntotal = 0\nfor i in range(len(nums)):\n    total = total + nums[i]\nprint(total)",
      hints: ["Access the element with nums[i].", "Add it into the accumulator.", "total = total + nums[i]"],
    },
    {
      id: "arr-trav-predict-1",
      kind: "predict-state",
      prompt: "What is the time complexity of reading nums[i] for a Python list, and of visiting all n elements?",
      expected: "nums[i] is O(1); visiting all n is O(n).",
      hints: ["Lists support direct index access.", "One access is constant time.", "n accesses is O(n)."],
    },
  ],

  review: `An **array/list** stores elements by **index** from 0, with **O(1)** random access. **Traversal** visits each of n elements once — **O(n)** time, **O(1)** extra space. Use \`for x in nums\` for values, \`range(len(nums))\` when you need the index.`,

  expectedOutput: "0 5\n1 2\n2 9\n3 1\n",

  references: [
    {
      url: "https://docs.python.org/3.14/tutorial/introduction.html",
      title: "An Informal Introduction to Python — Python 3.14 documentation",
      section: "Lists",
      topic: "arrays/traversal",
      purpose: "Confirm list indexing (0-based, negative indices) and iteration behaviour.",
      verifiedClaims: ["Lists are indexed from 0", "Negative indices count from the end"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://wiki.python.org/moin/TimeComplexity",
      title: "TimeComplexity — Python Wiki",
      section: "list — Get Item",
      topic: "arrays/traversal",
      purpose: "Confirm that list index access is O(1).",
      verifiedClaims: ["list index get is O(1)"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "a6683bf342da2d72",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
