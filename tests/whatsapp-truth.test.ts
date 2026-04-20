import test from "node:test";
import assert from "node:assert/strict";

import {
  applyTruthEvents,
  buildIntentArtifacts,
  createEmptyTruthStore,
  normalizeWebhookPayload,
  type TruthEvent,
} from "../src/lib/whatsapp-truth";

test("normalizeWebhookPayload parses forwarded Meta inbound messages", () => {
  const payload = {
    object: "whatsapp_business_account",
    entry: [
      {
        changes: [
          {
            field: "messages",
            value: {
              contacts: [
                {
                  wa_id: "5511999999999",
                  profile: { name: "Maria" },
                },
              ],
              messages: [
                {
                  id: "wamid.in.1",
                  from: "5511999999999",
                  timestamp: "1776709291",
                  type: "text",
                  text: { body: "Oi! Quero saber mais." },
                },
              ],
            },
          },
        ],
      },
    ],
  };

  const events = normalizeWebhookPayload(payload);

  assert.equal(events.length, 1);
  assert.equal(events[0]?.kind, "customer_message");
  assert.equal(events[0]?.contactKey, "5511999999999");
  assert.equal(events[0]?.messageId, "wamid.in.1");
});

test("normalizeWebhookPayload parses Kapso structured conversation creation", () => {
  const payload = {
    event: "whatsapp.conversation.created",
    data: {
      id: "conv_123",
      phone_number: "5511888888888",
      business_scoped_user_id: "BR.12345",
      created_at: "2026-04-20T18:00:00Z",
    },
  };

  const events = normalizeWebhookPayload(payload);

  assert.equal(events.length, 1);
  assert.equal(events[0]?.kind, "conversation_created");
  assert.equal(events[0]?.contactKey, "5511888888888");
  assert.equal(events[0]?.conversationId, "conv_123");
});

test("applyTruthEvents deduplicates repeated webhook events and keeps conversation count semantic", () => {
  const inbound: TruthEvent = {
    kind: "customer_message",
    eventKey: "message:wamid.in.1",
    occurredAt: "2026-04-20T18:00:00Z",
    contactKey: "5511999999999",
    phoneNumber: "5511999999999",
    messageId: "wamid.in.1",
  };

  const secondInbound: TruthEvent = {
    kind: "customer_message",
    eventKey: "message:wamid.in.2",
    occurredAt: "2026-04-20T18:05:00Z",
    contactKey: "5511999999999",
    phoneNumber: "5511999999999",
    messageId: "wamid.in.2",
  };

  const readStatus: TruthEvent = {
    kind: "outbound_status",
    eventKey: "status:wamid.out.1:read",
    occurredAt: "2026-04-20T18:06:00Z",
    contactKey: "5511999999999",
    phoneNumber: "5511999999999",
    status: "read",
    messageId: "wamid.out.1",
  };

  const store = applyTruthEvents(
    createEmptyTruthStore(),
    [inbound, inbound, secondInbound, readStatus],
    "2026-04-20T18:06:00Z"
  );

  assert.equal(store.summary.conversationsStarted, 1);
  assert.equal(store.summary.inboundMessages, 2);
  assert.equal(store.summary.outboundRead, 1);
  assert.equal(store.conversations["5511999999999"]?.inboundCount, 2);
  assert.equal(store.conversations["5511999999999"]?.lastOutboundStatus, "read");
  assert.equal(store.processedEventKeys.includes("message:wamid.in.1"), true);
});

