"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Check, ShieldCheck } from "lucide-react";
import { WHATSAPP_URL, PAYMENT_URL, PRODUCT_PRICE, PIX_PRICE } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { VAGAS_TOTAL } from "@/lib/edge-config";
import { posthog } from "@/lib/posthog";

const installmentValue = Math.ceil((PRODUCT_PRICE / 12) * 100) / 100;
// Formata sem toLocaleString para evitar hydration mismatch
const installmentFormatted = installmentValue.toFixed(2).replace(".", ",");
const pixFormatted = PIX_PRICE.toFixed(2).replace(".", ",");

interface PricingProps {
  vagasRestantes?: number;
}

export function Pricing({ vagasRestantes = VAGAS_TOTAL }: PricingProps) {
  const ref = useScrollReveal();
  const esgotado = vagasRestantes === 0;

  return (
    <section id="investimento" className="mapa-section scroll-mt-24" ref={ref}>
      <div className="mapa-container">
        <div className="text-center mb-16">
          <h2 className="reveal mapa-h2 text-mapa-text">Investimento</h2>
        </div>

        <div className="reveal max-w-md mx-auto">
          {/* Ancoragem de preço */}
          <p className="text-center text-mapa-text-hint text-[14px] leading-relaxed mb-6 px-2">
            Uma consultoria de automação cobra R$3.000–12.000 por projeto. Na mentoria MAPA, você aprende a fazer — e o conhecimento fica para sempre.
          </p>

          <div className="pricing-glow-wrapper" aria-hidden="false">
            <div className="pricing-glow-inner accent-glow rounded-2xl bg-mapa-surface2 overflow-hidden">

              {/* Badge de vagas — topo, discreto */}
              <div className="px-8 pt-6 pb-0">
                {esgotado ? (
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/3 px-2.5 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-mapa-text-tertiary" />
                    <span className="text-mapa-text-tertiary text-xs font-medium tracking-wide">
                      Vagas esgotadas
                    </span>
                  </div>
                ) : vagasRestantes <= 5 ? (
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-mapa-accent/20 bg-mapa-accent/5 px-2.5 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-mapa-accent" />
                    <span className="text-mapa-text-secondary text-xs font-medium">
                      Restam{" "}
                      <span
                        className="text-mapa-text font-semibold"
                        style={{ fontFamily: "var(--font-fira-code)" }}
                      >
                        {vagasRestantes}
                      </span>{" "}
                      vagas
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/3 px-2.5 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-mapa-text-tertiary" />
                    <span className="text-mapa-text-tertiary text-xs font-medium tracking-wide">
                      <span
                        style={{ fontFamily: "var(--font-fira-code)" }}
                      >
                        {VAGAS_TOTAL}
                      </span>{" "}
                      vagas por turma
                    </span>
                  </div>
                )}
              </div>

              {/* Zona de preço — hero do card */}
              <div className="px-8 pt-6 pb-7">
                <p className="text-mapa-text-secondary text-xs font-medium uppercase tracking-widest mb-4">
                  Mentoria MAPA
                </p>

                <div className="flex flex-col gap-1">
                  <span className="text-mapa-text-tertiary text-sm font-medium">
                    12x de
                  </span>
                  <span
                    className="text-mapa-text font-bold leading-none"
                    style={{
                      fontFamily: "var(--font-syne)",
                      fontSize: "clamp(44px, 8vw, 56px)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    R${installmentFormatted}
                  </span>
                </div>

                {/* Pix como pill discreto */}
                <div className="inline-flex items-center gap-2 mt-4 rounded-full border border-white/10 bg-white/4 px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-mapa-text-secondary" />
                  <span className="text-mapa-text-secondary text-sm">
                    ou{" "}
                    <span className="text-mapa-text font-medium">
                      R${pixFormatted}
                    </span>{" "}
                    no Pix
                    <span className="ml-1.5 text-xs text-mapa-text-tertiary">5% off</span>
                  </span>
                </div>
                {/* Nota do café */}
                <p className="text-mapa-text-hint text-[12px] mt-3 italic">
                  R$5,55/dia — menos que um café espresso em qualquer cafeteria do Brasil.
                </p>
              </div>

              {/* Divider */}
              <div className="mx-8 border-t border-white/5" />

              {/* Features — organizadas em 3 blocos */}
              <div className="px-8 py-7 space-y-7">

                {/* Bloco 1 — Entregáveis */}
                <div>
                  <p className="text-mapa-text-tertiary text-xs font-medium uppercase tracking-widest mb-3">
                    O que você recebe
                  </p>
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-3">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-mapa-accent" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[15px] text-mapa-text font-medium leading-snug">
                          Consultoria de 1h com o founder da Olympus
                        </span>
                        <span className="inline-flex items-center w-fit rounded-full border border-mapa-accent/20 bg-mapa-accent/8 px-2 py-0.5 text-[11px] text-mapa-accent font-medium tracking-wide mt-1">
                          Diferencial exclusivo
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-mapa-accent" />
                      <span className="text-[15px] text-mapa-text leading-snug">
                        Aplicação completa do Método MAPA
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-mapa-accent" />
                      <span className="text-[15px] text-mapa-text leading-snug">
                        Automatização de 1 processo digital
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Bloco 2 — Suporte */}
                <div>
                  <p className="text-mapa-text-tertiary text-xs font-medium uppercase tracking-widest mb-3">
                    Acompanhamento
                  </p>
                  <ul className="space-y-2.5">
                    {[
                      "Mentoria individual via WhatsApp",
                      "Suporte assíncrono 10:00–17:00",
                      "Resposta em até 24h úteis",
                      "100% humano respondendo",
                    ].map((text) => (
                      <li key={text} className="flex items-start gap-3">
                        <Check className="w-4 h-4 mt-0.5 shrink-0 text-mapa-text-tertiary" />
                        <span className="text-[14px] text-mapa-text-secondary leading-snug">
                          {text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bloco 3 — Acesso */}
                <div>
                  <p className="text-mapa-text-tertiary text-xs font-medium uppercase tracking-widest mb-3">
                    Acesso
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Artefatos: skills, agentes, MCPs, workflows",
                      "Acesso durante todo o período de implementação",
                    ].map((text) => (
                      <li key={text} className="flex items-start gap-3">
                        <Check className="w-4 h-4 mt-0.5 shrink-0 text-mapa-text-hint" />
                        <span className="text-[13px] text-mapa-text-tertiary leading-snug">
                          {text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Divider */}
              <div className="mx-8 border-t border-white/5" />

              {/* CTAs */}
              <div className="px-8 pt-6 pb-8">
                {esgotado ? (
                  <>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => posthog.capture("whatsapp_click", { location: "pricing_waitlist" })}
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
                      onClick={() => posthog.capture("cta_click", { location: "pricing" })}
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "w-full rounded-full bg-white hover:bg-white/90 text-[#030305] font-semibold h-12 text-base transition-colors duration-300 no-underline"
                      )}
                    >
                      Garantir minha vaga
                    </a>

                    {/* Garantia inline — abaixo do botão de compra */}
                    <div className="mt-4 flex items-start gap-3 rounded-xl border border-mapa-accent/15 bg-mapa-accent/5 px-4 py-3">
                      <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-mapa-accent" />
                      <p className="text-[13px] text-mapa-text-secondary leading-snug">
                        <span className="text-mapa-text font-medium">Garantia de 7 dias.</span>{" "}
                        Comece, fale conosco por 7 dias. Se não fizer sentido, devolvemos tudo — sem perguntas.
                      </p>
                    </div>

                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => posthog.capture("whatsapp_click", { location: "pricing" })}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "lg" }),
                        "w-full rounded-full text-mapa-text-secondary hover:text-mapa-text font-medium h-11 text-sm transition-all duration-300 no-underline mt-2"
                      )}
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      Tirar dúvidas no WhatsApp
                    </a>
                  </>
                )}
              </div>

            </div>
          </div>

          <p className="text-center mt-6 text-mapa-text-hint text-sm">
            Parcele em até 12x no cartão · 5% off no Pix
          </p>

          {/* Custo da espera */}
          <div className="mt-8 text-center space-y-1 px-2">
            <p className="text-mapa-text-hint text-[13px] leading-relaxed">
              Cada semana sem automatizar são horas que você não recupera.
            </p>
            <p className="text-mapa-text-hint text-[13px] leading-relaxed">
              Se você gasta 2h por dia em tarefas repetitivas, são{" "}
              <span className="text-mapa-text-secondary font-medium">40h por mês</span>{" "}
              — tempo que poderia estar investindo no que realmente importa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
