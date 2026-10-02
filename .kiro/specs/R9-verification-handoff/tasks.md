# R9 — Tasks

| # | Task | Req | Verification | Status |
|---|------|-----|--------------|--------|
| T1 | Run all verification layers on the integrated tree (R6+R7+R8 merged locally) | R9.1 | check:all exit 0; browser 17/5 | done |
| T2 | Offline behaviour test (block non-loopback; boot + run Python) | R9.2 | `e2e/offline.spec.ts` | done |
| T3 | Recheck every audit finding in a table | R9.3 | `audit-recheck.md` | done |
| T4 | Produce the handoff (counts, test counts, blocked criteria, versions, commit) | R9.4 | `handoff.md` | done |
| T5 | State the Windows-browser gap + manual procedure; STOP before UI/packaging | R9.1.2 / R9.5 | `verification.md` | done |
| T6 | Keep the PR clean (R9 artifacts only on `main`); PR | discipline | PR | done |

## Note
The integrated audit (unit 625/37, 135 runnable, 77 recognition, 212 hints,
browser 17/5) was measured on a local merge of #18+#19+#20. The final close-out
must be re-run on `main` once those merge.
