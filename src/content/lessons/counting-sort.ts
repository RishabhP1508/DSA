/**
 * Lesson: Counting sort (Sorting). Verified on CPython 3.14.
 * Output: "[1, 1, 2, 3, 3, 4, 5]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Counting sort: tally occurrences, then read them back in order.
def counting_sort(a):
    if not a:
        return []
    hi = max(a)                     # values range 0..hi
    counts = [0] * (hi + 1)         # a bucket per possible value
    for x in a:
        counts[x] += 1              # tally each value
    out = []
    for v in range(hi + 1):
        out.extend([v] * counts[v]) # emit each value counts[v] times
    return out

print(counting_sort([3, 1, 4, 1, 5, 2, 3]))`;

export const countingSort: LessonDefinition = {
  id: "counting-sort",
  title: "Counting Sort",
  area: "Sorting",
  prerequisites: ["string-frequency", "complexity"],

  explanation: `**Counting sort** breaks the "comparison sort" speed limit by not comparing elements at all. Instead it **tallies how many times each value occurs**, then reads the tallies back in value order. It works when the keys are **small non-negative integers** in a known range \`0..hi\`.

Because it only counts and emits, its cost is **O(n + hi)**: one pass over the n inputs to count, plus a pass over the \`hi + 1\` possible values to output. When the value range \`hi\` is comparable to n (small integers), that is effectively **linear** — faster than the O(n log n) lower bound for comparison sorts. But if \`hi\` is huge (e.g. sorting a few numbers up to a billion), the counts array wastes O(hi) space and time, and counting sort is the wrong tool.

Counting sort is the foundation of **radix sort** (which applies it digit by digit) and is naturally **stable** when implemented with prefix sums. The key recognition cue: "sorting small integers / bounded keys" → consider counting or radix instead of a comparison sort.`,

  vocabulary: [
    { term: "Counting sort", definition: "Sorting by tallying value frequencies and emitting them in order." },
    { term: "Key range (hi)", definition: "The maximum key value; determines the counts array size." },
    { term: "Non-comparison sort", definition: "A sort that never compares two elements directly." },
    { term: "Counts array", definition: "counts[v] = how many inputs equal v." },
  ],

  concepts: {
    purpose: "Sort small-integer keys in linear time by counting, beating comparison-sort limits.",
    operations: "Tally each value into a counts array; emit values in order by their counts.",
    uses: "Sorting bounded integers, grades, ages; the inner step of radix sort.",
    tradeoffs: "O(n + hi): linear when hi ~ n, but wasteful when the range hi is large; needs non-negative bounded keys.",
    commonMistakes: "Using it when the value range is huge (O(hi) blowup); assuming it works for arbitrary comparable objects; off-by-one in the counts size (hi + 1).",
    edgeCases: "Empty input returns []. Duplicates are handled naturally (counts > 1). Negative values need an offset shift.",
  },

  complexity: [
    { operation: "Counting sort", best: "O(n + hi)", average: "O(n + hi)", worst: "O(n + hi)", space: "O(n + hi)", note: "Linear when hi = O(n); wasteful when hi >> n." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of elements to sort" },
      { symbol: "hi", meaning: "the maximum key value (range is 0..hi)" },
    ],
    costModel: "Each tally and emit is O(1). The output step visits all hi+1 possible values.",
    time: {
      bound: "O(n + hi)",
      case: "worst",
      explanation: "One pass tallies all n inputs — O(n). A second pass walks the hi+1 possible values, emitting each the right number of times; the emitting totals n and the walk itself is O(hi). So the total is O(n + hi). When hi is about the size of n (small integer keys), this is effectively linear, beating the O(n log n) comparison-sort bound. When hi is far larger than n, the O(hi) term dominates and this is a poor choice.",
    },
    space: {
      bound: "O(n + hi)",
      case: "worst",
      explanation: "The counts array uses O(hi) space, and the output list uses O(n). If hi is enormous relative to n, the counts array is the wasteful part.",
      inputOutputNote: "The output list of n elements is required output; the counts array of size hi+1 is the auxiliary structure.",
    },
    derivation: [
      { lines: [7, 8], description: "One pass tallies all n inputs.", cost: "O(n)", dimension: "time" },
      { lines: [10, 11], description: "One pass over hi+1 values emits the sorted output (emits total n).", cost: "O(n + hi)", dimension: "time" },
      { lines: [6, 9], description: "counts array O(hi) plus output O(n).", cost: "O(n + hi)", dimension: "space" },
    ],
    assumptions: ["Keys are non-negative integers in 0..hi.", "hi is known (or computed as max(a))."],
    tradeoffs: "Comparison sorts are O(n log n) but work on any comparable data and any range; counting sort is linear only when the key range is small, and blows up in space/time when hi >> n.",
    counters: [
      { label: "tallies", definition: "executions of the count increment (line 8)", countLines: [8] },
    ],
    fixedDataNote: "This run sorts 7 values with hi=5, so O(n + hi) is tiny. The bound shows why a huge hi would make it wasteful.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: tally then read back in order." },
    { line: 2, executable: true, explanation: "Define counting_sort(a)." },
    { line: 3, executable: true, explanation: "Handle the empty input." },
    { line: 4, executable: true, explanation: "Return [] for empty." },
    { line: 5, executable: true, explanation: "Find the maximum value to size the counts array." },
    { line: 6, executable: true, explanation: "Create hi+1 buckets, all zero (O(hi) space)." },
    { line: 7, executable: true, explanation: "One pass over the n inputs..." },
    { line: 8, executable: true, explanation: "...incrementing the count for each value." },
    { line: 9, executable: true, explanation: "Prepare the output." },
    { line: 10, executable: true, explanation: "Walk values 0..hi in order." },
    { line: 11, executable: true, explanation: "Emit value v exactly counts[v] times — this produces sorted order." },
    { line: 12, executable: true, explanation: "Return the sorted list." },
    { line: 13, executable: false, explanation: "Blank line." },
    { line: 14, executable: true, explanation: "Sort [3,1,4,1,5,2,3] → [1, 1, 2, 3, 3, 4, 5]." },
  ],

  bindings: [
    { variable: "a", model: "array" },
    { variable: "counts", model: "array" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Counting sort is O(n + hi). When is it a great choice, and when is it a terrible one?", answer: "Great when hi is small (comparable to n) — then it's effectively linear; terrible when hi is huge relative to n (e.g. values up to a billion) — the O(hi) counts array wastes time and space.", explanation: "The hi term is the range of values. Small range → near-linear and beats O(n log n); huge range → the counts array dominates, making it worse than a comparison sort." },
  ],

  experiments: [
    "Sort a list with many duplicates and watch the counts climb.",
    "Set one value very large (e.g. 1000) and see the counts array balloon.",
    "Add an offset to handle negative values.",
  ],

  exercises: [
    {
      id: "cnt-choose-1",
      kind: "choose-approach",
      prompt: "You must sort 1,000,000 exam scores, each an integer 0–100. Counting sort or an O(n log n) comparison sort? Give the complexity.",
      expected: "Counting sort: hi = 100 is tiny, so it's O(n + hi) ≈ O(n) — linear and faster than O(n log n) here.",
      hints: ["What is the value range?", "0–100 is a tiny hi.", "O(n + hi) ≈ O(n) beats O(n log n)."],
    },
    {
      id: "cnt-complete-1",
      kind: "complete-code",
      prompt: "Complete the tally loop for counting sort.",
      starterCode: "counts = [0] * (hi + 1)\nfor x in a:\n    # TODO: tally x\n    pass",
      expected: "counts = [0] * (hi + 1)\nfor x in a:\n    counts[x] += 1",
      hints: ["Use x as the index into counts.", "Increment that bucket.", "counts[x] += 1"],
    },
  ],

  review: `**Counting sort** tallies value frequencies and reads them back in order — a **non-comparison** sort running in **O(n + hi)** time and space, where \`hi\` is the key range. It is near-linear (beating O(n log n)) when \`hi\` is small, but wasteful when \`hi >> n\`. It requires bounded non-negative integer keys and is the basis of radix sort.`,

  expectedOutput: "[1, 1, 2, 3, 3, 4, 5]\n",

  references: [
    {
      url: "https://cp-algorithms.com/sorting/counting_sort.html",
      title: "Counting sort — CP-Algorithms",
      section: "Algorithm and complexity",
      topic: "sorting/counting",
      purpose: "Confirm the counting-sort algorithm and its O(n + range) time/space.",
      verifiedClaims: ["Counting sort runs in O(n + k) where k is the value range", "It is a non-comparison sort for bounded integer keys"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://www.geeksforgeeks.org/counting-sort/",
      title: "Counting Sort — GeeksforGeeks",
      section: "Working and analysis",
      topic: "sorting/counting",
      purpose: "Cross-check the tally-and-emit procedure and stability note.",
      verifiedClaims: ["Counting sort tallies frequencies and emits values in order"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "fcfb40899f42377f",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
