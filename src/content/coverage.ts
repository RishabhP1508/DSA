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

export const COVERAGE_VERSION = 3;

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
  e("Arrays", "Two pointers", "arrays/two-pointers", { lessonId: "two-pointers", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Arrays", "Sliding windows", "arrays/sliding-window", { lessonId: "sliding-window", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Arrays", "Prefix sums", "arrays/prefix-sums", { lessonId: "prefix-sums", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Arrays", "Kadane's algorithm", "arrays/kadane", { lessonId: "kadane", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Arrays", "In-place modification", "arrays/in-place", { lessonId: "in-place-modification", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Arrays", "Matrix traversal", "arrays/matrix-traversal", { lessonId: "matrix-traversal", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Arrays", "Intervals", "arrays/intervals", { lessonId: "intervals", hasVisualExample: true, hasExercise: true, status: "verified" }),

  // --- Strings ---
  e("Strings", "Character frequency counting", "strings/frequency", { lessonId: "string-frequency", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Strings", "Two pointers", "strings/two-pointers", { lessonId: "string-two-pointers", hasVisualExample: true, hasExercise: true, status: "verified" }),
  e("Strings", "Sliding windows", "strings/sliding-window", { lessonId: "string-sliding-window", hasVisualExample: true, hasExercise: true, status: "verified" }),
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
  e("Linked lists", "Slow/fast pointers", "linked-lists/slow-fast"),
  e("Linked lists", "Cycle detection", "linked-lists/cycle-detection"),
  e("Linked lists", "Reversal", "linked-lists/reversal"),
  e("Linked lists", "Merging", "linked-lists/merging"),
  e("Linked lists", "Finding the middle", "linked-lists/middle"),
  e("Linked lists", "Dummy nodes", "linked-lists/dummy-nodes"),
  e("Linked lists", "Pointer manipulation", "linked-lists/pointer-manipulation"),
  e("Linked lists", "Singly/doubly/circular", "linked-lists/variants"),
  e("Linked lists", "Deques", "linked-lists/deques"),

  // --- Trees and tries ---
  e("Trees and tries", "DFS", "trees/dfs"),
  e("Trees and tries", "BFS / level order", "trees/bfs-level-order"),
  e("Trees and tries", "Preorder/inorder/postorder", "trees/traversals"),
  e("Trees and tries", "BSTs", "trees/bst"),
  e("Trees and tries", "Height/depth", "trees/height-depth"),
  e("Trees and tries", "Lowest common ancestor", "trees/lca"),
  e("Trees and tries", "Tree construction", "trees/construction"),
  e("Trees and tries", "Trie insertion", "trees/trie-insertion"),
  e("Trees and tries", "Prefix search", "trees/prefix-search"),
  e("Trees and tries", "Word search", "trees/word-search"),
  e("Trees and tries", "AVL trees", "trees/avl"),

  // --- Stacks and queues ---
  e("Stacks and queues", "Stack/queue operations", "stacks/operations"),
  e("Stacks and queues", "Monotonic stacks", "stacks/monotonic"),
  e("Stacks and queues", "Parentheses matching", "stacks/parentheses"),
  e("Stacks and queues", "Expression evaluation", "stacks/expression-eval"),
  e("Stacks and queues", "BFS queues", "stacks/bfs-queues"),
  e("Stacks and queues", "Min/max tracking", "stacks/min-max-tracking"),

  // --- Graphs ---
  e("Graphs", "Representations / adjacency lists", "graphs/representations"),
  e("Graphs", "BFS", "graphs/bfs"),
  e("Graphs", "DFS", "graphs/dfs"),
  e("Graphs", "Components", "graphs/components"),
  e("Graphs", "Cycle detection", "graphs/cycle-detection"),
  e("Graphs", "Topological sorting", "graphs/topo-sort"),
  e("Graphs", "Shortest paths", "graphs/shortest-paths"),
  e("Graphs", "Multi-source BFS", "graphs/multi-source-bfs"),
  e("Graphs", "Union-find", "graphs/union-find"),
  e("Graphs", "Dijkstra", "graphs/dijkstra"),
  e("Graphs", "Bellman-Ford", "graphs/bellman-ford"),
  e("Graphs", "Floyd-Warshall", "graphs/floyd-warshall"),
  e("Graphs", "Prim", "graphs/prim"),
  e("Graphs", "Kruskal", "graphs/kruskal"),

  // --- Dynamic programming and recursion ---
  e("DP and recursion", "Base cases", "dp/base-cases"),
  e("DP and recursion", "Recursive calls", "dp/recursive-calls"),
  e("DP and recursion", "Backtracking", "dp/backtracking"),
  e("DP and recursion", "Subsets", "dp/subsets"),
  e("DP and recursion", "Permutations", "dp/permutations"),
  e("DP and recursion", "Combinations", "dp/combinations"),
  e("DP and recursion", "Memoization", "dp/memoization"),
  e("DP and recursion", "Tabulation", "dp/tabulation"),
  e("DP and recursion", "1D/2D DP", "dp/1d-2d"),
  e("DP and recursion", "Knapsack (0/1)", "dp/knapsack"),
  e("DP and recursion", "Subsequences", "dp/subsequences"),
  e("DP and recursion", "State transitions", "dp/state-transitions"),
  e("DP and recursion", "Climbing stairs", "dp/climbing-stairs"),
  e("DP and recursion", "House robber", "dp/house-robber"),
  e("DP and recursion", "Grid paths", "dp/grid-paths"),
  e("DP and recursion", "Coin change", "dp/coin-change"),
  e("DP and recursion", "Longest increasing subsequence", "dp/lis"),
  e("DP and recursion", "Longest common subsequence", "dp/lcs"),
  e("DP and recursion", "Divide and conquer", "dp/divide-and-conquer"),
  e("DP and recursion", "N-Queens", "dp/n-queens"),

  // --- Heaps ---
  e("Heaps", "Min/max heaps", "heaps/min-max"),
  e("Heaps", "Top-K elements", "heaps/top-k"),
  e("Heaps", "Kth largest/smallest", "heaps/kth"),
  e("Heaps", "Running median", "heaps/running-median"),
  e("Heaps", "Merging sorted data", "heaps/merge-sorted"),
  e("Heaps", "Two-heap pattern", "heaps/two-heap"),

  // --- Hashing ---
  e("Hashing", "Maps and sets", "hashing/maps-sets"),
  e("Hashing", "Frequency counting", "hashing/frequency"),
  e("Hashing", "Duplicate detection", "hashing/duplicates"),
  e("Hashing", "Value-to-index mapping", "hashing/value-to-index"),
  e("Hashing", "Grouping", "hashing/grouping"),
  e("Hashing", "Prefix sums with maps", "hashing/prefix-sums-maps"),
  e("Hashing", "Caching seen values", "hashing/caching"),

  // --- Bit manipulation ---
  e("Bit manipulation", "AND/OR/XOR/NOT", "bits/logical-ops"),
  e("Bit manipulation", "Left/right shifts", "bits/shifts"),
  e("Bit manipulation", "Check/set/clear bits", "bits/check-set-clear"),
  e("Bit manipulation", "XOR cancellation", "bits/xor-cancellation"),
  e("Bit manipulation", "Counting set bits", "bits/count-set-bits"),

  // --- Sorting ---
  e("Sorting", "Bubble sort", "sorting/bubble"),
  e("Sorting", "Selection sort", "sorting/selection"),
  e("Sorting", "Insertion sort", "sorting/insertion"),
  e("Sorting", "Merge sort", "sorting/merge"),
  e("Sorting", "Quick sort", "sorting/quick"),
  e("Sorting", "Counting sort", "sorting/counting"),
  e("Sorting", "Bucket sort", "sorting/bucket"),
  e("Sorting", "Heap sort", "sorting/heap"),
  e("Sorting", "Radix sort", "sorting/radix"),
  e("Sorting", "Custom ordering/comparators", "sorting/comparators"),
  e("Sorting", "Interval sorting", "sorting/intervals"),

  // --- Searching ---
  e("Searching", "Linear search", "searching/linear"),
  e("Searching", "Binary search (sorted arrays)", "searching/binary"),
  e("Searching", "Binary search on the answer", "searching/binary-on-answer"),
  e("Searching", "Rotated arrays", "searching/rotated"),
  e("Searching", "Lower/upper bounds", "searching/bounds"),
  e("Searching", "Matrix search", "searching/matrix"),

  // --- Further range-query structures & strings (agreed additions) ---
  e("Range queries", "Fenwick trees", "range/fenwick"),
  e("Range queries", "Segment trees", "range/segment"),
  e("Strings", "KMP string matching", "strings/kmp"),
];

/** Quick coverage stats for docs and the (future) Learning Path progress view. */
export function coverageStats(list: CoverageEntry[] = coverage) {
  const total = list.length;
  const verified = list.filter((c) => c.status === "verified").length;
  const authored = list.filter((c) => c.status === "authored").length;
  return { total, verified, authored, remaining: total - verified - authored };
}
