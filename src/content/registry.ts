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
import { linkedListTraversal } from "./lessons/linked-list-traversal";

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
  // Linear structures
  linkedListTraversal,
];

export const patterns: PatternDefinition[] = [];

export function getLesson(id: string): LessonDefinition | undefined {
  return lessons.find((l) => l.id === id);
}
