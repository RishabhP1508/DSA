import fs from 'node:fs';
import { loadCurriculum } from '../../scripts/lib/load-curriculum.mjs';
import { runProgram } from '../../scripts/lib/pyodide-harness.mjs';
const c=await loadCurriculum();
const cases=[
 ['word-search','empty and reserved-character paths',`assert exist([], '') is True\nassert exist([], 'A') is False\nassert exist([[]], 'A') is False\nb=[['#','A']]\nassert exist(b,'#A#') is False\nassert b==[['#','A']]\nassert exist(b,'#A') is True\nassert b==[['#','A']]`],
 ['fenwick-tree','index-zero update and empty range',`b=Fenwick(0)\nassert b.prefix(0)==0\nassert b.range_sum(1,0)==0\ntry:\n b.update(0,3)\nexcept IndexError:\n pass\nelse:\n raise AssertionError('index zero must be rejected')`],
 ['segment-tree','negative update and half-open bounds',`s=SegTree([])\nassert s.query(0,0)==0\ns=SegTree([1,2,3])\ntry:\n s.update(-1,9)\nexcept IndexError:\n pass\nelse:\n raise AssertionError('negative index must be rejected')\nassert s.query(0,3)==6`],
 ['prim','empty graph and disconnected rejection',`assert prim({},0)==0\ntry:\n prim({0:[],1:[]},2)\nexcept ValueError:\n pass\nelse:\n raise AssertionError('disconnected graph has no spanning tree')`],
 ['topological-sort','mixed acyclic component plus cycle',`try:\n topo_sort(4,[(0,1),(2,3),(3,2)])\nexcept ValueError:\n pass\nelse:\n raise AssertionError('partial order must not be returned as a topological order')`],
 ['dijkstra','negative edge rejection',`try:\n dijkstra({0:[(1,-1)],1:[]},0,2)\nexcept ValueError:\n pass\nelse:\n raise AssertionError('nonnegative precondition must be checked')`],
 ['bellman-ford','reachable versus disconnected negative cycle',`assert bellman_ford([(0,1,1),(1,1,-1)],2,0) is None\nassert bellman_ford([(2,2,-1)],3,0)==[0,float('inf'),float('inf')]`],
];
const results=[];
for(const [id,name,probe] of cases){
 const item=c.lessons.find(x=>x.id===id);
 const r=await runProgram(item.code+'\n'+probe,'',{maxEvents:1500});
 const ok=r.status==='completed';
 results.push({id,name,ok,status:r.status,error:r.error??null,limit:r.limitHit??null});
 console.log(`${ok?'PASS':'FAIL'} ${id}: ${name} ${r.error?.message??''}`);
}
fs.writeFileSync(new URL('./codex-b5-boundary-results.json',import.meta.url),JSON.stringify(results,null,2));
if(results.some(x=>!x.ok))process.exitCode=1;
