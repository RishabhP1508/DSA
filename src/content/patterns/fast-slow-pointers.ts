/**
 * Pattern: Fast & slow pointers.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "False\nTrue\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# Fast & slow pointers: detect a cycle in a linked list (Floyd's algorithm).
class Node:
    def __init__(self, v):
        self.val = v
        self.next = None

def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next          # one step
        fast = fast.next.next     # two steps
        if slow is fast:          # same node object -> a loop exists
            return True
    return False

a, b, c = Node(1), Node(2), Node(3)
a.next = b; b.next = c
print(has_cycle(a))   # acyclic -> False
c.next = b            # link the tail back to node 2
print(has_cycle(a))   # now a cycle -> True`;

export const fastSlowPointersPattern: PatternDefinition = {
  id: "fast-slow-pointers",
  title: "Fast & Slow Pointers",
  category: "Linked lists & sequences",
  summary:
    "Run two pointers through one sequence at different speeds to find cycles, midpoints, or the k-th-from-end in one pass with O(1) space.",

  clues: [
    "A linked list (or an implicit successor function) where you must detect a loop or find a relative position.",
    "You need the MIDDLE node, the k-th node from the END, or whether following 'next' ever repeats.",
    "Constraint: O(1) extra space (so you can't just store every node in a set).",
    "Phrases like 'detect a cycle', 'find the middle', 'happy number', 'start of the loop'.",
  ],

  naiveApproach: `Store every node (or value) you visit in a hash set and stop when you see a repeat — correct, but **O(n) extra space**. For finding the middle, a naive approach walks the list twice (count, then walk half). Both work but use more memory or passes than necessary.`,

  whyItHelps: `Advance a **slow** pointer one step and a **fast** pointer two steps. If the list is acyclic, fast runs off the end. If there's a **cycle**, fast gains one node on slow every iteration, so it eventually **laps** slow and they land on the **same node** (compared by identity, \`is\`) — detecting the loop in **O(1) space**. The same two-speed idea finds the **middle** (when fast reaches the end, slow is halfway) and the **k-th from the end** (offset fast by k first). One pass, constant memory.`,

  conditions: [
    "Compare by IDENTITY (`slow is fast`), not value — a cycle is about revisiting the same node object.",
    "The fast pointer must check both `fast` and `fast.next` before stepping twice (or it will dereference None).",
    "There is a single successor per node (a functional graph), so 'two speeds' is well-defined.",
  ],

  alternatives: [
    "Visited hash set — also detects cycles and finds the entry easily, but costs O(n) space; use it when you need the full set of visited nodes.",
    "Count-then-walk — a simple two-pass way to find the middle when O(1) space isn't required.",
    "Cycle START (not just detection) — after meeting, reset one pointer to the head and advance both by one; they meet at the entry (Floyd phase 2).",
  ],

  counterexamples: [
    "Comparing values (`slow.val == fast.val`) instead of identity can falsely report a cycle when distinct nodes share a value.",
    "Data structures with multiple successors (trees/graphs) aren't a single 'next' chain — use graph cycle detection (colors / visited) instead.",
    "If you must return the actual set of nodes in the loop, the hash-set approach is more convenient than pointers.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "False\nTrue\n",
  complexityNote:
    "O(n) time (fast traverses at most ~n nodes before meeting or ending) and O(1) space (two pointers). The hash-set alternative is O(n) time but O(n) space.",

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: Floyd's tortoise-and-hare cycle detection." },
    { line: 2, executable: true, explanation: "Define the linked-list Node class." },
    { line: 3, executable: true, explanation: "Constructor taking a value." },
    { line: 4, executable: true, explanation: "Store the value." },
    { line: 5, executable: true, explanation: "next starts as None." },
    { line: 6, executable: false, explanation: "Blank line." },
    { line: 7, executable: true, explanation: "Define has_cycle(head)." },
    { line: 8, executable: true, explanation: "Both pointers start at the head." },
    { line: 9, executable: true, explanation: "Loop while fast can take two steps (fast and fast.next exist)." },
    { line: 10, executable: true, explanation: "Slow advances one node." },
    { line: 11, executable: true, explanation: "Fast advances two nodes." },
    { line: 12, executable: true, explanation: "If they are the SAME node object, a cycle exists." },
    { line: 13, executable: true, explanation: "Report the cycle." },
    { line: 14, executable: true, explanation: "Fast reached the end: no cycle." },
    { line: 15, executable: false, explanation: "Blank line." },
    { line: 16, executable: true, explanation: "Build three nodes." },
    { line: 17, executable: true, explanation: "Link them 1 -> 2 -> 3 (acyclic)." },
    { line: 18, executable: true, explanation: "Acyclic list prints False." },
    { line: 19, executable: true, explanation: "Point node 3's next back to node 2, creating a loop." },
    { line: 20, executable: true, explanation: "Now the same list has a cycle -> True." },
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

  linkedLessons: ["linked-list-cycle-detection", "linked-list-slow-fast", "linked-list-middle"],

  exercises: [
    {
      id: "pat-fs-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Detect whether a linked list has a cycle, using O(1) extra memory.' Which pattern, and why not a hash set?",
      expected:
        "Fast & slow pointers (Floyd's). It detects the cycle in O(1) space by having fast lap slow. A visited hash set also works but uses O(n) space, which the O(1) constraint rules out.",
      correctPatternId: "fast-slow-pointers",
      hints: [
        "The O(1)-space constraint is the tell.",
        "Two pointers at speeds 1 and 2.",
        "They collide inside a loop.",
      ],
    },
    {
      id: "pat-fs-fix-1",
      kind: "fix-mistake",
      prompt:
        "This crashes with a NoneType error on even-length or acyclic lists. Fix the loop condition.",
      starterCode:
        "slow = fast = head\nwhile fast:\n    slow = slow.next\n    fast = fast.next.next\n    if slow is fast:\n        return True\nreturn False",
      expected:
        "slow = fast = head\nwhile fast and fast.next:\n    slow = slow.next\n    fast = fast.next.next\n    if slow is fast:\n        return True\nreturn False",
      hints: [
        "fast.next.next reads two links ahead.",
        "Both fast and fast.next must exist before stepping twice.",
        "Guard with `while fast and fast.next`.",
      ],
    },
    {
      id: "pat-fs-recognize-2",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Return the middle node of a singly linked list in one pass.' Which pattern?",
      expected:
        "Fast & slow pointers. When the fast pointer (two steps) reaches the end, the slow pointer (one step) is at the middle — a single O(n) pass, O(1) space.",
      correctPatternId: "fast-slow-pointers",
      hints: [
        "One pass, no length count.",
        "Fast moves twice as fast.",
        "Slow lands halfway when fast finishes.",
      ],
    },
  ],

  references: [
    {
      url: "https://en.wikipedia.org/wiki/Cycle_detection#Floyd's_tortoise_and_hare",
      title: "Cycle detection — Floyd's tortoise and hare (Wikipedia)",
      section: "Tortoise and hare; constant space",
      topic: "patterns/fast-slow-pointers",
      purpose: "Confirm the two-speed mechanism, guaranteed meeting inside a cycle, and O(1) space.",
      verifiedClaims: [
        "Two pointers at speeds 1 and 2 meet inside a cycle if one exists, using O(1) memory.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://leetcode.com/problems/linked-list-cycle/editorial/",
      title: "Linked List Cycle — LeetCode editorial",
      section: "Floyd vs hash set",
      topic: "patterns/fast-slow-pointers",
      purpose: "Cross-check the O(1)-space fast/slow method against the O(n)-space hash-set alternative.",
      verifiedClaims: [
        "Floyd's fast/slow detection is O(n) time and O(1) space; the hash-set method is O(n) space.",
      ],
      accessDate: "2026-09-20",
    },
  ],
};
