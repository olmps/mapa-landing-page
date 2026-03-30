"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Clock, Zap, TrendingUp, ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { WHATSAPP_URL } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/icons/whatsapp";

interface Example {
  title: string;
  description: string;
  result: string;
  resultIcon: "clock" | "zap" | "trending";
  tools: string[];
  sourceUrl: string;
  sourceLabel: string;
}

const examples: Example[] = [
  {
    title: "Atendimento WhatsApp para clínicas",
    description:
      "Workflow que recebe mensagens no WhatsApp da clínica, faz triagem automática com IA, agenda consultas no Google Calendar e responde dúvidas frequentes. A recepcionista só intervém nos casos complexos.",
    result: "85% do atendimento automatizado",
    resultIcon: "zap",
    tools: ["n8n", "Evolution API", "ChatGPT", "Google Calendar"],
    sourceUrl:
      "https://www.tabnews.com.br/ojonatasquirino/automacao-de-atendimento-via-whatsapp-com-n8n-llms",
    sourceLabel: "TabNews",
  },
  {
    title: "Pedido → nota fiscal → aviso ao cliente",
    description:
      "Automação que pega cada venda no e-commerce, cadastra no Bling, emite nota fiscal via NFe.io, atualiza o estoque e envia a NFe por WhatsApp ao cliente. Da confirmação do Pix ao aviso final, tudo automático.",
    result: "De 10min para 3s por pedido",
    resultIcon: "clock",
    tools: ["n8n", "Bling", "NFe.io", "WhatsApp Business API"],
    sourceUrl:
      "https://www.horadecodar.com.br/automacao-ecommerce-n8n-pedidos-nota-fiscal-envio-whatsapp/",
    sourceLabel: "Hora de Codar",
  },
  {
    title: "1 vídeo vira 10+ peças de conteúdo",
    description:
      "Workflow que transcreve um Reels, gera legenda para Instagram, post para LinkedIn, roteiro de cortes e agenda tudo automaticamente. Um vídeo por semana alimenta todos os canais.",
    result: "1 vídeo → 10+ peças de conteúdo",
    resultIcon: "trending",
    tools: ["n8n", "Claude API", "Canva", "mLabs"],
    sourceUrl:
      "https://community.n8n.io/t/full-social-media-automation-ai-images-runware-trending-topics-perplexity-instagram-facebook-linkedin-auto-comments/249592",
    sourceLabel: "n8n Community",
  },
  {
    title: "Prospecção e follow-up comercial no automático",
    description:
      "Fluxo que enriquece leads vindos do LinkedIn, alimenta o CRM no RD Station e dispara cadências de follow-up por WhatsApp automaticamente. Cada vendedor recupera horas do dia para fechar negócios.",
    result: "2h/dia recuperadas por vendedor",
    resultIcon: "clock",
    tools: ["n8n", "RD Station CRM", "WhatsApp API", "Claude API"],
    sourceUrl:
      "https://www.nexai.com.br/artigos/vendas-pelo-whatsapp-com-n8n-ia/",
    sourceLabel: "NexAI",
  },
  {
    title: "Relatório financeiro mensal sem trabalho manual",
    description:
      "Automação que puxa extratos bancários e dados do ERP Omie, cruza tudo, e a IA monta o resumo financeiro direto no Google Sheets. Relatório pronto às 8h do dia 1, sem ninguém abrir planilha.",
    result: "16h → 45min por mês",
    resultIcon: "zap",
    tools: ["n8n", "Omie", "Google Sheets", "GPT-4"],
    sourceUrl:
      "https://community.n8n.io/t/built-an-n8n-workflow-that-turns-any-google-sheet-into-an-ai-report-and-emails-it-automatically/277058",
    sourceLabel: "n8n Community",
  },
  {
    title: "Triagem de currículos com IA",
    description:
      "Workflow que baixa currículos do Gupy, analisa cada um com IA contra os critérios da vaga e entrega um ranking dos 20 melhores com justificativa. Centenas de CVs processados em minutos.",
    result: "90% menos tempo de triagem",
    resultIcon: "trending",
    tools: ["n8n", "Claude API", "Gupy", "Google Sheets"],
    sourceUrl:
      "https://community.n8n.io/t/how-i-built-a-resume-screening-workflow-that-saves-hr-teams-80-of-their-time-and-how-you-can-resell-it/154373",
    sourceLabel: "n8n Community",
  },
];

const resultIcons = {
  clock: Clock,
  zap: Zap,
  trending: TrendingUp,
};

export function SocialProof() {
  const ref = useScrollReveal();

  return (
    <section className="mapa-section relative overflow-hidden" ref={ref}>
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,85,255,0.08) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
        aria-hidden="true"
      />

      <div className="mapa-container relative z-10">
        <div className="text-center mb-6">
          <span className="reveal mapa-small text-mapa-accent tracking-widest uppercase mb-4 block">
            Enquanto você lê isso...
          </span>
          <h2 className="reveal mapa-h2 text-mapa-text max-w-[700px] mx-auto">
            Automações reais que já estão rodando{" "}
            <span className="text-accent-blue">no Brasil</span>.
          </h2>
          <p className="reveal mt-4 text-mapa-text-secondary max-w-lg mx-auto">
            Casos de uso documentados em comunidades brasileiras. Qual desses
            processos você também tem?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {examples.map((example, i) => {
            const ResultIcon = resultIcons[example.resultIcon];
            return (
              <div
                key={i}
                className="reveal card-glow rounded-xl border border-mapa-border bg-mapa-surface1 p-6 flex flex-col transition-all duration-500"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Title */}
                <h3 className="text-mapa-text text-[15px] font-semibold leading-snug mb-2">
                  {example.title}
                </h3>

                {/* Description */}
                <p className="text-mapa-text-secondary text-[14px] leading-relaxed flex-1 mb-4">
                  {example.description}
                </p>

                {/* Result badge */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1.5 bg-mapa-accent/10 text-mapa-accent text-xs font-medium px-2.5 py-1 rounded-full">
                    <ResultIcon className="w-3 h-3" />
                    {example.result}
                  </div>
                </div>

                {/* Tools + Source */}
                <div className="flex items-end justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {example.tools.map((tool, j) => (
                      <span
                        key={j}
                        className="text-[11px] text-mapa-text-tertiary bg-mapa-surface2 px-2 py-0.5 rounded font-mono"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                  <a
                    href={example.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] text-mapa-text-hint hover:text-mapa-accent-lt transition-colors duration-200 shrink-0 no-underline"
                  >
                    {example.sourceLabel}
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOMO CTA */}
        <div className="reveal text-center mt-14">
          <p className="text-mapa-text-secondary text-sm mb-6">
            Cada semana que passa sem automatizar é tempo que você não recupera.
          </p>
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
            Quero automatizar o meu
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
}
