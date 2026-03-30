"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Separator } from "@/components/ui/separator";

const words =
  "Perdido no mar de ferramentas de IA? Todo dia surge uma nova. Você testa, não sabe por onde começar, e o processo continua manual.".split(
    " "
  );

export function Problem() {
  const ref = useScrollReveal();

  return (
    <section className="mapa-section relative" ref={ref}>
      {/* Noise texture overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      <div className="mapa-container relative z-10">
        <span className="reveal mapa-small text-mapa-accent tracking-widest uppercase mb-8 block">
          O problema
        </span>

        <p className="reveal mapa-h2 max-w-[800px] leading-snug">
          {words.map((word, i) => (
            <span
              key={i}
              className="inline-block mr-[0.3em] text-mapa-text problem-word"
              style={{
                animationDelay: `${i * 60}ms`,
              }}
            >
              {word}
            </span>
          ))}
        </p>

        <Separator className="mt-16 bg-mapa-border" />
      </div>
    </section>
  );
}
