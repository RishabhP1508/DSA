/**
 * R8.2 — shared glossary aggregation.
 *
 * Collects every lesson's `vocabulary` into one sorted glossary, attaching the
 * owning lesson as topic context. A term defined in more than one lesson keeps
 * ALL its definitions with their topic, so a term with more than one meaning
 * (e.g. "node" in trees vs linked lists vs graphs) is disambiguated rather than
 * collapsed. Pure, so it can be unit-tested.
 */

import { lessons } from "../content/registry";

export interface GlossaryEntry {
  term: string;
  /** One definition per lesson that defines the term, with topic context. */
  senses: { definition: string; lessonId: string; lessonTitle: string; area: string }[];
}

export function buildGlossary(): GlossaryEntry[] {
  const byTerm = new Map<string, GlossaryEntry>();
  for (const l of lessons) {
    for (const v of l.vocabulary ?? []) {
      const key = v.term.trim();
      if (!key) continue;
      let entry = byTerm.get(key.toLowerCase());
      if (!entry) {
        entry = { term: key, senses: [] };
        byTerm.set(key.toLowerCase(), entry);
      }
      // Avoid duplicate identical senses from the same lesson.
      if (!entry.senses.some((s) => s.lessonId === l.id && s.definition === v.definition)) {
        entry.senses.push({
          definition: v.definition,
          lessonId: l.id,
          lessonTitle: l.title,
          area: l.area,
        });
      }
    }
  }
  return [...byTerm.values()].sort((a, b) => a.term.localeCompare(b.term));
}

/** Terms that carry more than one distinct meaning across topics. */
export function multiSenseTerms(glossary: GlossaryEntry[]): GlossaryEntry[] {
  return glossary.filter((e) => e.senses.length > 1);
}
