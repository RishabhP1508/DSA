/**
 * Versioned message protocol for the execution runner (R2.3 / R2.5).
 *
 * The main-thread coordinator (engine.ts) and the run worker (run.worker.ts)
 * speak ONLY through the envelopes defined here. Every message carries:
 *   - `v`         protocol version (mismatched versions are rejected)
 *   - `runId`     the run this message belongs to (stale ids are rejected)
 *   - `owner`     the workspace/exercise id that requested the run
 *   - `sourceRev` 32-bit hash of the source that produced the run
 *   - `inputRev`  32-bit hash of the stdin that produced the run
 *   - `seq`       monotonic per-run sequence number (out-of-order is rejected)
 *   - `kind`      message kind
 *   - `payload`   kind-specific, schema-validated data
 *
 * Validation is HAND-WRITTEN (see .kiro/specs/R2-worker-lifecycle/design.md
 * "Validator choice"): Zod is not yet a dependency, the payload set is small and
 * closed, and this code runs inside the worker under a strict CSP where keeping
 * third-party code off the isolation boundary is a security positive. The
 * validator interfaces are shaped so R3 can migrate to Zod mechanically.
 */

import type { RunStatus, TraceEvent } from "../core/types";

/** Bump on any breaking change to the envelope or payload shapes. */
export const PROTOCOL_VERSION = 1 as const;

/** Reject any single message larger than this (defense against a giant payload). */
export const MAX_MESSAGE_BYTES = 32 * 1024 * 1024; // 32 MiB hard cap (> 16 MiB trace budget)

/** Trace-batch flush thresholds (whichever is hit first). */
export const MAX_BATCH_EVENTS = 64;
export const MAX_BATCH_BYTES = 64 * 1024;
export const FLUSH_INTERVAL_MS = 50;

// ---------------------------------------------------------------------------
// Envelope shapes
// ---------------------------------------------------------------------------

/** Fields every envelope carries. */
export interface EnvelopeMeta {
  v: number;
  runId: number;
  owner: string;
  sourceRev: number;
  inputRev: number;
  seq: number;
}

/** main → worker */
export type InboundKind = "run" | "stop";
/** worker → main */
export type OutboundKind =
  | "ready"
  | "exec-start"
  | "trace-batch"
  | "output"
  | "result"
  | "error";

export interface RunPayload {
  source: string;
  stdin: string;
  limits: { timeMs: number; maxEvents: number; maxTraceBytes: number };
}

export interface StopPayload {
  reason: "user" | "supersede" | "dispose";
}

export interface TraceBatchPayload {
  events: TraceEvent[];
}

export interface OutputPayload {
  stream: "stdout" | "stderr";
  text: string;
}

/** The final message: status + counts + the TAIL of events not already streamed. */
export interface ResultPayload {
  status: RunStatus;
  /** Events produced after the last streamed batch (NOT the whole trace). */
  tail: TraceEvent[];
  stdout: string;
  stderr: string;
  /** True when a limit truncated the trace; partial data must be marked. */
  incomplete: boolean;
  /** Which limit was hit, if any. */
  limitHit?: "time" | "events" | "bytes";
  error?: { type: string; message: string; line?: number };
  exitCode?: number | string | null;
}

export interface ErrorPayload {
  /** A recoverable, human-readable message (e.g. runtime failed to load). */
  message: string;
  recoverable: boolean;
}

export type InboundMessage =
  | (EnvelopeMeta & { kind: "run"; payload: RunPayload })
  | (EnvelopeMeta & { kind: "stop"; payload: StopPayload });

export type OutboundMessage =
  | (EnvelopeMeta & { kind: "ready"; payload: Record<string, never> })
  | (EnvelopeMeta & { kind: "exec-start"; payload: Record<string, never> })
  | (EnvelopeMeta & { kind: "trace-batch"; payload: TraceBatchPayload })
  | (EnvelopeMeta & { kind: "output"; payload: OutputPayload })
  | (EnvelopeMeta & { kind: "result"; payload: ResultPayload })
  | (EnvelopeMeta & { kind: "error"; payload: ErrorPayload });

// ---------------------------------------------------------------------------
// hash32 — a cheap, stable 32-bit hash for source/input revisions
// ---------------------------------------------------------------------------

/**
 * FNV-1a 32-bit. Deterministic and stable across runs/processes so a result can
 * be matched to the exact source/input that produced it. Not cryptographic.
 */
export function hash32(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    // 32-bit FNV prime multiply via shifts to stay in 32-bit range
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}

// ---------------------------------------------------------------------------
// Validators
// ---------------------------------------------------------------------------

export interface ValidationOk<T> {
  ok: true;
  value: T;
}
export interface ValidationErr {
  ok: false;
  reason: string;
}
export type ValidationResult<T> = ValidationOk<T> | ValidationErr;

