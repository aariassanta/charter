"use client";

import { useState } from "react";
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { SectionLabel } from "./ui/SectionLabel";
import { ErrorBanner } from "./ui/ErrorBanner";

interface SectionScore {
  section: string;
  score: number;
  missing: string[];
  tips: string[];
}

interface ImprovementReport {
  overall_score: number;
  section_scores: SectionScore[];
  missing_fields: string[];
  tips: string[];
  reasoning: string;
  generated_at: string;
}

const SECTION_LABELS: Record<string, string> = {
  resumen: "Resumen ejecutivo",
  fechas: "Fechas e hitos",
  presupuesto: "Presupuesto y contrato",
  stakeholders: "Stakeholders",
  especificaciones_tecnicas: "Especificaciones técnicas",
  tareas: "Tareas y WBS",
  riesgos: "Riesgos y suposiciones",
  entregables: "Entregables y criterios",
};

interface Props {
  extractionId: number;
  onClose: () => void;
}

export default function ImproveModal({ extractionId, onClose }: Props) {
  const [report, setReport] = useState<ImprovementReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadReport() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/extractions/${extractionId}/improve`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al generar el informe");
        return;
      }
      setReport(await res.json());
    } catch {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={
        <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}>
          <Sparkles size={18} />
          Informe de mejora del charter
        </span>
      }
      subtitle="Análisis basado en el documento original y los datos extraídos"
      footer={
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      {!report && !loading && !error && (
        <div style={{ textAlign: "center", padding: "var(--space-5)" }}>
          <Sparkles
            size={32}
            color="var(--mid)"
            style={{
              marginBottom: "var(--space-3)",
              display: "inline-block",
            }}
          />
          <p
            style={{
              fontSize: "0.9375rem",
              marginBottom: "var(--space-4)",
              color: "var(--ink-2)",
              maxWidth: 480,
              margin: "0 auto var(--space-4)",
            }}
          >
            Genera un informe detallado con consejos para mejorar la fidelidad
            de este charter respecto al documento original.
          </p>
          <Button variant="filled" size="md" onClick={loadReport}>
            Generar informe
          </Button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "var(--space-10)" }}>
          <Loader2
            size={32}
            color="var(--mid)"
            style={{
              animation: "spin 1s linear infinite",
              marginBottom: "var(--space-3)",
              display: "inline-block",
            }}
          />
          <p style={{ color: "var(--mid)", fontSize: "0.875rem" }}>
            Analizando el charter…
          </p>
        </div>
      )}

      {error && <ErrorBanner>{error}</ErrorBanner>}

      {report && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {/* Overall score */}
          <div
            style={{
              padding: "var(--space-6)",
              background: "var(--tint)",
              border: "1px solid var(--rule)",
              borderRadius: "var(--radius-md)",
              textAlign: "center",
            }}
          >
            <SectionLabel>Confianza global</SectionLabel>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "3.5rem",
                fontWeight: 500,
                letterSpacing: "-0.03em",
                color: "var(--ink)",
                marginTop: "var(--space-2)",
                lineHeight: 1,
              }}
            >
              {report.overall_score}
              <span
                style={{
                  fontSize: "1.25rem",
                  color: "var(--mid)",
                  fontFamily: "var(--font-body)",
                  marginLeft: "var(--space-1)",
                }}
              >
                /100
              </span>
            </div>
          </div>

          {/* Reasoning */}
          <section>
            <SectionLabel>Análisis</SectionLabel>
            <p
              style={{
                fontSize: "0.9375rem",
                lineHeight: 1.65,
                marginTop: "var(--space-2)",
                color: "var(--ink-2)",
              }}
            >
              {report.reasoning}
            </p>
          </section>

          {/* Section scores */}
          <section>
            <SectionLabel>Detalle por sección</SectionLabel>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-2)",
                marginTop: "var(--space-3)",
              }}
            >
              {report.section_scores.map((s) => (
                <div
                  key={s.section}
                  className="surface"
                  style={{ padding: "var(--space-3) var(--space-4)" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: s.tips.length > 0 ? "var(--space-2)" : 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "var(--ink)",
                      }}
                    >
                      {SECTION_LABELS[s.section] ?? s.section}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontStyle: "italic",
                        fontSize: "1rem",
                        color: "var(--ink-2)",
                      }}
                    >
                      {Math.round(s.score * 100)}/100
                    </span>
                  </div>
                  {s.tips.length > 0 && (
                    <ul
                      style={{
                        paddingLeft: "var(--space-5)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--space-1)",
                        fontSize: "0.8125rem",
                        color: "var(--mid)",
                      }}
                    >
                      {s.tips.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>

          {report.tips.length === 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                padding: "var(--space-3) var(--space-4)",
                background: "var(--tint)",
                border: "1px solid var(--rule)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.875rem",
                color: "var(--ink)",
              }}
            >
              <CheckCircle2 size={16} color="var(--accent)" />
              <span>
                Tu charter tiene una fidelidad excelente respecto al documento
                original.
              </span>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
