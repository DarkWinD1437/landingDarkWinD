import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    document.body.style.cursor = 'none';
    ring.style.display = 'block';
    dot.style.display = 'block';

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...mouse };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };
    window.addEventListener('mousemove', onMove);

    let raf: number;
    const loop = () => {
      ringPos.x += (mouse.x - ringPos.x) * 0.16;
      ringPos.y += (mouse.y - ringPos.y) * 0.16;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    const hoverEls = Array.from(document.querySelectorAll('a, button'));
    const onEnter = () => {
      ring.style.width = '54px';
      ring.style.height = '54px';
      ring.style.marginLeft = '-27px';
      ring.style.marginTop = '-27px';
      ring.style.background = 'oklch(0.62 0.19 200 / 0.12)';
    };
    const onLeave = () => {
      ring.style.width = '28px';
      ring.style.height = '28px';
      ring.style.marginLeft = '-14px';
      ring.style.marginTop = '-14px';
      ring.style.background = 'transparent';
    };
    hoverEls.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      hoverEls.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden size-7 -ml-3.5 -mt-3.5 rounded-full border border-accent transition-[width,height,margin,background] duration-250 mix-blend-difference"
        aria-hidden="true"
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden size-[5px] -ml-[2.5px] -mt-[2.5px] rounded-full bg-accent"
        aria-hidden="true"
      />
    </>
  );
}
