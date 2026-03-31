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
      "Sim, 7 dias de garantia incondicional. Se você não gostar por qualquer motivo, devolvemos 100% do seu investimento.",
  },
  {
    question: "Quando abre mais vagas?",
    answer:
      "Não sabemos. Vamos focar 100% na turma que entrar agora.",
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
