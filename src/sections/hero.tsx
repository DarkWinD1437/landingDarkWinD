import { ContainerStagger } from '@/components/systaliko-ui/blocks/container-stagger';
import { motion, MotionConfig } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ANIMATION_VARIANTS } from '@/components/systaliko-ui/utils/animation-variants';
import { data } from '@/data/data';
import perfilImg from '@/assets/perfil.jpg';

export function Hero() {
  const animationVariants = ANIMATION_VARIANTS['bottom'];
  return (
    <section id="inicio" className="min-h-[90vh] w-full relative place-content-center">
      <ContainerStagger className="flex flex-col text-center items-center gap-6 p-6">
        <MotionConfig transition={{ duration: 0.4, ease: 'easeOut' }}>
          <motion.div variants={animationVariants}>
            <img
              src={perfilImg}
              alt={data.fullName}
              className="size-28 md:size-36 rounded-full object-cover object-top border-4 border-primary/30 shadow-lg"
            />
          </motion.div>

          <motion.div
            className="space-y-1"
            variants={animationVariants}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              {data.name}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide">
              {data.title}
            </p>
          </motion.div>

          <motion.p
            variants={animationVariants}
            className="text-xl md:text-2xl font-medium italic text-primary max-w-[32ch]"
          >
            "{data.heroPhrase}"
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-2"
            variants={animationVariants}
          >
            <Button asChild>
              <a href="#experiencia">Ver mi trabajo</a>
            </Button>
            <Button variant="secondary" asChild>
              <a href="#contacto">Contactarme</a>
            </Button>
          </motion.div>
        </MotionConfig>
      </ContainerStagger>
    </section>
  );
}
