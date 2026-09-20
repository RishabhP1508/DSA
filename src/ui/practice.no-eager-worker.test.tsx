/**
 * R2-A regression: opening Practice / mounting exercise runners must NOT create
 * any Python worker or warm Pyodide until the learner explicitly runs.
 *
 * Written BEFORE the fix; expected to FAIL on the audited baseline where each
 * useExerciseRunner constructs its own ExecutionEngine which spawns a Worker on
 * mount (and the worker eagerly warms Pyodide). Practice renders one runner per
 * exercise, so mounting N runners spawned N workers.
 *
 * We spy on the global Worker constructor. The shared coordinator must create
 * ZERO workers on mount, regardless of how many runners are mounted.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { useExerciseRunner } from "./useExerciseRunner";

let workerCount = 0;
const RealWorker = globalThis.Worker;

class SpyWorker {
  onmessage: ((ev: unknown) => void) | null = null;
  onerror: ((ev: unknown) => void) | null = null;
  constructor() {
    workerCount++;
  }
  postMessage() {}
  terminate() {}
}

beforeEach(() => {
  workerCount = 0;
  // @ts-expect-error override for the test
  globalThis.Worker = SpyWorker;
});

afterEach(() => {
  cleanup();
  globalThis.Worker = RealWorker;
});

// A tiny consumer that mounts the runner hook, like ExercisePanel does.
function RunnerHarness() {
  useExerciseRunner();
  return <div data-testid="runner" />;
}

// Simulate Practice rendering many exercise panels at once.
function PracticeLike({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <RunnerHarness key={i} />
      ))}
    </>
  );
}

describe("R2-A — no eager workers on view open", () => {
  it("mounting a single exercise runner creates no Worker", () => {
    render(<RunnerHarness />);
    expect(workerCount).toBe(0);
  });

  it("mounting many exercise runners (Practice-like) creates no Worker", () => {
    render(<PracticeLike count={40} />);
    expect(workerCount).toBe(0);
  });
});
