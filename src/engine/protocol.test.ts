/**
 * R2 protocol validator tests (R2-REQ-7, R2-REQ-8).
 *
 * The versioned message protocol must reject stale/mismatched/oversized/
 * malformed messages and accept well-formed ones. hash32 must be stable.
 */
import { describe, it, expect } from "vitest";
import {
  PROTOCOL_VERSION,
  MAX_MESSAGE_BYTES,
  hash32,
  validateInbound,
  validateOutbound,
  messageByteSize,
  type InboundMessage,
  type OutboundMessage,
} from "./protocol";

function meta(over: Partial<InboundMessage> = {}) {
  return {
    v: PROTOCOL_VERSION,
    runId: 1,
    owner: "lesson:demo",
    sourceRev: 123,
    inputRev: 0,
    seq: 0,
    ...over,
  };
}

describe("hash32", () => {
  it("is deterministic and stable", () => {
    expect(hash32("hello")).toBe(hash32("hello"));
    expect(hash32("a")).not.toBe(hash32("b"));
  });
  it("stays within unsigned 32-bit range", () => {
    for (const s of ["", "x", "print(1)", "🚀", "a".repeat(5000)]) {
      const h = hash32(s);
      expect(Number.isInteger(h)).toBe(true);
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThanOrEqual(0xffffffff);
    }
  });
});

describe("validateInbound", () => {
  const goodRun: InboundMessage = {
    ...meta(),
    kind: "run",
    payload: { source: "x = 1", stdin: "", limits: { timeMs: 10000, maxEvents: 10000, maxTraceBytes: 16 * 1024 * 1024 } },
  } as InboundMessage;

  it("accepts a well-formed run", () => {
    expect(validateInbound(goodRun).ok).toBe(true);
  });
  it("accepts a well-formed stop", () => {
    const stop = { ...meta(), kind: "stop", payload: { reason: "user" } };
    expect(validateInbound(stop).ok).toBe(true);
  });
  it("rejects a protocol version mismatch", () => {
    const r = validateInbound({ ...goodRun, v: 999 });
    expect(r.ok).toBe(false);
  });
  it("rejects a missing payload / wrong shape", () => {
    expect(validateInbound({ ...meta(), kind: "run", payload: null }).ok).toBe(false);
    expect(validateInbound({ ...meta(), kind: "run", payload: { source: 1 } }).ok).toBe(false);
  });
  it("rejects an unknown kind", () => {
    expect(validateInbound({ ...meta(), kind: "explode", payload: {} }).ok).toBe(false);
  });
  it("rejects a non-envelope", () => {
    expect(validateInbound(42).ok).toBe(false);
    expect(validateInbound(null).ok).toBe(false);
    expect(validateInbound({}).ok).toBe(false);
  });
  it("rejects a negative/invalid seq or runId", () => {
    expect(validateInbound({ ...goodRun, seq: -1 }).ok).toBe(false);
    expect(validateInbound({ ...goodRun, runId: -3 }).ok).toBe(false);
  });
});

describe("validateOutbound", () => {
  const base = meta();
  it("accepts ready / exec-start", () => {
    expect(validateOutbound({ ...base, kind: "ready", payload: {} }).ok).toBe(true);
    expect(validateOutbound({ ...base, kind: "exec-start", payload: {} }).ok).toBe(true);
  });
  it("accepts a trace-batch and rejects a non-array events", () => {
    expect(validateOutbound({ ...base, kind: "trace-batch", payload: { events: [] } }).ok).toBe(true);
    expect(validateOutbound({ ...base, kind: "trace-batch", payload: { events: 5 } }).ok).toBe(false);
  });
  it("accepts a result with tail and requires an incomplete boolean", () => {
    const ok: OutboundMessage = {
      ...base,
      kind: "result",
      payload: { status: "completed", tail: [], stdout: "", stderr: "", incomplete: false },
    } as OutboundMessage;
    expect(validateOutbound(ok).ok).toBe(true);
    expect(
      validateOutbound({ ...base, kind: "result", payload: { status: "completed", tail: [], stdout: "", stderr: "" } }).ok,
    ).toBe(false);
  });
  it("rejects an oversized message", () => {
    // Build a message whose serialized size exceeds the cap.
    const huge = "x".repeat(MAX_MESSAGE_BYTES + 10);
    const r = validateOutbound({ ...base, kind: "output", payload: { stream: "stdout", text: huge } });
    expect(r.ok).toBe(false);
  });
  it("messageByteSize handles non-serializable input as oversized", () => {
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    expect(messageByteSize(cyclic)).toBe(Number.POSITIVE_INFINITY);
  });
});
