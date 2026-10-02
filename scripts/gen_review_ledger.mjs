/**
 * R5.3 — generate the HUMAN-REVIEW LEDGER from the CURRENT content.
 *
 * This is run DELIBERATELY, by a human, to record "I have re-read this item at
 * this exact content hash". It is NOT run by the evidence codemod. The ledger
 * (src/content/review-ledger.ts) maps id -> { reviewedHash, reviewedAt, batch }.
 *
 * The evidence codemod later grants evidence.semanticReview = true ONLY when the
 * item's CURRENT contentHashOf equals the ledger's reviewedHash. So after any
 * content edit + machine-evidence regeneration, semanticReview reverts to false
 * for the changed item until a human re-reviews it and re-runs THIS script.
 *
 * Run (only after actually re-reading the items):
 *   node --experimental-strip-types --import ./scripts/lib/ts-register.mjs scripts/gen_review_ledger.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { loadCurriculum } from "./lib/load-curriculum.mjs";
import { contentHashOf } from "./lib/content-hash.mjs";
import { ledgerEntryFor, assertIsoDate } from "./lib/review-ledger-core.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// The date to stamp on items being signed off NOW. There is NO hard-coded
// "today": a human running this with REVIEWED_NOW must pass a validated ISO
// SIGNOFF_DATE (e.g. SIGNOFF_DATE=2026-09-22). It is only consulted for items in
// REVIEWED_NOW; if none are being signed off, the date is irrelevant.
const RAW_SIGNOFF = process.env.SIGNOFF_DATE ?? "";
const { lessons, patterns } = await loadCurriculum();

// This script records a HUMAN review at the CURRENT content hash. It must never
// fabricate a review: by default it PRESERVES each existing ledger entry exactly
// (its recorded reviewedHash + date). An item whose live hash no longer matches
// its recorded reviewedHash therefore stays PENDING (the evidence codemod grants
// semanticReview only on a hash match) until a human genuinely re-reads it and
// adds its id to REVIEWED_NOW below. New items with no prior entry are also
// recorded at NOW only when listed in REVIEWED_NOW; otherwise they are recorded
// with the current hash but flagged pending via a sentinel date is NOT done —
// instead they simply carry NOW and must be in REVIEWED_NOW to count.
let priorByKey = new Map();
try {
  const mod = await import(pathToFileURL(path.join(ROOT, "src/content/review-ledger.ts")).href);
  priorByKey = mod.REVIEW_LEDGER_BY_KEY ?? new Map();
} catch {
  priorByKey = new Map();
}

/**
 * The set of "<kind>:<id>" the human running this script has ACTUALLY re-read at
 * the current content and is signing off on NOW. Only these are (re)stamped at
 * the live hash; everything else keeps its prior recorded hash/date (so a
 * content edit it covers correctly reverts that item to pending). Passed via
 * REVIEWED_NOW env var as a comma-separated list, or edited here for a batch.
 */
const REVIEWED_NOW = new Set(
  (process.env.REVIEWED_NOW ?? "").split(",").map((s) => s.trim()).filter(Boolean),
);

// A validated sign-off date is REQUIRED when (and only when) items are being
// signed off now — never a silent hard-coded date.
const SIGNOFF_DATE =
  REVIEWED_NOW.size > 0 ? assertIsoDate(RAW_SIGNOFF) : (RAW_SIGNOFF || "unused");

const LESSON_AREA_TO_BATCH = {
  "Programming foundations": 1, "DSA foundations": 1,
  "Arrays": 2, "Strings": 2, "Hashing": 2, "Bit manipulation": 2,
  "Searching": 3, "Sorting": 3,
  "Linear structures": 4, "Stacks and queues": 4, "Heaps": 4,
  "Trees and tries": 5, "Graphs": 5, "Range queries": 5,
  "DP and recursion": 6,
};
const PATTERN_CATEGORY_TO_BATCH = {
  "Arrays & strings": 2, "Searching": 3, "Intervals": 3, "Greedy": 3,
  "Sorting & divide-and-conquer": 3, "Bit manipulation": 2,
  "Linked lists & sequences": 4, "Stacks & queues": 4, "Heaps & priority": 4,
  "Graphs & trees": 5, "Recursion & search": 6, "Dynamic programming": 6,
};

function entryFor(kind, item, batch) {
  // Delegate to the pure, unit-tested core (scripts/lib/review-ledger-core.mjs).
  // A NEW item that is not explicitly signed off gets a SENTINEL reviewedHash
  // that can never equal a real content hash, so it stays PENDING — it does NOT
  // silently acquire a matching hash and semanticReview:true.
  return ledgerEntryFor(
    kind,
    item,
    batch,
    contentHashOf(item),
    priorByKey.get(kind + ":" + item.id),
    REVIEWED_NOW,
    SIGNOFF_DATE,
  );
}

const entries = [];
for (const l of lessons) {
  const batch = LESSON_AREA_TO_BATCH[l.area];
  if (batch === undefined) throw new Error(`no batch for lesson area ${l.area}`);
  entries.push(entryFor("lesson", l, batch));
}
for (const p of patterns) {
  const batch = PATTERN_CATEGORY_TO_BATCH[p.category];
  if (batch === undefined) throw new Error(`no batch for pattern category ${p.category}`);
  entries.push(entryFor("pattern", p, batch));
}
entries.sort((a, b) => a.kind.localeCompare(b.kind) || a.id.localeCompare(b.id));

const header = `/**
 * R5.3 — human semantic-review ledger (GENERATED by scripts/gen_review_ledger.mjs,
 * run deliberately by a human after re-reading the items).
 *
 * Each entry records that a person read this item's teaching content at the exact
 * \`reviewedHash\`. Evidence granting (codemod_add_evidence.mjs) sets
 * \`evidence.semanticReview: true\` ONLY when the item's CURRENT content hash
 * equals \`reviewedHash\` here — so a later content edit (which changes the hash)
 * makes semanticReview revert to pending until the item is re-read and this
 * ledger is regenerated. This is a RECORDED HUMAN CLAIM; the automated tests do
 * not "prove" the reading happened, they only enforce that a claim cannot outlive
 * the content it was made against.
 */
export interface ReviewLedgerEntry {
  id: string;
  kind: "lesson" | "pattern";
  /** contentHashOf(item) at the moment of human review. */
  reviewedHash: string;
  reviewedAt: string;
  /** R5.3 review batch (1-6). */
  batch: number;
}

export const REVIEW_LEDGER: ReviewLedgerEntry[] = ${JSON.stringify(entries, null, 2)};

/** Keyed by "<kind>:<id>" because a lesson and a pattern can share an id
 * (e.g. two-pointers, sliding-window, kadane, tree-dfs, dijkstra, ...). */
export const REVIEW_LEDGER_BY_KEY: Map<string, ReviewLedgerEntry> = new Map(
  REVIEW_LEDGER.map((e) => [e.kind + ":" + e.id, e]),
);
`;

writeFileSync(path.join(ROOT, "src/content/review-ledger.ts"), header, "utf8");
console.log(`Wrote review-ledger.ts — ${entries.length} entries (${lessons.length} lessons, ${patterns.length} patterns).`);