test("applyTruthEvents tracks contact intent separately from real conversations", () => {
  const store = applyTruthEvents(
    createEmptyTruthStore(),
    [
      {
        kind: "contact_intent",
        eventKey: "intent:hero:abc",
        occurredAt: "2026-04-20T18:00:00Z",
        source: "whatsapp",
        location: "hero",
      },
      {
        kind: "contact_intent",
        eventKey: "intent:investimento:def",
        occurredAt: "2026-04-20T18:01:00Z",
        source: "investimento",
        location: "final_cta",
      },
    ],
    "2026-04-20T18:01:00Z"
  );

  assert.equal(store.summary.contactIntents, 2);
  assert.equal(store.summary.contactIntentBySource.whatsapp, 1);
  assert.equal(store.summary.contactIntentBySource.investimento, 1);
  assert.equal(store.summary.conversationsStarted, 0);
});

test("buildIntentArtifacts maps source to the correct semantic custom event", () => {
  const whatsapp = buildIntentArtifacts({
    eventID: "evt-whatsapp",
    source: "whatsapp",
    location: "hero",
    occurredAt: "2026-04-20T18:10:00Z",
  });
  const investimento = buildIntentArtifacts({
    eventID: "evt-investimento",
    source: "investimento",
    location: "final_cta",
    occurredAt: "2026-04-20T18:11:00Z",
  });

  assert.equal(whatsapp.metaEventName, "WhatsAppIntent");
  assert.equal(investimento.metaEventName, "InvestimentoIntent");
  assert.equal(whatsapp.truthEvent.kind, "contact_intent");
  assert.equal(whatsapp.truthEvent.source, "whatsapp");
  assert.equal(investimento.truthEvent.source, "investimento");
});

test("mixed Kapso and forwarded Meta payloads for the same contact merge into one conversation key", () => {
  const structured = normalizeWebhookPayload({
    event: "whatsapp.conversation.created",
    data: {
      id: "conv_merged",
      phone_number: "5511888888888",
      business_scoped_user_id: "BR.12345",
      created_at: "2026-04-20T18:00:00Z",
    },
  });

  const forwarded = normalizeWebhookPayload({
    object: "whatsapp_business_account",
    entry: [
      {
        changes: [
          {
            field: "messages",
            value: {
              contacts: [{ wa_id: "5511888888888", profile: { name: "Maria" } }],
              messages: [
                {
                  id: "wamid.in.merge",
                  from: "5511888888888",
                  timestamp: "1776709291",
                  type: "text",
                  text: { body: "Oi" },
                },
              ],
            },
          },
        ],
      },
    ],
  });

  const store = applyTruthEvents(
    createEmptyTruthStore(),
    [...structured, ...forwarded],
    "2026-04-20T18:20:00Z"
  );

  assert.equal(store.summary.conversationsStarted, 1);
  assert.equal(Object.keys(store.conversations).length, 1);
  assert.equal(store.conversations["5511888888888"]?.conversationId, "conv_merged");
});

test("normalizeWebhookPayload parses real Kapso v2 webhook using X-Webhook-Event semantics", () => {
  const payload = {
    message: {
      id: "wamid.real.1",
      timestamp: "1730092800",
      type: "text",
      from: "5511999999999",
      from_user_id: "BR.12345",
      text: { body: "Olá" },
      kapso: {
        direction: "inbound",
        status: "received",
        processing_status: "pending",
        origin: "cloud_api",
        has_media: false,
        content: "Olá",
      },
    },
    conversation: {
      id: "conv_real_1",
      phone_number: "5511999999999",
      business_scoped_user_id: "BR.12345",
      status: "active",
      created_at: "2025-10-28T13:40:00Z",
      updated_at: "2025-10-28T14:25:01Z",
      phone_number_id: "123456789012345",
    },
    is_new_conversation: true,
    phone_number_id: "123456789012345",
  };

  const events = normalizeWebhookPayload(payload, {
    webhookEvent: "whatsapp.message.received",
  });

  assert.equal(events.length, 1);
  assert.equal(events[0]?.kind, "customer_message");
  assert.equal(events[0]?.contactKey, "5511999999999");
  assert.equal(events[0]?.conversationId, "conv_real_1");
  assert.equal(events[0]?.messageId, "wamid.real.1");
});
