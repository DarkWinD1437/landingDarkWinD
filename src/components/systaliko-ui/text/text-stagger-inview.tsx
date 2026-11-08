import * as React from 'react';

import {
  type HTMLMotionProps,
  motion,
  MotionConfig,
  stagger,
  type StaggerOrigin,
} from 'motion/react';
import { ANIMATION_VARIANTS, type AnimationT } from '../utils/animation-variants';
interface WordProps extends React.HTMLAttributes<HTMLSpanElement> {
  animation?: AnimationT;
  /** `char` animates every letter, `word` animates whole words (≈6× fewer nodes). */
  split?: 'char' | 'word';
}

export function WordStagger({
  children,
  animation = 'default',
  split = 'char',
  ...props
}: WordProps) {
  const text = String(children);
  const animationVariants = ANIMATION_VARIANTS[animation];
  const pieces = split === 'word' ? [text] : text.split('');
  return (
    <span className="inline-block text-nowrap" {...props}>
      {pieces.map((piece, index) => (
        <motion.span
          className="inline-block"
          variants={animationVariants}
          key={`${piece}-${index}`}
        >
          {piece}
        </motion.span>
      ))}
    </span>
  );
}

// Wrapper components are created once, at module scope. `motion.create()` returns
// a brand-new component type on every call, so calling it during render made
// React unmount and remount the entire animated subtree on *every* re-render.
type MotionTag = 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4';

// Typed through `span` props: the tags only differ in their DOM element type.
const MOTION_TAGS = {
  span: motion.span,
  p: motion.p,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
} as unknown as Record<MotionTag, React.ComponentType<HTMLMotionProps<'span'>>>;

interface TextStaggerProps extends HTMLMotionProps<'span'> {
  staggerValue?: number;
  staggerStart?: StaggerOrigin;
  animation?: AnimationT;
  split?: 'char' | 'word';
  as?: MotionTag;
}

export function TextStaggerInview({
  children,
  transition,
  className,
  viewport = { once: true, amount: 0.25 },
  staggerValue = 0.02,
  staggerStart = 'first',
  animation,
  split,
  as = 'span',
  ...props
}: TextStaggerProps) {
  const words = String(children).split(' ');
  const MotionComponent = MOTION_TAGS[as];
  return (
    <MotionComponent
      initial="hidden"
      whileInView={'visible'}
      viewport={viewport}
      className={className}
      transition={{
        delayChildren: stagger(staggerValue, { from: staggerStart }),
      }}
      {...props}
    >
      <MotionConfig
        transition={{
          ease: transition?.ease || 'easeOut',
          ...transition,
        }}
      >
        {words.map((word, index) => (
          <React.Fragment key={`${word}-${index}`}>
            <WordStagger animation={animation} split={split}>
              {word}
            </WordStagger>
            {index < words.length - 1 && ' '}
          </React.Fragment>
        ))}
      </MotionConfig>
    </MotionComponent>
  );
}
