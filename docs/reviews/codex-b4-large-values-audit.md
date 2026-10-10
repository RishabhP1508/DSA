# Delegated large-value visualization audit

Frozen 2026-10-10 22:59:18 UTC. Reviewer: delegated Codex technical reviewer
`review_sequences_heaps`; this is agent review, not human signoff. Following the
failed-first audit, the coordinator authorized this reviewer to implement the
bounded diagrams and shared display helper. No machine evidence or content
approval flags were changed.

Scope: DPTable, Matrix, Array, String, Stack/Queue/Deque, Heap, Tree, Trie,
Dict/Set, and the recorded-range adapter. Custom Tree/Trie field mappings added
by the coordinator were preserved. Graph and LinkedList production changes
remain owned by the coordinator; this reviewer did not edit them.

## Reproductions before fixes

All regression fixtures below come from successful execution on bundled Pyodide
314.0.7 / CPython 3.14.2, followed by rendering the real React components into a
DOM. They are not hand-authored trace fixtures. No 100,000-cell or million-cell
diagram was rendered.

| Defect | Actual recorded source and rendered result | Recommendation |
| --- | --- | --- |
| Compact alias amplification | `row=[0]*100; grid=[row]*100` records 100 outer references and one shared 100-entry row, yet DP and Matrix each render 10,000 cells / 30,002 DOM elements. Initial jsdom render diagnostics: DP 447.9 ms, Matrix 427.0 ms. Reading the uncapped loop establishes that the allowed 1000×1000 alias shape would request one million cells; that larger shape was deliberately not rendered. | Bound visible rows/columns and total cells, with an explicit display-limit notice. Repeated references must not defeat the DOM bound. |
| Unbounded sequences and heap | `a=list(range(1005)); q=deque(a)` produces a recorded 1000-entry prefix with `truncated=True`. Array/1D DP render 4002 elements, stack 3003, queue/deque 3004, heap 9001. | Bound visible entries and both heap views. Explicitly distinguish a display cap from entries omitted by inspection. |
| Unbounded primitive string | `text="😀"*5000` is fully recorded and renders 5000 character cells / 20,002 DOM elements in 235.3 ms in the initial jsdom probe. | Bound character cells, preserve Unicode code-point indices and complete characters, and retain the known full length with a display-limit notice. |
| Invented final endpoints | In the 1005-entry successful source, the inspector records indices 0…999. Stack labels recorded index 999 as `top→`; queue/deque label it `↑rear` / `↑right`. Those labels assert an endpoint the trace did not inspect. Three independent rendered regressions reproduce these exact labels. | A prefix establishes its first endpoint but not its last. Mark the final endpoint uninspected rather than assigning it to the last displayed/recorded value. |
| False range violation | Recorded `start=1000; end=1005` is a valid half-open Python range for the actual 1005-element list. Array reports `outside sequence` by treating the 1000-entry inspected prefix as the full length. | Distinguish known bounds from the inspection boundary. Report uninspected state when validity cannot be established from the snapshot. Keep negative/known out-of-bounds checks where justified. |
| Missing ragged cell highlighted | `ragged=[[7,8],[9]]; r=1; c=1` has no cell `[1][1]`. Binding actual `r/c` as row/col makes both DP and Matrix draw an active rectangle there. | Highlight only recorded cells. Alignment placeholders must not imply that missing data exists or has been computed. |
| Huge primitive inside bounded cells | The real source records `long_values=["😀"*5000,10**5000]` and `long_grid=[long_values]*20`. After entry caps, eight independent Array/DP/Stack/Queue/Deque/Heap/Matrix render tests still place thousands of characters in each SVG cell. | Bound value formatting before JSON escaping, preserve complete code points, and label shortened values explicitly. A cell-count cap alone is insufficient. |
| Shallow branching amplification | Real execution builds a 511-node binary tree with custom `payload/a/b` fields and a trie with 1005 children using custom `edges/wordEnd` fields. The inspector captures a truncated 1000-entry children dictionary. Before fixes Tree renders 511 circles; Trie renders 1001 circles and 1000 edges with no inspection notice. | Bound nodes and depth independently of cycle detection, bound Trie edges globally, and mark omitted children and unknown totals. |
| Unbounded collection rows | `dictionary=dict.fromkeys(range(1005),7); members=set(range(1005))` yields actual truncated 1000-entry snapshots. Dict renders 1000 rows and Set 1000 chips. | Bound displayed rows/members, distinguish dictionary insertion order from unordered set membership, and label inspection omissions. |

The cap regression oracles are intentionally generous: at most 1024 visible grid
cells, 256 sequence/array/collection entries, and 128 heap tree nodes. The
implementation uses the smaller bounds below. These are product display bounds,
not thresholds asserted by external literature. Durations are diagnostic
observations, not timing assertions or general browser performance claims.

## Implemented behavior

`src/visualizers/limits.tsx` centralizes bounds and data-only formatting:

- Array, 1D DP, Queue/Deque, String, Dict and Set display at most 64 entries or characters. Complete stacks display the last 32 entries and retain actual indices; truncated stacks show a recorded prefix without inventing a top endpoint.
- Heap array and tree views display the same first 15 backing entries, retaining zero-based indices. Tree and Trie display at most 64 nodes and 16 levels; Trie has an independent 128-edge limit. Cycle/alias identity remains based on recorded object IDs.
- Matrix and 2D DP display at most 16 recorded rows and 24 recorded columns per row (384 cells). Each row renders only its actual captured cells; ragged rows are not padded with fictional active/computed cells. Aliased rows cannot defeat the display bound.
- Value previews use at most 96 Unicode code points of formatted text plus an ellipsis. Primitive strings are bounded before JSON escaping. The helper reads trace data without calling learner hooks. A visible notice states when values are shortened.
- Inspection truncation and display truncation have distinct notices. Captured prefixes do not establish the actual tail endpoint or full length. Omitted pointers retain their recorded values in a notice; sequence/grid labels retain recorded indices. A range extending past the inspected prefix is described as uninspected rather than falsely outside the Python sequence.
- Small lesson layouts retain their SVG sizing. Large diagrams use natural dimensions inside the existing scrolling viewport, avoiding a fit-to-width reduction to microscopic cells. Omitted Tree/Trie children also have local ellipsis markers. Custom field mappings are retained.

