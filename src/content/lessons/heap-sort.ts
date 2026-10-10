/**
 * Lesson: Heap sort (Sorting). Verified on CPython 3.14.
 * Output: "[1, 2, 3, 4, 5, 8]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Sort via a separate min-heap and repeated minimum extraction.
import heapq

def heap_sort(a):
    h = a[:]
    heapq.heapify(h)
    out = []
    while h:
        out.append(heapq.heappop(h))
    return out

print(heap_sort([5, 1, 4, 2, 8, 3]))`;

export const heapSort: LessonDefinition = {
  id: "heap-sort",
  title: "Heap Sort",
  area: "Sorting",
  prerequisites: ["merge-sort"],

  explanation: `**Heap sort** uses a **heap** — a structure that always gives you the smallest (or largest) element quickly — to sort. The plan: put all elements into a **min-heap**, then repeatedly **pop the minimum**; the values come out in sorted order. Python's \`heapq\` provides \`heapify\` (turn a list into a heap) and \`heappop\` (remove the smallest).

The complexity is **O(n log n)** in all cases, like merge sort, but the breakdown is different: \`heapify\` builds the heap in **O(n)**, and then each of the n \`heappop\`s costs **O(log n)** (the heap re-settles after removing the root), so the pops dominate at O(n log n). There is no bad O(n²) case.

Heap sort's classic advantage is space: an in-place array heap sorts with **O(1)** auxiliary memory (the \`heapq\`-with-a-copy version here uses O(n) for the copy/output). It is **not stable**. You will meet the heap itself in depth in the Heaps topic; here the point is that "repeatedly extract the extreme" is a sorting strategy, and it is the natural tool when you also need *partial* sorting like top-K.`,

  vocabulary: [
    { term: "Heap", definition: "A tree-shaped structure giving O(1) access to the min (or max) and O(log n) insert/remove." },
    { term: "heapify", definition: "Turn an arbitrary list into a valid heap in O(n)." },
    { term: "heappop", definition: "Remove and return the smallest element in O(log n), re-settling the heap." },
    { term: "In-place heap sort", definition: "The array-based variant using O(1) extra space." },
  ],

  concepts: {
  "purpose": "Sort in guaranteed O(n log n) by repeatedly extracting the heap's minimum.",
  "operations": "heapify the list (O(n)); heappop n times (O(log n) each) to get sorted order.",
  "uses": "Sorting with O(1) extra space (in-place variant); top-K and priority scheduling reuse the heap.",
  "tradeoffs": "The shown copy-and-pop implementation uses O(n) auxiliary memory and does not guarantee stability. Classic array heapsort uses O(1) auxiliary memory; practical speed depends on the implementation and input.",
  "commonMistakes": "Assuming heapify is O(n log n) (it is O(n)); expecting stability; mutating the input when you meant to copy.",
  "edgeCases": "Empty/one element trivially sorted. Duplicates come out in some order (not stable)."
},

  complexity: [
  {
    "operation": "Heap sort",
    "best": "O(n log n)",
    "average": "O(n log n)",
    "worst": "O(n log n)",
    "space": "O(n)",
    "note": "Shown copy-and-pop implementation: O(n) separate heap plus O(n) returned result. A classic array heapsort is a different O(1)-auxiliary variant."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements to sort"
    }
  ],
  "costModel": "heapify is O(n). Each heappop restores the heap in O(log n). Reading n results.",
  "time": {
    "bound": "O(n log n)",
    "case": "worst",
    "explanation": "Building the heap with heapify is O(n) (a well-known result — cheaper than n separate inserts). Then we heappop n times, and each pop must sift the new root down through the tree in O(log n). The pops dominate: n × O(log n) = O(n log n). This bound holds for all inputs — there is no degenerate case like quicksort's."
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The copied heap h holds n references independently of the required output. It is O(n) auxiliary space even after excluding out. Classic in-place array heapsort can use O(1) auxiliary space but is not the code shown.",
    "inputOutputNote": "The caller's list is input; out is required O(n) output; h is O(n) auxiliary storage."
  },
  "derivation": [
    {
      "lines": [
        5,
        6
      ],
      "description": "Copy and bottom-up heap construction both cost O(n).",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        8,
        9
      ],
      "description": "n extractions at O(log n) each in the worst case; appends are amortized constant.",
      "cost": "O(n log n)",
      "dimension": "time"
    },
    {
      "lines": [
        5
      ],
      "description": "The separate copied heap is auxiliary to the input and result.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Comparisons are O(1).",
    "heapify is O(n) and heappop is O(log n) (Python heapq)."
  ],
  "tradeoffs": "Merge sort is stable with O(n) auxiliary memory. The shown heap-based sort also uses O(n) auxiliary memory and has O(n log n) worst-case time. Classic array heapsort can reduce auxiliary memory to O(1); deterministic quicksort can have O(n²) worst-case time.",
  "counters": [
    {
      "label": "pops",
      "definition": "executions of the explicit heappop/append line, one per removed element",
      "countLines": [
        9
      ]
    }
  ],
  "fixedDataNote": "This run heapifies 6 elements then pops 6 times. The O(n log n) bound generalises the pop cost to n. Function/query analysis excludes demonstration input literal creation and printing."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: a separate heap is used; this is not the constant-space array variant."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Import heapq, whose unqualified functions use a min-heap."
  },
  {
    "line": 3,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Define the nonmutating heap-based sorting function."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Copy n references so extracting minima does not change the caller's list."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Build the min-heap in O(n) time."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Prepare the required sorted result."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Continue while values remain in the heap."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Remove the current minimum, repair the heap and append that minimum to out."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Return the ordered result after all values have been removed from h."
  },
  {
    "line": 11,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Print the sorted sample list."
  }
],

  bindings: [
  {
    "variable": "h",
    "model": "heap"
  },
  {
    "variable": "out",
    "model": "array"
  }
],

  prediction: [
    { atEventIndex: 0, prompt: "Heap sort is O(n log n). Which step is O(n) and which is O(n log n)?", answer: "heapify is O(n); the n heappops (O(log n) each) total O(n log n) and dominate.", explanation: "Building the heap is a linear-time operation, but extracting all n elements costs O(log n) per pop, so the extraction phase sets the overall O(n log n)." },
  ],

  experiments: [
    "Watch the heap array in the visualization re-settle after each pop.",
    "Sort a reverse-sorted list and confirm it is still O(n log n) (no worst-case blowup).",
    "Change to a max-heap approach (negate values) to sort descending.",
  ],

  exercises: [
    {
      id: "hs-choose-1",
      kind: "choose-approach",
      prompt: "You need a guaranteed O(n log n) sort with O(1) extra space, and stability is NOT required. Heap sort or merge sort?",
      expected: "Heap sort (in-place): O(n log n) guaranteed and O(1) auxiliary space. Merge sort is also O(n log n) but needs O(n) space.",
      hints: ["Which uses less extra memory?", "In-place heap sort is O(1) space.", "Merge sort needs O(n); pick heap sort here."],
    },
    {
      id: "hs-predict-1",
      kind: "predict-state",
      prompt: "Is heapify O(n) or O(n log n)? Why does the overall sort still end up O(n log n)?",
      expected: "heapify is O(n). The overall sort is O(n log n) because the n heappops each cost O(log n), and that phase dominates the O(n) build.",
      hints: ["Building a heap all at once is cheaper than n inserts.", "That build is O(n).", "But n pops at O(log n) each dominate."],
    },
  ],

  review: "**Heap sort** builds a heap (`heapify`, **O(n)**) then extracts the extreme n times (`heappop`, **O(log n)** each), giving guaranteed **O(n log n)** in all cases. The in-place array variant uses **O(1)** space but is **not stable**. Choose it when you need a worst-case guarantee with minimal memory; the heap itself reappears for top-K and priority queues. The shown heapq copy-and-pop function uses O(n) auxiliary memory for h and O(n) returned output. Its explicit loop displays each pop; the constant-space claim applies only to the classic in-place array variant.",

  expectedOutput: "[1, 2, 3, 4, 5, 8]\n",

  references: [
  {
    "url": "https://docs.python.org/3.14/library/heapq.html",
    "title": "heap reference",
    "section": "Heap invariant; heapify; heappop; max-heap functions",
    "topic": "sorting/heap",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "heapify is linear; min-heap heappop returns the smallest; Python 3.14 includes max-heap functions."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "This app uses a separate 0-based min-heap."
    ]
  },
  {
    "url": "https://opendatastructures.org/ods-python/11_1_Comparison_Based_Sorti.html",
    "title": "Open Data Structures: comparison-based sorting",
    "section": "11.1.3 heap-sort",
    "topic": "sorting/heap",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Classic in-place heapsort reuses the input array."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "606b3a3dfb7bd69d",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
