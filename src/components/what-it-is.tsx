"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  XCircle,
  MessageCircle,
  User,
  Package,
  Clock,
  ShieldCheck,
} from "lucide-react";

const notItems = [
  {
    title: "Chat em grupo",
    description: "Briga por atenção e dúvidas desconexas de outros membros. Aqui é 1-1.",
    icon: XCircle,
  },
  {
    title: "Curso de vídeo",
    description: "Horas de conteúdo genérico que não se adequa ao seu caso. Aqui é sob medida.",
    icon: XCircle,
  },
  {
    title: "Automação pronta",
    description:
      "Ensinamos a pescar e damos a vara. Você pega o peixe — e aprende a pescar sozinho.",
    icon: XCircle,
  },
];

const yesItems = [
  {
    title: "WhatsApp com o time",
    description:
      "Canal direto para tirar dúvidas, pedir ajuda e revisar seu progresso.",
    icon: MessageCircle,
  },
  {
    title: "Atenção individualizada",
    description: "1-on-1 no seu contexto, no seu ritmo, no seu processo.",
    icon: User,
  },
  {
    title: "Acesso a artefatos",
    description:
      "Skills prontas, agentes, MCPs, workflows e recursos exclusivos que usamos no dia a dia.",
    icon: Package,
  },
];

export function WhatItIs() {
  const ref = useScrollReveal();

  return (
    <section className="mapa-section relative" ref={ref}>
      <div className="grid-pattern" aria-hidden="true" />

      <div className="mapa-container relative z-10">
        {/* O que NÃO é */}
        <div className="text-center mb-12">
          <h2 className="reveal mapa-h2 text-mapa-text">
            O que <span className="text-red-400/80">não</span> é
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
          {notItems.map((item, i) => (
            <div
              key={i}
              className="reveal rounded-xl border border-red-400/10 bg-mapa-surface1 p-6 transition-all duration-500"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <item.icon className="w-6 h-6 text-red-400/60 mb-4" />
              <h3 className="mapa-h3 text-mapa-text mb-2">{item.title}</h3>
              <p className="text-mapa-text-secondary text-[15px] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* O que É */}
        <div className="text-center mb-12">
          <h2 className="reveal mapa-h2 text-mapa-text">
            O que <span className="text-accent-blue">é</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {yesItems.map((item, i) => (
            <div
              key={i}
              className="reveal card-glow rounded-xl border border-mapa-border bg-mapa-surface2 p-6 transition-all duration-500"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-mapa-accent/10 mb-4">
                <item.icon className="w-5 h-5 text-mapa-accent" />
              </div>
              <h3 className="mapa-h3 text-mapa-text mb-2">{item.title}</h3>
              <p className="text-mapa-text-secondary text-[15px] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* SLA */}
        <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-center">
          <div className="flex items-center gap-2 text-mapa-text-secondary text-sm">
            <Clock className="w-4 h-4 text-mapa-accent" />
            <span>Atendimento 10:00–17:00</span>
          </div>
          <div className="flex items-center gap-2 text-mapa-text-secondary text-sm">
            <MessageCircle className="w-4 h-4 text-mapa-accent" />
            <span>Resposta em até 24h úteis</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-mapa-surface2 px-4 py-1.5 text-sm font-medium text-green-400">
            <span className="pulse-dot relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-40" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
            </span>
            <span>100% humano respondendo</span>
          </div>
        </div>
      </div>
    </section>
  );
}
