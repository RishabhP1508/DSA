# FU-1 / FU-2 authored application review

Reviewer: Codex delegated agent. Date: 2026-10-10. Scope: two new lessons,
their four original local exercises, dedicated runtime/oracle/renderer checks,
and an integration proposal. Registry, shared exercise maps, coverage, Notion
mapping, evidence and the semantic ledger were not edited by this agent.

This is an actual per-item technical review, not a declaration that machine
checks constitute human signoff. Both assessment records are in
`codex-fu12-assessments.json` and are tied to the current content hash.

## Task Scheduler

The new lesson constructs an optimal timeline rather than only returning a
duration. Its real function locals are the eligible negative-count heap,
cooldown release queue, completed timeline and current slot. The example is
original: `AAABBC`, cooldown 2, yielding
`['A','B','C','A','B',None,'A']` and 7 slots.

The stated domain is a finite reusable sequence of single uppercase A-Z labels;
all tasks are initially available, reorderable, and last one slot. A common
nonnegative integer cooldown is required and validated. Empty input is a
documented extension. After use at zero-based slot t, release is t+c+1; the
queue is FIFO because c is common and execution times increase. The loop uses
ready OR waiting, so an empty ready heap with unfinished cooling work causes
an idle rather than premature completion. Labels with equal priorities are
compared alphabetically, a deterministic representation choice rather than a
claim that heaps are globally sorted or stable.

The duration bound is read from the consulted teaching source, with its empty
case separately stated. The actual implementation intentionally walks and
returns every idle slot. Its expected/amortized function time is therefore
O(N log(K+1)+T), working storage O(K), and output O(T). Constant K<=26 gives
O(N+T), not a bound ignoring the actual output duration. Printing and trace
storage are outside the function analysis. The coding exercise permits any
valid optimal tie ordering. Recognition accepts a label scan selecting the
same eligible priority; a duration formula alone does not satisfy timeline
output. The model's tests check multiplicity, legal gaps, optimal known
durations and input preservation rather than one exact arrangement.

Read every field, every displayed code line and explanation, both prompts and
models, all twelve authored hint stages, every recognition choice/reason and
counterexample, the summary/structured costs, bindings and checkpoint. No
learner-facing field was signed off unread.

## Meeting Rooms II

The new lesson counts rooms for all meetings. It is an active-meeting heap
variant, not the retained allocated-room heap variant. It sorts a copy by
start, removes every end<=start, pushes the next end, and records a peak. The
original shuffled sample produces active history [1,2,2,1], peak 2 and final
heap [25]. Returning the final active heap length would be wrong; the valid
one-pop variant's different invariant is explained explicitly.

Half-open [start,end) means an end frees a room before a start at the same
time. All meetings must be held and cannot move; duplicate intervals require
separate capacity. The local integer-time contract allows negative times,
requires start<end and a reusable sequence of two-item pairs, and validates
noninteger or nonpositive durations. Malformed pair shape violates that stated
precondition. Empty input returns 0. A direct overlap lower bound plus
start-order reuse establishes optimality. The function returns a scalar count,
not room identities or a schedule assigning them.

The function's O(n log(n+1)) worst time includes validation, adaptive sorting,
n pushes and at most n total pops; the nested loop does not create n pops per
start. The copied order, sort workspace and displayed active-count history are
O(n) auxiliary storage; the active heap is O(R), R<=n. Input pairs and scalar
output are stated separately. Recognition accepts a correctly tied event
sweep and explains why merging ranges or selecting a subset solves a different
output problem. Empty/single, equal-time reuse, duplicates, nested meetings,
negative/shuffled input and all-expired heap cases are all exercised.

Read every field, all displayed lines and explanations, both models/prompts,
all twelve hints, all recognition alternatives and rejected reasons, all
complexity rows/derivation lines, bindings and prediction timing.

## Sources actually consulted

All access dates are 2026-10-10. Exact lesson source records, claims and
conventions are mirrored in `codex-fu12-reference-mirror.json` for the parent
to add to the shared reference directory.

