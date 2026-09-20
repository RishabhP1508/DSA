# R5 — Tasks

Each task: requirement → defect/gap → affected code → approach → verification → completion evidence.

## T1 — Line-explanation regression (test-first) [R5.2.5, R5.1.1]
- Gap: 5 lessons missing the final line's explanation; 2 lessons have an out-of-range entry.
- Add `scripts/verify_line_explanations.mjs`; wire into `test:curriculum`.
- Verify: FAILS first on the 7 known lessons (recorded), PASSES after T2.
- Done when: script exits 1 before fixes, 0 after; wired into check:all.

## T2 — Repair missing/out-of-range line explanations [R5.2.5]
- count-set-bits +line 11; kth-largest +line 12; prefix-search +line 42;
  adjacency-lists +line 14; connected-components +line 25;
  references-mutation fix line-17 phantom; rotated-array-search fix line-24 phantom.
- Verify: verify_line_explanations green; verify_lessons still green (outputs unchanged).

## T3 — Heaps factual fix (test-first) [R5.2.1–R5.2.3]
- Probe bundled runtime (done: heapify_max/heappush_max/heappop_max exist).
- Add `src/content/heaps.facts.test.ts` (fails first: lesson says "min-only", no *_max).
- Rewrite min-max-heaps to teach native max-heap API + negation alternative; fix indexing/
  construction-vs-op cost; add sift-up/sift-down illustration.
- Re-capture expectedOutput from runtime (code legitimately changed; evidence recorded).
- Review the other 5 heap lessons for the same misconception.
- Verify: heaps.facts.test green; verify_lessons/complexity green.

## T4 — Fixed sliding-window factual fix (test-first) [R5.2.4]
- Add `src/content/sliding-window.facts.test.ts` (fails first on sum(nums[:k]) + O(1) claim).
- Fix sliding-window and string-sliding-window: explicit accumulation, O(k) init note,
  k<=0/k>n handling, prefix-sum alternative note.
- Verify: facts test green; outputs re-captured from runtime if code changed (evidence recorded).

## T5 — Shared example-model verification [R5.1]
- Add `scripts/verify_example_model.mjs`; wire into `test:curriculum`.
- Add structured `complexityExplanation` to each pattern shipping a full walkthrough (R5.1.2).
- Verify: script green; build/lint green.

## T6 — Full-inventory review in 6 batches [R5.3, R5.4]
- Review all 130 lessons + 29 patterns against the checklist; fix defects found.
- Record batch-by-batch findings in verification.md.

## T7 — Research evidence [R5.5]
- Update `docs/references.md` and lesson `references` for every substantial correction with exact
  sections/claims/conventions/access dates. Preserve original references.

## T8 — External practice mappings [R5.6]
- Capture Notion syllabus practice questions; map to lessons/patterns via coverage `externalPractice`
  (title + link only). Record unmapped/unresolved explicitly. No fabricated links.

## T9 — Evidence-based coverage [R5.7]
- Re-verify coverage entries against R5 evidence; bump COVERAGE_VERSION; `gen:coverage`.

## T10 — Verify + PR
- verification.md (what was/was NOT proven, tested commit, remaining failures incl P-RUNNER-ORIGIN).
- Full check:all + test:browser; clean __pycache__; commit; push; open PR into main via gh api.
