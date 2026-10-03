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

> **Update — the 4 flagged findings have been FIXED (test-first), then DEEPENED
> after a second review pass.** The four items that carried a concern
> (`representations`, `loops`, `functions`, `variables-and-types`) were corrected
> on this branch and are backed by regression tests. Their content hashes changed
> (new values in the table below); they remain `semanticReview: false` like the
> rest. The fixes do **not** constitute sign-off — a human still reviews and
> approves every item. See "Fix log" per item.
>
> **Amendment 3 (this round) — deeper fixes from the second review:**
> - *representations:* the "break it" experiment now uses a **genuinely new edge**
>   `(0, 3)` (adding an existing edge to a set changes nothing); the stated edit
>   makes the equality print **False**. The program no longer sorts (prints a
>   count), so complexity carries **no O(E log E)** term; complexity now
>   distinguishes the **expected-O(1) keyed reach** from the **O(degree)
>   enumeration** of neighbours; and the **assumptions** for equivalence
>   (undirected, no self-loops, no duplicate edges, same node set) are stated.
> - *representations prerequisites:* now also requires **`loops`** (it uses a
>   nested `for`), and the program was rewritten with **plain for-loops** (no set
>   comprehensions); new vocabulary explains `set` and `nested loop`.
> - *variables-and-types / aliasing:* aliasing is now **visible in the rendered
>   UI** — the array view labels that `scores` and `best` are one shared object
>   (and a copy is not), driven purely by recorded reference ids. Proven by a
>   **rendered** test (`src/visualizers/ArrayVisualizer.aliasing.test.tsx`), not
>   by the printed `is` alone.
> - *overlay guard:* the general "source names a real variable" check is now
>   labelled **necessary-not-sufficient** (it would NOT have caught the old `i`
>   pointer); a **semantic trace/render** test
>   (`src/visualizers/loops.overlay.real.test.tsx`) renders the loops `nums`
>   binding over the real recorded trace and asserts no cell is ever highlighted,
>   with a **positive control** proving the old `source: "i"` overlay WOULD have
>   lit a false cell.
>
> **Amendment 4 (this round) — corrections from the third review:**
> - *representations complexity (reach vs enumerate):* the adjacency row that
>   wrongly gave O(degree) as the *worst case for reaching* the set is split into
>   **two rows** — "reach a node's neighbour set" (a dict lookup: average **O(1)**,
>   worst case **O(V)** under hash collisions) and "enumerate a node's neighbours"
>   (**O(degree)** in all cases, set iteration). The overall program bound is now
>   labelled **`case: "expected"`** O(V + E) — not strict worst case — because the
>   derivation relies on expected-O(1) dict/set ops, with a worst-case
>   `otherCases` note (superlinear under adversarial collisions). Case labels are
>   grounded in the Python **TimeComplexity** reference (dict/set lookup: average
>   O(1), amortized worst O(n)), now cited on the lesson and in `docs/references.md`.
> - *representations equality scope:* the "would break it" / "edit one shape alone
>   → False" claims are replaced. The check compares **normalised edge sets** and
>   is **not a general graph-equivalence validator**: it does not verify vertex
>   sets, reciprocity, or edge multiplicity, so some assumption violations (a
>   parallel/duplicate edge, a non-reciprocal entry, an isolated extra node) can
>   **still print `True`** — confirmed by a probe on the bundled runtime. New
>   vocabulary ("Normalised edge set", "Not a general validator") and reworded
>   explanation/edgeCases/review/commonMistakes make the distinction beginner-clear.
> - *aliasing integration test:* the hand-built aliasing fixtures are relabelled
>   as **synthetic unit tests**; a new **integration** test
>   (`src/visualizers/aliasing.real.test.tsx`) runs the actual `variables-and-types`
>   lesson through the **bundled tracer**, selects the real states before aliasing,
>   after `best = scores`, and after `independent = list(scores)`, and renders the
>   visualizer from those states — asserting the shared-object label from genuine
>   recorded reference ids.
> - *references index:* a claim-specific **`### dsa/representations`** entry was
>   added to `docs/references.md` (ODS, Runestone graphs vocabulary, Python
>   TimeComplexity), as AGENTS.md requires beyond the lesson's own `references`.
>
> **Amendment 5 (this round) — reference accuracy + an honest evidence date:**
> - *references now match what each page supports (checked against the live
>   pages):* the **Open Data Structures homepage** is replaced with the exact
>   consulted chapter **`ods-python/12_Graphs.html`** (which states a graph is
>   `G=(V,E)` with two standard representations). The **Runestone 7.2 Vocabulary**
>   page is kept **only** for the graph-vocabulary claim it actually supports (it
>   does not cover adjacency representations or lookup costs). The adjacency /
>   neighbour-lookup claim now cites **Runestone 7.5 An Adjacency List**, and the
>   representation **trade-off** claim cites **Runestone 7.3 The Graph ADT**. Each
>   `verifiedClaims` entry was narrowed to match its page. `docs/references.md`
>   was updated to the same URLs and claims.
> - *evidence date is no longer hard-coded:* `scripts/codemod_add_evidence.mjs`
>   previously stamped a fixed `verifiedAt: "2026-09-21"` on **every** item each
>   run. It now records the **actual** run date (via `resolveToday`, overridable
>   with `VERIFIED_DATE`) and only for items whose content hash is NEW or CHANGED;
>   an unchanged item **keeps** its prior date (`verifiedAtFor`). So this run
>   re-dated **only `representations`** → `2026-10-02`; the other **159** items
>   kept `2026-09-21` (no bulk re-dating). Regression test:
>   `src/content/evidence-date.test.ts`.
>
> **Amendment 6 (this round) — correct the stale date on the other reverified B1
> lessons:** diffing all lessons this PR changed against `main` showed that
> `functions`, `loops`, and `variables-and-types` carried **new content hashes**
> but still had the old hard-coded **`verifiedAt: "2026-09-21"`** (only
> `representations` had been re-dated in Amendment 5). Their actual B1
> verification date is **`2026-10-03`** — established from the git history (the
> commits that introduced their current content, `1acd90c` and `b113559`, are
> dated 2026-10-03) and confirmed by **reverifying all three now**
> (`verify:lessons`: functions 9 events, loops 23, variables-and-types 15 — all
> outputs match). Their `verifiedAt` is corrected to `2026-10-03`. Nothing else
> was touched: the other **156** items keep `2026-09-21`, `representations` keeps
> `2026-10-02`, no content hash changed, and no `semanticReview` flag changed.
> Re-running the evidence generator **preserves** these corrected dates (the
> `verifiedAtFor` rule keeps the prior date when the content hash is unchanged).
> B1 reverified-date summary: `representations` 2026-10-02; `functions`, `loops`,
> `variables-and-types` 2026-10-03.
>
> **Amendment 7 (Group 1 follow-up — on branch `fix/b1-group1-followup`, off
> merged main `ce2339b`):** the reviewer read the full Group 1 lessons and found
> specific claims to correct (not guessed alternatives). All fixed test-first
> (`src/content/b1-group1-followup.facts.test.ts`, 15 cases) and reverified on the
> bundled runtime (outputs unchanged):
> - *variables-and-types* — stop claiming a literal "creates"/"freshly creates" a
>   new int object (CPython reuses small ints); the copy length `k` is **4** (the
>   append runs before `list(scores)`), not 3; the worst-case time section now
>   notes the append's O(k) resize and that `print(scores)` is also O(k), so the
>   copy is not the only size-dependent step (overall O(k) kept).
> - *expressions* — `//` **floors the quotient** and the result type follows the
>   operands (`7 // 2 == 3` int, `7.0 // 2 == 3.0` float); the "`/` → float" claim
>   is scoped to int/float operands, not universal.
> - *loops* — separate the for-loop O(n), n = len(nums), from the displayed while
>   which is **O(1)** (fixed limit 3, independent of n); `case: worst` kept
>   (sequential O(n)+O(1)); a generalized while bound uses a separate variable
>   `m`; the Runestone book-index reference is replaced with the exact Accumulator
>   Pattern page and the Python reference section/URL pairing is fixed.
> - *functions* — remove the unrestricted "regardless of the values passed" /
>   "any numeric inputs" claims (Python ints are arbitrary precision); keep O(1)
>   `case: worst` for the small fixed-size operands and state that assumption;
>   add the Python Numeric Types reference.
> - Amendment-7 hashes (superseded for expressions/functions by Amendment 8
>   below): variables-and-types `769b36aaf693d104`, loops `ff5a1658e037ec10`
>   (unchanged since); expressions and functions were re-touched in Amendment 8.
>   All B1-fixed items re-dated `2026-10-03` (the other 155 keep 2026-09-21,
>   `representations` keeps 2026-10-02). **No `semanticReview` flag changed.**
>
> **Amendment 8 (this round — reviewer's narrower findings on PR #24):**
> - *expressions* — scope EVERY learner-facing "`/` yields a float" claim to the
>   built-in **int/float** operands taught (vocabulary, `expr-predict-1` expected
>   + hints, and the reference `verifiedClaims`), since **complex** operands give
>   a complex. New regression `src/content/b1-group1-expr-fn.facts.test.ts`
>   checks those fields and verifies the complex counterexample
>   `(1 + 2j) / (1 + 1j) → complex` on the bundled runtime; the standard output
>   `14 20 2\n3 32 2.5\n` is preserved. New hash `d2d21f9a9f3353b0`.
> - *functions* — the Numeric Types page establishes only **unlimited-precision
>   integers**, so its `verifiedClaims` is narrowed to that; the **O(d)** addition
>   cost is now presented as the lesson's **own derived** complexity reasoning,
>   not a claim quoted from the page. New hash `34076dce4cf0d3ba`.
> - Only expressions and functions were re-hashed/re-dated this round; the other
>   158 items are untouched. **No `semanticReview` flag changed; still 0 sign-offs.**
>
> **Machine verification (branch `fix/b1-group1-followup`, Amendment 8 head):**
> `npm run check:all` → exit 0 (unit **629** passed across **45** files; model
> solutions **161/161**; R6.4 mistake-rejection all five categories **161/161**;
> coverage-evidence **131 verified / 0 not-yet**; recognition **164**; hints
> **325**; all **131** lesson outputs match). **`npm run test:browser`:** the
> only recorded browser run (18 passed / 5 skipped) was on an EARLIER commit
> (`45f3c40`); it is a **prior-commit result**, not proof that this amendment's
> rendered output is unchanged — **lesson text IS rendered in the browser**, and
> this round edits learner-facing text. A fresh `test:browser` run on this
> amendment's head is recorded in the PR; see the PR comment / commit for its
> result SHA. All **160** items remain `semanticReview: false`.

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
| 1 | `variables-and-types` | `src/content/lessons/variables-and-types.ts` | Variables and Types | `769b36aaf693d104` *(fixed)* | vt-predict-1, vt-fix-1, vt-choose-1 |
| 2 | `expressions` | `src/content/lessons/expressions.ts` | Expressions and Operators | `d2d21f9a9f3353b0` *(fixed)* | expr-predict-1, expr-choose-1 |
| 3 | `conditions` | `src/content/lessons/conditions.ts` | Conditions (if/elif/else) | `9c63d07d9bb2235d` | cond-fix-1, cond-predict-1 |
| 4 | `loops` | `src/content/lessons/loops.ts` | Loops (for and while) | `ff5a1658e037ec10` *(fixed)* | loop-fix-1, loop-complete-1 |
| 5 | `functions` | `src/content/lessons/functions.ts` | Functions | `34076dce4cf0d3ba` *(fixed)* | func-complete-1, func-predict-1 |
| 6 | `scope` | `src/content/lessons/scope.ts` | Scope (Local vs Global) | `784f6b28a2aed1d6` | scope-predict-1, scope-choose-1 |
| 7 | `io` | `src/content/lessons/io.ts` | Input and Output | `9ec7390e15aa8128` | io-fix-1, io-predict-1 |
| 8 | `references-mutation` | `src/content/lessons/references-mutation.ts` | References and Mutation | `5feb2cad2643ea0c` | ref-predict-1, ref-fix-1 |
| 9 | `classes` | `src/content/lessons/classes.ts` | Classes and Objects | `8693b395b5881198` | class-complete-1, class-predict-1 |
| 10 | `errors` | `src/content/lessons/errors.ts` | Errors and Exceptions | `c144f84f8a9c03e1` | err-complete-1, err-choose-1 |
| 11 | `representations` | `src/content/lessons/representations.ts` | Representations of Data | `d145cc3190c48bc8` *(fixed)* | repr-choose-1, repr-predict-1 |
| 12 | `complexity` | `src/content/lessons/complexity.ts` | Time and Space Complexity | `448bbae5526f4263` | cx-predict-1, cx-choose-1 |
| 13 | `cases` | `src/content/lessons/cases.ts` | Best, Average, and Worst Cases | `1f31f7d42bd2adc4` | cases-predict-1, cases-choose-1 |
| 14 | `amortized` | `src/content/lessons/amortized.ts` | Amortized Cost | `5b23a0c6bd8b3a52` | amort-predict-1, amort-choose-1 |
| 15 | `correctness` | `src/content/lessons/correctness.ts` | Correctness and Invariants | `9db456b486337f4e` | correct-fix-1, correct-predict-1 |

Prerequisite chain (introduced before use): variables-and-types → expressions →
conditions → loops → functions → scope → io → references-mutation → classes →
errors; DSA: representations (needs variables + loops), complexity (needs loops+functions),
cases (needs complexity), amortized (needs complexity+cases), correctness (needs
loops). No forward references found.

---

## Per-lesson review notes (agent read-through of the full learner-facing content)

Each entry summarises the teaching content, the program + its `expectedOutput`,
and my assessment. "Concern" = something a human should look at before approving;
"No blocking concern" = I found the content factually correct and well-posed, but
your approval is still required.

### 1. `variables-and-types` — Variables and Types  — hash `769b36aaf693d104` · verified 2026-10-03
- **Teaches:** names refer to objects; dynamic typing; `int/float/str/bool/None`;
  **aliasing** and **identity**. The program binds `best = scores`, prints
  `best is scores` (**True**, same object), appends through `best`, then makes a
  copy `independent = list(scores)` and prints `independent is scores`
  (**False**, different object).
  `expectedOutput: "True\nFalse\nAda 42.5 True None\n[10, 20, 30, 40]\n"`.
- **Assessment:** factually correct — int unlimited precision, bool subtype of
  int, None a singleton, and the `is` (identity) vs `==` (equality) distinction
  all correct. Exercises correct.
- **Fix log (was: aliasing not shown visually):** the program demonstrates
  identity explicitly with `is`, and **both** aliasing names plus the copy are
  bound (`scores`, `best`, `independent`). **Amendment 3 makes aliasing visible in
  the RENDERED UI**, not just via the printed `is`: the array view now draws a
  "**= same object as best (one shared list)**" label on `scores`/`best` because
  their recorded reference ids are equal, and draws **no** such label on
  `independent` (a different id). This is computed purely from the snapshot
  (`aliasNames` in `src/visualizers/helpers.ts`) — the learner's code is never
  re-executed. Proven at two levels: synthetic **unit** fixtures in
  `src/visualizers/ArrayVisualizer.aliasing.test.tsx` (clean cases) and —
  **amendment 4** — a real **integration** test
  `src/visualizers/aliasing.real.test.tsx` that runs the actual lesson through the
  bundled tracer and renders the visualizer from the genuine recorded states
  before aliasing, after `best = scores`, and after `independent = list(scores)`.
  The unit file's docstring was corrected to say it uses synthetic fixtures (it
  had described them as real tracer states). The lesson prose names the on-screen
  label.
