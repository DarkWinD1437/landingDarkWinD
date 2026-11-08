import { swarmActive } from './config';

/**
 * El cardumen oculta cada componente `[data-build]` hasta que los cursores lo
 * construyen, así que el interruptor hay que accionarlo *antes* de que React
 * pinte; si no, la página terminada parpadearía un frame y luego desaparecería.
 * `main.tsx` llama a `enableSwarm()` antes de `createRoot`.
 *
 * Si corre o no se decide en `config.ts` (interruptor principal, sobrescritura
 * por URL/variable de entorno, reducir movimiento). Cuando no corre, la clase
 * nunca se agrega: la página se renderiza completa y `<MouseSwarm />` no
 * renderiza nada.
 */
export const SWARM_CLASS = 'swarm-on';

export function isSwarmEnabled(): boolean {
  return document.documentElement.classList.contains(SWARM_CLASS);
}

export function enableSwarm(): void {
  if (!swarmActive()) return;
  document.documentElement.classList.add(SWARM_CLASS);
}
