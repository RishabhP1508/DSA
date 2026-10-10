import {useEffect,useRef,useState} from 'react';
import type {PredictionStep,RunResult} from '../core/types';

/** A checkpoint uses a real recorded index. It never runs code or grades prose. */
export function PredictionCheckpoint({steps,result,valid,position,playing=false,onPause,onSeek}:{steps:PredictionStep[];result:RunResult|null;valid:boolean;position:number;playing?:boolean;onPause:()=>void;onSeek:(index:number)=>void}) {
 const [selected,setSelected]=useState<number|null>(null);
 const [reflection,setReflection]=useState('');
 const [revealed,setRevealed]=useState(false);
 const [automatic,setAutomatic]=useState(true);
 const visited=useRef(new Set<number>());
 useEffect(()=>{visited.current.clear();setSelected(null);setReflection('');setRevealed(false);},[result]);
 useEffect(()=>{
  if(!automatic||!playing||!valid||!result||result.incomplete)return;
  const index=steps.findIndex(step=>step.atEventIndex===position);
  if(index<0||visited.current.has(index))return;
  visited.current.add(index);onPause();setSelected(index);setReflection('');setRevealed(false);
 },[automatic,playing,valid,result,position,steps,onPause]);
 if(!steps.length)return null;
 const checkpoint=selected===null?null:steps[selected];
 const available=valid && !!result && !result.incomplete;
 const atCheckpoint=available && checkpoint && position===checkpoint.atEventIndex;
 return <section className="prediction-checkpoint" aria-label="Prediction checkpoints">
  <h4>Pause & predict</h4><p className="dim">Pause at a recorded state, make a prediction, then compare it with the explanation.</p>
  <label><input type="checkbox" checked={automatic} onChange={event=>setAutomatic(event.target.checked)}/> Pause automatically at checkpoints</label>
  <div className="checkpoint-actions">{steps.map((step,index)=>{
    const exists=available && Number.isInteger(step.atEventIndex) && step.atEventIndex>=0 && step.atEventIndex<result!.events.length;
    return <button key={index} disabled={!exists} onClick={()=>{visited.current.add(index);onPause();onSeek(step.atEventIndex);setSelected(index);setRevealed(false);setReflection('');}} aria-pressed={selected===index}>Checkpoint {index+1} · step {step.atEventIndex+1}</button>;
  })}</div>
  {!available && <p className="dim">Run the original example to unlock its checkpoints.</p>}
  {atCheckpoint && <div className="checkpoint-prompt"><p>{checkpoint.prompt}</p><label>Your prediction<textarea value={reflection} onChange={e=>setReflection(e.target.value)} placeholder="Write what you think will happen…" /></label>
   <button onClick={()=>setRevealed(true)}>Compare with the explanation</button>
   {revealed && <div className="checkpoint-answer"><strong>{checkpoint.answer}</strong><p>{checkpoint.explanation}</p><small>Your reflection is for learning; it is not automatically graded.</small></div>}
  </div>}
 </section>;
}
