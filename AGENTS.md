# AGENTS.md — Mandatory instructions for anyone (human or AI) authoring content

This file is **binding** for every future contributor who adds or changes
teaching content (lessons, patterns, visualizations, complexity claims, expected
results) in DSA Visual Lab. It exists because the product plan is a specification
of *required behavior* — **it is not a substitute for researching and verifying
the teaching content.**

If you only read one thing: **do not invent explanations, and do not silently
omit a requested topic.** When you cannot verify something, escalate to the user.

---

## The product in one paragraph

A fully offline, browser-based application that teaches Python, data structures,
algorithms and problem-solving patterns from zero, using plain explanations,
interactive SVG diagrams, and **real line-by-line Python execution** (a bundled
Pyodide runtime traced with `sys.settrace`). Research happens during development;
the *delivered* application is fully offline.

## The runtime you must target

- The app bundles **Pyodide 314.0.7**, which ships **CPython 3.14.2**
  (`public/pyodide/`). This is verifiable: `pyodide-lock.json` records
  `"python": "3.14.2"`.
- **All "supported API" and language-semantics claims must be validated against
  CPython 3.14**, not against your memory or an older Python. The authoritative
  validator is the **bundled Pyodide runtime** the app ships (used by the
  `npm run test:*` checks, no extra setup). A matching standalone interpreter
  (3.14.x, e.g. via `pyenv`) may be used for quick probing but is optional.
- Supported stdlib for lesson/personal code: builtins, `collections`, `heapq`,
  `bisect`, `math`, `functools`. Out of scope: third-party packages, multi-file
  projects, native filesystem/network access, concurrency.

---

## The research protocol (do this BEFORE authoring or substantially changing a topic)

1. **Consult the topic's references.** Read the actual relevant pages (see
   `docs/references.md`), not a site's homepage and not your own recollection.
2. **Check the important claims.** Verify definitions, required preconditions,
   correctness reasoning, complexity (best/average/worst, amortized where
   relevant), implementation conventions, and edge cases. **Cross-check against a
   second independent, credible source** wherever one exists.
3. **Inspect visualization examples.** Look at a suitable visual reference
   (VisuAlgo, USFCA, OpenDSA, Python Tutor) when deciding how to show changing
   state.
4. **Resolve differences.** When sources disagree, determine whether they use
   different indexing (0- vs 1-based), language versions, representations, or
   algorithm variants — and state which convention this app uses.
5. **Search further when necessary.** If the reference directory does not answer
   the question, search additional free official documentation, university
   materials, and original technical sources. **One broken or inaccessible link
   must trigger another source lookup**, never an invented answer.
6. **Validate through execution.** Run the original Python implementation on the
   3.14 runtime and confirm the diagram and explanation match its *actual*
   behavior. The `expectedOutput` field of a lesson MUST equal real output.
7. **Record the evidence.** Populate the `references` array on the lesson/pattern
   with exact URLs, the sections read, the specific claims verified, conventions
   adopted, and the access date. Mirror the entry in `docs/references.md`.
8. **Ask the user if a material gap remains.** Explain the unresolved question,
   the sources already checked, why they were insufficient, and the specific
   decision needed. Then continue independent work on other topics.

Factual corrections supported by evidence should be incorporated and documented.
Changes to the agreed **product scope** must be raised with the user, not made
unilaterally.

---

## Curriculum coverage (binding)

