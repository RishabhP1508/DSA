/**
 * Lesson: Classes (Programming foundations). Verified on CPython 3.14.
 * Output: "12\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# A class is a blueprint for objects that bundle data + behaviour.
class Counter:
    def __init__(self, start):
        # self.value is an instance attribute — data for this object.
        self.value = start

    def increment(self):
        # Methods act on the object's own data via self.
        self.value = self.value + 1

# Create an instance and use it.
c = Counter(10)
c.increment()
c.increment()
print(c.value)`;

export const classes: LessonDefinition = {
  id: "classes",
  title: "Classes and Objects",
  area: "Programming foundations",
  prerequisites: ["functions", "references-mutation"],

  explanation: `A **class** is a blueprint that bundles **data** (attributes) with **behaviour** (methods). An **instance** is one object made from that blueprint. Classes are how we build the nodes and structures in later lessons — a linked-list node, a tree node, a graph — so this is an important foundation.

The \`__init__\` method **initializes** a newly created instance — Python builds the object first, then runs \`__init__\` to set up its starting attributes (so it is the *initializer*; the lower-level creation step is \`__new__\`, which beginners rarely write). \`self\` is the current instance, and Python supplies it **automatically**: writing \`c.increment()\` is shorthand for \`Counter.increment(c)\`, so the instance \`c\` is passed in as the first parameter \`self\`. That is why the ordinary **instance methods** taught here (\`__init__\`, \`increment\`) list \`self\` first. (Not every method does — class methods and static methods, beyond this lesson, do not take \`self\` — so read this as "instance methods take \`self\` first".) \`self.value = start\` stores data **on that specific instance**, and a **method** like \`increment\` reaches the object's own data through \`self\`.

Here we make a \`Counter\` starting at 10, call \`increment\` twice (10 → 11 → 12), and print \`c.value\`, which is 12. In this example each counter's \`value\` is bound separately through \`self.value\`, so incrementing one does not change another. But instances are not *guaranteed* to be independent: an attribute **binds a name to an object**, and two instances can end up referring to the **same** object — e.g. \`self.items = shared_list\` in \`__init__\` would make every instance share one list, and a class-level attribute (defined on the class, not through \`self\`) is shared by all instances too. Independence here comes from each instance having its **own attribute binding** (\`c.value\` and \`d.value\` are separate name bindings), not from the ints being distinct objects: two \`Counter(10)\`s may initially share the very same cached int (\`c.value is d.value\` can be \`True\`). Incrementing one does \`self.value = self.value + 1\`, which **rebinds only that instance's attribute** to a new int, leaving the other's binding untouched — so they diverge regardless of whether they first shared an int object.`,

  vocabulary: [
    { term: "Class", definition: "A blueprint describing the attributes and methods of a kind of object." },
    { term: "Instance / object", definition: "A concrete value created from a class." },
    { term: "__init__ (initializer)", definition: "The method that initializes a newly created instance's attributes. Often loosely called the constructor, though Python creates the object first (via __new__) and then calls __init__ to set it up." },
    { term: "self", definition: "A reference to the current instance, used to access its attributes/methods." },
    { term: "Attribute", definition: "A piece of data stored on an instance, e.g. self.value." },
    { term: "Method", definition: "A function defined in a class that operates on an instance." },
  ],

  concepts: {
    purpose: "Classes model entities that carry state and behaviour together — the basis for nodes, trees, and graphs.",
    operations: "Define with class, initialise with __init__, add methods, create instances, read/write attributes.",
    uses: "Linked-list/tree/graph nodes, custom data structures, grouping related state.",
    tradeoffs: "Classes add structure and reuse but can be overkill for simple data (a tuple or dict may suffice).",
    commonMistakes: "Forgetting self in method definitions or attribute access; confusing class-level and instance-level attributes; conflating a per-instance ATTRIBUTE BINDING with the OBJECT it points at — each instance has its own `self.value` binding, but that does not mean the referenced objects differ (two counters can share one cached int) nor that instances can never share a referenced object (e.g. if __init__ does `self.items = shared_list`, every instance's `items` points at the one shared list).",
    edgeCases: "Attributes not set in __init__ don't exist until assigned. Mutable class-level defaults are shared across instances (a common trap).",
  },

  complexity: [
    { operation: "increment()", best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(1)", note: "One attribute update per call." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "k", meaning: "the number of increment() calls made" }],
    costModel: "Creating an instance and each method call are constant-time; one attribute update is O(1).",
    time: {
      bound: "O(k)",
      case: "worst",
      explanation: "Construction is O(1). Each increment() does one addition and one attribute store — O(1) — so making k increment calls is O(k). This run makes k = 2 calls.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation: "One instance with a fixed number of attributes (value). Method calls use one frame at a time (depth 1). Nothing grows with the number of calls.",
    },
    derivation: [
      { lines: [12], description: "Construct one instance — O(1).", cost: "O(1)", dimension: "time" },
      { lines: [13, 14], description: "Each increment call does one addition + attribute store; k calls → O(k).", cost: "O(k)", dimension: "time" },
      { lines: [5], description: "One instance holding a fixed set of attributes.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Attribute access/store and integer addition are constant time.", "No recursion; call depth is bounded."],
    counters: [
      { label: "increment calls", definition: "call events for increment (lines 13–14)", countLines: [13, 14] },
      { label: "attribute updates", definition: "executions of the increment body (line 9)", countLines: [9] },
    ],
    fixedDataNote: "This run makes exactly 2 increments (final value 12). The O(k) time describes scaling with the number of increment calls.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: a class bundles data and behaviour." },
    { line: 2, executable: true, explanation: "Define the class Counter (creates the class object)." },
    { line: 3, executable: true, explanation: "Define __init__, the initializer that runs right after the instance is created to set up its attributes." },
    { line: 4, executable: false, explanation: "Comment: self.value is per-instance data." },
    { line: 5, executable: true, explanation: "Store the starting value on this instance as self.value." },
    { line: 6, executable: false, explanation: "Blank line." },
    { line: 7, executable: true, explanation: "Define the method increment." },
    { line: 8, executable: false, explanation: "Comment: methods use self to reach the object's data." },
    { line: 9, executable: true, explanation: "Add 1 to this instance's value." },
    { line: 10, executable: false, explanation: "Comment: create and use an instance." },
    { line: 11, executable: false, explanation: "Comment continues (or blank)." },
    { line: 12, executable: true, explanation: "Create a Counter with start=10; __init__ sets value to 10." },
    { line: 13, executable: true, explanation: "First increment: value becomes 11." },
    { line: 14, executable: true, explanation: "Second increment: value becomes 12." },
    { line: 15, executable: true, explanation: "Print c.value → 12." },
  ],

  bindings: [{ variable: "c", model: "object" }],

  prediction: [
    { atEventIndex: 0, prompt: "If you created a second counter d = Counter(0) and called d.increment() once, would c.value change?", answer: "No — c and d are independent instances; d.increment() only changes d.value.", explanation: "Each instance has its own value attribute, so incrementing d does not affect c." },
  ],

  experiments: [
    "Add a method decrement() and call it; watch value go back down.",
    "Create two counters and confirm they hold independent values.",
    "Add a second attribute in __init__ and display it in the object view.",
  ],

  exercises: [
    {
      id: "class-complete-1",
      kind: "complete-code",
      prompt: "Give Counter a `reset()` method that sets value back to 0.",
      starterCode: "class Counter:\n    def __init__(self, start):\n        self.value = start\n    def reset(self):\n        # TODO: set value to 0\n        pass",
      expected: "class Counter:\n    def __init__(self, start):\n        self.value = start\n    def reset(self):\n        self.value = 0",
      hints: ["Methods change the instance via self.", "You want to set the value attribute.", "self.value = 0"],
    },
    {
      id: "class-predict-1",
      kind: "predict-state",
      prompt: "After Counter(10) then two increment() calls, what is c.value?",
      expected: "12",
      hints: ["Start is 10.", "Each increment adds 1.", "10 + 1 + 1 = 12."],
    },
  ],

  review: `A **class** is a blueprint bundling **attributes** (data) and **methods** (behaviour); an **instance** is one object built from it. \`__init__\` **initializes** a new instance via \`self\`, and \`c.method()\` automatically passes \`c\` in as \`self\`. Attributes set through \`self\` are per-instance; attributes defined on the class are shared, so instance independence is not automatic for class-level data. k method calls that each do O(1) work is **O(k)** time with **O(1)** space. Classes power the node types in later structure lessons.`,

  expectedOutput: "12\n",

  references: [
    {
      url: "https://docs.python.org/3.14/tutorial/classes.html",
      title: "Classes — Python 3.14 documentation",
      section: "Class Objects / Instance Objects / Method Objects",
      topic: "foundations/classes",
      purpose: "Confirm class/instance/__init__/self semantics and instance attribute behaviour.",
      verifiedClaims: ["__init__ initialises new instances", "self refers to the instance", "instances have their own attributes"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 20,
    contentHash: "e57a6eba22fe7173",
    verifiedAt: "2026-10-04",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 1,
  },
};
