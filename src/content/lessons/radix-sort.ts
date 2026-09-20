/**
 * Lesson: Radix sort (Sorting). Verified on CPython 3.14.
 * Output: "[2, 24, 45, 66, 75, 90, 170, 802]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Radix sort: sort by each digit, least-significant first (LSD).
def radix_sort(a):
    if not a:
        return []
    out = a[:]
    exp = 1                         # current digit place: 1, 10, 100, ...
    hi = max(out)
    while hi // exp > 0:            # until we pass the most significant digit
        buckets = [[] for _ in range(10)]   # one bucket per digit 0-9
        for x in out:
            buckets[(x // exp) % 10].append(x)  # stable distribute by digit
        out = []
        for b in buckets:
            out.extend(b)           # gather buckets in order
        exp *= 10                   # move to the next digit
    return out

print(radix_sort([170, 45, 75, 90, 2, 802, 24, 66]))`;

export const radixSort: LessonDefinition = {
  id: "radix-sort",
  title: "Radix Sort",
  area: "Sorting",
  prerequisites: ["counting-sort"],

  explanation: `**Radix sort** sorts integers **one digit at a time** without ever comparing two numbers as wholes. This LSD (least-significant-digit) version passes over the data once per digit place — ones, tens, hundreds — each time distributing numbers into 10 buckets by that digit and then gathering the buckets in order. The magic is that each pass must be **stable** (buckets preserve insertion order), so numbers already ordered by lower digits stay ordered when a higher digit ties. After the most significant digit, the list is fully sorted.

Its cost is **O(d · (n + b))** where \`d\` is the number of digits and \`b\` the base (10 here): \`d\` passes, each a stable counting/bucket distribution of the n numbers over b buckets. When \`d\` is small (fixed-width integers), this is effectively **O(n)** — beating the O(n log n) comparison-sort bound.

The trade: it only works on data with a **digit/place structure** (integers, fixed-length strings) and uses **O(n + b)** extra space per pass. The recognition cue is the same as counting sort — "integer keys" — but radix handles large value ranges by processing digits, avoiding counting sort's O(hi) blowup.`,

  vocabulary: [
    { term: "Radix sort", definition: "Sorting by processing digits from least to most significant (LSD)." },
    { term: "Digit place (exp)", definition: "The place value being examined: 1, 10, 100, …" },
    { term: "Stable pass", definition: "A distribution that preserves the order of equal-digit items — essential for correctness." },
    { term: "d (digits)", definition: "The number of digit passes, ~log_base(max value)." },
    { term: "Base (b)", definition: "How many buckets per pass (10 for decimal digits)." },
  ],

  concepts: {
    purpose: "Sort integers in near-linear time by digit passes, avoiding whole-number comparisons.",
    operations: "Repeat: distribute into base-b buckets by the current digit (stably), gather, move to next digit.",
    uses: "Sorting fixed-width integers, fixed-length strings, keys with large value range but few digits.",
    tradeoffs: "O(d·(n+b)) — near-linear when d is small; needs digit structure and O(n+b) space; each pass must be stable.",
    commonMistakes: "Non-stable digit pass (breaks correctness); MSD/LSD confusion; forgetting negative-number handling; assuming it beats comparison sorts when d is large.",
    edgeCases: "Empty input returns []. Values with different digit counts handled by the exp loop. Zero sorts correctly.",
  },

  complexity: [
    { operation: "Radix sort (LSD)", best: "O(d*(n+b))", average: "O(d*(n+b))", worst: "O(d*(n+b))", space: "O(n+b)", note: "d digits, base b; near-linear when d is small." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of integers to sort" },
      { symbol: "d", meaning: "the number of digits in the largest value" },
      { symbol: "b", meaning: "the base / number of buckets (10 here)" },
    ],
    costModel: "Each digit pass distributes n numbers into b buckets (O(n + b)) and gathers them (O(n + b)).",
    time: {
      bound: "O(d*(n+b))",
      case: "worst",
      explanation: "There are d passes (one per digit place). Each pass is a stable distribution of all n numbers into b buckets and a gather — O(n + b) work. Multiplying gives O(d·(n + b)). When d is a small constant (fixed-width integers) and b is small, this is effectively O(n) — faster than the O(n log n) comparison-sort lower bound. The cost is the SAME for all inputs (no best/worst variation), because it always processes every digit.",
    },
    space: {
      bound: "O(n+b)",
      case: "worst",
      explanation: "Each pass allocates b buckets holding all n numbers between them — O(n + b) auxiliary space.",
      inputOutputNote: "The buckets and rebuilt output hold the n numbers; the input is separate.",
    },
    derivation: [
      { lines: [8], description: "The outer loop runs once per digit place: d passes.", cost: "O(d)", dimension: "time" },
      { lines: [9, 10, 11, 13, 14], description: "Each pass distributes and gathers all n numbers over b buckets: O(n + b).", cost: "O(d*(n+b))", dimension: "time" },
      { lines: [9], description: "b buckets holding n numbers per pass.", cost: "O(n+b)", dimension: "space" },
    ],
    assumptions: ["Keys are non-negative integers with a digit structure.", "Each digit pass is STABLE (buckets preserve order).", "d = number of digits of the max value."],
    tradeoffs: "Counting sort is O(n + hi) but blows up when the value range hi is huge; radix avoids that by processing digits (O(d·(n+b))). Comparison sorts are O(n log n) but need no digit structure.",
    counters: [
      { label: "distributions", definition: "executions of the bucket append (line 11)", countLines: [11] },
    ],
    fixedDataNote: "This run sorts 8 numbers with max 802 (3 digits), so d=3 passes over base 10. The O(d·(n+b)) bound generalises to n numbers of d digits.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: sort by each digit, least-significant first." },
    { line: 2, executable: true, explanation: "Define radix_sort(a)." },
    { line: 3, executable: true, explanation: "Handle empty input." },
    { line: 4, executable: true, explanation: "Return []." },
    { line: 5, executable: true, explanation: "Work on a copy." },
    { line: 6, executable: true, explanation: "exp is the current digit place, starting at the ones (1)." },
    { line: 7, executable: true, explanation: "hi is the max value; it decides how many digit passes we need." },
    { line: 8, executable: true, explanation: "Continue while there are still higher digits to process." },
    { line: 9, executable: true, explanation: "Ten buckets, one per digit 0-9." },
    { line: 10, executable: true, explanation: "Distribute each number..." },
    { line: 11, executable: true, explanation: "...by its current digit (x // exp) % 10. Appending keeps the pass stable." },
    { line: 12, executable: true, explanation: "Rebuild the list from the buckets." },
    { line: 13, executable: true, explanation: "Gather buckets in digit order (0..9)." },
    { line: 14, executable: true, explanation: "Concatenate this bucket's contents." },
    { line: 15, executable: true, explanation: "Advance to the next digit place (×10)." },
    { line: 16, executable: true, explanation: "Return the fully sorted list." },
    { line: 17, executable: false, explanation: "Blank line." },
    { line: 18, executable: true, explanation: "Sort the sample → [2, 24, 45, 66, 75, 90, 170, 802]." },
  ],

  bindings: [{ variable: "out", model: "array" }],

  prediction: [
    { atEventIndex: 0, prompt: "Why must each digit pass in radix sort be STABLE?", answer: "Because when two numbers have the same current digit, they must keep the order established by the lower digits already processed; a non-stable pass would scramble that and break correctness.", explanation: "LSD radix relies on earlier (lower-digit) orderings being preserved through later passes. Stability is what guarantees ties on the current digit retain their prior relative order." },
  ],

  experiments: [
    "Add a print of the list after each digit pass to watch it order by ones, then tens, then hundreds.",
    "Try numbers of very different lengths and confirm the exp loop handles them.",
    "Reason about how many passes d you'd need for 9-digit numbers.",
  ],

  exercises: [
    {
      id: "rad-choose-1",
      kind: "choose-approach",
      prompt: "You must sort a million integers ranging up to 1,000,000,000. Counting sort or radix sort, and why?",
      expected: "Radix sort — counting sort would need an O(hi)=O(10^9) counts array (wasteful). Radix processes ~10 digits: O(d·(n+b)) ≈ O(n), avoiding the huge-range blowup.",
      hints: ["What is the value range hi?", "A billion — counting sort's O(hi) array is huge.", "Radix processes digits: O(d·(n+b)) stays near-linear."],
    },
    {
      id: "rad-complete-1",
      kind: "complete-code",
      prompt: "Complete the digit-extraction that places x into the right bucket for the current place `exp`.",
      starterCode: "for x in out:\n    # TODO: append x to the bucket for its current digit\n    pass",
      expected: "for x in out:\n    buckets[(x // exp) % 10].append(x)",
      hints: ["Extract the digit at place exp.", "(x // exp) gives the number without lower digits; % 10 gives the digit.", "buckets[(x // exp) % 10].append(x)"],
    },
  ],

  review: `**Radix sort** (LSD) sorts integers by processing digits from least to most significant, using a **stable** base-b distribution each pass. It runs in **O(d·(n+b))** — near-linear when the digit count \`d\` is small — beating comparison sorts and avoiding counting sort's O(hi) blowup on large ranges. It requires digit-structured keys and **O(n+b)** space, and each pass must be stable.`,

  expectedOutput: "[2, 24, 45, 66, 75, 90, 170, 802]\n",

  references: [
    {
      url: "https://cp-algorithms.com/sorting/radix_sort.html",
      title: "Radix sort — CP-Algorithms",
      section: "LSD radix sort and complexity",
      topic: "sorting/radix",
      purpose: "Confirm the digit-by-digit LSD procedure, stability requirement, and O(d·(n+b)) complexity.",
      verifiedClaims: ["Radix sort processes digits with a stable pass each and runs in O(d·(n+b))"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://www.geeksforgeeks.org/radix-sort/",
      title: "Radix Sort — GeeksforGeeks",
      section: "Working and analysis",
      topic: "sorting/radix",
      purpose: "Cross-check the LSD algorithm and the need for a stable inner distribution.",
      verifiedClaims: ["LSD radix sort requires a stable per-digit distribution for correctness"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "87f9e278d146f8c0",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
