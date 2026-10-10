import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {it,expect,vi,afterEach} from 'vitest';
import {PredictionCheckpoint} from './PredictionCheckpoint';
import type {RunResult} from '../core/types';
afterEach(cleanup);
const steps=[{atEventIndex:1,prompt:'Which value changes next?',answer:'total',explanation:'The next statement adds x to total.'}];
const result={runId:1,status:'completed',events:[{},{}],stdout:'',stderr:''} as RunResult;
it('pauses and seeks the authored recorded index before revealing an explanation',()=>{
 const onPause=vi.fn(),onSeek=vi.fn();
 const {rerender}=render(<PredictionCheckpoint steps={steps} result={result} valid position={0} onPause={onPause} onSeek={onSeek}/>);
 fireEvent.click(screen.getByRole('button',{name:/Checkpoint 1/}));expect(onPause).toHaveBeenCalledTimes(1);expect(onSeek).toHaveBeenCalledWith(1);
 expect(screen.queryByText('total')).toBeNull();
 rerender(<PredictionCheckpoint steps={steps} result={result} valid position={1} onPause={onPause} onSeek={onSeek}/>);
 expect(screen.getByText(steps[0].prompt)).toBeVisible();expect(screen.queryByText('total')).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Compare with the explanation'}));expect(screen.getByText('total')).toBeVisible();
});
it('disables source-specific checkpoints for stale, edited or incomplete traces',()=>{
 const props={steps,result,position:0,onPause:vi.fn(),onSeek:vi.fn()};const {rerender}=render(<PredictionCheckpoint {...props} valid={false}/>);
 expect(screen.getByRole('button',{name:/Checkpoint 1/})).toBeDisabled();
 rerender(<PredictionCheckpoint {...props} valid result={{...result,incomplete:true}}/>);expect(screen.getByRole('button',{name:/Checkpoint 1/})).toBeDisabled();
});
it('never clamps an invalid authored checkpoint onto a different event',()=>{
 render(<PredictionCheckpoint steps={[{...steps[0],atEventIndex:99}]} result={result} valid position={0} onPause={vi.fn()} onSeek={vi.fn()}/>);
 expect(screen.getByRole('button',{name:/Checkpoint 1/})).toBeDisabled();
});
it('automatically pauses once at the exact checkpoint and lets playback resume',()=>{
 const onPause=vi.fn(),onSeek=vi.fn();
 const props={steps,result,valid:true,onPause,onSeek,playing:true};
 const {rerender}=render(<PredictionCheckpoint {...props} position={0}/>);
 expect(onPause).not.toHaveBeenCalled();
 rerender(<PredictionCheckpoint {...props} position={1}/>);
 expect(onPause).toHaveBeenCalledTimes(1);expect(onSeek).not.toHaveBeenCalled();
 expect(screen.getByText(steps[0].prompt)).toBeVisible();expect(screen.queryByText('total')).toBeNull();
 rerender(<PredictionCheckpoint {...props} position={1} playing={false}/>);
 rerender(<PredictionCheckpoint {...props} position={1}/>);
 expect(onPause).toHaveBeenCalledTimes(1);
});
