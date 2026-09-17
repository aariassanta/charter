"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  LogOut,
  Plus,
  Shield,
} from "lucide-react";
import ConfidencePill from "@/components/ConfidencePill";
import ImproveModal from "@/components/ImproveModal";
import { DetailModal } from "@/components/DetailModal";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Rule } from "@/components/ui/Rule";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

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
  wbs_output: string | null;
  field_confidence: string | null;
  pdf_metadata: string | null;
  stage: string | null;
  confidence_section: string | null;
  confidence_overall: number | null;
  error: string | null;
  job_id: string | null;
  created_at: string;
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

function statusBadge(status: Extraction["status"], stage?: string | null) {
  if (status === "completed") return <Badge variant="plain">Completado</Badge>;
  if (status === "failed") return <Badge variant="muted">Fallido</Badge>;
  if (stage && stage !== "completed" && stage !== "failed") {
    return <Badge variant="muted">{stage}</Badge>;
  }
  return <Badge variant="muted">Procesando</Badge>;
}

function statusIcon(status: Extraction["status"]) {
  if (status === "completed") return <CheckCircle2 size={18} color="var(--mid)" />;
  if (status === "failed") return <AlertCircle size={18} color="var(--mid)" />;
  return <Clock size={18} color="var(--mid)" />;
}

