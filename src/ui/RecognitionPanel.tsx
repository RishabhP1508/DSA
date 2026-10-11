/**
 * R6 — interactive recognition grading UI.
 *
 * Renders the authored `RecognitionGrading` for a `choose-approach` exercise:
 * the learner picks ONE approach and ONE reason, and the panel grades the pair
 * with `gradeRecognition` (authored acceptable approaches, required reasons, and
 * valid alternatives with their conditions). This is NOT prose grading — the
 * optional free-text reflection is shown with a model explanation and is never
 * scored (plan §3 / requirement R6.4.3).
 */

import { useId, useState, type ReactNode } from "react";
import type { RecognitionGrading } from "../core/types";
import { gradeRecognition, type RecognitionVerdict } from "../core/recognition-grading";
import { Button } from '../components/ui/button';
import { mdInline } from './md';

export function RecognitionPanel({
  grading,
  onGraded,
  hintAction,
}: {
  grading: RecognitionGrading;
  /** Reports a graded verdict so the owner can record an attempt. */
  onGraded?: (accepted: boolean) => void;
  hintAction?: ReactNode;
}) {
  const groupId = useId();
  const [approachId, setApproachId] = useState<string | null>(null);
  const [reasonId, setReasonId] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<RecognitionVerdict | null>(null);
  const [reflection, setReflection] = useState("");
  const [showModel, setShowModel] = useState(false);

  const check = () => {
    if (!approachId || !reasonId) return;
    const v = gradeRecognition(grading, approachId, reasonId);
    setVerdict(v);
    onGraded?.(v.outcome !== "rejected");
  };

  const accepted = verdict && verdict.outcome !== "rejected";

  return (
    <div className="recognition-block">
      <p className="recognition-scenario" dangerouslySetInnerHTML={{__html:mdInline(grading.scenario)}} />

      <fieldset className="recognition-group">
        <legend>Which approach fits?</legend>
        {grading.approaches.map((a) => (
          <label key={a.id} className={'recognition-choice' + (approachId === a.id ? ' is-selected' : '')}>
            <input
              type="radio"
              name={`${groupId}-approach`}
              value={a.id}
              checked={approachId === a.id}
              onChange={() => {
                setApproachId(a.id);
                setVerdict(null);
              }}
            />
            <span className="choice-copy" dangerouslySetInnerHTML={{__html:mdInline(a.label)}} />
          </label>
        ))}
      </fieldset>

      <fieldset className="recognition-group">
        <legend>Because…</legend>
        {grading.reasons.map((r) => (
          <label key={r.id} className={'recognition-choice' + (reasonId === r.id ? ' is-selected' : '')}>
            <input
              type="radio"
              name={`${groupId}-reason`}
              value={r.id}
              checked={reasonId === r.id}
              onChange={() => {
                setReasonId(r.id);
                setVerdict(null);
              }}
            />
            <span className="choice-copy" dangerouslySetInnerHTML={{__html:mdInline(r.text)}} />
          </label>
        ))}
      </fieldset>

      <div className="exercise-actions">
        <Button onClick={check} disabled={!approachId || !reasonId}>
          Check my reasoning
        </Button>
        {hintAction}
        <Button variant="secondary" onClick={() => setShowModel((s) => !s)}>
          {showModel ? "Hide explanation" : "Show model explanation"}
        </Button>
      </div>

      {verdict && (
        <div className={`recognition-verdict ${accepted ? "accepted" : "rejected"}`} role="status">
          <strong>
            {verdict.outcome === "accepted"
              ? "✓ Correct — that approach and reason hold."
              : verdict.outcome === "accepted-alternative"
                ? "✓ Valid alternative — with conditions."
                : "✗ Not quite."}
          </strong>
          <p dangerouslySetInnerHTML={{__html:mdInline(verdict.feedback)}} />
          {verdict.conditions && (
            <p className="dim tiny">Conditions: {verdict.conditions}</p>
          )}
          {verdict.tradeoff && <p className="dim tiny">Tradeoff: {verdict.tradeoff}</p>}
        </div>
      )}

      {showModel && (
        <div className="model-answer">
          <div className="dim tiny">Model explanation</div>
          <p dangerouslySetInnerHTML={{__html:mdInline(grading.modelExplanation)}} />
          {grading.alternatives && grading.alternatives.length > 0 && (
            <ul className="dim tiny">
              {grading.alternatives.map((alt) => (
                <li key={alt.approachId}>
                  Alternative ({alt.approachId}): {alt.conditions} — {alt.tradeoff}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {grading.reflectionPrompt && (
        <label className="answer-label">
          {grading.reflectionPrompt}
          <textarea
            className="answer-box"
            rows={3}
            value={reflection}
            placeholder="Optional — this reflection is not auto-graded."
            onChange={(e) => setReflection(e.target.value)}
          />
          <span className="dim tiny">
            Free-text reflection is not graded automatically; compare it to the model
            explanation above.
          </span>
        </label>
      )}
    </div>
  );
}
