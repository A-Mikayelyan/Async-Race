import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  createCarAnimator,
  resetCarPosition,
  type Animator,
} from "../lib/animateCar";
import { startEngine, drive, stopEngine } from "../api/engine";

type AnyRef<T extends HTMLElement> = { current: T | null };

type Phase = "idle" | "stopped" | "started" | "driving" | "finished" | "broken";

type UseCarEngineReturn = {
  phase: Phase;
  timeMs: number | null;
  start: () => Promise<number | void>;
  stop: () => Promise<void>;

  phaseRef: React.MutableRefObject<Phase>;
  ctrlRef: React.MutableRefObject<AbortController | null>;
  animatorRef: React.MutableRefObject<Animator | null>;
  timeMsRef: React.MutableRefObject<number | null>;
};

export function useCarEngine<E1 extends HTMLElement, E2 extends HTMLElement>(
  carId: number,
  carElRef: AnyRef<E1>,
  trackElRef: AnyRef<E2>
): UseCarEngineReturn {
  const [phase, setPhase] = useState<Phase>("idle");
  const [timeMs, setTimeMs] = useState<number | null>(null);

  const phaseRef = useRef<Phase>("idle");
  const ctrlRef = useRef<AbortController | null>(null);
  const animatorRef = useRef<Animator | null>(null);
  const timeMsRef = useRef<number | null>(null);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const measurePxDistance = useCallback((): number => {
    const car = carElRef.current;
    const track = trackElRef.current;
    if (!car || !track) return 0;

    const trackW = track.getBoundingClientRect().width;
    const carW = car.getBoundingClientRect().width;
    const smallMargin = 8;
    return Math.max(0, trackW - carW - smallMargin);
  }, [carElRef, trackElRef]);

  const resetVisual = useCallback(() => {
    const car = carElRef.current;
    if (car) resetCarPosition(car);
  }, [carElRef]);

  const start = useCallback(async (): Promise<number | void> => {
    if (phaseRef.current === "started" || phaseRef.current === "driving")
      return;

    const car = carElRef.current;
    if (!car) return;

    setPhase("started");

    let velocity: number, distance: number;
    try {
      const res = await startEngine(carId);
      velocity = res.velocity;
      distance = res.distance;
    } catch {
      setPhase("broken");
      return;
    }

    if (!velocity || velocity <= 0) {
      setPhase("broken");
      return;
    }

    let tMs = distance / velocity;
    if (!isFinite(tMs) || tMs > 20000) {
      tMs = (distance / velocity) * 1000;
    }
    timeMsRef.current = tMs;
    setTimeMs(tMs);

    const px = measurePxDistance();

    const animator = createCarAnimator(car, tMs, px);
    animatorRef.current = animator;
    animator.start();
    setPhase("driving");

    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    let ok = false;
    try {
      const res = await drive(carId, ctrl.signal);
      ok = res.ok;
    } catch {}

    if (!ok) {
      setPhase("broken");
      animator.stop();
      return;
    }

    await animator.promise;
    setPhase("finished");
    return tMs;
  }, [carElRef, carId, measurePxDistance]);

  const stop = useCallback(async (): Promise<void> => {
    ctrlRef.current?.abort();
    ctrlRef.current = null;

    animatorRef.current?.stop();
    animatorRef.current = null;
    resetVisual();

    setPhase("stopped");
    try {
      await stopEngine(carId);
    } catch {}
  }, [carId, resetVisual]);

  useEffect(() => {
    return () => {
      try {
        ctrlRef.current?.abort();
      } catch {}
      try {
        animatorRef.current?.stop();
      } catch {}
    };
  }, []);

  return useMemo(
    () => ({
      phase,
      timeMs,
      start,
      stop,
      phaseRef,
      ctrlRef,
      animatorRef,
      timeMsRef,
    }),
    [phase, timeMs, start, stop]
  );
}
