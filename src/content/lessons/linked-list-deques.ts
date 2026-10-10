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
  prerequisites: [
  "linked-list-variants",
  "stack-queue-operations"
],

  explanation: "A **deque** (\"deck\", short for **double-ended queue**) is a sequence that supports **adding and removing from both ends in O(1)**. A plain **stack** adds/removes at one end; a plain **queue** adds at one end and removes at the other; a deque does **all four**: push/pop left and push/pop right. That makes it a superset — you can use it as a stack *or* a queue — and it is the natural structure for sliding-window and BFS problems.\n\nWhy link this to linked lists? Because a deque is exactly what a **doubly linked list** implements well: with `prev`/`next` links and pointers to both ends, inserting or deleting at either end is O(1) with no shifting. Python's `collections.deque` provides this interface exposing `append`, `appendleft`, `pop`, and `popleft`. Prefer it over using a Python `list` as a queue: `list.pop(0)` and `list.insert(0, x)` are **O(n)** because every other element shifts, whereas `deque.popleft`/`appendleft` are **O(1)**.\n\nNaming is the usual stumbling block: `append`/`pop` act on the **right** end, `appendleft`/`popleft` on the **left**. Popping from an empty deque raises `IndexError`. In the example we build `deque([0, 1, 2])`, then `popleft()` returns `0` and `pop()` returns `2`, leaving `[1]`. Deques also support `maxlen` (a fixed-capacity ring that discards from the opposite end) and O(1) rotation by one step — handy for ring buffers and recent-item windows.\n\nDo not treat arbitrary rotate(r) as a constant-time operation: moving many entries can take proportional work. A bounded deque evicts from the opposite end when append/appendleft add beyond maxlen; insert into a full bounded deque instead raises IndexError.",

  vocabulary: [
  {
    "term": "Deque",
    "definition": "A double-ended queue: O(1) add/remove at both the left and right ends."
  },
  {
    "term": "append / appendleft",
    "definition": "Add an item at the right / left end."
  },
  {
    "term": "pop / popleft",
    "definition": "Remove and return the item at the right / left end."
  },
  {
    "term": "Double-ended",
    "definition": "Both ends support insertion and deletion, unlike a stack or a plain queue."
  },
  {
    "term": "maxlen",
    "definition": "An optional fixed capacity; adding past it discards from the opposite end."
  }
],

  concepts: {
  "purpose": "Provide O(1) insertion and removal at both ends — a structure that can act as a stack or a queue and powers sliding-window and BFS algorithms.",
  "operations": "append/appendleft to add, pop/popleft to remove (all O(1)); len() for size; optional maxlen for a bounded ring; rotate() to cycle elements.",
  "uses": "BFS frontier queues, sliding-window maximum (monotonic deque), fixed-size recent-history buffers, undo/redo, palindrome checks from both ends.",
  "tradeoffs": "O(1) at both ends versus a Python list, whose front operations are O(n). A deque lacks O(1) random indexing by position (list has that).",
  "commonMistakes": "Using list.pop(0) as a queue (O(n) per op); confusing which end append vs appendleft touches; popping an empty deque (IndexError); expecting fast middle indexing.",
  "edgeCases": "Empty pop/popleft raises IndexError. Bounded append/appendleft evicts from the opposite end; insert into a full bounded deque raises IndexError. On a singleton, either pop removes the same value."
},

  complexity: [
  {
    "operation": "append / appendleft",
    "best": "O(1)",
    "average": "O(1)",
    "worst": "O(1)",
    "space": "O(1)",
    "note": "Add at either end."
  },
  {
    "operation": "pop / popleft",
    "best": "O(1)",
    "average": "O(1)",
    "worst": "O(1)",
    "space": "O(1)",
    "note": "Remove at either end."
  },
  {
    "operation": "list as queue: pop(0)",
    "best": "O(n)",
    "average": "O(n)",
    "worst": "O(n)",
    "note": "Shifts all remaining elements — avoid."
  }
],

  complexityExplanation: {
  "scope": "operation",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of items currently in the deque"
    }
  ],
  "costModel": "Each deque end operation relinks a constant number of internal references, independent of how many items are stored.",
  "time": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "append, appendleft, pop, and popleft each touch only an end of the underlying doubly linked structure, so they do a constant amount of pointer work regardless of size. The program performs a fixed number of such operations, so its total end-operation cost is constant per call. (Building a list of n items with n appends would be O(n) overall — n constant-time operations.)"
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Each stored element uses O(1) space; the operations themselves allocate no extra structure that grows with n. Here at most three items are held, so the working space is constant.",
    "inputOutputNote": "A deque holding n items uses O(n) total space for those items; that is the data itself, not per-operation auxiliary space. The bound covers the named algorithm; demonstration construction and collected print output are separate allocations."
  },
  "derivation": [
    {
      "lines": [
        5,
        6,
        7
      ],
      "description": "Three O(1) end insertions (append/appendleft).",
      "cost": "O(1) each",
      "dimension": "time"
    },
    {
      "lines": [
        10,
        13
      ],
      "description": "Two O(1) end removals (popleft/pop).",
      "cost": "O(1) each",
      "dimension": "time"
    },
    {
      "lines": [
        4
      ],
      "description": "The deque stores its items; per-operation auxiliary space is constant.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "collections.deque provides O(1) operations at both ends (doubly linked block list).",
    "pop/popleft on an empty deque raise IndexError rather than returning a sentinel.",
    "Indexing by arbitrary position is not assumed to be O(1)."
  ],
  "tradeoffs": "A deque gives O(1) front and back operations that a Python list cannot (list front ops are O(n)); in exchange it does not offer O(1) indexing by position, which a list does. For queue/sliding-window/BFS workloads the deque is the right default.",
  "counters": [
    {
      "label": "end insertions",
      "definition": "executions of append/appendleft lines (lines 5-7)",
      "countLines": [
        5,
        6,
        7
      ]
    },
    {
      "label": "end removals",
      "definition": "executions of popleft/pop lines (lines 10, 13)",
      "countLines": [
        10,
        13
      ]
    }
  ],
  "fixedDataNote": "This run does 3 insertions and 2 removals on a tiny deque. Each is O(1); the counts are fixed here and do not grow because the example uses a fixed sequence of calls."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": true,
    "explanation": "Import deque from the collections module."
  },
  {
    "line": 2,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 3,
    "executable": false,
    "explanation": "Comment: a deque is O(1) at both ends."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Create an empty deque."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "append adds to the RIGHT end -> [1]."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "append again -> [1, 2]."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "appendleft adds to the LEFT end -> [0, 1, 2]."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Print the whole deque: deque([0, 1, 2])."
  },
  {
    "line": 9,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "popleft removes and returns the LEFT item (0); deque becomes [1, 2]."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Print the popped left value: 0."
  },
  {
    "line": 12,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "pop removes and returns the RIGHT item (2); deque becomes [1]."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Print the popped right value: 2."
  },
  {
    "line": 15,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "Convert to a list to show what remains: [1]."
  }
],

  bindings: [
  {
    "variable": "dq",
    "model": "deque"
  }
],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "Why prefer collections.deque over a Python list when you need a queue?",
    "answer": "Because deque.popleft()/appendleft() are O(1), while list.pop(0)/insert(0, x) are O(n) — every remaining element shifts. For a queue, deque is far faster at scale.",
    "explanation": "A list is contiguous, so removing/inserting at the front reindexes everything (O(n)). A deque's ends are O(1), which is exactly what a queue needs."
  }
],

  experiments: [
  "Create deque(maxlen=3), append four items, and watch the oldest get dropped.",
  "Use a deque as a stack (append/pop only) and confirm LIFO order.",
  "Try dq.pop() on an empty deque and observe the IndexError."
],

  exercises: [
  {
    "id": "lldq-complete-1",
    "kind": "complete-code",
    "prompt": "Complete `dequeue_front(items)` so it uses a deque as a QUEUE (FIFO): enqueue every item in order, then dequeue once and return a tuple `(first, remaining)` where `first` is the item removed and `remaining` is the list of what is left in front-to-back order. Assume items is nonempty; an empty dequeue raises IndexError.",
    "starterCode": "from collections import deque\ndef dequeue_front(items):\n    q = deque()\n    for x in items:\n        q.append(x)\n    # TODO: dequeue the front item into `first`\n    return first, list(q)",
    "expected": "from collections import deque\ndef dequeue_front(items):\n    q = deque()\n    for x in items:\n        q.append(x)\n    first = q.popleft()\n    return first, list(q)",
    "hints": [
      "Understand: return (first removed value, remaining values as a list).",
      "FIFO removes from the left; append inserts at the right.",
      "deque.popleft avoids shifting a list.",
      "Create q=deque(values), then first=q.popleft().",
      "Pseudocode: return first, list(q).",
      "Solution: first=q.popleft(); return first, list(q). This exercise assumes nonempty values. The list(q) result costs O(n), even though the removal itself is O(1)."
    ],
    "tests": "# FIFO use of a deque: the earliest enqueued item comes out first.\nfirst, rest = dequeue_front([1, 2, 3])\nassert first == 1, f'FIFO dequeue returns the earliest item, got {first}'\nassert rest == [2, 3], f'front removed, 2 and 3 remain in order, got {rest}'\n# A different input so a hard-coded answer cannot pass.\nf2, r2 = dequeue_front([9, 8, 7, 6])\nassert f2 == 9, f'earliest is 9, got {f2}'\nassert r2 == [8, 7, 6], f'remaining in order, got {r2}'\n# Single item leaves an empty queue.\nf3, r3 = dequeue_front([42])\nassert f3 == 42 and r3 == [], 'single item -> empty remainder'\nprint('OK')"
  },
  {
    "id": "lldq-choose-1",
    "kind": "choose-approach",
    "prompt": "You need a fixed-size buffer of the last 100 sensor readings, dropping the oldest automatically. Which deque feature fits?",
    "expected": "deque(maxlen=100): appending past capacity discards from the opposite end, giving an automatic fixed-size ring buffer in O(1).",
    "hints": [
      "Goal: keep a fixed-size buffer of the last 100 sensor readings, automatically dropping the oldest as new ones arrive.",
      "The costly hand-rolled approach is manually removing the front whenever a list grows past 100, which is error-prone and may be O(n).",
      "Key property: you need a bounded FIFO where appending past capacity evicts from the opposite end automatically.",
      "Approach: use collections.deque with a maxlen of 100.",
      "Reasoning: deque(maxlen=100) discards from the opposite end on each over-capacity append in O(1), giving a free ring buffer with no manual bookkeeping.",
      "Answer: deque(maxlen=100) — appending past capacity discards from the opposite end, an automatic O(1) fixed-size ring buffer."
    ],
    "recognition": {
      "scenario": "You need a fixed-size buffer of the last 100 sensor readings that automatically drops the oldest as new ones arrive.",
      "approaches": [
        {
          "id": "deque-maxlen",
          "label": "collections.deque(maxlen=100)",
          "requiredReasonIds": [
            "maxlen-auto-drops"
          ]
        },
        {
          "id": "list-manual-trim",
          "label": "A list you append to and slice back to 100",
          "requiredReasonIds": [],
          "rejectionFeedback": "A plain list requires manual trimming, and dropping the oldest with list.pop(0) is O(n); deque's maxlen does the eviction automatically in O(1)."
        }
      ],
      "reasons": [
        {
          "id": "maxlen-auto-drops",
          "text": "deque(maxlen=100) discards from the opposite end automatically once full, giving an O(1) fixed-size ring buffer with no manual bookkeeping."
        },
        {
          "id": "maxlen-raises-when-full",
          "text": "A deque with maxlen raises an error when it is full rather than evicting.",
          "contradictory": true
        },
        {
          "id": "list-pop0-is-o1",
          "text": "Removing the oldest element with list.pop(0) is O(1), so a list is just as good.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "deque-maxlen"
      ],
      "modelExplanation": "deque(maxlen=100): appending past capacity discards from the opposite end, giving an automatic fixed-size ring buffer in O(1)."
    }
  },
  {
    "id": "lldq-predict-1",
    "kind": "predict-state",
    "prompt": "After append(1), append(2), appendleft(0), then popleft() and pop(), what remains and what were the two removed values?",
    "expected": "Remaining: [1]. popleft() returned 0; pop() returned 2.",
    "hints": [
      "After the three adds the deque is [0, 1, 2].",
      "popleft removes the left (0).",
      "pop removes the right (2), leaving [1]."
    ]
  }
],

  review: "A **deque** (double-ended queue) supports **O(1)** add/remove at **both** ends: `append`/`pop` on the right, `appendleft`/`popleft` on the left. It generalises the stack and the queue, and a **doubly linked list** is its natural implementation — which is why Python's `collections.deque` is the right choice for queues, BFS frontiers, and sliding windows. Avoid `list.pop(0)` (O(n)); use `popleft` (O(1)). Popping an empty deque raises `IndexError`. In the example, from `deque([0, 1, 2])`, `popleft()`→0 and `pop()`→2 leave `[1]`.",

  expectedOutput: "deque([0, 1, 2])\n0\n2\n[1]\n",

  references: [
  {
    "url": "https://docs.python.org/3.14/library/collections.html#collections.deque",
    "title": "Python 3.14: deque",
    "section": "deque operations, bounded deques, empty pops, rotation",
    "topic": "linked-list-deques",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "End operations, empty errors, bounded append eviction and insert behavior."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Use the Python 3.14 deque API; end operations are constant-time, bounded append evicts from the opposite end, and full bounded insert raises IndexError."
    ]
  },
  {
    "url": "https://courses.cis.cornell.edu/courses/cs2110/2026fa/lectures/lec15/",
    "title": "Cornell CS2110: Stacks and queues",
    "section": "LinkedStack; exercises 15.6, 15.7, 15.10; deque interface",
    "topic": "linked-list-deques",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Deque supports insertion and removal at both ends."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source Java deque interface describes operations at both ends; the app uses Python 3.14 collections.deque semantics."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "6bb00cb0cf3326d3",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
