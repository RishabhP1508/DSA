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
| A previous frame selection could reappear in later calls | Reset selection when the observed stack changes; clear current-frame markers |
| Playground retained stale variables and enabled some playback controls | State panels and controls consistently follow source/input freshness |
| Deep mutations were missed by the changes summary | Cycle-safe propagation through recorded references, with each object compared once |
| Many aliases repeated expensive object comparisons | Shared per-snapshot comparison work instead of repeating it per variable |
| Manual source inspection could point beyond shortened code | Clamp the selected line to the current source |
| Exception exits could be shown as successful `None` returns | Recognize adjacent same-frame exception/exit pairs conservatively and label unwinding |

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

Final source commits, full-suite counts, browser runs, actual curriculum trace
inventory and Windows package identities are recorded here after verification.
Until those receipts are recorded, intermediate passing checks are development
evidence rather than a release-completion claim.
