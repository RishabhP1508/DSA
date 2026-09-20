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
];

export const patterns: PatternDefinition[] = [];

export function getLesson(id: string): LessonDefinition | undefined {
  return lessons.find((l) => l.id === id);
}
