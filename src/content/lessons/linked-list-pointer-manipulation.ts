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
  prerequisites: ["linked-list-reversal", "linked-list-dummy-nodes"],

  explanation: `Many linked-list problems are really exercises in **pointer manipulation**: reordering nodes purely by **rewiring \`next\` references**, without copying or moving values. Swapping every adjacent pair — [1,2,3,4] → [2,1,4,3] — is the classic drill. It forces you to hold several pointers at once and update them in an order that never loses part of the list.

The safe recipe uses a **dummy head** and, for each pair, three named pointers: \`prev\` (the node before the pair), \`first\`, and \`second\`. The three rewiring lines must run in an order that preserves reachability: first make \`first.next = second.next\` (so we remember what comes after the pair through \`first\`), then \`second.next = first\` (the actual swap), then \`prev.next = second\` (attach the swapped pair to the front). Finally advance \`prev = first\`, because after the swap \`first\` is the **tail** of the pair. Getting this order wrong — for example attaching \`prev.next = second\` before saving \`second.next\` — orphans the rest of the list.

The loop condition \`prev.next is not None and prev.next.next is not None\` checks that a **full pair** exists; a leftover odd node is simply left in place (that's why [1,2,3,4,5] → [2,1,4,3,5]). Like reversal, this is **O(n)** time and **O(1)** space: each node is rewired once and only a few pointers are kept. The transferable lesson is the discipline — **name every pointer, decide the update order so nothing becomes unreachable, and use a dummy to avoid head edge cases.**`,

  vocabulary: [
    { term: "Pointer manipulation", definition: "Reordering nodes by changing next references rather than moving values." },
    { term: "Pair swap", definition: "Exchanging two adjacent nodes so their order flips." },
    { term: "Rewiring order", definition: "The sequence of next assignments chosen so no node becomes unreachable mid-update." },
    { term: "Orphaned node", definition: "A node no longer reachable because a link was overwritten too early." },
    { term: "Leftover node", definition: "An unpaired final node (odd length) that stays where it is." },
  ],

  concepts: {
    purpose:
      "Practice reordering nodes by link surgery — the core skill behind pair swaps, k-group reversal, reordering, and rotation.",
    operations:
      "Per pair: save first/second, set first.next past the pair, second.next = first, prev.next = second, advance prev to first.",
    uses:
      "Swap nodes in pairs, reverse in k-groups, reorder a list, rotate a list, odd/even splitting.",
    tradeoffs:
      "Rewiring nodes (O(1) space) rather than swapping values keeps object identities intact — important if other references point at the nodes. It is trickier to get right than value swaps.",
    commonMistakes:
      "Wrong update order (orphaning the rest of the list); advancing prev to second instead of first; a loop condition that mishandles an odd leftover node; forgetting the dummy and mangling the head.",
    edgeCases:
      "Empty or single node: loop never runs, list unchanged. Odd length: the last node is left in place. Two nodes: one swap.",
  },

  complexity: [
    { operation: "Swap pairs (rewire)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "Each node rewired once; a few pointers and one dummy." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of nodes in the list" }],
    costModel:
      "Each pointer read and `next` assignment is O(1). Each loop iteration processes one pair with a constant number of assignments.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation:
        "The loop runs once per pair — about n/2 iterations — and each iteration does a constant number of pointer rewires. Every node is touched a constant number of times, so total time is proportional to n.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation:
        "Only the dummy node and the pointers prev, first, second are used, independent of n. No structure grows with the list, and no values are copied into new storage.",
      inputOutputNote: "The list is reordered in place by relinking existing nodes; the result reuses them.",
    },
    derivation: [
      { lines: [21, 22], description: "Create the dummy and prev — constant setup.", cost: "O(1)", dimension: "time" },
      { lines: [23, 24, 25, 26, 27, 28, 29], description: "Loop runs ~n/2 times; constant rewiring work per pair.", cost: "O(n)", dimension: "time" },
      { lines: [21], description: "One dummy plus a fixed set of pointers.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: [
      "Reading and assigning `next` are O(1).",
      "The list is finite and acyclic.",
      "An odd leftover node is left unmoved (not an error).",
    ],
    tradeoffs:
      "Swapping node values instead of relinking would also be O(n)/O(1) and simpler, but it breaks node identity — external references to a node would now see a different value. Rewiring preserves identity, which matters for many problems.",
    counters: [
      { label: "pairs swapped", definition: "executions of the swap line (line 26)", countLines: [26] },
      { label: "loop iterations", definition: "executions of the loop body (line 24)", countLines: [24] },
    ],
    fixedDataNote:
      "The 4-node list does 2 swaps; the 5-node list does 2 swaps and leaves node 5. The O(n) bound describes how the rewiring work scales with list length.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Define the Node class." },
    { line: 2, executable: true, explanation: "Constructor storing value and optional next." },
    { line: 3, executable: true, explanation: "Store the value." },
    { line: 4, executable: true, explanation: "Store the next reference." },
    { line: 5, executable: false, explanation: "Blank line." },
    { line: 6, executable: true, explanation: "Helper to build a list from values." },
    { line: 7, executable: true, explanation: "Start empty." },
    { line: 8, executable: true, explanation: "Prepend in reverse to keep order." },
    { line: 9, executable: true, explanation: "Create each node in front." },
    { line: 10, executable: true, explanation: "Return the head." },
    { line: 11, executable: false, explanation: "Blank line." },
    { line: 12, executable: true, explanation: "Helper to convert to a Python list." },
    { line: 13, executable: true, explanation: "Start with empty output." },
    { line: 14, executable: true, explanation: "Walk while a node exists." },
    { line: 15, executable: true, explanation: "Collect the value." },
    { line: 16, executable: true, explanation: "Advance." },
    { line: 17, executable: true, explanation: "Return values." },
    { line: 18, executable: false, explanation: "Blank line." },
    { line: 19, executable: false, explanation: "Comment: swap pairs by rewiring." },
    { line: 20, executable: true, explanation: "Define swap_pairs(head)." },
    { line: 21, executable: true, explanation: "Dummy head so the first pair's predecessor is uniform." },
    { line: 22, executable: true, explanation: "prev starts at the dummy." },
    { line: 23, executable: true, explanation: "Loop only while a full pair (two nodes) remains ahead of prev." },
    { line: 24, executable: true, explanation: "first = the first node of the pair." },
    { line: 25, executable: true, explanation: "second = the second node of the pair." },
    { line: 26, executable: true, explanation: "Point first past the pair (remember the rest before overwriting)." },
    { line: 27, executable: true, explanation: "The swap: second now points back to first." },
    { line: 28, executable: true, explanation: "Attach the node before the pair to second (the new front)." },
    { line: 29, executable: true, explanation: "Advance prev to first, now the tail of the swapped pair." },
    { line: 30, executable: true, explanation: "Return dummy.next, the new head." },
    { line: 31, executable: false, explanation: "Blank line." },
    { line: 32, executable: true, explanation: "Swap pairs of [1,2,3,4] -> [2, 1, 4, 3]." },
    { line: 33, executable: true, explanation: "Odd length [1,2,3,4,5] -> [2, 1, 4, 3, 5] (5 left in place)." },
  ],

  bindings: [
    {
      variable: "dummy",
      model: "linked-list",
      overlays: [
        { role: "pointer", label: "prev", source: "prev" },
        { role: "pointer", label: "first", source: "first" },
        { role: "pointer", label: "second", source: "second" },
      ],
    },
  ],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "Why must `first.next = second.next` run BEFORE `prev.next = second`?",
      answer: "Because we need to remember what follows the pair through first before we relink the front. If we set prev.next = second first without saving second.next, the rest of the list past the pair would be orphaned.",
      explanation: "The update order preserves reachability: capture the continuation (via first.next), perform the swap, then reattach the front. Reordering these lines loses part of the list.",
    },
  ],

  experiments: [
    "Print first, second, and prev each iteration to watch the pointers move pair by pair.",
    "Generalise to reverse the list in groups of k nodes.",
    "Compare rewiring against simply swapping the two nodes' `val` fields, and note the identity difference.",
  ],

  exercises: [
    {
      id: "llpm-complete-1",
      kind: "complete-code",
      prompt: "Fill in the three rewiring lines (in the correct order) to swap the current pair.",
      starterCode:
        "while prev.next is not None and prev.next.next is not None:\n    first = prev.next\n    second = first.next\n    # TODO: three rewiring lines\n    prev = first",
      expected:
        "while prev.next is not None and prev.next.next is not None:\n    first = prev.next\n    second = first.next\n    first.next = second.next\n    second.next = first\n    prev.next = second\n    prev = first",
      hints: [
        "Remember what follows the pair first.",
        "Then swap: second.next = first.",
        "first.next = second.next; second.next = first; prev.next = second",
      ],
    },
    {
      id: "llpm-fix-1",
      kind: "fix-mistake",
      prompt: "After swapping, this advances prev to the wrong node, corrupting the next pair. Fix it.",
      starterCode:
        "first.next = second.next\nsecond.next = first\nprev.next = second\nprev = second",
      expected:
        "first.next = second.next\nsecond.next = first\nprev.next = second\nprev = first",
      hints: [
        "After the swap, which node is the tail of the pair?",
        "second is now the front, first is the back.",
        "prev must become first, the tail of the swapped pair.",
      ],
    },
    {
      id: "llpm-predict-1",
      kind: "predict-state",
      prompt: "For [1,2,3,4,5], how many swaps happen and what is the final list?",
      expected: "2 swaps; [2, 1, 4, 3, 5]. Node 5 has no partner so it stays in place.",
      hints: [
        "Pairs are (1,2) and (3,4).",
        "5 is unpaired.",
        "The loop stops when no full pair remains.",
      ],
    },
  ],

  review: `**Pointer manipulation** reorders nodes by rewiring \`next\` references, not by moving values. Swapping adjacent pairs uses a **dummy head** and three pointers (\`prev\`, \`first\`, \`second\`), with a strict update order — capture the continuation, swap, reattach front — so no node is orphaned, then advance \`prev\` to \`first\`. The loop only proceeds when a **full pair** exists, leaving any odd node in place. It is **O(n)** time and **O(1)** space. The discipline (name pointers, order updates, use a dummy) generalises to k-group reversal and reordering.`,

  expectedOutput: "[2, 1, 4, 3]\n[2, 1, 4, 3, 5]\n",

  references: [
    {
      url: "https://leetcode.com/problems/swap-nodes-in-pairs/editorial/",
      title: "Swap Nodes in Pairs — LeetCode editorial",
      section: "Iterative approach with a dummy node",
      topic: "linked-lists/pointer-manipulation",
      purpose: "Confirm the dummy-node pair-swap rewiring, the pointer update order, and O(n) time / O(1) space.",
      verifiedClaims: [
        "Swapping nodes in pairs by relinking is O(n) time and O(1) space.",
        "A dummy head simplifies handling the first pair.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://www.geeksforgeeks.org/dsa/pairwise-swap-elements-of-a-given-linked-list-by-changing-links/",
      title: "Pairwise swap elements of a linked list by changing links — GeeksforGeeks",
      section: "Swapping by changing links (not data)",
      topic: "linked-lists/pointer-manipulation",
      purpose: "Cross-check that swapping by relinking (rather than copying values) preserves node identity and is done with a careful update order.",
      verifiedClaims: [
        "Swapping by changing links avoids copying node data and keeps node objects intact.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "fd320af46eb9c09e",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
