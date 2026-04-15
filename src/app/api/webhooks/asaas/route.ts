import { NextResponse } from "next/server";
import { decrementVagas } from "@/lib/edge-config";
import { sendCapiEvent } from "@/lib/capi";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AsaasPayment {
  id: string;
  customer: string; // customer ID, e.g. "cus_xxx"
  value: number;
  status: string;
  customerName?: string;   // present in some webhook payloads
  customerPhone?: string;  // present in some webhook payloads
  externalReference?: string; // purchaseEventId stored during checkout
}

interface AsaasWebhookBody {
  event: string;
  payment?: AsaasPayment;
}

interface AsaasCustomer {
  id: string;
  name: string;
  email?: string;
  mobilePhone?: string;
  phone?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const KAPSO_API_URL = "https://api.kapso.ai/meta/whatsapp/v24.0";
const PHONE_NUMBER_ID = "1054751764388687";
const TEMPLATE_NAME = "mapa_welcome_purchase";
const TEMPLATE_LANGUAGE = "pt_BR";

const ASAAS_BASE_URL =
  process.env.ASAAS_SANDBOX === "true"
    ? "https://sandbox.asaas.com/api/v3"
    : "https://api.asaas.com/v3";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Fetch full customer data from Asaas API.
 * Needed when the webhook payload does not include name/phone directly.
 */
async function fetchAsaasCustomer(customerId: string): Promise<AsaasCustomer> {
  const res = await fetch(`${ASAAS_BASE_URL}/customers/${customerId}`, {
    headers: {
      "Content-Type": "application/json",
      access_token: process.env.ASAAS_API_KEY!,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `Asaas customers API error ${res.status}: ${JSON.stringify(err)}`
    );
  }

  return res.json();
}

/**
 * Extract first name from a full name string.
 * "Jonata Weber" → "Jonata"
 */
function extractFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName.trim();
}

/**
 * Normalise a Brazilian phone number to E.164 format without leading "+".
 * Asaas may return numbers with or without country code.
 * Examples:
 *   "11987654321"   → "5511987654321"
 *   "5511987654321" → "5511987654321"
 *   "(11) 98765-4321" → "5511987654321"
 */
function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("55") && digits.length >= 12) {
    return digits;
  }
  return `55${digits}`;
}

/**
 * Send a WhatsApp template message via the Kapso API.
 * Returns true on success, false on any API-level failure so the caller can
 * decide whether to surface the error without blocking Asaas retries.
 */
async function sendWelcomeTemplate(
  phone: string,
  firstName: string
): Promise<boolean> {
  const kapsoKey = process.env.KAPSO_API_KEY;
  if (!kapsoKey) {
    console.error("[Asaas Webhook] KAPSO_API_KEY not set — skipping WhatsApp send");
    return false;
  }

  const url = `${KAPSO_API_URL}/${PHONE_NUMBER_ID}/messages`;

  const body = {
    messaging_product: "whatsapp",
    to: normalisePhone(phone),
    type: "template",
    template: {
      name: TEMPLATE_NAME,
      language: { code: TEMPLATE_LANGUAGE },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              parameter_name: "first_name",
              text: firstName,
            },
          ],
        },
      ],
    },
  };

  console.log(
    `[Asaas Webhook] Sending template "${TEMPLATE_NAME}" to ${normalisePhone(phone)} (${firstName})`
  );

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": kapsoKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error(
      `[Asaas Webhook] Kapso API error ${res.status}:`,
      JSON.stringify(err)
    );
    return false;
  }

  const data = await res.json();
  console.log(
    `[Asaas Webhook] WhatsApp message sent. Message ID: ${data?.messages?.[0]?.id ?? "unknown"}`
  );
  return true;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  // Always respond 200 to Asaas so it does not keep retrying on our errors.
  // We capture and log any internal failures independently.
  try {
    // --- Authentication ---
    const token = request.headers.get("asaas-access-token");
    if (token !== process.env.ASAAS_WEBHOOK_TOKEN) {
      console.warn("[Asaas Webhook] Unauthorized request — invalid token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // --- Parse body ---
    const body: AsaasWebhookBody = await request.json();

    console.log(`[Asaas Webhook] Event received: ${body.event}`);

    // --- Guard: only process payment confirmation events ---
    if (
      body.event !== "PAYMENT_CONFIRMED" &&
      body.event !== "PAYMENT_RECEIVED"
    ) {
      console.log(`[Asaas Webhook] Ignoring event: ${body.event}`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const payment = body.payment;
    if (!payment) {
      console.warn("[Asaas Webhook] No payment object in body — skipping");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    console.log(
      `[Asaas Webhook] ${body.event} — Payment ${payment.id}, Customer ${payment.customer}`
    );

    // --- Resolve customer name, phone, and email ---
    // The Asaas webhook payload does not always include name/phone directly
    // so we fall back to a customer API lookup when needed.
    let customerName: string;
    let customerPhone: string;
    let customerEmail: string | undefined;

    if (payment.customerName && payment.customerPhone) {
      customerName = payment.customerName;
      customerPhone = payment.customerPhone;
    } else {
      try {
        const customer = await fetchAsaasCustomer(payment.customer);
        customerName = customer.name;
        customerPhone = customer.mobilePhone ?? customer.phone ?? "";
        customerEmail = customer.email;
      } catch (err) {
        console.error("[Asaas Webhook] Failed to fetch customer from Asaas:", err);
        // Respond 200 so Asaas does not retry — the purchase already happened.
        return NextResponse.json({ received: true }, { status: 200 });
      }
    }

    if (!customerPhone) {
      console.warn(
        `[Asaas Webhook] Customer ${payment.customer} has no phone — skipping WhatsApp send`
      );
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // --- Fire CAPI Purchase (server-side, authoritative) ---
    // event_id matches the purchaseEventId generated during checkout form submit
    // and stored in externalReference. The browser-side fbq('track','Purchase')
    // in success-content.tsx fires the same event_id — Meta deduplicates them.
    const purchaseEventId = payment.externalReference ?? undefined;
    sendCapiEvent({
      event_name: "Purchase",
      event_id: purchaseEventId,
      event_source_url: "https://mapa.olmps.co/success",
      user_data: {
        email: customerEmail,
        phone: customerPhone,
      },
      custom_data: {
        value: payment.value,
        currency: "BRL",
        content_name: "Mentoria MAPA",
        content_type: "product",
        order_id: payment.id,
      },
    }).catch((err) => {
      // Non-fatal — log and continue so Asaas gets its 200
      console.error("[Asaas Webhook] CAPI Purchase error:", err);
    });

    // --- Decrement vagas ---
    await decrementVagas().catch((err) => {
      console.error("[Asaas Webhook] Failed to decrement vagas:", err);
    });

    // --- Send welcome template via Kapso ---
    const firstName = extractFirstName(customerName);
    await sendWelcomeTemplate(customerPhone, firstName).catch((err) => {
      // Non-fatal: log and continue so Asaas gets its 200
      console.error("[Asaas Webhook] Unexpected error sending WhatsApp:", err);
    });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("[Asaas Webhook] Unhandled error:", error);
    // Still return 200 to prevent Asaas from retrying indefinitely
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
