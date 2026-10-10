/**
 * Lesson: Grouping (Hashing). Verified on CPython 3.14.
 * Output: "[['eat', 'tea', 'ate'], ['tan', 'nat']]\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Group items that share a computed key (group anagrams).
def group_anagrams(words):
    groups = {}
    for w in words:
        key = "".join(sorted(w))          # canonical key: sorted letters
        groups.setdefault(key, []).append(w)  # append to that key's list
    return list(groups.values())

print(group_anagrams(["eat", "tea", "tan", "ate", "nat"]))`;

export const grouping: LessonDefinition = {
  id: "grouping",
  title: "Grouping by Key",
  area: "Hashing",
  prerequisites: ["maps-sets", "anagrams"],

  explanation: "**Grouping** collects items that share some property by mapping a **computed key → list of items**. The recipe is universal: compute a **canonical key** that is identical for items that belong together, then append each item to that key's bucket in a dict.\n\nThe classic example is **grouping anagrams**. Two words are anagrams exactly when their **sorted letters** match, so `\"\".join(sorted(w))` is a canonical key: `\"eat\"`, `\"tea\"`, and `\"ate\"` all map to `\"aet\"`. We use `dict.setdefault(key, [])` (or a `defaultdict(list)`) to create the bucket on first use, then append. One pass groups everything.\n\nFor n words, let L be at least 1 and at least the longest word length. Sorting each word gives an expected O(n*L log(L+1)) time upper bound. Building and hashing each new key also reads O(L) characters; dictionary access is not free for an arbitrarily long new string. Empty words are valid here and all share the empty key. The buckets hold references to the original words, while the stored keys can total O(n*L) characters.\n\nThe key must describe a real grouping rule: a remainder groups numbers by remainder, and rounding groups by the same rounded result. Rounding does not guarantee that every pair of nearby numbers lands together.",

  vocabulary: [
    { term: "Grouping", definition: "Partitioning items into buckets that share a key." },
    { term: "Canonical key", definition: "A normalized value identical for items in the same group (e.g. sorted letters)." },
    { term: "setdefault / defaultdict", definition: "Create a bucket on first use so you can append without a KeyError." },
    { term: "Bucket", definition: "The list of items sharing one key." },
  ],

  concepts: {
  "purpose": "Partition items into groups by a shared computed key in one pass.",
  "operations": "Compute a canonical key per item; append the item to key's list in a dict.",
  "uses": "Group anagrams, bucketing by property, deduping variants, category counts.",
  "tradeoffs": "One pass plus the cost of building, hashing, and comparing keys. Buckets hold references, not copies of word characters. A wrong canonical key can split or merge the wrong groups.",
  "commonMistakes": "Indexing a missing key instead of setdefault/defaultdict (KeyError); an unstable/non-canonical key (groups split or merge wrongly); using an unhashable key.",
  "edgeCases": "Empty input yields no groups. Single-item groups are fine. Items that are all distinct produce n singleton groups."
},

  complexity: [
  {
    "operation": "Group anagrams with sorted keys",
    "best": "O(n*L log(L+1))",
    "average": "O(n*L log(L+1))",
    "worst": "O(n*L log(L+1) + n²*L)",
    "space": "O(n*L)",
    "note": "Upper bounds; expected hashing in average column. L=max(1,longest word length). Severe hash collisions can add quadratic key comparisons."
  }
],

  complexityExplanation: {
  "scope": "operation",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of items (words)"
    },
    {
      "symbol": "L",
      "meaning": "max(1, the longest word length), so empty words still have constant bookkeeping cost"
    }
  ],
  "costModel": "Sorting a word has O(L log(L+1)) worst-case work; constructing and hashing its fresh string key costs O(L). Expected dictionary probes plus key comparisons give O(L) per lookup.",
  "time": {
    "bound": "O(n*L log(L+1))",
    "case": "expected",
    "explanation": "For each word, sort and join its letters, hash the fresh key, and append its reference to a bucket. Expected hash-table behavior gives this upper bound; collisions can instead add O(n²*L) comparisons. A 26-count key for lowercase a-z gives expected O(n*L) under bounded-size counts."
  },
  "space": {
    "bound": "O(n*L)",
    "case": "worst",
    "explanation": "Stored canonical strings can total O(n*L) characters. Bucket lists contain n references to the existing words, not copies of their characters; sorting one current word also needs O(L) temporary slots.",
    "inputOutputNote": "Word strings are input. Grouped output contains O(n) references; O(n*L) key storage is auxiliary, and excludes the input character storage."
  },
  "derivation": [
    {
      "lines": [
        4
      ],
      "description": "Visit n words.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        5
      ],
      "description": "Sort, join, and hash each key of up to L characters.",
      "cost": "O(n*L log(L+1))",
      "dimension": "time"
    },
    {
      "lines": [
        6
      ],
      "description": "Expected bucket lookup with O(L) key hashing/comparison upper bound, then amortized append.",
      "cost": "O(n*L)",
      "dimension": "time"
    },
    {
      "lines": [
        3,
        6
      ],
      "description": "Store keys and lists of original-word references.",
      "cost": "O(n*L)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "L is at least 1; words may be empty.",
    "Expected hash-table behavior, with bounded-size character/count operations.",
    "For the 26-count alternative, every character belongs to lowercase a-z."
  ],
  "tradeoffs": "Using a 26-length letter-count tuple as the key computes in O(L) instead of O(L log L), lowering time to O(n·L) — a common optimization when the alphabet is fixed.",
  "counters": [
    {
      "label": "words grouped",
      "definition": "iterations of the grouping loop (line 4)",
      "countLines": [
        4
      ]
    }
  ],
  "fixedDataNote": "The displayed five short words form two groups. Complexity concerns the grouping operation on generalized n-word input; the display print is outside that scope."
},

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: group items by a computed key." },
    { line: 2, executable: true, explanation: "Define group_anagrams(words)." },
    { line: 3, executable: true, explanation: "The dict of key → list of words." },
    { line: 4, executable: true, explanation: "Process each word." },
    { line: 5, executable: true, explanation: "Canonical key: sort the letters so anagrams share it (e.g. 'eat'→'aet')." },
    { line: 6, executable: true, explanation: "setdefault creates the bucket if new, then append this word." },
    { line: 7, executable: true, explanation: "Return the grouped lists (insertion order of first-seen keys)." },
    { line: 8, executable: false, explanation: "Blank line." },
    { line: 9, executable: true, explanation: "Groups → [['eat','tea','ate'], ['tan','nat']]." },
  ],

  bindings: [
    { variable: "words", model: "array" },
    { variable: "groups", model: "dict" },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "Why is `\"\".join(sorted(w))` a good grouping key for anagrams?", answer: "Because anagrams contain the same letters, so sorting them produces an identical string — a canonical key shared by exactly the words that are anagrams of each other.", explanation: "Sorting normalizes letter order, collapsing all permutations of the same multiset of letters to one key. Words are anagrams iff their sorted forms are equal, so this key groups them correctly." },
  ],

  experiments: [
  "For words using only lowercase a-z, use a 26-length letter-count tuple as the key; count in O(L) rather than sorting.",
  "Group numbers by x % 3 to bucket by remainder.",
  "Replace setdefault with a collections.defaultdict(list)."
],

  exercises: [
  {
    "id": "grp-complete-1",
    "kind": "complete-code",
    "prompt": "Group nonempty words by their first letter into a dict of lists. The list of words itself may be empty.",
    "starterCode": "def by_first_letter(words):\n    groups = {}\n    for w in words:\n        # TODO: append w to the bucket for its first letter\n        pass\n    return groups",
    "expected": "def by_first_letter(words):\n    groups = {}\n    for w in words:\n        groups.setdefault(w[0], []).append(w)\n    return groups",
    "hints": [
      "Goal: group words by their first letter into a dict of lists.",
      "Manually checking whether a bucket exists each time is repetitive.",
      "Key insight: the group key is the first character w[0], and buckets must be created on first use.",
      "Approach: use dict.setdefault to create-then-append in one step.",
      "Pseudocode: for w in words: groups.setdefault(w[0], []).append(w); return groups.",
      "Write `groups.setdefault(w[0], []).append(w)`."
    ],
    "tests": "g = by_first_letter(['apple', 'ant', 'bee', 'cat'])\nassert g == {'a': ['apple', 'ant'], 'b': ['bee'], 'c': ['cat']}, f'grouped wrong, got {g}'\nassert by_first_letter([]) == {}, 'empty input -> empty dict'\nassert by_first_letter(['zoo']) == {'z': ['zoo']}, 'single word'\ng2 = by_first_letter(['ax', 'ay', 'az'])\nassert g2 == {'a': ['ax', 'ay', 'az']}, f'preserves insertion order, got {g2}'\nprint('OK')"
  },
  {
    "id": "grp-choose-1",
    "kind": "choose-approach",
    "prompt": "For grouping anagrams over a fixed lowercase alphabet, what key lowers the time below O(n·L log L), and to what?",
    "expected": "A 26-length count tuple (how many of each letter) as the key: it's computed in O(L) without sorting, giving O(n·L) total.",
    "hints": [
      "Goal: group anagrams over a fixed lowercase alphabet with a key cheaper than the sorted-string key's O(n·L log L).",
      "The costly key is the sorted string: sorting each word of length L adds a log L factor per word.",
      "Key property: with a fixed 26-letter alphabet, two words are anagrams exactly when their per-letter counts match — and counts need no sorting.",
      "Approach: use a 26-length count tuple of letter frequencies as the group key.",
      "Reasoning: counting a word is O(L) with no sort, so grouping is O(n·L); the sorted-string key pays O(n·L log L) for the same grouping.",
      "Answer: a 26-length count tuple as the key — computed in O(L) without sorting, giving O(n·L), below O(n·L log L)."
    ],
    "recognition": {
      "scenario": "You must group anagrams over a fixed lowercase alphabet. Using the sorted string as a group key costs O(n·L log L). You want a cheaper key.",
      "approaches": [
        {
          "id": "count-tuple-key",
          "label": "Use a 26-length letter-count tuple as the key",
          "requiredReasonIds": [
            "count-key-no-sort"
          ]
        },
        {
          "id": "sorted-string-key",
          "label": "Use the sorted characters as the key",
          "requiredReasonIds": [],
          "rejectionFeedback": "Sorting each word is O(L log L) per word, giving O(n·L log L); counting over the fixed alphabet is only O(L) per word."
        }
      ],
      "reasons": [
        {
          "id": "count-key-no-sort",
          "text": "A 26-slot count of each letter is a canonical anagram signature computed in O(L) without sorting, so grouping all words is O(n·L)."
        },
        {
          "id": "sorting-is-linear",
          "text": "Sorting a word's characters is O(L), the same as counting them.",
          "contradictory": true
        },
        {
          "id": "counts-not-canonical",
          "text": "Two anagrams can have different letter counts, so a count tuple is not a reliable key.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "count-tuple-key"
      ],
      "modelExplanation": "A 26-length count tuple (how many of each letter) as the key is computed in O(L) without sorting, giving O(n·L) total — below O(n·L log L)."
    }
  }
],

  review: "Grouping maps a canonical key to a bucket of item references. Sorted-letter keys group anagrams correctly, including empty words. With L=max(1,longest word length), the expected time upper bound is O(n*L log(L+1)); a fixed lowercase alphabet permits an expected O(n*L) count-key alternative. Account for key construction and hashing as well as dictionary probes.",

  expectedOutput: "[['eat', 'tea', 'ate'], ['tan', 'nat']]\n",

  references: [
  {
    "url": "https://docs.python.org/3.14/library/stdtypes.html#dict.setdefault",
    "title": "Python dictionary setdefault",
    "section": "Mapping types: setdefault",
    "topic": "hashing/grouping",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "setdefault returns the existing value, or inserts and returns the supplied default."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://leetcode.com/problems/group-anagrams/",
    "title": "Group Anagrams: original problem",
    "section": "Problem, examples, and constraints",
    "topic": "hashing/grouping",
    "purpose": "Check the specific claims and conventions used here.",
    "verifiedClaims": [
      "Anagrams share the same multiset of letters; the original problem permits empty strings and restricts characters to lowercase English letters."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "2ecb0bfaec932a6b",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 2,
  },
};
