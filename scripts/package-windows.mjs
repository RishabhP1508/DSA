import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {collectNotices,writeNotices,fetchNoticeSources} from './third-party-notices.mjs';

export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const NODE_VERSION='24.21.0';
export const NODE_ARCHIVE=`node-v${NODE_VERSION}-win-x64.zip`;
export const NODE_SHA256='158f7685b44de51f6c0df1d153526cbcd3e1bc739a8dfc607721cef75de9e541';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const posix=p=>p.replaceAll('\\','/');
function powershell(command,environment){
 const result=spawnSync('powershell.exe',['-NoLogo','-NoProfile','-NonInteractive','-Command',command],{env:{...process.env,...environment},windowsHide:true,encoding:'utf8'});
 if(result.status!==0)throw new Error(result.stderr||result.stdout||'PowerShell packaging operation failed.');
 return result.stdout;
}
export async function prepareRuntime(root=ROOT){
 if(process.platform!=='win32')throw new Error('Runtime extraction uses Windows Expand-Archive.');
 const vendor=path.join(root,'vendor');fs.mkdirSync(vendor,{recursive:true});
 const manifestUrl=`https://nodejs.org/dist/v${NODE_VERSION}/SHASUMS256.txt`;
 const archiveUrl=`https://nodejs.org/dist/v${NODE_VERSION}/${NODE_ARCHIVE}`;
 const response=await fetch(manifestUrl,{signal:AbortSignal.timeout(30_000)});
 if(!response.ok)throw new Error(`Cannot fetch official Node manifest: ${response.status}`);
 const checksums=await response.text();
 const expected=checksums.split(/\r?\n/).find(line=>line.endsWith(`  ${NODE_ARCHIVE}`))?.split(/\s+/)[0];
 if(expected!==NODE_SHA256)throw new Error('Official manifest does not match the reviewed pinned archive checksum.');
 const archive=path.join(vendor,NODE_ARCHIVE);
 if(!fs.existsSync(archive)||sha(fs.readFileSync(archive))!==NODE_SHA256){
  const binary=await fetch(archiveUrl,{signal:AbortSignal.timeout(60_000)});
  if(!binary.ok)throw new Error(`Cannot download official Node archive: ${binary.status}`);
  const bytes=Buffer.from(await binary.arrayBuffer());
  if(sha(bytes)!==NODE_SHA256)throw new Error('Node archive checksum mismatch. Nothing will be extracted.');
  fs.writeFileSync(archive,bytes);
 }
 fs.writeFileSync(path.join(vendor,`SHASUMS256-node-v${NODE_VERSION}.txt`),checksums);
 const extracted=path.join(vendor,`node-v${NODE_VERSION}-win-x64`);
 // Re-extract from the verified ZIP even when cached files exist; do not
 // establish new provenance by trusting a potentially replaced executable.
 powershell('Expand-Archive -LiteralPath $env:DSA_NODE_ARCHIVE -DestinationPath $env:DSA_NODE_VENDOR -Force',{DSA_NODE_ARCHIVE:archive,DSA_NODE_VENDOR:vendor});
 const node=path.join(extracted,'node.exe');
 const version=spawnSync(node,['--version'],{encoding:'utf8',windowsHide:true});
 if(version.status!==0||version.stdout.trim()!==`v${NODE_VERSION}`)throw new Error('Portable Node does not report the reviewed version.');
 const metadata={version:NODE_VERSION,architecture:'win-x64',archiveUrl,manifestUrl,archiveSha256:NODE_SHA256,nodeSha256:sha(fs.readFileSync(node)),licenseSha256:sha(fs.readFileSync(path.join(extracted,'LICENSE'))),verifiedAt:new Date().toISOString(),verification:'SHA256 against the exact official release manifest; no GPG signature validation was performed.'};
 fs.writeFileSync(path.join(vendor,'node-runtime-provenance.json'),JSON.stringify(metadata,null,2)+'\n');
 await fetchNoticeSources(root);
 return metadata;
}

