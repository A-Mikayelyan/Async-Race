import React, { useEffect } from "react";

export default function WinnerOverlay({
  open,
  name,
  seconds,
  onClose,
}: {
  open: boolean;
  name: string;
  seconds: number;
  onClose: () => void;
}) {
  if (!open) return null;

  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="winner-overlay" role="dialog" aria-live="assertive">
      <div className="winner-panel">
        <div className="winner-title">WINNER</div>
        <div className="winner-name">{name}</div>
        <div className="winner-time">TIME: {seconds.toFixed(2)} s</div>

        <button className="winner-close" type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
