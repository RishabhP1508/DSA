/**
 * Lesson: Linked lists — traversal (Linear structures / Linked lists).
 *
 * Researched against the sources in `references` and verified by executing the
 * program on CPython 3.14 (matching the bundled Pyodide 3.14.2). Output is
 * exactly "1\n2\n3\n". Demonstrates the linked-list visualizer (nodes + next
 * arrows + a `current` pointer overlay).
 */

import type { LessonDefinition } from "../../core/types";

const code = `# A node holds a value and a reference to the next node.
class Node:
    def __init__(self, val, nxt=None):
        self.val = val
        self.next = nxt

# Build the list 1 -> 2 -> 3. The last node's next is None.
head = Node(1, Node(2, Node(3)))

# Traverse: start at the head and follow next until we fall off the end.
current = head
while current is not None:
    print(current.val)
    current = current.next`;

export const linkedListTraversal: LessonDefinition = {
  id: "linked-list-traversal",
  title: "Linked Lists: Traversal",
  area: "Linear structures",
  prerequisites: [
  "variables-and-types",
  "classes",
  "references-mutation"
],

  explanation: "A **linked list** is a chain of **nodes**. Each node holds a value and a **reference to the next node**. The first node is the **head**; the last node's `next` is `None`, which marks the end.\n\nThink of a scavenger hunt: each clue (node) tells you where the next clue is. You do not know where clue #5 is until you have followed clues #1 through #4. That is the key difference from a Python list — there is **no random access**. To reach zero-based index k, follow next k times from the head (the one-based kth node needs k-1 links). Access costs O(k+1), including reading the node.\n\n**Traversal** is that walk: start a pointer at the head, do something with the current node, then move the pointer to `current.next`, and stop when the pointer becomes `None`. Because you visit each of the n nodes once, traversal is **O(n)**.",

  vocabulary: [
  {
    "term": "Node",
    "definition": "A single element of a linked list: a value plus a reference to the next node."
  },
  {
    "term": "Head",
    "definition": "The first node of the list; the entry point for any traversal."
  },
  {
    "term": "next",
    "definition": "A node's reference to the following node; None for the last node."
  },
  {
    "term": "Traversal",
    "definition": "Visiting each node in order by following next references from the head."
  },
  {
    "term": "None terminator",
    "definition": "The last node's next is None, signalling the end of the list."
  },
  {
    "term": "Random access",
    "definition": "Jumping directly to index k in O(1). Arrays/Python lists have it; linked lists do not."
  }
],

  concepts: {
  "purpose": "Linked lists store a sequence where you mostly add/remove at the ends or splice nodes, without shifting other elements. Traversal is the foundation for every other linked-list operation (search, reverse, find middle, detect cycles).",
  "operations": "Follow current.next until None. Reading a known node is O(1); accessing zero-based index k costs O(k+1).",
  "uses": "Implementing stacks/queues, adjacency lists, LRU caches, and any structure where cheap splicing matters more than indexed access.",
  "tradeoffs": "Access at zero-based index k follows k links and costs O(k+1). Inserting after a known node is O(1); deleting a known successor needs its predecessor (or updating head for head deletion). Removing a singly linked tail needs a walk to its predecessor.",
  "commonMistakes": "Looping `while current.next is not None` (this skips the last node's work); forgetting to advance `current = current.next` (infinite loop); dereferencing `current.val` after `current` becomes None.",
  "edgeCases": "Empty list (head is None): the loop body never runs. Single node: one iteration then next is None."
},

  complexity: [
  {
    "operation": "Traverse whole list",
    "best": "O(n)",
    "average": "O(n)",
    "worst": "O(n)",
    "space": "O(1)",
    "note": "Visits each of n nodes once; only one pointer is kept."
  },
  {
    "operation": "Access zero-based index k",
    "best": "O(k+1)",
    "average": "O(k+1)",
    "worst": "O(k+1)",
    "note": "Valid 0<=k<n; reaching the last node costs O(n)."
  }
],

  complexityExplanation: {
  "scope": "operation",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of nodes in the linked list"
    }
  ],
  "costModel": "We count each visit to a node as constant work: reading current.val and following current.next are O(1) because a node holds a direct reference to the next node.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The loop runs once per node — n times — and stops when current becomes None. Each iteration does a constant amount of work (print and one pointer move), so the total time grows in direct proportion to the number of nodes. Best, average, and worst are all O(n) because a full traversal always visits every node."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "We keep a single pointer, `current`, no matter how long the list is. No new list or stack is created that grows with n, so the auxiliary space is constant.",
    "inputOutputNote": "The list of n nodes is the input; it already exists and is not counted as auxiliary space. The bound covers the named algorithm; demonstration construction and collected print output are separate allocations."
  },
  "derivation": [
    {
      "lines": [
        11
      ],
      "description": "Set up one pointer at the head — a fixed cost done once.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        12,
        13,
        14
      ],
      "description": "The loop body runs once for each of the n nodes; each run is constant work (check, print, advance).",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        11
      ],
      "description": "Only the single `current` pointer is stored; it does not grow with n.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Following `current.next` is O(1) (a direct reference, not a search).",
    "`print` of one value is treated as constant work.",
    "The list is finite and acyclic, so the loop terminates after n steps.",
    "The traversal is finite and acyclic; construction is outside this operation."
  ],
  "tradeoffs": "A Python list has O(1) indexed access. A linked list supports O(1) insertion after a known node and deletion of a known successor given its predecessor; tail deletion in a singly list needs O(n) predecessor search.",
  "counters": [
    {
      "label": "loop iterations",
      "definition": "Executions of the loop body print on line 13, one per node (guard events also include the final failed check).",
      "countLines": [
        13
      ]
    },
    {
      "label": "nodes printed",
      "definition": "executions of the print line (line 13)",
      "countLines": [
        13
      ]
    }
  ],
  "fixedDataNote": "This example uses a fixed 3-node list, so you will observe 3 iterations. The O(n) bound describes how that count would grow if the list had n nodes instead of 3."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment describing what a node is."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define a Node class. The class statement creates the Node type."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "The constructor runs when we create a node; it receives the value and an optional next node."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Store the value on the node as the attribute `val`."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Store the reference to the next node as `next` (None by default)."
  },
  {
    "line": 6,
    "executable": false,
    "explanation": "Blank line — no runtime effect."
  },
  {
    "line": 7,
    "executable": false,
    "explanation": "Comment: we are about to build the list 1 -> 2 -> 3."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Create three nodes at once. Node(3) has next=None; it is wrapped by Node(2, ...), then Node(1, ...). `head` points at the node holding 1."
  },
  {
    "line": 9,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 10,
    "executable": false,
    "explanation": "Comment describing the traversal."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Start the traversal pointer `current` at the head."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Loop while `current` still refers to a node (not None). This is the standard, correct loop condition."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Do the work for this node — here, print its value."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Advance to the next node. When we advance past the last node, `current` becomes None and the loop ends."
  }
],

  bindings: [
  {
    "variable": "head",
    "model": "linked-list",
    "overlays": [
      {
        "role": "pointer",
        "label": "current",
        "source": "current"
      }
    ]
  }
],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "The loop condition is `while current is not None`. What would go wrong if it were `while current.next is not None` instead?",
    "answer": "The last node (value 3) would never be processed, and it would crash on an empty list because current could be None.",
    "explanation": "`current.next is not None` stops one node early (it never processes the final node) and dereferences `.next` on a possibly-None pointer. `current is not None` is the correct, safe condition."
  }
],

  experiments: [
  "Change the loop to also count nodes, and print the count after the loop.",
  "Start `current` at `head.next` and observe which node is skipped.",
  "Build an empty list (`head = None`) and confirm the loop body never runs."
],

  exercises: [
  {
    "id": "ll-complete-1",
    "kind": "complete-code",
    "prompt": "Complete the traversal so it returns the number of nodes in the list.",
    "starterCode": "def length(head):\n    count = 0\n    current = head\n    while current is not None:\n        # TODO: increment count and advance\n        pass\n    return count",
    "expected": "def length(head):\n    count = 0\n    current = head\n    while current is not None:\n        count += 1\n        current = current.next\n    return count",
    "tests": "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\n\nassert length(None) == 0, 'empty list should be 0'\nassert length(Node(1)) == 1, 'single node should be 1'\nassert length(Node(1, Node(2, Node(3)))) == 3, 'three nodes should be 3'\nprint('OK')",
    "hints": [
      "Goal: count the number of nodes in a singly linked list.",
      "You keep just a counter and a moving pointer, no extra storage.",
      "Key insight: each loop iteration corresponds to exactly one node before the next link.",
      "Approach: walk from head following .next until None, counting steps.",
      "Pseudocode: count=0; current=head; while current: count+=1; current=current.next; return count.",
      "Inside the loop write `count += 1` then `current = current.next`."
    ]
  },
  {
    "id": "ll-fix-1",
    "kind": "fix-mistake",
    "prompt": "`collect(head)` should walk the list and return a list of every node's value in order. This traversal never terminates. Find and fix the bug.",
    "starterCode": "def collect(head):\n    out = []\n    current = head\n    while current is not None:\n        out.append(current.val)\n        # bug: current is never advanced\n    return out",
    "expected": "def collect(head):\n    out = []\n    current = head\n    while current is not None:\n        out.append(current.val)\n        current = current.next\n    return out",
    "hints": [
      "Understand: collect(head) returns a Python list of values; it does not print them.",
      "Repeated work: visit each reachable node once and keep the growing result.",
      "Property: a node with next=None still has a value to collect.",
      "Approach: loop while current is not None.",
      "Pseudocode: append current.val; advance current=current.next; return out after the loop.",
      "Solution: use while current is not None, append its value, advance, and return out. Empty input returns []."
    ],
    "tests": "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\nassert collect(build([1, 2, 3])) == [1, 2, 3], f'values in order, got {collect(build([1, 2, 3]))}'\nassert collect(None) == [], 'empty list collects nothing'\nassert collect(build([7])) == [7], 'single node'\nassert collect(build([5, 4, 3, 2, 1])) == [5, 4, 3, 2, 1], 'longer list in order'\nprint('OK')"
  },
  {
    "id": "ll-predict-1",
    "kind": "predict-state",
    "prompt": "For the list 1 -> 2 -> 3, how many times does the loop body run, and what is `current` right after the loop ends?",
    "expected": "3 times; current is None.",
    "hints": [
      "The body runs once per node.",
      "There are 3 nodes.",
      "After the third node, current = current.next becomes None and the loop stops."
    ]
  }
],

  review: "A linked list is nodes connected by `next` references, ending at `None`. **Traversal** walks from the head with a pointer, processing each node and advancing with `current = current.next`, stopping when `current is None`. It is **O(n)** time and **O(1)** space. The correct loop condition is `while current is not None` — using `current.next` instead stops one node early and can crash on an empty list. Linked lists trade away O(1) indexing for cheap splicing.",

  expectedOutput: "1\n2\n3\n",

  references: [
  {
    "url": "https://opendatastructures.org/ods-python/3_1_SLList_Singly_Linked_Li.html",
    "title": "Open Data Structures: SLList",
    "section": "3.1 stack and queue operations; Figure 3.1",
    "topic": "linked-list-traversal",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Head operations use next links; tail deletion needs its predecessor."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source and app use next links and optional head/tail references. Access by index requires traversal; constant-time deletion needs the predecessor."
    ]
  },
  {
    "url": "https://courses.cis.cornell.edu/courses/cs2110/2026fa/lectures/lec15/",
    "title": "Cornell CS2110: Stacks and queues",
    "section": "LinkedStack; exercises 15.6, 15.7, 15.10; deque interface",
    "topic": "linked-list-traversal",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "LinkedStack uses the head for constant-time push/pop."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source Java LinkedStack removes at the head. App Python nodes retain next links; removing a singly tail still requires finding its predecessor."
    ]
  },
  {
    "url": "https://visualgo.net/en/list",
    "title": "VisuAlgo: Linked lists",
    "section": "Linked chain, stack, queue, doubly list and deque visualization modes",
    "topic": "linked-list-traversal",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Show references and the current cursor separately."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Textual mode labels were consulted. Actual changing-link diagram cross-check used Stanford images; no claim of running VisuAlgo animations."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "307bd234a6470b5f",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
