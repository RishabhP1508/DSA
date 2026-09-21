/**
 * Lesson: Anagrams (Strings). Verified on CPython 3.14. Output: "True\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Two strings are anagrams if they use the same letters.
a = "listen"
b = "silent"
# Sorting both puts their letters in the same order if they match.
print(sorted(a) == sorted(b))`;

export const anagrams: LessonDefinition = {
  id: "anagrams",
  title: "Anagrams",
  area: "Strings",
  prerequisites: ["string-frequency"],

  explanation: `Two strings are **anagrams** if one is a rearrangement of the other — same characters, same counts, different order (\`"listen"\` / \`"silent"\`). There are two classic tests, and comparing them is a great complexity lesson.

The **sorting** method: \`sorted(a) == sorted(b)\`. If the multiset of characters is equal, sorting both produces identical sequences. It is a one-liner, but sorting costs **O(n log n)**.

The **frequency-map** method: count characters in each string (from the frequency lesson) and compare the maps. Building two maps and comparing them is **O(n)** time and **O(k)** space — asymptotically faster than sorting. For a fixed alphabet the map even fits in O(1) space.

So both are correct, but they sit at different complexities: **O(n log n)** (sorting, O(1)-ish extra space) versus **O(n)** (counting, O(k) space). The frequency approach also naturally handles "are these two the same multiset?" style questions and grouping anagrams together.`,

  vocabulary: [
    { term: "Anagram", definition: "A string formed by rearranging the letters of another." },
    { term: "Multiset of characters", definition: "The characters with their counts, ignoring order." },
    { term: "sorted(s)", definition: "A list of the characters of s in sorted order." },
    { term: "Canonical form", definition: "A normalized representation (sorted letters, or a count map) that equal anagrams share." },
  ],

  concepts: {
    purpose: "Anagram tests show two correct solutions at different complexities (sorting vs counting).",
    operations: "Compare sorted characters, or compare frequency maps.",
    uses: "Anagram detection, grouping anagrams, checking permutations of a string.",
    tradeoffs: "Sorting: O(n log n), tiny code. Counting: O(n) time, O(k) space, faster for large n.",
    commonMistakes: "Forgetting different lengths cannot be anagrams (quick reject); ignoring case/spaces when required; assuming sorting is O(n).",
    edgeCases: "Different lengths → not anagrams. Empty strings are anagrams of each other. Case/space sensitivity depends on the problem.",
  },

  complexity: [
    { operation: "Sorting method", best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)", note: "Two sorts of length-n strings." },
    { operation: "Frequency method", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(k)", note: "Count both, compare maps; faster asymptotically." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the length of each string" },
      { symbol: "k", meaning: "the number of distinct characters (for the counting method)" },
    ],
    costModel: "Sorting n characters is O(n log n). The shown code uses the sorting method; the counting alternative is O(n).",
    time: {
      bound: "O(n log n)",
      case: "worst",
      explanation: "The code sorts both strings — each sort is O(n log n) — then compares the two length-n lists in O(n). The dominant term is the sort, so this method is O(n log n). The frequency-map alternative avoids sorting and runs in O(n).",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "sorted(a) and sorted(b) each build a new list of n characters, so the sorting method uses O(n) auxiliary space. The counting method uses only O(k).",
      inputOutputNote: "The two input strings are the input; the sorted lists are the extra allocation.",
    },
    derivation: [
      { lines: [5], description: "Sorting each length-n string is O(n log n); this dominates.", cost: "O(n log n)", dimension: "time" },
      { lines: [5], description: "Comparing the two sorted lists is O(n).", cost: "O(n)", dimension: "time" },
      { lines: [5], description: "Two sorted lists of n characters.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Character comparisons for sorting are O(1).", "No normalization applied in this simple version."],
    tradeoffs: "Counting characters compares two maps in O(n) time and O(k) space — asymptotically faster than sorting's O(n log n); sorting wins only on brevity.",
    fixedDataNote: "This run compares 'listen'/'silent' (n=6, anagrams → True). The O(n log n) bound describes the sorting method for any n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: anagrams use the same letters." },
    { line: 2, executable: true, explanation: "First string." },
    { line: 3, executable: true, explanation: "Second string." },
    { line: 4, executable: false, explanation: "Comment: sorting aligns matching letters." },
    { line: 5, executable: true, explanation: "sorted('listen') == sorted('silent') → both ['e','i','l','n','s','t'] → True." },
  ],

  bindings: [
    { variable: "a", model: "string" },
    { variable: "b", model: "string" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "The sorting method is O(n log n). What is the frequency-map method's time and space, and why is it faster?", answer: "O(n) time, O(k) space — counting characters avoids the O(n log n) sort.", explanation: "Building two frequency maps is a linear pass each, and comparing maps is O(k); there is no sort, so it is asymptotically faster than O(n log n)." },
  ],

  experiments: [
    "Test two non-anagrams and confirm False.",
    "Add a length check (len(a) != len(b) → not anagrams) as a fast reject.",
    "Rewrite using frequency maps and compare the approaches.",
  ],

  exercises: [
    {
      id: "ana-complete-1",
      kind: "complete-code",
      prompt: "Write is_anagram using the O(n) frequency-map approach (compare Counter of each).",
      starterCode: "from collections import Counter\ndef is_anagram(a, b):\n    # TODO: compare character counts\n    pass",
      expected: "from collections import Counter\ndef is_anagram(a, b):\n    return Counter(a) == Counter(b)",
      hints: ["Anagrams have identical character counts.", "Counter builds a frequency map.", "return Counter(a) == Counter(b)"],
    },
    {
      id: "ana-choose-1",
      kind: "choose-approach",
      prompt: "For very long strings, which anagram test scales better and what are the complexities?",
      expected: "The frequency-map method: O(n) time, O(k) space, versus sorting's O(n log n). Also reject early if lengths differ.",
      hints: ["Sorting is O(n log n).", "Counting is a single linear pass.", "O(n) beats O(n log n) for large n."],
    },
  ],

  review: `**Anagrams** share the same character multiset. Test by comparing **sorted** strings (**O(n log n)**, O(n) space) or comparing **frequency maps** (**O(n)** time, **O(k)** space). Both are correct; counting scales better. A length mismatch is an instant "no". This is a clean example of two solutions at different complexities.`,

  expectedOutput: "True\n",

  references: [
    {
      url: "https://docs.python.org/3/library/functions.html#sorted",
      title: "Built-in Functions — sorted — Python documentation",
      section: "sorted()",
      topic: "strings/anagrams",
      purpose: "Confirm sorted returns a new sorted list (used by the sorting method).",
      verifiedClaims: ["sorted(iterable) returns a new sorted list"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://docs.python.org/3/library/collections.html#collections.Counter",
      title: "collections — Counter — Python documentation",
      section: "Counter",
      topic: "strings/anagrams",
      purpose: "Confirm Counter builds a frequency map suitable for O(n) anagram comparison.",
      verifiedClaims: ["Counter(s) tallies element counts and supports equality comparison"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "97beb74ee9a56a67",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
