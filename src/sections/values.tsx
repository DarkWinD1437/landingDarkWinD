import { ContainerStagger } from '@/components/systaliko-ui/blocks/container-stagger';
import { Eyebrow } from '@/components/dossier/eyebrow';
import { ANIMATION_VARIANTS } from '@/components/systaliko-ui/utils/animation-variants';
import { useCardTilt } from '@/hooks/use-card-tilt';
import { data } from '@/data/data';
import { LayoutIcon, ServerIcon, DatabaseIcon, ContainerIcon, type LucideIcon } from 'lucide-react';
import { motion, MotionConfig } from 'motion/react';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'Frontend': LayoutIcon,
  'Backend': ServerIcon,
  'Bases de datos': DatabaseIcon,
  'DevOps & Cloud': ContainerIcon,
};

function SkillCard({ skill, index }: { skill: (typeof data.skills)[number]; index: number }) {
  const tilt = useCardTilt<HTMLDivElement>();
  const Icon = CATEGORY_ICONS[skill.category];

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="flex h-full flex-col gap-4 border border-border bg-background p-6 transition-[border-color] duration-300 hover:border-accent"
      style={{ transition: 'transform 0.1s ease, border-color 0.3s ease' }}
    >
      <div className="flex items-center justify-between font-mono text-[0.65rem] tracking-[0.12em] text-faint">
        <span>[ {String(index + 1).padStart(2, '0')} ]</span>
        <span className="text-accent">ACTIVO</span>
      </div>

      <div className="flex size-12 items-center justify-center border border-border">
        {Icon && <Icon className="size-6 text-accent" />}
      </div>

      <h3 className="font-display text-xl uppercase leading-none text-foreground">{skill.category}</h3>

      <div className="mt-auto flex flex-wrap gap-2">
        {skill.items.map((item) => (
          <span
            key={item}
            className="border border-border px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.03em] text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Values() {
  const variants = ANIMATION_VARIANTS['right'];
  return (
    <section id="habilidades" className="relative z-10 mx-auto max-w-[1320px] px-6 py-24 md:px-16">
      <Eyebrow n={3} label="EL ARSENAL" />
      <h2 className="mt-3 max-w-2xl font-display text-[clamp(2.1rem,5vw,3.7rem)] uppercase leading-[1.02] text-foreground">
        Stack técnico
      </h2>
      <p className="mt-4 max-w-[52ch] font-mono text-muted-foreground">
        Tecnologías y herramientas que uso para construir soluciones completas.
      </p>

      <ContainerStagger className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <MotionConfig transition={{ duration: 0.4, ease: 'easeOut' }}>
          {data.skills.map((skill, index) => (
            <motion.div key={skill.id} variants={variants} className="h-full">
              <SkillCard skill={skill} index={index} />
            </motion.div>
          ))}
        </MotionConfig>
      </ContainerStagger>
    </section>
  );
}
