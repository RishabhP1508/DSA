/**
 * Lesson: Frequency counting with maps (Hashing). Verified on CPython 3.14.
 * Output: "{1: 2, 2: 3, 3: 3}\n2\n". (2 and 3 tie at count 3; most_common
 * returns 2, the first-seen among ties.)
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Count occurrences of arbitrary hashable items (not just characters).
from collections import Counter

nums = [2, 3, 2, 1, 2, 3, 3, 1]
freq = Counter(nums)          # one pass, expected O(1) per item
# Print in a fixed order so the output is deterministic.
print({k: freq[k] for k in sorted(freq)})
# most_common gives the highest-frequency item.
print(freq.most_common(1)[0][0])`;

export const hashingFrequency: LessonDefinition = {
  id: "hashing-frequency",
  title: "Frequency Counting with Maps",
  area: "Hashing",
  prerequisites: ["maps-sets"],

  explanation: `The **string frequency** lesson counted characters; here we generalize: a **frequency map** counts occurrences of **any hashable items** — numbers, tuples, objects — in a single **O(n)** pass, because each dict update is expected O(1). This is the most reused hashing pattern in the course.

Python's \`collections.Counter\` is a purpose-built dict for exactly this: \`Counter(iterable)\` tallies everything in one call, supports \`most_common(k)\` to get the top-k frequent items, and even does arithmetic (adding/subtracting counts). Under the hood it is still a hash map, so counting is **O(n)** time and **O(k)** space where k is the number of distinct items.

Frequency maps are the engine behind anagrams, "majority element", "top-K frequent", first-unique, and many grouping problems. The difference from the earlier lesson is the *domain*: the same technique works on any hashable data, and \`Counter\` packages it with convenient helpers. The cue is any question of the form "how many of each?" or "which appears most/least?"`,

  vocabulary: [
    { term: "Frequency map", definition: "A dict from item to its count." },
    { term: "Counter", definition: "A dict subclass specialized for counting hashable items." },
    { term: "most_common(k)", definition: "Returns the k highest-frequency (item, count) pairs." },
    { term: "Distinct count (k)", definition: "The number of different items — the map's size." },
    { term: "Tally", definition: "Incrementing an item's count as you scan." },
  ],

  concepts: {
    purpose: "Count occurrences of any hashable items in one pass to answer 'how many of each' questions.",
    operations: "Counter(iterable) to tally; freq[item] to read; most_common(k) for top-k.",
    uses: "Anagrams, majority element, top-K frequent, first unique, grouping by count.",
    tradeoffs: "O(n) time and O(k) space; unordered by default (most_common sorts by count).",
    commonMistakes: "Assuming Counter is ordered by count (insertion order until most_common); iterating a dict and expecting a fixed order across versions; using it on unhashable items.",
    edgeCases: "Empty input gives an empty Counter. Missing key via Counter returns 0 (not KeyError). Ties in most_common resolve by first-seen order.",
  },

  complexity: [
    { operation: "Counter build", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(k)", note: "One pass; k distinct items." },
    { operation: "most_common(1)", best: "O(k)", average: "O(k)", worst: "O(k)", note: "Scans the k distinct items (heap for general k)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of items counted" },
      { symbol: "k", meaning: "the number of distinct items" },
    ],
    costModel: "Each tally is an expected-O(1) dict update. most_common(1) scans the k distinct entries.",
    time: {
      bound: "O(n)",
      case: "expected",
      explanation: "Building the Counter processes each of the n items once, each an expected-O(1) hash-map update — so counting is expected O(n). most_common(1) then scans the k distinct items to find the maximum, which is O(k) and at most O(n). The dominant cost is the O(n) counting pass.",
    },
    space: {
      bound: "O(k)",
      case: "worst",
      explanation: "The map stores one entry per DISTINCT item, so it uses O(k) space (bounded by n when all items differ).",
      inputOutputNote: "The input sequence of n items is separate; the Counter of size k is the auxiliary structure.",
    },
    derivation: [
      { lines: [5], description: "Counter(nums) tallies all n items, each expected O(1).", cost: "O(n)", dimension: "time" },
      { lines: [9], description: "most_common(1) scans the k distinct items.", cost: "O(k)", dimension: "time" },
      { lines: [5], description: "The Counter holds k distinct entries.", cost: "O(k)", dimension: "space" },
    ],
    assumptions: ["Items are hashable and dict ops are expected O(1).", "most_common(1) is O(k); general most_common(m) uses a heap (O(k log m))."],
    tradeoffs: "A manual dict loop does the same in O(n); Counter adds convenient helpers (most_common, arithmetic) at no asymptotic cost.",
    counters: [],
    fixedDataNote: "This run counts 8 items into 3 distinct keys (2 and 3 both appear 3 times); most_common(1) returns 2 as the first-seen among the tie. The O(n)/O(k) bounds generalise to any input.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: count arbitrary hashable items." },
    { line: 2, executable: true, explanation: "Import Counter, a dict specialized for counting." },
    { line: 3, executable: false, explanation: "Blank line." },
    { line: 4, executable: true, explanation: "The data to count (integers here, not characters)." },
    { line: 5, executable: true, explanation: "Counter(nums) tallies everything in one expected-O(n) pass." },
    { line: 6, executable: false, explanation: "Comment: print in sorted key order for determinism." },
    { line: 7, executable: true, explanation: "Build a dict of counts in sorted key order → {1: 2, 2: 3, 3: 3}." },
    { line: 8, executable: false, explanation: "Comment: most_common returns the top item(s)." },
    { line: 9, executable: true, explanation: "most_common(1)[0][0] → 2. Both 2 and 3 have count 3; most_common keeps the first-seen (2) among ties." },
  ],

  bindings: [
    { variable: "nums", model: "array" },
    { variable: "freq", model: "dict" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "This lesson and the string-frequency lesson use the same technique. What is the key difference, and why is the complexity the same?", answer: "The domain: here we count arbitrary hashable items (numbers/tuples/objects), not just characters. It's still one O(n) pass of expected-O(1) dict updates, so the complexity is identical.", explanation: "Frequency counting is domain-agnostic — any hashable item works. The mechanism (hash-map tally per element) and its O(n) time / O(k) space are unchanged, which is why a shared technique covers both subtopics." },
  ],

  experiments: [
    "Count tuples (e.g. coordinates) to see frequency counting on non-string data.",
    "Use most_common(2) to get the two most frequent items.",
    "Subtract two Counters to see count arithmetic.",
  ],

  exercises: [
    {
      id: "hf-choose-1",
      kind: "choose-approach",
      prompt: "Find the 'majority element' (appears more than n/2 times). How do frequency maps solve it, and what is the complexity?",
      expected: "Build a Counter in O(n), then take most_common(1); if its count > n/2 it's the majority. O(n) time, O(k) space. (Boyer–Moore voting does it in O(1) space, a further optimization.)",
      hints: ["Count occurrences first.", "Check the top item's count against n/2.", "O(n) time, O(k) space with a Counter."],
    },
    {
      id: "hf-complete-1",
      kind: "complete-code",
      prompt: "Return the first item in nums that appears exactly once, or None.",
      starterCode: "from collections import Counter\ndef first_unique(nums):\n    freq = Counter(nums)\n    # TODO: return the first item with count 1\n    return None",
      expected: "from collections import Counter\ndef first_unique(nums):\n    freq = Counter(nums)\n    for x in nums:\n        if freq[x] == 1:\n            return x\n    return None",
      hints: ["Count first, then scan in order.", "Return the first item whose count is 1.", "for x in nums: if freq[x] == 1: return x"],
    },
  ],

  review: `**Frequency counting** tallies any hashable items into a map in one **O(n)** pass (expected O(1) per update), using **O(k)** space for k distinct items. \`collections.Counter\` packages this with \`most_common\` and count arithmetic. It generalizes the string-frequency technique to arbitrary data and powers anagrams, majority element, and top-K problems.`,

  expectedOutput: "{1: 2, 2: 3, 3: 3}\n2\n",

  references: [
    {
      url: "https://docs.python.org/3/library/collections.html#collections.Counter",
      title: "collections — Counter — Python documentation",
      section: "Counter / most_common",
      topic: "hashing/frequency",
      purpose: "Confirm Counter tallies hashable items and most_common returns the highest-frequency entries.",
      verifiedClaims: ["Counter(iterable) tallies element counts", "most_common(k) returns the k most frequent (element, count) pairs", "missing keys return a count of 0"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "c54ebd74dbb32ec5",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
