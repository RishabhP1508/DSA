/**
 * useExerciseRunner — runs a learner's code plus a test snippet on the real
 * execution engine and reports pass/fail with output and failing details.
 *
 * The tests are appended after the learner's code and executed on the SAME
 * Pyodide-backed tracer used everywhere else, so results reflect actual Python
 * behaviour (not a mock). A failing `assert` surfaces as an AssertionError; the
 * snippet can `print(...)` a failing input for feedback.
 */

import { useCallback, useState } from "react";
import { getSharedEngine } from "../engine/engine";

export type CheckOutcome = {
  status: "pass" | "fail" | "error";
  stdout: string;
  message?: string; // error type/message or a hint about the failure
  line?: number;
};

export function useExerciseRunner(owner = "exercise") {
  // Uses the ONE shared coordinator (R2-A): mounting a runner (or many, as
  // Practice does) creates NO worker and warms NO Pyodide. The runtime loads
  // only when runCheck() executes. `ready` is always true because warming is
  // lazy; the button no longer needs a "Loading Python…" gate on mount.
  const [ready] = useState(true);
  const [running, setRunning] = useState(false);
  const [outcome, setOutcome] = useState<CheckOutcome | null>(null);

  const runCheck = useCallback(
    async (learnerCode: string, tests: string) => {
      const engine = getSharedEngine();
      setRunning(true);
      setOutcome(null);
      const source = `${learnerCode}\n\n# --- tests ---\n${tests}\n`;
      const res = await engine.run(source, { owner });
      setRunning(false);
      if (res.status === "stopped") return; // superseded

      if (res.status === "completed") {
        // A clean completion means no assertion fired.
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
        // timeout / event-limit / trace-limit / exited / stopped
        setOutcome({
          status: "error",
          stdout: res.stdout,
          message: `Run ${res.status.replace("-", " ")}.`,
        });
      }
    },
    [owner],
  );

  const reset = useCallback(() => setOutcome(null), []);

  return { ready, running, outcome, runCheck, reset };
}