export default function DashboardPage() {
  const [extractions, setExtractions] = useState<Extraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedExt, setSelectedExt] = useState<Extraction | null>(null);
  const [improveExtId, setImproveExtId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadExtractions() {
    try {
      const res = await fetch("/api/extractions");
      if (res.ok) setExtractions(await res.json());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function checkAdmin() {
    try {
      const res = await fetch("/api/me");
      if (res.ok) {
        const data = await res.json();
        setIsAdmin(data.role === "admin");
      }
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    loadExtractions();
    checkAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // SSE-driven progress. Para cada extracción aún en vuelo, abre un
  // EventSource que actualiza stage/status en tiempo real sin polling.
  useEffect(() => {
    const inFlight = extractions.filter(
      (e) => e.status === "pending" || e.status === "processing"
    );
    if (inFlight.length === 0) return;

    const sources: EventSource[] = inFlight.map((ext) => {
      const es = new EventSource(`/api/extractions/${ext.id}/events`);
      es.onmessage = () => {
        loadExtractions();
      };
      es.onerror = () => {
        es.close();
        // Reconexión a los 2 s; el polling residual conserva estado
        setTimeout(() => loadExtractions(), 2000);
      };
      return es;
    });

    // Fallback de polling: por si EventSource no conecta (red inestable)
    const interval = setInterval(loadExtractions, 5000);

    return () => {
      sources.forEach((es) => es.close());
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extractions.map((e) => `${e.id}:${e.status}`).join("|")]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.set("file", selectedFile);
      if (projectName) form.set("project_name", projectName);
      const res = await fetch("/api/extractions/create", { method: "POST", body: form });
      if (res.ok) {
        setSelectedFile(null);
        setProjectName("");
        await loadExtractions();
      } else {
        const err = await res.json();
        alert(err.error || "Error al subir el archivo");
      }
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const completedCount = extractions.filter((e) => e.status === "completed").length;
  const freeUsed = completedCount;

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      {selectedExt && (
        <DetailModal
          ext={selectedExt}
          onClose={() => {
            setSelectedExt(null);
            loadExtractions();
          }}
          onImprove={setImproveExtId}
        />
      )}
      {improveExtId && (
        <ImproveModal
          extractionId={improveExtId}
          onClose={() => setImproveExtId(null)}
        />
      )}

      {/* Header */}
      <header
        style={{
          background: "var(--paper)",
          borderBottom: "1px solid var(--rule)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 880,
            margin: "0 auto",
            padding: "var(--space-4) var(--space-5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/" style={{ display: "inline-flex" }}>
            <Logo />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            {isAdmin && (
              <Button as="a" href="/admin" variant="ghost" size="sm" icon={<Shield size={14} />}>
                Admin
              </Button>
            )}
            <Button variant="ghost" size="sm" icon={<LogOut size={14} />} onClick={handleLogout}>
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: 880,
          margin: "0 auto",
          padding: "var(--space-8) var(--space-5)",
        }}
      >
        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 0,
            border: "1px solid var(--rule)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            marginBottom: "var(--space-8)",
          }}
        >
          {[
            { label: "Total charters", value: extractions.length },
            { label: "Completados", value: completedCount },
            ...(isAdmin ? [] : [{ label: "Free usado", value: `${freeUsed}/3` }]),
          ].map((s, i, arr) => (
            <div
              key={s.label}
              style={{
                padding: "var(--space-5)",
                textAlign: "center",
                borderLeft: i === 0 ? "none" : "1px solid var(--rule)",
                background: "var(--paper)",
              }}
            >
              <SectionLabel>{s.label}</SectionLabel>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.5rem",
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                  color: "var(--ink)",
                  marginTop: "var(--space-2)",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Upload */}
        <div className="surface" style={{ marginBottom: "var(--space-8)" }}>
          <SectionLabel>Nuevo charter</SectionLabel>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              marginTop: "var(--space-3)",
              marginBottom: "var(--space-5)",
            }}
          >
            Subí tu oferta
          </h2>

          <form onSubmit={handleUpload}>
            <input
              className="input"
              placeholder="Nombre del proyecto (opcional)"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              style={{ marginBottom: "var(--space-3)" }}
            />

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `1.5px dashed ${dragOver ? "var(--ink)" : "var(--faint)"}`,
                borderRadius: "var(--radius-md)",
                padding: "var(--space-8) var(--space-5)",
                textAlign: "center",
                cursor: "pointer",
                background: dragOver ? "var(--tint)" : "var(--paper)",
                transition: "all var(--duration-fast) var(--ease-out)",
                marginBottom: "var(--space-3)",
              }}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.docx"
                style={{ display: "none" }}
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              {selectedFile ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "var(--space-3)",
                  }}
                >
                  <FileText size={22} color="var(--ink)" />
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 500, fontSize: "0.9375rem", color: "var(--ink)" }}>
                      {selectedFile.name}
                    </div>
                    <div style={{ color: "var(--mid)", fontSize: "0.8125rem" }}>
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Upload
                    size={24}
                    color="var(--mid)"
                    style={{ marginBottom: "var(--space-3)", display: "block", margin: "0 auto var(--space-2)" }}
                  />
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontStyle: "italic",
                      fontSize: "1.125rem",
                      marginBottom: "var(--space-1)",
                      color: "var(--ink)",
                    }}
                  >
                    Arrastrá tu oferta aquí
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--mid)" }}>PDF o DOCX</div>
                </>
              )}
            </div>

            <Button
              type="submit"
              variant="filled"
              size="md"
              disabled={!selectedFile || uploading}
              style={{ width: "100%" }}
            >
              {uploading ? "Procesando…" : "Generar charter"}
            </Button>
          </form>
        </div>

        {/* List */}
        <div>
          <SectionLabel>Mis charters</SectionLabel>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              marginTop: "var(--space-3)",
              marginBottom: "var(--space-4)",
            }}
          >
            {extractions.length === 0
              ? "Aún no tienes charters"
              : `${extractions.length} ${extractions.length === 1 ? "charter" : "charters"}`}
          </h2>

          {loading ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}
              aria-busy="true"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="surface"
                  style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}
                >
                  <Skeleton
                    width={40}
                    height={40}
                    borderRadius="var(--radius-md)"
                  />
                  <div style={{ flex: 1 }}>
                    <Skeleton height={14} width="40%" style={{ marginBottom: 6 }} />
                    <Skeleton height={12} width="70%" />
                  </div>
                </div>
              ))}
            </div>
          ) : extractions.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Sube tu primera oferta"
              description="Arrastra un PDF o DOCX de tu oferta comercial y obtén un Project Charter completo en menos de tres minutos."
            />
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}
            >
              {extractions.map((ext) => (
                <div
                  key={ext.id}
                  className="surface surface--hover"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    cursor: ext.status === "completed" ? "pointer" : "default",
                    padding: "var(--space-4)",
                  }}
                  onClick={() => {
                    if (ext.status === "completed") setSelectedExt(ext);
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "var(--radius-md)",
                      flexShrink: 0,
                      background: "var(--tint)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {statusIcon(ext.status)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: "0.9375rem", color: "var(--ink)", marginBottom: 2 }}>
                      {ext.project_name}
                    </div>
                    {ext.offer_summary && (
                      <div
                        style={{
                          fontSize: "0.8125rem",
                          color: "var(--mid)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ext.offer_summary}
                      </div>
                    )}
                    {ext.status === "failed" && ext.error && (
                      <div style={{ fontSize: "0.75rem", color: "var(--mid)", marginTop: 2 }}>
                        {ext.error}
                      </div>
                    )}
                    <div style={{ fontSize: "0.75rem", color: "var(--mid)", marginTop: 2 }}>
                      {timeAgo(ext.created_at)}
                    </div>
                  </div>
                  {statusBadge(ext.status, ext.stage)}
                  {ext.status === "completed" && ext.confidence_overall !== null && (
                    <ConfidencePill score={ext.confidence_overall} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
