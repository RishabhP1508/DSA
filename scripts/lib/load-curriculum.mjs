/**
 * Loads the REAL curriculum by importing the app's `registry.ts` (via the
 * TS resolver hook + Node type-stripping). The registered `lessons[]` and
 * `patterns[]` arrays are the single source of truth, so a missing, malformed,
 * or unregistered item causes a failure instead of being silently skipped.
 *
 * It also cross-checks the registry against the files on disk: any lesson/
 * pattern file that is NOT registered is reported as an error (prevents content
 * from silently existing but never shipping / never being verified).
 *
 * Must be run under:
 *   node --experimental-strip-types --import ./scripts/lib/ts-register.mjs <script>
 */
import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, "..", "..");

export async function loadRegistry() {
  const url = pathToFileURL(
    path.join(ROOT, "src", "content", "registry.ts"),
  ).href;
  const mod = await import(url);
  if (!Array.isArray(mod.lessons) || !Array.isArray(mod.patterns)) {
    throw new Error("registry.ts did not export lessons[] and patterns[] arrays");
  }
  return mod;
}

/** Return {lessons, patterns, problems} plus a list of structural errors. */
export async function loadCurriculum() {
  const errors = [];
  const { lessons, patterns } = await loadRegistry();

  if (lessons.length === 0) errors.push("registry exports zero lessons");
  if (patterns.length === 0) errors.push("registry exports zero patterns");

  // Cross-check registered ids against files on disk.
  const lessonFiles = readdirSync(path.join(ROOT, "src", "content", "lessons"))
    .filter((f) => f.endsWith(".ts"));
  const patternFiles = readdirSync(path.join(ROOT, "src", "content", "patterns"))
    .filter((f) => f.endsWith(".ts"));

  if (lessonFiles.length !== lessons.length) {
    errors.push(
      `lesson file count (${lessonFiles.length}) != registered lessons (${lessons.length}) — a file may be unregistered or double-registered`,
    );
  }
  if (patternFiles.length !== patterns.length) {
    errors.push(
      `pattern file count (${patternFiles.length}) != registered patterns (${patterns.length})`,
    );
  }

  // Structural validation of each definition (catches malformed content).
  const seenLesson = new Set();
  for (const l of lessons) {
    if (!l || typeof l.id !== "string") { errors.push("a lesson has no string id"); continue; }
    if (seenLesson.has(l.id)) errors.push(`duplicate lesson id: ${l.id}`);
    seenLesson.add(l.id);
    if (typeof l.code !== "string" || l.code.length === 0) errors.push(`lesson ${l.id}: missing code`);
    if (typeof l.expectedOutput !== "string") errors.push(`lesson ${l.id}: missing expectedOutput`);
    if (!Array.isArray(l.codeExplanations) || l.codeExplanations.length === 0) errors.push(`lesson ${l.id}: missing codeExplanations`);
    if (!Array.isArray(l.exercises)) errors.push(`lesson ${l.id}: exercises is not an array`);
  }

  const seenPattern = new Set();
  for (const p of patterns) {
    if (!p || typeof p.id !== "string") { errors.push("a pattern has no string id"); continue; }
    if (seenPattern.has(p.id)) errors.push(`duplicate pattern id: ${p.id}`);
    seenPattern.add(p.id);
    if (typeof p.walkthroughCode !== "string" || p.walkthroughCode.length === 0) errors.push(`pattern ${p.id}: missing walkthroughCode`);
    if (typeof p.walkthroughExpectedOutput !== "string") errors.push(`pattern ${p.id}: missing walkthroughExpectedOutput`);
    if (!Array.isArray(p.codeExplanations) || p.codeExplanations.length === 0) errors.push(`pattern ${p.id}: missing codeExplanations`);
  }

  return { lessons, patterns, errors };
}

/** Flatten every exercise across lessons and patterns with a stable owner tag. */
export function collectExercises({ lessons, patterns }) {
  const out = [];
  for (const l of lessons) {
    for (const ex of l.exercises ?? []) {
      out.push({ ownerKind: "lesson", ownerId: l.id, exercise: ex });
    }
  }
  for (const p of patterns) {
    for (const ex of p.exercises ?? []) {
      out.push({ ownerKind: "pattern", ownerId: p.id, exercise: ex });
    }
  }
  return out;
}
