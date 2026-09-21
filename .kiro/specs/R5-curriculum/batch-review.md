# R5.3 — Six-batch curriculum review log

**Scope: all 131 lessons + 29 patterns = 160 examples.** Each was read against
the R5.3 checklist (beginner explanation + vocabulary, prerequisites,
definition/invariant, preconditions, implementation correctness, edge cases, line
explanations, visual behavior, time/space reasoning, exercises/feedback, pattern
guidance, reference evidence).

## What "reviewed" means here (honest framing)

The human semantic read is a **RECORDED CLAIM**, not something the automated
tests prove. Its evidence lives in **`src/content/review-ledger.ts`**: for each
item a person read, the ledger records the exact **content hash** that was read.
`evidence.semanticReview: true` is granted (by `codemod_add_evidence.mjs`) **only
when the item's current content hash equals its ledger `reviewedHash`** — so the
claim cannot outlive the content. What the tests enforce is that invariant (a
`true` flag must have a matching-hash ledger entry), NOT that the reading
happened. The two layers are kept distinct:

1. **Structural / consistency evidence — all 160.** Machine checks: output
   matches the bundled runtime, every line explained, complexity panel validates
   with in-range derivation + executing counters, the full example-model contract
   holds, and no internal contradiction (`verify:semantic-consistency`). Recorded
   as `evidence.checks` with a content-hash tie.
2. **Human semantic read — recorded claim, ledger-backed.** `evidence.semanticReview`.

## Batch membership and counts (reconciled to the registry = 131 + 29)

Batches are assigned by area/category and are the single source of truth in
`src/content/review-ledger.ts`. Every lesson and every pattern is in **exactly
one** batch.

| Batch | Scope | Lessons | Patterns |
|---|---|---|---|
| 1 | Programming & complexity foundations | 15 | 0 |
| 2 | Arrays, strings, hashing, bits (incl. `kmp`, area "Strings") | 28 | 7 |
| 3 | Searching, sorting, intervals, greedy, divide-and-conquer | 17 | 5 |
| 4 | Linked structures, stacks, queues, heaps | 23 | 6 |
| 5 | Trees, tries, graphs, range-query | 28 | 8 |
| 6 | Recursion, backtracking, DP | 20 | 3 |
| **Total** | | **131** | **29** |

> Correction (this amendment): the earlier log's lesson headings summed to 130,
> not 131. The miscounts were batch 2 (listed 27, actual **28** — `kmp` lives in
> the Strings area and belongs to batch 2), batch 5 (listed 26, actual **28**),
> and batch 6 (listed 22, actual **20**, i.e. exactly the 20 `dp-*` lessons). The
> table above is now derived from the ledger, so it cannot drift again.

## Findings

- **Defects found and fixed in earlier R5 amendments:** heaps min-only → 3.14
  max-heap API; fixed-sliding-window `sum(nums[:k])` vs O(1) aux; 9 lessons'
  line-explanation drift; 2 example-model false-mapping audits (Task Scheduler,
  Meeting Rooms II). See `verification.md`.
- **This amendment:** the 5 "bridged" practice mappings (Product of Array Except
  Self, Longest Palindromic Substring, Largest Rectangle in Histogram, Combination
  Sum, Sum of Two Integers) were found to be taught only in developer docs, not in
  learner-facing content — now fixed by adding the adaptation + its correctness
  condition to each lesson's explanation prose, an experiment, and an exercise
  (see `notion-bridges.test.ts`).
- **New defects found in the read otherwise: none.** Definitions, invariants,
  prerequisites, complexity reasoning, and edge cases are content-accurate; the
  prerequisite graph is an acyclic DAG (`verify_semantic_consistency`, 0 failures).
- **Advisory consistency notes (7):** legitimate whole-program-panel vs
  per-operation-summary scope distinctions (e.g. bit-logical-ops O(w) big-int vs
  O(1) machine-word; min-max-heaps O(n) build vs O(log n) push/pop). Not defects.

## Batch-by-batch (what each read checked; representative items)

### Batch 1 — Programming & complexity foundations (15 lessons)
variables-and-types … amortized/correctness. Verified Python-specific truths
(int unlimited precision, `-1 % 5 == 4`, `UnboundLocalError`, mutable-default
trap, `input()` returns str), the loop invariant in `correctness`, the amortized
doubling argument in `amortized`. Correct.

### Batch 2 — Arrays, strings, hashing, bits (28 lessons + 7 patterns)
Arrays (traversal/two-pointers/prefix-sums/kadane/in-place/matrix/intervals),
Strings (frequency/two-pointers/parsing/palindromes/anagrams/substrings + `kmp`),
Hashing (maps-sets/frequency/duplicates/value-to-index/grouping/prefix-sums-map/
caching-seen), Bits (logical-ops/shifts/check-set-clear/xor-cancellation/
count-set-bits). Bridges added here: Product of Array Except Self (prefix-sums),
Longest Palindromic Substring (palindromes), Sum of Two Integers (bit-logical-ops).
Verified substrings O(n²)/O(n³), dict-order-since-3.7, XOR cancellation algebra.

### Batch 3 — Searching, sorting, intervals, greedy, divide-and-conquer (17 lessons + 5 patterns)
linear/binary/bounds/rotated/matrix/binary-on-answer; bubble→radix sorts +
comparators + interval-sorting. Verified best/avg/worst cases, counting O(n+hi),
radix O(d·(n+b)), Timsort stability, binary-search-on-answer monotonicity.

### Batch 4 — Linked structures, stacks, queues, heaps (23 lessons + 6 patterns)
All 10 linked-list lessons (Floyd's cycle+entry, dummy-node uniformity, pointer
surgery, singly/doubly/circular), stack/queue/monotonic/parentheses/expression/
min-max-tracking, all 8 heap lessons. Bridge added here: Largest Rectangle in
Histogram (monotonic-stack). Verified deque O(1) vs list.pop(0) O(n), per-level
min stack.

### Batch 5 — Trees, tries, graphs, range-query (28 lessons + 8 patterns)
tree dfs/bfs/traversals/bst/height/lca/construction, trie/prefix/word-search, avl,
all 15 graph lessons, fenwick/segment. Verified word-search O(m·n·3^L), union-find
O(α(n)), dijkstra/bellman-ford/floyd-warshall/prim/kruskal bounds, segment-tree
generality over Fenwick.

### Batch 6 — Recursion, backtracking, DP (20 lessons + 3 patterns)
dp-base-cases → dp-n-queens. Bridge added here: Combination Sum (dp-combinations).
Verified naive O(2ⁿ) vs memoized O(n), Catalan generate-parens, O(n·2ⁿ) subsets,
O(n·n!) permutations, O(n·W) knapsack pseudo-poly, O(N!) N-Queens.

## Unresolved (recorded honestly, not marked reviewed-by-omission)
- 2 external-practice occurrences (**Task Scheduler**, **Meeting Rooms II**) are
  `status: "unresolved"` in the Notion manifest with a concrete content gap (no
  lesson teaches cooldown scheduling / concurrent-overlap room counting; only a
  prerequisite exists). Concrete curriculum follow-ups are recorded in
  `verification.md` (they are teaching-content gaps, NOT things R6's exercise work
  will fill on its own).
- Big-O CLAIM correctness beyond structural consistency remains R7.
