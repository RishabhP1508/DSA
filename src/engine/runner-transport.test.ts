import {afterEach,describe,it,expect,vi} from 'vitest';
import {createRunnerTransport} from './runner-transport';
import {loopbackOrigin,getRunnerConfig} from './runner-config';
const app='http://127.0.0.1:4173',runner='http://127.0.0.1:4174';
const request={v:1,runId:7,owner:'probe',sourceRev:3,inputRev:4,seq:0,kind:'run',payload:{source:'print(1)',stdin:'',limits:{timeMs:10000,maxEvents:10000,maxTraceBytes:16777216}}};
const result={v:1,runId:7,owner:'probe',sourceRev:3,inputRev:4,seq:0,kind:'result',payload:{status:'completed',tail:[],stdout:'1\n',stderr:'',incomplete:false}};
afterEach(()=>{vi.unstubAllGlobals();document.querySelectorAll('iframe').forEach(f=>f.remove());});
function setup(){vi.stubGlobal('location',{origin:app});vi.stubGlobal('__DSA_RUNNER_CONFIG__',{mode:'cross-origin',appOrigin:app,runnerOrigin:runner,bridgePath:'/runner-bridge.html'});return createRunnerTransport();}
describe('separate-origin runner transport',()=>{
 it('accepts exact loopback origins and rejects remote, credentialed, path and wildcard values',()=>{
   expect(loopbackOrigin(runner)).toBe(runner);
   for(const value of ['https://127.0.0.1:4174','http://localhost:4174','http://example.com','http://user@127.0.0.1:4174','http://127.0.0.1:4174/path','*'])expect(()=>loopbackOrigin(value)).toThrow();
 });
 it('fails closed when deployment supplies the same origin for the runner',()=>{
   vi.stubGlobal('location',{origin:app});vi.stubGlobal('__DSA_RUNNER_CONFIG__',{mode:'cross-origin',appOrigin:app,runnerOrigin:app,bridgePath:'/runner-bridge.html'});expect(getRunnerConfig).toThrow();
 });
 it('queues one request and validates origin, source, identity, sequence and nested payload',()=>{
   const worker=setup();const receive=vi.fn();worker.onmessage=receive;
   const iframe=document.querySelector('iframe')!;const post=vi.spyOn(iframe.contentWindow!,'postMessage');
   worker.postMessage(request);
   const send=(data:unknown,origin=runner,source:Window=iframe.contentWindow!)=>window.dispatchEvent(new MessageEvent('message',{data,origin,source}));
   send({type:'dsa-bridge-ready',version:1},app);expect(post).not.toHaveBeenCalled();
   send({type:'dsa-bridge-ready',version:1},runner,window);expect(post).not.toHaveBeenCalled();
   send({type:'dsa-bridge-ready',version:1});expect(post).toHaveBeenCalledWith(request,runner);
   send(result,app);send(result,runner,window);send({...result,owner:'wrong'});send({...result,payload:{...result.payload,tail:[{}]}});expect(receive).not.toHaveBeenCalled();
   send(result);send(result);expect(receive).toHaveBeenCalledTimes(1);
   worker.terminate();
   expect(document.querySelector('iframe')).not.toBeNull();
   const command=post.mock.calls.at(-1)![0];
   expect(command).toMatchObject({type:'dsa-bridge-terminate',version:1});
   send({...result,seq:1});expect(receive).toHaveBeenCalledTimes(1);
   const ack={type:'dsa-bridge-terminated',version:1,token:command.token};
   send(ack,app);send(ack,runner,window);send({...ack,token:'wrong'});
   expect(document.querySelector('iframe')).not.toBeNull();
   send(ack);expect(document.querySelector('iframe')).toBeNull();
 });
 it('cannot reuse a bridge for a second program',()=>{const worker=setup();worker.postMessage(request);expect(()=>worker.postMessage({...request,runId:8})).toThrow(/one run/);worker.terminate();});
});
