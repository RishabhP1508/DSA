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
# Mutating through one name is visible through the other.
best.append(40)
# Show the types and values we built.
print(player, score, is_ready, result)
print(scores)`;

export const variablesAndTypes: LessonDefinition = {
  id: "variables-and-types",
  title: "Variables and Types",
  area: "Programming foundations",
  prerequisites: [],

  explanation: `In Python you do not "declare" variables with a fixed type. A **variable is a name** that refers to a value — and every value is an *object* that carries its own type. When you write \`score = 42\`, Python creates the integer object \`42\` and points the name \`score\` at it.

Because the name only *refers* to the object, you can point it at something of a different type later: \`score = 42.5\` makes \`score\` refer to a floating-point number instead. This is called **dynamic typing** — the type travels with the value, not with the name.

A subtle but important consequence: two names can refer to the **same** object. If that object can be changed in place (like a list), a change made through one name is visible through the other. This is called **aliasing**, and it is one of the most common sources of surprise for beginners.`,

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
      "Dynamic typing is flexible and concise, but the same name can hold different types at different times, so you must keep track of what a name actually refers to.",
    commonMistakes:
      "Assuming `b = a` copies a list — it does not; both names refer to the same list. Expecting a reassignment of one name to affect another (it does not — reassignment only rebinds that one name).",
    edgeCases:
      "`int` has unlimited precision (no overflow). `bool` is a subtype of `int` (True behaves like 1). `None` is a single shared object.",
  },

  complexity: [
    { operation: "Assignment / reassignment", best: "O(1)", average: "O(1)", worst: "O(1)", note: "Binding a name is constant time; it does not copy the object." },
    { operation: "list.append", best: "O(1)", average: "O(1)", worst: "O(n) (amortized O(1))", note: "Occasional resize copies elements; amortized cost is O(1)." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "n", meaning: "the number of appends performed on a list (this example does 1)" },
    ],
    costModel:
      "Binding a name to an existing object is constant work (it copies a reference, not the object). `list.append` is analysed with the amortized model: most appends are O(1), and the rare internal resize that copies all elements is spread across the cheap appends.",
    time: {
      bound: "O(1)",
      case: "amortized",
      explanation:
        "Every statement here is a name binding or a single append. Binding (lines 2, 4, 6, 8, 10, 12, 13) is O(1) — it never copies the list. The one append (line 15) is amortized O(1): although a growing list occasionally reallocates and copies its elements (an O(n) event), those costs averaged over many appends come out to O(1) each.",
      otherCases: [
        {
          case: "worst",
          bound: "O(n)",
          note: "A single append that triggers a resize copies all n current elements once; this is the rare worst case behind the amortized O(1).",
        },
      ],
    },
    space: {
      bound: "O(1)",
      case: "amortized",
      explanation:
        "One append adds one slot. Aliasing (`best = scores`) creates NO new storage — both names point at the same list — so no space grows with the number of names.",
      inputOutputNote: "The list itself holds the elements you put in it; that is your data, not auxiliary space.",
    },
    derivation: [
      { lines: [2, 4, 6, 8, 10], description: "Five name bindings to freshly created objects — each O(1).", cost: "O(1)", dimension: "time" },
      { lines: [12], description: "Create a 3-element list literal — proportional to its fixed size, treated as O(1) here.", cost: "O(1)", dimension: "time" },
      { lines: [13], description: "Alias: bind a second name to the same list. Copies only a reference.", cost: "O(1)", dimension: "time" },
      { lines: [15], description: "Append one element — amortized O(1).", cost: "O(1)", dimension: "time" },
      { lines: [13], description: "Aliasing adds no storage; both names share one object.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: [
      "Name binding copies a reference, not the referenced object.",
      "CPython's list uses over-allocation so appends are amortized O(1).",
      "`type()` and `print()` of small values are treated as constant work.",
    ],
    tradeoffs:
      "If you needed the list to stay independent, `best = list(scores)` makes a copy — that copy is O(k) time and O(k) extra space for k elements, unlike the O(1) aliasing shown here.",
    counters: [
      { label: "append calls", definition: "executions of the append line (line 15)", countLines: [15] },
    ],
    fixedDataNote:
      "This program uses fixed literal values and does exactly one append, so its total cost is constant for this run. The amortized O(1) claim describes what happens as you scale the number of appends up to n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "A comment. Comments explain code to humans and are ignored when the program runs." },
    { line: 2, executable: true, explanation: "Create the integer object 42 and bind the name `score` to it. `score` now refers to an int." },
    { line: 3, executable: false, explanation: "Comment: the next line shows that reassignment changes which object the name refers to." },
    { line: 4, executable: true, explanation: "Rebind `score` to the float 42.5. The name now refers to a different object of a different type. Dynamic typing in action." },
    { line: 5, executable: false, explanation: "Comment introducing strings." },
    { line: 6, executable: true, explanation: 'Bind `player` to the string object "Ada". Strings hold text.' },
    { line: 7, executable: false, explanation: "Comment introducing booleans." },
    { line: 8, executable: true, explanation: "Bind `is_ready` to the boolean True. Booleans are either True or False." },
    { line: 9, executable: false, explanation: "Comment introducing None." },
    { line: 10, executable: true, explanation: "Bind `result` to None, the value that represents 'no value yet'." },
    { line: 11, executable: false, explanation: "Comment: the next two lines demonstrate aliasing." },
    { line: 12, executable: true, explanation: "Create a list [10, 20, 30] and bind `scores` to it." },
    { line: 13, executable: true, explanation: "Bind `best` to the SAME list object `scores` refers to. This does not copy the list — both names now alias one object." },
    { line: 14, executable: false, explanation: "Comment: mutation through one alias is visible through the other." },
    { line: 15, executable: true, explanation: "Append 40 to the list through `best`. Because `scores` and `best` refer to the same object, `scores` now also shows the 40." },
    { line: 16, executable: false, explanation: "Comment before the output lines." },
    { line: 17, executable: true, explanation: "Print the current values. `score` is now 42.5 (its reassigned value), and `result` prints as None." },
    { line: 18, executable: true, explanation: "Print the list. It shows [10, 20, 30, 40] — the mutation through `best` is visible via `scores`." },
  ],

  bindings: [
    {
      variable: "scores",
      model: "array",
      overlays: [],
    },
  ],

  prediction: [
    {
      atEventIndex: 8,
      prompt: "After `best = scores` runs, `best.append(40)` executes next. What will `scores` be afterwards, and why?",
      answer: "[10, 20, 30, 40] because best and scores refer to the same list object (aliasing).",
      explanation: "`best = scores` does not copy the list; both names alias the same object, so appending through `best` changes what `scores` sees too.",
    },
  ],

  experiments: [
    "Change line 13 to `best = list(scores)` (a copy). Re-run and watch how `scores` is no longer affected by the append.",
    "Add `print(type(score))` at the end and predict the type before running.",
    "Reassign `score` to a string and observe that the name's type changes.",
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
        "Use int. Python ints have unlimited precision, so there is no overflow.",
      hints: [
        "Python has int, float, and complex numeric types.",
        "Which one represents whole numbers?",
        "Python's int has arbitrary precision — no fixed width, no overflow.",
      ],
    },
  ],

  review: `You learned that a **variable is a name that refers to an object**, and that Python is **dynamically typed** — the type follows the value, not the name. The core types you met were \`int\`, \`float\`, \`str\`, \`bool\`, and \`NoneType\`. Most importantly, you saw **aliasing**: \`b = a\` makes both names refer to the same object, so mutating through one is visible through the other. To get an independent list, make a copy with \`list(a)\`, \`a.copy()\`, or \`a[:]\`.`,

  expectedOutput: "Ada 42.5 True None\n[10, 20, 30, 40]\n",

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
    inventoryVersion: 15,
    contentHash: "b724c8e0c4bb416f",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
