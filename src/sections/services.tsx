import {
  CardsStackContainer,
  CardSticky,
} from '@/components/systaliko-ui/cards/cards-stack';

const SERVICES_CARDS = [
  {
    id: 'service-starategy-identity-service',
    title: 'Estrategia de Marca e Identidad',
    description:
      'Ayudamos a los equipos a descubrir una posición de marca clara y traducirla en un sistema de voz y visual conciso. Desde naming y mensajería hasta sistemas de logotipo y guías de marca.',
  },
  {
    id: 'UX-Product-design-service',
    title: 'Diseño UX y de Producto',
    description:
      'Nos enfocamos en investigación de usuarios, arquitectura de la información y flujos de producto que resuelven problemas reales. Nuestros diseños se prueban con prototipos y se guían por métricas para que lances funcionalidades que muevan los KPIs.',
  },
  {
    id: 'web-development-service',
    title: 'Desarrollo Web',
    description:
      'Construimos productos web modernos usando desarrollo basado en componentes, pruebas automatizadas y buenas prácticas centradas en el rendimiento. Nuestro código está documentado y listo para entrega.',
  },
  {
    id: 'Motion-interaction-service',
    title: 'Movimiento e Interacción',
    description:
      'El movimiento debe informar, no distraer. Diseñamos micro-interacciones y transiciones a nivel de página que guían la atención, mejoran el rendimiento percibido y hacen que los productos se sientan pulidos.',
  },
  {
    id: 'content-copywriting-service',
    title: 'Contenido y Redacción',
    description:
      'Creamos mensajes que se ajustan a tu marca y hablan a necesidades reales del usuario — desde titulares de hero y microcopia de producto hasta flujos de onboarding y secuencias de email de lanzamiento.',
  },
  {
    id: 'growth-anilytics-service',
    title: 'Crecimiento y Analítica',
    description:
      'Instrumentamos analíticas, diseñamos experimentos y ejecutamos pruebas A/B que responden las preguntas detrás del crecimiento. Construimos dashboards y recomendamos experimentos priorizados que se vinculan directamente a los objetivos de negocio.',
  },
];

export function Services() {
  return (
    <section>
      <CardsStackContainer className="min-h-[300vh] flex flex-col gap-12">
        {SERVICES_CARDS.map((service, index) => (
          <CardSticky
            key={service.id}
            index={index}
            className="min-h-[50vh] p-4 sm:p-8 md:px-12 flex flex-col md:flex-row gap-6 justify-between flex-wrap even:border bg-card odd:bg-muted"
            incrementY={80}
            incrementZ={0}
          >
            <div className="md:basis-1/3 flex items-start gap-2">
              <sup className="font-black text-muted-foreground">
                {index + 1}
              </sup>
              <h3 className="text-3xl sm:text-4xl md:text-5xl max-w-[13ch] font-bold">
                {service.title}
              </h3>
            </div>

            <p className="text-lg md:text-xl md:basis-1/2">{service.description}</p>
          </CardSticky>
        ))}
      </CardsStackContainer>
    </section>
  );
}
