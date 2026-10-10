/**
 * Lesson: Linked lists — finding the middle (slow/fast application).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "30\n3\n". Applies slow/fast to a concrete task
 * and contrasts it with the count-then-walk baseline.
 */

import type { LessonDefinition } from "../../core/types";

const code = `class Node:
    def __init__(self, val, nxt=None):
        self.val = val
        self.next = nxt

def build(values):
    head = None
    for v in reversed(values):
        head = Node(v, head)
    return head

# One-pass middle with slow/fast pointers.
def middle(head):
    slow = head
    fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
    return slow

# Two-pass baseline: count first, then walk half way.
def middle_count(head):
    n = 0
    node = head
    while node is not None:
        n += 1
        node = node.next
    node = head
    for _ in range(n // 2):
        node = node.next
    return node

print(middle(build([10, 20, 30, 40, 50])).val)  # 30 (exact middle)
print(middle_count(build([1, 2, 3, 4, 5])).val)  # 3, same node via counting`;

export const linkedListMiddle: LessonDefinition = {
  id: "linked-list-middle",
  title: "Linked Lists: Finding the Middle",
  area: "Linear structures",
  prerequisites: [
  "linked-list-slow-fast"
],

  explanation: "**Finding the middle** of a linked list is a small task that shows off the slow/fast pattern against an honest baseline. Two solutions give the same node:\n\n**Count-then-walk (two passes):** first traverse the whole list to count `n` nodes, then walk `n // 2` steps from the head. Simple and correct, but it reads the list **twice**.\n\n**Slow/fast (one pass):** advance `slow` by one and `fast` by two; when `fast` reaches the end, `slow` is at the middle. Same **O(n)** time and **O(1)** space, but a **single traversal** and no need to know the length in advance — which matters when a separate length pass is unwanted, or when you want to split the list at the middle for merge sort.\n\nBoth share the even-length **convention**: with `fast`/`slow` starting at the head and this loop, the middle of an even list is the **second** of the two central nodes. `middle_count` matches that because `n // 2` walks to the same index. The lesson's real point is recognition: when a task is defined **relative to the list's length**, the slow/fast pattern usually removes the counting pass. In the example, [10,20,30,40,50] has middle 30, and the counting method confirms 3 for [1,2,3,4,5].\n\nThis requires retained linked nodes, whose next links can be followed independently. It is not an algorithm for an iterator that consumes each item only once: the fast pointer can pass nodes that slow must later visit.",

  vocabulary: [
  {
    "term": "Middle node",
    "definition": "The centre node; for even length, the second of the two centre nodes by this convention."
  },
  {
    "term": "One-pass",
    "definition": "Solving with a single traversal instead of counting then walking again."
  },
  {
    "term": "Two-pass baseline",
    "definition": "Count the nodes, then walk n//2 steps — correct but reads the list twice."
  },
  {
    "term": "Floor division",
    "definition": "n // 2 rounds down; it lands on the same index the slow/fast method reaches."
  }
],

  concepts: {
  "purpose": "Locate the centre node, e.g. to split a list for merge sort or to check a palindrome by comparing halves.",
  "operations": "Slow/fast: slow += 1, fast += 2 until fast runs out. Count-then-walk: count n, then advance n//2.",
  "uses": "Splitting a list into halves, palindrome checks, extracting the median position, binary-search-like partitioning of a list.",
  "tradeoffs": "Same big-O for both; slow/fast makes one pass and needs no length. Count-then-walk is arguably easier to read.",
  "commonMistakes": "Mismatching conventions (first vs second middle) between the two methods; wrong loop condition in slow/fast; off-by-one in n//2 (using n//2 + 1 or ceil unintentionally).",
  "edgeCases": "Empty list returns None (slow starts as head=None; count is 0). Single node returns itself. Two nodes returns the second."
},

  complexity: [
  {
    "operation": "Middle (slow/fast)",
    "best": "O(n)",
    "average": "O(n)",
    "worst": "O(n)",
    "space": "O(1)",
    "note": "floor(n/2) iterations, each with a two-link fast advance."
  },
  {
    "operation": "Middle (count-then-walk)",
    "best": "O(n)",
    "average": "O(n)",
    "worst": "O(n)",
    "space": "O(1)",
    "note": "Two passes: count n, then walk n//2."
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
  "costModel": "Advancing along `next` is O(1). Each iteration of either method does constant work.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "Slow/fast runs about n/2 iterations (fast moves two nodes), each constant work, so O(n). Count-then-walk does one full pass of n steps to count plus n/2 steps to walk — n + n/2 = O(n). Both are linear in the number of nodes."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Each method keeps a fixed number of pointers/counters (slow and fast, or n and node) regardless of list length.",
    "inputOutputNote": "The list is the pre-existing input; the returned node is one of its existing nodes. The bound covers the named algorithm; demonstration construction and collected print output are separate allocations."
  },
  "derivation": [
    {
      "lines": [
        14,
        15
      ],
      "description": "Initialise slow/fast — constant work.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        16,
        17,
        18
      ],
      "description": "slow/fast loop runs ~n/2 times, constant work each.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        24,
        25,
        26,
        27
      ],
      "description": "Baseline counting pass visits all n nodes.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        14,
        15
      ],
      "description": "A constant number of pointers only.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Following `next` is O(1).",
    "Even-length convention: the middle is the SECOND of the two central nodes.",
    "The list is finite and acyclic."
  ],
  "tradeoffs": "Slow/fast uses O(1) space and avoids a separate counting pass on retained linked nodes. Counting then walking also uses O(1) space and is valid when an extra pass is acceptable. A consumable iterator is a different input representation.",
  "counters": [
    {
      "label": "fast advances",
      "definition": "Executions of the two-link advance on line 18.",
      "countLines": [
        18
      ]
    },
    {
      "label": "baseline count steps",
      "definition": "Executions of the count increment on line 26.",
      "countLines": [
        26
      ]
    }
  ],
  "fixedDataNote": "The fixed 5-node lists give ~2 slow/fast iterations and 5 counting steps. The O(n) bound describes growth with list length."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": true,
    "explanation": "Define the Node class."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Constructor storing value and optional next."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Store the value."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Store the next reference."
  },
  {
    "line": 5,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Helper to build a list from values."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Start empty."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Prepend in reverse to keep the order."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Create each node in front."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Return the head."
  },
  {
    "line": 11,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 12,
    "executable": false,
    "explanation": "Comment: one-pass middle."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Define middle(head)."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "slow starts at head."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "fast starts at head."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "Loop while fast can step twice."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Advance slow by one."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "Advance fast by two."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "slow is at the middle; return it."
  },
  {
    "line": 20,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 21,
    "executable": false,
    "explanation": "Comment: two-pass baseline."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "Define middle_count(head)."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "Start the count at zero."
  },
  {
    "line": 24,
    "executable": true,
    "explanation": "Begin at the head."
  },
  {
    "line": 25,
    "executable": true,
    "explanation": "Count nodes: increment while walking."
  },
  {
    "line": 26,
    "executable": true,
    "explanation": "Increment the count."
  },
  {
    "line": 27,
    "executable": true,
    "explanation": "Advance to next."
  },
  {
    "line": 28,
    "executable": true,
    "explanation": "Reset to the head for the second pass."
  },
  {
    "line": 29,
    "executable": true,
    "explanation": "Walk n // 2 steps to the middle."
  },
  {
    "line": 30,
    "executable": true,
    "explanation": "Advance one step."
  },
  {
    "line": 31,
    "executable": true,
    "explanation": "Return the node at the middle index."
  },
  {
    "line": 32,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 33,
    "executable": true,
    "explanation": "slow/fast middle of [10,20,30,40,50] -> 30."
  },
  {
    "line": 34,
    "executable": true,
    "explanation": "count-then-walk middle of [1,2,3,4,5] -> 3."
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
    "prompt": "Both methods use the 'second middle' convention for even lengths. Which change to `middle` would make it return the FIRST middle instead?",
    "answer": "Start fast at head.next (or stop one step earlier), so slow advances one fewer time.",
    "explanation": "Offsetting fast by one node shifts where slow lands, giving the first of the two central nodes for even lengths."
  }
],

  experiments: [
  "Use middle() to split the list into two halves and print each half.",
  "Feed an even-length list to both functions and confirm they agree on the second middle.",
  "Modify middle() to return the first middle for even lengths."
],

  exercises: [
  {
    "id": "llmid-complete-1",
    "kind": "complete-code",
    "prompt": "Complete the count-then-walk method to return the middle node.",
    "starterCode": "def middle_count(head):\n    n = 0\n    node = head\n    while node is not None:\n        n += 1\n        node = node.next\n    node = head\n    for _ in range(n // 2):\n        # TODO: step forward\n        pass\n    return node",
    "expected": "def middle_count(head):\n    n = 0\n    node = head\n    while node is not None:\n        n += 1\n        node = node.next\n    node = head\n    for _ in range(n // 2):\n        node = node.next\n    return node",
    "hints": [
      "Goal: count the nodes, then walk halfway to return the middle node of the list.",
      "The repeated work is one full pass to count plus a partial second pass; storing nodes in a list would waste O(n) space instead.",
      "Key insight: after counting n nodes, the middle sits n // 2 steps from the head.",
      "Approach: do a count-then-walk in two loops, advancing one node per step in the second loop.",
      "Pseudocode: count nodes into n; reset node to head; repeat n // 2 times moving node forward; return node.",
      "Inside the second loop write `node = node.next` so it advances one node per step toward the middle."
    ],
    "tests": "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\nassert middle_count(build([1, 2, 3, 4, 5])).val == 3, 'odd-length middle'\nassert middle_count(build([1, 2, 3, 4])).val == 3, 'even-length upper middle (n//2 steps)'\nassert middle_count(build([1])).val == 1, 'singleton'\nassert middle_count(build([1, 2])).val == 2, 'two nodes -> second'\nprint('OK')"
  },
  {
    "id": "llmid-choose-1",
    "kind": "choose-approach",
    "prompt": "A finite retained singly linked list has unknown length. Find its second middle in O(1) auxiliary space without a separate length-counting pass. Which approach fits?",
    "expected": "Slow/fast pointers: both start at head, slow advances one link and fast two while both fast and fast.next exist. This uses one traversal and O(1) auxiliary space. Counting then walking also uses O(1) space but needs a separate pass.",
    "hints": [
      "Understand: nodes and next links stay available throughout the walk.",
      "Baseline: count the length, then start another walk to index n//2.",
      "Property: a pointer moving twice as fast reaches the end when the other reaches the middle.",
      "Approach: slow and fast start at head.",
      "Pseudocode: while fast and fast.next exist, slow=slow.next; fast=fast.next.next.",
      "Solution: return slow (None for empty input; the second middle for even length). A consumable iterator does not support two independent node cursors."
    ],
    "recognition": {
      "scenario": "A retained singly linked list has unknown length; find its second middle without a separate counting pass. O(1) auxiliary space is required.",
      "approaches": [
        {
          "id": "slow-fast",
          "label": "Slow/fast pointers in a single pass",
          "requiredReasonIds": [
            "one-pass-middle"
          ]
        },
        {
          "id": "count-then-walk",
          "label": "Count the length, then walk to length/2",
          "requiredReasonIds": [],
          "rejectionFeedback": "Counting then walking is a valid O(1)-space baseline, but adds the separate counting pass excluded by this scenario."
        }
      ],
      "reasons": [
        {
          "id": "one-pass-middle",
          "text": "Advancing fast by two and slow by one lands slow at the middle when fast reaches the end — one pass, no length known in advance."
        },
        {
          "id": "need-length-first",
          "text": "You must know the length before you can find the middle, so a counting pass is unavoidable.",
          "contradictory": true
        },
        {
          "id": "extra-pass-allowed",
          "text": "The scenario allows a separate counting pass.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "slow-fast"
      ],
      "modelExplanation": "Slow/fast pointers: both start at head, slow advances one link and fast two while both fast and fast.next exist. This uses one traversal and O(1) auxiliary space. Counting then walking also uses O(1) space but needs a separate pass."
    }
  },
  {
    "id": "llmid-predict-1",
    "kind": "predict-state",
    "prompt": "For [10,20,30,40,50], how many times does the slow/fast loop run, and which node does slow end on?",
    "expected": "2 iterations; slow ends on node 30.",
    "hints": [
      "fast goes head->30->50, then stops.",
      "slow moves once per iteration.",
      "Two iterations: head->20->30."
    ]
  }
],

  review: "**Finding the middle** has two equal-cost solutions: **count-then-walk** (two passes) and **slow/fast** (one pass). Both are **O(n)** time, **O(1)** space, and share the even-length convention of returning the **second** central node. Prefer slow/fast when you want a single pass or don't know the length — for splitting a list in merge sort or checking palindromes. In the example the middle is 30 (and 3 for the counting method).",

  expectedOutput: "30\n3\n",

  references: [
  {
    "url": "https://cp-algorithms.com/others/tortoise_and_hare.html",
    "title": "Floyd cycle finding",
    "section": "Steps 1 and 2; proof of cycle-entry recovery",
    "topic": "linked-list-middle",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Two-link movement must check the intermediate next reference."
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
    "topic": "linked-list-middle",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Linked nodes support retained references and sequential access."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source and app use next links and optional head/tail references. Access by index requires traversal; constant-time deletion needs the predecessor."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "177fe06df5798e65",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
