# R5 — Concrete curriculum follow-ups (teaching-content gaps)

These are the practice problems from the Notion syllabus that the audit found
have **no lesson teaching their technique** — only a prerequisite. They are
recorded here as concrete, actionable curriculum work to complete **before final
release**. They are teaching-content gaps: **R6's exercise work alone will NOT
fill them** (R6 makes existing exercises runnable and adds grading; it does not
author new conceptual lessons for a technique the curriculum does not yet teach).

Both remain `status: "unresolved"` in `src/content/notion-practice.ts` (empty
`coverageIds`/`mappedIds`) and are enforced as unresolved by
`notion-practice.test.ts`. They are NOT surfaced as external practice on any
coverage subtopic.

## FU-1 — Task Scheduler (greedy cooldown scheduling)
- **Notion topic:** Heaps. **Problem:** https://leetcode.com/problems/task-scheduler/
- **Missing technique:** greedy scheduling with a **cooldown/idle window** —
  repeatedly run the highest-remaining-count task, decrement it, and requeue it
  only after `n` intervals (or compute idle slots directly from the maximum
  frequency: `(maxCount - 1) * (n + 1) + (# tasks tied at maxCount)`).
- **What exists (prerequisite only):** `top-k` / `top-k-heap` teach a bounded
  max-heap of counts. That is a building block, not the cooldown scheduling.
- **Proposed follow-up:** add a Heaps-area lesson (e.g. `heap-scheduling` /
  "greedy scheduling with cooldown") with a worked example, the idle-slot
  formula and its correctness condition (why the most-frequent task dictates the
  schedule length), a visual of the cooldown windows, and an exercise. Then map
  Task Scheduler to it (`status: "mapped"`, `coverageIds: ["heaps/..."]`).
- **Acceptance:** `notion-practice.test.ts` updated so Task Scheduler is `mapped`
  to the new lesson; the new lesson passes the full example-model contract and is
  added to the review ledger.

## FU-2 — Meeting Rooms II (minimum concurrent resources)
- **Notion topic:** Sorting. **Problem:** https://leetcode.com/problems/meeting-rooms-ii/
- **Missing technique:** count **maximum concurrent overlaps** — either a
  min-heap of end times (pop when the next start ≥ the earliest end, else push a
  new room) or a sorted start/end **sweep** incrementing/decrementing a live
  counter and tracking its peak.
- **What exists (prerequisite only):** `interval-sorting` /
  `greedy-interval-scheduling` teach sorting intervals and the earliest-END
  greedy for MAX NON-OVERLAPPING intervals — the opposite objective; it does not
  teach concurrent-overlap counting.
- **Proposed follow-up:** add an Intervals/Sorting lesson (e.g.
  `interval-overlap-count` / "counting concurrent intervals") with the heap-of-
  ends and the sweep-line methods, the peak-concurrency correctness argument, a
  timeline visual, and an exercise. Then map Meeting Rooms II to it.
- **Acceptance:** `notion-practice.test.ts` updated so Meeting Rooms II is
  `mapped` to the new lesson; the new lesson passes the example-model contract and
  is added to the review ledger.

## Tracking
Until FU-1 and FU-2 are done, the R5.6 reconciliation reports **77 mapped + 2
unresolved** (of 79 occurrences). Final release must not claim full external-
practice coverage while these two remain unresolved.
