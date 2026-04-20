export type ContactIntentSource = "whatsapp" | "investimento";
export type OutboundStatus = "sent" | "delivered" | "read" | "failed";

export interface BaseTruthEvent {
  eventKey: string;
  occurredAt: string;
  contactKey?: string;
  phoneNumber?: string;
  businessScopedUserId?: string;
  conversationId?: string;
  messageId?: string;
}

export interface ContactIntentEvent extends BaseTruthEvent {
  kind: "contact_intent";
  source: ContactIntentSource;
  location: string;
}

export interface ConversationCreatedEvent extends BaseTruthEvent {
  kind: "conversation_created";
}

export interface CustomerMessageEvent extends BaseTruthEvent {
  kind: "customer_message";
}

export interface OutboundStatusEvent extends BaseTruthEvent {
  kind: "outbound_status";
  status: OutboundStatus;
}

export type TruthEvent =
  | ContactIntentEvent
  | ConversationCreatedEvent
  | CustomerMessageEvent
  | OutboundStatusEvent;

export interface TruthConversation {
  contactKey: string;
  phoneNumber?: string;
  businessScopedUserId?: string;
  conversationId?: string;
  startedAt?: string;
  lastInboundAt?: string;
  inboundCount: number;
  lastOutboundAt?: string;
  lastOutboundStatus?: OutboundStatus;
}

export interface TruthStore {
  version: 1;
  updatedAt: string | null;
  summary: {
    contactIntents: number;
    contactIntentBySource: Record<ContactIntentSource, number>;
    conversationsStarted: number;
    inboundMessages: number;
    outboundSent: number;
    outboundDelivered: number;
    outboundRead: number;
    outboundFailed: number;
  };
  conversations: Record<string, TruthConversation>;
  processedEventKeys: string[];
}

export function buildIntentArtifacts(input: {
  eventID: string;
  source: ContactIntentSource;
  location: string;
  occurredAt?: string;
}) {
  const occurredAt = input.occurredAt ?? new Date().toISOString();
  return {
    metaEventName:
      input.source === "whatsapp" ? "WhatsAppIntent" : "InvestimentoIntent",
    truthEvent: {
      kind: "contact_intent" as const,
      eventKey: `intent:${input.source}:${input.location}:${input.eventID}`,
      occurredAt,
      source: input.source,
      location: input.location,
    },
  };
}

const MAX_PROCESSED_EVENT_KEYS = 500;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function getContactKey(input: {
  businessScopedUserId?: string;
  phoneNumber?: string;
  from?: string;
  waId?: string;
  conversationId?: string;
}) {
  return (
    input.phoneNumber ??
    input.from ??
    input.waId ??
    input.businessScopedUserId ??
    input.conversationId
  );
}

function toIsoFromUnixSeconds(value: string | undefined): string {
  if (!value) return new Date(0).toISOString();
  const unixSeconds = Number(value);
  if (Number.isNaN(unixSeconds)) return value;
  return new Date(unixSeconds * 1000).toISOString();
}

export function createEmptyTruthStore(): TruthStore {
  return {
    version: 1,
    updatedAt: null,
    summary: {
      contactIntents: 0,
      contactIntentBySource: {
        whatsapp: 0,
        investimento: 0,
      },
      conversationsStarted: 0,
      inboundMessages: 0,
      outboundSent: 0,
      outboundDelivered: 0,
      outboundRead: 0,
      outboundFailed: 0,
    },
    conversations: {},
    processedEventKeys: [],
  };
}

function normalizeKapsoStructuredWebhook(payload: Record<string, unknown>): TruthEvent[] {
  const event = asString(payload.event);
  const data = isRecord(payload.data) ? payload.data : {};
  if (!event) return [];

  const conversationId = asString(data.id);
  const businessScopedUserId = asString(data.business_scoped_user_id);
  const phoneNumber = asString(data.phone_number);
  const occurredAt =
    asString(data.created_at) ??
    asString(data.updated_at) ??
    new Date().toISOString();
  const contactKey = getContactKey({ businessScopedUserId, phoneNumber, conversationId });

  if (event === "whatsapp.conversation.created" && contactKey) {
    return [
      {
        kind: "conversation_created",
        eventKey: `kapso:conversation_created:${conversationId ?? contactKey}`,
        occurredAt,
        contactKey,
        phoneNumber,
        businessScopedUserId,
        conversationId,
      },
    ];
  }

  if (event === "whatsapp.message.received" && contactKey) {
    const messageId =
      asString(data.message_id) ??
      asString(data.id) ??
      `kapso_message:${contactKey}:${occurredAt}`;
    return [
      {
        kind: "customer_message",
        eventKey: `kapso:message_received:${messageId}`,
        occurredAt,
        contactKey,
        phoneNumber,
        businessScopedUserId,
        conversationId,
        messageId,
      },
    ];
  }

  if (
    [
      "whatsapp.message.sent",
      "whatsapp.message.delivered",
      "whatsapp.message.read",
      "whatsapp.message.failed",
    ].includes(event) &&
    contactKey
  ) {
    const rawStatus = event.replace("whatsapp.message.", "") as OutboundStatus;
    const messageId =
      asString(data.message_id) ??
      asString(data.id) ??
      `kapso_status:${contactKey}:${rawStatus}:${occurredAt}`;
    return [
      {
        kind: "outbound_status",
        eventKey: `kapso:status:${messageId}:${rawStatus}`,
        occurredAt,
        contactKey,
        phoneNumber,
        businessScopedUserId,
        conversationId,
        messageId,
        status: rawStatus,
      },
    ];
  }

  return [];
}

