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

const stats = coverageStats(coverage);

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
lines.push(`**Progress: ${stats.verified} / ${stats.total} verified.**`);
lines.push("");
lines.push("Status legend: planned · in-progress · authored · verified");
lines.push("");

for (const area of areas) {
  const entries = byArea.get(area);
  const areaVerified = entries.filter((e) => e.status === "verified").length;
  lines.push(`## ${area} (${areaVerified}/${entries.length})`);
  lines.push("");
  lines.push("| Subtopic | id | Status | Lesson | Ext. practice |");
  lines.push("|---|---|---|---|---|");
  for (const e of entries) {
    const lesson = e.lessonId ? e.lessonId : "—";
    const ext = e.externalPractice && e.externalPractice.length ? String(e.externalPractice.length) : "—";
    lines.push(`| ${e.subtopic} | \`${e.id}\` | ${e.status} | ${lesson} | ${ext} |`);
  }
  lines.push("");
}

const extTotal = coverage.reduce((s, e) => s + (e.externalPractice?.length ?? 0), 0);
const extEntries = coverage.filter((e) => e.externalPractice?.length).length;
lines.push("---");
lines.push("");
lines.push(
  `External practice (optional): ${extTotal} canonical LeetCode problems mapped across ${extEntries} subtopics (R5.6). Titles + links only; local lessons teach each technique regardless. The exact Notion-syllabus question list could not be enumerated in the build environment (client-rendered page) — this is a conservative canonical subset; see \`.kiro/specs/R5-curriculum/verification.md\` for the open reconciliation gap.`,
);
lines.push("");

const out = lines.join("\n") + "\n";
writeFileSync(path.join(root, "docs/coverage.md"), out, "utf8");
console.log(
  `Wrote docs/coverage.md — ${stats.verified}/${stats.total} verified (version ${COVERAGE_VERSION}).`,
);
