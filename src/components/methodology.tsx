"use client";

import {
  Fragment,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  Map,
  Search,
  Rocket,
  TrendingUp,
  Check,
  X,
  FileText,
  Bot,
  MessageCircle,
  BarChart3,
  Package,
  Target,
  Gauge,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ── Types ── */

interface TerminalLine {
  text: string;
  type:
    | "command"
    | "header"
    | "output"
    | "success"
    | "tree"
    | "result"
    | "empty";
}

interface PhaseData {
  letter: string;
  name: string;
  icon: LucideIcon;
  badge: string;
  headline: string;
  body: string;
  deliverables: { icon: LucideIcon; text: string }[];
  terminal: TerminalLine[];
}

/* ── Phase Data ── */

const phases: PhaseData[] = [
  {
    letter: "M",
    name: "Mapear",
    icon: Map,
    badge: "Fase 1 de 4",
    headline: "Antes de automatizar, precisamos entender",
    body: "Começamos ouvindo. Você descreve o processo que te trava, e juntos mapeamos cada etapa — do trigger até o resultado. Sem jargão, sem pressa. O objetivo é ter clareza total do problema antes de pensar em solução.",
    deliverables: [
      { icon: FileText, text: "Diagnóstico do processo atual" },
      { icon: Target, text: "Definição clara do resultado desejado" },
      { icon: Package, text: "Escopo e limites alinhados" },
    ],
    terminal: [
      { text: '$ mapa mapear --processo "follow-up de leads"', type: "command" },
      { text: "", type: "empty" },
      { text: "→ Problema identificado:", type: "header" },
      { text: "  Leads esfriam após 48h sem contato", type: "output" },
      { text: "  Equipe esquece de fazer follow-up", type: "output" },
      { text: "  Vendas perdidas por falta de resposta", type: "output" },
      { text: "", type: "empty" },
      { text: "→ Processo atual:", type: "header" },
      { text: "  Lead entra via formulário", type: "output" },
      { text: "  Vendedor verifica planilha 1x/dia (quando lembra)", type: "output" },
      { text: "  Follow-up manual por email ou WhatsApp", type: "output" },
      { text: "", type: "empty" },
      { text: "→ Resultado desejado:", type: "header" },
      { text: "  Lead recebe follow-up automático em < 2h", type: "output" },
      { text: "  Equipe notificada de leads quentes", type: "output" },
      { text: "  Zero leads esquecidos", type: "output" },
      { text: "", type: "empty" },
      { text: "✓ Mapeamento completo", type: "success" },
    ],
  },
  {
    letter: "A",
    name: "Analisar",
    icon: Search,
    badge: "Fase 2 de 4",
    headline: "Exploramos as opções e desenhamos a solução",
    body: "Com o problema mapeado, analisamos quais ferramentas e abordagens fazem sentido pro seu caso. Comparamos opções reais — custo, complexidade, escalabilidade — e escolhemos juntos o melhor caminho.",
    deliverables: [
      { icon: Search, text: "Análise comparativa de ferramentas" },
      { icon: BarChart3, text: "Arquitetura da solução escolhida" },
      { icon: FileText, text: "Plano de implementação detalhado" },
    ],
    terminal: [
      { text: "$ mapa analisar --opcoes", type: "command" },
      { text: "", type: "empty" },
      { text: "→ Analisando ferramentas disponíveis...", type: "header" },
      { text: "", type: "empty" },
      { text: "  Opção A: Zapier + Gmail + Sheets", type: "output" },
      { text: "  ├── Prós: simples, rápido de montar", type: "tree" },
      { text: "  └── Contras: limitado, caro em escala", type: "tree" },
      { text: "", type: "empty" },
      { text: "  Opção B: n8n + WhatsApp API + CRM", type: "output" },
      { text: "  ├── Prós: flexível, escalável, sem custo fixo", type: "tree" },
      { text: "  └── Contras: setup mais técnico", type: "tree" },
      { text: "", type: "empty" },
      { text: "  Opção C: Make + ChatGPT + Notion", type: "output" },
      { text: "  ├── Prós: IA personaliza cada mensagem", type: "tree" },
      { text: "  └── Contras: custo de API, mais pontos de falha", type: "tree" },
      { text: "", type: "empty" },
      { text: "→ Decisão: Opção B", type: "header" },
      { text: "  Melhor custo-benefício para o cenário", type: "output" },
      { text: "", type: "empty" },
      { text: "✓ Análise completa — solução desenhada", type: "success" },
    ],
  },
  {
    letter: "P",
    name: "Produzir",
    icon: Rocket,
    badge: "Fase 3 de 4",
    headline: "Mão na massa — com suporte a cada passo",
    body: "Aqui você implementa. Mas não sozinho. Fornecemos templates prontos, guias passo-a-passo, e agentes de IA configurados para o seu caso. Dúvidas? WhatsApp em tempo real. Travou? Destravamos juntos.",
    deliverables: [
      { icon: Package, text: "Templates e fluxos prontos para importar" },
      { icon: Bot, text: "Agentes de IA pré-configurados" },
      { icon: MessageCircle, text: "Suporte via WhatsApp em tempo real" },
    ],
    terminal: [
      { text: "$ mapa produzir --implementar", type: "command" },
      { text: "", type: "empty" },
      { text: "→ Configurando ambiente...", type: "header" },
      { text: "  ✓ n8n instalado e rodando", type: "success" },
      { text: "  ✓ WhatsApp Business API conectada", type: "success" },
      { text: "  ✓ Webhook do formulário configurado", type: "success" },
      { text: "", type: "empty" },
      { text: "→ Construindo fluxo:", type: "header" },
      { text: "  [1/4] Trigger: novo lead no formulário    ✓", type: "success" },
      { text: "  [2/4] Delay: aguardar 2h                  ✓", type: "success" },
      { text: "  [3/4] Ação: enviar WhatsApp personalizado  ✓", type: "success" },
      { text: "  [4/4] Ação: notificar equipe no Slack      ✓", type: "success" },
      { text: "", type: "empty" },
      { text: "→ Recursos entregues:", type: "header" },
      { text: "  Template do fluxo n8n (pronto para importar)", type: "output" },
      { text: "  Agente de suporte configurado", type: "output" },
      { text: "  Guia passo-a-passo com screenshots", type: "output" },
      { text: "", type: "empty" },
      { text: "✓ Implementação completa", type: "success" },
    ],
  },
  {
    letter: "A",
    name: "Agir",
    icon: TrendingUp,
    badge: "Fase 4 de 4",
    headline: "Sua automação rodando — com resultado real",
    body: "Testamos com dados reais, ajustamos o que for preciso, e validamos que tudo funciona. O resultado? Um processo que antes dependia de memória humana agora roda sozinho — e você vê os números mudarem.",
    deliverables: [
      { icon: Check, text: "Automação testada e validada" },
      { icon: BarChart3, text: "Métricas de antes vs depois" },
      { icon: FileText, text: "Documentação para manutenção" },
    ],
    terminal: [
      { text: "$ mapa agir --validar", type: "command" },
      { text: "", type: "empty" },
      { text: "→ Executando teste com lead real...", type: "header" },
      { text: "", type: "empty" },
      { text: "  Lead: Maria Silva (maria@empresa.com)", type: "output" },
      { text: "  Formulário preenchido às 14:32", type: "output" },
      { text: "  WhatsApp enviado às 16:32 (+2h)      ✓", type: "success" },
      { text: "  Equipe notificada às 16:32           ✓", type: "success" },
      { text: '  Lead marcado como "contactado"       ✓', type: "success" },
      { text: "", type: "empty" },
      { text: "→ Resultado:", type: "header" },
      { text: "  Antes:  48h para follow-up (quando acontecia)", type: "output" },
      { text: "  Depois: 2h automático, 100% dos leads", type: "result" },
      { text: "", type: "empty" },
      { text: "  Tempo economizado: ~3h/dia", type: "result" },
      { text: "  Taxa de resposta: +40%", type: "result" },
      { text: "", type: "empty" },
      { text: "✓ Automação validada e rodando", type: "success" },
    ],
  },
];

/* ── Scope Data ── */

const inScope = [
  "1 processo digital por mentoria",
  "Até 4-5 etapas no fluxo",
  "Ferramentas no-code ou low-code (n8n, Make, Zapier, ChatGPT, Claude, etc.)",
  "Integrações com APIs públicas e ferramentas comuns",
  "Processos de qualquer área: marketing, vendas, operações, RH, financeiro",
];

const outScope = [
  "Integrações com sistemas bancários ou financeiros fechados",
  "Integrações com bases de dados governamentais",
  "Processos que exigem desenvolvimento de software custom",
  "Automações que dependem de dados sensíveis regulados (LGPD especial)",
  "Múltiplos processos (cada mentoria cobre 1 processo)",
  "Infraestrutura de servidores ou DevOps",
];

/* ── Hill Chart SVG ── */

const HILL_PATH = "M 30,170 C 140,170 200,30 300,30 C 400,30 460,170 570,170";
const PHASE_PERCENTS = [0.12, 0.38, 0.62, 0.88];
const PHASE_LETTERS = ["M", "A", "P", "A"];

interface Point {
  x: number;
  y: number;
}

function HillChart({ activePhase }: { activePhase: number }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [totalLength, setTotalLength] = useState(0);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    setTotalLength(len);
    setPoints(
      PHASE_PERCENTS.map((pct) => {
        const pt = path.getPointAtLength(len * pct);
        return { x: pt.x, y: pt.y };
      }),
    );
  }, []);

  const activePoint = points[activePhase];
  const trailOffset =
    totalLength > 0
      ? totalLength - totalLength * PHASE_PERCENTS[activePhase]
      : totalLength;

  return (
    <div className="hidden lg:block mb-8">
      <svg viewBox="0 0 600 200" className="w-full h-auto" aria-hidden="true">
        <defs>
          <filter id="hill-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Center divider */}
        <line
          x1={300} y1={20} x2={300} y2={180}
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="4 4"
        />

        {/* Background path */}
        <path
          ref={pathRef}
          d={HILL_PATH}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={2}
        />

        {/* Trail path */}
        {totalLength > 0 && (
          <path
            d={HILL_PATH}
            fill="none"
            stroke="#0055FF"
            strokeWidth={2}
            opacity={0.6}
            strokeDasharray={totalLength}
            strokeDashoffset={trailOffset}
            style={{
              transition: "stroke-dashoffset 0.8s cubic-bezier(.16, 1, .3, 1)",
            }}
          />
        )}

        {/* Labels */}
        <text
          x={120} y={60}
          fill="rgba(255,255,255,0.25)"
          fontSize={11}
          fontFamily="var(--font-outfit)"
          textAnchor="middle"
        >
          Descobrindo o que fazer
        </text>
        <text
          x={420} y={60}
          fill="rgba(255,255,255,0.25)"
          fontSize={11}
          fontFamily="var(--font-outfit)"
          textAnchor="middle"
        >
          Fazendo acontecer
        </text>

        {/* Phase letters below curve */}
        {points.map((pt, i) => (
          <text
            key={i}
            x={pt.x} y={190}
            fill={i === activePhase ? "#0055FF" : "rgba(255,255,255,0.2)"}
            fontSize={13}
            fontWeight={i === activePhase ? "bold" : "normal"}
            fontFamily="var(--font-fira-code)"
            textAnchor="middle"
            style={{ transition: "fill 0.5s cubic-bezier(.16, 1, .3, 1)" }}
          >
            {PHASE_LETTERS[i]}
          </text>
        ))}

        {/* Active dot */}
        {activePoint && (
          <circle
            cx={activePoint.x}
            cy={activePoint.y}
            r={8}
            fill="#0055FF"
            filter="url(#hill-glow)"
            className="hill-dot"
            style={{
              transition:
                "cx 0.8s cubic-bezier(.16, 1, .3, 1), cy 0.8s cubic-bezier(.16, 1, .3, 1)",
            }}
          />
        )}
      </svg>
    </div>
  );
}

