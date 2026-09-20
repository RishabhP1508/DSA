# R4 — Verification

**Branch:** `repair/r4-replay-visualization` (off `main` @ `2a3cc2e`, post-R3.1).
**Runtime:** bundled Pyodide = CPython 3.14.2. Node v22.

> Filled in as tasks complete. States what was and was NOT proven, tested commit,
> and remaining gaps.

## Baseline re-confirmed before any change (on `main` @ `2a3cc2e`)

| Check | Result |
|---|---|
| `npm run check:all` | ✅ green (build; lint 0 err/9 warn; unit 111/111; 130 lessons; 29 patterns; 130 complexity; 3 runnable) |

## Defect status re-verified (post-R2/R3)

- **R4.5 deque adapter — ALREADY FIXED by R2.** Probe: `deque([0,1,2])` →
  `{type:"deque", entries:[0,1,2]}` (order preserved after appendleft/append),
  no `repr`-only path; `index.tsx` routes `model:"deque"` → `DequeVisualizer`.
  R4.5 re-scoped to verification coverage (deque/stack/queue/set/matrix/string
  were untested).
- **R4.1 source-edit invalidation — reproduces.** `RunResult` lacks
  `sourceRev`/`inputRev`; the UI never compares; a stale trace/highlight/
  complexity panel keeps rendering after an edit.
- **R4.4 object inspector — reproduces.** `displayValue` truncates at 6 entries /
  depth 2; `VariablesPanel` is a flat table; no `returnValue`; ignores
  `truncated`.
- **R4.3 playback — partial.** Prev/Next/Restart/scrub wired; Play/Pause, speed,
  breakpoints missing; "step 1 / 0" on zero-event.
- **R4.6 Visualize-as — missing.** No runtime binding UI; Playground has no
  visualizer.

## Test-first evidence (T1 — recorded BEFORE the fix)

- `src/engine/replay.test.ts` — exact fwd/back stepping + zero-event tests
  **pass** (Replay exists); the 5 `nextPlayIndex` (breakpoint-aware advance)
  tests **fail** (function absent). Confirms the play/breakpoint logic is missing.
- `src/engine/staleness.test.ts` — all 5 **fail** (`isResultStale` absent;
  `RunResult` has no `sourceRev`/`inputRev`).
- `src/ui/ObjectInspector.test.tsx` — **fails to resolve** (`./ObjectInspector`
  does not exist). Confirms no real expandable inspector.
- `scripts/verify_visualizers.mjs` extended with deque/stack/queue/set/matrix/
  string + graph-direction/DP-computed caveats — **27/27 pass** on the current
  tracer, proving the R2 deque fix end-to-end and closing the coverage gap
  (these families were previously untested).

## Results after the fix (tested commit: `779e649`, PR #16 → `main`)

| Check | Result |
|---|---|
| `npm run build` (tsc -b + vite) | ✅ pass |
| `npm run lint` | ✅ 0 errors / 9 warnings (baseline) |
| `npm run test:unit` | ✅ **129/129** (15 files; +18 R4) |
| `npm run test:python` (pipeline + visualizers) | ✅ OK |
| `verify:visualizers` | ✅ **27/27** shape checks (incl. deque/stack/queue/set/matrix/string) |
| `verify:lessons` / `verify:patterns` | ✅ 130 / 29 — **unchanged** |
| `verify:complexity` | ✅ 130 panels |
| `npm run check:all` | ✅ green (RC 0) |
| `npm run test:browser` (Playwright/Chromium) | ✅ **9 passed / 5 skipped** |

New R4 tests (all passing after the fix):
- `src/engine/replay.test.ts` — exact fwd/back stepping; zero-event result
  reports length 0 (no "step 1/0"); `nextPlayIndex` breakpoint-aware advance.
- `src/engine/staleness.test.ts` — `isResultStale` (source/stdin rev mismatch;
  conservative for rev-less legacy results).
- `src/ui/ObjectInspector.test.tsx` — expand/drill (not hidden at 6), typed dict
  keys (int/str/tuple), cyclic-safe, return value, surfaced `truncated`.
- `e2e/replay-visualization.spec.ts` — Visualize-as renders `nums` as an array
  SVG; editing the source shows the stale banner and re-running clears it; Play
  advances the timeline and the inspector expands.

## Defects closed (with the test that prevents recurrence)

| ID | Defect | Test(s) | Result |
|---|---|---|---|
| R4.1 | Source edits don't invalidate the stale trace/complexity | `staleness.test.ts`; e2e "editing the source shows a stale banner"; workspaces drop stale highlight/viz/vars/complexity | ✅ |
| R4.3 | Playback incomplete; "step 1 of 0" | `replay.test.ts` (zero-event + `nextPlayIndex`); e2e "Play advances the timeline"; Play/Pause+speed+breakpoint controls in all 3 workspaces | ✅ |
| R4.4 | Inspector hides after first N entries | `ObjectInspector.test.tsx`; `VariablesPanel` uses the expandable inspector + return-value row + frame select | ✅ |
| R4.5 | Deque adapter (+ diagram coverage) | `verify:visualizers` 27/27 incl. deque/stack/queue/set/matrix/string; deque proven fixed by R2 | ✅ |
| R4.6 | No "Visualize as…" | `VisualizeAs.tsx` + Playground visualizer slot; e2e "Visualize as… renders a chosen variable" | ✅ |

