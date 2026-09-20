# DSA Visual Lab — Repair Milestone Handoff (for the R2 session)

**Written at end of R1. Next work = R2 (worker lifecycle, streaming, limits,
isolation), to begin in a new session.**

This is the durable, evidence-based handoff. It records exactly what is true,
what is verified, what is NOT, and precisely how to start R2. Read it with
`.kiro/steering/repair-milestone.md` (always-on) and the product/repair plan.

---

## 0. One-paragraph status

The product builds and its sample outputs match, but an audit (commit
`249a2f8`) showed it does **not** meet acceptance. We are executing a
10-spec repair plan (R0–R9), one reviewable PR per spec, branched per-spec from
`main` (Option A). **R0 (verification foundation) and R1 (tracer correctness)
are done and are in `main`'s git history.** R2 is next. The milestone is
*functional repair before UI redesign* — not release, not packaging.

---

## 1. Git / branch / PR state (ground truth = the git graph)

- **Default branch:** `main`.
- **`main` tip:** `7ca7f25` = "Merge pull request #11 from …/repair/r1-tracing".
  - R0 merge `9f777fc` is in `main`. ✅
  - R1 commit `7b8a90e` is in `main`. ✅  → **R1 is merged at the git level.**
- **Branches merged into main so far:** `repair/r0-baseline` (R0),
  `repair/r1-tracing` (R1).

### ⚠️ Important caveat about PR "merged" status and review

