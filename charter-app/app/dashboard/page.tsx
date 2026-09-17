"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { DetailModal } from "@/components/DetailModal";
import { ImproveModal } from "@/components/ImproveModal";
import { api } from "@/lib/api";
import type { Extraction, User } from "@/lib/api";
import {
  Upload,
  LogOut,
  FileText,
  Loader2,
  RefreshCw,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function StatusIcon({ status }: { status: Extraction["status"] }) {
  if (status === "done") return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  if (status === "error") return <AlertCircle className="w-4 h-4 text-red-500" />;
  return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
}

export default function DashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [extractions, setExtractions] = useState<Extraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Modal states
  const [selectedExtraction, setSelectedExtraction] = useState<Extraction | null>(null);
  const [improveTarget, setImproveTarget] = useState<Extraction | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [me, listRes] = await Promise.all([api.me(), api.listExtractions()]);
      setUser(me);
      setExtractions(listRes.extractions);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("charter_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    loadData();
  }, [router]);

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.createExtraction(formData);
      await loadData();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Error al subir el archivo");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("charter_token");
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-slate-600">{user.email}</span>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* ── Upload ─────────────────────────────────────────────────────── */}
        <section>
          <h1 className="text-xl font-bold text-slate-900 mb-4">Subir documento</h1>
          <form
            onSubmit={handleUpload}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
          >
            {uploadError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {uploadError}
              </div>
            )}
            <div className="flex items-center gap-4 flex-wrap">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                required
                className="block w-full max-w-md text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <Button type="submit" disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Procesando…
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Subir y extraer
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Formato aceptado: PDF. El documento será analizado para generar Charter, Dossier y Kick-off.
            </p>
          </form>
        </section>

        {/* ── Extraction List ─────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-slate-900">Extrascciones</h1>
            <Button variant="secondary" size="sm" onClick={loadData} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              ))}
            </div>
          ) : error ? (
            <ErrorBanner message={error} onRetry={loadData} />
          ) : extractions.length === 0 ? (
            <EmptyState
              title="Sin extracciones"
              description="Sube un PDF para comenzar a generar Charters de proyecto."
            />
          ) : (
            <div className="space-y-3">
              {extractions.map((ext) => (
                <div
                  key={ext.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedExtraction(ext)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <FileText className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 truncate">{ext.filename}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            {new Date(ext.created_at).toLocaleDateString("es-ES")}
                          </div>
                          {ext.confidence !== undefined && (
                            <span className="text-xs text-slate-400">
                              · {ext.confidence}% confianza
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge
                        variant={
                          ext.status === "done"
                            ? "success"
                            : ext.status === "error"
                            ? "error"
                            : ext.status === "processing"
                            ? "info"
                            : "warning"
                        }
                      >
                        {ext.status === "pending" ? "pendiente" :
                         ext.status === "processing" ? "procesando" :
                         ext.status === "done" ? "completado" : "error"}
                      </Badge>
                      <StatusIcon status={ext.status} />
                    </div>
                  </div>
                  {ext.error_message && (
                    <p className="mt-2 text-xs text-red-600 pl-8">{ext.error_message}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      {selectedExtraction && selectedExtraction.status === "done" && (
        <DetailModal
          extraction={selectedExtraction}
          onClose={() => setSelectedExtraction(null)}
          onImprove={() => {
            setImproveTarget(selectedExtraction);
            setSelectedExtraction(null);
          }}
        />
      )}

      {improveTarget && (
        <ImproveModal
          extraction={improveTarget}
          onClose={() => setImproveTarget(null)}
          onUpdated={(updated) => {
            setImproveTarget(null);
            setSelectedExtraction(updated);
            loadData();
          }}
        />
      )}
    </div>
  );
}
