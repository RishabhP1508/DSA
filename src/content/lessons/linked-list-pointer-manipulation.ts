/**
 * Lesson: Linked lists — pointer manipulation (swap adjacent pairs).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "[2, 1, 4, 3]\n[2, 1, 4, 3, 5]\n".
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

# Swap every adjacent pair by rewiring links (no value copying).
def swap_pairs(head):
    dummy = Node(0, head)
    prev = dummy
    while prev.next is not None and prev.next.next is not None:
        first = prev.next          # first node of the pair
        second = first.next        # second node of the pair
        first.next = second.next   # first now points past the pair
        second.next = first        # second points back to first (swap)
        prev.next = second         # link the node before the pair to second
        prev = first               # first is now the tail of the swapped pair
    return dummy.next

print(to_list(swap_pairs(build([1, 2, 3, 4]))))
print(to_list(swap_pairs(build([1, 2, 3, 4, 5]))))`;

export const linkedListPointerManipulation: LessonDefinition = {
  id: "linked-list-pointer-manipulation",
  title: "Linked Lists: Pointer Manipulation",
  area: "Linear structures",
  prerequisites: [
  "linked-list-reversal",
  "linked-list-dummy-nodes"
],

  explanation: "Many linked-list problems are really exercises in **pointer manipulation**: reordering nodes purely by **rewiring `next` references**, without copying or moving values. Swapping every adjacent pair — [1,2,3,4] → [2,1,4,3] — is the classic drill. It forces you to hold several pointers at once and update them in an order that never loses part of the list.\n\nThe safe recipe uses a **dummy head** and, for each pair, three named pointers: `prev` (the node before the pair), `first`, and `second`. The three rewiring lines must run in an order that preserves reachability: first make `first.next = second.next` (so we remember what comes after the pair through `first`), then `second.next = first` (the actual swap), then `prev.next = second` (attach the swapped pair to the front). Finally advance `prev = first`, because after the swap `first` is the **tail** of the pair. The essential dependency is to read the original second.next before overwriting it with second.next = first. Once first and second are saved in locals, attaching prev.next = second earlier is also safe: those locals retain both nodes and the suffix is still reachable through second.next.\n\nThe loop condition `prev.next is not None and prev.next.next is not None` checks that a **full pair** exists; a leftover odd node is simply left in place (that's why [1,2,3,4,5] → [2,1,4,3,5]). Like reversal, this is **O(n)** time and **O(1)** space: each node is rewired once and only a few pointers are kept. The transferable lesson is the discipline — **name every pointer, decide the update order so nothing becomes unreachable, and use a dummy to avoid head edge cases.**",

  vocabulary: [
  {
    "term": "Pointer manipulation",
    "definition": "Reordering nodes by changing next references rather than moving values."
  },
  {
    "term": "Pair swap",
    "definition": "Exchanging two adjacent nodes so their order flips."
  },
  {
    "term": "Rewiring order",
    "definition": "The sequence of next assignments chosen so no node becomes unreachable mid-update."
  },
  {
    "term": "Orphaned node",
    "definition": "A node no longer reachable because a link was overwritten too early."
  },
  {
    "term": "Leftover node",
    "definition": "An unpaired final node (odd length) that stays where it is."
  }
],

  concepts: {
  "purpose": "Practice reordering nodes by link surgery — the core skill behind pair swaps, k-group reversal, reordering, and rotation.",
  "operations": "Per pair: save first/second, set first.next past the pair, second.next = first, prev.next = second, advance prev to first.",
  "uses": "Swap nodes in pairs, reverse in k-groups, reorder a list, rotate a list, odd/even splitting.",
  "tradeoffs": "Rewiring nodes (O(1) space) rather than swapping values keeps each value attached to its original node — important if other references point at the nodes. It is trickier to get right than value swaps.",
  "commonMistakes": "Wrong update order (orphaning the rest of the list); advancing prev to second instead of first; a loop condition that mishandles an odd leftover node; forgetting the dummy and mangling the head.",
  "edgeCases": "Empty or single node: loop never runs, list unchanged. Odd length: the last node is left in place. Two nodes: one swap."
},

  complexity: [
  {
    "operation": "Swap pairs (rewire)",
    "best": "O(n)",
    "average": "O(n)",
    "worst": "O(n)",
    "space": "O(1)",
    "note": "Each node rewired once; a few pointers and one dummy."
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
  "costModel": "Each pointer read and `next` assignment is O(1). Each loop iteration processes one pair with a constant number of assignments.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The loop runs once per pair — about n/2 iterations — and each iteration does a constant number of pointer rewires. Every node is touched a constant number of times, so total time is proportional to n."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Only the dummy node and the pointers prev, first, second are used, independent of n. No structure grows with the list, and no values are copied into new storage.",
    "inputOutputNote": "The list is reordered in place by relinking existing nodes; the result reuses them. The bound covers the named algorithm; demonstration construction and collected print output are separate allocations."
  },
  "derivation": [
    {
      "lines": [
        21,
        22
      ],
      "description": "Create the dummy and prev — constant setup.",
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
        29
      ],
      "description": "Loop runs ~n/2 times; constant rewiring work per pair.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        21
      ],
      "description": "One dummy plus a fixed set of pointers.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Reading and assigning `next` are O(1).",
    "The list is finite and acyclic.",
    "An odd leftover node is left unmoved (not an error)."
  ],
  "tradeoffs": "Swapping node values instead of relinking would also be O(n)/O(1) and simpler, but it changes the node-to-value association — external references to a node would now see a different value. Rewiring preserves identity, which matters for many problems.",
  "counters": [
    {
      "label": "pairs swapped",
      "definition": "executions of the swap line (line 26)",
      "countLines": [
        26
      ]
    },
    {
      "label": "loop iterations",
      "definition": "executions of the loop body (line 24)",
      "countLines": [
        24
      ]
    }
  ],
  "fixedDataNote": "The 4-node list does 2 swaps; the 5-node list does 2 swaps and leaves node 5. The O(n) bound describes how the rewiring work scales with list length."
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
    "explanation": "Comment: swap pairs by rewiring."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Define swap_pairs(head)."
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "Dummy head so the first pair's predecessor is uniform."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "prev starts at the dummy."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "Loop only while a full pair (two nodes) remains ahead of prev."
  },
  {
    "line": 24,
    "executable": true,
    "explanation": "first = the first node of the pair."
  },
  {
    "line": 25,
    "executable": true,
    "explanation": "second = the second node of the pair."
  },
  {
    "line": 26,
    "executable": true,
    "explanation": "Point first past the pair (remember the rest before overwriting)."
  },
  {
    "line": 27,
    "executable": true,
    "explanation": "The swap: second now points back to first."
  },
  {
    "line": 28,
    "executable": true,
    "explanation": "Attach the node before the pair to second (the new front)."
  },
  {
    "line": 29,
    "executable": true,
    "explanation": "Advance prev to first, now the tail of the swapped pair."
  },
  {
    "line": 30,
    "executable": true,
    "explanation": "Return dummy.next, the new head."
  },
  {
    "line": 31,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 32,
    "executable": true,
    "explanation": "Swap pairs of [1,2,3,4] -> [2, 1, 4, 3]."
  },
  {
    "line": 33,
    "executable": true,
    "explanation": "Odd length [1,2,3,4,5] -> [2, 1, 4, 3, 5] (5 left in place)."
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
        "label": "first",
        "source": "first"
      },
      {
        "role": "pointer",
        "label": "second",
        "source": "second"
      }
    ]
  },
  {
    "variable": "first",
    "model": "linked-list"
  },
  {
    "variable": "second",
    "model": "linked-list"
  }
],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "Why must this version read second.next before assigning second.next = first?",
    "answer": "Overwriting second.next first loses the original successor. Reading it afterward obtains first and can create a cycle instead of reconnecting the suffix.",
    "explanation": "The displayed first.next = second.next saves access to the suffix before second.next changes. A separate saved successor would also work. prev.next can be updated earlier after first and second have been saved."
  }
],

  experiments: [
  "Print first, second, and prev each iteration to watch the pointers move pair by pair.",
  "Generalise to reverse the list in groups of k nodes.",
  "Compare rewiring against simply swapping the two nodes' `val` fields, and compare node-to-value associations (the same node objects still exist in either version)."
],

  exercises: [
  {
    "id": "llpm-complete-1",
    "kind": "complete-code",
    "prompt": "Complete `swap_pairs(head)` so it swaps every adjacent pair of nodes and returns the new head. Fill in the three rewiring lines (in the correct order) to swap the current pair.",
    "starterCode": "def swap_pairs(head):\n    dummy = Node(0, head)\n    prev = dummy\n    while prev.next is not None and prev.next.next is not None:\n        first = prev.next\n        second = first.next\n        # TODO: three rewiring lines\n        prev = first\n    return dummy.next",
    "expected": "def swap_pairs(head):\n    dummy = Node(0, head)\n    prev = dummy\n    while prev.next is not None and prev.next.next is not None:\n        first = prev.next\n        second = first.next\n        first.next = second.next\n        second.next = first\n        prev.next = second\n        prev = first\n    return dummy.next",
    "hints": [
      "Goal: swap the current adjacent pair of nodes by rewiring three pointers in the right order.",
      "The tricky cost is losing the node after the pair; if you rewire blindly you drop the rest of the list.",
      "Key insight: you must capture `second.next` before overwriting links, so the tail of the pair still reaches the rest.",
      "Approach: name first and second, then relink so second precedes first and prev points at second.",
      "Pseudocode: first=prev.next; second=first.next; set first.next to second.next; set second.next to first; set prev.next to second.",
      "Write `first.next = second.next; second.next = first; prev.next = second` in that order to swap the pair safely."
    ],
    "tests": "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\ndef to_list(h):\n    out = []\n    while h is not None:\n        out.append(h.val)\n        h = h.next\n    return out\nassert to_list(swap_pairs(build([1, 2, 3, 4]))) == [2, 1, 4, 3], f'adjacent pairs swapped, got {to_list(swap_pairs(build([1,2,3,4])))}'\n# Odd length: the trailing single node stays put.\nassert to_list(swap_pairs(build([1, 2, 3]))) == [2, 1, 3], 'odd tail stays'\nassert to_list(swap_pairs(build([1]))) == [1], 'single node unchanged'\nassert swap_pairs(None) is None, 'empty list'\nassert to_list(swap_pairs(build([1, 2, 3, 4, 5, 6]))) == [2, 1, 4, 3, 6, 5], 'three pairs'\nprint('OK')"
  },
  {
    "id": "llpm-fix-1",
    "kind": "fix-mistake",
    "prompt": "`swap_pairs(head)` swaps every adjacent pair and returns the new head. After swapping, this advances prev to the wrong node, corrupting the next pair. Fix it.",
    "starterCode": "def swap_pairs(head):\n    dummy = Node(0, head)\n    prev = dummy\n    while prev.next is not None and prev.next.next is not None:\n        first = prev.next\n        second = first.next\n        first.next = second.next\n        second.next = first\n        prev.next = second\n        prev = second\n    return dummy.next",
    "expected": "def swap_pairs(head):\n    dummy = Node(0, head)\n    prev = dummy\n    while prev.next is not None and prev.next.next is not None:\n        first = prev.next\n        second = first.next\n        first.next = second.next\n        second.next = first\n        prev.next = second\n        prev = first\n    return dummy.next",
    "hints": [
      "Goal: after swapping a pair, advance prev to the correct node so the next pair isn't corrupted.",
      "The bug advances prev to the wrong node, so the following pair gets rewired from a broken anchor.",
      "Key insight: after the swap, second is the front of the pair and first is its tail.",
      "Approach: set prev to the node that is now last in the swapped pair before continuing.",
      "Pseudocode: complete the three rewiring lines, then set prev to first, the pair's tail.",
      "Fix the advance to `prev = first`, since first is now the back of the swapped pair."
    ],
    "tests": "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\ndef to_list(h):\n    out = []\n    while h is not None:\n        out.append(h.val)\n        h = h.next\n    return out\n# The bug sets prev=second (the new front), skipping a node and corrupting the\n# next pair, so [1,2,3,4] does not become [2,1,4,3].\nassert to_list(swap_pairs(build([1, 2, 3, 4]))) == [2, 1, 4, 3], f'all pairs swapped, got {to_list(swap_pairs(build([1,2,3,4])))}'\nassert to_list(swap_pairs(build([1, 2, 3]))) == [2, 1, 3], 'odd tail stays'\nassert to_list(swap_pairs(build([1, 2]))) == [2, 1], 'single pair'\nassert swap_pairs(None) is None, 'empty list'\nassert to_list(swap_pairs(build([1, 2, 3, 4, 5, 6]))) == [2, 1, 4, 3, 6, 5], 'three pairs'\nprint('OK')"
  },
  {
    "id": "llpm-predict-1",
    "kind": "predict-state",
    "prompt": "For [1,2,3,4,5], how many swaps happen and what is the final list?",
    "expected": "2 swaps; [2, 1, 4, 3, 5]. Node 5 has no partner so it stays in place.",
    "hints": [
      "Pairs are (1,2) and (3,4).",
      "5 is unpaired.",
      "The loop stops when no full pair remains."
    ]
  }
],

  review: "**Pointer manipulation** reorders nodes by rewiring `next` references, not by moving values. Swapping adjacent pairs uses a **dummy head** and three pointers (`prev`, `first`, `second`), with a safe update order — retain the continuation before overwriting its link, swap, reattach front — so no node is orphaned, then advance `prev` to `first`. The loop only proceeds when a **full pair** exists, leaving any odd node in place. It is **O(n)** time and **O(1)** space. The discipline (name pointers, order updates, use a dummy) generalises to k-group reversal and reordering.",

  expectedOutput: "[2, 1, 4, 3]\n[2, 1, 4, 3, 5]\n",

  references: [
  {
    "url": "https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1252/lectures/21-lists2/slides",
    "title": "Stanford CS106B: More on Linked Lists",
    "section": "Slides 4–9: retained node references; head/tail updates; save successor before mutation; doubly linked nodes",
    "topic": "linked-list-pointer-manipulation",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Saved node references allow safe link rewiring."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source is C++ with address labels and nullptr. App uses Python object identities, None, next and prev; it does not perform C++ delete."
    ]
  },
  {
    "url": "https://docs.python.org/3.14/builtins/stdtypes.html",
    "title": "Python 3.14: Built-in types",
    "section": "Identity, equality, numeric types; floor division and float conversion",
    "topic": "linked-list-pointer-manipulation",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Changing a node value does not change object identity."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Python object identity is compared with is. Equality can be customized by __eq__, so equal node values do not imply identical nodes. Relinking retains each node and its associated value."
    ]
  },
  {
    "url": "https://visualgo.net/en/list",
    "title": "VisuAlgo: Linked lists",
    "section": "Linked chain, stack, queue, doubly list and deque visualization modes",
    "topic": "linked-list-pointer-manipulation",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "During rewiring, locals can retain temporarily detached chains."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Textual mode labels were consulted. Actual changing-link diagram cross-check used Stanford images; no claim of running VisuAlgo animations."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "94d4075cc6df9487",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
