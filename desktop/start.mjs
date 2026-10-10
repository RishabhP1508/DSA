import { spawn } from 'node:child_process';
import path from 'node:path';
import { APP_ID, packageRoot, buildIdentity } from './server.mjs';
const origin='http://127.0.0.1:8765';
async function health(url) {try {const r=await fetch(url+'/health',{signal:AbortSignal.timeout(600)});return r.ok?await r.json():null;}catch{return null;}}
try {
  const buildId=await buildIdentity();
  const existing=await health(origin);
  if (existing && (existing.appId!==APP_ID || existing.buildId!==buildId || existing.role!=='app')) throw new Error('Port 8765 belongs to another application or another DSA build. Stop it first.');
  if (!existing) {
    const child=spawn(process.execPath,[path.join(packageRoot,'desktop','server.mjs')],{cwd:packageRoot,windowsHide:true,detached:true,stdio:'ignore'});
    child.unref();
    let alive=null;
    for(let tries=0;tries<40;tries++) {alive=await health(origin);if(alive)break;await new Promise(r=>setTimeout(r,150));}
    if(!alive || alive.appId!==APP_ID || alive.buildId!==buildId) throw new Error('The local server could not start. Check that ports 8765 and 8766 are free, then run Start.cmd again.');
  }
  const runner=await health('http://127.0.0.1:8766');
  if(!runner || runner.appId!==APP_ID || runner.buildId!==buildId || runner.role!=='runner') throw new Error('The isolated runner is unavailable on port 8766. Stop DSA Visual Lab, free that port, and restart.');
  const browser=process.platform==='win32' ? spawn('rundll32.exe',['url.dll,FileProtocolHandler',origin],{windowsHide:true,detached:true,stdio:'ignore'}) : spawn(process.platform==='darwin'?'open':'xdg-open',[origin],{detached:true,stdio:'ignore'});
  browser.unref();
  console.log(`DSA Visual Lab is running at ${origin}. Use Stop.cmd to stop its local servers.`);
} catch(error) {console.error(error.message);process.exitCode=1;}
