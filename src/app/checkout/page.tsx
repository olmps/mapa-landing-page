import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout-form";
import { PRODUCT_PRICE, PIX_PRICE, PRODUCT_NAME, WHATSAPP_URL } from "@/lib/constants";
import { getVagasRestantes } from "@/lib/edge-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout — Mentoria MAPA",
};

export default async function CheckoutPage() {
  const vagasRestantes = await getVagasRestantes();
  const esgotado = vagasRestantes === 0;

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
        <div className="max-w-lg mx-auto">
          {esgotado ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-2 mb-8">
                <span className="w-2 h-2 rounded-full bg-[#555565]" />
                <span className="text-[#888898] text-sm font-medium">
                  Vagas esgotadas
                </span>
              </div>
              <h1
                className="mapa-h2 text-mapa-text mb-4"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                As vagas da primeira turma foram preenchidas.
              </h1>
              <p className="text-[#888898] mb-10 leading-relaxed">
                Não há vagas disponíveis no momento. Entre no WhatsApp para
                ser avisado quando abrirmos a próxima turma.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#0055FF] hover:bg-[#0066FF] text-white font-semibold h-14 px-10 text-base transition-colors no-underline"
              >
                Entrar na lista de espera
              </a>
              <p className="mt-6 text-[#3A3A48] text-sm">
                <Link href="/" className="text-[#555565] hover:text-[#888898] transition-colors no-underline">
                  Voltar para a página inicial
                </Link>
              </p>
            </div>
          ) : (
            <>
              <h1
                className="mapa-h2 text-mapa-text"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                Finalizar compra
              </h1>
              <p className="mt-2 text-mapa-text-secondary">
                {PRODUCT_NAME} — 12x de{" "}
                <span className="text-mapa-text font-semibold">
                  R${(Math.ceil((PRODUCT_PRICE / 12) * 100) / 100).toFixed(2).replace(".", ",")}
                </span>
                {" "}ou{" "}
                <span className="text-green-400 font-semibold">
                  R${PIX_PRICE.toFixed(2).replace(".", ",")} no Pix
                </span>
              </p>

              <div className="mt-10">
                <CheckoutForm />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
