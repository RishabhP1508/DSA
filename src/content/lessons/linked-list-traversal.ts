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
  prerequisites: ["variables-and-types"],

  explanation: `A **linked list** is a chain of **nodes**. Each node holds a value and a **reference to the next node**. The first node is the **head**; the last node's \`next\` is \`None\`, which marks the end.

Think of a scavenger hunt: each clue (node) tells you where the next clue is. You do not know where clue #5 is until you have followed clues #1 through #4. That is the key difference from a Python list — there is **no random access**. To reach the k-th node you must walk from the head, following \`next\` k times.

**Traversal** is that walk: start a pointer at the head, do something with the current node, then move the pointer to \`current.next\`, and stop when the pointer becomes \`None\`. Because you visit each of the n nodes once, traversal is **O(n)**.`,

  vocabulary: [
    { term: "Node", definition: "A single element of a linked list: a value plus a reference to the next node." },
    { term: "Head", definition: "The first node of the list; the entry point for any traversal." },
    { term: "next", definition: "A node's reference to the following node; None for the last node." },
    { term: "Traversal", definition: "Visiting each node in order by following next references from the head." },
    { term: "None terminator", definition: "The last node's next is None, signalling the end of the list." },
    { term: "Random access", definition: "Jumping directly to index k in O(1). Arrays/Python lists have it; linked lists do not." },
  ],

  concepts: {
    purpose:
      "Linked lists store a sequence where you mostly add/remove at the ends or splice nodes, without shifting other elements. Traversal is the foundation for every other linked-list operation (search, reverse, find middle, detect cycles).",
    operations:
      "Traversal follows `current = current.next` until `current is None`. Reading a node's value is O(1); reaching the k-th node is O(k) because there is no random access.",
    uses:
      "Implementing stacks/queues, adjacency lists, LRU caches, and any structure where cheap splicing matters more than indexed access.",
    tradeoffs:
      "Cheap insertion/removal given a node reference (O(1)), but no O(1) indexing and worse cache locality than arrays. Extra memory per node for the reference.",
    commonMistakes:
      "Looping `while current.next is not None` (this skips the last node's work); forgetting to advance `current = current.next` (infinite loop); dereferencing `current.val` after `current` becomes None.",
    edgeCases:
      "Empty list (head is None): the loop body never runs. Single node: one iteration then next is None.",
  },

  complexity: [
    { operation: "Traverse whole list", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "Visits each of n nodes once; only one pointer is kept." },
    { operation: "Access k-th node", best: "O(1)", average: "O(k)", worst: "O(n)", note: "Must walk from the head; no random access." },
  ],

  complexityExplanation: {
    variables: [{ symbol: "n", meaning: "the number of nodes in the linked list" }],
    costModel:
      "We count each visit to a node as constant work: reading current.val and following current.next are O(1) because a node holds a direct reference to the next node.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation:
        "The loop runs once per node — n times — and stops when current becomes None. Each iteration does a constant amount of work (print and one pointer move), so the total time grows in direct proportion to the number of nodes. Best, average, and worst are all O(n) because a full traversal always visits every node.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation:
        "We keep a single pointer, `current`, no matter how long the list is. No new list or stack is created that grows with n, so the auxiliary space is constant.",
      inputOutputNote:
        "The list of n nodes is the input; it already exists and is not counted as auxiliary space.",
    },
    derivation: [
      { lines: [11], description: "Set up one pointer at the head — a fixed cost done once.", cost: "O(1)", dimension: "time" },
      { lines: [12, 13, 14], description: "The loop body runs once for each of the n nodes; each run is constant work (check, print, advance).", cost: "O(n)", dimension: "time" },
      { lines: [11], description: "Only the single `current` pointer is stored; it does not grow with n.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: [
      "Following `current.next` is O(1) (a direct reference, not a search).",
      "`print` of one value is treated as constant work.",
      "The list is finite and acyclic, so the loop terminates after n steps.",
    ],
    tradeoffs:
      "A Python list would also traverse in O(n), but additionally offers O(1) random access by index — which a linked list cannot. The linked list's advantage is O(1) splicing given a node reference, not traversal speed.",
    counters: [
      { label: "loop iterations", definition: "executions of the while-loop body (lines 12–14)", countLines: [12] },
      { label: "nodes printed", definition: "executions of the print line (line 13)", countLines: [13] },
    ],
    fixedDataNote:
      "This example uses a fixed 3-node list, so you will observe 3 iterations. The O(n) bound describes how that count would grow if the list had n nodes instead of 3.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment describing what a node is." },
    { line: 2, executable: true, explanation: "Define a Node class. The class statement creates the Node type." },
    { line: 3, executable: true, explanation: "The constructor runs when we create a node; it receives the value and an optional next node." },
    { line: 4, executable: true, explanation: "Store the value on the node as the attribute `val`." },
    { line: 5, executable: true, explanation: "Store the reference to the next node as `next` (None by default)." },
    { line: 6, executable: false, explanation: "Blank line — no runtime effect." },
    { line: 7, executable: false, explanation: "Comment: we are about to build the list 1 -> 2 -> 3." },
    { line: 8, executable: true, explanation: "Create three nodes at once. Node(3) has next=None; it is wrapped by Node(2, ...), then Node(1, ...). `head` points at the node holding 1." },
    { line: 9, executable: false, explanation: "Blank line." },
    { line: 10, executable: false, explanation: "Comment describing the traversal." },
    { line: 11, executable: true, explanation: "Start the traversal pointer `current` at the head." },
    { line: 12, executable: true, explanation: "Loop while `current` still refers to a node (not None). This is the standard, correct loop condition." },
    { line: 13, executable: true, explanation: "Do the work for this node — here, print its value." },
    { line: 14, executable: true, explanation: "Advance to the next node. When we advance past the last node, `current` becomes None and the loop ends." },
  ],

  bindings: [
    {
      variable: "head",
      model: "linked-list",
      overlays: [{ role: "pointer", label: "current", source: "current" }],
    },
  ],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "The loop condition is `while current is not None`. What would go wrong if it were `while current.next is not None` instead?",
      answer: "The last node (value 3) would never be processed, and it would crash on an empty list because current could be None.",
      explanation: "`current.next is not None` stops one node early (it never processes the final node) and dereferences `.next` on a possibly-None pointer. `current is not None` is the correct, safe condition.",
    },
  ],

  experiments: [
    "Change the loop to also count nodes, and print the count after the loop.",
    "Start `current` at `head.next` and observe which node is skipped.",
    "Build an empty list (`head = None`) and confirm the loop body never runs.",
  ],

  exercises: [
    {
      id: "ll-complete-1",
      kind: "complete-code",
      prompt: "Complete the traversal so it returns the number of nodes in the list.",
      starterCode:
        "def length(head):\n    count = 0\n    current = head\n    while current is not None:\n        # TODO: increment count and advance\n        pass\n    return count",
      expected:
        "def length(head):\n    count = 0\n    current = head\n    while current is not None:\n        count += 1\n        current = current.next\n    return count",
      tests:
        "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\n\nassert length(None) == 0, 'empty list should be 0'\nassert length(Node(1)) == 1, 'single node should be 1'\nassert length(Node(1, Node(2, Node(3)))) == 3, 'three nodes should be 3'\nprint('OK')",
      hints: [
        "Each loop iteration corresponds to one node.",
        "Increase count by 1, then move current forward.",
        "count += 1; current = current.next",
      ],
    },
    {
      id: "ll-fix-1",
      kind: "fix-mistake",
      prompt: "This traversal never terminates. Find and fix the bug.",
      starterCode:
        "current = head\nwhile current is not None:\n    print(current.val)\n    # bug: current is never advanced",
      expected:
        "current = head\nwhile current is not None:\n    print(current.val)\n    current = current.next",
      hints: [
        "What has to change each iteration for the loop to end?",
        "The pointer must move toward the end of the list.",
        "Add `current = current.next` inside the loop.",
      ],
    },
    {
      id: "ll-predict-1",
      kind: "predict-state",
      prompt: "For the list 1 -> 2 -> 3, how many times does the loop body run, and what is `current` right after the loop ends?",
      expected: "3 times; current is None.",
      hints: [
        "The body runs once per node.",
        "There are 3 nodes.",
        "After the third node, current = current.next becomes None and the loop stops.",
      ],
    },
  ],

  review: `A linked list is nodes connected by \`next\` references, ending at \`None\`. **Traversal** walks from the head with a pointer, processing each node and advancing with \`current = current.next\`, stopping when \`current is None\`. It is **O(n)** time and **O(1)** space. The correct loop condition is \`while current is not None\` — using \`current.next\` instead stops one node early and can crash on an empty list. Linked lists trade away O(1) indexing for cheap splicing.`,

  expectedOutput: "1\n2\n3\n",

  references: [
    {
      url: "https://www.geeksforgeeks.org/traversal-of-singly-linked-list/",
      title: "Traversal of Singly Linked List — GeeksforGeeks",
      section: "Traversal process",
      topic: "linked-lists/traversal",
      purpose: "Confirm the traversal procedure: visit each node from the head and follow next until the last node whose next is None.",
      verifiedClaims: [
        "Traversal visits each node in turn following next references.",
        "The last node's next points to None (end of list).",
      ],
      accessDate: "2026-09-19",
    },
    {
      url: "https://hyperskill.org/learn/step/5336",
      title: "Singly linked list — Hyperskill",
      section: "Indexing / access cost",
      topic: "linked-lists/traversal",
      purpose: "Cross-check that accessing a node by index requires iterating next references, giving O(n) access.",
      verifiedClaims: [
        "Linked lists do not allow random access; reaching an index is O(n).",
      ],
      accessDate: "2026-09-19",
    },
    {
      url: "https://programiz.pro/resources/dsa-linked-list-complexity/",
      title: "Time Complexity of Linked List Operations — Programiz",
      section: "Traversal",
      topic: "linked-lists/traversal",
      purpose: "Verify full-list traversal is O(n) in the number of nodes.",
      verifiedClaims: ["Traversing all n nodes is O(n)."],
      accessDate: "2026-09-19",
    },
  ],
};
