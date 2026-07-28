const TICKER_TEXT =
  '> CONEXIÓN ESTABLECIDA // > COMPILANDO PORTAFOLIO.TSX // > STACK: REACT + VITE + TAILWIND // > INTEGRACIÓN DE IA ACTIVA // > DESPLEGANDO A PRODUCCIÓN // > SISTEMA EN LÍNEA // > 0 ERRORES DETECTADOS //';

export function MarqueeTicker() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[92] flex h-[30px] items-center overflow-hidden border-t border-border bg-background/90"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee whitespace-nowrap font-mono text-[0.65rem] tracking-[0.05em] text-muted-foreground">
        <span className="pr-10">{TICKER_TEXT}</span>
        <span className="pr-10">{TICKER_TEXT}</span>
      </div>
    </div>
  );
}
