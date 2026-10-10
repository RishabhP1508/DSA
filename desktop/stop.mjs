import {APP_ID,buildIdentity} from './server.mjs';
const origin='http://127.0.0.1:8765';
try {
  const response=await fetch(origin+'/health',{signal:AbortSignal.timeout(1500)});
  const info=await response.json();
  if(info.appId!==APP_ID || info.buildId!==await buildIdentity() || info.role!=='app') throw new Error('This address belongs to another application or DSA build. It was left running.');
  const session=await (await fetch(origin+'/api/session',{headers:{Origin:origin}})).json();
  const result=await fetch(origin+'/api/stop',{method:'POST',headers:{Origin:origin,'X-DSA-Session':session.token}});
  if(!result.ok)throw new Error('The local server refused the stop request.');
  console.log('DSA Visual Lab stopped. Your browser progress is saved.');
} catch(error) {if(error.cause?.code==='ECONNREFUSED')console.log('DSA Visual Lab is already stopped.');else {console.error(error.message);process.exitCode=1;}}
