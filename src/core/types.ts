/**
 * Core domain interfaces for DSA Visual Lab.
 *
 * These types are the contract that lessons, patterns, the execution engine,
 * and the visualizers all agree on. They are intentionally centralised so that
 * later phases (curriculum, patterns, packaging) extend the SAME shapes rather
 * than inventing parallel ones.
 *
 * See the plan section "Core interfaces" for the authoritative responsibilities.
 */

// ---------------------------------------------------------------------------
// Reference metadata (research provenance attached to content)
// ---------------------------------------------------------------------------

/**
 * A single source consulted while authoring a lesson or pattern.
 * Required by AGENTS.md step 7 ("Record the evidence").
 */
export interface ReferenceRecord {
  /** Exact URL of the page consulted (not a site homepage). */
  url: string;
  /** Human title of the page/section. */
  title: string;
  /** The specific section(s) that were read. */
  section?: string;
  /** Topic key this reference supports (matches docs/references.md index). */
  topic: string;
  /** Why this source was consulted / what it was used for. */
  purpose: string;
  /** The specific claims verified against this source. */
  verifiedClaims?: string[];
  /** Conventions taken from this source (e.g. "0-based heap indexing"). */
  conventions?: string[];
  /** ISO date the source was accessed. */
  accessDate: string;
}

// ---------------------------------------------------------------------------
// Execution engine: RunRequest and TraceEvent
// ---------------------------------------------------------------------------

/** Resource limits for a single execution. Defaults defined in the engine. */
export interface RunLimits {
  /** Wall-clock limit in milliseconds (plan default: 10_000). */
  timeMs: number;
  /** Maximum number of recorded trace events (plan default: 10_000). */
  maxEvents: number;
  /** Maximum trace payload size in bytes (plan default: 16 * 1024 * 1024). */
  maxTraceBytes: number;
}

/** A request to execute a single-file Python program and record its trace. */
export interface RunRequest {
  /** Monotonic run identifier; stale results (older id) must be rejected. */
  runId: number;
  /** The Python source to execute. */
  source: string;
  /** Text supplied line-by-line to input() calls. */
  stdin?: string;
  /** Execution limits; engine substitutes defaults for missing fields. */
  limits?: Partial<RunLimits>;
}

/** The kind of runtime event captured at a source location. */
export type TraceEventKind =
  | "call" // a function frame was entered
  | "line" // an executable line is about to run
  | "return" // a function frame returned
  | "exception" // an exception was raised
  | "output"; // stdout/stderr was produced

/** A reference to a heap object, kept stable across steps by identity. */
export type ObjectId = string;

/**
 * A value as observed by the tracer. Primitives are inlined; containers and
 * user objects are referenced by ObjectId so aliases and cycles are preserved
 * (never re-evaluated during inspection — see the plan's execution rules).
 */
export type TraceValue =
  | { kind: "int"; value: number | string }
  | { kind: "float"; value: number }
  | { kind: "bool"; value: boolean }
  | { kind: "str"; value: string }
  | { kind: "none" }
  | { kind: "ref"; id: ObjectId }
  | { kind: "unknown"; repr: string };

/** A snapshot of one heap object at a point in time. */
export interface TraceObject {
  id: ObjectId;
  type: string; // e.g. "list", "dict", "TreeNode"
  /** For containers: ordered/keyed children. For objects: attribute map. */
  entries?: { key: string; value: TraceValue }[];
  /** For scalars wrapped as objects or opaque types. */
  repr?: string;
}

/** One stack frame in a recorded state. */
export interface TraceFrame {
  /** Function name ("<module>" for top level). */
  name: string;
  /** 1-based line currently executing in this frame. */
  line: number;
  /** Local variables visible in this frame. */
  locals: { name: string; value: TraceValue }[];
}

/**
 * An immutable snapshot of program state at one step. States are replayed
 * without rerunning the program (plan requirement). Each state is fully
 * self-describing so backward playback restores exact state.
 */
export interface TraceEvent {
  /** Sequence index within the run (0-based). */
  index: number;
  kind: TraceEventKind;
  /** 1-based source line this event refers to. */
  line: number;
  /** Full call stack, innermost last. */
  frames: TraceFrame[];
  /** Heap objects referenced by any value in this state. */
  objects: Record<ObjectId, TraceObject>;
  /** Text appended to output at this step, if any. */
  output?: { stream: "stdout" | "stderr"; text: string };
  /** Return value if kind === "return". */
  returnValue?: TraceValue;
  /** Error info if kind === "exception". */
  error?: { type: string; message: string };
}

/** Terminal status of a run. */
export type RunStatus =
  | "completed"
  | "error"
  | "timeout"
  | "event-limit"
  | "trace-limit"
  | "stopped";

/** The full recorded result of a run, streamed then finalised. */
export interface RunResult {
  runId: number;
  status: RunStatus;
  events: TraceEvent[];
  /** Concatenated stdout produced by the run. */
  stdout: string;
  /** Concatenated stderr produced by the run. */
  stderr: string;
  /** Present when status === "error". */
  error?: { type: string; message: string; line?: number };
}

// ---------------------------------------------------------------------------
// Visualization binding
// ---------------------------------------------------------------------------

/** The conceptual model a value should be rendered as. */
export type VisualModel =
  | "array"
  | "string"
  | "matrix"
  | "stack"
  | "queue"
  | "deque"
  | "linked-list"
  | "dict"
  | "set"
  | "tree"
  | "heap"
  | "trie"
  | "graph"
  | "dp-table"
  | "bits"
  | "object"; // generic fallback

