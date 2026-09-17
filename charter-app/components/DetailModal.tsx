"use client";

import { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfidencePill } from "@/components/ConfidencePill";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Rule } from "@/components/ui/Rule";
import { api } from "@/lib/api";
import type { Extraction } from "@/lib/api";
import {
  ShieldCheck,
  Download,
  FileText,
  FileJson,
  Loader2,
} from "lucide-react";

type Tab = "charter" | "dossier" | "kickoff";

interface DetailModalProps {
  extraction: Extraction;
  onClose: () => void;
  onImprove: () => void;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function DetailModal({ extraction, onClose, onImprove }: DetailModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("charter");
  const [documents, setDocuments] = useState<Record<Tab, string>>({
    charter: "",
    dossier: "",
    kickoff: "",
  });
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<Tab | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.getDocuments(extraction.id)
      .then((docs) => {
        setDocuments({
          charter: docs.charter ?? "",
          dossier: docs.dossier ?? "",
          kickoff: docs.kickoff ?? "",
        });
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "No se pudieron cargar los documentos");
      })
      .finally(() => setLoading(false));
  }, [extraction.id]);

  const handleDownload = useCallback(
    async (format: "md" | "pdf" | "json") => {
      const tab = activeTab;
      setDownloading(tab);
      try {
        const res = await api.downloadDocument(extraction.id, tab, format);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        if (format === "json") {
          // Para JSON, extraemos el texto del documento activo y lo devolvemos como JSON
          const text = documents[tab];
          const jsonData = {
            filename: extraction.filename,
            type: tab,
            content: text,
            extracted_at: extraction.updated_at,
          };
          const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
            type: "application/json",
          });
          downloadBlob(blob, `${extraction.id}_${tab}.json`);
        } else {
          // MD y PDF vienen como blob del worker
          const blob = await res.blob();
          const extension = format === "md" ? "md" : "pdf";
          downloadBlob(blob, `${extraction.id}_${tab}.${extension}`);
        }
      } catch (err: unknown) {
        alert(`Error al descargar: ${err instanceof Error ? err.message : "verifica el worker"}`);
      } finally {
        setDownloading(null);
      }
    },
    [activeTab, extraction.id, extraction.filename, extraction.updated_at, documents]
  );

  const tabs: { id: Tab; label: string }[] = [
    { id: "charter", label: "Charter" },
    { id: "dossier", label: "Dossier" },
    { id: "kickoff", label: "Kickoff" },
  ];

  const tabLabels: Record<Tab, string> = {
    charter: "Project Charter",
    dossier: "Dossier de Evaluación",
    kickoff: "Acta de Kick-off",
  };

  return (
    <Modal open onClose={onClose} size="xl">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="px-6 pt-5 pb-0 flex-shrink-0">
        <div className="flex items-start justify-between mb-4">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-slate-900 truncate">
              {extraction.filename}
            </h2>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <ConfidencePill value={extraction.confidence ?? 0} />
              <Badge
                variant={
                  extraction.status === "done"
                    ? "success"
                    : extraction.status === "error"
                    ? "error"
                    : "warning"
                }
              >
                {extraction.status}
              </Badge>
              <span className="text-xs text-slate-400">
                {new Date(extraction.updated_at).toLocaleString("es-ES")}
              </span>
            </div>
          </div>
          <button
            onClick={onImprove}
            className="text-sm text-blue-600 hover:underline font-medium flex-shrink-0 ml-4"
          >
            Mejorar…
          </button>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────────── */}
        <div className="flex border-b border-slate-200 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors mr-1 ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-sm">Cargando {tabLabels[activeTab]}…</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            <SectionLabel>{tabLabels[activeTab]}</SectionLabel>
            <Rule className="my-2" />
            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed bg-slate-50 rounded-xl p-5 border border-slate-200 max-h-[60vh] overflow-y-auto">
              {documents[activeTab] || "Sin contenido disponible."}
            </pre>
          </div>
        )}
      </div>

      {/* ── Action Bar ──────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Confianza */}
          <div className="flex items-center gap-2 mr-2">
            <ShieldCheck className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">Confianza:</span>
            <ConfidencePill value={extraction.confidence ?? 0} />
          </div>

          <div className="h-5 w-px bg-slate-300" />

          {/* Descargar MD */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleDownload("md")}
            disabled={downloading !== null}
          >
            <Download className="w-3.5 h-3.5" />
            MD · {tabLabels[activeTab].split(" ")[0]}
          </Button>

          {/* Descargar PDF */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleDownload("pdf")}
            disabled={downloading !== null}
          >
            <FileText className="w-3.5 h-3.5" />
            PDF · {tabLabels[activeTab].split(" ")[0]}
          </Button>

          {/* Descargar JSON */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleDownload("json")}
            disabled={downloading !== null}
          >
            <FileJson className="w-3.5 h-3.5" />
            JSON · {tabLabels[activeTab].split(" ")[0]}
          </Button>
        </div>

        {downloading && (
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <Loader2 className="w-3 h-3 animate-spin" />
            Descargando… ({tabLabels[downloading as Tab].split(" ")[0]})
          </p>
        )}
      </div>
    </Modal>
  );
}
