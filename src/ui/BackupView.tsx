/**
 * Backup & progress view.
 *
 * Shows a local progress summary and provides versioned JSON backup/restore.
 * Export downloads a file; import validates BEFORE replacing local data, so a
 * malformed or foreign file is rejected with a clear message and the current
 * progress is left intact.
 */

import { useEffect, useRef, useState } from "react";
import {
  exportBackup,
  importBackup,
  progressSummary,
  BACKUP_VERSION,
  loadPreRestoreSnapshot,
  migrateProgress,
} from "../storage/progress";

export function BackupView() {
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof progressSummary>> | null>(null);
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [hasPrevious,setHasPrevious] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const refresh = () => { void progressSummary().then(setSummary);void loadPreRestoreSnapshot().then(value=>setHasPrevious(!!value)); };
  useEffect(refresh, []);

  const doExport = async () => {
    const envelope = await exportBackup();
    const blob = new Blob([JSON.stringify(envelope, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    a.href = url;
    a.download = `dsa-visual-lab-backup-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus({ kind: "ok", text: "Backup downloaded." });
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const result = await importBackup(text);
    if (result.ok) {
      setStatus({
        kind: "ok",
        text: `Restored backup from ${new Date(result.envelope.exportedAt).toLocaleString()}. Local progress replaced.`,
      });
      refresh();
    } else {
      setStatus({ kind: "error", text: `Import rejected: ${result.error} Your existing progress was not changed.` });
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const recoverPrevious = async () => {
    const snapshot=await loadPreRestoreSnapshot();if(!snapshot)return;
    const envelope=await exportBackup();
    const result=await importBackup(JSON.stringify({...envelope,data:migrateProgress(snapshot)}));
    setStatus(result.ok?{kind:'ok',text:'Previous snapshot restored. No saved source was executed.'}:{kind:'error',text:result.error});
    refresh();
  };
  return (
    <div className="app-body">
      <main className="content" id="main-content">
        <div className="lesson-content">
          <h2>Backup &amp; progress</h2>
          <p className="dim">
            Progress is stored locally in this browser profile. Use a backup to move it to another
            browser or computer. Backups are versioned JSON (current version {BACKUP_VERSION}).
          </p>

          <section>
            <h3>Your progress</h3>
            {summary ? (
              <table className="complexity">
                <tbody>
                  <tr><td>Lessons viewed</td><td>{summary.lessonsViewed}</td></tr>
                  <tr><td>Lessons completed</td><td>{summary.lessonsCompleted}</td></tr>
                  <tr><td>Exercises attempted</td><td>{summary.exercisesAttempted}</td></tr>
                  <tr><td>Exercises solved</td><td>{summary.exercisesSolved}</td></tr>
                  <tr><td>Saved drafts</td><td>{summary.drafts}</td></tr>
                </tbody>
              </table>
            ) : (
              <p className="dim">Loading…</p>
            )}
          </section>

          <section>
            <h3>Export</h3>
            <p className="dim">Download a JSON backup of all local progress, drafts and preferences.</p>
            <button onClick={doExport}>⬇ Download backup</button>
          </section>

          <section>
            <h3>Restore</h3>
            <p className="dim">
              Import a backup file. It is validated first; only a valid DSA Visual Lab backup will
              replace your current data.
            </p>
            <label className="answer-label">Choose a backup to restore<input aria-label="Backup file to restore" ref={fileRef} type="file" accept="application/json,.json" onChange={onFile} /></label><p className="dim tiny">A snapshot of your current data is kept before a successful import.</p>{hasPrevious&&<button onClick={()=>void recoverPrevious()}>Restore previous snapshot</button>}
          </section>

          {status && (
            <p role="status" className={status.kind === "ok" ? "self-result correct" : "error"}>{status.text}</p>
          )}
        </div>
      </main>
    </div>
  );
}
