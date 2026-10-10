# Analyzer refusal and comparison integrity — 2026-10-10

The analyzer used “a loop body calls…” on straight-line code such as `value = input()`. The four call-refusal messages now say “the code…” and retain the same conservative refusal classification. The new regression executes the displayed loop-free input/print example on bundled Pyodide and checks all four call categories both with and without a loop. Supported straight-line and bounded-loop classifications are also retained.

Comparison samples now require a completed, complete result, a nonempty printed result record, and a nonnegative safe integer operation count. Failure, interruption, limits, missing output, and malformed counts abort before the next implementation or size starts. The parser uses the final separator because a Python result representation can contain `|`; `None`, `[]`, and zero operations remain valid measurements.

The selector stays disabled throughout a comparison. Stop and unmount invalidate the active request before settling its promise; every awaited result checks that request again before publishing or starting another run. Each component/request has a distinct owner. The engine's optional `stop(owner)` checks the current pending owner atomically, while existing `stop()` callers retain global Stop behavior. Deterministic tests exercise the actual coordinator with injectable workers, including supersession by another view and cancellation after a baseline has completed.

## Representative sizes and actual execution limits

The previous untraced comparison verifier checked algorithm results but did not enforce UI trace budgets. A new failing-first regression uses the exact UI program builder and the actual bundled tracer under its normal 10,000-event and 16 MB limits. The old samples produced three failures: Two Sum baseline at 64, and membership baseline at 32 and 64, all with `trace-limit` and no final printed record. A separate size-64 probe recorded 3,633 events for Two Sum and 2,059 for membership before the byte limit stopped them.

Two Sum now uses `[8, 16, 24, 32]`; membership uses `[8, 12, 16, 24]`. All eight published samples complete both implementations, agree on their results, and produce the independently expected explicit operation counts: `n(n-1)/2` versus `n` for this last-pair Two Sum input, and `3n²/4` versus `n` for this half-present membership input. These counts describe the authored generated inputs, rather than proving a complexity bound. The algorithm code, generators, and theoretical labels are unchanged. No trace or execution budget is raised and failed runs are never accepted as measurements.

Final focused native command (Node 24 / Vitest 5.0.3):

```powershell
& 'C:\Program Files\nodejs\node.exe' node_modules/vitest/vitest.mjs run src/engine/codex-complexity-refusal.real.test.ts src/engine/codex-engine-owner-stop.test.ts src/ui/codex-comparison-result.test.ts src/ui/codex-ComparisonLab.test.tsx src/ui/codex-comparison-budget.real.test.ts src/engine/engine.lifecycle.test.ts src/engine/engine.integrity.test.ts --reporter=dot
```

Result: **71/71 tests passed**, seven files, exit 0. The new budget regression first failed **3/8**, then passed **8/8** after the size changes. The focused suite includes 18 bundled-Pyodide checks, 37 parser/component/ownership checks, and 16 existing coordinator lifecycle/integrity checks. No build or browser run was performed for this change; the Python harness does not establish the browser worker's wall-clock behavior. The UI's existing 10-second execution limit is unchanged.
