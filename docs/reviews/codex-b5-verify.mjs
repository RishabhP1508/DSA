import fs from 'node:fs';
import {loadCurriculum} from '../../scripts/lib/load-curriculum.mjs';
import {runProgram} from '../../scripts/lib/pyodide-harness.mjs';
import {validateRecognition,gradeRecognition} from '../../src/core/recognition-grading.ts';
import {EXERCISE_FAULTY} from '../../src/content/exercise-faulty-variants.ts';
const c=await loadCurriculum();
const owned=[...c.lessons.filter(x=>['Trees and tries','Graphs','Range queries'].includes(x.area)).map(x=>['lesson',x]),...c.patterns.filter(x=>x.category==='Graphs & trees').map(x=>['pattern',x])];
const results=[];
for(const[kind,x]of owned){
 const r=await runProgram(x.code??x.walkthroughCode,x.stdin??x.walkthroughStdin??'');
 const expected=x.expectedOutput??x.walkthroughExpectedOutput;
 const sample=r.status==='completed'&&r.stdout===expected;
 const lines=(x.code??x.walkthroughCode).split('\n');
 const explained=lines.every((line,i)=>x.codeExplanations.some(e=>e.line===i+1&&e.explanation?.length&&((!line.trim()||line.trim().startsWith('#'))?e.executable===false:line.trim()==='else:'||e.executable===true)));
 const er=[];
 for(const ex of x.exercises){
  const uid=`${kind}:${x.id}:${ex.id}`;
  if(ex.recognition){
   const errors=validateRecognition(ex.recognition);
   const accepted=ex.recognition.approaches.filter(a=>ex.recognition.acceptableApproachIds.includes(a.id)).every(a=>a.requiredReasonIds.every(reasonId=>gradeRecognition(ex.recognition,a.id,reasonId).outcome==='accepted'));
   er.push({uid,kind:'recognition',ok:errors.length===0&&accepted,errors,accepted});
  }
  if(['complete-code','fix-mistake'].includes(ex.kind)){
   const source=code=>(ex.preludeCode??'')+'\n'+code+'\n'+ex.tests;
   const model=await runProgram(source(ex.expected));
   const wrong={};
   for(const[label,code]of Object.entries({starter:ex.starterCode,empty:'',...EXERCISE_FAULTY[uid]})){
    const r=await runProgram(source(code??''));wrong[label]=r.status!=='completed';
   }
   er.push({uid,kind:'coding',ok:model.status==='completed'&&Object.values(wrong).every(Boolean),modelStatus:model.status,error:model.error??null,wrong});
  }
 }
 const ok=sample&&explained&&er.every(e=>e.ok);
 results.push({kind,id:x.id,ok,sample,explained,status:r.status,error:r.error??null,exercises:er});
 console.log(`${ok?'PASS':'FAIL'} ${kind}:${x.id} sample=${sample} lines=${explained} exercises=${er.filter(e=>e.ok).length}/${er.length}`);
 for(const e of er.filter(e=>!e.ok))console.log(JSON.stringify(e));
}
fs.writeFileSync(new URL('./codex-b5-verification-results.json',import.meta.url),JSON.stringify(results,null,2));
if(results.some(r=>!r.ok))process.exitCode=1;
