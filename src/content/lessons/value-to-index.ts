/**
 * Lesson: Value-to-index mapping (Hashing). Verified on CPython 3.14.
 * Output: "[0, 1]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Two Sum: find indices of two numbers that add up to target.
def two_sum(nums, target):
    seen = {}                       # value -> index seen so far
    for i, x in enumerate(nums):
        need = target - x           # the complement we need
        if need in seen:            # have we already seen it?
            return [seen[need], i]
        seen[x] = i                 # remember this value's index
    return []

print(two_sum([2, 7, 11, 15], 9))`;

export const valueToIndex: LessonDefinition = {
  id: "value-to-index",
  title: "Value-to-Index Mapping (Two Sum)",
  area: "Hashing",
  prerequisites: ["maps-sets"],

  explanation: `A hash map can store more than counts — it can remember **where** you saw each value (\`value → index\`). This unlocks the classic **Two Sum**: given \`nums\` and a \`target\`, find two indices whose values sum to \`target\`.

The brute force tries every pair — **O(n²)**. The hashing insight: as you scan, the partner each element needs is exactly \`need = target - x\`. If you've **already seen** \`need\`, you have your pair — and because you stored its index, you can return both positions. So you keep a map of \`value → index\` and, for each element, first check whether its complement is already in the map. One pass, **O(n)**.

This "look up the complement" idea is the general **value-to-index** pattern: whenever a problem asks "does a matching/partner element exist, and where?", a map from value to position turns an O(n²) pairwise search into an expected-O(1) lookup per element. The trade is **O(n)** space for the map.`,

  vocabulary: [
    { term: "Complement", definition: "The value you still need: target - current." },
    { term: "Value-to-index map", definition: "A dict mapping each seen value to the index where it occurred." },
    { term: "enumerate", definition: "Iterates (index, value) pairs together." },
    { term: "One-pass lookup", definition: "Checking for the partner while building the map in a single scan." },
  ],

  concepts: {
    purpose: "Find a matching/partner element and its position via a value→index map, avoiding O(n²) pair scans.",
    operations: "For each element, compute the needed complement; if it's in the map, return the pair; else record this value's index.",
    uses: "Two Sum, pair-with-difference, 'have I seen a partner?' problems, index recall.",
    tradeoffs: "O(n) time vs O(n) space; unlike sorting+two-pointers it preserves original indices.",
    commonMistakes: "Storing before checking (can pair an element with itself); overwriting an index when duplicates matter; returning values instead of indices.",
    edgeCases: "No valid pair returns []. Duplicate values (e.g. target = 2*x) work because the earlier index is stored first. A single element can't form a pair.",
  },

  complexity: [
    { operation: "Two Sum (hash map)", best: "O(1)", average: "O(n)", worst: "O(n)", space: "O(n)", note: "One pass; map holds up to n value→index entries." },
  ],

  complexityExplanation: {
    variables: [{ symbol: "n", meaning: "the number of elements in nums" }],
    costModel: "enumerate is O(1) per step; each map membership check and insert is expected O(1).",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "We scan each element once, doing an expected-O(1) complement lookup and an expected-O(1) insert. In the worst case (the pair is at the end, or none exists) we process all n elements — O(n). The best case is O(1) if the pair is found among the first two elements. This replaces the O(n²) brute-force pair search.",
      otherCases: [
        { case: "best", bound: "O(1)", note: "The first two elements already form the pair." },
      ],
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "If no pair is found early, the map ends up storing up to n value→index entries — O(n) auxiliary space.",
      inputOutputNote: "The array of n elements is the input; the value→index map (up to n) is auxiliary.",
    },
    derivation: [
      { lines: [4], description: "Scan each of the n elements once with enumerate.", cost: "O(n)", dimension: "time" },
      { lines: [5, 6, 8], description: "Per element: compute complement, expected-O(1) lookup and insert.", cost: "O(n)", dimension: "time" },
      { lines: [3, 8], description: "The map holds up to n value→index entries.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Values are hashable and map ops are expected O(1).", "Checking before inserting avoids pairing an element with itself."],
    tradeoffs: "Sorting then two pointers is O(n log n) time and O(1) extra space but loses original indices (you'd need to track them); the hash map is O(n) time and keeps indices directly.",
    counters: [{ label: "elements scanned", definition: "iterations of the loop (line 4)", countLines: [4] }],
    fixedDataNote: "This run finds indices [0, 1] (2 + 7 = 9) on the second element. The O(n) bound generalises to n elements.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: Two Sum via a value→index map." },
    { line: 2, executable: true, explanation: "Define two_sum(nums, target)." },
    { line: 3, executable: true, explanation: "seen maps a value to the index where it appeared." },
    { line: 4, executable: true, explanation: "Scan (index, value) pairs with enumerate." },
    { line: 5, executable: true, explanation: "The complement we need to reach target." },
    { line: 6, executable: true, explanation: "If the complement was already seen, we have a pair." },
    { line: 7, executable: true, explanation: "Return the stored index of the complement and the current index." },
    { line: 8, executable: true, explanation: "Otherwise record this value's index (check-before-insert avoids self-pairing)." },
    { line: 9, executable: true, explanation: "No pair found → []." },
    { line: 10, executable: false, explanation: "Blank line." },
    { line: 11, executable: true, explanation: "two_sum([2,7,11,15], 9) → [0, 1] (2 + 7)." },
  ],

  bindings: [
    {
      variable: "nums",
      model: "array",
      overlays: [{ role: "pointer", label: "i", source: "i" }],
    },
    { variable: "seen", model: "dict" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why check `need in seen` before inserting the current value, and how does this handle target = 2*x with two equal values?", answer: "Checking first prevents pairing an element with itself; for two equal values, the first is stored, then the second finds it as its complement — returning the two distinct indices.", explanation: "Insert-after-check ensures the map only contains earlier elements. With duplicates summing to target, the earlier index is recorded and the later element matches it, yielding two different positions." },
  ],

  experiments: [
    "Try a target with no valid pair and confirm it returns [].",
    "Use duplicates like [3, 3] with target 6 and see indices [0, 1].",
    "Compare with a brute-force double loop and count operations.",
  ],

  exercises: [
    {
      id: "vti-complete-1",
      kind: "complete-code",
      prompt: "Complete Two Sum: return indices of the pair summing to target.",
      starterCode: "def two_sum(nums, target):\n    seen = {}\n    for i, x in enumerate(nums):\n        need = target - x\n        # TODO: return the pair if need was seen; else record x\n        pass\n    return []",
      expected: "def two_sum(nums, target):\n    seen = {}\n    for i, x in enumerate(nums):\n        need = target - x\n        if need in seen:\n            return [seen[need], i]\n        seen[x] = i\n    return []",
      hints: ["Check if the complement is already in the map.", "Return its stored index with the current index.", "Otherwise store seen[x] = i."],
    },
    {
      id: "vti-choose-1",
      kind: "choose-approach",
      prompt: "Two Sum with a hash map is O(n)/O(n). When would you instead sort and use two pointers, and what changes?",
      expected: "When you don't need original indices and want O(1) extra space: sort then use converging two pointers, O(n log n) time. But sorting scrambles indices, so it's worse when the answer must be original positions.",
      hints: ["What does the hash map preserve that sorting loses?", "Original indices.", "Two pointers save space but need sorted data and lose indices."],
    },
  ],

  review: `**Value-to-index mapping** stores \`value → position\` so you can answer "have I seen the partner, and where?" in expected **O(1)**. **Two Sum** uses it: for each element check whether \`target - x\` was already seen, else record \`x\`'s index — one pass, **O(n)** time / **O(n)** space, beating the O(n²) pair scan and preserving original indices.`,

  expectedOutput: "[0, 1]\n",

  references: [
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Arrays & Hashing — Two Sum",
      topic: "hashing/value-to-index",
      purpose: "Confirm the value→index hash-map approach to Two Sum and its O(n) complexity.",
      verifiedClaims: ["Two Sum is solved in O(n) with a value→index hash map checking the complement"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://docs.python.org/3/library/functions.html#enumerate",
      title: "Built-in Functions — enumerate — Python documentation",
      section: "enumerate",
      topic: "hashing/value-to-index",
      purpose: "Confirm enumerate yields (index, value) pairs used to record positions.",
      verifiedClaims: ["enumerate yields (index, item) pairs"],
      accessDate: "2026-09-20",
    },
  ],
};
