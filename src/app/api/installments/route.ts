import { getInstallmentOptions } from "@/lib/asaas";
import { PRODUCT_PRICE } from "@/lib/constants";

const MAX_INSTALLMENTS = 12;

export async function GET() {
  try {
    const options = await getInstallmentOptions(PRODUCT_PRICE, MAX_INSTALLMENTS);
    return Response.json({ installments: options });
  } catch (error) {
    console.error("Failed to get installment options:", error);
    return Response.json(
      { error: "Não foi possível carregar as opções de parcelamento. Tente novamente." },
      { status: 502 }
    );
  }
}
