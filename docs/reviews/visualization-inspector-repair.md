# Visualization and inspector repair

This repair follows the screenshots showing oversized, clipped list diagrams and
variable names joined to values. The scope covers every diagram family and the
shared state panels in lessons, patterns and the Playground, with a page-wide
layout regression pass. It starts from merged main `9faa64b`.

## Findings and repairs

| Finding | Repair |
|---|---|
| Small SVGs grew to fill a panel; large SVGs shrank their text | Explicit intrinsic dimensions and a keyboard-scrollable local viewport |
| Titles, aliases and explanations exceeded SVG bounds | Wrapping HTML captions and bounded SVG labels with recorded detail in the inspector |
| Two names for one list produced two list diagrams | One diagram per recorded object and matching representation; aliases share name chips |
| Equal copies could look like shared objects | Distinct recorded reference IDs remain separate; equality never determines grouping |
| Names and values, or indices and values, ran together | Responsive Name/key, Type and Value columns; explicit `[index]` labels |
| Shared references were unclear in variables | Recorded object IDs and alias labels; repeated contents initially expanded once |
| A pre-line state was described as an already-applied mutation | Separate phase, authored statement explanation and changes already recorded |
| Raw backticks appeared in explanations | Escaped inline formatting in both current-line and all-line explanations |
| Multiple pointers and reciprocal directed edges overlapped | Separate pointer lanes and curved reciprocal arcs, preserving actual direction |
| Linked-list endings and generic-object headings were clipped | Correct gutters, terminal geometry and text anchors |
| Matrix coordinates and one-item queue ends were missing | Explicit row/column indices and both endpoint labels |
| String whitespace could disappear | Visible whitespace glyphs preserve original code-point indices |
| Empty roots could be confused with missing variables | Separate recorded `None`, empty and unbound states |
| Huge values, keys, labels and frame previews could flood the DOM | Bounded previews with omission notices and paged recorded text |
| Personal programs could render thousands of top-level variables at once | Fifty variables per page, keyboard page jumps and counts, preserving off-page aliases |
| A previous frame selection could reappear in later calls | Reset selection when the observed stack changes; clear current-frame markers |
| Playground retained stale variables and enabled some playback controls | State panels and controls consistently follow source/input freshness |
| Deep mutations were missed by the changes summary | Cycle-safe propagation through recorded references, with each object compared once |
| Many aliases repeated expensive object comparisons | Shared per-snapshot comparison work instead of repeating it per variable |
| Manual source inspection could point beyond shortened code | Clamp the selected line to the current source |
| Exception exits could be shown as successful `None` returns | Recognize adjacent same-frame exception/exit pairs conservatively and label unwinding |
| A long function name widened the mobile complexity explanation | Wrap recorded analysis text within its panel, confirmed with deep recursion at 390px |

Grouping is conservative: two views with different models, field adapters,
overlays, graph direction or range metadata remain separate even when they
reference one object. Custom paths resolve against saved objects only. A
recursion diagram represents frames, not an object named by its binding.

## Semantics and references

Consulted on October 18, 2026:

- [Python 3.14 trace events](https://docs.python.org/3.14/library/sys.html#sys.settrace): a line event precedes execution; call, return and exception events have distinct meanings. A return event's `None` argument can accompany exception propagation.
- [Python 3.14 objects, values and types](https://docs.python.org/3.14/reference/datamodel.html#objects-values-and-types): identity distinguishes objects; several names may reference one mutable object.
- [Python Tutor public demo](https://pythontutor.com/visualize.html): inspected its stack/object separation and reference arrows as a visual reference. Its assets and code were not copied.

The official Python pages currently describe the 3.14 maintenance series. Actual
behavior is also checked on the app's bundled CPython 3.14.2 through Pyodide.
The UI reads snapshots and never evaluates expressions to produce an explanation.
These interface changes do not alter curriculum claims or grant new subject reviews.

## Verification record

Baseline browser evidence is under `outputs/visualization-repair-baseline/`.
It reproduces zero name/value spacing, duplicate alias diagrams, clipped labels
and incorrect scaling. Focused regression tests were recorded failing before
the corresponding fixes. Independent agents review the inspector, diagram
families and browser behavior; their reports distinguish synthetic fixtures,
actual bundled-Python states and rendered browser checks.

Final source and browser checks ran on
`afc42e18fc72a8913c66af6fc72e61bfbaeadf83`. The browser suites passed 65/65
in installed Windows Chrome and 65/65 in installed Windows Edge, with zero skips
or retries. They cover all seven main pages and search; all 648 learning tabs at
1440px and 390px per browser; all 17 populated diagram families at
320/390/768/1440px in both themes; empty and None states; aliases, copies,
typed keys, cycles, long values, root pagination, call/return/error states,
keyboard controls and actual native 200% browser Settings zoom. Computed text
contrast is checked separately from screenshots.

`npm run check:all` passed with 1,070 tests across 103 files, all 133 lesson and
29 pattern outputs, 133 verified coverage entries and all 162 current subject
reviews intact. All 163 coding models and all five faulty-solution categories
pass, as do 166 recognition exercises and 329 complete hint progressions.
Lint reports 33 warnings and zero errors. Learner-facing content, the tracing
engine and persistence formats are unchanged.

The actual-program inventory executed all 133 lessons and 29 patterns in Chrome,
checking final and representative interior states at desktop and mobile widths:
648 state/width checks, 628 rendered SVG diagrams, zero layout issues or page
errors. This receipt is deliberately attributed in two parts: the first 124
lessons and 496 checks ran at `6f5e508cab90a830e1720bd4816da911d0a80376`;
the remaining nine lessons and 29 patterns, 152 checks, ran at
`c8881e0e7d42a508fd2abe95402df94d7c5bb2bd`. The first long-lived context
timed out waiting for House Robber during concurrent rebuilds. That partial
receipt is retained; House Robber passed immediately in the fresh stable tail
context. Later changes only add root-variable pagination and its checks, plus
test setup and documentation. The final full browser suites check those changes.

Two aggregate attempts exposed an existing five-second factual-test timeout
during cold Python startup. Runtime initialization now runs in the setup hook
with its own 120-second budget. The factual assertions and their five-second
budget are unchanged. Failure logs are retained alongside the final gate.
Earlier browser checks also caught the missing legacy `.viz-slot` integration
class; it was restored and the unchanged assertions pass in the final suites.

The aggregate and delivery results are linked from the
[1.0.2 release record](../releases/1.0.2.md) after packaging. Local receipts stay
under `outputs/visualization-repair-*` and the delivery's `Verification 1.0.2/`
folder. Representative diagrams and inspector screenshots received separate
visual review; DOM checks are not a claim that every screenshot was manually
reviewed or that the application has general accessibility certification.
