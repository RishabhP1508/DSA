import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const EXTERNAL_NOTICES=[
 {file:'Pyodide-314.0.7-LICENSE.txt',url:'https://raw.githubusercontent.com/pyodide/pyodide/314.0.7/LICENSE',component:'Pyodide 314.0.7',license:'MPL-2.0'},
 {file:'CPython-3.14.2-LICENSE.txt',url:'https://raw.githubusercontent.com/python/cpython/v3.14.2/LICENSE',component:'CPython 3.14.2',license:'PSF-2.0 and historical notices'},
 {file:'CPython-3.14.2-ACKNOWLEDGEMENTS.rst',url:'https://raw.githubusercontent.com/python/cpython/v3.14.2/Doc/license.rst',component:'CPython incorporated software acknowledgements',license:'Original component notices'},
 {file:'Emscripten-5.0.3-LICENSE.txt',url:'https://raw.githubusercontent.com/emscripten-core/emscripten/5.0.3/LICENSE',component:'Emscripten 5.0.3 runtime',license:'MIT / University of Illinois-NCSA'},
];
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export async function fetchNoticeSources(root=ROOT){
 const target=path.join(root,'vendor','licenses');
 fs.mkdirSync(target,{recursive:true});
 const records=[];
 for(const item of EXTERNAL_NOTICES){
  const response=await fetch(item.url,{signal:AbortSignal.timeout(30_000)});
  if(!response.ok)throw new Error(`Notice download failed: ${response.status} ${item.url}`);
  const bytes=Buffer.from(await response.arrayBuffer());
  if(bytes.length<100 || bytes.toString().startsWith('<!DOCTYPE'))throw new Error(`Unexpected notice content: ${item.url}`);
  fs.writeFileSync(path.join(target,item.file),bytes);
  records.push({...item,sha256:sha(bytes),bytes:bytes.length,accessDate:new Date().toISOString().slice(0,10)});
 }
 // Consult the exact published metadata first. If its gitHead is no longer
 // available upstream, retain the upstream license blob and record that
 // fallback explicitly rather than pretending it was the release commit.
 const metadataUrl='https://registry.npmjs.org/react-remove-scroll-bar/2.3.8';
 const metadataResponse=await fetch(metadataUrl,{signal:AbortSignal.timeout(30_000)});
 if(!metadataResponse.ok)throw new Error('Cannot fetch the exact react-remove-scroll-bar metadata.');
 const metadata=await metadataResponse.json();
 if(!/^[0-9a-f]{40}$/.test(metadata.gitHead??''))throw new Error('Missing published commit for react-remove-scroll-bar.');
 let url=`https://raw.githubusercontent.com/theKashey/react-remove-scroll-bar/${metadata.gitHead}/LICENSE`;
 const response=await fetch(url,{signal:AbortSignal.timeout(30_000)});
 let bytes;let sourceResolution='published commit LICENSE';let upstreamBlob;
 if(response.ok)bytes=Buffer.from(await response.arrayBuffer());
 else {
  const upstream=await fetch('https://api.github.com/repos/theKashey/react-remove-scroll-bar/contents/LICENSE?ref=master',{signal:AbortSignal.timeout(30_000),headers:{'User-Agent':'DSA-Visual-Lab-notice-inventory'}});
  if(!upstream.ok)throw new Error(`Cannot locate upstream license after published commit failed: ${upstream.status}`);
  const blob=await upstream.json();
  if(!/^[0-9a-f]{40}$/.test(blob.sha??'')||blob.encoding!=='base64')throw new Error('Unexpected upstream license response.');
  bytes=Buffer.from(blob.content,'base64');upstreamBlob=blob.sha;url=blob.git_url;
  sourceResolution=`Published gitHead LICENSE returned ${response.status}; current upstream LICENSE blob retained with its content hash. Installed metadata declares MIT.`;
 }
 if(!bytes.toString().includes('MIT License'))throw new Error('Unexpected react-remove-scroll-bar license content.');
 const file='react-remove-scroll-bar-2.3.8-LICENSE.txt';
 fs.writeFileSync(path.join(target,file),bytes);
 records.push({file,url,metadataUrl,publishedCommit:metadata.gitHead,upstreamBlob,sourceResolution,component:'react-remove-scroll-bar 2.3.8',license:'MIT',sha256:sha(bytes),bytes:bytes.length,accessDate:new Date().toISOString().slice(0,10)});
 fs.writeFileSync(path.join(target,'provenance.json'),JSON.stringify(records,null,2)+'\n');
 return records;
}