/**
 * Maps a variable (or an object field) to a visual model, plus pattern-specific
 * overlays such as pointers, windows, running totals, visited sets, boundaries.
 */
export interface VisualBinding {
  /** Variable name in the traced program, e.g. "nums". */
  variable: string;
  /** Optional dotted path into an object's fields, e.g. "root.left". */
  path?: string;
  model: VisualModel;
  /** Optional overlays keyed by role; value is the variable holding the index/state. */
  overlays?: {
    role: "pointer" | "window" | "total" | "visited" | "boundary" | "highlight";
    label: string;
    /** Variable whose value drives this overlay. */
    source: string;
  }[];
}

// ---------------------------------------------------------------------------
// Lessons
// ---------------------------------------------------------------------------

/** One explained line of the lesson's code. */
export interface CodeLineExplanation {
  /** 1-based line number in the lesson code. */
  line: number;
  /** Whether this line produces runtime events (false for comments/blanks). */
  executable: boolean;
  /** Beginner-facing explanation of what this line does / means. */
  explanation: string;
}

/** A glossary/vocabulary entry available throughout. */
export interface GlossaryTerm {
  term: string;
  definition: string;
}

/** A prediction checkpoint asking the learner what happens next. */
export interface PredictionStep {
  /** The step index (into recorded events) the prediction is about. */
  atEventIndex: number;
  prompt: string;
  /** Acceptable answers (free-form matching handled by the UI). */
  answer: string;
  explanation: string;
}

/** A practice exercise attached to a lesson. */
export interface Exercise {
  id: string;
  kind:
    | "predict-state"
    | "complete-code"
    | "fix-mistake"
    | "choose-approach"
    | "write-solution"
    | "mixed";
  prompt: string;
  /** Starter code where relevant. */
  starterCode?: string;
  /** Reference/expected solution or expected output. */
  expected?: string;
  /** Progressive hints, revealed one at a time. */
  hints: string[];
}

/** Complexity claim for an operation or the lesson subject. */
export interface ComplexityClaim {
  operation: string;
  best?: string;
  average?: string;
  worst?: string;
  space?: string;
  note?: string;
}

/**
 * A complete lesson. Follows the mandated sequence:
 * explanation -> vocabulary -> interactive example -> Python implementation ->
 * visual execution -> prediction -> experimentation -> practice -> review.
 */
export interface LessonDefinition {
  id: string;
  title: string;
  area: string; // curriculum area, e.g. "Programming foundations"
  /** Lesson ids that should be completed first. */
  prerequisites: string[];
  /** Simple, beginner-first explanation (markdown). */
  explanation: string;
  vocabulary: GlossaryTerm[];
  /** Purpose, operations, uses, tradeoffs, mistakes, edge cases (markdown). */
  concepts: {
    purpose: string;
    operations: string;
    uses: string;
    tradeoffs: string;
    commonMistakes: string;
    edgeCases: string;
  };
  complexity: ComplexityClaim[];
  /** The Python program the lesson executes and visualises. */
  code: string;
  /** Per-line explanations of `code`. */
  codeExplanations: CodeLineExplanation[];
  /** Optional stdin fed to input() during execution. */
  stdin?: string;
  /** Suggested visual bindings for this lesson's code. */
  bindings: VisualBinding[];
  prediction: PredictionStep[];
  /** Free experimentation prompt(s). */
  experiments: string[];
  exercises: Exercise[];
  /** Short review / recap (markdown). */
  review: string;
  /** Expected stdout when `code` runs unmodified (used to verify content). */
  expectedOutput: string;
  /** Research provenance for this lesson. */
  references: ReferenceRecord[];
}

// ---------------------------------------------------------------------------
// Patterns
// ---------------------------------------------------------------------------

/** A recognition/comparison exercise for a pattern. */
export interface PatternExercise extends Exercise {
  /** For recognition drills: the correct pattern id, hidden from the prompt. */
  correctPatternId?: string;
}

export interface PatternDefinition {
  id: string;
  title: string;
  /** Signals in input, output, constraints, required operations. */
  clues: string[];
  /** A naive baseline solution and its bottleneck (markdown). */
  naiveApproach: string;
  /** Why this pattern improves on the baseline (markdown). */
  whyItHelps: string;
  /** Conditions required for correctness. */
  conditions: string[];
  /** Plausible alternatives and how to compare them. */
  alternatives: string[];
  /** Counterexamples and misleading clues. */
  counterexamples: string[];
  /** A complete, visual Python walkthrough program. */
  walkthroughCode: string;
  codeExplanations: CodeLineExplanation[];
  bindings: VisualBinding[];
  /** Lessons this pattern links to. */
  linkedLessons: string[];
  exercises: PatternExercise[];
  references: ReferenceRecord[];
}

// ---------------------------------------------------------------------------
// Local progress / persistence
// ---------------------------------------------------------------------------

export interface ProgressRecord {
  /** Lesson id -> completion state. */
  lessons: Record<string, { completed: boolean; lastViewedAt: string }>;
  /** Exercise id -> attempts and completion. */
  exercises: Record<string, { attempts: number; solved: boolean }>;
  /** Saved code drafts, keyed by an arbitrary slot name. */
  drafts: Record<string, { source: string; savedAt: string }>;
  /** User preferences (theme, reduced motion, playback speed, etc). */
  preferences: Record<string, unknown>;
  /** Backup schema version for JSON export/import. */
  backupVersion: number;
}
