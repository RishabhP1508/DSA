/**
 * Recursion / call-stack visualizer.
 *
 * Renders the live call stack from the current event's frames (innermost last),
 * showing each frame's function name and arguments/locals. This makes the depth
 * of recursion and the value of parameters at each level visible, and — stepped
 * forward/back — shows the stack growing and unwinding.
 *
 * Unlike the other visualizers this reads `event.frames` directly rather than a
 * bound variable, so its binding only needs a model of "object"/recursion.
 */

import type { TraceEvent } from "../core/types";
import { displayValue } from "../engine/replay";

const ROW_H = 52;
const PAD = 12;
const TOP = 40;

export function RecursionVisualizer({ event }: { event: TraceEvent }) {
  const frames = event.frames;
  if (frames.length === 0) return <p className="viz-empty">No active frames.</p>;

  // Draw innermost (deepest) at the top so growth pushes downward visually.
  const ordered = [...frames].reverse();
  const width = 340;
  const height = TOP + ordered.length * (ROW_H + 6) + 8;

  return (
    <svg className="array-viz" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Call stack, depth ${frames.length}`}>
      <text x={PAD} y={22} className="viz-title">call stack (depth {frames.length})</text>
      {ordered.map((f, i) => {
        const y = TOP + i * (ROW_H + 6);
        const args = f.locals
          .slice(0, 4)
          .map((l) => `${l.name}=${displayValue(l.value, event.objects)}`)
          .join(", ");
        const isTop = i === 0;
        return (
          <g key={i}>
            <rect x={PAD} y={y} width={width - PAD * 2} height={ROW_H} rx={6} className={isTop ? "cell cell-active" : "cell"} />
            <text x={PAD + 10} y={y + 20} className="frame-name">{f.name}() · line {f.line}</text>
            <text x={PAD + 10} y={y + 40} className="frame-args">{args || "(no args)"}</text>
            {isTop && <text x={width - PAD - 6} y={y + 20} className="pointer-label" textAnchor="end">← top</text>}
          </g>
        );
      })}
    </svg>
  );
}
