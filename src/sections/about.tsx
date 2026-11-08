import { TextStaggerInview } from '@/components/systaliko-ui/text/text-stagger-inview';
import { Eyebrow } from '@/components/dossier/eyebrow';
import { useTypewriter } from '@/hooks/use-typewriter';
import { data } from '@/data/data';

/**
 * Lives in its own component so the per-character state updates re-render only
 * this paragraph — not the whole section and every animated word below it.
 * The not-yet-typed remainder stays in the layout (invisible), so the box is
 * its final size from the start: no reflow each time a line wraps.
 */
function TypewriterParagraph({ text }: { text: string }) {
  const { ref, display } = useTypewriter<HTMLParagraphElement>(text);

  return (
    <p
      ref={ref}
      data-build="TEXTO"
      className="mt-7 min-h-[3.4em] max-w-155 font-mono text-[1.05rem] leading-relaxed text-muted-foreground"
    >
      {display}
      <span className="ml-0.5 inline-block h-[1em] w-2.25 translate-y-0.5 bg-accent align-text-bottom animate-blink" />
      <span className="invisible" aria-hidden="true">
        {text.slice(display.length)}
      </span>
    </p>
  );
}

export function About() {
  const restBio = data.bio.slice(1);

  return (
    <section id="sobre-mi" className="relative z-10 mx-auto max-w-330 px-6 py-24 md:px-16">
      <div data-build="ENCABEZADO" className="w-fit max-w-full">
        <Eyebrow n={2} label="TRANSMISIÓN" />
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-faint">{data.fullName}</p>
        <h2 className="mt-3 max-w-3xl font-display text-[clamp(2.4rem,6vw,4.6rem)] uppercase leading-[1.06] text-foreground">
          {data.description}
        </h2>
      </div>

      <TypewriterParagraph text={data.bio[0]} />

      <div data-build="TEXTO" className="mt-6 max-w-155 space-y-4">
        {restBio.map((phrase, index) => (
          <TextStaggerInview
            key={index}
            as="p"
            animation="bottom"
            split="word"
            staggerValue={0.04}
            className="font-mono text-base leading-relaxed text-muted-foreground *:overflow-hidden"
          >
            {phrase}
          </TextStaggerInview>
        ))}
      </div>

      <div data-build="ETIQUETAS" className="mt-8 flex flex-wrap gap-2.5">
        {data.skills.map((skill) => (
          <span
            key={skill.id}
            className="border border-border px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-muted-foreground"
          >
            {skill.category}
          </span>
        ))}
      </div>
    </section>
  );
}
