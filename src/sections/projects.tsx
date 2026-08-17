import { ContainerStagger } from '@/components/systaliko-ui/blocks/container-stagger';
import { ANIMATION_VARIANTS } from '@/components/systaliko-ui/utils/animation-variants';
import { Eyebrow } from '@/components/dossier/eyebrow';
import { useCardTilt } from '@/hooks/use-card-tilt';
import { useLatestRelease } from '@/hooks/use-latest-release';
import { data } from '@/data/data';
import { motion, MotionConfig } from 'motion/react';
import { TerminalIcon, ExternalLinkIcon } from 'lucide-react';

function ProjectCard({ project, index }: { project: (typeof data.projects)[number]; index: number }) {
  const { ref, onMouseMove, onMouseLeave } = useCardTilt<HTMLAnchorElement>();
  const version = useLatestRelease(project.repoUrl, project.version);

  return (
    <a
      ref={ref}
      href={project.repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="group flex h-full flex-col gap-4 border border-border bg-background p-6 transition-[border-color] duration-300 hover:border-accent"
      style={{ transition: 'transform 0.1s ease, border-color 0.3s ease' }}
    >
      <div className="flex items-center justify-between font-mono text-[0.65rem] tracking-[0.12em] text-faint">
        <span>REPO-{String(index + 1).padStart(2, '0')}</span>
        <span className="flex items-center gap-1.5 text-accent">
          <TerminalIcon className="size-3.5" /> {version}
        </span>
      </div>

      <h3 className="font-display text-lg uppercase leading-tight text-foreground">{project.title}</h3>

      <p className="font-mono text-xs leading-relaxed text-muted-foreground">{project.description}</p>

      <div className="flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="border border-border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.03em] text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-1.5 truncate border-t border-border pt-3 font-mono text-[0.62rem] tracking-[0.03em] text-faint transition-colors group-hover:text-accent">
        <span className="truncate">{project.repoUrl.replace('https://', '')}</span>
        <ExternalLinkIcon className="size-3 shrink-0" aria-hidden="true" />
      </div>
    </a>
  );
}

export function Projects() {
  const variants = ANIMATION_VARIANTS['z'];

  return (
    <section id="proyectos" className="relative z-10 mx-auto max-w-330 px-6 py-24 md:px-16">
      <Eyebrow n={7} label="PROYECTOS" />
      <h2 className="mt-3 max-w-2xl font-display text-[clamp(2.1rem,5vw,3.7rem)] uppercase leading-[1.02] text-foreground">
        Fuera del horario laboral
      </h2>
      <p className="mt-4 max-w-[52ch] font-mono text-muted-foreground">
        Proyectos personales de código abierto, publicados y mantenidos en mi GitHub.
      </p>

      <ContainerStagger className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
        <MotionConfig transition={{ duration: 0.4, ease: 'easeOut' }}>
          {data.projects.map((project, index) => (
            <motion.div key={project.id} variants={variants} className="h-full">
              <ProjectCard project={project} index={index} />
            </motion.div>
          ))}
        </MotionConfig>
      </ContainerStagger>
    </section>
  );
}
