# Semantic review — Batch B1 (Foundations) — PREPARED FOR HUMAN REVIEW

> **Status: NOT signed off.** All 160 content items remain `semanticReview: false`.
> This document prepares B1 for a human reviewer; it does **not** set
> `semanticReview: true` or claim any sign-off. Nothing is approved until a
> person has read and approved the specific items below.

**Batch:** B1 — Foundations (ledger `reviewBatch: 1`).
**Scope:** 15 lessons = 10 *Programming foundations* + 5 *DSA foundations*.
**Base commit:** `main` = `ec47328` (PR #22 merged).
**What "review" means here (per AGENTS.md):** confirm the learner-facing content
is factually correct, the explanation/vocabulary/complexity/`expectedOutput`
agree with real CPython-3.14 behaviour, exercises are correct and well-posed, and
prerequisites are introduced before use.

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

| # | Lesson ID | Area | Title | contentHash | Exercises |
|---|---|---|---|---|---|
| 1 | `variables-and-types` | Programming foundations | Variables and Types | `60ba3ee9a8e20f2e` | vt-predict-1, vt-fix-1, vt-choose-1 |
| 2 | `expressions` | Programming foundations | Expressions and Operators | `f143fe2cdd58cb0a` | expr-predict-1, expr-choose-1 |
| 3 | `conditions` | Programming foundations | Conditions (if/elif/else) | `9c63d07d9bb2235d` | cond-fix-1, cond-predict-1 |
| 4 | `loops` | Programming foundations | Loops (for and while) | `2c1b052e539933fe` | loop-fix-1, loop-complete-1 |
| 5 | `functions` | Programming foundations | Functions | `83b494a9d37fc2c9` | func-complete-1, func-predict-1 |
| 6 | `scope` | Programming foundations | Scope (Local vs Global) | `784f6b28a2aed1d6` | scope-predict-1, scope-choose-1 |
| 7 | `io` | Programming foundations | Input and Output | `9ec7390e15aa8128` | io-fix-1, io-predict-1 |
| 8 | `references-mutation` | Programming foundations | References and Mutation | `5feb2cad2643ea0c` | ref-predict-1, ref-fix-1 |
| 9 | `classes` | Programming foundations | Classes and Objects | `8693b395b5881198` | class-complete-1, class-predict-1 |
| 10 | `errors` | Programming foundations | Errors and Exceptions | `c144f84f8a9c03e1` | err-complete-1, err-choose-1 |
| 11 | `representations` | DSA foundations | Representations of Data | `48a6032810b90a2f` | repr-choose-1, repr-predict-1 |
| 12 | `complexity` | DSA foundations | Time and Space Complexity | `448bbae5526f4263` | cx-predict-1, cx-choose-1 |
| 13 | `cases` | DSA foundations | Best, Average, and Worst Cases | `1f31f7d42bd2adc4` | cases-predict-1, cases-choose-1 |
| 14 | `amortized` | DSA foundations | Amortized Cost | `5b23a0c6bd8b3a52` | amort-predict-1, amort-choose-1 |
| 15 | `correctness` | DSA foundations | Correctness and Invariants | `9db456b486337f4e` | correct-fix-1, correct-predict-1 |

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

### 1. `variables-and-types` — Variables and Types
- **Teaches:** names refer to objects; dynamic typing; `int/float/str/bool/None`;
  **aliasing** (`b = a` shares one list) and mutation. Program aliases a list,
  appends through one name, prints. `expectedOutput: "Ada 42.5 True None\n[10, 20, 30, 40]\n"`.
- **Assessment:** factually correct — int unlimited precision, bool subtype of
  int, None a singleton all stated correctly. Exercises (`vt-fix-1` copy via
  `list(a)`, `vt-choose-1` big int) correct.
- **Concern (minor, visualization):** only `scores` has an array binding; the
  aliasing of `best` onto the same object is explained in prose but there is no
  overlay showing the two names sharing one object — a human may want to confirm
  the diagram conveys aliasing, which is the lesson's core idea.

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

### 4. `loops` — Loops (for and while)
- **Teaches:** for = once per item, while = until condition false, accumulator,
  infinite loop. `expectedOutput: "27\n0\n1\n2\n"`.
- **Assessment:** prose, complexity, and exercises (`loop-fix-1` missing
  increment; `loop-complete-1` count_evens) all correct.
- **Concern (visualization):** the `nums` binding has an overlay
  `{ role: "pointer", label: "x-index", source: "i" }`, but in the for-loop the
  element variable is `x` (a value) and `i` is the **unrelated** while-loop
  counter. The overlay appears to point into `nums` using `i`, which does not
  index `nums`. A human should verify the diagram does not mislabel/mis-track the
  pointer. (Prose/exercises are unaffected.)

### 5. `functions` — Functions
- **Teaches:** `def`, parameters vs arguments, `return`, None-on-no-return,
  per-call frame. `expectedOutput: "7\n"`.
- **Assessment:** correct, incl. "default parameter values evaluated once at
  definition time." Exercises correct.
- **Concerns:** (a) **visualization** — `bindings: [{ variable: "answer", model:
  "recursion" }]`, but `answer` is a scalar int and `add` is not recursive; the
  "recursion"/call-stack model on a non-recursive scalar may render oddly — human
  check. (b) **minor** — only one reference (Python docs); AGENTS.md prefers a
  second independent source where one exists.

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

### 11. `representations` — Representations of Data
- **Teaches:** ADT vs implementation; same info, different shapes; dict O(1)
  keyed lookup vs list positional. Program builds `as_list = [0, 1, 1, 0]` and
  `as_dict = {0: [1], 1: [0]}`. `expectedOutput: "[0, 1, 1, 0]\n{0: [1], 1: [0]}\n"`.
- **Assessment:** the general teaching is correct and the complexity table is
  right.
- **Concern (teaching clarity — worth a human decision):** the two example
  structures are presented as alternative encodings of "the same information,"
  but they are **not equivalent**: the list comment frames it as "item i connected
  to i+1?" over 4 flags, while the dict encodes only "0–1 are neighbours." A
  learner comparing them side by side could be confused that they don't describe
  the same graph. Consider making the two representations encode identical data,
  or rewording so they are clearly two *illustrations* rather than equivalent.

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

- **11 of 15** items I found factually correct with no blocking concern:
  `expressions`, `conditions`, `io`, `references-mutation`, `errors`,
  `complexity`, `cases`, `amortized`, `correctness`, plus `scope` and `classes`
  (each only a minor single-reference / wording nit).
- **4 items carry a concern a human should resolve before approving:**
  - `representations` — **content/teaching:** the two example structures are not
    equivalent encodings though framed as such (strongest concern).
  - `loops` — **visualization:** `x-index`/`source: "i"` overlay may mis-track a
    pointer into `nums`.
  - `functions` — **visualization:** `model: "recursion"` on the scalar `answer`
    may render oddly.
  - `variables-and-types` — **visualization:** aliasing shown in prose but not via
    an overlay on the shared object.
- **Minor, non-blocking:** `functions`, `scope`, `classes` each cite a single
  reference; `classes` line-11 code explanation is vague wording.

**Recommended sign-off path:** after you personally confirm them, the 11
no-blocking-concern items are the natural first approval set; hold
`representations`, `loops`, `functions`, and `variables-and-types` until the
visualization/encoding concerns are decided (approve as-is, or fix then approve).
Nothing is signed off until you run the command above with the ids you approve.
```
