/**
 * R6 — authored recognition grading.
 *
 * Grades a learner's (approach, reason) selection for a `choose-approach`
 * exercise against the authored `RecognitionGrading` data. This is deliberately
 * NOT a prose grader: free-text reflection is never scored here (see
 * requirement R6.4.3). It only judges an explicit approach + reason pair.
 *
 * Acceptance rules (requirement R6.4.2):
 *  - The chosen reason must not be `contradictory`.
 *  - If the approach is in `acceptableApproachIds`, the reason must be one of
 *    that approach's `requiredReasonIds`.
 *  - Else if the approach is a declared `alternative`, the reason must be one of
 *    the alternative's `requiredReasonIds` (accepted, with its conditions noted).
 *  - Otherwise the pair is rejected with authored feedback.
 */

import type { RecognitionGrading } from "./types";

export type RecognitionVerdict = {
  outcome: "accepted" | "accepted-alternative" | "rejected";
  /** Learner-facing explanation for the verdict. */
  feedback: string;
  /** For an accepted alternative, the conditions/tradeoff that apply. */
  conditions?: string;
  tradeoff?: string;
};

export function gradeRecognition(
  grading: RecognitionGrading,
  approachId: string,
  reasonId: string,
): RecognitionVerdict {
  const approach = grading.approaches.find((a) => a.id === approachId);
  const reason = grading.reasons.find((r) => r.id === reasonId);

  if (!approach) {
    return { outcome: "rejected", feedback: "Unknown approach selected." };
  }
  if (!reason) {
    return { outcome: "rejected", feedback: "Unknown reason selected." };
  }

  // A contradictory reason never passes, regardless of approach.
  if (reason.contradictory) {
    return {
      outcome: "rejected",
      feedback:
        approach.rejectionFeedback ??
        "That justification is incorrect — it cites a property this problem does not have.",
    };
  }

  const isPrimary = grading.acceptableApproachIds.includes(approachId);
  if (isPrimary) {
    if (approach.requiredReasonIds.includes(reasonId)) {
      return { outcome: "accepted", feedback: grading.modelExplanation };
    }
    return {
      outcome: "rejected",
      feedback:
        "The approach fits, but that reason is not the property that makes it correct. Re-read the clues in the constraints.",
    };
  }

  const alt = grading.alternatives?.find((a) => a.approachId === approachId);
  if (alt) {
    if (alt.requiredReasonIds.includes(reasonId)) {
      return {
        outcome: "accepted-alternative",
        feedback: grading.modelExplanation,
        conditions: alt.conditions,
        tradeoff: alt.tradeoff,
      };
    }
    return {
      outcome: "rejected",
      feedback:
        "This can be a valid alternative, but not for that reason. Check the conditions under which it works.",
    };
  }

  return {
    outcome: "rejected",
    feedback:
      approach.rejectionFeedback ??
      "That approach is ruled out by the stated constraints. Compare it against the clues in the input and required operations.",
  };
}

/**
 * Structural validation for an authored `RecognitionGrading` block. Returns a
 * list of problems (empty = valid). Used by the curriculum verifier so a
 * malformed recognition block fails the build rather than silently mis-grading.
 */
export function validateRecognition(grading: RecognitionGrading): string[] {
  const problems: string[] = [];
  const approachIds = new Set(grading.approaches.map((a) => a.id));
  const reasonIds = new Set(grading.reasons.map((r) => r.id));

  if (grading.approaches.length < 2) {
    problems.push("needs at least two candidate approaches");
  }
  if (grading.reasons.length < 2) {
    problems.push("needs at least two candidate reasons");
  }
  if (grading.acceptableApproachIds.length < 1) {
    problems.push("needs at least one acceptable approach");
  }
  if (!grading.modelExplanation || grading.modelExplanation.trim().length === 0) {
    problems.push("modelExplanation is empty");
  }
  if (approachIds.size !== grading.approaches.length) {
    problems.push("approach ids are not unique");
  }
  if (reasonIds.size !== grading.reasons.length) {
    problems.push("reason ids are not unique");
  }

  for (const id of grading.acceptableApproachIds) {
    if (!approachIds.has(id)) {
      problems.push(`acceptable approach '${id}' is not among approaches`);
      continue;
    }
    const a = grading.approaches.find((x) => x.id === id)!;
    if (a.requiredReasonIds.length === 0) {
      problems.push(`acceptable approach '${id}' has no requiredReasonIds`);
    }
    for (const rid of a.requiredReasonIds) {
      if (!reasonIds.has(rid)) {
        problems.push(`approach '${id}' requires unknown reason '${rid}'`);
      }
      const r = grading.reasons.find((x) => x.id === rid);
      if (r?.contradictory) {
        problems.push(
          `approach '${id}' requires reason '${rid}' which is marked contradictory`,
        );
      }
    }
  }

  for (const alt of grading.alternatives ?? []) {
    if (!approachIds.has(alt.approachId)) {
      problems.push(`alternative '${alt.approachId}' is not among approaches`);
    }
    if (grading.acceptableApproachIds.includes(alt.approachId)) {
      problems.push(
        `approach '${alt.approachId}' is both a primary acceptable approach and an alternative`,
      );
    }
    if (!alt.conditions?.trim()) {
      problems.push(`alternative '${alt.approachId}' has empty conditions`);
    }
    if (alt.requiredReasonIds.length === 0) {
      problems.push(`alternative '${alt.approachId}' has no requiredReasonIds`);
    }
    for (const rid of alt.requiredReasonIds) {
      if (!reasonIds.has(rid)) {
        problems.push(`alternative '${alt.approachId}' requires unknown reason '${rid}'`);
      }
    }
  }

  // At least one reason should be contradictory so the drill can be failed on a
  // wrong justification (otherwise every reason "works" and grading is hollow).
  if (!grading.reasons.some((r) => r.contradictory)) {
    problems.push("needs at least one contradictory reason to be a meaningful drill");
  }

  return problems;
}
