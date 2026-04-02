import { TextStaggerInview } from '@/components/systaliko-ui/text/text-stagger-inview';
import { Badge } from '@/components/ui/badge';
import { data } from '@/data/data';

export function About() {
  return (
    <section id="sobre-mi" className="py-16 px-8 min-h-screen place-content-center">
      <div className="flex flex-col space-y-6 justify-center items-center max-w-3xl mx-auto text-center">
        <Badge className="py-2 px-4" variant="secondary">
          Sobre mí ✨
        </Badge>
        <TextStaggerInview
          as="h2"
          animation="bottom"
          className="text-3xl md:text-4xl *:overflow-hidden font-bold"
        >
          {data.fullName}
        </TextStaggerInview>
        <div className="space-y-4">
          {data.bio.map((phrase, index) => (
            <TextStaggerInview
              key={index}
              animation="bottom"
              staggerValue={0.01}
              className="text-xl md:text-2xl *:overflow-hidden font-medium leading-relaxed text-muted-foreground"
            >
              {phrase}
            </TextStaggerInview>
          ))}
        </div>
      </div>
    </section>
  );
}
