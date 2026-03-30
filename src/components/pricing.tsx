"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Check } from "lucide-react";
import { WHATSAPP_URL, PAYMENT_URL } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/icons/whatsapp";

interface Feature {
  text: string;
  highlight?: boolean;
}

const features: Feature[] = [
  { text: "Mentoria individual via WhatsApp" },
  { text: "Aplicação completa do Método MAPA" },
  { text: "Automatização de 1 processo digital" },
  { text: "Suporte assíncrono 10:00–17:00" },
  { text: "Resposta em até 24h úteis" },
  { text: "100% humano respondendo", highlight: true },
  { text: "Acesso a artefatos: skills, agentes, MCPs, workflows" },
  { text: "Sem prazo — até a automação estar rodando" },
  { text: "Garantia de 7 dias" },
];

export function Pricing() {
  const ref = useScrollReveal();

  return (
    <section className="mapa-section" ref={ref}>
      <div className="mapa-container">
        <div className="text-center mb-16">
          <h2 className="reveal mapa-h2 text-mapa-text">Investimento</h2>
        </div>

        <div className="reveal max-w-md mx-auto">
          <div className="pricing-glow-wrapper" aria-hidden="false">
          <div className="pricing-glow-inner accent-glow rounded-2xl bg-mapa-surface2 p-8 lg:p-10">
            <p className="text-mapa-text-secondary text-sm font-medium uppercase tracking-wider mb-2">
              MENTORIA MAPA
            </p>
            <h3
              className="text-mapa-text font-bold mb-1"
              style={{
                fontFamily: "var(--font-syne)",
                fontSize: "clamp(36px, 5vw, 52px)",
                lineHeight: 1.1,
              }}
            >
              R$ 987
            </h3>
            <p className="text-mapa-text-hint text-sm mb-8">
              ou 12x de R$ 82
            </p>

            <ul className="space-y-3 mb-10">
              {features.map((feature, i) => (
                <li
                  key={i}
                  className={cn(
                    "flex items-start gap-3",
                    feature.highlight &&
                      "rounded-lg bg-green-500/5 border border-green-500/15 px-3 py-2 -mx-3"
                  )}
                >
                  <Check
                    className={cn(
                      "w-4 h-4 mt-0.5 shrink-0",
                      feature.highlight ? "text-green-400" : "text-mapa-accent"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[15px]",
                      feature.highlight
                        ? "text-green-400 font-medium"
                        : "text-mapa-text-secondary"
                    )}
                  >
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href={PAYMENT_URL}
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full rounded-full bg-mapa-accent hover:bg-mapa-accent-md text-white font-medium h-12 text-base transition-colors duration-300 no-underline"
              )}
            >
              Comprar agora
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full rounded-full border-mapa-border hover:border-mapa-border-hover bg-transparent text-mapa-text-secondary hover:text-mapa-text font-medium h-12 text-base transition-all duration-300 no-underline mt-3"
              )}
            >
              <WhatsAppIcon className="w-4 h-4" />
              Tirar dúvidas no WhatsApp
            </a>
          </div>
          </div>

          <p className="text-center mt-6 text-mapa-text-hint text-sm">
            Parcele em até 12x de R$82 no cartão
          </p>
        </div>
      </div>
    </section>
  );
}
