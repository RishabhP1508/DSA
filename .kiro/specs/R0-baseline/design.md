# R0 — Design

## Cross-platform verification (R0-REQ-4, R0-REQ-5)

Root cause of the Windows breakage: verify scripts imported modules with a bare
absolute path (`await import(path.join(root, ...))`), which is not a valid ESM
specifier on Windows (`ERR_UNSUPPORTED_ESM_URL_SCHEME`). Root cause of silent
skips: content was extracted with regexes that `return null` on a miss and the
caller logged "skipped" and continued.

**Approach:** make the app's real `registry.ts` the single source of truth, and
build shared, file-URL-safe infrastructure under `scripts/lib/`:

| Module | Responsibility |
|---|---|
| `ts-register.mjs` + `ts-resolver.mjs` | ESM loader hook that resolves the app's Vite-style extensionless relative imports to `.ts`/`.tsx`, so scripts can `import` the real `registry.ts` with Node's `--experimental-strip-types`. |
| `load-curriculum.mjs` | `loadCurriculum()` returns the registered `lessons[]`/`patterns[]` plus a list of structural `errors`; it cross-checks file count vs registered count and validates each definition. `collectExercises()` flattens exercises with `ownerKind`/`ownerId`. |
| `pyodide-harness.mjs` | `getPyodide()`/`runProgram()` load the bundled Pyodide + `tracer.py` using `pathToFileURL(...).href` (Windows-safe). |

All `verify_*.mjs` scripts are rewritten on top of these. A missing/malformed/
unregistered item now produces a `✗ STRUCTURE` error and a non-zero exit.

## Test layers (R0-REQ-6)

- **Vitest** (jsdom, automatic JSX runtime) for TS logic + React component tests;
  `tsconfig.test.json` type-checks tests, while `tsconfig.app.json` excludes them
  so the production build stays clean.
- **@testing-library/react** for component behavior; **fast-check** for
  properties (e.g. `mdInline` escaping).
- **@playwright/test** drives the built app in Chromium (closest engine to the
  Windows Chrome/Edge targets); `webServer` builds + previews on `127.0.0.1`.
- **Bundled Pyodide** checks reuse the harness above.

## Evidence discipline (R0-REQ-7)

Every script and doc states the boundary explicitly: Node/Pyodide checks prove
the Python path; only `test:browser` + human review prove the browser/UI; a build
or matching sample output proves neither correctness nor UI behavior.
