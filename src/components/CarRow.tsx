import React, { useRef, useEffect } from "react";
import { useCarEngine } from "../hooks/useCarEngine";
import CarIcon from "../assets/Car.svg?react";

type Car = { id: number; name: string; color: string };

export default function CarRow({
  car,
  isSelected,
  onSelect,
  onDelete,
  isDeleting,
  isUpdating,
  onRegister,
  onUnregister,
  disabled,       // disables local Start/Stop during global race
  raceLock,       // NEW: locks Select/Remove while racing
}: {
  car: Car;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
  onRegister?: (
    id: number,
    fns: { start: () => Promise<number | void>; stop: () => Promise<void> }
  ) => void;
  onUnregister?: (id: number) => void;
  disabled?: boolean;
  raceLock?: boolean;
}) {
  const carRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const { phase, timeMs, start, stop } = useCarEngine(car.id, carRef, trackRef);
  const driving = phase === "started" || phase === "driving";

  useEffect(() => {
    onRegister?.(car.id, { start, stop });
    return () => onUnregister?.(car.id);
  }, [car.id, start, stop, onRegister, onUnregister]);

  const lockTip = raceLock ? "Locked during race" : "";

  return (
    <div className="car-row">
      {/* Left control column */}
      <div className="lane-controls">
        <div className="ctrl-stack">
          <button
            className="btn-pill small"
            onClick={onSelect}
            disabled={raceLock || isSelected || isUpdating}
            title={lockTip}
          >
            SELECT
          </button>
          <button
            className="btn-pill small danger"
            onClick={onDelete}
            disabled={raceLock || isDeleting || isUpdating}
            title={lockTip}
          >
            REMOVE
          </button>
        </div>

        <button
          className="btn-square keyA"
          onClick={start}
          disabled={disabled || raceLock || driving || phase === "broken"}
          title={disabled || raceLock ? "Disabled during race" : "Start"}
        >
          A
        </button>
        <button
          className="btn-square keyB"
          onClick={stop}
          disabled={disabled || raceLock || phase === "idle"}
          title={disabled || raceLock ? "Disabled during race" : "Stop"}
        >
          B
        </button>
      </div>

      {/* Track/lane */}
      <div ref={trackRef} className="track">
        {/* (rails removed per your style) */}
        <div ref={carRef} className="car-wrap">
          <CarIcon width={90} height={50} style={{ fill: car.color }} />
        </div>
      </div>

      {/* Right meta */}
      <div className="meta">
        <div>
          <div className="name">{car.name}</div>
          <div className="sub">
            {phase}
            {timeMs ? ` · ${(timeMs / 1000).toFixed(2)}s` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