function normalizeForwardedMetaWebhook(payload: Record<string, unknown>): TruthEvent[] {
  const entry = Array.isArray(payload.entry) ? payload.entry : [];
  const events: TruthEvent[] = [];

  for (const entryItem of entry) {
    if (!isRecord(entryItem)) continue;
    const changes = Array.isArray(entryItem.changes) ? entryItem.changes : [];
    for (const change of changes) {
      if (!isRecord(change)) continue;
      const value = isRecord(change.value) ? change.value : {};
      const contacts = Array.isArray(value.contacts) ? value.contacts : [];
      const firstContact = isRecord(contacts[0]) ? contacts[0] : {};
      const fallbackWaId = asString(firstContact.wa_id);

      const messages = Array.isArray(value.messages) ? value.messages : [];
      for (const message of messages) {
        if (!isRecord(message)) continue;
        const messageId = asString(message.id);
        const from = asString(message.from);
        const occurredAt = toIsoFromUnixSeconds(asString(message.timestamp));
        const contactKey = getContactKey({ from, waId: fallbackWaId });
        if (!messageId || !contactKey) continue;
        events.push({
          kind: "customer_message",
          eventKey: `message:${messageId}`,
          occurredAt,
          contactKey,
          phoneNumber: from ?? fallbackWaId,
          messageId,
        });
      }

      const statuses = Array.isArray(value.statuses) ? value.statuses : [];
      for (const statusItem of statuses) {
        if (!isRecord(statusItem)) continue;
        const messageId = asString(statusItem.id);
        const status = asString(statusItem.status) as OutboundStatus | undefined;
        const recipientId = asString(statusItem.recipient_id);
        const occurredAt = toIsoFromUnixSeconds(asString(statusItem.timestamp));
        const businessScopedUserId = asString(statusItem.recipient_user_id);
        const contactKey = getContactKey({
          businessScopedUserId,
          phoneNumber: recipientId,
          waId: recipientId,
        });
        if (!messageId || !status || !contactKey) continue;
        if (!["sent", "delivered", "read", "failed"].includes(status)) continue;
        events.push({
          kind: "outbound_status",
          eventKey: `status:${messageId}:${status}`,
          occurredAt,
          contactKey,
          phoneNumber: recipientId,
          businessScopedUserId,
          messageId,
          status,
        });
      }
    }
  }

  return events;
}

export function normalizeWebhookPayload(payload: unknown): TruthEvent[] {
  if (!isRecord(payload)) return [];
  if (asString(payload.event)) {
    return normalizeKapsoStructuredWebhook(payload);
  }
  if (payload.object === "whatsapp_business_account") {
    return normalizeForwardedMetaWebhook(payload);
  }
  return [];
}

export function applyTruthEvents(
  current: TruthStore,
  events: TruthEvent[],
  updatedAt: string = new Date().toISOString()
): TruthStore {
  const store: TruthStore = {
    ...current,
    updatedAt,
    summary: {
      ...current.summary,
      contactIntentBySource: { ...current.summary.contactIntentBySource },
    },
    conversations: { ...current.conversations },
    processedEventKeys: [...current.processedEventKeys],
  };

  for (const event of events) {
    if (store.processedEventKeys.includes(event.eventKey)) {
      continue;
    }

    store.processedEventKeys.push(event.eventKey);
    if (store.processedEventKeys.length > MAX_PROCESSED_EVENT_KEYS) {
      store.processedEventKeys.splice(
        0,
        store.processedEventKeys.length - MAX_PROCESSED_EVENT_KEYS
      );
    }

    if (event.kind === "contact_intent") {
      store.summary.contactIntents += 1;
      store.summary.contactIntentBySource[event.source] += 1;
      continue;
    }

    if (!event.contactKey) {
      continue;
    }

    const existing = store.conversations[event.contactKey] ?? {
      contactKey: event.contactKey,
      phoneNumber: event.phoneNumber,
      businessScopedUserId: event.businessScopedUserId,
      conversationId: event.conversationId,
      startedAt: undefined,
      lastInboundAt: undefined,
      inboundCount: 0,
      lastOutboundAt: undefined,
      lastOutboundStatus: undefined,
    };

    existing.phoneNumber = existing.phoneNumber ?? event.phoneNumber;
    existing.businessScopedUserId =
      existing.businessScopedUserId ?? event.businessScopedUserId;
    existing.conversationId = existing.conversationId ?? event.conversationId;

    if (event.kind === "conversation_created") {
      if (!existing.startedAt) {
        existing.startedAt = event.occurredAt;
        store.summary.conversationsStarted += 1;
      }
    }

    if (event.kind === "customer_message") {
      if (!existing.startedAt) {
        existing.startedAt = event.occurredAt;
        store.summary.conversationsStarted += 1;
      }
      existing.inboundCount += 1;
      existing.lastInboundAt = event.occurredAt;
      store.summary.inboundMessages += 1;
    }

    if (event.kind === "outbound_status") {
      existing.lastOutboundAt = event.occurredAt;
      existing.lastOutboundStatus = event.status;
      if (event.status === "sent") store.summary.outboundSent += 1;
      if (event.status === "delivered") store.summary.outboundDelivered += 1;
      if (event.status === "read") store.summary.outboundRead += 1;
      if (event.status === "failed") store.summary.outboundFailed += 1;
    }

    store.conversations[event.contactKey] = existing;
  }

  return store;
}
