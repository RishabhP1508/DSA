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

The \`__init__\` method is the **constructor**: it runs when you create an instance and sets up its starting attributes. \`self\` is the current object; \`self.value = start\` stores data **on that specific instance**. A **method** like \`increment\` operates on the object's own data through \`self\`.

Here we make a \`Counter\` starting at 10, call \`increment\` twice (10 → 11 → 12), and print \`c.value\`, which is 12. Each instance has its own attributes, so two counters are independent.`,

  vocabulary: [
    { term: "Class", definition: "A blueprint describing the attributes and methods of a kind of object." },
    { term: "Instance / object", definition: "A concrete value created from a class." },
    { term: "__init__ (constructor)", definition: "The method that initialises a new instance's attributes." },
    { term: "self", definition: "A reference to the current instance, used to access its attributes/methods." },
    { term: "Attribute", definition: "A piece of data stored on an instance, e.g. self.value." },
    { term: "Method", definition: "A function defined in a class that operates on an instance." },
  ],

  concepts: {
    purpose: "Classes model entities that carry state and behaviour together — the basis for nodes, trees, and graphs.",
    operations: "Define with class, initialise with __init__, add methods, create instances, read/write attributes.",
    uses: "Linked-list/tree/graph nodes, custom data structures, grouping related state.",
    tradeoffs: "Classes add structure and reuse but can be overkill for simple data (a tuple or dict may suffice).",
    commonMistakes: "Forgetting self in method definitions or attribute access; confusing class-level and instance-level attributes; expecting two instances to share instance attributes (they don't).",
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
    { line: 3, executable: true, explanation: "Define the constructor __init__, which runs on instance creation." },
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

  review: `A **class** is a blueprint bundling **attributes** (data) and **methods** (behaviour); an **instance** is one object built from it. \`__init__\` initialises attributes via \`self\`, and each instance has its own state. k method calls that each do O(1) work is **O(k)** time with **O(1)** space. Classes power the node types in later structure lessons.`,

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
    inventoryVersion: 17,
    contentHash: "7ad5c0b0b6d0c22f",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 1,
  },
};
