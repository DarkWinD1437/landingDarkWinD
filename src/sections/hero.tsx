import { lazy, Suspense } from 'react';
import { ContainerStagger } from '@/components/systaliko-ui/blocks/container-stagger';
import { motion, MotionConfig } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ANIMATION_VARIANTS } from '@/components/systaliko-ui/utils/animation-variants';
import { Eyebrow } from '@/components/dossier/eyebrow';
import { GlitchHeading } from '@/components/dossier/glitch-heading';
import { ParticleField } from '@/components/dossier/particle-field';
import { data } from '@/data/data';
import perfilImg from '@/assets/perfil.jpg';

// Lazy-loaded: pulls in `ogl` (WebGL), which only this decorative
// background needs — keeps it out of the main bundle chunk.
const WireframeCity = lazy(() =>
  import('@/components/dossier/wireframe-city').then((m) => ({ default: m.WireframeCity }))
);

export function Hero() {
  const animationVariants = ANIMATION_VARIANTS['bottom'];
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

      <ContainerStagger className="relative z-10 flex flex-col-reverse items-start gap-10 md:flex-row md:items-center md:justify-between">
        <MotionConfig transition={{ duration: 0.4, ease: 'easeOut' }}>
          <div className="flex max-w-2xl flex-col gap-6">
            <motion.div variants={animationVariants}>
              <Eyebrow n={1} label="ORIGEN" />
            </motion.div>

            <motion.div variants={animationVariants}>
              <GlitchHeading lines={nameLines} />
            </motion.div>

            <motion.p
              variants={animationVariants}
              className="font-mono text-[clamp(0.8rem,1.4vw,1rem)] uppercase tracking-[0.08em] text-muted-foreground"
            >
              {data.title}
            </motion.p>

            <motion.p
              variants={animationVariants}
              className="max-w-[46ch] font-mono text-[clamp(1.05rem,2vw,1.3rem)] leading-relaxed text-foreground"
            >
              {data.heroPhrase}
            </motion.p>

            <motion.div variants={animationVariants} className="flex flex-wrap gap-3 pt-2">
              <Button
                asChild
                className="animate-pulse-ring bg-primary font-mono text-xs uppercase tracking-[0.1em] text-primary-foreground hover:bg-accent"
              >
                <a href="#experiencia">Ver mi trabajo →</a>
              </Button>
              <Button variant="outline" asChild className="font-mono text-xs uppercase tracking-[0.1em]">
                <a href="#contacto">Contactarme</a>
              </Button>
            </motion.div>
          </div>

          <motion.div variants={animationVariants} className="relative shrink-0">
            <div className="absolute -inset-3 border border-border" aria-hidden="true" />
            <img
              src={perfilImg}
              alt={data.fullName}
              className="relative size-40 border border-border object-cover object-top md:size-52"
            />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap border border-border bg-background px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-faint">
              SUJETO 001
            </div>
          </motion.div>
        </MotionConfig>
      </ContainerStagger>

      <div className="relative z-10 mt-16 flex items-center gap-2.5 font-mono text-[0.68rem] tracking-[0.15em] text-faint">
        <div className="relative h-8 w-px overflow-hidden bg-border">
          <div className="absolute left-0 top-0 h-[40%] w-full animate-drip bg-accent" />
        </div>
        DESCENDER
      </div>
    </section>
  );
}
