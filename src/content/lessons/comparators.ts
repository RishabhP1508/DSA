/**
 * Lesson: Custom ordering / comparators (Sorting). Verified on CPython 3.14.
 * Output: "['a', 'bb', 'dd', 'ccc']\n[3, 2, 1]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Materialize sorted results so the diagrams show the returned lists.
words = ["bb", "a", "ccc", "dd"]
by_length = sorted(words, key=len)
print(by_length)
nums = [3, 1, 2]
descending = sorted(nums, reverse=True)
print(descending)`;

export const comparators: LessonDefinition = {
  id: "comparators",
  title: "Custom Ordering and Comparators",
  area: "Sorting",
  prerequisites: [
  "merge-sort",
  "functions",
  "expressions"
],

  explanation: "Real problems rarely want the plain ascending order. Python lets you customize sorting with a **key function**: `sorted(items, key=f)` sorts by `f(item)` instead of the item itself, and `reverse=True` flips the direction. The underlying algorithm is **Timsort**, which is stable and **O(n log n)** — with constant-time key extraction and key comparisons the bound remains O(n log n); expensive keys or comparisons add their own costs.\n\nHere `key=len` orders the words by length (`\"a\"`, then the length-2 words, then `\"ccc\"`), and because Timsort is **stable**, the two length-2 words keep their original relative order (`\"bb\"` before `\"dd\"`). Using `reverse=True` sorts numbers from high to low.\n\nFor **multi-level** ordering, return a **tuple** key: `key=lambda p: (p.age, p.name)` sorts by age, breaking ties by name. This is far cleaner and less error-prone than writing a pairwise comparator (Python's old `cmp` is gone; use `functools.cmp_to_key` only when a key truly can't express the order). The recognition cue: \"sort by some derived property or by several fields\" → key function (and tuples for tie-breaking).\n\nA lambda is a small function expression; `lambda p: (p[1], p[0])` creates an (age, name) key for a (name, age) tuple. Negating a descending key requires an orderable numeric field, not a string. For arbitrary fields, two stable sorts also work: sort by B with reverse=True, then by A ascending, preserving B order within equal A groups.",

  vocabulary: [
    { term: "Key function", definition: "A function mapping each item to the value it should be sorted by." },
    { term: "reverse", definition: "A flag to sort in descending order." },
    { term: "Stable sort", definition: "Ties keep their original relative order (Timsort is stable)." },
    { term: "Tuple key", definition: "A key returning a tuple to sort by multiple fields with tie-breaking." },
    { term: "Timsort", definition: "Python's adaptive, stable O(n log n) sort used by sorted/list.sort." },
  ],

  concepts: {
    purpose: "Sort by derived values or multiple fields without changing the underlying O(n log n) sort.",
    operations: "Pass key=f to sort by f(item); reverse=True for descending; tuple keys for multi-level order.",
    uses: "Sorting objects by an attribute, by length, by several fields, or in descending order.",
    tradeoffs: "Key functions are clean and each key is computed once (O(n) extra key storage); comparator functions (cmp_to_key) are slower and rarely needed.",
    commonMistakes: "Mutating during sort; expecting instability (Timsort is stable); using a slow cmp when a key would do; forgetting tuple keys for tie-breaks.",
    edgeCases: "Empty list sorts to empty. Equal keys preserve input order (stability). Descending stable sort still keeps ties in original order.",
  },

  complexity: [
    { operation: "sorted with key", best: "O(n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)", note: "Timsort; key computed once per element (O(n) keys)." },
  ],

  complexityExplanation: {
  "scope": "program",
  "variables": [
    {
      "symbol": "n",
      "meaning": "Total number of words and numbers across these two example lists; each grows at most proportionally to n"
    }
  ],
  "costModel": "Timsort does O(n log n) comparisons; the key function is called once per element (n calls), each assumed O(1) here.",
  "time": {
    "bound": "O(n log n)",
    "case": "worst",
    "explanation": "sorted uses Timsort, which is O(n log n) in the worst and average case (and adaptively O(n) on already-ordered input). The key function is evaluated exactly once per element — n calls total — which adds O(n) and does not change the O(n log n) class (assuming each key call is O(1); an expensive key would add its own cost).",
    "otherCases": [
      {
        "case": "best",
        "bound": "O(n)",
        "note": "Timsort is adaptive: already-sorted input runs in O(n)."
      }
    ]
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "sorted returns a new list (O(n)), Timsort uses up to O(n) temporary space, and the computed keys are stored once per element (O(n)).",
    "inputOutputNote": "The returned sorted list and the decorated keys are O(n); the input list is separate."
  },
  "derivation": [
    {
      "lines": [
        3,
        6
      ],
      "description": "Timsort performs O(n log n) comparisons.",
      "cost": "O(n log n)",
      "dimension": "time"
    },
    {
      "lines": [
        3
      ],
      "description": "The key function is called once per element (n times).",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        3,
        6
      ],
      "description": "New sorted list plus stored keys and Timsort buffers.",
      "cost": "O(n)",
      "dimension": "space"
    },
    {
      "lines": [
        2,
        5
      ],
      "description": "Creating the two literal-input lists is linear in their item counts.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        4,
        7
      ],
      "description": "Print each returned list; for bounded-size displayed items this is linear.",
      "cost": "O(n)",
      "dimension": "time"
    }
  ],
  "assumptions": [
    "The key function is O(1) per call (a costly key would add its own factor).",
    "Comparisons are O(1).",
    "Whole-program bounds include literal setup and printed output, assuming bounded-size numbers/strings; unbounded total character length adds to construction/printing cost."
  ],
  "tradeoffs": "A key function computes each key once (efficient); a comparator via functools.cmp_to_key calls the comparator O(n log n) times and is slower — use a key whenever the ordering can be expressed as one.",
  "counters": [],
  "fixedDataNote": "This run sorts 4 words by length and 3 numbers descending — tiny. The O(n log n) bound describes Timsort for size n."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: sorted returns a new list; retain it to visualize the actual result."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Create the original word list."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Compute each length key once and create a stable sorted list."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Print the new list; words itself retains its original order."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Create the original number list."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Create a new list ordered descending."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Print the descending result; nums itself is unchanged."
  }
],

  bindings: [
  {
    "variable": "words",
    "model": "array"
  },
  {
    "variable": "by_length",
    "model": "array"
  },
  {
    "variable": "nums",
    "model": "array"
  },
  {
    "variable": "descending",
    "model": "array"
  }
],

  prediction: [
    { atEventIndex: 0, prompt: "sorting ['bb','a','ccc','dd'] by len gives ['a','bb','dd','ccc']. Why is 'bb' before 'dd' and not the reverse?", answer: "Because Timsort is stable: 'bb' and 'dd' tie on length 2, so they keep their original input order (bb came first).", explanation: "Stability means equal keys retain input order. 'bb' appeared before 'dd' in the input, so after a stable sort by length they stay in that order." },
  ],

  experiments: [
    "Sort a list of (name, age) tuples by age using key=lambda p: p[1].",
    "Use a tuple key (age, name) to break age ties by name.",
    "Sort words by length descending with key=len, reverse=True.",
  ],

  exercises: [
  {
    "id": "cmp-complete-1",
    "kind": "complete-code",
    "prompt": "Complete `sort_people(people)` so it returns the (name, age) tuples sorted by age ascending, breaking ties by name.",
    "starterCode": "def sort_people(people):\n    # TODO: sort by age, then name\n    return sorted(people, key=None)",
    "expected": "def sort_people(people):\n    return sorted(people, key=lambda p: (p[1], p[0]))",
    "hints": [
      "Goal: sort people by age ascending and break ties by name.",
      "Manual multi-pass sorting is unnecessary; one key expresses both criteria.",
      "Key insight: returning a tuple key sorts by the first field, then the second on ties.",
      "Approach: use sorted with a lambda returning (age, name).",
      "Pseudocode: sorted(people, key = each p -> (p's age, p's name)).",
      "Write `sorted(people, key=lambda p: (p[1], p[0]))` — age first, then name."
    ],
    "tests": "assert sort_people([('Bo', 30), ('Al', 30), ('Cy', 25)]) == [('Cy', 25), ('Al', 30), ('Bo', 30)], 'age then name'\nassert sort_people([]) == [], 'empty'\nassert sort_people([('Z', 1)]) == [('Z', 1)], 'single'\n# same age, reverse-alphabetical input must come out alphabetical by name\nassert sort_people([('Di', 40), ('An', 40)]) == [('An', 40), ('Di', 40)], 'tie broken by name'\nprint('OK')"
  },
  {
    "id": "cmp-choose-1",
    "kind": "choose-approach",
    "prompt": "Sort records by A ascending and numeric B descending. Give a key and explain why a computed key is useful; also describe an option when B is a string.",
    "expected": "For numeric B, key=lambda x: (x.a, -x.b). Each key is computed once. For strings or arbitrary comparable B, stable-sort by B descending, then stable-sort by A ascending; the last pass preserves B order on A ties. cmp_to_key is also valid if its comparator defines a consistent order, but may call Python comparison code many times.",
    "hints": [
      "Sort records by A ascending and numeric B descending. Give a key and explain why a computed key is useful; also describe an option when B is a string.",
      "A cmp_to_key wrapper may invoke Python comparison code O(n log n) times in the worst case, while a key function is computed once per item. Actual speed depends on callback work and input.",
      "Negation reverses an ordered numeric key; strings cannot be negated. Stability supports a general two-pass method.",
      "Approach: pass a tuple key that negates the descending field, e.g. key=lambda x: (x.a, -x.b).",
      "For numeric B, key=lambda x: (x.a, -x.b). Each key is computed once. For strings or arbitrary comparable B, stable-sort by B descending, then stable-sort by A ascending; the last pass preserves B order on A ties. cmp_to_key is also valid if its comparator defines a consistent order, but may call Python comparison code many times.",
      "For numeric B, key=lambda x: (x.a, -x.b). Each key is computed once. For strings or arbitrary comparable B, stable-sort by B descending, then stable-sort by A ascending; the last pass preserves B order on A ties. cmp_to_key is also valid if its comparator defines a consistent order, but may call Python comparison code many times."
    ],
    "recognition": {
      "scenario": "Sort records by A ascending and numeric B descending. Give a key and explain why a computed key is useful; also describe an option when B is a string.",
      "approaches": [
        {
          "id": "tuple-key",
          "label": "A tuple key that negates the descending field, e.g. key=lambda x: (x.a, -x.b)",
          "requiredReasonIds": [
            "key-computed-once"
          ]
        },
        {
          "id": "cmp-function",
          "label": "A cmp_to_key comparator function",
          "requiredReasonIds": [
            "consistent-comparator"
          ],
          "rejectionFeedback": "A consistent comparator is correct, though this simple numeric ordering usually needs less Python callback work with a key."
        }
      ],
      "reasons": [
        {
          "id": "key-computed-once",
          "text": "For numeric B, a tuple (A,-B) expresses both directions, and the key is computed once per element."
        },
        {
          "id": "cmp-faster",
          "text": "A cmp_to_key comparator is faster because it compares elements directly.",
          "contradictory": true
        },
        {
          "id": "cannot-mix-directions",
          "text": "Python's sort cannot mix ascending and descending fields in one pass.",
          "contradictory": true
        },
        {
          "id": "consistent-comparator",
          "text": "A comparator that consistently compares A ascending then B descending expresses the same order; cmp_to_key permits it, with repeated callback cost."
        }
      ],
      "acceptableApproachIds": [
        "tuple-key"
      ],
      "modelExplanation": "For numeric B, key=lambda x: (x.a, -x.b). Each key is computed once. For strings or arbitrary comparable B, stable-sort by B descending, then stable-sort by A ascending; the last pass preserves B order on A ties. cmp_to_key is also valid if its comparator defines a consistent order, but may call Python comparison code many times.",
      "alternatives": [
        {
          "approachId": "cmp-function",
          "conditions": "The comparator must define a consistent ordering matching A ascending then B descending.",
          "tradeoff": "Usually more Python callbacks than computing a key once.",
          "requiredReasonIds": [
            "consistent-comparator"
          ]
        }
      ]
    }
  }
],

  review: `Customize sorting with a **key function** (\`sorted(items, key=f)\`) and \`reverse=True\`; use a **tuple key** for multi-level ordering with tie-breaks. The engine is **Timsort** — **stable** and **O(n log n)** (adaptive O(n) best) — and the key is computed once per element. Prefer keys over comparator functions, which are slower.`,

  expectedOutput: "['a', 'bb', 'dd', 'ccc']\n[3, 2, 1]\n",

  references: [
  {
    "url": "https://docs.python.org/3.14/howto/sorting.html",
    "title": "sort reference",
    "section": "Key Functions; Sort Stability; Ascending and Descending; comparison functions",
    "topic": "sorting/comparators",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Keys are evaluated once; ties remain stable, including reverse; multiple stable passes express mixed directions."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  },
  {
    "url": "https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c",
    "title": "CPython 3.14.2 list implementation",
    "section": "list_sort_impl; key allocation; merge routines",
    "topic": "sorting/comparators",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Keys and merge buffers can occupy linear auxiliary storage."
    ],
    "accessDate": "2026-10-10",
    "conventions": []
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "c596b71084ba6c82",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
