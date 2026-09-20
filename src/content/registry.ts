/**
 * Content registry. Later phases register additional lessons and patterns here;
 * the app reads only from these arrays so adding content never requires UI
 * changes. Lessons are ordered roughly by the recommended learning path.
 */

import type { LessonDefinition, PatternDefinition } from "../core/types";
import { variablesAndTypes } from "./lessons/variables-and-types";
import { expressions } from "./lessons/expressions";
import { conditions } from "./lessons/conditions";
import { loops } from "./lessons/loops";
import { functions } from "./lessons/functions";
import { scope } from "./lessons/scope";
import { io } from "./lessons/io";
import { referencesMutation } from "./lessons/references-mutation";
import { classes } from "./lessons/classes";
import { errors } from "./lessons/errors";
import { representations } from "./lessons/representations";
import { complexity } from "./lessons/complexity";
import { cases } from "./lessons/cases";
import { amortized } from "./lessons/amortized";
import { correctness } from "./lessons/correctness";
import { arrayTraversal } from "./lessons/array-traversal";
import { twoPointers } from "./lessons/two-pointers";
import { prefixSums } from "./lessons/prefix-sums";
import { slidingWindow } from "./lessons/sliding-window";
import { kadane } from "./lessons/kadane";
import { inPlaceModification } from "./lessons/in-place-modification";
import { matrixTraversal } from "./lessons/matrix-traversal";
import { intervals } from "./lessons/intervals";
import { stringFrequency } from "./lessons/string-frequency";
import { stringTwoPointers } from "./lessons/string-two-pointers";
import { stringSlidingWindow } from "./lessons/string-sliding-window";
import { stringParsing } from "./lessons/string-parsing";
import { palindromes } from "./lessons/palindromes";
import { anagrams } from "./lessons/anagrams";
import { substrings } from "./lessons/substrings";
import { linearSearch } from "./lessons/linear-search";
import { binarySearch } from "./lessons/binary-search";
import { binarySearchAnswer } from "./lessons/binary-search-answer";
import { rotatedArraySearch } from "./lessons/rotated-array-search";
import { bounds } from "./lessons/bounds";
import { matrixSearch } from "./lessons/matrix-search";
import { bubbleSort } from "./lessons/bubble-sort";
import { selectionSort } from "./lessons/selection-sort";
import { insertionSort } from "./lessons/insertion-sort";
import { mergeSort } from "./lessons/merge-sort";
import { quickSort } from "./lessons/quick-sort";
import { countingSort } from "./lessons/counting-sort";
import { bucketSort } from "./lessons/bucket-sort";
import { heapSort } from "./lessons/heap-sort";
import { radixSort } from "./lessons/radix-sort";
import { comparators } from "./lessons/comparators";
import { intervalSorting } from "./lessons/interval-sorting";
import { stackQueueOperations } from "./lessons/stack-queue-operations";
import { monotonicStack } from "./lessons/monotonic-stack";
import { parenthesesMatching } from "./lessons/parentheses-matching";
import { expressionEvaluation } from "./lessons/expression-evaluation";
import { bfsQueues } from "./lessons/bfs-queues";
import { minMaxTracking } from "./lessons/min-max-tracking";
import { mapsSets } from "./lessons/maps-sets";
import { hashingFrequency } from "./lessons/hashing-frequency";
import { duplicateDetection } from "./lessons/duplicate-detection";
import { valueToIndex } from "./lessons/value-to-index";
import { grouping } from "./lessons/grouping";
import { prefixSumsMap } from "./lessons/prefix-sums-map";
import { cachingSeen } from "./lessons/caching-seen";
import { bitLogicalOps } from "./lessons/bit-logical-ops";
import { bitShifts } from "./lessons/bit-shifts";
import { bitCheckSetClear } from "./lessons/bit-check-set-clear";
import { xorCancellation } from "./lessons/xor-cancellation";
import { countSetBits } from "./lessons/count-set-bits";
import { minMaxHeaps } from "./lessons/min-max-heaps";
import { topK } from "./lessons/top-k";
import { kthLargest } from "./lessons/kth-largest";
import { runningMedian } from "./lessons/running-median";
import { mergeSortedData } from "./lessons/merge-sorted-data";
import { twoHeapPattern } from "./lessons/two-heap-pattern";
import { treeDfs } from "./lessons/tree-dfs";
import { treeBfs } from "./lessons/tree-bfs";
import { treeTraversals } from "./lessons/tree-traversals";
import { bstOperations } from "./lessons/bst-operations";
import { treeHeightDepth } from "./lessons/tree-height-depth";
import { lowestCommonAncestor } from "./lessons/lowest-common-ancestor";
import { treeConstruction } from "./lessons/tree-construction";
import { trieInsertion } from "./lessons/trie-insertion";
import { prefixSearch } from "./lessons/prefix-search";
import { wordSearch } from "./lessons/word-search";
import { avlRotations } from "./lessons/avl-rotations";
import { graphRepresentations } from "./lessons/graph-representations";
import { adjacencyLists } from "./lessons/adjacency-lists";
import { graphBfs } from "./lessons/graph-bfs";
import { graphDfs } from "./lessons/graph-dfs";
import { connectedComponents } from "./lessons/connected-components";
import { graphCycleDetection } from "./lessons/graph-cycle-detection";
import { topologicalSort } from "./lessons/topological-sort";
import { multiSourceBfs } from "./lessons/multi-source-bfs";
import { shortestPathsUnweighted } from "./lessons/shortest-paths-unweighted";
import { unionFind } from "./lessons/union-find";
import { dijkstra } from "./lessons/dijkstra";
import { bellmanFord } from "./lessons/bellman-ford";
import { floydWarshall } from "./lessons/floyd-warshall";
import { prim } from "./lessons/prim";
import { kruskal } from "./lessons/kruskal";
import { linkedListTraversal } from "./lessons/linked-list-traversal";
import { linkedListSlowFast } from "./lessons/linked-list-slow-fast";
import { linkedListCycleDetection } from "./lessons/linked-list-cycle-detection";
import { linkedListReversal } from "./lessons/linked-list-reversal";
import { linkedListMerging } from "./lessons/linked-list-merging";
import { linkedListMiddle } from "./lessons/linked-list-middle";
import { linkedListDummyNodes } from "./lessons/linked-list-dummy-nodes";
import { linkedListPointerManipulation } from "./lessons/linked-list-pointer-manipulation";
import { linkedListVariants } from "./lessons/linked-list-variants";
import { linkedListDeques } from "./lessons/linked-list-deques";
import { dpBaseCases } from "./lessons/dp-base-cases";
import { dpRecursiveCalls } from "./lessons/dp-recursive-calls";
import { dpBacktracking } from "./lessons/dp-backtracking";
import { dpSubsets } from "./lessons/dp-subsets";
import { dpPermutations } from "./lessons/dp-permutations";
import { dpCombinations } from "./lessons/dp-combinations";
import { dpMemoization } from "./lessons/dp-memoization";
import { dpTabulation } from "./lessons/dp-tabulation";
import { dp1d2d } from "./lessons/dp-1d-2d";
import { dpKnapsack } from "./lessons/dp-knapsack";
import { dpSubsequences } from "./lessons/dp-subsequences";
import { dpStateTransitions } from "./lessons/dp-state-transitions";
import { dpClimbingStairs } from "./lessons/dp-climbing-stairs";
import { dpHouseRobber } from "./lessons/dp-house-robber";
import { dpGridPaths } from "./lessons/dp-grid-paths";
import { dpCoinChange } from "./lessons/dp-coin-change";
import { dpLis } from "./lessons/dp-lis";
import { dpLcs } from "./lessons/dp-lcs";
import { dpDivideAndConquer } from "./lessons/dp-divide-and-conquer";
import { dpNQueens } from "./lessons/dp-n-queens";
import { fenwickTree } from "./lessons/fenwick-tree";
import { segmentTree } from "./lessons/segment-tree";
import { kmp } from "./lessons/kmp";
// Patterns (Phase 4 — Pattern Library)
import { slidingWindowPattern } from "./patterns/sliding-window";
import { prefixSumsHashmapPattern } from "./patterns/prefix-sums-hashmap";
import { kadanePattern } from "./patterns/kadane";
import { twoPointersPattern } from "./patterns/two-pointers";
import { fastSlowPointersPattern } from "./patterns/fast-slow-pointers";
import { bfsShortestPathPattern } from "./patterns/bfs-shortest-path";
import { backtrackingPattern } from "./patterns/backtracking";
import { binarySearchOnAnswerPattern } from "./patterns/binary-search-on-answer";
import { topKHeapPattern } from "./patterns/top-k-heap";
import { monotonicStackPattern } from "./patterns/monotonic-stack";
// Patterns (Phase 4.1 — full pattern coverage)
import { mergeIntervalsPattern } from "./patterns/merge-intervals";
import { cyclicSortPattern } from "./patterns/cyclic-sort";
import { inPlaceLinkedListReversalPattern } from "./patterns/in-place-linkedlist-reversal";
import { treeBfsPattern } from "./patterns/tree-bfs";
import { treeDfsPattern } from "./patterns/tree-dfs";
import { twoHeapsPattern } from "./patterns/two-heaps";
import { modifiedBinarySearchPattern } from "./patterns/modified-binary-search";
import { bitwiseXorPattern } from "./patterns/bitwise-xor";
import { kWayMergePattern } from "./patterns/k-way-merge";
import { knapsackPattern } from "./patterns/knapsack";
import { topologicalSortPattern } from "./patterns/topological-sort";
import { graphDfsComponentsPattern } from "./patterns/graph-dfs-components";
import { unionFindPattern } from "./patterns/union-find";
import { dijkstraPattern } from "./patterns/dijkstra";
import { triePrefixPattern } from "./patterns/trie-prefix";
import { dynamicProgrammingPattern } from "./patterns/dynamic-programming";
import { divideAndConquerPattern } from "./patterns/divide-and-conquer";
import { greedyIntervalSchedulingPattern } from "./patterns/greedy-interval-scheduling";
import { matrixTraversalPattern } from "./patterns/matrix-traversal";

