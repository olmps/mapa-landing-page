"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { ShieldCheck } from "lucide-react";

export function Guarantee() {
  const ref = useScrollReveal();

  return (
    <section className="mapa-section" ref={ref}>
      <div className="mapa-container">
        <div className="reveal max-w-2xl mx-auto rounded-2xl border border-mapa-border-hover bg-mapa-surface2 px-8 py-10 text-center relative overflow-hidden">
          {/* Glow sutil de fundo */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,85,255,0.07) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Ícone */}
            <div className="w-12 h-12 rounded-full bg-mapa-accent/10 border border-mapa-accent/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-mapa-accent" />
            </div>

            {/* Título */}
            <h2
              className="mapa-h2 text-mapa-text leading-tight"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Garantia de 7 dias
              <br />
              <span className="text-mapa-text-secondary font-normal">
                sem perguntas
              </span>
            </h2>

            {/* Texto principal */}
            <p className="text-mapa-text-secondary text-[16px] leading-relaxed max-w-xl">
              Se nos primeiros 7 dias você perceber que a mentoria não é para
              você — por qualquer motivo — devolvemos 100% do investimento. Sem
              burocracia, sem formulário. Basta mandar uma mensagem no WhatsApp.
            </p>

            {/* Divider */}
            <div className="w-16 border-t border-white/8" />

            {/* Frase de fechamento */}
            <p className="text-mapa-text-tertiary text-[14px] leading-relaxed">
              Nosso compromisso: você só paga se fizer sentido para você.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
