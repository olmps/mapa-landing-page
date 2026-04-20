"use client";

import { WHATSAPP_URL } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { trackIntent } from "@/lib/intent-tracking";

export function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      onClick={() => {
        void trackIntent({ source: "whatsapp", location: "floating_button" });
      }}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-[#25D366]/25 transition-all duration-300 hover:scale-110 no-underline"
    >
      <WhatsAppIcon className="w-6 h-6" />
    </a>
  );
}
