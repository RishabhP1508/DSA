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
