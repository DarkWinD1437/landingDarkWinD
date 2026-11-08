interface SectionDividerProps {
  n: number;
}

export function SectionDivider({ n }: SectionDividerProps) {
  const num = String(n).padStart(3, '0');
  return (
    <div data-build="DIVISOR" className="relative z-10 mx-auto flex max-w-330 items-center gap-4 px-6 md:px-16">
      <div className="h-px flex-1 bg-border" />
      <span className="whitespace-nowrap font-mono text-[0.62rem] tracking-[0.2em] text-faint">
        FIN DEL REGISTRO Nº {num}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
