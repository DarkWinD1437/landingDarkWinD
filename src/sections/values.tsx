import { ContainerStagger } from '@/components/systaliko-ui/blocks/container-stagger';
import { TextStaggerInview } from '@/components/systaliko-ui/text/text-stagger-inview';
import { ANIMATION_VARIANTS } from '@/components/systaliko-ui/utils/animation-variants';
import { Button } from '@/components/ui/button';
import { Axis3dIcon, Building2Icon, ListStartIcon } from 'lucide-react';
import { motion, MotionConfig } from 'motion/react';

const VALUES = [
  {
    id: 'value-craft',
    title: 'Impulsados por el oficio',
    icon: Axis3dIcon,
    iconBg: 'from-indigo-600 to-indigo-500 ',
    description:
      'Diseñamos con precisión, no con una plantilla. Construimos productos web modernos usando desarrollo basado en componentes, pruebas automatizadas y buenas prácticas centradas en el rendimiento. Nuestro código está documentado y listo para entrega.',
  },
  {
    id: 'value-startegy',
    title: 'Estrategia primero',
    icon: ListStartIcon,
    iconBg: ' from-pink-600 to-pink-500 ',
    description:
      'Comenzamos con una estrategia clara y construimos un producto que resuelve problemas reales. Nos enfocamos en investigación de usuarios, arquitectura de la información y flujos de producto que abordan necesidades concretas.',
  },
  {
    id: 'value-business',
    title: 'Mentalidad de negocio',
    icon: Building2Icon,
    iconBg: 'from-emerald-600 to-emerald-500 ',
    description:
      'Entendemos el negocio y sus necesidades. Creamos mensajes que se ajustan a tu marca y hablan a necesidades reales del usuario — desde titulares de hero y microcopia de producto hasta flujos de onboarding y secuencias de email de lanzamiento.',
  },
];

export function Values() {
  const variants = ANIMATION_VARIANTS['right'];
  return (
    <section className="overflow-hidden">
      <div className="pt-12 pb-16 px-8 lg:grid lg:grid-cols-3 space-y-8">
        <div className="space-y-4">
          <TextStaggerInview
            as="h2"
            animation="bottom"
            className="text-3xl md:text-4xl font-bold"
          >
            Marcas audaces, productos hermosos para un crecimiento real
          </TextStaggerInview>
          <Button variant={'link'}>Solicitar demo</Button>
        </div>
        <ContainerStagger
          className="
            col-span-2 flex flex-col md:grid grid-cols-2 md:grid-rows-[50px_1fr_50px_1fr_50px] gap-6
            [&>*]:row-span-2
            [&>*:nth-child(2)]:row-start-2
        "
        >
          <MotionConfig transition={{ duration: 0.5, ease: 'easeOut' }}>
            {VALUES.map((value) => (
              <motion.div
                key={value.id}
                className="py-6 px-4 space-y-4 shadow bg-card rounded-xl border place-content-center"
                variants={variants}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div
                  className={`size-14 flex items-center justify-center -bg-linear-45 rounded ${value.iconBg}`}
                >
                  <value.icon className="size-8 text-muted" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{value.title}</h3>
                </div>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </MotionConfig>
        </ContainerStagger>
      </div>
    </section>
  );
}
