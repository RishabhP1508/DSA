/**
 * Pattern: Trie (prefix tree).
 *
 * Walkthrough verified on CPython 3.14 (bundled Pyodide 3.14.2).
 * Output "True\nFalse\n".
 */

import type { PatternDefinition } from "../../core/types";

const walkthroughCode = `# Trie (prefix tree): share common prefixes so prefix queries cost O(len).
class TrieNode:
    def __init__(self):
        self.children = {}     # char -> TrieNode
        self.is_end = False    # marks a complete word

class Trie:
    def __init__(self):
        self.root = TrieNode()
    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True
    def starts_with(self, prefix):
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return False   # prefix path breaks -> no such prefix
            node = node.children[ch]
        return True

t = Trie()
t.insert("apple")
t.insert("app")
print(t.starts_with("app"))    # True
print(t.starts_with("api"))    # False`;

export const triePrefixPattern: PatternDefinition = {
  id: "trie-prefix",
  title: "Trie (Prefix Tree)",
  category: "Graphs & trees",
  summary:
    "Store strings in a tree keyed by characters so insert and prefix/word lookups cost O(length), independent of how many words are stored.",

  clues: [
    "You have MANY strings and do repeated PREFIX queries, autocomplete, or word lookups.",
    "You need 'does any stored word start with this prefix?', or to search a board for dictionary words.",
    "Phrases like 'implement a trie', 'prefix search', 'autocomplete', 'word search II', 'replace words', 'add and search word'.",
  ],

  naiveApproach: `Keep the words in a list/set and scan them for each query. Checking a prefix against every word is **O(N·L)** per query (N words, length L), and it re-examines shared prefixes over and over. A hash set answers exact-word lookups but can't do prefix queries at all.`,

  whyItHelps: `A **trie** stores strings as paths from the root, one edge per character, so words with a common prefix **share** that path. Insert and lookup walk one edge per character — **O(L)**, independent of the number of stored words. Prefix queries are the same walk: if you can follow the whole prefix, some word has it. A boolean \`is_end\` marks where complete words end (distinguishing "app" the word from "app" the prefix of "apple"). Total space is **O(total characters)**, and shared prefixes save memory versus storing each word separately.`,

  conditions: [
    "Keys are sequences over a known alphabet (characters); each node maps a symbol to a child.",
    "Mark word ends explicitly (is_end) so prefixes and full words are distinguishable.",
    "Best when prefix queries are frequent; for exact-only lookups a hash set is simpler.",
  ],

  alternatives: [
    "Hash set / map — for exact word membership only, O(L) average with no prefix support.",
    "Sorted list + binary search — prefix ranges via lower/upper bound, but O(L log N) and awkward for dynamic inserts.",
    "Suffix automaton / Aho–Corasick — for multi-pattern substring matching (beyond simple prefixes).",
  ],

  counterexamples: [
    "If you only ever check whole-word membership (no prefixes), a hash set is simpler and enough.",
    "Substring (not prefix) search across a text is a KMP / Aho–Corasick problem, not a plain trie.",
    "Omitting is_end conflates a stored word with a mere prefix, breaking exact-word queries.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "True\nFalse\n",
  complexityNote:
    "O(L) per insert and per prefix/word query, where L is the string length — independent of the number of stored words. Space O(total characters across inserted words).",

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "L", meaning: "the length of the word or prefix being processed" },
      { symbol: "T", meaning: "the total number of characters across all inserted words" },
    ],
    costModel: "Each insert/query walks one node per character, doing an O(1) dictionary lookup at each step. Cost depends on the string length, NOT on how many words are stored.",
    time: {
      bound: "O(L)",
      case: "worst",
      explanation: "insert (lines 12-15) and starts_with (lines 19-22) each loop over the L characters of the input, doing one O(1) child-map lookup/insert per character. So O(L) per operation — independent of the number of stored words.",
    },
    space: {
      bound: "O(T)",
      case: "worst",
      explanation: "In the worst case (no shared prefixes) the trie has one node per character inserted, so O(T) total across all words. A single insert adds at most O(L) new nodes.",
      inputOutputNote: "The stored words define the trie size (O(T)); a query returns a boolean.",
    },
    derivation: [
      { lines: [12, 13, 14, 15], description: "insert walks/creates one node per character.", cost: "O(L)", dimension: "time" },
      { lines: [19, 20, 21, 22], description: "starts_with walks one node per prefix character.", cost: "O(L)", dimension: "time" },
      { lines: [14], description: "Up to O(L) new nodes per insert; O(T) overall.", cost: "O(T)", dimension: "space" },
    ],
    assumptions: ["dict child lookup/insert are amortised O(1).", "Cost is per-string-length, independent of the number of stored words — the trie's key advantage."],
    tradeoffs: "A hash set of words answers exact-membership in O(L) too but cannot answer PREFIX queries efficiently; the trie shares prefixes and supports prefix search at O(L).",
    counters: [{ label: "characters walked", definition: "executions of the insert descent (line 15)", countLines: [15] }],
    fixedDataNote: "Inserting 'apple' and 'app' shares the 'app' prefix; starts_with('app') walks 3 nodes. The O(L) bound generalises.",
  },

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: a trie shares common prefixes." },
    { line: 2, executable: true, explanation: "Define the trie node." },
    { line: 3, executable: true, explanation: "Constructor." },
    { line: 4, executable: true, explanation: "children maps a character to the next node." },
    { line: 5, executable: true, explanation: "is_end marks the end of a complete word." },
    { line: 6, executable: false, explanation: "Blank line." },
    { line: 7, executable: true, explanation: "Define the Trie wrapper." },
    { line: 8, executable: true, explanation: "Constructor." },
    { line: 9, executable: true, explanation: "Start with an empty root node." },
    { line: 10, executable: true, explanation: "insert(word): add a word character by character." },
    { line: 11, executable: true, explanation: "Begin at the root." },
    { line: 12, executable: true, explanation: "For each character..." },
    { line: 13, executable: true, explanation: "...create the child if it doesn't exist..." },
    { line: 14, executable: true, explanation: "...(new node)..." },
    { line: 15, executable: true, explanation: "...and descend into it." },
    { line: 16, executable: true, explanation: "Mark the final node as a complete word." },
    { line: 17, executable: true, explanation: "starts_with(prefix): is any word prefixed by this?" },
    { line: 18, executable: true, explanation: "Begin at the root." },
    { line: 19, executable: true, explanation: "Follow each prefix character." },
    { line: 20, executable: true, explanation: "If a character's path is missing..." },
    { line: 21, executable: true, explanation: "...no word has this prefix." },
    { line: 22, executable: true, explanation: "Descend to the child." },
    { line: 23, executable: true, explanation: "Walked the whole prefix -> it exists." },
    { line: 24, executable: false, explanation: "Blank line." },
    { line: 25, executable: true, explanation: "Create a trie." },
    { line: 26, executable: true, explanation: "Insert 'apple'." },
    { line: 27, executable: true, explanation: "Insert 'app' (shares the 'app' path)." },
    { line: 28, executable: true, explanation: "'app' is a valid prefix -> True." },
    { line: 29, executable: true, explanation: "'api' breaks after 'ap' -> False." },
  ],

  bindings: [{ variable: "t", model: "trie" }],

  linkedLessons: ["trie-insertion", "prefix-search", "word-search"],

  exercises: [
    {
      id: "pat-trie-recognize-1",
      kind: "choose-approach",
      prompt:
        "Recognize: 'Build an autocomplete that, given a prefix, tells whether any stored word starts with it, over thousands of words.' Which pattern?",
      expected:
        "Trie (prefix tree): insert each word once; a prefix query walks one node per character in O(L), independent of the dictionary size — far better than scanning all words per query.",
      correctPatternId: "trie-prefix",
      hints: [
        "Repeated PREFIX queries over many words.",
        "Share common prefixes in a tree.",
        "Query cost is O(prefix length).",
      ],
    },
    {
      id: "pat-trie-choose-1",
      kind: "choose-approach",
      prompt:
        "You only need to test whether an exact word is in a dictionary (never prefixes). Trie or hash set?",
      expected:
        "Hash set — exact membership is O(L) average and far simpler. A trie's advantage is prefix queries; without them, the set wins on simplicity.",
      correctPatternId: "trie-prefix",
      hints: [
        "No prefix queries here.",
        "Exact membership only.",
        "A set is simpler and sufficient.",
      ],
    },
    {
      id: "pat-trie-fix-1",
      kind: "fix-mistake",
      prompt:
        "This search treats a mere prefix as a stored word. Fix it to check only full words (use is_end).",
      starterCode:
        "def search(self, word):\n    node = self.root\n    for ch in word:\n        if ch not in node.children:\n            return False\n        node = node.children[ch]\n    return True",
      expected:
        "def search(self, word):\n    node = self.root\n    for ch in word:\n        if ch not in node.children:\n            return False\n        node = node.children[ch]\n    return node.is_end",
      hints: [
        "Reaching the end of the path isn't the same as a stored word.",
        "A word must have been marked at that node.",
        "return node.is_end",
      ],
    },
  ],

  references: [
    {
      url: "https://leetcode.com/problems/implement-trie-prefix-tree/editorial/",
      title: "Implement Trie (Prefix Tree) — LeetCode editorial",
      section: "Node structure, insert, search, startsWith; O(L) operations",
      topic: "patterns/trie-prefix",
      purpose: "Confirm the trie node design, is_end marking, and O(length) insert/prefix operations.",
      verifiedClaims: [
        "Trie insert and prefix queries run in O(word length), independent of the number of stored words.",
        "An is_end flag distinguishes complete words from prefixes.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://en.wikipedia.org/wiki/Trie",
      title: "Trie — Wikipedia",
      section: "Structure and prefix sharing",
      topic: "patterns/trie-prefix",
      purpose: "Cross-check that a trie keys nodes by characters and shares common prefixes.",
      verifiedClaims: ["A trie stores strings along root-to-node paths, sharing common prefixes among keys."],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "ce366fef2a20542b",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
