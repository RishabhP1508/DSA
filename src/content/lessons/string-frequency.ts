/**
 * Lesson: Character frequency counting (Strings). Verified on CPython 3.14.
 * Output: "{'b': 1, 'a': 3, 'n': 2}\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Count how many times each character appears.
s = "banana"
freq = {}
for ch in s:
    # get(ch, 0) returns the current count or 0 if unseen.
    freq[ch] = freq.get(ch, 0) + 1
print(freq)`;

export const stringFrequency: LessonDefinition = {
  id: "string-frequency",
  title: "Character Frequency Counting",
  area: "Strings",
  prerequisites: ["loops", "representations"],

  explanation: `**Frequency counting** tallies how often each item appears, using a **dictionary** (hash map) from item → count. It is the workhorse behind anagram checks, "most common character", and many string problems.

You scan the string once and, for each character, increment its count. \`freq.get(ch, 0)\` reads the current count (or 0 if the character is new), and you add 1. Because dictionary read/write is **expected O(1)**, counting all n characters is **O(n)** time. The space is **O(k)** where k is the number of *distinct* characters — for text it is bounded by the alphabet, so often treated as O(1).

This "one pass building a map" shape is everywhere: it turns "how many / does it exist / group by" questions from repeated O(n) scans into a single O(n) pass with O(1) lookups afterward.`,

  vocabulary: [
    { term: "Frequency map", definition: "A dict from item to how many times it appears." },
    { term: "dict.get(key, default)", definition: "Returns the value for key, or default if the key is absent." },
    { term: "Distinct count (k)", definition: "The number of different keys — the map's size." },
    { term: "Hashing", definition: "The mechanism giving dicts expected O(1) lookups and inserts." },
  ],

  concepts: {
    purpose: "Frequency maps answer 'how many of each' in one pass, powering anagrams, dedup, and grouping.",
    operations: "Scan once; increment counts with get(key, 0) + 1; later read counts in O(1).",
    uses: "Anagram detection, most/least frequent element, first unique character, grouping.",
    tradeoffs: "Trades O(k) space for O(1) lookups and a single O(n) pass instead of repeated scans.",
    commonMistakes: "Indexing a missing key (KeyError) instead of using get or defaultdict/Counter; counting distinct chars as O(n) space when it is really O(k).",
    edgeCases: "Empty string yields an empty map. Case sensitivity: 'A' and 'a' are different keys unless normalized.",
  },

  complexity: [
    { operation: "Count frequencies", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(k)", note: "One pass; k distinct keys (bounded by alphabet)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of characters in the string" },
      { symbol: "k", meaning: "the number of distinct characters (map size)" },
    ],
    costModel: "Each dict get and set is expected O(1) via hashing. Each character is processed once.",
    time: {
      bound: "O(n)",
      case: "expected",
      explanation: "The loop runs once per character (n iterations), and each iteration does an expected-O(1) dict read and write. So counting is expected O(n). (In the pathological worst case of adversarial hash collisions, dict operations degrade, but for normal text this is O(n).)",
    },
    space: {
      bound: "O(k)",
      case: "worst",
      explanation: "The map stores one entry per DISTINCT character, so it uses O(k) space. For a fixed alphabet (e.g. lowercase letters) k is bounded by a constant, so this is effectively O(1).",
      inputOutputNote: "The string of n characters is the input; the frequency map of size k is the auxiliary structure.",
    },
    derivation: [
      { lines: [4, 6], description: "One pass over n characters, each an expected-O(1) dict update.", cost: "O(n)", dimension: "time" },
      { lines: [3, 6], description: "The map grows to k distinct keys.", cost: "O(k)", dimension: "space" },
    ],
    assumptions: ["Dict operations are expected O(1) under Python's hashing.", "k is the number of distinct characters."],
    tradeoffs: "Using collections.Counter(s) does the same in one call; the explicit loop is shown so the per-character cost is visible.",
    counters: [{ label: "characters counted", definition: "executions of the increment (line 6)", countLines: [6] }],
    fixedDataNote: "This run counts 'banana' (n=6, k=3). The O(n)/O(k) bounds generalise to any string.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: count each character." },
    { line: 2, executable: true, explanation: "The string to analyze." },
    { line: 3, executable: true, explanation: "Start with an empty frequency map." },
    { line: 4, executable: true, explanation: "Iterate over each character ch (n iterations)." },
    { line: 5, executable: false, explanation: "Comment: get returns the count or 0 if unseen." },
    { line: 6, executable: true, explanation: "Increment ch's count. Expected O(1) per character." },
    { line: 7, executable: true, explanation: "Print the map → {'b': 1, 'a': 3, 'n': 2} (insertion order)." },
  ],

  bindings: [
    { variable: "s", model: "string", overlays: [] },
    { variable: "freq", model: "dict" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why use freq.get(ch, 0) + 1 instead of freq[ch] + 1?", answer: "Because freq[ch] raises KeyError the first time ch is seen; get(ch, 0) returns 0 for unseen keys.", explanation: "The first occurrence of a character has no entry yet, so freq[ch] would fail. get(ch, 0) supplies a default of 0 so the increment works." },
  ],

  experiments: [
    "Count a string with repeated characters and watch the map values climb.",
    "Normalize case with s.lower() and compare the counts.",
    "Replace the loop with collections.Counter(s) and compare results.",
  ],

  exercises: [
    {
      id: "sf-complete-1",
      kind: "complete-code",
      prompt: "Complete the loop to build a frequency map of the characters in s.",
      starterCode: "s = 'apple'\nfreq = {}\nfor ch in s:\n    # TODO: increment the count for ch\n    pass\nprint(freq)",
      expected: "s = 'apple'\nfreq = {}\nfor ch in s:\n    freq[ch] = freq.get(ch, 0) + 1\nprint(freq)",
      hints: ["Read the current count safely.", "Use get with a default of 0.", "freq[ch] = freq.get(ch, 0) + 1"],
    },
    {
      id: "sf-choose-1",
      kind: "choose-approach",
      prompt: "You need to decide if two strings are anagrams. How do frequency maps help, and what is the complexity?",
      expected: "Build a frequency map of each string and compare them (equal maps ⇒ anagrams). O(n) time, O(k) space — better than sorting's O(n log n).",
      hints: ["Anagrams have identical character counts.", "Compare two frequency maps.", "O(n) time vs O(n log n) for sorting."],
    },
  ],

  review: `**Frequency counting** builds a dict from character to count in one **O(n)** pass with expected-**O(1)** updates, using **O(k)** space for k distinct characters. Use \`get(key, 0) + 1\` to avoid KeyError on first sight. It underlies anagrams, most-common, and grouping — replacing repeated scans with one pass plus O(1) lookups.`,

  expectedOutput: "{'b': 1, 'a': 3, 'n': 2}\n",

  references: [
    {
      url: "https://docs.python.org/3/library/stdtypes.html#dict.get",
      title: "Built-in Types — dict.get — Python documentation",
      section: "dict.get(key, default)",
      topic: "strings/frequency",
      purpose: "Confirm get returns the default for missing keys without raising.",
      verifiedClaims: ["dict.get(key, default) returns default when key is absent"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://wiki.python.org/moin/TimeComplexity",
      title: "TimeComplexity — Python Wiki",
      section: "dict — Get/Set Item",
      topic: "strings/frequency",
      purpose: "Confirm dict get/set are average O(1).",
      verifiedClaims: ["dict get/set are average-case O(1)"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "16033a74703248b4",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
