// @vitest-environment node
import { expect, it } from 'vitest';
import { validateInbound, validateOutbound } from './protocol';
const meta={v:1,runId:1,owner:'test',sourceRev:1,inputRev:0,seq:0};
const event={index:0,kind:'line',line:1,frames:[{name:'<module>',line:1,locals:[]}],objects:{}};
it.each([NaN,Infinity,-1,0,1.5])('rejects invalid execution limits: %s',timeMs=>expect(validateInbound({...meta,kind:'run',payload:{source:'pass',stdin:'',limits:{timeMs,maxEvents:10000,maxTraceBytes:16777216}}}).ok).toBe(false));
it.each([{index:0},{...event,frames:null},{...event,objects:[]},{...event,frames:[{name:'x',line:1,locals:[{name:'x',value:{kind:'ref'}}]}]}])('rejects malformed trace states',bad=>expect(validateOutbound({...meta,kind:'trace-batch',payload:{events:[bad]}}).ok).toBe(false));
it('rejects unknown terminal statuses',()=>expect(validateOutbound({...meta,kind:'result',payload:{status:'invented',tail:[],stdout:'',stderr:'',incomplete:false}}).ok).toBe(false));
it('rejects malformed complexity fields before they reach React',()=>expect(validateOutbound({...meta,kind:'result',payload:{status:'completed',tail:[],stdout:'',stderr:'',incomplete:false,analysis:{source:'auto-supported',sizeVars:'bad'}}}).ok).toBe(false));
it('accepts genuine typed dictionaries, cycles, and large integers',()=>{
  const good={...event,frames:[{name:'f',line:1,locals:[{name:'x',value:{kind:'ref',id:'a'}}]}],objects:{a:{id:'a',type:'dict',truncated:false,entries:[{key:"('1', 2)",keyKind:'tuple',value:{kind:'ref',id:'a'}},{key:'big',keyKind:'str',value:{kind:'int',value:'1208925819614629174706176'}}]}}};
  expect(validateOutbound({...meta,kind:'trace-batch',payload:{events:[good]}}).ok).toBe(true);
});
