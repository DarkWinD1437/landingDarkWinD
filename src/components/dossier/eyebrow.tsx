import { cn } from '@/lib/utils';

interface EyebrowProps {
  n: number;
  label: string;
  className?: string;
}

export function Eyebrow({ n, label, className }: EyebrowProps) {
  const num = String(n).padStart(3, '0');
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 font-mono text-[0.75rem] tracking-[0.16em] uppercase text-accent',
        className
      )}
    >
      <span className="size-2 shrink-0 bg-primary animate-blink" aria-hidden="true" />
      REGISTRO Nº {num} — {label}
    </div>
  );
}
