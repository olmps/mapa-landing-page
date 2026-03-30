"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WHATSAPP_URL } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { HumanBadge } from "@/components/human-badge";

const tools = [
  "Claude",
  "Openclaw",
  "GPT",
  "Gemini",
  "Codex",
  "Midjourney",
  "Nano Banana",
  "n8n",
  "Make",
];

export function Hero() {
  const ref = useScrollReveal();

  return (
    <section className="mapa-section pt-32 lg:pt-44 pb-16 lg:pb-24 relative overflow-hidden" ref={ref}>
      {/* Animated gradient orbs */}
      <div className="hero-orb top-[-200px] left-[-100px] opacity-70" aria-hidden="true" />
      <div className="hero-orb-2 bottom-[-100px] right-[-50px] opacity-50" aria-hidden="true" />

      <div className="mapa-container flex flex-col items-center text-center relative z-10">
        <Badge
          variant="outline"
          className="reveal mb-8 rounded-full border-mapa-border-hover bg-mapa-surface1 px-4 py-1.5 text-mapa-accent-lt font-mono text-xs tracking-wide"
        >
          Mentoria individual &middot; WhatsApp &middot; IA
        </Badge>

        <h1 className="reveal mapa-display max-w-[900px] text-mapa-text">
          Automatize qualquer{" "}
          <span className="text-accent-blue">processo digital</span> para sua
          vida ou empresa.
        </h1>

        <p
          className="reveal mt-6 max-w-[600px] text-mapa-text-secondary leading-relaxed"
          style={{ animationDelay: "100ms" }}
        >
          Mentoria individual assíncrona via WhatsApp. Te guiamos passo a passo
          pela metodologia MAPA até seu processo estar rodando no automático.
        </p>

        <div
          className="reveal mt-8 flex flex-wrap justify-center gap-2"
          style={{ animationDelay: "150ms" }}
        >
          {tools.map((tool) => (
            <span
              key={tool}
              className="text-[11px] text-mapa-text-tertiary bg-mapa-surface2 px-2.5 py-1 rounded-full font-mono"
            >
              {tool}
            </span>
          ))}
        </div>

        <div
          className="reveal mt-10 flex flex-col sm:flex-row gap-4"
          style={{ animationDelay: "200ms" }}
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full bg-mapa-accent hover:bg-mapa-accent-md text-white font-medium px-8 h-12 text-base transition-colors duration-300 no-underline"
            )}
          >
            <WhatsAppIcon className="w-4 h-4" />
            Falar no WhatsApp
          </a>
          <a
            href="#pricing"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-full border-mapa-border hover:border-mapa-border-hover bg-transparent text-mapa-text-secondary hover:text-mapa-text font-medium px-8 h-12 text-base transition-all duration-300 no-underline"
            )}
          >
            Comprar agora — R$987
          </a>
        </div>

        <div
          className="reveal mt-6 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "300ms" }}
        >
          <HumanBadge />
          <span className="text-mapa-text-hint text-sm">
            Resposta em até 24h úteis
          </span>
        </div>
      </div>
    </section>
  );
}
