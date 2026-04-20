import { NextResponse } from "next/server";
import { sendCapiEvent } from "@/lib/capi";
import { buildIntentArtifacts, type ContactIntentSource } from "@/lib/whatsapp-truth";
import { recordWhatsAppTruthEvents } from "@/lib/whatsapp-truth-store";

interface IntentEventBody {
  eventID?: string;
  source?: ContactIntentSource;
  location?: string;
}

function getEventSourceUrl(source: ContactIntentSource) {
  return source === "investimento"
    ? "https://mapa.olmps.co/#investimento"
    : "https://mapa.olmps.co";
}

export async function POST(request: Request) {
  try {
    const body: IntentEventBody = await request.json().catch(() => ({}));
    const source = body.source === "investimento" ? "investimento" : "whatsapp";
    const location = body.location?.trim() || "unknown";
    const eventID = body.eventID?.trim();

    if (!eventID) {
      return NextResponse.json({ error: "Missing eventID" }, { status: 400 });
    }

    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.headers.get("x-real-ip") ??
      undefined;
    const userAgent = request.headers.get("user-agent") ?? undefined;

    const { metaEventName, truthEvent } = buildIntentArtifacts({
      eventID,
      source,
      location,
    });

    await recordWhatsAppTruthEvents([truthEvent], truthEvent.occurredAt).catch((error) => {
      console.error("[/api/events/intent] Failed to persist intent:", error);
    });

    sendCapiEvent({
      event_name: metaEventName,
      event_id: eventID,
      event_source_url: getEventSourceUrl(source),
      user_data: {
        client_ip_address: clientIp,
        client_user_agent: userAgent,
      },
      custom_data: {
        source,
        location,
      },
    }).catch((error) => {
      console.error(`[/api/events/intent] CAPI error for ${metaEventName}:`, error);
    });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("[/api/events/intent] Unexpected error:", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
