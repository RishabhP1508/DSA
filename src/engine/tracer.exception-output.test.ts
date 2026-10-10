// @vitest-environment node
import {expect,it} from 'vitest';
// @ts-expect-error JavaScript verification harness.
import {runProgram} from '../../scripts/lib/pyodide-harness.mjs';
it('exception inspection never calls a learner-defined __str__',async()=>{
 const r=await runProgram(`calls = []
class E(Exception):
    def __str__(self):
        calls.append('observer')
        return 'changed'
try:
    raise E('safe message')
except E:
    print(len(calls))`);
 expect(r.stdout).toBe('0\n');expect(r.status).toBe('completed');
},120000);
it('oversized output stops with a valid UTF-8 prefix rather than losing the whole trace',async()=>{
 const r=await runProgram('print("🚀" * 10000)','',{maxTraceBytes:1000});
 expect(r.status).toBe('trace-limit');expect(new TextEncoder().encode(r.stdout).byteLength).toBeLessThanOrEqual(1000);expect(r.stdout).not.toContain('\ufffd');expect(r.incomplete).toBe(true);
},120000);
it('reading dictionary entries does not hash keys again',async()=>{
 const r=await runProgram(`calls = []
class Key:
    def __hash__(self):
        calls.append('hash')
        return 7
key = Key()
data = {key: 1}
print(len(calls))`);
 expect(r.stdout).toBe('1\n');
},120000);
it('numeric subclasses cannot run conversion hooks during inspection',async()=>{
 const r=await runProgram(`calls = []
class Number(int):
    def __lt__(self, other):
        calls.append('lt')
        return False
    def __gt__(self, other):
        calls.append('gt')
        return False
    def __str__(self):
        calls.append('str')
        return 'changed'
    def __int__(self):
        calls.append('int')
        return 9
number = Number(8)
data = {number: 'value'}
print(len(calls))`);
 expect(r.stdout).toBe('0\n');
},120000);

it('large integer inspection does not introduce Python decimal-conversion errors',async()=>{
 const r=await runProgram('value = 1 << 20000\nprint("assigned")');
 expect(r.status).toBe('completed');expect(r.stdout).toBe('assigned\n');
 const value=r.events.at(-1)!.frames.flatMap(f=>f.locals).find(l=>l.name==='value')!.value;
 expect(value.kind).toBe('int');if(value.kind==='int') expect(BigInt(value.value)).toBe(1n<<20000n);
},120000);
