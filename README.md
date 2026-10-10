# DSA Visual Lab

Learn Python, data structures, algorithms and problem-solving patterns with
plain explanations, original exercises and diagrams driven by real Python runs.
The application runs locally and stores learning data in your browser.

The curriculum contains **133 lessons and 29 pattern guides**. All 162 items
have content-hash-bound review records, preserving the user's prior approvals
and recording the technical reviews explicitly delegated to Codex. Automated
checks enforce review integrity; they do not substitute for subject review.
The Notion practice manifest retains 79 occurrences / 75 unique questions, with
all occurrences mapped. Additional practice is labelled separately.

The new interface includes a learning path, readable lessons, a code-and-diagram
workspace, recognition practice, a Python playground, a glossary and backups.
[Completion records](docs/completion.md) distinguish current results from the
historical Kiro audit and repair reports.

## Run the Windows package

Extract the entire Windows x64 ZIP and double-click **Start.cmd**. The default
browser opens `http://127.0.0.1:8765`. **Stop.cmd** stops this build's servers.
No installed Node, Python, API key or internet connection is required. A current
Windows Chrome or Edge must be installed. Keep the extracted folder together.

The separate Python runner uses port 8766. The launcher reuses an already-running
matching build and reports occupied ports instead of stopping other apps.

Progress belongs to the browser profile. Use **Backup → Export backup** before
changing browser or computer. Restore validates the file and saves a previous
snapshot; the Backup page can recover that snapshot. Imported Python becomes a
draft and runs only when you choose Run.

## Develop

Use Node 24 or newer and the locked dependencies:

```sh
npm ci
npm run dev
```

Vite alone is useful for UI development. For real Python's isolated topology:

```sh
npm run build
node desktop/server.mjs
```

Open `http://127.0.0.1:8765`. Verification commands:

```sh
npm run check:all
npm run test:browser
```

The browser suite uses installed Chrome or Edge when `PLAYWRIGHT_CHANNEL` is
`chrome` or `msedge`; otherwise install Playwright's Chromium. Tests need native
loopback access and normal writable temporary directories. See [Windows
packaging](docs/windows-package.md) for the pinned runtime and release checks.

## Architecture and supported programs

- React, TypeScript, Vite, shadcn/ui, Tailwind, CodeMirror and local fonts.
- Bundled Pyodide 314.0.7 / CPython 3.14.2; a fresh worker per run on a separate
  origin, validated messages and restrictive network policy.
- Immutable `sys.settrace` snapshots; playback never reruns code. A line event
  records the state **before** the highlighted line executes.
- Single-file programs with functions, recursion, ordinary classes, containers
  and documented DSA standard-library modules.
- Limits: 10 seconds of execution, 10,000 trace events and 16 MiB trace data.
  Stop terminates the worker. Large snapshots and diagrams identify omissions.
- IndexedDB stores progress, preferences and drafts; JSON backups transfer them.

Multi-file projects, third-party packages, native filesystem access, networking
and concurrent Python programs are outside this release. Built-ins show observed
effects; explicit teaching implementations reveal internal steps. Personal-code
explanations describe syntax and recorded changes without guessing intent.

See [coverage](docs/coverage.md), [sources](docs/references.md),
[design](docs/design.md) and [AGENTS.md](AGENTS.md). Lessons, exercises and SVG
diagrams are original. Distributed dependencies retain their license notices.