function isMeta(m: unknown): m is EnvelopeMeta & { kind: string; payload: unknown } {
  if (typeof m !== "object" || m === null) return false;
  const o = m as Record<string, unknown>;
  return (
    typeof o.v === "number" &&
    typeof o.runId === "number" &&
    typeof o.owner === "string" &&
    typeof o.sourceRev === "number" &&
    typeof o.inputRev === "number" &&
    typeof o.seq === "number" &&
    typeof o.kind === "string" &&
    "payload" in o
  );
}

/** Approximate the encoded size of a message without fully trusting the sender. */
export function messageByteSize(m: unknown): number {
  try {
    return new TextEncoder().encode(JSON.stringify(m)).length;
  } catch {
    return Number.POSITIVE_INFINITY; // cyclic / non-serializable → treat as oversized
  }
}

function commonChecks(m: unknown): ValidationErr | null {
  if (!isMeta(m)) return { ok: false, reason: "not an envelope" };
  if (m.v !== PROTOCOL_VERSION)
    return { ok: false, reason: `protocol version mismatch (${m.v} != ${PROTOCOL_VERSION})` };
  if (!Number.isInteger(m.runId) || m.runId < 0)
    return { ok: false, reason: "invalid runId" };
  if (!Number.isInteger(m.seq) || m.seq < 0) return { ok: false, reason: "invalid seq" };
  if (messageByteSize(m) > MAX_MESSAGE_BYTES)
    return { ok: false, reason: "message exceeds MAX_MESSAGE_BYTES" };
  return null;
}

/** Validate a main → worker message. */
export function validateInbound(m: unknown): ValidationResult<InboundMessage> {
  const bad = commonChecks(m);
  if (bad) return bad;
  const msg = m as EnvelopeMeta & { kind: string; payload: unknown };
  if (msg.kind === "run") {
    const p = msg.payload as Partial<RunPayload> | null;
    if (typeof p !== "object" || p === null) return { ok: false, reason: "run: bad payload" };
    if (typeof p.source !== "string") return { ok: false, reason: "run: source not a string" };
    if (typeof p.stdin !== "string") return { ok: false, reason: "run: stdin not a string" };
    if (
      typeof p.limits !== "object" ||
      p.limits === null ||
      typeof p.limits.timeMs !== "number" ||
      typeof p.limits.maxEvents !== "number" ||
      typeof p.limits.maxTraceBytes !== "number"
    )
      return { ok: false, reason: "run: bad limits" };
    return { ok: true, value: msg as InboundMessage };
  }
  if (msg.kind === "stop") {
    const p = msg.payload as Partial<StopPayload> | null;
    if (typeof p !== "object" || p === null || typeof p.reason !== "string")
      return { ok: false, reason: "stop: bad payload" };
    return { ok: true, value: msg as InboundMessage };
  }
  return { ok: false, reason: `unknown inbound kind: ${msg.kind}` };
}

/** Validate a worker → main message. */
export function validateOutbound(m: unknown): ValidationResult<OutboundMessage> {
  const bad = commonChecks(m);
  if (bad) return bad;
  const msg = m as EnvelopeMeta & { kind: string; payload: unknown };
  switch (msg.kind) {
    case "ready":
    case "exec-start":
      return { ok: true, value: msg as OutboundMessage };
    case "trace-batch": {
      const p = msg.payload as Partial<TraceBatchPayload> | null;
      if (typeof p !== "object" || p === null || !Array.isArray(p.events))
        return { ok: false, reason: "trace-batch: events not an array" };
      return { ok: true, value: msg as OutboundMessage };
    }
    case "output": {
      const p = msg.payload as Partial<OutputPayload> | null;
      if (
        typeof p !== "object" ||
        p === null ||
        (p.stream !== "stdout" && p.stream !== "stderr") ||
        typeof p.text !== "string"
      )
        return { ok: false, reason: "output: bad payload" };
      return { ok: true, value: msg as OutboundMessage };
    }
    case "result": {
      const p = msg.payload as Partial<ResultPayload> | null;
      if (typeof p !== "object" || p === null) return { ok: false, reason: "result: bad payload" };
      if (typeof p.status !== "string") return { ok: false, reason: "result: bad status" };
      if (!Array.isArray(p.tail)) return { ok: false, reason: "result: tail not an array" };
      if (typeof p.stdout !== "string" || typeof p.stderr !== "string")
        return { ok: false, reason: "result: bad streams" };
      if (typeof p.incomplete !== "boolean")
        return { ok: false, reason: "result: incomplete not a boolean" };
      return { ok: true, value: msg as OutboundMessage };
    }
    case "error": {
      const p = msg.payload as Partial<ErrorPayload> | null;
      if (typeof p !== "object" || p === null || typeof p.message !== "string")
        return { ok: false, reason: "error: bad payload" };
      return { ok: true, value: msg as OutboundMessage };
    }
    default:
      return { ok: false, reason: `unknown outbound kind: ${msg.kind}` };
  }
}
