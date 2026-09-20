# R5.6 — External practice reconciliation manifest

**Status: BLOCKED on reconciling against the live Notion syllabus.** The mapped
set below is a *conservative canonical subset*, not a verified 1:1 copy of the
Notion list. This manifest records exactly what was attempted and what remains
unresolved so the gap is honest and auditable.

## The required source and why it is inaccessible here

Required source (from the plan): the Notion syllabus
`https://chocolate-candy-c79.notion.site/DSA-Topics-Patterns-and-LeetCode-Questions-3d2d8c33330f80dc9623f6b1dce29e03`

### Access attempts (all on 2026-09-20)

1. **`web_fetch` (server HTML)** — returned a near-empty client-render shell; no
   question text extractable. (Recorded in the original R5 verification.md.)
2. **Headless browser (`agent-browser`, Chromium)** — navigated the live URL and
   waited/scrolled for client render. The page renders a **Cloudflare
   "Verify you are human" challenge** (accessibility snapshot showed
   `Iframe "Widget containing a Cloudflare security challenge"` with a
   `checkbox "Verify you are human"`; screenshot saved at
   `.kiro/artifacts/screenshots/notion-check.png`). The page body is empty
   behind the challenge — the syllabus content never loads.
3. **Notion public API** (`/api/v3/loadCachedPageChunkV2`) — returns the same
   Cloudflare challenge HTML and **HTTP 429**.

**Conclusion:** the Notion page is gated by a Cloudflare anti-bot CAPTCHA in this
environment. It cannot be enumerated by fetch, headless browser, or the Notion
API. A CAPTCHA is a deliberate access control and was **not** bypassed.

## What IS mapped (and why it is honest)

`src/content/coverage.ts` → `EXTERNAL_PRACTICE`: **79 canonical LeetCode
problems across 61 of the 132 coverage subtopics.** Every entry is:

- a long-standing, unambiguous LeetCode problem whose `/problems/<slug>/` URL is
  canonical and stable (no invented/guessed links);
- mapped to the coverage subtopic whose **technique** it exercises (so the local
  lesson teaches the technique regardless);
- validated by `src/content/coverage.test.ts` (canonical URL shape + the mapped
  subtopic has a local lesson).

This subset is **not** claimed to equal the Notion list. It is a defensible,
technique-aligned starting set for the covered topics.

## What remains UNRESOLVED (explicit)

- The **exact set of questions listed on the Notion page** is unknown here, so:
  - Notion questions that are NOT in this subset are **unmapped** (unknown count).
  - Whether any mapped problem is **absent** from the Notion list is unverified.
  - Per-destination liveness of each LeetCode URL was **not** auto-checked
    (LeetCode returns HTTP 403 to automated requests); the slugs are canonical
    but not fetch-verified in this environment.

## Ask to the user (to close the gap)

To reconcile precisely without guessing, please provide ONE of:

1. A **Notion export** of the page (Markdown/CSV/HTML), or
2. The **pasted list** of the syllabus's practice questions (titles + links), or
3. Confirmation that the current canonical subset is acceptable as the
   external-practice mapping for this milestone.

On receiving any of these, the reconciliation will map every listed question to a
lesson/pattern or record it here as unresolved with a reason — with no invented
links.
