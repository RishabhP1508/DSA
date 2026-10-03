# Semantic review — Batch B1 (Foundations) — PREPARED FOR HUMAN REVIEW

> **Status: NOT signed off.** All 160 content items remain `semanticReview: false`.
> This document prepares B1 for a human reviewer; it does **not** set
> `semanticReview: true` or claim any sign-off. Nothing is approved until a
> person has read and approved the specific items below.

**Batch:** B1 — Foundations (ledger `reviewBatch: 1`).
**Scope:** 15 lessons = 10 *Programming foundations* + 5 *DSA foundations*.
**Base commit:** branched from `main` = `ec47328` (PR #22 merged); corrections on
branch `fix/b1-corrections`.
**What "review" means here (per AGENTS.md):** confirm the learner-facing content
is factually correct, the explanation/vocabulary/complexity/`expectedOutput`
agree with real CPython-3.14 behaviour, exercises are correct and well-posed, and
prerequisites are introduced before use.

> **Update — the 4 flagged findings have been FIXED (test-first).** The four
> items that carried a concern (`representations`, `loops`, `functions`,
> `variables-and-types`) were corrected on this branch and are backed by a new
> regression suite `src/content/b1-corrections.facts.test.ts` (97 tests). Their
> content hashes changed (new values in the table below); they remain
> `semanticReview: false` like the rest. The fixes do **not** constitute sign-off
> — a human still reviews and approves every item. See "Fix log" per item.
>
> **Machine verification on this branch:** `npm run check:all` → exit 0 (unit
> **573** passed; model solutions **161/161**; R6.4 mistake-rejection all five
> categories **161/161**; coverage-evidence **131 verified / 0 not-yet**;
> recognition **164**; hints **325**; all **131** lesson outputs match).
> `npm run test:browser` → **18 passed / 5 skipped** (the 5 skips are
> `P-RUNNER-ORIGIN`). All **160** items remain `semanticReview: false`.

**How to sign off AFTER you approve items** (set the env vars BEFORE the script):

```bash
# List ONLY the ids you actually approved (comma-separated, "lesson:<id>"):
REVIEWED_NOW="lesson:expressions,lesson:conditions" SIGNOFF_DATE="2026-10-02" \
  node --experimental-strip-types --import ./scripts/lib/ts-register.mjs \
  scripts/gen_review_ledger.mjs
node --experimental-strip-types --import ./scripts/lib/ts-register.mjs \
  scripts/codemod_add_evidence.mjs
# then commit. Items not listed stay semanticReview:false.
```

The reviewed hash is pinned per item, so any later content edit reverts that item
to pending automatically.

---

## B1 item index (exact IDs, current hash, exercises)

Each lesson's full source is at `src/content/lessons/<id>.ts`. "fixed" marks the
four items corrected on this branch (new hash shown).

| # | Lesson ID | File | Title | contentHash | Exercises |
|---|---|---|---|---|---|
| 1 | `variables-and-types` | `src/content/lessons/variables-and-types.ts` | Variables and Types | `8af5048a0e87e562` *(fixed)* | vt-predict-1, vt-fix-1, vt-choose-1 |
| 2 | `expressions` | `src/content/lessons/expressions.ts` | Expressions and Operators | `f143fe2cdd58cb0a` | expr-predict-1, expr-choose-1 |
| 3 | `conditions` | `src/content/lessons/conditions.ts` | Conditions (if/elif/else) | `9c63d07d9bb2235d` | cond-fix-1, cond-predict-1 |
| 4 | `loops` | `src/content/lessons/loops.ts` | Loops (for and while) | `60a8b338e1b51036` *(fixed)* | loop-fix-1, loop-complete-1 |
| 5 | `functions` | `src/content/lessons/functions.ts` | Functions | `fb3892f19f580d34` *(fixed)* | func-complete-1, func-predict-1 |
| 6 | `scope` | `src/content/lessons/scope.ts` | Scope (Local vs Global) | `784f6b28a2aed1d6` | scope-predict-1, scope-choose-1 |
| 7 | `io` | `src/content/lessons/io.ts` | Input and Output | `9ec7390e15aa8128` | io-fix-1, io-predict-1 |
| 8 | `references-mutation` | `src/content/lessons/references-mutation.ts` | References and Mutation | `5feb2cad2643ea0c` | ref-predict-1, ref-fix-1 |
| 9 | `classes` | `src/content/lessons/classes.ts` | Classes and Objects | `8693b395b5881198` | class-complete-1, class-predict-1 |
| 10 | `errors` | `src/content/lessons/errors.ts` | Errors and Exceptions | `c144f84f8a9c03e1` | err-complete-1, err-choose-1 |
| 11 | `representations` | `src/content/lessons/representations.ts` | Representations of Data | `6f9911863af4840e` *(fixed)* | repr-choose-1, repr-predict-1 |
| 12 | `complexity` | `src/content/lessons/complexity.ts` | Time and Space Complexity | `448bbae5526f4263` | cx-predict-1, cx-choose-1 |
| 13 | `cases` | `src/content/lessons/cases.ts` | Best, Average, and Worst Cases | `1f31f7d42bd2adc4` | cases-predict-1, cases-choose-1 |
| 14 | `amortized` | `src/content/lessons/amortized.ts` | Amortized Cost | `5b23a0c6bd8b3a52` | amort-predict-1, amort-choose-1 |
| 15 | `correctness` | `src/content/lessons/correctness.ts` | Correctness and Invariants | `9db456b486337f4e` | correct-fix-1, correct-predict-1 |

Prerequisite chain (introduced before use): variables-and-types → expressions →
conditions → loops → functions → scope → io → references-mutation → classes →
errors; DSA: representations (needs variables), complexity (needs loops+functions),
cases (needs complexity), amortized (needs complexity+cases), correctness (needs
loops). No forward references found.

---

## Per-lesson review notes (agent read-through of the full learner-facing content)

Each entry summarises the teaching content, the program + its `expectedOutput`,
and my assessment. "Concern" = something a human should look at before approving;
"No blocking concern" = I found the content factually correct and well-posed, but
your approval is still required.

### 1. `variables-and-types` — Variables and Types  — hash `8af5048a0e87e562`
- **Teaches:** names refer to objects; dynamic typing; `int/float/str/bool/None`;
  **aliasing** and **identity**. The program now binds `best = scores`, prints
  `best is scores` (**True**, same object), appends through `best`, then makes a
  copy `independent = list(scores)` and prints `independent is scores`
  (**False**, different object).
  `expectedOutput: "True\nFalse\nAda 42.5 True None\n[10, 20, 30, 40]\n"`.
- **Assessment:** factually correct — int unlimited precision, bool subtype of
  int, None a singleton, and the `is` (identity) vs `==` (equality) distinction
  all correct. Exercises correct.
- **Fix log (was: aliasing not shown visually):** the program now demonstrates
  identity explicitly with `is`, and **both** aliasing names plus the copy are
  bound (`scores`, `best`, `independent`), so the recorded snapshot shows the
  equal reference id for the aliases and a different id for the copy. Identity is
  read from the trace's reference ids — the learner's code is NOT re-executed to
  infer it. Guarded by `b1-corrections.facts.test.ts` ("teaches identity from the
  snapshot").
- **For the reviewer:** confirm the identity framing (`is` vs `==`) reads clearly
  for a first-time learner and that showing a copy alongside the alias is helpful
  rather than busy.

### 2. `expressions` — Expressions and Operators
- **Teaches:** precedence; `/` (float) vs `//` (floor) vs `%` (remainder) vs `**`;
  parentheses. `expectedOutput: "14 20 2\n3 32 2.5\n"`.
- **Assessment:** correct, incl. the subtle `-1 % 5 == 4` (Python modulo follows
  the divisor's sign) in the edge-cases note, and `ZeroDivisionError`. Exercises
  correct. **No blocking concern.**

### 3. `conditions` — Conditions (if/elif/else)
- **Teaches:** first-true-branch wins, order matters, `==` vs `=`, comparison
  operators. `expectedOutput: "hot\n"`.
- **Assessment:** correct. `cond-fix-1` cleanly demonstrates the broad-test-first
  ordering bug and its fix. **No blocking concern.**

### 4. `loops` — Loops (for and while)  — hash `60a8b338e1b51036`
- **Teaches:** for = once per item, while = until condition false, accumulator,
  infinite loop. `expectedOutput: "27\n0\n1\n2\n"` (unchanged — code unchanged).
- **Assessment:** prose, complexity, and exercises (`loop-fix-1` missing
  increment; `loop-complete-1` count_evens) all correct.
- **Fix log (was: false array pointer):** the `nums` binding previously carried
  `{ role: "pointer", label: "x-index", source: "i" }`. Because the renderer maps
  an overlay's `source` value to an array index, this highlighted `nums[i]` using
  the **unrelated while-loop counter** `i` (0,1,2) — a position that has nothing
  to do with the `for x in nums` loop. The overlay was **removed** (nums now has
  no index overlay); the loop value `x` and the counter `i` are shown directly in
  the variables panel from the recorded frame. A new general guard in
  `b1-corrections.facts.test.ts` asserts **every** overlay `source` across all
  lessons names a variable that actually appears in that lesson's code, so this
  class of bug can't ship silently again.
- **For the reviewer:** confirm you're comfortable that the array view carries no
  pointer here (the for-loop walks values, not indices).

### 5. `functions` — Functions  — hash `fb3892f19f580d34`
- **Teaches:** `def`, parameters vs arguments, `return`, None-on-no-return,
  per-call frame + the call stack. `expectedOutput: "7\n"` (unchanged).
- **Assessment:** correct, incl. "default parameter values evaluated once at
  definition time." Exercises correct.
- **Fix log (was: recursion label on a scalar):** the binding was
  `{ variable: "answer", model: "recursion" }`. The `recursion` model IS the
  call-stack visualizer (it reads the recorded frames and ignores the bound
  variable, titling itself "call stack"), so the renderer was fine — but naming
  the binding after the scalar result `answer` and the word "recursion" wrongly
  implied this non-recursive example demonstrates recursion. The binding now
  names the traced function (`{ variable: "add", model: "recursion" }`), a code
  comment documents that `recursion` is the call-stack model, and the prose's one
  stray recursion-definition was reworded. The call stack genuinely shows a frame
  appearing on the call to `add` and disappearing on return (call + return frames
  verified by `verify:lessons`, 9 events). Guarded by `b1-corrections.facts.test.ts`
  ("uses a call-stack binding, not recursion-on-answer").
- **Minor (unchanged):** single reference (Python docs); a second independent
  source would strengthen it. Left for your call.

### 6. `scope` — Scope (Local vs Global)
- **Teaches:** local vs global, shadowing, `global` keyword, `UnboundLocalError`.
  `expectedOutput: "1\n10\n"`.
- **Assessment:** correct, incl. the read-then-assign `UnboundLocalError` edge
  case and the recommendation to prefer returning values over `global`. Exercises
  correct. **Concern (minor):** single reference only.

### 7. `io` — Input and Output
- **Teaches:** `input()` returns str (the `"5" * 2 == "55"` trap), `int()`/`float()`
  conversion, `print` spacing/newline. Uses `stdin: "Ada\n5\n"`;
  `expectedOutput: "Name: Number: Hello Ada\n10\n"` (prompts echo to stdout in
  this workspace — noted in the file header).
- **Assessment:** correct; the prompt-echo behaviour is explained so the output
  is not surprising. `io-fix-1` (convert text with `int`) correct. **No blocking
  concern** (confirm the prompt-echo note is acceptable for learners).

### 8. `references-mutation` — References and Mutation
- **Teaches:** call-by-object-sharing; **mutation** (visible to caller) vs
  **rebinding** (not). `expectedOutput: "[1, 2, 3]\n5\n"`.
- **Assessment:** one of the strongest items — the mutation/rebinding distinction
  is exactly right; `ref-fix-1` (work on `list(lst)` copy) correct. **No blocking
  concern.**

### 9. `classes` — Classes and Objects
- **Teaches:** class/instance, `__init__`, `self`, attributes, methods, per-instance
  state; notes the mutable-class-level-default trap. `expectedOutput: "12\n"`.
- **Assessment:** correct; exercises (`class-complete-1` reset, `class-predict-1`)
  correct.
- **Concern (minor, wording):** `codeExplanations` for line 11 reads "Comment
  continues (or blank)." — vague; a human may want a precise line description.
  Single reference only.

### 10. `errors` — Errors and Exceptions
- **Teaches:** exceptions, `try/except` by specific type, continuation after a
  handled exception, catch-specific-not-broad, `finally`.
  `expectedOutput: "caught: index out of range\nafter\n"`.
- **Assessment:** correct; `err-complete-1` (safe_div / ZeroDivisionError) and
  `err-choose-1` (KeyError vs `in`) both correct and balanced. **No blocking
  concern.**

### 11. `representations` — Representations of Data  — hash `6f9911863af4840e`
- **Teaches:** one small graph (nodes 0,1,2 with edges 0–1, 0–2, 1–2) in two
  **genuinely equivalent** encodings — an **edge list**
  `[(0, 1), (0, 2), (1, 2)]` and an **adjacency map** `{0: {1,2}, 1: {0,2}, 2: {0,1}}`.
  The program rebuilds the connection set from EACH (normalising edges as
  `(min, max)`) and prints that they are equal.
  `expectedOutput: "True\n[(0, 1), (0, 2), (1, 2)]\n"`.
- **Assessment:** teaching is correct; complexity table now describes both
  representations (edge-list O(E) iteration; adjacency-map expected O(1) neighbour
  lookup; O(V+E) space). Two credible references (ODS, Runestone graphs).
- **Fix log (was: two NON-equivalent examples):** the old program showed
  `as_list = [0, 1, 1, 0]` and `as_dict = {0: [1], 1: [0]}` framed as "the same
  information," but they encoded different relationships. Replaced with the edge
  list + adjacency map of one graph, and the program itself **proves
  equivalence** (prints `True`) by reconstructing and comparing the connection
  set from each. Bindings (`edges` array, `adj` dict), explanations, prediction,
  complexity, and prose were all updated together. Guarded by
  `b1-corrections.facts.test.ts` ("shows two EQUIVALENT encodings", incl. a check
  that the program prints the equality proof).
- **For the reviewer:** confirm the edge-list/adjacency framing is appropriate at
  foundations level (the dedicated `graph-representations` lesson later goes
  deeper into adjacency list vs matrix).

### 12. `complexity` — Time and Space Complexity
- **Teaches:** Big-O (O(1)/O(n)/O(n²)), input size n, time vs auxiliary space;
  sequential-loops-add vs nested-multiply; worst/avg/best. `find_max` single scan.
  `expectedOutput: "9\n"`.
- **Assessment:** correct; two credible references (Runestone, MIT OCW).
  `cx-predict-1` (sequential = O(n)) and `cx-choose-1` (unsorted max is O(n)
  optimal) correct. **No blocking concern.** (Pedantic: the scan compares
  `nums[0]` to itself, so it is n comparisons; the lesson says "about n," which is
  fine.)

### 13. `cases` — Best, Average, and Worst Cases
- **Teaches:** best/avg/worst, early exit, "state the case," worst-case as the
  guarantee. Linear search. `expectedOutput: "True\nFalse\n"`.
- **Assessment:** correct, incl. average ≈ n/2 → O(n) and the adversarial-input
  recognition exercise (`cases-choose-1`). **No blocking concern.**

### 14. `amortized` — Amortized Cost
- **Teaches:** amortized O(1) append via geometric growth, rare O(n) resize,
  amortized ≠ average-over-random, n appends = O(n) total.
  `expectedOutput: "[0, 1, 2, 3, 4]\n5\n"`.
- **Assessment:** correct and careful (explicitly distinguishes amortized from
  average, and "amortized O(1) ≠ every call O(1)"); two references (CPython FAQ,
  ODS). Exercises correct. **No blocking concern.**

### 15. `correctness` — Correctness and Invariants
- **Teaches:** loop invariant (init/maintenance/termination), base/edge cases,
  termination, precondition. `sum_to(n)`. `expectedOutput: "15\n0\n"`.
- **Assessment:** correct; invariant stated and used properly; `correct-fix-1`
  (off-by-one `< n` → `<= n`) and `correct-predict-1` (n=0 edge) correct. **No
  blocking concern.**

---

## Summary for the reviewer

- **The 4 previously-flagged findings are now fixed** (test-first) and
  regression-guarded: `representations` (equivalent encodings), `loops` (false
  pointer removed), `functions` (call-stack binding/label), `variables-and-types`
  (identity shown from the snapshot). All four still read `semanticReview: false`.
- **The other 11 items** were found factually correct with no blocking concern:
  `expressions`, `conditions`, `io`, `references-mutation`, `errors`,
  `complexity`, `cases`, `amortized`, `correctness`, `scope`, `classes`.
- **Minor, non-blocking (your call):** `functions`, `scope`, `classes` each cite a
  single reference; a second independent source would strengthen them. `classes`
  `codeExplanations` line 11 ("Comment continues (or blank).") is vague wording.
- **No sign-off has been performed.** These assessments are an AI read-through to
  help you; approval requires your own reading per item.

## Reviewer checklist (per item)

For each lesson, open `src/content/lessons/<id>.ts` and confirm, then record your
decision. Approve only the ids you personally verified.

Per-item checks:
- [ ] Explanation + vocabulary are factually correct for CPython 3.14.
- [ ] `code` + `expectedOutput` agree (also machine-checked by `verify:lessons`).
- [ ] `codeExplanations` cover every line and are accurate.
- [ ] `complexity` / `complexityExplanation` claims are right (cases, bounds).
- [ ] Exercises are correct, unambiguous, and solvable from what was taught.
- [ ] Visual `bindings`/overlays describe what the program actually does.
- [ ] Prerequisites are introduced before use.

Progress ledger (fill in as you review):

| # | Lesson ID | Reviewed? | Approve / hold | Notes |
|---|---|---|---|---|
| 1 | `variables-and-types` (fixed) | ☐ | ☐ | identity via `is`; copy vs alias |
| 2 | `expressions` | ☐ | ☐ | |
| 3 | `conditions` | ☐ | ☐ | |
| 4 | `loops` (fixed) | ☐ | ☐ | no array pointer now |
| 5 | `functions` (fixed) | ☐ | ☐ | call-stack binding; single ref |
| 6 | `scope` | ☐ | ☐ | single ref |
| 7 | `io` | ☐ | ☐ | prompt-echo note |
| 8 | `references-mutation` | ☐ | ☐ | |
| 9 | `classes` | ☐ | ☐ | single ref; line-11 wording |
| 10 | `errors` | ☐ | ☐ | |
| 11 | `representations` (fixed) | ☐ | ☐ | edge list vs adjacency map |
| 12 | `complexity` | ☐ | ☐ | |
| 13 | `cases` | ☐ | ☐ | |
| 14 | `amortized` | ☐ | ☐ | |
| 15 | `correctness` | ☐ | ☐ | |

**To sign off the ids you approve** (env vars BEFORE the script; see the command
near the top of this file). Items you do not list stay `semanticReview: false`.
Nothing here is signed off until you run that command yourself.