## Preservation (per milestone rule)

- No lesson `expectedOutput` changed; `verify:lessons` (130) / `verify:patterns`
  (29) byte-identical to baseline (this spec is replay/visualization/UI only).
- `displayValue` (compact SVG cell labels) retained unchanged, so authored
  visualizers render exactly as before; the new expandable path is additive.
- Backward playback still reproduces earlier recorded states exactly (Replay
  reads snapshots; never reruns) — covered by `replay.test.ts`.
- R1–R3 behavior untouched; full prior suite green.

## Amendment (pre-merge review follow-up)

A review of PR #16 asked for stronger rendered-output tests and tighter
semantics. All added test-first (failing on the prior code, then passing):

- **Rendered-output tests** (inspect the produced SVG, not just trace shape):
  `src/visualizers/GraphVisualizer.test.tsx` and
  `src/visualizers/DPTableVisualizer.test.tsx`.
- **Graph direction is explicit, not inferred.** `VisualBinding.directed`
  added; `GraphVisualizer` draws a reciprocal pair (u→v and v→u) as TWO
  arrowheaded arcs when `directed:true`, one undirected edge when `false` —
  never inferring from the presence of a reverse edge. The 8 existing (all
  undirected) graph lesson bindings now set `directed: false` explicitly.
- **DP "computed" styling only from state/metadata.** `VisualBinding.computedSource`
  added; `DPTableVisualizer` shades a cell "computed" ONLY when it is listed by
  the authored `computedSource` (a set/list of indices / `[i,j]` pairs) — a
  zero-initialised table shows NO computed cells. The current cell still
  highlights from the `i`/`j` overlays (actual state).
