import { useEffect, useRef, useState } from 'react';
import { isSwarmEnabled } from './enable';
import { releaseContent, startSwarm } from './swarm-engine';

/**
 * Full-viewport overlay where schools of mouse-pointer arrows swim like fish, build every
 * `[data-build]` component as the page is scrolled, and leave once the whole
 * landing exists. Renders nothing when motion is reduced.
 */
export function MouseSwarm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(isSwarmEnabled);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!active || !canvas) return;
    try {
      return startSwarm(canvas, () => setActive(false));
    } catch (error) {
      // Never leave the page invisible because the effect failed.
      console.error('MouseSwarm failed, showing the page without it.', error);
      releaseContent();
    }
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-110 h-full w-full"
      aria-hidden="true"
    />
  );
}
