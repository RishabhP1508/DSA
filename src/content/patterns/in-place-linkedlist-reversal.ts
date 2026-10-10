/**
 * Pattern: In-place linked-list reversal.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "[1, 4, 3, 2, 5]\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `class Node:
    def __init__(self, v, nxt=None):
        self.val = v
        self.next = nxt

def build(vals):
    head = None
    for v in reversed(vals):
        head = Node(v, head)
    return head

def to_list(h):
    out = []
    while h:
        out.append(h.val)
        h = h.next
    return out

# Reverse only positions p..q, in place, using a dummy head.
def reverse_between(head, p, q):
    dummy = Node(0, head)
    prev = dummy
    for _ in range(p - 1):
        prev = prev.next          # walk to the node before position p
    curr = prev.next
    for _ in range(q - p):        # splice each following node to the front of the sublist
        nxt = curr.next
        curr.next = nxt.next
        nxt.next = prev.next
        prev.next = nxt
    return dummy.next

print(to_list(reverse_between(build([1, 2, 3, 4, 5]), 2, 4)))  # [1, 4, 3, 2, 5]`;

export const inPlaceLinkedListReversalPattern: PatternDefinition = {
  id: "in-place-linkedlist-reversal",
  title: "In-place LinkedList Reversal",
  category: "Linked lists & sequences",
  summary:
    "Rewire a linked list's next pointers in place to reverse all or part of it, using O(1) extra space.",

  clues: [
  "You must reverse a whole linked list, a sublist, or every k-node group.",
  "There's an explicit O(1)-space constraint (reuse nodes; don't build a new list or use a stack).",
  "Phrases like 'reverse the list', 'reverse nodes between positions', 'reverse in k-groups', 'reorder list'."
],

  naiveApproach: "Copy node values into an array, reverse them and write them back: O(n) extra storage and changed node-value associations. Or collect node references on a stack, then relink them in reverse order: preserved associations but still O(n) storage. Iterative pointer rewiring instead uses constant auxiliary storage.",

  whyItHelps: "Reversal is pointer surgery: walk the list keeping a handle on the **previous** node and, for each node, point its `next` **backwards** before advancing. That reverses a whole list in one pass with just a few pointers — **O(n) time, O(1) space**. For a **sublist** (positions p..q), a **dummy head** removes head edge cases: walk to the node before p, then repeatedly **splice** the node after `curr` to the front of the reversing section. The nodes are reused; only links change.",

  conditions: [
  "You may mutate the list in place (reuse existing nodes).",
  "Track the node BEFORE the reversing section (a dummy head makes reversing from position 1 uniform).",
  "For k-group reversal, only reverse a full group; leftover nodes stay as-is (state that convention).",
  "The list is finite and acyclic; positions are one-based with 1<=p<=q<=n. Invalid positions are outside this function's contract."
],

  alternatives: [
  "Recursion — elegant for full reversal but uses O(n) stack space; the iterative version is O(1).",
  "Copying values and writing them back uses O(n) storage and changes node-value associations. A stack of node references can preserve them while relinking, but still needs O(n) storage.",
  "Two-pointer collection then rebuild — unnecessary when in-place relinking is allowed."
],

  counterexamples: [
  "Swapping values leaves external references pointing to the same nodes, but changes the value each node carries. When node-to-value association must remain fixed, rewire nodes instead.",
  "Reversing without tracking the node before the sublist mangles the connection back to the unchanged prefix.",
  "Reversing a partial (incomplete) k-group when the problem says to leave leftovers untouched."
],

  walkthroughCode,
  walkthroughExpectedOutput: "[1, 4, 3, 2, 5]\n",
  complexityNote:
    "O(n) time (each node in the reversed section is relinked once) and O(1) extra space (a handful of pointers; nodes are reused).",

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of nodes in the list"
    },
    {
      "symbol": "q",
      "meaning": "the end position of the reversed section (1-based)"
    },
    {
      "symbol": "p",
      "meaning": "one-based start position"
    }
  ],
  "costModel": "Walk to the node before position p (O(p)), then splice each of the q−p following nodes to the front of the sublist with a constant number of pointer updates.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "Walking to position p (lines 23-24) is O(p). The splice loop (lines 26-30) runs q−p times, each doing a constant number of pointer reassignments. Since p and q are within the list, total work is O(q) ≤ O(n)."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Only a few pointers (dummy, prev, curr, nxt) are used; the existing nodes are relinked, not copied.",
    "inputOutputNote": "The linked list is modified in place and its head returned; one constant-space dummy, no new result nodes for the reversal. The bound covers the named algorithm; demonstration construction and collected print output are separate allocations."
  },
  "derivation": [
    {
      "lines": [
        23,
        24
      ],
      "description": "Walk to the node before position p.",
      "cost": "O(p)",
      "dimension": "time"
    },
    {
      "lines": [
        26,
        27,
        28,
        29,
        30
      ],
      "description": "Splice each of the q−p nodes to the front — O(1) each.",
      "cost": "O(q−p)",
      "dimension": "time"
    },
    {
      "lines": [
        21,
        22,
        25
      ],
      "description": "A constant number of pointers.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "1 <= p <= q <= n (valid positions).",
    "The dummy head avoids special-casing reversal that includes the head.",
    "Following/reassigning .next is O(1)."
  ],
  "tradeoffs": "Copying values into a list, reversing, and writing back is also O(n) time but O(n) space; in-place pointer splicing keeps O(1) space.",
  "counters": [
    {
      "label": "splices",
      "definition": "executions of the splice step (line 30)",
      "countLines": [
        30
      ]
    }
  ],
  "fixedDataNote": "Positions 2 through 4 include three nodes, but head insertion performs q-p=2 moves. Output is [1,4,3,2,5]."
},

  codeExplanations: [
  {
    "line": 1,
    "executable": true,
    "explanation": "Define the Node class (value + next)."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Constructor."
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
    "explanation": "Accumulator."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Walk the list."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Collect each value."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "Advance."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Return the values."
  },
  {
    "line": 18,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 19,
    "executable": false,
    "explanation": "Comment: reverse the sublist p..q in place."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Define reverse_between(head, p, q)."
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "Dummy head so reversing from position 1 needs no special case."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "prev will sit just before position p."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "Walk prev forward p-1 steps..."
  },
  {
    "line": 24,
    "executable": true,
    "explanation": "...to the node before the sublist."
  },
  {
    "line": 25,
    "executable": true,
    "explanation": "curr is the first node of the sublist (stays put, drifts to the end)."
  },
  {
    "line": 26,
    "executable": true,
    "explanation": "Repeat q-p times: pull each following node to the sublist's front."
  },
  {
    "line": 27,
    "executable": true,
    "explanation": "Remember the node to move."
  },
  {
    "line": 28,
    "executable": true,
    "explanation": "Unlink it from after curr."
  },
  {
    "line": 29,
    "executable": true,
    "explanation": "Point it at the current front of the sublist."
  },
  {
    "line": 30,
    "executable": true,
    "explanation": "Attach it right after prev (new front)."
  },
  {
    "line": 31,
    "executable": true,
    "explanation": "Return the (possibly unchanged) head via the dummy."
  },
  {
    "line": 32,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 33,
    "executable": true,
    "explanation": "Reversing positions 2..4 of 1->2->3->4->5 gives [1, 4, 3, 2, 5]."
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
      },
      {
        "role": "pointer",
        "label": "nxt",
        "source": "nxt"
      }
    ]
  },
  {
    "variable": "curr",
    "model": "linked-list"
  },
  {
    "variable": "nxt",
    "model": "linked-list"
  }
],

  linkedLessons: ["linked-list-reversal", "linked-list-pointer-manipulation", "linked-list-dummy-nodes"],

  exercises: [
  {
    "id": "pat-iplr-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'Reverse a singly linked list using O(1) extra memory.' Which pattern, and why not a stack?",
    "expected": "In-place linked-list reversal: relink each node's next to its predecessor in one pass — O(n) time, O(1) space. A stack would reverse it too but costs O(n) extra space, violating the constraint.",
    "correctPatternId": "in-place-linkedlist-reversal",
    "hints": [
      "Goal: reverse a singly linked list using O(1) extra memory.",
      "Pushing nodes onto a stack reverses them but costs O(n) space, violating the constraint.",
      "Key insight: you can reverse by relinking each node's next to its predecessor, no copying needed.",
      "Approach: use in-place reversal with prev/curr/next pointers in a single pass.",
      "Pseudocode: prev=None; curr=head; while curr: nxt=curr.next; curr.next=prev; prev=curr; curr=nxt; return prev.",
      "Use in-place linked-list reversal (relink with prev/curr/next) — O(n) time, O(1) space, unlike a stack."
    ],
    "recognition": {
      "scenario": "Reverse a singly linked list using O(1) extra memory.",
      "approaches": [
        {
          "id": "inplace-relink",
          "label": "In-place reversal (relink next pointers)",
          "requiredReasonIds": [
            "relink-one-pass"
          ]
        },
        {
          "id": "stack",
          "label": "Push nodes on a stack, pop to rebuild",
          "requiredReasonIds": [],
          "rejectionFeedback": "A stack reverses it but stores all n nodes — O(n) space, violating the O(1) constraint."
        }
      ],
      "reasons": [
        {
          "id": "relink-one-pass",
          "text": "Walk once, pointing each node's next at its predecessor with a couple of pointers — O(n) time, O(1) space."
        },
        {
          "id": "needs-extra-array",
          "text": "You must copy the values into an array to reverse them.",
          "contradictory": true
        },
        {
          "id": "needs-recursion-stack",
          "text": "Recursion is required, and its O(n) call stack is unavoidable.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "inplace-relink"
      ],
      "modelExplanation": "In-place reversal: relink each node's next to its predecessor in a single pass — O(n) time, O(1) space, meeting the memory limit."
    }
  },
  {
    "id": "pat-iplr-choose-1",
    "kind": "choose-approach",
    "prompt": "'Reverse the nodes of a list in groups of k (leaving a trailing partial group as-is).' Same pattern? Require O(1) auxiliary space and an integer k>=1.",
    "expected": "Yes — in-place reversal generalized to k-groups: reverse each full k-node group by relinking, connecting groups as you go, and leave an incomplete final group untouched. Still O(n) time, O(1) space.",
    "correctPatternId": "in-place-linkedlist-reversal",
    "hints": [
      "Goal: reverse the nodes of a list in groups of k, leaving a trailing partial group as-is.",
      "Copying values into an array wastes O(n) space; the relinking approach still works per group.",
      "Key insight: it's the same pointer relinking applied to each full k-node group, connecting groups as you go.",
      "Approach: use in-place reversal generalized to k-groups, reversing only complete groups.",
      "Pseudocode: for each full group of k: reverse it by relinking; connect it to the previous group; leave an incomplete final group.",
      "Yes — it's in-place reversal per k-group: reverse full groups and leave the incomplete final one untouched, O(n) time, O(1) space."
    ],
    "recognition": {
      "scenario": "Reverse the nodes of a list in groups of k, leaving a trailing partial group as-is. Same pattern as full reversal?",
      "approaches": [
        {
          "id": "kgroup-relink",
          "label": "In-place reversal generalized to k-groups",
          "requiredReasonIds": [
            "reverse-each-group"
          ]
        },
        {
          "id": "copy-to-array",
          "label": "Copy to an array and rebuild",
          "requiredReasonIds": [],
          "rejectionFeedback": "Copying uses O(n) extra space; the in-place k-group relink keeps it O(1)."
        }
      ],
      "reasons": [
        {
          "id": "reverse-each-group",
          "text": "Reverse each full k-node group by relinking, connect groups as you go, and leave an incomplete final group untouched — O(n) time, O(1) space."
        },
        {
          "id": "cannot-generalize",
          "text": "In-place reversal cannot be extended to groups, so a different family is required.",
          "contradictory": true
        },
        {
          "id": "needs-sort",
          "text": "The nodes must be sorted before grouping.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "kgroup-relink"
      ],
      "modelExplanation": "Yes — it is in-place reversal applied per k-group: relink each full group, splice groups together, and leave a short final group as-is. Still O(n) time, O(1) space."
    }
  },
  {
    "id": "pat-iplr-fix-1",
    "kind": "fix-mistake",
    "prompt": "`reverse(head)` reverses a linked list in place and returns the new head. This returns the wrong node. Fix the return.",
    "starterCode": "def reverse(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return head",
    "expected": "def reverse(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev",
    "hints": [
      "Goal: reverse(head) = the head of the reversed list.",
      "The loop flips each node's next pointer, advancing prev and curr.",
      "Key property: after the loop, the ORIGINAL head is the tail; prev is the new head.",
      "Approach: return prev, the last node that became the front.",
      "Pseudocode: while curr: nxt=curr.next; curr.next=prev; prev=curr; curr=nxt; return prev.",
      "Fix: return prev (not head)."
    ],
    "tests": "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val; self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\ndef to_list(h):\n    out = []\n    while h: out.append(h.val); h = h.next\n    return out\nassert to_list(reverse(build([1,2,3,4,5]))) == [5,4,3,2,1]\nassert to_list(reverse(build([1]))) == [1]\nassert reverse(None) is None\nassert to_list(reverse(build([1,2]))) == [2,1]\nprint('OK')"
  }
],

  references: [
  {
    "url": "https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1252/lectures/21-lists2/slides",
    "title": "Stanford CS106B: More on Linked Lists",
    "section": "Slides 4–9: retained node references; head/tail updates; save successor before mutation; doubly linked nodes",
    "topic": "in-place-linkedlist-reversal",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Saving suffix references supports in-place link changes."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source is C++ with address labels and nullptr. App uses Python object identities, None, next and prev; it does not perform C++ delete."
    ]
  },
  {
    "url": "https://opendatastructures.org/ods-python/3_2_DLList_Doubly_Linked_Li.html",
    "title": "Open Data Structures: DLList",
    "section": "3.2 dummy sentinel; insertion and removal",
    "topic": "in-place-linkedlist-reversal",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "A dummy makes front-boundary updates uniform."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source uses a circular doubly linked dummy sentinel. The app also shows null-terminated doubly lists and a circular singly list; these are different representations."
    ]
  },
  {
    "url": "https://docs.python.org/3.14/builtins/stdtypes.html",
    "title": "Python 3.14: Built-in types",
    "section": "Identity, equality, numeric types; floor division and float conversion",
    "topic": "in-place-linkedlist-reversal",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Node-value association differs from object identity."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Python object identity is compared with is. Equality can be customized by __eq__, so equal node values do not imply identical nodes. Relinking retains each node and its associated value."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "b8cd8ab8a3d4253e",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
