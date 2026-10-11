import { useMemo, useState } from 'react';
import { ArrowRight, GitBranch, Search } from 'lucide-react';
import { patterns } from '../content/registry';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { PatternDetail } from './PatternDetail';
export function PatternLibrary({initialId,onOpenLesson}:{initialId?:string;onOpenLesson?:(id:string)=>void}){
 const [activeId,setActiveId]=useState(initialId);
 const [query,setQuery]=useState('');const [category,setCategory]=useState('all');
 const active=patterns.find(p=>p.id===activeId);
 const categories=useMemo(()=>[...new Set(patterns.map(p=>p.category))],[]);
 const shown=patterns.filter(p=>(category==='all'||p.category===category)&&(p.title+' '+p.category+' '+p.summary).toLowerCase().includes(query.toLowerCase()));
 if(active)return <PatternDetail key={active.id} pattern={active} onBack={()=>setActiveId(undefined)} onOpenLesson={onOpenLesson}/>;
 return <main id="main-content" className="catalog-page"><div className="eyebrow">THE PATTERN LIBRARY</div><h1>Learn what to look for.</h1><p className="page-description">Move from “I have seen this before” to knowing why an approach works.</p><div className="catalog-controls"><div className="search-input"><Search size={18}/><Input aria-label="Search patterns" placeholder="Search patterns or clues…" value={query} onChange={e=>setQuery(e.target.value)}/></div><label className="filter-select">Category<select aria-label="Filter patterns by category" value={category} onChange={e=>setCategory(e.target.value)}><option value="all">All categories</option>{categories.map(c=><option key={c}>{c}</option>)}</select></label></div><div className="catalog-results">{shown.length} pattern guides</div><div className="pattern-grid">{shown.map(p=><button key={p.id} className="pattern-card" onClick={()=>setActiveId(p.id)}><span className="pattern-card-top"><GitBranch size={21}/><span>{p.category}</span></span><h2>{p.title}</h2><p>{p.summary}</p><span className="pattern-card-footer">Clues · conditions · counterexamples<ArrowRight size={17}/></span></button>)}</div>{shown.length===0&&<div className="empty-state"><Search/><h2>No patterns match</h2><Button variant="outline" onClick={()=>{setQuery('');setCategory('all');}}>Clear filters</Button></div>}</main>;
}
