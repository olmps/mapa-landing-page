"use client";

export function HumanBadge({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-sm font-medium text-mapa-text-secondary ${className ?? ""}`}
    >
      <span className="pulse-dot relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-mapa-accent opacity-40" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mapa-accent" />
      </span>
      100% humano
    </span>
  );
}
