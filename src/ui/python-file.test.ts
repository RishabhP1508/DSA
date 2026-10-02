// @vitest-environment node
/**
 * R8.3 — Python file decode: BOM stripping, CRLF normalisation, UTF-8
 * validation, binary rejection.
 */
import { describe, it, expect } from "vitest";
import { decodePythonBytes } from "./python-file";

const enc = (s: string) => new TextEncoder().encode(s);

describe("decodePythonBytes", () => {
  it("decodes plain UTF-8 Python", () => {
    const r = decodePythonBytes(enc("print('hi')\n"));
    expect(r).toEqual({ ok: true, source: "print('hi')\n" });
  });

  it("strips a UTF-8 BOM", () => {
    const bom = new Uint8Array([0xef, 0xbb, 0xbf, ...enc("x = 1\n")]);
    const r = decodePythonBytes(bom);
    expect(r.ok && r.source).toBe("x = 1\n");
  });

  it("normalises CRLF and lone CR to LF", () => {
    const r = decodePythonBytes(enc("a = 1\r\nb = 2\rc = 3\n"));
    expect(r.ok && r.source).toBe("a = 1\nb = 2\nc = 3\n");
  });

  it("preserves unicode content", () => {
    const r = decodePythonBytes(enc("s = 'café — π'\n"));
    expect(r.ok && r.source).toBe("s = 'café — π'\n");
  });

  it("rejects invalid UTF-8", () => {
    // 0xFF is never valid in UTF-8.
    const r = decodePythonBytes(new Uint8Array([0x70, 0xff, 0x71]));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/UTF-8/);
  });

  it("rejects a binary file with NUL bytes", () => {
    const r = decodePythonBytes(new Uint8Array([0x70, 0x00, 0x71]));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/binary/);
  });
});
