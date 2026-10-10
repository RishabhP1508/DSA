import {useEffect,useMemo,useRef,useState} from 'react';
import {ArrowRight,BookOpen,Braces,CheckCircle2,ChevronRight,Code2,Command,Compass,Database,Download,FlaskConical,GitBranch,GraduationCap,LayoutDashboard,Menu,Moon,Search,ShieldCheck,Sun,X} from 'lucide-react';
import './theme.css';
import './App.css';
import {lessons,patterns} from './content/registry';
import {Button} from './components/ui/button';
import {Badge} from './components/ui/badge';
import {Input} from './components/ui/input';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from './components/ui/dialog';
import {TooltipProvider} from './components/ui/tooltip';
import {LessonReader} from './ui/LessonReader';
import {PatternLibrary} from './ui/PatternLibrary';
import {Practice} from './ui/Practice';
import {Playground} from './ui/Playground';
import {BackupView} from './ui/BackupView';
import {GlossaryView} from './ui/GlossaryView';
import {useProgress} from './ui/useProgress';
import {setPreference} from './storage/progress';

type View='home'|'learn'|'lesson'|'patterns'|'practice'|'playground'|'glossary'|'backup';
const navigation=[{key:'home',label:'Home',icon:LayoutDashboard},{key:'learn',label:'Learn',icon:Compass},{key:'patterns',label:'Patterns',icon:GitBranch},{key:'practice',label:'Practice',icon:FlaskConical},{key:'playground',label:'Playground',icon:Code2},{key:'glossary',label:'Glossary',icon:BookOpen},{key:'backup',label:'Backup',icon:Download}] as const;
const areas=[...new Set(lessons.map(l=>l.area))];
const areaIcons=[Braces,GraduationCap,Database,BookOpen,GitBranch,Code2];