- **Edited lesson/pattern code keeps the fresh trace but disables authored
  artifacts.** `edited = source !== original` gates the authored line
  explanations, diagram bindings, and complexity panel/note (hidden until the
  original source is restored); the recorded trace, variables, output and
  playback stay usable. **Staleness overrides a lingering complexity-hover
  highlight** (the `cxHighlight` no longer drives the editor highlight while
  edited/stale). The Playground (learner's own code, no authored artifacts)
  keeps its trace visible with an "outdated, re-run to refresh" banner.
- **Playback tested against a realistic call/line/return sequence.**
  `isBreakpointStop` pauses ONLY at the executable `line` event for a breakpoint
  line — never on a `call`/`return` that merely reports that line; `replay.test.ts`
  covers this with a real 7-event sequence and a play-loop simulation. `useEngine`'s
  play timer uses `isBreakpointStop`.
- **Browser Play test asserts the timeline actually advances** (captures the
  starting step, then polls that the position increases and reaches the total).

Amendment verification: `check:all` green (lint 0/9; unit **138/138**; 130
lessons + 29 patterns unchanged; 130 complexity; 27/27 visualizer shapes);
`test:browser` **9 passed / 5 skipped**.

## Amendment 2 (pre-merge review follow-up on `0db525d`)

Three defects the earlier checks did not cover. All added test-first (failing
first, then passing):

1. **Trace-matches-editor vs editor-matches-authored were conflated.** The prior
   amendment gated authored artifacts on `!edited` only, so **restore original
   after an edited run** (`edited === false`, `stale === true`) wrongly showed the
   authored diagram/complexity against the edited run's trace and hid the stale
   warning. Fixed in `LessonWorkspace` and `PatternWorkspace` with explicit
   `traceMatchesEditor = !!result && !stale` and
   `authoredMatchesTrace = traceMatchesEditor && !edited`. Now: trace/variables/
   playback show only when `traceMatchesEditor`; authored explanations/bindings/
   complexity only when `authoredMatchesTrace`; a stale warning shows whenever a
   recorded result no longer matches the editor (including after restore);
   playback is disabled and auto-paused while stale; a late edited-run result
   cannot become the current validated trace (the UI keys on `traceMatchesEditor`,
   and `isStale` compares `result.sourceRev` against the current source).
   Failing-before/passing-after: `src/ui/workspace-staleness.test.tsx` (mocked
   engine, both workspaces, incl. the restore-original-stale case and
   playback-disabled).

   Truth table verified:
   | Editor & last run | Trace/vars/playback | Authored |
   |---|---|---|
   | original, original run | show | show |
   | edited, old original run | stale (hidden) | hidden |
   | edited, fresh edited run | show real edited trace | hidden |
   | restored original, last run edited | stale (hidden) | hidden |
   | original, fresh original run | show | show |

2. **"Visualize as…" dropped graph direction.** Added a labeled Directed/
   Undirected control shown only for the graph model, threaded into
   `VisualBinding.directed`, and made `update()` merge onto the current binding so
   `directed` is PRESERVED when the learner changes variable/model/path. Direction
   is never inferred from reciprocal edges. Test: `src/ui/VisualizeAs.test.tsx`.

3. **DP progress was only proven on a synthetic fixture.** Added current-cell
   overlays driven by the REAL loop index to all 7 DP-table lessons
   (`dp-tabulation` i, `dp-coin-change` a, `dp-lis` i, `dp-1d-2d` i/j,
   `dp-grid-paths` i/j, `dp-knapsack` i/w, `dp-lcs` i/j) and the knapsack pattern
   (s). Rendered tests driven by real bundled-Pyodide traces for a 1D lesson
   (`dp-tabulation`) and a 2D lesson (`dp-grid-paths`) assert the current cell is
   highlighted at an initial and a later transition:
   `src/visualizers/DPTableVisualizer.real.test.tsx`.
   **Documented gap:** none of these lessons track a *computed-cell set*, so
   "computed" shading (`computedSource`) is intentionally NOT populated — the
   renderer shows the truthful current-cell only and never infers computation
   from a non-None value. Adding computed-cell shading would require authoring an
   explicit observed/authored state variable in the lesson code (out of R4 scope;
   flagged for R5/R7 if desired). Trace-timing note preserved: a `line` event is
   the state *before* that line runs, so the current-cell overlay marks the cell
   about to be written.

Amendment-2 verification (tested commit: `6eb5620`, PR #16):
`check:all` green — lint **0 errors / 9 warnings**; unit **150/150** (20 files);
130 lessons + 29 patterns unchanged; 130 complexity; 27/27 visualizer shapes.
`test:browser`: **9 passed / 5 skipped** (the 5 skips are the R2 P-RUNNER-ORIGIN
packaging gate, reported separately). No lesson `expectedOutput` changed.

## Amendment 3 (test-only strengthening; no production code changed)

A review asked for two tests to exercise real sequences/assertions rather than a
mocked flag or a single step. Only two test files changed
(`workspace-staleness.test.tsx`, `DPTableVisualizer.real.test.tsx`).

1. **Full source-state sequence, both workspaces.**
   `workspace-staleness.test.tsx` now drives the ACTUAL sequence with a
   staleness-modeling fake engine (records the source that produced the trace;
   `isStale(cur) = lastRunSource !== cur`) and REAL CodeMirror edits dispatched
   through the editor view:
   original run → edit → run edited → restore original (no rerun) → rerun original.
   At each of the five states it asserts the stale warning presence, playback
   availability (Play button enabled/disabled), and authored explanation
   visibility — for **both** `LessonWorkspace` and `PatternWorkspace`. This proves
   the trace-vs-editor vs editor-vs-authored separation end-to-end, including the
   previously-regressing state D (restored original, last run edited → stale,
   authored hidden, warning shown, playback disabled). It replaces the earlier
   mocked-`stale`-flag cases.

   Proven, per state (both workspaces):
   | State | Stale warning | Trace/playback | Authored content |
   |---|---|---|---|
   | A original run | absent | enabled | shown |
   | B edit, no rerun | shown | disabled | hidden |
   | C run edited | shown (edited) | enabled | hidden |
   | D restore original, no rerun | shown (stale) | disabled | hidden |
   | E rerun original | absent | enabled | shown |

2. **2D DP progress at two distinct steps, coordinate-checked.**
   `DPTableVisualizer.real.test.tsx` (2D, `dp-grid-paths`, real bundled-Pyodide
   trace) now selects two interior events with different `(i, j)`, renders each,
   inverts the highlighted rect's `x`/`y` to recover the rendered `(row, col)`,
   and asserts they equal the trace's `i`/`j` — and that the coordinates change
   between the two steps. It no longer merely counts active cells at one step.
   The 1D test (`dp-tabulation`) continues to assert the active cell equals `i` at
   an early and a later transition.

Amendment-3 verification (tested commit: <FILLED AT COMMIT>):
`check:all` green — lint 0 err / 9 warns; unit **146/146** (20 files); 130
lessons + 29 patterns unchanged; 130 complexity; 27/27 visualizer shapes.
`test:browser`: **9 passed / 5 skipped** (the 5 skips are the R2 P-RUNNER-ORIGIN
packaging gate, reported separately). No production code and no lesson
`expectedOutput` changed.

## What was NOT proven / remaining
- **Deque adapter was already fixed by R2** (evidence in the probe + the new
  `verify:visualizers` deque check); R4 closed the *verification* gap, not a live
  tracer bug.
- Playback breakpoints are **playback** breakpoints (pause replay of recorded
  states); they do not suspend already-completed Python — as designed/plan.
- A gutter-click breakpoint UI, animation smoothing, and full visual polish are
  deferred to the UI milestone; R4 adds a labeled "breakpoint on current line"
  toggle sufficient to use/test the behavior.
- Playwright is headless Chromium on Linux, not Windows Chrome/Edge (R9 gap).
- Rendered-pixel correctness of every SVG family is still asserted at the trace-
  shape level (`verify:visualizers`) + a representative browser render, not a
  full per-family visual snapshot (candidate for R9).
