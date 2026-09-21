# Curriculum coverage inventory

Coverage version: 17. Versioned checklist of every required subtopic (Notion syllabus + agreed additions). A broad heading does NOT count as coverage of its subtopics. Source of truth: `src/content/coverage.ts`.

**Evidence-verified (structural): 131 / 131.**
**Human semantic review (R5.3): 131 / 131 coverage entries complete; 0 pending.**

> Two count families, kept SEPARATE (do not mix them): (a) **EXAMPLES** — 131 lessons + 29 patterns = 160 executable examples, of which 160 are semantically reviewed and 0 pending; (b) **COVERAGE ENTRIES** — the 131 rows in this inventory, of which 131 are semantically reviewed and 0 pending.

Two layers: *evidence-verified* means the item passes all machine checks (output, line explanations, complexity panel, example-model contract, references) with a current content-hash tie (see `verify:coverage-evidence`). *Semantic-reviewed* means a person read the teaching claim/definition/reasoning (`evidence.semanticReview: true`). Any item still pending semantic review is structurally verified but NOT claimed as fully reviewed. The six-batch review log is `.kiro/specs/R5-curriculum/batch-review.md`.

Status legend: planned · in-progress · authored · verified. Reviewed column: ✅ = semantic review done, ⏳ = pending.

## Programming foundations (10/10)

| Subtopic | id | Status | Reviewed | Lesson | Ext. practice |
|---|---|---|---|---|---|
| Values, variables, types | `foundations/variables-and-types` | verified | ✅ | variables-and-types | — |
| Expressions | `foundations/expressions` | verified | ✅ | expressions | — |
| Conditions | `foundations/conditions` | verified | ✅ | conditions | — |
| Loops | `foundations/loops` | verified | ✅ | loops | — |
| Functions | `foundations/functions` | verified | ✅ | functions | — |
| Scope | `foundations/scope` | verified | ✅ | scope | — |
| Input/output | `foundations/io` | verified | ✅ | io | — |
| References and mutation | `foundations/references-mutation` | verified | ✅ | references-mutation | — |
| Classes | `foundations/classes` | verified | ✅ | classes | — |
| Errors | `foundations/errors` | verified | ✅ | errors | — |

## DSA foundations (5/5)

| Subtopic | id | Status | Reviewed | Lesson | Ext. practice |
|---|---|---|---|---|---|
| Representations | `dsa/representations` | verified | ✅ | representations | — |
| Correctness | `dsa/correctness` | verified | ✅ | correctness | — |
| Time/space complexity | `dsa/complexity` | verified | ✅ | complexity | — |
| Best/average/worst cases | `dsa/cases` | verified | ✅ | cases | — |
| Amortized costs | `dsa/amortized` | verified | ✅ | amortized | — |

## Arrays (8/8)

| Subtopic | id | Status | Reviewed | Lesson | Ext. practice |
|---|---|---|---|---|---|
| Traversal | `arrays/traversal` | verified | ✅ | array-traversal | 1 |
| Two pointers | `arrays/two-pointers` | verified | ✅ | two-pointers | 2 |
| Sliding windows | `arrays/sliding-window` | verified | ✅ | sliding-window | — |
| Prefix sums | `arrays/prefix-sums` | verified | ✅ | prefix-sums | 2 |
| Kadane's algorithm | `arrays/kadane` | verified | ✅ | kadane | 2 |
| In-place modification | `arrays/in-place` | verified | ✅ | in-place-modification | — |
| Matrix traversal | `arrays/matrix-traversal` | verified | ✅ | matrix-traversal | — |
| Intervals | `arrays/intervals` | verified | ✅ | intervals | — |

## Strings (8/8)

| Subtopic | id | Status | Reviewed | Lesson | Ext. practice |
|---|---|---|---|---|---|
| Character frequency counting | `strings/frequency` | verified | ✅ | string-frequency | — |
| Two pointers | `strings/two-pointers` | verified | ✅ | string-two-pointers | — |
| Sliding windows | `strings/sliding-window` | verified | ✅ | string-sliding-window | 2 |
| Parsing | `strings/parsing` | verified | ✅ | string-parsing | — |
| Palindromes | `strings/palindromes` | verified | ✅ | palindromes | 2 |
| Anagrams | `strings/anagrams` | verified | ✅ | anagrams | 2 |
| Substrings | `strings/substrings` | verified | ✅ | substrings | — |
| KMP string matching | `strings/kmp` | verified | ✅ | kmp | — |

