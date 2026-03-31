import { getVagasRestantes, VAGAS_TOTAL } from "@/lib/edge-config";

interface VagasCounterProps {
  variant?: "pricing" | "final-cta";
}

export async function VagasCounter({ variant = "pricing" }: VagasCounterProps) {
  const vagas = await getVagasRestantes();
  const esgotado = vagas === 0;
  const poucasVagas = vagas > 0 && vagas <= 5;

  if (variant === "final-cta") {
    if (esgotado) {
      return (
        <p className="text-[#888898] text-sm">
          Vagas esgotadas para a primeira turma.{" "}
          <span className="text-[#EEEEF0]">Entre na lista de espera.</span>
        </p>
      );
    }
    if (poucasVagas) {
      return (
        <p className="text-[#888898] text-sm">
          Restam apenas{" "}
          <span
            className="font-mono text-[#0055FF] font-semibold"
            style={{ fontFamily: "var(--font-fira-code)" }}
          >
            {vagas}
          </span>{" "}
          vagas 🔥
        </p>
      );
    }
    return (
      <p className="text-[#888898] text-sm">
        Apenas{" "}
        <span
          className="font-mono text-[#0055FF] font-semibold"
          style={{ fontFamily: "var(--font-fira-code)" }}
        >
          {VAGAS_TOTAL}
        </span>{" "}
        vagas por turma
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

  if (poucasVagas) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,85,255,0.2)] bg-[rgba(0,85,255,0.05)] px-3 py-1.5 mb-6">
        <span className="w-2 h-2 rounded-full bg-[#0055FF]" />
        <span className="text-[#EEEEF0] text-sm font-medium">
          Restam apenas{" "}
          <span
            className="font-semibold"
            style={{ fontFamily: "var(--font-fira-code)" }}
          >
            {vagas}
          </span>{" "}
          vagas 🔥
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,85,255,0.2)] bg-[rgba(0,85,255,0.05)] px-3 py-1.5 mb-6">
      <span className="w-2 h-2 rounded-full bg-[#0055FF]" />
      <span className="text-[#EEEEF0] text-sm font-medium">
        Apenas{" "}
        <span
          className="font-semibold"
          style={{ fontFamily: "var(--font-fira-code)" }}
        >
          {VAGAS_TOTAL}
        </span>{" "}
        <span className="text-[#888898]">vagas por turma</span>
      </span>
    </div>
  );
}
