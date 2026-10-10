import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ExecutionEngine } from "../engine/engine";
import { PROTOCOL_VERSION, type InboundMessage } from "../engine/protocol";
import { ComparisonLab } from "./ComparisonLab";

const fixture = vi.hoisted(() => ({engine: undefined as ExecutionEngine | undefined}));
vi.mock("../engine/engine", async importOriginal => ({
  ...await importOriginal<typeof import("../engine/engine")>(),
  getSharedEngine: () => fixture.engine!,
}));

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
  finish(stdout: string, status = "completed") {
    this.emit("exec-start");
    this.emit("result", {status, tail: [], stdout, stderr: "", incomplete: status !== "completed"});
  }
}
let workers: FakeWorker[];
beforeEach(() => {
  workers = [];
  fixture.engine = new ExecutionEngine({workerFactory: () => {const worker = new FakeWorker(); workers.push(worker); return worker as unknown as Worker;}});
});
afterEach(() => { cleanup(); fixture.engine?.dispose(); });
const flush = () => act(async () => {await Promise.resolve(); await Promise.resolve();});
const start = () => fireEvent.click(screen.getByRole("button", {name: "Compare implementations"}));

it("aborts on the first failed empty output instead of treating two failures as equal", async () => {
  render(<ComparisonLab/>); start();
  workers[0].finish("", "error"); await flush();
  expect(workers).toHaveLength(1);
  expect(screen.queryByRole("table")).toBeNull();
  expect(screen.getByText(/did not complete/)).toBeVisible();
  expect(screen.getByRole("button", {name: "Compare implementations"})).toBeEnabled();
});
it("aborts invalid completed counts before running the other implementation", async () => {
  render(<ComparisonLab/>); start();
  workers[0].finish("[6, 7]|NaN\n"); await flush();
  expect(workers).toHaveLength(1);
  expect(screen.queryByRole("table")).toBeNull();
  expect(screen.getByText(/operation count/)).toBeVisible();
});
it("does not advance to the next size after an improved implementation fails", async () => {
  render(<ComparisonLab/>); start();
  workers[0].finish("[6, 7]|28\n"); await flush();
  workers[1].finish("[6, 7]|8\n", "event-limit"); await flush();
  expect(workers).toHaveLength(2);
  expect(screen.queryByRole("table")).toBeNull();
  expect(screen.getByText(/did not complete/)).toBeVisible();
});
it("keeps the selected experiment fixed while running", () => {
  render(<ComparisonLab/>); start();
  expect(screen.getByRole("combobox", {name: "Experiment"})).toBeDisabled();
  expect(screen.getByRole("button", {name: "Comparing…"})).toBeDisabled();
});
it("Stop terminates its current worker and never launches the next run", async () => {
  render(<ComparisonLab/>); start();
  fireEvent.click(screen.getByRole("button", {name: "Stop comparison"})); await flush();
  expect(workers[0].terminated).toBe(true);
  expect(workers).toHaveLength(1);
  expect(screen.queryByRole("table")).toBeNull();
  expect(screen.getByText(/Comparison stopped/)).toBeVisible();
  expect(screen.getByRole("combobox", {name: "Experiment"})).toBeEnabled();
});
it("unmount terminates its owned worker and never advances", async () => {
  const {unmount} = render(<ComparisonLab/>); start(); unmount(); await flush();
  expect(workers[0].terminated).toBe(true);
  expect(workers).toHaveLength(1);
});
it("unmount after supersession leaves another view's worker running", async () => {
  const {unmount} = render(<ComparisonLab/>); start();
  const other = fixture.engine!.run("pass", {owner: "playground"});
  unmount(); await flush();
  expect(workers).toHaveLength(2);
  expect(workers[0].terminated).toBe(true);
  expect(workers[1].terminated).toBe(false);
  expect(fixture.engine!.state).toBe("initializing");
  fixture.engine!.stop("playground"); await other;
});
it("a superseded comparison aborts before it can take the engine back", async () => {
  render(<ComparisonLab/>); start();
  const other = fixture.engine!.run("pass", {owner: "lesson"}); await flush();
  expect(workers).toHaveLength(2);
  expect(workers[1].terminated).toBe(false);
  expect(screen.getByText(/did not complete/)).toBeVisible();
  expect(screen.queryByRole("table")).toBeNull();
  fixture.engine!.stop("lesson"); await other;
});
it("an already completed baseline cannot advance after Stop and a new comparison", async () => {
  render(<ComparisonLab/>); start();
  workers[0].finish("'obsolete'|28\n");
  fireEvent.click(screen.getByRole("button", {name: "Stop comparison"}));
  start(); await flush();
  expect(workers).toHaveLength(2);
  expect(screen.queryByRole("table")).toBeNull();
  workers[1].finish("'current'|28\n"); await flush();
  expect(workers).toHaveLength(3);
  workers[2].finish("'current'|8\n"); await flush();
  expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(2);
});
it("shows only completed equivalent samples across all four sizes", async () => {
  render(<ComparisonLab/>); start();
  for (let i = 0; i < 8; i++) {
    workers[i].finish(`${Math.floor(i / 2)}|${i % 2 ? 8 : 28}\n`); await flush();
  }
  expect(workers).toHaveLength(8);
  const rows = within(screen.getByRole("table")).getAllByRole("row");
  expect(rows).toHaveLength(5);
  for (const row of rows.slice(1)) expect(within(row).getAllByRole("cell").map(cell => cell.textContent)).toEqual([expect.any(String), "28", "8", "✓"]);
  expect(screen.getByRole("combobox", {name: "Experiment"})).toBeEnabled();
});
