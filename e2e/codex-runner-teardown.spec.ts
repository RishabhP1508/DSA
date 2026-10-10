import { expect, test } from "@playwright/test";
import { build } from "vite";
import type { ExecutionEngine } from "../src/engine/engine";
import type { RunResult } from "../src/core/types";

type AuditGlobal = typeof globalThis & {
  codexEngine: ExecutionEngine;
  codexFirst: Promise<RunResult>;
  codexSecond?: Promise<RunResult>;
  codexBusy: boolean;
  codexTeardownAck: boolean;
};

async function watchTeardown(page: import("@playwright/test").Page) {
  await page.evaluate(() => {
    const source = document.querySelector("iframe")!.contentWindow;
    const audit = globalThis as AuditGlobal;
    audit.codexTeardownAck = false;
    window.addEventListener("message", event => {
      if (event.source === source && event.origin === "http://127.0.0.1:4174" &&
          event.data?.type === "dsa-bridge-terminated" && event.data?.version === 1) {
        audit.codexTeardownAck = true;
      }
    });
  });
}

test("Stop explicitly terminates a busy builtin worker before discarding its iframe", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Playground", exact: true }).click();
  const editor = page.locator(".cm-content").first();
  await editor.click();
  await page.keyboard.press("ControlOrMeta+A");
  // sum executes in the interpreter's builtin C code, without generating
  // Python line events. No unsupported module or user tracing hook is used.
  await page.keyboard.insertText("print('busy builtin')\nsum(range(10**10))\nprint('late result')");
  const created = page.waitForEvent("worker");
  await page.getByRole("button", { name: "▶ Run", exact: true }).click();
  const worker = await created;
  let closed = false;
  let closedAt = 0;
  worker.on("close", () => { closed = true; closedAt = Date.now(); });
  await expect(page.getByLabel("Live program output")).toContainText("busy builtin", { timeout: 60_000 });
  await watchTeardown(page);
  const stopAt = Date.now();
  await page.getByRole("button", { name: "■ Stop", exact: true }).click();
  await expect(page.getByRole("button", { name: "▶ Run", exact: true })).toBeEnabled({ timeout: 2000 });
  await page.waitForFunction(() => (globalThis as AuditGlobal).codexTeardownAck, null, { timeout: 2000 });
  // Worker.terminate initiates parallel abort; Chromium can delay target
  // destruction after the bridge acknowledgment. UI settlement is separate.
  await expect.poll(() => closed, { timeout: 5000 }).toBe(true);
  console.info(`Stop busy worker closed after ${closedAt - stopAt} ms`);
  expect(page.workers()).toHaveLength(0);
  await expect(page.locator('iframe[title="Isolated Python execution"]')).toHaveCount(0);
  await editor.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.insertText("print('replacement')");
  await page.getByRole("button", { name: "▶ Run", exact: true }).click();
  await expect(page.getByText(/· completed/)).toBeVisible({ timeout: 60_000 });
  const timeline = page.getByRole("slider", { name: "Timeline" });
  await timeline.focus(); await page.keyboard.press("End");
  await expect(page.locator("pre.output")).toContainText("replacement");
  await expect(page.locator("pre.output")).not.toContainText("late result");
});

for (const action of ["supersede", "dispose"] as const) {
  test(`${action} explicitly terminates a busy production worker`, async ({ page, request }) => {
    // The production UI does not expose dispose or Run while busy. Compile the
    // actual coordinator/transport without changing their logic, and substitute
    // only its bundler-provided worker URL with the actual built worker URL.
    // Serve this temporary test module in memory on the app origin.
    const html = await (await request.get("http://127.0.0.1:4174/runner-bridge.html")).text();
    const sharedPath = html.match(/href="(\/assets\/[^\"]+\.js)"/)![1];
    const shared = await (await request.get("http://127.0.0.1:4174" + sharedPath)).text();
    const workerPath = shared.match(/\/assets\/run\.worker-[A-Za-z0-9_-]+\.js/)![0];
    const bundled = await build({
      configFile: false, logLevel: "error",
      plugins: [{
        name: "codex-production-worker-url", enforce: "pre",
        resolveId(id) { return id.endsWith("run.worker.ts?worker&url") ? "\0codex-worker-url" : null; },
        load(id) { return id === "\0codex-worker-url" ? `export default ${JSON.stringify(workerPath)};` : null; },
      }],
      build: { write: false, emptyOutDir: false, minify: false,
        lib: { entry: "src/engine/engine.ts", formats: ["es"], fileName: "codex-engine" } },
    });
    const output = (Array.isArray(bundled) ? bundled[0] : bundled) as { output: { type: string; code?: string }[] };
    const module = output.output.find(item => item.type === "chunk")!.code!;
    await page.route("**/codex-engine-audit.js", route => route.fulfill({ contentType: "text/javascript", body: module }));
    await page.goto("/");
    const created = page.waitForEvent("worker");
    await page.evaluate(async () => {
      const path = "/codex-engine-audit.js";
      const module = await import(path) as { ExecutionEngine: new () => ExecutionEngine };
      const audit = globalThis as AuditGlobal;
      audit.codexEngine = new module.ExecutionEngine();
      audit.codexBusy = false;
      audit.codexEngine.subscribeProgress(progress => {
        if (progress.stdout.includes("busy builtin")) audit.codexBusy = true;
      });
      audit.codexFirst = audit.codexEngine.run("print('busy builtin')\nsum(range(10**10))\nprint('late result')");
    });
    const worker = await created;
    let closed = false;
    let closedAt = 0;
    worker.on("close", () => { closed = true; closedAt = Date.now(); });
    await page.waitForFunction(() => (globalThis as AuditGlobal).codexBusy, null, { timeout: 60_000 });
    await watchTeardown(page);
    const stopAt = Date.now();
    await page.evaluate(action => {
      const audit = globalThis as AuditGlobal;
      if (action === "dispose") audit.codexEngine.dispose();
      else audit.codexSecond = audit.codexEngine.run("print('replacement')");
    }, action);
    await page.waitForFunction(() => (globalThis as AuditGlobal).codexTeardownAck, null, { timeout: 2000 });
    await expect.poll(() => closed, { timeout: 5000 }).toBe(true);
    console.info(`${action} busy worker closed after ${closedAt - stopAt} ms`);
    const first = await page.evaluate(() => (globalThis as AuditGlobal).codexFirst);
    expect(first.status).toBe("stopped");
    expect(first.stopReason).toBe(action);
    if (action === "supersede") {
      const second = await page.evaluate(() => (globalThis as AuditGlobal).codexSecond);
      expect(second?.status).toBe("completed");
      expect(second?.stdout).toBe("replacement\n");
    }
    await expect.poll(() => page.workers().length, { timeout: 2000 }).toBe(0);
    await expect(page.locator('iframe[title="Isolated Python execution"]')).toHaveCount(0);
  });
}
