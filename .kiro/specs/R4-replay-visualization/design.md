# R4 — Design

## Root causes (verified on current code)

1. **R4.1** — `source` is local `useState` in `LessonWorkspace`,
   `PatternWorkspace`, `Playground`; `CodeEditor onChange` only updates it.
   `useEngine` holds `result`/`replayRef`/`position`, replaced only on Run. R2
   added `hash32` + `sourceRev`/`inputRev` on the wire, but `RunResult` doesn't
   carry them and no UI compares them → a stale trace/highlight/complexity
   panel keeps rendering after an edit.
2. **R4.4** — `displayValue` (replay.ts) is a flat stringifier: `entries.slice(0,6)`
   + `", …"`, and `depth > 2 → "<type>"`. `VariablesPanel` renders a flat table
   of the innermost frame's locals; no drill-in, no `returnValue`, ignores
   `TraceObject.truncated`.
3. **R4.3** — `Replay` supports `next/prev/restart/seek` only; no play timer,
   speed, or breakpoints. The workspace label is `step {position+1} / {length}`
   → "step 1 / 0" when `length === 0`.
4. **R4.6** — no runtime binding UI; the Playground has no `<Visualizer>`.
5. **R4.5** — the deque path is already correct (R2); `verify_visualizers.mjs`
   just lacks deque/stack/queue/set/matrix/string coverage.

## Architecture

### R4.1 — source/input revision + staleness

- `types.ts`: add `sourceRev?: number` and `inputRev?: number` to `RunResult`.
- `engine.ts`: when assembling the final `RunResult` (in `handleMessage` on the
  `result`/`error` paths, and on timeout/stop/supersede settle), stamp the
  pending run's `sourceRev`/`inputRev` (already tracked on `PendingRun`). Also
  stamp them on the terminal states so a stale result is identifiable.
- `useEngine`: track `lastRunRev` and expose an `isStale(currentSource, currentStdin)`
  boolean computed as `result && (hash32(currentSource) !== result.sourceRev ||
  hash32(currentStdin) !== result.inputRev)`. Export `hash32` from `protocol.ts`
  (already exported) and reuse it — no new hashing logic.
- Workspaces: pass the live `source`/`stdin` to `useEngine` (or compute staleness
  there) and, when stale:
  - stop highlighting the current line from the old trace (fall back to no
    highlight),
  - mark the visualizer/inspector/complexity area as "outdated — run to refresh"
    (kept visible but clearly not validated; a minimal labeled banner),
  - keep the editor content authoritative.
  A new Run clears staleness (fresh `result` with the current rev). Late results
  from a superseded run are already dropped by the engine's stale-run rejection
  (R2), and now additionally distinguishable by rev.

