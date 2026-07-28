import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

interface UseTypewriterOptions {
  speed?: number;
}

export function useTypewriter<T extends HTMLElement = HTMLElement>(
  text: string,
  { speed = 14 }: UseTypewriterOptions = {}
) {
  const ref = useRef<T>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!isInView || typed >= text.length) return;
    const id = setTimeout(() => setTyped((n) => n + 1), speed);
    return () => clearTimeout(id);
  }, [isInView, typed, text.length, speed]);

  return { ref, display: text.slice(0, typed), done: typed >= text.length };
}
