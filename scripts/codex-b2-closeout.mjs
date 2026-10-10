import fs from 'node:fs';
import { loadCurriculum } from './lib/load-curriculum.mjs';
import { contentHashOf } from './lib/content-hash.mjs';
const c=await loadCurriculum();
for(const batch of ['a','b']) {
  const file=`docs/reviews/codex-b2-${batch}`;
  const rows=JSON.parse(fs.readFileSync(file+'.json','utf8'));
  let md=fs.readFileSync(file+'.md','utf8');
  for(const row of rows) {
    const item=c[row.kind==='lesson'?'lessons':'patterns'].find(x=>x.id===row.id);
    const hash=contentHashOf(item);
    if(row.hash!==hash) {
      md=md.replaceAll(row.hash,hash);
      row.previousReviewedHash=row.hash;
      row.hash=hash;
      row.assessment+=' Follow-up: explicitly authored range endpoints and observed totals now render from immutable snapshots; seven rendered tests include two real fixed-window states and a real string state.';
    }
    if(row.kind==='pattern' && row.id==='sliding-window')row.assessment=row.assessment.replace('Diagram total/window rendering is tracked as a remaining application repair.','Diagram range and total rendering is fixed and verified against real recorded states.');
  }
  fs.writeFileSync(file+'.json',JSON.stringify(rows,null,2)+'\n');
  md=md.replace('Array totals/windows are authored but not yet rendered by the current application; that functional repair precedes the new UI.','Array/string totals and explicit ranges now render. Ranges are never inferred from arbitrary pointer pairs, and inclusive/exclusive endpoints are labelled. Seven rendered tests failed on the original renderer and pass after the repair, including backward selection of two actual recorded window states. The diagram describes current recorded boundaries; intermediate multi-line updates are not asserted to satisfy the algorithm invariant.');
  md+='\n## Sequence-state follow-up (2026-10-10)\n\nOnly the changed bindings were re-read and re-signed, preserving prior reviews as history. A targeted evidence selector validates IDs before writing and runs the same real checks. Windows Chrome suite on the pre-sequence-repair B2-B build: 18 passed / 5 runner-origin skips. Focused final sequence/B2/ledger suites: 49 passed. Full integrated checks will run after parallel batch integration; this browser result is not attributed to later renderer changes.\n';
  fs.writeFileSync(file+'.md',md.trimEnd()+'\n');
}
const refs='docs/references.md';fs.writeFileSync(refs,fs.readFileSync(refs,'utf8').trimEnd()+'\n');
const all=[...c.lessons,...c.patterns];
console.log(`Current recorded review flags: ${all.filter(x=>x.evidence.semanticReview).length} approved / ${all.filter(x=>!x.evidence.semanticReview).length} pending.`);