/* ── Stepper Tabs ── */

const stepperPhases = [
  { letter: "M", name: "Mapear" },
  { letter: "A", name: "Analisar" },
  { letter: "P", name: "Produzir" },
  { letter: "A", name: "Agir" },
] as const;

function MapaStepper({
  activePhase,
  onPhaseChange,
}: {
  activePhase: number;
  onPhaseChange: (phase: number) => void;
}) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      let next = activePhase;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next = (activePhase + 1) % 4;
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        next = (activePhase - 1 + 4) % 4;
      } else {
        return;
      }
      onPhaseChange(next);
      tabRefs.current[next]?.focus();
    },
    [activePhase, onPhaseChange],
  );

  return (
    <div
      role="tablist"
      aria-label="Fases da metodologia MAPA"
      className="flex items-center justify-center gap-1 lg:gap-2 mb-8 lg:mb-12"
    >
      {stepperPhases.map((phase, i) => {
        const isActive = activePhase === i;
        return (
          <Fragment key={i}>
            <button
              ref={(el) => { tabRefs.current[i] = el; }}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onPhaseChange(i)}
              onKeyDown={handleKeyDown}
              className={[
                "flex flex-col items-center gap-1 px-3 lg:px-5 py-2 lg:py-3 rounded-lg border border-transparent",
                "transition-all duration-500 cursor-pointer",
                isActive
                  ? "border-mapa-accent/30 bg-mapa-accent/5 text-mapa-text shadow-[0_0_20px_rgba(0,85,255,0.06)]"
                  : "text-mapa-text-hint hover:text-mapa-text-tertiary hover:bg-white/[0.02]",
              ].join(" ")}
            >
              <span
                className={[
                  "text-lg lg:text-xl font-bold transition-colors duration-500",
                  isActive ? "text-mapa-accent" : "text-mapa-text-hint",
                ].join(" ")}
              >
                {phase.letter}
              </span>
              <span
                className={[
                  "hidden lg:inline text-xs transition-colors duration-500",
                  isActive ? "text-mapa-text-secondary" : "text-mapa-text-hint",
                ].join(" ")}
              >
                {phase.name}
              </span>
            </button>
            {i < 3 && <div className="w-6 lg:w-10 h-px bg-white/5" />}
          </Fragment>
        );
      })}
    </div>
  );
}

