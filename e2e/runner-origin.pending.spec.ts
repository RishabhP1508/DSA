import { test } from "@playwright/test";

/**
 * P-RUNNER-ORIGIN — RELEASE-BLOCKING pending gate (R2.5, Option B).
 *
 * R2 implements the app in "isolation-ready" form: strict message schemas,
 * origin/event.source validation on the bridge path, stale/oversized rejection,
 * a CSP for the app document, no native FS/subprocess/network from learner
 * Python, and a configuration boundary (src/engine/runner-config.ts) where the
 * runner origin is supplied by deployment.
 *
 * What R2 does NOT prove — and what packaging MUST prove before release — is the
 * REAL two-origin topology. These checks require the packaged Windows static
 * server that serves a second loopback origin with CSP headers, plus the actual
 * Windows browsers. They are intentionally skipped here so the gate cannot be
 * silently forgotten; flipping them on is part of the packaging milestone.
 *
 * Do NOT claim "runner isolation complete" while these are skipped.
 */

test.describe("P-RUNNER-ORIGIN (packaging gate — pending)", () => {
  test.fixme("app origin differs from runner origin", async () => {
    // Packaging: assert window.location.origin (app) !== runner bridge origin.
  });

  test.fixme("the runner bridge document is served from the runner origin", async () => {
    // Packaging: the bridge that constructs the worker is loaded cross-origin
    // from runnerOrigin (getRunnerConfig().runnerOrigin), not the app origin.
  });

  test.fixme("CSP headers are served on the bridge document and worker script", async () => {
    // Packaging: verify Content-Security-Policy response headers on the bridge
    // document and the worker script (a <meta> CSP cannot cover a worker).
  });

  test.fixme("Chrome AND Edge can execute / stop / supersede through the bridge", async () => {
    // Packaging: run the lifecycle suite against real Windows Chrome and Edge
    // driving the cross-origin bridge.
  });

  test.fixme("non-loopback network requests from the runner are blocked", async () => {
    // Packaging: with non-loopback requests blocked, runtime startup + a lesson
    // run + exercise grading + playground run still succeed from local assets.
  });
});
