"use client";

import { generateEventId } from "@/lib/event-id";
import { posthog } from "@/lib/posthog";
import {
  buildIntentArtifacts,
  type ContactIntentSource,
} from "@/lib/whatsapp-truth";

export async function trackIntent(input: {
  source: ContactIntentSource;
  location: string;
}): Promise<string> {
  const eventID = generateEventId();
  const { metaEventName } = buildIntentArtifacts({
    eventID,
    source: input.source,
    location: input.location,
  });

  posthog.capture("mapa_intent", {
    source: input.source,
    location: input.location,
    meta_event_name: metaEventName,
    event_id: eventID,
  });

  if (typeof window !== "undefined" && window.fbq) {
    window.fbq(
      "trackCustom",
      metaEventName,
      {
        source: input.source,
        location: input.location,
      },
      { eventID }
    );
  }

  fetch("/api/events/intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventID,
      source: input.source,
      location: input.location,
    }),
    keepalive: true,
  }).catch(() => {
    // Non-fatal — semantic intent tracking must not block UX
  });

  return eventID;
}
