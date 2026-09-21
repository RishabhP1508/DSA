/**
 * Lesson: Trie insertion (Trees and tries). Verified on CPython 3.14.
 * Output: "True\nFalse\nTrue\nFalse\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `class TrieNode:
    def __init__(self):
        self.children = {}     # char -> TrieNode
        self.is_word = False   # does a word END here?

class Trie:
    def __init__(self):
        self.root = TrieNode()
    def insert(self, word):
        node = self.root
        for ch in word:                                   # walk/extend char by char
            node = node.children.setdefault(ch, TrieNode())
        node.is_word = True                               # mark the end of a word
    def search(self, word):
        node = self._walk(word)
        return node is not None and node.is_word          # must be a full word
    def _walk(self, s):
        node = self.root
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node

t = Trie()
for w in ["cat", "car", "care"]:
    t.insert(w)
print(t.search("car"))    # inserted word -> True
print(t.search("ca"))     # a prefix, not a full word -> False
print(t.search("care"))   # inserted word -> True
print(t.search("cab"))    # never inserted -> False`;

export const trieInsertion: LessonDefinition = {
  id: "trie-insertion",
  title: "Trie Insertion and Search",
  area: "Trees and tries",
  prerequisites: ["maps-sets", "classes"],

  explanation: `A **trie** (prefix tree) stores a set of strings by their **characters along paths**: the root is empty, and each edge is labelled by a character, so the word "car" is the path root→c→a→r. Words that share a prefix **share nodes** — "cat", "car", and "care" all reuse the "ca" path — which makes a trie extremely efficient for prefix-based queries.

**Insertion** walks the word character by character, creating a child node whenever the next character doesn't exist yet (\`children.setdefault(ch, TrieNode())\`), and marks the final node with \`is_word = True\`. That boolean flag is essential: it distinguishes a **stored word** from a mere **prefix**. \`search("car")\` is True (an inserted word), but \`search("ca")\` is False — "ca" is a valid path but was never marked as a word.

Each operation touches one node per character, so insert and search are **O(L)** where L is the word length — **independent of how many words** the trie holds. That's the trie's superpower over a hash set: a hash set answers "is this exact word present?" in expected O(L) too, but it **cannot** efficiently answer "which words start with this prefix?" — the next lesson shows how the trie does. Space is **O(total characters)** across all inserted words (shared prefixes save memory).`,

  vocabulary: [
    { term: "Trie (prefix tree)", definition: "A tree storing strings along character-labelled paths, sharing common prefixes." },
    { term: "Trie node", definition: "Holds a children map (char → node) and an is_word end-of-word flag." },
    { term: "is_word flag", definition: "Marks a node as the end of a stored word, distinguishing words from prefixes." },
    { term: "Shared prefix", definition: "Words with the same start reuse the same nodes/edges." },
    { term: "L (word length)", definition: "The number of characters; sets the cost of insert/search." },
  ],

  concepts: {
    purpose: "Store a set of strings for O(L) insert/search and (next lesson) fast prefix queries.",
    operations: "Insert: walk/extend nodes per character, mark is_word. Search: walk the path, require is_word.",
    uses: "Autocomplete, spell-check, dictionary/word games, IP routing, prefix matching.",
    tradeoffs: "O(L) per op regardless of word count and prefix-sharing saves space; but per-node child maps add overhead vs a hash set for exact-match-only needs.",
    commonMistakes: "Forgetting is_word (then a prefix falsely counts as a word); not creating missing child nodes on insert; confusing search (full word) with prefix search.",
    edgeCases: "Empty string marks the root as a word. Searching an absent path returns early. A prefix of a word (not itself inserted) is not a word.",
  },

  complexity: [
    { operation: "insert / search", best: "O(L)", average: "O(L)", worst: "O(L)", space: "O(total chars)", note: "L = word length; cost is independent of the number of stored words." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "L", meaning: "the length of the word being inserted or searched" },
      { symbol: "N", meaning: "the total number of characters across all inserted words" },
    ],
    costModel: "Each character step is one dict lookup/insert on a node's children (expected O(1)).",
    time: {
      bound: "O(L)",
      case: "worst",
      explanation: "Insert and search each walk one node per character of the word, doing an expected-O(1) child-map lookup/insert per step — so both are O(L), where L is the word's length. Crucially this does NOT depend on how many words the trie already contains, unlike scanning a list of words. (Each child lookup is expected O(1) because children is a hash map.)",
    },
    space: {
      bound: "O(total chars)",
      case: "worst",
      explanation: "The trie stores at most one node per character across all inserted words — O(N) where N is the total number of characters. Shared prefixes reduce this below the naive sum, since common starts reuse nodes.",
      inputOutputNote: "The trie IS the stored dictionary; its size is proportional to the total characters (minus shared-prefix savings).",
    },
    derivation: [
      { lines: [11, 12], description: "Insert walks/extends one node per character — O(L).", cost: "O(L)", dimension: "time" },
      { lines: [18, 19, 20, 21, 22], description: "Search (_walk) walks one node per character — O(L).", cost: "O(L)", dimension: "time" },
      { lines: [12], description: "Each new character may add a node; total nodes O(total chars).", cost: "O(total chars)", dimension: "space" },
    ],
    assumptions: ["children is a hash map with expected-O(1) lookup/insert.", "L is the word length; cost is independent of the number of stored words."],
    tradeoffs: "A hash set answers exact membership in expected O(L) too and is simpler, but cannot enumerate words by prefix; the trie pays extra per-node structure to support prefix queries (next lesson).",
    counters: [],
    fixedDataNote: "This run inserts 3 words then searches 4. 'car'/'care' are words (True); 'ca' is only a prefix (False); 'cab' was never inserted (False). The O(L) bound generalises to any word length.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: true, explanation: "Define TrieNode." },
    { line: 2, executable: true, explanation: "Constructor." },
    { line: 3, executable: true, explanation: "children maps a character to the next TrieNode." },
    { line: 4, executable: true, explanation: "is_word marks whether a word ends at this node." },
    { line: 5, executable: false, explanation: "Blank line." },
    { line: 6, executable: true, explanation: "Define the Trie wrapper." },
    { line: 7, executable: true, explanation: "Constructor." },
    { line: 8, executable: true, explanation: "Create the empty root node." },
    { line: 9, executable: true, explanation: "insert(word)." },
    { line: 10, executable: true, explanation: "Start at the root." },
    { line: 11, executable: true, explanation: "For each character..." },
    { line: 12, executable: true, explanation: "...descend, creating the child node if it doesn't exist (setdefault)." },
    { line: 13, executable: true, explanation: "Mark the final node as the end of a word." },
    { line: 14, executable: true, explanation: "search(word)." },
    { line: 15, executable: true, explanation: "Walk to the node at the end of the word." },
    { line: 16, executable: true, explanation: "It's a word only if the path exists AND is_word is set." },
    { line: 17, executable: true, explanation: "Helper _walk(s): follow the path for string s." },
    { line: 18, executable: true, explanation: "Start at the root." },
    { line: 19, executable: true, explanation: "For each character..." },
    { line: 20, executable: true, explanation: "...if the child is missing, the path doesn't exist." },
    { line: 21, executable: true, explanation: "Return None (not found)." },
    { line: 22, executable: true, explanation: "Otherwise descend to the child." },
    { line: 23, executable: true, explanation: "Return the node reached." },
    { line: 24, executable: false, explanation: "Blank line." },
    { line: 25, executable: true, explanation: "Create a trie." },
    { line: 26, executable: true, explanation: "Insert cat, car, care (they share the 'ca' prefix)." },
    { line: 27, executable: true, explanation: "Insert each word." },
    { line: 28, executable: true, explanation: "search('car') → True (an inserted word)." },
    { line: 29, executable: true, explanation: "search('ca') → False (a prefix, not marked is_word)." },
    { line: 30, executable: true, explanation: "search('care') → True." },
    { line: 31, executable: true, explanation: "search('cab') → False (never inserted)." },
  ],

  bindings: [
    { variable: "t", model: "object" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why does search('ca') return False even though 'cat', 'car', and 'care' were all inserted?", answer: "Because 'ca' is only a prefix — the node at the end of 'ca' was never marked is_word. search requires reaching a node whose is_word flag is True.", explanation: "The is_word flag distinguishes stored words from mere prefixes. The 'ca' path exists (shared by cat/car/care) but no word 'ca' was inserted, so its end node's is_word is False." },
  ],

  experiments: [
    "Insert 'ca' as a word and confirm search('ca') becomes True.",
    "Insert the empty string and see the root's is_word set.",
    "Print the children keys at the root and at the 'c' and 'ca' nodes to see the shared prefix.",
  ],

  exercises: [
    {
      id: "trie-complete-1",
      kind: "complete-code",
      prompt: "Complete trie insert: descend creating nodes, then mark the word end.",
      starterCode: "def insert(self, word):\n    node = self.root\n    for ch in word:\n        # TODO: descend, creating a child node if needed\n        pass\n    node.is_word = True",
      expected: "def insert(self, word):\n    node = self.root\n    for ch in word:\n        node = node.children.setdefault(ch, TrieNode())\n    node.is_word = True",
      hints: ["Use setdefault to create the child if missing.", "Reassign node to the child each step.", "node = node.children.setdefault(ch, TrieNode())"],
    },
    {
      id: "trie-choose-1",
      kind: "choose-approach",
      prompt: "For exact-word membership only, a hash set and a trie are both ~O(L). Why might you still choose a hash set — and what does the trie enable that the set can't?",
      expected: "For exact membership alone, a hash set is simpler and lower-overhead. The trie's advantage is prefix queries — enumerating or counting all words that start with a prefix, which a hash set cannot do efficiently.",
      hints: ["Both do exact lookup in O(L).", "What extra query does a trie support?", "Prefix search / autocomplete — impossible efficiently with a plain set."],
    },
  ],

  review: `A **trie** stores strings along character paths, sharing common prefixes. **Insertion** walks the word, creating child nodes as needed and marking the end with **is_word**; **search** walks the path and requires is_word (so a prefix isn't mistaken for a word). Both are **O(L)** in the word length — independent of the number of stored words — using **O(total chars)** space. This structure is what makes fast prefix queries (next lesson) possible.`,

  expectedOutput: "True\nFalse\nTrue\nFalse\n",

  references: [
    {
      url: "https://neetcode.io/roadmap",
      title: "NeetCode roadmap",
      section: "Tries — Implement Trie (Prefix Tree)",
      topic: "trees/trie-insertion",
      purpose: "Confirm the trie node structure (children map + is_word) and O(L) insert/search.",
      verifiedClaims: ["Trie insert/search are O(L); is_word distinguishes words from prefixes"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://cp-algorithms.com/string/aho_corasick.html",
      title: "Aho-Corasick / trie — CP-Algorithms",
      section: "Trie construction",
      topic: "trees/trie-insertion",
      purpose: "Cross-check that a trie stores strings along edges with O(total length) space and O(L) operations.",
      verifiedClaims: ["A trie's size is proportional to the total length of inserted strings; operations are O(L)"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 18,
    contentHash: "f8bdff7320763ae1",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
