"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { WHATSAPP_URL } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/icons/whatsapp";

export function QualifyCTA() {
  const ref = useScrollReveal();

  return (
    <section className="mapa-section relative overflow-hidden" ref={ref}>
      <div className="mapa-container relative z-10">
        <div className="qualify-glow-wrapper reveal">
          <div className="relative rounded-2xl overflow-hidden">
            {/* Background gradient */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,40,120,0.4) 0%, rgba(60,20,120,0.35) 50%, rgba(0,50,150,0.3) 100%)",
              }}
              aria-hidden="true"
            />

            {/* Radial orb */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,85,255,0.2) 0%, rgba(80,40,200,0.08) 50%, transparent 70%)",
                filter: "blur(40px)",
              }}
              aria-hidden="true"
            />

            <div className="gentle-float relative z-10 flex flex-col items-center text-center px-8 py-16 lg:py-20">
              <p
                className="reveal mapa-small text-mapa-accent/70 mb-4"
              >
                100% gratuito, sem compromisso
              </p>

              <h2 className="reveal mapa-h2 text-mapa-text max-w-[700px]">
                Não tem certeza se seu fluxo pode ser{" "}
                <span className="text-accent-blue">automatizado</span>?
              </h2>

              <p
                className="reveal mt-6 max-w-[520px] text-mapa-text-secondary leading-relaxed"
                style={{ animationDelay: "100ms" }}
              >
                Mande uma mensagem para nossa equipe e te ajudamos a descobrir.
                Sem chatbot, sem formulário — um humano vai te responder.
              </p>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "reveal mt-10 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-medium px-10 h-14 text-lg transition-colors duration-300 no-underline"
                )}
                style={{ animationDelay: "200ms" }}
              >
                <WhatsAppIcon className="w-5 h-5" />
                Converse com a equipe
              </a>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
