# R0 — Verification

**Environment:** Linux sandbox; Node v22.23.2; bundled Pyodide = CPython 3.14.2;
Playwright 1.63.0 with Chromium headless-shell installed. Branch
`repair/r0-baseline` off `main` @ `249a2f832579de8a8eb7459f5b566402a6d8cd11`.

## What each layer proves (and does not)

| Command | Proves | Does NOT prove |
|---|---|---|
| `npm run build` | App type-checks and bundles; all imports resolve | Correctness, UI behavior, or that anything is teaching-accurate |
| `npm run lint` | Style rules pass | Any runtime behavior |
| `npm run test:unit` (Vitest+RTL+fast-check) | TS logic + rendered component behavior for the tested units | Untested components; full UI flows |
| `npm run test:python` (pipeline+visualizers on bundled Pyodide) | The tracer/trace pipeline and trace object shapes on the real runtime | The in-browser worker path; rendered SVG |
| `npm run test:curriculum` | All 130 lessons + 29 patterns load from the real registry and their stdout matches; complexity panels are structurally valid | That a Big-O claim is correct, or a visualization is right |
| `npm run test:exercises` | Runnable-exercise model answers pass their own tests | Mistake-rejection strength (R6); recognition grading |
| `npm run test:browser` (Playwright/Chromium) | The built app boots in a real browser and navigation renders | Windows-specific Chrome/Edge quirks (engine is headless Chromium here) |

## Acceptance criteria — results

| # | Criterion | Result | Evidence |
|---|---|---|---|
| 1 | Verification runs cross-platform without source edits | ✅ PASS | No `nvm`/`pyenv`/bash/OS-path assumptions in `scripts/` or npm scripts (only a comment noting their absence). All dynamic imports use `pathToFileURL`. Commands are Node-only. |
| 2 | Existing valid sample-output checks still pass | ✅ PASS | `check:all` green: 130 lessons OK, 29 patterns OK, 130 complexity panels OK, 3 runnable exercises OK, visualizers OK, pipeline OK, 9 unit tests, 2 e2e tests. |
| 3 | All known gaps tracked with repair IDs | ✅ PASS | `findings.md` tracks 19 IDs: R0-A/B/C, R1-A–F, R2-A–E, R3-A/B, R4-A/B/C. |
| 4 | No required item can silently disappear from counts | ✅ PASS | Registry-driven counts; an unregistered lesson file now fails with `✗ STRUCTURE … file count (131) != registered (130)` and exit code 1 (previously silently skipped). |
| 5 | Docs distinguish implemented / tested / unfinished | ✅ PASS | README status rewritten; AGENTS validation block clarified; `repair-milestone.md` (always-on) + `repo-handoff.md` state the milestone and the "green ≠ correct" boundary. |

## Notable finding during R0.4

`npx playwright install chromium` **succeeded** in this environment and the e2e
smoke suite **passed** against the production build (app boots; the Learn /
Patterns / Practice / Playground / Backup nav renders; switching to Patterns
shows the pattern library). So **real-browser acceptance is runnable here** —
R9 will run the full browser suite rather than deferring it entirely to a manual
Windows procedure. Caveat: the engine is **headless Chromium on Linux**, not
literal Windows Chrome/Edge, so R9 must still note that OS/engine gap.

## Limitations / open

- R0 establishes the *foundation*. The actual defects (R1-A..E, R2, R3, R4-A,
  etc.) are still present in the product and are fixed in specs R1–R9.
- `test:browser` requires `npx playwright install chromium` once per environment;
  where that download is blocked, the command reports the missing browser (it
  does not silently pass).

**Conclusion:** R0 acceptance criteria 1–5 all PASS. The verification foundation
is trustworthy and cross-platform; subsequent specs can rely on it.