## Linked lists (10/10)

| Subtopic | id | Status | Reviewed | Lesson | Ext. practice |
|---|---|---|---|---|---|
| Traversal | `linked-lists/traversal` | verified | ✅ | linked-list-traversal | — |
| Slow/fast pointers | `linked-lists/slow-fast` | verified | ✅ | linked-list-slow-fast | 1 |
| Cycle detection | `linked-lists/cycle-detection` | verified | ✅ | linked-list-cycle-detection | 1 |
| Reversal | `linked-lists/reversal` | verified | ✅ | linked-list-reversal | 1 |
| Merging | `linked-lists/merging` | verified | ✅ | linked-list-merging | 1 |
| Finding the middle | `linked-lists/middle` | verified | ✅ | linked-list-middle | 2 |
| Dummy nodes | `linked-lists/dummy-nodes` | verified | ✅ | linked-list-dummy-nodes | — |
| Pointer manipulation | `linked-lists/pointer-manipulation` | verified | ✅ | linked-list-pointer-manipulation | — |
| Singly/doubly/circular | `linked-lists/variants` | verified | ✅ | linked-list-variants | — |
| Deques | `linked-lists/deques` | verified | ✅ | linked-list-deques | — |

## Trees and tries (11/11)

| Subtopic | id | Status | Reviewed | Lesson | Ext. practice |
|---|---|---|---|---|---|
| DFS | `trees/dfs` | verified | ✅ | tree-dfs | 1 |
| BFS / level order | `trees/bfs-level-order` | verified | ✅ | tree-bfs | 1 |
| Preorder/inorder/postorder | `trees/traversals` | verified | ✅ | tree-traversals | — |
| BSTs | `trees/bst` | verified | ✅ | bst-operations | 1 |
| Height/depth | `trees/height-depth` | verified | ✅ | tree-height-depth | 2 |
| Lowest common ancestor | `trees/lca` | verified | ✅ | lowest-common-ancestor | 1 |
| Tree construction | `trees/construction` | verified | ✅ | tree-construction | — |
| Trie insertion | `trees/trie-insertion` | verified | ✅ | trie-insertion | 1 |
| Prefix search | `trees/prefix-search` | verified | ✅ | prefix-search | 1 |
| Word search | `trees/word-search` | verified | ✅ | word-search | 1 |
| AVL trees | `trees/avl` | verified | ✅ | avl-rotations | — |

## Stacks and queues (6/6)

| Subtopic | id | Status | Reviewed | Lesson | Ext. practice |
|---|---|---|---|---|---|
| Stack/queue operations | `stacks/operations` | verified | ✅ | stack-queue-operations | 1 |
| Monotonic stacks | `stacks/monotonic` | verified | ✅ | monotonic-stack | 2 |
| Parentheses matching | `stacks/parentheses` | verified | ✅ | parentheses-matching | 1 |
| Expression evaluation | `stacks/expression-eval` | verified | ✅ | expression-evaluation | 1 |
| BFS queues | `stacks/bfs-queues` | verified | ✅ | bfs-queues | — |
| Min/max tracking | `stacks/min-max-tracking` | verified | ✅ | min-max-tracking | 1 |

## Graphs (15/15)

