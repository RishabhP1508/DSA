import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import type { TraceEvent, VisualBinding } from '../core/types';
import { ArrayVisualizer } from './ArrayVisualizer';
import { RecursionVisualizer } from './RecursionVisualizer';
import { ObjectVisualizer } from './ObjectVisualizer';
import { LinkedListVisualizer } from './LinkedListVisualizer';
import { GraphVisualizer } from './GraphVisualizer';
import { QueueVisualizer } from './StackQueueVisualizer';
import { MatrixVisualizer } from './MatrixVisualizer';
import { DPTableVisualizer } from './DPTableVisualizer';
import { SequenceState } from './SequenceState';
import { StringVisualizer } from './StringVisualizer';
import { TreeVisualizer } from './TreeVisualizer';
import { TrieVisualizer } from './TrieVisualizer';
import { bindingLabel, SvgLabel } from './limits';

afterEach(cleanup);
const event: TraceEvent = {
  index: 1, kind: 'line', line: 2,
  frames: [{ name: '<module>', line: 2, locals: [
    { name: 'a_very_long_variable_name_that_must_not_be_cut_off', value: {kind:'ref',id:'list'} },
    { name: 'best', value: {kind:'ref',id:'list'} },
    { name: 'i', value: {kind:'int',value:0} },
    { name: 'j', value: {kind:'int',value:0} },
    { name: 'k', value: {kind:'int',value:0} },
    { name: 'head', value: {kind:'ref',id:'node'} },
    { name: 'graph', value: {kind:'ref',id:'graph'} },
  ] }],
  objects: {
    list: {id:'list',type:'list',entries:[{key:'0',value:{kind:'str',value:'a very long cell value that cannot fit inside one cell'}}]},
    node: {id:'node',type:'Node',entries:[{key:'val',value:{kind:'int',value:7}},{key:'next',value:{kind:'none',value:null}}]},
    graph: {id:'graph',type:'dict',entries:[{key:'0',keyKind:'int',value:{kind:'ref',id:'n0'}},{key:'1',keyKind:'int',value:{kind:'ref',id:'n1'}}]},
    n0: {id:'n0',type:'list',entries:[{key:'0',value:{kind:'int',value:1}}]},
    n1: {id:'n1',type:'list',entries:[{key:'0',value:{kind:'int',value:0}}]},
  },
};
const binding: VisualBinding = {model:'array',variable:'a_very_long_variable_name_that_must_not_be_cut_off'};

