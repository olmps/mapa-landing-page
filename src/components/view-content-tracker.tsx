"use client";

import { useEffect } from "react";
import { generateEventId } from "@/lib/event-id";
import { PRODUCT_NAME, PRODUCT_PRICE } from "@/lib/constants";

/**
 * Fires a single Meta Pixel ViewContent event per session when the home page mounts.
 * Guarded by sessionStorage flag "vc_sent" to prevent duplicates on re-renders.
 * Does not handle CAPI — that is handled separately by @mapa-integrations.
 */
export function ViewContentTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.fbq) return;

    try {
      if (sessionStorage.getItem("vc_sent") === "1") return;
    } catch {
      // sessionStorage blocked (private browsing) — fire anyway, better over than under
    }

    const eventId = generateEventId();

    window.fbq(
      "track",
      "ViewContent",
      {
        content_type: "product",
        content_name: PRODUCT_NAME,
        content_category: "mentoria",
        value: PRODUCT_PRICE,
        currency: "BRL",
      },
      { eventID: eventId }
    );

    try {
      sessionStorage.setItem("vc_sent", "1");
    } catch {
      // non-fatal
    }
  }, []);

  return null;
}
