import {useEffect,useState} from 'react';
import {ArrowLeft,ArrowRight,Check,BookOpen,Code2,FlaskConical,CheckCircle2,ExternalLink} from 'lucide-react';
import type {LessonDefinition} from '../core/types';
import {lessons,patterns} from '../content/registry';
import {NOTION_PRACTICE,ADDITIONAL_PRACTICE} from '../content/notion-practice';
import {Button} from '../components/ui/button';
import {Badge} from '../components/ui/badge';
import {Tabs,TabsList,TabsTrigger,TabsContent} from '../components/ui/tabs';
import {LessonWorkspace} from './LessonWorkspace';
import {ExercisePanel} from './ExercisePanel';
import {mdInline} from './md';
import {labelForLine} from './line-label';
import {StudyOutline} from './StudyOutline';
export function Prose({text}:{text:string}){return <>{text.split('\n\n').map((paragraph,index)=><p key={index} dangerouslySetInnerHTML={{__html:mdInline(paragraph)}}/>)}</>;}
export function LessonReader({lesson,completed,onComplete,onLesson,onPattern,onBack}:{lesson:LessonDefinition;completed:boolean;onComplete:()=>void;onLesson:(id:string)=>void;onPattern:(id:string)=>void;onBack:()=>void}){
 const [tab,setTab]=useState('understand');
 const [vocabularyOpen,setVocabularyOpen]=useState(()=>window.matchMedia('(min-width:1100px)').matches);
 useEffect(()=>{const query=window.matchMedia('(min-width:1100px)');const update=()=>setVocabularyOpen(query.matches);query.addEventListener('change',update);return()=>query.removeEventListener('change',update);},[]);
 const related=patterns.filter(p=>p.linkedLessons.includes(lesson.id));
 const external=[...NOTION_PRACTICE,...ADDITIONAL_PRACTICE].filter(p=>p.mappedIds.includes(lesson.id));
 const unique=[...new Map(external.map(p=>[p.url,p])).values()];
 const conceptLabels:Record<string,string>={purpose:'Why it matters',operations:'What you can do',uses:'When to use it',tradeoffs:'The tradeoffs',commonMistakes:'Watch out for',edgeCases:'Edge cases'};
 const outline=[{id:`lesson-${lesson.id}-idea`,label:'The idea'},...Object.keys(lesson.concepts).map(key=>({id:`lesson-${lesson.id}-${key}`,label:conceptLabels[key]??key}))];
 return <main className="lesson-reader" id="main-content">
  <div className="reader-breadcrumb"><Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft/>All lessons</Button><span>{lesson.area}</span></div>
  <header className="reader-heading"><div><Badge variant="secondary">{lesson.area}</Badge><h1>{lesson.title}</h1><p className="dim">Understand the idea. See each step. Make it your own.</p></div><Button variant={completed?'secondary':'outline'} onClick={onComplete} disabled={completed}>{completed?<><Check/>✓ Completed</>:<><CheckCircle2/>Mark lesson complete</>}</Button></header>
  {(lesson.prerequisites??[]).length>0 && <div className="prerequisite-strip"><BookOpen size={15}/><span>Useful first</span>{lesson.prerequisites!.map(id=><button key={id} className="link-like" onClick={()=>onLesson(id)}>{lessons.find(l=>l.id===id)?.title??id}</button>)}</div>}
  <Tabs value={tab} onValueChange={setTab} className="reader-tabs">
   <TabsList variant="line"><TabsTrigger value="understand"><BookOpen/>Understand</TabsTrigger><TabsTrigger value="watch"><Code2/>Watch the code</TabsTrigger><TabsTrigger value="practice"><FlaskConical/>Try & practice</TabsTrigger><TabsTrigger value="review"><CheckCircle2/>Review</TabsTrigger></TabsList>
   <TabsContent value="understand"><div className="understand-layout"><article className="reading-column reading-prose"><section className="study-section" id={outline[0].id}><span className="section-number" aria-hidden="true">01</span><h2>The idea</h2><Prose text={lesson.explanation}/></section><div className="concept-grid">{Object.entries(lesson.concepts).map(([key,text],index)=><section className={'study-section'+(key==='commonMistakes'?' mistake-callout':'')} key={key} id={`lesson-${lesson.id}-${key}`}><span className="section-number" aria-hidden="true">{String(index+2).padStart(2,'0')}</span><h2>{conceptLabels[key]??key}</h2><Prose text={text}/></section>)}</div><Button onClick={()=>setTab('watch')}>Watch the code<ArrowRight/></Button></article><StudyOutline entries={outline}><details className="vocabulary-card" open={vocabularyOpen} onToggle={event=>setVocabularyOpen(event.currentTarget.open)}><summary>Words to know</summary><dl className="glossary">{lesson.vocabulary.map(v=><div key={v.term}><dt>{v.term}</dt><dd dangerouslySetInnerHTML={{__html:mdInline(v.definition)}}/></div>)}</dl><p className="tiny dim">You can revisit these in the Glossary at any time.</p></details></StudyOutline></div></TabsContent>
   <TabsContent value="watch" forceMount className={tab!=='watch'?'hidden':''}><div className="workspace-intro"><div><h2>See what the program actually does</h2><p className="dim">Run once, then move through the saved states. The highlighted line is the next statement to run.</p></div><Badge variant="outline">Python 3.14</Badge></div><LessonWorkspace lesson={lesson}/><details className="all-lines"><summary>Read the explanation for every code line</summary><ol>{lesson.codeExplanations.map(line=><li key={line.line}><code>Line {line.line}</code><span>{line.explanation}</span>{labelForLine(lesson.code,line.line) && <small>{labelForLine(lesson.code,line.line)}</small>}</li>)}</ol></details></TabsContent>
   <TabsContent value="practice"><section className="practice-intro"><div className="eyebrow">MAKE ONE CHANGE</div><h2>Experiment before solving</h2><ol className="experiment-list">{lesson.experiments.map((item,i)=><li key={i}><span>{i+1}</span><Prose text={item}/></li>)}</ol><Button variant="outline" onClick={()=>setTab('watch')}>Open the editable example<Code2/></Button></section><section className="exercise-list"><h2>Practice this idea</h2>{lesson.exercises.map((ex,index)=><ExercisePanel key={ex.id} exerciseNumber={index+1} exercise={ex} ownerKind="lesson" ownerId={lesson.id}/>)}</section></TabsContent>
   <TabsContent value="review"><article className="review-column"><div className="eyebrow">TAKE IT WITH YOU</div><h2>What to remember</h2><Prose text={lesson.review}/><h3>Time & space</h3><div className="table-scroll"><table className="complexity"><thead><tr><th>Operation</th><th>Best</th><th>Average</th><th>Worst</th><th>Note</th></tr></thead><tbody>{lesson.complexity.map((row,i)=><tr key={i}><td>{row.operation}</td><td>{row.best??'—'}</td><td>{row.average??'—'}</td><td>{row.worst??'—'}</td><td>{row.note??'—'}</td></tr>)}</tbody></table></div>
    {related.length>0 && <section><h3>Connect this to a pattern</h3>{related.map(p=><button key={p.id} className="related-link" onClick={()=>onPattern(p.id)}>{p.title}<ArrowRight size={16}/></button>)}</section>}
    {unique.length>0 && <section><h3>Optional external practice</h3><p className="dim">These links need an internet connection. Your lessons and local exercises work offline.</p><ul>{unique.map(p=><li key={p.url}><a href={p.url} target="_blank" rel="noreferrer">{p.title}<ExternalLink size={13}/></a>{p.source==='additional' && <small className="dim"> · Additional practice</small>}</li>)}</ul></section>}
    <details className="sources"><summary>Sources consulted</summary><ul>{lesson.references.map((r,i)=><li key={i}><a href={r.url} target="_blank" rel="noreferrer">{r.title}<ExternalLink size={13}/></a><p className="dim tiny">{r.section} · Accessed {r.accessDate}</p><p className="tiny">{r.purpose}</p></li>)}</ul></details>
    <Button onClick={onComplete} disabled={completed}>{completed?'✓ Completed':'Mark lesson complete'}<CheckCircle2/></Button>
   </article></TabsContent>
  </Tabs>
 </main>;
}
