/**
 * Meta Conversions API (CAPI) — server-side event sending.
 *
 * Docs: https://developers.facebook.com/docs/marketing-api/conversions-api
 *
 * This module is SERVER-ONLY. It reads process.env directly and must never
 * be imported from client components. The "use server" pragma is intentionally
 * omitted since this is a plain utility, not a Next.js Server Action.
 *
 * Environment variables required (Vercel):
 *   META_CAPI_ACCESS_TOKEN  — System User token with ads_management scope
 *   NEXT_PUBLIC_META_PIXEL_ID — Pixel / Dataset ID
 */

const GRAPH_API_VERSION = "v21.0";

export interface CapiUserData {
  client_ip_address?: string;
  client_user_agent?: string;
  /** Plain-text email — will be SHA-256 hashed before sending */
  email?: string;
  /** Plain-text phone (any format) — will be normalised + SHA-256 hashed */
  phone?: string;
  /** Pre-hashed values — used as-is if provided (takes precedence over plain-text) */
  em?: string;
  ph?: string;
  fbc?: string;
  fbp?: string;
}

export interface CapiCustomData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_type?: string;
  order_id?: string;
  [key: string]: unknown;
}

export interface CapiEventParams {
  event_name: string;
  /** Unix timestamp in seconds. Defaults to Date.now() / 1000. */
  event_time?: number;
  event_id?: string;
  /** Default: "website" */
  action_source?: string;
  event_source_url?: string;
  user_data?: CapiUserData;
  custom_data?: CapiCustomData;
}

export interface CapiResult {
  ok: boolean;
  fbtrace_id?: string;
  events_received?: number;
  error?: string;
}

// ---------------------------------------------------------------------------
// SHA-256 hashing via Node.js crypto (server-side only)
// ---------------------------------------------------------------------------

async function sha256(value: string): Promise<string> {
  const { createHash } = await import("crypto");
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/**
 * Normalise a phone number to E.164 digits only (no "+").
 * Adds Brazilian country code "55" if not present.
 */
function normalisePhoneForHashing(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  // Remove leading zeros for country code matching
  if (digits.startsWith("55") && digits.length >= 12) {
    return digits;
  }
  return `55${digits}`;
}

// ---------------------------------------------------------------------------
// Main function
// ---------------------------------------------------------------------------

export async function sendCapiEvent(params: CapiEventParams): Promise<CapiResult> {
  if (typeof window !== "undefined") {
    throw new Error("[CAPI] sendCapiEvent must only be called server-side.");
  }

  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  if (!accessToken) {
    console.error("[CAPI] META_CAPI_ACCESS_TOKEN not set — skipping event send");
    return { ok: false, error: "META_CAPI_ACCESS_TOKEN not configured" };
  }

  if (!pixelId) {
    console.error("[CAPI] NEXT_PUBLIC_META_PIXEL_ID not set — skipping event send");
    return { ok: false, error: "NEXT_PUBLIC_META_PIXEL_ID not configured" };
  }

  // Build hashed user_data
  const rawUserData = params.user_data ?? {};
  const hashedUserData: Record<string, string> = {};

  if (rawUserData.em) {
    hashedUserData.em = rawUserData.em; // already hashed
  } else if (rawUserData.email) {
    hashedUserData.em = await sha256(rawUserData.email);
  }

  if (rawUserData.ph) {
    hashedUserData.ph = rawUserData.ph; // already hashed
  } else if (rawUserData.phone) {
    const normalised = normalisePhoneForHashing(rawUserData.phone);
    hashedUserData.ph = await sha256(normalised);
  }

  if (rawUserData.client_ip_address) {
    hashedUserData.client_ip_address = rawUserData.client_ip_address;
  }
  if (rawUserData.client_user_agent) {
    hashedUserData.client_user_agent = rawUserData.client_user_agent;
  }
  if (rawUserData.fbc) hashedUserData.fbc = rawUserData.fbc;
  if (rawUserData.fbp) hashedUserData.fbp = rawUserData.fbp;

  const eventPayload = {
    event_name: params.event_name,
    event_time: params.event_time ?? Math.floor(Date.now() / 1000),
    event_id: params.event_id,
    action_source: params.action_source ?? "website",
    event_source_url: params.event_source_url,
    user_data: hashedUserData,
    custom_data: params.custom_data,
  };

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events`;

  const body = {
    data: [eventPayload],
    access_token: accessToken,
  };

  console.log(
    `[CAPI] Sending ${params.event_name} event_id=${params.event_id ?? "none"}`
  );

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (!res.ok || json.error) {
      const errMsg = json.error?.message ?? `HTTP ${res.status}`;
      console.error(`[CAPI] API error for ${params.event_name}: ${errMsg}`);
      return { ok: false, error: errMsg };
    }

    console.log(
      `[CAPI] ${params.event_name} accepted — events_received=${json.events_received} fbtrace_id=${json.fbtrace_id}`
    );
    return {
      ok: true,
      fbtrace_id: json.fbtrace_id,
      events_received: json.events_received,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[CAPI] Network error sending ${params.event_name}: ${msg}`);
    return { ok: false, error: msg };
  }
}
