# R0 — Tasks

| Task | Requirement | Status | Evidence |
|---|---|---|---|
| R0.1 Inspect checkout; reproduce audit findings | R0-REQ-1 | ✅ done | `findings.md` (counts recounted; R1-A..E, R2-A..E, R3-A, R4-A, R0-A..C reproduced) |
| R0.2 Correct README/AGENTS/handoff; add milestone steering | R0-REQ-2, R0-REQ-3 | ✅ done | README status + verify sections; AGENTS validation block; `repo-handoff.md`; `repair-milestone.md` (inclusion: always) |
| R0.3 Cross-platform, no-silent-skip verification | R0-REQ-4, R0-REQ-5 | ✅ done | `scripts/lib/*`; rewritten `verify_*.mjs`; proven: unregistered file → STRUCTURE fail + exit 1 |
| R0.4 Test layers + npm commands | R0-REQ-6 | ✅ done | vitest/RTL/fast-check/playwright installed; 9 unit tests; 2 e2e tests pass; `check:all` green |
| R0.5 Acceptance gate + verification.md | R0-REQ-7 + acceptance 1–5 | ✅ done | `verification.md` |

All R0 tasks capture evidence; none marked done on a build result alone.