describe('readable bounded diagrams', () => {
  it('keeps a small diagram at natural size, with long names and alias prose outside SVG', () => {
    const {container} = render(<ArrayVisualizer event={event} binding={binding}/>);
    const svg = container.querySelector('svg')!;
    expect(svg.style.width).toMatch(/px$/);
    expect(parseFloat(svg.style.width)).toBeLessThan(300);
    expect(container.querySelector('.diagram-caption')?.textContent).toContain(binding.variable);
    expect(container.querySelector('svg .alias-note')).toBeNull();
    expect(container.querySelector('.alias-note')?.textContent).toContain('best');
  });
  it('places three pointers on the same cell in three distinct visible lanes', () => {
    const {container} = render(<ArrayVisualizer event={event} binding={{...binding,overlays:['i','j','k'].map(source=>({role:'pointer',label:source,source}))}}/>);
    const labels = [...container.querySelectorAll('text.pointer-label')];
    expect(labels).toHaveLength(3);
    const ys = labels.map(label=>Number(label.getAttribute('y')));
    expect(new Set(ys).size).toBe(3);
    expect(ys.every(y=>y>0)).toBe(true);
  });
  it('shortens cell text to its geometry and retains an accessible full preview', () => {
    const {container} = render(<ArrayVisualizer event={event} binding={binding}/>);
    const value = container.querySelector('text.cell-value')!;
    expect(value.getAttribute('aria-label')).toContain('a very long cell value');
    expect([...value.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').length).toBeLessThanOrEqual(6);
  });
  it('keeps the terminal linked-list label inside the viewBox', () => {
    const {container}=render(<LinkedListVisualizer event={event} binding={{model:'linked-list',variable:'head'}}/>);
    const svg=container.querySelector('svg')!;
    const width=Number(svg.getAttribute('viewBox')!.split(' ')[2]);
    const terminal=[...container.querySelectorAll('text')].find(t=>t.textContent==='None')!;
    expect(Number(terminal.getAttribute('x'))+30).toBeLessThanOrEqual(width);
    expect(svg.style.width).toMatch(/px$/);
  });
  it('separates reciprocal directed graph arcs visibly', () => {
    const {container}=render(<GraphVisualizer event={event} binding={{model:'graph',variable:'graph',directed:true}}/>);
    const arcs=[...container.querySelectorAll('path.graph-edge')];
    expect(arcs).toHaveLength(2);
    expect(arcs[0].getAttribute('d')).not.toBe(arcs[1].getAttribute('d'));
  });
  it('labels both ends of a single-item queue', () => {
    const {container}=render(<QueueVisualizer event={event} binding={{...binding,model:'queue'}}/>);
    expect(container.textContent).toContain('front↓');
    expect(container.textContent).toContain('↑rear');
  });
  it('bounds generic object rows and recursion-frame text for personal programs', () => {
    const huge: TraceEvent={...event,frames:[{name:'long_function_name'.repeat(20),line:2,locals:event.frames[0].locals}],objects:{...event.objects,list:{...event.objects.list,entries:Array.from({length:1000},(_,i)=>({key:'field_'+i+'_'.repeat(100),value:{kind:'str',value:'x'.repeat(10000)}}))}}};
    const generic=render(<ObjectVisualizer event={huge} binding={{...binding,model:'object'}}/>);
    expect(generic.container.querySelectorAll('g').length).toBeLessThanOrEqual(64);
    expect(generic.container.textContent).toMatch(/display limit/i);
    cleanup();
    const stack=render(<RecursionVisualizer event={huge}/>);
    expect(stack.container.querySelector('svg')!.style.width).toMatch(/px$/);
    expect(stack.container.querySelector('.frame-name')!.textContent!.length).toBeLessThan(500);
  });
  it.each([['matrix',MatrixVisualizer],['dp-table',DPTableVisualizer]] as const)('labels recorded row and column indices in %s', (model, Component) => {
    const grid: TraceEvent={...event,frames:[{name:'<module>',line:2,locals:[{name:'grid',value:{kind:'ref',id:'grid'}}]}],objects:{grid:{id:'grid',type:'list',entries:[{key:'0',value:{kind:'ref',id:'row'}}]},row:{id:'row',type:'list',entries:[{key:'0',value:{kind:'int',value:9}}]}}};
    const {container}=render(<Component event={grid} binding={{variable:'grid',model}}/>);
    expect(container.querySelector('.grid-row-index')?.textContent).toBe('[0]');
    expect(container.querySelector('.grid-column-index')?.textContent).toBe('[0]');
    expect(container.querySelectorAll('rect.cell')).toHaveLength(1);
  });
  it('bounds huge observed total badges without changing the recorded value', () => {
    const huge='9'.repeat(10000);
    const totals: TraceEvent={...event,frames:[{name:'<module>',line:2,locals:[{name:'total',value:{kind:'int',value:huge}}]}]};
    const {container}=render(<SequenceState event={totals} binding={{...binding,overlays:[{role:'total',label:'running total',source:'total'}]}} length={1}/>);
    expect(container.querySelector('.total-state')?.textContent?.length).toBeLessThan(150);
    expect(container.textContent).toContain('shortened');
    expect(totals.frames[0].locals[0].value).toEqual({kind:'int',value:huge});
  });
  it('left-aligns generic object column headings despite the shared SVG index style', () => {
    const {container}=render(<ObjectVisualizer event={event} binding={{...binding,model:'object'}}/>);
    const heading=[...container.querySelectorAll('text')].find(text=>text.textContent==='Field / key')!;
    // A presentation attribute loses to .cell-index {text-anchor:middle}.
    // The inline style must win so the header starts inside its gutter.
    expect(heading.style.textAnchor).toBe('start');
    expect(Number(heading.getAttribute('x'))).toBeGreaterThan(0);
  });
  it('shows newline and tab characters visibly without changing string indices', () => {
    const characters: TraceEvent={...event,frames:[{name:'<module>',line:2,locals:[{name:'text',value:{kind:'str',value:'a\n\t '}}]}]};
    const {container}=render(<StringVisualizer event={characters} binding={{variable:'text',model:'string'}}/>);
    expect([...container.querySelectorAll('.cell-value')].map(text=>text.textContent)).toEqual(['a','↵','⇥','␠']);
    expect([...container.querySelectorAll('.cell-index')].map(text=>text.textContent)).toEqual(['0','1','2','3']);
    expect(container.querySelector('[aria-label="newline"]')).toBeTruthy();
  });
  it.each([['tree',TreeVisualizer],['trie',TrieVisualizer],['linked-list',LinkedListVisualizer]] as const)('distinguishes recorded None from an out-of-scope %s root', (model, Component) => {
    const empty: TraceEvent={...event,frames:[{name:'<module>',line:2,locals:[{name:'root',value:{kind:'none'}}]}]};
    const {container}=render(<Component event={empty} binding={{variable:'root',model}}/>);
    expect(container.textContent).toContain('is None');
    expect(container.textContent).not.toContain('in scope yet');
  });
  it('bounds SvgLabel text, aria metadata and tooltip before creating DOM', () => {
    const huge='long_label_'.repeat(5000);
    const {container}=render(<svg><SvgLabel text={huge} maxChars={6}/></svg>);
    expect(container.innerHTML.includes(huge)).toBe(false);
    expect(container.innerHTML.length).toBeLessThan(1000);
    expect(container.querySelector('title')!.textContent!.length).toBeLessThan(100);
    expect(container.textContent).toContain('…');
  });
  it('bounds both missing and present binding labels including dotted paths', () => {
    const long={variable:'v'.repeat(10000),path:'p'.repeat(10000),model:'array' as const};
    expect(bindingLabel(long).length).toBeLessThan(100);
    const {container}=render(<ArrayVisualizer event={event} binding={long}/>);
    expect(container.textContent!.length).toBeLessThan(200);
  });
  it('reserves additional label space for wide characters inside fixed cells', () => {
    const {container}=render(<svg><SvgLabel text={'漢'.repeat(30)} maxChars={6}/></svg>);
    const text=container.querySelector('text')!;
    const visible=[...text.childNodes].filter(node=>node.nodeType===3).map(node=>node.textContent).join('');
    expect(visible).toBe('漢漢…');
  });
});
