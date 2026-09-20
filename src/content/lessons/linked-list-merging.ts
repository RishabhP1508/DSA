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
  prerequisites: ["linked-list-traversal", "linked-list-dummy-nodes"],

  explanation: `**Merging** two already-sorted linked lists produces one sorted list. It is the "combine" step of merge sort, and on linked lists it is especially clean because you never shift elements — you just **relink existing nodes** in the right order.

Walk both lists with pointers \`a\` and \`b\`. Repeatedly compare their front nodes and **splice the smaller one** onto the result, then advance that list. A **dummy head** node removes an annoying special case: without it, the very first node needs different handling than the rest. With the dummy, \`tail\` always points at the last node of the growing result, so appending is uniform, and the real answer is \`dummy.next\`. When one list runs out, the other is already sorted, so you **attach the remainder in one link** rather than copying it node by node.

Using \`<=\` (not \`<\`) keeps the merge **stable**: equal values keep their original relative order (nodes from \`a\` come before equal nodes from \`b\`). Merging is **O(n + m)** time — each node of both lists is touched once — and **O(1)** extra space, because we reuse the input nodes rather than allocating new ones. In the example, [1,3,5] and [2,4,6] merge to [1,2,3,4,5,6].`,

  vocabulary: [
    { term: "Merge", definition: "Combining two sorted sequences into one sorted sequence." },
    { term: "Dummy head", definition: "A throwaway node before the real first node so appending needs no special case." },
    { term: "tail pointer", definition: "A pointer to the last node of the result so far, where the next node is attached." },
    { term: "Splice", definition: "Relinking an existing node into a new position by changing next references." },
    { term: "Stable merge", definition: "Preserving the original relative order of equal elements (achieved with <=)." },
  ],

  concepts: {
    purpose:
      "Combine two sorted lists into one sorted list in linear time without allocating new nodes; the merge step of linked-list merge sort.",
    operations:
      "Compare fronts, splice the smaller onto tail, advance that list and tail; attach the leftover list at the end.",
    uses:
      "Merge sort on linked lists, merging k sorted lists (pairwise or with a heap), combining sorted streams.",
    tradeoffs:
      "O(1) space by reusing nodes; the dummy head simplifies the code. Requires both inputs to already be sorted.",
    commonMistakes:
      "Forgetting to attach the remaining list (drops the tail); allocating new nodes instead of splicing (wastes O(n+m) space); using `<` and losing stability for equal keys; returning dummy instead of dummy.next.",
    edgeCases:
      "Either list empty: the loop is skipped and the other list is attached whole. Equal fronts: <= takes from `a` first. Both empty: returns None.",
  },

  complexity: [
    { operation: "Merge two sorted lists", best: "O(n + m)", average: "O(n + m)", worst: "O(n + m)", space: "O(1)", note: "Each node visited once; remainder attached in O(1). Nodes reused." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of nodes in list a" },
      { symbol: "m", meaning: "the number of nodes in list b" },
    ],
    costModel:
      "Comparing two node values and relinking a `next` reference are O(1). Each loop iteration consumes one node from a or b.",
    time: {
      bound: "O(n + m)",
      case: "worst",
      explanation:
        "Each iteration removes exactly one node from the front of a or b and appends it, so after at most n + m iterations one list is empty. Attaching the remaining list is a single pointer assignment, O(1). Total work is proportional to n + m.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation:
        "Only the dummy node and the pointers dummy, tail, a, b are used. The result reuses the input nodes, so no storage grows with n + m.",
      inputOutputNote:
        "The two input lists (n + m nodes) already exist; the merged list is those same nodes relinked, so it isn't extra space.",
    },
    derivation: [
      { lines: [21, 22], description: "Create the dummy and tail pointer — constant work once.", cost: "O(1)", dimension: "time" },
      { lines: [23, 24, 25, 26, 27, 28, 29, 30], description: "Loop runs at most n + m times; each iteration splices one node (constant work).", cost: "O(n + m)", dimension: "time" },
      { lines: [31], description: "Attach the leftover list with one pointer assignment.", cost: "O(1)", dimension: "time" },
      { lines: [21], description: "One dummy node plus a fixed set of pointers.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: [
      "Both input lists are already sorted ascending.",
      "Relinking `next` and comparing values are O(1).",
      "Using <= keeps the merge stable (a's equal nodes precede b's).",
    ],
    tradeoffs:
      "Building a new list by copying values would also be O(n+m) time but O(n+m) space; splicing reuses nodes for O(1) space. Array merging is comparable in time but must allocate the output array.",
    counters: [
      { label: "nodes spliced", definition: "executions of the tail-advance line (line 30)", countLines: [30] },
      { label: "comparisons", definition: "executions of the comparison (line 24)", countLines: [24] },
    ],
    fixedDataNote:
      "The fixed inputs [1,3,5] and [2,4,6] splice 6 nodes in total. The O(n + m) bound describes how the work scales with the two list sizes.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Define the Node class." },
    { line: 2, executable: true, explanation: "Constructor storing value and optional next." },
    { line: 3, executable: true, explanation: "Store the value." },
    { line: 4, executable: true, explanation: "Store the next reference." },
    { line: 5, executable: false, explanation: "Blank line." },
    { line: 6, executable: true, explanation: "Helper to build a list from a Python list of values." },
    { line: 7, executable: true, explanation: "Start empty." },
    { line: 8, executable: true, explanation: "Prepend values in reverse so the order is preserved." },
    { line: 9, executable: true, explanation: "Create each node pointing at the current head." },
    { line: 10, executable: true, explanation: "Return the built head." },
    { line: 11, executable: false, explanation: "Blank line." },
    { line: 12, executable: true, explanation: "Helper to convert a list to a Python list for printing." },
    { line: 13, executable: true, explanation: "Start with an empty output." },
    { line: 14, executable: true, explanation: "Walk while a node exists." },
    { line: 15, executable: true, explanation: "Collect the value." },
    { line: 16, executable: true, explanation: "Advance." },
    { line: 17, executable: true, explanation: "Return the values." },
    { line: 18, executable: false, explanation: "Blank line." },
    { line: 19, executable: false, explanation: "Comment: merge by splicing nodes." },
    { line: 20, executable: true, explanation: "Define merge(a, b)." },
    { line: 21, executable: true, explanation: "Create a dummy head so the first append needs no special case." },
    { line: 22, executable: true, explanation: "tail tracks the last node of the result; start it at the dummy." },
    { line: 23, executable: true, explanation: "Loop while both lists still have nodes." },
    { line: 24, executable: true, explanation: "Compare the front values; <= keeps the merge stable." },
    { line: 25, executable: true, explanation: "Attach a's front to the result." },
    { line: 26, executable: true, explanation: "Advance a." },
    { line: 27, executable: false, explanation: "Otherwise b's front is smaller." },
    { line: 28, executable: true, explanation: "Attach b's front to the result." },
    { line: 29, executable: true, explanation: "Advance b." },
    { line: 30, executable: true, explanation: "Move tail to the node just attached." },
    { line: 31, executable: true, explanation: "One list is empty; attach the entire remaining list in one link." },
    { line: 32, executable: true, explanation: "Return dummy.next, the real merged head." },
    { line: 33, executable: false, explanation: "Blank line." },
    { line: 34, executable: true, explanation: "Merge [1,3,5] and [2,4,6]." },
    { line: 35, executable: true, explanation: "Print the merged result [1, 2, 3, 4, 5, 6]." },
  ],

  bindings: [
    {
      variable: "m",
      model: "linked-list",
      overlays: [
        { role: "pointer", label: "tail", source: "tail" },
        { role: "pointer", label: "a", source: "a" },
        { role: "pointer", label: "b", source: "b" },
      ],
    },
  ],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "What does the dummy head buy us here that a plain `head = None` would not?",
      answer: "It removes the special case for attaching the very first node: tail = dummy is always valid, so `tail.next = ...` works uniformly, and the answer is dummy.next.",
      explanation: "Without the dummy you'd need an `if result is None` branch to set the head on the first append. The dummy makes every append identical.",
    },
  ],

  experiments: [
    "Merge a list with an empty list and confirm the non-empty one is attached whole.",
    "Change <= to < and construct inputs with equal keys to see stability change.",
    "Extend to merge three lists by merging two, then merging the result with the third.",
  ],

  exercises: [
    {
      id: "llm-complete-1",
      kind: "complete-code",
      prompt: "Complete the merge loop body so the smaller front node is spliced each time.",
      starterCode:
        "while a is not None and b is not None:\n    if a.val <= b.val:\n        # TODO: attach a, advance a\n        pass\n    else:\n        # TODO: attach b, advance b\n        pass\n    tail = tail.next",
      expected:
        "while a is not None and b is not None:\n    if a.val <= b.val:\n        tail.next = a\n        a = a.next\n    else:\n        tail.next = b\n        b = b.next\n    tail = tail.next",
      hints: [
        "Attach the chosen node with tail.next = ...",
        "Then advance that list's pointer.",
        "tail.next = a; a = a.next  (and the symmetric case for b)",
      ],
    },
    {
      id: "llm-fix-1",
      kind: "fix-mistake",
      prompt: "This merge drops the tail of whichever list is longer. Add the missing step.",
      starterCode:
        "while a is not None and b is not None:\n    if a.val <= b.val:\n        tail.next = a; a = a.next\n    else:\n        tail.next = b; b = b.next\n    tail = tail.next\n# bug: nothing attaches the leftover list\nreturn dummy.next",
      expected:
        "while a is not None and b is not None:\n    if a.val <= b.val:\n        tail.next = a; a = a.next\n    else:\n        tail.next = b; b = b.next\n    tail = tail.next\ntail.next = a if a is not None else b\nreturn dummy.next",
      hints: [
        "When the loop ends, one list may still have nodes.",
        "Those remaining nodes are already sorted.",
        "tail.next = a if a is not None else b",
      ],
    },
    {
      id: "llm-predict-1",
      kind: "predict-state",
      prompt: "Merging [1,3,5] and [2,4,6], how many loop iterations run before one list empties, and what remains to be attached?",
      expected: "5 iterations; after picking 1,2,3,4,5 the list a is empty and node 6 (from b) is attached by the final link.",
      hints: [
        "Each iteration consumes one node.",
        "The loop stops when a or b is None.",
        "After 5 picks, a is empty and 6 remains in b.",
      ],
    },
  ],

  review: `**Merging** two sorted lists relinks existing nodes into one sorted list. A **dummy head** makes every append uniform (\`tail\` tracks the end), so the answer is \`dummy.next\`. Compare fronts, splice the smaller with \`<=\` for **stability**, then attach the leftover list in **one link**. It is **O(n + m)** time and **O(1)** space by reusing nodes. Don't forget the remainder attach, and return \`dummy.next\` (not \`dummy\`).`,

  expectedOutput: "[1, 2, 3, 4, 5, 6]\n",

  references: [
    {
      url: "https://leetcode.com/problems/merge-two-sorted-lists/editorial/",
      title: "Merge Two Sorted Lists — LeetCode editorial",
      section: "Iterative approach with a sentinel/dummy node",
      topic: "linked-lists/merging",
      purpose: "Confirm the dummy-head splice technique, attaching the remainder, and O(n + m) time / O(1) space.",
      verifiedClaims: [
        "A sentinel (dummy) node avoids special-casing the head.",
        "Merging two sorted lists is O(n + m) time and O(1) space by relinking nodes.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://www.geeksforgeeks.org/dsa/merge-two-sorted-linked-lists/",
      title: "Merge two sorted linked lists — GeeksforGeeks",
      section: "Using a dummy node",
      topic: "linked-lists/merging",
      purpose: "Cross-check the comparison-and-splice loop and remainder handling.",
      verifiedClaims: [
        "Compare heads, attach the smaller, advance; then attach the non-empty remainder.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "e4e259574923bb05",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
