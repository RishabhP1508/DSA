/**
 * Regenerates docs/coverage.md from src/content/coverage.ts (the source of
 * truth). Groups entries by their `area` in first-seen order, renders one table
 * per area, and writes the version + progress header. Run with:
 *
 *   node --experimental-strip-types scripts/gen_coverage_md.mjs
 *
 * Idempotent: re-running with unchanged coverage.ts produces identical output.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(HERE, "..");

const { coverage, COVERAGE_VERSION, coverageStats } = await import(
  path.join(root, "src/content/coverage.ts")
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
  lines.push("| Subtopic | id | Status | Lesson |");
  lines.push("|---|---|---|---|");
  for (const e of entries) {
    const lesson = e.lessonId ? e.lessonId : "—";
    lines.push(`| ${e.subtopic} | \`${e.id}\` | ${e.status} | ${lesson} |`);
  }
  lines.push("");
}

const out = lines.join("\n") + "\n";
writeFileSync(path.join(root, "docs/coverage.md"), out, "utf8");
console.log(
  `Wrote docs/coverage.md — ${stats.verified}/${stats.total} verified (version ${COVERAGE_VERSION}).`,
);
