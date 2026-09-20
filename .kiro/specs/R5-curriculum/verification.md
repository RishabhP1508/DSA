# R5 — Verification

**Spec:** R5 (Reverify and complete the curriculum). **Type:** Feature (R5.2 handled test-first).
**Branch:** `repair/r5-curriculum` off `main` @ `3c8142d`.
**Runtime of record:** bundled Pyodide 314.0.7 → CPython **3.14.2** (`public/pyodide/pyodide-lock.json`).
**Environment:** Node v22 (nvm); headless Chromium (Linux) for Playwright — NOT Windows Chrome/Edge (R9 gap).

## Baseline re-run before new work (per the working rules)
On `main` @ `3c8142d` BEFORE branching: `npm run check:all` green (build; lint 0 err / 9 warn;
unit 167/167 in 24 files; pipeline; visualizers 27/27; 130 lessons; 29 patterns; 130 complexity
panels; 3 runnable exercises). `npm run test:browser` = 9 passed / 5 skipped (the 5 skips are the
`P-RUNNER-ORIGIN` packaging gate). Confirmed the clean baseline the handoff described.

## What was PROVEN (with the test that proves it)

### R5.2.5 / R5.1.1 — every code line explained (test-first)
- NEW `scripts/verify_line_explanations.mjs` (wired into `test:curriculum`). It **FAILED first** on 7
  lessons (recorded below), then PASSES after the fixes: `ALL LINE EXPLANATIONS OK (130 lessons, 29 patterns)`.
- Fixed line-explanation drift/gaps (all were systematic off-by-one shifts from an inserted blank line,
  or a swapped blank/comment pair — a real correctness defect, not cosmetic):
  - `count-set-bits` (missing L11), `kth-largest` (missing L12), `adjacency-lists` (missing L14),
    `connected-components` (missing L25), `prefix-search` (missing L42 + realigned 27–41).
  - `references-mutation` (removed phantom out-of-range L17), `rotated-array-search` (removed phantom
    L24 + realigned semantic drift in L8–19), `binary-search` (realigned L8–14), `expression-evaluation`
    (swapped L15/L16 blank/comment).
- NO lesson `expectedOutput` changed for any of these (they were explanation-only fixes):
  `verify_lessons.mjs` still reports `ALL 130 LESSON OUTPUTS OK`.

### R5.2.1–R5.2.3 — heaps factual correction (test-first)
- NEW `src/content/heaps.facts.test.ts` — **FAILED first** (3 of 7), now **7/7 pass**.
- Runtime evidence: a probe on the bundled CPython 3.14.2 confirmed `heapify_max`, `heappush_max`,
  `heappop_max`, `heapreplace_max`, `heappushpop_max` all exist, keep the max at index 0 (max-heap
  invariant held on a shuffled 20-element list), and that negation still works. Cross-checked against
  the official Python 3.14 `heapq` docs (each `*_max` function marked *"Added in version 3.14"*; `heapify`
  is linear-time; zero-based indexing).
- `min-max-heaps.ts` rewritten: teaches the native max-heap API AND negation as the portable
  (pre-3.14) alternative; reconciles heapq 0-based vs textbook 1-based indexing; separates O(n)
  `heapify` construction from O(log n) push/pop in the line-linked derivation.
  - **`expectedOutput` legitimately changed** `"1\n0\n1\n8\n"` → `"1\n0\n1\n9\n9\n8\n"`: the OLD code
    taught the factually WRONG "Python only has a min-heap" claim, so the code itself was corrected and
    the new output was captured from the bundled runtime (evidence above). This is the documented
    exception to "don't change expectedOutput" — the old teaching was genuinely wrong.
- Also corrected the "min-only" misconception in `running-median.ts` and `two-heap-pattern.ts` (they
  still negate the lower half — now framed as a portable technique, not a necessity). Their
  `expectedOutput` is UNCHANGED (prose-only edits). `heap-sort.ts` was already correct.

### R5.2.4 — fixed sliding window (test-first)
- NEW `src/content/sliding-window.facts.test.ts` — **FAILED first** (3 of 5), now **5/5 pass**.
- `sliding-window.ts`: replaced `sum(nums[:k])` (an O(k) slice that broke the O(1)-aux claim) with an
  explicit accumulation loop; states O(k) init + O(n−k) slide = O(n); guards `k <= 0` / `k > n`
  (prints `None`); notes prefix sums are a valid O(n)-time / O(n)-space alternative.
  - **`expectedOutput` UNCHANGED** (still `"9\n"`): the answer was already correct; only the method and
    the space claim were fixed. Output re-confirmed from the runtime.
- `string-sliding-window` is a VARIABLE-size window (no fixed k, no first-window slice); left as-is,
  checked only against the slice-vs-O(1) rule.

### R5.1 — shared executable-example model
- NEW `scripts/verify_example_model.mjs` (wired into `test:curriculum`) — **FAILED first** for all 29
  patterns (they had only a `complexityNote`), now `EXAMPLE MODEL OK (130 lessons, 29 patterns)`.
- Added an optional `complexityExplanation` to `PatternDefinition` and authored a structured one for
  **all 29 patterns** (variables, cost model, time/space bound + explanation, line-linked derivation,
  assumptions, tradeoffs, an executing counter, fixed-data note). The verifier proves every derivation
  line is IN RANGE and every counter actually EXECUTES on the walkthrough input — so the line links and
  counters are internally consistent, not decorative.
