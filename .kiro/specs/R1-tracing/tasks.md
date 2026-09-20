# R1 — Tasks

| Task | Requirement | Status | Evidence |
|---|---|---|---|
| Write failing regression corpus first | (test-first) | ✅ | `src/engine/tracer.regression.test.ts`; 5 failed on baseline (R1-A..E) |
| R1.1 remove learner-code-executing inspection | R1-REQ-1, R1-REQ-2 | ✅ | `_safe_label`, base-type container iteration, `_static_instance_dict` via `getattr_static`; tests R1-A/B/C pass |
| R1.2 self-contained snapshots (return fix) | R1-REQ-3, R1-REQ-6 | ✅ | `_record` encodes return/error into the reset table; test R1-D + alias/cycle/tuple-key tests pass |
| R1.3 input()/EOF | R1-REQ-4 | ✅ | `readline` raises EOFError; blank line "", prompt, unicode, successive reads tests pass |
| R1.4 guaranteed cleanup + exit distinct | R1-REQ-5 | ✅ | compile inside try; `SystemExit` → `"exited"`; SyntaxError located; tests pass |
| R1.5 accurate output/exception | R1-REQ-6 | ✅ | caught vs uncaught, print end='', final mutation tests pass |
| Preservation: lesson outputs unchanged | preservation | ✅ | verify:lessons 130 OK, verify:patterns 29 OK, no expectedOutput edits |

No lesson `expectedOutput` was changed. Trace-structure changes did not alter any
legitimate learner stdout, so none was updated (per the milestone rule).
