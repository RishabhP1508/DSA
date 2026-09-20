/**
 * ExercisePanel — interactive practice for a single exercise.
 *
 * Two modes:
 *  - RUNNABLE (exercise has `tests`): the learner edits code and presses "Run
 *    tests". The code plus the test snippet execute on the real engine; a
 *    failing assertion or error is reported with output and the failing detail
 *    (plan §3/§7: run local tests, show failing inputs and useful feedback).
 *  - SELF-ASSESSED (no `tests`, e.g. recognition / free-text): reveal an
 *    authored MODEL answer and self-assess, since arbitrary prose and approach
 *    choices are not reliably auto-graded (plan §3).
 *
 * Hints always reveal ONE AT A TIME. Progress is recorded via the storage layer.
 */

import { useEffect, useState } from "react";
import type { Exercise, PatternExercise } from "../core/types";
import { recordExerciseAttempt } from "../storage/progress";
import { exerciseUid, type OwnerKind } from "../storage/exercise-id";
import { CodeEditor } from "./CodeEditor";
import { useExerciseRunner } from "./useExerciseRunner";

const KIND_LABEL: Record<Exercise["kind"], string> = {
  "predict-state": "Predict the state",
  "complete-code": "Complete the code",
  "fix-mistake": "Find and fix the bug",
  "choose-approach": "Choose the approach",
  "write-solution": "Write a solution",
  mixed: "Mixed challenge",
};

export function ExercisePanel({
  exercise,
  patternMode,
  ownerKind,
  ownerId,
}: {
  exercise: Exercise | PatternExercise;
  /** In the Pattern Library, choose-approach exercises are recognition drills. */
  patternMode?: boolean;
  /** The lesson/pattern that owns this exercise (for the globally unique id). */
  ownerKind: OwnerKind;
  ownerId: string;
}) {
  const runnable = Boolean(exercise.tests);
  const [answer, setAnswer] = useState("");
  const [code, setCode] = useState(exercise.starterCode ?? "");
  const [revealed, setRevealed] = useState(0);
  const [showModel, setShowModel] = useState(false);
  const [selfResult, setSelfResult] = useState<"correct" | "close" | "revisit" | null>(null);
  const runner = useExerciseRunner();

  // Globally unique identity for storage/attempts (R3-A): two exercises that
  // share a bare id across owners no longer collide.
  const uid = exerciseUid(ownerKind, ownerId, exercise.id);
  const record = (solved: boolean) => void recordExerciseAttempt(uid, solved);
  const revealNext = () => setRevealed((r) => Math.min(r + 1, exercise.hints.length));

  const reveal = () => {
    setShowModel(true);
    if (!runnable) record(false);
  };

  const selfAssess = (r: "correct" | "close" | "revisit") => {
    setSelfResult(r);
    record(r === "correct");
  };

  const runTests = async () => {
    await runner.runCheck(code, exercise.tests ?? "");
  };

  const outcome = runner.outcome;

  // Record attempts from runnable exercises: a pass is a solve, a fail/error is
  // a non-solving attempt. Runs are recorded when an outcome lands.
  useEffect(() => {
    if (!runnable || !outcome) return;
    void recordExerciseAttempt(uid, outcome.status === "pass");
  }, [outcome, runnable, uid]);

  return (
    <div className="exercise-panel">
      <div className="exercise-head">
        <span className="kind-badge">{KIND_LABEL[exercise.kind]}</span>
        {runnable && <span className="kind-badge runnable">runnable</span>}
        <p className="exercise-prompt">{exercise.prompt}</p>
      </div>

      {runnable ? (
        <div className="runnable-block">
          <div className="dim tiny">Edit the code, then run the tests.</div>
          <CodeEditor value={code} onChange={setCode} />
          <div className="exercise-actions">
            <button onClick={runTests} disabled={!runner.ready || runner.running}>
              {runner.ready ? (runner.running ? "Running…" : "▶ Run tests") : "Loading Python…"}
            </button>
            <button onClick={revealNext} disabled={revealed >= exercise.hints.length}>
              {revealed === 0 ? "Show a hint" : revealed >= exercise.hints.length ? "No more hints" : "Next hint"}
            </button>
            <button onClick={reveal} disabled={showModel}>Reveal model answer</button>
          </div>

          {outcome && (
            <div className={`test-result ${outcome.status}`}>
              <strong>
                {outcome.status === "pass"
                  ? "✓ All tests passed"
                  : outcome.status === "fail"
                    ? "✗ A test failed"
                    : "⚠ Could not run"}
              </strong>
              {outcome.message && (
                <div className="test-detail">
                  {outcome.message}
                  {outcome.line ? ` (line ${outcome.line})` : ""}
                </div>
              )}
              {outcome.stdout && (
                <>
                  <div className="dim tiny">Output</div>
                  <pre className="output">{outcome.stdout}</pre>
                </>
              )}
              {outcome.status === "fail" && (
                <p className="dim tiny">
                  A property check (assert) did not hold. Read the failing detail and any printed
                  input, then adjust your code and run again.
                </p>
              )}
            </div>
          )}
          {outcome?.status === "pass" && (
            <p className="self-result correct">Marked solved — recorded to your local progress.</p>
          )}
        </div>
      ) : (
        <>
          <label className="answer-label">
            Your answer
            <textarea
              className="answer-box"
              rows={exercise.kind === "choose-approach" ? 3 : 6}
              value={answer}
              placeholder={
                exercise.kind === "choose-approach"
                  ? "Name the technique and briefly justify it…"
                  : "Write your answer here…"
              }
              onChange={(e) => setAnswer(e.target.value)}
            />
          </label>
          <div className="exercise-actions">
            <button onClick={revealNext} disabled={revealed >= exercise.hints.length}>
              {revealed === 0 ? "Show a hint" : revealed >= exercise.hints.length ? "No more hints" : "Next hint"}
            </button>
            <button onClick={reveal} disabled={showModel}>Reveal model answer</button>
          </div>
        </>
      )}

      {revealed > 0 && (
        <ol className="hints">
          {exercise.hints.slice(0, revealed).map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ol>
      )}

      {showModel && exercise.expected && (
        <div className="model-answer">
          <div className="dim tiny">
            Model answer{" "}
            {patternMode && (exercise as PatternExercise).correctPatternId
              ? `· pattern: ${(exercise as PatternExercise).correctPatternId}`
              : ""}
          </div>
          <pre>{exercise.expected}</pre>
          {!runnable && (
            <>
              <p className="dim tiny">
                Compare your reasoning to the model. Recognition and free-text answers are
                self-assessed — acceptable approaches and their conditions are described above, not
                graded automatically.
              </p>
              <div className="self-assess">
                <span className="dim tiny">How did you do?</span>
                <button className={selfResult === "correct" ? "sa on" : "sa"} onClick={() => selfAssess("correct")}>Got it</button>
                <button className={selfResult === "close" ? "sa on" : "sa"} onClick={() => selfAssess("close")}>Close</button>
                <button className={selfResult === "revisit" ? "sa on" : "sa"} onClick={() => selfAssess("revisit")}>Revisit</button>
              </div>
              {selfResult && (
                <p className={`self-result ${selfResult}`}>
                  {selfResult === "correct"
                    ? "Marked solved. Recorded to your local progress."
                    : selfResult === "close"
                      ? "Noted — review the conditions and counterexamples, then try a related problem."
                      : "Noted — revisit the pattern's clues and the naive-vs-improved contrast."}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
