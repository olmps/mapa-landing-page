"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Check, X } from "lucide-react";

const isForYou = [
  "Tem um processo digital que faz manualmente e quer automatizar",
  "Trabalha com marketing, vendas, operações, RH ou financeiro",
  "Não quer depender de consultorias caras ou freelancers",
  "Quer aprender a metodologia, não comprar uma automação pronta",
  "Valoriza acompanhamento individualizado, não curso em grupo",
];

const isNotForYou = [
  "Quer alguém que faça o trabalho por você (isso é consultoria, não mentoria)",
  "Precisa automatizar sistemas bancários, governamentais ou de alta compliance",
  "Quer um curso com vídeos e módulos gravados",
  "Não tem disposição para implementar junto com a gente",
];

export function Qualify() {
  const ref = useScrollReveal();

  return (
    <section className="mapa-section" ref={ref}>
      <div className="mapa-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="reveal mapa-h2 text-mapa-text">
            Para quem é a Mentoria MAPA
          </h2>
          <p className="reveal mt-4 text-mapa-text-secondary max-w-lg mx-auto">
            Saber se é para você agora economiza tempo dos dois lados.
          </p>
        </div>

        {/* 2-column grid */}
        <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">

          {/* Coluna: É para você */}
          <div className="rounded-2xl border border-white/8 bg-mapa-surface1 overflow-hidden">
            {/* Header da coluna */}
            <div className="px-7 py-5 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-mapa-accent shrink-0" />
                <p className="text-mapa-text text-[15px] font-semibold">
                  É para você se...
                </p>
              </div>
            </div>

            {/* Itens */}
            <ul className="px-7 py-6 space-y-4">
              {isForYou.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-mapa-accent/10 border border-mapa-accent/25 flex items-center justify-center">
                    <Check className="w-3 h-3 text-mapa-accent" />
                  </div>
                  <span className="text-[14px] text-mapa-text leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna: Não é para você */}
          <div className="rounded-2xl border border-white/5 bg-mapa-surface2 overflow-hidden">
            {/* Header da coluna */}
            <div className="px-7 py-5 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-white/20 shrink-0" />
                <p className="text-mapa-text-secondary text-[15px] font-medium">
                  Não é para você se...
                </p>
              </div>
            </div>

            {/* Itens */}
            <ul className="px-7 py-6 space-y-4">
              {isNotForYou.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <X className="w-3 h-3 text-mapa-text-hint" />
                  </div>
                  <span className="text-[14px] text-mapa-text-secondary leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
