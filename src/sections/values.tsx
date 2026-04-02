import { ContainerStagger } from '@/components/systaliko-ui/blocks/container-stagger';
import { TextStaggerInview } from '@/components/systaliko-ui/text/text-stagger-inview';
import { ANIMATION_VARIANTS } from '@/components/systaliko-ui/utils/animation-variants';
import { data } from '@/data/data';
import { LayoutIcon, ServerIcon, DatabaseIcon, ContainerIcon } from 'lucide-react';
import { motion, MotionConfig } from 'motion/react';

const CATEGORY_ICONS = {
  'Frontend': LayoutIcon,
  'Backend': ServerIcon,
  'Bases de datos': DatabaseIcon,
  'DevOps & Cloud': ContainerIcon,
};

export function Values() {
  const variants = ANIMATION_VARIANTS['right'];
  return (
    <section id="habilidades" className="overflow-hidden bg-background/90 backdrop-blur-sm">
      <div className="pt-12 pb-16 px-8 lg:grid lg:grid-cols-3 space-y-8">
        <div className="space-y-4">
          <TextStaggerInview
            as="h2"
            animation="bottom"
            className="text-3xl md:text-4xl font-bold"
          >
            Stack Técnico
          </TextStaggerInview>
          <p className="text-muted-foreground leading-relaxed">
            Tecnologías y herramientas que uso para construir soluciones completas.
          </p>
        </div>
        <ContainerStagger
          className="
            col-span-2 flex flex-col md:grid grid-cols-2 md:grid-rows-[50px_1fr_50px_1fr_50px] gap-6
            *:row-span-2
            [&>*:nth-child(2)]:row-start-2
          "
        >
          <MotionConfig transition={{ duration: 0.5, ease: 'easeOut' }}>
            {data.skills.map((skill) => {
              const Icon = CATEGORY_ICONS[skill.category as keyof typeof CATEGORY_ICONS];
              return (
                <motion.div
                  key={skill.id}
                  className="py-6 px-4 space-y-4 shadow bg-card rounded-xl border place-content-center"
                  variants={variants}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <div
                    className={`size-14 flex items-center justify-center rounded bg-linear-to-br ${skill.iconBg}`}
                  >
                    {Icon && <Icon className="size-8 text-white" />}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{skill.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground font-medium border"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </MotionConfig>
        </ContainerStagger>
      </div>
    </section>
  );
}