/* ── Terminal Line ── */

const lineStyles: Record<TerminalLine["type"], string> = {
  command: "text-mapa-accent font-semibold",
  header: "text-mapa-text",
  output: "text-mapa-text-secondary",
  success: "text-emerald-400",
  tree: "text-mapa-text-tertiary",
  result: "text-mapa-accent-lt font-medium",
  empty: "",
};

function TerminalLineRow({
  line,
  showCursor,
}: {
  line: TerminalLine;
  showCursor: boolean;
}) {
  if (line.type === "empty") return <div className="h-3" />;

  return (
    <div
      className={`font-[family-name:var(--font-fira-code)] text-[13px] leading-relaxed whitespace-pre ${lineStyles[line.type]}`}
    >
      {line.text}
      {showCursor && (
        <span className="terminal-cursor text-mapa-accent">▌</span>
      )}
    </div>
  );
}

/* ── Terminal Window ── */

function TerminalWindow({
  lines,
  phaseKey,
}: {
  lines: TerminalLine[];
  phaseKey: string;
}) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setVisibleCount(lines.length);
      return;
    }

    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count >= lines.length) clearInterval(interval);
      setVisibleCount(count);
    }, 60);

    return () => clearInterval(interval);
  }, [phaseKey, lines.length]);

  const visibleLines = lines.slice(0, visibleCount);
  const isTyping = visibleCount < lines.length;

  return (
    <div className="rounded-xl border border-mapa-border overflow-hidden">
      {/* Chrome bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#0c0c14] border-b border-mapa-border">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="ml-2 text-mapa-text-hint font-[family-name:var(--font-fira-code)] text-xs">
          mapa-cli v1.0
        </span>
      </div>

      {/* Terminal body */}
      <div className="terminal-body bg-[#08080e] p-4 lg:p-5 max-h-[320px] lg:max-h-[380px] overflow-y-auto">
        {visibleLines.map((line, i) => (
          <TerminalLineRow
            key={`${phaseKey}-${i}`}
            line={line}
            showCursor={isTyping && i === visibleLines.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Phase Description ── */

function PhaseDescription({
  phase,
  phaseKey,
}: {
  phase: PhaseData;
  phaseKey: string;
}) {
  return (
    <div key={phaseKey} className="phase-content-enter">
      <span className="mapa-small text-mapa-text-hint mb-3 block">
        {phase.badge}
      </span>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-mapa-accent/10">
          <phase.icon className="w-5 h-5 text-mapa-accent" />
        </div>
        <h3 className="mapa-h3 text-mapa-text">
          <span className="text-mapa-accent font-bold mr-2">{phase.letter}</span>
          {phase.name}
        </h3>
      </div>

      <p className="font-[family-name:var(--font-syne)] text-[20px] lg:text-[22px] font-semibold text-mapa-text leading-tight mb-4">
        {phase.headline}
      </p>

      <p className="text-mapa-text-secondary text-[15px] leading-relaxed mb-6">
        {phase.body}
      </p>

      <div className="space-y-2.5">
        <span className="mapa-small text-mapa-text-hint block mb-2">
          O que você recebe:
        </span>
        {phase.deliverables.map((d, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 text-mapa-text-secondary text-[14px]"
          >
            <d.icon className="w-4 h-4 text-mapa-accent/60 shrink-0" />
            {d.text}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Scope Bento Grid ── */

const complexityLevels = [
  { level: 1, label: "Simples", color: "text-emerald-400", dot: "bg-emerald-400", examples: "Resposta automática, agendamento, envio de emails" },
  { level: 2, label: "Moderado", color: "text-emerald-400", dot: "bg-emerald-400", examples: "Pipeline de conteúdo, prospecção automatizada, relatórios" },
  { level: 3, label: "No limite", color: "text-amber-400", dot: "bg-amber-400", examples: "Integração com 4-5 ferramentas, fluxo condicional complexo" },
  { level: 4, label: "Fora", color: "text-red-400", dot: "bg-red-400/40", examples: "Sistemas bancários, ERPs governamentais, desenvolvimento custom" },
];

function ScopeBento() {
  return (
    <div className="mt-16">
      <p className="mapa-small text-mapa-text-hint mb-4 text-center">
        Transparência
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* No escopo */}
        <div className="rounded-xl border border-emerald-500/15 bg-mapa-surface2 p-5 lg:p-6">
          <h4 className="text-emerald-400 text-sm font-medium mb-4 flex items-center gap-2">
            <Check className="w-4 h-4" /> No escopo
          </h4>
          <ul className="space-y-2.5">
            {inScope.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-mapa-text-secondary text-[13px] leading-relaxed"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400/50 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Fora do escopo */}
        <div className="rounded-xl border border-red-400/10 bg-mapa-surface2 p-5 lg:p-6">
          <h4 className="text-red-400/80 text-sm font-medium mb-4 flex items-center gap-2">
            <X className="w-4 h-4" /> Fora do escopo
          </h4>
          <ul className="space-y-2.5">
            {outScope.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-mapa-text-secondary text-[13px] leading-relaxed"
              >
                <X className="w-3.5 h-3.5 text-red-400/40 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Complexidade */}
        <div className="rounded-xl border border-mapa-border bg-mapa-surface2 p-5 lg:p-6">
          <h4 className="text-mapa-accent-lt text-sm font-medium mb-4 flex items-center gap-2">
            <Gauge className="w-4 h-4" /> Complexidade
          </h4>
          <div className="space-y-4">
            {complexityLevels.map((cl) => (
              <div key={cl.level} className="flex items-start gap-3">
                <div className="flex items-center gap-1 pt-1 shrink-0">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${i < cl.level ? cl.dot : "bg-white/10"}`}
                    />
                  ))}
                </div>
                <div className="min-w-0">
                  <span className={`text-[13px] font-medium ${cl.color}`}>
                    {cl.label}
                  </span>
                  <p className="text-mapa-text-tertiary text-[12px] leading-relaxed">
                    {cl.examples}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */

export function Methodology() {
  const ref = useScrollReveal();
  const [activePhase, setActivePhase] = useState(0);
  const currentPhase = phases[activePhase];
  const phaseKey = `phase-${activePhase}`;

  return (
    <section
      id="methodology"
      className="mapa-section relative overflow-hidden"
      ref={ref}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(100,50,255,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(0,85,255,0.04) 0%, transparent 50%)",
        }}
      />

      <div className="mapa-container relative z-10">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="reveal mapa-small text-mapa-accent mb-3">
            Exemplo real: follow-up de leads
          </p>
          <h2 className="reveal mapa-h2 text-mapa-text">Como funciona</h2>
          <p className="reveal mt-4 text-mapa-text-secondary max-w-lg mx-auto">
            Da sua necessidade até a automação rodando — acompanhe cada fase com
            um exemplo real
          </p>
        </div>

        {/* Hill Chart (desktop) */}
        <div className="reveal">
          <HillChart activePhase={activePhase} />
        </div>

        {/* Stepper */}
        <div className="reveal">
          <MapaStepper
            activePhase={activePhase}
            onPhaseChange={setActivePhase}
          />
        </div>

        {/* Phase Content: Description + Terminal */}
        <div className="reveal grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 lg:gap-12 mb-12">
          {/* Left: Description */}
          <PhaseDescription phase={currentPhase} phaseKey={phaseKey} />

          {/* Right: Terminal */}
          <TerminalWindow lines={currentPhase.terminal} phaseKey={phaseKey} />
        </div>

        {/* Scope Bento */}
        <div className="reveal">
          <ScopeBento />
        </div>
      </div>
    </section>
  );
}
