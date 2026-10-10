# References directory

## Final hint progression addendum (2026-10-10)

Root reviewed the five updated hint progressions for `dp-recursive-calls`,
`dp-1d-2d`, `dp-house-robber`, `backtracking` and `dynamic-programming`.
Exact additional pages consulted:

- [MIT 6.006 lecture 15](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/9eb3e9a51a7b5b60b0f67c2277f8b0ee_MIT6_006S20_lec15.pdf),
  pp. 2–4: complete Fibonacci states, overlapping dependencies, memoization,
  tabulation, scalar transition cost versus growing integer cost.
- [CP-Algorithms DP introduction](https://cp-algorithms.com/dynamic_programming/intro-to-dp.html),
  memoization and bottom-up sections: avoid recomputing fully specified states.
- [CP-Algorithms knapsack](https://cp-algorithms.com/dynamic_programming/knapsack.html),
  0/1 transition and implementation invariant: descending capacity preserves
  the previous item layer for positive item weights.
- [Stanford CS106B enumeration](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1258/lectures/11-backtracking1/),
  subset decision tree: finite include/exclude choices and output enumeration.
- [Georgia Tech CS3510 lecture 9](https://faculty.cc.gatech.edu/~ladha/algo/L9.pdf),
  house-robber section: take/skip prefix recurrence and non-adjacent constraint.

These original hints preserve B6's conventions. Counting and enumerating are
different outputs; compressed storage must retain dependencies. The review
record distinguishes the five rereviewed hashes from unchanged approvals.

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
## Searching, sorting, and related patterns — consulted 2026-10-10

### lesson/linear-search

First-match index and absent -1 contract checked on empty, duplicate, negative and singleton inputs. No sorting is needed, but len/index access and equality costs are assumed. Set/hash alternatives require hashable values and expected hashing; coding models return the tested result. Function-only cost excludes demo construction/output.

- [TheSequentialSearch](https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheSequentialSearch.html) — Algorithm, analysis and visual example. Checked: Sequential search needs no ordering; present uniform-position average is linear. Accessed 2026-10-10.
- [binary reference](https://cp-algorithms.com/num_methods/binary_search.html) — Search in sorted arrays. Checked: Linear scan is O(n). Accessed 2026-10-10.

### lesson/binary-search

Inclusive lo..hi invariants and mid±1 progress checked; equality tests are distinguished from returns. Empty/duplicate inputs preserve any-match-or--1 contract. Average logarithmic search assumes uniformly selected present distinct keys; sortedness validation is outside query scope. Diagram now displays the candidate range.

- [TheBinarySearch](https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheBinarySearch.html) — Algorithm, analysis and visual example. Checked: Sorted order permits halving; slicing is not constant-time. Accessed 2026-10-10.
- [binary reference](https://cp-algorithms.com/num_methods/binary_search.html) — Search in sorted arrays; lower and upper bound. Checked: Monotone order supports logarithmic search. Convention: This app uses inclusive [lo, hi] and excludes mid with mid ± 1. Accessed 2026-10-10.

### lesson/binary-search-answer

Positive nonempty integer weights, days>=1, order-preserving greedy feasibility and feasible sum upper bound checked against an independent exhaustive capacity oracle. Invalid inputs reject; R=0 still incurs initialization, so O(n log(R+2)). Exercises explain positive exact-m splitting and valid DP alternatives. Scalar capacities are shown as values, not array indices.

- [shipping reference](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/description/) — Problem statement, examples, constraints. Checked: Shipping keeps package order and positive weights; at least one day is permitted. Convention: This app permits days > n as harmless spare days. Accessed 2026-10-10.
- [binary reference](https://cp-algorithms.com/num_methods/binary_search.html) — Search on arbitrary predicate; binary search on the answer. Checked: A monotone predicate identifies a transition within correctly bracketed bounds. Accessed 2026-10-10.

### lesson/rotated-array-search

Exhaustive rotations of distinct lists through n=6 agree with linear lookup. Distinctness is a correctness precondition: [1,0,1,1,1], target0 produces -1 in this code. A separate duplicate-aware variant must discard equal ambiguous endpoints and may take O(n). Inclusive search range, line tests, model explanations and recognition conditions agree.

- [rotated reference](https://leetcode.com/problems/search-in-rotated-sorted-array/description/) — Problem statement and distinct-value constraints. Checked: The original rotated-array logarithmic search problem guarantees unique values. Convention: The app also supports the empty input as -1. Accessed 2026-10-10.
- [binary reference](https://cp-algorithms.com/num_methods/binary_search.html) — Search in sorted arrays; implementation. Checked: Each range update needs a valid invariant and progress. Accessed 2026-10-10.

### lesson/bounds

Both lower/upper half-open loops are visible and match CPython bisect on absent values, empty and all-equal lists. hi=len is rendered as an exclusive endpoint. A lower bound requires bounds-and-equality membership validation. insort insertion shifts O(n) references and may resize; the query O(log n)/O(1) analysis is explicitly scoped separately.

- [bisect reference](https://docs.python.org/3.14/library/bisect.html) — bisect_left, bisect_right; performance notes; Searching Sorted Lists. Checked: Left/right insertion points differ on equality; membership requires an equality check; insort is O(n). Convention: The hand-written loops use half-open [lo,hi), matching the library insertion-point result. Accessed 2026-10-10.
- [binary reference](https://cp-algorithms.com/num_methods/binary_search.html) — Lower bound and upper bound; implementation. Checked: The two bounds delimit the equal-value range. Accessed 2026-10-10.

### lesson/matrix-search

Rectangular globally nondecreasing row-major order is required; row/column sorting alone is insufficient. Flat index quotient/remainder mapping and empty/singleton/duplicate cases tested. Stored row/col highlight the actually examined cell. No O(m*n) validation scan is included in the logarithmic query cost; equality across row boundaries is allowed.

- [matrix reference](https://leetcode.com/problems/search-a-2d-matrix/description/) — Problem statement; row-major ordering requirements. Checked: The flattening problem requires ordered rows with ordered row boundaries. Convention: The app permits equal row-boundary values: nondecreasing global order still suffices. Accessed 2026-10-10.
- [staircase reference](https://leetcode.com/problems/search-a-2d-matrix-ii/description/) — Problem statement; sorted row and column constraints. Checked: Row/column sorting is a weaker input guarantee than global row-major order. Accessed 2026-10-10.
- [binary reference](https://cp-algorithms.com/num_methods/binary_search.html) — Search in sorted arrays. Checked: Halving requires a sorted search sequence. Accessed 2026-10-10.

### lesson/bubble-sort

Shown basic implementation always performs n(n-1)/2 adjacent comparisons, including sorted input; linear best case belongs to the early-exit variant. Strict out-of-order swaps preserve stability, confirmed with tagged equal keys. Copy time is O(n); O(1) auxiliary cost excludes the returned copy, whose storage is O(n). No unsupported wall-clock prediction remains.

- [TheBubbleSort](https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheBubbleSort.html) — Algorithm, analysis and visual example. Checked: The basic sort has a triangular comparison count; early exit is a separate variant. Accessed 2026-10-10.
- [CPython 3.14.2 list implementation](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c) — list slicing; list_resize; binarysort. Checked: List copies allocate references; binary insertion sorting moves entries to make room. Convention: This app returns a defensive copy and uses ascending minimum-selection rather than descending maximum-selection. Accessed 2026-10-10.

### lesson/selection-sort

Minimum scan performs n(n-1)/2 comparisons and this exact code executes n placement swaps, including self-swaps. Sorted data still writes each placement pair. Unstable selection distinguished from stable variants. Empty, negative, duplicate and reverse inputs tested; copied-result space is explicitly separated from O(1) working scalars.

- [TheSelectionSort](https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheSelectionSort.html) — Algorithm, analysis and visual example. Checked: Selection places one extremal value per pass with quadratic comparisons. Accessed 2026-10-10.
- [CPython 3.14.2 list implementation](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c) — list slicing; list_resize; binarysort. Checked: List copies allocate references; binary insertion sorting moves entries to make room. Convention: This app returns a defensive copy and uses ascending minimum-selection rather than descending maximum-selection. Accessed 2026-10-10.

### lesson/insertion-sort

Strict > shifts preserve stability; tagged records and signed boundaries tested. Adaptive cost is O(n+I), where I is inversion count; near-sorted linearity requires I=O(n). The while counter counts the short-circuit whole condition, not always a key comparison. Held key is displayed separately. Output copy time/storage are included or explicitly excluded by scope.

- [TheInsertionSort](https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheInsertionSort.html) — Algorithm, analysis and visual example. Checked: Insertion shifts larger prefix items; ordered input takes linear work. Accessed 2026-10-10.
- [CPython 3.14.2 list implementation](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c) — list slicing; list_resize; binarysort. Checked: List copies allocate references; binary insertion sorting moves entries to make room. Convention: This app returns a defensive copy and uses ascending minimum-selection rather than descending maximum-selection. Accessed 2026-10-10.

### lesson/merge-sort

Base cases and two strictly smaller recursive slices introduced before use. Stable <= tie choice checked with tagged records. Slicing/copying is O(n) per recursion level, so total time remains O(n log n); cumulative allocation is distinguished from O(n) peak live storage. Separate input, left/right, destination and live recursion bindings render actual traces.

- [Open Data Structures: comparison-based sorting](https://opendatastructures.org/ods-python/11_1_Comparison_Based_Sorti.html) — 11.1.1 merge-sort; recursion-tree analysis and figure. Checked: Balanced split, linear merge/copy work per level, logarithmic levels. Accessed 2026-10-10.
- [TheMergeSort](https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheMergeSort.html) — Algorithm, analysis and visual example. Checked: Taking left on <= preserves stability; base case is empty/singleton. Accessed 2026-10-10.
- [visual reference](https://visualgo.net/en/sorting) — Merge sort visualization pseudocode. Checked: Display split halves and the merged destination as separate state. Accessed 2026-10-10.

### lesson/quick-sort

Reviewed the exact middle-position-pivot three-list version, not in-place partition quicksort. All-equal best case is O(n); average O(n log n) requires distinct random permutations; crafted extremes give quadratic time and quadratic peak retained-list space. Real depth12 trace retains list lengths1..12. Total-order/no-NaN preconditions and separate classic in-place stack costs are explicit; stable group ordering checked.

- [Open Data Structures: comparison-based sorting](https://opendatastructures.org/ods-python/11_1_Comparison_Based_Sorti.html) — 11.1.2 quicksort; randomized pivot and three-way partition. Checked: Randomized pivots yield expected logarithmic-depth sorting; equal groups avoid further recursion. Convention: The app chooses a deterministic middle-position pivot and allocates three lists. Its retained-list memory bound is derived from this code, not from the in-place source. Accessed 2026-10-10.
- [TheQuickSort](https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheQuickSort.html) — Algorithm, analysis and visual example. Checked: Unbalanced partitions can produce a quadratic sum of subproblem sizes; median-of-three is a heuristic. Accessed 2026-10-10.
- [CPython 3.14.2 list implementation](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c) — list slicing and allocation. Checked: Lists own allocated arrays of element references. Accessed 2026-10-10.

### lesson/counting-sort

Shown integer-frequency reconstruction differs from stable record placement. Nonnegative 0..hi keys, O(n+hi) costs and sparse-range tradeoff checked. Temporary repeated-value list can hold O(n) references beyond result/counts, so auxiliary statement includes it. Output binding now shows reconstruction, and expected speed is not treated as unconditional against adaptive Python sorting.

- [Open Data Structures: counting and radix sorting](https://opendatastructures.org/ods-python/11_2_Counting_Sort_Radix_So.html) — Counting sort; stable placement; radix sorting. Checked: Counting arrays use the bounded key domain; stable per-digit passes enable radix sorting. Convention: This app rebuilds integer values from frequencies; record stability is a separate variant. Accessed 2026-10-10.
- [CPython 3.14.2 list implementation](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c) — list_repeat; list_extend. Checked: Repeated-value expressions allocate temporary lists before extend. Accessed 2026-10-10.

### lesson/bucket-sort

Mapped nonnegative integer x*k//(max+1) into 0..k-1, requiring positive integer k; floats require different integer-index mapping. Actual inner Python sorted gives O(n log n+k) worst time, not a quadratic insertion-sort bound. Expected linearity requires k=Theta(n) and suitable independent occupancy; fixed default k=5 cannot establish it. Bucket matrix and result render actual values.

- [McGill: Bucket Sorting in Expected Linear Time](https://www-cgrl.cs.mcgill.ca/~godfried/teaching/dm-reading-assignments/Bucket-Sorting-Expected-Complexity.pdf) — Algorithm steps 2–5; uniform-input occupancy analysis. Checked: The expected-linear theorem uses a number of buckets proportional to n and independent uniform samples. Convention: The app maps nonnegative integers with max+1 and defaults to fixed k=5, so it does not inherit that expectation. Accessed 2026-10-10.
- [sort reference](https://docs.python.org/3.14/howto/sorting.html) — Sorting basics; Timsort. Checked: Python sort is adaptive and sorts each supplied bucket. Accessed 2026-10-10.
- [CPython 3.14.2 list implementation](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c) — sort implementation, binarysort and merge routines. Checked: Python list sort combines ordered runs with temporary storage. Accessed 2026-10-10.

### lesson/heap-sort

Separate copied min-heap plus output list is the displayed algorithm; O(n) heapify and repeated minimum extraction give O(n log n) worst time with O(n) auxiliary heap memory. Classic O(1)-auxiliary array heapsort is distinguished. Explicit loop makes heap shrinking and output growth visible, with one actual pop per counter entry. No stability or blanket practical-speed guarantee is taught.

- [heap reference](https://docs.python.org/3.14/library/heapq.html) — Heap invariant; heapify; heappop; max-heap functions. Checked: heapify is linear; min-heap heappop returns the smallest; Python 3.14 includes max-heap functions. Convention: This app uses a separate 0-based min-heap. Accessed 2026-10-10.
- [Open Data Structures: comparison-based sorting](https://opendatastructures.org/ods-python/11_1_Comparison_Based_Sorti.html) — 11.1.3 heap-sort. Checked: Classic in-place heapsort reuses the input array. Accessed 2026-10-10.

### lesson/radix-sort

Stable LSD bucket ordering and digit extraction checked on empty, zero, duplicates and varying lengths. d>=1 includes zero by convention; all-zero input executes zero bucket passes but still costs O(n) copy/max. Nonnegative integer and bounded arithmetic assumptions explicit. Digit buckets and rebuilt output render; unrestricted Python integer bit costs are excluded from unit-cost bound.

- [Open Data Structures: counting and radix sorting](https://opendatastructures.org/ods-python/11_2_Counting_Sort_Radix_So.html) — Counting sort and radix sort. Checked: Stable lower-digit-first passes preserve prior order and avoid an array indexed by the whole key range. Convention: This app uses base10 list buckets and nonnegative Python integers. Accessed 2026-10-10.

### lesson/comparators

Python3.14 key-once and stable reverse semantics checked against official docs and runtime. Returned sorted lists are materialized for diagrams while original inputs remain inspectable. Tuple keys, numeric descending negation and string multipass alternatives distinguished. cmp_to_key is accepted when only a valid comparator is available. Program bound includes literals and bounded-size printing/key costs; functions/expressions prerequisites named.

- [sort reference](https://docs.python.org/3.14/howto/sorting.html) — Key Functions; Sort Stability; Ascending and Descending; comparison functions. Checked: Keys are evaluated once; ties remain stable, including reverse; multiple stable passes express mixed directions. Accessed 2026-10-10.
- [CPython 3.14.2 list implementation](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c) — list_sort_impl; key allocation; merge routines. Checked: Keys and merge buffers can occupy linear auxiliary storage. Accessed 2026-10-10.

### lesson/interval-sorting

Start-key returned list is shown alongside original intervals. Program complexity includes construction and bounded-size endpoint output. Sorting already ordered input can be linear; a reverse end-sorted merge is a valid adapted sweep, while the displayed forward merge needs start order. Closed merge and positive-duration half-open scheduling conventions are distinguished.

- [sort reference](https://docs.python.org/3.14/howto/sorting.html) — Key Functions; Sort Stability. Checked: Key functions order records and preserve ties. Accessed 2026-10-10.
- [intervals reference](https://leetcode.com/problems/merge-intervals/description/) — Examples and endpoint constraints. Checked: Closed ranges that touch can be merged. Accessed 2026-10-10.
- [Cornell: Greedy Stays Ahead](https://www.cs.cornell.edu/courses/cs482/2006su/handouts/ahead.pdf) — Interval scheduling example and proof. Checked: Earliest finish leaves a maximum-cardinality compatible set. Convention: This app distinguishes closed merging intervals from half-open start<end meeting intervals. Accessed 2026-10-10.

### pattern/binary-search-on-answer

Monotone false-to-true search requires a feasible upper bound. Standalone can_ship now rejects a package heavier than cap; positive nonempty weights and days>=1 validated by least_capacity. Brute capacity oracle covers singleton R=0 and days>n. Initialization-inclusive O(n log(R+2)) and scalar diagram bindings agree. DP is a valid alternative with its own state recurrence.

- [shipping reference](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/description/) — Problem statement, examples, constraints. Checked: Shipping keeps package order and positive weights; at least one day is permitted. Convention: This app permits days > n as harmless spare days. Accessed 2026-10-10.
- [binary reference](https://cp-algorithms.com/num_methods/binary_search.html) — Search on arbitrary predicate; binary search on the answer. Checked: A monotone predicate identifies a transition within correctly bracketed bounds. Accessed 2026-10-10.

### pattern/merge-intervals

Empty-safe nonmutating closed-interval union uses start-sorted references and fresh result pairs. Touching, nesting, negative endpoints and empty input checked; no input-pair aliases are mutated. Python key/merge buffers and separate sorted list require O(n) auxiliary space, excluding required output. Reverse end-order sweep is an adapted alternative; selecting intervals and counting rooms have different objectives.

- [intervals reference](https://leetcode.com/problems/merge-intervals/description/) — Examples 1–3; valid endpoint pairs. Checked: The output is a union of overlaps; touching endpoints merge. Convention: Closed ranges with start <= end; fresh output pairs; nonmutating input. Accessed 2026-10-10.
- [sort reference](https://docs.python.org/3.14/howto/sorting.html) — Key functions; stability. Checked: Sort-by-start prepares ordered processing; sort consumes working storage. Accessed 2026-10-10.
- [CPython 3.14.2 list implementation](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c) — sort key allocation and merge routines. Checked: In-place list.sort can still allocate linear working memory. Accessed 2026-10-10.

### pattern/greedy-interval-scheduling

Earliest compatible finish maximizes equally weighted meeting count by stays-ahead/exchange reasoning. Finite start<end meetings use touching-compatible half-open scheduling; output is a count. Brute subset oracle verifies small tied/nested/negative cases. Python in-place sort still uses O(n) keys/merge buffers. Weighted values require DP, and resource counting/arrows are not automatically this selection pattern.

- [Cornell: Greedy Stays Ahead](https://www.cs.cornell.edu/courses/cs482/2006su/handouts/ahead.pdf) — Interval scheduling example; induction and optimality contradiction. Checked: Earliest finish stays ahead and maximizes the compatible interval count. Convention: The app treats touching positive-duration meetings as compatible. Accessed 2026-10-10.
- [sort reference](https://docs.python.org/3.14/howto/sorting.html) — Key Functions. Checked: Sort by end with one key computation per interval. Accessed 2026-10-10.
- [CPython 3.14.2 list implementation](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c) — key-sort allocation; merge working storage. Checked: Mutating a list through sort does not imply constant working space. Accessed 2026-10-10.

### pattern/modified-binary-search

Distinct rotated-array implementation checked across all small rotations, with a concrete duplicate counterexample proving incorrectness outside the contract. Sorted-half identification and endpoint updates agree with trace and inclusive-range diagram. Halving counter uses midpoint execution and excludes the final failed loop condition. Feasibility-search alternatives require positive shipping inputs rather than an ordinary array-order assumption.

- [rotated reference](https://leetcode.com/problems/search-in-rotated-sorted-array/description/) — Problem statement and distinct-value constraints. Checked: The original rotated-array logarithmic search problem guarantees unique values. Convention: The app also supports the empty input as -1. Accessed 2026-10-10.
- [binary reference](https://cp-algorithms.com/num_methods/binary_search.html) — Search in sorted arrays; implementation. Checked: Each range update needs a valid invariant and progress. Accessed 2026-10-10.

### pattern/divide-and-conquer

Base case, strictly smaller children and correct combine are required; efficient independent splits avoid repeated states, while overlap can motivate memoization. Correct recurrence is2T(n/2)+O(n), including linear slices per level. Stable merge oracle and recursive bindings agree. Balanced vs unbalanced depth and quicksort variant memory are distinguished; quickselect expected linearity requires random pivots.

- [Open Data Structures: comparison-based sorting](https://opendatastructures.org/ods-python/11_1_Comparison_Based_Sorti.html) — 11.1.1 merge-sort; recurrence tree and Figure 11.2. Checked: Two half-sized calls plus linear copy/merge work give logarithmic levels and O(n log n) time. Accessed 2026-10-10.
- [TheMergeSort](https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheMergeSort.html) — Algorithm, analysis and visual example. Checked: The <= choice keeps equal items stable; base case stops at <=1. Accessed 2026-10-10.



# Codex B4 reference reconciliation — 2026-10-10

# B4 reference mirror for root integration

Access date: 2026-10-10 UTC. These are the exact consulted pages, sections and claims on the 23 owned lessons and 6 patterns. Entries are for mirroring into docs/references.md; they do not promote evidence flags. Text and source-diagram observations are distinguished in the review packets.

## lesson:stack-queue-operations

- [Runestone: Python stack](https://runestone.academy/ns/books/published/pythonds3/BasicDS/ImplementingaStackinPython.html) — 3.5 list-end stack and front-shifting comparison.
  - Claims: List-end operations implement LIFO; front removal shifts items.
  - Conventions: Source list-end stack analysis omits occasional resizing. App uses amortized O(1) append/pop and qualifies a single resizing operation.
  - Accessed: 2026-10-10.
- [CPython 3.14.2 list source](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c) — list_resize; append and pop implementations.
  - Claims: Python list storage grows and shrinks; end updates are amortized.
  - Conventions: Version-pinned CPython 3.14.2 source. Resizing qualifies the app list-end update costs as amortized; one resizing update can be linear.
  - Accessed: 2026-10-10.
- [Python 3.14: deque](https://docs.python.org/3.14/library/collections.html#collections.deque) — deque operations, bounded deques, empty pops, rotation.
  - Claims: deque end removals implement FIFO without front shifting.
  - Conventions: Use the Python 3.14 deque API; end operations are constant-time, bounded append evicts from the opposite end, and full bounded insert raises IndexError.
  - Accessed: 2026-10-10.

## lesson:monotonic-stack

- [Cornell CS2110: Stacks and queues](https://courses.cis.cornell.edu/courses/cs2110/2026fa/lectures/lec15/) — LinkedStack; exercises 15.6, 15.7, 15.10; deque interface.
  - Claims: Next-greater monotonic stack keeps candidates ordered.
  - Conventions: Source next-greater exercise scans right to left and omits the final output slot. App scans left to right, returns n slots, and uses -1 for no strict greater successor.
  - Accessed: 2026-10-10.
- [Minimum stack and queue](https://cp-algorithms.com/data_structures/stack_queue_modification.html) — Stack modification; queue methods 1–3; fixed-length subarray minimum.
  - Claims: Sliding-window extrema need front expiry as well as back domination removal.
  - Conventions: Source minimum structures transfer once between two FIFO stacks; reverse comparisons for app maximum variants. Monotonic deque expires by window index.
  - Accessed: 2026-10-10.
- [HKOI: Data Structures I](https://assets.hkoi.org/training2019/ds-i.pdf) — Slides 31–36: histogram observations, monotonic stack, right boundary and end flush.
  - Claims: A shorter bar closes taller rectangles; a final flush measures candidates left at the end.
  - Conventions: Source stores height and left boundary; app stores indices and computes width i-left-1. Equal heights remain; zero sentinel flushes positive heights.
  - Accessed: 2026-10-10.
- [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/description/) — Problem definition; examples 1 and 2; nonnegative-height constraints.
  - Claims: Unit-width bars [2,1,5,6,2,3] have maximum area 10.
  - Conventions: Nonnegative heights and unit-width bars. App additionally handles empty input as area 0, copies heights, and appends a zero sentinel.
  - Accessed: 2026-10-10.

## lesson:parentheses-matching

- [Runestone: Balanced symbols](https://runestone.academy/ns/books/published/pythonds3/BasicDS/BalancedSymbolsAGeneralCase.html) — 3.8 mixed bracket types and matching-stack algorithm.
  - Claims: A closer must match the most recent unresolved opener.
  - Conventions: Match three bracket types by LIFO order. App valid-input domain contains only the six bracket characters; empty input is valid.
  - Accessed: 2026-10-10.
- [Cornell CS2110: Stacks and queues](https://courses.cis.cornell.edu/courses/cs2110/2026fa/lectures/lec15/) — LinkedStack; exercises 15.6, 15.7, 15.10; deque interface.
  - Claims: Mixed bracket types must be properly nested.
  - Conventions: Source Java LinkedStack removes at the head. App Python nodes retain next links; removing a singly tail still requires finding its predecessor.
  - Accessed: 2026-10-10.

## lesson:expression-evaluation

- [Runestone: Postfix expressions](https://runestone.academy/ns/books/published/pythonds3/BasicDS/InfixPrefixandPostfixExpressions.html) — 3.9.2 shunting yard; 3.9.3 operand order and valid-expression precondition.
  - Claims: Postfix evaluation pops right operand before left and assumes a valid expression.
  - Conventions: Source postfix example uses division with /; app requires exact integer truncation toward zero and valid nonempty RPN with no zero divisor. Pop right operand before left.
  - Accessed: 2026-10-10.
- [Python 3.14: Built-in types](https://docs.python.org/3.14/builtins/stdtypes.html) — Identity, equality, numeric types; floor division and float conversion.
  - Claims: Integers have arbitrary precision; float conversion can round; // floors.
  - Conventions: Python 3.14 has arbitrary-size integers and floor division. The RPN contract truncates toward zero via integer absolute-value quotient and sign, avoiding float conversion.
  - Accessed: 2026-10-10.

## lesson:bfs-queues

- [Runestone: Breadth-first search](https://runestone.academy/ns/books/published/pythonds3/Graphs/ImplementingBreadthFirstSearch.html) — 7.9 discovery marking; FIFO exploration; Figures 3–6.
  - Claims: FIFO explores distance layers and marks before enqueue.
  - Conventions: Source discovery colors correspond to app seen marking before enqueue. App graph is a directed adjacency dictionary; all neighbor and start labels must be keys.
  - Accessed: 2026-10-10.
- [Python 3.14: deque](https://docs.python.org/3.14/library/collections.html#collections.deque) — deque operations, bounded deques, empty pops, rotation.
  - Claims: deque append/popleft give queue end operations.
  - Conventions: Use the Python 3.14 deque API; end operations are constant-time, bounded append evicts from the opposite end, and full bounded insert raises IndexError.
  - Accessed: 2026-10-10.

## lesson:min-max-tracking

- [Minimum stack and queue](https://cp-algorithms.com/data_structures/stack_queue_modification.html) — Stack modification; queue methods 1–3; fixed-length subarray minimum.
  - Claims: Per-level minima restore history; a two-min-stack queue gives amortized updates.
  - Conventions: Source minimum structures transfer once between two FIFO stacks; reverse comparisons for app maximum variants. Monotonic deque expires by window index.
  - Accessed: 2026-10-10.
- [Cornell CS2110: Stacks and queues](https://courses.cis.cornell.edu/courses/cs2110/2026fa/lectures/lec15/) — LinkedStack; exercises 15.6, 15.7, 15.10; deque interface.
  - Claims: Max-stack exercise carries prefix maxima.
  - Conventions: Source maximum-stack exercise mirrors app prefix-minimum tracking by reversing the comparison; values remain associated with their stack depth.
  - Accessed: 2026-10-10.
- [CPython 3.14.2 list source](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c) — list_resize; append and pop implementations.
  - Claims: Python list resizing qualifies update costs.
  - Conventions: Version-pinned CPython 3.14.2 source. Resizing qualifies the app list-end update costs as amortized; one resizing update can be linear.
  - Accessed: 2026-10-10.

## lesson:min-max-heaps

- [Python 3.14: heapq](https://docs.python.org/3.14/library/heapq.html) — Heap invariant; max-heap APIs; merge; nlargest; priority queue notes; other applications.
  - Claims: Native max APIs exist in 3.14; heapify is linear; tied tuple payloads need a tiebreaker.
  - Conventions: Use Python 3.14.2 zero-based heapq lists. Unqualified functions are min-oriented; native *_max APIs exist. Median examples deliberately use portable negation.
  - Accessed: 2026-10-10.
- [Open Data Structures: BinaryHeap](https://opendatastructures.org/ods-python/10_1_BinaryHeap_Implicit_Bi.html) — 10.1 indexing; add/remove; resizing amortization; Figures 10.1–10.3.
  - Claims: Zero-based children; logarithmic sift height; resizing amortizes.
  - Conventions: Both source and app use zero-based array indices, children 2i+1 and 2i+2, and parent (i-1)//2 for i>0. Resizing is accounted for amortized.
  - Accessed: 2026-10-10.
- [VisuAlgo: Binary heap](https://visualgo.net/en/heap) — Complete tree, insertion, extraction, and build visualization.
  - Claims: Complete-tree layout and sift operations; adapt visual indexing to zero.
  - Conventions: Source text discusses a default max-heap and tree/array views. App heapq uses zero-based indices; actual indexing diagram inspected in ODS Figure 10.1.
  - Accessed: 2026-10-10.

## lesson:heap-sift

- [Open Data Structures: BinaryHeap](https://opendatastructures.org/ods-python/10_1_BinaryHeap_Implicit_Bi.html) — 10.1 indexing; add/remove; resizing amortization; Figures 10.1–10.3.
  - Claims: Sift up compares the parent; sift down selects the smaller child.
  - Conventions: Both source and app use zero-based array indices, children 2i+1 and 2i+2, and parent (i-1)//2 for i>0. Resizing is accounted for amortized.
  - Accessed: 2026-10-10.
- [Runestone: Binary heap implementation](https://runestone.academy/ns/books/published/pythonds3/Trees/BinaryHeapImplementation.html) — 7.10.3 sift up/down and bottom-up heap construction.
  - Claims: Bottom-up construction differs from repeated insertion.
  - Conventions: Use the source zero-based heap code and bottom-up build argument. Its sorted-list insertion discussion is not a heap insertion cost claim.
  - Accessed: 2026-10-10.
- [VisuAlgo: Binary heap](https://visualgo.net/en/heap) — Complete tree, insertion, extraction, and build visualization.
  - Claims: Show the changing array and tree together.
  - Conventions: Source text discusses a default max-heap and tree/array views. App heapq uses zero-based indices; actual indexing diagram inspected in ODS Figure 10.1.
  - Accessed: 2026-10-10.

## lesson:top-k

- [Python 3.14: heapq](https://docs.python.org/3.14/library/heapq.html) — Heap invariant; max-heap APIs; merge; nlargest; priority queue notes; other applications.
  - Claims: nlargest returns ordered results and suggests max for k=1.
  - Conventions: Use Python 3.14.2 zero-based heapq lists. Unqualified functions are min-oriented; native *_max APIs exist. Median examples deliberately use portable negation.
  - Accessed: 2026-10-10.
- [CPython 3.14.2 heapq source](https://raw.githubusercontent.com/python/cpython/v3.14.2/Lib/heapq.py) — nlargest / nsmallest shortcuts; merge frontier; siftdown and siftup.
  - Claims: nlargest has k=1 and known-length sorting shortcuts.
  - Conventions: Use Python 3.14.2 zero-based heapq lists. Unqualified functions are min-oriented; native *_max APIs exist. Median examples deliberately use portable negation.
  - Accessed: 2026-10-10.
- [Open Data Structures: BinaryHeap](https://opendatastructures.org/ods-python/10_1_BinaryHeap_Implicit_Bi.html) — 10.1 indexing; add/remove; resizing amortization; Figures 10.1–10.3.
  - Claims: Heap updates sift along logarithmic-height paths.
  - Conventions: Both source and app use zero-based array indices, children 2i+1 and 2i+2, and parent (i-1)//2 for i>0. Resizing is accounted for amortized.
  - Accessed: 2026-10-10.

## lesson:kth-largest

- [Python 3.14: heapq](https://docs.python.org/3.14/library/heapq.html) — Heap invariant; max-heap APIs; merge; nlargest; priority queue notes; other applications.
  - Claims: A retained min-heap exposes its smallest boundary at index zero.
  - Conventions: Use Python 3.14.2 zero-based heapq lists. Unqualified functions are min-oriented; native *_max APIs exist. Median examples deliberately use portable negation.
  - Accessed: 2026-10-10.
- [Bowdoin: Linear-time selection](https://tildesites.bowdoin.edu/~ltoma/teaching/cs231/2017spring/Lectures/selection.pdf) — Randomized select; expected linear time; deterministic median of medians.
  - Claims: Randomized selection is expected linear; deterministic median-of-medians supplies a different worst-case guarantee.
  - Conventions: Source uses one-based rank and assumes distinct keys. App allows duplicates as separate ranked positions; zero-based arrays, one-based k. Iterative quickselect avoids recursive stack space.
  - Accessed: 2026-10-10.

## lesson:running-median

- [Python 3.14: heapq](https://docs.python.org/3.14/library/heapq.html) — Heap invariant; max-heap APIs; merge; nlargest; priority queue notes; other applications.
  - Claims: Two heaps expose the median roots and can use native max functions.
  - Conventions: Use Python 3.14.2 zero-based heapq lists. Unqualified functions are min-oriented; native *_max APIs exist. Median examples deliberately use portable negation.
  - Accessed: 2026-10-10.
- [Open Data Structures: BinaryHeap](https://opendatastructures.org/ods-python/10_1_BinaryHeap_Implicit_Bi.html) — 10.1 indexing; add/remove; resizing amortization; Figures 10.1–10.3.
  - Claims: Heap storage resizing amortizes across additions.
  - Conventions: Both source and app use zero-based array indices, children 2i+1 and 2i+2, and parent (i-1)//2 for i>0. Resizing is accounted for amortized.
  - Accessed: 2026-10-10.
- [Python 3.14 numeric types](https://docs.python.org/3.14/builtins/stdtypes.html) — Numeric types: arbitrary-size integers and finite-precision floating-point numbers.
  - Claims: Floating-point results have limited range/precision; the app average precondition must also cover the intermediate sum.
  - Conventions: This median example assumes its root sum and float conversion do not overflow. Two finite 1e308 floats produce an infinite sum, so a representable mathematical average alone is insufficient.
  - Accessed: 2026-10-10.

## lesson:merge-sorted-data

- [Python 3.14: heapq](https://docs.python.org/3.14/library/heapq.html) — Heap invariant; max-heap APIs; merge; nlargest; priority queue notes; other applications.
  - Claims: heapq.merge expects sorted inputs and is lazy.
  - Conventions: Use Python 3.14.2 zero-based heapq lists. Unqualified functions are min-oriented; native *_max APIs exist. Median examples deliberately use portable negation.
  - Accessed: 2026-10-10.
- [CPython 3.14.2 heapq source](https://raw.githubusercontent.com/python/cpython/v3.14.2/Lib/heapq.py) — nlargest / nsmallest shortcuts; merge frontier; siftdown and siftup.
  - Claims: Frontier entries retain source progress and compare ordered keys.
  - Conventions: Use Python 3.14.2 zero-based heapq lists. Unqualified functions are min-oriented; native *_max APIs exist. Median examples deliberately use portable negation.
  - Accessed: 2026-10-10.
- [Open Data Structures: BinaryHeap](https://opendatastructures.org/ods-python/10_1_BinaryHeap_Implicit_Bi.html) — 10.1 indexing; add/remove; resizing amortization; Figures 10.1–10.3.
  - Claims: A heap selects the smallest available frontier by its root.
  - Conventions: Both source and app use zero-based array indices, children 2i+1 and 2i+2, and parent (i-1)//2 for i>0. Resizing is accounted for amortized.
  - Accessed: 2026-10-10.

## lesson:two-heap-pattern

- [Python 3.14: heapq](https://docs.python.org/3.14/library/heapq.html) — Heap invariant; max-heap APIs; merge; nlargest; priority queue notes; other applications.
  - Claims: Median partition roots use a max lower half and min upper half.
  - Conventions: Use Python 3.14.2 zero-based heapq lists. Unqualified functions are min-oriented; native *_max APIs exist. Median examples deliberately use portable negation.
  - Accessed: 2026-10-10.
- [LeetCode: IPO problem](https://leetcode.com/problems/ipo/description/) — Project eligibility, nonnegative pure profits, at most k projects.
  - Claims: IPO adds nonnegative pure profits and permits at most k distinct affordable projects.
  - Conventions: Nonnegative pure profits, nonnegative capital thresholds, distinct projects selected once, at most k choices. Required capital gates eligibility and is not deducted.
  - Accessed: 2026-10-10.
- [Open Data Structures: BinaryHeap](https://opendatastructures.org/ods-python/10_1_BinaryHeap_Implicit_Bi.html) — 10.1 indexing; add/remove; resizing amortization; Figures 10.1–10.3.
  - Claims: Heap sifting and resizing qualify update costs.
  - Conventions: Both source and app use zero-based array indices, children 2i+1 and 2i+2, and parent (i-1)//2 for i>0. Resizing is accounted for amortized.
  - Accessed: 2026-10-10.

## lesson:linked-list-traversal

- [Open Data Structures: SLList](https://opendatastructures.org/ods-python/3_1_SLList_Singly_Linked_Li.html) — 3.1 stack and queue operations; Figure 3.1.
  - Claims: Head operations use next links; tail deletion needs its predecessor.
  - Conventions: Source and app use next links and optional head/tail references. Access by index requires traversal; constant-time deletion needs the predecessor.
  - Accessed: 2026-10-10.
- [Cornell CS2110: Stacks and queues](https://courses.cis.cornell.edu/courses/cs2110/2026fa/lectures/lec15/) — LinkedStack; exercises 15.6, 15.7, 15.10; deque interface.
  - Claims: LinkedStack uses the head for constant-time push/pop.
  - Conventions: Source Java LinkedStack removes at the head. App Python nodes retain next links; removing a singly tail still requires finding its predecessor.
  - Accessed: 2026-10-10.
- [VisuAlgo: Linked lists](https://visualgo.net/en/list) — Linked chain, stack, queue, doubly list and deque visualization modes.
  - Claims: Show references and the current cursor separately.
  - Conventions: Textual mode labels were consulted. Actual changing-link diagram cross-check used Stanford images; no claim of running VisuAlgo animations.
  - Accessed: 2026-10-10.

## lesson:linked-list-slow-fast

- [Floyd cycle finding](https://cp-algorithms.com/others/tortoise_and_hare.html) — Steps 1 and 2; proof of cycle-entry recovery.
  - Claims: Guard both fast and fast.next before two-link movement.
  - Conventions: Source pseudocode uses C++ pointer equality. App Python compares node identity with is; slow moves one link, fast two, then resets one pointer for entry recovery.
  - Accessed: 2026-10-10.
- [Open Data Structures: SLList](https://opendatastructures.org/ods-python/3_1_SLList_Singly_Linked_Li.html) — 3.1 stack and queue operations; Figure 3.1.
  - Claims: A next reference is retained, unlike a consumable iterator.
  - Conventions: Source and app use next links and optional head/tail references. Access by index requires traversal; constant-time deletion needs the predecessor.
  - Accessed: 2026-10-10.

## lesson:linked-list-cycle-detection

- [Floyd cycle finding](https://cp-algorithms.com/others/tortoise_and_hare.html) — Steps 1 and 2; proof of cycle-entry recovery.
  - Claims: Collision detects a cycle; resetting one pointer recovers its entry.
  - Conventions: Source pseudocode uses C++ pointer equality. App Python compares node identity with is; slow moves one link, fast two, then resets one pointer for entry recovery.
  - Accessed: 2026-10-10.
- [Python 3.14: Built-in types](https://docs.python.org/3.14/builtins/stdtypes.html) — Identity, equality, numeric types; floor division and float conversion.
  - Claims: Identity is distinct from customizable equality.
  - Conventions: Python object identity is compared with is. Equality can be customized by __eq__, so equal node values do not imply identical nodes. Relinking retains each node and its associated value.
  - Accessed: 2026-10-10.
- [VisuAlgo: Linked lists](https://visualgo.net/en/list) — Linked chain, stack, queue, doubly list and deque visualization modes.
  - Claims: A cycle edge points to an existing node, not a copied value.
  - Conventions: Textual mode labels were consulted. Actual changing-link diagram cross-check used Stanford images; no claim of running VisuAlgo animations.
  - Accessed: 2026-10-10.

## lesson:linked-list-reversal

- [Open Data Structures: SLList](https://opendatastructures.org/ods-python/3_1_SLList_Singly_Linked_Li.html) — 3.1 stack and queue operations; Figure 3.1.
  - Claims: Nodes are linked through retained next references.
  - Conventions: Source and app use next links and optional head/tail references. Access by index requires traversal; constant-time deletion needs the predecessor.
  - Accessed: 2026-10-10.
- [Stanford CS106B: Linked lists](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1252/lectures/21-lists2/slides) — Slides 4–9: retained node references; head/tail updates; save successor before mutation; doubly linked nodes.
  - Claims: Save the remaining suffix before changing a link.
  - Conventions: Source is C++ with address labels and nullptr. App uses Python object identities, None, next and prev; it does not perform C++ delete.
  - Accessed: 2026-10-10.
- [VisuAlgo: Linked lists](https://visualgo.net/en/list) — Linked chain, stack, queue, doubly list and deque visualization modes.
  - Claims: Show the reversed prefix and remaining suffix as separate roots.
  - Conventions: Textual mode labels were consulted. Actual changing-link diagram cross-check used Stanford images; no claim of running VisuAlgo animations.
  - Accessed: 2026-10-10.

## lesson:linked-list-middle

- [Floyd cycle finding](https://cp-algorithms.com/others/tortoise_and_hare.html) — Steps 1 and 2; proof of cycle-entry recovery.
  - Claims: Two-link movement must check the intermediate next reference.
  - Conventions: Source pseudocode uses C++ pointer equality. App Python compares node identity with is; slow moves one link, fast two, then resets one pointer for entry recovery.
  - Accessed: 2026-10-10.
- [Open Data Structures: SLList](https://opendatastructures.org/ods-python/3_1_SLList_Singly_Linked_Li.html) — 3.1 stack and queue operations; Figure 3.1.
  - Claims: Linked nodes support retained references and sequential access.
  - Conventions: Source and app use next links and optional head/tail references. Access by index requires traversal; constant-time deletion needs the predecessor.
  - Accessed: 2026-10-10.

## lesson:linked-list-dummy-nodes

- [Open Data Structures: DLList](https://opendatastructures.org/ods-python/3_2_DLList_Doubly_Linked_Li.html) — 3.2 dummy sentinel; insertion and removal.
  - Claims: A sentinel unifies updates at boundaries.
  - Conventions: Source uses a circular doubly linked dummy sentinel. The app also shows null-terminated doubly lists and a circular singly list; these are different representations.
  - Accessed: 2026-10-10.
- [Open Data Structures: SLList](https://opendatastructures.org/ods-python/3_1_SLList_Singly_Linked_Li.html) — 3.1 stack and queue operations; Figure 3.1.
  - Claims: Head deletion changes the entry reference.
  - Conventions: Source and app use next links and optional head/tail references. Access by index requires traversal; constant-time deletion needs the predecessor.
  - Accessed: 2026-10-10.

## lesson:linked-list-merging

- [Open Data Structures: SLList](https://opendatastructures.org/ods-python/3_1_SLList_Singly_Linked_Li.html) — 3.1 stack and queue operations; Figure 3.1.
  - Claims: Relinking changes references rather than copying values.
  - Conventions: Source and app use next links and optional head/tail references. Access by index requires traversal; constant-time deletion needs the predecessor.
  - Accessed: 2026-10-10.
- [Stanford CS106B: More on Linked Lists](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1252/lectures/21-lists2/slides) — Slides 4–9: retained node references; head/tail updates; save successor before mutation; doubly linked nodes.
  - Claims: Preserve access to remaining chains when rewiring.
  - Conventions: Source is C++ with address labels and nullptr. App uses Python object identities, None, next and prev; it does not perform C++ delete.
  - Accessed: 2026-10-10.
- [VisuAlgo: Linked lists](https://visualgo.net/en/list) — Linked chain, stack, queue, doubly list and deque visualization modes.
  - Claims: Show output prefix and both remaining input roots.
  - Conventions: Textual mode labels were consulted. Actual changing-link diagram cross-check used Stanford images; no claim of running VisuAlgo animations.
  - Accessed: 2026-10-10.

## lesson:linked-list-pointer-manipulation

- [Stanford CS106B: More on Linked Lists](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1252/lectures/21-lists2/slides) — Slides 4–9: retained node references; head/tail updates; save successor before mutation; doubly linked nodes.
  - Claims: Saved node references allow safe link rewiring.
  - Conventions: Source is C++ with address labels and nullptr. App uses Python object identities, None, next and prev; it does not perform C++ delete.
  - Accessed: 2026-10-10.
- [Python 3.14: Built-in types](https://docs.python.org/3.14/builtins/stdtypes.html) — Identity, equality, numeric types; floor division and float conversion.
  - Claims: Changing a node value does not change object identity.
  - Conventions: Python object identity is compared with is. Equality can be customized by __eq__, so equal node values do not imply identical nodes. Relinking retains each node and its associated value.
  - Accessed: 2026-10-10.
- [VisuAlgo: Linked lists](https://visualgo.net/en/list) — Linked chain, stack, queue, doubly list and deque visualization modes.
  - Claims: During rewiring, locals can retain temporarily detached chains.
  - Conventions: Textual mode labels were consulted. Actual changing-link diagram cross-check used Stanford images; no claim of running VisuAlgo animations.
  - Accessed: 2026-10-10.

## lesson:linked-list-variants

- [Open Data Structures: SLList](https://opendatastructures.org/ods-python/3_1_SLList_Singly_Linked_Li.html) — 3.1 stack and queue operations; Figure 3.1.
  - Claims: Singly linked tail deletion requires predecessor search.
  - Conventions: Source and app use next links and optional head/tail references. Access by index requires traversal; constant-time deletion needs the predecessor.
  - Accessed: 2026-10-10.
- [Open Data Structures: DLList](https://opendatastructures.org/ods-python/3_2_DLList_Doubly_Linked_Li.html) — 3.2 dummy sentinel; insertion and removal.
  - Claims: Doubly linked nodes have prev/next; circular dummy structures need bounded traversal.
  - Conventions: Source uses a circular doubly linked dummy sentinel. The app also shows null-terminated doubly lists and a circular singly list; these are different representations.
  - Accessed: 2026-10-10.
- [VisuAlgo: Linked lists](https://visualgo.net/en/list) — Linked chain, stack, queue, doubly list and deque visualization modes.
  - Claims: Render both directions and repeated-node cycle edges.
  - Conventions: Textual mode labels were consulted. Actual changing-link diagram cross-check used Stanford images; no claim of running VisuAlgo animations.
  - Accessed: 2026-10-10.

## lesson:linked-list-deques

- [Python 3.14: deque](https://docs.python.org/3.14/library/collections.html#collections.deque) — deque operations, bounded deques, empty pops, rotation.
  - Claims: End operations, empty errors, bounded append eviction and insert behavior.
  - Conventions: Use the Python 3.14 deque API; end operations are constant-time, bounded append evicts from the opposite end, and full bounded insert raises IndexError.
  - Accessed: 2026-10-10.
- [Cornell CS2110: Stacks and queues](https://courses.cis.cornell.edu/courses/cs2110/2026fa/lectures/lec15/) — LinkedStack; exercises 15.6, 15.7, 15.10; deque interface.
  - Claims: Deque supports insertion and removal at both ends.
  - Conventions: Source Java deque interface describes operations at both ends; the app uses Python 3.14 collections.deque semantics.
  - Accessed: 2026-10-10.

## pattern:fast-slow-pointers

- [Floyd cycle finding](https://cp-algorithms.com/others/tortoise_and_hare.html) — Steps 1 and 2; proof of cycle-entry recovery.
  - Claims: Floyd compares positions at different speeds and recovers the cycle entry.
  - Conventions: Source pseudocode uses C++ pointer equality. App Python compares node identity with is; slow moves one link, fast two, then resets one pointer for entry recovery.
  - Accessed: 2026-10-10.
- [Open Data Structures: SLList](https://opendatastructures.org/ods-python/3_1_SLList_Singly_Linked_Li.html) — 3.1 stack and queue operations; Figure 3.1.
  - Claims: Retained node references permit independent traversals.
  - Conventions: Source and app use next links and optional head/tail references. Access by index requires traversal; constant-time deletion needs the predecessor.
  - Accessed: 2026-10-10.
- [Python 3.14: Built-in types](https://docs.python.org/3.14/builtins/stdtypes.html) — Identity, equality, numeric types; floor division and float conversion.
  - Claims: Linked-node identity is not value equality.
  - Conventions: Python object identity is compared with is. Equality can be customized by __eq__, so equal node values do not imply identical nodes. Relinking retains each node and its associated value.
  - Accessed: 2026-10-10.

## pattern:top-k-heap

- [Python 3.14: heapq](https://docs.python.org/3.14/library/heapq.html) — Heap invariant; max-heap APIs; merge; nlargest; priority queue notes; other applications.
  - Claims: Sorted helper output; comparable tuple keys and counter tiebreakers.
  - Conventions: Use Python 3.14.2 zero-based heapq lists. Unqualified functions are min-oriented; native *_max APIs exist. Median examples deliberately use portable negation.
  - Accessed: 2026-10-10.
- [CPython 3.14.2 heapq source](https://raw.githubusercontent.com/python/cpython/v3.14.2/Lib/heapq.py) — nlargest / nsmallest shortcuts; merge frontier; siftdown and siftup.
  - Claims: Helper shortcuts do not always run the manual bounded-heap loop.
  - Conventions: Use Python 3.14.2 zero-based heapq lists. Unqualified functions are min-oriented; native *_max APIs exist. Median examples deliberately use portable negation.
  - Accessed: 2026-10-10.
- [Bowdoin: Linear-time selection](https://tildesites.bowdoin.edu/~ltoma/teaching/cs231/2017spring/Lectures/selection.pdf) — Randomized select; expected linear time; deterministic median of medians.
  - Claims: Selection expected bounds need randomization and in-place storage qualifications.
  - Conventions: Source uses one-based rank and assumes distinct keys. App allows duplicates as separate ranked positions; zero-based arrays, one-based k. Iterative quickselect avoids recursive stack space.
  - Accessed: 2026-10-10.

## pattern:two-heaps

- [Python 3.14: heapq](https://docs.python.org/3.14/library/heapq.html) — Heap invariant; max-heap APIs; merge; nlargest; priority queue notes; other applications.
  - Claims: Median partition uses opposite heap orientations; native max APIs exist.
  - Conventions: Use Python 3.14.2 zero-based heapq lists. Unqualified functions are min-oriented; native *_max APIs exist. Median examples deliberately use portable negation.
  - Accessed: 2026-10-10.
- [Open Data Structures: BinaryHeap](https://opendatastructures.org/ods-python/10_1_BinaryHeap_Implicit_Bi.html) — 10.1 indexing; add/remove; resizing amortization; Figures 10.1–10.3.
  - Claims: Constant-count heap updates have logarithmic amortized cost.
  - Conventions: Both source and app use zero-based array indices, children 2i+1 and 2i+2, and parent (i-1)//2 for i>0. Resizing is accounted for amortized.
  - Accessed: 2026-10-10.
- [LeetCode: IPO problem](https://leetcode.com/problems/ipo/description/) — Project eligibility, nonnegative pure profits, at most k projects.
  - Claims: IPO is an eligibility/profit application, not a balanced partition.
  - Conventions: Nonnegative pure profits, nonnegative capital thresholds, distinct projects selected once, at most k choices. Required capital gates eligibility and is not deducted.
  - Accessed: 2026-10-10.
- [Python 3.14 numeric types](https://docs.python.org/3.14/builtins/stdtypes.html) — Numeric types: arbitrary-size integers and finite-precision floating-point numbers.
  - Claims: Floating-point results have limited range/precision; the app average precondition must also cover the intermediate sum.
  - Conventions: This median example assumes its root sum and float conversion do not overflow. Two finite 1e308 floats produce an infinite sum, so a representable mathematical average alone is insufficient.
  - Accessed: 2026-10-10.

## pattern:k-way-merge

- [Python 3.14: heapq](https://docs.python.org/3.14/library/heapq.html) — Heap invariant; max-heap APIs; merge; nlargest; priority queue notes; other applications.
  - Claims: Sorted-input merge is lazy; one front per source suffices.
  - Conventions: Use Python 3.14.2 zero-based heapq lists. Unqualified functions are min-oriented; native *_max APIs exist. Median examples deliberately use portable negation.
  - Accessed: 2026-10-10.
- [CPython 3.14.2 heapq source](https://raw.githubusercontent.com/python/cpython/v3.14.2/Lib/heapq.py) — nlargest / nsmallest shortcuts; merge frontier; siftdown and siftup.
  - Claims: Frontier metadata tracks each iterator and handles equal values.
  - Conventions: Use Python 3.14.2 zero-based heapq lists. Unqualified functions are min-oriented; native *_max APIs exist. Median examples deliberately use portable negation.
  - Accessed: 2026-10-10.
- [Open Data Structures: BinaryHeap](https://opendatastructures.org/ods-python/10_1_BinaryHeap_Implicit_Bi.html) — 10.1 indexing; add/remove; resizing amortization; Figures 10.1–10.3.
  - Claims: Heap root exposes the next smallest candidate.
  - Conventions: Both source and app use zero-based array indices, children 2i+1 and 2i+2, and parent (i-1)//2 for i>0. Resizing is accounted for amortized.
  - Accessed: 2026-10-10.

## pattern:monotonic-stack

- [Cornell CS2110: Stacks and queues](https://courses.cis.cornell.edu/courses/cs2110/2026fa/lectures/lec15/) — LinkedStack; exercises 15.6, 15.7, 15.10; deque interface.
  - Claims: Next-greater monotonic stack keeps candidates ordered.
  - Conventions: Source next-greater exercise scans right to left and omits the final output slot. App scans left to right, returns n slots, and uses -1 for no strict greater successor.
  - Accessed: 2026-10-10.
- [Minimum stack and queue](https://cp-algorithms.com/data_structures/stack_queue_modification.html) — Stack modification; queue methods 1–3; fixed-length subarray minimum.
  - Claims: Sliding-window extrema need front expiry as well as back domination removal.
  - Conventions: Source minimum structures transfer once between two FIFO stacks; reverse comparisons for app maximum variants. Monotonic deque expires by window index.
  - Accessed: 2026-10-10.

## pattern:in-place-linkedlist-reversal

- [Stanford CS106B: More on Linked Lists](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1252/lectures/21-lists2/slides) — Slides 4–9: retained node references; head/tail updates; save successor before mutation; doubly linked nodes.
  - Claims: Saving suffix references supports in-place link changes.
  - Conventions: Source is C++ with address labels and nullptr. App uses Python object identities, None, next and prev; it does not perform C++ delete.
  - Accessed: 2026-10-10.
- [Open Data Structures: DLList](https://opendatastructures.org/ods-python/3_2_DLList_Doubly_Linked_Li.html) — 3.2 dummy sentinel; insertion and removal.
  - Claims: A dummy makes front-boundary updates uniform.
  - Conventions: Source uses a circular doubly linked dummy sentinel. The app also shows null-terminated doubly lists and a circular singly list; these are different representations.
  - Accessed: 2026-10-10.
- [Python 3.14: Built-in types](https://docs.python.org/3.14/builtins/stdtypes.html) — Identity, equality, numeric types; floor division and float conversion.
  - Claims: Node-value association differs from object identity.
  - Conventions: Python object identity is compared with is. Equality can be customized by __eq__, so equal node values do not imply identical nodes. Relinking retains each node and its associated value.
  - Accessed: 2026-10-10.



# Codex B5 reference reconciliation — 2026-10-10

## lesson:tree-dfs

- [Runestone: tree traversals](https://runestone.academy/ns/books/published/pythonds3/Trees/TreeTraversals.html) — 6.8: preorder, inorder, postorder; recursive code listings; accessed 2026-10-10.
  - Checked: Traversal visit order.; None is the recursion base case.
  - Conventions: App-specific conventions stated in the lesson.

- [Open Data Structures: binary trees](https://opendatastructures.org/ods-python/6_Binary_Trees.html) — Chapter 6 definitions and Figures 6.1–6.2; accessed 2026-10-10.
  - Checked: Unique parents in a rooted tree.; Depth and height count edges.
  - Conventions: This app states when its height function counts nodes instead.

## lesson:tree-bfs

- [Open Data Structures: graph traversal](https://opendatastructures.org/ods-python/12_3_Graph_Traversal.html) — 12.3.1 BFS; 12.3.2 DFS; Figures 12.4–12.5; accessed 2026-10-10.
  - Checked: BFS discovers reachable vertices in distance order.; DFS records visited vertices before recursion.
  - Conventions: App-specific conventions stated in the lesson.

- [MIT 6.006 Lecture 9: BFS](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/196a95604877d326c6586e60477b59d4_MIT6_006S20_lec9.pdf) — Pages 1–4: representations, shortest paths, BFS; accessed 2026-10-10.
  - Checked: Undirected adjacency stores both directions.; A path length counts edges.
  - Conventions: App may use -1 for unreachable distances instead of infinity.

## lesson:tree-traversals

- [Runestone: tree traversals](https://runestone.academy/ns/books/published/pythonds3/Trees/TreeTraversals.html) — 6.8: preorder, inorder, postorder; recursive code listings; accessed 2026-10-10.
  - Checked: Traversal visit order.; None is the recursion base case.
  - Conventions: App-specific conventions stated in the lesson.

- [Open Data Structures: binary trees](https://opendatastructures.org/ods-python/6_Binary_Trees.html) — Chapter 6 definitions and Figures 6.1–6.2; accessed 2026-10-10.
  - Checked: Unique parents in a rooted tree.; Depth and height count edges.
  - Conventions: This app states when its height function counts nodes instead.

## lesson:bst-operations

- [Open Data Structures: unbalanced BST](https://opendatastructures.org/ods-python/6_2_BinarySearchTree_Unbala.html) — 6.2.1 searching; 6.2.2 addition; 6.2.4 summary; Figures 6.5–6.7; accessed 2026-10-10.
  - Checked: A search follows one root-to-leaf path.; Unbalanced height can be linear.
  - Conventions: Source rejects duplicate keys; this insertion example sends equal keys right.

- [Python 3.14: dictionary operations](https://docs.python.org/3.14/library/stdtypes.html#dict.setdefault) — dict.setdefault and insertion-order guarantee; accessed 2026-10-10.
  - Checked: setdefault returns an existing value or inserts its default.; Dictionaries preserve insertion order, not sorted-key order.
  - Conventions: Online manual currently displays 3.14.8; executable behavior was probed on bundled 3.14.2.

## lesson:tree-height-depth

- [Open Data Structures: binary trees](https://opendatastructures.org/ods-python/6_Binary_Trees.html) — Chapter 6 definitions and Figures 6.1–6.2; accessed 2026-10-10.
  - Checked: Unique parents in a rooted tree.; Depth and height count edges.
  - Conventions: This app states when its height function counts nodes instead.

- [Runestone: tree traversals](https://runestone.academy/ns/books/published/pythonds3/Trees/TreeTraversals.html) — 6.8: preorder, inorder, postorder; recursive code listings; accessed 2026-10-10.
  - Checked: Traversal visit order.; None is the recursion base case.
  - Conventions: App-specific conventions stated in the lesson.

## lesson:lowest-common-ancestor

- [LeetCode: BST lowest common ancestor](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/) — Definition, examples 1–2, constraints; accessed 2026-10-10.
  - Checked: A node is its own ancestor.; Targets exist and keys are unique.
  - Conventions: App additionally permits p == q.

- [Open Data Structures: unbalanced BST](https://opendatastructures.org/ods-python/6_2_BinarySearchTree_Unbala.html) — 6.2.1 searching; 6.2.2 addition; 6.2.4 summary; Figures 6.5–6.7; accessed 2026-10-10.
  - Checked: A search follows one root-to-leaf path.; Unbalanced height can be linear.
  - Conventions: Source rejects duplicate keys; this insertion example sends equal keys right.

## lesson:tree-construction

- [LeetCode: sorted array to BST](https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/) — Description, examples, constraints; accessed 2026-10-10.
  - Checked: Input keys are strictly increasing.; Output should be height balanced.
  - Conventions: App accepts an empty array and uses the upper middle on even lengths.

- [Open Data Structures: unbalanced BST](https://opendatastructures.org/ods-python/6_2_BinarySearchTree_Unbala.html) — 6.2.1 searching; 6.2.2 addition; 6.2.4 summary; Figures 6.5–6.7; accessed 2026-10-10.
  - Checked: A search follows one root-to-leaf path.; Unbalanced height can be linear.
  - Conventions: Source rejects duplicate keys; this insertion example sends equal keys right.

## lesson:trie-insertion

- [CP Algorithms: trie construction](https://cp-algorithms.com/string/aho_corasick.html) — Construction of the trie; accessed 2026-10-10.
  - Checked: Paths share prefixes.; Terminal flags distinguish complete words.
  - Conventions: App uses dictionaries for arbitrary characters rather than a fixed 26-child array.

- [USFCA: Trie Visualization](https://www.cs.usfca.edu/~galles/visualization/Trie.html) — Inserted APP and APPLE; inspected shared A-P-P path and terminal coloring.; accessed 2026-10-10.
  - Checked: Shared prefix nodes remain common.; APP stays terminal when APPLE is added.
  - Conventions: Reference uses uppercase; app accepts arbitrary characters.

- [Python 3.14: dictionary operations](https://docs.python.org/3.14/library/stdtypes.html#dict.setdefault) — dict.setdefault and insertion-order guarantee; accessed 2026-10-10.
  - Checked: setdefault returns an existing value or inserts its default.; Dictionaries preserve insertion order, not sorted-key order.
  - Conventions: Online manual currently displays 3.14.8; executable behavior was probed on bundled 3.14.2.

## lesson:prefix-search

- [CP Algorithms: trie construction](https://cp-algorithms.com/string/aho_corasick.html) — Construction of the trie; accessed 2026-10-10.
  - Checked: Paths share prefixes.; Terminal flags distinguish complete words.
  - Conventions: App uses dictionaries for arbitrary characters rather than a fixed 26-child array.

- [USFCA: Trie Visualization](https://www.cs.usfca.edu/~galles/visualization/Trie.html) — Inserted APP and APPLE; inspected shared A-P-P path and terminal coloring.; accessed 2026-10-10.
  - Checked: Shared prefix nodes remain common.; APP stays terminal when APPLE is added.
  - Conventions: Reference uses uppercase; app accepts arbitrary characters.

- [Python 3.14: dictionary operations](https://docs.python.org/3.14/library/stdtypes.html#dict.setdefault) — dict.setdefault and insertion-order guarantee; accessed 2026-10-10.
  - Checked: setdefault returns an existing value or inserts its default.; Dictionaries preserve insertion order, not sorted-key order.
  - Conventions: Online manual currently displays 3.14.8; executable behavior was probed on bundled 3.14.2.

## lesson:word-search

- [LeetCode: Word Search](https://leetcode.com/problems/word-search/) — Description, examples, constraints; accessed 2026-10-10.
  - Checked: Neighbors share a side.; One path cannot reuse a cell.
  - Conventions: App extends the source domain to empty inputs and arbitrary character values.

- [CP Algorithms: trie construction](https://cp-algorithms.com/string/aho_corasick.html) — Construction of the trie; accessed 2026-10-10.
  - Checked: Paths share prefixes.; Terminal flags distinguish complete words.
  - Conventions: App uses dictionaries for arbitrary characters rather than a fixed 26-child array.

## lesson:avl-rotations

- [MIT 6.006 Lecture 7: AVL](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/a2c80596cf4a2b5fbc854afdd2f23dcb_MIT6_006S20_lec7.pdf) — Pages 1–3: rotations, height balance, local rebalance; accessed 2026-10-10.
  - Checked: Rotations preserve inorder.; Balanced subtree heights differ by at most one.
  - Conventions: MIT height counts edges; app caches node-count heights.

- [Runestone: AVL implementation](https://runestone.academy/ns/books/published/pythonds3/Trees/AVLTreeImplementation.html) — Rotation pointers and double-rotation cases; accessed 2026-10-10.
  - Checked: Transfer the middle subtree during rotation.; Repair metadata after rewiring.
  - Conventions: App has no parent pointers and returns the new subtree root.

## lesson:graph-representations

- [Open Data Structures: adjacency lists](https://opendatastructures.org/ods-python/12_2_AdjacencyLists_Graph_a.html) — 12.2; Figure 12.3; Theorem 12.2; accessed 2026-10-10.
  - Checked: Adjacency storage is O(V+E).; Scanning one neighbor list costs its degree.
  - Conventions: App-specific conventions stated in the lesson.

- [MIT 6.006 Lecture 9: BFS](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/196a95604877d326c6586e60477b59d4_MIT6_006S20_lec9.pdf) — Pages 1–4: representations, shortest paths, BFS; accessed 2026-10-10.
  - Checked: Undirected adjacency stores both directions.; A path length counts edges.
  - Conventions: App may use -1 for unreachable distances instead of infinity.

## lesson:adjacency-lists

- [Open Data Structures: adjacency lists](https://opendatastructures.org/ods-python/12_2_AdjacencyLists_Graph_a.html) — 12.2; Figure 12.3; Theorem 12.2; accessed 2026-10-10.
  - Checked: Adjacency storage is O(V+E).; Scanning one neighbor list costs its degree.
  - Conventions: App-specific conventions stated in the lesson.

- [MIT 6.006 Lecture 9: BFS](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/196a95604877d326c6586e60477b59d4_MIT6_006S20_lec9.pdf) — Pages 1–4: representations, shortest paths, BFS; accessed 2026-10-10.
  - Checked: Undirected adjacency stores both directions.; A path length counts edges.
  - Conventions: App may use -1 for unreachable distances instead of infinity.

## lesson:graph-bfs

- [Open Data Structures: graph traversal](https://opendatastructures.org/ods-python/12_3_Graph_Traversal.html) — 12.3.1 BFS; 12.3.2 DFS; Figures 12.4–12.5; accessed 2026-10-10.
  - Checked: BFS discovers reachable vertices in distance order.; DFS records visited vertices before recursion.
  - Conventions: App-specific conventions stated in the lesson.

- [MIT 6.006 Lecture 9: BFS](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/196a95604877d326c6586e60477b59d4_MIT6_006S20_lec9.pdf) — Pages 1–4: representations, shortest paths, BFS; accessed 2026-10-10.
  - Checked: Undirected adjacency stores both directions.; A path length counts edges.
  - Conventions: App may use -1 for unreachable distances instead of infinity.

## lesson:graph-dfs

- [Open Data Structures: graph traversal](https://opendatastructures.org/ods-python/12_3_Graph_Traversal.html) — 12.3.1 BFS; 12.3.2 DFS; Figures 12.4–12.5; accessed 2026-10-10.
  - Checked: BFS discovers reachable vertices in distance order.; DFS records visited vertices before recursion.
  - Conventions: App-specific conventions stated in the lesson.

- [MIT 6.006 Lecture 9: BFS](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/196a95604877d326c6586e60477b59d4_MIT6_006S20_lec9.pdf) — Pages 1–4: representations, shortest paths, BFS; accessed 2026-10-10.
  - Checked: Undirected adjacency stores both directions.; A path length counts edges.
  - Conventions: App may use -1 for unreachable distances instead of infinity.

## lesson:connected-components

- [Open Data Structures: graph traversal](https://opendatastructures.org/ods-python/12_3_Graph_Traversal.html) — 12.3.1 BFS; 12.3.2 DFS; Figures 12.4–12.5; accessed 2026-10-10.
  - Checked: BFS discovers reachable vertices in distance order.; DFS records visited vertices before recursion.
  - Conventions: App-specific conventions stated in the lesson.

- [Open Data Structures: adjacency lists](https://opendatastructures.org/ods-python/12_2_AdjacencyLists_Graph_a.html) — 12.2; Figure 12.3; Theorem 12.2; accessed 2026-10-10.
  - Checked: Adjacency storage is O(V+E).; Scanning one neighbor list costs its degree.
  - Conventions: App-specific conventions stated in the lesson.

## lesson:graph-cycle-detection

- [Open Data Structures: graph traversal](https://opendatastructures.org/ods-python/12_3_Graph_Traversal.html) — 12.3.1 BFS; 12.3.2 DFS; Figures 12.4–12.5; accessed 2026-10-10.
  - Checked: BFS discovers reachable vertices in distance order.; DFS records visited vertices before recursion.
  - Conventions: App-specific conventions stated in the lesson.

- [VisuAlgo: graph traversal](https://visualgo.net/en/dfsbfs) — Directed graph settings; cycle states; 7-6 topological sorting (DFS and Kahn BFS); accessed 2026-10-10.
  - Checked: Topological order requires a DAG.; Kahn starts with zero in-degree.
  - Conventions: App-specific conventions stated in the lesson.

## lesson:topological-sort

- [VisuAlgo: graph traversal](https://visualgo.net/en/dfsbfs) — Directed graph settings; cycle states; 7-6 topological sorting (DFS and Kahn BFS); accessed 2026-10-10.
  - Checked: Topological order requires a DAG.; Kahn starts with zero in-degree.
  - Conventions: App-specific conventions stated in the lesson.

- [Open Data Structures: graph traversal](https://opendatastructures.org/ods-python/12_3_Graph_Traversal.html) — 12.3.1 BFS; 12.3.2 DFS; Figures 12.4–12.5; accessed 2026-10-10.
  - Checked: BFS discovers reachable vertices in distance order.; DFS records visited vertices before recursion.
  - Conventions: App-specific conventions stated in the lesson.

- [Princeton algs4: queue-based topological sorting](https://raw.githubusercontent.com/kevin-wayne/algs4/master/src/main/java/edu/princeton/cs/algs4/TopologicalX.java) — Class documentation lines 11–24; indegree queue and count check lines 46–75; accessed 2026-10-10.
  - Checked: A complete topological order exists exactly for directed acyclic graphs.; Vertices enter the queue when remaining indegree becomes zero.; A processed count below V rejects a complete order.
  - Conventions: Source consumes an existing graph; app builds adjacency internally and includes O(V+E) in auxiliary storage.; Main app examples raise on cycles; the lesson prefix-count exercise intentionally returns the processed prefix.

## lesson:multi-source-bfs

- [Open Data Structures: graph traversal](https://opendatastructures.org/ods-python/12_3_Graph_Traversal.html) — 12.3.1 BFS; 12.3.2 DFS; Figures 12.4–12.5; accessed 2026-10-10.
  - Checked: BFS discovers reachable vertices in distance order.; DFS records visited vertices before recursion.
  - Conventions: App-specific conventions stated in the lesson.

- [MIT 6.006 Lecture 9: BFS](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/196a95604877d326c6586e60477b59d4_MIT6_006S20_lec9.pdf) — Pages 1–4: representations, shortest paths, BFS; accessed 2026-10-10.
  - Checked: Undirected adjacency stores both directions.; A path length counts edges.
  - Conventions: App may use -1 for unreachable distances instead of infinity.

## lesson:shortest-paths-unweighted

- [Open Data Structures: graph traversal](https://opendatastructures.org/ods-python/12_3_Graph_Traversal.html) — 12.3.1 BFS; 12.3.2 DFS; Figures 12.4–12.5; accessed 2026-10-10.
  - Checked: BFS discovers reachable vertices in distance order.; DFS records visited vertices before recursion.
  - Conventions: App-specific conventions stated in the lesson.

- [MIT 6.006 Lecture 9: BFS](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/196a95604877d326c6586e60477b59d4_MIT6_006S20_lec9.pdf) — Pages 1–4: representations, shortest paths, BFS; accessed 2026-10-10.
  - Checked: Undirected adjacency stores both directions.; A path length counts edges.
  - Conventions: App may use -1 for unreachable distances instead of infinity.

## lesson:union-find

- [CP Algorithms: disjoint-set union](https://cp-algorithms.com/data_structures/disjoint_set_union.html) — Path compression; union by rank; time complexity; accessed 2026-10-10.
  - Checked: Rank plus compression gives amortized inverse-Ackermann cost.; Rank alone bounds an individual operation logarithmically.
  - Conventions: App uses iterative path halving, a compression variant.

- [Princeton algs4: rank and path-halving union-find](https://raw.githubusercontent.com/kevin-wayne/algs4/master/src/main/java/edu/princeton/cs/algs4/UF.java) — Class documentation lines 57–68; find lines 109–115; union lines 149–159; accessed 2026-10-10.
  - Checked: Rank plus path halving gives an inverse-Ackermann amortized operation bound.; Initialization is linear; an individual worst-case operation may be logarithmic.; Only equal-rank unions increase the surviving rank.
  - Conventions: Source Java implementation; app uses the same rank and halving strategy in Python.; App reports retained parent/rank arrays separately from constant working space per operation.

## lesson:dijkstra

- [CP Algorithms: sparse Dijkstra](https://cp-algorithms.com/graph/dijkstra_sparse.html) — priority_queue implementation and stale-entry discussion; accessed 2026-10-10.
  - Checked: Lazy heaps retain duplicate vertex entries.; Discard obsolete distances before scanning edges.
  - Conventions: App uses heapq rather than decrease-key.

- [MIT 6.006 Lecture 13: Dijkstra](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/d819e7f4568aced8d5b59e03db6c7b67_MIT6_006S20_lec13.pdf) — Pages 1–3: nonnegative weights, priority queue, correctness; accessed 2026-10-10.
  - Checked: Nonnegative edges support distance finalization.
  - Conventions: MIT uses decrease-key; app uses lazy duplicate entries and a stale guard.

## lesson:bellman-ford

- [CP Algorithms: Bellman–Ford](https://cp-algorithms.com/graph/bellman_ford.html) — Negative-cycle detection; accessed 2026-10-10.
  - Checked: An extra relaxation detects a source-reachable negative cycle.
  - Conventions: App-specific conventions stated in the lesson.

- [MIT 6.006 Lecture 12: Bellman–Ford](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/2430d7903a5529451d80c17f89a41fe8_MIT6_006S20_lec12.pdf) — Pages 1–3: simple shortest paths and negative-cycle witnesses; accessed 2026-10-10.
  - Checked: A finite optimum has a simple representative with at most V−1 edges.
  - Conventions: App-specific conventions stated in the lesson.

## lesson:floyd-warshall

- [CP Algorithms: Floyd–Warshall](https://cp-algorithms.com/graph/all-pair-shortest-path-floyd-warshall.html) — Phase invariant; implementation; negative cycles; accessed 2026-10-10.
  - Checked: k is the outer phase loop.; Negative cycles invalidate affected pairs.
  - Conventions: App numbers vertices from zero and uses Python infinity.

- [MIT 6.006 Lecture 12: Bellman–Ford](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/2430d7903a5529451d80c17f89a41fe8_MIT6_006S20_lec12.pdf) — Pages 1–3: simple shortest paths and negative-cycle witnesses; accessed 2026-10-10.
  - Checked: A finite optimum has a simple representative with at most V−1 edges.
  - Conventions: App-specific conventions stated in the lesson.

- [Princeton algs4: Floyd–Warshall](https://raw.githubusercontent.com/kevin-wayne/algs4/master/src/main/java/edu/princeton/cs/algs4/FloydWarshall.java) — Class documentation lines 18–38; initialization/phase/negative diagonal lines 57–95; accessed 2026-10-10.
  - Checked: Floyd–Warshall permits negative edges when shortest distances are well defined.; The outer loop controls allowed intermediate vertices.; A negative diagonal detects a negative cycle.; Distance matrix storage is quadratic.
  - Conventions: Source additionally stores a predecessor matrix and rejects negative-cycle distance queries.; App returns the distance matrix; its returned matrix is output storage, and affected pairs must not be interpreted as finite shortest distances.

## lesson:prim

- [CP Algorithms: Prim](https://cp-algorithms.com/graph/mst_prim.html) — Cut argument; dense and sparse implementations; no-MST check; accessed 2026-10-10.
  - Checked: An MST spans a connected undirected graph.; Dense matrix Prim costs O(V²).
  - Conventions: App uses a lazy edge heap, not the source ordered-set decrease-key version.

- [CP Algorithms: Kruskal with DSU](https://cp-algorithms.com/graph/mst_kruskal_with_dsu.html) — Rank-aware DSU implementation and sorted edge sweep; accessed 2026-10-10.
  - Checked: Process edges by increasing weight.; Use rank and compression for DSU.
  - Conventions: App-specific conventions stated in the lesson.

- [Princeton algs4: Prim minimum spanning forest](https://raw.githubusercontent.com/kevin-wayne/algs4/master/src/main/java/edu/princeton/cs/algs4/PrimMST.java) — Class documentation lines 39–55; component loop lines 82–90; cut checks lines 175–190; accessed 2026-10-10.
  - Checked: Negative weights and ties are valid for spanning trees.; Disconnected graphs require a forest contract or an explicit no-MST result.; Cut optimality compares crossing-edge weights.
  - Conventions: Princeton repeats indexed-heap Prim for every component; app lazy-heap Prim rejects disconnected nonempty input.; Indexed heap O(E log V) and O(V) extra storage are not the bounds of the app lazy heap.

## lesson:kruskal

- [CP Algorithms: Kruskal with DSU](https://cp-algorithms.com/graph/mst_kruskal_with_dsu.html) — Rank-aware DSU implementation and sorted edge sweep; accessed 2026-10-10.
  - Checked: Process edges by increasing weight.; Use rank and compression for DSU.
  - Conventions: App-specific conventions stated in the lesson.

- [CP Algorithms: Prim](https://cp-algorithms.com/graph/mst_prim.html) — Cut argument; dense and sparse implementations; no-MST check; accessed 2026-10-10.
  - Checked: An MST spans a connected undirected graph.; Dense matrix Prim costs O(V²).
  - Conventions: App uses a lazy edge heap, not the source ordered-set decrease-key version.

- [Princeton algs4: Prim minimum spanning forest](https://raw.githubusercontent.com/kevin-wayne/algs4/master/src/main/java/edu/princeton/cs/algs4/PrimMST.java) — Class documentation lines 39–55; component loop lines 82–90; cut checks lines 175–190; accessed 2026-10-10.
  - Checked: Negative weights and ties are valid for spanning trees.; Disconnected graphs require a forest contract or an explicit no-MST result.; Cut optimality compares crossing-edge weights.
  - Conventions: Princeton repeats indexed-heap Prim for every component; app lazy-heap Prim rejects disconnected nonempty input.; Indexed heap O(E log V) and O(V) extra storage are not the bounds of the app lazy heap.

## lesson:fenwick-tree

- [CP Algorithms: Fenwick tree](https://cp-algorithms.com/data_structures/fenwick.html) — One-based indexing approach; finding minimum; accessed 2026-10-10.
  - Checked: Low-bit jumps implement sum update/query.; Minimum variants have restrictions.
  - Conventions: App exposes one-based indices; inclusive range endpoints.

- [CP Algorithms: segment trees](https://cp-algorithms.com/data_structures/segment_tree.html) — Simplest sum tree; construction; update and query; accessed 2026-10-10.
  - Checked: Build is linear; point update and query logarithmic.
  - Conventions: Source commonly uses recursive 4n storage; app uses iterative 2n.

- [Stanford CS166: Fenwick trees](https://web.stanford.edu/class/archive/cs/cs166/cs166.1166/handouts/070%20Problem%20Set%203.pdf) — Problem Three, printed page 3 (PDF page 3), parts i–iii; accessed 2026-10-10.
  - Checked: One-based incremental updates and inclusive prefix sums.; Fenwick storage can be an implicit array with logarithmic operations.
  - Conventions: The app demonstrates repeated add construction in O(n log(n+1)); a linear initializer is a separate algorithm.; App prefix(0) is zero and an empty inclusive range has lo=hi+1.

## lesson:segment-tree

- [Al.Cash: Efficient and easy segment trees](https://codeforces.com/blog/entry/18051) — Single-element modifications; arbitrary sized array; non-commutative combiners; accessed 2026-10-10.
  - Checked: Compact 2n layout supports arbitrary n.; Ordered operations require two query accumulators.
  - Conventions: App uses addition, one accumulator and half-open zero-based ranges.

- [CP Algorithms: segment trees](https://cp-algorithms.com/data_structures/segment_tree.html) — Simplest sum tree; construction; update and query; accessed 2026-10-10.
  - Checked: Build is linear; point update and query logarithmic.
  - Conventions: Source commonly uses recursive 4n storage; app uses iterative 2n.

## pattern:bfs-shortest-path

- [Open Data Structures: graph traversal](https://opendatastructures.org/ods-python/12_3_Graph_Traversal.html) — 12.3.1 BFS; 12.3.2 DFS; Figures 12.4–12.5; accessed 2026-10-10.
  - Checked: BFS discovers reachable vertices in distance order.; DFS records visited vertices before recursion.
  - Conventions: App-specific conventions stated in the lesson.

- [MIT 6.006 Lecture 9: BFS](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/196a95604877d326c6586e60477b59d4_MIT6_006S20_lec9.pdf) — Pages 1–4: representations, shortest paths, BFS; accessed 2026-10-10.
  - Checked: Undirected adjacency stores both directions.; A path length counts edges.
  - Conventions: App may use -1 for unreachable distances instead of infinity.

## pattern:tree-bfs

- [Open Data Structures: graph traversal](https://opendatastructures.org/ods-python/12_3_Graph_Traversal.html) — 12.3.1 BFS; 12.3.2 DFS; Figures 12.4–12.5; accessed 2026-10-10.
  - Checked: BFS discovers reachable vertices in distance order.; DFS records visited vertices before recursion.
  - Conventions: App-specific conventions stated in the lesson.

- [MIT 6.006 Lecture 9: BFS](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/196a95604877d326c6586e60477b59d4_MIT6_006S20_lec9.pdf) — Pages 1–4: representations, shortest paths, BFS; accessed 2026-10-10.
  - Checked: Undirected adjacency stores both directions.; A path length counts edges.
  - Conventions: App may use -1 for unreachable distances instead of infinity.

## pattern:tree-dfs

- [Runestone: tree traversals](https://runestone.academy/ns/books/published/pythonds3/Trees/TreeTraversals.html) — 6.8: preorder, inorder, postorder; recursive code listings; accessed 2026-10-10.
  - Checked: Traversal visit order.; None is the recursion base case.
  - Conventions: App-specific conventions stated in the lesson.

- [Open Data Structures: binary trees](https://opendatastructures.org/ods-python/6_Binary_Trees.html) — Chapter 6 definitions and Figures 6.1–6.2; accessed 2026-10-10.
  - Checked: Unique parents in a rooted tree.; Depth and height count edges.
  - Conventions: This app states when its height function counts nodes instead.

## pattern:graph-dfs-components

- [Open Data Structures: graph traversal](https://opendatastructures.org/ods-python/12_3_Graph_Traversal.html) — 12.3.1 BFS; 12.3.2 DFS; Figures 12.4–12.5; accessed 2026-10-10.
  - Checked: BFS discovers reachable vertices in distance order.; DFS records visited vertices before recursion.
  - Conventions: App-specific conventions stated in the lesson.

- [Open Data Structures: adjacency lists](https://opendatastructures.org/ods-python/12_2_AdjacencyLists_Graph_a.html) — 12.2; Figure 12.3; Theorem 12.2; accessed 2026-10-10.
  - Checked: Adjacency storage is O(V+E).; Scanning one neighbor list costs its degree.
  - Conventions: App-specific conventions stated in the lesson.

## pattern:topological-sort

- [VisuAlgo: graph traversal](https://visualgo.net/en/dfsbfs) — Directed graph settings; cycle states; 7-6 topological sorting (DFS and Kahn BFS); accessed 2026-10-10.
  - Checked: Topological order requires a DAG.; Kahn starts with zero in-degree.
  - Conventions: App-specific conventions stated in the lesson.

- [Open Data Structures: graph traversal](https://opendatastructures.org/ods-python/12_3_Graph_Traversal.html) — 12.3.1 BFS; 12.3.2 DFS; Figures 12.4–12.5; accessed 2026-10-10.
  - Checked: BFS discovers reachable vertices in distance order.; DFS records visited vertices before recursion.
  - Conventions: App-specific conventions stated in the lesson.

- [Princeton algs4: queue-based topological sorting](https://raw.githubusercontent.com/kevin-wayne/algs4/master/src/main/java/edu/princeton/cs/algs4/TopologicalX.java) — Class documentation lines 11–24; indegree queue and count check lines 46–75; accessed 2026-10-10.
  - Checked: A complete topological order exists exactly for directed acyclic graphs.; Vertices enter the queue when remaining indegree becomes zero.; A processed count below V rejects a complete order.
  - Conventions: Source consumes an existing graph; app builds adjacency internally and includes O(V+E) in auxiliary storage.; Main app examples raise on cycles; the lesson prefix-count exercise intentionally returns the processed prefix.

## pattern:union-find

- [CP Algorithms: disjoint-set union](https://cp-algorithms.com/data_structures/disjoint_set_union.html) — Path compression; union by rank; time complexity; accessed 2026-10-10.
  - Checked: Rank plus compression gives amortized inverse-Ackermann cost.; Rank alone bounds an individual operation logarithmically.
  - Conventions: App uses iterative path halving, a compression variant.

- [Princeton algs4: rank and path-halving union-find](https://raw.githubusercontent.com/kevin-wayne/algs4/master/src/main/java/edu/princeton/cs/algs4/UF.java) — Class documentation lines 57–68; find lines 109–115; union lines 149–159; accessed 2026-10-10.
  - Checked: Rank plus path halving gives an inverse-Ackermann amortized operation bound.; Initialization is linear; an individual worst-case operation may be logarithmic.; Only equal-rank unions increase the surviving rank.
  - Conventions: Source Java implementation; app uses the same rank and halving strategy in Python.; App reports retained parent/rank arrays separately from constant working space per operation.

## pattern:dijkstra

- [CP Algorithms: sparse Dijkstra](https://cp-algorithms.com/graph/dijkstra_sparse.html) — priority_queue implementation and stale-entry discussion; accessed 2026-10-10.
  - Checked: Lazy heaps retain duplicate vertex entries.; Discard obsolete distances before scanning edges.
  - Conventions: App uses heapq rather than decrease-key.

- [MIT 6.006 Lecture 13: Dijkstra](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/d819e7f4568aced8d5b59e03db6c7b67_MIT6_006S20_lec13.pdf) — Pages 1–3: nonnegative weights, priority queue, correctness; accessed 2026-10-10.
  - Checked: Nonnegative edges support distance finalization.
  - Conventions: MIT uses decrease-key; app uses lazy duplicate entries and a stale guard.

## pattern:trie-prefix

- [CP Algorithms: trie construction](https://cp-algorithms.com/string/aho_corasick.html) — Construction of the trie; accessed 2026-10-10.
  - Checked: Paths share prefixes.; Terminal flags distinguish complete words.
  - Conventions: App uses dictionaries for arbitrary characters rather than a fixed 26-child array.

- [USFCA: Trie Visualization](https://www.cs.usfca.edu/~galles/visualization/Trie.html) — Inserted APP and APPLE; inspected shared A-P-P path and terminal coloring.; accessed 2026-10-10.
  - Checked: Shared prefix nodes remain common.; APP stays terminal when APPLE is added.
  - Conventions: Reference uses uppercase; app accepts arbitrary characters.

### heaps/task-scheduler — Codex completion

- [LeetCode 621 Task Scheduler](https://leetcode.com/problems/task-scheduler/) — Description, examples, constraints. Checked 2026-10-10: Tasks take one slot and may be reordered.; Equal task labels require the common cooldown between executions.; Original labels are A through Z; cooldown zero is allowed..
- [NeetCode Task Scheduler explanation](https://neetcode.io/solutions/task-scheduler) — Prerequisites; 1. Brute Force intuition; 2. Max-Heap intuition/Python; 3. Greedy; 4. Math. Checked 2026-10-10: A ready priority structure and cooldown queue separate selection from eligibility.; Choose an eligible label with the largest remaining count.; For nonempty input the optimal duration is max(N,(F-1)*(c+1)+M), where M labels tie at frequency F..
- [Python 3.14 heapq](https://docs.python.org/3.14/library/heapq.html) — heap invariant; heapify/heappush/heappop; Priority Queue Implementation Notes. Checked 2026-10-10: The unqualified API is a zero-based min-heap.; heapify builds in linear time; push/pop sift logarithmically.; Tuple priorities compare subsequent fields when priorities tie..
- [Python 3.14 collections](https://docs.python.org/3.14/library/collections.html) — Counter; deque objects. Checked 2026-10-10: Counter stores counts of hashable labels.; deque supports append and popleft with approximately constant endpoint cost..
- [USFCA Heap Visualization](https://www.cs.usfca.edu/~galles/visualization/Heap.html) — Insert 15; insert 10; Remove Smallest, with Skip Forward after each operation. Checked 2026-10-10: The smaller root is removed first, leaving the remaining value.; The root changes as actual heap contents change..

### sorting/meeting-rooms-ii — Codex completion

- [NeetCode Meeting Rooms II explanation](https://neetcode.io/solutions/meeting-rooms-ii) — Description; 1. Min Heap; 2. Sweep Line Algorithm; Common Pitfalls. Checked 2026-10-10: Every meeting must be accommodated, rather than selecting a subset.; A meeting ending at t may share a room with one starting at t.; Sort by start before processing; a sweep of starts and ends is also valid..
- [Boston University CS330 Greedy Algorithms lecture](https://cs-people.bu.edu/januario/teaching/cs330/su23/slides/CS330-Lec06-with-notes.pdf) — PDF pages 17-21, 28-36: interval partitioning, priority queues, depth and earliest-start correctness. Checked 2026-10-10: The number of simultaneous intervals is a lower bound on required rooms.; Start-order assignment opens a new room only when all existing rooms conflict, attaining that lower bound.; Sorting plus a linear number of logarithmic priority-queue operations takes O(n log n)..
- [Python 3.14 heapq](https://docs.python.org/3.14/library/heapq.html) — heap invariant; heapify/heappush/heappop; Priority Queue Implementation Notes. Checked 2026-10-10: The unqualified API is a zero-based min-heap.; heapify builds in linear time; push/pop sift logarithmically.; Tuple priorities compare subsequent fields when priorities tie..
- [USFCA Heap Visualization](https://www.cs.usfca.edu/~galles/visualization/Heap.html) — Insert 15; insert 10; Remove Smallest, with Skip Forward after each operation. Checked 2026-10-10: The smaller root is removed first, leaving the remaining value.; The root changes as actual heap contents change..

## DP, recursion, and backtracking — consulted 2026-10-10

The references below identify actual pages/sections consulted and the claims/conventions recorded on the effective lesson or pattern. Source diagrams were not copied. Modern DP includes both memoization and tabulation, following MIT and Python documentation; Runestone uses a narrower term in one section. Source/app indexing and problem extensions are recorded separately.

### Additional research and visual inspection record

- Runestone, [Stack Frames: Implementing Recursion](https://runestone.academy/ns/books/published/pythonds3/Recursion/StackFramesImplementingRecursion.html), full relevant section and live Figure 4.6: inspected the stacked local-parameter cards and return-result placeholders. Its recursive number-to-string example differs from the app factorial; the apparent card label/value typo was not copied. App frames are rendered from recorded runtime snapshots.
- Runestone, [Dynamic Programming](https://runestone.academy/ns/books/published/pythonds3/Recursion/DynamicProgramming.html), full relevant minimum-coin section and live Figure 15: inspected amount dependencies for denominations1,5,10. App uses1,2,5 and a sentinel supporting unreachable amounts; the source assumes a coin of value1 for its initialization.
- [MIT6.006 lecture15](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/9eb3e9a51a7b5b60b0f67c2277f8b0ee_MIT6_006S20_lec15.pdf), all eight pages: state/recurrence/topological evaluation, Fibonacci, divide-and-conquer and growing integer costs. [Lecture16](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/28461a74f81101874a13d9679a40584d_MIT6_006S20_lec16.pdf), all nine pages: suffix-state LCS/LIS, while app uses equivalent prefix/endpoint states. [Lecture18](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/mit6_006s20_lec18.pdf), all eight pages: subset take/skip, reachable-state vs full-table work and numeric-capacity pseudo-polynomial costs. PDF text was read; no visual screenshot inspection is claimed for these PDFs.
- [Georgia Tech lecture9](https://faculty.cc.gatech.edu/~ladha/algo/L9.pdf), all six pages: house-robber prefix totals and grid counts. Its conflicting grid/fib pseudocode base values were checked against definitions, MIT and actual execution. App Fibonacci uses F0=0,F1=1 and stairs uses ways0=ways1=1. Its stairs1/2/3 variant is not the app1/2 variant.
- [Stanford CS106B backtracking lecture](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1258/lectures/11-backtracking1/), relevant full lecture and supplemental examples; [Stanford handout19](https://see.stanford.edu/materials/icspacs106b/H19-RecBacktrackExamples.pdf), all twelve pages: choose/explore/undo, subsets, permutations and queen conflicts. C++ copied-string/board-scanning/first-solution implementations differ from app shared-list/set/all-count implementations; complexity follows the displayed Python.
- [MIT balanced-parentheses notes](https://math.mit.edu/~djk/18.310/18.310F04/parentheses.pdf), all thirteen pages: nonnegative prefix balance, Catalan formula and first counts. Used to verify counts and independent validity checks, not to copy enumerator code.
- [NYU lecture24](https://cs.nyu.edu/~gottlieb/courses/2000s/2002-03-fall/alg/lectures/lecture-24.html), fractional-knapsack proof and0/1 counterexample: positive divisible items permit ratio greedy; capacity6, weights4,3,3 and values5,3,3 refute a general0/1 guarantee. The source arithmetic typo7-4 was not copied. [Charlotte lecture16](https://webpages.charlotte.edu/rbunescu/courses/ou/cs4040/lecture16.pdf), all twenty-one pages: previous-item/residual-capacity recurrence, zero-capacity base, pseudo-polynomial analysis and reconstruction; source one-based item numbering differs from Python zero-based lists.
- [Hawaii ICS311 topic7](https://courses.ics.hawaii.edu/ics311_f26/Notes/Topic-07.html), max-subarray divide/combine analysis: inclusive crossing halves, nonempty base, linear crossings and2T(n/2)+linear. App stores bounds without list slices.
- [Hirschberg1975 original paper](https://ics.uci.edu/~dhirschb/pubs/p341-hirschberg.pdf), all three pages341–343: full prefix lengths, two-row lengths, divide-and-conquer reconstruction of an actual LCS, O(mn) time and O(m+n) space with shared substring index ranges. This corrects a universal full-table reconstruction requirement; the app still shows the simple full-table length algorithm.
- Python3.14 [functools](https://docs.python.org/3.14/library/functools.html), cache/lru_cache sections; [hashable glossary](https://docs.python.org/3.14/glossary.html#term-hashable); [recursion limit](https://docs.python.org/3.14/library/sys.html#sys.getrecursionlimit); [numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex): unbounded/default128 cache choice, key hashability, result references, interpreter limit and unlimited-precision integers. App bundled runtime is CPython3.14.2; documentation claims were validated against it.
- Inaccessible primary URLs triggered replacements: the attempted LeetCode parentheses/unique-paths pages and Cornell/Stanford/Duke guessed or failing lecture links were replaced by the consulted MIT Catalan, Georgia Tech, Stanford, NYU and Charlotte sources. No claim relies on a failed page or on a secondary search snippet.

### lesson/dp-base-cases

Read all explanation, vocabulary, concepts, line explanations, predictions, experiments, practice/model/effective hints and recognition, bindings, costs and references. Added a negative-index guard. fact(5) has five total calls, four child calls and depth five; n=0 still has one call. The base check runs on every call, while the direct base return occurs once. Missing only the base case with the guard retained eventually raises ValueError; removing both can reach RecursionError. Unit-cost O(n) multiplication/frames excludes growing integer costs. Actual factorial oracle covers 0..7 and negative rejection.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [Runestone: three laws of recursion](https://runestone.academy/ns/books/published/pythonds3/Recursion/TheThreeLawsofRecursion.html) — Base case, changing state, recursion. Checked: A terminating recursive solution needs a base case and progress toward it. Accessed 2026-10-10.
- [Runestone: stack frames](https://runestone.academy/ns/books/published/pythonds3/Recursion/StackFramesImplementingRecursion.html) — Stack Frames: Implementing Recursion, Figure 4.6. Checked: Each active recursive call retains its own parameters and local values until return. Convention: The app shows actual traced frames; the source figure is a to_str example, not factorial. A source figure label differs from its n=5 card and is not copied. Accessed 2026-10-10.
- [Python 3.14 recursion limit](https://docs.python.org/3.14/library/sys.html#sys.getrecursionlimit) — sys.getrecursionlimit. Checked: The interpreter limits recursion depth to protect the C stack. Accessed 2026-10-10.

### lesson/dp-recursive-calls

The exact naive recurrence is T(0)=T(1)=1 and T(n)=1+T(n-1)+T(n-2), hence 2F(n+1)-1, with growth Theta(phi^n), not doubling. fib(6) has 25 calls and depth six; n=7/8 have 41/67 calls. Repeated arguments establish overlap. The memoized comparison remains linear cold scalar work. Global counter reset and negative-index rejection agree with code. All predictions/models and effective fields read; actual call-counter and Fibonacci oracles cover 0..6.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [MIT 6.006 lecture 15: dynamic programming](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/9eb3e9a51a7b5b60b0f67c2277f8b0ee_MIT6_006S20_lec15.pdf) — SRTBOT; Fibonacci; memoization and bottom-up evaluation. Checked: A complete state, acyclic dependency order, base cases and correct recurrence justify DP; runtime counts states and nonrecursive transition work. Both memoization and tabulation are dynamic programming; Fibonacci is linear in scalar additions but big-integer additions grow with the index. Convention: F(0)=0, F(1)=1. Displayed functions exclude demo literal construction and printing. Accessed 2026-10-10.
- [Runestone: stack frames](https://runestone.academy/ns/books/published/pythonds3/Recursion/StackFramesImplementingRecursion.html) — Stack Frames: Implementing Recursion, Figure 4.6. Checked: Each active recursive call retains its own parameters and local values until return. Convention: The app shows actual traced frames; the source figure is a to_str example, not factorial. A source figure label differs from its n=5 card and is not copied. Accessed 2026-10-10.

### lesson/dp-backtracking

Preserved the immutable-string implementation and corrected its analysis. append(cur) stores a reference to an immutable string, not a new copy. Ancestor prefix strings of lengths 0..2n remain live, requiring O(n^2) characters in addition to O(n) frames. O((n+1)^2*C_n) is a conservative scalar time upper bound for prefix concatenation; output is O((n+1)*C_n). A shared mutable path would be a different O(n)-working-storage implementation. Prefix-balance correctness, Catalan counts and empty output verified on n=0..3; real frames retain prefix lengths 0..4 totaling ten characters.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [Stanford CS106B: recursive backtracking](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1258/lectures/11-backtracking1/) — Choose/explore/unchoose, subsets and string-by-value notes. Checked: Mutable shared paths must be restored for siblings; by-value strings need no explicit undo; output copies contribute to subset enumeration cost. Convention: Python shared-list append/pop is paired; immutable prefix strings remain in separate live frames. Accessed 2026-10-10.
- [MIT: balanced parentheses and Catalan counting](https://math.mit.edu/~djk/18.310/18.310F04/parentheses.pdf) — Balanced-prefix condition; Catalan formula. Checked: A valid prefix never has more closing than opening parentheses; C_n=binom(2n,n)/(n+1). Convention: The app opens first, allows at most n opens, and closes only when close_c<open_c. n=0 gives one empty string. Accessed 2026-10-10.
- [Runestone: stack frames](https://runestone.academy/ns/books/published/pythonds3/Recursion/StackFramesImplementingRecursion.html) — Stack Frames: Implementing Recursion, Figure 4.6. Checked: Each active recursive call retains its own parameters and local values until return. Convention: The app shows actual traced frames; the source figure is a to_str example, not factorial. A source figure label differs from its n=5 card and is not copied. Accessed 2026-10-10.

### lesson/dp-subsets

Distinct values and increasing start indices yield each subset once; snapshot copies prevent result aliases. Exactly 2^n list headers and n*2^(n-1) copied references for positive n separate required output from O(n) shared path/frames. Changing bt(i+1,path) to bt(i,path) without a length/target stopping condition does not terminate; it is not a valid repeated-choice generator. DP aggregation is not automatically polynomial or a replacement for all explicit outputs. Empty/singleton/three-item mask-set oracle, alias identities and unchanged input verified.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [Stanford CS106B: recursive backtracking](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1258/lectures/11-backtracking1/) — Choose/explore/unchoose, subsets and string-by-value notes. Checked: Mutable shared paths must be restored for siblings; by-value strings need no explicit undo; output copies contribute to subset enumeration cost. Convention: Python shared-list append/pop is paired; immutable prefix strings remain in separate live frames. Accessed 2026-10-10.
- [Stanford CS106B handout 19](https://see.stanford.edu/materials/icspacs106b/H19-RecBacktrackExamples.pdf) — Classic exhaustive subset pattern. Checked: Include/exclude decisions enumerate all 2^n subsets. Convention: The app uses increasing-index DFS and shared append/pop rather than copied C++ strings. Accessed 2026-10-10.
- [LeetCode: Subsets](https://leetcode.com/problems/subsets/description/) — Problem definition, examples and constraints. Checked: Distinct input values are required for unique value subsets; every subset is returned. Convention: App additionally allows empty input and chooses DFS output order. Accessed 2026-10-10.

### lesson/dp-permutations

Distinct-input full permutations use used-index flags with restoration. Omitting restoration loses full orderings; the leaf guard does not emit short permutations. Every internal prefix scans all n indices, giving O(n*n!) including leaf snapshots rather than O(1) work per internal node. Empty input has one empty permutation. All raw and effective practice hints/recognition/test feedback read; factorial-count/uniqueness/permutation-content oracles cover n=0..3. Central test feedback now says omitted orderings.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [Stanford CS106B: recursive backtracking](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1258/lectures/11-backtracking1/) — Choose/explore/unchoose, subsets and string-by-value notes. Checked: Mutable shared paths must be restored for siblings; by-value strings need no explicit undo; output copies contribute to subset enumeration cost. Convention: Python shared-list append/pop is paired; immutable prefix strings remain in separate live frames. Accessed 2026-10-10.
- [Stanford CS106B handout 19](https://see.stanford.edu/materials/icspacs106b/H19-RecBacktrackExamples.pdf) — Classic exhaustive permutation pattern. Checked: Trying every remaining unused element enumerates n! orderings. Convention: Source copies strings of remaining choices; app scans a fixed n-index used array and counts that work. Accessed 2026-10-10.
- [LeetCode: Permutations](https://leetcode.com/problems/permutations/description/) — Problem definition, examples and constraints. Checked: Inputs are distinct; output consists of every full ordering. Convention: Empty-input extension is one empty ordering. Accessed 2026-10-10.

### lesson/dp-combinations

The shown loop now caps the last candidate at n-remaining+1, avoiding prefixes that cannot reach k. This supports O((k+1)*C(n,k)+1) time including output and O(k+1) working slots; k=0 and k>n are handled. The valid simpler practice model remains unpruned and may visit sum(C(n,j),j<=k) prefixes; it is not assigned the pruned bound. Repetition needs both same-index recursion and removal of the pruning cap, with fixed k stopping progress. Positive reusable combination-sum inputs require a decreasing target. Counts and boundary cases, including k=n, checked against binomial coefficients.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [Stanford CS106B: recursive backtracking](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1258/lectures/11-backtracking1/) — Choose/explore/unchoose, subsets and string-by-value notes. Checked: Mutable shared paths must be restored for siblings; by-value strings need no explicit undo; output copies contribute to subset enumeration cost. Convention: Python shared-list append/pop is paired; immutable prefix strings remain in separate live frames. Accessed 2026-10-10.
- [LeetCode: Combinations](https://leetcode.com/problems/combinations/description/) — Problem definition, examples and constraints. Checked: Select k distinct integers from 1..n without considering ordering. Convention: App extends k=0 to [[]] and k>n to []; displayed loop additionally prunes unfillable prefixes. Accessed 2026-10-10.
- [LeetCode: Combination Sum](https://leetcode.com/problems/combination-sum/description/) — Problem definition, examples and constraints. Checked: Distinct positive candidates may be reused; choices are limited by a remaining sum. Convention: Changing only the recursion index without a target/depth bound does not establish termination. Accessed 2026-10-10.

### lesson/dp-memoization

Python3.14 lru_cache default maxsize128 differs from the shown maxsize=None unbounded cache. Keys must be hashable with stable hash/equality, not universally immutable; tuples require hashable members. Cached mutable results alias, and caching assumes the intended stable result semantics. Cold fib(10) yields eleven misses, eight hits, nine additions and eleven entries; a repeat adds one hit. Cold expected-hashing O(n) scalar work and warm expected O(1) are separated. Cached Fibonacci values retain Theta(n^2) bits; recursion depth remains O(n). Actual cache_info and negative-guard behavior verified.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [MIT 6.006 lecture 15: dynamic programming](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/9eb3e9a51a7b5b60b0f67c2277f8b0ee_MIT6_006S20_lec15.pdf) — SRTBOT; Fibonacci; memoization and bottom-up evaluation. Checked: A complete state, acyclic dependency order, base cases and correct recurrence justify DP; runtime counts states and nonrecursive transition work. Both memoization and tabulation are dynamic programming; Fibonacci is linear in scalar additions but big-integer additions grow with the index. Convention: F(0)=0, F(1)=1. Displayed functions exclude demo literal construction and printing. Accessed 2026-10-10.
- [Python 3.14 functools](https://docs.python.org/3.14/library/functools.html#functools.lru_cache) — lru_cache and cache: maxsize, hashable arguments, cache_info, cache_clear, retained references. Checked: maxsize=None disables eviction; cached arguments must be hashable; caching skips repeat body execution and retains arguments/results. Accessed 2026-10-10.
- [Python 3.14 glossary](https://docs.python.org/3.14/glossary.html#term-hashable) — hashable. Checked: Hashability requires a stable hash and matching equality; tuples require hashable contents. Accessed 2026-10-10.

### lesson/dp-tabulation

Bottom-up Fibonacci allocates n+1 cells, seeds correct 0/1 bases and computes each later state only after dependencies. Allocation is included in O(n) scalar work/storage; n=10 has nine transition writes. Modern DP terminology includes memoization as well as tabulation; the narrower Runestone usage is explicitly reconciled with MIT/Python. Python Fibonacci values occupy Theta(n^2) stored bits and addition work can exceed the scalar model. Values 0..11 and negative rejection agree with actual runtime.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [MIT 6.006 lecture 15: dynamic programming](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/9eb3e9a51a7b5b60b0f67c2277f8b0ee_MIT6_006S20_lec15.pdf) — SRTBOT; Fibonacci; memoization and bottom-up evaluation. Checked: A complete state, acyclic dependency order, base cases and correct recurrence justify DP; runtime counts states and nonrecursive transition work. Both memoization and tabulation are dynamic programming; Fibonacci is linear in scalar additions but big-integer additions grow with the index. Convention: F(0)=0, F(1)=1. Displayed functions exclude demo literal construction and printing. Accessed 2026-10-10.
- [Runestone: dynamic programming](https://runestone.academy/ns/books/published/pythonds3/Recursion/DynamicProgramming.html) — Memoization and bottom-up discussion. Checked: Stored results avoid repeated computation; tabulation evaluates dependencies before use. Convention: Runestone uses a narrower terminology that excludes memoization; this app adopts MIT/Python terminology including both. Accessed 2026-10-10.

### lesson/dp-1d-2d

The natural unique-paths state has two coordinates, but storage need not have two dimensions: row compression retains previous-row/current-left dependencies while the outer loop supplies the row. Full-table allocation initializes interior placeholders, not completed counts. Positive obstacle-free boundaries have one path; zero dimensions return zero and negative dimensions reject. Obstacles require boundary zero propagation. Full cost includes allocation and small zero cases; counts are growing integers. Binomial path oracle and actual dp coordinates agree. Recognition distinguishes natural state dimensions from safe storage compression.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [Georgia Tech CS3510 lecture 9](https://faculty.cc.gatech.edu/~ladha/algo/L9.pdf) — House robber, grid paths and DP evaluation. Checked: House-robber take/skip prefix recurrence yields 12 on [2,7,9,3,1]; right/down path counts combine above and left. Obstacle boundaries need propagation, not an interior-only skip rule. Convention: App stairs allow 1 or 2 steps; source includes a 1/2/3 variant. Source grid prose uses start count 1; its conflicting dp[0][0]=0 pseudocode is not adopted. Accessed 2026-10-10.
- [MIT 6.006 lecture 15: dynamic programming](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/9eb3e9a51a7b5b60b0f67c2277f8b0ee_MIT6_006S20_lec15.pdf) — SRTBOT; Fibonacci; memoization and bottom-up evaluation. Checked: A complete state, acyclic dependency order, base cases and correct recurrence justify DP; runtime counts states and nonrecursive transition work. Both memoization and tabulation are dynamic programming; Fibonacci is linear in scalar additions but big-integer additions grow with the index. Convention: F(0)=0, F(1)=1. Displayed functions exclude demo literal construction and printing. Accessed 2026-10-10.

### lesson/dp-knapsack

The 0/1 state dp[i][w] maximizes value at total weight AT MOST w, not exact filling. Positive weights, matching arrays, nonnegative capacity and stated nonnegative values define the contract; invalid lengths/weights/capacity reject. Full allocation costs O((n+1)(W+1)) time/cells, including empty/zero cases, and is pseudo-polynomial in numeric capacity. Descending-capacity compression preserves the previous item row. Ratio greedy is guaranteed for divisible positive-weight items but lacks a general 0/1 guarantee: weights4,3,3 values5,3,3 capacity6 give greedy5 vs optimum6. Exhaustive subsets verify empty/zero/sample/counterexample cases.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [University lecture: 0/1 knapsack](https://webpages.charlotte.edu/rbunescu/courses/ou/cs4040/lecture16.pdf) — Take/skip recurrence, table base cases and row storage. Checked: An item may be taken once using previous-item states; capacity DP is pseudo-polynomial; positive weights make zero capacity worth zero. Convention: Source uses one-based item numbering; app accesses item i−1. Accessed 2026-10-10.
- [NYU: fractional and 0/1 knapsack](https://cs.nyu.edu/~gottlieb/courses/2000s/2002-03-fall/alg/lectures/lecture-24.html) — Greedy fraction exchange and indivisible counterexample. Checked: Positive-weight divisible items admit ratio-greedy; general 0/1 items do not. Convention: The counterexample has W=6, weights4,3,3 and values5,3,3; remaining capacity after weight4 is 2 (source subtraction typo is not copied). Accessed 2026-10-10.
- [MIT 6.006 lecture 18](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/mit6_006s20_lec18.pdf) — Subset sum and pseudo-polynomial time. Checked: Numeric-capacity state counts differ from input bit-length complexity. Accessed 2026-10-10.

### lesson/dp-subsequences

Earliest matching is a correct membership greedy under order-preserving deletion, including gaps. Main code now returns immediately for empty candidate and when fully matched, retaining O(|t|+1) worst scalar work and O(1) storage. Candidate pointer i is bound to s; examined-text pointer j is bound to t. Optimizing/counting variants require their own algorithm; DP is one option rather than a universal table necessity. Empty/order/duplicate oracles and actual i=2,j=3 diagram positions verified. All line comments and practice contracts agree.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [LeetCode: Is Subsequence](https://leetcode.com/problems/is-subsequence/description/) — Problem definition, examples and constraints. Checked: A subsequence permits deletion without changing remaining order; empty strings are permitted. Accessed 2026-10-10.
- [MIT 6.006 lecture 16](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/28461a74f81101874a13d9679a40584d_MIT6_006S20_lec16.pdf) — LIS and LCS state definitions. Checked: Subsequence optimization differs from checking one prescribed candidate. Convention: Membership uses greedy earliest matches; LIS/LCS need separate recurrences. Accessed 2026-10-10.

### lesson/dp-state-transitions

One-trade stock profit now handles empty input and iterates indices rather than allocating prices[1:], preserving O(1) scalar storage. min_price is a price value, not a day index. With best initialized zero, swapping the min/best updates preserves the profit value: a same-day candidate adds only zero. A sufficient state enables valid transitions but does not automatically promise constant storage or one-pass efficiency for other problems; grid compression keeps a row. Exhaustive pair-profit oracles and actual value/index bindings verified.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [LeetCode: Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/description/) — Problem definition, examples and constraints. Checked: One buy and one strictly later sell are allowed; no profitable trade returns zero. Convention: Source numbers days from 1; app positions are 0-based. App adds empty-input return zero. Accessed 2026-10-10.
- [MIT 6.006 lecture 15: dynamic programming](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/9eb3e9a51a7b5b60b0f67c2277f8b0ee_MIT6_006S20_lec15.pdf) — SRTBOT; Fibonacci; memoization and bottom-up evaluation. Checked: A complete state, acyclic dependency order, base cases and correct recurrence justify DP; runtime counts states and nonrecursive transition work. Both memoization and tabulation are dynamic programming; Fibonacci is linear in scalar additions but big-integer additions grow with the index. Convention: F(0)=0, F(1)=1. Displayed functions exclude demo literal construction and printing. Accessed 2026-10-10.

### lesson/dp-climbing-stairs

Allowed moves one/two partition climbs by the final move, with ways(0)=ways(1)=1; zero stairs has one empty climb. The shown n updates return ways(n), climb(5)=8, and negative n rejects. Two scalar cells do not imply bounded bytes: counts occupy growing integer bits. The elementary O(n) recurrence is not a claim that no faster method exists. Both a and b now have visible object bindings because ObjectVisualizer does not consume the old scalar overlay. Values0..6, model and actual frame values verified.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [LeetCode: Climbing Stairs](https://leetcode.com/problems/climbing-stairs/description/) — Problem definition, examples and constraints. Checked: Moves of size 1 or 2 give distinct ordered climbs. Convention: Original n≥1; app extends zero stairs to one empty climb. Accessed 2026-10-10.
- [MIT 6.006 lecture 15: dynamic programming](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/9eb3e9a51a7b5b60b0f67c2277f8b0ee_MIT6_006S20_lec15.pdf) — SRTBOT; Fibonacci; memoization and bottom-up evaluation. Checked: A complete state, acyclic dependency order, base cases and correct recurrence justify DP; runtime counts states and nonrecursive transition work. Both memoization and tabulation are dynamic programming; Fibonacci is linear in scalar additions but big-integer additions grow with the index. Convention: F(0)=0, F(1)=1. Displayed functions exclude demo literal construction and printing. Accessed 2026-10-10.

### lesson/dp-house-robber

The rolling take/skip prefix recurrence and simultaneous old-value update are correct for nonnegative house values, including empty/singleton. The old richest-first scenario [2,7,9,3,1] also gives greedy12 and was not a counterexample; the effective recognition scenario is [4,5,4], greedy5 vs DP8. O(n) scalar work/O(1) slots is scoped to the linear helper. A circular variant must handle length0/1 before two subarrays; Python slices add O(n) memory. Full prefix storage can aid reconstruction. Brute nonadjacent-mask and greedy oracles verify both scenarios; prev/curr bindings show real totals.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [Georgia Tech CS3510 lecture 9](https://faculty.cc.gatech.edu/~ladha/algo/L9.pdf) — House robber, grid paths and DP evaluation. Checked: House-robber take/skip prefix recurrence yields 12 on [2,7,9,3,1]; right/down path counts combine above and left. Obstacle boundaries need propagation, not an interior-only skip rule. Convention: App stairs allow 1 or 2 steps; source includes a 1/2/3 variant. Source grid prose uses start count 1; its conflicting dp[0][0]=0 pseudocode is not adopted. Accessed 2026-10-10.
- [LeetCode: House Robber](https://leetcode.com/problems/house-robber/description/) — Problem definition, examples and constraints. Checked: Non-negative house values must be selected without adjacent positions; the [2,7,9,3,1] optimum is 12. Accessed 2026-10-10.

### lesson/dp-grid-paths

Minimum path cost uses cell+min(above,left) and cumulative edge costs; both transition and base values differ from counting paths. Rectangular validation now precedes the empty-first-row return, so [[],[1]] rejects instead of silently returning zero. Empty rectangular grids return zero. Right/down dependencies are acyclic, so finite negative cell costs are valid. Arbitrary moves need an appropriate path algorithm: BFS only for unit costs and Dijkstra for nonnegative edges. O(m*n+m+1) includes row validation and allocation, including zero-column rows. Exhaustive path-cost, negative, empty and ragged-grid oracles pass; actual cell coordinates verified.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [LeetCode: Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/description/) — Problem definition, examples and constraints. Checked: The path moves right or down and sums visited cell costs; sample optimum is 7. Convention: Original inputs are nonempty and non-negative. App permits negative finite integer costs in this acyclic grid and extends empty input to zero. Accessed 2026-10-10.
- [Georgia Tech CS3510 lecture 9](https://faculty.cc.gatech.edu/~ladha/algo/L9.pdf) — House robber, grid paths and DP evaluation. Checked: House-robber take/skip prefix recurrence yields 12 on [2,7,9,3,1]; right/down path counts combine above and left. Obstacle boundaries need propagation, not an interior-only skip rule. Convention: App stairs allow 1 or 2 steps; source includes a 1/2/3 variant. Source grid prose uses start count 1; its conflicting dp[0][0]=0 pseudocode is not adopted. Accessed 2026-10-10.
- [MIT 6.006 lecture 15: dynamic programming](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/9eb3e9a51a7b5b60b0f67c2277f8b0ee_MIT6_006S20_lec15.pdf) — SRTBOT; Fibonacci; memoization and bottom-up evaluation. Checked: A complete state, acyclic dependency order, base cases and correct recurrence justify DP; runtime counts states and nonrecursive transition work. Both memoization and tabulation are dynamic programming; Fibonacci is linear in scalar additions but big-integer additions grow with the index. Convention: F(0)=0, F(1)=1. Displayed functions exclude demo literal construction and printing. Accessed 2026-10-10.

### lesson/dp-coin-change

Positive reusable integer denominations and nonnegative amount support dp[a]=min(dp[a-c]+1), dp[0]=0. INF=A+1 is safe because a feasible positive-coin solution uses at most A coins. Empty coins reach only zero; invalid denominations/amount reject. Duplicate denominations are allowed but repeat work. Validation/allocation/transitions cost O((A+1)(k+1)) and A+1 cells, pseudo-polynomial in numeric amount. [1,3,4], amount6 is greedy3 vs DP2; DP is not the only exact algorithm. Independent unweighted amount-graph BFS verifies impossible/zero/empty/greedy cases.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [LeetCode: Coin Change](https://leetcode.com/problems/coin-change/description/) — Problem definition, examples and constraints. Checked: Coins are reusable positive integers; impossible amounts return −1; zero target returns 0. Accessed 2026-10-10.
- [Runestone: dynamic programming](https://runestone.academy/ns/books/published/pythonds3/Recursion/DynamicProgramming.html) — Coin recurrence, bottom-up table and Figure 15. Checked: Minimum coin count can be formed from smaller amounts; greedy denominations can fail; bottom-up order makes dependencies ready. Convention: Source assumes denomination 1 and seeds count=cents. App uses INF=A+1 so arbitrary positive sets and unreachable targets work. The source figure uses [1,5,10], app sample [1,2,5]. Accessed 2026-10-10.
- [MIT 6.006 lecture 15: dynamic programming](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/9eb3e9a51a7b5b60b0f67c2277f8b0ee_MIT6_006S20_lec15.pdf) — SRTBOT; Fibonacci; memoization and bottom-up evaluation. Checked: A complete state, acyclic dependency order, base cases and correct recurrence justify DP; runtime counts states and nonrecursive transition work. Both memoization and tabulation are dynamic programming; Fibonacci is linear in scalar additions but big-integer additions grow with the index. Convention: F(0)=0, F(1)=1. Displayed functions exclude demo literal construction and printing. Accessed 2026-10-10.

### lesson/dp-lis

Strict increasing subsequences use dp[i] ending at i, not the global prefix optimum; answer is max over endpoints, including empty0. Equal values do not extend, and the final endpoint need not be optimal. The shown quadratic implementation makes exactly n(n-1)/2 pair tests plus allocation; its bound assumes total-order finite integers and constant scalar comparisons. O(n log n) alternatives remain acknowledged. Distinct/duplicate/decreasing/global-not-last cases checked independently against all subsequence masks; practice and effective recognition read.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [MIT 6.006 lecture 16](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/28461a74f81101874a13d9679a40584d_MIT6_006S20_lec16.pdf) — Longest increasing subsequence state and recurrence. Checked: LIS fixes an endpoint/anchor so recurrence choices compose; taking the best over all anchors yields O(n²) DP. Convention: Source anchors the start in a suffix, app anchors the end of a prefix. Both require strict increase. Accessed 2026-10-10.
- [LeetCode: Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/description/) — Problem definition, examples and constraints. Checked: The sequence is strictly increasing; equal values cannot extend it; O(n log n) alternatives exist. Accessed 2026-10-10.

### lesson/dp-lcs

Prefix pair dp[i][j] uses diagonal+1 on matches and max(top,left) on mismatches; empty prefixes zero. Full allocation costs O((m+1)(n+1)) even when one input is empty; loops compute m*n interior states. Row compression needs prior row/current left/saved diagonal and can choose the shorter width. Full-table reconstruction is convenient, not necessary: the actually read Hirschberg original gives quadratic-time linear-space reconstruction with shared index ranges. Substring adaptation needs mismatch zero AND maximum over all cells rather than only dp[m][n]. Independent common-subsequence sets verify empty/disjoint/duplicate/sample cases.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [MIT 6.006 lecture 16](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/28461a74f81101874a13d9679a40584d_MIT6_006S20_lec16.pdf) — Longest common subsequence recurrence, bases and table. Checked: Match uses diagonal+1; mismatch takes the maximum after dropping either final/prefix character; empty prefixes have length zero. Convention: MIT formulates suffix states and reversed fill order; app uses prefixes dp[i][j] for a[:i],b[:j], with increasing indices. Accessed 2026-10-10.
- [LeetCode: Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/description/) — Problem definition, examples and constraints. Checked: Return the longest common subsequence length, not a contiguous substring; disjoint strings give zero. Accessed 2026-10-10.
- [Hirschberg (1975): A Linear Space Algorithm for Computing Maximal Common Subsequences](https://ics.uci.edu/~dhirschb/pubs/p341-hirschberg.pdf) — Algorithms A/B/C, correctness and time/space analyses, pp.341–343. Checked: The full-table prefix recurrence computes LCS lengths; a two-row version computes the final row. The divide-and-conquer algorithm C produces an actual longest common subsequence with quadratic time and linear space. Convention: Source uses one-based string positions and shared-storage substring index ranges. This lesson shows a zero-based Python full-table length algorithm, not a Python implementation of algorithm C. Accessed 2026-10-10.

### lesson/dp-divide-and-conquer

Nonempty maximum subarray divides into inclusive [lo,mid] and [mid+1,hi] without slicing, and compares left/right/crossing cases. Empty input explicitly rejects; all-negative input returns the largest element, not empty0. Cross scans are linear per level, giving O(n log(n+1)) scalar work and O(log(n+1)) frames. Both child-call and both crossing-addition lines count operations. The range uses the supported binding.range schema and mid pointer. Brute all-contiguous sums verify singleton/negative/sample cases; actual seventeen helper calls and inclusive range rendering verified.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [University of Hawaii ICS311: divide and conquer](https://courses.ics.hawaii.edu/ics311_f26/Notes/Topic-07.html) — Maximum subarray; FIND-MAX-CROSSING-SUBARRAY; recursion-tree analysis. Checked: A maximum nonempty subarray lies left, right, or across the split; crossing is suffix-left plus prefix-right; recurrence gives O(n log n). Convention: App uses inclusive 0-based lo..hi; right half starts at mid+1. It returns a sum and rejects empty inputs. The source also notes a linear alternative. Accessed 2026-10-10.

### lesson/dp-n-queens

Places one queen per row, scans every column, checks/updates/restores conflict sets and counts all completions. With rows downward and columns rightward, row-col identifies backslash diagonals and row+col slash diagonals; all prior swapped descriptions fixed. O(N*N!) is a conservative expected-hashing scalar bound including column scans, not a claim of N! solutions. O(N) entries/frames excludes growing count/index bits; n=0 extends to one empty board and negative n is outside contract. Actual n=4 has seventeen bt calls, sixty candidate checks and two solutions. Column/diagonal sets and count are visible; n0..4 counts verified.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [Stanford CS106B handout 19](https://see.stanford.edu/materials/icspacs106b/H19-RecBacktrackExamples.pdf) — The venerable 8-Queens, solve/place/remove and safety checks. Checked: Backtracking chooses a safe square, explores the next row/column, and restores the board after return. Convention: Source chooses one queen per column and stops at the first solution; app transposes to one per row, counts every solution, and stores diagonal integer keys rather than scanning a board. Accessed 2026-10-10.
- [LeetCode: N-Queens II](https://leetcode.com/problems/n-queens-ii/description/) — Problem definition, examples and constraints. Checked: Count nonattacking full queen placements; n=4 gives 2 and n=1 gives 1. Convention: Original n≥1; app extends n=0 to one empty placement. Accessed 2026-10-10.
- [Stanford CS106B: recursive backtracking](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1258/lectures/11-backtracking1/) — Choose/explore/unchoose, subsets and string-by-value notes. Checked: Mutable shared paths must be restored for siblings; by-value strings need no explicit undo; output copies contribute to subset enumeration cost. Convention: Python shared-list append/pop is paired; immutable prefix strings remain in separate live frames. Accessed 2026-10-10.

### pattern/backtracking

Reviewed all clues, naive baseline, conditions, alternatives, counterexamples, walkthrough, every line, bindings, complexity and effective exercises. Choose/explore/undo applies to shared mutation; by-value immutable prefixes may retain extra storage. Power-set enumeration has no invalid subsets to prune, so pruning is not credited with reducing required output. The shown shared-path version uses O(n) working slots and O((n+1)2^n) output-sensitive work. Distinct values are required unless duplicate-skipping is added. Scalar DP aggregation alone cannot return every explicit object, although DP can guide later enumeration. Mask-set and alias oracles verify walkthrough.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [Stanford CS106B: recursive backtracking](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1258/lectures/11-backtracking1/) — Choose/explore/unchoose, subsets and string-by-value notes. Checked: Mutable shared paths must be restored for siblings; by-value strings need no explicit undo; output copies contribute to subset enumeration cost. Convention: Python shared-list append/pop is paired; immutable prefix strings remain in separate live frames. Accessed 2026-10-10.
- [Stanford CS106B handout 19](https://see.stanford.edu/materials/icspacs106b/H19-RecBacktrackExamples.pdf) — Exhaustive permutation/subset patterns and first-solution backtracking. Checked: Shared choice state must be restored; exhaustive generation and first-solution search have different stopping rules. Accessed 2026-10-10.

### pattern/dynamic-programming

Modern DP includes both top-down memoization and bottom-up tabulation; requires a correct sufficient state, base values, recurrence and acyclic evaluation order. Reusing states does not automatically make an exponential or pseudo-polynomial state space polynomial. Hashable arguments and pure/stable result semantics differ from a blanket immutable requirement. This manual memo example leaves base cases uncached: fib(10) has nineteen helper calls including three base calls and nine memo writes; naive version has177. Fibonacci storage has O(n) scalar entries but Theta(n^2) result bits. Enumeration recognition now accepts backtracking, with DP augmentation explained. Actual values/frames/cache writes verified.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [MIT 6.006 lecture 15: dynamic programming](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/9eb3e9a51a7b5b60b0f67c2277f8b0ee_MIT6_006S20_lec15.pdf) — SRTBOT; Fibonacci; memoization and bottom-up evaluation. Checked: A complete state, acyclic dependency order, base cases and correct recurrence justify DP; runtime counts states and nonrecursive transition work. Both memoization and tabulation are dynamic programming; Fibonacci is linear in scalar additions but big-integer additions grow with the index. Convention: F(0)=0, F(1)=1. Displayed functions exclude demo literal construction and printing. Accessed 2026-10-10.
- [Python 3.14 glossary](https://docs.python.org/3.14/glossary.html#term-hashable) — hashable. Checked: Hashability means stable hash and compatible equality, not merely immutability. Accessed 2026-10-10.
- [Runestone: dynamic programming](https://runestone.academy/ns/books/published/pythonds3/Recursion/DynamicProgramming.html) — Memoization, tabulation and reconstruction. Checked: Reuse stored answers and compute dependencies before dependents. Convention: The app adopts the broader MIT/Python convention including top-down memoization as DP. Accessed 2026-10-10.

### pattern/knapsack

Equal partition uses dp[s] for EXACT reachability, unlike at-most-capacity maximum value. A descending one-row sweep retains the previous item layer and enforces one use per element. App extends the original positive-input problem to nonnegative values and empty input, both valid; negative inputs remain outside contract. Sum/allocation/loops cost O((n+1)(C+1)) including zero capacity, while odd totals return after the sum. Sample target11 performs26 capacity updates, not44. An ascending reusable-coin min recurrence may change optimal counts or reachability, not simply undercount. Exhaustive subset masks verify empty/zero/odd/duplicate/sample cases.

- [Python 3.14 numeric types](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — Numeric Types — int, float, complex. Checked: Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage. Convention: Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate. Accessed 2026-10-10.
- [MIT 6.006 lecture 18](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/mit6_006s20_lec18.pdf) — Subset sum; take/skip states; numeric pseudo-polynomial range. Checked: Subset-sum can use an item/target recurrence; numeric target complexity is pseudo-polynomial. Convention: App compresses previous-item states using a descending sum loop; zeros and empty input are supported extensions. Accessed 2026-10-10.
- [LeetCode: Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/description/) — Problem definition, examples and constraints. Checked: Equal partition is subset-sum to half the total; each position is used at most once. Convention: Original values are positive; app also supports zeros and empty input. Accessed 2026-10-10.
- [University lecture: 0/1 knapsack](https://webpages.charlotte.edu/rbunescu/courses/ou/cs4040/lecture16.pdf) — Take/skip recurrence and capacity layers. Checked: Previous-item states enforce at-most-once use. Accessed 2026-10-10.
