# Delegated curriculum review B4-A: 15 items

Reviewer: `/root/review_sequences_heaps`, a Codex subagent explicitly delegated technical review by the user through the coordinating agent. Review date: 2026-10-10 UTC. This is a semantic assessment by the delegated reviewer, not a claim of human review or a machine-generated approval. The assessment covers the final authored fields and the 36 effective hint/recognition replacements in `codex-b4-shared-patches.json`. Root applied those replacements; a fresh real-registry import confirms all 36 live fields equal the patch values. Evidence generation follows that integrated state.

For every lesson below I read the explanation, vocabulary, purpose/operations/uses/tradeoffs/mistakes/edge cases, prerequisites, displayed Python, every line explanation and execution flag, bindings and overlays, predictions, experiments, exercise prompts/starters/models/tests, effective progressive hints and recognition grading, complexity rows/analysis/derivations/counters, review text, and references. The item assessments below explain the substantive judgments; the focused tests support them but do not establish semantic correctness by themselves.

The real runtime is the app's bundled Pyodide 314.0.7 / CPython 3.14.2, using the actual tracer via `scripts/lib/pyodide-harness.mjs`. `scripts/test-codex-b4.mjs` performs 118 grouped checks across both packets, including all 29 real sample traces, exact outputs, explanation line inventory, live binding resolution, exercise acceptance/rejection, recognition reason pairs, and independent boundary oracles. `src/visualizers/codex-b4-linear-heap.real.test.tsx` renders real trace states; its four cases pass after the shared backward-link correction. These are component render checks, not a complete in-browser worker/UI validation.

## 1. lesson:linked-list-traversal

**Assessment: reviewed and corrected.** The node/head/next vocabulary and traversal purpose agree with the code. The main semantic correction is access at zero-based index k: k links plus reading the selected node costs O(k+1), with valid 0<=k<n; the one-based kth node is k-1 links away. O(1) deletion in a singly list requires its predecessor, and deleting the tail by head reference alone requires a walk. Prerequisites now introduce classes and reference mutation before node fields are used.

The 14 displayed lines and their explanations match construction plus traversal. The complexity panel is scoped to the traversal operation, not to allocating the demonstration nodes and printing. The visit counter now counts the body rather than the final failed guard. Head/current binding and object identity follow the actual trace. Empty and singleton traversal are covered by the exercise model; its collect-values task must return a list, so the effective hints no longer tell the learner merely to print. Value duplication is not a traversal problem. Prediction, experiments and review make the same operation/storage distinction. No unresolved factual question.

