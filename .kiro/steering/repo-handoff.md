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

## Current status — READ THIS (supersedes earlier "phase complete" claims)

**The milestone is functional repair before UI redesign. It is NOT "release
complete" and it is NOT "only Phase 5 remains."**

A repository audit of `main` @ `249a2f8` found the product does not meet its
acceptance criteria despite building and passing sample-output checks. The
reproduced findings and the repair plan (specs R0–R9) live in
`.kiro/specs/R0-baseline/findings.md`. Do not treat any of the following as true:

- ❌ "Only Phase 5 remains." (Multiple functional defects remain across R1–R8.)
- ❌ "130/130 verified" as a statement of full acceptance. (That flag reflects
  *sample-output* checks, not the plan's definition of done.)
- ❌ "A successful production build is a proxy for UI verification."
- ❌ "A Node test of the tracer proves the browser worker path."

What is genuinely present (built, correctness under repair): 130 lessons, 29
patterns, the tracing engine, visualizers, Practice, Playground, and IndexedDB
persistence with backup/restore. What is confirmed broken (see findings.md):
unsafe tracer inspection (can run learner `__repr__`/descriptors), an object-table
return-value bug, EOF returning `""` instead of `EOFError`, the deque visualizer
(no `entries`), eager per-exercise Python workers, non-unique exercise IDs,
heuristic resource limits, no runner-origin isolation, and verification scripts
that silently skip items and don't run on Windows.

Roadmap after functional repair: **UI redesign** (layout/styling/accessibility),
then the **offline Windows package** (Start.cmd launcher, portable Node, ZIP).

## How to verify content (cross-platform — Node only, no pyenv/nvm needed)

The bundled Pyodide provides Python; a system Python is not required. These
commands must run on Windows, macOS, and Linux without editing sources.

```bash
npm run check:all        # aggregate gate
# individual layers:
npm run test:python      # bundled-Pyodide tracer + pipeline checks
npm run test:curriculum  # lessons + patterns load and their outputs match
npm run test:exercises   # coding-exercise model solutions pass; mistakes rejected
npm run test:unit        # TS logic / component tests
npm run test:browser     # Playwright real-browser integration
```

> A green content check does not prove the browser UI, a visualization's
> correctness, a complexity claim, or an exercise grader's effectiveness. Those
> need `test:browser` and human review. Each spec's `verification.md` states
> exactly what was established and what remains.

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

## Runtime / engine facts

**Keep (intentional):**
- Target **CPython 3.14** (bundled Pyodide 314.0.7 = CPython 3.14.2).
- The tracer encodes non-finite floats as the strings `"Infinity"` /
  `"-Infinity"` / `"NaN"` (JS `JSON.parse` rejects the literals). Keep this.
- Coverage total is **130** (graph "representations/adjacency lists" is split
  into two entries — keep the split).

**Under repair (do NOT protect as-is — see R1/R2/R4 in findings.md):**
- The tracer's inspection can execute learner code: the `_encode_object`
  fallback calls `repr()`, and it reads `getattr(obj, "__dict__")` which fires
  `@property`/descriptors. R1 replaces this with side-effect-free inspection
  (`inspect.getattr_static`, explicit adapters). Modules/classes/functions may
  still be shown as a safe type label — but **never** by invoking a user
  `__repr__` as a fallback.
- The 10,000-event limit is real, but the 16 MiB limit is only a heuristic
  (`_rough_size`); R2 makes it measure actual encoded bytes. Keeping example
  inputs small is still sensible, but the engine must enforce the true limit.
- The deque adapter is broken (deque encodes with no `entries`); R4 fixes it.
