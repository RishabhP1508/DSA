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
  prerequisites: [
  "array-traversal",
  "classes"
],

  explanation: "A **stack** is a **Last-In-First-Out (LIFO)** collection: the last thing you add is the first thing you remove — like a stack of plates. Its two core operations are **push** (add to the top) and **pop** (remove the top). In Python you just use a `list`: `append` is push and `pop()` (no index) removes the last element. Both end updates are **O(1) amortized**; growing or shrinking storage can make one update O(n).\n\nThe mirror image is a **queue** — **First-In-First-Out (FIFO)** — where you add at the back and remove from the front, like a checkout line. Python's list can pop from the front, but `list.pop(0)` is **O(n)** (it shifts everything), so for a queue you use `collections.deque`, whose `append` and `popleft` are both **O(1)**.\n\nThese two disciplines drive huge parts of DSA: stacks power recursion/backtracking, expression parsing, and \"undo\"; queues power breadth-first search and scheduling. The key recognition skill is matching the *order* your problem needs (LIFO vs FIFO) to the right structure.",

  vocabulary: [
  {
    "term": "Stack",
    "definition": "A LIFO collection: the most recently added item is removed first."
  },
  {
    "term": "Queue",
    "definition": "A FIFO collection: the earliest added item is removed first."
  },
  {
    "term": "Push / pop",
    "definition": "Add to / remove from the top of a stack."
  },
  {
    "term": "Enqueue / dequeue",
    "definition": "Add to the back / remove from the front of a queue."
  },
  {
    "term": "deque",
    "definition": "Python's double-ended queue with O(1) append and popleft."
  },
  {
    "term": "Top",
    "definition": "The most recently pushed element of a stack (last of the list)."
  }
],

  concepts: {
  "purpose": "Stacks and queues impose an order (LIFO/FIFO) that many algorithms rely on.",
  "operations": "Stack: append (push), pop (pop top). Queue: deque.append (enqueue), deque.popleft (dequeue).",
  "uses": "Stacks: recursion, backtracking, parsing, undo. Queues: BFS, scheduling, buffering.",
  "tradeoffs": "list is a perfect stack; for a queue use deque (list.pop(0) is O(n)).",
  "commonMistakes": "Using list.pop(0) for a queue (O(n)); popping from an empty stack (IndexError); mixing up which end is the 'top'.",
  "edgeCases": "Popping an empty stack/queue raises an error — guard with a length check. A single element behaves the same for both."
},

  complexity: [
  {
    "operation": "Stack push/pop (list)",
    "best": "O(1)",
    "average": "O(1) amortized",
    "worst": "O(n) if resized",
    "space": "O(n)",
    "note": "Amortized O(1); rare resize is O(n). Holds n items. Python list storage can resize."
  },
  {
    "operation": "Queue enqueue/dequeue (deque)",
    "best": "O(1)",
    "average": "O(1)",
    "worst": "O(1)",
    "note": "deque.append / popleft are O(1)."
  }
],

  complexityExplanation: {
  "scope": "operation",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of items currently in the stack/queue"
    }
  ],
  "costModel": "Python list append and pop at the end are O(1) amortized; a resize may cost O(n). deque end operations avoid shifting. Peek is O(1).",
  "time": {
    "bound": "O(1)",
    "case": "amortized",
    "explanation": "Each stack update is O(1) amortized, including allocation resizing across a sequence. An individual resize can cost O(n); reading the top is worst-case O(1). A sequence of n end updates costs O(n) total.",
    "otherCases": [
      {
        "case": "worst",
        "bound": "O(n)",
        "note": "A single append that triggers a list resize copies all n elements once (amortized away)."
      }
    ]
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The stack holds all pushed items, so it uses O(n) space for n items. Each operation adds only O(1) beyond that.",
    "inputOutputNote": "The stack list IS the data you build; its O(n) size is inherent. The bound covers the named algorithm; demonstration construction and collected print output are separate allocations."
  },
  "derivation": [
    {
      "lines": [
        3,
        4,
        5
      ],
      "description": "Three pushes, each amortized O(1).",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        7
      ],
      "description": "One pop from the end — O(1).",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        3,
        4,
        5
      ],
      "description": "The stack grows to hold n items.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "list.append/pop() act at the end (O(1) amortized).",
    "A queue would use deque, not list.pop(0)."
  ],
  "tradeoffs": "A list makes an ideal stack; for a FIFO queue, deque's O(1) popleft beats list.pop(0)'s O(n) shifting.",
  "counters": [
    {
      "label": "pushes",
      "definition": "executions of append (lines 3-5)",
      "countLines": [
        3,
        4,
        5
      ]
    }
  ],
  "fixedDataNote": "The printed sample has three pushes and one pop. Per-operation bounds and O(n) stack storage scale with occupancy; n updates take O(n) total amortized time."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: a stack is LIFO."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Start with an empty list used as a stack."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Push 1 (append to the end/top)."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Push 2."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Push 3. The top is now 3."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Print the stack → [1, 2, 3]."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "pop() removes and returns the LAST item (3) — LIFO."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Print the stack after the pop → [1, 2]."
  }
],

  bindings: [
  {
    "variable": "stack",
    "model": "stack"
  }
],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "Why use collections.deque instead of a list for a QUEUE?",
    "answer": "Because a queue removes from the front, and list.pop(0) is O(n) (it shifts every element), while deque.popleft is O(1).",
    "explanation": "A list is O(1) only at its end. Removing from the front shifts all remaining elements — O(n). deque supports O(1) removal from both ends, making it the right queue."
  }
],

  experiments: [
  "Convert this to a queue using deque and popleft; observe FIFO order (1 comes out first).",
  "Pop from an empty stack to see the IndexError, then guard it with `if stack:`.",
  "Push and pop several times and track the top element."
],

  exercises: [
  {
    "id": "sq-complete-1",
    "kind": "complete-code",
    "prompt": "Implement a safe pop that returns None instead of raising on an empty stack.",
    "starterCode": "def safe_pop(stack):\n    # TODO: return None if empty, else pop the top\n    pass",
    "expected": "def safe_pop(stack):\n    if not stack:\n        return None\n    return stack.pop()",
    "hints": [
      "Goal: pop from a stack but return None on an empty stack instead of raising.",
      "The hazard is calling pop() on an empty list, which raises IndexError.",
      "Key insight: an empty list is falsy, so you can test emptiness before popping.",
      "Approach: guard with an emptiness check, returning None when empty.",
      "Pseudocode: if the stack is empty: return None; otherwise return stack.pop().",
      "Write `if not stack: return None` then `return stack.pop()`."
    ],
    "tests": "assert safe_pop([]) is None, 'empty stack pops None, not an error'\ns = [1, 2, 3]\nassert safe_pop(s) == 3, 'pops the top'\nassert s == [1, 2], 'pop mutates the stack'\nassert safe_pop([9]) == 9, 'singleton pop'\nprint('OK')"
  },
  {
    "id": "sq-choose-1",
    "kind": "choose-approach",
    "prompt": "You need FIFO processing of tasks with millions of enqueues/dequeues. list or deque, and what are the per-op complexities?",
    "expected": "deque — enqueue (append) and dequeue (popleft) are O(1). A list would make dequeue list.pop(0) = O(n), far too slow.",
    "hints": [
      "Goal: choose a structure for FIFO processing with millions of enqueues and dequeues — a list or a collections.deque.",
      "The costly choice is a list, because removing from the front with pop(0) shifts every remaining element.",
      "Property: deque.popleft removes without shifting remaining elements; list.pop(0) shifts them.",
      "Approach: use a deque, appending to enqueue and popleft to dequeue.",
      "Reasoning: deque end operations make m FIFO operations O(m). Growing a list queue to m items and draining it via pop(0) costs O(m²); bounded occupancy can have a smaller total.",
      "Answer: deque — append and popleft are O(1), whereas list.pop(0) is O(n) and far too slow at scale."
    ],
    "recognition": {
      "scenario": "You need FIFO processing of tasks with millions of enqueue and dequeue operations. You must choose between a list and a collections.deque.",
      "approaches": [
        {
          "id": "deque",
          "label": "Use collections.deque",
          "requiredReasonIds": [
            "o1-both-ends"
          ]
        },
        {
          "id": "list",
          "label": "Use a list with append and pop(0)",
          "requiredReasonIds": [],
          "rejectionFeedback": "list.pop(0) shifts every remaining element, costing O(n) per dequeue — far too slow for millions of operations."
        }
      ],
      "reasons": [
        {
          "id": "o1-both-ends",
          "text": "A deque supports append (enqueue) and popleft (dequeue) in O(1) each, so millions of FIFO operations stay linear overall."
        },
        {
          "id": "list-pop0-constant",
          "text": "list.pop(0) runs in O(1), so a plain list is just as fast as a deque for a queue.",
          "contradictory": true
        },
        {
          "id": "deque-no-fifo",
          "text": "A deque cannot model FIFO ordering.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "deque"
      ],
      "modelExplanation": "deque — enqueue (append) and dequeue (popleft) are O(1). A list would make dequeue list.pop(0) = O(n), far too slow."
    }
  }
],

  review: "A **stack** is LIFO (push/pop at the end; a Python `list` is ideal, O(1) amortized). A **queue** is FIFO (enqueue at back, dequeue at front; use `collections.deque` for O(1) `popleft`, since `list.pop(0)` is O(n)). Match LIFO vs FIFO to your problem; both hold n items in O(n) space.",

  expectedOutput: "[1, 2, 3]\n3\n[1, 2]\n",

  references: [
  {
    "url": "https://runestone.academy/ns/books/published/pythonds3/BasicDS/ImplementingaStackinPython.html",
    "title": "Runestone: Python stack",
    "section": "3.5 list-end stack and front-shifting comparison",
    "topic": "stack-queue-operations",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "List-end operations implement LIFO; front removal shifts items."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source list-end stack analysis omits occasional resizing. App uses amortized O(1) append/pop and qualifies a single resizing operation."
    ]
  },
  {
    "url": "https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c",
    "title": "CPython 3.14.2 list source",
    "section": "list_resize; append and pop implementations",
    "topic": "stack-queue-operations",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Python list storage grows and shrinks; end updates are amortized."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Version-pinned CPython 3.14.2 source. Resizing qualifies the app list-end update costs as amortized; one resizing update can be linear."
    ]
  },
  {
    "url": "https://docs.python.org/3.14/library/collections.html#collections.deque",
    "title": "Python 3.14: deque",
    "section": "deque operations, bounded deques, empty pops, rotation",
    "topic": "stack-queue-operations",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "deque end removals implement FIFO without front shifting."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Use the Python 3.14 deque API; end operations are constant-time, bounded append evicts from the opposite end, and full bounded insert raises IndexError."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "7f379d26bcdf3751",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
