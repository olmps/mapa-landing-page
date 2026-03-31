import { NextResponse } from "next/server";
import { decrementVagas } from "@/lib/edge-config";

export async function POST(request: Request) {
  try {
    const token = request.headers.get("asaas-access-token");

    if (token !== process.env.ASAAS_WEBHOOK_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (
      body.event === "PAYMENT_RECEIVED" ||
      body.event === "PAYMENT_CONFIRMED"
    ) {
      console.log(
        `[Asaas Webhook] ${body.event} — Payment ${body.payment?.id}, Customer ${body.payment?.customer}`
      );

      const vagasRestantes = await decrementVagas();
      if (vagasRestantes !== null) {
        console.log(
          `[Asaas Webhook] Vaga registrada. Vagas restantes: ${vagasRestantes}`
        );
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
