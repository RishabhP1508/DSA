/**
 * R7.6 — comparison experiments UI.
 *
 * Runs an authored baseline vs improved implementation on equivalent generated
 * inputs across several sizes (using the shared engine, one job at a time),
 * VERIFIES the two produce equal results, and shows the observed OPERATION
 * COUNTS side by side. Theoretical growth curves are shown as labels only,
 * clearly separated from the observed counts; traced timing is never presented
 * as a benchmark.
 */

import { useEffect, useId, useRef, useState } from "react";
import { getSharedEngine } from "../engine/engine";
import { COMPARISONS } from "../content/comparisons";
import { parseComparisonResult } from "./comparison-result";
import { comparisonProgram } from "./comparison-program";

type Row = { size: number; baseOps: number; impOps: number; equal: boolean };

export function ComparisonLab() {
  const engine = getSharedEngine();
  const componentId = useId();
  const requestNumber = useRef(0);
  const active = useRef<{owner: string} | null>(null);
  const [selected, setSelected] = useState(COMPARISONS[0].id);
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exp = COMPARISONS.find((c) => c.id === selected) ?? COMPARISONS[0];

  useEffect(() => () => {
    const request = active.current;
    active.current = null;
    if (request) engine.stop(request.owner);
  }, [engine]);

  const stop = () => {
    const request = active.current;
    if (!request) return;
    // Invalidate before settling the engine promise, so its continuation cannot
    // publish results or launch the next implementation/size.
    active.current = null;
    engine.stop(request.owner);
    setRows([]);
    setError("Comparison stopped. No incomplete samples are shown.");
    setRunning(false);
  };

  const run = async () => {
    if (active.current) return;
    const request = {owner: `comparison:${componentId}:${++requestNumber.current}`};
    active.current = request;
    const isCurrent = () => active.current === request;
    setRunning(true);
    setError(null);
    setRows([]);
    const out: Row[] = [];
    try {
      for (const size of exp.sizes) {
        const baseline = await engine.run(comparisonProgram(exp, exp.baseline.code, size), {owner: request.owner});
        if (!isCurrent()) return;
        const b = parseComparisonResult(baseline);
        const improved = await engine.run(comparisonProgram(exp, exp.improved.code, size), {owner: request.owner});
        if (!isCurrent()) return;
        const i = parseComparisonResult(improved);
        const equal = b.result === i.result;
        if (!equal) {
          setError(`At size ${size} the two implementations disagreed — comparison aborted.`);
          break;
        }
        out.push({ size, baseOps: b.ops, impOps: i.ops, equal });
        setRows([...out]);
      }
    } catch (e) {
      if (isCurrent()) setError(e instanceof Error ? e.message : String(e));
    } finally {
      if (isCurrent()) {
        active.current = null;
        setRunning(false);
      }
    }
  };

  return (
    <div className="panel comparison-lab">
      <h4>Compare algorithms</h4>
      <label className="speed-control">
        Experiment
        <select value={selected} disabled={running} onChange={(e) => {
          if (active.current) return;
          setSelected(e.target.value); setRows([]); setError(null);
        }}>
          {COMPARISONS.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </label>
      <p className="dim">{exp.problem}</p>
      <ul className="dim tiny">
        <li><strong>{exp.baseline.label}</strong> — theoretical {exp.baseline.theoretical}</li>
        <li><strong>{exp.improved.label}</strong> — theoretical {exp.improved.theoretical}</li>
      </ul>
      <button onClick={run} disabled={running}>
        {running ? "Comparing…" : "Compare implementations"}
      </button>
      {running && <button onClick={stop}>Stop comparison</button>}
      {error && <p className="error" role="status">{error}</p>}
      {rows.length > 0 && (
        <>
          <table className="vars">
            <thead>
              <tr>
                <th>input size</th>
                <th title={exp.operation}>{exp.baseline.label} ops</th>
                <th title={exp.operation}>{exp.improved.label} ops</th>
                <th>equal result?</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.size}>
                  <td>{r.size}</td>
                  <td>{r.baseOps}</td>
                  <td>{r.impOps}</td>
                  <td>{r.equal ? "✓" : "✗"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="dim tiny">
            Observed counts of "{exp.operation}" on equivalent inputs — evidence about these runs,
            not a proof. The theoretical curves above are labels, not fitted from these numbers.
          </p>
        </>
      )}
    </div>
  );
}
