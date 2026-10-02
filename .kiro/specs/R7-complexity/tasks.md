# R7 — Tasks

| # | Task | Req | Verification | Status |
|---|------|-----|--------------|--------|
| T1 | Rework observed stats: exclude module entry; separate categories; per-step | R7.2 | `complexity.test.ts` (5) | done |
| T2 | ComplexityPanel: at-this-step + whole-run columns, honest labels | R7.2 | tsc/build + browser | done |
| T3 | Conservative AST analyzer (Python `ast`) with not-determined states | R7.3 | `verify:complexity-analysis` (9) | done |
| T4 | Run analyzer in the worker; carry `analysis` through protocol/RunResult | R7.5 | build + browser | done |
| T5 | PersonalComplexityPanel (static + observed + worksheet) in Playground | R7.5 | `personal-complexity.spec.ts` | done |
| T6 | Literal-vs-generalized: `fixedData` from authored `fixedDataNote` | R7.4 | build | done |
| T7 | ComparisonExperiment type + data + verifier + ComparisonLab UI | R7.6 | `verify:comparisons` | done |
| T8 | Wire new verifiers into `test:curriculum`; spec docs; run suites; PR | discipline | check:all + test:browser | done |
