/**
 * Lesson: Linked lists — finding the middle (slow/fast application).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "30\n3\n". Applies slow/fast to a concrete task
 * and contrasts it with the count-then-walk baseline.
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

# One-pass middle with slow/fast pointers.
def middle(head):
    slow = head
    fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
    return slow

# Two-pass baseline: count first, then walk half way.
def middle_count(head):
    n = 0
    node = head
    while node is not None:
        n += 1
        node = node.next
    node = head
    for _ in range(n // 2):
        node = node.next
    return node

print(middle(build([10, 20, 30, 40, 50])).val)  # 30 (exact middle)
print(middle_count(build([1, 2, 3, 4, 5])).val)  # 3, same node via counting`;

export const linkedListMiddle: LessonDefinition = {
  id: "linked-list-middle",
  title: "Linked Lists: Finding the Middle",
  area: "Linear structures",
  prerequisites: ["linked-list-slow-fast"],

  explanation: `**Finding the middle** of a linked list is a small task that shows off the slow/fast pattern against an honest baseline. Two solutions give the same node:

**Count-then-walk (two passes):** first traverse the whole list to count \`n\` nodes, then walk \`n // 2\` steps from the head. Simple and correct, but it reads the list **twice**.

**Slow/fast (one pass):** advance \`slow\` by one and \`fast\` by two; when \`fast\` reaches the end, \`slow\` is at the middle. Same **O(n)** time and **O(1)** space, but a **single traversal** and no need to know the length in advance — which matters when the list is a stream you can only walk once, or when you want to split the list at the middle for merge sort.

Both share the even-length **convention**: with \`fast\`/\`slow\` starting at the head and this loop, the middle of an even list is the **second** of the two central nodes. \`middle_count\` matches that because \`n // 2\` walks to the same index. The lesson's real point is recognition: when a task is defined **relative to the list's length**, the slow/fast pattern usually removes the counting pass. In the example, [10,20,30,40,50] has middle 30, and the counting method confirms 3 for [1,2,3,4,5].`,

  vocabulary: [
    { term: "Middle node", definition: "The centre node; for even length, the second of the two centre nodes by this convention." },
    { term: "One-pass", definition: "Solving with a single traversal instead of counting then walking again." },
    { term: "Two-pass baseline", definition: "Count the nodes, then walk n//2 steps — correct but reads the list twice." },
    { term: "Floor division", definition: "n // 2 rounds down; it lands on the same index the slow/fast method reaches." },
  ],

  concepts: {
    purpose:
      "Locate the centre node, e.g. to split a list for merge sort or to check a palindrome by comparing halves.",
    operations:
      "Slow/fast: slow += 1, fast += 2 until fast runs out. Count-then-walk: count n, then advance n//2.",
    uses:
      "Splitting a list into halves, palindrome checks, extracting the median position, binary-search-like partitioning of a list.",
    tradeoffs:
      "Same big-O for both; slow/fast makes one pass and needs no length. Count-then-walk is arguably easier to read.",
    commonMistakes:
      "Mismatching conventions (first vs second middle) between the two methods; wrong loop condition in slow/fast; off-by-one in n//2 (using n//2 + 1 or ceil unintentionally).",
    edgeCases:
      "Empty list returns None (slow starts as head=None; count is 0). Single node returns itself. Two nodes returns the second.",
  },

  complexity: [
    { operation: "Middle (slow/fast)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "One pass; ~n/2 fast steps." },
    { operation: "Middle (count-then-walk)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "Two passes: count n, then walk n//2." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of nodes in the list" }],
    costModel:
      "Advancing along `next` is O(1). Each iteration of either method does constant work.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation:
        "Slow/fast runs about n/2 iterations (fast moves two nodes), each constant work, so O(n). Count-then-walk does one full pass of n steps to count plus n/2 steps to walk — n + n/2 = O(n). Both are linear in the number of nodes.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation:
        "Each method keeps a fixed number of pointers/counters (slow and fast, or n and node) regardless of list length.",
      inputOutputNote: "The list is the pre-existing input; the returned node is one of its existing nodes.",
    },
    derivation: [
      { lines: [14, 15], description: "Initialise slow/fast — constant work.", cost: "O(1)", dimension: "time" },
      { lines: [16, 17, 18], description: "slow/fast loop runs ~n/2 times, constant work each.", cost: "O(n)", dimension: "time" },
      { lines: [24, 25, 26, 27], description: "Baseline counting pass visits all n nodes.", cost: "O(n)", dimension: "time" },
      { lines: [14, 15], description: "A constant number of pointers only.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: [
      "Following `next` is O(1).",
      "Even-length convention: the middle is the SECOND of the two central nodes.",
      "The list is finite and acyclic.",
    ],
    tradeoffs:
      "Slow/fast avoids a second pass and needs no length — useful for single-pass streams and for splitting during merge sort. Count-then-walk is a fine, readable alternative when a length is already known.",
    counters: [
      { label: "fast steps", definition: "executions of the fast-advance line (line 17)", countLines: [17] },
      { label: "baseline count steps", definition: "executions of the counting-loop body (line 25)", countLines: [25] },
    ],
    fixedDataNote:
      "The fixed 5-node lists give ~2 slow/fast iterations and 5 counting steps. The O(n) bound describes growth with list length.",
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
    { line: 8, executable: true, explanation: "Prepend in reverse to keep the order." },
    { line: 9, executable: true, explanation: "Create each node in front." },
    { line: 10, executable: true, explanation: "Return the head." },
    { line: 11, executable: false, explanation: "Blank line." },
    { line: 12, executable: false, explanation: "Comment: one-pass middle." },
    { line: 13, executable: true, explanation: "Define middle(head)." },
    { line: 14, executable: true, explanation: "slow starts at head." },
    { line: 15, executable: true, explanation: "fast starts at head." },
    { line: 16, executable: true, explanation: "Loop while fast can step twice." },
    { line: 17, executable: true, explanation: "Advance slow by one." },
    { line: 18, executable: true, explanation: "Advance fast by two." },
    { line: 19, executable: true, explanation: "slow is at the middle; return it." },
    { line: 20, executable: false, explanation: "Blank line." },
    { line: 21, executable: false, explanation: "Comment: two-pass baseline." },
    { line: 22, executable: true, explanation: "Define middle_count(head)." },
    { line: 23, executable: true, explanation: "Start the count at zero." },
    { line: 24, executable: true, explanation: "Begin at the head." },
    { line: 25, executable: true, explanation: "Count nodes: increment while walking." },
    { line: 26, executable: true, explanation: "Increment the count." },
    { line: 27, executable: true, explanation: "Advance to next." },
    { line: 28, executable: true, explanation: "Reset to the head for the second pass." },
    { line: 29, executable: true, explanation: "Walk n // 2 steps to the middle." },
    { line: 30, executable: true, explanation: "Advance one step." },
    { line: 31, executable: true, explanation: "Return the node at the middle index." },
    { line: 32, executable: false, explanation: "Blank line." },
    { line: 33, executable: true, explanation: "slow/fast middle of [10,20,30,40,50] -> 30." },
    { line: 34, executable: true, explanation: "count-then-walk middle of [1,2,3,4,5] -> 3." },
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
      prompt: "Both methods use the 'second middle' convention for even lengths. Which change to `middle` would make it return the FIRST middle instead?",
      answer: "Start fast at head.next (or stop one step earlier), so slow advances one fewer time.",
      explanation: "Offsetting fast by one node shifts where slow lands, giving the first of the two central nodes for even lengths.",
    },
  ],

  experiments: [
    "Use middle() to split the list into two halves and print each half.",
    "Feed an even-length list to both functions and confirm they agree on the second middle.",
    "Modify middle() to return the first middle for even lengths.",
  ],

  exercises: [
    {
      id: "llmid-complete-1",
      kind: "complete-code",
      prompt: "Complete the count-then-walk method to return the middle node.",
      starterCode:
        "def middle_count(head):\n    n = 0\n    node = head\n    while node is not None:\n        n += 1\n        node = node.next\n    node = head\n    for _ in range(n // 2):\n        # TODO: step forward\n        pass\n    return node",
      expected:
        "def middle_count(head):\n    n = 0\n    node = head\n    while node is not None:\n        n += 1\n        node = node.next\n    node = head\n    for _ in range(n // 2):\n        node = node.next\n    return node",
      hints: [
        "The second loop walks toward the middle.",
        "Move one node per step.",
        "node = node.next",
      ],
    },
    {
      id: "llmid-choose-1",
      kind: "choose-approach",
      prompt: "You receive nodes one at a time from a stream you can only read once, and must report the middle. Which method fits, and why?",
      expected: "Slow/fast — it finds the middle in a single pass without knowing the length. Count-then-walk needs a second pass over the same data, which a one-read stream doesn't allow.",
      hints: [
        "Count-then-walk reads the list twice.",
        "A stream may only be readable once.",
        "Slow/fast is single-pass.",
      ],
    },
    {
      id: "llmid-predict-1",
      kind: "predict-state",
      prompt: "For [10,20,30,40,50], how many times does the slow/fast loop run, and which node does slow end on?",
      expected: "2 iterations; slow ends on node 30.",
      hints: [
        "fast goes head->30->50, then stops.",
        "slow moves once per iteration.",
        "Two iterations: head->20->30.",
      ],
    },
  ],

  review: `**Finding the middle** has two equal-cost solutions: **count-then-walk** (two passes) and **slow/fast** (one pass). Both are **O(n)** time, **O(1)** space, and share the even-length convention of returning the **second** central node. Prefer slow/fast when you want a single pass or don't know the length — for splitting a list in merge sort or checking palindromes. In the example the middle is 30 (and 3 for the counting method).`,

  expectedOutput: "30\n3\n",

  references: [
    {
      url: "https://leetcode.com/problems/middle-of-the-linked-list/editorial/",
      title: "Middle of the Linked List — LeetCode editorial",
      section: "Fast and slow pointers; output the second middle",
      topic: "linked-lists/middle",
      purpose: "Confirm the slow/fast middle finds the second of two middles for even lengths, in one pass with O(1) space.",
      verifiedClaims: [
        "Slow/fast pointers find the middle in a single pass.",
        "For even-length lists this returns the second middle node.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://www.geeksforgeeks.org/dsa/write-a-c-function-to-print-the-middle-of-the-linked-list/",
      title: "Find the middle of a given linked list — GeeksforGeeks",
      section: "Method 2 (two pointers) vs counting",
      topic: "linked-lists/middle",
      purpose: "Cross-check the two-pointer method against the count-then-walk baseline.",
      verifiedClaims: [
        "The two-pointer method reaches the middle when the fast pointer reaches the end.",
        "A counting method (length, then walk half) yields the same middle.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "458d935e3cb832ea",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
