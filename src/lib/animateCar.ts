export type Animator = {
  start: () => void;
  stop: () => void;
  promise: Promise<void>;
};

export function createCarAnimator(
  el: HTMLElement,
  totalMilis: number,
  pixelDistance: number
): Animator {
  let rafId = 0;
  let startedAt = 0;
  let stopped = false;

  el.style.willChange = "transform";

  const animator: Partial<Animator> = {};

  const promise = new Promise<void>((resolve) => {
    const tick = (now: number) => {
      if (!startedAt) startedAt = now;

      const elapsed = now - startedAt;
      const raw = elapsed / totalMilis;
      const progress = raw >= 1 ? 1 : raw <= 0 ? 0 : raw;

      el.style.transform = `translate(${progress * pixelDistance}px, -50%)`;

      if (stopped || progress >= 1) {
        cancelAnimationFrame(rafId);
        if (!stopped) {
          el.style.transform = `translate(${pixelDistance}px, -50%)`;
        }
        resolve();
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    animator.start = () => {
      cancelAnimationFrame(rafId);
      stopped = false;
      startedAt = 0;
      rafId = requestAnimationFrame(tick);
    };

    animator.stop = () => {
      stopped = true;
      cancelAnimationFrame(rafId);

      resolve();
    };
  });

  return {
    start: animator.start!,
    stop: animator.stop!,
    promise,
  };
}

export function resetCarPosition(el: HTMLElement) {
  el.style.transform = "translate(0px, -50%)";
}
