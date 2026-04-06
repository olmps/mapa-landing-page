import { PRODUCT_PRICE } from "@/lib/constants";

const MAX_INSTALLMENTS = 12;

export async function GET() {
  const installments = Array.from({ length: MAX_INSTALLMENTS }, (_, i) => {
    const n = i + 1;
    return {
      installmentCount: n,
      installmentValue: Math.ceil((PRODUCT_PRICE / n) * 100) / 100,
      totalValue: PRODUCT_PRICE,
    };
  });

  return Response.json({ installments });
}
