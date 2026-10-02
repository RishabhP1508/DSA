# R8 — Tasks

| # | Task | Req | Verification | Status |
|---|------|-----|--------------|--------|
| T1 | Pure learning-path logic + prereq-graph validation | R8.1 | `learning-path.test.ts` (12) | done |
| T2 | Wire prereq-graph check into `verify:lessons` | R8.1.1 | check:all | done |
| T3 | `useProgress` hook; Learn view: Continue-learning, view-on-open, mark-complete, status in nav | R8.1 | browser | done |
| T4 | Clickable prerequisites + related patterns; optional external practice per lesson | R8.2 | browser/build | done |
| T5 | Shared Glossary (multi-sense, topic context) + Glossary nav | R8.2.3 | browser | done |
| T6 | Named multi-drafts (source+stdin+binding), restore last, delete; Zod schema extended | R8.3.1 | build + browser | done |
| T7 | Python import (UTF-8/BOM/CRLF, reject binary) → new draft; export; clear save status | R8.3.2 | `python-file.test.ts` (6) + browser | done |
| T8 | Spec docs; run suites; PR | discipline | check:all + test:browser | done |
