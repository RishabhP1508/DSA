import type { TraceEvent } from '../core/types';
import { MAX_BATCH_BYTES, MAX_BATCH_EVENTS, FLUSH_INTERVAL_MS } from './protocol';

/** Bounded batching called DURING Python execution, not after run_program returns. */
export class TraceStream {
  private pending: TraceEvent[]=[];
  private bytes=0;
  private lastFlush=0;
  private sent=0;
  private readonly send:(events:TraceEvent[])=>void;
  private readonly now:()=>number;
  constructor(send:(events:TraceEvent[])=>void,now=()=>performance.now()){this.send=send;this.now=now;}
  push(event:TraceEvent) {
    const size=new TextEncoder().encode(JSON.stringify(event)).byteLength;
    if(this.pending.length && (this.pending.length>=MAX_BATCH_EVENTS || this.bytes+size>MAX_BATCH_BYTES))this.flush();
    this.pending.push(event);this.bytes+=size;
    // Send the first state immediately; time checks run in the trace callback
    // since a synchronous Python job cannot service a worker interval timer.
    if(!this.sent || this.now()-this.lastFlush>=FLUSH_INTERVAL_MS || this.pending.length>=MAX_BATCH_EVENTS || this.bytes>=MAX_BATCH_BYTES)this.flush();
  }
  flush(){
    if(!this.pending.length)return;
    this.send(this.pending);this.sent+=this.pending.length;
    this.pending=[];this.bytes=0;this.lastFlush=this.now();
  }
  /** Only the unsent states belong in the terminal message. */
  finish(){const tail=this.pending;this.pending=[];this.bytes=0;return tail;}
}