export const lessons: LessonDefinition[] = [
  // Programming foundations
  variablesAndTypes,
  expressions,
  conditions,
  loops,
  functions,
  scope,
  io,
  referencesMutation,
  classes,
  errors,
  // DSA foundations
  representations,
  complexity,
  cases,
  amortized,
  correctness,
  // Arrays
  arrayTraversal,
  twoPointers,
  prefixSums,
  slidingWindow,
  kadane,
  inPlaceModification,
  matrixTraversal,
  intervals,
  // Strings
  stringFrequency,
  stringTwoPointers,
  stringSlidingWindow,
  stringParsing,
  palindromes,
  anagrams,
  substrings,
  // Searching
  linearSearch,
  binarySearch,
  binarySearchAnswer,
  rotatedArraySearch,
  bounds,
  matrixSearch,
  // Sorting
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  countingSort,
  bucketSort,
  heapSort,
  radixSort,
  comparators,
  intervalSorting,
  // Stacks and queues
  stackQueueOperations,
  monotonicStack,
  parenthesesMatching,
  expressionEvaluation,
  bfsQueues,
  minMaxTracking,
  // Hashing
  mapsSets,
  hashingFrequency,
  duplicateDetection,
  valueToIndex,
  grouping,
  prefixSumsMap,
  cachingSeen,
  // Bit manipulation
  bitLogicalOps,
  bitShifts,
  bitCheckSetClear,
  xorCancellation,
  countSetBits,
  // Heaps
  minMaxHeaps,
  topK,
  kthLargest,
  runningMedian,
  mergeSortedData,
  twoHeapPattern,
  // Trees and tries
  treeDfs,
  treeBfs,
  treeTraversals,
  bstOperations,
  treeHeightDepth,
  lowestCommonAncestor,
  treeConstruction,
  trieInsertion,
  prefixSearch,
  wordSearch,
  avlRotations,
  // Graphs
  graphRepresentations,
  adjacencyLists,
  graphBfs,
  graphDfs,
  connectedComponents,
  graphCycleDetection,
  topologicalSort,
  multiSourceBfs,
  shortestPathsUnweighted,
  unionFind,
  dijkstra,
  bellmanFord,
  floydWarshall,
  prim,
  kruskal,
  // Linear structures — linked lists
  linkedListTraversal,
  linkedListSlowFast,
  linkedListCycleDetection,
  linkedListReversal,
  linkedListMiddle,
  linkedListDummyNodes,
  linkedListMerging,
  linkedListPointerManipulation,
  linkedListVariants,
  linkedListDeques,
  // DP and recursion
  dpBaseCases,
  dpRecursiveCalls,
  dpBacktracking,
  dpSubsets,
  dpPermutations,
  dpCombinations,
  dpMemoization,
  dpTabulation,
  dp1d2d,
  dpKnapsack,
  dpSubsequences,
  dpStateTransitions,
  dpClimbingStairs,
  dpHouseRobber,
  dpGridPaths,
  dpCoinChange,
  dpLis,
  dpLcs,
  dpDivideAndConquer,
  dpNQueens,
  // Range queries
  fenwickTree,
  segmentTree,
  // Strings — KMP
  kmp,
];

