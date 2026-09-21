/**
 * Lesson: Scope (Programming foundations). Verified on CPython 3.14.
 * Output: "1\n10\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# 'count' here is a global variable.
count = 10

def bump():
    # This 'count' is a NEW local variable, separate from the global.
    count = 0
    count = count + 1
    return count

# The function's local count does not change the global count.
print(bump())
print(count)`;

export const scope: LessonDefinition = {
  id: "scope",
  title: "Scope (Local vs Global)",
  area: "Programming foundations",
  prerequisites: ["functions"],

  explanation: `**Scope** is the region of a program where a name is visible. A variable assigned **inside** a function is **local** to that function — it lives only during the call and is invisible outside. A variable assigned at the top level is **global**.

This matters because a local variable can **shadow** a global one with the same name. In this lesson \`bump\` assigns \`count = 0\`, which creates a brand-new *local* \`count\`. Changing it does not touch the global \`count\`, so after the call the global is still \`10\`.

The rule of thumb: assigning to a name inside a function makes it local (unless you use the \`global\` keyword). Reading a name that isn't local falls back to the enclosing/global scope. Keeping state local is usually what you want — it prevents functions from accidentally clobbering each other's data.`,

  vocabulary: [
    { term: "Scope", definition: "The region of code where a name is visible/usable." },
    { term: "Local variable", definition: "A name assigned inside a function; exists only during that call." },
    { term: "Global variable", definition: "A name defined at the top level of the module." },
    { term: "Shadowing", definition: "A local name hiding a global name of the same identifier." },
    { term: "global keyword", definition: "Declares that assignments to a name inside a function target the global variable." },
  ],

  concepts: {
    purpose: "Scope keeps each function's variables separate so functions don't interfere with one another.",
    operations: "Assigning inside a function creates a local; the global keyword opts into modifying a global.",
    uses: "Encapsulating state, avoiding side effects, reasoning about what a function can change.",
    tradeoffs: "Locals keep functions predictable; overusing globals makes bugs hard to trace.",
    commonMistakes: "Expecting an assignment inside a function to change a same-named global (it creates a local instead); reading then assigning a global without declaring `global` (raises UnboundLocalError).",
    edgeCases: "If you reference a name before assigning it in a function where it's assigned later, Python treats it as local and raises UnboundLocalError.",
  },

  complexity: [
    { operation: "Call bump()", best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(1)", note: "Constant work in one frame." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "—", meaning: "no input size; constant work per call" }],
    costModel: "Each assignment and addition is one constant-time step; one call frame is constant space.",
    time: { bound: "O(1)", case: "worst", explanation: "bump does two assignments and one addition, then returns — a fixed amount of work with no loop or recursion." },
    space: { bound: "O(1)", case: "worst", explanation: "The call uses one frame with a single local (count). Global count is one variable. Nothing grows with input; max call depth is 1." },
    derivation: [
      { lines: [11], description: "One call creates one frame.", cost: "O(1)", dimension: "time" },
      { lines: [6, 7, 8], description: "Two assignments and one addition inside the body.", cost: "O(1)", dimension: "time" },
      { lines: [2, 6], description: "One global and one local variable — a fixed set.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Arithmetic and assignment are constant time.", "No recursion, so call depth is bounded."],
    counters: [{ label: "bump calls", definition: "call events for bump (line 11)", countLines: [11] }],
    fixedDataNote: "Values are fixed literals, so this run is constant work; scope behaviour does not depend on any input size.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: count here is global." },
    { line: 2, executable: true, explanation: "Define the global variable count = 10." },
    { line: 3, executable: false, explanation: "Blank line." },
    { line: 4, executable: true, explanation: "Define the function bump." },
    { line: 5, executable: false, explanation: "Comment: the inner count is a new local." },
    { line: 6, executable: true, explanation: "Assigning count inside bump creates a LOCAL count = 0, separate from the global." },
    { line: 7, executable: true, explanation: "Update the local count to 1. The global is untouched." },
    { line: 8, executable: true, explanation: "Return the local count (1)." },
    { line: 9, executable: false, explanation: "Blank line." },
    { line: 10, executable: false, explanation: "Comment: the local does not change the global." },
    { line: 11, executable: true, explanation: "Call bump(); it returns 1, which is printed." },
    { line: 12, executable: true, explanation: "Print the global count → still 10." },
  ],

  bindings: [{ variable: "count", model: "object" }],

  prediction: [
    { atEventIndex: 0, prompt: "After bump() runs, what is the value of the GLOBAL count?", answer: "10", explanation: "bump's count is a separate local variable; assigning it never changed the global, which stays 10." },
  ],

  experiments: [
    "Add `global count` as the first line of bump and re-run; now the global changes.",
    "Rename the local to `c` and confirm the two variables are clearly distinct in the panel.",
    "Try reading count before assigning it inside bump to trigger UnboundLocalError.",
  ],

  exercises: [
    {
      id: "scope-predict-1",
      kind: "predict-state",
      prompt: "A function assigns `x = 5` inside it. Does this change a global variable also named x?",
      expected: "No — the assignment creates a local x; the global x is unchanged (unless `global x` is declared).",
      hints: ["Assigning inside a function usually creates a local.", "Locals are separate from globals of the same name.", "Only `global x` would make it modify the global."],
    },
    {
      id: "scope-choose-1",
      kind: "choose-approach",
      prompt: "You want a function to update a module-level counter. What is the cleaner approach: `global`, or returning the new value?",
      expected: "Prefer returning the new value and reassigning it at the call site; it avoids hidden side effects. `global` works but couples the function to that name.",
      hints: ["Both can work.", "Which keeps the function easier to reason about and test?", "Returning a value avoids hidden global side effects."],
    },
  ],

  review: `**Scope** decides where a name is visible. Assigning inside a function creates a **local** that **shadows** any global of the same name, so it doesn't change the global — use \`global\` only if you truly must. Constant work in one frame is **O(1)** time and space.`,

  expectedOutput: "1\n10\n",

  references: [
    {
      url: "https://docs.python.org/3.14/tutorial/classes.html",
      title: "Classes — Python 3.14 documentation",
      section: "Python Scopes and Namespaces",
      topic: "foundations/scope",
      purpose: "Confirm that assignment inside a function creates a local binding and does not change the global unless declared global.",
      verifiedClaims: ["Assignments inside a function create local names by default", "global declares module-level binding"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 17,
    contentHash: "35f184459c464a8b",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 1,
  },
};
