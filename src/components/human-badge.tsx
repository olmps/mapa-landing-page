"use client";

export function HumanBadge({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-mapa-surface2 px-4 py-1.5 text-sm font-medium text-green-400 ${className ?? ""}`}
    >
      <span className="pulse-dot relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-40" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
      </span>
      100% humano
    </span>
  );
}
