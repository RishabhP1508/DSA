/**
 * useExerciseRunner — runs a learner's code plus a test snippet on the real
 * execution engine and reports pass/fail with output and failing details.
 *
 * The tests are appended after the learner's code and executed on the SAME
 * Pyodide-backed tracer used everywhere else, so results reflect actual Python
 * behaviour (not a mock). A failing `assert` surfaces as an AssertionError; the
 * snippet can `print(...)` a failing input for feedback.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { ExecutionEngine } from "../engine/engine";

export type CheckOutcome = {
  status: "pass" | "fail" | "error";
  stdout: string;
  message?: string; // error type/message or a hint about the failure
  line?: number;
};

export function useExerciseRunner() {
  const engineRef = useRef<ExecutionEngine | null>(null);
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(false);
  const [outcome, setOutcome] = useState<CheckOutcome | null>(null);

  useEffect(() => {
    const engine = new ExecutionEngine({ onReady: () => setReady(true) });
    engineRef.current = engine;
    return () => engine.dispose();
  }, []);

  const runCheck = useCallback(async (learnerCode: string, tests: string) => {
    const engine = engineRef.current;
    if (!engine) return;
    setRunning(true);
    setOutcome(null);
    const source = `${learnerCode}\n\n# --- tests ---\n${tests}\n`;
    const res = await engine.run(source);
    setRunning(false);
    if (res.status === "stopped") return; // superseded

    if (res.status === "completed") {
      // Convention: tests should print "OK" when all assertions pass, but even
      // without that a clean completion means no assertion fired.
      setOutcome({ status: "pass", stdout: res.stdout });
    } else if (res.status === "error") {
      const isAssert = res.error?.type === "AssertionError";
      setOutcome({
        status: isAssert ? "fail" : "error",
        stdout: res.stdout,
        message: res.error
          ? `${res.error.type}: ${res.error.message}`
          : res.stderr || "Run failed.",
        line: res.error?.line,
      });
    } else {
      // timeout / event-limit / trace-limit
      setOutcome({
        status: "error",
        stdout: res.stdout,
        message: `Run ${res.status.replace("-", " ")}.`,
      });
    }
  }, []);

  const reset = useCallback(() => setOutcome(null), []);

  return { ready, running, outcome, runCheck, reset };
}
