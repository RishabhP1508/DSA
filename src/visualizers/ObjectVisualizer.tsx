/**
 * Generic object / reference visualizer (fallback).
 *
 * When a value has no specific conceptual model, it is shown as a titled box of
 * fields (for objects/containers) or an inline value. This is the "generic
 * object/reference view" the plan requires so unrecognized values remain
 * inspectable rather than hidden.
 */

import type { TraceEvent, VisualBinding } from "../core/types";
import { resolveBindingObject } from "./helpers";
import { boundedSvgStyle, DiagramCaption, DiagramNotice, SvgLabel, bindingLabel, sequencePreview, collectionNotice, cellDisplay, labelDisplay, valueNotice } from './limits';

const PAD = 16;
const ROW_H = 36;
const TOP = 40;

export function ObjectVisualizer({ event, binding }: { event: TraceEvent; binding: VisualBinding }) {
  const { value, object: obj } = resolveBindingObject(event, binding);

  if (!value) {
    return <p className="viz-empty">“{bindingLabel(binding)}” is not in scope yet.</p>;
  }

  // Inline (primitive) value.
  if (value.kind !== "ref") {
    return (
      <><DiagramCaption><code>{bindingLabel(binding)}</code> · {value.kind}</DiagramCaption><svg className="array-viz" style={boundedSvgStyle(260,80)} viewBox={`0 0 260 80`} role="img" aria-label={`${bindingLabel(binding)} value`}>
        <rect x={PAD} y={TOP} width={228} height={34} rx={6} className="cell" />
        <SvgLabel x={130} y={TOP + 17} className="cell-value" text={cellDisplay(value, event.objects).text} maxChars={25}/>
      </svg></>
    );
  }

  if (!obj) return <p className="viz-empty">Reference to a value not captured in this step.</p>;

  const entries = sequencePreview(obj);
  const values = entries.map(entry=>cellDisplay(entry.value,event.objects));
  const width = 420;
  const height = TOP + Math.max(1, entries.length) * ROW_H + 14;

  return (
    <><DiagramCaption><code>{bindingLabel(binding)}</code> · {labelDisplay(obj.type).text}</DiagramCaption><svg className="array-viz" style={boundedSvgStyle(width,height)} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${bindingLabel(binding)} (${labelDisplay(obj.type).text})`}>
      <text x={PAD} y={22} className="cell-index" style={{textAnchor:'start'}}>Field / key</text><text x={PAD + 180} y={22} className="cell-index" style={{textAnchor:'start'}}>Value</text>
      {obj.repr && entries.length === 0 && (
        <SvgLabel x={PAD+180} y={TOP+18} className="cell-value-sm" text={labelDisplay(obj.repr).text} maxChars={40}/>
      )}
      {!obj.repr && entries.length === 0 && <text x={PAD} y={TOP+18} className="viz-empty-svg">(no recorded fields)</text>}
      {entries.map((e, i) => {
        const y = TOP + i * ROW_H;
        return (
          <g key={e.key}>
            <SvgLabel x={PAD} y={y + 18} className="var-name-svg" text={e.keyKind === 'str' ? JSON.stringify(labelDisplay(e.key).text) : labelDisplay(e.key).text} maxChars={20}/>
            <SvgLabel x={PAD + 180} y={y + 18} className="cell-value-sm" textAnchor="start" style={{textAnchor:'start'}} text={values[i].text} maxChars={27}/>
          </g>
        );
      })}
    </svg><DiagramNotice text={[collectionNotice(obj,entries),valueNotice(values)].filter(Boolean).join(' ')}/></>
  );
}
