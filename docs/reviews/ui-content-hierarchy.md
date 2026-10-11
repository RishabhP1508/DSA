# UI content hierarchy audit

This repair addresses the crowded reading and exercise pages reported after the
1.0.0 release. It applies the same hierarchy to Home, Learn, Patterns, Practice,
Playground, Glossary, Backup and search. Curriculum claims, Python execution,
grading and saved-progress formats remain unchanged.

## Defects and changes

| Observed issue | Change |
|---|---|
| Pattern section headings were 14px with no section spacing | Numbered sections with 24px headings, readable body text and a 72ch reading width |
| Exercise panels had zero padding; choices and actions appeared joined | Shared exercise panels, stacked radio rows, spaced actions and separate feedback/hint/model areas |
| Topic titles and individual lessons looked alike in Learn | Topic headings, counts and indented lesson groups |
| Supporting pages used inconsistent titles and wrappers | One main h1 per page and consistent section headings |
| Inline emphasis and code markers appeared as raw punctuation | Escaped inline formatting for authored prose, prompts and hints |
| Long selects widened 320px pages | Shrinkable controls and stacked comparison labels |
| Dark code used light-theme syntax colors | Theme-aware token colors, contrast checks and editor-state preservation |
| Native 200% zoom clipped lower navigation destinations | A scrollable rail, verified by reaching Backup without forced clicks |
| A responsive rule hid the Pattern complexity note | The complete note is now a numbered main reading section |

## Verification scope

`e2e/ui-hierarchy.spec.ts` checks all seven main pages at 320, 390, 768 and
1440 CSS pixels, dark theme, search, outline links, real graded feedback,
progressive hints and coding fail/pass results. It visits every tab of every
lesson and pattern at both desktop and mobile widths: 133 lessons plus 29
patterns, four tabs each, 648 screens per width. These are rendered DOM/layout
checks; representative screenshots receive a separate visual review.

`e2e/ui-native-zoom.spec.ts` selects 200% in Chrome/Edge Settings in a fresh
profile. It verifies an unchanged native window, halved CSS viewport, doubled
device pixel ratio and visualViewport.scale of 1. It then checks all seven
pages, eight representative learning tabs and search. It does not use CSS
scaling or force-click clipped navigation.

The existing browser suite still covers execution, source-edit invalidation,
playback, backup integrity, keyboard navigation, imports and the separate runner
origin. The aggregate checks still execute every standard Python example and
coding model, reject authored faulty solutions and validate current review
evidence. No passing UI test grants curriculum sign-off.

## Completed source and browser checks

Checks completed on Windows on October 10, 2026 (October 11 UTC).

| Check | Exact tested commit | Result |
|---|---|---|
| `npm run check:all` | `fb0053f48df6a04c6223e6ddf10f2fee229ebb93` | Exit 0; 1,007 tests across 94 files |
| Complete Windows Chrome suite | `470ca3038d1471d1d345f897eddd7a24fbd80ea0` | 52/52, zero skips |
| Complete Windows Edge suite | `470ca3038d1471d1d345f897eddd7a24fbd80ea0` | 52/52, zero skips |
| Every learning tab, desktop and mobile | Same browser commit | 648 at 1440px plus 648 at 390px, per browser; zero hierarchy/layout findings |
| Native 200% browser zoom | Same browser commit | All seven pages, eight learning tabs and search pass in both browsers |
| Syntax readability | Same browser commit | Actual computed light/dark token contrast is at least 4.5:1 |

Only browser tests changed between the two tested commits. The production UI,
engine, content and storage are identical. All 133 lesson and 29 pattern outputs
pass; all 163 coding models pass and reject each of the five faulty variants;
166 recognition exercises and 329 hint progressions pass. Content hashes and
all 162 current curriculum review records remain unchanged. Lint reports zero
errors and 33 warnings, including the intentional internal formatting-marker
regex. The existing 25 semantic consistency advisories remain documented.

The first full Chrome attempt exposed two test setup assumptions: a selector
expected the old shared `reason` name, and the native zoom context inherited
Playwright's DPR emulation. The corrected test uses the labelled reason group
and clears emulation. A short temporary profile also avoids Windows long-path
limitations when Chrome writes its preferences. The final complete runs above
pass with zero retries; no application assertion was disabled.

Supporting pages, empty search/filter states and representative learning screens
received a separate screenshot review at desktop, mobile and dark theme. These
checks establish the tested hierarchy and behavior; they do not certify every
future content edit or general accessibility conformance. Package identities and
archive acceptance are recorded separately after the immutable archive checks.
Historical 1.0.0 results retain their original attribution.
