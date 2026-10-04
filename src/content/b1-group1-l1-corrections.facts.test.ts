// @vitest-environment node
/**
 * R9 / B1 Group 1 — Lesson 1 (variables-and-types) focused corrections,
 * reviewer-requested after the Parts A–E packet review. Written test-first.
 *
 * Findings (verbatim intent):
 *  1. The line-21 comment "Show the types and values we built." is misleading:
 *     line 22 prints VALUES only (no type(...) call). Comment -> "Show the
 *     values we built." (both the code string's comment and its line-21
 *     codeExplanation must stop implying types are shown).
 *  2. "reassignment changes the name's type" is misleading in a reference model:
 *     the NAME has no type; after reassignment `score` REFERS TO an object of a
 *     different type. Fix the experiment wording and scan vocabulary + tradeoffs
 *     for the same "name's type / type of the name" phrasing.
 *  3. "no overflow" (int exercise + edgeCases) must be qualified as "no
 *     fixed-width integer overflow, limited only by available memory", kept
 *     simple for beginners.
 */
import { describe, it, expect } from "vitest";
import { lessons } from "./registry";
import type { LessonDefinition } from "../core/types";

const byId = (id: string): LessonDefinition => {
  const l = lessons.find((x) => x.id === id);
  if (!l) throw new Error(`lesson not found: ${id}`);
  return l;
};

const vt = byId("variables-and-types");

describe("B1 G1 L1 — line-21 comment: values, not types", () => {
  it("the code's line-21 comment no longer claims it shows types", () => {
    const line21 = vt.code.split("\n")[20]; // 0-indexed line 21
    expect(line21).toContain("Show the values we built");
    expect(line21.toLowerCase()).not.toContain("types and values");
  });

  it("the line-21 codeExplanation does not claim types are printed", () => {
    const e21 = vt.codeExplanations.find((c) => c.line === 21);
    expect(e21).toBeDefined();
    expect(e21!.explanation.toLowerCase()).not.toMatch(/\btypes?\b/);
  });

  it("line 22's explanation still describes printing values (not types)", () => {
    const e22 = vt.codeExplanations.find((c) => c.line === 22);
    expect(e22).toBeDefined();
    expect(e22!.explanation.toLowerCase()).toContain("value");
  });
});

describe("B1 G1 L1 — reassignment: name refers to a different type, not 'the name's type'", () => {
  it("no experiment/vocab/tradeoff says the NAME has or changes a type", () => {
    const texts = [
      ...vt.experiments,
      vt.concepts.tradeoffs,
      ...vt.vocabulary.map((v) => `${v.term} ${v.definition}`),
    ].map((t) => t.toLowerCase());
    for (const t of texts) {
      expect(t).not.toContain("name's type");
      expect(t).not.toContain("the type of the name");
    }
  });

  it("an experiment frames reassignment as the name REFERRING TO a different type", () => {
    const joined = vt.experiments.join("\n").toLowerCase();
    expect(joined).toMatch(/refers to .*(different|another) type|object of a different type/);
  });
});

describe("B1 G1 L1 — int 'no overflow' is qualified (no fixed-width overflow, limited by memory)", () => {
  const choose = vt.exercises.find((e) => e.id === "vt-choose-1")!;

  it("vt-choose-1 qualifies overflow rather than claiming an unbounded absolute", () => {
    const blob = [choose.expected, ...(choose.hints ?? [])].join("\n").toLowerCase();
    expect(blob).toMatch(/no fixed-width|fixed-width (integer )?overflow/);
    expect(blob).toMatch(/memory/);
    // must not keep the bare, unqualified "no overflow" with nothing else
    expect(blob).not.toMatch(/no overflow\.?$/);
  });

  it("edgeCases qualifies the int precision claim (memory-bounded, no fixed-width overflow)", () => {
    const ec = vt.concepts.edgeCases.toLowerCase();
    expect(ec).toMatch(/fixed-width|memory/);
    expect(ec).not.toMatch(/\(no overflow\)/);
  });
});
