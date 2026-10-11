import { useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, GitBranch } from 'lucide-react';
import { lessons } from '../content/registry';
import type { PatternDefinition } from '../core/types';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PatternWorkspace } from './PatternWorkspace';
import { ExercisePanel } from './ExercisePanel';
import { StudyOutline } from './StudyOutline';
import { mdInline } from './md';

const prose = (text: string) => <p dangerouslySetInnerHTML={{ __html: mdInline(text) }} />;
const items = (rows: string[]) => <ul>{rows.map((text, i) => <li key={i} dangerouslySetInnerHTML={{ __html: mdInline(text) }} />)}</ul>;
function Section({ id, number, title, callout, children }: { id: string; number: number; title: string; callout?: boolean; children: ReactNode }) {
  return <section id={id} className={'study-section' + (callout ? ' condition-callout' : '')}>
    <span className="section-number" aria-hidden="true">{String(number).padStart(2, '0')}</span>
    <h2>{title}</h2>{children}
  </section>;
}

export function PatternDetail({ pattern, onBack, onOpenLesson }: { pattern: PatternDefinition; onBack: () => void; onOpenLesson?: (id: string) => void }) {
  const [tab, setTab] = useState('recognize');
  const entries = [
    ['clues', 'Recognition clues'], ['baseline', 'The starting point'], ['improvement', 'Why the pattern helps'],
    ['conditions', 'Required conditions'], ['alternatives', 'Compare approaches'], ['counterexamples', 'Misleading clues'],
  ].map(([suffix, label]) => ({ id: `pattern-${pattern.id}-${suffix}`, label }));
  if (pattern.complexityNote) entries.push({ id: `pattern-${pattern.id}-cost`, label: 'Time & space' });
  return <main className="lesson-reader pattern-reader" id="main-content">
    <div className="reader-breadcrumb"><Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft size={16} />All patterns</Button><span>{pattern.category}</span></div>
    <header className="reader-heading"><div><h1>{pattern.title}</h1>{prose(pattern.summary)}</div><Badge variant="secondary"><GitBranch size={14} />Pattern guide</Badge></header>
    <Tabs value={tab} onValueChange={setTab} className="reader-tabs">
      <TabsList variant="line"><TabsTrigger value="recognize">Recognize</TabsTrigger><TabsTrigger value="watch">Watch the code</TabsTrigger><TabsTrigger value="practice">Try & practice</TabsTrigger><TabsTrigger value="references">Related & sources</TabsTrigger></TabsList>
      <TabsContent value="recognize" className="reader-pane">
        <div className="reading-layout">
          <article className="reading-prose">
            <Section id={entries[0].id} number={1} title="What should catch your eye?">{items(pattern.clues)}</Section>
            <Section id={entries[1].id} number={2} title="The straightforward starting point">{prose(pattern.naiveApproach)}</Section>
            <Section id={entries[2].id} number={3} title="Where the improvement comes from">{prose(pattern.whyItHelps)}</Section>
            <Section id={entries[3].id} number={4} title="Check these conditions" callout>{items(pattern.conditions)}</Section>
            <Section id={entries[4].id} number={5} title="Compare your options">{items(pattern.alternatives)}</Section>
            <Section id={entries[5].id} number={6} title="Clues can mislead you">{items(pattern.counterexamples)}</Section>
            {pattern.complexityNote && <Section id={entries[6].id} number={7} title="Time & space">{prose(pattern.complexityNote)}</Section>}
            <Button onClick={() => setTab('watch')}>Watch a worked example<ArrowRight /></Button>
          </article>
          <StudyOutline entries={entries}>
            <section className="outline-note"><h3>Reason before choosing</h3><p>A familiar shape is a clue. Check the constraints and correctness conditions before choosing.</p><ul className="study-sequence"><li>Understand the input and output</li><li>Find the repeated work</li><li>Check the required conditions</li><li>Test a counterexample</li></ul></section>
          </StudyOutline>
        </div>
      </TabsContent>
      <TabsContent value="watch" forceMount hidden={tab !== 'watch'} className="reader-pane">
        <div className="workspace-intro"><div><h2>Follow the reasoning through real Python</h2><p>Each line event shows the state before that line runs. Step forward to see its effect.</p></div></div>
        <PatternWorkspace key={pattern.id} pattern={pattern} />
        <details className="line-guide"><summary>Read every line explanation</summary><div className="table-scroll"><table><thead><tr><th>Line</th><th>What it does</th></tr></thead><tbody>{pattern.codeExplanations.map(row => <tr key={row.line}><td>{row.line}</td><td dangerouslySetInnerHTML={{ __html: mdInline(row.explanation) }} /></tr>)}</tbody></table></div></details>
      </TabsContent>
      <TabsContent value="practice" className="reader-pane">
        <div className="workspace-intro"><div><h2>Choose an approach, then explain why</h2><p>Use a hint when you need it. Check the conditions, including why a tempting alternative fails.</p></div></div>
        <div className="exercise-list">{pattern.exercises.map((ex, index) => <ExercisePanel key={ex.id} exerciseNumber={index + 1} exercise={ex} patternMode ownerKind="pattern" ownerId={pattern.id} />)}</div>
      </TabsContent>
      <TabsContent value="references" className="reader-pane reading-prose">
        <section className="study-section"><h2>Connect this idea</h2><div className="related-grid">{pattern.linkedLessons.map(id => <button key={id} onClick={() => onOpenLesson?.(id)}><span>{lessons.find(l => l.id === id)?.title ?? id}</span><ArrowRight size={16} /></button>)}</div></section>
        <section className="study-section"><h2>Sources consulted</h2><p className="dim">These links need internet. The guide and its examples are already included locally.</p><div className="source-list">{pattern.references.map(r => <article key={r.url}><a href={r.url} target="_blank" rel="noreferrer">{r.title}<ArrowRight size={14} /></a><p>{r.section}</p><small>Accessed {r.accessDate} · {r.purpose}</small></article>)}</div></section>
      </TabsContent>
    </Tabs>
  </main>;
}
