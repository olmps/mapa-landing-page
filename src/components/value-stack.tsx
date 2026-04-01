"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const INSTALLMENT_FORMATTED = "166,42";

interface StackItem {
  label: string;
  value: number;
}

interface StackGroup {
  title: string;
  items: StackItem[];
}

const groups: StackGroup[] = [
  {
    title: "Mentoria & Acompanhamento",
    items: [
      { label: "Sessão de consultoria individual de 1h com o Jonata", value: 500 },
      { label: "Acompanhamento individual via WhatsApp (duração do projeto)", value: 3000 },
      { label: "Aplicação completa do Método MAPA no seu processo", value: 2000 },
      { label: "Suporte assíncrono 100% humano (resposta em até 24h)", value: 1500 },
    ],
  },
  {
    title: "Artefatos & Aceleradores",
    items: [
      { label: "Biblioteca de skills, agentes e workflows prontos para uso", value: 3000 },
      { label: "Templates de prompts, sites, automações e ferramentas internas", value: 2500 },
      { label: "Criação sob demanda: nosso time monta a base da skill ou agente que você precisa — você só customiza", value: 4500 },
    ],
  },
  {
    title: "Acesso ao Ecossistema Olympus",
    items: [
      { label: "Acesso aos nossos design systems", value: 2000 },
      { label: "Acesso ao nosso baú de conhecimentos — como ter acesso direto ao cérebro da equipe", value: 3000 },
      { label: "Templates de prompts, agentes, sites e ferramentas para acelerar seu processo", value: 2000 },
    ],
  },
];

const TOTAL_VALUE = 26000;

// Formatação sem toLocaleString para evitar hydration mismatch
function formatValueSafe(value: number): string {
  if (value >= 1000) {
    const thousands = Math.floor(value / 1000);
    const remainder = value % 1000;
    if (remainder === 0) {
      return "R$" + thousands + ".000";
    }
    return "R$" + thousands + "." + String(remainder).padStart(3, "0");
  }
  return "R$" + value;
}

export function ValueStack() {
  const ref = useScrollReveal();

  return (
    <section className="mapa-section" ref={ref}>
      <div className="mapa-container">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="reveal mapa-h2 text-mapa-text">Tudo que está incluso</h2>
          <p className="reveal mt-4 text-mapa-text-secondary max-w-lg mx-auto">
            Cada item tem valor real de mercado. Na mentoria, você recebe tudo — e se precisar de algo específico, nosso time cria a base para você.
          </p>
        </div>

        {/* Stack card */}
        <div className="reveal max-w-2xl mx-auto rounded-2xl border border-mapa-border bg-mapa-surface2 overflow-hidden">

          {/* Grupos */}
          {groups.map((group, gi) => (
            <div key={gi}>
              {/* Divider entre grupos (não no primeiro) */}
              {gi > 0 && (
                <div className="mx-6 sm:mx-8 border-t border-white/5" />
              )}

              <div className="px-6 sm:px-8 py-6">
                {/* Label do grupo */}
                <p className="text-mapa-text-tertiary text-xs font-medium uppercase tracking-widest mb-4">
                  {group.title}
                </p>

                {/* Itens */}
                <ul className="space-y-3">
                  {group.items.map((item, ii) => (
                    <li
                      key={ii}
                      className="flex items-baseline justify-between gap-4"
                    >
                      <span className="text-[14px] sm:text-[15px] text-mapa-text-secondary leading-snug">
                        {item.label}
                      </span>
                      <span
                        className="shrink-0 text-[13px] text-mapa-text-tertiary tabular-nums"
                        style={{ fontFamily: "var(--font-fira-code)" }}
                      >
                        {formatValueSafe(item.value)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {/* "E muito mais" */}
          <div className="px-6 sm:px-8 pb-4">
            <p className="text-[13px] text-mapa-text-tertiary italic">
              e muito mais.
            </p>
          </div>

          {/* Divider antes do rodapé */}
          <div className="mx-6 sm:mx-8 border-t border-white/8" />

          {/* Rodapé de ancoragem */}
          <div className="px-6 sm:px-8 py-7 space-y-4 bg-mapa-surface1/60">

            {/* Total riscado */}
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[13px] sm:text-[14px] text-mapa-text-secondary">
                Valor estimado do pacote completo
              </span>
              <span
                className="shrink-0 text-[15px] sm:text-[16px] text-mapa-text-tertiary line-through tabular-nums"
                style={{ fontFamily: "var(--font-fira-code)" }}
              >
                R$26.000+
              </span>
            </div>

            {/* Preço real — subordinado */}
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[13px] sm:text-[14px] text-mapa-text-secondary">
                Investimento na mentoria
              </span>
              <span
                className="shrink-0 text-[15px] sm:text-[16px] text-mapa-text font-semibold tabular-nums"
                style={{ fontFamily: "var(--font-fira-code)" }}
              >
                12x de R${INSTALLMENT_FORMATTED}
              </span>
            </div>

            {/* Divider interno */}
            <div className="border-t border-white/5" />

            {/* Economia — destaque */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-[14px] sm:text-[15px] text-mapa-text font-medium">
                Você economiza mais de
              </span>
              <span
                className="shrink-0 text-[20px] sm:text-[24px] font-bold text-mapa-accent leading-none tabular-nums"
                style={{
                  fontFamily: "var(--font-syne)",
                  letterSpacing: "-0.02em",
                }}
              >
                R$24.000
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