- The GitHub API in this environment reports **`merged=false` for EVERY PR**,
  including ones known to be genuinely merged (e.g. #4, #8, #9). **That flag is
  unreliable here — trust the git graph, not the API `merged` field.** By the
  git graph, R0 and R1 are merged.
- **R1 (PR #11) was NOT independently code-reviewed.** The user reported that
  GitHub access / the read-only PR fetch was blocked by an environment
  approval/usage limit, so the diff and checks could not be inspected. R1 landed
  in `main` without an external review. This is recorded honestly: R1's code is
  merged and its automated verification passed locally (see §4), but "reviewed
  and approved by a human" is NOT claimed.
- **Consequence for R2:** proceed (R1 is in `main`), but if the user later
  reviews R1 and requests changes, treat those as a follow-up bugfix on top of
  `main`. Do not retroactively claim R1 was approved.

### Repair branch naming sequence (Option A — one PR per spec)
1. `repair/r0-baseline` → merged (PR #10)
2. `repair/r1-tracing` → merged (PR #11)
3. `repair/r2-worker-lifecycle` ← **NEXT**
4. `repair/r3-persistence`
5. `repair/r4-replay-visualization`
6. `repair/r5-curriculum`
7. `repair/r6-exercises`
8. `repair/r7-complexity`
9. `repair/r8-learning-path-playground`
10. `repair/r9-verification-handoff`

---

## 2. How to start R2 (do these in order)

1. `git fetch origin && git checkout main && git reset --hard origin/main`
   (confirm tip is `7ca7f25` or later).
2. **Re-run the prior suites on `main` FIRST** (user's rule — confirm a clean
   baseline before new work):
   `npm ci` (if needed) then `npm run check:all` and `npm run test:browser`
   (browser needs `npx playwright install chromium` once per environment).
   Expect all green: build, lint (0 err/9 warn), unit 31, 130 lessons, 29
   patterns, 130 complexity panels, pipeline, visualizers, exercises, 2 e2e.
3. `git checkout -b repair/r2-worker-lifecycle`.
4. Create `.kiro/specs/R2-worker-lifecycle/` with `bugfix.md`, `design.md`,
   `tasks.md`, `verification.md`.
5. **Test-first:** write failing regression/unit tests for the R2 behaviors
   BEFORE changing engine code, then implement, then show them pass.
6. Keep the PR independently buildable/mergeable; include linked requirements &
   tasks, tests-before-fix, full verification results, changed assumptions, and
   a clear remaining-failures list. Do NOT edit lesson `expectedOutput` unless
   the old output was genuinely wrong (with evidence).

### Environment quick reference
- Node **v22** (`export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"` in this
  sandbox). Bundled Pyodide = **CPython 3.14.2**. Local pyenv 3.14.4 optional.
- **Verification is cross-platform / Node-only** now (no pyenv/nvm needed for
  the scripts). TS-importing scripts run via
  `node --experimental-strip-types --import ./scripts/lib/ts-register.mjs <s>`;
  npm wraps them.
- **Playwright/Chromium works in this environment** (`npx playwright install
  chromium` succeeded; e2e passed). It is headless Chromium on Linux — NOT
  literal Windows Chrome/Edge; R9 must note that engine/OS gap.
- Before committing: `rm -rf src/engine/__pycache__ scripts/__pycache__`.
  Never commit `__pycache__`, `dist`, `test-results/`, `playwright-report/`.

---

## 3. Verification commands (all cross-platform)

| Command | What it checks | What it does NOT prove |
|---|---|---|
| `npm run build` | tsc + bundle | correctness / UI |
| `npm run lint` | oxlint (0 err; 9 pre-existing warns) | runtime behavior |
| `npm run test:unit` | Vitest + RTL + fast-check | untested code; full flows |
| `npm run test:python` | pipeline + visualizer shapes on bundled Pyodide | in-browser worker; rendered SVG |
| `npm run test:curriculum` | 130 lessons + 29 patterns load from real registry; outputs match; complexity panels structurally valid | Big-O correctness; visual correctness |
| `npm run test:exercises` | runnable-exercise model answers pass their tests | mistake-rejection strength (R6) |
| `npm run test:browser` | Playwright/Chromium: app boots, nav renders | Windows Edge/Chrome specifics |
| `npm run check:all` | build+lint+unit+python+curriculum+exercises | (browser is separate) |
| `npm run gen:coverage` | regenerate docs/coverage.md from coverage.ts | — |

**No-silent-skip guarantee:** verification loads the real `registry.ts`; a
missing/unregistered/malformed lesson/pattern FAILS (exit 1), it is not skipped.
Proven: adding an unregistered lesson file → `✗ STRUCTURE … 131 != 130`, exit 1.

---

## 4. What R0 and R1 delivered (done, in main)

### R0 — verification foundation (behavior-neutral) — `.kiro/specs/R0-baseline/`
- **findings.md**: independently reproduced the audit. Confirmed counts:
  130 lessons, 29 patterns, 130 coverage all "verified", **381 exercises**
  (choose-approach 161 / complete-code 88 / fix-mistake 73 / predict-state 59),
  only **3** exercises have executable `tests:`, **0** externalPractice,
  309 refs / 188 URLs. Reproduced defects R1-A..F, R2-A..E, R3-A, R4-A, R0-A..C.
- Corrected README / AGENTS.md / handoff steering (removed "only Phase 5",
  "130/130 = full acceptance", "build = UI proxy", "node test = browser proof",
  and the framing that protected unsafe repr inspection).
- Added `.kiro/steering/repair-milestone.md` (`inclusion: always`).
- **Cross-platform, no-silent-skip verification**: `scripts/lib/`
  (`ts-register.mjs` + `ts-resolver.mjs` = ESM hook for the app's extensionless
  TS imports so scripts import the REAL registry; `load-curriculum.mjs`
  = registry-driven loader + structural validation + `collectExercises`;
  `pyodide-harness.mjs` = `getPyodide()`/`runProgram()` via `pathToFileURL`,
  Windows-safe). All `verify_*.mjs` rewritten off these.
- **Test layers**: vitest 3, @vitest/coverage-v8, jsdom, @testing-library/react
  + jest-dom + user-event, fast-check 3, @playwright/test 1. Configs:
  `vitest.config.ts` (jsdom, `esbuild.jsx:"automatic"`, `src/test/setup.ts`),
  `playwright.config.ts` (builds+previews app on 127.0.0.1:4173, chromium),
  `e2e/smoke.spec.ts`. `tsconfig.app.json` excludes tests; `tsconfig.test.json`
  type-checks them.

### R1 — tracer correctness (bugfix, test-first) — `.kiro/specs/R1-tracing/`
File: `src/engine/tracer.py`. Regression suite:
`src/engine/tracer.regression.test.ts` (22 tests; 5 failed on baseline first).
- **R1.1 Safe inspection** (no learner code executed): `_safe_label` replaces
  the `repr()` fallback (opaque objects show `<TypeName>`); containers walked via
  BUILTIN base-type methods (`list.__iter__`, `dict.keys`+`dict.__getitem__`,
  `set/frozenset.__iter__`, `deque.__iter__`) so subclass overrides can't run;
  `_static_instance_dict` uses `inspect.getattr_static` (a `@property __dict__`
  is treated opaque, never invoked); `_encode_key` preserves typed + tuple keys.
- **R1.2 Self-contained snapshots**: `_record(kind, frame, return_value=_MISSING,
  error=None)` resets the object table THEN encodes frames AND the return/error
  value into it (`_trace` passes `return_value=arg` raw). `_MISSING` sentinel
  defined at module top.
- **R1.3 input()/EOF**: `readline()` raises `EOFError` past supplied input (was
  returning `""`); blank supplied line still `""`; strips only trailing `\n`.
- **R1.4/1.5**: `compile()` moved inside try/finally (streams/tracing/input
  always restored, even on SyntaxError); SyntaxError → located structured error;
  `SystemExit` → new terminal status **`"exited"`** (+ `exitCode`), added to
  `RunStatus` in `src/core/types.ts`.
- **PRESERVATION (critical):** all **130 lesson outputs and 29 pattern outputs
  are UNCHANGED**; NO `expectedOutput` was edited. The fixes changed trace
  *structure* only.

**R1 verification results (local):** 22/22 R1 regression; 31/31 unit; build +
lint pass; verify:lessons 130 OK, verify:patterns 29 OK, complexity 130 OK,
pipeline OK, visualizers OK, exercises OK; e2e 2/2. (Local automated evidence;
NOT independently human-reviewed — see §1 caveat.)

---

## 5. R2 — scope for the next session (worker lifecycle, streaming, limits, isolation)

**Depends on:** R1 (in main). **Type:** Bugfix. **Decision on R2.5 = Option B**
(see §6). Reproduced defects to fix (from R0 findings):

- **R2-A — eager per-exercise workers.** `ExercisePanel` → `useExerciseRunner`
  → `new ExecutionEngine` per panel, and the worker warms Pyodide at module load
  (`void loadPyodideRuntime()` at the bottom of `run.worker.ts`). Opening
  Practice (many panels) spins up many Pyodide workers.
  → **Fix:** one shared execution **coordinator**; opening a lesson/Practice view
  creates NO Python worker per exercise; only one Python job at a time per app
  window; a fresh module worker per run; terminate on
  completion/cancel/fail/timeout.
- **R2-B — isolation.** Imported modules persist in a worker's `sys.modules`
  across runs. → A run must not inherit imported-module mutations from an earlier
  run (fresh worker/runtime state per run).
- **R2-C — fake limits.** `tracer.py` `_rough_size` is a heuristic, not real
  bytes. → Measure actual encoded payload bytes (strings, keys, output, metadata);
  enforce 10s exec / 10,000 events / 16 MiB; keep last valid states, mark the
  limit reached, mark incomplete data.
- **R2-E — catchable limit.** `_StopTracing` can be caught by learner
  `except BaseException`. → The COORDINATOR must terminate the worker after a
  limit notification (a Python control exception alone is insufficient).
- **R2.2 lifecycle**: states idle / initializing / running / completed / error /
  stopped / timeout / event-limit / trace-limit (+ `"exited"` from R1). 30s
  initialization timeout SEPARATE from the 10s execution timeout; exec timer
  starts immediately before learner code runs. Stop works during init and run.
  A new request cancels the previous. Every pending request settles exactly once.
  Navigation/disposal cancels owned work. An old result cannot update a newer
  editor/exercise.
- **R2.3 streaming**: versioned protocol carrying runId, owner workspace/exercise
  id, source revision/hash, input revision/hash, sequence number, kind, validated
  payload. Batch trace flushes (≤64 events / ~64 KiB / ~50ms); flush output
  promptly; the final message must not resend the whole trace.

### R2.5 = Option B (isolation-ready now; second origin at packaging)
Implement and TEST now (does not need the Windows server):
- Strict `postMessage` schemas (use a runtime validator; note: **Zod is NOT yet
  a dependency** — R3 planned to add it. If R2 needs runtime schema validation,
  either add Zod in R2 or hand-write validators; record the choice).
- Run IDs, source revisions, sequence numbers.
- Origin AND `event.source` validation on bridge messages.
- Stale-message rejection; oversized-message rejection.
- CSP for the bridge document and worker script.
- No native filesystem / subprocess / network access from learner Python.
- Fresh worker/runtime state per run.
- Init timeout, exec timeout, cancellation, streaming.
- A **configuration boundary** where the runner origin is supplied by deployment
  (so packaging flips to a real second origin via config, not a rewrite).

**R2 MUST leave a clearly failing/pending integration gate** for the real
two-origin topology. Create packaging requirement **`P-RUNNER-ORIGIN`** (a
RELEASE BLOCKER). Do NOT claim "runner isolation complete." R2 = "isolation-
ready"; packaging is where "isolated runner verified" becomes true. Packaging
must prove: app origin ≠ runner origin; the bridge loads from the runner origin;
CSP headers served correctly; Chrome AND Edge can execute/stop/supersede through
the bridge; non-loopback requests blocked.

→ Record `P-RUNNER-ORIGIN` in the R2 spec (and later in a packaging spec) as an
explicit pending gate, e.g. a skipped/failing e2e test or a documented checklist
item, so it cannot be silently forgotten.

### R2 key files
`src/engine/engine.ts` (ExecutionEngine: DEFAULT_LIMITS, spawnWorker, run/stop,
timeout via worker termination, stale-run rejection), `src/engine/run.worker.ts`
(eager `loadPyodideRuntime` at bottom; single `currentRunId`; tracer installed
once; `_StopTracing`), `src/engine/tracer.py` (`_rough_size` → real byte
accounting; `_StopTracing`), `src/ui/useEngine.ts` + `src/ui/useExerciseRunner.ts`
(each `new ExecutionEngine` — collapse to a shared coordinator),
`src/ui/ExercisePanel.tsx` (per-panel runner — must not create workers on
render), `src/ui/Practice.tsx` (renders many exercises — must stay economical;
R6 also caps to ~20/page).

### R2 acceptance (from plan)
Opening all 381 exercises creates no eager Python workers; a run can't inherit
earlier imported-module mutations; infinite loops can be stopped; a hanging run
can be superseded; partial output survives cancel/timeout; delayed messages from
earlier runs are ignored; missing runtime assets → recoverable error; the ~40 MB
trace blow-up is prevented; browser tests prove message validation & lifecycle;
`P-RUNNER-ORIGIN` remains a pending release-blocking gate.

---

## 6. Cross-cutting rules (apply to every remaining spec)

- **Test-first for bugs.** Commit a failing regression test, then fix, then show
  it pass. Required acceptance/regression tests are mandatory.
- **Evidence-tied completion.** Never claim done on a build/sample-output alone.
  Each spec's `verification.md` states what was and was NOT proven.
- **Preserve coverage & legitimate output.** Don't drop required topics. Don't
  change a lesson's `expectedOutput` unless the OLD output was genuinely wrong
  (with evidence); trace-structure/event-count changes go to trace fixtures.
- **Per-spec PR into `main`; re-run prior suites after each merge before new
  work.** Keep each PR independently buildable/mergeable.
- **Defer UI redesign & Windows packaging.** Add only minimal, labeled,
  keyboard-operable controls needed to use/test repaired behavior.
- **Reliability of the API `merged` flag is nil here — use the git graph.**
  Do not begin a spec until its predecessor is in `main`'s git history AND (if
  the user requires review) the user confirms review.

---

## 7. Remaining specs after R2

R3 persistence/backup (unique exercise IDs `owner:kind:id`, schema v2 migration
with legacy-ambiguity section, Zod backup validation, atomic writes/restore) ·
R4 replay/source-invalidation/inspection/**deque-adapter + all diagram families**/
Visualize-as · R5 curriculum re-verification (heaps/sliding-window fixes, missing
line explanations, external practice mappings, evidence-based coverage) · R6 make
161 coding exercises runnable + authored recognition grading + mistake-rejection
tests · R7 complexity (real observed stats, conservative AST analysis with
uncertainty, comparisons) · R8 learning-path + playground drafts/import/export ·
R9 full audit + handoff (run every layer incl. browser; recheck every audit
finding in a table; stop before UI redesign).
