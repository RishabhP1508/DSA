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
 * Payloads are validated deeply with data-only Zod schemas before inspection.
 */

import { inboundPayloads, outboundPayloads } from "./protocol-schema";
import type { RunStatus, TraceEvent, ComplexityAnalysisResult } from "../core/types";

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
  /** R7.5 — conservative static complexity analysis of the run's source. */
  analysis?: ComplexityAnalysisResult;
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
  if (!Number.isSafeInteger(m.runId) || m.runId < 0)
    return { ok: false, reason: "invalid runId" };
  if (!Number.isSafeInteger(m.seq) || m.seq < 0) return { ok: false, reason: "invalid seq" };
  if (!Number.isInteger(m.sourceRev) || m.sourceRev < 0 || m.sourceRev > 0xffffffff || !Number.isInteger(m.inputRev) || m.inputRev < 0 || m.inputRev > 0xffffffff) return { ok: false, reason: "invalid source/input revision" };
  if (messageByteSize(m) > MAX_MESSAGE_BYTES)
    return { ok: false, reason: "message exceeds MAX_MESSAGE_BYTES" };
  return null;
}

/** Validate a main → worker message, including all nested payload fields. */
export function validateInbound(m: unknown): ValidationResult<InboundMessage> {
  const bad = commonChecks(m); if (bad) return bad;
  const msg = m as EnvelopeMeta & { kind: string; payload: unknown };
  if (!Object.hasOwn(inboundPayloads, msg.kind)) return { ok: false, reason: 'unknown inbound kind: ' + msg.kind };
  const schema = inboundPayloads[msg.kind as keyof typeof inboundPayloads];
  if (!schema) return { ok: false, reason: 'unknown inbound kind: ' + msg.kind };
  const parsed = schema.safeParse(msg.payload);
  return parsed.success ? { ok: true, value: msg as InboundMessage } : { ok: false, reason: msg.kind + ': invalid payload' };
}
/** Validate a worker → main message, including frames, values and analysis. */
export function validateOutbound(m: unknown): ValidationResult<OutboundMessage> {
  const bad = commonChecks(m); if (bad) return bad;
  const msg = m as EnvelopeMeta & { kind: string; payload: unknown };
  if (!Object.hasOwn(outboundPayloads, msg.kind)) return { ok: false, reason: 'unknown outbound kind: ' + msg.kind };
  const schema = outboundPayloads[msg.kind as keyof typeof outboundPayloads];
  if (!schema) return { ok: false, reason: 'unknown outbound kind: ' + msg.kind };
  const parsed = schema.safeParse(msg.payload);
  return parsed.success ? { ok: true, value: msg as OutboundMessage } : { ok: false, reason: msg.kind + ': invalid payload' };
}
