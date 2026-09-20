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

  explanation: `When you pass a value to a function, Python passes a **reference to the object** — both the caller's variable and the parameter point at the **same object**. This has two consequences that surprise beginners:

1. If the object is **mutable** (like a list) and the function **mutates it in place** (e.g. \`bag.append(item)\`), the caller sees the change — because there is only one list.
2. If the function **rebinds** the parameter to a new object (e.g. \`n = n + 100\`), the caller's variable is **unaffected** — rebinding only changes what the local name points to, not the caller's name.

So \`add_item\` changes \`shared\` (mutation of a shared object), but \`try_rebind\` leaves \`x\` at 5 (rebinding a local). Understanding this distinction — mutation versus rebinding — prevents a whole category of bugs.`,

  vocabulary: [
    { term: "Reference", definition: "A pointer to an object; variables and parameters hold references, not copies." },
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
    edgeCases: "Immutable objects (int, str, tuple) can't be mutated, so functions can only rebind them locally — the caller is never affected.",
  },

  complexity: [
    { operation: "append to a shared list", best: "O(1)", average: "O(1)", worst: "O(n) amortized O(1)", note: "One element added; occasional resize." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [{ symbol: "n", meaning: "the number of elements in the list (this run uses a small fixed list)" }],
    costModel: "append is amortized O(1); passing an argument copies only a reference (O(1)), never the object.",
    time: {
      bound: "O(1)",
      case: "amortized",
      explanation: "Both function calls do constant work: passing arguments copies references (O(1)), append is amortized O(1), and rebinding is O(1). No loops.",
    },
    space: {
      bound: "O(1)",
      case: "amortized",
      explanation: "No copy of the list is made when passing it — only a reference is shared — so passing costs no extra space proportional to n. append adds one slot.",
      inputOutputNote: "The list `shared` holds your data; it is not auxiliary space created by the calls.",
    },
    derivation: [
      { lines: [7], description: "Pass a reference to the list — O(1), no copy.", cost: "O(1)", dimension: "time" },
      { lines: [4], description: "append one element — amortized O(1).", cost: "O(1)", dimension: "time" },
      { lines: [16], description: "Pass an int and rebind locally — O(1).", cost: "O(1)", dimension: "time" },
      { lines: [7], description: "Sharing a reference adds no storage proportional to n.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: ["Passing an argument shares a reference (no implicit deep copy).", "append is amortized O(1) in CPython."],
    tradeoffs: "If a helper must not change the caller's list, pass a copy (list(bag)) — that is O(n) time and space but protects the original.",
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
      hints: ["The problem is mutating the shared list.", "Work on a copy instead.", "Use list(lst) to make an independent copy first."],
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
      url: "https://docs.python.org/3/reference/datamodel.html",
      title: "Data model — Python Language Reference",
      section: "Objects, values and types (mutability)",
      topic: "foundations/references-mutation",
      purpose: "Cross-check which built-in types are mutable vs immutable.",
      verifiedClaims: ["lists/dicts/sets are mutable; ints/strings/tuples are immutable"],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "f529ab8ed64c3528",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 1,
  },
};
