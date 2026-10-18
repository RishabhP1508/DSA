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
import { boundedSvgStyle, DiagramCaption, DiagramNotice, SvgLabel, cellDisplay, labelDisplay, STACK_LIMIT } from './limits';

const ROW_H = 112;
const PAD = 12;
const TOP = 16;

export function RecursionVisualizer({ event }: { event: TraceEvent }) {
  const frames = event.frames;
  if (frames.length === 0) return <p className="viz-empty">No active frames.</p>;

  // Draw innermost (deepest) at the top so growth pushes downward visually.
  const ordered = [...frames].reverse().slice(0, STACK_LIMIT);
  const width = 340;
  const height = TOP + ordered.length * (ROW_H + 6) + 8;

  return (
    <><DiagramCaption>Call stack · {frames.length} active frames · current frame first</DiagramCaption><svg className="array-viz" style={boundedSvgStyle(width, height)} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Call stack, depth ${frames.length}`}>
      {ordered.map((f, i) => {
        const y = TOP + i * (ROW_H + 6);
        const locals = f.locals.slice(0, 4);
        const isTop = i === 0;
        return (
          <g key={i}>
            <rect x={PAD} y={y} width={width - PAD * 2} height={ROW_H} rx={6} className={isTop ? "cell cell-active" : "cell"} />
            <SvgLabel x={PAD + 10} y={y + 22} className="frame-name" text={`${f.name === '<module>' ? 'Main program' : labelDisplay(f.name).text+'()'} · line ${f.line}`} maxChars={29}/>
            {locals.length === 0 && <text x={PAD + 10} y={y + 44} className="frame-args">(no local variables)</text>}
            {locals.map((local, j) => <SvgLabel key={local.name} x={PAD + 10} y={y + 44 + j * 18} className="frame-args" text={`${labelDisplay(local.name).text} = ${cellDisplay(local.value, event.objects).text}`} maxChars={39}/>)}
            {isTop && <text x={width - PAD - 6} y={y + 22} className="pointer-label" textAnchor="end">top</text>}
          </g>
        );
      })}
    </svg><DiagramNotice text={[frames.length > ordered.length ? `Display limit: showing the ${ordered.length} innermost of ${frames.length} active frames.` : '', ordered.some(f=>f.locals.length>4) ? 'Each frame previews up to four local variables. The variables inspector shows all recorded locals.' : ''].filter(Boolean).join(' ')}/></>
  );
}
