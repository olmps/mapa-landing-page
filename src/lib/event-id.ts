/**
 * Event ID utilities for Meta Pixel / CAPI deduplication.
 *
 * Browser pixel and server-side CAPI must share the same event_id so Meta
 * can deduplicate and not count the same conversion twice.
 *
 * Usage (client):
 *   const id = generateEventId();
 *   setStoredEventId('ic', id);          // store for later retrieval
 *   fbq('track', 'InitiateCheckout', {}, { eventID: id });
 *   // pass id to the server via POST body
 *
 * Key naming convention:
 *   'ic'  → InitiateCheckout
 *   'api' → AddPaymentInfo
 *   'pur' → Purchase
 */

export function generateEventId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function setStoredEventId(key: string, id: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(`mapa_eid_${key}`, id);
  } catch {
    // sessionStorage may be blocked in private browsing — non-fatal
  }
}

export function getStoredEventId(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(`mapa_eid_${key}`);
  } catch {
    return null;
  }
}
