# R5.3 — Six-batch curriculum review log

**Honest scope statement.** The full inventory is **131 lessons + 29 patterns =
160 items**, grouped into the six R5.3 batches below. Two layers of review exist:

1. **Structural / consistency evidence — ALL 160 items.** Every item passes the
   automated checks: output matches the bundled runtime (`verify:lessons` /
   `verify:patterns`), every displayed line is explained (`verify:line-explanations`),
   the complexity panel validates with in-range derivation + executing counters
   (`verify:complexity` + `verify:example-model`), the full example-model contract
   holds (`verify:example-model`), and no internal contradiction is found
   (`verify:semantic-consistency` — 0 failures, 7 advisory scope notes that were
   inspected and confirmed correct). This is recorded per item as
   `evidence.checks` (all six true) with a content-hash tie.

2. **Human semantic read — 37 of 160 items THIS milestone.** A person read the
   teaching claim, definition/invariant, reasoning, and edge cases (not just the
   machine checks). Only these carry `evidence.semanticReview: true` +
   `reviewBatch`. **The remaining 123 items are `semanticReview: false`** — they
   are structurally evidence-verified but their deep semantic read is PENDING and
   is deliberately kept OUT of any "fully semantically reviewed" count.

This split is enforced honestly: `docs/coverage.md` reports both numbers
separately, and `verify:coverage-evidence` gates the structural layer.

## Advisory consistency notes (inspected, confirmed correct — not defects)
The 7 `verify:semantic-consistency` warnings are all legitimate whole-program-panel
vs per-operation-summary scope distinctions, e.g.:
- `bit-logical-ops` / `bit-shifts`: summary `worst: O(w)` is the big-integer case
  (the row's note says "O(1) for machine words; O(w) for w-bit big integers");
  the panel's O(1) is the machine-word cost model. Both correct (R5.4 big-int).
- `min-max-heaps`: panel `time.bound` O(log n) (push/pop) while the summary lists
  O(n) `heapify` build — the derivation + fixedDataNote both state the O(n) build;
  whole-vs-operation distinction handled.
- `references-mutation`, `dp-backtracking`, `dp-subsequences`, `dp-coin-change`:
  summary rows describe a specific operation the whole-program panel doesn't
  restate; verified consistent.

## Batch 1 — Programming & complexity foundations (15 lessons)
Items: variables-and-types, expressions, conditions, loops, functions, scope, io,
references-mutation, classes, errors, representations, complexity, cases, amortized,
correctness.
- **Semantically reviewed this pass:** `references-mutation` (line-explanation
  phantom-entry repair — read the pass-by-object-reference vs rebinding teaching
  end-to-end; correct).
- Pending deep read: the other 14 (structurally verified).

## Batch 2 — Arrays, strings, hashing, bits (approx. 27 lessons + arrays/strings/bits patterns)
- **Reviewed:** `sliding-window` (fixed: explicit accumulation, O(1) aux, k-guards,
  prefix-sum alternative), `string-sliding-window` (variable-window, confirmed not
  a fixed-k slice), `kadane` (O(n)/O(1), negatives handled), `prefix-sums`,
  `count-set-bits` (Brian Kernighan + built-in; line-expl repair), `bit-logical-ops`,
  `bit-shifts` (big-int O(w) vs machine-word O(1) distinction verified).
- Pending: remaining hashing/strings lessons + the arrays/strings patterns' prose.

## Batch 3 — Searching, sorting, intervals (approx. 17 lessons)
- **Reviewed:** `binary-search` (line-expl realign + reasoning), `rotated-array-search`
  (line-expl realign + which-half-sorted logic), `quick-sort` (avg/best/worst pivot
  reasoning), `bucket-sort` (expected O(n+k) + skewed worst), `merge-sort`,
  `interval-sorting`.
- Pending: bubble/selection/insertion/counting/radix sort, linear-search, bounds,
  matrix-search deep read.

## Batch 4 — Linked structures, stacks, queues, heaps (approx. 23 lessons)
- **Reviewed:** all heaps (`min-max-heaps`, `heap-sift`, `top-k`, `kth-largest`,
  `running-median`, `merge-sorted-data`, `two-heap-pattern`, `heap-sort`),
  `linked-list-deques` + `stack-queue-operations` + `bfs-queues` + `tree-bfs`
  (deque O(1) vs list.pop(0) O(n) Python-cost check), `expression-evaluation`
  (line-expl swap repair).
- Pending: the other linked-list lessons' deep read (structurally verified).

## Batch 5 — Trees, tries, graphs, range-query (approx. 26 lessons)
- **Reviewed:** `prefix-search` (trie + line-expl repair), `adjacency-lists`
  (weighted/directed + line-expl repair), `connected-components` (flood-fill +
  line-expl repair), `graph-bfs` (deque; also counted in batch 4), `kmp` (O(n+m)
  amortized argument).
- Pending: BST/AVL/LCA/tree-construction/word-search, dijkstra/bellman-ford/
  floyd-warshall/prim/kruskal/union-find/topo, fenwick/segment deep read.

## Batch 6 — Recursion, backtracking, greedy, DP, string matching (approx. 22 lessons)
- **Reviewed:** `dp-lcs` (O(m·n)), `dp-1d-2d` (1D vs 2D modeling).
- Pending: the remaining DP lessons + backtracking/greedy patterns' deep read.

## Where the remaining semantic review stands
The 123 pending items are NOT marked verified-by-semantic-review. They remain
structurally evidence-verified (all machine checks pass with a current content
hash). Completing their deep read is tracked here and can be picked up without
re-doing the structural layer. No item is claimed as semantically reviewed unless
its `evidence.semanticReview` is `true`.
