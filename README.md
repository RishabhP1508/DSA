# DSA Visual Lab

A fully offline, browser-based application that teaches Python, data structures,
algorithms and problem-solving patterns from zero — with plain explanations,
interactive SVG diagrams, and **real line-by-line Python execution** via a
bundled Pyodide runtime traced with `sys.settrace`.

> **Status: functional-repair milestone (in progress).** The repository contains
> a large amount of built content — 130 lessons, 29 patterns, and the
> execution/tracing engine, visualizers, practice, playground, and persistence
> layers. **However, a repository audit (commit `249a2f8`) found the product does
> NOT yet meet its acceptance criteria.** Confirmed defects include tracing
> inspection that can execute learner code, a snapshot return-value bug, EOF
> mishandling, a non-functional deque visualizer, eager per-exercise Python
> workers, non-unique exercise identifiers, heuristic (not real) resource limits,
> no runner-origin isolation, verification that silently skips items and does not
> run on Windows, and only 3 of ~161 "coding" exercises actually runnable with 0
> external-practice mappings. See `.kiro/specs/R0-baseline/findings.md` for the
> reproduced findings and the R0–R9 repair plan.
>
> **This is not a completion claim.** "Builds successfully" and "sample outputs
> match" do **not** mean the lessons, visualizations, complexity claims, or
> exercises are correct. The current milestone is *functional repair before UI
> redesign*; UI polish and the packaged Windows delivery come afterward.

## Built (present in the repository) — correctness under repair

- **React + TypeScript + Vite** app with a Lesson Workspace, a Pattern Library,
  Practice, a Code Playground, and a Backup view.
- **Real Python execution** in a module worker on a **bundled Pyodide 314.0.7
  (CPython 3.14.2)** runtime served locally from `public/pyodide/` (no network).
- **130 lessons + 29 patterns** registered, with per-line explanations,
  complexity panels, and cited references. *These are being re-verified against
  the plan's definition of done — a passing sample output is not sufficient.*
- **Local persistence** of progress via IndexedDB with JSON backup/restore.

See `docs/coverage.md` for the curriculum inventory and
`.kiro/specs/R0-baseline/findings.md` for what is verified vs. still broken.

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

Requires **Node.js 20+** (any OS). No global Python needed — the app bundles its
own via Pyodide.

```bash
npm install
npm run dev        # http://127.0.0.1:5173
npm run build      # typecheck + production build (outputs dist/, copies pyodide)
```

## Verify

The verification scripts run on **Windows, macOS, and Linux** with only Node
installed (they use the bundled Pyodide, not a system Python). Do **not** assume
a contributor has `nvm`/`pyenv`.

```bash
npm run check:all        # aggregate: build + all content/verification checks
# or individually:
npm run test:python      # bundled-Pyodide tracer/pipeline checks
npm run test:curriculum  # lessons + patterns load & their outputs match
npm run test:exercises   # coding exercises: model solutions pass, mistakes rejected
npm run test:unit        # TS logic/component tests
npm run test:browser     # Playwright browser integration (real UI/execution)
```

> **What a green run does and does not prove.** A passing build or matching
> sample output is **not** evidence that a visualization is correct, that a
> complexity claim holds, that an exercise grades effectively, or that the
> browser UI works. Those require the browser (`test:browser`) and human review.
> A Node-only tracer check does **not** prove the in-browser worker path. See
> `.kiro/specs/*/verification.md` for what each layer actually establishes.

## Contributing content

Read **`AGENTS.md`** first. It is binding: research each topic against the
sources in **`docs/references.md`**, verify claims (cross-checking a second
source), validate the Python by executing it on the 3.14 runtime, record source
provenance, and escalate genuine gaps rather than inventing content.

## Scope (this release line)

Out of scope: multi-file projects, third-party Python packages, native
filesystem/network access, concurrent Python programs.
