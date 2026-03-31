import { NextResponse } from "next/server";
import { getPaymentStatus } from "@/lib/asaas";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("paymentId");

    if (!paymentId) {
      return NextResponse.json(
        { error: "paymentId é obrigatório." },
        { status: 400 }
      );
    }

    const payment = await getPaymentStatus(paymentId);

    return NextResponse.json({
      paymentId: payment.id,
      status: payment.status,
    });
  } catch (error) {
    console.error("Status check error:", error);
    const message =
      error instanceof Error ? error.message : "Erro ao verificar status.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
