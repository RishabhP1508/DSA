/**
 * Lesson: Heap sift-up / sift-down mechanics (Heaps). Verified on the bundled
 * CPython 3.14.2. Teaches the INTERNAL swap machinery that heapq hides — the
 * explicit sift-up (on insert) and sift-down (on remove) with concrete arrays,
 * the 0-based parent/child index formulas, and the swap-by-swap state sequence.
 *
 * Output (exact):
 * "after append: [1, 3, 2, 7, 4, 5, 0]\n
 *  sift-up swap: [1, 3, 0, 7, 4, 5, 2]\n
 *  sift-up swap: [0, 3, 1, 7, 4, 5, 2]\n
 *  after sift-up: [0, 3, 1, 7, 4, 5, 2]\n
 *  moved last to root: [2, 3, 1, 7, 4, 5]\n
 *  sift-down swap: [1, 3, 2, 7, 4, 5]\n
 *  after sift-down: [1, 3, 2, 7, 4, 5]\n"
 */

import type { LessonDefinition } from "../../core/types";

const code = `# A binary heap is stored 0-based: parent(i) = (i-1)//2, children = 2i+1, 2i+2.
def sift_up(heap, i):
    # Bubble the value at index i toward the root while it is smaller than its parent.
    while i > 0:
        parent = (i - 1) // 2
        if heap[i] < heap[parent]:
            heap[i], heap[parent] = heap[parent], heap[i]   # swap up
            print("sift-up swap:", heap)
            i = parent
        else:
            break

def sift_down(heap, i, size):
    # Sink the value at index i toward the leaves while a child is smaller.
    while True:
        left = 2 * i + 1
        right = 2 * i + 2
        smallest = i
        if left < size and heap[left] < heap[smallest]:
            smallest = left
        if right < size and heap[right] < heap[smallest]:
            smallest = right
        if smallest == i:
            break
        heap[i], heap[smallest] = heap[smallest], heap[i]   # swap down
        print("sift-down swap:", heap)
        i = smallest

# Start from a valid min-heap, then INSERT 0 at the end and sift it up.
heap = [1, 3, 2, 7, 4, 5]
heap.append(0)
print("after append:", heap)
sift_up(heap, len(heap) - 1)
print("after sift-up:", heap)

# Now REMOVE the min: move the last element to the root and sift it down.
last = heap.pop()
heap[0] = last
print("moved last to root:", heap)
sift_down(heap, 0, len(heap))
print("after sift-down:", heap)`;

