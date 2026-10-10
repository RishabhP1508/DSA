/** Asset-only, dual-origin local server. No native Python or file-edit APIs. */
import http from 'node:http';
import { createReadStream } from 'node:fs';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomBytes } from 'node:crypto';

export const APP_ID = 'dsa-visual-lab';
export const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.mjs':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json', '.wasm':'application/wasm', '.zip':'application/zip', '.svg':'image/svg+xml', '.png':'image/png', '.woff2':'font/woff2', '.whl':'application/octet-stream', '.data':'application/octet-stream' };
export async function buildIdentity(root = packageRoot) {
  try { return (await readFile(path.join(root,'build-id.txt'),'utf8')).trim(); }
  catch { return createHash('sha256').update(await readFile(path.join(root,'dist','index.html'))).digest('hex').slice(0,16); }
}
export function contentPolicy(role, appOrigin, runnerOrigin) {
  const scripts = role === 'runner' ? "'self' 'wasm-unsafe-eval' 'unsafe-eval'" : "'self'";
  return `default-src 'none'; script-src ${scripts}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; worker-src 'self'; frame-src ${role === 'app' ? runnerOrigin : "'none'"}; frame-ancestors ${role === 'app' ? "'none'" : appOrigin}; base-uri 'none'; object-src 'none'; form-action 'none'`;
}
export async function startServers({root = packageRoot, appPort = 8765, runnerPort = 8766} = {}) {
  for (const port of [appPort,runnerPort]) if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Ports must be integers between 1024 and 65535.');
  if (appPort === runnerPort) throw new Error('App and runner ports must differ.');
  const dist = await realpath(path.join(root,'dist'));
  const buildId = await buildIdentity(root);
  const appOrigin = `http://127.0.0.1:${appPort}`;
  const runnerOrigin = `http://127.0.0.1:${runnerPort}`;
  const token = randomBytes(32).toString('hex');
  let closing;
  const servers = [];
  function close() {
    if (closing) return closing;
    closing = Promise.all(servers.map(s=>new Promise(resolve=>{s.close(resolve); s.closeAllConnections();})));
    return closing;
  }
  function serve(role, origin) {
    const server = http.createServer(async (req,res)=>{
      res.setHeader('Content-Security-Policy',contentPolicy(role,appOrigin,runnerOrigin));
      res.setHeader('X-Content-Type-Options','nosniff');
      res.setHeader('Referrer-Policy','no-referrer');
      res.setHeader('Cache-Control','no-store');
      if (req.headers.host !== origin.slice(7)) { res.writeHead(403).end('Invalid loopback host.'); return; }
      let pathname;
      try { pathname = decodeURIComponent(new URL(req.url,origin).pathname); }
      catch { res.writeHead(400).end('Invalid URL.'); return; }
      if (pathname === '/health' && req.method === 'GET') {
        res.setHeader('Content-Type','application/json');
        res.end(JSON.stringify({appId:APP_ID,buildId,role,appOrigin,runnerOrigin})); return;
      }
      if (role === 'app' && pathname === '/api/session' && req.method === 'GET') {
        if (req.headers.origin !== appOrigin) {res.writeHead(403).end(); return;}
        res.setHeader('Content-Type','application/json'); res.end(JSON.stringify({token})); return;
      }
      if (role === 'app' && pathname === '/api/stop' && req.method === 'POST') {
        if (req.headers.origin !== appOrigin || req.headers['x-dsa-session'] !== token) {res.writeHead(403).end(); return;}
        res.end('Stopped.',()=>void close()); return;
      }
      if (req.method !== 'GET' && req.method !== 'HEAD') {res.writeHead(405).end(); return;}
      if (pathname === (role === 'app' ? '/app-config.js' : '/runner-config.js')) {
        const config = role === 'app' ? {mode:'cross-origin',appOrigin,runnerOrigin,bridgePath:'/runner-bridge.html'} : {appOrigin};
        res.setHeader('Content-Type','text/javascript; charset=utf-8');
        res.end(`globalThis.${role === 'app' ? '__DSA_RUNNER_CONFIG__' : '__DSA_BRIDGE_CONFIG__'}=${JSON.stringify(config)};`); return;
      }
      if (role === 'runner' && pathname !== '/runner-bridge.html' && !pathname.startsWith('/assets/') && !pathname.startsWith('/pyodide/')) {res.writeHead(404).end(); return;}
      if (pathname.includes('\0') || pathname.includes('\\') || pathname.split('/').includes('..')) {res.writeHead(403).end(); return;}
      try {
        const file = await realpath(path.join(dist,pathname === '/' ? 'index.html' : pathname.slice(1)));
        if (!file.startsWith(dist + path.sep)) {res.writeHead(403).end(); return;}
        const info = await stat(file);
        if (!info.isFile()) {res.writeHead(404).end(); return;}
        res.setHeader('Content-Type',mime[path.extname(file)] ?? 'application/octet-stream');
        res.setHeader('Content-Length',info.size);
        if (req.method === 'HEAD') res.end();
        else createReadStream(file).on('error',()=>res.destroy()).pipe(res);
      } catch {res.writeHead(404).end('Asset not found.');}
    });
    servers.push(server);
    return server;
  }
  for (const [role,origin,port] of [['app',appOrigin,appPort],['runner',runnerOrigin,runnerPort]]) {
    const server = serve(role,origin);
    try { await new Promise((resolve,reject)=>{server.once('error',reject); server.listen(port,'127.0.0.1',resolve);}); }
    catch (error) { await close(); throw new Error(`Cannot start ${role} at ${origin}: ${error.code === 'EADDRINUSE' ? 'port is already in use. Close the other application or use different ports.' : error.message}`); }
  }
  return {appOrigin,runnerOrigin,buildId,close};
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const option = (name,fallback)=>{const index=args.indexOf(name); return index<0?fallback:Number(args[index+1]);};
  try {
    const instance = await startServers({appPort:option('--app-port',8765),runnerPort:option('--runner-port',8766)});
    console.log(`DSA Visual Lab: ${instance.appOrigin} (isolated runner ${instance.runnerOrigin})`);
    process.on('SIGINT',()=>void instance.close()); process.on('SIGTERM',()=>void instance.close());
  } catch (error) {console.error(error.message); process.exitCode=1;}
}
