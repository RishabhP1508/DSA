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

// Normalize ONLY line endings (CRLF/CR -> LF). This fixes Windows-checkout
// portability for source-text assertions WITHOUT trimming/collapsing other
// whitespace, so exact code, indentation, quotes, braces and f-strings are
// still compared verbatim. (A git autocrlf checkout can rewrite the committed
// LF packet to CRLF while imported Python code strings stay LF.)
const toLF = (s: string) => s.replace(/\r\n?/g, "\n");

let text = "";
beforeAll(() => {
  expect(existsSync(PACKET), "packet file must exist (run scripts/gen_b1_batch_packet.mjs)").toBe(true);
  text = toLF(readFileSync(PACKET, "utf8"));
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
  it("every lesson's exact source code block appears verbatim in the packet (LF-normalized both sides)", () => {
    for (const id of IDS) {
      const code = toLF(lessons.find((l) => l.id === id)!.code);
      // Both sides LF-normalized: tolerant of CRLF checkout, strict on content
      // (indentation, quotes, braces, f-strings) which LF normalization leaves intact.
      expect(text, `packet must contain ${id} source verbatim`).toContain(code);
    }
  });
});

describe("B1 packet — recognition alternatives are serialized (not just a generic heading)", () => {
  it("errors/err-choose-1 includes the try-except alternative with its miss-is-rare reason", () => {
    expect(text).toContain("approach [try-except]");
    expect(text.toLowerCase()).toContain("when a missing key is rare");
    expect(text).toContain("miss-is-rare");
  });
  it("scope/scope-choose-1 includes the global-decl alternative with its coupling tradeoff + reason", () => {
    expect(text).toContain("approach [global-decl]");
    expect(text.toLowerCase()).toMatch(/coupling|hidden side effect/);
    expect(text).toContain("global-works-coupled");
  });
  it("serializes conditional-alternative conditions and tradeoffs for every alternative in the batch", () => {
    // Each 'Conditional alternatives' block must carry a when/tradeoff/required line.
    const blocks = text.split("Conditional alternatives").slice(1);
    expect(blocks.length).toBeGreaterThanOrEqual(2); // at least errors + scope
    for (const b of blocks) {
      const head = b.slice(0, 600);
      expect(head).toMatch(/when:/);
      expect(head).toMatch(/tradeoff:/);
      expect(head).toMatch(/required reason/);
    }
  });
});

describe("B1 packet — per-item metadata is CURRENT (not stale vs registry)", () => {
  it("every lesson section's contentHash matches the live registry hash", () => {
    for (const id of IDS) {
      const liveHash = lessons.find((l) => l.id === id)!.evidence!.contentHash;
      // the packet section header for this id must cite the live hash
      const section = text.split(`## ${id} — `)[1] ?? "";
      const header = section.slice(0, 300);
      expect(header, `packet ${id} must show live hash ${liveHash}`).toContain(`\`${liveHash}\``);
    }
  });
});
