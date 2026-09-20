/**
 * Lesson: Loops (Programming foundations). Verified on CPython 3.14.
 * Output: "27\n0\n1\n2\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# A for loop repeats once for each item in a sequence.
nums = [4, 8, 15]
total = 0
for x in nums:
    total = total + x
print(total)
# A while loop repeats as long as its condition stays True.
i = 0
while i < 3:
    print(i)
    i = i + 1`;

export const loops: LessonDefinition = {
  id: "loops",
  title: "Loops (for and while)",
  area: "Programming foundations",
  prerequisites: ["conditions"],

  explanation: `A **loop** repeats work so you do not have to write it out by hand. A **for loop** walks through each item of a sequence in turn — here it adds every number in \`nums\` to a running \`total\`. This "accumulator" pattern (start at 0, add each item) is everywhere in DSA.

A **while loop** repeats *as long as* a condition is True. You must make progress toward making that condition False (here, \`i = i + 1\`), or the loop never ends — an **infinite loop**.

The key mental model: a for loop runs **once per item** (n items → n iterations), and a while loop runs until its condition breaks. The number of iterations is what drives an algorithm's time complexity.`,

  vocabulary: [
    { term: "Loop", definition: "A construct that repeats a block of code." },
    { term: "for loop", definition: "Repeats once for each item in a sequence." },
    { term: "while loop", definition: "Repeats while a condition remains True." },
    { term: "Iteration", definition: "One pass through the loop body." },
    { term: "Accumulator", definition: "A variable that builds up a result across iterations, e.g. a running total." },
    { term: "Infinite loop", definition: "A loop whose condition never becomes False, so it never stops." },
  ],

  concepts: {
    purpose: "Loops process collections and repeat steps — the basis of searching, summing, scanning, and most algorithms.",
    operations: "Iterate a sequence (for), repeat on a condition (while), accumulate results, break/continue.",
    uses: "Summing, counting, searching, building lists, and driving pointer/window techniques.",
    tradeoffs: "for loops are safest for known sequences; while loops handle unknown counts but risk running forever.",
    commonMistakes: "Forgetting to advance a while loop's variable (infinite loop); off-by-one errors in ranges; modifying a list while iterating it.",
    edgeCases: "An empty sequence means a for loop body never runs; a while condition that starts False runs zero times.",
  },

  complexity: [
    { operation: "for over n items", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "One constant-time body per item; a single accumulator." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of items in the sequence being looped over" }],
    costModel: "Each loop iteration does a constant amount of work (one addition, or one print and one increment).",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "The for loop runs once per item, so with n items it does n constant-time additions — linear in n. The while loop runs a fixed 3 times here; in general a while that counts up to n also runs n times. Total time grows in direct proportion to how many iterations happen.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Only a fixed set of variables is kept (total, x, i). Nothing new is allocated per iteration, so auxiliary space stays constant no matter how many items are looped.",
      inputOutputNote: "The list `nums` of n items is the input, not auxiliary space.",
    },
    derivation: [
      { lines: [4, 5], description: "The for-loop body runs once per item — n constant-time additions.", cost: "O(n)", dimension: "time" },
      { lines: [9, 10, 11], description: "The while-loop body runs once per count up to the limit (3 here, n in general).", cost: "O(n)", dimension: "time" },
      { lines: [3, 8], description: "A fixed number of accumulator/counter variables.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Each iteration's body is constant time (simple addition/print).", "Reading each list item is O(1)."],
    tradeoffs: "Summing with a loop is O(n); Python's built-in sum(nums) is also O(n) but faster in practice and clearer. The loop is shown so the per-item cost is visible.",
    counters: [
      { label: "for iterations", definition: "executions of the for-body accumulate line (line 5)", countLines: [5] },
      { label: "while iterations", definition: "executions of the while-body print line (line 10)", countLines: [10] },
    ],
    fixedDataNote: "This run uses a 3-item list and counts to 3, so you observe 3 + 3 iterations. The O(n) bound describes how those counts grow with larger inputs.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: a for loop repeats per item." },
    { line: 2, executable: true, explanation: "Create the list [4, 8, 15] and bind it to nums." },
    { line: 3, executable: true, explanation: "Initialise the accumulator total to 0." },
    { line: 4, executable: true, explanation: "Start the for loop; x takes each value of nums in turn (4, then 8, then 15)." },
    { line: 5, executable: true, explanation: "Add the current x to total. After all items: 0+4+8+15 = 27." },
    { line: 6, executable: true, explanation: "Print total → 27." },
    { line: 7, executable: false, explanation: "Comment: a while loop repeats on a condition." },
    { line: 8, executable: true, explanation: "Initialise the counter i to 0." },
    { line: 9, executable: true, explanation: "Loop while i < 3. Checked before each iteration." },
    { line: 10, executable: true, explanation: "Print the current i (0, 1, 2 across iterations)." },
    { line: 11, executable: true, explanation: "Increment i. This is what eventually makes i < 3 False and ends the loop." },
  ],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [{ role: "pointer", label: "x-index", source: "i" }],
    },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "How many times does the for-loop body (line 5) run, and what is the final total?", answer: "3 times; total is 27.", explanation: "There are 3 items, so the body runs 3 times, accumulating 4+8+15 = 27." },
  ],

  experiments: [
    "Add a number to `nums` and predict the new total and iteration count.",
    "Change `while i < 3` to `while i < 5` and predict the printed numbers.",
    "Remove line 11 and reason about why the loop would never end (do not run it without Stop).",
  ],

  exercises: [
    {
      id: "loop-fix-1",
      kind: "fix-mistake",
      prompt: "This while loop never stops. Fix it.",
      starterCode: "i = 0\nwhile i < 3:\n    print(i)",
      expected: "i = 0\nwhile i < 3:\n    print(i)\n    i = i + 1",
      hints: ["What must change each iteration for i < 3 to become False?", "The counter must move toward the limit.", "Add i = i + 1 inside the loop."],
    },
    {
      id: "loop-complete-1",
      kind: "complete-code",
      prompt: "Complete the loop so it counts how many numbers in nums are even.",
      starterCode: "nums = [4, 7, 10, 3]\ncount = 0\nfor x in nums:\n    # TODO: if x is even, add 1 to count\n    pass\nprint(count)",
      expected: "nums = [4, 7, 10, 3]\ncount = 0\nfor x in nums:\n    if x % 2 == 0:\n        count = count + 1\nprint(count)",
      hints: ["Even means divisible by 2.", "Use the modulo operator: x % 2 == 0.", "Inside the if, do count = count + 1."],
    },
  ],

  review: `Loops repeat work: a **for** loop runs once per item (n items → n iterations), a **while** loop runs until its condition is False (advance the counter or it loops forever). Iteration count drives time complexity: a single pass over n items is **O(n)** time with **O(1)** extra space.`,

  expectedOutput: "27\n0\n1\n2\n",

  references: [
    {
      url: "https://docs.python.org/3.14/tutorial/controlflow.html",
      title: "More Control Flow Tools — Python 3.14 documentation",
      section: "for Statements / while (introduction.html)",
      topic: "foundations/loops",
      purpose: "Confirm for iterates over sequence items and loop semantics on Python 3.14.",
      verifiedClaims: ["for iterates over the items of a sequence in order"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://runestone.academy/ns/books/published/pythonds3/index.html",
      title: "Problem Solving with Algorithms and Data Structures using Python — Runestone",
      section: "Iteration and accumulation",
      topic: "foundations/loops",
      purpose: "Cross-check the accumulator pattern and per-item linear cost framing for beginners.",
      verifiedClaims: ["Summing n items with a loop performs n additions (linear work)"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "6bdf366e50e0e7ed",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 1,
  },
};