| Subtopic | id | Status | Reviewed | Lesson | Ext. practice |
|---|---|---|---|---|---|
| Representations | `graphs/representations` | verified | ✅ | graph-representations | — |
| Adjacency lists | `graphs/adjacency-lists` | verified | ✅ | adjacency-lists | — |
| BFS | `graphs/bfs` | verified | ✅ | graph-bfs | 1 |
| DFS | `graphs/dfs` | verified | ✅ | graph-dfs | 1 |
| Components | `graphs/components` | verified | ✅ | connected-components | 1 |
| Cycle detection | `graphs/cycle-detection` | verified | ✅ | graph-cycle-detection | — |
| Topological sorting | `graphs/topo-sort` | verified | ✅ | topological-sort | 1 |
| Shortest paths | `graphs/shortest-paths` | verified | ✅ | shortest-paths-unweighted | — |
| Multi-source BFS | `graphs/multi-source-bfs` | verified | ✅ | multi-source-bfs | 2 |
| Union-find | `graphs/union-find` | verified | ✅ | union-find | 1 |
| Dijkstra | `graphs/dijkstra` | verified | ✅ | dijkstra | 1 |
| Bellman-Ford | `graphs/bellman-ford` | verified | ✅ | bellman-ford | — |
| Floyd-Warshall | `graphs/floyd-warshall` | verified | ✅ | floyd-warshall | — |
| Prim | `graphs/prim` | verified | ✅ | prim | — |
| Kruskal | `graphs/kruskal` | verified | ✅ | kruskal | — |

## DP and recursion (20/20)

| Subtopic | id | Status | Reviewed | Lesson | Ext. practice |
|---|---|---|---|---|---|
| Base cases | `dp/base-cases` | verified | ✅ | dp-base-cases | — |
| Recursive calls | `dp/recursive-calls` | verified | ✅ | dp-recursive-calls | — |
| Backtracking | `dp/backtracking` | verified | ✅ | dp-backtracking | — |
| Subsets | `dp/subsets` | verified | ✅ | dp-subsets | 1 |
| Permutations | `dp/permutations` | verified | ✅ | dp-permutations | 1 |
| Combinations | `dp/combinations` | verified | ✅ | dp-combinations | 1 |
| Memoization | `dp/memoization` | verified | ✅ | dp-memoization | — |
| Tabulation | `dp/tabulation` | verified | ✅ | dp-tabulation | — |
| 1D/2D DP | `dp/1d-2d` | verified | ✅ | dp-1d-2d | — |
| Knapsack (0/1) | `dp/knapsack` | verified | ✅ | dp-knapsack | — |
| Subsequences | `dp/subsequences` | verified | ✅ | dp-subsequences | — |
| State transitions | `dp/state-transitions` | verified | ✅ | dp-state-transitions | — |
| Climbing stairs | `dp/climbing-stairs` | verified | ✅ | dp-climbing-stairs | 1 |
| House robber | `dp/house-robber` | verified | ✅ | dp-house-robber | 1 |
| Grid paths | `dp/grid-paths` | verified | ✅ | dp-grid-paths | 1 |
| Coin change | `dp/coin-change` | verified | ✅ | dp-coin-change | 1 |
| Longest increasing subsequence | `dp/lis` | verified | ✅ | dp-lis | 1 |
| Longest common subsequence | `dp/lcs` | verified | ✅ | dp-lcs | 1 |
| Divide and conquer | `dp/divide-and-conquer` | verified | ✅ | dp-divide-and-conquer | — |
| N-Queens | `dp/n-queens` | verified | ✅ | dp-n-queens | — |

## Heaps (7/7)

| Subtopic | id | Status | Reviewed | Lesson | Ext. practice |
|---|---|---|---|---|---|
| Min/max heaps | `heaps/min-max` | verified | ✅ | min-max-heaps | — |
| Sift-up / sift-down mechanics | `heaps/sift-mechanics` | verified | ✅ | heap-sift | — |
| Top-K elements | `heaps/top-k` | verified | ✅ | top-k | 2 |
| Kth largest/smallest | `heaps/kth` | verified | ✅ | kth-largest | 1 |
| Running median | `heaps/running-median` | verified | ✅ | running-median | 1 |
| Merging sorted data | `heaps/merge-sorted` | verified | ✅ | merge-sorted-data | 1 |
| Two-heap pattern | `heaps/two-heap` | verified | ✅ | two-heap-pattern | 1 |

## Hashing (7/7)

