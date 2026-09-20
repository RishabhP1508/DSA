/**
 * Lesson: Linked lists — cycle detection (Floyd's algorithm).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "False\nTrue\n2\n". Shows the linked-list
 * visualizer with slow/fast overlays meeting inside a cycle.
 */

import type { LessonDefinition } from "../../core/types";

const code = `class Node:
    def __init__(self, val, nxt=None):
        self.val = val
        self.next = nxt

# Floyd's cycle detection: do slow and fast ever meet?
def has_cycle(head):
    slow = head
    fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:          # same node object -> a loop exists
            return True
    return False

# Find where the cycle begins (Floyd phase 2).
def cycle_start(head):
    slow = fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            p = head
            while p is not slow:  # move both one step until they meet
                p = p.next
                slow = slow.next
            return p
    return None

a = Node(1); b = Node(2); c = Node(3); d = Node(4)
a.next = b; b.next = c; c.next = d
print(has_cycle(a))               # acyclic -> False
d.next = b                        # link 4 back to 2 -> cycle
print(has_cycle(a))               # now True
print(cycle_start(a).val)         # cycle begins at node 2`;

export const linkedListCycleDetection: LessonDefinition = {
  id: "linked-list-cycle-detection",
  title: "Linked Lists: Cycle Detection",
  area: "Linear structures",
  prerequisites: ["linked-list-slow-fast"],

  explanation: `A linked list has a **cycle** when some node's \`next\` points back to an earlier node, so following \`next\` forever never reaches \`None\`. A plain traversal on such a list is an **infinite loop**. **Floyd's cycle-detection algorithm** (the tortoise and hare) detects this using the slow/fast idea from the previous lesson, in **O(1) extra space**.

**The idea:** move \`slow\` one node and \`fast\` two nodes per step. If the list is acyclic, fast simply falls off the end and we return \`False\`. If there is a cycle, both pointers eventually enter the loop, and because fast gains **one node per step** on slow inside the loop, fast is guaranteed to **catch up and land on the exact same node** — \`slow is fast\` becomes true. Note the use of \`is\`, not \`==\`: we compare **node identity**, not stored values.

**Finding where the cycle starts** (phase 2) uses a classic fact: after the meeting point, if you place one pointer back at the **head** and move both **one step at a time**, they meet at the **entry of the cycle**. This works because the distance from the head to the cycle entry equals the distance from the meeting point to the entry (mod the loop length). In the example, node 4 links back to node 2, so \`has_cycle\` flips from \`False\` to \`True\` and \`cycle_start\` reports node **2**. The alternative — storing every visited node in a set — also detects cycles but costs **O(n)** space; Floyd's is the O(1)-space answer.`,

  vocabulary: [
    { term: "Cycle", definition: "A next-reference chain that loops back to an earlier node, so it never reaches None." },
    { term: "Floyd's algorithm", definition: "Tortoise-and-hare cycle detection using two pointers at speeds 1 and 2." },
    { term: "Meeting point", definition: "The node where slow and fast collide inside the cycle." },
    { term: "Cycle entry", definition: "The first node of the loop; found by phase 2 walking from head and meeting point together." },
    { term: "Identity vs equality", definition: "`is` compares whether two names refer to the same object; `==` compares values." },
  ],

  concepts: {
    purpose:
      "Decide whether a linked list contains a cycle (and where it begins) without infinite looping and without extra memory proportional to the list.",
    operations:
      "Advance slow by 1, fast by 2; a collision (slow is fast) proves a cycle. Phase 2 walks head and meeting point one step at a time to the entry.",
    uses:
      "Detecting corrupted/looping pointer structures, finding the start of a repeating sequence, the 'find the duplicate number' trick that models an array as a functional graph.",
    tradeoffs:
      "O(1) space versus the O(n)-space visited-set method; slightly subtler to reason about, but avoids allocation.",
    commonMistakes:
      "Comparing values with `==` instead of identity with `is`; using only `fast is not None` in the condition (crashes on `fast.next.next`); returning True as soon as pointers are equal at the very start without stepping first.",
    edgeCases:
      "Empty or single acyclic node returns False. A node whose next points to itself is a length-1 cycle. Two nodes pointing at each other form a length-2 cycle.",
  },

  complexity: [
    { operation: "Detect cycle (Floyd)", best: "O(1)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "Best: cycle found immediately; worst: scan the whole list. Two pointers only." },
    { operation: "Detect cycle (visited set)", best: "O(1)", average: "O(n)", worst: "O(n)", space: "O(n)", note: "Same time but stores every seen node." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of distinct nodes reachable from the head" }],
    costModel:
      "Advancing along `next` and comparing identities are O(1). Each iteration does a constant number of such operations.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation:
        "If the list is acyclic, fast reaches the end in about n/2 iterations. If there is a cycle, both pointers enter the loop within n steps and, since fast closes the gap by one node per iteration, they meet within one more loop-length — still O(n) total. Phase 2's second walk is at most n more steps. So detection is O(n).",
      otherCases: [
        { case: "best", bound: "O(1)", note: "A tiny cycle near the head can be found in a constant number of steps." },
      ],
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation:
        "Only the pointers slow, fast (and p in phase 2) are stored, independent of n. Nothing that grows with the list is allocated.",
      inputOutputNote: "The list itself is the input and is not counted; the boolean/node result is O(1).",
    },
    derivation: [
      { lines: [8, 9], description: "Initialise both pointers — constant work once.", cost: "O(1)", dimension: "time" },
      { lines: [10, 11, 12, 13], description: "Loop runs O(n) times; each step advances the pointers and checks identity (constant work).", cost: "O(n)", dimension: "time" },
      { lines: [8, 9], description: "Two pointers only, no per-node storage.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: [
      "Following `next` is O(1).",
      "`slow is fast` compares node identity, not value.",
      "In a cycle, fast gains exactly one node on slow per iteration, so they are guaranteed to meet.",
    ],
    tradeoffs:
      "The visited-set method is equally O(n) time but O(n) space; Floyd's trades a little cleverness for constant space. When you also need the exact set of cycle nodes, the set method can be more convenient.",
    counters: [
      { label: "loop iterations", definition: "executions of the has_cycle loop body (lines 11-13)", countLines: [11] },
      { label: "identity checks", definition: "executions of the `slow is fast` test (line 13)", countLines: [13] },
    ],
    fixedDataNote:
      "The fixed example first tests an acyclic 4-node list (False), then links node 4 back to node 2 (True) and reports the entry (node 2). The O(n) bound describes growth as the list and cycle lengthen.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Define the Node class." },
    { line: 2, executable: true, explanation: "Constructor storing value and optional next." },
    { line: 3, executable: true, explanation: "Store the value." },
    { line: 4, executable: true, explanation: "Store the next reference." },
    { line: 5, executable: false, explanation: "Blank line." },
    { line: 6, executable: false, explanation: "Comment: describe Floyd's detection." },
    { line: 7, executable: true, explanation: "Define has_cycle(head)." },
    { line: 8, executable: true, explanation: "Slow pointer starts at head." },
    { line: 9, executable: true, explanation: "Fast pointer starts at head." },
    { line: 10, executable: true, explanation: "Loop while fast can take two steps." },
    { line: 11, executable: true, explanation: "Advance slow by one node." },
    { line: 12, executable: true, explanation: "Advance fast by two nodes." },
    { line: 13, executable: true, explanation: "If the two pointers are the same node object, a cycle exists." },
    { line: 14, executable: true, explanation: "Report the cycle." },
    { line: 15, executable: true, explanation: "Fast reached the end: no cycle." },
    { line: 16, executable: false, explanation: "Blank line." },
    { line: 17, executable: false, explanation: "Comment: phase 2 finds the cycle entry." },
    { line: 18, executable: true, explanation: "Define cycle_start(head)." },
    { line: 19, executable: true, explanation: "Both pointers start at head." },
    { line: 20, executable: true, explanation: "Loop while fast can step twice." },
    { line: 21, executable: true, explanation: "Advance slow by one." },
    { line: 22, executable: true, explanation: "Advance fast by two." },
    { line: 23, executable: true, explanation: "On collision, begin phase 2." },
    { line: 24, executable: true, explanation: "Put a fresh pointer p at the head." },
    { line: 25, executable: true, explanation: "Move p and slow together until they meet..." },
    { line: 26, executable: true, explanation: "...advance p by one..." },
    { line: 27, executable: true, explanation: "...and slow by one." },
    { line: 28, executable: true, explanation: "Their meeting point is the cycle entry; return it." },
    { line: 29, executable: true, explanation: "No cycle: return None." },
    { line: 30, executable: false, explanation: "Blank line." },
    { line: 31, executable: true, explanation: "Create four separate nodes." },
    { line: 32, executable: true, explanation: "Link them 1 -> 2 -> 3 -> 4 (acyclic)." },
    { line: 33, executable: true, explanation: "Acyclic list -> prints False." },
    { line: 34, executable: true, explanation: "Point node 4's next back to node 2, creating a cycle." },
    { line: 35, executable: true, explanation: "Now a cycle exists -> prints True." },
    { line: 36, executable: true, explanation: "Phase 2 reports the entry node's value -> 2." },
  ],

  bindings: [
    {
      variable: "a",
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
      prompt: "Why does the code use `slow is fast` rather than `slow == fast`?",
      answer: "Because we must compare node identity — whether the two pointers reference the same node object — not whether two nodes happen to store equal values.",
      explanation: "Two different nodes can hold equal values, which would make `==` (if defined on values) misleading. `is` asks 'the same object?', which is exactly the cycle condition.",
    },
  ],

  experiments: [
    "Make a node point to itself and confirm has_cycle returns True.",
    "Replace Floyd's with a visited set and compare the space use.",
    "Print slow and fast positions each step to watch fast lap slow inside the loop.",
  ],

  exercises: [
    {
      id: "llcd-complete-1",
      kind: "complete-code",
      prompt: "Complete has_cycle so it returns True exactly when a cycle exists.",
      starterCode:
        "def has_cycle(head):\n    slow = fast = head\n    while fast is not None and fast.next is not None:\n        slow = slow.next\n        fast = fast.next.next\n        # TODO: detect the collision\n    return False",
      expected:
        "def has_cycle(head):\n    slow = fast = head\n    while fast is not None and fast.next is not None:\n        slow = slow.next\n        fast = fast.next.next\n        if slow is fast:\n            return True\n    return False",
      hints: [
        "A cycle means the fast pointer eventually equals the slow one.",
        "Compare identity with `is`.",
        "if slow is fast: return True",
      ],
    },
    {
      id: "llcd-choose-1",
      kind: "choose-approach",
      prompt: "You must detect a cycle in a list that may have millions of nodes, with tight memory limits. Floyd's two pointers or a visited set — and why?",
      expected: "Floyd's algorithm: O(n) time like the set method but O(1) space, so it fits tight memory. The visited set is O(n) space, which may be too much at scale.",
      hints: [
        "Both are O(n) time.",
        "They differ in space.",
        "Tight memory favours the O(1)-space pointer method.",
      ],
    },
    {
      id: "llcd-predict-1",
      kind: "predict-state",
      prompt: "In the example, after `d.next = b`, what does `cycle_start(a).val` print and why?",
      expected: "2 — the cycle begins at node 2, where node 4's next now points.",
      hints: [
        "Node 4 links back to node 2.",
        "The entry is the first node that is part of the loop.",
        "Phase 2 walks from head and meeting point to that entry: node 2.",
      ],
    },
  ],

  review: `A **cycle** makes plain traversal loop forever. **Floyd's algorithm** detects one by moving \`slow\` by one and \`fast\` by two; a collision (\`slow is fast\`, by **identity**) proves a loop, in **O(n)** time and **O(1)** space. Phase 2 finds the cycle's **entry** by walking a pointer from the head and one from the meeting point together. The visited-set alternative is also O(n) time but O(n) space. In the example the entry is node **2**.`,

  expectedOutput: "False\nTrue\n2\n",

  references: [
    {
      url: "https://en.wikipedia.org/wiki/Cycle_detection#Floyd's_tortoise_and_hare",
      title: "Cycle detection — Floyd's tortoise and hare (Wikipedia)",
      section: "Floyd's tortoise and hare; finding the cycle start",
      topic: "linked-lists/cycle-detection",
      purpose: "Confirm the detection mechanism, the guaranteed meeting inside a cycle, and the phase-2 method for locating the cycle entry.",
      verifiedClaims: [
        "Two pointers at speeds 1 and 2 meet inside a cycle if one exists.",
        "Restarting one pointer at the start and advancing both by one locates the cycle's beginning.",
        "The algorithm uses constant extra memory.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://www.geeksforgeeks.org/dsa/detect-loop-in-a-linked-list/",
      title: "Detect loop or cycle in a linked list — GeeksforGeeks",
      section: "Floyd's cycle-finding algorithm",
      topic: "linked-lists/cycle-detection",
      purpose: "Cross-check the O(n)-time / O(1)-space detection and contrast it with the hashing (visited-set) approach.",
      verifiedClaims: [
        "Floyd's method detects a loop in O(n) time and O(1) space.",
        "A hash-set approach also works but uses O(n) space.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "71a5f01f943e637a",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
