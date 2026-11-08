import { ScrollAnimation, ScrollScale } from '@/components/systaliko-ui/blocks/scroll-animation';
import { Eyebrow } from '@/components/dossier/eyebrow';
import { useCardTilt } from '@/hooks/use-card-tilt';
import { data } from '@/data/data';

function EducationCard({ edu, index }: { edu: (typeof data.education)[number]; index: number }) {
  const { ref, onMouseMove, onMouseLeave } = useCardTilt<HTMLDivElement>();

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      data-build="TARJETA"
      className="flex flex-col gap-3 border border-border bg-background p-6 transition-[border-color] duration-300 hover:border-accent"
      style={{ transition: 'transform 0.1s ease, border-color 0.3s ease' }}
    >
      <div className="flex items-center justify-between font-mono text-[0.65rem] tracking-[0.12em] text-faint">
        <span>[ {String(index + 1).padStart(2, '0')} ]</span>
        <span className="text-accent uppercase">{edu.type}</span>
      </div>
      <h3 className="font-display text-xl uppercase leading-tight text-foreground">{edu.title}</h3>
      <p className="font-mono text-sm text-muted-foreground">{edu.institution}</p>
      <p className="font-mono text-xs uppercase tracking-[0.05em] text-faint">{edu.year}</p>
    </div>
  );
}

export function Team() {
  return (
    <section id="educacion" className="relative z-10 mx-auto max-w-330 px-6 py-24 md:px-16">
      <ScrollAnimation spacerClass="h-0">
        <div data-build="ENCABEZADO" className="w-fit max-w-full">
          <Eyebrow n={5} label="FORMACIÓN" />
          <ScrollScale inputRange={[0, 0.5]} scaleRange={[1.15, 1]} className="mt-3 origin-left">
            <h2 className="font-display text-[clamp(2.1rem,5vw,3.7rem)] uppercase leading-[1.02] text-foreground">
              Formación académica
            </h2>
          </ScrollScale>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {data.education.map((edu, index) => (
            <EducationCard key={edu.id} edu={edu} index={index} />
          ))}
        </div>
      </ScrollAnimation>
    </section>
  );
}
