"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { WHATSAPP_URL } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/icons/whatsapp";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-14 glass transition-all duration-500 ${
        scrolled ? "border-b border-mapa-border" : ""
      }`}
    >
      <div className="mapa-container h-full flex items-center justify-between">
        <a
          href="#"
          className="font-heading text-lg font-bold tracking-tight text-mapa-text"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          MAPA
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ size: "sm" }),
            "rounded-full bg-mapa-accent hover:bg-mapa-accent-md text-white text-sm font-medium px-5 h-9 transition-colors duration-300 no-underline"
          )}
        >
          <WhatsAppIcon className="w-4 h-4" />
          Falar no WhatsApp
        </a>
      </div>
    </nav>
  );
}
