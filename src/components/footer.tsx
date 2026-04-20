"use client";

import { Separator } from "@/components/ui/separator";
import { WHATSAPP_URL } from "@/lib/constants";
import { trackIntent } from "@/lib/intent-tracking";

export function Footer() {
  return (
    <footer className="py-10">
      <div className="mapa-container">
        <Separator className="bg-mapa-border mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span
              className="font-bold text-mapa-text text-sm tracking-tight"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              MAPA
            </span>
            <span className="text-mapa-text-hint text-xs">by Olympus</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-mapa-text-hint hover:text-mapa-text-secondary text-xs transition-colors duration-300"
            >
              Termos
            </a>
            <a
              href="#"
              className="text-mapa-text-hint hover:text-mapa-text-secondary text-xs transition-colors duration-300"
            >
              Privacidade
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                void trackIntent({ source: "whatsapp", location: "footer" });
              }}
              className="text-mapa-text-hint hover:text-mapa-text-secondary text-xs transition-colors duration-300"
            >
              WhatsApp
            </a>
          </div>

          <p className="text-mapa-text-hint text-xs">
            &copy; 2026 MAPA. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
