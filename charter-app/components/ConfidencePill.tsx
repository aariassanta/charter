import { clsx } from "clsx";

interface ConfidencePillProps {
  value: number; // 0–100
  className?: string;
}

function getColor(confidence: number) {
  if (confidence >= 80) return "bg-green-100 text-green-700";
  if (confidence >= 60) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

function getLabel(confidence: number) {
  if (confidence >= 90) return "Excelente";
  if (confidence >= 80) return "Muy alta";
  if (confidence >= 70) return "Alta";
  if (confidence >= 60) return "Media";
  return "Baja";
}

export function ConfidencePill({ value, className }: ConfidencePillProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        getColor(value),
        className
      )}
      title={`Confianza: ${value}% — ${getLabel(value)}`}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M4 6.5l1.5 1.5L8 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {value}% · {getLabel(value)}
    </span>
  );
}
