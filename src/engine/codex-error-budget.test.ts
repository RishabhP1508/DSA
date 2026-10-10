// @vitest-environment node
import { expect, it } from "vitest";
import { ExecutionEngine } from "./engine";
import type { InboundMessage } from "./protocol";

class UntrustedWorker {
  onmessage: ((ev: { data: unknown }) => void) | null = null;
  onerror: (() => void) | null = null;
  posted: InboundMessage[] = [];
  seq = 0;
  terminated = false;
  postMessage(message: InboundMessage) { this.posted.push(message); }
  terminate() { this.terminated = true; }
  emit(kind: string, payload: unknown) {
    const request = this.posted[0];
    this.onmessage?.({ data: {
      v: 1, runId: request.runId, owner: request.owner,
      sourceRev: request.sourceRev, inputRev: request.inputRev,
      seq: this.seq++, kind, payload,
    } });
  }
}

// These reproduce a malicious worker envelope, not ordinary learner Python.
// A 32 MiB per-message validation cap is not the requested 64-byte run budget.
it.each(["error", "result"])("bounds diagnostic text in %s envelopes", async (kind) => {
  const worker = new UntrustedWorker();
  const engine = new ExecutionEngine({ workerFactory: () => worker as unknown as Worker });
  const pending = engine.run("pass", { limits: { maxTraceBytes: 64 } });
  worker.emit("exec-start", {});
  worker.emit(kind, kind === "error"
    ? { message: "界".repeat(1000), recoverable: true }
    : { status: "error", tail: [], stdout: "", stderr: "", incomplete: false,
        error: { type: "ValueError", message: "界".repeat(1000) } });
  const result = await pending;
  expect(worker.terminated).toBe(true);
  expect(new TextEncoder().encode(result.stdout + result.stderr).byteLength).toBeLessThanOrEqual(64);
  expect(new TextEncoder().encode(result.error?.message ?? "").byteLength).toBeLessThanOrEqual(64);
});

it("counts retained stdout and infrastructure diagnostic together", async () => {
  const worker = new UntrustedWorker();
  const engine = new ExecutionEngine({ workerFactory: () => worker as unknown as Worker });
  const pending = engine.run("pass", { limits: { maxTraceBytes: 64 } });
  worker.emit("exec-start", {});
  worker.emit("output", { stream: "stdout", text: "界".repeat(10) });
  worker.emit("error", { message: "界".repeat(12), recoverable: true });
  const result = await pending;
  expect(new TextEncoder().encode(result.stdout + result.stderr).byteLength).toBeLessThanOrEqual(64);
  expect(worker.terminated).toBe(true);
});
