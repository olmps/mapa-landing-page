"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { WHATSAPP_URL } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { VAGAS_TOTAL } from "@/lib/edge-config";
import { PRODUCT_NAME, PRODUCT_PRICE } from "@/lib/constants";
import { posthog } from "@/lib/posthog";
import { generateEventId, setStoredEventId } from "@/lib/event-id";

interface FinalCTAProps {
  vagasRestantes?: number;
}

export function FinalCTA({ vagasRestantes = VAGAS_TOTAL }: FinalCTAProps) {
  const ref = useScrollReveal();
  const esgotado = vagasRestantes === 0;

  return (
    <section className="mapa-section gradient-final-cta relative overflow-hidden" ref={ref}>
      {/* Pulsing radial gradient */}
      <div className="pulse-glow left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />

      <div className="mapa-container text-center relative z-10">
        <h2 className="reveal mapa-h2 max-w-[700px] mx-auto text-mapa-text">
          Saia da ideia pra automação na prática. Comece pelo WhatsApp.
        </h2>
        <div className="reveal mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#investimento"
            onClick={() => {
              posthog.capture("cta_click", { location: "final_cta" });
              if (typeof window !== "undefined" && window.fbq) {
                const leadEventId = generateEventId();
                setStoredEventId("lead_investimento", leadEventId);
                try {
                  sessionStorage.setItem("lead_investimento_event_id", leadEventId);
                } catch {
                  // non-fatal
                }
                window.fbq(
                  "track",
                  "Lead",
                  {
                    content_name: `${PRODUCT_NAME} - intent to buy`,
                    value: PRODUCT_PRICE,
                    currency: "BRL",
                  },
                  { eventID: leadEventId }
                );
              }
            }}
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full bg-mapa-accent hover:bg-mapa-accent-md text-white font-medium px-10 h-14 text-lg transition-colors duration-300 no-underline"
            )}
          >
            {esgotado ? "Entrar na lista de espera" : "Automatizar meu processo"}
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              posthog.capture("whatsapp_click", { location: "final_cta" });
              if (typeof window !== "undefined" && window.fbq) {
                const leadEventId = generateEventId();
                window.fbq("track", "Lead", {}, { eventID: leadEventId });
              }
            }}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-full border-green-500/30 hover:border-green-500/50 bg-transparent text-green-400 hover:text-green-300 font-medium px-10 h-14 text-lg transition-all duration-300 no-underline"
            )}
          >
            <WhatsAppIcon className="w-4 h-4" />
            Falar no WhatsApp
          </a>
        </div>
        <p className="reveal mt-6 text-mapa-text-hint text-sm">
          {esgotado ? (
            <>Vagas esgotadas — entre na lista para a próxima turma.</>
          ) : vagasRestantes <= 5 ? (
            <>
              Restam apenas{" "}
              <span
                className="font-semibold text-[#EEEEF0]"
                style={{ fontFamily: "var(--font-fira-code)" }}
              >
                {vagasRestantes}
              </span>{" "}
              vagas 🔥 · Mentoria individual · 100% humano · Garantia de 7 dias.
            </>
          ) : (
            <>
              Apenas{" "}
              <span
                className="font-semibold text-[#888898]"
                style={{ fontFamily: "var(--font-fira-code)" }}
              >
                {VAGAS_TOTAL}
              </span>{" "}
              vagas por turma · Mentoria individual · 100% humano · Garantia de 7 dias.
            </>
          )}
        </p>
      </div>
    </section>
  );
}
