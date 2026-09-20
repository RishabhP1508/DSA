/**
 * Lesson: Bucket sort (Sorting). Verified on CPython 3.14.
 * Output: "[3, 9, 21, 25, 29, 37, 43, 49]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Bucket sort: scatter into ranges, sort each bucket, concatenate.
def bucket_sort(a, k=5):
    if not a:
        return []
    buckets = [[] for _ in range(k)]
    hi = max(a) + 1
    for x in a:
        idx = x * k // hi              # which bucket does x fall in?
        buckets[idx].append(x)
    out = []
    for b in buckets:
        out.extend(sorted(b))          # sort each small bucket
    return out

print(bucket_sort([29, 25, 3, 49, 9, 37, 21, 43]))`;

export const bucketSort: LessonDefinition = {
  id: "bucket-sort",
  title: "Bucket Sort",
  area: "Sorting",
  prerequisites: ["counting-sort"],

  explanation: `**Bucket sort** distributes elements into a number of **buckets** by their value range, sorts each bucket (with any sort), then concatenates the buckets in order. It shines when the input is **uniformly spread** over a known range: each bucket then holds only a few elements, so the per-bucket sorts are cheap and the whole thing runs in **expected O(n)**.

The catch is that the linear expectation depends on that **uniform distribution**. If all elements happen to land in one bucket (skewed data), you are just sorting the whole array with the inner sort — **O(n²)** (or O(n log n) if the inner sort is comparison-based). So bucket sort is a *distribution* sort: its performance is a statement about the data, not a worst-case guarantee.

It generalizes counting sort (which is bucket sort with one bucket per value) and is often used for sorting **floating-point numbers** in [0, 1). The recognition cue: "values uniformly distributed over a range" → bucket sort can beat comparison sorts on average.`,

  vocabulary: [
    { term: "Bucket sort", definition: "Scattering elements into range-buckets, sorting each, and concatenating." },
    { term: "Bucket", definition: "A sublist holding elements from one sub-range of values." },
    { term: "Uniform distribution", definition: "Values spread evenly, so buckets stay small (the good case)." },
    { term: "Distribution sort", definition: "A sort whose speed depends on how the data is distributed." },
  ],

  concepts: {
    purpose: "Sort uniformly-distributed values in expected linear time by scattering into buckets.",
    operations: "Map each value to a bucket; sort buckets; concatenate in order.",
    uses: "Uniformly-distributed floats/integers, sorting values in a known bounded range.",
    tradeoffs: "Expected O(n) on uniform data, but O(n²) worst case on skewed data; needs a good bucket mapping.",
    commonMistakes: "Assuming linear worst case (it isn't); bad bucket count/mapping causing skew; forgetting to sort within buckets.",
    edgeCases: "Empty input returns []. All elements in one bucket → inner-sort cost dominates. Values at the max need care in the index mapping.",
  },

  complexity: [
    { operation: "Bucket sort", best: "O(n + k)", average: "O(n + k)", worst: "O(n^2)", space: "O(n + k)", note: "Expected O(n) on uniform data; O(n²) if all land in one bucket." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of elements" },
      { symbol: "k", meaning: "the number of buckets" },
    ],
    costModel: "Scattering each element is O(1). Sorting a bucket of size b with a comparison sort is O(b log b); with uniform data each b is about n/k.",
    time: {
      bound: "O(n + k)",
      case: "average",
      explanation: "Scattering all n elements into buckets is O(n), and creating/reading k buckets is O(k). With a UNIFORM distribution each bucket holds ~n/k elements, so summed the inner sorts cost about O(n) (each tiny bucket sorts in near-constant time when n/k is small). Hence expected O(n + k). If the data is skewed so one bucket gets all n elements, that inner sort alone is O(n log n) or O(n²), which is the worst case.",
      otherCases: [
        { case: "worst", bound: "O(n^2)", note: "All elements fall into one bucket and the inner sort is quadratic." },
      ],
    },
    space: {
      bound: "O(n + k)",
      case: "worst",
      explanation: "The k buckets together hold all n elements, so storage is O(n + k).",
      inputOutputNote: "The buckets and output hold the n elements; the input is separate.",
    },
    derivation: [
      { lines: [7, 8, 9], description: "Scatter all n elements into buckets — O(n).", cost: "O(n)", dimension: "time" },
      { lines: [11, 12], description: "Sort each bucket; uniform → ~O(n) total, skewed → up to O(n²).", cost: "O(n + k)", dimension: "time" },
      { lines: [5], description: "k buckets holding n elements total.", cost: "O(n + k)", dimension: "space" },
    ],
    assumptions: ["Expected O(n) assumes a roughly UNIFORM distribution over the value range.", "The bucket index mapping spreads values evenly."],
    tradeoffs: "Comparison sorts guarantee O(n log n) regardless of distribution; bucket sort can be faster (expected O(n)) on uniform data but has no worst-case guarantee.",
    counters: [
      { label: "elements scattered", definition: "executions of the scatter append (line 9)", countLines: [9] },
    ],
    fixedDataNote: "This run scatters 8 values into 5 buckets. The expected-O(n) claim assumes uniform spread; clustered data would push toward the worst case.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: scatter, sort buckets, concatenate." },
    { line: 2, executable: true, explanation: "Define bucket_sort with k buckets." },
    { line: 3, executable: true, explanation: "Handle empty input." },
    { line: 4, executable: true, explanation: "Return []." },
    { line: 5, executable: true, explanation: "Create k empty buckets." },
    { line: 6, executable: true, explanation: "hi bounds the value range for the mapping." },
    { line: 7, executable: true, explanation: "Scatter each element..." },
    { line: 8, executable: true, explanation: "...computing its bucket index by scaling into [0, k)." },
    { line: 9, executable: true, explanation: "Append x to its bucket." },
    { line: 10, executable: true, explanation: "Prepare the output." },
    { line: 11, executable: true, explanation: "For each bucket in value order..." },
    { line: 12, executable: true, explanation: "...sort it and append to the output. Uniform data → tiny buckets → cheap." },
    { line: 13, executable: true, explanation: "Return the concatenated sorted result." },
    { line: 14, executable: false, explanation: "Blank line." },
    { line: 15, executable: true, explanation: "Sort the sample → [3, 9, 21, 25, 29, 37, 43, 49]." },
  ],

  bindings: [{ variable: "a", model: "array" }],

  prediction: [
    { atEventIndex: 0, prompt: "Bucket sort is expected O(n) — under what assumption, and what breaks it?", answer: "Under a roughly uniform distribution (buckets stay small). Skewed data that piles into one bucket breaks it, degrading to O(n²).", explanation: "Expected linearity relies on each bucket holding ~n/k elements. If the distribution is skewed, one bucket can hold all n, and its inner sort dominates the cost." },
  ],

  experiments: [
    "Feed clustered values (all near one number) and reason about the skewed worst case.",
    "Change k and observe how bucket sizes change.",
    "Adapt it to sort floats in [0, 1) by scaling the index differently.",
  ],

  exercises: [
    {
      id: "buck-choose-1",
      kind: "choose-approach",
      prompt: "You have a million floats uniformly distributed in [0, 1). Why might bucket sort beat an O(n log n) comparison sort here?",
      expected: "Uniform distribution keeps each bucket small, so bucket sort runs in expected O(n) — faster than the O(n log n) comparison-sort bound for this well-distributed data.",
      hints: ["Are the values evenly spread?", "Yes — buckets stay small.", "That gives expected O(n), beating O(n log n)."],
    },
    {
      id: "buck-predict-1",
      kind: "predict-state",
      prompt: "What is bucket sort's worst-case time, and what input causes it?",
      expected: "O(n²) (with a quadratic inner sort), caused by all elements landing in a single bucket (skewed data).",
      hints: ["What if the distribution is very skewed?", "One bucket gets everything.", "Then it's just the inner sort on all n — up to O(n²)."],
    },
  ],

  review: `**Bucket sort** scatters values into range-buckets, sorts each, and concatenates. On **uniformly distributed** data buckets stay small, giving **expected O(n)** — beating comparison sorts. But it is a **distribution sort** with an **O(n²)** worst case when data clusters into one bucket. It generalizes counting sort and suits uniform floats/integers.`,

  expectedOutput: "[3, 9, 21, 25, 29, 37, 43, 49]\n",

  references: [
    {
      url: "https://www.geeksforgeeks.org/bucket-sort-2/",
      title: "Bucket Sort — GeeksforGeeks",
      section: "Algorithm and complexity",
      topic: "sorting/bucket",
      purpose: "Confirm the scatter/sort/concatenate procedure and the expected O(n) / worst O(n²) analysis.",
      verifiedClaims: ["Bucket sort is expected O(n) for uniform data and O(n²) worst case"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://en.wikipedia.org/wiki/Bucket_sort",
      title: "Bucket sort — Wikipedia",
      section: "Analysis / distribution assumption",
      topic: "sorting/bucket",
      purpose: "Cross-check the uniform-distribution assumption behind the linear expectation.",
      verifiedClaims: ["Bucket sort's linear expected time assumes a uniform distribution of inputs"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 15,
    contentHash: "9d5aec9eb66f0fb1",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
