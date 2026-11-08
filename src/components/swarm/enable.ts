/**
 * The swarm hides every `[data-build]` component until the mice build it, so
 * the switch has to be flipped *before* React paints — otherwise the finished
 * page would flash for a frame and then vanish. `main.tsx` calls
 * `enableSwarm()` ahead of `createRoot`.
 *
 * Users who ask for reduced motion never get the class, so the page simply
 * renders in full and `<MouseSwarm />` renders nothing.
 */
export const SWARM_CLASS = 'swarm-on';

export function isSwarmEnabled(): boolean {
  return document.documentElement.classList.contains(SWARM_CLASS);
}

export function enableSwarm(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add(SWARM_CLASS);
}
