import type { TraceEvent, VisualBinding } from '../core/types';
import { resolveBindingValue } from './helpers';

export interface BindingGroup { binding: VisualBinding; objectId?: string; names: string[] }

/** Stable semantic configuration. Different overlays/models must stay separate views. */
function canonical(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([key,item])=>JSON.stringify(key)+':'+canonical(item)).join(',') + '}';
  return JSON.stringify(value) ?? 'undefined';
}

/** Visible names respect inner-frame shadowing; identity comes only from snapshots. */
function namesForObject(event: TraceEvent, id: string): string[] {
  const seen = new Set<string>();
  const names: string[] = [];
  for (const frame of [...event.frames].reverse()) for (const local of frame.locals) {
    if (seen.has(local.name)) continue;
    seen.add(local.name);
    if (local.value.kind === 'ref' && local.value.id === id) names.push(local.name);
  }
  return names;
}

export function groupBindings(event: TraceEvent, bindings: VisualBinding[]): BindingGroup[] {
  const groups: BindingGroup[] = [];
  const identities = new Map<string, BindingGroup>();
  for (const binding of bindings) {
    const value = resolveBindingValue(event, binding);
    const objectId = binding.model !== 'recursion' && value?.kind === 'ref' && event.objects[value.id] ? value.id : undefined;
    const name = binding.variable + (binding.path ? '.' + binding.path : '');
    const { variable: _variable, path: _path, ...configuration } = binding;
    // A recursion view represents the stack, not the binding's object.
    const key = objectId && binding.model !== 'recursion' ? objectId + ':' + canonical(configuration) : undefined;
    const existing = key ? identities.get(key) : undefined;
    if (existing) { if (!existing.names.includes(name)) existing.names.push(name); continue; }
    const names = [name];
    if (objectId && binding.model !== 'recursion') for (const alias of namesForObject(event, objectId)) if (!names.includes(alias)) names.push(alias);
    const group = { binding, objectId, names };
    groups.push(group);
    if (key) identities.set(key, group);
  }
  return groups;
}
