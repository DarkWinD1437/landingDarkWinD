/* ═══════════════════════════════════════════════════════════════════════════
 *  CARDUMEN DE CURSORES — INTERRUPTOR PRINCIPAL
 *
 *  true  → los cursores entran nadando y construyen la página mientras haces scroll.
 *  false → la página se muestra normal e inmediatamente, con las animaciones de
 *          entrada originales (tarjetas que se deslizan o hacen zoom, etc.).
 *
 *  En ambos casos las correcciones de rendimiento y de móvil siguen activas
 *  (typewriter aislado, componentes `motion` cacheados, sin desbordamiento
 *  horizontal ni "zoom out" en celulares).
 *
 *  La constante de abajo es el valor por defecto. Se puede sobrescribir sin
 *  tocar el código, de mayor a menor prioridad:
 *    1. URL        →  https://sitio/?swarm=off   (o =on)   — útil para probar
 *    2. Variable   →  VITE_SWARM=off             (o =on)   — por despliegue, p. ej. Netlify
 *    3. Constante  →  SWARM_ENABLED              (este archivo)
 *  Valores aceptados: on/off, true/false, 1/0, yes/no.
 * ═══════════════════════════════════════════════════════════════════════════ */
export const SWARM_ENABLED = true;

function parseFlag(value: unknown): boolean | undefined {
  const v = String(value ?? '').trim().toLowerCase();
  if (['off', 'false', '0', 'no'].includes(v)) return false;
  if (['on', 'true', '1', 'yes'].includes(v)) return true;
  return undefined;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

let cached: boolean | undefined;

/**
 * Si el cardumen corre en esta visita. Se decide una sola vez (para que todos los
 * componentes coincidan durante toda la sesión): el interruptor de arriba, menos
 * los usuarios que pidieron reducir el movimiento en su sistema.
 */
export function swarmActive(): boolean {
  if (cached === undefined) {
    const fromUrl = parseFlag(new URLSearchParams(window.location.search).get('swarm'));
    const fromEnv = parseFlag(import.meta.env.VITE_SWARM);
    const wanted = fromUrl ?? fromEnv ?? SWARM_ENABLED;
    cached = wanted && !prefersReducedMotion();
  }
  return cached;
}

/**
 * Las animaciones de entrada originales al hacer scroll (ContainerStagger / variantes
 * de motion). Vuelven cuando el cardumen está apagado y se apartan cuando está
 * encendido: el cardumen construye esos mismos componentes, y la transformación de un
 * ancestro deforma la caja que mide. Quien pide reducir el movimiento no ve ninguna.
 */
export function entranceAnimationsActive(): boolean {
  return !swarmActive() && !prefersReducedMotion();
}
