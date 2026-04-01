"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Map, Search, Rocket, TrendingUp, type LucideIcon } from "lucide-react";

interface Step {
  letter: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

const steps: Step[] = [
  {
    letter: "M",
    name: "Mapear",
    description:
      "Junto com nosso time, você identifica o processo que quer automatizar e mapeia cada etapa.",
    icon: Map,
  },
  {
    letter: "A",
    name: "Analisar",
    description:
      "Analisamos juntos quais ferramentas e abordagens fazem sentido pro seu caso específico.",
    icon: Search,
  },
  {
    letter: "P",
    name: "Produzir",
    description:
      "Você implementa a automação com suporte direto via WhatsApp — sem ficar travado.",
    icon: Rocket,
  },
  {
    letter: "A",
    name: "Aprimorar",
    description:
      "Acompanhamos os resultados e ajustamos até o processo rodar no automático.",
    icon: TrendingUp,
  },
];

export function Method() {
  const ref = useScrollReveal();

  return (
    <section id="method" className="mapa-section relative" ref={ref}>
      {/* Subtle grid/dot pattern */}
      <div className="grid-pattern" aria-hidden="true" />

      <div className="mapa-container relative z-10">
        <div className="text-center mb-16">
          <h2 className="reveal mapa-h2 text-mapa-text">Método MAPA</h2>
          <p className="reveal mt-4 text-mapa-text-secondary max-w-md mx-auto">
            4 etapas para sair da ideia à automação na prática
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className="reveal card-glow rounded-xl border border-mapa-border bg-mapa-surface2 p-6 lg:p-8 transition-all duration-500"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-mapa-accent/10 text-mapa-accent">
                  <step.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="mapa-small text-[#707080]">
                    Etapa {i + 1}
                  </span>
                  <h3 className="mapa-h3 text-mapa-text flex items-center gap-2">
                    <span className="text-mapa-accent font-bold">
                      {step.letter}
                    </span>
                    {step.name}
                  </h3>
                </div>
              </div>
              <p className="text-[#b0b0bc] text-[15px] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
