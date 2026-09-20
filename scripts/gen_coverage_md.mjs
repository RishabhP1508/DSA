/**
 * Regenerates docs/coverage.md from src/content/coverage.ts (the source of
 * truth). Groups entries by their `area` in first-seen order, renders one table
 * per area, and writes the version + progress header. Run with:
 *
 *   node --experimental-strip-types --import ./scripts/lib/ts-register.mjs scripts/gen_coverage_md.mjs
 *
 * Idempotent: re-running with unchanged coverage.ts produces identical output.
 * Cross-platform: the coverage module is imported via a file URL.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(HERE, "..");

const { coverage, COVERAGE_VERSION, coverageStats } = await import(
  pathToFileURL(path.join(root, "src/content/coverage.ts")).href
);
const registry = await import(pathToFileURL(path.join(root, "src/content/registry.ts")).href);
const { NOTION_PRACTICE, ADDITIONAL_PRACTICE, NOTION_UNIQUE_URL_COUNT } = await import(
  pathToFileURL(path.join(root, "src/content/notion-practice.ts")).href
);
const lessonById = new Map(registry.lessons.map((l) => [l.id, l]));

const stats = coverageStats(coverage);

/** Whether the entry's lesson carries a completed human semantic review (R5.3). */
function isSemanticallyReviewed(entry) {
  const l = entry.lessonId ? lessonById.get(entry.lessonId) : undefined;
  return Boolean(l?.evidence?.semanticReview);
}
const semanticReviewed = coverage.filter(isSemanticallyReviewed).length;

// Preserve the first-seen order of areas.
const areas = [];
const byArea = new Map();
for (const entry of coverage) {
  if (!byArea.has(entry.area)) {
    byArea.set(entry.area, []);
    areas.push(entry.area);
  }
  byArea.get(entry.area).push(entry);
}

const lines = [];
lines.push("# Curriculum coverage inventory");
lines.push("");
lines.push(
  `Coverage version: ${COVERAGE_VERSION}. Versioned checklist of every required subtopic (Notion syllabus + agreed additions). A broad heading does NOT count as coverage of its subtopics. Source of truth: \`src/content/coverage.ts\`.`,
);
lines.push("");
lines.push(`**Evidence-verified (structural): ${stats.verified} / ${stats.total}.**`);
lines.push(
  `**Human semantic review (R5.3): ${semanticReviewed} / ${stats.total} coverage entries complete; ${stats.total - semanticReviewed} pending.**`,
);
lines.push("");
lines.push(
  "> Two count families, kept separate: (a) **EXAMPLES** — 131 lessons + 29 patterns = 160 executable examples, of which 37 are semantically reviewed and 123 are pending; (b) **COVERAGE ENTRIES** — the " +
    `${stats.total} rows in this inventory, of which ${semanticReviewed} are semantically reviewed and ${stats.total - semanticReviewed} pending. Do not mix the 37/123 example counts with the ${semanticReviewed}/${stats.total - semanticReviewed} coverage-entry counts.`,
);
lines.push("");
lines.push(
  "Two layers: *evidence-verified* means the item passes all machine checks (output, line explanations, complexity panel, example-model contract, references) with a current content-hash tie (see `verify:coverage-evidence`). *Semantic-reviewed* means a person read the teaching claim/definition/reasoning (`evidence.semanticReview: true`). Items pending semantic review are structurally verified but NOT claimed as fully reviewed — see `.kiro/specs/R5-curriculum/batch-review.md`.",
);
lines.push("");
lines.push("Status legend: planned · in-progress · authored · verified. Reviewed column: ✅ = semantic review done, ⏳ = pending.");
lines.push("");

for (const area of areas) {
  const entries = byArea.get(area);
  const areaVerified = entries.filter((e) => e.status === "verified").length;
  lines.push(`## ${area} (${areaVerified}/${entries.length})`);
  lines.push("");
  lines.push("| Subtopic | id | Status | Reviewed | Lesson | Ext. practice |");
  lines.push("|---|---|---|---|---|---|");
  for (const e of entries) {
    const lesson = e.lessonId ? e.lessonId : "—";
    const ext = e.externalPractice && e.externalPractice.length ? String(e.externalPractice.length) : "—";
    const reviewed = isSemanticallyReviewed(e) ? "✅" : "⏳";
    lines.push(`| ${e.subtopic} | \`${e.id}\` | ${e.status} | ${reviewed} | ${lesson} | ${ext} |`);
  }
  lines.push("");
}

const extTotal = coverage.reduce((s, e) => s + (e.externalPractice?.length ?? 0), 0);
const extEntries = coverage.filter((e) => e.externalPractice?.length).length;
lines.push("---");
lines.push("");
lines.push(
  `External practice (optional): **RECONCILED from the supplied Notion export** (R5.6). ` +
    `Notion occurrences: **${NOTION_PRACTICE.length}**; unique Notion problems: **${NOTION_UNIQUE_URL_COUNT}**; ` +
    `mapped occurrences: **${NOTION_PRACTICE.filter((r) => r.status === "mapped").length}**; ` +
    `unresolved occurrences: **${NOTION_PRACTICE.filter((r) => r.status === "unresolved").length}**; ` +
    `additional optional problems (not in the export): **${ADDITIONAL_PRACTICE.length}**. ` +
    `Each coverage entry's practice column is DERIVED from \`src/content/notion-practice.ts\` (a Notion problem attaches to a subtopic when the subtopic's lesson/pattern id is among the problem's mapped ids); ${extTotal} occurrences surface across ${extEntries} subtopics. Titles + canonical links only; local lessons teach each technique regardless. The historical Cloudflare-blocked access attempts are preserved in \`.kiro/specs/R5-curriculum/external-practice-manifest.md\`.`,
);
lines.push("");

const out = lines.join("\n") + "\n";
writeFileSync(path.join(root, "docs/coverage.md"), out, "utf8");
console.log(
  `Wrote docs/coverage.md — ${stats.verified}/${stats.total} evidence-verified, ${semanticReviewed}/${stats.total} semantically reviewed (version ${COVERAGE_VERSION}).`,
);
