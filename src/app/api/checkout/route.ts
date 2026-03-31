import { NextResponse } from "next/server";
import {
  createCustomer,
  createPayment,
  getPixQrCode,
} from "@/lib/asaas";
import { PRODUCT_PRICE, PIX_PRICE } from "@/lib/constants";
import { getVagasRestantes } from "@/lib/edge-config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, cpfCnpj, paymentMethod, installments } = body;

    if (!name || !email || !phone || !cpfCnpj || !paymentMethod) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    // Verificar vagas antes de criar o pagamento
    const vagasRestantes = await getVagasRestantes();
    if (vagasRestantes === 0) {
      return NextResponse.json(
        { error: "Vagas esgotadas para a primeira turma." },
        { status: 400 }
      );
    }

    if (paymentMethod !== "PIX" && paymentMethod !== "CREDIT_CARD") {
      return NextResponse.json(
        { error: "Método de pagamento inválido." },
        { status: 400 }
      );
    }

    // Create customer
    const customer = await createCustomer({
      name,
      email,
      mobilePhone: phone.replace(/\D/g, ""),
      cpfCnpj: cpfCnpj.replace(/\D/g, ""),
    });

    // Due date = tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dueDate = tomorrow.toISOString().split("T")[0];

    const successUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/success`;

    // Apply Pix discount
    const chargeValue = paymentMethod === "PIX" ? PIX_PRICE : PRODUCT_PRICE;

    // Create payment
    const installmentCount =
      paymentMethod === "CREDIT_CARD" && installments && installments > 1
        ? installments
        : undefined;
    const installmentValue = installmentCount
      ? Math.round((chargeValue / installmentCount) * 100) / 100
      : undefined;

    const payment = await createPayment({
      customer: customer.id,
      billingType: paymentMethod,
      value: chargeValue,
      installmentCount,
      installmentValue,
      dueDate,
      callback: { successUrl, autoRedirect: true },
    });

    // Return based on payment method
    if (paymentMethod === "PIX") {
      const pix = await getPixQrCode(payment.id);
      return NextResponse.json({
        paymentId: payment.id,
        paymentMethod: "PIX",
        pixQrCode: pix.encodedImage,
        pixPayload: pix.payload,
        expirationDate: pix.expirationDate,
      });
    }

    return NextResponse.json({
      paymentId: payment.id,
      paymentMethod: "CREDIT_CARD",
      invoiceUrl: payment.invoiceUrl,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    const message =
      error instanceof Error ? error.message : "Erro ao processar pagamento.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
