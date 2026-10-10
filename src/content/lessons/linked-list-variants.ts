/**
 * Lesson: Linked lists — variants (singly / doubly / circular).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "[1, 2, 3]\n[3, 2, 1]\n[7, 8, 9, 7, 8, 9]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# A doubly linked node knows BOTH neighbours.
class DNode:
    def __init__(self, val):
        self.val = val
        self.prev = None
        self.next = None

# Build a doubly linked list and return (head, tail).
def build_doubly(values):
    head = tail = None
    for v in values:
        node = DNode(v)
        if head is None:
            head = tail = node        # first node is both head and tail
        else:
            tail.next = node          # link old tail forward
            node.prev = tail          # link new node back
            tail = node               # new node is the tail
    return head, tail

dh, dt = build_doubly([1, 2, 3])
forward = []
n = dh
while n is not None:                  # walk head -> tail using next
    forward.append(n.val)
    n = n.next
print(forward)

backward = []
n = dt
while n is not None:                  # walk tail -> head using prev
    backward.append(n.val)
    n = n.prev
print(backward)

# A circular singly list: the tail's next points back to the head.
def build_circular(values):
    head = None
    for v in reversed(values):
        head = _SNode(v, head)
    if head is None:
        return None
    tail = head
    while tail.next is not None:
        tail = tail.next
    tail.next = head                  # close the ring
    return head

class _SNode:
    def __init__(self, val, nxt=None):
        self.val = val
        self.next = nxt

ring = build_circular([7, 8, 9])
out = []
node = ring
for _ in range(6):                    # two full loops around a 3-node ring
    out.append(node.val)
    node = node.next
print(out)`;

export const linkedListVariants: LessonDefinition = {
  id: "linked-list-variants",
  title: "Linked Lists: Singly, Doubly, Circular",
  area: "Linear structures",
  prerequisites: [
  "linked-list-traversal"
],

  explanation: "The linked lists so far were **singly linked**: each node has one link, `next`, so you can only move forward, and reaching the previous node means restarting from the head. Two common **variants** relax that.\n\nA **doubly linked list** gives every node **two** links, `prev` and `next`. You can walk **both directions** and, given a node, delete it or insert before it in **O(1)** without hunting for its predecessor. The cost is an extra reference per node (more memory) and **two** links to maintain on every insert/delete — get one wrong and the list corrupts. Building one keeps a `tail` pointer so appends are O(1): link `tail.next = node`, `node.prev = tail`, then move `tail`.\n\nA **circular linked list** has no `None` terminator — the **last node's `next` points back to the head**, forming a ring. Circular lists suit round-robin scheduling and buffers where you cycle through elements forever. The catch: a naive `while current is not None` traversal **never stops**, so you must bound the walk another way (a fixed number of steps, or \"stop when you return to the start\"). Circular lists can be singly or doubly linked.\n\nChoosing a variant is a **tradeoff**: singly is leanest; doubly buys backward traversal and O(1) deletion given a node, at the price of memory and bookkeeping; circular buys seamless cycling, at the price of careful termination. In the example the doubly list reads `[1,2,3]` forward and `[3,2,1]` backward, and walking the 3-node ring six steps (two full circuits) yields `[7,8,9,7,8,9]`.\n\nSingly/doubly describes how many directions are linked; circular/non-circular describes the end connection. These are independent choices: the ring in this example is singly linked.",

  vocabulary: [
  {
    "term": "Singly linked list",
    "definition": "Each node has one link (next); forward traversal only."
  },
  {
    "term": "Doubly linked list",
    "definition": "Each node has prev and next; traversal both ways and O(1) delete given a node."
  },
  {
    "term": "Circular linked list",
    "definition": "The last node's next points back to the head, forming a ring with no None end."
  },
  {
    "term": "prev link",
    "definition": "A node's reference to the previous node in a doubly linked list."
  },
  {
    "term": "tail",
    "definition": "The last node; kept as a pointer so appends are O(1)."
  },
  {
    "term": "Round-robin",
    "definition": "Cycling through elements repeatedly, a natural fit for circular lists."
  }
],

  concepts: {
  "purpose": "Pick the linked-list shape that fits the access pattern: forward-only (singly), bidirectional (doubly), or endless cycling (circular).",
  "operations": "Doubly: maintain prev and next on every insert/delete; walk with next or prev. Circular: close the ring with tail.next = head; bound traversal explicitly.",
  "uses": "Doubly: LRU caches, text editors (cursor moves both ways), deques. Circular: round-robin schedulers, ring buffers, turn-taking games.",
  "tradeoffs": "Singly: least memory, forward-only. Doubly: backward traversal + O(1) node deletion, but one extra pointer per node and more links to keep consistent. Circular: seamless cycling, but termination must be handled by hand.",
  "commonMistakes": "Updating only one of prev/next in a doubly list (corruption); an unbounded `while node is not None` on a circular list (infinite loop); forgetting to set the first node as both head and tail.",
  "edgeCases": "Empty list: head and tail are None. Single node: in a circular list its next points to itself. Deleting the only node must reset both head and tail."
},

  complexity: [
  {
    "operation": "Doubly: append with tail",
    "best": "O(1)",
    "average": "O(1)",
    "worst": "O(1)",
    "space": "O(1)",
    "note": "Two links updated; tail kept."
  },
  {
    "operation": "Doubly: delete given a node",
    "best": "O(1)",
    "average": "O(1)",
    "worst": "O(1)",
    "space": "O(1)",
    "note": "Splice via node.prev and node.next."
  },
  {
    "operation": "Traverse (any variant)",
    "best": "O(n)",
    "average": "O(n)",
    "worst": "O(n)",
    "space": "O(1)",
    "note": "Visit each node once."
  }
],

  complexityExplanation: {
  "scope": "program",
  "variables": [
    {
      "symbol": "n",
      "meaning": "total number of input values in the lists being built; the ring demonstration takes six fixed steps"
    }
  ],
  "costModel": "Reading or assigning a `prev`/`next` reference is O(1). Building visits each input value once; traversal visits each node once.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "build_doubly processes each of the n values once with constant work (a couple of link assignments), so building is O(n). Each traversal (forward via next, backward via prev, or n steps around the ring) also visits nodes a constant number of times, giving O(n)."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The whole demonstration allocates n linked nodes and collects O(n) forward/backward values. The circular walk collects six values. Builder cursor bookkeeping alone is O(1), but the program allocations are O(n).",
    "inputOutputNote": "A doubly linked node stores one extra reference (prev) versus a singly linked node — an O(1) per-node constant that does not change the O(n) total structure size."
  },
  "derivation": [
    {
      "lines": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18
      ],
      "description": "build_doubly loops over n values, constant link work each.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        23,
        24,
        25,
        26
      ],
      "description": "Forward traversal visits all n nodes via next.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        31,
        32,
        33,
        34
      ],
      "description": "Backward traversal visits all n nodes via prev.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        10
      ],
      "description": "Only head, tail, and a cursor are kept during building.",
      "cost": "O(1)",
      "dimension": "space"
    },
    {
      "lines": [
        12,
        25,
        32,
        40
      ],
      "description": "Construct nodes and collect traversal output; allocations grow with n.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Reference reads/writes are O(1).",
    "The circular walk is bounded by a fixed step count (here 6) so it terminates.",
    "A doubly linked node's extra prev reference is a constant per node."
  ],
  "tradeoffs": "A doubly linked list enables O(1) deletion given a node and backward traversal that a singly linked list cannot; the price is extra memory per node and maintaining two links. A circular list removes the None end for cycling but requires explicit termination.",
  "counters": [
    {
      "label": "nodes built",
      "definition": "executions of the build loop body (line 12)",
      "countLines": [
        12
      ]
    },
    {
      "label": "forward steps",
      "definition": "executions of the forward-walk body (line 25)",
      "countLines": [
        25
      ]
    }
  ],
  "fixedDataNote": "The example builds a 3-node doubly list and walks a 3-node ring six steps (two full circuits). The O(n) bounds describe how building and traversal scale with the number of nodes."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: doubly linked node has both neighbours."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define the doubly linked node class DNode."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Constructor takes a value."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Store the value."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "prev starts as None (no previous node yet)."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "next starts as None (no next node yet)."
  },
  {
    "line": 7,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 8,
    "executable": false,
    "explanation": "Comment: build a doubly linked list."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Define build_doubly(values)."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "head and tail both start empty."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Loop over the input values in order."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Create a node for this value."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "If the list is empty..."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "...the first node is both head and tail."
  },
  {
    "line": 15,
    "executable": false,
    "explanation": "Otherwise append at the tail."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "Link the old tail forward to the new node."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Link the new node back to the old tail."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "The new node becomes the tail."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "Return both ends."
  },
  {
    "line": 20,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "Build the doubly list [1,2,3]; capture head and tail."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "Prepare to collect the forward order."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "Start at the head."
  },
  {
    "line": 24,
    "executable": true,
    "explanation": "Walk forward via next until the end."
  },
  {
    "line": 25,
    "executable": true,
    "explanation": "Collect each value."
  },
  {
    "line": 26,
    "executable": true,
    "explanation": "Advance with next."
  },
  {
    "line": 27,
    "executable": true,
    "explanation": "Print the forward order [1, 2, 3]."
  },
  {
    "line": 28,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 29,
    "executable": true,
    "explanation": "Prepare to collect the backward order."
  },
  {
    "line": 30,
    "executable": true,
    "explanation": "Start at the tail."
  },
  {
    "line": 31,
    "executable": true,
    "explanation": "Walk backward via prev until the start."
  },
  {
    "line": 32,
    "executable": true,
    "explanation": "Collect each value."
  },
  {
    "line": 33,
    "executable": true,
    "explanation": "Advance with prev."
  },
  {
    "line": 34,
    "executable": true,
    "explanation": "Print the backward order [3, 2, 1]."
  },
  {
    "line": 35,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 36,
    "executable": false,
    "explanation": "Comment: circular singly list."
  },
  {
    "line": 37,
    "executable": true,
    "explanation": "Define build_circular(values)."
  },
  {
    "line": 38,
    "executable": true,
    "explanation": "Start empty."
  },
  {
    "line": 39,
    "executable": true,
    "explanation": "Prepend values in reverse to keep order."
  },
  {
    "line": 40,
    "executable": true,
    "explanation": "Create each singly linked node in front."
  },
  {
    "line": 41,
    "executable": true,
    "explanation": "An empty input has no tail to search for."
  },
  {
    "line": 42,
    "executable": true,
    "explanation": "Return None for an empty circular list."
  },
  {
    "line": 43,
    "executable": true,
    "explanation": "Find the tail."
  },
  {
    "line": 44,
    "executable": true,
    "explanation": "Walk to the last node..."
  },
  {
    "line": 45,
    "executable": true,
    "explanation": "...advancing until next is None."
  },
  {
    "line": 46,
    "executable": true,
    "explanation": "Close the ring: tail.next points back to head."
  },
  {
    "line": 47,
    "executable": true,
    "explanation": "Return the head of the ring."
  },
  {
    "line": 48,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 49,
    "executable": true,
    "explanation": "Define the singly node helper class _SNode."
  },
  {
    "line": 50,
    "executable": true,
    "explanation": "Constructor with value and optional next."
  },
  {
    "line": 51,
    "executable": true,
    "explanation": "Store the value."
  },
  {
    "line": 52,
    "executable": true,
    "explanation": "Store the next reference."
  },
  {
    "line": 53,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 54,
    "executable": true,
    "explanation": "Build the ring [7,8,9]."
  },
  {
    "line": 55,
    "executable": true,
    "explanation": "Prepare to collect walked values."
  },
  {
    "line": 56,
    "executable": true,
    "explanation": "Start at the ring head."
  },
  {
    "line": 57,
    "executable": true,
    "explanation": "Take exactly 6 steps (two full loops) — a bounded walk."
  },
  {
    "line": 58,
    "executable": true,
    "explanation": "Collect the current value."
  },
  {
    "line": 59,
    "executable": true,
    "explanation": "Advance; note next never becomes None in a ring."
  },
  {
    "line": 60,
    "executable": true,
    "explanation": "Print [7, 8, 9, 7, 8, 9]."
  }
],

  bindings: [
  {
    "variable": "head",
    "model": "linked-list",
    "overlays": [
      {
        "role": "pointer",
        "label": "tail",
        "source": "tail"
      },
      {
        "role": "pointer",
        "label": "node",
        "source": "node"
      }
    ]
  },
  {
    "variable": "node",
    "model": "linked-list"
  },
  {
    "variable": "dh",
    "model": "linked-list",
    "overlays": [
      {
        "role": "pointer",
        "label": "n",
        "source": "n"
      }
    ]
  },
  {
    "variable": "ring",
    "model": "linked-list",
    "overlays": [
      {
        "role": "pointer",
        "label": "node",
        "source": "node"
      }
    ]
  }
],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "Why would `while node is not None` never stop on the circular ring, and how does the example avoid that?",
    "answer": "In a ring, no node's next is None — the tail points back to the head — so the condition is always true. The example instead takes a fixed number of steps (a for-loop of 6), bounding the walk.",
    "explanation": "Circular lists have no None terminator, so termination must come from elsewhere: a step count, or detecting a return to the starting node."
  }
],

  experiments: [
  "Insert a node in the middle of the doubly list and update all four affected links.",
  "Delete the tail of the doubly list and fix both head/tail and the prev/next links.",
  "Change the circular walk to stop when it returns to the starting node instead of counting steps."
],

  exercises: [
  {
    "id": "llv-complete-1",
    "kind": "complete-code",
    "prompt": "Complete `append(tail, node)` for a doubly linked list: attach `node` after `tail` (or start the list if tail is None) by setting BOTH links, then return the new tail.  Assume node is fresh and detached (prev=next=None), and tail is the real last node when present.",
    "starterCode": "def append(tail, node):\n    if tail is None:\n        return node\n    # TODO: link old tail and new node both ways, then return the new tail\n    return tail",
    "expected": "def append(tail, node):\n    if tail is None:\n        return node\n    tail.next = node\n    node.prev = tail\n    return node",
    "hints": [
      "Understand: append returns the new tail reference.",
      "Use a fresh detached node; an existing tail must have next=None.",
      "Both forward and backward links must agree.",
      "If tail is None, return node. Otherwise link both neighbours.",
      "Pseudocode: tail.next=node; node.prev=tail; return node.",
      "Solution: return the fresh node after attaching both links; the caller must also keep/update head for an initially empty list."
    ],
    "tests": "class Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n        self.prev = None\n# Append node 2 after tail node 1: both links must be set and the tail advances.\nt1 = Node(1)\nn2 = Node(2)\ntail = append(t1, n2)\nassert tail.val == 2, f'tail advanced to the new node, got {tail.val}'\nassert tail.prev is not None and tail.prev.val == 1, f'new node links back to old tail, got {tail.prev}'\nassert tail.prev.next is tail, 'old tail links forward to the new node'\n# Appending to an empty list: the node becomes the tail.\nn5 = Node(5)\nt = append(None, n5)\nassert t is n5 and t.prev is None, 'empty append -> node is the sole tail'\n# A second append chains correctly.\nn3 = Node(3)\ntail2 = append(tail, n3)\nassert tail2.val == 3 and tail2.prev.val == 2 and tail2.prev.next is tail2, 'chained append links both ways'\nprint('OK')"
  },
  {
    "id": "llv-choose-1",
    "kind": "choose-approach",
    "prompt": "For each need pick singly, doubly, or circular: (a) a browser history with back/forward, (b) a fixed-size ring buffer that overwrites oldest, (c) a memory-tight forward-only queue. Circular can also be singly or doubly linked; select the useful property for each scenario.",
    "expected": "(a) doubly — move both directions and delete given a node in O(1). (b) circular — cycle through slots with no None end. (c) singly — least memory, forward-only is enough.",
    "hints": [
      "Goal: match a list variant to each need — (a) browser history with back/forward, (b) fixed-size ring buffer overwriting oldest, (c) memory-tight forward-only queue.",
      "The error is one variant for all; each need stresses a different capability (bidirectional moves, wraparound, or minimal memory).",
      "Key property: back/forward needs two-way links, a ring buffer needs no terminal end, and a forward-only queue needs only forward links.",
      "Approach: assign doubly to (a), circular to (b), singly to (c).",
      "Reasoning: doubly lets you move both directions and delete a known node in O(1); circular cycles through fixed slots with no None end; singly uses the least memory for a forward-only traversal.",
      "Answer: (a) doubly (both directions, O(1) delete); (b) circular (cycle slots, no None end); (c) singly (least memory, forward-only suffices)."
    ],
    "recognition": {
      "scenario": "Match a list variant to each need: (a) browser history with back/forward, (b) a fixed-size ring buffer overwriting the oldest, (c) a memory-tight forward-only queue.",
      "approaches": [
        {
          "id": "doubly-circular-singly",
          "label": "Doubly for (a), circular for (b), singly for (c)",
          "requiredReasonIds": [
            "variant-matches-need"
          ]
        },
        {
          "id": "singly-everywhere",
          "label": "Use a singly linked list for all three",
          "requiredReasonIds": [],
          "rejectionFeedback": "A singly linked structure has no direct backward link; finding a predecessor requires a forward search. It can be circular: wrap-around is an independent choice, not something singly linking prevents."
        }
      ],
      "reasons": [
        {
          "id": "variant-matches-need",
          "text": "A doubly list moves both directions and deletes a known node in O(1) (history); a circular list wraps with no None end (ring buffer); a singly list is the leanest for forward-only traversal (queue)."
        },
        {
          "id": "singly-does-all",
          "text": "A singly linked list gives direct O(1) movement to both predecessor and successor.",
          "contradictory": true
        },
        {
          "id": "circular-cant-wrap",
          "text": "A circular list cannot cycle back to the start, so it is unsuited to a ring buffer.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "doubly-circular-singly"
      ],
      "modelExplanation": "(a) doubly — move both directions and delete given a node in O(1). (b) circular — cycle through slots with no None end. (c) singly — least memory, forward-only is enough. Circular can also be singly or doubly linked."
    }
  },
  {
    "id": "llv-predict-1",
    "kind": "predict-state",
    "prompt": "Walking backward from the tail of the doubly list [1,2,3], what is collected, and what stops the walk?",
    "expected": "[3, 2, 1]; the walk stops when prev becomes None at the head.",
    "hints": [
      "Start at the tail (3).",
      "Follow prev each step.",
      "The head's prev is None, ending the loop."
    ]
  }
],

  review: "Linked lists come in variants. **Singly** (one `next`) is leanest but forward-only. **Doubly** (`prev` and `next`) allows **backward traversal** and **O(1) deletion given a node**, costing an extra pointer per node and two links to maintain. **Circular** links the tail's `next` back to the head for **endless cycling** (round-robin, ring buffers), but a `while node is not None` loop never ends — you must **bound** the walk. Pick the variant by access pattern and memory budget. The example reads `[1,2,3]`/`[3,2,1]` and cycles a ring to `[7,8,9,7,8,9]`.",

  expectedOutput: "[1, 2, 3]\n[3, 2, 1]\n[7, 8, 9, 7, 8, 9]\n",

  references: [
  {
    "url": "https://opendatastructures.org/ods-python/3_1_SLList_Singly_Linked_Li.html",
    "title": "Open Data Structures: SLList",
    "section": "3.1 stack and queue operations; Figure 3.1",
    "topic": "linked-list-variants",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Singly linked tail deletion requires predecessor search."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source and app use next links and optional head/tail references. Access by index requires traversal; constant-time deletion needs the predecessor."
    ]
  },
  {
    "url": "https://opendatastructures.org/ods-python/3_2_DLList_Doubly_Linked_Li.html",
    "title": "Open Data Structures: DLList",
    "section": "3.2 dummy sentinel; insertion and removal",
    "topic": "linked-list-variants",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Doubly linked nodes have prev/next; circular dummy structures need bounded traversal."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source uses a circular doubly linked dummy sentinel. The app also shows null-terminated doubly lists and a circular singly list; these are different representations."
    ]
  },
  {
    "url": "https://visualgo.net/en/list",
    "title": "VisuAlgo: Linked lists",
    "section": "Linked chain, stack, queue, doubly list and deque visualization modes",
    "topic": "linked-list-variants",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Render both directions and repeated-node cycle edges."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Textual mode labels were consulted. Actual changing-link diagram cross-check used Stanford images; no claim of running VisuAlgo animations."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "693bb9bc61dbd682",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