| Subtopic | id | Status | Reviewed | Lesson | Ext. practice |
|---|---|---|---|---|---|
| Maps and sets | `hashing/maps-sets` | verified | ✅ | maps-sets | 1 |
| Frequency counting | `hashing/frequency` | verified | ✅ | hashing-frequency | 1 |
| Duplicate detection | `hashing/duplicates` | verified | ✅ | duplicate-detection | 1 |
| Value-to-index mapping | `hashing/value-to-index` | verified | ✅ | value-to-index | 1 |
| Grouping | `hashing/grouping` | verified | ✅ | grouping | 1 |
| Prefix sums with maps | `hashing/prefix-sums-maps` | verified | ✅ | prefix-sums-map | 1 |
| Caching seen values | `hashing/caching` | verified | ✅ | caching-seen | — |

## Bit manipulation (5/5)

| Subtopic | id | Status | Reviewed | Lesson | Ext. practice |
|---|---|---|---|---|---|
| AND/OR/XOR/NOT | `bits/logical-ops` | verified | ✅ | bit-logical-ops | 1 |
| Left/right shifts | `bits/shifts` | verified | ✅ | bit-shifts | 1 |
| Check/set/clear bits | `bits/check-set-clear` | verified | ✅ | bit-check-set-clear | — |
| XOR cancellation | `bits/xor-cancellation` | verified | ✅ | xor-cancellation | 2 |
| Counting set bits | `bits/count-set-bits` | verified | ✅ | count-set-bits | 2 |

## Sorting (11/11)

| Subtopic | id | Status | Reviewed | Lesson | Ext. practice |
|---|---|---|---|---|---|
| Bubble sort | `sorting/bubble` | verified | ✅ | bubble-sort | — |
| Selection sort | `sorting/selection` | verified | ✅ | selection-sort | — |
| Insertion sort | `sorting/insertion` | verified | ✅ | insertion-sort | — |
| Merge sort | `sorting/merge` | verified | ✅ | merge-sort | 1 |
| Quick sort | `sorting/quick` | verified | ✅ | quick-sort | — |
| Counting sort | `sorting/counting` | verified | ✅ | counting-sort | — |
| Bucket sort | `sorting/bucket` | verified | ✅ | bucket-sort | — |
| Heap sort | `sorting/heap` | verified | ✅ | heap-sort | — |
| Radix sort | `sorting/radix` | verified | ✅ | radix-sort | — |
| Custom ordering/comparators | `sorting/comparators` | verified | ✅ | comparators | 1 |
| Interval sorting | `sorting/intervals` | verified | ✅ | interval-sorting | 2 |

## Searching (6/6)

| Subtopic | id | Status | Reviewed | Lesson | Ext. practice |
|---|---|---|---|---|---|
| Linear search | `searching/linear` | verified | ✅ | linear-search | — |
| Binary search (sorted arrays) | `searching/binary` | verified | ✅ | binary-search | 1 |
| Binary search on the answer | `searching/binary-on-answer` | verified | ✅ | binary-search-answer | 1 |
| Rotated arrays | `searching/rotated` | verified | ✅ | rotated-array-search | 2 |
| Lower/upper bounds | `searching/bounds` | verified | ✅ | bounds | 1 |
| Matrix search | `searching/matrix` | verified | ✅ | matrix-search | 1 |

## Range queries (2/2)

| Subtopic | id | Status | Reviewed | Lesson | Ext. practice |
|---|---|---|---|---|---|
| Fenwick trees | `range/fenwick` | verified | ✅ | fenwick-tree | — |
| Segment trees | `range/segment` | verified | ✅ | segment-tree | — |

---

External practice (optional): **RECONCILED from the supplied Notion export** (R5.6). Notion occurrences: **79**; unique Notion problems: **75**; mapped occurrences: **77**; unresolved occurrences: **2**; additional optional problems (not in the export): **25**. Each coverage entry's practice column is DERIVED from `src/content/notion-practice.ts` via each occurrence's EXPLICIT in-topic `coverageIds` (never by shared-pattern id matching, which leaked questions across topics); 79 occurrences surface across 64 subtopics. Titles + canonical links only; local lessons teach each technique regardless. The 2 unresolved occurrences (Task Scheduler, Meeting Rooms II) have a documented content gap and are NOT surfaced. The historical Cloudflare-blocked access attempts are preserved in `.kiro/specs/R5-curriculum/external-practice-manifest.md`.

