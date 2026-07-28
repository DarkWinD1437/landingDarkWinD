import { cn } from '@/lib/utils';

interface GlitchHeadingProps {
  lines: string[];
  className?: string;
  as?: 'h1' | 'h2';
}

export function GlitchHeading({ lines, className, as: Component = 'h1' }: GlitchHeadingProps) {
  return (
    <Component
      className={cn(
        'font-display font-normal uppercase leading-[0.92] text-[clamp(3rem,11vw,8.5rem)]',
        className
      )}
    >
      {lines.map((line, i) => (
        <span key={`${line}-${i}`} className="relative block overflow-hidden">
          {line}
          <span
            className="pointer-events-none absolute left-[2px] top-0 w-full text-accent opacity-0 mix-blend-screen"
            style={{ animation: 'glitchTop 6s infinite', animationDelay: `${i * 0.15}s` }}
            aria-hidden="true"
          >
            {line}
          </span>
          <span
            className="pointer-events-none absolute -left-[2px] top-0 w-full text-primary opacity-0 mix-blend-screen"
            style={{ animation: 'glitchBottom 6s infinite', animationDelay: `${i * 0.15}s` }}
            aria-hidden="true"
          >
            {line}
          </span>
        </span>
      ))}
    </Component>
  );
}
