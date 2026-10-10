/**
 * Lesson: BST operations (Trees and tries). Verified on CPython 3.14.
 * Output: "True\nFalse\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# BST invariant here: left subtree < node <= right subtree.
def insert(root, val):
    if root is None:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)   # go left for smaller
    else:
        root.right = insert(root.right, val) # go right for larger/equal
    return root

def search(root, val):
    while root:
        if val == root.val:
            return True
        root = root.left if val < root.val else root.right  # prune one side
    return False

bst = None
for v in [5, 3, 8, 1, 4]:
    bst = insert(bst, v)
print(search(bst, 4))
print(search(bst, 6))`;

export const bstOperations: LessonDefinition = {
  id: "bst-operations",
  title: "Binary Search Tree Operations",
  area: "Trees and tries",
  prerequisites: ["tree-dfs", "binary-search"],

  explanation: "A **binary search tree** uses key comparisons to discard a whole subtree at each step. This example stores values smaller than a node on the left and values greater than or equal to it on the right: equal insertions follow the right branch. Search stops at equality or at a missing child. Inorder traversal gives nondecreasing values.\n\nOne search or insertion takes O(h) time for tree height h. An unbalanced tree can become a chain of n nodes, so there is no guaranteed halving and worst-case time is O(n). Balanced BSTs guarantee O(log n) height; a plain tree has expected logarithmic height only under an appropriate random insertion model. Iterative search uses O(1) auxiliary space; this recursive insertion uses O(h) frames and creates one output node.\n\nTrees support sorted-key operations such as floor, ceiling and range enumeration. Python dictionaries preserve insertion order, but they do not maintain a sorted-key index; answering a value range or floor/ceiling by scanning costs linear time. A balanced BST makes those ordered queries efficient.",

  vocabulary: [
  {
    "term": "Binary search tree (BST)",
    "definition": "A tree whose left-subtree values are smaller and right-subtree values are greater than or equal to each node in this duplicate-right example."
  },
  {
    "term": "BST invariant",
    "definition": "The ordering property that lets you prune one subtree per comparison."
  },
  {
    "term": "Search",
    "definition": "Follow left/right by comparison to find (or not) a value in O(h)."
  },
  {
    "term": "Insert",
    "definition": "Walk to the correct empty slot and attach a new leaf, preserving the invariant."
  },
  {
    "term": "Balanced vs degenerate",
    "definition": "Balanced h ≈ log n (O(log n) ops); degenerate h = n (O(n) ops)."
  }
],

  concepts: {
  "purpose": "Support ordered, dynamic search/insert/delete in O(h) — O(log n) when balanced.",
  "operations": "Compare at each node; go left (smaller) or right (larger); insert attaches a leaf at the empty slot.",
  "uses": "Ordered maps/sets, range queries, floor/ceil, dynamic sorted data (balanced variants).",
  "tradeoffs": "O(log n) when balanced but O(n) when degenerate; self-balancing trees fix the worst case at extra complexity.",
  "commonMistakes": "Assuming each branch eliminates half the nodes; forgetting to return the new root after insertion; mixing duplicate-key policies.",
  "edgeCases": "Empty search returns False. Equal insertions go right. Sorted or repeated insertions can create a chain."
},

  complexity: [
  {
    "operation": "Search / insert",
    "best": "O(1)",
    "worst": "O(n)",
    "space": "O(h)",
    "note": "Expected O(log n) only under a suitable random distinct-key insertion model; guaranteed O(log n) when balanced."
  }
],

  complexityExplanation: {
  "scope": "operation",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of nodes in the BST"
    },
    {
      "symbol": "h",
      "meaning": "the height of the tree"
    }
  ],
  "costModel": "Each step is one O(1) comparison that moves down one level; the number of steps is the path length, bounded by h.",
  "time": {
    "bound": "O(h)",
    "case": "worst",
    "explanation": "One operation follows a single path. It need not discard half the nodes: h can be n. Balanced height gives logarithmic cost.",
    "otherCases": [
      {
        "case": "best",
        "bound": "O(1)",
        "note": "The target is the root, or the tree is empty."
      },
      {
        "case": "worst",
        "bound": "O(n)",
        "note": "A degenerate tree (sorted insertion order) has height n."
      }
    ]
  },
  "space": {
    "bound": "O(h)",
    "case": "worst",
    "explanation": "Iterative search uses O(1) space; the recursive insert uses stack depth equal to the path length, O(h). No structure grows beyond the tree itself.",
    "inputOutputNote": "Iterative search uses O(1) working space. Recursive insertion uses O(h) frames; the tree is stored/output data. Building by n successive insertions can take O(n²)."
  },
  "derivation": [
    {
      "lines": [
        18,
        19,
        20,
        21
      ],
      "description": "Search follows one root-to-leaf path, one comparison per level.",
      "cost": "O(h)",
      "dimension": "time"
    },
    {
      "lines": [
        9,
        10,
        11,
        12,
        13,
        14
      ],
      "description": "Insert walks to the empty slot along one path.",
      "cost": "O(h)",
      "dimension": "time"
    },
    {
      "lines": [
        12,
        14
      ],
      "description": "Recursive insert's stack depth is the path length h.",
      "cost": "O(h)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Comparable keys with constant-cost comparisons.",
    "Duplicate keys are placed on the right. A plain tree has no balance guarantee.",
    "The panel describes one operation, not the complete sequence of sample insertions."
  ],
  "tradeoffs": "Python dict gives expected fast exact lookup and insertion order. A balanced BST maintains a sorted-key index for efficient range/floor/ceiling operations.",
  "counters": [
    {
      "label": "search steps",
      "definition": "iterations of the search descent (line 19)",
      "countLines": [
        19
      ]
    }
  ],
  "fixedDataNote": "This run inserts 5 values then searches: 4 is present (True), 6 is absent (False). With balanced shape ops are O(log n); sorted inserts would make them O(n).",
  "references": [
    {
      "url": "https://opendatastructures.org/ods-python/6_2_BinarySearchTree_Unbala.html",
      "title": "Open Data Structures: unbalanced BST",
      "section": "6.2.1 searching; 6.2.2 addition; 6.2.4 summary; Figures 6.5–6.7",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "A search follows one root-to-leaf path.",
        "Unbalanced height can be linear."
      ],
      "conventions": [
        "Source rejects duplicate keys; this insertion example sends equal keys right."
      ],
      "accessDate": "2026-10-10"
    },
    {
      "url": "https://docs.python.org/3.14/library/stdtypes.html#dict.setdefault",
      "title": "Python 3.14: dictionary operations",
      "topic": "python-dict",
      "section": "dict.setdefault and insertion-order guarantee",
      "purpose": "Check supported dictionary behavior against the language manual.",
      "verifiedClaims": [
        "setdefault returns an existing value or inserts its default.",
        "Dictionaries preserve insertion order, not sorted-key order."
      ],
      "conventions": [
        "Online manual currently displays 3.14.8; executable behavior was probed on bundled 3.14.2."
      ],
      "accessDate": "2026-10-10"
    }
  ]
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": true,
    "explanation": "Define TreeNode."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Constructor."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Value."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Left child."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Right child."
  },
  {
    "line": 6,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 7,
    "executable": false,
    "explanation": "This insertion policy puts strictly smaller keys left and greater-or-equal keys right."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Define recursive insert(root, val)."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Base case: an empty slot becomes a new leaf."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Return the new node."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "If val is smaller, it belongs on the left."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Recurse left and reattach the (possibly new) subtree."
  },
  {
    "line": 13,
    "executable": false,
    "explanation": "Otherwise it belongs on the right."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "Recurse right and reattach."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Return this (unchanged) root up the chain."
  },
  {
    "line": 16,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Define iterative search(root, val)."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "Descend while there is a node."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "Found the target."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Return True on a match."
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "Otherwise go left if smaller, right if larger — pruning one side."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "Fell off the tree: not found."
  },
  {
    "line": 23,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 24,
    "executable": true,
    "explanation": "Start with an empty tree."
  },
  {
    "line": 25,
    "executable": true,
    "explanation": "Insert 5, 3, 8, 1, 4 (this order stays reasonably balanced)."
  },
  {
    "line": 26,
    "executable": true,
    "explanation": "Insert each value."
  },
  {
    "line": 27,
    "executable": true,
    "explanation": "search(bst, 4) → True."
  },
  {
    "line": 28,
    "executable": true,
    "explanation": "search(bst, 6) → False."
  }
],

  bindings: [
    { variable: "bst", model: "tree", overlays: [{ role: "pointer", label: "node", source: "root" }] },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "If you insert values 1, 2, 3, 4, 5 in that order, what shape is the BST and what does that do to search time?", answer: "A degenerate right-leaning chain (like a linked list) with height n, so search/insert become O(n) instead of O(log n).", explanation: "Each new value is larger than all before it, so it becomes the right child of the previous — no branching. Height equals n, so operations degrade to O(n); this is why balancing matters." },
  ],

  experiments: [
    "Insert sorted values 1..7 and observe the degenerate O(n)-height tree.",
    "Insert the same values in a balanced order and compare heights.",
    "Add an inorder traversal to confirm it prints the values sorted.",
  ],

  exercises: [
  {
    "id": "bst-complete-1",
    "kind": "complete-code",
    "prompt": "Complete iterative BST search returning True/False.",
    "starterCode": "def search(root, val):\n    while root:\n        if val == root.val:\n            return True\n        # TODO: move left or right by comparison\n    return False",
    "expected": "def search(root, val):\n    while root:\n        if val == root.val:\n            return True\n        root = root.left if val < root.val else root.right\n    return False",
    "hints": [
      "Compare the target with the current node.",
      "A valid BST lets you discard a whole subtree, though it may contain very few nodes.",
      "Equality succeeds; a smaller value follows left and a larger value follows right.",
      "Continue iteratively until equality or a missing child.",
      "while root: compare; return True on equality; choose the matching child; return False when absent.",
      "The model walks one root-to-leaf path in O(h) time and O(1) working space."
    ],
    "tests": "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n# BST: 4 -> (2 -> 1,3) , (6 -> 5,7)\nroot = TreeNode(4, TreeNode(2, TreeNode(1), TreeNode(3)), TreeNode(6, TreeNode(5), TreeNode(7)))\nassert search(root, 4) is True, 'root found'\nassert search(root, 1) is True, 'leftmost leaf found'\nassert search(root, 7) is True, 'rightmost leaf found'\nassert search(root, 5) is True, 'interior found via right then left'\nassert search(root, 8) is False, 'absent value'\nassert search(None, 1) is False, 'empty tree'\nprint('OK')"
  },
  {
    "id": "bst-choose-1",
    "kind": "choose-approach",
    "prompt": "You need ordered operations (range queries, floor/ceil) AND guaranteed fast lookup on changing data. Plain BST, balanced BST, or hash map?",
    "expected": "A self-balancing BST gives logarithmic search/update and a sorted-key index. A plain BST can have linear height. A Python dict preserves insertion order but needs a scan for arbitrary sorted-key range/floor/ceiling queries.",
    "hints": [
      "Goal: pick a structure needing ordered operations (range, floor/ceil) AND guaranteed fast lookup on changing data — plain BST, balanced BST, or hash map.",
      "The costly risks are a plain BST degenerating to O(n) and a hash map having no ordering at all.",
      "Key property: you need BOTH order-based queries and a worst-case guarantee under ongoing inserts and deletes.",
      "Approach: use a self-balancing BST (AVL or red-black).",
      "Reasoning: a balanced BST keeps height O(log n) for guaranteed O(log n) search/insert/delete plus ordered queries; a plain BST risks O(n) if unbalanced, and a hash map is expected O(1) but supports no order or range queries.",
      "Answer: a balanced BST (AVL/red-black) — guaranteed O(log n) operations AND ordered queries, unlike a plain BST (risking O(n)) or a hash map (no order)."
    ],
    "recognition": {
      "scenario": "You need ordered operations (range queries, floor/ceil) AND guaranteed fast lookup on data that keeps changing.",
      "approaches": [
        {
          "id": "balanced-bst",
          "label": "A self-balancing BST (AVL / red-black)",
          "requiredReasonIds": [
            "balanced-ordered-and-fast"
          ]
        },
        {
          "id": "plain-bst",
          "label": "A plain (unbalanced) BST",
          "requiredReasonIds": [],
          "rejectionFeedback": "A plain BST supports ordered queries but can degrade to an O(n)-height chain on bad insert orders, losing the guaranteed fast lookup."
        },
        {
          "id": "hash-map",
          "label": "A hash map",
          "requiredReasonIds": [],
          "rejectionFeedback": "A dict maintains insertion order, not sorted-key order. Without another index, range/floor/ceiling queries require scanning keys."
        }
      ],
      "reasons": [
        {
          "id": "balanced-ordered-and-fast",
          "text": "A balanced BST keeps height O(log n), guaranteeing O(log n) search/insert/delete while its in-order structure answers range and floor/ceil queries."
        },
        {
          "id": "hashmap-does-ranges",
          "text": "A hash map answers range and floor/ceil queries efficiently.",
          "contradictory": true
        },
        {
          "id": "plain-bst-always-logn",
          "text": "A plain BST always has O(log n) height regardless of insertion order.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "balanced-bst"
      ],
      "modelExplanation": "A balanced BST (AVL/red-black) gives guaranteed O(log n) search/insert/delete AND ordered queries. A plain BST risks O(n) if unbalanced; a hash map is expected O(1) but supports no order/range queries."
    }
  }
],

  review: "This example uses left < node <= right, routing duplicate insertions right. One operation follows a path of height h: O(h), logarithmic when balanced and linear on a chain. Recursive insertion uses O(h) frames; iterative search uses O(1). Dictionaries preserve insertion order but do not index sorted-key ranges.",

  expectedOutput: "True\nFalse\n",

  references: [
  {
    "url": "https://opendatastructures.org/ods-python/6_2_BinarySearchTree_Unbala.html",
    "title": "Open Data Structures: unbalanced BST",
    "section": "6.2.1 searching; 6.2.2 addition; 6.2.4 summary; Figures 6.5–6.7",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "A search follows one root-to-leaf path.",
      "Unbalanced height can be linear."
    ],
    "conventions": [
      "Source rejects duplicate keys; this insertion example sends equal keys right."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://docs.python.org/3.14/library/stdtypes.html#dict.setdefault",
    "title": "Python 3.14: dictionary operations",
    "topic": "python-dict",
    "section": "dict.setdefault and insertion-order guarantee",
    "purpose": "Check supported dictionary behavior against the language manual.",
    "verifiedClaims": [
      "setdefault returns an existing value or inserts its default.",
      "Dictionaries preserve insertion order, not sorted-key order."
    ],
    "conventions": [
      "Online manual currently displays 3.14.8; executable behavior was probed on bundled 3.14.2."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "d5cf50c46527978b",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
