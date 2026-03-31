/**
 * Edge Config helpers — vagas restantes da primeira turma.
 *
 * Leitura: @vercel/edge-config (connection string via EDGE_CONFIG)
 * Escrita: Vercel REST API (requer VERCEL_API_TOKEN + EDGE_CONFIG_ID)
 *
 * Fallback local: quando as env vars estão ausentes, retorna VAGAS_TOTAL
 * para permitir desenvolvimento sem o Edge Config configurado.
 */

import { createClient } from "@vercel/edge-config";

export const VAGAS_TOTAL = 10;
const EDGE_CONFIG_KEY = "vagas_restantes";

// Lazy-create o client apenas se a connection string estiver presente
function getEdgeConfigClient() {
  const connectionString = process.env.EDGE_CONFIG;
  if (!connectionString) return null;
  return createClient(connectionString);
}

/**
 * Retorna o número de vagas restantes.
 * Se o Edge Config não estiver configurado, retorna VAGAS_TOTAL (fallback dev).
 */
export async function getVagasRestantes(): Promise<number> {
  try {
    const client = getEdgeConfigClient();
    if (!client) {
      return VAGAS_TOTAL;
    }
    const value = await client.get<number>(EDGE_CONFIG_KEY);
    if (value === undefined || value === null) {
      return VAGAS_TOTAL;
    }
    return Math.max(0, value);
  } catch (err) {
    console.error("[Edge Config] Erro ao ler vagas_restantes:", err);
    return VAGAS_TOTAL;
  }
}

/**
 * Decrementa vagas_restantes em 1 via Vercel REST API.
 * Não decrementa abaixo de 0.
 * Retorna o novo valor ou null em caso de erro.
 */
export async function decrementVagas(): Promise<number | null> {
  const token = process.env.VERCEL_API_TOKEN;
  const edgeConfigId = process.env.EDGE_CONFIG_ID;

  if (!token || !edgeConfigId) {
    console.warn(
      "[Edge Config] VERCEL_API_TOKEN ou EDGE_CONFIG_ID ausentes — decremento ignorado."
    );
    return null;
  }

  // Lê o valor atual antes de decrementar
  const current = await getVagasRestantes();

  if (current <= 0) {
    console.warn("[Edge Config] Vagas já em 0 — decremento ignorado.");
    return 0;
  }

  const novoValor = current - 1;

  try {
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
              key: EDGE_CONFIG_KEY,
              value: novoValor,
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error(
        `[Edge Config] Falha ao decrementar (${res.status}):`,
        text
      );
      return null;
    }

    console.log(
      `[Edge Config] vagas_restantes decrementado: ${current} → ${novoValor}`
    );
    return novoValor;
  } catch (err) {
    console.error("[Edge Config] Erro na requisição de decremento:", err);
    return null;
  }
}
