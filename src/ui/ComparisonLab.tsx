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

import { useState } from "react";
import { getSharedEngine } from "../engine/engine";
import { COMPARISONS } from "../content/comparisons";
import type { ComparisonExperiment } from "../core/types";

type Row = { size: number; baseOps: number; impOps: number; equal: boolean };

// Wrap an authored implementation into a runnable program that generates the
// input, counts `__op()` calls, runs solve, and prints "result|ops".
function program(exp: ComparisonExperiment, code: string, size: number): string {
  return (
    `_ops = [0]\n` +
    `def __op():\n    _ops[0] += 1\n` +
    exp.inputGenerator +
    `\n` +
    code +
    `\n_args = gen(${size})\n_res = solve(*_args)\n` +
    `print(repr(_res) + "|" + str(_ops[0]))\n`
  );
}

async function runOne(exp: ComparisonExperiment, code: string, size: number) {
  const engine = getSharedEngine();
  const res = await engine.run(program(exp, code, size), { owner: "comparison" });
  const line = (res.stdout || "").trim().split("\n").pop() ?? "";
  const [result, ops] = line.split("|");
  return { result, ops: Number(ops) };
}

export function ComparisonLab() {
  const [selected, setSelected] = useState(COMPARISONS[0].id);
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exp = COMPARISONS.find((c) => c.id === selected) ?? COMPARISONS[0];

  const run = async () => {
    setRunning(true);
    setError(null);
    setRows([]);
    const out: Row[] = [];
    try {
      for (const size of exp.sizes) {
        const b = await runOne(exp, exp.baseline.code, size);
        const i = await runOne(exp, exp.improved.code, size);
        const equal = b.result === i.result;
        if (!equal) {
          setError(`At size ${size} the two implementations disagreed — comparison aborted.`);
          break;
        }
        out.push({ size, baseOps: b.ops, impOps: i.ops, equal });
        setRows([...out]);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="panel comparison-lab">
      <h4>Compare algorithms</h4>
      <label className="speed-control">
        Experiment
        <select value={selected} onChange={(e) => { setSelected(e.target.value); setRows([]); }}>
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
      {error && <p className="error">{error}</p>}
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
