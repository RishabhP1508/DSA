/**
 * Lesson: References and mutation (Programming foundations).
 * Verified on CPython 3.14. Output: "[1, 2, 3]\n5\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Arguments are passed by object reference.
def add_item(bag, item):
    # Mutating the list affects the caller's list (same object).
    bag.append(item)

shared = [1, 2]
add_item(shared, 3)
print(shared)

# Rebinding a parameter does NOT affect the caller's variable.
x = 5
def try_rebind(n):
    n = n + 100

try_rebind(x)
print(x)`;

export const referencesMutation: LessonDefinition = {
  id: "references-mutation",
  title: "References and Mutation",
  area: "Programming foundations",
  prerequisites: ["functions", "variables-and-types"],

  explanation: `When you pass a value to a function, Python passes a **reference to the object** — the parameter becomes **another local name for the same object** the caller named. The object's **contents are not copied**; what is copied is the reference (the arrow pointing at the object), so the caller and the function now have two names for one shared object. This has two consequences that surprise beginners:

1. If the object is **mutable** (like a list) and the function **mutates it in place** (e.g. \`bag.append(item)\`), the caller sees the change — because there is only one list.
2. If the function **rebinds** the parameter to a new object (e.g. \`n = n + 100\`), the caller's variable is **unaffected** — rebinding only changes what the local name points to, not the caller's name.

So \`add_item\` changes \`shared\` (mutation of a shared object), but \`try_rebind\` leaves \`x\` at 5 (rebinding a local). Understanding this distinction — mutation versus rebinding — prevents a whole category of bugs.`,

  vocabulary: [
    { term: "Reference", definition: "A binding to an object (not a copy of the object). Passing an argument copies the reference, so the parameter is another local name for the same object; the object's contents are not copied." },
    { term: "Mutable object", definition: "An object that can be changed in place, e.g. list, dict, set." },
    { term: "Immutable object", definition: "An object that cannot change, e.g. int, str, tuple." },
    { term: "Mutation", definition: "Changing an object in place (list.append), visible through every reference to it." },
    { term: "Rebinding", definition: "Pointing a name at a different object; affects only that name." },
  ],

  concepts: {
    purpose: "Understanding references explains why some function calls change your data and others don't.",
    operations: "Mutating methods (append, sort, update) change shared objects; assignment rebinds a name.",
    uses: "Passing structures to helpers that modify them; deliberately copying to avoid shared-state bugs.",
    tradeoffs: "Mutating in place is memory-efficient but can cause spooky action at a distance; copying is safe but costs O(n).",
    commonMistakes: "Expecting `n = n + 100` inside a function to change the caller; accidentally mutating a shared default argument or shared list.",
    edgeCases: "An immutable object (int, str, tuple) can't itself be changed, so rebinding a parameter bound to one never affects the caller. But \"immutable\" is not a blanket guarantee the caller is safe: a tuple can CONTAIN a mutable object (e.g. ([1, 2], 3)), and mutating that inner list through the shared reference IS visible to the caller — the tuple's own slots are fixed, but the objects they point at may be mutable.",
  },

  complexity: [
    { operation: "append to a shared list", best: "O(1)", average: "O(1)", worst: "O(n) amortized O(1)", note: "One element added; occasional resize." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in the list (this run uses a small fixed list)" }],
    costModel: "append is amortized O(1); passing an argument copies only a reference (O(1)), never the object. The teaching point is the per-call reference behaviour (mutation vs rebinding), which is O(1); the whole program also PRINTS the list, which touches every element.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation: "The reference-behaviour steps this lesson is about are each O(1): passing an argument copies a reference (O(1)) and rebinding a parameter is O(1) — there are no loops in the helpers. Two steps are nonetheless size-dependent in the whole program: `print(shared)` (line 8) formats and emits all n elements → O(n); and the `append` (line 4) is amortized O(1) but its WORST case is O(n) when it triggers a resize. So the per-call reference behaviour is O(1), while the program as a whole is O(n) (assuming each element formats in bounded time).",
    },
    space: {
      bound: "O(n)",
      case: "worst",
      explanation: "Passing the list adds NO space proportional to n — only a reference is shared (that part is genuinely O(1)). But the whole program's auxiliary space is O(n): `print(shared)` builds a formatted representation of the list whose length grows with n (a temporary Unicode buffer sized to the output), and a resizing `append` may allocate a larger backing array. Both are temporary allocations proportional to the list size. (The n-element list itself is the data, not auxiliary space; the O(n) here is the extra memory the program's print/append transiently need.)",
      inputOutputNote: "Passing a reference is O(1) extra space; the O(n) is the transient formatting buffer that `print(shared)` builds (and a possible resize), under a bounded-size-per-element model.",
    },
    derivation: [
      { lines: [7], description: "Pass a reference to the list — O(1), no copy.", cost: "O(1)", dimension: "time" },
      { lines: [4], description: "append one element — amortized O(1), worst case O(n) on a resize.", cost: "O(1)", dimension: "time" },
      { lines: [15], description: "Call try_rebind(x): pass an int and rebind the parameter locally — O(1). (The print of x is on line 16.)", cost: "O(1)", dimension: "time" },
      { lines: [8], description: "print(shared) formats and emits every element of the list — O(n) for an n-element list. (The append on line 4 is also size-dependent in its worst case, so printing is not the only such step.)", cost: "O(n)", dimension: "time" },
      { lines: [7], description: "Passing a reference adds no storage proportional to n.", cost: "O(1)", dimension: "space" },
      { lines: [8], description: "print(shared) builds a formatted string proportional to the list length — O(n) transient space.", cost: "O(n)", dimension: "space" },
    ],
    assumptions: ["Passing an argument shares a reference (no implicit deep copy).", "append is amortized O(1) in CPython (worst case O(n) on a resize).", "Each element formats in bounded time/space, so print(shared) uses O(n) time and transient O(n) space in the number of elements."],
    tradeoffs: "If a helper must not change the caller's list, pass a copy (list(bag)) — O(n) time and space, protecting the original. Note list(bag) is a SHALLOW copy: the new list is independent, but it still shares references to the SAME inner objects, so mutating a nested object (e.g. a sublist) is still visible to the caller. Use copy.deepcopy for fully independent nested data.",
    counters: [{ label: "append calls", definition: "executions of the append line (line 4)", countLines: [4] }],
    fixedDataNote: "This run uses a 2-element list and one append, so the work is constant; the amortized O(1) claim is about scaling appends to n.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: arguments are passed by object reference." },
    { line: 2, executable: true, explanation: "Define add_item(bag, item)." },
    { line: 3, executable: false, explanation: "Comment: mutating the list is visible to the caller." },
    { line: 4, executable: true, explanation: "append mutates the SAME list object the caller passed in." },
    { line: 5, executable: false, explanation: "Blank line." },
    { line: 6, executable: true, explanation: "Create the list [1, 2] and bind it to shared." },
    { line: 7, executable: true, explanation: "Call add_item(shared, 3). bag and shared refer to the same list, so it becomes [1, 2, 3]." },
    { line: 8, executable: true, explanation: "Print shared → [1, 2, 3]. The mutation is visible here." },
    { line: 9, executable: false, explanation: "Blank line." },
    { line: 10, executable: false, explanation: "Comment: rebinding a parameter does not affect the caller." },
    { line: 11, executable: true, explanation: "Set x = 5 (an immutable int)." },
    { line: 12, executable: true, explanation: "Define try_rebind(n)." },
    { line: 13, executable: true, explanation: "n = n + 100 rebinds the LOCAL n to a new int; it does not change x." },
    { line: 14, executable: false, explanation: "Blank line." },
    { line: 15, executable: true, explanation: "Call try_rebind(x). Inside, n becomes 105, but x is untouched." },
    { line: 16, executable: true, explanation: "Print x → still 5." },
  ],

  bindings: [
    { variable: "shared", model: "array", overlays: [] },
  ],

  prediction: [
    { atEventIndex: 0, prompt: "After both calls, what are `shared` and `x`?", answer: "shared is [1, 2, 3]; x is 5.", explanation: "add_item mutates the shared list (visible), while try_rebind only rebinds a local copy of the reference to x, leaving x unchanged." },
  ],

  experiments: [
    "Make add_item do `bag = bag + [item]` instead of append, and see that shared no longer changes (rebinding vs mutating).",
    "Pass list(shared) into add_item and confirm the original is protected.",
    "Try mutating a tuple inside a function to see why immutables can't be changed.",
  ],

  exercises: [
    {
      id: "ref-predict-1",
      kind: "predict-state",
      prompt: "A function does `lst.append(9)` on the list you pass in. Does your original list change?",
      expected: "Yes — append mutates the shared list object, so the caller sees the 9.",
      hints: ["Is the list copied or shared when passed?", "It is shared (a reference).", "append mutates that shared object, so the caller sees it."],
    },
    {
      id: "ref-fix-1",
      kind: "fix-mistake",
      prompt: "A helper should NOT modify the caller's list, but it does. Change it to leave the original intact.",
      starterCode: "def doubled(lst):\n    lst.append(lst[-1])\n    return lst",
      expected: "def doubled(lst):\n    copy = list(lst)\n    copy.append(copy[-1])\n    return copy",
      hints: ["The problem is mutating the shared list.", "Work on a copy instead.", "Use list(lst) to make an independent (shallow) copy first — enough here since the elements are plain ints."],
    },
  ],

  review: `Python passes **references**: caller and parameter share the same object. **Mutating** a shared mutable object (list.append) is visible to the caller; **rebinding** a parameter (n = ...) is not. To protect a caller's data, copy it (O(n)). Passing a reference is **O(1)** and makes no copy.`,

  expectedOutput: "[1, 2, 3]\n5\n",

  references: [
    {
      url: "https://docs.python.org/3.14/tutorial/controlflow.html",
      title: "More Control Flow Tools — Python 3.14 documentation",
      section: "Defining Functions (argument passing)",
      topic: "foundations/references-mutation",
      purpose: "Confirm arguments are passed by object reference (call by object/sharing).",
      verifiedClaims: ["Arguments are passed by object reference; mutable arguments can be changed in place by the callee"],
      accessDate: "2026-09-20",
    },
    {
      url: "https://docs.python.org/3.14/reference/datamodel.html",
      title: "Data model — Python 3.14 Language Reference",
      section: "Objects, values and types (mutability)",
      topic: "foundations/references-mutation",
      purpose: "Cross-check which built-in types are mutable vs immutable.",
      verifiedClaims: ["lists/dicts/sets are mutable; ints/strings/tuples are immutable"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 19,
    contentHash: "5eeecfc8bcb206fd",
    verifiedAt: "2026-10-04",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
    reviewBatch: 1,
  },
};
