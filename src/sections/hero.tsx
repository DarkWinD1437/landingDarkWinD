import { ContainerStagger } from '@/components/systaliko-ui/blocks/container-stagger';
import { motion, MotionConfig } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ANIMATION_VARIANTS } from '@/components/systaliko-ui/utils/animation-variants';

export function Hero() {
  const animationVariants = ANIMATION_VARIANTS['bottom'];
  return (
    <section className="min-h-[90vh] w-full relative place-content-center">
      <ContainerStagger className="flex flex-col text-center items-center gap-6 p-6">
        <MotionConfig transition={{ duration: 0.4, ease: 'easeOut' }}>
          <motion.div
            className="text-5xl font-extralight"
            variants={animationVariants}
          >
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl md:max-w-4/5 font-bold"
            variants={animationVariants}
          >
            Construimos marcas y productos que la gente recuerda
          </motion.h1>
          <motion.p
            variants={animationVariants}
            className="leading-normal tracking-tight text-muted-foreground max-w-[45ch]"
          >
            Creando experiencias digitales excepcionales a través de soluciones de diseño
            innovadoras. Del concepto a la creación, transformamos tu visión en realidad.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-2"
            variants={animationVariants}
          >
            <Button>Inicia tu proyecto</Button>
            <Button variant="secondary">Ver nuestro trabajo</Button>
          </motion.div>
        </MotionConfig>
      </ContainerStagger>
    </section>
  );
}
