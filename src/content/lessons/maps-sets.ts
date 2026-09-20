/**
 * Lesson: Maps and sets (Hashing). Verified on CPython 3.14.
 * Output: "2\nTrue\n2\nTrue\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# A dict maps keys to values; a set stores unique elements.
m = {"a": 1, "b": 2}
m["c"] = 3               # insert/update: expected O(1)
print(m["b"])            # lookup by key: expected O(1)
print("a" in m)          # membership: expected O(1)

s = set()
s.add(5); s.add(5); s.add(7)   # duplicates ignored
print(len(s))            # 2 distinct elements
print(5 in s)            # membership: expected O(1)`;

export const mapsSets: LessonDefinition = {
  id: "maps-sets",
  title: "Maps and Sets (Hashing)",
  area: "Hashing",
  prerequisites: ["variables-and-types", "representations"],

  explanation: `A **hash map** (Python \`dict\`) stores **key → value** pairs, and a **hash set** (Python \`set\`) stores **unique values**. Both are built on **hashing**: a hash function turns a key into an array index, so insert, delete, lookup, and membership are all **expected O(1)** — you jump straight to the slot instead of scanning.

That O(1) is what makes hashing the single most useful problem-solving tool in this course. "Have I seen this before?", "what's the value for this key?", "how many of each?" — all become constant-time questions. The catch is that it's **expected** O(1), not guaranteed: hash **collisions** (two keys landing in the same slot) are resolved (by chaining or probing) and, in a pathological worst case, operations can degrade to O(n). For normal data, treat dict/set operations as O(1).

Two practical rules: keys (and set elements) must be **hashable** (immutable — ints, strings, tuples work; lists don't), and a \`set\` automatically discards duplicates. Sets also support fast union/intersection/difference. Recognising "I need fast lookups or dedup" is the cue to reach for a dict or set.`,

  vocabulary: [
    { term: "Hash map (dict)", definition: "A key→value store with expected O(1) insert/lookup." },
    { term: "Hash set (set)", definition: "A collection of unique elements with expected O(1) membership." },
    { term: "Hash function", definition: "Maps a key to a slot index, enabling direct access." },
    { term: "Collision", definition: "Two keys hashing to the same slot; resolved by chaining/probing." },
    { term: "Hashable", definition: "Usable as a key: immutable with a stable hash (int, str, tuple)." },
    { term: "Load factor / resize", definition: "As it fills, the table grows to keep operations fast (amortized)." },
  ],

  concepts: {
    purpose: "Provide expected O(1) lookup, insertion, and membership — the backbone of most efficient algorithms.",
    operations: "dict: d[k], d[k]=v, k in d, d.get(k, default). set: add, in, union/intersection/difference.",
    uses: "Lookups, deduplication, counting, grouping, caching, adjacency lists for graphs.",
    tradeoffs: "Expected O(1) time but O(n) space and unordered semantics; worst case O(n) under bad collisions.",
    commonMistakes: "Using an unhashable key (list) → TypeError; assuming worst-case O(1) (it's expected); indexing a missing key (KeyError) instead of get; relying on set ordering.",
    edgeCases: "Duplicate set inserts are no-ops. Missing dict key raises KeyError (use get). Since Python 3.7 dicts preserve insertion order, but sets do not.",
  },

  complexity: [
    { operation: "dict/set insert, lookup, membership", best: "O(1)", average: "O(1)", worst: "O(n)", space: "O(n)", note: "Expected O(1) via hashing; O(n) worst case under heavy collisions." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of key/value pairs or set elements" }],
    costModel: "Hashing a key and jumping to its slot is O(1) on average; collisions add a small constant. Resizing is amortized O(1) per insert.",
    time: {
      bound: "O(1)",
      case: "expected",
      explanation: "Each dict/set operation hashes the key to a slot and accesses it directly, which is expected O(1) — independent of how many items are stored. This program does a fixed number of such operations, so it is constant work overall. The 'expected' qualifier matters: adversarial keys causing many collisions can push a single operation toward O(n), but for ordinary data it is O(1).",
      otherCases: [
        { case: "worst", bound: "O(n)", note: "Pathological collisions (all keys in one bucket) degrade an operation to a linear scan." },
      ],
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "The table stores all n entries plus some slack slots to keep the load factor low, so space is O(n).",
      inputOutputNote: "The dict/set IS the data structure you build; its O(n) size is inherent.",
    },
    derivation: [
      { lines: [3, 4, 5], description: "Insert, lookup, and membership on the dict — each expected O(1).", cost: "O(1)", dimension: "time" },
      { lines: [8, 9, 10], description: "Set add and membership — each expected O(1); duplicates are no-ops.", cost: "O(1)", dimension: "time" },
      { lines: [2, 7], description: "The dict and set hold up to n entries.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Keys are hashable and well-distributed (expected O(1)).", "Amortized resizing keeps inserts O(1)."],
    tradeoffs: "A sorted structure (or list) gives ordered/range queries but O(log n) or O(n) lookups; a hash map gives expected O(1) point lookups but no ordering and O(n) space.",
    counters: [],
    fixedDataNote: "This run does a handful of dict/set operations — constant work. The O(1)/O(n) bounds describe scaling to n entries.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: dict maps keys→values; set stores unique elements." },
    { line: 2, executable: true, explanation: "Create a dict with two key/value pairs." },
    { line: 3, executable: true, explanation: "Insert a new key 'c' → 3 (expected O(1))." },
    { line: 4, executable: true, explanation: "Look up m['b'] → 2 (expected O(1))." },
    { line: 5, executable: true, explanation: "Membership test 'a' in m → True (expected O(1))." },
    { line: 6, executable: false, explanation: "Blank line." },
    { line: 7, executable: true, explanation: "Create an empty set." },
    { line: 8, executable: true, explanation: "Add 5 twice (duplicate ignored) and 7." },
    { line: 9, executable: true, explanation: "len is 2 — only distinct elements are kept." },
    { line: 10, executable: true, explanation: "Membership 5 in s → True (expected O(1))." },
  ],

  bindings: [
    { variable: "m", model: "dict" },
    { variable: "s", model: "set" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why do we say dict/set operations are 'expected' O(1) rather than 'always' O(1)?", answer: "Because hashing gives O(1) on average, but collisions (many keys in one slot) can, in the worst case, degrade an operation to O(n).", explanation: "The average O(1) relies on keys distributing across slots. Pathological inputs that collide heavily turn a lookup into a scan of one overloaded bucket, so the guarantee is expected/average, not worst-case." },
  ],

  experiments: [
    "Try using a list as a dict key and observe the TypeError (unhashable).",
    "Compare set intersection/union with equivalent loops.",
    "Add many duplicates to a set and confirm len counts only distinct values.",
  ],

  exercises: [
    {
      id: "ms-complete-1",
      kind: "complete-code",
      prompt: "Use a set to return the number of DISTINCT values in a list.",
      starterCode: "def distinct_count(nums):\n    # TODO: return how many unique values are in nums\n    pass",
      expected: "def distinct_count(nums):\n    return len(set(nums))",
      hints: ["A set removes duplicates automatically.", "Build a set from the list.", "return len(set(nums))"],
    },
    {
      id: "ms-choose-1",
      kind: "choose-approach",
      prompt: "You must check membership against a fixed collection millions of times. list, sorted list + binary search, or set? Give complexities.",
      expected: "A set — expected O(1) membership. A list is O(n) per check; a sorted list + binary search is O(log n). For pure membership, the set wins.",
      hints: ["Which gives the fastest single membership test?", "list is O(n), sorted+binary is O(log n).", "A set is expected O(1)."],
    },
  ],

  review: `**Hash maps (dict)** and **hash sets (set)** use hashing to give **expected O(1)** insert, lookup, and membership — the foundation of efficient counting, dedup, and lookups — at **O(n)** space. It's *expected* O(1): collisions can degrade to O(n) in the worst case. Keys/elements must be **hashable** (immutable), and sets drop duplicates automatically.`,

  expectedOutput: "2\nTrue\n2\nTrue\n",

  references: [
    {
      url: "https://docs.python.org/3/tutorial/datastructures.html#dictionaries",
      title: "Data Structures — Dictionaries / Sets — Python documentation",
      section: "Dictionaries and Sets",
      topic: "hashing/maps-sets",
      purpose: "Confirm dict key→value semantics, set uniqueness, and hashable-key requirement.",
      verifiedClaims: ["dict maps hashable keys to values", "set stores unique elements", "keys must be immutable/hashable"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://wiki.python.org/moin/TimeComplexity",
      title: "TimeComplexity — Python Wiki",
      section: "dict / set",
      topic: "hashing/maps-sets",
      purpose: "Confirm average-case O(1) and worst-case O(n) for dict/set operations.",
      verifiedClaims: ["dict/set get, set item, and membership are average O(1), worst O(n)"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 15,
    contentHash: "72118e4f2237600c",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
