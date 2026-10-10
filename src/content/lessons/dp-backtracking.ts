/**
 * Lesson: Recursion — backtracking (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "['(())', '()()']\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Generate all valid combinations of n pairs of parentheses.
def gen_parens(n):
    res = []
    def bt(cur, open_c, close_c):
        if len(cur) == 2 * n:      # a complete, valid string -> record it
            res.append(cur)
            return
        if open_c < n:             # CHOICE 1: we may still open a "("
            bt(cur + "(", open_c + 1, close_c)
        if close_c < open_c:       # CHOICE 2: close only if it stays valid
            bt(cur + ")", open_c, close_c + 1)
    bt("", 0, 0)
    return res

print(gen_parens(2))`;

export const dpBacktracking: LessonDefinition = {
  id: "dp-backtracking",
  title: "Recursion: Backtracking",
  area: "DP and recursion",
  prerequisites: [
  "dp-recursive-calls",
  "references-mutation"
],

  explanation: "**Backtracking** is a disciplined way to explore all candidate solutions by building one **step by step**, and **abandoning** a partial candidate the moment it cannot lead to a valid solution (\"prune\"). It is a depth-first search over a **tree of choices**: at each node you **choose** an option, **recurse** to extend the choice, then **undo** the choice and try the next one. The undo — returning the state to how it was before the choice — is the \"backtrack\".\n\nThe parentheses generator shows the shape. A partial string `cur` is extended by two possible choices: add `\"(\"` (allowed while we have opened fewer than n), or add `\")\"` (allowed only while there are more opens than closes, which keeps the string **valid**). Those two `if` guards are the **pruning**: we never even explore a branch that would make the string invalid, so we don't generate garbage and then filter it. When `len(cur) == 2 * n` we have a complete valid string and record it. For n=2 the valid strings are `['(())', '()()']`.\n\nBacktracking's structure is always the same three beats — **choose, explore, un-choose** — and it underlies subsets, permutations, combinations, N-Queens, Sudoku, and word search. Its cost is tied to the size of the search tree it actually visits (pruning shrinks that tree), and its auxiliary space must include every candidate representation retained by active frames. A shared path can use O(n) working storage; immutable copied prefixes can use more. When candidates are built by appending to a shared list, remember to **pop** after recursing so siblings start from a clean state; here we build new strings instead, so no explicit pop is needed.\n\nThis version passes immutable strings: each recursive call has its own longer prefix, and returning reveals the caller's unchanged prefix. `res.append(cur)` stores that string reference. The stack retains all ancestor prefixes, so auxiliary character storage is O(n²), although stack depth is O(n). A shared list of characters with append/pop and `\"\".join(path)` at completion can use O(n) working characters; it must undo mutations.",

  vocabulary: [
    { term: "Backtracking", definition: "DFS over choices that builds a candidate incrementally and undoes choices that fail." },
    { term: "Choice / branch", definition: "One option taken at a step, leading to a child in the search tree." },
    { term: "Prune", definition: "Skip a branch that cannot lead to a valid solution, saving work." },
    { term: "Partial candidate", definition: "The in-progress solution being extended (here, cur)." },
    { term: "Undo / backtrack", definition: "Reverting the state after exploring a choice so the next choice starts clean." },
  ],

  concepts: {
  "purpose": "Systematically enumerate or search all valid configurations while pruning invalid ones early.",
  "operations": "At each step: check for a complete candidate; otherwise, for each valid choice, apply it, recurse, then undo it.",
  "uses": "Subsets, permutations, combinations, N-Queens, Sudoku, word search, constraint satisfaction, path enumeration.",
  "tradeoffs": "Pruning prevents invalid prefixes, but enumerating all valid strings still requires large output. Immutable prefixes simplify undo and retain quadratic characters across a deep chain; a shared character list can reduce working storage.",
  "commonMistakes": "Forgetting to undo a mutation before trying the next choice (state leaks between branches); weak/absent pruning (explores invalid branches); recording references to a mutable path instead of a copy.",
  "edgeCases": "n = 0 yields the single empty string. Pruning conditions must be exactly right, or valid solutions are missed or invalid ones produced."
},

  complexity: [
  {
    "operation": "generate parentheses",
    "best": "O(C*n^2)",
    "average": "O(C*n^2)",
    "worst": "O(C*n^2)",
    "space": "O(n^2)",
    "note": "Conservative time upper bound for immutable concatenation, not a tight claim. C=Catalan(n); result storage O((n+1)C), excluded from auxiliary space."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of pairs of parentheses"
    },
    {
      "symbol": "C",
      "meaning": "the number of valid strings produced (the nth Catalan number)"
    }
  ],
  "costModel": "Tests and result-list append are constant/amortized work. cur + a character creates a new immutable prefix with copying work proportional to prefix length. Live ancestor frames retain their earlier strings. C is the nth Catalan number.",
  "time": {
    "bound": "O(C*n^2)",
    "case": "worst",
    "explanation": "Every visited prefix can be extended to a valid length-2n string. Charging its at most 2n+1 prefix nodes to a completion gives O((n+1)C) nodes. Each immutable concatenation copies at most 2n characters, so O((n+1)^2 C) is a conservative time upper bound for this Python implementation (O(C*n^2) for n≥1). It is not asserted tight. Required output alone has Θ(nC) characters."
  },
  "space": {
    "bound": "O(n^2)",
    "case": "worst",
    "explanation": "A deepest chain keeps prefixes of lengths 0,1,…,2n in separate active frames. Their total character storage is O(n²), in addition to O(n) frame overhead. Shared immutable strings need no pop, but that does not make their retained storage linear.",
    "inputOutputNote": "The result holds C strings of 2n characters plus C list references: O((n+1)C) output storage. Auxiliary immutable prefixes total O(n²) for n≥1; n=0 uses constant storage."
  },
  "derivation": [
    {
      "lines": [
        5,
        6,
        7
      ],
      "description": "Record an existing immutable string reference; append is amortized O(1), not a string copy.",
      "cost": "O(1) per solution",
      "dimension": "time"
    },
    {
      "lines": [
        8,
        9,
        10,
        11
      ],
      "description": "At most O((n+1)C) prefix nodes, each with at most O(n+1) concatenation work; conservative bound.",
      "cost": "O((n+1)^2*C)",
      "dimension": "time"
    },
    {
      "lines": [
        4,
        9,
        11
      ],
      "description": "Active frames retain prefixes of increasing length, totaling O(n²) characters.",
      "cost": "O(n^2)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "The pruning guards (open_c < n and close_c < open_c) are exactly the validity conditions.",
    "Strings are built by concatenation, so no explicit undo/pop is needed.",
    "n is small so the trace stays under the event limit.",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "n is a non-negative integer; negative n is outside this generator's contract.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "Generate-all-then-filter would explore ~2^(2n) strings; backtracking with these guards explores only valid prefixes, an enormous saving. The cost is writing correct pruning conditions.",
  "counters": [
    {
      "label": "solutions recorded",
      "definition": "executions of the append line Recorded line entries at 6 occur before the operation completes.",
      "countLines": [
        6
      ]
    },
    {
      "label": "open choices",
      "definition": "executions of the '(' branch Recorded line entries at 9 occur before the operation completes.",
      "countLines": [
        9
      ]
    }
  ],
  "fixedDataNote": "gen_parens(2) records 2 solutions ['(())', '()()']. The O(C·n) bound describes growth as n increases (C is the nth Catalan number). Function analysis excludes demonstration input literals, imports, printing and tracer storage. A line event shows the next operation before it completes."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment describing the goal."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define gen_parens(n)."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Collect completed valid strings here."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Inner backtracking function tracking the string and open/close counts."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "If the string has the full length 2n, it's a complete valid solution."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Append a reference to the completed immutable string. No string copy is performed here; later calls create different strings."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Return to stop extending this branch."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Pruned choice 1: we may add '(' only if fewer than n are open."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Recurse with one more open parenthesis."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Pruned choice 2: add ')' only if it keeps the string valid (more opens than closes)."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Recurse with one more close parenthesis."
  },
  {
    "line": 12,
    "executable": true,
    "explanation": "Start the search from the empty string with zero opens and closes."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Return all valid strings."
  },
  {
    "line": 14,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 15,
    "executable": true,
    "explanation": "Print the n=2 result ['(())', '()()']."
  }
],

  bindings: [{ variable: "cur", model: "recursion" }],

  prediction: [
  {
    "atEventIndex": 0,
    "prompt": "Why are the two `if` guards (open_c < n and close_c < open_c) so important to efficiency?",
    "answer": "They prune the search: branches that would create invalid strings are never explored, so we build only valid prefixes instead of generating all 2^(2n) strings and filtering.",
    "explanation": "The guards keep every visited prefix extendable. Backtracking can also enumerate without pruning, as the subset examples do."
  }
],

  experiments: [
    "Print cur at each call to watch the tree of choices being explored depth-first.",
    "Remove the close guard (close_c < open_c) and see invalid strings appear.",
    "Adapt the template to enumerate all binary strings of length n (two unconditional choices).",
  ],

  exercises: [
    {
      id: "dpbt-complete-1",
      kind: "complete-code",
      prompt: "Complete the pruned choices so only valid parenthesis strings are built.",
      starterCode:
        "def bt(cur, open_c, close_c):\n    if len(cur) == 2 * n:\n        res.append(cur)\n        return\n    # TODO: two guarded recursive choices\n",
      expected:
        "def bt(cur, open_c, close_c):\n    if len(cur) == 2 * n:\n        res.append(cur)\n        return\n    if open_c < n:\n        bt(cur + \"(\", open_c + 1, close_c)\n    if close_c < open_c:\n        bt(cur + \")\", open_c, close_c + 1)",
      hints: [
        "Open a '(' only while opens < n.",
        "Close a ')' only while closes < opens.",
        "Two guarded recursive calls.",
      ],
    },
    {
      id: "dpbt-fix-1",
      kind: "fix-mistake",
      prompt: "This subset builder leaks state between branches (missing undo). Fix it.",
      starterCode:
        "def bt(start, path):\n    res.append(path[:])\n    for i in range(start, len(nums)):\n        path.append(nums[i])\n        bt(i + 1, path)\n        # bug: path is never restored",
      expected:
        "def bt(start, path):\n    res.append(path[:])\n    for i in range(start, len(nums)):\n        path.append(nums[i])\n        bt(i + 1, path)\n        path.pop()",
      hints: [
        "After exploring a choice, the state must be reset.",
        "You appended to path; undo it.",
        "path.pop() after the recursive call.",
      ],
    },
    {
      id: "dpbt-predict-1",
      kind: "predict-state",
      prompt: "For gen_parens(2), which valid strings are produced and in what order?",
      expected: "['(())', '()()'] — the '(' branch is tried before the ')' branch at each step, so the more-nested string comes first.",
      hints: [
        "Two pairs of parentheses.",
        "The open branch is explored first.",
        "Depth-first order gives '(())' then '()()'.",
      ],
    },
  ],

  review: "Backtracking explores a tree of choices and can prune impossible prefixes. The parentheses guards admit at most n opens and never more closes than opens; n=2 yields (()) then ()(). This Python version retains immutable prefixes across frames, using O(n²) auxiliary characters, and appends completed string references. A shared character list with append/pop can instead use O(n) working characters. Output storage is separate.",

  expectedOutput: "['(())', '()()']\n",

  references: [
  {
    "url": "https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex",
    "title": "Python 3.14 numeric types",
    "section": "Numeric Types — int, float, complex",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage."
    ],
    "conventions": [
      "Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1258/lectures/11-backtracking1/",
    "title": "Stanford CS106B: recursive backtracking",
    "section": "Choose/explore/unchoose, subsets and string-by-value notes",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Mutable shared paths must be restored for siblings; by-value strings need no explicit undo; output copies contribute to subset enumeration cost."
    ],
    "conventions": [
      "Python shared-list append/pop is paired; immutable prefix strings remain in separate live frames."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://math.mit.edu/~djk/18.310/18.310F04/parentheses.pdf",
    "title": "MIT: balanced parentheses and Catalan counting",
    "section": "Balanced-prefix condition; Catalan formula",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "A valid prefix never has more closing than opening parentheses; C_n=binom(2n,n)/(n+1)."
    ],
    "conventions": [
      "The app opens first, allows at most n opens, and closes only when close_c<open_c. n=0 gives one empty string."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://runestone.academy/ns/books/published/pythonds3/Recursion/StackFramesImplementingRecursion.html",
    "title": "Runestone: stack frames",
    "section": "Stack Frames: Implementing Recursion, Figure 4.6",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Each active recursive call retains its own parameters and local values until return."
    ],
    "conventions": [
      "The app shows actual traced frames; the source figure is a to_str example, not factorial. A source figure label differs from its n=5 card and is not copied."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "73e310b733d34fff",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
