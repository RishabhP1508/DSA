/**
 * Lesson: Custom ordering / comparators (Sorting). Verified on CPython 3.14.
 * Output: "['a', 'bb', 'dd', 'ccc']\n[3, 2, 1]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Sort by a custom key instead of the natural order.
words = ["bb", "a", "ccc", "dd"]
# key=len sorts by length; ties keep original order (stable).
print(sorted(words, key=len))
# reverse=True sorts high-to-low.
nums = [3, 1, 2]
print(sorted(nums, reverse=True))`;

export const comparators: LessonDefinition = {
  id: "comparators",
  title: "Custom Ordering and Comparators",
  area: "Sorting",
  prerequisites: ["merge-sort"],

  explanation: `Real problems rarely want the plain ascending order. Python lets you customize sorting with a **key function**: \`sorted(items, key=f)\` sorts by \`f(item)\` instead of the item itself, and \`reverse=True\` flips the direction. The underlying algorithm is **Timsort**, which is stable and **O(n log n)** — the key only changes *what* is compared, not the cost.

Here \`key=len\` orders the words by length (\`"a"\`, then the length-2 words, then \`"ccc"\`), and because Timsort is **stable**, the two length-2 words keep their original relative order (\`"bb"\` before \`"dd"\`). Using \`reverse=True\` sorts numbers from high to low.

For **multi-level** ordering, return a **tuple** key: \`key=lambda p: (p.age, p.name)\` sorts by age, breaking ties by name. This is far cleaner and less error-prone than writing a pairwise comparator (Python's old \`cmp\` is gone; use \`functools.cmp_to_key\` only when a key truly can't express the order). The recognition cue: "sort by some derived property or by several fields" → key function (and tuples for tie-breaking).`,

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
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of items being sorted" }],
    costModel: "Timsort does O(n log n) comparisons; the key function is called once per element (n calls), each assumed O(1) here.",
    time: {
      bound: "O(n log n)",
      case: "worst",
      explanation: "sorted uses Timsort, which is O(n log n) in the worst and average case (and adaptively O(n) on already-ordered input). The key function is evaluated exactly once per element — n calls total — which adds O(n) and does not change the O(n log n) class (assuming each key call is O(1); an expensive key would add its own cost).",
      otherCases: [
        { case: "best", bound: "O(n)", note: "Timsort is adaptive: already-sorted input runs in O(n)." },
      ],
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "sorted returns a new list (O(n)), Timsort uses up to O(n) temporary space, and the computed keys are stored once per element (O(n)).",
      inputOutputNote: "The returned sorted list and the decorated keys are O(n); the input list is separate.",
    },
    derivation: [
      { lines: [4, 7], description: "Timsort performs O(n log n) comparisons.", cost: "O(n log n)", dimension: "time" },
      { lines: [4], description: "The key function is called once per element (n times).", cost: "O(n)", dimension: "time" },
      { lines: [4, 7], description: "New sorted list plus stored keys and Timsort buffers.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["The key function is O(1) per call (a costly key would add its own factor).", "Comparisons are O(1)."],
    tradeoffs: "A key function computes each key once (efficient); a comparator via functools.cmp_to_key calls the comparator O(n log n) times and is slower — use a key whenever the ordering can be expressed as one.",
    counters: [],
    fixedDataNote: "This run sorts 4 words by length and 3 numbers descending — tiny. The O(n log n) bound describes Timsort for size n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: sort by a custom key." },
    { line: 2, executable: true, explanation: "A list of words of varying length." },
    { line: 3, executable: false, explanation: "Comment: key=len; stable ties." },
    { line: 4, executable: true, explanation: "sorted by length → ['a', 'bb', 'dd', 'ccc']; 'bb' before 'dd' keeps input order (stable)." },
    { line: 5, executable: false, explanation: "Comment: reverse for descending." },
    { line: 6, executable: true, explanation: "A list of numbers." },
    { line: 7, executable: true, explanation: "sorted descending → [3, 2, 1]." },
  ],

  bindings: [
    { variable: "words", model: "array" },
    { variable: "nums", model: "array" },
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
      id: "cmp-complete-1",
      kind: "complete-code",
      prompt: "Sort people (tuples of (name, age)) by age ascending, breaking ties by name.",
      starterCode: "people = [('Bo', 30), ('Al', 30), ('Cy', 25)]\n# TODO: sort by age, then name\nprint(sorted(people, key=None))",
      expected: "people = [('Bo', 30), ('Al', 30), ('Cy', 25)]\nprint(sorted(people, key=lambda p: (p[1], p[0])))",
      hints: ["Sort by two fields with a tuple key.", "First element of the tuple is the primary sort key.", "key=lambda p: (p[1], p[0]) — age then name."],
    },
    {
      id: "cmp-choose-1",
      kind: "choose-approach",
      prompt: "You want to sort by field A ascending and field B descending together. What's the clean way in Python, and why avoid a cmp function?",
      expected: "Use a tuple key that negates the descending field, e.g. key=lambda x: (x.a, -x.b). A key is computed once per element (fast); cmp_to_key calls a comparator O(n log n) times and is slower.",
      hints: ["Can you express both orders in one key?", "Negate the field that should be descending.", "key=lambda x: (x.a, -x.b); avoid slow cmp functions."],
    },
  ],

  review: `Customize sorting with a **key function** (\`sorted(items, key=f)\`) and \`reverse=True\`; use a **tuple key** for multi-level ordering with tie-breaks. The engine is **Timsort** — **stable** and **O(n log n)** (adaptive O(n) best) — and the key is computed once per element. Prefer keys over comparator functions, which are slower.`,

  expectedOutput: "['a', 'bb', 'dd', 'ccc']\n[3, 2, 1]\n",

  references: [
    {
      url: "https://docs.python.org/3/howto/sorting.html",
      title: "Sorting Techniques — Python HOWTO",
      section: "Key Functions / reverse / stability",
      topic: "sorting/comparators",
      purpose: "Confirm key-function and reverse semantics, stability, and that the key is called once per element.",
      verifiedClaims: ["sorted accepts a key function and reverse flag", "Python sorts are stable", "The key function is called once per element"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://en.wikipedia.org/wiki/Timsort",
      title: "Timsort — Wikipedia",
      section: "Complexity",
      topic: "sorting/comparators",
      purpose: "Cross-check that Python's sort is Timsort, O(n log n) worst case, adaptive, and stable.",
      verifiedClaims: ["Timsort is a stable, adaptive O(n log n) sort"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "c640669672b5c73f",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
