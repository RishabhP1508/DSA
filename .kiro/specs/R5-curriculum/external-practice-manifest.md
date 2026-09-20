# R5.6 — External practice reconciliation manifest

**Status: RECONCILED FROM THE SUPPLIED NOTION EXPORT (2026-09-20).** The user
supplied the authoritative Notion syllabus as a pasted export; it is now the
source of truth for R5.6. The earlier Cloudflare-blocked state is superseded and
preserved below as history.

## Authoritative source

- **Notion export (pasted by the user, 2026-09-20)** — 12 main topics,
  **79 question occurrences**, **75 unique canonical URLs** (four problems appear
  under two topics each: Two Sum, Valid Anagram, Group Anagrams, Subarray Sum
  Equals K). Encoded in `src/content/notion-practice.ts` (`NOTION_PRACTICE`), one
  row per occurrence with `source: "notion-export"`, main topic, exact title,
  canonical URL, mapped lesson/pattern ids, status, and rationale.

## Reconciliation result

- **Mapped occurrences: 79 / 79.** Every occurrence maps to a lesson/pattern that
  actually teaches its technique (verified by `src/content/notion-practice.test.ts`,
  which also checks the 22 previously-absent questions map to a real
  technique-teaching item, not a broad-topic match).
- **Unresolved occurrences: 0.**
- **Unique Notion problems: 75.** All 75 surface in `docs/coverage.md` via a
  coverage subtopic (0 missing).
- **Additional optional problems: 25** — canonical problems NOT in the Notion
  export, kept in `ADDITIONAL_PRACTICE` (separate `source: "additional"`), NOT
  counted as Notion results.
- `coverage.ts` now DERIVES each entry's `externalPractice` from the manifest, so
  the coverage doc reflects the real Notion set (no hand-maintained subset).

### The 22 previously-absent questions (now mapped, technique-verified)
Best Time to Buy and Sell Stock → kadane · Product of Array Except Self →
prefix-sums · Longest Repeating Character Replacement → string-sliding-window ·
Remove Nth Node From End of List → linked-list-slow-fast · Reorder List →
linked-list-middle · Invert Binary Tree → tree-dfs · LCA of a BST →
lowest-common-ancestor · Diameter of Binary Tree → tree-height-depth · Min Stack →
min-max-tracking · Largest Rectangle in Histogram → monotonic-stack · Clone Graph
→ graph-dfs · Pacific Atlantic Water Flow → multi-source-bfs · Word Ladder →
graph-bfs · K Closest Points to Origin → top-k · Task Scheduler → top-k · Longest
Consecutive Sequence → maps-sets · Reverse Bits → bit-shifts · Sum of Two Integers
→ bit-logical-ops · Meeting Rooms II → interval-sorting · Find Minimum in Rotated
Sorted Array → rotated-array-search · Find First and Last Position → bounds ·
Combination Sum → dp-combinations. (Each also carries pattern ids where relevant.)

## History — access attempts BEFORE the export was supplied (preserved)

Before the user pasted the export, the live Notion page was unreachable:
1. **`web_fetch`** — near-empty client shell; no question text.
2. **Headless browser (`agent-browser`, Chromium)** — rendered a Cloudflare
   "Verify you are human" challenge (an iframe with a `Verify you are human`
   checkbox); the syllabus never loaded. The CAPTCHA was NOT bypassed.
3. **Notion public API** (`/api/v3/loadCachedPageChunkV2`) — same challenge HTML +
   HTTP 429.

That is why an earlier commit shipped a conservative canonical subset; it is now
replaced by the exact export reconciliation above.

## Regression protection
`src/content/notion-practice.test.ts` (exact-set) enforces: 79 occurrences; 75
unique URLs; the 4 cross-topic duplicates retained under both topics; every export
row present (nothing dropped); every mapped id exists in the registry; the 22
flagged questions mapped to their technique-teaching item; every unresolved row
carries a reason; and no `ADDITIONAL_PRACTICE` URL is falsely attributed to the
Notion export.
