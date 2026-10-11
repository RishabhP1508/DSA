# Interface design and implementation

The new interface is implemented in the actual application, from scratch. It
does not use the old Kiro layouts as its visual base. The packaged `dist/index.html`
is the application HTML entry point and stays with its bundled assets.

## Design decisions

A warm background, dark readable text and restrained green accents keep attention
on the concept, code and recorded state. Fraunces gives titles a distinctive
voice; DM Sans handles reading; JetBrains Mono handles code. Fonts are bundled.
Decorative particles, glass cards, shimmer text and external embeds were omitted.

The component layer is shadcn/ui with Radix primitives: buttons, cards, badges,
tabs, dialogs, tooltips, separators and inputs. Components are editable source
under `src/components/ui`. Original SVG diagrams read recorded Python snapshots.

## Application surfaces

| Surface | Behavior |
|---|---|
| Home | Continue learning, actual progress, prerequisites and a labelled conceptual preview |
| Learning path | Browse freely; recommendations respect prerequisites |
| Lesson | Understand, watch code, practice and review; workspace state survives tab changes |
| Patterns | Search; compare clues, baseline, conditions, alternatives and counterexamples |
| Practice | Filter challenge type; at most 20 per page; no eager Python workers |
| Playground | Named drafts, input, real execution, syntax/state explanations, field mappings and import/export |
| Glossary | Definitions and links back to lessons |
| Backup | Validated export/restore and previous-snapshot recovery |

The execution workspace combines the Python editor, diagrams, playback controls,
variables, call stack, output, diagnostics and complexity. Gutter controls are
keyboard-accessible playback breakpoints. Prediction checkpoints seek actual
recorded indices; the learner chooses when to reveal the explanation.

## Interaction and accessibility

### Reading hierarchy

Page titles use 36px type on desktop and 28px on narrow screens. Reading sections
use 24px headings (22px on mobile), 18px subheadings and 16px body text. Prose
is limited to 72ch. Numbered sections and an "On this page" outline distinguish
the topic from its subtopics. The outline becomes a disclosure on smaller screens.
Authored time and space notes remain in the main reading content at every width.

Each exercise has its own bordered panel, a heading, a prompt and separate
approach/reason groups. Radio choices occupy labelled rows; feedback, progressive
hints and model explanations have their own space. Actions wrap and stack on
mobile. Learn groups lessons under their topic headings, while Glossary, Backup
and Playground use the same page and section hierarchy.

The editor uses theme-specific syntax colors. Native browser zoom can shorten
the viewport, so the navigation rail scrolls vertically and all destinations
remain reachable. Browser regressions check computed sizes, wrapping, real
answer feedback and every lesson/pattern tab. Native 200% tests change the
browser's own page-zoom setting in a disposable profile.

Search supports Ctrl+K, Escape, focus containment and return to its opener.
Closed mobile navigation is inert; Escape returns focus to its opener. Tabs
support arrow keys. Skip links target the current main content. Narrow layouts
stack the workspace and wrap controls. Diagrams scroll within their panels.
Labels supplement colour. Reduced motion removes nonessential transitions.

Editing code invalidates the old trace. Re-running edited standard code restores
real playback, while original authored claims remain unavailable until the
original source is run. Personal-code explanations describe syntax and observed
changes, without guessing algorithm intent.

## Development references

- [shadcn/ui Vite installation](https://ui.shadcn.com/docs/installation/vite):
  component setup and source ownership.
- [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog):
  modal focus and keyboard behavior.
- [Kokonut UI](https://kokonutui.com/): interaction references; decorative effects
  were unnecessary for this learning interface.
- [Motion reduced motion](https://motion.dev/docs/react-use-reduced-motion):
  motion preferences; no animation dependency was needed.
- [Bklit](https://bklit.com/): chart reference; comparisons remain local original
  diagrams with theory and measurements separately labelled.
- [MDN inert](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert)
  and [ARIA modal](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-modal):
  inactive navigation and modal semantics.

Research took place during development. The app requests no external fonts,
component registries or services. Acceptance records are in `completion.md`
and `reviews/codex-ui-audit.md`.
