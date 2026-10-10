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
  "purpose": "Store a set of strings for O(L) insert/search and (next lesson) fast prefix queries.",
  "operations": "Insert: walk/extend nodes per character, mark is_word. Search: walk the path, require is_word.",
  "uses": "Autocomplete, spell-check, dictionary/word games, IP routing, prefix matching.",
  "tradeoffs": "Prefix paths avoid scanning all words, with object/dictionary overhead. A hash set can answer prefix queries by scanning, but has no prefix index.",
  "commonMistakes": "Forgetting is_word (then a prefix falsely counts as a word); not creating missing child nodes on insert; confusing search (full word) with prefix search.",
  "edgeCases": "Empty string marks the root as a word. Searching an absent path returns early. A prefix of a word (not itself inserted) is not a word. In this path representation the empty prefix exists even when no words are stored. Inserting the empty word marks the root."
},

  complexity: [
  {
    "operation": "insert / search",
    "best": "O(L)",
    "average": "O(L)",
    "worst": "O(L)",
    "space": "O(1) working; O(N+1) retained trie",
    "note": "Expected O(L) dictionary work per operation; search may fail early. N counts all inserted characters; stored nodes include the root."
  }
],

  complexityExplanation: {
  "scope": "operation",
  "variables": [
    {
      "symbol": "L",
      "meaning": "the length of the word being inserted or searched"
    },
    {
      "symbol": "N",
      "meaning": "the total number of characters across all inserted words"
    }
  ],
  "costModel": "One dictionary child lookup per character has expected O(1) cost. setdefault eagerly constructs its default TrieNode, even when the existing child wins; discarded temporary nodes add constant work per character.",
  "time": {
    "bound": "O(L)",
    "case": "expected",
    "explanation": "Insert and search each walk one node per character of the word, doing an expected-O(1) child-map lookup/insert per step — so both are O(L), where L is the word's length. Crucially this does NOT depend on how many words the trie already contains, unlike scanning a list of words. (Each child lookup is expected O(1) because children is a hash map.)"
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "An iterative insert/search uses a node pointer and a constant-size temporary node. Stored trie growth is data-structure storage, described separately.",
    "inputOutputNote": "The structure has at most N+1 nodes for N inserted characters, including its root. One insertion retains at most L new nodes. Structure storage is excluded from per-operation auxiliary space."
  },
  "derivation": [
    {
      "lines": [
        11,
        12
      ],
      "description": "Insert walks/extends one node per character — O(L).",
      "cost": "O(L)",
      "dimension": "time"
    },
    {
      "lines": [
        18,
        19,
        20,
        21,
        22
      ],
      "description": "Search (_walk) walks one node per character — O(L).",
      "cost": "O(L)",
      "dimension": "time"
    },
    {
      "lines": [
        12
      ],
      "description": "Working pointers and at most one temporary default node; retained trie nodes belong to the data structure.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "children is a hash map with expected-O(1) lookup/insert.",
    "L is the word length; cost is independent of the number of stored words.",
    "Expected dictionary lookup cost; arbitrary characters and explicit terminal flags. Total stored-node bound includes the root."
  ],
  "tradeoffs": "A hash set is often simpler for exact membership. A trie avoids scanning the dictionary for prefix paths, while Python node objects add storage overhead.",
  "counters": [],
  "fixedDataNote": "This run inserts 3 words then searches 4. 'car'/'care' are words (True); 'ca' is only a prefix (False); 'cab' was never inserted (False). The O(L) bound generalises to any word length.",
  "references": [
    {
      "url": "https://cp-algorithms.com/string/aho_corasick.html",
      "title": "CP Algorithms: trie construction",
      "section": "Construction of the trie",
      "topic": "trees-graphs-range",
      "purpose": "Verify the stated algorithm and identify implementation conventions.",
      "verifiedClaims": [
        "Paths share prefixes.",
        "Terminal flags distinguish complete words."
      ],
      "conventions": [
        "App uses dictionaries for arbitrary characters rather than a fixed 26-child array."
      ],
      "accessDate": "2026-10-10"
    },
    {
      "url": "https://www.cs.usfca.edu/~galles/visualization/Trie.html",
      "title": "USFCA: Trie Visualization",
      "topic": "trie",
      "section": "Inserted APP and APPLE; inspected shared A-P-P path and terminal coloring.",
      "purpose": "Inspect character-edge and terminal-node visual conventions.",
      "verifiedClaims": [
        "Shared prefix nodes remain common.",
        "APP stays terminal when APPLE is added."
      ],
      "conventions": [
        "Reference uses uppercase; app accepts arbitrary characters."
      ],
      "accessDate": "2026-10-10"
    },
    {
      "url": "https://docs.python.org/3.14/library/stdtypes.html#dict.setdefault",
      "title": "Python 3.14: dictionary operations",
      "topic": "python-dict",
      "section": "dict.setdefault and insertion-order guarantee",
      "purpose": "Check supported dictionary behavior against the language manual.",
      "verifiedClaims": [
        "setdefault returns an existing value or inserts its default.",
        "Dictionaries preserve insertion order, not sorted-key order."
      ],
      "conventions": [
        "Online manual currently displays 3.14.8; executable behavior was probed on bundled 3.14.2."
      ],
      "accessDate": "2026-10-10"
    }
  ]
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": true,
    "explanation": "Define TrieNode."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Constructor."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "children maps a character to the next TrieNode."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "is_word marks whether a word ends at this node."
  },
  {
    "line": 5,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Define the Trie wrapper."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Constructor."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Create the empty root node."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "insert(word)."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Start at the root."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "For each character..."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Evaluate a new temporary TrieNode, then keep it only if this character has no child; otherwise follow the existing child."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Mark the final node as the end of a word."
  },
  {
    "line": 14,
    "executable": true,
    "explanation": "search(word)."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Walk to the node at the end of the word."
  },
  {
    "line": 16,
    "executable": true,
    "explanation": "It's a word only if the path exists AND is_word is set."
  },
  {
    "line": 17,
    "executable": true,
    "explanation": "Helper _walk(s): follow the path for string s."
  },
  {
    "line": 18,
    "executable": true,
    "explanation": "Start at the root."
  },
  {
    "line": 19,
    "executable": true,
    "explanation": "For each character..."
  },
  {
    "line": 20,
    "executable": true,
    "explanation": "...if the child is missing, the path doesn't exist."
  },
  {
    "line": 21,
    "executable": true,
    "explanation": "Return None (not found)."
  },
  {
    "line": 22,
    "executable": true,
    "explanation": "Otherwise descend to the child."
  },
  {
    "line": 23,
    "executable": true,
    "explanation": "Return the node reached."
  },
  {
    "line": 24,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 25,
    "executable": true,
    "explanation": "Create a trie."
  },
  {
    "line": 26,
    "executable": true,
    "explanation": "Insert cat, car, care (they share the 'ca' prefix)."
  },
  {
    "line": 27,
    "executable": true,
    "explanation": "Insert each word."
  },
  {
    "line": 28,
    "executable": true,
    "explanation": "search('car') → True (an inserted word)."
  },
  {
    "line": 29,
    "executable": true,
    "explanation": "search('ca') → False (a prefix, not marked is_word)."
  },
  {
    "line": 30,
    "executable": true,
    "explanation": "search('care') → True."
  },
  {
    "line": 31,
    "executable": true,
    "explanation": "search('cab') → False (never inserted)."
  }
],

  bindings: [
  {
    "variable": "t",
    "model": "trie",
    "path": "root"
  }
],

  bindingsRationale: "The binding resolves t.root and follows each node’s children dictionary. Letter edges show shared prefixes; is_word terminal flags distinguish complete words.",
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

  review: "A trie shares character paths and marks complete words explicitly. Each iterative operation takes expected O(L) dictionary work and O(1) auxiliary pointers. Retained structure has at most N+1 nodes for N inserted characters. setdefault eagerly evaluates its default node; a hash set can scan for prefixes but has no prefix index.",

  expectedOutput: "True\nFalse\nTrue\nFalse\n",

  references: [
  {
    "url": "https://cp-algorithms.com/string/aho_corasick.html",
    "title": "CP Algorithms: trie construction",
    "section": "Construction of the trie",
    "topic": "trees-graphs-range",
    "purpose": "Verify the stated algorithm and identify implementation conventions.",
    "verifiedClaims": [
      "Paths share prefixes.",
      "Terminal flags distinguish complete words."
    ],
    "conventions": [
      "App uses dictionaries for arbitrary characters rather than a fixed 26-child array."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://www.cs.usfca.edu/~galles/visualization/Trie.html",
    "title": "USFCA: Trie Visualization",
    "topic": "trie",
    "section": "Inserted APP and APPLE; inspected shared A-P-P path and terminal coloring.",
    "purpose": "Inspect character-edge and terminal-node visual conventions.",
    "verifiedClaims": [
      "Shared prefix nodes remain common.",
      "APP stays terminal when APPLE is added."
    ],
    "conventions": [
      "Reference uses uppercase; app accepts arbitrary characters."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://docs.python.org/3.14/library/stdtypes.html#dict.setdefault",
    "title": "Python 3.14: dictionary operations",
    "topic": "python-dict",
    "section": "dict.setdefault and insertion-order guarantee",
    "purpose": "Check supported dictionary behavior against the language manual.",
    "verifiedClaims": [
      "setdefault returns an existing value or inserts its default.",
      "Dictionaries preserve insertion order, not sorted-key order."
    ],
    "conventions": [
      "Online manual currently displays 3.14.8; executable behavior was probed on bundled 3.14.2."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "a0d882b93c8e53c5",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
