# R0 — Baseline, project instructions, and verification foundation

**Type:** Feature spec. **Purpose:** stop incorrect completion claims from
steering later work; establish trustworthy, cross-platform verification.

## Requirements (testable)

- **R0-REQ-1 (inspection).** The repository's real state (branch, commit, counts,
  runtime versions, existing tests) and which audit findings still reproduce
  SHALL be recorded before any repair begins. → `findings.md`.
- **R0-REQ-2 (honest docs).** README, `AGENTS.md`, and the handoff steering SHALL
  NOT assert "only Phase 5 remains", "130/130 verified = full acceptance",
  "a build proves the UI", or "a Node tracer test proves the browser path", and
  SHALL NOT instruct contributors to preserve unsafe `repr` inspection. Research,
  curriculum-coverage, and offline requirements SHALL be retained.
- **R0-REQ-3 (always-on milestone rule).** An always-included steering rule SHALL
  state: functional repair precedes UI redesign; completion requires evidence
  tied to requirements; requested coverage is preserved; missing work is reported.
- **R0-REQ-4 (cross-platform verification).** WHEN a contributor runs the
  verification commands on Windows, macOS, or Linux with only Node installed,
  THE SYSTEM SHALL run them without editing source (no `nvm`/`pyenv`/bash
  assumptions; dynamic imports use file URLs).
- **R0-REQ-5 (no silent skips).** WHEN a required lesson/pattern is missing,
  unregistered, malformed, or unpar. able, THE verification SHALL FAIL
  (non-zero exit) rather than skip it. Counts SHALL come from the real registry,
  so no item can silently disappear.
- **R0-REQ-6 (test layers).** Vitest (+ RTL), fast-check, Playwright, and the
  bundled-Pyodide checks SHALL be available behind stable npm commands
  (`test:unit`, `test:python`, `test:curriculum`, `test:exercises`,
  `test:browser`, `check:all`).
- **R0-REQ-7 (evidence discipline).** Each layer's `verification.md` SHALL state
  what it proves and what it does NOT prove; a passing build/sample output is not
  claimed as proof of UI, visualization, complexity, or grader correctness.

## Acceptance (from plan §R0)

1. Verification commands run cross-platform without source adjustments.
2. Existing valid sample-output checks still pass.
3. All known gaps are tracked with repair IDs.
4. No required item can silently disappear from test counts.
5. Documentation distinguishes implemented, tested, and unfinished work.
