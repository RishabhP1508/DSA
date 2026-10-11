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

Final tested commits, outcomes and package identities are recorded after the
integrated verification and archive checks. Historical 1.0.0 results remain
attributed to their original build.
