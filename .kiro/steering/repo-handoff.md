# DSA Visual Lab — repo handoff notes

Durable facts for anyone (human or AI) continuing work on this repo. Keep this
current as things change.

## Branches

- **Default branch: `main`.** (It was previously `phase-1-foundation`; the owner
  switched the GitHub default to `main` on 2026-09-20.) Base new PRs on `main`.
- `main` and `phase-1-foundation` were kept byte-for-byte identical as of the
  Phase 3 merge (their trees matched exactly). Historically this repo merged
  `main` back into `phase-1-foundation` (see PR #3, PR #5); with `main` now the
  default, that dance is no longer needed — target `main` directly.
- Branch tips at handoff time:
  - `main` = `9721496` (merge of PR #4, Phase 3 → main)
  - `phase-1-foundation` = `70bec62` (merge of PR #5, main → phase-1-foundation)
- Feature branches used so far: `phase-2-visualizers`, `phase-3-curriculum`
  (both merged). Create a fresh feature branch per phase; do not commit directly
  to `main`.

## Progress

- **Phase 3 COMPLETE and merged into `main`: 130 / 130 subtopics verified**
  (`COVERAGE_VERSION` was 10 at that merge; Phase 4 bumped it to 11 by linking
  `patternIds` into coverage entries).
- **Phase 4 built** on branch `phase-4-patterns-practice` (PR into `main`):
  Pattern Library (10 verified patterns in `src/content/patterns/`, registered
  in `registry.ts` `patterns[]` + `getPattern`), a top-level view switcher
  (Learn / Patterns / Practice / Playground / Backup) in `App.tsx`, recognition
  practice with progressive hints, a runnable coding-exercise runner
  (`useExerciseRunner` + `tests` field on `Exercise`), a Code Playground, and
  IndexedDB persistence with versioned JSON backup/restore
  (`src/storage/progress.ts`, validates before replacing data).
  New verify scripts: `scripts/verify_patterns.mjs` (walkthrough stdout) and
  `scripts/verify_exercise_tests.mjs` (model answers pass their own tests).
  UI is verified via `npx tsc -b` + `npm run build` (no server smoke test in the
  sandbox — the production build succeeding is the proxy).
- Remaining roadmap: extend the Pattern Library with more patterns as needed,
  then **Phase 5** (offline Windows package: Start.cmd launcher, portable Node,
  bundled runtimes, ZIP delivery).

## How to verify content (repeatable — all must pass)

Load toolchains first:

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
export PYENV_ROOT="$HOME/.pyenv"; export PATH="$PYENV_ROOT/bin:$PATH"; eval "$(pyenv init -)"; pyenv shell 3.14.4
```

Then run:

```bash
npx tsc -b                                            # 0 TS errors (or npm run build)
npm run lint                                          # 0 errors (9 pre-existing warnings OK)
node scripts/verify_lessons.mjs                       # every stdout == expectedOutput (bundled Pyodide 3.14)
node --experimental-strip-types scripts/verify_complexity.mjs  # complexity panels valid
node scripts/verify_visualizers.mjs                   # structure object shapes OK
node scripts/verify_pipeline.mjs                      # end-to-end trace sanity
python scripts/test_tracer.py                         # tracer unit checks on local CPython 3.14
```

## Content authoring workflow (established)

1. Write `scripts/probe_<topic>.py`; run on **local CPython 3.14** to capture EXACT stdout.
2. Author `src/content/lessons/<id>.ts` (a `LessonDefinition`) copying the shape of
   a verified lesson (e.g. `src/content/lessons/dijkstra.ts`). Requirements:
   - Define the program as ``const code = `...`;`` — `verify_lessons.mjs` extracts it
     via regex, and line numbers are 1-based against that template (line 1 = first
     line, **no** leading newline).
   - Provide a full `complexityExplanation` (variables, costModel, time/space
     bounds+case, line-linked derivation, assumptions, tradeoffs, counters,
     fixedDataNote, references). Every `counters[].countLines` must actually execute
     on the sample input; every derivation `lines` must be in range.
   - Every displayed code line needs a `codeExplanations` entry.
   - Set `expectedOutput` to the EXACT probe stdout.
3. Register the import + array entry in `src/content/registry.ts` (imports are
   extensionless — Vite/verify scripts resolve them; bare `node` will not).
4. In `src/content/coverage.ts`, set the subtopic to
   `{ lessonId, hasVisualExample: true, hasExercise: true, status: "verified" }`
   and **bump `COVERAGE_VERSION`**.
5. Regenerate the human-readable inventory:
   `node --experimental-strip-types scripts/gen_coverage_md.mjs`
   (parses `coverage.ts`, rewrites `docs/coverage.md`, preserving per-area counts).
6. Run the full verification suite above.
7. Before staging: `rm -rf src/engine/__pycache__ scripts/__pycache__`. Never commit
   `__pycache__` or `dist`.

## Runtime / engine gotchas (do not "fix")

- Target **CPython 3.14** (bundled Pyodide 314.0.7 = CPython 3.14.2).
- The tracer encodes non-finite floats as the strings `"Infinity"` / `"-Infinity"`
  / `"NaN"` (JS `JSON.parse` rejects the literals). Keep this.
- Trace event limit is 10,000 — keep recursion/DP example inputs small
  (e.g. `fib(10)`, tiny grids) so traces stay well under it.
- Opaque objects (modules/classes/functions) are shown as `repr`, not walked.
- Coverage total is **130** (graph "representations/adjacency lists" is split into
  two entries — keep the split).
