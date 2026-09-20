/**
 * Lesson: Stack and queue operations (Stacks and queues). Verified on CPython 3.14.
 * Output: "[1, 2, 3]\n3\n[1, 2]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# A stack is Last-In-First-Out (LIFO): add and remove at the same end.
stack = []
stack.append(1)     # push
stack.append(2)     # push
stack.append(3)     # push
print(stack)
print(stack.pop())  # pop returns and removes the LAST item
print(stack)`;

export const stackQueueOperations: LessonDefinition = {
  id: "stack-queue-operations",
  title: "Stack and Queue Operations",
  area: "Stacks and queues",
  prerequisites: ["array-traversal", "classes"],

  explanation: `A **stack** is a **Last-In-First-Out (LIFO)** collection: the last thing you add is the first thing you remove — like a stack of plates. Its two core operations are **push** (add to the top) and **pop** (remove the top). In Python you just use a \`list\`: \`append\` is push and \`pop()\` (no index) removes the last element. Both are **O(1)** (amortized for append).

The mirror image is a **queue** — **First-In-First-Out (FIFO)** — where you add at the back and remove from the front, like a checkout line. Python's list can pop from the front, but \`list.pop(0)\` is **O(n)** (it shifts everything), so for a queue you use \`collections.deque\`, whose \`append\` and \`popleft\` are both **O(1)**.

These two disciplines drive huge parts of DSA: stacks power recursion/backtracking, expression parsing, and "undo"; queues power breadth-first search and scheduling. The key recognition skill is matching the *order* your problem needs (LIFO vs FIFO) to the right structure.`,

  vocabulary: [
    { term: "Stack", definition: "A LIFO collection: the most recently added item is removed first." },
    { term: "Queue", definition: "A FIFO collection: the earliest added item is removed first." },
    { term: "Push / pop", definition: "Add to / remove from the top of a stack." },
    { term: "Enqueue / dequeue", definition: "Add to the back / remove from the front of a queue." },
    { term: "deque", definition: "Python's double-ended queue with O(1) append and popleft." },
    { term: "Top", definition: "The most recently pushed element of a stack (last of the list)." },
  ],

  concepts: {
    purpose: "Stacks and queues impose an order (LIFO/FIFO) that many algorithms rely on.",
    operations: "Stack: append (push), pop (pop top). Queue: deque.append (enqueue), deque.popleft (dequeue).",
    uses: "Stacks: recursion, backtracking, parsing, undo. Queues: BFS, scheduling, buffering.",
    tradeoffs: "list is a perfect stack; for a queue use deque (list.pop(0) is O(n)).",
    commonMistakes: "Using list.pop(0) for a queue (O(n)); popping from an empty stack (IndexError); mixing up which end is the 'top'.",
    edgeCases: "Popping an empty stack/queue raises an error — guard with a length check. A single element behaves the same for both.",
  },

  complexity: [
    { operation: "Stack push/pop (list)", best: "O(1)", average: "O(1)", worst: "O(n)", space: "O(n)", note: "Amortized O(1); rare resize is O(n). Holds n items." },
    { operation: "Queue enqueue/dequeue (deque)", best: "O(1)", average: "O(1)", worst: "O(1)", note: "deque.append / popleft are O(1)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of items currently in the stack/queue" }],
    costModel: "list.append/pop at the end are amortized O(1); deque.append/popleft are O(1). list.pop(0) is O(n) and is avoided.",
    time: {
      bound: "O(1)",
      case: "amortized",
      explanation: "Each push (append) and pop from the end is a constant-time operation — amortized O(1) for append because the backing array occasionally resizes. The program does a fixed number of pushes and one pop, so it is constant work overall. Using a deque for a queue keeps enqueue/dequeue at O(1) too.",
      otherCases: [
        { case: "worst", bound: "O(n)", note: "A single append that triggers a list resize copies all n elements once (amortized away)." },
      ],
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "The stack holds all pushed items, so it uses O(n) space for n items. Each operation adds only O(1) beyond that.",
      inputOutputNote: "The stack list IS the data you build; its O(n) size is inherent.",
    },
    derivation: [
      { lines: [3, 4, 5], description: "Three pushes, each amortized O(1).", cost: "O(1)", dimension: "time" },
      { lines: [7], description: "One pop from the end — O(1).", cost: "O(1)", dimension: "time" },
      { lines: [3, 4, 5], description: "The stack grows to hold n items.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["list.append/pop() act at the end (O(1) amortized).", "A queue would use deque, not list.pop(0)."],
    tradeoffs: "A list makes an ideal stack; for a FIFO queue, deque's O(1) popleft beats list.pop(0)'s O(n) shifting.",
    counters: [{ label: "pushes", definition: "executions of append (lines 3-5)", countLines: [3, 4, 5] }],
    fixedDataNote: "This run pushes 3 items and pops 1, so it is constant work. The O(1)/O(n) bounds generalise to n operations.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: a stack is LIFO." },
    { line: 2, executable: true, explanation: "Start with an empty list used as a stack." },
    { line: 3, executable: true, explanation: "Push 1 (append to the end/top)." },
    { line: 4, executable: true, explanation: "Push 2." },
    { line: 5, executable: true, explanation: "Push 3. The top is now 3." },
    { line: 6, executable: true, explanation: "Print the stack → [1, 2, 3]." },
    { line: 7, executable: true, explanation: "pop() removes and returns the LAST item (3) — LIFO." },
    { line: 8, executable: true, explanation: "Print the stack after the pop → [1, 2]." },
  ],

  bindings: [{ variable: "stack", model: "stack" }],

  prediction: [
    { atEventIndex: 0, prompt: "Why use collections.deque instead of a list for a QUEUE?", answer: "Because a queue removes from the front, and list.pop(0) is O(n) (it shifts every element), while deque.popleft is O(1).", explanation: "A list is O(1) only at its end. Removing from the front shifts all remaining elements — O(n). deque supports O(1) removal from both ends, making it the right queue." },
  ],

  experiments: [
    "Convert this to a queue using deque and popleft; observe FIFO order (1 comes out first).",
    "Pop from an empty stack to see the IndexError, then guard it with `if stack:`.",
    "Push and pop several times and track the top element.",
  ],

  exercises: [
    {
      id: "sq-complete-1",
      kind: "complete-code",
      prompt: "Implement a safe pop that returns None instead of raising on an empty stack.",
      starterCode: "def safe_pop(stack):\n    # TODO: return None if empty, else pop the top\n    pass",
      expected: "def safe_pop(stack):\n    if not stack:\n        return None\n    return stack.pop()",
      hints: ["Check whether the stack is empty first.", "An empty list is falsy.", "if not stack: return None; else stack.pop()"],
    },
    {
      id: "sq-choose-1",
      kind: "choose-approach",
      prompt: "You need FIFO processing of tasks with millions of enqueues/dequeues. list or deque, and what are the per-op complexities?",
      expected: "deque — enqueue (append) and dequeue (popleft) are O(1). A list would make dequeue list.pop(0) = O(n), far too slow.",
      hints: ["FIFO removes from the front.", "list.pop(0) is O(n).", "deque gives O(1) popleft."],
    },
  ],

  review: `A **stack** is LIFO (push/pop at the end; a Python \`list\` is ideal, O(1) amortized). A **queue** is FIFO (enqueue at back, dequeue at front; use \`collections.deque\` for O(1) \`popleft\`, since \`list.pop(0)\` is O(n)). Match LIFO vs FIFO to your problem; both hold n items in O(n) space.`,

  expectedOutput: "[1, 2, 3]\n3\n[1, 2]\n",

  references: [
    {
      url: "https://docs.python.org/3/tutorial/datastructures.html#using-lists-as-stacks",
      title: "Data Structures — Using Lists as Stacks/Queues — Python documentation",
      section: "Using Lists as Stacks / Queues",
      topic: "stacks/operations",
      purpose: "Confirm list-as-stack (append/pop) and that deque is recommended for queues because list front-removal is slow.",
      verifiedClaims: ["list.append/pop implement a stack efficiently", "deque is preferred for queues since list.pop(0) is O(n)"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://wiki.python.org/moin/TimeComplexity",
      title: "TimeComplexity — Python Wiki",
      section: "list / collections.deque",
      topic: "stacks/operations",
      purpose: "Confirm list append/pop are amortized O(1), list.pop(0) is O(n), and deque append/popleft are O(1).",
      verifiedClaims: ["deque append and popleft are O(1)", "list.pop(0) is O(n)"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "a86d9353d702a963",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