function noticeFiles(directory){
 return fs.readdirSync(directory,{withFileTypes:true}).filter(entry=>entry.isFile()&&/^(licen[cs]e|copying|notice|copyright|ofl)([.-]|$)/i.test(entry.name)).map(entry=>path.join(directory,entry.name));
}
export function collectNotices(root=ROOT){
 const lock=JSON.parse(fs.readFileSync(path.join(root,'package-lock.json'),'utf8'));
 const externalDir=path.join(root,'vendor','licenses');
 const provenance=JSON.parse(fs.readFileSync(path.join(externalDir,'provenance.json'),'utf8'));
 const records=[];
 const omitted=[];
 for(const [directory,locked] of Object.entries(lock.packages)){
  if(!directory.startsWith('node_modules/') || locked.dev)continue;
  const absolute=path.resolve(root,directory);
  if(!fs.existsSync(path.join(absolute,'package.json'))){
   if(!locked.optional)throw new Error(`Missing installed dependency: ${directory}`);
   omitted.push({directory,reason:'Optional platform dependency not installed and not redistributed.'});continue;
  }
  const pkg=JSON.parse(fs.readFileSync(path.join(absolute,'package.json'),'utf8'));
  if(pkg.version!==locked.version)throw new Error(`Installed/locked version mismatch for ${pkg.name}: ${pkg.version} != ${locked.version}`);
  // The platform bundler binary is a build tool. It is neither in dist nor
  // copied to this portable runtime; source contains lock metadata only.
  if(pkg.name.startsWith('@rolldown/binding-')){omitted.push({directory,reason:'Build-only native bundler, not redistributed.'});continue;}
  let files=noticeFiles(absolute);
  if(pkg.name==='pyodide')files=[path.join(externalDir,'Pyodide-314.0.7-LICENSE.txt')];
  if(pkg.name==='react-remove-scroll-bar')files=[path.join(externalDir,'react-remove-scroll-bar-2.3.8-LICENSE.txt')];
  if(files.length===0)throw new Error(`No actual notice text found for ${pkg.name}@${pkg.version}; resolve before packaging.`);
  for(const file of files){
   const bytes=fs.readFileSync(file);
   if(!bytes.length)throw new Error(`Empty notice: ${file}`);
   const slug=`${pkg.name.replaceAll('/','__').replaceAll('@','')}-${pkg.version}`;
   records.push({name:pkg.name,version:pkg.version,license:typeof pkg.license==='string'?pkg.license:JSON.stringify(pkg.license??null),source:path.relative(root,file).replaceAll('\\','/'),destination:`licenses/npm/${slug}/${path.basename(file)}`,sha256:sha(bytes),bytes:bytes.length,packagePath:directory});
  }
 }
 for(const item of provenance){
  const file=path.join(externalDir,item.file);
  const bytes=fs.readFileSync(file);
  if(sha(bytes)!==item.sha256)throw new Error(`Cached external notice changed: ${item.file}`);
  records.push({name:item.component,version:'see component name',license:item.license,source:path.relative(root,file).replaceAll('\\','/'),destination:`licenses/runtime/${item.file}`,sha256:item.sha256,bytes:bytes.length,url:item.url});
 }
 return {records,omitted,provenance};
}
export function writeNotices(packageDirectory,{root=ROOT}={}){
 const inventory=collectNotices(root);
 for(const item of inventory.records){
  const output=path.join(packageDirectory,item.destination);
  fs.mkdirSync(path.dirname(output),{recursive:true});
  fs.copyFileSync(path.join(root,item.source),output);
 }
 fs.writeFileSync(path.join(packageDirectory,'third-party-inventory.json'),JSON.stringify(inventory,null,2)+'\n');
 const lines=['# Third-party notices','','License texts and original copyright notices are retained in licenses/. Installed nondevelopment dependencies are conservatively inventoried; some are build-time dependencies whose code may not be included in the app. Optional uninstalled platform binaries and the native build-only bundler are not redistributed.','',
 'Portable Node 24.21.0 is unmodified; runtime/LICENSE contains its full license and incorporated third-party notices. Only node.exe and those notices are included; npm and its installed packages are not shipped.','',
 'The bundled Pyodide 314.0.7 / CPython 3.14.2 / Emscripten 5.0.3 files are copied without modifications. Pyodide source is available under MPL-2.0 at https://github.com/pyodide/pyodide/tree/314.0.7 and https://github.com/pyodide/pyodide/archive/refs/tags/314.0.7.tar.gz . The full MPL-2.0 text is included in licenses/runtime/. Python source and its incorporated notices are available at https://github.com/python/cpython/tree/v3.14.2 ; Emscripten at https://github.com/emscripten-core/emscripten/tree/5.0.3 . These source links are for obtaining source; app execution does not require network access.','',
 'DM Sans, Fraunces and JetBrains Mono retain their full package-specific SIL Open Font License 1.1 texts and copyright lines under licenses/npm/. The font data is not renamed or modified.','',
 '| Component | Version | Declared license | Included notice |','| --- | --- | --- | --- |'];
 for(const item of inventory.records)lines.push(`| ${item.name} | ${item.version} | ${item.license.replaceAll('|','\\|')} | [${path.basename(item.destination)}](${item.destination}) |`);
 fs.writeFileSync(path.join(packageDirectory,'THIRD-PARTY-NOTICES.md'),lines.join('\n')+'\n');
 return inventory;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  if(process.argv.includes('--fetch'))console.log(JSON.stringify(await fetchNoticeSources(),null,2));
  else {const inventory=collectNotices();const i=process.argv.indexOf('--output');if(i>=0){writeNotices(path.resolve(process.argv[i+1]));}console.log(JSON.stringify({records:inventory.records.length,omitted:inventory.omitted.length},null,2));}
 }catch(error){console.error(error.message);process.exitCode=1;}
}
