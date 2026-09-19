/**
 * Time & Space complexity panel (plan §4).
 *
 * Renders an authored ComplexityExplanation: the input-size variables, the time
 * and space bounds with their case, a plain-English line-linked derivation, the
 * cost model and assumptions, tradeoffs, and — when a run is available —
 * observed operation counts for the current input.
 *
 * Observed counts are explicitly labelled as evidence about this run, not a
 * proof of asymptotic growth (plan §4, §9). Auxiliary space excludes the
 * tracer/visualization machinery by construction (see engine/complexity.ts).
 */

import { useMemo } from "react";
import type { ComplexityExplanation, RunResult } from "../core/types";
import { computeObservedStats } from "../engine/complexity";

export function ComplexityPanel({
  explanation,
  result,
  onHighlightLines,
  fixedData,
}: {
  explanation: ComplexityExplanation;
  result: RunResult | null;
  /** Hover a derivation row to highlight its code lines. */
  onHighlightLines?: (lines: number[] | null) => void;
  /** Whether the lesson's code uses fixed literal data. */
  fixedData?: boolean;
}) {
  const observed = useMemo(
    () => (result ? computeObservedStats(result, explanation.counters ?? []) : null),
    [result, explanation.counters],
  );

  return (
    <div className="panel complexity-panel">
      <h4>Time &amp; Space</h4>

      {explanation.variables.length > 0 && (
        <section>
          <h5>Input size</h5>
          <ul className="cx-vars">
            {explanation.variables.map((v) => (
              <li key={v.symbol}>
                <code>{v.symbol}</code> — {v.meaning}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="cx-bounds">
        <div className="cx-bound">
          <span className="cx-tag">Time</span>
          <code className="cx-big">{explanation.time.bound}</code>
          <span className="cx-case">{explanation.time.case} case</span>
          <p>{explanation.time.explanation}</p>
          {explanation.time.otherCases?.map((c) => (
            <p key={c.case} className="dim">
              <strong>{c.case}:</strong> <code>{c.bound}</code> — {c.note}
            </p>
          ))}
        </div>
        <div className="cx-bound">
          <span className="cx-tag">Space (auxiliary)</span>
          <code className="cx-big">{explanation.space.bound}</code>
          <span className="cx-case">{explanation.space.case} case</span>
          <p>{explanation.space.explanation}</p>
          {explanation.space.inputOutputNote && (
            <p className="dim">Input/output storage: {explanation.space.inputOutputNote}</p>
          )}
        </div>
      </section>

      <section>
        <h5>Why (line by line)</h5>
        <ul className="cx-derivation">
          {explanation.derivation.map((d, i) => (
            <li
              key={i}
              onMouseEnter={() => onHighlightLines?.(d.lines)}
              onMouseLeave={() => onHighlightLines?.(null)}
            >
              <span className={`cx-dim-tag cx-${d.dimension}`}>{d.dimension}</span>
              <code>{d.cost}</code>{" "}
              <span className="cx-lines">lines {d.lines.join(", ")}</span>: {d.description}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h5>Cost model &amp; assumptions</h5>
        <p className="dim">{explanation.costModel}</p>
        <ul>
          {explanation.assumptions.map((a, i) => (
            <li key={i} className="dim">{a}</li>
          ))}
        </ul>
      </section>

      {explanation.tradeoffs && (
        <section>
          <h5>Tradeoffs</h5>
          <p className="dim">{explanation.tradeoffs}</p>
        </section>
      )}

      {fixedData && explanation.fixedDataNote && (
        <section>
          <h5>This run vs the general algorithm</h5>
          <p className="dim">{explanation.fixedDataNote}</p>
        </section>
      )}

      {observed && (
        <section className="cx-observed">
          <h5>Observed on this run</h5>
          <p className="dim cx-caveat">
            Evidence for this input only — not a proof of Big-O. Excludes tracing overhead.
          </p>
          <table className="vars">
            <tbody>
              <tr><td>trace events</td><td>{observed.totalEvents}</td></tr>
              <tr><td>max call depth</td><td>{observed.maxDepth}</td></tr>
              <tr><td>function calls</td><td>{observed.totalCalls}</td></tr>
              {observed.counters.map((c) => (
                <tr key={c.label}>
                  <td title={c.definition}>{c.label}</td>
                  <td>{c.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
