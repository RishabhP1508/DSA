/**
 * Lesson: Representations (DSA foundations).
 * Verified on CPython 3.14. Output: "[0, 1, 1, 0]\n{0: [1], 1: [0]}\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# The SAME information can be stored in different shapes.
# Here: which pairs of 2 items are "connected".
# Representation A: a flat list of flags (item i connected to i+1?).
as_list = [0, 1, 1, 0]
# Representation B: a map from item -> its neighbours.
as_dict = {0: [1], 1: [0]}
print(as_list)
print(as_dict)`;

export const representations: LessonDefinition = {
  id: "representations",
  title: "Representations of Data",
  area: "DSA foundations",
  prerequisites: ["variables-and-types"],

  explanation: `A **data structure** is a way of *representing* information so that the operations you care about are efficient. The same facts can be stored in different shapes, and the shape you pick determines which operations are fast.

Consider "who is connected to whom". You could store a **list** (positional flags), or a **map** from each item to its neighbours. Neither is "more correct" — they trade off differently. A map (dict) gives fast "who are X's neighbours?" lookups; a flat list is compact and cache-friendly but answering neighbour queries may require scanning.

The lesson's takeaway: **choose the representation to match your operations.** Later topics make this concrete — adjacency lists vs adjacency matrices for graphs, arrays vs linked lists for sequences, heaps for "give me the smallest". Recognising representations is the first step of that skill.`,

  vocabulary: [
    { term: "Data structure", definition: "A way of organising data to make certain operations efficient." },
    { term: "Representation", definition: "The concrete shape chosen to store information (list, map, tree, …)." },
    { term: "Abstract data type (ADT)", definition: "What operations are supported (e.g. 'a set'), independent of how they're stored." },
    { term: "Trade-off", definition: "A representation that speeds up one operation often costs more time or space elsewhere." },
  ],

  concepts: {
    purpose: "Choosing the right representation is what makes an algorithm fast; the same data can be stored many ways.",
    operations: "Compare how each representation supports lookup, insertion, iteration, and membership.",
    uses: "Adjacency list vs matrix (graphs), array vs linked list (sequences), dict vs list (lookups).",
    tradeoffs: "Maps give fast keyed lookup at the cost of overhead; flat lists are compact but slower for keyed queries.",
    commonMistakes: "Picking a structure by habit rather than by the operations needed; ignoring how representation affects complexity.",
    edgeCases: "Empty structures; representations that can encode the same fact more than once (redundancy).",
  },

  complexity: [
    { operation: "list index access", best: "O(1)", average: "O(1)", worst: "O(1)", note: "Direct positional access." },
    { operation: "dict key lookup", best: "O(1)", average: "O(1)", worst: "O(n)", note: "Expected O(1) with hashing; worst case on many collisions." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of items stored in the structure" }],
    costModel: "List indexing by position is O(1). Dict lookup by key is expected O(1) using hashing, with an O(n) worst case under pathological collisions.",
    time: {
      bound: "O(1)",
      case: "worst",
      explanation: "This program only builds two small literals and prints them — a fixed amount of work. The interesting complexity is in the OPERATIONS each representation supports (shown in the summary table), not in this construction.",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "Each representation stores O(n) entries for n items. The map stores keys plus neighbour lists; the list stores one slot per position. Both are linear in the amount of information held.",
      inputOutputNote: "These structures ARE the data; their O(n) size is inherent, not auxiliary overhead.",
    },
    derivation: [
      { lines: [4], description: "Build a fixed 4-element list literal.", cost: "O(1)", dimension: "time" },
      { lines: [6], description: "Build a fixed 2-key dict literal.", cost: "O(1)", dimension: "time" },
      { lines: [4, 6], description: "Storing n items in either shape uses O(n) space.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Dict lookups are expected O(1) under Python's hashing.", "This example uses fixed small literals, so construction is constant work."],
    tradeoffs: "A map answers 'neighbours of X?' in expected O(1); a flat list may need an O(n) scan for the same question. The list uses less overhead per element. Pick per your operation mix.",
    fixedDataNote: "The literals are fixed, so building them is constant work here. The O(1)/O(n) operation costs in the table describe how each representation behaves as the data grows to n items.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: the same info can take different shapes." },
    { line: 2, executable: false, explanation: "Comment describing the example (connections)." },
    { line: 3, executable: false, explanation: "Comment: representation A is a flat list of flags." },
    { line: 4, executable: true, explanation: "Build the list representation [0, 1, 1, 0]." },
    { line: 5, executable: false, explanation: "Comment: representation B is a neighbour map." },
    { line: 6, executable: true, explanation: "Build the dict representation {0: [1], 1: [0]}." },
    { line: 7, executable: true, explanation: "Print the list representation." },
    { line: 8, executable: true, explanation: "Print the dict representation." },
  ],

  bindings: [
    { variable: "as_list", model: "array" },
    { variable: "as_dict", model: "dict" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Which representation answers 'who are the neighbours of item 0?' faster: the flat list or the neighbour map?", answer: "The neighbour map (dict), in expected O(1).", explanation: "A dict looks up key 0 directly in expected O(1); the flat list may require scanning to reconstruct neighbours." },
  ],

  experiments: [
    "Add a third item and update BOTH representations to keep them equivalent.",
    "Write a loop that answers 'neighbours of X' using the list, and note the extra work versus the dict.",
    "Discuss when the compact list would be preferable (dense, positional data).",
  ],

  exercises: [
    {
      id: "repr-choose-1",
      kind: "choose-approach",
      prompt: "You frequently ask 'is key K present, and what is its value?' on changing data. Which representation fits: a list of pairs, or a dict?",
      expected: "A dict — keyed lookup is expected O(1), versus O(n) scanning a list of pairs.",
      hints: ["What operation is frequent?", "Keyed lookup by K.", "A dict gives expected O(1) keyed lookup."],
    },
    {
      id: "repr-predict-1",
      kind: "predict-state",
      prompt: "Do the list and dict here store the same relationship? What operation distinguishes them?",
      expected: "They can encode the same connections, but the dict supports direct neighbour lookup by key (O(1)); the list stores positional flags and needs interpretation/scanning.",
      hints: ["Both describe connections.", "How do you get item 0's neighbours from each?", "The dict indexes by key directly; the list does not."],
    },
  ],

  review: `A **representation** is the concrete shape of your data, and the right choice makes operations efficient. The same information fits many shapes (list vs map, and later adjacency list vs matrix). Match the representation to the **operations** you need most: dicts give expected **O(1)** keyed lookup, lists give **O(1)** positional access; both store n items in **O(n)** space.`,

  expectedOutput: "[0, 1, 1, 0]\n{0: [1], 1: [0]}\n",

  references: [
    {
      url: "https://opendatastructures.org/",
      title: "Open Data Structures",
      section: "Introduction — the role of data structures / interfaces vs implementations",
      topic: "dsa/representations",
      purpose: "Confirm the idea that an interface (operations) can have multiple implementations with different costs.",
      verifiedClaims: ["The same abstract data type can be implemented by different structures with different runtimes"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://www.w3schools.com/python/python_dsa.asp",
      title: "Python DSA — W3Schools",
      section: "What are data structures",
      topic: "dsa/representations",
      purpose: "Beginner cross-check of the definition of a data structure.",
      verifiedClaims: ["A data structure organises data for efficient use"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "234fdd7bef71bb6e",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 1,
  },
};
