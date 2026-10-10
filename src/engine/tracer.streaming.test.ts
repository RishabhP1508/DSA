// @vitest-environment node
import { expect, it } from 'vitest';
import { Replay } from './replay';
// @ts-expect-error Bundled runtime verification harness.
import { getPyodide } from '../../scripts/lib/pyodide-harness.mjs';
it('emits immutable states and output while Python is executing, without adding artificial steps',async()=>{
  const py=await getPyodide();
  const observed: unknown[]=[];const output:string[]=[];let finished=false;
  py.globals.set('__event_sink',(json:string)=>{expect(finished).toBe(false);observed.push(JSON.parse(json));});
  py.globals.set('__output_sink',(stream:string,text:string)=>{expect(finished).toBe(false);if(stream==='stdout')output.push(text);});
  py.globals.set('__stream_source','nums = [1]\nprint("first")\nnums.append(2)\nprint("last")');
  const result=JSON.parse(py.runPython('import json, sys\njson.dumps(sys.modules["dsa_tracer"].run_program(__stream_source,"<stream>",1000,1048576,"",event_sink=__event_sink,output_sink=__output_sink))'));
  finished=true;
  expect(observed).toEqual(result.events);
  expect(output.join('')).toBe('first\nlast\n');
  expect(result.events.map((e:{kind:string})=>e.kind)).toEqual(['call','line','line','line','line','return']);
  const replay=new Replay({...result,runId:1});
  replay.seek(2);expect(replay.outputSoFar()).toBe('');
  replay.seek(3);expect(replay.outputSoFar()).toBe('first\n');
  replay.seek(5);expect(replay.outputSoFar()).toBe('first\nlast\n');
  replay.seek(3);expect(replay.outputSoFar()).toBe('first\n');
},120_000);
it('observer failure cannot change learner execution',async()=>{
  const py=await getPyodide();
  const result=JSON.parse(py.runPython('import json, sys\ndef broken_sink(*args):\n    raise RuntimeError("observer failed")\n\njson.dumps(sys.modules["dsa_tracer"].run_program("print(7)","<stream>",1000,1048576,"",event_sink=broken_sink,output_sink=broken_sink))'));
  expect(result.status).toBe('completed');expect(result.stdout).toBe('7\n');
},120_000);
