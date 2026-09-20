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
