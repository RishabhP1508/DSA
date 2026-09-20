/**
 * React binding for the execution engine + replay controller.
 *
 * The shared engine is reused (R2-A). `run` executes source and installs a fresh
 * Replay; the returned `event` is the current step, which the workspace feeds to
 * the visualizers. Stepping never reruns the program.
 *
 * R4 additions: Play/Pause with a speed control and playback breakpoints
 * (R4.3), a zero-event-safe API, and `isStale` for source-edit invalidation
 * (R4.1).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getSharedEngine } from "../engine/engine";
import { Replay, nextPlayIndex, isResultStale } from "../engine/replay";
import type { RunResult, TraceEvent, EngineState } from "../core/types";

/** Playback speeds in steps per second. */
export const PLAYBACK_SPEEDS = [0.5, 1, 2, 4] as const;

export function useEngine(owner = "workspace") {
  const engine = getSharedEngine();
  const replayRef = useRef<Replay | null>(null);
  const [ready] = useState(true); // the runtime warms lazily on first run
  const [running, setRunning] = useState(false);
  const [state, setState] = useState<EngineState>(engine.state);
  const [result, setResult] = useState<RunResult | null>(null);
  const [position, setPosition] = useState(0);

  // Playback (R4.3)
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [breakpoints, setBreakpoints] = useState<ReadonlySet<number>>(new Set());

  useEffect(() => {
    const unsubscribe = engine.subscribe(setState);
    return unsubscribe;
  }, [engine]);

  const run = useCallback(
    async (source: string, stdin?: string) => {
      setRunning(true);
      setPlaying(false);
      const res = await engine.run(source, { stdin, owner });
      setRunning(false);
      if (res.status === "stopped") return; // superseded by a newer run
      replayRef.current = new Replay(res);
      setResult(res);
      setPosition(0);
    },
    [engine, owner],
  );

  const stop = useCallback(() => {
    engine.stop();
    setRunning(false);
    setPlaying(false);
  }, [engine]);

  const seek = useCallback((i: number) => {
    const r = replayRef.current;
    if (!r) return;
    setPlaying(false);
    r.seek(i);
    setPosition(r.position);
  }, []);

  const next = useCallback(() => {
    const r = replayRef.current;
    if (!r) return;
    r.next();
    setPosition(r.position);
  }, []);

  const prev = useCallback(() => {
    const r = replayRef.current;
    if (!r) return;
    setPlaying(false);
    r.prev();
    setPosition(r.position);
  }, []);

  const restart = useCallback(() => {
    const r = replayRef.current;
    if (!r) return;
    setPlaying(false);
    r.restart();
    setPosition(r.position);
  }, []);

  const length = result?.events.length ?? 0;

  const play = useCallback(() => {
    if (length === 0) return;
    // Restart from the beginning if we're already at the end.
    const r = replayRef.current;
    if (r && r.position >= length - 1) {
      r.restart();
      setPosition(0);
    }
    setPlaying(true);
  }, [length]);

  const pause = useCallback(() => setPlaying(false), []);

  const toggleBreakpoint = useCallback((line: number) => {
    setBreakpoints((prev) => {
      const nextSet = new Set(prev);
      if (nextSet.has(line)) nextSet.delete(line);
      else nextSet.add(line);
      return nextSet;
    });
  }, []);

  // Play timer: advance one recorded step per tick, stopping at the end or at a
  // playback breakpoint (R4.3). Reads recorded states only; never reruns Python.
  useEffect(() => {
    if (!playing) return;
    const events = result?.events ?? [];
    const intervalMs = Math.max(60, Math.round(1000 / speed));
    const id = setInterval(() => {
      const r = replayRef.current;
      if (!r) return;
      const target = nextPlayIndex(events, r.position, breakpoints);
      if (target == null) {
        setPlaying(false);
        return;
      }
      r.seek(target);
      setPosition(r.position);
      // Pause when we've landed on a breakpoint line (but not the one we just
      // stepped off), or reached the end.
      const landedLine = events[target]?.line;
      if (r.position >= events.length - 1) setPlaying(false);
      else if (landedLine !== undefined && breakpoints.has(landedLine)) setPlaying(false);
    }, intervalMs);
    return () => clearInterval(id);
  }, [playing, speed, breakpoints, result]);

  const event: TraceEvent | undefined = result?.events[position];

  const outputSoFar = useMemo(() => {
    return replayRef.current?.outputSoFar() ?? "";
  }, [position, result]);

  /** True when `result` no longer matches the current editor source/stdin (R4.1). */
  const isStale = useCallback(
    (source: string, stdin = "") => isResultStale(result, source, stdin),
    [result],
  );

  return {
    ready,
    running,
    state,
    result,
    event,
    position,
    length,
    outputSoFar,
    // playback
    playing,
    speed,
    setSpeed,
    breakpoints,
    toggleBreakpoint,
    play,
    pause,
    // lifecycle / stepping
    run,
    stop,
    seek,
    next,
    prev,
    restart,
    isStale,
  };
}
