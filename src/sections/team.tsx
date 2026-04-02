import { ScrollAnimation, ScrollScale, ScrollTranslateY } from '@/components/systaliko-ui/blocks/scroll-animation';
import { data } from '@/data/data';
import { GraduationCapIcon } from 'lucide-react';

export function Team() {
  return (
    <section id="educacion" className="bg-background/90 backdrop-blur-sm">
      <ScrollAnimation>
        <ScrollTranslateY className="overflow-hidden min-h-svh flex flex-col justify-center items-center gap-12 px-8 py-16">
          <ScrollScale
            inputRange={[0, 0.5]}
            scaleRange={[1.3, 1]}
            className="w-10/12 flex flex-col justify-center text-center items-center mx-auto origin-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold">Formación académica</h2>
          </ScrollScale>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            {data.education.map((edu) => (
              <div
                key={edu.id}
                className="bg-card border rounded-xl p-6 space-y-4 shadow"
              >
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCapIcon className="size-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                    {edu.type}
                  </span>
                  <h3 className="text-xl font-bold">{edu.title}</h3>
                  <p className="text-muted-foreground font-medium">{edu.institution}</p>
                  <p className="text-sm text-muted-foreground">{edu.year}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollTranslateY>
      </ScrollAnimation>
    </section>
  );
}