The required curriculum is a **coverage checklist**, tracked in
`src/content/coverage.ts` (machine-checkable) and `docs/coverage.md`
(human-readable). It is built from the Notion syllabus
(https://chocolate-candy-c79.notion.site/DSA-Topics-Patterns-and-LeetCode-Questions-3d2d8c33330f80dc9623f6b1dce29e03)
plus the agreed additional topics.

Rules:
- **Every required subtopic** gets its own `CoverageEntry`. A broad topic
  heading does NOT count as coverage of its subtopics.
- Each subtopic must map to: a detailed explanation, a working visual example +
  Python implementation, an exercise with feedback, references, and
  pattern-recognition guidance where applicable.
- Shared lessons are allowed, but each different application must be explained.
- When you author/verify a subtopic, update its entry's `status`
  (`planned → in-progress → authored → verified`) and the `lessonId`,
  `hasVisualExample`, `hasExercise`, `patternIds` fields, then regenerate
  `docs/coverage.md`.
- Map the Notion page's LeetCode questions as OPTIONAL further practice
  (`externalPractice`); still author original local exercises for the technique.
- `no requested topic silently dropped` is an acceptance criterion — the
  coverage list makes gaps visible. Do not delete entries to make it look done.

## Content authoring rules

- Every lesson follows the sequence: **simple explanation → vocabulary →
  interactive example → Python implementation → visual execution → prediction →
  experimentation → practice → review**, and covers purpose, operations, uses,
  tradeoffs, common mistakes, edge cases, and complexity.
- Explain **every displayed code line.** Executable lines participate in runtime
  playback; comments and blank lines get explanations but no invented execution
  events (`executable: false`).
- Each pattern teaches: clues, a naive baseline and its bottleneck, why the
  pattern helps, correctness conditions, how to compare alternatives,
  counterexamples/misleading clues, a complete visual Python walkthrough, and
  unlabeled recognition exercises.
- **Personal (learner) code** gets syntax explanations and descriptions of
  *observed* state changes only — never invented claims about its intent.
- Rewrite everything in your own words for beginners. Free access to a source
  does **not** grant permission to redistribute whole articles, diagrams, or
  code. Retain required notices for any intentionally reused licensed material.

## Engineering rules (execution engine)

- Execute each program in a **fresh module worker**; preserve original behavior;
  never re-evaluate expressions merely to explain them.
- Record **immutable** per-step states (frames, variables, object identities,
  references, output, returns, errors). Preserve aliases, cycles, nested objects.
- Do not invoke user-defined `__repr__`/properties during inspection where it
  could run arbitrary code or mutate state (see `src/engine/tracer.py`).
- Distinguish the *next executable line* from *completed state changes* (a `line`
  event fires before that line runs).
- Enforce limits: **10 s wall-clock, 10 000 events, 16 MB trace**. Terminate
  workers on Stop/timeout; **reject stale runs** (a cancelled run must never
  overwrite a newer result).
- Replay recorded states **without rerunning** the program. Invalidate stale
  traces and source explanations after edits.

## How to validate your work (repeatable checks)

These run on **Windows, macOS, and Linux with only Node installed** — the bundled
Pyodide provides Python, so no `pyenv`/`nvm`/system-Python setup is required.

```bash
npm run check:all        # aggregate gate (build + all content/verification layers)
# or individually:
npm run test:python      # bundled-Pyodide tracer + pipeline checks
npm run test:curriculum  # lessons + patterns load and their outputs match
npm run test:exercises   # coding-exercise model solutions pass; mistakes rejected
npm run test:unit        # TS logic / component tests
npm run test:browser     # Playwright real-browser integration
```

**What these checks do and do NOT prove.** The Node/Pyodide checks load the same
`public/pyodide` runtime and `tracer.py` the browser worker uses, which is strong
evidence for the Python path — but it is **not** proof that the in-browser worker,
the visualizations, the complexity claims, or the UI are correct. Those require
`test:browser` (Playwright) and human review. A passing build or a matching
sample output is never, by itself, evidence that a lesson is correct. Add real
execution checks (with a regression test) for each new or changed example.

## Definition of done for a topic

- Complete, researched content and working practice for the topic/pattern.
- `references` identifies the **actual pages consulted** (not homepages).
- Explanation, code, visualization, complexity claims, and `expectedOutput`
  **all agree** and match real execution.
- Prerequisite concepts are introduced before they are used.
- Edge cases handled: empty inputs, duplicates, negatives, disconnected graphs,
  violated preconditions, early returns, final statements, exceptions.
- Any unresolved factual/implementation gap is **explicitly raised with the
  user**, not hidden.
