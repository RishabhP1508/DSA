/**
 * Lesson: Linked lists — dummy (sentinel) nodes.
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "[1, 2, 3, 4]\n[]\n". Shows how a dummy head
 * removes head-edge special cases when removing nodes.
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

def to_list(head):
    out = []
    while head is not None:
        out.append(head.val)
        head = head.next
    return out

# Remove every node equal to target — even at the head — with no special case.
def remove_all(head, target):
    dummy = Node(0, head)     # sits BEFORE the real head
    prev = dummy
    curr = head
    while curr is not None:
        if curr.val == target:
            prev.next = curr.next   # unlink curr (works even if curr is the head)
        else:
            prev = curr             # keep curr; advance prev
        curr = curr.next
    return dummy.next          # new head (the old head may have been removed)

print(to_list(remove_all(build([1, 2, 6, 3, 6, 6, 4]), 6)))
print(to_list(remove_all(build([6, 6, 6]), 6)))`;

export const linkedListDummyNodes: LessonDefinition = {
  id: "linked-list-dummy-nodes",
  title: "Linked Lists: Dummy Nodes",
  area: "Linear structures",
  prerequisites: [
  "linked-list-traversal"
],

  explanation: "A **dummy node** (also called a **sentinel** or **dummy head**) is an extra throwaway node placed **before the real first node**. It exists to make code that adds or removes nodes **uniform**, by eliminating the awkward special case where the operation touches the **head** itself.\n\nConsider removing every node with a given value. Without a dummy, removing a node in the middle is easy (`prev.next = curr.next`), but removing the **head** is different — you must reassign the head variable. That \"is it the head?\" branch is exactly where off-by-one bugs live. With a dummy: set `dummy.next = head`, start `prev = dummy`, and now **every** node — including the original head — has a real `prev` in front of it, so a single unlink line handles all cases. At the end, the true head is `dummy.next` (which may differ from the original head if the head was removed).\n\nThe dummy costs **O(1)** extra space (one node) and does not change the algorithm's time complexity. In the example, removing all 6s from [1,2,6,3,6,6,4] gives [1,2,3,4], and removing all 6s from [6,6,6] — where **every** node including the head is deleted — correctly yields the empty list `[]`, with no special-case code. The upcoming merge lesson uses the same trick, and it appears constantly in insertion, deletion, and partitioning problems.",

  vocabulary: [
  {
    "term": "Dummy node",
    "definition": "An extra placeholder node before the real head that removes head-edge special cases."
  },
  {
    "term": "Sentinel",
    "definition": "Another name for a dummy node used to simplify boundary handling."
  },
  {
    "term": "prev pointer",
    "definition": "The node just before curr; needed to unlink curr with prev.next = curr.next."
  },
  {
    "term": "Head-edge case",
    "definition": "The special situation where an operation affects the first node."
  },
  {
    "term": "Unlink",
    "definition": "Removing a node by pointing its predecessor's next past it."
  }
],

  concepts: {
  "purpose": "Simplify insertions and deletions (especially at the head) by guaranteeing every real node has a predecessor.",
  "operations": "Create dummy with dummy.next = head; walk prev/curr; unlink with prev.next = curr.next; return dummy.next.",
  "uses": "Removing nodes by value or position, deleting the head safely, merging lists, partitioning a list, inserting before the head.",
  "tradeoffs": "One extra node of O(1) space in exchange for removing branchy edge-case code — usually well worth it.",
  "commonMistakes": "Returning dummy instead of dummy.next; advancing prev even when a node is removed (skips a node); forgetting the dummy and mishandling head deletion.",
  "edgeCases": "All nodes removed: returns None (empty). Nothing matches: list unchanged. Head matches: handled uniformly thanks to the dummy."
},

  complexity: [
  {
    "operation": "Remove all matching (with dummy)",
    "best": "O(n)",
    "average": "O(n)",
    "worst": "O(n)",
    "space": "O(1)",
    "note": "Single pass; one dummy node of extra space."
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
  "costModel": "Comparing a value and reassigning a `next` reference are O(1). Each loop iteration processes one node.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The loop visits each node exactly once, doing constant work per node (a comparison and one pointer update). So the total time is proportional to n regardless of how many nodes are removed."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Only the single dummy node and the pointers prev and curr are added, independent of n. No structure grows with the list.",
    "inputOutputNote": "The list is modified in place; the returned head reuses existing nodes. The bound covers the named algorithm; demonstration construction and collected print output are separate allocations."
  },
  "derivation": [
    {
      "lines": [
        21,
        22,
        23
      ],
      "description": "Create the dummy and initialise prev/curr — constant work once.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        24,
        25,
        26,
        27,
        28,
        29
      ],
      "description": "Loop runs once per node, constant work each (compare, maybe unlink, advance).",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        21
      ],
      "description": "One dummy node plus two pointers.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Comparing values and reassigning `next` are O(1).",
    "The list is finite and acyclic.",
    "The dummy is discarded after returning dummy.next."
  ],
  "tradeoffs": "Without a dummy you save one node but add a head-deletion branch and its bug surface; the dummy trades O(1) space for simpler, more robust code.",
  "counters": [
    {
      "label": "nodes examined",
      "definition": "executions of the loop body (line 25)",
      "countLines": [
        25
      ]
    },
    {
      "label": "nodes unlinked",
      "definition": "executions of the unlink line (line 26)",
      "countLines": [
        26
      ]
    }
  ],
  "fixedDataNote": "The first call examines 7 nodes and unlinks 3; the second examines 3 and unlinks all 3 (returning empty). The O(n) bound describes the per-node work as the list grows."
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
    "explanation": "Prepend in reverse to keep order."
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
    "executable": true,
    "explanation": "Helper to convert to a Python list."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Start with empty output."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Walk while a node exists."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Collect the value."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "Advance."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Return values."
  },
  {
    "line": 18,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 19,
    "executable": false,
    "explanation": "Comment: remove all matching, no special case."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Define remove_all(head, target)."
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "Create the dummy node pointing at the real head."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "prev starts at the dummy, so even the head has a predecessor."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "curr starts at the head."
  },
  {
    "line": 24,
    "executable": true,
    "explanation": "Loop through every node."
  },
  {
    "line": 25,
    "executable": true,
    "explanation": "If this node matches the target..."
  },
  {
    "line": 26,
    "executable": true,
    "explanation": "...unlink it; this line works uniformly even when curr is the head."
  },
  {
    "line": 27,
    "executable": false,
    "explanation": "Otherwise keep the node."
  },
  {
    "line": 28,
    "executable": true,
    "explanation": "Advance prev only when we keep a node."
  },
  {
    "line": 29,
    "executable": true,
    "explanation": "Always advance curr to the next node."
  },
  {
    "line": 30,
    "executable": true,
    "explanation": "Return dummy.next — the possibly-new head."
  },
  {
    "line": 31,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 32,
    "executable": true,
    "explanation": "Remove 6s from [1,2,6,3,6,6,4] -> [1, 2, 3, 4]."
  },
  {
    "line": 33,
    "executable": true,
    "explanation": "Remove 6s from [6,6,6] -> [] (every node, including the head, deleted)."
  }
],

  bindings: [
  {
    "variable": "dummy",
    "model": "linked-list",
    "overlays": [
      {
        "role": "pointer",
        "label": "prev",
        "source": "prev"
      },
      {
        "role": "pointer",
        "label": "curr",
        "source": "curr"
      }
    ]
  }
],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "Why is removing the head node no longer a special case once a dummy is used?",
    "answer": "Because the dummy sits before the head, the head has a real predecessor (prev = dummy). The single line prev.next = curr.next unlinks the head just like any other node.",
    "explanation": "Without a dummy, deleting the head means reassigning the head variable — a different code path. The dummy gives every node a predecessor, unifying the logic."
  }
],

  experiments: [
  "Remove a value that isn't present and confirm the list is unchanged.",
  "Add a count of removed nodes and print it.",
  "Rewrite without the dummy and handle head deletion explicitly to feel the difference."
],

  exercises: [
  {
    "id": "lldn-complete-1",
    "kind": "complete-code",
    "prompt": "Complete remove_all so it deletes every node equal to target using the dummy.",
    "starterCode": "def remove_all(head, target):\n    dummy = Node(0, head)\n    prev = dummy\n    curr = head\n    while curr is not None:\n        if curr.val == target:\n            # TODO: unlink curr\n            pass\n        else:\n            prev = curr\n        curr = curr.next\n    return dummy.next",
    "expected": "def remove_all(head, target):\n    dummy = Node(0, head)\n    prev = dummy\n    curr = head\n    while curr is not None:\n        if curr.val == target:\n            prev.next = curr.next\n        else:\n            prev = curr\n        curr = curr.next\n    return dummy.next",
    "hints": [
      "Goal: delete every node whose value equals target, returning the (possibly new) head via the dummy.",
      "Without a dummy you would special-case deleting the head repeatedly; the dummy removes that repeated branching.",
      "Key insight: unlinking a node just means pointing its predecessor past it, so prev must trail curr.",
      "Approach: use a dummy before head, keep prev/curr, and splice out matches while advancing.",
      "Pseudocode: dummy=Node(0,head); prev=dummy; walk curr; on match set prev.next=curr.next else move prev; always advance curr; return dummy.next.",
      "On a match write `prev.next = curr.next` and do NOT advance prev, so the removed node is skipped."
    ],
    "tests": "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\ndef to_list(head):\n    out = []\n    while head is not None:\n        out.append(head.val)\n        head = head.next\n    return out\nassert to_list(remove_all(build([1, 2, 6, 3, 6]), 6)) == [1, 2, 3], 'interior removals'\nassert to_list(remove_all(build([6, 1, 6]), 6)) == [1], 'removing the head node'\nassert to_list(remove_all(build([6, 6, 6]), 6)) == [], 'removing everything'\nassert to_list(remove_all(build([1, 2, 3]), 9)) == [1, 2, 3], 'target absent -> unchanged'\nassert remove_all(None, 1) is None, 'empty list'\nprint('OK')"
  },
  {
    "id": "lldn-fix-1",
    "kind": "fix-mistake",
    "prompt": "This returns the wrong head when the first node is deleted. Fix the return; the dummy setup is already correct.",
    "starterCode": "def remove_all(head, target):\n    dummy = Node(0, head)\n    prev = dummy\n    curr = head\n    while curr is not None:\n        if curr.val == target:\n            prev.next = curr.next\n        else:\n            prev = curr\n        curr = curr.next\n    return head",
    "expected": "def remove_all(head, target):\n    dummy = Node(0, head)\n    prev = dummy\n    curr = head\n    while curr is not None:\n        if curr.val == target:\n            prev.next = curr.next\n        else:\n            prev = curr\n        curr = curr.next\n    return dummy.next",
    "hints": [
      "Goal: return the correct head even when the original first node was the one deleted.",
      "Returning `head` is the bug: if the first node was removed, `head` no longer points at the surviving list.",
      "Key insight: the dummy always precedes the current first node, so it tracks the real head across deletions.",
      "Approach: anchor a dummy before head and return through it instead of the raw head variable.",
      "Pseudocode: set dummy=Node(0,head), run the prev/curr removal loop, then return dummy.next.",
      "Return `dummy.next` so the answer reflects the current first node no matter what was deleted."
    ],
    "tests": "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\ndef to_list(head):\n    out = []\n    while head is not None:\n        out.append(head.val)\n        head = head.next\n    return out\n# The bug returns `head` (stale) when the first node is deleted; the fix returns\n# dummy.next. This case distinguishes them: removing the leading 6 must drop it.\nassert to_list(remove_all(build([6, 1, 2]), 6)) == [1, 2], 'leading node removed -> new head'\nassert to_list(remove_all(build([6, 6, 3]), 6)) == [3], 'multiple leading removals'\nassert to_list(remove_all(build([1, 6, 2]), 6)) == [1, 2], 'interior removal still works'\nassert to_list(remove_all(build([1, 2]), 9)) == [1, 2], 'no match -> unchanged'\nprint('OK')"
  },
  {
    "id": "lldn-predict-1",
    "kind": "predict-state",
    "prompt": "What does remove_all(build([6,6,6]), 6) return, and why does the dummy matter here?",
    "expected": "remove_all returns None: every real node is removed and dummy.next becomes None. Converting that returned head with to_list produces [], which is what the demonstration prints.",
    "hints": [
      "Understand: remove_all returns a node reference, not a Python list.",
      "Each matching node is bypassed through prev.next.",
      "The dummy stays, but is never included in the returned result.",
      "When all nodes match, dummy.next is None.",
      "Pseudocode: return dummy.next after the loop.",
      "Solution: the returned head is None; to_list(None) is []."
    ]
  }
],

  review: "A **dummy (sentinel) node** placed before the head gives every real node a predecessor, so insertions and deletions — including at the **head** — use one uniform code path. It costs **O(1)** space and does not change time complexity. Always return `dummy.next` (not the old `head`, which may be deleted) and don't advance `prev` when you remove a node. The technique cleanly handles deleting all nodes (returns empty) and underlies merging and partitioning.",

  expectedOutput: "[1, 2, 3, 4]\n[]\n",

  references: [
  {
    "url": "https://opendatastructures.org/ods-python/3_2_DLList_Doubly_Linked_Li.html",
    "title": "Open Data Structures: DLList",
    "section": "3.2 dummy sentinel; insertion and removal",
    "topic": "linked-list-dummy-nodes",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "A sentinel unifies updates at boundaries."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source uses a circular doubly linked dummy sentinel. The app also shows null-terminated doubly lists and a circular singly list; these are different representations."
    ]
  },
  {
    "url": "https://opendatastructures.org/ods-python/3_1_SLList_Singly_Linked_Li.html",
    "title": "Open Data Structures: SLList",
    "section": "3.1 stack and queue operations; Figure 3.1",
    "topic": "linked-list-dummy-nodes",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Head deletion changes the entry reference."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source and app use next links and optional head/tail references. Access by index requires traversal; constant-time deletion needs the predecessor."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "b180ab157478a517",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
