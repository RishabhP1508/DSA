import { loopbackOrigin } from './runner-config';
import { validateInbound, validateOutbound, PROTOCOL_VERSION, type InboundMessage } from './protocol';
import workerUrl from './run.worker.ts?worker&url';

const config = (globalThis as unknown as { __DSA_BRIDGE_CONFIG__: { appOrigin: string } }).__DSA_BRIDGE_CONFIG__;
const appOrigin = loopbackOrigin(config.appOrigin);
let worker: Worker | undefined;
let request: InboundMessage | undefined;
let lastSeq = -1;
let terminated = false;
window.addEventListener('message', (event: MessageEvent) => {
  if (event.origin !== appOrigin || event.source !== parent || parent === window) return;
  if (event.data?.type === 'dsa-bridge-terminate' && event.data?.version === 1 && typeof event.data?.token === 'string' && event.data.token.length <= 64) {
    terminated = true;
    worker?.terminate();
    worker = undefined;
    parent.postMessage({ type: 'dsa-bridge-terminated', version: 1, token: event.data.token }, appOrigin);
    return;
  }
  if (terminated) return;
  const parsed = validateInbound(event.data);
  if (!parsed.ok) return;
  const m = parsed.value;
  if (m.kind === 'stop') {
    if (request && m.runId === request.runId && m.owner === request.owner && m.sourceRev === request.sourceRev && m.inputRev === request.inputRev) worker?.terminate();
    return;
  }
  if (request) return;
  request = m;
  worker = new Worker(workerUrl, { type: 'module' });
  worker.onmessage = (message: MessageEvent) => {
    const validated = validateOutbound(message.data);
    if (!validated.ok) return;
    const v = validated.value;
    if (v.runId !== m.runId || v.owner !== m.owner || v.sourceRev !== m.sourceRev || v.inputRev !== m.inputRev || v.seq <= lastSeq) return;
    lastSeq = v.seq;
    parent.postMessage(v, appOrigin);
  };
  worker.onerror = () => parent.postMessage({ v: PROTOCOL_VERSION, runId: m.runId, owner: m.owner, sourceRev: m.sourceRev, inputRev: m.inputRev, seq: ++lastSeq, kind: 'error', payload: { message: 'The isolated Python worker failed.', recoverable: true } }, appOrigin);
  worker.postMessage(m);
});
parent.postMessage({ type: 'dsa-bridge-ready', version: 1 }, appOrigin);
