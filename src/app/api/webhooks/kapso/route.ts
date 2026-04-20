import { NextResponse } from "next/server";
import { normalizeWebhookPayload } from "@/lib/whatsapp-truth";
import { recordWhatsAppTruthEvents } from "@/lib/whatsapp-truth-store";

function getAuthState(request: Request) {
  const expected = process.env.KAPSO_WEBHOOK_TOKEN;
  if (!expected) {
    return {
      ok: process.env.NODE_ENV === "development",
      reason: "missing-config" as const,
    };
  }

  const url = new URL(request.url);
  const tokenFromQuery = url.searchParams.get("token");
  const tokenFromHeader =
    request.headers.get("x-kapso-webhook-token") ??
    request.headers.get("x-webhook-token") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  return {
    ok: tokenFromQuery === expected || tokenFromHeader === expected,
    reason: "unauthorized" as const,
  };
}

export async function GET() {
  return NextResponse.json({ ok: true, route: "kapso-webhook" }, { status: 200 });
}

export async function POST(request: Request) {
  const auth = getAuthState(request);
  if (!auth.ok) {
    if (auth.reason === "missing-config") {
      console.error("[Kapso Webhook] KAPSO_WEBHOOK_TOKEN is not configured.");
      return NextResponse.json({ error: "Webhook token not configured" }, { status: 503 });
    }
    console.warn("[Kapso Webhook] Unauthorized request");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const webhookEvent = request.headers.get("x-webhook-event") ?? undefined;
    const events = normalizeWebhookPayload(body, { webhookEvent });

    if (events.length === 0) {
      console.warn("[Kapso Webhook] No recognizable events in payload", {
        webhookEvent,
      });
      return NextResponse.json({ received: true, recognized: 0 }, { status: 200 });
    }

    let store;
    try {
      store = await recordWhatsAppTruthEvents(events);
    } catch (error) {
      console.error("[Kapso Webhook] Failed to persist normalized events:", error);
      return NextResponse.json({ error: "Persistence failed" }, { status: 500 });
    }

    return NextResponse.json(
      {
        received: true,
        recognized: events.length,
        conversations_started: store.summary.conversationsStarted,
        inbound_messages: store.summary.inboundMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Kapso Webhook] Unexpected error:", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
