import { useEffect, useRef, useState } from 'react';
import { isSwarmEnabled } from './enable';
import { releaseContent, startSwarm } from './swarm-engine';

/**
 * Capa a pantalla completa donde cardúmenes de flechas de mouse nadan como peces,
 * construyen cada componente `[data-build]` a medida que se hace scroll y se van
 * cuando toda la landing ya existe. No renderiza nada si el interruptor está
 * apagado (ver `config.ts`) o si el usuario pidió reducir el movimiento.
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
      // Nunca dejar la página invisible porque el efecto falló.
      console.error('El cardumen falló; se muestra la página sin él.', error);
      releaseContent();
    }
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="swarm-canvas"
      aria-hidden="true"
    />
  );
}
