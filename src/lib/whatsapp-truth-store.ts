import { createClient } from "@vercel/edge-config";

import {
  applyTruthEvents,
  createEmptyTruthStore,
  type TruthEvent,
  type TruthStore,
} from "@/lib/whatsapp-truth";

const EDGE_CONFIG_KEY = "mapa_whatsapp_truth_v1";

function getEdgeConfigClient() {
  const connectionString = process.env.EDGE_CONFIG;
  if (!connectionString) return null;
  return createClient(connectionString);
}

async function upsertEdgeConfigValue(key: string, value: unknown): Promise<boolean> {
  const token = process.env.VERCEL_API_TOKEN;
  const edgeConfigId = process.env.EDGE_CONFIG_ID;

  if (!token || !edgeConfigId) {
    console.warn(
      `[WhatsApp Truth] VERCEL_API_TOKEN ou EDGE_CONFIG_ID ausentes — persistência ignorada para key=${key}.`
    );
    return false;
  }

  const res = await fetch(
    `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            operation: "upsert",
            key,
            value,
          },
        ],
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(
      `[WhatsApp Truth] Falha ao persistir ${key} (${res.status}):`,
      text
    );
    return false;
  }

  return true;
}

export async function getWhatsAppTruthStore(): Promise<TruthStore> {
  try {
    const client = getEdgeConfigClient();
    if (!client) {
      return createEmptyTruthStore();
    }

    const value = await client.get<TruthStore>(EDGE_CONFIG_KEY);
    if (!value) {
      return createEmptyTruthStore();
    }

    return {
      ...createEmptyTruthStore(),
      ...value,
      summary: {
        ...createEmptyTruthStore().summary,
        ...value.summary,
        contactIntentBySource: {
          ...createEmptyTruthStore().summary.contactIntentBySource,
          ...(value.summary?.contactIntentBySource ?? {}),
        },
      },
      conversations: value.conversations ?? {},
      processedEventKeys: value.processedEventKeys ?? [],
    };
  } catch (error) {
    console.error("[WhatsApp Truth] Erro ao ler store:", error);
    return createEmptyTruthStore();
  }
}

export async function recordWhatsAppTruthEvents(
  events: TruthEvent[],
  updatedAt: string = new Date().toISOString()
): Promise<TruthStore> {
  const current = await getWhatsAppTruthStore();
  const next = applyTruthEvents(current, events, updatedAt);
  await upsertEdgeConfigValue(EDGE_CONFIG_KEY, next).catch((error) => {
    console.error("[WhatsApp Truth] Erro ao persistir store:", error);
  });
  return next;
}
