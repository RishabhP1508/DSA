/**
 * Lesson: Loops (Programming foundations). Verified on CPython 3.14.
 * Output: "27\n0\n1\n2\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# A for loop iterates over an iterable, reading one item at a time (here, a list).
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

  explanation: `A **loop** repeats work so you do not have to write it out by hand. A **for loop** iterates over an **iterable** — any object that provides its items one at a time — running its body for each item in turn. A list like \`nums\` is the common example (strings, ranges, and dictionary views are iterables too). Here the loop adds every number in \`nums\` to a running \`total\`. This "accumulator" pattern (start at 0, add each item) is everywhere in DSA. (Iterating a list does not change it: \`nums\` still contains its elements after the loop. Not every iterable behaves this way — some, like a generator, yield their items only once — but a plain list can be looped over again.)

A **while loop** repeats *as long as* a condition is True. You must make progress toward making that condition False (here, \`i = i + 1\`), or the loop never ends — an **infinite loop**.

The key mental model: when a for loop **finishes normally**, its body runs **once per item** (n items → n iterations). In this example the loop visits every item; some loops can stop early, so they run fewer times. A while loop runs until its condition becomes False. The number of iterations — together with how much work each iteration does — is what drives an algorithm's time complexity.`,

  vocabulary: [
    { term: "Loop", definition: "A construct that repeats a block of code." },
    { term: "for loop", definition: "Runs its body once for each item an iterable provides (a list here); when it finishes normally that is once per item, but it can also stop early." },
    { term: "Iterable", definition: "Any object a for loop can iterate over, which provides its items one at a time — e.g. a list, string, range, or dictionary view." },
    { term: "while loop", definition: "Repeats while a condition remains True." },
    { term: "Iteration", definition: "One pass through the loop body." },
    { term: "Accumulator", definition: "A variable that builds up a result across iterations, e.g. a running total." },
    { term: "Infinite loop", definition: "A loop whose condition never becomes False, so it never stops." },
  ],

  concepts: {
    purpose: "Loops process collections and repeat steps — the basis of searching, summing, scanning, and most algorithms.",
    operations: "Iterate an iterable such as a list (for), repeat on a condition (while), and accumulate results across iterations.",
    uses: "Summing, counting, searching, building lists, and driving pointer/window techniques.",
    tradeoffs: "A for loop is the natural choice when you are processing the items an iterable provides — it works even if the iterable's length is unknown, since it simply stops when the items run out. A while loop repeats according to a condition you write, which is flexible but risks running forever if the condition never becomes False.",
    commonMistakes: "Forgetting to advance a while loop's variable (infinite loop); off-by-one errors in ranges; modifying a list while iterating it.",
    edgeCases: "An empty sequence means a for loop body never runs; a while condition that starts False runs zero times.",
  },

  complexity: [
    { operation: "for over n items", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "One constant-time body per item; a single accumulator." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of items in nums (len(nums)) — what the for loop iterates over" },
      { symbol: "m", meaning: "a generalized while-loop bound; in THIS program the while limit is the fixed constant 3, independent of n" },
    ],
    costModel: "A loop's total time is ITERATIONS × WORK PER ITERATION. Here each iteration does a constant amount of work (one addition, or one print and one increment) FOR THE SMALL NUMBERS SHOWN, so the per-iteration cost is treated as O(1) and the totals reduce to the iteration counts. That constant-body assumption is not free in general: a heavier body (e.g. a nested loop, or an `x in list` membership scan) would multiply the cost, and even a plain addition is only constant for small integers — Python ints are arbitrary-precision, so adding very large integers costs more than O(1).",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "Total time = iterations × work per iteration. The two loops are SEPARATE (one after the other), so their costs ADD. The for loop runs once per item in nums — n iterations — each doing one addition that is constant-time for the small values here, so n × O(1) = O(n). The displayed while loop runs a FIXED 3 times (its limit is the literal 3, independent of n), so it is O(1) here. Sequential O(n) + O(1) = O(n), so the whole displayed program is O(n) in n = len(nums). Two caveats on the per-iteration cost: a non-constant body would change the product (an O(n) body inside the for loop would make it O(n²)), and because Python ints are arbitrary-precision, adding very large integers would cost more than O(1) per step. (Also: if the while limit were a variable m rather than the constant 3, that loop would be O(m) and the program O(n + m) — a generalization, not what this code does.)",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "The loop itself uses O(1) EXTRA space under a UNIT-COST analysis — one that treats each value (the running `total`, the item `x`, the counter `i`) as a single bounded-size slot: only a fixed set of such variables is kept and nothing new is allocated per iteration, no matter how many items are looped. The same caveat as for time applies: Python integers are arbitrary-precision, so a `total` that grows very large needs more digits of storage, and under a bit-cost model that is no longer strictly constant. For the small numbers shown here the unit-cost O(1) is the right description. Separately, the list being iterated holds n items and so occupies O(n) storage — that is the data itself, not extra space introduced by the loop.",
      inputOutputNote: "In THIS displayed code `nums` is created as a fixed three-item list literal `[4, 8, 15]`, so n = 3 here. Generalizing to a list of n items (e.g. one passed into a function), that list occupies O(n) storage while the loop still adds only O(1) extra space (treating each stored value as bounded-size).",
    },
    derivation: [
      { lines: [4, 5], description: "The for-loop body runs once per item in nums — n constant-time additions.", cost: "O(n)", dimension: "time" },
      { lines: [9, 10, 11], description: "The displayed while loop runs a FIXED 3 times (limit is the constant 3, independent of n), so O(1) here. A generalized limit m would make it O(m).", cost: "O(1)", dimension: "time" },
      { lines: [3, 8], description: "A fixed number of accumulator/counter variables, each treated as a bounded-size slot (unit-cost). Arbitrary-precision growth of `total` would need more digits under a bit-cost model.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Total time is iterations × work per iteration.", "Each iteration's body is constant time (simple addition/print) FOR THE SMALL NUMBERS SHOWN; a heavier body, or arbitrary-precision addition on very large integers, would raise the per-iteration cost above O(1).", "Reading each list item is O(1).", "In this displayed code `nums` is a fixed three-item list literal, so n = 3; the O(n) bound describes the generalization to an n-item list."],
    tradeoffs: "Summing with a loop is O(n); Python's built-in sum(nums) is also O(n) but faster in practice and clearer. The loop is shown so the per-item cost is visible.",
    counters: [
      { label: "for iterations", definition: "executions of the for-body accumulate line (line 5)", countLines: [5] },
      { label: "while iterations", definition: "executions of the while-body print line (line 10)", countLines: [10] },
    ],
    fixedDataNote: "This run uses a fixed three-item list literal `nums = [4, 8, 15]` (so the for loop runs 3 times here) and a while loop with the fixed limit 3 (always 3 iterations, independent of n). Because `nums` is a hard-coded literal rather than supplied input, n = 3 in this displayed code; the O(n) bound describes the generalization to a larger n-item list (for example one passed into a function), where the n-item list occupies O(n) storage and the loop still adds O(1) extra space.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: a for loop iterates over an iterable (here a list), reading one item at a time." },
    { line: 2, executable: true, explanation: "Create the list [4, 8, 15] and bind it to nums." },
    { line: 3, executable: true, explanation: "Initialise the accumulator total to 0." },
    { line: 4, executable: true, explanation: "Start the for loop; it draws items from the iterable nums one at a time, so x takes each value in turn (4, then 8, then 15)." },
    { line: 5, executable: true, explanation: "Add the current x to total. After all items: 0+4+8+15 = 27." },
    { line: 6, executable: true, explanation: "Print total → 27." },
    { line: 7, executable: false, explanation: "Comment: a while loop repeats on a condition." },
    { line: 8, executable: true, explanation: "Initialise the counter i to 0." },
    { line: 9, executable: true, explanation: "Loop while i < 3. Checked before each iteration." },
    { line: 10, executable: true, explanation: "Print the current i (0, 1, 2 across iterations)." },
    { line: 11, executable: true, explanation: "Increment i. This is what eventually makes i < 3 False and ends the loop." },
  ],

  // The for-loop variable `x` is a VALUE taken from nums, not an index into it,
  // and the while-loop counter `i` does not index nums at all — so nums carries
  // NO pointer/highlight overlay (an index overlay here would mark a position
  // unrelated to what the loop is doing). The current item `x` and the counter
  // `i` are observed directly in the variables panel from the recorded frame.
  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [],
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
      prompt: "`count_up(n)` should count 0, 1, ... up to n (exclusive) and return the final counter value. This while loop never stops because the counter never changes. Fix it.",
      starterCode: "def count_up(n):\n    i = 0\n    while i < n:\n        print(i)\n    return i",
      expected: "def count_up(n):\n    i = 0\n    while i < n:\n        print(i)\n        i = i + 1\n    return i",
      hints: ["What must change each iteration for i < n to become False?", "The counter must move toward the limit.", "Add i = i + 1 inside the loop."],
    },
    {
      id: "loop-complete-1",
      kind: "complete-code",
      prompt: "Complete `count_evens(nums)` so it returns how many numbers in nums are even.",
      starterCode: "def count_evens(nums):\n    count = 0\n    for x in nums:\n        # TODO: if x is even, add 1 to count\n        pass\n    return count",
      expected: "def count_evens(nums):\n    count = 0\n    for x in nums:\n        if x % 2 == 0:\n            count = count + 1\n    return count",
      hints: ["Even means divisible by 2.", "Use the modulo operator: x % 2 == 0.", "Inside the if, do count = count + 1."],
    },
  ],

  review: `Loops repeat work: a **for** loop iterates over an **iterable** (a list here), running its body once per item when it finishes normally — though it can stop early. A **while** loop runs until its condition is False (advance the counter or it loops forever). Time complexity is **iterations × work per iteration**: a single pass over n items with a constant-time body is **O(n)** time, using **O(1)** extra space (beyond the n-item list itself, which already occupies **O(n)** storage).`,

  expectedOutput: "27\n0\n1\n2\n",

  references: [
    {
      url: "https://docs.python.org/3.14/tutorial/controlflow.html",
      title: "More Control Flow Tools — Python 3.14 documentation",
      section: "4.2 for Statements",
      topic: "foundations/loops",
      purpose: "Confirm the for statement iterates over the items of any sequence, in order, on Python 3.14.",
      verifiedClaims: ["Python's for statement iterates over the items of any sequence, in the order they appear"],
      accessDate: "2026-10-03",
    },
    {
      url: "https://docs.python.org/3.14/reference/compound_stmts.html#the-for-statement",
      title: "Compound statements — Python 3.14 documentation",
      section: "8.3. The for statement",
      topic: "foundations/loops",
      purpose: "Authoritative language-reference definition that `for` iterates over an iterable one item at a time, and the early-exit semantics (break terminates; continue advances to the next item).",
      verifiedClaims: [
        "The for statement iterates over the elements of a sequence (such as a string, tuple or list) or other iterable object.",
        "An iterator is created for the iterable and the suite is executed once for each item the iterator provides, until the iterator is exhausted.",
        "A break statement in the loop body terminates the loop early; a continue statement skips the rest of the body and continues with the next item.",
      ],
      conventions: ["Python 3.14 language reference"],
      accessDate: "2026-10-04",
    },
    {
      url: "https://runestone.academy/ns/books/published/fopp/Iteration/TheAccumulatorPattern.html",
      title: "7.6 The Accumulator Pattern — Foundations of Python Programming (Runestone)",
      section: "The Accumulator Pattern",
      topic: "foundations/loops",
      purpose: "Cross-check the accumulator pattern (initialise an accumulator, iterate, update each pass) taught in the for-loop example.",
      verifiedClaims: ["The accumulator pattern initialises a variable, then updates it once per iteration over a sequence"],
      accessDate: "2026-10-03",
    },
  ],
  evidence: {
    inventoryVersion: 19,
    contentHash: "fcadc9eb125d967c",
    verifiedAt: "2026-10-04",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
    reviewBatch: 1,
  },
};
