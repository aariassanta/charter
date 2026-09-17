"use client";

interface Props {
  score: number | null;
  size?: "sm" | "md" | "lg";
}

export default function ConfidencePill({ score, size = "md" }: Props) {
  if (score === null || score === undefined) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: size === "lg" ? "0.25rem 0.75rem" : "0.125rem 0.5rem",
          borderRadius: 9999,
          background: "var(--bg-hover)",
          color: "var(--text-muted)",
          fontSize: size === "lg" ? "0.8125rem" : "0.6875rem",
          fontWeight: 600,
        }}
      >
        Sin evaluar
      </span>
    );
  }

  const color = score >= 80 ? "#15803d" : score >= 60 ? "#2563eb" : score >= 40 ? "#b45309" : "#dc2626";
  const bg = score >= 80 ? "#dcfce7" : score >= 60 ? "#dbeafe" : score >= 40 ? "#fef3c7" : "#fee2e2";
  const label = score >= 80 ? "Alta" : score >= 60 ? "Buena" : score >= 40 ? "Media" : "Baja";

  return (
    <span
      aria-label={`Confianza del charter: ${score}/100 (${label})`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        padding: size === "lg" ? "0.25rem 0.75rem" : "0.125rem 0.5rem",
        borderRadius: 9999,
        background: bg,
        color: color,
        fontSize: size === "lg" ? "0.8125rem" : "0.6875rem",
        fontWeight: 700,
      }}
    >
      <span style={{
        display: "inline-block",
        width: size === "lg" ? 8 : 6,
        height: size === "lg" ? 8 : 6,
        borderRadius: "50%",
        background: color,
      }} />
      Confianza: {score}/100 · {label}
    </span>
  );
}
