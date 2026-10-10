// @vitest-environment node
import { expect, it } from "vitest";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import net from "node:net";
// @ts-expect-error independent JavaScript server has no declaration file
import { startServers } from "../../desktop/server.mjs";

async function freePort(): Promise<number> {
  const server = net.createServer();
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const port = (server.address() as net.AddressInfo).port;
  await new Promise<void>(resolve => server.close(() => resolve()));
  return port;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

it.each(["bounded shutdown", "repeated close waits for completion"])(
  "Codex independent desktop audit: %s with an unfinished HTTP request",
  async (scenario) => {
    const root = await mkdtemp(path.join(tmpdir(), "codex-dsa-stop-audit-"));
    let socket: net.Socket | undefined;
    let closing: Promise<void> | undefined;
    try {
      await mkdir(path.join(root, "dist"));
      await writeFile(path.join(root, "dist", "index.html"), "<!doctype html>audit");
      const appPort = await freePort(), runnerPort = await freePort();
      const server = await startServers({ root, appPort, runnerPort });
      socket = net.connect(appPort, "127.0.0.1");
      await new Promise<void>((resolve, reject) => {
        socket!.once("connect", resolve); socket!.once("error", reject);
      });
      // A local client leaves a request active, without sending the terminating
      // CRLF. This is not a remote-origin or CSP bypass reproduction.
      socket.write(`GET /health HTTP/1.1\r\nHost: 127.0.0.1:${appPort}\r\nX-Audit: unfinished`);
      await sleep(30);
      let firstSettled = false;
      closing = server.close().then(() => { firstSettled = true; });
      if (scenario === "bounded shutdown") {
        const finished = await Promise.race([closing.then(() => true), sleep(1000).then(() => false)]);
        expect(finished).toBe(true);
      } else {
        await server.close();
        expect(firstSettled).toBe(true);
      }
    } finally {
      socket?.destroy();
      await closing;
      const resolvedRoot = path.resolve(root);
      if (!resolvedRoot.startsWith(path.resolve(tmpdir()) + path.sep)) throw new Error("Unexpected fixture path");
      await rm(resolvedRoot, { recursive: true, force: true });
    }
  },
);
