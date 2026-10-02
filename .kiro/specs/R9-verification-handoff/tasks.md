# R9 — Tasks

| # | Task | Req | Verification | Status |
|---|------|-----|--------------|--------|
| T1 | Run all verification layers on the integrated tree (R6+R7+R8 merged locally) | R9.1 | check:all exit 0; browser 17/5 | done |
| T2 | Offline behaviour test (block non-loopback; boot + run Python) | R9.2 | `e2e/offline.spec.ts` | done |
| T3 | Recheck every audit finding in a table | R9.3 | `audit-recheck.md` | done |
| T4 | Produce the handoff (counts, test counts, blocked criteria, versions, commit) | R9.4 | `handoff.md` | done |
| T5 | State the Windows-browser gap + manual procedure; STOP before UI/packaging | R9.1.2 / R9.5 | `verification.md` | done |
| T6 | Keep the PR clean (R9 artifacts only on `main`); PR | discipline | PR | done |
| T7 | Re-confirm on canonical `main` after R6–R9 merge; correct counts | R9.1 | `main` 30533a2: check:all exit 0; browser 18/5 | done |
| T8 | Carry the 160 pending human semantic reviews into the audit as an open requirement; do NOT mark "ready for UI review" | R9.4 | handoff.md §10 | done |
| T9 | Reread changed learner-facing content in recorded batches; sign off only reviewed items | R9.4 | ledger `REVIEWED_NOW` + `SIGNOFF_DATE` | **open (2/160: io, errors agent-reviewed; 158 pending)** |

## Note
The original integrated audit (unit 625/37, 135 runnable, 77 recognition, 212
hints, browser 17/5) was measured on a local pre-merge merge of #18+#19+#20. It
has now been **re-confirmed on canonical `main` = 30533a2** (R6 amendment
included): unit **476/38**, **161/161** runnable with authored faulty variants,
**164** recognition, **325** hints, browser **18/5**. The "re-run on main once
those merge" item is discharged.

**Still open:** human semantic review of the R6–R8-changed learner-facing content
is pending (158/160 `semanticReview: false`; 2 agent-reviewed so far — `io`,
`errors`). Close the rest in recorded batches before claiming "ready for UI
review" — see handoff.md §10.
