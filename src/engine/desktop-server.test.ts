// @vitest-environment node
import {it,expect} from 'vitest';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import net from 'node:net';
import http from 'node:http';
// @ts-expect-error local JavaScript server deliberately has no build dependency
import {startServers} from '../../desktop/server.mjs';
async function freePort():Promise<number>{const server=net.createServer();await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));const port=(server.address() as net.AddressInfo).port;await new Promise<void>(resolve=>server.close(()=>resolve()));return port;}
it('serves only local assets with separate policies, rejects foreign hosts and protects Stop',async()=>{
 const root=await mkdtemp(path.join(tmpdir(),'DSA server test with spaces '));await mkdir(path.join(root,'dist','assets'),{recursive:true});
 await writeFile(path.join(root,'dist','index.html'),'<!doctype html>app');await writeFile(path.join(root,'dist','runner-bridge.html'),'<!doctype html>bridge');await writeFile(path.join(root,'dist','assets','worker.js'),'self.onmessage=()=>{}');
 const appPort=await freePort(),runnerPort=await freePort();let instance;
 try {
  instance=await startServers({root,appPort,runnerPort});const {appOrigin:app,runnerOrigin:runner}=instance;
  const response=await fetch(app);expect(response.status).toBe(200);expect(response.headers.get('content-security-policy')).toContain('frame-src '+runner);expect(response.headers.get('content-security-policy')).not.toContain('unsafe-eval');
  const worker=await fetch(runner+'/assets/worker.js');expect(worker.headers.get('content-security-policy')).toContain("connect-src 'self'");expect(worker.headers.get('content-security-policy')).toContain('frame-ancestors '+app);
  expect((await fetch(runner+'/index.html')).status).toBe(404);expect((await fetch(app+'/AGENTS.md')).status).toBe(404);
  const foreignHost=await new Promise<number|undefined>((resolve,reject)=>{http.get(app,{headers:{Host:'evil.test'}},r=>{r.resume();resolve(r.statusCode);}).on('error',reject);});expect(foreignHost).toBe(403);
  expect((await fetch(app+'/api/stop',{method:'POST',headers:{Origin:app,'X-DSA-Session':'wrong'}})).status).toBe(403);
  expect((await fetch(app+'/api/session')).status).toBe(403);
  const session=await (await fetch(app+'/api/session',{headers:{Origin:app}})).json();expect(typeof session.token).toBe('string');
  const stopped=await fetch(app+'/api/stop',{method:'POST',headers:{Origin:app,'X-DSA-Session':session.token}});expect(stopped.status).toBe(200);
 } finally {await instance?.close();if(!path.resolve(root).startsWith(path.resolve(tmpdir())+path.sep))throw Error('Temporary cleanup escaped its root.');await rm(root,{recursive:true,force:true});}
},15000);
