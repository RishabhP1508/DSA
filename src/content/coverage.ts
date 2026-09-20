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

export const COVERAGE_VERSION = 13;

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
 * The Notion syllabus (the required source) is a client-rendered page whose
 * question list could NOT be programmatically enumerated in this environment,
 * and LeetCode blocks automated destination checks (HTTP 403). So rather than
 * fabricate a question list or unverifiable links, this maps a CONSERVATIVE set
 * of CANONICAL, widely-known LeetCode problems whose URL slugs are stable and
 * unambiguous, to the coverage subtopic whose TECHNIQUE they exercise. Titles +
 * links only (no third-party problem statements are copied). External practice
 * is OPTIONAL — the local lessons/exercises teach the technique regardless.
 *
 * OPEN GAP (recorded for the user, see .kiro/specs/R5-curriculum/verification.md):
 * the exact Notion-listed set is unverified here; this subset should be
 * reconciled against the live Notion page during review. No link below is a
 * guess — each is a canonical, long-standing LeetCode problem slug.
 */
const EXTERNAL_PRACTICE: Record<string, { name: string; url: string }[]> = {
  "arrays/two-pointers": [
    { name: "LeetCode 167 — Two Sum II (Input Array Is Sorted)", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
    { name: "LeetCode 15 — 3Sum", url: "https://leetcode.com/problems/3sum/" },
    { name: "LeetCode 11 — Container With Most Water", url: "https://leetcode.com/problems/container-with-most-water/" },
  ],
  "arrays/sliding-window": [
    { name: "LeetCode 643 — Maximum Average Subarray I", url: "https://leetcode.com/problems/maximum-average-subarray-i/" },
    { name: "LeetCode 209 — Minimum Size Subarray Sum", url: "https://leetcode.com/problems/minimum-size-subarray-sum/" },
  ],
  "arrays/prefix-sums": [
    { name: "LeetCode 560 — Subarray Sum Equals K", url: "https://leetcode.com/problems/subarray-sum-equals-k/" },
    { name: "LeetCode 303 — Range Sum Query - Immutable", url: "https://leetcode.com/problems/range-sum-query-immutable/" },
  ],
  "arrays/kadane": [
    { name: "LeetCode 53 — Maximum Subarray", url: "https://leetcode.com/problems/maximum-subarray/" },
  ],
  "arrays/in-place": [
    { name: "LeetCode 448 — Find All Numbers Disappeared in an Array", url: "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/" },
    { name: "LeetCode 26 — Remove Duplicates from Sorted Array", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/" },
  ],
  "arrays/matrix-traversal": [
    { name: "LeetCode 54 — Spiral Matrix", url: "https://leetcode.com/problems/spiral-matrix/" },
    { name: "LeetCode 48 — Rotate Image", url: "https://leetcode.com/problems/rotate-image/" },
  ],
  "arrays/intervals": [
    { name: "LeetCode 56 — Merge Intervals", url: "https://leetcode.com/problems/merge-intervals/" },
    { name: "LeetCode 57 — Insert Interval", url: "https://leetcode.com/problems/insert-interval/" },
  ],
  "strings/frequency": [
    { name: "LeetCode 242 — Valid Anagram", url: "https://leetcode.com/problems/valid-anagram/" },
    { name: "LeetCode 387 — First Unique Character in a String", url: "https://leetcode.com/problems/first-unique-character-in-a-string/" },
  ],
  "strings/sliding-window": [
    { name: "LeetCode 3 — Longest Substring Without Repeating Characters", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
    { name: "LeetCode 76 — Minimum Window Substring", url: "https://leetcode.com/problems/minimum-window-substring/" },
  ],
  "strings/palindromes": [
    { name: "LeetCode 125 — Valid Palindrome", url: "https://leetcode.com/problems/valid-palindrome/" },
    { name: "LeetCode 5 — Longest Palindromic Substring", url: "https://leetcode.com/problems/longest-palindromic-substring/" },
  ],
  "strings/anagrams": [
    { name: "LeetCode 49 — Group Anagrams", url: "https://leetcode.com/problems/group-anagrams/" },
  ],
  "strings/kmp": [
    { name: "LeetCode 28 — Find the Index of the First Occurrence in a String", url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/" },
  ],
  "linked-lists/reversal": [
    { name: "LeetCode 206 — Reverse Linked List", url: "https://leetcode.com/problems/reverse-linked-list/" },
    { name: "LeetCode 92 — Reverse Linked List II", url: "https://leetcode.com/problems/reverse-linked-list-ii/" },
  ],
  "linked-lists/cycle-detection": [
    { name: "LeetCode 141 — Linked List Cycle", url: "https://leetcode.com/problems/linked-list-cycle/" },
    { name: "LeetCode 142 — Linked List Cycle II", url: "https://leetcode.com/problems/linked-list-cycle-ii/" },
  ],
  "linked-lists/merging": [
    { name: "LeetCode 21 — Merge Two Sorted Lists", url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
  ],
  "linked-lists/middle": [
    { name: "LeetCode 876 — Middle of the Linked List", url: "https://leetcode.com/problems/middle-of-the-linked-list/" },
  ],
  "trees/dfs": [
    { name: "LeetCode 104 — Maximum Depth of Binary Tree", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
    { name: "LeetCode 112 — Path Sum", url: "https://leetcode.com/problems/path-sum/" },
  ],
  "trees/bfs-level-order": [
    { name: "LeetCode 102 — Binary Tree Level Order Traversal", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
  ],
  "trees/bst": [
    { name: "LeetCode 700 — Search in a Binary Search Tree", url: "https://leetcode.com/problems/search-in-a-binary-search-tree/" },
    { name: "LeetCode 98 — Validate Binary Search Tree", url: "https://leetcode.com/problems/validate-binary-search-tree/" },
  ],
  "trees/lca": [
    { name: "LeetCode 236 — Lowest Common Ancestor of a Binary Tree", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" },
  ],
  "trees/prefix-search": [
    { name: "LeetCode 208 — Implement Trie (Prefix Tree)", url: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
  ],
  "trees/word-search": [
    { name: "LeetCode 212 — Word Search II", url: "https://leetcode.com/problems/word-search-ii/" },
  ],
  "stacks/operations": [
    { name: "LeetCode 232 — Implement Queue using Stacks", url: "https://leetcode.com/problems/implement-queue-using-stacks/" },
  ],
  "stacks/monotonic": [
    { name: "LeetCode 739 — Daily Temperatures", url: "https://leetcode.com/problems/daily-temperatures/" },
    { name: "LeetCode 496 — Next Greater Element I", url: "https://leetcode.com/problems/next-greater-element-i/" },
  ],
  "stacks/parentheses": [
    { name: "LeetCode 20 — Valid Parentheses", url: "https://leetcode.com/problems/valid-parentheses/" },
  ],
  "stacks/expression-eval": [
    { name: "LeetCode 150 — Evaluate Reverse Polish Notation", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
  ],
  "graphs/bfs": [
    { name: "LeetCode 1926 — Nearest Exit from Entrance in Maze", url: "https://leetcode.com/problems/nearest-exit-from-entrance-in-maze/" },
  ],
  "graphs/dfs": [
    { name: "LeetCode 200 — Number of Islands", url: "https://leetcode.com/problems/number-of-islands/" },
  ],
  "graphs/components": [
    { name: "LeetCode 547 — Number of Provinces", url: "https://leetcode.com/problems/number-of-provinces/" },
  ],
  "graphs/topo-sort": [
    { name: "LeetCode 207 — Course Schedule", url: "https://leetcode.com/problems/course-schedule/" },
    { name: "LeetCode 210 — Course Schedule II", url: "https://leetcode.com/problems/course-schedule-ii/" },
  ],
  "graphs/union-find": [
    { name: "LeetCode 684 — Redundant Connection", url: "https://leetcode.com/problems/redundant-connection/" },
  ],
  "graphs/dijkstra": [
    { name: "LeetCode 743 — Network Delay Time", url: "https://leetcode.com/problems/network-delay-time/" },
  ],
  "graphs/multi-source-bfs": [
    { name: "LeetCode 994 — Rotting Oranges", url: "https://leetcode.com/problems/rotting-oranges/" },
  ],
  "dp/climbing-stairs": [
    { name: "LeetCode 70 — Climbing Stairs", url: "https://leetcode.com/problems/climbing-stairs/" },
  ],
  "dp/house-robber": [
    { name: "LeetCode 198 — House Robber", url: "https://leetcode.com/problems/house-robber/" },
  ],
  "dp/coin-change": [
    { name: "LeetCode 322 — Coin Change", url: "https://leetcode.com/problems/coin-change/" },
  ],
  "dp/lis": [
    { name: "LeetCode 300 — Longest Increasing Subsequence", url: "https://leetcode.com/problems/longest-increasing-subsequence/" },
  ],
  "dp/lcs": [
    { name: "LeetCode 1143 — Longest Common Subsequence", url: "https://leetcode.com/problems/longest-common-subsequence/" },
  ],
  "dp/grid-paths": [
    { name: "LeetCode 62 — Unique Paths", url: "https://leetcode.com/problems/unique-paths/" },
  ],
  "dp/knapsack": [
    { name: "LeetCode 416 — Partition Equal Subset Sum", url: "https://leetcode.com/problems/partition-equal-subset-sum/" },
  ],
  "dp/subsets": [
    { name: "LeetCode 78 — Subsets", url: "https://leetcode.com/problems/subsets/" },
  ],
  "dp/permutations": [
    { name: "LeetCode 46 — Permutations", url: "https://leetcode.com/problems/permutations/" },
  ],
  "dp/combinations": [
    { name: "LeetCode 77 — Combinations", url: "https://leetcode.com/problems/combinations/" },
  ],
  "dp/n-queens": [
    { name: "LeetCode 51 — N-Queens", url: "https://leetcode.com/problems/n-queens/" },
  ],
  "heaps/top-k": [
    { name: "LeetCode 347 — Top K Frequent Elements", url: "https://leetcode.com/problems/top-k-frequent-elements/" },
  ],
  "heaps/kth": [
    { name: "LeetCode 215 — Kth Largest Element in an Array", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
  ],
  "heaps/running-median": [
    { name: "LeetCode 295 — Find Median from Data Stream", url: "https://leetcode.com/problems/find-median-from-data-stream/" },
  ],
  "heaps/merge-sorted": [
    { name: "LeetCode 23 — Merge k Sorted Lists", url: "https://leetcode.com/problems/merge-k-sorted-lists/" },
  ],
  "hashing/maps-sets": [
    { name: "LeetCode 1 — Two Sum", url: "https://leetcode.com/problems/two-sum/" },
  ],
  "hashing/duplicates": [
    { name: "LeetCode 217 — Contains Duplicate", url: "https://leetcode.com/problems/contains-duplicate/" },
  ],
  "hashing/grouping": [
    { name: "LeetCode 49 — Group Anagrams", url: "https://leetcode.com/problems/group-anagrams/" },
  ],
  "bits/logical-ops": [
    { name: "LeetCode 136 — Single Number", url: "https://leetcode.com/problems/single-number/" },
  ],
  "bits/count-set-bits": [
    { name: "LeetCode 191 — Number of 1 Bits", url: "https://leetcode.com/problems/number-of-1-bits/" },
    { name: "LeetCode 338 — Counting Bits", url: "https://leetcode.com/problems/counting-bits/" },
  ],
  "bits/xor-cancellation": [
    { name: "LeetCode 268 — Missing Number", url: "https://leetcode.com/problems/missing-number/" },
  ],
  "sorting/merge": [
    { name: "LeetCode 912 — Sort an Array", url: "https://leetcode.com/problems/sort-an-array/" },
  ],
  "sorting/comparators": [
    { name: "LeetCode 179 — Largest Number", url: "https://leetcode.com/problems/largest-number/" },
  ],
  "sorting/intervals": [
    { name: "LeetCode 435 — Non-overlapping Intervals", url: "https://leetcode.com/problems/non-overlapping-intervals/" },
  ],
  "searching/binary": [
    { name: "LeetCode 704 — Binary Search", url: "https://leetcode.com/problems/binary-search/" },
  ],
  "searching/binary-on-answer": [
    { name: "LeetCode 875 — Koko Eating Bananas", url: "https://leetcode.com/problems/koko-eating-bananas/" },
    { name: "LeetCode 1011 — Capacity To Ship Packages Within D Days", url: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/" },
  ],
  "searching/rotated": [
    { name: "LeetCode 33 — Search in Rotated Sorted Array", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  ],
  "searching/matrix": [
    { name: "LeetCode 74 — Search a 2D Matrix", url: "https://leetcode.com/problems/search-a-2d-matrix/" },
  ],
};

for (const entry of coverage) {
  const ext = EXTERNAL_PRACTICE[entry.id];
  if (ext) entry.externalPractice = ext;
}

/** Quick coverage stats for docs and the (future) Learning Path progress view. */
export function coverageStats(list: CoverageEntry[] = coverage) {
  const total = list.length;
  const verified = list.filter((c) => c.status === "verified").length;
  const authored = list.filter((c) => c.status === "authored").length;
  return { total, verified, authored, remaining: total - verified - authored };
}
