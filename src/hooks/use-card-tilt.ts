import { useRef, type MouseEvent } from 'react';

export function useCardTilt<T extends HTMLElement = HTMLDivElement>(maxDeg = 9) {
  const ref = useRef<T>(null);

  const onMouseMove = (e: MouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-py * maxDeg}deg) rotateY(${px * maxDeg}deg) translateZ(4px)`;
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
  };

  return { ref, onMouseMove, onMouseLeave };
}
