/**
 * Lesson: Linked lists — merging two sorted lists (dummy-head splice).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "[1, 2, 3, 4, 5, 6]\n".
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

# Merge two sorted lists into one sorted list by splicing existing nodes.
def merge(a, b):
    dummy = Node(0)          # a stand-in head so we never special-case the first node
    tail = dummy             # tail always points at the last node of the result
    while a is not None and b is not None:
        if a.val <= b.val:   # pick the smaller front node
            tail.next = a
            a = a.next
        else:
            tail.next = b
            b = b.next
        tail = tail.next     # extend the result by one node
    tail.next = a if a is not None else b  # attach whatever remains
    return dummy.next        # the real head is after the dummy

m = merge(build([1, 3, 5]), build([2, 4, 6]))
print(to_list(m))`;

export const linkedListMerging: LessonDefinition = {
  id: "linked-list-merging",
  title: "Linked Lists: Merging Sorted Lists",
  area: "Linear structures",
  prerequisites: [
  "linked-list-traversal",
  "linked-list-dummy-nodes"
],

  explanation: "**Merging** two already-sorted linked lists produces one sorted list. It is the \"combine\" step of merge sort, and on linked lists it is especially clean because you never shift elements — you just **relink existing nodes** in the right order.\n\nWalk both lists with pointers `a` and `b`. Repeatedly compare their front nodes and **splice the smaller one** onto the result, then advance that list. A **dummy head** node removes an annoying special case: without it, the very first node needs different handling than the rest. With the dummy, `tail` always points at the last node of the growing result, so appending is uniform, and the real answer is `dummy.next`. When one list runs out, the other is already sorted, so you **attach the remainder in one link** rather than copying it node by node.\n\nUsing `<=` (not `<`) keeps the merge **stable**: equal values keep their original relative order (nodes from `a` come before equal nodes from `b`). Merging is **O(n + m)** time — each node of both lists is touched once — and **O(1)** extra space, because we reuse the input nodes rather than allocating new ones. In the example, [1,3,5] and [2,4,6] merge to [1,2,3,4,5,6].\n\nThe inputs must be sorted, acyclic, and disjoint: no node may belong to both lists. Shared nodes can be rewired into a cycle. Equal values are allowed; <= chooses the left list first, preserving each input order.",

  vocabulary: [
  {
    "term": "Merge",
    "definition": "Combining two sorted sequences into one sorted sequence."
  },
  {
    "term": "Dummy head",
    "definition": "A throwaway node before the real first node so appending needs no special case."
  },
  {
    "term": "tail pointer",
    "definition": "A pointer to the last node of the result so far, where the next node is attached."
  },
  {
    "term": "Splice",
    "definition": "Relinking an existing node into a new position by changing next references."
  },
  {
    "term": "Stable merge",
    "definition": "Preserving the original relative order of equal elements (achieved with <=)."
  }
],

  concepts: {
  "purpose": "Combine two sorted lists into one sorted list in linear time without allocating new nodes; the merge step of linked-list merge sort.",
  "operations": "Compare fronts, splice the smaller onto tail, advance that list and tail; attach the leftover list at the end.",
  "uses": "Merge sort on linked lists, merging k sorted lists (pairwise or with a heap), combining sorted streams.",
  "tradeoffs": "O(1) space by reusing nodes; the dummy head simplifies the code. Requires both inputs to already be sorted.",
  "commonMistakes": "Forgetting to attach the remaining list (drops the tail); allocating new nodes instead of splicing (wastes O(n+m) space); using `<` and losing stability for equal keys; returning dummy instead of dummy.next.",
  "edgeCases": "Either list empty: the loop is skipped and the other list is attached whole. Equal fronts: <= takes from `a` first. Both empty: returns None."
},

  complexity: [
  {
    "operation": "Merge two sorted lists",
    "best": "O(1)",
    "average": "O(n + m)",
    "worst": "O(n + m)",
    "space": "O(1)",
    "note": "At most n+m nodes examined; an empty side attaches the other in O(1)."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of nodes in list a"
    },
    {
      "symbol": "m",
      "meaning": "the number of nodes in list b"
    }
  ],
  "costModel": "Comparing two node values and relinking a `next` reference are O(1). Each loop iteration consumes one node from a or b.",
  "time": {
    "bound": "O(n + m)",
    "case": "worst",
    "explanation": "Compare current heads while both lists remain. Each iteration advances one input, so at most n+m values are selected; the remaining suffix is attached with one link, not copied or traversed. Worst-case time is O(n+m); an empty side makes the call O(1).",
    "otherCases": [
      {
        "case": "best",
        "bound": "O(1)",
        "note": "If either input is empty, attach the other without traversing it."
      }
    ]
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Only the dummy node and the pointers dummy, tail, a, b are used. The result reuses the input nodes, so no storage grows with n + m.",
    "inputOutputNote": "The two input lists (n + m nodes) already exist; the merged list is those same nodes relinked, so it isn't extra space. The bound covers the named algorithm; demonstration construction and collected print output are separate allocations."
  },
  "derivation": [
    {
      "lines": [
        21,
        22
      ],
      "description": "Create the dummy and tail pointer — constant work once.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30
      ],
      "description": "Loop runs at most n + m times; each iteration splices one node (constant work).",
      "cost": "O(n + m)",
      "dimension": "time"
    },
    {
      "lines": [
        31
      ],
      "description": "Attach the leftover list with one pointer assignment.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        21
      ],
      "description": "One dummy node plus a fixed set of pointers.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Both input lists are already sorted ascending.",
    "Relinking `next` and comparing values are O(1).",
    "Using <= keeps the merge stable (a's equal nodes precede b's).",
    "Input lists are sorted, acyclic, and node-disjoint."
  ],
  "tradeoffs": "Building a new list by copying values would also be O(n+m) time but O(n+m) space; splicing reuses nodes for O(1) space. Array merging is comparable in time but must allocate the output array.",
  "counters": [
    {
      "label": "nodes spliced",
      "definition": "executions of the tail-advance line (line 30)",
      "countLines": [
        30
      ]
    },
    {
      "label": "comparisons",
      "definition": "executions of the comparison (line 24)",
      "countLines": [
        24
      ]
    }
  ],
  "fixedDataNote": "The sample loop splices five chosen nodes, then attaches the final remainder with one link. Six nodes appear in the result."
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
    "explanation": "Helper to build a list from a Python list of values."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Start empty."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Prepend values in reverse so the order is preserved."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Create each node pointing at the current head."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Return the built head."
  },
  {
    "line": 11,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Helper to convert a list to a Python list for printing."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Start with an empty output."
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
    "explanation": "Comment: merge by splicing nodes."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Define merge(a, b)."
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "Create a dummy head so the first append needs no special case."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "tail tracks the last node of the result; start it at the dummy."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "Loop while both lists still have nodes."
  },
  {
    "line": 24,
    "executable": true,
    "explanation": "Compare the front values; <= keeps the merge stable."
  },
  {
    "line": 25,
    "executable": true,
    "explanation": "Attach a's front to the result."
  },
  {
    "line": 26,
    "executable": true,
    "explanation": "Advance a."
  },
  {
    "line": 27,
    "executable": false,
    "explanation": "Otherwise b's front is smaller."
  },
  {
    "line": 28,
    "executable": true,
    "explanation": "Attach b's front to the result."
  },
  {
    "line": 29,
    "executable": true,
    "explanation": "Advance b."
  },
  {
    "line": 30,
    "executable": true,
    "explanation": "Move tail to the node just attached."
  },
  {
    "line": 31,
    "executable": true,
    "explanation": "One list is empty; attach the entire remaining list in one link."
  },
  {
    "line": 32,
    "executable": true,
    "explanation": "Return dummy.next, the real merged head."
  },
  {
    "line": 33,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 34,
    "executable": true,
    "explanation": "Merge [1,3,5] and [2,4,6]."
  },
  {
    "line": 35,
    "executable": true,
    "explanation": "Print the merged result [1, 2, 3, 4, 5, 6]."
  }
],

  bindings: [
  {
    "variable": "dummy",
    "model": "linked-list",
    "overlays": [
      {
        "role": "pointer",
        "label": "tail",
        "source": "tail"
      }
    ]
  },
  {
    "variable": "a",
    "model": "linked-list"
  },
  {
    "variable": "b",
    "model": "linked-list"
  },
  {
    "variable": "m",
    "model": "linked-list"
  }
],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "What does the dummy head buy us here that a plain `head = None` would not?",
    "answer": "It removes the special case for attaching the very first node: tail = dummy is always valid, so `tail.next = ...` works uniformly, and the answer is dummy.next.",
    "explanation": "Without the dummy you'd need an `if result is None` branch to set the head on the first append. The dummy makes every append identical."
  }
],

  experiments: [
  "Merge a list with an empty list and confirm the non-empty one is attached whole.",
  "Change <= to < and construct inputs with equal keys to see stability change.",
  "Extend to merge three lists by merging two, then merging the result with the third."
],

  exercises: [
  {
    "id": "llm-complete-1",
    "kind": "complete-code",
    "prompt": "Complete `merge(a, b)` so it merges two sorted linked lists into one sorted list and returns its head. Each pass must splice the smaller front node (ties keep the left node first), then attach whatever list is left over. Inputs are sorted, acyclic and node-disjoint.",
    "starterCode": "def merge(a, b):\n    dummy = Node(0)\n    tail = dummy\n    while a is not None and b is not None:\n        if a.val <= b.val:\n            # TODO: attach a, advance a\n            pass\n        else:\n            # TODO: attach b, advance b\n            pass\n        tail = tail.next\n    tail.next = a if a is not None else b\n    return dummy.next",
    "expected": "def merge(a, b):\n    dummy = Node(0)\n    tail = dummy\n    while a is not None and b is not None:\n        if a.val <= b.val:\n            tail.next = a\n            a = a.next\n        else:\n            tail.next = b\n            b = b.next\n        tail = tail.next\n    tail.next = a if a is not None else b\n    return dummy.next",
    "hints": [
      "Goal: merge two sorted lists by splicing the smaller front node onto the tail each step.",
      "Rebuilding a new list with copied values would waste memory; instead reuse the existing nodes by relinking.",
      "Key insight: the next node of the merged list is always the smaller of the two current fronts.",
      "Approach: at each step compare a.val and b.val, attach the smaller via tail.next, then advance that list.",
      "Pseudocode: while both non-empty: if a.val<=b.val attach a and advance a else attach b and advance b; then move tail forward.",
      "Write `tail.next = a; a = a.next` (and the symmetric `tail.next = b; b = b.next`) before advancing tail."
    ],
    "tests": "class Node:\n    def __init__(self, val, nxt=None, src=None):\n        self.val = val\n        self.next = nxt\n        self.src = src\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\ndef to_list(h):\n    out = []\n    while h is not None:\n        out.append(h.val)\n        h = h.next\n    return out\nassert to_list(merge(build([1, 3, 5]), build([2, 4, 6]))) == [1, 2, 3, 4, 5, 6], 'interleaved merge'\n# Leftover tail must be attached: one list far longer than the other.\nassert to_list(merge(build([1]), build([2, 3, 4, 5]))) == [1, 2, 3, 4, 5], 'longer list tail kept'\nassert to_list(merge(None, build([1, 2]))) == [1, 2], 'empty left'\nassert to_list(merge(build([1, 2]), None)) == [1, 2], 'empty right'\nassert to_list(merge(None, None)) == [], 'both empty'\n# Stability: on a tie the LEFT node (needs <=) comes first.\nla = Node(1, None, 'L')\nlb = Node(1, None, 'R')\nmerged = merge(la, lb)\nassert merged is not None and merged.val == 1, 'a node must be spliced'\nassert merged.src == 'L', f'on a tie the left node comes first (needs <=), got {merged.src!r}'\nprint('OK')"
  },
  {
    "id": "llm-fix-1",
    "kind": "fix-mistake",
    "prompt": "`merge(a, b)` merges two sorted linked lists and returns the merged head. This drops the tail of whichever list is longer. Attach the leftover list. Inputs are sorted, acyclic and node-disjoint.",
    "starterCode": "def merge(a, b):\n    dummy = Node(0)\n    tail = dummy\n    while a is not None and b is not None:\n        if a.val <= b.val:\n            tail.next = a; a = a.next\n        else:\n            tail.next = b; b = b.next\n        tail = tail.next\n    # TODO: attach whichever list still has nodes\n    return dummy.next",
    "expected": "def merge(a, b):\n    dummy = Node(0)\n    tail = dummy\n    while a is not None and b is not None:\n        if a.val <= b.val:\n            tail.next = a; a = a.next\n        else:\n            tail.next = b; b = b.next\n        tail = tail.next\n    tail.next = a if a is not None else b\n    return dummy.next",
    "hints": [
      "Goal: merge(a,b) returns one sorted list from two sorted lists.",
      "The repeated work is comparing fronts; splice the smaller each step with a dummy+tail.",
      "Key property: when the while loop ends, ONE list may still have (already-sorted) nodes.",
      "Approach: after the loop, attach whichever list is non-empty to the tail.",
      "Pseudocode: while a and b: splice smaller; then tail.next = a if a else b; return dummy.next.",
      "Fix: add `tail.next = a if a is not None else b` after the loop."
    ],
    "tests": "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val; self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\ndef to_list(h):\n    out = []\n    while h: out.append(h.val); h = h.next\n    return out\nassert to_list(merge(build([1,3,5]), build([2,4,6]))) == [1,2,3,4,5,6]\n# leftover tail must be attached: second list much longer\nassert to_list(merge(build([1]), build([2,3,4,5]))) == [1,2,3,4,5], 'longer list tail must be kept'\nassert to_list(merge(None, build([1,2]))) == [1,2]\nassert to_list(merge(build([1,2]), None)) == [1,2]\nassert to_list(merge(None, None)) == []\n# Stability (distinguishes <= from <): on equal vals take the LEFT node first.\nla, lb = Node(1), Node(1)\nla.src = 'L'; lb.src = 'R'\nmerged = merge(la, lb)\nassert getattr(merged, 'src', None) == 'L', 'on a tie the left node comes first (needs <=)'\nprint('OK')"
  },
  {
    "id": "llm-predict-1",
    "kind": "predict-state",
    "prompt": "Merging [1,3,5] and [2,4,6], how many loop iterations run before one list empties, and what remains to be attached?",
    "expected": "5 iterations; after picking 1,2,3,4,5 the list a is empty and node 6 (from b) is attached by the final link.",
    "hints": [
      "Each iteration consumes one node.",
      "The loop stops when a or b is None.",
      "After 5 picks, a is empty and 6 remains in b."
    ]
  }
],

  review: "**Merging** two sorted lists relinks existing nodes into one sorted list. A **dummy head** makes every append uniform (`tail` tracks the end), so the answer is `dummy.next`. Compare fronts, splice the smaller with `<=` for **stability**, then attach the leftover list in **one link**. It is **O(n + m)** time and **O(1)** space by reusing nodes. Don't forget the remainder attach, and return `dummy.next` (not `dummy`).",

  expectedOutput: "[1, 2, 3, 4, 5, 6]\n",

  references: [
  {
    "url": "https://opendatastructures.org/ods-python/3_1_SLList_Singly_Linked_Li.html",
    "title": "Open Data Structures: SLList",
    "section": "3.1 stack and queue operations; Figure 3.1",
    "topic": "linked-list-merging",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Relinking changes references rather than copying values."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source and app use next links and optional head/tail references. Access by index requires traversal; constant-time deletion needs the predecessor."
    ]
  },
  {
    "url": "https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1252/lectures/21-lists2/slides",
    "title": "Stanford CS106B: More on Linked Lists",
    "section": "Slides 4–9: retained node references; head/tail updates; save successor before mutation; doubly linked nodes",
    "topic": "linked-list-merging",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Preserve access to remaining chains when rewiring."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source is C++ with address labels and nullptr. App uses Python object identities, None, next and prev; it does not perform C++ delete."
    ]
  },
  {
    "url": "https://visualgo.net/en/list",
    "title": "VisuAlgo: Linked lists",
    "section": "Linked chain, stack, queue, doubly list and deque visualization modes",
    "topic": "linked-list-merging",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Show output prefix and both remaining input roots."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Textual mode labels were consulted. Actual changing-link diagram cross-check used Stanford images; no claim of running VisuAlgo animations."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "e6305727a6e75f48",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
