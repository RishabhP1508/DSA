import {loadCurriculum} from '../../scripts/lib/load-curriculum.mjs';
const c=await loadCurriculum();
const items=[...c.lessons.filter(x=>['Trees and tries','Graphs','Range queries'].includes(x.area)).map(x=>['lesson',x]),...c.patterns.filter(x=>x.category==='Graphs & trees').map(x=>['pattern',x])];
const start=Number(process.argv[2]??0), count=Number(process.argv[3]??3);
for(const [kind,item] of items.slice(start,start+count)){
 console.log(kind,item.id);
 const code=item.code??item.walkthroughCode;
 console.log(code.split('\n').map((s,i)=>`${i+1} ${s} // ${item.codeExplanations.find(e=>e.line===i+1)?.explanation}`).join('\n'));
 const rest={...item}; delete rest.code; delete rest.walkthroughCode; delete rest.codeExplanations; delete rest.evidence;
 console.log(JSON.stringify(rest));
}
