/**
 * Lesson: Selection sort (Sorting). Verified on CPython 3.14.
 * Output: "[1, 2, 4, 5, 8]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Selection sort: repeatedly pick the smallest remaining element.
def selection_sort(a):
    a = a[:]
    n = len(a)
    for i in range(n):
        m = i                       # index of the smallest in a[i:]
        for j in range(i + 1, n):
            if a[j] < a[m]:
                m = j
        a[i], a[m] = a[m], a[i]     # place the smallest at position i
    return a

print(selection_sort([5, 1, 4, 2, 8]))`;

export const selectionSort: LessonDefinition = {
  id: "selection-sort",
  title: "Selection Sort",
  area: "Sorting",
  prerequisites: ["bubble-sort"],

  explanation: "**Selection sort** builds the sorted list one position at a time. For each position `i`, it **scans the rest of the array to find the minimum**, then swaps that minimum into position `i`. After step `i`, the first `i+1` elements are the smallest, in order.\n\nLike bubble sort it is **O(n²)** — for each of n positions it scans the remaining elements to find the minimum, giving n(n-1)/2 comparisons. But it makes at most **n swaps** total (one per position), far fewer than bubble sort's many adjacent swaps. That matters when writes are expensive (e.g. flash memory).\n\nA subtle contrast: selection sort's comparison count is **the same regardless of input order** — even a sorted array takes O(n²) comparisons, because it always scans to confirm the minimum. It is also **not stable** in its basic swap form. It uses **O(1)** extra space.\n\nThe shown function returns a shallow copy. Its sorting phase needs O(1) auxiliary storage beyond that O(n) result; total new memory including the returned copy is O(n). The in-place exercise instead modifies its supplied list.",

  vocabulary: [
    { term: "Selection sort", definition: "Repeatedly selecting the minimum of the unsorted part and placing it next." },
    { term: "Minimum scan", definition: "The inner loop that finds the smallest remaining element's index." },
    { term: "Swap count", definition: "Selection sort does at most n swaps — one per position." },
    { term: "Unstable", definition: "May reorder equal elements (the basic swap version)." },
  ],

  concepts: {
  "purpose": "Sort by repeatedly selecting the minimum; notable for its low number of swaps.",
  "operations": "For each position, scan for the minimum of the rest, then swap it into place.",
  "uses": "Educational; situations where writes/swaps are costly and reads are cheap.",
  "tradeoffs": "O(n²) comparisons always, but only O(n) swaps; O(1) space; not stable.",
  "commonMistakes": "Starting the inner scan at i instead of i+1 (redundant); expecting fewer comparisons on sorted input (it doesn't); assuming stability.",
  "edgeCases": "Empty or singleton input is already ordered. This code executes n placement assignments, including self-swaps when m == i; a sorted list makes n self-swaps and no useful moves."
},

  complexity: [
  {
    "operation": "Selection sort",
    "best": "O(n^2)",
    "average": "O(n^2)",
    "worst": "O(n^2)",
    "space": "O(1)",
    "note": "Always ~n²/2 comparisons; at most n swaps. O(1) auxiliary space excludes the copied list that becomes the returned result; including that result requires O(n) memory."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements"
    }
  ],
  "costModel": "Each comparison is O(1); each swap is O(1). The nested loops set the comparison count.",
  "time": {
    "bound": "O(n^2)",
    "case": "worst",
    "explanation": "For position i the inner loop scans n-1-i remaining elements to find the minimum. Summed over all positions that is (n-1)+(n-2)+…+1 = n(n-1)/2 comparisons — O(n²). Crucially this count is the SAME for any input order, so best = average = worst = O(n²). There are at most n swaps (one per position)."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "The sorting phase uses a constant number of scalar indices/values and edits its returned copy. Auxiliary O(1) excludes the required O(n) returned list; total function allocation is O(n).",
    "inputOutputNote": "The function allocates a returned O(n) shallow-copy list at line 3. Treating that required result as output, the remaining working state is O(1); total new storage including the result is O(n)."
  },
  "derivation": [
    {
      "lines": [
        5
      ],
      "description": "The outer loop runs n times (one per position).",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        7,
        8,
        9
      ],
      "description": "The inner minimum-scan does about n²/2 comparisons total (nested).",
      "cost": "O(n^2)",
      "dimension": "time"
    },
    {
      "lines": [
        10
      ],
      "description": "At most n swaps — one per position.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        6
      ],
      "description": "A constant number of index variables.",
      "cost": "O(1)",
      "dimension": "space"
    },
    {
      "lines": [
        3
      ],
      "description": "The copy visits n element references; it is the returned result.",
      "cost": "O(n)",
      "dimension": "time"
    }
  ],
  "assumptions": [
    "Comparisons and swaps are O(1)."
  ],
  "tradeoffs": "Selection sort minimizes swaps (good when writes are expensive) but never beats O(n²) comparisons; O(n log n) sorts win for speed, and insertion sort adapts to nearly-sorted data.",
  "counters": [
    {
      "label": "comparisons",
      "definition": "executions of the minimum-scan compare (line 8)",
      "countLines": [
        8
      ]
    },
    {
      "label": "swaps",
      "definition": "executions of the placement swap (line 10)",
      "countLines": [
        10
      ]
    }
  ],
  "fixedDataNote": "For n=5 this function makes 10 minimum comparisons and executes 5 placement assignments (some can be self-swaps). Function costs exclude the demo literal and printing."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: repeatedly pick the smallest remaining."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define selection_sort(a)."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Work on a copy."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "n is the length."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "For each target position i (0..n-1)."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Assume the minimum of a[i:] is at i."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Scan the rest to find a smaller element."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Test whether a[j] is smaller than the current minimum; the next line updates m only on a true test."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Record the new minimum index."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Execute the placement swap, even when m == i. There are n such assignments, each with two list writes."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Return the sorted copy."
  },
  {
    "line": 12,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Sort [5,1,4,2,8] → [1, 2, 4, 5, 8]."
  }
],

  bindings: [
    {
      variable: "a",
      model: "array",
      overlays: [
        { role: "pointer", label: "i", source: "i" },
        { role: "pointer", label: "min m", source: "m" },
      ],
    },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Compared to bubble sort, what does selection sort minimize, and does its comparison count depend on input order?", answer: "It minimizes swaps (at most n); its comparison count is always ~n²/2 regardless of input order.", explanation: "Selection sort performs one swap per position (≤ n total), far fewer than bubble sort's swaps, but it always scans to find each minimum, so comparisons stay O(n²) for any input." },
  ],

  experiments: [
    "Count swaps for a sorted vs reverse-sorted input (comparisons stay the same).",
    "Add a guard to skip the swap when m == i and count the savings.",
    "Compare its comparison count to bubble sort's on the same input.",
  ],

  exercises: [
  {
    "id": "sel-complete-1",
    "kind": "complete-code",
    "prompt": "Complete the minimum-finding inner loop in `selection_sort(a)` so it sorts the list in place and returns it.",
    "starterCode": "def selection_sort(a):\n    n = len(a)\n    for i in range(n):\n        m = i\n        for j in range(i + 1, n):\n            # TODO: update m if a[j] is smaller\n            pass\n        a[i], a[m] = a[m], a[i]\n    return a",
    "expected": "def selection_sort(a):\n    n = len(a)\n    for i in range(n):\n        m = i\n        for j in range(i + 1, n):\n            if a[j] < a[m]:\n                m = j\n        a[i], a[m] = a[m], a[i]\n    return a",
    "hints": [
      "Goal: complete selection sort's inner loop that finds the minimum of the unsorted tail.",
      "You track just the index of the smallest seen rather than re-scanning repeatedly.",
      "Key insight: compare each candidate a[j] against the current minimum a[m] and update m on a smaller value.",
      "Approach: scan from i+1 to the end, remembering the index of the smallest element.",
      "Pseudocode: m = i; for j in range(i+1, n): if a[j] < a[m]: m = j; then swap a[i] and a[m].",
      "Inside the inner loop write `if a[j] < a[m]: m = j`."
    ],
    "tests": "assert selection_sort([5, 1, 4, 2, 8]) == [1, 2, 4, 5, 8], 'sorts a mixed list'\nassert selection_sort([]) == [], 'empty list'\nassert selection_sort([1]) == [1], 'single element'\nassert selection_sort([3, 2, 1]) == [1, 2, 3], 'reversed input'\nassert selection_sort([4, 4, 2]) == [2, 4, 4], 'duplicates'\nprint('OK')"
  },
  {
    "id": "sel-choose-1",
    "kind": "choose-approach",
    "prompt": "Writes are expensive and reads are cheap. Among the basic in-place bubble, selection and insertion sorts taught here, which has the smallest worst-case growth in list writes?",
    "expected": "Selection sort uses at most n placement swaps (two list writes per swap, including self-swaps in this version), so O(n) writes. Basic bubble/insertion can make O(n²) writes in their worst cases. The returned-copy walkthrough adds O(n) copy writes; the in-place exercise avoids that copy.",
    "hints": [
      "Compare the worst-case list writes of the basic in-place bubble, selection and insertion algorithms.",
      "The costly choice is bubble or insertion sort, which can perform O(n²) writes as they shuffle elements.",
      "Key property: the cost model weights writes far above reads/comparisons, so write count is what matters.",
      "Approach: choose selection sort, which commits one element to its final place per position.",
      "Reasoning: selection sort does at most n swaps regardless of input, whereas bubble/insertion move elements repeatedly; it reads a lot but writes little, matching this cost model.",
      "Selection sort uses at most n placement swaps (two list writes per swap, including self-swaps in this version), so O(n) writes. Basic bubble/insertion can make O(n²) writes in their worst cases. The returned-copy walkthrough adds O(n) copy writes; the in-place exercise avoids that copy."
    ],
    "recognition": {
      "scenario": "Writes are expensive and reads are cheap. Among the basic in-place bubble, selection and insertion sorts taught here, which has the smallest worst-case growth in list writes?",
      "approaches": [
        {
          "id": "selection",
          "label": "Selection sort",
          "requiredReasonIds": [
            "at-most-n-writes"
          ]
        },
        {
          "id": "bubble",
          "label": "Bubble sort",
          "requiredReasonIds": [],
          "rejectionFeedback": "Basic bubble sort can make O(n²) swaps and writes; selection makes O(n) placement writes."
        },
        {
          "id": "insertion",
          "label": "Insertion sort",
          "requiredReasonIds": [],
          "rejectionFeedback": "Insertion sort can make O(n²) shifts and writes; selection makes O(n) placement writes."
        }
      ],
      "reasons": [
        {
          "id": "at-most-n-writes",
          "text": "One placement swap per position means two list writes per swap and O(n) writes total, including self-swaps here; bubble/insertion can write O(n²) times."
        },
        {
          "id": "selection-many-writes",
          "text": "Selection sort performs O(n²) writes, more than the other quadratic sorts.",
          "contradictory": true
        },
        {
          "id": "all-same-writes",
          "text": "All O(n²) sorts perform the same number of writes.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "selection"
      ],
      "modelExplanation": "Selection sort uses at most n placement swaps (two list writes per swap, including self-swaps in this version), so O(n) writes. Basic bubble/insertion can make O(n²) writes in their worst cases. The returned-copy walkthrough adds O(n) copy writes; the in-place exercise avoids that copy."
    }
  }
],

  review: "**Selection sort** repeatedly finds the minimum of the unsorted part and swaps it into place. It is **O(n²)** comparisons for **any** input order but only **O(n)** swaps, with **O(1)** space and no stability. Its niche is minimizing writes; for speed prefer O(n log n) sorts. The walkthrough also allocates its O(n) returned copy.",

  expectedOutput: "[1, 2, 4, 5, 8]\n",

  references: [
  {
    "url": "https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheSelectionSort.html",
    "title": "TheSelectionSort",
    "section": "Algorithm, analysis and visual example",
    "topic": "sorting/selection-sort",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Selection places one extremal value per pass with quadratic comparisons."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  },
  {
    "url": "https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c",
    "title": "CPython 3.14.2 list implementation",
    "section": "list slicing; list_resize; binarysort",
    "topic": "sorting/selection-sort",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "List copies allocate references; binary insertion sorting moves entries to make room."
    ],
    "accessDate": "2026-10-10",
    "conventions": [
      "This app returns a defensive copy and uses ascending minimum-selection rather than descending maximum-selection."
    ]
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "9adf456cd5519520",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
