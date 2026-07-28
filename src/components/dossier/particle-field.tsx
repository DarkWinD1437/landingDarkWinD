import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export function ParticleField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.4 + 0.5,
      s: Math.random() * 0.00035 + 0.00008,
      o: Math.random() * 0.45 + 0.12,
      cyan: Math.random() < 0.22,
    }));

    let raf: number;
    const draw = () => {
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.y -= p.s;
        if (p.y < -0.02) {
          p.y = 1.02;
          p.x = Math.random();
        }
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r * dpr, 0, Math.PI * 2);
        ctx.fillStyle = p.cyan ? `rgba(120,210,230,${p.o})` : `rgba(220,228,236,${p.o})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 h-full w-full', className)}
      aria-hidden="true"
    />
  );
}
