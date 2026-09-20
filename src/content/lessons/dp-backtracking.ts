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
  prerequisites: ["dp-recursive-calls"],

  explanation: `**Backtracking** is a disciplined way to explore all candidate solutions by building one **step by step**, and **abandoning** a partial candidate the moment it cannot lead to a valid solution ("prune"). It is a depth-first search over a **tree of choices**: at each node you **choose** an option, **recurse** to extend the choice, then **undo** the choice and try the next one. The undo — returning the state to how it was before the choice — is the "backtrack".

The parentheses generator shows the shape. A partial string \`cur\` is extended by two possible choices: add \`"("\` (allowed while we have opened fewer than n), or add \`")"\` (allowed only while there are more opens than closes, which keeps the string **valid**). Those two \`if\` guards are the **pruning**: we never even explore a branch that would make the string invalid, so we don't generate garbage and then filter it. When \`len(cur) == 2 * n\` we have a complete valid string and record it. For n=2 the valid strings are \`['(())', '()()']\`.

Backtracking's structure is always the same three beats — **choose, explore, un-choose** — and it underlies subsets, permutations, combinations, N-Queens, Sudoku, and word search. Its cost is tied to the size of the search tree it actually visits (pruning shrinks that tree), and its extra space is the **recursion depth** plus the current partial candidate — usually **O(n)**, not the total number of solutions. When candidates are built by appending to a shared list, remember to **pop** after recursing so siblings start from a clean state; here we build new strings instead, so no explicit pop is needed.`,

  vocabulary: [
    { term: "Backtracking", definition: "DFS over choices that builds a candidate incrementally and undoes choices that fail." },
    { term: "Choice / branch", definition: "One option taken at a step, leading to a child in the search tree." },
    { term: "Prune", definition: "Skip a branch that cannot lead to a valid solution, saving work." },
    { term: "Partial candidate", definition: "The in-progress solution being extended (here, cur)." },
    { term: "Undo / backtrack", definition: "Reverting the state after exploring a choice so the next choice starts clean." },
  ],

  concepts: {
    purpose:
      "Systematically enumerate or search all valid configurations while pruning invalid ones early.",
    operations:
      "At each step: check for a complete candidate; otherwise, for each valid choice, apply it, recurse, then undo it.",
    uses:
      "Subsets, permutations, combinations, N-Queens, Sudoku, word search, constraint satisfaction, path enumeration.",
    tradeoffs:
      "Explores only feasible branches (much better than generate-then-filter), but worst-case cost is still tied to the number of candidates; pruning quality is decisive.",
    commonMistakes:
      "Forgetting to undo a mutation before trying the next choice (state leaks between branches); weak/absent pruning (explores invalid branches); recording references to a mutable path instead of a copy.",
    edgeCases:
      "n = 0 yields the single empty string. Pruning conditions must be exactly right, or valid solutions are missed or invalid ones produced.",
  },

  complexity: [
    { operation: "generate parentheses", best: "O(Cₙ·n)", average: "O(Cₙ·n)", worst: "O(Cₙ·n)", space: "O(n)", note: "Cₙ = nth Catalan number of valid strings, each length 2n; recursion depth O(n)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of pairs of parentheses" },
      { symbol: "C", meaning: "the number of valid strings produced (the nth Catalan number)" },
    ],
    costModel:
      "Each node of the search tree does O(1) work plus building a slightly longer string. Time is proportional to the tree the pruning leaves; output work counts the produced strings.",
    time: {
      bound: "O(C·n)",
      case: "worst",
      explanation:
        "Pruning means we only walk branches that can still become valid, so the explored tree has O(C) leaves (one per valid string) and O(C) internal structure. Producing each of the C strings costs O(n) to build/copy its 2n characters, giving O(C·n). C is the nth Catalan number, which grows quickly but far slower than the 4ⁿ of generating all strings and filtering.",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation:
        "The recursion depth is at most 2n (the length of a complete string), and the current partial string is O(n). This auxiliary space excludes the output list of results.",
      inputOutputNote:
        "Storing all C results is O(C·n) output space; that is the required output, separate from the O(n) recursion/working space.",
    },
    derivation: [
      { lines: [5, 6, 7], description: "Completion check and recording a finished string.", cost: "O(n) per solution to copy", dimension: "time" },
      { lines: [8, 9, 10, 11], description: "Two guarded choices define the pruned branching of the search tree.", cost: "O(C) branches", dimension: "time" },
      { lines: [4], description: "Recursion depth up to 2n plus an O(n) partial string.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: [
      "The pruning guards (open_c < n and close_c < open_c) are exactly the validity conditions.",
      "Strings are built by concatenation, so no explicit undo/pop is needed.",
      "n is small so the trace stays under the event limit.",
    ],
    tradeoffs:
      "Generate-all-then-filter would explore ~2^(2n) strings; backtracking with these guards explores only valid prefixes, an enormous saving. The cost is writing correct pruning conditions.",
    counters: [
      { label: "solutions recorded", definition: "executions of the append line (line 6)", countLines: [6] },
      { label: "open choices", definition: "executions of the '(' branch (line 9)", countLines: [9] },
    ],
    fixedDataNote:
      "gen_parens(2) records 2 solutions ['(())', '()()']. The O(C·n) bound describes growth as n increases (C is the nth Catalan number).",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment describing the goal." },
    { line: 2, executable: true, explanation: "Define gen_parens(n)." },
    { line: 3, executable: true, explanation: "Collect completed valid strings here." },
    { line: 4, executable: true, explanation: "Inner backtracking function tracking the string and open/close counts." },
    { line: 5, executable: true, explanation: "If the string has the full length 2n, it's a complete valid solution." },
    { line: 6, executable: true, explanation: "Record a copy (a new string) of the solution." },
    { line: 7, executable: true, explanation: "Return to stop extending this branch." },
    { line: 8, executable: true, explanation: "Pruned choice 1: we may add '(' only if fewer than n are open." },
    { line: 9, executable: true, explanation: "Recurse with one more open parenthesis." },
    { line: 10, executable: true, explanation: "Pruned choice 2: add ')' only if it keeps the string valid (more opens than closes)." },
    { line: 11, executable: true, explanation: "Recurse with one more close parenthesis." },
    { line: 12, executable: true, explanation: "Start the search from the empty string with zero opens and closes." },
    { line: 13, executable: true, explanation: "Return all valid strings." },
    { line: 14, executable: false, explanation: "Blank line." },
    { line: 15, executable: true, explanation: "Print the n=2 result ['(())', '()()']." },
  ],

  bindings: [{ variable: "cur", model: "recursion" }],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "Why are the two `if` guards (open_c < n and close_c < open_c) so important to efficiency?",
      answer: "They prune the search: branches that would create invalid strings are never explored, so we build only valid prefixes instead of generating all 2^(2n) strings and filtering.",
      explanation: "Good pruning is what separates backtracking from brute force. The guards ensure every partial string can still become a valid full string.",
    },
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

  review: `**Backtracking** is DFS over a tree of choices with the pattern **choose → explore → un-choose**, plus **pruning** to skip branches that cannot succeed. The parentheses generator prunes with two guards so it builds only valid prefixes, yielding \`['(())', '()()']\` for n=2. Its working space is the **recursion depth + partial candidate = O(n)**, separate from the output. When mutating a shared list, always **undo** (pop) after recursing. This template powers subsets, permutations, combinations, and N-Queens.`,

  expectedOutput: "['(())', '()()']\n",

  references: [
    {
      url: "https://en.wikipedia.org/wiki/Backtracking",
      title: "Backtracking — Wikipedia",
      section: "General method; pruning partial candidates",
      topic: "dp/backtracking",
      purpose: "Confirm the backtracking method: build candidates incrementally and abandon (prune) partials that cannot be completed to a valid solution.",
      verifiedClaims: [
        "Backtracking incrementally builds candidates and abandons a partial candidate as soon as it cannot lead to a valid solution.",
        "It is a depth-first traversal of the space of partial candidates.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://leetcode.com/problems/generate-parentheses/editorial/",
      title: "Generate Parentheses — LeetCode editorial",
      section: "Backtracking with validity pruning",
      topic: "dp/backtracking",
      purpose: "Cross-check the parenthesis-generation pruning conditions and the Catalan-number count of valid strings.",
      verifiedClaims: [
        "Adding '(' is allowed while open count < n; adding ')' while close count < open count keeps strings valid.",
        "The number of valid strings is the nth Catalan number.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 16,
    contentHash: "cae07aaa65b872e8",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
