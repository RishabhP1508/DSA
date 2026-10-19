import { pythonLanguage } from '@codemirror/lang-python';
import type { TraceEvent } from '../core/types';
export function syntaxExplanation(source:string,line:number):string {
 const lines=source.split('\n');const text=lines[line-1]??'';
 if(!text.trim())return 'A blank line separates the code for readability. Python does not execute a separate step for it.';
 if(text.trimStart().startsWith('#'))return 'This comment is a note for the reader. It does not execute or change program state.';
 const offset=lines.slice(0,line-1).reduce((n,s)=>n+s.length+1,0)+text.length-text.trimStart().length;
 let node=pythonLanguage.parser.parse(source).resolveInner(offset,1);
 while(node.parent&&!/Statement$|Definition$/.test(node.name))node=node.parent;
 const descriptions:Record<string,string>={
  AssignStatement:'Evaluates the right side, then binds a name or updates the target shown on the left. Assigning a container reference does not copy that container.',
  UpdateStatement:'Reads the target and applies the update operator. An in-place operation may mutate a shared object; recorded states show what actually changed.',
  ForStatement:'Gets the next item from an iterable and binds the loop target. The body runs for each item until iteration finishes or the program exits the loop.',
  WhileStatement:'Tests a condition before repeating its body. The next recorded line shows whether execution entered the body or moved on.',
  IfStatement:'Tests a condition to choose a branch. Only the selected branch executes.',
  FunctionDefinition:'Creates a function and binds its name. Defining it does not yet run its body.',
  ClassDefinition:'Executes a class body to build a class. Later calls can create instances of that class.',
  ReturnStatement:'Evaluates the return expression and leaves this function. The return event records the returned value.',
  ExpressionStatement:'Evaluates this expression. A function or method call can return a value, print output, or change an object; inspect the next recorded state to see its effects.',
  ImportStatement:'Loads or reuses a module and binds the imported names.',
  TryStatement:'Starts a block whose exceptions may be handled by the matching clauses.',
  RaiseStatement:'Raises an exception and transfers control to a matching handler, or ends the run if none handles it.',
  BreakStatement:'Leaves the nearest enclosing loop.',
  ContinueStatement:'Skips the rest of this loop iteration and goes to its next iteration.',
  PassStatement:'An explicit placeholder that performs no work.',
  DelStatement:'Deletes a name binding or the indicated item or attribute.',
  WithStatement:'Enters a context manager and arranges its exit handling.',
  AssertStatement:'Checks a condition and raises AssertionError when it is false.',
  GlobalStatement:'Makes assignments to the named identifiers use the module scope.',
  NonlocalStatement:'Makes assignments to the named identifiers use an enclosing function scope.'
 };
 return descriptions[node.name]??'This is part of a Python statement. Follow the next recorded event for its observable effect; no algorithm intent is inferred.';
}
/** Includes nested mutations and handles cycles, entirely within saved snapshots. */
function changedObjects(current:TraceEvent,previous:TraceEvent):Set<string> {
 const changed=new Set<string>(),parents=new Map<string,Set<string>>();
 const ids=new Set([...Object.keys(current.objects),...Object.keys(previous.objects)]);
 for(const id of ids){
  if(JSON.stringify(current.objects[id])!==JSON.stringify(previous.objects[id]))changed.add(id);
  for(const object of [current.objects[id],previous.objects[id]])for(const entry of object?.entries??[])if(entry.value.kind==='ref'){
   const owners=parents.get(entry.value.id)??new Set<string>();owners.add(id);parents.set(entry.value.id,owners);
  }
 }
 const pending=[...changed];
 for(let index=0;index<pending.length;index++)for(const parent of parents.get(pending[index])??[])if(!changed.has(parent)){changed.add(parent);pending.push(parent);}
 return changed;
}
const observedName=(name:string)=>name.length>96?name.slice(0,96)+'…':name;
export function recordedChanges(current:TraceEvent,previous?:TraceEvent):string[]{
 if(!previous)return ['This is the first recorded state.'];
 const now=current.frames.at(-1),before=previous.frames.at(-1);
 if(!now||!before)return ['The recorded call stack changed.'];
 if(now.name!==before.name||current.frames.length!==previous.frames.length)return [current.kind==='return'?`The frame ${observedName(now.name)} is returning.`:`The active frame is now ${observedName(now.name)}.`];
 const old=new Map(before.locals.map(l=>[l.name,l.value]));const changes:string[]=[];
 const changed=changedObjects(current,previous);
 for(const local of now.locals){const last=old.get(local.name);if(!last)changes.push(`${observedName(local.name)} now has a binding.`);else if(JSON.stringify(last)!==JSON.stringify(local.value))changes.push(`${observedName(local.name)} has a different recorded value or reference.`);else if(local.value.kind==='ref'&&last.kind==='ref'&&changed.has(local.value.id))changes.push(`The object referenced by ${observedName(local.name)} changed.`);old.delete(local.name);}
 for(const name of old.keys())changes.push(`${observedName(name)} no longer has a binding in this frame.`);
 return changes.length?changes:['No local value or referenced object changed between these two recorded states.'];
}
