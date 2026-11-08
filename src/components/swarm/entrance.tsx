import type { ReactNode } from 'react';
import { motion, MotionConfig } from 'motion/react';
import { ContainerStagger } from '@/components/systaliko-ui/blocks/container-stagger';
import { ANIMATION_VARIANTS, type AnimationT } from '@/components/systaliko-ui/utils/animation-variants';
import { entranceAnimationsActive } from './config';

/**
 * Las animaciones de entrada originales de la página, con interruptor.
 *
 * Con el cardumen ENCENDIDO se renderizan como elementos simples (el cardumen
 * construye el contenido). Con él APAGADO son los envoltorios originales
 * `ContainerStagger` / `motion`, así que basta cambiar el interruptor de
 * `config.ts` para recuperar el comportamiento anterior. La forma del DOM es
 * idéntica en ambos modos.
 */

interface BaseProps {
  className?: string;
  children?: ReactNode;
}

/** Contenedor con retardo escalonado — original: `ContainerStagger` + `MotionConfig`. */
export function EntranceGroup({ className, children }: BaseProps) {
  if (!entranceAnimationsActive()) return <div className={className}>{children}</div>;
  return (
    <ContainerStagger className={className}>
      <MotionConfig transition={{ duration: 0.4, ease: 'easeOut' }}>{children}</MotionConfig>
    </ContainerStagger>
  );
}

const MOTION_ITEMS = { div: motion.div, p: motion.p };

interface ItemProps extends BaseProps {
  as?: 'div' | 'p';
  variants?: AnimationT;
}

/** Un hijo escalonado — original: `motion.div` / `motion.p` con una variante. */
export function EntranceItem({ as = 'div', variants = 'bottom', className, children }: ItemProps) {
  if (!entranceAnimationsActive()) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  const Motion = MOTION_ITEMS[as];
  return (
    <Motion variants={ANIMATION_VARIANTS[variants]} className={className}>
      {children}
    </Motion>
  );
}

/** Aparece subiendo al entrar en vista — original: un `motion.div` con `whileInView`. */
export function EntranceFade({ className, children }: BaseProps) {
  if (!entranceAnimationsActive()) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
