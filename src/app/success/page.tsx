import type { Metadata } from "next";
import { SuccessContent } from "@/components/success-content";

export const metadata: Metadata = {
  title: "Pagamento confirmado! — Mentoria MAPA",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  return <SuccessContent paymentId={params.paymentId as string | undefined} />;
}