function walk(directory){
 const files=[];
 for(const entry of fs.readdirSync(directory,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en'))){
  const absolute=path.join(directory,entry.name);
  if(entry.isSymbolicLink())throw new Error(`Packaging refuses symbolic links: ${absolute}`);
  if(entry.isDirectory()){if(entry.name==='__pycache__')continue;files.push(...walk(absolute));}
  else if(entry.isFile()&&!entry.name.endsWith('.pyc'))files.push(absolute);
 }
 return files;
}
export function createInventory(root=ROOT){
 const rows=[];
 function addFile(source,destination){
  const absolute=path.join(root,source);
  if(!fs.statSync(absolute).isFile())throw new Error(`Required package file missing: ${source}`);
  const bytes=fs.readFileSync(absolute);
  rows.push({source:posix(source),destination:posix(destination),bytes:bytes.length,sha256:sha(bytes)});
 }
 function addDirectory(source,destination){for(const file of walk(path.join(root,source)))addFile(path.relative(root,file),path.join(destination,path.relative(path.join(root,source),file)));}
 for(const file of ['dist/index.html','dist/runner-bridge.html','dist/pyodide/pyodide.mjs','dist/pyodide/pyodide.asm.mjs','dist/pyodide/pyodide.asm.wasm','dist/pyodide/python_stdlib.zip','dist/pyodide/pyodide-lock.json','desktop/server.mjs','desktop/start.mjs','desktop/stop.mjs','Start.cmd','Stop.cmd'])if(!fs.existsSync(path.join(root,file)))throw new Error(`Missing required frozen-build input: ${file}`);
 const runtime=JSON.parse(fs.readFileSync(path.join(root,'vendor','node-runtime-provenance.json'),'utf8'));
 if(runtime.version!==NODE_VERSION||runtime.archiveSha256!==NODE_SHA256)throw new Error('Portable runtime provenance does not match the pinned version. Run --fetch-runtime.');
 const archive=path.join(root,'vendor',NODE_ARCHIVE);
 if(sha(fs.readFileSync(archive))!==NODE_SHA256)throw new Error('Cached official Node archive no longer matches its checksum.');
 const runtimeDir=`vendor/node-v${NODE_VERSION}-win-x64`;
 if(sha(fs.readFileSync(path.join(root,runtimeDir,'node.exe')))!==runtime.nodeSha256||sha(fs.readFileSync(path.join(root,runtimeDir,'LICENSE')))!==runtime.licenseSha256)throw new Error('Extracted Node runtime or license changed.');
 addDirectory('dist','dist');addDirectory('desktop','desktop');
 addFile('Start.cmd','Start.cmd');addFile('Stop.cmd','Stop.cmd');
 addFile(`${runtimeDir}/node.exe`,'runtime/node.exe');addFile(`${runtimeDir}/LICENSE`,'runtime/LICENSE');
 addFile('vendor/node-runtime-provenance.json','runtime/provenance.json');
 addFile(`vendor/SHASUMS256-node-v${NODE_VERSION}.txt`,'runtime/SHASUMS256.txt');
 for(const dir of ['src','public','scripts','docs','e2e','.kiro'])if(fs.existsSync(path.join(root,dir)))addDirectory(dir,`source/${dir}`);
 for(const file of ['package.json','package-lock.json','README.md','AGENTS.md','LICENSE','NOTICE','components.json','index.html','runner-bridge.html','vite.config.ts','vitest.config.ts','playwright.config.ts','tsconfig.json','tsconfig.app.json','tsconfig.node.json','tsconfig.test.json','.oxlintrc.json','.gitignore'])if(fs.existsSync(path.join(root,file)))addFile(file,`source/${file}`);
 addDirectory('desktop','source/desktop');addFile('Start.cmd','source/Start.cmd');addFile('Stop.cmd','source/Stop.cmd');
 const notices=collectNotices(root);
 for(const item of notices.records)addFile(item.source,item.destination);
 // The fingerprint covers content/path pairs, independent of mtimes and
 // absolute extraction locations. Parent supplies this exact value at freeze.
 rows.sort((a,b)=>a.destination.localeCompare(b.destination,'en'));
 const inputHash=sha(JSON.stringify({files:rows.map(({destination,sha256})=>({destination,sha256})),notices}));
 const buildId=sha(JSON.stringify(rows.filter(r=>r.destination.startsWith('dist/')).map(({destination,sha256})=>({destination,sha256})))).slice(0,24);
 return {formatVersion:1,platform:'Windows x64',nodeVersion:NODE_VERSION,inputHash,buildId,files:rows,totalBytes:rows.reduce((n,r)=>n+r.bytes,0),noticeRecords:notices.records.length,omittedPlatformDependencies:notices.omitted.length,noticeInventory:notices,runtime};
}
export function stagePackage(output,{root=ROOT,expectedInputHash}={}){
 const inventory=createInventory(root);
 if(!expectedInputHash||expectedInputHash!==inventory.inputHash)throw new Error('A matching --expect-input-hash from the frozen inventory is required. No package was created.');
 const destination=path.resolve(output);
 if(fs.existsSync(destination))throw new Error('Output directory already exists. Use a new directory; the builder never deletes existing files.');
 const relative=path.relative(root,destination);
 if(!relative||(!relative.startsWith('..')&&!path.isAbsolute(relative)&&!relative.startsWith('outputs'+path.sep)&&!relative.startsWith('releases'+path.sep)))throw new Error('Inside the repository, staging must be in outputs/ or releases/ so inputs cannot be overwritten.');
 for(const directory of ['src','public','scripts','docs','desktop','dist','vendor']){
  const input=path.join(root,directory);
  if(input===destination||input.startsWith(destination+path.sep)||destination.startsWith(input+path.sep))throw new Error('Output overlaps package inputs.');
 }
 fs.mkdirSync(destination,{recursive:true});
 for(const row of inventory.files){
  const input=path.join(root,row.source);const file=path.join(destination,row.destination);
  fs.mkdirSync(path.dirname(file),{recursive:true});fs.copyFileSync(input,file);
  if(sha(fs.readFileSync(file))!==row.sha256)throw new Error(`Input changed during packaging: ${row.source}. The partial stage must not be published.`);
 }
 writeNotices(destination,{root});
 fs.writeFileSync(path.join(destination,'build-id.txt'),inventory.buildId+'\n');
 fs.writeFileSync(path.join(destination,'package-manifest.json'),JSON.stringify(inventory,null,2)+'\n');
 fs.writeFileSync(path.join(destination,'README.txt'),'DSA Visual Lab - offline Windows x64 package\r\n\r\nExtract the complete ZIP to a normal folder before launching. Double-click Start.cmd. Your default browser opens http://127.0.0.1:8765; the isolated Python runner uses port 8766. Double-click Stop.cmd to stop only this matching build. No installation, npm, system Python, or internet is required to use the app.\r\n\r\nKeep the folder intact. A current Chrome or Edge is required; the browser itself is not included. Progress is kept in browser storage at the fixed local address. Export a progress backup inside the app before clearing browser data.\r\n\r\nThe source/ folder contains the app source and development configuration. Rebuilding source requires installing its locked development dependencies; those are not needed to use the packaged build. THIRD-PARTY-NOTICES.md and licenses/ retain dependency, font and Python notices. runtime/LICENSE retains Node notices. See source/docs/windows-package.md for packaging details.\r\n');
 const complete=walk(destination).filter(file=>path.basename(file)!=='SHA256SUMS.txt').map(file=>`${sha(fs.readFileSync(file))}  ${posix(path.relative(destination,file))}`);
 fs.writeFileSync(path.join(destination,'SHA256SUMS.txt'),complete.join('\n')+'\n');
 // Re-read every input at completion to catch concurrent build/source changes.
 if(createInventory(root).inputHash!==inventory.inputHash)throw new Error('Repository inputs changed while staging. Do not publish this stage; freeze and create a fresh one.');
 return inventory;
}
export function zipPackage(directory,output){
 if(process.platform!=='win32')throw new Error('ZIP creation uses Windows Compress-Archive.');
 if(fs.existsSync(output))throw new Error('ZIP already exists; it will not be overwritten.');
 if(path.resolve(output).startsWith(path.resolve(directory)+path.sep))throw new Error('ZIP output must be outside the staged directory.');
 const parent=path.dirname(path.resolve(output));fs.mkdirSync(parent,{recursive:true});
 powershell('Compress-Archive -LiteralPath $env:DSA_PACKAGE_DIRECTORY -DestinationPath $env:DSA_PACKAGE_ZIP -CompressionLevel Optimal',{DSA_PACKAGE_DIRECTORY:path.resolve(directory),DSA_PACKAGE_ZIP:path.resolve(output)});
 const entries=JSON.parse(powershell(`Add-Type -AssemblyName System.IO.Compression.FileSystem
$taskArchive = [System.IO.Compression.ZipFile]::OpenRead($env:DSA_PACKAGE_ZIP)
$taskRecords = @()
try {
  foreach ($taskEntry in $taskArchive.Entries) {
    if ($taskEntry.FullName.EndsWith('/') -or $taskEntry.FullName.EndsWith('\\')) { continue }
    $taskStream = $taskEntry.Open()
    $taskHasher = [System.Security.Cryptography.SHA256]::Create()
    try { $taskDigest = [BitConverter]::ToString($taskHasher.ComputeHash($taskStream)).Replace('-','').ToLowerInvariant() }
    finally { $taskStream.Dispose(); $taskHasher.Dispose() }
    $taskRecords += @{ path = $taskEntry.FullName; sha256 = $taskDigest }
  }
} finally { $taskArchive.Dispose() }
ConvertTo-Json -InputObject $taskRecords -Compress`,{DSA_PACKAGE_ZIP:path.resolve(output)}));
 const expected=walk(path.resolve(directory)).map(file=>({path:posix(path.join(path.basename(directory),path.relative(directory,file))),sha256:sha(fs.readFileSync(file))}));
 const seen=new Map(entries.map(item=>[posix(item.path),item.sha256]));
 if(seen.size!==entries.length||seen.size!==expected.length||expected.some(item=>seen.get(item.path)!==item.sha256))throw new Error('ZIP entries differ from the tested stage. Do not publish this archive.');
 const digest=sha(fs.readFileSync(output));fs.writeFileSync(output+'.sha256',`${digest}  ${path.basename(output)}\n`);
 return digest;
}
export function verifyStagedPackage(directory,expectedInputHash){
 const root=path.resolve(directory);
 const inventory=JSON.parse(fs.readFileSync(path.join(root,'package-manifest.json'),'utf8'));
 const recomputed=sha(JSON.stringify({files:inventory.files.map(({destination,sha256})=>({destination,sha256})),notices:inventory.noticeInventory}));
 if(!expectedInputHash||inventory.inputHash!==expectedInputHash||recomputed!==expectedInputHash)throw new Error('Staged package does not match the supplied frozen input hash.');
 const checked=new Set();
 for(const line of fs.readFileSync(path.join(root,'SHA256SUMS.txt'),'utf8').trim().split('\n')){
  const match=line.match(/^([0-9a-f]{64})  (.+)$/);
  if(!match)throw new Error('Invalid staged checksum record.');
  const [,digest,relative]=match;
  if(path.isAbsolute(relative)||relative.includes('\\')||relative.split('/').some(part=>!part||part==='..'||part==='.')||checked.has(relative))throw new Error('Unsafe or duplicate staged checksum path.');
  checked.add(relative);
  const file=path.resolve(root,relative);
  if(!file.startsWith(root+path.sep)||sha(fs.readFileSync(file))!==digest)throw new Error(`Missing or changed staged file: ${relative}`);
 }
 const actual=walk(root).map(file=>posix(path.relative(root,file))).filter(file=>file!=='SHA256SUMS.txt');
 if(actual.length!==checked.size||actual.some(file=>!checked.has(file)))throw new Error('Staged directory contains files outside the tested checksum inventory.');
 for(const row of inventory.files)if(sha(fs.readFileSync(path.join(root,row.destination)))!==row.sha256)throw new Error(`Staged input differs from frozen content: ${row.destination}`);
 return inventory;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2);const option=name=>{const i=args.indexOf(name);if(i<0)return undefined;if(!args[i+1]||args[i+1].startsWith('--'))throw new Error(`Missing value for ${name}`);return args[i+1];};
 try{
  if(args.includes('--fetch-runtime'))console.log(JSON.stringify(await prepareRuntime(),null,2));
  else {
   const output=option('--stage');const zip=option('--zip');const existing=option('--zip-existing');
   if(existing){if(output||!zip)throw new Error('--zip-existing requires --zip and cannot be combined with --stage.');const inventory=verifyStagedPackage(existing,option('--expect-input-hash'));const digest=zipPackage(existing,zip);verifyStagedPackage(existing,option('--expect-input-hash'));console.log(JSON.stringify({mode:'zip-tested-stage',inputHash:inventory.inputHash,zip:path.resolve(zip),sha256:digest},null,2));process.exit(0);}
   if(zip&&!output)throw new Error('--zip requires --stage or --zip-existing and a matching freeze hash.');
   const inventory=output?stagePackage(output,{expectedInputHash:option('--expect-input-hash')}):createInventory();
   const json=JSON.stringify(inventory,null,2)+'\n';
   const inventoryPath=option('--inventory-file');if(inventoryPath)fs.writeFileSync(path.resolve(inventoryPath),json);
   console.log(JSON.stringify({mode:output?'staged':'dry-run',inputHash:inventory.inputHash,buildId:inventory.buildId,files:inventory.files.length,totalBytes:inventory.totalBytes,noticeRecords:inventory.noticeRecords,output:output?path.resolve(output):null},null,2));
   if(zip)console.log(JSON.stringify({zip:path.resolve(zip),sha256:zipPackage(output,zip)},null,2));
  }
 }catch(error){console.error(error.message);process.exitCode=1;}
}
