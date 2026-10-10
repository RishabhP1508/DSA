# Delegated B6 review: DP and recursion

Reviewed on 2026-10-10 by Codex under the user's delegated technical review authorization. All twenty registered DP/recursion lessons and the backtracking, dynamic-programming and knapsack patterns were genuinely read and assessed. The effective curriculum loader was used, so review includes shared exercise hints, recognition blocks, model solutions, test assertions and preludes rather than only raw lesson files.

`codex-b6-lessons.json` is the twenty-item review packet; `codex-b6-patterns.json` is the three-pattern remainder packet. Each records the effective claim hash, every top-level field read, line/explanation count, exact exercise IDs and effective field names, independent checks, exact consulted references and specific assessment. `codex-b6-final-effective.json` preserves the final read state. Central ledger approval and verification evidence remain the parent's responsibility after integration checks.

## Corrections

- Factorial call counts now include the initial call once. Naive Fibonacci uses the exact call recurrence and phi growth. Added negative-index guards where the lesson promises rejection.
- Immutable parenthesis prefixes retain quadratic working characters across frames. Permutations scan all indices at internal prefixes; omitted used-flag restoration loses orderings. The combinations walkthrough prunes prefixes that cannot reach the requested size. The subset reuse experiment now identifies nontermination without an additional stopping condition.
- DP state dimensions are separated from storage dimensions. Allocation, validation, zero-size cases, pseudo-polynomial capacity/amount bounds, expected hashing and growing Python integer bits are explicit. Modern DP includes both memoization and tabulation. Hashability is separated from immutability, and manual base-case caching is analyzed for the code actually shown.
- Stock scanning handles empty input and avoids the copied suffix. Its minimum-price value is shown as a value, while array pointers use indices. A genuine house-robber greedy counterexample replaces the old successful greedy scenario. Minimum-path costs support finite negative cells under right/down acyclic movement and reject every ragged grid, including an empty first row.
- Coin-change sentinels and positivity conditions, 0/1 item layers, descending capacity updates, LIS strictness/global endpoints and LCS prefix recurrences are consistent throughout predictions, review and exercises. Hirschberg's original paper verifies that full-table reconstruction is not universally required.
- Maximum-subarray recursion uses supported inclusive range bindings and counts both recursive-child and crossing-addition lines. N-Queens diagonal labels match rows downward/columns rightward, and its bound includes the candidate-column scans.
- All displayed lines, prerequisite IDs, visual bindings and effective exercises were reviewed. The 23 sources have matching line-explanation counts and valid prerequisite IDs.

## Execution evidence

The original regression run recorded 76/88 passing checks, with twelve failures covering the faulty claims/code. A later boundary regression recorded 88/90, exposing ragged-grid handling and an accidental wrong memoized comparison bound. These red results remain in `codex-b6-test-red.json` and `codex-b6-boundary-red.json`.

The final focused run passes **99/99**, exit 0, using bundled Pyodide314.0.7 / CPython3.14.2 under the app's default event/time/trace limits:

- Twelve content regressions.
- All 23 lesson/pattern sample outputs.
- All thirty coding-exercise model solutions with their effective assertions/preludes.
- Thirty-four actual Python boundary-oracle executions, covering empty/zero/negative/invalid inputs, duplicated values where allowed, Catalan/binomial/factorial counts, cache hit/miss behavior, exhaustive subset/permutation/path/contiguous-sum results, independent coin-graph BFS and real greedy counterexamples.

The final Vitest5.0.3 run passes **10/10**, exit 0: eight new B6 tests and two existing DP-table tests. The new tests execute actual bundled Python traces and assert React SVG output, active factorial/Fibonacci frames, retained immutable prefixes, combination pruning, subsequence pointer identity, stock scalar values, DP coordinates, inclusive recursive ranges, operation counts and queen/cache behavior. The JSON report is `codex-b6-visual-test-results.json`.

Nonfatal test diagnostics report the bundled Pyodide's absent source map and the existing esbuild/oxc configuration overlap; no test failed. The earlier transient Vitest pool-file failure during the parent's dependency upgrade was resolved by the clean Vitest5 rerun.

Repeat the focused checks from the repository root with Windows Node24:

```powershell
& 'C:\Program Files\nodejs\node.exe' --experimental-strip-types --import ./scripts/lib/ts-register.mjs docs/reviews/codex-b6-review.test.mjs
& 'C:\Program Files\nodejs\node.exe' node_modules/vitest/vitest.mjs run src/visualizers/codex-b6-dp-recursion.real.test.tsx src/visualizers/DPTableVisualizer.real.test.tsx --reporter=json --outputFile=docs/reviews/codex-b6-visual-test-results.json
& 'C:\Program Files\nodejs\node.exe' --experimental-strip-types --import ./scripts/lib/ts-register.mjs docs/reviews/codex-b6-packet.mjs
```

Node/Pyodide checks and SVG server rendering do not prove real browser-worker lifecycle, viewport rendering or full UI flows. The parent owns aggregate gates, browser checks, packaging and central ledger/evidence/reference mirroring.

## References and integration

`codex-b6-reference-appendix.md` records the exact actual consulted URLs, sections, verified claims, conventions and access dates. Primary sources include MIT6.006 lectures15/16/18, Stanford backtracking material, Runestone recursion/coin illustrations, Georgia Tech DP notes, Hawaii maximum-subarray notes, NYU/Charlotte knapsack material, Python3.14 documentation, original LeetCode problem definitions and Hirschberg1975. Live Runestone frame/coin figures were inspected; unavailable PDF screenshots are not reported as visual inspection. Source/app indexing, copied/shared prefixes, first-solution/all-count variants, original positive-input constraints and the app's explicit empty/zero/negative extensions are recorded.

The parent applied the two shared-patch files and final tests-feedback file. The final effective check finds **zero pending fields among eighteen distinct shared fields** (nineteen patch rows include a superseding value). The two raw-only exercise changes were already saved in owned lesson files. `codex-b6-override-state.json` records the current comparison. One-time author scripts are audit artifacts and must not be replayed against later integrated content.

Content files changed: `src/content/lessons/dp-{base-cases,recursive-calls,backtracking,subsets,permutations,combinations,memoization,tabulation,1d-2d,knapsack,subsequences,state-transitions,climbing-stairs,house-robber,grid-paths,coin-change,lis,lcs,divide-and-conquer,n-queens}.ts`; `src/content/patterns/{backtracking,dynamic-programming,knapsack}.ts`.

Focused new tests are `docs/reviews/codex-b6-review.test.mjs` and `src/visualizers/codex-b6-dp-recursion.real.test.tsx`. This agent did not edit the shared exercise map, registry, coverage, ledger or evidence, and did not run concurrent aggregate/browser checks or create commits.
