import {
  ScrollAnimation,
  ScrollScale,
} from '@/components/systaliko-ui/blocks/scroll-animation';
import { data } from '@/data/data';
import { BriefcaseIcon } from 'lucide-react';

export function Process() {
  return (
    <section id="experiencia" className="relative py-12 px-8">
      <div className="container mx-auto md:grid md:grid-cols-2 md:gap-12 justify-between">
        <div className="relative md:sticky md:top-0 md:left-0 h-fit max-h-vh py-6">
          <ScrollAnimation
            spacerClass="h-0"
            className="overflow-hidden md:overflow-visible space-y-4"
          >
            <ScrollScale
              inputRange={[0, 0.2]}
              scaleRange={[1, 1.8]}
              className="origin-left py-6 place-content-center"
            >
              <h2 className="text-6xl md:text-7xl font-bold">
                Experiencia <br /> laboral
              </h2>
            </ScrollScale>
            <p className="text-muted-foreground leading-relaxed">
              Mi trayectoria profesional en desarrollo de software, docencia y consultoría TI.
            </p>
          </ScrollAnimation>
        </div>
        <div className="flex flex-col gap-12">
          {data.experience.map((exp) => (
            <div className="flex flex-col gap-4 py-6 border-l-2 border-primary/30 pl-6" key={exp.id}>
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <BriefcaseIcon className="size-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">{exp.role}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-primary">{exp.company}</span>
                    <span className="text-sm text-muted-foreground font-medium">{exp.period}</span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
