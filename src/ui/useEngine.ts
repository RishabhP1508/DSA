/**
 * React binding for the execution engine + replay controller.
 *
 * The engine is created once and reused. `run` executes source and installs a
 * fresh Replay; the returned `event` is the current step, which the workspace
 * feeds to the visualizers. Stepping never reruns the program.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExecutionEngine } from "../engine/engine";
import { Replay } from "../engine/replay";
import type { RunResult, TraceEvent } from "../core/types";

export function useEngine() {
  const engineRef = useRef<ExecutionEngine | null>(null);
  const replayRef = useRef<Replay | null>(null);
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const engine = new ExecutionEngine({ onReady: () => setReady(true) });
    engineRef.current = engine;
    return () => engine.dispose();
  }, []);

  const run = useCallback(async (source: string, stdin?: string) => {
    const engine = engineRef.current;
    if (!engine) return;
    setRunning(true);
    const res = await engine.run(source, { stdin });
    setRunning(false);
    if (res.status === "stopped") return; // superseded by a newer run
    replayRef.current = new Replay(res);
    setResult(res);
    setPosition(0);
  }, []);

  const stop = useCallback(() => {
    engineRef.current?.stop();
    setRunning(false);
  }, []);

  const seek = useCallback((i: number) => {
    const r = replayRef.current;
    if (!r) return;
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
    r.prev();
    setPosition(r.position);
  }, []);

  const restart = useCallback(() => {
    const r = replayRef.current;
    if (!r) return;
    r.restart();
    setPosition(r.position);
  }, []);

  const event: TraceEvent | undefined = result?.events[position];
  const length = result?.events.length ?? 0;

  const outputSoFar = useMemo(() => {
    return replayRef.current?.outputSoFar() ?? "";
  }, [position, result]);

  return {
    ready,
    running,
    result,
    event,
    position,
    length,
    outputSoFar,
    run,
    stop,
    seek,
    next,
    prev,
    restart,
  };
}
