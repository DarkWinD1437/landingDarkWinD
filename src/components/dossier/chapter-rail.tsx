import { useEffect, useRef, useState } from 'react';
import { CHAPTERS } from '@/data/constants';

export function ChapterRail() {
  const [active, setActive] = useState(1);
  const elsRef = useRef<{ n: number; el: Element }[]>([]);

  useEffect(() => {
    elsRef.current = CHAPTERS.flatMap((c) => {
      const el = document.querySelector(c.href);
      return el ? [{ n: c.n, el }] : [];
    });

    const onScroll = () => {
      const mid = window.innerHeight * 0.4;
      let current = elsRef.current[0]?.n ?? 1;
      for (const { n, el } of elsRef.current) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= mid) current = n;
        else break;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const jump = (href: string) => {
    const el = document.querySelector(href);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 84;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div className="fixed right-[22px] top-1/2 z-[90] hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex">
      {CHAPTERS.map((c) => {
        const isActive = active === c.n;
        return (
          <button
            key={c.n}
            onClick={() => jump(c.href)}
            className="flex items-center gap-2 bg-transparent p-1"
            aria-label={`Ir a la sección ${c.label}`}
          >
            <span
              className="font-mono text-[0.6rem] tracking-[0.05em] transition-colors"
              style={{ color: isActive ? 'var(--accent)' : 'var(--faint)', opacity: isActive ? 1 : 0.6 }}
            >
              {c.label}
            </span>
            <span
              className="block h-0.5 transition-all duration-300"
              style={{ width: isActive ? '26px' : '10px', background: isActive ? 'var(--accent)' : 'var(--border)' }}
            />
          </button>
        );
      })}
    </div>
  );
}
