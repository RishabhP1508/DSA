import type { RunProgress } from '../engine/engine';
import type { RunResult } from '../core/types';

export function RuntimeProgress({ running, progress, result }: { running: boolean; progress?: RunProgress | null; result?: RunResult | null }) {
  if (running) return <div className="runtime-progress" role="status" aria-live="polite">
    <span className="activity-dot" />{progress ? `Recording · ${progress.eventCount} states received` : 'Starting Python…'}
    {progress?.stdout && <pre aria-label="Live program output">{progress.stdout}</pre>}
  </div>;
  if (result?.incomplete) return <div className="partial-notice" role="status">
    {result.status === 'stopped' ? 'Stopped. ' : 'Execution limit reached. '}
    These {result.events.length} recorded states are partial. You can replay them; the program did not finish.
  </div>;
  return null;
}
