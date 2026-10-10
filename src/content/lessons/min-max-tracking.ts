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
  prerequisites: [
  "stack-queue-operations",
  "classes"
],

  explanation: "Sometimes you need a stack that can also tell you its **current minimum (or maximum) in O(1)** at any moment — even as items are pushed and popped. Scanning for the min each time would be O(n); the trick is to **carry the running minimum alongside the stack**.\n\nThe **min stack** keeps a second, parallel stack `mins` where `mins[i]` is the minimum of everything from the bottom up to level `i`. On **push(x)**, we push `min(x, current_min)` onto `mins`. On **pop**, we pop both stacks together. So `get_min` is just reading the top of `mins` — **O(1)**. The key idea is that the minimum is a property of a *prefix* of the stack, and since a stack only changes at the top, we can maintain that prefix-min incrementally.\n\nget_min is worst-case **O(1)**; push and pop are **O(1) amortized**, at the cost of **O(n)** extra space for the second stack. The same pattern gives a max stack (carry the running max) and underpins the **sliding-window maximum** (using a monotonic deque). The cue: \"need the extreme of a changing collection, fast\" → carry it alongside.\n\nA single max stack cannot expire the oldest window value. A monotonic deque solves sliding-window maximum in O(n). Another valid O(n) total solution is a FIFO queue built from two max stacks: transfer all items only when the output stack empties; each item transfers at most once and the queue maximum is the larger of the two stack maxima.",

  vocabulary: [
  {
    "term": "Min stack",
    "definition": "A stack that also returns its current minimum in O(1)."
  },
  {
    "term": "Auxiliary stack",
    "definition": "A parallel stack holding the running minimum at each level."
  },
  {
    "term": "Running minimum",
    "definition": "The smallest value among all currently-stacked elements."
  },
  {
    "term": "Prefix property",
    "definition": "The min depends only on a prefix of the stack, so it updates with push/pop."
  }
],

  concepts: {
  "purpose": "Report the extreme (min/max) of a stack in O(1) while supporting push/pop.",
  "operations": "On push, store min(x, previous min); on pop, pop both; get_min reads the mins top.",
  "uses": "Min/max stack interview problem, sliding-window extremes (with a deque), stack-based monotonic tracking.",
  "tradeoffs": "get_min is worst-case O(1), updates O(1) amortized, and prefix history O(n) space. A single minimum cannot restore history after a pop.",
  "commonMistakes": "Keeping only one min variable (wrong after popping the current min); forgetting to pop the mins stack in lockstep; mixing up min vs max direction.",
  "edgeCases": "Empty pop or get_min raises IndexError in this implementation. Per-level storage handles duplicate minima."
},

  complexity: [
  {
    "operation": "push / pop",
    "best": "O(1)",
    "average": "O(1) amortized",
    "worst": "O(n) if resized",
    "space": "O(n)",
    "note": "Two parallel Python lists may grow/shrink; amortized updates are constant."
  },
  {
    "operation": "get_min",
    "best": "O(1)",
    "average": "O(1)",
    "worst": "O(1)",
    "space": "O(1)",
    "note": "Read the prefix minimum at the top; requires nonempty stack."
  }
],

  complexityExplanation: {
  "scope": "operation",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements currently on the stack"
    }
  ],
  "costModel": "Bounded numeric comparisons cost O(1); Python list end updates are O(1) amortized, root reads O(1).",
  "time": {
    "bound": "O(1)",
    "case": "amortized",
    "explanation": "Two end updates per push/pop are O(1) amortized, with occasional O(n) list resizing. get_min reads one entry and is worst-case O(1)."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The auxiliary mins stack mirrors the main stack, storing one running-minimum value per element — O(n) extra space. That is the space-for-time trade enabling O(1) get_min.",
    "inputOutputNote": "Both the main stack and the mins stack scale with the number of pushed elements. The bound covers the named algorithm; demonstration construction and collected print output are separate allocations."
  },
  "derivation": [
    {
      "lines": [
        7,
        8,
        9
      ],
      "description": "push: two appends and one min-of-two — O(1). End-list updates include amortized allocation costs; a single resize may be linear.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        11,
        12
      ],
      "description": "pop: two O(1) pops. End-list updates include amortized allocation costs; a single resize may be linear.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        14
      ],
      "description": "get_min: read the top of mins — O(1).",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        5,
        9
      ],
      "description": "The parallel mins stack stores one value per element.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "append/pop are amortized O(1).",
    "get_min is called on a non-empty stack (guard otherwise)."
  ],
  "tradeoffs": "O(n) prefix history restores the previous minimum after a pop, enabling O(1) get_min and O(1) amortized updates.",
  "counters": [
    {
      "label": "pushes",
      "definition": "executions of push body (line 7)",
      "countLines": [
        7
      ]
    },
    {
      "label": "pops",
      "definition": "executions of pop body (line 12)",
      "countLines": [
        12
      ]
    }
  ],
  "fixedDataNote": "This run pushes 3 values then pops 2; get_min stays O(1) throughout. The O(n) space bound reflects the parallel mins stack for n elements."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: a stack that reports its min in O(1)."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define the MinStack class."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "The constructor sets up two lists."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "The main stack of values."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "The parallel mins stack: mins[i] is the min of stack[0..i]."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "push(x): add x."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Append x to the main stack."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Compute the new running min: x if empty, else min(x, previous min)."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Carry that running minimum onto the mins stack."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "pop(): remove the top of both stacks."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Pop the mins stack in lockstep."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Pop and return the main value."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "get_min(): the current minimum."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Just read the top of the mins stack — O(1)."
  },
  {
    "line": 15,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "Create a MinStack."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Push 3, 1, 2."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "get_min over {3,1,2} → 1."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "Pop twice, leaving {3}."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "get_min over {3} → 3."
  }
],

  bindings: [
  {
    "variable": "ms",
    "path": "stack",
    "model": "stack"
  },
  {
    "variable": "ms",
    "path": "mins",
    "model": "stack"
  }
],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "Why isn't a single `min_value` variable enough to support get_min through pops?",
    "answer": "Because when you pop the current minimum, you'd need the previous minimum, which a single variable no longer holds — you need the per-level history the parallel stack provides.",
    "explanation": "A lone variable tracks only the current min; once it's popped, the earlier minimum is lost. The parallel mins stack keeps the running minimum for every level, so popping restores the correct earlier min in O(1)."
  }
],

  experiments: [
  "Push values including duplicates of the minimum and watch get_min stay correct after pops.",
  "Change min to max to build a MaxStack.",
  "Add a guard so get_min on an empty stack returns None."
],

  exercises: [
  {
    "id": "min-complete-1",
    "kind": "complete-code",
    "prompt": "Complete push so the mins stack carries the running minimum.",
    "starterCode": "def push(self, x):\n    self.stack.append(x)\n    # TODO: append the running minimum to self.mins\n    pass",
    "expected": "def push(self, x):\n    self.stack.append(x)\n    m = x if not self.mins else min(x, self.mins[-1])\n    self.mins.append(m)",
    "hints": [
      "Goal: implement push so a parallel mins stack always holds the running minimum.",
      "Rescanning the stack for the minimum is O(n); tracking it per push is O(1).",
      "Key insight: the new minimum is x compared against the previous top of the mins stack.",
      "Approach: on push, compute min(x, current min) and push it too, handling the empty case.",
      "Pseudocode: push x; m = x if mins empty else min(x, mins[-1]); push m onto mins.",
      "Write `m = x if not self.mins else min(x, self.mins[-1])` then `self.mins.append(m)`. List updates are amortized O(1), while a get_min root read is worst-case O(1)."
    ],
    "tests": "# The learner's push is a top-level function taking self; call it on a dummy.\nclass _S:\n    def __init__(self):\n        self.stack = []\n        self.mins = []\nobj = _S()\npush(obj, 5)\nassert obj.mins == [5], f'first push seeds min, got {obj.mins}'\npush(obj, 3)\nassert obj.mins == [5, 3], f'running min drops to 3, got {obj.mins}'\npush(obj, 4)\nassert obj.mins == [5, 3, 3], f'running min stays 3, got {obj.mins}'\nassert obj.stack == [5, 3, 4], f'stack keeps raw values, got {obj.stack}'\nprint('OK')"
  },
  {
    "id": "min-choose-1",
    "kind": "choose-approach",
    "prompt": "You need the maximum within every sliding window of size k over an array, in O(n). Is a min/max stack enough, or do you need something else?",
    "expected": "A single max stack is insufficient for FIFO expiry. Use a monotonic deque, or a queue implemented with two max stacks and occasional transfers. Either gives O(n) total for fixed-size window maxima.",
    "hints": [
      "Understand: windows expire the oldest value and insert the newest.",
      "A single stack cannot remove its oldest value cheaply.",
      "Keep candidates in a monotonic deque, or combine two max stacks into a queue.",
      "Deque: expire indices at the front, remove dominated values at the back.",
      "Pseudocode: maintain decreasing candidates; alternatively transfer between max stacks only when the output side empties.",
      "Solution: either method costs O(n) total; each index is removed at most once from the deque, or each queue item transfers at most once between max stacks."
    ],
    "recognition": {
      "scenario": "You need the maximum within every sliding window of size k over an array, in O(n) total. You must decide whether a min/max stack suffices or something else is required.",
      "approaches": [
        {
          "id": "monotonic-deque",
          "label": "A monotonic double-ended queue (deque)",
          "requiredReasonIds": [
            "drop-both-ends"
          ]
        },
        {
          "id": "minmax-stack",
          "label": "A plain min/max stack",
          "requiredReasonIds": [],
          "rejectionFeedback": "A stack only grows/shrinks at one end, so it cannot evict elements that fall out of the window's FRONT; you need to remove from both ends."
        },
        {
          "id": "two-max-stacks",
          "label": "Queue built from two max stacks",
          "requiredReasonIds": [
            "transfer-once"
          ]
        }
      ],
      "reasons": [
        {
          "id": "drop-both-ends",
          "text": "A monotonic deque drops out-of-window elements from the front and dominated elements from the back, so each element is pushed and popped once — O(n) total for sliding-window maximum."
        },
        {
          "id": "stack-handles-window",
          "text": "A single-ended stack can evict elements leaving the window front, so it is enough.",
          "contradictory": true
        },
        {
          "id": "needs-sorting",
          "text": "You must sort each window to find its maximum.",
          "contradictory": true
        },
        {
          "id": "transfer-once",
          "text": "Transfer only when the output stack is empty; each item moves once and compare both stack maxima. This gives O(n) total for all windows."
        }
      ],
      "acceptableApproachIds": [
        "monotonic-deque",
        "two-max-stacks"
      ],
      "modelExplanation": "A single max stack is insufficient for FIFO expiry. Use a monotonic deque, or a queue implemented with two max stacks and occasional transfers. Either gives O(n) total for fixed-size window maxima."
    }
  }
],

  review: "A **min stack** reports its minimum in **O(1)** by carrying a **running minimum** on a parallel stack: push `min(x, prev_min)`, pop both together, and read the mins top for get_min. Updates are **O(1) amortized** and get_min is worst-case **O(1)** at **O(n)** extra space. A single variable can't survive popping the min — you need the per-level history. The idea extends to max stacks and, via a monotonic deque, to sliding-window extremes.",

  expectedOutput: "1\n3\n",

  references: [
  {
    "url": "https://cp-algorithms.com/data_structures/stack_queue_modification.html",
    "title": "Minimum stack and queue",
    "section": "Stack modification; queue methods 1–3; fixed-length subarray minimum",
    "topic": "min-max-tracking",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Per-level minima restore history; a two-min-stack queue gives amortized updates."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source minimum structures transfer once between two FIFO stacks; reverse comparisons for app maximum variants. Monotonic deque expires by window index."
    ]
  },
  {
    "url": "https://courses.cis.cornell.edu/courses/cs2110/2026fa/lectures/lec15/",
    "title": "Cornell CS2110: Stacks and queues",
    "section": "LinkedStack; exercises 15.6, 15.7, 15.10; deque interface",
    "topic": "min-max-tracking",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Max-stack exercise carries prefix maxima."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source maximum-stack exercise mirrors app prefix-minimum tracking by reversing the comparison; values remain associated with their stack depth."
    ]
  },
  {
    "url": "https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c",
    "title": "CPython 3.14.2 list source",
    "section": "list_resize; append and pop implementations",
    "topic": "min-max-tracking",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Python list resizing qualifies update costs."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Version-pinned CPython 3.14.2 source. Resizing qualifies the app list-end update costs as amortized; one resizing update can be linear."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "d06b86e6c201924d",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
