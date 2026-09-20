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
    "Phrases like 'reverse the list', 'reverse nodes between positions', 'reverse in k-groups', 'reorder list'.",
  ],

  naiveApproach: `Copy the node values into an array, reverse the array, and write them back — **O(n) extra space**. Or push nodes onto a stack and pop them — also **O(n)** space. Both ignore that a linked list can be reversed by only **relinking pointers**, no extra storage.`,

  whyItHelps: `Reversal is pointer surgery: walk the list keeping a handle on the **previous** node and, for each node, point its \`next\` **backwards** before advancing. That reverses a whole list in one pass with just a few pointers — **O(n) time, O(1) space**. For a **sublist** (positions p..q), a **dummy head** removes head edge cases: walk to the node before p, then repeatedly **splice** the node after \`curr\` to the front of the reversing section. The nodes are reused; only links change.`,

  conditions: [
    "You may mutate the list in place (reuse existing nodes).",
    "Track the node BEFORE the reversing section (a dummy head makes reversing from position 1 uniform).",
    "For k-group reversal, only reverse a full group; leftover nodes stay as-is (state that convention).",
  ],

  alternatives: [
    "Recursion — elegant for full reversal but uses O(n) stack space; the iterative version is O(1).",
    "Value copy / stack — simpler to write but O(n) space and it breaks node identity (bad if other refs point at nodes).",
    "Two-pointer collection then rebuild — unnecessary when in-place relinking is allowed.",
  ],

  counterexamples: [
    "Swapping node VALUES instead of relinking works for a plain reverse but breaks any external references to nodes and doesn't generalize to structural moves.",
    "Reversing without tracking the node before the sublist mangles the connection back to the unchanged prefix.",
    "Reversing a partial (incomplete) k-group when the problem says to leave leftovers untouched.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "[1, 4, 3, 2, 5]\n",
  complexityNote:
    "O(n) time (each node in the reversed section is relinked once) and O(1) extra space (a handful of pointers; nodes are reused).",

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of nodes in the list" },
      { symbol: "q", meaning: "the end position of the reversed section (1-based)" },
    ],
    costModel: "Walk to the node before position p (O(p)), then splice each of the q−p following nodes to the front of the sublist with a constant number of pointer updates.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "Walking to position p (lines 23-24) is O(p). The splice loop (lines 26-30) runs q−p times, each doing a constant number of pointer reassignments. Since p and q are within the list, total work is O(q) ≤ O(n).",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "Only a few pointers (dummy, prev, curr, nxt) are used; the existing nodes are relinked, not copied.",
      inputOutputNote: "The linked list is modified in place and its head returned; no new nodes for the reversal.",
    },
    derivation: [
      { lines: [23, 24], description: "Walk to the node before position p.", cost: "O(p)", dimension: "time" },
      { lines: [26, 27, 28, 29, 30], description: "Splice each of the q−p nodes to the front — O(1) each.", cost: "O(q−p)", dimension: "time" },
      { lines: [21, 22, 25], description: "A constant number of pointers.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["1 <= p <= q <= n (valid positions).", "The dummy head avoids special-casing reversal that includes the head.", "Following/reassigning .next is O(1)."],
    tradeoffs: "Copying values into a list, reversing, and writing back is also O(n) time but O(n) space; in-place pointer splicing keeps O(1) space.",
    counters: [{ label: "splices", definition: "executions of the splice step (line 30)", countLines: [30] }],
    fixedDataNote: "Reversing positions 2..4 of [1,2,3,4,5] gives [1,4,3,2,5] via 3 splices. The O(n) bound generalises.",
  },

  codeExplanations: [
    { line: 1, executable: true, explanation: "Define the Node class (value + next)." },
    { line: 2, executable: true, explanation: "Constructor." },
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
    { line: 13, executable: true, explanation: "Accumulator." },
    { line: 14, executable: true, explanation: "Walk the list." },
    { line: 15, executable: true, explanation: "Collect each value." },
    { line: 16, executable: true, explanation: "Advance." },
    { line: 17, executable: true, explanation: "Return the values." },
    { line: 18, executable: false, explanation: "Blank line." },
    { line: 19, executable: false, explanation: "Comment: reverse the sublist p..q in place." },
    { line: 20, executable: true, explanation: "Define reverse_between(head, p, q)." },
    { line: 21, executable: true, explanation: "Dummy head so reversing from position 1 needs no special case." },
    { line: 22, executable: true, explanation: "prev will sit just before position p." },
    { line: 23, executable: true, explanation: "Walk prev forward p-1 steps..." },
    { line: 24, executable: true, explanation: "...to the node before the sublist." },
    { line: 25, executable: true, explanation: "curr is the first node of the sublist (stays put, drifts to the end)." },
    { line: 26, executable: true, explanation: "Repeat q-p times: pull each following node to the sublist's front." },
    { line: 27, executable: true, explanation: "Remember the node to move." },
    { line: 28, executable: true, explanation: "Unlink it from after curr." },
    { line: 29, executable: true, explanation: "Point it at the current front of the sublist." },
    { line: 30, executable: true, explanation: "Attach it right after prev (new front)." },
    { line: 31, executable: true, explanation: "Return the (possibly unchanged) head via the dummy." },
    { line: 32, executable: false, explanation: "Blank line." },
    { line: 33, executable: true, explanation: "Reversing positions 2..4 of 1->2->3->4->5 gives [1, 4, 3, 2, 5]." },
  ],

  bindings: [
    {
      variable: "dummy",
      model: "linked-list",
      overlays: [
        { role: "pointer", label: "prev", source: "prev" },
        { role: "pointer", label: "curr", source: "curr" },
      ],
    },
  ],

  linkedLessons: ["linked-list-reversal", "linked-list-pointer-manipulation", "linked-list-dummy-nodes"],

  exercises: [
    {
      id: "pat-iplr-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Reverse a singly linked list using O(1) extra memory.' Which pattern, and why not a stack?",
      expected:
        "In-place linked-list reversal: relink each node's next to its predecessor in one pass — O(n) time, O(1) space. A stack would reverse it too but costs O(n) extra space, violating the constraint.",
      correctPatternId: "in-place-linkedlist-reversal",
      hints: [
        "The O(1)-space constraint is the tell.",
        "Reverse by relinking pointers, not copying.",
        "Keep prev/curr/next.",
      ],
    },
    {
      id: "pat-iplr-choose-1",
      kind: "choose-approach",
      prompt:
        "'Reverse the nodes of a list in groups of k (leaving a trailing partial group as-is).' Same pattern?",
      expected:
        "Yes — in-place reversal generalized to k-groups: reverse each full k-node group by relinking, connecting groups as you go, and leave an incomplete final group untouched. Still O(n) time, O(1) space.",
      correctPatternId: "in-place-linkedlist-reversal",
      hints: [
        "It's the same relinking, applied per group.",
        "Only reverse full groups.",
        "Reconnect each reversed group to the previous one.",
      ],
    },
    {
      id: "pat-iplr-fix-1",
      kind: "fix-mistake",
      prompt:
        "This full-list reversal returns the wrong head. Fix the return value.",
      starterCode:
        "prev = None\ncurr = head\nwhile curr:\n    nxt = curr.next\n    curr.next = prev\n    prev = curr\n    curr = nxt\nreturn head",
      expected:
        "prev = None\ncurr = head\nwhile curr:\n    nxt = curr.next\n    curr.next = prev\n    prev = curr\n    curr = nxt\nreturn prev",
      hints: [
        "After the loop, head is the old first node (now the tail).",
        "prev is the new head.",
        "return prev",
      ],
    },
  ],

  references: [
    {
      url: "https://leetcode.com/problems/reverse-linked-list-ii/editorial/",
      title: "Reverse Linked List II — LeetCode editorial",
      section: "In-place sublist reversal with a dummy head",
      topic: "patterns/in-place-linkedlist-reversal",
      purpose: "Confirm the dummy-head splice technique for reversing a sublist in O(1) space.",
      verifiedClaims: [
        "A sublist can be reversed in place by repeatedly splicing the following node to the sublist's front.",
        "A dummy head removes the special case of reversing from the first position.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://www.geeksforgeeks.org/dsa/reverse-a-linked-list/",
      title: "Reverse a Linked List — GeeksforGeeks",
      section: "Iterative three-pointer reversal",
      topic: "patterns/in-place-linkedlist-reversal",
      purpose: "Cross-check the iterative O(n)/O(1) full-list reversal and that iterative avoids the recursive O(n) stack.",
      verifiedClaims: ["Iterative reversal relinks pointers in O(n) time and O(1) space."],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 15,
    contentHash: "b74287905f753e30",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
