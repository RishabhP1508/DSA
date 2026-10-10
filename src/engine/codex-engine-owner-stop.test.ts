// @vitest-environment node
import { expect, it } from "vitest";
import { ExecutionEngine } from "./engine";
import { PROTOCOL_VERSION, type InboundMessage } from "./protocol";

class FakeWorker {
  onmessage: ((event: {data: unknown}) => void) | null = null;
  onerror = null;
  posted: InboundMessage[] = [];
  terminated = false;
  sequence = 0;
  postMessage(message: InboundMessage) { this.posted.push(message); }
  terminate() { this.terminated = true; }
  emit(kind: string, payload = {}) {
    const run = this.posted[0];
    this.onmessage?.({data: {v: PROTOCOL_VERSION, runId: run.runId, owner: run.owner, sourceRev: run.sourceRev, inputRev: run.inputRev, seq: this.sequence++, kind, payload}});
  }
}
const setup = () => {
  const workers: FakeWorker[] = [];
  const engine = new ExecutionEngine({workerFactory: () => {const worker = new FakeWorker(); workers.push(worker); return worker as unknown as Worker;}});
  return {engine, workers};
};

it("does not stop another owner during initialization", async () => {
  const {engine, workers} = setup();
  const pending = engine.run("pass", {owner: "playground"});
  try {
    engine.stop("comparison:1");
    expect(workers[0].terminated).toBe(false);
    expect(engine.state).toBe("initializing");
  } finally { engine.stop(); await pending; }
});
it("stops its matching owner during execution and retains user cancellation", async () => {
  const {engine, workers} = setup();
  const pending = engine.run("pass", {owner: "comparison:1"});
  workers[0].emit("exec-start");
  engine.stop("comparison:1");
  expect(await pending).toMatchObject({status: "stopped", stopReason: "user", incomplete: true});
  expect(workers[0].terminated).toBe(true);
});
it("an obsolete comparison Stop cannot terminate a superseding run", async () => {
  const {engine, workers} = setup();
  const old = engine.run("pass", {owner: "comparison:1"});
  const current = engine.run("pass", {owner: "lesson"});
  expect(await old).toMatchObject({status: "stopped", stopReason: "supersede"});
  workers[1].emit("exec-start");
  try {
    engine.stop("comparison:1");
    expect(workers[1].terminated).toBe(false);
    expect(engine.state).toBe("running");
  } finally { engine.stop(); expect(await current).toMatchObject({status: "stopped", stopReason: "user"}); }
});
