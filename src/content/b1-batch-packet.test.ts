// @vitest-environment node
/**
 * R9 / B1 amendment — guards the generated review packet is COMPLETE and that
 * code/f-string content is preserved verbatim (not regex-mangled). Targeted
 * assertions, not a brittle whole-document snapshot.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { lessons } from "./registry";

const PACKET = path.resolve(__dirname, "../../.kiro/specs/R9-verification-handoff/b1-batch-review-packet.md");
const IDS = ["expressions","conditions","io","errors","functions","scope","references-mutation","classes","complexity","cases","amortized","correctness","representations"];

let text = "";
beforeAll(() => {
  expect(existsSync(PACKET), "packet file must exist (run scripts/gen_b1_batch_packet.mjs)").toBe(true);
  text = readFileSync(PACKET, "utf8");
});

describe("B1 packet — completeness", () => {
  it("has a section heading for all 13 batch lessons", () => {
    for (const id of IDS) expect(text).toContain(`## ${id} — `);
  });
  it("includes review summaries, bindings, and recognition sections (previously omitted)", () => {
    expect(text).toContain("### Review summary");
    expect(text).toContain("### Visualization bindings");
    expect(text).toContain("Recognition — scenario");
  });
  it("records the honest prediction-UI limitation (atEventIndex not used for playback)", () => {
    expect(text.toLowerCase()).toMatch(/atEventIndex[^.]*not (used|consume)/i);
  });
});

describe("B1 packet — f-string / brace preservation (not regex-mangled)", () => {
  it("preserves the io assert f-string with braces and !r conversion verbatim", () => {
    // The old regex-extracted packet collapsed f-strings to fragments like {c.value}.
    expect(text).toContain(`f'double of 7 should be 14, got {double("7")!r} (string version gives 77)'`);
  });
  it("preserves the errors safe_div assert f-string verbatim", () => {
    expect(text).toContain(`f"division by zero should return undefined, got {safe_div(10, 0)!r}"`);
  });
  it("has no stray bare f-string fragment lines (e.g. a line that is only {c.value})", () => {
    const strayFragment = text.split("\n").some((ln) => /^\{(c\.value|sum_to\(\d+\))\}$/.test(ln.trim()));
    expect(strayFragment).toBe(false);
  });
  it("every lesson's exact source code block appears verbatim in the packet", () => {
    for (const id of IDS) {
      const code = lessons.find((l) => l.id === id)!.code;
      expect(text, `packet must contain ${id} source verbatim`).toContain(code);
    }
  });
});
