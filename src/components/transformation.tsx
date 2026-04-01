"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { X, Check } from "lucide-react";

const rows = [
  {
    before: "Testa ferramenta nova toda semana sem saber se funciona",
    after: "Sabe exatamente qual ferramenta usar para cada processo",
  },
  {
    before: "Processo depende de memória humana e planilhas",
    after: "Processo roda no automático 24/7",
  },
  {
    before: "Perde horas em tarefas repetitivas todo dia",
    after: "Tempo livre para o que realmente importa",
  },
  {
    before: "Não sabe por onde começar a automatizar",
    after: "Metodologia clara, passo a passo, com acompanhamento",
  },
  {
    before: "Depende de consultoria cara ou freelancer",
    after: "Sabe fazer sozinho (e ensinar o time)",
  },
];

export function Transformation() {
  const ref = useScrollReveal();

  return (
    <section className="mapa-section relative" ref={ref}>
      <div className="mapa-container">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="reveal mapa-small text-mapa-accent tracking-widest uppercase block mb-4">
            A transformação
          </span>
          <h2 className="reveal mapa-h2 text-mapa-text">Antes e depois</h2>
          <p className="reveal mt-4 text-mapa-text-secondary max-w-md mx-auto">
            O que muda quando você para de tentar sozinho e começa com método.
          </p>
        </div>

        {/* Desktop: tabela lado a lado */}
        <div className="reveal max-w-4xl mx-auto hidden sm:block rounded-2xl border border-mapa-border bg-mapa-surface2 overflow-hidden">
          {/* Cabeçalhos das colunas */}
          <div className="grid grid-cols-2">
            <div className="px-6 py-4 border-b border-r border-mapa-border bg-mapa-surface1/60 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <X className="w-3 h-3 text-mapa-text-tertiary" />
              </div>
              <span className="text-mapa-text-tertiary text-xs font-medium uppercase tracking-widest">
                Antes da mentoria
              </span>
            </div>
            <div className="px-6 py-4 border-b border-mapa-border bg-mapa-accent/5 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-mapa-accent/15 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-mapa-accent" />
              </div>
              <span className="text-mapa-accent text-xs font-medium uppercase tracking-widest">
                Depois da mentoria
              </span>
            </div>
          </div>

          {/* Linhas */}
          {rows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-2 border-b border-mapa-border last:border-b-0"
            >
              {/* Coluna antes */}
              <div className="px-6 py-5 border-r border-mapa-border flex items-start gap-3">
                <X className="w-4 h-4 mt-0.5 shrink-0 text-mapa-text-hint" />
                <span className="text-[14px] text-mapa-text-tertiary leading-snug">
                  {row.before}
                </span>
              </div>
              {/* Coluna depois */}
              <div className="px-6 py-5 bg-mapa-accent/[0.03] flex items-start gap-3">
                <Check className="w-4 h-4 mt-0.5 shrink-0 text-mapa-accent" />
                <span className="text-[14px] text-mapa-text leading-snug font-medium">
                  {row.after}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: stack vertical por item */}
        <div className="reveal sm:hidden space-y-4 max-w-xl mx-auto">
          {rows.map((row, i) => (
            <div
              key={i}
              className="rounded-xl border border-mapa-border overflow-hidden"
            >
              {/* Antes */}
              <div className="px-5 py-4 bg-mapa-surface1/60 flex items-start gap-3 border-b border-mapa-border">
                <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                  <X className="w-3.5 h-3.5 text-mapa-text-hint" />
                </div>
                <div>
                  <span className="block text-[11px] text-mapa-text-tertiary uppercase tracking-widest font-medium mb-1">
                    Antes
                  </span>
                  <span className="text-[13px] text-mapa-text-tertiary leading-snug">
                    {row.before}
                  </span>
                </div>
              </div>
              {/* Depois */}
              <div className="px-5 py-4 bg-mapa-accent/[0.04] flex items-start gap-3">
                <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-mapa-accent" />
                </div>
                <div>
                  <span className="block text-[11px] text-mapa-accent uppercase tracking-widest font-medium mb-1">
                    Depois
                  </span>
                  <span className="text-[13px] text-mapa-text leading-snug font-medium">
                    {row.after}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
