import {
  ScrollAnimation,
  ScrollScale,
} from '@/components/systaliko-ui/blocks/scroll-animation';
import { Eyebrow } from '@/components/dossier/eyebrow';
import { data } from '@/data/data';

export function Process() {
  return (
    <section id="experiencia" className="relative z-10 mx-auto max-w-330 px-6 py-24 md:px-16">
      <div className="md:grid md:grid-cols-2 md:gap-12">
        <div data-build="ENCABEZADO" className="relative h-fit py-6 md:sticky md:top-24">
          <ScrollAnimation spacerClass="h-0" className="space-y-4 overflow-hidden md:overflow-visible">
            <Eyebrow n={4} label="LA CRÓNICA" />
            <ScrollScale inputRange={[0, 0.2]} scaleRange={[1, 1.4]} className="origin-left py-4">
              <h2 className="font-display text-[clamp(2.4rem,6vw,3.5rem)] uppercase leading-[1.02] text-foreground">
                Experiencia laboral
              </h2>
            </ScrollScale>
            <p className="max-w-[46ch] font-mono text-muted-foreground">
              Mi trayectoria profesional en desarrollo de software, docencia y consultoría TI.
            </p>
          </ScrollAnimation>
        </div>

        {/* La línea superior va en la primera fila (no en la lista) para que aparezca junto con ella y no antes. */}
        <div className="mt-12 flex flex-col md:mt-0">
          {data.experience.map((exp, index) => (
            <div
              key={exp.id}
              data-build="FILA"
              className={`grid grid-cols-[56px_1fr] gap-5 border-b border-border py-7 sm:grid-cols-[90px_1fr]${
                index === 0 ? ' border-t' : ''
              }`}
            >
              <div className="font-display text-2xl text-faint sm:text-3xl">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div>
                <div className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-accent">{exp.period}</div>
                <h3 className="mt-1.5 font-display text-lg uppercase leading-tight text-foreground sm:text-xl">
                  {exp.role} <span className="text-muted-foreground">— {exp.company}</span>
                </h3>
                <p className="mt-2.5 max-w-[56ch] font-mono text-sm leading-relaxed text-muted-foreground">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