- All 130 lessons already carried a full `complexityExplanation` + references (from R4); the verifier
  confirms that too.

### R5.3 / R5.4 — full-inventory review + Python-specific complexity
- A review-scan (temporary) checked all 130 lessons + 29 patterns for: blank/comment lines wrongly
  marked executable, "Blank line" text on a non-blank line, prerequisites that don't resolve to a real
  lesson, O(1)-aux claims with a slice, the "min-only" misconception, and stale bindings (a `variable`
  absent from the code). After the fixes above the scan is **CLEAN** (0 flags).
- Manual spot-checks across the 6 batches confirmed complexity CLAIMS are sound where checked:
  quick-sort (avg O(n log n), best/worst cases stated), dp-lcs (O(m·n)), kmp (O(n+m) with the correct
  amortized argument), bucket-sort (expected O(n+k) with the uniform-distribution assumption + skewed
  worst case). Python-specific costs are taught correctly: the deque lesson explains `list.pop(0)` /
  `list.insert(0,x)` are O(n) vs `deque.popleft`/`appendleft` O(1); every BFS lesson uses
  `collections.deque` (not `list.pop(0)`); 29 lessons discuss recursion depth / O(h) stack.

### R5.5 — research workflow / recorded evidence
- `docs/references.md` gained topic entries for `heaps/min-max` (the 3.14 correction, with the exact
  docs sections/claims + runtime-probe evidence + access date 2026-09-20), `arrays/sliding-window`
  (the O(k)-slice correction), and `patterns/complexity`.
- `min-max-heaps.ts` references now point at the Python **3.14** heapq docs with the `*_max` claims and
  the 0-based-vs-1-based conventions recorded.

### R5.6 — external practice mappings
- **Was 0 mappings.** Now 79 canonical LeetCode problems mapped across 61 of the 130 coverage subtopics
  (`EXTERNAL_PRACTICE` in `coverage.ts`, applied to entries; titles + links only, no problem statements
  copied). Two coverage unit tests assert each URL is a canonical `/problems/<slug>/` link and that any
  entry with external practice also teaches the technique locally (`lessonId` present).

### R5.7 — evidence-based coverage
- `COVERAGE_VERSION` bumped 12 → 13 (the required set changed: content corrected + external practice
  added). `scripts/gen_coverage_md.mjs` extended with an external-practice column + summary;
  `docs/coverage.md` regenerated (130/130 verified, v13).

## Full suite results (tested commit = the tip of `repair/r5-curriculum`)
- `npm run check:all`: **green** — build OK; lint **0 errors / 9 pre-existing warnings**; unit
  **181/181** across 26 files (baseline 167/24, +14: heaps.facts 7, sliding-window.facts 5, coverage 2);
  pipeline OK; visualizers OK; **130 lessons** OK; **29 patterns** OK; **130 complexity panels** OK;
  **line explanations 130 + 29** OK; **example model 130 + 29** OK; **3 runnable exercises** OK.
- `npm run test:browser`: **9 passed / 5 skipped** (the 5 skips = `P-RUNNER-ORIGIN`, unchanged).

## What was NOT proven / remaining failures & gaps
- **`P-RUNNER-ORIGIN`** (release-blocking, carried from R2): the real two-origin runner topology (app
  origin ≠ runner origin, bridge served cross-origin with CSP, Chrome + Edge through the bridge,
  non-loopback blocked) is NOT proven — it remains the 5 skipped Playwright specs and belongs to
  packaging, not R5.
- **Notion external-practice reconciliation (OPEN GAP for the user).** The Notion syllabus is a
  client-rendered page whose exact question list could not be enumerated in this environment, and
  LeetCode blocks automated destination checks (HTTP 403). The 79 mapped problems are a CONSERVATIVE
  canonical subset chosen from long-standing, unambiguous LeetCode slugs — no link is a guess — but the
  set has NOT been reconciled against the live Notion page, and individual destinations were not
  auto-verified. Recorded in `coverage.ts`, `docs/coverage.md`, and here. **Please confirm/extend
  against the live Notion page during review.**
- **Big-O correctness is human-reviewed, not machine-proven.** `verify_example_model.mjs` proves the
  complexity panels are STRUCTURALLY complete and internally consistent (lines in range, counters
  execute); it does not prove the asymptotic CLAIM. Full authored-complexity correctness for every
  implementation, observed-statistic corrections, and conservative AST analysis are **R7**.
- **Batch review is spot-checked, not exhaustive per claim.** The automated scan covers the mechanical
  defect classes across all 159 items; the semantic complexity/teaching review was sampled across all 6
  batches, not asserted line-by-line for every lesson. No new factual defect was found beyond those
  fixed here, but "every claim independently re-derived" is not asserted.
- Headless Chromium ≠ Windows Chrome/Edge (R9 gap). No UI redesign or packaging work was done (correct
  for this milestone).

## Preservation confirmed
- No lesson/pattern/exercise or coverage entry was dropped (130 lessons, 29 patterns, 130 coverage
  entries, 381 exercises unchanged in count).
- The only `expectedOutput` changed was `min-max-heaps` (old teaching was factually wrong; new output
  captured from the runtime, evidence recorded). All other lesson outputs are byte-identical.
