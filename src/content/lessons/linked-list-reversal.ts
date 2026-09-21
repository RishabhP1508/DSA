/**
 * Lesson: Linked lists — reversal (iterative pointer rewiring).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "[1, 2, 3, 4, 5]\n[5, 4, 3, 2, 1]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `class Node:
    def __init__(self, val, nxt=None):
        self.val = val
        self.next = nxt

def to_list(head):
    out = []
    while head is not None:
        out.append(head.val)
        head = head.next
    return out

# Reverse by flipping each node's next to point at the previous node.
def reverse(head):
    prev = None
    curr = head
    while curr is not None:
        nxt = curr.next      # remember the rest before we overwrite next
        curr.next = prev     # flip this node's link backwards
        prev = curr          # prev advances to the node we just flipped
        curr = nxt           # curr advances to the saved rest
    return prev              # prev is the new head

head = Node(1, Node(2, Node(3, Node(4, Node(5)))))
print(to_list(head))
print(to_list(reverse(head)))`;

export const linkedListReversal: LessonDefinition = {
  id: "linked-list-reversal",
  title: "Linked Lists: Reversal",
  area: "Linear structures",
  prerequisites: ["linked-list-traversal"],

  explanation: `**Reversing** a singly linked list means making the last node the new head and flipping every \`next\` reference to point at the node that used to precede it. You cannot "walk backwards" — a singly linked node only knows its \`next\` — so reversal is done by **rewiring links as you go**, tracking three pointers.

Keep \`prev\` (the part already reversed, initially \`None\`), \`curr\` (the node being processed), and a temporary \`nxt\`. Each step: **save** \`nxt = curr.next\` (because the very next line destroys \`curr.next\`), **flip** \`curr.next = prev\`, then **slide** both \`prev = curr\` and \`curr = nxt\` forward. When \`curr\` becomes \`None\`, \`prev\` is the new head. The order of these four lines matters: overwrite \`curr.next\` **only after** saving it, or you lose the rest of the list.

This is **O(n)** time (each node is visited once) and **O(1)** space (three pointers, no matter how long the list). A recursive version exists but uses **O(n)** stack space, so the iterative form is preferred for long lists. Reversal is a building block for many problems: reversing a sublist, checking a list is a palindrome (reverse the second half), and reordering nodes.`,

  vocabulary: [
    { term: "Reversal", definition: "Flipping every next reference so the list runs in the opposite order." },
    { term: "prev", definition: "Pointer to the already-reversed portion; starts as None and ends as the new head." },
    { term: "curr", definition: "The node currently being rewired." },
    { term: "nxt (saved next)", definition: "A temporary holding curr.next so the rest of the list isn't lost when we overwrite the link." },
    { term: "In-place", definition: "Reusing the existing nodes and only changing their links, allocating no new list." },
  ],

  concepts: {
    purpose:
      "Produce the same nodes in reversed order by relinking, without allocating a second list. It underlies palindrome checks, sublist reversal, and reordering.",
    operations:
      "For each node: save next, point next at prev, advance prev and curr. Return prev as the new head.",
    uses:
      "Reverse a whole list or a sublist, check palindromes by reversing the second half, reorder lists, undo-style traversals.",
    tradeoffs:
      "Iterative reversal is O(1) space; the recursive version is elegant but O(n) stack space. Reversing in place mutates the original list order.",
    commonMistakes:
      "Overwriting curr.next before saving it (loses the rest of the list); returning head instead of prev (head is now the tail); forgetting to advance curr (infinite loop).",
    edgeCases:
      "Empty list: loop never runs, returns None. Single node: one iteration, node points at None, returned unchanged in order.",
  },

  complexity: [
    { operation: "Reverse (iterative)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "Each node relinked once; three pointers only." },
    { operation: "Reverse (recursive)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)", note: "Same time, but O(n) call-stack depth." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of nodes in the list" }],
    costModel:
      "Reading and reassigning a `next` reference is O(1). Each loop iteration does a constant number of such assignments.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation:
        "The loop runs exactly once per node — n iterations — and each does four constant-time pointer operations. So total work grows linearly with the number of nodes; best, average, and worst are all O(n).",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation:
        "Only prev, curr, and nxt are kept, regardless of list length. No new list is built — the existing nodes are reused with flipped links.",
      inputOutputNote: "The list is reversed in place; the returned head is one of the existing nodes, so no output storage grows with n.",
    },
    derivation: [
      { lines: [15, 16], description: "Initialise prev and curr — constant work once.", cost: "O(1)", dimension: "time" },
      { lines: [18, 19, 20, 21], description: "Loop body runs once per node; four constant-time pointer moves each.", cost: "O(n)", dimension: "time" },
      { lines: [15, 16, 18], description: "Three pointers (prev, curr, nxt) only.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: [
      "Reassigning `next` is O(1).",
      "The list is finite and acyclic, so the loop terminates after n steps.",
      "Reversal is allowed to mutate the input list in place.",
    ],
    tradeoffs:
      "The recursive reversal is O(n) stack space and risks a recursion-limit error on long lists; the iterative version avoids that at O(1) space. Building a brand-new reversed list would cost O(n) extra space unnecessarily.",
    counters: [
      { label: "nodes relinked", definition: "executions of the flip line (line 19)", countLines: [19] },
      { label: "loop iterations", definition: "executions of the loop body (lines 18-21)", countLines: [18] },
    ],
    fixedDataNote:
      "The fixed 5-node list produces 5 relinks. The O(n) bound describes how that count scales with list length.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Define the Node class." },
    { line: 2, executable: true, explanation: "Constructor storing value and optional next." },
    { line: 3, executable: true, explanation: "Store the value." },
    { line: 4, executable: true, explanation: "Store the next reference." },
    { line: 5, executable: false, explanation: "Blank line." },
    { line: 6, executable: true, explanation: "Define a helper to turn the list into a Python list for printing." },
    { line: 7, executable: true, explanation: "Start with an empty output list." },
    { line: 8, executable: true, explanation: "Walk while there is a node." },
    { line: 9, executable: true, explanation: "Collect the current value." },
    { line: 10, executable: true, explanation: "Advance to the next node." },
    { line: 11, executable: true, explanation: "Return the collected values." },
    { line: 12, executable: false, explanation: "Blank line." },
    { line: 13, executable: false, explanation: "Comment explaining the flip strategy." },
    { line: 14, executable: true, explanation: "Define reverse(head)." },
    { line: 15, executable: true, explanation: "prev starts as None (the reversed part is empty)." },
    { line: 16, executable: true, explanation: "curr starts at the head." },
    { line: 17, executable: true, explanation: "Loop until every node is processed." },
    { line: 18, executable: true, explanation: "Save the rest of the list before overwriting curr.next." },
    { line: 19, executable: true, explanation: "Flip: point curr.next at the already-reversed portion." },
    { line: 20, executable: true, explanation: "Advance prev to the node just flipped." },
    { line: 21, executable: true, explanation: "Advance curr to the saved rest." },
    { line: 22, executable: true, explanation: "prev is now the head of the reversed list; return it." },
    { line: 23, executable: false, explanation: "Blank line." },
    { line: 24, executable: true, explanation: "Build 1 -> 2 -> 3 -> 4 -> 5." },
    { line: 25, executable: true, explanation: "Print the original order [1, 2, 3, 4, 5]." },
    { line: 26, executable: true, explanation: "Reverse then print [5, 4, 3, 2, 1]." },
  ],

  bindings: [
    {
      variable: "head",
      model: "linked-list",
      overlays: [
        { role: "pointer", label: "prev", source: "prev" },
        { role: "pointer", label: "curr", source: "curr" },
      ],
    },
  ],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "What breaks if you write `curr.next = prev` BEFORE `nxt = curr.next`?",
      answer: "You lose the rest of the list: curr.next now points at prev, so you can no longer reach the nodes after curr, and the loop can't continue correctly.",
      explanation: "The save must come first. Once curr.next is overwritten, the original continuation is gone unless it was stored in nxt.",
    },
  ],

  experiments: [
    "Print prev and curr each iteration to watch the boundary between reversed and unreversed parts move.",
    "Write a recursive reverse and compare its behaviour (and stack usage) on a long list.",
    "Reverse only the first k nodes and reconnect to the rest.",
  ],

  exercises: [
    {
      id: "llr-complete-1",
      kind: "complete-code",
      prompt: "Fill in the four-line body so the list is reversed in place.",
      starterCode:
        "def reverse(head):\n    prev = None\n    curr = head\n    while curr is not None:\n        # TODO: save, flip, advance prev, advance curr\n        pass\n    return prev",
      expected:
        "def reverse(head):\n    prev = None\n    curr = head\n    while curr is not None:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev",
      tests:
        "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\n\ndef to_list(h):\n    out = []\n    while h is not None:\n        out.append(h.val)\n        h = h.next\n    return out\n\nassert to_list(reverse(None)) == [], 'empty reverses to empty'\nassert to_list(reverse(Node(1))) == [1], 'single node unchanged'\nassert to_list(reverse(Node(1, Node(2, Node(3, Node(4, Node(5))))))) == [5, 4, 3, 2, 1], 'reverses order'\nprint('OK')",
      hints: [
        "Save curr.next before you overwrite it.",
        "Flip curr.next to prev, then move both pointers forward.",
        "nxt = curr.next; curr.next = prev; prev = curr; curr = nxt",
      ],
    },
    {
      id: "llr-fix-1",
      kind: "fix-mistake",
      prompt: "This returns the wrong node as the new head. Fix it.",
      starterCode:
        "def reverse(head):\n    prev = None\n    curr = head\n    while curr is not None:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return head",
      expected:
        "def reverse(head):\n    prev = None\n    curr = head\n    while curr is not None:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev",
      hints: [
        "After the loop, what is head pointing to?",
        "head is now the tail (its next is None).",
        "Return prev, the new head.",
      ],
    },
    {
      id: "llr-predict-1",
      kind: "predict-state",
      prompt: "For a single-node list [7], how many loop iterations run and what does reverse return?",
      expected: "1 iteration; returns the same node (value 7) now pointing at None.",
      hints: [
        "The loop runs once per node.",
        "There is one node.",
        "prev becomes that node after one flip.",
      ],
    },
  ],

  review: `**Reversal** flips every \`next\` so the list runs backwards, using three pointers: \`prev\`, \`curr\`, and a saved \`nxt\`. Each step **saves** the rest, **flips** curr.next to prev, then **slides** prev and curr forward; \`prev\` is the new head. It is **O(n)** time, **O(1)** space, and done **in place**. The save-before-flip order is essential, and you must return \`prev\`, not the original \`head\`. Prefer the iterative form over the O(n)-stack recursive one for long lists.`,

  expectedOutput: "[1, 2, 3, 4, 5]\n[5, 4, 3, 2, 1]\n",

  references: [
    {
      url: "https://www.geeksforgeeks.org/dsa/reverse-a-linked-list/",
      title: "Reverse a Linked List — GeeksforGeeks",
      section: "Iterative method (three pointers)",
      topic: "linked-lists/reversal",
      purpose: "Confirm the three-pointer iterative reversal, the save-before-flip ordering, and O(n) time / O(1) space.",
      verifiedClaims: [
        "Iterative reversal uses prev/curr/next and flips each link.",
        "It runs in O(n) time and O(1) auxiliary space.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://leetcode.com/problems/reverse-linked-list/editorial/",
      title: "Reverse Linked List — LeetCode editorial",
      section: "Iterative and recursive approaches",
      topic: "linked-lists/reversal",
      purpose: "Cross-check that the recursive approach costs O(n) stack space while the iterative one is O(1).",
      verifiedClaims: [
        "Iterative reversal is O(1) space; recursive reversal is O(n) space due to the call stack.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "ec9e65ff7a3d42ff",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
