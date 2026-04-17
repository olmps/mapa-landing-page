import { NextResponse } from "next/server";
import { sendCapiEvent } from "@/lib/capi";

/**
 * POST /api/events/lead
 *
 * Receives a Lead event fired client-side (fbq 'track' 'Lead') and mirrors it
 * server-side via Meta Conversions API for deduplication and improved match rate.
 *
 * Body:
 *   eventID  — UUID generated client-side, must match the eventID passed to fbq()
 *   source   — 'whatsapp' | 'investimento' (for attribution/debugging)
 *
 * This endpoint is fire-and-forget: the client does not need to await the
 * response. Always returns 200 immediately even on CAPI failure (non-fatal).
 *
 * Dedup strategy:
 *   - WhatsApp CTAs (hero, final-cta, qualify-cta): generate a fresh eventID
 *     per click and pass it directly in the request body.
 *   - Investimento CTA (pricing section, added by @mapa-lp): stores eventID in
 *     sessionStorage under key 'lead_investimento_event_id', then sends here
 *     with source='investimento'.
 *
 * Meta deduplicates browser + server events that share the same event_id within
 *   a 48-hour window (https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events).
 */

interface LeadEventBody {
  eventID?: string;
  source?: "whatsapp" | "investimento";
}

export async function POST(request: Request) {
  try {
    const body: LeadEventBody = await request.json().catch(() => ({}));

    const { eventID, source = "whatsapp" } = body;

    // Extract client context from request headers
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.headers.get("x-real-ip") ??
      undefined;
    const userAgent = request.headers.get("user-agent") ?? undefined;

    // Resolve event source URL by source type
    const eventSourceUrl =
      source === "investimento"
        ? "https://mapa.olmps.co/#investimento"
        : "https://mapa.olmps.co";

    // Fire CAPI non-blocking — do not await; client gets 200 immediately
    sendCapiEvent({
      event_name: "Lead",
      event_id: eventID,
      event_source_url: eventSourceUrl,
      user_data: {
        client_ip_address: clientIp,
        client_user_agent: userAgent,
      },
    }).catch((err) => {
      console.error(`[/api/events/lead] CAPI Lead error (source=${source}):`, err);
    });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    // Non-fatal — log and still return 200 (fire-and-forget contract)
    console.error("[/api/events/lead] Unexpected error:", err);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