Rationale: we FLAG rather than hard-clear the trace so a learner who edits then
undoes doesn't lose their place; the flag makes "not validated for this source"
explicit (plan wording: "disable explanations and bindings that no longer
match", "do not retain a stale complexity label"). The complexity panel's
authored association is hidden while stale.

### R4.4 — real expandable inspector

New component `src/ui/ObjectInspector.tsx` (pure, snapshot-only):
- Renders a `TraceValue` against an event's `objects` table.
- Primitives inline; `ref` renders an expandable row (▸/▾) that, when expanded,
  lists the object's `entries` (or attributes) — each entry value is itself an
  `ObjectInspector` (recursion).
- **Cycles**: carry a `Set<ObjectId>` of ancestors on the current path; if a ref
  re-appears on its own path, render `↺ <type> (already shown)` instead of
  recursing (finite).
- **Typed dict keys**: show the key using `keyKind` (quote strings, show tuple
  keys structurally) — the tracer already provides `keyKind`.
- **Truncation**: if `object.truncated`, after the entries show a muted
  "… N shown; more entries were omitted (large structure)" line. Also
  paginate/collapse very large entry lists (show first `PAGE` with a "show more"
  toggle) so the DOM stays bounded — but never PERMANENTLY hide (the audit's
  complaint) — the user can always expand.
- Depth is user-driven (expansion), not capped at 2; a soft auto-expand depth
  keeps the initial view readable.

`VariablesPanel` changes:
- Render each local via `ObjectInspector` instead of the flat `displayValue`
  string (keep `displayValue` for compact SVG cell labels — visualizers still use
  it; it stays).
- Add a "Return value" row when `event.kind === "return"` and
  `event.returnValue` is present, rendered via `ObjectInspector`.
- Allow selecting a stack frame to inspect (a small frame list already exists);
  inspect the selected frame's locals (default innermost).

`displayValue` (replay.ts) is retained for the visualizers' compact cell text,
but the depth-2/6-entry caps there are irrelevant to the inspector now. I will
leave `displayValue` as-is (compact by design) to avoid churn in every
visualizer; the inspector is the "expand" path.

### R4.3 — playback (play/pause, speed, breakpoints, zero-event)

`Replay` (replay.ts) stays the pure state holder. Play/pause is a timer in
`useEngine`:
- `playing: boolean`, `speed: number` (steps/sec; e.g. 0.5×/1×/2×/4×), a
  `setInterval`/`setTimeout` loop that calls `next()` until `atEnd`, then stops.
- `breakpoints: Set<number>` (1-based source lines). When playing, before
  advancing to an event whose `line` is a breakpoint, pause (stop the timer at
  that event). Described as playback breakpoints.
- `toggleBreakpoint(line)`, `setSpeed`, `play`, `pause`.
- Zero-event: `useEngine` already exposes `length`; the workspace label becomes
  `length === 0 ? "no steps recorded" : "step {position+1} / {length}"`, and
  Play/Prev/Next are disabled when `length === 0`.

Controls added to the three workspace toolbars (minimal, labeled, keyboard-
operable): a Play/Pause button, a speed `<select>`, and breakpoint toggling via
clicking a gutter/line indicator is deferred to UI polish — for R4 a small
"breakpoint on current line" toggle button plus a list is enough to test the
behavior. CodeEditor already highlights the current line.

### R4.5 — diagram-family verification coverage

Extend `scripts/verify_visualizers.mjs` with shape checks for **deque, stack,
queue, set, matrix, string** (running real programs on the bundled Pyodide,
asserting the last-event object shape the visualizers rely on):
- deque: `dq.type === "deque"`, `entries` values in order after
  `appendleft`/`append`.
- stack/queue: list `entries` order; front/rear = index 0 / n-1.
- set: `type === "set"`, members present (order-agnostic).
- matrix: outer list of rows, `grid[r][c]` addressable.
- string: `str` value present.
Also assert the two audit caveats where cheaply checkable in the object shape:
graph adjacency remains a dict (direction is a binding concern, not inferred),
and DP cells are values (the visualizer's "computed" marker is authored metadata,
not "non-None"). Keep it green and cross-platform.

### R4.6 — Visualize as…

New component `src/ui/VisualizeAs.tsx`: a small labeled form producing a
`VisualBinding` (`variable`, `model`, optional `path`). It offers the variables
present in the current event and the `SUPPORTED_MODELS` list. Output is a
`VisualBinding` state owned by the consuming view.

- Playground: add a `workspace-right` visualizer slot. When the user picks a
  binding, render `<Visualizer event={engine.event} binding={binding} />`
  alongside the existing `VariablesPanel`. Invalid binding (variable missing, or
  the value doesn't fit the model) → the dispatcher's target visualizer already
  shows a "No X yet" placeholder; we add a small validation note and always keep
  the generic `ObjectInspector` available.
- Lessons/patterns keep their authored bindings; Visualize-as is additive (an
  "also view as" affordance), primarily for the Playground per the plan.
- Mappings read `event`/`objects` only (via the existing helpers) — never eval.

## Files touched

- `src/core/types.ts` — `RunResult.sourceRev?/inputRev?`.
- `src/engine/engine.ts` — stamp `sourceRev`/`inputRev` on every settled result.
- `src/engine/replay.ts` — (unchanged core; `displayValue` retained).
- `src/ui/useEngine.ts` — `isStale`, play/pause timer, `speed`, `breakpoints`,
  `play/pause/setSpeed/toggleBreakpoint`; zero-event safety.
- `src/ui/ObjectInspector.tsx` (new) — expandable inspector.
- `src/ui/VariablesPanel.tsx` — use `ObjectInspector`; show return value; frame
  select.
- `src/ui/VisualizeAs.tsx` (new) — runtime binding control.
- `src/ui/Playground.tsx` — visualizer slot + Visualize-as; stale banner; speed/
  play controls; zero-event label.
- `src/ui/LessonWorkspace.tsx`, `src/ui/PatternWorkspace.tsx` — stale banner;
  play/speed/breakpoint controls; zero-event label.
- `scripts/verify_visualizers.mjs` — deque/stack/queue/set/matrix/string checks.
- Tests (test-first): `src/engine/replay.test.ts` (playback: play/pause/speed
  semantics via a stepper, breakpoints, zero-event), `src/ui/ObjectInspector.test.tsx`
  (drill, typed keys, cycles, returnValue, truncated), `src/ui/staleness.test.ts`
  or a `useEngine` staleness unit (hash32 mismatch), plus the extended
  `verify_visualizers.mjs` acting as the diagram-shape gate.

## Non-goals (deferred)
- Visual polish, gutter breakpoint UI, animation smoothing (UI milestone).
- Per-lesson "Visualize as" persistence (R8 handles Playground draft bindings).
