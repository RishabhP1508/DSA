import type { ReactNode } from 'react';

export type OutlineEntry = { id: string; label: string };

/** One reading outline, with a compact disclosure on smaller screens. */
export function StudyOutline({ entries, children }: { entries: OutlineEntry[]; children?: ReactNode }) {
  const links = () => <nav aria-label="On this page"><ol>{entries.map((entry, index) =>
    <li key={entry.id}><a href={`#${entry.id}`}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{entry.label}</a></li>
  )}</ol></nav>;
  return <aside className="reader-outline">
    <div className="outline-desktop"><h2>On this page</h2>{links()}</div>
    <details className="outline-mobile"><summary>On this page</summary>{links()}</details>
    {children}
  </aside>;
}
