# References directory

A topic-indexed directory of the exact source pages used to author content, and
what each is consulted for. Per `AGENTS.md`, before authoring a topic you must
read the relevant page(s), verify important claims against a second source where
possible, and record the exact URLs, sections, verified claims, conventions, and
access date on the lesson/pattern's `references` array (and add specifics here).

**Access dates** below are recorded per entry as content is authored. A link
without a per-topic verified entry has *not yet* been used to author content —
it is a starting point for that topic's research.

> Research happens during development. The delivered app is fully offline; these
> URLs are provenance, not runtime dependencies.

---

## Runtime of record

- Bundled **Pyodide 314.0.7** → **CPython 3.14.2** (`public/pyodide/pyodide-lock.json`).
- Validate all API/semantics claims against CPython 3.14.

---

## Primary user-provided sources

| Source | Primary use |
|---|---|
| [NeetCode roadmap](https://neetcode.io/roadmap) | Topic dependencies, learning progression, practice organization |
| [Staying — graph docs](https://staying.fun/en/docs/graph) | Code-linked structures and graph visualization ideas |
| [W3Schools Python DSA](https://www.w3schools.com/python/python_dsa.asp) | Beginner explanations and small Python examples |
| [Awesome LeetCode Resources](https://github.com/ashishps1/awesome-leetcode-resources) | Discovering pattern guides, exercises, further references |
| [Notion topic & subtopic syllabus](https://chocolate-candy-c79.notion.site/DSA-Topics-Patterns-and-LeetCode-Questions-3d2d8c33330f80dc9623f6b1dce29e03) | Required coverage checklist and topic-to-practice mapping (see docs/coverage.md) |

## Added free reference sources

| Resource | Consult for |
|---|---|
| [Runestone: Problem Solving with Algorithms and DS using Python](https://runestone.academy/ns/books/published/pythonds3/index.html) | Python explanations & implementations: recursion, searching, sorting, trees, heaps, graphs |
| [Python tutorial](https://docs.python.org/3/tutorial/) / [stdlib](https://docs.python.org/3/library/) | Python semantics, supported APIs, version differences |
| [MIT OCW 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/lecture-notes/) | Correctness, complexity, heaps, hashing, trees, graphs, DP |
| [Princeton Algorithms booksite](https://algs4.cs.princeton.edu/home/) | Algorithm analyses & exercises: sorting, priority queues, graphs, strings |
| [Open Data Structures](https://opendatastructures.org/) | Structure definitions, properties, complexity |
| [CP-Algorithms](https://cp-algorithms.com/) | Advanced graphs, union-find, Fenwick/segment trees, DP, strings |
| [VisuAlgo](https://visualgo.net/en) | Algorithm animations, state highlighting, playback ideas |
| [USFCA visualizations](https://www.cs.usfca.edu/~galles/visualization/Algorithms.html) | Interactive structure operations |
| [OpenDSA visualization directory](https://opendsa-server.cs.vt.edu/embed) | Interactive exercises & visualization approaches (verify each destination) |
| [Python Tutor](https://pythontutor.com/visualize.html) | Execution steps, variables, references, call stacks presentation |

> Reminder: a link from a resource collection does **not** guarantee its
> destination is free or suitable. Verify each destination before using it. One
> broken/inaccessible link must trigger another source lookup.

---

## Topic index

Keyed by `area/topic`. Each authored topic lists the pages actually consulted,
the claims verified, conventions adopted, and access date.

### programming-foundations/variables-and-types — ✅ authored (Phase 1)

- [Python 3.14 tutorial — An Informal Introduction](https://docs.python.org/3.14/tutorial/introduction.html)
  — assignment binds a name to a value; int/float/str are core value types.
  Convention: Python 3.14 semantics. Accessed 2026-09-19.
- [OpenStax — Variables revisited](https://openstax.org/books/introduction-python-programming/pages/3-3-variables-revisited)
  — a variable is a name referring to an object; multiple names may refer to the
  same object (aliasing). Accessed 2026-09-19.
- [W3Schools — Python Data Types](https://www.w3schools.com/python/python_datatypes.asp)
  — enumeration of built-in types (int, float, str, bool, NoneType). Accessed 2026-09-19.
- [W3Schools — Python Numbers](https://www.w3schools.com/python/python_numbers.asp)
  — Python int has unlimited length / arbitrary precision. Accessed 2026-09-19.

Executed the lesson program on CPython 3.14.4 and confirmed output
`Ada 42.5 True None` / `[10, 20, 30, 40]`, plus alias identity (`a is b`) — see
`scripts/lesson_variables.py` and `scripts/verify_pipeline.mjs`.

### linked-lists/traversal — ✅ authored (Phase 2 demo)

- [GeeksforGeeks — Traversal of Singly Linked List](https://www.geeksforgeeks.org/traversal-of-singly-linked-list/)
  — traversal visits each node from the head following `next` until the last
  node whose `next` is None. Accessed 2026-09-19.
- [Hyperskill — Singly linked list](https://hyperskill.org/learn/step/5336)
  — no random access; reaching an index is O(n). Accessed 2026-09-19.
- [Programiz — Linked list time complexity](https://programiz.pro/resources/dsa-linked-list-complexity/)
  — full traversal is O(n) in the number of nodes. Accessed 2026-09-19.

Executed on CPython 3.14.4; output `1\n2\n3\n` confirmed (and via
`scripts/verify_lessons.mjs` against the bundled Pyodide).

### heaps/min-max — ✅ verified (R5.2, corrected)

- [Python 3.14 `heapq` docs](https://docs.python.org/3.14/library/heapq.html)
  — **Corrects the earlier "Python only has a min-heap" claim.** Python 3.14
  adds a native max-heap family: `heapify_max`, `heappush_max`, `heappop_max`,
  `heapreplace_max`, `heappushpop_max` (each marked *"Added in version 3.14"*).
  `maxheap[0]` holds the largest; unqualified functions remain a min-heap with
  `heap[0]` smallest. `heapify`/`heapify_max` transform a list into a heap **in
  linear time** (O(n)). heapq uses **zero-based indexing** (children of `i` at
  `2i+1`, `2i+2`); the docs note textbooks often use 1-based and favour max-heaps.
  Verified sections: "Min-heaps"/"Max-heaps" intro and the min/max function
  listings. Accessed 2026-09-20.
- [Princeton priority queues](https://algs4.cs.princeton.edu/24pq/)
  — cross-check: binary-heap insert and delete-min/max are O(log n); Princeton
  uses **1-based** indexing and a max-oriented default (reconciled to heapq's
  0-based min default). Accessed 2026-09-20.
- **Runtime evidence:** ran a probe on the bundled Pyodide (CPython 3.14.2)
  confirming `heapify_max`/`heappush_max`/`heappop_max`/`heapreplace_max`/
  `heappushpop_max` all exist, keep the max at index 0 (max-heap invariant
  `maxheap[2k+1] <= maxheap[k]` held on a shuffled 20-element list), and that
  negation still works as the portable alternative. The corrected
  `min-max-heaps` lesson output `1\n0\n1\n9\n9\n8\n` is verified by
  `verify_lessons.mjs`. Also corrected the "min-only" phrasing in
  `running-median` and `two-heap-pattern` (they still negate the lower half, now
  framed as portable rather than required).

### arrays/sliding-window (fixed) — ✅ verified (R5.2.4, corrected)

- [Python 3.14 stdlib — sequence slicing](https://docs.python.org/3.14/tutorial/introduction.html#lists)
  — a slice `nums[:k]` builds a NEW list of k elements, so it is O(k) time AND
  O(k) auxiliary space. **Correction:** the fixed sliding-window lesson claimed
  O(1) auxiliary space while initialising the first window with `sum(nums[:k])`;
  it now accumulates the first window with an explicit loop (no slice), states
  the O(k) init cost, guards `k <= 0`/`k > n`, and notes prefix sums are a valid
  O(n)-time / O(n)-space alternative. Accessed 2026-09-20.
- [NeetCode roadmap — Sliding Window](https://neetcode.io/roadmap)
  — placement and the fixed-vs-variable distinction. Accessed 2026-09-20.

### patterns/complexity — ✅ verified (R5.1.2)

Every pattern's `walkthroughCode` now carries a structured `complexityExplanation`
(variables, cost model, line-linked derivation, assumptions, tradeoffs, an
executing counter), not just a `complexityNote`. Derivation line ranges and
counter executability are checked by `scripts/verify_example_model.mjs` against
the bundled runtime. The Big-O CLAIMS themselves remain subject to human review
(R7); this verifies structural completeness and internal consistency only.

### dsa/representations — ⏳ authored, semantic review pending (R9/B1)

Foundations lesson: one small undirected graph stored as an **edge list** and an
**adjacency map**, with a program that rebuilds a normalised `(min, max)` **edge
set** from each and prints whether they match.

- [Open Data Structures (Python) — 12. Graphs](https://opendatastructures.org/ods-python/12_Graphs.html)
  — the chapter intro defines a graph as `G = (V, E)` (edges are pairs of
  vertices) and states it studies **two** representations of graphs. Consulted
  for: a graph is an abstract structure with more than one standard
  representation (so the same graph can be stored different ways). Accessed
  2026-10-02. (Replaces the earlier homepage link, which was not the consulted
  page.)
- [Runestone 7.2 — Graphs: Vocabulary and Definitions](https://runestone.academy/ns/books/published/pythonds3/Graphs/VocabularyandDefinitions.html)
  — defines vertices and edges (an edge connects two vertices, a tuple `(v, w)`).
  Consulted ONLY for the graph **vocabulary** used in the lesson. (This page does
  NOT cover adjacency lists or compare representation costs — those claims were
  moved to 7.3 and 7.5 below.) Accessed 2026-10-02.
- [Runestone 7.3 — The Graph Abstract Data Type](https://runestone.academy/ns/books/published/pythonds3/Graphs/TheGraphAbstractDataType.html)
  — the graph ADT (vertices + edges) has more than one implementation, with
  **trade-offs between representations** (adjacency matrix vs adjacency list).
  Consulted for: choosing a representation to match the operations. Accessed
  2026-10-02.
- [Runestone 7.5 — An Adjacency List](https://runestone.academy/ns/books/published/pythonds3/Graphs/AnAdjacencyList.html)
  — an adjacency list keeps, per vertex, a dictionary of the vertices it connects
  to; it makes finding a vertex's directly-connected neighbours easy and is
  space-efficient for sparse graphs. Consulted for: the adjacency-map
  neighbour-lookup claim (vs scanning an edge list). Accessed 2026-10-02.
- [Python Wiki — TimeComplexity](https://wiki.python.org/moin/TimeComplexity)
  — **dict** `Get Item` and `k in d` are **Average O(1), Amortized Worst Case
  O(n)**; **set** `x in s` is **Average O(1), Worst O(n)**. Consulted to label
  the costs honestly: **reaching** a neighbour set (one dict lookup) is expected
  **O(1)** with a hashing worst case of **O(V)**, which is DISTINCT from
  **enumerating** the neighbours (**O(degree)**, set iteration). The overall
  rebuild is therefore an **expected** O(V + E), not a guaranteed worst case.
  Accessed 2026-10-02.
- [Python 3.14 — Hashing of numeric types](https://docs.python.org/3.14/library/stdtypes.html#hashing-of-numeric-types)
  — the numeric hash reduces a value **modulo a prime P** = `sys.hash_info.modulus`
  (**2147483647** on the bundled 32-bit CPython 3.14 build). Consulted to SCOPE
  the hash-collision claim: the **nonnegative** family `0, P, 2P, 3P, …` all hash
  to **0** (an achievable, unbounded set of colliding int keys), but this is NOT
  a blanket "signed integers congruent mod P collide" — negatives carry a sign /
  `-1`-avoidance adjustment. **Verified on the bundled runtime:** `hash(0) ==
  hash(P) == hash(2*P) == 0`, yet `hash(-1) == -2` while `hash(P-1) == P-1`
  (different, though `-1 ≡ P-1 (mod P)`). Accessed 2026-10-04.

Scope note (recorded during R9/B1 review): the lesson's `from_edges == from_adj`
check compares normalised **edge sets** only. It is an **example under stated
assumptions** (undirected, no self-loops, no duplicate/parallel edges, same node
set) — **not a general graph-equivalence validator**. Some assumption violations
still compare equal (a parallel/duplicate edge collapses in a set, a
non-reciprocal adjacency entry normalises to the same edge, an isolated node in
only one shape adds no edge). Verified on the bundled Pyodide (CPython 3.14.2):
lesson output `True\n3\n` via `verify_lessons.mjs`, and the three still-True
violation cases confirmed by a probe during review. Human semantic review of this
lesson is still pending (`semanticReview: false`).

### dsa/amortized — ⏳ authored, semantic review pending (R9/B1)

- [Open Data Structures (Python) — 2. Array-Based Lists](https://opendatastructures.org/ods-python/2_Array_Based_Lists.html)
  — the exact chapter consulted (replacing the earlier homepage link). It states
  that over a sequence of n operations the **total** cost of growing/shrinking the
  backing array is **O(n)**, so the **amortized** cost is **O(1)** per operation —
  matching the lesson's O(n)-total / amortized-O(1) framing. Accessed 2026-10-04.

Runtime evidence (bundled Pyodide, CPython 3.14.2), recorded during the R9/B1
amendment: `struct.calcsize('P') == 4` (a **4-byte-pointer** build), and
`sys.getsizeof` shows list capacity growing through **4, 8, 16, 24, 32, 40** — a
**proportional (≈ ⅛), non-doubling** over-allocation. (An earlier packet probe
recorded `2,4,8,12,16,20` by wrongly assuming an 8-byte pointer; corrected here.)
A resize **may extend storage in place, or move the existing element references**
into a larger block — it does not duplicate the objects themselves, and
"relocate every reference" is a conceptual worst case, not a guarantee.

### (pending topics)

The following are seeded starting points; entries get filled in as each topic is
authored in later phases. Consult the tables above plus these hints:

- **heaps** → [Runestone binary heap](https://runestone.academy/ns/books/published/pythonds3/Trees/BinaryHeapImplementation.html),
  [`heapq` docs](https://docs.python.org/3/library/heapq.html),
  [Princeton priority queues](https://algs4.cs.princeton.edu/24pq/),
  [VisuAlgo heap](https://visualgo.net/en/heap).
  ⚠️ Reconcile indexing: Python's documented heap uses **0-based** indexing while
  Princeton's illustrated implementation uses **1-based**. Verify `heapq` APIs
  against the bundled Python 3.14.
- **binary search / bounds** → Princeton, MIT 6.006, `bisect` docs.
- **sorting** → Runestone, Princeton, VisuAlgo/USFCA for animations.
- **hashing** → MIT 6.006, Open Data Structures, `dict`/`set` docs.
- **trees / BST / traversals / tries / AVL** → Runestone, Open Data Structures, USFCA.
- **graphs / BFS / DFS / topo** → Princeton, CP-Algorithms, Staying graph docs, VisuAlgo.
- **advanced graphs (union-find, Dijkstra, Bellman–Ford, Floyd–Warshall, Prim, Kruskal)** → CP-Algorithms, Princeton.
- **DP** → MIT 6.006, CP-Algorithms.
- **Fenwick/segment trees, bit manipulation, KMP** → CP-Algorithms.


---

## R5.6 — Notion practice bridges (content-audited mappings)

Some Notion practice problems reuse a lesson's technique with a small, specific
ADAPTATION. Each such adaptation and its correctness condition is now **taught in
the mapped lesson's LEARNER-FACING content** (explanation prose + an experiment +
an exercise) — this section is a developer-facing summary/provenance record, NOT
the place the learner encounters it. Content-audited against the actual lesson on
2026-09-20. Two problems had NO teaching (only a prerequisite) and are
`unresolved` in the manifest instead: **Task Scheduler** (greedy cooldown /
idle-slot scheduling — top-k only gives the max-heap-of-counts prerequisite) and
**Meeting Rooms II** (concurrent-overlap room counting via a min-heap of end
times — interval-sorting only gives sorting + earliest-end greedy).

- **Best Time to Buy and Sell Stock → `kadane`.** Bridge: track the running
  minimum price seen so far and the best `price − min` profit in one pass. Key
  condition: you may only sell after buying, so the minimum must be a strictly
  earlier index — equivalent to Kadane over the day-to-day price deltas.
- **Product of Array Except Self → `prefix-sums`.** Bridge: run the prefix
  accumulation twice — a left-to-right prefix product and a right-to-left suffix
  product — and multiply them per index. Key condition: exclude the current
  element (the answer at i is prefixLeft[i] × prefixRight[i]); no division.
- **Longest Palindromic Substring → `palindromes`.** Bridge: use the lesson's
  two-pointer "is this a palindrome" check as an expand-from-center test, run
  from all 2n−1 centers (each index, and each gap between indices), keeping the
  longest. Key condition: handle both odd (single center) and even (gap) centers.
- **Largest Rectangle in Histogram → `monotonic-stack`.** Bridge: keep a
  monotonic INCREASING stack of bar indices; when a shorter bar arrives, pop and
  compute `height[popped] × width`, where width spans from the new stack top+1 to
  the current index. Key condition: flush the stack at the end with a sentinel
  (height 0) so every bar's rectangle is measured.
- **Combination Sum → `dp-combinations`.** Bridge: same choose/explore/un-choose
  backtracking, but recurse with the SAME index (`bt(i, ...)`) to allow reuse and
  subtract from a running target, pruning when it goes negative. Key conditions:
  (1) reuse is allowed and there is a target sum; (2) the `remaining < 0` prune and
  the search's TERMINATION require **strictly positive** candidates — a zero
  candidate never decreases `remaining` (reusing it recurses forever) and a
  negative one increases it (never overshoots, never terminates); (3) the
  "each combination once" (no-duplicate) argument assumes **distinct** candidate
  values — duplicate input values would emit the same multiset twice unless you
  add a skip-equal-siblings guard. LeetCode's Combination Sum guarantees distinct
  positive candidates, which is why the plain adaptation is correct there. (Unlike
  LC 77 Combinations — fixed k, no reuse — which is in `ADDITIONAL_PRACTICE`.)
- **Sum of Two Integers → `bit-logical-ops`.** Bridge: `sum = a ^ b` (add without
  carry), `carry = (a & b) << 1`, loop until carry is 0. Key condition: in Python
  (arbitrary-precision ints) mask to 32 bits each step and reinterpret the sign,
  since there is no native fixed-width overflow.
- **Longest Consecutive Sequence → `maps-sets`.** Bridge: put all numbers in a
  set, then only start counting a run from `x` when `x−1` is absent, walking
  `x+1, x+2, …`. Key condition: the start-of-run guard is what keeps it O(n)
  overall (each number is visited at most twice).

## Codex delegated review — 2026-10-10

### arrays/traversal
- Read [Python 3.14, Defining Functions](https://docs.python.org/3.14/tutorial/controlflow.html#defining-functions).
  The `sum_all` exercise contract returns the total; printing it is not a
  replacement. Corrected the effective registry's first and pseudocode hints.

### arrays/two-pointers
- Read [Python assignment statements](https://docs.python.org/3.14/reference/simple_stmts.html#assignment-statements)
  and [USACO two pointers](https://usaco.guide/silver/two-pointers?lang=py).
  The RHS is evaluated before assignments. With this reversal, `lo <= hi` makes
  one harmless middle-element self-swap for odd lengths, rather than reversing
  the middle back. Verified empty, single, odd, and even lists on bundled Python.

### arrays/sliding-window
- Read [USACO prefix sums](https://usaco.guide/silver/prefix-sums?lang=py)
  and [USACO sliding windows](https://usaco.guide/silver/two-pointers?lang=py).
  Both techniques correctly compute fixed-width range sums. The difference is
  auxiliary storage/reuse, not whether prefix sums can express the query.
  Reconciled the prompt, answer, effective hints, and conditional alternative.

### arrays/kadane
- Read [CP-Algorithms maximum subsegment sum](https://cp-algorithms.com/others/maximum_average_segment.html)
  and [Python list slicing](https://docs.python.org/3.14/tutorial/introduction.html#lists).
  The constant-space exercise now scans indices instead of allocating `nums[1:]`.
  Its nonempty-input precondition is stated in the prompt. The displayed lesson
  program and expected output are unchanged.

### arrays/in-place
- Read [Python assignment statements](https://docs.python.org/3.14/reference/simple_stmts.html#assignment-statements).
  Under `insert <= i`, the write cannot overwrite a value ahead of the read
  pointer. The RHS is read before the target is updated, including `insert == i`.
  Corrected the prediction question's false premise; no execution is invented.

### Codex B2-A follow-up sources (2026-10-10)

- **string-two-pointers**: [USACO Two Pointers](https://usaco.guide/silver/two-pointers) (Two Pointers): Converging pointers can scan a sequence without allocating a reversed copy.; [Python strings](https://docs.python.org/3.14/tutorial/introduction.html#strings) (Strings): Strings support indexing and slicing.
- **string-sliding-window**: [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/description/) (Examples and constraints): The answer is a contiguous substring, not a subsequence.; [USACO Two Pointers](https://usaco.guide/silver/two-pointers) (Sliding Window): Monotone pointers bound total movement linearly.
- **string-parsing**: [Python int](https://docs.python.org/3.14/library/functions.html#int) (int constructor): int accepts surrounding whitespace; malformed numeric tokens can raise ValueError.; [Python defining functions](https://docs.python.org/3.14/tutorial/controlflow.html#defining-functions) (Return statements): Return supplies the function result; printing is a separate output operation.
- **palindromes**: [CP-Algorithms palindromes](https://cp-algorithms.com/string/manacher.html) (Trivial algorithm; Working with parities): Naive expansion around centers costs O(n^2); odd and even centers differ.
- **anagrams**: [Python Sorting Techniques](https://docs.python.org/3.14/howto/sorting.html) (Sorting basics; Timsort): sorted creates a new list; adaptive sorting exploits ordered runs.; [Python Counter](https://docs.python.org/3.14/library/collections.html#collections.Counter) (Counter objects): Counter tallies hashable objects and supports equality of counts.
- **substrings**: [Python strings](https://docs.python.org/3.14/tutorial/introduction.html#strings) (Strings and slicing): A string slice selects characters with an exclusive end.; [CP-Algorithms palindromes](https://cp-algorithms.com/string/manacher.html) (Trivial algorithm): Palindrome substring search can require center expansion rather than a monotone sliding window.
- **maps-sets**: [Python glossary](https://docs.python.org/3.14/glossary.html#term-hashable) (Hashable): Tuples are hashable only if their elements are hashable; user-defined objects can be hashable by identity.; [Runestone hashing](https://runestone.academy/ns/books/published/pythonds3/SortSearch/Hashing.html) (Collision resolution and analysis): Hash collisions require resolution and affect operation costs.
- **hashing-frequency**: [Python Counter](https://docs.python.org/3.14/library/collections.html#collections.Counter) (Counter objects and most_common): Counter preserves insertion order and resolves equal-frequency ties by first encounter.; [Python Sorting Techniques](https://docs.python.org/3.14/howto/sorting.html) (Sorting basics): Sorting keys for display is separate work from frequency counting.
- **duplicate-detection**: [Open Data Structures sorting](https://opendatastructures.org/ods-python/11_1_Comparison_Based_Sorti.html) (11.1.3 Heap-sort): Heap-sort reuses the input array and runs in O(n log n) time.; [Python Sorting Techniques](https://docs.python.org/3.14/howto/sorting.html) (Sorting basics; Timsort): list.sort mutates its input; mutation alone does not specify auxiliary memory.; [Runestone hashing](https://runestone.academy/ns/books/published/pythonds3/SortSearch/Hashing.html) (Collision resolution): Collision resolution can require multiple candidate checks.

Return-value corrections in loops, matrix traversal and character counting use the Python defining-functions page. Interval merging was checked against the original LeetCode examples and Python sorting documentation. Complexity bounds for materialized substrings are derived from the sum of lengths n(n+1)(n+2)/6, not attributed to a source that only defines slicing.

## Codex B2-B topic checks (2026-10-10)

### lesson/value-to-index

Two-sum complement ordering and original-index contract checked; expected hashing distinguished from collision worst case. Constant-space sorting alternative names iterative heapsort and its index tradeoff.

- [USACO Guide: two pointers](https://usaco.guide/silver/two-pointers) — Sum of Two Values; Sliding Window. Checked: Sorted opposite-end pointers move according to the current sum; suitable monotone windows advance each boundary at most n times. Accessed 2026-10-10.

### lesson/grouping

Canonical sorted-letter keys checked, including empty strings. Costs include key construction/hashing; buckets hold original-word references. First-letter exercise explicitly requires nonempty words.

- [Python dictionary setdefault](https://docs.python.org/3.14/library/stdtypes.html#dict.setdefault) — Mapping types: setdefault. Checked: setdefault returns the existing value, or inserts and returns the supplied default. Accessed 2026-10-10.
- [Group Anagrams: original problem](https://leetcode.com/problems/group-anagrams/) — Problem, examples, and constraints. Checked: Anagrams share the same multiset of letters; the original problem permits empty strings and restricts characters to lowercase English letters. Accessed 2026-10-10.

### lesson/prefix-sums-map

Empty-prefix count and lookup-before-increment checked. Fixed-size windows support negatives; the invalid monotonicity argument applies to sum-threshold variable windows. n+1 possible stored prefix keys.

- [USACO Guide: prefix sums](https://usaco.guide/silver/prefix-sums) — Exclusive prefix sums, adapted to 0-based endpoints. Checked: Range sums can be recovered from two prefix totals. Accessed 2026-10-10.

### lesson/caching-seen

Base Fibonacci calls are not cached; non-base states are. General memoization cost includes state work/transitions and reuse. Bounded arithmetic, hash behavior, recursion limits and large-integer costs are explicit.

- [Runestone: dynamic programming](https://runestone.academy/ns/books/published/pythonds3/Recursion/DynamicProgramming.html) — Repeated coin-change calls and result caching. Checked: Caching prior subproblem results avoids repeating their computation. Accessed 2026-10-10.
- [Python functools caching](https://docs.python.org/3.14/library/functools.html#functools.lru_cache) — lru_cache; hashable arguments and eviction. Checked: lru_cache caches results keyed by hashable arguments, with a configurable size limit. Accessed 2026-10-10.

### lesson/bit-logical-ops

Corrected precedence (& binds tighter than ==), simultaneous old-operand carry calculation, specific -1+1 unbounded-carry counterexample, and finite-width signed wrap semantics.

- [Python integer bit operations](https://docs.python.org/3.14/library/stdtypes.html#bitwise-operations-on-integer-types) — Bit operations; int.bit_count. Checked: Python integer bit operations use infinite-sign-extension semantics; bit_count counts ones in the absolute value. Accessed 2026-10-10.
- [Python expression precedence](https://docs.python.org/3.14/reference/expressions.html#operator-precedence) — 6.10 and 6.17. Checked: Bitwise operations bind more tightly than comparisons. Accessed 2026-10-10.

### lesson/bit-shifts

Python arbitrary-precision left-shift work/storage includes the shift distance, not just input width. Negative distances invalid; no unsupported claim that shifts and arithmetic have equal speed.

- [Python integer bit operations](https://docs.python.org/3.14/library/stdtypes.html#bitwise-operations-on-integer-types) — Bit operations; int.bit_count. Checked: Python integer bit operations use infinite-sign-extension semantics; bit_count counts ones in the absolute value. Accessed 2026-10-10.

### lesson/bit-check-set-clear

Masks return new integer values and require nonnegative bit positions. Constant-time claims are bounded-width/position models, not universal big-integer guarantees.

- [Python integer bit operations](https://docs.python.org/3.14/library/stdtypes.html#bitwise-operations-on-integer-types) — Bit operations; int.bit_count. Checked: Python integer bit operations use infinite-sign-extension semantics; bit_count counts ones in the absolute value. Accessed 2026-10-10.

### lesson/xor-cancellation

A fold combines odd-count values; 1^2^3=0 disproves recovery of all of them. Exactly one odd-count value is required. Width-dependent work/storage and distinct missing-range contract stated.

- [CP-Algorithms: bit manipulation](https://cp-algorithms.com/algebra/bit-manipulation.html) — Bit operators and XOR. Checked: XOR combines differing bits; pairing equal values cancels their contribution. The examples use fixed-width C++ integers. Accessed 2026-10-10.
- [Python integer operations](https://docs.python.org/3.14/library/stdtypes.html#bitwise-operations-on-integer-types) — Bitwise operations on integer types. Checked: Python integers have arbitrary precision and bitwise operations use infinite sign extension. Accessed 2026-10-10.
- [CPython 3.14.2 integer implementation](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/longobject.c) — long_lshift1; long_bitwise; int_bit_count_impl. Checked: These implementations allocate and iterate over integer digits; bit-operation costs depend on operand and result width. Accessed 2026-10-10.
- [Single Number: original problem](https://leetcode.com/problems/single-number/) — Problem and constraints. Checked: Exactly one integer appears once and every other integer appears twice. Accessed 2026-10-10.

### lesson/count-set-bits

Kernighan explicitly rejects negative input; runtime tested against bit_count on zero and wide integers. Power-of-two experiment excludes zero. Builtin counting still processes integer digits.

- [Python integer bit operations](https://docs.python.org/3.14/library/stdtypes.html#bitwise-operations-on-integer-types) — Bit operations; int.bit_count. Checked: Python integer bit operations use infinite-sign-extension semantics; bit_count counts ones in the absolute value. Accessed 2026-10-10.

### lesson/kmp

LPS proper-prefix convention, fallback amortization, overlaps, and all-boundaries empty-pattern convention checked against exhaustive oracle. Pattern index drawn on pattern; text character can be compared again without backtracking. Output storage separated.

- [Cornell CS312: string matching](https://www.cs.cornell.edu/courses/cs312/2002fa/lectures/lec26.htm) — Knuth-Morris-Pratt and prefix computation. Checked: Fallback decreases a quantity that increases at most n times, giving linear search work; prefix preprocessing is linear. Accessed 2026-10-10.

### pattern/sliding-window

Explicit no-slice initialization and invalid-width guard preserve constant auxiliary space. Boundaries/totals authored; prefix arrays are accepted as a valid storage tradeoff. Diagram total/window rendering is tracked as a remaining application repair.

- [USACO Guide: two pointers](https://usaco.guide/silver/two-pointers) — Sum of Two Values; Sliding Window. Checked: Sorted opposite-end pointers move according to the current sum; suitable monotone windows advance each boundary at most n times. Accessed 2026-10-10.
- [USACO Guide: prefix sums](https://usaco.guide/silver/prefix-sums) — Exclusive prefix sums, adapted to 0-based endpoints. Checked: Range sums can be recovered from two prefix totals. Accessed 2026-10-10.

### pattern/prefix-sums-hashmap

Exclusive [i,j) endpoints, non-inserting get, zero-prefix seed and lookup order verified. Contrast distinguishes fixed negative windows, exact-target counts, and unrestricted maximum sums.

- [USACO Guide: prefix sums](https://usaco.guide/silver/prefix-sums) — Exclusive prefix sums, adapted to 0-based endpoints. Checked: Range sums can be recovered from two prefix totals. Accessed 2026-10-10.
- [Python dict.get](https://docs.python.org/3.14/library/stdtypes.html#dict.get) — Dictionary methods. Checked: get returns its default without inserting a missing key. Accessed 2026-10-10.

### pattern/kadane

Indexed traversal avoids hidden input slice; best sum is a total rather than an index overlay. Nonempty recurrence and model behavior checked against signed-array boundaries.

- [CP-Algorithms: maximum subarray](https://cp-algorithms.com/others/maximum_average_segment.html) — Algorithm 2: Kadane. Checked: The best running sum can restart after a negative prefix; a one-pass algorithm uses constant working state. Accessed 2026-10-10.

### pattern/two-pointers

Sorted movement logic, empty/singleton contracts, and terminating wrong-move bug checked. ASCII case-insensitive palindrome scoped honestly; reversed-copy alternative accepted when storage is allowed.

- [USACO Guide: two pointers](https://usaco.guide/silver/two-pointers) — Sum of Two Values; Sliding Window. Checked: Sorted opposite-end pointers move according to the current sum; suitable monotone windows advance each boundary at most n times. Accessed 2026-10-10.

### pattern/cyclic-sort

0<=home<n guard and distinct range contract checked exhaustively through n=5. Linear proof counts permanently fixed slots, not an incorrect one-swap-per-moving-value claim. Input mutation explicitly allowed.

- [Missing Number: original contract](https://leetcode.com/problems/missing-number/) — Problem and constraints. Checked: n distinct values come from 0..n with exactly one missing. Accessed 2026-10-10.

### pattern/bitwise-xor

Single-odd-count isolation and two-group extension distinguished. Bounded-width costs explicit. Triple-frequency drill accepts sorting equal-value runs and documents finite-width handling for bit-count modulo 3.

- [CP-Algorithms: bit manipulation](https://cp-algorithms.com/algebra/bit-manipulation.html) — Bit operators and XOR. Checked: XOR combines differing bits; pairing equal values cancels their contribution. The examples use fixed-width C++ integers. Accessed 2026-10-10.
- [Python integer operations](https://docs.python.org/3.14/library/stdtypes.html#bitwise-operations-on-integer-types) — Bitwise operations on integer types. Checked: Python integers have arbitrary precision and bitwise operations use infinite sign extension. Accessed 2026-10-10.
- [CPython 3.14.2 integer implementation](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/longobject.c) — long_lshift1; long_bitwise; int_bit_count_impl. Checked: These implementations allocate and iterate over integer digits; bit-operation costs depend on operand and result width. Accessed 2026-10-10.
- [Single Number: original problem](https://leetcode.com/problems/single-number/) — Problem and constraints. Checked: Exactly one integer appears once and every other integer appears twice. Accessed 2026-10-10.

### pattern/matrix-traversal

Boundary guards checked against an independent peel-and-rotate oracle for empty, single-row/column and rectangular grids. Output excluded from constant working slots; square-only in-place rotation stated.

- [Spiral Matrix: original contract](https://leetcode.com/problems/spiral-matrix/) — Problem and examples. Checked: The input is a rectangular matrix; required traversal follows the perimeter inward. Empty-input handling here is an authored extension. Accessed 2026-10-10.