- **Fix log — Group 1 follow-up (reviewer findings):** (a) the explanation and
  line-2 note said Python "creates the integer object 42" and the derivation
  called the bindings "freshly created objects" — corrected, since CPython may
  **reuse a cached small int**; now the literal *evaluates to* an int object the
  name is *bound to* (small-int reuse noted, cites Python int docs). (b) The copy
  length `k` was described as "here 3", but `best.append(40)` runs **before**
  `list(scores)`, so the copy has **4** elements — fixed. (c) The `case: worst`
  time section treated the single append as the only size-dependent step; it now
  notes the append's **O(k) resize** worst case AND that **`print(scores)` also
  displays k elements**, so the copy is not the only size-dependent step. Overall
  bound stays **O(k)**; derivation corrected.
- **For the reviewer:** confirm the identity framing (`is` vs `==`) and the
  on-screen "same object" label read clearly for a first-time learner.

### 2. `expressions` — Expressions and Operators  — hash `d2d21f9a9f3353b0` · verified 2026-10-03
- **Teaches:** precedence; `/` (float) vs `//` (floor) vs `%` (remainder) vs `**`;
  parentheses. `expectedOutput: "14 20 2\n3 32 2.5\n"`.
- **Assessment:** correct, incl. the subtle `-1 % 5 == 4` (Python modulo follows
  the divisor's sign) in the edge-cases note, and `ZeroDivisionError`. Exercises
  correct.
- **Fix log — Group 1 follow-up (reviewer findings):** `//` was described only as
  "integer (floor) division → a whole number", which is true for the shown
  `int//int` case but hides that a float operand yields a float. Now: `//` **floors
  the quotient** and its result type follows the operands — `7 // 2 == 3` (int)
  but `7.0 // 2 == 3.0` (float), verified on the bundled runtime. The
  "`/` always gives a float" claim is now **scoped to the int/float operands
  taught** (with a note that a custom class can define these operators), rather
  than a universal claim; the reference `verifiedClaims` were scoped to match.
- **Fix log — Amendment 8 (reviewer: scope EVERY '/' float claim):** the
  remaining learner-facing "`/` yields a float" wordings still said "of numbers" /
  "on numbers", which is too broad — **complex** operands yield a complex, not a
  float. All four were narrowed to the **built-in int/float operands taught**: the
  `True division (/)` vocabulary entry, the `expr-predict-1` **expected** answer
  and its **hints**, and the reference `verifiedClaims`. A regression
  (`src/content/b1-group1-expr-fn.facts.test.ts`) checks those exact fields AND
  verifies on the bundled runtime that `(1 + 2j) / (1 + 1j)` is a **complex**
  (counterexample), while the standard example's output `14 20 2\n3 32 2.5\n` is
  preserved. New hash `d2d21f9a9f3353b0`.
- **Teaches:** first-true-branch wins, order matters, `==` vs `=`, comparison
  operators. `expectedOutput: "hot\n"`.
- **Assessment:** correct. `cond-fix-1` cleanly demonstrates the broad-test-first
  ordering bug and its fix. **No blocking concern.**

### 4. `loops` — Loops (for and while)  — hash `ff5a1658e037ec10` · verified 2026-10-03
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
  the variables panel from the recorded frame.
- **Fix log — overlay guard strengthened (amendment 3):** the first-round guard
  only checked that an overlay `source` NAMES a variable in the code. That is
  **necessary but not sufficient** — it would NOT have caught this bug, because
  `i` IS a real variable. It is now labelled as such, and the real property is
  enforced **semantically**: `src/visualizers/loops.overlay.real.test.tsx` runs
  the loops program through the real tracer and renders the `nums` binding over
  **every** recorded step, asserting **no cell is ever highlighted** and no
  pointer label is drawn. A **positive control** in the same file rebuilds the old
  `{ source: "i" }` overlay and asserts it WOULD have lit a false cell — proving
  the check has teeth.
- **Fix log — Group 1 follow-up (reviewer findings):** the complexity folded the
  two **sequential, independent** loops under one symbol `n` and implied the
  displayed `while` scales with `n`. Corrected: `n = len(nums)` drives the
  **for** loop (O(n)); the displayed **while** has the fixed limit 3, so it is
  **O(1)** here, independent of `n`. The program stays **`case: worst` O(n)**
  (sequential O(n) + O(1)). A *generalized* while bound is now a **separate
  variable `m`** (O(n + m)), not conflated with `n`. References fixed: the
  Runestone **book-index** link was replaced with the exact **fopp Accumulator
  Pattern** page, and the Python reference section was cleaned to **"4.2 for
  Statements"** (dropping the muddled `introduction.html` mix) — both verified on
  the live pages.
- **For the reviewer:** confirm you're comfortable that the array view carries no
  pointer here (the for-loop walks values, not indices).

### 5. `functions` — Functions  — hash `34076dce4cf0d3ba` · verified 2026-10-03
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
- **Fix log — Group 1 follow-up (reviewer findings):** the time analysis claimed
  the cost is constant "**regardless of the values passed**" and the
  `fixedDataNote` said "add would still be O(1) per call for **any numeric
  inputs**." Both overclaims are removed: Python `int` is **arbitrary precision**,
  so adding d-digit integers is O(d). The bound stays **O(1), `case: worst`** for
  the displayed small, machine-word-sized operands (2 and 5), now stated as an
  explicit assumption, with the large-integer caveat. A second reference (Python
  **Numeric Types** docs) was added — which also resolves the earlier
  single-reference nit.
- **Fix log — Amendment 8 (reviewer: O(d) is derived, not quoted):** the Numeric
  Types page directly establishes only that Python `int` has **unlimited
  precision**, so its `verifiedClaims` is narrowed to exactly that ("no fixed
  width / no overflow"). The **O(d) addition cost** is now presented as the
  lesson's **own derived complexity reasoning** from that fact (the assumptions
  note reads "Deriving the general case ourselves: … adding two d-digit integers
  must process all d digits, so it is O(d)…"), not as a claim quoted from the
  page. Guarded by `b1-group1-expr-fn.facts.test.ts`. New hash `34076dce4cf0d3ba`.
- **For the reviewer:** confirm the small-operand O(1) framing (and its
  arbitrary-precision caveat) reads clearly.

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

### 11. `representations` — Representations of Data  — hash `d145cc3190c48bc8` · verified 2026-10-02
- **Teaches:** one small graph (nodes 0,1,2 with edges 0–1, 0–2, 1–2) in two
  equivalent encodings — an **edge list** `[(0, 1), (0, 2), (1, 2)]` and an
  **adjacency map** `{0: {1,2}, 1: {0,2}, 2: {0,1}}`. The program rebuilds the
  connection set from EACH with **plain for-loops** (normalising edges as
  `(min, max)`), prints that they are equal, then prints the count.
  `expectedOutput: "True\n3\n"`.
- **Assessment:** teaching is correct; complexity separates reach (expected O(1))
  from enumerate (O(degree)) with honest case labels, and the equality check's
  scope is qualified (edge-set compare, not a general validator). Four
  claim-matched references, each verified against the live page (ODS Ch.12 Graphs,
  Runestone 7.2 Vocabulary, Runestone 7.3 Graph ADT, Runestone 7.5 Adjacency List,
  plus Python TimeComplexity for the cost labels).
- **Fix log (was: two NON-equivalent examples):** the original program showed
  `as_list = [0, 1, 1, 0]` and `as_dict = {0: [1], 1: [0]}` framed as "the same
  information," but they encoded different relationships. Replaced with the edge
  list + adjacency map of one graph; the program **proves equivalence** (prints
  `True`) by reconstructing and comparing the connection set from each.
- **Fix log — deepened (amendment 3):**
  - *Experiment uses a genuinely new edge:* the "break it" experiment now adds
    **`(0, 3)`** (a new node/edge) to the edge list only. Because `from_edges` is
    a **set**, re-adding an existing edge would change nothing; `(0, 3)` is absent
    from the adjacency map, so the equality check prints **False** (count 4).
    Verified on the bundled runtime and asserted in `b1-corrections.facts.test.ts`
    ("the break-it experiment uses a GENUINELY NEW edge").
  - *Complexity reconciled with the program:* the program no longer calls
    `sorted(...)` (it prints `len(from_edges)`), so there is **no O(E log E)**
    sort term; the claimed bounds are linear and a test asserts no `log` term
    appears in any claimed bound.
  - *Expected lookup vs enumeration distinguished:* the adjacency-map row and the
    complexity prose now separate the **expected O(1)** hashed **reach** of a
    node's neighbour set from the **O(degree)** cost of **enumerating** those
    neighbours (asserted by a test).
  - *Equivalence assumptions stated:* undirected, no self-loops, no
    duplicate/parallel edges, and the same node set — in the explanation and the
    `assumptions` list (asserted by a test).
- **Fix log — prerequisites/beginner level (finding 2):** the lesson now lists
  **`loops`** as a prerequisite (it uses a nested `for`), the program was
  rewritten with **plain for-loops** instead of set comprehensions, and new
  vocabulary explains **`set`** and **nested loop**. The learning-path graph was
  re-validated (`verify:lessons`): no missing prereqs, no cycles.
- **Fix log — deepened (amendment 4):**
  - *Reach vs enumerate, with correct case labels:* the single adjacency row that
    gave **O(degree)** as the *worst case for reaching* the set was wrong —
    O(degree) is the enumeration cost. It is now **two rows**: "reach a node's
    neighbour set" (a dict lookup — average **O(1)**, worst **O(V)** under hash
    collisions) and "enumerate a node's neighbours" (**O(degree)**, set iteration,
    all cases). Grounded in the Python **TimeComplexity** reference.
  - *Expected, not strict worst, overall:* the program bound is now
    `case: "expected"` **O(V + E)** (the derivation assumes expected-O(1) dict/set
    ops), with a worst-case `otherCases` note (superlinear under adversarial
    collisions). Tests assert the reach row's worst case is not O(degree), the
    enumerate row carries O(degree), and the overall case is expected/average.
  - *Equality scope qualified (not a general validator):* removed "would break it"
    / "edit one shape alone → False". The check compares **normalised edge sets**;
    it does not verify vertex sets, reciprocity, or multiplicity, so a
    parallel/duplicate edge, a non-reciprocal entry, or an isolated extra node can
    **still print `True`** (confirmed by a bundled-runtime probe). New vocabulary
    and reworded prose make it an *example under assumptions*, not a validator.
  - *References index:* added a claim-specific `### dsa/representations` entry to
    `docs/references.md` (ODS, Runestone graphs vocabulary, Python TimeComplexity).
- **Fix log — reference accuracy (amendment 5):** each recorded URL and claim was
  checked against the live page.
  - The **ODS homepage** was replaced by the exact consulted chapter
    **`ods-python/12_Graphs.html`** (graph `G=(V,E)`; studies two representations).
  - **Runestone 7.2 Vocabulary** is kept only for the **vocabulary** claim it
    supports (vertices/edges); it does NOT discuss adjacency representations or
    lookup costs, so those claims were moved off it.
  - The representation **trade-off** claim now cites **Runestone 7.3 The Graph
    ADT**; the adjacency **neighbour-lookup** claim now cites **Runestone 7.5 An
    Adjacency List**. `docs/references.md` mirrors these exact URLs and claims.
- **For the reviewer:** confirm the edge-list/adjacency framing and the plain-loop
  rewrite are appropriate at foundations level (the dedicated
  `graph-representations` lesson later goes deeper into adjacency list vs matrix),
  and that the reach-vs-enumerate split and the "not a general validator"
  qualification read clearly.

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

- **The 4 previously-flagged findings are fixed and then DEEPENED** after a second
  review, all test-first and regression-guarded:
  - `representations` — equivalent edge-list/adjacency-map encodings; break-it
    experiment uses a genuinely new edge → `False`; complexity reconciled (no
    sort; expected-O(1) reach vs O(degree) enumeration); equivalence assumptions
    stated; prerequisites now include `loops` and the program uses plain
    for-loops (beginner level).
  - `loops` — false pointer removed; the overlay guard is now a **semantic**
    trace/render check (`loops.overlay.real.test.tsx`) with a positive control,
    not merely "source names a variable".
  - `functions` — call-stack binding/label (not recursion-on-answer).
  - `variables-and-types` — identity is **visible in the rendered UI** (a "same
    object as best" label from recorded ref ids), proven by a rendered test, not
    just the printed `is`.
  All four still read `semanticReview: false`.
- **New regression files this round:**
  `src/visualizers/ArrayVisualizer.aliasing.test.tsx` (rendered aliasing) and
  `src/visualizers/loops.overlay.real.test.tsx` (semantic overlay check), plus
  deepened cases in `src/content/b1-corrections.facts.test.ts`.
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
