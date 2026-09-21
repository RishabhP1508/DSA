/**
 * Lesson: Linked lists — deques (double-ended queues).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "deque([0, 1, 2])\n0\n2\n[1]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `from collections import deque

# A deque (double-ended queue) supports O(1) add/remove at BOTH ends.
dq = deque()
dq.append(1)        # add to the RIGHT  -> [1]
dq.append(2)        # add to the RIGHT  -> [1, 2]
dq.appendleft(0)    # add to the LEFT   -> [0, 1, 2]
print(dq)           # deque([0, 1, 2])

left = dq.popleft() # remove from the LEFT  -> returns 0, dq is [1, 2]
print(left)

right = dq.pop()    # remove from the RIGHT -> returns 2, dq is [1]
print(right)

print(list(dq))     # what's left: [1]`;

export const linkedListDeques: LessonDefinition = {
  id: "linked-list-deques",
  title: "Linked Lists: Deques",
  area: "Linear structures",
  prerequisites: ["linked-list-variants", "stack-queue-operations"],

  explanation: `A **deque** ("deck", short for **double-ended queue**) is a sequence that supports **adding and removing from both ends in O(1)**. A plain **stack** adds/removes at one end; a plain **queue** adds at one end and removes at the other; a deque does **all four**: push/pop left and push/pop right. That makes it a superset — you can use it as a stack *or* a queue — and it is the natural structure for sliding-window and BFS problems.

Why link this to linked lists? Because a deque is exactly what a **doubly linked list** implements well: with \`prev\`/\`next\` links and pointers to both ends, inserting or deleting at either end is O(1) with no shifting. Python's \`collections.deque\` is a battle-tested implementation (a doubly linked list of fixed-size blocks) exposing \`append\`, \`appendleft\`, \`pop\`, and \`popleft\`. Prefer it over using a Python \`list\` as a queue: \`list.pop(0)\` and \`list.insert(0, x)\` are **O(n)** because every other element shifts, whereas \`deque.popleft\`/\`appendleft\` are **O(1)**.

Naming is the usual stumbling block: \`append\`/\`pop\` act on the **right** end, \`appendleft\`/\`popleft\` on the **left**. Popping from an empty deque raises \`IndexError\`. In the example we build \`deque([0, 1, 2])\`, then \`popleft()\` returns \`0\` and \`pop()\` returns \`2\`, leaving \`[1]\`. Deques also support \`maxlen\` (a fixed-capacity ring that discards from the opposite end) and O(1) rotation — handy for ring buffers and recent-item windows.`,

  vocabulary: [
    { term: "Deque", definition: "A double-ended queue: O(1) add/remove at both the left and right ends." },
    { term: "append / appendleft", definition: "Add an item at the right / left end." },
    { term: "pop / popleft", definition: "Remove and return the item at the right / left end." },
    { term: "Double-ended", definition: "Both ends support insertion and deletion, unlike a stack or a plain queue." },
    { term: "maxlen", definition: "An optional fixed capacity; adding past it discards from the opposite end." },
  ],

  concepts: {
    purpose:
      "Provide O(1) insertion and removal at both ends — a structure that can act as a stack or a queue and powers sliding-window and BFS algorithms.",
    operations:
      "append/appendleft to add, pop/popleft to remove (all O(1)); len() for size; optional maxlen for a bounded ring; rotate() to cycle elements.",
    uses:
      "BFS frontier queues, sliding-window maximum (monotonic deque), fixed-size recent-history buffers, undo/redo, palindrome checks from both ends.",
    tradeoffs:
      "O(1) at both ends versus a Python list, whose front operations are O(n). A deque lacks O(1) random indexing by position (list has that).",
    commonMistakes:
      "Using list.pop(0) as a queue (O(n) per op); confusing which end append vs appendleft touches; popping an empty deque (IndexError); expecting fast middle indexing.",
    edgeCases:
      "Empty deque: pop/popleft raise IndexError. With maxlen set, adding to a full deque silently drops the item at the far end. Single element: pop and popleft return the same item.",
  },

  complexity: [
    { operation: "append / appendleft", best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(1)", note: "Add at either end." },
    { operation: "pop / popleft", best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(1)", note: "Remove at either end." },
    { operation: "list as queue: pop(0)", best: "O(n)", average: "O(n)", worst: "O(n)", note: "Shifts all remaining elements — avoid." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of items currently in the deque" }],
    costModel:
      "Each deque end operation relinks a constant number of internal references, independent of how many items are stored.",
    time: {
      bound: "O(1)",
      case: "worst",
      explanation:
        "append, appendleft, pop, and popleft each touch only an end of the underlying doubly linked structure, so they do a constant amount of pointer work regardless of size. The program performs a fixed number of such operations, so its total end-operation cost is constant per call. (Building a list of n items with n appends would be O(n) overall — n constant-time operations.)",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation:
        "Each stored element uses O(1) space; the operations themselves allocate no extra structure that grows with n. Here at most three items are held, so the working space is constant.",
      inputOutputNote:
        "A deque holding n items uses O(n) total space for those items; that is the data itself, not per-operation auxiliary space.",
    },
    derivation: [
      { lines: [5, 6, 7], description: "Three O(1) end insertions (append/appendleft).", cost: "O(1) each", dimension: "time" },
      { lines: [10, 13], description: "Two O(1) end removals (popleft/pop).", cost: "O(1) each", dimension: "time" },
      { lines: [4], description: "The deque stores its items; per-operation auxiliary space is constant.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: [
      "collections.deque provides O(1) operations at both ends (doubly linked block list).",
      "pop/popleft on an empty deque raise IndexError rather than returning a sentinel.",
      "Indexing by arbitrary position is not assumed to be O(1).",
    ],
    tradeoffs:
      "A deque gives O(1) front and back operations that a Python list cannot (list front ops are O(n)); in exchange it does not offer O(1) indexing by position, which a list does. For queue/sliding-window/BFS workloads the deque is the right default.",
    counters: [
      { label: "end insertions", definition: "executions of append/appendleft lines (lines 5-7)", countLines: [5, 6, 7] },
      { label: "end removals", definition: "executions of popleft/pop lines (lines 10, 13)", countLines: [10, 13] },
    ],
    fixedDataNote:
      "This run does 3 insertions and 2 removals on a tiny deque. Each is O(1); the counts are fixed here and do not grow because the example uses a fixed sequence of calls.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import deque from the collections module." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: a deque is O(1) at both ends." },
    { line: 4, executable: true, explanation: "Create an empty deque." },
    { line: 5, executable: true, explanation: "append adds to the RIGHT end -> [1]." },
    { line: 6, executable: true, explanation: "append again -> [1, 2]." },
    { line: 7, executable: true, explanation: "appendleft adds to the LEFT end -> [0, 1, 2]." },
    { line: 8, executable: true, explanation: "Print the whole deque: deque([0, 1, 2])." },
    { line: 9, executable: false, explanation: "Blank line." },
    { line: 10, executable: true, explanation: "popleft removes and returns the LEFT item (0); deque becomes [1, 2]." },
    { line: 11, executable: true, explanation: "Print the popped left value: 0." },
    { line: 12, executable: false, explanation: "Blank line." },
    { line: 13, executable: true, explanation: "pop removes and returns the RIGHT item (2); deque becomes [1]." },
    { line: 14, executable: true, explanation: "Print the popped right value: 2." },
    { line: 15, executable: false, explanation: "Blank line." },
    { line: 16, executable: true, explanation: "Convert to a list to show what remains: [1]." },
  ],

  bindings: [{ variable: "dq", model: "deque" }],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "Why prefer collections.deque over a Python list when you need a queue?",
      answer: "Because deque.popleft()/appendleft() are O(1), while list.pop(0)/insert(0, x) are O(n) — every remaining element shifts. For a queue, deque is far faster at scale.",
      explanation: "A list is contiguous, so removing/inserting at the front reindexes everything (O(n)). A deque's ends are O(1), which is exactly what a queue needs.",
    },
  ],

  experiments: [
    "Create deque(maxlen=3), append four items, and watch the oldest get dropped.",
    "Use a deque as a stack (append/pop only) and confirm LIFO order.",
    "Try dq.pop() on an empty deque and observe the IndexError.",
  ],

  exercises: [
    {
      id: "lldq-complete-1",
      kind: "complete-code",
      prompt: "Complete the code so it uses a deque as a QUEUE (FIFO): enqueue 1,2,3 then dequeue once.",
      starterCode:
        "from collections import deque\nq = deque()\nq.append(1)\nq.append(2)\nq.append(3)\n# TODO: dequeue the front item into `first`\nprint(first)",
      expected:
        "from collections import deque\nq = deque()\nq.append(1)\nq.append(2)\nq.append(3)\nfirst = q.popleft()\nprint(first)",
      hints: [
        "FIFO removes from the front (left).",
        "append adds at the right; the front is the left.",
        "first = q.popleft()",
      ],
    },
    {
      id: "lldq-choose-1",
      kind: "choose-approach",
      prompt: "You need a fixed-size buffer of the last 100 sensor readings, dropping the oldest automatically. Which deque feature fits?",
      expected: "deque(maxlen=100): appending past capacity discards from the opposite end, giving an automatic fixed-size ring buffer in O(1).",
      hints: [
        "You want a bounded size.",
        "Oldest should be dropped automatically.",
        "Use the maxlen parameter.",
      ],
    },
    {
      id: "lldq-predict-1",
      kind: "predict-state",
      prompt: "After append(1), append(2), appendleft(0), then popleft() and pop(), what remains and what were the two removed values?",
      expected: "Remaining: [1]. popleft() returned 0; pop() returned 2.",
      hints: [
        "After the three adds the deque is [0, 1, 2].",
        "popleft removes the left (0).",
        "pop removes the right (2), leaving [1].",
      ],
    },
  ],

  review: `A **deque** (double-ended queue) supports **O(1)** add/remove at **both** ends: \`append\`/\`pop\` on the right, \`appendleft\`/\`popleft\` on the left. It generalises the stack and the queue, and a **doubly linked list** is its natural implementation — which is why Python's \`collections.deque\` is the right choice for queues, BFS frontiers, and sliding windows. Avoid \`list.pop(0)\` (O(n)); use \`popleft\` (O(1)). Popping an empty deque raises \`IndexError\`. In the example, from \`deque([0, 1, 2])\`, \`popleft()\`→0 and \`pop()\`→2 leave \`[1]\`.`,

  expectedOutput: "deque([0, 1, 2])\n0\n2\n[1]\n",

  references: [
    {
      url: "https://docs.python.org/3/library/collections.html#collections.deque",
      title: "collections.deque — Python Standard Library",
      section: "deque objects: append, appendleft, pop, popleft, maxlen",
      topic: "linked-lists/deques",
      purpose: "Confirm the deque API and that appends/pops from either side are O(1), plus maxlen behaviour, on the bundled Python version.",
      verifiedClaims: [
        "deque supports append, appendleft, pop, popleft with approximately O(1) cost at either end.",
        "Using a list as a queue incurs O(n) cost for pop(0)/insert(0, x) due to element shifting.",
        "A bounded deque (maxlen) discards items from the opposite end when full.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://en.wikipedia.org/wiki/Double-ended_queue",
      title: "Double-ended queue — Wikipedia",
      section: "Operations and implementations",
      topic: "linked-lists/deques",
      purpose: "Cross-check the definition of a deque and that a doubly linked list is a standard implementation supporting O(1) end operations.",
      verifiedClaims: [
        "A deque allows insertion and removal at both ends.",
        "A doubly linked list is a common implementation giving O(1) operations at both ends.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "0d245a88161095ab",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
