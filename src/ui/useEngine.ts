/**
 * React binding for the execution engine + replay controller.
 *
 * The engine is created once and reused. `run` executes source and installs a
 * fresh Replay; the returned `event` is the current step, which the workspace
 * feeds to the visualizers. Stepping never reruns the program.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getSharedEngine } from "../engine/engine";
import { Replay } from "../engine/replay";
import type { RunResult, TraceEvent, EngineState } from "../core/types";

export function useEngine(owner = "workspace") {
  // ONE shared coordinator per app window (R2-A): no per-hook engine, and no
  // worker is created until a run is requested.
  const engine = getSharedEngine();
  const replayRef = useRef<Replay | null>(null);
  const [ready] = useState(true); // the runtime warms lazily on first run
  const [running, setRunning] = useState(false);
  const [state, setState] = useState<EngineState>(engine.state);
  const [result, setResult] = useState<RunResult | null>(null);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    // Subscribe to lifecycle changes for status display. Do NOT dispose the
    // shared engine on unmount (it is process-lifetime).
    const unsubscribe = engine.subscribe(setState);
    return unsubscribe;
  }, [engine]);

  const run = useCallback(
    async (source: string, stdin?: string) => {
      setRunning(true);
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
  }, [engine]);

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
    state,
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
