"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const stats = [
  { value: "7+", label: "Produtos enviados" },
  { value: "+1M", label: "Usuários impactados" },
  { value: "3", label: "Semanas para MVP" },
  { value: "5+", label: "Anos de experiência" },
];

const projects = [
  {
    name: "Elefante Letrado",
    description:
      "Plataforma de leitura infantil com 150k usuários ativos por mês. Design System, UX e micro-interações.",
    tags: ["UI/UX", "Design System", "EdTech"],
    highlight: "150k MAU",
  },
  {
    name: "Memo",
    description:
      "App open-source de aprendizado com métodos cientificamente comprovados. +1.500 stars no GitHub.",
    tags: ["Open Source", "Flutter", "Educational"],
    highlight: "1.5k+ Stars",
  },
  {
    name: "Hercules",
    description:
      "App de fitness no ecossistema Apple. Recebeu destaque como App do Dia na App Store.",
    tags: ["Apple Ecosystem", "Fitness", "Animations"],
    highlight: "App do Dia",
  },
  {
    name: "Coliseum",
    description:
      "Plataforma de matchmaking competitivo para e-Sports com Design System completo.",
    tags: ["UI/UX", "Design System", "E-Sports"],
    highlight: "E-Sports",
  },
  {
    name: "Studo",
    description:
      "Simulador de bolsa de valores para aprender a investir sem risco e ganhar prêmios reais.",
    tags: ["UI/UX", "Illustration", "FinTech"],
    highlight: "FinTech",
  },
  {
    name: "Contador Z",
    description:
      "Landing page de alta conversão com web design sob medida e tracking avançado via GTM.",
    tags: ["Web Design", "Webflow", "GTM"],
    highlight: "Web Design",
  },
];

const tickerItems = [
  "Flutter",
  "Firebase",
  "Webflow",
  "Figma",
  "Design Systems",
  "AI & Automação",
  "n8n",
  "Claude",
  "GPT",
  "React",
  "Next.js",
  "FlutterFlow",
  "Open Source",
  "UI/UX",
];

export function About() {
  const ref = useScrollReveal();

  return (
    <section className="mapa-section relative overflow-hidden" ref={ref}>
      <div className="grid-pattern" aria-hidden="true" />

      <div className="mapa-container relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="reveal mapa-small text-mapa-accent tracking-widest uppercase mb-4 block">
            Quem somos
          </span>
          <h2 className="reveal mapa-h2 text-mapa-text max-w-[700px] mx-auto">
            Por trás do <span className="text-accent-blue">MAPA</span>
          </h2>
          <p className="reveal mt-4 text-mapa-text-secondary max-w-lg mx-auto">
            Somos a{" "}
            <strong className="text-mapa-text font-semibold">Olympus</strong> —
            um estúdio boutique de design e desenvolvimento de software. Nossos
            produtos já impactaram mais de 1 milhão de usuários.
          </p>
        </div>

        {/* Stats row */}
        <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 mb-16">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="rounded-xl border border-mapa-border bg-mapa-surface1 p-6 text-center"
            >
              <p
                className="text-mapa-accent font-bold mb-1"
                style={{
                  fontFamily: "var(--font-syne)",
                  fontSize: "clamp(28px, 4vw, 40px)",
                  lineHeight: 1.1,
                }}
              >
                {stat.value}
              </p>
              <p className="text-mapa-text-secondary text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Ticker / Marquee */}
        <div className="reveal relative mb-16 overflow-hidden py-4">
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-mapa-bg to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-mapa-bg to-transparent" />
          <div className="ticker flex whitespace-nowrap gap-8">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span
                key={i}
                className="text-mapa-text-tertiary font-mono text-sm tracking-wider uppercase shrink-0"
              >
                {item}
                <span className="mx-4 text-mapa-border">{"///"}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Why qualified */}
        <div className="reveal text-center mb-10">
          <h3 className="mapa-h3 text-mapa-text mb-2">
            Por que a Olympus ensina automação com IA?
          </h3>
          <p className="text-mapa-text-secondary text-[15px] max-w-lg mx-auto leading-relaxed">
            Construímos produtos digitais há mais de 5 anos — de MVPs em 3
            semanas a apps premiados pela Apple. Usamos IA e automação no nosso
            dia a dia e agora ensinamos você a fazer o mesmo.
          </p>
        </div>

        {/* Bento grid of projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <div
              key={i}
              className={`reveal card-glow rounded-xl border border-mapa-border bg-mapa-surface2 p-6 flex flex-col transition-all duration-500 ${
                i === 0 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Highlight badge */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="mapa-h3 text-mapa-text">{project.name}</h3>
                <span className="text-[11px] text-mapa-accent bg-mapa-accent/10 px-2.5 py-1 rounded-full font-mono font-medium">
                  {project.highlight}
                </span>
              </div>

              <p className="text-mapa-text-secondary text-[15px] leading-relaxed flex-1">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {project.tags.map((tag, j) => (
                  <span
                    key={j}
                    className="text-[11px] text-mapa-text-tertiary bg-mapa-surface1 px-2 py-0.5 rounded font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
