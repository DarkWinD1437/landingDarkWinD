import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { useBuildReleased } from '@/hooks/use-build-released';

interface UseTypewriterOptions {
  speed?: number;
}

export function useTypewriter<T extends HTMLElement = HTMLElement>(
  text: string,
  { speed = 14 }: UseTypewriterOptions = {}
) {
  const ref = useRef<T>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  // No escribir mientras el cardumen no haya construido este párrafo: nadie lo vería.
  const released = useBuildReleased(ref);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!isInView || !released || typed >= text.length) return;
    const id = setTimeout(() => setTyped((n) => n + 1), speed);
    return () => clearTimeout(id);
  }, [isInView, released, typed, text.length, speed]);

  return { ref, display: text.slice(0, typed), done: typed >= text.length };
}
