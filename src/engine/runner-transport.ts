import { getRunnerConfig } from './runner-config';
import { validateInbound, validateOutbound, type InboundMessage } from './protocol';
import workerUrl from './run.worker.ts?worker&url';

/** Worker-shaped adapter. Only the runner iframe can create the actual worker. */
export function createRunnerTransport(): Worker {
  const config = getRunnerConfig();
  if (config.mode === 'same-origin') return new Worker(workerUrl, { type: 'module' });
  const iframe = document.createElement('iframe');
  iframe.src = config.runnerOrigin + config.bridgePath;
  iframe.hidden = true;
  iframe.title = 'Isolated Python execution';
  iframe.referrerPolicy = 'no-referrer';
  const pending: InboundMessage[] = [];
  let ready = false;
  let closed = false;
  let request: InboundMessage | undefined;
  let lastSeq = -1;
  let teardownToken: string | undefined;
  let teardownTimer: ReturnType<typeof setTimeout> | undefined;
  const cleanup = () => {
    if (teardownTimer) clearTimeout(teardownTimer);
    window.removeEventListener('message', receive);
    iframe.remove();
    pending.length = 0;
  };
  const transport = {
    onmessage: null as ((event: MessageEvent) => void) | null,
    onerror: null as (() => void) | null,
    postMessage(raw: unknown) {
      if (closed) return;
      const parsed = validateInbound(raw);
      if (!parsed.ok) throw new Error(parsed.reason);
      const message = parsed.value;
      if (message.kind === 'run') {
        if (request) throw new Error('A runner transport handles only one run.');
        request = message;
      }
      if (ready) iframe.contentWindow?.postMessage(message, config.runnerOrigin);
      else pending.push(message);
    },
    terminate() {
      if (closed) return;
      closed = true;
      pending.length = 0;
      if (!ready) { cleanup(); return; }
      // Removing a frame alone can leave a busy worker running. Keep its bridge
      // alive until it explicitly calls Worker.terminate() and acknowledges it.
      teardownToken = crypto.randomUUID();
      iframe.contentWindow?.postMessage({ type: 'dsa-bridge-terminate', version: 1, token: teardownToken }, config.runnerOrigin);
      teardownTimer = setTimeout(cleanup, 5000);
    },
  };
  function receive(event: MessageEvent) {
    if (event.origin !== config.runnerOrigin || event.source !== iframe.contentWindow) return;
    if (closed) {
      if (event.data?.type === 'dsa-bridge-terminated' && event.data?.version === 1 && event.data?.token === teardownToken) cleanup();
      return;
    }
    if (event.data?.type === 'dsa-bridge-ready' && event.data?.version === 1 && !ready) {
      ready = true;
      for (const message of pending.splice(0)) iframe.contentWindow?.postMessage(message, config.runnerOrigin);
      return;
    }
    const parsed = validateOutbound(event.data);
    if (!parsed.ok || !request) return;
    const m = parsed.value;
    if (m.runId !== request.runId || m.owner !== request.owner || m.sourceRev !== request.sourceRev || m.inputRev !== request.inputRev || m.seq <= lastSeq) return;
    lastSeq = m.seq;
    transport.onmessage?.(new MessageEvent('message', { data: m }));
  }
  window.addEventListener('message', receive);
  iframe.onerror = () => transport.onerror?.();
  document.body.append(iframe);
  return transport as unknown as Worker;
}