export const patterns: PatternDefinition[] = [
  // Arrays & strings
  slidingWindowPattern,
  prefixSumsHashmapPattern,
  kadanePattern,
  twoPointersPattern,
  // Linked lists & sequences
  fastSlowPointersPattern,
  // Graphs & trees
  bfsShortestPathPattern,
  // Recursion & search
  backtrackingPattern,
  // Searching
  binarySearchOnAnswerPattern,
  // Heaps & priority
  topKHeapPattern,
  twoHeapsPattern,
  kWayMergePattern,
  // Stacks & queues
  monotonicStackPattern,
  // Intervals & greedy
  mergeIntervalsPattern,
  greedyIntervalSchedulingPattern,
  // Arrays (more)
  cyclicSortPattern,
  matrixTraversalPattern,
  // Linked lists (more)
  inPlaceLinkedListReversalPattern,
  // Trees & graphs (more)
  treeBfsPattern,
  treeDfsPattern,
  graphDfsComponentsPattern,
  topologicalSortPattern,
  unionFindPattern,
  dijkstraPattern,
  triePrefixPattern,
  // Searching (more)
  modifiedBinarySearchPattern,
  // Bit manipulation
  bitwiseXorPattern,
  // Dynamic programming
  dynamicProgrammingPattern,
  knapsackPattern,
  // Sorting & divide-and-conquer
  divideAndConquerPattern,
];

export function getLesson(id: string): LessonDefinition | undefined {
  return lessons.find((l) => l.id === id);
}

export function getPattern(id: string): PatternDefinition | undefined {
  return patterns.find((p) => p.id === id);
}
