export function ScanOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-55" aria-hidden="true">
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 3px)',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-40 animate-scan-sweep bg-linear-to-b from-accent/[0.07] to-transparent" />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 0.5px, transparent 0.5px)',
          backgroundSize: '3px 3px',
        }}
      />
    </div>
  );
}
