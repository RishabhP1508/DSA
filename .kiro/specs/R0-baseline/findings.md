# R0.1 — Baseline inspection & audit-finding reproduction

**Inspected commit:** `249a2f832579de8a8eb7459f5b566402a6d8cd11` (branch `main`, matches the audited baseline).
**Working tree:** clean at inspection time.
**Runtime:** bundled Pyodide reports CPython **3.14.2** (`public/pyodide/pyodide-lock.json`); local validation interpreter CPython **3.14.4** via pyenv. Node **22**.

This document records what I independently verified. Nothing here is taken on trust from the audit — every quantitative claim was recounted and every qualitative defect was reproduced with a script or a direct code read.

## Quantitative counts (recounted)

| Metric | Audit | My count | Match | Notes |
|---|---|---|---|---|
| Lessons registered | 130 | 130 | ✅ | `src/content/lessons/*.ts` |
| Patterns registered | 29 | 29 | ✅ | `src/content/patterns/*.ts` |
| Coverage entries | 130, all `verified` | 130 verified | ✅ | the lone `status: "planned"` grep hit is the `e()` helper default, not an entry |
| Exercises | 381 | 381 | ✅ | choose-approach 161 + complete-code 88 + fix-mistake 73 + predict-state 59 = 381 |
| "Coding exercises" | 161 | 161 | ✅ | These are the **choose-approach recognition** drills. NOTE: the audit's "coding exercises" label = recognition exercises; the genuinely *code-runnable* exercises (with a `tests` field) are only 3. |
| Exercises with executable tests | 3 | 3 | ✅ | only `ll-complete-1`, `llr-complete-1`, `dpcs-complete-1` |
| External practice mappings | 0 | 0 | ✅ | no `externalPractice` anywhere |
| Reference records | 309 / 188 URLs | 309 / 188 | ✅ | |
| Lesson sample outputs | passing | passing | ✅ | `verify_lessons.mjs` green |
| Pattern walkthrough outputs | passing | passing | ✅ | `verify_patterns.mjs` green |
| Production build | passing | passing | ✅ | `npm run build` green |

**Interpretation:** the counts are accurate, but they measured the wrong things for "done." 381 exercises exist, yet only **3** actually run and grade code; **161 "coding exercises" are recognition prompts** the earlier work self-graded; **0** external practice mappings despite the plan requiring them; and "130/130 verified" reflects *sample-output* checks, not the plan's definition-of-done.

## Qualitative defects — reproduction status

### R1 — Python tracing (reproduced via `tracer.py` loaded on CPython 3.14.4)

| ID | Defect | Reproduced? | Evidence |
|---|---|---|---|
| R1-A | Inspection executes learner `__repr__` | ✅ YES | Object with side-effecting `__repr__`: counter incremented to 1 during inspection (fallback path calls `repr()`). |
| R1-B | `__dict__` property/descriptor invoked | ✅ YES | `_encode_object` uses `getattr(obj, "__dict__", None)`; a `@property __dict__` with a side effect fired (log length 1). |
| R1-C | Container subclass override called | ✅ LIKELY | `isinstance(obj, dict)` then `obj.items()` calls an overridden `items`/`__iter__`. (Code-read; same class as A/B.) |
| R1-D | Object table reset after return value encoded | ✅ YES | `returnValue=rec._encode_value(arg)` is evaluated as an argument BEFORE `_record` runs `self._obj_table = {}`; 1 return ref unresolved in its snapshot for `def make(): return [1,2,3]`. |
| R1-E | EOF returns empty string with `completed` status | ✅ YES | `input()` with no supplied stdin → status `completed`, stdout `got: ''`; should raise `EOFError`. |
| R1-F | `rstrip("\n")` on input | ✅ code-read | strips a supplied blank line to "" (acceptable) but also mis-handles trailing-newline semantics; revisit in R1.3. |

### R2 — Worker lifecycle / limits / isolation

| ID | Defect | Reproduced? | Evidence |
|---|---|---|---|
| R2-A | Eager per-exercise Python workers | ✅ YES | `ExercisePanel` → `useExerciseRunner` → `new ExecutionEngine` per panel; worker eagerly runs `loadPyodideRuntime()` at module load. Practice renders many panels. |
| R2-B | Runs can inherit imported-module mutations | ✅ code-read | tracer keeps `dsa_tracer` in `sys.modules` and the worker persists; `prog_globals` is fresh but imported modules persist across runs in a worker. |
| R2-C | Byte limit is a heuristic, not real bytes | ✅ code-read | `_rough_size` counts approximate object shapes, not encoded JSON bytes; 16 MiB budget not truly enforced. |
| R2-D | No separate runner origin / CSP | ✅ code-read | worker runs same-origin; no origin/CSP boundary. |
| R2-E | Limit relies on a Python control exception | ✅ code-read | `_StopTracing` can be caught by learner `except BaseException`; worker not force-terminated on limit. |

### R3 — Progress / identifiers / backups

| ID | Defect | Reproduced? | Evidence |
|---|---|---|---|
| R3-A | Non-unique exercise IDs across owners | ✅ YES | e.g. `ms-choose-1` exists in both `matrix-search` and `maps-sets` lessons; storage keys on the bare exercise id. |
| R3-B | Backup validation shallow | ⏳ to confirm in R3 | `validateBackup` checks section presence but not nested record shapes. |

### R4 — Replay / inspection / visualization

| ID | Defect | Reproduced? | Evidence |
|---|---|---|---|
| R4-A | Deque adapter broken | ✅ YES | `collections.deque` encodes as `{type:"deque", repr:"deque([...])"}` with **no `entries`**; `DequeVisualizer` always shows "No deque yet." The deque lesson passes only because `verify_lessons` checks stdout, not the diagram. |
| R4-B | Source edits don't invalidate stale trace/complexity | ⏳ to confirm in R4 | `LessonWorkspace` keeps `source` state; needs UI-level check. |
| R4-C | Object inspector hides after first N entries | ⏳ to confirm in R4 | per audit; confirm in R4. |

### R0.3 — Cross-platform verification

| ID | Defect | Reproduced? | Evidence |
|---|---|---|---|
| R0-A | Windows-invalid dynamic import | ✅ YES | all verify scripts do `await import(path.join(root, ...))` — a bare absolute path, which throws `ERR_UNSUPPORTED_ESM_URL_SCHEME` on Windows (needs `pathToFileURL`). |
| R0-B | Silent-skip regex extraction | ✅ YES | `verify_lessons.mjs`/`verify_patterns.mjs` `return null` on regex miss → logs "skipped" and `continue`s WITHOUT failing; a reformatted lesson silently drops from the count. |
| R0-C | bash/nvm/pyenv-only instructions | ✅ YES | `AGENTS.md` validation block hardcodes `nvm`/`pyenv`; not runnable on Windows as written. |

## Conclusion

**The audit is accurate.** The application builds and its sample outputs match, but it does **not** meet the plan's definition of done: unsafe tracing inspection, an object-table return bug, EOF mishandling, a non-functional deque visualizer, eager per-exercise workers, non-unique exercise IDs, heuristic (not real) resource limits, no runner isolation, silently-skipping / Windows-broken verification, and only 3 of ~161 coding exercises actually runnable with 0 external-practice mappings.

Prior "only Phase 5 remains" and "130/130 verified = complete" claims are **disproved**. Repair specs R1–R9 are warranted. This findings file is the source of truth for which defects must be closed with regression tests.
