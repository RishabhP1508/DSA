# DSA Visual Lab

A fully offline, browser-based application that teaches Python, data structures,
algorithms and problem-solving patterns from zero — with plain explanations,
interactive SVG diagrams, and **real line-by-line Python execution** via a
bundled Pyodide runtime traced with `sys.settrace`.

> **Status: Phase 1 (foundation).** This branch establishes the architecture,
> the execution/tracing engine, the content model, the research/verification
> instructions for future contributors, and **one fully-researched, verified
> introductory lesson** (Variables and Types) proving the trace → visual
> pipeline. The full curriculum, pattern library, remaining visualizers, and the
> packaged Windows delivery arrive in later phases. See `AGENTS.md`.

## What works today

- **React + TypeScript + Vite** app with a Lesson Workspace: code editor
  (CodeMirror 6) beside a live SVG visualization, playback controls
  (Run/Stop/Prev/Next/Restart + timeline scrubbing), a per-line explanation,
  and an expandable variables / call-stack / output panel.
- **Real Python execution.** Programs run in a dedicated module worker on a
  **bundled Pyodide 314.0.7 (CPython 3.14.2)** runtime served locally from
  `public/pyodide/` — no network needed. Execution is traced into immutable
  per-step snapshots that preserve object identity, aliases and cycles, and are
  replayed forward/backward without rerunning the program.
- **Guardrails:** 10 s / 10 000-event / 16 MB limits, worker termination on
  Stop/timeout (kills infinite loops), and stale-run rejection so a cancelled
  run can never overwrite a newer result.
- **Local persistence** of progress via IndexedDB.
- **One verified lesson** researched against cited sources, with source metadata
  attached.

## Architecture

| Path | Responsibility |
|---|---|
| `src/core/types.ts` | Core interfaces: `LessonDefinition`, `PatternDefinition`, `RunRequest`, `TraceEvent`, `VisualBinding`, reference & progress records |
| `src/engine/tracer.py` | `sys.settrace` recorder producing immutable snapshots (runs inside Pyodide) |
| `src/engine/run.worker.ts` | Module worker: loads Pyodide, runs the tracer, posts back results; rejects stale runs |
| `src/engine/engine.ts` | Main-thread client: run ids, wall-clock timeout via worker termination |
| `src/engine/replay.ts` | Steps through recorded events without rerunning |
| `src/visualizers/` | SVG visualizers (Phase 1: array/list) |
| `src/content/` | Lessons/patterns registry (Phase 1: Variables and Types) |
| `src/ui/` | Workspace, editor, panels, engine React hook |
| `src/storage/` | IndexedDB progress persistence |
| `public/pyodide/` | Bundled offline Python runtime |

## Develop

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"   # ensure Node is on PATH
npm install
npm run dev        # http://127.0.0.1:5173
npm run build      # typecheck + production build (outputs dist/, copies pyodide)
```

## Verify (used by CI/contributors — see AGENTS.md)

```bash
# with the matching interpreter available (pyenv shell 3.14.4):
python scripts/test_tracer.py       # tracer unit checks on local CPython 3.14
node   scripts/verify_pipeline.mjs  # end-to-end trace against the bundled Pyodide
```

## Contributing content

Read **`AGENTS.md`** first. It is binding: research each topic against the
sources in **`docs/references.md`**, verify claims (cross-checking a second
source), validate the Python by executing it on the 3.14 runtime, record source
provenance, and escalate genuine gaps rather than inventing content.

## Scope (this release line)

Out of scope: multi-file projects, third-party Python packages, native
filesystem/network access, concurrent Python programs.
