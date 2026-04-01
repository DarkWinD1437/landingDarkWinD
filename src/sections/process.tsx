import {
  ScrollAnimation,
  ScrollScale,
} from '@/components/systaliko-ui/blocks/scroll-animation';
import { Button } from '@/components/ui/button';

const PROCESS_PHASES = [
  {
    id: 'phase-1',
    title: 'Descubrir',
    duration: 'Semana 1',
    description:
      'Nuestro viaje comienza con una inmersión profunda en tu visión. En la fase de Descubrimiento, entablamos conversaciones significativas para comprender tu identidad de marca, tus objetivos y la esencia que quieres transmitir. Esta fase establece las bases de todo lo que sigue.',
  },
  {
    id: 'phase-2',
    title: 'Diseñar',
    duration: 'Semanas 2-4',
    description:
      'En la fase de Diseño, trabajamos juntos para crear una estrategia de marca integral que se alinee con tus objetivos y visión. Esto incluye definir tu voz de marca, mensajería e identidad visual, así como desarrollar una guía de estilo de marca.',
  },
  {
    id: 'phase-3',
    title: 'Construir',
    duration: 'Semanas 5-8',
    description:
      'En la fase de Construcción, desarrollamos la presencia digital de tu marca, incluyendo tu sitio web, cuentas de redes sociales y materiales de marketing. Esto incluye crear una estrategia de contenido, desarrollar una experiencia de usuario y optimizar tu sitio web para motores de búsqueda.',
  },
  {
    id: 'phase-4',
    title: 'Crecer',
    duration: 'Continuo',
    description:
      'En la fase de Crecimiento, continuamos construyendo sobre la presencia digital de tu marca, monitoreando y ajustando tu estrategia según sea necesario. Esto incluye recopilar retroalimentación, analizar datos y tomar decisiones basadas en datos para mejorar tu marca con el tiempo.',
  },
];

export function Process() {
  return (
    <section className="relative py-12 px-8">
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
                Cómo <br /> trabajamos
              </h2>
            </ScrollScale>
            <Button variant={'secondary'}>Inicia tu proyecto</Button>
          </ScrollAnimation>
        </div>
        <div className="flex flex-col gap-12">
          {PROCESS_PHASES.map((phase) => (
            <div className="flex flex-col gap-6" key={phase.id}>
              <div className="flex ">
                <h3 className="text-4xl font-bold mr-2">{phase.title}</h3>
                <span className="font-black text-muted-foreground">
                  {phase.duration}
                </span>
              </div>
              <p className="">{phase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
