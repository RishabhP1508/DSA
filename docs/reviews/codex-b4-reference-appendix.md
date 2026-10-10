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