**Consulted sources:** [ODS SLList](https://opendatastructures.org/ods-python/3_1_SLList_Singly_Linked_Li.html), section 3.1 stack/queue operations and Figure 3.1; [Cornell lecture 15](https://courses.cis.cornell.edu/courses/cs2110/2026fa/lectures/lec15/), LinkedStack/head removal; [VisuAlgo list](https://visualgo.net/en/list), textual list/stack/queue mode descriptions. Source diagrams for changing links were inspected in Stanford's slides, described below. App convention: Python references, None, and zero-based access.

## 2. lesson:linked-list-slow-fast

**Assessment: reviewed and corrected.** Both pointers begin at the head; slow moves one next link and fast two. For n nodes, the loop executes floor(n/2) times and returns the second middle for even n. The usual unsafe guard `fast.next` can fail on odd lengths, including a singleton; even-length behavior does not establish its safety. The corrected prediction states this parity dependence instead of claiming all lengths crash. The kth-from-end adaptation is different: first create a gap of k, then move both pointers one link each; it does not keep the 1:2 speeds.

The 19 lines, guard ordering, return convention, pointer overlays, middle prediction and experiments agree. Function scope gives O(n) time/O(1) auxiliary references; demonstration allocation is separate. The exercise repair and effective hints require checking fast before fast.next, and recognition distinguishes cycle/middle techniques from random array indexing. Tests cover n=0..8, both parities and the unsafe guard's actual exception boundary. No unresolved factual question.

**Consulted sources:** [Floyd algorithm](https://cp-algorithms.com/others/tortoise_and_hare.html), steps 1–2 and linked-pointer guard; [ODS SLList](https://opendatastructures.org/ods-python/3_1_SLList_Singly_Linked_Li.html), retained next links. Source uses C++ pointer equality; app uses Python node identity and chooses the second even middle.

## 3. lesson:linked-list-cycle-detection

**Assessment: reviewed and corrected.** Detection and entry recovery are distinct phases. A meeting proves a cycle; after resetting one pointer to the head, moving both one link at a time reaches its entry. Comparisons must use `is` for node identity: repeated values are allowed, and customizable equality is not a substitute. The visited-identity-set alternative uses expected O(n) hashing time/O(n) storage; it is not the constant-storage Floyd method.

The 36 lines create the illustrated cycle, detect a meeting, recover the entry, and explain every pointer assignment. Bindings show the retained cycle without infinite drawing. The complexity is scoped to detection/entry rather than sample construction. Predictions, recognition models, progressive hints and experiments now distinguish identity from value. The oracle checks acyclic duplicate-valued lists and every possible cycle entry for sizes through 8, including self-loops. The circular component render check terminates on the actual repeated object ID. No unresolved factual question.

**Consulted sources:** [Floyd algorithm](https://cp-algorithms.com/others/tortoise_and_hare.html), detection, entry recovery and proof; [Python built-in types](https://docs.python.org/3.14/builtins/stdtypes.html), identity/equality; [VisuAlgo list](https://visualgo.net/en/list), textual circular-list description. Python uses `is`, not source-language pointer syntax or equal stored values.

## 4. lesson:linked-list-reversal

**Assessment: reviewed and corrected.** Saving the original successor before overwriting curr.next is the required dependency. Rewiring preserves each node's identity and value association. Returning prev supplies the new head; the caller's old head still refers to the original first node, now the tail. Iterative reversal is O(n) time/O(1) auxiliary references; recursive reversal adds O(n) call frames.

All 26 lines and explanations agree with the saved-successor order. The original single-head visualization hid the reversed prefix after disconnection; separate head, prev and curr roots now display the actual retained components. A real render test finds a state with two reversed nodes, three unprocessed nodes and the old head's one-node chain. Prediction, experiments and practice preserve the same mutation/return contract. The exhaustive n=0..8 oracle checks reverse order, node identities and unchanged values. Source conventions and operation scope are explicit. No unresolved factual question.

**Consulted sources:** [ODS SLList](https://opendatastructures.org/ods-python/3_1_SLList_Singly_Linked_Li.html), node references; [Stanford full slides](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1252/lectures/21-lists2/slides), slides 4–9 retaining links before mutation; [VisuAlgo list](https://visualgo.net/en/list), textual mode descriptions. Stanford's prepend step-2 image was visually inspected: new.next already reaches old head while head still reaches the old node. C++ addresses/nullptr become Python object IDs/None; no C++ delete is copied.

## 5. lesson:linked-list-middle

**Assessment: reviewed and corrected.** A retained singly linked chain supports slow/fast traversal with O(1) auxiliary references. It does not make a consumable one-pass stream rewindable; that misleading recognition/prose claim was removed. Counting length and then walking halfway is also O(n) time/O(1) space when another traversal is allowed. The preference for slow/fast is its single traversal, not exclusive constant storage. Both displayed methods return the second middle for even lengths.

The 34 lines, all explanations, guard, parity prediction, retained-node bindings and experiments agree. Counters count the actual fast-loop/count-loop bodies, not unrelated assignments. The function scope separates input construction. Effective recognition accepts the count baseline under its stated extra-pass condition; hints and model no longer describe nodes as consumed. Tests cover empty, singleton, odd and even chains and actual unsafe-guard parity behavior. No unresolved factual question.

**Consulted sources:** [Floyd steps](https://cp-algorithms.com/others/tortoise_and_hare.html), 1:2 pointer advancement; [ODS SLList](https://opendatastructures.org/ods-python/3_1_SLList_Singly_Linked_Li.html), retained next-link representation. App convention explicitly retains the chain and chooses the second even middle.

## 6. lesson:linked-list-dummy-nodes

**Assessment: reviewed and corrected.** A dummy predecessor removes the separate real-head deletion branch. The scan advances its predecessor only when retaining the successor; deleting consecutive matching nodes must keep the predecessor in place. The dummy is one temporary node, so auxiliary storage is O(1), not literally zero allocations. It is not part of the returned data. When every real node is removed, the return is None; `to_list` displays that result as []—these are different values at different layers.

The 33 lines, return contract, bindings, prediction and experiment instructions match that distinction. A chronological claim that an upcoming merge had already been taught was removed. Effective hints and recognition explain the sentinel's role without conflating Python None with a printed list. All binary-valued lists through length 6 were checked for removal, consecutive hits and retained node identity; exercise model and deliberately wrong variants are checked by actual assertions. No unresolved factual question.

**Consulted sources:** [ODS DLList](https://opendatastructures.org/ods-python/3_2_DLList_Doubly_Linked_Li.html), section 3.2 dummy sentinel and constant-time local insertion/removal; [ODS SLList](https://opendatastructures.org/ods-python/3_1_SLList_Singly_Linked_Li.html), head updates. Source DLList uses a circular doubly sentinel; the app uses a temporary singly predecessor for this algorithm.

## 7. lesson:linked-list-merging

**Assessment: reviewed and corrected.** Correct relinking requires sorted, acyclic, node-disjoint inputs. Sharing a suffix is unsafe for this destructive merge; value equality is allowed. The <= branch takes the left list first on ties and retains that stable source order. After one input is exhausted, attaching the other chain does not walk its remainder. The loop therefore examines at most n+m nodes, with O(1) best time for an empty input and O(n+m) worst time.

All 35 lines and explanations now distinguish comparison splices from the final attachment; the sample performs five loop splices, not six. Dummy/tail plus both source roots preserve visibility during rewiring; the final result root is also bound. Predictions, experiments, starter/model, effective hints and recognition include the node-disjoint precondition and retained values. Oracles check empty aliases, negatives, duplicates, exact node set and left-before-right tie order. Auxiliary storage is one dummy plus references; output reuses the input nodes. No unresolved factual question.

**Consulted sources:** [ODS SLList](https://opendatastructures.org/ods-python/3_1_SLList_Singly_Linked_Li.html), next links/head-tail operations; [Stanford slides](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1252/lectures/21-lists2/slides), retained successor and tail attachment diagrams; [VisuAlgo list](https://visualgo.net/en/list), textual chain modes. The merge invariant is checked directly: emitted prefix sorted, next choice minimum of two fronts, final untouched suffix already sorted.

## 8. lesson:linked-list-pointer-manipulation

**Assessment: reviewed and corrected.** In swapping an adjacent pair, `first.next = second.next` must preserve the original remainder before `second.next = first` destroys that link. Attaching the predecessor to second early is safe once first/second references have been saved. The old prediction incorrectly treated every deviation from the displayed order as corrupting the chain; it now states the real dependency. Swapping values preserves object identities but changes which value is associated with each node; that is the relevant contrast to relinking.

The 33 lines, pair/end guard, dummy return and all explanations match the code. Bindings for dummy, first and second keep disconnected pieces visible. Predictions, experiments, recognition and effective hints use the saved-reference argument. Complexity is O(n) function time/O(1) extra storage, with an odd final node retained. Tests check n=0..8, exact node/value associations and a correct alternative predecessor-first order, so the teaching does not falsely reject it. No unresolved factual question.

**Consulted sources:** [Stanford slides](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1252/lectures/21-lists2/slides), slides 4–9 mutation with retained references; [Python identity](https://docs.python.org/3.14/builtins/stdtypes.html); [VisuAlgo list](https://visualgo.net/en/list), textual linked modes. App follows Python reference identity; source-language address arithmetic/delete is not part of the task.

## 9. lesson:linked-list-variants

**Assessment: reviewed and corrected.** Singly/doubly describes available links; circular/null-terminated describes endpoint organization. These are independent choices, not mutually exclusive list categories. Circular construction now returns None before dereferencing an empty head; singleton circular construction points next to itself. Six displayed visits of a three-node ring mean two circuits, not six circuits. The append helper assumes a fresh detached node and returns the proper endpoint reference.

The 60 lines include the added empty guard, with every explanation/derivation shifted consistently. Whole-program storage includes allocated nodes and collected forward/backward/ring output, so it is O(n). Added head/node bindings expose construction states before the global dh result exists. A real trace initially found the shared renderer inventing a backward arrow after tail.next but before node.prev; root corrected it to read actual prev fields, and the regression now passes. The actual circular terminal also renders correctly. Exercises/effective hints and predictions distinguish mutation from returned endpoint values. Empty/singleton/forward/backward/reciprocal-link oracles pass. No unresolved algorithm question; complete browser playback remains part of root integration.

**Consulted sources:** [ODS SLList](https://opendatastructures.org/ods-python/3_1_SLList_Singly_Linked_Li.html), singly representation; [ODS DLList](https://opendatastructures.org/ods-python/3_2_DLList_Doubly_Linked_Li.html), prev/next and circular dummy representation; [VisuAlgo list](https://visualgo.net/en/list), textual modes. Stanford's doubly-linked image was actually inspected: reciprocal arrows join the recorded neighbors, first.prev and last.next are null. The app's intermediate states must preserve this actual-field rule even before invariants are restored.

## 10. lesson:linked-list-deques

**Assessment: reviewed and corrected.** A deque supports efficient operations at both ends, with distinct FIFO/LIFO uses. `collections.deque` is an API choice, not a promise that this lesson implements a hand-written doubly list. A one-step rotate is O(1); arbitrary rotation is not always constant-time. Bounded append drops from the opposite end, whereas inserting into a full bounded deque raises IndexError. Empty pop/popleft also raises IndexError; the dequeue exercise states a nonempty input contract.

The 16 lines, actual deque binding, operation-scope complexity, predictions and experiments match Python 3.14. The O(n) cost of list(q) demonstration output is separated from the end operation. Effective coding hints now explain the returned tuple/state rather than assuming a named local parameter. The unverified fixed-block implementation claim was removed after the versioned internal-source link failed. Real probes check FIFO/LIFO removal, bounded evictions, full insert error, rotation and empty removal. Exercise models/wrong attempts pass the intended assertion boundaries. No unresolved factual question.

**Consulted sources:** [Python 3.14 deque](https://docs.python.org/3.14/library/collections.html#collections.deque), append/pop, rotate, maxlen and insert definitions; [Cornell deque interface](https://courses.cis.cornell.edu/courses/cs2110/2026fa/lectures/lec15/). CPython `_collectionsmodule.c` could not be retrieved; no unsupported internal-block claim remains.

## 11. lesson:stack-queue-operations

**Assessment: reviewed and corrected.** LIFO uses a Python list's right end; FIFO uses deque append/popleft. Both list append and pop are O(1) amortized, while an individual resize may be O(n). Reading the top is O(1). Repeated list.pop(0) while growing and draining a large queue can produce O(n²) total work; “millions of operations” alone does not imply that bound when occupancy stays small. Effective recognition now states the queue-size condition.

All eight sample lines and explanations, stack/queue bindings, predictions and experiments follow the actual operations. The complexity scope is one operation; a sequence of n list-end updates has O(n) total resizing cost. The model implementations and intentionally incorrect FIFO/LIFO variants are exercised through the real tracer. Progressive hints name the correct endpoint and return contract. No unresolved factual question.

**Consulted sources:** [Runestone stack implementation](https://runestone.academy/ns/books/published/pythonds3/BasicDS/ImplementingaStackinPython.html), section 3.5; [CPython 3.14.2 listobject.c](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c), list_resize/append/pop; [Python deque](https://docs.python.org/3.14/library/collections.html#collections.deque). Runestone's simplified O(1) list-end description is qualified by the implementation's resizing behavior.

## 12. lesson:monotonic-stack

**Assessment: reviewed and corrected.** Strict next-greater requires `<` when resolving older values, so equal values remain and stack values are non-increasing. Each index is pushed once and popped at most once, not necessarily popped once. A single arriving value may trigger many pops; the O(n) bound is total/amortized over the scan.

The lesson now contains two actual runnable functions, 32 explained lines. Histogram heights are nonnegative/unit-width. Its non-decreasing index stack pops taller heights on a shorter arrival; after popping, width is i-left-1. A copied zero sentinel closes remaining positive bars; zeros can remain because their area is zero. Ties stay, and an earlier equal bar eventually supplies the widest candidate. At i=4 in [2,1,5,6,2,3], heights6 and5 yield areas6 and10. The new arrays/current-index binding supports real playback. Expected output was recaptured with the additional area10 line. Original histogram practice, hints and experiments now refer to actual code; [1,2,3] is a meaningful missing-flush witness. Independent all-interval and next-greater oracles cover every ternary sequence through length6, including empty, zeros, duplicates and monotone cases. No unresolved factual question.

**Consulted sources:** [Cornell exercise 15.10](https://courses.cis.cornell.edu/courses/cs2110/2026fa/lectures/lec15/), next-greater; [minimum-stack/queue article](https://cp-algorithms.com/data_structures/stack_queue_modification.html), monotonic candidates; [HKOI PDF](https://assets.hkoi.org/training2019/ds-i.pdf), slides31–36 histogram left/right bounds and final flush; [original histogram problem](https://leetcode.com/problems/largest-rectangle-in-histogram/description/), unit width/constraints/examples. Cornell scans right-to-left; app scans left-to-right. HKOI stores height/left bound; app stores indices. The official diagram was visually inspected: height5 across two bars gives area10. HKOI text was read, but its browser visual rendered blank; that visual is not claimed as inspected.

## 13. lesson:parentheses-matching

**Assessment: reviewed and corrected.** Matching counts alone cannot ensure valid nesting. A closing symbol must match the most recent unmatched opening symbol, and the stack must be empty at the end. The input contract is the six bracket characters; the function does not promise general text filtering or input validation. Empty input is valid. An early impossible closing gives O(1) best time; worst time is O(n), with O(n) unmatched-opening storage.

The 15 lines, short-circuit empty check, mixed-pair lookup, returns and explanations match the LIFO invariant. Actual stack binding, prediction, experiments, recognition model/reasons and progressive hints distinguish mismatched types from unbalanced totals. Coding practice is checked with real assertions and wrong endpoint/empty-guard variants. No unresolved factual question.

**Consulted sources:** [Runestone balanced symbols](https://runestone.academy/ns/books/published/pythonds3/BasicDS/BalancedSymbolsAGeneralCase.html), section3.8 all three pair types; [Cornell exercise15.6](https://courses.cis.cornell.edu/courses/cs2110/2026fa/lectures/lec15/), mixed nesting. The app adopts six-symbol inputs and Python list-end stack semantics.

## 14. lesson:expression-evaluation

**Assessment: reviewed and corrected.** Postfix evaluation must pop the right operand first and the left second. The domain is a valid nonempty RPN token sequence with no zero divisor; the implementation is not a validator for malformed expressions. `int(a/b)` is unsafe for exact Python integers because conversion to float can round or overflow. The code now computes abs(a)//abs(b), then applies the sign, preserving exact truncation toward zero.

All 17 lines and explanations agree with the changed division. Output9 is unchanged and revalidated. Vocabulary, predictions, experiments, coding model, effective hints and recognition distinguish floor division from truncation and operand order. Complexity is O(n) only under bounded integer/token costs; arbitrary-size arithmetic has additional bit costs. Oracle cases include both sign combinations, subtraction order, values above2**60, and 400-digit operands. Those expose the original rounding/overflow bug, not just sample-output differences. No unresolved factual question.

**Consulted sources:** [Runestone postfix](https://runestone.academy/ns/books/published/pythonds3/BasicDS/InfixPrefixandPostfixExpressions.html), sections3.9.2–3.9.3 valid input and operand order; [Python numeric types](https://docs.python.org/3.14/builtins/stdtypes.html), integers, floor division and float conversion. Source division uses `/`; the app explicitly chooses an exact integer-truncation contract.

## 15. lesson:bfs-queues

**Assessment: reviewed and corrected.** FIFO removes the earliest discovered vertex, which gives distance layers for unweighted edges. Marking seen before enqueue ensures a reachable vertex enters the queue once. The displayed graph is directed; bindings now say so and show the actual deque. All neighbor labels and the start must be dictionary keys. Sets/maps are introduced as prerequisites. Swapping the FIFO for a stack does not necessarily reproduce the discovery order of recursive DFS.

The 18 lines, adjacency loop, mark-before-enqueue order, queue/output binding, predictions and experiments agree. Function time is expected O(V+E) with expected hash membership; V counts reached vertices, E reached adjacency entries, and undirected storage would list each edge twice. Collision-heavy worst hash costs are qualified separately. Storage is O(V) for seen/queue/output. Effective hints and recognition use discovery marking and FIFO distance reasoning. Independent FIFO/distance checks cover all 512 directed three-vertex graphs from all three starts, including cycles, self-loops and unreachable vertices; an absent start raises the stated KeyError. No unresolved factual question.

**Consulted sources:** [Runestone BFS](https://runestone.academy/ns/books/published/pythonds3/Graphs/ImplementingBreadthFirstSearch.html), section7.9 discovery marking, FIFO and Figures3–6; [Python deque](https://docs.python.org/3.14/library/collections.html#collections.deque). Source colors correspond to the app's seen-on-enqueue set; directed adjacency entries are the cost unit.

## Packet decision and limits

Semantic review of these 15 items is complete after the listed corrections. No unresolved algorithm or language fact remains in this packet. The reference mirror has exact URLs/sections/claims/conventions/access dates. No evidence, ledger, coverage or semantic-review flags were changed by this subagent. Shared overrides are integrated and equality checked; root must regenerate live hashes/evidence, mirror the references, and finish in-browser playback/worker checks. Actual source diagrams and component render tests are evidence for their stated scope only.

The histogram bridge was inspected directly: `notion-practice.ts:117` maps the question to `stacks/monotonic` and the monotonic-stack lesson, with width-on-pop/sentinel/experiment/exercise claims. These claims now have actual runnable implementation and local practice support. The existing bridge test checks text/mapping; the new brute-force oracle checks the actual function.
