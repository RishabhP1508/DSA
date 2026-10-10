import fs from 'node:fs';
import {get,save} from '../../scripts/lib/content-edit.mjs';
const path='docs/reviews/codex-b3-shared-patches.json';
const patches=JSON.parse(fs.readFileSync(path,'utf8'));
const edits=[];
function edit(uid,field,fn) {
  const p=patches.find(p=>p.uid===uid&&p.field===field);
  fn(p.value);
  const [kind,id,exid]=uid.split(':');
  const x=get(kind,id);x.exercises.find(ex=>ex.id===exid)[field]=p.value;
  edits.push({uid,field,value:p.value});
  // Save each item once later, retaining all final edits for that item.
}
edit('lesson:linear-search:ls-choose-1','hints',h=>h[4]='One expected O(n) build plus expected O(1) per query gives expected O(n+q), compared with O(n*q) worst-case repeated scans. For tiny data or few queries, constants and early matches may still favor scanning.');
edit('lesson:linear-search:ls-choose-1','recognition',g=>g.approaches.find(a=>a.id==='repeated-linear').rejectionFeedback='Repeated scans have O(n*q) worst-case work, while a set gives expected O(n+q) under the stated hashing model. This drill asks for the preprocessing strategy that improves the general many-query bound.');
edit('lesson:binary-search:bs-choose-1','recognition',g=>{
  g.approaches.find(a=>a.id==='linear-each').rejectionFeedback='Repeated scans have O(n*q) worst-case work; a set gives expected O(n+q) under the stated hashing model.';
  g.alternatives[0].tradeoff='O(n log n) worst-case sorting plus O(q log n) queries, a higher general bound than expected hash membership, with support for ordered queries.';
});
edit('lesson:bubble-sort:bub-choose-1','recognition',g=>g.approaches.find(a=>a.id==='use-bubble'||a.label==='Use bubble sort').rejectionFeedback='The shown basic bubble sort makes 499,999,500,000 adjacent comparisons at n=1,000,000. A worst-case O(n log n) comparison sort has a much smaller growth scale; this count does not predict elapsed seconds.');
edit('lesson:counting-sort:cnt-choose-1','hints',h=>h[1]='A general comparison sort has O(n log n) worst-case work. The fixed small integer range supports O(n+101) counting; adaptive sorting may also exploit ordered runs.');
edit('lesson:bucket-sort:buck-choose-1','hints',h=>h[1]='A general comparison sort has O(n log n) worst-case work; this explicit independent uniform input model and k proportional to n support a lower expected bucket-sort bound.');
edit('lesson:comparators:cmp-choose-1','hints',h=>h[1]='A cmp_to_key wrapper may invoke Python comparison code O(n log n) times in the worst case, while a key function is computed once per item. Actual speed depends on callback work and input.');
for(const uid of new Set(edits.map(p=>p.uid))){const [kind,id,exid]=uid.split(':');const x=get(kind,id),ex=x.exercises.find(ex=>ex.id===exid);for(const p of edits.filter(p=>p.uid===uid))ex[p.field]=p.value;save(kind,id,x,['exercises']);}
fs.writeFileSync(path,JSON.stringify(patches,null,2));
fs.writeFileSync('docs/reviews/codex-b3-final-shared-patches.json',JSON.stringify(edits,null,2));
console.log(`${edits.length} final wording fields require central overrides.`);
