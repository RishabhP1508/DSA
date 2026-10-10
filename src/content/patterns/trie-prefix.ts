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

  naiveApproach: "A hash set supports exact membership directly but must scan words for a general prefix query. With N words and compared prefix length P, a scan can cost O(N*P); a trie supplies a prefix index.",

  whyItHelps: "Character paths share common prefixes. Insert or starts_with walks one dictionary edge per character, giving expected O(L) time under expected constant-cost dictionary lookup. Explicit word-end flags distinguish a complete word from a path. Stored nodes total at most N+1 for N inserted characters, including the root; Python node/dictionary overhead may exceed compact string storage. starts_with(\"\") returns True even before any insertion, because it checks the root path.",

  conditions: [
  "Keys are sequences over a known alphabet (characters); each node maps a symbol to a child.",
  "Mark word ends explicitly (is_end) so prefixes and full words are distinguishable.",
  "Best when prefix queries are frequent; for exact-only lookups a hash set is simpler.",
  "The empty-prefix path exists even when no words are stored. This differs from asking whether at least one stored word matches."
],

  alternatives: [
  "Hash set/map: simple exact membership; prefix queries are possible by scanning stored words but have no dedicated prefix index.",
  "Sorted list + binary search — prefix ranges via lower/upper bound, but O(L log N) and awkward for dynamic inserts.",
  "Suffix automaton / Aho–Corasick — for multi-pattern substring matching (beyond simple prefixes)."
],

  counterexamples: [
    "If you only ever check whole-word membership (no prefixes), a hash set is simpler and enough.",
    "Substring (not prefix) search across a text is a KMP / Aho–Corasick problem, not a plain trie.",
    "Omitting is_end conflates a stored word with a mere prefix, breaking exact-word queries.",
  ],

  walkthroughCode,
  walkthroughExpectedOutput: "True\nFalse\n",
  complexityNote:
    "Expected O(L) dictionary work per operation. O(1) working pointers, with at most T+1 retained nodes for T inserted characters, including the root.",

  complexityExplanation: {
  "scope": "operation",
  "variables": [
    {
      "symbol": "L",
      "meaning": "the length of the word or prefix being processed"
    },
    {
      "symbol": "T",
      "meaning": "the total number of characters across all inserted words"
    }
  ],
  "costModel": "Expected constant-cost dictionary child lookup, one per character. The panel describes one operation, excluding trie construction.",
  "time": {
    "bound": "O(L)",
    "case": "expected",
    "explanation": "insert (lines 12-15) and starts_with (lines 19-22) each loop over the L characters of the input, doing one O(1) child-map lookup/insert per character. So O(L) per operation — independent of the number of stored words."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Iterative operations use constant-size working pointers. Retained newly inserted nodes belong to the trie structure.",
    "inputOutputNote": "Stored trie nodes are at most T+1 for T inserted characters, including the root; one insertion retains at most L new nodes."
  },
  "derivation": [
    {
      "lines": [
        12,
        13,
        14,
        15
      ],
      "description": "insert walks/creates one node per character.",
      "cost": "O(L)",
      "dimension": "time"
    },
    {
      "lines": [
        19,
        20,
        21,
        22
      ],
      "description": "starts_with walks one node per prefix character.",
      "cost": "O(L)",
      "dimension": "time"
    },
    {
      "lines": [
        14
      ],
      "description": "Working node/character pointers are constant; retained trie structure is reported separately.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Expected constant-time dictionary child lookup, amortized constant-time insertion.",
    "Character and string-length cost model; the panel describes one operation and excludes retained trie structure."
  ],
  "tradeoffs": "A hash set directly answers exact membership and can scan for prefixes. A trie maintains a dedicated prefix index, sharing character paths; Python node and dictionary overhead can be substantial.",
  "counters": [
    {
      "label": "characters walked",
      "definition": "executions of the insert descent (line 15)",
      "countLines": [
        15
      ]
    }
  ],
  "fixedDataNote": "Inserting 'apple' and 'app' shares the 'app' prefix; starts_with('app') walks 3 nodes. The O(L) bound generalises.",
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
    }
  ]
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

  bindings: [
  {
    "variable": "t",
    "model": "trie",
    "path": "root"
  }
],
  bindingsRationale: "Resolve t.root, follow children dictionaries and highlight is_end flags; t itself is a Trie container, not a trie node.",

  linkedLessons: ["trie-insertion", "prefix-search", "word-search"],

  exercises: [
  {
    "id": "pat-trie-recognize-1",
    "kind": "choose-approach",
    "prompt": "Recognize: 'Build an autocomplete that, given a prefix, tells whether any stored word starts with it, over thousands of words.' Which pattern?",
    "expected": "Trie (prefix tree): insert each word once; a prefix query walks one node per character in O(L), independent of the dictionary size — far better than scanning all words per query.",
    "correctPatternId": "trie-prefix",
    "hints": [
      "Goal: build autocomplete that tells whether any stored word starts with a given prefix, over thousands of words.",
      "Scanning all words per prefix query is O(dictionary size) each time — wasteful for many queries.",
      "Key insight: words sharing a prefix can share tree nodes, so a query walks one node per character.",
      "Approach: use a trie (prefix tree), inserting each word once.",
      "Pseudocode: insert each word character by character; for a prefix query, walk node per character and succeed if the path exists.",
      "Use a trie: a prefix query costs O(prefix length), independent of dictionary size — far better than scanning all words."
    ],
    "recognition": {
      "scenario": "Build an autocomplete that, given a prefix, reports whether any stored word starts with it, over thousands of words.",
      "approaches": [
        {
          "id": "trie",
          "label": "Trie (prefix tree)",
          "requiredReasonIds": [
            "prefix-walk"
          ]
        },
        {
          "id": "scan-all",
          "label": "Scan every word per query",
          "requiredReasonIds": [],
          "rejectionFeedback": "Scanning all words each query is O(dictionary) per lookup; a trie answers a prefix in O(L) independent of dictionary size."
        }
      ],
      "reasons": [
        {
          "id": "prefix-walk",
          "text": "Insert each word once; a prefix query walks one node per character in O(L), independent of how many words are stored — ideal for repeated prefix lookups."
        },
        {
          "id": "exact-only",
          "text": "Only exact-word membership is needed, so a hash set is simpler.",
          "contradictory": true
        },
        {
          "id": "needs-sorting",
          "text": "The dictionary must be sorted and binary-searched per query.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "trie"
      ],
      "modelExplanation": "Trie (prefix tree): each prefix query walks O(L) nodes regardless of dictionary size — far better than scanning all words per query."
    }
  },
  {
    "id": "pat-trie-choose-1",
    "kind": "choose-approach",
    "prompt": "You only need to test whether an exact word is in a dictionary (never prefixes). Trie or hash set?",
    "expected": "Hash set — exact membership is O(L) average and far simpler. A trie's advantage is prefix queries; without them, the set wins on simplicity.",
    "hints": [
      "Goal: test whether an exact word is in a dictionary, never querying prefixes.",
      "A trie's node-per-character machinery pays off only for prefix queries, which you don't have.",
      "Key insight: exact membership needs no shared-prefix structure — a hash lookup suffices.",
      "Approach: use a hash set of the words.",
      "Pseudocode: build a set of all words; answer a query with `word in the_set`.",
      "Use a hash set — exact membership is O(L) average and far simpler; a trie's edge is prefix queries you don't need."
    ],
    "recognition": {
      "scenario": "You only need to test whether an exact word is in a dictionary (never prefixes).",
      "approaches": [
        {
          "id": "hash-set",
          "label": "Hash set",
          "requiredReasonIds": [
            "exact-membership"
          ]
        },
        {
          "id": "trie",
          "label": "Trie",
          "requiredReasonIds": [],
          "rejectionFeedback": "A trie's advantage is prefix queries; with only exact lookups it adds structure and memory overhead a hash set avoids."
        }
      ],
      "reasons": [
        {
          "id": "exact-membership",
          "text": "Exact membership is O(L) average in a hash set and far simpler — no prefix queries are needed, so the trie's extra structure is wasted."
        },
        {
          "id": "need-prefixes",
          "text": "The task requires enumerating all words sharing a prefix.",
          "contradictory": true
        },
        {
          "id": "need-order",
          "text": "Words must be returned in sorted order, which only a trie provides.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "hash-set"
      ],
      "modelExplanation": "Hash set: exact membership is O(L) average and simplest. A trie only earns its overhead when prefix queries are required."
    }
  },
  {
    "id": "pat-trie-fix-1",
    "kind": "fix-mistake",
    "prompt": "`search(words, query)` inserts every word in `words` into a trie, then returns whether `query` is a STORED word (not merely a prefix of one). This treats a mere prefix as a stored word. Fix it to check the end-of-word marker. Use the supplied unique object as the terminal dictionary key so a literal $ in a word cannot collide.",
    "starterCode": "def search(words, query):\n    root = {}\n    end = object()\n    for word in words:\n        node = root\n        for ch in word:\n            node = node.setdefault(ch, {})\n        node[end] = True\n    node = root\n    for ch in query:\n        if ch not in node:\n            return False\n        node = node[ch]\n    return True",
    "expected": "def search(words, query):\n    root = {}\n    end = object()\n    for word in words:\n        node = root\n        for ch in word:\n            node = node.setdefault(ch, {})\n        node[end] = True\n    node = root\n    for ch in query:\n        if ch not in node:\n            return False\n        node = node[ch]\n    return end in node",
    "hints": [
      "A query path may exist without a complete stored word ending there.",
      "The dictionary needs a terminal marker separate from all character edges.",
      "The unique end object cannot collide with a real character such as $.",
      "After consuming every query character, require the end key in the final node.",
      "Build character edges; mark node[end] for each inserted word; search the query path; return end in node.",
      "Path existence proves only a prefix. The unique terminal key proves a complete word, including the empty word."
    ],
    "tests": "assert search(['app'], 'app') is True, 'stored word found'\nassert search(['app'], 'ap') is False, 'a prefix that is not a stored word'\nassert search(['app'], 'apple') is False, 'path breaks'\nassert search(['app', 'application'], 'application') is True, 'longer stored word found (defeats len-based guess)'\nassert search(['app', 'application'], 'appl') is False, 'intermediate prefix is not a word'\nassert search([], 'x') is False\nprint('OK')\nassert search(['$a'],'$') is False\nassert search(['$a'],'$a') is True\nassert search(['','$'],'') is True\nassert search(['','$'],'$') is True\nassert search([], '') is False"
  }
],

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
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "557f3fb82e64a0c5",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 5,
  },
};
