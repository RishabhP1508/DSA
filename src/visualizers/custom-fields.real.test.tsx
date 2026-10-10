// @vitest-environment node
import {beforeAll,it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {TreeVisualizer} from './TreeVisualizer';
import {LinkedListVisualizer} from './LinkedListVisualizer';
import {TrieVisualizer} from './TrieVisualizer';
import type {TraceEvent} from '../core/types';
// @ts-expect-error Real bundled runtime harness is JavaScript.
import {runProgram} from '../../scripts/lib/pyodide-harness.mjs';
let state:TraceEvent;
beforeAll(async()=>{
 const result=await runProgram(`class Node:
    def __init__(self, item):
        self.payload = item
        self.successor = None
        self.predecessor = None
        self.a = None
        self.b = None
        self.edges = {}
        self.wordEnd = False
    @property
    def value(self):
        raise RuntimeError('a visualizer must never invoke this property')
head = Node(71)
second = Node(83)
head.successor = second
second.predecessor = head
root = Node(97)
root.a = head
trie = Node(0)
trie.edges['q'] = second
second.wordEnd = True
print('done')`);
 expect(result.status).toBe('completed');expect(result.stdout).toBe('done\n');state=result.events.at(-1)!;
},30000);
it('renders a custom linked chain with actual recorded values and backward reference',()=>{const html=renderToStaticMarkup(<LinkedListVisualizer event={state} binding={{variable:'head',model:'linked-list',fields:{value:'payload',next:'successor',previous:'predecessor'}}}/>);expect(html).toContain('71');expect(html).toContain('83');expect(html).toContain('ll-edge-back');expect(html).toContain('None');});
it('renders custom tree children without reading a property',()=>{const html=renderToStaticMarkup(<TreeVisualizer event={state} binding={{variable:'root',model:'tree',fields:{value:'payload',left:'a',right:'b'}}}/>);expect(html).toContain('97');expect(html).toContain('71');expect(html).toContain('tree-edge');});
it('renders a custom trie map and explicit word flag',()=>{const html=renderToStaticMarkup(<TrieVisualizer event={state} binding={{variable:'trie',model:'trie',fields:{children:'edges',terminal:'wordEnd'}}}/>);expect(html).toContain('q');expect(html).toContain('cell-active');expect(html).toContain('2 nodes');});
