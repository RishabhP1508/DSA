/**
 * Versioned curriculum coverage inventory.
 *
 * Built from the required Notion syllabus checklist plus the agreed additional
 * topics (see the plan §1). Every REQUIRED SUBTOPIC gets its own entry — a broad
 * heading does not count as coverage of its subtopics. Authoring status is
 * updated as lessons are written and verified; docs/coverage.md renders this for
 * humans. This list is the source of truth for "nothing silently dropped".
 *
 * bump COVERAGE_VERSION whenever the required set changes.
 */

import type { CoverageEntry } from "../core/types";
import { NOTION_PRACTICE } from "./notion-practice";

export const COVERAGE_VERSION = 15;

function e(
  area: string,
  subtopic: string,
  id: string,
  extra: Partial<CoverageEntry> = {},
): CoverageEntry {
  return { id, area, subtopic, status: "planned", ...extra };
}

export const coverage: CoverageEntry[] = [
  // --- Programming foundations (agreed additions) ---
  e("Programming foundations", "Values, variables, types", "foundations/variables-and-types", {
    lessonId: "variables-and-types",
    hasVisualExample: true,
    hasExercise: true,
    status: "verified",
  }),
  e("Programming foundations", "Expressions", "foundations/expressions", { lessonId: "expressions", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Programming foundations", "Conditions", "foundations/conditions", { lessonId: "conditions", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Programming foundations", "Loops", "foundations/loops", { lessonId: "loops", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Programming foundations", "Functions", "foundations/functions", { lessonId: "functions", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Programming foundations", "Scope", "foundations/scope", { lessonId: "scope", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Programming foundations", "Input/output", "foundations/io", { lessonId: "io", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Programming foundations", "References and mutation", "foundations/references-mutation", { lessonId: "references-mutation", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Programming foundations", "Classes", "foundations/classes", { lessonId: "classes", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Programming foundations", "Errors", "foundations/errors", { lessonId: "errors", hasVisualExample: true, hasExercise: true, status: "verified" }),

  // --- DSA foundations (agreed additions) ---
  e("DSA foundations", "Representations", "dsa/representations", { lessonId: "representations", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DSA foundations", "Correctness", "dsa/correctness", { lessonId: "correctness", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DSA foundations", "Time/space complexity", "dsa/complexity", { lessonId: "complexity", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DSA foundations", "Best/average/worst cases", "dsa/cases", { lessonId: "cases", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DSA foundations", "Amortized costs", "dsa/amortized", { lessonId: "amortized", hasVisualExample: true, hasExercise: true, status: "verified" }),

  // --- Arrays ---
  e("Arrays", "Traversal", "arrays/traversal", { lessonId: "array-traversal", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Arrays", "Two pointers", "arrays/two-pointers", { patternIds: ["two-pointers"], lessonId: "two-pointers", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Arrays", "Sliding windows", "arrays/sliding-window", { patternIds: ["sliding-window"], lessonId: "sliding-window", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Arrays", "Prefix sums", "arrays/prefix-sums", { patternIds: ["prefix-sums-hashmap"], lessonId: "prefix-sums", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Arrays", "Kadane's algorithm", "arrays/kadane", { patternIds: ["kadane"], lessonId: "kadane", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Arrays", "In-place modification", "arrays/in-place", { patternIds: ["cyclic-sort"], lessonId: "in-place-modification", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Arrays", "Matrix traversal", "arrays/matrix-traversal", { patternIds: ["matrix-traversal"], lessonId: "matrix-traversal", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Arrays", "Intervals", "arrays/intervals", { patternIds: ["merge-intervals"], lessonId: "intervals", hasVisualExample: true, hasExercise: true, status: "verified" }),

  // --- Strings ---
  e("Strings", "Character frequency counting", "strings/frequency", { lessonId: "string-frequency", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Strings", "Two pointers", "strings/two-pointers", { patternIds: ["two-pointers"], lessonId: "string-two-pointers", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Strings", "Sliding windows", "strings/sliding-window", { patternIds: ["sliding-window"], lessonId: "string-sliding-window", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Strings", "Parsing", "strings/parsing", { lessonId: "string-parsing", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Strings", "Palindromes", "strings/palindromes", { lessonId: "palindromes", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Strings", "Anagrams", "strings/anagrams", { lessonId: "anagrams", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Strings", "Substrings", "strings/substrings", { lessonId: "substrings", hasVisualExample: true, hasExercise: true, status: "verified" }),

  // --- Linked lists ---
  e("Linked lists", "Traversal", "linked-lists/traversal", {
    lessonId: "linked-list-traversal",
    hasVisualExample: true,
    hasExercise: true,
    status: "verified",
  }),
  e("Linked lists", "Slow/fast pointers", "linked-lists/slow-fast", { patternIds: ["fast-slow-pointers"], lessonId: "linked-list-slow-fast", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Linked lists", "Cycle detection", "linked-lists/cycle-detection", { patternIds: ["fast-slow-pointers"], lessonId: "linked-list-cycle-detection", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Linked lists", "Reversal", "linked-lists/reversal", { patternIds: ["in-place-linkedlist-reversal"], lessonId: "linked-list-reversal", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Linked lists", "Merging", "linked-lists/merging", { lessonId: "linked-list-merging", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Linked lists", "Finding the middle", "linked-lists/middle", { lessonId: "linked-list-middle", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Linked lists", "Dummy nodes", "linked-lists/dummy-nodes", { lessonId: "linked-list-dummy-nodes", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Linked lists", "Pointer manipulation", "linked-lists/pointer-manipulation", { lessonId: "linked-list-pointer-manipulation", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Linked lists", "Singly/doubly/circular", "linked-lists/variants", { lessonId: "linked-list-variants", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Linked lists", "Deques", "linked-lists/deques", { lessonId: "linked-list-deques", hasVisualExample: true, hasExercise: true, status: "verified" }),

  // --- Trees and tries ---
  e("Trees and tries", "DFS", "trees/dfs", { patternIds: ["tree-dfs"], lessonId: "tree-dfs", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Trees and tries", "BFS / level order", "trees/bfs-level-order", { patternIds: ["tree-bfs"], lessonId: "tree-bfs", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Trees and tries", "Preorder/inorder/postorder", "trees/traversals", { lessonId: "tree-traversals", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Trees and tries", "BSTs", "trees/bst", { lessonId: "bst-operations", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Trees and tries", "Height/depth", "trees/height-depth", { lessonId: "tree-height-depth", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Trees and tries", "Lowest common ancestor", "trees/lca", { lessonId: "lowest-common-ancestor", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Trees and tries", "Tree construction", "trees/construction", { lessonId: "tree-construction", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Trees and tries", "Trie insertion", "trees/trie-insertion", { patternIds: ["trie-prefix"], lessonId: "trie-insertion", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Trees and tries", "Prefix search", "trees/prefix-search", { patternIds: ["trie-prefix"], lessonId: "prefix-search", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Trees and tries", "Word search", "trees/word-search", { lessonId: "word-search", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Trees and tries", "AVL trees", "trees/avl", { lessonId: "avl-rotations", hasVisualExample: true, hasExercise: true, status: "verified" }),

  // --- Stacks and queues ---
  e("Stacks and queues", "Stack/queue operations", "stacks/operations", { lessonId: "stack-queue-operations", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Stacks and queues", "Monotonic stacks", "stacks/monotonic", { patternIds: ["monotonic-stack"], lessonId: "monotonic-stack", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Stacks and queues", "Parentheses matching", "stacks/parentheses", { lessonId: "parentheses-matching", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Stacks and queues", "Expression evaluation", "stacks/expression-eval", { lessonId: "expression-evaluation", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Stacks and queues", "BFS queues", "stacks/bfs-queues", { lessonId: "bfs-queues", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Stacks and queues", "Min/max tracking", "stacks/min-max-tracking", { lessonId: "min-max-tracking", hasVisualExample: true, hasExercise: true, status: "verified" }),

  // --- Graphs ---
  e("Graphs", "Representations", "graphs/representations", { lessonId: "graph-representations", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Graphs", "Adjacency lists", "graphs/adjacency-lists", { lessonId: "adjacency-lists", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Graphs", "BFS", "graphs/bfs", { patternIds: ["bfs-shortest-path"], lessonId: "graph-bfs", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Graphs", "DFS", "graphs/dfs", { patternIds: ["graph-dfs-components"], lessonId: "graph-dfs", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Graphs", "Components", "graphs/components", { patternIds: ["graph-dfs-components"], lessonId: "connected-components", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Graphs", "Cycle detection", "graphs/cycle-detection", { lessonId: "graph-cycle-detection", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Graphs", "Topological sorting", "graphs/topo-sort", { patternIds: ["topological-sort"], lessonId: "topological-sort", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Graphs", "Shortest paths", "graphs/shortest-paths", { patternIds: ["bfs-shortest-path", "dijkstra"], lessonId: "shortest-paths-unweighted", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Graphs", "Multi-source BFS", "graphs/multi-source-bfs", { lessonId: "multi-source-bfs", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Graphs", "Union-find", "graphs/union-find", { patternIds: ["union-find"], lessonId: "union-find", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Graphs", "Dijkstra", "graphs/dijkstra", { patternIds: ["dijkstra"], lessonId: "dijkstra", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Graphs", "Bellman-Ford", "graphs/bellman-ford", { lessonId: "bellman-ford", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Graphs", "Floyd-Warshall", "graphs/floyd-warshall", { lessonId: "floyd-warshall", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Graphs", "Prim", "graphs/prim", { lessonId: "prim", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Graphs", "Kruskal", "graphs/kruskal", { lessonId: "kruskal", hasVisualExample: true, hasExercise: true, status: "verified" }),

  // --- Dynamic programming and recursion ---
  e("DP and recursion", "Base cases", "dp/base-cases", { lessonId: "dp-base-cases", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DP and recursion", "Recursive calls", "dp/recursive-calls", { lessonId: "dp-recursive-calls", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DP and recursion", "Backtracking", "dp/backtracking", { patternIds: ["backtracking"], lessonId: "dp-backtracking", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DP and recursion", "Subsets", "dp/subsets", { patternIds: ["backtracking"], lessonId: "dp-subsets", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DP and recursion", "Permutations", "dp/permutations", { lessonId: "dp-permutations", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DP and recursion", "Combinations", "dp/combinations", { lessonId: "dp-combinations", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DP and recursion", "Memoization", "dp/memoization", { patternIds: ["dynamic-programming"], lessonId: "dp-memoization", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DP and recursion", "Tabulation", "dp/tabulation", { patternIds: ["dynamic-programming"], lessonId: "dp-tabulation", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DP and recursion", "1D/2D DP", "dp/1d-2d", { lessonId: "dp-1d-2d", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DP and recursion", "Knapsack (0/1)", "dp/knapsack", { patternIds: ["knapsack"], lessonId: "dp-knapsack", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DP and recursion", "Subsequences", "dp/subsequences", { patternIds: ["knapsack"], lessonId: "dp-subsequences", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DP and recursion", "State transitions", "dp/state-transitions", { lessonId: "dp-state-transitions", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DP and recursion", "Climbing stairs", "dp/climbing-stairs", { lessonId: "dp-climbing-stairs", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DP and recursion", "House robber", "dp/house-robber", { lessonId: "dp-house-robber", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DP and recursion", "Grid paths", "dp/grid-paths", { lessonId: "dp-grid-paths", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DP and recursion", "Coin change", "dp/coin-change", { lessonId: "dp-coin-change", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DP and recursion", "Longest increasing subsequence", "dp/lis", { lessonId: "dp-lis", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DP and recursion", "Longest common subsequence", "dp/lcs", { lessonId: "dp-lcs", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DP and recursion", "Divide and conquer", "dp/divide-and-conquer", { patternIds: ["divide-and-conquer"], lessonId: "dp-divide-and-conquer", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("DP and recursion", "N-Queens", "dp/n-queens", { lessonId: "dp-n-queens", hasVisualExample: true, hasExercise: true, status: "verified" }),

  // --- Heaps ---
  e("Heaps", "Min/max heaps", "heaps/min-max", { lessonId: "min-max-heaps", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Heaps", "Sift-up / sift-down mechanics", "heaps/sift-mechanics", { lessonId: "heap-sift", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Heaps", "Top-K elements", "heaps/top-k", { patternIds: ["top-k-heap"], lessonId: "top-k", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Heaps", "Kth largest/smallest", "heaps/kth", { patternIds: ["top-k-heap"], lessonId: "kth-largest", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Heaps", "Running median", "heaps/running-median", { patternIds: ["two-heaps"], lessonId: "running-median", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Heaps", "Merging sorted data", "heaps/merge-sorted", { patternIds: ["k-way-merge"], lessonId: "merge-sorted-data", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Heaps", "Two-heap pattern", "heaps/two-heap", { patternIds: ["two-heaps"], lessonId: "two-heap-pattern", hasVisualExample: true, hasExercise: true, status: "verified" }),

  // --- Hashing ---
  e("Hashing", "Maps and sets", "hashing/maps-sets", { lessonId: "maps-sets", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Hashing", "Frequency counting", "hashing/frequency", { lessonId: "hashing-frequency", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Hashing", "Duplicate detection", "hashing/duplicates", { lessonId: "duplicate-detection", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Hashing", "Value-to-index mapping", "hashing/value-to-index", { lessonId: "value-to-index", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Hashing", "Grouping", "hashing/grouping", { lessonId: "grouping", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Hashing", "Prefix sums with maps", "hashing/prefix-sums-maps", { patternIds: ["prefix-sums-hashmap"], lessonId: "prefix-sums-map", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Hashing", "Caching seen values", "hashing/caching", { lessonId: "caching-seen", hasVisualExample: true, hasExercise: true, status: "verified" }),

  // --- Bit manipulation ---
  e("Bit manipulation", "AND/OR/XOR/NOT", "bits/logical-ops", { lessonId: "bit-logical-ops", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Bit manipulation", "Left/right shifts", "bits/shifts", { lessonId: "bit-shifts", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Bit manipulation", "Check/set/clear bits", "bits/check-set-clear", { lessonId: "bit-check-set-clear", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Bit manipulation", "XOR cancellation", "bits/xor-cancellation", { patternIds: ["bitwise-xor"], lessonId: "xor-cancellation", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Bit manipulation", "Counting set bits", "bits/count-set-bits", { lessonId: "count-set-bits", hasVisualExample: true, hasExercise: true, status: "verified" }),

  // --- Sorting ---
  e("Sorting", "Bubble sort", "sorting/bubble", { lessonId: "bubble-sort", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Sorting", "Selection sort", "sorting/selection", { lessonId: "selection-sort", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Sorting", "Insertion sort", "sorting/insertion", { lessonId: "insertion-sort", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Sorting", "Merge sort", "sorting/merge", { patternIds: ["divide-and-conquer"], lessonId: "merge-sort", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Sorting", "Quick sort", "sorting/quick", { lessonId: "quick-sort", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Sorting", "Counting sort", "sorting/counting", { lessonId: "counting-sort", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Sorting", "Bucket sort", "sorting/bucket", { lessonId: "bucket-sort", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Sorting", "Heap sort", "sorting/heap", { lessonId: "heap-sort", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Sorting", "Radix sort", "sorting/radix", { lessonId: "radix-sort", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Sorting", "Custom ordering/comparators", "sorting/comparators", { lessonId: "comparators", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Sorting", "Interval sorting", "sorting/intervals", { patternIds: ["greedy-interval-scheduling"], lessonId: "interval-sorting", hasVisualExample: true, hasExercise: true, status: "verified" }),

  // --- Searching ---
  e("Searching", "Linear search", "searching/linear", { lessonId: "linear-search", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Searching", "Binary search (sorted arrays)", "searching/binary", { patternIds: ["modified-binary-search"], lessonId: "binary-search", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Searching", "Binary search on the answer", "searching/binary-on-answer", { patternIds: ["binary-search-on-answer"], lessonId: "binary-search-answer", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Searching", "Rotated arrays", "searching/rotated", { patternIds: ["modified-binary-search"], lessonId: "rotated-array-search", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Searching", "Lower/upper bounds", "searching/bounds", { lessonId: "bounds", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Searching", "Matrix search", "searching/matrix", { patternIds: ["matrix-traversal"], lessonId: "matrix-search", hasVisualExample: true, hasExercise: true, status: "verified" }),

  // --- Further range-query structures & strings (agreed additions) ---
  e("Range queries", "Fenwick trees", "range/fenwick", { lessonId: "fenwick-tree", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Range queries", "Segment trees", "range/segment", { lessonId: "segment-tree", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Strings", "KMP string matching", "strings/kmp", { lessonId: "kmp", hasVisualExample: true, hasExercise: true, status: "verified" }),
];

/**
 * R5.6 — External practice mappings (optional further practice).
 *
 * RECONCILED FROM THE SUPPLIED NOTION EXPORT. The authoritative question list
 * now lives in `src/content/notion-practice.ts` (`NOTION_PRACTICE`, 79 rows /
 * 75 unique URLs) with per-occurrence lesson/pattern mappings; the earlier
 * Cloudflare-blocked access attempts are preserved in
 * .kiro/specs/R5-curriculum/external-practice-manifest.md.
 *
 * Here we DERIVE each coverage entry's `externalPractice` from that manifest:
 * a Notion problem is attached to a coverage subtopic when the subtopic's
 * `lessonId` (or one of its `patternIds`) is among the problem's `mappedIds`.
 * So the coverage doc reflects the real Notion set — no hand-maintained subset,
 * no invented links. Titles + canonical links only; external practice stays
 * optional (the local lesson teaches the technique regardless).
 */
for (const entry of coverage) {
  const ids = new Set<string>([entry.lessonId, ...(entry.patternIds ?? [])].filter(Boolean) as string[]);
  const seen = new Set<string>();
  const mapped: { name: string; url: string }[] = [];
  for (const row of NOTION_PRACTICE) {
    if (row.status !== "mapped") continue;
    if (row.mappedIds.some((id) => ids.has(id)) && !seen.has(row.url)) {
      seen.add(row.url);
      mapped.push({ name: row.title, url: row.url });
    }
  }
  if (mapped.length) entry.externalPractice = mapped;
}

/** Quick coverage stats for docs and the (future) Learning Path progress view. */
export function coverageStats(list: CoverageEntry[] = coverage) {
  const total = list.length;
  const verified = list.filter((c) => c.status === "verified").length;
  const authored = list.filter((c) => c.status === "authored").length;
  return { total, verified, authored, remaining: total - verified - authored };
}