export const heapSift: LessonDefinition = {
  id: "heap-sift",
  title: "Heap Mechanics: Sift-Up and Sift-Down",
  area: "Heaps",
  prerequisites: [
  "min-max-heaps"
],

  explanation: "`heapq` gives you `heappush` and `heappop`, but *how* do they keep the smallest at the root in **O(log n)**? The answer is two small operations that walk one path of the tree, swapping as they go: **sift-up** (also called bubble-up) after an insert, and **sift-down** (sink / percolate-down) after a removal. This lesson opens the black box and runs them by hand.\n\nA binary heap is a **complete binary tree stored in a flat array** using **0-based** index arithmetic: the parent of index `i` is `(i-1)//2`, and its two children are `2i+1` and `2i+2`. That is the whole reason the tree needs no pointers — the positions are computed.\n\n**Sift-up (insert).** Put the new value at the end of the array (the next open leaf), then compare it with its parent; while it is smaller, swap it upward. Starting from the valid min-heap `[1, 3, 2, 7, 4, 5]` and inserting `0`: the array becomes `[1, 3, 2, 7, 4, 5, 0]`; `0` at index 6 is smaller than its parent `2` at index `(6-1)//2 = 2`, so they swap → `[1, 3, 0, 7, 4, 5, 2]`; now `0` at index 2 is smaller than its parent `1` at index `(2-1)//2 = 0`, so they swap → `[0, 3, 1, 7, 4, 5, 2]`; `0` is now the root, so we stop. Two swaps — the height of the tree.\n\n**Sift-down (remove-min).** The minimum is always at the root. To remove it, move the **last** element into the root slot, then compare the root with its **smaller** child; while a child is smaller, swap downward. After removing the root above, we move `2` to the root → `[2, 3, 1, 7, 4, 5]`; the smaller child of index 0 is `1` at index 2, and `1 < 2`, so they swap → `[1, 3, 2, 7, 4, 5]`; index 2's children (indices 5, 6) don't exist or aren't smaller, so we stop. One swap. Each sift touches at most the tree's height, which is why push and pop are **O(log n)**.\n\nThe printed heap snapshots add work: each swap prints n entries. The core sift is logarithmic; this instrumented teaching version can take O(n log(n+1)). Parent calculation is only used while i>0. Heap order permits equal values and does not promise stable order among equal priorities.",

  vocabulary: [
  {
    "term": "Sift-up (bubble-up)",
    "definition": "After inserting at the last leaf, swap the new value toward the root while it violates the heap order."
  },
  {
    "term": "Sift-down (sink / percolate-down)",
    "definition": "After moving the last element to the root, swap it toward the leaves while a child is more extreme."
  },
  {
    "term": "Parent index",
    "definition": "For 0-based index i, the parent is at (i-1)//2."
  },
  {
    "term": "Child indices",
    "definition": "For 0-based index i, the left child is 2i+1 and the right child is 2i+2."
  },
  {
    "term": "Complete binary tree",
    "definition": "Every level is full except possibly the last, which fills left-to-right — so the tree packs into an array with no gaps."
  }
],

  concepts: {
  "purpose": "Show the actual swap machinery behind heapq's O(log n) push/pop, so 'the heap re-settles' stops being magic.",
  "operations": "sift_up(heap, i): swap with parent (i-1)//2 while smaller. sift_down(heap, i, size): swap with the smaller of children 2i+1 / 2i+2 while a child is smaller.",
  "uses": "Understanding heap internals; implementing a heap when a language lacks one; reasoning about why push/pop are O(log n) and heapify is O(n).",
  "tradeoffs": "Hand-rolled sifting is educational but you should use heapq in real code — it is C-backed and correct. The index arithmetic is easy to get wrong (off-by-one on children).",
  "commonMistakes": "Using 1-based child formulas (2i / 2i+1) with a 0-based array; comparing with the wrong child in sift-down (must pick the SMALLER child for a min-heap); forgetting the size bound so a child index runs off the array.",
  "edgeCases": "An already ordered value can require zero swaps. Sifting index0 upward is a no-op because i>0 is false. A leaf has no in-range children. Equal compared values do not swap under strict <, but heaps do not promise stable order among equal priorities."
},

  complexity: [
  {
    "operation": "sift_up / sift_down",
    "best": "O(1)",
    "average": "O(log n)",
    "worst": "O(log n)",
    "space": "O(1)",
    "note": "Walks at most one root-to-leaf path (tree height ~log2 n)."
  },
  {
    "operation": "Instrumented sift with whole-list prints",
    "best": "O(1) if no swap",
    "average": "O(n log(n+1)) upper bound",
    "worst": "O(n log(n+1))",
    "space": "O(n)",
    "note": "Diagnostic output formatting dominates the O(log n) core loop."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in the heap array"
    }
  ],
  "costModel": "The heap is a complete binary tree of height ~log2(n). sift_up and sift_down each move along ONE path between the root and a leaf, doing O(1) work (a compare and maybe a swap) per level.",
  "time": {
    "bound": "O(n log(n+1))",
    "case": "worst",
    "explanation": "The core sift loop visits at most O(log(n+1)) levels and does constant comparison/swap work per level. This displayed teaching version also prints the whole n-entry heap after each swap. Formatting each list costs O(n), so the instrumented functions have worst-case O(n log(n+1)) time. Removing diagnostic prints restores O(log(n+1)) sifting time.",
    "otherCases": [
      {
        "case": "best",
        "bound": "O(1)",
        "note": "The value is already correctly placed, so the loop stops after one comparison with no swap."
      }
    ]
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "Sift bookkeeping itself is O(1). Formatting the full heap for a diagnostic print creates an O(n) string; this includes that temporary representation.",
    "inputOutputNote": "The heap list itself is the data (O(n) inherent); the printed swap lines are output, not auxiliary algorithm space."
  },
  "derivation": [
    {
      "lines": [
        4,
        5,
        6,
        7,
        9,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        27
      ],
      "description": "Core sift follows one tree-height path with constant work per level.",
      "cost": "O(log(n+1))",
      "dimension": "time"
    },
    {
      "lines": [
        8,
        26
      ],
      "description": "Each diagnostic print formats all n heap entries after a swap.",
      "cost": "O(n log(n+1))",
      "dimension": "time"
    },
    {
      "lines": [
        8,
        26
      ],
      "description": "Temporary full-list string plus constant cursor bookkeeping.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Comparisons and list index/swap are O(1).",
    "The array already satisfies the heap invariant everywhere except the single node being sifted (the precondition both operations rely on).",
    "0-based indexing: parent (i-1)//2, children 2i+1 and 2i+2.",
    "List elements have bounded-size representations; diagnostic prints are included in the function analysis."
  ],
  "tradeoffs": "Hand-rolled sifting exposes the mechanics but heapq's C implementation is what you should ship. Sift-down from every internal node bottom-up is how heapify achieves O(n) rather than O(n log n).",
  "counters": [
    {
      "label": "sift-up swaps",
      "definition": "Actual tuple swap on line 7.",
      "countLines": [
        7
      ]
    },
    {
      "label": "sift-down swaps",
      "definition": "Actual tuple swap on line 25.",
      "countLines": [
        25
      ]
    }
  ],
  "fixedDataNote": "The example performs two sift-up swaps and one sift-down swap. The print-instrumented bound is O(n log(n+1)); the underlying comparisons/swaps alone are O(log(n+1))."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: the 0-based index formulas — parent (i-1)//2, children 2i+1 and 2i+2."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define sift_up(heap, i): bubble index i toward the root."
  },
  {
    "line": 3,
    "executable": false,
    "explanation": "Comment describing the sift-up loop."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Loop while i is not already the root (i > 0)."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Compute the parent index of i as (i-1)//2."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "If the child value is smaller than its parent, the heap order is violated."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Swap the child up into the parent slot."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Print the array right after the swap (shows the state sequence)."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Continue sifting from the parent index."
  },
  {
    "line": 10,
    "executable": false,
    "explanation": "else branch: the value is now in place."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Stop sifting up."
  },
  {
    "line": 12,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Define sift_down(heap, i, size): sink index i toward the leaves."
  },
  {
    "line": 14,
    "executable": false,
    "explanation": "Comment describing the sift-down loop."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Loop until no child is smaller (we break out explicitly)."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "Left child index 2i+1."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Right child index 2i+2."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "Assume the current node i is the smallest so far."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "If the left child exists (in range) and is smaller, it becomes the candidate."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "Track the left child as the smallest."
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "If the right child exists and is smaller than the current smallest, it becomes the candidate."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "Track the right child as the smallest."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "If neither child is smaller, the node is settled."
  },
  {
    "line": 24,
    "executable": true,
    "explanation": "Stop sifting down."
  },
  {
    "line": 25,
    "executable": true,
    "explanation": "Otherwise swap the node down with its smaller child."
  },
  {
    "line": 26,
    "executable": true,
    "explanation": "Print the array right after the swap."
  },
  {
    "line": 27,
    "executable": true,
    "explanation": "Continue sifting from the child index."
  },
  {
    "line": 28,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 29,
    "executable": false,
    "explanation": "Comment: insert then sift-up demonstration."
  },
  {
    "line": 30,
    "executable": true,
    "explanation": "Start from the valid min-heap [1, 3, 2, 7, 4, 5]."
  },
  {
    "line": 31,
    "executable": true,
    "explanation": "Append 0 at the next open leaf → [1, 3, 2, 7, 4, 5, 0]."
  },
  {
    "line": 32,
    "executable": true,
    "explanation": "Print the array after appending."
  },
  {
    "line": 33,
    "executable": true,
    "explanation": "Sift the new last element up: 0 rises past 2 then past 1 to the root (2 swaps)."
  },
  {
    "line": 34,
    "executable": true,
    "explanation": "Print [0, 3, 1, 7, 4, 5, 2] — 0 is now the root."
  },
  {
    "line": 35,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 36,
    "executable": false,
    "explanation": "Comment: remove-min then sift-down demonstration."
  },
  {
    "line": 37,
    "executable": true,
    "explanation": "Pop the last element (2) to fill the root gap."
  },
  {
    "line": 38,
    "executable": true,
    "explanation": "Overwrite the root with that last value → [2, 3, 1, 7, 4, 5]."
  },
  {
    "line": 39,
    "executable": true,
    "explanation": "Print the array after moving the last element to the root."
  },
  {
    "line": 40,
    "executable": true,
    "explanation": "Sift the root down: 2 sinks below its smaller child 1 (1 swap)."
  },
  {
    "line": 41,
    "executable": true,
    "explanation": "Print [1, 3, 2, 7, 4, 5] — the heap invariant is restored."
  }
],

  bindings: [
  {
    "variable": "heap",
    "model": "heap"
  }
],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "Sift-up just swapped 0 from index 6 up to index 2, giving [1, 3, 0, 7, 4, 5, 2]. Which index does 0 compare against next, and does it swap?",
    "answer": "0 is now at index 2; its parent is at (2-1)//2 = 0, holding 1. Since 0 < 1 it swaps again, moving 0 to the root: [0, 3, 1, 7, 4, 5, 2].",
    "explanation": "Sift-up keeps comparing the moved value with its parent (i-1)//2 and swaps while it is smaller. 0 beats 1, so one more swap puts it at the root; then i becomes 0 and the loop stops."
  }
],

  experiments: [
  "Change the inserted value from 0 to 6 and predict how many sift-up swaps happen before printing (hint: compare 6 with 2).",
  "After the remove-min, print the parent/child indices for the root to confirm which child sift-down chose.",
  "Replace the min-heap comparisons (<) with (>) to turn both routines into MAX-heap sifting, and confirm the largest ends at the root."
],

  exercises: [
  {
    "id": "sift-predict-1",
    "kind": "predict-state",
    "prompt": "A min-heap array is [2, 5, 3, 9, 6] and you insert 1 (append then sift-up). List the array after EACH swap until 1 reaches its final position.",
    "expected": "Append: [2,5,3,9,6,1]. 1 at index 5, parent (5-1)//2=2 holds 3 → swap: [2,5,1,9,6,3]. 1 now at index 2, parent (2-1)//2=0 holds 2 → swap: [1,5,2,9,6,3]. 1 is the root; stop. Two swaps.",
    "hints": [
      "Append 1 at the end, then compare it with its parent (i-1)//2.",
      "First swap: index 5 with index 2 (3 > 1).",
      "Second swap: index 2 with index 0 (2 > 1). Then 1 is the root."
    ]
  },
  {
    "id": "sift-choose-1",
    "kind": "choose-approach",
    "prompt": "You removed the min from a heap and moved the last element to the root. To restore the heap in O(log n), do you sift the root UP or DOWN, and which child do you compare against?",
    "expected": "Sift DOWN. Compare the root with the SMALLER of its two children (indices 2i+1 and 2i+2 that are in range); swap with that smaller child while it is smaller than the node. Sifting up would be wrong — the root has no parent to rise to.",
    "hints": [
      "Goal: after moving the last element into the vacated root slot, restore the heap in O(log n) — sift up or down, and against which child.",
      "The wrong move is sifting up: the root has no parent, so there is nowhere for it to rise.",
      "Key property: the new root may be too large for a min-heap, so it must descend toward the smaller side to keep the heap order.",
      "Approach: sift the root DOWN, comparing it against the smaller of its two in-range children.",
      "Reasoning: swapping with the smaller child (indices 2i+1, 2i+2) preserves the min-heap property as the element sinks; comparing with the larger child or sifting up would violate it.",
      "Answer: sift DOWN, comparing with the SMALLER of the two in-range children (2i+1, 2i+2) and swapping while larger — sifting up is wrong since the root has no parent."
    ],
    "recognition": {
      "scenario": "You removed the min from a heap and moved the last element into the root slot. You must restore the heap property in O(log n).",
      "approaches": [
        {
          "id": "sift-down-smaller-child",
          "label": "Sift the root DOWN, swapping with the SMALLER child",
          "requiredReasonIds": [
            "root-sinks-to-smaller"
          ]
        },
        {
          "id": "sift-up",
          "label": "Sift the root UP toward the parent",
          "requiredReasonIds": [],
          "rejectionFeedback": "The root has no parent to rise to, so sifting up does nothing — the out-of-place element is at the top and must sink downward."
        },
        {
          "id": "sift-down-larger-child",
          "label": "Sift DOWN but swap with the LARGER child",
          "requiredReasonIds": [],
          "rejectionFeedback": "In a min-heap the parent must be <= both children; swapping with the larger child can leave the smaller child above its parent, breaking the heap."
        }
      ],
      "reasons": [
        {
          "id": "root-sinks-to-smaller",
          "text": "In a min-heap each parent must be <= its children, so the misplaced root sinks by swapping with the smaller of children 2i+1 and 2i+2 while it is larger — O(log n)."
        },
        {
          "id": "root-has-parent",
          "text": "The root has a parent, so sifting it up restores the heap.",
          "contradictory": true
        },
        {
          "id": "swap-larger-correct",
          "text": "Swapping with the larger child is correct for a min-heap.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "sift-down-smaller-child"
      ],
      "modelExplanation": "Sift DOWN, comparing the root with the SMALLER of its two in-range children (2i+1, 2i+2) and swapping while it is larger. Sifting up is wrong because the root has no parent to rise to."
    }
  }
],

  review: "A binary heap packs a **complete tree** into an array with **0-based** index math: parent `(i-1)//2`, children `2i+1` / `2i+2`. **Sift-up** restores order after an insert by swapping a leaf toward the root while it is smaller than its parent; **sift-down** restores order after a remove-min by moving the last element to the root and swapping it toward the leaves past its **smaller** child. Each walks at most the tree height ~log₂n, which is exactly why `heappush`/`heappop` are **O(log n)**. In real code use `heapq`; this lesson is to make its internals concrete.",

  expectedOutput:
    "after append: [1, 3, 2, 7, 4, 5, 0]\nsift-up swap: [1, 3, 0, 7, 4, 5, 2]\nsift-up swap: [0, 3, 1, 7, 4, 5, 2]\nafter sift-up: [0, 3, 1, 7, 4, 5, 2]\nmoved last to root: [2, 3, 1, 7, 4, 5]\nsift-down swap: [1, 3, 2, 7, 4, 5]\nafter sift-down: [1, 3, 2, 7, 4, 5]\n",

  references: [
  {
    "url": "https://opendatastructures.org/ods-python/10_1_BinaryHeap_Implicit_Bi.html",
    "title": "Open Data Structures: BinaryHeap",
    "section": "10.1 indexing; add/remove; resizing amortization; Figures 10.1–10.3",
    "topic": "heap-sift",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Sift up compares the parent; sift down selects the smaller child."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Both source and app use zero-based array indices, children 2i+1 and 2i+2, and parent (i-1)//2 for i>0. Resizing is accounted for amortized."
    ]
  },
  {
    "url": "https://runestone.academy/ns/books/published/pythonds3/Trees/BinaryHeapImplementation.html",
    "title": "Runestone: Binary heap implementation",
    "section": "7.10.3 sift up/down and bottom-up heap construction",
    "topic": "heap-sift",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Bottom-up construction differs from repeated insertion."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Use the source zero-based heap code and bottom-up build argument. Its sorted-list insertion discussion is not a heap insertion cost claim."
    ]
  },
  {
    "url": "https://visualgo.net/en/heap",
    "title": "VisuAlgo: Binary heap",
    "section": "Complete tree, insertion, extraction, and build visualization",
    "topic": "heap-sift",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Show the changing array and tree together."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "Source text discusses a default max-heap and tree/array views. App heapq uses zero-based indices; actual indexing diagram inspected in ODS Figure 10.1."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "6229334a1cf982c8",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