export default function App(){
 const [view,setView]=useState<View>('home');
 const [lessonId,setLessonId]=useState(lessons[0].id);
 const [patternId,setPatternId]=useState<string|undefined>();
 const [search,setSearch]=useState('');
 const [searchOpen,setSearchOpen]=useState(false);
 const [menuOpen,setMenuOpen]=useState(false);
 const [narrow,setNarrow]=useState(()=>window.matchMedia('(max-width:850px)').matches);
 const railRef=useRef<HTMLElement>(null);const menuRef=useRef<HTMLButtonElement>(null);const searchRef=useRef<HTMLButtonElement>(null);const searchOpener=useRef<HTMLElement|null>(null);
 useEffect(()=>{const mq=window.matchMedia('(max-width:850px)');const update=()=>setNarrow(mq.matches);mq.addEventListener('change',update);return()=>mq.removeEventListener('change',update);},[]);
 useEffect(()=>{if(narrow&&menuOpen)railRef.current?.querySelector<HTMLButtonElement>('nav button')?.focus();},[narrow,menuOpen]);
 const [topic,setTopic]=useState('all');
 const [dark,setDark]=useState(()=>localStorage.getItem('dsa-theme')==='dark');
 const progress=useProgress();
 const completed=lessons.filter(l=>progress.isCompleted(l.id)).length;
 const percentage=Math.round(completed/lessons.length*100);
 const recId='lessonId' in progress.recommendation?progress.recommendation.lessonId:null;
 const recommended=lessons.find(l=>l.id===recId);
 const current=lessons.find(l=>l.id===lessonId)??lessons[0];
 const openLesson=(id:string)=>{if(!lessons.some(l=>l.id===id))return;setLessonId(id);setView('lesson');setMenuOpen(false);setSearchOpen(false);void progress.markViewed(id);window.scrollTo({top:0});};
 const openPattern=(id:string)=>{setPatternId(id);setView('patterns');setSearchOpen(false);setMenuOpen(false);window.scrollTo({top:0});};
 const changeView=(next:View)=>{if(next==='patterns')setPatternId(undefined);setView(next);setMenuOpen(false);window.scrollTo({top:0});void progress.refresh();};
 useEffect(()=>{document.documentElement.classList.toggle('dark',dark);localStorage.setItem('dsa-theme',dark?'dark':'light');},[dark]);
 useEffect(()=>{const saved=progress.record?.preferences.theme;if(saved==='dark'||saved==='light')setDark(saved==='dark');},[progress.record?.preferences.theme]);
 useEffect(()=>{const key=(event:KeyboardEvent)=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();searchOpener.current=document.activeElement as HTMLElement;setSearchOpen(open=>!open);}if(event.key==='Escape'&&menuOpen){setMenuOpen(false);menuRef.current?.focus();}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[menuOpen]);
 const filtered=useMemo(()=>lessons.filter(l=>(topic==='all'||l.area===topic)&&(l.title+' '+l.area).toLowerCase().includes(search.toLowerCase())),[search,topic]);
 const searchRows=useMemo(()=>[...lessons.map(l=>({id:l.id,title:l.title,area:l.area,kind:'lesson'})),...patterns.map(p=>({id:p.id,title:p.title,area:p.category,kind:'pattern'}))].filter(l=>(l.title+' '+l.area).toLowerCase().includes(search.toLowerCase())).slice(0,30),[search]);
 const solved=Object.values(progress.record?.exercises??{}).filter(ex=>ex.solved).length;
 return <TooltipProvider><div className="lab-shell">
  <a className="skip-link" href="#main-content">Skip to content</a>
  <aside ref={railRef} id="application-navigation" inert={narrow&&!menuOpen} aria-hidden={narrow&&!menuOpen} className={'app-rail '+(menuOpen?'rail-open':'')} aria-label="Application navigation">
   <button className="brand" onClick={()=>changeView('home')} aria-label="DSA Visual Lab home"><span className="brand-mark"><Braces size={24}/></span><span><h1>DSA Visual Lab</h1><small>Make the abstract click.</small></span></button>
   <div className="rail-section-label">YOUR WORKSPACE</div>
   <nav>{navigation.map(({key,label,icon:Icon})=><button key={key} aria-label={label} onClick={()=>changeView(key)} className={'rail-link '+(view===key||(key==='learn'&&view==='lesson')?'is-active':'')} aria-current={view===key?'page':undefined}><Icon size={19}/><span>{label}</span>{key==='learn'&&<span className="rail-count" aria-hidden="true">{lessons.length}</span>}</button>)}</nav>
   <div className="rail-progress"><div><span>Your journey</span><strong>{percentage}%</strong></div><div className="progress-track"><span style={{width:percentage+'%'}}/></div><p>{completed} of {lessons.length} lessons complete</p></div>
   <div className="rail-footer"><ShieldCheck size={16}/><div><strong>Local by design</strong><span>Python & learning data stay here.</span></div></div>
  </aside>
  {menuOpen&&<button className="mobile-scrim" aria-label="Close navigation" onClick={()=>setMenuOpen(false)}/>}
  <div className="main-shell"><header className="utility-bar"><div className="utility-location"><Button variant="ghost" size="icon" ref={menuRef} className="mobile-menu" aria-controls="application-navigation" aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen?<X/>:<Menu/>}</Button><span>Workspace</span><ChevronRight size={14}/><strong>{view==='lesson'?current.title:navigation.find(n=>n.key===view)?.label}</strong></div><div className="utility-actions"><button ref={searchRef} aria-label="Search lessons and patterns" className="global-search" onClick={()=>{searchOpener.current=searchRef.current;setSearch('');setSearchOpen(true);}}><Search size={17}/><span>Find a lesson or pattern</span><kbd>Ctrl K</kbd></button><Button variant="ghost" size="icon" aria-label={dark?'Use light theme':'Use dark theme'} onClick={()=>{const next=!dark;setDark(next);void setPreference('theme',next?'dark':'light');}}>{dark?<Sun/>:<Moon/>}</Button><span className="offline-pill"><span/>Offline ready</span></div></header>
   {view==='home'&&<main id="main-content" className="dashboard"><div className="page-kicker"><span className="small-line"/>A LITTLE CURIOSITY GOES A LONG WAY</div><div className="welcome-heading"><h1>Big ideas.<br/><em>One clear step at a time.</em></h1><p>Learn Python and DSA by seeing what happens.<br/>Start from zero. Build your understanding as you go.</p></div>
    <div className="home-feature"><section className="continue-card"><Badge variant="secondary">YOUR NEXT STEP</Badge><h2>{recommended?.title??'Your path is complete'}</h2><p>{recommended?'Read the idea, watch the code, and try a small change.': 'Revisit a topic or challenge yourself in Practice.'}</p><div className="continue-meta"><BookOpen size={15}/>{recommended?.area??'Keep exploring'}<span>•</span>At your own pace</div><Button size="lg" onClick={()=>recommended?openLesson(recommended.id):changeView('practice')}>Continue learning<ArrowRight/></Button><p className="tiny next-reason">{progress.recommendation.reason}</p></section>
    <section className="see-it-card"><div className="see-it-label"><GitBranch size={16}/><span>From code to “I get it.”</span></div><div className="conceptual-array" aria-label="Conceptual example: checking each array element"><div className="mini-code"><span>for</span> number <span>in</span> numbers:<br/>&nbsp;&nbsp;&nbsp;&nbsp;total += number</div><div className="array-example">{[3,1,4,1,5].map((n,i)=><div key={i} className={i===2?'example-active':''}><strong>{n}</strong><small>{i}</small></div>)}</div><div className="concept-example-note"><span className="example-pointer">↑</span>One value. One step. Nothing hidden.</div></div><p>Code, variables, and diagrams move together.<br/><small>Conceptual preview · run a lesson for real execution.</small></p></section></div>
    <div className="journey-stats"><div><strong>{completed}<span>/{lessons.length}</span></strong><span>lessons completed</span></div><div><strong>{solved}</strong><span>exercises solved</span></div><div><strong>{patterns.length}</strong><span>patterns to discover</span></div><button onClick={()=>changeView('backup')}><Download size={17}/><span>Your progress is saved in this browser.<br/><strong>Make a backup</strong></span><ArrowRight size={17}/></button></div>
    <div className="section-heading"><div><div className="eyebrow">FOLLOW YOUR CURIOSITY</div><h2>A world of ideas, connected.</h2></div><Button variant="ghost" onClick={()=>changeView('learn')}>Explore all lessons<ArrowRight/></Button></div>
    <div className="topic-list">{areas.map((area,i)=>{const items=lessons.filter(l=>l.area===area);const done=items.filter(l=>progress.isCompleted(l.id)).length;const Icon=areaIcons[i%areaIcons.length];return <button key={area} onClick={()=>{setTopic(area);setSearch('');changeView('learn');}}><span className="topic-icon"><Icon size={21}/></span><span className="topic-name"><strong>{area}</strong><small>{items.length} lessons · {done} completed</small></span><span className="topic-mini-progress">{done>0?<CheckCircle2 size={17}/>:<ArrowRight size={17}/>}</span></button>})}</div>
    <section className="playground-invite"><Code2 size={26}/><div><h3>A blank page for your “what if?”</h3><p>Write your own Python. See its actual state, line by line.</p></div><Button variant="outline" onClick={()=>changeView('playground')}>Open Playground<ArrowRight/></Button></section>
   </main>}
   {view==='learn'&&<main id="main-content" className="catalog-page"><div className="eyebrow">YOUR LEARNING PATH</div><h1>Start small. Connect the dots.</h1><p className="page-description">Follow the recommended order, or explore any topic. Opening a lesson never marks it complete.</p><div className="catalog-controls"><div className="search-input"><Search size={17}/><Input aria-label="Search lessons" placeholder="Search lessons…" value={search} onChange={e=>setSearch(e.target.value)}/></div><label className="filter-select">Topic<select aria-label="Filter lessons by topic" value={topic} onChange={e=>setTopic(e.target.value)}><option value="all">All topics</option>{areas.map(area=><option key={area}>{area}</option>)}</select></label>{recommended&&<Button onClick={()=>openLesson(recommended.id)}>Continue learning<ArrowRight/></Button>}</div><div className="catalog-results">{filtered.length} lessons</div><div className="lesson-list">{filtered.map(lesson=>{const done=progress.isCompleted(lesson.id);const prereqs=(lesson.prerequisites??[]).filter(id=>!progress.isCompleted(id));return <button key={lesson.id} onClick={()=>openLesson(lesson.id)} className="lesson-row"><span className={'lesson-row-marker '+(done?'is-done':'')}>{done?<CheckCircle2 size={22}/>:<BookOpen size={21}/>}</span><span><strong>{lesson.title}</strong><small>{lesson.area}</small></span><span className="lesson-row-state">{done?'Completed':lesson.id===recId?'Recommended':prereqs.length?`${prereqs.length} useful prerequisites`:'Ready to explore'}</span><ArrowRight size={17}/></button>})}</div>{!filtered.length&&<div className="empty-state"><Search/><h2>No lessons match yet</h2><p>Try another word or select All topics.</p><Button variant="outline" onClick={()=>{setSearch('');setTopic('all');}}>Clear filters</Button></div>}</main>}
   {view==='lesson'&&<LessonReader key={current.id} lesson={current} completed={progress.isCompleted(current.id)} onComplete={()=>void progress.markCompleted(current.id)} onLesson={openLesson} onPattern={openPattern} onBack={()=>changeView('learn')}/>}
   {view==='patterns'&&<PatternLibrary key={patternId} initialId={patternId} onOpenLesson={openLesson}/>}
   {view==='practice'&&<Practice/>}{view==='playground'&&<Playground/>}{view==='glossary'&&<GlossaryView onOpenLesson={openLesson}/>} {view==='backup'&&<BackupView/>}
   <footer className="page-footer"><span>DSA Visual Lab · Learn by understanding.</span><button className="link-like" onClick={()=>changeView('backup')}>Backup & local data</button></footer>
  </div>
  <Dialog open={searchOpen} onOpenChange={setSearchOpen}><DialogContent className="search-dialog" onCloseAutoFocus={event=>{event.preventDefault();(searchOpener.current??searchRef.current)?.focus();}}><DialogHeader><DialogTitle>Find your next idea</DialogTitle><DialogDescription>Search the complete local library of lessons and patterns.</DialogDescription></DialogHeader><div className="search-input"><Search size={18}/><Input autoFocus aria-label="Search library" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Try heaps, sliding window, or recursion…"/></div><div className="search-results">{searchRows.map(row=><button key={row.kind+row.id} onClick={()=>row.kind==='lesson'?openLesson(row.id):openPattern(row.id)}><span>{row.kind==='lesson'?<BookOpen size={18}/>:<GitBranch size={18}/>}</span><span><strong>{row.title}</strong><small>{row.area} · {row.kind}</small></span><ArrowRight size={16}/></button>)}{searchRows.length===0&&<p>No matches. Try a broader word.</p>}</div><div className="search-help"><Command size={13}/>Keyboard friendly · Tab to a result, Enter to open</div></DialogContent></Dialog>
 </div></TooltipProvider>;
}
