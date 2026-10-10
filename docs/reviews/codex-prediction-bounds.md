# Recorded prediction index validation

Checked on 2026-10-10 by Codex delegated reviewer against the registered effective content, bundled Pyodide 314.0.7 / CPython 3.14.2, and the current production tracer. This is a mechanical recorded-index check. It does not claim a fresh semantic review of all checkpoint prose.

Run from the repository root:

```powershell
& 'C:\Program Files\nodejs\node.exe' --experimental-strip-types --import ./scripts/lib/ts-register.mjs docs/reviews/codex-prediction-bounds.mjs
```

The validator executes all 133 lessons and 29 pattern walkthroughs through `scripts/lib/pyodide-harness.mjs`, including authored stdin. All 162 traces completed and exactly matched their expected stdout. There are 133 checkpoints across 133 lessons and no prediction fields on the 29 patterns. All 133 indices are integers in `[0, events.length)`, and each selected event's recorded index equals its array position. There are zero invalid or unvalidated checkpoints. The results retain each content hash, tracer SHA-256, event counts, selected and following event locations, and checkpoint prompt/answer for further semantic review. Any failed trace remains an error and its checkpoints are marked unvalidated rather than incorrectly signed off.

The first attempt exposed a production inspection regression: `dict.items(frame.f_locals)` rejected CPython's `FrameLocalsProxy` and prematurely ended 132 traces. The apparent two out-of-range application checkpoints were consequences of those failed executions. No checkpoint content was changed. The parent repaired the native frame-locals adapter, then this validator ran all 162 examples again successfully. The final JSON records the repaired tracer hash and passing results.

Sources actually consulted on 2026-10-10:

- [Python 3.14 data model, §3.2.13.2 Frame objects, `frame.f_locals`](https://docs.python.org/3.14/reference/datamodel.html#frame-objects): optimized scopes return a write-through proxy, a documented change from 3.13. The live 3.14 documentation identifies its current maintenance version as 3.14.8; execution validation uses the shipped 3.14.2 runtime.
- [PEP 667, Specification → Python API → The `frame.f_locals` attribute](https://peps.python.org/pep-0667/#the-frame-f-locals-attribute): function scopes expose a mapping proxy; module/class scopes expose the actual namespace. This supports handling native frame mappings without assuming every frame namespace is an exact dictionary. The validator does not mutate a frame namespace or re-execute checkpoint expressions.

Artifacts: `codex-prediction-bounds.mjs` and `codex-prediction-bounds-results.json`. Root retains ownership of the content ledger and evidence regeneration.
