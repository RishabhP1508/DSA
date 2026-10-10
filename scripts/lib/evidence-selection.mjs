/** Validate a targeted evidence run before any content files are written. */
export function evidenceSelection(raw, lessons, patterns) {
  if (raw===undefined) return null;
  const requested=new Set(raw.split(',').map(x=>x.trim()).filter(Boolean));
  if (!requested.size) throw new Error('EVIDENCE_ONLY must list at least one kind:id');
  const known=new Set([...lessons.map(x=>'lesson:'+x.id),...patterns.map(x=>'pattern:'+x.id)]);
  for(const key of requested)if(!known.has(key))throw new Error(`Unknown EVIDENCE_ONLY item ${key}`);
  return requested;
}
