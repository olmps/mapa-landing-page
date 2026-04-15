const ASAAS_API_KEY = process.env.ASAAS_API_KEY!;
const ASAAS_BASE_URL =
  process.env.ASAAS_SANDBOX === "true"
    ? "https://sandbox.asaas.com/api/v3"
    : "https://api.asaas.com/v3";

async function asaasFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${ASAAS_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      access_token: ASAAS_API_KEY,
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.errors?.[0]?.description || `Asaas API error: ${res.status}`
    );
  }
  return res.json();
}

export async function createCustomer(data: {
  name: string;
  email: string;
  mobilePhone: string;
  cpfCnpj: string;
}) {
  return asaasFetch("/customers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function createPayment(data: {
  customer: string;
  billingType: "PIX" | "CREDIT_CARD";
  value: number;
  installmentCount?: number;
  installmentValue?: number;
  dueDate: string;
  callback?: { successUrl: string; autoRedirect: boolean };
  externalReference?: string;
}) {
  return asaasFetch("/payments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getPixQrCode(paymentId: string) {
  return asaasFetch(`/payments/${paymentId}/pixQrCode`);
}

export async function getPaymentStatus(paymentId: string) {
  return asaasFetch(`/payments/${paymentId}`);
}

export interface InstallmentOption {
  installmentCount: number;
  installmentValue: number;
  totalValue: number;
  feePercentage: number;
}

interface AccountFees {
  payment: {
    creditCard: {
      operationValue: number;
      oneInstallmentPercentage: number;
      upToSixInstallmentsPercentage: number;
      upToTwelveInstallmentsPercentage: number;
      upToTwentyOneInstallmentsPercentage: number;
    };
  };
}

function getFeeForInstallments(fees: AccountFees["payment"]["creditCard"], count: number): number {
  if (count <= 1) return fees.oneInstallmentPercentage;
  if (count <= 6) return fees.upToSixInstallmentsPercentage;
  if (count <= 12) return fees.upToTwelveInstallmentsPercentage;
  return fees.upToTwentyOneInstallmentsPercentage;
}

export async function getInstallmentOptions(
  value: number,
  maxInstallments = 12
): Promise<InstallmentOption[]> {
  // Fetch real account fees from Asaas
  const accountFees: AccountFees = await asaasFetch("/myAccount/fees");
  const ccFees = accountFees.payment.creditCard;

  const results: InstallmentOption[] = [];

  for (let n = 1; n <= maxInstallments; n++) {
    const feePercentage = getFeeForInstallments(ccFees, n);
    // Installment value is the product price divided by n (sem juros pro comprador)
    // The fee is absorbed by the merchant, not added to the price
    const installmentValue = Math.ceil((value / n) * 100) / 100;
    results.push({
      installmentCount: n,
      installmentValue,
      totalValue: value,
      feePercentage,
    });
  }

  return results;
}
