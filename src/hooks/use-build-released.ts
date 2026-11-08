import { useEffect, useState, type RefObject } from 'react';
import { SWARM_CLASS } from '@/components/swarm/enable';

function isReleased(el: HTMLElement) {
  if (!document.documentElement.classList.contains(SWARM_CLASS)) return true;
  if (!el.hasAttribute('data-build')) return true;
  const state = el.dataset.buildState;
  return state === 'building' || state === 'done';
}

/**
 * `true` once the mouse swarm has started building this element (or right away
 * when there is no swarm). Lets time-based effects — like the typewriter — wait
 * for the component to actually become visible instead of playing out unseen.
 */
export function useBuildReleased(ref: RefObject<HTMLElement | null>) {
  const [released, setReleased] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let observer: MutationObserver | undefined;
    // Deferred a frame: lets the engine mark the element `idle` first, and keeps
    // state updates out of the effect body.
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
