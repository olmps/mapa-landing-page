import { getVagasRestantes, VAGAS_TOTAL } from "@/lib/edge-config";

interface VagasCounterProps {
  variant?: "pricing" | "final-cta";
}

export async function VagasCounter({ variant = "pricing" }: VagasCounterProps) {
  const vagas = await getVagasRestantes();
  const esgotado = vagas === 0;

  if (variant === "final-cta") {
    if (esgotado) {
      return (
        <p className="text-[#888898] text-sm">
          Vagas esgotadas para a primeira turma.{" "}
          <span className="text-[#EEEEF0]">Entre na lista de espera.</span>
        </p>
      );
    }
    return (
      <p className="text-[#888898] text-sm">
        <span
          className="font-mono text-[#0055FF] font-semibold"
          style={{ fontFamily: "var(--font-fira-code)" }}
        >
          {vagas}/{VAGAS_TOTAL}
        </span>{" "}
        vagas restantes para a primeira turma
      </p>
    );
  }

  // variant === "pricing"
  if (esgotado) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 mb-6">
        <span className="w-2 h-2 rounded-full bg-[#555565]" />
        <span className="text-[#888898] text-sm font-medium">
          Vagas esgotadas para esta turma
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,85,255,0.2)] bg-[rgba(0,85,255,0.05)] px-3 py-1.5 mb-6">
      <span className="w-2 h-2 rounded-full bg-[#0055FF]" />
      <span className="text-[#EEEEF0] text-sm font-medium">
        <span
          className="font-semibold"
          style={{ fontFamily: "var(--font-fira-code)" }}
        >
          {vagas}/{VAGAS_TOTAL}
        </span>{" "}
        <span className="text-[#888898]">vagas para a primeira turma</span>
      </span>
    </div>
  );
}
