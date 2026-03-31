"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Check } from "lucide-react";
import { WHATSAPP_URL, PAYMENT_URL, PRODUCT_PRICE, PIX_PRICE } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { VAGAS_TOTAL } from "@/lib/edge-config";

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

const installmentValue = Math.ceil((PRODUCT_PRICE / 12) * 100) / 100;

interface PricingProps {
  vagasRestantes?: number;
}

export function Pricing({ vagasRestantes = VAGAS_TOTAL }: PricingProps) {
  const ref = useScrollReveal();
  const esgotado = vagasRestantes === 0;

  return (
    <section className="mapa-section" ref={ref}>
      <div className="mapa-container">
        <div className="text-center mb-16">
          <h2 className="reveal mapa-h2 text-mapa-text">Investimento</h2>
        </div>

        <div className="reveal max-w-md mx-auto">
          <div className="pricing-glow-wrapper" aria-hidden="false">
            <div className="pricing-glow-inner accent-glow rounded-2xl bg-mapa-surface2 p-8 lg:p-10">
              <p className="text-mapa-text-secondary text-sm font-medium uppercase tracking-wider mb-4">
                MENTORIA MAPA
              </p>

              {/* Vagas badge */}
              {esgotado ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#555565]" />
                  <span className="text-[#888898] text-sm font-medium">
                    Vagas esgotadas para esta turma
                  </span>
                </div>
              ) : vagasRestantes <= 5 ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,85,255,0.2)] bg-[rgba(0,85,255,0.05)] px-3 py-1.5 mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#0055FF]" />
                  <span className="text-[#EEEEF0] text-sm font-medium">
                    Restam apenas{" "}
                    <span
                      className="font-semibold"
                      style={{ fontFamily: "var(--font-fira-code)" }}
                    >
                      {vagasRestantes}
                    </span>{" "}
                    vagas 🔥
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,85,255,0.2)] bg-[rgba(0,85,255,0.05)] px-3 py-1.5 mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#0055FF]" />
                  <span className="text-sm font-medium">
                    <span className="text-[#EEEEF0]">Apenas{" "}
                      <span
                        className="font-semibold"
                        style={{ fontFamily: "var(--font-fira-code)" }}
                      >
                        {VAGAS_TOTAL}
                      </span>
                    </span>{" "}
                    <span className="text-[#888898]">vagas por turma</span>
                  </span>
                </div>
              )}

              {/* Installment price — PRIMARY highlight */}
              <div className="mb-2">
                <span
                  className="text-mapa-accent font-bold"
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontSize: "clamp(20px, 3vw, 26px)",
                    lineHeight: 1.2,
                  }}
                >
                  12x de
                </span>
                <span
                  className="text-mapa-text font-bold ml-2"
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontSize: "clamp(40px, 6vw, 56px)",
                    lineHeight: 1.1,
                  }}
                >
                  R${installmentValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Full price — secondary */}
              <p className="text-mapa-text-tertiary text-sm mb-2">
                ou R${PRODUCT_PRICE.toLocaleString("pt-BR")} à vista no cartão
              </p>

              {/* Pix price — green highlight */}
              <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-3 py-1.5 mb-8">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-green-400 text-sm font-medium">
                  R${PIX_PRICE.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} no Pix (5% off)
                </span>
              </div>

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

              {esgotado ? (
                <>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "w-full rounded-full bg-mapa-accent hover:bg-mapa-accent-md text-white font-medium h-12 text-base transition-colors duration-300 no-underline"
                    )}
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    Entrar na lista de espera
                  </a>
                  <p className="text-center mt-4 text-mapa-text-tertiary text-sm">
                    Vagas esgotadas — entre na lista para a próxima turma.
                  </p>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>

          <p className="text-center mt-6 text-mapa-text-hint text-sm">
            Parcele em até 12x no cartão · 5% off no Pix
          </p>
        </div>
      </div>
    </section>
  );
}
