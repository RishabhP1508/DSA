/**
 * Reproducible generator for the B1 batch semantic-review packet.
 *
 * Imports the EXPORTED, MERGED registry (lessons already have attachExerciseData
 * applied in registry.ts, so exercise.hints / .recognition / .tests reflect what
 * the learner actually receives). It does NOT regex TypeScript source, so code
 * strings with braces, quotes, and f-string template expressions (e.g.
 * `{c.value}`, `{sum_to(5)}`) are preserved verbatim.
 *
 * Output: .kiro/specs/R9-verification-handoff/b1-batch-review-packet.md
 * Run: node --experimental-strip-types --import ./scripts/lib/ts-register.mjs scripts/gen_b1_batch_packet.mjs
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { lessons } from "../src/content/registry.ts";
import { classifyLine, lineLabelText } from "../src/ui/line-label.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IDS = [
  "expressions", "conditions", "io", "errors", "functions", "scope",
  "references-mutation", "classes", "complexity", "cases", "amortized",
  "correctness", "representations",
];

const fence = (s) => "```\n" + String(s) + "\n```";
const md = [];

md.push("# R9 B1 Batch Semantic-Review Packet (13 lessons)");
md.push("");
md.push("Generated from the IMPORTED, merged registry (`src/content/registry.ts`,");
md.push("after `attachExerciseData`), not by regex over source — so exercise hints,");
md.push("recognition, test contracts, and code with braces/quotes/f-string");
md.push("expressions are reproduced verbatim. Regenerate with");
md.push("`scripts/gen_b1_batch_packet.mjs`.");
md.push("");
md.push("All 13 items are `semanticReview: false` (pending). The two prior approvals");
md.push("(`variables-and-types`, `loops`) are intentionally excluded.");
md.push("");
md.push("**Prediction UI note (verified in `src/App.tsx`):** the Predict section renders");
md.push("each prediction's `prompt`/`answer`/`explanation` as a static disclosure. No");
md.push("current view consumes `atEventIndex` to pause interactive playback at that trace");
md.push("step — it is unused metadata in the shipped UI. This is recorded as an honest");
md.push("limitation and raised as a separate product-level gap, not proof of a playback pause.");
md.push("");
md.push("---");

for (const id of IDS) {
  const l = lessons.find((x) => x.id === id);
  if (!l) throw new Error(`missing lesson ${id}`);
  const e = l.evidence;
  md.push("");
  md.push(`## ${id} — "${l.title}"`);
  md.push("");
  md.push(`- **Area:** ${l.area}`);
  md.push(`- **Prerequisites:** ${(l.prerequisites ?? []).join(", ") || "(none)"}`);
  md.push(`- **contentHash:** \`${e.contentHash}\` · **verifiedAt:** ${e.verifiedAt} · **semanticReview:** ${e.semanticReview} · **reviewBatch:** ${e.reviewBatch}`);
  md.push("");
  md.push("### Explanation");
  md.push(l.explanation);
  md.push("");
  md.push("### Vocabulary");
  for (const v of l.vocabulary) md.push(`- **${v.term}** — ${v.definition}`);
  md.push("");
  md.push("### Concepts");
  for (const [k, v] of Object.entries(l.concepts)) md.push(`- **${k}:** ${v}`);
  md.push("");
  md.push("### Review summary");
  md.push(l.review);
  md.push("");
  md.push("### Code");
  if (l.stdin) md.push(`Supplied stdin: ${fence(l.stdin)}`);
  md.push(fence(l.code));
  md.push(`Expected output: ${fence(l.expectedOutput)}`);
  md.push("");
  md.push("### Line explanations");
  const srcLines = l.code.split("\n");
  for (const c of l.codeExplanations) {
    // Honest label from the SAME classifier the UI uses (static source text +
    // the executable flag): comment / blank / not-reached / (none).
    const kind = classifyLine(srcLines[c.line - 1], c.executable);
    const label = kind === "none"
      ? "(produces a runtime event in this trace)"
      : lineLabelText(kind);
    md.push(`- L${c.line} ${label}: ${c.explanation}`);
  }
  md.push("");
  md.push("### Complexity table");
  for (const row of (l.complexity ?? [])) {
    md.push(`- **${row.operation}** — best ${row.best}, avg ${row.average}, worst ${row.worst}${row.space ? ", space " + row.space : ""}. ${row.note ?? ""}`);
  }
  md.push("");
  md.push("### Complexity analysis (full structured object)");
  md.push(fence(JSON.stringify(l.complexityExplanation, null, 2)));
  md.push("");
  md.push("### Visualization bindings");
  for (const b of (l.bindings ?? [])) {
    md.push(`- \`${b.variable}\` → model **${b.model}**${b.rationale ? ` — rationale: ${b.rationale}` : ""}`);
    if ((b.overlays ?? []).length) {
      for (const o of b.overlays) {
        // emit every authored overlay field, not just a label
        const extra = Object.entries(o)
          .filter(([k]) => !["role", "source", "label"].includes(k))
          .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
          .join(", ");
        md.push(`  - overlay: role=${o.role}, source=\`${o.source}\`, label="${o.label}"${extra ? ", " + extra : ""}`);
      }
    } else {
      md.push("  - overlays: (none)");
    }
  }
  md.push("- Real-trace note: array bindings carry NO value-as-index overlay (a loop VALUE is not an index); verified by the `*.overlay.real.test.tsx` rendered-trace regressions.");
  md.push("");
  md.push("### Predictions");
  for (const p of (l.prediction ?? [])) {
    md.push(`- **atEventIndex ${p.atEventIndex}** (metadata; not used for a UI playback pause — see note above)`);
    md.push(`  - Prompt: ${p.prompt}`);
    md.push(`  - Answer: ${p.answer}`);
    md.push(`  - Explanation: ${p.explanation}`);
  }
  md.push("");
  md.push("### Experiments");
  for (const x of (l.experiments ?? [])) md.push(`- ${x}`);
  md.push("");
  md.push("### Exercises (effective, merged — what the learner receives)");
  for (const ex of (l.exercises ?? [])) {
    md.push("");
    md.push(`#### ${ex.id} · kind: ${ex.kind}`);
    md.push(`- **Prompt:** ${ex.prompt}`);
    if (ex.starterCode) md.push(`- **Starter:** ${fence(ex.starterCode)}`);
    if (ex.expected) md.push(`- **Expected / model solution:** ${fence(ex.expected)}`);
    if (ex.hints) {
      md.push(`- **Hints (${ex.hints.length} stages):**`);
      ex.hints.forEach((h, i) => md.push(`  ${i + 1}. ${h}`));
    }
    if (ex.recognition) {
      const r = ex.recognition;
      md.push(`- **Recognition — scenario:** ${r.scenario}`);
      md.push(`  - Approaches:`);
      for (const a of (r.approaches ?? [])) {
        md.push(`    - [${a.id}] ${a.label}${a.requiredReasonIds?.length ? ` (needs: ${a.requiredReasonIds.join(", ")})` : ""}${a.rejectionFeedback ? ` — reject: ${a.rejectionFeedback}` : ""}`);
      }
      md.push(`  - Reasons:`);
      for (const rs of (r.reasons ?? [])) {
        md.push(`    - [${rs.id}]${rs.contradictory ? " (contradictory)" : ""} ${rs.text}`);
      }
      md.push(`  - Acceptable approach(es): ${(r.acceptableApproachIds ?? []).join(", ")}`);
      if ((r.alternatives ?? []).length) {
        md.push(`  - Conditional alternatives (acceptable when their stated conditions hold):`);
        for (const alt of r.alternatives) {
          md.push(`    - approach [${alt.approachId}] — when: ${alt.conditions}`);
          md.push(`      tradeoff: ${alt.tradeoff}`);
          md.push(`      required reason(s): ${(alt.requiredReasonIds ?? []).join(", ")}`);
        }
      }
      if (r.reflectionPrompt) md.push(`  - Reflection prompt (ungraded): ${r.reflectionPrompt}`);
      md.push(`  - Model explanation: ${r.modelExplanation}`);
    }
    if (ex.tests) md.push(`- **Coding test contract:** ${fence(ex.tests)}`);
  }
  md.push("");
  md.push("### References");
  for (const r of l.references) {
    md.push(`- [${r.title}](${r.url}) — §${r.section} (accessed ${r.accessDate})`);
    for (const c of (r.verifiedClaims ?? [])) md.push(`  - verified: ${c}`);
  }
  md.push("");
  md.push("---");
}

const outPath = path.join(ROOT, ".kiro/specs/R9-verification-handoff/b1-batch-review-packet.md");
const text = md.join("\n") + "\n";
writeFileSync(outPath, text, "utf8");
console.log(`wrote ${outPath} — ${text.length} chars, ${IDS.length} lessons`);
