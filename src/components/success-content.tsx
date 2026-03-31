"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { WHATSAPP_PURCHASE_URL } from "@/lib/constants";

export function SuccessContent({
  paymentId,
}: {
  paymentId?: string;
}) {
  useEffect(() => {
    const end = Date.now() + 3000;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#0055FF", "#3399FF", "#25D366", "#EEEEF0"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#0055FF", "#3399FF", "#25D366", "#EEEEF0"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#030305" }}>
      <nav className="h-14 border-b border-mapa-border">
        <div className="mapa-container h-full flex items-center">
          <Link
            href="/"
            className="font-heading text-lg font-bold tracking-tight text-mapa-text no-underline"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            MAPA
          </Link>
        </div>
      </nav>

      <main className="mapa-container py-16 lg:py-24">
        <div className="max-w-lg mx-auto flex flex-col items-center text-center">
          {/* Green check icon */}
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-8">
            <svg
              className="w-10 h-10 text-[#25D366]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1
            className="mapa-h2 text-mapa-text"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Pagamento confirmado!
          </h1>
          <p className="mt-3 text-lg text-accent-blue font-medium">
            Bem-vindo à Mentoria MAPA
          </p>

          {paymentId && (
            <p className="mt-2 text-xs text-[#3A3A48] font-mono">
              ID: {paymentId}
            </p>
          )}

          {/* Next steps card */}
          <div className="mt-10 w-full rounded-2xl bg-[#101018] border border-[rgba(255,255,255,0.05)] p-6 text-left">
            <h2 className="text-[#EEEEF0] font-semibold text-base mb-4">
              Próximos passos:
            </h2>
            <ol className="space-y-4 text-sm text-[#888898]">
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[#0055FF]/10 text-[#0055FF] text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span>
                  Clique no botão abaixo para abrir o WhatsApp da mentoria
                </span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[#0055FF]/10 text-[#0055FF] text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span>
                  Envie uma mensagem dizendo{" "}
                  <span className="text-[#EEEEF0] font-medium">
                    &ldquo;Oi! Acabei de comprar a mentoria MAPA.&rdquo;
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[#0055FF]/10 text-[#0055FF] text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <span>
                  Nosso time vai te responder em até{" "}
                  <span className="text-[#EEEEF0] font-medium">
                    24h úteis
                  </span>
                </span>
              </li>
            </ol>
          </div>

          {/* WhatsApp CTA */}
          <a
            href={WHATSAPP_PURCHASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 w-full h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-base flex items-center justify-center gap-2 transition-colors no-underline"
          >
            <WhatsAppIcon className="w-5 h-5" />
            Iniciar mentoria no WhatsApp
          </a>

          <Link
            href="/"
            className="mt-6 text-sm text-[#555565] hover:text-[#888898] transition-colors no-underline"
          >
            Voltar ao site
          </Link>
        </div>
      </main>
    </div>
  );
}
