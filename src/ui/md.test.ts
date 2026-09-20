// @vitest-environment node
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { mdInline } from "./md";

describe("mdInline", () => {
  it("escapes bold and code markers", () => {
    expect(mdInline("**hi**")).toBe("<strong>hi</strong>");
    expect(mdInline("`x`")).toBe("<code>x</code>");
  });

  it("escapes raw HTML angle brackets before formatting", () => {
    expect(mdInline("<script>")).toBe("&lt;script&gt;");
    expect(mdInline("a & b")).toBe("a &amp; b");
  });

  // Property: any input that contains no markdown/HTML metacharacters is
  // returned unchanged. This guards against accidental transformation of
  // ordinary prose.
  it("leaves metacharacter-free text unchanged (property)", () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[A-Za-z0-9 .,;:!?()\-']*$/),
        (s) => {
          expect(mdInline(s)).toBe(s);
        },
      ),
      { numRuns: 200 },
    );
  });

  // Property: output never contains a raw unescaped '<' that isn't part of a
  // tag we intentionally emit (<strong>, </strong>, <code>, </code>).
  it("never emits an unescaped raw angle bracket from arbitrary input (property)", () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        const out = mdInline(s);
        const withoutOurTags = out
          .replaceAll("<strong>", "")
          .replaceAll("</strong>", "")
          .replaceAll("<code>", "")
          .replaceAll("</code>", "");
        expect(withoutOurTags.includes("<")).toBe(false);
        expect(withoutOurTags.includes(">")).toBe(false);
      }),
      { numRuns: 200 },
    );
  });
});
