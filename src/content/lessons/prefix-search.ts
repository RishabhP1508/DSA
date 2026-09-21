/**
 * Lesson: Prefix search (Trees and tries). Verified on CPython 3.14.
 * Output: "True\nTrue\nFalse\n3\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.is_word = True
    def starts_with(self, prefix):
        node = self.root
        for ch in prefix:                 # just walk the prefix path
            if ch not in node.children:
                return False              # path breaks -> no such prefix
            node = node.children[ch]
        return True                       # reached the end of the prefix
    def count_with_prefix(self, prefix):
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return 0
            node = node.children[ch]
        total = 0                          # count words in this subtree
        stack = [node]
        while stack:
            n = stack.pop()
            if n.is_word:
                total += 1
            stack.extend(n.children.values())
        return total

t = Trie()
for w in ["cat", "car", "care", "dog"]:
    t.insert(w)
print(t.starts_with("ca"))
print(t.starts_with("do"))
print(t.starts_with("z"))
print(t.count_with_prefix("ca"))`;

export const prefixSearch: LessonDefinition = {
  id: "prefix-search",
  title: "Prefix Search",
  area: "Trees and tries",
  prerequisites: ["trie-insertion"],

  explanation: `A trie's defining superpower is **prefix search** — answering "is there any word starting with this prefix?" and "which/how many words start with it?" — the engine behind **autocomplete**. Unlike a hash set (which only knows exact words), a trie makes this a simple path walk.

**\`starts_with(prefix)\`** just follows the prefix's characters from the root; if the path exists you reach a node, and *everything in that node's subtree* is a word (or word-prefix) sharing that prefix. This is **O(P)** where P is the prefix length — again independent of how many words the trie stores. To **enumerate or count** all words with the prefix, you first walk to the prefix node (O(P)), then traverse its **subtree** (DFS/BFS), collecting nodes with \`is_word\`. For "ca" that subtree holds "cat", "car", "care" → count \`3\`.

The complexity split is worth internalizing: **existence** of a prefix is O(P), but **listing k matching words** costs O(P + total characters in the subtree) — you must actually visit each matching word. That's why autocomplete feels instant to *check* but takes more work to *populate* the suggestion list. The recognition cue: any "starts with / autocomplete / common-prefix" query points at a trie.`,

  vocabulary: [
    { term: "Prefix search", definition: "Finding whether/which stored words begin with a given prefix." },
    { term: "starts_with", definition: "Walks the prefix path; returns whether the path exists in the trie." },
    { term: "Prefix node", definition: "The node reached after walking the prefix; its subtree holds all matching words." },
    { term: "Subtree enumeration", definition: "DFS/BFS over the prefix node's subtree to collect matching words." },
    { term: "Autocomplete", definition: "Suggesting completions of a typed prefix — the canonical trie application." },
  ],

  concepts: {
    purpose: "Answer prefix existence and enumerate/count words by prefix — the basis of autocomplete.",
    operations: "Walk the prefix path (O(P)); to list matches, DFS/BFS the prefix node's subtree.",
    uses: "Autocomplete, prefix counting, dictionary suggestions, prefix-based routing.",
    tradeoffs: "Existence is O(P); enumerating k matches is O(P + matched subtree size). A hash set can't do prefix queries at all.",
    commonMistakes: "Confusing prefix existence (starts_with) with exact word (search + is_word); forgetting the subtree walk when listing matches; assuming enumeration is O(P) (it must visit the matches).",
    edgeCases: "Empty prefix matches all words (subtree is the whole trie). A prefix that breaks returns False/0. A prefix that is also a word counts itself.",
  },

  complexity: [
    { operation: "starts_with (existence)", best: "O(1)", average: "O(P)", worst: "O(P)", space: "O(1)", note: "P = prefix length; independent of word count." },
    { operation: "count/enumerate with prefix", best: "O(P)", average: "O(P + S)", worst: "O(P + S)", space: "O(S)", note: "S = size of the prefix subtree (chars in matching words)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "P", meaning: "the length of the prefix" },
      { symbol: "S", meaning: "the total size of the prefix's subtree (nodes/chars in matching words)" },
    ],
    costModel: "Walking one node per prefix character is expected O(1) each; enumerating visits each subtree node once.",
    time: {
      bound: "O(P)",
      case: "worst",
      explanation: "starts_with walks exactly P characters from the root, one expected-O(1) child lookup each — so prefix EXISTENCE is O(P), regardless of how many words are stored. Counting or enumerating all words with the prefix additionally traverses the prefix node's subtree, visiting each of its S nodes once — so that is O(P + S). The key insight: checking a prefix is cheap and word-count-independent, but producing the matches costs proportional to how many/large they are.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "starts_with uses only a node pointer — O(1). Enumeration uses a stack/queue over the subtree, up to O(S).",
      inputOutputNote: "The trie is the stored data; starts_with is O(1) extra, enumeration is O(S) for its traversal frontier/results.",
    },
    derivation: [
      { lines: [16, 17, 18, 19, 20], description: "starts_with walks P characters — O(P).", cost: "O(P)", dimension: "time" },
      { lines: [28, 29, 30, 31, 32, 33], description: "Counting traverses the prefix subtree (S nodes) after the O(P) walk.", cost: "O(P + S)", dimension: "time" },
      { lines: [28], description: "The enumeration stack holds up to O(S) nodes.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Child lookups are expected O(1).", "S counts the nodes in the matched subtree."],
    tradeoffs: "A hash set answers exact membership in O(word length) but cannot do prefix queries; the trie supports them at O(P) for existence and O(P+S) for enumeration — the reason autocomplete uses tries.",
    counters: [],
    fixedDataNote: "This run: 'ca' and 'do' are prefixes (True), 'z' is not (False); 3 words start with 'ca'. The O(P)/O(P+S) bounds generalise to prefix and subtree sizes.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Define TrieNode (children map + is_word)." },
    { line: 2, executable: true, explanation: "Constructor." },
    { line: 3, executable: true, explanation: "Children map." },
    { line: 4, executable: true, explanation: "End-of-word flag." },
    { line: 5, executable: false, explanation: "Blank line." },
    { line: 6, executable: true, explanation: "Define the Trie." },
    { line: 7, executable: true, explanation: "Constructor." },
    { line: 8, executable: true, explanation: "Empty root." },
    { line: 9, executable: true, explanation: "insert (as in the previous lesson)." },
    { line: 10, executable: true, explanation: "Start at the root." },
    { line: 11, executable: true, explanation: "Descend per character..." },
    { line: 12, executable: true, explanation: "...creating child nodes as needed." },
    { line: 13, executable: true, explanation: "Mark the word end." },
    { line: 14, executable: true, explanation: "starts_with(prefix): does any word begin with it?" },
    { line: 15, executable: true, explanation: "Start at the root." },
    { line: 16, executable: true, explanation: "Walk the prefix characters." },
    { line: 17, executable: true, explanation: "If a character's child is missing..." },
    { line: 18, executable: true, explanation: "...the prefix doesn't exist → False." },
    { line: 19, executable: true, explanation: "Otherwise descend." },
    { line: 20, executable: true, explanation: "Reached the prefix end without breaking → True." },
    { line: 21, executable: true, explanation: "count_with_prefix(prefix): how many words start with it?" },
    { line: 22, executable: true, explanation: "Start at the root." },
    { line: 23, executable: true, explanation: "Walk the prefix..." },
    { line: 24, executable: true, explanation: "...returning 0 if it breaks." },
    { line: 25, executable: true, explanation: "Return 0 (no such prefix)." },
    { line: 26, executable: true, explanation: "Descend." },
    { line: 27, executable: true, explanation: "total = 0: begin counting words in the prefix's subtree." },
    { line: 28, executable: true, explanation: "Seed an explicit DFS stack with the prefix node." },
    { line: 29, executable: true, explanation: "While the stack is non-empty, keep walking the subtree." },
    { line: 30, executable: true, explanation: "Pop a node." },
    { line: 31, executable: true, explanation: "If it ends a word..." },
    { line: 32, executable: true, explanation: "...count it." },
    { line: 33, executable: true, explanation: "Push its children to continue the subtree walk." },
    { line: 34, executable: true, explanation: "Return the total count of words under the prefix." },
    { line: 35, executable: false, explanation: "Blank line." },
    { line: 36, executable: true, explanation: "Create a trie." },
    { line: 37, executable: true, explanation: "Loop over cat, car, care, dog." },
    { line: 38, executable: true, explanation: "Insert each word." },
    { line: 39, executable: true, explanation: "starts_with('ca') → True." },
    { line: 40, executable: true, explanation: "starts_with('do') → True." },
    { line: 41, executable: true, explanation: "starts_with('z') → False." },
    { line: 42, executable: true, explanation: "count_with_prefix('ca') → 3 (cat, car, care)." },
  ],

  bindings: [
    { variable: "t", model: "object" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Checking a prefix exists is O(P). Why does listing all words with that prefix cost O(P + S) instead?", answer: "Because after the O(P) walk to the prefix node, you must traverse its entire subtree (S nodes) to visit every matching word — you cannot produce k matches without visiting them.", explanation: "Existence only needs to reach the prefix node. Enumeration additionally visits each node of the prefix's subtree, so it costs O(P) to reach plus O(S) to walk the matches." },
  ],

  experiments: [
    "Call starts_with('') (empty prefix) and reason about why it matches everything.",
    "Add a words-list variant that returns the actual matching words, not just the count.",
    "Compare with a hash set and confirm the set cannot answer 'starts with'.",
  ],

  exercises: [
    {
      id: "prefix-complete-1",
      kind: "complete-code",
      prompt: "Complete starts_with: walk the prefix, returning False if the path breaks.",
      starterCode: "def starts_with(self, prefix):\n    node = self.root\n    for ch in prefix:\n        # TODO: descend or return False\n        pass\n    return True",
      expected: "def starts_with(self, prefix):\n    node = self.root\n    for ch in prefix:\n        if ch not in node.children:\n            return False\n        node = node.children[ch]\n    return True",
      hints: ["If a character's child is missing, the prefix can't exist.", "Otherwise descend to it.", "if ch not in node.children: return False; node = node.children[ch]"],
    },
    {
      id: "prefix-choose-1",
      kind: "choose-approach",
      prompt: "You're building autocomplete over a large dictionary. Why a trie over a hash set, and what's the cost to check a prefix vs list 10 suggestions?",
      expected: "A trie supports prefix queries a hash set can't. Checking a prefix exists is O(P) (prefix length). Listing suggestions costs O(P + S) — reaching the prefix node then walking its subtree to collect the matching words.",
      hints: ["Hash sets do exact match only.", "Prefix existence is a path walk: O(P).", "Listing matches walks the subtree: O(P + S)."],
    },
  ],

  review: `**Prefix search** is the trie's signature feature: **\`starts_with\`** walks the prefix path in **O(P)** (independent of word count), and **enumerating/counting** matches walks the prefix node's subtree for **O(P + S)**. This powers **autocomplete**, which a hash set cannot do. Remember the split: prefix *existence* is cheap; *listing* matches costs proportional to how many there are.`,

  expectedOutput: "True\nTrue\nFalse\n3\n",

  references: [
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Tries — startsWith / prefix queries",
      topic: "trees/prefix-search",
      purpose: "Confirm startsWith walks the prefix in O(P) and prefix enumeration traverses the subtree.",
      verifiedClaims: ["Trie prefix existence is O(prefix length); listing matches traverses the prefix subtree"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://www.geeksforgeeks.org/trie-insert-and-search/",
      title: "Trie — Insert and Search — GeeksforGeeks",
      section: "Prefix search / startsWith",
      topic: "trees/prefix-search",
      purpose: "Cross-check the prefix-walk approach and the distinction from exact word search.",
      verifiedClaims: ["startsWith follows the prefix path; it differs from exact search which checks the end-of-word flag"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "175bba019a175975",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
