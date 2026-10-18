import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { ObjectInspector } from './ObjectInspector';
import { VariablesPanel } from './VariablesPanel';
import type { TraceEvent, TraceObject } from '../core/types';

afterEach(cleanup);
describe('bounded recorded identifiers and type metadata', () => {
  it('does not multiply all long aliases into every variable row', () => {
    const names=Array.from({length:50},(_,i)=>`alias_${i}_`+'x'.repeat(230));
    const event: TraceEvent={index:0,kind:'line',line:1,frames:[{name:'<module>',line:1,locals:names.map(name=>({name,value:{kind:'ref',id:'shared'}}))}],objects:{shared:{id:'shared',type:'list',entries:[]}}};
    const {container}=render(<VariablesPanel event={event} output=""/>);
    // The snapshot contains approximately12KB of identifiers. Each row may
    // preview a few aliases; it must not repeat the entire list fifty times.
    expect(container.textContent!.length).toBeLessThan(100_000);
    expect(container.querySelectorAll('.oi-node[data-object-id="shared"]')).toHaveLength(50);
    expect(container.textContent).toMatch(/shared with|shared reference/i);
  });
  it('bounds a long class name inside an object toggle and its type cell', () => {
    const type='RecordedClass_'+'T'.repeat(5000);
    const objects: Record<string,TraceObject>={instance:{id:'instance',type,entries:[]}};
    const {container}=render(<ObjectInspector value={{kind:'ref',id:'instance'}} objects={objects} label="instance"/>);
    expect(container.querySelector('.oi-type')!.textContent!.length).toBeLessThan(250);
    expect(container.querySelector('.oi-toggle')!.textContent!.length).toBeLessThan(600);
    expect(container.innerHTML).not.toContain(type);
  });
});
