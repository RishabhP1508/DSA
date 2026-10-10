/**
 * R7.5 — personal-code complexity panel for the Playground.
 *
 * For the learner's OWN program this panel is deliberately humble:
 *  - it shows the CONSERVATIVE static analysis (an auto-supported bound only for
 *    the sanctioned forms, otherwise an explicit "Complexity not determined
 *    automatically" state with the exact reason);
 *  - it shows OBSERVED statistics from the recorded run (this input only, never
 *    a proof of Big-O), honestly categorised and cumulative to the current
 *    playback step;
 *  - it offers a guided WORKSHEET (input size / repeated work / allocations /
 *    recursion) so the learner reasons it out when the analyzer cannot.
 *
 * It NEVER guesses a bound and never infers meaning from variable names.
 */

import { useMemo } from "react";
import type { RunResult } from "../core/types";
import { computeObservedStats } from "../engine/complexity";

export function PersonalComplexityPanel({
  result,
  currentIndex,
  stale,
}: {
  result: RunResult | null;
  currentIndex?: number;
  /** When the trace predates the current edit, observed stats are hidden. */
  stale?: boolean;
}) {
  const observed = useMemo(
    () => (result && !stale ? computeObservedStats(result, [], currentIndex) : null),
    [result, currentIndex, stale],
  );
  const whole = useMemo(
    () => (result && !stale ? computeObservedStats(result, []) : null),
    [result, stale],
  );
  const analysis = stale ? undefined : result?.analysis;

  return (
    <div className="panel complexity-panel personal-cx">
      <h4>Time &amp; Space (your code)</h4>

      <section>
        <h5>Automatic analysis</h5>
        {!analysis && <p className="dim">Run your code to analyze it.</p>}
        {analysis?.source === "auto-supported" && (
          <>
            <p>
              <span className="cx-tag">Time</span> <code className="cx-big">{analysis.time}</code>{" "}
              <span className="dim">({analysis.scope} scope, supported form)</span>
            </p>
            {analysis.sizeVars && analysis.sizeVars.length > 0 && (
              <ul className="cx-vars">
                {analysis.sizeVars.map((v) => (
                  <li key={v.symbol}>
                    <code>{v.symbol}</code> — {v.meaning}
                  </li>
                ))}
              </ul>
            )}
            {analysis.supportedFindings?.map((f, i) => (
              <p key={i} className="dim">{f}</p>
            ))}
            <p className="dim tiny">
              Established only for the supported forms (fixed work, bounded/sequential/nested
              loops over recognized inputs). It is a conservative static claim, not a measured one.
            </p>
          </>
        )}
        {analysis?.source === "not-determined" && (
          <div className="cx-not-determined">
            <strong>Complexity not determined automatically.</strong>
            <p className="dim">{analysis.uncertaintyReason}</p>
            <p className="dim tiny">
              This is honest, not a failure: the analyzer only claims a bound for the forms it can
              prove. Use the worksheet below to reason it out yourself.
            </p>
          </div>
        )}
      </section>

      {observed && whole && (
        <section className="cx-observed">
          <h5>Observed on this run</h5>
          <p className="dim cx-caveat">
            Evidence for this input only — not a proof of Big-O. Excludes tracing overhead. The
            middle column is cumulative up to the current step.
          </p>
          <table className="vars">
            <thead>
              <tr><th>metric</th><th>at this step</th><th>whole run</th></tr>
            </thead>
            <tbody>
              <tr><td>trace events</td><td>{observed.traceEvents}</td><td>{whole.traceEvents}</td></tr>
              <tr><td>line entries</td><td>{observed.lineEntries}</td><td>{whole.lineEntries}</td></tr>
              <tr><td>user-function calls</td><td>{observed.userFunctionCalls}</td><td>{whole.userFunctionCalls}</td></tr>
              <tr><td>max call depth</td><td>{observed.maxDepth}</td><td>{whole.maxDepth}</td></tr>
            </tbody>
          </table>
        </section>
      )}

      <details className="cx-worksheet">
        <summary>Complexity worksheet</summary>
        <ol className="dim">
          <li>What is the input size? Name the variable(s) that grow (e.g. length of a list, number of nodes/edges).</li>
          <li>What work repeats with the input? Find the loops/recursion and how many times each runs in terms of the input size.</li>
          <li>What extra storage grows with the input? Count new lists/dicts/sets/strings and the recursion depth.</li>
          <li>Is there recursion? Distinguish the total number of calls (time) from the deepest simultaneous stack (space).</li>
          <li>Combine: add sequential parts, multiply nested parts, keep the dominant term.</li>
        </ol>
      </details>
    </div>
  );
}
