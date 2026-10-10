# DSA completion — delegated Codex takeover

On 2026-10-10 the user explicitly delegated technical curriculum review and
sign-off to Codex and authorized completion of the new UI and offline Windows
package. This supersedes the older requirement to pause for human approval of
each review batch. It does not permit fabricated reviews or blanket sign-off.

Baseline: `f0213e5` (PR #30 merged). There are 131 lessons and 29 patterns:
15 existing human-approved items and 145 pending items. Existing approvals and
their hashes/dates are preserved. New reviews record `reviewer: Codex` and
`reviewerKind: delegated-agent`; they are technical reviews, not human reviews.

Working branch: `codex/remaining-repairs`. Kiro must pause to avoid concurrent
repository edits. No existing repair branch is reset, rebased, or recreated.

## Completion order

1. Reproduce the locked-dependency baseline on Windows; review the effective
   registry in batches, including authored exercise overrides and visual states.
2. Correct factual defects with regression evidence and actual consulted pages.
   Sign only items genuinely read at their current content hash.
3. Complete cooldown scheduling and concurrent-overlap teaching (FU-1/FU-2),
   including diagrams, local exercises, and exact Notion practice mappings.
4. Complete the two-origin runner topology and replace the five pending security
   tests with executed production-topology acceptance tests.
5. Build the new UI from scratch around existing functional contracts; connect
   prediction checkpoints (FU-3), then test responsive/keyboard/zoom behavior.
6. Deliver a portable Windows ZIP, launch/stop commands, notices, source,
   backups, and offline verification on this Windows host in Chrome and Edge.

## Evidence so far

- Clean `npm ci --ignore-scripts` succeeded with the exact committed lockfile.
- Baseline `check:all` returned exit 0 on `f0213e5`, including 736 unit tests,
  131 lesson outputs, 29 pattern outputs, and all exercise verification gates.
- Five dependency advisories were discovered by a real npm audit. They are
  tracked for release hardening, with major test-tool upgrades evaluated before
  adoption rather than applying `audit fix --force` blindly.
- B2 first-pass regressions reproduced five concrete teaching defects: reversal
  self-swap described as undoing reversal; return-vs-print hint mismatch;
  misleading rejection of valid prefix sums; sliced Kadane model contradicting
  constant auxiliary space; and a write-pointer question with a false premise.
  Five assertions failed before edits; all six tests passed after corrections.

Reviews and remaining acceptance criteria are in progress. This document does
not claim that the application or the outstanding curriculum is complete.

## B2-A closeout

18 Arrays/Strings/Hashing lessons plus a corrected loops hint were genuinely reviewed and signed at their exact current hashes. Current status: 33 approved / 127 pending (14 preserved human approvals and 19 delegated-agent Codex reviews). Full gate: 766 unit tests, all curriculum and exercise gates passed. Windows Chrome: 18 passed / 5 pending runner-origin specs. See docs/reviews/codex-b2-a.md for findings, historical loops approval, boundary oracles, and the test-server cleanup intervention.
