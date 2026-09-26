// @vitest-environment node
/**
 * R6 — recognition grading unit tests (requirement R6.4).
 *
 * These lock in the authored grading behaviour: an acceptable approach with a
 * required reason passes; a valid alternative passes with its conditions; a
 * ruled-out approach, a contradictory reason, and an approach/reason mismatch
 * all fail with feedback. Free-text is never graded here.
 */
import { describe, it, expect } from "vitest";
import { gradeRecognition, validateRecognition } from "./recognition-grading";
import type { RecognitionGrading } from "./types";

const grading: RecognitionGrading = {
  scenario:
    "Largest sum of exactly k consecutive elements in an array of integers.",
  approaches: [
    { id: "fixed-window", label: "Fixed-size sliding window", requiredReasonIds: ["fixed-len"] },
    { id: "prefix", label: "Prefix sums", requiredReasonIds: ["range-sum"] },
    {
      id: "kadane",
      label: "Kadane's algorithm",
      requiredReasonIds: [],
      rejectionFeedback:
        "Kadane finds the best contiguous segment of ANY length, not exactly k — it does not honour the fixed window.",
    },
  ],
  reasons: [
    { id: "fixed-len", text: "The window length is fixed at k, so we slide one window across the array." },
    { id: "range-sum", text: "We repeatedly need sums of fixed ranges, which prefix sums answer in O(1)." },
    { id: "any-len", text: "The best segment can be any length.", contradictory: true },
  ],
  acceptableApproachIds: ["fixed-window"],
  alternatives: [
    {
      approachId: "prefix",
      conditions: "Prefix sums also give each k-window sum in O(1) after an O(n) precompute.",
      tradeoff: "Sliding window uses O(1) auxiliary space; prefix sums use O(n).",
      requiredReasonIds: ["range-sum"],
    },
  ],
  modelExplanation:
    "The window length is fixed at k, so a fixed-size sliding window is the direct approach: add the entering element, drop the leaving one.",
};

describe("gradeRecognition", () => {
  it("accepts the primary approach with its required reason", () => {
    const v = gradeRecognition(grading, "fixed-window", "fixed-len");
    expect(v.outcome).toBe("accepted");
    expect(v.feedback).toContain("fixed-size sliding window");
  });

  it("accepts a valid alternative and reports its conditions and tradeoff", () => {
    const v = gradeRecognition(grading, "prefix", "range-sum");
    expect(v.outcome).toBe("accepted-alternative");
    expect(v.conditions?.toLowerCase()).toContain("prefix sums");
    expect(v.tradeoff).toContain("O(1)");
  });

  it("rejects an approach ruled out by the constraints, with feedback", () => {
    const v = gradeRecognition(grading, "kadane", "fixed-len");
    expect(v.outcome).toBe("rejected");
    expect(v.feedback.toLowerCase()).toContain("any length");
  });

  it("rejects a contradictory reason regardless of approach", () => {
    const v = gradeRecognition(grading, "fixed-window", "any-len");
    expect(v.outcome).toBe("rejected");
  });

  it("rejects the right approach paired with the wrong (non-required) reason", () => {
    const v = gradeRecognition(grading, "fixed-window", "range-sum");
    expect(v.outcome).toBe("rejected");
    expect(v.feedback).toContain("not the property");
  });

  it("rejects unknown approach or reason ids", () => {
    expect(gradeRecognition(grading, "nope", "fixed-len").outcome).toBe("rejected");
    expect(gradeRecognition(grading, "fixed-window", "nope").outcome).toBe("rejected");
  });
});

describe("validateRecognition", () => {
  it("passes for the well-formed grading block", () => {
    expect(validateRecognition(grading)).toEqual([]);
  });

  it("flags an acceptable approach with no required reasons", () => {
    const bad: RecognitionGrading = {
      ...grading,
      approaches: grading.approaches.map((a) =>
        a.id === "fixed-window" ? { ...a, requiredReasonIds: [] } : a,
      ),
    };
    expect(validateRecognition(bad)).toContain("acceptable approach 'fixed-window' has no requiredReasonIds");
  });

  it("flags a drill with no contradictory reason", () => {
    const bad: RecognitionGrading = {
      ...grading,
      reasons: grading.reasons.map((r) => ({ ...r, contradictory: false })),
    };
    expect(validateRecognition(bad)).toContain(
      "needs at least one contradictory reason to be a meaningful drill",
    );
  });

  it("flags a required reason that is marked contradictory", () => {
    const bad: RecognitionGrading = {
      ...grading,
      reasons: grading.reasons.map((r) =>
        r.id === "fixed-len" ? { ...r, contradictory: true } : r,
      ),
    };
    expect(validateRecognition(bad)).toContain(
      "approach 'fixed-window' requires reason 'fixed-len' which is marked contradictory",
    );
  });
});
