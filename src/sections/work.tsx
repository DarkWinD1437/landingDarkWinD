import { CardsStackContainer, CardSticky } from "@/components/systaliko-ui/cards/cards-stack";
import { TextStaggerInview } from "@/components/systaliko-ui/text/text-stagger-inview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const WORK_PROJECTS = [
    {
      id: 'work-project-3',
      title: 'BMW',
      services: ['Branding', 'Estrategia'],
      imageUrl:
      'https://images.pexels.com/photos/7585399/pexels-photo-7585399.jpeg',

    },
    {
      id: 'work-project-2',
      title: 'NBA',
      services: ['Investigación de Mercado', 'Estrategia'],
      imageUrl:
      'https://images.pexels.com/photos/1293265/pexels-photo-1293265.jpeg',
    },
    {
      id: 'work-project-1',
      title: 'ROLEX',
      services: ['Branding', 'Identidad'],
      imageUrl:
        'https://images.pexels.com/photos/364822/rolex-watch-time-luxury-364822.jpeg'
    },
  ];


export function Work() {
    return (
        <section className="py-12 px-8">
                <div className="flex justify-between gap-4 mb-8">
                    <div className="space-y-4">
                    <TextStaggerInview animation="bottom" as="h2" className="text-5xl md:text-6xl font-extrabold">Casos de estudio</TextStaggerInview>
                    <p className="text-muted-foreground max-w-[45ch] text-sm">
                        Diseñamos y construimos productos digitales que combinan claridad de marca, UX centrada en el usuario e ingeniería frontend rápida.
                    </p>

                    </div>
                    <Button variant={'secondary'}>
                        Explorar todos los casos
                    </Button>
                </div>

                <CardsStackContainer className="min-h-[300vh] flex flex-col items-center gap-16">
                {WORK_PROJECTS.map((project, index) => (
                  <CardSticky
                    key={project.id}
                    index={index}
                    incrementY={10}
                    incrementZ={10}
                    className="md:w-4/5 mx-auto bg-card border"
                  >

                  <div className="max-h-[80vh] aspect-video">
                  <img
                    className="w-full max-h-full"
                    src={project.imageUrl}
                    alt={project.title}
                  />
                  </div>
                      <div className="flex flex-wrap items-center justify-between gap-4 p-6">
                      <h2 className="text-4xl font-bold">
                        {project.title}
                      </h2>
                      <div className="flex flex-wrap gap-1">
                        {project.services.map((service) => (
                          <Badge variant={'outline'} key={service}>
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardSticky>
                ))}
      </CardsStackContainer>
        </section>
    )
}
