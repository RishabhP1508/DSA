import { z } from 'zod';

// Data-only schemas: references are identifiers, so cycles never require
// recursively following learner objects during validation.
const natural = z.number().int().nonnegative();
const text = z.string();
const value = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('int'), value: z.union([z.number().int().refine(Number.isSafeInteger), text.regex(/^-?(?:\d+|0x[0-9a-f]+)$/)]) }).strict(),
  z.object({ kind: z.literal('float'), value: z.union([z.number().finite(), z.enum(['Infinity', '-Infinity', 'NaN'])]) }).strict(),
  z.object({ kind: z.literal('bool'), value: z.boolean() }).strict(),
  z.object({ kind: z.literal('str'), value: text }).strict(),
  z.object({ kind: z.literal('none') }).strict(),
  z.object({ kind: z.literal('ref'), id: text.min(1) }).strict(),
  z.object({ kind: z.literal('unknown'), repr: text }).strict(),
]);
const error = z.object({ type: text, message: text, line: natural.optional() }).strict();
const output = z.object({ stream: z.enum(['stdout', 'stderr']), text }).strict();
const object = z.object({
  id: text.min(1), type: text.min(1),
  entries: z.array(z.object({ key: text, keyKind: z.enum(['int','float','bool','str','none','tuple','unknown']).optional(), value }).strict()).optional(),
  repr: text.optional(), truncated: z.boolean().optional(),
}).strict();
const traceEvent = z.object({
  index: natural, kind: z.enum(['call','line','return','exception','output']), line: natural,
  frames: z.array(z.object({ name: text, line: natural, locals: z.array(z.object({ name: text, value }).strict()) }).strict()),
  objects: z.record(text, object), output: output.optional(), returnValue: value.optional(), error: error.optional(),
}).strict();
const analysis = z.object({
  source: z.enum(['auto-supported','not-determined']),
  uncertaintyReason: text.optional(), scope: z.enum(['program','function','operation']).optional(),
  time: text.optional(), sizeVars: z.array(z.object({ symbol: text, meaning: text }).strict()).optional(),
  supportedFindings: z.array(text).optional(),
  observed: z.array(z.object({ label: text, value: z.number().finite(), definition: text }).strict()).optional(),
}).strict();
export const inboundPayloads = {
  run: z.object({ source: text, stdin: text, limits: z.object({
    timeMs: z.number().int().positive().max(10000),
    maxEvents: z.number().int().positive().max(10000),
    maxTraceBytes: z.number().int().positive().max(16*1024*1024),
  }).strict() }).strict(),
  stop: z.object({ reason: z.enum(['user','supersede','dispose']) }).strict(),
};
export const outboundPayloads = {
  ready: z.object({}).strict(), 'exec-start': z.object({}).strict(),
  'trace-batch': z.object({ events: z.array(traceEvent) }).strict(), output,
  result: z.object({
    status: z.enum(['completed','exited','error','timeout','event-limit','trace-limit','stopped']),
    tail: z.array(traceEvent), stdout: text, stderr: text, incomplete: z.boolean(),
    limitHit: z.enum(['time','events','bytes']).optional(), error: error.optional(),
    exitCode: z.union([z.number().finite(),text,z.null()]).optional(), analysis: analysis.optional(),
  }).strict(),
  error: z.object({ message: text, recoverable: z.boolean() }).strict(),
};
