import { AnimatePresence, motion, type Variants } from 'motion/react';
import { useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlitchDialogProps {
  open: boolean;
  variant: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
}

const TIMES = [0, 0.12, 0.28, 0.44, 0.6, 0.8, 1];

const panelVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    clipPath: [
      'inset(48% 0 46% 0)',
      'inset(6% 0 66% 0)',
      'inset(60% 0 4% 0)',
      'inset(15% 0 50% 0)',
      'inset(40% 0 20% 0)',
      'inset(8% 0 55% 0)',
      'inset(0% 0 0%)',
    ],
    x: [0, -10, 8, -6, 4, -2, 0],
    boxShadow: [
      '0 0 0 0 transparent',
      '5px 0 0 0 oklch(0.62 0.19 200 / 0.55), -5px 0 0 0 oklch(0.62 0.19 26 / 0.55)',
      '-4px 0 0 0 oklch(0.62 0.19 200 / 0.5), 4px 0 0 0 oklch(0.62 0.19 26 / 0.5)',
      '4px 0 0 0 oklch(0.62 0.19 200 / 0.4), -4px 0 0 0 oklch(0.62 0.19 26 / 0.4)',
      '-3px 0 0 0 oklch(0.62 0.19 200 / 0.3), 3px 0 0 0 oklch(0.62 0.19 26 / 0.3)',
      '2px 0 0 0 oklch(0.62 0.19 200 / 0.15), -2px 0 0 0 oklch(0.62 0.19 26 / 0.15)',
      '0 0 0 0 transparent',
    ],
    transition: { duration: 1, times: TIMES, ease: 'easeOut' },
  },
  exit: {
    clipPath: [
      'inset(0% 0 0%)',
      'inset(10% 0 58% 0)',
      'inset(45% 0 15% 0)',
      'inset(20% 0 48% 0)',
      'inset(62% 0 6% 0)',
      'inset(25% 0 50% 0)',
      'inset(50% 0 48% 0)',
    ],
    x: [0, 6, -8, 5, -6, 7, 0],
    boxShadow: [
      '0 0 0 0 transparent',
      '-5px 0 0 0 oklch(0.62 0.19 200 / 0.55), 5px 0 0 0 oklch(0.62 0.19 26 / 0.55)',
      '4px 0 0 0 oklch(0.62 0.19 200 / 0.5), -4px 0 0 0 oklch(0.62 0.19 26 / 0.5)',
      '-4px 0 0 0 oklch(0.62 0.19 200 / 0.4), 4px 0 0 0 oklch(0.62 0.19 26 / 0.4)',
      '3px 0 0 0 oklch(0.62 0.19 200 / 0.3), -3px 0 0 0 oklch(0.62 0.19 26 / 0.3)',
      '-2px 0 0 0 oklch(0.62 0.19 200 / 0.15), 2px 0 0 0 oklch(0.62 0.19 26 / 0.15)',
      '0 0 0 0 transparent',
    ],
    opacity: [1, 1, 1, 1, 1, 1, 0],
    transition: { duration: 0.85, times: TIMES, ease: 'easeIn' },
  },
};

export function GlitchDialog({ open, variant, title, message, onClose }: GlitchDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const accentClass = variant === 'success' ? 'text-accent' : 'text-primary';
  const dotClass = variant === 'success' ? 'bg-accent' : 'bg-primary';
  const Icon = variant === 'success' ? CheckCircle2 : XCircle;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-300 flex items-center justify-center p-6"
          initial="hidden"
          animate="visible"
          exit="exit"
          role="alertdialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            variants={panelVariants}
            className="relative w-full max-w-md overflow-hidden border border-border bg-background p-8"
            style={{ willChange: 'clip-path, transform' }}
          >
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to bottom, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)',
              }}
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
              aria-hidden="true"
            />

            <div className="relative flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.16em]">
              <span className={cn('size-2', dotClass, 'animate-blink')} aria-hidden="true" />
              <span className={accentClass}>
                {variant === 'success' ? 'TRANSMISIÓN ACEPTADA' : 'ERROR DE TRANSMISIÓN'}
              </span>
            </div>

            <div className="relative mt-5 flex items-start gap-3">
              <Icon className={cn('mt-1 size-6 shrink-0', accentClass)} aria-hidden="true" />
              <div>
                <h3 className="font-display text-xl uppercase leading-tight text-foreground">{title}</h3>
                <p className="mt-2 font-mono text-sm leading-relaxed text-muted-foreground">{message}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="relative mt-7 w-full border border-border py-2.5 font-mono text-xs uppercase tracking-[0.1em] text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              Cerrar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
