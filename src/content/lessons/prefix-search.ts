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

  explanation: "A **prefix query** follows the characters of a prefix through a trie. If an edge is missing, starts_with returns False; if the full path exists, it returns True. The empty prefix follows zero edges and returns True, even in an empty trie; this is the path-existence convention. Counting words with the empty prefix instead returns the number of stored words.\n\nThe example also counts complete words below the prefix node using an explicit stack. With prefix length P and S nodes in that subtree, counting takes expected O(P+S) time and O(S) worst-case auxiliary stack space. starts_with alone needs expected O(P) time and O(1) working space. A terminal flag distinguishes a stored word from a shared intermediate prefix.\n\nEnumerating suggestions additionally constructs the strings it returns. If K is the total number of characters copied to output, a full enumeration costs O(P+S+K) with a shared path buffer. A result limit can stop early, so listing ten suggestions need not visit the entire subtree. A hash set can scan its words for prefixes, but it has no trie-style prefix index.",

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
  {
    "operation": "starts_with (existence)",
    "best": "O(1)",
    "average": "O(P)",
    "worst": "O(P)",
    "space": "O(1)",
    "note": "P = prefix length; independent of word count."
  },
  {
    "operation": "count words with prefix",
    "best": "O(P)",
    "worst": "O(P + S)",
    "space": "O(S)",
    "note": "S counts visited subtree nodes; enumeration adds K copied output characters."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "P",
      "meaning": "the length of the prefix"
    },
    {
      "symbol": "S",
      "meaning": "the total size of the prefix's subtree (nodes/chars in matching words)"
    }
  ],
  "costModel": "Walking one node per prefix character is expected O(1) each; enumerating visits each subtree node once.",
  "time": {
    "bound": "O(P+S)",
    "case": "expected",
    "explanation": "The panel analyzes count_with_prefix: reach the prefix in expected O(P), then visit S subtree nodes. starts_with alone costs expected O(P). Full string enumeration is different and additionally costs K copied output characters."
  },
  "space": {
    "bound": "O(S)",
    "case": "worst",
    "explanation": "The explicit stack can retain O(S) pending subtree nodes. Counting returns a scalar; the stored trie is input.",
    "inputOutputNote": "The stored trie is input. starts_with uses O(1) working pointers; count_prefix uses up to O(S) pending nodes and returns a scalar. An enumeration additionally retains its returned strings as output."
  },
  "derivation": [
    {
      "lines": [
        16,
        17,
        18,
        19,
        20
      ],
      "description": "starts_with walks P characters — O(P).",
      "cost": "O(P)",
      "dimension": "time"
    },
    {
      "lines": [
        28,
        29,
        30,
        31,
        32,
        33
      ],
      "description": "Counting traverses the prefix subtree (S nodes) after the O(P) walk.",
      "cost": "O(P + S)",
      "dimension": "time"
    },
    {
      "lines": [
        28
      ],
      "description": "Subtree traversal can keep O(S) pending nodes on its explicit stack.",
      "cost": "O(S)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Child lookups are expected O(1).",
    "S counts the nodes in the matched subtree.",
    "Expected constant-time dictionary lookup. Empty prefix is always a root path; count zero stored words as zero.",
    "S counts nodes visited below the prefix. Copying complete suggestion strings adds K output characters."
  ],
  "tradeoffs": "A trie provides a prefix index; a hash set must scan words. Counting costs O(P+S); full string enumeration adds K copied output characters.",
  "counters": [],
  "fixedDataNote": "This run: 'ca' and 'do' are prefixes (True), 'z' is not (False); 3 words start with 'ca'. The O(P)/O(P+S) bounds generalise to prefix and subtree sizes.",
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
  {
    "variable": "t",
    "model": "trie",
    "path": "root"
  }
],

  bindingsRationale: "The binding resolves t.root and follows each node’s children dictionary. Letter edges show shared prefixes; is_word terminal flags distinguish complete words.",
  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "Checking a prefix path costs expected O(P). What additional work does counting or listing all matching words require?",
    "answer": "Counting visits the S nodes below the prefix, for expected O(P+S). Listing copied word strings also pays for K returned characters, so include O(K).",
    "explanation": "Walking to the prefix and traversing its subtree are separate costs. The counting example returns one integer; string suggestions add the cost of materializing their text."
  }
],

  experiments: [
    "Call starts_with('') (empty prefix) and reason about why it matches everything.",
    "Add a words-list variant that returns the actual matching words, not just the count.",
    "Compare with a hash set and confirm the set cannot answer 'starts with'.",
  ],

  exercises: [
  {
    "id": "prefix-complete-1",
    "kind": "complete-code",
    "prompt": "Complete starts_with: walk the prefix, returning False if the path breaks.",
    "starterCode": "def starts_with(self, prefix):\n    node = self.root\n    for ch in prefix:\n        # TODO: descend or return False\n        pass\n    return True",
    "expected": "def starts_with(self, prefix):\n    node = self.root\n    for ch in prefix:\n        if ch not in node.children:\n            return False\n        node = node.children[ch]\n    return True",
    "hints": [
      "Goal: return whether any stored word starts with the given prefix.",
      "You don't scan all words; you walk the shared prefix path in the trie.",
      "Key insight: if any character along the path has no child, the prefix cannot exist.",
      "Approach: descend character by character, failing fast on a missing child.",
      "Pseudocode: node = root; for ch in prefix: if ch not in node.children return False; descend; return True.",
      "Write `if ch not in node.children: return False` then `node = node.children[ch]`."
    ],
    "tests": "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_word = False\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n    def _add(self, word):\n        node = self.root\n        for ch in word:\n            node = node.children.setdefault(ch, TrieNode())\n        node.is_word = True\nt = Trie()\nt._add('apple')\nt._add('app')\nassert starts_with(t, 'app') is True, 'app is a prefix'\nassert starts_with(t, 'appl') is True, 'appl is a prefix'\nassert starts_with(t, 'apple') is True, 'the full word is its own prefix'\nassert starts_with(t, '') is True, 'empty prefix always matches'\nassert starts_with(t, 'apx') is False, 'path breaks -> False'\nassert starts_with(t, 'b') is False, 'missing first char -> False'\nprint('OK')"
  },
  {
    "id": "prefix-choose-1",
    "kind": "choose-approach",
    "prompt": "You need to list all stored words matching a prefix for repeated autocomplete queries. Which structure provides a prefix index, and what is the cost including copied suggestion characters?",
    "expected": "A trie reaches the prefix in expected O(P) and walks S subtree nodes. Copying K output characters gives O(P+S+K) for full enumeration; a hash set must scan its stored words.",
    "hints": [
      "Find the node representing the prefix.",
      "Repeated scans of all stored words repeat prefix comparisons.",
      "A trie shares those comparisons on one path.",
      "Walk the matching subtree and collect terminal paths.",
      "Use a shared character buffer; copy it only for terminal output strings.",
      "Reaching the prefix costs expected O(P), traversal O(S), and copied output O(K), for O(P+S+K)."
    ],
    "recognition": {
      "scenario": "You need to list all stored words matching a prefix for repeated autocomplete queries. Which structure provides a prefix index, and what is the cost including copied suggestion characters?",
      "approaches": [
        {
          "id": "trie",
          "label": "A trie",
          "requiredReasonIds": [
            "trie-prefix-queries"
          ]
        },
        {
          "id": "hash-set",
          "label": "A hash set of words",
          "requiredReasonIds": [],
          "rejectionFeedback": "A hash set only answers exact membership; it cannot efficiently find all words sharing a prefix, which is exactly what autocomplete needs."
        }
      ],
      "reasons": [
        {
          "id": "trie-prefix-queries",
          "text": "A trie supplies a prefix index: reach the prefix, visit S subtree nodes and copy K output characters in expected O(P+S+K)."
        },
        {
          "id": "set-prefix-cheap",
          "text": "A hash set finds all words with a given prefix in O(P) just like a trie.",
          "contradictory": true
        },
        {
          "id": "trie-exact-faster",
          "text": "The reason to pick a trie is that exact membership is faster than a hash set.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "trie"
      ],
      "modelExplanation": "A trie supports prefix queries a hash set can't. Checking a prefix exists is O(P); listing suggestions is O(P + S) — reaching the prefix node then walking its subtree to collect the matching words."
    }
  }
],

  review: "starts_with follows a prefix path in expected O(P), with O(1) working space; the empty path exists at the root. Counting visits S subtree nodes in O(P+S) with O(S) worst-case pending stack space. Enumerating copied strings additionally costs K output characters. Hash sets can scan prefixes but do not index them.",

  expectedOutput: "True\nTrue\nFalse\n3\n",

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
    contentHash: "48d89750581c170e",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
