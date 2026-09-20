/**
 * Runner isolation configuration boundary (R2.5, Option B).
 *
 * The execution runner is designed to live on a SEPARATE loopback origin from
 * the app (plan §7 "Keep the runner on a separate loopback origin"). Serving a
 * real second origin needs the packaged Windows static server, which is a later
 * milestone — so this module is the CONFIGURATION SEAM that lets packaging flip
 * to a cross-origin bridge WITHOUT a code rewrite.
 *
 * Until then the default is `same-origin`: the module worker runs on the app
 * origin (still isolated from the DOM, validated by the protocol schemas). The
 * cross-origin bridge path and the proof that it works in Chrome + Edge is the
 * release-blocking gate P-RUNNER-ORIGIN (see the R2 spec and
 * e2e/runner-origin.pending.spec.ts). Do NOT claim "runner isolation complete"
 * while mode is same-origin.
 */

export type RunnerMode = "same-origin" | "cross-origin";

export interface RunnerConfig {
  /** How the worker/runtime is hosted relative to the app document. */
  mode: RunnerMode;
  /** The app's own origin (where the UI is served). */
  appOrigin: string;
  /** The origin the runner bridge is served from (packaging supplies this). */
  runnerOrigin: string;
  /** Path to the bridge document on the runner origin (cross-origin mode). */
  bridgePath: string;
}

/** Dev/verification defaults. Packaging overrides these via injected config. */
const DEFAULT_CONFIG: RunnerConfig = {
  mode: "same-origin",
  appOrigin: "http://127.0.0.1:5173",
  runnerOrigin: "http://127.0.0.1:5174",
  bridgePath: "/runner-bridge.html",
};

/**
 * Read the runner configuration. Deployment can inject overrides on
 * `globalThis.__DSA_RUNNER_CONFIG__` (set by the packaged server's bootstrap);
 * unknown/invalid fields fall back to the safe defaults.
 */
export function getRunnerConfig(): RunnerConfig {
  const injected = (globalThis as unknown as { __DSA_RUNNER_CONFIG__?: Partial<RunnerConfig> })
    .__DSA_RUNNER_CONFIG__;
  if (!injected) return { ...DEFAULT_CONFIG };
  const mode: RunnerMode =
    injected.mode === "cross-origin" || injected.mode === "same-origin"
      ? injected.mode
      : DEFAULT_CONFIG.mode;
  return {
    mode,
    appOrigin:
      typeof injected.appOrigin === "string" ? injected.appOrigin : DEFAULT_CONFIG.appOrigin,
    runnerOrigin:
      typeof injected.runnerOrigin === "string"
        ? injected.runnerOrigin
        : DEFAULT_CONFIG.runnerOrigin,
    bridgePath:
      typeof injected.bridgePath === "string" ? injected.bridgePath : DEFAULT_CONFIG.bridgePath,
  };
}

/**
 * True when an incoming cross-origin bridge message's origin is acceptable.
 * In same-origin mode the worker path is used directly and this is not the
 * gate; in cross-origin mode the engine MUST also check `event.source`.
 */
export function isAllowedRunnerOrigin(origin: string, cfg = getRunnerConfig()): boolean {
  if (cfg.mode === "same-origin") return origin === cfg.appOrigin;
  return origin === cfg.runnerOrigin;
}
