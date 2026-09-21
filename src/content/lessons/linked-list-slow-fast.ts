/**
 * Lesson: Linked lists — slow/fast pointers (Linear structures).
 *
 * Researched against the sources in `references` and verified by executing the
 * program on CPython 3.14 (matching the bundled Pyodide 3.14.2). Output is
 * exactly "3\n3\n". Demonstrates the linked-list visualizer with two pointer
 * overlays moving at different speeds.
 */

import type { LessonDefinition } from "../../core/types";

const code = `class Node:
    def __init__(self, val, nxt=None):
        self.val = val
        self.next = nxt

# Build 1 -> 2 -> 3 -> 4 -> 5.
head = Node(1, Node(2, Node(3, Node(4, Node(5)))))

# Two pointers move together, but fast moves twice as fast as slow.
def middle(head):
    slow = head
    fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next        # +1 node
        fast = fast.next.next   # +2 nodes
    return slow

print(middle(head).val)                     # odd length -> exact middle
print(middle(Node(1, Node(2, Node(3, Node(4))))).val)  # even -> second of the two middles`;

export const linkedListSlowFast: LessonDefinition = {
  id: "linked-list-slow-fast",
  title: "Linked Lists: Slow/Fast Pointers",
  area: "Linear structures",
  prerequisites: ["linked-list-traversal"],

  explanation: `The **slow/fast pointer** technique (also called the **two-pointer** or **tortoise and hare** technique) walks **two pointers through one list at different speeds**. The **slow** pointer advances one node per step; the **fast** pointer advances two. Because fast covers twice the ground, when fast reaches the end, slow has travelled exactly **half** the list — so slow lands on the **middle** node.

Why is this useful? Finding the middle the obvious way takes **two passes**: one to count the n nodes, another to walk n/2 steps. Slow/fast finds the middle in a **single pass** without ever knowing the length in advance. The same "two speeds in one list" idea is the engine behind **cycle detection** (next lesson): if the list loops, the fast pointer eventually laps the slow one and they collide.

The loop condition is the subtle part: \`while fast is not None and fast.next is not None\`. Fast reads \`fast.next.next\`, so **both** \`fast\` and \`fast.next\` must exist before we step. For an **odd** length the loop stops with fast on the last node and slow on the exact middle; for an **even** length fast steps off the end (becomes \`None\`) and slow rests on the **second** of the two middle nodes. This is still **O(n)** time — slow takes ~n/2 steps, fast ~n/2 steps — but **O(1)** space.`,

  vocabulary: [
    { term: "Slow pointer", definition: "A pointer that advances one node per iteration (the 'tortoise')." },
    { term: "Fast pointer", definition: "A pointer that advances two nodes per iteration (the 'hare')." },
    { term: "Two-pointer technique", definition: "Coordinating two positions in one structure to solve a problem in a single pass." },
    { term: "Middle node", definition: "For odd n the exact centre; for even n the second of the two centre nodes with this convention." },
    { term: "Single-pass", definition: "Solving the problem with one traversal instead of counting first, then walking again." },
  ],

  concepts: {
    purpose:
      "Locate a position defined relative to the list's length (the middle, the n/2 point, the k-from-end point) in one pass, and provide the mechanism cycle detection relies on.",
    operations:
      "Advance slow by one and fast by two each iteration; stop when fast (or fast.next) is None. slow is then at the middle.",
    uses:
      "Finding the middle for merge-sorting a list or splitting it, detecting cycles, finding the k-th node from the end (offset the fast pointer by k first).",
    tradeoffs:
      "One pass and O(1) extra space versus the simpler but two-pass count-then-walk approach. The convention for the middle of an even-length list must be stated (this version returns the second middle).",
    commonMistakes:
      "Checking only `fast is not None` (then `fast.next.next` can crash); checking `fast.next.next` in the condition (over-restrictive, mishandles ends); advancing fast by one — that just reproduces a normal traversal.",
    edgeCases:
      "Empty list (head None): loop never runs, returns None. Single node: loop never runs, returns that node. Two nodes: one iteration, returns the second.",
  },

  complexity: [
    { operation: "Find middle (slow/fast)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "One pass; slow takes ~n/2 steps, fast ~n/2 steps." },
    { operation: "Count-then-walk (baseline)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "Two passes over the list: same big-O, more work." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of nodes in the list" }],
    costModel:
      "Advancing a pointer along `next` is O(1). Each loop iteration does a constant number of pointer moves and comparisons.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation:
        "The fast pointer moves two nodes per iteration and stops near the end, so the loop runs about n/2 times. Each iteration is constant work, giving O(n/2) = O(n). Slow and fast together traverse the list once, so best, average, and worst are all O(n).",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation:
        "Only two pointers, `slow` and `fast`, are kept regardless of list length. No structure that grows with n is created.",
      inputOutputNote: "The n-node list is the pre-existing input and is not counted as auxiliary space.",
    },
    derivation: [
      { lines: [11, 12], description: "Initialise both pointers at the head — constant work done once.", cost: "O(1)", dimension: "time" },
      { lines: [13, 14, 15], description: "Loop runs ~n/2 times; each iteration advances slow by 1 and fast by 2 (constant work).", cost: "O(n)", dimension: "time" },
      { lines: [11, 12], description: "Two pointers stored, independent of n.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: [
      "Following `next` is O(1) (a direct reference).",
      "The list is finite and acyclic, so fast reaches the end.",
      "Middle convention: for even n, slow ends on the SECOND of the two middle nodes.",
    ],
    tradeoffs:
      "The count-then-walk baseline is also O(n) time / O(1) space but makes two passes and needs the length; slow/fast needs neither. Against storing nodes in a list for O(1) indexing, slow/fast avoids the O(n) extra space.",
    counters: [
      { label: "slow steps", definition: "executions of the slow-advance line (line 14)", countLines: [14] },
      { label: "loop iterations", definition: "executions of the loop body (lines 14-15)", countLines: [15] },
    ],
    fixedDataNote:
      "The two calls use fixed 5- and 4-node lists, so you observe 2 and 2 loop iterations respectively. The O(n) bound describes how the iteration count grows (~n/2) as the list lengthens.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Define the Node class (value plus a next reference)." },
    { line: 2, executable: true, explanation: "Constructor storing the value and optional next node." },
    { line: 3, executable: true, explanation: "Store the value as `val`." },
    { line: 4, executable: true, explanation: "Store the next reference as `next` (None by default)." },
    { line: 5, executable: false, explanation: "Blank line — no runtime effect." },
    { line: 6, executable: false, explanation: "Comment: build a five-node list." },
    { line: 7, executable: true, explanation: "Build 1 -> 2 -> 3 -> 4 -> 5 by nesting constructors; head points at 1." },
    { line: 8, executable: false, explanation: "Blank line." },
    { line: 9, executable: false, explanation: "Comment describing the two-speed idea." },
    { line: 10, executable: true, explanation: "Define middle(head)." },
    { line: 11, executable: true, explanation: "Start the slow pointer at the head." },
    { line: 12, executable: true, explanation: "Start the fast pointer at the head too." },
    { line: 13, executable: true, explanation: "Loop while there is room for fast to take two steps (both fast and fast.next must exist)." },
    { line: 14, executable: true, explanation: "Advance slow by one node." },
    { line: 15, executable: true, explanation: "Advance fast by two nodes." },
    { line: 16, executable: true, explanation: "When the loop ends, slow is at the middle; return it." },
    { line: 17, executable: false, explanation: "Blank line." },
    { line: 18, executable: true, explanation: "Odd length (5): prints 3, the exact middle." },
    { line: 19, executable: true, explanation: "Even length (4): prints 3, the second of the two middle nodes (2 and 3)." },
  ],

  bindings: [
    {
      variable: "head",
      model: "linked-list",
      overlays: [
        { role: "pointer", label: "slow", source: "slow" },
        { role: "pointer", label: "fast", source: "fast" },
      ],
    },
  ],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "For an even-length list like 1 -> 2 -> 3 -> 4, which node does `slow` end on, and why?",
      answer: "Node 3 (the second of the two middles). Fast steps head->3->None; slow steps head->2->3.",
      explanation: "With this loop, fast lands on None after two iterations while slow advances twice, ending on the second middle node. Starting fast at head.next would instead yield the first middle.",
    },
  ],

  experiments: [
    "Print slow.val and fast position each iteration to watch the two speeds.",
    "Start fast at head.next and observe slow land on the FIRST middle for even lengths.",
    "Adapt it to return the k-th node from the end by advancing fast k nodes before the loop.",
  ],

  exercises: [
    {
      id: "llsf-complete-1",
      kind: "complete-code",
      prompt: "Complete the loop so `slow` ends at the middle node.",
      starterCode:
        "def middle(head):\n    slow = head\n    fast = head\n    while fast is not None and fast.next is not None:\n        # TODO: advance slow by one and fast by two\n        pass\n    return slow",
      expected:
        "def middle(head):\n    slow = head\n    fast = head\n    while fast is not None and fast.next is not None:\n        slow = slow.next\n        fast = fast.next.next\n    return slow",
      hints: [
        "Slow moves one node, fast moves two.",
        "fast = fast.next.next uses two links, which is why the condition checks fast.next.",
        "slow = slow.next; fast = fast.next.next",
      ],
    },
    {
      id: "llsf-fix-1",
      kind: "fix-mistake",
      prompt: "This crashes on even-length lists with 'NoneType has no attribute next'. Fix the loop condition.",
      starterCode:
        "while fast is not None:\n    slow = slow.next\n    fast = fast.next.next",
      expected:
        "while fast is not None and fast.next is not None:\n    slow = slow.next\n    fast = fast.next.next",
      hints: [
        "fast.next.next reads two links ahead.",
        "Both fast AND fast.next must exist before stepping twice.",
        "Add `and fast.next is not None` to the condition.",
      ],
    },
    {
      id: "llsf-predict-1",
      kind: "predict-state",
      prompt: "For 1 -> 2 -> 3 -> 4 -> 5, how many loop iterations run and where does slow end?",
      expected: "2 iterations; slow ends on node 3.",
      hints: [
        "Fast goes head->3->5, then can't step twice.",
        "Slow moves once per iteration.",
        "Two iterations move slow head->2->3.",
      ],
    },
  ],

  review: `The **slow/fast pointer** technique walks two pointers through one list — slow by one node, fast by two. When fast reaches the end, slow sits at the **middle**, found in a **single O(n) pass** with **O(1)** space and no length count. The safe loop condition is \`while fast is not None and fast.next is not None\`, because fast reads two links ahead. For even lengths this convention returns the **second** middle. The same two-speed mechanism powers cycle detection next.`,

  expectedOutput: "3\n3\n",

  references: [
    {
      url: "https://en.wikipedia.org/wiki/Cycle_detection#Floyd's_tortoise_and_hare",
      title: "Cycle detection — Floyd's tortoise and hare (Wikipedia)",
      section: "Floyd's tortoise and hare",
      topic: "linked-lists/slow-fast",
      purpose: "Confirm the two-speed pointer mechanism (one moves twice as fast) and its single-pass, constant-space nature.",
      verifiedClaims: [
        "Two pointers move through the sequence at different speeds (one twice the other).",
        "The method uses O(1) extra memory.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://www.geeksforgeeks.org/dsa/tortoise-and-hare-algorithm/",
      title: "Tortoise and Hare Algorithm — GeeksforGeeks",
      section: "Finding the middle of a linked list",
      topic: "linked-lists/slow-fast",
      purpose: "Cross-check that advancing slow by 1 and fast by 2 leaves slow at the middle when fast reaches the end, in one pass.",
      verifiedClaims: [
        "When fast reaches the end, slow is at the middle node.",
        "The technique needs a single traversal.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "3b1198567adc22b0",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
