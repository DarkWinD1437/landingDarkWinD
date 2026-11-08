import { lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { EntranceGroup, EntranceItem } from '@/components/swarm/entrance';
import { Eyebrow } from '@/components/dossier/eyebrow';
import { GlitchHeading } from '@/components/dossier/glitch-heading';
import { ParticleField } from '@/components/dossier/particle-field';
import { data } from '@/data/data';
import perfilImg from '@/assets/perfil.webp';

// Lazy-loaded: pulls in `ogl` (WebGL), which only this decorative
// background needs — keeps it out of the main bundle chunk.
const WireframeCity = lazy(() =>
  import('@/components/dossier/wireframe-city').then((m) => ({ default: m.WireframeCity }))
);

export function Hero() {
  const nameLines = data.name.toUpperCase().split(' ');

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pb-24 pt-32 md:px-16"
    >
      <Suspense fallback={null}>
        <WireframeCity className="z-0" />
      </Suspense>
      <ParticleField className="z-1 opacity-85" />

      <div
        className="pointer-events-none absolute -right-25 top-[46%] z-2 size-105 -translate-y-1/2 rounded-full border border-dashed border-border opacity-45 animate-spin-slow md:-right-10 md:size-120"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-2.5 top-[46%] z-2 hidden size-80 -translate-y-1/2 rounded-full border border-border opacity-30 md:block"
        aria-hidden="true"
      />

      <EntranceGroup className="relative z-10 flex flex-col-reverse items-start gap-10 md:flex-row md:items-center md:justify-between">
        <div data-build="PRESENTACIÓN" className="flex max-w-2xl flex-col gap-6">
          <EntranceItem>
            <Eyebrow n={1} label="ORIGEN" />
          </EntranceItem>

          <EntranceItem>
            <GlitchHeading lines={nameLines} />
          </EntranceItem>

          <EntranceItem
            as="p"
            className="font-mono text-[clamp(0.8rem,1.4vw,1rem)] uppercase tracking-[0.08em] text-muted-foreground"
          >
            {data.title}
          </EntranceItem>

          <EntranceItem
            as="p"
            className="max-w-[46ch] font-mono text-[clamp(1.05rem,2vw,1.3rem)] leading-relaxed text-foreground"
          >
            {data.heroPhrase}
          </EntranceItem>

          <EntranceItem className="flex flex-wrap gap-3 pt-2">
            <Button
              asChild
              className="animate-pulse-ring bg-primary font-mono text-xs uppercase tracking-[0.1em] text-primary-foreground hover:bg-accent"
            >
              <a href="#experiencia">Ver mi trabajo →</a>
            </Button>
            <Button variant="outline" asChild className="font-mono text-xs uppercase tracking-[0.1em]">
              <a href="#contacto">Contactarme</a>
            </Button>
          </EntranceItem>
        </div>

        {/* Nodo interno simple: el cardumen mide esta caja y, cuando la animación de entrada
            original está activa, la transformación del contenedor externo la deformaría. */}
        <EntranceItem className="relative shrink-0">
          <div data-build="RETRATO" className="relative">
            <div className="absolute -inset-3 border border-border" aria-hidden="true" />
            <img
              src={perfilImg}
              alt={data.fullName}
              className="relative size-40 border border-border object-cover object-top md:size-52"
            />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap border border-border bg-background px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-faint">
              SUJETO 001
            </div>
          </div>
        </EntranceItem>
      </EntranceGroup>

      <div
        data-build="INDICADOR"
        className="relative z-10 mt-16 flex w-fit items-center gap-2.5 font-mono text-[0.68rem] tracking-[0.15em] text-faint"
      >
        <div className="relative h-8 w-px overflow-hidden bg-border">
          <div className="absolute left-0 top-0 h-[40%] w-full animate-drip bg-accent" />
        </div>
        DESCENDER
      </div>
    </section>
  );
}
