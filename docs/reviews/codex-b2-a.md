# Codex delegated review — B2-A and loops hint correction

Date: 2026-10-10 (actual UTC clock checked). Authorization: user explicitly delegated technical review and sign-off to Codex. These are delegated-agent reviews, not human reviews.

Baseline: f0213e5. Read the effective registered lesson, including prose, vocabulary, code, every line explanation, predictions, visual bindings, complexity, experiments, exercises, effective hints and recognition overrides. Cross-checked topic-specific primary references recorded in each lesson and docs/references.md.

Machine gate on the reviewed working tree: check:all exit 0; 766 tests / 57 files; 131 lesson and 29 pattern outputs; all 161 coding models and five faulty-variant categories; 164 recognition exercises; 325 hint progressions. Focused regressions failed before correction. Boundary checks execute the bundled Pyodide runtime, including exhaustive Kadane and unique-window oracles. Machine checks support this review but do not establish semantic correctness by themselves.

| Lesson | Reviewed content hash | Assessment |
|---|---|---|
| array-traversal | e074694311042558 | Accumulation, empty sum, and value iteration agree; coding hints corrected to return the tested result instead of printing it. |
| two-pointers | 62f086c53ee27b63 | Sortedness and movement conditions explicit; a middle self-swap does not undo reversal. Operation-only auxiliary-space scope excludes input construction/output. |
| prefix-sums | 8d39720d4e7efcbc | Exclusive prefix endpoints and query assumptions checked; exact working USACO reference replaces missing page. Prefix storage is O(n). |
| sliding-window | 617190ca5146555d | Fixed width works with negative values. O(k) initialization, O(n-k) updates, and valid prefix-sum alternative taught; guards reject invalid widths. |
| kadane | a233d916247460a7 | Nonempty maximum-subarray recurrence checked against exhaustive signed-array oracle. Model uses indexed traversal, avoiding a hidden O(n) slice. |
| in-place-modification | ffc709f8e3ce96fb | Read-before-write and write<=read invariant checked. The displayed equal-index assignment is safe, so the old question premise was corrected. |
| matrix-traversal | a18bdb8bfddf195f | Rectangular traversal and row-major indexing checked; arbitrary empty/jagged rows require O(R+N), not unqualified O(R*C). Model hints return the result. |
| intervals | a1204be518ade3e7 | Closed overlap requires max(starts)<=min(ends). Empty-safe merging, touching/nested/zero-width cases checked. Adaptive sort best case distinguished from worst case. |
| string-frequency | 6378ad9293f6eb22 | Expected hashing costs distinguished from collision worst case; empty and repeated-character counting checked. Function hints return dictionary. |
| string-two-pointers | 2940595d02fe2042 | Palindrome end comparison, empty/singleton behavior, and exact character/case assumptions checked; no inferred normalization. |
| string-sliding-window | d901d2ce508ce111 | Last-seen left boundary never moves backward. Exhaustive binary-string oracle checks repeats and empty input. Hash assumptions stated. |
| string-parsing | 5363bf6fc5194bf7 | Integer conversion already accepts surrounding whitespace; split/strip effects and malformed/empty preconditions checked. Max parser returns a value. |
| palindromes | 8395ca2ac78c8bfd | Exact comparisons and empty case checked; longest-substring adaptation handles both odd and even centers. No false monotone-window optimization claimed. |
| anagrams | 0eba2489bd20916a | Sort copies need linear storage; adaptive best-case sort corrected. Frequency alternatives state alphabet/hash assumptions and normalization conditions. |
| substrings | f73d909defbe3956 | There are quadratically many index pairs but materialized copying/storage is cubic. Cubic character-total formula derived; only suitable objectives admit window methods. |
| maps-sets | b144574b388e816f | Hashability is not synonymous with immutability. Tuple members must be hashable; default mutable objects can be identity-hashable. Operation scope and ordering qualified. |
| hashing-frequency | d30d59dea192c2ea | Sorted display adds k log k to expected counting cost. Counter tie order and empty most-common behavior checked; observed output preserved. |
| duplicate-detection | d7b5e75d70d57aed | Value is not an array index; false pointer removed and actual SVG tested against runtime traces. Constant-space sorting alternative explicitly uses iterative heapsort. |
| loops | a25a71184fd4c0a1 | Re-read complete previously human-approved content after correcting count_evens pseudocode to return its result. Prior human sign-off is archived below; this revised hash receives a delegated review. |

## Prior human approval preserved as history

loops was human-approved at hash fcadc9eb125d967c on 2026-10-04. The effective learner-facing hint changed, correctly invalidating that approval for the new content. Its prior hash/date remain recorded here; the revised lesson is re-read and reviewed by Codex. The other 14 current human approvals are preserved untouched.

## Limits

No claim is made here that remaining curriculum, runner-origin isolation, new UI, or portable Windows delivery is complete. Browser execution is reported separately with its actual commit/tree and browser channel.

Browser evidence: Windows installed Chrome, `npm run test:browser` with PLAYWRIGHT_CHANNEL=chrome: 18 passed / 5 runner-origin specs intentionally skipped, exit 0. The Vite test server did not finish cleanup under the sandbox; after all tests had completed, its verified process alone was stopped and Playwright exited 0. This is recorded rather than concealing the cleanup intervention.

After the 19 exact-item delegated sign-offs, ledger/provenance tests pass (23 tests), coverage evidence passes (131 entries), and counts are 33 reviewed / 127 pending. No other item was signed.

## Sequence-state follow-up (2026-10-10)

Only the changed bindings were re-read and re-signed, preserving prior reviews as history. A targeted evidence selector validates IDs before writing and runs the same real checks. Windows Chrome suite on the pre-sequence-repair B2-B build: 18 passed / 5 runner-origin skips. Focused final sequence/B2/ledger suites: 49 passed. Full integrated checks will run after parallel batch integration; this browser result is not attributed to later renderer changes.
