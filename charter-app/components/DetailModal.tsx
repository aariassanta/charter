"use client";

import { useState, useEffect } from "react";
import {
  Sparkles, Download, FileText,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { SectionLabel } from "./ui/SectionLabel";
import { Badge } from "./ui/Badge";
import { Rule } from "./ui/Rule";
import ConfidencePill from "./ConfidencePill";

type Extraction = {
  id: number;
  project_name: string;
  status: "pending" | "processing" | "completed" | "failed";
  offer_summary: string | null;
  start_date: string | null;
  end_date: string | null;
  total_budget: string | null;
  milestones: string | null;
  tasks: string | null;
  deliverables: string | null;
  stakeholders: string | null;
  risks: string | null;
  assumptions: string | null;
  constraints: string | null;
  technical_specs: string | null;
  pdf_metadata: string | null;
  stage: string | null;
  confidence_overall: number | null;
  error: string | null;
  created_at: string;
  job_id?: string | null;
};

type Documents = {
  dossier_md: string;
  charter_md: string;
  kickoff_md: string;
  stats: Record<string, unknown>;
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr + "Z").getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Hace un momento";
  if (mins < 60) return `Hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  return `Hace ${Math.floor(hrs / 24)}d`;
}

// ── Markdown tab renderer ────────────────────────────────────────────────────────

const markdownStyles: React.CSSProperties = {
  fontSize: "0.875rem",
  lineHeight: 1.7,
  color: "var(--ink-2)",
};

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 500, letterSpacing: "-0.02em", marginBottom: "0.75rem", marginTop: "1.5rem", color: "var(--ink)" }}>{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 500, letterSpacing: "-0.01em", marginBottom: "0.5rem", marginTop: "1.25rem", color: "var(--ink)" }}>{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: "0.375rem", marginTop: "1rem", color: "var(--ink)" }}>{children}</h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p style={{ marginBottom: "0.75rem" }}>{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul style={{ paddingLeft: "1.25rem", marginBottom: "0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol style={{ paddingLeft: "1.25rem", marginBottom: "0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li style={{ lineHeight: 1.6 }}>{children}</li>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <div style={{ overflowX: "auto", marginBottom: "1rem" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>{children}</table>
    </div>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", background: "var(--tint)", borderBottom: "1px solid var(--rule)", fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap" }}>{children}</th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid var(--faint)", verticalAlign: "top" }}>{children}</td>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote style={{ borderLeft: "3px solid var(--rule)", paddingLeft: "0.75rem", marginLeft: 0, marginBottom: "0.75rem", color: "var(--mid)", fontStyle: "italic" }}>{children}</blockquote>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code style={{ background: "var(--tint)", padding: "0.1em 0.35em", borderRadius: "3px", fontSize: "0.8125em" }}>{children}</code>
  ),
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre style={{ background: "var(--tint)", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", overflowX: "auto", marginBottom: "0.75rem", fontSize: "0.8125rem" }}>{children}</pre>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong style={{ fontWeight: 600, color: "var(--ink)" }}>{children}</strong>
  ),
  hr: () => <hr style={{ border: "none", borderTop: "1px solid var(--rule)", margin: "1rem 0" }} />,
};

// ── Markdown document view (Charter/Dossier/Kickoff) ────────────────────────────

function DocumentView({ label, md, loading, error }: { label: string; md: string; loading: boolean; error: string | null }) {
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-8)", color: "var(--mid)" }}>
        Cargando {label}…
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ padding: "var(--space-4)", background: "var(--tint)", borderRadius: "var(--radius-md)", fontSize: "0.875rem", color: "var(--mid)", fontStyle: "italic" }}>
        {error}
      </div>
    );
  }
  if (!md) {
    return (
      <div style={{ padding: "var(--space-4)", background: "var(--tint)", borderRadius: "var(--radius-md)", fontSize: "0.875rem", color: "var(--mid)", fontStyle: "italic" }}>
        {label} no disponible.
      </div>
    );
  }
  return (
    <div style={markdownStyles}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {md}
      </ReactMarkdown>
    </div>
  );
}

// ── Main DetailModal ──────────────────────────────────────────────────────────

type Tab = "charter" | "dossier" | "kickoff";

export function DetailModal({
  ext,
  onClose,
  onImprove,
}: {
  ext: Extraction;
  onClose: () => void;
  onImprove: (id: number) => void;
}) {
  const [tab, setTab] = useState<Tab>("charter");

  // Documents fetched from worker (charter_md, dossier_md, kickoff_md)
  const [docs, setDocs] = useState<Documents | null>(null);
  const [docsLoading, setDocsLoading] = useState(false);
  const [docsError, setDocsError] = useState<string | null>(null);

  // Fetch documents for whichever tab needs them
  useEffect(() => {
    if (docs !== null) return;
    setDocsLoading(true);
    setDocsError(null);
    fetch(`/api/extractions/${ext.id}/documents`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setDocsError(d.error); }
        else { setDocs(d as Documents); }
      })
      .catch((e) => setDocsError(String(e)))
      .finally(() => setDocsLoading(false));
  }, [tab, ext.id, docs]);

  function handleExport(format: "json" | "markdown" | "pdf") {
    const url = `/api/extractions/${ext.id}/export?format=${format}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ext.project_name}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Tabs
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "charter", label: "Charter", icon: <FileText size={13} /> },
    { id: "dossier", label: "Dossier", icon: <FileText size={13} /> },
    { id: "kickoff", label: "Kick-off", icon: <FileText size={13} /> },
  ];

  const footer = (
    <>
      <div style={{ display: "flex", gap: "var(--space-2)" }}>
        <Button variant="outline" size="sm" icon={<Sparkles size={13} />} onClick={() => onImprove(ext.id)}>Mejorar</Button>
        <Button variant="filled" size="sm" icon={<Download size={13} />} onClick={() => handleExport("pdf")}>PDF</Button>
        <Button variant="outline" size="sm" icon={<Download size={13} />} onClick={() => handleExport("markdown")}>MD</Button>
        <Button variant="outline" size="sm" icon={<Download size={13} />} onClick={() => handleExport("json")}>JSON</Button>
      </div>
      <Button variant="ghost" size="sm" onClick={onClose}>Cerrar</Button>
    </>
  );

  return (
    <Modal open onClose={onClose} size="wide" title={ext.project_name} subtitle={`Charter · ${timeAgo(ext.created_at)}`} footer={footer}>
      {/* Meta row */}
      <div style={{ marginBottom: "var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
        <ConfidencePill score={ext.confidence_overall ?? null} />
        {ext.stage && ext.stage !== "completed" && ext.stage !== "failed" && (
          <span className="badge badge--muted">{ext.stage}</span>
        )}
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: "var(--space-1)", marginBottom: "var(--space-5)", borderBottom: "1px solid var(--rule)", paddingBottom: 0 }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "var(--space-2) var(--space-3)",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: tab === t.id ? "var(--ink)" : "var(--mid)",
              borderBottom: tab === t.id ? "2px solid var(--ink)" : "2px solid transparent",
              marginBottom: -1,
              transition: "all 0.15s",
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {tab === "charter" && (
          <DocumentView label="Charter" md={docs?.charter_md ?? ""} loading={docsLoading} error={docsError} />
        )}
        {tab === "dossier" && (
          <DocumentView label="Dossier" md={docs?.dossier_md ?? ""} loading={docsLoading} error={docsError} />
        )}
        {tab === "kickoff" && (
          <DocumentView label="Kick-off" md={docs?.kickoff_md ?? ""} loading={docsLoading} error={docsError} />
        )}
      </div>
    </Modal>
  );
}
