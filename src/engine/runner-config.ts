/** The delivered app always uses two loopback origins. Vite dev stays local. */
export interface RunnerConfig {
  mode: 'same-origin' | 'cross-origin';
  appOrigin: string;
  runnerOrigin: string;
  bridgePath: string;
}
export function loopbackOrigin(value: string): string {
  const url = new URL(value);
  if (url.protocol !== 'http:' || url.hostname !== '127.0.0.1' || url.username || url.password || url.pathname !== '/' || url.search || url.hash)
    throw new Error('The Python runner must use an exact 127.0.0.1 HTTP origin.');
  return url.origin;
}
export function getRunnerConfig(): RunnerConfig {
  const origin = typeof location === 'undefined' ? 'http://127.0.0.1:5173' : location.origin;
  const supplied = (globalThis as unknown as { __DSA_RUNNER_CONFIG__?: RunnerConfig }).__DSA_RUNNER_CONFIG__;
  if (!supplied) return { mode: 'same-origin', appOrigin: origin, runnerOrigin: origin, bridgePath: '/runner-bridge.html' };
  const appOrigin = loopbackOrigin(supplied.appOrigin);
  const runnerOrigin = loopbackOrigin(supplied.runnerOrigin);
  if (supplied.mode !== 'cross-origin' || appOrigin !== origin || runnerOrigin === appOrigin || supplied.bridgePath !== '/runner-bridge.html')
    throw new Error('The local runner configuration is inconsistent. Restart DSA Visual Lab.');
  return { mode: 'cross-origin', appOrigin, runnerOrigin, bridgePath: supplied.bridgePath };
}
export function isAllowedRunnerOrigin(origin: string, cfg = getRunnerConfig()): boolean {
  return origin === cfg.runnerOrigin;
}