The formatting and DOM bounds address the reproduced amplification. They do not
guarantee that every arbitrary string fits inside a small SVG cell or that every
permitted trace is equally fast; shortened labels and scrolling remain explicit
presentation compromises. Only the Matrix/DP case below was measured in the
production browser during this focused audit; other families have real-runtime
rendered DOM regressions and existing small/custom-field checks.

## Research and conventions

Sources consulted on 2026-10-10:

- [Chrome performance insights: Optimize DOM size](https://developer.chrome.com/docs/performance/insights/dom-size), introduction and React guidance. The browser vendor documents extra style/layout and memory cost from a large DOM, and recommends windowing repeated React content. This supports a visible bound; it does not supply the app's particular cap or prove the measured jsdom duration in Chrome.
- [Python 3.14: Text Sequence Type](https://docs.python.org/3.14/builtins/stdtypes.html#text-sequence-type-str), Unicode definition. Python strings are immutable Unicode code-point sequences, so astral characters count as one Python index. Current maintenance documentation served 3.14.8; tests run bundled 3.14.2.
- [ECMAScript String iterator](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype-@@iterator), iterator algorithm. The string iterator advances by each code point's code-unit count. A DOM cap must preserve this convention rather than split UTF-16 surrogate pairs with a code-unit slice.

Actual type/trace conventions come from the bundled runtime and recorded
`TraceObject.truncated` contract: recorded entries are a prefix, not a complete
container when inspection truncates. Heap views retain the curriculum's
zero-based backing-array convention. Active/computed state must come only from
the recorded binding/metadata and actual cell existence.

## Focused checks and frozen result

`src/visualizers/codex-large-values.real.test.tsx`: first run 12/12 failed;
three additional independent endpoint tests then failed 3/3, and eight huge-cell
tests failed 8/8 after entry caps. Focused name-filter exclusions were not runtime
skips. All 23 now pass. The source actually completes on bundled Pyodide and the
tests assert the inspected prefix, aliases, real values and stdout before
rendering.

`src/visualizers/codex-branching-values.real.test.tsx`: all five initially failed
and all five now pass. Construction executes through the supported `exec`
builtin in one outer source line to avoid intermediate construction states
exhausting the trace budget; the final objects come from the actual inspector.
It is not a hand-authored trace or a claim that `exec`'s inner lines were traced.

Final focused native Vitest run: **53/53 tests pass across nine files**. This
includes the 28 new regressions and existing DP/Array aliasing, sequence range,
custom field, field-path, and B4 linear/heap renderer checks. `npm run build`
passes TypeScript and Vite. Focused Oxlint exits 0 with no errors; mixed
component/helper exports produce Fast Refresh warnings in `limits.tsx` and
`SequenceState.tsx`. These warnings concern development refresh, not a failed
production compilation.

`e2e/codex-large-values.spec.ts`: **1/1 passes in real Chrome**, using a private
Playwright profile against rebuilt loopback production app/worker. Successful
Playground source `row=[0]*100; grid=[row]*100; print("done")` is replayed at the
final event. Actual Matrix and DP each render **384 cells / 1155 DOM nodes** and
show the display-limit notice; Run remains enabled. The PerformanceObserver
reports no long tasks during these two grid transitions (`[]`). This single
hardware-dependent observation is diagnostic, not a timing guarantee or a claim
covering all input shapes. Browser/build ownership was explicitly released to
the coordinator after this probe.

Repeatable command with `C:\Program Files\nodejs` prepended to PATH:

```text
node node_modules/vitest/vitest.mjs run src/visualizers/codex-large-values.real.test.tsx src/visualizers/codex-branching-values.real.test.tsx src/visualizers/DPTableVisualizer.real.test.tsx src/visualizers/DPTableVisualizer.test.tsx src/visualizers/ArrayVisualizer.aliasing.test.tsx src/visualizers/codex-b4-linear-heap.real.test.tsx src/visualizers/custom-fields.real.test.tsx src/visualizers/sequence-state.test.tsx src/visualizers/fieldpath.test.tsx --maxWorkers=1
npm run build
PLAYWRIGHT_CHANNEL=chrome node node_modules/@playwright/test/cli.js test e2e/codex-large-values.spec.ts --workers=1 --reporter=line
```

Native Node was used for the focused Vitest run because sandbox temporary-module
creation raised ENOENT before assertions. The native run above completed without
skips. No full aggregate or broad browser suite was run by this reviewer; final
integrated checks belong to the coordinator. This packet is frozen and no
factual questions remain unresolved within the reproduced scope.

## Exercise count discrepancy

Effective curriculum enumeration returns **393 exercises with no collection
errors**. The extra authored exercise relative to the former 392 is
`lesson:two-heap-pattern:twoheap-ipo-predict-1` (kind `predict-state`), the new
worked IPO adaptation's wealth prediction. The HEAD two-heap lesson contains
two exercises; the current authored lesson contains those two plus this third
exercise. The histogram exercise `mono-histogram-1` already existed in HEAD.
No exercise was removed. IPO remains an adaptation inside the existing two-heap
pattern, not an added roadmap/Notion coverage topic.
