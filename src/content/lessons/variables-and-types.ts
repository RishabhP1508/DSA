/**
 * Lesson: Variables and Types (Programming foundations).
 *
 * Content researched and verified against the sources listed in `references`
 * (see docs/references.md). The Python program was executed on CPython 3.14
 * (matching the bundled Pyodide runtime, which ships CPython 3.14.2) and its
 * output and per-step trace were confirmed before authoring the explanations.
 */

import type { LessonDefinition } from "../../core/types";

const code = `# A name is a label that refers to a value (an object).
score = 42
# Reassigning changes which object the name refers to; the type follows.
score = 42.5
# Strings hold text.
player = "Ada"
# Booleans are True or False.
is_ready = True
# None represents "no value yet".
result = None
# Two names can refer to the same list object (aliasing).
scores = [10, 20, 30]
best = scores
# 'is' tests IDENTITY: best and scores are the SAME object -> True.
print(best is scores)
# Mutating through one name is visible through the other.
best.append(40)
# A COPY is a different object with equal contents -> 'is' is False.
independent = list(scores)
print(independent is scores)
# Show the values we built.
print(player, score, is_ready, result)
print(scores)`;

export const variablesAndTypes: LessonDefinition = {
  id: "variables-and-types",
  title: "Variables and Types",
  area: "Programming foundations",
  prerequisites: [],

  explanation: `In Python you do not "declare" variables with a fixed type. A **variable is a name** that refers to a value — and every value is an *object* that carries its own type. When you write \`score = 42\`, the literal \`42\` evaluates to an \`int\` object and the name \`score\` is **bound** to it. (Binding a literal does not promise a brand-new object: CPython keeps a cache of small integers, so the same literal \`42\` elsewhere may reuse the very same \`int\` object — see the Python docs. The point is simply that \`score\` now refers to an \`int\`.)

Because the name only *refers* to the object, you can point it at something of a different type later: \`score = 42.5\` makes \`score\` refer to a floating-point number instead. This is called **dynamic typing** — the type travels with the value, not with the name.

A subtle but important consequence: two names can refer to the **same** object. If that object can be changed in place (like a list), a change made through one name is visible through the other. This is called **aliasing**, and it is one of the most common sources of surprise for beginners.

You can test this directly. The \`is\` operator compares **identity** — whether two names point at the very same object — not just equal contents. After \`best = scores\`, \`best is scores\` is \`True\` (one shared list). Make a **copy** with \`list(scores)\` and it is a *different* object with equal contents, so \`independent is scores\` is \`False\`. The visualization shows this directly from the recorded snapshot: the list for \`scores\` is labelled "same object as best", because the two names carry the same object reference, while \`independent\` carries a new reference and shows no such label — a copy, not an alias.`,

  vocabulary: [
    { term: "Variable (name)", definition: "A label that refers to a value. It does not store the value directly; it points at an object." },
    { term: "Object", definition: "A value in memory. Every object has a type (like int or str) and an identity." },
    { term: "Dynamic typing", definition: "The type is determined by the value a name currently refers to, and can change on reassignment." },
    { term: "Type", definition: "The category of a value, e.g. int, float, str, bool, or NoneType." },
    { term: "Aliasing", definition: "When two or more names refer to the same object, so changes through one are seen through the others." },
    { term: "Mutation", definition: "Changing an object in place (e.g. list.append) rather than creating a new object." },
    { term: "None", definition: "A special value (of type NoneType) that represents the absence of a value." },
  ],

  concepts: {
    purpose:
      "Variables let you name values so you can refer to and reuse them. Understanding that names refer to objects is the foundation for everything else — references, mutation, function arguments, and data structures.",
    operations:
      "Assignment (`name = value`) binds a name to an object. Reassignment rebinds the name to a different object. `type(x)` reports an object's type. Container methods like `list.append` mutate an object in place.",
    uses:
      "Every program uses variables to hold inputs, intermediate results, counters, and outputs.",
    tradeoffs:
      "Dynamic typing is flexible and concise, but the same name can refer to objects of different types at different times (the type belongs to the value, not the name), so you must keep track of what a name actually refers to.",
    commonMistakes:
      "Assuming `b = a` copies a list — it does not; both names refer to the same list. Expecting a reassignment of one name to affect another (it does not — reassignment only rebinds that one name).",
    edgeCases:
      "`int` has unlimited precision — there is no fixed-width integer overflow; an int just grows as large as it needs to, limited only by available memory. `bool` is a subtype of `int` (True behaves like 1). `None` is a single shared object.",
  },

  complexity: [
    { operation: "Assignment / reassignment", best: "O(1)", average: "O(1)", worst: "O(1)", note: "Binding a name is constant time; it does not copy the object." },
    { operation: "Identity check (is)", best: "O(1)", average: "O(1)", worst: "O(1)", note: "Compares object identities directly, independent of contents or length." },
    { operation: "list.append", best: "O(1)", average: "O(1)", worst: "O(n) (amortized O(1))", note: "Occasional resize copies elements; amortized cost is O(1)." },
    { operation: "Copy with list(x)", best: "O(k)", average: "O(k)", worst: "O(k)", space: "O(k)", note: "Allocates a new list and copies k elements — a different object." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of appends performed on a list (this example does 1)" },
      { symbol: "k", meaning: "the number of elements in the list when it is copied/printed (here 4: the 3 literals plus the appended 40)" },
    ],
    costModel:
      "Binding a name to an existing object is constant work (it copies a reference, not the object), and `is` compares identities in O(1). `list.append` is analysed with the amortized model: most appends are O(1), and the rare internal resize that copies all elements is spread across the cheap appends. Copying a list with `list(x)` is O(k) in the number of elements.",
    time: {
      bound: "O(k)",
      case: "worst",
      explanation:
        "The name bindings and the `is` identity checks are each O(1). The single `best.append(40)` is amortized O(1), but its WORST case is O(k): when the backing array is full the append reallocates and copies all current elements. The copy `independent = list(scores)` is O(k) (allocate a new list, copy k elements). And the final `print(scores)` must format and emit all k elements, so it is O(k) too — the copy is NOT the only size-dependent step. Summing these size-dependent steps keeps the overall worst case at O(k).",
      otherCases: [
        {
          case: "amortized",
          bound: "O(k)",
          note: "Even ignoring the append's rare resize, both `list(scores)` and `print(scores)` are O(k), so the program is O(k) in the list length either way.",
        },
      ],
    },
    space: {
      bound: "O(k)",
      case: "worst",
      explanation:
        "Aliasing (`best = scores`) creates NO new storage — both names point at the same list. The copy `independent = list(scores)` DOES allocate a new k-element list, so auxiliary space is O(k); the one append adds a single slot.",
      inputOutputNote: "The original list holds your data; the extra O(k) is the independent copy you deliberately made.",
    },
    derivation: [
      { lines: [2, 4, 6, 8, 10], description: "Five name bindings — each binds a name to an int/str/bool/None object (CPython may reuse a cached small int), O(1).", cost: "O(1)", dimension: "time" },
      { lines: [12], description: "Build a 3-element list literal — proportional to its fixed size, treated as O(1) here.", cost: "O(1)", dimension: "time" },
      { lines: [13], description: "Alias: bind a second name to the same list. Copies only a reference.", cost: "O(1)", dimension: "time" },
      { lines: [17], description: "Append one element — amortized O(1), but WORST case O(k) when a full backing array is reallocated and all k current elements are copied.", cost: "O(k)", dimension: "time" },
      { lines: [19], description: "list(scores) makes a copy of the k current elements — O(k) time and space.", cost: "O(k)", dimension: "time" },
      { lines: [23], description: "print(scores) formats and emits all k elements — O(k) too, so the copy is not the only size-dependent step.", cost: "O(k)", dimension: "time" },
      { lines: [13], description: "Aliasing adds no storage; both names share one object.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: [
      "Name binding copies a reference, not the referenced object.",
      "CPython's list uses over-allocation so appends are amortized O(1), with an O(k) worst case on resize.",
      "`is` compares identity in O(1); `list(x)` copies k elements in O(k); printing a list touches all k elements.",
      "The individual int/str values here are small, so creating/formatting one value is treated as O(1).",
    ],
    tradeoffs:
      "Aliasing (`best = scores`) is O(1) and shares one object; a copy (`list(scores)`) is O(k) time and O(k) extra space for k elements but keeps the lists independent (`is` is then False).",
    counters: [
      { label: "append calls", definition: "executions of the append line (line 17)", countLines: [17] },
    ],
    fixedDataNote:
      "This run uses a fixed list (3 literals, then one append → k = 4 when it is copied and printed), so the work is small and constant here. The O(k) worst-case bound describes how the copy, the print, and a resizing append grow with the list length k.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "A comment. Comments explain code to humans and are ignored when the program runs." },
    { line: 2, executable: true, explanation: "The literal 42 evaluates to an int object; the name `score` is bound to it (CPython may reuse a cached small int rather than allocate a new one). `score` now refers to an int." },
    { line: 3, executable: false, explanation: "Comment: the next line shows that reassignment changes which object the name refers to." },
    { line: 4, executable: true, explanation: "Rebind `score` to the float 42.5. The name now refers to a different object of a different type. Dynamic typing in action." },
    { line: 5, executable: false, explanation: "Comment introducing strings." },
    { line: 6, executable: true, explanation: 'Bind `player` to the string object "Ada". Strings hold text.' },
    { line: 7, executable: false, explanation: "Comment introducing booleans." },
    { line: 8, executable: true, explanation: "Bind `is_ready` to the boolean True. Booleans are either True or False." },
    { line: 9, executable: false, explanation: "Comment introducing None." },
    { line: 10, executable: true, explanation: "Bind `result` to None, the value that represents 'no value yet'." },
    { line: 11, executable: false, explanation: "Comment: the next lines demonstrate aliasing and identity." },
    { line: 12, executable: true, explanation: "Create a list [10, 20, 30] and bind `scores` to it." },
    { line: 13, executable: true, explanation: "Bind `best` to the SAME list object `scores` refers to. This does not copy the list — both names now alias one object." },
    { line: 14, executable: false, explanation: "Comment: `is` compares object identity, not just equal contents." },
    { line: 15, executable: true, explanation: "Print `best is scores`. It is True because both names point at the very same list object (same identity)." },
    { line: 16, executable: false, explanation: "Comment: mutation through one alias is visible through the other." },
    { line: 17, executable: true, explanation: "Append 40 to the list through `best`. Because `scores` and `best` refer to the same object, `scores` now also shows the 40." },
    { line: 18, executable: false, explanation: "Comment: a copy is a separate object with equal contents." },
    { line: 19, executable: true, explanation: "Build `independent = list(scores)` — a NEW list object with the same elements, a different identity." },
    { line: 20, executable: true, explanation: "Print `independent is scores`. It is False: equal contents, but a different object." },
    { line: 21, executable: false, explanation: "Comment: the final lines print the values we built." },
    { line: 22, executable: true, explanation: "Print the current values. `score` is now 42.5 (its reassigned value), and `result` prints as None." },
    { line: 23, executable: true, explanation: "Print the list. It shows [10, 20, 30, 40] — the mutation through `best` is visible via `scores`." },
  ],

  // Bind BOTH aliasing names so the shared list is visible under each. The
  // visualizer reads the recorded snapshot: when `best` and `scores` carry the
  // same reference id they ARE the same object (aliasing); `independent` carries
  // a different id (a copy). Identity is observed from the trace, never inferred
  // by re-running the learner's code.
  bindings: [
    { variable: "scores", model: "array", overlays: [] },
    { variable: "best", model: "array", overlays: [] },
    { variable: "independent", model: "array", overlays: [] },
  ],

  prediction: [
    {
      atEventIndex: 8,
      prompt: "`best = scores` has just run. Will `best is scores` print True or False, and will mutating `best` change `scores`?",
      answer: "True — they are the same object (aliasing) — so appending through `best` also changes `scores`.",
      explanation: "`best = scores` does not copy the list; both names alias one object (same identity), so `best is scores` is True and a mutation through either name is seen through the other. A copy like `list(scores)` would be a different object, so `is` would be False.",
    },
  ],

  experiments: [
    "Change line 13 to `best = list(scores)` (a copy). Re-run and watch how `scores` is no longer affected by the append.",
    "Add `print(type(score))` at the end and predict the type before running.",
    "Reassign `score` to a string and observe that `score` now refers to an object of a different type (the name itself has no type).",
  ],

  exercises: [
    {
      id: "vt-predict-1",
      kind: "predict-state",
      prompt: "Given `a = [1, 2]; b = a; b.append(3)`, what is `a` afterwards?",
      expected: "[1, 2, 3]",
      hints: [
        "Does `b = a` copy the list or share it?",
        "Both names refer to the same list object.",
        "Appending through `b` mutates the shared object, so `a` is [1, 2, 3].",
      ],
    },
    {
      id: "vt-fix-1",
      kind: "fix-mistake",
      prompt:
        "A learner wanted two independent lists but wrote `b = a` then mutated `b`, and `a` changed too. Fix the code so `a` is not affected.",
      starterCode: "a = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)",
      expected: "a = [1, 2, 3]\nb = list(a)  # or a.copy() / a[:]\nb.append(4)\nprint(a)  # [1, 2, 3]",
      hints: [
        "The problem is that `b` aliases `a`.",
        "You need an independent copy of the list.",
        "Use `list(a)`, `a.copy()`, or `a[:]` to make a shallow copy.",
      ],
    },
    {
      id: "vt-choose-1",
      kind: "choose-approach",
      prompt:
        "You need `x` to hold a whole number that could be extremely large (hundreds of digits). Which Python type do you use, and do you need to worry about overflow?",
      expected:
        "Use int. Python ints have unlimited precision, so there is no fixed-width integer overflow — the value just grows as needed, limited only by available memory.",
      hints: [
        "Python has int, float, and complex numeric types.",
        "Which one represents whole numbers?",
        "Python's int has arbitrary precision — no fixed width to overflow; it grows as large as needed, bounded only by available memory.",
      ],
    },
  ],

  review: `You learned that a **variable is a name that refers to an object**, and that Python is **dynamically typed** — the type follows the value, not the name. The core types you met were \`int\`, \`float\`, \`str\`, \`bool\`, and \`NoneType\`. Most importantly, you saw **aliasing** and **identity**: \`b = a\` makes both names refer to the same object (so \`b is a\` is \`True\` and mutating through one is visible through the other), while a copy with \`list(a)\`, \`a.copy()\`, or \`a[:]\` is a different object (\`is\` is \`False\`). Use \`is\` to ask "same object?" and \`==\` to ask "equal contents?".`,

  expectedOutput: "True\nFalse\nAda 42.5 True None\n[10, 20, 30, 40]\n",

  references: [
    {
      url: "https://docs.python.org/3.14/tutorial/introduction.html",
      title: "3. An Informal Introduction to Python — Python 3.14 documentation",
      section: "Using Python as a Calculator; first assignments",
      topic: "programming-foundations/variables-and-types",
      purpose: "Authoritative Python semantics for assignment and numeric/string values on the bundled 3.14 runtime.",
      verifiedClaims: [
        "Assignment binds a name to a value.",
        "int, float and str are core built-in value types.",
      ],
      conventions: ["Python 3.14 syntax and semantics"],
      accessDate: "2026-09-19",
    },
    {
      url: "https://openstax.org/books/introduction-python-programming/pages/3-3-variables-revisited",
      title: "3.3 Variables revisited — Introduction to Python Programming (OpenStax)",
      section: "Variables as references; multiple names for one object",
      topic: "programming-foundations/variables-and-types",
      purpose: "Cross-check that a variable is a name referring to an object and that multiple names can refer to the same object (aliasing).",
      verifiedClaims: [
        "Every variable refers to an object.",
        "Multiple variables may refer to the same object.",
      ],
      accessDate: "2026-09-19",
    },
    {
      url: "https://www.w3schools.com/python/python_datatypes.asp",
      title: "Python Data Types — W3Schools",
      section: "Built-in data types",
      topic: "programming-foundations/variables-and-types",
      purpose: "Beginner-level enumeration of built-in types (int, float, str, bool, NoneType) for vocabulary.",
      verifiedClaims: [
        "int, float, str, bool and NoneType are built-in types.",
      ],
      accessDate: "2026-09-19",
    },
    {
      url: "https://www.w3schools.com/python/python_numbers.asp",
      title: "Python Numbers — W3Schools",
      section: "int",
      topic: "programming-foundations/variables-and-types",
      purpose: "Verify that Python int is a whole number of unlimited length (no overflow).",
      verifiedClaims: ["Python int has unlimited length / arbitrary precision."],
      accessDate: "2026-09-19",
    },
  ],
  evidence: {
    inventoryVersion: 19,
    contentHash: "612fac88ec9babef",
    verifiedAt: "2026-10-03",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 1,
  },
};