- [LeetCode Task Scheduler](https://leetcode.com/problems/task-scheduler/):
  read the original description, examples and constraints. Unit task length,
  reorderable A-Z labels and a common cooldown define the contract. The local
  timeline output and empty/unbounded-cooldown extensions are explicit.
- [NeetCode Task Scheduler](https://neetcode.io/solutions/task-scheduler):
  read prerequisites, brute-force intuition, max-heap intuition/Python,
  greedy filling and the math section. Compare ready/count priority and
  cooldown release conventions. The source's count-only time-jump variant
  does not incur the local function's cost of materializing all T slots.
- [Python 3.14 heapq](https://docs.python.org/3.14/library/heapq.html):
  read the invariant, heapify/push/pop and tuple-priority notes. The unqualified
  min-heap API and portable negative-priority representation are deliberate;
  the native Python 3.14 max-heap API is not denied. All used APIs were run on
  the actual bundled CPython 3.14.2.
- [Python 3.14 collections](https://docs.python.org/3.14/library/collections.html):
  read Counter and deque endpoint behavior for frequency storage and FIFO
  releases.
- [NeetCode Meeting Rooms II](https://neetcode.io/solutions/meeting-rooms-ii):
  read the accessible full description, min-heap variant, sweep-line variant
  and reuse/final-length pitfalls. Same-time reuse agrees with the app's
  <= expiration. The source's one-pop algorithm uses allocated-room entries;
  the app's all-expired active heap must retain its maximum separately.
- [BU CS330 lecture](https://cs-people.bu.edu/januario/teaching/cs330/su23/slides/CS330-Lec06-with-notes.pdf):
  read PDF pages 17-21 and 28-36 for partitioning, room-finish priorities,
  asymptotic cost, depth lower bound and start-order correctness. The slides'
  diagram uses open intervals and their helper uses strict > compatibility;
  the app explicitly adopts half-open endpoints and <= release based on the
  meeting problem's contract. A key update is inconsistently called
  DECREASE-KEY there; the local implementation instead uses documented
  pop/push operations. The independent lower-bound reasoning does not depend
  on that typo.
- [USFCA Heap Visualization](https://www.cs.usfca.edu/~galles/visualization/Heap.html):
  actually operated and inspected insert 15, insert 10 and Remove Smallest,
  using Skip Forward after each. The array/tree root changed from 10 to 15
  after removal. The reference array includes a one-based sentinel; this
  app uses the Python zero-based list without a sentinel. The local diagrams
  are rendered from recorded heap state, not a copied source image.

The [original Meeting Rooms II URL](https://leetcode.com/problems/meeting-rooms-ii/)
showed an unlock/subscription page, so no claim is made that its problem
description was read. Princeton's Greedy Algorithms I PDF URLs failed to fetch
(403/internal errors); the accessible BU lecture was fetched and read instead.
BU PDF screenshots also failed, so no visual inspection of those diagrams is
claimed. Actual USFCA heap UI inspection supplies the chosen heap visual
reference. These access limitations leave no unresolved implementation fact.

All local prose, code, examples and exercises are original. No diagram,
article, code block or external test suite was redistributed.

## Repeatable checks and practical limits

Run from the repository using Node with the supplied TypeScript resolver:

```text
node --experimental-strip-types --import ./scripts/lib/ts-register.mjs docs/reviews/codex-fu12-verify.mjs
node node_modules/vitest/vitest.mjs run src/visualizers/codex-fu12-applications.real.test.tsx
node --experimental-strip-types --import ./scripts/lib/ts-register.mjs docs/reviews/codex-fu12-packets.mjs
node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --module esnext --moduleResolution bundler --target es2022 --skipLibCheck src/content/lessons/task-scheduler.ts src/content/lessons/meeting-rooms-ii.ts
```

The verifier uses the real bundled runtime/tracer for samples, coding models,
all three authored faulty variants per model, empty/starters and actual
checkpoint state. It checks all displayed lines have authored explanations
and that every observed line event is marked executable. Both recognition
blocks pass structural validation; all 32 approach/reason pairs are checked.
Before-append and before-pop snapshots are tested independently of the prose.

An independent shortest-path oracle explores every eligible task choice AND
optional idle transitions, without the priority heap or duration formula.
Counts 0..3 for three labels and cooldowns 0..3 yield 256 instances; returned
timelines preserve multiplicity, satisfy cooldowns and match the optimum.
The room oracle counts literal s<=t<e containment at each input endpoint on
462 multisets of 0..5 meetings from six representative intervals. This
checks negative times, nesting, ties, duplicate multiplicity and input
preservation without heap/sort state transitions.

The focused Vitest file has three passing tests. It renders every new binding
from an actual trace, including negative-count tuples, waiting releases,
completed timeline slots, sorted meeting rows, active ends, history and the
retained peak. It confirms event 83 is before the slot-5 idle append and event
43 is before the equal-time end-10 release. The existing missing Pyodide source
map warning is unrelated to execution and did not cause a test failure.
Both new lesson files also pass a focused strict TypeScript check. The first
command needed the TypeScript 6 --ignoreConfig option when explicit files were
supplied; it was rerun with that option and passed without emitting files.

These are semantic review, bounded independent oracles, bundled-Python checks
and real-trace server-rendered SVG checks. They do not establish browser-worker
transport or pixel layout. Parent owns browser integration, aggregate checks,
registry/shared-map/manifest/reference changes and final evidence generation.
No tests, source inspection or packet here silently grants verified coverage.

No global content files, shared helpers, registry or Git staging/commits were
changed. Proposed coverage IDs are `heaps/task-scheduler` and
`sorting/meeting-rooms-ii`. The complete concrete integration payload is
`codex-fu12-central-integration.json`.
