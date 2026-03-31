"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { ExternalLink, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface Testimonial {
  quote: string;
  author: string;
  handle: string;
  sourceUrl: string;
  sourceLabel: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Construí um sistema de 17 skills de IA que assumiram toda a geração de relatórios financeiros. Economizamos ~60 horas-pessoa por mês — relatórios diários caíram de 2-3h para 5-10 minutos.",
    author: "Georgii Motrenko",
    handle: "Engenheiro de Software",
    sourceUrl:
      "https://www.tabnews.com.br/georgiimotrenko/como-substitui-o-departamento-financeiro-por-uma-cadeia-de-agentes-de-ia",
    sourceLabel: "TabNews",
  },
  {
    quote:
      "Gastei menos de uma hora para fazer o script e economizei +20 horas de trabalho árduo. Automatizei a documentação de 300+ arquivos de código.",
    author: "jeffz",
    handle: "Desenvolvedor",
    sourceUrl:
      "https://www.tabnews.com.br/jeffz/economizei-20-horas-de-trabalho-com-um-script-simples",
    sourceLabel: "TabNews",
  },
  {
    quote:
      "Substituí o Zapier, Kommo e Calendly por um stack N8N auto-hospedado. O cliente agora roda seu funil de vendas 100% automático e economiza +R$600/mês.",
    author: "Pedro H. G. Mello",
    handle: "Dev & Consultor de Automação",
    sourceUrl:
      "https://dev.to/pedrohgmello/case-study-como-substitui-o-zapier-kommo-e-calendly-por-um-stack-n8n-auto-hospedado-e-economizei-hpj",
    sourceLabel: "DEV.to",
  },
  {
    quote:
      "Implantei um sistema de agentes de IA que responde dúvidas de clientes em até 5 segundos. A automação mudou completamente nosso atendimento.",
    author: "Vinicius Dourado",
    handle: "Desenvolvedor",
    sourceUrl:
      "https://pt.linkedin.com/pulse/automatizei-o-atendimento-com-ia-e-resultado-at%C3%A9-do-mercado-dourado-v5jyf",
    sourceLabel: "LinkedIn",
  },
  {
    quote:
      "Automatizei o envio de leads via WhatsApp — passei de 100 para 300+ mensagens por dia, eliminei R$5 mil/mês de custo operacional e zero bloqueios de conta.",
    author: "Marcos P. Santana",
    handle: "Freelancer & Automação",
    sourceUrl:
      "https://pt.linkedin.com/pulse/como-automatizei-o-envio-de-leads-e-economizei-r5-marcos-p-santana-2o5hf",
    sourceLabel: "LinkedIn",
  },
  {
    quote:
      "O agente de IA conversa com o cliente, coleta nome e e-mail, entende o pedido e manda um resumo completo pro Trello. Ideal pra quem quer parar de anotar tudo na mão.",
    author: "Tarcísio Lopes",
    handle: "TL Soluções Digitais",
    sourceUrl:
      "https://pt.linkedin.com/posts/tarcisio-lopes-88052633_esse-agente-de-ia-faz-o-trabalho-que-voc%C3%AA-activity-7356031450053287937-YxZI",
    sourceLabel: "LinkedIn",
  },
  {
    quote:
      "Com Cursor IDE + MCPs, consegui acelerar rotinas manuais que antes tomavam horas. Agora gerencio tickets no Jira, GitHub e Notion com uma simples mensagem pro agente.",
    author: "koziel",
    handle: "Desenvolvedor",
    sourceUrl:
      "https://www.tabnews.com.br/koziel/como-automatizei-meu-fluxo-de-trabalho-com-cursor-ide-mcps-jira-github-notion",
    sourceLabel: "TabNews",
  },
  {
    quote:
      "Eliminei as planilhas e aquela cobrança chata de 'quem está fazendo o quê'. Criei um micro-SaaS que distribui tarefas e calcula pagamentos automaticamente.",
    author: "JeanCarlosDev",
    handle: "Desenvolvedor Full-Stack",
    sourceUrl:
      "https://www.tabnews.com.br/JeanCarlosDev/automatizei-a-gestao-de-um-contrato-de-edicao-usando-bun-elysiajs-e-uma-pitada-de-automacao",
    sourceLabel: "TabNews",
  },
];

export function Testimonials() {
  const ref = useScrollReveal();
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  }

  return (
    <section className="mapa-section relative overflow-hidden" ref={ref}>
      <div className="mapa-container">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="reveal text-mapa-accent text-xs font-mono uppercase tracking-[0.2em] mb-4">
            COMUNIDADE BRASILEIRA
          </p>
          <h2 className="reveal mapa-h2 text-mapa-text">
            Quem já automatizou — e o que ganhou
          </h2>
          <p className="reveal mt-4 text-mapa-text-secondary max-w-lg mx-auto">
            Relatos publicados por profissionais brasileiros em TabNews, LinkedIn e DEV.to. Resultados reais, com fonte.
          </p>
        </div>

        {/* Horizontal scroll container */}
        <div className="relative reveal">
          {/* Left fade */}
          <div
            className="absolute left-0 top-0 bottom-[16px] w-8 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, var(--color-mapa-bg), transparent)",
            }}
            aria-hidden="true"
          />

          {/* Right fade */}
          <div
            className="absolute right-0 top-0 bottom-[16px] w-8 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to left, var(--color-mapa-bg), transparent)",
            }}
            aria-hidden="true"
          />

          {/* Scrollable cards */}
          <div
            ref={scrollRef}
            className="horizontal-scroll flex gap-5 overflow-x-auto pb-4 px-1"
            style={{
              scrollSnapType: "x mandatory",
            }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[320px] bg-mapa-surface1 border border-mapa-border rounded-xl p-6 flex flex-col justify-between card-glow transition-all duration-300"
                style={{
                  scrollSnapAlign: "start",
                }}
              >
                {/* Quote icon */}
                <div className="mb-4">
                  <Quote className="w-5 h-5 text-mapa-accent opacity-40" />
                </div>

                {/* Quote text */}
                <p className="text-mapa-text text-sm leading-relaxed flex-1">
                  {t.quote}
                </p>

                {/* Author info */}
                <div className="mt-5 pt-4 border-t border-mapa-border">
                  <p className="text-mapa-text font-medium text-sm">
                    {t.author}
                  </p>
                  <p className="text-mapa-text-hint text-xs mt-0.5">
                    {t.handle}
                  </p>

                  {/* Source link */}
                  <a
                    href={t.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-mapa-accent text-xs opacity-60 hover:opacity-100 transition-opacity duration-200 no-underline"
                  >
                    Ver no {t.sourceLabel}
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation buttons — desktop only */}
          <div className="hidden md:flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => scrollBy("left")}
              aria-label="Anterior"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-mapa-border bg-mapa-surface1 text-mapa-text-secondary hover:text-mapa-text hover:border-mapa-border-hover transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollBy("right")}
              aria-label="Próximo"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-mapa-border bg-mapa-surface1 text-mapa-text-secondary hover:text-mapa-text hover:border-mapa-border-hover transition-colors duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
