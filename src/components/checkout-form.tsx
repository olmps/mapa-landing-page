"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { PRODUCT_PRICE, PIX_PRICE, WHATSAPP_PURCHASE_URL } from "@/lib/constants";

type PaymentMethod = "PIX" | "CREDIT_CARD";
type Status = "idle" | "submitting" | "pix-pending" | "redirecting" | "error";

interface PixData {
  qrCode: string;
  payload: string;
}

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function maskCpf(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9)
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

interface InstallmentOption {
  installmentCount: number;
  installmentValue: number;
  totalValue: number;
}

function formatCurrency(v: number) {
  return v.toFixed(2).replace(".", ",");
}

const inputStyles =
  "w-full bg-[#101018] border border-[rgba(255,255,255,0.05)] text-[#EEEEF0] rounded-xl h-12 px-4 text-base outline-none transition-colors focus:border-[rgba(0,85,255,0.5)] focus:ring-1 focus:ring-[rgba(0,85,255,0.25)] placeholder:text-[#3A3A48]";
const labelStyles = "text-sm font-medium text-[#888898] mb-1.5 block";

export function CheckoutForm() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PIX");
  const [installments, setInstallments] = useState(1);
  const [installmentOptions, setInstallmentOptions] = useState<InstallmentOption[]>([]);
  const [loadingInstallments, setLoadingInstallments] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const paymentIdRef = useRef<string | null>(null);

  const [installmentError, setInstallmentError] = useState(false);

  // Fetch installment options from Asaas when CC is selected
  useEffect(() => {
    if (paymentMethod !== "CREDIT_CARD") return;
    if (installmentOptions.length > 0) return; // already fetched

    setLoadingInstallments(true);
    setInstallmentError(false);
    fetch("/api/installments")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        if (!data.installments || data.installments.length === 0) {
          throw new Error("No installments returned");
        }
        setInstallmentOptions(data.installments);
        setInstallments(1);
      })
      .catch(() => {
        setInstallmentError(true);
        setInstallmentOptions([]);
      })
      .finally(() => setLoadingInstallments(false));
  }, [paymentMethod, installmentOptions.length]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          cpfCnpj: form.get("cpf"),
          paymentMethod,
          installments: paymentMethod === "CREDIT_CARD" ? installments : 1,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao processar pagamento.");
        setStatus("error");
        return;
      }

      if (data.paymentMethod === "PIX") {
        paymentIdRef.current = data.paymentId;
        setPixData({ qrCode: data.pixQrCode, payload: data.pixPayload });
        setStatus("pix-pending");
        startPolling(data.paymentId);
      } else {
        setStatus("redirecting");
        window.location.href = data.invoiceUrl;
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setStatus("error");
    }
  }

  function startPolling(paymentId: string) {
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/checkout/status?paymentId=${paymentId}`
        );
        const data = await res.json();
        if (
          data.status === "RECEIVED" ||
          data.status === "CONFIRMED" ||
          data.status === "RECEIVED_IN_CASH"
        ) {
          if (pollingRef.current) clearInterval(pollingRef.current);
          window.location.href = `/success?paymentId=${paymentId}`;
        }
      } catch {
        // Silently retry
      }
    }, 3000);
  }

  async function copyPixCode() {
    if (!pixData?.payload) return;
    try {
      await navigator.clipboard.writeText(pixData.payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = pixData.payload;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  // PIX pending view
  if (status === "pix-pending" && pixData) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="bg-white rounded-2xl p-4">
          <img
            src={`data:image/png;base64,${pixData.qrCode}`}
            alt="QR Code Pix"
            width={240}
            height={240}
          />
        </div>

        <button
          type="button"
          onClick={copyPixCode}
          className="w-full h-12 rounded-full bg-[#101018] border border-[rgba(255,255,255,0.05)] text-[#EEEEF0] font-medium text-sm transition-colors hover:border-[rgba(0,85,255,0.25)] cursor-pointer"
        >
          {copied ? "Copiado!" : "Copiar código Pix"}
        </button>

        <div className="flex items-center gap-2 text-[#888898] text-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          Aguardando pagamento
          <span className="inline-flex">
            <span className="animate-[pulse_1.5s_ease-in-out_infinite]">.</span>
            <span className="animate-[pulse_1.5s_ease-in-out_0.3s_infinite]">.</span>
            <span className="animate-[pulse_1.5s_ease-in-out_0.6s_infinite]">.</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            if (pollingRef.current) clearInterval(pollingRef.current);
            setStatus("idle");
            setPixData(null);
          }}
          className="text-sm text-[#555565] hover:text-[#888898] transition-colors cursor-pointer"
        >
          Voltar
        </button>
      </div>
    );
  }

  // Redirecting view
  if (status === "redirecting") {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <div className="w-8 h-8 border-2 border-[#0055FF] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#888898] text-sm">Redirecionando para pagamento...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Nome */}
      <div>
        <label htmlFor="name" className={labelStyles}>
          Nome completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Seu nome"
          className={inputStyles}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelStyles}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="seu@email.com"
          className={inputStyles}
        />
      </div>

      {/* WhatsApp */}
      <div>
        <label htmlFor="phone" className={labelStyles}>
          WhatsApp
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="(XX) XXXXX-XXXX"
          className={inputStyles}
          onChange={(e) => {
            e.target.value = maskPhone(e.target.value);
          }}
        />
      </div>

      {/* CPF */}
      <div>
        <label htmlFor="cpf" className={labelStyles}>
          CPF
        </label>
        <input
          id="cpf"
          name="cpf"
          type="text"
          required
          autoComplete="off"
          placeholder="000.000.000-00"
          className={inputStyles}
          onChange={(e) => {
            e.target.value = maskCpf(e.target.value);
          }}
        />
      </div>

      {/* Payment method */}
      <div>
        <span className={labelStyles}>Pagamento</span>
        <div className="grid grid-cols-2 gap-2 mt-1.5">
          <button
            type="button"
            onClick={() => setPaymentMethod("PIX")}
            className={`h-11 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              paymentMethod === "PIX"
                ? "bg-[#0055FF] text-white"
                : "bg-[#101018] border border-[rgba(255,255,255,0.05)] text-[#888898] hover:text-[#EEEEF0]"
            }`}
          >
            Pix
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("CREDIT_CARD")}
            className={`h-11 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              paymentMethod === "CREDIT_CARD"
                ? "bg-[#0055FF] text-white"
                : "bg-[#101018] border border-[rgba(255,255,255,0.05)] text-[#888898] hover:text-[#EEEEF0]"
            }`}
          >
            Cartão de Crédito
          </button>
        </div>
      </div>

      {/* Installments (CC only) */}
      {paymentMethod === "CREDIT_CARD" && (
        <div>
          <label htmlFor="installments" className={labelStyles}>
            Parcelas
          </label>
          {loadingInstallments ? (
            <div className={`${inputStyles} flex items-center text-[#555565]`}>
              Carregando parcelas...
            </div>
          ) : installmentError ? (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              Não foi possível carregar as opções de parcelamento. Verifique sua conexão e{" "}
              <button
                type="button"
                onClick={() => {
                  setInstallmentOptions([]);
                  setInstallmentError(false);
                }}
                className="underline cursor-pointer hover:text-red-300"
              >
                tente novamente
              </button>
              .
            </div>
          ) : (
            <select
              id="installments"
              value={installments}
              onChange={(e) => setInstallments(Number(e.target.value))}
              className={`${inputStyles} appearance-none cursor-pointer`}
            >
              {installmentOptions.map((opt) => (
                <option key={opt.installmentCount} value={opt.installmentCount}>
                  {opt.installmentCount}x R${formatCurrency(opt.installmentValue)}
                  {opt.totalValue > PRODUCT_PRICE
                    ? ` (total R$${formatCurrency(opt.totalValue)})`
                    : ""}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "submitting" || (paymentMethod === "CREDIT_CARD" && (installmentError || loadingInstallments || installmentOptions.length === 0))}
        className={`w-full h-14 rounded-full text-base font-semibold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
          paymentMethod === "PIX"
            ? "bg-[#25D366] hover:bg-[#20bd5a] text-white"
            : "bg-[#0055FF] hover:bg-[#0066FF] text-white"
        }`}
      >
        {status === "submitting"
          ? "Processando..."
          : paymentMethod === "PIX"
            ? `Pagar R$${PIX_PRICE.toFixed(2).replace(".", ",")} com Pix (5% off)`
            : "Pagar com Cartão"}
      </button>
    </form>
  );
}
