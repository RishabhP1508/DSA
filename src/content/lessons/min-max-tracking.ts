/**
 * Lesson: Min/max tracking (Stacks and queues). Verified on CPython 3.14.
 * Output: "1\n3\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# A stack that also reports its current minimum in O(1).
class MinStack:
    def __init__(self):
        self.stack = []
        self.mins = []            # mins[i] = min of stack[0..i]
    def push(self, x):
        self.stack.append(x)
        m = x if not self.mins else min(x, self.mins[-1])
        self.mins.append(m)       # carry the running minimum
    def pop(self):
        self.mins.pop()
        return self.stack.pop()
    def get_min(self):
        return self.mins[-1]      # O(1): top of the mins stack

ms = MinStack()
ms.push(3); ms.push(1); ms.push(2)
print(ms.get_min())               # min of {3,1,2} = 1
ms.pop(); ms.pop()
print(ms.get_min())               # only {3} left -> 3`;

export const minMaxTracking: LessonDefinition = {
  id: "min-max-tracking",
  title: "Min/Max Tracking (Min Stack)",
  area: "Stacks and queues",
  prerequisites: ["stack-queue-operations", "classes"],

  explanation: `Sometimes you need a stack that can also tell you its **current minimum (or maximum) in O(1)** at any moment — even as items are pushed and popped. Scanning for the min each time would be O(n); the trick is to **carry the running minimum alongside the stack**.

The **min stack** keeps a second, parallel stack \`mins\` where \`mins[i]\` is the minimum of everything from the bottom up to level \`i\`. On **push(x)**, we push \`min(x, current_min)\` onto \`mins\`. On **pop**, we pop both stacks together. So \`get_min\` is just reading the top of \`mins\` — **O(1)**. The key idea is that the minimum is a property of a *prefix* of the stack, and since a stack only changes at the top, we can maintain that prefix-min incrementally.

Every operation is **O(1)**, at the cost of **O(n)** extra space for the second stack. The same pattern gives a max stack (carry the running max) and underpins the **sliding-window maximum** (using a monotonic deque). The cue: "need the extreme of a changing collection, fast" → carry it alongside.`,

  vocabulary: [
    { term: "Min stack", definition: "A stack that also returns its current minimum in O(1)." },
    { term: "Auxiliary stack", definition: "A parallel stack holding the running minimum at each level." },
    { term: "Running minimum", definition: "The smallest value among all currently-stacked elements." },
    { term: "Prefix property", definition: "The min depends only on a prefix of the stack, so it updates with push/pop." },
  ],

  concepts: {
    purpose: "Report the extreme (min/max) of a stack in O(1) while supporting push/pop.",
    operations: "On push, store min(x, previous min); on pop, pop both; get_min reads the mins top.",
    uses: "Min/max stack interview problem, sliding-window extremes (with a deque), stack-based monotonic tracking.",
    tradeoffs: "O(1) per operation but O(n) extra space; a single value can't track the min through pops (you need history).",
    commonMistakes: "Keeping only one min variable (wrong after popping the current min); forgetting to pop the mins stack in lockstep; mixing up min vs max direction.",
    edgeCases: "Empty stack: get_min should be guarded. Duplicate minimums are handled by storing per-level mins. Pushing the same value repeatedly keeps the min stable.",
  },

  complexity: [
    { operation: "push / pop / get_min", best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(n)", note: "Each op O(1); parallel mins stack costs O(n) space." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements currently on the stack" }],
    costModel: "append/pop and min-of-two are O(1). Reading the top of a list is O(1).",
    time: {
      bound: "O(1)",
      case: "worst",
      explanation: "push does two O(1) appends plus one min of two values; pop does two O(1) pops; get_min reads the top of the mins stack — O(1). Every operation is constant time regardless of stack size, because the running minimum is maintained incrementally rather than recomputed.",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "The auxiliary mins stack mirrors the main stack, storing one running-minimum value per element — O(n) extra space. That is the space-for-time trade enabling O(1) get_min.",
      inputOutputNote: "Both the main stack and the mins stack scale with the number of pushed elements.",
    },
    derivation: [
      { lines: [7, 8, 9], description: "push: two appends and one min-of-two — O(1).", cost: "O(1)", dimension: "time" },
      { lines: [11, 12], description: "pop: two O(1) pops.", cost: "O(1)", dimension: "time" },
      { lines: [14], description: "get_min: read the top of mins — O(1).", cost: "O(1)", dimension: "time" },
      { lines: [5, 9], description: "The parallel mins stack stores one value per element.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["append/pop are amortized O(1).", "get_min is called on a non-empty stack (guard otherwise)."],
    tradeoffs: "A single min variable is O(1) space but cannot restore the correct min after popping the minimum; the parallel stack pays O(n) space to make every op O(1).",
    counters: [
      { label: "pushes", definition: "executions of push body (line 7)", countLines: [7] },
      { label: "pops", definition: "executions of pop body (line 12)", countLines: [12] },
    ],
    fixedDataNote: "This run pushes 3 values then pops 2; get_min stays O(1) throughout. The O(n) space bound reflects the parallel mins stack for n elements.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: a stack that reports its min in O(1)." },
    { line: 2, executable: true, explanation: "Define the MinStack class." },
    { line: 3, executable: true, explanation: "The constructor sets up two lists." },
    { line: 4, executable: true, explanation: "The main stack of values." },
    { line: 5, executable: true, explanation: "The parallel mins stack: mins[i] is the min of stack[0..i]." },
    { line: 6, executable: true, explanation: "push(x): add x." },
    { line: 7, executable: true, explanation: "Append x to the main stack." },
    { line: 8, executable: true, explanation: "Compute the new running min: x if empty, else min(x, previous min)." },
    { line: 9, executable: true, explanation: "Carry that running minimum onto the mins stack." },
    { line: 10, executable: true, explanation: "pop(): remove the top of both stacks." },
    { line: 11, executable: true, explanation: "Pop the mins stack in lockstep." },
    { line: 12, executable: true, explanation: "Pop and return the main value." },
    { line: 13, executable: true, explanation: "get_min(): the current minimum." },
    { line: 14, executable: true, explanation: "Just read the top of the mins stack — O(1)." },
    { line: 15, executable: false, explanation: "Blank line." },
    { line: 16, executable: true, explanation: "Create a MinStack." },
    { line: 17, executable: true, explanation: "Push 3, 1, 2." },
    { line: 18, executable: true, explanation: "get_min over {3,1,2} → 1." },
    { line: 19, executable: true, explanation: "Pop twice, leaving {3}." },
    { line: 20, executable: true, explanation: "get_min over {3} → 3." },
  ],

  bindings: [
    { variable: "ms", model: "object" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why isn't a single `min_value` variable enough to support get_min through pops?", answer: "Because when you pop the current minimum, you'd need the previous minimum, which a single variable no longer holds — you need the per-level history the parallel stack provides.", explanation: "A lone variable tracks only the current min; once it's popped, the earlier minimum is lost. The parallel mins stack keeps the running minimum for every level, so popping restores the correct earlier min in O(1)." },
  ],

  experiments: [
    "Push values including duplicates of the minimum and watch get_min stay correct after pops.",
    "Change min to max to build a MaxStack.",
    "Add a guard so get_min on an empty stack returns None.",
  ],

  exercises: [
    {
      id: "min-complete-1",
      kind: "complete-code",
      prompt: "Complete push so the mins stack carries the running minimum.",
      starterCode: "def push(self, x):\n    self.stack.append(x)\n    # TODO: append the running minimum to self.mins\n    pass",
      expected: "def push(self, x):\n    self.stack.append(x)\n    m = x if not self.mins else min(x, self.mins[-1])\n    self.mins.append(m)",
      hints: ["The new min is x compared with the previous min.", "Handle the empty case (first push).", "m = x if not self.mins else min(x, self.mins[-1]); self.mins.append(m)"],
    },
    {
      id: "min-choose-1",
      kind: "choose-approach",
      prompt: "You need the maximum within every sliding window of size k over an array, in O(n). Is a min/max stack enough, or do you need something else?",
      expected: "You need a monotonic DEQUE (double-ended), not a plain stack: it lets you drop out-of-window and dominated elements from both ends, giving O(n) total for sliding-window maximum.",
      hints: ["A stack only changes at one end; windows drop elements at both ends.", "You must remove from the front (out of window) and back (dominated).", "Use a monotonic deque."],
    },
  ],

  review: `A **min stack** reports its minimum in **O(1)** by carrying a **running minimum** on a parallel stack: push \`min(x, prev_min)\`, pop both together, and read the mins top for get_min. Every op is **O(1)** at **O(n)** extra space. A single variable can't survive popping the min — you need the per-level history. The idea extends to max stacks and, via a monotonic deque, to sliding-window extremes.`,

  expectedOutput: "1\n3\n",

  references: [
    {
      url: "https://cp-algorithms.com/data_structures/stack_queue_modification.html",
      title: "Minimum stack / minimum queue — CP-Algorithms",
      section: "Stack modification to retrieve the minimum",
      topic: "stacks/min-max-tracking",
      purpose: "Confirm the auxiliary-stack technique for O(1) minimum retrieval and its O(n) space.",
      verifiedClaims: ["Carrying a running minimum on a parallel stack gives O(1) get_min with O(n) space"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Stack — Min Stack",
      topic: "stacks/min-max-tracking",
      purpose: "Cross-check the Min Stack problem and its O(1) operations.",
      verifiedClaims: ["Min Stack supports push/pop/getMin in O(1) using an auxiliary structure"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "3919ac49b17bad05",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
