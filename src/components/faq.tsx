"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const items = [
  {
    question: "Como funciona a mentoria?",
    answer:
      "Depois da compra, você entra em contato via WhatsApp. Definimos juntos o processo que você quer automatizar, e te guiamos passo a passo pela metodologia MAPA até a automação estar rodando.",
  },
  {
    question: "Preciso saber programar?",
    answer:
      "Não. O método é acessível para qualquer nível técnico. Te ensinamos a usar as ferramentas certas pro seu caso — muitas não exigem código nenhum.",
  },
  {
    question: "Qual o horário de atendimento?",
    answer:
      "O atendimento é assíncrono via WhatsApp, das 10:00 às 17:00 em dias úteis. O tempo máximo de resposta é 24h úteis. 100% humano — sem chatbot.",
  },
  {
    question: "Posso automatizar qualquer coisa?",
    answer:
      "Quase! O escopo é 1 processo digital de complexidade moderada (4-5 etapas). Não trabalhamos com integrações em sistemas governamentais ou bases financeiras fechadas. Definimos o escopo juntos no WhatsApp.",
  },
  {
    question: "Tem prazo pra terminar?",
    answer:
      "Não. A mentoria dura até a automação estar funcionando. Sem prazo artificial, sem pressão — no seu ritmo.",
  },
  {
    question: "Tem garantia?",
    answer:
      "Sim, 7 dias de garantia incondicional. Se nos primeiros 7 dias você perceber que a mentoria não é para você — por qualquer motivo — devolvemos 100% do investimento. Sem burocracia, sem perguntas, sem formulário. Basta mandar uma mensagem no WhatsApp.",
  },
  {
    question: "R$1.997 é caro?",
    answer:
      "R$1.997 parece muito até você calcular quanto custa continuar no manual. Se você gasta 2h por dia em tarefas repetitivas, são 40h por mês. A R$50 a hora, são R$2.000 por mês jogados fora. A mentoria se paga no primeiro mês — e o conhecimento fica para sempre.",
  },
  {
    question: "Posso aprender sozinho com YouTube e cursos?",
    answer:
      "Pode. Mas quantas horas você vai gastar testando a ferramenta errada, seguindo tutorial desatualizado e travando na integração? A mentoria é o atalho: você diz o que precisa, a gente te guia direto para a solução. Sem tentativa e erro.",
  },
  {
    question: "Preciso pensar mais.",
    answer:
      "Claro. Mas lembre: cada semana que passa sem automatizar são horas que você não recupera. E com 7 dias de garantia incondicional, você pode começar agora e decidir depois — sem risco nenhum.",
  },
  {
    question: "Quando abre mais vagas?",
    answer:
      "Não sabemos. Vamos focar 100% na turma que entrar agora.",
  },
  {
    question: "Já tentei automatizar e não deu certo.",
    answer:
      "Provavelmente porque tentou sozinho, sem método. A mentoria existe exatamente para isso: alguém que já fez dezenas de automações te guiando passo a passo, no seu contexto específico, até funcionar. Não é curso gravado — é acompanhamento real.",
  },
  {
    question: "Não sou técnico, consigo acompanhar?",
    answer:
      "Sim. Mais de 70% das ferramentas que usamos não exigem código. E quando exigem, te mostramos exatamente o que fazer, linha por linha. A metodologia MAPA foi desenhada para funcionar independente do seu nível técnico.",
  },
];

export function FAQ() {
  const ref = useScrollReveal();

  return (
    <section className="mapa-section" ref={ref}>
      <div className="mapa-container max-w-[700px]">
        <div className="text-center mb-16">
          <h2 className="reveal mapa-h2 text-mapa-text">
            Perguntas frequentes
          </h2>
        </div>

        <div className="reveal">
          <Accordion className="space-y-2">
            {items.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-mapa-border rounded-xl px-5 bg-mapa-surface1 data-[open]:border-mapa-border-hover transition-colors duration-300"
              >
                <AccordionTrigger className="text-mapa-text text-[15px] font-medium hover:no-underline py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-mapa-text-secondary text-[15px] leading-relaxed pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
