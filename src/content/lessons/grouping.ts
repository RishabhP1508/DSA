/**
 * Lesson: Grouping (Hashing). Verified on CPython 3.14.
 * Output: "[['eat', 'tea', 'ate'], ['tan', 'nat']]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Group items that share a computed key (group anagrams).
def group_anagrams(words):
    groups = {}
    for w in words:
        key = "".join(sorted(w))          # canonical key: sorted letters
        groups.setdefault(key, []).append(w)  # append to that key's list
    return list(groups.values())

print(group_anagrams(["eat", "tea", "tan", "ate", "nat"]))`;

export const grouping: LessonDefinition = {
  id: "grouping",
  title: "Grouping by Key",
  area: "Hashing",
  prerequisites: ["maps-sets", "anagrams"],

  explanation: `**Grouping** collects items that share some property by mapping a **computed key → list of items**. The recipe is universal: compute a **canonical key** that is identical for items that belong together, then append each item to that key's bucket in a dict.

The classic example is **grouping anagrams**. Two words are anagrams exactly when their **sorted letters** match, so \`"".join(sorted(w))\` is a canonical key: \`"eat"\`, \`"tea"\`, and \`"ate"\` all map to \`"aet"\`. We use \`dict.setdefault(key, [])\` (or a \`defaultdict(list)\`) to create the bucket on first use, then append. One pass groups everything.

The cost is **O(n · L log L)** for n words of length up to L (the sort dominates each key), or O(n) groupings otherwise — and **O(n · L)** space for the buckets. The choice of **canonical key** is the whole art: sorted letters for anagrams, a rounded value for near-duplicates, \`x % k\` for buckets. The cue: "group items that are 'the same' under some transformation" → hash by that transformation.`,

  vocabulary: [
    { term: "Grouping", definition: "Partitioning items into buckets that share a key." },
    { term: "Canonical key", definition: "A normalized value identical for items in the same group (e.g. sorted letters)." },
    { term: "setdefault / defaultdict", definition: "Create a bucket on first use so you can append without a KeyError." },
    { term: "Bucket", definition: "The list of items sharing one key." },
  ],

  concepts: {
    purpose: "Partition items into groups by a shared computed key in one pass.",
    operations: "Compute a canonical key per item; append the item to key's list in a dict.",
    uses: "Group anagrams, bucketing by property, deduping variants, category counts.",
    tradeoffs: "One O(n) pass plus per-item key cost; O(n) space for buckets. The key function determines correctness.",
    commonMistakes: "Indexing a missing key instead of setdefault/defaultdict (KeyError); an unstable/non-canonical key (groups split or merge wrongly); using an unhashable key.",
    edgeCases: "Empty input yields no groups. Single-item groups are fine. Items that are all distinct produce n singleton groups.",
  },

  complexity: [
    { operation: "Group anagrams", best: "O(n*L log L)", average: "O(n*L log L)", worst: "O(n*L log L)", space: "O(n*L)", note: "n words, length up to L; sorting each key dominates." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of items (words)" },
      { symbol: "L", meaning: "the maximum length of an item (word)" },
    ],
    costModel: "Computing a key sorts up to L characters (O(L log L)); the dict append is expected O(1).",
    time: {
      bound: "O(n*L log L)",
      case: "worst",
      explanation: "For each of the n words we build its canonical key by sorting up to L letters — O(L log L) — then do an expected-O(1) dict append. Multiplying, the total is O(n · L log L). The sorting of keys dominates; if keys were computed in O(L) (e.g. a letter-count tuple) it would be O(n · L).",
    },
    space: {
      bound: "O(n*L)",
      case: "worst",
      explanation: "The buckets together store all n words (each up to length L), plus the keys — O(n · L) space.",
      inputOutputNote: "The grouped lists are the required output; their total size is O(n·L).",
    },
    derivation: [
      { lines: [4], description: "Process each of the n words once.", cost: "O(n)", dimension: "time" },
      { lines: [5], description: "Compute the canonical key by sorting up to L letters.", cost: "O(n*L log L)", dimension: "time" },
      { lines: [6], description: "Append to the key's bucket — expected O(1).", cost: "O(n)", dimension: "time" },
      { lines: [3, 6], description: "Buckets store all n words (length up to L).", cost: "O(n*L)", dimension: "space" },
    ],
    assumptions: ["Dict operations are expected O(1).", "Keys are hashable strings.", "Sorting L characters is O(L log L)."],
    tradeoffs: "Using a 26-length letter-count tuple as the key computes in O(L) instead of O(L log L), lowering time to O(n·L) — a common optimization when the alphabet is fixed.",
    counters: [{ label: "words grouped", definition: "iterations of the grouping loop (line 4)", countLines: [4] }],
    fixedDataNote: "This run groups 5 short words into 2 buckets. The O(n·L log L) bound describes scaling with count n and word length L.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: group items by a computed key." },
    { line: 2, executable: true, explanation: "Define group_anagrams(words)." },
    { line: 3, executable: true, explanation: "The dict of key → list of words." },
    { line: 4, executable: true, explanation: "Process each word." },
    { line: 5, executable: true, explanation: "Canonical key: sort the letters so anagrams share it (e.g. 'eat'→'aet')." },
    { line: 6, executable: true, explanation: "setdefault creates the bucket if new, then append this word." },
    { line: 7, executable: true, explanation: "Return the grouped lists (insertion order of first-seen keys)." },
    { line: 8, executable: false, explanation: "Blank line." },
    { line: 9, executable: true, explanation: "Groups → [['eat','tea','ate'], ['tan','nat']]." },
  ],

  bindings: [
    { variable: "words", model: "array" },
    { variable: "groups", model: "dict" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why is `\"\".join(sorted(w))` a good grouping key for anagrams?", answer: "Because anagrams contain the same letters, so sorting them produces an identical string — a canonical key shared by exactly the words that are anagrams of each other.", explanation: "Sorting normalizes letter order, collapsing all permutations of the same multiset of letters to one key. Words are anagrams iff their sorted forms are equal, so this key groups them correctly." },
  ],

  experiments: [
    "Use a 26-length letter-count tuple as the key and note the O(L) key cost.",
    "Group numbers by x % 3 to bucket by remainder.",
    "Replace setdefault with a collections.defaultdict(list).",
  ],

  exercises: [
    {
      id: "grp-complete-1",
      kind: "complete-code",
      prompt: "Group words by their first letter into a dict of lists.",
      starterCode: "def by_first_letter(words):\n    groups = {}\n    for w in words:\n        # TODO: append w to the bucket for its first letter\n        pass\n    return groups",
      expected: "def by_first_letter(words):\n    groups = {}\n    for w in words:\n        groups.setdefault(w[0], []).append(w)\n    return groups",
      hints: ["The key is the first character w[0].", "Create the bucket on first use.", "groups.setdefault(w[0], []).append(w)"],
    },
    {
      id: "grp-choose-1",
      kind: "choose-approach",
      prompt: "For grouping anagrams over a fixed lowercase alphabet, what key lowers the time below O(n·L log L), and to what?",
      expected: "A 26-length count tuple (how many of each letter) as the key: it's computed in O(L) without sorting, giving O(n·L) total.",
      hints: ["What makes the sort unnecessary?", "Count letters instead of sorting them.", "A fixed-size count tuple key → O(L) per word, O(n·L) total."],
    },
  ],

  review: `**Grouping** maps a **canonical key → list of items**: compute a key that's identical for items in the same group (sorted letters for anagrams), then append each item to its bucket with \`setdefault\`/\`defaultdict\`. It's one pass, **O(n·L log L)** with sorted keys (or O(n·L) with count-tuple keys), **O(n·L)** space. Choosing the right canonical key is the core skill.`,

  expectedOutput: "[['eat', 'tea', 'ate'], ['tan', 'nat']]\n",

  references: [
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Arrays & Hashing — Group Anagrams",
      topic: "hashing/grouping",
      purpose: "Confirm the canonical-key hashing approach to grouping anagrams and its complexity.",
      verifiedClaims: ["Grouping anagrams hashes each word by a canonical key (sorted letters or letter counts)"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://docs.python.org/3/library/stdtypes.html#dict.setdefault",
      title: "Built-in Types — dict.setdefault — Python documentation",
      section: "setdefault",
      topic: "hashing/grouping",
      purpose: "Confirm setdefault creates a default bucket on first access.",
      verifiedClaims: ["dict.setdefault(key, default) inserts and returns default if key is absent"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "736c9d532e2aea03",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
