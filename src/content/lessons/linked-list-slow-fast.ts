/**
 * Lesson: Linked lists — slow/fast pointers (Linear structures).
 *
 * Researched against the sources in `references` and verified by executing the
 * program on CPython 3.14 (matching the bundled Pyodide 3.14.2). Output is
 * exactly "3\n3\n". Demonstrates the linked-list visualizer with two pointer
 * overlays moving at different speeds.
 */

import type { LessonDefinition } from "../../core/types";

const code = `class Node:
    def __init__(self, val, nxt=None):
        self.val = val
        self.next = nxt

# Build 1 -> 2 -> 3 -> 4 -> 5.
head = Node(1, Node(2, Node(3, Node(4, Node(5)))))

# Two pointers move together, but fast moves twice as fast as slow.
def middle(head):
    slow = head
    fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next        # +1 node
        fast = fast.next.next   # +2 nodes
    return slow

print(middle(head).val)                     # odd length -> exact middle
print(middle(Node(1, Node(2, Node(3, Node(4))))).val)  # even -> second of the two middles`;

export const linkedListSlowFast: LessonDefinition = {
  id: "linked-list-slow-fast",
  title: "Linked Lists: Slow/Fast Pointers",
  area: "Linear structures",
  prerequisites: [
  "linked-list-traversal"
],

  explanation: "The **slow/fast pointer** technique (also called the **two-pointer** or **tortoise and hare** technique) walks **two pointers through one list at different speeds**. The **slow** pointer advances one node per step; the **fast** pointer advances two. Because fast covers twice the ground, when fast reaches the end, slow has followed floor(n/2) links — so slow lands on the **middle** node.\n\nWhy is this useful? Finding the middle the obvious way takes **two passes**: one to count the n nodes, another to walk n/2 steps. Slow/fast finds the middle in a **single pass** without ever knowing the length in advance. The same \"two speeds in one list\" idea is the engine behind **cycle detection** (next lesson): if the list loops, the fast pointer eventually laps the slow one and they collide.\n\nThe loop condition is the subtle part: `while fast is not None and fast.next is not None`. Fast reads `fast.next.next`, so **both** `fast` and `fast.next` must exist before we step. For an **odd** length the loop stops with fast on the last node and slow on the exact middle; for an **even** length fast steps off the end (becomes `None`) and slow rests on the **second** of the two middle nodes. This is still **O(n)** time — floor(n/2) iterations move slow one link and fast two links each — but **O(1)** space.\n\nWith fast initially at head, the loop runs floor(n/2) times: slow follows one link per iteration and fast follows two. For even n this returns the second middle. Finding the kth node from the end uses a different variant: first move fast k links, then advance both pointers one link at a time (1<=k<=n).",

  vocabulary: [
  {
    "term": "Slow pointer",
    "definition": "A pointer that advances one node per iteration (the 'tortoise')."
  },
  {
    "term": "Fast pointer",
    "definition": "A pointer that advances two nodes per iteration (the 'hare')."
  },
  {
    "term": "Two-pointer technique",
    "definition": "Coordinating two positions in one structure to solve a problem in a single pass."
  },
  {
    "term": "Middle node",
    "definition": "For odd n the exact centre; for even n the second of the two centre nodes with this convention."
  },
  {
    "term": "Single-pass",
    "definition": "Solving the problem with one traversal instead of counting first, then walking again."
  }
],

  concepts: {
  "purpose": "Locate a position defined relative to the list's length (the middle, the n/2 point, the k-from-end point) in one pass, and provide the mechanism cycle detection relies on.",
  "operations": "Middle/cycle: slow moves one link and fast two. Kth from end: create a k-link gap, then move both at the same speed.",
  "uses": "Finding the middle for merge-sorting a list or splitting it, detecting cycles, finding the k-th node from the end (offset the fast pointer by k first).",
  "tradeoffs": "One pass and O(1) extra space versus the simpler but two-pass count-then-walk approach. The convention for the middle of an even-length list must be stated (this version returns the second middle).",
  "commonMistakes": "Checking only `fast is not None` (then `fast.next.next` can crash); checking `fast.next.next` in the condition (over-restrictive, mishandles ends); advancing fast by one — that just reproduces a normal traversal.",
  "edgeCases": "Empty list (head None): loop never runs, returns None. Single node: loop never runs, returns that node. Two nodes: one iteration, returns the second."
},

  complexity: [
  {
    "operation": "Find middle (slow/fast)",
    "best": "O(n)",
    "average": "O(n)",
    "worst": "O(n)",
    "space": "O(1)",
    "note": "floor(n/2) iterations: one slow link and two fast links per iteration."
  },
  {
    "operation": "Count-then-walk (baseline)",
    "best": "O(n)",
    "average": "O(n)",
    "worst": "O(n)",
    "space": "O(1)",
    "note": "Two passes over the list: same big-O, more work."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of nodes in the list"
    }
  ],
  "costModel": "Advancing a pointer along `next` is O(1). Each loop iteration does a constant number of pointer moves and comparisons.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The loop executes floor(n/2) times with constant reference work. Slow follows floor(n/2) links, fast twice as many; their total work is O(n). The input remains retained so both can follow its links."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Only two pointers, `slow` and `fast`, are kept regardless of list length. No structure that grows with n is created.",
    "inputOutputNote": "The n-node list is the pre-existing input and is not counted as auxiliary space. The bound covers the named algorithm; demonstration construction and collected print output are separate allocations."
  },
  "derivation": [
    {
      "lines": [
        11,
        12
      ],
      "description": "Initialise both pointers at the head — constant work done once.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        13,
        14,
        15
      ],
      "description": "Loop runs ~n/2 times; each iteration advances slow by 1 and fast by 2 (constant work).",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        11,
        12
      ],
      "description": "Two pointers stored, independent of n.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Following `next` is O(1) (a direct reference).",
    "The list is finite and acyclic, so fast reaches the end.",
    "Middle convention: for even n, slow ends on the SECOND of the two middle nodes."
  ],
  "tradeoffs": "The count-then-walk baseline is also O(n) time / O(1) space but makes two passes and needs the length; slow/fast needs neither. Against storing nodes in a list for O(1) indexing, slow/fast avoids the O(n) extra space.",
  "counters": [
    {
      "label": "slow steps",
      "definition": "executions of the slow-advance line (line 14)",
      "countLines": [
        14
      ]
    },
    {
      "label": "loop iterations",
      "definition": "executions of the loop body (lines 14-15)",
      "countLines": [
        15
      ]
    }
  ],
  "fixedDataNote": "The two calls use fixed 5- and 4-node lists, so you observe 2 and 2 loop iterations respectively. The O(n) bound describes how the iteration count grows (~n/2) as the list lengthens."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": true,
    "explanation": "Define the Node class (value plus a next reference)."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Constructor storing the value and optional next node."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Store the value as `val`."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Store the next reference as `next` (None by default)."
  },
  {
    "line": 5,
    "executable": false,
    "explanation": "Blank line — no runtime effect."
  },
  {
    "line": 6,
    "executable": false,
    "explanation": "Comment: build a five-node list."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Build 1 -> 2 -> 3 -> 4 -> 5 by nesting constructors; head points at 1."
  },
  {
    "line": 8,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 9,
    "executable": false,
    "explanation": "Comment describing the two-speed idea."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Define middle(head)."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Start the slow pointer at the head."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Start the fast pointer at the head too."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Loop while there is room for fast to take two steps (both fast and fast.next must exist)."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Advance slow by one node."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Advance fast by two nodes."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "When the loop ends, slow is at the middle; return it."
  },
  {
    "line": 17,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "Odd length (5): prints 3, the exact middle."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "Even length (4): prints 3, the second of the two middle nodes (2 and 3)."
  }
],

  bindings: [
  {
    "variable": "head",
    "model": "linked-list",
    "overlays": [
      {
        "role": "pointer",
        "label": "slow",
        "source": "slow"
      },
      {
        "role": "pointer",
        "label": "fast",
        "source": "fast"
      }
    ]
  }
],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "For an odd-length list like 1 -> 2 -> 3 -> 4, which node does `slow` end on, and why?",
    "answer": "Node 3 (the second of the two middles). Fast steps head->3->None; slow steps head->2->3.",
    "explanation": "With this loop, fast lands on None after two iterations while slow advances twice, ending on the second middle node. Starting fast at head.next would instead yield the first middle."
  }
],

  experiments: [
  "Print slow.val and fast position each iteration to watch the two speeds.",
  "Start fast at head.next and observe slow land on the FIRST middle for odd lengths.",
  "Adapt it to return the k-th node from the end by advancing fast k nodes before the loop."
],

  exercises: [
  {
    "id": "llsf-complete-1",
    "kind": "complete-code",
    "prompt": "Complete the loop so `slow` ends at the middle node.",
    "starterCode": "def middle(head):\n    slow = head\n    fast = head\n    while fast is not None and fast.next is not None:\n        # TODO: advance slow by one and fast by two\n        pass\n    return slow",
    "expected": "def middle(head):\n    slow = head\n    fast = head\n    while fast is not None and fast.next is not None:\n        slow = slow.next\n        fast = fast.next.next\n    return slow",
    "hints": [
      "Goal: use slow/fast pointers so slow ends on the middle node.",
      "A two-pass count-then-walk works, but one pass with two speeds is enough.",
      "Key insight: when fast advances twice as fast, it reaches the end as slow reaches the middle.",
      "Approach: move slow one and fast two per iteration, guarding fast and fast.next.",
      "Pseudocode: while fast and fast.next: slow = slow.next; fast = fast.next.next; return slow.",
      "Inside the loop write `slow = slow.next` and `fast = fast.next.next`."
    ],
    "tests": "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\n# Odd length: middle is the exact centre. [1,2,3,4,5] -> 3.\nassert middle(build([1, 2, 3, 4, 5])).val == 3, 'odd-length middle'\n# Even length: slow/fast lands on the second of the two middles. [1,2,3,4] -> 3.\nassert middle(build([1, 2, 3, 4])).val == 3, 'even-length upper middle'\nassert middle(build([1])).val == 1, 'singleton is its own middle'\nassert middle(build([1, 2])).val == 2, 'two nodes -> second'\nprint('OK')"
  },
  {
    "id": "llsf-fix-1",
    "kind": "fix-mistake",
    "prompt": "The loop below checks only fast. It crashes on odd nonempty acyclic lists (including a singleton) when fast.next is None. Fix the guard so both fast and its next node exist.",
    "starterCode": "def middle(head):\n    slow = head\n    fast = head\n    while fast is not None:\n        slow = slow.next\n        fast = fast.next.next\n    return slow",
    "expected": "def middle(head):\n    slow = head\n    fast = head\n    while fast is not None and fast.next is not None:\n        slow = slow.next\n        fast = fast.next.next\n    return slow",
    "hints": [
      "Understand: test a singleton and a three-node list.",
      "Failure: on the final odd-length iteration fast exists but fast.next is None.",
      "Property: reading fast.next.next requires both intermediate nodes to exist.",
      "Approach: short-circuit with fast is not None and fast.next is not None.",
      "Pseudocode: while both exist, advance slow once and fast twice.",
      "Solution: while fast is not None and fast.next is not None: slow=slow.next; fast=fast.next.next. Even lengths already exit when fast becomes None."
    ],
    "tests": "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\n# Odd length: exact centre.\nassert middle(build([1, 2, 3])).val == 2, f'middle of [1,2,3] is 2, got {middle(build([1,2,3])).val}'\n# Even length (buggy crashes on None.next.next): upper middle.\nassert middle(build([1, 2, 3, 4])).val == 3, f'even-length upper middle is 3, got {middle(build([1,2,3,4])).val}'\nassert middle(build([1])).val == 1, 'singleton is its own middle'\nassert middle(build([1, 2])).val == 2, 'two nodes -> second'\nprint('OK')"
  },
  {
    "id": "llsf-predict-1",
    "kind": "predict-state",
    "prompt": "For 1 -> 2 -> 3 -> 4 -> 5, how many loop iterations run and where does slow end?",
    "expected": "2 iterations; slow ends on node 3.",
    "hints": [
      "Fast goes head->3->5, then can't step twice.",
      "Slow moves once per iteration.",
      "Two iterations move slow head->2->3."
    ]
  }
],

  review: "The **slow/fast pointer** technique walks two pointers through one list — slow by one node, fast by two. When fast reaches the end, slow sits at the **middle**, found in a **single O(n) pass** with **O(1)** space and no length count. The safe loop condition is `while fast is not None and fast.next is not None`, because fast reads two links ahead. For odd lengths this convention returns the **second** middle. The same two-speed mechanism powers cycle detection next.",

  expectedOutput: "3\n3\n",

  references: [
  {
    "url": "https://cp-algorithms.com/others/tortoise_and_hare.html",
    "title": "Floyd cycle finding",
    "section": "Steps 1 and 2; proof of cycle-entry recovery",
    "topic": "linked-list-slow-fast",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Guard both fast and fast.next before two-link movement."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source pseudocode uses C++ pointer equality. App Python compares node identity with is; slow moves one link, fast two, then resets one pointer for entry recovery."
    ]
  },
  {
    "url": "https://opendatastructures.org/ods-python/3_1_SLList_Singly_Linked_Li.html",
    "title": "Open Data Structures: SLList",
    "section": "3.1 stack and queue operations; Figure 3.1",
    "topic": "linked-list-slow-fast",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "A next reference is retained, unlike a consumable iterator."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source and app use next links and optional head/tail references. Access by index requires traversal; constant-time deletion needs the predecessor."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "d05f80d3a7da0d3c",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
