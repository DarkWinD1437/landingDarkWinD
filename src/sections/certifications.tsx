import { ContainerStagger } from '@/components/systaliko-ui/blocks/container-stagger';
import { ANIMATION_VARIANTS } from '@/components/systaliko-ui/utils/animation-variants';
import { Eyebrow } from '@/components/dossier/eyebrow';
import { useCardTilt } from '@/hooks/use-card-tilt';
import { data } from '@/data/data';
import { motion, MotionConfig } from 'motion/react';
import { BadgeCheckIcon, ExternalLinkIcon } from 'lucide-react';

function CertificationCard({ cert, index }: { cert: (typeof data.certifications)[number]; index: number }) {
  const { ref, onMouseMove, onMouseLeave } = useCardTilt<HTMLAnchorElement>();

  return (
    <a
      ref={ref}
      href={cert.verifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="group flex h-full flex-col gap-4 border border-border bg-background p-6 transition-[border-color] duration-300 hover:border-accent"
      style={{ transition: 'transform 0.1s ease, border-color 0.3s ease' }}
    >
      <div className="flex items-center justify-between font-mono text-[0.65rem] tracking-[0.12em] text-faint">
        <span>REG. CERT-{String(index + 1).padStart(2, '0')}</span>
        <span className="flex items-center gap-1.5 text-accent">
          <BadgeCheckIcon className="size-3.5" /> VERIFICADO
        </span>
      </div>

      <h3 className="font-display text-lg uppercase leading-tight text-foreground">{cert.title}</h3>

      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs text-muted-foreground">
        <span>{cert.issuer}</span>
        <span className="text-faint">•</span>
        <span>{cert.date}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {cert.skills.map((skill) => (
          <span
            key={skill}
            className="border border-border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.03em] text-muted-foreground"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-1.5 truncate border-t border-border pt-3 font-mono text-[0.62rem] tracking-[0.03em] text-faint transition-colors group-hover:text-accent">
        <span className="truncate">ID: {cert.credentialId}</span>
        <ExternalLinkIcon className="size-3 shrink-0" aria-hidden="true" />
      </div>
    </a>
  );
}

export function Certifications() {
  const variants = ANIMATION_VARIANTS['z'];

  return (
    <section id="certificaciones" className="relative z-10 mx-auto max-w-330 px-6 py-24 md:px-16">
      <Eyebrow n={6} label="CERTIFICACIONES" />
      <h2 className="mt-3 max-w-2xl font-display text-[clamp(2.1rem,5vw,3.7rem)] uppercase leading-[1.02] text-foreground">
        Itinerarios completados
      </h2>
      <p className="mt-4 max-w-[52ch] font-mono text-muted-foreground">
        Certificaciones profesionales de Microsoft y LinkedIn Learning, verificables por ID de credencial.
      </p>

      <ContainerStagger className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
        <MotionConfig transition={{ duration: 0.4, ease: 'easeOut' }}>
          {data.certifications.map((cert, index) => (
            <motion.div key={cert.id} variants={variants} className="h-full">
              <CertificationCard cert={cert} index={index} />
            </motion.div>
          ))}
        </MotionConfig>
      </ContainerStagger>
    </section>
  );
}
