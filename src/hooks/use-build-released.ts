import { useEffect, useState, type RefObject } from 'react';
import { SWARM_CLASS } from '@/components/swarm/enable';

function isReleased(el: HTMLElement) {
  if (!document.documentElement.classList.contains(SWARM_CLASS)) return true;
  if (!el.hasAttribute('data-build')) return true;
  const state = el.dataset.buildState;
  return state === 'building' || state === 'done';
}

/**
 * `true` cuando el cardumen ya empezó a construir este elemento (o de inmediato
 * si no hay cardumen). Permite que los efectos basados en tiempo, como el
 * typewriter, esperen a que el componente sea realmente visible en vez de
 * reproducirse sin que nadie los vea.
 */
export function useBuildReleased(ref: RefObject<HTMLElement | null>) {
  const [released, setReleased] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let observer: MutationObserver | undefined;
    // Se difiere un frame: deja que el motor marque primero el elemento como `idle`
    // y evita actualizar estado dentro del cuerpo del efecto.
    const id = requestAnimationFrame(() => {
      if (isReleased(el)) {
        setReleased(true);
        return;
      }
      observer = new MutationObserver(() => {
        if (isReleased(el)) {
          setReleased(true);
          observer?.disconnect();
        }
      });
      observer.observe(el, { attributes: true, attributeFilter: ['data-build-state'] });
    });

    return () => {
      cancelAnimationFrame(id);
      observer?.disconnect();
    };
  }, [ref]);

  return released;
}
