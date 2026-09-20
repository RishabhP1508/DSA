# R4 — Tasks

Test-first for bugs: commit a failing test, then fix, then show it pass.

## T1 — Failing tests first
- `src/engine/replay.test.ts` — Replay stepping is exact backwards/forwards;
  zero-event result reports length 0 (no "step 1/0"); a play/pause stepper
  advances and stops at end and at a breakpoint line.
- `src/ui/ObjectInspector.test.tsx` — expands a nested list/dict, shows typed
  dict keys (int vs str, tuple), stops on a cyclic ref (finite), renders a
  return value, surfaces the `truncated` flag.
- `src/engine/staleness.test.ts` — a `RunResult` with `sourceRev` set is stale
  when `hash32(currentSource)` differs; not stale when equal.
- Extend `scripts/verify_visualizers.mjs` with deque/stack/queue/set/matrix/
  string checks (these assert real trace shape; deque should already pass,
  proving R2's fix; the others fill coverage gaps).
- **Verify:** the behavioral tests FAIL on current code; record failures.

## T2 — R4.1 source/input revision + staleness
- `types.ts`: `RunResult.sourceRev?/inputRev?`.
- `engine.ts`: stamp both on every settled result (result/error/timeout/stop/
  supersede).
- `useEngine.ts`: `isStale(source, stdin)` via `hash32`.
- Workspaces: stale banner + drop stale current-line highlight + hide validated
  complexity while stale.
- **Verify:** `staleness.test.ts` passes; build/lint green.

## T3 — R4.4 expandable inspector
- `ObjectInspector.tsx` (new); `VariablesPanel` uses it; return-value row; frame
  select.
- **Verify:** `ObjectInspector.test.tsx` passes; `VariablesPanel.test.tsx` still
  passes.

## T4 — R4.3 playback
- `useEngine`: play/pause timer, speed, breakpoints, zero-event guard.
- Workspaces: Play/Pause button, speed select, breakpoint toggle, safe label.
- **Verify:** `replay.test.ts` passes.

## T5 — R4.5 diagram verification coverage
- Extend `verify_visualizers.mjs`; keep it green and cross-platform.
- **Verify:** `npm run verify:visualizers` green with the new cases.

## T6 — R4.6 Visualize-as + Playground visualizer
- `VisualizeAs.tsx` (new); Playground visualizer slot; invalid → feedback +
  generic inspector remains.
- **Verify:** build + a browser test that the Playground can visualize a list as
  an array/stack.

## T7 — Full verification + docs
- `npm run check:all` + `test:browser` green; 130 lessons / 29 patterns
  unchanged; clean `__pycache__`; write `verification.md`.

## T8 — PR
- One PR `repair/r4-replay-visualization → main` with the required body sections.
  Do not start R5 until merged.
