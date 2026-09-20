/**
 * Pattern: K-way merge.
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "[1, 2, 3, 4, 5, 6, 7, 8, 9]\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `import heapq

# K-way merge: combine k sorted lists using a min-heap of the current fronts.
def merge_k(lists):
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))   # (value, list index, position)
    out = []
    while heap:
        val, i, j = heapq.heappop(heap)            # smallest current front
        out.append(val)
        if j + 1 < len(lists[i]):
            heapq.heappush(heap, (lists[i][j + 1], i, j + 1))  # advance that list
    return out

print(merge_k([[1, 4, 7], [2, 5, 8], [3, 6, 9]]))`;

export const kWayMergePattern: PatternDefinition = {
  id: "k-way-merge",
  title: "K-way Merge",
  category: "Heaps & priority",
  summary:
    "Merge k sorted sequences by always taking the smallest current front from a min-heap of size k.",

  clues: [
    "You have MULTIPLE already-sorted lists/arrays/streams to combine into one sorted output.",
    "Or you need the k-th smallest across sorted rows/lists, or the smallest range covering all lists.",
    "Phrases like 'merge k sorted lists', 'kth smallest in m sorted arrays', 'smallest range covering k lists'.",
  ],

  naiveApproach: `Concatenate everything and sort — **O(N log N)** where N is the total element count, discarding the fact that each list is already sorted. Repeatedly scanning all k fronts to pick the smallest is **O(N·k)**. Both waste the existing order.`,

  whyItHelps: `Keep a **min-heap of the current front element of each list** (size ≤ k). Repeatedly pop the global minimum, append it to the output, and push the **next** element from the same list. Since each of the N elements is pushed and popped once and the heap holds at most k items, the total cost is **O(N log k)** — better than O(N log N) when k ≪ N, and it streams (you never need all data in memory at once). The heap efficiently answers 'which of the k fronts is smallest?' in O(log k).`,

  conditions: [
    "Each input sequence must already be sorted (the merge relies on it).",
    "Heap entries carry enough info to advance the right list (value, list index, position).",
    "Break ties deterministically (include the list index in the tuple to avoid comparing incomparable payloads).",
  ],

  alternatives: [
    "Pairwise merge (divide and conquer) — merge lists two at a time; also O(N log k), sometimes simpler without a heap.",
    "Concatenate + sort — fine when k is close to N or the inputs aren't reliably sorted.",
    "Top-K heap — for the k largest/smallest of ONE collection, not merging many sorted ones.",
  ],

  counterexamples: [
    "If the inputs aren't sorted, a k-way merge produces wrong output — sort them first or just sort the concatenation.",
    "'k largest elements of a single array' is the top-K pattern, not a merge.",
    "Pushing only values (not the source list/position) leaves you unable to advance the correct list.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "[1, 2, 3, 4, 5, 6, 7, 8, 9]\n",
  complexityNote:
    "O(N log k) time, where N is the total number of elements and k the number of lists (heap size ≤ k). O(k) heap space plus O(N) output.",

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "N", meaning: "the total number of elements across all lists" },
      { symbol: "k", meaning: "the number of sorted lists" },
    ],
    costModel: "A min-heap holds the current front of each list (at most k entries). Each of the N elements is popped once and pushed at most once, each O(log k).",
    time: {
      bound: "O(N log k)",
      case: "worst",
      explanation: "The heap starts with up to k fronts (lines 6-8). Then each of the N elements is popped exactly once (line 11) and its successor pushed at most once (line 14), each O(log k) since the heap size never exceeds k. So O(N log k).",
    },
    space: {
      bound: "O(k)",
      case: "worst",
      explanation: "The heap holds at most k entries (one front per list). This is auxiliary to the O(N) output.",
      inputOutputNote: "The k input lists total N elements; the merged output is O(N).",
    },
    derivation: [
      { lines: [6, 7, 8], description: "Seed the heap with up to k list fronts.", cost: "O(k log k)", dimension: "time" },
      { lines: [10, 11], description: "Pop each of the N elements once.", cost: "O(N log k)", dimension: "time" },
      { lines: [13, 14], description: "Push each successor at most once.", cost: "O(N log k)", dimension: "time" },
      { lines: [5], description: "Heap holds at most k fronts.", cost: "O(k)", dimension: "space" },
    ],
    assumptions: ["Each input list is already sorted ascending.", "The (value, list index, position) tuple breaks ties without comparing raw values ambiguously.", "Heap push/pop are O(log k)."],
    tradeoffs: "Concatenate-then-sort is O(N log N); the heap merge is O(N log k), better when k << number of elements per list. It also streams output without materialising all inputs at once.",
    counters: [{ label: "elements emitted", definition: "executions of out.append (line 12)", countLines: [12] }],
    fixedDataNote: "Merging three sorted triples emits 9 elements. The O(N log k) bound generalises.",
  },

  codeExplanations: [
    { line: 1, executable: true, explanation: "Import heapq for the min-heap." },
    { line: 2, executable: false, explanation: "Blank line." },
    { line: 3, executable: false, explanation: "Comment: merge k sorted lists via a heap of fronts." },
    { line: 4, executable: true, explanation: "Define merge_k(lists)." },
    { line: 5, executable: true, explanation: "The heap of current fronts." },
    { line: 6, executable: true, explanation: "Seed it with each non-empty list's first element." },
    { line: 7, executable: true, explanation: "Skip empty lists." },
    { line: 8, executable: true, explanation: "Push (value, list index, position 0)." },
    { line: 9, executable: true, explanation: "Output accumulator." },
    { line: 10, executable: true, explanation: "Repeatedly extract the global minimum." },
    { line: 11, executable: true, explanation: "Pop the smallest current front." },
    { line: 12, executable: true, explanation: "Append it to the merged output." },
    { line: 13, executable: true, explanation: "If that list has more elements..." },
    { line: 14, executable: true, explanation: "...push its next element to replace the consumed front." },
    { line: 15, executable: true, explanation: "Return the fully merged list." },
    { line: 16, executable: false, explanation: "Blank line." },
    { line: 17, executable: true, explanation: "Three sorted lists merge to 1..9." },
  ],

  bindings: [{ variable: "heap", model: "heap" }],

  linkedLessons: ["merge-sorted-data", "merge-sort", "linked-list-merging"],

  exercises: [
    {
      id: "pat-kwm-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Merge k sorted linked lists into one sorted list efficiently.' Which pattern, and the complexity?",
      expected:
        "K-way merge with a min-heap of the k current heads: pop the smallest, advance that list. O(N log k) time, O(k) heap space — better than concatenating and sorting (O(N log N)).",
      correctPatternId: "k-way-merge",
      hints: [
        "The inputs are already sorted.",
        "Track the smallest of k fronts.",
        "A size-k heap gives O(N log k).",
      ],
    },
    {
      id: "pat-kwm-choose-1",
      kind: "choose-approach",
      prompt:
        "You must find the k-th smallest element across m sorted rows of a matrix. K-way merge or something else?",
      expected:
        "K-way merge fits: heap the row fronts and pop k times to reach the k-th smallest (O(k log m)). (Binary-search-on-value is an alternative for large matrices.)",
      correctPatternId: "k-way-merge",
      hints: [
        "Rows are sorted.",
        "Pop the smallest front k times.",
        "Heap of row fronts.",
      ],
    },
    {
      id: "pat-kwm-fix-1",
      kind: "fix-mistake",
      prompt:
        "This heap can crash comparing equal values because it lacks a tiebreaker. Fix the tuple.",
      starterCode:
        "for i, lst in enumerate(lists):\n    if lst:\n        heapq.heappush(heap, (lst[0], lst))\n# ...pop (val, lst) and try to advance",
      expected:
        "for i, lst in enumerate(lists):\n    if lst:\n        heapq.heappush(heap, (lst[0], i, 0))\n# pop (val, i, j) and push (lists[i][j+1], i, j+1)",
      hints: [
        "Comparing lists as a tiebreaker is invalid/ambiguous.",
        "Include the list index and position instead.",
        "(value, list_index, position)",
      ],
    },
  ],

  references: [
    {
      url: "https://leetcode.com/problems/merge-k-sorted-lists/editorial/",
      title: "Merge k Sorted Lists — LeetCode editorial",
      section: "Min-heap of heads; O(N log k)",
      topic: "patterns/k-way-merge",
      purpose: "Confirm the heap-of-fronts merge and its O(N log k) time / O(k) space.",
      verifiedClaims: [
        "A min-heap of the k list heads merges k sorted lists in O(N log k) time.",
        "The heap holds at most k elements.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://docs.python.org/3/library/heapq.html#heapq.merge",
      title: "heapq.merge — Python Standard Library",
      section: "Merging sorted inputs",
      topic: "patterns/k-way-merge",
      purpose: "Cross-check that the standard library merges multiple sorted inputs lazily using a heap.",
      verifiedClaims: ["heapq.merge combines multiple already-sorted iterables into one sorted stream."],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "3adc7684c1924cc7",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
