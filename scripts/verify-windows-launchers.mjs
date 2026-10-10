/** Native acceptance of an already frozen/extracted Windows package.
 * No build, download, stage, ZIP, global environment change or blanket kill.
 * Run only when the release owner provides the actual stage and freeze hash:
 * node scripts/verify-windows-launchers.mjs --stage "...path with spaces..." --expect-input-hash HASH
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createHash,randomUUID} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {ROOT,verifyStagedPackage} from './package-windows.mjs';

const APP='http://127.0.0.1:8765';
const RUNNER='http://127.0.0.1:8766';
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const tokenHash=value=>createHash('sha256').update(value).digest('hex');
const samePath=(left,right)=>path.resolve(left??'').toLowerCase()===path.resolve(right).toLowerCase();
const within=(parent,child)=>child===parent||child.startsWith(parent+path.sep);

function childCommand(executable,args,{env,cwd,input='',verbatim=false,timeoutMs=15000}={}) {
  return new Promise((resolve,reject)=>{
    const child=spawn(executable,args,{env,cwd,windowsHide:true,windowsVerbatimArguments:verbatim,stdio:['pipe','pipe','pipe']});
    let stdout='',stderr='',timedOut=false;
    const timer=setTimeout(()=>{timedOut=true;child.kill();},timeoutMs);
    child.stdout.setEncoding('utf8');child.stderr.setEncoding('utf8');
    child.stdout.on('data',chunk=>{stdout+=chunk;});child.stderr.on('data',chunk=>{stderr+=chunk;});
    child.stdin.on('error',error=>{if(error.code!=='EPIPE')reject(error);});
    child.on('error',error=>{clearTimeout(timer);reject(error);});
    child.on('close',(code,signal)=>{
      clearTimeout(timer);
      const result={pid:child.pid,code,signal,stdout,stderr};
      if(timedOut)reject(Object.assign(new Error(`Child command exceeded ${timeoutMs}ms.`),{result}));
      else resolve(result);
    });
    // PAUSE in a failing batch launcher receives input and EOF, never a terminal.
    child.stdin.end(input);
  });
}

export async function verifyWindowsLaunchers({stage,expectedInputHash,output}={}) {
  assert.equal(process.platform,'win32','This acceptance script requires native Windows.');
  assert.ok(stage,'Supply --stage for the already frozen extracted package.');
  assert.match(expectedInputHash??'',/^[a-f0-9]{64}$/,'Supply its full --expect-input-hash.');
  stage=fs.realpathSync(path.resolve(stage));
  assert.match(stage,/\s/,'The extracted package path must contain a space.');
  const systemRoot=process.env.SystemRoot;
  assert.ok(systemRoot,'Windows SystemRoot is required.');
  const system32=path.join(systemRoot,'System32');
  const powershell=path.join(system32,'WindowsPowerShell','v1.0','powershell.exe');
  const cmd=path.join(system32,'cmd.exe');
  const portableNode=path.join(stage,'runtime','node.exe');
  const serverFile=path.join(stage,'desktop','server.mjs');
  const restrictedPath=[system32,systemRoot,path.join(system32,'Wbem'),path.dirname(powershell)].join(path.delimiter);
  const childEnv={...process.env,PATH:restrictedPath,NODE_PATH:'',NODE_OPTIONS:'',DSA_ACCEPTANCE_NODE:portableNode,DSA_ACCEPTANCE_SERVER:serverFile};
  // This assignment is to the child environment object, not process.env.
  const originalPath=process.env.PATH;
  const inventory=verifyStagedPackage(stage,expectedInputHash);
  assert.equal(fs.readFileSync(path.join(stage,'build-id.txt'),'utf8').trim(),inventory.buildId);
  const stamp=new Date().toISOString().replace(/[:.]/g,'-');
  output=path.resolve(output??path.join(ROOT,'outputs',`launcher acceptance ${stamp} ${randomUUID().slice(0,8)}`));
  assert.ok(!within(stage,output),'Reports and working directories must be outside the immutable stage.');
  assert.ok(!fs.existsSync(output),'The acceptance report directory must be new.');
  fs.mkdirSync(output,{recursive:true});
  const workingDirectory=path.join(output,'working directory with spaces');
  fs.mkdirSync(workingDirectory);
  const report={formatVersion:1,startedAt:new Date().toISOString(),stage,inputHash:expectedInputHash,buildId:inventory.buildId,
    hostPlatform:process.platform,portableNode,childPath:restrictedPath,workingDirectory,
    scope:'Actual Start.cmd/Stop.cmd launch, process identity, authenticated lifecycle and owned port-conflict fixtures. Browser execution is a separate release check.',
    tests:[],commands:[],cleanup:[],status:'running'};
  const ownedDummyServers=new Set();
  const ownedDsaPids=new Set();
  const baselineDsaPids=new Set();
  let lifecycleEntered=false;
  const log=value=>{
    const line=`${new Date().toISOString()} ${value}`;
    fs.appendFileSync(path.join(output,'launchers.log'),line+'\n');
    console.log(line);
  };

  async function nativeState() {
    // Target paths are environment values, never interpolated into shell code.
    const script=`$ErrorActionPreference='Stop';
      $packageRows=@(Get-CimInstance Win32_Process | Where-Object {
        $_.ExecutablePath -and $_.CommandLine -and
        [string]::Equals($_.ExecutablePath,$env:DSA_ACCEPTANCE_NODE,[System.StringComparison]::OrdinalIgnoreCase) -and
        $_.CommandLine.IndexOf($env:DSA_ACCEPTANCE_SERVER,[System.StringComparison]::OrdinalIgnoreCase) -ge 0
      } | ForEach-Object { [pscustomobject]@{pid=[int]$_.ProcessId;parentPid=[int]$_.ParentProcessId;executable=$_.ExecutablePath;commandLine=$_.CommandLine} });
      $listenerRows=@(Get-NetTCPConnection -State Listen -ErrorAction Stop | Where-Object { $_.LocalPort -eq 8765 -or $_.LocalPort -eq 8766 } | ForEach-Object {
        $listenerPid=[int]$_.OwningProcess;
        $listenerProcess=Get-CimInstance Win32_Process -Filter ('ProcessId = '+$listenerPid);
        [pscustomobject]@{port=[int]$_.LocalPort;address=$_.LocalAddress;pid=$listenerPid;executable=$listenerProcess.ExecutablePath;commandLine=$listenerProcess.CommandLine}
      });
      @{listeners=$listenerRows;packageProcesses=$packageRows} | ConvertTo-Json -Depth 6 -Compress`;
    const result=await childCommand(powershell,['-NoLogo','-NoProfile','-NonInteractive','-Command',script],{env:childEnv,cwd:workingDirectory});
    assert.equal(result.code,0,`Native process inspection failed: ${result.stderr}`);
    const state=JSON.parse(result.stdout.trim());
    if(lifecycleEntered)for(const processRow of state.packageProcesses)if(!baselineDsaPids.has(processRow.pid))ownedDsaPids.add(processRow.pid);
    return state;
  }
  async function request(origin,pathname,options={}) {
    const response=await fetch(origin+pathname,{...options,signal:AbortSignal.timeout(1500)});
    const body=await response.text();
    return {status:response.status,body};
  }
  async function health(origin) {
    const response=await request(origin,'/health');
    assert.equal(response.status,200,`${origin}: health status`);
    return JSON.parse(response.body);
  }
  async function matchingHealth() {
    const app=await health(APP),runner=await health(RUNNER);
    for(const [role,value] of [['app',app],['runner',runner]]) {
      assert.equal(value.appId,'dsa-visual-lab');assert.equal(value.buildId,inventory.buildId);assert.equal(value.role,role);
      assert.equal(value.appOrigin,APP);assert.equal(value.runnerOrigin,RUNNER);
    }
    return {app,runner};
  }
  async function session() {
    const response=await request(APP,'/api/session',{headers:{Origin:APP}});
    assert.equal(response.status,200);
    const token=JSON.parse(response.body).token;assert.match(token,/^[a-f0-9]{64}$/);
    return token;
  }
  async function poll(check,label,timeoutMs=5000) {
    const deadline=Date.now()+timeoutMs;let last;
    do {try{return await check();}catch(error){last=error;}await sleep(120);}while(Date.now()<deadline);
    throw new Error(`${label}: ${last?.message??'timeout'}`);
  }
  async function noDsaInstance(expectedFixturePort=null) {
    return poll(async()=>{
      const state=await nativeState();
      assert.equal(state.packageProcesses.length,0,'An orphan staged DSA server remains.');
      const unexpected=state.listeners.filter(row=>row.port!==expectedFixturePort);
      assert.deepEqual(unexpected,[],'An unexpected app/runner listener remains.');
      if(expectedFixturePort!==null)assert.ok(state.listeners.some(row=>row.port===expectedFixturePort&&row.pid===process.pid),'Owned conflict fixture must remain listening.');
      return state;
    },'Wait for owned DSA server exit');
  }
  async function actualDsaIdentity() {
    const healthState=await matchingHealth();
    const state=await nativeState();
    const rows=[8765,8766].map(port=>{
      const found=state.listeners.filter(row=>row.port===port);
      assert.equal(found.length,1,`One native listener on ${port}`);return found[0];
    });
    assert.equal(rows[0].pid,rows[1].pid,'App and runner must belong to the same owned portable process.');
    for(const row of rows){assert.ok(samePath(row.executable,portableNode),'The listening executable must be staged runtime/node.exe.');assert.ok(row.commandLine.includes(serverFile),'The listener must execute this staged server.');}
    assert.ok(ownedDsaPids.has(rows[0].pid),'This test must have created the staged server.');
    return {pid:rows[0].pid,listeners:rows,health:healthState};
  }
  async function launcher(name) {
    const result=await childCommand(cmd,['/d','/v:off','/s','/c','""%DSA_ACCEPTANCE_LAUNCHER%""'],{
      env:{...childEnv,DSA_ACCEPTANCE_LAUNCHER:path.join(stage,name)},cwd:workingDirectory,input:'\r\n',verbatim:true,
    });
    report.commands.push({launcher:name,...result});
    log(`${name}: exit ${result.code}; ${(result.stdout+result.stderr).trim().replace(/\r?\n/g,' | ')}`);
    // Capture any server left by an unsuccessful launcher as well.
    await nativeState();
    return result;
  }
  async function check(name,operation) {
    log(`Checking ${name}`);const started=Date.now();
    try {const details=await operation();report.tests.push({name,status:'passed',elapsedMs:Date.now()-started,details});}
    catch(error){report.tests.push({name,status:'failed',elapsedMs:Date.now()-started,error:error.message});throw error;}
  }
  async function dummy(port,{foreign=false}={}) {
    const marker=`owned-conflict-${randomUUID()}`;
    const requests=[];
    const server=http.createServer((req,res)=>{
      requests.push({method:req.method,url:req.url});
      if(req.url==='/health'&&foreign){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({appId:'dsa-visual-lab',role:'app',buildId:'foreign-build-'+marker,appOrigin:APP,runnerOrigin:RUNNER}));}
      else if(req.url==='/owned-fixture'){res.end(marker);}
      else {res.writeHead(404).end('Owned conflict fixture.');}
    });
    await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});
    ownedDummyServers.add(server);
    return {server,port,marker,requests};
  }
  async function closeDummy(fixture) {
    await new Promise(resolve=>{fixture.server.close(resolve);fixture.server.closeAllConnections();});
    ownedDummyServers.delete(fixture.server);
  }
  async function fixtureSurvives(fixture) {
    assert.equal((await request(`http://127.0.0.1:${fixture.port}`,'/owned-fixture')).body,fixture.marker);
    return noDsaInstance(fixture.port);
  }

  try {
    await check('preflight: ports free and stage unchanged',async()=>{
      const state=await nativeState();
      for(const processRow of state.packageProcesses)baselineDsaPids.add(processRow.pid);
      assert.deepEqual(state.listeners,[],'Ports 8765/8766 are occupied; existing processes are not stopped by this script.');
      assert.deepEqual(state.packageProcesses,[],'An existing staged server is not owned by this acceptance run.');
      const version=await childCommand(portableNode,['--version'],{env:childEnv,cwd:workingDirectory});
      assert.equal(version.code,0);assert.equal(version.stdout.trim(),`v${inventory.nodeVersion}`);
      lifecycleEntered=true;
      return {nativeState:state,nodeVersion:version.stdout.trim(),stageVerified:true};
    });
    let firstIdentity,firstToken;
    await check('Start.cmd from unrelated cwd with spaces uses portable Node',async()=>{
      const result=await launcher('Start.cmd');assert.equal(result.code,0);assert.match(result.stdout,/DSA Visual Lab is running/);
      firstIdentity=await poll(actualDsaIdentity,'Wait for staged dual-origin server');firstToken=await session();
      return {...firstIdentity,sessionTokenSha256:tokenHash(firstToken)};
    });
    await check('second Start.cmd reuses process and session',async()=>{
      const result=await launcher('Start.cmd');assert.equal(result.code,0);
      const identity=await actualDsaIdentity();assert.equal(identity.pid,firstIdentity.pid);assert.equal(await session(),firstToken);
      return {pid:identity.pid,sessionTokenSha256:tokenHash(firstToken)};
    });
    await check('wrong Origin and absent/bad stop tokens cannot stop servers',async()=>{
      const attempts=[
        {pathname:'/api/session',options:{},label:'session without Origin'},
        {pathname:'/api/session',options:{headers:{Origin:RUNNER}},label:'session from runner Origin'},
        {pathname:'/api/stop',options:{method:'POST',headers:{Origin:RUNNER,'X-DSA-Session':firstToken}},label:'stop from runner Origin'},
        {pathname:'/api/stop',options:{method:'POST',headers:{'X-DSA-Session':firstToken}},label:'stop without Origin'},
        {pathname:'/api/stop',options:{method:'POST',headers:{Origin:APP,'X-DSA-Session':'bad-token'}},label:'stop with bad token'},
        {pathname:'/api/stop',options:{method:'POST',headers:{Origin:APP}},label:'stop without token'},
      ];
      const results=[];
      for(const attempt of attempts){const response=await request(APP,attempt.pathname,attempt.options);assert.equal(response.status,403,attempt.label);await matchingHealth();results.push({label:attempt.label,status:response.status});}
      assert.equal((await actualDsaIdentity()).pid,firstIdentity.pid);return results;
    });
    await check('matching Stop.cmd releases both native ports',async()=>{
      const result=await launcher('Stop.cmd');assert.equal(result.code,0);assert.match(result.stdout,/DSA Visual Lab stopped/);
      return noDsaInstance();
    });
    await check('repeat Stop.cmd succeeds when already stopped',async()=>{
      const result=await launcher('Stop.cmd');assert.equal(result.code,0);assert.match(result.stdout,/already stopped/);return noDsaInstance();
    });
    await check('restart uses portable Node and rotates session token',async()=>{
      const result=await launcher('Start.cmd');assert.equal(result.code,0);
      const identity=await poll(actualDsaIdentity,'Wait for restart');const nextToken=await session();assert.notEqual(nextToken,firstToken);
      const stop=await launcher('Stop.cmd');assert.equal(stop.code,0);await noDsaInstance();
      return {...identity,previousTokenSha256:tokenHash(firstToken),newTokenSha256:tokenHash(nextToken)};
    });
    for(const port of [8765,8766])await check(`occupied ${port}: Start fails and owned fixture survives`,async()=>{
      const fixture=await dummy(port);
      try {
        const result=await launcher('Start.cmd');assert.notEqual(result.code,0,'Failed Start.cmd must return a failure exit code.');
        assert.match(result.stdout+result.stderr,/could not start|runner is unavailable|Port 8765 belongs/);
        const state=await fixtureSurvives(fixture);return {port,fixturePid:process.pid,nativeState:state,requests:fixture.requests};
      } finally {await closeDummy(fixture);await noDsaInstance();}
    });
    await check('foreign-build health cannot be reused or stopped',async()=>{
      const fixture=await dummy(8765,{foreign:true});
      try {
        const start=await launcher('Start.cmd');assert.notEqual(start.code,0);assert.match(start.stdout+start.stderr,/another application or another DSA build/);await fixtureSurvives(fixture);
        const stop=await launcher('Stop.cmd');assert.notEqual(stop.code,0);assert.match(stop.stdout+stop.stderr,/another application or DSA build.*left running/);await fixtureSurvives(fixture);
        assert.ok(!fixture.requests.some(row=>row.url==='/api/session'||row.url==='/api/stop'),'Foreign fixture must never receive shutdown authentication or a stop request.');
        return {fixturePid:process.pid,requests:fixture.requests};
      } finally {await closeDummy(fixture);await noDsaInstance();}
    });
    await check('final ports free, stage checksums and parent PATH unchanged',async()=>{
      const state=await noDsaInstance();verifyStagedPackage(stage,expectedInputHash);assert.equal(process.env.PATH,originalPath);
      return {nativeState:state,stageVerified:true,parentPathUnchanged:true};
    });
    report.status='passed';
  } catch(error) {
    report.status='failed';report.error=error.message;log(`FAILED: ${error.message}`);
  } finally {
    // Fixtures live in this script's process and are closed directly.
    for(const server of ownedDummyServers){await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});report.cleanup.push({kind:'owned-dummy',action:'closed'});}
    if(lifecycleEntered) {
      try {
        let state=await nativeState();
        if(state.packageProcesses.length) {
          try {
            const identity=await actualDsaIdentity();
            if(ownedDsaPids.has(identity.pid)) {
              const token=await session();const stopped=await request(APP,'/api/stop',{method:'POST',headers:{Origin:APP,'X-DSA-Session':token}});
              assert.equal(stopped.status,200);await noDsaInstance();report.cleanup.push({kind:'owned-dsa',pid:identity.pid,action:'authenticated-stop'});
            }
          } catch(error) {report.cleanup.push({kind:'authenticated-stop',error:error.message});}
          state=await nativeState();
          for(const processRow of state.packageProcesses) {
            // Verify the identity again immediately before terminating one PID.
            if(!ownedDsaPids.has(processRow.pid)||baselineDsaPids.has(processRow.pid)||!samePath(processRow.executable,portableNode)||!processRow.commandLine.includes(serverFile))continue;
            process.kill(processRow.pid);report.cleanup.push({kind:'owned-dsa',pid:processRow.pid,action:'terminate-exact-verified-PID'});
          }
        }
        report.finalNativeState=await noDsaInstance();
      } catch(error) {report.status='failed';report.cleanup.push({error:error.message});}
    }
    if(process.env.PATH!==originalPath){report.status='failed';report.cleanup.push({error:'Parent PATH changed unexpectedly.'});}
    try {verifyStagedPackage(stage,expectedInputHash);report.stageVerifiedAfterTests=true;}
    catch(error){report.status='failed';report.cleanup.push({error:error.message});}
    report.finishedAt=new Date().toISOString();
    report.passedTests=report.tests.filter(row=>row.status==='passed').length;
    report.failedTests=report.tests.filter(row=>row.status==='failed').length;
    fs.writeFileSync(path.join(output,'launchers.json'),JSON.stringify(report,null,2)+'\n');
    log(`${report.status.toUpperCase()}: ${report.passedTests} passed, ${report.failedTests} failed. Report: ${path.join(output,'launchers.json')}`);
  }
  if(report.status!=='passed')throw Object.assign(new Error(`Launcher acceptance failed; see ${path.join(output,'launchers.json')}`),{report});
  return report;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const args=process.argv.slice(2);
  const option=name=>{const index=args.indexOf(name);return index<0?undefined:args[index+1];};
  if(args.includes('--help'))console.log('Usage (after release freeze only): node scripts/verify-windows-launchers.mjs --stage "EXTRACTED PATH WITH SPACES" --expect-input-hash FULL_SHA256 [--output "NEW outputs/report directory"]');
  else try {await verifyWindowsLaunchers({stage:option('--stage'),expectedInputHash:option('--expect-input-hash'),output:option('--output')});}
  catch(error){console.error(error.message);process.exitCode=1;}
}
