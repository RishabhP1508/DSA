# R4 — Replay, source invalidation, inspection, and visualization correctness (Bugfix)

**Depends on:** R1–R3 (all merged). Branched off `main` @ `2a3cc2e`.
**Type:** Bugfix. Scope: make every displayed state correspond to the program
and step currently selected — replay, source-edit invalidation, the object
inspector, the diagram families, and a runtime "Visualize as…" mapping. The
minimum labeled/keyboard-operable controls needed to use and test this; UI
polish is deferred to the UI milestone.

## Defect status re-verified on the current code (post-R2/R3)

| ID | Defect (from R0 findings) | Status now | Evidence |
|---|---|---|---|
| R4-A / R4.5 | `collections.deque` encodes with no `entries`; the deque visualizer always shows "No deque yet." | **ALREADY FIXED by R2** | Probe: `deque([0,1,2])` encodes `{type:"deque", entries:[0,1,2]}`, no `repr`-only path. `index.tsx` routes `model:"deque"` → `DequeVisualizer`; `linked-list-deques.ts` binds `{variable:"dq", model:"deque"}`. R4.5 is re-scoped to **verification coverage** (below). |
| R4-B / R4.1 | Source edits don't invalidate the stale trace/complexity. | **REPRODUCES** | `source` is plain `useState` in all three workspaces; `CodeEditor onChange` only sets it. Nothing clears `useEngine`'s `result`. R2 computes `sourceRev`/`inputRev` but `RunResult` doesn't carry them and the UI never compares. |
| R4-C / R4.4 | Object inspector hides after the first N entries. | **REPRODUCES** | `displayValue` (replay.ts) slices entries at 6 and collapses depth > 2 to `<type>`; `VariablesPanel` renders a flat, non-expandable table; `event.returnValue` is never shown; the `TraceObject.truncated` flag is ignored. |
| R4.3 | Playback controls incomplete; "step 1 of 0". | **PARTIAL** | Prev/Next/Restart/scrub are wired; Play/Pause, speed, and breakpoints are missing; a zero-event run shows "step 1 / 0". |
| R4.6 | No "Visualize as…". | **MISSING** | No runtime binding UI anywhere; the Playground renders no visualizer at all. |

## Expected behavior (testable requirements)

- **R4-REQ-1 (R4.1).** WHEN the learner edits the program source (or the stdin),
  THE SYSTEM SHALL treat the current trace, current-line highlight, and
  complexity/grading panels as STALE for the previous revision: it SHALL stop
  showing them as validated, and SHALL ignore any result still arriving for a
  previous revision. A result SHALL carry the `sourceRev`/`inputRev` it was
  produced from, and the workspace SHALL detect a mismatch against the current
  editor content.
- **R4-REQ-2 (R4.3).** THE SYSTEM SHALL provide functional Play/Pause, Previous,
  Next, Restart, timeline scrubbing, a playback-speed control, and breakpoints on
  executable lines. Breakpoints pause replay BEFORE the next relevant execution
  event (playback breakpoints; they do not suspend already-completed Python).
  Seeking backwards SHALL read recorded states without rerunning. A zero-event
  result SHALL NOT display "step 1 of 0".
- **R4-REQ-3 (R4.4).** THE SYSTEM SHALL provide an expandable inspector for
  variables, container entries, object attributes, typed dict keys (incl. tuple
  keys), references and cycles, and return values. It SHALL NOT permanently hide
  everything after the first six elements; large structures MAY paginate/collapse
  but omitted/truncated data SHALL be identified explicitly (surface the
  `truncated` flag).
- **R4-REQ-4 (R4.5).** Every supported diagram family SHALL have a tested,
  meaningful trace-shape check, INCLUDING deque/stack/queue (currently missing).
  Graph directedness SHALL NOT be inferred merely because reverse edges exist;
  DP cells SHALL NOT all be marked "computed" — only actual values / the current
  cell are shown unless authored state metadata says otherwise.
- **R4-REQ-5 (R4.6).** THE SYSTEM SHALL offer a "Visualize as…" control that maps
  a variable (and optional field path / diagram family) to a supported diagram at
  runtime, rendered through the existing dispatcher. Invalid bindings SHALL
  produce useful feedback and leave the generic inspector available. Mappings
  SHALL read snapshots only and SHALL NOT evaluate Python.

## Preservation requirements (must NOT break)

- No lesson `expectedOutput` changes; 130 lesson / 29 pattern verification stays
  green (this spec is replay/visualization/UI, not content).
- Existing authored bindings keep rendering unchanged through the dispatcher.
- Backward playback still reproduces earlier variables and output exactly (each
  `TraceEvent` is a full immutable snapshot; replay never reruns).
- R1–R3 behavior untouched.

## Acceptance (from the plan §R4)

- The deque lesson displays `dq` throughout its actual lifecycle.
- Every standard visual example has a tested, meaningful state.
- Changing code cannot retain the old diagram or complexity claim.
- Alias and cyclic structures remain navigable.
- Custom node field names work.
- Playback reproduces earlier variables and output exactly.
- Diagram tests check actual rendered relationships, not just object-table shape.
